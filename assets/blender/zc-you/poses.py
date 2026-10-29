"""zc-you pose API: the shared char_base Actor plus the zc-you reference anchors (the values `rig.build()` measures; used by tracks.py and check.py).
Needs rig.build() first. Conventions and sign checks: assets/blender/char_base/poses.py.
"""
import os, sys
from mathutils import Vector
_BLENDER = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
if _BLENDER not in sys.path:
    sys.path.insert(0, _BLENDER)
from char_base.poses import *
from char_base.poses import ch, _frame_rot

SH_Z = 1.385
HIPS_REST = Vector((0.0, 0.0, 0.93))
PALM_OFF = 0.045               # wrist -> palm centre along the hand axis
ANKLE_Z = 0.085                # ankle height with a flat foot
