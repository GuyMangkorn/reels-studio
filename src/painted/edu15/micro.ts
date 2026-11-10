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

export const S = 12; // px per um (brief SH05 camera 70 um at f 1000 ~ 14 px/um; 12 keeps three hairs' fans readable)
const X0 = 540, Y0 = 430; // screen point of the field's origin (x 0 um, contact line)

/** Plaster underside height (um, positive = up into the plaster) at x (um): a sum of smooth bumps, deterministic. */
export const surfaceUm = (x: number) => 2.4 * Math.sin(x * 0.21 + 0.6) + 1.5 * Math.sin(x * 0.47 + 2.1) + 0.9 * Math.sin(x * 1.13 + 0.3) + 0.6 * Math.sin(x * 0.083);
const sy = (x: number) => Y0 - surfaceUm(x) * S;
const px = (x: number) => X0 + x * S;

export const paintMicroContact = (p: Painter, o: {t: number; glints: number}): Record<string, number> => {
  p.flat(C.microField, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
  washAt(p, 64000, '#4a3a2c', 120, [[0, 0], [380, 0], [260, 1920], [0, 1920]], 0.5, 0.2); // warm side light (lamp side)
  washAt(p, 64001, '#161310', 160, [[0, 1150], [1080, 1150], [1080, 1920], [0, 1920]], 0.4, 0.2);
  // plaster section: body, dips darker, grain
  const top: Pt[] = [];
  for (let x = -48; x <= 48; x += 0.5) top.push([px(x), sy(x)]);
  const back = top.slice().reverse();
  hardFill(p, 64010, C.microPlaster, [[-40, -10], [1120, -10], ...back]);
  hardFill(p, 64011, mixColor(C.microPlaster, '#fff8e8', 0.2), [[-40, -10], [1120, -10], ...back.map(([a, b]) => [a, b - 40] as Pt)]);
  for (let x = -48; x <= 48; x += 1) { // dips darker along the edge
    const h = surfaceUm(x);
    if (h > 1.2) washAt(p, 64020 + Math.round(x + 48), C.microDip, 90, [[px(x - 0.6), sy(x - 0.6)], [px(x + 0.6), sy(x + 0.6)], [px(x + 0.6), sy(x + 0.6) - 26], [px(x - 0.6), sy(x - 0.6) - 26]], 0.3, 0.2);
  }
  for (let i = 0; i < 120; i++) { const x = (hash(64200 + i) - 0.5) * 96, d = 4 + hash(64400 + i) * 28; hardFill(p, 64600 + i, mixColor(C.microDip, C.microPlaster, hash(64500 + i)), ell(px(x), sy(x) - d, 3 + 6 * hash(64700 + i), 2 + 3 * hash(64800 + i), 8)); }
  inkLine(p, 64900, top, {closed: false, weight: 1.4, color: mixColor(C.microDip, '#3a3026', 0.4), still: true, curve: 0.2});

  // hairs in three depth rows (far -> near): x positions, scale, colours
  let tips = 0, lit = 0;
  const rows = [{k: 0.62, dx: 4, shade: 0.72, seed: 65000}, {k: 0.8, dx: 0, shade: 0.45, seed: 70000}, {k: 1, dx: 2, shade: 0.0, seed: 75000}];
  const glintAt: [Pt, number][] = [];
  for (const row of rows) {
    const sp = 8 / row.k * 1.0, w = 5 * row.k;
    for (let hx = -48 + row.dx; hx <= 48; hx += sp) {
      const hid = row.seed + Math.round((hx + 60) * 10);
      const x = hx + (hash(hid) - 0.5) * 2.5;
      const branchY = 20 + 4 * hash(hid + 1); // um below the contact line where the shaft branches
      const shaftTop: Pt = [px(x), Y0 + branchY * S];
      const body = mixColor('#7a6650', C.microField, row.shade * 0.85), rim = mixColor(C.hair, C.microField, row.shade * 0.8);
      // shaft: dark body with a warm rim on the lamp side, slight lean
      const lean = 1.4 * (hash(hid + 2) - 0.5);
      const shaft: Pt[] = [[px(x - w / 2 + lean), 1960], [px(x + w / 2 + lean), 1960], [shaftTop[0] + (w / 2) * S * 0.7, shaftTop[1]], [shaftTop[0] - (w / 2) * S * 0.7, shaftTop[1]]];
      hardFill(p, hid + 10, body, shaft);
      inkLine(p, hid + 11, [[px(x - w / 2 + lean) + 2, 1960], [shaftTop[0] - (w / 2) * S * 0.7 + 2, shaftTop[1]]], {closed: false, weight: 1.8 * row.k, color: rim, still: true});
      // branches (4) then stalks (about 50 each) fanning up to the surface
      const nb = 4;
      for (let b = 0; b < nb; b++) {
        const bx = x + (b - 1.5) * 2.2 * row.k, by = branchY - 7 - 2 * hash(hid + 20 + b);
        const bp: Pt = [px(bx), Y0 + by * S];
        inkLine(p, hid + 30 + b, [shaftTop, bp], {closed: false, weight: 2.4 * row.k, color: mixColor(body, rim, 0.3), still: true});
        const ns = row.k < 0.7 ? 22 : row.k < 0.9 ? 34 : 50;
        for (let s = 0; s < ns; s++) {
          const sid = hid + 100 + b * 60 + s;
          const tx = bx + ((s / (ns - 1)) - 0.5) * 3.8 * row.k + (hash(sid) - 0.5) * 0.6;
          const ty = sy(tx);
          const mid: Pt = [(bp[0] + px(tx)) / 2 + (hash(sid + 1) - 0.5) * 6, (bp[1] + ty) / 2 + 10];
          const colS = mixColor(rim, C.microField, 0.15 + row.shade * 0.5);
          inkLine(p, sid, [bp, mid, [px(tx), ty + 4]], {closed: false, weight: 0.55 * row.k + 0.2, color: colS, still: true, curve: 0.4});
          // the flat tip (spatula) lying along the surface
          const sl = (surfaceUm(tx + 0.3) - surfaceUm(tx - 0.3)) / 0.6, ang = Math.atan2(-sl, 1);
          hardFill(p, sid + 3000000, mixColor(C.hair, C.microField, row.shade * 0.6), ell(px(tx), ty + 2, 3.2 * row.k + 0.6, 1.1, 6, ang));
          tips++;
          if (hash(sid + 7) < o.glints * (row.k > 0.9 ? 1 : 0.7)) { glintAt.push([[px(tx), ty + 1], row.k]); lit++; }
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
