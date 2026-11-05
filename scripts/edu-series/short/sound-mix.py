#!/usr/bin/env python3
"""EDU-EP01-SHORT W5.3 sound stem (Editor, 4 Nov 2026): builds the whole non-voice sound (pad, clock, wind, one-shots, plucks, gasp)
as ONE 62.000 s stereo 48 kHz stem from the shared library, per EDU-SHEETS-R1.1 (scene-sheets.md sound plan and per-shot Sound lines).
Why a stem: the sheet needs frame-exact gain curves, a hard digital-zero gap f535-550 on every layer, and a pad/clock that match across the
f1860 -> f0 seam; `video.audio[]` only has volume + fades. The timeline plays the stem as one `audio[]` track and the narration as `narration`.
Levels: "dB re narrator" = loudness of beds re the narration (-16.1 LUFS); one-shots are set by peak against the narrator peak (-1.5 dBFS).
All library sounds are generated, not listened (measured only).

Usage (needs numpy + soundfile, e.g. out/voice-venv):
  python -I scripts/edu-series/short/sound-mix.py <outDir>
Writes <outDir>/EDU-EP01-SHORT-sound-stem-v3.wav, <outDir>/EDU-EP01-SHORT-mix-check.wav (narration + stem, for measuring) and cues.json.
"""
import json, os, re, subprocess, sys
import numpy as np, soundfile as sf

SR = 48000
FPS = 30
TOTAL = 1860
LIB = os.path.expanduser('~/ReelsStore/library/sound/')
NARR = os.path.expanduser('~/ReelsStore/projects/EDU/audio/voice-lock-v1/EDU-EP01-SHORT-narration-kore-v1.wav')
NARR_LUFS, NARR_PEAK = -16.1, -1.5  # measured on the Remotion render: the mono narration plays at -16.1 LUFS in the stereo mix (equal-power pan), so the v1 stem calibrated to -13.1 was 3 dB hot
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
N = TOTAL * SR // FPS  # 62.000 s exactly
fs = lambda f: int(round(f * SR / FPS))


def load(rel):
    x, sr = sf.read(LIB + rel if not rel.startswith('/') else rel, always_2d=True)
    assert sr == SR, (rel, sr)
    if x.shape[1] == 1: x = np.repeat(x, 2, 1)
    return x[:, :2]


def lufs(x):
    p = subprocess.run(['ffmpeg', '-v', 'info', '-nostats', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'ebur128=peak=true', '-f', 'null', '-'], input=x.astype('<f4').tobytes(), capture_output=True)
    t = p.stderr.decode()
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', t)[-1])


def db(g): return 10 ** (g / 20)
def peak_db(x): return 20 * np.log10(np.abs(x).max() + 1e-12)


def curve(points, n=N):
    """Piecewise-linear dB curve over frames; two points on the same frame = hard step; None = -inf (digital zero)."""
    g = np.zeros(n)
    fr = np.arange(n) * FPS / SR
    pts = sorted(points, key=lambda p: p[0])
    for (f0, d0), (f1, d1) in zip(pts[:-1], pts[1:]):
        m = (fr >= f0) & (fr < f1) if f1 > f0 else None
        if m is None: continue
        if d0 is None or d1 is None:
            lin = np.zeros(m.sum()) if (d0 is None and d1 is None) else None
            if lin is None:
                a = 0.0 if d0 is None else db(d0); b = 0.0 if d1 is None else db(d1)
                lin = np.linspace(a, b, m.sum())
            g[m] = lin
        else:
            g[m] = db(np.interp(fr[m], [f0, f1], [d0, d1]))
    last = pts[-1]
    g[fr >= last[0]] = 0 if last[1] is None else db(last[1])
    return g


stem = np.zeros((N, 2))
log = []


def add(x, at_f, gain_db, label, trim=0.0, fade_in=0.004, fade_out=0.02):
    x = x[int(trim * SR):].copy()
    k = min(int(fade_in * SR), len(x)); x[:k] *= np.linspace(0, 1, k)[:, None]
    k = min(int(fade_out * SR), len(x)); x[-k:] *= np.linspace(1, 0, k)[:, None]
    s = fs(at_f); e = min(N, s + len(x))
    stem[s:e] += x[:e - s] * db(gain_db)
    log.append({'cue': label, 'at_frame': at_f, 'gain_db': round(gain_db, 2)})


def shot(rel, at_f, db_re_narr, label, **kw):
    """One-shot: peak = narrator peak + dB."""
    x = load(rel)
    add(x, at_f, NARR_PEAK + db_re_narr - peak_db(x), label, **kw)


# ---- pad (62.000 s loop, level 0 = B01 = -16 dB re narrator LUFS) ----
pad = load('music/bed/bed_edu1-warm-pad-loop62_01.wav')
assert len(pad) == N
pad_g = curve([(0, 0), (161, 0), (180, 1), (274, 1), (300, 2), (331, 2), (411, -8), (535, -24), (535, None), (579, None), (603, 1),
               (719, 1), (723, -1), (1198, -1), (1238, -4), (1269, -4), (1290, -1), (1483, -1), (1487, 1), (1746, 1), (1859.0, 0), (1860, 0)])
base = NARR_LUFS - 16 - lufs(pad)
stem += pad * pad_g[:, None] * db(base)
log.append({'cue': 'pad', 'gain_db': round(base, 2), 'note': 'level 0 = -16 dB re narrator; arc per sheet; hard zero 535-579, 24 f return'})

# ---- clock: one tick from the library loop, repeated every 62/67 s so the layer is periodic at the seam ----
ck = load('sfx/tension/tension_clock-pulse_01.wav')
tick = ck[int(4.60 * SR):int(5.52 * SR)].copy()
tick[:int(0.01 * SR)] *= np.linspace(0, 1, int(0.01 * SR))[:, None]
tick[-int(0.03 * SR):] *= np.linspace(1, 0, int(0.03 * SR))[:, None]
clock = np.zeros((N, 2)); P = N / 67.0
for k in range(67):
    s = int(round(0.30 * SR + k * P)) % N
    seg = tick[:N - s] if s + len(tick) > N else tick
    clock[s:s + len(seg)] += seg
    if s + len(tick) > N:  # wrap the tail across the seam
        clock[:len(tick) - (N - s)] += tick[N - s:]
clock_g = curve([(0, -24), (161, -24), (170, -27), (274, -27), (324, -30), (331, -30), (371, None), (565, None), (565, -34), (578, -24), (719, -24), (719, None), (722, None), (1483, None), (1483, -24), (1582, -24), (1586, -22), (1637, -22), (1641, -24), (1860, -24)])
clock_base = NARR_LUFS - lufs(clock)
stem += clock * clock_g[:, None] * db(clock_base)
log.append({'cue': 'clock (62/67 s tick grid)', 'gain_db': round(clock_base, 2), 'note': 'gain curve dB re narrator LUFS; off 371-565 and 719-1483; hard zero 535-550'})

# ---- wind (dramatised, labelled fiction): f331-535 rising, hard cut at 535 ----
wind = load('ambience/outdoor/outdoor_wind-open-roundabout_01.wav')
wind_seg = wind[:fs(535 - 331)]
wind_g = curve([(0, -40), (80, -30), (131, -23), (135, -22.5), (136, -18.5), (145, -21.5), (159, -20), (203, -6), (204, None)], n=len(wind_seg))
# frames are shot-relative here: 0 = f331; the +4 dB rise sits at SH02 L56 = f467 = 136
wb = NARR_LUFS - lufs(wind)
stem[fs(331):fs(331) + len(wind_seg)] += wind_seg * wind_g[:, None] * db(wb)
log.append({'cue': 'wind', 'at_frame': 331, 'gain_db': round(wb, 2), 'note': '-40 -> -30 (SH01) -> -20 (SH02, +4 dB rise at f467) -> -6 at f534, digital zero from f535'})

# ---- one-shots (gain = dB re narrator peak) ----
whoosh = load('sfx/whoosh/whoosh_air-swish-rising_01.wav')
add(whoosh, 490, NARR_PEAK - 12 - peak_db(whoosh), 'whoosh f490 (peak ~f495)', trim=0.35, fade_in=0.015)
shot('sfx/pulse/pulse_underwater-soft-thump_01.wav', 550, -12, 'thump jolt f550 (onset +3 f into file peak)')
g = load('sfx/vocal/vocal_gasp-young-woman_01.wav')
# level, not peak: the sheet asks 3 dB under the narrator; narrator speech RMS on the render is -18.8 dBFS (L07 f579-715), so the gasp's whole-file RMS = -21.8 dBFS (peak about -7.3).
rms_db = 20 * np.log10(np.sqrt((g.mean(1) ** 2).mean()))
add(g, 552, -21.8 - rms_db, 'gasp L06 f552 (RMS -21.8 dBFS = narrator -3 dB)')
for f, d, n in [(127, -24, 'B01-SH02 L3 pillow'), (201, -24, 'B02-SH01 L40'), (556, -20, 'B03-SH05 L6 blanket'), (583, -18, 'B04-SH01 L4 sit-up'), (1058, -28, 'B05-SH04 L50'), (1515, -26, 'B07-SH01 L32')]:
    shot('sfx/foley/foley_hoodie-hood-pull_01.wav', f, d, f'fabric {n}')
shot('sfx/reveal/reveal_glass-shimmer-soft_01.wav', 637, -26, 'name-card shimmer f637')
for f, d in [(850, -20), (862, -20), (1333, -18), (1359, -18), (1390, -18), (1419, -18)]:
    shot('sfx/ui/ui_pop_01.wav', f, d, f'pop f{f}')
# catch click: lowpassed impact
imp = load('sfx/impact/impact_hit-punch_01.wav')
spec = np.fft.rfft(imp, axis=0); fr = np.fft.rfftfreq(len(imp), 1 / SR)
spec[fr > 1200] *= 0.05
imp = np.fft.irfft(spec, n=len(imp), axis=0)
add(imp, 977, NARR_PEAK - 18 - peak_db(imp), 'catch click f977 (lowpass 1.2 kHz)')
shot('sfx/pulse/pulse_underwater-soft-thump_01.wav', 1161, -26, 'soft thump B05-SH05 f1161')
# six soft plucked notes (B05) then sparkle on the B06 icons (softer)
PL = lambda i: f'instrument/pluck/pluck_soft-note-0{i}_01.wav'
for f, i, d in [(757, 1, -20), (850, 2, -20), (862, 3, -20), (896, 4, -20), (1018, 5, -20), (1173, 6, -20), (1333, 3, -26), (1359, 5, -26), (1390, 2, -26), (1419, 6, -26)]:
    shot(PL(i), f, d, f'pluck {i} f{f}')

# ---- hard silence f535-550 on every layer: verify digital zero ----
z0, z1 = fs(535), fs(550)
stem[z0:z1] = 0.0
# the gasp-adjacent thump starts at 550 by sheet; nothing before it
assert np.abs(stem[z0:z1]).max() == 0.0
stem *= 1.0
pk = peak_db(stem)
assert pk < -1.0, pk
sf.write(f'{OUT}/EDU-EP01-SHORT-sound-stem-v3.wav', stem, SR, subtype='PCM_24')

nar, sr = sf.read(NARR, always_2d=True); assert sr == SR, sr
nar2 = (np.repeat(nar, 2, 1) * 10 ** (-3 / 20)) if nar.shape[1] == 1 else nar[:, :2]  # equal-power pan -3 dB, as Remotion's mono downmix
mix = np.zeros((N, 2)); mix[:min(N, len(nar2))] += nar2[:N]
mix += stem
sf.write(f'{OUT}/EDU-EP01-SHORT-mix-check.wav', mix, SR, subtype='PCM_24')
report = {
    'stem_peak_dbfs': round(pk, 2), 'stem_lufs': round(lufs(stem), 2), 'narration_lufs': round(lufs(nar2), 2),
    'mix_lufs': round(lufs(mix), 2), 'mix_peak_dbfs': round(peak_db(mix), 2), 'seam_zero_f535_550': True,
    'seam': {'stem_first_50ms_rms_db': round(20 * np.log10(np.sqrt((stem[:2400] ** 2).mean()) + 1e-12), 1), 'stem_last_50ms_rms_db': round(20 * np.log10(np.sqrt((stem[-2400:] ** 2).mean()) + 1e-12), 1)},
    'cues': log}
json.dump(report, open(f'{OUT}/cues.json', 'w'), indent=1)
print({k: v for k, v in report.items() if k != 'cues'})
