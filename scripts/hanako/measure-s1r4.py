"""HANAKO-SHORT S1-R4 measurements (Boss): B02-SH01 viewer's fist and B03-SH01 FPOV-CHEST, from rendered stills.

Usage: python3 -I scripts/hanako/measure-s1r4.py [EVIDENCE_DIR]   (default out/qa/hanako/s1r4; needs ffmpeg on PATH)
Reads before/ and after/ folders written by scripts/hanako/render-g1.mjs (HANAKO_OUT). Prints one JSON object.
Pure Python (no numpy/PIL in this checkout). Thresholds and expected values come from scripts/hanako/short/film-r5.md
(VD25, VD27, VD29); a value outside them is reported, not hidden.
"""
import json
import os
import shutil
import subprocess
import sys

W, H = 1080, 1920
FFMPEG = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'


def load(path):
    return subprocess.run([FFMPEG, '-v', 'error', '-i', path, '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                          check=True, capture_output=True).stdout


def lum(raw, x, y):
    i = (y * W + x) * 3
    return 0.2126 * raw[i] + 0.7152 * raw[i + 1] + 0.0722 * raw[i + 2]


def rgb(raw, x, y):
    i = (y * W + x) * 3
    return raw[i], raw[i + 1], raw[i + 2]


def box_mean(raw, x0, y0, x1, y1):
    total = n = 0
    for y in range(y0, y1):
        for x in range(x0, x1):
            total += lum(raw, x, y)
            n += 1
    return round(total / n, 1)


def mean_rgb(raw, x0, y0, x1, y1):
    s = [0, 0, 0]
    n = 0
    for y in range(y0, y1):
        for x in range(x0, x1):
            c = rgb(raw, x, y)
            s[0] += c[0]; s[1] += c[1]; s[2] += c[2]; n += 1
    return [round(v / n, 1) for v in s]


def screen_box(x0, y0, x1, y1, s, fx=560, fy=640):
    """Plate box -> screen box for a push about (fx, fy) at scale s (dx = dy = 0 for B03)."""
    tr = lambda x, y: ((x - fx) * s + fx, (y - fy) * s + fy)
    (a, b), (c, d) = tr(x0, y0), tr(x1, y1)
    return int(round(a)), int(round(b)), int(round(c)), int(round(d))


def diff_mask(a, b, thr=8):
    xs, ys = [], []
    minx, miny, maxx, maxy = W, H, -1, -1
    pts = []
    for y in range(H):
        row = y * W * 3
        for x in range(W):
            i = row + x * 3
            if max(abs(a[i] - b[i]), abs(a[i + 1] - b[i + 1]), abs(a[i + 2] - b[i + 2])) > thr:
                pts.append((x, y))
                if x < minx: minx = x
                if y < miny: miny = y
                if x > maxx: maxx = x
                if y > maxy: maxy = y
    return pts, (minx, miny, maxx, maxy) if pts else None


def fist(root, before_name, after_name):
    b, a = load(os.path.join(root, 'before', before_name)), load(os.path.join(root, 'after', after_name))
    pts, box = diff_mask(b, a)
    inside = set(pts)
    seam = box_mean(a, 810, 320, 818, 860)
    # Local door background beside the fist: the same box in the before frame, outside the fist mask.
    bg_vals = [lum(b, x, y) for y in range(640, 760, 2) for x in range(880, 960, 2) if (x, y) not in inside]
    fist_vals = [lum(a, x, y) for (x, y) in pts]
    left_x = box[0] if box else None
    return {
        'after': after_name, 'fist_diff_box_x0_y0_x1_y1': box, 'fist_left_extent_x': left_x,
        'fist_mean_luma_after': round(sum(fist_vals) / len(fist_vals), 1) if fist_vals else None,
        'seam_strip_mean_luma_after': seam,
        'local_background_mean_luma_before': round(sum(bg_vals) / len(bg_vals), 1) if bg_vals else None,
        'changed_pixels': len(pts),
    }


def tag_metrics(raw, s):
    # Tag body #cdd1c3 found by a flood fill from a seed inside the tag (plate (880, 384)), tolerance 9 so the page
    # (#d8dccf, 11 levels away) is not joined. The bbox of the filled region is the tag box; text holes do not change it.
    wx0, wy0, wx1, wy1 = screen_box(690, 300, 930, 470, s)
    sx, sy = [int(round(v)) for v in ((880 - 560) * s + 560, (384 - 640) * s + 640)]
    seen, stack, xs, ys = set(), [(sx, sy)], [], []
    while stack:
        x, y = stack.pop()
        if (x, y) in seen or not (wx0 <= x < wx1 and wy0 <= y < wy1):
            continue
        seen.add((x, y))
        r, g, b = rgb(raw, x, y)
        if abs(r - 205) > 9 or abs(g - 209) > 9 or abs(b - 195) > 9:
            continue
        xs.append(x); ys.append(y)
        stack.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])
    if not xs:
        return {'tag_body_box': None}
    bx0, by0, bx1, by1 = min(xs), min(ys), max(xs), max(ys)
    # Dark text rows inside the tag body: small line in the top part, main line in the lower part.
    rows = []
    for y in range(by0 + 1, by1):
        dark = sum(1 for x in range(bx0 + 1, bx1) if lum(raw, x, y) < 70)
        rows.append((y, dark))
        runs, cur = [], []
    for y, d in rows:
        if d > 0:
            cur.append(y)
        elif cur:
            runs.append((cur[0], cur[-1])); cur = []
    if cur:
        runs.append((cur[0], cur[-1]))
    heights = [b - a + 1 for a, b in runs]
    main = runs[-1] if runs else None
    return {
        'tag_body_box_screen': [bx0, by0, bx1, by1],
        'tag_box_plate_equiv': [round(((bx0 - 560) / s) + 560), round(((by0 - 640) / s) + 640), round(((bx1 - 560) / s) + 560), round(((by1 - 640) / s) + 640)],
        'text_row_runs_screen': runs,
        'main_line_ink_height_screen_px': (main[1] - main[0] + 1) if main else None,
        'small_line_ink_height_screen_px': (runs[0][1] - runs[0][0] + 1) if len(runs) > 1 else None,
    }


def value_order(raw, s):
    page = mean_rgb(raw, *screen_box(330, 540, 500, 640, s))
    tag = mean_rgb(raw, *screen_box(878, 380, 888, 396, s))
    blouse = mean_rgb(raw, *screen_box(445, 320, 490, 340, s))
    scarf = mean_rgb(raw, *screen_box(528, 244, 546, 258, s))
    L = lambda c: round(0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2], 1)
    return {'page_rgb': page, 'tag_rgb': tag, 'blouse_rgb': blouse, 'scarf_rgb': scarf,
            'luma': {'page': L(page), 'tag': L(tag), 'blouse': L(blouse), 'scarf': L(scarf)},
            'order_page_gt_tag_gt_blouse_gt_scarf': L(page) > L(tag) > L(blouse) > L(scarf)}


def high_saturation_outside_skirt(raw, s):
    """Pixels with HSV saturation > 0.5 and value > 0.3 (the doodle red should be the only one), counted outside the skirt box."""
    skirt = screen_box(592, 700, 728, 740, s)
    count, inside_skirt, xs, ys = 0, 0, [], []
    for y in range(0, H, 2):
        for x in range(0, W, 2):
            r, g, b = rgb(raw, x, y)
            mx, mn = max(r, g, b), min(r, g, b)
            if mx > 77 and mx > 0 and (mx - mn) / mx > 0.5:
                if skirt[0] <= x <= skirt[2] and skirt[1] <= y <= skirt[3]:
                    inside_skirt += 1
                else:
                    count += 1; xs.append(x); ys.append(y)
    return {'saturated_outside_skirt_samples': count, 'saturated_inside_skirt_samples': inside_skirt,
            'outside_bbox': [min(xs), min(ys), max(xs), max(ys)] if xs else None}


def silhouette_edges(raw, y):
    """Outer sleeve edge at row y: left (x 0..200) and right (x 905..1080, clear of the tag at x 700–900): wash and sleeve luma 12 px either side of the strongest step."""
    out = {}
    for name, rng in (('left', range(0, 200)), ('right', range(905, 1080))):
        xs = list(rng)
        steps = [(abs(lum(raw, xs[i + 1], y) - lum(raw, xs[i], y)), xs[i]) for i in range(len(xs) - 1)]
        step, x = max(steps)
        wash_x = x - 12 if name == 'left' else x + 12
        body_x = x + 12 if name == 'left' else x - 12
        wash_x = min(max(wash_x, 0), W - 1); body_x = min(max(body_x, 0), W - 1)
        out[name] = {'edge_x': x, 'wash_luma': round(lum(raw, wash_x, y), 1), 'sleeve_luma': round(lum(raw, body_x, y), 1),
                     'separation': round(abs(lum(raw, wash_x, y) - lum(raw, body_x, y)), 1)}
    return out


def main():
    root = sys.argv[1] if len(sys.argv) > 1 else 'out/qa/hanako/s1r4'
    result = {'root': root, 'fist': [], 'fpov': {}}
    for before, after in [('B02-SH01-f000.png', 'B02-SH01-f000.png'), ('B02-SH01-f105.png', 'B02-SH01-f105.png'),
                          ('B02-SH01-f113.png', 'B02-SH01-f113.png'), ('B02-SH01-f117.png', 'B02-SH01-f117.png'),
                          ('B02-SH01-f126.png', 'B02-SH01-f126.png'), ('B02-SH01-f138.png', 'B02-SH01-f138.png')]:
        result['fist'].append(fist(root, before, after))
    s_by_frame = {'B03-SH01-f000.png': 1.0, 'B03-SH01-f024.png': 1.0 + 0.04 * (1 - __import__('math').cos(__import__('math').pi * 24 / 70)) / 2,
                  'B03-SH01-f036.png': 1.0 + 0.04 * (1 - __import__('math').cos(__import__('math').pi * 36 / 70)) / 2,
                  'B03-SH01-f201.png': 1.14}
    for name, s in s_by_frame.items():
        raw = load(os.path.join(root, 'after', name))
        entry = {'scale': round(s, 5), 'tag': tag_metrics(raw, s), 'values': value_order(raw, s)}
        if name in ('B03-SH01-f000.png',):
            for row in (300, 400, 600, 700):
                entry[f'silhouette_y{row}'] = silhouette_edges(raw, row)
        if name in ('B03-SH01-f036.png', 'B03-SH01-f201.png'):
            entry['saturation'] = high_saturation_outside_skirt(raw, s)
        result['fpov'][name] = entry
    path = os.path.join(root, 'measure-s1r4.json')
    with open(path, 'w') as fh:
        json.dump(result, fh, indent=1)
    print(json.dumps(result, indent=1))


if __name__ == '__main__':
    main()
