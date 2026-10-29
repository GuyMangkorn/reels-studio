"""Parametric body: parameter validation, zc-you reference joints, age/sex/stoop/stylize landmarks, surface quality, mitten hands."""
import math

import bmesh
import bpy
from mathutils import Euler, Vector
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
    me = body.body_mesh(J, bp, name)
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


ARMPIT_CASES = SURFACE_CASES + (('heavy_male', dict(mass=1.0)), ('mass_0', dict(mass=0.0)), ('mass_0.6', dict(mass=0.6)),
                                ('heavy_female', dict(sex=1.0, mass=1.0)))
ARM_SOFT_CONTACT = 0.005           # relaxed arm may press this far into the torso (soft contact)
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


def _torso_volume(kw):
    """Closed torso volume (pelvis-waist-chest-neck skin of the same body graph, floor-aligned like build.build) as a BVH."""
    kw = dict(kw)
    bp, J = _J(**kw)
    full = body.body_mesh(J, bp, 'tv_full')
    zmin = min(v.co.z for v in full.vertices)
    me = body.trunk_mesh(J, bp, 'tv')
    return BVHTree.FromPolygons([v.co - Vector((0, 0, zmin)) for v in me.vertices], [tuple(f.vertices) for f in me.polygons])


def _depth_inside(bvh, p):
    """Depth of p inside the closed volume (0 outside): ray parity along +X, distance to the nearest surface."""
    n, o = 0, p.copy()
    for _ in range(64):
        h = bvh.ray_cast(o, Vector((1, 0, 0)), 5.0)
        if h[0] is None:
            break
        n += 1
        o = h[0] + Vector((1e-5, 0, 0))
    return bvh.find_nearest(p)[3] if n % 2 else 0.0


def _umbrella(P, nb):
    """Per vertex |p - mean(neighbours)| / mean neighbour edge length: grows at bumps, kinks and creases."""
    out = []
    for i, ns in enumerate(nb):
        c = sum((P[j] for j in ns), Vector()) / len(ns)
        out.append((P[i] - c).length / (sum((P[j] - P[i]).length for j in ns) / len(ns)))
    return out


def test_armpit_deforms():
    """Relaxed arms (Actor default pose, every mass): no arm vertex (upper_arm + forearm weight >= 0.8) more than 5 mm inside the torso
    surface (soft contact allowed; heavy bodies spread their arms, poses.Actor.relaxed_spread). Arm raised to shoulder height through
    the Actor (IK + clavicle follow), grip curl 0.7: the bump metric (umbrella growth over rest) stays low on the shoulder and the mitten."""
    from char_base import poses
    for label, kw in ARMPIT_CASES:
        ao = _bare('a_' + label, kw)
        ob = bpy.data.objects['a_' + label + '_body']
        me = ob.data
        gi = {g.index: g.name for g in ob.vertex_groups}
        dom = [gi[max((g for g in v.groups if gi[g.group] in ao.data.bones), key=lambda g: g.weight).group] for v in me.vertices]   # bones only (not cb_csmooth)
        arm_w = [sum(g.weight for g in v.groups if gi[g.group].startswith(('upper_arm', 'forearm'))) for v in me.vertices]   # the whole arm
        posed = lambda: [v.co.copy() for v in ob.evaluated_get(bpy.context.evaluated_depsgraph_get()).data.vertices]
        A = poses.Actor(ao)
        A.keying = False
        A.pose(1, root=(0, 0, 0), key=False)               # relaxed arms (the default pose)
        P = posed()
        tvol = _torso_volume(kw)
        inside = sum(1 for i, w in enumerate(arm_w) if w >= 0.8 and _depth_inside(tvol, P[i]) > ARM_SOFT_CONTACT)
        nb = [[] for _ in me.vertices]
        for e in me.edges:
            nb[e.vertices[0]].append(e.vertices[1])
            nb[e.vertices[1]].append(e.vertices[0])
        R = [v.co.copy() for v in me.vertices]
        B = ao.data.bones
        sh = B['upper_arm.L'].head_local
        shoulder = [i for i, p in enumerate(R) if (p - sh).length < 0.11 * ao['cb_shoulder_z'] / 1.385 and p.x > 0]
        mitt = [i for i, d in enumerate(dom) if d.split('.')[0] in ('hand', 'fingers', 'fingers_tip', 'thumb') and d.endswith('.L')]
        L = B['upper_arm.L'].length + B['forearm.L'].length + ao['cb_palm_off']
        A.pose(1, root=(0, 0, 0), key=False, hand_l=dict(palm=tuple(sh + Vector((0.97 * L, -0.02, 0))), dir=(1, 0, 0), normal=(0, 0, -1), curl=0.7, thumb=0.6))
        k0, k1 = _umbrella(R, nb), _umbrella(posed(), nb)
        bs, bm_ = max(k1[i] - k0[i] for i in shoulder), max(k1[i] - k0[i] for i in mitt)
        print(f'  armpit {label}: relaxed arms, arm verts > 5 mm inside torso {inside}; arm-up shoulder bump {bs:.3f}, grip 0.7 mitten bump {bm_:.3f}')
        assert inside == 0, (label, inside)
        assert bs <= SHOULDER_BUMP and bm_ <= MITTEN_BUMP, (label, bs, bm_)


# ----------------------------------------------------------------------------- proportions (Task 6c)
# Reference ratios (ANSUR II 2012 US Army survey means, approximate; full list in the Task 6c report): bideltoid / hip breadth
# male ~1.47, female ~1.18; waist / hip breadth male ~0.90, female ~0.76; circumference calf / ankle ~1.7, forearm / wrist ~1.65,
# thigh / knee ~1.55, relaxed upper arm / elbow ~1.18. The smooth skin softens joints, so the bounds below sit under those values.
SEX_SH_HIP = (0.80, 1.28)    # female shoulder / hip half-width <= 0.80 x male's and <= 1.28 (reference 1.18 vs 1.47 = 0.80; the zc-based male
#                              is 1.62, so the reference female scales to 1.30; 6b head: 0.82, 1.35)
SEX_WAIST_HIP = 0.12         # female waist / hip <= male's - 0.12 (reference 0.76 vs 0.90; 6b head: -0.10)
SEX_BUST = 0.030             # female bust prominence (chest front - waist front, / body width factor) >= male's + 0.030 (6b head: +0.017)
TAPER = dict(calf_ankle=1.50, fore_wrist=1.50, thigh_knee=1.45, upper_elbow=1.12, fore_elbow=1.03)


def _mesh(kw, armless=False, name='p'):
    """(bp, J, rest skin mesh) of a body; armless drops the arm and hand nodes (front/side silhouettes of the trunk and legs)."""
    bp, J = _J(**dict(kw))
    V, E = body.body_graph(J, bp)
    if armless:
        keep = [i for i, (n, _, _) in enumerate(V) if not n.startswith(body.ARM_NODES)]
        idx = {o: k for k, o in enumerate(keep)}
        V, E = [V[i] for i in keep], [(idx[a], idx[b]) for a, b in E if a in idx and b in idx]
    me = body.skin_mesh(V, E, name)
    body.shape(me, J, bp)
    return bp, J, me


def _band(me, z, band=None):
    """Points where mesh edges cross the horizontal plane at z (the exact cross-section outline)."""
    out = []
    for e in me.edges:
        a, b = me.vertices[e.vertices[0]].co, me.vertices[e.vertices[1]].co
        if (a.z - z) * (b.z - z) < 0:
            out.append(a + (b - a) * ((z - a.z) / (b.z - a.z)))
    return out


def _zs(a, b, step=0.005):
    return [a + step * i for i in range(int((b - a) / step) + 1)]


def _sex_metrics(kw):
    """Front: shoulder half-width (deltoid, full mesh at the shoulder joint height), hip half-width (trunk + legs silhouette from the
    crotch to 10 cm above the hip joint), waist half-width (narrowest between). Side: bust = chest front - waist front."""
    bp, J, full = _mesh(kw, name='sx_full')
    _, _, me = _mesh(kw, armless=True, name='sx_trunk')
    gw = body.factors(bp)['gw']
    sw = max(abs(p.x) for p in _band(full, J['SH'].z))
    prof = lambda f, a, b: [x for x in (f(z) for z in _zs(a, b)) if x is not None]     # bands without vertices are skipped
    hx = lambda z: max((abs(p.x) for p in _band(me, z)), default=None)
    hw = max(prof(hx, J['HIP'].z - 0.12 * gw, J['HIP'].z + 0.10 * gw))
    ww = min(prof(hx, J['HIP'].z + 0.10 * gw, J['chest_n'].z - 0.04 * gw))
    front = lambda z: max((-p.y for p in _band(me, z) if abs(p.x) < 0.14 * gw), default=None)
    bust = max(prof(front, J['chest_n'].z - 0.10 * gw, J['chest_n'].z + 0.04 * gw)) - min(prof(front, J['waist_n'].z, J['chest_n'].z - 0.12 * gw))
    return dict(sh_hip=sw / hw, waist_hip=ww / hw, bust=bust / gw, sw=sw, hw=hw, ww=ww)


def test_sex_cues():
    """At mass 0 (and 0.5) a female body has narrower shoulders for its hips, a waist taper and a bust that a male body lacks."""
    for mass in (0.0, 0.5):
        m, f = _sex_metrics(dict(sex=0.0, mass=mass)), _sex_metrics(dict(sex=1.0, mass=mass))
        print(f'  sex cues mass {mass}: male ' + ', '.join(f'{k} {v:.3f}' for k, v in m.items()) +
              '; female ' + ', '.join(f'{k} {v:.3f}' for k, v in f.items()))
        assert f['sh_hip'] <= SEX_SH_HIP[0] * m['sh_hip'] and f['sh_hip'] <= SEX_SH_HIP[1], (mass, f['sh_hip'], m['sh_hip'])
        assert f['waist_hip'] <= m['waist_hip'] - SEX_WAIST_HIP, (mass, f['waist_hip'], m['waist_hip'])
        assert f['bust'] >= m['bust'] + SEX_BUST, (mass, f['bust'], m['bust'])


def _limb_r(bvh, a, b, ts, n=16):
    """Mean surface radius (m) around the bone a->b at fractions ts (rays from the axis)."""
    ax = (b - a).normalized()
    u = ax.orthogonal().normalized()
    v = ax.cross(u)
    out = []
    for t in ts:
        c = a + (b - a) * t
        rs = [h[3] for h in (bvh.ray_cast(c, u * math.cos(2 * math.pi * k / n) + v * math.sin(2 * math.pi * k / n), 0.5) for k in range(n))
              if h[0] is not None]
        out.append(sum(rs) / len(rs))
    return out


def test_limb_taper():
    """Limbs are not uniform tubes: calf over ankle, forearm belly over wrist and elbow, thigh over knee, upper arm over elbow."""
    for label, kw in (('zc_you', dict(presets.get('zc_you')['body'])), ('male_0', dict(mass=0.0)), ('female_0', dict(sex=1.0, mass=0.0)),
                      ('female_1', dict(sex=1.0, mass=1.0))):
        _, J, me = _mesh(kw, name='lt_' + label)
        bm = bmesh.new()
        bm.from_mesh(me)
        bvh = BVHTree.FromBMesh(bm)
        bm.free()
        T = lambda a, b: [a + (b - a) * i / 10 for i in range(11)]
        r = lambda j0, j1, a, b: _limb_r(bvh, J[j0], J[j1], T(a, b))
        calf, ankle = max(r('KNEE', 'ANK', 0.15, 0.45)), min(r('KNEE', 'ANK', 0.80, 0.95))
        thigh, knee = max(r('HIP', 'KNEE', 0.15, 0.50)), min(r('HIP', 'KNEE', 0.85, 1.0) + r('KNEE', 'ANK', 0.0, 0.10))
        upper, elbow = max(r('SH', 'EL', 0.30, 0.70)), min(r('SH', 'EL', 0.85, 1.0) + r('EL', 'WR', 0.0, 0.08))
        fore, wrist = max(r('EL', 'WR', 0.10, 0.40)), min(r('EL', 'WR', 0.85, 0.97))
        q = dict(calf_ankle=calf / ankle, fore_wrist=fore / wrist, thigh_knee=thigh / knee, upper_elbow=upper / elbow, fore_elbow=fore / elbow)
        print(f'  limb taper {label}: ' + ', '.join(f'{k} {v:.3f}' for k, v in q.items()))
        for k, lo in TAPER.items():
            assert q[k] >= lo, (label, k, q[k], lo)


def test_heads_tall_extreme():
    """Fewer heads tall = a younger / chibi build, not an adult column under a big head: the legs take a smaller share of the body
    below the head, the body is wider for its length, and the hanging wrist stays near the hip joint (CP-L09)."""
    rows = []
    for ht in (7.5, 6.0, 5.0, 4.0, 3.5):
        bp, J = _J(heads_tall=ht, height=1.72)
        hb = J['head_base'].z
        rows.append((ht, J['HIP'].z / hb, J['SH'].x / hb, (J['WR'].z - J['HIP'].z) / bp['height']))
        print(f'  heads_tall {ht}: leg share {rows[-1][1]:.3f}, shoulder half-width / column {rows[-1][2]:.4f}, (wrist - hip) / H {rows[-1][3]:+.3f}')
    for a, b in zip(rows, rows[1:]):
        assert b[1] <= a[1] + 1e-6 and b[2] >= a[2] - 1e-6, (a, b)
    assert rows[2][1] < rows[1][1], rows                      # 5 heads already shorter-legged than 6
    assert rows[-1][1] <= 0.85 * rows[0][1], rows
    assert rows[-1][2] >= 1.15 * rows[0][2], rows
    assert all(abs(r[3]) <= 0.05 for r in rows), rows


MASS_STEP = (0.015, 0.030, 0.004)   # per 0.1 mass: max torso_hx step, max spread step, max change of the hx step between neighbours
#                                      (6b head: a 20 mm hx step after a 3 mm one on sex 1 at 0.8 -> 0.9, so a 57 mm spread step)


def test_mass_continuous():
    """Torso half-width (cb_torso_hx) and the relaxed arm spread grow smoothly with mass for both sexes: never shrinking, no step over
    MASS_STEP, and no hx step that jumps away from its neighbour."""
    from char_base import poses
    for sx in (0.0, 1.0):
        prev, steps = None, []
        for i in range(11):
            ao = _bare(f'mc{int(sx)}_{i}', dict(sex=sx, mass=i / 10))
            cur = (ao['cb_torso_hx'], poses.Actor(ao).relaxed_spread())
            print(f'  mass continuity sex {sx} mass {i / 10:.1f}: torso_hx {cur[0]:.4f}, spread {cur[1]:.4f}')
            steps.append((cur[0] - prev[0], cur[1] - prev[1]) if prev else None)
            prev = cur
            for o in [o for o in bpy.data.objects if o.parent == ao] + [ao]:
                bpy.data.objects.remove(o, do_unlink=True)
        for i, b in enumerate(steps[1:], 1):                       # b = step into mass i/10
            assert -0.0005 <= b[0] <= MASS_STEP[0] and -0.0005 <= b[1] <= MASS_STEP[1], (sx, i, b)
            assert i == 1 or abs(b[0] - steps[i - 1][0]) <= MASS_STEP[2], (sx, i, steps[i - 1], b)
