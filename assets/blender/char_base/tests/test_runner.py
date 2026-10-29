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



def test_a_leaves_edit_mode():
    bpy.ops.object.armature_add()
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.data.materials.new("m")


def test_b_reset_after_edit_mode():
    assert len(bpy.data.objects) == 0
    assert len(bpy.data.armatures) == 0
    assert len(bpy.data.materials) == 0
