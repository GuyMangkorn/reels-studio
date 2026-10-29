"""Labelled comparison grid of the eye shapes x lid modes (rows 1-4) and the brow presets (last row) on the same head, front view, orthographic.
Blender -b --python assets/blender/char_head/grid_eyes_brows.py -- <out.png> [brow_eye=almond] [brow_lids=line] [expression=neutral] [only=eyes|brows]"""
import bpy, sys, os, math, importlib.util
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import char_head as ch
from mathutils import Vector
spec = importlib.util.spec_from_file_location('cb', os.path.join(HERE, '..', 'zc-corridor', 'build.py'))
cb = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cb)
a = sys.argv[sys.argv.index('--') + 1:]
out = a[0]
kv = dict(x.split('=') for x in a[1:])
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
cb.render_settings(sc, 'eevee64')
sc.world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.62, 0.66, 0.70, 1)
cells = []
if kv.get('only') != 'brows':
    cells += [(e, l, 'straight_soft') for e in ch.EYE_SHAPES for l in ch.LID_MODES]
if kv.get('only') != 'eyes':
    cells += [(kv.get('brow_eye', 'almond'), kv.get('brow_lids', 'line'), b) for b in ch.BROW_SHAPES]
cols = 3
rows = (len(cells) + cols - 1) // cols
S = 0.30
for i, (e, l, b) in enumerate(cells):
    r, c = divmod(i, cols)
    o = ((c - 1) * S, 0, -r * S)
    nm = f'h{i}'
    p = ch.params(eye=e, brow=b, lid_mode=l)
    ao = ch.add_standalone_armature(p, nm, o)
    ch.build_head(ao, o, p, nm)
    ch.apply_face(ao.pose.bones, kv.get('expression', 'neutral'))
    lab = bpy.data.curves.new(f'lab{i}', 'FONT')
    lab.body = f'{e} / {l}' if (kv.get('only') != 'brows' and i < len(ch.EYE_SHAPES) * 3) else f'{e}/{l} + brow {b}'
    lab.size = 0.016
    lab.align_x = 'CENTER'
    lo = bpy.data.objects.new(f'lab{i}', lab)
    sc.collection.objects.link(lo)
    lo.location = (o[0], -0.2, o[2] - 0.138)
    lo.rotation_euler = (math.radians(90), 0, 0)
    lo.visible_shadow = False
    m = bpy.data.materials.new(f'lm{i}')
    m.use_nodes = True
    em = m.node_tree.nodes.new('ShaderNodeEmission')
    em.inputs['Color'].default_value = (0.02, 0.02, 0.02, 1)
    m.node_tree.links.new(em.outputs[0], [n for n in m.node_tree.nodes if n.type == 'OUTPUT_MATERIAL'][0].inputs['Surface'])
    lab.materials.append(m)
cb.area('key', (0.5, -2.2, 1.2), (1.6, 1.6), (1, 0.95, 0.9), 260, rot=(math.radians(80), 0, math.radians(14)))
cb.area('fill', (-2.0, -1.5, 0.4), (3, 3), (0.8, 0.9, 1), 90, rot=(math.radians(85), 0, math.radians(-50)))
W = S * cols
Hh = S * rows
cd = bpy.data.cameras.new('c'); cd.type = 'ORTHO'; cd.ortho_scale = max(W, Hh)
co = bpy.data.objects.new('c', cd); sc.collection.objects.link(co); sc.camera = co
co.location = Vector((0, -2.0, -(rows - 1) * S / 2 - 0.02)); co.rotation_euler = (math.radians(90), 0, 0)
sc.render.resolution_x = int(2700 * W / max(W, Hh)) if Hh > W else 2700
sc.render.resolution_y = int(sc.render.resolution_x * Hh / W)
sc.render.filepath = out
bpy.ops.render.render(write_still=True)
