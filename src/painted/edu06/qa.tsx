import {useCallback, type ReactElement} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {ANIMALS, drawAnimal, type AnimalAnchors, type AnimalPose} from '../kit/animals';
import {animalMotion, animalMotionDuration, type AnimalMotionId} from '../kit/animal-motions';
import {paintCatFace} from '../kit/catface';
import {paintEyeMacro} from '../kit/eye';
import {glareGrade, glarePainter} from '../kit/glare';
import {GlareVeil, GlowPass} from '../kit/glow';
import {paintVisitorHand} from '../kit/hands';
import {makePainter, tintPainter, type Painter, type Pt} from '../kit/painter';
import {Grain} from '../kit/screen';
import {seatedPose} from '../kit/poses-seated';
import {orbitYCam, camPoint, camUnit, type YCam} from '../kit/ycam';
import {hardFill, inkLine, ell} from '../kit/draw';
import {paintOwn} from './cast';
import {catItem, LR, paintRoom, type RoomLightState} from './room';
import {RoomLight} from './room-light';
import {camB01SH04, camB02SH03, camB04SH03, camB04SH05, camB05SH02, camB05SH03, glareB02SH03, paintB01SH04, paintB02SH03, paintB04SH03, paintB04SH05, paintB05SH02, paintB05SH03, SHOT_LEN} from './shots';

// EDU-EP06-SHORT Boss W5.2 element checks (standalone entry qa-index.ts, not in the registry): cat controls K1-K8, SET-LIVINGROOM night and day,
// the eye and glare grade, the visitor hand and the glow pass. Render: printf 'EDU6-QA-ROOM-NIGHT 0 out/edu06/boss/room-night.png\n' |
// node scripts/stills.mjs src/painted/edu06/qa-index.ts
const FPS = 30, DEG = Math.PI / 180, PAPER = '#3a2f2a';
type PaintFn = (p: Painter, frame: number) => void;

const Plate = ({paint, overlay, bg = PAPER}: {paint: PaintFn; overlay?: (frame: number) => ReactElement | null; bg?: string}) => {
  const frame = useCurrentFrame();
  const fn = useCallback(({brush, frame: f}: PaintContext) => paint(makePainter(brush, {t: f / FPS, frame: f, fade: bg}), f), [paint, bg]);
  return (
    <AbsoluteFill style={{background: bg}}>
      <BrushCanvas paint={fn} paper={bg} />
      {overlay?.(frame)}
      <Grain opacity={0.06} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------------ room (night / day)
const roomCam = (frame: number, n: number): YCam => { const e = 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, frame / Math.max(1, n - 1))); return {...orbitYCam([0.55, 0.78, 0.1], 2.9 - 0.2 * e, (14 - 8 * e) * DEG, 1.0, 900, 800), cx: 0}; };
const OWNCAT = (light: RoomLightState) => (p: Painter, frame: number) => {
  const c = roomCam(frame, 30), t = frame / FPS;
  paintRoom(p, c, {t, light, cast: [
    catItem(LR.armchairSeat, {view: 'right', state: 'sit', lid: 0.55, ears: 0.1}, t, 'armchair'),
    catItem(LR.armLanding, {view: 'left', state: 'stand', lid: 0.2}, t, 'arm'),
    {at: LR.ownFeet, draw: (q, cc) => { paintOwn(q, cc, {at: LR.ownFeet, view: 'front', pose: 'P31', face: 'neutral', faceState: {eyes: 'wide', look: [0.6, 0]}, t, warm: light === 'night' ? 0.08 : 0}); }},
  ]});
};
export const QA_ROOM_NIGHT = () => <Plate paint={OWNCAT('night')} overlay={(f) => <RoomLight cam={roomCam(f, 30)} light="night" />} />;
// day cutaway: the cat on the rug, a visitor's forearm at T-STRANGER-HAND (screen-space card at the palm)
const dayCam = (): YCam => ({...orbitYCam([0.2, 0.55, 0.9], 1.7, 8 * DEG, 0.55, 1000, 900)});
export const QA_ROOM_DAY = () => <Plate paint={(p, frame) => {
  const c = dayCam(), t = frame / FPS;
  paintRoom(p, c, {t, light: 'day', cast: [catItem(LR.dayCat, {view: 'left', state: 'stand', lean: 0.8, leanTo: [0.22, 0.2], contact: 1}, t, 'floor')]});
  const w = camPoint(c, LR.visitorHand), u = camUnit(c, LR.visitorHand);
  if (w) paintVisitorHand(p, {base: 30000, wrist: [w[0] + 0.0 * u, w[1]], dir: Math.PI + 0.3, size: 0.9 * (u / 700), side: -1});
}} overlay={() => <RoomLight cam={dayCam()} light="day" />} />;

// ------------------------------------------------------------------------------------------------ cat controls sheet (K1-K3, K6, K8)
const CAT = ANIMALS['cat-orange-tabby'];
const cell = (p: Painter, i: number, cols: number, pose: AnimalPose, label: string, unit = 640, t = 0.3) => {
  const cw = 1080 / cols, x = (i % cols) * cw + cw / 2, y = 120 + Math.floor(i / cols) * 360 + 300;
  hardFill(p, 100 + i, '#4a3d36', [[x - cw / 2 + 4, y - 296], [x + cw / 2 - 4, y - 296], [x + cw / 2 - 4, y + 40], [x - cw / 2 + 4, y + 40]]);
  inkLine(p, 200 + i, [[x - cw * 0.4, y], [x + cw * 0.4, y]], {weight: 1.2, color: '#e8d8b8', closed: false});
  drawAnimal(p, 911, CAT, [x, y], unit, pose, t);
  void label;
};
export const QA_CATS = () => <Plate paint={(p) => {
  const L: [AnimalPose, string][] = [
    [{view: 'right', state: 'sit'}, 'sit'], [{view: 'right', state: 'sit', lid: 0.55}, 'lid .55'], [{view: 'right', state: 'sit', lid: 1}, 'lid 1'],
    [{view: 'front', state: 'sit', lid: 0}, 'front lid 0'], [{view: 'front', state: 'sit', lid: 0.55}, 'front .55'], [{view: 'front', state: 'sit', lid: [0.2, 0.9]}, 'front .2/.9'],
    [{view: 'right', state: 'sit', ears: 0}, 'ears 0'], [{view: 'right', state: 'sit', ears: 1}, 'ears 1'], [{view: 'front', state: 'sit', ears: 1}, 'front ears 1'],
    [{view: 'right', state: 'stand', headDown: 1}, 'headDown'], [{view: 'right', state: 'stand', lean: 1, leanTo: [0.3, 0.3]}, 'lean'], [{view: 'right', state: 'lie', curl: 1, lid: 0.55}, 'curl'],
  ];
  L.forEach(([pose, label], i) => cell(p, i, 3, pose, label, 520));
}} />;
export const QA_CATS2 = () => <Plate paint={(p) => {
  const L: [AnimalPose, string][] = [
    [{view: 'right', state: 'lie', curl: 1, tailTo: [0.2, 0.24], lid: 0.55}, 'curl+tailTo'], [{view: 'right', state: 'lie', curl: 0.5}, 'curl .5'], [{view: 'right', state: 'lie'}, 'lie'],
    [{view: 'right', state: 'stand', contact: 1}, 'contact'], [{view: 'front', state: 'stand', headDown: 1}, 'front headDown'], [{view: 'left', state: 'sit', ears: 1, lid: 0.5}, 'left airplane'],
  ];
  L.forEach(([pose, label], i) => cell(p, i, 3, pose, label, 520));
}} />;

// ------------------------------------------------------------------------------------------------ motions: step-up strip, head-rub
const armBox = (p: Painter, g: Pt, u: number) => { // sofa arm top 0.18 m over the armchair seat, starting at x0 (the seat ends 0.02 m before it)
  const x0 = g[0], top = g[1] - 0.18 * u;
  hardFill(p, 300, '#4f6f6a', [[x0, top], [x0 + 1.4 * u, top], [x0 + 1.4 * u, g[1] + 0.3 * u], [x0, g[1] + 0.3 * u]]);
  hardFill(p, 301, '#c8a26a', [[x0 - 1.4 * u, g[1]], [x0 - 0.02 * u, g[1]], [x0 - 0.02 * u, g[1] + 0.3 * u], [x0 - 1.4 * u, g[1] + 0.3 * u]]);
  inkLine(p, 302, [[x0 - 1.4 * u, g[1]], [x0 - 0.02 * u, g[1]]], {weight: 1.2, color: '#5a3a1a', closed: false});
  inkLine(p, 303, [[x0, top], [x0 + 1.4 * u, top]], {weight: 1.2, color: '#1f3330', closed: false});
};
export const STEP_FRAMES = 40;
export const QA_STEPUP = () => <Plate paint={(p, frame) => {
  const U = 700, g0: Pt = [560, 1100], t = frame / FPS;
  armBox(p, [g0[0] - 0.4 * U + 0.28 * U - 0.0 * U, g0[1]], U);
  const m = animalMotion('step-up', t, {animal: 'cat-orange-tabby', view: 'right'});
  const walk = t - animalMotionDuration('step-up', {animal: 'cat-orange-tabby'});
  const gx = g0[0] - 0.4 * U + m.offset[0] * U, gy = g0[1] - m.offset[1] * U;
  drawAnimal(p, 911, CAT, [gx, gy], U, m.pose, t);
  void walk;
}} />;
export const RUB_TARGET: [number, number] = [0.2, 0.3];
export const RUB_UNIT = 1200, RUB_G: Pt = [440, 1300];
export const QA_RUB = () => <Plate paint={(p, frame) => {
  const t = frame / FPS, dur = animalMotionDuration('head-rub', {animal: 'cat-orange-tabby'});
  const m = animalMotion('head-rub', Math.min(t, dur), {animal: 'cat-orange-tabby', view: 'right', target: RUB_TARGET});
  const a: AnimalAnchors = {};
  drawAnimal(p, 911, CAT, RUB_G, RUB_UNIT, m.pose, t, a);
  const hx = RUB_G[0] + RUB_TARGET[0] * RUB_UNIT, hy = RUB_G[1] - RUB_TARGET[1] * RUB_UNIT;
  hardFill(p, 400, '#d9a077', ell(hx + 60, hy - 10, 150, 38, 20, -0.15) as Pt[]); // her palm (still)
  if (a.top) hardFill(p, 401, '#7ad', ell(a.top[0], a.top[1], 6, 6, 8) as Pt[]);
}} />;

// ------------------------------------------------------------------------------------------------ eye lid states + glare blend
const eyeCam = (): YCam => ({...orbitYCam([0, 0, 0], 0.3, -4.5 * DEG, 0, 1000, 880), pitch: 0});
const warm = (p: Painter) => tintPainter(p, '#ffb060', 0.14, {mul: [1.04, 0.98, 0.9], brush: true});
const EYE_STATES = [{lid: 1.3, lift: 0}, {lid: 1, lift: 0}, {lid: 0.75, lift: 1}, {lid: 0, lift: 0.2}] as const;
export const QA_EYE = () => <Plate bg="#3a2f2a" paint={(p, frame) => { const st = EYE_STATES[Math.min(3, frame)]; paintEyeMacro(warm(p), eyeCam(), {t: 1, u: 0, mist: false, catch: 'warm', lid: st.lid, lift: st.lift}); }} />;
/** Grade 0, 0.5, 1 as frames 0..2 (the glare blend: warm -> sharp catchlight and brow shadow, no pop). */
export const QA_GLARE = () => <Plate bg="#3a2f2a" paint={(p, frame) => { const g = [0, 0.5, 1][Math.min(2, frame)]; paintEyeMacro(glarePainter(warm(p), g), eyeCam(), {t: 1, u: 0, mist: false, catch: 'warm', lid: 1.3, glare: g}); }}
  overlay={(f) => <GlareVeil g={[0, 0.5, 1][Math.min(2, f)]} />} />;
export const QA_GRADE = (f: number) => glareGrade(f, {start: 12, drainAt: 140});

// ------------------------------------------------------------------------------------------------ cat face with the glow pass
export const QA_GLOW = () => <Plate paint={(p, frame) => paintCatFace(p, {r: 14, f: 1000, hy: 820}, {lid: 0.58, pupil: 0.35, ears: 0.05, whiskers: 0, yaw: 0, brow: 1}, {t: frame / FPS, halo: 0.7})}
  overlay={(f) => (<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, mixBlendMode: 'screen'}}><GlowPass x={760} y={760} u={f / 29} seed={5} /></svg>)} />;
export const QA_SEATED = () => <Plate paint={(p, frame) => {
  const c: YCam = orbitYCam([0, 0.8, 0], 2.2, 0, 0.9, 1000, 900), g = camPoint(c, [0, 0, 0]), u = camUnit(c, [0, 0, 0]);
  if (!g) return;
  const ids = ['seated-lean-in', 'seated-offer-palm'] as const;
  void frame;
  paintOwn(p, c, {at: [-0.45, 0, 0], view: 'front', face: 'happy', t: 0, fig: {...seatedPose(ids[0], PEOPLE_OWN(), camPoint(c, [-0.45, 0, 0]) ?? g, u, 'front', {amount: 1})}});
  paintOwn(p, c, {at: [0.45, 0, 0], view: 'front', face: 'happy', t: 0, fig: {...seatedPose(ids[1], PEOPLE_OWN(), camPoint(c, [0.45, 0, 0]) ?? g, u, 'front', {toward: 1})}});
}} />;
import {OWN} from './cast';
const PEOPLE_OWN = () => OWN;

// ------------------------------------------------------------------------------------------------ shot proofs (W5.2 round 2): frame = the sheet's shot-local L
export const SHOT_PROOFS = {
  B01SH04: SHOT_LEN.B01SH04, B02SH03: SHOT_LEN.B02SH03, B04SH03: SHOT_LEN.B04SH03, B04SH05: SHOT_LEN.B04SH05, B05SH02: SHOT_LEN.B05SH02, B05SH03: SHOT_LEN.B05SH03,
} as const;
export const QA_B01SH04 = () => <Plate paint={(p, L) => { paintB01SH04(p, L); }} overlay={(L) => <RoomLight cam={camB01SH04(L)} />} />;
export const QA_B02SH03 = () => <Plate paint={(p, L) => { paintB02SH03(p, L); }} overlay={(L) => <><RoomLight cam={camB02SH03(L)} /><GlareVeil g={glareB02SH03(L)} /></>} />;
export const QA_B04SH03 = () => <Plate paint={(p, L) => { paintB04SH03(p, L); }} overlay={(L) => <RoomLight cam={camB04SH03(L)} />} />;
export const QA_B04SH05 = () => <Plate paint={(p, L) => { paintB04SH05(p, L); }} overlay={(L) => <RoomLight cam={camB04SH05(L)} />} />;
export const QA_B05SH02 = () => <Plate paint={(p, L) => { paintB05SH02(p, L); }} overlay={(L) => <RoomLight cam={camB05SH02(L)} />} />;
export const QA_B05SH03 = () => <Plate paint={(p, L) => { paintB05SH03(p, L); }} overlay={(L) => <RoomLight cam={camB05SH03(L)} />} />;

/** BOSS-7: the S01-B04-SH01 end frame as the sheet builds it (halo in the face painter, motes 0, the glow pass over it) against the approved LF02 (motes 0.9 inside the face painter). */
export const QA_LF02M = () => <Plate paint={(p, frame) => paintCatFace(p, {r: 13, f: 1000, hy: 820}, {lid: 0.58, pupil: 0.35, ears: 0.05, whiskers: 0, yaw: 0, brow: 1}, {t: frame / FPS, halo: 0.7, motes: 0})}
  overlay={(f) => (<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, mixBlendMode: 'screen'}}><GlowPass x={460} y={760} u={0.35 + f * 0.01} seed={5} level={0.3} r={300} travel={640} /></svg>)} />;
