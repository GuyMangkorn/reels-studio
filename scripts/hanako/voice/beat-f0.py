"""Per-beat F0 median and spread, rate and centroid of the final read (Editor, 31 Oct 2026). Drift proxy, not listening.
Autocorrelation 70-320 Hz over voiced 40 ms frames (peak >= 300 of 32767), as in scripts/narration/voice-match.py.
Run with the Whisper venv (numpy): python3 -I out/hanako-voice/final/beat-f0.py <wav> <measure.json>
"""
import array, json, subprocess, sys
import numpy as np

wav, measure = sys.argv[1], json.load(open(sys.argv[2], encoding='utf-8'))
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', wav, '-ac', '1', '-ar', '48000', '-f', 's16le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, dtype=np.int16).astype(np.float64)
R = 48000
def f0_stats(seg):
    n = int(0.040 * R); lo, hi = int(R / 320), int(R / 70)
    f0s = []
    for i in range(0, len(seg) - n, n // 2):
        fr = seg[i:i + n]
        if np.max(np.abs(fr)) < 300: continue
        fr = fr - fr.mean()
        ac = np.correlate(fr, fr, 'full')[n - 1:]
        if ac[0] <= 0: continue
        k = lo + int(np.argmax(ac[lo:hi]))
        if ac[k] / ac[0] > 0.5: f0s.append(R / k)
    f0s = np.array(f0s)
    return (round(float(np.median(f0s)), 1), round(float(np.percentile(f0s, 90) - np.percentile(f0s, 10)), 1), len(f0s)) if len(f0s) > 5 else (None, None, len(f0s))
for beat, info in measure['beats'].items():
    a, b = int(info['segStart'] * R), int(info['segEnd'] * R)
    med, spread, nv = f0_stats(x[a:b])
    print(beat, 'F0 median', med, 'Hz spread(p90-p10)', spread, 'voiced frames', nv)
