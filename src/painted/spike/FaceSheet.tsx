import {AbsoluteFill} from 'remotion';
import {BrushCanvas, hash, type PaintContext} from '../BrushCanvas';

type Pt = [number, number];

// Model-sheet spike: a flat-face decal head (egg head, cap of hair, flat eyes/brows/mouth) painted with p5.brush,
// in 12 expressions. Design reference supplied by the user on 2026-10-29 ("flat-face decal style"). Not a rig:
// Boss owns the character module; this only proves the face controls read at Short size. 1080x1920 frame.

export type Brow = 'flat' | 'up' | 'worry' | 'angry' | 'quirk';
type Eyes = 'dot' | 'wide' | 'half' | 'shut';
type Mouth = 'flat' | 'smile' | 'o' | 'tilt' | 'wavy' | 'frown' | 'gasp';
export type Face = {name: string; brow: Brow; eyes: Eyes; look: Pt; mouth: Mouth};

export const FACES: Face[] = [
  {name: 'neutral', brow: 'flat', eyes: 'dot', look: [0, 0], mouth: 'flat'},
  {name: 'happy', brow: 'up', eyes: 'dot', look: [0, 0], mouth: 'smile'},
  {name: 'surprised', brow: 'up', eyes: 'wide', look: [0, 0], mouth: 'o'},
  {name: 'thinking', brow: 'quirk', eyes: 'dot', look: [0.6, -0.7], mouth: 'tilt'},
  {name: 'worried', brow: 'worry', eyes: 'dot', look: [0, 0], mouth: 'wavy'},
  {name: 'angry', brow: 'angry', eyes: 'dot', look: [0, 0], mouth: 'frown'},
  {name: 'scared', brow: 'worry', eyes: 'wide', look: [-0.8, 0], mouth: 'gasp'},
  {name: 'look left', brow: 'flat', eyes: 'dot', look: [-1, 0], mouth: 'flat'},
  {name: 'look right', brow: 'flat', eyes: 'dot', look: [1, 0], mouth: 'flat'},
  {name: 'look up', brow: 'up', eyes: 'dot', look: [0, -1], mouth: 'flat'},
  {name: 'look down', brow: 'flat', eyes: 'dot', look: [0, 1], mouth: 'flat'},
  {name: 'side-eye', brow: 'flat', eyes: 'half', look: [1, 0], mouth: 'flat'},
];

const COLS = 3, CELL_W = 360, CELL_H = 430, TOP = 130, K = 112; // K: head half-width in px
export const SKIN = '#e9b98a', HAIR = '#262422', INK = '#2b211c';
const WHITE = '#fbf7ee', MOUTH = '#3b2a24';
const cellCenter = (i: number): Pt => [(i % COLS) * CELL_W + CELL_W / 2, TOP + Math.floor(i / COLS) * CELL_H + 190];

const ellipse = (cx: number, cy: number, rx: number, ry: number, n = 24): Pt[] =>
  Array.from({length: n}, (_, i) => [cx + rx * Math.cos((i / n) * 6.283), cy + ry * Math.sin((i / n) * 6.283)]);
// Egg head in head units: forehead top at -1.05, chin at 1.22, slightly narrower toward the chin.
export const headOutline = (n = 40): Pt[] =>
  Array.from({length: n}, (_, i) => {
    const a = (i / n) * 6.283, s = Math.sin(a);
    return [Math.cos(a) * (1 - 0.07 * Math.max(0, s)), s < 0 ? 1.05 * s : 1.22 * s];
  });

/** Head height in head units of `K` (forehead top to chin); hair adds about 0.1 above. */
export const HEAD_SPAN = 2.27;
/** Chin offset below the head centre, in units of `K`. */
export const CHIN = 1.22;

/** Brow heights per mood, [inner, outer], in head units (y down). */
export const BROW_Y: Record<Brow, [number, number]> = {flat: [-0.24, -0.24], up: [-0.33, -0.31], worry: [-0.34, -0.2], angry: [-0.16, -0.32], quirk: [-0.24, -0.24]};

/** Per-character look of the head: skin, hair colour and cut. `hood` frames the face in a raincoat hood. */
/** `lines`: age lines (crow's feet, under-eye, nasolabial and mouth-corner folds), drawn last so no other seed moves. */
export type HeadStyle = {skin: string; hair: string; cut: 'short' | 'tied' | 'bob' | 'hood'; hood?: string; lines?: boolean};
const DEFAULT_STYLE: HeadStyle = {skin: SKIN, hair: HAIR, cut: 'short'};

/**
 * One decal head centred on (cx, cy), `K` px per head unit (half the face width). `cell` keeps its seeds apart from
 * other heads on the same canvas.
 */
export const paintHead = ({brush, t, still, boil}: Pick<PaintContext, 'brush' | 't' | 'still' | 'boil'>, cell: number, cx: number, cy: number, K: number, face: Face, style: HeadStyle = DEFAULT_STYLE) => {
  const P = ([u, v]: Pt): Pt => [cx + u * K, cy + v * K];
  // Opaque watercolour: three seeded passes, low bleed. (brush.wash() is avoided: not deterministic after fills.)
  let part = 0;
  const fill = (color: string, pts: Pt[], passes = 3, texture = 0.08) => {
    part++;
    for (let p = 0; p < passes; p++) {
      still(cell * 1000 + part * 10 + p);
      brush.noStroke();
      brush.fill(color, 255);
      brush.fillBleed(0);
      brush.fillTexture(texture, 0.2);
      brush.polygon(pts.map(P));
      brush.noFill();
    }
  };
  let line = 0;
  const ink = (pts: Pt[], weight = 1.3, curve = 0.5) => {
    boil(cell * 100 + ++line);
    brush.set('rotring', INK, weight);
    brush.spline(pts.map(P), curve);
  };

  // Blink: once per 3 s at a per-cell phase, 4 frames shut.
  const blinkAt = 0.4 + hash(cell + 7) * 2.2;
  const eyes: Eyes = t > blinkAt && t < blinkAt + 0.13 ? 'shut' : face.eyes;
  const [lx, ly] = face.look;

  const {cut} = style;
  // Behind the head: a raincoat hood, bob hair falling to the jaw, or a bun on top.
  const back: Pt[] | null =
    cut === 'hood' ? ellipse(0, 0.0, 1.3, 1.42, 28)
    : cut === 'bob' ? [...Array.from({length: 17}, (_, i): Pt => [1.14 * Math.cos(Math.PI + (i / 16) * Math.PI), 1.16 * Math.sin(Math.PI + (i / 16) * Math.PI) - 0.02]), [1.16, 0.7], [0.86, 0.78], [-0.86, 0.78], [-1.16, 0.7]]
    : cut === 'tied' ? ellipse(0.05, -1.12, 0.32, 0.22, 18)
    : null;
  if (back) {
    fill(cut === 'hood' ? style.hood ?? HAIR : style.hair, back, 6);
    ink([...back, back[0]], 1.0, 0.3);
  }
  // Ears (hidden by a hood or bob), then head, then hair over the top.
  if (cut === 'short' || cut === 'tied') for (const side of [-1, 1]) fill(style.skin, ellipse(side * 1.0, 0.12, 0.14, 0.21, 16));
  const head = headOutline();
  // Skin over a dark hood or hair mixes with it while wet; extra passes keep the face its own colour.
  fill(style.skin, head, back ? 8 : 3);
  const hair: Pt[] = [];
  for (let i = 0; i <= 16; i++) {
    const a = Math.PI + (i / 16) * Math.PI;
    hair.push([1.07 * Math.cos(a), 1.12 * Math.sin(a) - 0.04]);
  }
  hair.push([0.92, 0.04], [0.86, -0.36]);
  if (cut === 'tied') {
    // Side-swept fringe: one long sweep from a left parting.
    for (let i = 0; i <= 12; i++) hair.push([0.86 - (1.72 * i) / 12, -0.62 + 0.22 * (i / 12) ** 2]);
  } else if (cut === 'bob') {
    // Straight-cut bangs.
    hair.push([0.84, -0.42], [-0.84, -0.42]);
  } else {
    // Wavy fringe: four scallops hanging from the hairline.
    for (let i = 0; i <= 24; i++) hair.push([0.86 - (1.72 * i) / 24, -0.5 + 0.09 * Math.abs(Math.sin((i / 24) * 4 * Math.PI))]);
  }
  hair.push([-0.86, -0.36], [-0.92, 0.04]);
  fill(style.hair, hair, 6);
  ink([...head, head[0]], 1.1, 0.3);
  ink([...hair, hair[0]], 1.0, 0.3);

  // Eyes: white almond + pupil, offset by the look vector. Half: upper lid drawn flat across the middle.
  for (const side of [-1, 1]) {
    const ex = side * 0.4, ey = 0.05;
    if (eyes === 'shut') {
      ink([[ex - 0.18, ey], [ex, ey + 0.05], [ex + 0.18, ey]], 1.5);
      continue;
    }
    const ry = eyes === 'wide' ? 0.15 : 0.12;
    const white = eyes === 'half'
      ? Array.from({length: 13}, (_, i): Pt => [ex + 0.2 * Math.cos((i / 12) * Math.PI), ey + ry * Math.sin((i / 12) * Math.PI)])
      : ellipse(ex, ey, 0.2, ry);
    fill(WHITE, white, 3);
    const pr = eyes === 'wide' ? 0.05 : 0.065;
    fill(INK, ellipse(ex + lx * 0.1, ey + ly * 0.055 + (eyes === 'half' ? 0.05 : 0), pr, pr, 14), 6);
    ink([...white, white[0]], 1.0, 0.4);
  }

  // Fixed seed bases after the eyes, whose mark count changes on a blink, so brows and mouth never re-randomise.
  part = 50;
  line = 50;
  // Brows: filled bars; inner end (near the nose) and outer end heights per mood.
  const browY = BROW_Y;
  for (const side of [-1, 1]) {
    let [inner, outer] = browY[face.brow];
    if (face.brow === 'quirk' && side === 1) [inner, outer] = [-0.34, -0.36];
    const x0 = side * 0.22, x1 = side * 0.6;
    fill(style.hair, [[x0, inner - 0.03], [x1, outer - 0.03], [x1, outer + 0.03], [x0, inner + 0.03]], 6);
  }

  // Mouth.
  const my = 0.6;
  if (face.mouth === 'flat') ink([[-0.2, my], [0.2, my]], 1.3, 0);
  if (face.mouth === 'tilt') ink([[-0.12, my + 0.04], [0.24, my - 0.04]], 1.3, 0);
  if (face.mouth === 'frown') ink([[-0.18, my + 0.05], [0, my - 0.03], [0.18, my + 0.05]], 1.4, 0.8);
  if (face.mouth === 'wavy') ink(Array.from({length: 9}, (_, i): Pt => [-0.24 + i * 0.06, my + (i % 2 ? 0.035 : -0.01)]), 1.2, 0.6);
  if (face.mouth === 'smile') {
    const pts: Pt[] = [[-0.3, my - 0.06], [0.3, my - 0.06]];
    for (let i = 1; i < 12; i++) pts.push([0.3 * Math.cos((i / 12) * Math.PI), my - 0.06 + 0.2 * Math.sin((i / 12) * Math.PI)]);
    fill(MOUTH, pts, 4);
    ink([...pts, pts[0]], 1.0, 0.2);
  }
  if (face.mouth === 'o' || face.mouth === 'gasp') {
    const pts = face.mouth === 'o' ? ellipse(0, my + 0.03, 0.11, 0.13, 16) : ellipse(0, my + 0.02, 0.15, 0.07, 16);
    fill(MOUTH, pts, 4);
    ink([...pts, pts[0]], 1.0, 0.4);
  }

  // Age lines (older occupant, user feedback 2026-10-29): thin, in a warm brown so the decal face stays clean.
  if (style.lines) {
    const age = (pts: Pt[], curve = 0.5) => {
      boil(cell * 100 + ++line);
      brush.set('rotring', '#8a5a43', 0.8);
      brush.spline(pts.map(P), curve);
    };
    for (const side of [-1, 1]) {
      for (const dy of [-0.06, 0.02, 0.1]) age([[side * 0.64, 0.05 + dy * 0.6], [side * 0.76, 0.05 + dy]], 0);
      age([[side * 0.24, 0.22], [side * 0.4, 0.27], [side * 0.56, 0.22]]);
      age([[side * 0.22, 0.3], [side * 0.3, 0.46], [side * 0.3, 0.6]]);
      age([[side * 0.27, 0.66], [side * 0.29, 0.76]], 0);
    }
  }
};

const paint = (ctx: PaintContext) => {
  FACES.forEach((face, cell) => {
    const [cx, cy] = cellCenter(cell);
    paintHead(ctx, cell, cx, cy, K, face);
  });
};

const Labels = () => (
  <AbsoluteFill>
    <div style={{position: 'absolute', left: 60, top: 50, fontFamily: 'Noto Sans Thai, sans-serif', fontSize: 40, color: INK}}>Flat-face decal · p5.brush</div>
    {FACES.map((f, i) => {
      const [x, y] = cellCenter(i);
      return (
        <div key={f.name} style={{position: 'absolute', left: x - 150, width: 300, top: y + 150, textAlign: 'center', fontFamily: 'Noto Sans Thai, sans-serif', fontSize: 30, color: INK}}>
          {f.name}
        </div>
      );
    })}
  </AbsoluteFill>
);

export const FaceSheet = () => (
  <AbsoluteFill style={{backgroundColor: '#f3ecdc'}}>
    <BrushCanvas paint={paint} paper="#f3ecdc" />
    <Labels />
  </AbsoluteFill>
);
