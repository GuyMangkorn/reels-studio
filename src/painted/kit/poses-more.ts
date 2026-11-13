// Pose library, part 2 (1 Nov 2026, pass 2): the profile versions of the user's pose sheet P01-P30 and the new body poses P31+.
// The API (`poseArms`, `poseFor`, `poseMix`, `POSE_INFO`) lives in `poses.ts`; this file is data only. Read poses.ts first.
//
// Profile arms (left and right views): metres from the shoulder anchor, u toward the side the figure faces, v up. A profile
// has one shoulder anchor for both arms; `near` is the arm toward the viewer (drawn over the torso), `far` the other (drawn behind
// it: only what clears the torso shows). Targets are two-bone authored (`via` = elbow, no IK), each bone <= BONE (0.26 m).
// `'rig'` = leave the arm to the rig's own hang. P14 (point at the viewer) has no profile version: it points out of the picture.
//
// New body poses P31+: body fields (`FigPose.sit`, `floorSit`, `kneel`, `squat`, `run`, `lie`, `crouch`, `bend`, `lean`...) plus arm
// targets measured from the SHOULDERS OF THE POSED BODY (`shoulderPoint` in cast.ts), so a hand "on the knee" stays on the knee
// for any person. Use them through `poseFor` (body and arms together), not `poseArms` alone.
import {BONE} from './cast';
import type {FigPose, Prop} from './cast';
import type {ExpressionId} from './expressions';
import type {Pt} from './painter';
import type {ArmTarget, PoseId} from './poses';

export type View = FigPose['view'];
/** Body fields a pose sets on the figure (all optional; absent = the standing default). */
export type PoseBody = Partial<Pick<FigPose, 'crouch' | 'bend' | 'lean' | 'rise' | 'sit' | 'floorSit' | 'kneel' | 'squat' | 'run' | 'lie' | 'lift' | 'nod' | 'head'>>;
export type FrontArms = {r: ArmTarget; l: ArmTarget; rHold?: Prop; lHold?: Prop};
export type SideArms = {near: ArmTarget | 'rig'; far: ArmTarget | 'rig'; nearHold?: Prop; farHold?: Prop};

const mm = (x: number) => Math.round(x * 1000) / 1000;
/** Arm from two absolute bone angles in degrees (0 = straight down, 90 = forward, 180 = up, negative = back): exact bone lengths. */
const fk = (a1: number, a2: number): ArmTarget => {
  const r1 = (a1 * Math.PI) / 180, r2 = (a2 * Math.PI) / 180;
  const via: Pt = [BONE * Math.sin(r1), -BONE * Math.cos(r1)];
  return {via: [mm(via[0]), mm(via[1])], to: [mm(via[0] + BONE * Math.sin(r2)), mm(via[1] - BONE * Math.cos(r2))]};
};
const at = (via: Pt, to: Pt): ArmTarget => ({via, to});
/** An arm pointing at the viewer (front view): hand close to the shoulder, elbow on the shoulder-hand line, foreshortened by `toCam` (Arm.toCam, 0..1). */
export const toCamera = (to: Pt, toCam = 1, finger = false): ArmTarget => ({to, via: [to[0] / 2, to[1] / 2], toCam, ...(finger ? {finger} : {})});
const side = (near: ArmTarget | 'rig', far: ArmTarget | 'rig' = 'rig', holds: Pick<SideArms, 'nearHold' | 'farHold'> = {}): SideArms => ({near, far, ...holds});
const phone: Prop = {kind: 'phone'};

/** Rig default hang for a profile arm, as concrete targets (used to blend a pose with 'rig'). */
export const HANG_SIDE: ArmTarget = at([-0.012, -0.25], [0.014, -0.5]);

/** Profile arms of P01-P30 (the same action as the front pose). Absent id = no profile version (P14). */
export const PROFILE_ARMS: Partial<Record<PoseId, SideArms>> = {
  P01: side('rig', 'rig'),
  P02: side(at([0.12, -0.2], [0.09, 0.05]), at([0.04, -0.24], [0.1, -0.2])),
  P03: side(at([0.1, -0.22], [0.02, -0.17]), at([0.04, -0.24], [0.0, -0.17])),
  P04: side(at([0.126, 0.228], [-0.05, 0.42])),
  P05: side(fk(90, 90)),
  P06: side(at([0.04, -0.256], [0.27, -0.2]), at([0.0, -0.26], [0.22, -0.22])),
  P07: side(fk(55, 175)),
  P08: side(fk(150, 170), fk(135, 160)),
  P09: side(at([-0.14, -0.22], [0.03, -0.41]), at([-0.12, -0.22], [0.04, -0.4])),
  P10: side(at([0.0, -0.255], [0.2, -0.15]), at([-0.01, -0.25], [0.17, -0.2]), {nearHold: phone}),
  P11: side(at([0.13, -0.225], [0.37, -0.205])),
  P12: side(at([0.13, -0.1], [0.1, 0.14]), at([0.1, -0.15], [0.08, 0.1])),
  P13: side(fk(88, 92), at([0.05, -0.25], [0.1, -0.02])),
  P15: side(at([0.17, -0.19], [0.22, 0.06])),
  P16: side(fk(75, 100)),
  P17: side(at([0.0, -0.255], [0.2, -0.2]), at([0.0, -0.255], [0.17, -0.12])),
  P18: side(at([0.12, -0.23], [0.3, -0.12])),
  P19: side(at([0.14, -0.1], [0.11, 0.13])),
  P20: side(at([0.14, 0.1], [-0.02, 0.28]), 'rig', {nearHold: phone}),
  P21: side(at([0.2, 0.12], [0.11, 0.36])),
  P22: side(fk(90, 180), fk(80, 175)),
  P23: side(at([0.0, 0.14], [-0.12, 0.32])),
  P24: side(at([0.15, 0.1], [0.1, 0.33])),
  P25: side(at([0.0, -0.255], [0.22, -0.23]), at([0.0, -0.255], [0.2, -0.25])),
  P26: side(at([0.0, -0.255], [0.24, -0.2]), at([0.0, -0.255], [0.22, -0.22])),
  P27: side(at([0.1, -0.24], [0.24, -0.05]), at([0.05, -0.25], [0.2, -0.12])),
  P28: side(at([0.0, -0.255], [0.2, -0.25]), at([0.0, -0.255], [0.16, -0.16])),
  P29: side(at([0.1, -0.24], [0.28, -0.1])),
  P30: side(at([0.2, 0.12], [0.12, 0.34])),
};

export const BODY_POSE_IDS = ['P31', 'P32', 'P33', 'P34', 'P35', 'P36', 'P37', 'P38', 'P39', 'P40', 'P41', 'P42', 'P43', 'P44', 'P45', 'P46'] as const;
export type BodyPoseId = (typeof BODY_POSE_IDS)[number];

export type BodyPoseSpec = {
  name: string;
  /** What the pose looks like and when to use it (one line). */
  description: string;
  /** Expression that fits (`EXPRESSIONS` id); not applied by the pose. */
  face: ExpressionId;
  /** Front view: body fields and arms ('rig' = the rig's own arms). Absent = no front version. */
  front?: {body?: PoseBody; arms: FrontArms | 'rig'};
  /** Profile (left and right): body fields (a function of the facing, for poses that depend on it) and arms. Absent = no profile version. */
  side?: {body?: PoseBody | ((dir: 1 | -1) => PoseBody); arms: SideArms};
  /** Scene furniture this pose needs. */
  prop?: 'chair';
  /** A wall edge the scene paints OVER the figure (peek-around): `edgeU` m from the ground point toward screen right; the wall covers everything left of it. */
  occluder?: {edgeU: number};
};

const arm2 = (r: ArmTarget, l: ArmTarget): FrontArms => ({r, l});

export const BODY_POSES: Record<BodyPoseId, BodyPoseSpec> = {
  P31: {
    name: 'sit_chair_hands_lap', face: 'neutral', prop: 'chair',
    description: 'Seated on a chair, back straight, hands resting on the thighs. Pair with drawChair; front and profile.',
    front: {body: {sit: 1}, arms: arm2(at([-0.08, -0.225], [0.045, -0.43]), at([0.08, -0.225], [-0.045, -0.43]))},
    side: {body: {sit: 1}, arms: side(at([0.04, -0.255], [0.2, -0.43]), at([0.04, -0.255], [0.24, -0.41]))},
  },
  P32: {
    name: 'sit_chair_elbows_knees', face: 'worried', prop: 'chair',
    description: 'Seated on a chair leaning forward, elbows on the knees, hands hanging clasped. Waiting, worry, regret. Profile only.',
    side: {body: {sit: 1, bend: 0.9, nod: [0.15, 0.1]}, arms: side(at([-0.03, -0.22], [0.15, -0.25]), at([-0.03, -0.22], [0.14, -0.26]))},
  },
  P33: {
    name: 'sit_floor_hug_knees', face: 'sad',
    description: 'Sitting on the ground, knees up, arms wrapped round the shins. Frightened, cold, alone. Front and profile.',
    front: {body: {floorSit: 1}, arms: arm2(at([-0.055, -0.17], [0.125, -0.3]), at([0.055, -0.17], [-0.125, -0.3]))},
    side: {body: {floorSit: 1}, arms: side(at([0.15, -0.21], [0.31, -0.29]), at([0.15, -0.21], [0.3, -0.27]))},
  },
  P34: {
    name: 'kneel_hands_thighs', face: 'neutral',
    description: 'Kneeling upright on both knees, hands resting on the thighs. Prayer, apology, receiving, a monk. Front and profile.',
    front: {body: {kneel: 1}, arms: arm2(at([0.01, -0.26], [0.045, -0.5]), at([-0.01, -0.26], [-0.045, -0.5]))},
    side: {body: {kneel: 1}, arms: side(at([0.03, -0.26], [0.064, -0.49]), at([0.03, -0.26], [0.06, -0.48]))},
  },
  P35: {
    name: 'crouch_hide', face: 'scared',
    description: 'Crouched low behind cover, hands on the knees, head down. Hiding, sneaking, listening at a door. Front and profile.',
    front: {body: {crouch: 0.9, nod: [0, -0.1]}, arms: arm2(at([-0.15, -0.2], [-0.07, -0.17]), at([0.15, -0.2], [0.07, -0.17]))},
    side: {body: {squat: 1, bend: 0.35, nod: [0, -0.1]}, arms: side(at([0.016, -0.246], [0.156, -0.376]), at([0.016, -0.246], [0.14, -0.38]))},
  },
  P36: {
    name: 'lie_on_back', face: 'asleep',
    description: 'Lying flat on the back, arms along the body, face up (the profile card rotated: head left when facing right). Sleeping, fainted, a body. Profile only.',
    side: {body: (dir) => ({lie: dir}), arms: side('rig', 'rig')},
  },
  P37: {
    name: 'lie_on_side', face: 'asleep',
    description: 'Lying on one side facing the viewer, lower arm under the head (the front card rotated: head left). Sleeping, resting. Front only.',
    front: {body: {lie: 1}, arms: arm2(at([-0.199, 0.167], [-0.024, 0.218]), at([0.023, -0.259], [0.045, -0.518]))},
  },
  P38: {
    name: 'run', face: 'neutral',
    description: 'Mid-stride run, arms pumping (rig default run arms; leaning forward in profile). `run` is the phase in cycles: animate it for a cycle. Front (toward the camera) and profile.',
    front: {body: {run: 0.25}, arms: 'rig'},
    side: {body: (dir) => ({run: 0.22, lean: 0.2 * dir}), arms: side('rig', 'rig')},
  },
  P39: {
    name: 'fall_stumble', face: 'scared',
    description: 'Tripping forward: body pitched over the front foot, arms flung out. Panic, slip, being pushed. Front (sideways stumble) and profile.',
    front: {body: {run: 0.3, lean: 0.35, nod: [0.1, 0]}, arms: arm2(at([-0.25, 0.07], [-0.5, 0.14]), at([0.18, 0.19], [0.3, 0.4]))},
    side: {body: (dir) => ({run: 0.3, lean: 0.55 * dir, nod: [0, -0.1]}), arms: side(fk(125, 110), fk(100, 100))},
  },
  P40: {
    name: 'cower', face: 'terrified',
    description: 'Crouched and shrunk, forearms over the head, bracing. Terror, an explosion, a raised hand. Front and profile.',
    front: {body: {crouch: 0.7, nod: [0, -0.3]}, arms: arm2(at([-0.1, 0.24], [0.105, 0.4]), at([0.1, 0.24], [-0.105, 0.4]))},
    side: {body: {squat: 1, bend: 0.6, nod: [0, -0.2]}, arms: side(at([0.1, 0.2], [-0.02, 0.4]), at([0.08, 0.2], [-0.05, 0.38]))},
  },
  P41: {
    name: 'point_accuse', face: 'angry',
    description: 'Arm straight out at the viewer (front) or at the other person (profile), leaning in. Accusing, "you!", warning. Front and profile.',
    front: {body: {nod: [0, -0.1]}, arms: arm2(toCamera([0.075, -0.02], 1, true), at([0.045, -0.259], [0.09, -0.518]))},
    side: {body: (dir) => ({lean: 0.12 * dir}), arms: side(fk(88, 92), 'rig')},
  },
  P42: {
    name: 'hug_self', face: 'worried',
    description: 'Arms crossed tight over the chest, hands on the opposite shoulders, shoulders hunched. Cold, shivering (pair with the shiver motion), nervous. Front and profile.',
    front: {body: {rise: -0.02, nod: [0, -0.1]}, arms: arm2(at([0.1, -0.2], [0.265, -0.03]), at([-0.1, -0.2], [-0.265, -0.03]))},
    side: {body: {rise: -0.02, bend: 0.08}, arms: side(at([0.1, -0.2], [0.0, -0.12]), at([0.08, -0.2], [0.0, -0.1]))},
  },
  P43: {
    name: 'peek_around', face: 'worried',
    description: 'Half body: the figure stands behind a wall edge on the screen-left and leans out, one hand on the edge. The scene paints the wall over the figure (`occluder.edgeU`). Front only.',
    occluder: {edgeU: 0.1},
    front: {body: {lean: 0.3, head: 'right', nod: [0.15, 0]}, arms: arm2(at([0.0, -0.26], [0.0, -0.5]), at([-0.05, 0.1], [-0.2, 0.2]))},
  },
  P44: {
    name: 'hands_behind_back', face: 'neutral',
    description: 'Standing with both hands clasped behind the back (CP-P04). Waiting, hesitating, hiding something, a stern officer. Front and profile.',
    front: {body: {rise: 0.01}, arms: arm2({to: [0.08, -0.4], via: [-0.05, -0.24], behind: 'all'}, {to: [-0.08, -0.4], via: [0.05, -0.24], behind: 'all'})},
    side: {body: {}, arms: side(fk(-20, -10), fk(-18, -8))},
  },
  P45: {
    name: 'hands_up_surrender', face: 'scared',
    description: 'Both hands raised beside the head, palms open. Surrender, "don\'t shoot", being caught. Front and profile.',
    front: {body: {}, arms: arm2(at([-0.22, 0.14], [-0.3, 0.39]), at([0.22, 0.14], [0.3, 0.39]))},
    side: {body: {}, arms: side(at([0.2, 0.17], [0.2, 0.43]), at([0.18, 0.17], [0.18, 0.42]))},
  },
  P46: {
    name: 'zero-g-neutral', face: 'neutral',
    description: 'Weightless rest (EDU-EP08 B4, VD02): knees bent about 40 deg (crouch 0.22), upper arms 20 deg forward of hanging, forearms 65 deg forward toward the lens, gloves in front of the hips. No ground: paint with `shadow: false` (`paintFigureAt`) or `paintEva`. Front and profile.',
    front: {body: {crouch: 0.22}, arms: arm2(at([-0.04, -0.25], [0.03, -0.41]), at([0.04, -0.25], [-0.03, -0.41]))},
    side: {body: {crouch: 0.22}, arms: side(fk(20, 65), fk(18, 62))},
  },
};
