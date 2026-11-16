#!/usr/bin/env python3
"""EDU-EP19-SHORT narration placement v1 (Editor, W5.4 Draft, 2026-11-15; scene sheets EDU-EP19-SHEETS-R3, voice measure EDU-EP19-VOICE-R2).
One file per line, placed whole at the sheet's file-start G frame (no stretch, no gain except V06): NAR = user-picked Kore take r4_t1_slow8 cut into lines (out/ep19-narr/lines_norm/, store
projects/edu/EDU/audio/2026-11-15_ep19-nar-lines-norm/), girl = Gemini Leda V01-V06 (out/ep19-narr/girl_norm_leda/). V06 is a whispered cheer in picture: mixed V06_DB lower than the other lines.
Writes public/narration/EDU-EP19-SHORT-narration-v1.wav (1704 f, 48 kHz mono, s16, generated, not in Git) and out/EDU-EP19-SHORT/audio/placements-v1.txt. Run: python3 -I scripts/edu-series/ep19/narration-place.py"""
import array, math, os, wave
FPS, SR, TOTAL = 30, 48000, 1704
V06_DB = -6.0
NAR = 'out/ep19-narr/lines_norm/%s.wav'; GIRL = 'out/ep19-narr/girl_norm_leda/%s.wav'
# (file, path, file-start G) from the sheet's placement table
PLACE = [('L01', NAR, 6), ('L02', NAR, 169), ('L03', NAR, 262), ('L03b', NAR, 329), ('V01', GIRL, 447), ('L04', NAR, 510), ('V02', GIRL, 593), ('V03', GIRL, 721),
         ('L05', NAR, 868), ('V04', GIRL, 993), ('L07', NAR, 1039), ('V05', GIRL, 1143), ('L08', NAR, 1309), ('V06', GIRL, 1459), ('L10', NAR, 1492)]
out = array.array('f', bytes(4 * TOTAL * SR // FPS)); log = []; prev_end = 0
for name, tpl, g in PLACE:
    w = wave.open(tpl % name); assert (w.getframerate(), w.getnchannels(), w.getsampwidth()) == (SR, 1, 2), name
    a = array.array('h'); a.frombytes(w.readframes(w.getnframes()))
    s0 = round(g * SR / FPS); gain = 10 ** (V06_DB / 20) if name == 'V06' else 1.0
    assert s0 >= prev_end, '%s overlaps the previous file' % name
    assert s0 + len(a) <= len(out), '%s runs past the end' % name
    for i, x in enumerate(a): out[s0 + i] = x / 32768 * gain
    prev_end = s0 + len(a)
    log.append('%-4s G%4d-G%7.1f  %.3f s%s' % (name, g, prev_end * FPS / SR, len(a) / SR, '  (%.1f dB)' % V06_DB if name == 'V06' else ''))
os.makedirs('public/narration', exist_ok=True); os.makedirs('out/EDU-EP19-SHORT/audio', exist_ok=True)
w = wave.open('public/narration/EDU-EP19-SHORT-narration-v1.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes(array.array('h', (max(-32767, min(32767, int(round(x * 32767)))) for x in out)).tobytes()); w.close()
open('out/EDU-EP19-SHORT/audio/placements-v1.txt', 'w').write('\n'.join(log) + '\n'); print('\n'.join(log))
