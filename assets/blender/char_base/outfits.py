"""char_base outfits: garment pieces on the body mesh (cut planes, band rules, trim geometry, folds) and material hooks.

outfit = [(piece, opts)]; each piece is `piece(ctx, **opts)` in PIECES and registers its parts on ctx:
  ctx.planes  (order, co, normal)   edge loops cut where the garment ends
  ctx.bands   fn(dom, c) -> material key | None   (first piece in outfit order that answers wins; default 'skin')
  ctx.trims   fn()                  trim geometry after binding (rims, hems, toes)
  ctx.fold    {material key: amplitude}, ctx.drape (lo, hi, centre, width) waist drape window
  ctx.hooks   fn(M)                 material edits before the look is finished
"""
import math

import bmesh
import bpy
from mathutils import Euler, Matrix, Vector, noise

import body as B
from looks import srgb


class Ctx:
    def __init__(self, name, J, F, M=None):
        self.name, self.J, self.F, self.M = name, J, F, M
        self.planes, self.bands, self.trims, self.hooks = [], [], [], []
        self.fold, self.drape = {}, None
        self.body = self.ao = self.bv = None


def plan(outfit, name, J, F):
    ctx = Ctx(name, J, F)
    for piece, opts in outfit:
        if piece not in PIECES:
            raise ValueError(f'char_base.outfits: unknown piece {piece!r} (one of {sorted(PIECES)})')
        PIECES[piece](ctx, **opts)
    return ctx


def dress_materials(outfit, M, name, J, F):
    """Run the pieces' material hooks (e.g. grime) on M before looks.finish()."""
    for fn in plan(outfit, name, J, F).hooks:
        fn(M)


def apply(body_obj, ao, outfit, M, J, F=None, table=None):
    """Cut, weight, band-assign and bind the body mesh, then add trims and folds. body_obj: unbound baked body mesh at rest."""
    ctx = plan(outfit, body_obj.name[:-len('_body')], J, F)
    ctx.M, ctx.body, ctx.ao = M, body_obj, ao
    me = body_obj.data
    B.bisect(me, [(co, no) for _, co, no in sorted(ctx.planes, key=lambda t: t[0])])
    w = B.weights([v.co for v in me.vertices], table, F['gw'])
    slots = ['skin']
    for piece, opts in outfit:
        k = opts.get('color', piece)
        if piece in BAND_PIECES and k not in slots:
            slots.append(k)
    for k in slots:
        me.materials.append(M[k])
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
        key = 'skin'
        for rule in ctx.bands:
            r = rule(dom, c)
            if r:
                key = r
                break
        pg.material_index = slots.index(key)
        pg.use_smooth = True
    B.vg_bind(body_obj, ao, w)
    ctx.bv = [v.co.copy() for v in me.vertices]
    for fn in ctx.trims:
        fn()
    _folds(ctx, slots)
    return ctx


def _folds(ctx, slots):
    """Procedural folds baked into the rest geometry of the garments (static mesh detail; deforms with the weights)."""
    amps = [ctx.fold.get(k, 0.0) for k in slots]
    if not any(amps):
        return
    me = ctx.body.data
    for pg in me.polygons:
        a = amps[pg.material_index]
        if not a:
            continue
        for vi in pg.vertices:
            v = me.vertices[vi]
            p = v.co
            n = Vector(v.normal)
            fold = noise.noise(Vector((p.x * 16, p.y * 16, p.z * 6))) * 0.6 + 0.4 * math.sin(p.z * 70 + p.x * 9)
            if ctx.drape:
                lo, hi, zm, wd = ctx.drape
                if p.z > lo and p.z < hi:
                    fold += 0.9 * math.sin(p.z * 95 + 2.0 * p.x) * math.exp(-((p.z - zm) / wd) ** 2)   # waist drape
            v.co = p + n * fold * a
    me.update()


# ----------------------------------------------------------------------------- mesh helpers
def _link(o):
    bpy.context.scene.collection.objects.link(o)


def _obj(name, bm, mat):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for pg in me.polygons:
        pg.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    ob.data.materials.append(mat)
    _link(ob)
    return ob


def torus(name, c, R, r, mat, scale=(1, 1, 1), rot=(0, 0, 0), maj=32, mnr=8):
    bm = bmesh.new()
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
    return _obj(name, bm, mat)


def ellipsoid(name, c, r, mat, rot=(0, 0, 0), seg=24, rings=14):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=rings, radius=1.0)
    M = Matrix.Translation(c) @ Euler(rot).to_matrix().to_4x4() @ Matrix.Diagonal((*r, 1.0))
    bmesh.ops.transform(bm, matrix=M, verts=bm.verts)
    return _obj(name, bm, mat)


def _fit_h(ctx, z, xsign=0, band=0.004):
    """Centre and half-extents (x, y) of the body section at height z (torso, or one leg with xsign)."""
    J, F = ctx.J, ctx.F
    tx, lx0, lx1 = 0.21 * F['rt'], 0.02 * F['gw'], J['HIP'].x + 0.085 * F['rl']
    pts = []
    while len(pts) < 8:
        pts = [p for p in ctx.bv if abs(p.z - z) < band and (xsign == 0 and abs(p.x) < tx or xsign != 0 and lx0 < p.x * xsign < lx1)]
        band *= 1.5
    cx = sum(p.x for p in pts) / len(pts)
    cy = sum(p.y for p in pts) / len(pts)
    return cx, cy, max(abs(p.x - cx) for p in pts), max(abs(p.y - cy) for p in pts)


def _rim(ctx, label, z, r, mat, bone, pad, xsign=0):
    cx, cy, rx, ry = _fit_h(ctx, z, xsign)
    g = ctx.F['gw']
    ob = torus(f'{ctx.name}_{label}', Vector((cx, cy, z)), 1.0, r * g, ctx.M[mat], scale=(rx + pad * g, ry + pad * g, 1.0))
    B.rigid(ob, ctx.ao, bone)


TORSO = ('pelvis', 'spine', 'chest', 'clavicle')


def _arm_axis(s):
    return Vector((B.ARM_DIR.x * s, B.ARM_DIR.y, B.ARM_DIR.z)).normalized()


# ----------------------------------------------------------------------------- pieces
def tee(ctx, color='tee', fold=0.0, sleeve=0.155):
    """T-shirt: neckline, hem over the waistband, short sleeves (sleeve = hem distance along the upper arm, zc-you metres)."""
    J, F = ctx.J, ctx.F
    zn = J['neck'].z + (J['head_base'].z - J['neck'].z) * 0.3
    zh = J['pelvis'].z - 0.010 * F['gw']
    sd = sleeve * (J['EL'] - J['SH']).length / (B.UPPER_ARM ** 2 + B.ELBOW_Y ** 2) ** 0.5
    ctx.planes += [(0, (0, 0, zn), (0, 0, 1)), (1, (0, 0, zh), (0, 0, 1))]
    for s in (1, -1):
        ax = _arm_axis(s)
        ctx.planes.append((3, tuple(B.mirror(J['SH'], s) + ax * sd), tuple(ax)))

    def band(dom, c):
        if dom in TORSO:
            return color if zh <= c.z <= zn else None
        if dom == 'neck':
            return None if c.z > zn else color
        if dom == 'upper_arm':
            s = 1 if c.x >= 0 else -1
            return color if (c - B.mirror(J['SH'], s)).dot(_arm_axis(s)) < sd else None
        if dom == 'thigh':
            return color if c.z >= zh else None
        return None
    ctx.bands.append(band)

    def trims():
        _rim(ctx, 'collar', zn, 0.0072, color, 'neck', 0.003)
        _rim(ctx, 'shirt_hem', zh, 0.0065, color, 'spine', 0.002)
        for s, n in ((1, 'L'), (-1, 'R')):
            ax = _arm_axis(s)
            c0 = B.mirror(J['SH'], s) + ax * sd
            bnd, near = 0.004, []
            while len(near) < 8:
                near = [p for p in ctx.bv if abs((p - c0).dot(ax)) < bnd and (p - c0).length < 0.09 * F['rl'] and p.x * s > 0.1 * F['gw']]
                bnd *= 1.5
            cc = sum(near, Vector()) / len(near)
            rr = max((p - cc).length for p in near)
            q = Vector((0, 0, 1)).rotation_difference(ax).to_euler()
            ob = torus(f'{ctx.name}_sleeve_hem.{n}', cc, rr + 0.002 * F['gw'], 0.0058 * F['gw'], ctx.M[color], rot=tuple(q))
            B.rigid(ob, ctx.ao, f'upper_arm.{n}')
    ctx.trims.append(trims)
    if fold:
        ctx.fold[color] = fold
        ctx.drape = (zh, J['spine'].z + 0.13 * F['gw'], J['spine'].z, 0.07 * F['gw'])


def shorts(ctx, color='shorts', fold=0.0):
    """Shorts: waistband just above the shirt hem, leg hems at 73% down the thigh (zc-you: 0.60 m)."""
    J, F = ctx.J, ctx.F
    top = J['pelvis'].z - 0.010 * F['gw']
    zb = J['pelvis'].z + 0.005 * F['gw']
    zl = J['HIP'].z + (J['KNEE'].z - J['HIP'].z) * (0.325 / 0.445)
    ctx.planes.append((2, (0, 0, zl), (0, 0, 1)))

    def band(dom, c):
        if dom in TORSO:
            return color if c.z < top else None
        if dom == 'thigh':
            return color if zl < c.z < top else None
        return None
    ctx.bands.append(band)

    def trims():
        _rim(ctx, 'shorts_band', zb, 0.0085, color, 'pelvis', 0.001)
        for s, n in ((1, 'L'), (-1, 'R')):
            _rim(ctx, f'shorts_hem.{n}', zl, 0.0060, color, f'thigh.{n}', 0.002, s)
    ctx.trims.append(trims)
    if fold:
        ctx.fold[color] = fold


TOES = ((-0.027, 0.020, 0.0105), (-0.012, 0.016, 0.0072), (0.001, 0.0145, 0.0068), (0.013, 0.0125, 0.0064), (0.024, 0.0105, 0.0060))


def barefoot(ctx, nail='nail'):
    """Five toes (big toe medial) + toenails per foot, rigid on the toe bone."""
    def trims():
        J, fs = ctx.J, ctx.F['fs']
        for s, n in ((1, 'L'), (-1, 'R')):
            t = J['TOE']
            for i, (dx, ln, rr) in enumerate(TOES):
                dx, ln, rr = dx * fs, ln * fs, rr * fs
                xt = (t.x + dx) * s          # mirrored per side (the pre-char_base rig put both toe sets on the left foot)
                y0, z0 = t.y - 0.006 * fs, t.z - 0.0105 * fs
                toe = ellipsoid(f'{ctx.name}_toe{i}.{n}', Vector((xt, y0 - ln * 0.35, z0 + rr * 0.35)), (rr, ln * 0.5 + 0.005 * fs, rr * 0.85),
                                ctx.M['skin'], seg=12, rings=8)
                B.rigid(toe, ctx.ao, f'toe.{n}')
                nl = ellipsoid(f'{ctx.name}_toenail{i}.{n}', Vector((xt, y0 - ln * 0.50, z0 + rr * 1.05)), (rr * 0.58, ln * 0.28, rr * 0.18),
                               ctx.M[nail], seg=10, rings=6)
                B.rigid(nl, ctx.ao, f'toe.{n}')
    ctx.trims.append(trims)


def grime(ctx, on='tee', color='#1a2b2a'):
    """Darker sweat/grime patches on material `on` (object-space noise); not blood."""
    def hook(M):
        m = M[on]
        nt = m.node_tree
        if nt.nodes.get('cb_grime'):
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
        mix.name = 'cb_grime'
        mix.inputs[6].default_value = bsdf.inputs['Base Color'].default_value
        mix.inputs[7].default_value = (*srgb(color), 1)
        nt.links.new(tc.outputs['Object'], nz.inputs['Vector'])
        nt.links.new(nz.outputs['Fac'], ramp.inputs['Fac'])
        nt.links.new(ramp.outputs['Color'], mix.inputs['Factor'])
        nt.links.new(mix.outputs[2], bsdf.inputs['Base Color'])
    ctx.hooks.append(hook)


PIECES = {'tee': tee, 'shorts': shorts, 'barefoot': barefoot, 'grime': grime}
BAND_PIECES = ('tee', 'shorts')
