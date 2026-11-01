import {useId, type ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {CameraLayer, pushCamera, type Camera} from '../kit/camera';
import {hardFill, rectPts, type InteriorLight} from '../kit/draw';
import {Spot} from '../kit/glow';
import type {FaceState} from '../kit/head';
import type {Pt} from '../kit/painter';
import {Grade, Grain} from '../kit/screen';
import type {PaintedShot, ShotContext} from '../shot';
import {CALM_FACE, REVEAL_FACE, WOMAN_LIGHT} from '../kuchisake/cast';
import {bandSlide, COW_HEAD, COW_RELIEF, buzzVeil, camCloseHook, camCloseReturn, drawCoworker, drawCoworkerKnowing, drawNarratorFront, lampOn, NARR_CU_UNIT, NARR_CU_Y, narrCuGround, paintCloseup, paintCuBack, PAPER, smileAt, sstep, TopGlow} from '../kuchisake/shot-art';
import {drawWomanNeckTilt, drawWomanTear, tearAt, type Tear} from '../kuchisake/shot-woman';
import {drawCoworkerTelling, paintGlassGrip} from '../kuchisake/coworker-tell';
import {hangLeftArm, maskGrip} from '../kuchisake/ghost-hand';
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

/** Shot overlays: the screen layers of the look files (falloff, glow, cold grade, grade and grain), in the same order. */
type Ov = ShotContext & {camera: Camera; opacity: number};
/**
 * Caption-band shade (round 11): a second, deeper step of the lamp falloff from `from` to `to` (plate px, screen space), drawn
 * before the grade. It keeps the lit counter or the pale mask under the chin out of the caption band (y 860-1248) where the
 * look's own falloff is not enough; `peak` 0 draws nothing, so a shot can fade it in and out with its motion.
 */
type Shade = {from: number; to: number; peak: number};
const BandShade = ({shade}: {shade?: Shade}) => (shade && shade.peak > 0 ? <LowerFalloff from={shade.from} to={shade.to} peak={shade.peak} /> : null);
const Wrap = ({opacity, children}: {opacity: number; children: ReactNode}) => <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>{children}</AbsoluteFill>;

/**
 * The street lens (LF02): lamp cone, lower-frame falloff; `lamp` 0..1 flickers the cone and the set, `veil` adds the buzz.
 * `hole` (plate px) cuts a figure that stands between the lens and the lamp out of the cone and pool (soft-edged), so the light
 * falls behind her instead of washing over her (S02-B01-SH01/SH02, round 3); `glow` false drops the cone (a set without the lamp).
 */
const StreetOv = ({camera, opacity, lamp = 1, veil = 0, from = 760, peak = 0.62, hole, glow = true}: Ov & {lamp?: number; veil?: number; from?: number; peak?: number; hole?: Pt[]; glow?: boolean}) => {
  const id = useId().replace(/:/g, '');
  return (
    <Wrap opacity={opacity}>
      {glow && (
        <CameraLayer camera={camera} width={W} height={Hh} opacity={lamp}>
          {hole ? (
            <>
              <defs>
                <filter id={`${id}b`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation={6} />
                </filter>
                <mask id={`${id}m`} maskUnits="userSpaceOnUse" x={-600} y={-600} width={2400} height={3200}>
                  <rect x={-600} y={-600} width={2400} height={3200} fill="white" />
                  <polygon points={hole.map(([x, y]) => `${x},${y}`).join(' ')} fill="black" filter={`url(#${id}b)`} />
                </mask>
              </defs>
              <g mask={`url(#${id}m)`}>
                <StreetGlow />
              </g>
            </>
          ) : (
            <StreetGlow />
          )}
        </CameraLayer>
      )}
      <LowerFalloff from={from} peak={peak} />
      {(1 - lamp) * 0.7 + veil > 0 && <AbsoluteFill style={{background: '#05080c', opacity: Math.min(0.85, (1 - lamp) * 0.7 + veil)}} />}
      <Grade />
      <Grain />
    </Wrap>
  );
};
/** Back-view silhouette of the walking narrator (m: u right, v up from the feet), a little inside her outline: hair, shoulders and arms, legs. */
const WALKER_SIL: Pt[] = [[0, 1.73], [0.17, 1.69], [0.225, 1.52], [0.225, 1.25], [0.2, 1.15], [0.22, 0.76], [0.14, 0.7], [0.13, 0.03], [-0.13, 0.03], [-0.14, 0.7], [-0.22, 0.76], [-0.2, 1.15], [-0.225, 1.25], [-0.225, 1.52], [-0.17, 1.69]];
const walkerHole = (z: number): Pt[] => {
  const [gx, gy] = streetP([0, 0, z]), u = streetUnit(z);
  return WALKER_SIL.map(([x, y]): Pt => [gx + x * u, gy - y * u]);
};
/** The reveal close-ups (LF03): the lamp from above, the falloff that keeps the caption band quiet. */
const CuOv = ({camera, opacity, from = 840, to = 1060, peak = 0.85, shade}: Ov & {from?: number; to?: number; peak?: number; shade?: Shade}) => (
  <Wrap opacity={opacity}>
    <CameraLayer camera={camera} width={W} height={Hh}>
      <TopGlow />
    </CameraLayer>
    <LowerFalloff from={from} to={to} peak={peak} />
    <BandShade shade={shade} />
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
const IzakayaOv = ({camera, opacity, cold = 0, from = 840, peak = 0.6, shade}: Ov & {cold?: number; from?: number; peak?: number; shade?: Shade}) => {
  const [lx, ly] = roomP([0.2, 0.92, 2.4]), [nx, ny] = roomP([-0.62, 2.0, 1.5]), [mx, my] = roomP([0.72, 2.0, 1.5]);
  return (
    <Wrap opacity={opacity}>
      <CameraLayer camera={camera} width={PICTURE_W} height={PICTURE_H}>
        <Spot x={lx} y={ly} r={520} level={0.3} color="#ff9a3c" />
        <Spot x={nx} y={ny} r={200} level={0.25} color="#ff9a3c" />
        <Spot x={mx} y={my} r={200} level={0.25} color="#ff9a3c" />
      </CameraLayer>
      <LowerFalloff from={from} to={1080} peak={peak} />
      <BandShade shade={shade} />
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
/** Mask state of the close shot S02-B03-SH02: worn until the mouth is clear; drop begins after the hook (f6). */
export const maskHook = (lf: number) => 0.13 * sstep((lf - 6) / 30);
/** Mask state of the reveal S02-B03-SH03: the mask leaves the mouth at f0 (m 0.15) and is out of frame by f8. */
export const maskReveal = (lf: number) => 0.15 + 0.85 * sstep(lf / 8);
/**
 * The grin closing back to a plain mouth in S03-B01-SH01 (round 4, user): the full grin holds to f10, the jaw shuts over f10-34,
 * then the corners draw in over f20-46. Round 5 (user: black strokes by the nose as the mouth closes): the pre-tear closed line
 * sat at the nose height (v 0.33), above the kit's plain mouth (v 0.6), so `rest` slides the mouth down and narrows it onto the
 * kit mouth: down with the jaw over f10-36, narrowed by the corners to f46; from f46 only the kit's normal flat mouth is painted,
 * held to the cut (f54).
 */
export const grinCloseAt = (lf: number): Tear => ({corner: 1 - sstep((lf - 20) / 26), open: 1 - sstep((lf - 10) / 24), rest: sstep((lf - 10) / 26)});
/**
 * The walking narrator (S02-B01-SH01, user note 1 Nov 2026): she walks away from the camera up the street axis (south to north, seen
 * from behind), from z 2.8 m (742 px/m, whole figure in frame) to z 0.8 m (362 px/m, 615 px) over 4.3 s, 2.5 gait cycles.
 * S02-B01-SH02 stands her at the end point.
 */
export const WALK_Z0 = 2.8, WALK_Z1 = 0.8, WALK_CYCLES = 2.5;
export const walkZ = (t: number) => WALK_Z0 + (WALK_Z1 - WALK_Z0) * Math.min(1, Math.max(0, t / 4.3));
/** Shot start frame (timeline) of a plate: the speech envelope is read at the global frame. */
/** Round 11 caption-band shades (plate px; see `BandShade`). */
const SHADE_SH03: Shade = {from: 780, to: 880, peak: 0.19};
const CHIN_SHADE = {from: 800, to: 890};
const chinShade = (lf: number): Shade => ({...CHIN_SHADE, peak: 0.36 * sstep((lf - 12) / 12)});
const revealShade = (lf: number): Shade => ({...CHIN_SHADE, peak: 0.38 * (1 - sstep((lf - 1) / 5))});

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
  // The coworker talks with her arms close to the body (P01, round 4), waist-up behind the table (no narrator in frame).
  shot('S01-B02-SH02', {
    paper: PAPER_ROOM,
    camera: camIzakaya,
    paint: (p, ctx) => {
      paintIzakayaBack(p);
      drawCoworkerTelling(p, ctx.tl, startOf('S01-B02-SH02') + f_of(ctx.tl), {arms: 'hang'});
      paintTable(p);
      paintLantern(p);
    },
    Overlay: IzakayaOv,
  }),
  // The narrator's nape and shoulder from behind (new crop of narrator-back.ts), the coworker small beyond: she reaches for
  // the beer glass (f14-40) and holds it, the other arm at her side (round 4).
  shot('S01-B02-SH03', {
    paper: PAPER_ROOM,
    camera: (tl) => pushCamera(tl, 3.53, {s0: 1.45, s1: 1.6, fx: 188, fy: 691}),
    paint: (p, ctx) => {
      paintIzakayaBack(p);
      drawCoworkerTelling(p, ctx.tl, startOf('S01-B02-SH03') + f_of(ctx.tl), {arms: 'glass', f: f_of(ctx.tl)});
      paintTable(p);
      paintGlassGrip(p, f_of(ctx.tl));
      paintLantern(p);
      paintNarrator(p);
    },
    // Round 11: the counter's front edge and the lantern's lower glow fall off a step earlier (caption band), the whole shot.
    Overlay: (props) => <IzakayaOv {...props} from={760} peak={0.85} shade={SHADE_SH03} />,
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
    // Round 11: as the push brings the counter and the lantern glow down into the caption band (from about f60), the same
    // counter-edge shade as S01-B02-SH03 comes in with it.
    Overlay: (props) => <IzakayaOv {...props} from={760} peak={0.85} shade={{...SHADE_SH03, peak: SHADE_SH03.peak * sstep((f_of(props.tl) - 40) / 35)}} />,
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
    // She walks toward the lamp but stays in front of its pool (z 2.8 -> 0.8, the pool is at z 0): the cone is cut around her.
    Overlay: (props) => <StreetOv {...props} hole={walkerHole(walkZ(props.tl))} />,
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
    Overlay: (props) => <StreetOv {...props} hole={walkerHole(WALK_Z1)} />,
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
  // The right hand holds the mask's left edge (fingers over it) and pulls it down; the arm is an authored reach in depth (P12 base,
  // ghost-hand.ts), smooth in the mask state; the left arm hangs (P01). The fixed -60 px camera offset keeps the mask edge and
  // the hand out of the caption band (y 860) as they move down.
  shot('S02-B03-SH02', {
    paper: PAPER,
    camera: (tl) => ({...pushCamera(tl, 1.2, {s0: 1, s1: 1.12, fx: 540, fy: 560}), dy: -60}),
    paint: (p, ctx) => {
      paintCuBack(p);
      const m = maskHook(f_of(ctx.tl));
      const grip = maskGrip(CU_GROUND, CU_UNIT, m);
      drawWomanTear(p, CU_GROUND, CU_UNIT, ctx.tl, m, LAMP_LIGHT, CALM_FACE, undefined, {rArm: grip.rArm, lArm: hangLeftArm(CU_GROUND, CU_UNIT)}, true);
      grip.paintHand(p);
    },
    // Round 11: the chin's shadow from the top lamp deepens over the mask as it is drawn down into the caption band (f12-24).
    Overlay: (props) => <CuOv {...props} from={800} peak={Math.min(1, 0.85 + 0.6 * (1 - maskHook(f_of(props.tl))))} shade={chinShade(f_of(props.tl))} />,
  }),
  // The reveal (LF03): the mouth tears open over 12 f and holds; the camera is still.
  shot('S02-B03-SH03', {
    paper: PAPER,
    camera: (tl) => pushCamera(tl, 1, {s0: 1, s1: 1, fx: 540, fy: 579}),
    paint: (p, ctx) => {
      paintCuBack(p);
      const f = f_of(ctx.tl);
      // The hand yanks the mask down with it for 3 frames, then lets go; the arm settles to the side over f3-15 (user, round 3:
      // the arms return to the body). The left arm hangs throughout.
      // Round 4: the released hand closes to a fist over f5-11, like the left one (user note).
      const grip = maskGrip(CU_GROUND, CU_UNIT, maskReveal(Math.min(f, 3)), {release: (f - 3) / 12, fist: (f - 5) / 6});
      drawWomanTear(p, CU_GROUND, CU_UNIT, ctx.tl, maskReveal(f), LAMP_LIGHT, REVEAL_FACE, tearAt(f), {rArm: grip.rArm, lArm: hangLeftArm(CU_GROUND, CU_UNIT)}, true);
      grip.paintHand(p);
    },
    // Round 11: the chin shade carries over the cut on the falling mask and lifts as the mask leaves the frame (f1-6).
    Overlay: (props) => <CuOv {...props} peak={Math.min(1, 0.85 + 0.6 * (1 - maskReveal(f_of(props.tl))))} shade={revealShade(f_of(props.tl))} />,
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
  // The woman stands frozen on the street, arms at her sides (P01); no tilt and no put-the-mask-back beat (user, round 3: the
  // hand read odd, so the beat is dropped). Round 4 (user): the grin slowly closes back to a plain closed mouth (`grinCloseAt`).
  shot('S03-B01-SH01', {
    paper: PAPER,
    camera: (tl) => pushCamera(tl, 1.83, {s0: 1, s1: 1.03, fx: 540, fy: 880}),
    paint: (p, ctx) => {
      paintStreet(p);
      const f = f_of(ctx.tl);
      // The brows relax from angry to flat with the mouth (f24-50), so the face reads plain at the cut.
      drawWomanTear(p, G0, streetUnit(0), ctx.tl, 1, LAMP_LIGHT, {...REVEAL_FACE, browTo: 'flat', browMix: sstep((f - 24) / 26)}, grinCloseAt(f), undefined, true);
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
    // Insert A is a plain dark set (no lamp in it): no cone over the runner.
    Overlay: (props) => (props.tl * FPS >= 56 ? <DarkOv {...props} /> : <StreetOv {...props} glow={props.tl * FPS >= 28} />),
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
