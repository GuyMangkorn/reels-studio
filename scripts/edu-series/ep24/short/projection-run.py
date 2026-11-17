"""EDU-EP24-SHORT scene-sheet projection check (Film, W5.1, 2026-11-17): camMove-style lines -> scripts/shot-projection.py JSON at l0 and end (kit YCam math:
orbit at+r(sin A, cos A), eye y, level or pitched, hy as a vertical lens shift). Anchors calibrated on the approved look frames
(LF01x/LF02 leads within 1 px of measure-looks.ts). Usage: python3 -I scripts/edu-series/ep24/short/projection-run.py [SH01 ...]
Writes the shot-projection.py inputs to out/edu24/projection/ and prints one line per shot end (l0, end)."""
import json, math, subprocess, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '../../../..'))
OUT = os.path.join(REPO, 'out/edu24/projection'); os.makedirs(OUT, exist_ok=True)
P = {
 'you_crown': [-0.5, 1.40, 0.9], 'you_hip': [-0.5, 0.38, 0.9], 'you_hand': [-0.62, 1.78, 0.9],
 'rival_crown': [0.5, 1.445, 0.9], 'rival_hip': [0.5, 0.40, 0.9], 'rival_hand': [0.62, 1.80, 0.9],
 'host_crown': [1.10, 1.82, -1.85], 'table_top': [1.10, 1.0, -1.35],
 'note_offer': [0.92, 1.25, -1.50], 'note_lift': [1.0, 1.31, -1.75],
 'card_tl': [0.65, 1.145, -1.23], 'card_br': [0.85, 1.0, -1.17], 'tray': [1.09, 1.0, -1.27],
 'tab_tl': [-1.25, 2.31, -2.37], 'win_you_tl': [-1.25, 1.98, -2.37], 'win_riv_br': [0.19, 1.52, -2.37],
 'sum_tl': [-1.0, 1.40, -2.37], 'sum_br': [0.05, 1.16, -2.37], 'board_br': [0.45, 1.05, -2.37],
 'g2_crown': [0.0, 1.43, 2.05], 'g3_crown': [0.75, 1.43, 2.05],
}
SPANS = {'you_lead': ['you_hip', 'you_crown'], 'rival_lead': ['rival_hip', 'rival_crown'], 'host_lead': ['table_top', 'host_crown']}

def cam(at, A, r, eye, f, hy, pitch=0.0):
    a = math.radians(A); pos = [at[0] + r * math.sin(a), eye, at[2] + r * math.cos(a)]
    fwd = [-math.sin(a), 0, -math.cos(a)]; pr = math.radians(pitch)
    fwd = [fwd[0] * math.cos(pr), math.sin(pr), fwd[2] * math.cos(pr)]
    return {'position': [round(v, 4) for v in pos], 'direction': fwd, 'vfov': math.degrees(2 * math.atan(960 / f)), 'shift': [0, (hy - 960) / 1920]}

def run(sid, line, pts):
    res = {}
    for k, u in (('l0', 0.0), ('mid', 0.5), ('end', 1.0)):
        L = lambda v: v[0] + (v[1] - v[0]) * u if isinstance(v, (list, tuple)) else v
        at = [L((line['at'][0][i], line['at'][1][i])) for i in range(3)] if isinstance(line['at'][0], list) else line['at']
        c = cam(at, L(line['A']), L(line['r']), L(line['eye']), line['f'], line['hy'], L(line.get('pitch', 0.0)))
        s = {'up': 'y', 'size': [1080, 1920], 'camera': c, 'points': {p: P[p] for p in pts}, 'spans': {n: v for n, v in SPANS.items() if v[0] in pts and v[1] in pts}, 'caption_band': [1176, 1344]}
        fn = f'{OUT}/{sid}_{k}.json'; json.dump(s, open(fn, 'w'))
        o = json.loads(subprocess.run(['python3', '-I', f'{REPO}/scripts/shot-projection.py', fn, '--min-height', '480'], capture_output=True, text=True).stdout)
        res[k] = (c['position'], o)
    return res

def fmt(sid, res):
    for k, (pos, o) in res.items():
        pts = ' '.join(f"{n}({v['x']},{v['y']}{'!B' if v.get('in_caption_band') else ''}{'' if v.get('in_frame') else '!OUT'})" if 'x' in v else f'{n}(behind)' for n, v in o['points'].items())
        sp = ' '.join(f"{n}={v.get('px')}" for n, v in o['spans'].items())
        print(f"{sid} {k} cam={[round(x,2) for x in pos]} {sp} | {pts}")

SHOTS = {k: v for k, v in json.load(open(f'{HERE}/projection-shots.json')).items() if not k.startswith('_')}
for sid, d in SHOTS.items():
    if len(sys.argv) > 1 and sid not in sys.argv[1:]: continue
    fmt(sid, run(sid, d['cam'], d['pts']))
