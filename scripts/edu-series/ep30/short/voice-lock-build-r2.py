"""EDU-EP30-VOICE-R2 builder (script R2.1): assemble the 18 R2.1 lines from existing takes, no new API calls.
NARR L01-L04, L06, L09, L10, L12-L14 = the R1 Kore cuts (retired L05, L08, L11 simply dropped: each was its own cut);
NARR L16-L18 = take D re-read (store samples/ep30/r2-lines); FARMER L03, EMU L07/L15 = R1 takes; MEREDITH L22 Alnilam,
GUNNER L23 Umbriel, EMU L19_a/L21_a Puck = store samples/ep30/w4-char (user picks 2026-11-19).
Character takes get leading/trailing silence trimmed (-45 dB, like R1). Gaps 0.2 s, 2.0 s hold after the last line.
Run from the checkout root: python3 -I scripts/edu-series/ep30/short/voice-lock-build-r2.py  (needs out/ep30-voice/ from R1 and $REELS_STORE)
Writes out/ep30-voice-r2/{lines/,preview.wav,timing.json}; then VO_DIR=out/ep30-voice-r2 python3 -I .../vo-anchors.py"""
import json, os, subprocess
from pathlib import Path
S = Path(os.environ.get('REELS_STORE', os.path.expanduser('~/ReelsStore'))) / 'projects/edu/EDU/samples/ep30'
R1 = Path('out/ep30-voice/lines'); O = Path('out/ep30-voice-r2'); (O / 'lines').mkdir(parents=True, exist_ok=True)
GAP, HOLD = 0.2, 2.0
TAIL_CUT = {'L13': 0.10}  # seconds cut from the file end: R1 cut tail carried a 40 ms noise tick (about -28 dBFS) after the word ended
TRIM = 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse'
order = [('L01','NARR',R1/'L01.wav',0),('L02','NARR',R1/'L02.wav',0),('L03','FARMER',R1/'L03.wav',0),('L04','NARR',R1/'L04.wav',0),
 ('L19','EMU',S/'w4-char/EMU_puck_L19_a.wav',1),('L22','MEREDITH',S/'w4-char/MEREDITH_alnilam_L22.wav',1),('L06','NARR',R1/'L06.wav',0),
 ('L07','EMU',R1/'L07.wav',0),('L09','NARR',R1/'L09.wav',0),('L10','NARR',R1/'L10.wav',0),('L23','GUNNER',S/'w4-char/GUNNER_umbriel_L23.wav',1),
 ('L12','NARR',R1/'L12.wav',0),('L13','NARR',R1/'L13.wav',0),('L21','EMU',S/'w4-char/EMU_puck_L21_a.wav',1),('L14','NARR',R1/'L14.wav',0),
 ('L15','EMU',R1/'L15.wav',0),('L16','NARR',S/'r2-lines/L16.wav',0),('L17','NARR',S/'r2-lines/L17.wav',0),('L18','NARR',S/'r2-lines/L18.wav',0)]
dur = lambda p: float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(p)]))
files = {}; t = 0.0; table = []
for i, (k, who, src, trim) in enumerate(order):
    out = O / 'lines' / f'{k}.wav'
    cut = ['-t', f'{dur(src) - TAIL_CUT[k]:.3f}'] if k in TAIL_CUT else []
    cmd = ['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(src)] + cut + (['-af', TRIM] if trim else []) + ['-ar','48000','-ac','1',str(out)]
    subprocess.run(cmd, check=True); files[k] = out
    d = dur(out); table.append({'line': k, 'who': who, 'start': round(t, 2), 'end': round(t + d, 2), 'dur': round(d, 2)})
    t += d + (GAP if i < len(order) - 1 else HOLD)
inputs = []; fc = []
for i, (k, *_ ) in enumerate(order):
    inputs += ['-i', str(files[k])]; fc.append(f'[{i}:a]apad=pad_dur={GAP if i < len(order) - 1 else HOLD}[a{i}]')
fc.append(''.join(f'[a{i}]' for i in range(len(order))) + f'concat=n={len(order)}:v=0:a=1[o]')
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y'] + inputs + ['-filter_complex', ';'.join(fc), '-map', '[o]', str(O / 'preview.wav')], check=True)
json.dump({'rev': 'R2', 'tempo': 1.05, 'lines': table, 'total': round(t, 2)}, open(O / 'timing.json', 'w'), indent=1)
for r in table: print(r['line'], r['who'], r['start'], r['end'], r['dur'])
print('total', round(t, 2), 'preview', dur(O / 'preview.wav'))
