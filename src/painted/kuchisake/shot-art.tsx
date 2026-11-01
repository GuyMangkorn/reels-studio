import {useId} from 'react';
import {drawFigure, H, type FigPose} from '../kit/cast';
import {ell, hardFill, inkLine, rectPts, solid, washAt} from '../kit/draw';
import {HEAD_SPAN, type FaceState} from '../kit/head';
import {hash} from '../kit/hash';
import {paintPovHand, type HandTone} from '../kit/hands';
import {clamp01, mixColor, type Painter, type Pt} from '../kit/painter';
import type {Brush} from '../BrushCanvas';
import {poseArms} from '../kit/poses';
import {pushCamera, type Camera} from '../kit/camera';
import type {InteriorLight} from '../kit/draw';
import {WOMAN_LIGHT} from './cast';
import {COWORKER, hangArms, NARRATOR_DARK, roomP, roomUnit, PICTURE_W, PICTURE_H} from './rooms';
import {streetP} from './space';

// Shared art for the KSO shot plates (src/painted/shots/kuchisake.tsx). Copies of the few LF01-LF05 helpers that the frozen
// look files do not export (`paintCloseup` of look.tsx, `TopGlow`, the coworker light), so the look files stay untouched.
// Everything here is a pure function of the shot clock.

export const PAPER = '#0d1624';
const MASK_WHITE = '#ecebe6';

/** Slide of the mask band in `S01-B01-SH01` (px, down) at shot-local frame `lf`: still to f25, the fingers unhook it slowly, 230 px by f175, held. */
export const bandSlide = (lf: number): number => 230 * sstep((lf - 25) / 150);

/**
 * LF01 close-up cards (look.tsx `paintCloseup`, copied): the mask edge across the lens, hair strands, a cool cheek sliver.
 * `slide` 0 is the approved LF01 frame (S03-B02-SH02 loop return). With `push` (S01-B01-SH01, user note 1 Nov 2026 round 3:
 * the skin card at the upper right reads as a finger already on the strap, so that finger pushes the band down and no second
 * hand comes in) the card is painted over the band and rides down with it by `slide` px, its lower edge pressing 14 px into
 * the band; the face the band leaves is skin, a soft shadow under the band's edge.
 */
export const paintCloseup = (p: Painter, slide = 0, push = false) => {
  const d = slide;
  const FINGER: Pt[] = [[1380, 170], [820, 250], [760, 380], [800, 480], [940, 560], [1380, 600]];
  hardFill(p, 6_300_001, PAPER, rectPts(-300, -300, 1380, 2220));
  if (d > 0) hardFill(p, 6_300_005, '#5f4c42', [[-300, 470], [1380, 610], [1380, 2220], [-300, 2220]]);
  hardFill(p, 6_300_002, '#131219', [[-300, -300], [700, -300], [640, 170], [520, 300], [380, 390], [240, 450], [-300, 560]]);
  hardFill(p, 6_300_003, '#0c0b10', [[120, -300], [330, -300], [380, 220], [280, 380], [120, 300]]);
  if (!push) hardFill(p, 6_300_004, '#7d6556', FINGER);
  const strands: Pt[][] = [
    [[160, -300], [260, 150], [330, 330], [300, 470]],
    [[560, -300], [600, 60], [560, 260], [470, 420]],
    [[900, -300], [860, 40], [800, 230]],
  ];
  strands.forEach((s, i) => inkLine(p, 6_300_010 + i, s, {color: '#050508', weight: 9, curve: 0.4, closed: false}));
  if (push && d > 0) hardFill(p, 6_300_006, '#4a3a33', [[-300, 470 + d - Math.min(d, 26)], [1380, 610 + d - Math.min(d, 26)], [1380, 610 + d], [-300, 470 + d]]);
  hardFill(p, 6_300_020, '#2b3541', [[-300, 545 + d], [1380, 685 + d], [1380, 2220], [-300, 2220]]);
  hardFill(p, 6_300_021, '#1d2530', [[-300, 1050], [1380, 1050], [1380, 2220], [-300, 2220]]);
  hardFill(p, 6_300_022, '#161c25', [[-300, 1450], [1380, 1450], [1380, 2220], [-300, 2220]]);
  hardFill(p, 6_300_023, MASK_WHITE, [[-300, 470 + d], [1380, 610 + d], [1380, 685 + d], [-300, 545 + d]]);
  inkLine(p, 6_300_030, [[-300, 470 + d], [1380, 610 + d]], {color: '#5b7fa6', weight: 2, closed: false, curve: 0});
  // The mask's pleats travel with the mask (`slide`).
  inkLine(p, 6_300_040, [[60, 800 + d], [330, 760 + d], [600, 790 + d]], {color: '#1a212b', weight: 2.2, curve: 0.4, closed: false});
  inkLine(p, 6_300_041, [[480, 900 + d], [760, 1010 + d], [1000, 960 + d]], {color: '#1a212b', weight: 2.2, curve: 0.4, closed: false});
  if (push) {
    // The finger: the same card, moved down with the band (a little to the left along the band's slope), pressing into it.
    const press = 14 * sstep(d / 40), dx = -0.12 * d, dy = d + press;
    hardFill(p, 6_300_004, '#7d6556', FINGER.map(([x, y]): Pt => [x + dx, y + dy]));
  }
};

/** The close-up backdrop of the reveal look (look.tsx `paintReveal`, copied): the paper colour and the cool wash behind the head. */
export const paintCuBack = (p: Painter) => {
  hardFill(p, 6_200_001, PAPER, rectPts(-300, -300, 1380, 2220));
  washAt(p, 6_200_002, '#1a2a40', 200, ell(540, 560, 640, 780, 40), 0.3, 0.3);
};

/** The lamp-above glow of the reveal looks (look.tsx `TopGlow`, copied). Draw inside a CameraLayer. */
export const TopGlow = () => {
  const id = useId();
  return (
    <>
      <defs>
        <radialGradient id={id} gradientUnits="userSpaceOnUse" cx={300} cy={-200} r={1000}>
          <stop offset="0" stopColor="#e8c079" stopOpacity={0.26} />
          <stop offset="0.6" stopColor="#e8c079" stopOpacity={0.1} />
          <stop offset="1" stopColor="#e8c079" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={-400} y={-400} width={PICTURE_W + 800} height={PICTURE_H + 800} fill={`url(#${id})`} />
    </>
  );
};

/** The narrator in the dark jacket (`NARRATOR_DARK`), front view. `hang` uses the crouch-aware P01 hang (rooms.ts), else the standing P01 targets. */
export const drawNarratorFront = (p: Painter, g: Pt, unit: number, t: number, face: FaceState, light: InteriorLight | undefined = WOMAN_LIGHT, o: {crouch?: number; nod?: Pt; hang?: boolean} = {}) => {
  const arms = o.hang ? hangArms(NARRATOR_DARK, g, unit, o.crouch ?? 0, 'front') : poseArms('P01', NARRATOR_DARK, g, unit);
  const pose: FigPose = {view: 'front', face, light, ...(o.crouch ? {crouch: o.crouch} : {}), ...(o.nod ? {nod: o.nod} : {}), ...arms};
  return drawFigure(p, NARRATOR_DARK, g, unit, pose, t);
};

/** The narrator in profile (screen right) at ground point `g`, walking when `walk` is set (cycles); the kit swings the arms and legs. */
export const drawNarratorProfile = (p: Painter, g: Pt, unit: number, t: number, face: FaceState, light: InteriorLight | undefined, o: {walk?: number; crouch?: number; view?: 'right' | 'left'} = {}) => {
  const pose: FigPose = {view: o.view ?? 'right', face, light, ...(o.walk !== undefined ? {walk: o.walk} : {}), ...(o.crouch ? {crouch: o.crouch} : {}), ...(o.walk === undefined ? hangArms(NARRATOR_DARK, g, unit, o.crouch ?? 0, 'right') : {})};
  return drawFigure(p, NARRATOR_DARK, g, unit, pose, t);
};

/** The coworker (WFOG shopworker) behind the izakaya table: same rig, light and place as izakaya.tsx `paintCoworker`, with a face to choose. */
const COW_G = [0, 0, 2.0] as const;
const L_COW: InteriorLight = {key: [-0.25, -1], rim: [0.7, 0.8], rimScale: 0.3};
export const drawCoworker = (p: Painter, tl: number, face: FaceState) => {
  const g = roomP([...COW_G]), u = roomUnit(COW_G[2]);
  drawFigure(p, COWORKER, g, u, {view: 'front', face, light: L_COW, warm: 1, ...hangArms(COWORKER, g, u, 0, 'front')}, tl);
};
/** The coworker's head centre in plate px (the close-up focus): 1.503 m above her feet (1.70 m figure, rig constants). */
export const COW_HEAD: Pt = (() => {
  const g = roomP([...COW_G]);
  return [g[0], g[1] - 1.503 * roomUnit(COW_G[2])];
})();

/** The coworker's relief (CL01): eyes half-shut, a small smile, brows flat. The script's event reads it as relief, not teasing. */
export const COW_RELIEF: FaceState = {brow: 'flat', eyes: 'half', look: [0, 0.1], mouth: 'smile', squint: 0.35};
/** The rejected reading for comparison only: the same smile with one brow lifted and the eyes turned aside (sly, not relief). */
export const COW_SLY: FaceState = {brow: 'quirk', eyes: 'half', look: [-0.35, 0], mouth: 'smile', squint: 0.5};
/** The coworker telling the story (round 4 face, unchanged). */
export const COW_TALK: FaceState = {brow: 'flat', eyes: 'wide', look: [0, 0], mouth: 'talk', open: 0.55};
/**
 * The coworker's knowing half smile (S01-B02-SH04, user decision 1 Nov 2026): relief's flat brows and half-shut lids, the eyes a
 * touch aside (0.85 of COW_SLY's look), lids a little lower than relief. Still a smile for CL01. The mouth is `knowingMouth`.
 */
export const COW_KNOW: FaceState = {...COW_RELIEF, look: [COW_SLY.look[0] * 0.85, COW_RELIEF.look[1]], squint: 0.42, mouth: 'flat'};
/**
 * The full smile in head units (kit head decal, mouth line at v 0.6), user note 1 Nov 2026 round 3: a normal, natural smile, no
 * sneer. Both corners lift 0.1 (symmetric), the lips part only a thin crescent (0.08 at the centre). Top edge then bottom edge.
 */
const SMILE: Pt[] = [[-0.3, 0.5], [-0.15, 0.565], [0, 0.585], [0.15, 0.565], [0.3, 0.5], [0.27, 0.55], [0.17, 0.627], [0, 0.67], [-0.17, 0.627], [-0.27, 0.55]];
/**
 * The smile at progress `k` (0 neutral ... 1 the full smile). The shape covers the kit's flat mouth line: at k 0 it is a thin
 * closed line (the kit flat mouth, +-0.2 wide at v 0.6), then the corners widen and lift together and the lips part a little
 * (user note 1 Nov 2026: neutral at the start, slowly curls into the smile).
 */
export const knowingMouth = (k = 1): Pt[] => SMILE.map(([u, v]): Pt => [u * (0.67 + 0.33 * k), 0.6 + (v - 0.6) * (0.1 + 0.9 * k)]);
/** The kit's MOUTH colour (head.ts, not exported). */
const KNOW_MOUTH = '#3b2a24';
/** Smile progress of `S01-B02-SH04` at shot-local frame `lf`: neutral to f18, the full smile by f102, held to the end (138 f). */
export const smileAt = (lf: number): number => sstep((lf - 18) / 84);
/**
 * The coworker on the izakaya rig with `COW_KNOW`, the same rig, light and place as `drawCoworker`, at smile progress `k`. The
 * kit smile is symmetric and the kit is frozen, so the mouth is painted on the head decal over the kit's flat mouth line; the
 * lids close a little and two cheek creases appear as the smile grows.
 */
export const drawCoworkerKnowing = (p: Painter, tl: number, k = 1) => {
  const g = roomP([...COW_G]), u = roomUnit(COW_G[2]);
  const face: FaceState = {...COW_KNOW, squint: 0.24 + 0.18 * k};
  const a = drawFigure(p, COWORKER, g, u, {view: 'front', face, light: L_COW, warm: 1, ...hangArms(COWORKER, g, u, 0, 'front')}, tl);
  const K = (H / HEAD_SPAN) * u;
  const at = ([x, y]: Pt): Pt => [a.head[0] + x * K, a.head[1] + y * K];
  const mouth = knowingMouth(k).map(at);
  solid(p, COWORKER.seed * 1000 + 900, KNOW_MOUTH, mouth, 4, 0.02, 0.05);
  inkLine(p, COWORKER.seed * 1000 + 901, mouth, {weight: 1.0 + 0.4 * (1 - k), curve: 0.2, closed: true});
  if (k > 0.35) {
    // Two soft smile creases, mirrored (no one-sided curl).
    const crease = mixColor('#c79a7c', '#7a5240', clamp01((k - 0.35) / 0.4));
    for (const s of [-1, 1] as const) {
      inkLine(p, COWORKER.seed * 1000 + (s < 0 ? 902 : 903), [[s * (0.4 + 0.03 * k), 0.42], [s * (0.45 + 0.03 * k), 0.5], [s * (0.41 + 0.03 * k), 0.58]].map(([x, y]) => at([x, y])), {weight: 0.8, curve: 0.5, closed: false, color: crease});
    }
  }
};

/** The hand that hooks the mask's ear loop (S02-B03-SH02, VD07): the woman's right hand (screen left), a painted card. */
export const HAND_WOMAN: HandTone = {skin: '#dcb190', shade: '#b98a68', deep: '#9a6e52', nail: '#e9cdbd', crease: '#7f5a44', sleeve: '#c9b79a', sleeveShade: '#a89476'};
/** Pinch point (local hand units) that puts the index tip and thumb tip on `target`, for a hand at `wrist` pointing `dir`. */
export const pinchLocal = (wrist: Pt, dir: number, side: -1 | 1, size: number, target: Pt): Pt => {
  const dx = target[0] - wrist[0], dy = target[1] - wrist[1], fx = Math.cos(dir), fy = Math.sin(dir);
  return [(dx * fx + dy * fy) / size, (side * (dx * fy - dy * fx)) / size];
};
export const paintEarHook = (p: Painter, loop: Pt, t: number) => {
  // The hand rises from the lower left, forearm off the left frame edge; the index and thumb pinch the loop at `loop`.
  const wrist: Pt = [112, 700], elbow: Pt = [-140, 990], sleeveFrom: Pt = [-260, 1180];
  const size = 1.3, dir = Math.atan2(loop[1] - wrist[1], loop[0] - wrist[0]);
  const curl = 0.42 + 0.06 * Math.sin(t * 2);
  paintPovHand(p, {side: -1, base: 6_610_000, wrist, dir, size, curl, spread: 0.35, pinch: pinchLocal(wrist, dir, -1, size, loop), pinchGap: 0.08, elbow, sleeveFrom, tone: HAND_WOMAN});
};

/** Lamp state of the street flicker (VD09): off for three frames, on, off for two, off for two more, then on for good. Pure in `lf`. */
export const LAMP_OFF: readonly (readonly [number, number])[] = [[0, 3], [9, 11], [22, 24]];
export const lampOn = (lf: number): number => (LAMP_OFF.some(([a, b]) => lf >= a && lf < b) ? 0 : 1);
/** Faint buzz in the lit lamp (veil opacity, 0..0.04), deterministic per frame. */
export const buzzVeil = (lf: number): number => 0.04 * hash(7000 + Math.round(lf));

/** Rotate the paint about `c` (plate px) by `angle` radians: the head tilt of a shot (the camera stays still). */
export const tilted = (p: Painter, c: Pt, angle: number, paint: () => void) => {
  if (angle === 0) return paint();
  const b: Brush = p.brush;
  b.push();
  b.translate(c[0], c[1]);
  b.rotate(angle);
  b.translate(-c[0], -c[1]);
  paint();
  b.pop();
};

/** Smoothstep on [0, 1] with clamping. */
export const sstep = (u: number) => {
  const x = clamp01(u);
  return x * x * (3 - 2 * x);
};

/** LF01 CAM-CLOSE push 1.00 -> 1.04 over the 195 f shot (S01-B01-SH01). Identity at frame 0. */
export const camCloseHook = (tl: number): Camera => pushCamera(tl, 6.5, {s0: 1, s1: 1.04, fx: 540, fy: 540});
/** S03-B02-SH02: the CAM-CLOSE pushes to 1.04 by f25, then eases back to 1.00 by f51 and holds (the last 15 f are the loop seam). */
export const camCloseReturn = (tl: number): Camera => {
  const lf = tl * 30;
  const s = 1 + 0.04 * (lf <= 25 ? sstep(lf / 25) : 1 - sstep((lf - 25) / 26));
  return {s, fx: 540, fy: 540, dx: 0, dy: 0};
};

/** The narrator's CU frame (CU_UNIT of space.ts, head centre y 579): the head 522 px tall, the shoulders in the caption band. */
export const NARR_CU_UNIT = 1229;
export const NARR_CU_Y = 579;
/** Ground point for a head centred at (540, NARR_CU_Y) at `unit`: 1.503 m (a 1.70 m head centre above the feet, rig constants). */
export const narrCuGround = (unit: number): Pt => [540, NARR_CU_Y + 1.503 * unit];
/** The street ground point for a figure at depth z (metres), on the street lens. */
export const streetGround = (x: number, z: number): Pt => streetP([x, 0, z]);
