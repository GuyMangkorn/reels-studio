"""Head registry + face contract of char_head."""
import json
import os
import subprocess

import bpy
from test_cb import reset_scene, approx

import heads
import char_head

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", ".."))
BLENDER = "/Applications/Blender.app/Contents/MacOS/Blender"


def _build(**kw):
    p = char_head.params(**kw)
    ao = char_head.add_standalone_armature(p)
    parts = char_head.build_head(ao, (0, 0, 0), p, 'ch', 1.0)
    return p, ao, parts


def test_char_head_conforms():
    assert heads.check(heads.get('char_head')) == []


def test_head_metrics_defaults():
    p, ao, parts = _build()
    m = char_head.head_metrics(p, 1.0)
    assert abs(m['height'] - 0.224) < 0.005 + 0.0056, m['height']      # 0.224 + hair allowance
    zs = [v.co.z for o in parts if o.name in ('ch_head', 'ch_hair') for v in o.data.vertices]
    assert abs(m['height'] - (max(zs) - min(zs))) < 0.003, (m['height'], max(zs) - min(zs))
    assert approx(m['eye_dz'], p['eye_z']) and approx(m['eye_dy'], p['eye_y'])
    assert m['neck'].z < -0.1 and abs(m['neck'].x) < 1e-6


def test_head_metrics_scaled_nondefault():
    s = 0.8
    p = char_head.params(head=(0.105, 0.112, 0.125), hair_volume=1.4)
    ao = char_head.add_standalone_armature(p, origin=(0, 0, 1.0), scale=s)
    parts = char_head.build_head(ao, (0, 0, 1.0), p, 'ch', s)
    m = char_head.head_metrics(p, s)
    zs = [v.co.z for o in parts if o.name in ('ch_head', 'ch_hair') for v in o.data.vertices]
    assert abs(m['height'] - (max(zs) - min(zs))) < 0.003, (m['height'], max(zs) - min(zs))
    assert approx(m['eye_dz'], p['eye_z'] * s) and approx(m['neck'].z, -0.125 * s * (1 - (0.012 / 0.112) ** 2) ** 0.5)


def test_head_metrics_rejects_sculpted_skull():
    try:
        char_head.head_metrics(char_head.params(oval=False), 1.0)
    except ValueError:
        return
    raise AssertionError('no ValueError')


def test_look_rejects_clay():
    try:
        char_head.make_materials(char_head.params(), 'ch', (0, 0, 0), look='clay')
    except ValueError:
        return
    raise AssertionError('no ValueError')


def test_hair_bob_ponytail_build():
    for style in ('bob', 'ponytail'):
        reset_scene()
        p, ao, parts = _build(hair_style=style)
        hair = bpy.data.objects.get('ch_hair')
        assert hair is not None, style
        if style == 'ponytail':
            tail = bpy.data.objects['ch_ponytail']
            low = min(v.co.z for v in tail.data.vertices)
            assert low < -0.08, low
            assert all(vg.name == 'head' for vg in tail.vertex_groups)
        else:
            low = min(v.co.z for v in hair.data.vertices)
            assert low < -0.06, low


def test_unknown_preset_falls_back():
    p, ao, parts = _build()
    pb = ao.pose.bones
    char_head.apply_face(pb, 'neutral')
    ref = ([tuple(pb[f'lid.{s}'].rotation_euler) for s in 'LR'], [tuple(pb[f'brow.{s}'].location) + tuple(pb[f'brow.{s}'].rotation_euler) for s in 'LR'])
    char_head.apply_face(pb, 'startle')
    char_head.apply_face(pb, 'happy')
    got = ([tuple(pb[f'lid.{s}'].rotation_euler) for s in 'LR'], [tuple(pb[f'brow.{s}'].location) + tuple(pb[f'brow.{s}'].rotation_euler) for s in 'LR'])
    assert got == ref


def test_defaults_unchanged():
    res = os.path.join(ROOT, "assets/blender/zc-you/check-results.json")
    want = json.loads(subprocess.check_output(["git", "show", "HEAD:assets/blender/zc-you/check-results.json"], cwd=ROOT))
    saved = open(res, 'rb').read()
    try:
        subprocess.run([BLENDER, "-b", "--python-exit-code", "1", "--python", os.path.join(ROOT, "assets/blender/zc-you/check.py"), "--", "rig"],
                       cwd=ROOT, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        got = json.load(open(res))
    finally:
        open(res, 'wb').write(saved)
    assert got['rig'] == want['rig']
