#!/usr/bin/env python3
"""EDU-EP08-SHORT narration placement R2 (Editor, W5.3 Draft R2, 2026-11-08; tempo 0.95 per user decision). Each locked line file is run through atempo=0.95 (Kore A cut2 L01-L13, V01 Aoede B
gasp + "เฮ้ย!", V02 Algenib A "จับได้แล้ว!" with the radio filter AFTER the atempo; L13 gets afade t=out d=0.9 qsin AFTER the atempo, fade G1667-1692), then placed WHOLE by measure.json
(scene-sheets.md EDU-EP08-SHEETS-R2 "Placement"; NOT by pace-095-preview.py): file start (samples) = round(onset G / 30 * 48000) - onset_in_file (stretched). The onset of every stretched file is
MEASURED here (10 ms frames, -40 dBFS) and compared with measure.json. V01/V02 are leveled to the mean RMS of the Kore lines (capped +-12 dB). Exact zero (sample-exact) over G95-100.
R1.2 (2026-11-08, voice re-lock): L12 = trimmed cut2 take, L13 = new comma take (both filed in the store lines folder; files come from measure.json). R1.3 (user, 2026-11-08): L11 = new take 'ปล่อยลมหายใจออกมา…' (trimmed, store lines/...-L11-kore-A-r13-trim.wav). Previous R1.1 file kept in out/EDU-EP08-SHORT/audio/prev/.
Writes public/narration/EDU-EP08-SHORT-narration-v3.wav (total frames from timeline.json, 48 kHz mono) and out/EDU-EP08-SHORT/audio/placements.txt.
Run: python3 -I scripts/edu-series/ep08/narration-place.py"""
import json, os, subprocess, wave, array, math
HERE = os.path.dirname(os.path.abspath(__file__))
M = json.load(open(os.path.join(HERE, 'measure.json')))
R = os.path.expanduser('~/ReelsStore')
LINES = f'{R}/projects/edu/EDU/narration/ep08/lines'
FPS, SR, T = 30, 48000, 0.95
TOTAL = json.load(open(os.path.join(HERE, 'timeline.json')))['total_frames']   # R1.3 re-lock: 1745 f (R1.2 1731, R1.1 1762)
OUT = 'public/narration/EDU-EP08-SHORT-narration-v3.wav'
TMP = 'out/EDU-EP08-SHORT/audio/stretched'
ZERO = (95, 101)   # exact zero G95-100 (frames 95..100 inclusive)
assert M['tempo'] == T and M['script'] == 'EDU-EP08-SCRIPT-R1.3' and M['lines']['L13']['video_end_frame'] == TOTAL - 70   # 4 f cut tail + 66 f closing
RADIO = 'highpass=f=420,lowpass=f=3300,acompressor=threshold=0.05:ratio=8:attack=3:release=60:makeup=2,acrusher=bits=11:mix=0.25:mode=lin'
def voiced(path, floor_db=-40.0):
    w = wave.open(path); n = w.getnframes(); sr = w.getframerate(); ch = w.getnchannels()
    a = array.array('h'); a.frombytes(w.readframes(n))
    if ch > 1: a = a[::ch]
    hop = sr // 100; on = off = None; sq = 0.0; cnt = 0
    for i in range(0, len(a) - hop, hop):
        seg = a[i:i + hop]; rms = (sum(x * x for x in seg) / len(seg)) ** 0.5 / 32768
        if rms > 0 and 20 * math.log10(rms) > floor_db:
            if on is None: on = i / sr
            off = (i + hop) / sr; sq += rms * rms; cnt += 1
    return on, off, n / sr, (20 * math.log10((sq / max(cnt, 1)) ** 0.5) if cnt else -90)
def ff(*a): subprocess.run(['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', *a], check=True)
os.makedirs(TMP, exist_ok=True)
items = []   # (key, raw file, onset G (vocal: file start G), onset_in_file (stretched), extra filter)
for k, v in M['lines'].items(): items.append((k, f"{LINES}/{v['file']}", v['video_onset_frame'], v['onset_in_file']))
V = M['vocal']
items.append(('V01', f"{R}/{V['V01']['file']}", V['V01']['file_start_frame'], 0.0))   # vocal takes are placed from their file start (slot start G)
items.append(('V02', f"{R}/{V['V02']['file']}", V['V02']['file_start_frame'], 0.0))
# pass 1: atempo (+ L13 fade after the atempo), 48 kHz mono, to a temp file; measure it
st = {}
for k, f, G, sheet in items:
    o = f'{TMP}/{k}.wav'
    ff('-i', f, '-af', f'atempo={T},aresample={SR}', '-ac', '1', o)
    if k == 'L13':
        d = voiced(o)[2]; o2 = f'{TMP}/{k}-fade.wav'
        ff('-i', o, '-af', f'afade=t=out:st={d - 0.9:.6f}:d=0.9:curve=qsin', '-ac', '1', o2); o = o2
    st[k] = o
kore = [voiced(st[k])[3] for k, *_ in items if k.startswith('L')]; kmean = sum(kore) / len(kore)
cmd = []; g, lab, log = [], [], []
for i, (k, f, G, sheet) in enumerate(items):
    on, off, dur, lvl = voiced(st[k])
    start = round(G / FPS * SR) - round(sheet * SR)
    gain = 0.0 if k.startswith('L') else max(-12.0, min(12.0, kmean - lvl))
    cmd += ['-i', st[k]]
    chain = 'aresample=48000' + (f',{RADIO}' if k == 'V02' else '') + (f',volume={gain:.2f}dB' if gain else '') + f',adelay={start}S:all=1'
    g.append(f'[{i}:a]{chain}[c{i}]'); lab.append(f'[c{i}]')
    log.append(f'{k} onset G{G} measured onset {on:.3f}s (-40 dBFS) used {sheet:.3f}s voiced end G{(start / SR + off) * FPS:.1f} file-start {start / SR:.4f}s dur {dur:.3f}s level {lvl:.1f} dB gain {gain:+.1f}')
g.append(''.join(lab) + f'amix=inputs={len(lab)}:normalize=0:duration=longest,apad=whole_len={TOTAL * SR // FPS},atrim=end_sample={TOTAL * SR // FPS}[out]')
os.makedirs('public/narration', exist_ok=True); os.makedirs('out/EDU-EP08-SHORT/audio', exist_ok=True)
ff(*cmd, '-filter_complex', ';'.join(g), '-map', '[out]', '-ar', str(SR), '-ac', '1', OUT)
def zero_exact(path, a_f, b_f):   # exact zero over frames [a_f, b_f) (sample-exact)
    w = wave.open(path); par = w.getparams(); d = bytearray(w.readframes(w.getnframes())); w.close()
    a, b = round(a_f / FPS * par.framerate) * 2 * par.nchannels, round(b_f / FPS * par.framerate) * 2 * par.nchannels
    d[a:b] = bytes(b - a)
    o = wave.open(path, 'wb'); o.setparams(par); o.writeframes(bytes(d)); o.close()
zero_exact(OUT, *ZERO)
w = wave.open(OUT); assert w.getnframes() == TOTAL * SR // FPS, w.getnframes(); w.close()
open('out/EDU-EP08-SHORT/audio/placements.txt', 'w').write(f'Kore mean level {kmean:.1f} dB\n' + '\n'.join(log) + '\n')
print(f'Kore mean {kmean:.1f} dB'); print('\n'.join(log)); print('ok', TOTAL, 'f')
