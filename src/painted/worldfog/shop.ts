import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {drawTorch} from './cast';
import {VD18, blob, glaze, hardFill, planeBand, projectPoly, quadX, quadY, quadZ, solid, washAt, type InteriorLight} from './draw';
import {paintLampGlowCanvas, paintOutside, type OutsideOpts} from './outside';
import {doorAt, type Proj, type V3} from './space';

// The shop interior (MK-WF-DEP-06; index ST-01; brief VD07, VD09, VD16): real-scale painted set from WORLD-SHOP
// metres for every interior camera. Fog is painted only through the glass panes (the exterior plate first, then the
// interior covers everything that is not a pane); boxes and actors are painted far to near by depth, so the window
// shelf can hide a standing narrator (CAM-INT-REV) or sit behind the crouched pair (CAM-LOW-SHELF). Interior fills are
// opaque multi-pass (no fog pickup through texture gaps, build-notes / SP03). Flat cool-white fluorescent light.

export type Drawable = {depth: number; draw: () => void};

const C = {
  floor: '#a4a79e', floorFar: '#8f938a', ceiling: '#cfd2ca', wall: '#b6b9b0', frame: '#22292a', frameEdge: '#151a1b', leaf: '#2a3132',
  shelf: '#3a4245', shelfTop: '#566064', counter: '#7d6650', counterTop: '#d6cfbf', gondola: '#d5d6cf', gondolaShade: '#babbb3',
  fridge: '#cddde0', fridgeFrame: '#8e9aa0', tube: '#f6faf6', register: '#3b4144', hook: '#4a5052',
};
const PRODUCTS = ['#c9a660', '#7fa8a0', '#c0705a', '#e6ddca', '#6b8aa6', '#a3b98e', '#d9b97c', '#8f7fa6', '#b8473a', '#5f7f6a'];

/** An axis-aligned box [x0,x1] x [y0,y1] x [z0,z1] with per-face colours; only faces turned to the camera are painted. */
type Box = {id: number; min: V3; max: V3; color: string; top?: string; side?: string; front?: string; hard?: boolean; detail?: (p: Painter, proj: Proj) => void;
  /** VD18 tube lift on the top face (box rule 0.30); a set value replaces the mottled top glaze too (S02-SH03 counter). */
  topLift?: number};

const visibleFaces = (proj: Proj, b: Box) => {
  const [ex, ey, ez] = proj.eye, {min: [x0, y0, z0], max: [x1, y1, z1]} = b;
  const faces: {q: V3[]; c: string}[] = [];
  if (ey > y1) faces.push({q: quadY(y1, x0, x1, z0, z1), c: b.top ?? b.color});
  if (ey < y0) faces.push({q: quadY(y0, x0, x1, z0, z1), c: mixColor(b.color, '#000000', 0.2)});
  if (ex > x1) faces.push({q: quadX(x1, y0, y1, z0, z1), c: b.side ?? b.color});
  if (ex < x0) faces.push({q: quadX(x0, y0, y1, z0, z1), c: b.side ?? b.color});
  if (ez > z1) faces.push({q: quadZ(z1, x0, x1, y0, y1), c: b.front ?? b.color});
  if (ez < z0) faces.push({q: quadZ(z0, x0, x1, y0, y1), c: b.front ?? b.color});
  return faces;
};

const paintBox = (p: Painter, proj: Proj, b: Box, passes = 7, light?: InteriorLight) => {
  visibleFaces(proj, b).forEach(({q, c}, i) => {
    const pts = projectPoly(proj, q);
    if (!pts.length) return;
    // Straight architecture (mullions, frames) is a crisp fill: the textured wash made blobby bar edges.
    if (b.hard) hardFill(p, 50000 + b.id * 8 + i, c, pts);
    else solid(p, 50000 + b.id * 8 + i, c, pts, passes, 0.04, 0.1);
    // VD18 set modelling (not on the thin glass-front bars, which stay crisp and flat): mottled glaze, a paler top
    // face under the tubes, an occlusion band at the foot of vertical faces.
    if (light && (!b.hard || b.id === 1)) {
      const s = 7_200_000 + b.id * 16 + i * 4;
      const top = q.every((v) => v[1] === q[0][1]) && q[0][1] > 0.01;
      if (!(top && b.topLift !== undefined)) glaze(p, s, mixColor(c, '#000000', 0.08), 80, pts, {texture: 0.65, border: 0.55, bleed: 0.02, split: 0.3});
      if (top) glaze(p, s + 1, mixColor(c, VD18.light, b.topLift ?? 0.3), 110, pts, {texture: 0.3, border: 0.3, bleed: 0.03});
      else {
        const foot = planeBand(pts, [0, -1], 0, 0.3);
        if (foot.length) glaze(p, s + 2, mixColor(c, '#0e1213', 0.45), 150, foot, {texture: 0.4, border: 0.2, bleed: 0.08});
        const head = planeBand(pts, [0, -1], 0.86);
        if (head.length) glaze(p, s + 3, mixColor(c, VD18.light, 0.25), 90, head, {texture: 0.3, border: 0.2, bleed: 0.05});
      }
    }
  });
  b.detail?.(p, proj);
};

const boxDepth = (proj: Proj, b: Box) => {
  // Distance from the eye to the nearest point of the box along the view axis, for painter ordering.
  const c: V3 = [Math.max(b.min[0], Math.min(proj.eye[0], b.max[0])), (b.min[1] + b.max[1]) / 2, Math.max(b.min[2], Math.min(proj.eye[2], b.max[2]))];
  const far: V3 = [(b.min[0] + b.max[0]) / 2, c[1], (b.min[2] + b.max[2]) / 2];
  return (proj.rawDepth(c) + proj.rawDepth(far)) / 2;
};

/** Products on one vertical face of a shelf unit: rows of plain colour blocks (no labels, no brands). */
const productsOnX = (id: number, x: number, z0: number, z1: number, rows: number[], dx: number) => (p: Painter, proj: Proj) => {
  rows.forEach((y, r) => {
    const n = Math.floor((z1 - z0) / 0.22);
    for (let i = 0; i < n; i++) {
      const za = z0 + 0.02 + i * 0.22, zb = za + 0.16 + 0.03 * hash(id + r * 31 + i);
      const h = 0.18 + 0.12 * hash(id + r * 17 + i * 3);
      const pts = projectPoly(proj, quadX(x + dx, y, y + h, za, zb));
      if (pts.length) washAt(p, 52000 + id * 400 + r * 40 + i, mixColor(PRODUCTS[(i * 3 + r * 7 + id) % PRODUCTS.length], '#262d2f', stockDim), 200, pts, 0.1, 0.35);
    }
    const rail = projectPoly(proj, quadX(x + dx * 1.5, y - 0.03, y, z0, z1));
    if (rail.length) solid(p, 52000 + id * 400 + r * 40 + 39, '#e9ebe6', rail, 2, 0.05);
  });
};
/** VD18: shelf stock reads as muted colour notes, not a candy palette (set while a lit interior is painted). */
let stockDim = 0;
const productsOnZ = (id: number, z: number, x0: number, x1: number, rows: number[], dz: number, dim = 0, topLitOnly = false) => (p: Painter, proj: Proj) => {
  dim = Math.max(dim, stockDim);
  rows.forEach((y, r) => {
    const n = Math.floor((x1 - x0) / 0.2);
    for (let i = 0; i < n; i++) {
      const xa = x0 + 0.02 + i * 0.2, xb = xa + 0.14 + 0.03 * hash(id + r * 31 + i);
      const h = 0.16 + 0.12 * hash(id + r * 17 + i * 3);
      const pts = projectPoly(proj, quadZ(z + dz, xa, xb, y, y + h));
      if (pts.length) washAt(p, 53000 + id * 400 + r * 40 + i, mixColor(PRODUCTS[(i * 5 + r * 3 + id) % PRODUCTS.length], '#262d2f', dim), 210, pts, 0.1, 0.35);
      // VD18: the lit top of each pack (tube light from above), so the stock reads as objects, not colour patches.
      const lid = stockDim > 0 && (!topLitOnly || r === rows.length - 1) ? projectPoly(proj, quadZ(z + dz * 2, xa, xb, y + h - 0.025, y + h)) : [];
      if (lid.length) solid(p, 53000 + id * 400 + r * 40 + i + 200, mixColor(PRODUCTS[(i * 5 + r * 3 + id) % PRODUCTS.length], '#e8ece6', 0.45), lid, 2, 0.05, 0.1);
    }
    if (stockDim > 0) {
      // Shelf lip under the row (pale edge catching the tube light) and the dark slot under the shelf above.
      const lip = projectPoly(proj, quadZ(z + dz * 3, x0 - 0.03, x1 + 0.03, y - 0.035, y - 0.005));
      if (lip.length) hardFill(p, 53000 + id * 400 + r * 40 + 380, '#9aa29f', lip);
      const slot = r === rows.length - 1 ? [] : projectPoly(proj, quadZ(z + dz * 1.5, x0 - 0.03, x1 + 0.03, y + 0.31, y + 0.345));
      if (slot.length) glaze(p, 53000 + id * 400 + r * 40 + 390, '#151a1b', 150, slot, {texture: 0.3, border: 0.2, bleed: 0.1});
    }
  });
};

/**
 * Per-shot set dressing for one interior camera (sheet items, not the shared set). S02-SH03 (SS-R3.3): register at the counter's
 * -x end, dark counter front and top with the VD18 top lift set, a hard nosing, dimmed stock with lit pack tops on the top row.
 */
export type ShopDress = {
  /** Register box x range (m); its top rises to 1.20 m when set. */
  register?: [number, number];
  counterFront?: string;
  counterTop?: string;
  /** VD18 top-face lift for the counter top (box rule 0.30); the mottled top glaze is dropped when set. */
  counterTopLift?: number;
  /** Flat hard nosing colour on the counter's near top edge (6 px). */
  nosing?: string;
  /** Lit pack tops on the back shelf's top row only. */
  backShelfTopLitOnly?: boolean;
  /** Back-shelf panel colours (top face, front); the window shelf's VD18 colours are the set's shelf values. */
  backShelf?: {color: string; front: string};
};
/** The counter's near-top nosing and laminate seams every 0.6 m (S02-SH03). */
const counterDetail = (d: ShopDress) => (p: Painter, proj: Proj) => {
  const nose = projectPoly(proj, quadZ(-2.598, -2.9, -0.9, 0.894, 0.9));
  if (nose.length && d.nosing) hardFill(p, 58010, d.nosing, nose);
  for (const x of [-2.3, -1.7, -1.1]) {
    const seam = projectPoly(proj, quadZ(-2.597, x - 0.003, x + 0.003, 0, 0.894));
    if (seam.length) solid(p, 58020 + Math.round(x * 10), '#1c2224', seam, 2, 0.02, 0.05);
  }
};

/** The set's boxes (ST-01). */
const setBoxes = (G: number, torchOnHook: boolean, L?: InteriorLight, dress?: ShopDress): Box[] => {
  const door = doorAt(G);
  const leafX = -1.0 * door;
  const boxes: Box[] = [
    // Window snack shelf x -2.6..-0.7, z -0.9..-0.5, top 1.1, with packs on top.
    {id: 1, min: [-2.6, 0, -0.9], max: [-0.7, 1.1, -0.5], color: L ? VD18_SET.shelf : C.shelf, top: L ? VD18_SET.shelfTop : C.shelfTop, side: L ? VD18_SET.shelfSide : '#2e3537',
      detail: (p, proj) => {
        // The shop-side face of the window shelf is stocked (dimmed products), so the low views read it as a shelf.
        if (proj.eye[2] < -0.9) productsOnZ(11, -0.9, -2.55, -0.75, [0.12, 0.47, 0.82], -0.01, L ? 0.5 : 0.65)(p, proj);
        // A few small packs along the back of the shelf top, dimmed (backlit by the fogged glass).
        [[-1.55, 0.14, 0.16], [-1.8, 0.16, 0.2], [-2.05, 0.14, 0.15], [-2.3, 0.16, 0.19]].forEach(([x, w, h], i) => {
          const pts = projectPoly(proj, quadZ(-0.8, x - w, x, 1.1, 1.1 + h));
          if (pts.length) solid(p, 54000 + i, mixColor(PRODUCTS[(i * 3 + 1) % PRODUCTS.length], '#2a3133', 0.55), pts, 6, 0.05);
        });
      }},
    // Counter x -2.9..-0.9, z -3.2..-2.6, top 0.9, register on top; torch display hook at its right end.
    {id: 2, min: [-2.9, 0, -3.2], max: [-0.9, 0.9, -2.6], color: dress?.counterFront ?? C.counter, top: dress?.counterTop ?? C.counterTop, side: '#6e5946',
      topLift: dress?.counterTopLift, detail: dress ? counterDetail(dress) : undefined},
    {id: 3, min: [dress?.register?.[0] ?? -2.2, 0.9, -3.1], max: [dress?.register?.[1] ?? -1.75, dress?.register ? 1.2 : 1.15, -2.8], color: C.register, top: '#555d61'},
    {id: 4, min: [-0.78, 0.9, -2.73], max: [-0.72, 1.48, -2.67], color: C.hook,
      detail: (p, proj) => {
        const arm = projectPoly(proj, quadZ(-2.72, -0.78, -0.7, 1.4, 1.43));
        if (arm.length) solid(p, 54100, C.hook, arm, 3);
        if (torchOnHook) {
          const k = proj.k([-0.75, 1.35, -2.7]);
          const [hx, hy] = proj.P([-0.71, 1.38, -2.71]);
          drawTorch(p, 54110, [hx, hy + 0.05 * k], Math.PI / 2, k, 0);
        }
      }},
    // Back shelf behind the counter (cigarette-style rack, plain colours).
    {id: 5, min: [-2.9, 0, -4.2], max: [-1.0, 2.0, -3.9], color: dress?.backShelf?.color ?? '#9fa39a', front: dress?.backShelf?.front ?? '#a9ada4', detail: productsOnZ(5, -3.9, -2.85, -1.05, [0.95, 1.3, 1.65], 0.01, 0, !!dress?.backShelfTopLitOnly)},
    // Aisle gondolas x 0.6..1.5 and 1.9..2.8, z -5.5..-2.8, top 1.6 (SS-R3.2 ST-01: front ends at z -2.8, so the
    // two-shot CAM-INT-2S sees the narrator unobstructed and both gondolas are drawn in S04-SH01).
    {id: 6, min: [0.6, 0, -5.5], max: [1.5, 1.6, -2.8], color: C.gondola, top: '#e2e3dc', side: C.gondolaShade, front: '#c6c7bf',
      detail: (p, proj) => {
        if (proj.eye[0] < 0.6) productsOnX(6, 0.6, -5.4, -2.9, [0.1, 0.5, 0.9, 1.3], -0.01)(p, proj);
        if (proj.eye[2] > -2.8) productsOnZ(16, -2.8, 0.65, 1.45, [0.1, 0.5, 0.9, 1.3], 0.01)(p, proj);
      }},
    {id: 7, min: [1.9, 0, -5.5], max: [2.8, 1.6, -2.8], color: C.gondola, top: '#e2e3dc', side: C.gondolaShade, front: '#c6c7bf',
      detail: (p, proj) => {
        if (proj.eye[0] < 1.9) productsOnX(7, 1.9, -5.4, -2.9, [0.1, 0.5, 0.9, 1.3], -0.01)(p, proj);
        if (proj.eye[2] > -2.8) productsOnZ(17, -2.8, 1.95, 2.75, [0.1, 0.5, 0.9, 1.3], 0.01)(p, proj);
      }},
    // Glass front from inside: mullions, rails, transom; the sliding leaf on its inside track at z -0.05.
    ...[-3.0, -1.75, -0.5, 0.5, 1.75, 3.0].map((x, i): Box => ({id: 20 + i, min: [x - 0.04, 0, -0.06], max: [x + 0.04, 2.5, 0], color: C.frame, side: C.frameEdge})),
    {id: 27, min: [-3.0, 2.08, -0.06], max: [3.0, 2.16, 0], color: C.frame, top: '#3d4546'},
    {id: 28, min: [-3.0, 0, -0.06], max: [3.0, 0.05, 0], color: C.frame},
    {id: 29, min: [-0.52 + leafX, 0.05, -0.09], max: [-0.47 + leafX, 2.06, -0.05], color: C.leaf, side: C.frameEdge},
    {id: 30, min: [0.47 + leafX, 0.05, -0.09], max: [0.52 + leafX, 2.06, -0.05], color: C.leaf, side: C.frameEdge},
    {id: 31, min: [-0.52 + leafX, 2.0, -0.09], max: [0.52 + leafX, 2.06, -0.05], color: C.leaf},
    {id: 32, min: [-0.52 + leafX, 0.05, -0.09], max: [0.52 + leafX, 0.17, -0.05], color: C.leaf},
    {id: 33, min: [-0.455 + leafX, 0.8, -0.12], max: [-0.43 + leafX, 1.22, -0.1], color: '#6a7675', side: '#4a5455'},
  ];
  // Glass-front architecture (ids 20-33: mullions, transom, sill, leaf, handle) and the window shelf end (id 1, the
  // foreground of CAM-LOW-SHELF in S02-SH05, S02-SH08, S03-SH01) are straight and hard-edged.
  // Aisle gondolas (6, 7) are straight shelving: hard edges, so no wavy watercolour border shows at the right frame edge (S04-SH01).
  return boxes.map((b) => (b.id === 1 || b.id === 6 || b.id === 7 || b.id >= 20 ? {...b, hard: true} : b));
};

/** VD18 set values (brief VD18): the floor matches the approved window shots' slate floor, not the blockout grey. */
export const VD18_SET = {
  floor: '#3a4344', tile: '#101415',
  reflect: '#a9b2ad', reflectOpacity: 95,
  shelf: '#4d5453', shelfTop: '#78817e', shelfSide: '#3a4140', stockDim: 0.3,
} as const;

/**
 * VD18 floor: slate tiles in both directions, cool reflections of the glass panes, a tube pool around the actors and
 * the floor falling off to near-black toward the camera, so the caption band reads over a dark ground.
 */
const paintFloorLook = (p: Painter, proj: Proj) => {
  const S = VD18_SET;
  // Tile joints as thin still ink (a filled strip grows a blobby watercolour edge at this width).
  const joint = (id: number, a: V3, b: V3) => {
    const q = projectPoly(proj, [a, b, [b[0], b[1], b[2] + 1e-4], [a[0], a[1], a[2] + 1e-4]]);
    if (q.length < 2) return;
    let best: [Pt, Pt] = [q[0], q[1]], d = -1;
    for (const u of q) for (const v of q) if (Math.hypot(u[0] - v[0], u[1] - v[1]) > d) [best, d] = [[u, v], Math.hypot(u[0] - v[0], u[1] - v[1])];
    p.inkStill(id, 'rotring', S.tile, 1.0);
    p.brush.line(best[0][0], best[0][1], best[1][0], best[1][1]);
  };
  // Look-aware (brief VD18, Boss r3): +z cameras face the glass, -z cameras have it behind them, -x cameras see it at
  // the side. Joints behind the camera are dropped; the clipper handles the rest.
  const look = proj.setup?.look;
  const behind = (z: number) => (look === '+z' ? z < proj.eye[2] + 0.05 : look === '-z' ? z > proj.eye[2] - 0.05 : false);
  for (let i = 0; i < 12; i++) {
    const z = -0.5 * i - 0.25;
    if (behind(z)) continue;
    joint(57000 + i, [-3, 0.002, z], [3, 0.002, z]);
  }
  for (let i = 0; i < 12; i++) {
    const x = -2.75 + 0.5 * i;
    joint(57020 + i, [x, 0.002, look === '+z' ? proj.eye[2] + 0.2 : -6], [x, 0.002, 0]);
  }
  // Fog light from each pane mirrored in the floor (a soft streak under every pane, fading into the room).
  // The window shelf (x -2.6..-0.7) stands in front of the left panes, so no streak starts behind it.
  [[-2.96, -1.79], [-1.71, -0.54], [-0.46, 0.46], [0.54, 1.71], [1.79, 2.96]].forEach(([x0, x1], i) => {
    const a = x0 < -0.7 ? Math.max(x0, -0.66) : x0 + 0.1;
    if (x1 - 0.1 - a < 0.1) return;
    // Three stacked streaks of falling length: a soft gradient into the room, not one hard-edged shape.
    [0.5, 1.0, 1.5].forEach((len, j) => {
      // Only a +z camera needs the near clamp (the streak would run into it); -z and -x streaks run from the glass into
      // the room and the clipper trims the part behind the camera.
      const far = look === '+z' ? Math.max(-len, proj.eye[2] + 0.9) : -len;
      const pts = projectPoly(proj, quadY(0.003, a + 0.04 * j, x1 - 0.1 - 0.04 * j, far, -0.02));
      if (pts.length) glaze(p, 57040 + i * 4 + j, S.reflect, S.reflectOpacity / 3, pts, {border: 0, bleed: 0.12, split: 0.1});
    });
  });
  // The tube pool around the actors is the screen-space InteriorAir `pool` (a painted quad read as a puddle).
  // The falloff toward the camera is the screen-space InteriorAir layer (a painted band grew a blobby edge).
};

/** Faint pane tint and the open-door gap: the glass reads as glass from inside (cool sheen, no grade on the picture). */
const paintPaneSheen = (p: Painter, proj: Proj) => {
  [[-2.96, -1.79], [-1.71, -0.54], [-0.46, 0.46], [0.54, 1.71], [1.79, 2.96]].forEach(([x0, x1], i) => {
    const pts = projectPoly(proj, quadZ(-0.001, x0, x1, 1.6, 2.06));
    if (pts.length) washAt(p, 55000 + i, '#e3eae8', 26, pts, 0.4, 0.4);
  });
};

/**
 * Paint the shop for one interior camera at story frame G: outside through the panes (when the camera faces the
 * glass), the shell, then boxes and `actors` far to near. `outside` carries the assembly when it is in view. `ambient` is the
 * continuous clock of the fog drift (default G; SS-R5.1 holds pass their ambient clock).
 */
export const paintShop = (p: Painter, proj: Proj, G: number, o: {actors?: Drawable[]; outside?: OutsideOpts; torchOnHook?: boolean; omit?: number[]; light?: InteriorLight; dress?: ShopDress; ambient?: number} = {}) => {
  const look = proj.setup?.look;
  const L = o.light;
  stockDim = L ? VD18_SET.stockDim : 0;
  const seesGlass = look === '+z' || look === '-x';
  if (seesGlass) {
    paintOutside(p, proj, G, {...(o.outside ?? {}), ambient: o.ambient ?? o.outside?.ambient});
    paintLampGlowCanvas(p, proj, G, o.ambient ?? G);
  }
  // Shell: front wall above the glass, side walls, back wall with the fridges, ceiling with tubes, floor.
  const shell: [V3[], string, number][] = [
    [quadZ(0, -3.0, 3.0, 2.5, 3.0), '#8d928c', 1],
    [quadZ(-6, -3.0, 3.0, 0, 3.0), C.wall, 2],
    [quadX(-3.0, 0, 3.0, -6, 0), C.wall, 3],
    [quadX(3.0, 0, 3.0, -6, 0), C.wall, 4],
    [quadY(3.0, -3.0, 3.0, -6, 0), C.ceiling, 5],
    [quadY(0, -3.0, 3.0, -6, 0), L ? VD18_SET.floor : C.floor, 6],
  ];
  shell.forEach(([q, c, i]) => {
    const pts = projectPoly(proj, q);
    if (!pts.length) return;
    solid(p, 56000 + i, c, pts, i === 1 ? 6 : 3, 0.08, 0.15);
    // VD18: every shell plane gets two mottled glazes (painted depth, not one flat fill).
    if (L) for (let k = 0; k < 2; k++) glaze(p, 7_300_000 + i * 8 + k, mixColor(c, k ? '#ffffff' : '#000000', 0.1), 70, pts, {texture: 0.7, border: 0.5, bleed: 0.1, split: 0.35});
  });
  if (L) paintFloorLook(p, proj);
  // Floor shading toward the back, reflections of the tubes, tile lines (blockout floor only; VD18 paints its own).
  if (!L) {
  const floorFar = projectPoly(proj, quadY(0.001, -3, 3, -6, -3.5));
  if (floorFar.length) washAt(p, 56100, C.floorFar, 120, floorFar, 0.5, 0.4);
  for (let i = 0; i < 6; i++) {
    const z = -1.0 * i - 0.5;
    const line = projectPoly(proj, quadY(0.002, -3, 3, z - 0.004, z + 0.004));
    if (line.length) solid(p, 56200 + i, '#8d9088', line, 2, 0.02, 0.05);
  }
  // Darker floor band along the glass front (shadowed under the window shelf and the frames).
  const sill = projectPoly(proj, quadY(0.003, -3, 3, -1.0, 0));
  if (sill.length) washAt(p, 56250, '#6c716b', 150, sill, 0.5, 0.4);
  // Light falloff (SS-R3.2 quality lift): a soft pool of tube light on the floor, darker far corners, faint mottling on
  // the back wall, so the interior is not one flat fill.
  const pool = projectPoly(proj, quadY(0.001, -1.6, 1.6, -5.2, -1.2));
  if (pool.length) washAt(p, 56150, '#f2f5ef', 40, pool, 0.7, 0.4);
  const far = projectPoly(proj, quadY(0.001, -3, 3, -6, -4.6));
  if (far.length) washAt(p, 56160, '#2a3133', 50, far, 0.6, 0.4);
  }
  if (proj.rawDepth([0, 1, -5.98]) > 0.2) {
    [[-2.2, 1.3], [0.9, 2.0], [-0.4, 0.6]].forEach(([x, y], i) => {
      const c = proj.P([x, y, -5.98]), k = proj.k([x, y, -5.98]);
      washAt(p, 56170 + i, i % 2 ? '#8e9489' : '#c2c6bc', 56, blob(56170 + i, c[0], c[1], 0.7 * k, 0.45 * k, 0, 16), 0.5, 0.4);
    });
  }
  // Soft contact shadows under the floor-standing set pieces (shelves, counter, gondolas): where each piece meets the floor.
  setBoxes(G, false).filter((b) => b.min[1] === 0 && b.id < 20).forEach((b) => {
    const [x0, , z0] = b.min, [x1, , z1] = b.max;
    const shadow = projectPoly(proj, quadY(0.004, x0 - 0.05, x1 + 0.05, z0 - 0.04, z1 + 0.08));
    if (shadow.length && L) glaze(p, 56700 + b.id, '#07090a', 150, shadow, {border: 0.1, bleed: 0.2});
    else if (shadow.length) washAt(p, 56700 + b.id, '#1d2325', 100, shadow, 0.6, 0.3);
  });
  // Fridge wall doors (cool glow) with product rows.
  for (let i = 0; i < 6; i++) {
    const x0 = -2.9 + i * 0.97, x1 = x0 + 0.9;
    const door = projectPoly(proj, quadZ(-5.99, x0, x1, 0.15, 2.1));
    if (!door.length) continue;
    solid(p, 56300 + i, C.fridge, door, 3, 0.05);
    productsOnZ(60 + i, -5.99, x0 + 0.04, x1 - 0.04, [0.3, 0.7, 1.1, 1.5], 0.01)(p, proj);
    const frame = projectPoly(proj, quadZ(-5.985, x1 - 0.03, x1, 0.15, 2.1));
    if (frame.length) solid(p, 56320 + i, C.fridgeFrame, frame, 2);
  }
  // Fluorescent tubes (pairs across the ceiling), bright with a soft cool bloom.
  for (const z of [-1.0, -2.5, -4.0, -5.5]) {
    for (const [x0, x1] of [[-2.2, -0.6], [0.6, 2.2]]) {
      const tube = projectPoly(proj, quadY(2.8, x0, x1, z - 0.05, z + 0.05));
      if (!tube.length) continue;
      const glow = projectPoly(proj, quadY(2.81, x0 - 0.2, x1 + 0.2, z - 0.35, z + 0.35));
      if (glow.length) washAt(p, 56400 + Math.round(z * 10) * 3 + Math.round(x0), '#eef4f0', 70, glow, 0.6, 0.3);
      solid(p, 56500 + Math.round(-z * 10) * 3 + (x0 < 0 ? 0 : 1), C.tube, tube, 3, 0.02);
    }
  }
  if (seesGlass) paintPaneSheen(p, proj);

  const items: Drawable[] = setBoxes(G, o.torchOnHook ?? false, L, o.dress).filter((b) => !o.omit?.includes(b.id)).map((b) => ({depth: boxDepth(proj, b), draw: () => paintBox(p, proj, b, 7, L)}));
  items.push(...(o.actors ?? []));
  items.sort((a, b) => b.depth - a.depth).forEach((d) => d.draw());
};

/** Projected size helpers for actor placement. */
export const groundAt = (proj: Proj, x: number, z: number): {g: Pt; unit: number; depth: number} => ({g: proj.P([x, 0, z]), unit: proj.k([x, 0, z]), depth: proj.depth([x, 0, z])});
