import {hash} from '../kit/hash';
import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import type {Painter, Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {paintBox, qx, qy, qz, wFill, wInk, wWash} from '../kit/world';
import {camPoint, type YCam} from '../kit/ycam';

export const LIME_PAPER = '#283d53';
const BENCH_TOP = 0.88;

const line = (p: Painter, id: number, pts: Pt[], color: string, weight = 1.3) =>
  inkLine(p, id, pts, {color, weight, closed: false, curve: 0.16, still: true});

export function point(c: YCam, v: V3): Pt {
  const q = camPoint(c, v);
  if (!q) throw new Error('EDU26 wash-bench anchor outside camera near plane');
  return q;
}

// Terracotta sits on the projected horizontal support, with open mouth and a
// warm lit plane. The opening is dark and shows no contents.
export function pottery(p: Painter, c: YCam, id: number, at: V3, height: number, width: number) {
  const [x, y] = point(c, at);
  const [tx, ty] = point(c, [at[0], at[1] + height, at[2]]);
  const left = point(c, [at[0] - width / 2, at[1], at[2]]);
  const right = point(c, [at[0] + width / 2, at[1], at[2]]);
  const r = (right[0] - left[0]) / 2;
  const h = y - ty;
  const shape: Pt[] = [[tx - r * .47, ty], [tx - r * .44, ty + h * .24], [x - r * .86, y - h * .55],
    [x - r, y - h * .31], [x - r * .88, y - h * .12], [x - r * .62, y], [x - r * .21, y + h * .045],
    [x + r * .45, y + h * .035], [x + r * .81, y - h * .075], [x + r, y - h * .32],
    [x + r * .82, y - h * .56], [tx + r * .44, ty + h * .23], [tx + r * .46, ty]];
  washAt(p, id, '#3d3342', 149, ell(x + r * .31, y + h * .025, r * 1.4, h * .105, 18), .19, .43);
  hardFill(p, id + 1, '#a74d32', shape);
  washAt(p, id + 2, '#e6a46e', 165,
    [[tx - r * .43, ty + h * .2], [x - r * .80, y - h * .48], [x - r * .86, y - h * .18],
      [x - r * .45, y], [x - r * .17, y - h * .14], [x - r * .29, y - h * .61]], .23, .34);
  washAt(p, id + 3, '#602d31', 137, [[tx + r * .38, ty + h * .19], [x + r * .87, y - h * .51],
    [x + r * .90, y - h * .21], [x + r * .63, y - h * .02], [x + r * .14, y + h * .01], [x + r * .22, y - h * .52]], .12, .39);
  hardFill(p, id + 4, '#e29868', ell(tx, ty, r * .53, h * .095, 24));
  hardFill(p, id + 5, '#482b33', ell(tx, ty, r * .38, h * .056, 24));
  line(p, id + 6, [[x - r * .76, y - h * .19], [x - r * .26, y - h * .12], [x + r * .28, y - h * .12], [x + r * .71, y - h * .17]], '#783c31');
}

function trough(p: Painter, c: YCam, id: number, x0: number, x1: number, z0: number, z1: number, rim: number) {
  paintBox(p, c, id, {x0, x1, z0, z1, y0: 0.11, y1: rim}, '#a28c77', {front: .28, left: .18, top: -.12}, {grain: 43});
  wFill(p, c, id + 20, '#444756', qy(rim + .003, x0 + .085, x1 - .085, z0 + .08, z1 - .08));
  wFill(p, c, id + 21, '#526f78', qy(rim + .004, x0 + .115, x1 - .10, z0 + .18, z1 - .105));
  wWash(p, c, id + 22, '#78a29c', 117, qy(rim + .006, x0 + .17, x1 - .19, z0 + .21, z1 - .17), .11, .4);
  for (let i = 0; i < 5; i++) {
    const z = z0 + .24 + .067 * i;
    const x = x0 + .20 + .06 * hash(id + i);
    wInk(p, c, id + 25 + i, [[x, rim + .007, z], [x + .14, rim + .007, z + .02],
      [x + .35, rim + .007, z + .01]], {closed: false, color: i % 2 ? '#90a7a0' : '#63868d', weight: 1.8});
  }
  wInk(p, c, id + 31, [[x0 + .06, rim + .009, z0 + .03], [x0 + .06, rim + .009, z1 - .035],
    [x1 - .04, rim + .009, z1 - .035]], {closed: false, color: '#dfbf98', weight: 2.2});
  wWash(p, c, id + 32, '#6b7777', 135, qz(z1 + .002, x0 + .17, x0 + .25, .33, rim - .03), .17, .48);
  wWash(p, c, id + 33, '#79695e', 80, qz(z1 + .003, x1 - .28, x1 - .19, .31, rim - .06), .24, .41);
}

function dryingLine(p: Painter, c: YCam) {
  const z = -2.48;
  wInk(p, c, 26201, [[-1.60, 1.90, z], [-.82, 1.86, z], [.16, 1.84, z], [.96, 1.86, z], [1.65, 1.90, z]],
    {color: '#b49a79', weight: 2.3, closed: false});
  const panel: V3[] = [[.66, 1.88, z], [1.28, 1.90, z], [1.36, 1.35, z + .04],
    [1.20, 1.27, z + .06], [.98, 1.31, z + .06], [.71, 1.29, z + .04]];
  wFill(p, c, 26202, '#c69c79', panel);
  wWash(p, c, 26203, '#f6cda2', 124, [[.66, 1.88, z], [.94, 1.89, z], [.96, 1.30, z + .06],
    [.71, 1.29, z + .04]], .07, .28);
  wWash(p, c, 26204, '#815e58', 119, [[1.08, 1.89, z], [1.28, 1.90, z], [1.36, 1.35, z + .04],
    [1.21, 1.28, z + .06], [1.14, 1.58, z]], .1, .32);
  wInk(p, c, 26205, [[.72, 1.34, z + .04], [.99, 1.35, z + .06], [1.21, 1.32, z + .06], [1.34, 1.39, z + .04]],
    {color: '#805b52', weight: 1.7, closed: false});
  wInk(p, c, 26206, panel, {color: '#71534c', weight: 1.4});
  wFill(p, c, 26207, '#8ea2a0', [[1.43, 1.88, z], [1.65, 1.90, z], [1.68, 1.47, z + .04], [1.45, 1.44, z + .045]]);
  wInk(p, c, 26208, [[1.45, 1.50, z + .046], [1.68, 1.52, z + .045]], {color: '#4f686e', weight: 1.7, closed: false});
}

export function paintWashRoom(p: Painter, c: YCam) {
  wFill(p, c, 26100, '#4a4656', qy(0, -2.1, 2.0, -2.8, 1.96));
  wFill(p, c, 26101, '#324e67', qz(-2.8, -2.1, 2.0, 0, 3));
  wFill(p, c, 26102, '#3c5066', qx(-2.1, 0, 3, -2.8, 1.96));
  wFill(p, c, 26103, '#273b52', qx(2.0, 0, 3, -2.8, 1.96));
  wFill(p, c, 26104, '#34495d', qy(3, -2.1, 2.0, -2.8, 1.96));
  wFill(p, c, 26105, '#8e887d', qz(-2.797, -2.1, 2.0, 0, .37));
  wWash(p, c, 26106, '#82989c', 54, [[-.58, .53, -2.796], [1.41, .69, -2.796], [1.55, 1.71, -2.796],
    [1.09, 2.66, -2.796], [-.21, 2.87, -2.796], [-.57, 2.08, -2.796]], .44, .68);
  wWash(p, c, 26107, '#152e49', 77, [[.88, .39, -2.795], [1.98, .37, -2.795], [1.99, 2.99, -2.795],
    [1.53, 2.95, -2.795], [1.16, 2.30, -2.795], [.91, 1.41, -2.795]], .35, .66);
  wWash(p, c, 26108, '#b48475', 83, [[-2.1, .42, -2.793], [-.42, .47, -2.793], [-.86, 1.66, -2.793],
    [-1.28, 2.44, -2.793], [-2.1, 2.78, -2.793]], .39, .59);
  wWash(p, c, 26109, '#e0ab81', 145, [[-2.10, .42, -2.789], [-1.04, .49, -2.789], [-1.41, 1.48, -2.789],
    [-1.65, 2.30, -2.789], [-2.10, 2.61, -2.789]], .23, .38);

  // Aperture drawn on the room's left wall, with sun grazing its jamb and
  // spreading onto the floor. Some angles see only the spill from this source.
  wFill(p, c, 26110, '#935f55', qx(-2.097, 0, 2.33, -1.96, -.69));
  wFill(p, c, 26111, '#edbf92', qx(-2.092, 0, 2.22, -1.88, -.79));
  wWash(p, c, 26112, '#ffdab3', 147, qx(-2.090, .17, 2.16, -1.86, -1.05), .24, .36);
  wFill(p, c, 26113, '#b98465', qx(-2.089, .0, .14, -1.91, -.73));
  wWash(p, c, 26114, '#d2a17c', 151, [[-2.08, .009, -1.87], [-.09, .009, -2.59], [1.05, .009, -1.61], [-2.08, .009, -.78]], .26, .52);

  for (let i = 0; i < 32; i++) {
    const x = -2.07 + 4 * hash(26140 + i);
    const y = .40 + 2.49 * hash(26184 + i);
    const width = .12 + .27 * hash(26381 + i);
    const z = -2.788;
    wWash(p, c, 26420 + i, i % 4 ? '#a2a8a5' : '#152e47', i % 5 ? 29 : 51,
      [[x, y, z], [Math.min(x + width, 1.99), y + .025, z], [Math.min(x + width * .76, 1.99), y + .125, z], [x, y + .106, z]], .26, .61);
  }
  for (let i = 0; i < 98; i++) {
    const x = -2.06 + 4.02 * hash(26970 + i);
    const y = .47 + 2.48 * hash(27110 + i);
    const len = .019 + .071 * hash(27230 + i);
    wInk(p, c, 27380 + i, [[x, y, -2.781], [x + len * .46, y + .006, -2.781],
      [Math.min(x + len, 1.99), y + .013 * hash(27480 + i), -2.781]],
      {color: i % 3 ? '#526e7b' : '#294558', weight: .75 + 1.1 * hash(27610 + i), closed: false});
  }
  for (let i = 0; i < 6; i++) {
    const x = -1.82 + i * .67;
    wInk(p, c, 26503 + i, [[x, .012, -2.79], [x + .06, .012, -.85], [x + .09, .012, .88]],
      {color: '#71687a', weight: 1.1, closed: false});
  }
  wInk(p, c, 26510, [[-2.06, .014, -1.34], [-.21, .014, -1.34], [1.97, .014, -1.31]], {color: '#78677a', weight: 1.2, closed: false});

  paintBox(p, c, 26530, {x0: -1.72, x1: -.93, y0: 1.39, y1: 1.47, z0: -2.76, z1: -2.52},
    '#aa826d', {front: .28, top: -.16}, {grain: 37});
  pottery(p, c, 26549, [-1.45, 1.473, -2.62], .23, .25);
  pottery(p, c, 26560, [-1.15, 1.473, -2.61], .15, .19);
  dryingLine(p, c);
  trough(p, c, 26600, -1.59, -.84, -2.10, -1.34, .79);
  trough(p, c, 26650, .61, 1.75, -1.56, -.68, .80);
}

export function paintTransferBench(p: Painter, c: YCam) {
  wWash(p, c, 26690, '#292b3d', 123, [[-.91, .015, -.64], [.96, .015, -.64], [1.32, .015, .24],
    [.71, .015, .39], [-.96, .015, .22]], .26, .55);
  paintBox(p, c, 26700, {x0: -.78, x1: .78, y0: 0, y1: .81, z0: -.62, z1: -.07}, '#6b6071', {front: .16, left: .11}, {grain: 35});
  paintBox(p, c, 26714, {x0: -.84, x1: .84, y0: .80, y1: BENCH_TOP, z0: -.65, z1: .015},
    '#b39983', {front: .26, top: -.28, left: .16}, {grain: 47});
  const y = BENCH_TOP + .002;
  wWash(p, c, 26730, '#f9d9ac', 142, [[-.83, y, -.64], [.13, y, -.63], [.50, y, .011], [-.52, y, .013]], .24, .52);
  wWash(p, c, 26731, '#807782', 124, [[.46, y, -.64], [.834, y, -.64], [.834, y, .012], [.67, y, .011]], .24, .49);
  wInk(p, c, 26732, [[-.829, y + .001, .005], [-.35, y + .001, .005], [.38, y + .001, .005], [.823, y + .001, .005]],
    {color: '#e0bd98', weight: 2.4, closed: false});
  for (let i = 0; i < 18; i++) {
    const x = -.79 + 1.52 * hash(26760 + i);
    const z = -.60 + .54 * hash(26840 + i);
    wWash(p, c, 26880 + i, i % 3 ? '#796f74' : '#e8c09c', 57,
      [[x, y, z], [x + .055, y, z + .015], [x + .029, y, z + .04], [x - .01, y, z + .022]], .23, .50);
  }
  wInk(p, c, 26903, [[-.58, .77, -.067], [-.56, .39, -.067], [-.59, .037, -.067]], {color: '#8f7780', weight: 1.45, closed: false});
  wInk(p, c, 26904, [[.39, .76, -.067], [.41, .36, -.067], [.38, .021, -.067]], {color: '#5f5368', weight: 1.4, closed: false});
  wWash(p, c, 26905, '#937989', 49, [[-.56, .15, -.064], [.11, .17, -.064], [.48, .53, -.064],
    [.26, .70, -.064], [-.42, .74, -.064], [-.62, .40, -.064]], .39, .71);
  for (let i = 0; i < 56; i++) {
    const x = -.74 + 1.45 * hash(27161 + i);
    const y0 = .06 + .71 * hash(27780 + i);
    const z = -.062;
    wInk(p, c, 27880 + i, [[x, y0, z], [x + .015, y0 + .005, z], [x + .027, y0 + .013, z]],
      {color: i % 3 ? '#786978' : '#5b5266', weight: .7 + .95 * hash(27985 + i), closed: false});
  }
}
