"""zc-you shot tracks for the SS-R2.4 sheets. Each `track_<SHOT>(A, ...)` keys the Actor over the plate clip range
(Blender frame = clip frame + 1) and returns a dict of named contact targets the checker measures (world metres).

Numbers come from the sheets (staging tables); everything not in a sheet is marked ASSUMPTION in the docstring and in
scripts/zombie-condo/build-notes.md. Tracks do not move props (props are `zc-bag`, `zc-cabinet`, ... owned by the set).
"""
import math
from mathutils import Vector
from poses import Actor, yaw_for, ANKLE_Z

F = lambda c: int(c) + 1          # clip frame -> Blender frame
V = Vector


def ease(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def lerp(a, b, t):
    return a + (b - a) * t


def lerp3(a, b, t):
    return tuple(lerp(x, y, t) for x, y in zip(a, b))


def rot_z(v, deg):
    c, s = math.cos(math.radians(deg)), math.sin(math.radians(deg))
    return V((v.x * c - v.y * s, v.x * s + v.y * c, v.z))


def body_to_world(root_xy, yaw, local):
    """local (x lateral +left, y forward is -Y at yaw 0, z up) -> world."""
    p = rot_z(V(local), yaw)
    return V((root_xy[0] + p.x, root_xy[1] + p.y, local[2]))


class Path:
    """Polyline in the floor plane with arc-length position/heading."""
    def __init__(self, pts):
        self.pts = [V((p[0], p[1], 0)) for p in pts]
        self.cum = [0.0]
        for a, b in zip(self.pts, self.pts[1:]):
            self.cum.append(self.cum[-1] + (b - a).length)
        self.length = self.cum[-1]

    def at(self, d):
        d = max(0.0, min(self.length, d))
        for i in range(len(self.pts) - 1):
            if d <= self.cum[i + 1] + 1e-9:
                t = (d - self.cum[i]) / max(self.cum[i + 1] - self.cum[i], 1e-9)
                p = self.pts[i].lerp(self.pts[i + 1], t)
                return p, (self.pts[i + 1] - self.pts[i]).normalized()
        return self.pts[-1], (self.pts[-1] - self.pts[-2]).normalized()


def walk(A, c0, c1, path, yaw_fn, Dfn=None, stride=0.34, step=3, hands=None, face='neutral', head_fn=None, look_fn=None,
         arm_swing=0.11, **kw):
    """Key a gait along `path` over clip frames c0..c1 (every `step` frames, linear). stride = half-cycle length (one footfall to the next).
    Feet are world-planted during stance (formula: foot world x = plant point, stance length `stride`). Starts in the heel-strike pose
    (left foot ahead). yaw_fn(t01) -> root yaw deg. hands: callable(pos, yaw, side) -> hand spec or None (relaxed with swing)."""
    s = stride
    n = max(1, int(round((c1 - c0) / step)))
    for k in range(n + 1):
        c = c0 + (c1 - c0) * k / n
        t = k / n
        D = (Dfn(t) if Dfn else t) * path.length
        p, hd = path.at(D)
        yaw = yaw_fn(t)
        lat_w = rot_z(V((1, 0, 0)), yaw)          # body-left in world
        fw = rot_z(V((0, -1, 0)), yaw)            # facing
        feet = {}
        for sname, o in (('L', 0), ('R', 1)):
            sg = 1 if sname == 'L' else -1
            u = D / s + o
            cyc = math.floor(u / 2)
            um = u - 2 * cyc
            xp = (2 * cyc + 0.5 - o) * s
            if um < 1:
                x, lift = xp, 0.0
            else:
                fr = um - 1
                x, lift = xp + 2 * s * ease(fr), 0.09 * math.sin(math.pi * fr)
            q, _ = path.at(max(0.0, x))
            if x < 0:
                q = path.pts[0] + hd * x
            fp = V((q.x, q.y, 0)) + lat_w * (0.085 * sg)
            feet[sname] = dict(ankle=(fp.x, fp.y, ANKLE_Z + lift), yaw=yaw, pitch=(-14 * math.sin(math.pi * (um - 1)) if um >= 1 else 0.0))
        uL = D / s
        bob = 0.012 * math.sin(math.pi * (uL % 1.0)) - 0.008
        sw = math.cos(math.pi * uL)                # +1 left foot ahead
        hl = hr = None
        if hands:
            hl, hr = hands(p, yaw, 'L'), hands(p, yaw, 'R')
        if hl is None:
            hl = dict(palm=body_to_world(p, yaw, (0.245, -0.03 - arm_swing * sw, 0.80)) , dir=rot_z(V((0.10, -0.2 - 0.5 * sw, -1.0)), yaw), normal=rot_z(V((-1, 0, 0)), yaw))
        if hr is None:
            hr = dict(palm=body_to_world(p, yaw, (-0.245, -0.03 + arm_swing * sw, 0.80)), dir=rot_z(V((-0.10, -0.2 + 0.5 * sw, -1.0)), yaw), normal=rot_z(V((1, 0, 0)), yaw))
        pel = (0.0, -4.0 * sw, 0.0)
        look = look_fn(t) if look_fn else None
        hd_rot = head_fn(t) if head_fn else (0, 0, 0)
        A.pose(F(c), root=(p.x, p.y, yaw), bob=bob, pelvis=pel, chest=(0.0, 3.0 * sw, 0.0), head=hd_rot, hand_l=hl, hand_r=hr,
               foot_l=feet['L'], foot_r=feet['R'], look=look, face=face, interp='LINEAR', **kw)


def stand(A, c, xy, yaw, interp='BEZIER', **kw):
    """Standing, feet together under the hips, at root xy facing yaw."""
    A.pose(F(c), root=(xy[0], xy[1], yaw), interp=interp, **kw)


# ============================================================================ helpers for authored poses
def face_yaw(vec):
    return yaw_for(vec)


def hand_on(palm, normal, direction=(0, 0, -1), curl=0.2, thumb=0.2):
    return dict(palm=palm, normal=normal, dir=direction, curl=curl, thumb=thumb)


def breathing(A, c0, c1, period, fn):
    """Key fn(phase 0..1 inhale amount) at quarter periods over c0..c1 (fn(c, k) calls A.pose)."""
    c = c0
    k = 0
    while c <= c1:
        fn(c, 0.5 - 0.5 * math.cos(2 * math.pi * (c - c0) / period))
        c += period / 4


# ============================================================================ B01-SH01 (clip 0..149)
def track_B01_SH01(A):
    """Threshold (0.0, 0.15) -> (0.25, -0.35) by c44, faces +X from c30, head toward her, bag in the right hand.
    ASSUMPTION: he starts facing -Y (out of the door) and turns to +X; two half-steps, then settle; bag hand hangs (z ~0.45 bag bottom)."""
    path = Path([(0.0, 0.15), (0.0, -0.10), (0.25, -0.35)])
    A.pose(F(0), root=(0.0, 0.15, 0.0), face='neutral')
    walk(A, 3, 40, path, lambda t: 90.0 * ease((t - 0.35) / 0.65), Dfn=lambda t: ease(t), stride=0.30, step=3, face='focused')
    xy = (0.25, -0.35)
    for c, ph in ((46, 0.0), (70, 1.0), (100, 0.0), (125, 1.0), (149, 0.0)):
        stand(A, c, xy, 90, chest=(0.8 * ph, 0, 0), head=(2 * ph, 0, 0), face='focused')
    return {}


# ============================================================================ B02-SH01 (clip 0..89)
DOOR_FACE_Y = 0.18


def track_B02_SH01(A):
    """Stand (0.10, 0.45) facing -Y; right palm on the leaf z 1.40 (slam contact c15); thumb-turn on the latch side c17-27
    (ASSUMPTION: deadbolt at x +0.32, z 1.05 on the +X latch jamb side: the sheet gives no coordinates); flinch c54."""
    nrm = V((0, -1, 0))
    pal = V((-0.06, DOOR_FACE_Y + 0.012, 1.40))
    bolt = V((0.32, DOOR_FACE_Y + 0.012, 1.05))
    hr0 = dict(palm=(-0.10, 0.30, 1.30), dir=V((0, -0.2, 1.0)), normal=nrm, curl=0.15)
    hr = dict(palm=pal, dir=V((0, -0.25, 1.0)), normal=nrm, curl=0.12)
    hb = dict(palm=bolt, dir=V((0, -0.3, 1.0)), normal=nrm, curl=0.55, thumb=0.8)
    ha = dict(palm=bolt + V((0.05, 0.12, -0.08)), dir=V((0, -0.3, 1.0)), normal=nrm, curl=0.3, thumb=0.3)
    base = dict(root=(0.10, 0.45, 0.0))
    A.pose(F(0), face='tired', hand_r=hr0, spine=(6, 0, 0), **base)
    A.pose(F(15), face='startle', hand_r=hr, spine=(8, 0, 0), head=(-4, 0, 0), **base)
    A.pose(F(17), face='startle', hand_r=hr, hand_l=ha, spine=(8, 0, 0), **base)
    A.pose(F(21), face='fear', hand_r=hr, hand_l=hb, spine=(8, 0, 0), **base)
    A.pose(F(27), face='fear', hand_r=hr, hand_l=hb, spine=(8, 0, 0), **base)
    A.pose(F(34), face='fear', hand_r=hr, spine=(7, 0, 0), **base)
    A.pose(F(52), face='startle', hand_r=hr, spine=(7, 0, 0), **base)
    A.pose(F(54), face='startle', hand_r=hr, spine=(2, 0, 0), head=(-6, 0, 0), chest=(-3, 0, 0), blink=0.4, **base)
    A.pose(F(60), face='fear', hand_r=hr, spine=(6, 0, 0), **base)
    A.pose(F(89), face='fear', hand_r=hr, spine=(6, 0, 0), **base)
    return {'palm_R': tuple(pal), 'bolt_palm_L': tuple(bolt)}


# ============================================================================ B02-SH02 (clip 0..176)
def cab_y(c):
    """Cabinet centre y: parked 1.25 -> flush 0.38 over c39..84 (10-frame eases) per the sheet."""
    t = (c - 39) / 45.0
    if t <= 0:
        return 1.25
    if t >= 1:
        return 0.38
    a = 10 / 45.0
    v = 1.0 / (1 - a)
    d = v * t * t / (2 * a) if t < a else (v * (a / 2 + (t - a)) if t < 1 - a else 1 - v * (1 - t) ** 2 / (2 * a))
    return 1.25 - 0.87 * d


def track_B02_SH02(A):
    """c0-15 at the door; walk to (0.65, 1.25) c15-39; drag c39-84 walking toward -Y with a hand on the cabinet's +X face (z 0.95);
    c100-125 step round to (0.0, 0.80) facing +Y, back to the cabinet.
    SHEET DISCREPANCY (report to Mark): the sheet says his LEFT hand is on the cabinet; walking toward -Y on the cabinet's +X side the
    cabinet is on his RIGHT, so the right hand is used (left would cross the body)."""
    hr = dict(palm=(-0.06, DOOR_FACE_Y + 0.012, 1.40), dir=V((0, -0.25, 1.0)), normal=V((0, -1, 0)), curl=0.12)
    A.pose(F(0), root=(0.10, 0.45, 0.0), face='fear', hand_r=hr, spine=(6, 0, 0))
    A.pose(F(14), root=(0.10, 0.45, 0.0), face='fear', hand_r=hr, spine=(6, 0, 0))
    yaw_a = yaw_for((0.55, 0.80))
    walk(A, 17, 38, Path([(0.10, 0.45), (0.65, 1.25)]), lambda t: _ang(0.0, yaw_a, ease(t * 2)) if t < 0.5 else _ang(yaw_a, 0.0 if False else 0.0, ease((t - 0.5) * 2)),
         Dfn=lambda t: ease(t), stride=0.36, step=3, face='fear')
    # drag: root follows the cabinet centre; hand on the cabinet's +X face
    cs = list(range(39, 85, 3)) + [84]
    path = Path([(0.65, 1.25), (0.65, 0.38)])
    D = lambda c: (1.25 - cab_y(c)) / 0.87
    n = len(cs)
    for c in cs:
        y = cab_y(c)
        t = (c - 39) / 45.0
        d = D(c) * path.length
        p, hd = path.at(d)
        hand = dict(palm=(0.41, y + 0.02, 0.95), normal=V((-1, 0, 0)), dir=V((0, -0.5, -0.8)), curl=0.25, thumb=0.2)
        walk_feet = _gait_feet(path, d, 0.0, 0.34, hd)
        A.pose(F(c), root=(p.x, p.y, 0.0), bob=0.0, hand_r=hand, foot_l=walk_feet['L'], foot_r=walk_feet['R'], face='fear',
               spine=(8, 0, 0), interp='LINEAR')
    for c in (96, 100):
        A.pose(F(c), root=(0.65, 0.38, 0.0), hand_r=dict(palm=(0.41, 0.40, 0.95), normal=V((-1, 0, 0)), dir=V((0, -0.5, -0.8)), curl=0.25), face='fear', spine=(8, 0, 0))
    # turn and step round the +Y side of the cabinet corner to the back-to-cabinet stand
    path2 = Path([(0.65, 0.38), (0.65, 0.92), (0.0, 0.92), (0.0, 0.80)])
    walk(A, 103, 124, path2, lambda t: _ang(0.0, 180.0, ease(t * 1.2)), Dfn=lambda t: ease(t), stride=0.34, step=3, face='frozen')
    stand_back_cabinet(A, 128, face='frozen')
    stand_back_cabinet(A, 176, face='frozen')
    return {}


def _gait_feet(path, d, o0, s, hd):
    """Feet of a walker at arclength d (same formula as walk())."""
    out = {}
    yaw = yaw_for((hd.x, hd.y))
    for sname, o in (('L', 0), ('R', 1)):
        sg = 1 if sname == 'L' else -1
        u = d / s + o
        cyc = math.floor(u / 2)
        um = u - 2 * cyc
        xp = (2 * cyc + 0.5 - o) * s
        if um < 1:
            x, lift = xp, 0.0
        else:
            fr = um - 1
            x, lift = xp + 2 * s * ease(fr), 0.09 * math.sin(math.pi * fr)
        q, _ = path.at(max(0.0, x))
        lat = rot_z(V((1, 0, 0)), 0.0)
        out[sname] = dict(ankle=(q.x + 0.085 * sg * 1.0, q.y, ANKLE_Z + lift), yaw=0.0)
    return out


def stand_back_cabinet(A, c, face='frozen', chin_up=10.0):
    """B02-SH03 / B03: root (0.0, 0.80) facing +Y, shoulder blades/lower back on the cabinet front (y 0.58, top z 1.20), chin up 10 deg.
    Hips shifted -Y and the spine leaned back so the back surface just touches the cabinet (solved numerically by check.py)."""
    A.pose(F(c), root=(0.0, 0.80, 180.0), hips=(0.0, 0.80 - LEAN_HIP, 0.918), spine=(-LEAN_SPINE, 0, 0), chest=(-LEAN_CHEST, 0, 0),
           neck=(-chin_up * 0.4, 0, 0), head=(-chin_up * 0.6, 0, 0), look=(0.9, 0.2, 1.9), face=face,
           foot_l=dict(ankle=(-0.085, 0.80, ANKLE_Z), yaw=180.0), foot_r=dict(ankle=(0.085, 0.80, ANKLE_Z), yaw=180.0))


LEAN_HIP, LEAN_SPINE, LEAN_CHEST = 0.115, 6.0, 8.0


def track_B02_SH03(A):
    stand_back_cabinet(A, 0)
    return {}


def track_B03_SH01(A):
    stand_back_cabinet(A, 0, face='fear', chin_up=0.0)
    return {}


# ============================================================================ B04 / B05
def track_B04_SH01(A):
    """Walk from (0.40, 0.70) along x 0.40 to (0.40, 2.60) by c75 (facing +Y), stop, turn to face -X (the tap) c75-85."""
    path = Path([(0.40, 0.70), (0.40, 2.60)])
    walk(A, 0, 75, path, lambda t: 180.0, Dfn=lambda t: t, stride=0.36, step=3, face='neutral')
    for c, yaw in ((78, 180.0), (82, 235.0), (86, 270.0 - 360.0 + 360.0), (101, 270.0)):
        stand(A, c, (0.40, 2.60), yaw, face='neutral', head=(0, 0, 0))
    return {}


def track_B05_SH01(A):
    """Standing beside the toilet at (-0.25, 2.75), facing +X rotated 30 deg toward -Y, drinking/handling: static."""
    yaw = yaw_for((math.cos(math.radians(-30)), math.sin(math.radians(-30))))
    stand(A, 0, (-0.25, 2.75), yaw, face='tired')
    stand(A, 60, (-0.25, 2.75), yaw, face='tired', chest=(1.0, 0, 0))
    return {}


BUCKET_C = V((-0.80, 2.76, 0.88))      # ASSUMPTION (bucket prop and tilt belong to S-05): lip at (-0.95, 2.62, 0.80)


def track_B05_SH02(A):
    """He at (-0.60, 2.95) facing -Y, bucket held two-handed (palms either side of BUCKET_C), lip over the cistern. Pose only."""
    yaw = 0.0
    hl = dict(palm=BUCKET_C + V((0.15, 0.0, 0.0)), normal=V((-1, 0, 0)), dir=V((0, -0.2, -1.0)), curl=0.7, thumb=0.5)
    hr = dict(palm=BUCKET_C + V((-0.15, 0.0, 0.0)), normal=V((1, 0, 0)), dir=V((0, -0.2, -1.0)), curl=0.7, thumb=0.5)
    A.pose(F(0), root=(-0.60, 2.95, yaw), hand_l=hl, hand_r=hr, spine=(6, 0, 0), head=(8, 0, 0), face='focused')
    A.pose(F(60), root=(-0.60, 2.95, yaw), hand_l=hl, hand_r=hr, spine=(8, 0, 0), head=(10, 0, 0), face='focused')
    return {'bucket_c': tuple(BUCKET_C)}


LID_GRIP = V((-1.20, 2.55, 0.78))      # ASSUMPTION: cistern lid near edge


def track_B05_SH03(A):
    """Right hand grips the lid (c15), lifts (c21), reveal (c33), sets it aside (c33-60). Root (-0.65, 2.95) facing the cistern.
    ASSUMPTION: cistern (-1.45, 2.40); lid grip at LID_GRIP."""
    yaw = yaw_for((-1.45 + 0.92, 2.40 - 2.80))
    base = dict(root=(-0.92, 2.80, yaw), spine=(22, 0, 0), chest=(14, 0, 0), bob=-0.14, face='focused')
    nrm = V((0, 0, -1))
    mk = lambda p, cu: dict(palm=p, normal=nrm, dir=V((-0.7, -0.5, 0.0)), curl=cu)
    A.pose(F(0), hand_r=None, **base)
    A.pose(F(15), hand_r=mk(LID_GRIP, 0.3), **base)
    A.pose(F(21), hand_r=mk(LID_GRIP + V((0, 0, 0.02)), 0.5), **base)
    A.pose(F(33), hand_r=mk(LID_GRIP + V((0.12, 0.10, 0.22)), 0.5), **base)
    A.pose(F(60), hand_r=mk(LID_GRIP + V((0.30, 0.0, 0.05)), 0.4), **base)
    return {'lid_grip': tuple(LID_GRIP)}


# ============================================================================ B06 / B07 / B08
FRIDGE_HANDLE = V((-1.05, 4.08, 1.00))


def track_B06_SH01(A):
    """Walk (0.40, 2.70) -> (-0.75, 4.45) by c75 (facing +Y, then -Y at the fridge from c75); right hand hovers 5 cm from the handle
    c100-110, hold, withdraw c177-190 (never touches)."""
    path = Path([(0.40, 2.70), (0.40, 3.60), (-0.75, 4.45)])
    walk(A, 0, 70, path, lambda t: _ang(180.0, 150.0, t), Dfn=lambda t: t, stride=0.40, step=3, face='neutral')
    hov = FRIDGE_HANDLE + V((0.0, 0.05, 0.0))
    spec = dict(palm=hov, normal=V((0, -1, 0)), dir=V((0, -0.4, -0.9)), curl=0.35)
    root = (-0.75, 4.45, 0.0)
    for c in (75, 90, 100):
        A.pose(F(c), root=root, hand_r=None if c < 100 else spec, face='focused')
    for c in (110, 177):
        A.pose(F(c), root=root, hand_r=spec, face='focused')
    A.pose(F(190), root=root, hand_r=None, face='focused')
    A.pose(F(215), root=root, hand_r=None, face='focused')
    return {'hover_palm_R': tuple(hov)}


CASE = V((-1.35, 4.85, 1.51))


def track_B07_SH01(A, root_x=-0.60):
    """Reach from his side to the stove case (-1.35, 4.85, 1.51) c15-45 (c40 fingers on the clasp), slide back flush and withdraw c57-75.
    Root (-0.60, 4.90) facing -X. The case is 0.75 m away at shoulder+ height: needs a deep lean."""
    yaw = -90.0
    root = (root_x, 4.90, yaw)
    nrm = V((0, 1, 0))
    reach = dict(palm=CASE + V(0.05, 0.0, 0.0) if False else CASE + V((0.0, 0.0, -0.02)), normal=V((0, 1, 0)), dir=V((-1, 0, 0.1)), curl=0.3)
    A.pose(F(0), root=root, face='focused', head=(6, 0, 0))
    A.pose(F(15), root=root, face='focused', head=(6, 0, 0))
    A.pose(F(40), root=root, hand_r=reach, spine=(22, 0, 0), chest=(22, 0, 0), pelvis=(10, 0, 0), clav_r=(0, -30, 0), face='focused', head=(4, 0, 0))
    A.pose(F(46), root=root, hand_r=reach, spine=(22, 0, 0), chest=(22, 0, 0), pelvis=(10, 0, 0), clav_r=(0, -30, 0), face='focused', head=(4, 0, 0))
    A.pose(F(57), root=root, hand_r=reach, spine=(22, 0, 0), chest=(22, 0, 0), pelvis=(10, 0, 0), clav_r=(0, -30, 0), face='tired', head=(4, 0, 0))
    A.pose(F(75), root=root, face='tired', head=(6, 0, 0))
    A.pose(F(89), root=root, face='tired', head=(6, 0, 0))
    return {'case_palm_R': tuple(CASE)}


SEAT_Z = 0.45


def seated_sofa(A, c, bite=0.0, face='tired', interp='BEZIER'):
    """B07-SH02: sofa seat z 0.45 (x[-1.60,-0.85], y[6.80,7.80]); hips (-1.10, 7.30); faces +X rotated 40 deg toward -Y; feet on the floor
    at x ~ -0.55; bread in both hands at the chest (bite=1: bread at the mouth)."""
    fv = V((math.cos(math.radians(40)), -math.sin(math.radians(40)), 0))
    yaw = yaw_for(fv)
    lat = V((-fv.y, fv.x, 0))
    hip = V((-1.10, 7.30, SEAT_Z + SEAT_HIP))
    base = V((hip.x, hip.y, 0)) + fv * 0.46
    ankL = base + lat * 0.10
    ankR = base - lat * 0.10
    mouth = hip + V((0, 0, 0.62)) + fv * 0.20
    chest = hip + V((0, 0, 0.42)) + fv * 0.27
    p = chest.lerp(mouth, bite)
    hl = dict(palm=p + lat * 0.06, normal=V(-lat), dir=V(fv * 0.6 + V((0, 0, 0.5))), curl=0.55, thumb=0.5)
    hr = dict(palm=p - lat * 0.06, normal=V(lat), dir=V(fv * 0.6 + V((0, 0, 0.5))), curl=0.55, thumb=0.5)
    A.pose(F(c), root=(hip.x, hip.y, yaw), hips=tuple(hip), spine=(SOFA_SPINE, 0, 0), chest=(SOFA_CHEST, 0, 0), neck=(6.0 + 10 * bite, 0, 0), head=(4.0, 0, 0),
           foot_l=dict(ankle=(ankL.x, ankL.y, ANKLE_Z), yaw=yaw), foot_r=dict(ankle=(ankR.x, ankR.y, ANKLE_Z), yaw=yaw),
           pole_kn_l=(ankL.x + fv.x * 0.15, ankL.y + fv.y * 0.15, 0.9), pole_kn_r=(ankR.x + fv.x * 0.15, ankR.y + fv.y * 0.15, 0.9),
           hand_l=hl, hand_r=hr, face=face, interp=interp)


SEAT_HIP, SOFA_SPINE, SOFA_CHEST = 0.14, 8.0, 10.0


def track_B07_SH02(A):
    """Sofa seated eating; unwrap/bite at clip 60 (TH f 51 / EN f 45): bread to the mouth c52-60, chew, lower c75."""
    seated_sofa(A, 0)
    seated_sofa(A, 50, 0.0)
    seated_sofa(A, 60, 1.0, face='neutral')
    seated_sofa(A, 68, 1.0, face='neutral')
    seated_sofa(A, 80, 0.0)
    seated_sofa(A, 125, 0.0)
    return {}


def track_B08_SH01(A):
    """Balcony: (0.15, 10.30) facing +Y, head yaw 25 deg left, hands on the rail z 1.10 at y 10.70, breathing only (c0..203)."""
    root = (0.15, 10.30, 180.0)
    hl = dict(palm=(0.15 + 0.19, 10.70, 1.10), normal=V((0, 0, -1)), dir=V((0, 1, 0)), curl=0.6, thumb=0.4)
    hr = dict(palm=(0.15 - 0.19, 10.70, 1.10), normal=V((0, 0, -1)), dir=V((0, 1, 0)), curl=0.6, thumb=0.4)
    for c in range(0, 205, 25):
        ph = 0.5 - 0.5 * math.cos(2 * math.pi * c / 100.0)
        A.pose(F(c), root=root, hand_l=hl, hand_r=hr, spine=(2 + 1.0 * ph, 0, 0), chest=(1.0 * ph, 0, 0), head=(3, 25, 0), face='tired')
    return {'rail_hands': (tuple(hl['palm']), tuple(hr['palm']))}


# ============================================================================ B09 (seated on the floor against the back wall)
FLOOR_HIP = V((-1.25, 0.85, 0.049))
FLOOR_LEAN = (7.7, 10.2, 12.8)      # pelvis / spine / chest backward lean (deg) toward the wall; solved numerically by check.py
FLOOR_HEAD = (22.7, 28.0)           # neck / head forward pitch (deg) so the head reads 20 deg down in the world


def seated_floor(A, c, head_lift=0.0, yaw_head=0.0, look=None, face='tired', blink=0.0, interp='BEZIER', hands_on_knees=True):
    """B09-SH01/02/03: hips (-1.25, 0.85), shoulder blades on the back wall, knees up, feet at x ~ -0.75, faces +X, head pitched down ~20 deg
    (head_lift deg raises it; yaw_head turns toward -Y/the door), hands resting on the knees, phone at (-0.80, 0.62) by the right foot."""
    k = A.LEG_K          # zc-you staging numbers (hip height, feet reach/spacing) scale with the character's leg length
    ankL = V((FLOOR_HIP.x + 0.5 * k, FLOOR_HIP.y + 0.12 * k, A.ANKLE_Z))
    ankR = V((FLOOR_HIP.x + 0.5 * k, FLOOR_HIP.y - 0.12 * k, A.ANKLE_Z))
    hip = V((FLOOR_HIP.x, FLOOR_HIP.y, FLOOR_HIP.z * k))
    common = dict(root=(FLOOR_HIP.x, FLOOR_HIP.y, 90.0), hips=tuple(hip), pelvis=(-FLOOR_LEAN[0], 0, 0), spine=(-FLOOR_LEAN[1], 0, 0),
                  chest=(-FLOOR_LEAN[2], 0, 0), neck=(FLOOR_HEAD[0] - head_lift * 0.4, yaw_head * 0.4, 0), head=(FLOOR_HEAD[1] - head_lift * 0.6, yaw_head * 0.6, 0),
                  foot_l=dict(ankle=tuple(ankL), yaw=90.0), foot_r=dict(ankle=tuple(ankR), yaw=90.0), look=look, face=face, blink=blink, interp=interp,
                  pole_kn_l=(FLOOR_HIP.x + 0.35 * k, ankL.y + 0.06 * k, 1.2 * k), pole_kn_r=(FLOOR_HIP.x + 0.35 * k, ankR.y - 0.06 * k, 1.2 * k))
    if hands_on_knees:
        A.pose(F(c), key=False, **common)
        kl = A.mw @ A.P['thigh.L'].tail
        kr = A.mw @ A.P['thigh.R'].tail
        common['hand_l'] = dict(palm=(kl.x - 0.01, kl.y, kl.z + 0.075), normal=V((0, 0, -1)), dir=V((1, 0, -0.3)), curl=0.4, thumb=0.3)
        common['hand_r'] = dict(palm=(kr.x - 0.01, kr.y, kr.z + 0.075), normal=V((0, 0, -1)), dir=V((1, 0, -0.3)), curl=0.4, thumb=0.3)
    A.pose(F(c), **common)


def track_B09_SH01(A):
    seated_floor(A, 0)
    seated_floor(A, 45)
    return {}


def track_B09_SH02(A):
    """Face close: head lifts 15 deg c40-55; eyes to screen-left (the door, -Y) c60-64; blink + swallow c73 and c87; then frozen."""
    door = (-1.25, 0.0, 1.0)
    seated_floor(A, 0)
    seated_floor(A, 38)
    seated_floor(A, 55, head_lift=15.0, face='listening')
    seated_floor(A, 59, head_lift=15.0, face='listening')
    seated_floor(A, 64, head_lift=15.0, look=door, face='listening')
    for c in (71, 73, 76, 85, 87, 90):
        seated_floor(A, c, head_lift=15.0, look=door, face='listening', blink=1.0 if c in (73, 87) else 0.0)
    seated_floor(A, 128, head_lift=15.0, look=door, face='frozen')
    return {}


def track_B09_SH03(A):
    """SH01 pose with the head lifted and turned toward the door (-Y)."""
    seated_floor(A, 0, head_lift=15.0, yaw_head=-40.0, look=(-1.0, -0.5, 1.0), face='frozen')
    return {}


# ============================================================================ B10-SH01 (clip 0..245)
B10_ROOT = (0.80, 0.92)
B10_CAM0 = V((1.300, 3.250, 1.580))
B10_CAM1 = V((1.287, 3.212, 1.580))
B10_DOOR = V((0.0, 0.35, 1.50))


def b10_pose(A, c, turn=0.0, cam=None, blink=0.0, face='neutral'):
    """Standing at (0.80, 0.92), facing the door centre (0.0, 0.35) (yaw -55 deg), three-quarter back to the camera.
    turn 0..1: head 75 deg + shoulders 50 deg to HIS RIGHT (toward the lens), eyes on the lens (cam) once turn == 1."""
    yaw = yaw_for((B10_DOOR.x - B10_ROOT[0], B10_DOOR.y - B10_ROOT[1]))
    sh = 50.0 * turn
    hd = 75.0 * turn
    look = B10_DOOR if turn < 0.5 else cam
    A.pose(F(c), root=(B10_ROOT[0], B10_ROOT[1], yaw), spine=(2.0, -sh * 0.4, 0), chest=(0, -sh * 0.6, 0), neck=(0, -hd * 0.4, 0), head=(0, -hd * 0.6, 0),
           look=look, face=face, blink=blink)


def track_B10_SH01(A):
    """Hold looking at the door c0-104; turn c105-117 (head 75 + shoulders 50 toward the lens), eyes hold the lens to c245; one blink in the hold."""
    cam = lambda c: B10_CAM0.lerp(B10_CAM1, c / 245.0)
    b10_pose(A, 0, 0.0, face='neutral')
    b10_pose(A, 104, 0.0)
    b10_pose(A, 111, 0.5, cam(111))
    b10_pose(A, 117, 1.0, cam(117))
    b10_pose(A, 178, 1.0, cam(178))
    b10_pose(A, 180, 1.0, cam(180), blink=1.0)
    b10_pose(A, 183, 1.0, cam(183))
    b10_pose(A, 245, 1.0, cam(245))
    return {}


def _ang(a, b, t):
    d = (b - a + 180) % 360 - 180
    return a + d * t


TRACKS = {k[6:].replace('_', '-'): v for k, v in dict(globals()).items() if k.startswith('track_')}
