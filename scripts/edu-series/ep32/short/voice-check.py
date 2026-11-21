"""EDU-EP32 voice-lock check: Whisper transcript of each line file (0.5 s padded), internal pauses >= 0.25 s, head/tail energy, and speech on/off frames at 30 fps (10 ms peak envelope, speech above 1500).
Run: /Users/mangkornkatawong/Developer/reels-creator/.venv-whisper/bin/python -I scripts/edu-series/ep32/short/voice-check.py [dir]  (dir default out/ep32-voice; also checks cand/ if present)"""
import array, json, subprocess, sys, wave
from pathlib import Path
import numpy as np
from faster_whisper import WhisperModel
D = Path(sys.argv[1] if len(sys.argv) > 1 else 'out/ep32-voice'); m = WhisperModel('large-v3-turbo', device='cpu', compute_type='int8')
def asr(p):
    pcm = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(p), '-af', 'adelay=500|500,apad=pad_dur=0.5', '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'])
    s, _ = m.transcribe(np.frombuffer(pcm, dtype=np.float32), language='th'); return ' '.join(x.text.strip() for x in s)
def env(p):
    w = wave.open(str(p)); sr = w.getframerate(); a = array.array('h', w.readframes(w.getnframes())); b = sr // 100
    return [max(abs(x) for x in a[i:i + b]) for i in range(0, len(a), b)]
def pauses(e, thr=1500, mn=25):
    out = []; i = 0
    on = [j for j, v in enumerate(e) if v > thr]
    if not on: return out
    for a, b in zip(on, on[1:]):
        if b - a - 1 >= mn: out.append((round((a + 1) / 100, 2), round((b - 1 - a) / 100, 2)))
    return out
for p in sorted((D / 'lines').glob('*.wav')) + sorted((D / 'cand').glob('*.wav')):
    e = env(p); on = [j for j, v in enumerate(e) if v > 1500]
    print(p.stem, 'dur', round(len(e) / 100, 2), 'on/off', on[0] / 100, (on[-1] + 1) / 100, 'head', max(e[:3]), 'tail', max(e[-3:]), 'pauses(at,len)', pauses(e), '|', asr(p))
