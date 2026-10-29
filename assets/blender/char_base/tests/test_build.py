"""build(): zc-you regression, custom props, extreme parameters, two characters, determinism."""
import bmesh
import bpy
from test_cb import reset_scene

import build
import presets

BONES = ('root', 'pelvis', 'spine', 'chest', 'neck', 'head', 'jaw', 'look_target') + tuple(
    f'{b}.{s}' for s in 'LR' for b in ('eye', 'lid', 'brow', 'clavicle', 'upper_arm', 'forearm', 'hand', 'fingers', 'fingers_tip', 'thumb',
                                       'thigh', 'shin', 'foot', 'toe', 'ik_hand', 'ik_foot', 'pole_elbow', 'pole_knee'))
PROPS = ('cb_height_m', 'cb_eye_z', 'cb_shoulder_z', 'cb_hip_z', 'cb_ankle_z', 'cb_palm_off', 'cb_head_c')


def _non_manifold(ob):
    bm = bmesh.new()
    bm.from_object(ob, bpy.context.evaluated_depsgraph_get())
    n = sum(1 for e in bm.edges if not e.is_manifold)
    bm.free()
    return n


def _custom(name, **body):
    P = presets.get('zc_you')
    P['body'].update(body)
    presets.PRESETS['_t'] = P
    try:
        return build.build('_t', name)
    finally:
        del presets.PRESETS['_t']


def test_zc_regression():
    ao = build.build('zc_you', 'zc-you', 'day1')
    m = build.measure(ao)
    assert abs(m['height'] - 1.713) < 0.002, m
    assert abs(m['eye_z'] - 1.607) < 0.002, m
    assert abs(m['zmin']) < 0.0005, m
    assert len(BONES) == 44 and sorted(b.name for b in ao.data.bones) == sorted(BONES)


def test_custom_props():
    ao = build.build('zc_you', 'zc-you', 'day1')
    for k in PROPS:
        assert k in ao, k
    assert abs(ao['cb_eye_z'] - build.measure(ao)['eye_z']) < 0.002


def test_extremes_build():
    for i, kw in enumerate(({'heads_tall': 3.5, 'height': 1.95}, {'sex': 1.0, 'mass': 1.0, 'stylize': 1.0})):
        reset_scene()
        ao = _custom(f'x{i}', **kw)
        m = build.measure(ao)
        assert abs(m['zmin']) < 0.0005, (kw, m)
        nm = _non_manifold(bpy.data.objects[f'x{i}_body'])
        assert nm == 0, (kw, nm)


def test_two_characters_one_scene():
    build.build('zc_you', 'a')
    build.build('zc_you', 'b')
    for o in bpy.data.objects:
        assert o.name in ('a', 'b') or o.name.startswith(('a_', 'b_')), o.name
    face = lambda n: {m.name for o in bpy.data.objects if o.name.startswith(n + '_') and o.type == 'MESH' for m in o.data.materials}
    assert not (face('a') & face('b')), face('a') & face('b')


def test_rebuild_deterministic():
    def snap():
        ao = build.build('zc_you', 'zc-you', 'day1')
        return sum(len(o.data.vertices) for o in bpy.data.objects if o.type == 'MESH'), build.measure(ao)
    a = snap()
    reset_scene()
    b = snap()
    assert a == b, (a, b)
