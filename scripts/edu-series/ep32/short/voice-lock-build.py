"""EDU-EP32-VOICE-R1 builder: split one Kore read into NARR lines (Whisper + energy gaps), atempo, place with acted lines.
Run: /Users/mangkornkatawong/Developer/reels-creator/.venv-whisper/bin/python -I scripts/edu-series/ep32/short/voice-lock-build.py
Inputs in out/ep32-voice/ (lines.json, narr_raw.wav, L04.wav and L07.wav = AGENT takes copied from cand/); writes out/ep32-voice/{lines/,preview.wav,timing.json}."""
import array, difflib, json, subprocess, unicodedata, wave
from pathlib import Path
import sys
D = Path('out/ep32-voice'); TEMPO = float(sys.argv[1]) if len(sys.argv) > 1 else 1.05; GAP = 0.2; HOLD = 1.6; GAPS = {'L06': 0.6, 'L07': 0.3494};  # Draft round 1 (21 Nov 2026): new L07 take (clearer "มันไปนอนตากแดด"), pause edits inside the take; L06->L07 0.6 s (was 0.8, speech starts G648 not G654 so the L07 pause sits on the B03-SH02|SH03 cut G689) and L07->L08 0.35 s (was 0.2) keep L08 at its lock frame. Earlier: L06->L07 gap 0.8 s: the L06 bridge shot needs about 18 f (0.6 s) more than L06 plus the 0.2 s gap (Film, delivery.md)
OUT = D if TEMPO == 1.05 else D / f'x{TEMPO}'; OUT.mkdir(exist_ok=True)
lines = json.load(open(D / 'lines.json'))['lines']
order = list(lines)
narr_ids = [k for k in order if lines[k]['who'] == 'NARR']
norm = lambda t: ''.join(c for c in t if unicodedata.category(c)[0] in 'LN')
from faster_whisper import WhisperModel
import numpy as np  # decoded samples: the Whisper venv's av rejects paths (see align-full.py)
pcm16 = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(D / 'narr_raw.wav'), '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'])
segs, _ = WhisperModel('large-v3-turbo', device='cpu', compute_type='int8').transcribe(np.frombuffer(pcm16, dtype=np.float32), language='th', word_timestamps=True, vad_filter=False)
words = [(norm(w.word), w.start, w.end) for s in segs for w in s.words]
wchars = []  # (char, time)
for t, s, e in words:
    for i, c in enumerate(t): wchars.append((c, s + (e - s) * i / max(len(t), 1)))
wtext = ''.join(c for c, _ in wchars)
ref = ''; off = {}
for k in narr_ids:
    off[k] = len(ref); ref += norm(lines[k]['tts'])
sm = difflib.SequenceMatcher(None, ref, wtext, autojunk=False)
mapi = {}
for a, b, n in sm.get_matching_blocks():
    for i in range(n): mapi[a + i] = b + i
def tstart(k):
    for i in range(off[k], len(ref)):
        if i in mapi: return wchars[mapi[i]][1]
mids = []
for a, b in zip(narr_ids, narr_ids[1:]):
    last = max(i for i in range(off[a], off[b]) if i in mapi)
    mids.append((wchars[mapi[last]][1] + tstart(b)) / 2)
# energy gaps
w = wave.open(str(D / 'narr_raw.wav')); sr = w.getframerate(); pcm = array.array('h', w.readframes(w.getnframes()))
blk = sr // 100; env = [max(abs(x) for x in pcm[i:i + blk]) for i in range(0, len(pcm), blk)]
def cut_near(m):
    best = None
    for j in range(max(0, int((m - 0.6) * 100)), min(len(env), int((m + 0.6) * 100))):
        if env[j] < 300:
            # extend run
            a = j
            while a > 0 and env[a - 1] < 300: a -= 1
            b = j
            while b < len(env) - 1 and env[b + 1] < 300: b += 1
            c = (a + b) / 2 / 100
            if best is None or abs(c - m) < abs(best[0] - m): best = (c, (b - a + 1) / 100)
    return best[0] if best else m
cuts = [0.0] + [cut_near(m) for m in mids] + [len(pcm) / sr]
(OUT / 'lines').mkdir(exist_ok=True)
files = {}
for k, a, b in zip(narr_ids, cuts, cuts[1:]):
    # trim leading/trailing silence of the segment
    s0 = int(a * 100); e0 = int(b * 100)
    while s0 < e0 and env[s0] < 300: s0 += 1
    while e0 > s0 and env[e0 - 1] < 300: e0 -= 1
    out = OUT / 'lines' / f'{k}.wav'  # L06: 10 ms fade-out at the file end, removes the hard cut in speech at the L06|L08 join (user, 21 Nov 2026)
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-ss', f'{s0/100-0.02:.3f}', '-t', f'{(e0-s0)/100+0.06:.3f}', '-i', str(D / 'narr_raw.wav'),
                    '-af', f'atempo={TEMPO}' + (',areverse,afade=t=in:d=0.01,areverse' if k == 'L06' else ''), '-ar', '48000', '-ac', '1', str(out)], check=True)
    files[k] = out
for k in order:
    if lines[k]['who'] != 'NARR':
        out = OUT / 'lines' / f'{k}.wav'
        subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(D / f'{k}.wav'), '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse' + (',afade=t=in:d=0.005,areverse,afade=t=in:d=0.012,areverse' if k == 'L07' else ''), '-ar', '48000', '-ac', '1', str(out)], check=True)
        files[k] = out
dur = lambda p: float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(p)]))
t = 0.0; table = []
sil = lambda n: f'anullsrc=r=48000:cl=mono'
for i, k in enumerate(order):
    d = dur(files[k]); table.append({'line': k, 'who': lines[k]['who'], 'start': round(t, 2), 'end': round(t + d, 2), 'dur': round(d, 2)})
    t += d + (GAPS.get(k, GAP) if i < len(order) - 1 else HOLD)
inputs = []; fc = []
for i, k in enumerate(order):
    inputs += ['-i', str(files[k])]
    pad = GAPS.get(k, GAP) if i < len(order) - 1 else HOLD
    fc.append(f'[{i}:a]apad=pad_dur={pad}[a{i}]')
fc.append(''.join(f'[a{i}]' for i in range(len(order))) + f'concat=n={len(order)}:v=0:a=1[o]')
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y'] + inputs + ['-filter_complex', ';'.join(fc), '-map', '[o]', str(OUT / 'preview.wav')], check=True)
json.dump({'tempo': TEMPO, 'cuts_raw': [round(c, 2) for c in cuts], 'lines': table, 'total': round(t, 2)}, open(OUT / 'timing.json', 'w'), indent=1)
for r in table: print(r['line'], r['who'], r['start'], r['end'], r['dur'])
print('total', round(t, 2), 'preview', dur(OUT / 'preview.wav'))
