"""EDU-EP21-SHORT W5.2 BG2 plate measurements (Boss, 2026-11-16): projects DRIVER's lead and the sheet's zone anchors through each BG2
shot camera at its key frames with the kit math (src/painted/kit/ycam.ts, cam-moves.ts camOf: linear u = L / N), as bg1-measure.py.
Cameras are the ones typed into src/painted/edu21/shots/{B01-SH04,B02-SH05,B04-SH09,B05-SH12}.tsx (EDU-EP21-SHEETS-R1; SH04 end yaw -106 from SHEETS-R2 SD14, W5.2f FX1).
Lead: DRIVER hip (-0.15, 0.40, 0.38) -> crown (hip + 0.97 m) projected, and the VISIBLE lead = crown -> the nearest occluder over her
centre line (SH05 cluster hood top with the dashDy -0.26 cheat; SH04/SH09 her seat back's top edge; SH12 none: hip -> crown).
N4 reach (SH09): fingertip distance from the leaned left shoulder (10 deg forward, 8 deg toward -z) to the radio button vs the card arm
(2 x BONE 0.26 m + hand 0.085 m). Usage: python3 -I scripts/edu-series/ep21/short/bg2-measure.py"""
import math

D = math.pi / 180
HIP = (-0.15, 0.40, 0.38)
BUTTON, BUTTON_FALLBACK = (0.519, 0.85, 0.08), (0.519, 0.86, 0.11)


def cam(at, az, r, eye, f, hy, pitch=0.0):
    return dict(x=at[0] + r * math.sin(az * D), y=eye, z=at[2] + r * math.cos(az * D), yaw=-az * D, f=f, hy=hy, pitch=pitch * D)


def proj(c, v):
    dx, dz = v[0] - c['x'], v[2] - c['z']
    s, co = math.sin(c['yaw']), math.cos(c['yaw'])
    r, u, d = dx * co + dz * s, v[1] - c['y'], dx * s - dz * co
    if c['pitch']:
        cs, sn = math.cos(c['pitch']), math.sin(c['pitch'])
        u, d = u * cs - d * sn, d * cs + u * sn
    return (540 + c['f'] * r / d, c['hy'] - c['f'] * u / d) if d > 0.05 else None


def L(a, b, u):
    return a + (b - a) * u


SHOTS = {
    # id: (N, at, yaw0, yaw1, r0, r1, eye, f, hy, pitch, occluder or None, keys)
    'B01-SH04': (92, (0.3, 1.0, 0.3), -104, -106, 1.35, 1.42, 1.08, 760, 820, 0, (-0.511, 0.92, 0.38), [0, 30, 67, 91]),
    'B02-SH05': (93, (-0.15, 1.10, 0.38), 90, 84, 1.6, 1.45, 1.15, 1000, 620, 0, (0.50, 0.815, 0.38), [0, 15, 45, 92]),
    'B04-SH09': (57, (0.52, 0.92, 0.20), -102, -98, 1.34, 1.24, 1.28, 700, 760, -14, (-0.511, 0.92, 0.38), [0, 9, 29, 39, 56]),
    'B05-SH12': (94, (-0.15, 1.10, 0.38), 180, 175, 0.85, 0.78, 1.12, 700, 700, 0, None, [0, 47, 93]),
}


def shoulder(fwd, side):
    f, s = fwd * D, side * D
    y1, x1 = 0.4535 * math.cos(f), 0.4535 * math.sin(f)
    return (HIP[0] + x1, HIP[1] + y1 * math.cos(s) - 0.1275 * math.sin(s), HIP[2] - y1 * math.sin(s) - 0.1275 * math.cos(s))


for sid, (N, at, y0, y1, r0, r1, eye, f, hy, pitch, occ, keys) in SHOTS.items():
    for l in keys:
        u = l / N
        c = cam(at, L(y0, y1, u), L(r0, r1, u), eye, f, hy, pitch)
        h, k, fc = proj(c, HIP), proj(c, (HIP[0], HIP[1] + 0.97, HIP[2])), proj(c, (HIP[0], 1.16, HIP[2]))
        out = [f"{sid} l{l}", f"hip->crown {math.dist(h, k):.0f} px (crown {k[0]:.0f},{k[1]:.0f}; hip y {h[1]:.0f})", f"face ({fc[0]:.0f},{fc[1]:.0f})"]
        if occ:
            o = proj(c, occ)
            out.append(f"visible crown->occluder {o[1] - k[1]:.0f} px (occluder y {o[1]:.0f})")
        if sid == 'B04-SH09':
            for name, v in (('radio', (0.519, 0.88, 0.0)), ('button', BUTTON), ('cluster', (0.519, 0.97, 0.38))):
                q = proj(c, v)
                out.append(f"{name} ({q[0]:.0f},{q[1]:.0f})")
        print(' | '.join(out))

sh = shoulder(10, 8)
arm = 2 * 0.26 + 0.085
for name, b in (('button', BUTTON), ('fallback', BUTTON_FALLBACK)):
    d = math.dist(sh, b)
    w = d - 0.085
    bend = math.degrees(math.acos(max(-1, min(1, (w * w - 2 * 0.26 ** 2) / (2 * 0.26 ** 2))))) if w < 0.52 else 0
    print(f"N4 reach to {name} {b}: leaned shoulder ({sh[0]:.3f},{sh[1]:.3f},{sh[2]:.3f}) -> fingertip {d:.3f} m vs arm {arm:.3f} m; "
          f"{'reaches' if d <= arm else 'SHORT'}, elbow bent {bend:.0f} deg off straight")
d0 = math.dist(shoulder(0, 0), BUTTON)
print(f"N4 without lean: {d0:.3f} m vs {arm:.3f} m ({'reaches' if d0 <= arm else 'SHORT'})")
