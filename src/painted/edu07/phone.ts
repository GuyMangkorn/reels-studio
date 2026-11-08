import {ell, hardFill, INK, washAt} from '../kit/draw';
import {animalMotion} from '../kit/animal-motions';
import {drawAnimal, ANIMALS} from '../kit/animals';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {nearCam} from './cast';
import {CUS_AT} from './soi';

// EDU-EP07-SHORT phone props (scene sheets EDU-EP07-SHEETS-R1.2 SD13/SD14, Boss W5.2 R1.2). The phone is a flat card squared to the lens like every prop in
// this set (the screen faces the camera while CUS looks down into it: a deliberate cheat so the clip reads). Pure functions of a clip clock; no alert,
// notification, badge, glow or sound of any kind appears on it (fact-check C12: nothing may warn before 00:00).
//   phone-watch  (S01-B03-SH05)  seated, the phone held up at chin height beside his face
//   phone-screen (S01-B03-SH05)  the close prop: 0.10 x 0.19 m dark slab (SD13 said 0.09 x 0.17; enlarged 1.1x so the cat reads at 540 px), painted screen showing one cat clip: kit `cat-orange-tabby`, `startle-hop`
//   pocket-phone (S01-B03-SH04)  the phone hand drops to the trouser pocket and returns to the knee (see `pocketK`)

/** Phone body in metres (SD13: stylised, about 1.2x a real phone, scaled to the 4-head cast). */
export const PHONE_W = 0.10, PHONE_H = 0.19;

const roundRect = (cx: number, cy: number, w: number, h: number, r: number, a = 0): Pt[] => {
  const pts: Pt[] = [], ca = Math.cos(a), sa = Math.sin(a);
  for (const [sx, sy, a0] of [[1, 1, 0], [-1, 1, 0.5], [-1, -1, 1], [1, -1, 1.5]] as const) {
    for (let i = 0; i <= 4; i++) {
      const th = (a0 + i / 8) * Math.PI, x = sx * (w / 2 - r) + r * Math.cos(th), y = sy * (h / 2 - r) + r * Math.sin(th);
      pts.push([cx + x * ca - y * sa, cy + x * sa + y * ca]);
    }
  }
  return pts;
};

/** The painted cat clip on a screen of `w` x `h` px centred at (cx, cy): `clipT` seconds into the clip (negative = the previous clip, a plain colour card). */
const paintClip = (p: Painter, cx: number, cy: number, w: number, h: number, clipT: number, tilt: number, seed: number) => {
  const rot = (x: number, y: number): Pt => [cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt)];
  const quad = (x0: number, y0: number, x1: number, y1: number): Pt[] => [rot(x0, y0), rot(x1, y0), rot(x1, y1), rot(x0, y1)];
  const hw = w / 2, hh = h / 2;
  if (clipT < 0) { // the previous clip: a plain muted card, nothing on it
    hardFill(p, seed, '#c9d6d3', quad(-hw, -hh, hw, hh));
    hardFill(p, seed + 1, '#aebfbb', quad(-hw, hh * 0.35, hw, hh));
    return;
  }
  hardFill(p, seed, '#f4e1c6', quad(-hw, -hh, hw, hh)); // wall
  hardFill(p, seed + 1, '#c99f72', quad(-hw, hh * 0.28, hw, hh)); // floor
  hardFill(p, seed + 2, '#e7cfae', quad(-hw, hh * 0.28 - 2, hw, hh * 0.28 + 2));
  const cat = ANIMALS['cat-orange-tabby'], m = animalMotion('startle-hop', clipT, {animal: 'cat-orange-tabby', view: 'front'});
  const cu = (w / PHONE_W_SCREEN) * 0.3; // px per metre of the cat: a 7.5 cm cat on an 8.8 cm screen (the clip must read at 540 px)
  const g = rot(0, hh * 0.78 - m.offset[1] * cu);
  drawAnimal(p, seed + 10, cat, [g[0] + m.offset[0] * cu, g[1]], cu, m.pose, clipT);
  hardFill(p, seed + 4, '#ffffff', quad(-hw + 4, hh - 5, -hw + 4 + (w - 8) * Math.min(1, clipT / 3 + 0.25), hh - 3)); // the player's progress line
};
const PHONE_W_SCREEN = PHONE_W - 0.012;

/**
 * Draws the phone at the world point `centre` (a card squared to the lens, tilted `tilt` rad) and CUS's hand under it. `clipT` is the clip clock in seconds (negative: the previous clip).
 * Returns the phone's screen box [x0, y0, x1, y1] (unrotated extent) for measuring.
 */
export const paintPhone = (p: Painter, c: YCam, centre: V3, o: {clipT: number; tilt?: number; thumb?: number; seed?: number}): {box: [number, number, number, number]; screen: [number, number, number, number]} | null => {
  const q = camPoint(c, centre);
  if (!q) return null;
  const u = camUnit(c, centre), tilt = o.tilt ?? 0, seed = o.seed ?? 1260;
  const w = PHONE_W * u, h = PHONE_H * u, edge = 0.006 * u;
  const body = roundRect(q[0], q[1], w, h, 0.012 * u, tilt);
  hardFill(p, seed, '#1f2326', body);
  p.ink(seed + 1, 'rotring', INK, 0.8); p.brush.spline([...body, body[0]], 0.1);
  const sw = w - 2 * edge, sh = h - 2 * edge * 1.6;
  paintClip(p, q[0], q[1], sw, sh, o.clipT, tilt, seed + 10);
  const scr = roundRect(q[0], q[1], sw, sh, 0.004 * u, tilt);
  p.ink(seed + 2, 'rotring', mixColor('#1f2326', INK, 0.5), 0.4); p.brush.spline([...scr, scr[0]], 0.1);
  // a soft glass sheen (diagonal, pale), not a glow
  const sx = (x: number, y: number): Pt => [q[0] + x * Math.cos(tilt) - y * Math.sin(tilt), q[1] + x * Math.sin(tilt) + y * Math.cos(tilt)];
  washAt(p, seed + 3, '#ffffff', 22, [sx(-sw / 2, -sh / 2), sx(-sw * 0.05, -sh / 2), sx(-sw / 2, -sh * 0.12)], 0.1, 0.1);
  // the holding thumb: on the left edge of the slab, over the screen margin
  const th = o.thumb ?? 0;
  const tp = sx(-w / 2 + 0.002 * u, h * 0.2 + th * 0.03 * u);
  const thumb = ell(tp[0], tp[1], 0.014 * u, 0.024 * u, 10, tilt + 0.25);
  hardFill(p, seed + 5, '#e2b48f', thumb);
  p.ink(seed + 6, 'rotring', INK, 0.5); p.brush.spline([...thumb, thumb[0]], 0.1);
  const bx = [q[0] - w / 2, q[0] + w / 2], by = [q[1] - h / 2, q[1] + h / 2];
  return {box: [bx[0], by[0], bx[1], by[1]], screen: [q[0] - sw / 2, q[1] - sh / 2, q[0] + sw / 2, q[1] + sh / 2]};
};

/** A cool screen light on CUS's chin and cheek (alpha <= 0.15), centred on his chin anchor, toward the phone side. */
export const screenGlow = (p: Painter, chin: Pt, unit: number, side: -1 | 1, k: number) => {
  washAt(p, 1290, '#bfe0ff', 255 * 0.15 * k, ell(chin[0] + side * 0.05 * unit, chin[1] - 0.035 * unit, 0.07 * unit, 0.05 * unit, 14), 0.5, 0.2);
};

/** Where the phone sits relative to CUS in the close: a point beside his face (screen-left), in front of his chest toward the lens (SD13, est). */
export const phoneWorld = (c: YCam, right = -0.2, up = 1.03, toward = 0.28): V3 => nearCam(c, CUS_AT, right, up, toward);
