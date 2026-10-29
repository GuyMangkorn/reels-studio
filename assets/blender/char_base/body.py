"""char_base body: parameters -> joints (left side; right mirrors x), bone table, skin-modifier graph, distance weights, IK, pole calibration.

Reference: the adult male at sex 0, stylize 0, stoop 0, mass REF_MASS, height 1.72 reproduces the zc-you rig (CP-L fractions are its joints / 1.72).
Metres, Z-up, front = -Y, body-left = +X, origin = floor between the feet. Proportion constants cite docs/character-proportion-principles.md.
"""
import math

import bmesh
import bpy
from mathutils import Matrix, Vector

PARAM_RANGES = {'height': (1.00, 1.95), 'heads_tall': (3.5, 8.0), 'sex': (0, 1), 'mass': (0, 1), 'stoop': (0, 1), 'stylize': (0, 1),
                'arm_len': (0.9, 1.1), 'leg_len': (0.9, 1.1)}
REF_MASS = 0.3
_BASE = dict(sex=0.0, mass=REF_MASS, stoop=0.0, stylize=0.0, arm_len=1.0, leg_len=1.0)
AGE = {
    'child': dict(_BASE, height=1.28, heads_tall=6.0),            # CP-A03 (8 years)
    'adult': dict(_BASE, height=1.72, heads_tall=7.5),            # CP-A05 (realistic adult)
    'elder': dict(_BASE, height=1.68, heads_tall=7.5, stoop=0.5),  # CP-A07 (ASSUMPTION: adult canon + stoop)
}

# ----------------------------------------------------------------------------- reference (zc-you) values
REF_H = 1.72            # CP-L07: reference nominal height (head bone tail)
REF_HEAD_H = 0.23004    # CP-L07: zc-you head height (char_head defaults at scale 1.0)
HEAD_TOP_F = 0.125 / REF_HEAD_H     # CP-L07: head bone tail above the head centre, in head heights
HEAD_PIVOT_F = 0.095 / REF_HEAD_H   # CP-L06: head bone root (neck tail) below the head centre, in head heights
Z_ANK, Z_KNEE, Z_HIP, Z_PELVIS = 0.085, 0.480, 0.925, 0.93   # CP-L05, CP-L04, CP-L03, CP-L01 (x 1.72)
Z_SPINE, Z_CHEST, Z_SH, Z_NECK, Z_HB = 1.05, 1.22, 1.385, 1.40, 1.50   # CP-L (zc-you trunk), CP-L02, CP-L06, CP-L06 + neck length
SH_X, HIP_X = (0.195, 0.170), (0.085, 0.098)   # CP-S01, CP-S02 half-widths (male, female) at 1.72 m
WAIST_SEX, NECK_SEX, EXTREM_SEX = 0.85, 0.85, 0.9   # CP-S03, CP-S05, CP-S06 (female factors)
STY_HEADS, STY_EXTREM, STY_LIMB_R, STY_LEG = 4.5, 1.3, 1.25, 0.85   # CP-Y01, CP-Y02, CP-Y03, CP-Y04
BUST_Y, BUST_R = 0.015, 0.25   # CP-S04: fuller, forward chest node with sex (separate L/R bust nodes broke the skin hull; per-preset tuning later)
MASS_R, BELLY_Y, BELLY_R = 0.6, 0.06, 0.5        # ASSUMPTION (no CP entry): radius gain per unit mass, belly push / growth above REF_MASS
MASS_SH = 0.12      # ASSUMPTION (no CP entry, proposed CP-M): shoulder half-width gain per unit mass above REF_MASS (keeps the arm root outside the chest)
STOOP_KNEE, STOOP_SPINE, STOOP_NECK = 12.0, 16.0, 20.0   # CP-A07 ASSUMPTION: degrees at stoop 1
ARM_A = math.radians(20)                 # CP-L: A-pose arm angle from vertical (zc-you)
ARM_DIR = Vector((math.sin(ARM_A), 0.0, -math.cos(ARM_A)))
FDIR = (ARM_DIR + Vector((0.0, -0.13, 0.0))).normalized()   # forearm/hand direction (zc-you)
UPPER_ARM, FOREARM, ELBOW_Y = 0.29, 0.26, 0.014   # CP-L09/CP-L10 (zc-you); relaxed elbow 3 deg (a straight chain is an IK singularity)
HAND = (0.045, 0.045, 0.078, 0.040)                # CP-L (zc-you): wrist->palm, palm->knuckle, knuckle->tip, knuckle->finger mid
TH0, TH1 = Vector((-0.010, -0.022, 0.005)), Vector((-0.006, -0.032, -0.024))   # CP-L (zc-you) thumb root / tip offsets
FOOT = {'ANK': (0.0, 0.085), 'HEEL': (0.048, 0.042), 'BALL': (-0.115, 0.035), 'TOE': (-0.178, 0.026)}   # CP-L05 + zc-you foot (y, z)
KNEE_Y = -0.005        # CP-L04 (zc-you)
MITT = ((0.034, 0.20, 0.033, 0.017), (0.030, 0.55, 0.025, 0.014))
# ^ CP-L ASSUMPTION (proposed CP-H01, cartoon mitten): nodes past the knuckle (step along the hand axis, curl toward the palm, rx, ry) x hand size
THUMB_R = (0.016, 0.013)   # CP-L ASSUMPTION (proposed CP-H01): thumb lump root / tip radius x hand size
ARMPIT = (0.30, 0.050, 0.90)   # CP-S01 ASSUMPTION (proposed CP-S07): upper-arm node at 30% to the elbow, radius x limb factor; chest node width x0.9 (tight armpit)
NECK_R = (0.046, 0.037)    # CP-L06 ASSUMPTION (proposed CP-N01): slim neck radius above the shoulder yoke / under the head, tapering


def mirror(v, s):
    return Vector((v.x * s, v.y, v.z))


def fdir(s):
    return Vector((FDIR.x * s, FDIR.y, FDIR.z))


def _lerp(a, b, t):
    return a + (b - a) * t


def body_params(age='adult', **kw):
    """Defaults of `age` merged with kw; unknown keys and out-of-range values raise ValueError naming the key."""
    if age not in AGE:
        raise ValueError(f'char_base.body: unknown age {age!r} (one of {sorted(AGE)})')
    bp = dict(AGE[age])
    for k, v in kw.items():
        if k not in PARAM_RANGES:
            raise ValueError(f'char_base.body: unknown body parameter {k!r}')
        bp[k] = v
    for k, (lo, hi) in PARAM_RANGES.items():
        if not lo <= bp[k] <= hi:
            raise ValueError(f'char_base.body: {k}={bp[k]} outside [{lo}, {hi}]')
    bp['age'] = age
    return bp


def heads_tall(bp):
    return _lerp(bp['heads_tall'], STY_HEADS, bp['stylize'])     # CP-Y01


def head_scale(bp, unit_height):
    """Head scale so that head height = height / heads_tall (stylized); unit_height = head_metrics(p, 1.0)['height']."""
    return (bp['height'] / heads_tall(bp)) / unit_height


def factors(bp):
    """Size factors: gw (body column below the head / zc-you's, used for widths), hs/fs (hand, foot size), rt/rl (torso, limb radius)."""
    s, y = bp['sex'], bp['stylize']
    gw = bp['height'] * (1 - (HEAD_TOP_F + HEAD_PIVOT_F) / heads_tall(bp)) / Z_HB    # body below the head scales as one (column / reference)
    ext = gw * _lerp(1, EXTREM_SEX, s) * _lerp(1, STY_EXTREM, y)
    mf = 1 + (bp['mass'] - REF_MASS) * MASS_R
    return dict(gw=gw, hs=ext, fs=ext, rt=gw * mf, rl=gw * mf * _lerp(1, STY_LIMB_R, y), belly=max(0.0, bp['mass'] - REF_MASS))


def _rot_x(p, c, a):
    d = p - c
    ca, sa = math.cos(a), math.sin(a)
    return c + Vector((d.x, d.y * ca - d.z * sa, d.y * sa + d.z * ca))


def joints(bp, head):
    """Joint positions (left side) + graph/control points; head = head_metrics(p, scale) of the head style."""
    F = factors(bp)
    gw, hs, fs = F['gw'], F['hs'], F['fs']
    H, h = bp['height'], head['height']
    top = H
    hc = top - HEAD_TOP_F * h
    hb = hc - HEAD_PIVOT_F * h
    ank = Z_ANK * fs
    col = hb / Z_HB
    hip = Z_HIP * col * bp['leg_len'] * _lerp(1, STY_LEG, bp['stylize'])    # CP-Y04
    hf = h / REF_HEAD_H

    def z(r):
        if r <= Z_ANK:
            return r * fs
        if r <= Z_HIP:
            return ank + (r - Z_ANK) * (hip - ank) / (Z_HIP - Z_ANK)
        if r <= Z_HB:
            return hip + (r - Z_HIP) * (hb - hip) / (Z_HB - Z_HIP)
        return hb + (r - Z_HB) * hf
    hx = _lerp(*HIP_X, bp['sex']) * gw
    J = {'pelvis': Vector((0, 0, z(Z_PELVIS))), 'spine': Vector((0, 0, z(Z_SPINE))), 'chest': Vector((0, 0, z(Z_CHEST))),
         'neck': Vector((0, 0, z(Z_NECK))), 'head_base': Vector((0, 0, hb)), 'head_c': Vector((0, 0, hc)), 'head_top': Vector((0, 0, top)),
         'waist_n': Vector((0, 0, z(1.07))), 'chest_n': Vector((0, 0, z(1.25))),                 # CP-L (zc-you graph nodes)
         'neck0': Vector((0, 0.002 * gw, z(1.40))), 'neck1': Vector((0, -0.012 * hf, z(1.53))),
         'look': Vector((0, -1.0, z(1.61))),
         'HIP': Vector((hx, 0, hip)), 'KNEE': Vector((hx, KNEE_Y * gw, z(Z_KNEE)))}
    for k, (fy, fz) in FOOT.items():
        J[k] = Vector((hx, fy * fs, fz * fs))
    J['clav'] = Vector((0.03 * gw, 0, z(Z_SH)))
    J['SH'] = Vector(((_lerp(*SH_X, bp['sex']) + MASS_SH * max(0.0, bp['mass'] - REF_MASS)) * gw, 0, z(Z_SH)))     # heavier: shoulders out of the wider chest
    al = col * bp['arm_len']
    J['EL'] = J['SH'] + ARM_DIR * UPPER_ARM * al + Vector((0, ELBOW_Y * al, 0))
    J['WR'] = J['EL'] + FDIR * FOREARM * al
    J['PALM'] = J['WR'] + FDIR * HAND[0] * hs
    J['KNU'] = J['PALM'] + FDIR * HAND[1] * hs
    J['TIP'] = J['KNU'] + FDIR * HAND[2] * hs
    J['FMID'] = J['KNU'] + FDIR * HAND[3] * hs
    J['TH0'] = J['PALM'] + TH0 * hs
    J['TH1'] = J['TH0'] + TH1 * hs
    J['pole_el'] = Vector((0.40 * gw, 0.50 * gw, z(1.10)))       # CP-L (zc-you control placement)
    J['pole_kn'] = Vector((0.12 * gw, -0.80 * gw, z(0.50)))
    if bp['stoop'] > 0:
        _stoop(J, bp['stoop'])
    return J


ARM_KEYS = ('EL', 'WR', 'PALM', 'KNU', 'TIP', 'FMID', 'TH0', 'TH1', 'pole_el')
LEG_KEYS = ('HIP', 'KNEE', 'ANK', 'HEEL', 'BALL', 'TOE', 'pole_kn')


def _stoop(J, st):
    """Rest posture (CP-A07): knees bend forward (bone lengths kept), spine then neck curve forward; arms hang from the moved shoulders."""
    a = math.radians(STOOP_KNEE * st)
    knee = _rot_x(J['KNEE'], J['ANK'], a)
    hip = _rot_x(J['HIP'], J['KNEE'], -a) - J['KNEE'] + knee
    d = hip - J['HIP']
    J['KNEE'], J['HIP'] = knee, hip
    sh0 = J['SH'].copy()
    for k in J:
        if k not in LEG_KEYS and k != 'look':
            J[k] = J[k] + d
    upper = ('chest', 'neck', 'head_base', 'head_c', 'head_top', 'chest_n', 'neck0', 'neck1', 'clav', 'SH')
    headk = ('head_base', 'head_c', 'head_top', 'neck1')
    hc0 = J['head_c'].copy()
    sp = J['spine'].copy()
    for k in upper:
        J[k] = _rot_x(J[k], sp, math.radians(STOOP_SPINE * st))
    nk = J['neck'].copy()
    for k in headk:
        J[k] = _rot_x(J[k], nk, math.radians(STOOP_NECK * st))
    for k in ARM_KEYS:
        J[k] = J[k] + (J['SH'] - sh0 - d)
    J['look'] = J['look'] + Vector((0, 0, J['head_c'].z - hc0.z + d.z))


# ----------------------------------------------------------------------------- bones: (name, head, tail, parent, deform)
def bone_table(J, head_mod, hp, scale):
    B = [
        ('root', Vector((0, 0, 0)), Vector((0, 0, 0.12 * J['head_top'].z / REF_H)), None, False),
        ('pelvis', J['pelvis'], J['spine'], 'root', True),
        ('spine', J['spine'], J['chest'], 'pelvis', True),
        ('chest', J['chest'], J['neck'], 'spine', True),
        ('neck', J['neck'], J['head_base'], 'chest', True),
        ('head', J['head_base'], J['head_top'], 'neck', True),
        ('look_target', J['look'], J['look'] + Vector((0, 0, 0.05)), 'root', False),
    ]
    B += head_mod.face_bones(J['head_c'], hp, scale)
    for s, n in ((1, 'L'), (-1, 'R')):
        m = lambda k: mirror(J[k], s)
        B += [
            (f'clavicle.{n}', m('clav'), m('SH'), 'chest', True),
            (f'upper_arm.{n}', m('SH'), m('EL'), f'clavicle.{n}', True),
            (f'forearm.{n}', m('EL'), m('WR'), f'upper_arm.{n}', True),
            (f'hand.{n}', m('WR'), m('KNU'), f'forearm.{n}', True),
            (f'fingers.{n}', m('KNU'), m('FMID'), f'hand.{n}', True),
            (f'fingers_tip.{n}', m('FMID'), m('TIP'), f'fingers.{n}', True),
            (f'thumb.{n}', m('TH0'), m('TH1'), f'hand.{n}', True),
            (f'thigh.{n}', m('HIP'), m('KNEE'), 'pelvis', True),
            (f'shin.{n}', m('KNEE'), m('ANK'), f'thigh.{n}', True),
            (f'foot.{n}', m('ANK'), m('BALL'), f'shin.{n}', True),
            (f'toe.{n}', m('BALL'), m('TOE'), f'foot.{n}', True),
            # controls (no deform); rest orientation == the bone they drive, so zero rotation = rest pose
            (f'ik_hand.{n}', m('WR'), m('KNU'), 'root', False),
            (f'ik_foot.{n}', m('ANK'), m('BALL'), 'root', False),
            (f'pole_elbow.{n}', m('pole_el'), m('pole_el') + Vector((0, 0.05, 0)), 'root', False),
            (f'pole_knee.{n}', m('pole_kn'), m('pole_kn') + Vector((0, -0.05, 0)), 'root', False),
        ]
    return B


def mitt_points(J, s, hs):
    """Mitten nodes past the knuckle on side s: the hand axis curling toward the palm (medial, the side poses.py curls the fingers to)."""
    f = fdir(s)
    pn = Vector((-s, 0, 0))
    pn = (pn - f * f.dot(pn)).normalized()
    out, p = [], mirror(J['KNU'], s)
    for step, curl, rx, ry in MITT:
        p = p + (f + pn * curl).normalized() * step * hs
        out.append((p, (rx * hs, ry * hs)))
    return out


# ----------------------------------------------------------------------------- body skin graph (verts, edges)
def body_graph(J, bp):
    """Skin-modifier graph: [(name, pos, (rx, ry))], [(i, j)]. Radii are the zc-you values (CP-L) x size factors."""
    F = factors(bp)
    rt, rl, hs, fs, sx = F['rt'], F['rl'], F['hs'], F['fs'], bp['sex']
    V, E = [], []

    def v(name, pos, r):
        V.append((name, Vector(pos), r))
        return len(V) - 1
    hipw = _lerp(*HIP_X, sx) / HIP_X[0]          # CP-S02: pelvis follows hip width
    shw = _lerp(*SH_X, sx) / SH_X[0]             # CP-S01: chest follows shoulder width
    wf = _lerp(1, WAIST_SEX, sx)                 # CP-S03
    nf = _lerp(1, NECK_SEX, sx)                  # CP-S05
    belly = F['belly']
    # CP-L: every radius below is the zc-you value (rx, ry) at 1.72 m, times the size factors
    pel = v('pelvis', J['pelvis'], (0.152 * rt * hipw, 0.104 * rt))
    wai = v('waist', J['waist_n'] + Vector((0, -BELLY_Y * belly * F['gw'], 0)),
            (0.128 * rt * wf * (1 + BELLY_R * belly), 0.090 * rt * (1 + BELLY_R * belly)))
    che = v('chest', J['chest_n'] + Vector((0, -BUST_Y * sx * F['gw'], 0)), (ARMPIT[2] * 0.158 * rt * shw, 0.108 * rt * (1 + BUST_R * sx)))   # CP-S04
    n0 = v('neck0', J['neck0'], (0.062 * rt * nf, 0.062 * rt * nf))    # shoulder yoke: chest, shoulders and neck meet here
    up = (J['neck0'] - J['chest_n']).normalized()      # the neck leaves the yoke along the torso axis (a leaning neck edge detached at stoop)
    # CP-L06 ASSUMPTION (proposed CP-N01): the slim neck starts 35% of the way from the yoke to the head socket
    nm = v('neckm', J['neck0'] + up * 0.35 * (J['neck1'] - J['neck0']).length, (NECK_R[0] * rt * nf, NECK_R[0] * rt * nf))
    n1 = v('neck1', J['neck1'], (NECK_R[1] * rt * nf, NECK_R[1] * rt * nf))
    E += [(pel, wai), (wai, che), (che, n0), (n0, nm), (nm, n1)]     # a tree: a chest-shoulder-neck cycle made the skin modifier emit overlapping shells
    for s, n in ((1, 'L'), (-1, 'R')):
        m = lambda k: mirror(J[k], s)
        sh = v(f'sh.{n}', m('SH'), (0.060 * rl, 0.060 * rl))
        el = v(f'el.{n}', m('EL'), (0.046 * rl, 0.046 * rl))
        wr = v(f'wr.{n}', m('WR'), (0.033 * rl, 0.033 * rl))
        pa = v(f'palm.{n}', m('PALM'), (0.036 * hs, 0.020 * hs))
        kn = v(f'knu.{n}', m('KNU'), (0.034 * hs, 0.018 * hs))      # CP-L ASSUMPTION (proposed CP-H01): mitten knuckle depth
        t0 = v(f'th0.{n}', m('TH0'), (THUMB_R[0] * hs, THUMB_R[0] * hs))
        t1 = v(f'th1.{n}', m('TH1'), (THUMB_R[1] * hs, THUMB_R[1] * hs))
        a0 = v(f'arm0.{n}', m('SH').lerp(m('EL'), ARMPIT[0]), (ARMPIT[1] * rl, ARMPIT[1] * rl))    # holds the arm tube narrow where it leaves the chest
        E += [(n0, sh), (sh, a0), (a0, el), (el, wr), (wr, pa), (pa, kn), (pa, t0), (t0, t1)]
        prev = kn
        for k, (p, r) in enumerate(mitt_points(J, s, hs)):       # one mitten mass, no separate fingers
            cur = v(f'mitt{k}.{n}', p, r)
            E.append((prev, cur))
            prev = cur
        hp = v(f'hip.{n}', m('HIP'), (0.078 * rl, 0.078 * rl))
        kneev = v(f'knee.{n}', m('KNEE'), (0.058 * rl, 0.058 * rl))
        an = v(f'ank.{n}', m('ANK'), (0.038 * rl, 0.038 * rl))
        he = v(f'heel.{n}', m('HEEL'), (0.034 * fs, 0.034 * fs))
        ba = v(f'ball.{n}', m('BALL'), (0.041 * fs, 0.028 * fs))
        to = v(f'toe.{n}', m('TOE'), (0.034 * fs, 0.021 * fs))
        th_m = v(f'thm.{n}', (m('HIP') + m('KNEE')) / 2, (0.074 * rl, 0.074 * rl))
        ca = v(f'calf.{n}', m('KNEE') + (m('ANK') - m('KNEE')) * 0.30 + Vector((0, 0.012 * F['gw'], 0)), (0.052 * rl, 0.054 * rl))
        E += [(pel, hp), (hp, th_m), (th_m, kneev), (kneev, ca), (ca, an), (an, he), (an, ba), (ba, to)]
    return V, E


def skin_mesh(V, E, name):
    """Skin-modifier mesh from a body graph, baked to a plain mesh in rest pose (lowest vertex not yet normalised)."""
    me = bpy.data.meshes.new(name + '_skin')
    me.from_pydata([tuple(p) for _, p, _ in V], E, [])
    ob = bpy.data.objects.new(name + '_skin', me)
    bpy.context.scene.collection.objects.link(ob)
    bpy.context.view_layer.objects.active = ob
    ob.select_set(True)
    bpy.ops.mesh.customdata_skin_add()
    for i, (_, _, r) in enumerate(V):
        d = me.skin_vertices[0].data[i]
        d.radius = r
        d.use_root = (i == 0)
    sk = ob.modifiers.new('skin', 'SKIN')
    sk.branch_smoothing = 0.8
    sk.use_smooth_shade = True
    ss = ob.modifiers.new('sub', 'SUBSURF')
    ss.levels = 2
    ss.show_viewport = False
    dg = bpy.context.evaluated_depsgraph_get()
    cage = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    bm = bmesh.new()
    bm.from_mesh(cage)
    if any(not e.is_manifold for e in bm.edges):     # the skin hull failed at a branch (chest/neck/shoulder cycle): close the cage, then subdivide
        _close(bm)
        bm.to_mesh(cage)
        bm.free()
        bpy.data.objects.remove(ob, do_unlink=True)
        bpy.data.meshes.remove(me)
        me = cage
        ob = bpy.data.objects.new(name + '_skin', me)
        bpy.context.scene.collection.objects.link(ob)
        ss = ob.modifiers.new('sub', 'SUBSURF')
        ss.levels = 2
    else:
        bm.free()
        bpy.data.meshes.remove(cage)
        ss.show_viewport = True
    dg = bpy.context.evaluated_depsgraph_get()
    new = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    bpy.data.objects.remove(ob, do_unlink=True)
    bpy.data.meshes.remove(me)
    bm = bmesh.new()                                 # the skin modifier leaves unused branch vertices behind: drop loose vertices
    bm.from_mesh(new)
    loose = [v for v in bm.verts if not v.link_edges]
    if loose:
        bmesh.ops.delete(bm, geom=loose, context='VERTS')
        bm.to_mesh(new)
    bm.free()
    return new


def _close(bm, rounds=4):
    """Make a skin cage manifold: drop wire edges, open faces fanning on one edge (>2 faces), fill the holes."""
    for _ in range(rounds):
        wire = [e for e in bm.edges if not e.link_faces]
        if wire:
            bmesh.ops.delete(bm, geom=wire, context='EDGES')
        fan = {f for e in bm.edges if len(e.link_faces) > 2 for f in e.link_faces}
        if fan:
            bmesh.ops.delete(bm, geom=list(fan), context='FACES_ONLY')
            bmesh.ops.delete(bm, geom=[e for e in bm.edges if not e.link_faces], context='EDGES')
        holes = [e for e in bm.edges if e.is_boundary]
        if holes:
            bmesh.ops.holes_fill(bm, edges=holes, sides=0)
        if all(e.is_manifold for e in bm.edges):
            return


def bisect(me, planes):
    """Cut edge loops along planes [(co, normal)] so garment borders are clean lines."""
    bm = bmesh.new()
    bm.from_mesh(me)
    for co, no in planes:
        bmesh.ops.bisect_plane(bm, geom=list(bm.verts) + list(bm.edges) + list(bm.faces), plane_co=Vector(co), plane_no=Vector(no))
    bm.to_mesh(me)
    bm.free()


# ----------------------------------------------------------------------------- weights
def _seg_dist(p, a, b):
    ab = b - a
    t = max(0.0, min(1.0, (p - a).dot(ab) / max(ab.length_squared, 1e-12)))
    return (p - (a + ab * t)).length, t


def _neighbours(bones):
    nb = {}
    names = {b[0] for b in bones}
    for n, h, t, par, dfm in bones:
        if not dfm:
            continue
        nb.setdefault(n, set()).add(n)
        if par and par in names and any(b[0] == par and b[4] for b in bones):
            nb[n].add(par)
            nb.setdefault(par, set()).add(par)
            nb[par].add(n)
    for s in 'LR':      # extra smoothing neighbours: chest~upper_arm
        nb['chest'].add(f'upper_arm.{s}')
        nb[f'upper_arm.{s}'].add('chest')
    return nb


BLEND = {'pelvis': 0.07, 'spine': 0.08, 'chest': 0.08, 'neck': 0.04, 'clavicle': 0.05, 'upper_arm': 0.05, 'forearm': 0.05,
         'hand': 0.03, 'fingers': 0.02, 'fingers_tip': 0.015, 'thumb': 0.02, 'thigh': 0.06, 'shin': 0.05, 'foot': 0.035, 'toe': 0.03}
BODY_BONES = {'pelvis', 'spine', 'chest', 'neck'} | {f'{b}.{s}' for s in 'LR' for b in
              ('clavicle', 'upper_arm', 'forearm', 'hand', 'fingers', 'fingers_tip', 'thumb', 'thigh', 'shin', 'foot', 'toe')}


def weights(points, table, k=1.0):
    """Per point: {bone: weight}. Nearest deform bone plus its neighbours, linear falloff by extra distance (BLEND x k)."""
    deform = [b for b in table if b[4] and b[0] in BODY_BONES]
    nb = _neighbours(table)
    out = []
    for p in points:
        ds = {}
        for n, h, t, par, dfm in deform:
            ds[n] = _seg_dist(p, h, t)[0]
        best = min(ds, key=ds.get)
        w = {}
        for n in nb[best]:
            if n not in ds:
                continue
            bl = BLEND[n.split('.')[0]] * k
            wv = max(0.0, 1.0 - (ds[n] - ds[best]) / bl)
            if wv > 0:
                w[n] = wv
        top = sorted(w.items(), key=lambda kv: -kv[1])[:4]
        tot = sum(v for _, v in top)
        out.append({k_: v / tot for k_, v in top})
    return out


def vg_bind(ob, ao, weights_by_vertex):
    """Vertex groups from [{bone: w}] per vertex + Armature modifier; object parented to the armature object (no bone parenting)."""
    names = set()
    for w in weights_by_vertex:
        names |= set(w)
    for n in sorted(names):
        ob.vertex_groups.new(name=n)
    for i, w in enumerate(weights_by_vertex):
        for n, v in w.items():
            ob.vertex_groups[n].add([i], v, 'REPLACE')
    md = ob.modifiers.new('Armature', 'ARMATURE')
    md.object = ao
    ob.parent = ao


def rigid(ob, ao, bone):
    vg_bind(ob, ao, [{bone: 1.0}] * len(ob.data.vertices))


# ----------------------------------------------------------------------------- armature, IK
def armature(name, table, collection=None):
    arm = bpy.data.armatures.new(name)
    ao = bpy.data.objects.new(name, arm)
    (collection or bpy.context.scene.collection).objects.link(ao)
    bpy.context.view_layer.objects.active = ao
    ao.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    eb = arm.edit_bones
    for n, h, t, par, dfm in table:
        b = eb.new(n)
        b.head, b.tail = h, t
        b.use_deform = dfm
    for n, h, t, par, dfm in table:
        if par:
            eb[n].parent = eb[par]
    bpy.ops.object.mode_set(mode='OBJECT')
    arm.display_type = 'STICK'
    return ao


def add_ik(ao):
    bpy.context.view_layer.objects.active = ao
    bpy.ops.object.mode_set(mode='POSE')
    P = ao.pose.bones
    for pb in P:
        pb.rotation_mode = 'QUATERNION' if pb.name.startswith(('ik_', 'pole_', 'look_')) else 'XYZ'
    for s in 'LR':
        ik = P[f'forearm.{s}'].constraints.new('IK')
        ik.target, ik.subtarget = ao, f'ik_hand.{s}'
        ik.pole_target, ik.pole_subtarget = ao, f'pole_elbow.{s}'
        ik.chain_count = 2
        ik.pole_angle = 0.0
        cr = P[f'hand.{s}'].constraints.new('COPY_ROTATION')
        cr.target, cr.subtarget = ao, f'ik_hand.{s}'
        ik2 = P[f'shin.{s}'].constraints.new('IK')
        ik2.target, ik2.subtarget = ao, f'ik_foot.{s}'
        ik2.pole_target, ik2.pole_subtarget = ao, f'pole_knee.{s}'
        ik2.chain_count = 2
        ik2.pole_angle = 0.0
        cf = P[f'foot.{s}'].constraints.new('COPY_ROTATION')
        cf.target, cf.subtarget = ao, f'ik_foot.{s}'
        dt = P[f'eye.{s}'].constraints.new('DAMPED_TRACK')
        dt.target, dt.subtarget = ao, 'look_target'
        dt.track_axis = 'TRACK_Y'
    bpy.ops.object.mode_set(mode='OBJECT')


def _ctrl(ao, name, pos):
    pb = ao.pose.bones[name]
    pb.matrix = Matrix.Translation(Vector(pos)) @ pb.bone.matrix_local.to_3x3().to_4x4()


REF_ARM = (UPPER_ARM ** 2 + ELBOW_Y ** 2) ** 0.5 + FOREARM
REF_LEG = (Vector((0, KNEE_Y, Z_KNEE - Z_HIP)).length + Vector((0, -KNEE_Y, Z_ANK - Z_KNEE)).length)


def calibrate_poles(ao):
    """Pick the IK pole angle per limb so the elbow/knee bends toward its pole bone (bone roll conventions differ per side).
    Test reach targets are the zc-you ones relative to the shoulder / hip, scaled by limb length."""
    bpy.context.view_layer.update()
    B = ao.data.bones
    saved = {pb.name: (pb.location.copy(), pb.rotation_quaternion.copy()) for pb in ao.pose.bones if pb.name.startswith(('ik_', 'pole_'))}
    for s, sg in (('L', 1), ('R', -1)):
        arm = (B[f'upper_arm.{s}'].length + B[f'forearm.{s}'].length) / REF_ARM
        leg = (B[f'thigh.{s}'].length + B[f'shin.{s}'].length) / REF_LEG
        for limb, mid, ctrl, pole, tgt in (
                ('forearm', 'upper_arm', f'ik_hand.{s}', f'pole_elbow.{s}', B[f'upper_arm.{s}'].head_local + Vector((0.055 * sg, -0.40, -0.185)) * arm),
                ('shin', 'thigh', f'ik_foot.{s}', f'pole_knee.{s}', B[f'thigh.{s}'].head_local + Vector((0.0, -0.30, -0.575)) * leg)):
            pol = B[pole].head_local.copy()
            _ctrl(ao, ctrl, tgt)
            _ctrl(ao, pole, pol)
            con = ao.pose.bones[f'{limb}.{s}'].constraints['IK']
            best = None
            for a in (0, 90, -90, 180):
                con.pole_angle = math.radians(a)
                bpy.context.view_layer.update()
                d = (ao.matrix_world @ ao.pose.bones[f'{mid}.{s}'].tail - pol).length
                if best is None or d < best[0]:
                    best = (d, a)
            con.pole_angle = math.radians(best[1])
    for n, (loc, q) in saved.items():
        pb = ao.pose.bones[n]
        pb.location, pb.rotation_quaternion = loc, q
    bpy.context.view_layer.update()
