"""EDU-EP18-SHORT W4 projection run (Film): each world-space shot's start/end camera from scene-sheets.md, converted to the
scripts/shot-projection.py input (y-up, lens = f px over a 1920 sensor, vertical shift = (hy - 960) / 1920) and run through it.
Usage: python3 -I scripts/edu-series/ep18/short/projection-run.py [--json DIR]   (one summary line per shot state)

Camera convention = src/painted/edu18/looks-cams.ts `cam(at, az, r, eye, f, hy, {pitch})`: kit orbitYCam, the camera stands at
at + r*(sin az, 0, cos az) at absolute height eye, kit yaw = -az, level, then tilted by pitch (deg, + looks up). Picture
x = 540 + f*right/depth, y = hy - f*up/depth (kit ycam.ts camSpace/camToPicture). Space M is in millimetres.
Figure anchors (W3 look-frame measures, build-notes "EP18 W3 look frames"): standing GIRL top 1.64 m, chin 1.20 m above the feet;
seated in the canoe head top y 1.04, chin 0.64 (water y 0, gunwale 0.25); seated in bed head top hips + 1.06, chin hips + 0.61.
"""
import json, math, os, subprocess, sys, tempfile

D = math.pi / 180
HERE = os.path.dirname(os.path.abspath(__file__))
TOOL = os.path.join(HERE, '..', '..', '..', 'shot-projection.py')


def cam(at, az, r, eye, f, hy, pitch=0.0):
    return dict(pos=[at[0] + r * math.sin(az * D), eye, at[2] + r * math.cos(az * D)], yaw=-az, f=f, hy=hy, pitch=pitch)


def to_tool(c, points, spans):
    y, p = c['yaw'] * D, c['pitch'] * D
    fwd = [math.sin(y) * math.cos(p), math.sin(p), -math.cos(y) * math.cos(p)]
    return {'up': 'y', 'size': [1080, 1920], 'camera': {'position': c['pos'], 'direction': fwd, 'lens': c['f'], 'sensor': 1920,
            'shift': [0, (c['hy'] - 960) / 1920]}, 'points': points, 'spans': spans, 'caption_band': [1176, 1344]}


def stand(x, g, z, tag='girl'):
    return {f'{tag}_top': [x, g + 1.64, z], f'{tag}_chin': [x, g + 1.20, z], f'{tag}_feet': [x, g, z]}, {f'{tag}_lead': [f'{tag}_top', f'{tag}_feet']}


def canoe_seat(x, z):
    return {'girl_top': [x, 1.04, z], 'girl_chin': [x, 0.64, z], 'gunwale': [x, 0.25, z]}, {'girl_visible': ['girl_top', 'gunwale']}


def bed_seat(h):
    return {'girl_top': [h[0], h[1] + 1.06, h[2]], 'girl_chin': [h[0], h[1] + 0.61, h[2]], 'hips': list(h)}, {'girl_seated': ['girl_top', 'hips']}


def merge(*ps):
    pts, sp = {}, {}
    for p, s in ps:
        pts.update(p); sp.update(s)
    return pts, sp


# --- shot states (scene-sheets.md shot blocks own these numbers) ---
R1_CANOE = canoe_seat(0.0, 0.0)
H1 = {'h1_head': [1.6, 0.55, -2.6], 'h1_jaw_tip': [1.6, 1.4, -2.6], 'h1_waterline': [1.6, 0.0, -2.6], 'bow_tip': [0.48, 0.25, 2.71]}
cLF01 = lambda az, r: cam([0.6, 0.7, -1.3], az, r, 1.0, 2100, 700)
SH02_C = lambda x: merge(canoe_seat(x, 0.0), ({'hippo_eyes': [x - 11.6, 0.25, -0.5], 'hippo_back': [x - 12.6, 0.12, -0.5]}, {}))
SH03 = merge(canoe_seat(12.0, 0.0), ({'hippo_start': [-2.0, 0.5, -0.5], 'hippo_halt': [3.75, 0.5, -0.5], 'halt_water': [3.75, 0.0, -0.5],
                                      'wave_top_halt': [3.9, 0.9, -0.5], 'stern': [9.25, 0.25, 0.0]}, {}))
SH04 = {'face': [12.0, 0.84, 0.0], 'girl_top': [12.0, 1.04, 0.0], 'girl_chin': [12.0, 0.64, 0.0], 'gunwale': [12.4, 0.25, 0.3]}
SH05 = merge(canoe_seat(13.5, 0.0), ({'h3_head': [4.0, 0.3, -0.8], 'canoe_bow': [16.25, 0.25, 0.0], 'canoe_stern': [10.75, 0.25, 0.0]}, {}))
B0 = (60.0, 0.30, 14.5)
B2_GIRL = stand(*B0)
H4 = {'h4_eyes': [56.3, 0.25, 6.0], 'h4_yawn_top': [56.3, 0.6, 6.0], 'canoe_beached': [63.0, 0.15, 13.0]}
PHONE_B2 = {'phone_top': [60.05, 1.42, 14.82], 'phone_bot': [60.05, 1.28, 14.80]}
G0 = (0.3, 0.0, 0.4)
V_GIRL = stand(*G0)
V_DOG = {'dog_D1_top': [0.35, 0.50, -0.5], 'dog_D1_paws': [0.35, 0.0, -0.5], 'hand_H': [0.45, 0.60, -0.05]}
P0 = (0.0, 0.35, -0.75)
F_GIRL = stand(*P0)
SNAKE = {'snake_left': [-0.63, 0.36, 0.10], 'snake_head': [0.47, 0.46, -0.10], 'snake_mid': [-0.08, 0.36, 0.0], 'foot_raised': [0.0, 0.47, -0.45]}
LIE = {'head': [-0.75, 0.62, -1.15], 'feet_lie': [0.75, 0.55, -1.15], 'bed_front_top': [0.0, 0.45, -0.5], 'lamp_bulb': [-1.35, 0.85, -1.5], 'fan_head': [1.2, 1.15, -1.5]}
HIPS = (-0.55, 0.45, -1.35)
N_SEAT = bed_seat(HIPS)
LAP_PHONE = {'phone_c': [-0.45, 0.81, -0.96], 'phone_left': [-0.483, 0.81, -0.96], 'phone_right': [-0.417, 0.81, -0.96], 'face_c': [-0.55, 1.30, -1.30]}
RIM = {'rim_far_x': [-95.5, 32, 0], 'rim_near_x': [95.5, 32, 0], 'rim_far_z': [0, 32, -77], 'rim_near_z': [0, 32, 77], 'centre_spot': [0, 0, 0],
       'pitch_corner_far': [-52.5, 0, -34], 'pitch_corner_near': [52.5, 0, 34], 'roof_far': [-60, 37, -60]}
MOS = {'mos_head': [3.0, 8.0, 0.0], 'mos_tail': [-3.0, 8.0, 0.0], 'mos_leg_low': [0.0, 0.0, 0.0]}

SHOTS = [
    ('B01-SH01 start', cam([0.6, 0.7, -1.3], -18, 6.6, 1.0, 2100, 700), merge(R1_CANOE, (H1, {}))),
    ('B01-SH01 end (LF01)', cLF01(-12, 6.0), merge(R1_CANOE, (H1, {}))),
    ('B01-SH02 start', cam([10.2, 0.7, 0.0], 72, 3.0, 0.95, 1700, 760), SH02_C(10.2)),
    ('B01-SH02 end', cam([11.4, 0.7, 0.0], 78, 3.0, 0.95, 1700, 760), SH02_C(11.4)),
    ('B01-SH03 start', cam([7.5, 0.55, -0.25], 82, 9.6, 1.2, 2100, 740), SH03),
    ('B01-SH03 end', cam([7.5, 0.55, -0.25], 82, 9.1, 1.2, 2100, 740), SH03),
    ('B01-SH04 start', cam([12.0, 0.84, 0.0], 90, 1.3, 0.95, 1100, 820), (SH04, {'head': ['girl_top', 'girl_chin']})),
    ('B01-SH04 end', cam([12.0, 0.84, 0.0], 98, 1.15, 0.95, 1100, 820), (SH04, {'head': ['girl_top', 'girl_chin']})),
    ('B01-SH05 start', cam([12.0, 0.0, -2.0], 30, 14.0, 4.0, 900, 700, -12), SH05),
    ('B01-SH05 end', cam([12.0, 0.0, -2.0], 40, 20.0, 9.0, 900, 700, -22), SH05),
    ('B02-SH01 start', cam([60.0, 1.55, 14.5], 0, 0.75, 1.55, 900, 900), merge(B2_GIRL, (H4, {}))),
    ('B02-SH01 end', cam([60.0, 1.55, 14.5], 6, 0.70, 1.55, 900, 900), merge(B2_GIRL, (H4, {}))),
    ('B02-SH03 start', cam([59.6, 1.2, 14.5], 20, 2.4, 1.5, 1000, 600), merge(B2_GIRL, (H4, {}), (PHONE_B2, {}))),
    ('B02-SH03 end', cam([60.05, 1.35, 14.81], 12, 0.9, 1.55, 1000, 700, -8), merge(B2_GIRL, (H4, {}), (PHONE_B2, {}))),
    ('B03-SH01 start', cam([0.3, 1.0, 0.0], 200, 6.6, 1.4, 1900, 690), merge(stand(1.9, 0, 1.3), ({'gate_post_L': [1.4, 1.6, 0], 'gate_post_R': [-1.4, 1.6, 0]}, {}))),
    ('B03-SH01 end (LF02)', cam([0.3, 1.0, 0.0], 192, 6.0, 1.4, 1900, 690), merge(V_GIRL, ({'gate_post_L': [1.4, 1.6, 0], 'gate_post_R': [-1.4, 1.6, 0]}, {}))),
    ('B03-SH02 start', cam([0.3, 0.6, -0.5], 190, 2.85, 0.55, 1100, 880), merge(V_GIRL, ({'dog_entry': [0.15, 0.5, -2.6], 'dog_entry_paws': [0.15, 0.0, -2.6]}, {}))),
    ('B03-SH02 end', cam([0.3, 0.6, -0.5], 182, 2.4, 0.55, 1100, 880), merge(V_GIRL, (V_DOG, {}))),
    ('B03-SH03 start', cam([0.35, 0.85, -0.2], 145, 1.6, 0.85, 1100, 760), merge(V_GIRL, (V_DOG, {}))),
    ('B03-SH03 end', cam([0.35, 0.85, -0.2], 135, 1.4, 0.85, 1100, 760), merge(V_GIRL, (V_DOG, {}))),
    ('B03-SH04 start', cam([0, 8, 0], 55, 110, 52, 1000, 840, -22), (RIM, {})),
    ('B03-SH04 mid (e 0.5)', 'MIX', (RIM, {})),
    ('B03-SH04 end (LF04)', cam([0, 8, 0], 65, 141.6, 189.2, 1000, 840, -52), (RIM, {})),
    ('B04-SH01 start', cam([0.3, 1.0, -0.2], 195, 2.6, 1.3, 1050, 700), merge(V_GIRL, (V_DOG, {}))),
    ('B04-SH01 end', cam([0.3, 1.0, -0.2], 188, 2.3, 1.3, 1050, 700), merge(V_GIRL, ({'dog_exit': [2.2, 0.5, -0.9]}, {}))),
    ('B04-SH02 start', cam([0, 0.7, -0.6], 0, 2.2, 0.7, 1100, 850), merge(stand(0.0, 0.35, -1.25), (SNAKE, {}))),
    ('B04-SH02 end (LF02B)', cam([0, 0.7, -0.6], 0, 2.0, 0.7, 1100, 850), merge(F_GIRL, (SNAKE, {}))),
    ('B04-SH03 start', cam([0.35, 0.45, -0.2], 40, 0.9, 0.62, 1200, 760, -10), merge(F_GIRL, (SNAKE, {}))),
    ('B04-SH03 end', cam([0.35, 0.45, -0.2], 32, 0.8, 0.62, 1200, 760, -10), merge(F_GIRL, (SNAKE, {}))),
    ('B04-SH04 start', cam([0.0, 0.8, -1.0], 20, 3.0, 1.2, 900, 760, -6), merge(stand(0.0, 0.35, -1.0), (SNAKE, {}))),
    ('B04-SH04 end', cam([0.0, 0.3, -1.0], 35, 16.0, 9.0, 900, 640, -26), merge(stand(0.0, 0.35, -1.9), ({'snake_exit': [0.9, 0.0, -0.2], 'field_far': [-20, 0.6, -60]}, {}))),
    ('B05-SH01 start', cam([-0.15, 0.55, -1.0], -5, 2.35, 1.45, 880, 700), (LIE, {'lying': ['head', 'feet_lie']})),
    ('B05-SH01 end (LF03)', cam([-0.15, 0.55, -1.0], 0, 2.1, 1.45, 880, 700), (LIE, {'lying': ['head', 'feet_lie']})),
    ('B05-SH02 start', cam([-0.75, 0.62, -1.15], 0, 0.9, 0.75, 1100, 820), ({'head': [-0.75, 0.62, -1.15], 'head_top_side': [-0.95, 0.62, -1.15], 'blanket_edge': [-0.45, 0.55, -1.0], 'dot_orbit': [-0.75, 0.80, -0.95]}, {})),
    ('B05-SH02 end', cam([-0.75, 0.62, -1.15], -6, 0.8, 0.75, 1100, 820), ({'head': [-0.75, 0.62, -1.15], 'head_top_side': [-0.95, 0.62, -1.15], 'blanket_edge': [-0.45, 0.58, -1.0], 'dot_orbit': [-0.75, 0.80, -0.95]}, {})),
    ('B05-SH03 start (mm)', cam([0, 8, 0], -20, 22, 8, 1100, 700), (MOS, {'body': ['mos_tail', 'mos_head']})),
    ('B05-SH03 L13 end (mm)', cam([0, 8, 0], 20, 26, 8, 1100, 700), (MOS, {'body': ['mos_tail', 'mos_head']})),
    ('B05-SH03 end dot (mm)', cam([0, 8, 0], 20, 1100, 8, 1100, 700), (MOS, {'body': ['mos_tail', 'mos_head']})),
    ('B06-SH01 start', cam([-0.6, 0.8, -1.0], -20, 2.0, 1.2, 1150, 640), merge(bed_seat((-0.55, 0.45, -1.15)), ({'lamp_bulb': [-1.35, 0.85, -1.5]}, {}))),
    ('B06-SH01 end (LF03L)', cam([-0.6, 0.8, -1.0], -12, 1.75, 1.2, 1150, 640), merge(N_SEAT, ({'lamp_bulb': [-1.35, 0.85, -1.5], 'phone_chest': [-0.5, 0.95, -1.1]}, {}))),
    ('B06-SH04 start', cam([-0.55, 1.22, -1.30], -8, 0.95, 1.30, 1150, 740), merge(N_SEAT, ({'phone_chest': [-0.5, 0.98, -1.05]}, {}))),
    ('B06-SH04 end', cam([-0.55, 1.22, -1.30], 0, 0.85, 1.30, 1150, 740), merge(N_SEAT, ({'phone_chest': [-0.5, 0.98, -1.05]}, {}))),
    ('B06-SH05 start', cam([-0.5, 1.0, -1.15], -6, 0.95, 1.25, 1100, 640, -14), merge(N_SEAT, (LAP_PHONE, {'phone_w': ['phone_left', 'phone_right']}))),
    ('B06-SH05 end', cam([-0.5, 1.0, -1.15], -3, 0.90, 1.25, 1100, 640, -14), merge(N_SEAT, (LAP_PHONE, {'phone_w': ['phone_left', 'phone_right']}))),
]


def run(name, c, ps, outdir=None):
    pts, sp = ps
    data = to_tool(c, pts, sp)
    with tempfile.NamedTemporaryFile('w', suffix='.json', delete=False) as f:
        json.dump(data, f)
        path = f.name
    try:
        res = json.loads(subprocess.run([sys.executable, '-I', TOOL, path, '--min-height', '480'], check=True, capture_output=True, text=True).stdout)
    finally:
        os.unlink(path)
    if outdir:
        json.dump({'input': data, 'output': res}, open(os.path.join(outdir, name.replace(' ', '_').replace('(', '').replace(')', '') + '.json'), 'w'), indent=1)
    parts = []
    for k, v in res['points'].items():
        if v.get('behind_camera'):
            parts.append(f'{k} BEHIND')
        else:
            parts.append(f"{k} ({v['x']},{v['y']}){'' if v['in_frame'] else ' OUT'}{' BAND' if v.get('in_caption_band') else ''}")
    for k, v in res['spans'].items():
        parts.append(f"[{k} {v.get('height_px', v)}px{' <480' if v.get('below_min') else ''}]")
    print(f'{name}: ' + '; '.join(parts))


if __name__ == '__main__':
    outdir = sys.argv[sys.argv.index('--json') + 1] if '--json' in sys.argv else None
    if outdir:
        os.makedirs(outdir, exist_ok=True)
    for i, (name, c, ps) in enumerate(SHOTS):
        if c == 'MIX':  # kit mixYCam halfway between the neighbouring states (linear in position and pitch)
            a, b = SHOTS[i - 1][1], SHOTS[i + 1][1]
            c = {k: ([(a[k][j] + b[k][j]) / 2 for j in range(3)] if k == 'pos' else (a[k] + b[k]) / 2) for k in a}
        run(name, c, ps, outdir)
