"""Measure each sound layer against the voice (docs/editor-principles.md#ep08b-keep-each-layer-at-its-distance-from-the-voice).

Usage:
  python3 -I scripts/mix-levels.py scripts/<episode>/sound-cues.json      # stems and checks from the cue sheet's `levels`
  python3 -I scripts/mix-levels.py --voice V.wav --layer bed=B.wav [--layer sfx=S.wav ...]   # measure only

Each stem is one layer rendered alone at its mix gains (time-aligned, same length as the mix). The script reads momentary
loudness (M, 400 ms, every 100 ms) with ffmpeg ebur128. Speech is every 100 ms step where the voice's own 100 ms level is within
30 dB of its mean, so a whisper or a tired breath still counts as speech while the 400 ms meter does not blur short gaps; a gap is a run of non-speech of at least 0.5 s. dV = voice minus layer in LU (positive: the layer is
quieter). Per layer it prints dV while the voice speaks (energy mean over speech steps), dV at the loudest step in a gap,
dV at the loudest step anywhere, and true peak. `background` is the sum of all layers; `mix` adds the voice and reports
mix integrated minus voice speech level (EBU R 128 s4 caps it at 5 LU).

`levels.checks` rows: {"beat", "layer", "when": "speech"|"gap"|"peak"|"drop", "min"?, "max"?, "warnAbove"?, "fromSec"?, "toSec"?}
in dV. A `drop` row (EP08a: the bed pulled out before a reveal) is judged on the layer's loudest step in the window against the voice's speech level, like `peak`, with a 2 LU tolerance. A value outside min..max fails beyond the tolerance (2 LU for speech and gap, 3 LU for peak) and warns inside it;
above `warnAbove` it only warns. A row with an `exception` (the Film brief cue it follows) prints `ok*` with that text
when it passes. A `speech` row compares the layer with the voice in its own window, so a whisper is its own reference.
A layer silent in the window passes. Exit 1 on a failed check or on mix minus voice
above 5 LU.
"""
import array, json, math, os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SILENT = -70.0
SPEECH_RANGE = 30.0
MIN_GAP = 5
TOLERANCE = {'speech': 2.0, 'gap': 2.0, 'peak': 3.0, 'drop': 2.0}
LDR_CAP = 5.0


def ebur128(inputs, graph):
    """Run ffmpeg on `inputs` with filter `graph` ending in [a]; return (momentary list, integrated, true peak)."""
    with tempfile.TemporaryDirectory() as tmp:
        out = os.path.join(tmp, 'm.txt')
        args = ['ffmpeg', '-hide_banner', '-nostats']
        for path in inputs: args += ['-i', path]
        args += ['-filter_complex', f"{graph};[a]ebur128=metadata=1:peak=true,ametadata=print:key=lavfi.r128.M:file='{out}'", '-f', 'null', '-']
        r = subprocess.run(args, capture_output=True, text=True)
        if r.returncode: sys.exit(f'ffmpeg failed on {inputs}: {r.stderr[-400:]}')
        with open(out) as f: m = [float(v) for v in re.findall(r'lavfi\.r128\.M=(-?[\d.]+|-inf)', f.read().replace('-inf', '-120'))]
    summary = r.stderr[r.stderr.rfind('Summary:'):]
    integrated = float(re.search(r'I:\s+(-?[\d.]+|-inf)', summary).group(1).replace('-inf', '-120'))
    peak = re.search(r'Peak:\s+(-?[\d.]+|-inf)', summary)
    return m, integrated, float(peak.group(1).replace('-inf', '-120')) if peak else None


def measure(path):
    return ebur128([path], '[0:a]anull[a]')


def summed(paths):
    if len(paths) == 1: return measure(paths[0])
    ins = ''.join(f'[{i}:a]' for i in range(len(paths)))
    return ebur128(paths, f'{ins}amix=inputs={len(paths)}:normalize=0:duration=longest[a]')


def energy_mean(values):
    loud = [v for v in values if v > SILENT]
    if not loud: return None
    return 10 * math.log10(sum(10 ** (v / 10) for v in loud) / len(values))


def step_levels(path):
    """Unweighted level of each 100 ms step in dBFS (mono, 16 kHz)."""
    r = subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', path, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True)
    samples = array.array('h', r.stdout)
    levels = []
    for i in range(0, len(samples) - 1599, 1600):
        power = sum(x * x for x in samples[i:i + 1600]) / 1600
        levels.append(10 * math.log10(power / 32768 ** 2) if power else -120.0)
    return levels


def speech_mask(voice_path, steps):
    levels = step_levels(voice_path)
    level = energy_mean(levels)
    if level is None: sys.exit('the voice stem is silent')
    mask = [v > SILENT and v >= level - SPEECH_RANGE for v in levels]
    return (mask + [False] * steps)[:steps]


def gap_mask(speech):
    gaps, i = [False] * len(speech), 0
    while i < len(speech):
        j = i
        while j < len(speech) and not speech[j]: j += 1
        if j - i >= MIN_GAP: gaps[i:j] = [True] * (j - i)
        i = max(j, i + 1)
    return gaps


def delta(voice_m, layer_m, speech, when, lo=0, hi=None):
    """dV for one layer over steps lo..hi; None when the layer (or, for speech, the voice) has nothing there."""
    hi = len(voice_m) if hi is None else min(hi, len(voice_m))
    steps = range(lo, hi)
    voice_level = energy_mean([voice_m[i] for i in range(len(voice_m)) if speech[i]])
    if when == 'speech':
        idx = [i for i in steps if speech[i]]
        if not idx: return None
        v, l = energy_mean([voice_m[i] for i in idx]), energy_mean([layer_m[i] if i < len(layer_m) else -120 for i in idx])
        return None if l is None else v - l
    gaps = gap_mask(speech)
    idx = [i for i in steps if gaps[i]] if when == 'gap' else list(steps)
    loud = [layer_m[i] for i in idx if i < len(layer_m) and layer_m[i] > SILENT]
    return voice_level - max(loud) if loud else None


def fmt(v): return '   —  ' if v is None else f'{v:6.1f}'


def report(voice_path, layers, checks=()):
    voice_m, voice_i, voice_tp = measure(voice_path)
    speech = speech_mask(voice_path, len(voice_m))
    voice_level = energy_mean([v for v, s in zip(voice_m, speech) if s])
    measured = {name: measure(path) for name, path in layers.items()}
    if len(layers) > 1: measured['background'] = summed(list(layers.values()))
    mix_m, mix_i, mix_tp = summed([voice_path, *layers.values()])
    print(f'voice: speech level {voice_level:.1f} LUFS (M, {sum(speech) / 10:.1f} s of speech), integrated {voice_i:.1f}, true peak {voice_tp}')
    print(f'{"layer":<12}{"dV speech":>10}{"dV gap max":>11}{"dV peak":>9}{"TP dBFS":>9}')
    for name, (m, _, tp) in measured.items():
        print(f'{name:<12}{fmt(delta(voice_m, m, speech, "speech")):>10}{fmt(delta(voice_m, m, speech, "gap")):>11}'
              f'{fmt(delta(voice_m, m, speech, "peak")):>9}{fmt(tp):>9}')
    ldr = mix_i - voice_level
    print(f'mix: integrated {mix_i:.1f} LUFS, true peak {mix_tp}; mix minus voice {ldr:+.1f} LU (cap +{LDR_CAP:.0f})')
    failed = ldr > LDR_CAP
    if failed: print(f'FAIL mix minus voice {ldr:+.1f} LU is above +{LDR_CAP:.0f} LU')
    for c in checks:
        name, when = c['layer'], c['when']
        if name not in measured: print(f'FAIL {c.get("beat", "?")}: no stem named {name}'); failed = True; continue
        lo = round(c.get('fromSec', 0) * 10); hi = round(c['toSec'] * 10) if 'toSec' in c else None
        dv = delta(voice_m, measured[name][0], speech, when, lo, hi)
        lo_t, hi_t = c.get('min', -math.inf), c.get('max', math.inf)
        label = f'{c.get("beat", "?")} {name} {when} dV {fmt(dv).strip()} (target {c.get("min", "")}..{c.get("max", "")})'
        if dv is None: print(f'ok   {label}: silent'); continue
        miss = max(lo_t - dv, dv - hi_t, 0)
        if miss > TOLERANCE[when]: print(f'FAIL {label}'); failed = True
        elif miss: print(f'warn {label}: within ±{TOLERANCE[when]:.0f} LU')
        elif dv > c.get('warnAbove', math.inf): print(f'warn {label}: above {c["warnAbove"]}, the layer may vanish')
        elif c.get('exception'): print(f'ok*  {label}: exception, {c["exception"]}')
        else: print(f'ok   {label}')
    return failed


def main():
    argv = sys.argv[1:]
    if len(argv) == 1 and argv[0].endswith('.json'):
        with open(argv[0], encoding='utf-8') as f: levels = json.load(f).get('levels') or sys.exit('no `levels` in the cue sheet')
        stems = {k: os.path.join(ROOT, v) for k, v in levels['stems'].items()}
        voice = stems.pop('voice', None) or sys.exit('levels.stems needs a `voice` stem')
        sys.exit(1 if report(voice, stems, levels.get('checks', [])) else 0)
    voice, layers = None, {}
    while argv:
        flag, value = argv.pop(0), argv.pop(0) if argv else sys.exit(__doc__)
        if flag == '--voice': voice = value
        elif flag == '--layer' and '=' in value: k, v = value.split('=', 1); layers[k] = v
        else: sys.exit(__doc__)
    if not voice or not layers: sys.exit(__doc__)
    sys.exit(1 if report(voice, layers) else 0)


if __name__ == '__main__':
    main()
