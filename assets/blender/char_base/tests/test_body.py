"""Parametric body: parameter validation, zc-you reference joints, age/sex/stoop/stylize landmarks, surface quality, mitten hands."""
import math

import bmesh
import bpy
from mathutils import Euler, Matrix, Vector
from mathutils.bvhtree import BVHTree

import body
import build
import char_head
import presets


def _J(**kw):
    age = kw.pop('age', 'adult')
    bp = body.body_params(age, **kw)
    hp = char_head.params()
    s = body.head_scale(bp, char_head.head_metrics(hp, 1.0)['height'])
    return bp, body.joints(bp, char_head.head_metrics(hp, s))


def test_ranges_raise():
    for k, (lo, hi) in body.PARAM_RANGES.items():
        try:
            body.body_params('adult', **{k: hi + 0.01})
        except ValueError as e:
            assert k in str(e), (k, str(e))
            continue
        raise AssertionError('no ValueError for ' + k)


def test_zc_joints_match_rig():
    P = presets.get('zc_you')
    hp = char_head.params(**P['head'][1])
    bp = body.body_params(P['age'], **P['body'])
    s = body.head_scale(bp, char_head.head_metrics(hp, 1.0)['height'])
    assert abs(s - 1.0) < 1e-5, s
    J = body.joints(bp, char_head.head_metrics(hp, s))
    want = {'SH': (0.195, 0, 1.385), 'HIP': (0.085, 0, 0.925), 'KNEE': (0.085, -0.005, 0.48), 'ANK': (0.085, 0, 0.085),
            'TOE': (0.085, -0.178, 0.026), 'head_c': (0, 0, 1.595), 'pelvis': (0, 0, 0.93), 'neck': (0, 0, 1.40), 'head_base': (0, 0, 1.50)}
    for k, v in want.items():
        assert (J[k] - Vector(v)).length < 0.002, (k, tuple(J[k]), v)


def test_child_landmarks():
    bp, J = _J(age='child', height=1.28, heads_tall=6.0)
    hp = char_head.params()
    s = body.head_scale(bp, char_head.head_metrics(hp, 1.0)['height'])
    h = char_head.head_metrics(hp, s)['height']
    assert abs(h - 1.28 / 6) < 0.005, h
    assert abs(J['HIP'].z / 1.28 - 0.538) < 0.03, J['HIP'].z / 1.28        # CP-L03


def test_sex_shoulder_hip():
    _, J0 = _J(sex=0.0)
    _, J1 = _J(sex=1.0)
    assert J1['SH'].x < J0['SH'].x and J1['HIP'].x > J0['HIP'].x


def test_stoop_moves_head_forward():
    _, J0 = _J(stoop=0.0)
    _, J1 = _J(stoop=0.5)
    assert J1['head_c'].y < J0['head_c'].y - 0.03, (J1['head_c'].y, J0['head_c'].y)


def test_stylize_bigger_head():
    bp = body.body_params('adult', stylize=1.0)
    s = body.head_scale(bp, char_head.head_metrics(char_head.params(), 1.0)['height'])
    h = char_head.head_metrics(char_head.params(), s)['height']
    assert abs(bp['height'] / h - 4.5) < 0.2, bp['height'] / h


# ----------------------------------------------------------------------------- surface quality (Task 6b)
SURFACE_CASES = (('zc_you', dict(presets.get('zc_you')['body'])), ('female', dict(sex=1.0)), ('child', dict(age='child')),
                 ('tall_big_head', dict(heads_tall=3.5, height=1.95)), ('heavy_stylized_female', dict(sex=1.0, mass=1.0, stylize=1.0)),
                 ('elder_stoop1', dict(age='elder', stoop=1.0)))
TORSO_Z_MAX_MM, TORSO_Z_P95_MM = 8.0, 2.5     # fixed result: max <= 3.6, p95 <= 1.42 (128-case grid max 5.1); the two-shell hull at 21f8433: max up to 86
TORSO_LUMP_MM = 7.5                           # 5 x 5 neighbourhood deviation (fixed result <= 5.7; an injected 30 mm sigma-2 cm chest lump: 9.9)
PROTRUSION_MAX = 0.36


def _skin(name, kw):
    kw = dict(kw)
    bp, J = _J(**kw)
    V, E = body.body_graph(J, bp)
    me = body.skin_mesh(V, E, name)
    return bp, J, V, E, me


def _torso_grid(me, J):
    """Torso radius (m) on a 1 cm x 7.5 deg ray grid from the spine axis, hip+3 cm to shoulder-5 cm; front/back sectors only
    (|dir.y| >= 0.6, the arms hang at the sides); None where not sampled."""
    bm = bmesh.new()
    bm.from_mesh(me)
    bvh = BVHTree.FromBMesh(bm)
    bm.free()
    axis = [J[k] for k in ('pelvis', 'spine', 'chest', 'neck')]
    z0, z1 = J['HIP'].z + 0.03, J['SH'].z - 0.05
    zs = [z0 + 0.01 * i for i in range(int((z1 - z0) / 0.01) + 1)]
    grid = []
    for z in zs:
        cy = next((a.y + (b.y - a.y) * (z - a.z) / (b.z - a.z) for a, b in zip(axis, axis[1:]) if a.z <= z <= b.z), 0.0)
        row = []
        for k in range(48):
            d = Vector((math.cos(k * math.pi / 24), math.sin(k * math.pi / 24), 0))
            hit = bvh.ray_cast(Vector((0, cy, z)), d, 1.0) if abs(d.y) >= 0.6 else (None,)
            row.append(hit[3] if hit[0] is not None else None)
        grid.append(row)
    return grid


def _torso_roughness(me, J):
    """(max, p95 of |second difference along z| in mm, lump mm). Shells, ripples and steps show as second-difference jumps;
    a smooth local lump shows as the largest deviation of the radius from its 5 x 5 cell (5 cm x 37.5 deg) neighbourhood mean."""
    grid = _torso_grid(me, J)
    dz = sorted(abs(a - 2 * b + c) * 1000 for r0, r1, r2 in zip(grid, grid[1:], grid[2:]) for a, b, c in zip(r0, r1, r2) if None not in (a, b, c))
    lump = 0.0
    for i in range(2, len(grid) - 2):
        for k in range(48):
            win = [grid[i + di][(k + dk) % 48] for di in range(-2, 3) for dk in range(-2, 3)]
            if None not in win:
                lump = max(lump, abs(grid[i][k] - sum(win) / 25) * 1000)
    return dz[-1], dz[int(0.95 * (len(dz) - 1))], lump


def _lump(me, J, amp=0.030, sig=0.02):
    """Inject a smooth Gaussian bump (amp m, sigma m) on the chest front (test of the test)."""
    c = Vector((0, 0, J['chest_n'].z))
    for v in me.vertices:
        if v.co.y < 0:
            v.co.y -= amp * math.exp(-((v.co.x - c.x) ** 2 + (v.co.z - c.z) ** 2) / (2 * sig * sig))
    me.update()


def test_torso_smooth():
    for label, kw in SURFACE_CASES:
        _, J, _, _, me = _skin('s_' + label, kw)
        mx, p95, lump = _torso_roughness(me, J)
        print(f'  torso roughness {label}: max {mx:.2f} mm, p95 {p95:.2f} mm, lump {lump:.2f} mm')
        assert mx <= TORSO_Z_MAX_MM and p95 <= TORSO_Z_P95_MM and lump <= TORSO_LUMP_MM, (label, mx, p95, lump)
        if label == 'zc_you':                    # the metric must see a 30 mm smooth chest lump
            _lump(me, J)
            mx, p95, lump = _torso_roughness(me, J)
            print(f'  torso roughness zc_you + 30 mm chest lump: max {mx:.2f}, p95 {p95:.2f}, lump {lump:.2f} mm')
            assert mx > TORSO_Z_MAX_MM or lump > TORSO_LUMP_MM, (mx, lump)


def _protrusion(me):
    """Worst umbrella ratio |p - mean(neighbours)| / mean edge length over the mesh: a spike, fin or sliver vertex stands out of its ring."""
    nb = [[] for _ in me.vertices]
    for e in me.edges:
        nb[e.vertices[0]].append(e.vertices[1])
        nb[e.vertices[1]].append(e.vertices[0])
    return max(_umbrella([v.co for v in me.vertices], nb))


def test_no_stray_parts():
    """One connected manifold piece with no protruding spike; the check must catch an injected 2 cm spike on the chest and the shoulder."""
    for label, kw in SURFACE_CASES:
        _, J, V, E, me = _skin('n_' + label, kw)
        bm = bmesh.new()
        bm.from_mesh(me)
        bm.verts.ensure_lookup_table()
        seen, todo = {bm.verts[0]}, [bm.verts[0]]
        while todo:
            x = todo.pop()
            for e in x.link_edges:
                o = e.other_vert(x)
                if o not in seen:
                    seen.add(o)
                    todo.append(o)
        pieces_ok = len(seen) == len(bm.verts)
        nm = sum(1 for e in bm.edges if not e.is_manifold)
        bm.free()
        pr = _protrusion(me)
        print(f'  stray parts {label}: one piece {pieces_ok}, non-manifold {nm}, protrusion {pr:.3f}')
        assert pieces_ok and nm == 0, (label, len(seen), nm)
        assert pr <= PROTRUSION_MAX, (label, pr)
        if label == 'zc_you':
            for name, t in (('chest front', Vector((0, -0.2, J['chest_n'].z))), ('shoulder top', J['SH'] + Vector((0, 0, 0.2)))):
                i = min(range(len(me.vertices)), key=lambda k: (me.vertices[k].co - t).length)
                base, nrm = me.vertices[i].co.copy(), me.vertices[i].normal.copy()
                for L in (0.02, 0.08):
                    me.vertices[i].co = base + nrm * L
                    pr = _protrusion(me)
                    print(f'  stray parts zc_you + {L * 100:.0f} cm spike at {name}: protrusion {pr:.3f}')
                    assert pr > PROTRUSION_MAX, (name, L, pr)
                me.vertices[i].co = base


def test_mitten_hand():
    """Hand + thumb are one mitten mass (no finger islands or gaps); the thumb tip follows the thumb bone."""
    ao = build.build('zc_you', 'm')
    ob = bpy.data.objects['m_body']
    J = {b.name: b for b in ao.data.bones}
    knu, tip = J['fingers.L'].head_local, J['fingers_tip.L'].tail_local
    names = {g.index: g.name for g in ob.vertex_groups}
    ax = (tip - knu).normalized()
    for f in (0.25, 0.5, 0.75):        # every section across the mitten past the knuckle is one closed loop (split fingers gave 4)
        bm = bmesh.new()
        bm.from_mesh(ob.data)
        c = knu + (tip - knu) * f
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if (v.co - c).length > 0.06], context='VERTS')
        cut = bmesh.ops.bisect_plane(bm, geom=list(bm.verts) + list(bm.edges) + list(bm.faces), plane_co=c, plane_no=ax)['geom_cut']
        edges = {e for e in cut if isinstance(e, bmesh.types.BMEdge)}
        verts = {v for e in edges for v in e.verts}
        loops = 0
        while verts:
            loops += 1
            todo = [verts.pop()]
            while todo:
                x = todo.pop()
                for e in x.link_edges:
                    if e in edges and e.other_vert(x) in verts:
                        verts.discard(e.other_vert(x))
                        todo.append(e.other_vert(x))
        bm.free()
        print(f'  mitten section {f}: {loops} loop(s)')
        assert loops == 1, (f, loops)
    th = [v for v in ob.data.vertices if any(names[g.group] == 'thumb.L' and g.weight > 0.5 for g in v.groups)]
    assert len(th) >= 8, len(th)
    tip_v = max(th, key=lambda v: (v.co - J['thumb.L'].head_local).length)
    dg = bpy.context.evaluated_depsgraph_get()
    p0 = ob.evaluated_get(dg).data.vertices[tip_v.index].co.copy()
    ao.pose.bones['thumb.L'].rotation_euler = Euler((0.0, 0.0, math.radians(40)), 'XYZ')
    bpy.context.view_layer.update()
    p1 = ob.evaluated_get(bpy.context.evaluated_depsgraph_get()).data.vertices[tip_v.index].co.copy()
    assert (p1 - p0).length > 0.008, (p1 - p0).length


ARMPIT_CASES = SURFACE_CASES + (('heavy_male', dict(mass=1.0)),)
SHOULDER_BUMP, MITTEN_BUMP = 0.10, 0.18   # umbrella growth at arm-up / grip 0.7 (fixed result <= 0.04 / 0.09; c14c2cd: 0.24-0.28 / 0.37-0.45)


def _bare(name, kw):
    kw = dict(kw)
    P = presets.get('zc_you')
    P['age'] = kw.pop('age', 'adult')
    P['body'] = kw
    P['outfit'] = []
    presets.PRESETS['_bare'] = P
    try:
        return build.build('_bare', name)
    finally:
        del presets.PRESETS['_bare']


def _arm_to(ao, deg):
    """Both upper arms to deg from vertical in the frontal plane (rest A-pose = 20), IK muted."""
    for s, sg in (('L', 1), ('R', -1)):
        ao.pose.bones[f'forearm.{s}'].constraints['IK'].mute = True
        ao.pose.bones[f'hand.{s}'].constraints['Copy Rotation'].mute = True
        pb = ao.pose.bones[f'upper_arm.{s}']
        pb.rotation_euler = (0, 0, 0)
        bpy.context.view_layer.update()
        h = pb.bone.head_local
        pb.matrix = Matrix.Translation(h) @ Matrix.Rotation(math.radians(deg - 20) * -sg, 4, 'Y') @ Matrix.Translation(-h) @ pb.matrix
    bpy.context.view_layer.update()


def _umbrella(P, nb):
    """Per vertex |p - mean(neighbours)| / mean neighbour edge length: grows at bumps, kinks and creases."""
    out = []
    for i, ns in enumerate(nb):
        c = sum((P[j] for j in ns), Vector()) / len(ns)
        out.append((P[i] - c).length / (sum((P[j] - P[i]).length for j in ns) / len(ns)))
    return out


def test_armpit_deforms():
    """Arm down at the side: no upper-arm vertex (upper_arm weight >= 0.8) > 1 mm inside the torso surface (heavy bodies are skipped:
    with mass-independent shoulders (R17) a fat arm meets the torso when lowered). Arm raised to shoulder height through the Actor
    (IK + clavicle follow), grip curl 0.7: the bump metric (umbrella growth over rest) stays low on the shoulder and the mitten."""
    from char_base import poses
    for label, kw in ARMPIT_CASES:
        ao = _bare('a_' + label, kw)
        ob = bpy.data.objects['a_' + label + '_body']
        me = ob.data
        gi = {g.index: g.name for g in ob.vertex_groups}
        dom = [gi[max((g for g in v.groups if gi[g.group] in ao.data.bones), key=lambda g: g.weight).group] for v in me.vertices]   # bones only (not cb_csmooth)
        arm_w = [sum(g.weight for g in v.groups if gi[g.group].startswith('upper_arm')) for v in me.vertices]
        posed = lambda: [v.co.copy() for v in ob.evaluated_get(bpy.context.evaluated_depsgraph_get()).data.vertices]
        inside = None
        if kw.get('mass', presets.get('zc_you')['body']['mass']) <= body.REF_MASS:
            _arm_to(ao, 0)
            P = posed()
            tf = [tuple(f.vertices) for f in me.polygons if all(dom[i] in ('pelvis', 'spine', 'chest') for i in f.vertices)]
            bvh = BVHTree.FromPolygons(P, tf)
            inside = 0
            for i, w in enumerate(arm_w):
                if w >= 0.8:
                    loc, nrm, _, _ = bvh.find_nearest(P[i], 0.2)
                    inside += loc is not None and (P[i] - loc).dot(nrm) < -0.001
            _arm_to(ao, 20)
            for s in 'LR':
                ao.pose.bones[f'forearm.{s}'].constraints['IK'].mute = False
                ao.pose.bones[f'hand.{s}'].constraints['Copy Rotation'].mute = False
                ao.pose.bones[f'upper_arm.{s}'].matrix_basis = Matrix.Identity(4)
            bpy.context.view_layer.update()
        nb = [[] for _ in me.vertices]
        for e in me.edges:
            nb[e.vertices[0]].append(e.vertices[1])
            nb[e.vertices[1]].append(e.vertices[0])
        R = [v.co.copy() for v in me.vertices]
        B = ao.data.bones
        sh = B['upper_arm.L'].head_local
        shoulder = [i for i, p in enumerate(R) if (p - sh).length < 0.11 * ao['cb_shoulder_z'] / 1.385 and p.x > 0]
        mitt = [i for i, d in enumerate(dom) if d.split('.')[0] in ('hand', 'fingers', 'fingers_tip', 'thumb') and d.endswith('.L')]
        A = poses.Actor(ao)
        A.keying = False
        L = B['upper_arm.L'].length + B['forearm.L'].length + ao['cb_palm_off']
        A.pose(1, root=(0, 0, 0), key=False, hand_l=dict(palm=tuple(sh + Vector((0.97 * L, -0.02, 0))), dir=(1, 0, 0), normal=(0, 0, -1), curl=0.7, thumb=0.6))
        k0, k1 = _umbrella(R, nb), _umbrella(posed(), nb)
        bs, bm_ = max(k1[i] - k0[i] for i in shoulder), max(k1[i] - k0[i] for i in mitt)
        print(f'  armpit {label}: arm-down upper-arm verts inside torso {inside}; arm-up shoulder bump {bs:.3f}, grip 0.7 mitten bump {bm_:.3f}')
        assert inside in (None, 0), (label, inside)
        assert bs <= SHOULDER_BUMP and bm_ <= MITTEN_BUMP, (label, bs, bm_)
