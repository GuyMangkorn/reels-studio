"""One Thai line from Edge TTS in a character register (child, elderly, alternate adult), for the voice-tuning skill.
Usage: python3 -I scripts/voice-preset.py --preset woman-younger --text "..." OUT.wav [--rate +5%] [--src RAW.mp3]
       out/voice-venv/bin/python -I scripts/voice-preset.py --preset child-girl --text "..." OUT.wav
       python3 -I scripts/voice-preset.py --list
Child and elderly presets resynthesize with Praat "Change gender" (parselmouth) or the WORLD vocoder (pyworld), which
set F0, formant scale, pitch range and duration separately (no chipmunk) and add tremor, jitter, shimmer and breath.
They need the local venv (not a project requirement):
  python3 -m venv out/voice-venv && out/voice-venv/bin/pip install praat-parselmouth pyworld numpy soundfile 'setuptools<81' edge-tts==7.3.1
--src processes an existing edge-tts clip made with the preset's voice/pitch/rate instead of calling the service.
Recipes and measurements: docs/dev-findings/DF-20261029-edge-tts-voice-tuning.md. Output: 48 kHz mono WAV, two-pass loudnorm to -16 LUFS.
"""
import argparse, asyncio, json, shutil, subprocess, sys, tempfile
from pathlib import Path

P, N = 'th-TH-PremwadeeNeural', 'th-TH-NiwatNeural'
LN = 'loudnorm=I=-16:TP=-1.5:LRA=11'
VENV = 'out/voice-venv/bin/python -I scripts/voice-preset.py ...  (create it: see the module docstring)'

def shift(k):
    return f'aresample=48000,asetrate={round(48000 * k)},aresample=48000,atempo={1 / k:.5f}'

# WORLD elderly: F0 to target, narrower range, slower, ~5 Hz F0/amplitude tremor, jitter, shimmer, breathy aperiodicity
ELDER = dict(m='world', formant=0.95, rng=0.7, dur=1.1, tremor=0.05, trem_hz=5.5, jitter=0.03, shimmer=1.5, amp_trem=0.15, breath=0.6)
ELDER_STRONG = dict(ELDER, formant=0.96, rng=0.6, dur=1.12, tremor=0.07, trem_hz=5, jitter=0.035, shimmer=1.8, breath=0.75)

# name: (voice, edge pitch, edge rate or None for --rate, ffmpeg chain or resynthesis dict)
PRESETS = {
    'child-girl': (P, '+0Hz', None, dict(m='praat', f0=275, formant=1.12, rng=1.15, dur=1.1)),
    'child-girl-lively': (P, '+0Hz', None, dict(m='praat', f0=280, formant=1.12, rng=1.3, dur=1.08)),
    'child-boy': (P, '+0Hz', None, dict(m='praat', f0=250, formant=1.08, rng=1.15, dur=1.12)),
    'child-boy-niwat': (N, '+0Hz', None, dict(m='praat', f0=250, formant=1.25, rng=1.2, dur=1.12)),
    'elder-woman': (P, '+0Hz', '-20%', dict(ELDER, f0=162)),
    'elder-woman-strong': (P, '+0Hz', '-20%', dict(ELDER_STRONG, f0=165)),
    'elder-man': (N, '+0Hz', '-20%', dict(ELDER, f0=150)),
    'elder-man-strong': (N, '+0Hz', '-20%', dict(ELDER_STRONG, f0=142)),
    'woman-younger': (P, '+15Hz', None, shift(1.06)),
    'woman-lower': (P, '-20Hz', None, shift(0.93)),
    'man-bigger': (N, '-10Hz', None, f'{shift(0.9)},equalizer=f=150:t=q:w=1:g=2'),
    'man-younger': (N, '+15Hz', None, shift(1.06)),
    'woman-base': (P, '+0Hz', None, 'anull'),
    'man-base': (N, '+0Hz', None, 'anull'),
}

def praat(x, fs, f0, formant, rng, dur):
    import parselmouth
    y = parselmouth.praat.call(parselmouth.Sound(x, fs), 'Change gender', 75, 600, formant, f0, rng, dur)
    return y.values[0]

def world(x, fs, f0, formant, rng, dur, tremor, trem_hz, jitter, shimmer, amp_trem, breath, seed=1):
    import numpy as np, pyworld as pw
    r = np.random.default_rng(seed)
    f, t = pw.harvest(x, fs, f0_floor=60, f0_ceil=700, frame_period=5.0)
    sp, ap = pw.cheaptrick(x, f, t, fs), pw.d4c(x, f, t, fs)
    v = f > 0; med = np.median(f[v])
    f[v] = np.exp(np.log(f0) + rng * (np.log(f[v]) - np.log(med)))  # new median, range scaled in log-F0
    n = len(f); pos = np.linspace(0, n - 1, int(round(n * dur))); i0 = np.floor(pos).astype(int)
    i1 = np.minimum(i0 + 1, n - 1); w = pos - i0; near = np.rint(pos).astype(int)
    sp = sp[i0] * (1 - w[:, None]) + sp[i1] * w[:, None]; ap = ap[i0] * (1 - w[:, None]) + ap[i1] * w[:, None]
    f = np.where(v[near], np.where(v[i0] & v[i1], f[i0] * (1 - w) + f[i1] * w, f[near]), 0.0)
    n, k = sp.shape; v = f > 0
    src = np.arange(k) / formant; j0 = np.clip(np.floor(src).astype(int), 0, k - 1)  # formant warp of the envelope
    wf = np.clip(src - j0, 0, 1); sp = sp[:, j0] * (1 - wf) + sp[:, np.minimum(j0 + 1, k - 1)] * wf
    ph = 2 * np.pi * np.cumsum(trem_hz * (1 + 0.15 * np.convolve(r.standard_normal(n), np.ones(40) / 40, 'same'))) * 0.005
    f = np.where(v, f * (1 + tremor * np.sin(ph)) * np.exp(jitter * r.standard_normal(n)), 0.0)
    e = sp.sum(1); g = (1 + amp_trem * np.sin(ph + 0.6)) ** 2 * 10 ** (shimmer * r.standard_normal(n) / 10)
    sp = sp * np.where(e < e.max() * 1e-5, 1e-4, g)[:, None]  # keep silences silent
    hz = np.arange(k) * fs / (2 * (k - 1)); b = np.clip((hz - 600) / 2400, 0, 1) * breath
    ap = np.clip(np.where(v[:, None], ap + (1 - ap) * b, ap), 0, 1)
    return pw.synthesize(*(np.ascontiguousarray(a) for a in (f, sp, ap)), fs, 5.0)

def resynth(src, dst, p):
    try:
        import numpy as np, soundfile as sf
        import parselmouth, pyworld  # noqa: F401
    except ImportError as e:
        sys.exit(f'{e}: child/elderly presets need parselmouth and pyworld; run with {VENV}')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(src), '-ac', '1', '-ar', '24000', str(dst)], check=True)
    x, fs = sf.read(str(dst)); kw = {k: v for k, v in p.items() if k != 'm'}
    y = (praat if p['m'] == 'praat' else world)(x.astype(np.float64), fs, **kw)
    sf.write(str(dst), y / max(1e-9, np.abs(y).max()) * 0.5, fs)

def normalize(src, chain, out):
    m = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(src), '-af', f'{chain},{LN}:print_format=json', '-f', 'null', '-'],
                       capture_output=True, text=True, check=True).stderr
    j = json.loads(m[m.rindex('{'):m.rindex('}') + 1])
    ln = (f"{LN}:linear=true:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:"
          f"measured_thresh={j['input_thresh']}:offset={j['target_offset']}")
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(src), '-af', f'{chain},{ln},aresample=48000', '-ac', '1', str(out)], check=True)

async def synthesize(text, voice, rate, pitch, path, attempts=15):
    import edge_tts
    for i in range(attempts):
        try:
            return await edge_tts.Communicate(text, voice, rate=rate, pitch=pitch).save(str(path))
        except edge_tts.exceptions.NoAudioReceived:
            if i == attempts - 1: raise
            await asyncio.sleep(1 + i)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('out', nargs='?'); ap.add_argument('--preset'); ap.add_argument('--text'); ap.add_argument('--src')
    ap.add_argument('--rate', default='+5%', help='edge rate when the preset does not fix one (default +5%%)')
    ap.add_argument('--list', action='store_true')
    a = ap.parse_args()
    if a.list:
        for k, (v, p, r, c) in PRESETS.items():
            print(f'{k:19} {v.split("-")[2]:16} pitch {p:6} rate {r or "--rate":7} {c["m"] if isinstance(c, dict) else "ffmpeg"}')
        return
    if not (a.out and a.preset in PRESETS and (a.text or a.src)): ap.error('need OUT, --text (or --src) and a --preset from --list')
    voice, pitch, rate, chain = PRESETS[a.preset]
    with tempfile.TemporaryDirectory() as tmp:
        raw = Path(tmp) / 'raw.mp3'
        if a.src: shutil.copy(a.src, raw)
        else: asyncio.run(synthesize(a.text, voice, rate or a.rate, pitch, raw))
        if isinstance(chain, dict):
            resynth(raw, Path(tmp) / 'vc.wav', chain); raw, chain = Path(tmp) / 'vc.wav', 'highpass=f=70'
        Path(a.out).parent.mkdir(parents=True, exist_ok=True)
        normalize(raw, chain, a.out)
    print(f'{a.out}: {a.preset} ({voice}, pitch {pitch}, rate {rate or a.rate})')

if __name__ == '__main__':
    sys.exit(main())
