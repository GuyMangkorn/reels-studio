import {useCallback} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {CameraLayer} from '../kit/camera';
import {drawFigure} from '../kit/cast';
import {ell, hardFill, inkLine, quadY, quadZ, rectPts, washAt, type InteriorLight} from '../kit/draw';
import {Spot} from '../kit/glow';
import type {FaceState} from '../kit/head';
import type {Painter, Pt} from '../kit/painter';
import {Grade, Grain} from '../kit/screen';
import type {V3} from '../kit/space';
import {paintNarratorBack} from './narrator-back';
import {LowerFalloff} from './room-screen';
import {COWORKER, FPS, hangArms, NARRATOR_DARK, PAPER_ROOM, PICTURE_H, PICTURE_W, plate, push, roomP, roomUnit} from './rooms';

// KSO-EP01-SHORT LF04, the izakaya (brief KSO-BRIEF-FILM-R2 VD04, changed by the user 1 Nov 2026; shot S01-B02-SH01): a Japanese
// after-work drinking bar. The coworker tells the story across a table, half-body (waist up): the table top cuts her at the hip
// line. The narrator sits at the near side of the table, seen from behind (`narrator-back.ts`: new art, dark work jacket).
// Warm orange lamp-light: one paper lantern on the table lights the coworker from below-right (the kit key, unchanged: the
// under-chin read stays as accepted), two paper lanterns and a noren on the back wall, bottles on a shelf at the right.
// Projection: the one street lens (rooms.ts, `roomP`/`roomUnit`); each figure stands at its physical depth on that lens.
// Glow peak <= 0.3 (kit GLOW_PEAK, `Spot` caps it).

const ZW = 1.2; // back wall plane (m); the camera at z 4.7
const ZFLOOR = 4.2; // nearest floor edge painted
const TABLE_H = 0.75; // table top (m)
const ZT_B = 2.2; // table back edge (m)
const ZT_F = 2.65; // table front edge (m); the narrator sits in front of it
const COW_G: V3 = [0, 0, 2.0]; // the coworker stands behind the table, 0.2 m behind its back edge
const NARR_G: V3 = [-0.45, 0, 2.9]; // the narrator sits at the near side, 0.25 m in front of the front edge
const SEAT_DROP = 0.15; // m: the narrator's seated lowering (head top 1.55 m; hip line 0.56 m)
const LANTERN: V3 = [0.2, TABLE_H + 0.17, 2.4]; // table lantern, centre
const LAMP = '#ff9a3c';

/** The coworker: lamp from below-right (travel up and a little screen-left), warm skin, faint cool rim. Unchanged from round 4. */
const L_COW: InteriorLight = {key: [-0.25, -1], rim: [0.7, 0.8], rimScale: 0.3};
/** The narrator from behind: room light from above, a faint rim from the lantern on the lower right of the jacket and hair. */
const L_BACK: InteriorLight = {key: [0.1, 1], rim: [-0.8, -0.6], rimScale: 0.5};
/** Coworker mid-story: wide eyes, talking mouth (as round 4). */
const COW_FACE: FaceState = {brow: 'flat', eyes: 'wide', look: [0, 0], mouth: 'talk', open: 0.55};

/** LF04 camera: the brief's slow push (1.00 -> 1.05 over the 162 f shot), about the coworker's head. */
export const camIzakaya = (tl: number) => push(tl, 5.4, 1.05, 540, 700);

const q = (pts: V3[]): Pt[] => pts.map(roomP);

/** A paper lantern (ellipsoid body, caps, ribs) centred on world point `c`, radii in metres. */
const paperLantern = (p: Painter, seed: number, c: V3, rx: number, ry: number) => {
  const [cx, cy] = roomP(c), u = roomUnit(c[2]);
  hardFill(p, seed, '#4a2612', ell(cx, cy - (ry + 0.01) * u, 0.5 * rx * u, 0.02 * u, 12));
  hardFill(p, seed + 1, '#f08a3c', ell(cx, cy, rx * u, ry * u, 22));
  hardFill(p, seed + 2, '#ffc27a', ell(cx - 0.12 * rx * u, cy - 0.18 * ry * u, 0.5 * rx * u, 0.55 * ry * u, 16));
  inkLine(p, seed + 3, ell(cx, cy, rx * u, ry * u, 22), {color: '#5a2810', weight: 1.2});
  for (const f of [-0.5, 0.5]) inkLine(p, seed + 4 + (f > 0 ? 1 : 0), [[cx + f * rx * u * 0.9, cy - ry * u * 0.9], [cx + f * rx * u, cy], [cx + f * rx * u * 0.9, cy + ry * u * 0.9]], {closed: false, weight: 0.9, color: '#6a3414'});
};

/**
 * The back wall (warm plaster, wood wainscot with vertical slats, a noren on a rail, two paper lanterns, a bottle shelf at the
 * right) and the floor. Painted first: the table, the figures and the lantern go in front.
 */
export const paintIzakayaBack = (p: Painter) => {
  washAt(p, 6_410_001, '#2a1a0e', 255, rectPts(-300, -300, 1380, 2220), 0.1, 0.2);
  washAt(p, 6_410_002, '#6a3f1f', 255, q(quadZ(ZW, -2, 2, 0, 2.6)), 0.2, 0.35); // plaster wall, brighter and warmer than the old back room
  washAt(p, 6_410_003, '#5a3418', 255, q(quadZ(ZW + 0.003, -2, 2, 0, 1.2)), 0.15, 0.3); // wainscot
  for (let i = -8; i <= 8; i++) inkLine(p, 6_410_010 + i + 8, q([[i * 0.25, 0, ZW + 0.004], [i * 0.25, 1.2, ZW + 0.004]]), {color: '#2a170a', weight: 1.2, closed: false});
  inkLine(p, 6_410_030, q([[-2, 1.2, ZW + 0.005], [2, 1.2, ZW + 0.005]]), {color: '#21130a', weight: 2.2, closed: false});

  // Noren: three dark cloth panels from a rail at 2.25 m to the hem at 1.85 m, each with a lighter hem band.
  [-0.36, 0, 0.36].forEach((x, i) => {
    hardFill(p, 6_410_040 + i, i === 1 ? '#40281a' : '#34211a', q(quadZ(ZW + 0.02, x - 0.16, x + 0.16, 1.85, 2.25)));
    hardFill(p, 6_410_043 + i, '#7a4a24', q(quadZ(ZW + 0.021, x - 0.16, x + 0.16, 1.85, 1.92)));
  });

  // Paper lanterns hanging at the back, either side of the noren.
  paperLantern(p, 6_410_050, [-0.62, 2.0, 1.5], 0.1, 0.13);
  paperLantern(p, 6_410_060, [0.72, 2.0, 1.5], 0.1, 0.13);

  // Bottle shelf at the right: a board at 1.44 m, seven bottles of dark glass and amber.
  hardFill(p, 6_410_070, '#3a2414', q(quadZ(ZW + 0.02, 0.78, 1.8, 1.42, 1.46)));
  const bottles: [number, number, string][] = [
    [0.85, 0.3, '#2d4a3a'], [0.97, 0.24, '#6b3f22'], [1.09, 0.33, '#8a6a2c'], [1.21, 0.27, '#243a4c'],
    [1.33, 0.31, '#5a3320'], [1.45, 0.25, '#2d4a3a'], [1.57, 0.29, '#7a5a2a'],
  ];
  bottles.forEach(([x, h, c], i) => {
    hardFill(p, 6_410_080 + i, c, q(quadZ(ZW + 0.03, x - 0.04, x + 0.04, 1.46, 1.46 + h)));
    hardFill(p, 6_410_090 + i, c, q(quadZ(ZW + 0.03, x - 0.015, x + 0.015, 1.46 + h, 1.46 + h + 0.06))); // neck
  });

  // Floor: dark boards with joints from the wall to the near edge.
  hardFill(p, 6_410_100, '#2a1a0f', q(quadY(0, -2, 2, ZW, ZFLOOR)));
  [-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2].forEach((x, i) => inkLine(p, 6_410_110 + i, q([[x, 0, ZW], [x, 0, ZFLOOR]]), {color: '#140b05', weight: 1, closed: false}));
};

/** The table: a long top across the frame, its front lip and face. `mono` paints every part one colour (the lead measure). */
export const paintTable = (p: Painter, mono?: string) => {
  const col = (c: string) => mono ?? c;
  hardFill(p, 6_420_001, col('#7d4f2a'), q(quadY(TABLE_H, -2, 2, ZT_B, ZT_F)));
  if (!mono) washAt(p, 6_420_002, '#b07a44', 50, q(quadY(TABLE_H, -0.6, 0.8, ZT_B + 0.04, ZT_F - 0.06)), 0.1, 0.2); // lamp sheen
  hardFill(p, 6_420_003, col('#5e3a1e'), q(quadZ(ZT_F, -2, 2, TABLE_H - 0.03, TABLE_H))); // front lip
  hardFill(p, 6_420_004, col('#3f2615'), q(quadZ(ZT_F, -2, 2, 0, TABLE_H - 0.03))); // front face
  if (!mono) {
    inkLine(p, 6_420_010, q([[-2, TABLE_H, ZT_F], [2, TABLE_H, ZT_F]]), {color: '#1d1109', weight: 1.6, closed: false});
    [0.3, 0.55].forEach((y, i) => inkLine(p, 6_420_011 + i, q([[-2, y, ZT_F], [2, y, ZT_F]]), {color: '#24150a', weight: 1, closed: false}));
    // Items on the table: an amber beer glass with foam, a sake cup, a small dish of edamame.
    hardFill(p, 6_420_020, '#c78a33', q(quadZ(2.42, -0.25, -0.19, TABLE_H, TABLE_H + 0.12)));
    hardFill(p, 6_420_021, '#f4ead0', q(quadZ(2.42, -0.25, -0.19, TABLE_H + 0.1, TABLE_H + 0.12)));
    inkLine(p, 6_420_022, q(quadZ(2.42, -0.25, -0.19, TABLE_H, TABLE_H + 0.12)), {color: '#3a2412', weight: 1.1});
    hardFill(p, 6_420_023, '#ece6d6', q(quadZ(2.25, 0.02, 0.07, TABLE_H, TABLE_H + 0.05)));
    const [dx, dy] = roomP([0.35, TABLE_H + 0.004, 2.5]), du = roomUnit(2.5);
    hardFill(p, 6_420_024, '#e6dcc0', ell(dx, dy, 0.07 * du, 0.035 * du, 18));
    for (let i = 0; i < 5; i++) hardFill(p, 6_420_030 + i, '#7fa050', ell(dx + (i - 2) * 0.022 * du, dy - 0.008 * du * (i % 2), 0.014 * du, 0.008 * du, 8));
  }
};

/** The table lantern: a paper lantern on a short stand, the one light source in front of the coworker. */
export const paintLantern = (p: Painter) => {
  const [lx, ly] = roomP([LANTERN[0], TABLE_H, LANTERN[2]]), du = roomUnit(LANTERN[2]);
  hardFill(p, 6_430_000, '#3a2414', rectPts(lx - 0.012 * du, ly - 0.035 * du, lx + 0.012 * du, ly));
  paperLantern(p, 6_430_010, LANTERN, 0.1, 0.13);
};

/** The coworker (shopworker, front view, P01 arms down, hidden below the table): the same rig, face and light as round 4. */
export const paintCoworker = (p: Painter, tl: number) => {
  const cg = roomP(COW_G), cu = roomUnit(COW_G[2]);
  drawFigure(p, COWORKER, cg, cu, {view: 'front', face: COW_FACE, light: L_COW, warm: 1, ...hangArms(COWORKER, cg, cu, 0, 'front')}, tl);
};

/** The narrator from behind, seated at the near side of the table. */
export const paintNarrator = (p: Painter) => paintNarratorBack(p, NARRATOR_DARK, roomP(NARR_G), roomUnit(NARR_G[2]), L_BACK, SEAT_DROP);

/**
 * The lead measure (`room-qa-index.tsx`): the coworker alone on paper, with the table painted in the paper colour so the figure
 * ends at the table line as in the picture.
 */
export const leadFigures = (paper: string) => (p: Painter, tl: number) => {
  paintCoworker(p, tl);
  paintTable(p, paper);
};

/** LF04 still composition: the back wall, the coworker, the table, the lantern, the narrator from behind, the lantern glow, the falloff and the shared grade. */
export const LF04 = ({falloff = true}: {falloff?: boolean}) => {
  const frame = useCurrentFrame();
  const paint = useCallback(
    ({brush, frame}: PaintContext) => plate(brush, frame, camIzakaya, (p, tl) => {
      paintIzakayaBack(p);
      paintCoworker(p, tl);
      paintTable(p);
      paintLantern(p);
      paintNarrator(p);
    }, PAPER_ROOM),
    [],
  );
  const [lx, ly] = roomP(LANTERN);
  const [nx, ny] = roomP([-0.62, 2.0, 1.5]), [mx, my] = roomP([0.72, 2.0, 1.5]);
  return (
    <AbsoluteFill style={{background: PAPER_ROOM}}>
      <BrushCanvas paint={paint} paper={PAPER_ROOM} />
      <CameraLayer camera={camIzakaya(frame / FPS)} width={PICTURE_W} height={PICTURE_H}>
        <Spot x={lx} y={ly} r={520} level={0.3} color={LAMP} />
        <Spot x={nx} y={ny} r={200} level={0.25} color={LAMP} />
        <Spot x={mx} y={my} r={200} level={0.25} color={LAMP} />
      </CameraLayer>
      {falloff && <LowerFalloff from={840} to={1080} peak={0.6} />}
      <Grade />
      <Grain />
    </AbsoluteFill>
  );
};
