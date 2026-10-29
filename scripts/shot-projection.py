"""Project scene-sheet world points through a pinhole camera to frame pixels, so a shot's numbers can be checked before any render.
Usage: python3 -I scripts/shot-projection.py SHOT.json [--min-height 480]
SHOT.json:
  {"up": "z",                                   # "z" (Blender) or "y" (Three.js); right-handed world
   "size": [1080, 1920],                        # frame pixels, default 1080x1920
   "camera": {"position": [x, y, z], "target": [x, y, z] | "direction": [x, y, z],
              "vfov": 55 | "lens": 50, "sensor": 36,   # vertical FOV in degrees, or Blender lens/sensor (sensor fit on the larger side)
              "shift": [0, -0.2]},                     # optional Blender shift_x/shift_y, fraction of the larger frame side
   "points": {"name": [x, y, z], ...},
   "spans": {"name": ["point_a", "point_b"], ...},     # e.g. feet -> head; reports on-screen pixel height
   "caption_band": [860, 1248]}                         # optional: the rows the shot's captions occupy (from the scene sheet)
Prints one JSON object: each point's pixel x/y (origin top-left), screen side, in-frame and, when a band is given, whether it falls in
the caption band (docs/production-requirements.md#vertical-caption-safe-zone); span heights; points behind the camera are flagged.
"""
import argparse, json, math, sys


def sub(a, b): return [a[i] - b[i] for i in range(3)]
def dot(a, b): return sum(a[i] * b[i] for i in range(3))
def cross(a, b): return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
def unit(a):
    n = math.sqrt(dot(a, a))
    return [v / n for v in a]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('shot')
    ap.add_argument('--min-height', type=float, help='flag spans shorter than this many pixels (lead rule: 480)')
    args = ap.parse_args()
    s = json.load(open(args.shot))
    w, h = s.get('size', [1080, 1920])
    cam = s['camera']
    up = [0, 0, 1] if s.get('up', 'z') == 'z' else [0, 1, 0]
    pos = cam['position']
    fwd = unit(cam['direction'] if 'direction' in cam else sub(cam['target'], pos))
    right = unit(cross(fwd, up))
    cup = cross(right, fwd)
    if 'vfov' in cam:
        f = (h / 2) / math.tan(math.radians(cam['vfov']) / 2)
    else:
        f = cam['lens'] / cam['sensor'] * max(w, h)
    sx, sy = cam.get('shift', [0, 0])
    out = {'focal_px': round(f, 1), 'points': {}, 'spans': {}}
    for name, p in s.get('points', {}).items():
        d = sub(p, pos)
        z = dot(d, fwd)
        if z <= 0:
            out['points'][name] = {'behind_camera': True}
            continue
        x = w / 2 + f * dot(d, right) / z - sx * max(w, h)
        y = h / 2 - (f * dot(d, cup) / z - sy * max(w, h))
        out['points'][name] = {'x': round(x), 'y': round(y), 'depth_m': round(z, 2),
                               'side': 'left' if x < w / 2 else 'right',
                               'in_frame': 0 <= x < w and 0 <= y < h}
        if 'caption_band' in s:
            out['points'][name]['in_caption_band'] = s['caption_band'][0] <= y <= s['caption_band'][1]
    for name, (a, b) in s.get('spans', {}).items():
        pa, pb = out['points'].get(a, {}), out['points'].get(b, {})
        if 'x' not in pa or 'x' not in pb:
            out['spans'][name] = {'error': 'endpoint behind camera or missing'}
            continue
        px = round(math.hypot(pa['x'] - pb['x'], pa['y'] - pb['y']))
        out['spans'][name] = {'px': px, 'frame_share': round(px / h, 3)}
        if args.min_height is not None:
            out['spans'][name]['meets_min'] = px >= args.min_height
    json.dump(out, sys.stdout, indent=1)
    print()


if __name__ == '__main__':
    main()
