"""Reuse proof: three heads from ONE module by changing parameters only (zc_you, round_soft, long_sharp) + shape-key tweak.
Blender -b --python assets/blender/char_head/demo_variants.py -- <outdir>   (Eevee 64; writes variants_front.png / variants_q.png / variants_tweak.png)"""
import bpy, sys, os, math, importlib.util
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, '..'))
import char_head as ch
from mathutils import Vector
spec = importlib.util.spec_from_file_location('cb', os.path.join(HERE, '..', 'zc-corridor', 'build.py'))
cb = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cb)
out = sys.argv[sys.argv.index('--') + 1]
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
cb.render_settings(sc, 'eevee64')
sc.world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.35, 0.37, 0.40, 1)
sc.render.resolution_x, sc.render.resolution_y = 1200, 480
heads = []
for i, (name, p) in enumerate((('zc_you', ch.preset('zc_you')), ('round_soft', ch.preset('round_soft')), ('long_sharp', ch.preset('long_sharp')))):
    o = (0.34 * (i - 1), 0, 0)
    ao = ch.add_standalone_armature(p, name, o)
    parts = ch.build_head(ao, o, p, name)
    heads.append((ao, parts))
    ao.pose.bones['jaw'].rotation_euler  # poseable
    ch.apply_face(ao.pose.bones, ('neutral', 'tired', 'focused')[i])
cb.area('key', (0.8, -2.2, 1.6), (1.2, 1.2), (1, 0.95, 0.9), 220, rot=(math.radians(70), 0, math.radians(20)))
cb.area('fill', (-2.0, -1.5, 0.8), (3, 3), (0.8, 0.9, 1), 80, rot=(math.radians(80), 0, math.radians(-50)))
cd = bpy.data.cameras.new('c')
cd.lens = 85
cd.sensor_fit = 'HORIZONTAL'
co = bpy.data.objects.new('c', cd)
sc.collection.objects.link(co)
sc.camera = co
def shot(name, ang):
    a = math.radians(ang)
    co.location = Vector((0, 0, 0.0)) + Vector((math.sin(a) * 2.4, -math.cos(a) * 2.4, 0.0))
    co.rotation_euler = (math.radians(90), 0, a)
    sc.render.filepath = os.path.join(out, name)
    bpy.ops.render.render(write_still=True)
shot('variants_front.png', 0)
shot('variants_q.png', 35)
# shape keys on the second head: bigger nose, wider jaw (runtime, no rebuild)
hd = [o for o in heads[1][1] if o.name.endswith('_head')][0]
hd.data.shape_keys.key_blocks['nose_size'].value = 1.0
hd.data.shape_keys.key_blocks['jaw_width'].value = 0.8
shot('variants_tweak.png', 0)
