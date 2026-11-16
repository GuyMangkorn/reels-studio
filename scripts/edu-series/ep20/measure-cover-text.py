"""Measure EP20 cover text against the selected immutable picture; build labelled QA.

Usage: python3 -I scripts/edu-series/ep20/measure-cover-text.py --base P5.png
  --frames DIR --covers covers.json --out DIR
Inputs: 1080x1920 PNGs named A.png..E.png and exported EDU20_COVERS JSON.
Uses standard-library Python and FFmpeg, never installs image packages. Text fill
bounds use the exact declared fill colour within 4 RGB levels; outline bounds use
changed pixels against the unchanged base in y1100..1640. Metrics are actual PNG
ink extents, not font-size claims or a full optical cap-height/font audit.
"""
import argparse
import json
from pathlib import Path
import struct
import subprocess
import unicodedata

W, H = 1080, 1920


def cap_ratio():
    data = Path('public/fonts/NotoSansThai.ttf').read_bytes()
    count = struct.unpack_from('>H', data, 4)[0]
    tables = {tag.decode(): offset for tag, _, offset, _ in
              (struct.unpack_from('>4sIII', data, 12 + i * 16) for i in range(count))}
    units = struct.unpack_from('>H', data, tables['head'] + 18)[0]
    cap = struct.unpack_from('>h', data, tables['OS/2'] + 88)[0]
    return cap / units


def run(args):
    return subprocess.run(args, check=True, stdout=subprocess.PIPE).stdout


def rgb(path):
    data = run(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'])
    if len(data) != W * H * 3:
        raise ValueError(f'{path}: expected 1080x1920 RGB')
    return data


def bounds(points):
    if not points:
        return None
    return [min(x for x, _ in points), min(y for _, y in points), max(x for x, _ in points), max(y for _, y in points)]


GLYPHS = {
    'A': ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
    'B': ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
    'C': ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
    'D': ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
    'E': ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
    'P': ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
    '5': ['11111', '10000', '10000', '11110', '00001', '00001', '11110'],
}


def label(source, target, text, crop=False):
    data = rgb(source)
    height = 1440 if crop else H
    data = data[240 * W * 3:1680 * W * 3] if crop else data
    canvas = bytearray(data + bytes((38, 49, 59)) * (W * 120))
    left = (W - (len(text) * 60 - 10)) // 2
    for n, char in enumerate(text):
        for row, values in enumerate(GLYPHS[char]):
            for col, value in enumerate(values):
                if value == '1':
                    for dy in range(10):
                        for dx in range(10):
                            i = ((height + 25 + row * 10 + dy) * W + left + n * 60 + col * 10 + dx) * 3
                            canvas[i:i + 3] = b'\xff\xff\xff'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{height + 120}',
                    '-i', '-', '-frames:v', '1', '-update', '1', str(target)], input=canvas, check=True)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    for key in ('base', 'frames', 'covers', 'out'):
        ap.add_argument('--' + key, required=True, type=Path)
    a = ap.parse_args()
    a.out.mkdir(parents=True, exist_ok=True)
    for name in ('labelled', 'crops'):
        (a.out / name).mkdir(exist_ok=True)
    base = rgb(a.base)
    cap = cap_ratio()
    metrics = []
    paths = [('P5', a.base)] + [(letter, a.frames / f'{letter}.png') for letter in 'ABCDE']
    for letter, cover in zip('ABCDE', json.loads(a.covers.read_text())):
        data = rgb(a.frames / f'{letter}.png')
        changed, outside = [], 0
        for y in range(H):
            for x in range(W):
                i = (y * W + x) * 3
                if max(abs(data[i + c] - base[i + c]) for c in range(3)) > 12:
                    if 1100 <= y <= 1640:
                        changed.append((x, y))
                    else:
                        outside += 1
        lines = []
        for line in cover['lines']:
            target = (240, 180, 93) if line.get('accent') else (244, 239, 230)
            points = []
            for y in range(max(1100, int(line['y'] - line['size'] * 1.3)), min(1641, int(line['y'] + 12))):
                for x in range(W):
                    i = (y * W + x) * 3
                    if max(abs(data[i + c] - target[c]) for c in range(3)) <= 4:
                        points.append((x, y))
            bb = bounds(points)
            lines.append({'text': line['text'], 'size': line['size'], 'baseline': line['y'], 'fontCapHeight': round(line['size'] * cap, 3),
                          'spacingGlyphs': sum(not unicodedata.category(c).startswith('M') and not c.isspace() for c in line['text']),
                          'fillBounds': bb, 'fillHeight': bb[3] - bb[1] + 1 if bb else 0})
        bb = bounds(changed)
        metrics.append({'candidate': letter, 'id': cover['id'], 'outlineBounds': bb,
                        'primaryHeadlineCapHeightPass': lines[0]['fontCapHeight'] >= H * 0.07,
                        'safe': bool(bb and bb[0] >= 120 and bb[2] < 960 and bb[1] >= 240 and bb[3] <= 1680),
                        'changedPixelsOutsideTextBandAboveThreshold12': outside, 'lines': lines})
    (a.out / 'text-metrics.json').write_text(json.dumps(metrics, ensure_ascii=False, indent=2) + '\n')
    for letter, source in paths:
        label(source, a.out / 'labelled' / f'{letter}.png', letter)
        label(source, a.out / 'crops' / f'{letter}.png', letter, crop=True)
    for m in metrics:
        print(f"{m['candidate']}: outline {m['outlineBounds']}, safe={m['safe']}, fill heights {[l['fillHeight'] for l in m['lines']]}, outside-band changed={m['changedPixelsOutsideTextBandAboveThreshold12']}")


if __name__ == '__main__':
    main()
