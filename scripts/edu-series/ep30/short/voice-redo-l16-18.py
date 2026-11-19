"""EDU-EP30-VOICE-R2 candidate builder: split one Kore re-read of L16+L17+L18 (takes A/B/C) at the real pauses, atempo 1.05,
report per-line durations and a choppiness measure (inner dips per second), write candidate line files.
Run: /Users/mangkornkatawong/Developer/reels-creator/.venv-whisper/bin/python -I scripts/edu-series/ep30/short/voice-redo-l16-18.py <takes_dir> <out_dir> <takes e.g. ABD> [windows-json {take:[lo1,hi1,lo2,hi2]}]
Inputs <takes_dir>/take{A,B,C}.wav (gemini-tts.py say, Kore, same style as VOICE-R1, text = tts of L16 L17 L18 joined by a space).
Cut rule: L16|L17 in the longest silence 4.3-5.7 s, L17|L18 in the longest silence after the year (7.8-11.5 s); ends trimmed at env<300 (10 ms blocks) as in voice-lock-build.py."""
import sys, wave, subprocess, json, numpy as np
from pathlib import Path
T, O = Path(sys.argv[1]), Path(sys.argv[2]); O.mkdir(parents=True, exist_ok=True); TEMPO = 1.05
def load(p):
    w = wave.open(str(p)); return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float), w.getframerate()
def silences(r, th=300, mn=6):
    out = []; i = 0
    while i < len(r):
        if r[i] < th:
            j = i
            while j < len(r) and r[j] < th: j += 1
            if j - i >= mn: out.append((i, j))
            i = j
        else: i += 1
    return out
res = {}
for t in sys.argv[3]:
    x, sr = load(T / f'take{t}.wav'); b = sr // 100; n = len(x) // b; r = np.sqrt((x[:n * b].reshape(n, b) ** 2).mean(1))
    sil = silences(r)
    def pick(lo, hi):
        c = [(j - i, i, j) for i, j in sil if lo * 100 <= (i + j) / 2 <= hi * 100]
        l, i, j = max(c); return (i + j) / 2 / 100, l * 10
    # L17|L18: first long pause after the year ("1908" ends about 9 s in all takes), take the longest silence 8.5-11.5 s
    W = json.loads(sys.argv[4]).get(t, [4.3, 5.7, 9.4, 11.0]) if len(sys.argv) > 4 else [4.3, 5.7, 9.4, 11.0]  # per-take windows (s) around the two pauses
    c1, g1 = pick(W[0], W[1]); c2, g2 = pick(W[2], W[3])
    cuts = [0.0, c1, c2, n / 100]; res[t] = {'cuts': [round(c, 2) for c in cuts], 'gap_ms': [g1, g2], 'lines': {}}
    for k, a, z in zip(('L16', 'L17', 'L18'), cuts, cuts[1:]):
        s0, e0 = int(a * 100), int(z * 100)
        while s0 < e0 and r[s0] < 300: s0 += 1
        while e0 > s0 and r[e0 - 1] < 300: e0 -= 1
        out = O / f'take{t}_{k}.wav'
        subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-ss', f'{max(s0/100-0.02,0):.3f}', '-t', f'{(e0-s0)/100+0.06:.3f}', '-i', str(T / f'take{t}.wav'),
                        '-af', f'atempo={TEMPO}', '-ar', '48000', '-ac', '1', str(out)], check=True)
        y, _ = load(out); b2 = sr // 200; m = len(y) // b2; rr = np.sqrt((y[:m * b2].reshape(m, b2) ** 2).mean(1))
        ref = np.median(rr[rr > 800]); low = rr < ref * 0.06; runs = []; i = 0
        while i < m:
            if low[i]:
                j = i
                while j < m and low[j]: j += 1
                if i > 12 and j < m - 12 and (j - i) * 5 <= 150: runs.append(((i * 5), (j - i) * 5))
                i = j
            else: i += 1
        res[t]['lines'][k] = {'dur': round(len(y) / sr, 3), 'dips': len(runs), 'dips_per_s': round(len(runs) / (len(y) / sr), 2), 'rms': int(np.sqrt((y ** 2).mean()))}
json.dump(res, open(O / 'candidates.json', 'w'), indent=1)
for t, v in res.items(): print(t, v['cuts'], v['gap_ms'], {k: (d['dur'], d['dips_per_s']) for k, d in v['lines'].items()})
