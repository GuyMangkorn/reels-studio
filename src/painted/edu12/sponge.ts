// CARD-SPONGE (brief EDU-EP12-BRIEF-R1.1 VD06; LOOK-FRAME CODE, W3 R1.2). A screen card in the card zone x 460-1020, y 440-1040 (560 x 600,
// radius 28) over the dimmed B02-SH01 plate: a wet kitchen sponge (yellow, green scourer on top), three school books landing one by one,
// water squeezing out, the sponge flattening to 55 % height. Water only: the comparison never returns in space (F008). Close-up flat art.
import {ell, hardFill, inkLine} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {C} from './palette';

export const CARD = {x0: 460, y0: 440, w: 560, h: 600, r: 28} as const;

const rr = (x0: number, y0: number, x1: number, y1: number, r: number): Pt[] => {
  const out: Pt[] = [], cs: [number, number, number][] = [[x1 - r, y1 - r, 0], [x0 + r, y1 - r, 1], [x0 + r, y0 + r, 2], [x1 - r, y0 + r, 3]];
  for (const [cx, cy, i] of cs) for (let k = 0; k <= 5; k++) { const a = (i + k / 5) * (Math.PI / 2); out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  return out;
};

export type SpongeState = {
  /** Books landed 0..3 (fractional = the next book falling). */
  books: number;
  /** Card pop 0..1 (scale from the centre). */
  pop?: number;
};

/** The sponge card at its state; 3 books = flattened to 55 %, water out on both sides. */
export const paintSpongeCard = (p: Painter, s: SpongeState) => {
  const k = s.pop ?? 1, cx = CARD.x0 + CARD.w / 2, cy = CARD.y0 + CARD.h / 2;
  const T = ([x, y]: Pt): Pt => [cx + (x - cx) * k, cy + (y - cy) * k];
  const P = (pts: Pt[]) => pts.map(T);
  const x0 = CARD.x0, y0 = CARD.y0, x1 = x0 + CARD.w, y1 = y0 + CARD.h;
  hardFill(p.layer(0.35, 3001), 3000, '#0d0f14', P(rr(x0 + 8, y0 + 12, x1 + 8, y1 + 12, CARD.r)));
  hardFill(p, 3002, C.card, P(rr(x0, y0, x1, y1, CARD.r)));
  inkLine(p, 3003, P(rr(x0, y0, x1, y1, CARD.r)), {color: C.cardInk, weight: 1.6, still: true, curve: 0.02});
  // table top and the dish
  const ty = y0 + 455;
  hardFill(p, 3004, '#e3d6bd', P([[x0 + 2, ty], [x1 - 2, ty], [x1 - 2, y1 - CARD.r], [x0 + 2, y1 - CARD.r]]));
  hardFill(p, 3005, '#d7c8ab', P(rr(x0 + 2, y1 - 40, x1 - 2, y1 - 2, CARD.r)));
  inkLine(p, 3006, P([[x0 + 2, ty], [x1 - 2, ty]]), {color: C.cardInk, weight: 1.0, closed: false, still: true});
  // water state: squeeze grows with each landed book
  const n = Math.max(0, Math.min(3, s.books)), sq = n / 3;
  const flat = 1 - 0.45 * sq, spH = 150 * flat, spW = 380 + 30 * sq, sx0 = cx - spW / 2, sx1 = cx + spW / 2, sb = ty - 4, st = sb - spH;
  // puddle
  if (sq > 0) {
    hardFill(p.layer(0.75, 3007), 3007, C.water, P(ell(cx, sb + 6, spW / 2 + 70 * sq, 12 + 10 * sq, 30)));
    hardFill(p.layer(0.5, 3008), 3008, '#bfe3f4', P(ell(cx - 40, sb + 3, spW / 3, 5 + 3 * sq, 20)));
  }
  // sponge: yellow foam (pores), green scourer on top
  const scH = 28 * flat;
  hardFill(p, 3010, C.sponge, P(rr(sx0, st + scH, sx1, sb, 14)));
  hardFill(p, 3011, C.spongeShade, P([[sx0 + 6, sb - spH * 0.28], [sx1 - 6, sb - spH * 0.28], [sx1 - 8, sb - 4], [sx0 + 8, sb - 4]]));
  for (let i = 0; i < 16; i++) { const px = sx0 + 24 + ((i * 53) % (spW - 48)), py = st + scH + 10 + ((i * 29) % Math.max(8, spH - scH - 22)); hardFill(p, 3012 + i, mixColor(C.spongeShade, '#a7781b', 0.4), P(ell(px, py, 4.5, 3 * flat + 1.2, 8))); }
  hardFill(p, 3030, C.scourer, P(rr(sx0, st, sx1, st + scH + 6, 10)));
  inkLine(p, 3031, P(rr(sx0, st, sx1, sb, 14)), {color: C.cardInk, weight: 1.3, still: true, curve: 0.04});
  inkLine(p, 3032, P([[sx0 + 4, st + scH + 3], [sx1 - 4, st + scH + 3]]), {color: '#255a30', weight: 1.0, closed: false, still: true});
  // books stacked on the sponge: red, blue, green; each 44 px thick with a cream page edge; the next one falling from above
  const books: [string, number][] = [[C.bookR, -12], [C.bookB, 16], [C.bookG, -6]];
  let top = st;
  for (let i = 0; i < 3; i++) {
    const landed = n >= i + 1, falling = !landed && n > i;
    if (!landed && !falling) break;
    const drop = falling ? (1 - (n - i)) * 260 : 0, bw = 440, bh = 58, bx = cx - bw / 2 + books[i][1], by = top - bh - drop;
    hardFill(p, 3040 + i * 6, books[i][0], P(rr(bx, by, bx + bw, by + bh, 6)));
    hardFill(p, 3041 + i * 6, '#f7f1e2', P([[bx + 18, by + 10], [bx + bw - 6, by + 10], [bx + bw - 6, by + bh - 10], [bx + 18, by + bh - 10]]));
    for (let l = 0; l < 3; l++) inkLine(p, 3042 + i * 6 + l * 0, P([[bx + 24, by + 16 + l * 6], [bx + bw - 10, by + 16 + l * 6]]), {color: '#cfc4ad', weight: 0.6, closed: false, still: true});
    hardFill(p, 3044 + i * 6, mixColor(books[i][0], '#000000', 0.25), P([[bx, by], [bx + 18, by], [bx + 18, by + bh], [bx, by + bh]]));
    inkLine(p, 3045 + i * 6, P(rr(bx, by, bx + bw, by + bh, 6)), {color: C.cardInk, weight: 1.2, still: true, curve: 0.02});
    if (landed) top = by;
  }
  // squeeze: drops jumping out both sides, and a short impact tick pair over the top book on the third landing
  if (sq > 0) {
    for (let j = 0; j < 8; j++) {
      const side = j % 2 ? 1 : -1, t = ((j >> 1) + 1) / 4, dx = side * (spW / 2 + 18 + 60 * t * sq), dy = -10 - 40 * Math.sin(t * Math.PI) * sq;
      const dc: Pt = [cx + dx, sb - spH * 0.4 + dy], r = 6 + 3 * (1 - t);
      const drop: Pt[] = [...ell(dc[0], dc[1], r, r, 10).slice(0, 10), [dc[0] - side * r * 2.2, dc[1] - r * 0.6]];
      hardFill(p, 3070 + j, C.water, P(drop));
      inkLine(p, 3080 + j, P(drop), {color: '#2f6d8c', weight: 0.7, still: true});
    }
  }
  if (n >= 3) {
    for (const side of [-1, 1]) inkLine(p, 3090 + (side + 1), P([[cx + side * 240, top - 18], [cx + side * 270, top - 48]]), {color: C.cardInk, weight: 1.6, closed: false, still: true});
    inkLine(p, 3093, P([[cx, top - 26], [cx, top - 58]]), {color: C.cardInk, weight: 1.6, closed: false, still: true});
  }
};
