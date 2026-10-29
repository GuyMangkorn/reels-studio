import {AbsoluteFill} from 'remotion';
import {BrushCanvas, hash, type PaintContext} from '../BrushCanvas';
import {CAST, type Cast} from './CastSheet';
import {BROW_Y, CHIN, FACES, HEAD_SPAN, INK, headOutline, type Face, type HeadStyle} from './FaceSheet';
import {ellipse, limb, skeleton} from './ProportionSheet';

type Pt = [number, number];

// WORLD FOG side views (proposal): the cast of CastSheet in profile, facing right, at 4 heads; the delivery worker
// pushes the platform cart with the carton stack, helmet on top and umbrella hooked on the handle, then the same
// assembly from the front as a fog silhouette (the script's principal feasibility test: one continuous
// worker/cart/cargo/helmet). In pure profile the worker stands clear of the stack, so the illusion needs the front view.
// Real-world sizes assume the 4-head cast is 1.7 m tall. 1080x1920 frame.

const N = 4, UNIT = 190;
const M = (N * UNIT) / 1.7; // px per metre
const ROW1 = 900, ROW2 = 1810;
const FOG_PANEL = '#c3cbc9', SIL = '#3a4246';

type Paint = {
  /** Fill polygon (opaque decal block); `passes` > 4 for light over dark. */
  part: (color: string, pts: Pt[], outline?: boolean, passes?: number) => void;
  /** Ink line or open curve. */
  ink: (pts: Pt[], weight?: number, curve?: number) => void;
  /** Silhouette mode: everything one colour, no features or ink. */
  sil: boolean;
};

const makePaint = ({brush, still, boil}: PaintContext, base: number, sil?: string): Paint => {
  let seed = base, line = base + 900;
  const ink = (pts: Pt[], weight = 1.0, curve = 0.15) => {
    if (sil) return;
    boil(++line);
    brush.set('rotring', INK, weight);
    brush.spline(pts, curve);
  };
  return {
    sil: !!sil,
    ink,
    part: (color, pts, outline = true, passes = 4) => {
      // A silhouette is one merged mass, as fog makes it: no texture, so no inner edges show.
      const n = sil ? Math.max(passes, 6) : passes;
      for (let p = 0; p < n; p++) {
        still(++seed);
        brush.noStroke();
        brush.fill(sil ?? color, 255);
        brush.fillBleed(0);
        brush.fillTexture(sil ? 0 : 0.08, 0.2);
        brush.polygon(pts);
        brush.noFill();
      }
      if (outline) ink([...pts, pts[0]]);
    },
  };
};

/** Profile head facing +x, centred on (cx, cy), `K` px per head unit; same egg, eye and brows as the front head. */
const paintHeadSide = (p: Paint, cx: number, cy: number, K: number, face: Face, style: HeadStyle) => {
  const P = (pts: Pt[]): Pt[] => pts.map(([u, v]) => [cx + u * K, cy + v * K]);
  const {cut} = style;
  if (cut === 'tied') p.part(style.hair, P(ellipse(-0.74, -0.9, 0.3, 0.22, 16)), true, 6); // bun at the back
  const head = headOutline();
  p.part(style.skin, P(head), true, cut === 'tied' ? 8 : 4);
  p.part(style.skin, P([[0.9, 0.1], [1.13, 0.34], [0.95, 0.43]]), true); // nose
  // Hair (or hood) over the skull: front hairline, over the top, down the back to the nape, back up past the ear.
  const arc = (r: number, a0: number, a1: number, n = 20): Pt[] =>
    Array.from({length: n + 1}, (_, i): Pt => {
      const a = a0 + ((a1 - a0) * i) / n;
      return [r * Math.cos(a), r * 1.05 * Math.sin(a) - 0.02];
    });
  if (cut === 'hood') {
    const hood: Pt[] = [...Array.from({length: 25}, (_, i): Pt => {
      const a = 1.25 + ((5.08 - 1.25) * i) / 24;
      return [-0.12 + 1.14 * Math.cos(a), 1.3 * Math.sin(a)];
    }), [0.5, -1.0], [0.66, -0.55], [0.62, 0.25], [0.45, 0.95]];
    p.part(style.hood ?? style.hair, P(hood), true, 6);
    p.part(style.hair, P([[0.58, -0.78], [0.88, -0.5], [0.72, -0.42], [0.6, -0.42]]), true, 6); // fringe under the hood
  } else if (cut === 'bob') {
    p.part(style.hair, P([[0.8, -0.42], ...arc(1.12, -1.0, -Math.PI), [-1.14, 0.6], [-1.0, 0.8], [0.1, 0.8], [0.22, 0.3], [0.3, -0.3]]), true, 6);
  } else {
    const fringe = Array.from({length: 9}, (_, i): Pt => [0.2 + (0.62 * i) / 8, -0.4 - 0.08 * i / 8 + 0.05 * Math.abs(Math.sin((i / 8) * 2 * Math.PI))]);
    p.part(style.hair, P([...arc(1.08, -1.0, -Math.PI - 0.55), [-0.62, 0.5], [-0.36, 0.06], [-0.12, -0.14], [0.18, -0.34], ...fringe]), true, 6);
    // Ear over the hair's lower edge, mid-head.
    p.part(style.skin, P(ellipse(-0.12, 0.12, 0.15, 0.22, 16)), true, 8);
    p.ink(P([[-0.08, 0.0], [-0.17, 0.1], [-0.08, 0.22]]), 0.9, 0.6);
  }
  if (p.sil) return;
  // Face features near the front edge: one eye, one brow, mouth.
  const [lx, ly] = face.look;
  const white = P(ellipse(0.62, 0.05, 0.13, face.eyes === 'wide' ? 0.15 : 0.12, 16));
  p.part('#fbf7ee', white, true, 3);
  p.part(INK, P(ellipse(0.67 + 0.03 * lx, 0.05 + 0.05 * ly, 0.055, 0.065, 12)), false, 6);
  const [inner, outer] = BROW_Y[face.brow];
  p.part(style.hair, P([[0.46, outer - 0.03], [0.8, inner - 0.03], [0.8, inner + 0.03], [0.46, outer + 0.03]]), false, 6);
  if (face.mouth === 'smile') {
    const m = P([[0.66, 0.56], [0.95, 0.54], [0.9, 0.66], [0.78, 0.7], [0.7, 0.64]]);
    p.part('#3b2a24', m, true, 4);
  } else if (face.mouth === 'wavy') p.ink(P([[0.7, 0.62], [0.76, 0.59], [0.82, 0.63], [0.88, 0.59], [0.93, 0.62]]), 1.1, 0.5);
  else p.ink(P([[0.72, 0.62], [0.93, 0.62]]), 1.2, 0);
};

/** Two-bone reach from shoulder S to target T (each bone `len`), elbow bending down and back. */
const reach = (S: Pt, T: Pt, len: number): Pt => {
  const dx = T[0] - S[0], dy = T[1] - S[1];
  const d = Math.min(Math.hypot(dx, dy), 2 * len - 1);
  const a = Math.atan2(dy, dx) + Math.acos(d / (2 * len));
  return [S[0] + len * Math.cos(a), S[1] + len * Math.sin(a)];
};

/** One cast member in profile, ground point (cx, ground), facing +x. `grip` puts the near hand on a cart handle. */
const paintBodySide = (p: Paint, c: Cast, cx: number, ground: number, grip?: Pt) => {
  const h = UNIT, o = c.outfit;
  const k = skeleton(cx, N, ground, h, o.shoulder);
  const {shoulderY: sY, hipY, crotchY} = k;
  const kneeY = k.legs[0].knee[1], ankleY = k.legs[0].ankle[1];
  const X = (u: number) => cx + u * h;

  // Far leg and shoe (behind), near leg and shoe.
  for (const [dx, shade] of [[-0.05, 0.86], [0.02, 1]] as const) {
    const legColor = shade < 1 && !p.sil ? mix(o.pants, 0.86) : o.pants;
    p.part(legColor, limb([X(dx), hipY - 0.04 * h], [X(dx - 0.01), ankleY], 0.26 * h, 0.19 * h));
    if (o.boots) p.part(o.shoes, [[X(dx - 0.11), ankleY - 0.32 * h], [X(dx + 0.11), ankleY - 0.32 * h], [X(dx + 0.12), ankleY - 0.04 * h], [X(dx + 0.3), ground - 0.04 * h], [X(dx + 0.3), ground], [X(dx - 0.13), ground]]);
    else p.part(o.shoes, ellipse(X(dx + 0.08), ground - 0.05 * h, 0.2 * h, 0.07 * h));
  }
  if (!o.skirt && !o.coat) p.part(o.pants, [[X(-0.21), hipY - 0.06 * h], [X(0.18), hipY - 0.06 * h], [X(0.17), crotchY], [X(-0.24), crotchY - 0.02 * h]], false);
  if (o.skirt) p.part(o.skirt, [[X(-0.24), hipY - 0.08 * h], [X(0.2), hipY - 0.08 * h], [X(0.3), kneeY + 0.45 * h], [X(-0.32), kneeY + 0.45 * h]], true, 8);

  // Torso and outer layers, front to the right.
  if (o.coat) {
    p.part(o.coat, [[X(-0.19), sY], [X(0.14), sY], [X(0.24), sY + 0.22 * h], [X(0.3), kneeY + 0.12 * h], [X(-0.32), kneeY + 0.12 * h], [X(-0.24), sY + 0.15 * h]]);
  } else {
    p.part(o.shirt, [[X(-0.18), sY], [X(0.14), sY], [X(0.22), sY + 0.2 * h], [X(0.18), hipY], [X(-0.2), hipY], [X(-0.21), sY + 0.15 * h]]);
    if (o.jacket) p.part(o.jacket, [[X(-0.19), sY], [X(0.12), sY], [X(0.16), sY + 0.2 * h], [X(0.12), hipY + 0.06 * h], [X(-0.23), hipY + 0.06 * h], [X(-0.23), sY + 0.15 * h]]);
    if (o.apron) {
      p.part(o.apron, [[X(0.18), sY + 0.22 * h], [X(0.24), sY + 0.2 * h], [X(0.26), hipY + 0.32 * h], [X(0.18), hipY + 0.32 * h]], true, 8);
      p.ink([[X(0.2), sY + 0.22 * h], [X(-0.05), sY - 0.02 * h]], 1.0, 0); // neck strap
      p.part(o.apron, ellipse(X(-0.24), hipY - 0.1 * h, 0.06 * h, 0.04 * h, 12), true, 8); // tie at the back
    }
  }
  const nw = o.coat ? 0.16 * h : 0.08 * h;
  p.part(o.coat ?? c.head.skin, [[X(-nw / h), k.chin - 0.12 * h], [X(nw / h), k.chin - 0.12 * h], [X(nw / h + 0.01), sY + 0.03 * h], [X(-nw / h - 0.01), sY + 0.03 * h]], false);
  const K = h / HEAD_SPAN;
  paintHeadSide(p, X(-0.08), k.chin - CHIN * K, K, FACES[c.face], c.head);

  // Near arm: hanging, or reaching to the cart grip.
  const shoulder: Pt = [X(-0.01), sY + 0.07 * h];
  const armLen = k.arms[0].wrist[1] - k.arms[0].shoulder[1];
  const wrist: Pt = grip ?? [X(0.02), shoulder[1] + armLen];
  const elbow: Pt = grip ? reach(shoulder, grip, armLen / 2) : [X(-0.04), shoulder[1] + armLen / 2];
  p.part(o.sleeve, limb(shoulder, elbow, 0.19 * h, 0.16 * h));
  p.part(o.longSleeves ? o.sleeve : c.head.skin, limb(elbow, wrist, 0.15 * h, 0.13 * h));
  p.part(c.head.skin, ellipse(wrist[0] + (grip ? 0.03 * h : 0), wrist[1] + (grip ? 0 : 0.07 * h), 0.1 * h, 0.12 * h));
};

// Darken a #rrggbb colour by factor f (far-side limbs).
const mix = (hex: string, f: number) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = (s: number) => Math.round(((n >> s) & 255) * f).toString(16).padStart(2, '0');
  return `#${ch(16)}${ch(8)}${ch(0)}`;
};

/**
 * Platform cart, five cartons, helmet on top and a closed umbrella hooked on the handle; handle at x0, deck running
 * +x. Returns the grip point for the worker's hand.
 */
const paintCart = (p: Paint, x0: number, ground: number): Pt => {
  const deckTop = ground - 0.17 * M, deckLen = 0.75 * M;
  const grip: Pt = [x0 - 0.05 * M, ground - 0.97 * M];
  // Handle: upright tube with a bend back to the grip.
  p.part('#5b6066', [[x0, deckTop], [x0 + 0.035 * M, deckTop], [x0 + 0.035 * M, ground - 0.95 * M], [x0 - 0.06 * M, ground - 0.99 * M], [x0 - 0.06 * M, ground - 0.955 * M], [x0, ground - 0.93 * M]]);
  // Closed umbrella hooked over the handle, canopy rolled down to the deck.
  p.part('#30353b', [[x0 + 0.05 * M, ground - 0.86 * M], [x0 + 0.09 * M, ground - 0.86 * M], [x0 + 0.13 * M, deckTop - 0.02 * M], [x0 + 0.09 * M, deckTop - 0.02 * M]]);
  p.ink([[x0 + 0.07 * M, ground - 0.86 * M], [x0 + 0.07 * M, ground - 0.97 * M], [x0 + 0.01 * M, ground - 1.0 * M], [x0 - 0.02 * M, ground - 0.95 * M]], 2.4, 0.6);
  // Deck and wheels; the front wheel is the one that jams and scrapes.
  p.part('#6a7076', [[x0, deckTop], [x0 + deckLen, deckTop], [x0 + deckLen, deckTop + 0.05 * M], [x0, deckTop + 0.05 * M]]);
  for (const wx of [0.09, 0.66]) p.part('#24272a', ellipse(x0 + wx * M, ground - 0.06 * M, 0.06 * M, 0.06 * M, 14));
  // Cartons, each shifted a little: the stack is unstable.
  let y = deckTop;
  const boxH = 0.32 * M;
  for (let i = 0; i < 5; i++) {
    const w = (0.4 + 0.12 * hash(i + 300)) * M;
    const mid = x0 + deckLen * 0.55 + (hash(i + 310) - 0.5) * 0.08 * M + i * 0.012 * M;
    p.part('#c49a63', [[mid - w / 2, y], [mid + w / 2, y], [mid + w / 2, y - boxH], [mid - w / 2, y - boxH]]);
    if (!p.sil) p.part('#a87e4a', [[mid - w / 2, y - boxH * 0.55], [mid + w / 2, y - boxH * 0.55], [mid + w / 2, y - boxH * 0.45], [mid - w / 2, y - boxH * 0.45]], false, 2); // tape
    y -= boxH;
  }
  // Helmet on the top carton, tilted: the apparent head.
  const hx = x0 + deckLen * 0.55 + 0.08 * M, hy = y;
  const dome: Pt[] = Array.from({length: 15}, (_, j): Pt => {
    const a = Math.PI + (j / 14) * Math.PI, u = 0.15 * M * Math.cos(a), v = 0.14 * M * Math.sin(a), r = -0.15;
    return [hx + u * Math.cos(r) - v * Math.sin(r), hy + u * Math.sin(r) + v * Math.cos(r)];
  });
  p.part('#b8392c', dome);
  if (!p.sil) p.part('#3a4148', [[hx + 0.02 * M, hy - 0.11 * M], [hx + 0.15 * M, hy - 0.08 * M], [hx + 0.13 * M, hy - 0.01 * M], [hx + 0.03 * M, hy - 0.03 * M]], true, 4);
  return grip;
};

/**
 * The same worker/cart/cargo/helmet seen from the shop (front), as one silhouette: the worker stands behind and to
 * one side of the stack, one arm bracing it, so body and cartons merge into a tall figure with the helmet as its head.
 */
const paintAssemblyFront = (p: Paint, cx: number, ground: number) => {
  const h = UNIT, o = CAST[1].outfit;
  const wx = cx + 0.2 * M; // worker, behind the cart
  const k = skeleton(wx, N, ground - 0.04 * M, h, o.shoulder);
  const kneeY = k.legs[0].knee[1], hw = 0.3 * h;
  for (const {hip, ankle} of k.legs) p.part(o.pants, limb([hip[0], hip[1] - 0.04 * h], ankle, 0.26 * h, 0.19 * h));
  p.part(o.coat ?? o.shirt, [[wx - k.sw, k.shoulderY], [wx + k.sw, k.shoulderY], [wx + hw + 0.2 * h, kneeY + 0.12 * h], [wx - hw - 0.2 * h, kneeY + 0.12 * h]]);
  const K = h / HEAD_SPAN;
  p.part(o.coat ?? o.shirt, ellipse(wx, k.chin - CHIN * K, 1.3 * K, 1.42 * K, 24)); // hood
  // Cart from the front: deck edge and two wheels; the handle hides behind the stack.
  const deckTop = ground - 0.17 * M;
  p.part('#6a7076', [[cx - 0.26 * M, deckTop], [cx + 0.26 * M, deckTop], [cx + 0.26 * M, deckTop + 0.05 * M], [cx - 0.26 * M, deckTop + 0.05 * M]]);
  for (const s of [-1, 1]) p.part('#24272a', ellipse(cx + s * 0.2 * M, ground - 0.06 * M, 0.035 * M, 0.06 * M, 12));
  let y = deckTop;
  for (let i = 0; i < 5; i++) {
    const w = (0.4 + 0.12 * hash(i + 300)) * M;
    const mid = cx + (hash(i + 310) - 0.5) * 0.08 * M - i * 0.015 * M;
    p.part('#c49a63', [[mid - w / 2, y], [mid + w / 2, y], [mid + w / 2, y - 0.32 * M], [mid - w / 2, y - 0.32 * M]]);
    y -= 0.32 * M;
  }
  p.part('#b8392c', Array.from({length: 15}, (_, j): Pt => [cx - 0.03 * M + 0.15 * M * Math.cos(Math.PI + (j / 14) * Math.PI), y + 0.14 * M * Math.sin(Math.PI + (j / 14) * Math.PI)]));
  // Near arm braces the stack's side.
  const sh: Pt = [wx - k.sw + 0.06 * h, k.shoulderY + 0.06 * h];
  const hand: Pt = [cx + 0.2 * M, k.shoulderY + 0.1 * h];
  p.part(o.sleeve, limb(sh, hand, 0.19 * h, 0.15 * h));
};

const paint = (ctx: PaintContext) => {
  const {brush, still} = ctx;
  // Head-unit guides on both rows.
  [ROW1, ROW2].forEach((g, row) => {
    for (let i = 0; i <= N; i++) {
      still(19000 + row * 10 + i);
      brush.set('HB', i === 0 ? INK : '#b3c3cf', i === 0 ? 1.4 : 0.8);
      brush.line(30, g - i * UNIT, 1050, g - i * UNIT);
    }
  });
  // Row 1: narrator, shop worker, occupant.
  [0, 2, 3].forEach((ci, col) => paintBodySide(makePaint(ctx, 20000 + ci * 3000), CAST[ci], col * 360 + 170, ROW1));
  // Row 2: the worker and cart, lit; then the same assembly as a fog silhouette on a fog panel.
  const worker = CAST[1];
  const lit = makePaint(ctx, 40000);
  const grip = paintCart(lit, 200, ROW2);
  paintBodySide(lit, worker, 115, ROW2, grip);
  const panel = makePaint(ctx, 50000);
  panel.part(FOG_PANEL, [[560, ROW2 - 4.6 * UNIT], [1060, ROW2 - 4.6 * UNIT], [1060, ROW2 + 10], [560, ROW2 + 10]], false, 4);
  paintAssemblyFront(makePaint(ctx, 60000, SIL), 790, ROW2);
};

const Labels = () => {
  const label = (x: number, y: number, w: number, name: string, role: string) => (
    <div key={name} style={{position: 'absolute', left: x - w / 2, width: w, top: y + 12, textAlign: 'center', fontSize: 28, lineHeight: 1.15}}>
      <b>{name}</b> <span style={{fontSize: 20, color: '#5d6b78'}}>{role}</span>
    </div>
  );
  return (
    <AbsoluteFill style={{fontFamily: 'Noto Sans Thai, sans-serif', color: INK}}>
      <div style={{position: 'absolute', left: 40, top: 30, fontSize: 36}}>WORLD FOG cast · side · 4 heads</div>
      {[0, 2, 3].map((ci, col) => label(col * 360 + 180, ROW1, 360, CAST[ci].name, CAST[ci].role))}
      {label(270, ROW2, 540, CAST[1].name, 'with cart · lit')}
      {label(810, ROW2, 540, 'ในหมอก', 'same assembly · front silhouette')}
    </AbsoluteFill>
  );
};

export const SideSheet = () => (
  <AbsoluteFill style={{backgroundColor: '#f3ecdc'}}>
    <BrushCanvas paint={paint} paper="#f3ecdc" />
    <Labels />
  </AbsoluteFill>
);
