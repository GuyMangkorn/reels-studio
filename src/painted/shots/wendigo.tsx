import type {ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {CameraLayer, STILL_CAMERA, pushCamera, type Camera} from '../kit/camera';
import {GLOW_PEAK, Spot} from '../kit/glow';
import {Grade, Grain} from '../kit/screen';
import {drawFigure, H} from '../kit/cast';
import {blob, rectPts, washAt} from '../kit/draw';
import {EXPRESSIONS} from '../kit/expressions';
import {hash} from '../kit/hash';
import {ramp, type Pt} from '../kit/painter';
import type {PaintedShot, ShotContext} from '../shot';
import {RING, LANTERN, LANTERN6, LANTERN7, FLAP_CRAWL, MAP_FOCUS, STORM_CRAWL, paintDoc, paintEra, paintEraPhoto, paintEraSilhouette, paintMap, paintSnow, paintTent, paintTentR6, paintTentR7, paintWendigoFlap, paintWendigoStorm} from '../wendigo/look';
import {NIGHT_TENT, LANTERN_M, LIPS, paintBootPrint, paintLantern, paintLips, paintMitten, paintNightTent, paintSleeper, paintTin} from '../wendigo/props';
import {WDG_MAN, anchorsAt, paintGaunt, paintParkaBack, paintParkaFront, groundForHead, manLayer, shockFace, talkVoiceEnv, whisperFace} from '../wendigo/cast';
import {WALK_GROUND, paintNightWalk, paintTentWall} from '../wendigo/night';
import {WDG_FPS, WDG_SHOTS, lanternPeak, shotSec, wdgAmbientAt, type WdgShotId} from '../wendigo/timed';
import narrationAmplitude from '../../../public/narration/WDG-EP01-SHORT.amplitude.json';

// WDG-EP01-SHORT look-frame plates (brief WDG-BRIEF-FILM-R1, W3.1): one plate per location look. Film-painted, awaiting user approval.
// `serves` names the first storyboard shot that uses the look. Composition: src/videos/wendigo/index.ts (WDG-LOOKS, a library proof, not the episode).
// Timed plates (below, D01-D14): one plate per deliverable shot, id `WDG-<shot ID>`, placed by the shot table in timed.ts.

/** Bottom shade: keeps the caption band (y 860-1248) dark, as the brief's lower-third rule asks. */
const Shade = ({from, to, color, peak}: {from: number; to: number; color: string; peak: number}) => (
  <AbsoluteFill style={{pointerEvents: 'none', background: `linear-gradient(to bottom, rgba(0,0,0,0) ${(from / 1920) * 100}%, ${color}${Math.round(peak * 255).toString(16).padStart(2, '0')} ${(to / 1920) * 100}%)`}} />
);

/** Clean lantern light (VD03e): normal-blend amber gradients with a clear falloff, orange-red on the outer stops so the mix with the blue canvas goes mauve-grey, never olive. */
const LanternGlow = ({x, y}: {x: number; y: number}) => (
  <>
    <defs>
      <radialGradient id="lg-wall" gradientUnits="userSpaceOnUse" cx={x - 20} cy={y - 40} r={560}>
        <stop offset="0" stopColor="#f6b24a" stopOpacity={0.62} />
        <stop offset="0.16" stopColor="#ee9a3c" stopOpacity={0.46} />
        <stop offset="0.4" stopColor="#d06a30" stopOpacity={0.24} />
        <stop offset="0.7" stopColor="#a84a30" stopOpacity={0.08} />
        <stop offset="1" stopColor="#a84a30" stopOpacity={0} />
      </radialGradient>
      <radialGradient id="lg-floor" gradientUnits="userSpaceOnUse" cx={0} cy={0} r={1}>
        <stop offset="0" stopColor="#f2a844" stopOpacity={0.4} />
        <stop offset="0.3" stopColor="#dc8236" stopOpacity={0.22} />
        <stop offset="0.7" stopColor="#b85a30" stopOpacity={0.1} />
        <stop offset="1" stopColor="#b85a30" stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={x - 20} cy={y - 40} r={560} fill="url(#lg-wall)" />
    <g transform={`translate(${x + 40} ${y + 10}) scale(600 150)`}><circle cx={0} cy={0} r={1} fill="url(#lg-floor)" /></g>
  </>
);

/** r7 bottom shade: floor lit to about y 1000, then falls to the near-black ground (tuned to about 45 % of the frame below luma 0.10). */
const SHADE7 = {from: 920, to: 1140, peak: 0.92};

const plate = (id: string, serves: string[], paper: string, camera: (tl: number) => Camera, paint: PaintedShot['paint'], Overlay: (props: ShotContext & {camera: Camera}) => ReactNode): PaintedShot => ({
  id, serves, paper, camera, paint,
  Overlay: ({opacity, ...ctx}) => <div style={{position: 'absolute', inset: 0, opacity}}>{Overlay(ctx)}</div>,
});

/** The approved look plates (LF-*), unchanged: they are the look frames the user approved. */
const lookShots: PaintedShot[] = [
  plate('WDG-LF-TENT', ['S01-B01-SH01'], '#0f1c2e',
    (tl) => pushCamera(tl, 2, {s0: 1, s1: 1.06, fx: 540, fy: 700}),
    (p, {tl}) => paintTent(p, tl),
    ({camera, width, height}) => (
      <>
        <CameraLayer camera={camera} width={width} height={height} opacity={GLOW_PEAK / 0.3}>
          <Spot x={LANTERN.x} y={LANTERN.y - 50} r={430} level={0.3} color="#e8913a" />
          <Spot x={LANTERN.x} y={LANTERN.y - 50} r={110} level={0.3} color="#ffd9a0" />
        </CameraLayer>
        <AbsoluteFill style={{pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(5,9,15,0) 36%, rgba(5,9,15,0.62) 50%, rgba(5,9,15,0.62) 64%, rgba(5,9,15,0.3) 78%, rgba(5,9,15,0.42) 100%)'}} />
        <Grade />
        <Grain />
      </>
    )),
  plate('WDG-LF-SNOW', ['S01-B02-SH05'], '#7f97ab', () => STILL_CAMERA,
    (p, {tl}) => paintSnow(p, tl),
    () => (
      <>
        <Shade from={780} to={1000} color="#0f1c2e" peak={0.96} />
        <Grade />
        <Grain />
      </>
    )),
  plate('WDG-LF-DOC', ['S02-B01-SH01'], '#c9d3da', () => STILL_CAMERA,
    (p, {tl}) => paintDoc(p, tl),
    () => (
      <>
        <Shade from={860} to={1250} color="#0f1c2e" peak={0.6} />
        <Grade />
        <Grain />
      </>
    )),
  plate('WDG-LF-MAP', ['S02-B02-SH01'], '#2c4256',
    (tl) => pushCamera(tl, 2, {s0: 1, s1: 1.05, fx: MAP_FOCUS.x, fy: MAP_FOCUS.y}),
    (p, {tl}) => paintMap(p, tl),
    () => (
      <>
        <Shade from={820} to={1100} color="#0f1c2e" peak={0.6} />
        <Grade />
        <Grain />
      </>
    )),
  plate('WDG-LF-TENT-R6', ['S01-B01-SH01'], '#0f1c2e',
    (tl) => pushCamera(tl, 2, {s0: 1, s1: 1.06, fx: 540, fy: 700}),
    (p, {tl}) => paintTentR6(p, tl),
    ({camera, width, height}) => (
      <>
        <CameraLayer camera={camera} width={width} height={height} opacity={GLOW_PEAK / 0.3}>
          <Spot x={LANTERN6.x} y={LANTERN6.y - 60} r={380} level={0.3} color="#e8913a" />
          <Spot x={LANTERN6.x} y={LANTERN6.y - 60} r={100} level={0.3} color="#ffd9a0" />
        </CameraLayer>
        <Shade from={820} to={1000} color="#05090f" peak={0.5} />
        <Grade />
        <Grain />
      </>
    )),
  plate('WDG-LF-TENT-R7', ['S01-B01-SH01'], '#0f1c2e',
    (tl) => pushCamera(tl, 2, {s0: 1, s1: 1.06, fx: 540, fy: 700}),
    (p, {tl}) => paintTentR7(p, tl),
    ({camera, width, height}) => (
      <>
        <CameraLayer camera={camera} width={width} height={height} blend="normal">
          <LanternGlow x={LANTERN7.x} y={LANTERN7.y} />
        </CameraLayer>
        <CameraLayer camera={camera} width={width} height={height} opacity={GLOW_PEAK / 0.3}>
          <Spot x={LANTERN7.x} y={LANTERN7.y - 60} r={150} level={0.3} color="#ffc878" />
        </CameraLayer>
        <Shade from={SHADE7.from} to={SHADE7.to} color="#05090f" peak={SHADE7.peak} />
        <Grade />
        <Grain />
      </>
    )),
  plate('WDG-LF-WENDIGO', ['S01-B03-SH05', 'S02-B03-SH02'], '#101c2c', () => STILL_CAMERA,
    (p, {tl}) => paintWendigoFlap(p, tl),
    () => (
      <>
        <Shade from={860} to={1000} color="#05090f" peak={0.6} />
        <Grade />
        <Grain />
      </>
    )),
  plate('WDG-LF-WENDIGO-STORM', ['S02-B03-SH01'], '#aab6c0', () => STILL_CAMERA,
    (p, {tl}) => paintWendigoStorm(p, tl),
    () => (
      <>
        <Shade from={760} to={930} color="#0f1c2e" peak={0.95} />
        <Grade />
        <Grain />
      </>
    )),
  plate('WDG-LF-ERA', ['S03-B01-SH01', 'S03-B01-SH02'], '#cfc6b0',
    (tl) => pushCamera(tl, 2, {s0: 1, s1: 1.04, fx: 700, fy: 640}),
    (p, {tl}) => paintEra(p, tl),
    () => (
      <>
        <Shade from={800} to={940} color="#10161d" peak={0.82} />
        <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 42%, rgba(60,45,25,0) 45%, rgba(60,45,25,0.42) 100%)'}} />
        <Grade />
        <Grain opacity={0.16} />
      </>
    )),
];

// ---------------------------------------------------------------- timed plates (WDG-SS-R2)

/** Warm lantern light of the tent r7 at composite peak `level` (<= 0.3): the same two layers as LF-TENT-R7, scaled to the peak. */
const TentLight = ({camera, width, height, level, x = LANTERN7.x, y = LANTERN7.y}: {camera: Camera; width: number; height: number; level: number; x?: number; y?: number}) => (
  <>
    <CameraLayer camera={camera} width={width} height={height} blend="normal" opacity={level / 0.62}>
      <LanternGlow x={x} y={y} />
    </CameraLayer>
    <CameraLayer camera={camera} width={width} height={height} opacity={level / 0.3}>
      <Spot x={x} y={y - 60} r={150} level={0.3} color="#ffc878" />
    </CameraLayer>
  </>
);

/** Raking light from the left edge (-100, 700) on the tin (D03): composite peak = `level`, follows the camera. */
const RakingLight = ({camera, width, height, level}: {camera: Camera; width: number; height: number; level: number}) => (
  <CameraLayer camera={camera} width={width} height={height} opacity={level / 0.5}>
    <defs>
      <radialGradient id="wdg-rake" gradientUnits="userSpaceOnUse" cx={-100} cy={700} r={1000}>
        <stop offset="0" stopColor="#ffb060" stopOpacity={0.5} />
        <stop offset="0.5" stopColor="#c87a40" stopOpacity={0.2} />
        <stop offset="1" stopColor="#c87a40" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect x={-400} y={-400} width={1900} height={2800} fill="url(#wdg-rake)" />
  </CameraLayer>
);

/**
 * Lantern leak through the night tent (D02, W5.2 fix 6): warm amber (`#f6b24a` family) on the seams, the door gap and eight pinholes; line alpha peaks at 0.5
 * (`level` is the flicker, <= 0.3, so alpha = 0.5 * level / 0.3), a faint spill on the snow in front of the door (radius <= 120 px, ends above the caption band at y 856).
 * No round glow: every shape is a line, a dot or a flat strip.
 */
export const LEAK = {peak: 0.5, spillR: 120, spillY: 832, pins: [[430, 700], [470, 640], [600, 690], [650, 740], [500, 770], [585, 630], [360, 780], [720, 800]] as [number, number][]};
const NightLeak = ({camera, width, height, level}: {camera: Camera; width: number; height: number; level: number}) => {
  const {apex: A, baseL: L, baseR: R} = NIGHT_TENT;
  const k = Math.min(1, level / 0.3), a = LEAK.peak * k;
  return (
    <CameraLayer camera={camera} width={width} height={height} opacity={1}>
      <defs>
        <radialGradient id="wdg-spill" gradientUnits="userSpaceOnUse" cx={0} cy={0} r={1}>
          <stop offset="0" stopColor="#f6b24a" stopOpacity={0.3} />
          <stop offset="1" stopColor="#f6b24a" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="wdg-gap" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f6b24a" stopOpacity={0} />
          <stop offset="0.5" stopColor="#ffd890" stopOpacity={0.55} />
          <stop offset="1" stopColor="#f6b24a" stopOpacity={0} />
        </linearGradient>
      </defs>
      <g transform={`translate(540 ${LEAK.spillY}) scale(${LEAK.spillR} 24)`} opacity={k}><circle cx={0} cy={0} r={1} fill="url(#wdg-spill)" /></g>
      <rect x={522} y={730} width={36} height={126} fill="url(#wdg-gap)" opacity={k} />
      <g stroke="#f6b24a" strokeLinecap="round" opacity={a}>
        <g strokeWidth={5}>
          <line x1={A[0]} y1={A[1]} x2={L[0] + 40} y2={L[1]} />
          <line x1={A[0]} y1={A[1]} x2={R[0] - 40} y2={R[1]} />
        </g>
        <g strokeWidth={3.5}>
          <line x1={A[0]} y1={A[1] + 6} x2={400} y2={L[1] - 4} />
          <line x1={A[0]} y1={A[1] + 6} x2={680} y2={R[1] - 4} />
          <line x1={A[0] - 100} y1={700} x2={A[0] + 100} y2={700} />
        </g>
        <g strokeWidth={4}>
          <line x1={534} y1={728} x2={514} y2={858} />
          <line x1={546} y1={728} x2={566} y2={858} />
          <line x1={540} y1={730} x2={540} y2={858} stroke="#ffd890" />
        </g>
      </g>
      {LEAK.pins.map(([x, y], i) => (
        <g key={i} opacity={Math.min(1, a * 1.8)}>
          <circle cx={x} cy={y} r={9} fill="#f6b24a" opacity={0.28} />
          <circle cx={x} cy={y} r={4.5} fill="#ffe0a0" />
        </g>
      ))}
    </CameraLayer>
  );
};

/** Screen-space finish of the dark snow and tent plates: bottom shade, grade and grain (the caption band stays dark). */
const DarkFinish = ({from = 860, to = 1100, peak = 0.9}: {from?: number; to?: number; peak?: number}) => (
  <>
    <Shade from={from} to={to} color="#05090f" peak={peak} />
    <Grade />
    <Grain />
  </>
);

/** Lantern "nearly out" peak of the tent plates (sheets: <= 0.2, flickering) on the ambient clock; `reverse` for the seam. */
const tentLevel = (shot: WdgShotId, tl: number, reverse = false) => lanternPeak(wdgAmbientAt(shot, tl, reverse), 0.2);

/** Era option A finish (W5.2): a warm dark vignette, a bottom shade (caption band), heavier grain; the look is painted in `paintEraPhoto`, not graded here. */
const EraPhotoFinish = () => (
  <>
    <Shade from={780} to={930} color="#120e0a" peak={0.9} />
    <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 40%, rgba(30,22,12,0) 42%, rgba(30,22,12,0.55) 100%)'}} />
    <Grain opacity={0.3} />
  </>
);

/** The three era key-pose stills for the user's approval (ERA-K1..K3, scene-S03.md): fixed camera at the frame's scale about the gate. Stills only; the video plates keep `paintEra`. */
const eraKey = (id: string, serves: string, s: number): PaintedShot =>
  plate(id, [serves], '#a9aeab', () => ({s, fx: 600, fy: 800, dx: 0, dy: 0}), (p) => paintEraPhoto(p, 0), () => <EraPhotoFinish />);

/** ERA-K4 (S03-B01-SH03, WDG-SS-R2.2): generic back-view silhouette in the era plate, still for the user's approval. */
const eraSilhouetteKey: PaintedShot = plate('WDG-ERA-K4', ['S03-B01-SH03'], '#a9aeab', () => STILL_CAMERA, (p) => paintEraSilhouette(p), () => <EraPhotoFinish />);

/** L: shot-local frames. The sheets name cut points in frames; the plates use seconds, so this converts once. */
const frames = (tl: number) => tl * WDG_FPS;

/** Storm gap visibility `v` (S02-B03-SH01 sheet): 0 to frame 90, 0.5 at 139, 0.6 at 233, then held. */
const stormGap = (L: number) => (L <= 90 ? 0 : L < 139 ? 0.5 * ramp(L, 90, 139) : L < 233 ? 0.5 + 0.1 * ramp(L, 139, 233) : 0.6);

/** Prints laid by shot-local frame `L` (S01-B02-SH04, R2.6): print k starts at L 6 + 4.2 k and fades in over one step; the 30th is whole at L 132, the closed ring holds to L 154. */
const RING_START = 6, RING_STEP = 4.2;
const ringReveal = (L: number) => Math.max(0, Math.min(RING.prints, (L - RING_START) / RING_STEP));

/** Boot height above the print (S01-B03-SH02, R2.6 plan view): 1 hovering at L0, 0 resting from L19. */
const bootSole = (L: number) => 1 - ramp(L, 0, 19);
/** Snow burst on landing: up at 19-22, gone by about 40. */
const bootPuff = (L: number) => ramp(L, 19, 22) * (1 - ramp(L, 28, 40));

/** Mouth-open envelope (S01-B03-SH04): opens 50-53, closed 106-109 (sheet). */
const mouthOpen = (L: number) => ramp(L, 48, 53) * (1 - ramp(L, 102, 108));
/** Breath puffs every 45 frames from frame 30: seconds since each puff, for the up to four that can be on screen. */
const mistAges = (L: number) => [0, 1, 2, 3].map((k) => (L - 30 - 45 * k) / WDG_FPS);


// ---------------------------------------------------------------- man shots (D05 parka, D06 lantern, D07 night walk)

/** Hand-held lantern light (D06): a warm halo round the glass and, with `pool`, a pool on the snow at that ground y. Composite peak = `level` (<= 0.3). */
const LanternLight = ({camera, width, height, x, y, r, level, pool}: {camera: Camera; width: number; height: number; x: number; y: number; r: number; level: number; pool?: {y: number; rx: number}}) => (
  <>
    <CameraLayer camera={camera} width={width} height={height} blend="normal" opacity={level / 0.62}>
      <defs>
        <radialGradient id="wdg-hh" gradientUnits="userSpaceOnUse" cx={x} cy={y} r={r}>
          <stop offset="0" stopColor="#f6b24a" stopOpacity={0.62} />
          <stop offset="0.2" stopColor="#ee9a3c" stopOpacity={0.4} />
          <stop offset="0.5" stopColor="#d06a30" stopOpacity={0.16} />
          <stop offset="1" stopColor="#a84a30" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="wdg-hp" gradientUnits="userSpaceOnUse" cx={0} cy={0} r={1}>
          <stop offset="0" stopColor="#f2a844" stopOpacity={0.5} />
          <stop offset="0.5" stopColor="#dc8236" stopOpacity={0.2} />
          <stop offset="1" stopColor="#b85a30" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r} fill="url(#wdg-hh)" />
      {pool && <g transform={`translate(${x + 30} ${pool.y}) scale(${pool.rx} ${pool.rx * 0.2})`}><circle cx={0} cy={0} r={1} fill="url(#wdg-hp)" /></g>}
    </CameraLayer>
    <CameraLayer camera={camera} width={width} height={height} opacity={level / 0.3}>
      <Spot x={x} y={y} r={r * 0.28} level={0.3} color="#ffc878" />
    </CameraLayer>
  </>
);

// S01-B01-SH02: close profile, `man-parted + parka (override), P01, whisper`, head 380 px at (650, 460), faces screen left (R2.1: shoulders to y 840).
const SH02 = {unit: 380 / H, head: [650, 460] as Pt, spans: [[4, 31], [41, 116]] as [number, number][]};
const sh02Layer = (tl: number) => {
  const L = frames(tl);
  const g = groundForHead(WDG_MAN, SH02.head, SH02.unit);
  return manLayer({motion: 'idle-breathe', t: tl, g, unit: SH02.unit, view: 'left', face: whisperFace(talkVoiceEnv(L, WDG_SHOTS['S01-B01-SH02'].g, SH02.spans, narrationAmplitude, 11))});
};

// S01-B03-SH01: night walk, `man-parted + parka (override), P01, worried`, template side-walk logic (walk-in-from-left, follow 1.0), lantern in the near hand at hip.
// R2.1 (W5.2 fix 8): the ground and the prints scroll at 230 px/s (constant, no brake), and the legs are timed so the boot lands at L 26, 55, 84, 110 (G626, 655, 684, 710)
// with the planted foot moving at the ground speed on average: stride 1.25 (the kit leg model; measured in tests/wendigo-man.test.ts).
const WALK_SPEED = 230; // px/s
const WALK_STEPS = [26, 55, 84, 110]; // boot lands, shot-local frames
const WALK = {unit: 620 / WDG_MAN.height, rest: [430, WALK_GROUND] as Pt, speed: WALK_SPEED, stride: 1.25, steps: WALK_STEPS};
/** Walk phase in cycles at shot-local frame `L`: a landing every half cycle (phase 0.25 + k / 2 at `steps[k]`), the spacing of the sheet's four steps, the end spacing held outside them. */
const walkPhase = (L: number) => {
  const st = WALK_STEPS;
  const u = L <= st[0] ? (L - st[0]) / (st[1] - st[0]) : L >= st[3] ? 3 + (L - st[3]) / (st[3] - st[2]) : (() => { const k = st.findIndex((v, i) => L >= v && L < st[i + 1]); return k + (L - st[k]) / (st[k + 1] - st[k]); })();
  return 0.25 + 0.5 * u;
};
const walkStage = (tl: number) => {
  const L = frames(tl), travel = WALK_SPEED * (shotSec('S01-B03-SH01') - tl); // world distance still to walk to the frame end
  const l0 = manLayer({motion: 'idle-breathe', t: tl, g: [WALK.rest[0] - travel, WALK.rest[1]], unit: WALK.unit, view: 'right', face: EXPRESSIONS.worried, distance: 2});
  const layer = {...l0, pose: {...l0.pose, view: 'right' as const, walk: walkPhase(L), stride: WALK.stride, nod: [0, 0.16] as Pt}};
  const cam: Camera = {s: 1, fx: 540, fy: 960, dx: WALK.rest[0] - layer.g[0], dy: 0};
  const a = anchorsAt(layer, WALK.unit, tl);
  const hand = a.rHand;
  return {layer, cam, hand, h: LANTERN_M * WALK.unit, head: a.head};
};

// S01-B03-SH03: front close-up, `man-parted + parka (override), P01, worried -> shock`, head 420 px at (540, 500), lantern in the near hand at chin height (R2.1: shoulders to y 840, mitten on the bail).
const SH03 = {unit: 420 / H, head: [540, 500] as Pt, spans: [[26, 82], [124, 160]] as [number, number][], hand: [690, 688] as Pt, elbow: [924, 823] as Pt};
const sh03Layer = (tl: number) => {
  const L = frames(tl);
  const g = groundForHead(WDG_MAN, SH03.head, SH03.unit);
  const l0 = manLayer({motion: 'idle-breathe', t: tl, g, unit: SH03.unit, view: 'front', face: shockFace(L, talkVoiceEnv(L, WDG_SHOTS['S01-B03-SH03'].g, SH03.spans, narrationAmplitude, 29))});
  return {...l0, pose: {...l0.pose, lArm: {to: SH03.hand, via: SH03.elbow}, warm: 0.5}};
};
/** Flake drift of SH03 (px): slows to a stop at L165 (u = 1 - (1 - L / 165)^2). */
const sh03Drift = (L: number) => 180 * (1 - (1 - Math.min(L, 165) / 165) ** 2);

/** The night tent (S01-B02-SH01) and the reverse-clock seam both use the lantern glow peak family. */
const timedShots: PaintedShot[] = [
  // S01-B01-SH01 (D01): tent r7 push 1.00 -> 1.06, lantern nearly out (peak <= 0.2, flickers), no baked push.
  {
    ...plate('WDG-S01-B01-SH01', ['S01-B01-SH01'], '#0f1c2e',
      (tl) => pushCamera(tl, shotSec('S01-B01-SH01'), {s0: 1, s1: 1.06, fx: 540, fy: 700}),
      (p, {tl}) => paintTentR7(p, wdgAmbientAt('S01-B01-SH01', tl)),
      ({camera, width, height, tl}) => (
        <>
          <TentLight camera={camera} width={width} height={height} level={tentLevel('S01-B01-SH01', tl)} />
          <Shade from={SHADE7.from} to={SHADE7.to} color="#05090f" peak={SHADE7.peak} />
          <Grade />
          <Grain />
        </>
      )),
  },
  // S03-B02-SH02 (D01, D16): the frame-0 tent composition, push 1.05 -> 1.00 with the reversed ambient clock (seam).
  {
    ...plate('WDG-S03-B02-SH02', ['S03-B02-SH02'], '#0f1c2e',
      (tl) => pushCamera(tl, shotSec('S03-B02-SH02'), {s0: 1.05, s1: 1, fx: 540, fy: 700}),
      (p, {tl}) => paintTentR7(p, wdgAmbientAt('S03-B02-SH02', tl, true)),
      ({camera, width, height, tl}) => (
        <>
          <TentLight camera={camera} width={width} height={height} level={tentLevel('S03-B02-SH02', tl, true)} />
          <Shade from={SHADE7.from} to={SHADE7.to} color="#05090f" peak={SHADE7.peak} />
          <Grade />
          <Grain />
        </>
      )),
  },
  // S01-B01-SH02 (B01 close profile): man at the tent wall, mouth on his two phrases, key from low left, cool rim upper right; push 1.00 -> 1.05 about (650, 520).
  {
    ...plate('WDG-S01-B01-SH02', ['S01-B01-SH02'], '#13233a',
      (tl) => pushCamera(tl, shotSec('S01-B01-SH02'), {s0: 1, s1: 1.05, fx: 650, fy: 480}),
      (p, {tl}) => {
        paintTentWall(p, wdgAmbientAt('S01-B01-SH02', tl));
        const l = sh02Layer(tl);
        paintParkaBack(p, SH02.head, H * SH02.unit, 'left');
        // R2.6: the overlays (stubble, hollows, collar) ride the drawn head (breath rise, nod), not the fixed sheet position
        const hd02 = drawFigure(p, l.def, l.g, SH02.unit, l.pose, tl, l.seed).head;
        paintGaunt(p, hd02, H * SH02.unit, 'left');
        paintParkaFront(p, hd02, H * SH02.unit, 'left');
      },
      ({camera, width, height, tl}) => (
        <>
          <RakingLight camera={camera} width={width} height={height} level={lanternPeak(wdgAmbientAt('S01-B01-SH02', tl), 0.3, 0.8)} />
          <CameraLayer camera={camera} width={width} height={height} opacity={0.5 / 0.3}>
            <Spot x={1120} y={160} r={620} level={0.3} color="#5f93d0" />
          </CameraLayer>
          <DarkFinish from={820} to={960} peak={1} />
        </>
      )),
  },
  // S01-B03-SH01 (B03 night walk): profile walk, lantern at hip lighting the snow ahead, the ring's prints edge-on, camera follows; no extra push.
  {
    ...plate('WDG-S01-B03-SH01', ['S01-B03-SH01'], '#0f1c2e',
      (tl) => walkStage(tl).cam,
      (p, {tl}) => {
        const {layer, cam, hand, h, head} = walkStage(tl);
        paintNightWalk(p, cam.dx, wdgAmbientAt('S01-B03-SH01', tl));
        const hd = H * WALK.unit;
        paintParkaBack(p, head, hd, 'right');
        drawFigure(p, layer.def, layer.g, WALK.unit, layer.pose, tl, layer.seed);
        paintGaunt(p, head, hd, 'right');
        paintParkaFront(p, head, hd, 'right');
        paintLantern(p, hand[0], hand[1] - 0.12 * h, h, 1);
        paintMitten(p, hand[0], hand[1], WALK.unit, layer.def.head.skin, 0.4);
      },
      ({camera, width, height, tl}) => {
        const {hand, h} = walkStage(tl);
        return (
          <>
            <LanternLight camera={camera} width={width} height={height} x={hand[0]} y={hand[1] + 0.55 * h} r={h * 9} level={lanternPeak(wdgAmbientAt('S01-B03-SH01', tl), 0.3, 0.85)} pool={{y: WALK_GROUND + 6, rx: 380}} />
            <DarkFinish from={900} to={1060} peak={1} />
          </>
        );
      }),
  },
  // S01-B03-SH03 (B03 front close-up): worried -> shock, mouth on M5, lantern at chin height under-lighting the face; flakes slow to nothing by L165; push 1.00 -> 1.05 about (540, 520).
  {
    ...plate('WDG-S01-B03-SH03', ['S01-B03-SH03'], '#0b1520',
      (tl) => pushCamera(tl, shotSec('S01-B03-SH03'), {s0: 1, s1: 1.05, fx: 540, fy: 520}),
      (p, {tl}) => {
        const L = frames(tl);
        washAt(p, 1, '#0b1520', 255, rectPts(-120, -120, 1200, 2040), 0.05, 0.2);
        washAt(p, 2, '#16283a', 200, blob(2, 540, 560, 700, 760, 0), 0.8, 0.8);
        washAt(p, 3, '#2a3d52', 110, blob(3, 400, 300, 360, 260, 0), 0.8, 0.8);
        for (let i = 0; i < 26; i++) {
          const fx = 40 + hash(700 + i) * 1000, fy = (hash(740 + i) * 1600 + sh03Drift(L) * (0.5 + hash(780 + i))) % 1600 + 80;
          washAt(p, 10 + i, '#dce9f2', 120 + 90 * hash(820 + i), blob(10 + i, fx, fy, 3 + hash(860 + i) * 3, 2.6 + hash(900 + i) * 2.4, 0), 0.4, 0.4);
        }
        const l = sh03Layer(tl);
        paintParkaBack(p, SH03.head, H * SH03.unit, 'front');
        const hd03 = drawFigure(p, l.def, l.g, SH03.unit, l.pose, tl, l.seed).head;
        paintGaunt(p, hd03, H * SH03.unit, 'front');
        paintParkaFront(p, hd03, H * SH03.unit, 'front');
        const h = LANTERN_M * SH03.unit, f = anchorsAt(l, SH03.unit, tl).lHand;
        paintLantern(p, f[0], f[1] - 0.12 * h, h, 1);
        paintMitten(p, f[0], f[1], SH03.unit, l.def.head.skin, 0.5);
      },
      ({camera, width, height, tl}) => {
        const h = LANTERN_M * SH03.unit;
        return (
          <>
            <LanternLight camera={camera} width={width} height={height} x={SH03.hand[0]} y={SH03.hand[1] + 0.45 * h} r={h * 4.2} level={lanternPeak(wdgAmbientAt('S01-B03-SH03', tl), 0.3, 0.85)} />
            <DarkFinish from={860} to={980} peak={1} />
          </>
        );
      }),
  },
  // S01-B02-SH01 (D02 night wide): tent half-buried, lantern leaks through seams, door gap and pinholes, wide push 1.00 -> 1.04.
  {
    ...plate('WDG-S01-B02-SH01', ['S01-B02-SH01'], '#0f1c2e',
      (tl) => pushCamera(tl, shotSec('S01-B02-SH01'), {s0: 1, s1: 1.04, fx: 540, fy: 760}),
      (p) => paintNightTent(p),
      ({camera, width, height, tl}) => (
        <>
          <NightLeak camera={camera} width={width} height={height} level={lanternPeak(wdgAmbientAt('S01-B02-SH01', tl), 0.3)} />
          <DarkFinish />
        </>
      )),
  },
  // S01-B02-SH02 (D03): hero tin, lantern raking from the left, lit state (peak 0.3). Locked camera.
  {
    ...plate('WDG-S01-B02-SH02', ['S01-B02-SH02'], '#4d6378', () => STILL_CAMERA,
      (p) => paintTin(p, 0.4),
      ({camera, width, height, tl}) => (
        <>
          <RakingLight camera={camera} width={width} height={height} level={lanternPeak(wdgAmbientAt('S01-B02-SH02', tl), 0.3, 0.8)} />
          <DarkFinish from={860} to={1000} peak={0.55} />
        </>
      )),
  },
  // S01-B02-SH03 (D04, fallback): sleeper, hair and one shoulder, blanket breathing; faint warm light far right (0.12).
  {
    ...plate('WDG-S01-B02-SH03', ['S01-B02-SH03'], '#14222f', () => STILL_CAMERA,
      (p, {tl}) => paintSleeper(p, wdgAmbientAt('S01-B02-SH03', tl)),
      () => (
        <>
          <Spot x={1080} y={700} r={520} level={0.12} color="#f0a050" />
          <DarkFinish from={860} to={1000} peak={0.6} />
        </>
      )),
  },
  // S01-B02-SH04 (D02 morning): the ring, a closed ellipse of prints; push 1.00 -> 1.05 about (540, 590).
  {
    ...plate('WDG-S01-B02-SH04', ['S01-B02-SH04'], '#7f97ab',
      (tl) => pushCamera(tl, shotSec('S01-B02-SH04'), {s0: 1, s1: 1.05, fx: 540, fy: 590}),
      (p, {tl}) => paintSnow(p, wdgAmbientAt('S01-B02-SH04', tl), ringReveal(frames(tl))),
      () => <Shade from={780} to={1000} color="#0f1c2e" peak={0.96} />),
  },
  // S01-B03-SH02 (D08): boot lowers into the print, lands at frame 19, snow burst; push 1.00 -> 1.08 about (540, 620).
  {
    ...plate('WDG-S01-B03-SH02', ['S01-B03-SH02'], '#c3d0da',
      (tl) => pushCamera(tl, shotSec('S01-B03-SH02'), {s0: 1, s1: 1.08, fx: 540, fy: 620}),
      (p, {tl}) => paintBootPrint(p, bootSole(frames(tl)), bootPuff(frames(tl))),
      () => <DarkFinish from={740} to={900} peak={0.96} />),
  },
  // S01-B03-SH04 (D09): lips close-up, locked; mouth opens with the whisper; breath mist from frame 30.
  {
    ...plate('WDG-S01-B03-SH04', ['S01-B03-SH04'], '#0d1622', () => STILL_CAMERA,
      (p, {tl}) => paintLips(p, mouthOpen(frames(tl)), mistAges(frames(tl))),
      ({camera, width, height}) => (
        <>
          <CameraLayer camera={camera} width={width} height={height} opacity={1}>
            <Spot x={LIPS.cx} y={1000} r={520} level={0.2} color="#ffb070" />
          </CameraLayer>
          <DarkFinish from={860} to={1100} peak={0.7} />
        </>
      )),
  },
  // S01-B03-SH05 (D10): the shadow in the flap, morph k 0 -> 1 on frames 12-132 (R2.3, was 45-120), held to 150; push 1.00 -> 1.03 about (540, 430).
  {
    ...plate('WDG-S01-B03-SH05', ['S01-B03-SH05'], '#101c2c',
      (tl) => pushCamera(tl, shotSec('S01-B03-SH05'), {s0: 1, s1: 1.03, fx: 540, fy: 430}),
      (p, {tl}) => paintWendigoFlap(p, wdgAmbientAt('S01-B03-SH05', tl), ramp(frames(tl), 12, 132), frames(tl) / WDG_FPS, FLAP_CRAWL),
      () => <Shade from={860} to={1000} color="#05090f" peak={0.6} />),
  },
  // S02-B01-SH01 (D11): dawn lake, fade from black on frames 12-57 (plate alpha over the black paper); push 1.00 -> 1.04.
  {
    ...plate('WDG-S02-B01-SH01', ['S02-B01-SH01'], '#05090f',
      (tl) => pushCamera(tl, shotSec('S02-B01-SH01'), {s0: 1, s1: 1.04, fx: 540, fy: 700}),
      (p, {tl}) => paintDoc(p, wdgAmbientAt('S02-B01-SH01', tl)),
      () => <Shade from={860} to={1250} color="#0f1c2e" peak={0.6} />),
    alpha: (tl: number) => ramp(frames(tl), 12, 57),
  },
  // S02-B02-SH01 (D12): map stand-in (LF-MAP look kept; the land bake has no data in this checkout); push 1.00 -> 1.05.
  {
    ...plate('WDG-S02-B02-SH01', ['S02-B02-SH01'], '#2c4256',
      (tl) => pushCamera(tl, shotSec('S02-B02-SH01'), {s0: 1, s1: 1.05, fx: MAP_FOCUS.x, fy: MAP_FOCUS.y}),
      (p, {tl}) => paintMap(p, wdgAmbientAt('S02-B02-SH01', tl)),
      () => <Shade from={820} to={1100} color="#0f1c2e" peak={0.6} />),
  },
  // S02-B03-SH01 (D10): storm, locked camera; the gap grows with the words (v 0 -> 0.5 -> 0.6).
  {
    ...plate('WDG-S02-B03-SH01', ['S02-B03-SH01'], '#aab6c0', () => STILL_CAMERA,
      (p, {tl}) => paintWendigoStorm(p, wdgAmbientAt('S02-B03-SH01', tl), stormGap(frames(tl)), frames(tl) / WDG_FPS),
      () => <Shade from={760} to={930} color="#0f1c2e" peak={0.95} />),
  },
  // S02-B03-SH02 (D10): storm with the gap at 0.6 -> 0, and the flap silhouette in-canvas dissolve on frames 48-63 and 101-116.
  {
    ...plate('WDG-S02-B03-SH02', ['S02-B03-SH02'], '#aab6c0',
      (tl) => pushCamera(tl, shotSec('S02-B03-SH02'), {s0: 1, s1: 1.03, fx: 540, fy: 600}),
      (p, {tl}) => {
        const L = frames(tl), t = wdgAmbientAt('S02-B03-SH02', tl);
        paintWendigoStorm(p, t, 0.6 * (1 - ramp(L, 116, 190)), L / WDG_FPS, STORM_CRAWL);
        const m = ramp(L, 48, 63) * (1 - ramp(L, 101, 116));
        if (m > 0) paintWendigoFlap(p.layer(m, 9000), t, 1, L / WDG_FPS);
      },
      () => <Shade from={760} to={930} color="#0f1c2e" peak={0.95} />),
  },
  // S03-B01-SH01 (D14, W5.2 option A): era glass-plate photograph (paintEraPhoto, = ERA-K1/K2), push 1.00 -> 1.04 toward the gate (600, 800).
  {
    ...plate('WDG-S03-B01-SH01', ['S03-B01-SH01'], '#cfc6b0',
      (tl) => pushCamera(tl, shotSec('S03-B01-SH01'), {s0: 1, s1: 1.04, fx: 600, fy: 800}),
      (p, {tl}) => paintEraPhoto(p, wdgAmbientAt('S03-B01-SH01', tl)),
      () => <EraPhotoFinish />),
  },
  // S03-B01-SH02 (D14, W5.2 option A): era glass-plate photograph (= ERA-K3), push 1.14 -> 1.17 over 97 frames (WDG-SS-R2.2: shortened from 171 at the same per-frame speed).
  {
    ...plate('WDG-S03-B01-SH02', ['S03-B01-SH02'], '#cfc6b0',
      (tl) => pushCamera(tl, shotSec('S03-B01-SH02'), {s0: 1.14, s1: 1.17, fx: 600, fy: 800}),
      (p, {tl}) => paintEraPhoto(p, wdgAmbientAt('S03-B01-SH02', tl)),
      () => <EraPhotoFinish />),
  },
  // S03-B01-SH03 (WDG-SS-R2.2 option A, Boat conditions 1-6): generic back-view silhouette (= ERA-K4), push 1.00 -> 1.04 about (540, 700). Frame 0 is the plain K4
  // (the 7-frame dissolve-in from SH02 is Editor's). Only the cloud banks drift (shot-local clock); no sound, no label.
  {
    ...plate('WDG-S03-B01-SH03', ['S03-B01-SH03'], '#a9aeab',
      (tl) => pushCamera(tl, shotSec('S03-B01-SH03'), {s0: 1, s1: 1.04, fx: 540, fy: 700}),
      (p, {tl}) => paintEraSilhouette(p, tl),
      () => <EraPhotoFinish />),
  },
  // S03-B02-SH01 (D03): tin night-after, lantern nearly out (raking peak 0.12), heavier frost; push 1.00 -> 1.05 about (540, 560).
  {
    ...plate('WDG-S03-B02-SH01', ['S03-B02-SH01'], '#4d6378',
      (tl) => pushCamera(tl, shotSec('S03-B02-SH01'), {s0: 1, s1: 1.05, fx: 540, fy: 560}),
      (p) => paintTin(p, 0.8),
      ({camera, width, height, tl}) => (
        <>
          <RakingLight camera={camera} width={width} height={height} level={lanternPeak(wdgAmbientAt('S03-B02-SH01', tl), 0.12, 0.7)} />
          <DarkFinish from={860} to={1000} peak={0.55} />
        </>
      )),
  },
];

export const wendigoShots: PaintedShot[] = [...lookShots, ...timedShots, eraKey('WDG-ERA-K1', 'S03-B01-SH01', 1.01), eraKey('WDG-ERA-K2', 'S03-B01-SH01', 1.04), eraKey('WDG-ERA-K3', 'S03-B01-SH02', 1.19), eraSilhouetteKey];

/** Staging of the three man shots (pure, shot-local seconds): exported for the lead-height and determinism checks (tests/wendigo-man.test.ts). */
export const wdgManStage = {SH02, sh02Layer, WALK, walkStage, walkPhase, SH03, sh03Layer};
