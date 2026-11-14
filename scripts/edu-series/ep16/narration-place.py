#!/usr/bin/env python3
"""EDU-EP16-SHORT narration placement (Editor, W5.3 Draft, 14 Nov 2026) on EDU-EP16-SHEET-R1.1 (storyboard.md "Voice and subtitle cues") and scripts/edu-series/ep16/measure.json.
The user-approved EP16 narration R2.2 (store projects/edu/EDU/voice/ep16_narration_kore_x1.05.b56a7013.wav, 42.37 s, Kore x1.05, keeps "ไม่เอานะ") is one continuous read; each line L01..L11 is cut at
its measured read range (measure.json `read_s`, 0.08 s of real pause either side) and placed at its measured composition start (`start_s`). Character takes (R2.2 set + V10 from R2.3, Leda) go in whole at
their item start f0 (R1.5b: V01 f217, V02 f443, V03 f478, V04 f637, V07 f781, V05 f929, V08 f1126, V09 f1535 (voice onset file +5 f = f1540), V10 f1929). No gain, no atempo, no edit to a take.
R1.5b re-place (Editor, 14 Nov 2026, SHEET-R1.5b, TOTAL 2100). The hen cluck V06 (f2010) is Ton's cue (sound-cues.json), not placed here. Output: public/narration/EDU-EP16-SHORT-narration-v1.wav (48 kHz mono, 2100 f) and out/EDU-EP16-SHORT/audio/placements.txt.
Run: python3 -I scripts/edu-series/ep16/narration-place.py"""
import array, json, os, subprocess
V = os.path.expanduser('~/ReelsStore/projects/edu/EDU/voice/')
FPS, SR, TOTAL, PAD = 30, 48000, 2100, 0.08
def load(path):
    a = array.array('h'); a.frombytes(subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], check=True, capture_output=True).stdout); return a
out = array.array('i', bytes(4 * TOTAL * SR // FPS)); log = []
def put(src, start_s, a=0, b=None):
    b = len(src) if b is None else b; s0 = round(start_s * SR)
    for i in range(a, b):
        j = s0 + i - a
        if 0 <= j < len(out): out[j] += src[i]
nar = load(V + 'ep16_narration_kore_x1.05.b56a7013.wav')
items = json.load(open('scripts/edu-series/ep16/measure.json'))['items']
# R1.5b item starts (storyboard "Voice and subtitle cues"): L01-L06b unchanged (measure.json start_s); L07 +56 f, L07b +56, L08 +56 (R1.4 stretch); L09 54.133, L10 58.800, L11 62.467 (R1.5 +124 f on top of R1.4)
START_S = {'L07': 34.127, 'L07b': 40.057, 'L08': 42.767, 'L09': 54.133, 'L10': 58.800, 'L11': 62.467}
for it in items:
    if it['id'].startswith('L'):
        a, b = it['read_s']; a2, b2 = max(0, a - PAD), min(len(nar) / SR, b + PAD); st = START_S.get(it['id'], it['start_s'])
        put(nar, st - (a - a2), round(a2 * SR), round(b2 * SR))
        log.append(f"{it['id']} read {a:.2f}-{b:.2f} s -> start_s {st:.3f} = f{st * FPS:.1f}")
CH = {'V01': ('chars/ep16_V01_boy.wav', 217), 'V02': ('chars/ep16_V02_boy.wav', 443), 'V03': ('chars/ep16_V03_grandma.wav', 478), 'V04': ('chars/ep16_V04_boy.wav', 637), 'V07': ('chars/ep16_V07_boy.wav', 781),
      'V05': ('chars/ep16_V05_boy.wav', 929), 'V08': ('chars/ep16_V08_boy.wav', 1126), 'V09': ('chars/ep16_V09_boy.wav', 1535), 'V10': ('chars/ep16_V10_boy_r23.wav', 1929)}
for k, (f, f0) in CH.items():
    put(load(V + f), f0 / FPS); log.append(f'{k} {f} file start f{f0}')
os.makedirs('public/narration', exist_ok=True); os.makedirs('out/EDU-EP16-SHORT/audio', exist_ok=True)
pk = max(abs(x) for x in out); print('peak', pk / 32768)
a16 = array.array('h', (max(-32768, min(32767, x)) for x in out))
import wave
w = wave.open('public/narration/EDU-EP16-SHORT-narration-v1.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a16.tobytes()); w.close()
open('out/EDU-EP16-SHORT/audio/placements.txt', 'w').write('\n'.join(log) + '\n'); print('\n'.join(log))
