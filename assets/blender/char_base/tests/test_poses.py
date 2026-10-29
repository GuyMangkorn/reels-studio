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
    want = tracks.FLOOR_HIP.z * ao['cb_hip_z'] / 0.93
    got = _world(ao, 'pelvis', 'head').z
    assert abs(got - want) <= 0.02, (got, want)
    assert abs(A.ANKLE_Z - ao['cb_ankle_z']) < 1e-6
    zfoot = min(_world(ao, n, e).z for n in ('foot.L', 'foot.R', 'toe.L', 'toe.R') for e in ('head', 'tail'))
    assert zfoot >= -0.0005, zfoot
