"""POOLDEPTH-SHORT feasibility spikes S0/S1/S2 (Boss).

Run headless, one spike at a time:
  /Applications/Blender.app/Contents/MacOS/Blender -b --python assets/blender/pool-depth/build.py -- s0|s1|s2 [--samples N] [--scale 100]
Outputs: renders/<spike>/*.png (local, not committed) and spike-manifest.json (computed numbers, committable).
Every number below is computed here (Snell solver, camera geometry); nothing is hand-placed from the brief.
Design values come from storyboards/pool-depth/short/visual-brief.md (VB-POOLDEPTH-SHORT-R1); units are metres, Z up.
"""
import bpy, bmesh, sys, os, math, json, time
from mathutils import Vector, Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
N_WATER = 1.333          # brief: n = 1.333
W, H = 1080, 1920        # VD10: Short, 30 fps
FPS = 30


# ---------------------------------------------------------------- helpers
def parse():
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    opts = {'spike': a[0] if a else 's0', 'samples': 32, 'scale': 100, 'coin_x': None, 'coin_d': 0.02, 'dist': 1.0, 'ior': N_WATER}
    i = 1
    while i < len(a):
        k = a[i].lstrip('-')
        opts[k] = type(opts.get(k, 1.0))(a[i + 1]) if opts.get(k) is not None else float(a[i + 1])
        i += 2
    return opts


def fresh(samples, scale=100):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    r = sc.render
    r.engine = 'CYCLES'
    r.resolution_x, r.resolution_y, r.resolution_percentage = W, H, scale
    r.fps = FPS
    r.image_settings.file_format = 'PNG'
    r.image_settings.color_mode = 'RGB'
    r.image_settings.color_depth = '8'
    sc.view_settings.view_transform = 'Standard'
    sc.view_settings.look = 'None'
    sc.display_settings.display_device = 'sRGB'
    c = sc.cycles
    c.samples = samples
    c.use_denoising = False
    c.device = 'GPU'
    c.max_bounces = 8
    c.transmission_bounces = 8
    c.glossy_bounces = 4
    c.use_adaptive_sampling = False
    c.seed = 7
    prefs = bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type = 'METAL'
    prefs.refresh_devices() if hasattr(prefs, 'refresh_devices') else prefs.get_devices()
    devs = []
    for d in prefs.devices:
        d.use = (d.type == 'METAL')
        devs.append({'name': d.name, 'type': d.type, 'use': d.use})
    return sc, devs


def material(name, kind, color=(1, 1, 1), strength=1.0, ior=1.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    if kind == 'emission':
        n = nt.nodes.new('ShaderNodeEmission')
        n.inputs['Color'].default_value = (*color, 1)
        n.inputs['Strength'].default_value = strength
    elif kind == 'diffuse':
        n = nt.nodes.new('ShaderNodeBsdfDiffuse')
        n.inputs['Color'].default_value = (*color, 1)
    elif kind == 'glass':
        n = nt.nodes.new('ShaderNodeBsdfGlass')
        n.inputs['Color'].default_value = (1, 1, 1, 1)
        n.inputs['Roughness'].default_value = 0.0
        n.inputs['IOR'].default_value = ior
    elif kind == 'checker':
        n = nt.nodes.new('ShaderNodeBsdfDiffuse')
        t = nt.nodes.new('ShaderNodeTexChecker')
        t.inputs['Scale'].default_value = 8.0
        t.inputs['Color1'].default_value = (0.9, 0.9, 0.9, 1)
        t.inputs['Color2'].default_value = (0.25, 0.5, 0.6, 1)
        nt.links.new(t.outputs['Color'], n.inputs['Color'])
    nt.links.new(n.outputs[0], out.inputs['Surface'])
    return m


def put(obj, mat):
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    return obj


def prim_cyl(name, radius, depth, loc=(0, 0, 0), origin_bottom=True, verts=128):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=radius, depth=depth, location=(0, 0, 0))
    o = bpy.context.active_object
    o.name = name
    if origin_bottom:
        o.data.transform(Matrix.Translation((0, 0, depth / 2)))
    o.location = loc
    return o


def camera(name, loc, fov_v_deg=None, direction=None, ortho_scale=None):
    cd = bpy.data.cameras.new(name)
    cd.sensor_fit = 'VERTICAL'
    if ortho_scale:
        cd.type = 'ORTHO'
        cd.ortho_scale = ortho_scale
    else:
        cd.angle_y = math.radians(fov_v_deg)
    co = bpy.data.objects.new(name, cd)
    bpy.context.scene.collection.objects.link(co)
    co.location = loc
    if direction is not None:
        co.rotation_euler = Vector(direction).to_track_quat('-Z', 'Y').to_euler()
    bpy.context.scene.camera = co
    return co


def world(color=(0.6, 0.7, 0.8), strength=1.0):
    w = bpy.data.worlds.new('W')
    w.use_nodes = True
    bg = w.node_tree.nodes['Background']
    bg.inputs['Color'].default_value = (*color, 1)
    bg.inputs['Strength'].default_value = strength
    bpy.context.scene.world = w


def render_still(sc, path):
    sc.render.filepath = path
    t = time.time()
    bpy.ops.render.render(write_still=True)
    return time.time() - t


def merge_manifest(key, data):
    p = os.path.join(HERE, 'spike-manifest.json')
    m = json.load(open(p)) if os.path.exists(p) else {}
    m[key] = data
    m['_meta'] = {'blender': bpy.app.version_string, 'units': 'metre, Z up', 'output': f'{W}x{H}@{FPS}', 'generated_by': 'build.py'}
    json.dump(m, open(p, 'w'), indent=2)


def outdir(spike):
    d = os.path.join(HERE, 'renders', spike)
    os.makedirs(d, exist_ok=True)
    return d


# ---------------------------------------------------------------- S0 pipeline
def s0(o):
    frames = 60                                  # 2 s
    sc, devs = fresh(o['samples'], o['scale'])
    sc.frame_start, sc.frame_end = 1, frames
    world((0.05, 0.25, 0.3), 1.0)
    camera('Cam', (0, 0, 50), ortho_scale=H / 10, direction=(0, 0, -1))   # 10 px per unit, no perspective
    bpy.ops.mesh.primitive_plane_add(size=200, location=(0, 0, -1))
    put(bpy.context.active_object, material('bgm', 'diffuse', (0.1, 0.45, 0.55)))
    # progress bar: width encodes the frame number exactly (frame f -> f/60 of the frame width)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
    bar = bpy.context.active_object
    bar.data.transform(Matrix.Translation((0.5, 0, 0)))
    put(bar, material('bar', 'emission', (1, 0.8, 0.1), 1.0))
    # moving + rotating card (shape is irrelevant for S0)
    bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, 0))
    card = bpy.context.active_object
    put(card, material('card', 'emission', (1, 0.3, 0.45), 1.0))
    out = outdir('s0')
    times = []
    for f in range(1, frames + 1):
        sc.frame_set(f)
        bar.location = (-54, -80, 1)
        bar.scale = (108 * f / frames, 6, 0.1)
        t = (f - 1) / (frames - 1)
        card.location = (-30 + 60 * t, 40 - 100 * t, 1)
        card.rotation_euler = (0, 0, 2 * math.pi * t)
        times.append(render_still(sc, os.path.join(out, f'frame_{f:04d}.png')))
    data = {'frames': frames, 'devices': devs, 'samples': o['samples'], 'scale_pct': o['scale'],
            'seconds_first_frame': times[0], 'seconds_mean_excl_first': sum(times[1:]) / len(times[1:]),
            'seconds_max': max(times), 'seconds_total': sum(times), 'frame_files': 'renders/s0/frame_0001..0060.png (local)'}
    merge_manifest('s0', data)
    print('S0_RESULT', json.dumps(data))


# ---------------------------------------------------------------- S1 refraction
def snell_apparent(xf, H_air, d, n):
    """Pixel-plane tangent of the camera ray that sees a floor point at lateral offset xf (camera straight above, height
    H_air over the surface, water depth d, index n). Bisection on the surface hit point; returns (tan theta_i, x_surface)."""
    def floor_hit(xs):
        ti = math.atan2(xs, H_air)
        tt = math.asin(math.sin(ti) / n)
        return xs + d * math.tan(tt)
    lo, hi = 0.0, xf
    for _ in range(80):
        mid = (lo + hi) / 2
        if floor_hit(mid) < xf:
            lo = mid
        else:
            hi = mid
    xs = (lo + hi) / 2
    return xs / H_air, xs


def s1(o):
    sc, devs = fresh(o['samples'], o['scale'])
    world((0.8, 0.85, 0.9), 1.0)
    d = 1.0                  # design pool depth (m)
    Hc = 2.0                 # camera height above the water surface (m)
    fov = 60.0
    mz = 0.0005              # marker disc sits 0.5 mm above the floor
    camera('Cam', (0, 0, Hc), fov_v_deg=fov, direction=(0, 0, -1))
    # floor with a checker (features visibly shift) at z = -d; water slab whose bottom is buried 1 mm under the floor
    bpy.ops.mesh.primitive_plane_add(size=6, location=(0, 0, -d))
    put(bpy.context.active_object, material('floor', 'checker'))
    markers = []
    pts = [('x', 0.3), ('x', 0.6), ('x', 0.9), ('y', 0.3), ('y', 0.6), ('y', 0.9)]
    for axis, v in pts:
        bpy.ops.mesh.primitive_circle_add(vertices=48, radius=0.012, fill_type='NGON', location=((v if axis == 'x' else 0), (v if axis == 'y' else 0), -d + mz))
        put(bpy.context.active_object, material('mk', 'emission', (1, 0, 0), 4.0))
        markers.append((axis, v))
    # slab: top at z=0
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
    slab = bpy.context.active_object
    slab.dimensions = (6, 6, d + 0.001)
    slab.location = (0, 0, -(d + 0.001) / 2)
    slab_mat = material('water', 'glass', ior=1.0)
    put(slab, slab_mat)
    glass_node = [n for n in slab_mat.node_tree.nodes if n.type == 'BSDF_GLASS'][0]
    out = outdir('s1')
    fpx = (H / 2) / math.tan(math.radians(fov) / 2)
    d_eff = d - mz
    res = {'camera_height_above_surface_m': Hc, 'depth_m': d, 'fov_v_deg': fov, 'f_px': fpx, 'samples': o['samples'], 'devices': devs, 'cases': {}}
    for tag, n in (('ior_1.000', 1.0), ('ior_1.333', N_WATER)):
        glass_node.inputs['IOR'].default_value = n
        secs = render_still(sc, os.path.join(out, f'{tag}.png'))
        img = bpy.data.images.load(os.path.join(out, f'{tag}.png'))
        img.colorspace_settings.name = 'Non-Color'
        import numpy as np
        a = np.empty(W * H * 4, dtype=np.float32)
        img.pixels.foreach_get(a)
        a = a.reshape(H, W, 4)                        # row 0 is the bottom row
        score = np.clip((a[..., 0] - np.maximum(a[..., 1], a[..., 2])) - 0.35, 0, None)   # red emission only
        rows = []
        for axis, v in markers:
            if n == 1.0:
                tan_pred = v / (Hc + d_eff)
            else:
                tan_pred, _ = snell_apparent(v, Hc, d_eff, n)
            pred_off = fpx * tan_pred
            # window around the predicted position and the un-refracted position
            cx = W / 2 + (pred_off if axis == 'x' else 0)
            cy = H / 2 + (pred_off if axis == 'y' else 0)
            r0, r1, c0, c1 = int(cy - 40), int(cy + 40), int(cx - 40), int(cx + 40)
            w = score[max(r0, 0):r1, max(c0, 0):c1]
            tot = float(w.sum())
            if tot <= 0:
                rows.append({'axis': axis, 'floor_offset_m': v, 'found': False})
                continue
            ys, xs = np.mgrid[max(r0, 0):r1, max(c0, 0):c1]
            mx = float((w * (xs + 0.5)).sum() / tot)
            my = float((w * (ys + 0.5)).sum() / tot)
            meas = (mx - W / 2) if axis == 'x' else (my - H / 2)
            rows.append({'axis': axis, 'floor_offset_m': v, 'found': True, 'predicted_px': pred_off, 'measured_px': meas, 'error_px': meas - pred_off,
                         'flat_px_no_refraction': fpx * v / (Hc + d)})
        res['cases'][tag] = {'ior': n, 'render_seconds': secs, 'markers': rows}
        bpy.data.images.remove(img)
    # apparent lift of the floor, expressed as depth (straight down limit): d / n
    res['paraxial_expectation'] = {'apparent_depth_m': d / N_WATER, 'ratio': 1 / N_WATER, 'note': 'brief rounds to 3/4 (0.7502)'}
    merge_manifest('s1', res)
    print('S1_RESULT', json.dumps(res))


# ---------------------------------------------------------------- S2 coin
def mug_mesh(r_in, r_out, h, base):
    bm = bmesh.new()
    prof = [(0, -base), (r_out, -base), (r_out, h), (r_in, h), (r_in, 0), (0, 0)]
    vs = [bm.verts.new((x, 0, z)) for x, z in prof]
    es = [bm.edges.new((vs[i], vs[i + 1])) for i in range(len(vs) - 1)]
    es.append(bm.edges.new((vs[-1], vs[0])))
    bmesh.ops.spin(bm, geom=vs + es, cent=(0, 0, 0), axis=(0, 0, 1), angle=2 * math.pi, steps=128, use_merge=True)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new('mug')
    bm.to_mesh(me)
    bm.free()
    return me


def s2(o):
    sc, devs = fresh(o['samples'], o['scale'])
    sc.frame_start, sc.frame_end = 1, 31
    r_in, wall, h, base = 0.04, 0.005, 0.09, 0.01      # VD05 design: inner Ø 8 cm, inner height 9 cm
    depth_w = 0.07                                       # water depth after pour
    ang = math.radians(40)                               # eye angle from vertical
    coin_d = o['coin_d']
    coin_t = 0.001
    # analytic design numbers (centre sight line over the near rim)
    dirv = Vector((math.sin(ang), 0, -math.cos(ang)))
    hid_end = -r_in + h * math.tan(ang)                  # x where the floor becomes visible (empty mug)
    xs_surf = -r_in + (h - depth_w) * math.tan(ang)
    tt = math.asin(math.sin(ang) / N_WATER)
    vis_start_water = xs_surf + depth_w * math.tan(tt)
    margin = 0.0005
    coin_x = o['coin_x'] if o['coin_x'] is not None else (vis_start_water + hid_end) / 2
    world((0.75, 0.78, 0.8), 0.35)
    bpy.ops.object.light_add(type='AREA', location=(-0.5, -0.5, 0.7))
    L = bpy.context.active_object
    L.data.energy, L.data.size = 18, 0.6
    L.rotation_euler = Vector((0.5, 0.5, -0.7)).to_track_quat('-Z', 'Y').to_euler()
    bpy.ops.mesh.primitive_plane_add(size=3, location=(0, 0, -base))
    put(bpy.context.active_object, material('table', 'diffuse', (0.35, 0.2, 0.1)))
    mug = bpy.data.objects.new('Mug', mug_mesh(r_in, r_in + wall, h, base))
    sc.collection.objects.link(mug)
    mug.data.materials.append(material('ceramic', 'diffuse', (0.85, 0.85, 0.82)))      # opaque
    # coin on the inner floor
    coin = prim_cyl('Coin', coin_d / 2, coin_t, loc=(coin_x, 0, 0))
    coin_mat_emit = material('coin_mask', 'emission', (1, 0, 1), 1.0)
    put(coin, coin_mat_emit)
    # water: closed volume, bottom buried below the mug floor top; scale z is the only keyframed property
    water = prim_cyl('Water', r_in + wall / 2, 1.0, loc=(0, 0, -0.0005))   # side wall buried inside the opaque ceramic: no air gap, no TIR mirror
    put(water, material('water', 'glass', ior=o['ior']))
    water.scale = (1, 1, 0.0005 / 1.0 + 0.00001)
    water.keyframe_insert('scale', frame=1)
    water.scale = (1, 1, (depth_w + 0.0005))
    water.keyframe_insert('scale', frame=31)
    # camera: locked, line of sight passes the near-rim inner edge descending 40 deg from vertical
    rim = Vector((-r_in, 0, h))
    D = o['dist']
    tele = math.degrees(2 * math.atan(math.tan(math.atan((0.045 * 2 * 1.45) / 2 / D)) * H / W))   # mug ~ 69% of frame width
    cam = camera('Cam', rim - dirv * D, fov_v_deg=tele, direction=dirv)
    out = outdir('s2')
    sc.render.filepath = ''

    def count(path, ref_axis='mask'):
        import numpy as np
        img = bpy.data.images.load(path)
        img.colorspace_settings.name = 'Non-Color'
        iw, ih = img.size
        a = np.empty(iw * ih * 4, dtype=np.float32)
        img.pixels.foreach_get(a)
        a = a.reshape(ih * iw, 4)[:, :3]
        s = np.clip((np.minimum(a[:, 0], a[:, 2]) - a[:, 1]) * 1.0 - 0.0, 0, 1)    # magenta score, partial coverage
        s = np.where(s > 0.5, 1.0, 0.0)          # bleed from the emissive coin stays far below 0.5
        bpy.data.images.remove(img)
        return float(s.sum()) / (o['scale'] / 100) ** 2        # in full-resolution px equivalent

    res = {'design': {'eye_angle_from_vertical_deg': 40, 'inner_diameter_m': 2 * r_in, 'inner_height_m': h, 'water_depth_m': depth_w,
                      'hidden_zone_ends_at_x_from_near_wall_m': hid_end + r_in, 'visible_from_with_water_x_from_near_wall_m': vis_start_water + r_in,
                      'coin_diameter_m': coin_d, 'coin_centre_from_near_wall_m': coin_x + r_in,
                      'coin_extent_from_near_wall_m': [coin_x + r_in - coin_d / 2, coin_x + r_in + coin_d / 2],
                      'analytic_visible_fraction_after_pour_centre_ray': max(0, min(1, (coin_x + coin_d / 2 - vis_start_water) / coin_d)),
                      'camera_distance_m': D, 'camera_vfov_deg': tele, 'refraction_angle_deg': math.degrees(tt)},
           'samples': o['samples'], 'devices': devs, 'renders': {}}
    # cases: (name, frame, hide mug, coin material mask)
    refslab = prim_cyl('WaterRef', 2.0, 1.0, loc=(0, 0, -0.0005))        # flat wide slab: same surface plane, no lens effect from the cup wall
    put(refslab, water.data.materials[0])
    refslab.scale = (1, 1, depth_w + 0.0005)
    refslab.hide_render = True
    cases = [('empty_mask', 1, False), ('full_mask', 31, False), ('full_mask_nomug', 31, True), ('empty_mask_nomug', 1, True)]
    counts = {}
    for name, fr, hide in cases:
        sc.frame_set(fr)
        water.hide_render = (fr == 1) or hide
        refslab.hide_render = not (hide and fr == 31)
        mug.hide_render = hide
        p = os.path.join(out, f'{name}.png')
        secs = render_still(sc, p)
        counts[name] = count(p)
        res['renders'][name] = {'frame': fr, 'mug_hidden': hide, 'seconds': secs, 'coin_px': counts[name]}
    # reference: coin area in air, top view proxy = same camera without water and mug
    water.hide_render = True
    refslab.hide_render = True
    mug.hide_render = True
    sc.frame_set(1)
    p = os.path.join(out, 'air_ref_mask.png')
    secs = render_still(sc, p)
    counts['air_ref'] = count(p)
    res['renders']['air_ref_mask'] = {'seconds': secs, 'coin_px': counts['air_ref']}
    mug.hide_render = False
    # beauty frames with a gold coin (looked at by eye)
    put(coin, material('gold', 'diffuse', (0.9, 0.7, 0.2)))
    refslab.hide_render = True
    for fr in (1, 12, 22, 31):
        sc.frame_set(fr)
        water.hide_render = (fr == 1)
        secs = render_still(sc, os.path.join(out, f'beauty_{fr:02d}.png'))
        res['renders'][f'beauty_{fr:02d}'] = {'seconds': secs}
    res['results'] = {
        'coin_px_before_pour': counts['empty_mask'],
        'coin_px_after_pour': counts['full_mask'],
        'coin_px_after_no_mug_reference': counts['full_mask_nomug'],
        'visible_after_over_water_reference': counts['full_mask'] / counts['full_mask_nomug'] if counts['full_mask_nomug'] else None,
        'visible_after_over_air_reference': counts['full_mask'] / counts['air_ref'] if counts['air_ref'] else None,
        'coin_has_animation_data': coin.animation_data is not None and coin.animation_data.action is not None,
        'camera_has_animation_data': cam.animation_data is not None and cam.animation_data.action is not None,
        'camera_data_has_animation': cam.data.animation_data is not None,
        'water_keyed_only': water.animation_data is not None,
    }
    res['water_ior'] = o['ior']
    merge_manifest('s2' if abs(o['ior'] - N_WATER) < 1e-9 else f"s2_control_ior_{o['ior']}", res)
    print('S2_RESULT', json.dumps(res))


if __name__ == '__main__':
    o = parse()
    {'s0': s0, 's1': s1, 's2': s2}[o['spike']](o)
