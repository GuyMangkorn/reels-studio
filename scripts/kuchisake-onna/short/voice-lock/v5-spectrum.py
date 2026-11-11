"""KSO voice lock v5 spectrum check: where the โทษ shift moves the top band, and whether a narrow tone appears.

v5 shifts the formants with the pitch (+3.0 st, ratio 1.189). The v3 source is band-limited near 13.5 kHz, so the shifted
word can carry energy above that edge. This script writes qa/v5-spectrum.json with: the 2 kHz band levels of the word
(14.42-14.74 s, Hann-windowed power, dB) for v3, v4 and v5; the 8-16 kHz peak-to-median ratio per 40 ms frame (a narrow tone
would show as a high ratio); and the largest 5 ms envelope jump at both crossfades for the source and v5.
Proxy only: nobody listened.

Run (worktree root, Whisper venv): out/whisper-venv/bin/python -I scripts/kuchisake-onna/short/voice-lock/v5-spectrum.py \
    --qa out/kso-ep01-short/voice-lock-v5/qa/v5-spectrum.json
"""
import argparse, json, os, wave
from pathlib import Path
import numpy as np

STORE = Path(os.environ.get('REELS_STORE') or Path.home() / 'ReelsStore')
CLIPS = {
    'v3': Path('out/kso-ep01-short/voice-lock-r3/segments/B06.wav'),
    'v4': STORE / 'projects/legacy/KSO/audio/voice-lock-v4/segments-v4/B06.wav',
    'v5': Path('out/kso-ep01-short/voice-lock-v5/segments-v5/B06.wav'),
}
RATE = 48000
WORD = (14.42, 14.74)
RAMPS = {'ramp_in_14.30-14.50': (14.30, 14.50), 'ramp_out_14.70-14.84': (14.70, 14.84)}


def read_wav(path):
    with wave.open(str(path), 'rb') as w:
        assert w.getnchannels() == 1 and w.getsampwidth() == 2 and w.getframerate() == RATE, path
        return np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float64) / 32768.0


def seg(x, a, b):
    return x[int(round(a * RATE)):int(round(b * RATE))]


def band_db(v, lo, hi):
    w = v * np.hanning(len(v))
    s = np.abs(np.fft.rfft(w)) ** 2
    f = np.fft.rfftfreq(len(v), 1 / RATE)
    return round(float(10 * np.log10(s[(f >= lo) & (f < hi)].sum() + 1e-18)), 2)


def peak_to_median(x, lo=8000, hi=16000):
    win, hop = int(0.040 * RATE), int(0.010 * RATE)
    f = np.fft.rfftfreq(win, 1 / RATE)
    band = (f >= lo) & (f < hi)
    out = []
    for i in range(0, len(x) - win, hop):
        fr = x[i:i + win]
        if np.sqrt(np.mean(fr ** 2)) < 0.01:
            continue
        b = (np.abs(np.fft.rfft(fr * np.hanning(win))) ** 2)[band]
        if b.sum() > 0:
            out.append(10 * np.log10(b.max() / np.median(b) + 1e-12))
    return {'frames': len(out), 'median_db': round(float(np.median(out)), 1), 'p90_db': round(float(np.percentile(out, 90)), 1),
            'max_db': round(float(np.max(out)), 1)}


def env5_db(v, blk=int(RATE * 0.005)):
    n = len(v) // blk
    return 20 * np.log10(np.sqrt(np.mean(v[:n * blk].reshape(n, blk) ** 2, axis=1) + 1e-12))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--qa', required=True)
    a = ap.parse_args()
    clips = {k: read_wav(p) for k, p in CLIPS.items()}
    bands = {}
    for k, x in clips.items():
        w = seg(x, *WORD)
        bands[k] = {f'{lo // 1000}-{(lo + 2000) // 1000}kHz': band_db(w, lo, lo + 2000) for lo in range(0, 24000, 2000)}
    qa = {
        'clips': {k: str(p) for k, p in CLIPS.items()},
        'word_s': list(WORD),
        'band_db_word': bands,
        'peak_to_median_8_16k_word': {k: peak_to_median(seg(x, *WORD)) for k, x in clips.items()},
        'envelope_jump_5ms_db': {name: {'src_v3': round(float(np.max(np.abs(np.diff(env5_db(seg(clips['v3'], *r)))))), 1),
                                        'v5': round(float(np.max(np.abs(np.diff(env5_db(seg(clips['v5'], *r)))))), 1)}
                                 for name, r in RAMPS.items()},
        'proxy_only': True, 'note': 'Proxy only: band levels and peak ratios; nobody listened.',
    }
    Path(a.qa).write_text(json.dumps(qa, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(json.dumps({'14-16kHz': {k: bands[k]['14-16kHz'] for k in bands},
                      'peak_to_median_8_16k_median': {k: qa['peak_to_median_8_16k_word'][k]['median_db'] for k in bands}}))


if __name__ == '__main__':
    main()
