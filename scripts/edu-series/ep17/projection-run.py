"""EDU-EP17 W5.1 projection run (Film): each world-space shot's start/end camera from the scene sheet, converted to the
scripts/shot-projection.py input (y-up, lens = f px over a 1920 sensor, vertical shift = (hy - 960) / 1920) and run through it.
Usage: python3 -I scripts/edu-series/ep17/projection-run.py [--json DIR]   (prints one summary line per shot state)

Camera conventions (scene sheet "Units and conventions"): sheet yaw = LOOK yaw (0 looks toward -z, +90 toward +x); a sheet
camera line `sheet(at, yaw, r, eye, f, hy, pitch)` stands at at + r*(sin(-yaw), 0, cos(-yaw)) at height eye, looking level along the
yaw, tilted by pitch (deg, + looks up) = `sheetCam` in src/painted/edu17/palette.ts. `look(pos, target, f, hy, pitch)` = `lookAtCam`.
"""
import json, math, os, subprocess, sys, tempfile

D = math.pi / 180
HERE = os.path.dirname(os.path.abspath(__file__))
TOOL = os.path.join(HERE, '..', '..', 'shot-projection.py')


def bed(z):  # src/painted/edu17/sea.ts bedY
    for z0, z1, y0, y1 in [(0, -16, 0, -2.5), (-16, -80, -2.5, -7), (-80, -150, -7, -38), (-150, -700, -38, -50)]:
        if z0 >= z >= z1:
            u = (z - z0) / (z1 - z0)
            return y0 + (y1 - y0) * (u * u * (3 - 2 * u) if z0 == -80 else u)
    return 0 if z > 0 else -50


def cable(z):  # sea.ts cableAt
    return [0.8 * math.sin(z / 23), bed(z) + (0.012 if z < -80 else -0.05), z]


def sheet(at, yaw, r, eye, f, hy, pitch=0.0):
    pos = [at[0] + r * math.sin(-yaw * D), eye, at[2] + r * math.cos(-yaw * D)]
    return dict(pos=pos, yaw=yaw, f=f, hy=hy, pitch=pitch)


def look(pos, tgt, f, hy, pitch=0.0):
    yaw = math.atan2(tgt[0] - pos[0], -(tgt[2] - pos[2])) / D
    return dict(pos=list(pos), yaw=yaw, f=f, hy=hy, pitch=pitch)


def cut_cam(u):  # looks-cams.ts cutCam (LF07 strip), u 0..1
    at, p = (0.2, -2.6, 0.0), (4.6, 7.5, 11.5)
    dx, dy, dz = p[0] - at[0], p[1] - at[1], p[2] - at[2]
    r, az = math.hypot(dx, dz), math.atan2(dx, dz) - (1 - u) * 8 * D
    ku = 1 / 1.15 + (1 - 1 / 1.15) * u
    return look((at[0] + math.sin(az) * r * ku, at[1] + dy * ku, at[2] + math.cos(az) * r * ku), at, 1150, 560, -28)


def to_tool(c, points, spans):
    y, p = c['yaw'] * D, c['pitch'] * D
    fwd = [math.sin(y) * math.cos(p), math.sin(p), -math.cos(y) * math.cos(p)]
    return {'up': 'y', 'size': [1080, 1920], 'camera': {'position': c['pos'], 'direction': fwd, 'lens': c['f'], 'sensor': 1920,
            'shift': [0, (c['hy'] - 960) / 1920]}, 'points': points, 'spans': spans, 'caption_band': [1176, 1344]}


MAN = {'man_head': [0, 1.72, 0], 'man_chin': [0, 1.295, 0], 'man_feet': [0, 0, 0]}
MANS = {'man_lead': ['man_head', 'man_feet']}
PHONE = {'phone_top': [-0.40, 1.18, -0.60], 'phone_bot': [-0.40, 1.02, -0.60]}
HOSE = {'hose_end': [0.18, 0.95, -0.40]}
K = cable(-53.5)
FS_N = (math.sin(25 * D), 0, math.cos(25 * D))  # FS normal to the cables (anchor drag axis)


def fs_pt(s, y=0.0):
    return [FS_N[0] * s, y, FS_N[2] * s]


A_END = fs_pt(-3.85, 1.2)  # anchor shackle at the shot end (s = -3.0 - 0.0167 * 51)
CHAIN_TOP = [A_END[0] - 0.423 * 55.6, 44.2, A_END[2] - 0.906 * 55.6]  # chain meets the surface (FS y 44.2, compressed)

SHOTS = [
    ('B01-SH01 start', sheet((-0.40, 1.10, -0.60), -12, 0.42, 1.14, 1000, 820), PHONE, {'phone': ['phone_top', 'phone_bot']}),
    ('B01-SH01 end (LF01)', sheet((-0.30, 1.10, -0.55), 3, 1.95, 1.68, 1000, 640), {**MAN, **PHONE, **HOSE}, MANS),
    ('B01-SH02 start', look((1.4, 3.4, 2.8), (-0.3, 0.0, -6), 1000, 700, -16), {**MAN, 'wall_top': [-0.4, 0.95, -0.6], 'line_entry': [-0.6, -1.5, -14]}, MANS),
    ('B01-SH02 end', look((1.1, 3.0, 1.2), (-0.6, -1.5, -14), 1000, 700, -12), {**MAN, 'line_entry': [-0.6, -1.5, -14], 'beach_mid': [-0.5, -0.8, -8]}, MANS),
    ('B01-SH03 start', sheet((0, -2, -20), 0, 6, -0.8, 1000, 760), {'cable_-20': cable(-20), 'surface_-20': [0, 0, -20]}, {}),
    ('B01-SH03 end', sheet((0.5, -38.8, -190), 4, 7, -37.7, 1000, 820), {'cable_-190': cable(-190), 'cable_-200': cable(-200), 'cam_floor': [0, bed(-183), -183]}, {}),
    ('B01-SH05 start (LF01R)', sheet((0.05, 1.2, 0), 124, 4.2, 1.85, 2500, 720, -8), {**MAN, **PHONE, **HOSE}, MANS),
    ('B01-SH05 end', sheet((0.05, 1.2, 0), 120, 3.95, 1.85, 2500, 720, -8), {**MAN, **PHONE, **HOSE}, MANS),
    ('B02-SH01 start', look((1.3, 2.6, 2.6), (-1.5, 0.5, -6), 1000, 560), {**MAN, 'boat_B2': [-1.0, -1.5, -40]}, MANS),
    ('B02-SH01 end', look((0.872, 2.6, 2.59), (-1.5, 0.5, -6), 1000, 560), {**MAN, 'boat_B2': [-1.0, -1.5, -40]}, MANS),
    ('B02-SH02', look((-0.55, 0.95, -0.85), (0, 1.55, 0), 900, 1240), {**MAN, 'face': [0, 1.55, 0]}, {}),
    ('B02-SH03 start', sheet((-0.1, 1.5, -3), 2, 4.1, 1.85, 760, 740), MAN, MANS),
    ('B02-SH03 end (LF04)', sheet((-0.1, 1.5, -3), 6, 4.1, 1.85, 760, 740), MAN, MANS),
    ('B03-SH01 start', sheet((cable(-300)[0], cable(-300)[1], -300), 90, 1.6, cable(-300)[1] + 0.25, 1000, 745), {'cable_here': cable(-300), 'cable_-298': cable(-298), 'cable_-302': cable(-302)}, {}),
    ('B03-SH02 upper', sheet((0.18, 0.95, -0.30), 90, 0.50, 0.95, 1000, 640), {'hose_a': [0.18, 0.96, -0.40], 'hose_b': [0.18, 0.94, -0.40]}, {'hose_w': ['hose_a', 'hose_b']}),
    ('B03-SH02 lower', sheet((cable(-303)[0], cable(-303)[1], -303), 90, 0.50, cable(-303)[1], 1000, 1080), {'cab_a': [cable(-303)[0], cable(-303)[1] + 0.01, -303], 'cab_b': [cable(-303)[0], cable(-303)[1] - 0.01, -303]}, {'cable_w': ['cab_a', 'cab_b']}),
    ('B03-SH03 start', sheet((0.05, 1.30, 0), 123, 1.55, 1.45, 1000, 740), {**MAN, 'pinch': [0.05, 1.20, -0.25]}, MANS),
    ('B04-SH01', look((0.40, 1.78, 1.30), (-30, 0, -600), 1000, 600), {**MAN, 'boat_B2': [-1.0, -1.5, -40]}, {}),
    ('B04-SH02 start', sheet((cable(-420)[0], cable(-420)[1], -420), 0, 8, -34.0, 1000, 760), {'cable_-420': cable(-420), 'cable_-440': cable(-440)}, {}),
    ('B04-SH02 turn', sheet((cable(-420)[0], cable(-420)[1], -420), 0, 8, bed(-412) + 2.0, 1000, 760), {'cable_-420': cable(-420)}, {}),
    ('B04-SH02 end', sheet((0.8, -6.5, -58), 180, 9, -5, 1000, 700), {'K': K, 'cable_-60': cable(-60), 'hull_-45': [0, -1.0, -45], 'cam_floor': [0.8, bed(-67), -67]}, {}),
    ('B04-SH03 start', look((0.42, 1.78, 1.25), (1.5, 0, -60), 1000, 700), {**MAN, 'boat_B2': [-1.0, -1.5, -40]}, {}),
    ('B04-SH04 start', sheet((K[0] + 0.5, -4.9, K[2]), 160, 3.2, bed(-56.5) + 0.6, 1000, 760), {'K': K, 'anchor_in': [K[0] + 2.4, bed(K[2]) + 0.3, K[2]], 'cable_shore': cable(-48), 'hull_B2': [0, -1.0, -50]}, {}),
    ('B04-SH04 end', sheet((K[0] - 0.3, -4.9, K[2]), 168, 3.2, bed(-56.5) + 0.6, 1000, 760), {'K': K, 'K_lifted': [K[0], K[1] + 0.4, K[2]], 'hull_B2': [0, -1.0, -50]}, {}),
    ('B04-SH05 start (LF07S1)', cut_cam(0), {'top_fl': [-4.5, 0, 1.5], 'top_fr': [4.5, 0, 1.5], 'base_fl': [-4.5, -5.6, 1.5], 'base_fr': [4.5, -5.6, 1.5], 'base_br': [4.5, -5.6, -1.5], 'trawler_top': [-1.2, 1.2, -0.9], 'KD': [-2.4, -1.0, 0.9], 'deep_cable': [3.0, -5.0, 0.9]}, {}),
    ('B04-SH05 end (LF07)', cut_cam(1), {'top_fl': [-4.5, 0, 1.5], 'top_fr': [4.5, 0, 1.5], 'base_fl': [-4.5, -5.6, 1.5], 'base_fr': [4.5, -5.6, 1.5], 'base_br': [4.5, -5.6, -1.5], 'trawler_top': [-1.2, 1.2, -0.9], 'KD': [-2.4, -1.0, 0.9], 'deep_cable': [3.0, -5.0, 0.9]}, {}),
    ('B05-SH01 start', sheet((-4, 6, 0), 16, 260, 3, 1300, 900), {'bow_deck': [75, 13, 0], 'stern_wl': [-75, 0, 0], 'super_top': [-60, 22, 0], 'mid_wl': [0, 0, 0]}, {}),
    ('B05-SH01 end (LF05)', sheet((-4, 6, 0), 12, 200, 3, 1300, 900), {'bow_deck': [75, 13, 0], 'stern_wl': [-75, 0, 0], 'super_top': [-60, 22, 0], 'mid_wl': [0, 0, 0]}, {}),
    ('B05-SH02 start (LF06)', sheet((0, 0.2, 0), 25, 6, 1.4, 1000, 820), {'C1_mid': fs_pt(-2.5), 'C2_mid': fs_pt(0), 'C3_mid': fs_pt(2.5)}, {}),
    ('B05-SH02 end', sheet((0.906, 0.2, 0.423), 25, 6, 1.4, 1000, 820), {'C1_mid': fs_pt(-2.5), 'C2_mid': fs_pt(0), 'C3_mid': fs_pt(2.5)}, {}),
    ('B05-SH03 start', sheet((0, 1.45, 0), 125, 1.40, 1.30, 1000, 640), {**MAN, **PHONE}, MANS),
    ('B05-SH04 start', sheet((CHAIN_TOP[0], 41.2, CHAIN_TOP[2]), -25, 20, 40.0, 1000, 600), {'chain_top': CHAIN_TOP, 'surface_ahead': [CHAIN_TOP[0], 44.2, CHAIN_TOP[2] - 5]}, {}),
    ('B05-SH04 end', sheet(A_END, -25, 10, 1.6, 1000, 700), {'anchor': A_END, 'C1_x_furrow': fs_pt(-2.5), 'C2_x_furrow': fs_pt(0), 'C3_x_furrow': fs_pt(2.5), 'chain_top': CHAIN_TOP}, {}),
    ('B05-SH05 start', sheet((0.05, 1.25, 0), 123, 1.91, 1.42, 1000, 760), MAN, MANS),
    ('B06-SH03 start', sheet((0, 1.25, 0), 126, 2.15, 1.45, 1000, 700), {**MAN, **PHONE, **HOSE}, MANS),
    ('B06-SH04 start', sheet((-0.3, 1.1, -0.6), 3, 2.2, 1.7, 1000, 640), {**MAN, **PHONE}, MANS),
    ('B06-SH04 end', sheet((-0.4, 1.0, -1.0), -8, 4.55, 3.6, 1000, 440), {**MAN, **PHONE, 'line_entry': [-0.6, -1.5, -14], 'boat_B2': [-1.0, -1.5, -40]}, MANS),
]


def main():
    keep = sys.argv[sys.argv.index('--json') + 1] if '--json' in sys.argv else None
    for name, cam, pts, spans in SHOTS:
        js = to_tool(cam, pts, spans)
        fd, path = tempfile.mkstemp(suffix='.json')
        with os.fdopen(fd, 'w') as f:
            json.dump(js, f)
        out = json.loads(subprocess.run([sys.executable, '-I', TOOL, path, '--min-height', '480'], capture_output=True, text=True, check=True).stdout)
        if keep:
            os.makedirs(keep, exist_ok=True)
            json.dump({'in': js, 'out': out}, open(os.path.join(keep, name.split(' (')[0].replace(' ', '_') + '.json'), 'w'), indent=1)
        os.unlink(path)
        bits = []
        for k, v in out['points'].items():
            bits.append(f"{k} behind" if v.get('behind_camera') else f"{k} ({v['x']},{v['y']}){' BAND' if v.get('in_caption_band') else ''}{'' if v['in_frame'] else ' off'}")
        for k, v in out['spans'].items():
            bits.append(f"{k} {v.get('px', v.get('error'))}px")
        p = cam['pos']
        print(f"{name}: pos ({p[0]:.2f}, {p[1]:.2f}, {p[2]:.2f}) yaw {cam['yaw']:.1f} | " + '; '.join(bits))


if __name__ == '__main__':
    main()
