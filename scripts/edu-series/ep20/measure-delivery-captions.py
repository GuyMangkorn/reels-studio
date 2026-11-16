"""Measure EP20 captions in decoded delivery frames, without image dependencies.

Usage: python3 -I scripts/edu-series/ep20/measure-delivery-captions.py \
  --frames-dir out/qa/edu20/w8-delivery/frames \
  --output out/qa/edu20/w8-delivery/caption-measurements.json

Frames must be 1080x1920 PNGs decoded from the reviewed export, named G0000.png
at each cue's midpoint. White cabin walls are below the >=248 RGB fill threshold.
Background statistics exclude the caption's fill bounding box expanded by the
14px outline; they describe the remaining band, not pixels behind the glyphs.
"""
import argparse
import json
import pathlib
import re
import subprocess

WIDTH, HEIGHT = 1080, 1920
BOX = (120, 140, 888, 1344)
BAND = (1150, 1280)
SCAN = (1100, 1260)
STROKE = 14


def measure(path):
    y0, y1 = SCAN
    raw = subprocess.run(
        ['ffmpeg', '-v', 'error', '-i', str(path), '-vf',
         f'crop={WIDTH}:{y1 - y0}:0:{y0}', '-f', 'rawvideo',
         '-pix_fmt', 'rgb24', '-'], check=True, capture_output=True).stdout
    if len(raw) != WIDTH * (y1 - y0) * 3:
        raise ValueError(f'{path}: expected one {WIDTH}x{HEIGHT} frame')
    points = [(i // 3 % WIDTH, i // 3 // WIDTH + y0)
              for i in range(0, len(raw), 3) if min(raw[i:i + 3]) >= 248]
    if not points:
        raise ValueError(f'{path}: no white caption fill in y{y0}-{y1}')
    x0 = min(p[0] for p in points)
    x1 = max(p[0] for p in points)
    top = min(p[1] for p in points)
    bottom = max(p[1] for p in points)
    outer = (x0 - STROKE, top - STROKE, x1 + STROKE, bottom + STROKE)
    inside = (outer[0] >= BOX[0] and outer[1] >= BOX[1]
              and outer[2] <= BOX[2] and outer[3] <= BOX[3])
    # Decode the entire comparison band because its bottom is below SCAN.
    band = subprocess.run(
        ['ffmpeg', '-v', 'error', '-i', str(path), '-vf',
         f'crop={BOX[2] - BOX[0]}:{BAND[1] - BAND[0] + 1}:{BOX[0]}:{BAND[0]}',
         '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
        check=True, capture_output=True).stdout
    values = []
    for i in range(0, len(band), 3):
        x = BOX[0] + i // 3 % (BOX[2] - BOX[0])
        y = BAND[0] + i // 3 // (BOX[2] - BOX[0])
        if outer[0] <= x <= outer[2] and outer[1] <= y <= outer[3]:
            continue
        r, g, b = band[i:i + 3]
        values.append((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255)
    values.sort()
    return {'fill': [x0, top, x1, bottom], 'conservativeStroke': list(outer),
            'insideSafeBox': inside, 'bandBackgroundExcludingCaptionBox': {
                'mean': round(sum(values) / len(values), 3),
                'p95': round(values[int(0.95 * (len(values) - 1))], 3)}}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--frames-dir', required=True, type=pathlib.Path)
    parser.add_argument('--cues', type=pathlib.Path,
                        default=pathlib.Path('src/videos/edu-ep20/cues.ts'))
    parser.add_argument('--output', required=True, type=pathlib.Path)
    args = parser.parse_args()
    cues = re.findall(r"\['([^']+)',\s*(\d+),\s*(\d+),\s*'([^']*)'\]",
                      args.cues.read_text())
    if not cues:
        parser.error(f'no cue rows in {args.cues}')
    rows = []
    for cue_id, start, end, text in cues:
        if not text:
            continue
        frame = (int(start) + int(end) - 1) // 2
        path = args.frames_dir / f'G{frame:04d}.png'
        rows.append({'id': cue_id, 'frame': frame, 'path': str(path),
                     **measure(path)})
    output = {'safeBox': list(BOX), 'band': list(BAND),
              'whiteFillThreshold': 248, 'strokeExpansion': STROKE,
              'cues': rows,
              'summary': {'measured': len(rows),
                          'outside': sum(not r['insideSafeBox'] for r in rows)}}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')
    print(f"{len(rows)} caption cues; {output['summary']['outside']} outside; {args.output}")
    return int(output['summary']['outside'] > 0)


if __name__ == '__main__':
    raise SystemExit(main())
