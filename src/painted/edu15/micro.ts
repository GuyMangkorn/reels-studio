import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {C} from './palette';

// SET-SETAMICRO look (brief N3, VD15/VD16; LF04; Film W3). Space U in MICROMETRES drawn as a side section (one plane, screen px = S per um):
// the plaster's bumpy underside along the top of the frame (bumps 2-6 um high, 10-40 um apart), hairs (5 um wide, about 8 um apart) rising
// from below in three depth rows, each splitting near its end (about 4 branches, then about 50 stalks each: about 200 visible tips, never
// counted) into flat tips that settle along the bumps and into the dips. Contact glints (a point and a short halo) where a tip touches, a
// short amber pull-line from each glint down the stalk. Dark warm field, warm rim from the lamp side (screen left). LF04 = S01-B03-SH06 @ +45:
// glints spreading over the field (fraction `glints` of the tips lit).

export const S0 = 12; // px per um (brief SH05 camera 70 um at f 1000 ~ 14 px/um; 12 keeps three hairs' fans readable)
const X00 = 540, Y0 = 430; // screen point of the field's origin (x 0 um, contact line)

/** Plaster underside height (um, positive = up into the plaster) at x (um): a sum of smooth bumps, deterministic. */
export const surfaceUm = (x: number) => 2.4 * Math.sin(x * 0.21 + 0.6) + 1.5 * Math.sin(x * 0.47 + 2.1) + 0.9 * Math.sin(x * 1.13 + 0.3) + 0.6 * Math.sin(x * 0.083);

export const paintMicroContact = (p: Painter, o: {t: number; glints: number; /** Truck: field shifted left by this many um (camera x). */ truck?: number; /** Tips settling 0 = hanging 100+ px below the surface, 1 = in the bumps. */ settle?: number; /** Pixels per um (default 12; smaller = zoomed out about the contact point). */ S?: number; /** Settle per hair row (back, middle, front) overriding `settle` (shot 16: the rows let go in sequence). */ settleRows?: [number, number, number]; /** Longest drawn shaft below the branch point, px (default: to the plate's foot); shot 16 caps it so no column crosses the room view. */ shaftMax?: number; /** Hair depths below the contact line keep the default scale while `S` grows, so no stroke grows past its setae row block (shot 16 loupe-out). */ capLen?: boolean}): Record<string, number> => {
  const S = o.S ?? S0, settle0 = o.settle ?? 1, X0 = X00 - (o.truck ?? 0) * S;
  const sy = (x: number) => Y0 - surfaceUm(x) * S, px = (x: number) => X0 + x * S;
  p.flat(C.microField, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
  washAt(p, 64000, '#4a3a2c', 120, [[0, 0], [380, 0], [260, 1920], [0, 1920]], 0.5, 0.2); // warm side light (lamp side)
  washAt(p, 64001, '#161310', 160, [[0, 1150], [1080, 1150], [1080, 1920], [0, 1920]], 0.4, 0.2);
  // plaster section: body, dips darker, grain
  const top: Pt[] = [];
  for (let x = -75; x <= 75; x += 0.5) top.push([px(x), sy(x)]);
  const back = top.slice().reverse();
  hardFill(p, 64010, C.microPlaster, [[-40, -10], [1120, -10], ...back]);
  hardFill(p, 64011, mixColor(C.microPlaster, '#fff8e8', 0.2), [[-40, -10], [1120, -10], ...back.map(([a, b]) => [a, b - 40] as Pt)]);
  for (let x = -75; x <= 75; x += 1) { // dips darker along the edge
    const h = surfaceUm(x);
    if (h > 1.2) washAt(p, 64020 + Math.round(x + 75), C.microDip, 90, [[px(x - 0.6), sy(x - 0.6)], [px(x + 0.6), sy(x + 0.6)], [px(x + 0.6), sy(x + 0.6) - 26], [px(x - 0.6), sy(x - 0.6) - 26]], 0.3, 0.2);
  }
  for (let i = 0; i < 120; i++) { const x = (hash(64200 + i) - 0.5) * 150, d = 4 + hash(64400 + i) * 28; hardFill(p, 64600 + i, mixColor(C.microDip, C.microPlaster, hash(64500 + i)), ell(px(x), sy(x) - d, 3 + 6 * hash(64700 + i), 2 + 3 * hash(64800 + i), 8)); }
  inkLine(p, 64900, top, {closed: false, weight: 1.4, color: mixColor(C.microDip, '#3a3026', 0.4), still: true, curve: 0.2});

  // hairs in three depth rows (far -> near): x positions, scale, colours
  let tips = 0, lit = 0;
  const rows = [{k: 0.62, dx: 4, shade: 0.72, seed: 65000}, {k: 0.8, dx: 0, shade: 0.45, seed: 70000}, {k: 1, dx: 2, shade: 0.0, seed: 75000}];
  const glintAt: [Pt, number][] = [];
  for (const [ri, row] of rows.entries()) {
    const settle = o.settleRows?.[ri] ?? settle0;
    const sp = 8 / row.k * 1.0, w = 5 * row.k;
    for (let hx = -48 + row.dx - sp * Math.ceil(27 / sp); hx <= 75; hx += sp) {
      const hid = row.seed + Math.round((hx + 60) * 10);
      const x = hx + (hash(hid) - 0.5) * 2.5;
      const branchY = 20 + 4 * hash(hid + 1); // um below the contact line where the shaft branches
      const Sv = o.capLen ? Math.min(S, S0) : S;
      const shaftTop: Pt = [px(x), Y0 + branchY * Sv];
      const body = mixColor('#7a6650', C.microField, row.shade * 0.85), rim = mixColor(C.hair, C.microField, row.shade * 0.8);
      // shaft: dark body with a warm rim on the lamp side, slight lean
      const lean = 1.4 * (hash(hid + 2) - 0.5);
      const yb = o.shaftMax ? Math.min(1920, shaftTop[1] + o.shaftMax) : 1920;
      const shaft: Pt[] = [[px(x - w / 2 + lean), yb], [px(x + w / 2 + lean), yb], [shaftTop[0] + (w / 2) * S * 0.7, shaftTop[1]], [shaftTop[0] - (w / 2) * S * 0.7, shaftTop[1]]];
      hardFill(p, hid + 10, body, shaft);
      inkLine(p, hid + 11, [[px(x - w / 2 + lean) + 2, yb], [shaftTop[0] - (w / 2) * S * 0.7 + 2, shaftTop[1]]], {closed: false, weight: 1.8 * row.k, color: rim, still: true});
      // branches (4) then stalks (about 50 each) fanning up to the surface
      const nb = 4;
      for (let b = 0; b < nb; b++) {
        const bx = x + (b - 1.5) * 2.2 * row.k, by = branchY - 7 - 2 * hash(hid + 20 + b);
        const bp: Pt = [px(bx), Y0 + by * Sv];
        inkLine(p, hid + 30 + b, [shaftTop, bp], {closed: false, weight: 2.4 * row.k, color: mixColor(body, rim, 0.3), still: true});
        const ns = row.k < 0.7 ? 22 : row.k < 0.9 ? 34 : 50;
        for (let s = 0; s < ns; s++) {
          const sid = hid + 100 + b * 60 + s;
          const tx = bx + ((s / (ns - 1)) - 0.5) * 3.8 * row.k + (hash(sid) - 0.5) * 0.6;
          const gap = (1 - settle) * (30 + 40 * hash(sid + 11)) * (S / S0), ty = sy(tx) + gap;
          const mid: Pt = [(bp[0] + px(tx)) / 2 + (hash(sid + 1) - 0.5) * 6, (bp[1] + ty) / 2 + 10];
          const colS = mixColor(rim, C.microField, 0.15 + row.shade * 0.5);
          inkLine(p, sid, [bp, mid, [px(tx), ty + 4]], {closed: false, weight: 0.55 * row.k + 0.2, color: colS, still: true, curve: 0.4});
          // the flat tip (spatula) lying along the surface
          const sl = ((surfaceUm(tx + 0.3) - surfaceUm(tx - 0.3)) / 0.6) * settle + (hash(sid + 13) - 0.5) * 1.6 * (1 - settle), ang = Math.atan2(-sl, 1);
          hardFill(p, sid + 3000000, mixColor(C.hair, C.microField, row.shade * 0.6), ell(px(tx), ty + 2, 3.2 * row.k + 0.6, 1.1, 6, ang));
          tips++;
          if (settle > 0.95 && hash(sid + 7) < o.glints * (row.k > 0.9 ? 1 : 0.7)) { glintAt.push([[px(tx), ty + 1], row.k]); lit++; }
        }
      }
    }
  }
  // glints: halo + point + amber pull-line down the stalk
  glintAt.forEach(([[gx, gy], k], i) => {
    washAt(p, 80000 + i, C.glint, 70, ell(gx, gy, 9 * k, 7 * k, 10), 0.3, 0.2);
    inkLine(p, 81000 + i, [[gx, gy + 2], [gx + (hash(80500 + i) - 0.5) * 3, gy + 16 * k]], {closed: false, weight: 1.2 * k, color: C.pull, still: true});
    hardFill(p, 82000 + i, '#fffdf2', ell(gx, gy, 2.2 * k, 2.2 * k, 6));
  });
  void o.t;
  return {pxPerUm: S, contactY: Y0, tips, glintsLit: lit};
};

/** Shot 8 (S01-B03-SH02): one hero hair seen from the side, the camera trucking up the shaft (`yc` = camera height along the hair in um, 20..115) to the branching tips under the plaster.
 * Hair 5 um wide; the shaft splits into about 4 branches, each into about 50 stalks that fan into flat tips along the plaster (`fan` 0..1 = how many have opened). Softer neighbours either side. */
export const paintMicroHair = (p: Painter, o: {t: number; yc: number; fan: number; arc?: number}): Record<string, number> => {
  const S = 14, Sy = (yu: number) => 560 - (yu - o.yc) * S, ARC = (o.arc ?? 0), X = 540;
  const surf = (x: number) => 112 + surfaceUm(x * 1.0) * 0.55; // plaster underside height (um) over the hair
  p.flat(C.microField, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
  washAt(p, 64000, '#4a3a2c', 120, [[0, 0], [380, 0], [260, 1920], [0, 1920]], 0.5, 0.2);
  washAt(p, 64001, '#161310', 160, [[0, 1150], [1080, 1150], [1080, 1920], [0, 1920]], 0.4, 0.2);
  // plaster section along the top once it comes into view
  const top: Pt[] = [];
  for (let x = -40; x <= 40; x += 0.5) top.push([X + x * S, Sy(surf(x))]);
  if (top.some(([, y]) => y > -40)) {
    hardFill(p, 64010, C.microPlaster, [[-40, -10], [1120, -10], ...top.slice().reverse()]);
    hardFill(p, 64011, mixColor(C.microPlaster, '#fff8e8', 0.2), [[-40, -10], [1120, -10], ...top.slice().reverse().map(([a, b]) => [a, b - 60] as Pt)]);
    for (let x = -40; x <= 40; x += 1) if (surf(x) > 113.4) washAt(p, 64020 + Math.round(x + 40), C.microDip, 90, [[X + (x - 0.6) * S, Sy(surf(x - 0.6))], [X + (x + 0.6) * S, Sy(surf(x + 0.6))], [X + (x + 0.6) * S, Sy(surf(x + 0.6)) - 26], [X + (x - 0.6) * S, Sy(surf(x - 0.6)) - 26]], 0.3, 0.2);
    inkLine(p, 64900, top, {closed: false, weight: 1.4, color: mixColor(C.microDip, '#3a3026', 0.4), still: true, curve: 0.2});
  }
  let tips = 0;
  // hairs: neighbours first (far, dark), the hero last; each = shaft, 4 branches, stalks, tips
  const hairs = [{x: -17, k: 0.6, sh: 0.78, id: 66000}, {x: 17.5, k: 0.62, sh: 0.74, id: 67000}, {x: -8.5, k: 0.8, sh: 0.5, id: 68000}, {x: 9, k: 0.78, sh: 0.5, id: 69000}, {x: 0, k: 1, sh: 0, id: 70000}];
  for (const h of hairs) {
    const w = 5 * h.k, bx0 = h.x, lean = 1.2 * (hash(h.id) - 0.5) + ARC * 0.04 * (h.x === 0 ? 0 : 1);
    const body = mixColor('#7a6650', C.microField, h.sh * 0.85), rim = mixColor(C.hair, C.microField, h.sh * 0.8);
    const brY = 90 + 3 * hash(h.id + 1); // branching height (um)
    const xAt = (yu: number) => bx0 + lean * (yu / brY);
    const base: Pt = [X + xAt(brY) * S, Sy(brY)];
    const shaft: Pt[] = [[X + (xAt(-30) - w / 2) * S, Sy(-30)], [X + (xAt(-30) + w / 2) * S, Sy(-30)], [base[0] + (w / 2) * S * 0.7, base[1]], [base[0] - (w / 2) * S * 0.7, base[1]]];
    hardFill(p, h.id + 10, body, shaft);
    inkLine(p, h.id + 11, [[X + (xAt(-30) - w / 2) * S + 2, Sy(-30)], [base[0] - (w / 2) * S * 0.7 + 2, base[1]]], {closed: false, weight: 2.2 * h.k, color: rim, still: true});
    for (let t = 0; t < 14; t++) { // faint cuticle scale ticks along the shaft
      const yu = -20 + t * 8 + 3 * hash(h.id + 20 + t), cx = X + xAt(yu) * S, wi = (w / 2) * S * 0.7;
      inkLine(p, h.id + 30 + t, [[cx - wi, Sy(yu) + 5], [cx, Sy(yu)], [cx + wi, Sy(yu) + 5]], {closed: false, weight: 0.8, color: mixColor(body, '#1a1612', 0.35), still: true, curve: 0.4});
    }
    const nb = 4, ns = h.k < 0.7 ? 18 : h.k < 0.9 ? 30 : 50;
    for (let b = 0; b < nb; b++) {
      const grow = Math.min(1, Math.max(0, o.fan * 2.2 - b * 0.25)); // branches open one after another
      if (grow <= 0) continue;
      const bxx = bx0 + (b - 1.5) * 4.6 * h.k * grow, byy = brY + 5 + 3 * hash(h.id + 60 + b);
      const bp: Pt = [X + xAt(byy) * S + (bxx - bx0) * S, Sy(byy)];
      inkLine(p, h.id + 100 + b, [base, bp], {closed: false, weight: 2.6 * h.k, color: mixColor(body, rim, 0.3), still: true});
      for (let s2 = 0; s2 < ns; s2++) {
        const sid = h.id + 200 + b * 60 + s2, open = Math.min(1, Math.max(0, o.fan * 1.5 - 0.35 * hash(sid) - 0.05));
        if (open <= 0) continue;
        const tx = bx0 + (b - 1.5) * 4.6 * h.k + ((s2 / (ns - 1)) - 0.5) * 8.5 * h.k * open + (hash(sid + 1) - 0.5) * 0.5;
        const tyu = Math.min(surf(tx) - 0.3, (brY + 5) + (surf(tx) - brY - 5) * open);
        const tip: Pt = [X + tx * S, Sy(tyu)];
        const mid: Pt = [(bp[0] + tip[0]) / 2 + (hash(sid + 2) - 0.5) * 6, (bp[1] + tip[1]) / 2 + 6];
        inkLine(p, sid, [bp, mid, tip], {closed: false, weight: 0.9 * h.k + 0.3, color: mixColor(rim, C.microField, 0.1 + h.sh * 0.5), still: true, curve: 0.4});
        const sl = (surf(tx + 0.3) - surf(tx - 0.3)) / 0.6 * 0.55 * open;
        hardFill(p, sid + 3000000, mixColor(C.hair, C.microField, h.sh * 0.6), ell(tip[0], tip[1] + 1, 4.2 * h.k + 0.8, 1.4, 6, Math.atan2(-sl, 1)));
        if (h.k === 1) tips++;
        if (h.k === 1 && open > 0.9 && hash(sid + 5) < 0.12) washAt(p, sid + 4000000, '#fff0c8', 60, ell(tip[0] - 3, tip[1], 5, 3, 8), 0.3, 0.2); // warm rim light catching the tips
      }
    }
  }
  void o.t;
  return {pxPerUm: S, tips, camY: o.yc};
};
