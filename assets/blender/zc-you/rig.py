"""zc-you rig: the lead of ZCONDO (a Thai man about 28, slim), full body + face, skinned to one armature.

Contract (ZC-WORLD / SCALE-ZC-R2, brief VB-ZCONDO-SHORT-R3.3 S-06):
  * metres, Z-up; armature object `zc-you` is the floor/root anchor: origin = floor between the feet, local front = -Y,
    body-left = +X. Placed in a set by setting `zc-you`.location / rotation_euler[2] only (never scale).
  * 1.72 m tall (hair top), eye centre 1.61 m (measured by `rig.measure()`).
  * Meshes: `zc-you_body` (skin modifier mesh baked, weighted to the deform bones), `zc-you_head` (skull, weighted head/jaw),
    eyes, lids, brows, nose, ears, hair. All carry an Armature modifier; no bone parenting, no object-level transforms.
  * Controls (pose bones): `ik_hand.L/R`, `ik_foot.L/R`, `pole_elbow.L/R`, `pole_knee.L/R`, `look_target`, `pelvis` (hips),
    FK `spine`, `chest`, `neck`, `head`, `clavicle.L/R`, `jaw`, `lid.L/R`, `brow.L/R`, `fingers.L/R`, `thumb.L/R`.
  * No blood on him at any time (VD-ZC-GORE: blood only on the infected, never on "you"). Day-3 variant: darker, creased/stained
    shirt (grime, not blood), messier hair, stubble.
Built by char_base (assets/blender/char_base, preset `zc_you`, variants day1/day3); this module is the zc-you entry point.
Run from Blender: sys.path.insert(0, <this dir>); import rig; rig.build(variant='day1'|'day3').
"""
import os, sys
from mathutils import Vector
_HERE = os.path.dirname(os.path.abspath(__file__))
for _p in (os.path.join(_HERE, '..', 'char_base'), os.path.join(_HERE, '..', 'char_head')):
    _p = os.path.normpath(_p)
    if _p not in sys.path:
        sys.path.insert(0, _p)
if _HERE in sys.path:                 # zc-you's own modules win name clashes with char_base (poses: tracks needs the zc-you anchors)
    sys.path.remove(_HERE)
sys.path.insert(0, _HERE)
import char_head as ch      # shared illustrated head (assets/blender/char_head)
import body as _body
import build as _build

NAME = 'zc-you'
HEIGHT, EYE_Z = 1.72, 1.61
HEAD_C = Vector((0.0, 0.0, 1.595))
FDIR = _body.FDIR
rest_bounds = _build.rest_bounds
measure = _build.measure


def build(variant='day1', collection=None):
    """Create the rigged zc-you in the current scene; returns the armature object `zc-you`."""
    ao = _build.build('zc_you', NAME, variant, collection)
    ao['zc_variant'] = variant
    ao['zc_height_m'] = HEIGHT
    return ao
