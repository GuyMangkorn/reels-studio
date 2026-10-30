import type {ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {CameraLayer, pushCamera, type Camera} from '../camera';
import {clamp01, lerp, ramp, type Pt} from '../painter';
import {envAt} from '../bloop/envelope';
import {DOTS, FPS, HYD, L, mapXY, ringRadius, SECTION, W, WF0, frontCrossing} from '../bloop/geometry';
import {crRealPlace, paintCrReal, paintDreamCreature} from '../bloop/creatures';
import {ChannelGlow, DiagramTag, Fissures, HydGlyph, PatternLine, Ring, ScreenLayers} from '../bloop/fx';
import {Coast, Equator, LandFill, MapDots, MapWindow, TaperArrow, Wavefronts} from '../bloop/map';
import {AMBER, DREAM_PAPER, catmullClosed, keelOutline, paintDeep, paintDreamWater, paintHydrophone, paintIce, paintMapOcean, paintSection, paintSnow} from '../bloop/sets';
import type {PaintedShot, ShotContext} from '../shot';

// BLOOP-EP01-SHORT plates (DEP01, Boss). One painted shot key per Mark shot (`bloop-sh01` … `bloop-sh13`, sheets
// BLOOP-SHEETS-R4). Each plate's camera, staging and timing are a pure function of its shot clock `tl`; the editor owns
// the cue times (painted.shots[].atSec / label), so a plate never reads the composition clock. Event frames below are
// shot-local L frames from the sheets. Pass 2 (BLOOP-BRIEF-R3 FR01-FR11, sheets R4) changed the look, not the times.

type Overlay = (props: ShotContext & {camera: Camera; opacity: number}) => ReactNode;

const sineInOut = (u: number) => (1 - Math.cos(Math.PI * clamp01(u))) / 2;
const easeOut = (u: number) => 1 - (1 - clamp01(u)) * (1 - clamp01(u));
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
        <DiagramTag x={540} y={745} anchor="middle" text="ไฮโดรโฟน = ไมค์ใต้น้ำ" opacity={at(f, 198, 206)} />
      </CameraLayer>
      <ScreenLayers opacity={opacity} />
    </>
  );
};
const SH01: PaintedShot = {
  id: 'bloop-sh01',
  serves: ['SH01'],
  paper: WATER_PAPER,
  camera: (tl) => pushCamera(tl, 216 / FPS, {s0: 1, s1: 1.06, fx: 540, fy: 560}),
  paint: (p) => {
    paintDeep(p);
    paintHydrophone(p, HYD.cx, HYD.cy);
  },
  screen: (p, {tl}) => paintSnow(p, tl),
  Overlay: sh01Overlay,
};

// ---------------------------------------------------------------- SH02: the equatorial microphones (map)
const FRONTS_SH02 = [121, 132, 143];
const DOT_DIST = DOTS.map(([x, y]) => Math.hypot(x - WF0[0], y - WF0[1]));
/** Dot flash (10 frames) when any front crosses the dot: a pure function of the shot clock. */
const dotFlash = (f: number, enters: number[]) => DOTS.map((_, i) => enters.reduce((m, enter) => {
  const c = frontCrossing(DOT_DIST[i], enter);
  return Math.max(m, pulse(f, c, c + 10));
}, 0));
const tremorRipples = (f: number) => [0, 1, 2].map((j) => {
  const start = 62 + 10 * j, u = at(f, start, start + 32);
  return {r: 140 * u, o: f >= start && f < start + 32 ? 0.8 * (1 - u) : 0};
});
const sh02Overlay: Overlay = ({tl, width, height, camera, opacity}) => {
  const f = L(tl);
  const flash = dotFlash(f, FRONTS_SH02).map((v, i) => Math.max(v, i === 3 ? pulse(f, 77, 87) : 0, i === 2 ? pulse(f, 90, 100) : 0));
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
  camera: (tl) => pushCamera(tl, 156 / FPS, {s0: 1, s1: 1.06, fx: 540, fy: 640}),
  paint: (p) => paintMapOcean(p),
  Overlay: sh02Overlay,
};

// ---------------------------------------------------------------- SH03: very low, sped up 16x (wide rings + fixed clip train)
const CLIP_SH03 = 32;
/**
 * Clip-local frame where the SH03 clip starts: the sheets' in-point 2.20 s (R4, Editor's cue; MK-O5 closed). The clip's
 * loud event (clip frames 91-104) then lands at G430-G443, under "ถูกเร่ง 16 เท่า".
 */
export const CLIP_IN_SH03 = 66;
/** SH03 rings at shot-local frame `f`: two wide illustrative rings (silent) and a fixed train, every 6 f from L32 to L82. */
export const sh03Rings = (f: number) => {
  const wide = [2, 22].filter((s) => f >= s && f < s + 40).map((s) => ({key: `w${s}`, r: ringRadius(f - s, 600, 40, 40), o: 0.5}));
  const clip: {key: string; r: number; o: number}[] = [];
  for (let s = CLIP_SH03; s <= 80; s += 6) {
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
  camera: (tl) => pushCamera(tl, 96 / FPS, {s0: 1.5, s1: 1.56, fx: 540, fy: 560}),
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
      <PatternLine box={[200, 440, 880, 760]} kind="bloop" reveal={at(L(tl), 8, 78)} glow={1} />
    </CameraLayer>
    <ScreenLayers opacity={opacity} />
  </>
);
const SH04: PaintedShot = {
  id: 'bloop-sh04',
  serves: ['SH04'],
  paper: WATER_PAPER,
  camera: (tl) => pushCamera(tl, 3.5, {s0: 1, s1: 1.03, fx: 540, fy: 600}),
  paint: (p) => paintDeep(p),
  Overlay: sh04Overlay,
};

// ---------------------------------------------------------------- SH05: one sound, microphones 5,000 km apart
const FRONTS_SH05 = [20];
/** Camera (SH05): start s 1.06; pull to 1.00 over L46-L90; push to 1.04 over L92-L165. */
export const sh05Scale = (f: number) => {
  if (f < 46) return 1.06;
  if (f < 90) return lerp(1.06, 1, sineInOut((f - 46) / 44));
  if (f < 92) return 1;
  return lerp(1, 1.04, sineInOut((f - 92) / 73));
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
  camera: (tl) => pushCamera(tl, 63 / FPS, {s0: 1, s1: 1.02, fx: 380, fy: 440}),
  paint: (p, {tl}) => {
    // the halo is centred on the head and body (about (480, 560)), not on the frame (FR03)
    paintDreamWater(p, 560, 480);
    const f = L(tl);
    const a = at(f, 28, 52);
    if (a <= 0) return;
    const drift = 40 * at(f, 28, 63);
    paintDreamCreature(p.layer(a, 4000), DREAM_PLACE(93.6 - drift));
  },
  Overlay: sh06Overlay,
};

// ---------------------------------------------------------------- SH07: the direction points south; the ghost; the tapering arrow (FR06)
const sh07Overlay: Overlay = ({tl, width, height, camera, opacity}) => {
  const f = L(tl);
  const sway = f >= 27 && f < 70 ? 4 * Math.sin((2 * Math.PI * (f - 27)) / 40) * (1 - at(f, 27, 70)) : 0;
  return (
    <>
      <MapWindow camera={camera} width={width} height={height}>
        <LandFill opacity={opacity} />
        <Coast opacity={opacity} />
        <Equator progress={1} />
        <MapDots points={DOTS} flash={DOTS.map(() => pulse(f, 7, 18))} appear={DOTS.map(() => 1)} />
        <TaperArrow root={[545, 668]} len={1400 * sineInOut(at(f, 27, 55))} swayDeg={sway} phase={f} opacity={opacity} />
      </MapWindow>
      <ScreenLayers opacity={opacity} />
    </>
  );
};
const SH07: PaintedShot = {
  id: 'bloop-sh07',
  serves: ['SH07'],
  paper: WATER_PAPER,
  camera: (tl) => ({s: 1, fx: 540, fy: 640, dx: 0, dy: -60 * sineInOut(at(L(tl), 27, 75))}),
  paint: (p, {tl}) => {
    // the ghost is painted between the ocean's opaque underlayer and its translucent wash (VD08: it pales by alpha)
    const f = L(tl);
    paintMapOcean(p, {opacity: 95, between: (q) => paintDreamCreature(q.layer(0.5 - 0.08 * at(f, 0, 102), 5000), DREAM_AT_SH06_END)});
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
  const mainX = -150 + 1380 * at(f, 60, 145);
  const sideO = 0.6 * clamp01((480 - mainX) / 630);
  const glyphY = lerp(520, 700, sineInOut(at(f, 85, 105)));
  return (
    <>
      <CameraLayer camera={camera} width={width} height={height} blend="screen" opacity={opacity}>
        <ChannelGlow y0={SECTION.bandTop} y1={SECTION.bandBottom} opacity={0.3 * at(f, 2, 24)} />
      </CameraLayer>
      <CameraLayer camera={camera} width={width} height={height} blend="normal" opacity={opacity}>
        <line x1={-200} y1={SECTION.surfaceY} x2={W + 200} y2={SECTION.surfaceY} stroke="#f1e6c8" strokeWidth={2} />
        <DiagramTag x={140} y={620} text="ช่องเสียงใต้ทะเล" opacity={at(f, 24, 32)} />
        {f >= 60 && f <= 145 && packet(mainX, SECTION.bandCentre, 24, 1, 'main')}
        {f >= 60 && f <= 145 && packet(mainX, 520, 16, sideO, 'up')}
        {f >= 60 && f <= 145 && packet(mainX, 810, 16, sideO, 'down')}
        <HydGlyph cx={760} cy={glyphY} k={0.34} opacity={at(f, 80, 84)} flash={pulse(f, 116, 124)} />
      </CameraLayer>
      <ScreenLayers opacity={opacity} />
    </>
  );
};
const SH08: PaintedShot = {
  id: 'bloop-sh08',
  serves: ['SH08'],
  paper: '#08131c',
  camera: (tl) => pushCamera(tl, 5, {s0: 1, s1: 1.03, fx: 540, fy: 700}),
  paint: (p) => paintSection(p),
  Overlay: sh08Overlay,
};

// ---------------------------------------------------------------- SH09: years later, the Scotia Sea (map pan, no arrow)
const ANTARCTIC_DOTS: Pt[] = [mapXY(301.5, -62.8), mapXY(311, -58.3), mapXY(322, -58)];
export const sh09Camera = (tl: number): Camera => {
  const e = sineInOut(at(L(tl), 0, 62));
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
        <MapDots points={ANTARCTIC_DOTS} flash={ANTARCTIC_DOTS.map(() => pulse(f, 66, 75))} appear={ANTARCTIC_DOTS.map((_, i) => at(f, 50 + 3 * i, 52 + 3 * i))} />
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
        <PatternLine box={[570, 460, 890, 760]} kind="ice" reveal={at(f, 3, 33)} color="#8fe3f2" glow={joint} />
      </CameraLayer>
      <ScreenLayers opacity={opacity} />
    </>
  );
};
const SH10: PaintedShot = {
  id: 'bloop-sh10',
  serves: ['SH10'],
  paper: WATER_PAPER,
  camera: (tl) => pushCamera(tl, 46 / FPS, {s0: 1, s1: 1.02, fx: 540, fy: 610}),
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
        <Fissures lines={FISSURES_SH11} progress={FISSURES_SH11.map((_, i) => at(f, 48 + i, 54 + i))} />
      </CameraLayer>
      <ScreenLayers opacity={opacity} />
    </>
  );
};
const SH11: PaintedShot = {
  id: 'bloop-sh11',
  serves: ['SH11'],
  paper: '#0a171d',
  camera: (tl) => pushCamera(tl, 98 / FPS, {s0: 1, s1: 1.03, fx: 700, fy: 520}),
  paint: (p, {tl}) => {
    const f = L(tl);
    paintDeep(p, {cold: true});
    // the faded creature (head left, R4 box x 355-895) drifts -10 px over L0-L49, then the ice takes its place
    const fade = 0.4 * (1 - at(f, 49, 67));
    if (fade > 0) paintDreamCreature(p.layer(fade, 4000), DREAM_PLACE(386.6 - 10 * at(f, 0, 49), 0.79, 137.5));
    const morph = at(f, 49, 67);
    if (morph > 0) {
      // the outline is inked only once the mass is nearly opaque: ink fades toward the plate paper, not the water behind
      paintIce(p.layer(morph, 6000), ICE_SH11, {id: 60, ink: morph >= 0.85});
    }
  },
  Overlay: sh11Overlay,
};

// ---------------------------------------------------------------- SH12: the icequake travels north (no box, soft channel: FR08)
/** SH12 (section): the reference keel at the surface line (top row on y 309 - 9 = 300), mirrored from SH11. */
export const ICE_SH12 = keelOutline(205, 309, 250, 3, -1);
const SH12_CAP: Pt[] = [[132, 301], [136, 284], [160, 279], [196, 281], [228, 277], [262, 283], [276, 301]];
const sh12Overlay: Overlay = ({tl, width, height, camera, opacity}) => {
  const f = L(tl);
  const ringAge = f - 29;
  const ringR = ringRadius(Math.min(ringAge, 16), 0, 310, 16);
  const ringO = ringAge < 0 ? 0 : 1 - at(f, 45, 60);
  const pulseX = 200 + 560 * at(f, 45, 91);
  const pulseO = f >= 45 && f < 91 ? 1 : 0;
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
        <DiagramTag x={140} y={540} text="แผ่นดินไหวน้ำแข็ง (icequake)" opacity={at(f, 54, 62)} />
        <HydGlyph cx={760} cy={SECTION.bandCentre} k={0.34} flash={pulse(f, 91, 99)} />
        <g opacity={pulse(f, 181, 188)}>
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
  camera: (tl) => pushCamera(tl, 196 / FPS, {s0: 1, s1: 1.02, fx: 480, fy: 600}),
  paint: (p) => {
    paintSection(p);
    paintIce(p, ICE_SH12, {id: 70, ink: false});
    // the waterline cap: about one ninth of the berg, a low tabular shelf above the surface, brightest value
    p.flat('#b8dbe6', catmullClosed(SH12_CAP, 30));
    p.wash('#e3f3f7', 200, catmullClosed(SH12_CAP.slice(1, -1).map(([x, y]) => [x, y + 6] as Pt), 20), 0.1, 0.4);
  },
  Overlay: sh12Overlay,
};

// ---------------------------------------------------------------- SH13: the answer, the question, the tease (CR-REAL, jawOpen, DEP07 black)
export const RISE_FROM: Pt = [720, 980], RISE_TO: Pt = [720, 620];
/** FR09: a small painted far iceberg (~260 px), haze-softened; dims under the question and is gone by L225. */
export const FAR_ICE: Pt[] = keelOutline(920, 470, 260, 3, 1);
const FAR_FISSURES: Pt[][] = [[[860, 420], [900, 470], [880, 515]], [[900, 470], [955, 440], [1010, 458]]];
/** Far-ice alpha: 1 to L162, dims to 30 % by L211 (K03), gone by L225. */
const farIce = (f: number) => (1 - 0.7 * at(f, 162, 211)) * (1 - at(f, 211, 225));
/** FR02 jawOpen: 0.25 over L225-L237 (a dark slit under the upper fangs), 0.25 -> 1 ease-out over L237-L249, then 1. */
const jawOpenAt = (f: number) => (f < 237 ? 0.25 : 0.25 + 0.75 * easeOut(at(f, 237, 249)));
/** Camera (plate-owned): static until L249; rush L249-L291 (s 1 -> 3, dy 0 -> +270); hold to the end (MK-O7: s 3). */
export const sh13Camera = (tl: number): Camera => {
  const f = L(tl);
  const e = at(f, 249, 291) ** 2;
  return {s: 1 + 2 * e, fx: 720, fy: 620, dx: -160, dy: 270 * e};
};
const sh13Overlay: Overlay = ({tl, width, height, camera, opacity}) => {
  const f = L(tl);
  const ice = farIce(f);
  const ringR = 520 * (1 - (1 - at(f, 64, 144)) ** 2);
  const ringO = 1 - at(f, 130, 144);
  return (
    <>
      <CameraLayer camera={camera} width={width} height={height} blend="screen" opacity={opacity}>
        <Fissures lines={FAR_FISSURES} progress={FAR_FISSURES.map(() => (ice > 0 ? 1 : 0))} opacity={ice} />
        <Ring cx={920} cy={470} r={ringR} opacity={ringO} />
        <circle cx={HYD.cx} cy={HYD.cy} r={70} fill={AMBER} opacity={0.3 * pulse(f, 104, 111)} />
      </CameraLayer>
      <ScreenLayers opacity={opacity} />
      <AbsoluteFill style={{backgroundColor: '#000', opacity: at(f, 291, 312)}} />
    </>
  );
};
const SH13: PaintedShot = {
  id: 'bloop-sh13',
  serves: ['SH13'],
  paper: WATER_PAPER,
  camera: sh13Camera,
  paint: (p, {tl}) => {
    const f = L(tl);
    paintDeep(p);
    const ice = farIce(f);
    if (ice > 0) paintIce(p.layer(ice, 8000), FAR_ICE, {id: 80, haze: true, ink: false});
    const a = at(f, 225, 237);
    if (a > 0) {
      const mouth = lerp(RISE_FROM[1], RISE_TO[1], easeOut(at(f, 225, 249)));
      const place = crRealPlace(RISE_FROM[0], mouth);
      // throat black opens to the lip line from 20 % of the rush (aperture 0 -> 1, VD11); the jaw opens by FR02
      paintCrReal(p.layer(a, 7000), place, {aperture: ramp(at(f, 249, 291), 0.2, 1), jawOpen: jawOpenAt(f)});
    }
    // FR10: the hydrophone is opaque and dark, in front of the creature (draw order), a foreground silhouette
    paintHydrophone(p, HYD.cx, HYD.cy);
    paintSnow(p, tl, 60);
  },
  Overlay: sh13Overlay,
};

/** The thirteen BLOOP plates, appended to the registry (src/painted/registry.ts). */
export const bloopShots: PaintedShot[] = [SH01, SH02, SH03, SH04, SH05, SH06, SH07, SH08, SH09, SH10, SH11, SH12, SH13];
