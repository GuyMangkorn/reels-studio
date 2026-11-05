"""EDU-EP03-SHORT VD12 face measure (LF03 pass). Usage: python3 -I scripts/edu03/measure-face.py NORMAL.png DOG.png X0 Y0 X1 Y1
Skin pixels are found in the NORMAL still inside the face box (hue 15-95 deg, C* >= 20, L* >= 40: this drops ink, eyes, mouth, the cap and the
blue band), then the same pixel positions are read in the DOG still (identical strokes). Prints mean CIELAB L*, C*, hue for both, plus the
lawn (a 40 px patch of bare lawn at the bottom of the frame) for reference. Needs the helpers of measure-s1.py."""
import importlib.util, json, math, sys
spec = importlib.util.spec_from_file_location('s1', __file__.replace('measure-face.py', 'measure-s1.py').replace('.py', '.py'))
src = open(spec.origin).read().replace('\nmain(sys.argv[1])', '\n')
ns = {}
exec(compile(src, 's1', 'exec'), ns)
load, px, lab, cstar = ns['load'], ns['px'], ns['lab'], ns['cstar']
n_path, d_path = sys.argv[1], sys.argv[2]
x0, y0, x1, y1 = (int(v) for v in sys.argv[3:7])
N, D = load(n_path), load(d_path)
pts = []
for y in range(y0, y1):
    for x in range(x0, x1):
        L, a, b = lab(px(N, x, y))
        C, h = cstar((L, a, b))
        if 15 <= h <= 95 and C >= 20 and L >= 40:
            pts.append((x, y))
def mean(raw, pp):
    ls = [lab(px(raw, x, y)) for x, y in pp]
    m = tuple(sum(c[i] for c in ls) / len(ls) for i in range(3))
    C, h = cstar(m)
    return {'L': round(m[0], 1), 'C': round(C, 1), 'h': round(h, 1)}
lawn = [(x, y) for y in range(1500, 1540) for x in range(100, 140)]
side = [(x, y) for y in range(y0 + 20, y1 - 20) for x in list(range(x0 - 40, x0 - 8)) + list(range(x1 + 8, x1 + 40))]
def dE(a, b): return round(math.dist((a['L'], a['C'] * math.cos(math.radians(a['h'])), a['C'] * math.sin(math.radians(a['h']))), (b['L'], b['C'] * math.cos(math.radians(b['h'])), b['C'] * math.sin(math.radians(b['h'])))), 1)
res = {'face_pixels': len(pts), 'normal': mean(N, pts), 'dog': mean(D, pts), 'lawn_normal': mean(N, lawn), 'lawn_dog': mean(D, lawn), 'beside_head_dog': mean(D, side)}
res['dog_dE_face_vs_lawn'] = dE(res['dog'], res['lawn_dog']); res['dog_dL_face_vs_beside_head'] = round(res['dog']['L'] - res['beside_head_dog']['L'], 1)
print(json.dumps(res))
