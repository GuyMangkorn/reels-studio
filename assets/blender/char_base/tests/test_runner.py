"""Runner self-test: pass path and reset_scene."""
import bpy
from test_cb import reset_scene


def test_passes():
    assert True


def test_reset_empties_scene():
    bpy.ops.mesh.primitive_cube_add()
    reset_scene()
    assert len(bpy.data.objects) == 0
    assert len(bpy.data.meshes) == 0

