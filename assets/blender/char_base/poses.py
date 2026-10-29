"""char_base pose API: Actor drives any char_base character (needs build.build() first; anchors come from its cb_* custom props).

All targets are WORLD-space metres. Blender frame = plate clip frame + 1 (clip 0 = Blender frame 1).
Sign conventions: root yaw 0 -> front = -Y; facing vector = (sin yaw, -cos yaw);
bone-local euler on FK bones = (pitch forward +, yaw/twist toward body-LEFT +, side lean toward body-RIGHT +), degrees.
Face presets and apply_face come from char_head (the default head style).
"""
import bpy, math, os, sys
from mathutils import Vector, Matrix, Euler, Quaternion
_HERE = os.path.dirname(os.path.abspath(__file__))
for _p in (_HERE, os.path.join(_HERE, '..', 'char_head')):
    _p = os.path.normpath(_p)
    if _p not in sys.path:
        sys.path.insert(0, _p)
import char_head as ch
from body import FDIR, REF_ARM

RELAX_PALM = (0.06, -0.04, -0.60)   # relaxed palm offset from the shoulder (x outward, y, z) x ARM_K, before the spread
ARMPIT_ZONE = 0.10                  # m x ARM_K below the shoulder where the relaxed arm root joins the trunk (spread calibration skips it)
REF_HIP_Z, REF_SH_Z = 0.93, 1.385      # zc-you anchors: the reference the zc-sized staging numbers (feet, relaxed hands) were authored for

FACES = ch.FACE_PRESETS      # shared with every char_head consumer


def yaw_for(face):
    """Root yaw (deg) so the front (-Y) points along the horizontal vector `face`."""
    return math.degrees(math.atan2(face[0], -face[1]))


class Actor:
    CLAV_FOLLOW = (45.0, 0.1, 8.0)      # clavicle lifts with the arm: start (deg arm elevation from hanging), gain, max deg; gain 0 = off
    #                                     (0.3 / 20 before 6c fix 2: with the lowered deltoid cap a higher clavicle lift bunched the shoulder)

    def __init__(self, ao):
        if 'cb_hip_z' not in ao:
            raise ValueError(f'poses.Actor: {ao.name!r} has no cb_* anchors (build it with char_base.build.build)')
        self.ao = ao
        self.P = ao.pose.bones
        self.mw = Matrix.Identity(4)
        self.curl = {s: self._calibrate_curl(s) for s in 'LR'}
        self.clav_up = {s: self._calibrate_clav(s) for s in 'LR'}
        self.keying = True              # False: pose without keyframes (static stills / checks)

    # ------------------------------------------------------------- measured anchors (armature custom props, metres)
    @property
    def SH_Z(self):
        return self.ao['cb_shoulder_z']

    @property
    def HIPS_REST(self):
        return Vector((0.0, 0.0, self.ao['cb_hip_z']))

    @property
    def ANKLE_Z(self):
        return self.ao['cb_ankle_z']

    @property
    def PALM_OFF(self):
        return self.ao['cb_palm_off']      # wrist -> palm centre along the hand axis

    @property
    def EYE_Y_REST(self):
        return self.ao.data.bones['eye.L'].head_local.y     # eye depth in the head frame (no cb_ prop; the eye bone is the anchor)

    @property
    def EYE_Z_REST(self):
        return self.ao['cb_eye_z']

    @property
    def LEG_K(self):
        """Leg-length ratio to zc-you (hip height); scale zc-authored foot offsets by it."""
        return self.ao['cb_hip_z'] / REF_HIP_Z

    @property
    def ARM_K(self):
        """Arm-length ratio to zc-you (upper arm + forearm bones); scale zc-authored hand offsets by it. Shoulder height was the proxy
        until 6c made arms follow the trunk (CP-L09): long-armed big-head / stylized bodies then bent their relaxed elbows back."""
        B = self.ao.data.bones
        return (B['upper_arm.L'].length + B['forearm.L'].length) / REF_ARM

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

    def _calibrate_clav(self, s):
        """Which local axis/sign of clavicle.<s> lifts the shoulder (tail up)."""
        pb = self.P[f'clavicle.{s}']
        best = None
        for ax in (0, 1, 2):
            for sgn in (1.0, -1.0):
                e = [0.0, 0.0, 0.0]
                e[ax] = math.radians(20) * sgn
                pb.rotation_euler = Euler(e, 'XYZ')
                bpy.context.view_layer.update()
                dz = pb.tail.z - pb.bone.tail_local.z
                if best is None or dz > best[0]:
                    best = (dz, ax, sgn)
        pb.rotation_euler = Euler((0, 0, 0), 'XYZ')
        bpy.context.view_layer.update()
        return best[1], best[2]

    def _clav_follow(self, s, palm_arm, clav):
        """Lift clavicle.<s> by CLAV_FOLLOW for a raised palm target unless the caller set the clavicle explicitly."""
        a0, gain, mx = self.CLAV_FOLLOW
        if not gain or any(clav):
            return
        v = palm_arm - self.P[f'upper_arm.{s}'].head
        el = math.degrees(math.acos(max(-1.0, min(1.0, -v.z / max(v.length, 1e-9)))))
        ax, sgn = self.clav_up[s]
        e = list(self.P[f'clavicle.{s}'].rotation_euler)
        e[ax] = math.radians(min(mx, max(0.0, el - a0) * gain)) * sgn
        self.P[f'clavicle.{s}'].rotation_euler = Euler(e, 'XYZ')
        bpy.context.view_layer.update()

    def relaxed_spread(self):
        """Extra sideways palm offset (m) for relaxed arms, calibrated by build (cb_relax_spread): the least spread that keeps the hanging
        arm RELAX_FIT clear of the trunk below the armpit zone. Heavy / stylized bodies only (joints stay mass-independent, R17); 0 when
        the arm already clears (zc-you)."""
        return self.ao.get('cb_relax_spread', 0.0)

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
        eye = self.mw @ (M @ Vector((0, self.EYE_Y_REST, self.EYE_Z_REST)))
        fwd = self.mw.to_3x3() @ (M.to_3x3() @ Vector((0, -1, 0)))
        return eye, fwd

    # ------------------------------------------------------------- the one keyed pose call
    def pose(self, f, root=None, hips=None, bob=0.0, pelvis=(0, 0, 0), spine=(0, 0, 0), chest=(0, 0, 0), neck=(0, 0, 0), head=(0, 0, 0),
             clav_l=(0, 0, 0), clav_r=(0, 0, 0), hand_l=None, hand_r=None, foot_l=None, foot_r=None,
             pole_el_l=None, pole_el_r=None, pole_kn_l=None, pole_kn_r=None, look=None, face='neutral', blink=0.0,
             interp='BEZIER', key=True, **face_over):
        """Set (and key at Blender frame f) the whole body.

        root=(x, y, yaw_deg) floor anchor; hips=(x,y,z) world hip centre (default root + cb_hip_z + bob);
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
        h = Vector(hips) if hips is not None else Vector((ao.location.x, ao.location.y, self.HIPS_REST.z + bob))
        pb = P['pelvis']
        pb.location = pb.bone.matrix_local.to_3x3().inverted() @ (self.a(h) - self.HIPS_REST)
        for n, v in (('pelvis', pelvis), ('spine', spine), ('chest', chest), ('neck', neck), ('head', head),
                     ('clavicle.L', clav_l), ('clavicle.R', clav_r)):
            self._fk(n, v)
        bpy.context.view_layer.update()
        # ---- hands (IK on forearm.<s>; hand follows the control's rotation)
        for s, spec, pole, clav in (('L', hand_l, pole_el_l, clav_l), ('R', hand_r, pole_el_r, clav_r)):
            sg = 1 if s == 'L' else -1
            if spec is not None:
                self._clav_follow(s, self.a(spec['palm']), clav)
            rest_dir = Vector((FDIR.x * sg, FDIR.y, FDIR.z)).normalized()
            sh = P[f'upper_arm.{s}'].head.copy()
            if spec is None:         # relaxed: hanging beside the thigh with a slight forward swing, spread out of a wide torso
                k = self.ARM_K
                ex = self.relaxed_spread()
                spec = dict(palm=self.mw @ (sh + Vector((RELAX_PALM[0] * sg, RELAX_PALM[1], RELAX_PALM[2])) * k + Vector((ex * sg, 0, 0))),
                            dir=Rw @ Vector((0.10 * sg + ex * sg / 0.6, -0.10, -1.0)), normal=Rw @ Vector((-sg, 0, 0)))
            d_a = (Rw.inverted() @ Vector(spec['dir'])).normalized() if spec.get('dir') is not None else rest_dir
            n_a = Rw.inverted() @ Vector(spec['normal']) if spec.get('normal') is not None else Vector((-sg, 0, 0))
            R = _frame_rot(rest_dir, Vector((-sg, 0, 0)), d_a, n_a)
            self._set_ctrl(f'ik_hand.{s}', self.a(spec['palm']) - d_a * self.PALM_OFF, R)
            self._set_ctrl(f'pole_elbow.{s}', self.a(pole) if pole is not None else sh + Vector((0.45 * sg, 0.55, -0.15)) * self.ARM_K)
            self._curl(s, spec.get('curl', 0.18), spec.get('thumb', 0.15))
        # ---- feet (IK on shin.<s>; foot follows the control's rotation)
        for s, spec, pole in (('L', foot_l, pole_kn_l), ('R', foot_r, pole_kn_r)):
            sg = 1 if s == 'L' else -1
            if spec is None:
                spec = dict(ankle=self.mw @ Vector((0.085 * sg * self.LEG_K, 0.0, self.ANKLE_Z)), yaw=psi)
            an = Vector(spec['ankle']) if 'ankle' in spec else Vector((spec['sole'][0], spec['sole'][1], self.ANKLE_Z))
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
