"""SP02 section-cutaway spike (VB-ZCONDO-SHORT-R3.1): zc-unit grey blockout + caps + neighbour slices + zc-you placeholders.

THROWAWAY BLOCKOUT: placeholder grey geometry and primitive mannequins, not the final zc-unit / zc-you / zc-cabinet assets (S-03..S-07).
Reuses the zc-corridor placeholders and materials (assets/blender/zc-corridor/build.py) and the shared door-wall constant
(assets/blender/zc_world.py DOOR_WALL = 0.18 m, MK-Q4).

World: ZC-WORLD (PROJ-ZC-R3): metres, Z-up, origin = floor at the unit-door threshold centre, door wall = y in [0, DOOR_WALL],
unit toward +Y, corridor at y < 0, interior x in [-1.6, +1.78 cut plane].
Camera: CAM-SECTION / CAM-SECTION-LL at x = +17, z = 1.70, looking -X (screen-right = +Y), no tilt/roll/pan, Y-only truck;
vFOV from coverage C at x = 0; lens shift solved so the floor at x = 0 projects to y = 860.

Usage (headless, repo root):
  Blender -b --python assets/blender/zc-unit/build_sp02.py -- <cmd> [args]
    geometry                      contact / door-wall / cap numeric checks (no render)
    still <shot> [outdir]         shot in B02 | B09SH01 | B09SH03 | B07SH02 | B07SH02mid  (Eevee 64, 1080x1920 PNG)
    truck [first-last] [outdir]   60-frame CAM-SECTION truck, corridor capped
    project                       projected sizes (lead height, floor line) per shot
Results merge into sp02-manifest.json (next to this file); PNGs go to out/blender/zc-unit/sp02/ (Git-ignored).
"""
import bpy, sys, os, json, math, time, importlib.util
from mathutils import Vector, Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
MANIFEST = os.path.join(HERE, 'sp02-manifest.json')
sys.path.insert(0, os.path.join(HERE, '..'))
from zc_world import DOOR_WALL

_spec = importlib.util.spec_from_file_location('zc_corridor_build', os.path.join(HERE, '..', 'zc-corridor', 'build.py'))
cb = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(cb)

W, H, FPS = 1080, 1920, 30
CUT_X = 1.78
BACK_X = -1.6
CORR_W = 1.8
CAM_X, CAM_Z = 17.0, 1.70
FLOOR_PX = 860
SLAB = 0.25
CH = 2.6
STEP = CH + SLAB          # vertical period of the stacked units
SEAT_Z = 0.45
UP = Vector((0, 0, 1))

# ------------------------------------------------------------------ shots (values copied from sheets ZCONDO-SHORT-SS-R2.1)
SHOTS = {
    # name: coverage m, camera y, corridor state, lead pose
    'B02': dict(cov=6.4, cam_y=0.0, corridor='open', pose='stand_b02'),
    'B09SH01': dict(cov=3.4, cam_y=0.90, corridor='capped', pose='floor'),
    'B09SH03': dict(cov=3.4, cam_y=0.35, corridor='capped', pose='floor'),
    'B07SH02': dict(cov=4.6, cam_y=8.19, corridor='capped', pose='sofa'),     # truck clip 95 = last TH frame (5.70 + 95 * 0.0262)
    'B07SH02mid': dict(cov=4.6, cam_y=6.51, corridor='capped', pose='sofa'),  # clip 31, he is fully in frame from here
    'B07SH02start': dict(cov=4.6, cam_y=5.70, corridor='capped', pose='sofa'),  # clip 0
}


def vfov(cov):
    return 2 * math.atan(cov / 2 / CAM_X)


# ------------------------------------------------------------------ materials
def sp02_materials():
    m = cb.materials()
    m['grey'] = cb.mat('sp02_grey', cb.srgb('#8f8f8f'), 0.8)
    m['grey_d'] = cb.mat('sp02_grey_dark', cb.srgb('#4b4b4b'), 0.85)
    m['wood'] = cb.mat('sp02_cabinet', cb.srgb('#b49a78'), 0.7)
    m['sofa'] = cb.mat('sp02_sofa', cb.srgb('#6b6f78'), 0.9)
    m['bucket'] = cb.mat('sp02_bucket', cb.srgb('#3b6aa8'), 0.5)
    m['can'] = cb.mat('sp02_can', cb.srgb('#c2c2c2'), 0.3, 0.9)
    m['floor'] = cb.mat('sp02_floor', cb.srgb('#2f2c29'), 0.7)
    m['neigh'] = cb.mat('sp02_neighbour', cb.srgb('#1c1c1c'), 0.9)
    m['phone'] = cb.mat('sp02_phone', cb.srgb('#101010'), 0.2)
    m['bread'] = cb.mat('sp02_bread', cb.srgb('#c8a15b'), 0.8)

    def flat(name, hexc):
        # cut faces are unlit flat colour (emission), so light leaks and z-fighting show as colour changes
        mm = bpy.data.materials.new(name)
        mm.use_nodes = True
        nt = mm.node_tree
        for n in list(nt.nodes):
            nt.nodes.remove(n)
        e = nt.nodes.new('ShaderNodeEmission')
        e.inputs['Color'].default_value = (*cb.srgb(hexc), 1)
        e.inputs['Strength'].default_value = 1.0
        o = nt.nodes.new('ShaderNodeOutputMaterial')
        nt.links.new(e.outputs[0], o.inputs[0])
        return mm
    m['cap_wall'] = flat('sp02_cap_wall', '#b8b8b8')     # door wall / partition cut faces
    m['cap_slab'] = flat('sp02_cap_slab', '#202020')     # floor/ceiling slabs and neighbour slices (dark for captions)
    m['cap_black'] = flat('sp02_cap_black', '#000000')   # capped corridor (ZC-CUT-02)
    m['cap_corr'] = flat('sp02_cap_corr', '#303a38')     # open corridor: corridor slabs / far wall cut faces
    return m


def B(name, x0, x1, y0, y1, z0, z1, mt):
    return cb.box(name, x0, x1, y0, y1, z0, z1, mt)


# ------------------------------------------------------------------ set
def build_unit(m, corridor):
    # --- unit shell, solid walls run to the cut plane; the cut faces at x = CUT_X are the caps (flat unlit colour)
    # door wall (0.18 m, shared constant). Solid body behind the cap so the cap is the true cut face.
    B('zc-unit_doorwall', BACK_X - 0.05, CUT_X, 0.0, DOOR_WALL, 0, CH, m['grey'])
    B('zc-cap_doorwall', CUT_X, CUT_X + 0.002, 0.0, DOOR_WALL, 0, CH, m['cap_wall'])
    # partitions (0.10) with doorways from x 0.30 to the cut plane, lintel z 2.05 (MK-ZC-ST-02)
    for nm, y0 in [('p1', 1.50), ('p2', 3.30)]:
        B(f'zc-unit_{nm}', BACK_X, 0.30, y0, y0 + 0.10, 0, CH, m['grey'])
        B(f'zc-unit_{nm}_lintel', 0.30, CUT_X, y0, y0 + 0.10, 2.05, CH, m['grey'])
        B(f'zc-cap_{nm}', CUT_X, CUT_X + 0.002, y0, y0 + 0.10, 2.05, CH, m['cap_wall'])
    # back wall (x = -1.6 face) + balcony glazing frame at y 9.20, railing y 10.70
    B('zc-unit_backwall', BACK_X - 0.18, BACK_X, 0.0, 10.7, 0, CH, m['grey'])
    B('zc-unit_glazing_frame', BACK_X, CUT_X, 9.20, 9.24, 0, CH, m['grey_d'])
    B('zc-unit_railing', BACK_X, CUT_X, 10.66, 10.70, 0, 1.10, m['grey_d'])
    # unit floor / ceiling slabs (0.25) over the whole span incl. balcony and corridor strip below the unit
    y_lo = -(CORR_W + DOOR_WALL)
    y_hi = 10.7
    for k in (-2, -1, 0, 1, 2):          # slab k sits below the unit whose floor is at z = k * STEP
        z1 = k * STEP
        B(f'zc-unit_slab{k}', BACK_X - 0.18, CUT_X, y_lo, y_hi, z1 - SLAB, z1, m['floor'])
        B(f'zc-cap_slab{k}', CUT_X, CUT_X + 0.002, y_lo, y_hi, z1 - SLAB, z1, m['cap_slab'])
    # neighbour units above / below: back wall + side only (dark), so nothing reads as detail
    for k in (-2, -1, 1, 2):
        z0 = k * STEP
        B(f'zc-neighbour_back{k}', BACK_X - 0.18, BACK_X, y_lo, y_hi, z0, z0 + CH, m['neigh'])
        B(f'zc-neighbour_floorfill{k}', BACK_X, CUT_X, y_lo, y_hi, z0 - 0.02, z0, m['neigh'])
    # corridor strip (y < 0): open = visible corridor interior with its far wall; capped = a single pure-black cap
    if corridor == 'open':
        B('zc-corr_far', BACK_X - 3.0, CUT_X, -(CORR_W + DOOR_WALL), -CORR_W, 0, CH, m['grey'])
        B('zc-cap_corr_far', CUT_X, CUT_X + 0.002, -(CORR_W + DOOR_WALL), -CORR_W, 0, CH, m['cap_corr'])
        B('zc-corr_end', BACK_X - 3.0, BACK_X - 2.9, -CORR_W, 0, 0, CH, m['grey'])
        B('zc-corr_floor_top', BACK_X - 3.0, CUT_X, -CORR_W, 0, -0.01, 0.0, m['grey_d'])
    else:
        B('zc-cap_corridor_black', CUT_X + 0.004, CUT_X + 0.006, -(CORR_W + DOOR_WALL), 0.0, -SLAB + 0.0, CH + SLAB, m['cap_black'])
    # --- fixtures (MK-ZC-ST-03, boxes only)
    B('zc-fridge', BACK_X, -1.0, 3.40, 4.05, 0, 1.75, m['grey_d'])
    B('zc-counter', BACK_X, -1.0, 4.15, 5.60, 0, 0.90, m['grey_d'])
    B('zc-sofa_seat', -1.40, -0.85, 6.80, 7.80, 0, SEAT_Z, m['sofa'])
    B('zc-sofa_back', BACK_X, -1.40, 6.80, 7.80, 0, 0.85, m['sofa'])
    B('zc-sidetable', -1.50, -1.10, 7.85, 8.25, 0, 0.50, m['grey_d'])
    cb.prim('sphere', 'zc-apple', (-1.30, 8.05, 0.55), (0.04, 0.04, 0.04), m['bucket'])
    # cabinet: B02 parked state at y [1.05,1.45]; flush barricade state y [0.18,0.58]
    return


def add_cabinet(m, flush):
    y0 = DOOR_WALL if flush else 1.05
    return B('zc-cabinet', -0.4, 0.4, y0, y0 + 0.40, 0, 1.75, m['wood'])


def add_b09_props(m):
    bl = cb.prim('cyl', 'zc-bucket1', (-1.25, 1.22, 0.15), (0.14, 0.14, 0.15), m['bucket'])
    b2 = cb.prim('cyl', 'zc-bucket2', (-1.10, 1.42, 0.15), (0.14, 0.14, 0.15), m['bucket'])
    for i, (x, y, z) in enumerate([(-0.95, 1.05, 0.06), (-0.85, 1.05, 0.06), (-0.95, 1.15, 0.06), (-0.85, 1.15, 0.06)]):
        cb.prim('cyl', f'zc-can{i}', (x, y, z), (0.035, 0.035, 0.06), m['can'])
    B('zc-phone', -0.84, -0.76, 0.58, 0.66, 0.0, 0.01, m['phone'])


# ------------------------------------------------------------------ mannequin (seated / any pose) built from joints
def two_bone(root, target, l1, l2, pole):
    """Mid joint of a 2-bone chain root->target with lengths l1,l2 bending toward `pole` (world vector)."""
    d = target - root
    dist = min(max(d.length, abs(l1 - l2) + 1e-4), l1 + l2 - 1e-4)
    dn = d.normalized()
    a = (l1 * l1 - l2 * l2 + dist * dist) / (2 * dist)
    h = math.sqrt(max(l1 * l1 - a * a, 0))
    p = (pole - dn * pole.dot(dn))
    p = p.normalized() if p.length > 1e-6 else Vector((0, 0, 1))
    return root + dn * a + p * h


def limb(name, p0, p1, r, mt, parent):
    p0, p1 = Vector(p0), Vector(p1)
    mid, d = (p0 + p1) / 2, p1 - p0
    o = cb.prim('cyl', name, mid, (r, r, d.length / 2), mt, parent=parent)
    o.rotation_mode = 'QUATERNION'
    o.rotation_quaternion = UP.rotation_difference(d.normalized())
    return o


def blob(name, c, radii, axes, mt, parent):
    """Ellipsoid centred c; radii (lateral, depth, along); axes = (lateral, depth, along) unit vectors."""
    o = cb.prim('sphere', name, c, radii, mt, parent=parent)
    lat, dep, alo = [Vector(a).normalized() for a in axes]
    o.rotation_mode = 'QUATERNION'
    o.rotation_quaternion = Matrix(((lat.x, dep.x, alo.x), (lat.y, dep.y, alo.y), (lat.z, dep.z, alo.z))).to_quaternion()
    return o


def mannequin(root_name, hips, face, lean_deg, head_pitch_deg, ankles, hands, m, hip_z_offset=0.0, pole=None):
    """zc-you placeholder in an arbitrary seated/standing pose (SCALE-ZC-R2: 1.72 m standing; limb lengths as zc_you).

    hips = hip-sphere centre (world); face = horizontal facing vector; lean_deg = torso lean backward from vertical;
    ankles/hands = ((xl,yl,zl),(xr,yr,zr)) world targets for left/right (left = +90 deg from facing).
    """
    r = cb.empty(root_name)
    f = Vector(face).normalized()
    lat = Vector((-f.y, f.x, 0))           # body-left
    H = Vector(hips)
    lean = math.radians(lean_deg)
    a = (UP * math.cos(lean) - f * math.sin(lean)).normalized()    # torso axis (hips -> neck)
    neck = H + a * 0.59
    P = lambda kind, n, c, s, mt, **k: cb.prim(kind, f'{root_name}_{n}', c, s, mt, parent=r, **k)
    blob(f'{root_name}_hips', H, (0.17, 0.11, 0.10), (lat, f, UP), m['shorts'], r)
    blob(f'{root_name}_torso', H + a * 0.31, (0.20, 0.12, 0.30), (lat, f, a), m['tee'], r)
    limb(f'{root_name}_neck', neck - a * 0.03, neck + a * 0.06, 0.048, m['skin'], r)
    hp = math.radians(head_pitch_deg)
    hd = (a * math.cos(hp) + f * math.sin(hp)).normalized()
    hc = neck + hd * 0.13
    blob(f'{root_name}_head', hc, (0.085, 0.10, 0.115), (lat, f, hd), m['skin'], r)
    blob(f'{root_name}_hair', hc + hd * 0.035 - f * 0.01, (0.09, 0.103, 0.095), (lat, f, hd), m['hair'], r)
    out = {'hips': tuple(H), 'neck': tuple(neck), 'head_top': tuple(hc + hd * 0.115)}
    for side, sgn in (('L', 1), ('R', -1)):
        i = 0 if side == 'L' else 1
        hj = H + lat * 0.095 * sgn
        an = Vector(ankles[i])
        knee = two_bone(hj, an, 0.44, 0.44, (pole or UP) + f * 0.25)
        limb(f'{root_name}_thigh{side}', hj, knee, 0.07, m['shorts'], r)
        limb(f'{root_name}_shin{side}', knee, an, 0.055, m['skin'], r)
        blob(f'{root_name}_foot{side}', an + f * 0.06 - UP * 0.04, (0.05, 0.11, 0.03), (lat, f, UP), m['skin'], r)
        sh = H + a * 0.52 + lat * 0.20 * sgn
        ha = Vector(hands[i])
        elbow = two_bone(sh, ha, 0.28, 0.27, -UP + lat * 0.5 * sgn - f * 0.2)
        limb(f'{root_name}_arm{side}', sh, elbow, 0.052, m['tee'], r)
        limb(f'{root_name}_fore{side}', elbow, ha, 0.042, m['skin'], r)
        P('sphere', f'hand{side}', ha, (0.04, 0.04, 0.04), m['skin'])
        out[f'knee{side}'], out[f'elbow{side}'] = tuple(knee), tuple(elbow)
    return r, out


def pose_floor(m):
    """B09: seated on the floor against the back wall, knees up, feet x ~ -0.75, facing +X, head pitched down 25 deg (sheet: 20; a little more reads slumped), hands on the knees."""
    H = Vector((-1.25, 0.85, 0.10))
    f = Vector((1, 0, 0))
    ank = ((-0.75, 0.85 + 0.12, 0.07), (-0.75, 0.85 - 0.12, 0.07))
    # forearms rest on the knees: hands on the knee tops (knee z ~0.45 + thigh radius 0.07)
    hands = ((-0.97, 0.85 + 0.10, 0.54), (-0.97, 0.85 - 0.10, 0.54))
    return mannequin('zc-you', H, f, 24.5, 25, ank, hands, m)


def pose_sofa(m):
    """B07-SH02: seated on the sofa seat (z 0.45), hips (-1.10, 7.30), feet on the floor, faces +X rotated 40 deg toward -Y, bread in hands."""
    f = Vector((math.cos(math.radians(40)), -math.sin(math.radians(40)), 0))
    lat = Vector((-f.y, f.x, 0))
    H = Vector((-1.10, 7.30, SEAT_Z + 0.09))
    base = H + f * 0.45
    ank = ((base.x + lat.x * 0.10, base.y + lat.y * 0.10, 0.07), (base.x - lat.x * 0.10, base.y - lat.y * 0.10, 0.07))
    chest = H + Vector((0, 0, 0.42)) + f * 0.28
    hands = (tuple(chest + lat * 0.07), tuple(chest - lat * 0.07))
    r, info = mannequin('zc-you', H, f, 18, 10, ank, hands, m)
    cb.prim('sphere', 'zc-bread', tuple(chest), (0.07, 0.04, 0.035), m['bread'], parent=r)
    return r, info


def pose_stand_b02(m):
    """B02-SH02 end state: he stands with his back to the cabinet at (0.0, 0.80), facing +Y."""
    r = cb.zc_you(m)
    r.location = (0.0, 0.80, 0)
    r.rotation_euler = (0, 0, math.radians(180))   # local front -Y -> +Y
    return r, {}


# ------------------------------------------------------------------ camera / light / render
def camera(cov, cam_y, nm='zc-cam_sp02'):
    cd = bpy.data.cameras.new(nm)
    cd.sensor_fit, cd.sensor_height = 'VERTICAL', 24.0
    cd.angle_y = vfov(cov)
    cd.clip_start, cd.clip_end = 0.05, 100
    cam = bpy.data.objects.new(nm, cd)
    cb.link(cam)
    cam.rotation_euler = (math.radians(90), 0, math.radians(90))     # level, looking -X
    cam.location = (CAM_X, cam_y, CAM_Z)
    bpy.context.scene.camera = cam
    solve_shift(cam, cov)
    return cam


def project(cam, p):
    from bpy_extras.object_utils import world_to_camera_view
    v = world_to_camera_view(bpy.context.scene, cam, Vector(p))
    return v.x * W, (1 - v.y) * H


def solve_shift(cam, cov):
    """Lens shift so the floor at the character plane (x = 0) lands on y = FLOOR_PX."""
    sc = bpy.context.scene
    cam.data.shift_y = 0.0
    bpy.context.view_layer.update()
    y0 = project(cam, (0, cam.location.y, 0))[1]
    cam.data.shift_y = -(y0 - FLOOR_PX) / H
    bpy.context.view_layer.update()
    return project(cam, (0, cam.location.y, 0))[1]


def lights(corridor):
    # warm interior fill from the open (cut) side, aimed -X, plus a soft top light; no light behind the capped corridor
    cb.area('sp02_fill', (6.0, 4.5, 1.5), (14.0, 5.0), cb.srgb('#ffe7c8'), 5200.0, rot=(0, math.radians(90), 0))
    if corridor == 'open':
        cb.area('sp02_corr_fill', (6.0, -0.9, 1.5), (6.0, 2.0), cb.srgb('#d9fff0'), 1800.0, rot=(0, math.radians(90), 0))
    pd = bpy.data.lightprobes.new('zc-unit_gi', 'VOLUME')
    pd.resolution_x, pd.resolution_y, pd.resolution_z = 8, 24, 6
    o = bpy.data.objects.new('zc-unit_gi', pd)
    cb.link(o)
    o.location, o.scale = (0.1, 4.7, 1.3), (1.9, 5.5, 1.5)


def settings(sc, samples=64):
    r = cb.render_settings(sc, f'eevee{samples}')
    sc.world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.004, 0.004, 0.004, 1)
    return r


def build_shot(shot, truck=False):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.preferences.edit.keyframe_new_interpolation_type = 'LINEAR'
    sc = bpy.context.scene
    info = settings(sc)
    m = sp02_materials()
    S = SHOTS[shot] if not truck else dict(cov=6.0, cam_y=0.0, corridor='capped', pose='none')
    build_unit(m, S['corridor'])
    add_cabinet(m, flush=True)     # barricade state y [0.18, 0.58] (B02-SH02 clip 84 onward, B09)
    pose = {}
    if S['pose'] == 'floor':
        add_b09_props(m)
        _, pose = pose_floor(m)
    elif S['pose'] == 'sofa':
        _, pose = pose_sofa(m)
    elif S['pose'] == 'stand_b02':
        pose_stand_b02(m)
        inf = cb.zc_infected(m)
        inf.location = (0.0, -0.40, 0.0)
        inf.rotation_euler = (0, 0, math.radians(180))
    lights(S['corridor'])
    cam = camera(S['cov'], S['cam_y'])
    bpy.context.scene.frame_set(1)
    t = time.perf_counter()
    bpy.ops.object.lightprobe_cache_bake(subset='ALL')
    info['gi_bake_seconds'] = round(time.perf_counter() - t, 2)
    return sc, cam, info, pose, m


# ------------------------------------------------------------------ measurement
def mesh_points(prefix):
    dg = bpy.context.evaluated_depsgraph_get()
    pts = []
    for o in bpy.data.objects:
        if o.type == 'MESH' and o.name.startswith(prefix):
            oe = o.evaluated_get(dg)
            mw = oe.matrix_world
            pts += [mw @ v.co for v in oe.data.vertices]
    return pts


def cap_rects(cam):
    """Projected pixel rectangles (x0, y0, x1, y1) of every cut-face cap (axis-aligned boxes on the cut plane)."""
    out = {}
    bpy.context.view_layer.update()
    for o in bpy.data.objects:
        if o.name.startswith('zc-cap_'):
            ys0, ys1 = o.location.y - o.dimensions.y / 2, o.location.y + o.dimensions.y / 2
            zs0, zs1 = o.location.z - o.dimensions.z / 2, o.location.z + o.dimensions.z / 2
            xf = o.location.x + o.dimensions.x / 2
            a = project(cam, (xf, ys0, zs1))
            b = project(cam, (xf, ys1, zs0))
            out[o.name] = [round(a[0], 2), round(a[1], 2), round(b[0], 2), round(b[1], 2)]
    return out


def lead_px(cam, prefix='zc-you'):
    pts = mesh_points(prefix)
    xy = [project(cam, p) for p in pts]
    ys = [p[1] for p in xy]
    xs = [p[0] for p in xy]
    return {'x': [round(min(xs)), round(max(xs))], 'y': [round(min(ys)), round(max(ys))], 'height_px': round(max(ys) - min(ys)),
            'lowest_world_z': round(min(p.z for p in pts), 4)}


def merge(key, data):
    mf = json.load(open(MANIFEST)) if os.path.exists(MANIFEST) else {}
    mf[key] = data
    json.dump(mf, open(MANIFEST, 'w'), indent=2, sort_keys=True)


def contact_report(shot, pts):
    """Interpenetration (depth, m) and gaps (m) of the mannequin against floor / back wall / sofa. Vertex-level on the evaluated meshes."""
    rep = {'floor_min_z': round(min(p.z for p in pts), 4)}
    rep['floor_penetration_m'] = round(max(0.0, -min(p.z for p in pts)), 4)
    rep['wall_penetration_m'] = round(max(0.0, BACK_X - min(p.x for p in pts)), 4)
    if SHOTS[shot]['pose'] == 'sofa':
        seat = [p for p in pts if -1.40 <= p.x <= -0.85 and 6.80 <= p.y <= 7.80]
        # true penetration depth = distance from an interior vertex to the nearest face of the seat box (-1.40..-0.85, 6.80..7.80, 0..0.45)
        inside = [p for p in seat if 0.0 < p.z < SEAT_Z]
        dist = lambda p: min(SEAT_Z - p.z, -0.85 - p.x, p.y - 6.80, 7.80 - p.y)
        rep['seat_penetration_m'] = round(max([dist(p) for p in inside] or [0.0]), 4)
        rep['seat_gap_m'] = round(min([p.z - SEAT_Z for p in seat if p.z >= SEAT_Z] or [9.0]), 4)
        back = [p for p in pts if -1.60 <= p.x < -1.40 and 6.80 <= p.y <= 7.80 and p.z < 0.85]
        rep['sofa_back_penetration_m'] = round(max([-1.40 - p.x for p in back] or [0.0]), 4)
        rep['sofa_back_min_gap_m'] = round(min([p.x + 1.40 for p in pts if p.x >= -1.40 and 0.55 < p.z < 0.85] or [9.0]), 4)
        rep['feet_gap_to_floor_m'] = round(min(p.z for p in pts if p.z < 0.15), 4)
    if SHOTS[shot]['pose'] == 'floor':
        rep['wall_gap_m'] = round(min(p.x for p in pts) - BACK_X, 4)
        low = [p for p in pts if p.x < -0.8 and p.z < 0.25]
        rep['hips_lowest_z'] = round(min(p.z for p in pts if p.x < -1.0 and p.z < 0.4), 4)
        rep['feet_lowest_z'] = round(min(p.z for p in pts if p.x > -0.85 and p.z < 0.2), 4)
        cab = [p for p in pts if -0.4 <= p.x <= 0.4 and DOOR_WALL <= p.y <= DOOR_WALL + 0.4]
        rep['cabinet_penetration_pts'] = len(cab)
    return rep


# ------------------------------------------------------------------ commands
def cmd_geometry():
    out = {'door_wall_m': DOOR_WALL}
    # (a3) cabinet vs door wall, from the built geometry
    bpy.ops.wm.read_factory_settings(use_empty=True)
    m = sp02_materials()
    build_unit(m, 'capped')
    cab = add_cabinet(m, flush=True)
    bpy.context.view_layer.update()
    dw = bpy.data.objects['zc-unit_doorwall']
    cab_y0 = cab.location.y - cab.dimensions.y / 2
    dw_y1 = dw.location.y + dw.dimensions.y / 2
    out['a3'] = {'door_wall_y_range': [round(dw.location.y - dw.dimensions.y / 2, 4), round(dw_y1, 4)],
                 'cabinet_y_range': [round(cab_y0, 4), round(cab.location.y + cab.dimensions.y / 2, 4)],
                 'gap_m': round(cab_y0 - dw_y1, 6), 'overlap_m': round(max(0.0, dw_y1 - cab_y0), 6)}
    # zc-corridor door wall uses the same constant
    cbm = cb.DOOR_WALL
    out['corridor_constant'] = cbm
    # caps closed: cut faces tile each stack member without gaps/overlaps (interval check on y/z)
    caps = [(o.name, o.location.x, o.location.y - o.dimensions.y / 2, o.location.y + o.dimensions.y / 2, o.location.z - o.dimensions.z / 2,
             o.location.z + o.dimensions.z / 2) for o in bpy.data.objects if o.name.startswith('zc-cap_')]
    overlaps = []
    for i in range(len(caps)):
        for j in range(i + 1, len(caps)):
            a, b = caps[i], caps[j]
            if abs(a[1] - b[1]) > 1e-3:      # different plane (the black corridor cap sits 4 mm in front of the slab caps by design)
                continue
            oy = min(a[3], b[3]) - max(a[2], b[2])
            oz = min(a[5], b[5]) - max(a[4], b[4])
            if oy > 1e-5 and oz > 1e-5:
                overlaps.append([a[0], b[0], round(oy, 4), round(oz, 4)])
    out['cap_overlaps'] = overlaps
    out['cap_count'] = len(caps)
    return out


def cmd_still(shot, outdir=None):
    sc, cam, info, pose, m = build_shot(shot)
    S = SHOTS[shot]
    outdir = outdir or os.path.join(ROOT, 'out', 'blender', 'zc-unit', 'sp02', shot)
    os.makedirs(outdir, exist_ok=True)
    sc.frame_set(1)
    res = {'shot': shot, 'camera_y': S['cam_y'], 'coverage_m': S['cov'], 'vfov_deg': round(math.degrees(vfov(S['cov'])), 2),
           'shift_y': round(cam.data.shift_y, 5), 'floor_line_px': round(project(cam, (0, S['cam_y'], 0))[1], 1),
           'settings': info}
    if S['pose'] != 'none':
        res['lead_px'] = lead_px(cam)
        if S['pose'] in ('floor', 'sofa'):
            res['contacts'] = contact_report(shot, mesh_points('zc-you'))
            res['pose_joints'] = pose
    path = os.path.join(outdir, 'still.png')
    sc.render.filepath = path
    t = time.perf_counter()
    bpy.ops.render.render(write_still=True)
    res['render_seconds'] = round(time.perf_counter() - t, 2)
    res['cap_rects_px'] = cap_rects(cam)
    res['file'] = os.path.relpath(path, ROOT)
    merge(f'still/{shot}', res)
    print('[zc-unit] STILL ' + json.dumps(res), flush=True)


def cmd_truck(rng=None, outdir=None):
    sc, cam, info, pose, m = build_shot('B09SH01', truck=True)
    # standing lead walks along +Y (x 0.45) while the camera trucks and drifts: lead starts left of centre, ends right
    lead, _ = pose_stand_b02(m)
    lead.rotation_euler = (0, 0, math.radians(180))
    N = 60
    for i in range(N):
        t = i / (N - 1)
        ly = 1.2 + 6.0 * t
        lead.location = (0.45, ly, 0)
        lead.keyframe_insert('location', frame=i + 1)
        cam.location = (CAM_X, ly + (-0.9 + 1.8 * t), CAM_Z)
        cam.keyframe_insert('location', frame=i + 1)
    sc.frame_start, sc.frame_end = 1, N
    outdir = outdir or os.path.join(ROOT, 'out', 'blender', 'zc-unit', 'sp02', 'truck')
    os.makedirs(outdir, exist_ok=True)
    times = {}
    a, b = (rng or '1-60').split('-')
    meas, caprects = {}, {}
    for f in range(int(a), int(b) + 1):
        sc.frame_set(f)
        meas[f - 1] = lead_px(cam)
        meas[f - 1]['floor_line_px'] = round(project(cam, (0, cam.location.y, 0))[1], 1)
        caprects[f - 1] = cap_rects(cam)
        p = os.path.join(outdir, f'frame_{f - 1:04d}.png')
        if os.path.exists(p):
            continue
        sc.render.filepath = p
        t = time.perf_counter()
        bpy.ops.render.render(write_still=True)
        times[f - 1] = round(time.perf_counter() - t, 2)
        print(f'[zc-unit] truck F{f - 1} {times[f - 1]}s', flush=True)
    json.dump(caprects, open(os.path.join(outdir, 'caprects.json'), 'w'))
    v = sorted(times.values()) or [0]
    hs = [x['height_px'] for x in meas.values()]
    merge(f'truck/{a}-{b}', {'coverage_m': 6.0, 'lead_height_px_min_mean_max': [min(hs), round(sum(hs) / len(hs), 1), max(hs)],
                             'lead_px_start_mid_end': [meas[k] for k in (int(a) - 1, (int(a) + int(b)) // 2 - 1, int(b) - 1)], 'frames_rendered': len(times), 'mean_seconds': round(sum(v) / len(v), 2),
                             'max_seconds': v[-1], 'settings': info, 'outdir': os.path.relpath(outdir, ROOT)})


def main():
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    cmd = a[0] if a else 'geometry'
    if cmd == 'geometry':
        r = cmd_geometry()
        merge('geometry', r)
        print('[zc-unit] GEOMETRY ' + json.dumps(r), flush=True)
    elif cmd == 'still':
        cmd_still(a[1], a[2] if len(a) > 2 else None)
    elif cmd == 'truck':
        cmd_truck(a[1] if len(a) > 1 else None, a[2] if len(a) > 2 else None)


if __name__ == '__main__':
    main()
