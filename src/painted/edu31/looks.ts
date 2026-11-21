import {drawChair} from '../kit/props';
import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {paintFigureAt, type FigureAtOpts} from '../kit/figure-at';
import type {CastDef} from '../kit/cast';
import type {Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintSorted, wp, type Item} from '../kit/world';
import {
  ANCHOR, BANK_TEXT, TELLER, FRIEND, POLICE, REVEAL, TV_SCREEN, WHEELER, YOU, bankFurniture, cam, glow, kitchenTable, lemonPx, paintBankShell,
  paintKitchenShell, paintPendant, paintPoliceShell, paintRevealTable, paintStall, paintStudio, paintTvCorner, policeTable, printCorners,
  stallItems, studioDesk, type WorldText,
} from './set31';

// EDU-EP31-SHORT W3 look frames LF01-LF07 (+ LF05B studio, TT01 Wheeler turntable); EDU-EP31-BRIEF-R4, Film, 2026-11-21. One still per
// location, painted from that location's first storyboard shot (sequence-workflow W3). React-free; the look layer (look.tsx) adds the
// screen layers (CCTV, CRT), the camera-mapped CCTV-STILL-01 image, the English signage and the chrome. Casting lines in each `cast`.

export type Quad = {src: string; corners: [V3, V3, V3, V3]; border?: number; crt?: boolean; pos?: string};
export type LookDef = {
  shot: string; cam: YCam; paper: string; caption: string; cast: string;
  /** screen layer: CCTV preset over the whole picture, the studio picture inside a CRT bezel, or none */
  layer?: 'cctv' | 'studio';
  /** dark edge falloff (night interiors, the reveal table) */
  vignette?: number;
  texts?: WorldText[];
  quads?: Quad[];
  /** picture-space rectangles carrying the still (the studio's over-the-shoulder box) */
  boxes?: {src: string; x: number; y: number; w: number; h: number}[];
  /** warm lamp pool as a smooth screen-space light (picture px centre, radius, rgb, peak opacity) */
  pool?: {x: number; y: number; r: number; color: string; op: number};
  paint: (p: Painter) => void;
};
export const CCTV_STILL = 'edu31/cctv-still-01.png';

type FigOpts = Omit<FigureAtOpts, 't'>;
const fig = (def: CastDef, o: FigOpts, chair?: boolean): Item => ({
  at: o.at,
  draw: (p, c) => {
    if (chair) { const g = camPoint(c, o.at); if (g) drawChair(p, (o.seed ?? def.seed) + 900, g, camUnit(c, o.at), def, o.view === 'back' ? 'front' : (o.view ?? 'front'), {color: '#7a5a3a'}); }
    paintFigureAt(p, c, def, {...o, t: 0});
  },
});
/** Picture point and px/m of a ground point under the given camera (to aim a mitten before the figure is drawn). */
const gu = (c: YCam, at: V3) => ({g: camPoint(c, at)!, u: camUnit(c, at)});

// ------------------------------------------------------------------ LF01 bank heist (B01-SH01, mid dolly)
const C01 = cam(-0.2, 0.6, 2.8, 180, 7, 1080, 650);
const lf01 = (): LookDef => ({
  shot: 'B01-SH01', cam: C01, paper: '#e9dfc8', vignette: 0.42, caption: 'ปี 1995 ผู้ชายคนนี้กับเพื่อน', texts: BANK_TEXT,
  cast: 'WHEELER man-buzz + new: windbreaker-1995, walk (slow), smug, front, whole lemon in the right mitten; FRIEND man-spiky, walk, neutral, front, shadowed',
  paint: (p) => {
    const c = C01;
    paintBankShell(p, c);
    // sun shaft from the entrance across the terrazzo (heist key)
    const s0 = camPoint(c, [-2.2, 0.002, 12]), s1 = camPoint(c, [2.2, 0.002, 12]), s2 = camPoint(c, [2.8, 0.002, 4.2]), s3 = camPoint(c, [-2.8, 0.002, 4.2]);
    if (s0 && s1 && s2 && s3) washAt(p, 31800, '#f7cf86', 90, [s0, s1, s2, s3], 0.4, 0.2);
    const W: V3 = [-0.4, 0, 5.0], F: V3 = [0.55, 0, 5.8];
    // backlit long shadows of the two men stretching toward the lens (the entrance sun is behind them)
    for (const [k, at, len] of [[0, W, 3.4], [1, F, 3.6]] as const) {
      const sh = wp(c, [[at[0] - 0.2, 0.003, at[2]], [at[0] + 0.2, 0.003, at[2]], [at[0] + 0.34, 0.003, at[2] - len], [at[0] - 0.34, 0.003, at[2] - len]]);
      if (sh.length > 2) washAt(p, 31815 + k, '#33403c', 175, sh, 0.35, 0.15);
    }
    // entrance haze behind them (rim), painted before the cast so it stays off faces and bodies
    const d = camPoint(c, [0, 1.3, 12]); if (d) { glow(p, 31950, d[0], d[1], 430, 330, '#ffd98f', 80, 8); glow(p, 31960, d[0], d[1] + 40, 200, 150, '#fff6dc', 90, 5); }
    const w = gu(c, W);
    paintSorted(p, c, [
      ...bankFurniture(),
      fig(FRIEND, {at: F, view: 'front', face: 'neutral', faceState: {look: [0.15, 0.5]}, tint: {to: '#3d3346', u: 0.38}, seed: 3102, fig: {walk: 0.62, stride: 0.45}}),
      fig(WHEELER, {at: W, view: 'front', face: 'smug', seed: 3101,
        fig: {walk: 0.12, stride: 0.45, rArm: {to: [w.g[0] - 0.13 * w.u, w.g[1] - 1.1 * w.u]}},
        held: (q, a, u) => lemonPx(q, 31900, a.rHand[0] + 0.01 * u, a.rHand[1] - 0.045 * u, 0.04 * u, {glint: 1.4})}),
    ]);
  },
});

// ------------------------------------------------------------------ LF02 CCTV vantage freeze = CCTV-STILL-01 (B04-SH02 end)
const HEAD: V3 = [0.8, 1.6, 3.4], CCAM: V3 = [6.37, 2.9, 0.62];
const yawTo = (a: V3, b: V3) => Math.atan2(b[0] - a[0], -(b[2] - a[2])) * 180 / Math.PI;
const pitchTo = (a: V3, b: V3) => Math.atan2(b[1] - a[1], Math.hypot(b[0] - a[0], b[2] - a[2])) * 180 / Math.PI;
const C02 = cam(CCAM[0], CCAM[1], CCAM[2], yawTo(CCAM, HEAD), pitchTo(CCAM, HEAD), 7000, 620);
/** R2/VD31-14 beard mitigation, in the plate only (the kit head is unchanged): under the CCTV grade the beard and buzz cut sit in the middle value. */
const WHEELER_CCTV: CastDef = {...WHEELER, head: {...WHEELER.head, hair: '#5a4a3e', skin: '#c8956a'}};
const lf02 = (): LookDef => ({
  shot: 'B04-SH02', cam: C02, paper: '#c9c3b0', caption: 'เขาให้กล้องธนาคารถ่ายหน้าเต็ม ๆ', layer: 'cctv',
  cast: 'WHEELER man-buzz + new: windbreaker-1995, head up to CCTV-CAM, neutral (no smile, F011), front; CCTV preset (VD31-08, look-frame approximation)',
  paint: (p) => {
    const c = C02;
    paintBankShell(p, c);
    paintSorted(p, c, [...bankFurniture(), fig(WHEELER_CCTV, {at: [0.8, 0, 3.4], view: 'front', face: 'neutral', seed: 3101})]);
  },
});

// ------------------------------------------------------------------ LF03 kitchen night (B02-SH01)
const C03 = cam(0.35, 1.25, 1.7, -4, -4, 1000, 660);
const lf03 = (): LookDef => ({
  shot: 'B02-SH01', cam: C03, paper: '#3a2e24', caption: 'แมคอาเธอร์ วีลเลอร์ ได้สูตรจากเพื่อน…', vignette: 0.55,
  cast: 'WHEELER man-buzz + new: windbreaker-1995, P31, surprised, front; FRIEND man-spiky, P31 + new: whisper-lean, back, lemon half raised',
  paint: (p) => {
    const c = C03;
    paintKitchenShell(p, c);
    const Fa: V3 = [-0.85, 0, -0.2];
    const t = camPoint(c, [-0.32, 1.12, -0.45])!;
    paintSorted(p, c, [
      fig(WHEELER, {at: [0, 0, -0.7], view: 'front', pose: 'P31', face: 'surprised', seed: 3101}, true),
      ...kitchenTable(),
      fig(FRIEND, {at: Fa, view: 'back', pose: 'P31', face: 'whisper', seed: 3102, fig: {headYaw: 0.55, lean: 0.25, lArm: {to: t}, rArm: {to: t}},
        held: (q, a, u) => { const x = a.head[0] + 0.3 * u, y = a.head[1] + 0.08 * u; lemonPx(q, 32500, x, y, 0.034 * u, {tilt: 70, shadow: false}); hardFill(q, 32510, '#f8eca0', ell(x + 0.03 * u, y, 0.012 * u, 0.03 * u, 14, 1.2)); }}, true),
    ]);
    paintPendant(p, c);
    const lp = camPoint(c, [0, 0.69, 0]), u = camUnit(c, [0, 0.69, 0]);
    if (lp) glow(p, 32600, lp[0], lp[1] - 0.25 * u, 0.9 * u, 0.6 * u, '#ffcf7a', 70);
  },
});

// ------------------------------------------------------------------ LF04 som tam stall today (B04-SH01)
const C04 = cam(0.6, 1.45, 2.0, 0, 0, 1000, 620);
const lf04 = (): LookDef => ({
  shot: 'B04-SH01', cam: C04, paper: '#efe8d8', caption: 'เราเปิดกล้องหน้ายังหามุมก่อน…',
  cast: 'YOU woman-bob + hoodie, new: selfie-angles (phone high), happy, front; stall: new: somtam-stall-today, new: krok-somtam, limes',
  paint: (p) => {
    const c = C04;
    paintStall(p, c);
    const Y: V3 = [0.6, 0, 0.9], y = gu(c, Y);
    paintSorted(p, c, [
      ...stallItems(),
      fig(YOU, {at: Y, view: 'front', face: 'happy', seed: 3104, fig: {headCock: -7, rArm: {to: [y.g[0] - 0.3 * y.u, y.g[1] - 1.72 * y.u]}},
        held: (q, a, u) => {
          const x = a.rHand[0], yy = a.rHand[1] - 0.06 * u, w = 0.04 * u, h = 0.075 * u;
          hardFill(q, 33500, '#2b2d33', [[x - w, yy - h], [x + w, yy - h], [x + w, yy + h], [x - w, yy + h]]);
          hardFill(q, 33501, '#4a4d55', ell(x - w * 0.45, yy - h * 0.7, w * 0.22, w * 0.22, 10));
          inkLine(q, 33502, [[x - w, yy - h], [x + w, yy - h], [x + w, yy + h], [x - w, yy + h]], {closed: true, weight: 0.7});
        }}),
    ]);
  },
});

// ------------------------------------------------------------------ LF05 TV corner (B05-SH01 end) and LF05B studio (B05-SH02)
const C05 = cam(0, 0.92, 0.45, 0, -2, 900, 560);
const lf05 = (): LookDef => ({
  shot: 'B05-SH01', cam: C05, paper: '#101218', caption: 'จนเดือนเมษา ภาพจากกล้องธนาคารขึ้นข่าวห้าทุ่ม', vignette: 0.45,
  quads: [{src: CCTV_STILL, corners: TV_SCREEN, crt: true, pos: '50% 30%'}],
  cast: 'no cast; new: crt-tv-27, VCR, rabbit ears; CCTV-STILL-01 on the screen under the CRT preset (look-frame approximation); no clock (VD31-11)',
  paint: (p) => paintTvCorner(p, C05),
});
const C05B = cam(0, 1.12, 1.75, 0, -4, 1150, 560);
const lf05b = (): LookDef => ({
  shot: 'B05-SH02', cam: C05B, paper: '#0a1d40', caption: 'ใครจำชายคนนี้ได้ แจ้งตำรวจเลยครับ', layer: 'studio',
  boxes: [{src: CCTV_STILL, x: 640, y: 250, w: 330, h: 250}],
  cast: 'ANCHOR man-parted + office, P05 (points to the box), talk, front; new: news-studio-1995 (no station name, no logo, no lower third)',
  paint: (p) => {
    const c = C05B;
    paintStudio(p, c);
    paintFigureAt(p, c, ANCHOR, {at: [0, 0, -0.6], view: 'front', pose: 'P31', face: 'talk', t: 0.2, seed: 3105,
      fig: {lArm: (() => { const g = camPoint(c, [0, 0, -0.6])!, u = camUnit(c, [0, 0, -0.6]); return {to: [g[0] + 0.5 * u, g[1] - 1.12 * u] as [number, number]}; })()}});
    studioDesk(p, c);
  },
});

// ------------------------------------------------------------------ LF06 police room (B06-SH01)
const C06 = cam(-0.4, 1.3, 1.5, 8, -9, 1050, 520);
const PRINT6: [V3, V3, V3, V3] = [[-0.24, 0.684, -0.33], [-0.04, 0.684, -0.31], [-0.06, 0.684, -0.06], [-0.26, 0.684, -0.08]];
const lf06 = (): LookDef => ({
  shot: 'B06-SH01', cam: C06, paper: '#9fae9a', caption: 'นี่คุณใช่ไหม', vignette: 0.3,
  quads: [{src: CCTV_STILL, corners: PRINT6, border: 0.06, pos: '50% 30%'}],
  cast: 'WHEELER man-buzz + new: windbreaker-1995, P31, neutral, front; POLICE man-crop + new: us-police-1995, P31, back, near dark shape; new: photo-print-8x10 (CCTV-STILL-01)',
  paint: (p) => {
    const c = C06;
    paintPoliceShell(p, c);
    paintSorted(p, c, [
      fig(WHEELER, {at: [0, 0, -0.75], view: 'front', pose: 'P31', face: 'neutral', seed: 3101}, true),
      {at: [0, 0, 0.0], draw: policeTable},
      fig(POLICE, {at: [0.28, 0, 0.72], view: 'back', pose: 'P31', seed: 3106, tint: {to: '#141a26', u: 0.4}}),
    ]);
    const l = camPoint(c, [0, 2.5, 0]); if (l) glow(p, 36300, l[0], l[1], 420, 160, '#f4fbe8', 60);
  },
});

// ------------------------------------------------------------------ LF07 reveal table (B07-SH01 end: the two-up)
const C07 = cam(0.06, 0.45, 0, 0, -90, 1000, 540);
const lf07 = (): LookDef => ({
  shot: 'B07-SH01', cam: C07, paper: '#1a100a', caption: 'นักจิตวิทยาคนหนึ่งอ่านเรื่องนี้', vignette: 0.7, pool: {x: 300, y: 330, r: 700, color: '255,190,110', op: 0.42},
  quads: [{src: CCTV_STILL, corners: printCorners(), border: 0.05, pos: '50% 30%'}],
  cast: 'no cast; new: instant-print (blank, VD31-13), new: photo-print-8x10 (CCTV-STILL-01), new: lemon half beside the Polaroid touching nothing (RC3-01)',
  paint: (p) => paintRevealTable(p, C07),
});

// ------------------------------------------------------------------ TT01 WHEELER turntable (new outfit on the kit head, four views)
const CTT = cam(0, 0.95, 6.2, 0, 0, 1800, 760);
const tt01 = (): LookDef => ({
  shot: 'turntable', cam: CTT, paper: '#e9e3d6', caption: '',
  cast: 'WHEELER man-buzz + new: windbreaker-1995: front, right, back, left; P01; neutral',
  paint: (p) => {
    const c = CTT;
    const views = ['front', 'right', 'back', 'left'] as const;
    views.forEach((v, i) => paintFigureAt(p, c, WHEELER, {at: [-1.05 + i * 0.7, 0, 0], view: v, face: v === 'front' ? 'smug' : 'neutral', t: 0, seed: 3101}));
  },
});
/** FX01 face check (user note 2026-11-21, doubled eyebrow): the episode's cast heads close, front, no grade. Not a look frame. */
const CFX = cam(0, 1.45, 3.2, 0, 0, 2600, 520);
const fx01 = (): LookDef => ({
  shot: 'face-check', cam: CFX, paper: '#e9e3d6', caption: '', cast: 'WHEELER, FRIEND, POLICE, TELLER, YOU, ANCHOR heads, front, neutral',
  paint: (p) => {
    const row1 = [WHEELER, FRIEND, POLICE] as const, row2 = [TELLER, YOU, ANCHOR] as const;
    row1.forEach((d, i) => paintFigureAt(p, CFX, d, {at: [-0.36 + i * 0.36, 0, 0], view: 'front', face: 'neutral', t: 0, seed: d.seed}));
    const c2 = {...CFX, hy: 1420};
    row2.forEach((d, i) => paintFigureAt(p, c2, d, {at: [-0.36 + i * 0.36, 0.15, 0], view: 'front', face: 'neutral', t: 0, seed: d.seed}));
  },
});
void REVEAL; void FRIEND; void inkLine;

export const LOOK_DEFS: Record<string, () => LookDef> = {
  LF01: lf01, LF02: lf02, LF03: lf03, LF04: lf04, LF05: lf05, LF05B: lf05b, LF06: lf06, LF07: lf07, TT01: tt01, FX01: fx01,
};
