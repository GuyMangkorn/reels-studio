#!/usr/bin/env python3
"""EDU-EP18-SHORT narration placement (Editor, W5.3 draft, 2026-11-12) per EDU-EP18-ROWS-R2.2 "Narration placement" (storyboard.md, nine segments).
The locked Kore read (38.60 s, 48 kHz mono, atempo 1.0; store projects/edu/EDU/audio/2026-11-11_ep18-r1-nar-kore-raw.wav) is cut inside a real pause at
1.511 / 6.489 / 9.106 / 21.093 / 24.375 / 27.980(-28.130 dropped) / 34.255 / 35.810 s and placed with offsets +0.10 / 0.60 / 1.70 / 2.70 / 4.34 / 4.64 / 5.24 / 5.79 / 6.09 s.
No gain, 6 ms fades at every cut. Woman voice (user pick 2026-11-12: Gemini Leda, Youthful; cached takes in $REELS_STORE/cache/tts) V01/V02/V03 are trimmed to their onset, tightened to fit their slot and
mixed in on the same track at the narration level (-16.1 LUFS): V01 f226 (0.30-0.85 + 1.05-1.33 s crossfaded, atempo 1.15, +1.2 dB), V02 f718 (0.09-0.99 s, +3.5 dB and a -1 dBFS limiter: its raw peak is -1.5 dBFS, so a full level match is not possible; ends about 2 LU under the narrator), V03 f1358 (0.12-0.62 s, atempo 1.15, -1.2 dB); no pitch change. Total 1468 f at 48 kHz mono.
Writes public/narration/EDU-EP18-SHORT-narration-v1.wav and out/EDU-EP18-SHORT/audio/placements-v1.txt. NOT LISTENED. Run: python3 -I scripts/edu-series/ep18/narration-place.py"""
import array, os, subprocess, wave
R = os.path.expanduser('~/ReelsStore/projects/edu/EDU/audio/')
FPS, SR, TOTAL = 30, 48000, 1468
w = wave.open(R + '2026-11-11_ep18-r1-nar-kore-raw.wav'); assert w.getframerate() == SR and w.getnchannels() == 1 and w.getsampwidth() == 2
nar = array.array('h'); nar.frombytes(w.readframes(w.getnframes()))
out = array.array('h', bytes(2 * TOTAL * SR // FPS)); log = []
SEG = [('A', 0.0, 1.511, 0.10), ('B', 1.511, 6.489, 0.60), ('C', 6.489, 9.106, 1.70), ('D', 9.106, 21.093, 2.70), ('E', 21.093, 24.375, 4.34),
       ('F', 24.375, 27.980, 4.64), ('G', 28.130, 34.255, 5.24), ('H', 34.255, 35.810, 5.79), ('I', 35.810, 38.600, 6.09)]
fi = round(0.006 * SR)
for n, a, b, o in SEG:
    i0, i1 = round(a * SR), min(round(b * SR), len(nar)); j0 = round((a + o) * SR)
    for i in range(i0, i1):
        g = min(1.0, (i - i0 + 1) / fi, (i1 - i) / fi); j = j0 + i - i0
        if 0 <= j < len(out): out[j] = max(-32768, min(32767, out[j] + int(nar[i] * g)))
    log.append(f'seg {n} read {a:.3f}-{b:.3f} s -> offset {o} s = f{(a + o) * FPS:.1f}-f{(b + o) * FPS:.1f}')
# ---- woman voice takes (Leda): fit to the slots, onset on the slot frame. (name, cache id, filter, onset s in the fitted clip, slot start f)
TTS = os.path.expanduser('~/ReelsStore/cache/tts/')
VO = [('V01', '7e7ef59b7e686f34', "[0:a]atrim=0.30:0.85,asetpts=N/SR/TB[a];[0:a]atrim=1.05:1.33,asetpts=N/SR/TB[b];[a][b]acrossfade=d=0.012:c1=tri:c2=tri,atempo=1.15,afade=t=out:st=0.66:d=0.05,volume=1.2dB", 0.01, 226),
      ('V02', 'ba8f37b8cd2c9bda', "[0:a]atrim=0.09:0.99,asetpts=N/SR/TB,afade=t=out:st=0.84:d=0.06,volume=3.5dB,alimiter=limit=0.85:attack=1:release=30:level=0", 0.02, 718),
      ('V03', 'ef39d726bf8b5658', "[0:a]atrim=0.12:0.62,asetpts=N/SR/TB,atempo=1.15,afade=t=out:st=0.37:d=0.06,volume=-1.2dB", 0.01, 1358)]
for n, cid, flt, on, f0 in VO:
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', TTS + cid + '.wav', '-filter_complex', flt, '-ar', str(SR), '-ac', '1', '-f', 's16le', '-'], check=True, capture_output=True).stdout
    clip = array.array('h'); clip.frombytes(raw); assert max(abs(x) for x in clip) < 32767 * 0.9, n   # peak under -1 dBFS
    j0 = round(f0 / FPS * SR - on * SR)
    for i, v in enumerate(clip): out[j0 + i] = max(-32768, min(32767, out[j0 + i] + v))
    log.append(f'{n} Leda take {cid}: clip {len(clip) / SR:.3f} s, file start f{j0 / SR * FPS:.1f}, onset f{f0}, end f{(j0 + len(clip)) / SR * FPS:.1f}')
os.makedirs('public/narration', exist_ok=True); os.makedirs('out/EDU-EP18-SHORT/audio', exist_ok=True)
w = wave.open('public/narration/EDU-EP18-SHORT-narration-v1.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes()); w.close()
open('out/EDU-EP18-SHORT/audio/placements-v1.txt', 'w').write('\n'.join(log) + '\n'); print('\n'.join(log))
