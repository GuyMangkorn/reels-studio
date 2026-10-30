import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {paintAssembly, paintHubs, paintJamGround, paintJamTyre, type AsmPose, type Part} from './assembly';
import {paintSedanBody} from './car';
import {band, blob, projectPoly, quadX, quadY, quadZ, rectPts} from './draw';
import {fogAt, lampAt, smoothstep, type Proj, type V3} from './space';

// Outside the glass (MK-WF-DEP-03; brief VD06, SP02): night fog lit by the four canopy lamps on the story clock
// FOG-STATE (FS0 readable lane and forecourt -> FS3 lamps gone), far ghosts of the pumps and the parked sedan, drifting
// banks (high behind the assembly, low in front), wet walkway with puddles and lamp reflections, and the assembly with
// its shadow pool, drag mark and wet-ground reflection. One painter for every camera that sees outside; the spike
// window plate (`src/painted/spike/WfogShop.tsx`, CAM-GLASS-OUT FS2) is its FS2 case.
//
// SS-R5 (MK-WF-DEP-11, VD06 R6): `front` replaces the global FS0→FS2 fade with a fog front at depth F (m from the glass
// along +z). A layer nearer than F is kept, a layer beyond F is left out, and a layer the front is reaching fades over
// FRONT_FADE_M of travel (no pop); ground planes are clipped at F. The front is painted as soft banks with a bright crest
// and ground tendrils, the car is covered by the front as its far face and then its flank pass (`carCoverAt`), and the
// FOG-STATE level drives only the veil (off with `front`). Front mode uses `CLEAR`, a clear night palette with a pale wall.
// Without `front` every call below is made in the same order and with the same values as before (window shots stay
// byte-identical: the fades multiply by exactly 1 there).

export const FOG = {top: '#77736a', mid: '#6b706c', low: '#58625f', ground: '#3d4646', veil: '#72776f', bankA: '#878b83', bankB: '#68726f'};
export const LAMPS: V3[] = [[-2.4, 4.8, 7], [2.4, 4.8, 7], [-2.4, 4.8, 11], [2.4, 4.8, 11]];

/** Front-mode palette (SS-R5 r9b): a clear night forecourt. Dark asphalt and concrete, bright kerb, pumps and dashes, a pale wall. */
export const CLEAR = {
  sky: ['#262d2e', '#222a2b', '#1f2627', '#1c2223', '#191f20', '#171b1d', '#151819', '#131617'],
  wall: '#aeb4aa', wallFar: '#c3c8be', crest: '#d6dad1', bankB: '#8e958d', bankC: '#7d847c', tendril: '#6f7a76',
  canopy: '#2a2d2b', slab: '#6a746e', lane: '#2f3836', road: '#262c2b', dash: '#e6e0bf', kerb: '#d2d4cb',
  island: '#5f6661', pump: '#e4e1d4', column: '#b9baae',
};

/** Distance (m) of front travel over which a layer fades before the front reaches it. */
export const FRONT_FADE_M = 0.8;

export type OutsideOpts = {
  /** Assembly to paint in the fog, with its (warped) parts. */
  asm?: {pose: AsmPose; parts: Part[]};
  /** Paint only the assembly on white paper (SP01 b / SP04 masks). */
  bare?: boolean;
  /** Torch beam level 0..1 (warm lit fog in front of the assembly). */
  beam?: number;
  /** Skip the parked sedan ghost (S01-SH02 draws the hero car itself). */
  noCarGhost?: boolean;
  /** Low ground bank in front of the cart, 0..1 (S02-SH05 thins it for the wheel glimpse). Default 1 (0 with `front`). */
  lowBank?: number;
  /** S03-SH06 jammed-caster read (SS-R3.3 Q4): torch pool and scrape on the ground, scuff, warm rim and spray on the tyre. */
  jam?: boolean;
  /** SS-R5 fog front F (m from the glass along +z, WORLD-SHOP). Undefined: the FS-level fade of SS-R4.1. F >= 60: the far wall. */
  front?: number;
  /** SS-R5 S02-SH00A: the parked sedan as its side profile (`paintSedanBody`), covered by the front (`carCoverAt`). */
  sedan?: boolean;
  /** Ambient clock (story frame, continuous): fog drift `t` runs on it, so a held event clock never freezes the fog (SS-R5.1). Default G. */
  ambient?: number;
};

/** The parked sedan (ST-01, SS-R3.3): body x -4.15..+0.35 (was -3.6..+0.9), z 4.2..6.0, 1.45 m high; parked from G156. */
export const SEDAN = {x0: -4.15, x1: 0.35, z0: 4.2, z1: 6.0, h: 1.45};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** The front has taken this share of the parked car: 0 until its far face (z 6.0) passes, 1 at its near flank (z 4.2) and after. */
export const carCoverAt = (F: number) => clamp01((SEDAN.z1 - F) / (SEDAN.z1 - SEDAN.z0));
/** Headlamp glow left after the body is covered (headlamp last): 1 while F is 4.2 or more, out at F 3.0. */
export const headlampAt = (F: number) => clamp01((F - 3.0) / 1.2);

/**
 * The fog front at depth F (SS-R5, MK-WF-DEP-11): a soft bank from the ground line at F up to 4 m (15 m for the far wall
 * at F ≥ 60), a bright crest along its top, two lower banks and low ground tendrils 0.5–1.5 m nearer the glass. Painted
 * before the layers: every layer that remains is nearer than F and stands in front of it.
 */
const paintFront = (p: Painter, proj: Proj, F: number, t: number) => {
  const far = F >= 60;
  const yb = proj.P([0, 0, F])[1], yt = proj.P([0, far ? 15 : 4, F])[1], k = proj.k([0, 0, F]);
  p.group(150);
  // Bleed is small: a watercolour bleed of 0.6 on this wide band spread the pale wall about 150 px below its base line.
  p.wash(far ? CLEAR.wallFar : CLEAR.wall, far ? 200 : 150, band(150, yt, yb, 36), 0.05, 0.25);
  p.wash(CLEAR.crest, far ? 150 : 110, band(151, yt, yt + (yb - yt) * 0.22, 40), 0.05, 0.25);
  if (!far) {
    p.wash(CLEAR.bankB, 60, band(152, yt + (yb - yt) * 0.4, yb, 50), 0.05, 0.25);
    p.wash(CLEAR.bankC, 50, band(153, yt + (yb - yt) * 0.65, yb, 40), 0.05, 0.25);
  }
  [[-1.4, 0.8], [0.6, 1.2], [1.8, 0.6]].forEach(([x, d], i) => {
    const [cx, cy] = proj.P([x, 0, F - d]);
    p.wash(CLEAR.tendril, 90, blob(160 + i, cx, cy, 1.6 * k, 0.22 * k, t), 0.5, 0.4);
  });
};

export const paintOutside = (p: Painter, proj: Proj, G: number, o: OutsideOpts = {}) => {
  const t = (o.ambient ?? G) / 30;
  const fs = fogAt(G);
  const front = o.front !== undefined, F = o.front ?? Infinity;
  // Layer visibility by depth: `vis(z)` keeps a layer whose depth is nearer than the front, `zc(z)` clips a ground plane at it,
  // `fz(z)` is its opacity share while the front travels across it (1 without `front`: x * 1 is exact).
  const vis = (z: number) => z < F;
  const zc = (z: number) => Math.min(z, F);
  const fz = (z: number) => clamp01((F - z) / FRONT_FADE_M);
  const yh = proj.setup?.yh ?? 700, dy = yh - 700;
  const clear = front ? 1 : 1 - smoothstep(0.6, 1.9, fs); // forecourt detail left readable (FS0 1 -> FS2 0)
  const lamp = (i: number) => lampAt(G, i);
  if (!o.bare) {
    p.group(100);
    // Fog sky: lamp-lit warm grey at the top, darkening and cooling toward the ground (night, sodium canopy).
    // With `front` the sky is the night palette, so the lit forecourt and the pale wall read against it.
    const ramp8 = front ? CLEAR.sky : [FOG.top, mixColor(FOG.top, FOG.mid, 0.5), FOG.mid, mixColor(FOG.mid, FOG.low, 0.5), FOG.low, mixColor(FOG.low, '#4f5958', 0.5), '#4f5958', '#4a5453'];
    ramp8.forEach((c, i) => p.wash(fs > 2 ? mixColor(c, '#6a6f6b', fs - 2) : c, 240, rectPts(-300, i ? 120 + i * 160 + dy : -400, 1400, 120 + (i + 1) * 160 + 120 + dy + (i === 7 ? 900 : 0)), 0.45, 0.5));
    if (front) paintFront(p, proj, F, t);
    // Canopy underside: structure while the fog is thin, a ghost mass at FS2.
    const canopy = vis(3.5) ? projectPoly(proj, quadY(4.8, -6, 6, 3.5, zc(13))) : [];
    if (canopy.length) p.wash(front ? CLEAR.canopy : '#4f514b', (110 + 120 * clear) * fz(3.5), canopy, front ? 0.2 : 0.5, front ? 0.3 : 0.5);
    if (clear > 0) {
      for (const z of [5, 7, 9, 11]) {
        if (!vis(z - 0.08)) continue;
        const beam = projectPoly(proj, quadY(4.79, -6, 6, z - 0.08, zc(z + 0.08)));
        if (beam.length) p.wash('#3c3d39', 140 * clear * fz(z - 0.08), beam, 0.2, 0.4);
      }
    }
    p.group(160);
    // Lane, road and forecourt slab (FS0-FS1 readable; gone at FS2).
    if (clear > 0) {
      if (vis(2)) {
        const slab = projectPoly(proj, quadY(0, -8, 8, 2, zc(14)));
        if (slab.length) p.wash(front ? CLEAR.slab : '#5a5f5b', (front ? 240 : 170) * clear * fz(2), slab, front ? 0.1 : 0.3, front ? 0.2 : 0.5);
      }
      if (vis(14)) {
        const lane = projectPoly(proj, quadY(0, -2, 2, 14, zc(23)));
        if (lane.length) p.wash(front ? CLEAR.lane : '#3e4442', (front ? 245 : 200) * clear * fz(14), lane, front ? 0.1 : 0.3, front ? 0.2 : 0.5);
      }
      if (vis(24)) {
        const road = projectPoly(proj, quadY(0, -40, 40, 24, zc(32)));
        if (road.length) p.wash(front ? CLEAR.road : '#3a403f', (front ? 245 : 200) * clear * fz(24), road, front ? 0.1 : 0.3, front ? 0.2 : 0.5);
      }
      for (let i = 0; i < 8; i++) {
        if (!vis(27.9)) break;
        // Front mode: a dash about 9 px tall at the forecourt camera (the window look keeps its 3 px dash).
        const dash = projectPoly(proj, quadY(0.001, -20 + i * 5, -18.5 + i * 5, front ? 27.0 : 27.9, front ? 29.0 : 28.1));
        if (dash.length) p.wash(front ? CLEAR.dash : '#c9c4a8', (front ? 240 : 120) * clear * fz(27.9), dash, front ? 0.03 : 0.1, front ? 0.15 : 0.3);
      }
      // Pump islands and pumps (z 9.5, x +-3.5), canopy columns.
      for (const x of [-3.5, 3.5]) {
        if (vis(9.1)) {
          const island = projectPoly(proj, quadZ(9.1, x - 0.9, x + 0.9, 0, 0.18));
          if (island.length) p.wash(front ? CLEAR.island : '#77796f', (front ? 240 : 200) * clear * fz(9.1), island, front ? 0.05 : 0.2, front ? 0.2 : 0.4);
        }
        for (const dx of [-0.45, 0.45]) {
          if (vis(9.3)) {
            const pump = projectPoly(proj, quadZ(9.3, x + dx - 0.25, x + dx + 0.25, 0.18, 1.75));
            if (pump.length) p.wash(front ? CLEAR.pump : '#d9d6c8', (front ? 240 : 220) * clear * fz(9.3), pump, front ? 0.03 : 0.15, front ? 0.15 : 0.35);
          }
          if (vis(9.29)) {
            const panel = projectPoly(proj, quadZ(9.29, x + dx - 0.18, x + dx + 0.18, 1.0, 1.55));
            if (panel.length) p.wash('#3f4a52', 200 * clear * fz(9.29), panel, 0.1, 0.3);
          }
        }
        if (vis(9.5)) {
          const col = projectPoly(proj, quadZ(9.5, x - 0.12, x + 0.12, 0, 4.8));
          if (col.length) p.wash(front ? CLEAR.column : '#8d8e86', (front ? 230 : 200) * clear * fz(9.5), col, front ? 0.05 : 0.15, front ? 0.2 : 0.4);
        }
      }
      // Kerb at the walkway edge.
      if (vis(2.0)) {
        const kerb = projectPoly(proj, quadZ(2.0, -8, 8, 0, 0.12));
        if (kerb.length) p.wash(front ? CLEAR.kerb : '#8c8f88', (front ? 240 : 160) * clear * fz(2.0), kerb, front ? 0.02 : 0.15, front ? 0.1 : 0.4);
      }
    }
    // Lamp cores (warm), softened by the veil painted over them.
    p.group(200);
    LAMPS.forEach((l, i) => {
      if (proj.rawDepth(l) < 0.5 || !vis(l[2])) return;
      const [x, y] = proj.P(l), r = 0.32 * proj.k(l);
      p.wash(mixColor('#4f514b', '#ffd58a', lamp(i)), 230 * fz(l[2]), blob(200 + i, x, y, r, r * 0.42, 0), 0.25, 0.3);
    });
    // Far ghosts: pump islands and the parked sedan as smudges (FS2: nothing beyond about 2 m has a readable shape).
    p.group(220);
    for (const x of [-3.5, 3.5]) {
      const ghost = projectPoly(proj, quadZ(9.5, x - 0.4, x + 0.4, 0, 1.8));
      if (ghost.length) p.wash('#5e6461', 34 * (1 - clear), ghost, 0.5, 0.5);
    }
    if (G >= 156 && !o.noCarGhost && vis(SEDAN.z0)) {
      const car = projectPoly(proj, quadZ(SEDAN.z0, SEDAN.x0, SEDAN.x1, 0, SEDAN.h));
      if (car.length) {
        const xs = car.map((q) => q[0]), ys = car.map((q) => q[1]);
        const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
        const rx = (Math.max(...xs) - Math.min(...xs)) / 2, ry = (Math.max(...ys) - Math.min(...ys)) / 2;
        p.wash('#3f4746', (42 + 170 * clear) * fz(SEDAN.z0), blob(230, cx, cy + 0.15 * ry, rx, ry * 0.85, 0), 0.6 - 0.4 * clear, 0.5);
        if (clear > 0.05) p.wash('#2b3133', 160 * clear * fz(SEDAN.z0), blob(231, cx, cy - 0.35 * ry, rx * 0.55, ry * 0.4, 0), 0.3, 0.4);
      }
    }
    // The parked sedan as its side profile (S02-SH00A): drawn while the front is beyond its near flank (z 4.2); the cover
    // below takes it over as the front arrives (far face first), so it never drops in one frame.
    // With `front` the car's paint fades as the front takes it (far face z 6.0 first, flank z 4.2 last), so the bank painted
    // behind shows through; the car is gone at F 4.2 where its alpha is 0 (no pop).
    if (o.sedan && G >= 156 && vis(SEDAN.z0)) paintSedanBody(front ? p.layer(1 - carCoverAt(F), 40000) : p, proj, 0, 0, 0, 0);
    if (o.sedan && front && G >= 156) {
      // The headlamp is the last light the car keeps: it goes out between F 4.2 and 3.0.
      const hl = headlampAt(F);
      if (hl > 0) {
        const [hx, hy] = proj.P([0.3, 0.65, SEDAN.z0]), k = proj.k([0.3, 0, SEDAN.z0]);
        p.wash('#f2d59a', 200 * hl, blob(245, hx, hy, 0.16 * k, 0.12 * k, t), 0.6, 0.4);
      }
    }
    // FOG-STATE veil over everything beyond the first 2 m; FS3 closes to a flat grey. With `front` the veil is off: the
    // front bank carries the fog, so the forecourt does not fade as a whole.
    const veil = front ? 0 : fs < 1 ? 35 + 55 * fs : fs < 2 ? 90 + 60 * (fs - 1) : 150 + 70 * (fs - 2);
    p.wash(FOG.veil, veil, rectPts(-300, -400, 1400, 1150 + dy), 0.4, 0.5);
    p.wash(FOG.top, front ? 0 : 40 + 30 * Math.min(fs, 2) / 2 + 40 * Math.max(0, fs - 2), band(50, -400, 560 + dy, 80), 0.5, 0.5);
    p.group(260);
    // Lamp haze over the veil (visibility gauge): scattered warm halos, scaled by each lamp's level.
    LAMPS.forEach((l, i) => {
      if (proj.rawDepth(l) < 0.5) return;
      const lv = lamp(i);
      if (lv <= 0) return;
      const [x, y] = proj.P(l), k = proj.k(l);
      const spread = 0.6 + 0.4 * Math.min(1, fs / 2);
      p.wash('#8f826a', 120 * lv, blob(240 + i, x, y, 1.5 * k * spread, 1.0 * k * spread, t), 0.6, 0.4);
      p.wash('#b49e78', 120 * lv, blob(250 + i, x, y, 0.8 * k * spread, 0.5 * k * spread, t), 0.5, 0.35);
      p.wash('#e8cf9c', 170 * lv, blob(260 + i, x, y, 0.32 * k, 0.17 * k, 0), 0.35, 0.3);
    });
    p.group(290);
    if (fs > 2) p.wash('#727771', 120 * (fs - 2), rectPts(-300, -400, 1400, 900 + dy), 0.5, 0.5);

    // High banks behind the assembly, drifting left to right on the story clock (far slow, near fast).
    const bank = (id: number, op: number, x0: number, y0: number, rx: number, ry: number, drift: number, color: string) => {
      const span = 1700, x = ((((x0 + t * drift + 400) % span) + span) % span) - 400;
      p.wash(color, op * (0.5 + 0.5 * Math.min(1, fs)), blob(id, x, y0 + dy, rx, ry, t), 0.6, 0.45);
    };
    if (!front) {
      p.group(300);
      bank(1, 60, 100, 330, 700, 120, 9, FOG.bankA);
      bank(2, 55, 900, 540, 760, 110, 12, FOG.bankA);
      bank(3, 55, 300, 780, 780, 120, 16, FOG.bankB);
      bank(4, 45, 1100, 980, 720, 90, 20, FOG.bankA);
      bank(5, 40, -100, 1080, 640, 80, 24, FOG.bankB);
    }

    // Wet ground: walkway z 0-2 darker near the glass, merging into fog; puddles reflect the bright fog.
    p.group(400);
    const gy = (z: number) => proj.P([0, 0, z])[1];
    const outward = proj.setup?.look === '+z';
    if (outward) {
      [[3.2, 60], [2.4, 90], [1.7, 130], [1.1, 170], [0.6, 200], [0.25, 210]].forEach(([z, op]) => {
        if (!vis(z)) return;
        p.wash(mixColor(FOG.low, FOG.ground, op / 210), op * fz(z), rectPts(-300, gy(z), 1400, Math.max(gy(z) + 10, gy(0.001) + 600)), 0.55, 0.45);
      });
    } else {
      // Seen along the glass (CAM-INT-SIDE): one wet-walkway wash fading into the fog, no depth strips (their edges
      // would radiate from the vanishing point as dark streaks).
      const g = projectPoly(proj, quadY(0, -3, 3, 0, 4));
      if (g.length) p.wash(mixColor(FOG.low, FOG.ground, 0.4), 150, g, 0.6, 0.45);
    }
    [[-0.75, 0.55, 0.35, 0.16], [0.75, 0.4, 0.4, 0.14], [-0.2, 1.6, 0.6, 0.3], [0.6, 1.25, 0.3, 0.16]].forEach(([x, z, rx, rz], i) => {
      const pts = Array.from({length: 16}, (_, j): V3 => {
        const a = (j / 16) * Math.PI * 2, r = 1 + 0.18 * Math.sin(3 * a + hash(i + 430) * 6);
        return [x + rx * r * Math.cos(a), 0, z + rz * r * Math.sin(a)];
      });
      const q = projectPoly(proj, pts);
      if (q.length && vis(z)) p.wash('#6f7873', 110 * fz(z), q, 0.35, 0.4);
    });
    p.group(480);
    LAMPS.slice(2).forEach((l, i) => {
      const lv = lamp(i + 2);
      if (lv <= 0 || proj.rawDepth(l) < 0.5 || !vis(l[2])) return;
      const [x] = proj.P(l), y = proj.P([l[0], -l[1], l[2]])[1];
      p.wash('#c9a46a', 80 * lv * fz(l[2]), blob(440 + i, x, Math.min(y - 70, 1900), 26 * proj.k(l) / 120, 90 * proj.k(l) / 120, 0), 0.4, 0.35);
    });
  }
  if (o.asm) paintAsmOutside(p, proj, G, o.asm, !!o.bare, o.beam ?? 0, !!o.jam);
  if (o.bare) return;
  // Ground fog in front of the lower assembly only (low bank): never over the helmet or hood (spike finding).
  p.group(3000);
  const zf = o.asm ? Math.max(0.1, o.asm.pose.S.zs + 0.18) : 0.8;
  const lb = o.lowBank ?? (front ? 0 : 1);
  if (proj.setup?.look === '+z' && lb > 0) {
    p.wash(FOG.low, 70 * lb, band(70, proj.P([0, 0.32, zf])[1], proj.P([0, -0.1, zf])[1], 30), 0.25, 0.3);
    p.wash(FOG.bankB, 55 * lb, blob(71, ((200 + t * 30) % 1500) - 200, proj.P([0, 0.05, Math.max(0.1, zf - 0.4)])[1], 520, 40, t), 0.3, 0.35);
  }
};

/** Beam reach on the painted plate: warm lit fog in about 1.5 m in front of the assembly (VD06), behind it. */
const paintBeamFog = (p: Painter, proj: Proj, S: {xs: number; zs: number}, beam: number) => {
  const [ax, ay] = proj.P([S.xs + 0.1, 1.2, S.zs + 0.5]);
  const k = proj.k([S.xs, 0, S.zs]) / 370;
  p.wash('#8e8270', 70 * beam, blob(910, ax - 60 * k, ay + 20 * k, 380 * k, 470 * k, 0), 0.7, 0.45);
  p.wash('#a8977a', 70 * beam, blob(911, ax - 30 * k, ay - 10 * k, 270 * k, 340 * k, 0), 0.6, 0.45);
  p.wash('#bfa983', 60 * beam, blob(912, ax, ay - 40 * k, 170 * k, 220 * k, 0), 0.5, 0.4);
};

/** Drag mark, backlit shadow pool, wet-ground reflection, beam fog, then the assembly itself. */
const paintAsmOutside = (p: Painter, proj: Proj, G: number, asm: {pose: AsmPose; parts: Part[]}, bare: boolean, beam: number, jam: boolean) => {
  const {pose, parts} = asm;
  const {xs, zs} = pose.S;
  if (!bare) {
    p.group(450);
    const drag = projectPoly(proj, [[xs + 0.185, 0, zs], [xs + 0.215, 0, zs], [xs + 0.3, 0, 2.2], [xs + 0.22, 0, 2.2]]);
    if (drag.length) p.wash('#323938', 90, drag, 0.2, 0.5);
    const shadow = projectPoly(proj, Array.from({length: 18}, (_, i): V3 => {
      const a = (i / 18) * Math.PI * 2;
      return [xs + 0.15 + 0.42 * Math.cos(a), 0, zs + 0.05 + 0.55 * Math.sin(a)];
    }));
    if (shadow.length) p.wash('#262c2c', 150, shadow, 0.4, 0.4);
    // Reflection of the assembly in the wet ground: the silhouette mirrored about its ground line, in ripple strips.
    p.group(500);
    const g = proj.P([xs, 0, zs + 0.2])[1];
    parts.filter((x) => !x.inner).forEach((x) => {
      const pts = x.pts.map(([u, v], j): Pt => [u + 4 * Math.sin((2 * g - v) / 9 + j), 2 * g - v]);
      p.wash('#2b3232', 70, pts, 0.15, 0.4);
    });
    if (beam > 0) paintBeamFog(p, proj, pose.S, beam);
    if (jam) paintJamGround(p, proj, pose);
  }
  p.group(2000);
  paintAssembly(p, parts, pose.light);
  if (jam && !bare) paintJamTyre(p, proj, G, pose);
  paintHubs(p, proj, pose);
};

/** Painted lamp halos (canvas) for plates whose overlays cannot sit over inside actors (VD07 painted interiors). */
export const paintLampGlowCanvas = (p: Painter, proj: Proj, G: number, ambient = G) => {
  p.group(5000);
  LAMPS.forEach((l, i) => {
    const lv = lampAt(G, i);
    if (lv <= 0 || proj.rawDepth(l) < 0.5) return;
    const [x, y] = proj.P(l), k = proj.k(l);
    p.wash('#c9b08a', 60 * lv, blob(5100 + i, x, y, 2.0 * k, 1.5 * k, ambient / 30), 0.7, 0.4);
  });
};

/** Glass-pane region of the shop front (z = 0) for interior plates: the openings between mullions, rails and transom. */
export const PANES: [number, number, number, number][] = [
  [-3.0 + 0.04, -1.75 - 0.04, 0.05, 2.08], [-1.75 + 0.04, -0.5 - 0.04, 0.05, 2.08], [-0.5 + 0.04, 0.5 - 0.04, 0.05, 2.08],
  [0.5 + 0.04, 1.75 - 0.04, 0.05, 2.08], [1.75 + 0.04, 3.0 - 0.04, 0.05, 2.08], [-3.0 + 0.04, 3.0 - 0.04, 2.16, 2.5],
];
export const paneQuad = ([x0, x1, y0, y1]: [number, number, number, number]): V3[] => quadZ(0, x0, x1, y0, y1);
export {quadX};
