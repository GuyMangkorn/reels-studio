"""EDU-EP21-SHORT W5.1 projection run (Film): each world-space shot's start/end camera from scene-sheets.md, converted to the
scripts/shot-projection.py input (y-up, lens = f px over a 1920 sensor, vertical shift = (hy - 960) / 1920) and run through it.
Usage: python3 -I scripts/edu-series/ep21/short/projection-run.py [--json DIR]   (one summary line per shot state)

Camera convention = kit `camMove(at, yaw, r, eye, {f, hy, pitch})` / `camOf` (src/painted/kit/cam-moves.ts): orbitYCam, the camera
stands at at + r*(sin az, 0, cos az) at absolute height eye, kit yaw = -az, level, then tilted by pitch (deg, + looks up).
Picture x = 540 + f*right/depth, y = hy - f*up/depth (kit ycam.ts camSpace/camToPicture). Space R, metres (brief set plan, as built
in src/painted/edu21 at the W3 look frames: CAR roof y 1.49, greenhouse TF (0.40, 1.49, +-0.64), wheels (+-1.30, 0.31, +-0.75)).
DRIVER anchors (cast.ts DRIVER_HIP, four-head card): hip (-0.15, 0.40, 0.38), crown hip + 0.97, chin crown - 0.415, face centre 1.16.
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


H = (-0.15, 0.40, 0.38)
DRIVER = ({'crown': [H[0], H[1] + 0.97, H[2]], 'face': [H[0], 1.16, H[2]], 'chin': [H[0], H[1] + 0.555, H[2]], 'hip': list(H)},
          {'driver_lead': ['crown', 'hip']})
CAR = ({'roof_near_front': [0.40, 1.49, 0.64], 'roof_near_rear': [-0.98, 1.49, 0.64], 'roof_far_front': [0.40, 1.49, -0.64],
        'nose_near': [2.27, 0.50, 0.85], 'tail_near': [-2.25, 0.70, 0.85], 'nose_far': [2.27, 0.50, -0.85], 'tail_far': [-2.25, 0.70, -0.85],
        'FR_centre': [1.30, 0.31, 0.75], 'FR_contact': [1.30, 0.0, 0.85], 'RR_contact': [-1.30, 0.0, 0.85], 'FL_contact': [1.30, 0.0, -0.85]},
       {'car_h': ['roof_near_front', 'FR_contact']})
DASH = ({'cluster': [0.519, 0.97, 0.38], 'cluster_R': [0.519, 0.97, 0.52], 'radio': [0.519, 0.88, 0.0], 'button': [0.519, 0.85, 0.08],
         'wheel_c': [0.30, 0.95, 0.38]}, {})
TYRE = ({'door_belt_H': [-0.15, 0.92, 0.85], 'FR_top': [1.30, 0.62, 0.85], 'FR_bottom': [1.30, 0.0, 0.85], 'FR_front': [1.61, 0.31, 0.85], 'FR_rear': [0.99, 0.31, 0.85],
         'arch_top': [1.30, 0.72, 0.85]}, {'tyre_d': ['FR_top', 'FR_bottom']})
PALM = ({'palm_top': [-40, 15, -60], 'palmB_top': [-60, 15, -200], 'palm2_top': [25, 16, -90]}, {})
GLASS = ({'beltline_front': [0.80, 0.92, 0.80], 'pillarA_top': [0.40, 1.49, 0.64], 'pillarA_base': [1.05, 0.92, 0.80]}, {})


def merge(*ps):
    pts, sp = {}, {}
    for p, s in ps:
        pts.update(p); sp.update(s)
    return pts, sp


EXT = merge(CAR, DRIVER, PALM)
# --- shot states (scene-sheets.md shot blocks own these numbers) ---
SHOTS = [
    ('B01-SH01 start (LF01)', cam([0.6, 0.55, 0.4], 40, 3.8, 0.45, 1150, 1000), EXT),
    ('B01-SH01 end', cam([0.6, 0.55, 0.4], 38, 3.75, 0.45, 1150, 1000), EXT),
    ('B01-SH02 start', cam([-0.10, 1.05, 0.38], 25, 1.35, 1.12, 1100, 640), merge(DRIVER, GLASS)),
    ('B01-SH02 end', cam([-0.10, 1.05, 0.38], 18, 1.25, 1.12, 1100, 640), merge(DRIVER, GLASS)),
    ('B01-SH03 start', cam([0.3, 0.75, 0.0], 34, 4.4, 0.9, 880, 900), EXT),
    ('B01-SH03 end', cam([0.3, 0.75, 0.0], 40, 4.6, 2.3, 880, 900, -20), EXT),
    ('B01-SH04 start (LF02)', cam([0.3, 1.0, 0.3], -104, 1.35, 1.08, 760, 820), merge(DRIVER, DASH)),
    ('B01-SH04 end', cam([0.3, 1.0, 0.3], -100, 1.42, 1.08, 760, 820), merge(DRIVER, DASH)),
    ('B02-SH05 start', cam([-0.15, 1.10, 0.38], 90, 1.6, 1.15, 1000, 620), merge(DRIVER, DASH)),
    ('B02-SH05 end', cam([-0.15, 1.10, 0.38], 84, 1.45, 1.15, 1000, 620), merge(DRIVER, DASH)),
    ('B02-SH06 start', cam([0.4, 0.7, 0.0], 38, 4.3, 0.65, 880, 940), EXT),
    ('B02-SH06 end (LF03 u.85 ~)', cam([0.4, 0.7, 0.0], 36, 4.1, 0.65, 880, 940), EXT),
    ('B03-SH07 start', cam([-0.15, 1.0, 0.38], 6, 1.9, 1.15, 1100, 620), merge(DRIVER, TYRE)),
    ('B03-SH07 end', cam([1.30, 0.40, 0.75], 18, 2.0, 0.60, 1100, 620), merge(DRIVER, TYRE, CAR)),
    ('B03-SH08 start', cam([1.30, 0.31, 0.85], 30, 1.2, 0.45, 1100, 700), TYRE),
    ('B03-SH08 end', cam([1.30, 0.31, 0.85], 22, 1.05, 0.45, 1100, 700), TYRE),
    ('B04-SH09 start', cam([0.52, 0.92, 0.20], -102, 1.34, 1.28, 700, 760, -14), merge(DRIVER, DASH)),
    ('B04-SH09 end', cam([0.52, 0.92, 0.20], -98, 1.24, 1.28, 700, 760, -14), merge(DRIVER, DASH)),
    ('B04-SH10 start', cam([0.4, 0.7, 0.0], 36, 4.1, 0.65, 880, 940), merge(EXT, DASH)),
    ('B04-SH10 end', cam([0.45, 0.95, 0.30], 34, 2.3, 1.25, 880, 940), merge(EXT, DASH, GLASS)),
    ('B05-SH11 start', cam([0.2, 0.7, 0.2], 48, 4.6, 2.4, 1200, 720, -16), EXT),
    ('B05-SH11 end', cam([0.2, 0.7, 0.2], 54, 4.5, 2.4, 1200, 720, -18), EXT),
    ('B05-SH12 start', cam([-0.15, 1.10, 0.38], 180, 0.85, 1.12, 700, 700), DRIVER),
    ('B05-SH12 end', cam([-0.15, 1.10, 0.38], 175, 0.78, 1.12, 700, 700), DRIVER),
    ('B05-SH13 start', cam([0.42, 1.40, 0.70], 30, 0.9, 1.5, 1000, 800, -8), merge(EXT, GLASS)),
    ('B05-SH13 end', cam([0.2, 0.7, 0.2], 42, 4.0, 0.9, 1000, 800, -2), EXT),
]


def main():
    jdir = sys.argv[sys.argv.index('--json') + 1] if '--json' in sys.argv else None
    if jdir: os.makedirs(jdir, exist_ok=True)
    for name, c, (pts, sp) in SHOTS:
        with tempfile.NamedTemporaryFile('w', suffix='.json', delete=False) as fh:
            json.dump(to_tool(c, pts, sp), fh)
        res = json.loads(subprocess.run([sys.executable, '-I', TOOL, fh.name, '--min-height', '480'], capture_output=True, text=True, check=True).stdout)
        os.unlink(fh.name)
        if jdir:
            json.dump(res, open(os.path.join(jdir, name.split(' (')[0].replace(' ', '_') + '.json'), 'w'), indent=1)
        P = res['points']
        def pt(k):
            q = P.get(k)
            if not q: return None
            return 'behind' if q.get('behind_camera') else f"({q['x']},{q['y']}){'*' if q.get('in_caption_band') else ''}{'' if q['in_frame'] else '!'}"
        spans = ' '.join(f"{k}={v.get('height_px', v)}" for k, v in res['spans'].items())
        keys = [k for k in pts if k in ('crown', 'face', 'chin', 'hip', 'roof_near_front', 'FR_contact', 'nose_near', 'tail_near', 'nose_far', 'tail_far', 'cluster', 'cluster_R', 'radio', 'button', 'FR_centre', 'FR_bottom', 'FR_top', 'palm_top', 'palmB_top', 'palm2_top', 'beltline_front')]
        print(f"{name}: pos=({c['pos'][0]:.2f},{c['pos'][1]:.2f},{c['pos'][2]:.2f}) {spans} | " + ' '.join(f'{k}{pt(k)}' for k in keys))


if __name__ == '__main__':
    main()
