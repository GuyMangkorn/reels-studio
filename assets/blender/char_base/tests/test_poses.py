"""poses.Actor on measured anchors: zc-you seated_floor equals the pre-move fixture; a child body seats at its own hip height."""
import json
import os
import sys

import bpy
from mathutils import Vector
from test_cb import HERE

sys.path.insert(0, os.path.normpath(os.path.join(HERE, '..', 'zc-you')))     # tracks.seated_floor lives with the zc-you shot tracks
sys.path.insert(0, os.path.normpath(os.path.join(HERE, '..')))
from char_base import poses

import build
import presets
import rig
import tracks

FIX = os.path.join(HERE, 'tests', 'fixtures', 'zc_seated_floor.json')


def _world(ao, name, end):
    b = ao.pose.bones[name]
    return ao.matrix_world @ (b.head if end == 'head' else b.tail)


def _seat(ao):
    A = poses.Actor(ao)
    A.keying = False
    tracks.seated_floor(A, 0)
    bpy.context.view_layer.update()
    return A


def test_actor_zc_unchanged():
    ao = rig.build('day1')
    _seat(ao)
    fx = json.load(open(FIX))
    worst = 0.0
    for n, ends in fx.items():
        for end, ref in ends.items():
            worst = max(worst, (_world(ao, n, end) - Vector(ref)).length)
    assert worst <= 0.002, worst


def test_actor_child_seated():
    P = presets.get('zc_you')
    P['body'].update(height=1.28, heads_tall=5.5)
    presets.PRESETS['_child'] = P
    try:
        ao = build.build('_child', 'child')
    finally:
        del presets.PRESETS['_child']
    A = _seat(ao)
    k = ao['cb_hip_z'] / 0.93
    want = tracks.FLOOR_HIP.z * k
    pel = _world(ao, 'pelvis', 'head')
    assert abs(pel.z - want) <= 0.005, (pel.z, want)          # old unscaled value 0.049 is 0.0145 away
    assert abs(A.ANKLE_Z - ao['cb_ankle_z']) < 1e-6
    leg = sum((ao.pose.bones[n].tail - ao.pose.bones[n].head).length for n in ('thigh.L', 'shin.L'))
    for s in 'LR':
        ft = _world(ao, f'foot.{s}', 'head')
        assert abs(ft.z - ao['cb_ankle_z']) <= 0.002, ft.z
        assert abs(ft.x - (tracks.FLOOR_HIP.x + 0.5 * k)) <= 0.01, ft.x      # feet reach scales with leg length (zc: 0.5 m)
        assert (ft - pel).length <= leg + 0.005, ((ft - pel).length, leg)    # within leg reach (zc-sized 0.5 m reach is out of range)
    zfoot = min(_world(ao, n, e).z for n in ('foot.L', 'foot.R', 'toe.L', 'toe.R') for e in ('head', 'tail'))
    assert zfoot >= -0.0005, zfoot
