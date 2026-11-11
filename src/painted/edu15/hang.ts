import {washAt} from '../kit/draw';
import {wp} from '../kit/world';
import type {Painter} from '../kit/painter';
import type {ExpressionId} from '../kit/expressions';
import type {FaceState} from '../kit/head';
import type {FigPose} from '../kit/cast';
import type {V3} from '../kit/space';
import {camPoint, type YCam} from '../kit/ycam';
import {paintManHang} from './cast';
import {CEIL, RIG_H, RIG_Z} from './palette';
import {paintSofaSide, paintTable} from './room';
import {hangFrame, hangLegs, paintTokay, type Frame, type TokayMeasure, type TokayPose} from './tokay';
import {roomBack} from './scenes';

// The imagined hang of shots 2, 17 and 18 (rig H, palette.ts RIG_H): the scenes.ts `hangShot` with the animated parts a shot needs: a sway about the front-foot line, the slow blink,
// the man's face. Pure of its arguments (seekable).
export const HANG_VENT: V3 = [0.33, 2.53, RIG_Z];
const PIVOT: V3 = [0.33, CEIL, RIG_Z];
export const hangPoseA = (o: Partial<TokayPose> = {}): TokayPose => ({legs: hangLegs(), headPitch: -22, tail: [0, 0.03], legsOver: true, roll: {hl: 0.75, hr: 0.75}, ...o});
/** Sway angle (degrees) after kicks at shot frames `kicks`: a damped swing of +-2 degrees that dies within 12 f. */
export const swayAt = (L: number, kicks: number[]): number => kicks.reduce((s, k) => { const d = L - k; return d < 0 || d > 12 ? s : s + 2 * Math.sin((2 * Math.PI * d) / 10) * Math.exp(-d / 4); }, 0);
const rot = (v: V3, deg: number): V3 => { const a = (deg * Math.PI) / 180, x = v[0] - PIVOT[0], y = v[1] - PIVOT[1]; return [PIVOT[0] + x * Math.cos(a) - y * Math.sin(a), PIVOT[1] + x * Math.sin(a) + y * Math.cos(a), v[2]]; };
export const swayFrame = (deg: number): Frame => {
  const f = hangFrame(HANG_VENT), a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  const rv = (v: V3): V3 => [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]];
  return {o: rot(f.o, deg), U: rv(f.U), V: rv(f.V), N: f.N};
};
/** Knee-kick amount 0..1 at shot frame L for a kick at frame k: up over 3 f, back over 6 f. */
const kickCurve = (L: number, k: number): number => { const d = L - k; return d < 0 || d > 9 ? 0 : d <= 3 ? d / 3 : 1 - (d - 3) / 6; };
/** Leg kicks of shot 2 (fixlist W5-F1 item 1): kick 1 leads with his screen-left leg (character right), kick 2 with the screen-right leg; lead knee 0-50 deg and hip 0-20 deg, the other leg 2 f later at 60 %. */
export const legKickAt = (L: number, kicks: number[]): NonNullable<FigPose['legKick']> => {
  let r = 0, l = 0;
  kicks.forEach((k, i) => { const lead = kickCurve(L, k), fol = 0.6 * kickCurve(L, k + 2); if (i % 2 === 0) { r = Math.max(r, lead); l = Math.max(l, fol); } else { l = Math.max(l, lead); r = Math.max(r, fol); } });
  return {r: {hip: 20 * r, knee: 50 * r}, l: {hip: 20 * l, knee: 50 * l}};
};
export type HangOpts = {t: number; kicks?: number[]; L?: number; sway?: number; face?: ExpressionId; faceState?: Partial<FaceState>; man?: boolean; /** Hands lower than the shared rig, metres (cast.ts ManHangOpts.handDrop); default 0. */ handDrop?: number};
export type HangMeasure = {tokay: TokayMeasure; man: ReturnType<typeof paintManHang>; floorY: number};
/** Room, sofa, floor shadow, table, tail, MAN, tokay body: the shot's whole imagined picture. */
export const paintHang = (p: Painter, c: YCam, pose: TokayPose, o: HangOpts): HangMeasure => {
  roomBack(p, c);
  paintSofaSide(p, c);
  const sh = wp(c, Array.from({length: 18}, (_, i): V3 => [0.42 + 0.2 * Math.cos((i / 18) * Math.PI * 2), 0.002, RIG_Z - 0.04 + 0.12 * Math.sin((i / 18) * Math.PI * 2)]));
  if (sh.length > 2) washAt(p, 61980, '#1f1a15', 120, sh, 0.25, 0.2);
  paintTable(p, c);
  const f = swayFrame(o.sway ?? 0);
  paintTokay(p, c, f, pose, {t: o.t, part: 'tail'});
  const man = o.man === false ? null : paintManHang(p, c, {handDrop: o.handDrop, wrists: rot(RIG_H.wrists, o.sway ?? 0), legKick: o.kicks && o.L !== undefined ? legKickAt(o.L, o.kicks) : undefined, face: o.face ?? 'scared', faceState: o.faceState ?? {look: [0, -0.7]}, t: o.t});
  const tokay = paintTokay(p, c, f, pose, {t: o.t, part: 'body'});
  return {tokay, man, floorY: Math.round(camPoint(c, [0.33, 0, RIG_Z])?.[1] ?? 0)};
};
