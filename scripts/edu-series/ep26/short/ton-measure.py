"""Measure raw audio-studio candidates by shape (EDU-EP26-SHORT W5.2s). No numpy: ffmpeg decodes to mono s16.

Usage: python3 -I ton-measure.py <wav> [<wav> ...]
Prints per file: duration, peak dBFS, onset s (first 10 ms RMS within 25 dB of the loudest), peak time, number of
attacks (20 ms envelope rises >= 8 dB over the 60 ms before, refractory 120 ms, within 22 dB of the peak),
tail s (loudest to the first 10 ms below peak-35 dB; 'end' if never), end level dB under peak, zero-crossing
rate in kHz (a brightness proxy), and the min/max 1 s RMS span in dB (steadiness of a bed).
"""
import array, math, subprocess, sys

SR = 22050


def load(path):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True)
    a = array.array('h'); a.frombytes(r.stdout[:len(r.stdout) // 2 * 2])
    return [x / 32768 for x in a]


def db(x): return 20 * math.log10(max(x, 1e-6))


def rms_env(s, win):
    n = len(s) // win
    return [math.sqrt(sum(v * v for v in s[i * win:(i + 1) * win]) / win) for i in range(n)]


def measure(path):
    s = load(path); dur = len(s) / SR
    pk = db(max(abs(v) for v in s))
    e10 = rms_env(s, SR // 100); pe = max(e10); pi = e10.index(pe)
    onset = next(i for i, v in enumerate(e10) if db(v) > db(pe) - 25) / 100
    tail = next((((i - pi) / 100) for i in range(pi, len(e10)) if db(e10[i]) < db(pe) - 35), None)
    end_db = db(sum(e10[-5:]) / 5) - db(pe)
    e20 = rms_env(s, SR // 50); pk20 = max(e20); att = 0; last = -99; times = []
    for i in range(3, len(e20)):
        if db(e20[i]) > db(pk20) - 22 and db(e20[i]) - db(max(e20[i - 3:i]) or 1e-6) >= 8 and i - last >= 6:
            att += 1; last = i; times.append(round(i/50,2))
    zc = sum(1 for i in range(1, len(s)) if (s[i - 1] < 0) != (s[i] < 0)) / dur / 2000
    e1 = [db(v) for v in rms_env(s, SR)]
    span = (max(e1) - min(e1)) if e1 else 0
    return dict(dur=round(dur, 2), peak=round(pk, 1), onset=onset, peakT=pi / 100, attacks=att, attackT=times,
                tail=tail if tail is None else round(tail, 2), endDb=round(end_db, 1), zcrK=round(zc, 1), span1s=round(span, 1))


if __name__ == '__main__':
    for p in sys.argv[1:]:
        m = measure(p)
        print(p.split('/')[-1].replace('.wav', ''), ' '.join(f'{k}={v}' for k, v in m.items()))
