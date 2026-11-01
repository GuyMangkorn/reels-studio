"""WFOG-EP01-SHORT narration: verbatim check, per-line TTS with the voice-tuning presets, measurement and placement.

Usage (run from the repository root):
  python3 -I scripts/world-fog/narration.py verify
  python3 -I scripts/world-fog/narration.py tts [--only VO-01,VO-02] [--force]
  python3 -I scripts/world-fog/narration.py tts --take 2 --only VO-01        (Gemini take -> lines/takes/)
  python3 -I scripts/world-fog/narration.py pick --take 2 --only VO-01      (take -> lines/<id>.wav)
  python3 -I scripts/world-fog/narration.py measure
  python3 -I scripts/world-fog/narration.py compose
Gemini run: zsh -lic 'python3 -I scripts/world-fog/narration.py tts ...' (loads GEMINI_API_KEY per run; needs out/gemini-venv).

Manifest: scripts/world-fog/short/narration-lines.json (one entry per spoken line; text verbatim from WFOG-SCRIPT-R5).
- tts: voices with `engine: gemini` (narrator Sulafat, worker Orus) get the line's `style` plus the speaker's `pace`;
  `tts_split` gives the TTS pieces of a line (VO-03a/VO-03b). Other voices go through scripts/voice-preset.py (edge-tts
  + ffmpeg loudnorm to -16 LUFS; elder-woman needs out/voice-venv). Clips land in
  out/editor/world-fog/WFOG-EP01-SHORT/lines/<id>.wav (ignored).
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
PLACEMENT = ROOT / 'scripts/world-fog/short/placement.json'
CAPTIONS = ROOT / 'scripts/world-fog/short/captions.json'


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
    P = load_placement()
    by_line = {}
    for c in P['captions']:
        by_line.setdefault(c['line'], []).append(c['text'].replace('\n', ' '))
    for line in m['lines']:
        if ' '.join(by_line.get(line['id'], [])) != line['text']:
            bad += 1
            print(f"CAPTION MISMATCH {line['id']}: caption text does not join to the line")
    for c in P['clips']:
        if not (OUT / 'lines' / c['file']).exists():
            bad += 1
            print(f"MISSING CLIP {c['file']}")
    print(f"placement: {len(P['clips'])} clips, {len(P['captions'])} caption cues, {P['frames']} frames")
    return 1 if bad else 0


GEMINI_PY = ROOT / 'out/gemini-venv/bin/python'
TAKES = OUT / 'lines' / 'takes'


def gemini_say(voice, style, text, clip):
    # Callers run this module under `zsh -lic` so GEMINI_API_KEY is read per run; the perl alarm stops the SDK's
    # silent 429 retry loop, and nothing is retried here (a retry spends the daily quota).
    cmd = ['perl', '-e', 'alarm 90; exec @ARGV', str(GEMINI_PY), '-I', 'scripts/gemini-tts.py', 'say',
           '--voice', voice, '--style', style, '--text', text, str(clip)]
    result = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)
    if result.returncode != 0 or not clip.exists():
        raise SystemExit(f"{clip.name}: Gemini failed (rc {result.returncode}); 429 = quota, stop and report. {result.stderr.strip()[-200:]}")


def cmd_tts(m, only, force, take=0):
    (OUT / 'lines').mkdir(parents=True, exist_ok=True)
    for line in m['lines']:
        if only and line['id'] not in only:
            continue
        voice = m['voices'][line['speaker']]
        if voice.get('engine') == 'gemini':
            TAKES.mkdir(parents=True, exist_ok=True)
            for piece in line.get('tts_split') or [dict(id=line['id'], text=line['text'], style=line['style'])]:
                clip = TAKES / f"{piece['id']}.t{take}.wav" if take else OUT / 'lines' / f"{piece['id']}.wav"
                if clip.exists() and not force:
                    print(f"{piece['id']}: exists (use --force to regenerate)")
                    continue
                gemini_say(voice['voice'], f"{piece['style']}, {voice['pace']}", piece['text'], clip)
                print(f"{piece['id']}: gemini {voice['voice']} -> {clip.relative_to(ROOT)}", flush=True)
            continue
        if take:
            continue  # takes are Gemini-only
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


def cmd_pick(m, only, take):
    # Copies the chosen take to lines/<id>.wav (what compose reads) and records it in lines/takes/picks.json (ignored).
    if not take:
        raise SystemExit('pick needs --take K')
    picks_file = TAKES / 'picks.json'
    picks = json.loads(picks_file.read_text()) if picks_file.exists() else {}
    for line in m['lines']:
        if line['id'] not in only:
            continue
        for cid in [p['id'] for p in line['tts_split']] if line.get('tts_split') else [line['id']]:
            src = TAKES / f"{cid}.t{take}.wav"
            if not src.exists():
                raise SystemExit(f"{src.name} missing: run tts --take {take} --only {line['id']} first")
            shutil.copyfile(src, OUT / 'lines' / f"{cid}.wav")
            picks[cid] = take
            print(f"{cid}: take {take} -> {(OUT / 'lines' / f'{cid}.wav').relative_to(ROOT)}")
    picks_file.write_text(json.dumps(picks, indent=1) + '\n')


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
        for cid in [p['id'] for p in line['tts_split']] if line.get('tts_split') else [line['id']]:
            clip = OUT / 'lines' / f"{cid}.wav"
            if not clip.exists():
                print(f"{cid}: missing clip, run tts first")
                continue
            r = measure_clip(decode(clip))
            results[cid] = r
            if cid == line['id'] and line.get('planned'):
                p0, p1 = planned_span(line)
                plan = f"{p0:>6}-{p1:<6}"
                plen = f"{p1 - p0:8d}"
            elif cid == line['id']:  # line with no planned window yet (VO-17 until Mark's retime)
                plan, plen = f"{'pending':>13}", f"{'-':>8}"
            else:  # VO-03 TTS piece: the SS-R4.1 span covers both pieces; SS-R5 windows are in the Editor r3 notes
                plan, plen = f"{'split':>13}", f"{'-':>8}"
            segs = ' '.join(f"{a:.2f}-{b:.2f}" for a, b in r['speech_segments'])
            print(f"{cid:6} {line['speaker']:12} {r['clip_sec']:6.2f} {r['speech']:6.2f} {r['onset']:6.2f} {plan} {plen} {len(r['speech_segments']):4d}  {segs}")
    (OUT / 'timing').mkdir(parents=True, exist_ok=True)
    (OUT / 'timing/tts-measure.json').write_text(json.dumps(results, ensure_ascii=False, indent=1) + '\n')
    print(f"wrote {(OUT / 'timing/tts-measure.json').relative_to(ROOT)}")


def filtered(clip, af, dest):
    if not af:
        return clip
    subprocess.run([FFMPEG, '-v', 'error', '-y', '-i', str(clip), '-af', af, '-ar', str(SR), '-ac', '1', str(dest)], check=True)
    return dest


def load_placement():
    return json.loads(PLACEMENT.read_text(encoding='utf-8'))


def cmd_compose(m):
    """Places every clip of placement.json: file frame `from` (default 0) goes to composition frame `at` (the cue table's
    clip start G), with the line gain (manifest) and the clip's level correction (`levelDb`, alimiter at -1.5 dBTP)."""
    P = load_placement()
    total = P['frames'] * SR // FPS
    buf = array.array('h', [0]) * total
    gains = {l['id']: l.get('gain', 1.0) for l in m['lines']}
    tmp = OUT / 'timing' / 'filtered'
    tmp.mkdir(parents=True, exist_ok=True)
    ramp = SR // 100
    placed = {}
    for c in P['clips']:
        src = OUT / 'lines' / c['file']
        af = f"volume={c['levelDb']}dB,alimiter=limit=0.84:level=disabled" if c.get('levelDb') else None
        samples = decode(filtered(src, af, tmp / f"{c['id']}.wav"))
        a = c.get('from', 0) * SR // FPS
        b = c['to'] * SR // FPS if 'to' in c else len(samples)
        clip_samples = samples[a:b]
        start = c['at'] * SR // FPS
        if start + len(clip_samples) > total:
            raise SystemExit(f"{c['id']}: runs past the composition end")
        gain = gains[c['line']]
        n = len(clip_samples)
        for i, v in enumerate(clip_samples):
            w = min(1.0, i / ramp, (n - 1 - i) / ramp)
            buf[start + i] = max(-32768, min(32767, buf[start + i] + round(v * gain * w)))
        audible = [i for i, v in enumerate(clip_samples) if abs(v) >= THRESH]
        on = round(c['at'] + audible[0] * FPS / SR, 1) if audible else None
        off = round(c['at'] + (audible[-1] + 1) * FPS / SR, 1) if audible else None
        placed[c['id']] = {'at': c['at'], 'speechStartG': on, 'speechEndG': off, 'gain': gain, 'levelDb': c.get('levelDb', 0)}
        print(f"{c['id']:7} at {c['at']:5d}  speech {on}-{off} G  level {c.get('levelDb', 0):+.1f} dB  gain {gain}", flush=True)
    NARRATION_MP3.parent.mkdir(parents=True, exist_ok=True)
    raw_path = OUT / 'timing/narration.s16le'
    raw_path.write_bytes(buf.tobytes())
    subprocess.run([FFMPEG, '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', str(raw_path), '-c:a', 'libmp3lame', '-b:a', '192k', str(NARRATION_MP3)], check=True)
    delivered = decode(NARRATION_MP3)
    rms = []
    for i in range(0, P['frames'] * BLOCK, BLOCK):
        chunk = delivered[i:i + BLOCK]
        rms.append(math.sqrt(sum(v * v for v in chunk) / max(1, len(chunk))) if len(chunk) else 0.0)
    peak = max(rms) or 1
    AMPLITUDE.write_text(json.dumps([round(v / peak, 4) for v in rms]) + '\n')
    (OUT / 'timing').mkdir(parents=True, exist_ok=True)
    (OUT / 'timing/placement.json').write_text(json.dumps(placed, ensure_ascii=False, indent=1) + '\n')
    print(f"wrote {NARRATION_MP3.relative_to(ROOT)} ({len(delivered) / SR:.2f} s), {AMPLITUDE.relative_to(ROOT)} ({len(rms)} frames), timing/placement.json")


def cmd_captions(m):
    """captions.json: every caption cue in composition frames (g0, g1; half-open), text as displayed. A '\\n' in the text is an
    authored line break (the plate height follows the line count in the episode file)."""
    P = load_placement()
    cues = [dict(id=c['id'], line=c['line'], g0=c['g0'], g1=c['g1'], text=c['text']) for c in P['captions']]
    out = {'episode': EP, 'fps': FPS, 'frames': P['frames'], 'cues': cues}
    CAPTIONS.write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f"captions: {len(cues)} cues -> {CAPTIONS.relative_to(ROOT)}")
    for c in cues:
        print(f"{c['id']:8} {c['g0']:5d}-{c['g1']:5d} {c['g1'] - c['g0']:4d}f {c['text'].replace(chr(10), ' / ')}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('cmd', choices=['verify', 'tts', 'pick', 'measure', 'compose', 'captions'])
    ap.add_argument('--only', default='')
    ap.add_argument('--force', action='store_true')
    ap.add_argument('--take', type=int, default=0, help='Gemini take number (tts writes lines/takes/<id>.t<K>.wav; pick copies one)')
    a = ap.parse_args()
    m = load_manifest()
    only = {x for x in a.only.split(',') if x}
    if a.cmd == 'verify':
        sys.exit(cmd_verify(m))
    if a.cmd == 'tts':
        cmd_tts(m, only, a.force, a.take)
    elif a.cmd == 'pick':
        cmd_pick(m, only, a.take)
    elif a.cmd == 'measure':
        cmd_measure(m)
    elif a.cmd == 'compose':
        cmd_compose(m)
    elif a.cmd == 'captions':
        cmd_captions(m)


if __name__ == '__main__':
    main()
