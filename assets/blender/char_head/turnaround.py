"""Face turnaround + expression/variant sheets for char_head (Eevee 64, headless).
Blender -b --python assets/blender/char_head/turnaround.py -- <outdir> [preset[:v1|v2] ...]
Writes <preset>_front/q/side.png (close-ups) and <preset>_expr_<name>.png for the 7 face presets of the first preset."""
import bpy, sys, os, math, importlib.util
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import char_head as ch
from mathutils import Vector
spec = importlib.util.spec_from_file_location('cb', os.path.join(HERE, '..', 'zc-corridor', 'build.py'))
cb = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cb)
args = sys.argv[sys.argv.index('--') + 1:]
out, names = args[0], args[1:] or ['zc_you']
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
cb.render_settings(sc, 'eevee64')
sc.world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.62, 0.66, 0.70, 1)
sc.render.resolution_x, sc.render.resolution_y = 540, 540
cb.area('key', (0.9, -2.2, 1.4), (1.2, 1.2), (1, 0.95, 0.9), 220, rot=(math.radians(72), 0, math.radians(22)))
cb.area('fill', (-2.0, -1.5, 0.6), (3, 3), (0.8, 0.9, 1), 80, rot=(math.radians(82), 0, math.radians(-50)))
cd = bpy.data.cameras.new('c'); cd.lens = 85; cd.sensor_fit = 'HORIZONTAL'
co = bpy.data.objects.new('c', cd); sc.collection.objects.link(co); sc.camera = co
def shot(name, ang, dist=0.78, aim=(0, 0, 0)):
    a = math.radians(ang)
    co.location = Vector((math.sin(a) * dist, -math.cos(a) * dist, 0.0)) + Vector(aim)
    co.rotation_euler = (math.radians(90), 0, a)
    sc.render.filepath = os.path.join(out, name)
    bpy.ops.render.render(write_still=True)
for spec_ in names:
    nm0, _, st = spec_.partition(':')
    st = st or 'v1'
    nm = f'{nm0}_{st}'
    p = ch.style(st, ch.preset(nm0))
    ao = ch.add_standalone_armature(p, nm)
    ch.build_head(ao, (0, 0, 0), p, nm)
    ch.apply_face(ao.pose.bones, 'neutral')
    for suf, ang in (('front', 0), ('q', 35), ('side', 90)):
        shot(f'{nm}_{suf}.png', ang)
    shot(f'{nm}_eye_side.png', 75, 0.30, (0, -0.075, 0.012))      # close-up of the eye area from the side: shows the socket recess
    if True:
        for ex in ch.FACE_PRESETS:
            ch.apply_face(ao.pose.bones, ex)
            shot(f'{nm}_expr_{ex}.png', 15)
    for o in bpy.data.objects:
        if o.type in ('MESH', 'ARMATURE'):
            o.hide_render = True
