"""char_base build: preset -> rigged character (armature + skinned meshes) in the current scene.

build(preset, name, variant=None, collection=None) -> armature object `name`; meshes `<name>_*` carry an Armature modifier
(no bone parenting, no object transforms). Measured anchors are stored as cb_* custom properties for poses.
"""
import importlib.util
import os
import sys

import bpy
from mathutils import Vector

import body
import heads
import looks
import outfits
import presets


def _poses():
    """char_base's poses module, loaded by path: a caller's own 'poses' (zc-you's) may shadow the name on sys.path (R15)."""
    m = sys.modules.get('char_base.poses')
    if m is None:
        spec = importlib.util.spec_from_file_location('char_base.poses', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'poses.py'))
        m = importlib.util.module_from_spec(spec)
        sys.modules['char_base.poses'] = m
        spec.loader.exec_module(m)
    return m


def _torso_hx(J, bp):
    """Widest trunk half-width between the waist and chest nodes: exact sections of body.armless_mesh (no weights, so it grows smoothly
    with mass; the old cut by weight dominance jumped between neighbouring vertices)."""
    me = body.armless_mesh(J, bp, '_cb_armless')
    P = [v.co for v in me.vertices]
    segs = [(P[e.vertices[0]], P[e.vertices[1]]) for e in me.edges]
    bpy.data.meshes.remove(me)
    z0, z1 = J['waist_n'].z, J['chest_n'].z
    return max(abs(a.x + (b.x - a.x) * (z - a.z) / (b.z - a.z)) for z in (z0 + (z1 - z0) * i / 40 for i in range(41))
               for a, b in segs if (a.z - z) * (b.z - z) < 0)


def _arm_r(bod, ao):
    """Median upper-arm surface radius of the rest body (vertices dominated by upper_arm.L)."""
    gi = {g.index: g.name for g in bod.vertex_groups if g.name in ao.data.bones}
    ar = []
    b = ao.data.bones['upper_arm.L']
    h, t = b.head_local, b.tail_local
    for v in bod.data.vertices:
        gs = [g for g in v.groups if g.group in gi]
        if gs and gi[max(gs, key=lambda g: g.weight).group] == 'upper_arm.L':
            k = max(0.0, min(1.0, (v.co - h).dot(t - h) / (t - h).length_squared))
            ar.append((v.co - (h + (t - h) * k)).length)
    ar.sort()
    return ar[len(ar) // 2]


RELAX_FIT = (0.002, 0.30, 9)      # relaxed-arm spread calibration: clearance kept (m), search ceiling (m), bisection steps


def _relax_spread(ao, bod):
    """Least extra palm spread (m) at which the relaxed arms (poses.Actor default) clear the rest trunk by RELAX_FIT[0] below the armpit
    zone: arm vertices (upper_arm + forearm weight >= 0.8) against body.TorsoGauge. 0 when the hanging arm already clears (R19, R24)."""
    poses = _poses()
    gi = {g.index: g.name for g in bod.vertex_groups}
    arm = [v.index for v in bod.data.vertices
           if sum(g.weight for g in v.groups if gi[g.group].startswith(('upper_arm', 'forearm'))) >= 0.8]
    low = ao['cb_shoulder_z'] - poses.ARMPIT_ZONE * ao['cb_shoulder_z'] / poses.REF_SH_Z
    gauge = body.TorsoGauge(bod, 0.01)
    A = poses.Actor(ao)
    A.keying = False

    def worst(ex):
        ao['cb_relax_spread'] = ex
        A.pose(1, root=(0, 0, 0), key=False)
        me = bod.evaluated_get(bpy.context.evaluated_depsgraph_get()).data
        return max((gauge.depth(me.vertices[i].co) for i in arm if me.vertices[i].co.z < low), default=-1.0)
    clear, top, n = RELAX_FIT
    if worst(0.0) <= -clear:
        ex = 0.0
    else:
        lo, hi = 0.0, top
        for _ in range(n):
            mid = (lo + hi) / 2
            lo, hi = (lo, mid) if worst(mid) <= -clear else (mid, hi)
        ex = hi
    ao['cb_relax_spread'] = ex
    for pb in ao.pose.bones:
        pb.location, pb.rotation_quaternion, pb.rotation_euler, pb.scale = (0, 0, 0), (1, 0, 0, 0), (0, 0, 0), (1, 1, 1)
    bpy.context.view_layer.update()
    return ex


def build(preset, name, variant=None, collection=None):
    """Create character `name` from `preset` (+ variant); returns the armature object."""
    P = presets.resolve(preset, variant)
    hm = heads.get(P['head'][0])
    hp = hm.params(**P['head'][1])
    bp = body.body_params(P['age'], **P['body'])
    scale = body.head_scale(bp, hm.head_metrics(hp, 1.0)['height'])
    J = body.joints(bp, hm.head_metrics(hp, scale))
    F = body.factors(bp)
    prefix = name.replace('-', '_') + P.get('mat_suffix', '')
    M = looks.materials(P['look'], prefix, P['palette'], hm, hp, J['head_c'])
    outfits.dress_materials(P['outfit'], M, name, J, F)
    looks.finish(P['look'], M)
    table = body.bone_table(J, hm, hp, scale)
    ao = body.armature(name, table)
    me = body.body_mesh(J, bp, name + '_body')
    zmin = min(v.co.z for v in me.vertices)       # skin radius / subsurf shrink: the sole is put on the floor
    for v in me.vertices:
        v.co.z -= zmin
    bod = bpy.data.objects.new(name + '_body', me)
    bpy.context.scene.collection.objects.link(bod)
    outfits.apply(bod, ao, P['outfit'], M, J, F, table)
    hm.build_head(ao, J['head_c'], hp, name, scale, looks.head_mats(M))
    body.add_ik(ao)
    body.calibrate_poles(ao)
    objs = [o for o in bpy.data.objects if o.name.startswith(name + '_') and o.type == 'MESH']
    for o in objs:
        o.visible_shadow = True
    m = measure(ao)
    ao['cb_preset'], ao['cb_variant'] = preset, variant or ''
    ao['cb_height_m'], ao['cb_eye_z'] = m['height'], m['eye_z']
    ao['cb_shoulder_z'], ao['cb_hip_z'], ao['cb_ankle_z'] = J['SH'].z, J['pelvis'].z, J['ANK'].z
    ao['cb_palm_off'] = (J['PALM'] - J['WR']).length
    ao['cb_head_c'] = tuple(J['head_c'])
    ao['cb_torso_hx'] = _torso_hx(J, bp)
    ao['cb_arm_r'] = _arm_r(bod, ao)
    ao['cb_relax_spread'] = _relax_spread(ao, bod)
    if collection is not None:
        for o in [ao] + objs:
            for c in list(o.users_collection):
                c.objects.unlink(o)
            collection.objects.link(o)
    return ao


def rest_bounds(ao):
    """World-space (min, max) over the evaluated meshes parented to `ao`."""
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    mn = Vector((1e9,) * 3)
    mx = Vector((-1e9,) * 3)
    for o in bpy.data.objects:
        if o.type == 'MESH' and o.parent == ao:
            oe = o.evaluated_get(dg)
            for v in oe.data.vertices:
                p = oe.matrix_world @ v.co
                mn = Vector((min(mn.x, p.x), min(mn.y, p.y), min(mn.z, p.z)))
                mx = Vector((max(mx.x, p.x), max(mx.y, p.y), max(mx.z, p.z)))
    return mn, mx


def measure(ao):
    """Current-pose height (top), eye height (eye.L head), lowest point and mesh object count."""
    mn, mx = rest_bounds(ao)
    eye = ao.matrix_world @ ao.pose.bones['eye.L'].head
    return dict(height=mx.z, eye_z=eye.z, zmin=mn.z, objects=sum(1 for o in bpy.data.objects if o.type == 'MESH' and o.parent == ao))
