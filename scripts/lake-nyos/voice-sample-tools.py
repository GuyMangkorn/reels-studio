"""Tempo and measurement for NYOS-EP01-SHORT voice samples (Editor, VS-R2). Stdlib plus ffmpeg/ffprobe.

Usage:
  python3 -I scripts/lake-nyos/voice-sample-tools.py tempo SRC.wav OUT.wav [--factor 1.05]
      ffmpeg atempo (pitch preserved), then the two-pass loudnorm to -16 LUFS / -1.5 dBTP / LRA 11 from
      scripts/voice-preset.py normalize(). Output 48 kHz mono 16-bit WAV. Writes OUT.json = SRC.json plus
      derived_from, filter and factor.
  python3 -I scripts/lake-nyos/voice-sample-tools.py measure FILE.wav [FILE.wav ...]
      One JSON line per file: codec, duration, lead and trail silence (silencedetect -35 dB, 0.15 s),
      speech span, integrated loudness (lufs), true peak (tp) and LRA (loudnorm pass 1, same target).
Speech span = duration - lead - trail. It keeps the internal pauses, so it compares pace between takes of one text.
"""
import argparse, importlib.util, json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LN = 'loudnorm=I=-16:TP=-1.5:LRA=11'


def run(args):
    return subprocess.run(args, capture_output=True, text=True, check=True)


def voice_preset():
    sys.dont_write_bytecode = True  # importing voice-preset.py must not rewrite its tracked scripts/__pycache__ .pyc
    spec = importlib.util.spec_from_file_location('voice_preset', ROOT / 'scripts' / 'voice-preset.py')
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def tempo(a):
    src, out = Path(a.src), Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    chain = f'atempo={a.factor}'
    voice_preset().normalize(src, chain, out)
    side = src.with_suffix('.json')
    meta = json.loads(side.read_text()) if side.exists() else {}
    meta.update(derived_from=src.name, filter=f'{chain},{LN} two-pass', factor=a.factor)
    out.with_suffix('.json').write_text(json.dumps(meta, ensure_ascii=False, indent=1))
    print(out)


def measure(path):
    p = str(path)
    dur = float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]).stdout)
    codec, rate, channels = run(['ffprobe', '-v', 'error', '-select_streams', 'a:0', '-show_entries',
                                 'stream=codec_name,sample_rate,channels', '-of', 'csv=p=0', p]).stdout.strip().split(',')
    err = run(['ffmpeg', '-hide_banner', '-nostats', '-i', p, '-af', 'silencedetect=noise=-35dB:d=0.15',
               '-f', 'null', '-']).stderr
    starts = [float(x) for x in re.findall(r'silence_start: (-?[\d.]+)', err)]
    ends = [float(x) for x in re.findall(r'silence_end: (-?[\d.]+)', err)]
    lead = ends[0] if starts and starts[0] <= 0.01 and ends else 0.0
    trail = dur - starts[-1] if starts and starts[-1] > 0.01 and (len(starts) > len(ends) or ends[-1] >= dur - 0.01) else 0.0
    j = run(['ffmpeg', '-hide_banner', '-nostats', '-i', p, '-af', f'{LN}:print_format=json', '-f', 'null', '-']).stderr
    m = json.loads(j[j.rindex('{'):j.rindex('}') + 1])
    return dict(file=path.name, codec=codec, sample_rate=int(rate), channels=int(channels), duration=round(dur, 2),
                lead=round(lead, 2), trail=round(trail, 2), speech=round(dur - lead - trail, 2),
                lufs=float(m['input_i']), tp=float(m['input_tp']), lra=float(m['input_lra']))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest='cmd', required=True)
    t = sub.add_parser('tempo'); t.add_argument('src'); t.add_argument('out'); t.add_argument('--factor', type=float, default=1.05)
    m = sub.add_parser('measure'); m.add_argument('files', nargs='+')
    a = ap.parse_args()
    if a.cmd == 'tempo':
        tempo(a)
    else:
        for f in a.files:
            print(json.dumps(measure(Path(f)), ensure_ascii=False))
    return 0


if __name__ == '__main__':
    sys.exit(main())
