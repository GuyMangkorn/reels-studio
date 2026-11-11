#!/usr/bin/env python3
"""EDU-EP09-SHORT narration placement (Editor, W5.3 Draft, 2026-11-08), per scene-sheets.md EDU-EP09-SHEETS-R2 "Narration placement": the locked read
public/narration/EDU-EP09-SHORT.wav (never edited) is cut into pieces A-D inside silences and placed at G 0 / 197 / 501 / 1410 (offsets 0 / +69 / +131 / +184), so every gap inside a piece
is the read's. V01 (BOY "ไม่ขึ้น!", voice-preset child-boy +10 %) is end-anchored at G196 (PL05, slot G179-196); V02 (ELDER, Gemini Algenib, <laugh>, take 3, atempo 1.12 to fit the 59 f slot)
starts at G441 and ends by G502. V01/V02 are levelled to the Kore mean RMS (capped +-12 dB). Writes public/narration/EDU-EP09-SHORT-draft.wav (1606 f, 48 kHz mono) and out/EDU-EP09-SHORT/audio/placements.txt.
Takes: out/EDU-EP09-SHORT/audio/takes/ (store projects/edu/EDU/audio/EDU-EP09-SHORT/). Run: python3 -I scripts/edu-series/ep09/narration-place.py"""
import array, math, os, subprocess, wave
FPS, SR, TOTAL = 30, 48000, 1606
SRC = 'public/narration/EDU-EP09-SHORT.wav'
TK = 'out/EDU-EP09-SHORT/audio/takes'
OUT = 'public/narration/EDU-EP09-SHORT-draft.wav'
PIECES = [('A', 0, 128, 0), ('B', 128, 370, 197), ('C', 370, 1226, 501), ('D', 1226, 1350, 1410)]   # (id, source from, to (frames), placed G)
VOCAL = [('V01', f'{TK}/V01-a.wav', 1.0, 'end', 196), ('V02', f'{TK}/V02-3.wav', 1.12, 'start', 441)]   # (id, file, atempo, anchor, G)
def ff(*a): subprocess.run(['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', *a], check=True)
def voiced(path, floor_db=-40.0):
    w = wave.open(path); n = w.getnframes(); sr = w.getframerate(); a = array.array('h'); a.frombytes(w.readframes(n))
    hop = sr // 100; on = off = None; sq = 0.0; cnt = 0
    for i in range(0, len(a) - hop, hop):
        rms = (sum(x * x for x in a[i:i + hop]) / hop) ** 0.5 / 32768
        if rms > 0 and 20 * math.log10(rms) > floor_db:
            if on is None: on = i / sr
            off = (i + hop) / sr; sq += rms * rms; cnt += 1
    return on, off, (20 * math.log10((sq / max(cnt, 1)) ** 0.5) if cnt else -90)
os.makedirs('out/EDU-EP09-SHORT/audio/st', exist_ok=True)
inputs, chains, labels, log = [], [], [], []
for i, (k, a, b, g) in enumerate(PIECES):
    inputs += ['-i', SRC]
    chains.append(f'[{i}:a]atrim=start_sample={round(a / FPS * SR)}:end_sample={round(b / FPS * SR)},asetpts=PTS-STARTPTS,adelay={round(g / FPS * SR)}S:all=1[p{i}]'); labels.append(f'[p{i}]')
    log.append(f'piece {k} source f{a}-{b} -> G{g}')
kore = voiced(SRC)[2]
for j, (k, f, T, anchor, G) in enumerate(VOCAL):
    i = len(PIECES) + j; o = f'out/EDU-EP09-SHORT/audio/st/{k}.wav'
    ff('-i', f, '-af', f'atempo={T},aresample={SR}', '-ac', '1', o)
    on, off, lvl = voiced(o); gain = max(-12.0, min(12.0, kore - lvl))
    start = (G / FPS - (off if anchor == 'end' else on))
    inputs += ['-i', o]; chains.append(f'[{i}:a]volume={gain:.2f}dB,adelay={round(start * SR)}S:all=1[p{i}]'); labels.append(f'[p{i}]')
    log.append(f'{k} atempo {T} voiced {on:.3f}-{off:.3f}s ({(off - on) * FPS:.1f} f) anchor {anchor} G{G}: voiced G{(start + on) * FPS:.1f}-G{(start + off) * FPS:.1f} gain {gain:+.1f} dB (Kore mean {kore:.1f}, take {lvl:.1f})')
n = TOTAL * SR // FPS
ff(*inputs, '-filter_complex', ';'.join(chains) + ';' + ''.join(labels) + f'amix=inputs={len(labels)}:normalize=0:duration=longest,apad=whole_len={n},atrim=end_sample={n}[out]', '-map', '[out]', '-ar', str(SR), '-ac', '1', OUT)
open('out/EDU-EP09-SHORT/audio/placements.txt', 'w').write('\n'.join(log) + '\n'); print('\n'.join(log))
