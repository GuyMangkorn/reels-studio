"""KSO voice lock v5 check: what changed between v3, v4 and v5, and the proxy checks of the โทษ shift (+3.0 st from v3).

Writes one JSON (qa/v5-check.json): sample-level diff of the decoded tracks (v3 vs v5, v4 vs v5; changed frames), the
amplitude JSON diff, the โทษ F0 contour (autocorrelation 70-450 Hz, so a rising end above the 320 Hz cap of
pitch-fix-v5.py's QA is not cut off), the largest F0 step between 10 ms frames (semitones), the splice residuals at both
crossfades, 4-8 kHz and 8-16 kHz energy of the word, the residual timing lag of the word and its edges, and the B06 proxy
ASR (Whisper large-v3-turbo, letters ratio as in v4-check.py) for v3, v4 and v5.
v4 is read from the store (projects/legacy/KSO/audio/voice-lock-v4), so the A/B baseline is the stored file itself.
Proxy only: nobody listened. Thai ASR is rough; a matching transcript does not prove the pitch is right.

Run (worktree root, Whisper venv): HF_HUB_OFFLINE=1 out/whisper-venv/bin/python -I \
    scripts/kuchisake-onna/short/voice-lock/v5-check.py --qa out/kso-ep01-short/voice-lock-v5/qa/v5-check.json
"""
import argparse, difflib, importlib.util, json, os, re, unicodedata, wave
from pathlib import Path
import numpy as np

STORE = Path(os.environ.get('REELS_STORE') or Path.home() / 'ReelsStore')
V3_TRACK = Path('out/kso-ep01-short/voice-lock-r3/final/KSO-EP01-SHORT_narration_voicelock-v3.mp3')
V4_TRACK = STORE / 'projects/legacy/KSO/audio/voice-lock-v4/final/KSO-EP01-SHORT_narration_voicelock-v4.mp3'
V5_TRACK = Path('out/kso-ep01-short/voice-lock-v5/final/KSO-EP01-SHORT_narration_voicelock-v5.mp3')
V3_AMP = Path('out/kso-ep01-short/voice-lock-r3/final/KSO-EP01-SHORT_narration_voicelock-v3.amplitude.json')
V4_AMP = STORE / 'projects/legacy/KSO/audio/voice-lock-v4/final/KSO-EP01-SHORT_narration_voicelock-v4.amplitude.json'
V5_AMP = Path('out/kso-ep01-short/voice-lock-v5/final/KSO-EP01-SHORT_narration_voicelock-v5.amplitude.json')
V3_CLIP = Path('out/kso-ep01-short/voice-lock-r3/segments/B06.wav')
V4_CLIP = STORE / 'projects/legacy/KSO/audio/voice-lock-v4/segments-v4/B06.wav'
V5_CLIP = Path('out/kso-ep01-short/voice-lock-v5/segments-v5/B06.wav')
VM = Path('scripts/narration/voice-match.py')
TAG = re.compile(r'<[^>]+>')
FPS, RATE = 30, 48000
WORD = (14.42, 14.74)         # โทษ with its silent gaps (SPAN in pitch-fix-v5.py)
VOWEL = (14.58, 14.72)
VOWEL_END = (14.58, 14.74)    # rising end: the last voiced frames before the closure
RAMP_IN = (14.36, 14.42)
RAMP_OUT = (14.74, 14.79)


def letters(text):
    text = TAG.sub('', text)
    keep = []
    for ch in text:
        c = unicodedata.category(ch)[0]
        if c in 'LN' or '฀' <= ch <= '๿':
            keep.append(ch.lower())
    return ''.join(keep)


def load_vm():
    spec = importlib.util.spec_from_file_location('vm', VM)
    vm = importlib.util.module_from_spec(spec); spec.loader.exec_module(vm)
    return vm


def read_wav(path):
    with wave.open(str(path), 'rb') as w:
        assert w.getnchannels() == 1 and w.getsampwidth() == 2 and w.getframerate() == RATE, path
        return np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float64) / 32768.0


def db(v):
    return round(float(20 * np.log10(np.sqrt(np.mean(v ** 2)) + 1e-12)), 2)


def f0_contour(x, a, b, fmax=450.0):
    """[(t, f0)] every 10 ms in [a, b): 40 ms autocorrelation; voiced when RMS >= 0.01 and the normalized peak > 0.5."""
    out = []
    win, hop = int(0.040 * RATE), int(0.010 * RATE)
    lo, hi = int(RATE / fmax), int(RATE / 70)
    i0, i1 = int(round(a * RATE)), int(round(b * RATE))
    for i in range(i0, i1 - win, hop):
        fr = x[i:i + win]
        if np.sqrt(np.mean(fr ** 2)) < 0.01:
            continue
        f = fr - np.mean(fr)
        ac = np.correlate(f, f, mode='full')[win - 1:]
        if ac[0] <= 0:
            continue
        ac = ac / ac[0]
        k = int(np.argmax(ac[lo:hi])) + lo
        if ac[k] > 0.5:
            out.append((round(i / RATE, 3), RATE / k))
    return out


def summarize(c):
    if not c:
        return {'median': None, 'max': None, 'voiced_frames': 0, 'last4_hz': []}
    f = np.array([v for _, v in c])
    return {'median': round(float(np.median(f)), 1), 'max': round(float(f.max()), 1), 'voiced_frames': len(c),
            'last4_hz': [round(v, 1) for _, v in c[-4:]]}


def max_step_st(c):
    """Largest F0 change between consecutive 10 ms voiced frames, in semitones."""
    if len(c) < 2:
        return None
    t = np.array([a for a, _ in c]); f = np.array([v for _, v in c])
    ok = np.diff(t) <= 0.0105
    st = np.abs(12 * np.log2(f[1:] / f[:-1]))[ok]
    return round(float(st.max()), 2) if st.size else None


def env(v, blk=int(RATE * 0.005)):
    n = len(v) // blk
    return 20 * np.log10(np.sqrt(np.mean(v[:n * blk].reshape(n, blk) ** 2, axis=1) + 1e-12))


def lag_ms(x, y, a, b, max_ms=40):
    """Residual timing of y against x over [a, b): the shift (ms, 5 ms steps) of y that best matches the envelope of x."""
    i0, i1 = int(round(a * RATE)), int(round(b * RATE))
    ref = env(x[i0:i1]); ref = ref - ref.mean()
    best, arg = -2.0, 0
    m = int(max_ms / 5)
    blk = int(RATE * 0.005)
    for k in range(-m, m + 1):
        sig = env(y[i0 + k * blk:i1 + k * blk]); sig = sig - sig.mean()
        c = float(np.dot(ref, sig) / (np.linalg.norm(ref) * np.linalg.norm(sig) + 1e-12))
        if c > best:
            best, arg = c, k
    return {'lag_ms': arg * 5, 'corr': round(best, 3)}


def splice(x, y, a, b):
    i0, i1 = int(round(a * RATE)), int(round(b * RATE))
    sx, sy = x[i0:i1], y[i0:i1]
    return {'src_rms_dbfs': db(sx), 'out_rms_dbfs': db(sy), 'resid_rms_dbfs': db(sy - sx),
            'max_abs_resid': round(float(np.max(np.abs(sy - sx))), 5),
            'max_step_src': round(float(np.max(np.abs(np.diff(sx)))), 5),
            'max_step_out': round(float(np.max(np.abs(np.diff(sy)))), 5)}


def band_db(v, lo, hi):
    w = v * np.hanning(len(v))
    s = np.abs(np.fft.rfft(w)) ** 2
    f = np.fft.rfftfreq(len(v), 1 / RATE)
    return round(float(10 * np.log10(s[(f >= lo) & (f < hi)].sum() + 1e-18)), 2)


DESIGNED_TRACK_S = (77.20, 77.70)   # changed samples measured 77.21-77.66 s (strong part 77.24-77.64 s); MP3 spill runs to 79.16 s


def pcm_diff(p, q):
    n = min(len(p), len(q)); per = RATE // FPS
    d = np.abs(p[:n] - q[:n])
    ch = np.unique((np.arange(n) // per)[d > 1e-4])
    outside = np.ones(n, dtype=bool); outside[int(DESIGNED_TRACK_S[0] * RATE):int(DESIGNED_TRACK_S[1] * RATE)] = False
    return {'frames_gt_1e-4': [int(c) for c in ch], 'range': [int(ch[0]), int(ch[-1])] if len(ch) else None,
            'max_abs': round(float(d.max()), 5), 'max_abs_outside_designed_window': round(float(d[outside].max()), 6)}


def amp_diff(a, b):
    idx = [i for i, (x, y) in enumerate(zip(a, b)) if x != y]
    return {'len': [len(a), len(b)], 'differs_at_frames': idx, 'range': [idx[0], idx[-1]] if idx else None,
            'max_abs_diff_peak_normalized': round(max((abs(a[i] - b[i]) for i in idx), default=0), 4),
            'differs_more_than_0.001': [i for i in idx if abs(a[i] - b[i]) > 0.001]}


def asr_clip(model, path, target):
    segs, _ = model.transcribe(str(path), language='th', word_timestamps=True, temperature=0.0, vad_filter=False)
    words = [{'w': w.word.strip(), 's': round(w.start, 3), 'e': round(w.end, 3)} for s in segs for w in (s.words or [])]
    text = ''.join(w['w'] for w in words)
    ratio = difflib.SequenceMatcher(None, letters(target), letters(text)).ratio()
    return {'asr': text, 'ratio': round(ratio, 3), 'apology_words_s': [w for w in words if 13.5 <= w['s'] <= 15.5]}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--qa', required=True)
    ap.add_argument('--skip-asr', action='store_true')
    a = ap.parse_args()
    vm = load_vm()
    t3, t4, t5 = vm.decode(V3_TRACK), vm.decode(V4_TRACK), vm.decode(V5_TRACK)
    per = RATE // FPS
    amp3, amp4, amp5 = (json.loads(p.read_text()) for p in (V3_AMP, V4_AMP, V5_AMP))
    x3, x4, x5 = read_wav(V3_CLIP), read_wav(V4_CLIP), read_wav(V5_CLIP)
    assert len(x3) == len(x4) == len(x5), 'the B06 clip keeps its length'
    tbl = {}
    for name, x in (('v3', x3), ('v4', x4), ('v5', x5)):
        tbl[name] = {'vowel': summarize(f0_contour(x, *VOWEL)), 'vowel_end_to_closure': summarize(f0_contour(x, *VOWEL_END)),
                     'word': summarize(f0_contour(x, *WORD)), 'max_step_st_word': max_step_st(f0_contour(x, *WORD))}
    hf = {}
    for name, x in (('v3', x3), ('v4', x4), ('v5', x5)):
        w = x[int(WORD[0] * RATE):int(WORD[1] * RATE)]
        hf[name] = {'4-8kHz_dB': band_db(w, 4000, 8000), '8-16kHz_dB': band_db(w, 8000, 16000)}
    lags = {}
    for name, y in (('v4', x4), ('v5', x5)):
        lags[name] = {'before_word_14.20-14.36': lag_ms(x3, y, 14.20, 14.36), 'word_14.42-14.74': lag_ms(x3, y, *WORD),
                      'vowel_end_14.60-14.74': lag_ms(x3, y, 14.60, 14.74), 'after_word_14.79-15.00': lag_ms(x3, y, 14.79, 15.00)}
    qa = {
        'tracks': {'v3': {'file': str(V3_TRACK), 'frames': round(len(t3) / per, 3)},
                   'v4': {'file': str(V4_TRACK), 'frames': round(len(t4) / per, 3)},
                   'v5': {'file': str(V5_TRACK), 'frames': round(len(t5) / per, 3)}},
        'track_frames_v5_equal_v3': len(t5) == len(t3) and len(t5) == len(t4),
        'pcm_v3_vs_v5': pcm_diff(t3, t5), 'pcm_v4_vs_v5': pcm_diff(t4, t5),
        'amplitude_v3_vs_v5': amp_diff(amp3, amp5), 'amplitude_v4_vs_v5': amp_diff(amp4, amp5),
        'toshi_f0_hz': tbl,
        'toshi_hf_db': hf,
        'toshi_timing_lag_vs_v3': lags,
        'splice_v5_vs_v3': {'ramp_in_14.36-14.42': splice(x3, x5, *RAMP_IN), 'ramp_out_14.74-14.79': splice(x3, x5, *RAMP_OUT)},
        'splice_v4_vs_v3': {'ramp_in_14.36-14.42': splice(x3, x4, *RAMP_IN), 'ramp_out_14.74-14.79': splice(x3, x4, *RAMP_OUT)},
        'proxy_only': True, 'note': 'Proxy only: F0, HF energy and Whisper words do not prove the pitch sounds right. Nobody listened.',
    }
    if not a.skip_asr:
        import faster_whisper
        target = json.loads(Path('scripts/kuchisake-onna/short/voice-lock/tts-beats.json').read_text(encoding='utf-8'))['B06']
        model = faster_whisper.WhisperModel('large-v3-turbo', device='cpu', compute_type='int8')
        qa['asr_b06_clip'] = {'v3': asr_clip(model, V3_CLIP, target), 'v4': asr_clip(model, V4_CLIP, target),
                              'v5': asr_clip(model, V5_CLIP, target)}
    Path(a.qa).write_text(json.dumps(qa, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(json.dumps({'track_frames_v5_equal_v3': qa['track_frames_v5_equal_v3'], 'pcm_v3_vs_v5': qa['pcm_v3_vs_v5'],
                      'amp_v3_vs_v5_frames': [qa['amplitude_v3_vs_v5']['range'], len(qa['amplitude_v3_vs_v5']['differs_at_frames'])],
                      'toshi_vowel_hz': {k: tbl[k]['vowel']['median'] for k in tbl}, 'toshi_vowel_max_hz': {k: tbl[k]['vowel_end_to_closure']['max'] for k in tbl},
                      'max_step_st_word': {k: tbl[k]['max_step_st_word'] for k in tbl}}, ensure_ascii=False))
    if 'asr_b06_clip' in qa:
        print('asr ratio v3', qa['asr_b06_clip']['v3']['ratio'], 'v4', qa['asr_b06_clip']['v4']['ratio'], 'v5', qa['asr_b06_clip']['v5']['ratio'])


if __name__ == '__main__':
    main()
