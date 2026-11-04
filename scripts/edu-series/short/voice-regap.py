"""EDU-EP01-SHORT W4.2: tighten the gaps of one Gemini read (raw take), then speed it up and normalise.
Run (Whisper venv python, for numpy): python -I scripts/edu-series/short/voice-regap.py RAW.wav OUT.wav [ATEMPO]
Gaps (silence >= 0.15 s at -38 dB, raw-take seconds) are replaced: line gap 0.28 s, in-line comma 0.14 s,
reveal pauses 0.55 s (after L08 and before L12), jolt gap L05->L07 3.2 s (placeholder for fall + silence + gasp,
Film retimes in W5.1), tail 0.5 s speech-free. Needs numpy and ffmpeg.
Optional 4th argument: JSON file {"<raw silence start s>": "Lxx"} replacing the LINE table (another voice's take, e.g. narration-measure-kore.json lineGaps).
Adjacent silences closer than 0.01 s are merged."""
import subprocess, re, sys, numpy as np
SR = 48000
src, out = sys.argv[1], sys.argv[2]
tempo = float(sys.argv[3]) if len(sys.argv) > 3 else 1.05
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, dtype=np.float32).copy()
dur = len(x) / SR
err = subprocess.run(['ffmpeg', '-i', src, '-af', 'silencedetect=n=-38dB:d=0.15', '-f', 'null', '-'], capture_output=True, text=True).stderr
st = [float(m) for m in re.findall(r'silence_start: ([\d.]+)', err)]
en = [float(m) for m in re.findall(r'silence_end: ([\d.]+)', err)]
gaps = []
for s, e in zip(st, en):
    if gaps and s - gaps[-1][1] < 0.01:
        gaps[-1] = (gaps[-1][0], e)
    else:
        gaps.append((s, e))
gaps = [(s, e) for s, e in gaps if s > 0.3 and e < dur - 0.05]
# raw-take silence starts that are line gaps (L-number is the line that follows)
LINE = {4.75: 'L02', 6.49: 'L03', 10.94: 'L04', 12.95: 'L05', 18.41: 'L07', 24.53: 'L08', 29.67: 'L09', 31.24: 'L10', 36.04: 'L11', 43.43: 'L12', 46.29: 'L13', 54.76: 'L14', 58.63: 'L15', 64.80: 'L16'}
if len(sys.argv) > 4:
    import json
    LINE = {float(k): v for k, v in json.load(open(sys.argv[4])).items()}
def target(s):
    for k, v in LINE.items():
        if abs(s - k) < 0.06:
            return {'L07': 3.2, 'L09': 0.55, 'L12': 0.55}.get(v, 0.28), v
    return 0.14, ''
PAD = 0.04
parts, log, prev, pos = [], [], 0.0, 0.0
def put(a, b):
    global pos
    seg = x[int(a * SR):int(b * SR)]; parts.append(seg); pos += len(seg) / SR
for s, e in gaps:
    put(prev, s + PAD)
    g, line = target(s)
    parts.append(np.zeros(int(g * SR), dtype=np.float32)); pos += g
    if line: log.append((line, pos))
    prev = e - PAD
put(prev, dur)
parts.append(np.zeros(int(0.5 * SR), dtype=np.float32))
y = np.concatenate(parts)
tmp = out + '.pre.f32'
y.tofile(tmp)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', tmp, '-af', f'atempo={tempo},loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '48000', out], check=True)
import os; os.remove(tmp)
print('regapped seconds (pre-tempo):', round(len(y) / SR, 2), 'line onsets pre-tempo:', ' '.join(f'{l}@{t:.2f}' for l, t in log))
