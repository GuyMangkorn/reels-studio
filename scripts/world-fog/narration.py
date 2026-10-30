"""WFOG-EP01-SHORT narration: verbatim check, per-line TTS with the voice-tuning presets, measurement and placement.

Usage (run from the repository root):
  python3 -I scripts/world-fog/narration.py verify
  python3 -I scripts/world-fog/narration.py tts [--only VO-01,VO-02] [--force]
  python3 -I scripts/world-fog/narration.py measure
  python3 -I scripts/world-fog/narration.py compose

Manifest: scripts/world-fog/short/narration-lines.json (one entry per spoken line; text verbatim from WFOG-SCRIPT-R5).
- tts: each line goes through scripts/voice-preset.py (edge-tts + ffmpeg loudnorm to -16 LUFS; elder-woman needs
  out/voice-venv). Clips land in out/editor/world-fog/WFOG-EP01-SHORT/lines/<id>.wav (ignored).
- measure: onset/offset, speech length and silent runs >= 0.12 s inside speech, per clip -> timing/tts-measure.json.
- compose: places each clip so its first audible sample sits on `startG` (composition frame), applies the per-line
  gain (EP08a voice level, baked into the narration file; the runtime has no per-scene narration gain) and the
  optional `af` filter, writes public/narration/WFOG-EP01-SHORT.mp3 (ignored) and the committed amplitude JSON
  beside the timeline (30 fps RMS per 1600 samples, normalized to the peak, as scripts/narration.py does).
"""
import argparse
import array
import json
import math
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
EP = 'WFOG-EP01-SHORT'
MANIFEST = ROOT / 'scripts/world-fog/short/narration-lines.json'
SCRIPT_MD = ROOT / 'scripts/world-fog/short/script.md'
AMPLITUDE = ROOT / f'scripts/world-fog/short/{EP}.amplitude.json'
OUT = ROOT / f'out/editor/world-fog/{EP}'
NARRATION_MP3 = ROOT / f'public/narration/{EP}.mp3'
FFMPEG = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'
FFPROBE = shutil.which('ffprobe') or '/opt/homebrew/bin/ffprobe'
VENV_PY = ROOT / 'out/voice-venv/bin/python'
SR, FPS, BLOCK, THRESH = 48000, 30, 1600, 300
TOTAL_FRAMES = 3000


def load_manifest():
    return json.loads(MANIFEST.read_text())


def cmd_verify(m):
    quotes = {line[2:].strip() for line in SCRIPT_MD.read_text().splitlines() if line.startswith('> ')}
    bad = 0
    for line in m['lines']:
        ok_text = line['text'] in quotes
        ok_pieces = ' '.join(line['pieces']) == line['text']
        if not (ok_text and ok_pieces):
            bad += 1
            print(f"MISMATCH {line['id']}: in script={ok_text} pieces-join={ok_pieces}")
    print(f"verify: {len(m['lines']) - bad}/{len(m['lines'])} lines verbatim in {SCRIPT_MD.name} blockquotes; caption pieces join to the text")
    return 1 if bad else 0


def cmd_tts(m, only, force):
    (OUT / 'lines').mkdir(parents=True, exist_ok=True)
    for line in m['lines']:
        if only and line['id'] not in only:
            continue
        voice = m['voices'][line['speaker']]
        clip = OUT / 'lines' / f"{line['id']}.wav"
        if clip.exists() and not force:
            print(f"{line['id']}: exists (use --force to regenerate)")
            continue
        if voice['preset'] == 'elder-woman':
            cmd = [str(VENV_PY), '-I', 'scripts/voice-preset.py', '--preset', voice['preset'], '--text', line['text'], str(clip)]
        else:
            cmd = [sys.executable, '-I', 'scripts/voice-preset.py', '--preset', voice['preset'], '--text', line['text'], str(clip), '--rate', voice['rate']]
        for attempt in range(3):
            result = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)
            if result.returncode == 0 and clip.exists():
                break
            print(f"{line['id']}: attempt {attempt + 1} failed: {result.stderr.strip().splitlines()[-1:]}", flush=True)
            time.sleep(3)
        else:
            raise SystemExit(f"{line['id']}: TTS failed")
        print(f"{line['id']}: {voice['preset']} -> {clip.relative_to(ROOT)}", flush=True)


def decode(path):
    raw = subprocess.run([FFMPEG, '-v', 'error', '-i', str(path), '-ac', '1', '-ar', str(SR), '-c:a', 'pcm_s16le', '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    samples = array.array('h')
    samples.frombytes(raw)
    return samples


def measure_clip(samples):
    idx = [i for i, v in enumerate(samples) if abs(v) >= THRESH]
    if not idx:
        return {'onset': 0.0, 'offset': 0.0, 'speech': 0.0}
    onset, offset = idx[0], idx[-1] + 1
    runs, start = [], None
    minimum = SR * 12 // 100
    for i in range(onset, offset):
        if abs(samples[i]) < THRESH:
            if start is None:
                start = i
        elif start is not None:
            if i - start >= minimum:
                runs.append([round(start / SR, 3), round(i / SR, 3)])
            start = None
    segments, seg_start, prev = [], onset, onset
    for a, b in runs:
        segments.append([round(seg_start / SR, 3), round(a * SR / SR, 3)])
        seg_start = int(b * SR)
    segments.append([round(seg_start / SR, 3), round(offset / SR, 3)])
    peak = max(abs(v) for v in samples) or 1
    rms = math.sqrt(sum(v * v for v in samples[onset:offset]) / max(1, offset - onset)) or 1
    return {'clip_sec': round(len(samples) / SR, 3), 'onset': round(onset / SR, 3), 'offset': round(offset / SR, 3),
            'speech': round((offset - onset) / SR, 3), 'silent_runs_ge_0.12s': runs, 'speech_segments': segments,
            'peak_dbfs': round(20 * math.log10(peak / 32768), 1), 'speech_rms_dbfs': round(20 * math.log10(rms / 32768), 1)}


def planned_span(line):
    return line['planned'][0][0], line['planned'][-1][1]


def cmd_measure(m):
    results = {}
    print(f"{'id':6} {'speaker':12} {'clip':>6} {'speech':>6} {'onset':>6} {'plan_span':>13} {'plan_len':>8} {'segs':>4}  segments(s)")
    for line in m['lines']:
        clip = OUT / 'lines' / f"{line['id']}.wav"
        if not clip.exists():
            print(f"{line['id']}: missing clip, run tts first")
            continue
        r = measure_clip(decode(clip))
        results[line['id']] = r
        p0, p1 = planned_span(line)
        segs = ' '.join(f"{a:.2f}-{b:.2f}" for a, b in r['speech_segments'])
        print(f"{line['id']:6} {line['speaker']:12} {r['clip_sec']:6.2f} {r['speech']:6.2f} {r['onset']:6.2f} {p0:>6}-{p1:<6} {p1 - p0:8d} {len(r['speech_segments']):4d}  {segs}")
    (OUT / 'timing').mkdir(parents=True, exist_ok=True)
    (OUT / 'timing/tts-measure.json').write_text(json.dumps(results, ensure_ascii=False, indent=1) + '\n')
    print(f"wrote {(OUT / 'timing/tts-measure.json').relative_to(ROOT)}")


def filtered(clip, af, dest):
    if not af:
        return clip
    subprocess.run([FFMPEG, '-v', 'error', '-y', '-i', str(clip), '-af', af, '-ar', str(SR), '-ac', '1', str(dest)], check=True)
    return dest


def cmd_compose(m):
    total = TOTAL_FRAMES * SR // FPS
    buf = array.array('h', [0]) * total
    placed, ends = {}, []
    tmp = OUT / 'timing' / 'filtered'
    tmp.mkdir(parents=True, exist_ok=True)
    for line in sorted(m['lines'], key=lambda x: x['startG']):
        if 'startG' not in line:
            raise SystemExit(f"{line['id']}: no startG in manifest")
        raw = decode(OUT / 'lines' / f"{line['id']}.wav")
        clip = filtered(OUT / 'lines' / f"{line['id']}.wav", line.get('af'), tmp / f"{line['id']}.wav")
        samples = decode(clip) if clip != OUT / 'lines' / f"{line['id']}.wav" else raw
        onset = next((i for i, v in enumerate(samples) if abs(v) >= THRESH), 0)
        pre = min(onset, SR * 3 // 100)  # keep 30 ms before the first audible sample; startG is that sample
        clip_samples = samples[onset - pre:]
        ramp = SR // 100
        gain = line.get('gain', 1.0)
        start = line['startG'] * SR // FPS - pre
        end = start + len(clip_samples)
        if end > total:
            raise SystemExit(f"{line['id']}: runs past the composition end")
        for i, v in enumerate(clip_samples):
            w = min(1.0, i / ramp, (len(clip_samples) - 1 - i) / ramp)
            buf[start + i] = max(-32768, min(32767, buf[start + i] + round(v * gain * w)))
        last = max(i for i, v in enumerate(samples) if abs(v) >= THRESH)
        ends.append((line['id'], start, start + (last - (onset - pre)) + 1))
        placed[line['id']] = {'startG': line['startG'], 'speechStartG': round((start) * FPS / SR, 2),
                              'endG': round(end * FPS / SR, 2), 'gain': gain, 'af': line.get('af')}
    for (a, s0, e0), (b, s1, e1) in zip(sorted(ends, key=lambda x: x[1]), sorted(ends, key=lambda x: x[1])[1:]):
        if e0 > s1:
            print(f"speech overlap {a} into {b} by {(e0 - s1) * FPS / SR:.1f} frames", flush=True)
        else:
            print(f"ok {a} speech ends {e0 * FPS / SR:.1f}G, {b} starts {s1 * FPS / SR:.1f}G", flush=True)
    NARRATION_MP3.parent.mkdir(parents=True, exist_ok=True)
    raw_path = OUT / 'timing/narration.s16le'
    raw_path.write_bytes(buf.tobytes())
    subprocess.run([FFMPEG, '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', str(raw_path), '-c:a', 'libmp3lame', '-b:a', '192k', str(NARRATION_MP3)], check=True)
    delivered = decode(NARRATION_MP3)
    rms = []
    for i in range(0, TOTAL_FRAMES * BLOCK, BLOCK):
        chunk = delivered[i:i + BLOCK]
        rms.append(math.sqrt(sum(v * v for v in chunk) / max(1, len(chunk))) if len(chunk) else 0.0)
    peak = max(rms) or 1
    AMPLITUDE.write_text(json.dumps([round(v / peak, 4) for v in rms]) + '\n')
    (OUT / 'timing/placement.json').write_text(json.dumps(placed, ensure_ascii=False, indent=1) + '\n')
    print(f"wrote {NARRATION_MP3.relative_to(ROOT)} ({len(delivered) / SR:.2f} s), {AMPLITUDE.relative_to(ROOT)} ({len(rms)} frames), placement.json")


SHOT_STARTS = [('S01-SH01', 0), ('S01-SH02', 126), ('S02-SH01', 240), ('S02-SH02', 354), ('S02-SH03', 444), ('S02-SH04', 540), ('S02-SH05', 738), ('S02-SH06', 792), ('S02-SH07', 900), ('S02-SH08', 1029), ('S02-SH09', 1230), ('S02-SH10', 1410), ('S03-SH01', 1530), ('S03-SH02', 1656), ('S03-SH03', 1800), ('S03-SH04', 1920), ('S03-SH05', 1962), ('S03-SH06', 2034), ('S03-SH06A', 2070), ('S03-SH07', 2190), ('S04-SH01', 2340), ('S04-SH02', 2670), ('S04-SH03', 2790)]
SCENE_STARTS = {'S01': 0, 'S02': 240, 'S03': 1530, 'S04': 2340}


def piece_intervals(line, measured):
    """Caption piece intervals [a, b) in composition frames, from the placement. Measured speech segments map 1:1 onto
    pieces when counts match; otherwise each piece takes a share of the speech in proportion to its Thai characters."""
    onset, speech = measured['onset'], measured['speech']
    L = round(speech * FPS)
    start = line['startG']
    segs = measured['speech_segments']
    if len(segs) == len(line['pieces']):
        return [(start + round((a - onset) * FPS), start + round((b - onset) * FPS)) for a, b in segs]
    weights = [len([c for c in piece if c not in ' …?!,.']) for piece in line['pieces']]
    total, t, out = sum(weights), 0, []
    for w in weights:
        d = round(L * w / total)
        out.append((start + t, start + t + d))
        t += d
    out[-1] = (out[-1][0], start + L)
    return out


def shot_of(g):
    name = None
    for sid, g0 in SHOT_STARTS:
        if g >= g0:
            name = (sid, g0)
    return name


def cmd_captions(m):
    measures = json.loads((OUT / 'timing/tts-measure.json').read_text())
    cues, talk = [], {}
    for line in m['lines']:
        ivs = piece_intervals(line, measures[line['id']])
        for k, (text, (a, b)) in enumerate(zip(line['pieces'], ivs)):
            cues.append({'id': f"{line['id']}-{k + 1}", 'line': line['id'], 'startG': a, 'endG': b, 'text': text})
        if line.get('camera'):
            talk.setdefault(line['camera'], []).extend([(a, b) for a, b in ivs])
    cues.sort(key=lambda c: c['startG'])
    scenes = []
    for scene in ['S01', 'S02', 'S03', 'S04']:
        g0 = SCENE_STARTS[scene]
        g1 = {'S01': 240, 'S02': 1530, 'S03': 2340, 'S04': 3000}[scene]
        rows = [c for c in cues if g0 <= c['startG'] < g1]
        sub, t = [], g0
        for c in rows:
            if c['startG'] > t:
                sub.append({'atSec': round((t - g0) / FPS, 4), 'text': ''})
            sub.append({'atSec': round((c['startG'] - g0) / FPS, 4), 'text': c['text']})
            t = c['endG']
        if t < g1:
            sub.append({'atSec': round((t - g0) / FPS, 4), 'text': ''})
        if not sub or sub[0]['atSec'] != 0:
            sub.insert(0, {'atSec': 0, 'text': ''})
        scenes.append({'scene': scene, 'durationSec': (g1 - g0) / FPS, 'subtitleCues': sub})
    out = {'episode': EP, 'fps': FPS, 'cues': cues, 'scenes': scenes}
    (ROOT / 'scripts/world-fog/short/captions.json').write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n')
    (OUT / 'timing/caption-timeline.json').write_text(json.dumps([{'durationSec': s['durationSec'], 'subtitleCues': s['subtitleCues']} for s in scenes], ensure_ascii=False, indent=1) + '\n')
    print(f"captions: {len(cues)} cues; wrote scripts/world-fog/short/captions.json and {(OUT / 'timing/caption-timeline.json').relative_to(ROOT)}")
    for c in cues:
        print(f"{c['id']:7} {c['startG']:5d}-{c['endG']:5d} {(c['endG'] - c['startG']):3d}f {shot_of(c['startG'])[0]:10} {c['text']}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('cmd', choices=['verify', 'tts', 'measure', 'compose', 'captions'])
    ap.add_argument('--only', default='')
    ap.add_argument('--force', action='store_true')
    a = ap.parse_args()
    m = load_manifest()
    if a.cmd == 'verify':
        sys.exit(cmd_verify(m))
    if a.cmd == 'tts':
        cmd_tts(m, {x for x in a.only.split(',') if x}, a.force)
    elif a.cmd == 'measure':
        cmd_measure(m)
    elif a.cmd == 'compose':
        cmd_compose(m)
    elif a.cmd == 'captions':
        cmd_captions(m)


if __name__ == '__main__':
    main()
