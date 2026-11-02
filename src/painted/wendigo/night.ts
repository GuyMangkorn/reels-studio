import {blob, ell, hardFill, inkLine, rectPts, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import type {Painter, Pt} from '../kit/painter';
import {KEY} from './look';

// WDG-EP01-SHORT night sets for the man shots: D07 night snow for the walk (S01-B03-SH01) and the tent wall behind the profile
// close-up (S01-B01-SH02). Pure functions of their arguments. Coordinates are plate px (1080x1920); the walk set is WORLD space
// (the camera follows the walker with `dx`, so the set is wider than the frame).

/** World x range painted for the walk: the walk scrolls 230 px/s for the 113-frame shot (867 px) and the frame is 1080 px wide (`D07`). */
export const WALK_WORLD = {x0: -1000, x1: 1180};
/** Ground line of the walker's feet (sheet: feet y 850). */
export const WALK_GROUND = 850;

/**
 * Night snow for the walk (D07): moon-blue sky, two rows of conifers (the far row slides at half the ground speed), a snow field with the
 * footprint ring seen edge-on as a row of flattened boot prints along the walker's line (the walker follows them), a few flakes.
 * `dx` = the camera drift (screen x = world x + dx), `t` = ambient seconds.
 */
export const paintNightWalk = (p: Painter, dx: number, t: number) => {
  const {x0, x1} = WALK_WORLD, w = x1 - x0;
  washAt(p, 1, KEY.nightDeep, 255, rectPts(x0 - 200, -120, x1 + 200, 2100), 0.05, 0.2);
  washAt(p, 2, '#1a3149', 200, rectPts(x0 - 200, 240, x1 + 200, 760), 0.4, 0.5);
  washAt(p, 3, '#2a4a66', 150, rectPts(x0 - 200, 470, x1 + 200, 700), 0.5, 0.6);
  // moon haze: a pale veil low on the far horizon
  washAt(p, 4, '#6f93b2', 70, blob(4, 620 - dx * 0.2, 560, 700, 120, 0), 0.7, 0.8);
  // far conifers (half speed): the screen position is world + dx / 2
  for (let i = 0; i < 42; i++) {
    const x = x0 - 300 + i * (w + 600) / 41 + hash(30 + i) * 18 - dx * 0.5, h = 90 + hash(60 + i) * 120, wd = 34 + hash(90 + i) * 22;
    washAt(p, 100 + i, '#10202f', 235, [[x - wd, 668], [x - wd * 0.35, 668 - h * 0.55], [x - wd * 0.6, 668 - h * 0.55], [x, 668 - h], [x + wd * 0.6, 668 - h * 0.55], [x + wd * 0.35, 668 - h * 0.55], [x + wd, 668]], 0.12, 0.4);
  }
  washAt(p, 150, '#142739', 240, rectPts(x0 - 200, 660, x1 + 200, 720), 0.2, 0.4);
  // near conifers (three quarters speed)
  for (let i = 0; i < 24; i++) {
    const x = x0 - 200 + i * (w + 400) / 23 + hash(160 + i) * 40 - dx * 0.25, h = 160 + hash(190 + i) * 200, wd = 54 + hash(220 + i) * 30;
    washAt(p, 200 + i, '#0b1826', 245, [[x - wd, 736], [x - wd * 0.3, 736 - h * 0.5], [x - wd * 0.55, 736 - h * 0.5], [x, 736 - h], [x + wd * 0.55, 736 - h * 0.5], [x + wd * 0.3, 736 - h * 0.5], [x + wd, 736]], 0.12, 0.4);
  }
  // snow field: moon-lit band round the walker's line, darker snow beyond
  washAt(p, 300, '#35546e', 250, rectPts(x0 - 200, 730, x1 + 200, 2100), 0.15, 0.4);
  washAt(p, 301, '#4b6d8a', 170, blob(301, 140, 800, 900, 120, 0), 0.5, 0.6);
  washAt(p, 302, '#4b6d8a', 150, blob(302, 700, 820, 900, 110, 0), 0.5, 0.6);
  washAt(p, 303, '#26405a', 180, rectPts(x0 - 200, 905, x1 + 200, 2100), 0.4, 0.5);
  // snow drifts: low pale mounds along the horizon
  for (let i = 0; i < 9; i++) washAt(p, 310 + i, '#5d819e', 130, blob(310 + i, x0 + 120 + i * 230 + hash(320 + i) * 60, 756 + hash(330 + i) * 14, 160 + hash(340 + i) * 70, 18 + hash(350 + i) * 8, 0), 0.5, 0.6);
  // the ring, edge-on: flattened boot prints in a row along the walker's line, each a dark hollow with a pale lip on its moonward edge
  for (let i = 0; i < 13; i++) {
    const cx = x0 + 24 + i * 176 + (hash(400 + i) - 0.5) * 14, cy = WALK_GROUND + 14 + 5 * Math.sin(i * 0.8);
    const k = 1 + 0.06 * Math.sin(i * 1.9);
    // boot-shaped hollow seen at a grazing angle: round heel at the left, narrower pointed toe at the right
    const sole = (grow: number): Pt[] => [[-58, 0], [-48, -9], [-20, -11], [20, -9], [50, -5], [66, 1], [48, 7], [18, 11], [-24, 11], [-50, 8]].map(([u, v]): Pt => [cx + u * k * (1 + grow / 60) + 2, cy + v * k * (1 + grow / 14)]);
    washAt(p, 410 + i, '#a5bdd0', 170, sole(8), 0.15, 0.3);
    washAt(p, 440 + i, '#1a2d40', 235, sole(0), 0.15, 0.3);
    hardFill(p, 470 + i, '#142435', sole(-2).map(([x, y]): Pt => [x + 3, y + 1]));
  }
  // flakes, slow: a deterministic drift on the ambient clock
  for (let i = 0; i < 38; i++) {
    const fx = x0 + hash(500 + i) * w, fy = ((hash(540 + i) * 1500 + t * (14 + 12 * hash(580 + i))) % 1500) + 60;
    washAt(p, 600 + i, '#dce9f2', 120 + 90 * hash(620 + i), blob(600 + i, fx + 10 * Math.sin(t * 0.7 + i), fy, 3 + hash(640 + i) * 3, 2.6 + hash(660 + i) * 2.4, 0), 0.4, 0.4);
  }
};

/**
 * Tent wall behind the profile close-up (S01-B01-SH02, D01 backdrop): the canvas wall at screen left, the roof panel above it, soft folds,
 * seam stitches with warm pinholes on the lit left wall. The lantern pool and the cool rim are overlays.
 */
export const paintTentWall = (p: Painter, t: number) => {
  const sway = 5 * Math.sin(t * 1.3) + 3 * Math.sin(t * 0.7 + 1);
  washAt(p, 1, '#13233a', 255, rectPts(-120, -120, 1200, 2040), 0.05, 0.2);
  // roof panel (upper left) and wall panel (lower left), folded where they meet
  const ridge: Pt[] = [[-120, 380], [200, 250 + sway], [520, 110], [1200, -80], [1200, -120], [-120, -120]];
  washAt(p, 2, '#1f3a58', 235, ridge, 0.2, 0.4);
  washAt(p, 3, '#2c4c70', 235, [[-120, 380], [200, 250 + sway], [520, 110], [660, 80], [1200, 900], [-120, 1400]], 0.2, 0.4);
  washAt(p, 4, '#1a3050', 210, [[560, 90], [1200, -80], [1200, 960], [880, 930], [760, 400]], 0.3, 0.5);
  // lit left wall: a lighter, warmer panel where the lantern rakes, soft vertical folds
  washAt(p, 5, '#4f6a86', 140, blob(5, 120, 900, 420, 520, t * 0.2), 0.7, 0.7);
  for (let i = 0; i < 6; i++) washAt(p, 10 + i, '#183050', 90, [[40 + i * 90 + sway * 0.5, 420], [70 + i * 90 + sway * 0.5, 420], [90 + i * 96, 1500], [50 + i * 96, 1500]], 0.6, 0.6);
  // seams
  p.ink(20, 'rotring', '#07101b', 2);
  p.brush.line(-120, 380, 200, 250 + sway);
  p.brush.line(200, 250 + sway, 520, 110);
  p.brush.line(120, 420, 160, 1500);
  p.brush.line(420, 300, 440, 1300);
  // stitch holes along the seams: warm points where the lantern shows through
  for (let i = 0; i < 16; i++) {
    const y = 460 + i * 62, x = 120 + (y - 420) * 0.03;
    hardFill(p, 30 + i, i % 3 === 1 ? '#ffd994' : '#d99048', ell(x + (hash(50 + i) - 0.5) * 3, y, 2.4, 1.8, 6));
  }
  // floor: dark ground sheet at the bottom
  washAt(p, 60, '#0b1623', 235, rectPts(-120, 1500, 1200, 2040), 0.1, 0.3);
  inkLine(p, 61, [[-120, 1500], [1200, 1500]], {closed: false, color: '#06101a', weight: 1.4});
};
