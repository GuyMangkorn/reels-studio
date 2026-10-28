"""ZCONDO render-speed spike (Eevee vs Cycles), VB-ZCONDO-SHORT-R3 SP01 (e) cost question.

Builds two representative grey-blockout test scenes from scratch and renders the same frames
with a chosen engine preset, timing every frame. Nothing here is a production asset: the
corridor/figures/city are throwaway placeholders sized per SCALE-ZC-R2 order of magnitude.

Usage (headless, from the repo root):
  /Applications/Blender.app/Contents/MacOS/Blender -b --python assets/blender/zc-render-spike/build.py -- <scene> <preset> [frames]
    scene  : corridor (B01-SH01-like OTS, emissive practicals, two figures)
             balcony  (B08-like night city, fire clusters, volumetric smoke, figure at railing)
    preset : eevee64 | eevee32 | eevee64gi (baked volume-probe GI) | cycles40dn
    frames : comma list, default 0,36,104 (SP01 check frames)
Output: out/blender/zc-render-spike/<scene>/<preset>/F###.png (local only, Git-ignored)
Timings: merged into assets/blender/zc-render-spike/spike-manifest.json
"""
import bpy, sys, os, json, math, time, hashlib

W, H, FPS, LEN = 1080, 1920, 30, 105
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
MANIFEST = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'spike-manifest.json')


def parse():
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    scene = a[0] if a else 'corridor'
    preset = a[1] if len(a) > 1 else 'eevee64'
    frames = [int(x) for x in a[2].split(',')] if len(a) > 2 else [0, 36, 104]
    return scene, preset, frames


# ---------------------------------------------------------------- render presets
def apply_preset(sc, preset):
    r = sc.render
    r.resolution_x, r.resolution_y, r.resolution_percentage = W, H, 100
    r.fps = FPS
    sc.frame_start, sc.frame_end = 0, LEN - 1
    r.image_settings.file_format = 'PNG'
    r.image_settings.color_mode = 'RGB'
    r.image_settings.color_depth = '8'
    sc.view_settings.view_transform = 'AgX'
    sc.view_settings.look = 'None'
    sc.display_settings.display_device = 'sRGB'
    info = {'preset': preset}
    if preset.startswith('eevee'):
        r.engine = 'BLENDER_EEVEE'
        e = sc.eevee
        e.taa_render_samples = int(''.join(ch for ch in preset[5:] if ch.isdigit()))
        e.use_raytracing = True
        e.ray_tracing_method = 'SCREEN'
        e.ray_tracing_options.resolution_scale = '2'
        e.ray_tracing_options.use_denoise = True
        e.use_fast_gi = True
        e.fast_gi_method = 'GLOBAL_ILLUMINATION'
        e.use_shadows = True
        e.shadow_ray_count = 1
        e.shadow_step_count = 6
        e.volumetric_tile_size = '8'
        e.volumetric_samples = 64
        e.volumetric_end = 400.0
        e.use_volumetric_shadows = True
        info.update(engine='BLENDER_EEVEE', taa_render_samples=e.taa_render_samples,
                    raytracing='SCREEN, res 1/2, denoise', fast_gi=True, shadows='ray 1 / step 6',
                    volumetrics='tile 8, 64 samples, end 400 m, volumetric shadows on')
    else:
        r.engine = 'CYCLES'
        c = sc.cycles
        c.device = 'GPU'
        prefs = bpy.context.preferences.addons['cycles'].preferences
        prefs.compute_device_type = 'METAL'
        prefs.refresh_devices() if hasattr(prefs, 'refresh_devices') else prefs.get_devices()
        devs = []
        for d in prefs.devices:
            d.use = (d.type == 'METAL')
            devs.append(f"{d.name}:{d.type}:{d.use}")
        c.samples = 40
        c.use_adaptive_sampling = False
        c.use_denoising = True
        c.denoiser = 'OPENIMAGEDENOISE'
        c.denoising_use_gpu = True
        c.max_bounces = 6
        c.diffuse_bounces = 3
        c.glossy_bounces = 2
        c.transmission_bounces = 2
        c.volume_bounces = 1
        c.caustics_reflective = c.caustics_refractive = False
        c.seed = 7
        info.update(engine='CYCLES', device='GPU Metal', devices=devs, samples=40, adaptive=False,
                    denoise='OIDN GPU', bounces='max 6 / diff 3 / gloss 2 / trans 2 / vol 1', caustics=False)
    return info


# ---------------------------------------------------------------- helpers
def mat(name, color, rough=0.6, metal=0.0, emit=None, strength=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    if emit:
        b.inputs['Emission Color'].default_value = (*emit, 1)
        b.inputs['Emission Strength'].default_value = strength
    return m


def link(ob):
    bpy.context.scene.collection.objects.link(ob)
    return ob


def box(name, x0, x1, y0, y1, z0, z1, m):
    bpy.ops.mesh.primitive_cube_add(size=1, location=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
    o = bpy.context.object
    o.name = name
    o.scale = (x1 - x0, y1 - y0, z1 - z0)
    o.data.materials.append(m)
    return o


def prim(kind, name, loc, scale, m, rot=(0, 0, 0)):
    if kind == 'sphere':
        bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, location=loc, rotation=rot)
    else:
        bpy.ops.mesh.primitive_cylinder_add(vertices=20, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    o.scale = scale
    o.data.materials.append(m)
    bpy.ops.object.shade_smooth()
    return o


def person(name, loc, rot_z, shirt, pants, skin, hunch=0.0):
    """~1.75 m placeholder figure from primitives, parented to an empty at the floor anchor."""
    root = bpy.data.objects.new(name, None)
    link(root)
    parts = [
        prim('cyl', name + '_legL', (-0.10, 0, 0.44), (0.075, 0.075, 0.44), pants),
        prim('cyl', name + '_legR', (0.10, 0, 0.44), (0.075, 0.075, 0.44), pants),
        prim('sphere', name + '_torso', (0, 0, 1.18), (0.21, 0.13, 0.34), shirt),
        prim('sphere', name + '_hips', (0, 0, 0.90), (0.19, 0.12, 0.12), pants),
        prim('cyl', name + '_armL', (-0.26, 0, 1.12), (0.05, 0.05, 0.30), shirt, rot=(0, -0.08, 0)),
        prim('cyl', name + '_armR', (0.26, 0, 1.12), (0.05, 0.05, 0.30), shirt, rot=(0, 0.08, 0)),
        prim('sphere', name + '_handL', (-0.28, 0, 0.80), (0.05, 0.05, 0.06), skin),
        prim('sphere', name + '_handR', (0.28, 0, 0.80), (0.05, 0.05, 0.06), skin),
        prim('cyl', name + '_neck', (0, 0, 1.52), (0.05, 0.05, 0.06), skin),
        prim('sphere', name + '_head', (0, 0.01, 1.65), (0.095, 0.11, 0.12), skin),
    ]
    for p in parts:
        p.parent = root
    root.location = loc
    root.rotation_euler = (hunch, 0, rot_z)
    return root


def camera(name, loc, rot, vfov_deg, shift_y=0.0):
    cd = bpy.data.cameras.new(name)
    cd.sensor_fit = 'VERTICAL'
    cd.sensor_height = 24.0
    cd.angle_y = math.radians(vfov_deg)
    cd.shift_y = shift_y
    cd.clip_end = 1000
    o = bpy.data.objects.new(name, cd)
    link(o)
    o.location = loc
    o.rotation_euler = rot
    bpy.context.scene.camera = o
    return o


def key(o, frame, loc):
    o.location = loc
    o.keyframe_insert('location', frame=frame)
    for fc in (o.animation_data.action.fcurves if hasattr(o.animation_data.action, 'fcurves') else []):
        for kp in fc.keyframe_points:
            kp.interpolation = 'LINEAR'


def area(name, loc, size, color, power, rot=(0, 0, 0), sx=None):
    ld = bpy.data.lights.new(name, 'AREA')
    ld.shape = 'RECTANGLE'
    ld.size, ld.size_y = size
    ld.color = color
    ld.energy = power
    o = bpy.data.objects.new(name, ld)
    link(o)
    o.location, o.rotation_euler = loc, rot
    return o


def point(name, loc, color, power, radius=0.2):
    ld = bpy.data.lights.new(name, 'POINT')
    ld.color, ld.energy, ld.shadow_soft_size = color, power, radius
    o = bpy.data.objects.new(name, ld)
    link(o)
    o.location = loc
    return o


def world(color, strength):
    w = bpy.data.worlds.new('ZC_World')
    w.use_nodes = True
    bg = w.node_tree.nodes['Background']
    bg.inputs['Color'].default_value = (*color, 1)
    bg.inputs['Strength'].default_value = strength
    bpy.context.scene.world = w
    return w


# ---------------------------------------------------------------- B01 corridor
def build_corridor():
    L, Wd, Hc = 24.0, 1.8, 2.7
    floor = mat('ZC_floor', (0.30, 0.30, 0.29), 0.35)
    wall = mat('ZC_wall', (0.62, 0.64, 0.66), 0.8)
    ceil = mat('ZC_ceiling', (0.55, 0.56, 0.57), 0.9)
    door = mat('ZC_door', (0.16, 0.17, 0.19), 0.5)
    frame = mat('ZC_doorframe', (0.42, 0.42, 0.40), 0.5, 0.3)
    panel = mat('ZC_lightpanel', (0.9, 0.95, 1.0), 0.5, emit=(0.85, 0.93, 1.0), strength=12.0)
    exitm = mat('ZC_exitsign', (0.1, 0.8, 0.3), 0.5, emit=(0.15, 1.0, 0.35), strength=8.0)
    skin = mat('ZC_skin', (0.62, 0.43, 0.33), 0.55)
    skin_inf = mat('ZC_skin_infected', (0.42, 0.40, 0.33), 0.6)
    shirt = mat('ZC_shirt_you', (0.18, 0.28, 0.40), 0.8)
    shirt_inf = mat('ZC_shirt_infected', (0.55, 0.52, 0.48), 0.9)
    pants = mat('ZC_pants', (0.10, 0.10, 0.12), 0.8)

    box('ZC_Floor', -Wd / 2 - 0.2, Wd / 2 + 0.2, -3, L, -0.1, 0, floor)
    box('ZC_Ceiling', -Wd / 2 - 0.2, Wd / 2 + 0.2, -3, L, Hc, Hc + 0.1, ceil)
    box('ZC_WallL', -Wd / 2 - 0.2, -Wd / 2, -3, L, 0, Hc, wall)
    box('ZC_WallR', Wd / 2, Wd / 2 + 0.2, -3, L, 0, Hc, wall)
    box('ZC_EndWall', -Wd / 2, Wd / 2, L, L + 0.2, 0, Hc, wall)
    box('ZC_ExitSign', -0.25, 0.25, L - 0.05, L, 2.25, 2.45, exitm)
    for i, y in enumerate([1.5, 5.0, 8.5, 12.0, 15.5, 19.0]):
        for side in (-1, 1):
            x = side * (Wd / 2 - 0.02)
            box(f'ZC_Door_{i}_{side}', x - 0.03, x + 0.03, y - 0.45, y + 0.45, 0, 2.1, door)
            box(f'ZC_DoorFrame_{i}_{side}', x - 0.04, x + 0.04, y - 0.52, y + 0.52, 2.1, 2.18, frame)
    for i, y in enumerate([0.0, 3.0, 6.0, 9.0, 12.0, 15.0, 18.0, 21.0]):
        box(f'ZC_Panel_{i}', -0.30, 0.30, y - 0.10, y + 0.10, Hc - 0.02, Hc, panel)
        area(f'ZC_PanelLight_{i}', (0, y, Hc - 0.03), (0.6, 0.2), (0.85, 0.93, 1.0), 35.0)
    world((0.02, 0.02, 0.025), 1.0)

    # "you" OTS foreground (right side, back to camera) and the infected down the corridor.
    person('ZC_You', (0.30, 0.0, 0.0), 0.0, shirt, pants, skin)
    inf = person('ZC_Infected', (-0.15, 11.0, 0.0), math.pi, shirt_inf, pants, skin_inf, hunch=0.12)
    key(inf, 0, (-0.15, 11.0, 0.0))
    key(inf, LEN - 1, (-0.15, 8.5, 0.0))
    # OTS camera, vFOV 55, slight push forward.
    cam = camera('ZC_Cam_B01_SH01', (0.70, -1.55, 1.75), (math.radians(88), 0, math.radians(6)), 55, shift_y=-0.08)
    key(cam, 0, (0.70, -1.55, 1.75))
    key(cam, LEN - 1, (0.67, -1.25, 1.75))


# ---------------------------------------------------------------- B08 balcony night city
def smoke_material(name, seed):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.remove(nt.nodes['Principled BSDF'])
    out = nt.nodes['Material Output']
    vol = nt.nodes.new('ShaderNodeVolumePrincipled')
    vol.inputs['Color'].default_value = (0.35, 0.33, 0.32, 1)
    tc = nt.nodes.new('ShaderNodeTexCoord')
    noise = nt.nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 2.5
    noise.inputs['Detail'].default_value = 6
    noise.noise_dimensions = '4D'
    noise.inputs['W'].default_value = seed
    grad = nt.nodes.new('ShaderNodeTexGradient')
    grad.gradient_type = 'SPHERICAL'
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].position = 0.45
    ramp.color_ramp.elements[1].position = 0.75
    mul = nt.nodes.new('ShaderNodeMath')
    mul.operation = 'MULTIPLY'
    dens = nt.nodes.new('ShaderNodeMath')
    dens.operation = 'MULTIPLY'
    dens.inputs[1].default_value = 1.6
    nt.links.new(tc.outputs['Object'], noise.inputs['Vector'])
    sc2 = nt.nodes.new('ShaderNodeVectorMath')
    sc2.operation = 'SCALE'
    sc2.inputs['Scale'].default_value = 2.0  # unit cube object coords -> length 1 at face centres, falloff 0 there
    nt.links.new(tc.outputs['Object'], sc2.inputs[0])
    nt.links.new(sc2.outputs['Vector'], grad.inputs['Vector'])
    nt.links.new(noise.outputs['Fac'], ramp.inputs['Fac'])
    nt.links.new(ramp.outputs['Color'], mul.inputs[0])
    nt.links.new(grad.outputs['Fac'], mul.inputs[1])
    nt.links.new(mul.outputs[0], dens.inputs[0])
    nt.links.new(dens.outputs[0], vol.inputs['Density'])
    nt.links.new(vol.outputs['Volume'], out.inputs['Volume'])
    # animate noise W so smoke evolves (deterministic, frame-driven)
    noise.inputs['W'].keyframe_insert('default_value', frame=0)
    noise.inputs['W'].default_value = seed + 0.6
    noise.inputs['W'].keyframe_insert('default_value', frame=LEN - 1)
    return m


def build_balcony():
    import random
    rnd = random.Random(20261028)
    slab = mat('ZC_balcony_slab', (0.35, 0.35, 0.34), 0.8)
    rail = mat('ZC_railing', (0.25, 0.26, 0.28), 0.35, 0.8)
    tower = mat('ZC_tower', (0.20, 0.21, 0.24), 0.85)
    ground = mat('ZC_city_ground', (0.06, 0.06, 0.07), 0.9)
    fire = mat('ZC_fire', (1.0, 0.4, 0.1), 0.5, emit=(1.0, 0.35, 0.06), strength=40.0)
    skin = mat('ZC_skin', (0.62, 0.43, 0.33), 0.55)
    shirt = mat('ZC_shirt_you', (0.18, 0.28, 0.40), 0.8)
    pants = mat('ZC_pants', (0.10, 0.10, 0.12), 0.8)

    TOP = 60.0  # balcony floor height above street (m)
    box('ZC_BalconySlab', -2.0, 2.0, -2.0, 1.2, TOP - 0.2, TOP, slab)
    box('ZC_BalconyWall', -2.0, 2.0, -2.2, -2.0, TOP, TOP + 2.8, slab)
    box('ZC_RailTop', -2.0, 2.0, 1.1, 1.16, TOP + 1.05, TOP + 1.1, rail)
    for i in range(21):
        x = -2.0 + i * 0.2
        box(f'ZC_RailBar_{i}', x - 0.012, x + 0.012, 1.11, 1.15, TOP, TOP + 1.05, rail)
    box('ZC_Ground', -600, 600, 5, 900, -0.5, 0, ground)
    n = 0
    for gx in range(-12, 13):
        for gy in range(1, 22):
            if rnd.random() < 0.35:
                continue
            x, y = gx * 38 + rnd.uniform(-8, 8), 30 + gy * 38 + rnd.uniform(-8, 8)
            w, d, h = rnd.uniform(12, 24), rnd.uniform(12, 24), rnd.uniform(15, 95)
            box(f'ZC_Tower_{n}', x - w / 2, x + w / 2, y - d / 2, y + d / 2, 0, h, tower)
            n += 1
    # fire clusters (main cluster centre-left), each: emissive blobs + warm point light + smoke volume above
    clusters = [(-60, 220, 30, 1.0), (90, 330, 48, 0.7), (-160, 420, 20, 0.6), (30, 520, 55, 0.5)]
    for i, (x, y, z, s) in enumerate(clusters):
        for j in range(5):
            prim('sphere', f'ZC_Fire_{i}_{j}', (x + rnd.uniform(-6, 6) * s, y + rnd.uniform(-4, 4), z + rnd.uniform(0, 4) * s),
                 (2.5 * s, 2.5 * s, 3.5 * s), fire)
        point(f'ZC_FireLight_{i}', (x, y - 8, z + 4), (1.0, 0.45, 0.12), 4.0e5 * s, radius=6)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, z + 35 * s))
        sm = bpy.context.object
        sm.name = f'ZC_Smoke_{i}'
        sm.scale = (60 * s, 40 * s, 75 * s)
        sm.data.materials.append(smoke_material(f'ZC_smoke_{i}', i * 3.1))
    # moon key upper left, cool and dim; dark blue night sky
    sd = bpy.data.lights.new('ZC_Moon', 'SUN')
    sd.energy, sd.color, sd.angle = 0.25, (0.65, 0.75, 1.0), math.radians(1.0)
    moon = bpy.data.objects.new('ZC_Moon', sd)
    link(moon)
    moon.rotation_euler = (math.radians(55), 0, math.radians(-140))
    world((0.010, 0.014, 0.030), 1.0)
    # "you" at the railing, right third, three-quarter profile toward the fires; fire-glow rim
    person('ZC_You', (0.75, 0.75, TOP), math.radians(-15), shirt, pants, skin)
    point('ZC_FireRim', (-1.5, 6.0, TOP + 1.8), (1.0, 0.45, 0.12), 120.0, radius=1.0)
    cam = camera('ZC_Cam_B08_SH01', (0.2, -1.5, TOP + 1.7), (math.radians(80), 0, math.radians(8)), 60)
    key(cam, 0, (0.2, -1.5, TOP + 1.7))
    key(cam, LEN - 1, (0.3, -1.95, TOP + 2.0))


# ---------------------------------------------------------------- Eevee baked GI (preset suffix 'gi')
PROBES = {  # volume probe bounds per scene: centre, half extents (m), grid resolution
    'corridor': ((0.0, 10.5, 1.35), (1.05, 13.6, 1.45), (4, 32, 6)),
    'balcony': ((0.0, 0.0, 61.4), (2.4, 2.4, 1.6), (6, 6, 4)),
}


def bake_probe(scene):
    c, half, res = PROBES[scene]
    pd = bpy.data.lightprobes.new('ZC_GI', 'VOLUME')
    pd.resolution_x, pd.resolution_y, pd.resolution_z = res
    o = bpy.data.objects.new('ZC_GI', pd)
    link(o)
    o.location, o.scale = c, half
    bpy.context.view_layer.objects.active = o
    t = time.perf_counter()
    bpy.ops.object.lightprobe_cache_bake(subset='ALL')
    return {'probe': f'VOLUME grid {res}, bounds centre {c} half {half}', 'bake_seconds': round(time.perf_counter() - t, 2),
            'baked': bool(True)}


# ---------------------------------------------------------------- run
def merge_manifest(key_, data):
    m = {}
    if os.path.exists(MANIFEST):
        with open(MANIFEST) as f:
            m = json.load(f)
    m[key_] = data
    with open(MANIFEST, 'w') as f:
        json.dump(m, f, indent=2, sort_keys=True)


def main():
    scene, preset, frames = parse()
    t_build = time.perf_counter()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    info = apply_preset(sc, preset)
    {'corridor': build_corridor, 'balcony': build_balcony}[scene]()
    if preset.endswith('gi'):
        info['gi_bake'] = bake_probe(scene)
    build_s = time.perf_counter() - t_build
    outdir = os.path.join(ROOT, 'out', 'blender', 'zc-render-spike', scene, preset)
    os.makedirs(outdir, exist_ok=True)
    per = []
    for f in frames:
        sc.frame_set(f)
        sc.render.filepath = os.path.join(outdir, f'F{f:03d}.png')
        t = time.perf_counter()
        bpy.ops.render.render(write_still=True)
        dt = time.perf_counter() - t
        with open(sc.render.filepath, 'rb') as fh:
            sha = hashlib.sha256(fh.read()).hexdigest()[:16]
        per.append({'frame': f, 'seconds': round(dt, 2), 'png': os.path.relpath(sc.render.filepath, ROOT), 'sha256_16': sha})
        print(f'[zc-spike] {scene} {preset} F{f:03d} {dt:.2f}s', flush=True)
    warm = [p['seconds'] for p in per[1:]] or [per[0]['seconds']]
    merge_manifest(f'{scene}/{preset}', {
        'blender': bpy.app.version_string, 'date': time.strftime('%Y-%m-%d %H:%M'),
        'resolution': f'{W}x{H}', 'settings': info, 'build_seconds': round(build_s, 2),
        'frames': per, 'first_frame_seconds': per[0]['seconds'],
        'steady_mean_seconds': round(sum(warm) / len(warm), 2),
        'objects': len(bpy.data.objects),
        'command': f'Blender -b --python assets/blender/zc-render-spike/build.py -- {scene} {preset} {",".join(map(str, frames))}',
    })


main()
