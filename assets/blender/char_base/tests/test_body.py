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
ENVELOPE_SLACK = 0.5                          # vertex distance past the graph radius, in local radii (fixed result max 0.24)


def _skin(name, kw):
    kw = dict(kw)
    bp, J = _J(**kw)
    V, E = body.body_graph(J, bp)
    me = body.skin_mesh(V, E, name)
    return bp, J, V, E, me


def _torso_roughness(me, J):
    """Second difference (mm) of the torso radius along z on a 1 cm x 7.5 deg ray grid from the spine axis, hip+3 cm to shoulder-5 cm;
    front/back sectors only (|dir.y| >= 0.6, the arms hang at the sides). Overlapping shells, ripples and steps show as large jumps."""
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
    dz = sorted(abs(a - 2 * b + c) * 1000 for r0, r1, r2 in zip(grid, grid[1:], grid[2:]) for a, b, c in zip(r0, r1, r2) if None not in (a, b, c))
    return dz[-1], dz[int(0.95 * (len(dz) - 1))]


def test_torso_smooth():
    for label, kw in SURFACE_CASES:
        _, J, _, _, me = _skin('s_' + label, kw)
        mx, p95 = _torso_roughness(me, J)
        print(f'  torso roughness {label}: max {mx:.2f} mm, p95 {p95:.2f} mm')
        assert mx <= TORSO_Z_MAX_MM and p95 <= TORSO_Z_P95_MM, (label, mx, p95)


def _envelope_excess(me, V, E):
    """Worst vertex distance beyond the skin graph's interpolated radius, in units of that radius."""
    segs = [(V[i][1], V[j][1], max(V[i][2]), max(V[j][2])) for i, j in E]
    worst = 0.0
    for v in me.vertices:
        best = 1e9
        for a, b, ra, rb in segs:
            ab = b - a
            t = max(0.0, min(1.0, (v.co - a).dot(ab) / max(ab.length_squared, 1e-12)))
            r = ra + (rb - ra) * t
            best = min(best, ((v.co - (a + ab * t)).length - r) / r)
        worst = max(worst, best)
    return worst


def test_no_stray_parts():
    for label, kw in SURFACE_CASES:
        _, _, V, E, me = _skin('n_' + label, kw)
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
        ex = _envelope_excess(me, V, E)
        print(f'  stray parts {label}: one piece {pieces_ok}, non-manifold {nm}, envelope excess {ex:.2f} radii')
        assert pieces_ok and nm == 0, (label, len(seen), nm)
        assert ex <= ENVELOPE_SLACK, (label, ex)


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
ARM_UP_STRETCH = (0.45, 3.2)      # edge length posed / rest around the shoulder at arm-up (fixed result 0.63 .. 2.79; 21f8433: 0.26 .. 10.9)


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


def test_armpit_deforms():
    """Arm down at the side: no upper-arm vertex > 1 mm inside the torso surface. Arm raised 90 deg: no torn / collapsed edges near the shoulder."""
    for label, kw in ARMPIT_CASES:
        ao = _bare('a_' + label, kw)
        ob = bpy.data.objects['a_' + label + '_body']
        gi = {g.index: g.name for g in ob.vertex_groups}
        dom = [gi[max(v.groups, key=lambda g: g.weight).group] for v in ob.data.vertices]
        posed = lambda: [v.co.copy() for v in ob.evaluated_get(bpy.context.evaluated_depsgraph_get()).data.vertices]
        _arm_to(ao, 0)
        P = posed()
        tf = [tuple(f.vertices) for f in ob.data.polygons if all(dom[i] in ('pelvis', 'spine', 'chest') for i in f.vertices)]
        bvh = BVHTree.FromPolygons(P, tf)
        inside = 0
        for i, d in enumerate(dom):
            if d.startswith('upper_arm'):
                loc, nrm, _, _ = bvh.find_nearest(P[i], 0.2)
                inside += loc is not None and (P[i] - loc).dot(nrm) < -0.001
        _arm_to(ao, 90)
        Q = posed()
        R = [v.co for v in ob.data.vertices]
        near = {i for i, d in enumerate(dom) if d.split('.')[0] in ('upper_arm', 'chest', 'clavicle', 'spine')}
        st = [(Q[a] - Q[b]).length / (R[a] - R[b]).length for a, b in (e.vertices for e in ob.data.edges) if a in near]
        print(f'  armpit {label} (height {ao["cb_height_m"]:.3f}): arm-down upper-arm verts inside torso {inside}; arm-up edge stretch {min(st):.2f} .. {max(st):.2f}')
        assert inside == 0, (label, inside)
        assert ARM_UP_STRETCH[0] <= min(st) and max(st) <= ARM_UP_STRETCH[1], (label, min(st), max(st))
