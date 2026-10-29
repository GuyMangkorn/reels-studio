"""char_base outfits: garment pieces on the body mesh (cut planes, band rules, trim geometry, folds) and material hooks.

outfit = [(piece, opts)]; each piece is `piece(ctx, **opts)` in PIECES and registers its parts on ctx:
  ctx.planes  (order, co, normal)   edge loops cut where the garment ends
  ctx.bands   fn(dom, c) -> material key | None   (first piece in outfit order that answers wins; default 'skin')
  ctx.trims   fn()                  trim geometry after binding (rims, hems, toes)
  ctx.fold    {material key: amplitude}, ctx.drape (lo, hi, centre, width) waist drape window
  ctx.hooks   fn(M)                 material edits before the look is finished
"""
import math
import re

import bmesh
import bpy
from mathutils import Euler, Matrix, Vector, noise
from mathutils.bvhtree import BVHTree

import body as B
from looks import srgb


class Ctx:
    def __init__(self, name, J, F, M=None):
        self.name, self.J, self.F, self.M = name, J, F, M
        self.planes, self.bands, self.trims, self.hooks = [], [], [], []
        self.fold, self.drape = {}, None
        self.body = self.ao = self.bv = self.bdom = None


def plan(outfit, name, J, F):
    ctx = Ctx(name, J, F)
    for piece, opts in outfit:
        if piece not in PIECES:
            raise ValueError(f'char_base.outfits: unknown piece {piece!r} (one of {sorted(PIECES)})')
        _check_opts(piece, opts)
        PIECES[piece](ctx, **opts)
    return ctx


HEX = re.compile(r'#[0-9a-fA-F]{6}')


def _num(piece, k, v, lo, hi):
    if isinstance(v, bool) or not isinstance(v, (int, float)) or not lo <= v <= hi:
        raise ValueError(f'char_base.outfits: {piece}.{k}={v!r} must be a number in [{lo}, {hi}]')


def _int(piece, k, v, lo, hi):
    if isinstance(v, bool) or not isinstance(v, int) or not lo <= v <= hi:
        raise ValueError(f'char_base.outfits: {piece}.{k}={v!r} must be an integer in [{lo}, {hi}]')


def _col(piece, k, v):
    if not isinstance(v, str) or not v or (v.startswith('#') and not HEX.fullmatch(v)):
        raise ValueError(f"char_base.outfits: {piece}.{k}={v!r} must be a palette key or a '#rrggbb' hex string")


def _sleeve(piece, k, v):
    if not isinstance(v, str) or v not in ('short', 'long'):
        raise ValueError(f"char_base.outfits: {piece}.{k}={v!r} must be 'short' or 'long'")


_COL = ('color', 'sole', 'nail', 'on')
_NUM = {'fold': (0.0, 0.02), 'length': (0.1, 1.0), 'flare': (0.0, 2.0), 'thickness': (0.001, 0.02)}      # skirt length = fraction hip -> knee
_INT = {'buttons': (0, 12), 'nu': (8, 128), 'nv': (2, 64)}


def _check_opts(piece, opts):
    """Reject out-of-range or mistyped options with a ValueError naming piece.key (no clamping, no fallback)."""
    for k, v in opts.items():
        if k in _COL:
            _col(piece, k, v)
        elif k == 'sleeve':
            _sleeve(piece, k, v)
        elif k in _NUM:
            _num(piece, k, v, *_NUM[k])
        elif k in _INT:
            _int(piece, k, v, *_INT[k])


def dress_materials(outfit, M, name, J, F):
    """Run the pieces' material hooks (e.g. grime) on M before looks.finish()."""
    for fn in plan(outfit, name, J, F).hooks:
        fn(M)


def apply(body_obj, ao, outfit, M, J, F, table):
    """Cut, weight, band-assign and bind the body mesh, then add trims and folds. body_obj: unbound baked body mesh at rest."""
    ctx = plan(outfit, body_obj.name[:-len('_body')], J, F)
    ctx.M, ctx.body, ctx.ao = M, body_obj, ao
    me = body_obj.data
    B.bisect(me, [(co, no) for _, co, no in sorted(ctx.planes, key=lambda t: t[0])])
    w = B.weights([v.co for v in me.vertices], table, F['gw'])
    w = B.smooth_weights(me, w)
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
    B.corrective_smooth(body_obj, w)
    ctx.bv = [v.co.copy() for v in me.vertices]
    ctx.bdom = [max(wv, key=wv.get).split('.')[0] for wv in w]     # dominant bone per vertex (torso section fits skip the arms)
    ctx.bvh = BVHTree.FromPolygons(ctx.bv, [tuple(pg.vertices) for pg in me.polygons])   # ring fits cast rays at the rest body
    ctx.bvh_torso = BVHTree.FromPolygons(ctx.bv, [tuple(pg.vertices) for pg in me.polygons if not any(ctx.bdom[i] in ARM_DOM for i in pg.vertices)])
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


ARM_DOM = ('upper_arm', 'forearm', 'hand', 'fingers', 'fingers_tip', 'thumb')   # section fits never take in a hanging arm (heavy bodies)
MAX_GROW = 20        # band-growth iterations (x1.5 each) before a missing section is an error, never a hang


def _fit_h(ctx, z, xsign=0, band=0.004, xmax=None):
    """Centre and half-extents (x, y) of the body section at height z (torso, or one leg with xsign; xmax narrows the torso window)."""
    J, F = ctx.J, ctx.F
    tx, lx0, lx1 = 0.21 * F['rt'], 0.02 * F['gw'], J['HIP'].x + 0.085 * F['rl']
    tx = xmax if xmax else tx
    pts = []
    for _ in range(MAX_GROW):
        if len(pts) >= 8:
            break
        pts = [p for p, d in zip(ctx.bv, ctx.bdom) if abs(p.z - z) < band and d not in ARM_DOM
               and (xsign == 0 and abs(p.x) < tx or xsign != 0 and lx0 < p.x * xsign < lx1)]
        band *= 1.5
    if len(pts) < 8:
        raise ValueError(f'char_base.outfits: no body section found at z={z:.3f}')
    cx = sum(p.x for p in pts) / len(pts)
    cy = sum(p.y for p in pts) / len(pts)
    return cx, cy, max(abs(p.x - cx) for p in pts), max(abs(p.y - cy) for p in pts)


def _section(ctx, c, u, v, n=36, win=math.radians(20), rmax=None, outer=False):
    """Ring fit by rays from c (a point on the limb / neck / spine line) outward in the plane (u, v): the first hit is that part's
    own surface, even where it runs into a neighbour (arm into a heavy chest, thigh into thigh). rmax drops longer hits (a ray running
    along a heavy shoulder from the neck) and stands in where a direction has none. outer: torso rings (centre may sit between the
    legs) take the outermost body exit before a 2 cm gap, cast at the body without its arms. Returns centre, half-extents along u, v."""
    hits = []
    for k in range(n):
        a = 2 * math.pi * k / n
        d = u * math.cos(a) + v * math.sin(a)
        hits.append((a, _outer_exit(ctx.bvh_torso, c, d) if outer else (lambda h: h[3] if h[0] is not None else None)(ctx.bvh.ray_cast(c, d, 1.0))))

    def mean_at(a0):
        r = [d for a, d in hits if d is not None and abs((a - a0 + math.pi) % (2 * math.pi) - math.pi) <= win and (rmax is None or d <= rmax)]
        if not r and rmax is not None:
            return rmax
        if not r and outer:              # a hem below the crotch: front / back rays pass between the legs; use the outline's extent
            r = [max(t * math.cos(a - a0) for a, t in hits if t is not None)] if any(t is not None for _, t in hits) else []
        if not r:
            raise ValueError(f'char_base.outfits: no body section around {tuple(round(x, 3) for x in c)}')
        return sum(r) / len(r)
    u0, u1, v0, v1 = mean_at(0.0), mean_at(math.pi), mean_at(math.pi / 2), mean_at(1.5 * math.pi)
    return c + u * (u0 - u1) / 2 + v * (v0 - v1) / 2, (u0 + u1) / 2, (v0 + v1) / 2


def _outer_exit(bvh, o, d, gap=0.02, far=1.0):
    """Distance along d to the first exit from the body that is not followed by another surface within gap."""
    hs, t = [], 0.0
    while t < far:
        h = bvh.ray_cast(o + d * (t + 1e-5), d, far - t)
        if h[0] is None:
            break
        t += 1e-5 + h[3]
        hs.append((t, h[1].dot(d) > 0))
    for i, (t, ex) in enumerate(hs):
        if ex and (i + 1 == len(hs) or hs[i + 1][0] - t > gap):
            return t
    return None


def _on_line(a, b, z):
    """Point at height z on the bone line a-b (clamped to the segment, then set to z)."""
    t = (z - a.z) / (b.z - a.z) if abs(b.z - a.z) > 1e-9 else 0.0
    p = a + (b - a) * max(0.0, min(1.0, t))
    return Vector((p.x, p.y, z))


def _rim(ctx, label, z, r, mat, bone, pad, axis, rmax=None):
    """Horizontal hem ring at height z hugging the section around the bone line axis=(a, b) (the spine: the whole torso / hip section)."""
    c, rx, ry = _section(ctx, _on_line(*axis, z), Vector((1, 0, 0)), Vector((0, 1, 0)), rmax=rmax, outer=axis == _spine(ctx))
    g = ctx.F['gw']
    ob = torus(f'{ctx.name}_{label}', c, 1.0, r * g, ctx.M[mat], scale=(rx + pad * g, ry + pad * g, 1.0))
    B.rigid(ob, ctx.ao, bone)


def _spine(ctx):
    return ctx.J['pelvis'], ctx.J['chest']


def _neck(ctx):
    return ctx.J['neck'], ctx.J['head_base']


def _neck_r(ctx):
    return 0.062 * ctx.F['rt']          # the yoke's cage radius (body.body_graph neck0): the neck surface lies inside it


def _leg(ctx, s, lower=False):
    J = ctx.J
    return (B.mirror(J['KNEE'], s), B.mirror(J['ANK'], s)) if lower else (B.mirror(J['HIP'], s), B.mirror(J['KNEE'], s))


TORSO = ('pelvis', 'spine', 'chest', 'clavicle')
DEFAULT_COLOR = {'tee': '#2f5656', 'shirt': '#cfd3d6', 'tank': '#e8e4dc', 'shorts': '#7c7f80', 'trousers': '#3a4458', 'skirt': '#8a3b4a',
                 'sneaker': '#e9e9e4', 'sandal': '#7a5a3a', 'sole': '#f0eee8', 'button': '#e6e3da'}


def _arm_axis(s):
    return Vector((B.ARM_DIR.x * s, B.ARM_DIR.y, B.ARM_DIR.z)).normalized()


def _fore_axis(s):
    return Vector((B.FDIR.x * s, B.FDIR.y, B.FDIR.z)).normalized()


def _colour(ctx, piece, color, key=None):
    """Material key of a garment: `color` is a palette key or a '#rrggbb' hex (created on demand). Only the piece's own default key may
    be absent from the palette (then its default tint is used); any other unknown key raises ValueError."""
    k = color or key or piece

    def hook(M):
        if k in M:
            return
        if not k.startswith('#') and k != (key or piece):
            raise ValueError(f'char_base.outfits: {piece} colour {k!r} is neither a palette key ({sorted(x for x in M if x != "_body")}) nor a hex')
        from looks import _mat
        hx = k if k.startswith('#') else DEFAULT_COLOR[key or piece]
        M[k] = _mat(f"{M['skin'].name[:-len('_body_skin')]}_{k}", srgb(hx), 0.85)
        M['_body'].append(k)
    ctx.hooks.append(hook)
    return k


def _front_y(ctx, z, band=0.012):
    """Front (min y) of the torso at height z near the centre line."""
    ys = []
    for _ in range(MAX_GROW):
        if len(ys) >= 3:
            break
        ys = [p.y for p in ctx.bv if abs(p.z - z) < band and abs(p.x) < 0.02 * ctx.F['gw']]
        band *= 1.5
    if len(ys) < 3:
        raise ValueError(f'char_base.outfits: no torso front found at z={z:.3f}')
    return min(ys)


def _cuff(ctx, label, c0, ax, bone, color, n, s):
    """Hem ring around a sleeve opening: c0 on the limb axis ax, fitted by rays in the plane across the limb."""
    F = ctx.F
    q = Vector((0, 0, 1)).rotation_difference(ax)
    c, ru, rv = _section(ctx, c0, q @ Vector((1, 0, 0)), q @ Vector((0, 1, 0)))
    pad = 0.002 * F['gw']
    ob = torus(f'{ctx.name}_{label}.{n}', c, (ru + rv) / 2 + pad, 0.0058 * F['gw'], ctx.M[color], rot=tuple(q.to_euler()))      # round tube
    B.rigid(ob, ctx.ao, bone)


def _sleeves(ctx, color, sleeve):
    """Sleeve cut planes + trims; returns band rule for the arm. sleeve: 'short' (hem 0.155 m down the upper arm, zc-you) | 'long' (to the wrist)."""
    J, F = ctx.J, ctx.F
    _sleeve('sleeve', 'sleeve', sleeve)
    if sleeve == 'long':
        fl = (J['WR'] - J['EL']).length - 0.012 * F['gw']       # cuff ends just short of the wrist
        for s in (1, -1):
            ctx.planes.append((4, tuple(B.mirror(J['EL'], s) + _fore_axis(s) * fl), tuple(_fore_axis(s))))

        def arm(dom, c):
            s = 1 if c.x >= 0 else -1
            if dom == 'upper_arm':
                return color
            if dom == 'forearm':
                return color if (c - B.mirror(J['EL'], s)).dot(_fore_axis(s)) < fl else None
            return None

        def trims():
            for s, n in ((1, 'L'), (-1, 'R')):
                _cuff(ctx, 'sleeve_hem', B.mirror(J['EL'], s) + _fore_axis(s) * fl, _fore_axis(s), f'forearm.{n}', color, n, s)
        ctx.trims.append(trims)
        return arm
    sl = 0.155
    sd = sl * (J['EL'] - J['SH']).length / (B.UPPER_ARM ** 2 + B.ELBOW_Y ** 2) ** 0.5
    for s in (1, -1):
        ax = _arm_axis(s)
        ctx.planes.append((3, tuple(B.mirror(J['SH'], s) + ax * sd), tuple(ax)))

    def arm(dom, c):
        if dom == 'upper_arm':
            s = 1 if c.x >= 0 else -1
            return color if (c - B.mirror(J['SH'], s)).dot(_arm_axis(s)) < sd else None
        return None

    def trims():
        for s, n in ((1, 'L'), (-1, 'R')):
            ax = _arm_axis(s)
            _cuff(ctx, 'sleeve_hem', B.mirror(J['SH'], s) + ax * sd, ax, f'upper_arm.{n}', color, n, s)
    ctx.trims.append(trims)
    return arm


def _top(ctx, piece, color, fold, sleeve, hem=0.010, neck=0.3):
    """Shared body of tee / shirt: neckline, hem, sleeves. hem = metres (x gw) of hem below the pelvis joint; neck = fraction of neck->head_base."""
    J, F = ctx.J, ctx.F
    zn = J['neck'].z + (J['head_base'].z - J['neck'].z) * neck
    zh = J['pelvis'].z - hem * F['gw']
    ctx.planes += [(0, (0, 0, zn), (0, 0, 1)), (1, (0, 0, zh), (0, 0, 1))]
    arm = _sleeves(ctx, color, sleeve)

    def band(dom, c):
        if dom in TORSO:
            return color if zh <= c.z <= zn else None
        if dom == 'neck':
            return None if c.z > zn else color
        if dom == 'thigh':
            return color if c.z >= zh else None
        return arm(dom, c)
    ctx.bands.append(band)
    if fold:
        ctx.fold[color] = fold
        ctx.drape = (zh, J['spine'].z + 0.13 * F['gw'], J['spine'].z, 0.07 * F['gw'])
    return zn, zh


def tee(ctx, color='tee', fold=0.0, sleeve='short'):
    """T-shirt: neckline, hem over the waistband, short sleeves (sleeve = 'short' | 'long')."""
    color = _colour(ctx, 'tee', color)
    zn, zh = _top(ctx, 'tee', color, fold, sleeve)

    def trims():
        _rim(ctx, 'collar', zn, 0.0072, color, 'neck', 0.003, _neck(ctx), _neck_r(ctx))
        _rim(ctx, 'shirt_hem', zh, 0.0065, color, 'spine', 0.002, _spine(ctx))
    ctx.trims.insert(0, trims)       # collar + hem first, sleeve hems after (the zc-you object order)


def shirt(ctx, color='shirt', fold=0.0, sleeve='long', buttons=5):
    """Button shirt: stand collar, longer hem, button placket decal down the front, long sleeves by default."""
    color = _colour(ctx, 'shirt', color)
    bcol = _colour(ctx, 'shirt', None, 'button')
    zn, zh = _top(ctx, 'shirt', color, fold, sleeve, hem=0.060)
    J, F = ctx.J, ctx.F

    def trims():
        _rim(ctx, 'collar', zn, 0.0105, color, 'neck', 0.006, _neck(ctx), _neck_r(ctx))
        _rim(ctx, 'collar_fold', zn + 0.004 * F['gw'], 0.0070, color, 'neck', 0.010, _neck(ctx), _neck_r(ctx))
        _rim(ctx, 'shirt_hem', zh, 0.0070, color, 'pelvis', 0.002, _spine(ctx))
        z0, z1 = zn - 0.035 * F['gw'], zh + 0.030 * F['gw']
        for i in range(buttons):
            z = z0 + (z1 - z0) * i / max(buttons - 1, 1)
            y = _front_y(ctx, z) + 0.0006
            b = ellipsoid(f'{ctx.name}_button{i}', Vector((0, y, z)), (0.0062 * F['gw'], 0.0022 * F['gw'], 0.0062 * F['gw']), ctx.M[bcol], seg=12, rings=8)
            B.rigid(b, ctx.ao, 'chest' if z > J['spine'].z else 'spine' if z > J['pelvis'].z else 'pelvis')
        zs = [z0 + 0.012 * F['gw'], z1 - 0.012 * F['gw']]
        pl = ellipsoid(f'{ctx.name}_placket', Vector((0, _front_y(ctx, 0.5 * (z0 + z1)) + 0.0004, 0.5 * (z0 + z1))),
                       (0.0045 * F['gw'], 0.0014 * F['gw'], 0.5 * (z1 - z0) + 0.012 * F['gw']), ctx.M[color], seg=10, rings=10)
        B.rigid(pl, ctx.ao, 'spine')
    ctx.trims.insert(0, trims)


def tank(ctx, color='tank', fold=0.0):
    """Tank top: scoop neckline at armpit height, two shoulder straps, no sleeves."""
    color = _colour(ctx, 'tank', color)
    J, F = ctx.J, ctx.F
    g = F['gw']
    zn = J['SH'].z - 0.075 * g
    zh = J['pelvis'].z - 0.010 * g
    x0, x1, zt = 0.040 * g, 0.080 * g, J['SH'].z + 0.050 * g
    ctx.planes += [(0, (0, 0, zn), (0, 0, 1)), (1, (0, 0, zh), (0, 0, 1))]
    for i, x in enumerate((x0, x1)):
        ctx.planes += [(5 + 2 * i, (x, 0, 0), (1, 0, 0)), (6 + 2 * i, (-x, 0, 0), (1, 0, 0))]

    def band(dom, c):
        if dom in TORSO or dom == 'neck':
            if c.z < zn:
                return color if c.z >= zh and dom != 'clavicle' else None
            return color if x0 < abs(c.x) < x1 and c.z < zt else None
        if dom == 'thigh':
            return color if c.z >= zh else None
        return None
    ctx.bands.append(band)

    def trims():
        _rim(ctx, 'shirt_hem', zh, 0.0065, color, 'spine', 0.002, _spine(ctx))
    ctx.trims.append(trims)
    if fold:
        ctx.fold[color] = fold
        ctx.drape = (zh, J['spine'].z + 0.13 * g, J['spine'].z, 0.07 * g)


def shorts(ctx, color='shorts', fold=0.0):
    """Shorts: waistband just above the shirt hem, leg hems at 73% down the thigh (zc-you: 0.60 m)."""
    color = _colour(ctx, 'shorts', color)
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
        _rim(ctx, 'shorts_band', zb, 0.0085, color, 'pelvis', 0.001, _spine(ctx))
        for s, n in ((1, 'L'), (-1, 'R')):
            _rim(ctx, f'shorts_hem.{n}', zl, 0.0060, color, f'thigh.{n}', 0.002, _leg(ctx, s))
    ctx.trims.append(trims)
    if fold:
        ctx.fold[color] = fold


def trousers(ctx, color='trousers', fold=0.0):
    """Long trousers: waistband like the shorts, hems just above the ankle."""
    color = _colour(ctx, 'trousers', color)
    J, F = ctx.J, ctx.F
    top = J['pelvis'].z - 0.010 * F['gw']
    zb = J['pelvis'].z + 0.005 * F['gw']
    zl = J['ANK'].z + 0.045 * F['gw']
    ctx.planes.append((2, (0, 0, zl), (0, 0, 1)))

    def band(dom, c):
        if dom in TORSO:
            return color if c.z < top else None
        if dom == 'thigh':
            return color if c.z < top else None
        if dom == 'shin':
            return color if c.z > zl else None
        return None
    ctx.bands.append(band)

    def trims():
        _rim(ctx, 'trousers_band', zb, 0.0085, color, 'pelvis', 0.001, _spine(ctx))
        for s, n in ((1, 'L'), (-1, 'R')):
            _rim(ctx, f'trousers_hem.{n}', zl, 0.0065, color, f'shin.{n}', 0.003, _leg(ctx, s, lower=True))
    ctx.trims.append(trims)
    if fold:
        ctx.fold[color] = fold


def _smooth(t):
    t = min(1.0, max(0.0, t))
    return t * t * (3 - 2 * t)


def skirt(ctx, color='skirt', length=0.85, flare=1.0, thickness=0.004, nu=40, nv=16):
    """Separate A-line skirt shell (closed thin solid) from just under the shirt hem to `length` of the way hip->knee.
    Each ring clears the body section plus a margin that grows with the flare; weights blend pelvis and thigh.L/.R
    (down the hip, toward the front, by side) so the hem follows the legs in sit / stride / crouch."""
    color = _colour(ctx, 'skirt', color)
    J, F = ctx.J, ctx.F
    g = F['gw']
    zt = J['pelvis'].z - 0.014 * g
    zb = J['HIP'].z + (J['KNEE'].z - J['HIP'].z) * length

    def trims():
        bm = bmesh.new()
        rings = []
        dz = abs(zb - zt) / nv
        tx = 0.21 * F['rt']
        for i in range(nv + 1):
            v = i / nv
            z = zt + (zb - zt) * v
            cx, cy, rx, ry = _fit_h(ctx, z)
            pts = [(p.x - cx, p.y - cy) for p in ctx.bv if abs(p.z - z) < 1.2 * dz and abs(p.x) < tx]
            polar = [(math.atan2(y, x), math.hypot(x, y)) for x, y in pts]
            m = (0.020 + 0.080 * flare * v ** 1.4) * g
            ring = []
            for j in range(nu):
                th = 2 * math.pi * j / nu
                ell = (math.cos(th) / (rx + 0.002)) ** 2 + (math.sin(th) / (ry + 0.002)) ** 2
                r = ell ** -0.5          # ellipse through the section extents ...
                for a, rho in polar:     # ... pushed out to the true section radius within +-20 deg (union-of-legs corners)
                    da = abs((a - th + math.pi) % (2 * math.pi) - math.pi)
                    if da < math.radians(20) and rho > r:
                        r = rho
                r += m
                wob = 1 + 0.03 * flare * v * math.sin(7 * th)
                ring.append(bm.verts.new(Vector((cx + r * math.cos(th) * wob, cy + r * math.sin(th) * wob, z))))
            rings.append(ring)
        for i in range(nv):
            for j in range(nu):
                bm.faces.new((rings[i][j], rings[i][(j + 1) % nu], rings[i + 1][(j + 1) % nu], rings[i + 1][j]))
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
        bmesh.ops.solidify(bm, geom=bm.faces[:], thickness=thickness * g)
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
        ob = _obj(f'{ctx.name}_skirt', bm, ctx.M[color])
        hz, hy = J['HIP'].z, 0.0
        w = []
        for v in ob.data.vertices:
            p = v.co
            td = _smooth((hz + 0.01 * g - p.z) / (0.14 * g))
            fr = min(1.0, max(0.0, 0.5 - (p.y - hy) / (0.16 * g)))
            ts = td * (0.4 + 0.6 * fr)
            sl = _smooth(0.5 + p.x / (0.14 * g))
            d = {'pelvis': 1 - ts, 'thigh.L': ts * sl, 'thigh.R': ts * (1 - sl)}
            w.append({k: x for k, x in d.items() if x > 1e-4})
        B.vg_bind(ob, ctx.ao, w)
    ctx.trims.append(trims)


# ----------------------------------------------------------------------------- shoes
def _interp(tab, u):
    for (u0, a), (u1, b) in zip(tab, tab[1:]):
        if u <= u1:
            return a + (b - a) * (u - u0) / (u1 - u0)
    return tab[-1][1]


SHOE_H = ((0, .066), (.12, .085), (.25, .108), (.40, .088), (.55, .070), (.75, .058), (1, .040))     # upper height above the floor (fs metres)
SHOE_W = ((0, .033), (.25, .037), (.60, .0455), (.80, .046), (1, .036))                                  # half width


def _foot_span(ctx, s):
    """Heel-back and toe-tip y of the foot on side s from the body mesh and the TOE joint."""
    J, fs = ctx.J, ctx.F['fs']
    hx = J['HIP'].x * s
    yb = max(p.y for p in ctx.bv if p.z < 0.1 * fs and abs(p.x - hx) < 0.06 * fs) + 0.008 * fs
    return hx, yb, J['TOE'].y - 0.012 * fs


def _shoe_loft(name, hx, yb, yt, fs, mat, zb, ztop, grow=0.0, n=3.0, N=18, M=20, e0=0.12, e1=0.18):
    """Closed superellipse loft from heel (u=0) to toe (u=1); ztop(u) = height above zb of the rim at u."""
    bm = bmesh.new()
    rings = []
    for k in range(N + 1):
        u = 0.5 - 0.5 * math.cos(math.pi * k / N)
        y = yb + (yt - yb) * u
        c = math.sqrt(max(0.0, 1 - (1 - u / e0) ** 2)) if u < e0 else math.sqrt(max(0.0, 1 - ((u - 1 + e1) / e1) ** 2)) if u > 1 - e1 else 1.0
        w = (_interp(SHOE_W, u) * fs + grow) * c
        top = zb + (ztop(u) - zb) * c ** 0.5
        if k in (0, N):
            rings.append(bm.verts.new(Vector((hx, y + (-grow if k == 0 else grow) * 0 + (grow if k == 0 else -grow), zb + 0.4 * (ztop(u) - zb)))))
            continue
        ring = []
        for j in range(M):
            th = 2 * math.pi * j / M
            cx, sx = math.cos(th), math.sin(th)
            ex = math.copysign(abs(cx) ** (2 / n), cx)
            ez = math.copysign(abs(sx) ** (2 / n), sx)
            ring.append(bm.verts.new(Vector((hx + w * ex, y, zb + (top - zb) * (0.5 + 0.5 * ez)))))
        rings.append(ring)
    for k in range(N):
        a, b = rings[k], rings[k + 1]
        for j in range(M):
            j1 = (j + 1) % M
            if k == 0:
                bm.faces.new((a, b[j1], b[j]))
            elif k == N - 1:
                bm.faces.new((a[j], a[j1], b))
            else:
                bm.faces.new((a[j], a[j1], b[j1], b[j]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    return _obj(name, bm, mat)


def _strap(name, c, rx, rz, width, thick, mat, M=24):
    """Flat ribbon ring in the x-z plane around the foot (ellipse radii rx, rz) centred at c."""
    bm = bmesh.new()
    rows = []
    for j in range(M):
        th = 2 * math.pi * j / M
        d = Vector((rx * math.cos(th), 0, rz * math.sin(th)))
        nrm = Vector((math.cos(th) / rx, 0, math.sin(th) / rz)).normalized()
        row = []
        for dy, dr in ((-width / 2, 0), (width / 2, 0), (width / 2, thick), (-width / 2, thick)):
            row.append(bm.verts.new(c + d + Vector((0, dy, 0)) + nrm * dr))
        rows.append(row)
    for j in range(M):
        a, b = rows[j], rows[(j + 1) % M]
        for q in range(4):
            bm.faces.new((a[q], a[(q + 1) % 4], b[(q + 1) % 4], b[q]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    return _obj(name, bm, mat)


def sneaker(ctx, color='sneaker', sole='sole'):
    """Sneaker per foot: rubber sole (bottom on the floor) + closed upper + laces, rigid on the foot bone."""
    color = _colour(ctx, 'sneaker', color)
    sole = _colour(ctx, 'sneaker', sole if sole != 'sole' else None, 'sole')

    def trims():
        fs = ctx.F['fs']
        for s, n in ((1, 'L'), (-1, 'R')):
            hx, yb, yt = _foot_span(ctx, s)
            up = _shoe_loft(f'{ctx.name}_sneaker.{n}', hx, yb, yt, fs, ctx.M[color], 0.011 * fs, lambda u: _interp(SHOE_H, u) * fs)
            so = _shoe_loft(f'{ctx.name}_sneaker_sole.{n}', hx, yb + 0.003 * fs, yt - 0.003 * fs, fs, ctx.M[sole], 0.0, lambda u: 0.016 * fs, grow=0.003 * fs)
            B.rigid(up, ctx.ao, f'foot.{n}')
            B.rigid(so, ctx.ao, f'foot.{n}')
            for i, u in enumerate((0.28, 0.35, 0.42, 0.49)):
                y = yb + (yt - yb) * u
                z = _interp(SHOE_H, u) * fs - 0.001 * fs
                lc = ellipsoid(f'{ctx.name}_sneaker_lace{i}.{n}', Vector((hx, y, z)), (0.016 * fs, 0.0035 * fs, 0.0022 * fs), ctx.M[sole], seg=10, rings=6)
                B.rigid(lc, ctx.ao, f'foot.{n}')
    ctx.trims.append(trims)


def sandal(ctx, color='sandal', sole='sole'):
    """Sandal per foot: flat sole + instep strap + ankle strap (toes stay free; add `barefoot` for toes)."""
    color = _colour(ctx, 'sandal', color)
    sole = _colour(ctx, 'sandal', sole if sole != 'sole' else None, 'sole')

    def trims():
        fs = ctx.F['fs']
        for s, n in ((1, 'L'), (-1, 'R')):
            hx, yb, yt = _foot_span(ctx, s)
            so = _shoe_loft(f'{ctx.name}_sandal_sole.{n}', hx, yb, yt, fs, ctx.M[sole], 0.0, lambda u: 0.011 * fs, grow=0.002 * fs)
            B.rigid(so, ctx.ao, f'foot.{n}')
            for lab, u, zc, rz in (('instep', 0.45, 0.034, 0.030), ('ankle', 0.12, 0.052, 0.048)):
                st = _strap(f'{ctx.name}_sandal_{lab}.{n}', Vector((hx, yb + (yt - yb) * u, zc * fs)), 0.037 * fs, rz * fs, 0.012 * fs, 0.0025 * fs, ctx.M[color])
                B.rigid(st, ctx.ao, f'foot.{n}')
    ctx.trims.append(trims)


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
    """Darker sweat/grime patches on material `on` (object-space noise); not blood. color is a '#rrggbb' hex."""
    if not HEX.fullmatch(color):
        raise ValueError(f"char_base.outfits: grime.color={color!r} must be a '#rrggbb' hex string")

    def hook(M):
        if on not in M:
            raise ValueError(f'char_base.outfits: grime.on={on!r} is not a material (one of {sorted(x for x in M if x != "_body")})')
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


PIECES = {'tee': tee, 'shirt': shirt, 'tank': tank, 'shorts': shorts, 'trousers': trousers, 'skirt': skirt,
          'sneaker': sneaker, 'sandal': sandal, 'barefoot': barefoot, 'grime': grime}
BAND_PIECES = ('tee', 'shirt', 'tank', 'shorts', 'trousers')
