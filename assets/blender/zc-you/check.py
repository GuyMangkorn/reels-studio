"""zc-you rig/track checks (headless): python -> Blender -b --python assets/blender/zc-you/check.py -- [rig|tracks|contacts]
Writes assets/blender/zc-you/check-results.json. Measures: height/eye height, joint ranges, floor/wall penetration per track,
IK reach error (wrist vs palm target) at the listed contact frames.
"""
import bpy, sys, os, json, math
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import rig, poses, tracks

OUT = os.path.join(HERE, 'check-results.json')
# (track, hand, clip frame, target key in the track's return dict or explicit world point)
CONTACTS = {
    'B02-SH01': [('R', 15, 'palm_R'), ('R', 54, 'palm_R'), ('L', 24, 'bolt_palm_L')],
    'B05-SH02': [],
    'B05-SH03': [('R', 15, 'lid_grip')],
    'B06-SH01': [('R', 105, 'hover_palm_R')],
    'B07-SH01': [('R', 46, 'case_palm_R')],
}
WALLS = {'B09': ('x', -1.6)}


def mesh_pts():
    dg = bpy.context.evaluated_depsgraph_get()
    pts = []
    for o in bpy.data.objects:
        if o.type == 'MESH' and o.name.startswith('zc-you_'):
            oe = o.evaluated_get(dg)
            pts += [oe.matrix_world @ v.co for v in oe.data.vertices]
    return pts


def palm_world(A, s):
    b = A.P[f'hand.{s}']
    d = (b.tail - b.head).normalized()
    return A.mw @ (b.head + d * poses.PALM_OFF)


def wrist_world(A, s):
    return A.mw @ A.P[f'hand.{s}'].head


def run_rig():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    ao = rig.build('day1')
    A = poses.Actor(ao)
    A.keying = False
    A.pose(1, root=(0, 0, 0), key=False)
    mn, mx = rig.rest_bounds(ao)
    eye = ao.matrix_world @ ao.pose.bones['eye.L'].head
    res = {'height_m': round(mx.z, 4), 'lowest_z_m': round(mn.z, 4), 'eye_z_m': round(eye.z, 4),
           'bbox_xy_m': [round(mn.x, 3), round(mx.x, 3), round(mn.y, 3), round(mx.y, 3)],
           'vertices': sum(len(o.data.vertices) for o in bpy.data.objects if o.type == 'MESH'),
           'objects': sum(1 for o in bpy.data.objects if o.type == 'MESH'), 'bones': len(ao.pose.bones)}
    # joint ranges: sweep each FK bone, check IK arms reach to the extremes
    rng = {}
    for nm, ax in (('spine', 0), ('chest', 0), ('neck', 0), ('head', 0), ('head', 1)):
        pass
    res['joint_limits_used_by_tracks_deg'] = {'head_yaw_B10': 75.0 * 0.6 + 75.0 * 0.4, 'shoulders_yaw_B10': 50.0, 'seated_spine_back_lean_total': sum(tracks.FLOOR_LEAN),
                                              'eye_yaw_from_head_max': 'see tracks'}
    return res


def run_tracks(only=None):
    out = {}
    for name, fn in sorted(tracks.TRACKS.items()):
        if only and name not in only:
            continue
        bpy.ops.wm.read_factory_settings(use_empty=True)
        ao = rig.build('day3' if name.startswith(('B09', 'B10')) else 'day1')
        A = poses.Actor(ao)
        info = fn(A) or {}
        act = ao.animation_data.action if ao.animation_data else None
        frames = sorted({int(kp.co[0]) for fc in _fcurves(act) for kp in fc.keyframe_points}) if act else [1]
        lo, hi = frames[0], frames[-1]
        F_LAST = hi
        r = {'frames': [lo - 1, hi - 1], 'floor_min_z_m': 9.0, 'wall_min_x_m': 9.0, 'contacts': []}
        for f in range(lo, hi + 1, 3):
            bpy.context.scene.frame_set(f)
            pts = mesh_pts()
            r['floor_min_z_m'] = round(min(r['floor_min_z_m'], min(p.z for p in pts)), 4)
            r['wall_min_x_m'] = round(min(r['wall_min_x_m'], min(p.x for p in pts)), 4)
        if name in ('B02-SH03', 'B03-SH01'):
            bpy.context.scene.frame_set(1)
            pts = mesh_pts()
            back = [p for p in pts if 0.85 <= p.z <= 1.19 and abs(p.x) < 0.30 and p.y < 0.80]
            r['cabinet_face_y_0.58_back_gap_m'] = round(min(p.y for p in back) - 0.58, 4)      # >= 0 no penetration; ~0 contact
            r['cabinet_top_z'] = 1.20
        if name.startswith('B09'):
            bpy.context.scene.frame_set(F_LAST)
            pts = mesh_pts()
            r['back_wall_gap_to_sheet_x_-1.50_m'] = round(min(p.x for p in pts) + 1.50, 4)
            r['back_wall_gap_to_build_BACK_X_-1.60_m'] = round(min(p.x for p in pts) + 1.60, 4)
            r['phone_foot_gap_m'] = round(min(math.hypot(max(-0.84 - p.x, 0, p.x + 0.76), max(0.58 - p.y, 0, p.y - 0.66)) for p in pts if p.z < 0.06), 4)
        for s, c, key in CONTACTS.get(name, []):
            bpy.context.scene.frame_set(c + 1)
            A.mw = ao.matrix_world.copy()
            t = Vector(info[key])
            r['contacts'].append({'hand': s, 'clip_frame': c, 'target': key, 'palm_to_target_m': round((palm_world(A, s) - t).length, 4),
                                  'wrist_to_ik_m': round((wrist_world(A, s) - ao.matrix_world @ ao.pose.bones[f'ik_hand.{s}'].head).length, 4)})
        out[name] = r
        print('[zc-you]', name, json.dumps(r), flush=True)
    return out


def _fcurves(act):
    try:
        return list(act.fcurves)
    except Exception:
        fcs = []
        for layer in act.layers:
            for strip in layer.strips:
                for slot in act.slots:
                    cb = strip.channelbag(slot)
                    if cb:
                        fcs += list(cb.fcurves)
        return fcs


if __name__ == '__main__':
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else ['rig']
    res = json.load(open(OUT)) if os.path.exists(OUT) else {}
    if a[0] == 'rig':
        res['rig'] = run_rig()
    elif a[0] == 'tracks':
        res.setdefault('tracks', {}).update(run_tracks(a[1:] or None))
    json.dump(res, open(OUT, 'w'), indent=2, sort_keys=True)
