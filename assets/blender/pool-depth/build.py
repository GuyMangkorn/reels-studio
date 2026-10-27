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




# ================================================================== D3/S3/S4 (pool set, child, diagram, loop seam)
# Pure-function design: scene state = f(shot, shot-local frame). Camera, child pose, ripple phase and sun are all derived
# from (shot, f), so any frame can be rendered directly (seek parity) and SH08 F209 vs SH01 F0 is a real comparison.
SH_START = {'SH01': 0, 'SH02': 180, 'SH03': 480, 'SH04': 780, 'SH05': 1140, 'SH06': 1240, 'SH07': 1320, 'SH08': 1410}
SH_LEN = {'SH01': 180, 'SH02': 300, 'SH03': 300, 'SH04': 360, 'SH05': 100, 'SH06': 80, 'SH07': 90, 'SH08': 210}
POOL = {'x': (-3.0, 3.0), 'y': (0.0, 6.0), 'floor_z': -1.0, 'deck_z': 0.15}      # POOL space, metres (brief: depth 1.0 m, deck +0.15 m)
CHILD_ROOT = (0.0, -0.03, 0.15)           # toes midpoint (sheet SH01)
SIGN_POS, SIGN_YAW_DEG = (1.4, -0.5), -40.0
PLATE_DEPTH_Z, PLATE_PICTO_Z = 1.35, 0.95
RIPPLE_PERIOD = 30                        # frames; all periodic motion uses this period (or a divisor)
CAMS = {                                  # sheet camera numbers; vFOV in degrees
    'A0': {'pos': (-1.0, -3.3, 2.2), 'tgt': (0.21, 0.90, -0.22), 'fov': 45.0},   # sheet target (-0.2,1.6,-0.9) put the head under the label band (Y 194 px): pitch 29 deg, yaw 16 deg keeps Y 320-1071
    'SIGN0': {'pos': (0.2, -1.7, 1.2), 'tgt': (1.4, -0.5, 1.35), 'fov': 35.0},     # sheet target x 1.2 left the plate cut off at the frame edge; aimed at the plate centre
    'FEET0': {'pos': (-0.9, 0.9, 0.35), 'tgt': (0.0, 0.0, -0.05), 'fov': 40.0},
    'NODIVE0': {'pos': (0.5, -1.6, 1.3), 'tgt': (1.4, -0.5, 0.95), 'fov': 35.0},
    'NODIVE_END': {'pos': (0.55, -1.7, 1.05), 'tgt': (1.4, -0.5, 0.95), 'fov': 35.0},
}
PAL = {'shirt': '#FF8FA3', 'skin': '#E4AB86', 'hair': '#2B1F18', 'shorts': '#33507A', 'deck': '#F3DFC0', 'sun': '#FFE2B8',
       'aqua': '#4CC9D8', 'teal': '#1B6F86', 'wall': '#BDE9EE', 'tile': '#F1F7F8', 'grout': '#BCCDD2', 'lane': '#17324A',
       'sand': '#FFE2B8', 'metal': '#8A949C', 'navy': '#1B3A57', 'plate': '#F7F7F2', 'hedge': '#5E9C6A', 'ground': '#CFE3C3'}


def hexc(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c)


def lerp(a, b, t):
    return tuple(x + (y - x) * t for x, y in zip(a, b))


def smooth(t):
    t = min(max(t, 0.0), 1.0)
    return t * t * (3 - 2 * t)


def ease_out(t):
    t = min(max(t, 0.0), 1.0)
    return 1 - (1 - t) ** 2


def pbr(name, hexcol, rough=0.6, spec=0.3):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = (*hexc(hexcol), 1)
    p.inputs['Roughness'].default_value = rough
    p.inputs['Specular IOR Level'].default_value = spec
    return m


def emit(name, hexcol, strength=1.0):
    return material(name, 'emission', hexc(hexcol), strength)


def mesh_box(name, x0, x1, y0, y1, z0, z1, mats, face_mat=None):
    """Axis-aligned box with identity transform (world-space vertices). face_mat: {'+y': material index, ...}."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = ((x1 if v.co.x > 0 else x0), (y1 if v.co.y > 0 else y0), (z1 if v.co.z > 0 else z0))
    for fc in bm.faces:
        n = fc.normal
        key = ('+' if max(n, key=abs) > 0 else '-') + 'xyz'[max(range(3), key=lambda i: abs(n[i]))]
        if face_mat and key in face_mat:
            fc.material_index = face_mat[key]
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(name, me)
    for m in mats:
        me.materials.append(m)
    bpy.context.scene.collection.objects.link(o)
    return o


def uv_sphere(name, r, scale, mat, seg=40, rings=20):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=rings, radius=r)
    o = bpy.context.active_object
    o.name = name
    o.scale = scale
    bpy.ops.object.shade_smooth()
    put(o, mat)
    return o


def limb_obj(name, r0, r1, mat, verts=48):
    bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r0, radius2=r1, depth=1.0, end_fill_type='NGON')
    o = bpy.context.active_object
    o.name = name
    o.data.transform(Matrix.Translation((0, 0, 0.5)))
    bpy.ops.object.shade_smooth()
    put(o, mat)
    return o


def place_limb(o, p0, p1):
    a, b = Vector(p0), Vector(p1)
    d = b - a
    o.location = a
    o.rotation_mode = 'QUATERNION'
    o.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(d.normalized())
    o.scale = (1, 1, d.length)


def ik2(hip, ankle, a, b):
    """Planar two-bone IK in the (y, z) plane; knee bends forward/up. hip/ankle: (x, y, z); returns knee (x, y, z)."""
    dy, dz = ankle[1] - hip[1], ankle[2] - hip[2]
    d = min(math.hypot(dy, dz), a + b - 1e-4)
    th = math.atan2(dz, dy)
    g = math.acos((a * a + d * d - b * b) / (2 * a * d))
    ang = th + g
    return (hip[0], hip[1] + a * math.cos(ang), hip[2] + a * math.sin(ang))


class Child:
    """Faceless doll-like child, 1.25 m standing. Parts are posed from joint positions (no armature); the pose is a pure
    function of (pose name, phase / animation time). Names PD_Child_*."""
    H = 1.25
    THIGH, SHIN = 0.27, 0.28

    def __init__(self):
        sk, sh, hr, st = pbr('PD_skin', PAL['skin'], 0.5, 0.3), pbr('PD_shirt', PAL['shirt'], 0.75, 0.15), pbr('PD_hair', PAL['hair'], 0.45, 0.35), pbr('PD_shorts', PAL['shorts'], 0.8, 0.1)
        self.look(sk, sh, hr, st)
        cl = pbr('PD_collar', '#FFC4CF', 0.75, 0.15)
        self.parts = {}
        for s in 'LR':
            self.parts['thigh' + s] = limb_obj('PD_Child_thigh' + s, 0.052, 0.042, sk)
            self.parts['shorts' + s] = limb_obj('PD_Child_shorts' + s, 0.064, 0.058, st)
            self.parts['shin' + s] = limb_obj('PD_Child_shin' + s, 0.041, 0.031, sk)
            self.parts['uarm' + s] = limb_obj('PD_Child_uarm' + s, 0.0305, 0.0285, sk)
            self.parts['sleeve' + s] = limb_obj('PD_Child_sleeve' + s, 0.0345, 0.0325, sh)
            self.parts['ear' + s] = uv_sphere('PD_Child_ear' + s, 1.0, (0.010, 0.0075, 0.019), sk, 16, 8)
            self.parts['farm' + s] = limb_obj('PD_Child_farm' + s, 0.033, 0.027, sk)
            self.parts['knee' + s] = uv_sphere('PD_Child_knee' + s, 0.0428, (1, 1, 1), sk, 48, 24)
            self.parts['ankle' + s] = uv_sphere('PD_Child_ankle' + s, 0.0318, (1, 1, 1), sk, 48, 24)
            self.parts['foot' + s] = uv_sphere('PD_Child_foot' + s, 1.0, (0.036, 0.098, 0.03), sk, 28, 14)
            self.parts['shoulder' + s] = uv_sphere('PD_Child_shoulder' + s, 0.0355, (1, 1, 1), sh, 24, 12)
            self.parts['elbow' + s] = uv_sphere('PD_Child_elbow' + s, 0.0365, (1, 1, 1), sk, 48, 24)
            self.parts['hip' + s] = uv_sphere('PD_Child_hip' + s, 0.071, (1, 1, 1), st, 24, 12)
            self.parts['hand' + s] = uv_sphere('PD_Child_hand' + s, 0.036, (1, 0.85, 1.1), sk, 24, 12)
        self.parts['pelvis'] = uv_sphere('PD_Child_pelvis', 1.0, (0.118, 0.088, 0.112), st)
        self.parts['torso'] = uv_sphere('PD_Child_torso', 1.0, (0.118, 0.085, 0.215), sh)
        self.parts['bar'] = uv_sphere('PD_Child_shoulderbar', 1.0, (0.112, 0.062, 0.046), sh)
        self.parts['collar'] = uv_sphere('PD_Child_collar', 1.0, (0.049, 0.046, 0.017), cl, 32, 12)
        self.parts['neck'] = limb_obj('PD_Child_neck', 0.04, 0.036, sk)
        self.parts['head'] = uv_sphere('PD_Child_head', 1.0, (0.088, 0.094, 0.112), sk, 48, 24)
        self.parts['hair'] = uv_sphere('PD_Child_hair', 1.0, (0.094, 0.098, 0.108), hr, 48, 24)
        self.mats = (sk, sh, hr, st)
        self.joints = {}

    def look(self, sk, sh, hr, st):
        """Material richness: fabric weave bump on shirt/shorts, hair coat, subtle skin subsurface. (Doll-flat fix.)"""
        for m, sc_, st_ in ((sh, 220.0, 0.12), (st, 260.0, 0.14)):
            nt = m.node_tree; p = nt.nodes['Principled BSDF']
            tc = nt.nodes.new('ShaderNodeTexCoord')
            wv = nt.nodes.new('ShaderNodeTexWave'); wv.wave_type = 'BANDS'; wv.inputs['Scale'].default_value = sc_ * 0.12
            wv.inputs['Distortion'].default_value = 1.5
            nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = sc_; nz.inputs['Detail'].default_value = 3.0
            nt.links.new(tc.outputs['Object'], nz.inputs['Vector'])
            nt.links.new(tc.outputs['Object'], wv.inputs['Vector'])
            mx = nt.nodes.new('ShaderNodeMath'); mx.operation = 'ADD'
            nt.links.new(nz.outputs['Fac'], mx.inputs[0]); nt.links.new(wv.outputs['Fac'], mx.inputs[1])
            bp = nt.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = st_; bp.inputs['Distance'].default_value = 0.003
            nt.links.new(mx.outputs[0], bp.inputs['Height']); nt.links.new(bp.outputs['Normal'], p.inputs['Normal'])
        p = sk.node_tree.nodes['Principled BSDF']
        p.inputs['Subsurface Weight'].default_value = 0.18
        p.inputs['Subsurface Radius'].default_value = (0.012, 0.004, 0.002)
        p.inputs['Subsurface Scale'].default_value = 1.0
        h = hr.node_tree.nodes['Principled BSDF']
        h.inputs['Coat Weight'].default_value = 0.35
        h.inputs['Coat Roughness'].default_value = 0.25

    def pose_stand(self, phase):
        """Standing at the pool lip, facing +y. phase = frame % RIPPLE_PERIOD (idle sway +-1.5 cm of the upper body)."""
        s = 0.015 * math.sin(2 * math.pi * (phase % RIPPLE_PERIOD) / RIPPLE_PERIOD)
        rx, ry, rz = CHILD_ROOT
        ay = ry - 0.145                                       # ankle y (toes at root y)

        def P(x, y, z):                                       # local metres above the sole -> world, sway grows with height
            k = min(max((z - 0.07) / 1.0, 0.0), 1.0)
            return (rx + x + s * k, ay + y, rz + z)
        J = {}
        for sgn, sd in ((-1, 'L'), (1, 'R')):
            J['hip' + sd] = P(0.06 * sgn, 0, 0.62)
            J['knee' + sd] = P(0.063 * sgn, 0, 0.35)
            J['ankle' + sd] = P(0.065 * sgn, 0, 0.07)
            J['foot' + sd] = (rx + 0.065 * sgn, ry - 0.047, rz + 0.03)      # ellipsoid radius z 0.03: sole touches the deck (gap 0)
            J['shoulder' + sd] = P(0.118 * sgn, 0, 0.972)
            J['elbow' + sd] = P(0.146 * sgn, 0.0, 0.765)
            J['wrist' + sd] = P(0.150 * sgn, 0.03, 0.56)
        J['pelvis'] = P(0, 0, 0.655)
        J['torso'] = P(0, 0, 0.845)
        J['neck0'] = P(0, 0, 1.03)
        J['neck1'] = P(0, 0, 1.075)
        J['head'] = P(0, 0.004, 1.138)
        J['hair'] = P(0, -0.006, 1.150)
        J['torso_tilt'] = 0.0
        self.apply(J)
        return J

    def pose_seated(self, t, phase):
        """Seated on the lip (SH06), legs over the water. t in [0,1]: ankle goes from z=+0.02 to z=-0.158 (eased, F10-F55 of the shot)."""
        e = smooth(t)
        hy, hz = -0.11, 0.285                                  # hip joint height: pelvis rests on the deck and the thigh clears the deck corner
        J = {}
        for sgn, sd in ((-1, 'L'), (1, 'R')):
            hip = (0.062 * sgn, hy, hz)
            ank = (0.07 * sgn, 0.30 + (0.106 - 0.30) * e, 0.02 + (-0.158 - 0.02) * e)      # end ankle z -0.158: lowest the shin reaches with the thigh clearing the deck corner (sheet's -0.20 would clip)
            knee = ik2(hip, ank, self.THIGH, self.SHIN)
            J['hip' + sd], J['knee' + sd], J['ankle' + sd] = hip, knee, ank
            J['foot' + sd] = (ank[0], ank[1] + 0.052, ank[2] - 0.035 - 0.012 * (1 - e))
            sh_ = (0.128 * sgn, hy - 0.015, hz + 0.34)
            J['shoulder' + sd] = sh_
            J['elbow' + sd] = (0.17 * sgn, hy - 0.06, hz + 0.12)
            J['wrist' + sd] = (0.19 * sgn, hy + 0.0, 0.15 + 0.035)
        J['pelvis'] = (0, hy - 0.01, hz - 0.02)
        J['torso'] = (0, hy - 0.015, hz + 0.19)
        J['neck0'] = (0, hy - 0.015, hz + 0.375)
        J['neck1'] = (0, hy - 0.015, hz + 0.42)
        J['head'] = (0, hy - 0.011, hz + 0.49)
        J['hair'] = (0, hy - 0.021, hz + 0.50)
        self.apply(J)
        return J

    def apply(self, J):
        p = self.parts
        self.joints = J
        for sd in 'LR':
            hk = Vector(J['knee' + sd]) - Vector(J['hip' + sd])
            hd_ = hk.normalized()
            place_limb(p['thigh' + sd], tuple(Vector(J['hip' + sd]) + hd_ * 0.035), J['knee' + sd])     # skin starts inside the shorts (no skin visible at the hip)
            place_limb(p['shorts' + sd], tuple(Vector(J['hip' + sd]) - hd_ * 0.045), tuple(Vector(J['hip' + sd]) + hk * 0.57))
            place_limb(p['shin' + sd], J['knee' + sd], J['ankle' + sd])
            place_limb(p['uarm' + sd], J['shoulder' + sd], J['elbow' + sd])
            place_limb(p['sleeve' + sd], J['shoulder' + sd], tuple(Vector(J['shoulder' + sd]) + (Vector(J['elbow' + sd]) - Vector(J['shoulder' + sd])) * 0.40))
            p['ear' + sd].location = (J['head'][0] + (0.0885 if sd == 'R' else -0.0885), J['head'][1] + 0.002, J['head'][2] - 0.012)
            place_limb(p['farm' + sd], J['elbow' + sd], J['wrist' + sd])
            p['knee' + sd].location = J['knee' + sd]
            p['hip' + sd].location = J['hip' + sd]
            p['ankle' + sd].location = J['ankle' + sd]
            p['shoulder' + sd].location = J['shoulder' + sd]
            p['elbow' + sd].location = J['elbow' + sd]
            p['hand' + sd].location = J['wrist' + sd]
            # foot: ellipsoid along the shin-perpendicular, toes toward +y, pitch follows the shin
            sv = (Vector(J['ankle' + sd]) - Vector(J['knee' + sd])).normalized()
            fwd = Vector((0, 1, 0)) - sv * Vector((0, 1, 0)).dot(sv)
            fwd.normalize()
            up = fwd.cross(Vector((1, 0, 0)))
            p['foot' + sd].location = J['foot' + sd] if 'foot' + sd in J else J['ankle' + sd]
            p['foot' + sd].rotation_mode = 'QUATERNION'
            p['foot' + sd].rotation_quaternion = Vector((0, 1, 0)).rotation_difference(fwd)
        p['pelvis'].location = J['pelvis']
        p['torso'].location = J['torso']
        p['bar'].location = ((J['shoulderL'][0] + J['shoulderR'][0]) / 2, (J['shoulderL'][1] + J['shoulderR'][1]) / 2, J['shoulderL'][2] - 0.03)
        p['collar'].location = (J['neck0'][0], J['neck0'][1], J['neck0'][2] + 0.004)
        place_limb(p['neck'], J['neck0'], J['neck1'])
        p['head'].location = J['head']
        p['hair'].location = J['hair']

    def verts_world(self):
        dg = bpy.context.evaluated_depsgraph_get()
        out = []
        for o in self.parts.values():
            e = o.evaluated_get(dg)
            me = e.to_mesh()
            mw = e.matrix_world
            out += [mw @ v.co for v in me.vertices]
            e.to_mesh_clear()
        return out


def periodic_sines(nt, tex_coord, phase_node):
    """Sum of travelling sine waves in object space (x, y). Each term advances an integer number of cycles per
    RIPPLE_PERIOD so the water is exactly periodic. Returns the height socket (metres)."""
    sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    nt.links.new(tex_coord.outputs['Object'], sep.inputs[0])
    waves = [  # wavelength m, dir, amplitude m, cycles/period, phase offset
        (0.60, (0.8, 0.6), 0.0042, 1, 0.3), (0.35, (-0.5, 0.866), 0.0026, 2, 1.7),
        (0.22, (0.1, -0.995), 0.0016, 2, 4.1), (0.90, (1.0, 0.0), 0.0032, 1, 2.6)]
    total = None
    for i, (lam, dr, amp, cyc, ph0) in enumerate(waves):
        k = 2 * math.pi / lam
        mx = nt.nodes.new('ShaderNodeMath'); mx.operation = 'MULTIPLY'; mx.inputs[1].default_value = k * dr[0]
        my = nt.nodes.new('ShaderNodeMath'); my.operation = 'MULTIPLY'; my.inputs[1].default_value = k * dr[1]
        nt.links.new(sep.outputs['X'], mx.inputs[0]); nt.links.new(sep.outputs['Y'], my.inputs[0])
        a = nt.nodes.new('ShaderNodeMath'); a.operation = 'ADD'
        nt.links.new(mx.outputs[0], a.inputs[0]); nt.links.new(my.outputs[0], a.inputs[1])
        ph = nt.nodes.new('ShaderNodeMath'); ph.operation = 'MULTIPLY_ADD'
        nt.links.new(phase_node.outputs[0], ph.inputs[0]); ph.inputs[1].default_value = cyc; ph.inputs[2].default_value = ph0
        b = nt.nodes.new('ShaderNodeMath'); b.operation = 'SUBTRACT'      # wave travels toward +dir
        nt.links.new(a.outputs[0], b.inputs[0]); nt.links.new(ph.outputs[0], b.inputs[1])
        s = nt.nodes.new('ShaderNodeMath'); s.operation = 'SINE'
        nt.links.new(b.outputs[0], s.inputs[0])
        am = nt.nodes.new('ShaderNodeMath'); am.operation = 'MULTIPLY'; am.inputs[1].default_value = amp
        nt.links.new(s.outputs[0], am.inputs[0])
        if total is None:
            total = am
        else:
            ad = nt.nodes.new('ShaderNodeMath'); ad.operation = 'ADD'
            nt.links.new(total.outputs[0], ad.inputs[0]); nt.links.new(am.outputs[0], ad.inputs[1])
            total = ad
    return total.outputs[0]


def water_material(ior, ripple=True, name='PD_water'):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    glass = nt.nodes.new('ShaderNodeBsdfGlass')
    glass.inputs['IOR'].default_value = ior
    glass.inputs['Roughness'].default_value = 0.0
    glass.inputs['Color'].default_value = (1, 1, 1, 1)
    phase = nt.nodes.new('ShaderNodeValue'); phase.label = 'PHASE'; phase.name = 'PHASE'
    ripple_scale = nt.nodes.new('ShaderNodeValue'); ripple_scale.label = 'RIPPLE'; ripple_scale.name = 'RIPPLE'
    ripple_scale.outputs[0].default_value = 1.0 if ripple else 0.0
    if ripple:
        tc = nt.nodes.new('ShaderNodeTexCoord')
        h = periodic_sines(nt, tc, phase)
        hs = nt.nodes.new('ShaderNodeMath'); hs.operation = 'MULTIPLY'
        nt.links.new(h, hs.inputs[0]); nt.links.new(ripple_scale.outputs[0], hs.inputs[1])
        bump = nt.nodes.new('ShaderNodeBump')
        bump.inputs['Strength'].default_value = 1.0
        bump.inputs['Distance'].default_value = 1.0
        nt.links.new(hs.outputs[0], bump.inputs['Height'])
        nt.links.new(bump.outputs['Normal'], glass.inputs['Normal'])
    # shadow rays see through the water (no caustics): the floor and the child's shadow get direct light without noise
    tr = nt.nodes.new('ShaderNodeBsdfTransparent')
    lp = nt.nodes.new('ShaderNodeLightPath')
    mix = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(lp.outputs['Is Shadow Ray'], mix.inputs[0])
    nt.links.new(glass.outputs[0], mix.inputs[1]); nt.links.new(tr.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs['Surface'])
    ab = nt.nodes.new('ShaderNodeVolumeAbsorption')
    ab.inputs['Color'].default_value = (*[float(v) for v in os.environ.get('PD_ABS', '0.4,0.88,0.9').split(',')], 1)
    ab.inputs['Density'].default_value = float(os.environ.get('PD_ABSD', 1.1))
    nt.links.new(ab.outputs[0], out.inputs['Volume'])
    return m


def tile_floor_material():
    m = bpy.data.materials.new('PD_poolfloor')
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes['Principled BSDF']
    p.inputs['Roughness'].default_value = 0.35
    p.inputs['Specular IOR Level'].default_value = 0.3
    tc = nt.nodes.new('ShaderNodeTexCoord')
    br = nt.nodes.new('ShaderNodeTexBrick')
    br.offset = 0.0
    br.inputs['Scale'].default_value = 4.0                # 0.25 m tiles
    br.inputs['Mortar Size'].default_value = 0.02
    br.inputs['Color1'].default_value = (*hexc(PAL['tile']), 1)
    br.inputs['Color2'].default_value = (*hexc('#E3EEF0'), 1)
    br.inputs['Mortar'].default_value = (*hexc(PAL['grout']), 1)
    nt.links.new(tc.outputs['Object'], br.inputs['Vector'])
    nt.links.new(br.outputs['Color'], p.inputs['Base Color'])
    return m


def deck_material():
    m = bpy.data.materials.new('PD_deck')
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes['Principled BSDF']
    p.inputs['Roughness'].default_value = 0.8
    p.inputs['Specular IOR Level'].default_value = 0.15
    tc = nt.nodes.new('ShaderNodeTexCoord')
    br = nt.nodes.new('ShaderNodeTexBrick')
    br.offset = 0.0
    br.inputs['Scale'].default_value = 1.6                # 0.625 m paving slabs
    br.inputs['Mortar Size'].default_value = 0.012
    br.inputs['Color1'].default_value = (*hexc(PAL['deck']), 1)
    br.inputs['Color2'].default_value = (*hexc('#EBD3AD'), 1)
    br.inputs['Mortar'].default_value = (*hexc('#CDB48E'), 1)
    nt.links.new(tc.outputs['Object'], br.inputs['Vector'])
    nt.links.new(br.outputs['Color'], p.inputs['Base Color'])
    return m


def build_pool_set(ior=N_WATER, ripple=True):
    """Pool, deck, hedge, sign with two plates (blank) and water. Collections: PD_Pool. Returns dict of named objects."""
    sc = bpy.context.scene
    x0, x1 = POOL['x']
    y0, y1 = POOL['y']
    zf, zd = POOL['floor_z'], POOL['deck_z']
    deck, wall, floor = deck_material(), pbr('PD_poolwall', PAL['wall'], 0.4, 0.3), tile_floor_material()
    O = {}
    ext = 30.0
    # opaque basin: deck blocks (walls are their basin-facing faces) + floor slab; water sides/bottom get buried in these
    O['deck_front'] = mesh_box('PD_Pool_deck_front', -ext, ext, -ext, y0, zf - 0.3, zd, [deck, wall], {'+y': 1})
    O['deck_back'] = mesh_box('PD_Pool_deck_back', -ext, ext, y1, ext, zf - 0.3, zd, [deck, wall], {'-y': 1})
    O['deck_left'] = mesh_box('PD_Pool_deck_left', -ext, x0, y0, y1, zf - 0.3, zd, [deck, wall], {'+x': 1})
    O['deck_right'] = mesh_box('PD_Pool_deck_right', x1, ext, y0, y1, zf - 0.3, zd, [deck, wall], {'-x': 1})
    O['floor'] = mesh_box('PD_Pool_floor', x0 - 0.05, x1 + 0.05, y0 - 0.05, y1 + 0.05, zf - 0.3, zf, [floor])
    eps = 0.0006
    chk = bpy.data.materials.new('PD_checker'); chk.use_nodes = True
    nt = chk.node_tree; pb = nt.nodes['Principled BSDF']; pb.inputs['Roughness'].default_value = 0.35
    tc = nt.nodes.new('ShaderNodeTexCoord'); ct = nt.nodes.new('ShaderNodeTexChecker')
    ct.inputs['Scale'].default_value = 1 / 0.35 * 1.0
    ct.inputs['Color1'].default_value = (*hexc(PAL['teal']), 1); ct.inputs['Color2'].default_value = (*hexc('#EAF6F8'), 1)
    nt.links.new(tc.outputs['Object'], ct.inputs['Vector']); nt.links.new(ct.outputs['Color'], pb.inputs['Base Color'])
    O['checker'] = mesh_box('PD_Pool_checker', -1.75, -0.35, 0.5, 4.0, zf, zf + eps, [chk])
    O['lane'] = mesh_box('PD_Pool_lane', 0.45, 0.60, 0.05, 5.95, zf, zf + 2 * eps, [pbr('PD_lane', PAL['lane'], 0.4, 0.3)])
    # far hedge + ground beyond the deck so no stage edge shows at the top of SH01
    O['hedge'] = mesh_box('PD_Pool_hedge', -ext, ext, 11.0, 12.6, zd, zd + 1.3, [pbr('PD_hedge', PAL['hedge'], 0.95, 0.05)])
    O['wallfar'] = mesh_box('PD_Pool_farwall', -ext, ext, 12.6, 13.0, zd, zd + 3.2, [pbr('PD_farwall', '#F2EEE6', 0.9, 0.05)])
    # water: closed volume, bottom/sides buried 1 cm inside the opaque basin (DF-20261028-blender-cycles-water-spike)
    O['water'] = mesh_box('PD_Pool_water', x0 - 0.01, x1 + 0.01, y0 - 0.01, y1 + 0.01, zf - 0.01, 0.0, [water_material(ior, ripple)])
    # sign: two uprights, two blank plates; yawed so the plates face the SH01/SH05/SH07 cameras
    yaw = math.radians(SIGN_YAW_DEG)
    metal, navy, plate = pbr('PD_signmetal', PAL['metal'], 0.45, 0.4), pbr('PD_signborder', PAL['navy'], 0.5, 0.3), pbr('PD_signplate', PAL['plate'], 0.5, 0.2)
    sx, sy = SIGN_POS
    parts = []

    def sbox(name, lx0, lx1, ly0, ly1, z0, z1, mat):
        o = mesh_box(name, lx0, lx1, ly0, ly1, z0, z1, [mat])
        parts.append(o)
        return o
    sbox('PD_Sign_postL', -0.255, -0.205, -0.01, 0.04, zd, 1.62, metal)
    sbox('PD_Sign_postR', 0.205, 0.255, -0.01, 0.04, zd, 1.62, metal)
    for z in (PLATE_DEPTH_Z, PLATE_PICTO_Z):
        sbox('PD_Sign_rail%.2f' % z, -0.255, 0.255, 0.0, 0.025, z - 0.015, z + 0.015, metal)
    # depth plate 0.30 x 0.20 m, 15 mm thick, in front of the rail (facing local -y); border + face (blank: Remotion draws "1.0 m")
    sbox('PD_Sign_depth_border', -0.15, 0.15, -0.030, -0.005, PLATE_DEPTH_Z - 0.10, PLATE_DEPTH_Z + 0.10, navy)
    sbox('PD_Sign_depth_face', -0.135, 0.135, -0.0335, -0.030, PLATE_DEPTH_Z - 0.085, PLATE_DEPTH_Z + 0.085, plate)
    # no-diving plate: disc 0.28 m (built from a cylinder along y), red ring + slash + black glyph, all geometry
    def disc(name, r, y0_, y1_, z, mat, verts=64):
        bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=(y1_ - y0_), location=(0, (y0_ + y1_) / 2, z))
        o = bpy.context.active_object; o.name = name
        o.rotation_euler = (math.pi / 2, 0, 0)
        put(o, mat); parts.append(o)
        return o
    red, blk = pbr('PD_signred', '#D1202A', 0.5, 0.2), pbr('PD_signblack', '#1A1A1A', 0.6, 0.1)
    disc('PD_Sign_picto_border', 0.14, -0.030, -0.005, PLATE_PICTO_Z, navy)
    disc('PD_Sign_picto_face', 0.128, -0.0335, -0.030, PLATE_PICTO_Z, plate)
    disc('PD_Sign_picto_ring', 0.128, -0.0345, -0.0335, PLATE_PICTO_Z, red)
    disc('PD_Sign_picto_ring_in', 0.108, -0.0350, -0.0344, PLATE_PICTO_Z, plate)
    zc = PLATE_PICTO_Z
    # glyph: head-first diver (head circle, torso bar angled down-right, arms, legs) + water line, flat geometry
    def bar(name, cx, cz, w, h, rot_deg, mat, y=-0.0356):
        o = mesh_box(name, -w / 2, w / 2, y - 0.0004, y + 0.0004, -h / 2, h / 2, [mat])
        o.rotation_euler = (0, math.radians(rot_deg), 0)
        o.location = (cx, 0, zc + cz)
        parts.append(o)
    bar('PD_Sign_picto_slash', 0.0, 0.0, 0.236, 0.024, -45, red, y=-0.0355)
    bar('PD_Sign_g_torso', -0.01, 0.015, 0.09, 0.022, 50, blk)
    bar('PD_Sign_g_armL', 0.035, -0.035, 0.05, 0.014, 70, blk)
    bar('PD_Sign_g_armR', 0.015, -0.040, 0.05, 0.014, 40, blk)
    bar('PD_Sign_g_leg1', -0.065, 0.07, 0.06, 0.016, 62, blk)
    bar('PD_Sign_g_leg2', -0.045, 0.085, 0.06, 0.016, 40, blk)
    bar('PD_Sign_g_water', 0.0, -0.075, 0.15, 0.012, 0, blk)
    disc('PD_Sign_g_head', 0.02, -0.0364, -0.0356, zc - 0.02, blk, 24)
    parts[-1].location = (0.062, -0.0360, zc - 0.045)
    # parent all sign parts to an empty at the post base, yawed
    emp = bpy.data.objects.new('PD_Sign_root', None)
    sc.collection.objects.link(emp)
    emp.location = (sx, sy, 0.0)
    emp.rotation_euler = (0, 0, yaw)
    for o in parts:
        o.parent = emp
    O['sign_root'] = emp
    O['sign_parts'] = parts
    return O


def build_world_and_sun(sun_boost=1.0):
    sc = bpy.context.scene
    w = bpy.data.worlds.new('PD_world')
    w.use_nodes = True
    nt = w.node_tree
    sky = nt.nodes.new('ShaderNodeTexSky')
    sky.sky_type = 'MULTIPLE_SCATTERING'
    sky.sun_disc = False
    sky.sun_elevation = math.radians(50)
    sky.sun_rotation = math.radians(40)
    sky.altitude = 5.0
    bg = nt.nodes['Background']
    bg.inputs['Strength'].default_value = float(os.environ.get('PD_SKY', 0.12))
    nt.links.new(sky.outputs[0], bg.inputs['Color'])
    sc.world = w
    ld = bpy.data.lights.new('PD_sun', 'SUN')
    ld.color = hexc(PAL['sun'])
    ld.energy = float(os.environ.get('PD_SUN', 1.45)) * sun_boost
    ld.angle = math.radians(1.2)
    lo = bpy.data.objects.new('PD_sun', ld)
    sc.collection.objects.link(lo)
    d = Vector((0.514, 0.386, -0.766))                    # light travels toward +x,+y (sun upper-left rear), elevation 50 deg
    lo.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    return lo


def cam_path(shot, f):
    """Returns (pos, target, vfov_deg). All numbers from the sheet; interpolation is explicit and closed-form."""
    A = CAMS['A0']
    if shot == 'SH01':
        t = smooth(f / 179.0)                             # ease-in-out, zero velocity at F0 and F179
        ax = Vector(A['tgt']) - Vector(A['pos'])
        ax.normalize()
        pos = tuple(Vector(A['pos']) + ax * (0.15 * t)) if f > 0 else tuple(A['pos'])
        return pos, tuple(A['tgt']), A['fov']
    if shot == 'SH05':
        c = CAMS['SIGN0']
        ax = (Vector(c['tgt']) - Vector(c['pos'])).normalized()
        return tuple(Vector(c['pos']) + ax * (0.2 * ease_out(f / 99.0))), tuple(c['tgt']), c['fov']
    if shot == 'SH06':
        c = CAMS['FEET0']
        ax = (Vector(c['tgt']) - Vector(c['pos'])).normalized()
        return tuple(Vector(c['pos']) + ax * (0.2 * ease_out(f / 79.0))), tuple(c['tgt']), c['fov']
    if shot == 'SH07':
        a, b = CAMS['NODIVE0'], CAMS['NODIVE_END']
        t = smooth(f / 89.0)
        return lerp(a['pos'], b['pos'], t), tuple(b['tgt']), a['fov']
    if shot == 'SH08':
        a = CAMS['NODIVE_END']
        if f >= 90:
            return tuple(A['pos']), tuple(A['tgt']), A['fov']                  # exactly CAM-POOL-A0 (hold F90..F209)
        t = smooth((f + 1) / 91.0)                                              # F0 = the step after NODIVE_END
        return lerp(a['pos'], A['pos'], t), lerp(a['tgt'], A['tgt'], t), a['fov'] + (A['fov'] - a['fov']) * t
    raise KeyError(shot)


def phase_of(shot, f):
    if shot == 'SH08':
        return (f + 1) % RIPPLE_PERIOD                   # +1 offset: SH08 F209 -> phase 0 == SH01 F0
    return (SH_START[shot] + f) % RIPPLE_PERIOD


def aim_camera(cam, pos, tgt, fov):
    cam.location = pos
    cam.rotation_euler = (Vector(tgt) - Vector(pos)).to_track_quat('-Z', 'Y').to_euler()
    cam.data.angle_y = math.radians(fov)


def seated_t(f):                                         # SH06: ankle lowers F10-F55
    return min(max((f - 10) / 45.0, 0.0), 1.0)


def set_pool_state(S, shot, f):
    ph = phase_of(shot, f)
    S['water'].data.materials[0].node_tree.nodes['PHASE'].outputs[0].default_value = 2 * math.pi * ph / RIPPLE_PERIOD
    pos, tgt, fov = cam_path(shot, f)
    aim_camera(S['cam'], pos, tgt, fov)
    if shot == 'SH06':
        S['child'].pose_seated(seated_t(f), ph)
    else:
        S['child'].pose_stand(ph)
    bpy.context.view_layer.update()
    return {'phase': ph, 'cam_pos': pos, 'cam_tgt': tgt, 'vfov': fov}


def pool_scene(samples, scale, ior=N_WATER, ripple=True, denoise=False, child_visible=True):
    sc, devs = fresh(samples, scale)
    sc.cycles.use_denoising = denoise
    if denoise:
        sc.cycles.denoiser = 'OPENIMAGEDENOISE'
        sc.cycles.denoising_use_gpu = True
    sc.cycles.sample_clamp_indirect = 6.0
    O = build_pool_set(ior, ripple)
    build_world_and_sun()
    child = Child()
    cd = bpy.data.cameras.new('PD_cam')
    cd.sensor_fit = 'VERTICAL'
    cam = bpy.data.objects.new('PD_cam', cd)
    sc.collection.objects.link(cam)
    sc.camera = cam
    S = dict(O)
    S.update({'cam': cam, 'child': child, 'sc': sc, 'devs': devs})
    return S


def proj_px(S, p):
    from bpy_extras.object_utils import world_to_camera_view
    v = world_to_camera_view(S['sc'], S['cam'], Vector(p))
    return (v.x * W, (1 - v.y) * H, v.z)


def child_extent_px(S):
    vs = S['child'].verts_world()
    pts = [proj_px(S, v) for v in vs]
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    return {'x': [min(xs), max(xs)], 'y': [min(ys), max(ys)], 'height_px': max(ys) - min(ys), 'width_px': max(xs) - min(xs)}


def plate_quad_px(S):
    """Screen-space corners (px, origin top-left, 1080x1920) of the blank depth plate face: for Remotion text placement."""
    emp = S['sign_root']
    mw = emp.matrix_world
    h = 0.085
    wdt = 0.135
    zc = PLATE_DEPTH_Z
    corners = [(-wdt, -0.0335, zc + h), (wdt, -0.0335, zc + h), (wdt, -0.0335, zc - h), (-wdt, -0.0335, zc - h)]   # TL, TR, BR, BL (local)
    return [proj_px(S, mw @ Vector(c))[:2] for c in corners]


def read_png(path):
    import numpy as np
    img = bpy.data.images.load(path)
    img.colorspace_settings.name = 'Non-Color'
    iw, ih = img.size
    a = np.empty(iw * ih * 4, dtype=np.float32)
    img.pixels.foreach_get(a)
    a = a.reshape(ih, iw, 4)[::-1, :, :3] * 255.0          # row 0 = top
    bpy.data.images.remove(img)
    return a


def cmd_stills(o, shots):
    S = pool_scene(o['samples'], o['scale'], denoise=bool(o.get('denoise', 0)))
    out = outdir('d3')
    res = {'samples': o['samples'], 'scale_pct': o['scale'], 'denoise': bool(o.get('denoise', 0)), 'devices': S['devs'], 'stills': {}}
    for tag in shots:
        shot, f = tag.split(':')
        f = int(f)
        st = set_pool_state(S, shot, f)
        secs = render_still(S['sc'], os.path.join(out, f'{shot}_F{f:03d}.png'))
        e = {'seconds': secs, **st}
        if shot in ('SH01', 'SH08'):
            e['child_extent_px'] = child_extent_px(S)
        if shot in ('SH05',):
            e['plate_quad_px'] = plate_quad_px(S)
        res['stills'][f'{shot}_F{f:03d}'] = e
        print('STILL', tag, round(secs, 1), 's', e.get('child_extent_px', {}).get('height_px'))
    merge_manifest('d3_stills', res)
    print('D3_STILLS', json.dumps(res))


# ================================================================== S3 diagram (SH02 / SH04), DIAG space: XZ plane, surface z = 0, unit u
DG = {'x': (-1.8, 1.8), 'z': (-3.8, 2.6), 'ppu': 300.0, 'floor_z': -2.0, 'pool_x': (-1.7, 1.7), 'marker_x': -1.2, 'n': N_WATER}
DG_COL = {'ground': '#F4F7FA', 'ray': '#FF9F5A', 'true': '#1B6F86', 'app': '#FFD166', 'eye': '#2B3A55', 'water': '#BFE8F2',
          'floor': '#9FB4C2', 'surf': '#5B7C99', 'guide': '#9FB4C2', 'white': '#FFFFFF'}
SH02_EYE = (1.395, 1.0)
SH04_EYE_H = 1.6
SH04_OBL_DEG = 40.0
Y_LAYER = {'ground': 1.0, 'water': 0.6, 'floor': 0.55, 'surf': 0.5, 'guide': 0.4, 'bar': 0.3, 'ray': 0.2, 'marker': 0.1, 'eye': 0.0}


def snell_surface_point(xm, depth, eye, n=N_WATER):
    """Surface point x_s on z=0 where a ray from the marker (xm, -depth) refracts to the eye (ex, ez>0):
    (xs - xm)/depth = tan(theta_w), (ex - xs)/ez = tan(theta_a), sin(theta_a) = n sin(theta_w). Bisection."""
    ex, ez = eye

    def g(xs):
        tw = math.atan2(xs - xm, depth)
        ta = math.atan2(ex - xs, ez)
        return math.sin(ta) - n * math.sin(tw)
    lo, hi = xm, ex
    for _ in range(100):
        mid = (lo + hi) / 2
        if g(mid) > 0:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def snell_from_air_angle(xm, depth, alpha, n=N_WATER):
    """Same, parametrised by the air angle from the vertical (eye above the surface point). Returns (x_s, theta_w)."""
    tw = math.asin(math.sin(alpha) / n)
    return xm + depth * math.tan(tw), tw


def prog(f, a, b):
    return min(max((f - a) / float(b - a), 0.0), 1.0)


class Diag:
    def __init__(self):
        self.mats = {}
        self.objs = []
        self.info = {}

    def mat(self, key, alpha=1.0):
        k = (key, round(alpha, 3))
        if k not in self.mats:
            m = bpy.data.materials.new(f'PD_diag_{key}_{alpha:.2f}')
            m.use_nodes = True
            nt = m.node_tree
            nt.nodes.clear()
            out = nt.nodes.new('ShaderNodeOutputMaterial')
            em = nt.nodes.new('ShaderNodeEmission')
            em.inputs['Color'].default_value = (*hexc(DG_COL[key]), 1)
            em.inputs['Strength'].default_value = 1.0
            if alpha >= 0.999:
                nt.links.new(em.outputs[0], out.inputs['Surface'])
            else:
                tr = nt.nodes.new('ShaderNodeBsdfTransparent')
                mx = nt.nodes.new('ShaderNodeMixShader')
                mx.inputs[0].default_value = alpha
                nt.links.new(tr.outputs[0], mx.inputs[1]); nt.links.new(em.outputs[0], mx.inputs[2])
                nt.links.new(mx.outputs[0], out.inputs['Surface'])
            self.mats[k] = m
        return self.mats[k]

    def _link(self, o, name):
        o.name = name
        bpy.context.scene.collection.objects.link(o)
        self.objs.append(o)
        return o

    def box(self, name, x0, x1, z0, z1, layer, key, alpha=1.0, th=0.02):
        y = Y_LAYER[layer]
        o = mesh_box(name, x0, x1, y - th / 2, y + th / 2, z0, z1, [self.mat(key, alpha)])
        self.objs.append(o)
        return o

    def disc(self, name, cx, cz, r, layer, key, alpha=1.0, verts=64):
        bm = bmesh.new()
        bmesh.ops.create_circle(bm, cap_ends=True, radius=r, segments=verts)
        me = bpy.data.meshes.new(name)
        bm.to_mesh(me)
        bm.free()
        me.materials.append(self.mat(key, alpha))
        o = bpy.data.objects.new(name, me)
        o.rotation_euler = (math.pi / 2, 0, 0)
        o.location = (cx, Y_LAYER[layer], cz)
        self._link(o, name)
        return o

    def seg(self, name, p0, p1, r, layer, key, alpha=1.0, caps=True):
        """Flat 'tube' from p0 to p1 (XZ points): a unit cylinder along local +Z scaled to the length, so the endpoints can be read back
        from the object (location and matrix @ (0,0,1)). Round caps are separate discs."""
        y = Y_LAYER[layer]
        bm = bmesh.new()
        bmesh.ops.create_cone(bm, cap_ends=False, cap_tris=False, segments=16, radius1=r, radius2=r, depth=1.0)
        for v in bm.verts:
            v.co.z += 0.5
        me = bpy.data.meshes.new(name)
        bm.to_mesh(me)
        bm.free()
        me.materials.append(self.mat(key, alpha))
        o = bpy.data.objects.new(name, me)
        a, b = Vector((p0[0], y, p0[1])), Vector((p1[0], y, p1[1]))
        d = b - a
        o.location = a
        o.rotation_mode = 'QUATERNION'
        o.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(d.normalized())
        o.scale = (1, 1, d.length)
        self._link(o, name)
        if caps:
            self.disc(name + '_c0', p0[0], p0[1], r, layer, key, alpha, 16)
            self.disc(name + '_c1', p1[0], p1[1], r, layer, key, alpha, 16)
        return o

    def dashed(self, name, p0, p1, r, layer, key, alpha=1.0, dash=0.09, gap=0.06):
        d = Vector(p1) - Vector(p0)
        L = d.length
        u = d / L if L > 0 else d
        s, i = 0.0, 0
        out = []
        while s < L - 1e-9:
            e = min(s + dash, L)
            out.append(self.seg(f'{name}_{i:02d}', tuple(Vector(p0) + u * s), tuple(Vector(p0) + u * e), r, layer, key, alpha))
            s += dash + gap
            i += 1
        return out

    def clear(self):
        for o in self.objs:
            bpy.data.objects.remove(o, do_unlink=True)
        self.objs = []
        for m in list(bpy.data.meshes):
            if m.users == 0:
                bpy.data.meshes.remove(m)

    def eye(self, name, cx, cz, look, alpha=1.0):
        """Eye icon: dark disc, white eyeball, pupil offset toward `look` (unit XZ vector)."""
        self.disc(name + '_rim', cx, cz, 0.17, 'eye', 'eye', alpha)
        w = self.disc(name + '_white', cx, cz, 0.125, 'eye', 'white', alpha)
        w.location.y -= 0.01
        p = self.disc(name + '_pupil', cx + look[0] * 0.05, cz + look[1] * 0.05, 0.055, 'eye', 'eye', alpha)
        p.location.y -= 0.02

    def static_set(self, floor_alpha=1.0):
        gx, gz = DG['x'], DG['z']
        self.box('PD_Diag_ground', gx[0] - 0.5, gx[1] + 0.5, gz[0] - 0.5, gz[1] + 0.5, 'ground', 'ground', th=0.02)
        px = DG['pool_x']
        self.box('PD_Diag_water', px[0], px[1], DG['floor_z'], 0.0, 'water', 'water', alpha=0.7, th=0.02)
        self.box('PD_Diag_floorslab', px[0] - 0.06, px[1] + 0.06, DG['floor_z'] - 0.12, DG['floor_z'], 'floor', 'floor')
        self.box('PD_Diag_wallL', px[0] - 0.06, px[0], DG['floor_z'], 0.0, 'floor', 'floor')
        self.box('PD_Diag_wallR', px[1], px[1] + 0.06, DG['floor_z'], 0.0, 'floor', 'floor')
        self.box('PD_Diag_surface', px[0] - 0.06, px[1] + 0.06, -0.012, 0.012, 'surf', 'surf')


def build_diag(D, shot, f):
    """Rebuild the diagram for (shot, shot-local frame). Returns read-back info used by the S3 checks."""
    D.clear()
    D.info = {}
    D.static_set()
    xm = DG['marker_x']
    n = DG['n']
    depth = -DG['floor_z']
    rr = 0.012
    info = D.info
    if shot == 'SH02':
        ex, ez = SH02_EYE
        xs = snell_surface_point(xm, depth, (ex, ez), n)
        info.update({'x_surface': xs, 'eye': (ex, ez)})
        m = (xm, -depth)
        S = (xs, 0.0)
        p1 = prog(f, 0, 45)
        p2 = prog(f, 45, 90)
        if p1 > 0:
            D.seg('PD_Diag_ray_water', m, tuple(Vector(m) + (Vector(S) - Vector(m)) * p1), rr, 'ray', 'ray')
        if p2 > 0:
            D.seg('PD_Diag_ray_air', S, tuple(Vector(S) + (Vector((ex, ez)) - Vector(S)) * p2), rr, 'ray', 'ray')
        # back-extension: from the surface point down-left along the air-ray direction, to the vertical through the marker
        ta = math.atan2(ex - xs, ez)
        zg = -(xs - xm) / math.tan(ta)                                  # intersection with x = xm
        E = (xm, zg)
        pe = prog(f, 100, 160)
        if pe > 0:
            D.dashed('PD_Diag_ext', S, tuple(Vector(S) + (Vector(E) - Vector(S)) * pe), rr, 'ray', 'ray')
        pg = prog(f, 150, 170)
        if pg > 0:
            D.dashed('PD_Diag_vguide', (xm, 0.0), (xm, -depth + 0.11), 0.008, 'guide', 'guide', alpha=pg, dash=0.07, gap=0.05)
        D.disc('PD_Diag_true', xm, -depth + 0.0, 0.11, 'marker', 'true')
        pa = prog(f, 200, 230)
        if pa > 0:
            D.disc('PD_Diag_ghost', xm, zg, 0.11 * (0.6 + 0.4 * pa), 'marker', 'app', alpha=pa)
        look = Vector((xs - ex, -ez)).normalized()
        D.eye('PD_Diag_eye', ex, ez, (look.x, look.y))
        info.update({'ghost_expected_z': zg, 'air_angle_deg': math.degrees(ta), 'water_angle_deg': math.degrees(math.atan2(xs - xm, depth))})
    elif shot == 'SH04':
        hE = SH04_EYE_H
        d_true = depth
        d_app_straight = d_true / n
        a_obl = math.radians(SH04_OBL_DEG)
        swing = smooth(prog(f, 288, 330))
        alpha = a_obl * swing
        if alpha < 1e-12:
            xs, tw = xm, 0.0
            zg = -d_app_straight
            eye = (xm, hE)
        else:
            xs, tw = snell_from_air_angle(xm, d_true, alpha, n)
            zg = -(xs - xm) / math.tan(alpha)
            eye = (xs + hE * math.tan(alpha), hE)
        info.update({'x_surface': xs, 'eye': eye, 'alpha_deg': math.degrees(alpha), 'theta_w_deg': math.degrees(tw), 'ghost_expected_z': zg,
                     'apparent_depth': -zg, 'swing': swing})
        # bars: state 1 only. grow F90-F120 (true) and F120-F150 (apparent); dissolve F270-F288 (alpha)
        a_bar = 1.0 - prog(f, 270, 288)
        bt, ba = prog(f, 90, 120), prog(f, 120, 150)
        bw = 0.09
        if a_bar > 0 and bt > 0:
            D.box('PD_Diag_bar_true', -0.7 - bw / 2, -0.7 + bw / 2, -d_true * bt, 0.0, 'bar', 'true', alpha=a_bar)
        if a_bar > 0 and ba > 0:
            D.box('PD_Diag_bar_app', -0.4 - bw / 2, -0.4 + bw / 2, -d_app_straight * ba, 0.0, 'bar', 'app', alpha=a_bar)
        # sight line: eye -> surface point -> marker; draws F30-F60 (straight down) from the eye downward
        ps = prog(f, 30, 60)
        if ps > 0:
            P0 = Vector(eye)
            Ssurf = Vector((xs, 0.0))
            M = Vector((xm, -d_true))
            if alpha < 1e-12:
                D.seg('PD_Diag_sight_air', tuple(P0), tuple(P0 + (Ssurf - P0) * ps), rr, 'ray', 'ray')
                D.seg('PD_Diag_sight_water', tuple(Ssurf), tuple(Ssurf + (M - Ssurf) * ps), rr, 'ray', 'ray')
            else:
                D.seg('PD_Diag_sight_air', tuple(P0), tuple(Ssurf), rr, 'ray', 'ray')
                D.seg('PD_Diag_sight_water', tuple(Ssurf), tuple(M), rr, 'ray', 'ray')
                pe = swing
                E = Vector((xm, zg))
                D.dashed('PD_Diag_ext', tuple(Ssurf), tuple(Ssurf + (E - Ssurf) * pe), rr, 'ray', 'ray')
        D.disc('PD_Diag_true', xm, -d_true, 0.11, 'marker', 'true')
        if f >= 90:
            D.disc('PD_Diag_ghost', xm, zg, 0.11 * (0.6 + 0.4 * prog(f, 90, 105)), 'marker', 'app', alpha=prog(f, 90, 105))
        look = (Vector((xs, 0.0)) - Vector(eye)).normalized()
        D.eye('PD_Diag_eye', eye[0], eye[1], (look.x, look.y))
    else:
        raise KeyError(shot)
    bpy.context.view_layer.update()
    return info


def diag_scene(samples, scale):
    sc, devs = fresh(samples, scale)
    sc.cycles.max_bounces = 2
    sc.cycles.transmission_bounces = 2
    sc.cycles.transparent_max_bounces = 16
    cx = 0.0
    cz = (DG['z'][0] + DG['z'][1]) / 2
    cd = bpy.data.cameras.new('PD_diagcam')
    cd.type = 'ORTHO'
    cd.sensor_fit = 'VERTICAL'
    cd.ortho_scale = DG['z'][1] - DG['z'][0]                 # 6.4 u -> 1920 px, 300 px per u
    cd.clip_start, cd.clip_end = 0.1, 40.0
    cam = bpy.data.objects.new('PD_diagcam', cd)
    cam.location = (cx, -10.0, cz)
    cam.rotation_euler = Vector((0, 1, 0)).to_track_quat('-Z', 'Y').to_euler()
    sc.collection.objects.link(cam)
    sc.camera = cam
    w = bpy.data.worlds.new('PD_dw')
    w.use_nodes = True
    w.node_tree.nodes['Background'].inputs['Color'].default_value = (0, 0, 0, 1)
    sc.world = w
    return sc, devs, cam


def diag_px(p):
    """DIAG (x, z) -> pixel (origin top-left)."""
    return (W / 2 + p[0] * DG['ppu'], H / 2 - (p[1] - (DG['z'][0] + DG['z'][1]) / 2) * DG['ppu'])


def readback_seg(o):
    mw = o.matrix_world
    a = mw @ Vector((0, 0, 0))
    b = mw @ Vector((0, 0, 1))
    return (a.x, a.z), (b.x, b.z)


def exr_mask(sc, D, names_keys, path):
    """Render white-on-black coverage of the objects whose names start with any prefix in names_keys. Returns float linear (H, W) array."""
    import numpy as np
    vis = {}
    for o in D.objs:
        vis[o] = o.hide_render
        o.hide_render = not any(o.name.startswith(k) for k in names_keys)
    mats = {}
    white = bpy.data.materials.new('PD_mask_white')
    white.use_nodes = True
    nt = white.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    em = nt.nodes.new('ShaderNodeEmission')
    nt.links.new(em.outputs[0], out.inputs['Surface'])
    vl = bpy.context.view_layer
    vl.material_override = white
    ff, cm, cd = sc.render.image_settings.file_format, sc.render.image_settings.color_mode, sc.render.image_settings.color_depth
    sc.render.image_settings.file_format = 'OPEN_EXR'
    sc.render.image_settings.color_mode = 'RGB'
    sc.render.image_settings.color_depth = '32'
    secs = render_still(sc, path)
    vl.material_override = None
    sc.render.image_settings.file_format, sc.render.image_settings.color_mode, sc.render.image_settings.color_depth = ff, cm, cd
    for o, v in vis.items():
        o.hide_render = v
    bpy.data.materials.remove(white)
    img = bpy.data.images.load(path + '.exr' if not path.endswith('.exr') else path)
    img.colorspace_settings.name = 'Non-Color'
    iw, ih = img.size
    a = np.empty(iw * ih * 4, dtype=np.float32)
    img.pixels.foreach_get(a)
    a = a.reshape(ih, iw, 4)[::-1, :, 0].copy()
    bpy.data.images.remove(img)
    return a, secs


def cmd_s3(o):
    import numpy as np
    sc, devs, cam = diag_scene(o['samples'], o['scale'])
    D = Diag()
    out = outdir('s3')
    sc.render.film_transparent = False
    res = {'ppu': DG['ppu'], 'ortho_scale': cam.data.ortho_scale, 'samples': o['samples'], 'devices': devs, 'checks': {}, 'renders': {}}
    tol_ratio = 0.002
    n = DG['n']
    # ---------------- SH04 state 1 (straight down) at F200: ratio + vertical sight line
    build_diag(D, 'SH04', 200)
    objs = {x.name: x for x in D.objs}
    bt, ba = objs['PD_Diag_bar_true'], objs['PD_Diag_bar_app']

    def bbox_z(o_):
        zs = [(o_.matrix_world @ Vector(c)).z for c in o_.bound_box]
        return max(zs) - min(zs)
    lt, la = bbox_z(bt), bbox_z(ba)
    res['checks']['bar_ratio_geometry'] = {'true_u': lt, 'apparent_u': la, 'ratio': la / lt, 'target': 0.750, 'tol': tol_ratio, 'pass': abs(la / lt - 0.750) <= tol_ratio}
    secs = render_still(sc, os.path.join(out, 'SH04_F200_state1.png'))
    res['renders']['SH04_F200_state1'] = secs
    mt, s1 = exr_mask(sc, D, ['PD_Diag_bar_true'], os.path.join(out, 'mask_bar_true.exr'))
    ma, s2 = exr_mask(sc, D, ['PD_Diag_bar_app'], os.path.join(out, 'mask_bar_app.exr'))
    px_t, px_a = float(mt.sum()), float(ma.sum())
    res['checks']['bar_ratio_rendered'] = {'coverage_px_true': px_t, 'coverage_px_apparent': px_a, 'ratio': px_a / px_t,
                                           'expected_length_px': [lt * DG['ppu'], la * DG['ppu']], 'pass': abs(px_a / px_t - 0.750) <= tol_ratio}
    # vertical sight line: read-back endpoints and rendered centroid per row band
    sa, sw = readback_seg(objs['PD_Diag_sight_air']), readback_seg(objs['PD_Diag_sight_water'])
    msl, s3_ = exr_mask(sc, D, ['PD_Diag_sight_air', 'PD_Diag_sight_water'], os.path.join(out, 'mask_sight.exr'))
    rows = np.arange(0, H)
    cents = []
    for r in range(int(diag_px((0, 1.5))[1]), int(diag_px((0, -1.9))[1]), 40):
        rowv = msl[r]
        if rowv.sum() > 0:
            cents.append(float((rowv * (np.arange(W) + 0.5)).sum() / rowv.sum()))
    res['checks']['sight_line_vertical_state1'] = {
        'segments_readback': [sa, sw], 'dx_air_u': sa[1][0] - sa[0][0], 'dx_water_u': sw[1][0] - sw[0][0],
        'centroid_x_px_min': min(cents), 'centroid_x_px_max': max(cents), 'expected_x_px': diag_px((DG['marker_x'], 0))[0],
        'pass': max(abs(sa[1][0] - sa[0][0]), abs(sw[1][0] - sw[0][0])) < 1e-5 and (max(cents) - min(cents)) < 0.25}
    # the eye sits directly above the marker (state 1)
    ghost = objs['PD_Diag_ghost']
    res['checks']['ghost_state1_at_apparent_depth'] = {'ghost_z_u': ghost.location.z, 'expected_u': -(2.0 / n), 'pass': abs(ghost.location.z + 2.0 / n) < 1e-5}
    # honesty rule: no frame of SH04 carries bars together with an oblique eye (all 360 frames, geometry only)
    bad, first_oblique, last_bar = [], None, None
    for fr_ in range(0, 360):
        inf = build_diag(D, 'SH04', fr_)
        has_bar = any('_bar_' in x.name for x in D.objs)
        if has_bar:
            last_bar = fr_
        if inf['alpha_deg'] > 0 and first_oblique is None:
            first_oblique = fr_
        if has_bar and inf['alpha_deg'] > 0:
            bad.append(fr_)
    res['checks']['sh04_no_frame_with_bars_and_oblique_eye'] = {'last_frame_with_bar_objects': last_bar, 'first_frame_with_oblique_eye': first_oblique, 'frames_violating': bad, 'pass': not bad and last_bar < first_oblique}
    # ---------------- SH04 oblique (F340): no bars, no ratio, Snell, back-extension
    info = build_diag(D, 'SH04', 340)
    secs = render_still(sc, os.path.join(out, 'SH04_F340_oblique.png'))
    res['renders']['SH04_F340_oblique'] = secs
    names = [x.name for x in D.objs]
    bars = [nm for nm in names if '_bar_' in nm]
    img = read_png(os.path.join(out, 'SH04_F340_oblique.png'))
    cols = {'true': hexc_srgb255(DG_COL['true']), 'app': hexc_srgb255(DG_COL['app'])}
    x0p, x1p = int(diag_px((-0.8, 0))[0]), int(diag_px((-0.3, 0))[0])
    band = img[:, x0p:x1p, :]
    cnt = {k: int((np.abs(band - np.array(c)).max(axis=2) < 6).sum()) for k, c in cols.items()}
    res['checks']['oblique_state_no_bars'] = {'bar_objects': bars, 'bar_colour_px_in_bar_columns': cnt, 'pass': (not bars) and cnt['true'] == 0 and cnt['app'] == 0}
    sa, sw = readback_seg(objs_by_name(D, 'PD_Diag_sight_air')), readback_seg(objs_by_name(D, 'PD_Diag_sight_water'))
    res['checks']['snell_state2_sight'] = snell_check(sw, sa, n)
    res['checks']['snell_state2_sight']['apparent_depth_u'] = info['apparent_depth']
    ghost = objs_by_name(D, 'PD_Diag_ghost')
    res['checks']['ghost_state2_on_vertical_and_back_extension'] = back_ext_check(D, ghost.location, DG['marker_x'], sa, info)
    # ---------------- SH02: Snell, flatter in air, back-extension meets the apparent marker (F230)
    info = build_diag(D, 'SH02', 230)
    sa, sw = readback_seg(objs_by_name(D, 'PD_Diag_ray_air')), readback_seg(objs_by_name(D, 'PD_Diag_ray_water'))
    sn = snell_check(sw, sa, n, order='water_first')
    res['checks']['snell_sh02'] = sn
    ghost = objs_by_name(D, 'PD_Diag_ghost')
    res['checks']['sh02_back_extension_meets_marker_vertical'] = back_ext_check(D, ghost.location, DG['marker_x'], sa, info, mode='sh02')
    secs = render_still(sc, os.path.join(out, 'SH02_F230.png'))
    res['renders']['SH02_F230'] = secs
    mg, _ = exr_mask(sc, D, ['PD_Diag_ghost'], os.path.join(out, 'mask_ghost.exr'))
    ys, xs = np.nonzero(mg > 0.0)
    wts = mg[ys, xs]
    cx = float((xs + 0.5) @ wts / wts.sum())
    cy = float((ys + 0.5) @ wts / wts.sum())
    exp = diag_px((DG['marker_x'], info['ghost_expected_z']))
    res['checks']['sh02_ghost_centroid_px'] = {'measured': (cx, cy), 'expected': exp, 'error_px': math.hypot(cx - exp[0], cy - exp[1]), 'pass': math.hypot(cx - exp[0], cy - exp[1]) < 0.5}
    # ---------------- stills of the set for the eye
    for shot, fr in (('SH02', 20), ('SH02', 70), ('SH02', 130), ('SH04', 100), ('SH04', 310)):
        build_diag(D, shot, fr)
        res['renders'][f'{shot}_F{fr:03d}'] = render_still(sc, os.path.join(out, f'{shot}_F{fr:03d}.png'))
    res['pass_all'] = all(v.get('pass', True) for v in res['checks'].values())
    merge_manifest('s3', res)
    print('S3_RESULT', json.dumps(res, default=str))


def hexc_srgb255(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def objs_by_name(D, name):
    for o in D.objs:
        if o.name == name:
            return o
    raise KeyError(name)


def snell_check(w, a, n, order='air_first'):
    """w, a: (start, end) XZ read-back segments. For state-2 sight: air seg is (eye -> surface) and water seg (surface -> marker); for SH02 pass
    (water, air) with order='water_first' where water = marker -> surface and air = surface -> eye."""
    if order == 'air_first':
        air = (a[0], a[1])           # eye -> surface
        wat = (w[0], w[1])           # surface -> marker
        sa_ = math.atan2(abs(air[0][0] - air[1][0]), abs(air[0][1] - air[1][1]))
        sw_ = math.atan2(abs(wat[0][0] - wat[1][0]), abs(wat[0][1] - wat[1][1]))
    else:
        wat, air = w, a
        sw_ = math.atan2(abs(wat[0][0] - wat[1][0]), abs(wat[0][1] - wat[1][1]))
        sa_ = math.atan2(abs(air[0][0] - air[1][0]), abs(air[0][1] - air[1][1]))
    return {'air_deg': math.degrees(sa_), 'water_deg': math.degrees(sw_), 'n_measured': math.sin(sa_) / math.sin(sw_), 'n_design': n,
            'air_flatter_than_water': sa_ > sw_, 'pass': sa_ > sw_ and abs(math.sin(sa_) / math.sin(sw_) - n) < 1e-6}


def back_ext_check(D, ghost_loc, xm, air_seg, info, mode='sh04'):
    """Line through the surface point along the air direction (as drawn, read back from the dash objects) crosses x = xm at z_x; compare with
    the ghost ball's location z."""
    dashes = [o for o in D.objs if o.name.startswith('PD_Diag_ext_') and '_c' not in o.name]
    if not dashes:
        return {'pass': False, 'note': 'no dashes'}
    segs = [readback_seg(o) for o in dashes]
    pts = [p for s in segs for p in s]
    far = min(pts, key=lambda p: p[0])                      # farthest left point of the drawn extension
    S = (info['x_surface'], 0.0)
    dx, dz = far[0] - S[0], far[1] - S[1]
    zx = S[1] + dz * (xm - S[0]) / dx
    return {'extension_far_end': far, 'line_crosses_marker_vertical_at_z': zx, 'ghost_z': ghost_loc.z, 'error_u': abs(zx - ghost_loc.z),
            'extension_drawn_to_vertical': abs(far[0] - xm) < 1e-6 or None, 'pass': abs(zx - ghost_loc.z) < 1e-6}


# ================================================================== S4 loop seam, D3 checks, image diff
def diff_stats(pa, pb):
    import numpy as np
    a, b = read_png(pa), read_png(pb)
    d = np.abs(a - b)
    return {'a': os.path.relpath(pa, HERE), 'b': os.path.relpath(pb, HERE), 'size': [int(a.shape[1]), int(a.shape[0])],
            'max_abs_diff_of_255': float(d.max()), 'mean_abs_diff_of_255': float(d.mean()), 'px_with_any_diff': int((d.max(axis=2) > 0).sum()),
            'px_diff_gt_2': int((d.max(axis=2) > 2).sum()), 'px_diff_gt_8': int((d.max(axis=2) > 8).sum()), 'total_px': int(a.shape[0] * a.shape[1])}


def cmd_diff(o):
    r = diff_stats(o['shots'][0], o['shots'][1])
    print('DIFF', json.dumps(r))


def scene_fingerprint(S):
    """Exact transforms of the camera, camera data and every child part (the seam must agree bit-for-bit)."""
    fp = {'cam_matrix': [list(r) for r in S['cam'].matrix_world], 'vfov_rad': S['cam'].data.angle_y, 'lens_mm': S['cam'].data.lens,
          'phase_node': S['water'].data.materials[0].node_tree.nodes['PHASE'].outputs[0].default_value}
    for k, p in S['child'].parts.items():
        fp[k] = [list(r) for r in p.matrix_world]
    return fp


def fp_equal(a, b):
    worst = 0.0
    for k in a:
        if isinstance(a[k], list):
            fa = [x for r in a[k] for x in (r if isinstance(r, list) else [r])]
            fb = [x for r in b[k] for x in (r if isinstance(r, list) else [r])]
            worst = max(worst, max(abs(x - y) for x, y in zip(fa, fb)))
        else:
            worst = max(worst, abs(a[k] - b[k]))
    return worst


def cmd_s4(o):
    S = pool_scene(o['samples'], o['scale'], denoise=bool(o.get('denoise', 0)))
    out = outdir('s4')
    res = {'samples': o['samples'], 'scale_pct': o['scale'], 'denoise': bool(o.get('denoise', 0)), 'devices': S['devs'], 'renders': {}, 'diffs': {}}
    fps = {}
    seq = [('SH01', 0), ('SH08', 209), ('SH08', 208), ('SH08', 90), ('SH01', 1), ('SH08', 0)]
    for shot, f in seq:
        st = set_pool_state(S, shot, f)
        fps[(shot, f)] = scene_fingerprint(S)
        p = os.path.join(out, f'{shot}_F{f:03d}.png')
        secs = render_still(S['sc'], p)
        res['renders'][f'{shot}_F{f:03d}'] = {'seconds': secs, 'phase': st['phase'], 'cam_pos': st['cam_pos'], 'cam_tgt': st['cam_tgt'], 'vfov': st['vfov'], 'path': os.path.relpath(p, HERE)}
    P = lambda s, f: os.path.join(out, f'{s}_F{f:03d}.png')
    res['seam_state_max_abs_transform_diff'] = fp_equal(fps[('SH08', 209)], fps[('SH01', 0)])
    res['diffs']['SH08_F209_vs_SH01_F000 (the seam)'] = diff_stats(P('SH08', 209), P('SH01', 0))
    res['diffs']['SH08_F208_vs_SH08_F209 (last step: ripple + sway only)'] = diff_stats(P('SH08', 208), P('SH08', 209))
    res['diffs']['SH08_F090_vs_SH08_F209 (hold start vs end: ripple/sway phase only)'] = diff_stats(P('SH08', 90), P('SH08', 209))
    res['diffs']['SH01_F000_vs_SH01_F001 (first step after the seam: dolly + ripple)'] = diff_stats(P('SH01', 0), P('SH01', 1))
    res['diffs']['SH08_F000_vs_SH08_F209 (SH07->SH08 entry, intended pull-back)'] = diff_stats(P('SH08', 0), P('SH08', 209))
    merge_manifest('s4_' + ('dn' if res['denoise'] else 'raw') + f"_{o['samples']}spp", res)
    print('S4_RESULT', json.dumps(res))


# ================================================================== D3 checks: refraction at the pool-edge camera, framing, contact
def snell_pixel(S, floor_pt, mz=0.0005, n=N_WATER, d=None):
    """Predicted screen position of a floor marker seen through flat water from the current camera: solve the surface hit point
    in the vertical plane through camera and marker; the image position of the marker is the projection of that surface point."""
    d = (-POOL['floor_z'] - mz) if d is None else d
    C = S['cam'].matrix_world.translation
    fx, fy = floor_pt
    hv = Vector((fx - C.x, fy - C.y))
    D = hv.length
    u = hv / D
    Hh = C.z
    lo, hi = 0.0, D
    for _ in range(100):
        xs = (lo + hi) / 2
        g = xs / math.hypot(xs, Hh) - n * math.sin(math.atan2(D - xs, d))
        if g > 0:
            hi = xs
        else:
            lo = xs
    xs = (lo + hi) / 2
    surf = Vector((C.x + u.x * xs, C.y + u.y * xs, 0.0))
    ti, tt = math.atan2(xs, Hh), math.atan2(D - xs, d)
    return proj_px(S, surf)[:2], {'theta_air_deg': math.degrees(ti), 'theta_water_deg': math.degrees(tt), 'apparent_over_true_depth': math.tan(tt) / math.tan(ti)}


def red_centroid(path, near, win=36):
    import numpy as np
    a = read_png(path)
    sc_ = (a[..., 0] - np.maximum(a[..., 1], a[..., 2])) / 255.0
    sc_ = np.clip(sc_ - 0.3, 0, None)
    cx, cy = int(near[0]), int(near[1])
    r0, r1, c0, c1 = max(cy - win, 0), min(cy + win, a.shape[0]), max(cx - win, 0), min(cx + win, a.shape[1])
    w = sc_[r0:r1, c0:c1]
    if w.sum() <= 0:
        return None
    ys, xs = np.mgrid[r0:r1, c0:c1]
    return (float((w * (xs + 0.5)).sum() / w.sum()), float((w * (ys + 0.5)).sum() / w.sum()))


def cmd_d3(o):
    out = outdir('d3')
    res = {'samples': o['samples'], 'scale_pct': o['scale']}
    # 1) refraction fidelity at the B01 camera (flat water, no ripple), markers on the floor
    S0 = pool_scene(1, 5, ior=N_WATER, ripple=False)
    set_pool_state(S0, 'SH01', 0)
    cb = child_extent_px(S0)
    cand = []
    for gx in [x * 0.25 for x in range(-10, 11)]:
        for gy in [0.4 + 0.2 * k for k in range(0, 25)]:
            pr, _ = snell_pixel(S0, (gx, gy), mz=0.0012)
            fl = proj_px(S0, (gx, gy, POOL['floor_z']))
            ok = 90 < pr[0] < 990 and 330 < pr[1] < 1000 and 90 < fl[0] < 990 and 330 < fl[1] < 1000 and (pr[0] < cb['x'][0] - 70 or pr[0] > cb['x'][1] + 70)
            ok = ok and (fl[0] < cb['x'][0] - 70 or fl[0] > cb['x'][1] + 70)
            if ok:
                cand.append((gx, gy, pr))
    cand.sort(key=lambda c: (c[2][1], c[2][0]))
    pts = [(c[0], c[1]) for c in (cand[0], cand[len(cand) // 5], cand[2 * len(cand) // 5], cand[3 * len(cand) // 5], cand[4 * len(cand) // 5], cand[-1])]
    pts = [tuple(p) for p in pts]
    mres = {}
    for tag, ior in (('ior_1.000', 1.0), ('ior_1.333', N_WATER)):
        S = pool_scene(o['samples'], 100, ior=ior, ripple=False)
        set_pool_state(S, 'SH01', 0)
        S['child'].parts['torso'].hide_render = False
        for k, (fx, fy) in enumerate(pts):
            bpy.ops.mesh.primitive_circle_add(vertices=48, radius=0.03, fill_type='NGON', location=(fx, fy, POOL['floor_z'] + 0.0012))
            put(bpy.context.active_object, material('mk%d' % k, 'emission', (1, 0, 0), 20.0))      # strong: the aqua absorption removes red along the oblique path
        bpy.context.view_layer.update()
        p = os.path.join(out, f'refr_{tag}.png')
        secs = render_still(S['sc'], p)
        rows = []
        for fx, fy in pts:
            flat = proj_px(S, (fx, fy, POOL['floor_z']))
            if ior == 1.0:
                pred, info = flat[:2], {}
            else:
                pred, info = snell_pixel(S, (fx, fy), mz=0.0012)
            meas = red_centroid(p, pred)
            rows.append({'floor_xy_m': [fx, fy], 'unrefracted_px': flat[:2], 'predicted_px': pred, 'measured_px': meas,
                         'error_px': None if meas is None else math.hypot(meas[0] - pred[0], meas[1] - pred[1]),
                         'lift_vs_unrefracted_px': math.hypot(pred[0] - flat[0], pred[1] - flat[1]), **info})
        mres[tag] = {'render_seconds': secs, 'markers': rows}
        print('REFR', tag, json.dumps(rows))
    res['refraction_B01_camera'] = mres
    errs = [r['error_px'] for r in mres['ior_1.333']['markers'] if r['error_px'] is not None]
    res['refraction_B01_camera']['max_error_px'] = max(errs) if errs else None
    res['refraction_B01_camera']['pass_2px'] = bool(errs) and len(errs) == len(pts) and max(errs) <= 2.0
    # 2) framing / lead height / contact / plates (projection numbers, no render)
    S = pool_scene(1, 5)
    fr = {}
    heights = []
    for f in range(0, 180, 10):
        set_pool_state(S, 'SH01', f)
        e = child_extent_px(S)
        heights.append((f, e['height_px'], e['y'][0], e['y'][1], e['x'][0], e['x'][1]))
    set_pool_state(S, 'SH01', 179)
    e = child_extent_px(S)
    heights.append((179, e['height_px'], e['y'][0], e['y'][1], e['x'][0], e['x'][1]))
    fr['SH01_child_over_motion'] = {'min_height_px': min(h[1] for h in heights), 'max_height_px': max(h[1] for h in heights),
                                    'top_y_min_px': min(h[2] for h in heights), 'bottom_y_max_px': max(h[3] for h in heights),
                                    'x_range_px': [min(h[4] for h in heights), max(h[5] for h in heights)],
                                    'in_content_band_[269,1440]': min(h[2] for h in heights) >= 269 and max(h[3] for h in heights) <= 1440, 'rule_>=480px': min(h[1] for h in heights) >= 480}
    foot_z = min(v.z for pn in ('footL', 'footR') for v in [S['child'].parts[pn].matrix_world @ Vector(c) for c in S['child'].parts[pn].bound_box])
    fr['child_contact'] = {'lowest_foot_vertex_z_m': foot_z, 'deck_top_z_m': POOL['deck_z'], 'gap_m': foot_z - POOL['deck_z'], 'toes_y_m': CHILD_ROOT[1], 'lip_y_m': 0.0}
    for shot, f in (('SH05', 0), ('SH05', 99), ('SH07', 0), ('SH07', 89)):
        set_pool_state(S, shot, f)
        q = plate_quad_px(S)
        fr[f'{shot}_F{f:03d}_depth_plate'] = {'quad_px_TL_TR_BR_BL': q, 'width_frac_of_frame': (math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1])) / W}
    # SH06 clearance: thigh lower edge vs deck corner (y=0, z=0.15) over the whole motion
    worst = 9
    for f in range(0, 80, 5):
        set_pool_state(S, 'SH06', f)
        J = S['child'].joints
        for sd in 'LR':
            h, k = Vector(J['hip' + sd]), Vector(J['knee' + sd])
            for t in [i / 40 for i in range(41)]:
                p_ = h + (k - h) * t
                if p_.y <= 0.0:
                    worst = min(worst, p_.z - 0.052 - POOL['deck_z'])
    ank = [S['child'].joints['ankleL'][2], S['child'].joints['ankleR'][2]]
    pel = min((S['child'].parts['pelvis'].matrix_world @ Vector(c)).z for c in S['child'].parts['pelvis'].bound_box)
    head_in = False
    for f in (0, 40, 79):
        set_pool_state(S, 'SH06', f)
        for pn in ('head', 'hair'):
            for c in S['child'].parts[pn].data.vertices:
                px_ = proj_px(S, S['child'].parts[pn].matrix_world @ c.co)
                if 0 <= px_[0] <= W and 0 <= px_[1] <= H and px_[2] > 0:
                    head_in = True
    fr['SH06_seated'] = {'thigh_lower_edge_clearance_over_deck_m_min': worst, 'pelvis_lowest_z_m': pel, 'deck_top_z_m': POOL['deck_z'], 'ankle_z_final_m': ank, 'water_z_m': 0.0,
                         'head_or_hair_vertex_in_frame_any_of_F0_F40_F79': head_in}
    # SH05 plate quads for every frame (Remotion text placement; the sheet's text '1.0 m' is a Remotion overlay, VD11)
    quads = {}
    for f in range(100):
        set_pool_state(S, 'SH05', f)
        quads[f] = [[round(a, 2), round(b, 2)] for a, b in plate_quad_px(S)]
    wf = {f: math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]) / W for f, q in quads.items()}
    fr['SH05_plate_width_frac'] = {'F0': wf[0], 'F99': wf[99], 'first_frame_ge_50pct': next((f for f in range(100) if wf[f] >= 0.5), None)}
    json.dump({'space': 'screen px, 1080x1920, origin top-left', 'order': 'TL,TR,BR,BL of the blank depth plate face', 'shot': 'SH05',
               'camera': 'CAM-SIGN (build.py cam_path)', 'frames': quads}, open(os.path.join(HERE, 'plate-quads-SH05.json'), 'w'))
    res['framing'] = fr
    merge_manifest('d3_checks', res)
    print('D3_RESULT', json.dumps(res, default=str))


# ================================================================== SH03 mug demo (B03): opaque mug, locked camera, coin, gentle pour
# State is a pure function of the shot-local frame f (0..299). Nothing is keyframed: coin, camera, camera data, water, stream and jug carry no animation data.
MUGD = {'r_in': 0.04, 'wall': 0.005, 'h': 0.09, 'base': 0.01, 'fillet': 0.002}      # sheet MUG space, metres: inner d 8 cm, inner height 9 cm
COIN = {'d': 0.020, 't': 0.0015, 'x': 0.023}                                          # d 2.0 cm; centre x 2.3 cm (sheet 2.4: a 1.5 mm coin top edge would peek out, see manifest deviation)
CAM_MUG = {'pos': (-0.329, 0.0, 0.435), 'tgt': (0.0, 0.0, 0.09), 'fov': 28.0}         # sheet CAM-MUG pos/vFOV; aim point (sheet: roughly (0,0,3 cm)) raised to 9 cm so the mug sits lower-middle (framing step)
WATER_FINAL = 0.07
POUR_T = {'enter0': 120, 'start': 150, 'end': 225, 'exit1': 255}
IMPACT_XY = (0.005, -0.020)                                                           # stream lands here (sheet: (0.5, 3.0) cm, mirrored: screen right is -y)
LIP_NEAR, LIP_AWAY = (0.005, -0.040, 0.150), (0.005, -0.42, 0.150)
G_ = 9.81
HANDLE_AZ = 55.0                                                                       # deg from +y (screen left) toward +x (away): away from the jug path (-y), inside the frame


def smooth_by_angle(bm, deg=35.0):
    for e in bm.edges:
        if len(e.link_faces) == 2 and e.calc_face_angle(0.0) > math.radians(deg):
            e.smooth = False
    for f in bm.faces:
        f.smooth = True


def lathe_obj(name, prof, mat, steps=96, deg=35.0, loc=(0, 0, 0)):
    """Closed lathe around Z through the origin; prof = [(r, z), ...] (a closed loop or a polyline that touches the axis)."""
    bm = bmesh.new()
    vs = [bm.verts.new((r, 0, z)) for r, z in prof]
    es = [bm.edges.new((vs[i], vs[i + 1])) for i in range(len(vs) - 1)]
    if vs[0].co.x > 1e-9 or vs[-1].co.x > 1e-9 or (vs[0].co - vs[-1].co).length > 1e-9:
        es.append(bm.edges.new((vs[-1], vs[0])))
    bmesh.ops.spin(bm, geom=vs + es, cent=(0, 0, 0), axis=(0, 0, 1), angle=2 * math.pi, steps=steps, use_merge=True)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-7)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    smooth_by_angle(bm, deg)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(o)
    me.materials.append(mat)
    o.location = loc
    return o


class Loft:
    """Closed tube along a polyline with per-ring radius; vertices are rewritten per frame (stream, spout). Topology fixed."""
    def __init__(self, name, nr, ns, mat):
        self.nr, self.ns = nr, ns
        faces = []
        for i in range(nr - 1):
            for j in range(ns):
                a, b = i * ns + j, i * ns + (j + 1) % ns
                faces.append((a, b, b + ns, a + ns))
        c0, c1 = nr * ns, nr * ns + 1
        for j in range(ns):
            faces.append((c0, (j + 1) % ns, j))
            faces.append((c1, (nr - 1) * ns + j, (nr - 1) * ns + (j + 1) % ns))
        me = bpy.data.meshes.new(name)
        me.from_pydata([(0, 0, 0)] * (nr * ns + 2), [], faces)
        me.update()
        for p in me.polygons:
            p.use_smooth = True
        self.me = me
        self.obj = bpy.data.objects.new(name, me)
        bpy.context.scene.collection.objects.link(self.obj)
        me.materials.append(mat)

    def set(self, centers, radii):
        nr, ns = self.nr, self.ns
        co = []
        for i in range(nr):
            p = Vector(centers[i])
            t = (Vector(centers[min(i + 1, nr - 1)]) - Vector(centers[max(i - 1, 0)])).normalized()
            a = Vector((1, 0, 0)) if abs(t.x) < 0.9 else Vector((0, 1, 0))
            n1 = t.cross(a).normalized()
            n2 = t.cross(n1).normalized()
            for j in range(ns):
                th = 2 * math.pi * j / ns
                co.append(p + (n1 * math.cos(th) + n2 * math.sin(th)) * radii[i])
        co.append(Vector(centers[0]))
        co.append(Vector(centers[-1]))
        self.me.vertices.foreach_set('co', [c for v in co for c in v])
        self.me.update()


def mug_water_material(ior, name='MG_water', mask=False):
    """Closed-volume Glass (shadow rays see Transparent), plus a radial ripple bump around the stream impact point. AMP and PHASE are Value nodes."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    glass = nt.nodes.new('ShaderNodeBsdfGlass')
    glass.inputs['IOR'].default_value = ior
    glass.inputs['Roughness'].default_value = 0.0
    amp = nt.nodes.new('ShaderNodeValue'); amp.name = amp.label = 'AMP'
    ph = nt.nodes.new('ShaderNodeValue'); ph.name = ph.label = 'PHASE'
    imp = nt.nodes.new('ShaderNodeCombineXYZ'); imp.name = 'IMPACT'
    imp.inputs['X'].default_value, imp.inputs['Y'].default_value = IMPACT_XY
    tc = nt.nodes.new('ShaderNodeTexCoord')
    sub = nt.nodes.new('ShaderNodeVectorMath'); sub.operation = 'SUBTRACT'
    nt.links.new(tc.outputs['Object'], sub.inputs[0]); nt.links.new(imp.outputs[0], sub.inputs[1])
    ln = nt.nodes.new('ShaderNodeVectorMath'); ln.operation = 'LENGTH'
    nt.links.new(sub.outputs[0], ln.inputs[0])
    k = nt.nodes.new('ShaderNodeMath'); k.operation = 'MULTIPLY'; k.inputs[1].default_value = 2 * math.pi / 0.014
    nt.links.new(ln.outputs['Value'], k.inputs[0])
    sb = nt.nodes.new('ShaderNodeMath'); sb.operation = 'SUBTRACT'
    nt.links.new(k.outputs[0], sb.inputs[0]); nt.links.new(ph.outputs[0], sb.inputs[1])
    sn = nt.nodes.new('ShaderNodeMath'); sn.operation = 'SINE'
    nt.links.new(sb.outputs[0], sn.inputs[0])
    en = nt.nodes.new('ShaderNodeMath'); en.operation = 'MULTIPLY'; en.inputs[1].default_value = -38.0
    nt.links.new(ln.outputs['Value'], en.inputs[0])
    ex = nt.nodes.new('ShaderNodeMath'); ex.operation = 'EXPONENT'
    nt.links.new(en.outputs[0], ex.inputs[0])
    h1 = nt.nodes.new('ShaderNodeMath'); h1.operation = 'MULTIPLY'
    nt.links.new(sn.outputs[0], h1.inputs[0]); nt.links.new(ex.outputs[0], h1.inputs[1])
    h2 = nt.nodes.new('ShaderNodeMath'); h2.operation = 'MULTIPLY'; h2.inputs[1].default_value = 0.0004
    nt.links.new(h1.outputs[0], h2.inputs[0])
    h3 = nt.nodes.new('ShaderNodeMath'); h3.operation = 'MULTIPLY'
    nt.links.new(h2.outputs[0], h3.inputs[0]); nt.links.new(amp.outputs[0], h3.inputs[1])
    bump = nt.nodes.new('ShaderNodeBump'); bump.inputs['Distance'].default_value = 1.0
    nt.links.new(h3.outputs[0], bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], glass.inputs['Normal'])
    tr = nt.nodes.new('ShaderNodeBsdfTransparent')
    lp = nt.nodes.new('ShaderNodeLightPath')
    mix = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(lp.outputs['Is Shadow Ray'], mix.inputs[0])
    nt.links.new(glass.outputs[0], mix.inputs[1]); nt.links.new(tr.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs['Surface'])
    ab = nt.nodes.new('ShaderNodeVolumeAbsorption')                          # faint aqua tint so the surface reads (about 20% red loss over the 7 cm round trip)
    ab.inputs['Color'].default_value = (0.62, 0.9, 0.94, 1)
    ab.inputs['Density'].default_value = 0.0 if mask else 8.0
    nt.links.new(ab.outputs[0], out.inputs['Volume'])
    return m


def stream_material(ior):
    m = bpy.data.materials.new('MG_stream')
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    glass = nt.nodes.new('ShaderNodeBsdfGlass')
    glass.inputs['IOR'].default_value = ior
    glass.inputs['Roughness'].default_value = 0.0
    tr = nt.nodes.new('ShaderNodeBsdfTransparent')
    lp = nt.nodes.new('ShaderNodeLightPath')
    mix = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(lp.outputs['Is Shadow Ray'], mix.inputs[0])
    nt.links.new(glass.outputs[0], mix.inputs[1]); nt.links.new(tr.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs['Surface'])
    return m


def wood_material():
    m = bpy.data.materials.new('MG_wood')
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes['Principled BSDF']
    p.inputs['Roughness'].default_value = 0.5
    p.inputs['Specular IOR Level'].default_value = 0.35
    tc = nt.nodes.new('ShaderNodeTexCoord')
    mp = nt.nodes.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (1.0, 16.0, 1.0)         # grain along x
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector'])
    nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 7.0; nz.inputs['Detail'].default_value = 5.0
    nt.links.new(mp.outputs[0], nz.inputs['Vector'])
    cr = nt.nodes.new('ShaderNodeValToRGB')
    cr.color_ramp.elements[0].color = (*hexc('#6B4D35'), 1)
    cr.color_ramp.elements[1].color = (*hexc('#9C7650'), 1)
    cr.color_ramp.elements[0].position, cr.color_ramp.elements[1].position = 0.38, 0.68
    nt.links.new(nz.outputs['Fac'], cr.inputs['Fac'])
    br = nt.nodes.new('ShaderNodeTexBrick')                                                            # plank seams, 7 cm boards
    br.offset = 0.5
    br.inputs['Scale'].default_value = 1.0
    br.inputs['Brick Width'].default_value = 0.55; br.inputs['Row Height'].default_value = 0.07
    br.inputs['Mortar Size'].default_value = 0.0012; br.inputs['Mortar Smooth'].default_value = 0.0
    br.inputs['Color1'].default_value = (1, 1, 1, 1); br.inputs['Color2'].default_value = (0.92, 0.92, 0.92, 1)
    br.inputs['Mortar'].default_value = (0.25, 0.25, 0.25, 1)
    nt.links.new(tc.outputs['Object'], br.inputs['Vector'])
    mx = nt.nodes.new('ShaderNodeMix'); mx.data_type = 'RGBA'; mx.blend_type = 'MULTIPLY'; mx.inputs[0].default_value = 1.0
    nt.links.new(cr.outputs['Color'], mx.inputs[6]); nt.links.new(br.outputs['Color'], mx.inputs[7])
    nt.links.new(mx.outputs[2], p.inputs['Base Color'])
    bm_ = nt.nodes.new('ShaderNodeBump'); bm_.inputs['Strength'].default_value = 0.15; bm_.inputs['Distance'].default_value = 0.002
    nt.links.new(nz.outputs['Fac'], bm_.inputs['Height'])
    nt.links.new(bm_.outputs['Normal'], p.inputs['Normal'])
    return m


def mug_profile(rin, wall, h, base, fil):
    ro = rin + wall
    pr = [(0.0, -base), (ro - 0.003, -base), (ro, -base + 0.003), (ro, h - fil)]
    for i in range(1, 7):
        a = math.pi / 2 * i / 6
        pr.append((ro - fil + fil * math.cos(a), h - fil + fil * math.sin(a)))
    pr += [(rin, h), (rin, 0.0), (0.0, 0.0)]
    return pr


def coin_profile(d, t):
    r = d / 2
    pr = [(0.0, 0.0), (r - 0.0004, 0.0), (r, 0.0004), (r, t - 0.0004), (r - 0.0004, t),            # rounded edge
          (r - 0.0014, t), (r - 0.0014, t - 0.0002), (r - 0.0022, t - 0.0002),                    # raised rim ring
          (0.0062, t - 0.0002), (0.0062, t - 0.0001), (0.0056, t - 0.0001), (0.0056, t - 0.0002), (0.0, t - 0.0002)]
    return pr


def mug_scene(samples, scale, ior=N_WATER, denoise=False, mask=False):
    sc, devs = fresh(samples, scale)
    sc.cycles.use_denoising = denoise
    if denoise:
        sc.cycles.denoiser = 'OPENIMAGEDENOISE'
        sc.cycles.denoising_use_gpu = True
    sc.cycles.sample_clamp_indirect = 4.0
    sc.cycles.caustics_reflective = False
    sc.cycles.caustics_refractive = False
    sc.cycles.transmission_bounces = 12
    sc.cycles.max_bounces = 10
    M = {'sc': sc, 'devs': devs, 'mask': mask}
    # world: soft neutral room fill
    w = bpy.data.worlds.new('MG_world'); w.use_nodes = True
    bg = w.node_tree.nodes['Background']
    bg.inputs['Color'].default_value = (*hexc('#EDE6DA'), 1)
    bg.inputs['Strength'].default_value = float(os.environ.get('MG_WORLD', 0.25))
    sc.world = w
    # soft window key from the left (+y): large area light, high so the 9 cm wall still lets light reach the floor
    for nm, pos, size, en, col, aim in (('MG_key', (0.12, 0.42, 0.62), (0.55, 0.55), float(os.environ.get('MG_KEY', 9.0)), '#FFF3E2', (0, 0, 0.04)),
                                        ('MG_fill', (-0.30, -0.45, 0.35), (0.5, 0.5), float(os.environ.get('MG_FILL', 1.5)), '#E7EEF5', (0, 0, 0.05))):
        ld = bpy.data.lights.new(nm, 'AREA'); ld.energy = en; ld.size, ld.size_y = size; ld.shape = 'RECTANGLE'; ld.color = hexc(col)
        lo = bpy.data.objects.new(nm, ld); sc.collection.objects.link(lo); lo.location = pos
        lo.rotation_euler = (Vector(aim) - Vector(pos)).to_track_quat('-Z', 'Y').to_euler()
    ld = bpy.data.lights.new('MG_rim', 'AREA'); ld.energy = float(os.environ.get('MG_RIM', 3.0)); ld.size = 0.3; ld.color = hexc('#FFE9CC')
    lo = bpy.data.objects.new('MG_rim', ld); sc.collection.objects.link(lo); lo.location = (0.45, 0.20, 0.35)
    lo.rotation_euler = (Vector((0, 0, 0.06)) - Vector(lo.location)).to_track_quat('-Z', 'Y').to_euler()
    # table
    bpy.ops.mesh.primitive_plane_add(size=4.0, location=(0, 0, -MUGD['base']))
    tbl = bpy.context.active_object; tbl.name = 'MG_table'; put(tbl, wood_material())
    # mug (opaque ceramic) + handle on the screen-left (+y) side, away from the jug path
    cer = pbr('MG_ceramic', '#E9E1D1', 0.22, 0.45)
    M['mug'] = lathe_obj('MG_Mug', mug_profile(MUGD['r_in'], MUGD['wall'], MUGD['h'], MUGD['base'], MUGD['fillet']), cer, steps=128, deg=50)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.026, minor_radius=0.0065, major_segments=48, minor_segments=18,
                                     location=(0.0745 * math.sin(math.radians(HANDLE_AZ)), 0.0745 * math.cos(math.radians(HANDLE_AZ)), 0.05))
    hd = bpy.context.active_object; hd.name = 'MG_Mug_handle'; hd.rotation_euler = (math.pi / 2, 0, math.pi / 2 - math.radians(HANDLE_AZ))
    hd.scale = (1.0, 0.7, 1.0); bpy.ops.object.shade_smooth(); put(hd, cer)
    M['handle'] = hd
    # coin: lies flat on the inner floor, no keyframes
    coin_mat = material('MG_coin_mask', 'emission', (1, 0, 1), 1.0) if mask else pbr('MG_coin', '#F2C45A', 0.22, 0.6)
    if not mask:
        coin_mat.node_tree.nodes['Principled BSDF'].inputs['Metallic'].default_value = 0.9
    M['coin'] = lathe_obj('MG_Coin', coin_profile(COIN['d'], COIN['t']), coin_mat, steps=96, deg=30, loc=(COIN['x'], 0.0, 0.0))
    # water: closed volume, bottom 5 mm inside the ceramic floor, side at mid-wall (no air gap), top face moved per frame
    ns = 96
    r_w = MUGD['r_in'] + MUGD['wall'] / 2
    verts = [(r_w * math.cos(2 * math.pi * j / ns), r_w * math.sin(2 * math.pi * j / ns), -0.005) for j in range(ns)]
    verts += [(v[0], v[1], 0.0) for v in verts[:ns]] + [(0, 0, -0.005), (0, 0, 0.0)]
    faces = [(j, (j + 1) % ns, ns + (j + 1) % ns, ns + j) for j in range(ns)]
    faces += [(2 * ns, (j + 1) % ns, j) for j in range(ns)] + [(2 * ns + 1, ns + j, ns + (j + 1) % ns) for j in range(ns)]
    me = bpy.data.meshes.new('MG_Water'); me.from_pydata(verts, [], faces); me.update()
    for p in me.polygons:
        p.use_smooth = False
    me.materials.append(mug_water_material(ior, mask=mask))
    M['water'] = bpy.data.objects.new('MG_Water', me); sc.collection.objects.link(M['water']); M['water_ns'] = ns
    M['stream'] = Loft('MG_Stream', 26, 16, stream_material(ior))
    # jug: hollow ceramic body + spout loft, pivot P = lowest point of the spout tip
    teal = pbr('MG_jug', '#6FA7B0', 0.3, 0.45)
    body = lathe_obj('MG_Jug_body', [(0.0, -0.09), (0.032, -0.09), (0.036, -0.085), (0.036, 0.002), (0.032, 0.011), (0.018, 0.016), (0.0, 0.018)], teal, steps=64, deg=50, loc=(0, -0.052, 0))   # closed kettle-like body, no visible interior
    spout = Loft('MG_Jug_spout', 14, 28, teal)
    cen = [(0.0, -0.022 + 0.022 * i / 13, 0.0105 + (0.0028 - 0.0105) * (i / 13) ** 1.3) for i in range(14)]
    rad = [0.0165 + (0.0026 - 0.0165) * (i / 13) ** 0.8 for i in range(14)]
    spout.set(cen, rad)
    jug = bpy.data.objects.new('MG_Jug', None); sc.collection.objects.link(jug)
    body.parent = jug; spout.obj.parent = jug
    M['jug'] = jug; M['jug_parts'] = (body, spout.obj)
    # camera (locked): set once, never keyed
    cd = bpy.data.cameras.new('MG_cam'); cd.sensor_fit = 'VERTICAL'
    cam = bpy.data.objects.new('MG_cam', cd); sc.collection.objects.link(cam); sc.camera = cam
    aim_camera(cam, CAM_MUG['pos'], CAM_MUG['tgt'], CAM_MUG['fov'])
    M['cam'] = cam
    bpy.context.view_layer.update()
    return M


def mug_depth(f):
    t = (f - POUR_T['start']) / (POUR_T['end'] - POUR_T['start'])
    if t <= 0:
        return 0.0
    t = min(t, 1.0)
    return WATER_FINAL * (1 - (1 - t) ** 1.5)


def jug_pose(f):
    """Lip (pivot) position and tilt (rad). Away off-frame right (-y) until F120, in F120-F150, pours F150-F225, leaves F225-F255."""
    a, b = Vector(LIP_AWAY), Vector(LIP_NEAR)
    if f <= POUR_T['enter0']:
        return tuple(a), 0.0
    if f < POUR_T['start']:
        s = smooth((f - POUR_T['enter0']) / (POUR_T['start'] - POUR_T['enter0']))
        return tuple(a + (b - a) * s), math.radians(46.0) * s
    if f <= POUR_T['end']:
        s = smooth((f - POUR_T['start']) / (POUR_T['end'] - POUR_T['start']))
        return tuple(b), math.radians(46.0 + 30.0 * s)
    s = smooth((f - POUR_T['end']) / (POUR_T['exit1'] - POUR_T['end']))
    return tuple(b + (a - b) * s), math.radians(76.0) * (1 - s)


def stream_state(f, zs):
    """Ballistic centreline from the lip to the surface level zs, radius thinning with speed. Returns (centres, radii) or None."""
    if f < POUR_T['start'] or f > POUR_T['end'] + 3:
        return None
    lip, _ = jug_pose(f)
    grow = smooth((f - POUR_T['start'] + 1) / 20.0)
    fade = 1.0 - smooth((f - (POUR_T['end'] - 3)) / 6.0)
    r0 = (0.0009 + 0.0023 * grow) * fade
    if r0 < 1e-5:
        return None
    z0 = lip[2] - 0.0005
    drop = max(z0 - zs, 0.01)
    T = math.sqrt(2 * drop / G_)
    vy = (IMPACT_XY[1] - lip[1]) / T
    n = 26
    cs, rs = [], []
    v0 = abs(vy) + 0.05
    for i in range(n):
        t = T * i / (n - 1)
        cs.append((lip[0], lip[1] + vy * t, z0 - 0.5 * G_ * t * t))
        v = math.hypot(vy, G_ * t) + 0.05
        rs.append(r0 * math.sqrt(v0 / v))
    return cs, rs


def set_mug_state(M, f):
    d = mug_depth(f)
    me = M['water'].data
    ns = M['water_ns']
    for j in range(ns):
        me.vertices[ns + j].co.z = d
    me.vertices[2 * ns + 1].co.z = d
    me.update()
    M['water'].hide_render = d < 0.0003
    nt = me.materials[0].node_tree
    pour = POUR_T['start'] <= f <= POUR_T['end'] + 3
    amp = smooth((f - POUR_T['start']) / 12.0) * (1 - smooth((f - POUR_T['end'] - 3) / 30.0)) if f >= POUR_T['start'] else 0.0
    nt.nodes['AMP'].outputs[0].default_value = amp
    nt.nodes['PHASE'].outputs[0].default_value = 2 * math.pi * f / 22.0
    st = stream_state(f, d)
    if st is None:
        M['stream'].obj.hide_render = True
    else:
        M['stream'].obj.hide_render = False
        M['stream'].set(*st)
    lip, tilt = jug_pose(f)
    M['jug'].location = lip
    M['jug'].rotation_euler = (-tilt, 0, 0)
    for o in M['jug_parts']:
        o.hide_render = lip[1] < -0.30                       # off-frame, skip the work
    bpy.context.view_layer.update()
    return {'depth_m': d, 'stream': st is not None, 'jug_lip': lip, 'jug_tilt_deg': math.degrees(tilt), 'ripple_amp': amp}


def mug_hidden_margin(M, extra_z=0.0):
    """Analytic: for sample points on the coin's top rim (and floor edge), the margin (mm) by which the sight ray from the camera still lies outside the inner
    cylinder at the rim plane (z = h). Positive = hidden by the wall (empty mug). Recompute whenever the camera or coin changes."""
    C = M['cam'].matrix_world.translation
    h, rin = MUGD['h'], MUGD['r_in']
    worst = 1e9
    worst_pt = None
    for z in (0.0, COIN['t']):
        for k in range(360):
            th = math.radians(k)
            P = Vector((COIN['x'] + COIN['d'] / 2 * math.cos(th), COIN['d'] / 2 * math.sin(th), z))
            u = (P - C)
            s = (h - C.z) / u.z
            q = C + u * s
            m = (math.hypot(q.x, q.y) - rin) * 1000.0
            if m < worst:
                worst, worst_pt = m, (P.x, P.y, P.z)
    return {'min_margin_mm': worst, 'at_xyz_m': worst_pt}


def mug_box_px(M):
    from bpy_extras.object_utils import world_to_camera_view
    pts = []
    ro = MUGD['r_in'] + MUGD['wall']
    for k in range(180):
        th = math.radians(2 * k)
        for z in (-MUGD['base'], MUGD['h']):
            pts.append((ro * math.cos(th), ro * math.sin(th), z))
    px = [proj_px(M, p) for p in pts]
    xs, ys = [p[0] for p in px], [p[1] for p in px]
    return {'x': [min(xs), max(xs)], 'y': [min(ys), max(ys)]}


def count_mask(path, scale):
    a = read_png(path)
    import numpy as np
    s = np.clip(np.minimum(a[..., 0], a[..., 2]) - a[..., 1], 0, 255) / 255.0
    return float((s > 0.5).sum()) / (scale / 100) ** 2


def cmd_mugstills(o, shots):
    M = mug_scene(o['samples'], o['scale'], denoise=bool(o.get('denoise', 0)))
    out = outdir(o.get('out', 'sh03') if isinstance(o.get('out'), str) else 'sh03')
    res = {'samples': o['samples'], 'scale_pct': o['scale'], 'denoise': bool(o.get('denoise', 0)), 'stills': {}}
    for tag in shots:
        f = int(tag.split(':')[-1])
        st = set_mug_state(M, f)
        secs = render_still(M['sc'], os.path.join(out, f'SH03_F{f:03d}.png'))
        res['stills'][f'SH03_F{f:03d}'] = {'seconds': secs, **st}
        print('STILL', tag, round(secs, 1), 's')
    print('MUG_BOX', json.dumps(mug_box_px(M)))
    print('MUG_STILLS', json.dumps(res, default=str))
    return res


def cmd_mugcheck(o):
    """S2 criteria on SH03 with the real scene: coin mask pixels (emissive magenta, linear threshold 0.5) before/after the pour, series over F150-F299,
    reference (mug hidden, wide water slab), IOR 1.0 control, animation-data audit, analytic hidden margin."""
    out = outdir('sh03')
    sc_pct = int(o['scale'])
    res = {'samples': o['samples'], 'scale_pct': sc_pct, 'mask_threshold': 0.5}
    M = mug_scene(o['samples'], sc_pct, mask=True)
    res['hidden_margin'] = mug_hidden_margin(M)
    res['mug_box_px'] = mug_box_px(M)
    res['coin_extent_from_near_wall_cm'] = [(COIN['x'] - COIN['d'] / 2 + MUGD['r_in']) * 100, (COIN['x'] + COIN['d'] / 2 + MUGD['r_in']) * 100]
    cnt = {}

    def run(tag, f, ior=None, ref=False, air=False):
        st = set_mug_state(M, f)
        mat = M['water'].data.materials[0]
        mat.node_tree.nodes['Glass BSDF'].inputs['IOR'].default_value = ior if ior is not None else N_WATER
        for pn in ('stream', ):
            pass
        M['stream'].obj.data.materials[0].node_tree.nodes['Glass BSDF'].inputs['IOR'].default_value = ior if ior is not None else N_WATER
        for ob in (M['mug'], M['handle']):
            ob.hide_render = ref or air
        for ob in M['jug_parts'] + (M['stream'].obj,):
            if ref or air:
                ob.hide_render = True
        M['water'].hide_render = air or (st['depth_m'] < 0.0003 and not ref)
        if ref:
            M['water'].hide_render = True
            M['refslab'].hide_render = False
            M['refslab'].scale = (1, 1, 1)
            for j in range(M['refslab'].data.vertices.__len__()):
                pass
        else:
            M['refslab'].hide_render = True
        bpy.context.view_layer.update()
        p = os.path.join(out, f'mask_{tag}.png')
        secs = render_still(M['sc'], p)
        cnt[tag] = count_mask(p, sc_pct)
        return secs

    # reference slab: flat wide water, same surface plane as the 7 cm water, mug hidden
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = (v.co.x * 1.6, v.co.y * 1.6, 0.07 if v.co.z > 0 else -0.02)
    me = bpy.data.meshes.new('MG_ref'); bm.to_mesh(me); bm.free()
    me.materials.append(M['water'].data.materials[0])
    M['refslab'] = bpy.data.objects.new('MG_ref', me); M['sc'].collection.objects.link(M['refslab']); M['refslab'].hide_render = True
    times = {}
    series_frames = [0, 120, 149] + list(range(150, 300, 5)) + [299]
    for f in series_frames:
        times[f] = run(f'F{f:03d}', f)
    res['coin_px_by_frame'] = {f: cnt[f'F{f:03d}'] for f in series_frames}
    run('ref_water_F299', 299, ref=True)
    run('ref_air_F299', 299, air=True)
    run('ctrl_ior1_F299', 299, ior=1.0)
    run('ctrl_ior1_F225', 225, ior=1.0)
    res['reference'] = {'water_slab_px': cnt['ref_water_F299'], 'air_px': cnt['ref_air_F299']}
    res['control_ior_1.0'] = {'F299_px': cnt['ctrl_ior1_F299'], 'F225_px': cnt['ctrl_ior1_F225']}
    ref = cnt['ref_water_F299']
    res['visible_fraction_of_water_reference'] = {f: cnt[f'F{f:03d}'] / ref for f in (200, 215, 225, 255, 299)}
    first = next((f for f in series_frames if cnt[f'F{f:03d}'] > 0), None)
    ge80 = next((f for f in series_frames if cnt[f'F{f:03d}'] >= 0.8 * ref), None)
    res['first_frame_with_coin_px'] = first
    res['first_series_frame_ge_80pct'] = ge80
    res['animation_audit'] = {k: {'animation_data': getattr(M[k], 'animation_data', None) is not None, 'data_animation': getattr(getattr(M[k], 'data', None), 'animation_data', None) is not None}
                              for k in ('coin', 'cam', 'water', 'mug', 'jug')}
    res['animation_audit']['stream'] = {'animation_data': M['stream'].obj.animation_data is not None}
    res['animation_audit']['all_objects_unkeyed'] = all(ob.animation_data is None for ob in bpy.data.objects)
    res['animation_audit']['actions_in_file'] = len(bpy.data.actions)
    res['pass'] = {'coin_px_F000_is_0': cnt['F000'] == 0, 'coin_px_F149_is_0': cnt['F149'] == 0,
                   'coin_ge_80pct_at_F225': cnt['F225'] >= 0.8 * ref, 'control_ior1_F299_is_0': cnt['ctrl_ior1_F299'] == 0,
                   'no_keyframes': res['animation_audit']['all_objects_unkeyed'] and res['animation_audit']['actions_in_file'] == 0}
    merge_manifest('sh03_check', res)
    print('MUG_CHECK', json.dumps(res, default=str))


def cmd_flicker(o):
    """OIDN temporal flicker: n consecutive stills at the production setting (40 spp + OIDN) vs a 4x-sample OIDN reference of the same frames.
    Metric: mean |frame(n+1) - frame(n)| (of 255) per region. Production minus reference = excess flicker caused by noise/denoiser (real motion cancels)."""
    import numpy as np
    shot, f0 = o['shots'][0].split(':')
    f0 = int(f0)
    n = int(o.get('n', 6))
    sc_pct = int(o['scale'])
    regions = {'SH08': {'static_deck': (1300, 1900, 0, 1080), 'water': (450, 1000, 0, 440)},
               'SH01': {'static_deck': (1300, 1900, 0, 1080), 'water': (450, 1000, 0, 440)},
               'SH06': {'water': (1200, 1900, 0, 1080), 'deck': (150, 480, 0, 400)},
               'SH03': {'static_table': (0, 600, 0, 450), 'water_and_coin': (900, 1250, 300, 800)}}[shot]
    frames = {}
    times = {}
    for spp in (int(o['samples']), int(o['samples']) * 4):
        S = mug_scene(spp, sc_pct, denoise=True) if shot == 'SH03' else pool_scene(spp, sc_pct, denoise=True)
        arrs = []
        t0 = time.time()
        for k in range(n):
            f = f0 + k
            set_mug_state(S, f) if shot == 'SH03' else set_pool_state(S, shot, f)
            p = os.path.join(outdir('flicker'), f'{shot}_F{f:03d}_{spp}spp.png')
            render_still(S['sc'], p)
            arrs.append(read_png(p))
        times[spp] = (time.time() - t0) / n
        frames[spp] = arrs
    res = {'shot': shot, 'frames': [f0, f0 + n - 1], 'scale_pct': sc_pct, 'prod_spp': int(o['samples']), 'ref_spp': int(o['samples']) * 4, 'seconds_per_frame': times, 'regions': {}}
    k = sc_pct / 100.0
    for name, (r0, r1, c0, c1) in regions.items():
        r0, r1, c0, c1 = int(r0 * k), int(r1 * k), int(c0 * k), int(c1 * k)
        m = {}
        for spp, arrs in frames.items():
            d = [float(np.abs(arrs[i + 1][r0:r1, c0:c1] - arrs[i][r0:r1, c0:c1]).mean()) for i in range(n - 1)]
            m[spp] = d
        prod, ref = m[int(o['samples'])], m[int(o['samples']) * 4]
        # also: mean abs difference of production vs reference per frame (spatial noise/bias of the denoised image)
        err = [float(np.abs(frames[int(o['samples'])][i][r0:r1, c0:c1] - frames[int(o['samples']) * 4][i][r0:r1, c0:c1]).mean()) for i in range(n)]
        res['regions'][name] = {'consecutive_diff_prod': prod, 'consecutive_diff_ref': ref, 'mean_prod': sum(prod) / len(prod), 'mean_ref': sum(ref) / len(ref),
                                'excess_flicker_of_255': sum(prod) / len(prod) - sum(ref) / len(ref), 'prod_vs_ref_abs_err_per_frame': err}
    merge_manifest(f'flicker_{shot}_F{f0}', res)
    print('FLICKER', json.dumps(res))


def parse2():
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    o = {'cmd': a[0], 'samples': 64, 'scale': 100, 'denoise': 0, 'shots': []}
    i = 1
    while i < len(a):
        if a[i].startswith('--'):
            k = a[i][2:]
            o[k] = type(o.get(k, 1.0))(a[i + 1]) if k in o else a[i + 1]
            i += 2
        else:
            o['shots'].append(a[i])
            i += 1
    return o


if __name__ == '__main__':
    _a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else ['s0']
    if _a[0] in ('s0', 's1', 's2'):
        o = parse()
        {'s0': s0, 's1': s1, 's2': s2}[o['spike']](o)
    else:
        o = parse2()
        {'stills': lambda o: cmd_stills(o, o['shots']), 's3': cmd_s3, 's4': cmd_s4, 'diff': cmd_diff, 'd3': cmd_d3, 'mugstills': lambda o: cmd_mugstills(o, o['shots']), 'mugcheck': cmd_mugcheck, 'flicker': cmd_flicker}[o['cmd']](o)
