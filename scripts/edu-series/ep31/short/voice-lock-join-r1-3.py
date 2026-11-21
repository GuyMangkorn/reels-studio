"""EDU-EP31 VOICE-R1.3 join (user chose L01 candidate c1, 2026-11-21): rebuild the narration from the locked per-line files
(out/ep31-voice/lines/L01..L15.wav, store ep31-voice-r1-1) with L01 replaced by the c1 take (out/ep31-voice-r2/lines/L01_c1.wav,
store ep31-voice-r1-2). L01 is padded with silence to the old L01 file length (368084 samples = 7.668 s, the old 2-frame tail pad
included) so L02..L15 start where they did and the total stays 1795 f. Gaps 0.2 s, hold 2.0 s, as voice-lock-build.py.
Run (repo root): python3 -I scripts/edu-series/ep31/short/voice-lock-join-r1-3.py [--check-r1]   (--check-r1 rebuilds with the old L01 and compares to preview.wav)
Writes out/ep31-voice-r1-3/{preview.wav,timing.json,lines/}."""
import json, subprocess, sys, shutil
from pathlib import Path
old, new = Path('out/ep31-voice'), Path('out/ep31-voice-r1-3'); c1 = Path('out/ep31-voice-r2/lines/L01_c1.wav')
CHECK = '--check-r1' in sys.argv
D = new / ('check' if CHECK else '.'); (D / 'lines').mkdir(parents=True, exist_ok=True)
SR = 48000
L01_SAMPLES = int(subprocess.check_output(['ffprobe', '-v', 'error', '-count_packets', '-show_entries', 'stream=duration_ts', '-of', 'csv=p=0', str(old / 'lines/L01.wav')]))
order = [f'L{i:02d}' for i in range(1, 16)]
files = {k: old / 'lines' / f'{k}.wav' for k in order}
if not CHECK:
    out = D / 'lines' / 'L01.wav'
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(c1), '-af', f'apad=whole_len={L01_SAMPLES}', '-ar', str(SR), '-ac', '1', str(out)], check=True)
    files['L01'] = out
    for k in order[1:]: shutil.copyfile(old / 'lines' / f'{k}.wav', D / 'lines' / f'{k}.wav')
dur = lambda p: float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(p)]))
who = {'L11': 'ANCHOR', 'L13': 'POLICE', 'L14': 'WHEELER'}; t = 0.0; table = []
for i, k in enumerate(order):
    d = dur(files[k]); table.append({'line': k, 'who': who.get(k, 'NARR'), 'start': round(t, 2), 'end': round(t + d, 2), 'dur': round(d, 2)})
    t += d + (0.2 if i < 14 else 2.0)
inputs = []; fc = []
for i, k in enumerate(order):
    inputs += ['-i', str(files[k])]; fc.append(f'[{i}:a]apad=pad_dur={0.2 if i < 14 else 2.0}[a{i}]')
fc.append(''.join(f'[a{i}]' for i in range(15)) + 'concat=n=15:v=0:a=1[o]')
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y'] + inputs + ['-filter_complex', ';'.join(fc), '-map', '[o]', '-ar', str(SR), str(D / 'preview.wav')], check=True)
json.dump({'tempo': 1.05, 'skip': [], 'lines': table, 'total': round(t, 2)}, open(D / 'timing.json', 'w'), indent=1)
print('L01 samples', L01_SAMPLES, 'total', round(t, 3), 'preview', round(dur(D / 'preview.wav'), 3))
