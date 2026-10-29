"""outfits: every piece builds on an adult female body; long sleeves reach the wrist; the skirt never swallows a thigh vertex; shoes sit on the floor."""
import os
import sys

import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from test_cb import HERE, reset_scene

sys.path.insert(0, os.path.normpath(os.path.join(HERE, '..', 'zc-you')))     # tracks.seated_floor (the sit pose) lives with the zc-you shot tracks
sys.path.insert(0, os.path.normpath(os.path.join(HERE, '..')))
from char_base import poses

import body
import build
import heads
import presets
import tracks

TOPS = ('tee', 'shirt', 'tank')
BOTTOMS = ('shorts', 'trousers', 'skirt')
SHOES = ('sneaker', 'sandal', 'barefoot')
PIECES = TOPS + BOTTOMS + SHOES + ('grime',)
GARMENT = {'tee': 'tee', 'shirt': 'shirt', 'tank': 'tank', 'shorts': 'shorts', 'trousers': 'trousers', 'skirt': 'skirt'}


def _female(name, outfit):
    """Adult female (sex 1) preset built through build.build."""
    P = presets.get('zc_you')
    P['body'].update(height=1.65, sex=1.0)
    P['outfit'] = outfit
    P['palette'] = {'nail': ('#cfa58a', 0.8)}
    presets.PRESETS['_f'] = P
    try:
        return build.build('_f', name)
    finally:
        del presets.PRESETS['_f']


def _joints(ao):
    P = presets.get('zc_you')
    P['body'].update(height=1.65, sex=1.0)
    bp = body.body_params(P['age'], **P['body'])
    hm = heads.get('char_head')
    hp = hm.params()
    return body.joints(bp, hm.head_metrics(hp, body.head_scale(bp, hm.head_metrics(hp, 1.0)['height']))), body.factors(bp)


def _mat_names(ob):
    return [m.name for m in ob.data.materials]


def test_each_piece_builds():
    for i, piece in enumerate(PIECES):
        reset_scene()
        outfit = [(piece, {})] if piece != 'grime' else [('tee', {}), ('grime', {'on': 'tee'})]
        ao = _female(f'p{i}', outfit)
        meshes = [o for o in bpy.data.objects if o.type == 'MESH' and o.name.startswith(f'p{i}_')]
        body_ob = bpy.data.objects[f'p{i}_body']
        if piece in GARMENT and piece != 'skirt':
            k = [j for j, n in enumerate(_mat_names(body_ob)) if n.endswith('_' + piece)]
            assert k, (piece, _mat_names(body_ob))
            assert any(pg.material_index == k[0] for pg in body_ob.data.polygons), piece
        elif piece == 'skirt':
            sk = bpy.data.objects[f'p{i}_skirt']
            assert sk.modifiers['Armature'].object == ao and sk.parent == ao and len(sk.data.polygons) > 100
            assert any(m.name.endswith('_skirt') for m in sk.data.materials)
        elif piece in ('sneaker', 'sandal'):
            assert any(o.name.startswith(f'p{i}_{piece}') for o in meshes), piece
        elif piece == 'barefoot':
            assert any('toe0' in o.name for o in meshes)
        else:
            assert any(m.node_tree.nodes.get('cb_grime') for m in bpy.data.materials if m.use_nodes)


def test_color_option_hex():
    ao = _female('c', [('shirt', {'color': '#336699'})])
    assert any(m.name.endswith('#336699') or '336699' in m.name for m in bpy.data.objects['c_body'].data.materials)


def test_long_sleeve_reaches_wrist():
    J, F = _joints(None)
    for piece in ('shirt', 'tee', 'tank'):
        reset_scene()
        _female('s', [(piece, {'sleeve': 'long'})] if piece != 'tank' else [(piece, {})])
        ob = bpy.data.objects['s_body']
        k = [j for j, n in enumerate(_mat_names(ob)) if n.endswith('_' + piece)][0]
        for s in (1, -1):
            ax = Vector((body.FDIR.x * s, body.FDIR.y, body.FDIR.z)).normalized()
            wr = body.mirror(J['WR'], s)
            along = [(wr - Vector(sum((ob.data.vertices[v].co for v in pg.vertices), Vector())) / len(pg.vertices)).dot(ax)
                     for pg in ob.data.polygons if pg.material_index == k
                     and Vector(sum((ob.data.vertices[v].co for v in pg.vertices), Vector())).x * s / len(pg.vertices) > 0.25 * F['gw']]
            if piece == 'tank':
                assert not along, 'tank has no sleeves'
            else:
                assert along and min(along) <= 0.03, (piece, s, min(along) if along else None)
    reset_scene()
    _female('t', [('tee', {})])
    ob = bpy.data.objects['t_body']        # default short sleeve stays short
    k = [j for j, n in enumerate(_mat_names(ob)) if n.endswith('_tee')][0]
    far = [pg for pg in ob.data.polygons if pg.material_index == k and abs(sum(ob.data.vertices[v].co.x for v in pg.vertices)) / len(pg.vertices) > 0.3 * F['gw'] * 1.0 + 0.2]
    assert not far


def _walk_mid(A):
    k = A.LEG_K
    A.pose(None, key=False, root=(0, 0, 0), bob=-0.02,
           foot_l=dict(ankle=(0.085 * k, -0.30, A.ANKLE_Z), yaw=0.0), foot_r=dict(ankle=(-0.085 * k, 0.28, A.ANKLE_Z + 0.05), yaw=0.0))


def _sit(A):
    tracks.seated_floor(A, 0)


def _crouch(A):
    k = A.LEG_K
    A.pose(None, key=False, root=(0, 0, 0), hips=(0, 0.16, 0.50 * k), pelvis=(25, 0, 0), spine=(20, 0, 0),
           foot_l=dict(ankle=(0.10 * k, -0.15, A.ANKLE_Z), yaw=0.0), foot_r=dict(ankle=(-0.10 * k, -0.15, A.ANKLE_Z), yaw=0.0),
           pole_kn_l=(0.12, -0.9, 0.5), pole_kn_r=(-0.12, -0.9, 0.5))


RAYS = (Vector((0.31, 0.57, 0.76)), Vector((-0.67, 0.21, 0.52)), Vector((0.12, -0.83, -0.41)))


def _parity(tree, p, d):
    hits, o = 0, p
    for _ in range(64):
        loc, no, idx, dist = tree.ray_cast(o, d)
        if loc is None:
            break
        hits += 1
        o = loc + d * 1e-5
    return hits % 2


def _inside_count(ao, sk, bod):
    """Thigh-mesh vertices (dominant vertex group thigh.*) lying inside the evaluated skirt shell: ray parity, majority of three
    directions (a ray grazing a shell edge can double count; the others outvote it)."""
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    se, be = sk.evaluated_get(dg), bod.evaluated_get(dg)
    tree = BVHTree.FromObject(se, dg)
    inv = se.matrix_world.inverted()
    ds = [(inv.to_3x3() @ r).normalized() for r in RAYS]
    names = {g.index: g.name for g in bod.vertex_groups}
    n = 0
    for v in be.data.vertices:
        gs = [(g.weight, names[g.group]) for g in bod.data.vertices[v.index].groups]
        if not gs or not max(gs)[1].startswith('thigh.'):
            continue
        p = inv @ (be.matrix_world @ v.co)
        n += sum(_parity(tree, p, d) for d in ds) >= 2
    return n


def test_skirt_no_penetration():
    ao = _female('k', [('tee', {}), ('skirt', {}), ('barefoot', {})])
    sk, bod = bpy.data.objects['k_skirt'], bpy.data.objects['k_body']
    A = poses.Actor(ao)
    A.keying = False
    for name, fn in (('rest', lambda a: a.pose(None, key=False)), ('sit', _sit), ('walk-mid', _walk_mid), ('crouch', _crouch)):
        fn(A)
        c = _inside_count(ao, sk, bod)
        assert c == 0, (name, c)


def _zmin(ob):
    dg = bpy.context.evaluated_depsgraph_get()
    oe = ob.evaluated_get(dg)
    return min((oe.matrix_world @ v.co).z for v in oe.data.vertices)


def test_shoes_floor():
    for piece in ('sneaker', 'sandal'):
        reset_scene()
        ao = _female('h', [('tee', {}), ('shorts', {}), (piece, {})])
        bpy.context.view_layer.update()
        shoes = [o for o in bpy.data.objects if o.name.startswith(f'h_{piece}') or o.name.startswith('h_sole')]
        assert shoes, piece
        assert abs(min(_zmin(o) for o in shoes)) <= 0.0005, (piece, min(_zmin(o) for o in shoes))
        assert abs(build.measure(ao)['zmin']) <= 0.0005
        A = poses.Actor(ao)
        A.keying = False
        _walk_mid(A)
        bpy.context.view_layer.update()
        assert min(_zmin(o) for o in shoes) >= -0.002, piece


def test_unknown_piece_raises():
    try:
        _female('u', [('cape', {})])
    except ValueError as e:
        assert 'cape' in str(e)
        return
    raise AssertionError('no ValueError')


def test_bad_options_raise():
    """Every bad option raises ValueError naming its key, fast (a bad sleeve used to hang the band-growth loop)."""
    import time
    bad = [('tee', {'sleeve': -1}, 'sleeve'), ('tee', {'sleeve': 9}, 'sleeve'), ('shirt', {'sleeve': True}, 'sleeve'),
           ('shirt', {'sleeve': 'three-quarter'}, 'sleeve'), ('shirt', {'buttons': True}, 'buttons'), ('shirt', {'buttons': 2.5}, 'buttons'),
           ('shirt', {'buttons': -1}, 'buttons'), ('skirt', {'length': 2}, 'length'), ('skirt', {'length': -1}, 'length'),
           ('skirt', {'flare': -5}, 'flare'), ('skirt', {'thickness': 0}, 'thickness'), ('skirt', {'flare': True}, 'flare'),
           ('tee', {'fold': 'x'}, 'fold'), ('tee', {'color': 'red'}, 'red'), ('tee', {'color': '#12345'}, 'color'),
           ('tee', {'color': '#gg0000'}, 'color'), ('tee', {'color': 5}, 'color'), ('tee', {'color': True}, 'color'),
           ('sneaker', {'sole': 'blue'}, 'blue'), ('grime', {'color': 'red'}, 'color'), ('grime', {'on': 'nothing'}, 'nothing')]
    for i, (piece, opts, key) in enumerate(bad):
        reset_scene()
        outfit = [('tee', {}), (piece, opts)] if piece == 'grime' else [(piece, opts)]
        t0 = time.time()
        try:
            _female(f'b{i}', outfit)
        except ValueError as e:
            assert key in str(e), (piece, opts, str(e))
            assert time.time() - t0 < 30, (piece, opts)
            continue
        raise AssertionError(f'no ValueError for {piece} {opts}')
    reset_scene()
    _female('ok', [('shirt', {'color': '#336699', 'sleeve': 'short', 'buttons': 0}), ('skirt', {'length': 1.0, 'flare': 0.0, 'thickness': 0.002})])
