import type {ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {CameraLayer, pushCamera, type Camera} from '../kit/camera';
import {hardFill, rectPts, type InteriorLight} from '../kit/draw';
import {Spot} from '../kit/glow';
import type {FaceState} from '../kit/head';
import {Grade, Grain} from '../kit/screen';
import type {PaintedShot, ShotContext} from '../shot';
import {CALM_FACE, REVEAL_FACE, WOMAN_LIGHT} from '../kuchisake/cast';
import {bandSlide, COW_HEAD, COW_RELIEF, buzzVeil, camCloseHook, camCloseReturn, drawCoworker, drawCoworkerKnowing, drawNarratorFront, lampOn, NARR_CU_UNIT, NARR_CU_Y, narrCuGround, paintCloseup, paintCuBack, PAPER, smileAt, sstep, TopGlow} from '../kuchisake/shot-art';
import {drawWomanNeckTilt, drawWomanTear, tearAt} from '../kuchisake/shot-woman';
import {drawCoworkerTelling} from '../kuchisake/coworker-tell';
import {freeLeftArm, maskGrip} from '../kuchisake/ghost-hand';
import {drawRunnerProfile} from '../kuchisake/runner';
import {talkOpen} from '../kuchisake/shot-motion';
import {paintWalkerBack} from '../kuchisake/walker-back';
import {camDark, darkRoomFigures, paintDarkRoomSet} from '../kuchisake/darkroom';
import {camIzakaya, paintIzakayaBack, paintLantern, paintNarrator, paintTable} from '../kuchisake/izakaya';
import {ColdGrade, LowerFalloff} from '../kuchisake/room-screen';
import {FPS, NARRATOR_DARK, PAPER_DARK, PAPER_ROOM, PICTURE_H, PICTURE_W, roomP, roomUnit} from '../kuchisake/rooms';
import {paintStreet, StreetGlow} from '../kuchisake/street';
import {camStreet, CU_GROUND, CU_HEAD_Y, CU_UNIT, streetP, streetUnit} from '../kuchisake/space';
import {HEAD_CENTRE_M} from '../kuchisake/space';

// KSO-EP01-SHORT shot plates: one PaintedShot per storyboard shot (brief KSO-BRIEF-FILM-R2.2, shot list; review rows SB-R2.2).
// Plate IDs `KSO-<short ID>` (for example `KSO-S02-B03-SH03`), served shot IDs `KSO-EP01-SHORT-<short ID>`. Timing lives in the
// timeline (Editor): `KSO_SHOT_INDEX` gives the frames each plate covers so Editor can wire `painted.shots[]` cues. Shot-local
// frame 0 is the shot's first frame. Look-defining code stays in src/painted/kuchisake/ (frozen look files untouched).

const W = PICTURE_W, Hh = PICTURE_H;
const LAMP_LIGHT: InteriorLight = WOMAN_LIGHT;
const NARR_CU: FaceState = {brow: 'worry', eyes: 'wide', look: [0, 0], mouth: 'flat'};
const NARR_CU_SQUINT: FaceState = {...NARR_CU, squint: -0.25};
const NARR_CU_TALK: FaceState = {brow: 'worry', eyes: 'half', look: [0, 0.05], mouth: 'talk', open: 0.3};
const NARR_GASP: FaceState = {brow: 'worry', eyes: 'wide', look: [0, 0], mouth: 'gasp'};
const NARR_GLANCE: FaceState = {brow: 'worry', eyes: 'wide', look: [-0.7, 0], mouth: 'flat'};
const NARR_DARK_CU: FaceState = {brow: 'worry', eyes: 'half', look: [-0.4, 0.6], mouth: 'flat'};
const NARR_TURN: FaceState = {brow: 'worry', eyes: 'half', look: [0, 0], mouth: 'flat'};
const L_DARK: InteriorLight = {key: [0.6, 0.35], rim: [0.9, 0.2], rimScale: 0.9};
const MS_FACE = CALM_FACE;

/** Shot overlays: the screen layers of the look files (falloff, glow, cold grade, grade and grain), in the same order. */
type Ov = ShotContext & {camera: Camera; opacity: number};
const Wrap = ({opacity, children}: {opacity: number; children: ReactNode}) => <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>{children}</AbsoluteFill>;

/** The street lens (LF02): lamp cone, lower-frame falloff; `lamp` 0..1 flickers the cone and the set, `veil` adds the buzz. */
const StreetOv = ({camera, opacity, lamp = 1, veil = 0, from = 760, peak = 0.62}: Ov & {lamp?: number; veil?: number; from?: number; peak?: number}) => (
  <Wrap opacity={opacity}>
    <CameraLayer camera={camera} width={W} height={Hh} opacity={lamp}>
      <StreetGlow />
    </CameraLayer>
    <LowerFalloff from={from} peak={peak} />
    {(1 - lamp) * 0.7 + veil > 0 && <AbsoluteFill style={{background: '#05080c', opacity: Math.min(0.85, (1 - lamp) * 0.7 + veil)}} />}
    <Grade />
    <Grain />
  </Wrap>
);
/** The reveal close-ups (LF03): the lamp from above, the falloff that keeps the caption band quiet. */
const CuOv = ({camera, opacity, from = 840, to = 1060, peak = 0.85}: Ov & {from?: number; to?: number; peak?: number}) => (
  <Wrap opacity={opacity}>
    <CameraLayer camera={camera} width={W} height={Hh}>
      <TopGlow />
    </CameraLayer>
    <LowerFalloff from={from} to={to} peak={peak} />
    <Grade />
    <Grain />
  </Wrap>
);
/** The mask close-up (LF01): falloff from y 760, grade and grain. */
const CloseOv = ({opacity}: Ov) => (
  <Wrap opacity={opacity}>
    <LowerFalloff from={760} peak={0.62} />
    <Grade />
    <Grain />
  </Wrap>
);
/** The izakaya (LF04): table lantern and wall lanterns, the lower falloff; `cold` adds the cold grade of the cut-in. */
const IzakayaOv = ({camera, opacity, cold = 0, from = 840, peak = 0.6}: Ov & {cold?: number; from?: number; peak?: number}) => {
  const [lx, ly] = roomP([0.2, 0.92, 2.4]), [nx, ny] = roomP([-0.62, 2.0, 1.5]), [mx, my] = roomP([0.72, 2.0, 1.5]);
  return (
    <Wrap opacity={opacity}>
      <CameraLayer camera={camera} width={PICTURE_W} height={PICTURE_H}>
        <Spot x={lx} y={ly} r={520} level={0.3} color="#ff9a3c" />
        <Spot x={nx} y={ny} r={200} level={0.25} color="#ff9a3c" />
        <Spot x={mx} y={my} r={200} level={0.25} color="#ff9a3c" />
      </CameraLayer>
      <LowerFalloff from={from} to={1080} peak={peak} />
      {cold > 0 && <AbsoluteFill style={{background: '#8fa9c4', mixBlendMode: 'multiply', opacity: cold, pointerEvents: 'none'}} />}
      <Grade />
      <Grain />
    </Wrap>
  );
};
/** The dark room (LF05): the lower falloff and the cold grade. */
const DarkOv = ({opacity, from = 800, peak = 0.5}: Ov & {from?: number; peak?: number}) => (
  <Wrap opacity={opacity}>
    <LowerFalloff from={from} peak={peak} />
    <ColdGrade opacity={0.16} />
    <Grade />
    <Grain />
  </Wrap>
);

// ---- Shared geometry -------------------------------------------------------------------------------------------------------

/** The woman's full-length street plate (LF02, 300 px/m at the lamp foot). */
const G0 = streetP([0, 0, 0]);
/** The head-hero size (S02-B03-SH05): 311 px per head unit keeps the grin above the caption band (y 860). */
const HERO_UNIT = 1663;
const HERO_HEAD: [number, number] = [540, 600];
const HERO_G: [number, number] = [540, HERO_HEAD[1] + HEAD_CENTRE_M * HERO_UNIT];
/** The free left arm of the ghost in the close-ups (P06 shrug_palms_up reach, metres from the shoulder): S02-B03-SH02 end, SH03 end. */
const LEFT_UP: [number, number] = [0.27, -0.06], LEFT_UP2: [number, number] = [0.34, 0.06];
/** Mask state of the close shot S02-B03-SH02: worn until the mouth is clear; drop begins after the hook (f6). */
export const maskHook = (lf: number) => 0.13 * sstep((lf - 6) / 30);
/** Mask state of the reveal S02-B03-SH03: the mask leaves the mouth at f0 (m 0.15) and is out of frame by f8. */
export const maskReveal = (lf: number) => 0.15 + 0.85 * sstep(lf / 8);
/**
 * The walking narrator (S02-B01-SH01, user note 1 Nov 2026): she walks away from the camera up the street axis (south to north, seen
 * from behind), from z 2.8 m (742 px/m, whole figure in frame) to z 0.8 m (362 px/m, 615 px) over 4.3 s, 2.5 gait cycles.
 * S02-B01-SH02 stands her at the end point.
 */
export const WALK_Z0 = 2.8, WALK_Z1 = 0.8, WALK_CYCLES = 2.5;
export const walkZ = (t: number) => WALK_Z0 + (WALK_Z1 - WALK_Z0) * Math.min(1, Math.max(0, t / 4.3));
/** Shot start frame (timeline) of a plate: the speech envelope is read at the global frame. */
const startOf = (id: string) => (SHOT_ROWS.find((r) => r[0] === id) ?? [id, 0, 0])[1];
/** Mouth opening at shot-local frame `f` of shot `id` (amplitude of the locked narration at the timeline frame). */
const openAt = (id: string, f: number, max?: number) => talkOpen(startOf(id) + f, max);

/** Plate helpers. `f` is the shot-local frame. */
const f_of = (tl: number) => Math.round(tl * FPS);

/** One plate per storyboard shot. */
const shot = (id: string, o: Omit<PaintedShot, 'id' | 'serves'>): PaintedShot => ({id: `KSO-${id}`, serves: [`KSO-EP01-SHORT-${id}`], ...o});

export const kuchisakeShots: PaintedShot[] = [
  // S01-B01 hook: LF01 close, the push 1.00 -> 1.04 over 195 f.
  shot('S01-B01-SH01', {paper: PAPER, camera: camCloseHook, paint: (p, ctx) => {
      // The finger already on the strap (the LF01 skin card) pushes the band down 230 px (f25-175); no second hand (user, round 3).
      paintCloseup(p, bandSlide(f_of(ctx.tl)), true);
    },
    Overlay: CloseOv,
  }),

  // S01-B02 izakaya: LF04 as approved (coworker, lantern, narrator from behind), push 1.00 -> 1.05 over 162 f.
  shot('S01-B02-SH01', {
    paper: PAPER_ROOM,
    camera: camIzakaya,
    paint: (p, ctx) => {
      paintIzakayaBack(p);
      drawCoworkerTelling(p, ctx.tl, startOf('S01-B02-SH01') + f_of(ctx.tl));
      paintTable(p);
      paintLantern(p);
      paintNarrator(p);
    },
    Overlay: IzakayaOv,
  }),
  // The coworker tells the story with her hands (P06 base, lifting on the speech), waist-up behind the table (no narrator in frame).
  shot('S01-B02-SH02', {
    paper: PAPER_ROOM,
    camera: camIzakaya,
    paint: (p, ctx) => {
      paintIzakayaBack(p);
      drawCoworkerTelling(p, ctx.tl, startOf('S01-B02-SH02') + f_of(ctx.tl));
      paintTable(p);
      paintLantern(p);
    },
    Overlay: IzakayaOv,
  }),
  // The narrator's nape and shoulder from behind (new crop of narrator-back.ts), the coworker small beyond.
  shot('S01-B02-SH03', {
    paper: PAPER_ROOM,
    camera: (tl) => pushCamera(tl, 3.53, {s0: 1.45, s1: 1.6, fx: 188, fy: 691}),
    paint: (p, ctx) => {
      paintIzakayaBack(p);
      drawCoworkerTelling(p, ctx.tl, startOf('S01-B02-SH03') + f_of(ctx.tl), {still: true});
      paintTable(p);
      paintLantern(p);
      paintNarrator(p);
    },
    Overlay: (props) => <IzakayaOv {...props} from={760} peak={0.85} />,
  }),
  // The coworker's knowing half smile after the telling (CL01 relief, one corner up; user decision 1 Nov 2026): close on the head.
  shot('S01-B02-SH04', {
    paper: PAPER_ROOM,
    camera: (tl) => pushCamera(tl, 4.6, {s0: 1, s1: 1.35, fx: COW_HEAD[0], fy: COW_HEAD[1]}),
    paint: (p, ctx) => {
      paintIzakayaBack(p);
      drawCoworkerKnowing(p, ctx.tl, smileAt(f_of(ctx.tl)));
      paintTable(p);
      paintLantern(p);
    },
    Overlay: (props) => <IzakayaOv {...props} from={760} peak={0.85} />,
  }),

  // S02-B01 street: the narrator walks away from the camera up the street axis, seen from behind (walker-back.ts), a slow drift.
  shot('S02-B01-SH01', {
    paper: PAPER,
    camera: (tl) => pushCamera(tl, 4.3, {s0: 1, s1: 1.03, fx: 540, fy: 880}),
    paint: (p, ctx) => {
      paintStreet(p);
      const z = walkZ(ctx.tl);
      paintWalkerBack(p, NARRATOR_DARK, streetP([0, 0, z]), streetUnit(z), LAMP_LIGHT, ctx.tl, {walk: WALK_CYCLES * Math.min(1, ctx.tl / 4.3)});
    },
    Overlay: StreetOv,
  }),
  // The narrator stops (the gait settles over 12 f) and turns her head to the side, curious: profile to screen left, the body still from behind.
  shot('S02-B01-SH02', {
    paper: PAPER,
    camera: (tl) => pushCamera(tl, 2.5, {s0: 1, s1: 1.05, fx: 540, fy: 880}),
    paint: (p, ctx) => {
      paintStreet(p);
      const f = f_of(ctx.tl);
      const settle = WALK_CYCLES + 0.5 * sstep(f / 12);
      paintWalkerBack(p, NARRATOR_DARK, streetP([0, 0, WALK_Z1]), streetUnit(WALK_Z1), LAMP_LIGHT, ctx.tl, {walk: f < 12 ? settle : undefined, turn: sstep((f - 22) / 10), face: NARR_GLANCE});
    },
    Overlay: StreetOv,
  }),
  // Her point of view back down the street: empty, the wires, one far light.
  shot('S02-B01-SH03', {
    paper: PAPER,
    camera: (tl) => pushCamera(tl, 2.33, {s0: 1, s1: 1.03, fx: 540, fy: 600}),
    paint: (p) => paintStreet(p),
    Overlay: StreetOv,
  }),
  // The streetlight flickers (VD09); the woman is first lit at f32 and stands in the cone from then on.
  shot('S02-B01-SH04', {
    paper: PAPER,
    camera: (tl) => pushCamera(tl, 6.33, {s0: 1, s1: 1.05, fx: 540, fy: 880}),
    paint: (p, ctx) => {
      paintStreet(p);
      if (f_of(ctx.tl) >= 32) drawWomanTear(p, G0, streetUnit(0), ctx.tl, 0);
    },
    Overlay: (props) => {
      const lamp = lampOn(f_of(props.tl));
      return <StreetOv {...props} lamp={lamp} veil={lamp ? buzzVeil(f_of(props.tl)) : 0} />;
    },
  }),

  // S02-B02: the woman under the lamp, full length (LF02 as painted; the push is the look's own).
  shot('S02-B02-SH01', {
    paper: PAPER,
    camera: camStreet,
    paint: (p, ctx) => {
      paintStreet(p);
      drawWomanTear(p, G0, streetUnit(0), ctx.tl, 0, LAMP_LIGHT, CALM_FACE);
    },
    Overlay: StreetOv,
  }),
  // The narrator's lips pressed, eyes wide (CU).
  shot('S02-B02-SH02', {
    paper: PAPER,
    camera: (tl) => pushCamera(tl, 1.53, {s0: 1, s1: 1.04, fx: 540, fy: NARR_CU_Y}),
    paint: (p, ctx) => {
      paintCuBack(p);
      drawNarratorFront(p, narrCuGround(NARR_CU_UNIT), NARR_CU_UNIT, ctx.tl, NARR_CU, LAMP_LIGHT);
    },
    Overlay: CuOv,
  }),
  // The woman steps in to a close-up of her masked face (user decision 1 Nov 2026): the reveal's CU lens (CU_GROUND, head 522 px,
  // centre y 579), the CU backdrop of the narrator close-ups either side, a push 1.00 -> 1.06 about the face. Same pose, calm face.
  // The fixed -40 px camera offset lifts the mask's lower edge (v 1.27) from the caption band (y 860) for the whole push.
  shot('S02-B02-SH03', {
    paper: PAPER,
    camera: (tl) => ({...pushCamera(tl, 2.9, {s0: 1, s1: 1.06, fx: 540, fy: CU_HEAD_Y}), dy: -40}),
    paint: (p, ctx) => {
      paintCuBack(p);
      drawWomanTear(p, CU_GROUND, CU_UNIT, ctx.tl, 0, LAMP_LIGHT, CALM_FACE);
    },
    // The beige shoulders now reach the band: a steeper falloff from the mask's lower edge (850) to 960 keeps the band quiet.
    Overlay: (props) => <CuOv {...props} from={850} to={960} peak={0.95} />,
  }),
  // The narrator's silent reaction (no voice, no caption): the S02-B02-SH02 art, the eyes one notch wider.
  shot('S02-B02-SH05', {
    paper: PAPER,
    camera: (tl) => pushCamera(tl, 0.8, {s0: 1, s1: 1.03, fx: 540, fy: NARR_CU_Y}),
    paint: (p, ctx) => {
      paintCuBack(p);
      drawNarratorFront(p, narrCuGround(NARR_CU_UNIT), NARR_CU_UNIT, ctx.tl, NARR_CU_SQUINT, LAMP_LIGHT);
    },
    Overlay: CuOv,
  }),

  // S02-B03: the slip, the hook, the tear, the head.
  shot('S02-B03-SH01', {
    paper: PAPER,
    camera: (tl) => pushCamera(tl, 2.03, {s0: 1, s1: 1.03, fx: 540, fy: NARR_CU_Y}),
    paint: (p, ctx) => {
      paintCuBack(p);
      drawNarratorFront(p, narrCuGround(NARR_CU_UNIT), NARR_CU_UNIT, ctx.tl, NARR_GASP, LAMP_LIGHT);
    },
    Overlay: CuOv,
  }),
  // The right hand holds the mask's left edge (fingers and thumb on it) and pulls it down; the free left arm rises (P12 / P06 base).
  shot('S02-B03-SH02', {
    paper: PAPER,
    camera: (tl) => pushCamera(tl, 1.2, {s0: 1, s1: 1.12, fx: 540, fy: 560}),
    paint: (p, ctx) => {
      paintCuBack(p);
      const f = f_of(ctx.tl), m = maskHook(f);
      const grip = maskGrip(CU_GROUND, CU_UNIT, m);
      drawWomanTear(p, CU_GROUND, CU_UNIT, ctx.tl, m, LAMP_LIGHT, CALM_FACE, undefined, {rArm: grip.rArm, lArm: freeLeftArm(CU_GROUND, CU_UNIT, LEFT_UP, f / 36)}, true);
      grip.paintHand(p);
    },
    Overlay: (props) => <CuOv {...props} from={800} peak={Math.min(1, 0.85 + 0.6 * (1 - maskHook(f_of(props.tl))))} />,
  }),
  // The reveal (LF03): the mouth tears open over 12 f and holds; the camera is still.
  shot('S02-B03-SH03', {
    paper: PAPER,
    camera: (tl) => pushCamera(tl, 1, {s0: 1, s1: 1, fx: 540, fy: 579}),
    paint: (p, ctx) => {
      paintCuBack(p);
      const f = f_of(ctx.tl);
      // The hand yanks the mask down with it for 3 frames, then lets go and falls to a relaxed hand; the left arm keeps rising.
      const grip = maskGrip(CU_GROUND, CU_UNIT, maskReveal(Math.min(f, 3)), {hold: 1 - sstep((f - 3) / 6), relaxed: [-0.34, -0.12]});
      drawWomanTear(p, CU_GROUND, CU_UNIT, ctx.tl, maskReveal(f), LAMP_LIGHT, REVEAL_FACE, tearAt(f), {rArm: grip.rArm, lArm: freeLeftArm(CU_GROUND, CU_UNIT, LEFT_UP2, f / 20, LEFT_UP)}, true);
      grip.paintHand(p);
    },
    Overlay: (props) => <CuOv {...props} peak={Math.min(1, 0.85 + 0.6 * (1 - maskReveal(f_of(props.tl))))} />,
  }),
  // The narrator's eyes, tight: she is not shown with the mouth again here.
  shot('S02-B03-SH04', {
    paper: PAPER,
    camera: (tl) => pushCamera(tl, 3.2, {s0: 1.3, s1: 1.6, fx: 540, fy: 567}),
    paint: (p, ctx) => {
      paintCuBack(p);
      drawNarratorFront(p, narrCuGround(NARR_CU_UNIT), NARR_CU_UNIT, ctx.tl, NARR_CU, LAMP_LIGHT);
    },
    Overlay: (props) => <CuOv {...props} from={800} peak={0.95} />,
  }),
  // The woman's head is the hero of the frame; head and neck tilt on `ยังสวยอยู่ไหม` (f58, about the neck, shoulders still), the grin static.
  shot('S02-B03-SH05', {
    paper: PAPER,
    camera: (tl) => pushCamera(tl, 1, {s0: 1, s1: 1, fx: 540, fy: 600}),
    paint: (p, ctx) => {
      paintCuBack(p);
      const f = f_of(ctx.tl);
      const angle = -0.12 * sstep((f - 58) / 24);
      drawWomanNeckTilt(p, HERO_G, HERO_UNIT, ctx.tl, angle, LAMP_LIGHT, REVEAL_FACE);
    },
    Overlay: (props) => <CuOv {...props} from={800} peak={0.95} />,
  }),
  // The narrator, breathless and deliberate (CU).
  shot('S02-B03-SH06', {
    paper: PAPER,
    camera: (tl) => pushCamera(tl, 2.07, {s0: 1, s1: 1.04, fx: 540, fy: NARR_CU_Y}),
    paint: (p, ctx) => {
      paintCuBack(p);
      drawNarratorFront(p, narrCuGround(NARR_CU_UNIT), NARR_CU_UNIT, ctx.tl, {...NARR_CU_TALK, open: openAt('S02-B03-SH06', f_of(ctx.tl), 0.4)}, LAMP_LIGHT);
    },
    Overlay: CuOv,
  }),

  // S03-B01: the run, the door, the coworker's relief, the pass-on sentence.
  // The woman stands frozen on the street; the figure no longer tilts. She puts the mask back over her face: the right hand lifts it
  // from below the mouth (m 0.55, grin showing) to worn (f8-34), then the arm falls. Optional beat (user note), kept short.
  shot('S03-B01-SH01', {
    paper: PAPER,
    camera: (tl) => pushCamera(tl, 1.83, {s0: 1, s1: 1.03, fx: 540, fy: 880}),
    paint: (p, ctx) => {
      paintStreet(p);
      const f = f_of(ctx.tl), m = 0.55 * (1 - sstep((f - 8) / 26)), u = streetUnit(0);
      const grip = maskGrip(G0, u, m, {hold: 1 - sstep((f - 36) / 10), relaxed: [-0.07, -0.5]});
      drawWomanTear(p, G0, u, ctx.tl, m, LAMP_LIGHT, f < 30 ? REVEAL_FACE : MS_FACE, undefined, {rArm: grip.rArm, lArm: freeLeftArm(G0, u, [0.045, -0.518], 0)}, true);
      grip.paintHand(p);
    },
    Overlay: StreetOv,
  }),
  // Three inserts in one shot: feet running (f0-27), the wires tilt up (f28-55), the door (f56-82).
  shot('S03-B01-SH02', {
    paper: PAPER,
    camera: (tl) => {
      const f = f_of(tl);
      if (f < 28) return {s: 1, fx: 540, fy: 540, dx: 0, dy: 0};
      if (f < 56) return {s: 1, fx: 540, fy: 540, dx: 0, dy: 1100 - 500 * sstep((f - 28) / 27)};
      return pushCamera(tl - 56 / FPS, 0.9, {s0: 1, s1: 1.08, fx: 540, fy: 1000});
    },
    paint: (p, ctx) => {
      const f = f_of(ctx.tl);
      if (f < 28) {
        hardFill(p, 6_720_001, '#0f1a2b', rectPts(-300, 1520, 1380, 2220));
        hardFill(p, 6_720_002, '#1b2a3d', rectPts(-300, 1480, 1380, 1520));
        // A run: cadence 0.065 cycles/f, torso lean, both arms swinging +-0.95 rad with the elbows bent, a hop in the flight phase.
        drawRunnerProfile(p, NARRATOR_DARK, [540, 1600], 1000, ctx.tl, f * 0.065, {brow: 'worry', eyes: 'wide', look: [0.4, 0], mouth: 'gasp'}, LAMP_LIGHT);
      } else if (f < 56) {
        paintStreet(p);
      } else {
        paintDarkRoomSet(p);
      }
    },
    Overlay: (props) => (props.tl * FPS >= 56 ? <DarkOv {...props} /> : <StreetOv {...props} />),
  }),
  // The dark room: she slides down the door (LF05 as approved).
  shot('S03-B01-SH03', {
    paper: PAPER_DARK,
    camera: camDark,
    paint: (p, ctx) => {
      paintDarkRoomSet(p);
      darkRoomFigures(p, ctx.tl);
    },
    Overlay: DarkOv,
  }),
  // The coworker's relieved smile, cut in on `ว่าทำไมเพื่อนถึงโล่งใจ`, cold-graded.
  shot('S03-B01-SH04', {
    paper: PAPER_ROOM,
    camera: (tl) => pushCamera(tl, 1.8, {s0: 1, s1: 1.35, fx: COW_HEAD[0], fy: COW_HEAD[1]}),
    paint: (p, ctx) => {
      paintIzakayaBack(p);
      drawCoworker(p, ctx.tl, COW_RELIEF);
      paintTable(p);
      paintLantern(p);
    },
    Overlay: (props) => <IzakayaOv {...props} cold={0.45} from={760} peak={0.85} />,
  }),
  // The narrator facing the camera, crouched as in LF05, eyes down and aside, zoomed in 2.2 -> 2.4 so she fills the frame (user note).
  shot('S03-B01-SH05', {
    paper: PAPER_DARK,
    camera: (tl) => pushCamera(tl, 4.97, {s0: 2.2, s1: 2.4, fx: 540, fy: 860}),
    paint: (p, ctx) => {
      paintDarkRoomSet(p);
      drawNarratorFront(p, roomP([0, 0, 1.7]), roomUnit(1.7), ctx.tl, NARR_DARK_CU, L_DARK, {crouch: 0.8, nod: [0, 0.1], hang: true});
    },
    Overlay: (props) => <DarkOv {...props} from={760} peak={0.85} />,
  }),

  // S03-B02: the narrator turns to the lens, crouched; then the close with the loop seam.
  shot('S03-B02-SH01', {
    paper: PAPER_DARK,
    camera: (tl) => pushCamera(tl, 3.1, {s0: 1, s1: 1.06, fx: 540, fy: 700}),
    paint: (p, ctx) => {
      paintDarkRoomSet(p);
      drawNarratorFront(p, roomP([0, 0, 1.7]), roomUnit(1.7), ctx.tl, NARR_TURN, L_DARK, {crouch: 0.8, nod: [0, 0.1], hang: true});
    },
    Overlay: DarkOv,
  }),
  shot('S03-B02-SH02', {paper: PAPER, camera: camCloseReturn, paint: (p) => paintCloseup(p), Overlay: CloseOv}),
];

/** Shot index for Editor (stable IDs, timeline order, frames at 30 fps; `end` exclusive). Source: review rows SB-R2.2 and the brief. */
const SHOT_ROWS: readonly (readonly [string, number, number])[] = [
  ['S01-B01-SH01', 0, 195], ['S01-B02-SH01', 195, 357], ['S01-B02-SH02', 357, 512], ['S01-B02-SH03', 512, 618], ['S01-B02-SH04', 618, 756],
  ['S02-B01-SH01', 756, 885], ['S02-B01-SH02', 885, 960], ['S02-B01-SH03', 960, 1030], ['S02-B01-SH04', 1030, 1220],
  ['S02-B02-SH01', 1220, 1300], ['S02-B02-SH02', 1300, 1346], ['S02-B02-SH03', 1346, 1433], ['S02-B02-SH05', 1433, 1457],
  ['S02-B03-SH01', 1457, 1518], ['S02-B03-SH02', 1518, 1554], ['S02-B03-SH03', 1554, 1584], ['S02-B03-SH04', 1584, 1680],
  ['S02-B03-SH05', 1680, 1808], ['S02-B03-SH06', 1808, 1870],
  ['S03-B01-SH01', 1870, 1925], ['S03-B01-SH02', 1925, 2008], ['S03-B01-SH03', 2008, 2092], ['S03-B01-SH04', 2092, 2146], ['S03-B01-SH05', 2146, 2295],
  ['S03-B02-SH01', 2295, 2388], ['S03-B02-SH02', 2388, 2461],
];
export const KSO_SHOT_INDEX = SHOT_ROWS.map(([id, start, end]) => ({id, plate: `KSO-${id}`, start, end, serves: `KSO-EP01-SHORT-${id}`}));
