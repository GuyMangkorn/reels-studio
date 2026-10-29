"""char_head: reusable illustrated character head (shared library module, project-independent).

One sculpted oval head + recessed eye sockets, shell-lidded eyes, brows, mouth line, ears, a low nose cue and a one-piece cut-out hair sheet,
all weighted to a small set of face bones, with cel-shaded materials and a parameter dict. Consumers (e.g. assets/blender/zc-you/rig.py)
pick parameters; nothing here knows a project. One look only (the former "v2"; v1 / v3 were removed on 29 Oct 2026, see
scripts/zombie-condo/build-notes.md for the commits that still have them).

Conventions: metres, Z-up, head-local frame = head centre at the origin, face toward -Y, +X = the character's left.
`origin` places the head in the consumer's armature space, `scale` scales every dimension (1.0 = adult head about 0.22 m high).

Public API
  PARAMS            default parameter dict (documented below)
  params(eye=None, brow=None, **overrides)   merged copy; eye = EYE_SHAPES key, brow = BROW_SHAPES key, keywords win
  EYE_SHAPES, LID_MODES, BROW_SHAPES   named eye-opening / lid / brow parameter sets
  FACE_PRESETS      the expression presets (neutral, tired, startle, fear, focused, listening, frozen)
  face_bones(origin, p, scale)   [(name, head, tail, parent, deform)] for jaw, eye.L/R, lid.L/R, brow.L/R (parent = 'head')
  make_materials(p, prefix, origin, look)   toon-shaded material dict for the face and hair; look 'cel' only (anything else: ValueError)
  head_metrics(p, scale)   dict(height chin-to-hair-top, eye_dz / eye_dy eye centre offset from the head centre, neck socket point), head-local, analytic
  build_head(ao, origin, p, prefix, scale, mats)   build the meshes and bind them to the bones of armature object `ao`
  add_standalone_armature(p, name)  a tiny armature (head + face bones) so a head can be used without a body
  apply_face(pose_bones, preset, blink, **override)   set jaw/lids/brows/eye squash on pose bones
  toon(material)                 Shader-to-RGB banding used for all cel materials
Parameters (all metres unless noted; the defaults are the `zc-you` lead)
  head=(rx, ry, rz) skull radii; oval (True = plain ellipsoid skull, no chin/lip/cheek sculpt); jaw_taper 0..0.5, chin, cheek (used when oval is False)
  socket, brow_ridge (depth multipliers of the orbit dip and the brow ridge)
  eye_x (half spacing), eye_z (height above the head centre), eye_y (depth), eye_r (radius), iris (iris diameter / eye diameter)
  eye opening (degrees on the eyeball): eye_w half width, eye_up / eye_down above / below the centre line, eye_k / eye_m corner and fullness exponents
    of h(x) = (1 - |x|^k)^m, eye_tilt (outer corner up), eye_wing (lid line thicker toward the outer corner); lid_mode in LID_MODES
  brow_z, brow_thick, brow_arch, brow_taper, brow_tilt (deg, < 0 = inner end lower), brow_x0 / brow_x1 (inner / outer end x), brow_len
  nose_len, nose_w, nose_bridge (multipliers of the sculpted nose); mouth_z, mouth_w, mouth_curve (corner lift, + = slight smile), lip_full
  ear (scale), ear_tilt (deg, top leans back from vertical), ear_flare (deg, top stands out from the skull), ear_turn (deg, face of the ear turns forward),
  ear_z / ear_y (centre height / depth; ear spans roughly brow line to nose base)
  skin (hex), stubble (0..1), lip, hair, brow_color, iris_color (hex)
  hair_style 'cutout' | 'side_sweep' | 'short_crop' | 'bowl' | 'bob' (chin-length sheet) | 'ponytail' (cutout cap + tapered tail tube) (hairline of the one-piece hair sheet); hair_volume (0.8..1.4); sideburn (0/1)
Runtime shape keys on the head mesh (value 0 = parameters as built; slider -1..1.5): nose_size, nose_width, jaw_width, chin, cheek_full.
"""
import bpy, bmesh, math
from mathutils import Vector, Matrix, Euler

# eye opening sets (see the parameter notes above); 'round' is the default (user's pick, 29 Oct 2026)
EYE_SHAPES = {
    'round': dict(eye_w=50, eye_up=34, eye_down=32, eye_k=2.0, eye_m=0.5, eye_tilt=0, eye_wing=0.0, iris=0.78),
    'oval': dict(eye_w=58, eye_up=26, eye_down=22, eye_k=2.0, eye_m=0.5, eye_tilt=0, eye_wing=0.0, iris=0.72),
    'almond': dict(eye_w=62, eye_up=26, eye_down=17, eye_k=1.7, eye_m=0.8, eye_tilt=2, eye_wing=0.3, iris=0.70),
    'cat': dict(eye_w=64, eye_up=27, eye_down=14, eye_k=1.5, eye_m=0.9, eye_tilt=8, eye_wing=0.9, iris=0.68),
}
LID_MODES = ('none', 'line', 'lid')     # none: skin edge only; line: thin dark lid line; lid: thick lid line + a faint crease above it
BROW_SHAPES = {
    'straight_soft': dict(brow_arch=0.0008, brow_thick=1.0, brow_taper=0.35, brow_tilt=0.0, brow_len=1.0, brow_x0=0.012, brow_x1=0.060),   # default; tail trimmed 14 %
    'gentle_arch': dict(brow_arch=0.0050, brow_thick=0.95, brow_taper=0.5, brow_tilt=2.0, brow_len=1.0, brow_x0=0.012, brow_x1=0.068),
    'angled_taper': dict(brow_arch=0.0015, brow_thick=1.1, brow_taper=0.8, brow_tilt=-9.0, brow_len=1.05, brow_x0=0.012, brow_x1=0.068),   # tilt < 0: inner end lower
}
PARAMS = dict(
    head=(0.097, 0.104, 0.112), oval=True, jaw_taper=0.0, chin=0.0, cheek=0.0, socket=2.4, brow_ridge=1.1,
    eye_x=0.0365, eye_z=0.012, eye_y=-0.0725, eye_r=0.0240, eye_shape='round', lid_mode='line', **EYE_SHAPES['round'],
    brow_z=0.041, brow_shape='straight_soft', **BROW_SHAPES['straight_soft'],
    nose_len=0.1, nose_w=1.3, nose_bridge=0.15, mouth_z=-0.060, mouth_w=0.016, mouth_curve=0.0022, lip_full=0.3,
    ear=1.0, ear_tilt=12.0, ear_flare=12.0, ear_turn=20.0, ear_z=0.004, ear_y=0.008,
    skin='#b98a6a', stubble=0.0, lip='#a8655a', hair='#17151a', brow_color='#16110e', iris_color='#6a4326',
    hair_style='cutout', hair_volume=1.0, sideburn=0,
)
FACE_PRESETS = {  # lid: upper-lid close angle deg (0 = the eye shape as built, + closes, - opens); brow: (raise m, furrow deg); jaw deg; squash = eye bone scale z
    'neutral': dict(lid=0, brow=(-0.001, 5), jaw=0, squash=1.0),
    'tired': dict(lid=13, brow=(-0.003, 8), jaw=0.5, squash=0.92),
    'startle': dict(lid=-12, brow=(0.011, 0), jaw=4, squash=1.06),
    'fear': dict(lid=-10, brow=(0.008, -9), jaw=3, squash=1.04),
    'focused': dict(lid=6, brow=(-0.004, 11), jaw=0, squash=0.95),
    'listening': dict(lid=-3, brow=(0.003, -3), jaw=0, squash=1.0),
    'frozen': dict(lid=-5, brow=(0.004, -5), jaw=0, squash=1.0),
}


def params(eye=None, brow=None, **kw):
    """Default parameters with an optional named eye opening (EYE_SHAPES key) and brow (BROW_SHAPES key); keywords win."""
    p = dict(PARAMS)
    if eye:
        p.update(EYE_SHAPES[eye], eye_shape=eye)
    if brow:
        p.update(BROW_SHAPES[brow], brow_shape=brow)
    p.update(kw)
    return p


def srgb(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)


# ----------------------------------------------------------------------------- materials
def _mat(name, color, rough=0.8):
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Roughness'].default_value = rough
    return m


def toon(m, steps=6.0, amount=0.8):
    """Cel shading: the scene's diffuse lighting on a white surface is read with Shader-to-RGB, its luminance is quantised to `steps` bands
    (blended `amount` toward the bands; hue and exposure kept) and multiplied by the albedo; emission output (no specular, no SSS)."""
    nt = m.node_tree
    if nt.nodes.get('zc_toon'):
        return
    bsdf = nt.nodes['Principled BSDF']
    outn = [n for n in nt.nodes if n.type == 'OUTPUT_MATERIAL'][0]
    lk = bsdf.inputs['Base Color'].links
    if lk:
        alb = lk[0].from_socket
    else:
        rgb = nt.nodes.new('ShaderNodeRGB')
        rgb.outputs[0].default_value = bsdf.inputs['Base Color'].default_value
        alb = rgb.outputs[0]
    dif = nt.nodes.new('ShaderNodeBsdfDiffuse')
    dif.inputs['Color'].default_value = (1, 1, 1, 1)
    s2r = nt.nodes.new('ShaderNodeShaderToRGB')
    s2r.name = 'zc_toon'
    bw = nt.nodes.new('ShaderNodeRGBToBW')

    def math_(op, a_=None, b_=None):
        n = nt.nodes.new('ShaderNodeMath')
        n.operation = op
        if b_ is not None:
            n.inputs[1].default_value = b_
        return n
    m1, m2, m3, m4 = math_('MULTIPLY', None, steps), math_('ADD', None, 0.5), math_('FLOOR'), math_('DIVIDE', None, steps)
    mixf = nt.nodes.new('ShaderNodeMix')
    mixf.data_type = 'FLOAT'
    mixf.inputs[0].default_value = amount
    mx = math_('MAXIMUM', None, 0.02)
    dv = math_('DIVIDE')
    v1 = nt.nodes.new('ShaderNodeVectorMath')
    v1.operation = 'MULTIPLY'
    v2 = nt.nodes.new('ShaderNodeVectorMath')
    v2.operation = 'SCALE'
    em = nt.nodes.new('ShaderNodeEmission')
    L = nt.links.new
    L(dif.outputs[0], s2r.inputs['Shader'])
    L(s2r.outputs['Color'], bw.inputs['Color'])
    L(bw.outputs['Val'], m1.inputs[0]); L(m1.outputs[0], m2.inputs[0]); L(m2.outputs[0], m3.inputs[0]); L(m3.outputs[0], m4.inputs[0])
    L(bw.outputs['Val'], mixf.inputs[2]); L(m4.outputs[0], mixf.inputs[3])
    L(bw.outputs['Val'], mx.inputs[0])
    L(mixf.outputs[0], dv.inputs[0]); L(mx.outputs[0], dv.inputs[1])
    L(alb, v1.inputs[0]); L(s2r.outputs['Color'], v1.inputs[1])
    L(v1.outputs[0], v2.inputs[0]); L(dv.outputs[0], v2.inputs['Scale'])
    L(v2.outputs[0], em.inputs['Color'])
    L(em.outputs[0], outn.inputs['Surface'])


def _stubble(m, amount, oz=0.0):
    nt = m.node_tree
    bsdf = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord')
    sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    nz = nt.nodes.new('ShaderNodeTexNoise')
    nz.inputs['Scale'].default_value = 900.0
    zr = nt.nodes.new('ShaderNodeMapRange')
    zr.inputs['From Min'].default_value = oz - 0.02      # lower face: below the nose (object-space z of the baked head)
    zr.inputs['From Max'].default_value = oz - 0.05
    thr = nt.nodes.new('ShaderNodeMath')
    thr.operation = 'GREATER_THAN'
    thr.inputs[1].default_value = 0.52
    mul = nt.nodes.new('ShaderNodeMath')
    mul.operation = 'MULTIPLY'
    mix = nt.nodes.new('ShaderNodeMix')
    mix.data_type = 'RGBA'
    mix.inputs[6].default_value = bsdf.inputs['Base Color'].default_value
    mix.inputs[7].default_value = (*srgb('#4a382c'), 1)
    L = nt.links.new
    L(tc.outputs['Object'], sep.inputs[0]); L(tc.outputs['Object'], nz.inputs['Vector'])
    L(sep.outputs['Z'], zr.inputs['Value'])
    L(nz.outputs['Fac'], thr.inputs[0])
    L(thr.outputs[0], mul.inputs[0]); L(zr.outputs['Result'], mul.inputs[1])
    mul2 = nt.nodes.new('ShaderNodeMath')
    mul2.operation = 'MULTIPLY'
    mul2.inputs[1].default_value = amount
    L(mul.outputs[0], mul2.inputs[0]); L(mul2.outputs[0], mix.inputs['Factor'])
    L(mix.outputs[2], bsdf.inputs['Base Color'])


def make_materials(p, prefix='ch', origin=(0, 0, 0), look='cel'):
    """Cel-toon materials for the head. Names are prefixed so several heads with different colours can coexist. look: 'cel' only."""
    if look != 'cel':
        raise ValueError(f"char_head: unknown look {look!r} (only 'cel')")
    d = {}
    skin = _mat(f'{prefix}_skin', srgb(p['skin']))
    if p['stubble'] > 0 and not skin.node_tree.nodes.get('zc_toon'):
        _stubble(skin, p['stubble'], origin[2])
    d['skin'] = skin
    d['lips'] = _mat(f'{prefix}_lips', srgb(p['lip']))
    d['hair'] = _mat(f'{prefix}_hair', srgb(p['hair']))
    d['brow'] = _mat(f'{prefix}_brow', srgb(p['brow_color']))
    d['mouth'] = _mat(f'{prefix}_mouth', srgb('#3a1a18'))
    d['lash'] = _mat(f'{prefix}_lash', srgb('#0d0a09'))
    d['sclera'] = _mat(f'{prefix}_sclera', srgb('#f1ece4'))
    d['iris'] = _mat(f'{prefix}_iris', srgb(p['iris_color']))
    d['pupil'] = _mat(f'{prefix}_pupil', srgb('#060606'))
    d['glint'] = _mat(f'{prefix}_glint', srgb('#ffffff'))
    d['ear_in'] = _mat(f'{prefix}_ear_in', tuple(c * 0.78 for c in srgb(p['skin'])))
    toon(d['skin'], steps=4.0, amount=0.6)       # fewer, softer bands on the face: no contour lines across the sculpted cheeks
    for k in ('lips', 'hair', 'brow', 'mouth', 'lash', 'sclera', 'iris', 'pupil', 'ear_in'):
        toon(d[k])
    gm = d['glint'].node_tree
    if not gm.nodes.get('zc_glint'):
        outn = [n for n in gm.nodes if n.type == 'OUTPUT_MATERIAL'][0]
        em = gm.nodes.new('ShaderNodeEmission')
        em.name = 'zc_glint'
        em.inputs['Strength'].default_value = 4.0
        gm.links.new(em.outputs[0], outn.inputs['Surface'])
    return d


# ----------------------------------------------------------------------------- sculpted head surface
def _features(p, k=None):
    """Gaussian displacement features (cx, cz, sx, sz, amp), head-local, mirrored in x when cx != 0. k = optional shape-key multipliers."""
    k = k or {}
    nl, nw, nb = p['nose_len'] + k.get('nose_size', 0), p['nose_w'] + k.get('nose_width', 0), p['nose_bridge'] + k.get('nose_size', 0)
    ch = p['chin'] + k.get('chin', 0)
    ck = p['cheek'] + k.get('cheek_full', 0)
    mz, mw, lf = p['mouth_z'], p['mouth_w'], p['lip_full']
    bz = p['brow_z'] - 0.005
    ez, ex = p['eye_z'], p['eye_x']
    so, br = p['socket'], p['brow_ridge']
    sk = 1.0 + 0.25 * (so - 1.0)
    if p['oval']:      # plain ellipsoid skull: only the orbit, a faint brow and a very low nose cue; no chin, lips or cheeks
        return [(ex * 0.95, bz, 0.022, 0.007, 0.0055 * br), (ex, ez, ex * 0.52 * sk, 0.0125 * sk, -0.0050 * so),
                (ex, ez - 0.017, ex * 0.55, 0.006, 0.0030 * (so - 1.0)),
                (0.0, ez - 0.008, 0.008 * nw, 0.024, 0.0070 * nb), (0.0, -0.027, 0.010 * nw, 0.009, 0.0150 * nl)]
    return [
        (ex * 0.95, bz, 0.022, 0.007 * (1 + 0.15 * (br - 1)), 0.0055 * br),     # brow ridge
        (ex, ez, ex * 0.52 * sk, 0.0125 * sk, -0.0050 * so),                    # eye socket (orbit dip)
        (ex, ez - 0.017, ex * 0.55, 0.006, 0.0030 * (so - 1.0)),                 # lower orbit rim / cheekbone edge
        (0.0, ez - 0.008, 0.008 * nw, 0.024, 0.0070 * nb),                       # nose bridge
        (0.0, -0.027, 0.010 * nw, 0.009, 0.0150 * nl),                           # nose tip
        (0.013 * nw, -0.031, 0.006, 0.0055, 0.0045 * nl),                        # nose wing
        (0.050, -0.010, 0.020, 0.016, 0.0050 * ck),                              # cheekbone
        (0.047, -0.050, 0.020, 0.018, -0.0030 * ck),                             # cheek hollow
        (0.0, mz + 0.0075, mw * 0.85, 0.0038, 0.0038 * lf),                      # upper lip
        (0.0, mz - 0.0045, mw * 0.85, 0.0046, 0.0042 * lf),                      # lower lip
        (0.0, mz - 0.0200, 0.012, 0.004, -0.0028),                               # chin dent
        (0.0, mz - 0.0350, 0.016, 0.010, 0.0070 * ch),                           # chin
    ]


def _shape_pt(p, x, y, z, k=None, scale=1.0):
    """Unit-sphere point -> head surface point (local frame)."""
    rx, ry, rz = p['head']
    jt = p['jaw_taper'] + (k or {}).get('jaw_width', 0) * -0.12
    px, py, pz = x * rx, y * ry, z * rz
    s = 0.0 if p['oval'] else max(0.0, min(1.0, (-0.012 - pz) / 0.095))
    px *= 1.0 - jt * s ** 1.4
    py *= 1.0 - 0.10 * s
    if py < 0:
        py -= 0.006 * s
    if py < -0.02:
        d = 0.0
        for cx, cz, sx, sz, amp in _features(p, k):
            for sg in ((1, -1) if cx else (1,)):
                d += amp * math.exp(-(((px - sg * cx) / sx) ** 2 + ((pz - cz) / sz) ** 2))
        n = Vector((px / rx, py / ry, pz / rz)).normalized()
        n.x *= 0.3
        n = n.normalized()
        px, py, pz = px + n.x * d, py + n.y * d, pz + n.z * d
    return Vector((px, py, pz))


def front_y(p, x, z, k=None):
    """Approximate face surface y at (x, z) (head-local)."""
    rx, ry, rz = p['head']
    s = 0.0 if p['oval'] else max(0.0, min(1.0, (-0.012 - z) / 0.095))
    rxx = rx * (1.0 - p['jaw_taper'] * s ** 1.4)
    q = 1.0 - (x / rxx) ** 2 - (z / rz) ** 2
    y = -ry * (1 - 0.10 * s) * math.sqrt(max(q, 0.0)) - 0.006 * s
    d = 0.0
    for cx, cz, sx, sz, amp in _features(p, k):
        for sg in ((1, -1) if cx else (1,)):
            d += amp * math.exp(-(((x - sg * cx) / sx) ** 2 + ((z - cz) / sz) ** 2))
    return y - d


def _head_mesh(p, name='head'):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=96, v_segments=72, radius=1.0)
    bm.verts.ensure_lookup_table()
    base = [Vector(v.co) for v in bm.verts]
    for v, u in zip(bm.verts, base):
        v.co = _shape_pt(p, u.x, u.y, u.z)
    bm.normal_update()
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for pg in me.polygons:
        pg.use_smooth = True
    return me, base


# ----------------------------------------------------------------------------- small mesh helpers
def _link(o):
    bpy.context.scene.collection.objects.link(o)


def _finish(bm, name, mats, smooth=True):
    bm.normal_update()
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for pg in me.polygons:
        pg.use_smooth = smooth
    for m in mats:
        me.materials.append(m)
    ob = bpy.data.objects.new(name, me)
    _link(ob)
    return ob


def _ellipsoid(name, c, r, mat, rot=(0, 0, 0), seg=20, rings=12):
    """rot = Euler tuple or a 3x3 Matrix."""
    R_ = rot.to_4x4() if isinstance(rot, Matrix) else Euler(rot).to_matrix().to_4x4()
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=rings, radius=1.0)
    bmesh.ops.transform(bm, matrix=Matrix.Translation(c) @ R_ @ Matrix.Diagonal((*r, 1.0)), verts=bm.verts)
    return _finish(bm, name, [mat])


def _cap(name, c, r, ang, mat, seg=48, rings=24):
    """Spherical cap of radius r around centre c, facing -Y, half-angle `ang` degrees."""
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=rings * 4, radius=r)
    bmesh.ops.transform(bm, matrix=Euler((math.radians(90), 0, 0)).to_matrix().to_4x4(), verts=bm.verts)
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if math.degrees(math.acos(max(-1, min(1, -v.co.y / r)))) > ang], context='VERTS')
    bmesh.ops.transform(bm, matrix=Matrix.Translation(c), verts=bm.verts)
    return _finish(bm, name, [mat])


def _eye_shells(prefix, n, s, c, R, p, mats):
    """Eye opening: skin shells around the eyeball whose edge follows the preset's opening curve exactly (column mesh in azimuth x elevation).
    Returns (upper shell, lower shell). The upper shell carries the lid line (material 1) and an optional crease (material 2)."""
    w, up, dn, k, m, tilt, wing = p['eye_w'], p['eye_up'], p['eye_down'], p['eye_k'], p['eye_m'], p['eye_tilt'], p['eye_wing']
    mode = p['lid_mode']
    t0 = {'none': 0.0, 'line': 3.0, 'lid': 5.5}[mode]
    phis = sorted(set([-85.0 + 170.0 * i / 62 for i in range(63)] + [-w, w]))

    def h(x):
        return (1 - abs(x) ** k) ** m if abs(x) < 1 else 0.0

    def dirv(phi, el):
        a, e = math.radians(phi * s), math.radians(el)
        return Vector((math.sin(a) * math.cos(e), -math.cos(math.radians(phi)) * math.cos(e), math.sin(e)))
    out = []
    for kind in ('up', 'low'):
        bm = bmesh.new()
        cols = []
        for phi in phis:
            x = phi / w
            cl = tilt * x
            hh = h(x)
            edge = cl + (up if kind == 'up' else -dn) * hh
            rr = R * (1.035 if kind == 'up' else 1.02)
            if kind == 'up':
                tt = t0 * (1 + wing * max(0.0, x)) * min(1.0, hh * 4.0)
                tt = max(tt, 0.01)                                  # same row count in every column (collapses to a point at the corners)
                els = [edge, edge + tt]
                if mode == 'lid':
                    els += [edge + tt + 5.0, edge + tt + 6.2]
                top = els[-1]
                els += [top + (80.0 - top) * f for f in (0.15, 0.35, 0.6, 0.8, 1.0)]
            else:
                els = [edge] + [edge - 2.5 - (edge - 2.5 + 80.0) * f for f in (0.0, 0.12, 0.3, 0.55, 0.8, 1.0)]
            cols.append([bm.verts.new(c + dirv(phi, e) * rr) for e in els])
        for j in range(len(cols) - 1):
            a, b = cols[j], cols[j + 1]
            for i in range(min(len(a), len(b)) - 1):
                fc = bm.faces.new((a[i], b[i], b[i + 1], a[i + 1]))
                if kind == 'up':
                    fc.material_index = 1 if i == 0 and t0 > 0 else (2 if (mode == 'lid' and i == 2) else 0)
        bm.faces.ensure_lookup_table()
        bm.normal_update()
        f0 = bm.faces[len(bm.faces) // 2]
        if f0.normal.dot(f0.calc_center_median() - c) < 0:
            bmesh.ops.reverse_faces(bm, faces=bm.faces)
        ob = _finish(bm, f'{prefix}_{"lid" if kind == "up" else "lidlow"}.{n}', [mats['skin'], mats['lash'], mats['ear_in']])
        out.append(ob)
    return out


def _tube(name, pts, radii, mat, seg=6, cap=True):
    bm = bmesh.new()
    rings = []
    n = len(pts)
    for i, pt in enumerate(pts):
        t = (pts[min(i + 1, n - 1)] - pts[max(i - 1, 0)]).normalized()
        ref = Vector((0, 0, 1)) if abs(t.z) < 0.9 else Vector((1, 0, 0))
        u = t.cross(ref).normalized()
        w = t.cross(u).normalized()
        rings.append([bm.verts.new(pt + (u * math.cos(2 * math.pi * k / seg) + w * math.sin(2 * math.pi * k / seg)) * radii[i]) for k in range(seg)])
    for i in range(n - 1):
        for k in range(seg):
            bm.faces.new((rings[i][k], rings[i][(k + 1) % seg], rings[i + 1][(k + 1) % seg], rings[i + 1][k]))
    if cap:
        bm.faces.new(rings[0][::-1])
        bm.faces.new(rings[-1])
    return _finish(bm, name, [mat])


def _bind(ob, ao, weights):
    """weights: dict bone -> w (rigid) or list per vertex of dicts."""
    n = len(ob.data.vertices)
    per = weights if isinstance(weights, list) else [weights] * n
    names = set()
    for w in per:
        names |= set(w)
    for nm in sorted(names):
        ob.vertex_groups.new(name=nm)
    for i, w in enumerate(per):
        for nm, v in w.items():
            if v > 0:
                ob.vertex_groups[nm].add([i], v, 'REPLACE')
    md = ob.modifiers.new('Armature', 'ARMATURE')
    md.object = ao
    ob.parent = ao


def _xf(ob, origin, scale):
    """Move a part built in head-local coordinates to armature space (vertex-level, no object transform)."""
    M = Matrix.Translation(origin) @ Matrix.Scale(scale, 4)
    ob.data.transform(M)


# ----------------------------------------------------------------------------- metrics
def head_metrics(p=None, scale=1.0):
    """Analytic head-local metrics (metres x scale): height = chin bottom to hair top, eye_dz / eye_dy = eye centre offset from the head centre,
    neck = socket point on the underside of the skull (x = 0, just behind the centre). oval=False raises ValueError (sculpted chin not modelled)."""
    p = p or PARAMS
    if not p['oval']:
        raise ValueError('char_head.head_metrics: only the plain-ellipsoid skull (oval=True) is supported; the chin sculpt of oval=False is not modelled')
    rx, ry, rz = p['head']
    top = rz * (1.0 + 0.045 * p['hair_volume']) + 0.001
    ny = 0.012
    neck = Vector((0.0, ny, -rz * math.sqrt(max(0.0, 1.0 - (ny / ry) ** 2)))) * scale
    return dict(height=(top + rz) * scale, eye_dz=p['eye_z'] * scale, eye_dy=p['eye_y'] * scale, neck=neck)


# ----------------------------------------------------------------------------- bones
def face_bones(origin, p=None, scale=1.0):
    """Bone table rows for the face; origin = head centre in armature space; all parented to a bone named 'head'."""
    p = p or PARAMS
    o = Vector(origin)
    T = lambda v: o + Vector(v) * scale
    rows = [('jaw', T((0, 0.035, -0.050)), T((0, -0.05, -0.095)), 'head', True)]
    for s, n in ((1, 'L'), (-1, 'R')):
        ec = (p['eye_x'] * s, p['eye_y'], p['eye_z'])
        rows += [(f'eye.{n}', T(ec), T((ec[0], ec[1] - 0.03, ec[2])), 'head', True),
                 (f'lid.{n}', T(ec), T((ec[0], ec[1], ec[2] + 0.03)), 'head', True),
                 (f'brow.{n}', T((0.034 * s, -0.088, p['brow_z'] - 0.017)), T((0.034 * s, -0.088, p['brow_z'] + 0.013)), 'head', True)]
    return rows


def apply_face(pb, preset='neutral', blink=0.0, **over):
    """pb = armature pose bones. preset in FACE_PRESETS; keyword overrides lid, brow=(raise, furrow_deg), jaw, squash."""
    if preset not in FACE_PRESETS:
        print(f'char_head: unknown face preset {preset}, using neutral')
        preset = 'neutral'
    fp = dict(FACE_PRESETS[preset])
    fp.update({k: v for k, v in over.items() if k in fp})
    lid = fp['lid'] + blink * (80 - fp['lid'])
    for s in 'LR':
        pb[f'eye.{s}'].scale = (1, 1, fp['squash'] * (1.0 - 0.15 * blink))
    for s, sg in (('L', 1), ('R', -1)):
        pb[f'lid.{s}'].rotation_euler = Euler((math.radians(lid), 0, 0), 'XYZ')
        pb[f'brow.{s}'].location = (0, fp['brow'][0], 0)
        pb[f'brow.{s}'].rotation_euler = Euler((0, 0, math.radians(fp['brow'][1] * sg)), 'XYZ')
    pb['jaw'].rotation_euler = Euler((math.radians(fp['jaw']), 0, 0), 'XYZ')


# ----------------------------------------------------------------------------- hair
HAIRLINES = {   # (angle from the front in degrees, polar angle limit of the hair mass in degrees)
    'side_sweep': ((0, 60), (35, 60), (70, 68), (105, 84), (140, 104), (180, 114)),
    'short_crop': ((0, 52), (35, 54), (70, 62), (105, 78), (140, 96), (180, 106)),
    'cutout': ((0, 66), (25, 60), (50, 72), (80, 76), (110, 90), (140, 108), (180, 116)),
    'bowl': ((0, 62), (35, 64), (70, 76), (105, 94), (140, 110), (180, 118)),
    'bob': ((0, 66), (25, 60), (50, 72), (80, 104), (110, 135), (140, 148), (180, 150)),   # chin-length: sides and back reach the jaw line
}
HAIRLINES['ponytail'] = HAIRLINES['cutout']      # same cap, plus a tail tube
_FRINGE = ('cutout', 'bob', 'ponytail')


def _hair(ao, p, mats, prefix, origin, scale):
    """One-piece hair sheet: a shell over the skull cut at the hairline of `hair_style`, with a rolled edge; optional sideburns."""
    rx, ry, rz = p['head']
    vol = p['hair_volume']
    pts_ = HAIRLINES[p['hair_style']]

    def th_max(ph):
        a = abs(math.degrees(ph))
        for (x0, y0), (x1, y1) in zip(pts_, pts_[1:]):
            if a <= x1:
                v = y0 + (y1 - y0) * (a - x0) / (x1 - x0)
                if p['hair_style'] in _FRINGE and a < 90:
                    v += 7.0 * math.sin(ph) * (1 - a / 90)          # diagonal fringe edge: lower on the character's left, higher on the right
                if p['hair_style'] == 'side_sweep' and ph > 0 and a < 60:
                    v -= 4.0                                  # side part: lower on the character's left
                return math.radians(v)
        return math.radians(pts_[-1][1])

    def pt(th, ph, k):
        return Vector((rx * k * math.sin(th) * math.sin(ph), -ry * k * math.sin(th) * math.cos(ph), rz * k * math.cos(th) + 0.001))
    NP, NT = 120, 28
    bm = bmesh.new()
    apex = bm.verts.new(pt(0.0, 0.0, 1.0 + 0.045 * vol))
    grid = []
    for i in range(NP):
        ph = -math.pi + 2 * math.pi * i / NP
        tm = th_max(ph)
        ring = []
        for j in range(1, NT + 1):
            t = j / NT
            k = 1.0 + 0.045 * vol * (1 - 0.25 * t * t)
            ring.append(bm.verts.new(pt(tm * t, ph, k)))
        grid.append(ring)
    inner = []
    for i in range(NP):
        ph = -math.pi + 2 * math.pi * i / NP
        inner.append(bm.verts.new(pt(th_max(ph), ph, 1.0)))
    for i in range(NP):
        a, b = grid[i], grid[(i + 1) % NP]
        bm.faces.new((apex, a[0], b[0]))
        for j in range(NT - 1):
            bm.faces.new((a[j], a[j + 1], b[j + 1], b[j]))
        bm.faces.new((a[NT - 1], inner[i], inner[(i + 1) % NP], b[NT - 1]))      # rolled edge: no open rim
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    ob = _finish(bm, f'{prefix}_hair', [mats['hair']])
    _xf(ob, origin, scale)
    _bind(ob, ao, {'head': 1.0})
    out = [ob]
    # sideburns (optional)
    for sg, n in (((1, 'L'), (-1, 'R')) if p['sideburn'] else ()):
        sb = _tube(f'{prefix}_sideburn.{n}', [Vector((rx * 0.96 * sg, -0.020, 0.030)), Vector((rx * 0.98 * sg, -0.022, 0.006)), Vector((rx * 0.97 * sg, -0.020, -0.008))],
                   [0.0032, 0.0030, 0.0010], mats['hair'], seg=6)
        _xf(sb, origin, scale)
        _bind(sb, ao, {'head': 1.0})
        out.append(sb)
    if p['hair_style'] == 'ponytail':       # tapered tail from the back of the head, hanging below the chin line
        tp = [Vector(v) for v in ((0, ry * 0.90, 0.040), (0, ry + 0.022, 0.012), (0, ry + 0.036, -0.030), (0, ry + 0.034, -0.085), (0, ry + 0.026, -0.140))]
        tail = _tube(f'{prefix}_ponytail', tp, [0.016 * vol, 0.017 * vol, 0.014 * vol, 0.0095 * vol, 0.0025], mats['hair'], seg=8)
        _xf(tail, origin, scale)
        _bind(tail, ao, {'head': 1.0})
        out.append(tail)
    return out


# ----------------------------------------------------------------------------- build
def build_head(ao, origin, p=None, prefix='ch', scale=1.0, mats=None):
    """Create the head meshes bound (vertex groups + Armature modifier) to bones head/jaw/eye.*/lid.*/brow.* of armature object `ao`."""
    p = p or params()
    origin = Vector(origin)
    mats = mats or make_materials(p, prefix, origin)
    parts = []
    # ---- skull with sculpted features + shape keys
    me, base = _head_mesh(p, f'{prefix}_head')
    mm = [mats['skin']]
    for m in mm:
        me.materials.append(m)
    head = bpy.data.objects.new(f'{prefix}_head', me)
    _link(head)
    zm = p['mouth_z']
    row = 0.224 / 72
    wts = []
    for v in me.vertices:
        jaw = max(0.0, min(1.0, (zm + 0.004 - v.co.z) / 0.010))
        jaw = jaw * jaw * (3 - 2 * jaw)
        if v.co.y > 0.04:
            jaw = 0.0
        wts.append({'jaw': jaw, 'head': 1.0 - jaw} if jaw > 0 else {'head': 1.0})
    # shape keys (value 0 = as built); same topology, so each key is the head rebuilt with one parameter pushed
    head.shape_key_add(name='Basis')
    for key, kw in (('nose_size', dict(nose_size=0.5)), ('nose_width', dict(nose_width=0.5)), ('jaw_width', dict(jaw_width=1.0)),
                    ('chin', dict(chin=0.6)), ('cheek_full', dict(cheek_full=0.6))):
        sk = head.shape_key_add(name=key, from_mix=False)
        for v, u in zip(sk.data, base):
            v.co = _shape_pt(p, u.x, u.y, u.z, kw)
        sk.slider_min, sk.slider_max = -1.0, 1.5
    head.data.transform(Matrix.Translation(origin) @ Matrix.Scale(scale, 4), shape_keys=True)
    _bind(head, ao, wts)
    parts.append(head)
    ec_y = p['eye_y']
    R = p['eye_r']
    # ---- ears: a thin cupped plate spanning about the brow line to the nose base, leaning back `ear_tilt` deg, top standing out `ear_flare` deg,
    # its face turned forward `ear_turn` deg; one darker inner plate = the simple cel ear (no helix detail)
    for s, n in ((1, 'L'), (-1, 'R')):
        ez_, ey_ = p['ear_z'], p['ear_y']
        ex = p['head'][0] * math.sqrt(max(0.05, 1 - (ey_ / p['head'][1]) ** 2 - (ez_ / p['head'][2]) ** 2)) * 0.97
        rot = (Matrix.Rotation(math.radians(-p['ear_turn'] * s), 3, 'Z') @ Matrix.Rotation(math.radians(-p['ear_tilt']), 3, 'X')
               @ Matrix.Rotation(math.radians(p['ear_flare'] * s), 3, 'Y'))
        c = Vector((ex * s, ey_, ez_))
        out_n = rot @ Vector((s, 0, 0))
        e1 = _ellipsoid(f'{prefix}_ear.{n}', c, (0.0075 * p['ear'], 0.0185 * p['ear'], 0.0345 * p['ear']), mats['skin'], rot=rot, seg=28, rings=16)
        e2 = _ellipsoid(f'{prefix}_ear_in.{n}', c + out_n * 0.0042 * p['ear'], (0.0030 * p['ear'], 0.0105 * p['ear'], 0.0225 * p['ear']), mats['ear_in'], rot=rot, seg=24, rings=14)
        for e in (e1, e2):
            _xf(e, origin, scale)
            _bind(e, ao, {'head': 1.0})
            parts.append(e)
    # ---- eyes: sclera + iris + pupil + glint on the eye bone; skin shells cut to the eye opening (upper one on the lid bone, with the lid line)
    for s, n in ((1, 'L'), (-1, 'R')):
        c = Vector((p['eye_x'] * s, ec_y, p['eye_z']))
        eye = _ellipsoid(f'{prefix}_eye.{n}', c, (R,) * 3, mats['sclera'], seg=48, rings=32)
        ir = math.degrees(math.asin(min(0.95, p['iris'] * 0.95)))
        for kind, rr, ang_, mk in (('iris', 1.004, ir, 'iris'), ('pupil', 1.009, ir * 0.42, 'pupil')):
            cap = _cap(f'{prefix}_{kind}.{n}', c, R * rr, ang_, mats[mk])      # smooth caps, not per-polygon materials: round edges at any size
            _xf(cap, origin, scale)
            _bind(cap, ao, {f'eye.{n}': 1.0})
            parts.append(cap)
        _xf(eye, origin, scale)
        _bind(eye, ao, {f'eye.{n}': 1.0})
        parts.append(eye)
        gdir = Vector((-0.30 * s, -0.93, 0.22)).normalized()
        gl = _ellipsoid(f'{prefix}_glint.{n}', c + gdir * R * 1.0, (R * 0.13, R * 0.08, R * 0.13), mats['glint'], seg=12, rings=8)
        _xf(gl, origin, scale)
        _bind(gl, ao, {f'eye.{n}': 1.0})
        parts.append(gl)
        for ob, bone in zip(_eye_shells(prefix, n, s, c, R, p, mats), (f'lid.{n}', 'head')):
            _xf(ob, origin, scale)
            _bind(ob, ao, {bone: 1.0})
            parts.append(ob)
        # brows: tapered arched stroke following the forehead
        bp = []
        tl = math.tan(math.radians(p['brow_tilt']))
        x0, x1 = p['brow_x0'], p['brow_x1']
        xm, xh = (x0 + x1) / 2, (x1 - x0) / 2
        for bx in [x0 + (x1 - x0) * i / 6 for i in range(7)]:
            bxx = bx * p['brow_len']
            z = p['brow_z'] + p['brow_arch'] * (1 - ((bx - xm) / xh) ** 2) + tl * (bx - xm)
            bp.append(Vector((bxx * s, front_y(p, bxx, z) - 0.0012, z)))
        rad = [max(0.0008, 0.0046 * p['brow_thick'] * (1 - p['brow_taper'] * (i / 6) ** 1.5) * (0.6 if i == 0 else 1.0)) for i in range(7)]
        br = _tube(f'{prefix}_brow.{n}', bp, rad, mats['brow'], seg=6)
        _xf(br, origin, scale)
        _bind(br, ao, {f'brow.{n}': 1.0})
        parts.append(br)
    # ---- mouth: one thin curved stroke on the lip seam (slight smile with mouth_curve) + soft lower-lip patch; jaw-weighted
    mw, mz = p['mouth_w'], p['mouth_z']
    mp = []
    for i in range(9):
        x = -mw + 2 * mw * i / 8
        z = mz + p['mouth_curve'] * (x / mw) ** 2 - p['mouth_curve'] * 0.3
        mp.append(Vector((x, front_y(p, x, z) - 0.0004, z)))
    mouth = _tube(f'{prefix}_mouth', mp, [0.0007, 0.0012, 0.0015, 0.0017, 0.0018, 0.0017, 0.0015, 0.0012, 0.0007], mats['mouth'], seg=5)
    _xf(mouth, origin, scale)
    _bind(mouth, ao, {'jaw': 0.5, 'head': 0.5})
    parts.append(mouth)
    lp = _ellipsoid(f'{prefix}_lip_lo', Vector((0, front_y(p, 0, mz - 0.0065) + 0.0006, mz - 0.0065)), (mw * 0.50, 0.0030, 0.0030 * p['lip_full']), mats['lips'], seg=16, rings=8)
    _xf(lp, origin, scale)
    _bind(lp, ao, {'jaw': 1.0})
    parts.append(lp)
    parts += _hair(ao, p, mats, prefix, origin, scale)
    return parts


def add_standalone_armature(p=None, name='char_head', origin=(0, 0, 0), scale=1.0):
    """Armature with 'head' + the face bones, so a head can be used and posed without a body (reuse/test)."""
    p = p or PARAMS
    arm = bpy.data.armatures.new(name)
    ao = bpy.data.objects.new(name, arm)
    _link(ao)
    bpy.context.view_layer.objects.active = ao
    ao.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    o = Vector(origin)
    h = arm.edit_bones.new('head')
    h.head, h.tail = o + Vector((0, 0, -0.095)) * scale, o + Vector((0, 0, 0.125)) * scale
    rows = face_bones(origin, p, scale)
    for nm, hd, tl, par, dfm in rows:
        b = arm.edit_bones.new(nm)
        b.head, b.tail = hd, tl
    for nm, hd, tl, par, dfm in rows:
        arm.edit_bones[nm].parent = arm.edit_bones[par]
    bpy.ops.object.mode_set(mode='OBJECT')
    bpy.ops.object.mode_set(mode='POSE')
    for pb in ao.pose.bones:
        pb.rotation_mode = 'XYZ'
    for s in 'LR':
        dt = ao.pose.bones[f'eye.{s}'].constraints.new('DAMPED_TRACK')
        dt.target = ao
        dt.subtarget = 'head'
        dt.track_axis = 'TRACK_Y'
        dt.influence = 0.0
    bpy.ops.object.mode_set(mode='OBJECT')
    return ao
