"""EDU-EP03-SHORT spike S1 measurements (brief S1 criteria a-e), pure Python + ffmpeg (no numpy).
Usage: python3 -I scripts/edu03/measure-s1.py OUTDIR   (OUTDIR holds S1-normal.png S1-dog.png S1-blue-normal.png S1-blue-dog.png LF01.png LF01-dogview.png LF02.png)
Prints one JSON object. The ball is found in the NORMAL still (colour threshold), then the same pixels are read in the dog-view still:
the two stills carry identical strokes, so a pixel position means the same paint in both."""
import json, math, shutil, subprocess, sys

W, H = 1080, 1920
FF = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'


def load(path, w=W, h=H):
    raw = subprocess.run([FF, '-v', 'error', '-i', path, '-vf', f'scale={w}:{h}:flags=area', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], check=True, capture_output=True).stdout
    return raw


def px(raw, x, y, w=W):
    i = (y * w + x) * 3
    return raw[i], raw[i + 1], raw[i + 2]


def lin(v):
    v /= 255
    return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4


def lab(rgb):
    r, g, b = (lin(v) for v in rgb)
    X, Y, Z = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047, 0.2126 * r + 0.7152 * g + 0.0722 * b, (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883
    f = lambda t: t ** (1 / 3) if t > 216 / 24389 else (24389 / 27 * t + 16) / 116
    fx, fy, fz = f(X), f(Y), f(Z)
    return 116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)


def mean_lab(pts, raw, w=W):
    ls = [lab(px(raw, x, y, w)) for x, y in pts]
    n = len(ls)
    return tuple(sum(c[i] for c in ls) / n for i in range(3))


def de(a, b):
    return math.dist(a, b)


def cstar(l):
    return math.hypot(l[1], l[2]), (math.degrees(math.atan2(l[2], l[1])) + 360) % 360


def find(raw, test, box=(0, 0, W, H), w=W):
    xs, ys, pts = [], [], []
    for y in range(box[1], box[3]):
        for x in range(box[0], box[2]):
            if test(*px(raw, x, y, w)):
                pts.append((x, y)); xs.append(x); ys.append(y)
    cx, cy = sum(xs) / len(xs), sum(ys) / len(ys)
    r = math.sqrt(len(pts) / math.pi)
    return pts, cx, cy, r


def disc(cx, cy, r0, r1=0.0):
    return [(x, y) for y in range(int(cy - r0) - 1, int(cy + r0) + 2) for x in range(int(cx - r0) - 1, int(cx + r0) + 2) if r1 <= math.hypot(x - cx, y - cy) <= r0 and 0 <= x < W and 0 <= y < H]


def ball_vs_grass(nrm, dog, test, box):
    pts, cx, cy, r = find(nrm, test, box)
    lit = disc(cx, cy + 0.15 * r, 0.35 * r)  # lit base of the ball: inside the lit disc, clear of the outline, the highlight (upper left) and the shade crescent (lower right)
    ring = [p for p in disc(cx, cy, 3.2 * r, 1.8 * r) if not (p[0] > cx and p[1] > cy - 0.2 * r and p[1] < cy + 1.2 * r and p[0] < cx + 2.2 * r)]  # grass ring; skip the contact shadow to the right
    out = {'centre': [round(cx), round(cy)], 'radius_px': round(r, 1)}
    for name, raw in (('normal', nrm), ('dog', dog)):
        b, g = mean_lab(lit, raw), mean_lab(ring, raw)
        c, h = cstar(b)
        out[name] = {'ball_Lab': [round(v, 1) for v in b], 'grass_Lab': [round(v, 1) for v in g], 'dE76': round(de(b, g), 1), 'dL': round(b[0] - g[0], 1), 'ball_C': round(c, 1), 'ball_h': round(h, 1)}
    out['dE_drop_pct'] = round(100 * (1 - out['dog']['dE76'] / out['normal']['dE76']), 1)
    return out, (cx, cy, r)


def structure_corr(a, b, w=270, h=480):
    A, B = load(a, w, h), load(b, w, h)
    ya = [0.2126 * A[i] + 0.7152 * A[i + 1] + 0.0722 * A[i + 2] for i in range(0, len(A), 3)]
    yb = [0.2126 * B[i] + 0.7152 * B[i + 1] + 0.0722 * B[i + 2] for i in range(0, len(B), 3)]
    ma, mb = sum(ya) / len(ya), sum(yb) / len(yb)
    cov = sum((p - ma) * (q - mb) for p, q in zip(ya, yb)); va = sum((p - ma) ** 2 for p in ya); vb = sum((q - mb) ** 2 for q in yb)
    return cov / math.sqrt(va * vb)


def main(d):
    res = {}
    n, g = load(f'{d}/S1-normal.png'), load(f'{d}/S1-dog.png')
    red = lambda r, gg, b: r > 150 and gg < 95 and b < 95
    res['red_ball'], (cx, cy, r) = ball_vs_grass(n, g, red, (0, 700, 700, 1300))
    # 270 px findability: the same measurement on the 270x480 downscale (ball radius ~ r/4 px)
    n4, g4 = load(f'{d}/S1-normal.png', 270, 480), load(f'{d}/S1-dog.png', 270, 480)
    bx, by, br = cx / 4, cy / 4, r / 4
    lit4 = [(x, y) for y in range(int(by - br), int(by + br) + 1) for x in range(int(bx - br), int(bx + br) + 1) if math.hypot(x - bx, y - (by + 0.15 * br)) <= 0.5 * br]
    ring4 = [(x, y) for y in range(int(by - 4 * br), int(by + 4 * br) + 1) for x in range(int(bx - 4 * br), int(bx + 4 * br) + 1) if 1.8 * br <= math.hypot(x - bx, y - by) <= 3.4 * br and not (x > bx and by - 0.2 * br < y < by + 1.2 * br)]
    b4, gr4 = mean_lab(lit4, g4, 270), mean_lab(ring4, g4, 270)
    res['findability_270px'] = {'ball_diameter_px_at_270': round(2 * br, 1), 'dog_view_dL': round(b4[0] - gr4[0], 1), 'dog_view_dE76': round(de(b4, gr4), 1)}
    bn, bd = load(f'{d}/S1-blue-normal.png'), load(f'{d}/S1-blue-dog.png')
    blue = lambda r, gg, b: b > 170 and r < 100 and gg < 150
    res['blue_ball'], _ = ball_vs_grass(bn, bd, blue, (0, 700, 700, 1300))
    # golden-shower flowers on LF01 (normal pixels with the flower yellow, read in the dog-view still at the same positions)
    l1, l1d = load(f'{d}/LF01.png'), load(f'{d}/LF01-dogview.png')
    pts, *_ = find(l1, lambda r, gg, b: r > 225 and 185 < gg < 225 and b < 90, (0, 0, 540, 420))
    pts = pts[:: max(1, len(pts) // 3000)]
    fy, fd = mean_lab(pts, l1), mean_lab(pts, l1d)
    res['golden_flowers'] = {'pixels': len(pts), 'normal_C': round(cstar(fy)[0], 1), 'dog_C': round(cstar(fd)[0], 1), 'dog_h': round(cstar(fd)[1], 1)}
    res['structure_corr_S1_270'] = round(structure_corr(f'{d}/S1-normal.png', f'{d}/S1-dog.png'), 4)
    res['structure_corr_LF01_270'] = round(structure_corr(f'{d}/LF01.png', f'{d}/LF01-dogview.png'), 4)
    # tag pixels (LF02, y 190-270, x 100-700): the screen label is white fill with a #1d2129 stroke, outside the colour map
    t = load(f'{d}/LF02.png')
    whites = sum(1 for y in range(190, 270) for x in range(100, 700) if min(px(t, x, y)) >= 250)
    strokes = sum(1 for y in range(190, 270) for x in range(100, 700) if px(t, x, y) == (0x1d, 0x21, 0x29))
    res['tag_unmapped'] = {'pure_white_px': whites, 'stroke_1d2129_px': strokes}
    print(json.dumps(res, indent=1))


main(sys.argv[1])
