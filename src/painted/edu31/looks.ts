import {drawChair, paintShoulderBag, paintToyPistol} from '../kit/props';
import {mittenThumbSide} from '../kit/hand-gestures';
import {ell, hardFill, inkLine, openHandParts, washAt} from '../kit/draw';
import {paintFigureAt, type FigureAtOpts} from '../kit/figure-at';
import {shoulderPoint, type CastDef} from '../kit/cast';
import type {Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintSorted, wp, type Item} from '../kit/world';
import {CAM_CENTRE} from './reveal31';
import {
  ANCHOR, BANK_TEXT, TELLER, FRIEND, POLICE, REVEAL, TV_SCREEN, WHEELER, YOU, bankFurniture, cam, glow, kitchenTable, lemonPx, paintLemonHalf, paintBankShell,
  paintKitchenShell, paintPendant, paintPoliceShell, paintRevealTable, paintStall, paintStudio, paintTvCorner, policeTable, printCorners,
  stallItems, studioDesk, type WorldText,
} from './set31';

// EDU-EP31-SHORT W3 look frames LF01-LF07 (+ LF05B studio, TT01 Wheeler turntable); EDU-EP31-BRIEF-R5 (R5: LF01 gun and bag, LF03 friend pose), Film, 2026-11-21. One still per
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
  /** VD31-19 joke label (R6): a small cream Thai plate in screen space (left x or centred, top y, font px) with an optional hand-drawn arrow (picture px) */
  tag?: {text: string; x?: number; cx?: number; y: number; size: number; center?: boolean; arrow?: [number, number][]; wrap?: boolean};
  paint: (p: Painter) => void;
};
/** VD31-19 (R6, user 2026-11-21): the broken camera is our joke, not the documented cause (F006: cause unknown). Exact text for Boat's recheck. */
export const JOKE_LABEL = 'เหตุการณ์สมมุติ: กล้องดันพังพอดี';
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
/** R5 repaint gun arm: hanging (CP-P05) from the left shoulder, elbow at the waist (m outward / down from the shoulder: elbow, then hand),
 * and the barrel direction (radians on screen: down, 0.2 rad outward), the gun mirrored so the slide sits on the thumb side (toward the midline). */
const GUN_ELBOW: [number, number] = [0.035, 0.255], GUN_HAND: [number, number] = [0.075, 0.495], GUN_ANG = Math.PI / 2 - 0.2;
const lf01 = (): LookDef => ({
  shot: 'B01-SH01', cam: C01, paper: '#e9dfc8', vignette: 0.42, caption: 'ปี 1995 ผู้ชายคนนี้กับเพื่อน', texts: BANK_TEXT,
  cast: 'WHEELER man-buzz + new: windbreaker-1995, walk (slow), smug, front, whole lemon in the right mitten (CP-P02), new: toy-pistol-cartoon in the left mitten hanging, new: canvas-money-bag on a left-shoulder strap (R5); FRIEND man-spiky, walk, neutral, front, shadowed',
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
    const w = gu(c, W), sh = shoulderPoint(WHEELER, w.g, w.u, {view: 'front'}, 'l');
    let fistRedraw: ((q: Painter) => void) | undefined;
    paintSorted(p, c, [
      ...bankFurniture(),
      fig(FRIEND, {at: F, view: 'front', face: 'neutral', faceState: {look: [0.15, 0.5]}, tint: {to: '#3d3346', u: 0.38}, seed: 3102, fig: {walk: 0.62, stride: 0.45}}),
      // R5 (user, 2026-11-21: "add a gun, a cartoon one is fine, and a shoulder bag carrying the money"): `new: toy-pistol-cartoon` in his
      // LEFT mitten, arm hanging at his side (CP-P05), muzzle down at the floor, never pointed at anyone (VD31-10); `new: canvas-money-bag`
      // on a strap over his left shoulder, the bag swung to the front at belt height, banknotes peeking (no symbol, VD31-15). The lemon arm takes
      // CP-P02 (elbow back behind the torso, hand at the chest), was a splayed horizontal upper arm.
      fig(WHEELER, {at: W, view: 'front', face: 'smug', seed: 3101,
        fig: {walk: 0.12, stride: 0.45,
          rArm: {to: [w.g[0] - 0.12 * w.u, w.g[1] - 1.1 * w.u], via: [w.g[0] - 0.17 * w.u, w.g[1] - 0.9 * w.u], behind: 'upper'},
          lArm: {to: [sh[0] + GUN_HAND[0] * w.u, sh[1] + GUN_HAND[1] * w.u], via: [sh[0] + GUN_ELBOW[0] * w.u, sh[1] + GUN_ELBOW[1] * w.u], flatFist: true, fist: mittenThumbSide('left', 'back'), onFlatFist: (r) => { fistRedraw = r; }}},
        held: (q, a, u) => {
          paintShoulderBag(q, 31930, [a.lShoulder[0] - 0.05 * u, a.lShoulder[1] + 0.01 * u], [w.g[0] + 0.07 * u, w.g[1] - 0.93 * u], 0.3 * u, 0.24 * u, {corner: true});
          // the anchor `lHand` sits 0.05 m past the flat fist's centre along the forearm: step back to the held point
          const dx = a.lHand[0] - a.lUpper[0], dy = a.lHand[1] - a.lUpper[1], dl = Math.hypot(dx, dy) || 1;
          paintToyPistol(q, 31940, [a.lHand[0] - (dx / dl) * 0.05 * u, a.lHand[1] - (dy / dl) * 0.05 * u], u, GUN_ANG, {scale: 1.25, flip: true});
          fistRedraw?.(q);
          lemonPx(q, 31900, a.rHand[0] + 0.01 * u, a.rHand[1] - 0.045 * u, 0.04 * u, {glint: 1.4});
        }}),
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
/** R5 repaint FRIEND: seated right profile at the table's left end, facing Wheeler (ground point, m). */
const FA: V3 = [-0.62, 0, -0.5], LEAN03 = 0.2;
/** Whisper hand from the profile shoulder (m forward / up; P19 profile near arm, hand beside the mouth, elbow forward and low). */
const WHISPER_ELBOW: [number, number] = [0.15, -0.1], WHISPER_HAND: [number, number] = [0.18, 0.1];
const POOL03 = camPoint(C03, [0, 0.95, -0.25])!;
const lf03 = (): LookDef => ({
  shot: 'B02-SH01', cam: C03, paper: '#3a2e24', caption: 'แมคอาเธอร์ วีลเลอร์ ได้สูตรจากเพื่อน…', vignette: 0.55,
  pool: {x: POOL03[0], y: POOL03[1], r: 560, color: '255,205,130', op: 0.3},
  cast: 'WHEELER man-buzz + new: windbreaker-1995, P31, surprised, front, eyes to the friend; FRIEND man-spiky, P31 + P19 near arm = new: whisper-cup (right profile, lean in, RIGHT hand open mitten cupped beside the mouth toward Wheeler, back of the hand to camera); new: lemon half on the table in front of him (R5 repaint)',
  paint: (p) => {
    const c = C03;
    paintKitchenShell(p, c);
    // R5 repaint (user, 2026-11-21: "check the anatomy of the friend who whispers"; viewer check R5: the back three-quarter arm started
    // mid-back with no shoulder): the friend is now a seated RIGHT profile (facing Wheeler), leaning in. A profile shows the whole near arm
    // from its shoulder: his RIGHT arm (near arm, hand-drawing 1) bends at a low forward elbow and the open mitten stands beside his mouth,
    // fingers up, back of the hand to camera (thumb toward his face, mittenThumbSide('right', 'back')): the cupped-hand whisper. The lemon half
    // lies cut side up on the oilcloth in front of him; his far arm rests on his thigh behind the table. The lamp is the smooth `pool`
    // (the stacked glow ellipses read as rings over both figures, UT12a).
    const f = gu(c, FA), sh = shoulderPoint(FRIEND, f.g, f.u, {view: 'right', sit: 1, lean: LEAN03}, 'r');
    const hand: [number, number] = [sh[0] + WHISPER_HAND[0] * f.u, sh[1] - WHISPER_HAND[1] * f.u];
    paintSorted(p, c, [
      fig(WHEELER, {at: [0, 0, -0.7], view: 'front', pose: 'P31', face: 'surprised', faceState: {look: [-0.7, 0.05]}, fig: {lean: -0.06}, seed: 3101}, true),
      ...kitchenTable(),
      fig(FRIEND, {at: FA, view: 'right', pose: 'P31', face: 'whisper', seed: 3102,
        fig: {lean: LEAN03, rArm: {to: hand, via: [sh[0] + WHISPER_ELBOW[0] * f.u, sh[1] - WHISPER_ELBOW[1] * f.u], noHand: true}},
        held: (q, a, u) => {
          const [wx, wy] = a.rHand, k = u * 1.1, ang = -Math.PI / 2 + 0.35;
          const h = openHandParts([wx, wy], ang, k, mittenThumbSide('right', 'back'));
          hardFill(q, 32520, FRIEND.head.skin, h.palm);
          inkLine(q, 32521, h.palm, {closed: true, weight: 0.9, color: '#3a2216'});
          inkLine(q, 32522, h.thumbCrease, {weight: 0.7, color: '#3a2216'});
          h.creases.forEach((cr, i) => inkLine(q, 32523 + i, cr, {weight: 0.6, color: '#3a2216'}));
        }}, true),
    ]);
    paintLemonHalf(p, c, 32500, [-0.47, 0.69, 0.16], 0.055);
    paintPendant(p, c);
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

// ------------------------------------------------------------------ LF07 reveal table (B07-SH01 end: the two-up plus the broken camera, R6)
// R6 (user, 2026-11-21: the blank Polaroid is our gag, the camera happened to be broken; picture only, a small joke label): the camera rises
// 0.45 -> 0.60 m and the horizon row 540 -> 620 so the broken camera above the Polaroid fits below the chrome, all above the caption band.
const C07 = cam(0.06, 0.6, 0, 0, -90, 1000, 620);
/** LF07's label arrow = B07-SH01's at L55 (same camera, plate cx 730 top 215, 36 px, two lines; fix round 2026-11-21, the longer label). */
const lf07Arrow = (): [number, number][] => {
  const t = camPoint(C07, CAM_CENTRE) ?? [300, 380], ty = Math.max(t[1] - 6, 224);
  return [[582, 268], [(582 + t[0]) / 2 + 10, Math.max(268, ty) + 18], [t[0] + 14, ty]];
};
const lf07 = (): LookDef => ({
  shot: 'B07-SH01', cam: C07, paper: '#1a100a', caption: 'นักจิตวิทยาคนหนึ่งอ่านเรื่องนี้', vignette: 0.7, pool: {x: 330, y: 560, r: 720, color: '255,190,110', op: 0.42},
  quads: [{src: CCTV_STILL, corners: printCorners(), border: 0.05, pos: '50% 30%'}],
  tag: {text: JOKE_LABEL, cx: 730, y: 215, size: 36, wrap: true, arrow: lf07Arrow()},
  cast: 'no cast; new: instant-print (blank, VD31-13), new: photo-print-8x10 (CCTV-STILL-01), new: lemon half beside the Polaroid touching nothing (RC3-01), new: instant-camera-1995-broken lying lens up above the Polaroid, flash bar fallen to its right (R6), joke label VD31-19',
  paint: (p) => paintRevealTable(p, C07),
});

// ------------------------------------------------------------------ PR01 broken camera, B03-SH04 element (R6; not a beat look frame)
// The kitchen table close, three-quarter from front right: the broken camera at the moment of the shutter (spark, grey puff), the joke label as
// B03-SH04 shows it (VD31-19: top third, from the first to the last frame of the shot). Shows the prop design for review; B03-SH04's own
// framing (side wide, Wheeler holding it at arm's length) is the timed pass's.
const CPR = cam(0.62, 0.98, 0.3, -32, -26, 1500, 700);
const pr01 = (): LookDef => ({
  shot: 'B03-SH04 (prop)', cam: CPR, paper: '#3a2e24', caption: 'ผลทดสอบ… ผ่าน!', vignette: 0.5,
  pool: {x: 560, y: 640, r: 600, color: '255,205,130', op: 0.3},
  tag: {text: JOKE_LABEL, y: 330, size: 44, center: true},
  cast: 'no cast; new: instant-camera-1995-broken (standing, spark), kitchen table props as LF03 (lemon bowl, candle, salt shaker)',
  paint: (p) => { paintKitchenShell(p, CPR); paintSorted(p, CPR, kitchenTable({brokenCamera: true})); },
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
  LF01: lf01, LF02: lf02, LF03: lf03, LF04: lf04, LF05: lf05, LF05B: lf05b, LF06: lf06, LF07: lf07, PR01: pr01, TT01: tt01, FX01: fx01,
};
