import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {camMove, camOf} from '../kit/cam-moves';
import {paintFigureAt, VIEW_CUES_OFF} from '../kit/figure-at';
import type {Painter} from '../kit/painter';
import {Stamp} from '../kit/screen';
import {stampState} from '../kit/stamp';
import {ease, seg, type V3} from '../kit/space';
import {mixYCam, type YCam} from '../kit/ycam';
import {paintCar, paintFloat, paintPhone, woman} from './car';
import {Hud, hudAt} from './hud';
import {F0_CAM, FEET} from './sp1';
import {Painted} from './stage';

// SP3: freeze -> inset -> grow -> rewind (VD18, VD19, VD25; slot INSET x 760-1040, y 640-1138). SPIKE CODE.
// The interior story is ONE pure function of the story frame `s` (the global frame of B01-SH01..B03-SH03, 0..748): the same function draws frame 0, the
// frozen end pose (s = 748) and every rewind frame, so f1236 = story frame 0 by construction. Camera, paint clock and boil step all follow `s`.

export const STORY_END = 748;
export const INSET = {x: 760, y: 640, w: 280, h: 498, border: 6};
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const keys = (s: number, k: [number, number][]) => { // piecewise linear through [frame, value]
  if (s <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) if (s <= k[i][0]) return lerp(k[i - 1][1], k[i][1], (s - k[i - 1][0]) / (k[i][0] - k[i - 1][0]));
  return k[k.length - 1][1];
};
export type Story = {mode: 'stand' | 'float' | 'crouch'; rise: number; lift: number; roll: number; phone: V3 | null; light: number; display: string; face: 'neutral' | 'shock' | 'scared' | 'worried' | 'angry'};
export const storyAt = (s: number): Story => {
  const mode = s < 132 ? 'stand' : s < 260 ? 'float' : s < 680 ? 'crouch' : 'float';
  const flick = s >= 40 && s < 52 ? (Math.floor((s - 40) / 4) % 2 ? 0.35 : 0.85) : s >= 52 ? 0.85 : 1;
  const phone: V3 | null = s < 140 ? null : [keys(s, [[140, 0.05], [229, 0.3], [286, 0.2], [748, 0.1]]), keys(s, [[140, 1.15], [229, 1.75], [286, 2.0], [700, 2.1], [748, 2.0]]), -0.2];
  return {
    mode, light: flick,
    rise: keys(s, [[40, 0], [74, 0.25], [132, 0.45], [160, 1], [748, 1]]),
    lift: mode === 'stand' ? keys(s, [[40, 0], [75, 0.02], [132, 0.02], [160, 0.12]]) : mode === 'float' && s < 260 ? keys(s, [[160, 0.12], [229, 0.12], [260, 0]]) : mode === 'float' ? keys(s, [[680, 0], [732, 0.66], [748, 0.55]]) : 0,
    roll: keys(s, [[732, 0], [748, 160]]),
    phone,
    display: String(hudAt(s).counter),
    face: s < 42 ? 'neutral' : s < 140 ? 'shock' : s < 229 ? 'scared' : s < 696 ? 'worried' : s < 735 ? 'angry' : 'shock',
  };
};
export const paintStory = (p: Painter, cam: YCam, s: number) => {
  const st = storyAt(s), t = s / 30;
  paintCar(p, cam, {light: st.light, display: st.display, bell: 0.3});
  const at: V3 = [FEET[0], 0, FEET[2]];
  if (st.mode === 'stand') paintFigureAt(p, cam, woman(st.rise), {...VIEW_CUES_OFF, at: [at[0], st.lift, at[2]], pose: 'P10', face: st.face, t, shadow: st.lift > 0.005 ? false : undefined});
  else if (st.mode === 'crouch') paintFigureAt(p, cam, woman(st.rise), {...VIEW_CUES_OFF, at, pose: 'P35', face: st.face, t});
  else paintFloat(p, cam, {at, t, lift: st.lift, rise: st.rise, face: st.face, roll: st.roll});
  if (st.phone) paintPhone(p, cam, st.phone, 40 * t);
};

/** B04-SH01 camera (VD19): target (0, 1.30, -0.30), yaw 12 -> -8, r 2.40 -> 2.20, eye 1.40, f 1200, hy 760, over the shot's 71 frames. */
export const frozenCam = (u: number): YCam => camOf(camMove([0, 1.3, -0.3], [12, -8], [2.4, 2.2], 1.4, {f: 1200, hy: 760}), u);
export const INSET_U = (877 - 807) / 71;

export type Sp3 = {kind: 'live-shrink' | 'inset' | 'grow' | 'rewind'; s: number; cam: YCam; grade: number; box: {x: number; y: number; w: number; h: number; b: number}; hud: number; streak: number; paper: number};
export const sp3At = (f: number): Sp3 => {
  const full = {x: 0, y: 0, w: 1080, h: 1920, b: 0}, slot = {x: INSET.x, y: INSET.y, w: INSET.w, h: INSET.h, b: INSET.border};
  const mixBox = (k: number) => ({x: lerp(0, slot.x, k), y: lerp(0, slot.y, k), w: lerp(1080, slot.w, k), h: lerp(1920, slot.h, k), b: slot.b * k});
  if (f < 878) { const k = ease(seg(f, 866, 878)); return {kind: 'live-shrink', s: STORY_END, cam: frozenCam((f - 807) / 71), grade: 1, box: mixBox(k), hud: 1 - k, streak: 0, paper: k}; }
  if (f < 1211) return {kind: 'inset', s: STORY_END, cam: frozenCam(INSET_U), grade: 1, box: slot, hud: 0, streak: 0, paper: 1};
  if (f < 1221) { const k = 1 - ease(seg(f, 1211, 1221)); return {kind: 'grow', s: STORY_END, cam: frozenCam(INSET_U), grade: 1, box: mixBox(k), hud: 0, streak: 0, paper: k}; }
  // k = 1 must be exactly frame 0's camera (mixYCam is off by 1 ulp), so the camera snaps
  const k = ease(seg(f, 1221, 1236)), s = STORY_END * (1 - k);
  return {kind: 'rewind', s, cam: k >= 1 ? F0_CAM : mixYCam(frozenCam(INSET_U), F0_CAM, k), grade: 1 - k, box: full, hud: 1, streak: f >= 1236 ? 0 : 0.15 * Math.sin(Math.PI * seg(f, 1221, 1236)) + 0.05, paper: 0};
};

const Grade = ({k}: {k: number}) => (k > 0 ? <AbsoluteFill style={{background: '#bcd3e6', opacity: 0.25 * k, mixBlendMode: 'multiply', pointerEvents: 'none'}} /> : null);
/** The live interior with the frozen grade, full-frame logical size 1080 x 1920 (scaled into a box by the parent). */
const Live = ({st, hud = true}: {st: Sp3; hud?: boolean}) => (
  <div style={{width: 1080, height: 1920, position: 'relative', filter: `saturate(${1 - 0.5 * st.grade})`}}>
    <Painted band={false} frame0={Math.round(st.s)} paint={(p) => paintStory(p, st.cam, st.s)} paper="#20262c" grain={0.05}>
      <Grade k={st.grade} />
      {hud && st.hud > 0 && <HudAt s={st.s} opacity={st.hud} />}
    </Painted>
  </div>
);
const HudAt = ({s, opacity}: {s: number; opacity: number}) => { const h = hudAt(s); return <Hud counter={h.counter} needle={h.needle} pill={h.pill} opacity={opacity} />; };

const Streaks = ({a}: {a: number}) => (a > 0 ? <AbsoluteFill style={{pointerEvents: 'none'}}>{Array.from({length: 26}, (_, i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 40 + i * 73 + (i % 3) * 11, height: 2 + (i % 2), background: `rgba(255,255,255,${a})`}} />)}</AbsoluteFill> : null);

export const Sp3Comp = () => {
  const f = useCurrentFrame(), st = sp3At(f), b = st.box, inner = {w: b.w - 2 * b.b, h: b.h - 2 * b.b};
  const boxed = (child: React.ReactNode) => (
    <div style={{position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, boxSizing: 'border-box', border: `${b.b}px solid #fff`, boxShadow: b.b > 0 ? '0 6px 22px rgba(0,0,0,0.35)' : 'none', overflow: 'hidden', background: '#000'}}>
      <div style={{width: 1080, height: 1920, transformOrigin: '0 0', transform: `scale(${inner.w / 1080}, ${inner.h / 1920})`}}>{child}</div>
    </div>
  );
  const live = <Live st={st} />;
  const raster = <Img src={staticFile('edu11-spike/inset-f877.png')} style={{width: 1080, height: 1920}} />;
  const stamp = stampState(f - 1238, {land: 0, fadeAt: 37});
  return (
    <AbsoluteFill style={{background: '#20262c'}}>
      {/* sepia paper under the inset history; under the live scene it is hidden */}
      {st.paper > 0 && <AbsoluteFill style={{background: '#efe2c4', opacity: st.kind === 'live-shrink' ? st.paper : 1}} />}
      {st.kind === 'live-shrink' && boxed(live)}
      {st.kind === 'inset' && boxed(raster)}
      {st.kind === 'grow' && <><div style={{position: 'absolute', inset: 0}}>{live}</div>{boxed(raster)}</>}
      {st.kind === 'rewind' && live}
      <Streaks a={st.streak} />
      {f >= 1238 && stamp.visible && <Stamp text="แทบ" at={[905, 720]} size={[240, 200]} scale={stamp.scale} opacity={stamp.opacity} />}
    </AbsoluteFill>
  );
};
/** Raster source: the frozen interior at f877 exactly as the live shrink ends (no HUD, no band). Rendered once to `public/edu11-spike/inset-f877.png`. */
export const FreezeRaster = () => <Live st={{...sp3At(877), hud: 0, box: {x: 0, y: 0, w: 1080, h: 1920, b: 0}}} hud={false} />;
/** Story frame 0 with the post-rewind HUD (counter 20, needle 0): the pixel reference for f1236. */
export const StoryZeroHud = () => <Live st={{kind: 'rewind', s: 0, cam: F0_CAM, grade: 0, box: {x: 0, y: 0, w: 1080, h: 1920, b: 0}, hud: 1, streak: 0, paper: 0}} />;
