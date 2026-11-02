import {band, blob, capsule, ell, hardFill, inkLine, rectPts, solid, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import landData from './land.json';
import {lerp, ramp, type Painter, type Pt} from '../kit/painter';

// WDG-EP01-SHORT look frames (brief WDG-BRIEF-FILM-R1 decisions VD02/VD03/VD05/VD08; W3.1). Film-painted looks awaiting user approval,
// not Boss-hardened assets. Each paint function is a pure function of the plate clock `t` (seconds): `still` washes keep their seeds,
// ink boils through the Painter. Coordinates are 1080x1920 px, top-left. Caption band y 860-1248; all story art sits above y 860.

export const FPS = 30;
const W = 1080;
const H = 1920;
/** Estimated colour key (brief VD02); the look frames fix these. */
export const KEY = {nightDeep: '#0f1c2e', nightCanvas: '#27405c', lantern: '#e8a64d', dayPale: '#c9d3da', dayMid: '#8fa4b5'};

const full = rectPts(-120, -120, W + 120, H + 120);

// ---------------------------------------------------------------- LF-TENT (VD03): S01-B01-SH01 wall frame

/** Lantern anchor in px (design estimate, SB-R1.5): hangs off-axis (left of the ridge) on a slanted cord from the ridge; (x, y) is the bottom of its base. Small, the only warm light. */
export const LANTERN = {x: 400, y: 520};
export const TENT_FLOOR_Y = 1100;

/** Wind bow of the canvas: a ground-up wave, pure function of the ambient clock t (seconds). */
export const bowAt = (y: number, t: number, i: number) => {
  const rise = Math.max(0, Math.min(1, (TENT_FLOOR_Y - y) / TENT_FLOOR_Y));
  return 46 * rise * Math.sin(y * 0.0042 - t * 2.1 + i * 1.7) + 20 * rise * Math.sin(y * 0.011 - t * 3.3 + i);
};

/** Tent interior (SB-R1.4 inside view; SB-R1.5 user: "picture sits too high, black part too much"): the whole frame height is tent. Roof planes meet at the ridge (top centre,
 *  running toward the viewer); the far gable with the door faces us (base y 900); the wall-floor corner lines run from the gable base corners to the bottom frame corners;
 *  the groundsheet fills the lower half. No sky, snow, guy lines or stakes are visible. Estimates, px. */
export const TENT = {apex: [540, 300] as Pt, baseL: [215, 900] as Pt, baseR: [865, 900] as Pt, ridgeTop: [540, -90] as Pt, floorL: [-250, 1920] as Pt, floorR: [1330, 1920] as Pt};

export const paintTent = (p: Painter, t: number) => {
  const {apex: A, baseL: L, baseR: R, ridgeTop: RT, floorL: FL, floorR: FR} = TENT;
  const press = 0.5 + 0.5 * Math.sin(t * 1.6); // wind pressure, clock only
  washAt(p, 1, KEY.nightDeep, 255, full, 0.05, 0.2);
  // gable right edge pushed inward by the wind
  const bulge = 70 + 50 * press;
  const rEdge: Pt[] = Array.from({length: 9}, (_, j): Pt => {
    const u = j / 8;
    return [A[0] + (R[0] - A[0]) * u - bulge * Math.sin(Math.PI * u) ** 1.2, A[1] + (R[1] - A[1]) * u];
  });
  const leftPlane: Pt[] = [[-300, -120], [RT[0], -120], RT, A, L, FL, [-300, H + 60]];
  const rightPlane: Pt[] = [[W + 300, -120], [RT[0], -120], RT, A, ...rEdge, R, FR, [W + 300, H + 60]];
  const gable: Pt[] = [A, R, L];
  // canvas, lit from outside by cold snow-light: brightest on the far gable and toward the top
  hardFill(p, 2, '#3a669a', leftPlane);
  hardFill(p, 4, '#6e9dcb', gable);
  hardFill(p, 3, '#1b3250', rightPlane);
  washAt(p, 10, '#4a76a4', 120, [[-120, -120], [RT[0], -120], RT, A, [A[0] - 160, 600], [-120, 760]], 0.1, 0.6);
  washAt(p, 5, '#6a9bcb', 150, [A, [A[0] + 170, A[1] + 330], [A[0] - 170, A[1] + 330]], 0.2, 0.6);
  // wind belly: a clear swollen cloth lobe on the right wall, lit on its windward face, a dark crease below and behind it
  const bw = 150 + 40 * press;
  const belly: Pt[] = Array.from({length: 13}, (_, j): Pt => {
    const u = j / 12;
    return [rEdge[Math.min(8, Math.round(u * 8))][0] + 0 * u, 430 + u * 520];
  }).map(([, y], j, a): Pt => {
    const u = j / (a.length - 1);
    return [840 - 60 * u + bw * Math.sin(Math.PI * u) ** 0.8 * 0.9, y];
  });
  const bellyBack: Pt[] = Array.from({length: 13}, (_, j): Pt => [840 - 60 * (j / 12) - 40 * Math.sin(Math.PI * (j / 12)), 430 + (j / 12) * 520]);
  hardFill(p, 12, '#2d4d77', [...bellyBack, ...belly.slice().reverse()]);
  washAt(p, 8, '#9cc4ec', 110 + 40 * press, [...bellyBack.map(([x, y]): Pt => [x + 6, y + 8]), ...belly.slice().reverse().map(([x, y]): Pt => [x - 34, y - 6])], 0.3, 0.6);
  washAt(p, 9, '#050c16', 130 + 40 * press, [...belly.map(([x, y]): Pt => [x + 8, y]), [W + 120, 1000], [W + 120, 380]], 0.4, 0.6);
  p.ink(13, 'rotring', '#050b13', 2.2);
  p.brush.spline(belly, 0.25);
  // warm lantern pool: amber (no green cast: warm orange, higher opacity so the blue canvas does not mix to grey-green)
  washAt(p, 6, '#d2452e', 150, ell(LANTERN.x, LANTERN.y - 50, 110, 125, 18), 0.8, 0.9);
  washAt(p, 7, '#c8452a', 110, ell(LANTERN.x + 20, 1010, 190, 44, 16), 0.8, 0.9);

  // ridge pole and ridge seam: heavy ink from the top edge to the gable apex; gable edges
  p.ink(20, 'rotring', '#050b13', 3.6);
  p.brush.line(RT[0], -90, A[0], A[1]);
  p.brush.line(A[0] - 11, -90, A[0] - 11, A[1] - 4);
  p.brush.line(A[0] + 11, -90, A[0] + 11, A[1] - 4);
  p.brush.line(A[0], A[1], L[0], L[1]);
  p.brush.spline(rEdge, 0.2);
  // roof seams, parallel to the ridge and converging on the gable; right seams belly out with the wind; snow-light leaks through the stitch holes
  const seamFrac = [0.3, 0.62, 0.85];
  [-1, 1].forEach((side, si) => {
    const base = side < 0 ? L : R;
    seamFrac.forEach((f, k) => {
      const topX = RT[0] + side * f * 700;
      const gx = A[0] + (base[0] - A[0]) * f, gy = A[1] + (base[1] - A[1]) * f;
      const pt = (u: number): Pt => {
        const bl = side > 0 ? -bulge * 1.1 * Math.sin(Math.PI * u) * (1 - 0.35 * f) : 0.0;
        return [topX + (gx - topX) * u + bl + 0.12 * bowAt(-90 + u * (gy + 90), t, si * 2 + k), -90 + u * (gy + 90)];
      };
      p.ink(21, 'rotring', '#07101b', 1.7);
      p.brush.spline(Array.from({length: 8}, (_, j) => pt(j / 7)), 0.1);
      for (let j = 0; j < 28; j++) {
        const u = (j + 0.5) / 28;
        const [sx, sy] = pt(u);
        if (sy > 20 && sy < gy) hardFill(p, 100 + si * 90 + k * 30 + j, '#b4d6f4', ell(sx + 6, sy, 2.2 + u * 1.4, 1.7, 6));
      }
    });
  });
  // hem and seam across the gable
  p.ink(22, 'rotring', '#0b1828', 1.2);
  p.brush.line(A[0] - 40, A[1] + 110, L[0] + 90, L[1] - 20);
  p.brush.line(A[0] + 20, A[1] + 110, R[0] - 150, R[1] - 34);

  // door flap in the gable (centre-right): free edge bowed by wind, three tie cords with loops
  const fx = 575, DT = 560, DB = 900, DR = 725;
  const edge = (u: number): Pt => [fx + 12 * Math.sin(u * 3.1) + 0.4 * bowAt(DT + u * (DB - DT), t, 2), DT + u * (DB - DT)];
  const flapEdge: Pt[] = Array.from({length: 9}, (_, j) => edge(j / 8));
  hardFill(p, 30, '#5280b0', [[fx, DT - 6], [DR, DT - 6], [DR, DB], ...flapEdge.slice().reverse()]);
  washAt(p, 31, '#a9cdf0', 60, [[fx + 18, DT + 8], [DR - 8, DT + 8], [DR - 8, DB - 10], [fx + 22, DB - 10]], 0.1, 0.5);
  p.ink(32, 'rotring', '#050b13', 2.6);
  p.brush.spline(flapEdge, 0.25);
  p.brush.line(fx, DT - 6, DR, DT - 6);
  p.brush.line(DR, DT - 6, DR, DB);
  [640, 730, 820].forEach((ty, i) => {
    const u = (ty - DT) / (DB - DT);
    const [ex, ey] = edge(u);
    const sway = 4 * Math.sin(t * 3 + i * 1.3);
    p.ink(34, 'rotring', '#e0e8ee', 1.9);
    p.brush.spline([[ex - 38, ey], [ex - 16, ey + 7 + sway * 0.4], [ex + 16, ey + 6], [ex + 44, ey + 22 + sway]], 0.3);
    p.ink(35, 'rotring', '#050b13', 1.6);
    p.brush.spline(ell(ex - 38, ey, 8, 10, 10), 0.2);
  });

  // floor: groundsheet (readable dark blue, not black) over trampled snow, from the gable base to the bottom edge; the walls meet it along the corner lines
  hardFill(p, 40, '#14243a', [L, R, FR, FL]);
  hardFill(p, 41, '#1d3450', [[L[0] + 50, L[1] + 12], [R[0] - 50, R[1] + 12], [1130, H + 60], [-60, H + 60]]);
  washAt(p, 42, '#4a627c', 110, blob(3, 420, 1090, 250, 46, 0), 0.4, 0.6); // trampled, lighter snow showing through
  washAt(p, 43, '#3a516a', 90, blob(9, 760, 1030, 170, 30, 0), 0.4, 0.6);
  washAt(p, 46, '#2a4260', 90, blob(11, 470, 1480, 340, 90, 0), 0.5, 0.7); // soft body-worn sag
  p.ink(44, 'rotring', '#050b13', 2.6);
  p.brush.line(L[0], L[1], FL[0], FL[1]);
  p.brush.line(R[0], R[1], FR[0], FR[1]);
  p.brush.line(L[0], L[1], R[0], R[1]);
  p.ink(45, 'rotring', '#34506e', 1.5);
  p.brush.line(L[0] + 50, L[1] + 12, -60, H);
  p.brush.line(R[0] - 50, R[1] + 12, 1130, H);
  // groundsheet seams and wrinkles converging on the gable (vanishing point 540,700), kept faint toward the bottom edge
  [100, 330, 750, 980].forEach((xb, i) => {
    const x0 = 540 + (xb - 540) * (200 / 1220), x1 = 540 + (xb - 540) * (1650 / 1220);
    p.ink(47 + i, 'rotring', '#2b4766', 1.3);
    p.brush.spline([[x0, 900], [(x0 + x1) / 2 + 6 * Math.sin(i * 2), 1280], [x1, 1650]], 0.3);
  });
  [[250, 1230, 160], [830, 1210, 140], [560, 1560, 220], [180, 1600, 120], [900, 1640, 130]].forEach(([x, y, w], i) => {
    washAt(p, 90 + i, '#3b5878', 70, ell(x, y, w, 7, 10), 0.3, 0.4);
    washAt(p, 95 + i, '#07101b', 60, ell(x + 10, y + 12, w, 6, 10), 0.3, 0.4);
  });
  // tie-down tabs along the wall-floor corner lines, bigger toward the viewer
  [[0, -1], [0, 1], [0.25, -1], [0.25, 1], [0.46, -1], [0.46, 1]].forEach(([f, s], i) => {
    const b = s < 0 ? L : R, e = s < 0 ? FL : FR;
    const x = b[0] + (e[0] - b[0]) * f, y = b[1] + (e[1] - b[1]) * f;
    const k = 1 + f * 2.4, w = 20 * k;
    hardFill(p, 70 + i, '#9aa8b4', [[x - w * 0.5, y - 7 * k], [x + w * 0.5, y - 7 * k], [x + w * 0.5 + s * 7 * k, y + 30 * k], [x - w * 0.5 + s * 7 * k, y + 30 * k]]);
    p.ink(76 + i, 'rotring', '#050b13', 1.6 * k);
    p.brush.spline(ell(x + s * 4 * k, y + 34 * k, 10 * k, 8 * k, 10), 0.2);
    p.brush.line(x - w * 0.5, y - 7 * k, x + w * 0.5, y - 7 * k);
  });
  // bedroll along the right wall, pack at the left, empty tin below the door; clear floor centre-left for the man
  const roll: Pt[] = [[690, 1190], [820, 1150], [1050, 1330], [1075, 1470], [940, 1500], [730, 1330]];
  hardFill(p, 80, '#34495f', roll);
  washAt(p, 81, '#4d6680', 150, [[715, 1195], [815, 1165], [1000, 1325], [900, 1340], [750, 1290]], 0.2, 0.5);
  washAt(p, 88, '#0a1522', 110, [[760, 1340], [940, 1490], [1060, 1470], [1040, 1400], [930, 1420]], 0.3, 0.5);
  p.ink(82, 'rotring', '#050b13', 2.2);
  p.brush.spline([...roll, roll[0]], 0.15);
  p.brush.line(940, 1300, 975, 1430);
  p.brush.line(880, 1250, 912, 1375);
  hardFill(p, 83, '#243752', blob(6, 200, 1330, 150, 112, 0));
  washAt(p, 89, '#4a6482', 100, blob(7, 170, 1290, 80, 50, 0), 0.3, 0.5);
  p.ink(84, 'rotring', '#050b13', 2.2);
  p.brush.spline(blob(6, 200, 1330, 150, 112, 0), 0.15);
  p.brush.line(110, 1270, 280, 1310);
  p.brush.line(120, 1390, 290, 1400);
  hardFill(p, 85, '#8c98a4', rectPts(612, 960, 678, 1032));
  hardFill(p, 86, '#2a313a', ell(645, 960, 33, 11, 10));
  p.ink(87, 'rotring', '#050b13', 1.8);
  p.brush.spline(ell(645, 960, 33, 11, 10), 0.2);
  p.brush.line(612, 960, 612, 1032);
  p.brush.line(678, 960, 678, 1032);

  // lantern: hangs off the ridge axis (left) on a slanted cord from the ridge; small, near out
  const {x, y} = LANTERN;
  p.ink(53, 'rotring', '#241a12', 1.6);
  p.brush.spline([[RT[0] - 4, -10], [(RT[0] + x) / 2, 140], [x, y - 118]], 0.3);
  hardFill(p, 50, '#241a12', rectPts(x - 30, y - 10, x + 30, y));
  hardFill(p, 51, '#d9953f', rectPts(x - 23, y - 88, x + 23, y - 10));
  hardFill(p, 52, '#f6d79a', rectPts(x - 10, y - 70, x + 10, y - 28));
  hardFill(p, 55, '#241a12', [[x - 30, y - 88], [x + 30, y - 88], [x + 18, y - 108], [x - 18, y - 108]]);
  p.ink(54, 'rotring', '#241a12', 1.3);
  p.brush.spline([[x - 18, y - 106], [x, y - 140], [x + 18, y - 106]], 0.5);
  p.brush.line(x - 23, y - 88, x - 23, y - 10);
  p.brush.line(x + 23, y - 88, x + 23, y - 10);
  // snow dust drifting in the draught over the floor, wave-driven
  for (let i = 0; i < 8; i++) {
    const fx2 = 220 + hash(300 + i) * 640, fy = 1000 + hash(310 + i) * 380 + 6 * Math.sin(t * 2 + i);
    washAt(p, 60 + i, '#9db4c9', 90, ell(fx2, fy, 22 + hash(320 + i) * 20, 5, 10), 0.3, 0.4);
  }
};

// ---------------------------------------------------------------- LF-SNOW (VD05): S01-B02 high-angle plan of the ring (morning)

/** Ring in px: closed ellipse around the tent, ~65 deg down-look so the circle foreshortens to ry/rx = 0.8 (estimate). */
export const RING = {cx: 540, cy: 590, rx: 380, ry: 270, prints: 30};

/**
 * `reveal` (R2.6, user: the ring should grow like a person walking it) = prints laid so far, in walking order from the door side (i = 0, clockwise on
 * screen); a fractional part fades the newest in. Default = all `RING.prints` (the closed ring; look frame `WDG-LF-SNOW` and the shot's last frames).
 */
export const paintSnow = (p: Painter, t: number, reveal: number = RING.prints) => {
  // dawn snow: mid blue-grey (the lower third is darkened by the overlay shade)
  washAt(p, 1, '#7f97ab', 255, full, 0.1, 0.4);
  washAt(p, 2, '#97aebf', 120, blob(2, 540, 620, 600, 440, 0), 0.8, 0.8);
  // forest edge across the top (far side of the clearing): dark conifer silhouettes behind haze
  const trees: Pt[] = [[-60, 260]];
  for (let i = 0; i < 14; i++) {
    const cx = -20 + i * 82 + hash(70 + i) * 30, h = 90 + hash(80 + i) * 110;
    trees.push([cx - 34, 250], [cx, 250 - h], [cx + 34, 250]);
  }
  trees.push([1140, 250], [1140, -80], [-60, -80]);
  washAt(p, 3, '#1d2f3f', 240, trees, 0.2, 0.5);
  washAt(p, 4, '#9fb3c4', 120, band(4, 235, 300, 20), 0.5, 0.6);
  // drift shadows
  washAt(p, 5, '#5e768c', 120, blob(8, 640, 850, 440, 70, 0), 0.5, 0.6);
  // tent seen from above (W3.1 rev 2, user: it read as a box): ridge along x, two roof planes lit/shade, door gable at the right end, guy lines to stakes
  const {cx, cy} = RING;
  const L = 175, D = 88; // half ridge length, roof half depth (px, estimate)
  const ridgeL: Pt = [cx - L, cy], ridgeR: Pt = [cx + L, cy];
  // snow mound at the left (closed) end; the right end is the door and stays open
  washAt(p, 8, '#dfe8ee', 200, blob(9, cx - L - 24, cy, 66, 60, 0), 0.4, 0.5);
  // roof plane shade (near side, away from the morning light) and lit plane (far side), eaves slightly wider than the ridge
  solid(p, 6, '#2b3d54', [[cx - L, cy], [cx + L, cy], [cx + L + 26, cy + D + 14], [cx - L - 26, cy + D + 14]], 8, 0.08, 0.15);
  solid(p, 7, '#f1f6f9', [[cx - L, cy], [cx + L, cy], [cx + L + 26, cy - D - 14], [cx - L - 26, cy - D - 14]], 8, 0.08, 0.15);
  // snow load along the lit eave and a drift against the shade eave
  washAt(p, 15, '#eef3f6', 200, band(15, cy - D - 22, cy - D - 4, 12), 0.3, 0.4);
  washAt(p, 16, '#9db1c2', 150, blob(16, cx - 20, cy + D + 30, 190, 22, 0), 0.4, 0.5);
  // door gable (right end): dark opening, flap rolled back to one side
  solid(p, 10, '#070d14', [[cx + L, cy - 6], [cx + L + 34, cy - 44], [cx + L + 34, cy + 52], [cx + L, cy + 6]], 8, 0.05, 0.1);
  washAt(p, 11, '#b9c9d6', 235, [[cx + L + 34, cy - 44], [cx + L + 66, cy - 76], [cx + L + 62, cy - 26], [cx + L + 34, cy - 2]], 0.15, 0.4);
  // ink: roof outline, ridge pole (heavy, extends past both gables), door edges
  p.ink(11, 'rotring', '#16222f', 2.4);
  inkLine(p, 12, [[cx - L - 26, cy - D - 14], [cx + L + 26, cy - D - 14], [cx + L, cy], [cx + L + 26, cy + D + 14], [cx - L - 26, cy + D + 14], [cx - L, cy]], {color: '#16222f', weight: 2.4, closed: true});
  p.ink(13, 'rotring', '#0b141f', 5.5);
  p.brush.line(ridgeL[0] - 40, cy, ridgeR[0] + 44, cy);
  p.ink(14, 'rotring', '#16222f', 1.4);
  inkLine(p, 17, [[cx + L, cy - 6], [cx + L + 34, cy - 44], [cx + L + 34, cy + 52], [cx + L, cy + 6]], {color: '#16222f', weight: 1.4, closed: true});
  inkLine(p, 18, [[cx + L + 34, cy - 44], [cx + L + 66, cy - 76], [cx + L + 62, cy - 26], [cx + L + 34, cy - 2]], {color: '#16222f', weight: 1.2, closed: true});
  // ridge highlight on the lit side
  p.ink(19, 'rotring', '#f4f8fb', 1.6);
  p.brush.line(cx - L + 6, cy - 5, cx + L - 6, cy - 5);
  // guy lines: ridge ends out along the axis, four eave corners out diagonally, each to a stake (small dark post + snow dot)
  const stakes: [Pt, Pt][] = [
    [[ridgeL[0] - 40, cy], [cx - L - 130, cy]],
    [[ridgeR[0] + 44, cy], [cx + L + 150, cy + 24]],
    [[cx - L - 26, cy - D - 14], [cx - L - 105, cy - D - 74]],
    [[cx + L + 26, cy - D - 14], [cx + L + 100, cy - D - 70]],
    [[cx - L - 26, cy + D + 14], [cx - L - 105, cy + D + 74]],
    [[cx + L + 26, cy + D + 14], [cx + L + 100, cy + D + 74]],
  ];
  p.ink(20, 'rotring', '#16222f', 1.8);
  stakes.forEach(([a, b]) => p.brush.line(a[0], a[1], b[0], b[1]));
  stakes.forEach(([, b], i) => {
    washAt(p, 21 + i, '#eef3f6', 200, ell(b[0], b[1] + 5, 14, 6, 8), 0.3, 0.4);
    hardFill(p, 90 + i, '#16222f', rectPts(b[0] - 3, b[1] - 9, b[0] + 3, b[1] + 3));
  });
  // the ring: closed ellipse of boot-print pairs, alternating left/right foot, long axis along the walk (no track leaves or enters)
  p.ink(30, 'rotring', '#1f3042', 0.9);
  for (let i = 0; i < RING.prints; i++) {
    const vis = Math.min(1, reveal - i);
    if (vis <= 0) break;
    const u = (i / RING.prints) * Math.PI * 2;
    const px = RING.cx + RING.rx * Math.cos(u), py = RING.cy + RING.ry * Math.sin(u);
    const tx = -RING.rx * Math.sin(u), ty = RING.ry * Math.cos(u);
    const tl = Math.hypot(tx, ty), ang = Math.atan2(ty, tx);
    const side = i % 2 === 0 ? 1 : -1;
    const ox = (-ty / tl) * 12 * side, oy = (tx / tl) * 12 * side;
    const near = 0.9 + 0.3 * (Math.sin(u) + 1) / 2;
    washAt(p, 100 + i, '#2e4660', 230 * vis, ell(px + ox, py + oy, 34 * near, 16 * near, 12, ang), 0.2, 0.4);
    if (vis >= 1) inkLine(p, 200 + i, ell(px + ox, py + oy, 34 * near, 16 * near, 12, ang), {color: '#16222f', weight: 0.7});
  }
  // blown snow streaks, slow (ambient)
  for (let i = 0; i < 6; i++) {
    const yy = 380 + hash(400 + i) * 600, xx = ((hash(410 + i) * 1500 + t * 90) % 1500) - 200;
    washAt(p, 300 + i, '#d6e2eb', 60, ell(xx, yy, 60 + hash(420 + i) * 50, 3, 10), 0.4, 0.4);
  }
};

// ---------------------------------------------------------------- LF-DOC (VD08a): S02-B01 dawn boreal lake, no people

const HORIZON = 600;
export const paintDoc = (p: Painter, t: number) => {
  // sky: pale overcast, two strata, a pale lift at the horizon (no warm light)
  washAt(p, 1, KEY.dayPale, 255, rectPts(-120, -120, W + 120, HORIZON + 40), 0.2, 0.3);
  washAt(p, 2, '#aebdc8', 190, band(2, -60, 330, 40), 0.5, 0.6);
  washAt(p, 3, '#e3e6e5', 200, blob(3, 540, HORIZON - 60, 620, 90, t), 0.5, 0.6);
  // far shore: low hills, then forest of conifers
  washAt(p, 4, '#7d93a2', 200, [[-120, HORIZON - 60], ...Array.from({length: 9}, (_, i): Pt => [-120 + i * 170, HORIZON - 90 - hash(30 + i) * 60]), [1200, HORIZON - 70], [1200, HORIZON], [-120, HORIZON]], 0.3, 0.5);
  const forest: Pt[] = [[-60, HORIZON]];
  for (let i = 0; i < 26; i++) {
    const cx = -40 + i * 46 + hash(40 + i) * 20, h = 90 + hash(60 + i) * 110;
    forest.push([cx - 22, HORIZON], [cx, HORIZON - h], [cx + 22, HORIZON]);
  }
  forest.push([1140, HORIZON]);
  solid(p, 5, '#34495c', forest, 6, 0.1, 0.2);
  washAt(p, 6, '#dfe5e7', 150, band(6, HORIZON - 40, HORIZON + 6, 14), 0.5, 0.6);
  // lake: still water, darker toward the viewer; mirrored forest as soft vertical smears
  washAt(p, 7, '#7e95a5', 255, rectPts(-120, HORIZON, W + 120, H + 120), 0.1, 0.4);
  washAt(p, 8, '#4f6676', 230, rectPts(-120, HORIZON + 180, W + 120, H + 120), 0.4, 0.5);
  washAt(p, 20, '#2b4052', 70, forest.map(([x, y]): Pt => [x, 2 * HORIZON - y + 10]), 0.9, 0.8);
  // water: a few long still ripples that barely drift (ambient)
  for (let i = 0; i < 8; i++) {
    const yy = HORIZON + 80 + i * 70 + 4 * Math.sin(t * 0.8 + i);
    washAt(p, 50 + i, '#b7c8d3', 90, ell(120 + hash(110 + i) * 840, yy, 130 + hash(120 + i) * 120, 3, 10), 0.3, 0.4);
  }
  // near shore, bottom: dark ground and dark ground (texture only)
  washAt(p, 70, '#1d2c38', 245, [[-120, 1500], [250, 1440], [600, 1480], [1200, 1420], [1200, H + 100], [-120, H + 100]], 0.2, 0.5);
};

// ---------------------------------------------------------------- LF-MAP (VD09): S02-B02 North America plate (Natural Earth 110m land, `land.json`)

type LL = [number, number]; // [lon, lat] degrees
/** Natural Earth 1:110m land (public domain, `land.json`, baked by scripts/wendigo/bake-land.py; NOTICE in src/painted/bloop/NOTICE): lon/lat rings of northern North America, cut at lat 14. */
const LAND: LL[][] = landData.rings.map((r) => Array.from({length: r.length / 2}, (_, i): LL => [r[2 * i], r[2 * i + 1]]));
const LAKES: LL[][] = [
  [[-92.1, 46.8], [-90, 47.8], [-88.3, 48.9], [-85, 47.9], [-84.5, 46.6], [-87.5, 46.5], [-89, 46.9]], // Superior
  [[-87.8, 41.8], [-87.7, 44], [-86.3, 45.8], [-85, 45.8], [-86.3, 44], [-86.4, 42.2]], // Michigan
  [[-84.3, 46], [-82, 46], [-81.5, 44.8], [-81.7, 43.3], [-83, 44], [-83.5, 45.5]], // Huron
  [[-83.4, 41.7], [-82, 41.4], [-80, 42.1], [-78.9, 42.9], [-80.5, 42.8], [-82.5, 42]], // Erie
  [[-79.8, 43.5], [-77.5, 43.3], [-76.3, 43.5], [-76.5, 44.1], [-79, 43.8]], // Ontario
];
/** Soft highlight: sub-Arctic Canada and the Great Lakes band, drawn inside the land only (no tribal boundary, brief CL / delivery cultural framing). */
const REGION: LL[] = [
  [-122, 57], [-110, 60.5], [-100, 59.5], [-95, 57], [-90, 54], [-84, 52.3], [-79, 50.3], [-72, 50], [-68, 48.5], [-71, 46],
  [-75, 44.7], [-81, 44.5], [-84, 46], [-88, 48.5], [-92, 47], [-97, 48.8], [-104, 49], [-112, 49], [-118, 49.5], [-122, 52],
];

/** Lambert conformal conic (parallels 33/45, centre lon -96) fitted so the land bounding box fills x 150-930, y 170-700 (scene sheet R2.1: marker above, name card below), scale set by the limiting side, centred in that box. */
const MAP_BOX = {x0: 150, x1: 930, y0: 170, y1: 700};
const proj = (() => {
  const r = Math.PI / 180, p1 = 33 * r, p2 = 45 * r, l0 = -96 * r;
  const n = Math.log(Math.cos(p1) / Math.cos(p2)) / Math.log(Math.tan(Math.PI / 4 + p2 / 2) / Math.tan(Math.PI / 4 + p1 / 2));
  const F = (Math.cos(p1) * Math.tan(Math.PI / 4 + p1 / 2) ** n) / n;
  const rho = (lat: number) => F / Math.tan(Math.PI / 4 + (lat * r) / 2) ** n;
  const raw = ([lon, lat]: LL): Pt => [rho(lat) * Math.sin(n * (lon * r - l0)), rho(lat) * Math.cos(n * (lon * r - l0))];
  const all = LAND.flat().map(raw);
  const xs = all.map((q) => q[0]), ys = all.map((q) => q[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const k = Math.min((MAP_BOX.x1 - MAP_BOX.x0) / (x1 - x0), (MAP_BOX.y1 - MAP_BOX.y0) / (y1 - y0));
  const ox = (MAP_BOX.x0 + MAP_BOX.x1) / 2 - ((x0 + x1) / 2) * k, oy = (MAP_BOX.y0 + MAP_BOX.y1) / 2 - ((y0 + y1) / 2) * k;
  return (c: LL): Pt => { const [x, y] = raw(c); return [ox + x * k, oy + y * k]; };
})();
/** Great Lakes centre in px: the push target. */
export const MAP_FOCUS = (() => { const [x, y] = proj([-84, 45.5]); return {x, y}; })();

export const paintMap = (p: Painter, t: number) => {
  // water: dark blue-grey, a little lighter near the land
  washAt(p, 1, '#2c4256', 255, full, 0.1, 0.4);
  washAt(p, 2, '#3a5368', 110, blob(2, 540, 420, 760, 420, t * 0.2), 0.8, 0.8);
  const rings = LAND.map((l) => l.map(proj));
  // land: pale, ink coast (the real data; the mainland ring is the one with the most points)
  rings.forEach((land, i) => hardFill(p, 3 + 100 * i, '#c9d3da', land));
  // highlight: muted warm-grey, soft edge, on land only
  washAt(p, 5, '#b7aa98', 190, REGION.map(proj), 0.5, 0.7);
  // lakes cut back out in the water colour
  LAKES.forEach((l, i) => solid(p, 6 + i, '#3a5368', l.map(proj), 4, 0.1, 0.2));
  // coast: straight ink segments (a spline through ~900 data points overshoots and drifts off the fill); the cut edge of the isthmus at lat 14 is not inked
  p.ink(2000, 'rotring', '#16222f', 1.6);
  LAND.forEach((ring) => ring.forEach((a, j) => {
    const b = ring[(j + 1) % ring.length];
    if (a[1] > 14.01 || b[1] > 14.01) { const [x1, y1] = proj(a), [x2, y2] = proj(b); p.brush.line(x1, y1, x2, y2); }
  }));
  LAKES.forEach((l, i) => inkLine(p, 30 + i, l.map(proj), {color: '#16222f', weight: 1.0}));
};

// ---------------------------------------------------------------- LF-TENT_r6 (VD03d): r4 composition, lantern moved to the floor

/** r4 geometry (VD03b, apex 540,200, base y 640), reconstructed after the r4 code was overwritten by r5; checked against LF-TENT_r4.png. */
export const TENT6 = {apex: [540, 200] as Pt, baseL: [250, 640] as Pt, baseR: [830, 640] as Pt, ridgeTop: [540, -90] as Pt, footL: [20, 830] as Pt, footR: [1060, 830] as Pt};
/** Lantern (VD03d): stands on the groundsheet at the foot of the left wall; (x, y) is the bottom of its base. Estimate. */
export const LANTERN6 = {x: 255, y: 850};

export const paintTentR6 = (p: Painter, t: number) => {
  const {apex: A, baseL: L, baseR: R, ridgeTop: RT, footL: FL, footR: FR} = TENT6;
  const press = 0.5 + 0.5 * Math.sin(t * 1.6);
  washAt(p, 1, KEY.nightDeep, 255, full, 0.05, 0.2);
  const bulge = 40 + 30 * press;
  const rEdge: Pt[] = Array.from({length: 9}, (_, j): Pt => {
    const u = j / 8;
    return [A[0] + (R[0] - A[0]) * u - bulge * Math.sin(Math.PI * u) ** 1.2, A[1] + (R[1] - A[1]) * u];
  });
  hardFill(p, 2, '#3a669a', [[-300, -120], [RT[0], -120], RT, A, L, FL, [-300, 860]]);
  hardFill(p, 4, '#6e9dcb', [A, R, L]);
  hardFill(p, 3, '#1b3250', [[W + 300, -120], [RT[0], -120], RT, A, ...rEdge, R, FR, [W + 300, 860]]);
  washAt(p, 10, '#4a76a4', 120, [[-120, -120], [RT[0], -120], RT, A, [A[0] - 120, 420], [-120, 560]], 0.1, 0.6);
  washAt(p, 5, '#6a9bcb', 150, [A, [A[0] + 130, A[1] + 230], [A[0] - 130, A[1] + 230]], 0.2, 0.6);
  // wind belly: pale lobe on the right wall beside the gable, swelling with the clock
  washAt(p, 8, '#9cc4ec', 120 + 30 * press, blob(14, 760 + 20 * press, 470, 100 + 30 * press, 120, 0), 0.4, 0.6);
  washAt(p, 9, '#050c16', 120, blob(15, 900, 520, 150, 190, 0), 0.5, 0.6);
  // warm lantern pool low on the left wall (raking from low frame-left) and on the floor; warm orange-red, no green cast
  washAt(p, 6, '#e0552e', 150, blob(16, 120, 735, 100, 120, 0), 0.8, 0.9);
  washAt(p, 7, '#c8452a', 90, ell(LANTERN6.x + 30, 835, 170, 30, 16), 0.8, 0.9);
  // ridge pole and gable edges
  p.ink(20, 'rotring', '#050b13', 3.6);
  p.brush.line(RT[0], -90, A[0], A[1]);
  p.brush.line(A[0] - 11, -90, A[0] - 11, A[1] - 4);
  p.brush.line(A[0] + 11, -90, A[0] + 11, A[1] - 4);
  p.brush.line(A[0], A[1], L[0], L[1]);
  p.brush.spline(rEdge, 0.2);
  // seams with snow-light stitch holes
  [-1, 1].forEach((side, si) => {
    const base = side < 0 ? L : R;
    [0.3, 0.62, 0.85].forEach((f, k) => {
      const topX = RT[0] + side * f * 700;
      const gx = A[0] + (base[0] - A[0]) * f, gy = A[1] + (base[1] - A[1]) * f;
      const pt = (u: number): Pt => {
        const bl = side > 0 ? -bulge * 1.1 * Math.sin(Math.PI * u) * (1 - 0.35 * f) : 0;
        return [topX + (gx - topX) * u + bl + 0.12 * bowAt(-90 + u * (gy + 90), t, si * 2 + k), -90 + u * (gy + 90)];
      };
      p.ink(21, 'rotring', '#07101b', 1.7);
      p.brush.spline(Array.from({length: 8}, (_, j) => pt(j / 7)), 0.1);
      for (let j = 0; j < 22; j++) {
        const u = (j + 0.5) / 22;
        const [sx, sy] = pt(u);
        if (sy > 20 && sy < gy) hardFill(p, 100 + si * 90 + k * 30 + j, '#b4d6f4', ell(sx + 6, sy, 2.2 + u * 1.4, 1.7, 6));
      }
    });
  });
  // door flap (centre-right), free edge bowed, three ties
  const fx = 555, DT = 412, DB = 637, DR = 690;
  const edge = (u: number): Pt => [fx + 8 * Math.sin(u * 3.1) + 0.3 * bowAt(DT + u * (DB - DT), t, 2), DT + u * (DB - DT)];
  const flapEdge: Pt[] = Array.from({length: 9}, (_, j) => edge(j / 8));
  hardFill(p, 30, '#5280b0', [[fx, DT - 4], [DR, DT - 4], [DR, DB], ...flapEdge.slice().reverse()]);
  washAt(p, 31, '#a9cdf0', 60, [[fx + 14, DT + 6], [DR - 6, DT + 6], [DR - 6, DB - 8], [fx + 16, DB - 8]], 0.1, 0.5);
  p.ink(32, 'rotring', '#050b13', 2.2);
  p.brush.spline(flapEdge, 0.25);
  p.brush.line(fx, DT - 4, DR, DT - 4);
  p.brush.line(DR, DT - 4, DR, DB);
  [470, 540, 600].forEach((ty, i) => {
    const [ex, ey] = edge((ty - DT) / (DB - DT));
    const sway = 3 * Math.sin(t * 3 + i * 1.3);
    p.ink(34, 'rotring', '#e0e8ee', 1.7);
    p.brush.spline([[ex - 28, ey], [ex - 12, ey + 5 + sway * 0.4], [ex + 12, ey + 5], [ex + 34, ey + 16 + sway]], 0.3);
    p.ink(35, 'rotring', '#050b13', 1.4);
    p.brush.spline(ell(ex - 28, ey, 6, 8, 10), 0.2);
  });
  // ground: dark below the sheet, readable groundsheet and lighter trampled strip
  hardFill(p, 38, '#0a1522', rectPts(-120, 820, W + 120, H + 120));
  hardFill(p, 40, '#14243a', [L, R, FR, [1080, 900], [0, 900], FL]);
  hardFill(p, 41, '#1d3450', [[300, 650], [790, 650], [1000, 900], [80, 900]]);
  washAt(p, 42, '#4a627c', 110, blob(3, 420, 720, 230, 40, 0), 0.4, 0.6);
  washAt(p, 43, '#3a516a', 90, blob(9, 760, 790, 160, 26, 0), 0.4, 0.6);
  p.ink(44, 'rotring', '#050b13', 2.6);
  p.brush.line(L[0], L[1], FL[0], FL[1]);
  p.brush.line(R[0], R[1], FR[0], FR[1]);
  p.brush.line(L[0], L[1], R[0], R[1]);
  // tie-down tabs at the corners
  [[L, -1, 0], [R, 1, 0], [FL, -1, 1], [FR, 1, 1]].forEach(([b, , big], i) => {
    const [x, y] = b as Pt; const k = big ? 1.5 : 1, w = 20 * k;
    hardFill(p, 70 + i, '#9aa8b4', [[x - w * 0.5, y - 7 * k], [x + w * 0.5, y - 7 * k], [x + w * 0.5, y + 22 * k], [x - w * 0.5, y + 22 * k]]);
    p.ink(76 + i, 'rotring', '#050b13', 1.5 * k);
    p.brush.line(x - w * 0.5, y - 7 * k, x + w * 0.5, y - 7 * k);
  });
  // bedroll right, pack left (moved up so the lantern has the floor beside it), empty tin under the door
  const roll: Pt[] = [[705, 693], [785, 687], [1030, 862], [960, 874]];
  hardFill(p, 80, '#34495f', roll);
  washAt(p, 81, '#4d6680', 150, [[720, 696], [780, 692], [980, 850], [940, 860]], 0.2, 0.5);
  p.ink(82, 'rotring', '#050b13', 2);
  p.brush.spline([...roll, roll[0]], 0.15);
  hardFill(p, 83, '#243752', blob(6, 120, 770, 90, 62, 0));
  p.ink(84, 'rotring', '#050b13', 2);
  p.brush.spline(blob(6, 120, 770, 90, 62, 0), 0.15);
  hardFill(p, 85, '#8c98a4', rectPts(590, 715, 624, 748));
  hardFill(p, 86, '#2a313a', ell(607, 715, 17, 6, 10));
  p.ink(87, 'rotring', '#050b13', 1.6);
  p.brush.line(590, 715, 590, 748);
  p.brush.line(624, 715, 624, 748);
  // lantern on the floor
  const {x, y} = LANTERN6;
  hardFill(p, 50, '#241a12', rectPts(x - 30, y - 10, x + 30, y));
  hardFill(p, 51, '#d9953f', rectPts(x - 23, y - 88, x + 23, y - 10));
  hardFill(p, 52, '#f6d79a', rectPts(x - 10, y - 70, x + 10, y - 28));
  hardFill(p, 55, '#241a12', [[x - 30, y - 88], [x + 30, y - 88], [x + 18, y - 108], [x - 18, y - 108]]);
  p.ink(54, 'rotring', '#241a12', 1.3);
  p.brush.spline([[x - 18, y - 106], [x, y - 140], [x + 18, y - 106]], 0.5);
  p.brush.line(x - 23, y - 88, x - 23, y - 10);
  p.brush.line(x + 23, y - 88, x + 23, y - 10);
  for (let i = 0; i < 6; i++) {
    const fx2 = 300 + hash(300 + i) * 560, fy = 680 + hash(310 + i) * 190 + 5 * Math.sin(t * 2 + i);
    washAt(p, 60 + i, '#9db4c9', 90, ell(fx2, fy, 20 + hash(320 + i) * 18, 4, 10), 0.3, 0.4);
  }
};

// ---------------------------------------------------------------- LF-TENT_r7 (VD03e): lantern light cleaned, lower ground lifted to ~45 % dark

/** r7 (VD03e): lantern position unchanged from r6. Estimate. */
export const LANTERN7 = LANTERN6;

export const paintTentR7 = (p: Painter, t: number) => {
  const {apex: A, baseL: L, baseR: R, ridgeTop: RT, footL: FL, footR: FR} = TENT6;
  const press = 0.5 + 0.5 * Math.sin(t * 1.6);
  washAt(p, 1, KEY.nightDeep, 255, full, 0.05, 0.2);
  const bulge = 40 + 30 * press;
  const rEdge: Pt[] = Array.from({length: 9}, (_, j): Pt => {
    const u = j / 8;
    return [A[0] + (R[0] - A[0]) * u - bulge * Math.sin(Math.PI * u) ** 1.2, A[1] + (R[1] - A[1]) * u];
  });
  hardFill(p, 2, '#3a669a', [[-300, -120], [RT[0], -120], RT, A, L, FL, [-300, 860]]);
  hardFill(p, 4, '#6e9dcb', [A, R, L]);
  hardFill(p, 3, '#1b3250', [[W + 300, -120], [RT[0], -120], RT, A, ...rEdge, R, FR, [W + 300, 860]]);
  washAt(p, 10, '#4a76a4', 120, [[-120, -120], [RT[0], -120], RT, A, [A[0] - 120, 420], [-120, 560]], 0.1, 0.6);
  washAt(p, 5, '#6a9bcb', 150, [A, [A[0] + 130, A[1] + 230], [A[0] - 130, A[1] + 230]], 0.2, 0.6);
  // wind belly: pale lobe on the right wall beside the gable, swelling with the clock
  washAt(p, 8, '#9cc4ec', 120 + 30 * press, blob(14, 760 + 20 * press, 470, 100 + 30 * press, 120, 0), 0.4, 0.6);
  washAt(p, 9, '#050c16', 120, blob(15, 900, 520, 150, 190, 0), 0.5, 0.6);
  // lantern light is a clean gradient in the plate overlay (LanternGlow), not paint washes: the r6 washes mixed with the blue canvas into olive
  // ridge pole and gable edges
  p.ink(20, 'rotring', '#050b13', 3.6);
  p.brush.line(RT[0], -90, A[0], A[1]);
  p.brush.line(A[0] - 11, -90, A[0] - 11, A[1] - 4);
  p.brush.line(A[0] + 11, -90, A[0] + 11, A[1] - 4);
  p.brush.line(A[0], A[1], L[0], L[1]);
  p.brush.spline(rEdge, 0.2);
  // seams with snow-light stitch holes
  [-1, 1].forEach((side, si) => {
    const base = side < 0 ? L : R;
    [0.3, 0.62, 0.85].forEach((f, k) => {
      const topX = RT[0] + side * f * 700;
      const gx = A[0] + (base[0] - A[0]) * f, gy = A[1] + (base[1] - A[1]) * f;
      const pt = (u: number): Pt => {
        const bl = side > 0 ? -bulge * 1.1 * Math.sin(Math.PI * u) * (1 - 0.35 * f) : 0;
        return [topX + (gx - topX) * u + bl + 0.12 * bowAt(-90 + u * (gy + 90), t, si * 2 + k), -90 + u * (gy + 90)];
      };
      p.ink(21, 'rotring', '#07101b', 1.7);
      p.brush.spline(Array.from({length: 8}, (_, j) => pt(j / 7)), 0.1);
      for (let j = 0; j < 22; j++) {
        const u = (j + 0.5) / 22;
        const [sx, sy] = pt(u);
        if (sy > 20 && sy < gy) {
          // light leaks through the stitch holes: amber near the lantern (distance falloff), cool snow-light elsewhere
          const d = Math.hypot(sx - LANTERN7.x, sy - (LANTERN7.y - 50)), lit = Math.max(0, 1 - d / 620);
          const warm = lit > 0.12;
          if (warm) hardFill(p, 600 + si * 90 + k * 30 + j, '#e0883a', ell(sx + 6, sy, 5 + 6 * lit, 4 + 4 * lit, 8));
          hardFill(p, 100 + si * 90 + k * 30 + j, warm ? '#ffcf86' : '#b4d6f4', ell(sx + 6, sy, 2.2 + u * 1.4 + (warm ? 2.2 * lit : 0), 1.7 + (warm ? 1.6 * lit : 0), 6));
        }
      }
    });
  });
  // door flap (centre-right), free edge bowed, three ties
  const fx = 555, DT = 412, DB = 637, DR = 690;
  const edge = (u: number): Pt => [fx + 8 * Math.sin(u * 3.1) + 0.3 * bowAt(DT + u * (DB - DT), t, 2), DT + u * (DB - DT)];
  const flapEdge: Pt[] = Array.from({length: 9}, (_, j) => edge(j / 8));
  hardFill(p, 30, '#5280b0', [[fx, DT - 4], [DR, DT - 4], [DR, DB], ...flapEdge.slice().reverse()]);
  washAt(p, 31, '#a9cdf0', 60, [[fx + 14, DT + 6], [DR - 6, DT + 6], [DR - 6, DB - 8], [fx + 16, DB - 8]], 0.1, 0.5);
  p.ink(32, 'rotring', '#050b13', 2.2);
  p.brush.spline(flapEdge, 0.25);
  p.brush.line(fx, DT - 4, DR, DT - 4);
  p.brush.line(DR, DT - 4, DR, DB);
  [470, 540, 600].forEach((ty, i) => {
    const [ex, ey] = edge((ty - DT) / (DB - DT));
    const sway = 3 * Math.sin(t * 3 + i * 1.3);
    p.ink(34, 'rotring', '#e0e8ee', 1.7);
    p.brush.spline([[ex - 28, ey], [ex - 12, ey + 5 + sway * 0.4], [ex + 12, ey + 5], [ex + 34, ey + 16 + sway]], 0.3);
    p.ink(35, 'rotring', '#050b13', 1.4);
    p.brush.spline(ell(ex - 28, ey, 6, 8, 10), 0.2);
  });
  // ground: dark below the sheet, readable groundsheet and lighter trampled strip
  hardFill(p, 38, '#0a1522', rectPts(-120, 820, W + 120, H + 120));
  hardFill(p, 40, '#14243a', [L, R, FR, [1100, 900], [1100, 1300], [-20, 1300], [-20, 900], FL]);
  hardFill(p, 41, '#1d3450', [[300, 650], [790, 650], [1340, 1300], [-270, 1300]]);
  washAt(p, 42, '#4a627c', 110, blob(3, 420, 720, 230, 40, 0), 0.4, 0.6);
  washAt(p, 43, '#3a516a', 90, blob(9, 760, 790, 160, 26, 0), 0.4, 0.6);
  p.ink(44, 'rotring', '#050b13', 2.6);
  p.brush.line(L[0], L[1], FL[0], FL[1]);
  p.brush.line(R[0], R[1], FR[0], FR[1]);
  p.brush.line(L[0], L[1], R[0], R[1]);
  // tie-down tabs at the corners
  [[L, -1, 0], [R, 1, 0], [FL, -1, 1], [FR, 1, 1]].forEach(([b, , big], i) => {
    const [x, y] = b as Pt; const k = big ? 1.5 : 1, w = 20 * k;
    hardFill(p, 70 + i, '#9aa8b4', [[x - w * 0.5, y - 7 * k], [x + w * 0.5, y - 7 * k], [x + w * 0.5, y + 22 * k], [x - w * 0.5, y + 22 * k]]);
    p.ink(76 + i, 'rotring', '#050b13', 1.5 * k);
    p.brush.line(x - w * 0.5, y - 7 * k, x + w * 0.5, y - 7 * k);
  });
  // bedroll right, pack left (moved up so the lantern has the floor beside it), empty tin under the door
  const roll: Pt[] = [[705, 693], [785, 687], [1030, 862], [960, 874]];
  hardFill(p, 80, '#34495f', roll);
  washAt(p, 81, '#4d6680', 150, [[720, 696], [780, 692], [980, 850], [940, 860]], 0.2, 0.5);
  p.ink(82, 'rotring', '#050b13', 2);
  p.brush.spline([...roll, roll[0]], 0.15);
  hardFill(p, 83, '#243752', blob(6, 120, 770, 90, 62, 0));
  p.ink(84, 'rotring', '#050b13', 2);
  p.brush.spline(blob(6, 120, 770, 90, 62, 0), 0.15);
  hardFill(p, 85, '#8c98a4', rectPts(590, 715, 624, 748));
  hardFill(p, 86, '#2a313a', ell(607, 715, 17, 6, 10));
  p.ink(87, 'rotring', '#050b13', 1.6);
  p.brush.line(590, 715, 590, 748);
  p.brush.line(624, 715, 624, 748);
  // lower floor (r7, VD03e): groundsheet continues toward the viewer; calm, low-contrast content only (cloth folds, a jacket, boots, frost)
  [[200, 930, 520, 12, 0.05], [700, 960, 480, 14, -0.04], [420, 1040, 640, 16, 0.03], [820, 1110, 520, 14, -0.05], [260, 1150, 460, 12, 0.04]].forEach(([cx, cy, rx, ry, rot], i) =>
    washAt(p, 400 + i, '#2c4562', 70, ell(cx, cy, rx, ry, 14, rot), 0.3, 0.5));
  hardFill(p, 410, '#1c2f47', blob(41, 330, 1015, 140, 40, 0));
  washAt(p, 411, '#2a4260', 90, blob(42, 320, 1005, 100, 22, 0), 0.3, 0.5);
  p.ink(412, 'rotring', '#08111d', 1.8);
  p.brush.spline(blob(41, 330, 1015, 140, 40, 0), 0.15);
  // boots, side by side, toes toward the gable, one tipped over; dim, no bright rims
  const boot = (id: number, bx: number, by: number, sc: number, flip: number, fill: string) => {
    const P2 = (u: number, v: number): Pt => [bx + flip * u * sc, by + v * sc];
    const shape: Pt[] = [P2(-60, -105), P2(-8, -105), P2(-4, -40), P2(40, -18), P2(88, -4), P2(96, 18), P2(-62, 18)];
    hardFill(p, id, '#09111c', [P2(-64, 14), P2(100, 14), P2(100, 26), P2(-64, 26)]);
    hardFill(p, id + 1, fill, shape);
    washAt(p, id + 2, '#37506c', 90, [P2(-52, -98), P2(-16, -98), P2(-14, -50), P2(-52, -40)], 0.2, 0.5);
    p.ink(id + 3, 'rotring', '#07101b', 1.8);
    p.brush.spline([...shape, shape[0]], 0.12);
  };
  boot(420, 640, 985, 1.15, 1, '#223650');
  boot(430, 800, 1015, 1.15, 1, '#1f3249');
  for (let i = 0; i < 16; i++) {
    const fx3 = 120 + hash(340 + i) * 840, fy3 = 920 + hash(350 + i) * 280 + 3 * Math.sin(t * 1.7 + i);
    washAt(p, 440 + i, '#6f8aa4', 70, ell(fx3, fy3, 8 + hash(360 + i) * 12, 2.2, 8), 0.3, 0.4);
  }
  // lantern on the floor
  const {x, y} = LANTERN7;
  hardFill(p, 50, '#241a12', rectPts(x - 30, y - 10, x + 30, y));
  hardFill(p, 51, '#d9953f', rectPts(x - 23, y - 88, x + 23, y - 10));
  hardFill(p, 52, '#f6d79a', rectPts(x - 10, y - 70, x + 10, y - 28));
  hardFill(p, 55, '#241a12', [[x - 30, y - 88], [x + 30, y - 88], [x + 18, y - 108], [x - 18, y - 108]]);
  p.ink(54, 'rotring', '#241a12', 1.3);
  p.brush.spline([[x - 18, y - 106], [x, y - 140], [x + 18, y - 106]], 0.5);
  p.brush.line(x - 23, y - 88, x - 23, y - 10);
  p.brush.line(x + 23, y - 88, x + 23, y - 10);
  for (let i = 0; i < 6; i++) {
    const fx2 = 300 + hash(300 + i) * 560, fy = 680 + hash(310 + i) * 190 + 5 * Math.sin(t * 2 + i);
    washAt(p, 60 + i, '#9db4c9', 90, ell(fx2, fy, 20 + hash(320 + i) * 18, 4, 10), 0.3, 0.4);
  }
};

// ---------------------------------------------------------------- LF-WENDIGO (VD13/VD13a): one shadow design, human stand-in to long-limbed form

/** Side view, facing right. Joints as [forward fraction of figure height from the hip-line origin, height fraction from the ground]. N = near limb, F = far limb.
 *  Human = the stand-in (P01-like, upright). Wendigo = the design: hunched forward, head hung low and forward, arms hanging below the knee, long legs bent, bald egg head. */
type Fig = {h: number; head: Pt; hrx: number; hry: number; neck: Pt; sh: Pt; hip: Pt; torsoW: [number, number]; elbowN: Pt; wristN: Pt; fingN: Pt; elbowF: Pt; wristF: Pt; fingF: Pt; kneeN: Pt; ankleN: Pt; toeN: Pt; kneeF: Pt; ankleF: Pt; toeF: Pt; aw: [number, number]; lw: [number, number]};
const HUMAN: Fig = {h: 440, head: [0.03, 0.925], hrx: 0.052, hry: 0.066, neck: [0.012, 0.865], sh: [0.005, 0.82], hip: [0, 0.52], torsoW: [0.1, 0.115],
  elbowN: [0.02, 0.63], wristN: [0.05, 0.46], fingN: [0.055, 0.4], elbowF: [-0.02, 0.63], wristF: [-0.03, 0.46], fingF: [-0.03, 0.4],
  kneeN: [0.03, 0.27], ankleN: [0.01, 0.03], toeN: [0.07, 0.0], kneeF: [-0.02, 0.27], ankleF: [-0.05, 0.03], toeF: [0.01, 0.0], aw: [0.04, 0.03], lw: [0.075, 0.05]};
const WEND: Fig = {h: 560, head: [0.31, 0.775], hrx: 0.04, hry: 0.056, neck: [0.225, 0.8], sh: [0.17, 0.79], hip: [-0.03, 0.6], torsoW: [0.06, 0.105],
  elbowN: [0.215, 0.52], wristN: [0.19, 0.25], fingN: [0.2, 0.15], elbowF: [0.3, 0.5], wristF: [0.39, 0.27], fingF: [0.42, 0.18],
  kneeN: [0.13, 0.33], ankleN: [-0.03, 0.03], toeN: [0.06, 0.0], kneeF: [0.03, 0.34], ankleF: [-0.17, 0.03], toeF: [-0.09, 0.0], aw: [0.032, 0.016], lw: [0.042, 0.022]};

/** WDG-SS-R2.5d crawl-out (user, 2 Nov 2026: no leap; the form crawls slowly out of the frame to screen right). Shot clock seconds: the crawl
 *  starts at `m0`, eases in over `ease` seconds to a steady `v` figure heights per second; the body travels screen right (the design faces right). */
export type Crawl = {m0: number; v: number; ease: number};
/** S01-B03-SH05 (L = G - 1100): crawl from L90 (G1190; first displaced frame G1191), steady 0.5 h/s (364 px/s at scale 1.3) after a 0.4 s
 *  ease-in; the rearmost limb passes the right tent wall (x 910) at L142 (G1242). */
export const FLAP_CRAWL: Crawl = {m0: 90 / 30, v: 0.5, ease: 0.4};
/** S02-B03-SH02 (L = G - 1900): crawl from L100 (G2000, under the callback dissolve-out), 0.7 h/s (333 px/s at scale 0.85), past the right
 *  frame edge at L172 (G2072, the R2.4 exit frame), inside the gap fade. */
export const STORM_CRAWL: Crawl = {m0: 100 / 30, v: 0.7, ease: 0.4};
/** Travel (figure heights) at shot clock `m`: 0 before `m0`, then an ease-in (constant acceleration over `ease`) into the steady speed. */
export const crawlX = (cr: Crawl | undefined, m: number) => {
  if (!cr) return 0;
  const t = m - cr.m0;
  if (t <= 0) return 0;
  return t < cr.ease ? (cr.v * t * t) / (2 * cr.ease) : cr.v * (t - cr.ease / 2);
};

type JointKey = 'head' | 'neck' | 'sh' | 'hip' | 'elbowN' | 'wristN' | 'fingN' | 'elbowF' | 'wristF' | 'fingF' | 'kneeN' | 'ankleN' | 'toeN' | 'kneeF' | 'ankleF' | 'toeF';
type Pose = Record<JointKey, Pt>;
/** CRAWL: the moving form's base posture (the look frame, with no motion, keeps `WEND`), same frame as `WEND` (fractions of the figure height;
 *  x forward from the hip-line origin, y up from the ground). It is the pose the user approved for the crawl-out
 *  (`references/user/2026-11-02_wendigo-crawl-out-frame.png`, "คลานออกไป", answered yes): torso low and forward with the hips a little above the
 *  shoulders' line, head hung forward, both long arms reaching down to the floor ahead with the hands planted, long hind legs with the knees bent
 *  (thigh, shin and foot at their standing lengths through the leg IK in `figureJoints`), feet planted apart. */
const CRAWL: Pose = {head: [0.385, 0.47], neck: [0.31, 0.5], sh: [0.23, 0.5], hip: [-0.045, 0.455],
  elbowN: [0.275, 0.285], wristN: [0.46, 0.115], fingN: [0.49, 0.085], elbowF: [0.345, 0.285], wristF: [0.53, 0.115], fingF: [0.56, 0.085],
  kneeN: [0.2055, 0.352], ankleN: [0.1075, 0.0525], toeN: [0.195, 0.0], kneeF: [-0.1315, 0.353], ankleF: [-0.269, 0.045], toeF: [-0.1865, 0.0]};

/** Crawl gait: stride length (figure heights), stance fraction, foot/hand lift, and the cycle offsets (diagonal gait: the far hind leg steps
 *  with the near arm, the near hind leg with the far arm; each arm a tenth of a cycle after its leg). */
const GAIT = {stride: 0.4, duty: 0.7, lift: 0.05, off: {legF: 0, armN: 0.1, legN: 0.5, armF: 0.6}};
/** Planted-limb offset at travel `d` for a limb with cycle offset `off`: [forward offset from the home position, lift] in figure heights. In
 *  stance the offset falls exactly as fast as the body travels, so the planted hand or foot stays fixed on the ground (no sliding). */
const gaitOffset = (d: number, off: number): Pt => {
  const {stride: Ls, duty: b, lift} = GAIT;
  const q = (((d / Ls + off) % 1) + 1) % 1;
  if (q < b) return [(b * Ls) / 2 - q * Ls, 0];
  const u = (q - b) / (1 - b), sm = u * u * (3 - 2 * u);
  return [-(b * Ls) / 2 + b * Ls * sm, lift * Math.sin(Math.PI * u)];
};

/** WDG-SS-R2.5d motion of the long-limbed form (pure function of the shot clock `m`, seconds; weight `e` is the eased morph, so the human stand-in
 *  only breathes). Returns [forward, up] offsets in fractions of the figure height for each joint: the CRAWL base posture, breathing, a slow weight
 *  sway, a head and finger twitch, and with a `cr` (Crawl) the travel to screen right with a planted diagonal gait. There is no stepping in place:
 *  hands and feet only move when the body travels. */
export const figureMotion = (key: string, m: number, e: number, cr?: Crawl): Pt => {
  const X = crawlX(cr, m);
  // travel and gait are measured in wendigo heights (not the morphing height), so a planted hand or foot stays put while the morph finishes
  const r = WEND.h / lerp(HUMAN.h, WEND.h, e);
  const breath = 0.006 * Math.sin(2 * Math.PI * 0.45 * m) * (0.4 + 0.6 * e);
  const sway = 0.008 * Math.sin(2 * Math.PI * 0.35 * m) * e;
  const tw = Math.pow(Math.max(0, Math.sin(2 * Math.PI * 0.37 * m + 1)), 14) * e;
  const tf = Math.pow(Math.max(0, Math.sin(2 * Math.PI * 0.53 * m)), 10) * e;
  let x = 0, y = 0;
  const hand = /^(wrist|fing)/.test(key), foot = /^(ankle|toe)/.test(key), planted = hand || foot;
  if (key in CRAWL) { const k = key as JointKey; x += (CRAWL[k][0] - WEND[k][0]) * e; y += (CRAWL[k][1] - WEND[k][1]) * e; }
  if (!planted) {
    // body: breathing, a slow fore-aft weight sway, and while crawling a bob as the weight passes over each planted limb
    const bob = cr && X > 0 ? 0.01 * Math.sin((4 * Math.PI * X) / GAIT.stride) : 0;
    y += breath + bob * e;
    x += (key === 'elbowN' || key === 'elbowF' ? 0.5 : 1) * sway;
  }
  if (key === 'fingN' || key === 'fingF') y += 0.03 * tf;
  if (key === 'head') { y -= 0.02 * tw; x += 0.015 * tw; }
  if (cr && X > 0) {
    const limb = /N$/.test(key) ? (/^(elbow|wrist|fing)/.test(key) ? 'armN' : 'legN') : /^(elbow|wrist|fing)/.test(key) ? 'armF' : 'legF';
    if (planted || key.startsWith('elbow')) {
      const [gx, gy] = gaitOffset(X, GAIT.off[limb as keyof typeof GAIT.off]);
      const w = key.startsWith('elbow') ? 0.5 : 1;
      x += gx * w * r; y += gy * w * r;
    }
  }
  x += X * r; // the whole body travels; planted limbs cancel it in stance
  return [x, y];
};

/** Standing bone lengths of a hind leg (thigh hip-knee, shin knee-ankle, foot ankle-toe) in figure heights, per design (`HUMAN` or `WEND`). */
const legBones = (f: Fig, sf: 'N' | 'F') => {
  const d = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const kn = f[`knee${sf}`], an = f[`ankle${sf}`], to = f[`toe${sf}`];
  return {T: d(f.hip, kn), S: d(kn, an), F: d(an, to)};
};

/** WDG-SS-R2.5d: joint positions in screen px for the figure at morph k (same arguments as `paintFigure`). With motion (`mv` set) each hind leg is
 *  re-solved by two-bone IK from the hip and the blended ankle, keeping the standing thigh, shin and foot lengths of that leg (lerped human to
 *  wendigo by the morph) and the knee always on the forward/up side: poses only change angles, never bone lengths. */
export const figureJoints = (k: number, cx: number, footY: number, scale = 1, mv?: number, cr?: Crawl): Record<JointKey, Pt> => {
  const e = k * k * (3 - 2 * k);
  const h = lerp(HUMAN.h, WEND.h, e) * scale;
  const keys: JointKey[] = ['head', 'neck', 'sh', 'hip', 'elbowN', 'wristN', 'fingN', 'elbowF', 'wristF', 'fingF', 'kneeN', 'ankleN', 'toeN', 'kneeF', 'ankleF', 'toeF'];
  const J = {} as Record<JointKey, Pt>;
  keys.forEach((key) => {
    const a = HUMAN[key], b = WEND[key];
    const o: Pt = mv === undefined ? [0, 0] : figureMotion(key, mv, e, cr);
    J[key] = [cx + (lerp(a[0], b[0], e) + o[0]) * h, footY - (lerp(a[1], b[1], e) + o[1]) * h];
  });
  if (mv === undefined) return J;
  (['N', 'F'] as const).forEach((sf) => {
    const bh = legBones(HUMAN, sf), bw = legBones(WEND, sf);
    const T = lerp(bh.T, bw.T, e) * h, S = lerp(bh.S, bw.S, e) * h, F = lerp(bh.F, bw.F, e) * h;
    const hip = J.hip, to0 = J[`toe${sf}`];
    let an = J[`ankle${sf}`];
    let dx = an[0] - hip[0], dy = an[1] - hip[1], d = Math.hypot(dx, dy) || 1;
    const dMax = T + S - 0.5, dMin = Math.abs(T - S) + 0.5;
    if (d > dMax || d < dMin) { const dd = Math.min(dMax, Math.max(dMin, d)); an = [hip[0] + (dx / d) * dd, hip[1] + (dy / d) * dd]; dx = an[0] - hip[0]; dy = an[1] - hip[1]; d = dd; }
    const ux = dx / d, uy = dy / d, a = (T * T - S * S + d * d) / (2 * d), hh = Math.sqrt(Math.max(0, T * T - a * a));
    const bx = hip[0] + ux * a, by = hip[1] + uy * a;
    const c1: Pt = [bx - uy * hh, by + ux * hh], c2: Pt = [bx + uy * hh, by - ux * hh];
    const kn = c1[0] - c1[1] >= c2[0] - c2[1] ? c1 : c2; // the knee always bends forward/up (never flips through a pose blend)
    const fx = to0[0] - an[0], fy = to0[1] - an[1], fl = Math.hypot(fx, fy) || 1;
    J[`knee${sf}`] = kn; J[`ankle${sf}`] = an; J[`toe${sf}`] = [an[0] + (fx / fl) * F, an[1] + (fy / fl) * F];
  });
  return J;
};

/** Draws the shadow at morph k (0 human, 1 wendigo), hip-line origin at cx, feet on footY; `scale` scales it for the shot. Flat, no face, no antlers.
 *  `soft` paints bleeding washes (the storm glimpse) instead of hard shapes. */
export const paintFigure = (p: Painter, seed: number, k: number, cx: number, footY: number, color: string, scale = 1, ink = true, soft = false, farColor = color, softOpacity = 150, softBleed = 0.8, mv?: number, cr?: Crawl) => {
  const e = k * k * (3 - 2 * k);
  const h = lerp(HUMAN.h, WEND.h, e) * scale;
  const fill = (sd: number, pts: Pt[], c = color) => (soft ? washAt(p, sd, c, softOpacity, pts, softBleed, 0.9) : hardFill(p, sd, c, pts));
  type K = JointKey;
  const J = figureJoints(k, cx, footY, scale, mv, cr);
  const P = (key: K): Pt => J[key];
  const lerpW = (a: [number, number], b: [number, number]): [number, number] => [lerp(a[0], b[0], e) * h, lerp(a[1], b[1], e) * h];
  const aw = lerpW(HUMAN.aw, WEND.aw), lw = lerpW(HUMAN.lw, WEND.lw), tw = lerpW(HUMAN.torsoW, WEND.torsoW);
  const hrx = lerp(HUMAN.hrx, WEND.hrx, e) * h, hry = lerp(HUMAN.hry, WEND.hry, e) * h;
  const hip = P('hip'), sh = P('sh'), nk = P('neck'), hd = P('head');
  // far limbs first (slightly lighter shade), then the body, then the near limbs
  const arm = (sd: number, sf: 'N' | 'F', c: string) => {
    const el = P(`elbow${sf}` as K), wr = P(`wrist${sf}` as K), fi = P(`fing${sf}` as K);
    fill(sd, capsule(sh, el, aw[0], aw[1] * 1.15), c);
    fill(sd + 1, capsule(el, wr, aw[1] * 1.15, aw[1] * 0.8), c);
    fill(sd + 2, ell(wr[0], wr[1] + 0.012 * h, aw[1] * 0.7 + 0.006 * h, 0.02 * h, 10), c);
    // long fingers, spreading and curling with the morph
    const fl = lerp(0.03, 0.08, e) * h;
    for (let f = 0; f < 4; f++) {
      const sp = (-0.45 + f * 0.3) * (0.4 + 0.6 * e);
      const end: Pt = [fi[0] + sp * fl * 0.6, fi[1] + fl * (0.75 + 0.25 * Math.cos(sp * 2))];
      fill(sd + 3 + f, capsule([wr[0] + (f - 1.5) * 0.004 * h, wr[1] + 0.012 * h], end, 0.007 * h + 1.5, 0.003 * h + 1), c);
    }
  };
  const leg = (sd: number, sf: 'N' | 'F', c: string) => {
    const kn = P(`knee${sf}` as K), an = P(`ankle${sf}` as K), to = P(`toe${sf}` as K);
    fill(sd, capsule(hip, kn, lw[0], lw[1] * 1.15), c);
    fill(sd + 1, capsule(kn, an, lw[1] * 1.15, lw[1] * 0.8), c);
    fill(sd + 2, capsule(an, [to[0], to[1] - 3], lw[1] * 0.9, lw[1] * 0.5), c);
  };
  // ground contact (moving form): a flat shadow under the body on the snow, travelling with it
  if (mv !== undefined) {
    const op = Math.round((soft ? 90 : 190) * e);
    if (op > 2) washAt(p, seed + 150, color, op, ell((hip[0] + sh[0]) / 2, footY + 5 * scale, 0.3 * h, 0.018 * h, 12), soft ? softBleed : 0.2, 0.6);
  }
  leg(seed + 40, 'F', farColor);
  arm(seed + 60, 'F', farColor);
  // torso: pelvis to chest, thin waist, ribcage swelling toward the shoulders
  const mid: Pt = [(hip[0] + sh[0]) / 2, (hip[1] + sh[1]) / 2];
  fill(seed, capsule(hip, mid, tw[0] * 1.2, tw[0]));
  fill(seed + 1, capsule(mid, sh, tw[0], tw[1]));
  fill(seed + 2, capsule(sh, nk, tw[1] * 0.8, tw[0] * 0.8));
  fill(seed + 3, capsule(nk, [hd[0] - hrx * 0.3, hd[1] + hry * 0.5], hrx * 0.8, hrx * 0.7));
  fill(seed + 4, ell(hd[0], hd[1], hrx, hry, 18, 0));
  leg(seed + 80, 'N', color);
  arm(seed + 100, 'N', color);
  if (ink && !soft) inkLine(p, seed + 140, ell(hd[0], hd[1], hrx, hry, 18, 0), {color: '#02060c', weight: 1.4, closed: true});
};

/** Time-to-morph for the study plate (2 s plate): human until 0.3 s, long-limbed by 1.7 s. */
export const morphAt = (t: number) => ramp(t, 0.3, 1.7);

/** Figure scale in the flap shot: human stand-in 440 x 1.3 = 572 px tall, wendigo design height 560 x 1.3 (hunched, so its head sits lower), feet on y 856 (above the caption band). */
export const FLAP = {cx: 540, footY: 856, scale: 1.3};

/** S01-B03-SH05: view from inside the tent, the flap open on the pale morning light, the sleeper low in the foreground, the shadow standing in the opening. */
/** Clips polygon `subject` to the convex polygon `clip` (Sutherland-Hodgman; both in screen px, any winding of `clip`). */
const clipConvex = (subject: Pt[], clip: Pt[]): Pt[] => {
  const n = clip.length, sign = Math.sign(clip.reduce((acc, [x, y], i) => acc + x * clip[(i + 1) % n][1] - clip[(i + 1) % n][0] * y, 0));
  let out = subject;
  for (let i = 0; i < n && out.length; i++) {
    const [ax, ay] = clip[i], [bx, by] = clip[(i + 1) % n];
    const side = ([x, y]: Pt) => sign * ((bx - ax) * (y - ay) - (by - ay) * (x - ax));
    const cut = (p: Pt, q: Pt): Pt => { const sp = side(p), sq = side(q), u = sp / (sp - sq); return [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u]; };
    const inp = out; out = [];
    inp.forEach((q, j) => {
      const pr = inp[(j + inp.length - 1) % inp.length];
      if (side(q) >= 0) { if (side(pr) < 0) out.push(cut(pr, q)); out.push(q); } else if (side(pr) >= 0) out.push(cut(pr, q));
    });
  }
  return out;
};

/** S01-B03-SH05 tent geometry (WDG-SS-R2.5): the door opening (outside light) and the canvas that hides whatever is outside the tent beyond it.
 *  The form stands outside, beyond the threshold (y 870), so it is drawn before the canvas: only the part inside `FLAP_OPEN` is seen. Its bound
 *  crawl goes right, so the canvas right of the opening (`FLAP_HIDE_SIDE`, x >= 910) and above the right roof slope (`FLAP_HIDE_ROOF`) is
 *  repainted over it; both are convex so the canvas wash can be clipped to them. */
export const FLAP_OPEN: Pt[] = [[170, 870], [910, 870], [910, 250], [540, 40], [170, 250]];
const FLAP_HIDE_ROOF: Pt[] = [[540, -140], [1220, -140], [1220, 250], [910, 250], [540, 40]];
const FLAP_HIDE_SIDE: Pt[] = [[910, 250], [1220, 250], [1220, 1000], [910, 1000]];

/** S01-B03-SH05: view from inside the tent, the flap open on the pale morning light, the sleeper low in the foreground, the shadow standing outside
 *  in the opening. Draw order (back to front, R2.5): tent interior, outside light, the form (outside), the canvas right of and above the opening
 *  repainted over it, door flaps and their ink, snow sill, sleeper (inside), blowing snow. */
export const paintWendigoFlap = (p: Painter, t: number, k: number = morphAt(t), mv?: number, cr?: Crawl) => {
  const canvasBlob = blob(9, 540, 480, 520, 560, 0);
  washAt(p, 1, '#101c2c', 255, full, 0.05, 0.2);
  washAt(p, 9, '#1a2c44', 160, canvasBlob, 0.8, 0.8);
  const press = 0.5 + 0.5 * Math.sin(t * 1.4);
  // opening: tall A-frame door, backlit; the light is cool and flat
  hardFill(p, 2, '#b9d1e6', FLAP_OPEN);
  washAt(p, 3, '#dbe9f5', 170, blob(3, 540, 340, 300, 260, 0), 0.7, 0.7);
  washAt(p, 4, '#8fb0cd', 140, [[170, 640], [910, 640], [910, 870], [170, 870]], 0.5, 0.6);
  // the shadow, outside the tent beyond the threshold
  paintFigure(p, 100, k, FLAP.cx - 20, FLAP.footY, '#050b14', FLAP.scale, true, false, '#0b1624', 150, 0.8, mv, cr);
  // tent canvas in front of it: the same two washes, repainted only where the crawl can carry the form outside the opening
  [FLAP_HIDE_ROOF, FLAP_HIDE_SIDE].forEach((piece) => {
    washAt(p, 1, '#101c2c', 255, piece, 0.05, 0.2);
    const lift = clipConvex(canvasBlob, piece);
    if (lift.length > 2) washAt(p, 9, '#1a2c44', 160, lift, 0.8, 0.8);
  });
  // door flaps: dark canvas panels either side, bowed by the wind
  hardFill(p, 5, '#18293f', [[170, 870], [170, 250], [540, 40], [540 - 14 * press, 40], [60 - 12 * press, 270], [40, 870]]);
  hardFill(p, 6, '#12223a', [[910, 870], [910, 250], [540, 40], [540 + 14 * press, 40], [1020 + 12 * press, 270], [1040, 870]]);
  p.ink(7, 'rotring', '#050b13', 2.8);
  p.brush.spline([[170, 870], [170 - 8 * press, 560], [170, 250], [540, 40]], 0.2);
  p.brush.spline([[910, 870], [910 + 8 * press, 560], [910, 250], [540, 40]], 0.2);
  // snow sill (the threshold, nearer than the form's feet)
  washAt(p, 8, '#9cb8d0', 200, blob(8, 540, 868, 400, 16, 0), 0.4, 0.5);
  // sleeper: low dark mound in the foreground (man-crop, lie_on_side), face turned away, never in danger
  hardFill(p, 300, '#04080f', blob(20, 290, 872, 300, 52, 0));
  hardFill(p, 301, '#04080f', ell(110, 850, 60, 46, 14));
  p.ink(302, 'rotring', '#02060c', 1.6);
  p.brush.spline(blob(20, 290, 872, 300, 52, 0), 0.15);
  // snow dust blowing across the opening
  for (let i = 0; i < 10; i++) {
    const sx = ((260 + hash(400 + i) * 560 + t * 40 * (0.5 + hash(420 + i))) % 600) + 240, sy = 200 + hash(410 + i) * 620;
    washAt(p, 310 + i, '#e8f1f8', 120, ell(sx, sy, 14 + hash(430 + i) * 18, 2.5, 10), 0.3, 0.3);
  }
};

/** S02-B03-SH01: the same figure glimpsed in blowing snow: a soft grey gap in the pale, a veil of streaks over it, no clear edge. */
export const paintWendigoStorm = (p: Painter, t: number, v = 1, mv?: number, cr?: Crawl) => {
  washAt(p, 1, '#aab6c0', 255, full, 0.1, 0.5);
  washAt(p, 2, '#c4ced6', 160, blob(2, 540, 620, 560, 520, 0), 0.8, 0.8);
  // dim conifers, far and near, thinning into the storm
  for (let i = 0; i < 16; i++) {
    const x = -20 + i * 72 + hash(500 + i) * 36, top = 170 + hash(510 + i) * 200, base = 860 + hash(515 + i) * 40, w = 46 + hash(520 + i) * 30;
    const tree: Pt[] = [[x, top]];
    for (let j = 1; j <= 7; j++) { const y = top + ((base - top) * j) / 7, ww = (w * j) / 7; tree.push([x + ww * (j % 2 ? 0.55 : 1), y - 8], [x + ww * 0.35, y]); }
    for (let j = 7; j >= 1; j--) { const y = top + ((base - top) * j) / 7, ww = (w * j) / 7; tree.push([x - ww * 0.35, y], [x - ww * (j % 2 ? 0.55 : 1), y - 8]); }
    if (x > 330 && x < 700) continue;
    washAt(p, 10 + i, '#4c5d6e', 120 + (i % 3) * 30, tree, 0.15, 0.6);
  }
  // snow veil lifts the middle so the form sits in a pale pocket
  washAt(p, 30, '#c4ced6', 170, blob(30, 560, 560, 230, 380, 0), 0.9, 0.8);
  // the form: same design at distance, only a soft darker gap, no outline
  // v: gap visibility 0..1 (a sub-layer at alpha v; v = 1 is the approved study, drawn on the plate painter as before)
  if (v >= 1) paintFigure(p, 200, 1, 520, 850, '#34445a', 0.85, false, true, '#34445a', 215, 0.35, mv, cr);
  else if (v > 0) paintFigure(p.layer(v, 7000), 200, 1, 520, 850, '#34445a', 0.85, false, true, '#34445a', 215, 0.35, mv, cr);
  washAt(p, 31, '#c9d3da', 110, blob(31, 560, 560, 180, 320, t * 0.3), 0.9, 0.9);
  for (let i = 0; i < 70; i++) {
    const x0 = (((hash(600 + i) * 1500 - 200 + t * 220 * (0.6 + hash(700 + i))) % 1500) + 1500) % 1500 - 200, y0 = hash(610 + i) * 1000 + 120 + 8 * Math.sin(t * 2 + i);
    const len = 80 + hash(620 + i) * 140;
    p.ink(40 + (i % 5), 'rotring', i % 3 ? '#e6eef4' : '#f4f8fb', 1.2 + hash(630 + i) * 2);
    p.brush.line(x0, y0, x0 + len, y0 + len * 0.22);
  }
};

// ---------------------------------------------------------------- LF-ERA (VD08c): S03-B01 winter prairie, palisade, closed gate, 1879 record feel

/** Palisade geometry in px (estimate). Gate is a pair of leaves between two taller posts. */
export const ERA = {horizon: 830, base: 830, x0: -30, x1: 1110, gate: [600, 800] as [number, number]};
export const paintEra = (p: Painter, t: number) => {
  const {horizon: HZ, base: B, x0, x1, gate} = ERA;
  // aged-paper sky, flat and low; one dim low sun at the left that only warms the palisade rim, not the snow
  washAt(p, 1, '#cfc6b0', 255, rectPts(-120, -120, W + 120, HZ + 40), 0.2, 0.6);
  washAt(p, 2, '#b9b19c', 170, band(2, -60, 330, 40), 0.5, 0.7);
  washAt(p, 3, '#e0d3ae', 150, blob(3, 120, HZ - 120, 200, 56, t * 0.2), 0.8, 0.7);
  // thin far tree line, hazed
  washAt(p, 4, '#8f9a9e', 150, [[-120, HZ], ...Array.from({length: 12}, (_, i): Pt => [-120 + i * 110, HZ - 20 - hash(40 + i) * 22]), [1200, HZ], [1200, HZ + 4]], 0.4, 0.6);
  // snow plain: cold slate, no ochre; dim so the caption band holds at the defaults
  washAt(p, 5, '#5f7081', 255, rectPts(-120, HZ, W + 120, H + 120), 0.1, 0.5);
  washAt(p, 6, '#7a8b9a', 150, blob(6, 480, HZ + 70, 560, 40, 0), 0.6, 0.7);
  washAt(p, 7, '#566879', 90, band(7, 1000, 1080, 16), 0.6, 0.7);
  washAt(p, 8, '#4a5c6d', 80, band(8, 1200, 1300, 18), 0.6, 0.7);
  // paper stains and a faint fold, so it reads as an old record
  washAt(p, 9, '#a79d85', 110, blob(9, 880, 200, 160, 90, 0), 0.9, 0.9);
  washAt(p, 10, '#a79d85', 90, blob(10, 200, 380, 120, 70, 0), 0.9, 0.9);
  const posts: {x: number; top: number; w: number; gatePost: boolean; lean?: number}[] = [];
  let x = x0;
  for (let i = 0; x < x1; i++) {
    const w = 40 + hash(800 + i) * 8;
    if (!(x + w > gate[0] - 30 && x < gate[1] + 30)) posts.push({x, top: 440 + hash(810 + i) * 120, w, gatePost: false, lean: (hash(820 + i) - 0.5) * 14});
    x += w + 4;
  }
  posts.push({x: gate[0] - 38, top: 360, w: 44, gatePost: true}, {x: gate[1] - 6, top: 360, w: 44, gatePost: true});
  // gate: two plank leaves, closed, with two bars; a beam links the gate posts
  hardFill(p, 20, '#3a342d', rectPts(gate[0], 500, gate[1], B));
  washAt(p, 21, '#524a3f', 110, rectPts(gate[0] + 6, 510, gate[1] - 6, B - 6), 0.2, 0.6);
  p.ink(22, 'rotring', '#14110e', 2.4);
  p.brush.line((gate[0] + gate[1]) / 2, 500, (gate[0] + gate[1]) / 2, B);
  [580, 710].forEach((yy) => p.brush.line(gate[0], yy, gate[1], yy));
  for (let i = 1; i < 6; i++) { const gx = gate[0] + (i * (gate[1] - gate[0])) / 6; p.ink(23 + i, 'rotring', '#241f1a', 1.0); p.brush.line(gx, 504, gx, B); }
  hardFill(p, 29, '#2a2520', rectPts(gate[0] - 38, 430, gate[1] + 38, 454));
  posts.forEach((q, i) => {
    const tip: Pt = [q.x + q.w * 0.5 + (q.lean ?? 0), q.top - 14 - (q.gatePost ? 16 : 14 * hash(830 + i))];
    hardFill(p, 40 + i, q.gatePost ? '#1f1b17' : '#2b2723', [[q.x, B], [q.x, q.top], tip, [q.x + q.w, q.top], [q.x + q.w, B]]);
    // ochre rim on the sun side (left edge) of the post, palisade only
    hardFill(p, 200 + i, '#b3873f', [[q.x, B], [q.x, q.top], tip, [q.x + 6, q.top - 8], [q.x + 6, B]]);
  });
  p.ink(120, 'rotring', '#12100d', 1.2);
  posts.forEach((q) => { p.brush.line(q.x + q.w, q.top, q.x + q.w, B); });
  // cold snow banked at the foot
  washAt(p, 130, '#c7d1d9', 220, band(130, B - 12, B + 30, 8), 0.5, 0.6);
  p.ink(131, 'rotring', '#2f3d49', 1.2);
  p.brush.line(x0, B + 4, x1, B + 4);
  washAt(p, 132, '#c9d1d7', 80, blob(132, 560, B + 50, 520, 20, t * 0.3), 0.8, 0.8);
};

// ---------------------------------------------------------------- ERA-A (W5.2 era atmosphere, option A): a period glass-plate photograph painted by values

/** Plate edge, dust and scratch marks shared by the era photographs (ERA-K1..K4): an uneven dark emulsion border, 12 dust specks, two light scratches and one dark one. */
const eraPlateMarks = (p: Painter) => {
  // plate edge: an uneven dark border (emulsion edge), dust and scratches
  const edge = (id: number, pts: Pt[]) => hardFill(p, id, '#1a1510', pts);
  const j = (i: number, a: number) => (hash(900 + i) - 0.5) * a;
  edge(300, [[-120, -120], [1200, -120], [1200, 6 + j(1, 6)], [900, 4 + j(2, 6)], [540, 9 + j(3, 8)], [200, 3 + j(4, 6)], [-120, 6 + j(5, 6)]]);
  edge(301, [[-120, -120], [9 + j(6, 8), -120], [4 + j(7, 8), 700], [10 + j(8, 8), 1500], [3 + j(9, 8), 2040], [-120, 2040]]);
  edge(302, [[1200, -120], [1071 + j(10, 8), -120], [1076 + j(11, 8), 800], [1070 + j(12, 8), 1500], [1077 + j(13, 8), 2040], [1200, 2040]]);
  for (let i = 0; i < 12; i++) hardFill(p, 320 + i, i % 2 ? '#d8d2c0' : '#3a3228', ell(80 + hash(940 + i) * 920, 120 + hash(950 + i) * 700, 1.5 + hash(960 + i) * 3, 1.5 + hash(970 + i) * 2.5, 7));
  p.ink(340, 'rotring', '#e6dfcb', 1.0);
  p.brush.line(210, 40, 214, 760);
  p.brush.line(884, 300, 880, 560);
  p.ink(341, 'rotring', '#2a241c', 1.0);
  p.brush.line(640, 30, 650, 330);
};

/**
 * Era plate, option A (user decision 2 Nov 2026): the same stockade and closed gate as `paintEra`, painted as a glass-plate photograph rather than graded:
 * a toned monochrome value scale (warm grey-brown shadows, cream highlights, a trace of cold cyan in the sky), long-exposure softness on the snow with a
 * faint ghost of motion, posts as dark flat weathered shapes (no gold rim), an uneven plate edge, dust and scratch marks. The overlay (`EraPhotoFinish` in
 * src/painted/shots/wendigo.tsx) adds the vignette, a bottom shade for the caption band and heavier grain. Pure function of `t`.
 */
export const paintEraPhoto = (p: Painter, t: number) => {
  const {horizon: HZ, base: B, x0, x1, gate} = ERA;
  // sky: dark at the top, bleached near the horizon (long exposure), a trace of cyan, soft cloud banks
  washAt(p, 1, '#a9aeab', 255, rectPts(-120, -120, W + 120, HZ + 40), 0.2, 0.7);
  washAt(p, 2, '#8f9a9b', 190, rectPts(-120, -120, W + 120, 360), 0.5, 0.8);
  washAt(p, 3, '#c9c3b0', 200, band(3, 520, HZ + 20, 60), 0.6, 0.8);
  washAt(p, 4, '#dad3bf', 170, blob(4, 400, HZ - 70, 520, 70, 0), 0.8, 0.8);
  washAt(p, 5, '#8a9596', 90, blob(5, 760, 250, 420, 60, t * 0.05), 0.9, 0.9);
  washAt(p, 6, '#9aa2a0', 70, blob(6, 220, 430, 360, 40, 0), 0.9, 0.9);
  // far tree line: a soft grey smear (out of focus)
  washAt(p, 7, '#8d8776', 150, [[-120, HZ], ...Array.from({length: 12}, (_, i): Pt => [-120 + i * 110, HZ - 18 - hash(40 + i) * 20]), [1200, HZ], [1200, HZ + 4]], 0.7, 0.7);
  // snow plain: mid warm grey, brighter band at the foot of the stockade, falling to dark in the foreground; long-exposure softness
  washAt(p, 8, '#8c8779', 255, rectPts(-120, HZ, W + 120, H + 120), 0.3, 0.6);
  washAt(p, 9, '#aaa595', 160, blob(9, 540, HZ + 60, 640, 46, 0), 0.8, 0.8);
  washAt(p, 10, '#6a6659', 140, band(10, 1000, 1100, 20), 0.7, 0.8);
  washAt(p, 11, '#b9b4a3', 70, ell(300 + 30 * Math.sin(t * 0.3), HZ + 120, 380, 8, 12), 0.8, 0.8); // ghost of motion: a streak that barely moves
  // posts: dark flat shapes with a weathered wash, no rim light
  const posts: {x: number; top: number; w: number; gatePost: boolean; lean?: number}[] = [];
  let x = x0;
  for (let i = 0; x < x1; i++) {
    const w = 40 + hash(800 + i) * 8;
    if (!(x + w > gate[0] - 30 && x < gate[1] + 30)) posts.push({x, top: 440 + hash(810 + i) * 120, w, gatePost: false, lean: (hash(820 + i) - 0.5) * 14});
    x += w + 4;
  }
  posts.push({x: gate[0] - 38, top: 360, w: 44, gatePost: true}, {x: gate[1] - 6, top: 360, w: 44, gatePost: true});
  hardFill(p, 20, '#2b2620', rectPts(gate[0], 500, gate[1], B));
  washAt(p, 21, '#4b4337', 120, rectPts(gate[0] + 6, 510, gate[1] - 6, B - 6), 0.3, 0.7);
  hardFill(p, 29, '#241f1a', rectPts(gate[0] - 38, 430, gate[1] + 38, 454));
  posts.forEach((q, i) => {
    const tip: Pt = [q.x + q.w * 0.5 + (q.lean ?? 0), q.top - 14 - (q.gatePost ? 16 : 14 * hash(830 + i))];
    hardFill(p, 40 + i, q.gatePost ? '#1d1914' : '#2a251f', [[q.x, B], [q.x, q.top], tip, [q.x + q.w, q.top], [q.x + q.w, B]]);
    washAt(p, 200 + i, '#4d4538', 90 + 60 * hash(840 + i), [[q.x + 4, B - 6], [q.x + 4, q.top + 10 + 40 * hash(850 + i)], [q.x + q.w * 0.45, q.top + 20], [q.x + q.w * 0.45, B - 6]], 0.4, 0.8); // weathered grey wash on the lit half
  });
  // ink: thin dark seams between posts and on the gate, softer than the modern plate
  p.ink(120, 'rotring', '#14110d', 1.1);
  posts.forEach((q) => p.brush.line(q.x + q.w, q.top, q.x + q.w, B));
  p.ink(22, 'rotring', '#14110d', 2.2);
  p.brush.line((gate[0] + gate[1]) / 2, 500, (gate[0] + gate[1]) / 2, B);
  [580, 710].forEach((yy) => p.brush.line(gate[0], yy, gate[1], yy));
  // snow banked at the foot, soft
  washAt(p, 130, '#c2bdac', 200, band(130, B - 12, B + 34, 10), 0.5, 0.7);
  washAt(p, 132, '#c9c3b2', 90, blob(132, 560, B + 50, 520, 20, t * 0.1), 0.8, 0.8);
  eraPlateMarks(p);
};

/**
 * ERA-K4 (S03-B01-SH03, WDG-SS-R2.2 option A, Boat conditions 1-6): a generic back-view silhouette in the era glass-plate photograph. Flat plate shape, no rig
 * (the kit's `man-parted + P01` back view carries wardrobe and limb detail that a single dark fill would not hold). One figure: feet (540, 1180), head top
 * y 440, shoulders 230 px, plain long coat to the shin, head slightly bowed, arms inside the coat outline; soft long-exposure edge from two halo layers.
 * Background: overexposed sky brightest behind the head and shoulders, the low palisade (top near y 1000, ground 1060), snow. Pure function of nothing.
 */
export const ERA_K4 = {feet: [540, 1180] as Pt, top: 440, shoulders: 230, horizon: 1060, fenceTop: 1000};
/** Body and head as two convex-safe polygons (one outline with the head appended self-crosses and paints a seam). */
export const eraSilhouette = (): Pt[][] => {
  const cx = 540;
  const left: Pt[] = [[-24, 548], [-60, 566], [-112, 590], [-116, 650], [-113, 780], [-106, 890], [-110, 1010], [-122, 1120], [-46, 1130], [-40, 1160], [-50, 1180]];
  const right: Pt[] = [[50, 1180], [40, 1160], [46, 1130], [122, 1120], [110, 1010], [106, 890], [113, 780], [116, 650], [112, 590], [60, 566], [24, 548]];
  // head bowed to the viewer's left by a few pixels, chin tucked: an ellipse over the neck
  const head = ell(cx - 9, 494, 41, 56, 24, -0.12);
  return [[...left.map(([x, y]): Pt => [cx + x, y]), ...right.map(([x, y]): Pt => [cx + x, y])], head];
};
/** `t` = shot-local seconds: only the cloud banks drift (t = 0 is ERA-K4 exactly); the figure, fence and plate marks are static. */
export const paintEraSilhouette = (p: Painter, t = 0) => {
  const {horizon: HZ, fenceTop: FT} = ERA_K4;
  const B = 1080;
  // sky: dim at the top, bleached to near-white behind the head and shoulders, bright to the horizon
  washAt(p, 1, '#b3b6b0', 255, rectPts(-120, -120, W + 120, HZ + 40), 0.2, 0.7);
  washAt(p, 2, '#9aa3a2', 180, rectPts(-120, -120, W + 120, 300), 0.5, 0.8);
  washAt(p, 3, '#d6d1bf', 210, band(3, 380, HZ + 20, 60), 0.6, 0.8);
  washAt(p, 4, '#ece6d2', 230, blob(4, 540, 560, 520, 330, 0), 0.8, 0.8);
  washAt(p, 5, '#f4efdc', 220, blob(5, 540, 580, 300, 200, 0), 0.8, 0.8);
  washAt(p, 6, '#c7cbc4', 70, blob(6, 800, 220, 360, 40, t * 0.05), 0.9, 0.9);
  washAt(p, 7, '#8d8776', 120, [[-120, HZ], ...Array.from({length: 12}, (_, i): Pt => [-120 + i * 110, HZ - 12 - hash(40 + i) * 14]), [1200, HZ], [1200, HZ + 4]], 0.7, 0.7);
  // snow plain: mid warm grey falling to dark at the foot
  washAt(p, 8, '#8c8779', 255, rectPts(-120, HZ, W + 120, H + 120), 0.3, 0.6);
  washAt(p, 9, '#aaa595', 160, blob(9, 540, HZ + 60, 640, 40, 0), 0.8, 0.8);
  washAt(p, 10, '#6a6659', 140, band(10, 1150, 1260, 20), 0.7, 0.8);
  // the same low palisade as ERA-K1..K3, dark flat posts, no rim light
  let x = ERA.x0;
  for (let i = 0; x < ERA.x1; i++) {
    const w = 40 + hash(800 + i) * 8, top = FT + hash(810 + i) * 24, lean = (hash(820 + i) - 0.5) * 10;
    hardFill(p, 40 + i, '#2a251f', [[x, B], [x, top], [x + w * 0.5 + lean, top - 12 - 12 * hash(830 + i)], [x + w, top], [x + w, B]]);
    washAt(p, 200 + i, '#4d4538', 90 + 60 * hash(840 + i), [[x + 4, B - 6], [x + 4, top + 10 + 30 * hash(850 + i)], [x + w * 0.45, top + 18], [x + w * 0.45, B - 6]], 0.4, 0.8);
    x += w + 4;
  }
  p.ink(120, 'rotring', '#14110d', 1.1);
  for (let xx = ERA.x0 + 44; xx < ERA.x1; xx += 48) p.brush.line(xx, FT + 14, xx, B);
  washAt(p, 130, '#c2bdac', 200, band(130, B - 12, B + 34, 10), 0.5, 0.7);
  washAt(p, 132, '#c9c3b2', 90, blob(132, 560, B + 50, 520, 20, 0), 0.8, 0.8);
  // figure: two grown halos (3 px and 1.5 px) give a soft long-exposure edge, then the flat dark core
  const pts = eraSilhouette();
  const grow = (poly: Pt[], k: number): Pt[] => {
    const mx = poly.reduce((a, [px]) => a + px, 0) / poly.length, my = poly.reduce((a, [, py]) => a + py, 0) / poly.length;
    return poly.map(([px, py]): Pt => { const dx = px - mx, dy = py - my, d = Math.hypot(dx, dy) || 1; return [px + (dx / d) * k, py + (dy / d) * k]; });
  };
  pts.forEach((poly, i) => {
    washAt(p, 400 + i, '#1a1612', 110, grow(poly, 3), 0, 0);
    washAt(p, 410 + i, '#1a1612', 170, grow(poly, 1.5), 0, 0);
    hardFill(p, 420 + i, '#1c1814', poly);
  });
  eraPlateMarks(p);
};
