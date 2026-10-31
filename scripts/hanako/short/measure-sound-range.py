#!/usr/bin/env python3
"""HANAKO-SHORT sound QA for a frame range (Editor E-R5). Measures only: nothing here is listened to.

1. Rebuilds the runtime audio mix for frames F0..F1 from the composition's own track list
   (dump-audio-tracks.mts) with the runtime rules: src/scenes/media.ts (duckGainAt, trackFadeAt) and
   src/scenes/MediaLayers.tsx (AudioTracks: Sequence start/length, trimBefore in whole frames, per-frame volume).
2. Compares the rebuild with a sound-only render of the same range (render-sound-range.mjs) and reports the residual.
3. Measures the E-R5 joins (F1778, F1940, F2046) on the render and on the bed components, MN1 against the narration
   at F1430, the BZ1/BZ2 onsets against the room tone, and the range loudness (ffmpeg ebur128, true peak, clipping).

Usage: python3 -I scripts/hanako/short/measure-sound-range.py <render.wav> <F0> <F1> <out.json> [--tracks <tracks.json>]
Needs ffmpeg/ffprobe on PATH and the locked files under public/. Output: one JSON file plus a printed summary.
"""
import array
import json
import math
import re
import subprocess
import sys
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SR, FPS = 48000, 30
SPF = SR // FPS  # samples per composition frame (1600)
NARR_START = 45  # narration startFrame (HANAKO-SHORT.mp3 starts at F45)
DURATION = 2596  # composition frames
DUCK_WINDOW, SPEECH_LEVEL = 8, 0.08  # src/scenes/media.ts duckGainAt defaults


def js_round(x):
    return math.floor(x + 0.5)


def clamp01(x):
    return 0.0 if x < 0 else (1.0 if x > 1 else x)


def db(x):
    return 20 * math.log10(x) if x > 0 else -200.0


def decode(rel, channels=2):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(ROOT / 'public' / rel), '-f', 'f32le', '-ac', str(channels), '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    a = array.array('f')
    a.frombytes(raw)
    return a


def duck_gain(amp, narr_frame, depth):
    if depth >= 1 or not amp:
        return 1.0
    c = js_round(narr_frame)
    peak = 0.0
    for f in range(c - DUCK_WINDOW, c + DUCK_WINDOW + 1):
        if 0 <= f < len(amp) and amp[f] > peak:
            peak = amp[f]
    return 1 - (1 - depth) * clamp01(peak / SPEECH_LEVEL)


def fade_gain(fi_sec, fo_sec, f, length):
    fi = js_round((fi_sec or 0) * FPS)
    fo = js_round((fo_sec or 0) * FPS)
    in_g = clamp01(f / fi) if fi > 0 else 1.0
    out_g = clamp01((length - 1 - f) / fo) if fo > 0 else 1.0
    return min(in_g, out_g)


def dump_tracks(out_json):
    subprocess.run(['node', '--import', 'tsx', str(ROOT / 'scripts/hanako/short/dump-audio-tracks.mts'), str(out_json)],
                   cwd=ROOT, check=True, capture_output=True)
    return json.loads(Path(out_json).read_text(encoding='utf-8'))


def rebuild(data, F0, F1, keep):
    """Interleaved stereo float mix for frames F0..F1 (inclusive), plus the kept components by label."""
    amp = json.loads((ROOT / 'public/narration/HANAKO-SHORT.amplitude.json').read_text(encoding='utf-8'))
    n = (F1 - F0 + 1) * SPF
    mix = [0.0] * (2 * n)
    comps = {}
    # narration (volume 1, no duck): composition sample G maps to narration sample G - startFrame * SPF
    narr = decode(data['narration']['src'], 2)
    nstart = data['narration']['startFrame']
    nar = array.array('f', bytes(4 * 2 * n))
    for j in range(n):
        s = (F0 * SPF + j) - nstart * SPF
        if 0 <= s < len(narr) // 2:
            nar[2 * j], nar[2 * j + 1] = narr[2 * s], narr[2 * s + 1]
    mix = [m + c for m, c in zip(mix, nar)]
    if 'narration' in keep:
        comps['narration'] = nar
    cache = {}
    for t in data['audio']:
        start = js_round(t['startSec'] * FPS)
        end = min(DURATION, js_round(t['endSec'] * FPS) if 'endSec' in t else DURATION)
        if end <= start:
            continue
        lo, hi = max(start, F0), min(end, F1 + 1)
        if lo >= hi:
            continue
        length = end - start
        trim = js_round(t.get('trimStartSec', 0) * FPS)
        vol = t.get('volume', 1)
        depth = t.get('duckUnderNarration')
        if t['src'] not in cache:
            cache[t['src']] = decode(t['src'], 2)
        src = cache[t['src']]
        label = f"{t['src'].split('/')[-1][:-4]}@{start}"
        comp = array.array('f', bytes(4 * 2 * n)) if label in keep else None
        for F in range(lo, hi):
            f = F - start
            g = vol * fade_gain(t.get('fadeInSec'), t.get('fadeOutSec'), f, length)
            if depth is not None:
                g *= duck_gain(amp, F - NARR_START, depth)
            s0 = (trim + f) * SPF
            dst = (F - F0) * SPF
            for j in range(SPF):
                si = 2 * (s0 + j)
                if si + 1 >= len(src):
                    break
                x0, x1 = g * src[si], g * src[si + 1]
                mix[2 * (dst + j)] += x0
                mix[2 * (dst + j) + 1] += x1
                if comp is not None:
                    comp[2 * (dst + j)] = x0
                    comp[2 * (dst + j) + 1] = x1
        if comp is not None:
            comps[label] = comp
    return mix, comps


def read_wav(path):
    with wave.open(str(path), 'rb') as w:
        assert w.getnchannels() == 2 and w.getsampwidth() == 2 and w.getframerate() == SR, (w.getnchannels(), w.getsampwidth(), w.getframerate())
        raw = w.readframes(w.getnframes())
    a = array.array('h')
    a.frombytes(raw)
    return a


def rms_db(seq, s0, s1):
    s0, s1 = max(0, s0), min(len(seq), s1)
    if s1 <= s0:
        return -200.0
    return db(math.sqrt(sum(x * x for x in seq[s0:s1]) / (s1 - s0)))


def peak_db(seq, s0, s1):
    s0, s1 = max(0, s0), min(len(seq), s1)
    return db(max((abs(x) for x in seq[s0:s1]), default=0.0))


def mono(seq):
    return [(seq[2 * i] + seq[2 * i + 1]) * 0.5 for i in range(len(seq) // 2)]


def median(vals):
    v = sorted(vals)
    return v[len(v) // 2] if v else 0.0


def join_metrics(m, J, F0):
    """Sample-domain click check around composition frame J: max |step| within +-2 f vs median |step| in +-(4..30) f."""
    c = (J - F0) * SPF
    steps = [abs(m[i] - m[i - 1]) for i in range(1, len(m))]
    near = max(steps[max(0, c - 2 * SPF - 1):min(len(steps), c + 2 * SPF)], default=0.0)
    base = steps[max(0, c - 30 * SPF):max(0, c - 4 * SPF)] + steps[c + 4 * SPF:c + 30 * SPF]
    med = median(base)
    return {'maxStepNearJoin': round(near, 6), 'medianStepBaseline': round(med, 6), 'ratio': round(near / med, 2) if med > 0 else None}


def frame_db(mono_seq, F0, frames):
    """RMS dBFS of each composition frame in `frames` (one frame = 1600 samples)."""
    return [round(rms_db(mono_seq, (F - F0) * SPF, (F - F0 + 1) * SPF), 2) for F in frames]


def solve(A, b):
    """Gauss-Jordan with partial pivoting; small systems only (one unknown per cue)."""
    k = len(b)
    M = [row[:] + [b[i]] for i, row in enumerate(A)]
    for i in range(k):
        p = max(range(i, k), key=lambda r: abs(M[r][i]))
        M[i], M[p] = M[p], M[i]
        if abs(M[i][i]) < 1e-18:
            return None
        for r in range(k):
            if r != i:
                f = M[r][i] / M[i][i]
                for c in range(i, k + 1):
                    M[r][c] -= f * M[i][c]
    return [M[i][k] / M[i][i] for i in range(k)]


def gain_fit(label, rend_f, comps, F0, span, names):
    """Joint least squares of (render - narration) on the model components `names` over frames span[0]..span[1]."""
    nar = comps['narration']
    s0 = (span[0] - F0) * 2 * SPF
    s1 = min((span[1] + 1 - F0) * 2 * SPF, len(rend_f), len(nar))
    idx = range(s0, s1, 5)
    y = [rend_f[i] - nar[i] for i in idx]
    X = [[comps[k][i] for k in names] for i in idx]
    p = len(names)
    A = [[sum(row[a] * row[b] for row in X) for b in range(p)] for a in range(p)]
    bv = [sum(row[a] * yy for row, yy in zip(X, y)) for a in range(p)]
    kk = solve(A, bv)
    if kk is None:
        return {'window': label, 'error': 'singular'}
    res = [yy - sum(kk[a] * row[a] for a in range(p)) for row, yy in zip(X, y)]
    ry = math.sqrt(sum(v * v for v in y) / len(y))
    rr = math.sqrt(sum(v * v for v in res) / len(res))
    return {'window': label,
            'k': {nm: round(v, 4) for nm, v in zip(names, kk)},
            'kDb': {nm: round(db(abs(v)), 2) for nm, v in zip(names, kk)},
            'residualDbfs': round(db(rr), 1), 'residualRelDb': round(db(rr / ry), 1) if ry > 0 else None}


def ebur(path):
    res = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(path), '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True)
    text = res.stderr
    summary = text[text.rfind('Summary:'):] if 'Summary:' in text else text
    i = re.search(r'I:\s+(-?[\d.]+)\s+LUFS', summary)
    lra = re.search(r'LRA:\s+(-?[\d.]+)\s+LU', summary)
    tp = re.search(r'Peak:\s+(-?[\d.]+)\s+dBFS', summary)
    return {'integratedLufs': float(i.group(1)) if i else None, 'lra': float(lra.group(1)) if lra else None,
            'truePeakDbtp': float(tp.group(1)) if tp else None}


def main(argv):
    args = [a for a in argv if not a.startswith('--')]
    tracks_json = argv[argv.index('--tracks') + 1] if '--tracks' in argv else None
    if len(args) != 4:
        raise SystemExit(__doc__)
    render_path, F0, F1, out_path = Path(args[0]), int(args[1]), int(args[2]), Path(args[3])
    if tracks_json is None:
        tracks_json = out_path.with_suffix('.tracks.json')
        tracks_json.parent.mkdir(parents=True, exist_ok=True)
        data = dump_tracks(tracks_json)
    else:
        data = json.loads(Path(tracks_json).read_text(encoding='utf-8'))

    # labels: CB1 pieces a/b/c, MN1, BZ1/BZ2, MB2 (slow music box at F2046), RT2 (room tone at F2046)
    keep = {'tension_drone-sparse-piano_01@1172', 'tension_drone-sparse-piano_01@1778', 'tension_drone-sparse-piano_01@1940',
            'tension_music-box-motif-minor_01@1430', 'electric_light-flicker-buzz_01@2129', 'electric_light-flicker-buzz_01@2136',
            'tension_music-box-motif-slow_01@2046', 'room_dark-empty-building_01@2046', 'impact_sub-hit-short_01@1391', 'narration'}
    mix, comps = rebuild(data, F0, F1, keep)
    rend = read_wav(render_path)
    result = {'range': [F0, F1], 'render': str(render_path), 'renderSamples': len(rend) // 2, 'modelSamples': len(mix) // 2}

    # 1. residual: render minus rebuilt mix (16-bit quantization is the expected floor, about -98 dBFS)
    n = min(len(rend), len(mix))
    res_sq = 0.0
    res_max = 0.0
    sig_sq = 0.0
    for i in range(n):
        x = rend[i] / 32768.0
        r = x - mix[i]
        res_sq += r * r
        sig_sq += x * x
        if abs(r) > res_max:
            res_max = abs(r)
    result['residual'] = {'rmsDbRelRender': round(db(math.sqrt(res_sq / n)) - db(math.sqrt(sig_sq / n)), 2),
                          'rmsDbfs': round(db(math.sqrt(res_sq / n)), 2), 'maxAbsDbfs': round(db(res_max), 2)}
    rend_f = [x / 32768.0 for x in rend]

    # 2. joins on render minus narration. The narration matches the render exactly (see gainFits), so this leaves the
    #    music/ambience/SFX. Speech-including mixes are not used: F1940 and F2046 sit next to narration.
    nar = comps['narration']
    nn = min(len(rend_f), len(nar))
    bed_rm = mono([rend_f[i] - nar[i] for i in range(nn)])
    joins = {}
    for J in (1778, 1940, 2046):
        before = frame_db(bed_rm, F0, range(J - 4, J))
        after = frame_db(bed_rm, F0, range(J + 1, J + 5))
        joins[f'F{J}'] = {'frameRmsDb_J-4..J+5': frame_db(bed_rm, F0, range(J - 4, J + 6)),
                          'levelStepDb_mean(J+1..J+4)-mean(J-4..J-1)': round(sum(after) / 4 - sum(before) / 4, 2),
                          'clickSample': join_metrics(bed_rm, J, F0)}
    result['joins'] = joins

    # 2b. diagnostics: the render's gain per cue against the documented rule (volume x fade x duckGainAt), by joint
    #     least squares over a window. k = 1.000 means the render matches the model for that cue. Diagnostic only.
    gain_windows = [
        ('F1391-1420 sub-hit (no duck) + CB1a', (1391, 1420), ['impact_sub-hit-short_01@1391', 'tension_drone-sparse-piano_01@1172']),
        ('F1432-1452 CB1a + MN1 (duck)', (1432, 1452), ['tension_drone-sparse-piano_01@1172', 'tension_music-box-motif-minor_01@1430']),
        ('F1700-1770 CB1a (duck)', (1700, 1770), ['tension_drone-sparse-piano_01@1172']),
        ('F1880-1939 CB1b (duck)', (1880, 1939), ['tension_drone-sparse-piano_01@1778']),
        ('F1941-1980 CB1c (duck)', (1941, 1980), ['tension_drone-sparse-piano_01@1940']),
    ]
    result['gainFits'] = [gain_fit(label, rend_f, comps, F0, span, names) for label, span, names in gain_windows if all(k in comps for k in names)]

    # 3. MN1 against the narration at F1430
    # Component arrays are range-relative (zero outside the cue), so each cue's window starts at its own frame.
    def at(F):
        return (F - F0) * SPF

    def audible_frame(mono_seq, F):
        """Composition frame (fractional) of the first |x| > 0.01 sample at or after frame F."""
        i = next((k for k in range(at(F), len(mono_seq)) if abs(mono_seq[k]) > 0.01), None)
        return None if i is None else round(F + (i - at(F)) / SPF, 2)

    if 'tension_music-box-motif-minor_01@1430' in comps:
        mn_m = mono(comps['tension_music-box-motif-minor_01@1430'])
        na_m = mono(comps['narration'])
        rows = []
        for F in range(1428, 1441):
            rows.append({'F': F, 'mn1RmsDb': round(rms_db(mn_m, at(F), at(F + 1)), 2),
                         'narrRmsDb': round(rms_db(na_m, at(F), at(F + 1)), 2),
                         'mn1PeakDb': round(peak_db(mn_m, at(F), at(F + 1)), 2),
                         'narrPeakDb': round(peak_db(na_m, at(F), at(F + 1)), 2)})
        result['mn1'] = {
            'audibleOnsetFrame': audible_frame(mn_m, 1430),
            'componentPeakDb_F1430_F1456': round(peak_db(mn_m, at(1430), at(1457)), 2),
            'componentRmsDb_F1430_F1432': round(rms_db(mn_m, at(1430), at(1433)), 2),
            'narrPeakDb_F1430_F1440': round(peak_db(na_m, at(1430), at(1441)), 2),
            'narrPeakDb_F1430_F1456': round(peak_db(na_m, at(1430), at(1457)), 2),
            'narrRmsDb_F1430_F1432': round(rms_db(na_m, at(1430), at(1433)), 2),
            'rowsF1428_F1440': rows,
        }
    # BZ1 / BZ2 onsets, levels, and the level against the room tone and the music box under the dip
    if 'electric_light-flicker-buzz_01@2129' in comps:
        for key, F, span in (('BZ1', 2129, 7), ('BZ2', 2136, 11)):
            cm = mono(comps[f'electric_light-flicker-buzz_01@{F}'])
            result.setdefault('buzz', {})[key] = {'audibleOnsetFrame': audible_frame(cm, F),
                                                  'componentPeakDb': round(peak_db(cm, at(F), at(F + span)), 2),
                                                  'componentRmsDb': round(rms_db(cm, at(F), at(F + span)), 2)}
        rt = mono(comps['room_dark-empty-building_01@2046'])
        mb = mono(comps['tension_music-box-motif-slow_01@2046'])
        result['buzz']['roomToneRmsDb_F2100_F2128'] = round(rms_db(rt, at(2100), at(2129)), 2)
        result['buzz']['musicBoxSlowRmsDb_F2100_F2128'] = round(rms_db(mb, at(2100), at(2129)), 2)

    # 4. loudness, true peak and clipping of the range (un-normalized render)
    result['loudness'] = ebur(render_path)
    clip = sum(1 for x in rend if x >= 32767 or x <= -32768)
    result['loudness']['samplePeakDbfs'] = round(db(max(abs(x) for x in rend) / 32768.0), 2)
    result['loudness']['clippedSamples16bit'] = clip

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(result, indent=1, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f"residual {result['residual']}")
    for k, v in joins.items():
        print(k, 'levelStepDb', v['levelStepDb_mean(J+1..J+4)-mean(J-4..J-1)'], 'click', v['clickSample'])
    for g in result['gainFits']:
        print('gainFit', g)
    if 'mn1' in result:
        print('mn1', {k: v for k, v in result['mn1'].items() if k != 'rowsF1428_F1440'})
    if 'buzz' in result:
        print('buzz', result['buzz'])
    print('loudness', result['loudness'])
    print('wrote', out_path)


if __name__ == '__main__':
    main(sys.argv[1:])
