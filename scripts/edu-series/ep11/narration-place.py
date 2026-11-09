#!/usr/bin/env python3
"""EDU-EP11-SHORT narration placement (Editor, W5.3 Draft, 2026-11-09) per scene-sheets.md EDU-EP11-SHEETS-R1.3 "Placement rules" PL02-PL05.
Locked NAR file (49.64 s, every gap 0.28 s) is cut at the middle of the gap silence at 7 slots; each slot = 0.14 s + slot + 0.14 s. Woman's takes V01-V04 (Leda) are placed at their
slot start; the hold exhale at G1732. No gain on the lines, no atempo, no inner cut: peaks stay <= -1.5 dB (voice-lock R2.1); the hold exhale is -12 dB (fix list). Lead 0.10 s. Total 1788 f at 48 kHz mono.
Writes public/narration/EDU-EP11-SHORT-narration-v2.wav and out/EDU-EP11-SHORT/audio/placements.txt (slot start G, narration anchors after the shift).
Run: python3 -I scripts/edu-series/ep11/narration-place.py"""
import array, os, re, subprocess, wave
R = os.path.expanduser('~/ReelsStore/projects/EDU/voice/')
FPS, SR, TOTAL, LEAD = 30, 48000, 1788, 0.10
NAR = R + 'ep11-nar-kore-A-r3-x0.92-regap028-L16t1.wav'
# (name, nominal gap centre in NAR s from the R2 line table, slot length s, take file or None for a silent/SFX slot)
SLOTS = [('V01', 4.317, 0.895, 'ep11-v-V01-Leda.wav'), ('V02', 7.067, 2.784, 'ep11-v-V02-Leda.wav'), ('V03', 16.5, 1.766, 'ep11-v-V03-Leda.wav'),
         ('V04', 21.6, 0.917, 'ep11-v-V04-Leda.wav'), ('black', 23.30, 0.4, None), ('gasp', 29.5, 0.6, None), ('clamp', 43.22, 0.6, None)]
def load(p):
    w = wave.open(p); assert w.getframerate() == SR and w.getnchannels() == 1 and w.getsampwidth() == 2, p
    a = array.array('h'); a.frombytes(w.readframes(w.getnframes())); return a
nar = load(NAR)
sil = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', NAR, '-af', 'silencedetect=n=-35dB:d=0.2', '-f', 'null', '-'], capture_output=True, text=True).stderr
starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', sil)]; ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', sil)]
gaps = list(zip(starts, ends))
out = array.array('h', bytes(2 * round(TOTAL / FPS * SR))); log = []
pos_nar = 0; shift = LEAD
def put(src, start_s, a=0, b=None):
    b = len(src) if b is None else b; s0 = round(start_s * SR)
    for i in range(a, b):
        j = s0 + i - a
        if 0 <= j < len(out): out[j] = max(-32768, min(32767, out[j] + src[i]))
for name, nom, ln, take in SLOTS:
    g = min(gaps, key=lambda g: abs((g[0] + g[1]) / 2 - nom)); mid = (g[0] + g[1]) / 2
    assert abs(mid - nom) < 0.3, (name, nom, g)
    a, b = round(mid * SR), None
    put(nar, shift + pos_nar / SR, pos_nar, a)   # NAR segment up to the gap middle
    slot_t = shift + mid; log.append(f'{name} gap {g[0]:.3f}-{g[1]:.3f} mid {mid:.3f} -> slot start {slot_t:.3f} s = G{slot_t * FPS:.1f}, len {ln}')
    if take: put(load(R + take), slot_t)
    shift += ln; pos_nar = a
put(nar, shift + pos_nar / SR, pos_nar)
ex = load(R + 'ep11-v-V05hold-Leda.wav'); EX_DB = -12.0   # user verdict 2026-11-09: the closing sigh was louder than the strings; peak -1.5 -> -13.5 dB
ex = array.array('h', (int(x * 10 ** (EX_DB / 20)) for x in ex)); put(ex, 1732 / FPS)
log.append(f'hold exhale at G1732; NAR end -> G{(shift + len(nar) / SR) * FPS:.1f}')
os.makedirs('public/narration', exist_ok=True); os.makedirs('out/EDU-EP11-SHORT/audio', exist_ok=True)
w = wave.open('public/narration/EDU-EP11-SHORT-narration-v2.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes()); w.close()
open('out/EDU-EP11-SHORT/audio/placements.txt', 'w').write('\n'.join(log) + '\n'); print('\n'.join(log))
