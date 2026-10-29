"""zc-you rig: the lead of ZCONDO (a Thai man about 28, slim), full body + face, skinned to one armature.

Contract (ZC-WORLD / SCALE-ZC-R2, brief VB-ZCONDO-SHORT-R3.3 S-06):
  * metres, Z-up; armature object `zc-you` is the floor/root anchor: origin = floor between the feet, local front = -Y,
    body-left = +X. Placed in a set by setting `zc-you`.location / rotation_euler[2] only (never scale).
  * 1.72 m tall (hair top), eye centre 1.61 m (measured by `rig.measure()`).
  * Meshes: `zc-you_body` (skin modifier mesh baked, weighted to the deform bones), `zc-you_head` (skull, weighted head/jaw),
    eyes, lids, brows, nose, ears, hair. All carry an Armature modifier; no bone parenting, no object-level transforms.
  * Controls (pose bones): `ik_hand.L/R`, `ik_foot.L/R`, `pole_elbow.L/R`, `pole_knee.L/R`, `look_target`, `pelvis` (hips),
    FK `spine`, `chest`, `neck`, `head`, `clavicle.L/R`, `jaw`, `lid.L/R`, `brow.L/R`, `fingers.L/R`, `thumb.L/R`.
  * No blood on him at any time (VD-ZC-GORE: blood only on the infected, never on "you"). Day-3 variant: darker, creased/stained
    shirt (grime, not blood), messier hair, stubble.
Run from Blender: sys.path.insert(0, <this dir>); import rig; rig.build(variant='day1'|'day3').
"""
import bpy, bmesh, math, os, sys
from mathutils import Vector, Matrix, Euler
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'char_head'))
import char_head as ch      # shared illustrated head (assets/blender/char_head)

NAME = 'zc-you'
HEIGHT, EYE_Z = 1.72, 1.61
HEAD_C = Vector((0.0, 0.0, 1.595))
HEAD_R = (0.088, 0.104, 0.112)
EYE_X, EYE_Y, EYE_R = 0.0335, -0.083, 0.0172
ARM_A = math.radians(20)                 # A-pose arm angle from vertical
ARM_DIR = Vector((math.sin(ARM_A), 0.0, -math.cos(ARM_A)))

# ----------------------------------------------------------------------------- skeleton data (left side; right mirrors x)
def FDIR_S(s):
    return Vector((FDIR.x * s, FDIR.y, FDIR.z))


def mirror(v, s):
    return Vector((v.x * s, v.y, v.z))

SH = Vector((0.195, 0.0, 1.385))
EL = SH + ARM_DIR * 0.29 + Vector((0.0, 0.014, 0.0))        # relaxed elbow: 3 deg bend (a dead-straight chain is an IK singularity)
FDIR = (ARM_DIR + Vector((0.0, -0.13, 0.0))).normalized()
WR = EL + FDIR * 0.26
PALM = WR + FDIR * 0.045
KNU = PALM + FDIR * 0.045
TIP = KNU + FDIR * 0.078
FMID = KNU + FDIR * 0.040
TH0 = PALM + Vector((-0.010, -0.022, 0.005))
TH1 = TH0 + Vector((-0.006, -0.032, -0.024))
HIP = Vector((0.085, 0.0, 0.925))
KNEE = Vector((0.085, -0.005, 0.480))
ANK = Vector((0.085, 0.0, 0.085))
HEEL = Vector((0.085, 0.048, 0.042))
BALL = Vector((0.085, -0.115, 0.035))
TOE = Vector((0.085, -0.178, 0.026))

# (name, head, tail, parent, deform)
def bone_table():
    B = [
        ('root', Vector((0, 0, 0)), Vector((0, 0, 0.12)), None, False),
        ('pelvis', Vector((0, 0, 0.93)), Vector((0, 0, 1.05)), 'root', True),
        ('spine', Vector((0, 0, 1.05)), Vector((0, 0, 1.22)), 'pelvis', True),
        ('chest', Vector((0, 0, 1.22)), Vector((0, 0, 1.40)), 'spine', True),
        ('neck', Vector((0, 0, 1.40)), Vector((0, 0, 1.50)), 'chest', True),
        ('head', Vector((0, 0, 1.50)), Vector((0, 0, 1.72)), 'neck', True),
        ('look_target', Vector((0, -1.0, EYE_Z)), Vector((0, -1.0, EYE_Z + 0.05)), 'root', False),
    ]
    B += ch.face_bones(HEAD_C, zc_params(), 1.0)
    for s, n in ((1, 'L'), (-1, 'R')):
        B += [
            (f'clavicle.{n}', Vector((0.03 * s, 0, 1.385)), mirror(SH, s), 'chest', True),
            (f'upper_arm.{n}', mirror(SH, s), mirror(EL, s), f'clavicle.{n}', True),
            (f'forearm.{n}', mirror(EL, s), mirror(WR, s), f'upper_arm.{n}', True),
            (f'hand.{n}', mirror(WR, s), mirror(KNU, s), f'forearm.{n}', True),
            (f'fingers.{n}', mirror(KNU, s), mirror(FMID, s), f'hand.{n}', True),
            (f'fingers_tip.{n}', mirror(FMID, s), mirror(TIP, s), f'fingers.{n}', True),
            (f'thumb.{n}', mirror(TH0, s), mirror(TH1, s), f'hand.{n}', True),
            (f'thigh.{n}', mirror(HIP, s), mirror(KNEE, s), 'pelvis', True),
            (f'shin.{n}', mirror(KNEE, s), mirror(ANK, s), f'thigh.{n}', True),
            (f'foot.{n}', mirror(ANK, s), mirror(BALL, s), f'shin.{n}', True),
            (f'toe.{n}', mirror(BALL, s), mirror(TOE, s), f'foot.{n}', True),
            # controls (no deform); rest orientation == the bone they drive, so zero rotation = rest pose
            (f'ik_hand.{n}', mirror(WR, s), mirror(KNU, s), 'root', False),
            (f'ik_foot.{n}', mirror(ANK, s), mirror(BALL, s), 'root', False),
            (f'pole_elbow.{n}', Vector((0.40 * s, 0.50, 1.10)), Vector((0.40 * s, 0.55, 1.10)), 'root', False),
            (f'pole_knee.{n}', Vector((0.12 * s, -0.80, 0.50)), Vector((0.12 * s, -0.85, 0.50)), 'root', False),
        ]
    return B


# ----------------------------------------------------------------------------- body skin graph (verts, edges)
def body_graph():
    V = []   # (name, pos, (rx, ry))
    E = []
    def v(name, pos, r):
        V.append((name, Vector(pos), r))
        return len(V) - 1
    pel = v('pelvis', (0, 0, 0.93), (0.152, 0.104))
    wai = v('waist', (0, 0, 1.07), (0.128, 0.090))
    che = v('chest', (0, 0, 1.25), (0.158, 0.108))
    n0 = v('neck0', (0, 0.002, 1.40), (0.062, 0.062))
    n1 = v('neck1', (0, -0.012, 1.53), (0.047, 0.047))
    E += [(pel, wai), (wai, che), (che, n0), (n0, n1)]
    for s, n in ((1, 'L'), (-1, 'R')):
        sh = v(f'sh.{n}', mirror(SH, s), (0.060, 0.060))
        el = v(f'el.{n}', mirror(EL, s), (0.046, 0.046))
        wr = v(f'wr.{n}', mirror(WR, s), (0.033, 0.033))
        pa = v(f'palm.{n}', mirror(PALM, s), (0.036, 0.020))
        kn = v(f'knu.{n}', mirror(KNU, s), (0.034, 0.014))
        t0 = v(f'th0.{n}', mirror(TH0, s), (0.014, 0.014))
        t1 = v(f'th1.{n}', mirror(TH1, s), (0.011, 0.011))
        E += [(che, sh), (n0, sh), (sh, el), (el, wr), (wr, pa), (pa, kn), (pa, t0), (t0, t1)]
        # four fingers: knuckle row across the hand (Y), 2 segments each, slight splay; lengths index..pinky
        for fi, (fy, l1, l2, spl) in enumerate(((-0.026, 0.044, 0.040, -0.10), (-0.009, 0.047, 0.043, -0.02),
                                                 (0.009, 0.044, 0.040, 0.04), (0.025, 0.036, 0.033, 0.12))):
            fb = mirror(KNU, s) + Vector((0, fy, 0))
            fm = fb + (FDIR_S(s) + Vector((0, spl, 0))).normalized() * l1
            ft = fm + (FDIR_S(s) + Vector((0, spl * 1.5, 0))).normalized() * l2
            a_ = v(f'fb{fi}.{n}', fb, (0.0095, 0.0095))
            b_ = v(f'fm{fi}.{n}', fm, (0.0085, 0.0085))
            c_ = v(f'ft{fi}.{n}', ft, (0.0070, 0.0070))
            E += [(kn, a_), (a_, b_), (b_, c_)]
        hp = v(f'hip.{n}', mirror(HIP, s), (0.078, 0.078))
        kneev = v(f'knee.{n}', mirror(KNEE, s), (0.058, 0.058))
        an = v(f'ank.{n}', mirror(ANK, s), (0.038, 0.038))
        he = v(f'heel.{n}', mirror(HEEL, s), (0.034, 0.034))
        ba = v(f'ball.{n}', mirror(BALL, s), (0.041, 0.028))
        to = v(f'toe.{n}', mirror(TOE, s), (0.034, 0.021))
        th_m = v(f'thm.{n}', mirror((HIP + KNEE) / 2, s), (0.074, 0.074))
        ca = v(f'calf.{n}', mirror(KNEE + (ANK - KNEE) * 0.30, s) + Vector((0, 0.012, 0)), (0.052, 0.054))
        E += [(pel, hp), (hp, th_m), (th_m, kneev), (kneev, ca), (ca, an), (an, he), (an, ba), (ba, to)]
    return V, E


# ----------------------------------------------------------------------------- materials
def _mat(name, color, rough=0.6):
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Roughness'].default_value = rough
    return m


def srgb(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)


def _cornea():
    m = bpy.data.materials.get('zc_you_cornea')
    if m:
        return m
    m = bpy.data.materials.new('zc_you_cornea')
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    tr = nt.nodes.new('ShaderNodeBsdfTransparent')
    gl = nt.nodes.new('ShaderNodeBsdfGlossy')
    gl.inputs['Roughness'].default_value = 0.10
    mx = nt.nodes.new('ShaderNodeMixShader')
    mx.inputs[0].default_value = 0.05
    nt.links.new(tr.outputs[0], mx.inputs[1])
    nt.links.new(gl.outputs[0], mx.inputs[2])
    nt.links.new(mx.outputs[0], out.inputs[0])
    return m


def _cloth_bump(m, scale, strength):
    nt = m.node_tree
    if nt.nodes.get('zc_bump'):
        return
    bsdf = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord')
    mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = (scale, scale, scale * 0.35)
    nz = nt.nodes.new('ShaderNodeTexNoise')
    nz.inputs['Scale'].default_value = 1.0
    nz.inputs['Detail'].default_value = 6.0
    bp = nt.nodes.new('ShaderNodeBump')
    bp.name = 'zc_bump'
    bp.inputs['Strength'].default_value = strength
    bp.inputs['Distance'].default_value = 0.004
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector'])
    nt.links.new(mp.outputs['Vector'], nz.inputs['Vector'])
    nt.links.new(nz.outputs['Fac'], bp.inputs['Height'])
    nt.links.new(bp.outputs['Normal'], bsdf.inputs['Normal'])


def _skin_sss(m, weight=0.12):
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Subsurface Weight'].default_value = weight
    b.inputs['Subsurface Radius'].default_value = (1.0, 0.35, 0.2)
    b.inputs['Subsurface Scale'].default_value = 0.006
    b.inputs['Specular IOR Level'].default_value = 0.45


toon = ch.toon


def M_head(M):
    """Head materials dict for char_head.build_head (the head skin keeps the stubble material)."""
    d = dict(M)
    d['skin'] = M['skin_head']
    return d


def zc_params(variant='day1'):
    """char_head parameters of the lead (defaults of the shared head = zc-you); day-3: stubble, messier hair, slightly darker skin."""
    p = ch.params(stubble=0.55, hair_messy=1.0, skin='#b08462') if variant == 'day3' else ch.params()
    return ch.style(os.environ.get('ZC_HEAD_STYLE', 'v1'), p, eye=os.environ.get('ZC_EYE', 'almond'), lids=os.environ.get('ZC_LIDS', 'line'), brow=os.environ.get('ZC_BROW', 'straight_soft'))       # head style v1 (default) | v2 (round, cut-out hair, no visible lids)


def make_materials(variant):
    """Body materials (tee, shorts, body skin, nails) + the shared head materials (char_head, prefix zc_you[_d3])."""
    d3 = variant == 'day3'
    zp = zc_params(variant)
    M = ch.make_materials(zp, 'zc_you' + ('_d3' if d3 else ''), HEAD_C)
    M['skin_head'] = M['skin']
    M['skin'] = _mat('zc_you_body_skin' + ('_d3' if d3 else ''), srgb(zp['skin']), 0.8)
    M['tee'] = _mat('zc_you_tee' + ('_d3' if d3 else ''), srgb('#27474a' if d3 else '#2f5656'), 0.85)
    M['shorts'] = _mat('zc_you_shorts', srgb('#7c7f80'), 0.85)
    M['nail'] = _mat('zc_you_nail', srgb('#cfa58a'), 0.8)
    if d3:
        _grime(M['tee'])                       # shirt grime/sweat patches, not blood (VD-ZC-GORE)
    for k in ('skin', 'tee', 'shorts', 'nail'):
        toon(M[k])
    return M


def _grime(m):
    nt = m.node_tree
    if nt.nodes.get('zc_grime'):
        return
    bsdf = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord')
    nz = nt.nodes.new('ShaderNodeTexNoise')
    nz.inputs['Scale'].default_value = 7.0
    nz.inputs['Detail'].default_value = 4.0
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].position = 0.42
    ramp.color_ramp.elements[1].position = 0.62
    mix = nt.nodes.new('ShaderNodeMix')
    mix.data_type = 'RGBA'
    mix.name = 'zc_grime'
    mix.inputs[6].default_value = bsdf.inputs['Base Color'].default_value
    mix.inputs[7].default_value = (*srgb('#1a2b2a'), 1)     # darker sweat/grime patches
    nt.links.new(tc.outputs['Object'], nz.inputs['Vector'])
    nt.links.new(nz.outputs['Fac'], ramp.inputs['Fac'])
    nt.links.new(ramp.outputs['Color'], mix.inputs['Factor'])
    nt.links.new(mix.outputs[2], bsdf.inputs['Base Color'])


# ----------------------------------------------------------------------------- mesh helpers
def _link(o, coll=None):
    (coll or bpy.context.scene.collection).objects.link(o)


def _skin_body():
    """Skin-modifier mesh from body_graph(), baked to a plain mesh in rest pose."""
    V, E = body_graph()
    me = bpy.data.meshes.new('zc-you_body_skin')
    me.from_pydata([tuple(p) for _, p, _ in V], E, [])
    ob = bpy.data.objects.new('zc-you_body_skin', me)
    _link(ob)
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
    dg = bpy.context.evaluated_depsgraph_get()
    new = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    bpy.data.objects.remove(ob, do_unlink=True)
    bpy.data.meshes.remove(me)
    return new


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
    # extra smoothing neighbours: chest~clavicle~upper_arm, pelvis~spine~chest, hand~fingers~thumb
    for s in 'LR':
        nb['chest'].add(f'upper_arm.{s}')
        nb[f'upper_arm.{s}'].add('chest')
    return nb


BLEND = {'pelvis': 0.07, 'spine': 0.08, 'chest': 0.08, 'neck': 0.04, 'clavicle': 0.05, 'upper_arm': 0.05, 'forearm': 0.05,
         'hand': 0.03, 'fingers': 0.02, 'fingers_tip': 0.015, 'thumb': 0.02, 'thigh': 0.06, 'shin': 0.05, 'foot': 0.035, 'toe': 0.03}


def _weights(points, bones, only=None):
    """Per point: {bone: weight}. Nearest deform bone plus its neighbours, linear falloff by extra distance."""
    deform = [b for b in bones if b[4] and b[0] in BODY_BONES]
    nb = _neighbours(bones)
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
            bl = BLEND[n.split('.')[0]]
            wv = max(0.0, 1.0 - (ds[n] - ds[best]) / bl)
            if wv > 0:
                w[n] = wv
        tot = sum(w.values())
        top = sorted(w.items(), key=lambda kv: -kv[1])[:4]
        tot = sum(v for _, v in top)
        out.append({k: v / tot for k, v in top})
    return out


BODY_BONES = {'pelvis', 'spine', 'chest', 'neck'} | {f'{b}.{s}' for s in 'LR' for b in
              ('clavicle', 'upper_arm', 'forearm', 'hand', 'fingers', 'fingers_tip', 'thumb', 'thigh', 'shin', 'foot', 'toe')}


def _tube(name, pts, radii, mat, seg=6, cap=True):
    """Tapered tube along polyline pts (Vector list) with per-point radii; returns an object (not yet bound)."""
    bm = bmesh.new()
    rings = []
    n = len(pts)
    for i, p in enumerate(pts):
        t = (pts[min(i + 1, n - 1)] - pts[max(i - 1, 0)]).normalized()
        ref = Vector((0, 0, 1)) if abs(t.z) < 0.9 else Vector((1, 0, 0))
        u = t.cross(ref).normalized()
        w = t.cross(u).normalized()
        ring = []
        for k in range(seg):
            a = 2 * math.pi * k / seg
            ring.append(bm.verts.new(p + (u * math.cos(a) + w * math.sin(a)) * radii[i]))
        rings.append(ring)
    for i in range(n - 1):
        for k in range(seg):
            bm.faces.new((rings[i][k], rings[i][(k + 1) % seg], rings[i + 1][(k + 1) % seg], rings[i + 1][k]))
    if cap:
        bm.faces.new(rings[0][::-1])
        bm.faces.new(rings[-1])
    bm.normal_update()
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for pg in me.polygons:
        pg.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    ob.data.materials.append(mat)
    _link(ob)
    return ob


def _bez(p0, p1, p2, n):
    return [p0 * (1 - t) ** 2 + p1 * 2 * t * (1 - t) + p2 * t * t for t in [i / (n - 1) for i in range(n)]]


def _torus(name, c, R, r, mat, scale=(1, 1, 1), rot=(0, 0, 0), maj=32, mnr=8):
    bm = bmesh.new()
    bmesh.ops.create_circle(bm, segments=maj, radius=R)       # placeholder to keep API; replaced below
    bm.clear()
    verts = []
    for i in range(maj):
        a = 2 * math.pi * i / maj
        ctr = Vector((math.cos(a) * R, math.sin(a) * R, 0))
        radial = Vector((math.cos(a), math.sin(a), 0))
        ring = []
        for k in range(mnr):
            b = 2 * math.pi * k / mnr
            ring.append(bm.verts.new(ctr + radial * (r * math.cos(b)) + Vector((0, 0, r * math.sin(b)))))
        verts.append(ring)
    for i in range(maj):
        for k in range(mnr):
            bm.faces.new((verts[i][k], verts[i][(k + 1) % mnr], verts[(i + 1) % maj][(k + 1) % mnr], verts[(i + 1) % maj][k]))
    M = Matrix.Translation(c) @ Euler(rot).to_matrix().to_4x4() @ Matrix.Diagonal((*scale, 1.0))
    bmesh.ops.transform(bm, matrix=M, verts=bm.verts)
    bm.normal_update()
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for pg in me.polygons:
        pg.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    ob.data.materials.append(mat)
    _link(ob)
    return ob


def _ellipsoid(name, c, r, mat, bone, rot=(0, 0, 0), seg=24, rings=14):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=rings, radius=1.0)
    M = Matrix.Translation(c) @ Euler(rot).to_matrix().to_4x4() @ Matrix.Diagonal((*r, 1.0))
    bmesh.ops.transform(bm, matrix=M, verts=bm.verts)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    ob.data.materials.append(mat)
    _link(ob)
    return ob


# ----------------------------------------------------------------------------- build
def _armature():
    arm = bpy.data.armatures.new(NAME)
    ao = bpy.data.objects.new(NAME, arm)
    _link(ao)
    bpy.context.view_layer.objects.active = ao
    ao.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    eb = arm.edit_bones
    table = bone_table()
    for n, h, t, par, dfm in table:
        b = eb.new(n)
        b.head, b.tail = h, t
        b.use_deform = dfm
    for n, h, t, par, dfm in table:
        if par:
            eb[n].parent = eb[par]
    # eye and brow: no connect; roll 0
    bpy.ops.object.mode_set(mode='OBJECT')
    arm.display_type = 'STICK'
    return ao, table


def _vg_bind(ob, ao, weights_by_vertex):
    """weights_by_vertex: list (per vertex) of {bone: w}."""
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


def _rigid(ob, ao, bone):
    n = len(ob.data.vertices)
    _vg_bind(ob, ao, [{bone: 1.0}] * n)


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


def calibrate_poles(ao):
    """Pick the IK pole angle per limb so the elbow/knee bends toward its pole bone (bone roll conventions differ per side)."""
    saved = {pb.name: (pb.location.copy(), pb.rotation_quaternion.copy()) for pb in ao.pose.bones if pb.name.startswith(('ik_', 'pole_'))}
    for s, sg in (('L', 1), ('R', -1)):
        for limb, tip, mid, ctrl, pole, tgt, pol in (
                ('forearm', 'upper_arm', 'upper_arm', f'ik_hand.{s}', f'pole_elbow.{s}', (0.25 * sg, -0.40, 1.2), (0.40 * sg, 0.50, 1.10)),
                ('shin', 'thigh', 'thigh', f'ik_foot.{s}', f'pole_knee.{s}', (0.085 * sg, -0.30, 0.35), (0.12 * sg, -0.80, 0.50))):
            _ctrl(ao, ctrl, tgt)
            _ctrl(ao, pole, pol)
            con = ao.pose.bones[f'{limb}.{s}'].constraints['IK']
            best = None
            for a in (0, 90, -90, 180):
                con.pole_angle = math.radians(a)
                bpy.context.view_layer.update()
                d = (ao.matrix_world @ ao.pose.bones[f'{mid}.{s}'].tail - Vector(pol)).length
                if best is None or d < best[0]:
                    best = (d, a)
            con.pole_angle = math.radians(best[1])
    for n, (loc, q) in saved.items():
        pb = ao.pose.bones[n]
        pb.location, pb.rotation_quaternion = loc, q
    bpy.context.view_layer.update()


def detail_body(ao, M, variant):
    """Garment geometry (collar rib, sleeve hems, shirt hem, shorts waistband/hems), toes/nails, procedural folds."""
    d3 = variant == 'day3'
    tee, sh, sk = M['tee'], M['shorts'], M['skin']
    body = bpy.data.objects['zc-you_body']
    bv = [v.co.copy() for v in body.data.vertices]

    def fit_h(z, xsign=0, band=0.004, xr=None):
        pts = []
        while len(pts) < 8:
            pts = [p for p in bv if abs(p.z - z) < band and (xsign == 0 and abs(p.x) < 0.21 or xsign != 0 and 0.02 < p.x * xsign < 0.17)]
            band *= 1.5
        cx = sum(p.x for p in pts) / len(pts)
        cy = sum(p.y for p in pts) / len(pts)
        return cx, cy, max(abs(p.x - cx) for p in pts), max(abs(p.y - cy) for p in pts)
    cx, cy, rx_, ry_ = fit_h(1.430)
    col = _torus('zc-you_collar', Vector((cx, cy, 1.430)), 1.0, 0.0072, tee, scale=(rx_ + 0.003, ry_ + 0.003, 1.0))
    _rigid(col, ao, 'neck')
    cx, cy, rx_, ry_ = fit_h(0.920)
    hem = _torus('zc-you_shirt_hem', Vector((cx, cy, 0.920)), 1.0, 0.0065, tee, scale=(rx_ + 0.002, ry_ + 0.002, 1.0))
    _rigid(hem, ao, 'spine')
    cx, cy, rx_, ry_ = fit_h(0.935)
    wb = _torus('zc-you_shorts_band', Vector((cx, cy, 0.935)), 1.0, 0.0085, sh, scale=(rx_ + 0.001, ry_ + 0.001, 1.0))
    _rigid(wb, ao, 'pelvis')
    for s_, n in ((1, 'L'), (-1, 'R')):
        z_ax = Vector((ARM_DIR.x * s_, ARM_DIR.y, ARM_DIR.z)).normalized()
        sleeve_c = mirror(SH, s_) + z_ax * 0.155
        bnd = 0.004
        near = []
        while len(near) < 8:
            near = [p for p in bv if abs((p - sleeve_c).dot(z_ax)) < bnd and (p - sleeve_c).length < 0.09 and p.x * s_ > 0.1]
            bnd *= 1.5
        cc = sum(near, Vector()) / len(near)
        rr_ = max((p - cc).length for p in near)
        q = Vector((0, 0, 1)).rotation_difference(z_ax).to_euler()
        slv = _torus(f'zc-you_sleeve_hem.{n}', cc, rr_ + 0.002, 0.0058, tee, rot=tuple(q))
        _rigid(slv, ao, f'upper_arm.{n}')
        cx, cy, rx_, ry_ = fit_h(0.600, s_)
        hemL = _torus(f'zc-you_shorts_hem.{n}', Vector((cx, cy, 0.600)), 1.0, 0.0060, sh, scale=(rx_ + 0.002, ry_ + 0.002, 1.0))
        _rigid(hemL, ao, f'thigh.{n}')
        # toes (big toe medial) + nails
        for i, (dx, ln, rr) in enumerate(((-0.027, 0.020, 0.0105), (-0.012, 0.016, 0.0072), (0.001, 0.0145, 0.0068), (0.013, 0.0125, 0.0064), (0.024, 0.0105, 0.0060))):
            xt = 0.085 + s_ * dx
            toe = _ellipsoid(f'zc-you_toe{i}.{n}', Vector((xt, -0.184 - ln * 0.35, 0.0155 + rr * 0.35)), (rr, ln * 0.5 + 0.005, rr * 0.85), sk, f'toe.{n}', seg=12, rings=8)
            _rigid(toe, ao, f'toe.{n}')
            nail = _ellipsoid(f'zc-you_toenail{i}.{n}', Vector((xt, -0.184 - ln * 0.50, 0.0155 + rr * 1.05)), (rr * 0.58, ln * 0.28, rr * 0.18), M['nail'], f'toe.{n}', seg=10, rings=6)
            _rigid(nail, ao, f'toe.{n}')
        # fingernails on the four fingertips + thumb
        for fi, spl in enumerate((-0.10, -0.02, 0.04, 0.12)):
            fy = (-0.026, -0.009, 0.009, 0.025)[fi]
            l1, l2 = ((0.044, 0.040), (0.047, 0.043), (0.044, 0.040), (0.036, 0.033))[fi]
            fb = mirror(KNU, s_) + Vector((0, fy, 0))
            fm = fb + (FDIR_S(s_) + Vector((0, spl, 0))).normalized() * l1
            ft = fm + (FDIR_S(s_) + Vector((0, spl * 1.5, 0))).normalized() * l2
            fd = (ft - fm).normalized()
            nail = _ellipsoid(f'zc-you_nail{fi}.{n}', ft - fd * 0.007 + Vector((-s_ * 0.0062, 0, 0)), (0.0022, 0.0042, 0.0055), M['nail'], f'fingers_tip.{n}', seg=10, rings=6)
            nail.rotation_mode = 'QUATERNION'
            _rigid(nail, ao, f'fingers_tip.{n}')
    # procedural folds baked into the rest geometry of the garments (static mesh detail; deforms with the weights)
    me = body.data
    from mathutils import noise
    amp = 0.0042 if d3 else 0.0026
    me.calc_normals_split() if hasattr(me, 'calc_normals_split') else None
    for pg in me.polygons:
        if pg.material_index in (1, 2):
            for vi in pg.vertices:
                v = me.vertices[vi]
                p = v.co
                n = Vector(v.normal)
                fold = noise.noise(Vector((p.x * 16, p.y * 16, p.z * 6))) * 0.6 + 0.4 * math.sin(p.z * 70 + p.x * 9)
                if p.z > 0.92 and p.z < 1.18:
                    fold += 0.9 * math.sin(p.z * 95 + 2.0 * p.x) * math.exp(-((p.z - 1.05) / 0.07) ** 2)   # waist drape
                v.co = p + n * fold * amp * (0.35 if pg.material_index == 2 else 1.0)
    me.update()


def build(variant='day1', collection=None):
    """Create the rigged zc-you in the current scene; returns the armature object `zc-you`."""
    M = make_materials(variant)
    ao, table = _armature()
    # ---- body
    me = _skin_body()
    # normalise: bake offset so the lowest vertex is at z = 0 (skin radius/subsurf shrink): measured, then fixed
    zmin = min(v.co.z for v in me.vertices)
    print('ZC-YOU body zmin', round(zmin, 4), 'zmax', round(max(v.co.z for v in me.vertices), 4))
    for v in me.vertices:
        v.co.z -= zmin
    # cut edge loops where the garments end so the material borders are clean lines (neckline, hems, sleeves)
    bm = bmesh.new()
    bm.from_mesh(me)
    planes = [((0, 0, 1.430), (0, 0, 1)), ((0, 0, 0.920), (0, 0, 1)), ((0, 0, 0.600), (0, 0, 1))]
    for sg in (1, -1):
        ax = Vector((ARM_DIR.x * sg, ARM_DIR.y, ARM_DIR.z)).normalized()
        planes.append((tuple(mirror(SH, sg) + ax * 0.155), tuple(ax)))
    for co, no in planes:
        bmesh.ops.bisect_plane(bm, geom=list(bm.verts) + list(bm.edges) + list(bm.faces), plane_co=Vector(co), plane_no=Vector(no))
    bm.to_mesh(me)
    bm.free()
    w = _weights([v.co for v in me.vertices], table)
    body = bpy.data.objects.new('zc-you_body', me)
    _link(body)
    for mk in ('skin', 'tee', 'shorts'):
        me.materials.append(M[mk])
    for pg in me.polygons:
        c = Vector((0, 0, 0))
        for vi in pg.vertices:
            c += me.vertices[vi].co
        c /= len(pg.vertices)
        wsum = {}
        for vi in pg.vertices:
            for k, v in w[vi].items():
                wsum[k] = wsum.get(k, 0) + v
        dom = max(wsum, key=wsum.get).split('.')[0]
        mat = 0
        ax = abs(c.x)
        if dom in ('pelvis', 'spine', 'chest', 'clavicle'):
            mat = 2 if c.z < 0.92 else 1
            if c.z > 1.430:
                mat = 0                              # collar: neck skin
        elif dom == 'neck':
            mat = 0 if c.z > 1.430 else 1
        elif dom == 'upper_arm':
            sg_ = 1 if c.x >= 0 else -1
            mat = 1 if (c - mirror(SH, sg_)).dot(Vector((ARM_DIR.x * sg_, ARM_DIR.y, ARM_DIR.z)).normalized()) < 0.155 else 0
        elif dom == 'thigh':
            mat = (1 if c.z >= 0.92 else 2) if c.z > 0.60 else 0
        pg.material_index = mat
        pg.use_smooth = True
    _vg_bind(body, ao, w)
    # ---- head: the shared illustrated head (assets/blender/char_head), parameters = the lead's
    ch.build_head(ao, HEAD_C, zc_params(variant), 'zc-you', 1.0, M_head(M))
    detail_body(ao, M, variant)
    add_ik(ao)
    calibrate_poles(ao)
    ao['zc_variant'] = variant
    ao['zc_height_m'] = HEIGHT
    for ob in bpy.data.objects:
        if ob.name.startswith('zc-you_') and ob.type == 'MESH':
            ob.visible_shadow = True
    return ao


# ----------------------------------------------------------------------------- rest measurement
def rest_bounds(ao):
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    mn = Vector((1e9,) * 3)
    mx = Vector((-1e9,) * 3)
    for o in bpy.data.objects:
        if o.type == 'MESH' and o.parent == ao:
            oe = o.evaluated_get(dg)
            for v in oe.data.vertices:
                p = oe.matrix_world @ v.co
                mn = Vector((min(mn.x, p.x), min(mn.y, p.y), min(mn.z, p.z)))
                mx = Vector((max(mx.x, p.x), max(mx.y, p.y), max(mx.z, p.z)))
    return mn, mx
