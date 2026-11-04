"""Caption-zone check for vertical frames (docs/production-requirements.md#vertical-caption-safe-zone).
Usage: python3 -I scripts/caption-zone.py [--band 860:1248] [--max-mean 0.25] [--max-p95 0.40] [--overlay-dir DIR] [--ads] [--shade-centre Y] FRAME.png...
For each 1080x1920 frame: Rec.709 luma (display values) of the background in the caption band rows, mean and p95, with a pass flag.
Default thresholds are the ones Boss chose for outline captions in ZCONDO SP02 (assets/blender/zc-unit/sp02_check.py); a brief may set others.
--overlay-dir writes <frame>_capzone.png with the caption-safe box (green, x 120-888, y 140-1344; y 140-1248 with --ads) and the band (red) drawn, for
scripts/qa-sheet.sh, so a person or agent can see whether glyphs, faces or the reveal object cross them. Needs ffmpeg on PATH.
--shade-centre Y (the CaptionShade / captionStyle.centerY centre, 1164 by default layout) also measures the caption ink: rows of near-white
outline-caption fill in y 800-1400, x 120-960, reported as ink top / bottom / centre and `offset` = ink centre - Y (px, + = text below the band centre);
`centred` passes when |offset| <= --max-offset (default 12). The ink centre is the glyph ink, so Thai marks above and vowels below count.
Prints one JSON object keyed by frame path.
"""
import argparse, json, os, shutil, subprocess, sys

W, H = 1080, 1920
BOX = (120, 140, 888, 1344)  # organic; --ads uses ADS_BOTTOM
ADS_BOTTOM = 1248
FFMPEG = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'


def band_luma(path, y0, y1):
    raw = subprocess.run([FFMPEG, '-v', 'error', '-i', path, '-vf', f'scale={W}:{H},crop={W}:{y1 - y0}:0:{y0}',
                          '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], check=True, capture_output=True).stdout
    vals = sorted((0.2126 * raw[i] + 0.7152 * raw[i + 1] + 0.0722 * raw[i + 2]) / 255 for i in range(0, len(raw), 3))
    return sum(vals) / len(vals), vals[int(0.95 * (len(vals) - 1))]


def ink_rows(path, y0=800, y1=1400, x0=120, x1=960, white=248, min_px=3):
    """Top/bottom/centre rows of near-white caption fill (outline preset) in the given window, or None."""
    raw = subprocess.run([FFMPEG, '-v', 'error', '-i', path, '-vf', f'scale={W}:{H},crop={x1 - x0}:{y1 - y0}:{x0}:{y0}',
                          '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], check=True, capture_output=True).stdout
    w = x1 - x0
    rows = []
    for r in range(y1 - y0):
        row = raw[r * w * 3:(r + 1) * w * 3]
        if sum(1 for i in range(0, len(row), 3) if row[i] >= white and row[i + 1] >= white and row[i + 2] >= white) >= min_px:
            rows.append(y0 + r)
    if not rows:
        return None
    return {'top': rows[0], 'bottom': rows[-1], 'centre': (rows[0] + rows[-1]) / 2}


def overlay(path, out_dir, y0, y1, box=BOX):
    x0, by0, x1, by1 = box
    out = os.path.join(out_dir, os.path.splitext(os.path.basename(path))[0] + '_capzone.png')
    vf = (f'scale={W}:{H},drawbox=x={x0}:y={by0}:w={x1 - x0}:h={by1 - by0}:color=lime@0.9:t=4,'
          f'drawbox=x=0:y={y0}:w={W}:h={y1 - y0}:color=red@0.9:t=4')
    subprocess.run([FFMPEG, '-v', 'error', '-y', '-i', path, '-vf', vf, '-frames:v', '1', '-update', '1', out], check=True)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('frames', nargs='+')
    ap.add_argument('--band', default='860:1248', help='caption band rows y0:y1 (the scene sheet records the band)')
    ap.add_argument('--max-mean', type=float, default=0.25)
    ap.add_argument('--max-p95', type=float, default=0.40)
    ap.add_argument('--shade-centre', type=float, help='expected vertical centre of the caption block / shade band; measures the caption ink offset from it')
    ap.add_argument('--max-offset', type=float, default=12, help='max |ink centre - shade centre| in px for `centred`')
    ap.add_argument('--overlay-dir')
    ap.add_argument('--ads', action='store_true', help='ads/boosted or long description: box bottom y 1248')
    args = ap.parse_args()
    y0, y1 = (int(v) for v in args.band.split(':'))
    if args.overlay_dir:
        os.makedirs(args.overlay_dir, exist_ok=True)
    out = {}
    for f in args.frames:
        mean, p95 = band_luma(f, y0, y1 + 1)
        out[f] = {'mean': round(mean, 3), 'p95': round(p95, 3), 'pass': mean <= args.max_mean and p95 <= args.max_p95}
        if args.shade_centre is not None:
            ink = ink_rows(f)
            if ink:
                off = ink['centre'] - args.shade_centre
                out[f]['ink'] = {**ink, 'offset': round(off, 1), 'centred': abs(off) <= args.max_offset, 'in_safe_zone': ink['bottom'] <= BOX[3]}
            else:
                out[f]['ink'] = None
        if args.overlay_dir:
            out[f]['overlay'] = overlay(f, args.overlay_dir, y0, y1, BOX[:3] + (ADS_BOTTOM,) if args.ads else BOX)
    json.dump(out, sys.stdout, indent=1)
    print()


if __name__ == '__main__':
    main()
