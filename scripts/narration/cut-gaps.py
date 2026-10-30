"""Re-cut a continuous TTS read at the real energy gaps between beats (follows align-full.py).

Whisper midpoints can clip a beat's first or last word. Rule: find the audible runs of the full read (10 ms blocks,
peak >= 300 of 32767). Each beat boundary takes the gap between audible runs nearest the Whisper midpoint (within
0.6 s). A gap of at least 0.1 s is cut at its centre; a shorter one at the quietest 10 ms within +-0.3 s of the
midpoint. Every segment is then checked: audible speech must keep at least 0.02 s clear of both segment edges.
Re-measures each anchor against its new segment start and rewrites the measure JSON in place (the previous one is
kept as `--prev`).

Run (repo root): python3 -I scripts/narration/cut-gaps.py --full out/EP/vo/FULL.wav \
    --measure scripts/EP/short/measure-take1.json --segments out/EP/vo/segments
First used for BLOOP-EP01-SHORT (2026-10-30).
"""
import array, json, shutil, subprocess
from pathlib import Path

FULL = SEG = MEASURE = PREV = None
RATE, THRESHOLD, BLOCK = 48000, 300, 480  # 10 ms


def decode(path):
    out = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-ac', '1', '-ar', str(RATE), '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    s = array.array('h')
    s.frombytes(out)
    return s


def blocks(samples):
    """Per 10 ms block: (peak abs, RMS) of the block."""
    out = []
    for i in range(0, len(samples), BLOCK):
        chunk = samples[i:i + BLOCK]
        peak = max(abs(v) for v in chunk) if chunk else 0
        rms = (sum(v * v for v in chunk) / max(1, len(chunk))) ** 0.5
        out.append((peak, rms))
    return out


def audible_runs(blk):
    runs, start = [], None
    for i, (peak, _) in enumerate(blk):
        if peak >= THRESHOLD:
            if start is None:
                start = i
        elif start is not None:
            runs.append((start, i))
            start = None
    if start is not None:
        runs.append((start, len(blk)))
    return runs


def main():
    global FULL, SEG, MEASURE, PREV
    import argparse
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--full', required=True, help='the continuous TTS read (WAV)')
    ap.add_argument('--measure', required=True, help='measure JSON from align-full.py; rewritten in place')
    ap.add_argument('--segments', required=True, help='output folder for <BEAT>.wav')
    ap.add_argument('--prev', help='where to keep the uncut measure (default: <measure>-v1cut.json)')
    args = ap.parse_args()
    FULL, SEG, MEASURE = Path(args.full), Path(args.segments), Path(args.measure)
    PREV = Path(args.prev) if args.prev else MEASURE.with_name(MEASURE.stem + '-v1cut.json')
    prev = json.loads(MEASURE.read_text(encoding='utf-8'))
    if not PREV.exists():
        shutil.copy(MEASURE, PREV)
    beats = list(prev['beats'].keys())
    samples = decode(FULL)
    total = len(samples) / RATE
    blk = blocks(samples)
    runs = audible_runs(blk)
    # absolute speech bounds per beat from the previous cut (Whisper word times)
    first_on, last_end = {}, {}
    for a in prev['anchors']:
        b = a['beat']
        start_old = prev['beats'][b]['segStart']
        first_on[b] = min(first_on.get(b, 1e9), start_old + a['onRaw'])
        last_end[b] = max(last_end.get(b, 0.0), start_old + a['endRaw'])
    cuts, report = [], []
    for prv, nxt in zip(beats, beats[1:]):
        mid = (last_end[prv] + first_on[nxt]) / 2
        # gaps between audible runs
        gaps = [((runs[i][1]) * 0.01, (runs[i + 1][0]) * 0.01) for i in range(len(runs) - 1)]
        near = [g for g in gaps if abs((g[0] + g[1]) / 2 - mid) <= 0.6 and g[1] - g[0] >= 0.1]
        if near:
            g = min(near, key=lambda g: abs((g[0] + g[1]) / 2 - mid))
            cut = (g[0] + g[1]) / 2
            how = f'gap {g[1] - g[0]:.3f} s centre'
        else:
            lo, hi = int((mid - 0.3) * 100), int((mid + 0.3) * 100)
            lo, hi = max(lo, 0), min(hi, len(blk) - 1)
            k = min(range(lo, hi + 1), key=lambda i: blk[i][1])
            cut = k * 0.01 + 0.005
            how = f'quietest 10 ms (rms {blk[k][1]:.1f})'
        cuts.append(cut)
        report.append(f'{prv}|{nxt}: whisper mid {mid:.3f} s -> cut {cut:.3f} s ({how})')
    bounds = [0.0] + cuts + [total]
    SEG.mkdir(parents=True, exist_ok=True)
    out = {'method': prev['method'] + '; cut at real energy gaps (cut-take2.py)', 'take': 'take2', 'full': prev['full'],
           'matchRatio': prev['matchRatio'], 'beats': {}, 'anchors': [], 'cutRule': report}
    worst = []
    for i, b in enumerate(beats):
        start, end = bounds[i], bounds[i + 1]
        seg = SEG / f'{b}.wav'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(FULL), '-ss', f'{start:.4f}', '-to', f'{end:.4f}', '-ac', '1', '-ar', str(RATE), '-c:a', 'pcm_s16le', str(seg)], check=True)
        s = decode(seg)
        idx = [j for j, v in enumerate(s) if abs(v) >= THRESHOLD]
        on, off = (idx[0] / RATE, (idx[-1] + 1) / RATE) if idx else (0.0, 0.0)
        margin = min(on, (len(s) / RATE) - off)
        worst.append((round(margin, 3), b))
        out['beats'][b] = {**prev['beats'][b], 'segStart': round(start, 4), 'segEnd': round(end, 4),
                           'speechOnRaw': round(on, 4), 'speechOffRaw': round(off, 4), 'edgeMarginSec': round(margin, 3)}
    for a in prev['anchors']:
        b = a['beat']
        abs_on = prev['beats'][b]['segStart'] + a['onRaw']
        abs_end = prev['beats'][b]['segStart'] + a['endRaw']
        out['anchors'].append({**a, 'onRaw': round(abs_on - out['beats'][b]['segStart'], 4),
                               'endRaw': round(abs_end - out['beats'][b]['segStart'], 4)})
    # Whisper stretches a word's end into the next word (B04-a5 "ยักษ์" ended at the B05 "แต่" onset). Clamp every anchor
    # into the energy-measured speech of its segment, and keep each end before the next onset of the same beat.
    clamps = 0
    for b in beats:
        seg = out['beats'][b]
        rows = [a for a in out['anchors'] if a['beat'] == b]
        for i, a in enumerate(rows):
            on = max(a['onRaw'], seg['speechOnRaw'])
            end = min(a['endRaw'], seg['speechOffRaw'])
            if i + 1 < len(rows):
                end = min(end, rows[i + 1]['onRaw'])
            end = max(end, on)
            if (on, end) != (a['onRaw'], a['endRaw']):
                clamps += 1
            a['onRaw'], a['endRaw'] = round(on, 4), round(end, 4)
    out['clampedAnchors'] = clamps
    print(f'clamped anchor times: {clamps}', flush=True)
    MEASURE.write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    for r in report:
        print(r)
    for b in beats:
        print(f"{b}: segment {out['beats'][b]['segStart']:.3f}-{out['beats'][b]['segEnd']:.3f} s, speech {out['beats'][b]['speechOnRaw']:.3f}-{out['beats'][b]['speechOffRaw']:.3f} s, edge margin {out['beats'][b]['edgeMarginSec']:.3f} s")
    print('smallest edge margin:', min(worst))
    bad = [w for w in worst if w[0] < 0.02]
    print('VERIFY', 'FAIL ' + str(bad) if bad else 'OK (every segment keeps >= 0.02 s clear of both edges)')


if __name__ == '__main__':
    main()
