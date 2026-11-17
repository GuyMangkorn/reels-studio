"""EDU-EP21-SHORT W5.2 BG1 plate measurements (Boss): projects the lead and zone anchors through each BG1 shot camera at its key frames
with the kit math (src/painted/kit/ycam.ts camSpace/camToPicture, cam-moves.ts camOf: linear u = L / N). Camera lines are the ones typed
into src/painted/edu21/shots/B01-SH0{1,2,3}.tsx (EDU-EP21-SHEETS-R1). Usage: python3 -I scripts/edu-series/ep21/short/bg1-measure.py
Lead: car = near roof front (0.40, 1.49, 0.64) -> FR contact (1.30, 0, 0.85); DRIVER = hip (-0.15, 0.40, 0.38) -> crown (hip + 0.97 m),
with the B01 track's jolt offsets (driver.ts B01_DRIVER). Car x extent = min/max picture x of the body corners and greenhouse corners."""
import math

D = math.pi / 180


def cam(at, az, r, eye, f, hy, pitch=0.0):
    return dict(x=at[0] + r * math.sin(az * D), y=eye, z=at[2] + r * math.cos(az * D), yaw=-az * D, f=f, hy=hy, pitch=pitch * D)


def lerp(a, b, u):
    return a + (b - a) * u


def proj(c, v):
    dx, dz = v[0] - c['x'], v[2] - c['z']
    s, co = math.sin(c['yaw']), math.cos(c['yaw'])
    r, u, d = dx * co + dz * s, v[1] - c['y'], dx * s - dz * co
    if c['pitch']:
        cs, sn = math.cos(c['pitch']), math.sin(c['pitch'])
        u, d = u * cs - d * sn, d * cs + u * sn
    return (540 + c['f'] * r / d, c['hy'] - c['f'] * u / d) if d > 0.05 else None


PROF = [(-2.12, 0.28), (2.1, 0.28), (2.22, 0.36), (2.27, 0.5), (2.26, 0.64), (2.18, 0.76), (1.98, 0.84), (1.05, 0.92), (-1.55, 0.96), (-2.08, 0.94), (-2.2, 0.86), (-2.25, 0.7), (-2.24, 0.42)]
GH = [(1.05, 0.92, 0.8), (-1.55, 0.96, 0.8), (0.4, 1.49, 0.64), (-0.98, 1.49, 0.64)]
CORNERS = [(x, y, s * 0.85) for x, y in PROF for s in (1, -1)] + [(x, y, s * z) for x, y, z in GH for s in (1, -1)] + [(1.3, 0, 0.85), (-1.3, 0, 0.85), (1.3, 0, -0.85), (-1.3, 0, -0.85)]
HIP = (-0.15, 0.40, 0.38)


def ease(x):
    k = min(1, max(0, x))
    return k * k * (3 - 2 * k)


def jolt(G):
    j = 0 if G < 14 else ease((G - 14) / 3) if G < 20 else 1 - ease((G - 20) / 14)
    br = math.sin(math.pi * (G - 77) / 12) if 77 <= G <= 89 else 0
    return 0.03 * j - 0.02 * br, 0.02 * j


def row(name, c, G, car=True):
    out = [name]
    lift, back = jolt(G)
    hip = (HIP[0] - back, HIP[1] + lift, HIP[2])
    h, k = proj(c, hip), proj(c, (hip[0], hip[1] + 0.97, hip[2]))
    out.append(f"driver hip->crown {math.dist(h, k):.0f} px (crown {k[0]:.0f},{k[1]:.0f}; hip y {h[1]:.0f}); face y {proj(c, (hip[0], 1.16 + lift, hip[2]))[1]:.0f}")
    if car:
        roof, fr = proj(c, (0.40, 1.49, 0.64)), proj(c, (1.30, 0, 0.85))
        xs = [p[0] for p in (proj(c, v) for v in CORNERS) if p]
        top = min(p[1] for p in (proj(c, v) for v in CORNERS) if p)
        out.append(f"car roof y {roof[1]:.0f} -> FR contact y {fr[1]:.0f} = {fr[1] - roof[1]:.0f} px; car top y {top:.0f}; x {min(xs):.0f}..{max(xs):.0f}")
        p1 = proj(c, (-60, 15, -200)); out.append(f"P1 top ({p1[0]:.0f},{p1[1]:.0f})" if p1 else "P1 off")
    return ' | '.join(out)


def sh01(L):
    u = L / 29
    return cam((0.6, 0.55, 0.4), lerp(40, 38, u), lerp(3.8, 3.75, u), 0.45, 1150, 1000)


def sh02(L):
    u = L / 71
    return cam((-0.10, 1.05, 0.38), lerp(25, 18, u), lerp(1.35, 1.25, u), 1.12, 1100, 640)


def sh03(L):
    u = L / 123
    return cam((0.3, 0.75, 0.0), lerp(34, 40, u), lerp(4.4, 4.6, u), lerp(0.9, 2.3, u), 880, 900, lerp(0, -20, u))


for L in (0, 12, 14, 20, 28):
    print(row(f"B01-SH01 l{L} G{L}", sh01(L), L))
    b = proj(sh01(L), (-0.2, 3.8, 0)); print(f"  bolt tip (3.8 m) ({b[0]:.0f},{b[1]:.0f})")
for L in (0, 8, 40, 54, 70):
    c = sh02(L)
    print(row(f"B01-SH02 l{L} G{29 + L}", c, 29 + L, car=False), '| beltline y', f"{proj(c, (-0.15, 0.92, 0.85))[1]:.0f}")
for L in (0, 56, 60, 95, 122):
    print(row(f"B01-SH03 l{L} G{100 + L}", sh03(L), 100 + L))
