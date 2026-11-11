// EDU-EP15 B03 shots 7-13 (storyboard EDU-EP15-ROWS-R2.0): the toe macro dive, the hair split, the dusty TV glass, her tilted head, the tips settling, the pull-back through every
// scale to one warm line, and the tokay bracing upside down.
import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {type Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, mixYCam, type YCam} from '../kit/ycam';
import {wFill} from '../kit/world';
import {paintWomanBack} from './cast';
import {camBetween, eo, lin, mix, sm, type CamKey} from './clock';
import {defShot} from './frame';
import {CalmBand, Lbl, Vignette} from './look';
import {camLF03, paintMacroCarpet, paintPadUnderside} from './macro';
import {paintMicroContact, paintMicroHair} from './micro';
import {C, CEIL, lookCam, W0_FEET} from './palette';
import {paintCeilingFan, paintMoth, paintSofaSide} from './room';
import {restPose, roomBack} from './scenes';
import {fanAngle, mothAt} from './shots-a';
import {T1} from './shots-b';
import {ceilingFrame, paintTokay, paintTokayShadow, restLegs, type Frame, type TokayPose} from './tokay';

const calm = (level: number, id: string, vig = 0.3) => <><Vignette level={vig} id={`v-${id}`} />{level > 0 && <CalmBand level={level} id={`calm-${id}`} />}</>;
const T1F: Frame = ceilingFrame(T1, 225);
const toW = (f: Frame, l: V3): V3 => [f.o[0] + f.U[0] * l[0] + f.V[0] * l[1] + f.N[0] * l[2], f.o[1] + f.U[1] * l[0] + f.V[1] * l[1] + f.N[1] * l[2], f.o[2] + f.U[2] * l[0] + f.V[2] * l[1] + f.N[2] * l[2]];
/** The hero front-left palm at T1 (world). */
export const HERO_PALM: V3 = toW(T1F, restLegs().fl.palm);

// ---- 7. S01-B03-SH01 [522, 684): LBL from +0. The lifted pad (TK5) -> loupe into toe 3 (+12-+28) -> one ridge (+28-+40) dissolving into the hair carpet (+30-+44) -> skim the carpet (+90 = LF03, skim +93-+161).
const CS: YCam = lookCam([0, 0.55, 0.3], [0, 0.0, -0.7], 1000, {hy: 900, near: 0.02});
// R2.3 fix: end pitch -9.3 deg (was -11.3, LF03 -11.9) and the eye 0.01 m higher, so the horizon sinks about 45 px and the rows slide through +93-+161.
const CE: YCam = lookCam([0, 0.42, -1.2], [0, 0.207, -2.5], 1000, {hy: 900, near: 0.02});
export const camSH07 = (L: number): YCam => {
  const c = L < 93 ? mixYCam(CS, camLF03, sm(30, 90, L)) : mixYCam(camLF03, CE, sm(93, 161, L));
  return {...c, near: 0.02};
};
export const padZoom = (L: number) => Math.exp(Math.log(12) * sm(12, 28, L)) * Math.exp(Math.log(4.2) * sm(28, 40, L));
defShot('S01-B03-SH01', (L, g) => {
  const z = padZoom(L), S = 16.8 * z, fy = 899, drift = 6 * Math.sin(L / 14);
  return {
    paint: (p) => {
      if (L < 46) paintPadUnderside(p, {t: g / 30, S, cx: 540 + drift, cy: 960 + (760 - fy) * z});
      if (L >= 30) paintMacroCarpet(L < 44 ? p.layer(lin(30, 44, L), 91000) : p, {t: g / 30, cam: camSH07(L)});
    },
    children: calm(L < 46 ? 0.72 : 0.32, 'sh07'),
    overlay: <Lbl />,
  };
});

// ---- 8. S01-B03-SH02 [684, 775): one hair among softer neighbours, camera up the shaft y 20 -> 115 um; the split from +24, about 200 tips by +44. LBL.
defShot('S01-B03-SH02', (L, g) => ({
  paint: (p) => { paintMicroHair(p, {t: g / 30, yc: 20 + 95 * sm(0, 90, L), fan: sm(20, 48, L), arc: 10 * lin(0, 90, L)}); },
  children: calm(0.3, 'sh08', 0.3),
  overlay: <Lbl />,
}));

// ---- 9. S01-B03-SH03 [775, 837): the off TV's black glass, dusty, slow truck; the bezel edge at screen left; a faint reflection of the lamp streak and the room with her small silhouette.
const TVZ = 2.6, TV_X1 = -0.13, TV_X0 = -1.13, TV_Y0 = 0.62, TV_Y1 = 1.2, BZ = 0.02, CAB_Y = 0.55;
// R21-09 / fixlist W5-F1 item 4: a TV, not a night sky. Camera pos (-0.20, 0.80, 2.05) -> (-0.14, ...), look-at (-0.32, 0.86, 2.60) -> (-0.26, ...), f 1000 (about 1820 px/m at the glass).
export const camSH09 = (L: number): YCam => lookCam([-0.2 + 0.06 * lin(0, 61, L), 0.8, 2.05], [-0.32 + 0.06 * lin(0, 61, L), 0.86, 2.6], 1000, {near: 0.05});
export const paintTvGlass = (p: Painter, c: YCam): {edgeX: number; topY: number; bottomY: number; pxPerM: number; clumps: number; lintPx: number} => {
  const u = camUnit(c, [c.x, 0.9, TVZ], 0.05);
  const P3 = (x: number, y: number, z = TVZ) => camPoint(c, [x, y, z], 0.05)!;
  // glass coordinates: s = metres from the right bezel toward screen right... the TV extends to screen right (x falls), so s = -(x - TV_X1) - BZ, y up
  const G = (s: number, y: number) => P3(TV_X1 - s, y);
  const poly = (pts: [number, number][]) => pts.map(([s, y]) => G(s, y));
  const SM = 1.0; // glass width (m)
  p.flat('#74664b', [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]); // wall
  washAt(p, 66500, '#a58f64', 120, [[0, 0], [400, 0], [400, 1920], [0, 1920]], 0.3, 0.3);
  // the TV: black bezel (0.02 m), then the glass inside it
  const bz = (x0: number, x1: number, y0: number, y1: number) => [P3(x0, y0), P3(x1, y0), P3(x1, y1), P3(x0, y1)];
  hardFill(p, 66510, '#0d0d0f', bz(TV_X0 - BZ, TV_X1 + BZ, TV_Y0 - BZ, TV_Y1 + BZ).map(([x, y]): [number, number] => [Math.min(x, 3000), y]));
  const g0 = G(0, TV_Y0), g1 = G(SM, TV_Y1);
  const GL = poly([[0, TV_Y0], [SM, TV_Y0], [SM, TV_Y1], [0, TV_Y1]]);
  hardFill(p, 66511, '#474b51', GL);
  washAt(p, 66512, '#555a60', 255, poly([[0, TV_Y1], [SM, TV_Y1], [SM, TV_Y1 - 0.12], [0, TV_Y1 - 0.12]]), 0.5, 0.5); // top 0.12 m lighter (vertical gradient)
  // room reflection: warm wall colour 16 % over the top 40 % of the glass
  washAt(p, 66513, '#a08a66', 40, poly([[0, TV_Y1], [SM, TV_Y1], [SM, TV_Y1 - 0.4 * (TV_Y1 - TV_Y0)], [0, TV_Y1 - 0.4 * (TV_Y1 - TV_Y0)]]), 0.5, 0.5);
  // dust as a film (lightens): 22 % over the glass, 40 % in the bottom 0.12 m and the four corner wedges, uneven powder blotches, a dust line on the bottom lip
  washAt(p, 66530, '#cfc8b8', 56, GL, 0.3, 0.5);
  for (let k = 0; k < 3; k++) { // bottom 0.12 m and the four corners: three nested soft steps of 34 (about 102 in all) instead of one hard edge
    const h = 0.12 * (1 - k / 3);
    washAt(p, 66531 + k, '#cfc8b8', 34, poly([[0, TV_Y0], [SM, TV_Y0], [SM, TV_Y0 + h], [0, TV_Y0 + h]]), 0.8, 0.5);
    ([[0, TV_Y0, 1, 1], [SM, TV_Y0, -1, 1], [0, TV_Y1, 1, -1], [SM, TV_Y1, -1, -1]] as [number, number, number, number][]).forEach(([s0, y0, ds, dy], n) => { const a = 0.2 * (1 - k / 3); washAt(p, 66640 + n * 3 + k, '#cfc8b8', 34, poly([[s0, y0], [s0 + ds * a, y0], [s0 + ds * a * 0.5, y0 + dy * a * 0.5], [s0, y0 + dy * a]]), 0.8, 0.5); });
  }
  for (let i = 0; i < 30; i++) {
    const q = G(0.03 + 0.94 * hash(67300 + i), TV_Y0 + 0.02 + 0.54 * hash(67320 + i)), r = (0.02 + 0.03 * hash(67340 + i)) * u;
    washAt(p, 67360 + i, '#d8d1c1', 20 + Math.round(25 * hash(67380 + i)), ell(q[0], q[1], r, r * (0.6 + 0.4 * hash(67400 + i)), 14), 0.6, 0.3);
  }
  washAt(p, 66535, '#d6cfbf', 140, poly([[0, TV_Y0], [SM, TV_Y0], [SM, TV_Y0 + 0.008], [0, TV_Y0 + 0.008]]), 0.1, 0.2);
  // finger wipe: clean glass (the darkest mark), 0.045 m wide, ends feathered, a rim of pushed dust along both long edges
  const arcPts: [number, number][] = [[0.12, 1.0], [0.19, 0.95], [0.28, 0.9], [0.4, 0.885]];
  const off = (k: number): [number, number][] => arcPts.map(([s, y], i) => { const a = arcPts[Math.max(0, i - 1)], b = arcPts[Math.min(arcPts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy); return [s - (dy / n) * k, y + (dx / n) * k] as [number, number]; });
  const ring = (k0: number, k1: number) => poly([...off(k0), ...off(k1).reverse()]);
  washAt(p, 66541, '#e2dccd', 90, ring(0.0225, 0.0285), 0.2, 0.3);
  washAt(p, 66542, '#e2dccd', 90, ring(-0.0225, -0.0285), 0.2, 0.3);
  washAt(p, 66540, '#3f444a', 220, ring(0.0225, -0.0225), 0.2, 0.5);
  // reflection as glass: broad diagonal sheen band (white 10 %, 0.25 m wide), the lamp as a radial falloff glow, her silhouette on the sofa (15 %)
  const sh = (c.x + 0.25) * u * 0.45;
  washAt(p, 66520, '#ffffff', 26, poly([[0.46, TV_Y1], [0.71, TV_Y1], [0, 0.72], [0, 0.89]]), 0.4, 0.2);
  const lamp = G(0.4, 1.12);
  for (let k = 0; k < 14; k++) washAt(p, 66521 + k * 40, '#fff1d0', 5, ell(lamp[0], lamp[1], 0.05 * u * (1 - k / 14), 0.05 * u * (1 - k / 14), 20), 8, 0.2); // 14 rings x 5 = alpha 70 at the centre, 0 at r 0.05 m
  washAt(p, 66522, '#3d6b66', 35, [[g0[0] + 60 + sh, 1150], [1080, 1130], [1080, 1330], [g0[0] + 60 + sh, 1340]], 0.3, 0.3);
  const hx = g0[0] + 380 + sh;
  washAt(p, 66523, '#2b1d16', 38, ell(hx, 1180, 14, 15, 14), 0.2, 0.1); // her head
  washAt(p, 66524, '#2b1d16', 20, [[hx - 30, 1200], [hx + 30, 1200], [hx + 44, 1250], [hx - 44, 1250]], 0.3, 0.2);
  // lint as dust bunnies: 10 clumps (5 on the bottom lip, 3 in the lower corners, 2 in the lower half), each a soft irregular core plus 20-35 single-curve fibres
  const spots: [number, number][] = [[0.12, TV_Y0 + 0.012], [0.3, TV_Y0 + 0.012], [0.5, TV_Y0 + 0.012], [0.72, TV_Y0 + 0.012], [0.9, TV_Y0 + 0.012], [0.04, TV_Y0 + 0.06], [0.96, TV_Y0 + 0.07], [0.06, TV_Y0 + 0.2], [0.35, TV_Y0 + 0.14], [0.78, TV_Y0 + 0.2]];
  let clumps = 0;
  spots.forEach(([s0, y0], i) => {
    const q = G(s0, y0);
    if (q[0] < g0[0] + 8 || q[0] > 1070) return;
    clumps++;
    const R = (0.015 + 0.02 * hash(67700 + i)) * u * 0.5, nv = 8 + Math.floor(5 * hash(67710 + i));
    const core = Array.from({length: nv}, (_, k): [number, number] => { const a = (k / nv) * Math.PI * 2, rr = R * (1 + 0.7 * (hash(67720 + i * 20 + k) - 0.5)); return [q[0] + Math.cos(a) * rr, q[1] + Math.sin(a) * rr * 0.8]; });
    washAt(p, 67730 + i, '#d9d3c6', 110, core, 0.5, 0.3);
    const nf = 20 + Math.floor(15 * hash(67740 + i));
    for (let k = 0; k < nf; k++) {
      const h = (n: number) => hash(67960 + i * 400 + k * 8 + n);
      const rc = Math.sqrt(h(0)) * R * 0.8, ac = h(1) * Math.PI * 2, st: [number, number] = [q[0] + Math.cos(ac) * rc, q[1] + Math.sin(ac) * rc * 0.8];
      const len = (0.004 + 0.008 * h(2)) * u, rad = (0.004 + 0.011 * h(3)) * u, a0 = h(4) * Math.PI * 2, sg = h(5) < 0.5 ? 1 : -1, sweep = Math.min(2.2, len / rad);
      const pts = [0, 1 / 3, 2 / 3, 1].map((f): [number, number] => { const a = a0 + sg * sweep * f; return [st[0] + rad * (Math.sin(a) - Math.sin(a0)) * sg, st[1] - rad * (Math.cos(a) - Math.cos(a0)) * sg]; });
      inkLine(p, 67900 + i * 40 + k, pts, {closed: false, weight: 1.5, color: '#ece7dc', still: true, curve: 0.7});
    }
  });
  const l0 = G(0.62, 0.98), lintPx = 0.05 * u; // the lint fibre (0.05 m), gentle S
  inkLine(p, 68100, [l0, [l0[0] + lintPx * 0.3, l0[1] - lintPx * 0.1], [l0[0] + lintPx * 0.55, l0[1] + lintPx * 0.1], [l0[0] + lintPx * 0.8, l0[1] - lintPx * 0.07], [l0[0] + lintPx, l0[1] + lintPx * 0.02]], {closed: false, weight: 2, color: '#efeae0', still: true, curve: 0.8});
  // cabinet top below the bottom bezel (y 0.55, toward the lens), drawn last over the glass edge
  hardFill(p, 66560, '#5a4430', [P3(-2.0, CAB_Y, TVZ), P3(0.0, CAB_Y, TVZ), P3(0.0, CAB_Y, TVZ - 0.35), P3(-2, CAB_Y, TVZ - 0.35)]);
  washAt(p, 66561, '#8a6d4c', 60, [P3(-2, CAB_Y, TVZ - 0.02), P3(0.0, CAB_Y, TVZ - 0.02), P3(0.0, CAB_Y, TVZ - 0.12), P3(-2, CAB_Y, TVZ - 0.12)], 0.3, 0.3);
  void g1;
  return {edgeX: Math.round(G(0, 0.9)[0]), topY: Math.round(G(0, TV_Y1)[1]), bottomY: Math.round(G(0, TV_Y0)[1]), pxPerM: Math.round(u), clumps, lintPx: Math.round(lintPx)};
};
defShot('S01-B03-SH03', (L) => ({
  paint: (p) => { paintTvGlass(p, camSH09(L)); },
  children: calm(0.55, 'sh09', 0.3),
}));

// ---- 10. S01-B03-SH04 [837, 928): over her shoulder looking up: WOMAN back (phone lowered), the tokay hanging still at T1 above; her head tilts at +50 (headCock 0 -> 18 over +37-+49, 2 deg overshoot at +49 settling to 18 by +53; W5-F1/R2.3).
export const camSH10 = (L: number): YCam => lookCam([-0.2, 1.2, -1.25 + 0.02 * lin(0, 90, L)], [-0.2, 1.2, -0.35], 400 + 20 * lin(0, 90, L), {near: 0.05});
defShot('S01-B03-SH04', (L, g) => {
  const c = camSH10(L), t = g / 30;
  return {
    paint: (p) => {
      roomBack(p, c);
      paintCeilingFan(p, c, fanAngle(g));
      paintTokayShadow(p, c, T1F, 61990, [0.004, 0.006]);
      paintTokay(p, c, T1F, restPose(), {t});
      const mo = mothAt(g); paintMoth(p, c, mo.at, mo.phase);
      paintSofaSide(p, c);
      paintWomanBack(p, c, {at: W0_FEET, t, headCock: L < 49 ? 20 * sm(37, 49, L) : 20 - 2 * sm(49, 53, L), tint: 0.05});
    },
    children: calm(0.78, 'sh10'),
  };
});

// ---- 11. S01-B03-SH05 [928, 1009): micro section; the tips settle along the bumps and into the dips (+27 starts, +51 full contact); truck x +20 um. LBL.
defShot('S01-B03-SH05', (L, g) => ({
  paint: (p) => { paintMicroContact(p, {t: g / 30, glints: 0, truck: 20 * lin(0, 80, L), settle: sm(22, 51, L)}); },
  children: calm(0.34, 'sh11', 0.3),
  overlay: <Lbl />,
}));

// ---- 12. S01-B03-SH06 [1009, 1155): from shot 11's end; +34 first glint, glints spread (LF04 = 0.45 at +45), +78-+96 loupe out to the toe macro, +96-+111 the carpet pulls back, +111-+126 the toe and foot, +126 the room
// with one warm line from the foot into the ceiling (+121) that fades. LBL until +126.
export const glints12 = (L: number) => (L < 34 ? 0 : L < 45 ? 0.0004 * Math.pow(0.45 / 0.0004, lin(34, 45, L)) : 0.45 + 0.4 * sm(45, 78, L));
const CP0: YCam = lookCam([0, 0.45, 0.55], [0, 0.05, -1.0], 1000, {hy: 900, near: 0.02});
const CP1: YCam = lookCam([0, 5.5, 4.5], [0, 0, -2.5], 1000, {hy: 900, near: 0.02});
export const camR12: YCam = lookCam([HERO_PALM[0], 2.47, HERO_PALM[2] + 0.24], [HERO_PALM[0], CEIL, HERO_PALM[2]], 1000, {hy: 900, near: 0.02});
defShot('S01-B03-SH06', (L, g) => {
  const gl = glints12(L), t = g / 30;
  const aMicro = L < 78 ? 1 : 1 - sm(78, 96, L), aCarp = L < 107 ? 1 : 1 - sm(105, 117, L), aPad = L < 119 ? 1 : 1 - sm(117, 127, L);
  const cc = mixYCam(CP0, CP1, sm(96, 111, L));
  return {
    paint: (p) => {
      if (L >= 115) {
        roomBack(p, camR12, {focus: HERO_PALM, stippleR: 0.2, stippleStep: 0.008, halo: 0.7});
        paintTokayShadow(p, camR12, T1F, 61990, [0.004, 0.006]);
        const m = paintTokay(p, camR12, T1F, restPose(), {t});
        // the warm line: from the hero foot up the screen into the plaster, fading by +132
        const foot = m.feet.fl ?? [540, 900], a = sm(115, 121, L) * (1 - sm(125, 143, L)) * 1;
        if (a > 0.02) {
          const top: [number, number] = [foot[0] + 30, foot[1] - 700];
          washAt(p, 69000, C.pull, 200 * a, [[foot[0] - 26, foot[1]], [foot[0] + 26, foot[1]], [top[0] + 3, top[1]], [top[0] - 3, top[1]]], 0.5, 0.2);
          inkLine(p, 69001, [foot, [foot[0] + 12, foot[1] - 350], top], {closed: false, weight: 6 * a + 0.5, color: C.glint, still: true, curve: 0.3});
          washAt(p, 69002, C.glint, 110 * a, ell(foot[0], foot[1], 70, 46, 14), 0.4, 0.2);
        }
      }
      if (L >= 81 && aPad > 0.01) paintPadUnderside(aPad < 1 ? p.layer(aPad, 92000) : p, {t, S: mix(16.8, 7, sm(111, 127, L)), cx: 540, cy: 960 - 120 * sm(111, 127, L), glow: 0.5 * sm(107, 119, L)});
      if (L >= 71 && L < 119 && aCarp > 0.01) paintMacroCarpet(aCarp < 1 ? p.layer(aCarp, 93000) : p, {t, cam: cc, glow: 0.55});
      if (L < 101 && aMicro > 0.01) {
        const q = aMicro < 1 ? p.layer(aMicro, 94000) : p;
        paintMicroContact(q, {t, glints: gl, truck: 20, settle: 1, S: mix(12, 4.5, sm(78, 97, L))});
      }
    },
    children: calm(L < 96 ? 0.34 : L < 107 ? 0.48 : 0.85, 'sh12', 0.3),
    overlay: L < 126 ? <Lbl /> : undefined,
  };
});

// ---- 13. S01-B03-SH07 [1155, 1216): ceiling-level side view at T1, pull back; on "ยิ่งเกาะ" (+34) it braces: pads flatten, the body dips 2 mm, holds.
export const KEY13A: CamKey = {pos: [T1[0] + 0.32, 2.63, T1[2] - 0.32], at: [T1[0], 2.68, T1[2]], f: 1000, near: 0.02};
export const KEY13B: CamKey = {pos: [T1[0] + 0.53, 2.62, T1[2] - 0.53], at: [T1[0], 2.68, T1[2]], f: 1000, near: 0.02};
export const camSH13 = (L: number) => camBetween(KEY13A, KEY13B, lin(0, 60, L));
export const bracePose = (k: number): {frame: Frame; pose: TokayPose} => {
  const dip = 0.002 * k, pose = restPose({tips: {hl: 0.6 * (1 - k), hr: 0.6 * (1 - k), fl: 0.15 * (1 - k), fr: 0.15 * (1 - k)}});
  const legs = Object.fromEntries((Object.keys(pose.legs) as (keyof typeof pose.legs)[]).map((id) => [id, {...pose.legs[id], palm: [pose.legs[id].palm[0], pose.legs[id].palm[1], pose.legs[id].palm[2] + dip] as V3}])) as TokayPose['legs'];
  return {frame: {...T1F, o: [T1F.o[0], T1F.o[1] + dip, T1F.o[2]]}, pose: {...pose, legs}};
};
defShot('S01-B03-SH07', (L, g) => {
  const c = camSH13(L), {frame, pose} = bracePose(eo(34, 40, L)), t = g / 30;
  return {
    paint: (p) => {
      roomBack(p, c, {focus: T1, stippleR: 0.3, stippleStep: 0.01, halo: 0.9});
      paintCeilingFan(p, c, fanAngle(g));
      paintTokayShadow(p, c, frame, 61990, [0.004, 0.006]);
      paintTokay(p, c, frame, pose, {t});
      const mo = mothAt(g); paintMoth(p, c, mo.at, mo.phase);
      void wFill;
    },
    children: calm(0.82, 'sh13'),
  };
});
void hardFill; void CEIL;
