"""Place per-line Edge TTS clips on the composition clock for a ZCPAINT deliverable (Editor, VD-ZC-TL anchors).

Input: scripts/zombie-condo-paint/short/vo-<LANG>.json (one entry per spoken line: id, beat, text, atSec).
Each line is synthesized once (cache: out/zcpaint/vo/<LANG>/, keyed by text, voice and rate), its first audible sample
is pinned to `atSec`, and the lines are summed into one 48 kHz mono track. Lines may not overlap: an overlap is reported
and fails the run with --write. Writes (with --write):
  public/narration/<deliverable>.mp3                  the narration track (the composition's `narration` field)
  scripts/zombie-condo-paint/short/<deliverable>.amplitude.json   30 fps RMS envelope, peak-normalised as narration.py
Always writes out/zcpaint/vo/<LANG>/measure.json: per line onset, end, planned start and gap to the next line.

Usage: python3 -I scripts/zombie-condo-paint/place-narration.py --lang TH [--total 70.8] [--write] [--voice V] [--rate R]
Needs edge-tts (narration.py) and the Remotion-bundled ffmpeg (narration.py helpers).
"""
import argparse
import array
import asyncio
import hashlib
import json
import math
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
import edge_tts  # noqa: E402
from narration import FFMPEG, FFMPEG_ENV, FPS, SAMPLE_RATE, THRESHOLD, pcm, synthesize  # noqa: E402

parser = argparse.ArgumentParser()
parser.add_argument('--lang', required=True, choices=['TH', 'EN'])
parser.add_argument('--total', type=float, default=0.0, help='track length in seconds (default: last line end + 0.5)')
parser.add_argument('--voice')
parser.add_argument('--rate')
parser.add_argument('--write', action='store_true')
args = parser.parse_args()

spec = json.loads((HERE / 'short' / f'vo-{args.lang}.json').read_text())
voice = args.voice or spec['voice']
rate = args.rate or spec['rate']
deliverable = spec['deliverable']
cache = ROOT / 'out' / 'zcpaint' / 'vo' / args.lang
cache.mkdir(parents=True, exist_ok=True)


def clip_name(line):
    key = hashlib.sha1(f"{line['text']}|{voice}|{rate}".encode()).hexdigest()[:8]
    return cache / f"{line['id']}-{key}.mp3"


async def fetch():
    for line in spec['lines']:
        clip = clip_name(line)
        if not clip.exists():
            await synthesize(edge_tts, line['text'], voice, rate, clip)


asyncio.run(fetch())

placed = []
for line in spec['lines']:
    samples = pcm(clip_name(line))
    on = next((i for i, v in enumerate(samples) if abs(v) >= THRESHOLD), 0)
    off = max((i for i, v in enumerate(samples) if abs(v) >= THRESHOLD), default=on)
    start = round(line['atSec'] * SAMPLE_RATE) - on  # first clip sample lands here; speech onset lands on atSec
    if start < 0:  # the line starts before the timeline: drop its leading silence and the early audio
        samples = samples[-start:]
        on, off, start = on + start, off + start, 0
    placed.append({'id': line['id'], 'beat': line['beat'], 'text': line['text'], 'plannedSec': line['atSec'],
                   'onsetSec': round((start + on) / SAMPLE_RATE, 3), 'speechEndSec': round((start + off) / SAMPLE_RATE, 3),
                   'speechSec': round((off - on) / SAMPLE_RATE, 3), 'samples': samples, 'start': start, 'on': on, 'off': off})

for i, p in enumerate(placed):
    p['nextOnsetSec'] = placed[i + 1]['onsetSec'] if i + 1 < len(placed) else None
    p['gapToNextSec'] = round(p['nextOnsetSec'] - p['speechEndSec'], 3) if p['nextOnsetSec'] is not None else None
    p['endSec'] = round((p['start'] + len(p['samples'])) / SAMPLE_RATE, 3)

overlaps = [(a['id'], b['id']) for a, b in zip(placed, placed[1:]) if a['speechEndSec'] > b['onsetSec']]
caption_of = {line['id']: line.get('caption', line['text']) for line in spec['lines']}
lines_out = [{'id': p['id'], 'beat': p['beat'], 'text': p['text'], 'caption': caption_of[p['id']],
              'onsetSec': p['onsetSec'], 'speechEndSec': p['speechEndSec']} for p in placed]
report = [{k: v for k, v in p.items() if k not in ('samples', 'start', 'on', 'off')} for p in placed]
(cache / 'measure.json').write_text(json.dumps(report, ensure_ascii=False, indent=1) + '\n')

print(f"{'id':6} {'beat':4} {'plan':>6} {'onset':>7} {'end':>7} {'speech':>6} {'gapNext':>7}  text")
for p in report:
    print(f"{p['id']:6} {p['beat']:4} {p['plannedSec']:6.2f} {p['onsetSec']:7.2f} {p['speechEndSec']:7.2f} {p['speechSec']:6.2f} "
          f"{(p['gapToNextSec'] if p['gapToNextSec'] is not None else 0):7.2f}  {p['text'][:40]}")
print('overlaps:', overlaps or 'none')

if args.write:
    (HERE / 'short' / f"{deliverable}.lines.json").write_text(json.dumps(lines_out, ensure_ascii=False, indent=1) + '\n')
if not args.write:
    print('dry run: no track written (use --write)')
    sys.exit(1 if overlaps else 0)
if overlaps:
    sys.exit('refusing to write: lines overlap (move atSec in vo JSON)')

total = args.total or (max(p['endSec'] for p in placed) + 0.5)
count = round(total * SAMPLE_RATE)
mix = [0.0] * count
for p in placed:
    for i, v in enumerate(p['samples']):
        pos = p['start'] + i
        if pos < count:
            mix[pos] += v
peak_in = max(abs(v) for v in mix) or 1
if peak_in > 32767:
    print(f'mix peak {peak_in:.0f} exceeds int16; scaling down')
scale = min(1.0, 32767 / peak_in)
combined = array.array('h', [max(-32768, min(32767, round(v * scale))) for v in mix])
raw = cache / 'narration.pcm'
raw.write_bytes(combined.tobytes())
# Loudness: the TTS sum sits near -21 LUFS, which leaves the sound effects no headroom in the export (scripts/loudness.mjs
# targets -14 LUFS / -1.5 dBTP). Normalise the narration track itself to the export target (-14 LUFS, true peak -1.5 dBTP), before encoding
# (PATH ffmpeg: the bundled one aborts on loudnorm). loudnorm works at 192 kHz internally: the output rate is forced back to 48 kHz.
combined = array.array('h')
combined.frombytes(subprocess.run(['ffmpeg', '-v', 'error', '-f', 's16le', '-ar', str(SAMPLE_RATE), '-ac', '1', '-i', str(raw), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', str(SAMPLE_RATE), '-f', 's16le', '-'], capture_output=True, check=True).stdout)
raw.write_bytes(combined.tobytes())
target = ROOT / 'public' / 'narration' / f'{deliverable}.mp3'
target.parent.mkdir(parents=True, exist_ok=True)
subprocess.run([FFMPEG, '-v', 'error', '-y', '-f', 's16le', '-ar', str(SAMPLE_RATE), '-ac', '1', '-i', str(raw), '-c:a', 'libmp3lame', '-b:a', '192k', str(target)], check=True, env=FFMPEG_ENV)
delivered = pcm(target)
block = SAMPLE_RATE // FPS
rms = [math.sqrt(sum(v * v for v in delivered[i:i + block]) / max(1, len(delivered[i:i + block]))) for i in range(0, len(delivered), block)]
peak = max(rms) or 1
amplitude = HERE / 'short' / f'{deliverable}.amplitude.json'
amplitude.write_text(json.dumps([round(v / peak, 4) for v in rms]) + '\n')
print(f'wrote {target} ({total:.2f} s) and {amplitude.name} ({len(rms)} frames); input peak {peak_in / 32768:.3f} FS')
