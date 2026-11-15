import type {FigAnchors} from '../kit/cast';
import {ell, hardFill} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, orbitYCam, type YCam} from '../kit/ycam';
import {paintMitten} from './cast';
import {COOL, mix, startOf, traceAt, type ShotId} from './clock';
import {paintRoof, RF, ROOF, type RoofState} from './roof';
import {lowFalloff, SH01_AT, woman, type WomanOpts} from './scenes-roof';

// EDU-EP16-SHORT shot staging helpers (Boss W5.2, 2026-11-15; timed sheet EDU-EP16-SHEETS-R2 "Units, clocks and conventions"). The sheet writes every
// roof camera as `orbit(target, r, az, eye, f, hy, pitch)` = pitched(orbitYCam(target, r, az deg, eye, f, hy), pitch deg, hy), az 0 = camera on +z
// looking north, negative toward -x, pitch + looks up. A move between two orbits mixes the orbit parameters (not the camera positions), so an arc stays
// an arc and a push stays on its axis. `roofState` is the roof state of a shot at composition frame G: the blip clock, the grade chapter, lamp on.

const DEG = Math.PI / 180;
/** One orbit camera line of the sheet. Angles in degrees. */
export type Orbit = {at: V3; r: number; az: number; eye: number; f: number; hy: number; pitch: number; near?: number; cx?: number};
export const orbit = (o: Orbit): YCam => ({...orbitYCam(o.at, o.r, o.az * DEG, o.eye, o.f, o.hy), pitch: o.pitch * DEG, hy: o.hy, cx: o.cx ?? 0, ...(o.near !== undefined ? {near: o.near} : {})});
/** Orbit between two sheet lines at k 0..1 (pass an eased k). */
export const orbitMix = (a: Orbit, b: Orbit, k: number): YCam => orbit({
  at: [mix(a.at[0], b.at[0], k), mix(a.at[1], b.at[1], k), mix(a.at[2], b.at[2], k)], r: mix(a.r, b.r, k), az: mix(a.az, b.az, k), eye: mix(a.eye, b.eye, k),
  f: mix(a.f, b.f, k), hy: mix(a.hy, b.hy, k), pitch: mix(a.pitch, b.pitch, k),
  ...(a.near !== undefined || b.near !== undefined ? {near: mix(a.near ?? b.near!, b.near ?? a.near!, k)} : {}), cx: mix(a.cx ?? 0, b.cx ?? 0, k),
});

/** Roof state of shot `id` at composition frame G (sheet "Every roof shot": lamp and button lit until SH21 +6, blip until f672, flat from f675). The
 * blip spike sits at the trace's centre-left (`blip` 0.42, the LF-ROOF position) and rises and decays over 3 f on each spike frame. */
export const roofState = (id: ShotId, G: number, o: Partial<RoofState> = {}): RoofState => ({
  t: 0.4 + G / 30, lamp: true, blip: 0.42, cool: COOL[id] ?? 0, ...traceAt(G), ...o,
});
/** Shot-local frame L of a composition frame G. */
export const localOf = (id: ShotId, G: number) => G - startOf(id);

// ---------- the roof with her (LF-ROOF generalised for the timed roof shots) ----------
/** LF-ROOF's woman (W3 v9, approved): side-on `left` at SH01_AT, happy, right hand out over the button, left mitten resting on her knee. */
export const LF_WOMAN: WomanOpts = {face: 'happy', at: SH01_AT, view: 'left', reach: [-0.31, 0.43, 0.33], look: [-0.55, 0.3], warm: 0.35, mitts: [{hand: 'l', kind: 'rest', side: 1, skin: '#b39e8b'}]};
/** Paint the roof set, her (LF_WOMAN overridden by `w`) and the pointing mitten over the reply box (`point`: world aim, the fingertip stops just short
 * of it; null = no pointing mitten); `fall` the low falloff [y0, alpha] (LF-ROOF [1150, 60]). Returns her anchors. Same paint order as `paintLFRoof`. */
export const paintRoofWoman = (p: Painter, c: YCam, s: RoofState, o: {w?: Partial<WomanOpts>; point?: V3 | null; pointSkin?: string; fall?: [number, number] | null; /** repaint the lit button cap over the falloff (an emitter, not lit by the lamp) */ relight?: boolean} = {}): FigAnchors | null => {
  const out: {a?: FigAnchors | null} = {}, w = {...LF_WOMAN, ...(o.w ?? {})} as WomanOpts;
  paintRoof(p, c, s, {replyAfter: true, cast: [woman(c, w, out)]});
  const aim = o.point === undefined ? [ROOF.button[0], ROOF.button[1] + 0.01, ROOF.button[2]] as V3 : o.point;
  if (out.a && aim) paintMitten(p, out.a, {hand: 'r', kind: 'point', side: 1, skin: o.pointSkin ?? '#b8a28e', unit: camUnit(c, w.at ?? SH01_AT), seed: 53100, aim: camPoint(c, aim) ?? undefined});
  const fall = o.fall === undefined ? [1150, 60] : o.fall;
  if (fall) lowFalloff(p, 53080, fall[0], fall[1]);
  if (o.relight && s.lamp) relightButton(p, c);
  return out.a ?? null;
};

/** The lit button cap again, over the low falloff (the button is a light, the falloff is the lamp's light dying off): the cap and its highlight. */
export const relightButton = (p: Painter, c: YCam) => {
  const b = ROOF.button, cap = Array.from({length: 20}, (_, k): V3 => [b[0] + 0.0175 * Math.cos((k / 20) * 6.283), b[1] + 0.006, b[2] + 0.0175 * Math.sin((k / 20) * 6.283)]).map((v) => camPoint(c, v));
  if (cap.some((v) => !v)) return;
  hardFill(p, 54190, RF.button, cap as Pt[]);
  const q = camPoint(c, [b[0], b[1] + 0.008, b[2]]), u = camUnit(c, b);
  if (q) hardFill(p, 54191, mixColor(RF.button, '#fff1d6', 0.45), ell(q[0] - Math.min(10, 0.005 * u), q[1] - Math.min(2, 0.001 * u), Math.min(12, 0.007 * u), Math.min(5, 0.0035 * u), 10));
};

// ---------- picture-stage moves for the thought-space shots (TH cards staged in picture px) ----------
/** Run `draw` with the picture stage scaled by `s` about `c` and then shifted by `d` px (the sheet's "picture-stage push / dolly / truck"). The star
 * dust (directions at infinity) and the frame rim are painted outside it. No-op at s 1 and d 0. */
export const withStage = (p: Painter, c: Pt, s: number, d: Pt, draw: () => void) => {
  if (s === 1 && !d[0] && !d[1]) { draw(); return; }
  p.brush.push();
  p.brush.translate(c[0] + d[0], c[1] + d[1]);
  p.brush.scale(s);
  p.brush.translate(-c[0], -c[1]);
  draw();
  p.brush.pop();
};
