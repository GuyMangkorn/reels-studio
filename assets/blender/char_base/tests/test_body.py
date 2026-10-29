"""Parametric body: parameter validation, zc-you reference joints, age/sex/stoop/stylize landmarks."""
from mathutils import Vector

import body
import char_head
import presets


def _J(**kw):
    age = kw.pop('age', 'adult')
    bp = body.body_params(age, **kw)
    hp = char_head.params()
    s = body.head_scale(bp, char_head.head_metrics(hp, 1.0)['height'])
    return bp, body.joints(bp, char_head.head_metrics(hp, s))


def test_ranges_raise():
    for k, (lo, hi) in body.PARAM_RANGES.items():
        try:
            body.body_params('adult', **{k: hi + 0.01})
        except ValueError as e:
            assert k in str(e), (k, str(e))
            continue
        raise AssertionError('no ValueError for ' + k)


def test_zc_joints_match_rig():
    P = presets.get('zc_you')
    hp = char_head.params(**P['head'][1])
    bp = body.body_params(P['age'], **P['body'])
    s = body.head_scale(bp, char_head.head_metrics(hp, 1.0)['height'])
    assert abs(s - 1.0) < 1e-5, s
    J = body.joints(bp, char_head.head_metrics(hp, s))
    want = {'SH': (0.195, 0, 1.385), 'HIP': (0.085, 0, 0.925), 'KNEE': (0.085, -0.005, 0.48), 'ANK': (0.085, 0, 0.085),
            'TOE': (0.085, -0.178, 0.026), 'head_c': (0, 0, 1.595), 'pelvis': (0, 0, 0.93), 'neck': (0, 0, 1.40), 'head_base': (0, 0, 1.50)}
    for k, v in want.items():
        assert (J[k] - Vector(v)).length < 0.002, (k, tuple(J[k]), v)


def test_child_landmarks():
    bp, J = _J(age='child', height=1.28, heads_tall=6.0)
    hp = char_head.params()
    s = body.head_scale(bp, char_head.head_metrics(hp, 1.0)['height'])
    h = char_head.head_metrics(hp, s)['height']
    assert abs(h - 1.28 / 6) < 0.005, h
    assert abs(J['HIP'].z / 1.28 - 0.538) < 0.03, J['HIP'].z / 1.28        # CP-L03


def test_sex_shoulder_hip():
    _, J0 = _J(sex=0.0)
    _, J1 = _J(sex=1.0)
    assert J1['SH'].x < J0['SH'].x and J1['HIP'].x > J0['HIP'].x


def test_stoop_moves_head_forward():
    _, J0 = _J(stoop=0.0)
    _, J1 = _J(stoop=0.5)
    assert J1['head_c'].y < J0['head_c'].y - 0.03, (J1['head_c'].y, J0['head_c'].y)


def test_stylize_bigger_head():
    bp = body.body_params('adult', stylize=1.0)
    s = body.head_scale(bp, char_head.head_metrics(char_head.params(), 1.0)['height'])
    h = char_head.head_metrics(char_head.params(), s)['height']
    assert abs(bp['height'] / h - 4.5) < 0.2, bp['height'] / h
