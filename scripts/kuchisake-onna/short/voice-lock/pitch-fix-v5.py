"""KSO voice lock v5: pitch fix on the word โทษ in NARR `ขอโทษนะ` (S03-B02, anchor KSO-A16), B06 clip only.

v5 = v4 with a larger shift. Source is still the v3 B06 clip, never v4, so the shift is the total from v3: +3.0 st
(v4 was +1.5 st). The user listened to v4 (1 Nov 2026): "not sharp at all", wants a bit more pitch on โทษ.
Source: the v3 B06 clip (Erinome read, take2, trimmed 0.30-16.58 s; segments/B06.wav, 16.28 s, 48 kHz mono PCM16).
The word is shifted by +PITCH_ST semitones only (`--st` overrides it for a back-off run, for example 2.5). Everything
outside the crossfades is copied sample for sample, so the clip keeps its length (16.28 s, 30 fps slot unchanged) and
its pace.

Method (ffmpeg only, no extra dependency): the window CONTEXT (0.95 s) is resampled with asetrate (pitch and formants
up by the ratio), then atempo brings its length back (pitch kept). The output is lag-aligned to the source by
envelope cross-correlation, gain-matched on the span, and blended in with raised-cosine crossfades placed in the
silent gaps before and after the word (measured 14.38-14.44 s and 14.73-14.78 s clip time). Formants move with the pitch
(about +9 % at +1.5 st, about +19 % at +3.0 st), the usual limit of this method (the voice-tuning skill calls this the
SHIFT(k) route). v3 measured โทษ vowel median F0 178 Hz; v4 (+1.5 st) measured 195.5 Hz.

Run (worktree root): python3 -I scripts/kuchisake-onna/short/voice-lock/pitch-fix-v5.py \
    --src out/kso-ep01-short/voice-lock-r3/segments/B06.wav --out out/kso-ep01-short/voice-lock-v5/segments-v5/B06.wav \
    --qa out/kso-ep01-short/voice-lock-v5/qa/pitch-fix-v5.json [--st 3.0]
Needs ffmpeg and the Whisper venv (numpy only for this script; voice-match.py gives the F0 rule).
Proxy QA only: no listening is done by the script or the agent.
"""
import argparse, importlib.util, json, subprocess, tempfile, wave
from pathlib import Path
import numpy as np

RATE = 48000
PITCH_ST = 3.0                      # semitones, up, total from v3 (v4 was 1.5)
CONTEXT = (14.10, 15.05)            # clip seconds fed to the shifter (context for the time-scale)
SPAN = (14.42, 14.74)               # the word โทษ (voiced core, between the silent gaps)
RAMP_IN = (14.36, 14.42)            # crossfade into the shifted span (gap 14.38-14.44)
RAMP_OUT = (14.74, 14.79)           # crossfade out of it (closure 14.74-14.78, then นะ)
VM = Path('scripts/narration/voice-match.py')


def read_wav(path):
    with wave.open(str(path), 'rb') as w:
        assert w.getnchannels() == 1 and w.getsampwidth() == 2 and w.getframerate() == RATE, path
        return np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float64) / 32768.0


def write_wav(path, x):
    pcm = np.clip(np.round(x * 32768.0), -32768, 32767).astype('<i2')
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(RATE)
        w.writeframes(pcm.tobytes())


def pitch_shift(x, st, tmpdir):
    """asetrate up by the ratio, aresample back to 48 kHz, atempo back to the input length (pitch kept)."""
    ratio = 2 ** (st / 12)
    src, dst = Path(tmpdir) / 'ctx_in.wav', Path(tmpdir) / 'ctx_shift.wav'
    write_wav(src, x)
    af = f'asetrate={RATE * ratio:.4f},aresample={RATE},atempo={1 / ratio:.6f}'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(src), '-af', af, '-ac', '1', '-ar', str(RATE),
                    '-c:a', 'pcm_s16le', str(dst)], check=True)
    return read_wav(dst)


def envelope_db(x, blk=int(RATE * 0.005)):
    n = len(x) // blk
    e = np.sqrt(np.mean(x[:n * blk].reshape(n, blk) ** 2, axis=1) + 1e-12)
    return 20 * np.log10(e)


def best_lag(ref, sig, max_ms=40):
    """Samples to advance sig so that its envelope lines up with ref's (5 ms envelope, +-max_ms)."""
    a, b = envelope_db(ref) - np.mean(envelope_db(ref)), envelope_db(sig) - np.mean(envelope_db(sig))
    best, arg = -1e9, 0
    m = int(max_ms / 5)
    for k in range(-m, m + 1):
        if k >= 0:
            c = np.dot(a[:len(a) - k], b[k:]) if k else np.dot(a, b)
        else:
            c = np.dot(a[-k:], b[:len(b) + k])
        if c > best:
            best, arg = c, k
    return arg * int(RATE * 0.005)


def smooth(t, lo, hi):
    """0 before lo, 1 after hi, raised-cosine in between."""
    w = np.clip((t - lo) / (hi - lo), 0.0, 1.0)
    return 0.5 - 0.5 * np.cos(np.pi * w)


def f0_span(x, a, b):
    spec = importlib.util.spec_from_file_location('vm', VM)
    vm = importlib.util.module_from_spec(spec); spec.loader.exec_module(vm)
    seg = x[int(a * RATE):int(b * RATE)]
    f0s = []
    win, hop = int(0.040 * RATE), int(0.010 * RATE)
    lo_, hi_ = int(RATE / 320), int(RATE / 70)
    for i in range(0, len(seg) - win, hop):
        fr = seg[i:i + win]
        if np.sqrt(np.mean(fr ** 2)) < 0.01:
            continue
        f = fr - np.mean(fr)
        ac = np.correlate(f, f, mode='full')[win - 1:]
        if ac[0] <= 0:
            continue
        ac = ac / ac[0]
        k = int(np.argmax(ac[lo_:hi_]))
        if ac[lo_ + k] > 0.5:
            f0s.append(RATE / (lo_ + k))
    if not f0s:
        return {'median': None, 'voiced_frames': 0}
    f = np.array(f0s)
    return {'median': round(float(np.median(f)), 1), 'p10': round(float(np.percentile(f, 10)), 1),
            'p90': round(float(np.percentile(f, 90)), 1), 'voiced_frames': len(f)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--src', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--qa', required=True)
    ap.add_argument('--st', type=float, default=PITCH_ST, help='semitones up from the v3 source (default 3.0)')
    a = ap.parse_args()
    x = read_wav(a.src)
    t0 = CONTEXT[0]
    i0, i1 = int(round(CONTEXT[0] * RATE)), int(round(CONTEXT[1] * RATE))
    ctx = x[i0:i1]
    with tempfile.TemporaryDirectory(dir=Path(a.out).parent) as tmp:
        shifted = pitch_shift(ctx, a.st, tmp)
    # align: the shifter's output is delayed by a few ms; lag from the envelope, then cut to the context length.
    # The shifter's length can differ from the context (atempo at +3 st returned 25 ms less); best_lag needs equal
    # lengths, so it reads a copy padded or cut to the context length (v4 at +1.5 st happened to match).
    n_shift = len(shifted)
    probe = shifted[:len(ctx)] if len(shifted) >= len(ctx) else np.pad(shifted, (0, len(ctx) - len(shifted)))
    lag = best_lag(ctx, probe)
    shifted = np.concatenate([shifted[lag:], np.zeros(max(0, lag))]) if lag >= 0 else np.concatenate([np.zeros(-lag), shifted[:lag]])
    shifted = shifted[:len(ctx)] if len(shifted) >= len(ctx) else np.pad(shifted, (0, len(ctx) - len(shifted)))
    # gain match on the span (time-scaling and shifting change the level a little)
    s0, s1 = int(round((SPAN[0] - t0) * RATE)), int(round((SPAN[1] - t0) * RATE))
    g = np.sqrt(np.mean(ctx[s0:s1] ** 2)) / np.sqrt(np.mean(shifted[s0:s1] ** 2))
    shifted = shifted * g
    # blend back into the source over the context window
    t = t0 + np.arange(len(ctx)) / RATE
    w = smooth(t, *RAMP_IN) * (1 - smooth(t, *RAMP_OUT))
    y = x.copy()
    y[i0:i1] = (1 - w) * ctx + w * shifted
    write_wav(a.out, y)
    # QA numbers
    d = np.nonzero(np.abs(y - x) > 0)[0]
    edge_ref = x[i1 - 1] if i1 < len(x) else 0
    before = f0_span(x, SPAN[0], SPAN[1]); after = f0_span(y, SPAN[0], SPAN[1])
    vowel_before = f0_span(x, 14.58, 14.72); vowel_after = f0_span(y, 14.58, 14.72)
    qa = {
        'method': 'ffmpeg asetrate+aresample+atempo on the context window; envelope lag alignment; span gain match; raised-cosine blend in the silent gaps',
        'src': a.src, 'out': a.out, 'pitch_st': a.st, 'ratio': round(2 ** (a.st / 12), 5),
        'context_s': list(CONTEXT), 'span_s': list(SPAN), 'ramp_in_s': list(RAMP_IN), 'ramp_out_s': list(RAMP_OUT),
        'lag_samples': int(lag), 'shifter_out_samples': int(n_shift), 'context_samples': int(len(ctx)),
        'span_gain_db': round(float(20 * np.log10(g)), 3),
        'samples_src': int(len(x)), 'samples_out': int(len(y)), 'length_s': round(len(y) / RATE, 3),
        'changed_window_s': [round(float(d[0]) / RATE, 4), round(float(d[-1]) / RATE, 4)] if len(d) else None,
        'changed_samples': int(len(d)),
        'f0_span_before': before, 'f0_span_after': after,
        'f0_vowel_1458_1472_before': vowel_before, 'f0_vowel_1458_1472_after': vowel_after,
        'rms_span_db_before': round(float(20 * np.log10(np.sqrt(np.mean(x[int(SPAN[0]*RATE):int(SPAN[1]*RATE)] ** 2)))), 2),
        'rms_span_db_after': round(float(20 * np.log10(np.sqrt(np.mean(y[int(SPAN[0]*RATE):int(SPAN[1]*RATE)] ** 2)))), 2),
        'peak_src_dbfs': round(float(20 * np.log10(np.max(np.abs(x)))), 2),
        'peak_out_dbfs': round(float(20 * np.log10(np.max(np.abs(y)))), 2),
        'max_step_at_splice_before': round(float(np.max(np.abs(np.diff(x[int((RAMP_IN[0]-0.01)*RATE):int((RAMP_IN[0]+0.01)*RATE)])))), 5),
        'max_step_at_splice_after': round(float(np.max(np.abs(np.diff(y[int((RAMP_IN[0]-0.01)*RATE):int((RAMP_IN[0]+0.01)*RATE)])))), 5),
        'note': 'proxy QA only (Whisper word check and F0 numbers); nobody listened',
    }
    Path(a.qa).write_text(json.dumps(qa, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(json.dumps({k: qa[k] for k in ['lag_samples', 'span_gain_db', 'samples_out', 'changed_window_s', 'f0_span_before', 'f0_span_after', 'f0_vowel_1458_1472_before', 'f0_vowel_1458_1472_after', 'rms_span_db_before', 'rms_span_db_after']}, ensure_ascii=False))


if __name__ == '__main__':
    main()
