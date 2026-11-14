// EDU-EP16 Film R13 look frames: the dinosaur-presence pass (sheet EDU-EP16-SHEET-R1.3). Stills only: no timeline, voice or captions.
import {useCallback, type ReactNode} from 'react';
import {BrushCanvas, type PaintContext} from '../../../../src/painted/BrushCanvas';
import {makePainter} from '../../../../src/painted/kit/painter';
import {Grain} from '../../../../src/painted/kit/screen';
import {washAt} from '../../../../src/painted/kit/draw';
import {ell, hardFill, inkLine, rectPts} from '../../../../src/painted/kit/draw';
import {mixColor, type Painter} from '../../../../src/painted/kit/painter';
import type {YCam} from '../../../../src/painted/kit/ycam';
import {FPS, Painted, label} from '../../../../src/painted/survival/frame';
import {buildAnkylosaur, buildDragonfly, buildLongNeck, buildTRex, buildTriceratops, paintBeast, type Build} from './beasts';
import {camMove, camOf} from '../../../../src/painted/kit/cam-moves';
import {camPoint, camSpace, camUnit} from '../../../../src/painted/kit/ycam';
import {paintCast} from '../../../../src/painted/survival/cast';
import {cardAt, cell, worldAt, type V3} from '../../../../src/painted/survival/core';
import {paintCycad} from '../../../../src/painted/survival/forest';
import {paintHen} from '../../../../src/painted/survival/hen';
import {basket, paintHeldProp} from '../../../../src/painted/survival/props';
import {paintPterosaur, paintPterosaurShadow} from '../../../../src/painted/survival/pterosaur';
import {paintRiver, RIVER_LIGHT} from '../../../../src/painted/survival/river';
import {LIGHT, paintVillage} from '../../../../src/painted/survival/village';
import {CAM16_2} from '../../../../src/painted/survival/look';
import {CAM16_8} from '../../../../src/painted/survival/look-b';

const D = Math.PI / 180;
const rowCam = (base: number, d: number, eye: number, f = 900): YCam => ({x: 0, y: eye, z: d, yaw: 0, f, hy: base - (f * eye) / d});
const views: [string, number][] = [['front 3/4', 40 * D], ['side', 0], ['rear 3/4', -140 * D]];

const paintSheet = (p: Painter) => {
  hardFill(p, 1, '#d9e2cc', [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
  const rows: {base: number; build: () => Build; d: number; eye: number; dx: number; f?: number; sx?: number}[] = [
    {base: 440, build: () => buildLongNeck({}), d: 95, eye: 4, dx: 28},
    {base: 900, build: () => buildTriceratops({walk: 0.15, stride: 1.4}), d: 30, eye: 1.6, dx: 9.5},
    {base: 1330, build: () => buildAnkylosaur({walk: 0.4, stride: 1.0, tail: 0.4}), d: 26, eye: 1.2, dx: 8},
    {base: 1760, build: () => buildDragonfly({flap: 0.1}), d: 2.2, eye: 0.25, dx: 0.62},
  ];
  rows.forEach((r, ri) => {
    hardFill(p, 10 + ri, mixColor('#b9a87e', '#d9e2cc', 0.4), [[0, r.base - 6], [1080, r.base - 6], [1080, r.base + 30], [0, r.base + 30]]);
    const c = rowCam(r.base, r.d, r.eye);
    views.forEach(([, h], i) => paintBeast(p, c, r.build(), {at: [(i - 1) * r.dx, 0], heading: h, seed: 70000 + ri * 7000 + i * 1000, ground: ri === 3 ? 0.25 : 0, shadowOp: 90}));
  });
};
const SheetLabels = () => (
  <>
    {['คอยาว (long-neck) ~22 m', 'ไทรเซอราทอปส์ ~8.5 m', 'แองคิโลซอรัส ~6.5 m', 'แมลงปอยักษ์ ~0.7 m (span)'].map((t, i) => <div key={t} style={label(40, [40, 520, 960, 1400][i], 30)}>{t}</div>)}
    {views.map(([v], i) => <div key={v} style={{...label(110 + i * 340, 1860, 26)}}>{v}</div>)}
  </>
);

const MORN = LIGHT.morning;
const ext = (at: V3, draw: (q: Painter, c: YCam) => void, bias?: number) => ({at, bias, draw});
/** `sortAt`: the depth-sort point (a big animal sorts at its head/neck so near ferns do not cut the neck; Boss splits body and neck items when hardening). */
const beastItem = (B: () => Build, at: [number, number], heading: number, seed: number, extra: Partial<Parameters<typeof paintBeast>[3]> = {}, sortAt?: V3) => ext(sortAt ?? [at[0], 0, at[1]], (q, c) => { paintBeast(q, c, B(), {at, heading, seed, amb: MORN.amb, ambK: 0.08, ...extra}); });
const headingTo = (from: [number, number], to: [number, number]) => Math.atan2(to[1] - from[1], to[0] - from[0]);
/** Local head target (s, y, l) for a creature at `at` with `heading` reaching the world point `w`. */
const localOf = (at: [number, number], h: number, w: V3): [number, number, number] => { const dx = w[0] - at[0], dz = w[2] - at[1]; return [dx * Math.cos(h) + dz * Math.sin(h), w[1], dx * Math.sin(h) - dz * Math.cos(h)]; };
/** The cycad seed cone (N16-10 R13 prop): a bright orange cluster of 9 seeds about 0.3 m, so the toss and the bite read. */
const seedCone = (p: Painter, g: [number, number], u: number, seed: number) => {
  const k = {g, u, s: 1};
  [[0, 0.1], [-0.07, 0.06], [0.07, 0.06], [-0.04, 0.15], [0.05, 0.15], [0, 0.2], [-0.08, 0.12], [0.08, 0.12], [0, 0.03]].forEach(([x, y], i) => {
    hardFill(p, seed + i, i % 3 ? '#e8721c' : '#f08a2a', cell(k, x, y, 0.05, 0.06, 10));
    hardFill(p, seed + 20 + i, '#ffc070', cell(k, x - 0.015, y + 0.02, 0.015, 0.015, 6));
  });
};

// ------------------------------------------------------------------ SH02 (+100): the hook. The long-neck stands at the forest edge beyond the gate (neck up into the
// conifer tops, the reference pose), two more far in the haze, two pterosaurs glide over the paddy.
const paintSh02 = (p: Painter) => {
  // R13 v5: frame at +73 (after "ทั้งหมู่บ้าน"); long-neck nearer the gate (-4,-17), body heading east so the neck arcs in profile; est. bounds x 227-896, y 392-933.
  const c = camOf(CAM16_2, 73 / 124), t = 183 / FPS;
  paintVillage(p, c, {mode: 'morning', t, extra: [
    beastItem(() => buildLongNeck({head: [7.6, 14.5, 0]}), [-4, -17], headingTo([-4, -17], [8, -24]), 71000, {haze: 0.02}, [-4, 0, -13.0]),
    beastItem(() => buildLongNeck({head: [7.0, 13.5, -1]}), [-14, -36], headingTo([-14, -36], [-20, -30]), 72000, {haze: 0.42}),
    beastItem(() => buildLongNeck({walk: 0.3, stride: 2.2}), [16, -40], headingTo([16, -40], [6, -42]), 73000, {haze: 0.5}),
    ext([2.1, 0, -11.6], (q, cc) => { paintCast(q, cc, 'K', {at: [2.1, 0, -11.6], view: 'back', pose: 'P01', t: 2.9, face: 'worried', held: (qq, a, u) => basket(qq, a.lHand, u, true)}); }),
    ext([3.2, 0, -3.9], (q, cc) => { paintHen(q, cc, [3.2, 0, -3.9], {view: 'right'}, MORN, 16000); }),
    ext([4.9, 0, -3.7], (q, cc) => { paintHen(q, cc, [4.9, 0, -3.7], {view: 'left', peck: 0.8}, MORN, 16200); }),
  ]});
  paintPterosaur(p, c, {at: [-2, 16, -22], heading: 0.4, flap: 0.2, amp: 0.15, span: 3, bank: 0.2}, MORN, 41000);
  paintPterosaur(p, c, {at: [4, 19, -30], heading: 0.9, flap: 0.6, amp: 0.3, span: 3}, MORN, 41500);
};

// ------------------------------------------------------------------ SH03 (+30): the giant dragonfly hovers at Keng's face between "มะม่วงล่ะ?" and "กล้วยล่ะ?"
const CAM03 = camMove([3.4, 1, -16.5], [75, 85], [2.4, 2], 0.95, {f: 900, hy: 1020, pitch: [15, 15], ease: [0, 1]});
const paintSh03 = (p: Painter) => {
  const c = camOf(CAM03, 30 / 68), t = 247 / FPS;
  paintVillage(p, c, {mode: 'morning', t, extra: [
    ext([3.4, 0, -16.5], (q, cc) => { paintCast(q, cc, 'K', {at: [3.4, 0, -16.5], facing: [0.75, 0.66], pose: 'P01', face: 'surprised', t, held: (qq, a, u) => basket(qq, a.lHand, u)}); }),
  ]});
  paintBeast(p, c, buildDragonfly({flap: 0.15}), {at: [5.0, -16.35], heading: headingTo([5.0, -16.35], [3.4, -16.5]) + 0.6, ground: 1.2, pitch: 0.15, bank: -0.55, seed: 76000, amb: MORN.amb, ambK: 0.05});
};

// ------------------------------------------------------------------ SH05 (+40): an ankylosaur ambles along the forest edge, browsing ferns, where the flowers fade
const CAM05 = camMove([3.2, 1.5, -18], [20, 12], [7, 6], 1.4, {f: 820, hy: 960, pitch: [8, 8], ease: [0, 1]});
const paintSh05 = (p: Painter) => {
  const c = camOf(CAM05, 40 / 65), t = 417 / FPS;
  paintVillage(p, c, {mode: 'morning', t, extra: [
    beastItem(() => buildAnkylosaur({walk: 0.35, stride: 1.1, tail: 0.35, head: 0.6}), [1.0, -19.6], 0.15, 77000, {}, [1.0, 0, -19.0]),
    ext([3.4, 0, -16.5], (q, cc) => { paintCast(q, cc, 'K', {at: [3.4, 0, -16.5], view: 'back', pose: 'P01', face: 'worried', t}); }),
  ]});
};

// ------------------------------------------------------------------ SH08 (+60): the long-neck (volume, front half between the conifers) lowers its head to cycad C2; Keng points AT the head
const LN8: [number, number] = [13, -22], C2: V3 = [5.9, 0, -18.4];
const paintSh08 = (p: Painter) => {
  const c = camOf(CAM16_8, 60 / 143), t = 697 / FPS, h = headingTo(LN8, [C2[0], C2[2]]);
  const B = () => buildLongNeck({head: localOf(LN8, h, [5.75, 2.35, -18.3]), jaw: 0.4});
  const toHead: [number, number] = [5.75 - 3.4, -18.3 + 16.5];
  paintVillage(p, c, {mode: 'morning', t, extra: [
    ext([4.05, 0, -16.7], (q, cc) => paintCycad(q, cc, [4.05, 0, -16.7], 2.0, MORN, 21000, {seeds: true})),
    ext(C2, (q, cc) => paintCycad(q, cc, C2, 2.2, MORN, 21100)),
    beastItem(B, LN8, h, 78000, {}, [5.6, 0, -17.9]),
    ext([3.75, 0, -16.15], (q, cc) => { paintCast(q, cc, 'Y', {at: [3.75, 0, -16.15], facing: toHead, pose: 'P01', face: 'worried', t}); }),
    ext([3.4, 0, -16.5], (q, cc) => { paintCast(q, cc, 'K', {at: [3.4, 0, -16.5], facing: [1, 0.35], pose: 'P05', face: 'surprised', t}); }),   // R13: front-3/4 so the pointing (left) arm reads screen-right toward the head
  ]});
};

// ------------------------------------------------------------------ SH10 (end, +80): close on the long-neck's head as it lifts the orange seed cone Grandma tossed; Keng and Grandma gape behind
const LN10: [number, number] = [12, -24], CONE: V3 = [5.4, 0.0, -19.0];
// the shot pushes from the toss wide (target (5.6, 1.8, -19.5), r 7.6, f 820) to this end camera on the head at the cone, past Keng and Grandma
const CAM10 = camMove([5.4, 0.9, -19.0], [-20, -20], [2.6, 2.6], 1.1, {f: 950, hy: 900, pitch: [8, 8]});
const paintSh10 = (p: Painter) => {
  const c = camOf(CAM10, 1), t = 923 / FPS, h = headingTo(LN10, [CONE[0], CONE[2]]);
  const mouthAt: V3 = [CONE[0] + 0.05, 1.05, CONE[2] + 0.05];
  const B = () => buildLongNeck({head: localOf(LN10, h, mouthAt), jaw: 0.55});
  paintVillage(p, c, {mode: 'morning', t, extra: [
    ext(C2, (q, cc) => paintCycad(q, cc, C2, 2.2, MORN, 21100)),
    ext([3.4, 0, -16.5], (q, cc) => { paintCast(q, cc, 'K', {at: [3.4, 0, -16.5], facing: [0.6, -0.8], pose: 'P01', face: 'surprised', faceState: {open: 1}, t}); }),
    ext([3.95, 0, -16.2], (q, cc) => { paintCast(q, cc, 'Y', {at: [3.95, 0, -16.2], facing: [0.5, -0.86], pose: 'P01', face: 'worried', t}); }),
  ]});
  const a = paintBeast(p, c, B(), {at: LN10, heading: h, seed: 79000, amb: MORN.amb, ambK: 0.06});
  const m = a.pt('mouth');
  if (m) seedCone(p, [m[0], m[1] + 0.12 * camUnit(c, mouthAt)], camUnit(c, mouthAt), 79900);
};

// SH10 start (+14, the release): the toss wide; the long-neck already stands over C2 so the seed cone flies toward its head
const CAM10A = camMove([5.6, 1.8, -19.5], [-20, -16], [7.6, 7.2], 1.1, {f: 820, hy: 920, pitch: [8, 8], ease: [0, 1]});
const paintSh10a = (p: Painter) => {
  const c = camOf(CAM10A, 14 / 85), t = 857 / FPS, h = headingTo(LN10, [CONE[0], CONE[2]]);
  const B = () => buildLongNeck({head: localOf(LN10, h, [6.0, 3.2, -20.0]), jaw: 0.2});
  const Yp: V3 = [3.95, 0, -16.2], Kp: V3 = [3.4, 0, -16.5], toL: [number, number] = [0.6, -0.8];
  paintVillage(p, c, {mode: 'morning', t, extra: [
    ext(C2, (q, cc) => paintCycad(q, cc, C2, 2.2, MORN, 21100)),
    beastItem(B, LN10, h, 79000, {}, [5.8, 0, -18.6]),
    ext(Kp, (q, cc) => { paintCast(q, cc, 'K', {at: Kp, facing: toL, pose: 'P01', face: 'sad', t}); }),
    ext(Yp, (q, cc) => { paintCast(q, cc, 'Y', {at: Yp, facing: toL, pose: 'P16', face: 'angry', t}); }),
  ]});
  const g = camPoint(c, [4.6, 2.1, -17.6]);
  if (g) seedCone(p, g, camUnit(c, [4.6, 2.1, -17.6]), 79950);
};

// R1.4: superseded (user 14 Nov: triceratops saved for a later episode). Kept as a note, not rendered.
// ------------------------------------------------------------------ SH11 R1.3 (+40): "งั้นปลูกข้าวสิ!" Keng plants the hoe; a triceratops wades through the flooded paddy behind him
const CAM11 = camMove([15.6, 1.0, -1.0], [-125, -115], [2.6, 2.3], 0.95, {f: 950, hy: 960, pitch: [4, 4], cx: -190, ease: [0, 1]});
const paintSh11 = (p: Painter) => {
  const c = camOf(CAM11, 40 / 58), t = 949 / FPS, at: [number, number] = [20.5, 4.5];
  paintVillage(p, c, {mode: 'morning', t, extra: [
    beastItem(() => buildTriceratops({walk: 0.2, stride: 1.5, head: 0.25, turn: 0.35}), at, headingTo(at, [15.6, -1.0]) - 0.6, 80000),
    ext([15.6, 0, -1.0], (q, cc) => { paintCast(q, cc, 'K', {at: [15.6, 0, -1.0], facing: [-0.75, 0.66], pose: 'P09', face: 'happy', t, held: (qq, a, u) => paintHeldProp(qq, 'hoe' as never, [a.rHand[0], a.rHand[1]], u, {ang: -0.5})}); }),
  ]});
};

// ------------------------------------------------------------------ SH16 (+44 of 150): the grab. The pterosaur (span 3 m) closes its feet on the fish at the net rim, a metre over Keng
const CAM16R = camMove([0.8, 1.3, -0.6], [-8, -14], [2.7, 2.5], 1.0, {f: 900, hy: 800, pitch: [12, 12], ease: [0, 1]});
const paintSh16 = (p: Painter) => {
  const c = camOf(CAM16R, 44 / 149), t = (1294 + 44) / FPS, L = RIVER_LIGHT.day, kPos: V3 = [0.6, -0.1, -0.5];
  let hand: [number, number] | null = null;
  const pose = (fish: V3) => ({at: [fish[0] - 0.12, fish[1] + 0.5, fish[2] + 0.1] as V3, heading: -2.6, pitch: 0.25, flap: 0.15, amp: 0.25, fold: 0.05, grab: 1, span: 3});
  paintRiver(p, c, {mode: 'day', t, nets: [{at: [-3.8, -3.2], span: 1.8}, {at: [4.5, -5.2], span: 1.6}], extra: [
    {at: kPos, draw: (q, cc) => { paintCast(q, cc, 'K', {at: kPos, view: 'front', pose: 'P07', face: 'surprised', t, shadow: {op: 30}, held: (qq, a, uu) => { hand = [a.rHand[0], a.rHand[1]]; paintHeldProp(qq, 'hand-net', a.rHand, uu, {ang: 0.12}); }}); }},
    {at: [-2.0, -0.1, -2.6], draw: (q, cc) => { paintCast(q, cc, 'V', {at: [-2.0, -0.1, -2.6], view: 'right', pose: 'P01', face: 'surprised', t}); }},
  ]});
  if (!hand) return;
  const h0 = hand as [number, number], fishPx: [number, number] = [h0[0] + 0.1 * camUnit(c, kPos), h0[1] - 0.7 * camUnit(c, kPos)];
  const fish = worldAt(c, fishPx[0], fishPx[1], camSpace(c, kPos).d);
  const ps = pose(fish);
  paintPterosaurShadow(p, c, ps, -0.08, 41900, 80);
  const a = paintPterosaur(p, c, ps, L, 41000);
  paintHeldProp(p, 'fish', a.feet ?? fishPx, camUnit(c, fish), {ang: 1.0, swing: 0.4});
};

// ------------------------------------------------------------------ SH22 gag (+128, proposed): camera tilted up from the hen to the midday sky; an original
// T. rex made of cumulus puffs roars (anatomy after the user's T. rex refs: big skull, open jaws, short two-finger arms, heavy legs, tail up; no film frame).
type Puff = [number, number, number];
const chain = (pts: Puff[], step = 0.55): Puff[] => {
  const out: Puff[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay, ar] = pts[i], [bx, by, br] = pts[i + 1], len = Math.hypot(bx - ax, by - ay), n = Math.max(1, Math.round(len / (step * Math.min(ar, br))));
    for (let k = 0; k < n; k++) { const u = k / n; out.push([ax + (bx - ax) * u, ay + (by - ay) * u, ar + (br - ar) * u]); }
  }
  out.push(pts[pts.length - 1]);
  return out;
};
const CLOUD = {sh: '#9db2c9', mid: '#dbe5ee', lit: '#fbfdff', deep: '#7f97b3'};
const puffs = (p: Painter, seed: number, ps0: Puff[], k = 1) => {
  const j = (i: number, s: number) => Math.sin(i * 12.9898 + seed * 0.37 + s) * 0.5;
  const ps: Puff[] = ps0.flatMap(([x, y, r], i) => i % 2 ? [[x, y, r]] as Puff[] : [[x, y, r], [x + r * 0.62 * Math.cos(i * 2.4 + seed), y + r * 0.62 * Math.sin(i * 2.4 + seed) - r * 0.15, r * (0.5 + 0.25 * (j(i, 7) + 0.5))]] as Puff[]);
  ps.forEach(([x, y, r], i) => hardFill(p, seed + i, mixColor(CLOUD.sh, CLOUD.deep, 0.3 * k), ell(x + r * 0.12, y + r * 0.16, r * (1.02 + 0.1 * j(i, 1)), r * (0.94 + 0.1 * j(i, 2)))));
  ps.forEach(([x, y, r], i) => hardFill(p, seed + 500 + i, CLOUD.mid, ell(x - r * 0.06, y - r * 0.06, r * (0.88 + 0.08 * j(i, 3)), r * 0.84)));
  ps.forEach(([x, y, r], i) => hardFill(p, seed + 900 + i, CLOUD.lit, ell(x - r * 0.24, y - r * 0.26, r * 0.5, r * 0.44)));
};
const paintSh22Sky = (p: Painter) => {
  for (let i = 0; i < 24; i++) hardFill(p, 90 + i, mixColor('#5f9bd0', '#cfe4f0', i / 23), rectPts(0, i * 80, 1080, i * 80 + 81));
  puffs(p, 9100, chain([[-60, 1700, 150], [300, 1640, 170], [700, 1690, 160], [1140, 1620, 170]], 0.7)); // far bank
  puffs(p, 9200, chain([[860, 230, 40], [960, 200, 55], [1080, 240, 45]], 0.6));
  // body, back to front: tail, far leg, torso, near leg, arms, neck, head, jaw
  puffs(p, 9300, chain([[700, 900, 120], [860, 840, 92], [960, 720, 70], [1010, 590, 52], [990, 500, 36]]), 0.8);
  puffs(p, 9400, chain([[760, 980, 118], [800, 1140, 84], [770, 1290, 62], [740, 1400, 76]]), 1);
  puffs(p, 9500, chain([[480, 820, 120], [600, 880, 150], [720, 900, 140]]));
  puffs(p, 9600, chain([[570, 980, 136], [520, 1150, 92], [560, 1310, 66], [520, 1420, 84]]));
  puffs(p, 9700, chain([[470, 960, 34], [440, 1030, 24], [410, 1060, 18]]));
  puffs(p, 9750, chain([[520, 980, 30], [500, 1050, 22]]));
  puffs(p, 9800, chain([[470, 790, 100], [410, 690, 92], [380, 610, 96]]));
  puffs(p, 9900, chain([[420, 560, 108], [320, 500, 92], [210, 470, 70], [130, 470, 52]])); // skull + upper jaw
  puffs(p, 9950, chain([[380, 700, 70], [280, 690, 52], [190, 650, 40], [140, 620, 32]])); // lower jaw dropped
  hardFill(p, 9990, mixColor('#5f9bd0', '#cfe4f0', 0.28), [[150, 545], [300, 560], [370, 610], [300, 650], [180, 610]]); // open mouth: sky shows through
  for (let i = 0; i < 6; i++) { hardFill(p, 9991 + i, CLOUD.lit, ell(170 + i * 30, 548 + i * 2, 9, 16)); hardFill(p, 9997 + i, CLOUD.lit, ell(180 + i * 28, 612 - i * 3, 8, 14)); }
  hardFill(p, 9985, CLOUD.deep, ell(345, 492, 30, 20, 18, -0.2)); // eye hollow under the brow
  puffs(p, 9980, [[350, 455, 40], [300, 450, 30]]);
  for (let i = 0; i < 5; i++) inkLine(p, 9600 + i, [[120 - i * 4, 520 + i * 26], [40 - i * 10, 500 + i * 34], [-20, 480 + i * 44]], {color: '#ffffff', weight: 5 - i * 0.6, curve: 0.5}); // roar wind
  puffs(p, 9000, chain([[-80, 1580, 120], [260, 1500, 150], [640, 1480, 170], [1150, 1520, 160]], 0.6)); // cloud bank swallowing the feet
  // conifer tips along the bottom (camera tilted up from the yard)
  for (let i = 0; i < 6; i++) { const x = 60 + i * 190 + (i % 2) * 40, y = 1600 + (i % 3) * 70; hardFill(p, 9700 + i * 7, '#6b4a33', rectPts(x - 9, y, x + 9, 1920)); for (let t = 0; t < 4; t++) { const ty = y - 200 + t * 110, w = 70 + t * 34; hardFill(p, 9701 + i * 7 + t * 50, '#3f5e44', [[x - w, ty + 120], [x, ty], [x + w, ty + 120], [x, ty + 92]]); hardFill(p, 9702 + i * 7 + t * 50, '#5b8460', [[x - w * 0.3, ty + 60], [x, ty], [x + w, ty + 120], [x, ty + 92]]); } }
};


// ================================================================== R1.4 (Film, 14 Nov 2026; sheet EDU-EP16-SHEET-R1.4): triceratops out of EP16; SH11 ankylosaur, SH15/SH21 long-neck, SH22 T. rex apparition
/** Mud splash at a planted foot (screen px): a brown ring wash and droplets thrown up and out. */
const mudSplash = (p: Painter, g: [number, number], u: number, seed: number, k = 1) => {
  const ring = (r: number) => Array.from({length: 18}, (_, j) => [g[0] + r * u * Math.cos((j / 18) * 6.283), g[1] + 0.32 * r * u * Math.sin((j / 18) * 6.283)] as [number, number]);
  washAt(p, seed, '#6a5a3c', 120, ring(0.55 * k), 0.3, 0.2);
  washAt(p, seed + 1, '#c8c0a0', 90, ring(0.75 * k).map(([x, y], j) => [x, y + (j % 2 ? 2 : -2)] as [number, number]), 0.2, 0.2);
  for (let i = 0; i < 11; i++) { const a = -0.3 - (i / 10) * 2.5, d = (0.25 + 0.35 * ((i * 37) % 7) / 7) * k; hardFill(p, seed + 10 + i, i % 3 ? '#5e4a30' : '#8a7452', cell({g: [g[0] + Math.cos(a) * d * u, g[1] + Math.sin(a) * d * u * 1.2], u, s: 1}, 0, 0, 0.035, 0.045, 7)); }
};
// SH11 R1.4 (+40 of 95): the ankylosaur from the forest edge (SH05) wades the flooded paddy behind Keng; mud splashes on each front-foot plant
const AN11: [number, number] = [20.3, 4.6];
const paintSh11b = (p: Painter) => {
  const c = camOf(CAM11, 40 / 58), t = 969 / FPS, h = headingTo(AN11, [15.6, -1.0]) - 0.55, B = () => buildAnkylosaur({walk: 0.12, stride: 1.1, tail: 0.3, head: 0.1});
  paintVillage(p, c, {mode: 'morning', t, extra: [
    ext([AN11[0], 0, AN11[1]], (q, cc) => {
      const o = {at: AN11, heading: h, seed: 80500, amb: MORN.amb, ambK: 0.08};
      const probe = paintBeast(null, cc, B(), o), f0 = probe.pt('foot0');   // near front foot: the splash sits under the body, painted first
      if (f0) mudSplash(q, f0, camUnit(cc, [AN11[0], 0, AN11[1]]), 80900, 1.1);
      paintBeast(q, cc, B(), o);
    }),
    ext([15.6, 0, -1.0], (q, cc) => { paintCast(q, cc, 'K', {at: [15.6, 0, -1.0], facing: [-0.75, 0.66], pose: 'P09', face: 'happy', t, held: (qq, a, uu) => paintHeldProp(qq, 'hoe' as never, [a.rHand[0], a.rHand[1]], uu, {ang: -0.5})}); }),
  ]});
};

// SH15 R1.4 (+4, the wide): the village lines the empty paddy; far beyond it a long-neck browses a conifer top (it has food; they ask "with what?")
const CAM15 = camMove([[16, 1.2, -0.4], [15.3, 1.0, -0.4]], [-80, -70], [5.5, 1], [2.2, 1.4], {f: 850, hy: 900, pitch: [-4, -22], ease: [0.15, 0.55]});
const LN15: [number, number] = [42, -9];
const paintSh15 = (p: Painter) => {
  const c = camOf(CAM15, 4 / 66), t = 1287 / FPS;
  const vil: [number, number, number][] = [[14.2, 1.6, 0], [14.6, 0.4, 1], [14.9, -1.9, 2], [15.1, -3.0, 3], [14.4, 2.8, 4]];
  paintVillage(p, c, {mode: 'morning', t, extra: [
    beastItem(() => buildLongNeck({head: localOf(LN15, headingTo(LN15, [40, -2]), [41.5, 12.5, -4.2])}), LN15, headingTo(LN15, [40, -2]), 81000, {haze: 0.3}),
    ...vil.map(([x, z, i]) => ext([x, 0, z], (q, cc) => { paintCast(q, cc, i === 0 ? 'Y' : 'V', {at: [x, 0, z], view: 'back', pose: 'P01', face: 'worried', t, ...(i % 2 ? {} : {})}); })),
    ext([15.0, 0, -0.9], (q, cc) => { paintCast(q, cc, 'K', {at: [15.0, 0, -0.9], view: 'back', pose: 'P01', face: 'worried', t}); }),
  ]});
};

// SH21 R1.4 (end, +54): pull back to the yard wide; a long-neck has stepped out between the forest-edge trees beyond the fence, neck up over the tree ferns
const CAM21 = camMove([3, 1.2, -8], [-10, -24], [3, 7.5], [1.2, 2.4], {f: 850, hy: 920, pitch: [0, -5], ease: [0, 0.9]});   // R1.4: yaw 10->22 put the coop between the lens and the family; the camera swings west of the coop
const LN21: [number, number] = [15, -27];   // probe: end bounds x 470-869, y 417-921, head up at (475, 446)
const paintSh21 = (p: Painter) => {
  const c = camOf(CAM21, 1), t = 1804 / FPS, h = headingTo(LN21, [2, -24]);
  paintVillage(p, c, {mode: 'morning', t, extra: [
    beastItem(() => buildLongNeck({head: [7.4, 13.2, 1.5]}), LN21, h, 82000, {haze: 0.15}, [10, 0, -22]),
    ext([2.6, 0, -8.6], (q, cc) => { paintCast(q, cc, 'K', {at: [2.6, 0, -8.6], facing: [-0.3, 0.95], pose: 'P01', face: 'happy', t}); }),
    ext([3.6, 0, -8.2], (q, cc) => { paintCast(q, cc, 'Y', {at: [3.6, 0, -8.2], facing: [-0.4, 0.92], pose: 'P01', face: 'happy', t}); }),
    ext([3.25, 0, -8.5], (q, cc) => { paintHen(q, cc, [3.25, 0, -8.5], {view: 'left'}, MORN, 16400); }),
    ext([4.4, 0, -7.6], (q, cc) => { paintHen(q, cc, [4.4, 0, -7.6], {view: 'right', peck: 0.6}, MORN, 16600); }),
    ext([2.0, 0, -7.4], (q, cc) => { paintHen(q, cc, [2.0, 0, -7.4], {view: 'front'}, MORN, 16800); }),
  ]});
};

// SH22 R1.4 gag (+138 of 204): camera tilted up from the hen; a normally drawn T. rex (user refs, volume) rises out of a cloud bank as a faded
// apparition (its own layer at 50 % opacity), face and upper half only, jaws open in the roar; the line "Remember who you are" in the edu caption stroke.
const SKY = (p: Painter) => {
  for (let i = 0; i < 24; i++) hardFill(p, 90 + i, mixColor('#5f9bd0', '#cfe4f0', i / 23), rectPts(0, i * 80, 1080, i * 80 + 81));
  puffs(p, 9200, chain([[860, 230, 40], [960, 200, 55], [1080, 240, 45]], 0.6));
  puffs(p, 9210, chain([[-40, 380, 50], [120, 350, 64], [260, 390, 48]], 0.6));
  puffs(p, 9100, chain([[-60, 1180, 150], [300, 1120, 170], [700, 1160, 160], [1140, 1100, 170]], 0.7)); // far bank behind the apparition
};
const TREX_CAM: YCam = {x: 0, y: 3.2, z: 26, yaw: 0, f: 3400, hy: 840, pitch: 0, cx: 0} as YCam;   // probe: snout ~(300, 470), chest ~(560, 910); the bank at y ~1290 hides the hips and legs
/** The apparition at 50 %: in one canvas the T. rex's colours are mixed half toward the sky behind it (haze 0.5), then thin cloud wisps cross it.
 *  Production (Boss N16-22 R2) draws it on its own layer at opacity 0.5 so the far clouds show through. */
const TREX = (p: Painter) => {
  paintBeast(p, TREX_CAM, buildTRex({jaw: 0.9, neck: 0.9}), {at: [0.4, 0], heading: 2.5, pitch: 0.32, ground: -1.4, seed: 93000, shadowOp: 0, haze: 0.42, hazeCol: '#a9cbe6'});
  [[180, 640, 420, 26], [420, 820, 520, 30], [300, 1010, 640, 34], [620, 700, 360, 22]].forEach(([x, y, w, hh], i) => washAt(p, 93900 + i, '#f4f8fb', 70, Array.from({length: 16}, (_, j) => [x + w * 0.5 * Math.cos((j / 16) * 6.283), y + hh * Math.sin((j / 16) * 6.283)] as [number, number]), 0.4, 0.25));
};
const FRONT = (p: Painter) => {
  puffs(p, 9000, chain([[-80, 1380, 130], [240, 1300, 160], [620, 1290, 175], [1150, 1330, 160]], 0.6)); // the bank the T. rex rises out of
  puffs(p, 9050, chain([[-80, 1530, 120], [400, 1500, 150], [1150, 1520, 150]], 0.6));
  for (let i = 0; i < 5; i++) inkLine(p, 9600 + i, [[150 - i * 4, 560 + i * 26], [70 - i * 10, 540 + i * 34], [10, 520 + i * 44]], {color: '#ffffff', weight: 5 - i * 0.6, curve: 0.5}); // roar wind
  for (let i = 0; i < 6; i++) { const x = 60 + i * 190 + (i % 2) * 40, y = 1640 + (i % 3) * 60; hardFill(p, 9700 + i * 7, '#6b4a33', rectPts(x - 9, y, x + 9, 1920)); for (let t = 0; t < 4; t++) { const ty = y - 200 + t * 110, w = 70 + t * 34; hardFill(p, 9701 + i * 7 + t * 50, '#3f5e44', [[x - w, ty + 120], [x, ty], [x + w, ty + 120], [x, ty + 92]]); hardFill(p, 9702 + i * 7 + t * 50, '#5b8460', [[x - w * 0.3, ty + 60], [x, ty], [x + w, ty + 120], [x, ty + 92]]); } }
};
// One canvas (two BrushCanvas layers on one page did not composite: v1 black, v2 lost the T. rex).
const SKY_TREX_FRONT = (p: Painter) => { SKY(p); TREX(p); FRONT(p); };
const Layer = ({paint, paper, opacity = 1}: {paint: (p: Painter) => void; paper: string; opacity?: number}) => {
  const fn = useCallback(({brush}: PaintContext) => paint(makePainter(brush, {t: 0, frame: 0, fade: paper})), [paint, paper]);
  return <div style={{position: 'absolute', inset: 0, opacity}}><BrushCanvas paint={fn} paper={paper} /></div>;
};
const Sh22Sky = () => (
  <div style={{position: 'absolute', inset: 0, background: '#cfe4f0'}}>
    <Layer paint={SKY_TREX_FRONT} paper="#cfe4f0" />
    <Grain opacity={0.05} />
    <div style={{position: 'absolute', left: '6%', width: '88%', bottom: 1920 - 1344, textAlign: 'center', fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 700, fontSize: 51, lineHeight: 1.65, color: '#fff', WebkitTextStroke: '14px #2b1a12', paintOrder: 'stroke fill', textShadow: '0 0 16px rgba(34,18,10,0.92), 0 0 5px rgba(34,18,10,0.9), 0 4px 0 #2b1a12'}}>Remember who you are</div>
  </div>
);

const frame = (paint: (p: Painter) => void, paper: string, children?: ReactNode) => () => <Painted paint={paint} paper={paper} band={false}>{children}</Painted>;
export const LOOKS_R13: Record<string, () => JSX.Element> = {
  'AS-BEASTS': frame(paintSheet, '#d9e2cc', <SheetLabels />),
  'LF-SH02': frame(paintSh02, '#cfdcc4'), 'LF-SH03': frame(paintSh03, '#cfdcc4'), 'LF-SH05': frame(paintSh05, '#cfdcc4'), 'LF-SH08': frame(paintSh08, '#cfdcc4'),
  'LF-SH10A': frame(paintSh10a, '#cfdcc4'), 'LF-SH10': frame(paintSh10, '#cfdcc4'), 'LF-SH11': frame(paintSh11b, '#cfdcc4'), 'LF-SH11-TRI-R13': frame(paintSh11, '#cfdcc4'), 'LF-SH15': frame(paintSh15, '#cfdcc4'), 'LF-SH21': frame(paintSh21, '#cfdcc4'), 'LF-SH22SKY-R14': Sh22Sky, 'LF-SH16': frame(paintSh16, '#cfdcc4'), 'LF-SH22SKY': frame(paintSh22Sky, '#cfe4f0'),
};
void FPS; void paintSh22Sky; void camPoint; void cardAt; void seedCone;
