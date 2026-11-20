"""EDU-EP30-VOICE-R2 sample join: replace L16-L18 of out/ep30-voice/preview.wav (R1.1) with the chosen re-read lines, natural 0.2 s gaps,
total length kept by the hold; writes the full-preview sample, a 3-line join, the old-vs-new comparison and a frame table.
Env LEAD = extra seconds of silence before L16 (0.33 aligns the L16 speech onset to SCENE-R1 frame 1618).
Run: .venv-whisper/bin/python -I scripts/edu-series/ep30/short/voice-redo-l16-18-join.py <cand_dir> <take letter> <out_dir>   (cand_dir has take<X>_L16..L18.wav)"""
import os, sys, wave, json, subprocess, numpy as np
C, X, O = sys.argv[1], sys.argv[2], sys.argv[3]; SR = 48000; GAP = 0.2; OLD = 'out/ep30-voice/preview.wav'; START = 53.52; TOTAL = 67.07
def load(p):
    w = wave.open(p); assert w.getframerate() == SR; return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float)
old = load(OLD); L = [load(f'{C}/take{X}_L{k}.wav') for k in (16, 17, 18)]
z = lambda s: np.zeros(int(round(s * SR)))
LEAD = float(os.environ.get('LEAD', '0'))  # extra silence before L16
head = np.concatenate([old[:int(round(START * SR))], z(LEAD)])
body = np.concatenate([L[0], z(GAP), L[1], z(GAP), L[2]])
new = np.concatenate([head, body]); new = np.concatenate([new, z(max(TOTAL - len(new) / SR, 0))])
def save(a, p):
    w = wave.open(p, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(np.clip(a, -32768, 32767).astype(np.int16).tobytes()); w.close()
os.makedirs(O, exist_ok=True)
save(new, f'{O}/preview-R2cand.wav'); save(body, f'{O}/join-new-L16-L18.wav')
oldbody = old[int(round(START * SR)):int(round(65.07 * SR))]; save(oldbody, f'{O}/join-old-L16-L18.wav')
def span(x, a, b, th=600):
    b0 = SR // 100; seg = x[int(a * SR):int(b * SR)]; n = len(seg) // b0; r = np.sqrt((seg[:n * b0].reshape(n, b0) ** 2).mean(1)); i = np.where(r > th)[0]; return a + i[0] / 100, a + (i[-1] + 1) / 100
t = 0; edges = []
for l in L: edges.append((START + LEAD + t, START + LEAD + t + len(l) / SR)); t += len(l) / SR + GAP
rows = {}
for k, (a, b) in zip((16, 17, 18), edges):
    s, e = span(new, a, b + 0.05); rows[f'L{k}'] = {'file': [round(a, 3), round(b, 3)], 'speech_frames': [round(s * 30), round(e * 30)]}
rows['speech_end_s'] = round(edges[-1][1], 3); rows['total_s'] = round(len(new) / SR, 3)
json.dump(rows, open(f'{O}/frames-R2cand.json', 'w'), indent=1); print(json.dumps(rows))
