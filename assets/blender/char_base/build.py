"""char_base build: preset -> rigged character (armature + skinned meshes) in the current scene.

build(preset, name, variant=None, collection=None) -> armature object `name`; meshes `<name>_*` carry an Armature modifier
(no bone parenting, no object transforms). Measured anchors are stored as cb_* custom properties for poses.
"""
import bpy
from mathutils import Vector

import body
import heads
import looks
import outfits
import presets


def _arm_clearance(bod, ao, J):
    """(torso half-width between hip and shoulder, upper-arm surface radius) of the rest body: Actor spreads relaxed arms by them."""
    gi = {g.index: g.name for g in bod.vertex_groups if g.name in ao.data.bones}
    hx, ar = 0.0, []
    b = ao.data.bones['upper_arm.L']
    h, t = b.head_local, b.tail_local
    for v in bod.data.vertices:
        gs = [g for g in v.groups if g.group in gi]
        if not gs:
            continue
        d = gi[max(gs, key=lambda g: g.weight).group]
        if d in ('pelvis', 'spine', 'chest') and J['HIP'].z <= v.co.z <= J['SH'].z:
            hx = max(hx, abs(v.co.x))
        elif d == 'upper_arm.L':
            k = max(0.0, min(1.0, (v.co - h).dot(t - h) / (t - h).length_squared))
            ar.append((v.co - (h + (t - h) * k)).length)
    ar.sort()
    return hx, ar[len(ar) // 2]


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
    me = body.skin_mesh(*body.body_graph(J, bp), name + '_body')
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
    ao['cb_torso_hx'], ao['cb_arm_r'] = _arm_clearance(bod, ao, J)
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
