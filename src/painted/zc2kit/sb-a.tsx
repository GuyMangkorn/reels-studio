import type {ReactNode} from 'react';
import {EXPRESSIONS} from '../kit/expressions';
import {poseFor} from '../kit/poses';
import {type FigPose} from '../kit/cast';
import {reachArm} from './arm';
import {type Painter, type Pt, mixColor} from '../kit/painter';
import {KF_SH02, LEAD, edge} from './frames';
import {
  E, R, affine, bottleElev, box, bucketElev, canElev, contact, crack, doorLeaf, doorWall, ell, fgPlant, floorMap, glazeS, gripArm, hand, lead, lightOf, morning, nightLight, poly, potElev, resetE, shade, shadowAt, shoulderPoint, stroke, surface,
  tileFloor, veil, woodGrain, greyLight,
} from './sb-lib';
import {resetIds} from './sets';
import {cur, ease, seg} from './sb-lib';

// ZC2-SB-R3 stills, part A: B01-B04 (corridor entry, door, barricade, blackout, kitchen, water). Blocking stills at frame 0; no captions, no drift.

export type Shot = {paint: (p: Painter) => void; over?: () => ReactNode};
const TH = {fontFamily: 'Noto Sans Thai, sans-serif'} as const;
const faceOf = (k: keyof typeof EXPRESSIONS, o: Partial<FigPose['face']> = {}): FigPose['face'] => ({...EXPRESSIONS[k], ...o});

// ------------------------------------------------------------------ B01-SH01: the door opens on the corridor (low MS, over your shoulder)
const B01_SH01 = (p: Painter) => {
  resetIds(20000); resetE(20000);
  const F = cur.f, flick = (F >= 30 && F < 32) || (F >= 52 && F < 54);
  KF_SH02(p, {dark: 0.72, sil: '#1c2420', slack: true, inf: 0.01 + 0.99 * ease(seg(F, 22, 40)), sway: Math.sin(F * 0.13) * 2}); // the corridor through the gap, the infected far at its end (readable by f 36)
  if (flick) shade(p, '#10161c', 70, R(-20, -20, 1100, 1700)); // one tube flickers (f 30, f 52)
  resetIds(21000);
  // Entry room around the gap: dark textured wall left, lintel, entry floor, the door leaf swung in at right.
  surface(p, [[-20, -20], [330, -20], [330, 1700], [-20, 1700]], '#5a4d3f', {seed: 71, patches: 16, grain: 'h', grainN: 24, streaks: 3, wear: 4, warm: '#1d140e', cool: '#9a8a70'});
  surface(p, [[-20, -20], [1100, -20], [1100, 190], [-20, 190]], '#4a3f33', {seed: 72, patches: 8, grain: 'none', streaks: 0, warm: '#1d140e', cool: '#9a8a70'});
  poly(p, '#3a2f26', R(318, 190, 342, 1560));
  poly(p, '#2f2820', R(318, 176, 1100, 200));
  surface(p, [[-20, 1560], [1100, 1560], [1100, 1940], [-20, 1940]], '#5e5446', {seed: 73, patches: 14, grain: 'h', grainN: 22, streaks: 0, wear: 6, warm: '#1d140e', cool: '#9a8a70'});
  poly(p, '#3a2f26', R(318, 1550, 1100, 1572));
  shade(p, '#fff1c8', 50, [[342, 1572], [1100, 1572], [1100, 1700], [380, 1700]]); // sill light spilling in
  // door leaf, seen at an angle on the right, opened inward
  const sw = 1 - (1 - seg(F, 0, 28)) ** 2; // leaf swings open away from camera, ease-out (f 0-28); the hinge edge stays at the right
  const lx = 342 + (940 - 342) * sw;
  const leaf: Pt[] = [[1100, 130], [lx, 200 + 32 * sw], [lx, 1560 - 60 * sw], [1100, 1700]];
  doorLeaf(p, leaf, '#7c6048', 74, {panels: true, grainN: 28}); shade(p, '#1d140e', 55, leaf); E(p, leaf, 1.2);
  // entry props: shoe cabinet, key rack, mat, slippers, and the cabinet's contact shadow
  const cx0 = 22, cy = 1560;
  poly(p, '#7a5a3e', R(cx0, cy - 560, cx0 + 270, cy)); poly(p, '#2c2119', R(cx0 + 16, cy - 544, cx0 + 254, cy - 16));
  [-200, -380].forEach((h) => poly(p, '#8f6c4b', R(cx0 + 16, cy + h, cx0 + 254, cy + h + 16)));
  [[cx0 + 40, cy - 16, '#34414f'], [cx0 + 150, cy - 16, '#8a4a3a'], [cx0 + 60, cy - 216, '#c9b78f'], [cx0 + 160, cy - 396, '#5d6f82']].forEach(([x, y, c], i) => { poly(p, c as string, [[x as number, y as number], [(x as number) + 80, y as number], [(x as number) + 74, (y as number) - 40], [(x as number) + 12, (y as number) - 52]]); E(p, [[x as number, y as number], [(x as number) + 80, y as number], [(x as number) + 74, (y as number) - 40], [(x as number) + 12, (y as number) - 52]], 0.8); void i; });
  E(p, R(cx0, cy - 560, cx0 + 270, cy), 1.1);
  shadowAt(p, 200, cy + 8, 220, 14, 110);
  // key rack on the wall above
  poly(p, '#6a4b32', R(60, 520, 250, 560)); [90, 140, 190, 225].forEach((x, i) => { stroke(p, '2B', '#c9b04a', 2, [[x, 560], [x, 620 + (i % 2) * 14]], 0.1); poly(p, ['#b8281f', '#2f6fb0', '#c9b04a', '#5d7385'][i], ell(x, 636 + (i % 2) * 14, 9, 13, 10)); });
  shade(p, '#10161c', 60, R(-20, -20, 330, 1700));
  // lead: back view, bag in the right hand (screen right), low and close
  const U = 1000, g: Pt = [220, 1990];
  const base = poseFor('P01', LEAD, g, U, 'back');
  const lift = 0.02 * U * Math.sin(Math.PI * seg(F, 40, 75)); // the bag hand rises a few px with the step forward (f 48)
  const a = lead(p, g, U, {...base, rArm: {to: [g[0] - 0.19 * U, g[1] - 0.75 * U - lift]}, lArm: {to: [g[0] + 0.17 * U, g[1] - 0.76 * U]}, view: 'back', light: greyLight([0.8, 0.5], {key: [0.8, 0.5]}), face: faceOf('neutral')});
  const hx = a.rHand[0], hy = a.rHand[1];
  const bag: Pt[] = [[hx - 70, hy + 40], [hx + 70, hy + 30], [hx + 98, hy + 190], [hx + 50, hy + 310], [hx - 30, hy + 320], [hx - 90, hy + 210]];
  shadowAt(p, hx + 10, hy + 330, 120, 16, 90);
  poly(p, '#3a3d44', bag); shade(p, '#aab2c0', 55, [[hx - 60, hy + 100], [hx - 10, hy + 70], [hx - 20, hy + 250]]); shade(p, '#10161c', 60, [[hx + 40, hy + 60], [hx + 98, hy + 190], [hx + 50, hy + 310], [hx + 20, hy + 290]]);
  E(p, bag, 1.1);
  stroke(p, '2B', '#14161a', 2, [[hx - 30, hy + 36], [hx, hy - 10], [hx + 30, hy + 34]], 0.3);
};

// ------------------------------------------------------------------ B02-SH01: slam the door shut (MS, profile)
const B02_SH01 = (p: Painter) => {
  resetIds(22000); resetE(22000);
  const GY = 1400;
  surface(p, R(-20, -20, 560, GY), '#cdbf9f', {seed: 11, patches: 22, grain: 'h', grainN: 30, streaks: 3, wear: 6});
  glazeS(p, '#6b5a3c', 70, [[-20, 0], [220, 0], [150, 260], [-20, 380]]);
  crack(p, affine(0, GY, 700), 0.4, 1.9, 0.16, -0.5, 6, 12);
  surface(p, [[-20, GY], [1100, GY], [1100, 1940], [-20, 1940]], '#b3a487', {seed: 12, patches: 18, grain: 'h', grainN: 30, streaks: 0, wear: 8});
  [[60, 1500], [380, 1480], [700, 1520], [1000, 1560]].forEach((q, i) => stroke(p, '2B', '#7d6e56', 1.5, [[q[0], GY + 4], [q[0] * 1.3 - 260, 1940]], 0.02)); // converging grout
  [1470, 1580, 1720, 1900].forEach((y) => stroke(p, '2B', '#7d6e56', 1.5, [[-20, y], [1100, y + 24]], 0.02));
  poly(p, '#8d7f66', R(-20, GY - 40, 560, GY)); stroke(p, 'HB', '#e8dcc0', 1.2, [[-20, GY - 38], [560, GY - 38]], 0.01);
  // shoe cabinet beside the door (not yet dragged), left background
  const cx0 = 30, ch = 0.0;
  void ch;
  poly(p, '#7a5a3e', R(cx0, GY - 700, cx0 + 400, GY)); poly(p, '#2c2119', R(cx0 + 22, GY - 678, cx0 + 378, GY - 22));
  [-226, -452].forEach((h) => woodGrain(p, R(cx0 + 22, GY + h, cx0 + 378, GY + h + 22), '#a07b57', 5, 'h', 4));
  [[cx0 + 70, GY - 22, '#5d6f82'], [cx0 + 220, GY - 22, '#8a4a3a'], [cx0 + 120, GY - 248, '#c9b78f'], [cx0 + 250, GY - 474, '#34414f']].forEach(([x, y, c]) => poly(p, c as string, [[x as number, y as number], [(x as number) + 110, y as number], [(x as number) + 100, (y as number) - 52], [(x as number) + 14, (y as number) - 66]]));
  E(p, R(cx0, GY - 700, cx0 + 400, GY), 1.1);
  contact(p, affine(0, GY + 10, 1), 230, 260, 14, 100);
  // door leaf in perspective, right, solid with deadbolt + lever on the near-left edge
  const leaf: Pt[] = [[600, 250], [1100, 40], [1100, 1700], [600, 1400]];
  poly(p, '#46372a', [[570, 210], [1100, 0], [1100, 1740], [570, 1440]]);
  doorLeaf(p, leaf, '#8a6b4c', 33, {panels: true, grainN: 44}); E(p, leaf, 1.2);
  const bolt: Pt = [668, 640], lev: Pt = [668, 760];
  poly(p, '#b69a58', ell(bolt[0], bolt[1], 26, 30, 14)); E(p, ell(bolt[0], bolt[1], 26, 30, 14), 1, true, '#4b3a1c'); poly(p, '#2f2d2c', R(bolt[0] - 13, bolt[1] - 5, bolt[0] + 13, bolt[1] + 5));
  poly(p, '#b69a58', ell(lev[0], lev[1], 22, 26, 14)); poly(p, '#6a6a6c', R(lev[0], lev[1] - 10, lev[0] + 90, lev[1] + 10));
  shade(p, '#fff1c8', 50, [[600, 250], [800, 170], [800, 1520], [600, 1400]]);
  // the lead: profile, both fists on the leaf at shoulder height, shoulder into it
  // G5 fists_on_door: f 0-11 shoulder and fists into the leaf (leaning in), f 11 the slam, then `gasp-recoil` (first 0.4 s): hop, lean back, hands leave the leaf.
  const F = cur.f, rc = ease(seg(F, 11, 23)), hop = -26 * Math.sin(Math.PI * seg(F, 11, 21));
  const U = 860, g: Pt = [215, 1660 + hop], lean = 0.3 - 0.46 * rc + 0.03 * Math.sin(F * 0.9) * (1 - seg(F, 0, 11));
  const S = shoulderPoint(LEAD, g, U, {view: 'right', lean}, 'r'), S2 = shoulderPoint(LEAD, g, U, {view: 'right', lean}, 'l');
  const door1: Pt = [690, S[1] - 30], door2: Pt = [682, S[1] + 140];
  const away1: Pt = [S[0] + 0.44 * U, S[1] + 0.1 * U], away2: Pt = [S2[0] + 0.4 * U, S2[1] + 0.26 * U]; // palms out, arms half straight (P15; ZC2-R2: was a boxing guard)
  const mixP = (a: Pt, b: Pt, u: number): Pt => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  const hand1 = mixP(door1, away1, ease(seg(F, 11, 18))), hand2 = mixP(door2, away2, ease(seg(F, 11, 18)));
  shade(p, '#3d2f25', 70, ell(g[0] + 80, 1666, 300, 20, 16));
  const drawBag = () => {
    // the trash bag: leaves the hand as he throws himself at the door (f 4), falls and lands by f 16, then lies there until B10
    const fall = Math.min(1, seg(F, 4, 16) ** 2), bx = 330 + 80 * seg(F, 4, 16), by = 1000 + 460 * fall;
    shadowAt(p, bx + 20, 1700, 150, 18, 60 + 40 * fall);
    const bag: Pt[] = [[bx - 80, by], [bx + 90, by - 10], [bx + 110, by + 130], [bx + 50, by + 230], [bx - 40, by + 240], [bx - 100, by + 120]];
    poly(p, '#3a3d44', bag); shade(p, '#aab2c0', 55, [[bx - 70, by + 50], [bx - 20, by + 30], [bx - 30, by + 190]]); shade(p, '#10161c', 60, [[bx + 40, by + 20], [bx + 110, by + 130], [bx + 50, by + 230]]); E(p, bag, 1.1);
    if (F >= 5 && F < 16) [[bx - 40, by - 90, bx - 30, by - 20], [bx + 20, by - 140, bx + 30, by - 40], [bx + 70, by - 90, bx + 72, by - 20]].forEach(([a, b, c, d]) => stroke(p, 'HB', '#6f6558', 1.6, [[a, b], [c, d]], 0.05));
  };
  if (F < 9) drawBag(); // still in his hand behind the body until he throws himself at the door
  lead(p, g, U, {view: 'right', head: 'right', lean, light: morning([0.7, 0.7]), face: F < 11 ? faceOf('angry', {mouth: 'gasp', squint: 0.6, sweat: true, look: [0.8, 0.2]}) : faceOf('scared', {mouth: 'gasp', sweat: true, look: [0.8, 0.2]}), rArm: gripArm(S, hand1, U, 10, 0), lArm: gripArm(S2, hand2, U, 14, 0)});
  if (F >= 9) drawBag();
  if (F >= 11 && F < 18) [[1060, 350, 1060, 520], [1085, 700, 1085, 880]].forEach(([a, b, c, d]) => stroke(p, 'HB', '#f4ecd6', 2, [[a, b], [c, d]], 0.05)); // impact marks
  shade(p, '#f6d9a0', 50, [[-80, -20], [200, -20], [900, GY], [620, GY]]);
  shade(p, '#f6d9a0', 56, [[620, GY], [900, GY], [1100, 1940], [800, 1940]]);
};

// ------------------------------------------------------------------ B02-SH02: the deadbolt (POV insert)
const B02_SH02 = (p: Painter) => {
  resetIds(23000); resetE(23000);
  doorLeaf(p, R(-20, -20, 1100, 1940), '#8a6b4c', 33, {panels: false, grainN: 90});
  // door frame strip at the left, wall beyond
  poly(p, '#46372a', R(-20, -20, 60, 1940)); woodGrain(p, R(-20, -20, 60, 1940), '#6a5642', 31, 'v', 6);
  // two recessed panels, scuffs near the lock
  const pn = [R(150, 120, 960, 560), R(150, 1180, 960, 1760)];
  pn.forEach((q) => { glazeS(p, '#2a1c10', 90, q); E(p, q, 1.2, true, '#3a2616'); stroke(p, 'HB', '#d9bf94', 2, [[q[0][0], q[0][1] + 4], [q[1][0], q[1][1] + 4]], 0.01); });
  for (let i = 0; i < 10; i++) stroke(p, 'HB', '#d9bf94', 1.1, [[300 + i * 53, 820 + (i % 3) * 40], [310 + i * 53, 860 + (i % 4) * 30]], 0.1);
  // deadbolt body: brass plate, thumb-turn shaft and knob (the hero), lever below
  const cx = 470, cy = 790;
  shade(p, '#1d140e', 100, ell(cx + 18, cy + 28, 150, 150, 18));
  poly(p, '#b69a58', ell(cx, cy, 140, 140, 22)); shade(p, '#fff4c8', 80, ell(cx - 30, cy - 36, 80, 60, 12)); shade(p, '#3d2f10', 70, ell(cx + 34, cy + 40, 90, 60, 12)); E(p, ell(cx, cy, 140, 140, 22), 2.2, true, '#4b3a1c');
  poly(p, '#7d6f46', ell(cx, cy, 86, 86, 18)); E(p, ell(cx, cy, 86, 86, 18), 1.6, true, '#4b3a1c');
  // the thumb-turn bar turns 90 deg from the word onset (f 9, 6 frames): bolt slides; the hand rotates with it
  const F = cur.f, th = (Math.PI / 2) * ease(seg(F, 9, 15)), rb = (x: number, y: number): Pt => [cx + x * Math.cos(th) - y * Math.sin(th), cy + x * Math.sin(th) + y * Math.cos(th)];
  const bar: Pt[] = [rb(-78, -24), rb(78, -24), rb(78, 24), rb(-78, 24)], barHi: Pt[] = [rb(-70, -20), rb(70, -20), rb(70, -8), rb(-70, -8)];
  poly(p, '#2f2d2c', bar); shade(p, '#ffffff', 80, barHi); E(p, bar, 1.6);
  poly(p, '#b69a58', ell(cx, cy + 420, 90, 90, 18)); E(p, ell(cx, cy + 420, 90, 90, 18), 2, true, '#4b3a1c'); poly(p, '#6a6a6c', R(cx - 20, cy + 400, cx + 440, cy + 440)); shade(p, '#ffffff', 90, R(cx - 10, cy + 404, cx + 430, cy + 414)); shade(p, '#1d140e', 80, R(cx - 20, cy + 444, cx + 440, cy + 470));
  E(p, R(cx - 20, cy + 400, cx + 440, cy + 440), 1.6);
  // right fist closes round the thumb-turn bar (fist centre on the knob, rotated 0.45 rad off the bar: the twist), forearm from the right edge; arrow arcs show the turn
  // hand enters from the right frame edge f 0-7 (x +380 -> 0), holds on the bolt
  const k = 1150, ang0 = Math.PI + 0.45, ang = ang0 + th, ent = 380 * (1 - ease(seg(F, 0, 7)));
  const wrist: Pt = [cx - Math.cos(ang) * 0.058 * k + ent, cy - Math.sin(ang) * 0.058 * k];
  const el: Pt = [cx - Math.cos(ang0) * 0.358 * k + 230 + ent, cy - Math.sin(ang0) * 0.058 * k + 330];
  if (F >= 9) [[-1, 0.9], [1, 0.9]].forEach(([sg]) => { const pts: Pt[] = Array.from({length: 9}, (_, i): Pt => { const t = -0.5 + 0.9 * (i / 8) + (sg < 0 ? Math.PI : 0); return [cx + Math.cos(t - 0.25) * 215, cy + Math.sin(t - 0.25) * 215]; }); E(p, pts, 2.4, false, '#f4ecd6'); const [x1, y1] = pts[8], [x0, y0] = pts[7]; const an = Math.atan2(y1 - y0, x1 - x0); poly(p, '#f4ecd6', [[x1 + Math.cos(an) * 34, y1 + Math.sin(an) * 34], [x1 + Math.cos(an + 2.4) * 28, y1 + Math.sin(an + 2.4) * 28], [x1 + Math.cos(an - 2.4) * 28, y1 + Math.sin(an - 2.4) * 28]]); });
  hand(p, wrist, ang, k, 'fist', 1, {elbow: el, sleeve: '#5d7385', seed: 2});
  shade(p, '#f6d9a0', 45, [[-20, -20], [380, -20], [1100, 1500], [700, 1500]]);
};

// ------------------------------------------------------------------ B02-SH03: the door shudders (door vantage, back view, lead steps away)
const B02_SH03 = (p: Painter) => {
  resetIds(24000); resetE(24000);
  const w = doorWall(p, {U: 640, GY: 1500, DC: 560, mood: 'morning', cab: 'beside', bag: true, seed: 3});
  // shudder: ghost outline of the door, dust falling from the frame top, light ticks on the leaf
  const F = cur.f, pound = [9, 19, 28].some((b) => F >= b && F < b + 3); // pounds at f 9, 19, 28 (irregular): ghost outline + light ticks on the beat; the picture rattles in the spec camera
  if (pound) [-10, 10].forEach((d) => E(p, R(w.dx0 + d, -20, w.dx1 + d, 1500), 1.0, true, '#4b3d33'));
  if (F >= 9) for (let i = 0; i < 26; i++) { const x = w.dx0 + 20 + (i * 53) % (w.dx1 - w.dx0 - 40), y = 20 + ((i * 97) % 420) + 7 * (F - 9) * (0.6 + (i % 5) * 0.15); if (y < 1480) shade(p, '#e8dcc0', 120, ell(x, y, 3 + (i % 3), 6 + (i % 4) * 3, 8)); } // dust from the lintel
  if (pound) [[-30, 380, 460], [30, 520, 700]].forEach(([d, a, b]) => stroke(p, 'HB', '#f4ecd6', 2, [[w.dx1 + 60 + d, a], [w.dx1 + 60 + d, b]], 0.05));
  // lead: back view stepping away, big and in front (foreground), left
  // flinch at the first pound (f 9: hop, hands come up), then steps back 0.3 m (f 28 on): drifts left and down toward camera
  const U = 960 + 40 * seg(F, 20, 45), flinch = Math.sin(Math.PI * seg(F, 9, 20)), g: Pt = [300 - 36 * ease(seg(F, 22, 45)), 1960 - 30 * flinch + 30 * ease(seg(F, 22, 45))];
  const base = poseFor('P01', LEAD, g, U, 'back');
  const stepA = F >= 22 ? Math.sin((F - 22) * 0.5) : 0;
  // recoil (startle): both hands fly up and out beside the head, elbows wide at shoulder height (not hands on hips)
  const sr = shoulderPoint(LEAD, g, U, {view: 'back'}, 'r'), sl = shoulderPoint(LEAD, g, U, {view: 'back'}, 'l');
  const hand = (S: Pt, sg: number): Pt => [S[0] + sg * (0.16 + 0.2 * flinch) * U, S[1] + (0.55 - 0.85 * flinch) * U];
  lead(p, g, U, {...base, rArm: {...reachArm(sr, hand(sr, -1), U, -1), open: 1}, lArm: {...reachArm(sl, hand(sl, 1), U, 1), open: 1}, view: 'back', walk: 0.3 + 0.35 * stepA, stride: 0.4, lean: -0.05 - 0.05 * flinch, light: morning([0.75, 0.65]), face: faceOf('scared')});
  veil(p, 'morning');
};

// ------------------------------------------------------------------ B03-SH01: the lights die (door vantage wider, lead small and still)
const B03_SH01 = (p: Painter) => {
  resetIds(25000); resetE(25000);
  const U = 560, GY = 1470, DC = 470;
  // power cut as 2-frame snaps: ceiling light f 16, AC LED f 23, fridge LED f 29, corridor strip under the door f 35; the room drops ~20 % at the first cut
  const F = cur.f, ceil = F < 16, ac = F < 23, fr = F < 29, strip = F < 35;
  const w = doorWall(p, {U, GY, DC, mood: ceil ? 'morning' : 'dim', cab: 'across', bag: true, seed: 4, sun: false});
  // ceiling strip with the round lamp: lit and glowing until f 16, then a dead grey disc (ZC2-R2 fix: readable lights-out, UT02/UT04)
  poly(p, '#cfc9b6', [[-20, -20], [1100, -20], [1100, 100], [-20, 100]]); stroke(p, '2B', '#8c8672', 2, [[-20, 100], [1100, 100]], 0.01);
  poly(p, ceil ? '#fffbe0' : '#9aa0a6', ell(300, 56, 150, 32, 20)); E(p, ell(300, 56, 150, 32, 20), 1.4);
  if (ceil) { shade(p, '#fff3b0', 90, ell(300, 70, 260, 80, 20)); shade(p, '#fff3b0', 40, [[170, 80], [430, 80], [640, 700], [-40, 700]]); } else shade(p, '#4a5868', 90, ell(300, 56, 150, 32, 20));
  box(p, 40, 190, 330, 300, '#e9e8e2', {w: 1.1}); [0, 1, 2, 3, 4].forEach((i) => stroke(p, 'HB', '#aaa89e', 1.4, [[56, 262 + i * 6], [314, 262 + i * 6]], 0.01)); poly(p, ac ? '#e0301f' : '#5a2a26', ell(300, 215, 6, 6, 10));
  if (ac) shade(p, '#ff6a50', 70, ell(300, 215, 26, 26, 12));
  box(p, 780, 230, 1080, 1470, '#dfe3e2', {w: 1.2}); stroke(p, '2B', '#8c9296', 3, [[780, 700], [1080, 700]], 0.01);
  box(p, 800, 300, 815, 600, '#9aa0a3', {w: 0.8}); box(p, 800, 740, 815, 1000, '#9aa0a3', {w: 0.8});
  shade(p, '#4a5868', 60, [[780, 230], [1080, 230], [1080, 1470], [780, 1470]]);
  poly(p, fr ? '#58d68d' : '#2a3a30', ell(1010, 262, 7, 7, 10)); if (fr) shade(p, '#7dffb0', 70, ell(1010, 262, 28, 28, 12)); // fridge LED
  shadowAt(p, 930, GY + 10, 190, 14, 100);
  // corridor light under the door: a bright pale line with a spill on the floor until f 35, then gone
  const stripDraw = () => { if (strip) { shade(p, '#fff4c0', 150, [[w.dx0 + 4, GY], [w.dx1 - 4, GY], [w.dx1 + 30, GY + 52], [w.dx0 - 30, GY + 52]]); poly(p, '#fffbe0', R(w.dx0 + 4, GY - 12, w.dx1 - 4, GY)); } };
  if (!strip) shade(p, '#14181f', 80, R(w.dx0, GY - 12, w.dx1, GY + 56));
  stripDraw();
  // lead: seated, back to the cabinet, knees up, hand at mouth (small)
  const gU = 640, g: Pt = [w.cx0 + 0.36 * 0.77 * U + 40, GY + 170];
  const base = poseFor('P33', LEAD, g, gU, 'front');
  lead(p, g, gU, {...base, light: greyLight([0.4, 0.8]), face: faceOf('worried', {look: [0.1, -0.6]})});
  shade(p, '#2d2119', 60, ell(g[0], g[1] + 10, 200, 16, 16));
  fgPlant(p, 80, 1900, 1500 * 0.4, 1);
  // the whole room dims step by step with each cut (f 16 lamp, 23 AC, 29 fridge, 35 corridor strip); the strip stays bright above the veil until it dies
  const dimA = (ceil ? 0 : 55) + (ac ? 0 : 35) + (fr ? 0 : 35) + (strip ? 0 : 40);
  if (dimA) shade(p, '#0e1622', dimA, R(-20, -20, 1100, 1940));
  // W5.3 verdict (user: a light layer lies on the legs in the blackout): the strip above the veil is cut where the seated lead blocks the gap (x g0 +- 175), so no light lies over the knees and legs
  if (strip && !ceil) [[w.dx0 + 4, g[0] - 175], [g[0] + 175, w.dx1 - 4]].forEach(([a, b]) => { if (b > a) { shade(p, '#fff4c0', 60, [[a, GY], [b, GY], [b + 30, GY + 52], [a - 30, GY + 52]]); poly(p, '#fffbe0', R(a, GY - 12, b, GY)); } });
  if (ac) { poly(p, '#e0301f', ell(300, 215, 6, 6, 10)); shade(p, '#ff6a50', 70, ell(300, 215, 26, 26, 12)); }
  if (fr) { poly(p, '#58d68d', ell(1010, 262, 7, 7, 10)); shade(p, '#7dffb0', 70, ell(1010, 262, 28, 28, 12)); }
};

// ------------------------------------------------------------------ B04-SH01: the tap still runs (insert)
const B04_SH01 = (p: Painter) => {
  resetIds(26000); resetE(26000);
  // tiled splash-back, window light at the top right, steel sink below
  const tw = 120;
  poly(p, '#d9d3c0', R(-20, -20, 1100, 1250));
  for (let r = 0; r * tw < 1250; r++) for (let c = 0; c * tw < 1100; c++) { const j = (r * 7 + c * 13) % 10; if (j > 6) glazeS(p, j > 8 ? '#fff6dc' : '#a79f86', 50, R(c * tw + 8, r * tw + 8, c * tw + tw - 10, r * tw + tw - 10)); }
  for (let r = 0; r * tw < 1260; r++) stroke(p, '2B', '#8c846f', 1.6, [[-20, r * tw + 20], [1100, r * tw + 20]], 0.01);
  for (let c = 0; c * tw < 1110; c++) stroke(p, '2B', '#8c846f', 1.6, [[c * tw + 40, -20], [c * tw + 40, 1260]], 0.01);
  [[160, 300], [600, 520], [330, 800]].forEach(([x, y]) => glazeS(p, '#6b5a3c', 60, ell(x, y, 40, 90, 10)));
  // the window: a bright pane with a mosquito-screen grid and the sun on the tiles
  poly(p, '#6a6254', R(560, 40, 1060, 560)); poly(p, '#fffbea', R(580, 60, 1040, 540)); for (let i = 1; i < 12; i++) stroke(p, 'HB', '#dcd6c0', 0.8, [[580 + i * 38, 60], [580 + i * 38, 540]], 0.01);
  for (let i = 1; i < 12; i++) stroke(p, 'HB', '#dcd6c0', 0.8, [[580, 60 + i * 40], [1040, 60 + i * 40]], 0.01);
  E(p, R(560, 40, 1060, 560), 1.4); shade(p, '#fff6dc', 70, [[580, 540], [1040, 540], [1100, 1000], [380, 1000]]);
  // sink counter + basin, faucet and the running stream (hero)
  box(p, -20, 1180, 1100, 1300, '#b9b2a0', {w: 1.2});
  poly(p, '#8e949a', R(120, 1300, 960, 1940)); shade(p, '#ffffff', 55, R(120, 1300, 430, 1940)); shade(p, '#10161c', 60, R(760, 1300, 960, 1940)); E(p, R(120, 1300, 960, 1940), 1.4);
  poly(p, '#6e747a', ell(540, 1760, 300, 70, 20)); E(p, ell(540, 1760, 300, 70, 20), 1.2); poly(p, '#10161c', ell(540, 1760, 36, 12, 12));
  // faucet: base on the counter, curved neck, spout above the stream
  poly(p, '#9ea4aa', R(430, 1060, 560, 1190)); shade(p, '#ffffff', 80, R(440, 1066, 480, 1186)); E(p, R(430, 1060, 560, 1190), 1.4);
  const neck: Pt[] = [[455, 1070], [470, 800], [520, 640], [660, 600], [760, 640], [790, 720], [772, 724], [744, 664], [660, 630], [545, 668], [505, 810], [525, 1070]];
  poly(p, '#aab0b6', neck); shade(p, '#ffffff', 75, [[460, 1000], [468, 820], [514, 680], [540, 700], [490, 840], [484, 1000]]); shade(p, '#10161c', 50, [[512, 900], [530, 740], [560, 676], [540, 670], [505, 830]]); E(p, neck, 1.4);
  poly(p, '#8e949a', R(766, 704, 806, 760)); E(p, R(766, 704, 806, 760), 1.2);
  box(p, 800, 600, 840, 640, '#4a6a80', {w: 1.0}); // handle knob on its lever
  poly(p, '#9ea4aa', R(560, 640, 640, 660));
  // water: a clean cyan stream with highlights, splash ring in the basin
  const stream: Pt[] = [[776, 760], [800, 760], [804, 1740], [772, 1740]];
  poly(p, '#7fd2ea', stream); shade(p, '#ffffff', 110, R(780, 760, 790, 1730)); shade(p, '#1f7fa6', 60, R(796, 760, 804, 1740));
  const F = cur.f, cyc = F % 3; // the jet loops on a 3-frame cycle: highlight streaks slide down, rings pulse
  [[784, 800 + cyc * 40, 1000 + cyc * 40], [787, 1100 - cyc * 30, 1300 - cyc * 30], [785, 1450 + cyc * 20, 1650 + cyc * 20]].forEach(([x, y0, y1]) => stroke(p, 'HB', '#ffffff', 1.4, [[x, y0], [x + 1, (y0 + y1) / 2], [x, y1]], 0.1));
  [[250, 40], [180, 28], [110, 18]].map(([rx, ry]) => [rx * (1 + 0.04 * (cyc - 1)), ry * (1 + 0.04 * (cyc - 1))]).forEach(([rx, ry], i) => { poly(p, '#bfeaf4', ell(788, 1750, rx * 0.5, ry * 0.5, 16)); E(p, ell(788, 1752, rx * 0.5, ry * 0.5, 16), 1.2, true, '#6fb6cc'); void i; });
  shade(p, '#ffffff', 90, ell(740, 1730, 24, 10, 10));
  shade(p, '#fffbea', 150, ell(660 + 40 * (F / 48), 1755, 46, 9, 12)); // sun glint travels 40 px over the water across the shot
  // lived-in: dish rack with plates on the counter left, sponge, soap bottle
  box(p, 80, 1000, 380, 1180, '#6e7a82', {w: 1.1}); [0, 1, 2, 3].forEach((i) => { poly(p, '#efe9d8', ell(130 + i * 62, 1090, 22, 70, 14)); E(p, ell(130 + i * 62, 1090, 22, 70, 14), 0.9); });
  bottleElev(p, 960, 1180, 70, 200, 0.9, '#d98b3a'); poly(p, '#e6d24a', R(180, 1160, 240, 1180)); E(p, R(180, 1160, 240, 1180), 0.8);
  shade(p, '#10161c', 40, R(-20, 1300, 120, 1940));
};

// ------------------------------------------------------------------ B04-SH02: the water diagram (paper, section)
const B04_SH02 = (p: Painter) => {
  resetIds(27000); resetE(27000);
  const F = cur.f;
  poly(p, '#efe6d2', R(-20, -320, 1100, 1940)); // the plate is taller than the frame: the camera tilts up the tower by 260 px (f 6-90)
  for (let i = -6; i < 40; i++) stroke(p, 'HB', '#d7ccb2', 0.7, [[-20, 40 + i * 48], [1100, 36 + i * 48]], 0.02); // ruled paper
  surface(p, R(-20, -320, 1100, 1940), '#efe6d2', {seed: 91, patches: 18, grain: 'none', streaks: 0, patchAlpha: 40});
  // the tower, cut in section: floors, roof tank, pump room at the base, riser pipe on the right
  const tx0 = 240, tx1 = 840, ty0 = 340, ty1 = 1560, nf = 10, fh = (ty1 - ty0) / nf;
  poly(p, '#e2d8c0', R(tx0, ty0, tx1, ty1)); E(p, R(tx0, ty0, tx1, ty1), 2.4, true, '#3a3028');
  for (let i = 1; i < nf; i++) stroke(p, '2B', '#3a3028', 2, [[tx0, ty0 + i * fh], [tx1, ty0 + i * fh]], 0.01);
  for (let i = 0; i < nf; i++) { const y = ty0 + i * fh; poly(p, '#cfc3a6', R(tx0 + 40, y + fh * 0.35, tx0 + 130, y + fh * 0.9)); poly(p, '#f3eedd', R(tx0 + 190, y + fh * 0.3, tx0 + 270, y + fh * 0.62)); poly(p, '#cfc3a6', R(tx0 + 330, y + fh * 0.35, tx0 + 420, y + fh * 0.9)); E(p, R(tx0 + 40, y + fh * 0.35, tx0 + 130, y + fh * 0.9), 0.8); E(p, R(tx0 + 190, y + fh * 0.3, tx0 + 270, y + fh * 0.62), 0.8); }
  // roof tank with water level
  poly(p, '#b9c4c8', R(tx0 + 60, 200, tx0 + 360, ty0)); poly(p, '#7fd2ea', R(tx0 + 68, 262, tx0 + 352, ty0 - 6)); shade(p, '#ffffff', 80, R(tx0 + 80, 270, tx0 + 120, ty0 - 12)); E(p, R(tx0 + 60, 200, tx0 + 360, ty0), 2.2, true, '#3a3028');
  stroke(p, 'HB', '#1f7fa6', 2.4, [[tx0 + 68, 262], [tx0 + 352, 262]], 0.2);
  // pump room at the base, dark grey when the power is off
  poly(p, '#8a8d90', R(tx0 + 40, ty1 - 150, tx0 + 280, ty1 - 6)); E(p, R(tx0 + 40, ty1 - 150, tx0 + 280, ty1 - 6), 1.6); poly(p, '#6a6d70', ell(tx0 + 130, ty1 - 80, 46, 46, 16)); E(p, ell(tx0 + 130, ty1 - 80, 46, 46, 16), 1.4);
  poly(p, '#6a6d70', R(tx0 + 170, ty1 - 110, tx0 + 250, ty1 - 50)); poly(p, '#4a4d50', ell(tx0 + 190, ty1 - 124, 8, 8, 8));
  // riser pipe (cyan) from pump up the right side to the tank, down-flow arrows into the floors
  poly(p, '#6fc6de', R(tx1 + 40, ty0 - 70, tx1 + 62, ty1 - 80)); E(p, R(tx1 + 40, ty0 - 70, tx1 + 62, ty1 - 80), 1.4, true, '#1f6f8a');
  stroke(p, '2B', '#1f6f8a', 2, [[tx0 + 280, ty1 - 80], [tx1 + 51, ty1 - 80]], 0.01); poly(p, '#6fc6de', R(tx0 + 280, ty1 - 90, tx1 + 62, ty1 - 70));
  poly(p, '#6fc6de', R(tx0 + 360, ty0 - 70, tx1 + 62, ty0 - 48));
  poly(p, '#6fc6de', R(tx0 + 380, 230, tx0 + 402, ty0)); stroke(p, '2B', '#1f6f8a', 2, [[tx0 + 380, 230], [tx0 + 380, ty0]], 0.01);
  for (let i = 0; i < 4; i++) { const y = ty0 + 90 + i * 250; stroke(p, '2B', '#1f7fa6', 4, [[tx0 + 430, y], [tx0 + 430, y + 110]], 0.01); poly(p, '#1f7fa6', [[tx0 + 410, y + 100], [tx0 + 450, y + 100], [tx0 + 430, y + 140]]); }
  // ground line and hatch
  stroke(p, '2B', '#3a3028', 3.2, [[60, ty1], [1020, ty1]], 0.01); for (let i = 0; i < 24; i++) stroke(p, 'HB', '#7a6e58', 1.2, [[70 + i * 40, ty1 + 4], [50 + i * 40, ty1 + 34]], 0.01);
  // SH02 (split 4 Nov 2026): the pump is still running here; the power cut is SH02b. Water also runs in each floor (two drip streaks per floor).
  // pump runs: spokes turn; water pushes up the riser from f 49; then falls floor by floor from f 79 (3 frames per floor)
  const pa = F * 0.5; stroke(p, '2B', '#2a2d30', 3, [[tx0 + 130 + Math.cos(pa) * 36, ty1 - 80 + Math.sin(pa) * 36], [tx0 + 130 - Math.cos(pa) * 36, ty1 - 80 - Math.sin(pa) * 36]], 0.01);
  if (F >= 49) for (let k = 0; k < 9; k++) { const y = ty1 - 90 - (((k * 130 + (F - 49) * 14) % 1100)); if (y > ty0 - 60) stroke(p, '2B', '#ffffff', 3, [[tx1 + 51, y], [tx1 + 51, y - 26]], 0.01); }
  for (let i = 0; i < nf; i++) { if (F < 79 + 3 * i) continue; const y = ty0 + i * fh; stroke(p, 'HB', '#1f7fa6', 3, [[tx0 + 560, y + 10], [tx0 + 560, y + fh - 8]], 0.05); }
};
const B04_SH02_OVER = () => (
  <div style={{position: 'absolute', inset: 0, color: '#2b211c', ...TH}}>
    <div style={{position: 'absolute', left: 380, top: 120, fontSize: 52, fontWeight: 700, color: '#1f6f8a'}}>ถังบนดาดฟ้า</div>
    <div style={{position: 'absolute', left: 140, top: 1590, fontSize: 52, fontWeight: 700}}>ปั๊ม</div>
  </div>
);

// ------------------------------------------------------------------ B04-SH02b: close on the pump, power cut (split from SH02, 4 Nov 2026)
const B04_SH02B = (p: Painter) => {
  resetIds(27500); resetE(27500);
  const F = cur.f, run = F < 28; // the pump greys and stops at f 28 ("ปั๊มก็หยุด")
  poly(p, '#efe6d2', R(-20, -20, 1100, 1940));
  for (let i = 0; i < 40; i++) stroke(p, 'HB', '#d7ccb2', 0.7, [[-20, 40 + i * 48], [1100, 36 + i * 48]], 0.02);
  surface(p, R(-20, -20, 1100, 1940), '#efe6d2', {seed: 92, patches: 18, grain: 'none', streaks: 0, patchAlpha: 40});
  // lowest floors of the tower above the pump room (section), riser pipe going up empty and pale
  const gy = 1000;
  poly(p, '#e2d8c0', R(60, 120, 1020, 500)); E(p, R(60, 120, 1020, 500), 2.4, true, '#3a3028');
  [250, 380].forEach((y) => stroke(p, '2B', '#3a3028', 2, [[60, y], [1020, y]], 0.01));
  poly(p, '#cfc3a6', R(120, 280, 220, 370)); E(p, R(120, 280, 220, 370), 0.8); poly(p, '#cfc3a6', R(560, 150, 680, 240)); E(p, R(560, 150, 680, 240), 0.8);
  // pump room
  poly(p, '#8a8d90', R(60, 500, 1020, gy)); E(p, R(60, 500, 1020, gy), 2.4, true, '#3a3028');
  poly(p, '#7a7d80', R(60, 880, 1020, gy));
  // pump body (grey, dark): motor block + round housing, anchored on the floor slab
  poly(p, '#4a4d50', R(180, 840, 620, 900)); E(p, R(180, 840, 620, 900), 1.6);
  poly(p, run ? '#4f7f8c' : '#5d6064', R(220, 660, 460, 850)); E(p, R(220, 660, 460, 850), 2); shade(p, '#ffffff', 40, R(236, 676, 262, 840));
  poly(p, '#6a6d70', ell(560, 760, 120, 120, 24)); E(p, ell(560, 760, 120, 120, 24), 2); poly(p, '#4a4d50', ell(560, 760, 52, 52, 16)); E(p, ell(560, 760, 52, 52, 16), 1.4);
  shade(p, '#ffffff', 50, ell(520, 720, 40, 20, 10));
  // pipes: empty riser up through the ceiling, intake stub at the left
  poly(p, '#cfd3d4', R(640, 500, 700, 700)); E(p, R(640, 500, 700, 700), 1.6, true, '#3a3028');
  poly(p, '#cfd3d4', R(560, 700, 700, 760)); poly(p, '#cfd3d4', R(640, 640, 700, 760)); E(p, R(640, 640, 700, 760), 1.4);
  poly(p, '#cfd3d4', R(60, 780, 220, 840)); E(p, R(60, 780, 220, 840), 1.4, true, '#3a3028');
  poly(p, '#cfd3d4', R(640, 130, 700, 500)); E(p, R(640, 130, 700, 500), 1.4, true, '#3a3028'); // the riser goes on up through the floors
  // water drains from the pipes during TH-14 (f 68-133): the surface falls down the riser, then the pump-room pipes empty; empty by f 143
  const dr = ease(seg(F, 68, 133)), sy = 130 + 570 * dr;
  if (dr < 1) { poly(p, '#6fc6de', R(644, sy, 696, 700)); if (dr < 0.9) { poly(p, '#6fc6de', R(564, 704, 696, 756)); poly(p, '#6fc6de', R(64, 784, 216, 836)); } }
  if (F >= 68 && F < 140) for (let k = 0; k < 4; k++) stroke(p, '2B', '#ffffff', 2.4, [[670, Math.min(740, sy + 20 + ((F * 9 + k * 70) % 160))], [670, Math.min(745, sy + 40 + ((F * 9 + k * 70) % 160))]], 0.01);
  // the power cable from the left wall is cut: two ends apart, red mark and a lightning bolt
  if (F >= 8) { // cut at "ไฟดับ" (f 8): red cross and bolt appear
  stroke(p, '2B', '#2a2a2a', 6, [[60, 560], [260, 560], [330, 590]], 0.02);
  stroke(p, '2B', '#2a2a2a', 6, [[450, 610], [520, 590], [600, 580]], 0.02);
  stroke(p, '2B', '#c7352b', 8, [[345, 560], [435, 640]], 0.02); stroke(p, '2B', '#c7352b', 8, [[435, 560], [345, 640]], 0.02); } else stroke(p, '2B', '#2a2a2a', 6, [[60, 560], [260, 560], [330, 590], [450, 610], [520, 590], [600, 580]], 0.02);
  if (F >= 8) poly(p, '#c7352b', [[820, 540], [900, 540], [860, 640], [930, 640], [800, 800], [830, 690], [770, 690]]); if (F >= 8) E(p, [[820, 540], [900, 540], [860, 640], [930, 640], [800, 800], [830, 690], [770, 690]], 1.4, true, '#8a1f19');
  // ground line and hatch
  stroke(p, '2B', '#3a3028', 3.2, [[60, gy], [1020, gy]], 0.01); for (let i = 0; i < 24; i++) stroke(p, 'HB', '#7a6e58', 1.2, [[70 + i * 40, gy + 4], [50 + i * 40, gy + 34]], 0.01);
};
const B04_SH02B_OVER = () => (
  <div style={{position: 'absolute', inset: 0, color: '#2b211c', ...TH}}>
    <div style={{position: 'absolute', left: 240, top: 420, fontSize: 56, fontWeight: 700}}>ปั๊ม</div>
    <div style={{position: 'absolute', left: 760, top: 410, fontSize: 56, fontWeight: 700, color: '#c7352b'}}>ไฟดับ</div>
  </div>
);

// ------------------------------------------------------------------ B04-SH03: fill everything (top-down kitchen floor)
export const floorTop = (p: Painter, base: string, seed: number, warm = '#6a5238') => {
  surface(p, R(-20, -20, 1100, 1940), base, {seed, patches: 30, grain: 'none', streaks: 0, warm, cool: '#fff6dc'});
  const t = 270;
  for (let y = -10; y < 1940; y += t) stroke(p, '2B', mixColor(base, '#2e2418', 0.5), 2, [[-20, y], [1100, y]], 0.01);
  for (let x = 30; x < 1100; x += t) stroke(p, '2B', mixColor(base, '#2e2418', 0.5), 2, [[x, -20], [x, 1940]], 0.01);
  for (let i = 0; i < 16; i++) { const x = (i * 211) % 1060, y = (i * 389) % 1900; glazeS(p, i % 3 ? '#fff6dc' : '#5a4a36', 40, ell(x, y, 60 + (i % 4) * 20, 40, 10)); }
};
export const roundTop = (p: Painter, cx: number, cy: number, r: number, c: string, rim: string, water = 0, shadowDir: Pt = [26, 30]) => {
  poly(p, '#2d2119', ell(cx + shadowDir[0], cy + shadowDir[1], r, r, 24)); shade(p, '#2d2119', 60, ell(cx + shadowDir[0] * 1.5, cy + shadowDir[1] * 1.5, r * 1.04, r * 1.04, 24));
  poly(p, rim, ell(cx, cy, r, r, 28)); E(p, ell(cx, cy, r, r, 28), 1.4);
  poly(p, c, ell(cx, cy, r * 0.86, r * 0.86, 28)); E(p, ell(cx, cy, r * 0.86, r * 0.86, 28), 1.0);
  if (water > 0) { poly(p, '#7fd2ea', ell(cx, cy, r * 0.84 * water, r * 0.84 * water, 28)); shade(p, '#ffffff', 90, ell(cx - r * 0.2, cy - r * 0.2, r * 0.3 * water, r * 0.16 * water, 12)); }
};
const B04_SH03 = (p: Painter) => {
  resetIds(28000); resetE(28000);
  floorTop(p, '#b3a487', 6);
  // sun band from the window across the floor, cabinet kick-board strip at the top
  poly(p, '#8d7f66', R(-20, -20, 1100, 120)); stroke(p, 'HB', '#e8dcc0', 1.4, [[-20, 118], [1100, 118]], 0.01);
  shade(p, '#f6d9a0', 60, [[300, 120], [760, 120], [1100, 900], [640, 900]]);
  // red bucket (full), steel pot (half), three bottles (empty, half, full) in a row, three lids set aside
  // fill events (word onsets est.): bucket f 54, pot f 75, bottles f 93 (each over ~18 frames); lids close at f 122 / 126 / 130 (slide in over 8 frames)
  const F = cur.f, fl = (a: number) => ease(seg(F, a, a + 18));
  roundTop(p, 330, 520, 250, '#c7352b', '#9c2a22', 0.82 * fl(54));
  roundTop(p, 770, 560, 190, '#9aa0a6', '#7a8086', 0.6 * fl(75)); poly(p, '#3b3f44', R(560, 540, 600, 580)); poly(p, '#3b3f44', R(940, 540, 980, 580));
  // bucket: the bail lies across the open mouth with a lug at each end; a blue dipper (ขัน) with its long handle beside it
  poly(p, '#7d8488', R(94, 506, 566, 524)); E(p, R(94, 506, 566, 524), 1.0); [94, 566].forEach((x) => { poly(p, '#4a5156', ell(x, 515, 22, 22, 12)); E(p, ell(x, 515, 22, 22, 12), 1.0); });
  poly(p, '#2d2119', ell(300, 900, 56, 56, 16)); poly(p, '#2f6fb0', ell(290, 890, 56, 56, 18)); poly(p, '#58b8d8', ell(290, 890, 44, 44, 16)); E(p, ell(290, 890, 56, 56, 18), 1.2);
  poly(p, '#2f6fb0', [[318, 872], [520, 800], [528, 830], [326, 912]]); E(p, [[318, 872], [520, 800], [528, 830], [326, 912]], 1.0);
  // three bottles lying on the floor, full / half / empty: side silhouettes read at once from above
  const bottleSide = (x: number, y: number, water: number) => {
    const L = 400, T = 120, nk = 0.78 * L;
    const body: Pt[] = [[x, y - T * 0.46], [x + nk - 40, y - T * 0.5], [x + nk + 40, y - T * 0.17], [x + L - 14, y - T * 0.15], [x + L - 14, y + T * 0.15], [x + nk + 40, y + T * 0.17], [x + nk - 40, y + T * 0.5], [x, y + T * 0.46]];
    shade(p, '#2d2119', 70, body.map(([a, b]) => [a + 22, b + 26] as Pt));
    poly(p, '#dce9ee', body); if (water > 0.05) poly(p, '#58b8d8', [[x + 2, y - T * 0.44], [x + nk * water, y - T * 0.5 + 2], [x + nk * water, y + T * 0.5 - 2], [x + 2, y + T * 0.44]]);
    shade(p, '#ffffff', 80, R(x + 20, y - T * 0.38, x + nk - 30, y - T * 0.26)); E(p, body, 1.2, true, '#35566a');
    stroke(p, '2B', '#35566a', 1.4, [[x + 70, y - T * 0.48], [x + 70, y + T * 0.48]], 0.01); stroke(p, '2B', '#35566a', 1.4, [[x + nk - 60, y - T * 0.5], [x + nk - 60, y + T * 0.5]], 0.01);
  };
  [[70, 1020, 0.95 * fl(93)], [70, 1160, 0.95 * fl(96)], [70, 1300, 0.9 * fl(99)]].forEach(([x, y, w]) => bottleSide(x, y, w));
  const lids: [number, number, number, string, number, number, number, number][] = [[930, 1130, 100, '#c7352b', 330, 520, 232, 122], [760, 1080, 120, '#9aa0a6', 770, 560, 176, 126]];
  lids.forEach(([x, y, r, c, tx, ty, tr, ev], i) => { // set-aside lids at the right, moved to the vessels last (drawn on top)
    const e = ease(seg(F, ev - 8, ev));
    if (e > 0) return;
    poly(p, '#2d2119', ell(x + 14, y + 18, r, r, 22)); poly(p, c, ell(x, y, r, r, 24)); tintLid(p, x, y, r); void i; void tx; void ty; void tr;
  });
  poly(p, '#2d2119', ell(300, 1620, 200, 200, 24)); poly(p, '#7a8086', ell(290, 1610, 200, 200, 24)); E(p, ell(290, 1610, 200, 200, 24), 1.4); poly(p, '#3b3f44', ell(290, 1610, 40, 40, 12)); // an empty large pot waiting
  roundTop(p, 780, 1620, 160, '#e9e6dc', '#b9b4a6', 0);
  lids.forEach(([x, y, r, c, tx, ty, tr, ev]) => {
    const e = ease(seg(F, ev - 8, ev));
    if (e <= 0) return;
    const lx = x + (tx - x) * e, ly = y + (ty - y) * e - 40 * Math.sin(Math.PI * e), lr = r + (tr - r) * e;
    poly(p, '#2d2119', ell(lx + 14 * (1 - e), ly + 18 * (1 - e), lr, lr, 22)); poly(p, c, ell(lx, ly, lr, lr, 24)); tintLid(p, lx, ly, lr);
  });
  // W5.3 verdict (user: it looked like a pot lid put on a bottle): the bottles have an open neck and each gets its own small blue screw cap (44 px, a bottle's cap size next to its 36 px neck),
  // which slides in sideways from the floor and sits over the end of the neck; the pot lids are only for the bucket and the pot
  [[1020, 130, 810, 1230, 0.7], [1160, 133, 890, 1290, -0.5], [1300, 136, 830, 1350, 1.2]].forEach(([by, ev, sx, sy, rot]) => {
    const e = ease(seg(F, ev - 8, ev)), cx = sx + (70 + 400 - 36 - sx) * e, cy = sy + (by - sy) * e - 26 * Math.sin(Math.PI * e), a = rot * (1 - e), co = Math.cos(a), si = Math.sin(a);
    const rc = (dx: number, dy: number): Pt => [cx + dx * co - dy * si, cy + dx * si + dy * co], box2 = (hw: number, hh: number): Pt[] => [rc(-hw, -hh), rc(hw, -hh), rc(hw, hh), rc(-hw, hh)];
    poly(p, '#2d2119', box2(22, 22).map(([u, v]) => [u + 6 * (1 - e), v + 8 * (1 - e)] as Pt)); poly(p, '#2f6fb0', box2(22, 22)); [-14, -5, 5, 14].forEach((d) => stroke(p, '2B', '#1d4a7a', 1.4, [rc(d, -21), rc(d, 21)], 0.01));
    shade(p, '#ffffff', 80, [rc(-20, -18), rc(20, -18), rc(20, -11), rc(-20, -11)]); E(p, box2(22, 22), 1.2, true, '#1d4a7a');
  });
  void shoulderPoint;
};
const tintLid = (p: Painter, x: number, y: number, r: number) => { E(p, ell(x, y, r, r, 24), 1.4); E(p, ell(x, y, r * 0.78, r * 0.78, 20), 0.9); poly(p, '#3b3f44', ell(x, y, 16, 16, 10)); shade(p, '#ffffff', 60, ell(x - r * 0.3, y - r * 0.3, r * 0.3, r * 0.15, 10)); };

export const SHOTS_A: Record<string, Shot> = {
  'ZC2-B01-SH01': {paint: B01_SH01},
  'ZC2-B02-SH01': {paint: B02_SH01},
  'ZC2-B02-SH02': {paint: B02_SH02},
  'ZC2-B02-SH03': {paint: B02_SH03},
  'ZC2-B03-SH01': {paint: B03_SH01},
  'ZC2-B04-SH01': {paint: B04_SH01},
  'ZC2-B04-SH02': {paint: B04_SH02, over: B04_SH02_OVER},
  'ZC2-B04-SH02b': {paint: B04_SH02B, over: B04_SH02B_OVER},
  'ZC2-B04-SH03': {paint: B04_SH03},
};
void [bucketElev, canElev, potElev, glazeS, floorMap, tileFloor, woodGrain, edge, bottleElev, contact, lightOf, nightLight, gripArm, hand, box, stroke, shadowAt];
