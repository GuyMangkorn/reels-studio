// Front-view arm pose library: the user's pose sheet P01-P30 as hand targets for the painted kit rig.
// Rules: docs/character-proportion-principles.md#cp-p-pose-sheet (CP-P08..CP-P11). The sheet's shoulder_deg and
// elbow_bend_deg are not rig inputs (CP-P11). Boss converted each arm once: two-bone forward kinematics with the rig's
// bone (BONE, 0.26 m) from the shoulder anchor, then checked against the picture (pose-sheet picture in the asset store).
// Where the sheet's angle sign or side did not match the picture, the picture decides (notes per pose). Chest-holding
// poses (CP-P10: P10, P17, P25, P26, P28) use the elbows-back rule (CP-P02): behind:'upper', the elbow just inside the
// torso edge, within one bone of the shoulder (so level with or just below the hand). Props: only the rig's Prop kinds (phone); other props are listed as missing.
//
// Targets are metres from each shoulder anchor (u toward screen right, v up), so one table serves every CastDef
// (height and outfit change the anchor). `poseArms` maps them to the Arm fields of drawFigure (plate px). Pose
// geometry is standing: no crouch, lean, rise or profile view.
import type {Arm, CastDef, FigPose, Prop} from './cast';
import {H} from './cast';
import type {Pt} from './painter';

export const POSE_IDS = ['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P09', 'P10', 'P11', 'P12', 'P13', 'P14', 'P15', 'P16', 'P17', 'P18', 'P19', 'P20', 'P21', 'P22', 'P23', 'P24', 'P25', 'P26', 'P27', 'P28', 'P29', 'P30'] as const;
export type PoseId = (typeof POSE_IDS)[number];

/** One arm: hand target and authored elbow (`via`), metres from the shoulder anchor; `behind` as Arm.behind. */
export type ArmTarget = {to: Pt; via: Pt; behind?: Arm['behind']};
export type PoseSpec = {name: string; r: ArmTarget; l: ArmTarget; rHold?: Prop; lHold?: Prop; missing?: string};

const a = (to: Pt, via: Pt, behind?: Arm['behind']): ArmTarget => ({to, via, behind});

export const POSES: Record<PoseId, PoseSpec> = {
  P01: {name: 'idle_arms_down', r: a([-0.045, -0.518], [-0.023, -0.259]), l: a([0.045, -0.518], [0.023, -0.259])}, // hang: FK both arms (CP-P05)
  P02: {name: 'thinking_hand_chin', r: a([0.134, 0.012], [0.089, -0.244]), l: a([-0.329, -0.058], [-0.130, -0.226])}, // R FK (hand under the chin); L FK (crosses under the R elbow)
  P03: {name: 'arms_crossed', r: a([0.280, -0.103], [0.067, -0.251]), l: a([-0.280, -0.103], [-0.067, -0.251])}, // FK both (forearms cross at the waist)
  P04: {name: 'scratch_head', r: a([-0.014, 0.409], [-0.167, 0.200]), l: a([0.045, -0.518], [0.023, -0.259])}, // R picture: hand on the crown (the FK sign puts it on the face); elbow FK
  P05: {name: 'point_side', r: a([-0.045, -0.518], [-0.023, -0.259]), l: a([0.520, 0.000], [0.260, 0.000])}, // L FK, arm level (CP-P01 reach to the side)
  P06: {name: 'shrug_palms_up', r: a([-0.355, -0.095], [-0.130, -0.226]), l: a([0.355, -0.095], [0.130, -0.226])}, // FK both, palms out (CP-P01 splay)
  P07: {name: 'wave', r: a([-0.207, 0.443], [-0.184, 0.183]), l: a([0.090, -0.512], [0.045, -0.256])}, // R FK (hand beside the head); L hang
  P08: {name: 'celebrate_V', r: a([-0.134, 0.500], [-0.089, 0.244]), l: a([0.134, 0.500], [0.089, 0.244])}, // FK both, hands above the head
  P09: {name: 'hands_on_hips', r: a([-0.034, -0.391], [-0.184, -0.183]), l: a([0.034, -0.391], [0.184, -0.183])}, // picture: hands at the hips, elbows out (CP-P01); the FK sign lands on the belly
  P10: {name: 'hold_phone_chest', r: a([0.086, -0.202], [-0.014, -0.251], 'upper'), l: a([-0.086, -0.202], [0.014, -0.251], 'upper'), rHold: {kind: 'phone'}}, // CP-P02 elbows back; hands meet at the phone (picture); phone in R hand
  P11: {name: 'offer_toward_camera', r: a([-0.134, -0.251], [-0.045, -0.256]), l: a([0.045, -0.518], [0.023, -0.259])}, // picture: forearm foreshortened toward camera (CP-P09); FK gives a full-length arm; L hang
  P12: {name: 'surprise_cover_mouth', r: a([0.026, 0.069], [-0.114, -0.151]), l: a([-0.026, 0.069], [0.114, -0.151])}, // picture: both hands at the jaw sides, outside the coat collar (0.24 H wide); elbows low-out
  P13: {name: 'punch_toward_camera', r: a([-0.024, -0.111], [-0.054, -0.251]), l: a([0.045, -0.518], [0.023, -0.259])}, // picture: fist toward camera, forearm foreshortened (CP-P09); L hang
  P14: {name: 'point_at_viewer', r: a([0.006, -0.202], [-0.045, -0.256]), l: a([0.045, -0.518], [0.023, -0.259])}, // picture: finger toward the viewer, foreshortened; L hang
  P15: {name: 'stop_both_palms', r: a([-0.164, -0.032], [-0.134, -0.222]), l: a([0.164, -0.032], [0.134, -0.222])}, // picture: palms out at shoulder height, foreshortened toward camera
  P16: {name: 'reach_grab_camera', r: a([-0.194, -0.161], [-0.089, -0.244]), l: a([0.045, -0.518], [0.023, -0.259])}, // picture: open palm beside the body, foreshortened; L hang
  P17: {name: 'show_notebook_upright', r: a([0.026, -0.181], [-0.014, -0.251], 'upper'), l: a([-0.026, -0.181], [0.014, -0.251], 'upper'), missing: 'notebook'}, // CP-P02 elbows back; notebook missing (kit has no notebook)
  P18: {name: 'offer_cup_toward_camera', r: a([-0.045, -0.518], [-0.023, -0.259]), l: a([-0.036, -0.181], [0.089, -0.244]), missing: 'cup'}, // picture: the cup is on the screen-right hand (character L), so the L arm takes the sheet R angles mirrored; R hang; cup missing
  P19: {name: 'drink_cup', r: a([0.066, 0.129], [-0.174, 0.119]), l: a([0.045, -0.518], [0.023, -0.259]), missing: 'cup'}, // picture: hand at the mouth, elbow raised; cup missing; L hang
  P20: {name: 'phone_at_ear', r: a([-0.074, 0.218], [-0.254, 0.038]), l: a([0.045, -0.518], [0.023, -0.259]), rHold: {kind: 'phone'}}, // picture: phone at the ear; phone in R hand; L hang
  P21: {name: 'salute', r: a([-0.014, 0.399], [-0.154, 0.198]), l: a([0.045, -0.518], [0.023, -0.259])}, // picture: salute, hand at the brow; elbow out at head height; L hang
  P22: {name: 'flex_biceps', r: a([-0.215, 0.256], [-0.260, 0.000]), l: a([0.215, 0.256], [0.260, 0.000])}, // FK both, fists up outside the shoulders (CP-P01)
  P23: {name: 'hands_behind_head', r: a([-0.024, 0.218], [-0.199, 0.167]), l: a([0.024, 0.218], [0.199, 0.167])}, // picture: hands at the sides of the head, elbows out (CP-P01)
  P24: {name: 'facepalm', r: a([0.056, 0.238], [-0.144, 0.069]), l: a([0.045, -0.518], [0.023, -0.259])}, // picture: hand on the forehead; elbow raised out; L hang
  P25: {name: 'laptop_typing', r: a([-0.064, -0.261], [-0.014, -0.251], 'upper'), l: a([-0.106, -0.261], [0.014, -0.251], 'upper'), missing: 'laptop'}, // CP-P02; R holds the laptop (laptop missing); L types (FK)
  P26: {name: 'carry_box', r: a([-0.064, -0.261], [-0.014, -0.251], 'upper'), l: a([0.064, -0.261], [0.014, -0.251], 'upper'), missing: 'box'}, // CP-P02; box held at the sides (box missing)
  P27: {name: 'count_fingers', r: a([-0.164, 0.018], [-0.114, -0.222]), l: a([-0.016, -0.081], [0.124, -0.202])}, // picture: screen-left palm raised (the sheet L angles mirrored), screen-right finger points at it (sheet R angles mirrored); the sheet side labels do not match the picture
  P28: {name: 'write_notebook', r: a([0.036, -0.202], [-0.014, -0.251], 'upper'), l: a([-0.076, -0.261], [0.014, -0.251], 'upper'), missing: 'notebook'}, // CP-P02; R writes (picture), L holds the notebook (notebook missing)
  P29: {name: 'thumbs_up', r: a([-0.194, -0.061], [-0.114, -0.222]), l: a([0.045, -0.518], [0.023, -0.259])}, // picture: thumb-up fist at shoulder height outside the body (CP-P09); L hang
  P30: {name: 'visor_look_far', r: a([-0.045, -0.518], [-0.023, -0.259]), l: a([-0.016, 0.369], [0.154, 0.179])}, // picture: L hand at the visor, forearm up; R hang
};

/** Shoulder anchors the rig draws each arm from (cast.ts drawFigure at crouch 0), metres from the ground point. */
export const shoulderAnchors = (def: CastDef): {r: Pt; l: Pt} => {
  const shV = def.height - H - 0.16 * H, sw = def.outfit.shoulder * H;
  return {r: [-(sw - 0.0255), shV - 0.0255], l: [sw - 0.0255, shV - 0.0255]};
};

/** The FigPose arm and prop fields for one pose on a figure. `g` is the ground point and `unit` px per metre, as drawFigure takes them. */
export const poseArms = (id: PoseId, def: CastDef, g: Pt, unit: number): Pick<FigPose, 'rArm' | 'lArm' | 'rHold' | 'lHold'> => {
  const spec = POSES[id], S = shoulderAnchors(def);
  const px = (side: 'r' | 'l', p: Pt): Pt => [g[0] + (S[side][0] + p[0]) * unit, g[1] - (S[side][1] + p[1]) * unit];
  const arm = (side: 'r' | 'l'): Arm => ({to: px(side, spec[side].to), via: px(side, spec[side].via), behind: spec[side].behind});
  return {rArm: arm('r'), lArm: arm('l'), rHold: spec.rHold, lHold: spec.lHold};
};
