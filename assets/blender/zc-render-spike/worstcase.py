"""ZCONDO worst-case render-speed check (Eevee 64 vs Cycles 40spp + OIDN), VB-ZCONDO-SHORT-R3.

Reuses the two earlier blockouts by exec-ing their build scripts (without their trailing main()):
  assets/blender/zc-render-spike/build.py  -> B08 balcony city (build_balcony, apply_preset)
  assets/blender/zc-corridor/build.py      -> production-staged corridor + baked volume probes (build)
and layers the heavy content on top (throwaway placeholders, not production assets).

Usage (headless, repo root):
  Blender -b --python assets/blender/zc-render-spike/worstcase.py -- <case> <preset> <frames>
    case   : b08worst  (B08: +4 near fire clusters/lights, +3 close smoke domains, ~800 towers, 300 embers, moon + fire lights)
             charots   (corridor B01-SH01 OTS: 8000-strand infected hair, 3000-strand "you" hair, 2048 px textured shirts,
                        ~20 blood decals, baked GI probes)
             charclose (same character set, long-lens 18 deg close on the infected facing camera, SH02-like)
    preset : eevee64 | eevee64t8 | eevee64t4 | eevee64t2 (volumetric tile size, b08worst only) | cycles40dn
    frames : comma list. b08worst frames 0..104; char cases Blender frames 1..150
Output : out/blender/zc-render-spike/worst/<case>/<preset>/F###.png ; timings -> assets/blender/zc-render-spike/worstcase-manifest.json
"""
import bpy, sys, os, json, math, time, hashlib
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
MANIFEST = os.path.join(HERE, 'worstcase-manifest.json')


def load(path):
    src = open(path).read().rstrip()
    assert src.endswith('main()')
    ns = {'__file__': path, '__name__': 'zc_ns'}
    exec(compile(src[:-len('main()')], path, 'exec'), ns)
    return ns


SP = load(os.path.join(HERE, 'build.py'))
CO = load(os.path.join(ROOT, 'assets', 'blender', 'zc-corridor', 'build.py'))


def parse():
    a = sys.argv[sys.argv.index('--') + 1:]
    return a[0], a[1], [int(x) for x in a[2].split(',')]


# ------------------------------------------------------------------ B08 worst case
def extra_b08():
    import random
    rnd = random.Random(777)
    TOP = 60.0
    P = SP['prim']
    fire = SP['mat']('ZC_fire2', (1.0, 0.4, 0.1), 0.5, emit=(1.0, 0.35, 0.06), strength=45.0)
    tower = SP['mat']('ZC_tower2', (0.19, 0.20, 0.23), 0.85)
    ember = SP['mat']('ZC_ember', (1.0, 0.5, 0.1), 0.5, emit=(1.0, 0.45, 0.08), strength=80.0)
    # denser city: ~540 more towers (grid 20 m cells, 25% gaps) -> ~800 total
    n = 0
    for gx in range(-30, 31):
        for gy in range(1, 36):
            if rnd.random() < 0.25:
                continue
            x, y = gx * 20 + rnd.uniform(-5, 5), 25 + gy * 20 + rnd.uniform(-5, 5)
            if abs(x) < 25 and y < 60:
                continue
            w, d, h = rnd.uniform(7, 15), rnd.uniform(7, 15), rnd.uniform(10, 70)
            SP['box'](f'ZC_Tower2_{n}', x - w / 2, x + w / 2, y - d / 2, y + d / 2, 0, h, tower)
            n += 1
    # four more, closer fire clusters with warm lights + smoke (total 8 fire clusters)
    near = [(-45, 110, 42, 0.8), (70, 140, 36, 0.7), (-110, 170, 25, 0.8), (15, 90, 38, 0.6)]
    for i, (x, y, z, s) in enumerate(near):
        for j in range(7):
            P('sphere', f'ZC_Fire2_{i}_{j}', (x + rnd.uniform(-6, 6) * s, y + rnd.uniform(-4, 4), z + rnd.uniform(0, 4) * s),
              (2.5 * s, 2.5 * s, 3.5 * s), fire)
        SP['point'](f'ZC_FireLight2_{i}', (x, y - 8, z + 4), (1.0, 0.45, 0.12), 4.0e5 * s, radius=6)
    # closer + bigger smoke: big domains in front of / beside the main fire and just past the railing
    smokes = [(-45, 110, 42 + 28, (45, 34, 56)), (70, 140, 36 + 26, (50, 36, 52)), (-60, 215, 30 + 40, (80, 55, 80)),
              (-20, 38, 62 + 6, (24, 16, 20))]  # last one: a thin plume drifting ~35 m from the balcony
    for i, (x, y, z, sc_) in enumerate(smokes):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, z))
        sm = bpy.context.object
        sm.name = f'ZC_Smoke2_{i}'
        sm.scale = sc_
        sm.data.materials.append(SP['smoke_material'](f'ZC_smoke2_{i}', 20 + i * 2.7))
    # embers: 300 tiny emissive icospheres rising around the main cluster and in the near field
    for k in range(300):
        c = (-60, 220, 30) if k % 2 == 0 else (-20, 60, 62)
        spread = 40 if k % 2 == 0 else 15
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=rnd.uniform(0.04, 0.25) * (3 if k % 2 == 0 else 1),
                                              location=(c[0] + rnd.gauss(0, spread), c[1] + rnd.gauss(0, spread), c[2] + rnd.uniform(0, 70)))
        bpy.context.object.name = f'ZC_Ember_{k}'
        bpy.context.object.data.materials.append(ember)


def build_b08(preset):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    tile = '8'
    if preset.startswith('eevee'):
        info = SP['apply_preset'](sc, 'eevee64')
        if preset in ('eevee64t4', 'eevee64t2'):
            tile = preset[-1]
        sc.eevee.volumetric_tile_size = tile
        info['volumetrics'] = f'tile {tile}, 64 samples, end 400 m, volumetric shadows on'
    else:
        info = SP['apply_preset'](sc, 'cycles40dn')
    SP['build_balcony']()
    extra_b08()
    return sc, info


# ------------------------------------------------------------------ character-heavy case
def fabric_images():
    rng = np.random.default_rng(5)
    N = 2048
    yy, xx = np.mgrid[0:N, 0:N].astype(np.float32)
    weave = 0.5 + 0.25 * np.sin(xx * 0.55) * np.sin(yy * 0.55) + 0.1 * rng.random((N, N), dtype=np.float32)
    # low-frequency folds (sum of a few sinusoids) and stains
    fold = 0.5 + 0.5 * np.sin(xx / 90 + 3 * np.sin(yy / 250)) * np.sin(yy / 140 + 2 * np.sin(xx / 310))
    stain = np.zeros((N, N), np.float32)
    for _ in range(14):
        cx, cy, r = rng.uniform(0, N), rng.uniform(N * 0.4, N), rng.uniform(40, 160)
        stain = np.maximum(stain, np.exp(-(((xx - cx) ** 2 + (yy - cy) ** 2) / (2 * r * r))) * rng.uniform(0.3, 0.9))
    height = (0.6 * weave + 0.4 * fold).astype(np.float32)

    def make(name, arr, nc):
        im = bpy.data.images.new(name, N, N, alpha=False, float_buffer=False)
        im.colorspace_settings.name = 'sRGB' if nc else 'Non-Color'
        px = np.ones((N, N, 4), np.float32)
        px[..., :3] = arr[..., None] if arr.ndim == 2 else arr
        im.pixels.foreach_set(px.ravel())
        im.pack()
        return im

    shirt = np.stack([0.82 - 0.35 * stain - 0.12 * (1 - weave), 0.80 - 0.40 * stain - 0.12 * (1 - weave),
                      0.74 - 0.55 * stain - 0.12 * (1 - weave)], axis=-1).clip(0, 1) * (0.9 + 0.1 * fold[..., None])
    stripes = 0.5 + 0.5 * np.sign(np.sin(yy / 22))
    tee = np.stack([0.17 + 0.05 * stripes, 0.33 + 0.07 * stripes, 0.33 + 0.07 * stripes], axis=-1) * (0.88 + 0.12 * weave[..., None])
    return (make('zc_shirt_col', shirt.astype(np.float32), True), make('zc_shirt_bump', height, False),
            make('zc_tee_col', tee.astype(np.float32), True))


def blood_image(kind, name):
    rng = np.random.default_rng({'splat': 1, 'smear': 2, 'hand': 3}[kind])
    N = 512
    yy, xx = np.mgrid[0:N, 0:N].astype(np.float32) / N
    a = np.zeros((N, N), np.float32)
    if kind == 'splat':
        for _ in range(26):
            cx, cy, r = rng.normal(0.5, 0.14), rng.normal(0.4, 0.16), rng.uniform(0.015, 0.09)
            a = np.maximum(a, (((xx - cx) ** 2 + (yy - cy) ** 2) < r * r).astype(np.float32))
        for _ in range(5):  # drips
            cx, cy, w, ln = rng.uniform(0.3, 0.7), rng.uniform(0.3, 0.5), rng.uniform(0.008, 0.02), rng.uniform(0.15, 0.4)
            a = np.maximum(a, ((np.abs(xx - cx) < w) & (yy > cy) & (yy < cy + ln)).astype(np.float32))
    elif kind == 'smear':
        w = 0.07 + 0.05 * np.sin(xx * 14)
        a = ((np.abs(yy - 0.5 - 0.06 * np.sin(xx * 7)) < w * (1 - xx * 0.7)) & (xx > 0.03)).astype(np.float32)
        a *= (0.55 + 0.45 * rng.random((N, N), dtype=np.float32) * (1 - xx))
    else:  # hand
        a = ((((xx - 0.5) / 0.22) ** 2 + ((yy - 0.68) / 0.2) ** 2) < 1).astype(np.float32)
        for ang, ln in zip((-0.5, -0.2, 0.0, 0.2, 0.45), (0.28, 0.4, 0.44, 0.38, 0.26)):
            dx, dy = math.sin(ang), -math.cos(ang)
            t = ((xx - 0.5 - 0.15 * ang) * dx + (yy - 0.55) * dy)
            d = np.abs((xx - 0.5 - 0.15 * ang) * dy - (yy - 0.55) * dx)
            a = np.maximum(a, ((d < 0.04) & (t > 0) & (t < ln)).astype(np.float32))
    im = bpy.data.images.new(name, N, N, alpha=True)
    px = np.zeros((N, N, 4), np.float32)
    px[..., 0], px[..., 1], px[..., 2] = 0.20, 0.02, 0.02
    px[..., 3] = a.clip(0, 1)
    im.pixels.foreach_set(px.ravel())
    im.alpha_mode = 'STRAIGHT'
    im.pack()
    return im


def texture_materials(m):
    shirt_col, shirt_bump, tee_col = fabric_images()
    for key, col, bump in (('sleep', shirt_col, shirt_bump), ('tee', tee_col, shirt_bump)):
        nt = m[key].node_tree
        bsdf = nt.nodes['Principled BSDF']
        t = nt.nodes.new('ShaderNodeTexImage')
        t.image = col
        nt.links.new(t.outputs['Color'], bsdf.inputs['Base Color'])
        b = nt.nodes.new('ShaderNodeTexImage')
        b.image = bump
        bn = nt.nodes.new('ShaderNodeBump')
        bn.inputs['Strength'].default_value = 0.6
        bn.inputs['Distance'].default_value = 0.004
        nt.links.new(b.outputs['Color'], bn.inputs['Height'])
        nt.links.new(bn.outputs['Normal'], bsdf.inputs['Normal'])


def blood_mat(name, img):
    mt = bpy.data.materials.new(name)
    mt.use_nodes = True
    mt.surface_render_method = 'DITHERED'
    nt = mt.node_tree
    b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (0.20, 0.02, 0.02, 1)
    b.inputs['Roughness'].default_value = 0.28
    t = nt.nodes.new('ShaderNodeTexImage')
    t.image = img
    nt.links.new(t.outputs['Alpha'], b.inputs['Alpha'])
    nt.links.new(t.outputs['Color'], b.inputs['Base Color'])
    return mt


def decal(name, mt, loc, rot, size, parent=None, target=None, offset=0.0025):
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=20, y_subdivisions=20, size=1, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    o.scale = (size[0], size[1], 1)
    o.data.materials.append(mt)
    if parent is not None:
        o.parent = parent
        # keep world transform: the figure root is at identity world pose when decals are placed
    if target is not None:
        s = o.modifiers.new('wrap', 'SHRINKWRAP')
        s.target = target
        s.wrap_method = 'PROJECT'
        s.use_project_z = True
        s.use_negative_direction = True
        s.use_positive_direction = False
        s.offset = offset
    return o


def hair_material(name, color):
    mt = bpy.data.materials.new(name)
    mt.use_nodes = True
    nt = mt.node_tree
    nt.nodes.remove(nt.nodes['Principled BSDF'])
    h = nt.nodes.new('ShaderNodeBsdfHairPrincipled')
    h.parametrization = 'COLOR'
    h.inputs['Color'].default_value = (*color, 1)
    h.inputs['Roughness'].default_value = 0.35
    nt.links.new(h.outputs['BSDF'], nt.nodes['Material Output'].inputs['Surface'])
    return mt


def make_curves(name, parent, strands, mat_):
    """strands: list of (npts, 3) float arrays in the parent's local frame."""
    c = bpy.data.hair_curves.new(name)
    o = bpy.data.objects.new(name, c)
    bpy.context.scene.collection.objects.link(o)
    c.add_curves([len(s) for s in strands])
    c.attributes['position'].data.foreach_set('vector', np.concatenate(strands).astype(np.float32).ravel())
    r = c.attributes.new('radius', 'FLOAT', 'POINT')
    rad = np.concatenate([0.0007 * (1 - 0.65 * np.linspace(0, 1, len(s))) for s in strands]).astype(np.float32)
    r.data.foreach_set('value', rad)
    c.materials.append(mat_)
    o.parent = parent
    return o


def infected_hair(n=8000, npts=10, seed=11):
    rng = np.random.default_rng(seed)
    cx, cy, cz, rx, ry, rz = 0.0, -0.03, 1.54, 0.083, 0.098, 0.113
    nclump = 260
    clump_az = rng.uniform(0, 2 * np.pi, nclump)
    out = []
    for i in range(n):
        az = clump_az[i % nclump] + rng.normal(0, 0.03)
        if math.cos(az) > 0.45 and abs(math.sin(az)) < 0.35 and rng.random() > 0.08:
            az += math.pi   # keep the face mostly clear: only side locks and a sparse fringe hang in front
        front = math.cos(az) > 0.45
        ph = math.radians(rng.uniform(8, 105))
        if front:
            ph = math.radians(rng.uniform(8, 62))
        dx, dy = math.sin(az), -math.cos(az)
        r0 = np.array([cx + rx * math.sin(ph) * dx, cy + ry * math.sin(ph) * dy, cz + rz * math.cos(ph)])
        L = rng.uniform(0.12, 0.30) if front else rng.uniform(0.42, 0.62)
        ph0, ph1, ph2 = rng.uniform(0, 6.28, 3)
        pts = []
        for k in range(npts):
            t = k / (npts - 1)
            rad_start = math.sin(ph)
            rad_end = (0.115 + 0.025 * math.cos(az * 2)) if not front else (0.125)
            e = min(1.0, t * 2.2)
            horiz = (rx * rad_start) * (1 - e) + rad_end * e
            vert = r0[2] - t * L - 0.03 * math.sin(math.pi * min(1, t * 2))
            wob = 0.012 * t * math.sin(t * 7 + ph0)
            px = cx + dx * (horiz * (1 if abs(dx) < 0.01 else 1.0)) + wob * dy
            py = cy + (dy * horiz * (ry / rx if t < 0.2 else 1.0)) - wob * dx
            if not front and dy > 0:
                py = max(py, cy + 0.05) + 0.02 * t  # back hair sits behind the shoulders
            pts.append((px, py, vert))
        out.append(np.array(pts, np.float32))
    return out


def you_hair(n=3000, npts=5, seed=13):
    rng = np.random.default_rng(seed)
    cx, cy, cz, rx, ry, rz = 0.0, -0.005, 1.60, 0.085, 0.10, 0.115
    out = []
    for _ in range(n):
        az = rng.uniform(0, 2 * np.pi)
        front = math.cos(az) > 0.3
        ph = math.radians(rng.uniform(5, 55 if front else 80))
        dx, dy = math.sin(az), -math.cos(az)
        L = rng.uniform(0.015, 0.035)
        pts = []
        for k in range(npts):
            t = k / (npts - 1)
            s = 1.0 + 0.1 * t
            pts.append((cx + rx * s * math.sin(ph) * dx * (1 + 0.03 * t), cy + ry * s * math.sin(ph) * dy * (1 + 0.03 * t),
                        cz + rz * s * math.cos(ph) - t * L))
        out.append(np.array(pts, np.float32))
    return out


def build_char(preset, close):
    sc, info = CO['build']('eevee64')
    if preset.startswith('cycles'):
        info = SP['apply_preset'](sc, 'cycles40dn')
    m = {mm.name: mm for mm in bpy.data.materials}
    texture_materials({'sleep': m['zc_inf_sleepshirt'], 'tee': m['zc_you_tee']})
    inf = bpy.data.objects['zc-infected']
    you = bpy.data.objects['zc-you']
    hair_inf = hair_material('zc_hair_inf', (0.07, 0.05, 0.04))
    hair_you = hair_material('zc_hair_you', (0.02, 0.02, 0.02))
    make_curves('zc-inf_hair_curves', inf, infected_hair(), hair_inf)
    make_curves('zc-you_hair_curves', you, you_hair(), hair_you)
    # decals (figure-local placement; world pose of the figure root is applied through parenting)
    splat = blood_mat('zc_blood_splat', blood_image('splat', 'zc_bl_splat'))
    smear = blood_mat('zc_blood_smear2', blood_image('smear', 'zc_bl_smear'))
    hand = blood_mat('zc_blood_hand', blood_image('hand', 'zc_bl_hand'))
    X90 = (math.radians(90), 0, 0)  # plane normal -> -Y (figure front)
    D = decal
    head, shirt = bpy.data.objects['zc-inf_head'], bpy.data.objects['zc-inf_shirt']
    D('zc-inf_bl_mouth', splat, (0.0, -0.18, 1.49), X90, (0.075, 0.075), inf, head)
    D('zc-inf_bl_chin', smear, (0.0, -0.17, 1.44), (math.radians(90), 0, math.radians(-90)), (0.07, 0.05), inf, head)
    D('zc-inf_bl_chest', splat, (0.02, -0.2, 1.12), X90, (0.16, 0.16), inf, shirt)
    D('zc-inf_bl_belly', splat, (-0.03, -0.2, 0.86), X90, (0.2, 0.22), inf, shirt)
    D('zc-inf_bl_hem', smear, (0.05, -0.22, 0.62), (math.radians(90), 0, math.radians(-80)), (0.2, 0.12), inf, shirt)
    for s in (-1, 1):
        D(f'zc-inf_bl_hand{s}', splat, (0.21 * s, -0.12, 0.80), X90, (0.08, 0.08), inf, bpy.data.objects[f'zc-inf_arm{s}'])
    # floor smears / drag trail and handprints on the door-wall face (corridor side), static set decals
    for i, (x, y, sz, rz_) in enumerate([(3.0, -0.8, 0.9, 0.2), (4.6, -1.0, 1.1, -0.3), (6.0, -0.7, 0.8, 0.1), (7.4, -0.95, 1.2, 0.0),
                                       (9.0, -0.8, 1.0, 0.25), (10.5, -0.95, 0.9, -0.1)]):
        D(f'zc-bl_floor{i}', smear if i % 2 == 0 else splat, (x, y, 0.004), (0, 0, rz_), (sz, sz * 0.5))
    for i, (x, z, rz_) in enumerate([(2.6, 1.30, 0.1), (3.2, 1.45, -0.2), (4.8, 1.25, 0.3), (5.5, 1.40, 0.0)]):
        D(f'zc-bl_hand{i}', hand, (x, -0.006, z), (math.radians(90), 0, rz_), (0.18, 0.22))
    if close:
        # SH02-like: long lens 18 deg, infected turned toward camera (front -> -X), head in the upper third
        inf.rotation_euler = (0, 0, math.radians(-90))
        cd = bpy.data.cameras.new('zc-cam_close')
        cd.sensor_fit = 'VERTICAL'
        cd.sensor_height = 24.0
        cd.angle_y = math.radians(18)
        cd.shift_y = 0.12
        cd.clip_start, cd.clip_end = 0.05, 100
        cam = bpy.data.objects.new('zc-cam_close', cd)
        bpy.context.scene.collection.objects.link(cam)
        cam.rotation_euler = (math.radians(90), 0, math.radians(-90))
        cam.location = (7.2, -0.95, 1.40)
        bpy.context.scene.camera = cam
        SP['point']('zc-fill_close', (9.0, -1.1, 2.3), (0.85, 0.95, 1.0), 220.0, radius=0.3)  # strip-light fill so the backlit face reads
    return sc, info


# ------------------------------------------------------------------ run
def merge(key, data):
    mf = json.load(open(MANIFEST)) if os.path.exists(MANIFEST) else {}
    mf[key] = data
    json.dump(mf, open(MANIFEST, 'w'), indent=2, sort_keys=True)


def main():
    case, preset, frames = parse()
    t0 = time.perf_counter()
    if case == 'b08worst':
        sc, info = build_b08(preset)
    else:
        sc, info = build_char(preset, case == 'charclose')
    sc.frame_start, sc.frame_end = 0, 150
    build_s = time.perf_counter() - t0
    outdir = os.path.join(ROOT, 'out', 'blender', 'zc-render-spike', 'worst', case, preset)
    os.makedirs(outdir, exist_ok=True)
    per = []
    for f in frames:
        sc.frame_set(f)
        sc.render.filepath = os.path.join(outdir, f'F{f:03d}.png')
        t = time.perf_counter()
        bpy.ops.render.render(write_still=True)
        dt = time.perf_counter() - t
        sha = hashlib.sha256(open(sc.render.filepath, 'rb').read()).hexdigest()[:16]
        per.append({'frame': f, 'seconds': round(dt, 2), 'png': os.path.relpath(sc.render.filepath, ROOT), 'sha256_16': sha})
        print(f'[zc-worst] {case} {preset} F{f:03d} {dt:.2f}s', flush=True)
    warm = [p['seconds'] for p in per[1:]] or [per[0]['seconds']]
    merge(f'{case}/{preset}', {
        'blender': bpy.app.version_string, 'date': time.strftime('%Y-%m-%d %H:%M'), 'settings': info,
        'build_seconds': round(build_s, 2), 'frames': per, 'first_frame_seconds': per[0]['seconds'],
        'steady_mean_seconds': round(sum(warm) / len(warm), 2), 'all_mean_seconds': round(sum(p['seconds'] for p in per) / len(per), 2),
        'objects': len(bpy.data.objects),
        'command': f'Blender -b --python assets/blender/zc-render-spike/worstcase.py -- {case} {preset} {",".join(map(str, frames))}'})


main()
