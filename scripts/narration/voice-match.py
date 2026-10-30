"""Pick the TTS variation whose narrator best matches a reference span (e.g. regenerating a drifting tail).

Metrics, measured the same way for the reference span and each candidate:
- F0 median and F0 spread (10th-90th percentile) of voiced 40 ms frames, autocorrelation 70-320 Hz;
- spectral centroid (Hann 40 ms rfft), mean over active frames;
- speech rate in TTS characters per active second (active = 10 ms blocks with peak >= 300 of 32767).
Rule: reject any candidate more than 10 % faster than the reference; among the rest, pick the smallest sum of
relative differences in F0 median, F0 spread and centroid. If none passes, say so (fall back to smaller chunks).

Config JSON: {"refWav": path, "refEnd": seconds, "refText": text, "chunkText": text,
              "candidates": [{"name": ..., "wav": path}, ...]}
Run with the Whisper venv (numpy): "<main>/.venv-whisper/bin/python" -I scripts/narration/voice-match.py \
    --config out/EP/vo/match-config.json --out out/EP/vo/voice-match.json
First used for BLOOP-EP01-SHORT (2026-10-30). Always let the user pick by ear; the score only orders the candidates.
"""
import array, json, re, subprocess, sys, unicodedata
from pathlib import Path
import numpy as np

RATE = 48000
THRESHOLD = 300


def norm(text):
    return ''.join(ch for ch in text if unicodedata.category(ch)[0] in 'LN' or '฀' <= ch <= '๿')


def decode(path, start=None, end=None):
    cmd = ['ffmpeg', '-v', 'error']
    if start is not None:
        cmd += ['-ss', f'{start:.4f}']
    if end is not None:
        cmd += ['-to', f'{end:.4f}']
    cmd += ['-i', str(path), '-ac', '1', '-ar', str(RATE), '-f', 's16le', '-']
    out = subprocess.run(cmd, capture_output=True, check=True).stdout
    s = array.array('h')
    s.frombytes(out)
    return np.frombuffer(s, dtype=np.int16).astype(np.float64) / 32768.0


def active_seconds(x):
    blk = 480
    peaks = np.array([np.max(np.abs(x[i:i + blk])) if i < len(x) else 0 for i in range(0, len(x), blk)])
    return float(np.sum(peaks >= THRESHOLD / 32768.0) * 0.01)


def f0_stats(x):
    win, hop = int(0.040 * RATE), int(0.010 * RATE)
    lo, hi = int(RATE / 320), int(RATE / 70)
    f0s = []
    rms_gate = 0.01
    for i in range(0, len(x) - win, hop):
        frame = x[i:i + win]
        if np.sqrt(np.mean(frame ** 2)) < rms_gate:
            continue
        frame = frame - np.mean(frame)
        ac = np.correlate(frame, frame, mode='full')[win - 1:]
        if ac[0] <= 0:
            continue
        ac = ac / ac[0]
        seg = ac[lo:hi]
        k = int(np.argmax(seg))
        if seg[k] > 0.5:
            f0s.append(RATE / (lo + k))
    if not f0s:
        return float('nan'), float('nan'), 0
    f = np.array(f0s)
    return float(np.median(f)), float(np.percentile(f, 90) - np.percentile(f, 10)), len(f)


def centroid(x):
    win, hop = int(0.040 * RATE), int(0.010 * RATE)
    w = np.hanning(win)
    vals = []
    for i in range(0, len(x) - win, hop):
        frame = x[i:i + win]
        if np.sqrt(np.mean(frame ** 2)) < 0.01:
            continue
        mag = np.abs(np.fft.rfft(frame * w))
        freqs = np.fft.rfftfreq(win, 1 / RATE)
        if mag.sum() > 0:
            vals.append(float(np.sum(freqs * mag) / np.sum(mag)))
    return float(np.mean(vals)) if vals else float('nan')


def metrics(x, text):
    act = active_seconds(x)
    med, spread, voiced = f0_stats(x)
    return {'f0_median_hz': round(med, 1), 'f0_spread_hz': round(spread, 1), 'voiced_frames': voiced,
            'centroid_hz': round(centroid(x), 1), 'active_s': round(act, 3), 'chars': len(norm(text)),
            'chars_per_active_s': round(len(norm(text)) / act, 3) if act else float('nan')}


def main():
    import argparse
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--config', required=True)
    ap.add_argument('--out', required=True)
    args = ap.parse_args()
    cfg = json.loads(Path(args.config).read_text(encoding='utf-8'))
    ref_x = decode(Path(cfg['refWav']), 0.0, cfg['refEnd'])
    ref = metrics(ref_x, cfg['refText'])
    cands = []
    for c in cfg['candidates']:
        x = decode(Path(c['wav']))
        m = metrics(x, cfg['chunkText'])
        m.update({'name': c['name'], 'wav': c['wav']})
        m['rateRatioVsRef'] = round(m['chars_per_active_s'] / ref['chars_per_active_s'], 3)
        m['passRate'] = m['rateRatioVsRef'] <= 1.10
        if m['passRate'] and not (np.isnan(m['f0_median_hz']) or np.isnan(ref['f0_median_hz'])):
            m['score'] = round(abs(m['f0_median_hz'] - ref['f0_median_hz']) / ref['f0_median_hz']
                               + abs(m['f0_spread_hz'] - ref['f0_spread_hz']) / max(1.0, ref['f0_spread_hz'])
                               + abs(m['centroid_hz'] - ref['centroid_hz']) / ref['centroid_hz'], 4)
        else:
            m['score'] = None
        cands.append(m)
    passing = [m for m in cands if m['passRate'] and m['score'] is not None]
    pick = min(passing, key=lambda m: m['score'])['name'] if passing else None
    out = {'reference': {'wav': cfg['refWav'], 'span_s': [0.0, cfg['refEnd']], **ref}, 'candidates': cands,
           'rule': 'reject rate > 1.10 x reference; pick min sum of relative differences (F0 median, F0 spread, centroid)',
           'pick': pick, 'fallbackNeeded': pick is None}
    Path(args.out).write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(json.dumps({'reference': ref}, ensure_ascii=False))
    for m in cands:
        print(json.dumps({k: m[k] for k in ['name', 'f0_median_hz', 'f0_spread_hz', 'centroid_hz', 'chars_per_active_s', 'rateRatioVsRef', 'passRate', 'score']}, ensure_ascii=False))
    print('PICK', pick if pick else 'NONE (fall back to two chunks)')


if __name__ == '__main__':
    main()
