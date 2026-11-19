"""EDU-EP30-VOICE-R2.2 builder (script R2.2): VOICE-R2.1 with the silent mime slots tightened (user, 2026-11-19): L07 2.28 -> 1.50 s, L15 1.13 -> 0.90 s by removing silence at the slot end.
Base: voice-lock-build-r2-1.py. Reads the R2.1 line files from store projects/edu/EDU/narration/ep30-voice-r2-1/lines (no API calls, every other file copied
unchanged), same order, 0.2 s gaps, 2.0 s hold. Writes out/ep30-voice-r2-2/{lines/,preview.wav,timing.json}.
Run from the checkout root: python3 -I scripts/edu-series/ep30/short/voice-lock-build-r2-2.py ; then VO_DIR=out/ep30-voice-r2-2 python3 -I .../vo-anchors.py"""
import json, os, shutil, subprocess
from pathlib import Path
R2 = Path(os.environ.get('REELS_STORE', os.path.expanduser('~/ReelsStore'))) / 'projects/edu/EDU/narration/ep30-voice-r2-1'
O = Path('out/ep30-voice-r2-2'); (O / 'lines').mkdir(parents=True, exist_ok=True)
GAP, HOLD, MIME = 0.2, 2.0, {'L07': 1.50, 'L15': 0.90}
dur = lambda p: float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(p)]))
old = json.load(open(R2 / 'timing.json'))
files = {}; table = []; t = 0.0; lines = old['lines']
for i, l in enumerate(lines):
    k = l['line']; src = R2 / 'lines' / f'{k}.wav'; out = O / 'lines' / f'{k}.wav'
    if k in MIME:
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','lavfi','-i','anullsrc=r=48000:cl=mono','-t',f'{MIME[k]:.6f}','-c:a','pcm_s16le',str(out)], check=True)
    else: shutil.copyfile(src, out)
    files[k] = out; d = dur(out)
    table.append({'line': k, 'who': l['who'], 'start': round(t, 2), 'end': round(t + d, 2), 'dur': round(d, 2), **({'mime': True} if k in MIME else {})})
    t += d + (GAP if i < len(lines) - 1 else HOLD)
inputs = []; fc = []
for i, l in enumerate(lines):
    inputs += ['-i', str(files[l['line']])]; fc.append(f'[{i}:a]apad=pad_dur={GAP if i < len(lines) - 1 else HOLD}[a{i}]')
fc.append(''.join(f'[a{i}]' for i in range(len(lines))) + f'concat=n={len(lines)}:v=0:a=1[o]')
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y'] + inputs + ['-filter_complex', ';'.join(fc), '-map', '[o]', str(O / 'preview.wav')], check=True)
json.dump({'rev': 'R2.2', 'tempo': 1.05, 'lines': table, 'total': round(t, 2)}, open(O / 'timing.json', 'w'), indent=1)
for r in table: print(r['line'], r['who'], r['start'], r['end'], r['dur'], 'mime' if r.get('mime') else '')
print('total', round(t, 2), 'preview', dur(O / 'preview.wav'))
