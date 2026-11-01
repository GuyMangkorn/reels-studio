import {drawFigure, H, type CastDef, type FigAnchors, type FigPose} from '../kit/cast';
import type {InteriorLight} from '../kit/draw';
import {HEAD_SPAN, type FaceState} from '../kit/head';
import {poseArms} from '../kit/poses';
import type {Painter, Pt} from '../kit/painter';
import {paintMaskFace} from './face';

// The woman (`kuchisake`, brief VD06): a new cast entry on the kit rig. Height 1.95 m with the decal head unchanged (about
// 4.6 heads: the deliberate stylisation exception, see DF-20261101-kso-look-stills for the proportion check), long hair,
// beige coat, front view only, standing P01. The mask and smile are episode code (face.ts), painted over the head decal.

export const KSO_WOMAN: CastDef = {
  height: 1.95,
  seed: 650,
  head: {skin: '#dcb190', hair: '#16161a', cut: 'long'},
  outfit: {shoulder: 0.38, shirt: '#2b2e33', sleeve: '#c9b79a', longSleeves: true, coat: '#c9b79a', pants: '#2b2d30', shoes: '#1c1d20'},
};

/**
 * The street lamp as an interior light (VD18 model): key from above, slightly from screen-left, so the coat and hair lit
 * from above and the lower body fall off dark; a cool rim from the upper right (the far vending glow side).
 */
export const WOMAN_LIGHT: InteriorLight = {key: [0.2, 1], rim: [-0.6, 1], rimScale: 0.6};

/** The street and the mask-on frames (LF02, LF01 seam): calm half-lidded eyes, flat brows. */
export const CALM_FACE: FaceState = {brow: 'flat', eyes: 'half', look: [0, 0], mouth: 'flat'};
/**
 * The reveal (LF03, round 3, user direction 1 Nov 2026): eyes wide with small pupils and a fixed stare; brows angled down
 * toward the nose (the kit's `angry`). A one-raised brow (`quirk`) was tried first and read too weak.
 */
export const REVEAL_FACE: FaceState = {brow: 'angry', eyes: 'wide', look: [0, 0], mouth: 'flat'};

/**
 * Draw the woman at ground point `g` (plate px) and `unit` px per metre, then her mask state `m` (0..1) and face controls.
 * Returns the rig anchors (head centre, feet, lead top/bottom) in plate px.
 */
export const drawWoman = (p: Painter, g: Pt, unit: number, t: number, m: number, light: InteriorLight | undefined = WOMAN_LIGHT, face: FaceState = CALM_FACE): FigAnchors => {
  const pose: FigPose = {
    view: 'front',
    face,
    ...poseArms('P01', KSO_WOMAN, g, unit),
    light,
  };
  const a = drawFigure(p, KSO_WOMAN, g, unit, pose, t);
  // The decal head is centred on the anchor `head` with K px per unit (the same K drawFigure uses).
  paintMaskFace(p, KSO_WOMAN.seed * 1000 + 900, a.head[0], a.head[1], (H / HEAD_SPAN) * unit, m);
  return a;
};
