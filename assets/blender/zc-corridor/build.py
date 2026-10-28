"""zc-corridor: ZCONDO corridor set + B01-SH01 OTS plate (SP01, VB-ZCONDO-SHORT-R3).

Blockout-grade set with zc-you / zc-infected placeholders (primitive figures, no rig yet), sized per SCALE-ZC-R2
and placed in ZC-WORLD (PROJ-ZC-R3): metres, Z-up, origin at floor level in the centre of the unit-door threshold,
door wall = plane y = 0, unit toward +Y, corridor at y < 0 running along X (+X toward the far end window, ~15 m).

Usage (headless, repo root):
  Blender -b --python assets/blender/zc-corridor/build.py -- render  [preset] [first-last] [outdir]
  Blender -b --python assets/blender/zc-corridor/build.py -- measure
    preset  : eevee64 (default) | eevee32 | eevee256 (temporal-noise reference)
    frames  : Blender frames, inclusive, default 1-150. Clock (PROJ-ZC-R3): Blender frame 1 = clip frame 0.
    outdir  : default out/blender/zc-corridor/B01-SH01/<preset>/ ; files frame_0000.png = clip frame 0.
  Existing PNGs are skipped (resume after a crash). Timings/measurements merge into sp01-manifest.json here.

Plate B01-SH01: 150 frames (5.0 s) = 0.5 s head handle + 3.5 s TH shot share + 1.0 s tail (R3 plate table).
Shot frame s (TH conform, trimStartSec 0.5) = clip frame s + 15.
"""
import bpy, sys, os, json, math, time, hashlib, random

W, H, FPS, NFRAMES = 1080, 1920, 30, 150
HEAD = 15  # clip frames of head handle
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
MANIFEST = os.path.join(HERE, 'sp01-manifest.json')
sys.path.insert(0, os.path.join(HERE, '..'))
from zc_world import DOOR_WALL  # shared with the future zc-unit (VB R3.1 / MK-Q4)

# SCALE-ZC-R2 / brief dimensions (metres)
CW, CH = 1.8, 2.6          # corridor width / height
X0, X1 = -3.0, 15.0        # corridor extent; far end window wall at x = 15
WALL = 0.2             # non-door wall thickness; the door wall uses DOOR_WALL (0.18)
DOOR_W, DOOR_H = 0.9, 2.05


# B01 look (VD-ZC-01 R3.1): 'sp01' = SP01 blockout lighting; 'r31' = window brighter, less corridor fill near the infected,
# a grazing rim light on her head/shoulders. Select with env ZC_LOOK (default r31). Her materials are identical in both.
LOOK = os.environ.get('ZC_LOOK', 'r31')
RIMP = float(os.environ.get('ZC_RIM', '600'))
LK = {'sp01': dict(win_power=700.0, win_emit=9.0, strip_far=1.0, rim=0.0, unlink=False),
      'r31': dict(win_power=float(os.environ.get('ZC_WINP','100')), win_emit=9.0, strip_far=1.0, rim=RIMP, unlink=True)}[LOOK]


def srgb(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c)


# ---------------------------------------------------------------- generic helpers
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


def link(o):
    bpy.context.scene.collection.objects.link(o)
    return o


def box(name, x0, x1, y0, y1, z0, z1, m, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
    o = bpy.context.object
    o.name = name
    o.scale = (x1 - x0, y1 - y0, z1 - z0)
    o.data.materials.append(m)
    if parent:
        o.parent = parent
    return o


def prim(kind, name, loc, scale, m, rot=(0, 0, 0), parent=None):
    if kind == 'sphere':
        bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, location=loc, rotation=rot)
    elif kind == 'cone':
        bpy.ops.mesh.primitive_cone_add(vertices=32, location=loc, rotation=rot)
    else:
        bpy.ops.mesh.primitive_cylinder_add(vertices=24, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    o.scale = scale
    o.data.materials.append(m)
    bpy.ops.object.shade_smooth()
    if parent:
        o.parent = parent
    return o


def empty(name, loc=(0, 0, 0), rot=(0, 0, 0)):
    o = bpy.data.objects.new(name, None)
    link(o)
    o.location, o.rotation_euler = loc, rot
    return o


def area(name, loc, size, color, power, rot=(0, 0, 0)):
    ld = bpy.data.lights.new(name, 'AREA')
    ld.shape = 'RECTANGLE'
    ld.size, ld.size_y = size
    ld.color, ld.energy = color, power
    o = bpy.data.objects.new(name, ld)
    link(o)
    o.location, o.rotation_euler = loc, rot
    return o


# ---------------------------------------------------------------- characters (placeholders; rig = S-03/S-04 later)
def zc_you(m):
    """zc-you placeholder: 1.72 m, eye 1.61 m. Local frame: front = -Y, feet at origin. Floor anchor = root origin."""
    r = empty('zc-you')
    P = lambda *a, **k: prim(*a, parent=r, **k)
    for s in (-1, 1):
        P('cyl', f'zc-you_leg{s}', (0.09 * s, 0, 0.30), (0.062, 0.062, 0.30), m['skin'])      # bare shins
        P('cyl', f'zc-you_shorts{s}', (0.095 * s, 0, 0.72), (0.085, 0.085, 0.14), m['shorts'])
        P('cyl', f'zc-you_arm{s}', (0.235 * s, 0, 1.22), (0.056, 0.056, 0.14), m['tee'])      # sleeve
        P('cyl', f'zc-you_fore{s}', (0.245 * s, 0, 0.93), (0.042, 0.042, 0.17), m['skin'])
        P('sphere', f'zc-you_foot{s}', (0.09 * s, -0.05, 0.03), (0.05, 0.11, 0.03), m['skin'])
    P('sphere', 'zc-you_hips', (0, 0, 0.88), (0.17, 0.11, 0.10), m['shorts'])
    P('sphere', 'zc-you_torso', (0, 0, 1.18), (0.20, 0.12, 0.30), m['tee'])
    P('cyl', 'zc-you_neck', (0, 0, 1.47), (0.048, 0.048, 0.05), m['skin'])
    P('sphere', 'zc-you_head', (0, -0.005, 1.60), (0.085, 0.10, 0.115), m['skin'])
    P('sphere', 'zc-you_hair', (0, 0.012, 1.635), (0.09, 0.103, 0.095), m['hair'])
    P('sphere', 'zc-you_earL', (-0.085, 0.0, 1.60), (0.012, 0.025, 0.03), m['skin'])
    P('sphere', 'zc-you_earR', (0.085, 0.0, 1.60), (0.012, 0.025, 0.03), m['skin'])
    # trash bag in the right hand (local -X = his right when facing -Y)
    bag = P('sphere', 'zc-you_trashbag', (-0.27, -0.02, 0.62), (0.17, 0.15, 0.22), m['bag'])
    P('cone', 'zc-you_bagknot', (-0.27, -0.02, 0.86), (0.04, 0.04, 0.06), m['bag'])
    return r


def zc_infected(m):
    """zc-infected placeholder: 1.65 m (~1.55 m stooped), long pale sleep shirt, long hair. Front = -Y."""
    r = empty('zc-infected')
    P = lambda *a, **k: prim(*a, parent=r, **k)
    for s in (-1, 1):
        P('cyl', f'zc-inf_leg{s}', (0.075 * s, 0, 0.26), (0.05, 0.05, 0.26), m['skin_inf'])
        P('cyl', f'zc-inf_arm{s}', (0.21 * s, -0.02, 1.02), (0.042, 0.042, 0.29), m['skin_inf'], rot=(0.12, 0, 0))
    P('cone', 'zc-inf_shirt', (0, 0, 0.92), (0.25, 0.19, 0.50), m['sleep'])               # knee-length sleep shirt
    P('sphere', 'zc-inf_shoulders', (0, 0, 1.32), (0.19, 0.11, 0.09), m['sleep'])
    P('cyl', 'zc-inf_neck', (0, -0.02, 1.43), (0.04, 0.04, 0.05), m['skin_inf'])
    P('sphere', 'zc-inf_head', (0, -0.03, 1.54), (0.08, 0.095, 0.11), m['skin_inf'])
    P('sphere', 'zc-inf_hair', (0, 0.01, 1.48), (0.105, 0.09, 0.21), m['hair'])            # long hair down the back
    return r


# ---------------------------------------------------------------- set
def materials():
    return {
        'wall': mat('zc_corr_wall', srgb('#9fbfb8'), 0.75),
        'floor': mat('zc_corr_floor', tuple(c * float(os.environ.get('ZC_FLOOR', '1')) for c in srgb('#5d6a66')), 0.35),
        'ceiling': mat('zc_corr_ceiling', srgb('#b9c6c2'), 0.9),
        'door': mat('zc_corr_door', srgb('#3c4644'), 0.45, 0.2),
        'frame': mat('zc_corr_doorframe', srgb('#7d8a86'), 0.5, 0.3),
        'handle': mat('zc_corr_handle', (0.6, 0.6, 0.6), 0.25, 1.0),
        'skirting': mat('zc_corr_skirting', srgb('#4a5552'), 0.5),
        'unit': mat('zc_unit_wall', srgb('#d9c7ad'), 0.8),
        'window': mat('zc_corr_window', (1, 1, 1), 0.5, emit=srgb('#fff1dc'), strength=LK['win_emit']),
        'mullion': mat('zc_corr_mullion', (0.08, 0.08, 0.08), 0.5),
        'tube': mat('zc_corr_tube', (1, 1, 1), 0.4, emit=srgb('#e8fff6'), strength=14.0),
        'tube_flicker': mat('zc_corr_tube_flicker', (1, 1, 1), 0.4, emit=srgb('#e8fff6'), strength=14.0),
        'housing': mat('zc_corr_tube_housing', (0.75, 0.78, 0.77), 0.5, 0.4),
        'sign': mat('zc_corr_exit', (0.1, 0.6, 0.3), 0.5, emit=(0.15, 1.0, 0.4), strength=5.0),
        'blood': mat('zc_blood_smear', srgb('#5a1414'), 0.85),
        'skin': mat('zc_you_skin', srgb('#b98a6a'), 0.55),
        'hair': mat('zc_hair', srgb('#141414'), 0.6),
        'tee': mat('zc_you_tee', srgb('#2f5656'), 0.85),
        'shorts': mat('zc_you_shorts', srgb('#7c7f80'), 0.85),
        'bag': mat('zc_trashbag', srgb('#121315'), 0.3),
        'skin_inf': mat('zc_inf_skin', srgb('#9a9486'), 0.6),
        'sleep': mat('zc_inf_sleepshirt', srgb('#d8d4c8'), 0.85),
    }


def build_set(m):
    yC0, yC1 = -CW, 0.0   # corridor interior y range
    box('zc-corr_floor', X0, X1 + WALL, yC0 - WALL, 3.2, -0.1, 0.0, m['floor'])
    box('zc-corr_ceiling', X0, X1 + WALL, yC0 - WALL, 3.2, CH, CH + 0.1, m['ceiling'])
    box('zc-corr_wall_far', X0, X1, yC0 - WALL, yC0, 0, CH, m['wall'])                      # opposite wall
    box('zc-corr_wall_back', X0 - WALL, X0, yC0, 0, 0, CH, m['wall'])
    # door wall y in [0, DOOR_WALL], with the zc-you unit door opening at x in [-0.45, 0.45]
    box('zc-corr_doorwall_a', X0, -DOOR_W / 2, 0, DOOR_WALL, 0, CH, m['wall'])
    box('zc-corr_doorwall_b', DOOR_W / 2, X1, 0, DOOR_WALL, 0, CH, m['wall'])
    box('zc-corr_doorwall_head', -DOOR_W / 2, DOOR_W / 2, 0, DOOR_WALL, DOOR_H, CH, m['wall'])
    # end wall with the far window (warm-white backlight)
    wy0, wy1, wz0, wz1 = yC0 + 0.35, -0.35, 0.75, 2.3
    box('zc-corr_end_low', X1, X1 + WALL, yC0, 0, 0, wz0, m['wall'])
    box('zc-corr_end_high', X1, X1 + WALL, yC0, 0, wz1, CH, m['wall'])
    box('zc-corr_end_l', X1, X1 + WALL, yC0, wy0, wz0, wz1, m['wall'])
    box('zc-corr_end_r', X1, X1 + WALL, wy1, 0, wz0, wz1, m['wall'])
    box('zc-corr_window', X1 + 0.15, X1 + 0.17, wy0, wy1, wz0, wz1, m['window'])
    box('zc-corr_mullion', X1 + 0.12, X1 + 0.14, -0.92, -0.88, wz0, wz1, m['mullion'])
    area('zc-corr_window_light', (X1 + 0.05, -0.9, 1.55), (1.1, 1.5), srgb('#fff1dc'), LK['win_power'],
         rot=(0, math.radians(-90), 0))
    # skirting
    box('zc-corr_skirt_far', X0, X1, yC0, yC0 + 0.015, 0, 0.1, m['skirting'])
    # neighbour doors (flush, no peepholes, no numbers)
    for i, x in enumerate([4.0, 8.0, 12.0]):
        box(f'zc-corr_door_n{i}', x - 0.45, x + 0.45, -0.03, 0.0, 0, DOOR_H, m['door'])
        box(f'zc-corr_handle_n{i}', x + 0.30, x + 0.38, -0.07, -0.03, 1.0, 1.03, m['handle'])
    for i, x in enumerate([2.0, 6.0, 10.0, 14.0 - 0.1]):
        box(f'zc-corr_door_o{i}', x - 0.45, x + 0.45, yC0, yC0 + 0.03, 0, DOOR_H, m['door'])
        box(f'zc-corr_handle_o{i}', x - 0.38, x - 0.30, yC0 + 0.03, yC0 + 0.07, 1.0, 1.03, m['handle'])
        box(f'zc-corr_frame_o{i}', x - 0.5, x + 0.5, yC0, yC0 + 0.035, DOOR_H, DOOR_H + 0.06, m['frame'])
    # generic exit sign without text
    box('zc-corr_exitsign', X1 - 0.03, X1, -0.15, 0.0 - 0.02, 2.35, 2.5, m['sign'])
    # unit interior stub behind the door (warm) + the open inward door leaf (hinge at -X jamb)
    box('zc-unit_wall_l', -1.6 - WALL, -1.6, DOOR_WALL, 3.0, 0, CH, m['unit'])
    box('zc-unit_wall_r', 1.6, 1.6 + WALL, DOOR_WALL, 3.0, 0, CH, m['unit'])
    box('zc-unit_wall_back', -1.6, 1.6, 3.0, 3.0 + WALL, 0, CH, m['unit'])
    lu = bpy.data.lights.new('zc-unit_practical', 'POINT')
    lu.color, lu.energy, lu.shadow_soft_size = srgb('#ffd9a8'), 120.0, 0.3
    lo = bpy.data.objects.new('zc-unit_practical', lu)
    link(lo)
    lo.location = (0.4, 1.8, 2.3)
    hinge = empty('zc-unit_door_hinge', (-DOOR_W / 2, DOOR_WALL, 0))
    box('zc-unit_door', 0.0, DOOR_W, 0.0, 0.045, 0, DOOR_H - 0.01, m['door'], parent=hinge)
    box('zc-unit_door_handle', DOOR_W - 0.12, DOOR_W - 0.06, -0.04, 0.0, 1.0, 1.03, m['handle'], parent=hinge)
    hinge.rotation_euler = (0, 0, math.radians(70))      # inward door already open (brief: may be ajar at F0)
    # fluorescent strips along the corridor centreline (one flickers, seeded and baked)
    strips = []
    for i, x in enumerate([-1.5, 1.5, 4.5, 7.5, 10.5, 13.5]):
        flick = (i == 3)
        dead = (i == 4)   # tube in front of her is dead, so the far window backlights her into a silhouette
        box(f'zc-corr_strip_housing_{i}', x - 0.65, x + 0.65, -0.98, -0.82, CH - 0.04, CH, m['housing'])
        box(f'zc-corr_strip_tube_{i}', x - 0.6, x + 0.6, -0.93, -0.87, CH - 0.07, CH - 0.04,
            m['housing'] if dead else (m['tube_flicker'] if flick else m['tube']))
        if dead:
            continue
        base = 38.0 * (LK['strip_far'] if x >= 6.0 else 1.0)   # r31: less corridor fill near the infected (x = 12)
        L = area(f'zc-corr_strip_light_{i}', (x, -0.9, CH - 0.08), (1.2, 0.12), srgb('#e8fff6'), base)
        L['base_energy'] = base
        strips.append((L, flick))
    if LK['rim']:
        # grazing rim from the window side: high and behind her, aimed down at head/shoulders (top surfaces the camera sees)
        rim = area('zc-infected_rim', (13.6, -0.95, 2.45), (0.5, 0.5), srgb('#fff1dc'), LK['rim'],
                   rot=(0, math.radians(-125), 0))
    # blood smear trail on the floor near her (VD-ZC-GORE: dark matte)
    rnd = random.Random(101)
    for j in range(7):
        x = 10.6 + j * 0.22 + rnd.uniform(-0.05, 0.05)
        y = -0.75 + rnd.uniform(-0.12, 0.12)
        box(f'zc-corr_blood_{j}', x - 0.12, x + 0.12, y - 0.05 - 0.03 * rnd.random(), y + 0.05, 0.0, 0.002, m['blood'])
    return strips


def bake_flicker(strips, m):
    """Seeded fluorescent flicker (seed 'B01-SH01-strip3'): mostly on, short dips/stutters. Baked as keyframes."""
    rnd = random.Random('B01-SH01-strip3')
    lvl = []
    f = 1
    while f <= NFRAMES:
        if rnd.random() < 0.06:
            n = rnd.randint(2, 5)
            for k in range(n):
                lvl.append(rnd.choice([0.05, 0.25, 0.6]) if k % 2 == 0 else 1.0)
            f += n
        else:
            lvl.append(1.0)
            f += 1
    lvl = lvl[:NFRAMES]
    em = m['tube_flicker'].node_tree.nodes['Principled BSDF'].inputs['Emission Strength']
    for L, flick in strips:
        if not flick:
            continue
        for i, v in enumerate(lvl):
            L.data.energy = L['base_energy'] * v
            L.data.keyframe_insert('energy', frame=i + 1)
            em.default_value = 14.0 * v
            em.keyframe_insert('default_value', frame=i + 1)
    return lvl


# ---------------------------------------------------------------- shot B01-SH01
def build_shot(m):
    you = zc_you(m)
    inf = zc_infected(m)
    # zc-you: in the doorway, turned toward +X (down the corridor), steps out over the first ~1.3 s, then freezes.
    face_x = math.radians(90)  # local front -Y rotated to +X
    for f, loc in [(1, (0.08, -0.14, 0.0)), (25, (0.12, -0.17, 0.0)), (45, (0.15, -0.19, 0.0)), (NFRAMES, (0.15, -0.19, 0.0))]:
        you.location = loc
        you.keyframe_insert('location', frame=f)
    you.rotation_euler = (0, 0, face_x)
    # zc-infected: ~12 m away near the far window, back to camera, stooped, too still (tiny sway only).
    inf.location = (12.0, -0.95, 0.0)
    inf.rotation_euler = (0, 0, math.radians(90))   # local front (-Y) -> +X: faces the window, back to camera
    # stoop: lean forward toward +X (her front) about the floor anchor
    lean = empty('zc-infected_stoop', (12.0, -0.95, 0.0))
    inf.parent = lean
    inf.location = (0, 0, 0)
    for f, a in [(1, 7.0), (75, 7.6), (NFRAMES, 7.1)]:
        lean.rotation_euler = (0, math.radians(a), 0)
        lean.keyframe_insert('rotation_euler', frame=f)
    # OTS camera behind his right shoulder, vFOV 55, sensor fit vertical, lens shift (no tilt), slow push along +X.
    cd = bpy.data.cameras.new('zc-cam_B01-SH01')
    cd.sensor_fit = 'VERTICAL'
    cd.sensor_height = 24.0
    cd.angle_y = math.radians(55)
    cd.shift_y = -0.20
    cd.clip_start, cd.clip_end = 0.05, 100
    cam = bpy.data.objects.new('zc-cam_B01-SH01', cd)
    link(cam)
    cam.rotation_euler = (math.radians(90), 0, math.radians(-90))   # level, looking +X
    for f, loc in [(1, (-1.15, -0.36, 1.56)), (NFRAMES, (-0.95, -0.36, 1.56))]:
        cam.location = loc
        cam.keyframe_insert('location', frame=f)
    bpy.context.scene.camera = cam
    return you, inf, cam


def add_gi_probe():
    """Baked volume probe(s) whose bounds enclose every lit surface (DF-20261028-zcondo-eevee-render-spike)."""
    out = []
    for name, c, half, res in [
        ('zc-corr_gi', ((X0 + X1 + WALL) / 2, -0.9, CH / 2), ((X1 + WALL - X0) / 2 + 0.05, CW / 2 + 0.25, CH / 2 + 0.08), (40, 5, 6)),
        ('zc-unit_gi', (0.0, 1.6, CH / 2), (1.85, 1.55, CH / 2 + 0.08), (6, 6, 5)),
    ]:
        pd = bpy.data.lightprobes.new(name, 'VOLUME')
        pd.resolution_x, pd.resolution_y, pd.resolution_z = res
        o = bpy.data.objects.new(name, pd)
        link(o)
        o.location, o.scale = c, half
        out.append({'name': name, 'centre': c, 'half_extents': half, 'grid': res})
    bpy.context.scene.frame_set(1)
    t = time.perf_counter()
    bpy.ops.object.lightprobe_cache_bake(subset='ALL')
    return out, round(time.perf_counter() - t, 2)


def render_settings(sc, preset):
    r = sc.render
    r.engine = 'BLENDER_EEVEE'
    r.resolution_x, r.resolution_y, r.resolution_percentage = W, H, 100
    r.fps = FPS
    sc.frame_start, sc.frame_end = 1, NFRAMES
    r.image_settings.file_format = 'PNG'
    r.image_settings.color_mode = 'RGB'
    r.image_settings.color_depth = '8'
    sc.view_settings.view_transform = 'AgX'
    sc.view_settings.look = 'None'
    sc.display_settings.display_device = 'sRGB'
    e = sc.eevee
    e.taa_render_samples = int(preset.replace('eevee', ''))
    e.use_raytracing = True
    e.ray_tracing_method = 'SCREEN'
    e.ray_tracing_options.resolution_scale = '2'
    e.ray_tracing_options.use_denoise = True
    e.use_fast_gi = True
    e.fast_gi_method = 'GLOBAL_ILLUMINATION'
    e.use_shadows = True
    e.shadow_ray_count = 1
    e.shadow_step_count = 6
    sc.world = bpy.data.worlds.new('zc-world')
    sc.world.use_nodes = True
    sc.world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.01, 0.012, 0.012, 1)
    return {'engine': 'BLENDER_EEVEE', 'taa_render_samples': e.taa_render_samples, 'raytracing': 'SCREEN, res 1/2, denoise',
            'fast_gi': True, 'shadows': 'ray 1 / step 6', 'view_transform': 'AgX', 'look': 'None', 'output': 'PNG 8-bit RGB sRGB'}


def build(preset):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.preferences.edit.keyframe_new_interpolation_type = 'LINEAR'
    sc = bpy.context.scene
    info = render_settings(sc, preset)
    m = materials()
    strips = build_set(m)
    lvl = bake_flicker(strips, m)
    you, inf, cam = build_shot(m)
    if LK['unlink']:
        # r31: the corridor strip lights do not light the infected (light linking); only the window rim reaches her.
        # Her materials are unchanged (pale shirt stays pale for SH02).
        col = bpy.data.collections.new('zc-infected_unlit_by_strips')
        for o in bpy.data.objects:
            if o.type == 'MESH' and o.name.startswith('zc-inf'):
                col.objects.link(o)
        for co in col.collection_objects:
            co.light_linking.link_state = 'EXCLUDE'
        for L, _ in strips:
            L.light_linking.receiver_collection = col
    probes, bake_s = add_gi_probe()
    info['gi_probes'] = probes
    info['gi_bake_seconds'] = bake_s
    info['flicker_levels_dips'] = [i for i, v in enumerate(lvl) if v < 1.0]  # clip frames with a dip
    return sc, info


# ---------------------------------------------------------------- measurement (projected geometry bounds per clip frame)
def measure(sc):
    from bpy_extras.object_utils import world_to_camera_view
    dg = bpy.context.evaluated_depsgraph_get()

    def bounds(prefix, frame):
        xs, ys = [], []
        for o in bpy.data.objects:
            if o.type != 'MESH' or not o.name.startswith(prefix):
                continue
            oe = o.evaluated_get(dg)
            mw = oe.matrix_world
            for v in oe.data.vertices:
                p = world_to_camera_view(sc, sc.camera, mw @ v.co)
                if p.z > 0:
                    xs.append(p.x * W)
                    ys.append((1 - p.y) * H)
        return xs, ys

    res = {}
    for clip_f in [0, 15, 51, 75, 119, 149]:
        sc.frame_set(clip_f + 1)
        dg = bpy.context.evaluated_depsgraph_get()
        out = {}
        for key, prefix in [('you', 'zc-you_'), ('you_head', 'zc-you_head'), ('you_hair', 'zc-you_hair'), ('infected', 'zc-inf')]:
            xs, ys = bounds(prefix, clip_f)
            out[key] = {'x': [round(min(xs)), round(max(xs))], 'y': [round(min(ys)), round(max(ys))]}
        y = out['you']['y']
        out['you_visible_height_px'] = round(min(y[1], H) - max(y[0], 0))
        iy = out['infected']['y']
        out['infected_height_px'] = iy[1] - iy[0]
        res[f'clip_F{clip_f}'] = out
    return res


# ---------------------------------------------------------------- B01 look measurement (VD-ZC-01 R3.1)
def render_look(sc, clip_f, outdir):
    """Beauty (Eevee 64) + Workbench flat-colour mask at one clip frame; luminance of figure vs window pane on the PNG."""
    import numpy as np
    os.makedirs(outdir, exist_ok=True)
    sc.frame_set(clip_f + 1)
    beauty = os.path.join(outdir, f'beauty_F{clip_f}.png')
    sc.render.filepath = beauty
    bpy.ops.render.render(write_still=True)
    # mask: figure = red, window pane = green, everything else black (flat, no AA bleed from lighting)
    sc.render.engine = 'BLENDER_WORKBENCH'
    sc.view_settings.view_transform = 'Standard'
    sh = sc.display
    sh.shading.light, sh.shading.color_type = 'FLAT', 'OBJECT'
    sc.display.render_aa = 'OFF'
    for o in bpy.data.objects:
        if o.type == 'MESH':
            o.color = (1, 0, 0, 1) if o.name.startswith('zc-inf') else (0, 1, 0, 1) if o.name == 'zc-corr_window' else (0, 0, 0, 1)
    sc.world.node_tree.nodes['Background'].inputs['Color'].default_value = (0, 0, 0, 1)
    mask = os.path.join(outdir, f'mask_F{clip_f}.png')
    sc.render.filepath = mask
    bpy.ops.render.render(write_still=True)

    def px(path):
        im = bpy.data.images.load(path)
        im.colorspace_settings.name = 'Non-Color'
        a = np.array(im.pixels[:], dtype=np.float32).reshape(H, W, 4)[::-1, :, :3]   # top-left origin, raw display values
        return a
    B, M = px(beauty), px(mask)
    fig, win = M[..., 0] > 0.5, M[..., 1] > 0.5
    lin = lambda v: np.where(v <= 0.04045, v / 12.92, ((v + 0.055) / 1.055) ** 2.4)
    Y = lambda v: 0.2126 * v[..., 0] + 0.7152 * v[..., 1] + 0.0722 * v[..., 2]
    Yd, Yl = Y(B), Y(lin(B))
    out = {'clip_frame': clip_f, 'figure_px': int(fig.sum()), 'window_px': int(win.sum()),
           'figure_mean_display': float(Yd[fig].mean()), 'window_mean_display': float(Yd[win].mean()),
           'figure_mean_linear': float(Yl[fig].mean()), 'window_mean_linear': float(Yl[win].mean())}
    out['ratio_display'] = out['figure_mean_display'] / out['window_mean_display']
    out['ratio_linear'] = out['figure_mean_linear'] / out['window_mean_linear']
    # rim: brightest 8% of figure pixels vs figure median (visible rim = a bright edge band)
    fv = Yd[fig]
    out['figure_p50_display'], out['figure_p95_display'] = float(np.percentile(fv, 50)), float(np.percentile(fv, 95))
    ys, xs = np.nonzero(fig)
    out['figure_bbox'] = [int(xs.min()), int(xs.max()), int(ys.min()), int(ys.max())]
    return out


# ---------------------------------------------------------------- main
def merge(key, data):
    mf = {}
    if os.path.exists(MANIFEST):
        with open(MANIFEST) as f:
            mf = json.load(f)
    mf[key] = data
    with open(MANIFEST, 'w') as f:
        json.dump(mf, f, indent=2, sort_keys=True)


def parse_range(s):
    a, b = s.split('-')
    return range(int(a), int(b) + 1)


def main():
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    cmd = a[0] if a else 'render'
    preset = a[1] if len(a) > 1 else 'eevee64'
    frames = parse_range(a[2]) if len(a) > 2 else range(1, NFRAMES + 1)
    t0 = time.perf_counter()
    sc, info = build(preset)
    build_s = round(time.perf_counter() - t0, 2)
    if cmd == 'look':
        cf = int(a[1]) if len(a) > 1 else 51
        od = os.path.join(ROOT, 'out', 'qa', 'zombie-condo', 'sp02', 'look', LOOK)
        r = render_look(sc, cf, od)
        r['look'] = LOOK
        r['params'] = LK
        print('[zc-corridor] LOOK ' + json.dumps(r), flush=True)
        merge(f'look/{LOOK}/F{cf}', r)
        return
    if cmd == 'measure':
        merge('measure', {'camera': 'zc-cam_B01-SH01 vFOV 55 sensor-fit VERTICAL shift_y -0.20, level (no tilt)',
                          'note': 'projected geometry bounds (px, origin top-left), not occlusion-aware', 'frames': measure(sc)})
        return
    outdir = a[3] if len(a) > 3 else os.path.join(ROOT, 'out', 'blender', 'zc-corridor', 'B01-SH01', preset)
    os.makedirs(outdir, exist_ok=True)
    times = {}
    for bf in frames:
        path = os.path.join(outdir, f'frame_{bf - 1:04d}.png')
        if os.path.exists(path):
            continue
        sc.frame_set(bf)
        sc.render.filepath = path
        t = time.perf_counter()
        bpy.ops.render.render(write_still=True)
        times[bf - 1] = round(time.perf_counter() - t, 2)
        print(f'[zc-corridor] {preset} clip F{bf - 1:03d} {times[bf - 1]:.2f}s', flush=True)
    if times:
        v = sorted(times.values())
        key = f'render/{preset}/{min(times)}-{max(times)}'
        merge(key, {'blender': bpy.app.version_string, 'date': time.strftime('%Y-%m-%d %H:%M'), 'settings': info,
                    'build_seconds': build_s, 'frames_rendered': len(times), 'first_seconds': times[min(times)],
                    'mean_seconds': round(sum(v) / len(v), 2), 'median_seconds': v[len(v) // 2], 'max_seconds': v[-1],
                    'total_seconds': round(sum(v), 1), 'outdir': os.path.relpath(outdir, ROOT)})


if __name__ == '__main__':
    main()
