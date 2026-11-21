"""EDU-EP31 voice lock builder: cut one Kore read (out/ep31-voice/narr_raw.wav) into the 12 NARR lines, atempo, place with
the three acted lines (L11 ANCHOR, L13 POLICE, L14 WHEELER), 0.2 s gaps, 2.0 s hold. No API calls, no Whisper: the cut points
are FIXED below (Whisper word times, checked against the energy gaps of the take; a rerun on the same take is identical).
Run (repo root): python3 -I scripts/edu-series/ep31/short/voice-lock-build.py
Env: TEMPO (default 1.05), OUT (default out/ep31-voice), NAME (preview/timing file stem, default 'preview'),
     SKIP (comma list of lines dropped from the timeline, e.g. L07), CAP (gap cap seconds for pauses inside a line, default 0.45)."""
import array, json, os, subprocess, wave
from pathlib import Path
D = Path(os.environ.get('OUT', 'out/ep31-voice')); TEMPO = float(os.environ.get('TEMPO', '1.05')); NAME = os.environ.get('NAME', 'preview')
SKIP = [x for x in os.environ.get('SKIP', '').split(',') if x]; CAP = float(os.environ.get('CAP', '0.45')); GAP, HOLD = 0.2, 2.0
# NARR line -> (cut start, cut end) in seconds of narr_raw.wav; each cut sits inside a silence of the take (checked by silencedetect)
CUTS = {'L01': (0.0, 8.46), 'L02': (8.46, 11.94), 'L03': (11.94, 18.20), 'L04': (18.20, 21.70), 'L05': (21.70, 26.90),
        'L06': (26.90, 29.36), 'L07': (29.36, 32.70), 'L08': (32.70, 37.87), 'L09': (37.87, 42.34), 'L10': (42.58, 45.67),
        'L12': (45.67, 48.40), 'L15': (48.51, 99.0)}
CHAR = {'L11': 'ANCHOR', 'L13': 'POLICE', 'L14': 'WHEELER'}
order = [k for k in sorted(list(CUTS) + list(CHAR)) if k not in SKIP]
w = wave.open(str(D / 'narr_raw.wav')); sr = w.getframerate(); pcm = array.array('h', w.readframes(w.getnframes()))
blk = sr // 100; env = [max(abs(x) for x in pcm[i:i + blk]) for i in range(0, len(pcm), blk)]; T = len(pcm) / sr
# L09|L10 run together: "เนี่ย" ends 42.28 with a -30 dB tail to 42.6, "จน" starts 42.62 (env 85 at 42.60): tail dropped
# long pauses inside a line (memory narration-trim-pauses): raw-take silence (start, end) shortened to CAP seconds
LONGGAP = {'L08': (34.41, 35.39)}
THR = 300
def runs(a, b):
    r = []; j = a
    while j < b:
        if env[j] >= THR:
            s = j
            while j < b and env[j] >= THR: j += 1
            r.append([s, j])
        else: j += 1
    return r
(D / 'lines').mkdir(exist_ok=True); files = {}
for k, (a, b) in CUTS.items():
    b = min(b, T)
    rr = runs(int(a * 100), int(b * 100))
    # drop isolated breaths/blips (< 0.2 s, >= 0.08 s from the next run) at both edges
    while len(rr) > 1 and rr[0][1] - rr[0][0] < 20 and rr[1][0] - rr[0][1] >= 8: rr.pop(0)
    while len(rr) > 1 and rr[-1][1] - rr[-1][0] < 20 and rr[-1][0] - rr[-2][1] >= 8: rr.pop()
    s0, e0 = rr[0][0], rr[-1][1]
    # low-level tails (breath, held vowel, -30 dB): keep 0.12 s after the last block above 1500 (0.08 s before the first)
    last = max(j for j in range(s0, e0) if env[j] > 1500); e0 = min(e0, last + 12)
    first = min(j for j in range(s0, e0) if env[j] > 1500); s0 = max(s0, first - 8)  # and 0.08 s before the first block above 1500
    out = D / 'lines' / f'{k}.wav'
    x0, x1 = s0 / 100 - 0.02, e0 / 100 + 0.04
    if k in LONGGAP and CAP:
        g0, g1 = LONGGAP[k]; h = CAP / 2
        af = f'[0:a]asplit[p][q];[p]atrim={x0:.3f}:{g0 + h:.3f},asetpts=PTS-STARTPTS[a];[q]atrim={g1 - h:.3f}:{x1:.3f},asetpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=0:a=1,atempo={TEMPO}[o]'
        pre, cmd = [], ['-filter_complex', af, '-map', '[o]']
    else:
        pre, cmd = ['-ss', f'{x0:.3f}', '-t', f'{x1 - x0:.3f}'], ['-af', f'atempo={TEMPO}']
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y'] + pre + ['-i', str(D / 'narr_raw.wav')] + cmd + ['-ar', '48000', '-ac', '1', str(out)], check=True)
    files[k] = out
TRIM = 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse'
for k in CHAR:
    out = D / 'lines' / f'{k}.wav'
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(D / ('L13_b.wav' if k == 'L13' else f'{k}.wav')), '-af', TRIM, '-ar', '48000', '-ac', '1', str(out)], check=True)
    files[k] = out
dur = lambda p: float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(p)]))
t = 0.0; table = []
for i, k in enumerate(order):
    d = dur(files[k]); table.append({'line': k, 'who': CHAR.get(k, 'NARR'), 'start': round(t, 2), 'end': round(t + d, 2), 'dur': round(d, 2)})
    t += d + (GAP if i < len(order) - 1 else HOLD)
inputs = []; fc = []
for i, k in enumerate(order):
    inputs += ['-i', str(files[k])]; fc.append(f'[{i}:a]apad=pad_dur={GAP if i < len(order) - 1 else HOLD}[a{i}]')
fc.append(''.join(f'[a{i}]' for i in range(len(order))) + f'concat=n={len(order)}:v=0:a=1[o]')
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y'] + inputs + ['-filter_complex', ';'.join(fc), '-map', '[o]', str(D / f'{NAME}.wav')], check=True)
json.dump({'tempo': TEMPO, 'skip': SKIP, 'lines': table, 'total': round(t, 2)}, open(D / f'{NAME}.json', 'w'), indent=1)
for r in table: print(r['line'], r['who'], r['start'], r['end'], r['dur'])
print('total', round(t, 2), 'preview', round(dur(D / f'{NAME}.wav'), 2))
