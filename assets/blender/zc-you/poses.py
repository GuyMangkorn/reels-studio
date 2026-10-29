"""zc-you pose API and shot tracks (SS-R2.4 sheets). Needs rig.build() first.

All targets are WORLD-space metres (ZC-WORLD). Blender frame = plate clip frame + 1 (clip 0 = Blender frame 1).
Sign conventions (checked by `check.py`): root yaw 0 -> front = -Y; facing vector = (sin yaw, -cos yaw);
bone-local euler on FK bones = (pitch forward +, yaw/twist toward body-LEFT +, side lean toward body-RIGHT +), degrees.
"""
import bpy, math
from mathutils import Vector, Matrix, Euler, Quaternion
from rig import FDIR
import rig as _rig
ch = _rig.ch

SH_Z = 1.385
HIPS_REST = Vector((0.0, 0.0, 0.93))
PALM_OFF = 0.045               # wrist -> palm centre along the hand axis
ANKLE_Z = 0.085                # ankle height with a flat foot

FACES = ch.FACE_PRESETS      # shared with every char_head consumer


def yaw_for(face):
    """Root yaw (deg) so the front (-Y) points along the horizontal vector `face`."""
    return math.degrees(math.atan2(face[0], -face[1]))


class Actor:
    def __init__(self, ao):
        self.ao = ao
        self.P = ao.pose.bones
        self.mw = Matrix.Identity(4)
        self.curl = {s: self._calibrate_curl(s) for s in 'LR'}
        self.keying = True              # False: pose without keyframes (static stills / checks)

    # ------------------------------------------------------------- helpers
    def _calibrate_curl(self, s):
        """Which local axis/sign of fingers.<s> curls the fingertips toward the palm side (medial: -X for L, +X for R)."""
        sg = 1 if s == 'L' else -1
        pb = self.P[f'fingers.{s}']
        best = None
        for ax in (0, 2):
            for sgn in (1.0, -1.0):
                e = [0.0, 0.0, 0.0]
                e[ax] = math.radians(60) * sgn
                pb.rotation_euler = Euler(e, 'XYZ')
                bpy.context.view_layer.update()
                dx = -sg * (pb.tail.x - pb.bone.tail_local.x)
                if best is None or dx > best[0]:
                    best = (dx, ax, sgn)
        pb.rotation_euler = Euler((0, 0, 0), 'XYZ')
        bpy.context.view_layer.update()
        return best[1], best[2]

    def a(self, p):
        """world -> armature space"""
        return self.mw.inverted() @ Vector(p)

    def _set_ctrl(self, name, pos_arm, rot3=None):
        pb = self.P[name]
        R = pb.bone.matrix_local.to_3x3() if rot3 is None else rot3 @ pb.bone.matrix_local.to_3x3()
        pb.matrix = Matrix.Translation(pos_arm) @ R.to_4x4()

    def _fk(self, name, deg):
        self.P[name].rotation_euler = Euler(tuple(math.radians(d) for d in deg), 'XYZ')

    def head_eye_world(self):
        hb = self.P['head']
        M = hb.matrix @ hb.bone.matrix_local.inverted()
        eye = self.mw @ (M @ Vector((0, EYE_Y_REST, EYE_Z_REST)))
        fwd = self.mw.to_3x3() @ (M.to_3x3() @ Vector((0, -1, 0)))
        return eye, fwd

    # ------------------------------------------------------------- the one keyed pose call
    def pose(self, f, root=None, hips=None, bob=0.0, pelvis=(0, 0, 0), spine=(0, 0, 0), chest=(0, 0, 0), neck=(0, 0, 0), head=(0, 0, 0),
             clav_l=(0, 0, 0), clav_r=(0, 0, 0), hand_l=None, hand_r=None, foot_l=None, foot_r=None,
             pole_el_l=None, pole_el_r=None, pole_kn_l=None, pole_kn_r=None, look=None, face='neutral', blink=0.0,
             interp='BEZIER', key=True, **face_over):
        """Set (and key at Blender frame f) the whole body.

        root=(x, y, yaw_deg) floor anchor; hips=(x,y,z) world hip centre (default root + 0.93 m + bob);
        hand_x=dict(palm=(x,y,z) world palm centre, dir=world hand axis wrist->fingers, normal=palm normal, curl=0..1, thumb=0..1);
        foot_x=dict(ankle=(x,y,z) or sole=(x,y) [flat], yaw=deg world, pitch=deg toes up);
        look=(x,y,z) world eye target (None = along the head's facing); face=FACES key (+ lid/brow/jaw overrides); blink 0..1.
        """
        ao, P = self.ao, self.P
        if root is not None:
            ao.location = (root[0], root[1], 0.0)
            ao.rotation_euler = (0, 0, math.radians(root[2]))
        self.mw = Matrix.Translation(ao.location) @ Matrix.Rotation(ao.rotation_euler[2], 4, 'Z')
        Rw = self.mw.to_3x3()
        psi = math.degrees(ao.rotation_euler[2])
        h = Vector(hips) if hips is not None else Vector((ao.location.x, ao.location.y, 0.93 + bob))
        pb = P['pelvis']
        pb.location = pb.bone.matrix_local.to_3x3().inverted() @ (self.a(h) - HIPS_REST)
        for n, v in (('pelvis', pelvis), ('spine', spine), ('chest', chest), ('neck', neck), ('head', head),
                     ('clavicle.L', clav_l), ('clavicle.R', clav_r)):
            self._fk(n, v)
        bpy.context.view_layer.update()
        # ---- hands (IK on forearm.<s>; hand follows the control's rotation)
        for s, spec, pole in (('L', hand_l, pole_el_l), ('R', hand_r, pole_el_r)):
            sg = 1 if s == 'L' else -1
            rest_dir = Vector((FDIR.x * sg, FDIR.y, FDIR.z)).normalized()
            sh = P[f'upper_arm.{s}'].head.copy()
            if spec is None:         # relaxed: hanging beside the thigh with a slight forward swing
                spec = dict(palm=self.mw @ (sh + Vector((0.06 * sg, -0.04, -0.60))), dir=Rw @ Vector((0.10 * sg, -0.10, -1.0)),
                            normal=Rw @ Vector((-sg, 0, 0)))
            d_a = (Rw.inverted() @ Vector(spec['dir'])).normalized() if spec.get('dir') is not None else rest_dir
            n_a = Rw.inverted() @ Vector(spec['normal']) if spec.get('normal') is not None else Vector((-sg, 0, 0))
            R = _frame_rot(rest_dir, Vector((-sg, 0, 0)), d_a, n_a)
            self._set_ctrl(f'ik_hand.{s}', self.a(spec['palm']) - d_a * PALM_OFF, R)
            self._set_ctrl(f'pole_elbow.{s}', self.a(pole) if pole is not None else sh + Vector((0.45 * sg, 0.55, -0.15)))
            self._curl(s, spec.get('curl', 0.18), spec.get('thumb', 0.15))
        # ---- feet (IK on shin.<s>; foot follows the control's rotation)
        for s, spec, pole in (('L', foot_l, pole_kn_l), ('R', foot_r, pole_kn_r)):
            sg = 1 if s == 'L' else -1
            if spec is None:
                spec = dict(ankle=self.mw @ Vector((0.085 * sg, 0.0, ANKLE_Z)), yaw=psi)
            an = Vector(spec['ankle']) if 'ankle' in spec else Vector((spec['sole'][0], spec['sole'][1], ANKLE_Z))
            yaw = spec.get('yaw', psi)
            Rz = Matrix.Rotation(math.radians(yaw - psi), 3, 'Z')
            lat = Rz @ Vector((1, 0, 0))
            Rp = Matrix.Rotation(math.radians(-spec.get('pitch', 0.0)), 3, lat)
            self._set_ctrl(f'ik_foot.{s}', self.a(an), Rp @ Rz)
            fwd = Rw @ (Rz @ Vector((0, -1, 0)))
            self._set_ctrl(f'pole_knee.{s}', self.a(pole) if pole is not None else self.a(an + fwd * 0.6 + Vector((0, 0, 0.35))))
        # ---- face (shared char_head presets: lids, brows, jaw)
        ch.apply_face(P, face, blink, **face_over)
        bpy.context.view_layer.update()
        if look is None:
            eye, fwd = self.head_eye_world()
            look = eye + fwd * 1.5
        self._set_ctrl('look_target', self.a(look))
        bpy.context.view_layer.update()
        if key and self.keying:
            self.key(f, interp)

    def _curl(self, s, amount, thumb):
        ax, sgn = self.curl[s]
        e = [0.0, 0.0, 0.0]
        e[ax] = math.radians(95 * amount) * sgn
        e2 = [0.0, 0.0, 0.0]
        e2[ax] = math.radians(95 * amount * 0.85) * sgn
        e[ax] *= 0.8
        self.P[f'fingers.{s}'].rotation_euler = Euler(e, 'XYZ')
        self.P[f'fingers_tip.{s}'].rotation_euler = Euler(e2, 'XYZ')
        t = [0.0, 0.0, 0.0]
        t[ax] = math.radians(50 * thumb) * sgn
        self.P[f'thumb.{s}'].rotation_euler = Euler(t, 'XYZ')

    def key(self, f, interp='BEZIER'):
        bpy.context.preferences.edit.keyframe_new_interpolation_type = interp
        ao = self.ao
        ao.keyframe_insert('location', frame=f)
        ao.keyframe_insert('rotation_euler', frame=f)
        for pb in self.P:
            if pb.name == 'root':
                continue
            pb.keyframe_insert('location', frame=f)
            pb.keyframe_insert('rotation_quaternion' if pb.rotation_mode == 'QUATERNION' else 'rotation_euler', frame=f)


EYE_Y_REST = ch.PARAMS['eye_y']
EYE_Z_REST = _rig.HEAD_C.z + ch.PARAMS['eye_z']


def _frame_rot(a0, n0, a1, n1):
    """Rotation taking (axis a0, palm normal n0) to (a1, n1); normals are projected perpendicular to the axes."""
    def basis(a, n):
        a = a.normalized()
        n = n - a * n.dot(a)
        if n.length < 1e-6:
            n = a.cross(Vector((0, 0, 1)))
            if n.length < 1e-6:
                n = a.cross(Vector((1, 0, 0)))
        n = n.normalized()
        return Matrix((a, n, a.cross(n))).transposed()
    return basis(a1, n1) @ basis(a0, n0).inverted()
