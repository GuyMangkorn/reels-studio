import type {ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {CameraLayer, pushCamera, type Camera} from '../camera';
import {clamp01, lerp, ramp, tintPainter, type Painter, type Pt} from '../painter';
import {envAt} from '../bloop/envelope';
import {DOTS, FPS, HYD, hydParts, L, mapXY, ringRadius, SECTION, W, WF0, frontCrossing} from '../bloop/geometry';
import {crRealGum, crRealHeadWidth, crRealPlace, crRealThroatCentre, crRealUpperLipWorld, paintCrReal, paintCrSilhouette, paintDreamCreature, paintFarProfile, paintTurnBody} from '../bloop/creatures';
import {ChannelGlow, DiagramTag, Fissures, HydGlyph, PatternLine, Ring, ScreenLayers} from '../bloop/fx';
import {Coast, Equator, LandFill, MapDots, MapWindow, TaperArrow, Wavefronts} from '../bloop/map';
import {AMBER, DREAM_PAPER, catmullClosed, keelOutline, keelRing, paintBlooms, paintDeep, paintDreamWater, paintHydrophone, paintIce, paintMapOcean, paintSection, paintSnow} from '../bloop/sets';
import type {PaintedShot, ShotContext} from '../shot';

// BLOOP-EP01-SHORT plates (DEP01, Boss). One painted shot key per Mark shot (`bloop-sh01` … `bloop-sh13`, sheets
// BLOOP-SHEETS-R4). Each plate's camera, staging and timing are a pure function of its shot clock `tl`; the editor owns
// the cue times (painted.shots[].atSec / label), so a plate never reads the composition clock. Event frames below are
// shot-local L frames from the sheets. Pass 2 (BLOOP-BRIEF-R3 FR01-FR11, sheets R4) changed the look, not the times.

type Overlay = (props: ShotContext & {camera: Camera; opacity: number}) => ReactNode;

const sineInOut = (u: number) => (1 - Math.cos(Math.PI * clamp01(u))) / 2;
/** 0..1 over shot-local frames [a, b], linear. */
const at = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
/** 1 while a <= f < b, else 0. */
const pulse = (f: number, a: number, b: number) => (f >= a && f < b ? 1 : 0);
const WATER_PAPER = '#0b1622';

/**
 * CRD-2 (CR-DREAM) placement (R4 / FR03): spike-local to world with scale `s`, offset (`tx`, `ty`). At drift 0 the head
 * box is x 60-600, y 352-832 and cr.eye lands on (220, 520) with s 0.79, tx 93.6, ty 148.7.
 */
export const DREAM_PLACE = (tx = 93.6, s = 0.79, ty = 148.7) => ({s, tx, ty});
/** SH07 ghost (R4): the SH06 L63 drawing (drift -40) moved 60 px down; the pan brings it back to SH06's end position. */
export const DREAM_AT_SH06_END = DREAM_PLACE(53.6, 0.79, 208.7);
/**
 * Reveal key Lr (SH06-local frame, BLOOP-SHEETS-R8 SH06): the onset of the VO word "สัตว์ยักษ์", L45 = G894 (the take 3 read).
 * SH06 spans G[849, 919). The creature is first inked at L24 and formed by L42; the reveal pose holds L53–L70.
 */
export const DREAM_LR = 45;
/** Dream undulation: one period 2.4 s (H11 8). SH07 and SH11 continue the SH06 clock so the phase does not snap at a cut. */
const DREAM_PERIOD_S = 2.4;
const dreamPhase = (t: number) => (2 * Math.PI * t) / DREAM_PERIOD_S;
/** Shot offsets on the SH06 clock: SH06 is 63 f; SH11 starts after SH07 (102), SH08 (150), SH09 (74), SH10 (46). */
const SH07_CLOCK_S = 70 / FPS;
const SH11_CLOCK_S = (70 + 114 + 171 + 63 + 62) / FPS;
const easeOut = (u: number) => 1 - (1 - clamp01(u)) * (1 - clamp01(u));

// ---------------------------------------------------------------- SH01: the hydrophone; rings keyed by arrival frame (R4)
/** Base train: arrivals every 15 f from L0 to L180 (13 rings); burst: an extra arrival at each envelope peak G93, G97, G101. */
const SH01_BASE = Array.from({length: 13}, (_, i) => i * 15);
const SH01_BURST = [93, 97, 101];
/** SH01 rings at shot-local frame `f`: each ring spawns at arrival - 30 with radius 900 -> 40 over 30 f (ease-in), then vanishes. */
export const sh01Rings = (f: number) => [...SH01_BASE, ...SH01_BURST].flatMap((arrive) => {
  const spawn = arrive - 30, age = f - spawn;
  return age < 0 || age >= 30 ? [] : [{spawn, arrive, r: ringRadius(age, 900, 40, 30), o: 0.25 + 0.75 * envAt(arrive)}];
});
const sh01Overlay: Overlay = ({tl, width, height, camera, opacity}) => {
  const f = L(tl);
  return (
    <>
      <CameraLayer camera={camera} width={width} height={height} opacity={opacity}>
        {sh01Rings(f).map((ring) => <Ring key={ring.arrive} cx={HYD.cx} cy={HYD.cy} r={ring.r} opacity={ring.o} />)}
      </CameraLayer>
      <CameraLayer camera={camera} width={width} height={height} blend="normal" opacity={opacity}>
        <DiagramTag x={540} y={745} anchor="middle" text="ไฮโดรโฟน = ไมค์ใต้น้ำ" opacity={at(f, 204, 212)} />
      </CameraLayer>
      <ScreenLayers opacity={opacity} />
    </>
  );
};
const SH01: PaintedShot = {
  id: 'bloop-sh01',
  serves: ['SH01'],
  paper: WATER_PAPER,
  camera: (tl) => pushCamera(tl, 224 / FPS, {s0: 1, s1: 1.06, fx: 540, fy: 560}),
  paint: (p) => {
    paintDeep(p);
    paintHydrophone(p, HYD.cx, HYD.cy);
  },
  screen: (p, {tl}) => paintSnow(p, tl),
  Overlay: sh01Overlay,
};

// ---------------------------------------------------------------- SH02: the equatorial microphones (map)
const FRONTS_SH02 = [136, 147, 158];
const DOT_DIST = DOTS.map(([x, y]) => Math.hypot(x - WF0[0], y - WF0[1]));
/** Dot flash (10 frames) when any front crosses the dot: a pure function of the shot clock. */
const dotFlash = (f: number, enters: number[]) => DOTS.map((_, i) => enters.reduce((m, enter) => {
  const c = frontCrossing(DOT_DIST[i], enter);
  return Math.max(m, pulse(f, c, c + 10));
}, 0));
const tremorRipples = (f: number) => [0, 1, 2].map((j) => {
  const start = 54 + 10 * j, u = at(f, start, start + 32);
  return {r: 140 * u, o: f >= start && f < start + 32 ? 0.8 * (1 - u) : 0};
});
const sh02Overlay: Overlay = ({tl, width, height, camera, opacity}) => {
  const f = L(tl);
  const flash = dotFlash(f, FRONTS_SH02).map((v, i) => Math.max(v, i === 3 ? pulse(f, 69, 79) : 0, i === 2 ? pulse(f, 82, 92) : 0));
  return (
    <>
      <MapWindow camera={camera} width={width} height={height}>
        <LandFill opacity={opacity} />
        <Coast opacity={opacity} />
        <Equator progress={at(f, 18, 34)} />
        <DiagramTag x={175} y={622} text="เส้นศูนย์สูตร" opacity={at(f, 24, 32) * opacity} />
        <MapDots points={DOTS} flash={flash} appear={DOTS.map((_, i) => at(f, 34 + 3 * i, 36 + 3 * i))} />
        <g transform="translate(560 760)" opacity={opacity}>
          {tremorRipples(f).map((r, j) => <circle key={j} cx={0} cy={0} r={r.r} fill="none" stroke="#f1e6c8" strokeWidth={2.4} opacity={r.o} />)}
        </g>
        <Wavefronts enters={FRONTS_SH02} f={f} opacity={opacity} />
      </MapWindow>
      <ScreenLayers opacity={opacity} />
    </>
  );
};
const SH02: PaintedShot = {
  id: 'bloop-sh02',
  serves: ['SH02'],
  paper: WATER_PAPER,
  camera: (tl) => pushCamera(tl, 175 / FPS, {s0: 1, s1: 1.06, fx: 540, fy: 640}),
  paint: (p) => paintMapOcean(p),
  Overlay: sh02Overlay,
};

// ---------------------------------------------------------------- SH03: very low, sped up 16x (wide rings + fixed clip train)
const CLIP_SH03 = 62;
/**
 * Clip-local frame where the SH03 clip starts: the sheets' in-point 2.20 s (R4, Editor's cue; MK-O5 closed). The clip's
 * loud event (clip frames 91-104) then lands at G430-G443, under "ถูกเร่ง 16 เท่า".
 */
export const CLIP_IN_SH03 = 66;
/** SH03 rings at shot-local frame `f`: two wide illustrative rings (silent) and a fixed train, every 6 f from L32 to L82. */
export const sh03Rings = (f: number) => {
  const wide = [4, 24].filter((s) => f >= s && f < s + 40).map((s) => ({key: `w${s}`, r: ringRadius(f - s, 600, 40, 40), o: 0.5}));
  const clip: {key: string; r: number; o: number}[] = [];
  for (let s = CLIP_SH03; s <= 104; s += 6) {
    if (f >= s && f < s + 30) clip.push({key: `c${s}`, r: ringRadius(f - s, 600, 40, 30), o: 0.25 + 0.75 * envAt(s - CLIP_SH03 + CLIP_IN_SH03)});
  }
  return [...wide, ...clip];
};
const sh03Overlay: Overlay = ({tl, width, height, camera, opacity}) => {
  const f = L(tl);
  return (
    <>
      <CameraLayer camera={camera} width={width} height={height} opacity={opacity}>
        {sh03Rings(f).map((ring) => <Ring key={ring.key} cx={HYD.cx} cy={HYD.cy} r={ring.r} opacity={ring.o} />)}
      </CameraLayer>
      <ScreenLayers opacity={opacity} />
    </>
  );
};
const SH03: PaintedShot = {
  id: 'bloop-sh03',
  serves: ['SH03'],
  paper: WATER_PAPER,
  camera: (tl) => pushCamera(tl, 119 / FPS, {s0: 1.5, s1: 1.56, fx: 540, fy: 560}),
  paint: (p) => {
    paintDeep(p);
    paintHydrophone(p, HYD.cx, HYD.cy);
  },
  screen: (p, {tl}) => paintSnow(p, tl),
  Overlay: sh03Overlay,
};

// ---------------------------------------------------------------- SH04: the real sound rises (illustrative line, no panel: FR07)
const sh04Overlay: Overlay = ({width, height, camera, opacity, tl}) => (
  <>
    <CameraLayer camera={camera} width={width} height={height} blend="normal" opacity={opacity}>
      <PatternLine box={[200, 440, 880, 760]} kind="bloop" reveal={at(L(tl), 8, 98)} glow={1} />
    </CameraLayer>
    <ScreenLayers opacity={opacity} />
  </>
);
const SH04: PaintedShot = {
  id: 'bloop-sh04',
  serves: ['SH04'],
  paper: WATER_PAPER,
  camera: (tl) => pushCamera(tl, 166 / FPS, {s0: 1, s1: 1.03, fx: 540, fy: 600}),
  paint: (p) => paintDeep(p),
  Overlay: sh04Overlay,
};

// ---------------------------------------------------------------- SH05: one sound, microphones 5,000 km apart
const FRONTS_SH05 = [20];
/** Camera (SH05): start s 1.06; pull to 1.00 over L46-L90; push to 1.04 over L92-L165. */
export const sh05Scale = (f: number) => {
  if (f < 46) return 1.06;
  if (f < 93) return lerp(1.06, 1, sineInOut((f - 46) / 47));
  if (f < 95) return 1;
  return lerp(1, 1.04, sineInOut((f - 95) / 70));
};
const sh05Overlay: Overlay = ({tl, width, height, camera, opacity}) => {
  const f = L(tl);
  const flash = DOTS.map((_, i) => Math.max(pulse(f, 28, 58), dotFlash(f, FRONTS_SH05)[i]));
  return (
    <>
      <MapWindow camera={camera} width={width} height={height}>
        <LandFill opacity={opacity} />
        <Coast opacity={opacity} />
        <Equator progress={1} />
        <DiagramTag x={175} y={622} text="เส้นศูนย์สูตร" opacity={opacity} />
        <MapDots points={DOTS} flash={flash} appear={DOTS.map(() => 1)} halo={DOTS.map((_, i) => (i === 0 || i === 5 ? pulse(f, 28, 90) : 0))} />
        <Wavefronts enters={FRONTS_SH05} f={f} opacity={opacity} />
      </MapWindow>
      <ScreenLayers opacity={opacity} />
    </>
  );
};
const SH05: PaintedShot = {
  id: 'bloop-sh05',
  serves: ['SH05'],
  paper: WATER_PAPER,
  camera: (tl) => ({s: sh05Scale(L(tl)), fx: 540, fy: 640, dx: 0, dy: 0}),
  paint: (p, {tl}) => paintMapOcean(p, {pale: 0.1 * at(L(tl), 137, 165)}),
  Overlay: sh05Overlay,
};

// ---------------------------------------------------------------- SH06: the internet's monster, head left (R4, FR03)
const sh06Overlay: Overlay = ({opacity}) => <ScreenLayers opacity={opacity} grade={false} />;
const SH06: PaintedShot = {
  id: 'bloop-sh06',
  serves: ['SH06'],
  paper: DREAM_PAPER,
  // MK-O6: s 1 -> 1.02 about (380, 440), so the head stays in y 350-840 and clear of label slot 1
  camera: (tl) => pushCamera(tl, 70 / FPS, {s0: 1, s1: 1.02, fx: 380, fy: 440}),
  paint: (p, {tl}) => {
    // the halo is centred on the head and body (about (480, 560)), not on the frame (FR03)
    paintDreamWater(p, 560, 480);
    const f = L(tl);
    const a = at(f, 24, 42);
    if (a <= 0) return;
    const drift = 40 * at(f, 24, 70);
    // H12: eyes shut while it forms; on the reveal word Lr the eyes open (4 f), the glow peaks at Lr+4 and settles to 0.6
    // by Lr+12, the jaw gapes over 8 f (ease-out), and the specks go from 0.4 to 1
    const lr = DREAM_LR;
    const eyes = at(f, lr, lr + 4);
    const glow = f < lr + 4 ? at(f, lr, lr + 4) : 1 - 0.4 * at(f, lr + 4, lr + 12);
    paintDreamCreature(p.layer(a, 4000), DREAM_PLACE(93.6 - drift), {
      rich: true, eyes, gape: easeOut(at(f, lr, lr + 8)), glow, phase: dreamPhase(tl), specks: f < lr ? 0.4 : 1,
    });
  },
  Overlay: sh06Overlay,
};

// ---------------------------------------------------------------- SH07: the direction points south; the ghost; the tapering arrow (FR06)
const sh07Overlay: Overlay = ({tl, width, height, camera, opacity}) => {
  const f = L(tl);
  const sway = f >= 28 && f < 75 ? 4 * Math.sin((2 * Math.PI * (f - 28)) / 40) * (1 - at(f, 28, 75)) : 0;
  return (
    <>
      <MapWindow camera={camera} width={width} height={height}>
        <LandFill opacity={opacity} />
        <Coast opacity={opacity} />
        <Equator progress={1} />
        <MapDots points={DOTS} flash={DOTS.map(() => pulse(f, 5, 15))} appear={DOTS.map(() => 1)} />
        <TaperArrow root={[545, 668]} len={1400 * sineInOut(at(f, 28, 56))} swayDeg={sway} phase={f} opacity={opacity} />
      </MapWindow>
      <ScreenLayers opacity={opacity} />
    </>
  );
};
const SH07: PaintedShot = {
  id: 'bloop-sh07',
  serves: ['SH07'],
  paper: WATER_PAPER,
  camera: (tl) => ({s: 1, fx: 540, fy: 640, dx: 0, dy: -60 * sineInOut(at(L(tl), 28, 79))}),
  paint: (p, {tl}) => {
    // the ghost is painted between the ocean's opaque underlayer and its translucent wash (VD08: it pales by alpha)
    const f = L(tl);
    // H13: the same rich drawing in the SH06 end pose (eyes open, gape 1); no glow or specks under the map dots
    const ghost = {rich: true, eyes: 1, gape: 1, glow: 0, phase: dreamPhase(SH07_CLOCK_S + tl), specks: 0};
    paintMapOcean(p, {opacity: 95, between: (q) => paintDreamCreature(tintPainter(q.layer(0.4, 5000), '#cfe0e8', 0.15 * at(f, 0, 114)), DREAM_AT_SH06_END, ghost)});
  },
  Overlay: sh07Overlay,
};

// ---------------------------------------------------------------- SH08: the sound channel (section, soft band FR08)
const sh08Overlay: Overlay = ({tl, width, height, camera, opacity}) => {
  const f = L(tl);
  const packet = (cx: number, cy: number, amp: number, o: number, key: string) => {
    const pts: Pt[] = Array.from({length: 41}, (_, i) => {
      const u = i / 40;
      return [cx - 150 + 300 * u, cy + amp * Math.sin(2 * Math.PI * 3 * u) * Math.sin(Math.PI * u)] as Pt;
    });
    return <path key={key} d={`M${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L')}`} fill="none" stroke={AMBER} strokeWidth={5} strokeLinecap="round" opacity={o} />;
  };
  const mainX = -150 + 1380 * at(f, 80, 165);
  const sideO = 0.6 * clamp01((480 - mainX) / 630);
  const glyphY = lerp(520, 700, easeOut(at(f, 104, 124)));
  return (
    <>
      <CameraLayer camera={camera} width={width} height={height} blend="screen" opacity={opacity}>
        <ChannelGlow y0={SECTION.bandTop} y1={SECTION.bandBottom} opacity={0.3 * at(f, 2, 24)} />
      </CameraLayer>
      <CameraLayer camera={camera} width={width} height={height} blend="normal" opacity={opacity}>
        <line x1={-200} y1={SECTION.surfaceY} x2={W + 200} y2={SECTION.surfaceY} stroke="#f1e6c8" strokeWidth={2} />
        <DiagramTag x={140} y={620} text="ช่องเสียงใต้ทะเล" opacity={at(f, 26, 34)} />
        {f >= 80 && f <= 165 && packet(mainX, SECTION.bandCentre, 24, 1, 'main')}
        {f >= 80 && f <= 165 && packet(mainX, 520, 16, sideO, 'up')}
        {f >= 80 && f <= 165 && packet(mainX, 810, 16, sideO, 'down')}
        <HydGlyph cx={760} cy={glyphY} k={0.34} opacity={at(f, 100, 104)} flash={pulse(f, 136, 144)} />
      </CameraLayer>
      <ScreenLayers opacity={opacity} />
    </>
  );
};
const SH08: PaintedShot = {
  id: 'bloop-sh08',
  serves: ['SH08'],
  paper: '#08131c',
  camera: (tl) => pushCamera(tl, 171 / FPS, {s0: 1, s1: 1.03, fx: 540, fy: 700}),
  paint: (p) => paintSection(p),
  Overlay: sh08Overlay,
};

// ---------------------------------------------------------------- SH09: years later, the Scotia Sea (map pan, no arrow)
const ANTARCTIC_DOTS: Pt[] = [mapXY(301.5, -62.8), mapXY(311, -58.3), mapXY(322, -58)];
export const sh09Camera = (tl: number): Camera => {
  const e = sineInOut(at(L(tl), 0, 55));
  return {s: 1, fx: 540, fy: 640, dx: 0 - 1020 * e, dy: -60 - 500 * e};
};
const sh09Overlay: Overlay = ({tl, width, height, camera, opacity}) => {
  const f = L(tl);
  return (
    <>
      <MapWindow camera={camera} width={width} height={height}>
        <LandFill opacity={opacity} />
        <Coast opacity={opacity} />
        <Equator progress={1} />
        <MapDots points={DOTS} flash={DOTS.map(() => 0)} appear={DOTS.map(() => 1)} />
        <MapDots points={ANTARCTIC_DOTS} flash={ANTARCTIC_DOTS.map(() => pulse(f, 55, 62))} appear={ANTARCTIC_DOTS.map((_, i) => at(f, 42 + 3 * i, 44 + 3 * i))} />
      </MapWindow>
      <ScreenLayers opacity={opacity} />
    </>
  );
};
const SH09: PaintedShot = {
  id: 'bloop-sh09',
  serves: ['SH09'],
  paper: WATER_PAPER,
  camera: sh09Camera,
  paint: (p) => paintMapOcean(p),
  screen: (p, {tl}) => paintSnow(p, tl, 40),
  Overlay: sh09Overlay,
};

// ---------------------------------------------------------------- SH10: two similar patterns (no panel: FR07)
const sh10Overlay: Overlay = ({tl, width, height, camera, opacity}) => {
  const f = L(tl);
  const joint = f >= 36 && f <= 46 ? 0.5 + 0.5 * Math.sin((Math.PI * (f - 36)) / 10) : 0;
  return (
    <>
      <CameraLayer camera={camera} width={width} height={height} blend="normal" opacity={opacity}>
        <PatternLine box={[150, 460, 470, 760]} kind="bloop" reveal={1} glow={joint} />
        <PatternLine box={[570, 460, 890, 760]} kind="ice" reveal={at(f, 3, 43)} color="#8fe3f2" glow={joint} />
      </CameraLayer>
      <ScreenLayers opacity={opacity} />
    </>
  );
};
const SH10: PaintedShot = {
  id: 'bloop-sh10',
  serves: ['SH10'],
  paper: WATER_PAPER,
  camera: (tl) => pushCamera(tl, 62 / FPS, {s0: 1, s1: 1.02, fx: 540, fy: 610}),
  paint: (p) => paintDeep(p),
  Overlay: sh10Overlay,
};

// ---------------------------------------------------------------- SH11: the imagined creature cracks into an iceberg (R4 placement)
/** The keel with its top row on the box top y 335 (R4: keep the box top); width 680 = the box x 360-1040. */
const placeTop = (pts: Pt[], top: number): Pt[] => {
  const m = Math.min(...pts.map((q) => q[1]));
  return pts.map(([x, y]) => [x, y + top - m] as Pt);
};
export const ICE_SH11 = placeTop(keelOutline(700, 0, 680, 3, 1), 335);
const FISSURES_SH11: Pt[][] = [
  [[700, 520], [640, 470], [560, 430], [470, 400]],
  [[700, 520], [760, 430], [860, 380], [930, 340]],
  [[700, 520], [690, 620], [620, 700], [560, 780]],
  [[700, 520], [800, 600], [880, 650], [960, 720]],
];
const sh11Overlay: Overlay = ({tl, width, height, camera, opacity}) => {
  const f = L(tl);
  return (
    <>
      <CameraLayer camera={camera} width={width} height={height} blend="screen" opacity={opacity}>
        <Fissures lines={FISSURES_SH11} progress={FISSURES_SH11.map((_, i) => at(f, 40 + i, 46 + i))} />
      </CameraLayer>
      <ScreenLayers opacity={opacity} />
    </>
  );
};
const SH11: PaintedShot = {
  id: 'bloop-sh11',
  serves: ['SH11'],
  paper: '#0a171d',
  camera: (tl) => pushCamera(tl, 117 / FPS, {s0: 1, s1: 1.03, fx: 700, fy: 520}),
  paint: (p, {tl}) => {
    const f = L(tl);
    paintDeep(p, {cold: true});
    // the faded creature (head left, R4 box x 355-895) drifts -10 px over L0-L49, then the ice takes its place
    const fade = 0.4 * (1 - at(f, 40, 58));
    // H13: the pre-crack creature uses the same rich drawing in the SH06 end pose (no glow, no specks)
    if (fade > 0) paintDreamCreature(p.layer(fade, 4000), DREAM_PLACE(386.6 - 10 * at(f, 0, 40), 0.79, 137.5), {
      rich: true, eyes: 1, gape: 1, glow: 0, phase: dreamPhase(SH11_CLOCK_S + tl), specks: 0,
    });
    const morph = at(f, 40, 58);
    if (morph > 0) {
      // the outline is inked only once the mass is nearly opaque: ink fades toward the plate paper, not the water behind
      paintIce(p.layer(morph, 6000), ICE_SH11, {id: 60, ink: morph >= 0.85});
      paintBlooms(p, FISSURES_SH11.map((l) => l[1]), 150, at(f, 58, 117), '#b8dbe6', 70);
    }
  },
  Overlay: sh11Overlay,
};

// ---------------------------------------------------------------- SH12: the icequake travels north (no box, soft channel: FR08)
/** SH12 (section): the reference keel at the surface line (top row on y 309 - 9 = 300), mirrored from SH11. */
export const ICE_SH12 = keelOutline(205, 309, 250, 3, -1);
/** SH12 bloom origins: four keel points pulled 40 % toward the keel's centre, so the blooms stay inside the ice. */
const SH12_BLOOM_ORIGINS: Pt[] = (() => {
  const cx = ICE_SH12.reduce((a, q) => a + q[0], 0) / ICE_SH12.length, cy = ICE_SH12.reduce((a, q) => a + q[1], 0) / ICE_SH12.length;
  const step = Math.ceil(ICE_SH12.length / 4);
  return ICE_SH12.filter((_, i) => i % step === 0).slice(0, 4).map(([x, y]) => [x + 0.4 * (cx - x), y + 0.4 * (cy - y)] as Pt);
})();
const SH12_CAP: Pt[] = [[132, 301], [136, 284], [160, 279], [196, 281], [228, 277], [262, 283], [276, 301]];
const sh12Overlay: Overlay = ({tl, width, height, camera, opacity}) => {
  const f = L(tl);
  const ringAge = f - 51;
  const ringR = ringRadius(Math.min(ringAge, 16), 0, 310, 16);
  const ringO = ringAge < 0 ? 0 : 1 - at(f, 67, 82);
  const pulseX = 200 + 560 * at(f, 67, 142);
  const pulseO = f >= 67 && f < 142 ? 1 : 0;
  return (
    <>
      <CameraLayer camera={camera} width={width} height={height} blend="screen" opacity={opacity}>
        <ChannelGlow y0={SECTION.bandTop} y1={SECTION.bandBottom} opacity={0.3} />
        <circle cx={200} cy={400} r={ringR} fill="none" stroke={AMBER} strokeWidth={3} opacity={0.3 * ringO} />
        {pulseO > 0 && <line x1={pulseX - 60} y1={SECTION.bandCentre} x2={pulseX + 60} y2={SECTION.bandCentre} stroke={AMBER} strokeWidth={6} opacity={0.3} />}
      </CameraLayer>
      <CameraLayer camera={camera} width={width} height={height} blend="normal" opacity={opacity}>
        <line x1={-200} y1={SECTION.surfaceY} x2={W + 200} y2={SECTION.surfaceY} stroke="#f1e6c8" strokeWidth={2} />
        <line x1={pulseX - 60} y1={SECTION.bandCentre} x2={pulseX + 60} y2={SECTION.bandCentre} stroke={AMBER} strokeWidth={4} opacity={pulseO * ringO} />
        <DiagramTag x={140} y={540} text="แผ่นดินไหวน้ำแข็ง (icequake)" opacity={at(f, 78, 86)} />
        <HydGlyph cx={760} cy={SECTION.bandCentre} k={0.34} flash={pulse(f, 142, 150)} />
        <g opacity={pulse(f, 215, 221)}>
          <line x1={196} y1={330} x2={204} y2={330} stroke="#f4feff" strokeWidth={3} />
          <line x1={200} y1={326} x2={200} y2={334} stroke="#f4feff" strokeWidth={3} />
        </g>
      </CameraLayer>
      <ScreenLayers opacity={opacity} />
    </>
  );
};
const SH12: PaintedShot = {
  id: 'bloop-sh12',
  serves: ['SH12'],
  paper: '#08131c',
  camera: (tl) => pushCamera(tl, 250 / FPS, {s0: 1, s1: 1.02, fx: 480, fy: 600}),
  paint: (p, {tl}) => {
    paintSection(p);
    paintIce(p, ICE_SH12, {id: 70, ink: false});
    paintBlooms(p, SH12_BLOOM_ORIGINS, 70, at(L(tl), 0, 60), '#5e91a3', 80);
    // the waterline cap: about one ninth of the berg, a low tabular shelf above the surface, brightest value
    p.flat('#b8dbe6', catmullClosed(SH12_CAP, 30));
    p.wash('#e3f3f7', 200, catmullClosed(SH12_CAP.slice(1, -1).map(([x, y]) => [x, y + 6] as Pt), 20), 0.1, 0.4);
  },
  Overlay: sh12Overlay,
};

// ---------------------------------------------------------------- SH13: the B10 hero ending (BLOOP-BRIEF-R5 H01-H08, R7 H09/H10)
/**
 * Canonical phase starts (shot-local frames): P1 far from the question onset + 2 f (R7-R2), P2 approach, P3 swallow the ice,
 * P4 swallow the hydrophone, P5 swallow the screen, P6 black hold, shot end. The plate is authored on this clock.
 */
export const SH13_CANONICAL = [160, 220, 256, 277, 307, 343, 373] as const;
/**
 * Phase boundaries in shot-local frames (same order as SH13_CANONICAL). Default = the BLOOP-SHEETS-R8 starts (G − 1696):
 * P1 218, P2 278, P3 314, P4 335, P5 365, P6 401, end 431, so the canonical clock is L − 58. The timeline may stretch them
 * to another read by setting these before render (interface only; the episode JSON field is not built).
 */
export const SH13_PHASE_BOUNDS: number[] = [218, 278, 314, 335, 365, 401, 431];
/** Piecewise-linear remap of actual shot-local frame `Lf` onto the canonical clock, from the phase boundaries. */
export const remapPhaseFrames = (Lf: number, actual: readonly number[], canonical: readonly number[] = SH13_CANONICAL): number => {
  if (Lf <= actual[0]) return canonical[0] - (actual[0] - Lf);
  for (let i = 0; i < actual.length - 1; i++) {
    if (Lf <= actual[i + 1]) return canonical[i] + ((Lf - actual[i]) * (canonical[i + 1] - canonical[i])) / (actual[i + 1] - actual[i]);
  }
  return canonical[canonical.length - 1] + (Lf - actual[actual.length - 1]);
};
/** PaintedShot.clock for SH13: canonical shot clock in seconds, remapped from the phase boundaries. */
export const sh13Clock = (tl: number) => remapPhaseFrames(L(tl), SH13_PHASE_BOUNDS) / FPS;
const [P1, P2, P3, P4, P5, P6] = SH13_CANONICAL;
/** The turn (H09): f14 of P2 the front head starts to fade in and the profile foreshortens; f24 it is fully in. */
const TURN = P2 + 14, TURN_END = P2 + 24;

/** The P1–P2 profile silhouette (H09): head centre, length, horizontal scale and tail phase at canonical frame `c`. */
export const sh13Profile = (c: number) => {
  // screen (960, 320) -> (820, 350) over P1, then (820, 350) -> (800, 360) over f0-14 of P2; world = screen + (160, 0)
  const at1 = at(c, P1, P2);
  if (c < P2) return {hx: lerp(1120, 980, at1), hy: lerp(320, 350, at1), len: lerp(230, 380, at1), sx: 1, bend: (2 * Math.PI * (c - P1)) / 51};
  const at2 = at(c, P2, TURN);
  return {hx: lerp(980, 960, at2), hy: lerp(350, 360, at2), len: lerp(380, 460, at2), sx: c < TURN ? 1 : lerp(1, 0.35, at(c, TURN, TURN_END)), bend: (2 * Math.PI * (c - P1)) / 51};
};
/** Front head mouth centre in world px (screen + (160, 0)): the turn at (950, 410), P2 end (930, 450), P3 (920, 470), P4 end (560, 610). */
export const sh13Mouth = (c: number): Pt => {
  const seg = (a: Pt, b: Pt, u: number): Pt => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
  if (c < TURN_END) return [950, 410];
  if (c < P3) return seg([950, 410], [930, 450], at(c, TURN_END, P3));
  if (c < P4) return seg([930, 450], [920, 470], at(c, P3, P4));
  return seg([920, 470], [560, 610], at(c, P4, P5));
};
/** Creature scale `k` (CP3 head scale; k 1.0 = the P4-end size, capped). H09: 0.30 at the turn, 0.30 -> 0.45 over f24-36. */
export const sh13K = (c: number) => {
  if (c < TURN_END) return 0.3;
  if (c < P3) return lerp(0.3, 0.45, at(c, TURN_END, P3));
  if (c < P4) return lerp(0.45, 0.55, at(c, P3, P4));
  return lerp(0.55, 1, at(c, P4, P5));
};
/** jawOpen (H09/H01): 0.6 at the turn, 0.6 -> 1 over f24-36, an optional gulp 1 -> 0.5 -> 1 in P3 (u 0.3-0.8), then 1. */
export const sh13Jaw = (c: number) => {
  if (c < TURN_END) return 0.6;
  if (c < P3) return lerp(0.6, 1, at(c, TURN_END, P3));
  if (c < P4) {
    const u = at(c, P3, P4);
    return u >= 0.3 && u <= 0.8 ? 1 - 0.5 * Math.sin((Math.PI * (u - 0.3)) / 0.5) : 1;
  }
  return 1;
};
/**
 * shadow (H09, R6): the front head at 0.6 through the turn, 0.6 -> 0.3 over f24-36, held 0.3 through P3, eases to 0 over P4.
 * The front head never shows a shadow above 0.6.
 */
export const sh13Shadow = (c: number) => {
  if (c < TURN_END) return 0.6;
  if (c < P3) return lerp(0.6, 0.3, at(c, TURN_END, P3));
  if (c < P4) return 0.3;
  return lerp(0.3, 0, at(c, P4, P5));
};
/** Throat aperture (H09): 0.4 from the turn, held to P5, then 0.4 -> 1 across P5 (H01). */
const sh13Aperture = (c: number) => (c < TURN ? 0 : c < P5 ? 0.4 : lerp(0.4, 1, at(c, P5, P6)));
/** The front head's fade-in over the turn (f14-24). */
const sh13HeadAlpha = (c: number) => at(c, TURN, TURN_END);

/**
 * The lip-line frame (H10, interim call 2026-10-30, for Film to confirm): the first P4 frame at which the upper lip has passed
 * over the hydrophone's top, i.e. the upper lip's world y at x = hyd.cx is at or above hyd.top (430). Computed from the
 * creature's real lip geometry at that frame's scale and centre; measured 293 (G1760). It throws when no P4 frame qualifies,
 * so the value is never a silent fallback (DF-20261030-lip-frame-silent-fallback).
 */
export const SH13_LIP_FRAME = (() => {
  const yAt = (lip: Pt[], x: number): number | null => {
    for (let i = 0; i + 1 < lip.length; i++) {
      const [x1, y1] = lip[i], [x2, y2] = lip[i + 1];
      if ((x1 <= x && x2 > x) || (x2 <= x && x1 > x)) return y1 + ((x - x1) * (y2 - y1)) / (x2 - x1);
    }
    return null;
  };
  for (let c = P4; c <= P5; c += 0.5) {
    const m = sh13Mouth(c);
    const y = yAt(crRealUpperLipWorld(m[0], m[1], 0.86 * sh13K(c)), HYD.cx);
    if (y !== null && y <= HYD.top[1]) return c;
  }
  throw new Error('SH13_LIP_FRAME: the upper lip never reaches the hydrophone top in P4 (BLOOP-BRIEF-R7 H10)');
})();

/** Camera (plate-owned, canonical clock): static to P5; P5 focus on the P4-end mouth, s 1 -> 3 (u^2), dy 0 -> +270, dx -160 -> -60. */
export const sh13Camera = (tl: number): Camera => {
  const c = L(tl);
  if (c < P5) return {s: 1, fx: 720, fy: 620, dx: -160, dy: 0};
  const e = at(c, P5, P6) ** 2;
  return {s: 1 + 2 * e, fx: 560, fy: 610, dx: -160 + 100 * e, dy: 270 * e};
};

/** FR09 far ice (R4 construction): lit until swallowed; its haze fades over P1-P3 (R7-C1). */
export const FAR_ICE: Pt[] = keelOutline(920, 470, 260, 3, 1);
const FAR_FISSURES: Pt[][] = [[[860, 420], [900, 470], [880, 515]], [[900, 470], [955, 440], [1010, 458]]];
const bbox = (pts: Pt[]) => {
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  return {x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys)};
};

/**
 * The swallowed ice (H10, P3 -> P4 start) and hydrophone (lip-line frame -> P5 start), drawn inside the mouth: after the throat
 * black and before the lower lip and teeth. The ice is scaled so its bounding box is at most 0.8 of the gum polygon's width
 * and height, centred on the throat, then shrinks 1 -> 0.4 and darkens to black. The hydrophone shrinks toward the throat
 * (1 -> 0.3), darkens to black by P5 start, and its cable fades to the water colour over 6 f from the lip-line frame.
 */
/**
 * Hydrophone pose inside the mouth (BLOOP-BRIEF-R7 H10, c293 pop fix): at the lip frame it stays at its outside pose (world
 * (540, 560), scale 1), so there is no jump; from the lip frame to P5 it eases (sine in-out) to the throat centre at P5 and
 * shrinks 1 -> 0.3. Its darkening to black runs with the same u.
 */
export const sh13HydPose = (c: number) => {
  const u = sineInOut(at(c, SH13_LIP_FRAME, P5));
  const m = sh13Mouth(P5);
  const t = crRealThroatCentre(m[0], m[1], 0.86 * sh13K(P5));
  return {cx: lerp(HYD.cx, t[0], u), cy: lerp(HYD.cy, t[1], u), k: lerp(1, 0.3, u), u};
};
/** Inside callback of the creature: `p` is the plate painter (the hydrophone at full plate alpha), `q` the throat layer (ice). */
const sh13Inside = (p: Painter, q: Painter, c: number, mouth: Pt, geomK: number) => {
  const throat = crRealThroatCentre(mouth[0], mouth[1], geomK);
  if (c >= P3 && c < P4) {
    const u = at(c, P3, P4);
    const gum = bbox(crRealGum(mouth[0], mouth[1], geomK));
    const ice = bbox(FAR_ICE);
    const fit = Math.min(1, (0.8 * (gum.x1 - gum.x0)) / (ice.x1 - ice.x0), (0.8 * (gum.y1 - gum.y0)) / (ice.y1 - ice.y0));
    const icx = (ice.x0 + ice.x1) / 2, icy = (ice.y0 + ice.y1) / 2;
    q.brush.push();
    q.brush.translate(throat[0], throat[1]);
    q.brush.scale(fit * lerp(1, 0.4, u));
    q.brush.translate(-icx, -icy);
    paintIce(q, FAR_ICE, {id: 80, ink: false});
    q.layer(u, 9100).flat('#000000', keelRing(FAR_ICE));
    q.brush.pop();
  }
  if (c >= SH13_LIP_FRAME && c < P5) {
    const pose = sh13HydPose(c);
    p.brush.push();
    p.brush.translate(pose.cx, pose.cy);
    p.brush.scale(pose.k);
    p.brush.translate(-HYD.cx, -HYD.cy);
    paintHydrophone(p, HYD.cx, HYD.cy, 1, {cableAlpha: 1 - at(c, SH13_LIP_FRAME, SH13_LIP_FRAME + 6)});
    p.layer(pose.u, 9200).flat('#000000', hydParts(HYD.cx, HYD.cy).body);
    p.brush.pop();
  }
};

const sh13Overlay: Overlay = ({tl, width, height, camera, opacity}) => {
  const c = L(tl);
  const ringR = 520 * (1 - (1 - at(c, -8, 144)) ** 2);
  const ringO = 1 - at(c, 130, 144);
  // R7-C1: the far-ice fissure glow only fades over P1-P3 (no pop, flash or pulse on the ice)
  const fissureOn = c < P1 ? 1 : 1 - at(c, P1, P3);
  return (
    <>
      <CameraLayer camera={camera} width={width} height={height} blend="screen" opacity={opacity}>
        <Fissures lines={FAR_FISSURES} progress={FAR_FISSURES.map(() => fissureOn)} opacity={fissureOn} />
        <Ring cx={920} cy={470} r={ringR} opacity={ringO} />
        <circle cx={HYD.cx} cy={HYD.cy} r={70} fill={AMBER} opacity={0.3 * pulse(c, 68, 75)} />
      </CameraLayer>
      <ScreenLayers opacity={opacity} />
      {/* DEP07: the black fade over the last 15 f of P5, then RGB 0 through P6 (no freeze) */}
      <AbsoluteFill style={{backgroundColor: '#000', opacity: clamp01((c - (P5 + (P6 - P5) - 15)) / 15)}} />
    </>
  );
};
const SH13: PaintedShot = {
  id: 'bloop-sh13',
  serves: ['SH13'],
  paper: WATER_PAPER,
  clock: sh13Clock,
  camera: sh13Camera,
  paint: (p, {tl}) => {
    const c = L(tl);
    paintDeep(p);
    // P1-P2: the profile silhouette, washes only, drawn before the far ice (beyond it) (H09)
    // the first creature frame is Qs + 2 f (R7-R2, kept in R8): the profile starts 2 f after P1
    if (c >= P1 + 2 && c < TURN_END) {
      const pr = sh13Profile(c);
      paintFarProfile(p, pr.hx, pr.hy, pr.len, pr.bend, {sx: pr.sx});
    }
    // the front head from the turn: the turn body trails behind it, then the silhouette and the detail at shadow
    if (c >= TURN) {
      const k = sh13K(c), mouth = sh13Mouth(c), place = crRealPlace(mouth[0], mouth[1], 0.86 * k), shadow = sh13Shadow(c), a = sh13HeadAlpha(c);
      const fade = a;
      paintTurnBody(p, mouth, crRealHeadWidth(0.86 * k), {alpha: fade * (1 - at(c, P3, P3 + 6))});
      const spine = shadow > 0.3 ? 0.5 : 1;
      if (shadow * fade > 0) paintCrSilhouette(p.layer(shadow * fade, 9000), place, spine);
      if ((1 - shadow) * fade > 0) {
        paintCrReal(p.layer((1 - shadow) * fade, 7000), place, {
          aperture: sh13Aperture(c), jawOpen: sh13Jaw(c), hatchScale: k, hatchAlpha: ramp(k, 0.5, 0.6),
          mottleAlpha: ramp(k, 0.5, 0.55), spineScale: spine,
          inside: (q) => sh13Inside(p, q, c, mouth, 0.86 * k),
        });
      }
    }
    // the far ice is in front of the creature until it is swallowed (P1-P2); the hydrophone is in front until the lip line
    if (c < P3) paintIce(p, FAR_ICE, {id: 80, haze: true, hazeAlpha: c < P1 ? 1 : 1 - at(c, P1, P3), ink: false});
    if (c < SH13_LIP_FRAME) paintHydrophone(p, HYD.cx, HYD.cy);
    paintSnow(p, tl, 60);
  },
  Overlay: sh13Overlay,
};

/** The thirteen BLOOP plates, appended to the registry (src/painted/registry.ts). */
export const bloopShots: PaintedShot[] = [SH01, SH02, SH03, SH04, SH05, SH06, SH07, SH08, SH09, SH10, SH11, SH12, SH13];
