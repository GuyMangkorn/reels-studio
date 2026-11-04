import type {CSSProperties, ReactNode} from 'react';
import {STILL_CAMERA, type Camera} from '../kit/camera';
import type {Painter} from '../kit/painter';
import {KF_SH02, KF_SH03, KF_SH04, KF_SH05} from './frames';
import {R, shade} from './sb-lib';
import {SHOTS} from './sb';

// ZCONDO2-SHORT-TH W5.2: per-shot draft spec = frames, camera, caption cues (shot-local frames) and shade peak from the scene sheet SS-ZC2-R1
// (shade peaks re-derived 4 Nov 2026 for the strong caption stroke, rule ZC2-CAP-L1: build-notes caption legibility), plus the painter. `n` is the frame count of the sheet's shot map.
export type Spec = {
  n: number;
  cam: (f: number) => Camera;
  cues: [number, number][];
  peak: number;
  /** Caption line count for the tight shade band (1 unless the shot's captions carry a newline: TH-12, TH-19, TH-22, TH-23, TH-27). */
  lines?: 1 | 2;
  /** Widest caption text of the shot in px (measured on the real frames, 5 Nov 2026 shade pass): sizes the sideways soft shade (text + 40 px solid, 80 px feather each side). */
  capW?: number;
  paint: (p: Painter, f: number) => void;
  /** Knocks at f 133 / 147 / 160 shake the picture 2 px (B10). */
  knock?: boolean;
  /** Remotion overlay in the picture (labels, marks); not under the camera. */
  over?: (f: number) => ReactNode;
  after?: (f: number) => ReactNode;
};

const lin = (f: number, a: number, b: number) => Math.min(1, Math.max(0, (f - a) / (b - a)));
const sine = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * u);
/** Picture-stage push s0 -> s1 about (fx, fy) over frames [a, b] (sine in-out, as the kit `pushCamera`), optional drift. */
const push = (s0: number, s1: number, fx: number, fy: number, a: number, b: number, o: {dx?: number; dy?: number; line?: boolean} = {}) => (f: number): Camera => {
  const e = o.line ? lin(f, a, b) : sine(lin(f, a, b));
  return {s: s0 + (s1 - s0) * e, fx, fy, dx: (o.dx ?? 0) * e, dy: (o.dy ?? 0) * e};
};
const still = () => STILL_CAMERA;
/** Door rattle: +-amp px on the three irregular pound beats (f 9, 19, 28; 3 frames each). */
const rattle = (f: number, amp: number) => [9, 19, 28].reduce((t, b) => (f >= b && f < b + 3 ? t + amp * ((f - b) % 2 ? -1 : 1) * (b === 19 ? 1.3 : 1) : t), 0);
const TH = {fontFamily: 'Noto Sans Thai, sans-serif'} as const;
/** Timed label: pops in over 4 frames at `at` (shot-local) and stays. */
const Lab = ({f, at, children, style}: {f: number; at: number; children: ReactNode; style: CSSProperties}) => (f < at ? null : <div style={{position: 'absolute', opacity: Math.min(1, (f - at + 1) / 4), ...TH, ...style}}>{children}</div>);
const chip = (extra: CSSProperties): CSSProperties => ({padding: '8px 22px', borderRadius: 30, background: '#efe6d2', color: '#2b211c', fontWeight: 700, border: '3px solid #2b211c', ...extra});
/** A clock ring that draws itself over 18 frames from `at` (SVG stroke sweep). */
const Ring = ({f, at, x, y, r}: {f: number; at: number; x: number; y: number; r: number}) => {
  const u = Math.min(1, Math.max(0, (f - at) / 18)), c = 2 * Math.PI * r;
  return f < at ? null : <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}><circle cx={x} cy={y} r={r} fill="none" stroke="#c7352b" strokeWidth={14} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - u)} transform={`rotate(-90 ${x} ${y})`} /><path d={`M ${x} ${y} L ${x} ${y - r * 0.7} M ${x} ${y} L ${x + r * 0.45 * u} ${y}`} stroke="#2b211c" strokeWidth={10} strokeLinecap="round" /></svg>;
};
const base = (id: string) => (p: Painter) => SHOTS[id].paint(p);

type Row = Omit<Spec, 'paint'> & {paint?: Spec['paint']};
const rows: Record<string, Row> = {
  'ZC2-B01-SH01': {n: 75, cam: push(1, 1.1, 540, 820, 0, 75, {line: true}), cues: [[0, 73]], peak: 0.03},
  'ZC2-B01-SH02': {n: 85, cam: push(1, 1.12, 540, 760, 0, 85, {line: true}), cues: [[5, 78]], peak: 0.09, paint: (p, f) => {
    KF_SH02(p, {facing: true, dark: 0.3, sway: Math.sin(f * 0.11) * 1.5}); // G11 far silhouette: sway 2-3 px (idle-breathe), no turn; one tube flickers at f 27
    if (f >= 27 && f < 29) shade(p, '#10161c', 60, R(-20, -20, 1100, 1940));
  }},
  'ZC2-B01-SH03': {n: 46, cam: push(1, 1.02, 550, 740, 0, 34), cues: [[10, 40]], peak: 0, paint: (p, f) => KF_SH03(p, {shadow: true, prof: f < 23, creak: f < 23 ? 0.05 * Math.sin(Math.PI * lin(f, 8, 23)) : 0})},
  'ZC2-B02-SH01': {n: 27, cam: (f) => ({...STILL_CAMERA, dy: f >= 11 && f < 17 ? 14 * (1 - (f - 11) / 6) * ((f - 11) % 2 ? -1 : 1) : 0}), cues: [[11, 27]], peak: 0.1},
  'ZC2-B02-SH02': {n: 27, cam: still, cues: [[0, 21]], peak: 0},
  'ZC2-B02-SH03': {n: 45, cam: (f) => ({...push(1, 1.03, 600, 760, 0, 45)(f), dx: rattle(f, 3), dy: rattle(f + 1, 2)}), cues: [[9, 40]], peak: 0},
  'ZC2-B02-SH04': {n: 114, cam: (f) => { const c = push(1, 1.02, 540, 960, 0, 114)(f); return {...c, dx: -20 * sine(lin(f, 8, 34))}; }, cues: [[8, 40], [51, 112]], peak: 0, paint: (p, f) => KF_SH04(p, true, {f})},
  'ZC2-B02-SH05': {n: 92, cam: push(1, 1.03, 560, 800, 60, 92), cues: [[5, 80]], peak: 0, paint: (p, f) => KF_SH05(p, true, {f})},
  'ZC2-B03-SH01': {n: 57, cam: still, cues: [[12, 44]], peak: 0},
  'ZC2-B04-SH01': {n: 49, cam: still, cues: [[12, 41]], peak: 0.07},
  'ZC2-B04-SH02': {n: 114, over: (f) => (<>
    <Lab f={f} at={79} style={{left: 380, top: 120, fontSize: 52, fontWeight: 700, color: '#1f6f8a'}}>ถังบนดาดฟ้า</Lab>
    <Lab f={f} at={49} style={{left: 140, top: 1590, fontSize: 52, fontWeight: 700, color: '#2b211c'}}>ปั๊ม</Lab>
  </>), cam: (f) => ({...STILL_CAMERA, dy: 260 * (1 - sine(lin(f, 6, 90)))}), cues: [[11, 110]], peak: 0.21},
  'ZC2-B04-SH02b': {n: 181, over: (f) => (<>
    <Lab f={f} at={0} style={{left: 240, top: 420, fontSize: 56, fontWeight: 700, color: '#2b211c'}}>ปั๊ม</Lab>
    <Lab f={f} at={8} style={{left: 760, top: 410, fontSize: 56, fontWeight: 700, color: '#c7352b'}}>ไฟดับ</Lab>
  </>), cam: push(1, 1.05, 560, 760, 0, 181), cues: [[8, 60], [68, 137], [143, 181]], peak: 0.28},
  'ZC2-B04-SH03': {n: 154, cam: (f) => ({...STILL_CAMERA, dx: -12 * lin(f, 0, 154)}), cues: [[4, 142]], peak: 0.11},
  'ZC2-B05-SH01': {n: 85, cam: push(1, 1.04, 540, 900, 0, 85), cues: [[12, 85]], peak: 0.24},
  'ZC2-B05-SH02': {n: 80, cam: still, cues: [[2, 80]], peak: 0.2},
  'ZC2-B05-SH03': {n: 120, cam: push(1, 1.05, 540, 960, 0, 120), cues: [[3, 117]], peak: 0.25},
  'ZC2-B05-SH04': {n: 117, cam: still, over: (f) => (<>
    {f >= 14 ? <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}><path d="M 820 330 L 870 390 L 960 250" stroke="#2f9e5a" strokeWidth="26" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
    {f >= 6 ? <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}><path d="M 820 960 L 960 1100 M 960 960 L 820 1100" stroke="#c7352b" strokeWidth="26" fill="none" strokeLinecap="round" /></svg> : null}
    <Lab f={f} at={34} style={chip({left: 90, top: 1790, background: '#e6f6fa', color: '#1f6f8a', fontSize: 46, border: '3px solid #1f6f8a'})}>น้ำใส</Lab>
    <Lab f={f} at={62} style={chip({left: 430, top: 1790, fontSize: 46})}>ไม่ได้ใส่น้ำยา</Lab>
  </>), cues: [[6, 31], [34, 105]], peak: 0.24},
  'ZC2-B06-SH01': {n: 204, cam: push(1, 1.05, 600, 760, 0, 204), over: (f) => (<>
    <Ring f={f} at={68} x={560} y={1235} r={62} /><Lab f={f} at={78} style={chip({left: 640, top: 1190, fontSize: 44})}>ราว 4 ชม.</Lab>
    <Ring f={f} at={160} x={700} y={425} r={52} /><Lab f={f} at={170} style={chip({left: 650, top: 505, fontSize: 40})}>อย่างมากราว 2 วัน</Lab>
  </>), cues: [[12, 99], [110, 198]], peak: 0.09},
  'ZC2-B06-SH02': {n: 78, cam: still, cues: [[9, 75]], peak: 0.24},
  'ZC2-B06-SH03': {n: 49, cam: still, cues: [[7, 37]], peak: 0.21},
  'ZC2-B07-SH01': {n: 83, cam: still, cues: [[11, 78]], peak: 0.04},
  'ZC2-B07-SH02': {n: 97, cam: push(1.1, 1, 540, 960, 0, 97), cues: [[10, 97]], peak: 0.07},
  'ZC2-B07-SH03': {n: 68, cam: still, cues: [[3, 52]], peak: 0},
  'ZC2-B08-SH01': {n: 100, cam: push(1, 1.02, 540, 960, 0, 100), cues: [[12, 97]], peak: 0},
  'ZC2-B08-SH02': {n: 131, cam: push(1.15, 1, 540, 1000, 0, 131), cues: [[7, 55], [63, 106]], peak: 0},
  'ZC2-B09-SH01': {n: 198, cam: still, over: (f) => (<>
    <Lab f={f} at={12} style={{left: 270, top: 168, width: 560, textAlign: 'center', fontSize: 120, fontWeight: 700, color: '#2b211c'}}>วันที่ 3</Lab>
    {([[940, 690, '2', 48], [940, 1085, '4', 96], [440, 1560, '12%', 148]] as const).map(([x, y, t, at]) => <Lab key={t} f={f} at={at} style={{left: x - 60, top: y, width: 120, textAlign: 'center', fontSize: 84, fontWeight: 700, color: t === '12%' ? '#f4efd8' : '#fff', WebkitTextStroke: '8px #2b211c', paintOrder: 'stroke fill'}}>{t}</Lab>)}
  </>), cues: [[12, 37], [48, 86], [96, 138], [148, 190]], peak: 0.45},
  'ZC2-B09-SH02': {n: 67, cam: push(1, 1.02, 540, 960, 0, 67), cues: [[12, 63]], peak: 0},
  'ZC2-B09-SH03': {n: 77, cam: push(1, 1.07, 540, 1420, 0, 77, {line: true}), cues: [], peak: 0},
  'ZC2-B09-SH04': {n: 55, cam: still, cues: [[12, 48]], peak: 0},
  'ZC2-B10-SH01': {n: 202, knock: true, over: (f) => (<>
    {([['เปิดประตู', 700, 690, 21], ['ส่งเสียงตอบ', 660, 810, 53], ['เงียบไว้', 740, 930, 97]] as const).map(([t, x, y, at]) => <Lab key={t} f={f} at={at} style={chip({left: x, top: y, padding: '10px 30px', borderRadius: 34, fontSize: 58, border: '4px solid #2b211c'})}>{t}</Lab>)}
  </>), cam: push(1, 1.02, 540, 960, 102, 202), cues: [[11, 81], [90, 115]], peak: 0},
};

// Widest caption text per shot in px (diff of the real caption frame against the plain plate, rows 1080-1262, rounded up to 10; B06-SH02, B07-SH03,
// B08-SH02, B09-SH01 remeasured on the repainted pictures, 4 Nov 2026).
const CAP_W: Record<string, number> = {
  'ZC2-B01-SH01': 680, 'ZC2-B01-SH02': 580, 'ZC2-B01-SH03': 300, 'ZC2-B02-SH01': 200, 'ZC2-B02-SH02': 200, 'ZC2-B02-SH03': 380, 'ZC2-B02-SH04': 660, 'ZC2-B02-SH05': 580,
  'ZC2-B03-SH01': 360, 'ZC2-B04-SH01': 350, 'ZC2-B04-SH02': 660, 'ZC2-B04-SH02b': 610, 'ZC2-B04-SH03': 820, 'ZC2-B05-SH01': 570, 'ZC2-B05-SH02': 720, 'ZC2-B05-SH03': 670,
  'ZC2-B05-SH04': 510, 'ZC2-B06-SH01': 520, 'ZC2-B06-SH02': 650, 'ZC2-B06-SH03': 360, 'ZC2-B07-SH01': 600, 'ZC2-B07-SH02': 410, 'ZC2-B07-SH03': 520, 'ZC2-B08-SH01': 660,
  'ZC2-B08-SH02': 410, 'ZC2-B09-SH01': 580, 'ZC2-B09-SH02': 560, 'ZC2-B09-SH04': 280, 'ZC2-B10-SH01': 740,
};
const TWO_LINE = new Set(['ZC2-B04-SH02', 'ZC2-B05-SH03', 'ZC2-B06-SH01', 'ZC2-B07-SH02']);
export const SPECS: Record<string, Spec> = Object.fromEntries(Object.entries(rows).map(([id, r]) => {
  const cam = r.knock ? (f: number): Camera => { const c = r.cam(f), k = [133, 147, 160].some((b) => f >= b && f < b + 2); return k ? {...c, dx: c.dx + (f % 2 ? -2 : 2)} : c; } : r.cam;
  return [id, {...r, cam, lines: TWO_LINE.has(id) ? 2 : 1, capW: CAP_W[id], paint: r.paint ?? base(id)}];
}));
export const SHOT_IDS = Object.keys(SPECS);
