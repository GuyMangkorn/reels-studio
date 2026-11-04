import {EXPRESSIONS} from '../kit/expressions';
import {poseFor} from '../kit/poses';
import {type FigPose} from '../kit/cast';
import {openHandParts} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {LEAD, INF, PAPER} from './frames';
import {
  E, R, affine, bottleElev, box, bucketElev, canElev, contact, doorWall, ell, fgPlant, floorMap, glazeS, greyLight, gripArm, hand, povArm, SKIN, stubbleOver, messyHair, lead, lightOf, milkBox, breadLoaf, lunchBox, yogurt, morning, nightLight, poly, potElev, resetE, shade, shadowAt, shoulderPoint, stroke, surface,
  tileFloor, veil, woodGrain, crack,
} from './sb-lib';
import {floorTop, roundTop, type Shot} from './sb-a';
import {resetIds, umbrella} from './sets';
import {cur, ease, hose, moved, seg} from './sb-lib';

// ZC2-SB-R3 stills, part B: B05-B10 (bathroom, fridge, stove and food, balcony night, day 3). Blocking stills at frame 0.

const TH = {fontFamily: 'Noto Sans Thai, sans-serif'} as const;
const faceOf = (k: keyof typeof EXPRESSIONS, o: Partial<FigPose['face']> = {}): FigPose['face'] => ({...EXPRESSIONS[k], ...o});
const rotP = (pts: Pt[], c: Pt, a: number): Pt[] => pts.map(([x, y]) => [c[0] + (x - c[0]) * Math.cos(a) - (y - c[1]) * Math.sin(a), c[1] + (x - c[0]) * Math.sin(a) + (y - c[1]) * Math.cos(a)]);
const STUB = {...LEAD, head: {...LEAD.head, facial: 'stubble' as const}};
const tiredFace = (look: [number, number]): FigPose['face'] => ({...EXPRESSIONS.tired, mouth: 'flat', sweat: false, brow: 'worry', squint: 0.55, look});
void PAPER; void INF;

/** Bathroom wall of small glazed tiles with grout, stains and a dado band; returns nothing. */
const tileWall = (p: Painter, y0: number, y1: number, base: string, t = 110, seed = 1, x1 = 1100) => {
  poly(p, base, R(-20, y0, x1, y1));
  for (let r = 0; y0 + r * t < y1; r++) for (let c = 0; c * t < x1 + 40; c++) { const j = (r * 7 + c * 13 + seed) % 10; if (j > 6) glazeS(p, j > 8 ? '#ffffff' : mixColor(base, '#4a5a52', 0.3), 45, R(c * t + 8, y0 + r * t + 8, c * t + t - 10, y0 + r * t + t - 10)); }
  for (let r = 0; y0 + r * t <= y1; r++) stroke(p, '2B', mixColor(base, '#2e3a34', 0.5), 1.5, [[-20, y0 + r * t], [x1, y0 + r * t]], 0.01);
  for (let c = 0; c * t < x1 + 40; c++) stroke(p, '2B', mixColor(base, '#2e3a34', 0.5), 1.5, [[c * t, y0], [c * t, y1]], 0.01);
  [[200, y0 + 150], [760, y0 + 330], [940, y0 + 100]].forEach(([x, y], i) => glazeS(p, '#6b6a50', 55, ell(x, y, 30 + i * 8, 90, 10)));
};
const bathFloor = (p: Painter, GY: number, U: number, seed = 2) => {
  surface(p, R(-20, GY, 1100, 1940), '#8d9a94', {seed, patches: 14, grain: 'none', streaks: 0, warm: '#2e3a34', cool: '#dfe8e2'});
  const t = 0.3 * U;
  for (let y = GY; y < 1940; y += t * 0.75) stroke(p, '2B', '#4a5650', 1.5, [[-20, y], [1100, y]], 0.01);
  for (let x = -20; x < 1100; x += t) stroke(p, '2B', '#4a5650', 1.5, [[x, GY], [x * 1.3 - 150, 1940]], 0.01);
  poly(p, '#6f7c76', R(-20, GY - 0.05 * U, 1100, GY)); stroke(p, 'HB', '#dfe8e2', 1.2, [[-20, GY - 0.048 * U], [1100, GY - 0.048 * U]], 0.01);
};
/** Front-on toilet (elevation): cistern box behind, seat/bowl in front. Origin bottom-centre. */
const toiletFront = (p: Painter, cx: number, gy: number, U: number, lid = true) => {
  shadowAt(p, cx + 20, gy + 6, 0.3 * U, 0.03 * U, 100);
  const cw = 0.42 * U, ct = gy - 0.85 * U, cb = gy - 0.45 * U;
  poly(p, '#e8ecea', R(cx - cw / 2, ct, cx + cw / 2, cb)); shade(p, '#ffffff', 60, R(cx - cw / 2 + 6, ct, cx - cw * 0.2, cb)); shade(p, '#1d2a26', 45, R(cx + cw * 0.28, ct, cx + cw / 2, cb)); E(p, R(cx - cw / 2, ct, cx + cw / 2, cb), 1.2);
  poly(p, '#dfe4e2', R(cx - cw / 2 - 6, ct - 14, cx + cw / 2 + 6, ct)); E(p, R(cx - cw / 2 - 6, ct - 14, cx + cw / 2 + 6, ct), 1.2);
  poly(p, '#9aa4a0', ell(cx + cw * 0.28, ct - 8, 12, 7, 8)); // flush button
  const bw = 0.38 * U;
  poly(p, '#e4e8e6', [[cx - bw * 0.3, gy], [cx + bw * 0.3, gy], [cx + bw * 0.34, gy - 0.22 * U], [cx - bw * 0.34, gy - 0.22 * U]]); E(p, [[cx - bw * 0.3, gy], [cx + bw * 0.3, gy], [cx + bw * 0.34, gy - 0.22 * U], [cx - bw * 0.34, gy - 0.22 * U]], 1.1);
  poly(p, '#f0f3f1', ell(cx, gy - 0.3 * U, bw * 0.55, 0.15 * U, 22)); E(p, ell(cx, gy - 0.3 * U, bw * 0.55, 0.15 * U, 22), 1.2);
  poly(p, lid ? '#7e8c88' : '#2d3b44', ell(cx, gy - 0.31 * U, bw * 0.38, 0.09 * U, 20)); shade(p, '#ffffff', 40, ell(cx - 14, gy - 0.34 * U, bw * 0.18, 0.025 * U, 10));
  shade(p, '#1d2a26', 45, [[cx + bw * 0.2, gy - 0.3 * U], [cx + bw * 0.55, gy - 0.3 * U], [cx + bw * 0.5, gy - 0.18 * U]]);
};

// ------------------------------------------------------------------ B05-SH01: bottles to drink, bucket to flush (MW from the bathroom door)
const B05_SH01 = (p: Painter) => {
  resetIds(30000); resetE(30000);
  const U = 720, GY = 1500;
  tileWall(p, -20, GY, '#c9d6cf', 120, 3);
  bathFloor(p, GY, U);
  // frosted window above the toilet: the light source
  poly(p, '#7d8780', R(330, 70, 740, 500)); poly(p, '#f6f9ee', R(346, 86, 724, 484)); for (let i = 1; i < 4; i++) stroke(p, 'HB', '#d6dccc', 1.2, [[346 + i * 94, 86], [346 + i * 94, 484]], 0.01);
  E(p, R(330, 70, 740, 500), 1.4); shade(p, '#fff6dc', 60, [[346, 484], [724, 484], [960, 1500], [100, 1500]]);
  // shower recess left: wall valve, shower head, hose, drain
  poly(p, '#b9c8c0', R(-20, 200, 300, GY)); glazeS(p, '#6b7c74', 70, R(-20, 200, 300, GY)); stroke(p, '2B', '#4a5650', 2.4, [[300, 200], [300, GY]], 0.01);
  poly(p, '#a8aeb2', R(120, 330, 150, 520)); E(p, R(120, 330, 150, 520), 1.1); poly(p, '#a8aeb2', ell(80, 520, 60, 20, 12)); E(p, ell(80, 520, 60, 20, 12), 1.0); poly(p, '#8e949a', R(40, 760, 140, 790)); poly(p, '#c7352b', ell(50, 775, 12, 12, 8)); poly(p, '#2f6fb0', ell(130, 775, 12, 12, 8));
  poly(p, '#6e747a', ell(150, GY + 60, 60, 16, 12)); E(p, ell(150, GY + 60, 60, 16, 12), 1.0);
  // toilet centre, bum gun on its holder beside it, bucket + dipper (ขัน) on the floor
  toiletFront(p, 520, GY, U);
  poly(p, '#a8aeb2', R(676, 900, 700, 1010)); E(p, R(676, 900, 700, 1010), 1.0); hose(p, [[688, 1010], [690, 1100], [650, 1180], [704, 1260], [684, 1330]], 12, '#8a9096');
  bucketElev(p, 280, GY, 230, 250, '#c7352b'); poly(p, '#2f6fb0', ell(402, GY - 40, 40, 14, 10)); E(p, ell(402, GY - 40, 40, 14, 10), 1.0); poly(p, '#2f6fb0', R(400, GY - 120, 412, GY - 40)); // ขัน with its handle
  // sink counter right with basin and a row of water bottles on it
  box(p, 800, 880, 1100, 1020, '#d7d2c4', {w: 1.2}); poly(p, '#c0bcae', R(810, 1020, 1100, GY)); E(p, R(810, 1020, 1100, GY), 1.2); stroke(p, '2B', '#6a6556', 2, [[955, 1030], [955, GY - 10]], 0.01); poly(p, '#aab0b6', ell(940, 905, 80, 14, 14));
  [0, 1, 2, 3].forEach((i) => bottleElev(p, 830 + i * 62, 880, 52, 170, 0.92 - i * 0.02));
  poly(p, '#aab0b6', R(1040, 780, 1062, 880)); poly(p, '#aab0b6', R(1020, 770, 1062, 788));
  poly(p, '#cfd6d2', R(840, 330, 1080, 700)); poly(p, '#e9f0f0', R(850, 340, 1070, 690)); shade(p, '#ffffff', 60, [[850, 340], [920, 340], [880, 690], [850, 690]]); E(p, R(840, 330, 1080, 700), 1.4); // mirror
  shade(p, '#10161c', 45, R(-20, 1700, 1100, 1940));
  const F = cur.f; // light passes: bottles catch light at f 12, bucket and scoop at f 41
  shade(p, '#fff6dc', 110 * ease(seg(F, 12, 20)), R(815, 700, 1085, 1060));
  shade(p, '#fff6dc', 70 * ease(seg(F, 41, 49)), [[165, GY - 250], [395, GY - 250], [377, GY], [183, GY]]);
};

// ------------------------------------------------------------------ B05-SH02: one pour (side MS)
const B05_SH02 = (p: Painter) => {
  resetIds(31000); resetE(31000);
  const U = 820, GY = 1560;
  tileWall(p, -20, GY, '#c9d6cf', 130, 5);
  bathFloor(p, GY, U, 4);
  poly(p, '#7d8780', R(700, 130, 1040, 470)); poly(p, '#f6f9ee', R(714, 144, 1026, 456)); E(p, R(700, 130, 1040, 470), 1.4);
  shade(p, '#fff6dc', 60, [[714, 456], [1026, 456], [1100, 1560], [300, 1560]]);
  // toilet in profile facing left: cistern against the wall (right), bowl and open lid
  const cx0 = 860, cx1 = 1080;
  shadowAt(p, 820, GY + 8, 320, 22, 100);
  poly(p, '#e8ecea', R(cx0, GY - 0.82 * U, cx1, GY - 0.44 * U)); shade(p, '#ffffff', 60, R(cx0 + 6, GY - 0.82 * U, cx0 + 60, GY - 0.44 * U)); E(p, R(cx0, GY - 0.82 * U, cx1, GY - 0.44 * U), 1.2);
  poly(p, '#dfe4e2', R(cx0 - 8, GY - 0.82 * U - 14, cx1, GY - 0.82 * U)); poly(p, '#9aa4a0', ell(cx0 + 70, GY - 0.82 * U - 20, 14, 8, 8));
  poly(p, '#e4e8e6', [[700, GY], [900, GY], [930, GY - 0.3 * U], [940, GY - 0.46 * U], [640, GY - 0.46 * U], [650, GY - 0.3 * U]]);
  E(p, [[700, GY], [900, GY], [930, GY - 0.3 * U], [940, GY - 0.46 * U], [640, GY - 0.46 * U], [650, GY - 0.3 * U]], 1.2);
  poly(p, '#f0f3f1', R(630, GY - 0.46 * U - 20, 930, GY - 0.46 * U)); E(p, R(630, GY - 0.46 * U - 20, 930, GY - 0.46 * U), 1.1);
  poly(p, '#cfd6d2', [[900, GY - 0.46 * U - 20], [940, GY - 0.46 * U - 20], [960, GY - 0.86 * U], [900, GY - 0.86 * U]]); E(p, [[900, GY - 0.46 * U - 20], [940, GY - 0.46 * U - 20], [960, GY - 0.86 * U], [900, GY - 0.86 * U]], 1.0); // lid up
  poly(p, '#2d3b44', ell(780, GY - 0.46 * U - 12, 130, 18, 18));
  // the lead: profile facing right, bucket tilted over the bowl, both hands on it
  const g: Pt = [300, GY + 70], lean = 0.12;
  const Sr = shoulderPoint(LEAD, g, U, {view: 'right', lean}, 'r'), Sl = shoulderPoint(LEAD, g, U, {view: 'right', lean}, 'l');
  // G4 pour: bucket at the belly (f 2) lifts to the bowl (f 2-14), tips 0 -> ~55 deg (f 14-28), stream from f 28, swirl from f 49
  const F = cur.f, lf = ease(seg(F, 2, 14)), tp = ease(seg(F, 14, 28));
  const bc: Pt = [470 + 120 * lf * (0.4 + 0.6 * tp), 1330 - 250 * lf + 0 * tp], ang = 0.95 * tp;
  const bw = 250, bh = 270;
  const body = rotP([[bc[0] - bw / 2, bc[1] - bh / 2], [bc[0] + bw / 2, bc[1] - bh / 2], [bc[0] + bw * 0.37, bc[1] + bh / 2], [bc[0] - bw * 0.37, bc[1] + bh / 2]], bc, ang);
  shade(p, '#2d2119', 70, ell(g[0] + 90, g[1] + 6, 300, 20, 16));
  // water stream from the lip into the bowl
  const lip = body[1], tgt: Pt = [790, GY - 0.46 * U - 12];
  if (F >= 28) {
    const sw = Math.min(1, (F - 28) / 4);
    poly(p, '#7fd2ea', [[lip[0], lip[1]], [lip[0] + 26 * sw, lip[1] + 8], [tgt[0] + 30 * sw, tgt[1]], [tgt[0] - 8, tgt[1]]]); shade(p, '#ffffff', 90, [[lip[0] + 8, lip[1] + 4], [lip[0] + 14, lip[1] + 6], [tgt[0] + 6, tgt[1]], [tgt[0], tgt[1]]]);
    poly(p, '#bfeaf4', ell(tgt[0] + 10, tgt[1] + 4, 70 * sw, 12, 14));
  }
  if (F >= 49) for (let k = 0; k < 3; k++) { const a0 = F * 0.35 + k * 2.1, rr = 1 - 0.3 * seg(F, 49, 80); stroke(p, 'HB', '#ffffff', 2, Array.from({length: 7}, (_, i): Pt => [780 + Math.cos(a0 + i * 0.5) * 100 * rr * (1 - i * 0.08), 1171 + Math.sin(a0 + i * 0.5) * 12 * rr * (1 - i * 0.08)]), 0.05); } // swirl: the bowl drains by itself
  lead(p, g, U, {view: 'right', head: 'right', lean, light: morning([0.7, 0.7]), face: faceOf('neutral', {look: [0.6, 0.5]}), rArm: gripArm(Sr, [body[0][0] + 30, body[0][1] + 10], U, 50), lArm: gripArm(Sl, [body[3][0] + 10, body[3][1] + 40], U, 70)});
  poly(p, '#c7352b', body); shade(p, '#ffd0c0', 45, [body[0], [(body[0][0] + body[1][0]) / 2, (body[0][1] + body[1][1]) / 2], [(body[3][0] + body[2][0]) / 2, (body[3][1] + body[2][1]) / 2], body[3]]); shade(p, '#2a0806', 55, [[(body[0][0] + body[1][0]) / 2, (body[0][1] + body[1][1]) / 2], body[1], body[2], [(body[3][0] + body[2][0]) / 2, (body[3][1] + body[2][1]) / 2]]);
  E(p, body, 1.2); poly(p, '#7a1e18', rotP(ell(bc[0], bc[1] - bh / 2, bw / 2, 22, 16), bc, ang)); E(p, rotP(ell(bc[0], bc[1] - bh / 2, bw / 2, 22, 16), bc, ang), 1.1);
  // hands drawn over the bucket: fists hooking the rim and the base
  const fr = gripArm(Sr, [body[0][0] + 30, body[0][1] + 10], U, 50), fl = gripArm(Sl, [body[3][0] + 10, body[3][1] + 40], U, 70);
  // W5.3 round 2 (user: a small extra hand sprouts from one hand): the redrawn base hand sat beside the kit hand = two hands on one arm; removed, each arm ends in its one kit HL1 hand
  void fl;
  void fr;
};

// ------------------------------------------------------------------ B05-SH03: the cistern lid lifts (insert, two hands)
const B05_SH03 = (p: Painter) => {
  resetIds(32000); resetE(32000);
  tileWall(p, -20, 1940, '#c9d6cf', 150, 7);
  shade(p, '#fff6dc', 60, [[500, -20], [1100, -20], [1100, 1000], [200, 1000]]);
  // cistern body: front face and rim seen from above-front; the lid is held up in the hands
  const bx0 = 60, bx1 = 1020, rimY = 1100, frontB = 1900;
  poly(p, '#e4e8e6', R(bx0, rimY, bx1, frontB)); shade(p, '#ffffff', 55, R(bx0 + 10, rimY, bx0 + 150, frontB)); shade(p, '#1d2a26', 50, R(bx1 - 130, rimY, bx1, frontB)); E(p, R(bx0, rimY, bx1, frontB), 1.6);
  poly(p, '#dfe4e2', [[bx0 - 20, rimY - 20], [bx1 + 20, rimY - 20], [bx1, rimY + 40], [bx0, rimY + 40]]); E(p, [[bx0 - 20, rimY - 20], [bx1 + 20, rimY - 20], [bx1, rimY + 40], [bx0, rimY + 40]], 1.2);
  poly(p, '#9aa4a0', ell(900, rimY + 140, 36, 18, 10)); E(p, ell(900, rimY + 140, 36, 18, 10), 1.0); // flush lever plate
  // inside: back wall of the tank, clear cyan water with the window reflected, fill valve and float
  const inner: Pt[] = [[bx0 + 30, 700], [bx1 - 30, 700], [bx1 - 10, rimY - 10], [bx0 + 10, rimY - 10]];
  poly(p, '#b9c4c4', inner); E(p, inner, 1.4);
  poly(p, '#8fd8ee', [[bx0 + 14, 880], [bx1 - 14, 880], [bx1 - 10, rimY - 10], [bx0 + 10, rimY - 10]]); shade(p, '#ffffff', 90, [[bx0 + 180, 900], [bx0 + 460, 900], [bx0 + 380, 1060], [bx0 + 120, 1060]]); shade(p, '#1f7fa6', 60, [[bx1 - 300, 920], [bx1 - 20, 920], [bx1 - 20, 1090], [bx1 - 330, 1090]]);
  stroke(p, 'HB', '#ffffff', 2, [[bx0 + 40, 930], [bx0 + 280, 925], [bx0 + 520, 936]], 0.3); stroke(p, 'HB', '#1f7fa6', 2, [[bx0 + 560, 1000], [bx0 + 820, 992]], 0.3);
  poly(p, '#f4f4ee', R(bx1 - 250, 760, bx1 - 214, 900)); E(p, R(bx1 - 250, 760, bx1 - 214, 900), 1.1); hose(p, [[bx1 - 232, 880], [bx1 - 332, 920], [bx1 - 380, 960]], 10, '#8a9096'); poly(p, '#2d2d30', ell(bx1 - 392, 968, 26, 26, 12)); E(p, ell(bx1 - 392, 968, 26, 26, 12), 1.0);
  poly(p, '#6e747a', R(bx0 + 230, 740, bx0 + 260, 900)); poly(p, '#c0392b', ell(bx0 + 245, 740, 14, 8, 8));
  // lid lifted, held at both ends: a thick slab tilted toward the viewer, above the open tank
  // f 14 hands take the lid ends, f 27-51 it lifts 90 px and slides off to the left; the clear water is revealed from f 51
  const F = cur.f, lift = ease(seg(F, 27, 51)), ox = 0, oy = 500 * (1 - lift) - 14 * ease(seg(F, 51, 119)); // third pass (user): the lid lifts straight up, held at both ends by two fists
  const mv = (q: Pt[]) => q.map(([x, y]) => [x + ox, y + oy] as Pt);
  const lid: Pt[] = mv([[130, 280], [950, 250], [1010, 560], [70, 600]]);
  if (F >= 51) for (let k = 0; k < 3; k++) { const r = (F - 51) * 18 + k * 60; if (r > 0 && r < 400 && F < 90) stroke(p, 'HB', '#ffffff', 1.6, Array.from({length: 9}, (_, i): Pt => [540 + Math.cos(i * 0.7) * r, 1000 + Math.sin(i * 0.7) * r * 0.12]), 0.05); }
  shade(p, '#2d2119', 70, mv([[130, 600], [950, 570], [980, 700], [100, 720]]));
  poly(p, '#e9edea', lid); shade(p, '#ffffff', 70, mv([[130, 280], [560, 266], [520, 590], [70, 600]])); shade(p, '#1d2a26', 45, mv([[700, 258], [950, 250], [1010, 560], [660, 590]])); E(p, lid, 1.6);
  poly(p, '#cfd6d2', mv([[70, 600], [1010, 560], [1012, 616], [72, 656]])); E(p, mv([[70, 600], [1010, 560], [1012, 616], [72, 656]]), 1.2);
  poly(p, '#9aa4a0', ell(540 + ox, 420 + oy, 40, 22, 10)); // flush button on the lid
  // POV: two forearms rise from the bottom edge (f 0-14), sleeves to mid-forearm, open mittens hooked under the lid ends and carrying them up
  const en = ease(seg(F, 0, 14)), wy = (y: number) => 2000 + (y + oy - 2000) * en;
  // third pass: two fists grip the lid's front lip at both ends (fingers curl over the lip onto the lid face), forearms push straight up; effort: arms tremble f 27-51
  const eff = F >= 27 && F < 56 ? 1 : 0, tr = (a: number) => eff * 4 * Math.sin(F * 2.3 + a);
  povArm(p, [170, 2060], [190 + tr(0), wy(700) + tr(1) + 20], 1250, 'fist', 1, {tilt: 0.04, fore: 0.27});
  povArm(p, [910, 2060], [890 + tr(2), wy(690) + tr(3) + 20], 1250, 'fist', -1, {tilt: -0.04, fore: 0.27});
};

// ------------------------------------------------------------------ B05-SH04: not in the bowl (top-down toilet)
const B05_SH04 = (p: Painter) => {
  resetIds(33000); resetE(33000);
  floorTop(p, '#8d9a94', 9, '#2e3a34');
  poly(p, '#c9d6cf', R(-20, -20, 1100, 150)); stroke(p, 'HB', '#ffffff', 1.4, [[-20, 148], [1100, 148]], 0.01);
  // cistern (open), lid leaning against the wall at top-left, water inside; bowl below with seat
  shade(p, '#2d2119', 90, R(290, 190, 810, 560));
  poly(p, '#e8ecea', R(270, 150, 790, 540)); E(p, R(270, 150, 790, 540), 1.8);
  poly(p, '#cfd6d2', R(310, 190, 750, 500)); poly(p, '#8fd8ee', R(318, 198, 742, 492)); shade(p, '#ffffff', 90, [[330, 210], [500, 210], [440, 360], [330, 330]]); shade(p, '#1f7fa6', 50, R(560, 330, 742, 492)); E(p, R(310, 190, 750, 500), 1.2);
  [260, 330, 400, 470, 540, 610].forEach((x, i) => stroke(p, 'HB', '#ffffff', 1.4, [[318 + i * 20, 250 + (i % 3) * 70], [330 + 140 + i * 30, 252 + (i % 3) * 70]], 0.3));
  poly(p, '#6e747a', ell(650, 250, 24, 24, 10)); poly(p, '#2d2d30', ell(400, 430, 26, 26, 10));
  shade(p, '#2d2119', 80, [[40, 170], [300, 150], [320, 520], [70, 540]]);
  poly(p, '#dfe4e2', [[20, 150], [270, 130], [290, 500], [40, 520]]); shade(p, '#ffffff', 50, [[20, 150], [150, 140], [160, 510], [40, 520]]); E(p, [[20, 150], [270, 130], [290, 500], [40, 520]], 1.4);
  shade(p, '#2d2119', 90, ell(560, 1000, 300, 400, 28));
  poly(p, '#e8ecea', [[560, 600], [740, 640], [790, 860], [770, 1170], [660, 1380], [560, 1420], [460, 1380], [350, 1170], [330, 860], [380, 640]]); E(p, [[560, 600], [740, 640], [790, 860], [770, 1170], [660, 1380], [560, 1420], [460, 1380], [350, 1170], [330, 860], [380, 640]], 1.8);
  poly(p, '#f4f6f4', ell(560, 1020, 214, 330, 28)); E(p, ell(560, 1020, 214, 330, 28), 1.4); poly(p, '#cfd6d2', ell(560, 1020, 160, 270, 28)); E(p, ell(560, 1020, 160, 270, 28), 1.1);
  poly(p, '#2d3b44', ell(560, 1060, 96, 150, 24)); shade(p, '#6fc6de', 70, ell(560, 1100, 70, 100, 20)); shade(p, '#ffffff', 80, ell(520, 1030, 24, 40, 10));
  poly(p, '#9aa4a0', R(500, 640, 620, 690)); E(p, R(500, 640, 620, 690), 1.0);
  // bucket and dipper at the foot of the frame
  roundTop(p, 880, 1540, 130, '#c7352b', '#9c2a22', 0.2); roundTop(p, 240, 1640, 70, '#2f6fb0', '#1f4f80', 0);
};
const B05_SH04_OVER = () => (
  <div style={{position: 'absolute', inset: 0, ...TH}}>
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <path d="M 820 330 L 870 390 L 960 250" stroke="#2f9e5a" strokeWidth="26" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 820 960 L 960 1100 M 960 960 L 820 1100" stroke="#c7352b" strokeWidth="26" fill="none" strokeLinecap="round" />
    </svg>
    <div style={{position: 'absolute', left: 90, top: 1790, padding: '8px 22px', borderRadius: 30, background: '#e6f6fa', color: '#1f6f8a', fontSize: 46, fontWeight: 700, border: '3px solid #1f6f8a'}}>น้ำใส</div>
    <div style={{position: 'absolute', left: 430, top: 1790, padding: '8px 22px', borderRadius: 30, background: '#efe6d2', color: '#2b211c', fontSize: 46, fontWeight: 700, border: '3px solid #2b211c'}}>ไม่ได้ใส่น้ำยา</div>
  </div>
);

// ------------------------------------------------------------------ kitchen strip (L3), shared by B06 shots
const kitchenWall = (p: Painter, GY: number, U: number, seed = 1) => {
  surface(p, R(-20, -20, 1100, GY), '#cdbf9f', {seed, patches: 20, grain: 'h', grainN: 24, streaks: 3, wear: 5});
  tileWall(p, GY - 1.5 * U, GY - 0.9 * U, '#d9d3c0', 0.14 * U, seed, 1100);
  poly(p, '#8d7f66', R(-20, GY - 0.065 * U, 1100, GY));
  surface(p, R(-20, GY, 1100, 1940), '#b3a487', {seed: seed + 2, patches: 14, grain: 'none', streaks: 0});
  for (let y = GY; y < 1940; y += 0.4 * U) stroke(p, '2B', '#7d6e56', 1.5, [[-20, y], [1100, y]], 0.01);
  for (let x = -20; x < 1100; x += 0.5 * U) stroke(p, '2B', '#7d6e56', 1.5, [[x, GY], [x * 1.25 - 120, 1940]], 0.01);
};
const counterRun = (p: Painter, GY: number, U: number, x0: number, x1: number) => {
  box(p, x0, GY - 0.9 * U, x1, GY - 0.86 * U, '#9a8f7c', {w: 1.2});
  poly(p, '#7a6a56', R(x0, GY - 0.86 * U, x1, GY)); [x0 + 0.02 * (x1 - x0), x0 + 0.5 * (x1 - x0)].forEach((x) => { E(p, R(x, GY - 0.83 * U, x + 0.47 * (x1 - x0), GY - 0.06 * U), 1.0); poly(p, '#6a5c4a', R(x, GY - 0.83 * U, x + 0.47 * (x1 - x0), GY - 0.06 * U)); poly(p, '#b69a58', R(x + 0.4 * (x1 - x0), GY - 0.7 * U, x + 0.43 * (x1 - x0), GY - 0.6 * U)); });
  shade(p, '#1d140e', 45, R(x0, GY - 0.86 * U, x1, GY - 0.82 * U));
};

// ------------------------------------------------------------------ B06-SH01: the dark fridge, hand flat on the door
const B06_SH01 = (p: Painter) => {
  resetIds(34000); resetE(34000);
  const U = 760, GY = 1560;
  kitchenWall(p, GY, U, 8);
  counterRun(p, GY, U, -20, 560);
  // things on the counter: kettle, rice cooker, hob
  poly(p, '#dcd8cc', R(40, GY - 0.9 * U - 190, 270, GY - 0.9 * U)); E(p, R(40, GY - 0.9 * U - 190, 270, GY - 0.9 * U), 1.2); poly(p, '#c7352b', R(110, GY - 0.9 * U - 190, 200, GY - 0.9 * U - 150)); shade(p, '#ffffff', 55, R(48, GY - 0.9 * U - 186, 90, GY - 0.9 * U));
  poly(p, '#2c3034', R(320, GY - 0.9 * U - 20, 540, GY - 0.9 * U)); [380, 480].forEach((x) => { E(p, ell(x, GY - 0.9 * U - 10, 36, 7, 12), 1.0); poly(p, '#6a6d70', ell(x, GY - 0.9 * U - 12, 36, 7, 12)); });
  shade(p, '#10161c', 55, R(-20, -20, 1100, GY));
  // fridge: two doors, dark, handles on the left edge; window light on its face; cold dark face
  const fx0 = 580, fx1 = 1040, ft = GY - 1.6 * U, split = GY - 0.62 * U;
  shadowAt(p, 800, GY + 8, 260, 20, 100);
  poly(p, '#cdd2d4', R(fx0, ft, fx1, GY)); shade(p, '#10161c', 60, R(fx0, ft, fx1, GY));
  shade(p, '#ffffff', 55, R(fx0 + 6, ft, fx0 + 90, GY)); E(p, R(fx0, ft, fx1, GY), 1.6);
  stroke(p, '2B', '#4a5056', 3, [[fx0, split], [fx1, split]], 0.01);
  poly(p, '#7d848b', R(fx0 + 24, ft + 60, fx0 + 46, ft + 250)); poly(p, '#7d848b', R(fx0 + 24, split + 40, fx0 + 46, split + 280)); shade(p, '#ffffff', 60, R(fx0 + 27, ft + 64, fx0 + 32, ft + 246)); shade(p, '#ffffff', 60, R(fx0 + 27, split + 44, fx0 + 32, split + 276)); E(p, R(fx0 + 24, ft + 60, fx0 + 46, ft + 250), 0.9); E(p, R(fx0 + 24, split + 40, fx0 + 46, split + 280), 0.9);
  poly(p, '#10161c', R(fx0 + 300, ft + 24, fx0 + 330, ft + 44)); // dead display
  poly(p, '#3a4048', R(fx0 + 10, GY - 20, fx1 - 10, GY)); // feet
  // lead: profile facing right, standing, right hand flat on the upper door; P11 base
  const g: Pt = [300, GY + 130], U2 = 900;
  const S = shoulderPoint(LEAD, g, U2, {view: 'right', lean: 0.1}, 'r');
  const flat: Pt = [fx0 + 40, ft + 150]; // W5.3 r3 verdict (user: the hand must grip the fridge door handle): the fist closes round the upper handle bar (x fx0+24..46, y ft+60..250), mid-bar
  shade(p, '#2d2119', 75, ell(g[0] + 60, g[1] + 6, 260, 18, 16));
  const rest: Pt = [S[0] - 0.03 * U2, S[1] + 0.5 * U2], ap = ease(seg(cur.f, 0, 12)); // the hand comes up to the handle and closes on it (f 12)
  const ra = gripArm(S, [rest[0] + (flat[0] - rest[0]) * ap, rest[1] + (flat[1] - rest[1]) * ap], U2, 0, 1);
  lead(p, g, U2, {...poseFor('P01', LEAD, g, U2, 'right'), view: 'right', head: 'right', lean: 0.1, light: greyLight([0.7, 0.6]), face: faceOf('worried', {look: [0.7, 0]}), lArm: ra}); // W5.3d: the far arm (behind the hip, one shade darker) so the resting hand at f 0 is not a big fist in front of the hip (CP-P04)
  // W5.3 verdict (user: the hand looks very strange): the kit mitten on the arm is the only hand now (a second `hand()` mitten used to be laid over it, so two hands overlapped from f 4 on)
  shade(p, '#4a5868', 30, R(-20, -20, 1100, 1940));
};
const B06_SH01_OVER = () => (
  <div style={{position: 'absolute', inset: 0, ...TH}}>
    <div style={{position: 'absolute', left: 640, top: 1190, padding: '8px 22px', borderRadius: 30, background: '#efe6d2', color: '#2b211c', fontSize: 44, fontWeight: 700, border: '3px solid #2b211c'}}>ราว 4 ชม.</div>
    <div style={{position: 'absolute', left: 690, top: 400, padding: '8px 22px', borderRadius: 30, background: '#efe6d2', color: '#2b211c', fontSize: 40, fontWeight: 700, border: '3px solid #2b211c'}}>อย่างมากราว 2 วัน</div>
  </div>
);

// ------------------------------------------------------------------ B06-SH02: from inside the fridge, the hand takes what is fresh (reverse)
const B06_SH02 = (p: Painter) => {
  resetIds(35000); resetE(35000);
  // the room beyond the open door: bright wall and the lead, lit by the window; the dark fridge interior frames it
  surface(p, R(-20, -20, 1100, 1940), '#e9e2cc', {seed: 14, patches: 14, grain: 'h', grainN: 20, streaks: 2, wear: 3});
  glazeS(p, '#fff6dc', 110, R(120, 100, 960, 1500));
  const g: Pt = [540, 1740], U = 780;
  const base = poseFor('P01', LEAD, g, U, 'front');
  // ZC2-W53b (viewer check): a real reach, one cycle per item, the arms alternate (left shelf: yoghurt f14, bread f40; right shelf: milk f26, box f52 = the sheet's item-change frames = grab frames).
  // Each cycle: the fist leaves the hip and reaches the shelf item (8 f), closes on it at G, pulls it out toward the camera and off the frame edge (10 f), the empty fist drops back to the hip (6 f).
  // The arm is the kit two-bone IK with the kit closed fist (UT14); the item is never in a hand that has not moved: it stays on the shelf until the fist is on it.
  const F = cur.f;
  const Sr = shoulderPoint(LEAD, g, U, {...base, view: 'front'}, 'r'), Sl = shoulderPoint(LEAD, g, U, {...base, view: 'front'}, 'l');
  type Cyc = {G: number; side: 'r' | 'l'; sh: Pt; item: 'y' | 'm' | 'b' | 'l'};
  const cycles: Cyc[] = [{G: 13, side: 'r', sh: [120, 730], item: 'y'}, {G: 28, side: 'l', sh: [960, 1070], item: 'm'}, {G: 43, side: 'r', sh: [125, 1080], item: 'b'}, {G: 58, side: 'l', sh: [950, 730], item: 'l'}];
  const mix2 = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const armFor = (side: 'r' | 'l') => {
    const S = side === 'r' ? Sr : Sl, sg = side === 'r' ? -1 : 1, idle: Pt = [S[0] + sg * 40, S[1] + 0.66 * U];
    let T = idle; const hold: {c: Cyc | null} = {c: null};
    cycles.filter((c) => c.side === side).forEach((c) => {
      const exit: Pt = [540 + sg * 760, c.sh[1] + 420];
      // W5.3 verdict (user: too fast): cycle 30 f = reach 10, pull 12, drop 8 (was 24 = 8/10/6); grabs 13, 28, 43, 58; the scene length (78) is unchanged
      if (F >= c.G - 10 && F <= c.G) T = mix2(idle, c.sh, ease(seg(F, c.G - 10, c.G)));
      else if (F > c.G && F <= c.G + 12) { T = mix2(c.sh, exit, ease(seg(F, c.G, c.G + 12))); hold.c = c; }
      if (F === c.G) hold.c = c; // W5.3 round 2: the item is in the closed fist on the grab frame itself (it never disappears at G)
      else if (F > c.G + 12 && F <= c.G + 20) T = mix2(exit, idle, ease(seg(F, c.G + 12, c.G + 20)));
    });
    const a = gripArm(S, T, U, 0, 1, sg);
    return {a, carry: hold.c, T};
  };
  const ar = armFor('r'), al = armFor('l');
  // fridge interior: dark cool plastic frame all round, door shelf racks with items at left and right (an item leaves its shelf when the fist closes on it)
  const frame = (pts: Pt[], c: string) => { poly(p, c, pts); };
  frame(R(-20, -20, 1100, 190), '#4d5a62'); frame(R(-20, 190, 150, 1940), '#4d5a62'); frame(R(930, 190, 1100, 1940), '#4d5a62');
  shade(p, '#ffffff', 40, R(-20, -20, 1100, 90));
  [0, 1, 2].forEach((i) => { const y = 400 + i * 400; poly(p, '#8e9aa2', R(-20, y, 170, y + 20)); poly(p, '#8e9aa2', R(910, y, 1100, y + 20)); poly(p, '#6f7c84', R(-20, y + 20, 170, y + 36)); poly(p, '#6f7c84', R(910, y + 20, 1100, y + 36)); });
  const gone = (it: string) => { const c = cycles.find((q) => q.item === it)!; return F >= c.G; };
  // W5.3 round 2 (user: the hand must close around the handle): from G the item rides in the fist, which wraps it (item visible above and below the fist); before G it stays on the shelf rail
  yogurt(p, 70, 400, 120, 150); if (!gone('y')) yogurt(p, 70, 800, 110, 140, '#e6c34a'); if (!gone('b')) breadLoaf(p, 80, 1200, 130, 190);
  bottleElev(p, 1000, 400, 90, 260, 0.9); if (!gone('l')) lunchBox(p, 1000, 800, 150, 120); if (!gone('m')) milkBox(p, 1000, 1200, 120, 280, '#e9e6dc', '#2f6fb0');
  stroke(p, '2B', '#2d363c', 2, [[150, 190], [150, 1940]], 0.01); stroke(p, '2B', '#2d363c', 2, [[930, 190], [930, 1940]], 0.01);
  // the carried item rides the fist (drawn before the figure so the closed fist overlaps its side)
  [ar, al].forEach((q) => {
    if (!q.carry) return;
    const [to, via] = [q.a.to, q.a.via], d = Math.hypot(to[0] - via[0], to[1] - via[1]) || 1, ux = (to[0] - via[0]) / d, uy = (to[1] - via[1]) / d;
    const cx = to[0] + ux * 0.045 * U, cy = to[1] + uy * 0.045 * U + 10;
    if (q.carry.item === 'y') yogurt(p, cx, cy, 150, 180, '#e6c34a'); else if (q.carry.item === 'm') milkBox(p, cx, cy, 150, 250); else if (q.carry.item === 'b') breadLoaf(p, cx, cy, 220, 150); else lunchBox(p, cx, cy, 220, 160);
  });
  const la = lead(p, g, U, {...base, rArm: ar.a, lArm: al.a, light: morning([0.6, 0.75]), face: faceOf('neutral', {look: [0, 0.3]})});
  void la;
  // the lower rim of the fridge and a glass shelf hide the legs (drawn after the figure)
  frame(R(150, 1560, 930, 1940), '#3d4850'); shade(p, '#10161c', 50, R(-20, 1560, 1100, 1940));
  poly(p, '#dfe6ea', R(250, 1500, 830, 1560)); shade(p, '#ffffff', 60, R(250, 1500, 830, 1520)); E(p, R(250, 1500, 830, 1560), 1.1);
  // cold light cast; the door opens at f 9 and the daylight floods in (dark fridge before)
  shade(p, '#bfe4ee', 30, R(-20, -20, 1100, 1940));
  shade(p, '#06090c', 140 * (1 - ease(seg(F, 6, 14))), R(-20, -20, 1100, 1940));
};

// ------------------------------------------------------------------ B06-SH03: the fridge food in a row, the can last (counter, eye level)
const B06_SH03 = (p: Painter) => {
  resetIds(36000); resetE(36000);
  const U = 1900, GY = 1420; // GY is the counter top line here
  surface(p, R(-20, -20, 1100, GY), '#d9d3c0', {seed: 17, patches: 16, grain: 'none', streaks: 2});
  tileWall(p, -20, GY - 120, '#d9d3c0', 160, 5);
  poly(p, '#fffbea', R(420, 160, 1000, 760)); for (let i = 1; i < 6; i++) { stroke(p, 'HB', '#dcd6c0', 1, [[420 + i * 97, 160], [420 + i * 97, 760]], 0.01); stroke(p, 'HB', '#dcd6c0', 1, [[420, 160 + i * 100], [1000, 160 + i * 100]], 0.01); }
  E(p, R(420, 160, 1000, 760), 1.6); shade(p, '#fff6dc', 60, [[420, 760], [1000, 760], [1100, 1420], [300, 1420]]);
  woodGrain(p, R(-20, GY, 1100, 1940), '#9a8566', 22, 'h', 40); shade(p, '#1d140e', 55, R(-20, GY, 1100, GY + 40)); stroke(p, 'HB', '#f0e4c8', 2, [[-20, GY + 3], [1100, GY + 3]], 0.01);
  // a row of fridge food, left to right
  yogurt(p, 100, GY, 160, 210); yogurt(p, 250, GY, 150, 200, '#e6c34a'); milkBox(p, 430, GY, 180, 360); breadLoaf(p, 640, GY, 190, 250); lunchBox(p, 820, GY, 190, 130);
  // the sardine can, last: a fist lowers it at the end of the row, hero scale
  // the fist lowers the can to the end of the row (set down at f 20 on "ท้ายสุด")
  const F = cur.f, dn = 1 - ease(seg(F, 4, 20));
  moved(p, 90 * dn, -330 * dn, () => {
    // third pass (user): the fist wraps the can body (thumb over the top, can visible on both sides and below), so it is held, not hovering
    canElev(p, 880, GY + 150, 320, 200, '#b8281f');
    // HL1 (4 Nov 2026, user: hands not strange): one open mitten palm-down on the lid, thumb lobe toward the far (left) side, the finger end curled
    // past the near rim onto the can's side band (about 30 px), lid metal showing both sides; a soft shade under the fingertips. Replaces the
    // W5.3d claw (fist + separate thumb oval + separate finger lobe read as three pieces).
    shade(p, '#1d0a08', 35, ell(912, 1486, 54, 9, 14));
    hand(p, [948, 1262], 1.75, 1500, 'open', 1, {elbow: [1090, 800], sleeve: '#5d7385', seed: 5, hs: 1.17});
  });
  shade(p, '#10161c', 35, R(-20, 1700, 1100, 1940));
};

// ------------------------------------------------------------------ B07-SH01: the camp stove stays unlit (insert, hand + canister)
const B07_SH01 = (p: Painter) => {
  resetIds(37000); resetE(37000);
  const GY = 1500;
  surface(p, R(-20, -20, 1100, GY), '#cdbf9f', {seed: 19, patches: 16, grain: 'h', grainN: 20, streaks: 2, wear: 3});
  tileWall(p, 300, GY - 80, '#d9d3c0', 140, 6);
  shade(p, '#fff6dc', 65, [[0, -20], [700, -20], [1100, GY], [200, GY]]);
  woodGrain(p, R(-20, GY, 1100, 1940), '#9a8566', 24, 'h', 40); stroke(p, 'HB', '#f0e4c8', 2, [[-20, GY + 3], [1100, GY + 3]], 0.01); shade(p, '#1d140e', 50, R(-20, GY, 1100, GY + 30));
  // stove case, open: dark moulded base left to right; lid standing open at the back
  shadowAt(p, 500, GY + 12, 460, 24, 100);
  poly(p, '#2c3034', [[170, GY - 330], [930, GY - 330], [960, GY - 40], [140, GY - 40]]); shade(p, '#ffffff', 40, [[170, GY - 330], [400, GY - 330], [380, GY - 40], [140, GY - 40]]); E(p, [[170, GY - 330], [930, GY - 330], [960, GY - 40], [140, GY - 40]], 1.6);
  poly(p, '#3b3f44', R(150, GY - 40, 950, GY)); E(p, R(150, GY - 40, 950, GY), 1.4);
  poly(p, '#c7352b', R(190, GY - 20, 270, GY - 8)); // red latch tab
  poly(p, '#1d2024', R(200, GY - 300, 900, GY - 70)); E(p, R(200, GY - 300, 900, GY - 70), 1.0);
  // the burner head and folded legs inside the case
  poly(p, '#6a6d70', R(240, GY - 250, 520, GY - 150)); E(p, R(240, GY - 250, 520, GY - 150), 1.2); poly(p, '#8e949a', ell(380, GY - 255, 150, 24, 16)); E(p, ell(380, GY - 255, 150, 24, 16), 1.2); poly(p, '#2c3034', ell(380, GY - 255, 100, 14, 14));
  poly(p, '#8e949a', R(560, GY - 236, 820, GY - 222)); poly(p, '#8e949a', R(560, GY - 176, 820, GY - 162)); poly(p, '#4a4f54', R(560, GY - 260, 600, GY - 140)); E(p, R(560, GY - 236, 820, GY - 222), 0.8); E(p, R(560, GY - 176, 820, GY - 162), 0.8);
  const lid: Pt[] = [[150, GY - 330], [950, GY - 330], [920, 650], [180, 650]];
  poly(p, '#34383c', lid); shade(p, '#ffffff', 30, [[150, GY - 330], [400, GY - 330], [420, 650], [180, 650]]); E(p, lid, 1.6); poly(p, '#c7352b', R(380, 760, 700, 830)); stroke(p, '2B', '#efe6d2', 4, [[420, 795], [660, 795]], 0.01);
  // gas canister in a fist held above the case, stopped mid-air; never lit
  const cx = 760, ct = 610, cb = 1060, cw = 150, F = cur.f;
  shade(p, '#2d2119', 80, ell(cx + 40, GY - 340, 130, 18, 14));
  moved(p, 0, 260 * (1 - ease(seg(F, 29, 43))), () => { // the canister rises from f 29 and is held mid-air from f 43; the stove is never lit
  poly(p, '#e6d6a0', R(cx - cw / 2, ct, cx + cw / 2, cb)); shade(p, '#ffffff', 60, R(cx - cw / 2 + 6, ct, cx - cw * 0.2, cb)); shade(p, '#3a2a10', 55, R(cx + cw * 0.22, ct, cx + cw / 2, cb)); E(p, R(cx - cw / 2, ct, cx + cw / 2, cb), 1.4);
  poly(p, '#e3902c', R(cx - cw / 2, ct + 110, cx + cw / 2, ct + 270)); poly(p, '#c7352b', R(cx - cw / 2, ct + 280, cx + cw / 2, ct + 300));
  poly(p, '#b8bcc0', ell(cx, ct, cw / 2, 20, 14)); E(p, ell(cx, ct, cw / 2, 20, 14), 1.2); poly(p, '#8e949a', R(cx - 38, ct - 56, cx + 38, ct - 10)); E(p, R(cx - 38, ct - 56, cx + 38, ct - 10), 1.0);
  poly(p, '#6a6d70', ell(cx, cb, cw / 2, 20, 14).filter((q) => q[1] >= cb)); E(p, [[cx - cw / 2, cb], [cx + cw / 2, cb]], 1.2, false);
  hand(p, [cx + 20, 780], -2.5, 1600, 'fist', 1, {elbow: [1180, 400], sleeve: '#5d7385', seed: 6});
  });
};

// ------------------------------------------------------------------ B07-SH02: the unit as a sealed box (wide pull-back)
const B07_SH02 = (p: Painter) => {
  resetIds(38000); resetE(38000);
  const U = 340, GY = 1230, CEIL = GY - 2.6 * U;
  surface(p, R(-20, CEIL, 1100, GY), '#cdbf9f', {seed: 21, patches: 22, grain: 'h', grainN: 30, streaks: 3, wear: 5});
  surface(p, R(-20, -20, 1100, CEIL), '#d6cfbb', {seed: 22, patches: 8, grain: 'none', streaks: 0});
  poly(p, '#b6ad96', R(-20, CEIL - 6, 1100, CEIL + 24)); stroke(p, 'HB', '#f4ecd6', 1.4, [[-20, CEIL + 26], [1100, CEIL + 26]], 0.01);
  poly(p, '#efe9d8', ell(540, CEIL - 70, 170, 30, 20)); E(p, ell(540, CEIL - 70, 170, 30, 20), 1.2);
  // the room is a closed box: ceiling plane above, side walls in perspective, the near floor below
  poly(p, '#b8b19b', [[-20, -20], [1100, -20], [1100, CEIL - 6], [-20, CEIL - 6]]); stroke(p, '2B', '#6a604e', 2, [[-20, 120], [1100, 120]], 0.01); stroke(p, '2B', '#6a604e', 2, [[-20, 300], [1100, 300]], 0.01); shade(p, '#10161c', 40, R(-20, -20, 1100, 140));
  const fm = floorMap(540, GY - 1.2 * U, GY, U, 3.0);
  tileFloor(p, fm, -2.4, 2.6, 0, 1.8, 0.6, '#b3a487', 6);
  poly(p, '#8d7f66', R(-20, GY - 0.065 * U, 1100, GY));
  // entrance door at the left with the barricade across it below the lock
  const dx0 = 30, dx1 = 30 + 0.9 * U;
  poly(p, '#46372a', R(dx0 - 16, CEIL + 24, dx1 + 16, GY)); woodGrain(p, R(dx0, CEIL + 24, dx1, GY), '#8a6b4c', 33, 'v', 30); E(p, R(dx0, CEIL + 24, dx1, GY), 1.2);
  poly(p, '#b69a58', ell(dx0 + 70, GY - 1.15 * U, 22, 22, 12)); poly(p, '#b69a58', ell(dx0 + 70, GY - 1.0 * U, 18, 18, 12));
  const cab = (x: number, y: number): Pt => [x + (GY - y) * 0.03, y];
  const cx0 = dx0 + 20, cx1 = cx0 + 0.77 * U, cy0 = GY - 1.06 * U;
  contact(p, affine(0, GY + 6, 1), (cx0 + cx1) / 2, 230, 10, 100);
  woodGrain(p, [cab(cx0, GY), cab(cx1, GY), cab(cx1, cy0), cab(cx0, cy0)], '#8f6c4b', 41, 'v', 26); poly(p, '#3d2f25', [cab(cx0 + 12, GY - 14), cab(cx1 - 12, GY - 14), cab(cx1 - 12, cy0 + 12), cab(cx0 + 12, cy0 + 12)]);
  [0.34, 0.68].forEach((h) => poly(p, '#a07b57', [cab(cx0 + 12, GY - h * 1.06 * U), cab(cx1 - 12, GY - h * 1.06 * U), cab(cx1 - 12, GY - h * 1.06 * U + 12), cab(cx0 + 12, GY - h * 1.06 * U + 12)]));
  E(p, [cab(cx0, GY), cab(cx1, GY), cab(cx1, cy0), cab(cx0, cy0)], 1.1);
  // tall open shelf unit in the middle: top shelf at 1.9 m, where the stove case goes; items on lower shelves
  const sx0 = 470, sx1 = 690, st = GY - 2.1 * U;
  poly(p, '#6a4b32', R(sx0, st, sx1, GY)); poly(p, '#2c2119', R(sx0 + 10, st + 10, sx1 - 10, GY - 6)); [0.4, 0.8, 1.2, 1.6, 1.95].forEach((h) => poly(p, '#8f6c4b', R(sx0 + 10, GY - h * U, sx1 - 10, GY - h * U + 10)));
  E(p, R(sx0, st, sx1, GY), 1.2);
  canElev(p, 520, GY - 0.8 * U, 34, 24, '#b8281f'); canElev(p, 565, GY - 0.8 * U, 34, 24, '#b8281f'); bottleElev(p, 640, GY - 0.4 * U, 32, 84, 0.9); bucketElev(p, 540, GY - 6, 80, 64, '#c7352b', false);
  yogurt(p, 520, GY - 1.2 * U, 28, 34); lunchBox(p, 610, GY - 1.2 * U, 50, 36);
  // sliding glass door at the right: closed, aluminium frame, daylight and the drying rack beyond
  const gx0 = 740, gx1 = 1060;
  poly(p, '#9aa0a4', R(gx0 - 12, CEIL + 24, gx1 + 12, GY)); poly(p, '#fffbea', R(gx0, CEIL + 36, gx1, GY - 10)); shade(p, '#bfe4ee', 55, R(gx0, CEIL + 36, gx1, GY - 10));
  poly(p, '#9aa0a4', R((gx0 + gx1) / 2 - 4, CEIL + 24, (gx0 + gx1) / 2 + 4, GY)); E(p, R(gx0 - 12, CEIL + 24, gx1 + 12, GY), 1.4);
  poly(p, '#6a6f74', R(gx0 + 36, GY - 1.1 * U, gx0 + 44, GY - 0.9 * U));
  poly(p, '#6a6f74', R(gx0 + 60, GY - 1.7 * U, gx0 + 240, GY - 1.7 * U + 6)); poly(p, '#6a6f74', R(gx0 + 60, GY - 1.7 * U, gx0 + 66, GY - 0.2 * U)); poly(p, '#6a6f74', R(gx0 + 234, GY - 1.7 * U, gx0 + 240, GY - 0.2 * U)); poly(p, '#6a6f74', R(gx0 + 60, GY - 1.2 * U, gx0 + 240, GY - 1.2 * U + 5)); // drying rack outside
  shade(p, '#fff6dc', 50, [[gx0, CEIL + 36], [gx1, CEIL + 36], [gx1 + 20, GY + 240], [gx0 - 260, GY + 240]]);
  shade(p, '#ffffff', 40, [[gx0 + 30, CEIL + 36], [gx0 + 120, CEIL + 36], [gx0 + 40, GY - 20], [gx0 + 10, GY - 20]]);
  // the lead, profile facing left, one arm up sliding the case onto the top shelf (a pose proposed to Boss)
  // R3-arm2 (same fault as B02-SH04: fists straight up in the air, short of the case at 2.1 m, which a 4-head cast cannot reach):
  // the case is held overhead on both open palms, lifted up and forward toward the top shelf; arms reach up-forward ~70 deg with a
  // slight bend, elbows down-back under the shoulder-hand line (lifting-overhead reference, build-notes.md).
  const g: Pt = [300, GY + 330], lU = 520;
  const Sr = shoulderPoint(LEAD, g, lU, {view: 'right'}, 'r'), Sl = shoulderPoint(LEAD, g, lU, {view: 'right'}, 'l');
  // G3 reach_shelf: the case is raised overhead on both palms (f 6-29), then slid forward onto the 1.9 m top shelf (f 29-50: it shrinks with distance)
  const F = cur.f, ccx0 = Sr[0] + 0.2 * lU, ccb0 = Sr[1] - 0.5 * lU, up = ease(seg(F, 6, 29)), sl = ease(seg(F, 29, 50));
  const ccx = ccx0 + (580 - ccx0) * sl, ccb = (ccb0 + 0.45 * lU * (1 - up)) + (GY - 1.95 * U - ccb0) * sl, k = 1 - 0.62 * sl;
  shade(p, '#2d2119', 75, ell(g[0], g[1] + 6, 160, 12, 14));
  lead(p, g, lU, {...poseFor('P01', LEAD, g, lU, 'right'), view: 'right', head: 'right', light: morning([0.5, 0.7]), face: faceOf('neutral', {look: [0.9, -0.9], mouth: 'flat'}), rArm: gripArm(Sr, [ccx - 40 * k, ccb + 14], lU, 0, 0, 1), lArm: gripArm(Sl, [ccx + 50 * k, ccb + 10], lU, 0, 0, 1)});
  const gR = gripArm(Sr, [ccx - 40 * k, ccb + 14], lU, 0, 0, 1), gL = gripArm(Sl, [ccx + 50 * k, ccb + 10], lU, 0, 0, 1);
  const cR = R(ccx - 130 * k, ccb - 60 * k, ccx + 130 * k, ccb);
  poly(p, '#2c3034', cR); shade(p, '#ffffff', 40, R(ccx - 130 * k, ccb - 60 * k, ccx - 50 * k, ccb)); E(p, cR, 1.4); poly(p, '#c7352b', R(ccx - 10 * k, ccb - 40 * k, ccx + 40 * k, ccb - 32 * k));
  // ZC2-R2 fix: both open palms are redrawn over the box's underside so it is gripped, not floating (also at f 0)
  [gR, gL].forEach((a, i) => hand(p, a.to, Math.atan2(a.to[1] - a.via[1], a.to[0] - a.via[0]) * 0.5 - 0.3, 330, 'open', 1, {elbow: a.via, noSleeve: true, seed: 5 + i}));
  fgPlant(p, 960, 1900, 1500 * 0.35, 1);
  shade(p, '#3d2f25', 36, R(-20, 1780, 1100, 1940));
  shade(p, '#10161c', 30, R(-20, -20, 40, 1940)); shade(p, '#10161c', 30, R(1040, -20, 1100, 1940));
};

// ------------------------------------------------------------------ B07-SH03: eat what needs no cooking (close, low table)
const B07_SH03 = (p: Painter) => {
  resetIds(39000); resetE(39000);
  surface(p, R(-20, -20, 1100, 820), '#cdbf9f', {seed: 23, patches: 18, grain: 'h', grainN: 24, streaks: 2, wear: 4});
  surface(p, R(-20, 820, 1100, 1940), '#b3a487', {seed: 24, patches: 14, grain: 'none', streaks: 0});
  poly(p, '#8d7f66', R(-20, 760, 1100, 820));
  // sofa arm in the back-left, sun on the wall
  poly(p, '#6a7684', R(-20, 440, 360, 860)); shade(p, '#ffffff', 40, R(-20, 440, 360, 520)); E(p, R(-20, 440, 360, 860), 1.4); shade(p, '#10161c', 40, R(240, 440, 360, 860));
  shade(p, '#f6d9a0', 55, [[500, -20], [1100, -20], [1100, 1100], [300, 1100]]);
  // low table in perspective (top face)
  const top: Pt[] = [[40, 1040], [1040, 1040], [1180, 1760], [-120, 1760]];
  shade(p, '#2d2119', 90, [[0, 1760], [1100, 1760], [1100, 1940], [-20, 1940]]);
  woodGrain(p, top, '#9a7a52', 25, 'h', 46); E(p, top, 1.6); poly(p, '#6a4b32', [[-120, 1760], [1180, 1760], [1180, 1840], [-120, 1840]]); E(p, [[-120, 1760], [1180, 1760], [1180, 1840], [-120, 1840]], 1.2);
  shade(p, '#fff6dc', 55, [[300, 1040], [800, 1040], [900, 1760], [100, 1760]]);
  // bread bag, torn open: a clear plastic bag with sliced loaf, torn end toward the viewer
  const bag: Pt[] = [[110, 1250], [560, 1200], [600, 1520], [470, 1590], [120, 1560]];
  shadowAt(p, 380, 1600, 330, 28, 100);
  poly(p, '#efe9d8', bag); shade(p, '#c98c3d', 120, [[180, 1280], [520, 1250], [540, 1510], [200, 1520]]); shade(p, '#ffffff', 80, [[130, 1260], [260, 1250], [250, 1550], [130, 1550]]);
  [0, 1, 2, 3, 4].forEach((i) => stroke(p, '2B', '#a56d28', 2, [[240 + i * 62, 1290], [250 + i * 62, 1510]], 0.1)); E(p, bag, 1.3);
  poly(p, '#b8281f', [[560, 1200], [610, 1204], [640, 1520], [600, 1520]]); stroke(p, '2B', '#efe6d2', 3, [[580, 1260], [600, 1300], [580, 1340], [606, 1380]], 0.2); // torn plastic edge
  // banana, nuts, sardine can
  const ban = (cx: number, cy: number) => { const b: Pt[] = [[cx - 150, cy], [cx - 90, cy + 50], [cx + 10, cy + 70], [cx + 130, cy + 30], [cx + 170, cy - 20], [cx + 130, cy - 20], [cx + 10, cy + 20], [cx - 90, cy - 6]]; poly(p, '#e6c734', b); shade(p, '#fff6b0', 80, [[cx - 100, cy + 12], [cx, cy + 40], [cx + 100, cy + 12], [cx, cy + 22]]); shade(p, '#5a4a10', 70, [[cx - 80, cy + 40], [cx + 10, cy + 66], [cx + 120, cy + 28], [cx + 10, cy + 54]]); E(p, b, 1.1); poly(p, '#4a3a14', ell(cx + 170, cy - 20, 12, 12, 8)); };
  shadowAt(p, 760, 1500, 200, 20, 90); ban(740, 1440); shadowAt(p, 770, 1590, 200, 16, 90); ban(780, 1560);
  poly(p, '#efe6d2', ell(860, 1700, 150, 40, 18)); E(p, ell(860, 1700, 150, 40, 18), 1.2); [0, 1, 2, 3, 4, 5, 6, 7].forEach((i) => { poly(p, '#c98c3d', ell(790 + (i % 4) * 36, 1690 + Math.floor(i / 4) * 16, 16, 11, 8)); E(p, ell(790 + (i % 4) * 36, 1690 + Math.floor(i / 4) * 16, 16, 11, 8), 0.7); });
  canElev(p, 940, 1340, 200, 110, '#b8281f');
  // ZC2-W53 fix (user: "the tear looks odd"): a bread bag opens the way a real one does. The right fist holds the bag, the left fist pulls the sealed top strip off along the
  // bag's top edge: the tear front runs left to right (f 14-32), behind it a jagged tear line, a dark mouth and the pulled strip trailing to the left fist (a crimped band, fluttering scraps).
  const tr = ease(seg(cur.f, 14, 32)), X0 = 118, X1 = 556, ty = (x: number) => 1250 - (x - 110) * 0.111, xf = X0 + (X1 - X0) * tr * 0.92;
  const lift = (x: number) => 0; void lift;
  // sealed strip still attached right of the tear front: a crimped band standing on the top edge
  const strip: Pt[] = [[xf, ty(xf) - 6], [X1, ty(X1) - 6], [X1, ty(X1) - 44], [xf, ty(xf) - 44]];
  poly(p, '#d9d2be', strip); shade(p, '#ffffff', 90, [[xf, ty(xf) - 44], [X1, ty(X1) - 44], [X1, ty(X1) - 34], [xf, ty(xf) - 34]]); E(p, strip, 1.2);
  for (let x = Math.ceil(xf / 16) * 16 + 4; x < X1 - 6; x += 16) stroke(p, 'HB', '#a99f86', 1.6, [[x, ty(x) - 40], [x, ty(x) - 10]], 0.02); // crimp ribs
  if (tr > 0.02) {
    // the torn mouth: dark opening along the edge behind the front, jagged lower rim (the tear line) with a pale plastic lip
    const n = 14, jag = (i: number) => (i % 2 ? 18 : -2) + ((i * 7) % 6);
    const rim: Pt[] = Array.from({length: n + 1}, (_, i) => { const x = X0 + (xf - X0) * (i / n); return [x, ty(x) + 26 + jag(i) * Math.min(1, tr * 3)] as Pt; });
    const mouth: Pt[] = [[X0, ty(X0) - 4], [xf, ty(xf) - 4], ...rim.slice().reverse()];
    poly(p, '#2a1d14', mouth); shade(p, '#c98c3d', 110, [[X0 + 20, ty(X0) + 8], [xf - 10, ty(xf) + 6], [xf - 10, ty(xf) + 14], [X0 + 20, ty(X0) + 16]]);
    E(p, rim, 1.6, false, '#4b3d33'); stroke(p, 'HB', '#f2ecdc', 2.4, rim.map(([qx, qy]) => [qx, qy - 2] as Pt), 0.01);
    // the pulled strip: a band from the tear front up and out to the left fist, with a slack curve
    const Hx = 190 - 60 * tr, Hy = ty(190) - 60 - 130 * tr, sx = xf, sy = ty(xf) - 28, mx = (sx + Hx) / 2 + 10, my = Math.min(sy, Hy) - 40 * Math.sin(Math.PI * tr);
    const cur2 = (u: number): Pt => [(1 - u) ** 2 * sx + 2 * u * (1 - u) * mx + u * u * Hx, (1 - u) ** 2 * sy + 2 * u * (1 - u) * my + u * u * Hy];
    const up: Pt[] = [], dn: Pt[] = [];
    for (let i = 0; i <= 10; i++) { const u = i / 10, c = cur2(u), c2 = cur2(Math.min(1, u + 0.05)), c1 = cur2(Math.max(0, u - 0.05)), tx = c2[0] - c1[0], tyy = c2[1] - c1[1], l = Math.hypot(tx, tyy) || 1, w = 20 - 5 * u; up.push([c[0] - tyy / l * w, c[1] + tx / l * w]); dn.push([c[0] + tyy / l * w, c[1] - tx / l * w]); }
    const band = [...up, ...dn.reverse()];
    poly(p, '#d9d2be', band); shade(p, '#ffffff', 80, up.slice(0, 6).concat(up.slice(0, 6).map(([qx, qy]) => [qx, qy + 6] as Pt).reverse())); E(p, band, 1.2);
    for (let i = 1; i < 10; i += 2) { const c = cur2(i / 10); stroke(p, 'HB', '#a99f86', 1.4, [[c[0] - 4, c[1] - 12], [c[0] - 4, c[1] + 12]], 0.02); }
    [[0.25, -30, 50], [0.55, 40, 80], [0.8, -10, 110]].forEach(([u, dx, dy]) => { const c = (u as number) * (xf - X0) + X0, cx = c + (dx as number) * tr, cy = ty(c) + (dy as number) * tr * 0.7 - 10; poly(p, '#d9d2be', [[cx - 8, cy + 5], [cx + 9, cy - 4], [cx + 3, cy + 11]]); E(p, [[cx - 8, cy + 5], [cx + 9, cy - 4], [cx + 3, cy + 11]], 0.7); });
    hand(p, [Hx, Hy], Math.atan2(Hy - 1000, Hx + 300), 1500, 'fist', -1, {elbow: [-300, 1000 - 90 * tr], sleeve: '#5d7385', seed: 7});
  } else hand(p, [150, 1250 - 36], 0.25, 1500, 'fist', -1, {elbow: [-300, 1090], sleeve: '#5d7385', seed: 7});
  hand(p, [548 + 20 * tr, 1214 - 6 * tr], 3.0, 1500, 'fist', 1, {elbow: [940 + 50 * tr, 960], sleeve: '#5d7385', seed: 8});
};

// ------------------------------------------------------------------ B08: the balcony at night
const nightCity = (p: Painter, hy: number, scale: number, seed: number) => {
  // sky: navy to dusty violet to orange near the horizon, then the towers, glow and smoke
  poly(p, '#141a34', R(-20, -20, 1100, hy)); [[0.0, '#1a2040'], [0.35, '#2c2c52'], [0.62, '#4a3552'], [0.82, '#7a4252'], [0.95, '#a85a3a']].forEach(([a, c], i, arr) => { const y0 = i === 0 ? -20 : hy * (arr[i][0] as number), y1 = i === arr.length - 1 ? hy : hy * (arr[i + 1][0] as number) + 4; poly(p, c as string, R(-20, y0, 1100, y1)); void a; });
  [[210, 120], [540, 70], [900, 160], [740, 240], [130, 330]].forEach(([x, y], i) => { poly(p, '#f4efd8', ell(x * 1, y * 1, 3, 3, 6)); void i; });
  const rnd = (i: number) => { const s = Math.sin(i * 12.9898 + seed) * 43758.5453; return s - Math.floor(s); };
  const tower = (x: number, w: number, h: number, c: string, lit: number) => {
    poly(p, c, R(x, hy - h, x + w, hy + 60)); shade(p, '#ff8a3c', 45, R(x, hy - h * 0.4, x + w, hy + 60)); E(p, R(x, hy - h, x + w, hy + 60), 0.8, true, '#0e101e');
    for (let r = 0; r < h / (34 * scale); r++) for (let cc = 0; cc < w / (30 * scale); cc++) if (rnd(r * 17 + cc * 5 + x) < lit) poly(p, '#f4d98a', R(x + 10 + cc * 30 * scale, hy - h + 12 + r * 34 * scale, x + 10 + cc * 30 * scale + 12 * scale, hy - h + 12 + r * 34 * scale + 16 * scale));
  };
  // far row
  [[-20, 120, 380, '#2a2a46'], [110, 100, 520, '#2a2a46'], [230, 140, 420, '#2e2e4a'], [400, 110, 560, '#2a2a46'], [530, 130, 380, '#2e2e4a'], [680, 100, 620, '#2a2a46'], [800, 150, 440, '#2e2e4a'], [960, 120, 500, '#2a2a46']].forEach(([x, w, h, c]) => tower(x as number, (w as number) * scale, (h as number) * scale, c as string, 0));
  // fire glow under the horizon and pointed flames
  shade(p, '#ff7a2a', 70, ell(300, hy, 360, 150, 24)); shade(p, '#ff7a2a', 60, ell(800, hy + 20, 320, 120, 24)); shade(p, '#ffb25a', 40, ell(560, hy + 30, 200, 80, 20));
  // smoke columns
  shade(p, '#ff7a2a', 24 + 24 * Math.max(0, Math.sin(cur.f * 0.45 + 1) * Math.sin(cur.f * 0.17)), ell(300, hy, 360, 150, 24)); shade(p, '#ff7a2a', 20 + 22 * Math.max(0, Math.sin(cur.f * 0.37)), ell(800, hy + 20, 320, 120, 24)); // fire flicker
  [[300, 0.6], [820, 0.8], [560, 0.4]].forEach(([x, k]) => { for (let i = 0; i < 5; i++) shade(p, '#3a3040', 90 - i * 10, ell((x as number) + i * 14 * (k as number), hy - 200 * (k as number) * (i + 0.5) * 0.6, (50 + i * 16) * (k as number) * scale, (110 + i * 12) * (k as number) * scale, 14)); });
  // near row
  [[-60, 160, 300, '#1a1a30'], [100, 130, 360, '#1d1d34'], [250, 150, 280, '#1a1a30'], [560, 150, 340, '#1d1d34'], [730, 120, 260, '#1a1a30'], [880, 190, 380, '#1d1d34']].forEach(([x, w, h, c]) => tower(x as number, (w as number) * scale, (h as number) * scale, c as string, 0.012));
  // ZC2-R2 fix (UT04/UT05): blacked-out city; smoke columns rise from each fire, wide dusty plumes lit orange from below, leaning with the wind
  [[360, 1.0, 0.9], [790, 1.25, 1.0], [170, 0.8, 0.7], [600, 0.7, 0.6]].forEach(([x, k, a], j) => {
    const H = 1000 * (k as number) * scale, sg = j % 2 ? -1 : 1, L: Pt[] = [], Rr: Pt[] = [];
    for (let i = 0; i <= 12; i++) {
      const u = i / 12, cx = (x as number) + sg * 90 * u * u * scale + Math.sin(cur.f * 0.05 + i * 0.8 + j) * 6 * u, cy = hy + 20 - H * u, w = (34 + 120 * Math.pow(u, 0.8)) * (k as number) * scale * (1 + 0.08 * Math.sin(i * 2.1 + j));
      L.push([cx - w, cy]); Rr.push([cx + w, cy]);
    }
    const col = [...L, ...Rr.reverse()];
    // ZC2-W53b: a dark grey-brown plume anchored on its flame: the shaft is a narrow, lower-alpha base; the body billows in overlapping lobes that grow and drift up 0.3 px per frame, so the top rolls instead of standing as a curtain
    shade(p, '#3b3330', Math.round(120 * (a as number)), col);
    for (let b = 0; b < 14; b++) {
      const u = 0.1 + b * 0.065, i = Math.min(12, Math.round(u * 12)), c0 = (L[i][0] + Rr[i][0]) / 2, w0 = (Rr[i][0] - L[i][0]) / 2, dr = 0.3 * cur.f * (0.5 + u);
      const bw = w0 * (0.9 + 0.35 * Math.sin(b * 2.3 + j + cur.f * 0.04)), cyb = L[i][1] - dr * 0.4 + 30 * Math.sin(b * 1.7 + j);
      shade(p, b % 2 ? '#3c3330' : '#2a2425', Math.round((78 - b * 3) * (a as number)), ell(c0 + Math.sin(b * 3.1 + j) * w0 * 0.3, cyb, bw * 1.3, bw * 0.62, 16));
    }
    shade(p, '#ff8a3c', Math.round(30 * (a as number)), ell(x as number, hy + 10, 70 * (k as number) * scale, 60 * (k as number) * scale, 14)); // base lit by its flame
  });
  // ZC2-W53 (user: movement of smoke and fire, light and shadow): every term below is a pure function of the frame clock `cur.f` (seek-safe, no state)
  const F = cur.f, flick = (j: number) => Math.min(1, Math.max(0, 0.5 + 0.3 * Math.sin(F * 0.31 + j * 2.1) + 0.2 * Math.sin(F * 0.83 + j * 4.3)));
  // drifting smoke puffs rising through each column, widening and fading with height
  [[360, 1.0, 0.9], [790, 1.25, 1.0], [170, 0.8, 0.7], [600, 0.7, 0.6]].forEach(([x, k, a], j) => {
    for (let i = 0; i < 6; i++) {
      const u = (F / 120 + i / 6 + j * 0.21) % 1, sg = j % 2 ? -1 : 1, cx = (x as number) + sg * 90 * u * u * scale + Math.sin(F * 0.07 + i * 1.7 + j) * 14 * u * scale, cy = hy - 20 - 880 * (k as number) * u * scale;
      const r = (30 + 110 * u) * (k as number) * scale;
      shade(p, '#6a5666', Math.round(46 * (1 - u) * (0.4 + u * 2) * (a as number) / 1.4), ell(cx, cy, r, r * 0.8, 14));
      shade(p, '#ff8a3c', Math.round(26 * Math.max(0, 0.35 - u) * 2.5 * (a as number)), ell(cx, cy + r * 0.2, r * 0.7, r * 0.5, 12)); // low puffs lit from the fire below
    }
  });
  const flame = (x: number, y: number, s: number, j: number) => {
    const fk = 1 + 0.14 * Math.sin(F * 0.5 + j * 1.9) + 0.09 * Math.sin(F * 1.3 + j * 3.1), sw = (Math.sin(F * 0.35 + j * 2.3) + 0.5 * Math.sin(F * 0.9 + j)) * 6 * s, S = s * fk;
    const f: Pt[] = [[x - 18 * s, y], [x - 12 * s, y - 40 * S], [x - 4 * s + sw * 0.4, y - 52 * S], [x - 6 * s + sw, y - 100 * S], [x + 8 * s + sw * 0.4, y - 56 * S], [x + 14 * s + sw * 0.6, y - 70 * S], [x + 20 * s, y - 30 * S], [x + 18 * s, y]];
    poly(p, '#e8642a', f); poly(p, '#ffd36a', [[x - 8 * s, y], [x - 4 * s, y - 26 * S], [x + 2 * s + sw * 0.3, y - 36 * S], [x + 10 * s, y - 14 * S], [x + 8 * s, y]]);
    // a second, shorter tongue that leans the other way, so the fire shimmers instead of scaling
    poly(p, '#f08a38', [[x + 6 * s, y], [x + 14 * s - sw * 0.5, y - 46 * S * (0.7 + 0.3 * Math.sin(F * 0.7 + j))], [x + 26 * s, y]]);
    for (let i = 0; i < 3; i++) { const u = (F / 45 + i / 3 + j * 0.31) % 1; poly(p, '#ffc060', ell(x + (i - 1) * 10 * s + Math.sin(F * 0.2 + i + j) * 12 * s * u + sw * u, y - (60 + 150 * u) * s, (2.4 - 1.6 * u) * s, (2.4 - 1.6 * u) * s, 6)); } // embers
  };
  [[360, hy + 30, 1.6], [420, hy + 24, 1.0], [790, hy + 36, 1.9], [860, hy + 28, 1.1], [170, hy + 40, 1.2], [600, hy + 34, 0.9]].forEach(([x, y, s], j) => flame(x, y, (s as number) * scale, j));
  // light and shadow on the towers: a dim smoke shadow drifts across the near row, the fire glow breathes
  for (let q = 0; q < 2; q++) { const sx = ((F * 1.4 + q * 620) % 1500) - 300; shade(p, '#10101e', 46, ell(sx, hy - 120 * scale, 260 * scale, 190 * scale, 18)); }
  [[300, 0], [800, 1]].forEach(([gx, j]) => [1, 0.66, 0.36].forEach((q) => shade(p, '#ff8a3c', Math.round((4 + 9 * flick(j)) * (1.5 - q)), ell(gx, hy - 5 * scale, 260 * q * scale, 55 * q * scale, 20)))); // breathing fire glow, stacked so it has no hard rim
};
const B08_SH01 = (p: Painter) => {
  resetIds(40000); resetE(40000);
  const hy = 1000;
  nightCity(p, hy, 1.0, 3);
  // balcony floor and rail
  surface(p, R(-20, 1180, 1100, 1940), '#2a2c3c', {seed: 31, patches: 12, grain: 'h', grainN: 18, streaks: 0, warm: '#0e101e', cool: '#7a6a8a'});
  const FL = Math.min(1, Math.max(0, 0.5 + 0.3 * Math.sin(cur.f * 0.31 + 2.1) + 0.2 * Math.sin(cur.f * 0.83 + 4.3))), FL2 = Math.min(1, Math.max(0, 0.5 + 0.3 * Math.sin(cur.f * 0.27 + 5) + 0.2 * Math.sin(cur.f * 0.71 + 1)));
  shade(p, '#ff8a3c', Math.round(22 + 36 * FL), R(-20, 1180, 1100, 1300));
  poly(p, '#2a2c3c', R(-20, hy + 60, 1100, 1180)); shade(p, '#ff8a3c', Math.round(24 + 34 * FL2), R(-20, hy + 60, 1100, 1180));
  poly(p, '#4a4e60', R(-20, 1120, 1100, 1150)); shade(p, '#ffb25a', 70, R(-20, 1120, 1100, 1128)); E(p, R(-20, 1120, 1100, 1150), 1.2, true, '#10121e');
  for (let x = 20; x < 1100; x += 90) { poly(p, '#363a4c', R(x, 1150, x + 16, 1560)); shade(p, '#ffb25a', 50, R(x, 1150, x + 5, 1560)); }
  poly(p, '#363a4c', R(-20, 1540, 1100, 1566));
  // the lead at the rail: back view leaning on it, flat silhouette
  const g: Pt = [540, 1620], U = 780;
  // R3-fix: arms hang heavy (kit IK, slight elbow bend) instead of hands on hips; rim light: cool window-sky crescent on the head and left shoulder, orange fire glow up the lower body, arms and right edge; floor glow pools at the feet.
  const base0 = poseFor('P01', LEAD, g, U, 'back');
  const a = lead(p, g, U, {...base0, rArm: {to: [g[0] - 140, 1040]}, lArm: {to: [g[0] + 140, 1040]}, view: 'back', silhouette: '#161422', lean: 0.02 + 0.004 * Math.sin(cur.f * 0.12), face: faceOf('neutral')});
  const cres = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, th: number, c: string, al: number) => {
    const o: Pt[] = [], i: Pt[] = [];
    for (let k = 0; k <= 14; k++) { const t = a0 + (a1 - a0) * (k / 14); o.push([cx + Math.cos(t) * rx, cy + Math.sin(t) * ry]); i.push([cx + Math.cos(t) * (rx - th * Math.sin(Math.PI * k / 14 + 0.25)), cy + Math.sin(t) * (ry - th * Math.sin(Math.PI * k / 14 + 0.25))]); }
    shade(p, c, al, [...o, ...i.reverse()]);
  };
  const hr = a.head[1] - (a.headTop ?? a.head[1] - 150), hrx = hr * 0.74;
  cres(a.head[0], a.head[1], hrx, hr, Math.PI * 1.05, Math.PI * 1.62, 16, '#9fc0ff', 130); // window sky, upper left
  cres(a.head[0], a.head[1], hrx, hr, Math.PI * 0.05, Math.PI * 0.42, 12, '#ff8a3c', 120); // fire, lower right
  const edge = (A: Pt, B: Pt, w: number, c: string, al: number) => { const dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l; shade(p, c, al, [[A[0], A[1]], [B[0], B[1]], [B[0] + nx * w, B[1] + ny * w], [A[0] + nx * w, A[1] + ny * w]]); };
  const rim = (pts: Pt[], inward: 1 | -1, w: number, c: string, al: number) => { // thin lit strip along a silhouette edge, offset inward
    const L: Pt[] = pts.map((q, i) => { const A = pts[Math.max(0, i - 1)], B = pts[Math.min(pts.length - 1, i + 1)], dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy) || 1; return [q[0] + (-dy / l) * w * inward, q[1] + (dx / l) * w * inward] as Pt; });
    shade(p, c, al, [...pts, ...L.reverse()]);
  };
  rim([[370, 700], [346, 780], [336, 850], [352, 940], [384, 1026]], -1, 9, '#ff9a4c', Math.round(90 + 90 * FL)); // left arm outer edge, fire from below
  rim([[400, 640], [372, 700], [352, 760]], -1, 8, '#9fc0ff', 130); // left shoulder, window sky
  rim([[690, 654], [738, 720], [766, 820], [750, 940], [706, 1026]], 1, 10, '#ff9a4c', Math.round(90 + 90 * FL2)); // right arm outer edge
  shade(p, '#ff8a3c', Math.round(20 + 40 * FL), [[g[0] - 150, 1580], [g[0] + 150, 1580], [g[0] + 230, 1700], [g[0] - 230, 1700]]); // fire glow on the balcony floor, flickering
  // moving shadow: smoke passing in front of the fires slides a soft dark band across the floor and the rail, and the lead's shadow leans with the flicker
  { const sx = ((cur.f * 4.2) % 1700) - 350; shade(p, '#0e0c18', 70, [[sx, 1150], [sx + 260, 1150], [sx + 360, 1760], [sx + 60, 1760]]); shade(p, '#0e0c18', 55, [[g[0] + 30, 1590], [g[0] + 150 + 40 * FL, 1590], [g[0] + 230 + 70 * FL, 1760], [g[0] + 40, 1760]]); }
  // dark room frame: glass door frame and a sofa back in the foreground
  poly(p, '#1a1620', R(-20, -20, 70, 1940)); poly(p, '#1a1620', R(1010, -20, 1100, 1940)); poly(p, '#1a1620', R(-20, -20, 1100, 80)); poly(p, '#1a1620', R(-20, 1760, 1100, 1940));
  poly(p, '#2a2432', R(-20, 1720, 700, 1940)); shade(p, '#ffb25a', 30, R(-20, 1720, 700, 1740)); E(p, R(-20, 1720, 700, 1940), 1.2, true, '#0e0c14');
  poly(p, '#4a4a5c', R(416, 80, 424, 1760));
  shade(p, '#cfe0ff', 22, [[200, 80], [330, 80], [150, 1760], [30, 1760]]); // reflection on the glass
};
const B08_SH02 = (p: Painter) => {
  resetIds(41000); resetE(41000);
  const hy = 1060;
  nightCity(p, hy, 1.5, 7);
  surface(p, R(-20, hy + 40, 1100, 1940), '#252838', {seed: 32, patches: 12, grain: 'none', streaks: 0, warm: '#0e101e', cool: '#8a6a6a'});
  const FL = Math.min(1, Math.max(0, 0.5 + 0.3 * Math.sin(cur.f * 0.31 + 2.1) + 0.2 * Math.sin(cur.f * 0.83 + 4.3)));
  shade(p, '#ff8a3c', Math.round(30 + 44 * FL), R(-20, hy + 40, 1100, hy + 260)); shade(p, '#ff8a3c', Math.round(16 + 28 * FL), R(-20, hy + 260, 1100, 1500));
  { const sx = ((cur.f * 5.5 + 300) % 1900) - 450; shade(p, '#0e0c18', 60, [[sx, hy + 40], [sx + 320, hy + 40], [sx + 420, 1560], [sx + 60, 1560]]); } // smoke shadow drifting over the streets
  // streets in the far gap: lit lines
  stroke(p, '2B', '#e8a050', 2.4, [[100, hy + 80], [980, hy + 70]], 0.05); stroke(p, '2B', '#e8a050', 2, [[300, hy + 120], [840, hy + 110]], 0.05);
  // railing seen from behind: the lead small, back view, standing BEHIND it; the rail top is at his waist (about 0.5 of his height), drawn after the figure
  const g: Pt = [540, 1800], U = 330;
  lead(p, g, U, {...poseFor('P01', LEAD, g, U, 'back'), rArm: {to: [g[0] - 0.176 * U, g[1] - 0.75 * U]}, lArm: {to: [g[0] + 0.176 * U, g[1] - 0.75 * U]}, view: 'back', silhouette: '#161422', face: faceOf('neutral')});
  poly(p, '#4a4e60', R(-20, 1500, 1100, 1540)); shade(p, '#ffb25a', Math.round(40 + 50 * FL), R(-20, 1500, 1100, 1508)); E(p, R(-20, 1500, 1100, 1540), 1.2, true, '#10121e');
  for (let x = 10; x < 1100; x += 110) { poly(p, '#363a4c', R(x, 1540, x + 20, 1940)); shade(p, '#ffb25a', 50, R(x, 1540, x + 6, 1940)); }
  shade(p, '#3a3040', 55, R(-20, 1780, 1100, 1940));
};

// ------------------------------------------------------------------ B09-SH01: day 3, what is left (top-down)
const B09_SH01 = (p: Painter) => {
  resetIds(42000); resetE(42000);
  floorTop(p, '#9b9c90', 12, '#3a3e44');
  shade(p, '#4a5868', 40, R(-20, -20, 1100, 1940));
  // the day sign: a paper taped to the floor edge (the number is Remotion text)
  const F = cur.f, drop = (a: number) => -60 * (1 - ease(seg(F, a, a + 5))); // an item drops in over 5 frames at its count (sheet: buckets f48, cans f96, phone f148)
  if (F >= 12) moved(p, 0, drop(12) * 0.5, () => {
  poly(p, '#efe6d2', [[250, 150], [830, 135], [850, 330], [270, 350]]); shade(p, '#2d2119', 60, [[260, 360], [860, 340], [866, 356], [268, 372]]); E(p, [[250, 150], [830, 135], [850, 330], [270, 350]], 1.2);
  [[200, 140], [860, 120]].forEach(([x, y]) => poly(p, '#d9c27a', R(x, y, x + 60, y + 36)));
  });
  // two buckets, low water; four cans; the phone at 12 %
  // buckets seen from above: water surface about 70 % of the rim, a metal bail arc over the far side with a lug at each end
  if (F >= 48) moved(p, 0, drop(48), () => [[250, 700, 170], [690, 760, 160]].forEach(([x, y, r]) => {
    roundTop(p, x, y, r, '#c7352b', '#9c2a22', 0.83);
    const bail: Pt[] = Array.from({length: 13}, (_, k) => { const t = Math.PI * (1.08 + 0.84 * k / 12); return [x + Math.cos(t) * r * 1.02, y + Math.sin(t) * r * 1.22] as Pt; });
    const bo: Pt[] = bail.map(([a, b]) => [x + (a - x) * 1.04, y + (b - y) * 1.04] as Pt); poly(p, '#5a6268', [...bail, ...bo.slice().reverse()]); E(p, [...bail, ...bo.slice().reverse()], 0.8);
    [bail[0], bail[12]].forEach(([a, b]) => { poly(p, '#4a5156', ell(a, b, 12, 12, 10)); E(p, ell(a, b, 12, 12, 10), 0.9); });
  }));
  if (F >= 96) moved(p, 0, drop(96), () => [[200, 1120], [380, 1160], [560, 1100], [740, 1150]].forEach(([x, y], i) => { poly(p, '#2d2119', ell(x + 14, y + 18, 78, 60, 20)); poly(p, '#b8281f', ell(x, y, 78, 60, 20)); E(p, ell(x, y, 78, 60, 20), 1.2); poly(p, '#b9b4a6', ell(x, y, 62, 46, 18)); E(p, ell(x, y, 36, 24, 14), 0.9); shade(p, '#ffffff', 80, ell(x - 22, y - 16, 20, 8, 8)); void i; }));
  // ZC2-W53 (user: the phone must read as a phone): a smartphone seen from above, held by one mitten fist at its lower right corner: rounded black body with a metal rim, side button,
  // lit screen with a soft glow on the floor, camera pill at the top, status row, a low-battery icon and a home bar; the "12%" label (Remotion) sits on the lit screen.
  if (F >= 148) moved(p, 0, -drop(148), () => {
    // ZC2-W53b: the hand is a mitten UNDER the phone (palm cupping its lower half, forearm and sleeve from the bottom right), the thumb lies over the lower right corner of the screen: it holds the phone
    const cx = 405, cy = 1575, w = 300, h = 470, ca = Math.cos(-0.05), sa = Math.sin(-0.05);
    const rot = (px: number, py: number): Pt => [cx + (px - cx) * ca - (py - cy) * sa, cy + (px - cx) * sa + (py - cy) * ca];
    const rr = (x0: number, y0: number, x1: number, y1: number, r: number): Pt[] => { const o: Pt[] = []; ([[x1 - r, y0 + r, -90], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, 90], [x0 + r, y0 + r, 180]] as const).forEach(([qx, qy, a0]) => { for (let k = 0; k <= 6; k++) { const t = (a0 + 90 * k / 6) * Math.PI / 180; o.push(rot(qx + Math.cos(t) * r, qy + Math.sin(t) * r)); } }); return o; };
    const X0 = cx - w / 2, X1 = cx + w / 2, Y0 = cy - h / 2, Y1 = cy + h / 2;
    shade(p, '#2d2119', 110, rr(X0 + 12, Y0 + 20, X1 + 22, Y1 + 24, 44)); // contact shadow
    shade(p, '#9ec5ff', 26, ell(cx, cy, w * 0.95, h * 0.78, 26)); shade(p, '#9ec5ff', 22, ell(cx, cy, w * 0.78, h * 0.62, 24)); // screen glow on the floor
    poly(p, '#9aa3ab', rr(X0 - 4, Y0 - 4, X1 + 4, Y1 + 4, 50)); poly(p, '#12141a', rr(X0, Y0, X1, Y1, 46)); E(p, rr(X0 - 4, Y0 - 4, X1 + 4, Y1 + 4, 50), 1.5, true, '#10121e');
    poly(p, '#9aa3ab', [rot(X1 + 4, Y0 + 110), rot(X1 + 14, Y0 + 114), rot(X1 + 14, Y0 + 190), rot(X1 + 4, Y0 + 192)]); // side button
    const scr = rr(X0 + 14, Y0 + 16, X1 - 14, Y1 - 16, 34); poly(p, '#26384a', scr); shade(p, '#6aa0d8', 60, rr(X0 + 14, Y0 + 16, X1 - 14, cy, 34)); shade(p, '#ffffff', 38, [rot(X0 + 20, Y0 + 24), rot(X0 + 150, Y0 + 24), rot(X0 + 60, Y1 - 30), rot(X0 + 20, Y1 - 30)]);
    poly(p, '#07080c', rr(cx - 56, Y0 + 24, cx + 56, Y0 + 52, 14)); poly(p, '#1d2d44', ell(...rot(cx + 34, Y0 + 38), 7, 7, 8)); shade(p, '#8fc0ff', 120, ell(...rot(cx + 33, Y0 + 37), 3, 3, 6)); // camera pill
    [[X0 + 38, 0.55], [X1 - 66, 0.4], [X1 - 44, 0.3]].forEach(([qx, al], j) => poly(p, '#cfe0f2', ell(...rot(qx as number, Y0 + 40), 10 - j * 2, 5, 8))); void 0; // status icons
    // low battery icon (outline + one red sliver) under the status row
    const bx = cx - 52, by = Y0 + 108; poly(p, '#cfe0f2', rr(bx, by, bx + 104, by + 52, 8)); poly(p, '#26384a', rr(bx + 6, by + 6, bx + 98, by + 46, 5)); poly(p, '#c7352b', rr(bx + 8, by + 8, bx + 24, by + 44, 4)); poly(p, '#cfe0f2', [rot(bx + 104, by + 16), rot(bx + 114, by + 18), rot(bx + 114, by + 34), rot(bx + 104, by + 36)]);
    poly(p, '#cfe0f2', rr(cx - 44, Y1 - 40, cx + 44, Y1 - 32, 4)); // home bar
    E(p, scr, 1.0, true, '#0a0c12');
    // HL1 (4 Nov 2026): the hand holds the phone's right edge from outside (it was hidden under the phone with a lone thumb oval floating on the screen):
    // open mitten pointing left, its finger end curled about 40 px over the rim onto the screen edge, thumb lobe up along the side, forearm from the bottom right.
    shade(p, '#05060a', 70, ell(548, 1690, 26, 60, 12));
    hand(p, [720, 1722], -2.9, 1150, 'open', 1, {elbow: [1010, 2000], sleeve: '#5d7385', seed: 9});
  });
  // a thin blanket corner and an empty bottle: a few days of living
  poly(p, '#6f7c8a', [[760, 1500], [1100, 1480], [1100, 1940], [700, 1940]]); [[800, 1540, 1000, 1520], [780, 1700, 1040, 1680]].forEach(([a, b, c, d]) => stroke(p, '2B', '#4a5868', 2, [[a, b], [c, d]], 0.2)); E(p, [[760, 1500], [1100, 1480], [1100, 1940], [700, 1940]], 1.2);
};
const B09_SH01_OVER = () => (
  <div style={{position: 'absolute', inset: 0, color: '#2b211c', ...TH}}>
    <div style={{position: 'absolute', left: 270, top: 168, width: 560, textAlign: 'center', fontSize: 120, fontWeight: 700}}>วันที่ 3</div>
    {[[940, 690, '2'], [940, 1085, '4'], [440, 1560, '12%']].map(([x, y, t]) => (
      <div key={t as string} style={{position: 'absolute', left: (x as number) - 60, top: y as number, width: 120, textAlign: 'center', fontSize: 84, fontWeight: 700, color: t === '12%' ? '#f4efd8' : '#fff', WebkitTextStroke: '8px #2b211c', paintOrder: 'stroke fill'}}>{t as string}</div>
    ))}
  </div>
);

// ------------------------------------------------------------------ B09-SH02: day 3, you on the floor by the sofa (side MS)
const B09_SH02 = (p: Painter) => {
  resetIds(43000); resetE(43000);
  const U = 980, GY = 1500;
  surface(p, R(-20, -20, 1100, GY), '#b3b3a8', {seed: 41, patches: 22, grain: 'h', grainN: 28, streaks: 4, wear: 6, warm: '#3a3e44', cool: '#e8ecea'});
  glazeS(p, '#6b7076', 70, [[820, 0], [1100, 0], [1100, 360], [960, 240]]);
  surface(p, R(-20, GY, 1100, 1940), '#9b9c90', {seed: 42, patches: 14, grain: 'none', streaks: 0, warm: '#3a3e44', cool: '#e8ecea'});
  for (let y = GY; y < 1940; y += 0.3 * U) stroke(p, '2B', '#6a6b60', 1.5, [[-20, y], [1100, y]], 0.01);
  for (let x = -20; x < 1100; x += 0.6 * U) stroke(p, '2B', '#6a6b60', 1.5, [[x, GY], [x * 1.25 - 120, 1940]], 0.01);
  poly(p, '#74766c', R(-20, GY - 0.06 * U, 1100, GY));
  // grey daylight from a window on the left: pale, flat
  poly(p, '#7a8088', R(60, 200, 420, 760)); poly(p, '#dfe4e6', R(74, 214, 406, 746)); poly(p, '#7a8088', R(236, 214, 244, 746)); poly(p, '#7a8088', R(74, 476, 406, 484)); E(p, R(60, 200, 420, 760), 1.4);
  shade(p, '#e8ecea', 50, [[74, 746], [406, 746], [660, 1560], [-60, 1560]]);
  // sofa seen from the front: back cushions, seat, two arms, the lead sits on the floor in front of it
  const sx0 = 70, sx1 = 1030;
  shadowAt(p, 540, GY + 8, 520, 24, 100);
  poly(p, '#5d6a78', R(sx0 + 90, GY - 0.95 * U, sx1 - 90, GY - 0.45 * U)); shade(p, '#ffffff', 40, R(sx0 + 90, GY - 0.95 * U, sx1 - 90, GY - 0.95 * U + 22)); E(p, R(sx0 + 90, GY - 0.95 * U, sx1 - 90, GY - 0.45 * U), 1.4);
  [0.33, 0.66].forEach((u) => stroke(p, '2B', '#3d4856', 3, [[sx0 + 90 + u * (sx1 - sx0 - 180), GY - 0.93 * U], [sx0 + 90 + u * (sx1 - sx0 - 180) + 6, GY - 0.47 * U]], 0.1));
  poly(p, '#6a7684', R(sx0 + 90, GY - 0.48 * U, sx1 - 90, GY - 0.14 * U)); shade(p, '#ffffff', 50, R(sx0 + 90, GY - 0.48 * U, sx1 - 90, GY - 0.46 * U)); E(p, R(sx0 + 90, GY - 0.48 * U, sx1 - 90, GY - 0.14 * U), 1.4);
  [[sx0, sx0 + 100], [sx1 - 100, sx1]].forEach(([a, b]) => { poly(p, '#6a7684', R(a, GY - 0.66 * U, b, GY - 0.1 * U)); shade(p, '#ffffff', 40, R(a, GY - 0.66 * U, b, GY - 0.64 * U)); E(p, R(a, GY - 0.66 * U, b, GY - 0.1 * U), 1.4); });
  poly(p, '#2c3034', R(sx0 + 20, GY - 0.1 * U, sx0 + 50, GY)); poly(p, '#2c3034', R(sx1 - 50, GY - 0.1 * U, sx1 - 20, GY));
  // floor litter: a can, empty bottles
  canElev(p, 150, GY + 110, 90, 60, '#b8281f'); bottleElev(p, 960, GY + 160, 56, 150, 0.04); bottleElev(p, 880, GY + 250, 56, 150, 0.04);
  // the lead, on the floor, knees up, head turned to the door on the left; thin blanket over the knees and one shoulder
  const g: Pt = [540, GY + 330];
  const base = poseFor('P33', STUB, g, U, 'front');
  // G7 seated_blanket: breathes, then the head turns to the door at "เสียงเรียก" (f 35: front -> left, kit `turn-head-left`)
  const F = cur.f, turned = F >= 35;
  const la = lead(p, g, U, {...base, lean: (base.lean ?? 0) + 0.006 * Math.sin(F * 0.2), light: greyLight([-0.6, 0.7]), face: tiredFace(turned ? [-0.9, 0.1] : [0.1, 0.3]), head: turned ? 'left' : 'front'}, STUB);
  stubbleOver(p, la, 2, 1.3, turned ? -1 : 0); messyHair(p, la, '#1d1b1a', 2);
  // blanket DRAPED: over the shins and the lap (hem on the floor), one end slung over the near shoulder and hanging down the arm; chest and face stay visible
  const sh = la.lShoulder, rs = la.rShoulder, lapY = g[1] - 0.3 * U;
  const lap: Pt[] = [[rs[0] - 80, lapY + 20], [rs[0] + 70, lapY - 50], [sh[0] + 20, lapY - 40], [sh[0] + 130, lapY + 70], [sh[0] + 170, g[1] + 20], [rs[0] - 150, g[1] + 24], [rs[0] - 130, lapY + 120]];
  poly(p, '#6f7c8a', lap); shade(p, '#ffffff', 40, [[rs[0] - 80, lapY + 20], [rs[0] + 70, lapY - 50], [rs[0] + 20, lapY + 120]]); shade(p, '#1d2a38', 55, [[sh[0] + 20, lapY - 40], [sh[0] + 130, lapY + 70], [sh[0] + 170, g[1] + 20], [sh[0] - 40, g[1] + 20]]);
  [[rs[0] - 60, lapY + 140, sh[0] + 60, lapY + 100], [rs[0] - 90, lapY + 240, sh[0] + 120, lapY + 220]].forEach(([a, b, c, d]) => stroke(p, '2B', '#4a5868', 2.2, [[a, b], [(a + c) / 2, (b + d) / 2 + 12], [c, d]], 0.4)); E(p, lap, 1.3, true, '#3d4856');
  const sl: Pt[] = [[sh[0] - 70, sh[1] - 30], [sh[0] + 40, sh[1] - 50], [sh[0] + 130, sh[1] + 10], [sh[0] + 150, sh[1] + 190], [sh[0] + 90, sh[1] + 300], [sh[0] + 30, sh[1] + 230], [sh[0] - 10, sh[1] + 90]];
  poly(p, '#6f7c8a', sl); shade(p, '#1d2a38', 55, [[sh[0] + 90, sh[1] - 20], [sh[0] + 150, sh[1] + 190], [sh[0] + 90, sh[1] + 300]]); shade(p, '#ffffff', 40, [[sh[0] - 70, sh[1] - 30], [sh[0] + 40, sh[1] - 50], [sh[0] + 20, sh[1] + 60]]); E(p, sl, 1.3, true, '#3d4856');
  veil(p, 'grey');
};

// ------------------------------------------------------------------ B09-SH03: the door vantage again, nothing moves
const B09_SH03 = (p: Painter) => {
  resetIds(44000); resetE(44000);
  const w = doorWall(p, {U: 820, GY: 1560, DC: 540, mood: 'grey', cab: 'across', bag: 'deep', seed: 3, sun: false});
  // foreground: empty bottles and cans beside the bag, a corner of the blanket
  canElev(p, 120, 1790, 100, 70, '#b8281f'); bottleElev(p, 260, 1840, 60, 160, 0.04); poly(p, '#6f7c8a', [[760, 1840], [1100, 1800], [1100, 1940], [700, 1940]]); E(p, [[760, 1840], [1100, 1800], [1100, 1940], [700, 1940]], 1.1);
  veil(p, 'grey');
  // ZC2-R2 fix (UT02): the pale corridor line under the door, painted over the grey veil, brighter than anything else in the picture, with floor spill
  shade(p, '#fff6c8', 140, [[w.dx0 + 4, 1560], [w.dx1 - 4, 1560], [w.dx1 + 70, 1650], [w.dx0 - 70, 1650]]); poly(p, '#fffbe6', R(w.dx0 + 4, 1560 - 14, w.dx1 - 4, 1560)); shade(p, '#fffbe6', 90, R(w.dx0 + 4, 1560 - 26, w.dx1 - 4, 1560 - 14));
};

// ------------------------------------------------------------------ B09-SH04: they do not speak (CU, the eyes go to the door)
const B09_SH04 = (p: Painter) => {
  resetIds(45000); resetE(45000);
  surface(p, R(-20, -20, 1100, 1940), '#8f9188', {seed: 46, patches: 26, grain: 'h', grainN: 30, streaks: 4, wear: 6, warm: '#2a2e34', cool: '#dfe4e2'});
  // out-of-focus door edge at the left with the line of light, the cabinet's dark mass bottom-left
  poly(p, '#6a604e', R(-20, -20, 150, 1940)); woodGrain(p, R(-20, -20, 150, 1940), '#6a604e', 47, 'v', 12); shade(p, '#10161c', 45, R(-20, -20, 150, 1940)); shade(p, '#f3f0e0', 70, R(140, 800, 170, 1940));
  shade(p, '#4a5868', 40, R(-20, -20, 1100, 1940));
  const U = 1600, g: Pt = [560, 650 + 1.58 * U]; // user verdict 4 Nov: figure moved up 230 px (was 880) so mouth and chin clear the caption zone
  const la = lead(p, g, U, {view: 'front', head: 'front', light: greyLight([-0.5, 0.8]), nod: [0, 0], face: tiredFace([0.2 - 1.15 * ease(seg(cur.f, 6, 12)), 0.05]), lean: 0.004 * Math.sin(cur.f * 0.2)}, STUB);
  // the eyes slide to the door over 6 frames ending on the sub-hit (f 12), then hold
  stubbleOver(p, la, 3, 1.5, 0); messyHair(p, la, '#1d1b1a', 3); // ZC2-W53: the messy-hair call was swallowed by the comment above, so this shot had the smooth kit hair (user: hair differs from the previous scene)
};

// ------------------------------------------------------------------ B10-SH01: what would you do (two layers)
const B10_SH01 = (p: Painter) => {
  resetIds(46000); resetE(46000);
  const w = doorWall(p, {U: 560, GY: 1250, DC: 720, mood: 'grey', cab: 'across', bag: 'deep', seed: 5, sun: false});
  // the floor continues to the bottom of the frame in the same tile
  surface(p, R(-20, 1250, 1100, 1940), '#9b9c90', {seed: 47, patches: 16, grain: 'none', streaks: 0, warm: '#3a3e44', cool: '#e8ecea'});
  for (let y = 1250; y < 1940; y += 150) stroke(p, '2B', '#6a6b60', 1.5, [[-20, y], [1100, y + 10]], 0.01);
  for (let x = -20; x < 1100; x += 340) stroke(p, '2B', '#6a6b60', 1.5, [[x * 0.7 + 150, 1250], [x * 1.5 - 300, 1940]], 0.01);
  shade(p, '#f3f0e0', 120, R(w.dx0 + 4, 1250 - 8, w.dx1 - 4, 1250));
  // the lead, foreground left, profile facing the door, sitting hugging knees, stubble, worried
  const U = 1000, g: Pt = [330, 1720];
  shadowAt(p, g[0], g[1] + 8, 260, 20, 100);
  const la = lead(p, g, U, {...poseFor('P33', STUB, g, U, 'front'), light: greyLight([0.6, 0.7]), face: faceOf('worried', {look: [1, -0.55]}), head: 'right', nod: [0.1, -0.2]}, STUB);
  stubbleOver(p, la, 4, 1.3, 1); messyHair(p, la, '#1d1b1a', 4); // ZC2-W53: same day-3 stubble and messy hair as B09-SH02/SH04 (this shot had the smooth kit hair and no stubble overlay)
  veil(p, 'grey');
};
const B10_SH01_OVER = () => (
  <div style={{position: 'absolute', inset: 0, ...TH}}>
    {[['เปิดประตู', 700, 690], ['ส่งเสียงตอบ', 660, 810], ['เงียบไว้', 740, 930]].map(([t, x, y]) => (
      <div key={t as string} style={{position: 'absolute', left: x as number, top: y as number, padding: '10px 30px', borderRadius: 34, background: '#efe6d2', color: '#2b211c', fontSize: 58, fontWeight: 700, border: '4px solid #2b211c'}}>{t as string}</div>
    ))}
  </div>
);

export const SHOTS_B: Record<string, Shot> = {
  'ZC2-B05-SH01': {paint: B05_SH01},
  'ZC2-B05-SH02': {paint: B05_SH02},
  'ZC2-B05-SH03': {paint: B05_SH03},
  'ZC2-B05-SH04': {paint: B05_SH04, over: B05_SH04_OVER},
  'ZC2-B06-SH01': {paint: B06_SH01, over: B06_SH01_OVER},
  'ZC2-B06-SH02': {paint: B06_SH02},
  'ZC2-B06-SH03': {paint: B06_SH03},
  'ZC2-B07-SH01': {paint: B07_SH01},
  'ZC2-B07-SH02': {paint: B07_SH02},
  'ZC2-B07-SH03': {paint: B07_SH03},
  'ZC2-B08-SH01': {paint: B08_SH01},
  'ZC2-B08-SH02': {paint: B08_SH02},
  'ZC2-B09-SH01': {paint: B09_SH01, over: B09_SH01_OVER},
  'ZC2-B09-SH02': {paint: B09_SH02},
  'ZC2-B09-SH03': {paint: B09_SH03},
  'ZC2-B09-SH04': {paint: B09_SH04},
  'ZC2-B10-SH01': {paint: B10_SH01, over: B10_SH01_OVER},
};
void [affine, bottleElev, bucketElev, canElev, contact, doorWall, ell, fgPlant, lightOf, nightLight, potElev, shadowAt, tileFloor, umbrella, veil, crack, box, floorMap];
