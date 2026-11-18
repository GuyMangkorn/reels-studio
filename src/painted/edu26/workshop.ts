import {inkLine, solid, washAt} from '../kit/draw';
import {paintFigureAt} from '../kit/figure-at';
import {hash} from '../kit/hash';
import {mixColor, ring, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import type {V3} from '../kit/space';
import {paintBox, qx, qy, qz, wFill, wInk, wWash} from '../kit/world';
import {camPoint, type YCam} from '../kit/ycam';

export const PAPER = '#8e7962';

// E26-C01-S01-B01-SH01. World axes follow BRIEF-R1. The apprentice stands
// just inside the entrance, looking down from eye height at the transfer.
const CAMERA: YCam = {x: -0.02, y: 1.53, z: 1.37, yaw: -2.71, pitch: -0.22, f: 950, hy: 870};
const CUSTOMER_AT: V3 = [-0.62, 0, 2.67];
const CLOTH_AT: V3 = [-0.42, 1.19, 2.22];
const CUSTOMER = {
  ...PEOPLE['woman-ponytail'],
  height: 1.72,
  outfit: {
    shoulder: 0.36,
    shirt: '#738876',
    sleeve: '#7b8f7b',
    longSleeves: false,
    skirt: '#616d5d',
    skirtHem: 0.16,
    gear: {drape: '#5f7569'},
    pants: '#c9a383',
    shoes: '#6c4938',
  },
} satisfies typeof PEOPLE['woman-ponytail'];

const contour = (p: Painter, n: number, points: Pt[], color: string, weight = 1.2) =>
  inkLine(p, n, points, {color, weight, curve: 0.12, closed: false});

function plasterAndThreshold(p: Painter) {
  const c = CAMERA;
  wFill(p, c, 101, '#726357', qy(0, -2.1, 2.1, -1.2, 3.1));
  wFill(p, c, 102, '#ae9a7c', qz(3.1, -2.1, 2.1, 0, 2.8));
  wFill(p, c, 103, '#8c7764', qx(-2.1, 0, 2.8, -1.2, 3.1));
  wFill(p, c, 104, '#82735f', qx(2.1, 0, 2.8, -1.2, 3.1));

  wWash(p, c, 105, '#b08363', 62, qz(3.097, -2.1, 2.1, 0, 1.16), 0.3, 0.48);
  wWash(p, c, 106, '#e4c697', 55, qz(3.097, -1.68, 0.25, 0.4, 2.56), 0.3, 0.55);
  wWash(p, c, 107, '#675e51', 91, qx(-2.097, 0, 0.45, 1.1, 3.1), 0.2, 0.42);
  wWash(p, c, 108, '#ad8861', 46, [[-1.20, 0.01, 3.10], [-0.08, 0.01, 3.10], [0.83, 0.01, 1.41], [-0.63, 0.01, 1.1]], 0.28, 0.52);

  // The rear wall is visible either side of a timber-lined opening. Its outside
  // ground and shaded façade keep the daylight source legible.
  wFill(p, c, 111, '#6d5643', qz(3.093, -1.23, -0.07, 0, 2.25));
  wFill(p, c, 112, '#d8c8a7', qz(3.09, -1.16, -0.13, 0.09, 2.18));
  wWash(p, c, 113, '#d8a777', 104, qz(3.088, -1.14, -0.58, 0.11, 1.95), 0.20, 0.28);
  wFill(p, c, 114, '#a58461', qz(3.087, -1.16, -0.13, 0.08, 0.42));
  wFill(p, c, 115, '#b0956c', qz(3.083, -1.24, -0.055, 0, 0.095));
  wInk(p, c, 116, [[-1.17, 0.10, 3.082], [-1.17, 2.18, 3.082], [-0.13, 2.18, 3.082]], {closed: false, color: '#765e47', weight: 2.1});
  wInk(p, c, 117, [[-1.24, 2.28, 3.081], [-0.04, 2.28, 3.081]], {closed: false, color: '#79644f', weight: 1.7});

  for (let i = 0; i < 21; i++) {
    const x = -2.05 + 4.10 * hash(i + 61);
    if (x > -1.29 && x < 0.02) continue;
    const y = 0.24 + 2.21 * hash(i + 151);
    wWash(p, c, 145 + i, i % 3 ? '#86735c' : '#e4c7a6', 32 + 20 * hash(i + 241),
      [[x, y, 3.08], [x + 0.17, y + 0.025, 3.08], [x + 0.12, y + 0.27, 3.08], [x - 0.08, y + 0.13, 3.08]], 0.30, 0.46);
  }
  for (let i = 0; i < 12; i++) {
    const x = -2.05 + 4 * hash(620 + i);
    const z = 1.46 + 1.6 * hash(700 + i);
    wWash(p, c, 600 + i, i % 3 ? '#63574e' : '#a59179', 54,
      [[x, 0.012, z], [x + 0.15, 0.012, z + 0.02], [x + 0.1, 0.012, z + 0.16], [x - 0.09, 0.012, z + 0.12]], 0.23, 0.6);
  }
  for (let i = 0; i < 7; i++) {
    const z = 1.35 + i * 0.26;
    wInk(p, c, 182 + i, [[-2.1, 0.014, z], [-0.42, 0.014, z + 0.025], [1.84, 0.014, z]], {closed: false, color: '#76614d', weight: 1});
  }
  for (let i = 0; i < 6; i++) {
    const x = -1.95 + i * 0.6;
    wInk(p, c, 193 + i, [[x, 0.012, 1.35], [x + 0.025, 0.012, 2.05], [x - 0.07, 0.012, 3.06]], {closed: false, color: '#76614d', weight: 1});
  }
}

function workroomProps(p: Painter) {
  const c = CAMERA;
  // Two wall niches, a plain work shelf and a drying cord establish the
  // cloth-working room. The jar offered later remains out of the frame.
  const niche = (x0: number, x1: number, y0: number, y1: number, id: number) => {
    wFill(p, c, id, '#9d866b', qz(3.083, x0 - 0.026, x1 + 0.026, y0 - 0.027, y1 + 0.018));
    wFill(p, c, id + 1, '#786b59', qz(3.081, x0, x1, y0, y1));
    wFill(p, c, id + 2, '#bba083', qz(3.079, x0 - 0.025, x1 + 0.025, y0, y0 + 0.057));
  };
  niche(-1.75, -1.31, 1.25, 1.69, 201);
  niche(0.02, 0.37, 1.39, 1.74, 205);
  paintBox(p, c, 222, {x0: -1.93, x1: -1.27, y0: 0.80, y1: 0.87, z0: 2.86, z1: 3.08}, '#927457', {}, {grain: 0.39});
  paintBox(p, c, 238, {x0: -1.91, x1: -1.31, y0: 0.06, y1: 0.79, z0: 2.9, z1: 3.09}, '#89745c', {back: 0.14}, {grain: 0.36});
  // Damp lengths hang folded over the line between a wall peg and a timber
  // post. Brush folds run from the line down to weighted, irregular hems.
  const lineZ = 2.99;
  const line: V3[] = [[-1.29, 1.995, lineZ], [-1.66, 1.966, lineZ], [-2.10, 1.985, lineZ]];
  wFill(p, c, 251, '#8e765e', qz(3.065, -2.11, -2.04, 0.40, 2.22));
  wInk(p, c, 252, line, {closed: false, color: '#665745', weight: 2.1});
  wFill(p, c, 253, '#6d6d5f', [[-1.40, 1.98, lineZ + 0.003], [-2.005, 1.965, lineZ + 0.003],
    [-2.05, 1.35, lineZ + 0.003], [-1.82, 1.37, lineZ + 0.003], [-1.44, 1.32, lineZ + 0.003]]);
  wFill(p, c, 254, '#9c9b83', [[-1.45, 1.996, lineZ - 0.013], [-1.66, 1.973, lineZ - 0.013],
    [-1.69, 1.973, lineZ - 0.013], [-1.98, 1.989, lineZ - 0.013], [-2.02, 1.39, lineZ - 0.041],
    [-1.88, 1.405, lineZ - 0.041], [-1.73, 1.366, lineZ - 0.039], [-1.56, 1.389, lineZ - 0.037],
    [-1.44, 1.36, lineZ - 0.035]]);
  for (const [i, [x, shade]] of [[-1.51, '#b4b29b'], [-1.66, '#777a6a'], [-1.76, '#b0ad96'], [-1.93, '#787b6c']].entries()) {
    const fold = Number(x);
    wWash(p, c, 255 + i, String(shade), 129,
      [[fold - 0.024, 1.973, lineZ - 0.018], [fold + 0.028, 1.967, lineZ - 0.018],
        [fold + 0.05, 1.415, lineZ - 0.052], [fold - 0.012, 1.425, lineZ - 0.052]], 0.18, 0.44);
  }
  wInk(p, c, 259, [[-2.01, 1.42, 2.942], [-1.87, 1.43, 2.942], [-1.73, 1.392, 2.942],
    [-1.56, 1.42, 2.944], [-1.45, 1.39, 2.948]], {closed: false, color: '#777766', weight: 1.25});
  wInk(p, c, 260, [[-1.27, 2.02, 3.026], [-1.295, 1.994, lineZ], [-1.326, 1.994, lineZ]], {closed: false, color: '#655444', weight: 2.3});

  // A low terracotta cup and folded linen live on the shelf. The coworker's
  // taller story jar remains off camera until its own shot.
  const cup = (y: number, radius: number): V3[] =>
    ring(-1.88, 2.92, radius, radius * 0.76, 20).map(([x, z]) => [x, y, z]);
  wWash(p, c, 264, '#514239', 107, cup(0.873, 0.16), 0.16, 0.35);
  const cupFoot = cup(0.876, 0.072);
  const cupLip = cup(1.08, 0.127);
  for (let i = 0; i < cupFoot.length - 1; i++) {
    wFill(p, c, 265 + i, mixColor('#a16f58', '#5a453b', Math.max(0, (i - 4) / 25)),
      [cupFoot[i], cupFoot[i + 1], cupLip[i + 1], cupLip[i]]);
  }
  wFill(p, c, 287, '#533e35', cup(1.083, 0.105));
  wInk(p, c, 288, cupLip, {color: '#805c49', weight: 1.2});

  const basin = {x0: -1.72, x1: -1.10, y0: 0.27, y1: 0.79, z0: 2.16, z1: 2.69};
  wWash(p, c, 291, '#403d36', 115, qy(0.018, -1.79, -1.04, 2.075, 2.741), 0.24, 0.40);
  // Water marks follow the working side and appear in the floor plane.
  wWash(p, c, 292, '#514d43', 106, [[-1.29, 0.019, 2.35], [-1.07, 0.019, 2.29],
    [-0.98, 0.019, 2.16], [-1.05, 0.019, 1.99], [-1.21, 0.019, 2.06], [-1.35, 0.019, 2.22]], 0.24, 0.43);
  for (const [i, [x, z]] of [[-0.95, 2.10], [-1.075, 1.98], [-0.94, 1.91], [-1.03, 1.83]].entries()) {
    wWash(p, c, 293 + i, '#4c4941', 119, ring(x, z, 0.045, 0.073, 12).map(([px, pz]) => [px, 0.02, pz]), 0.16, 0.38);
  }
  paintBox(p, c, 270, basin, '#777165', {back: 0.11}, {grain: 0.43});
  wWash(p, c, 296, '#635f55', 117, qz(2.158, -1.70, -1.12, 0.31, 0.70), 0.16, 0.48);
  const rim: V3[] = [[-1.67, .792, 2.20], [-1.16, .792, 2.20], [-1.14, .792, 2.24],
    [-1.14, .792, 2.62], [-1.19, .792, 2.65], [-1.64, .792, 2.65], [-1.68, .792, 2.60], [-1.69, .792, 2.24]];
  const water: V3[] = [[-1.639, .721, 2.225], [-1.182, .721, 2.225], [-1.168, .721, 2.261],
    [-1.168, .721, 2.596], [-1.20, .721, 2.616], [-1.608, .721, 2.616], [-1.646, .721, 2.567], [-1.655, .721, 2.260]];
  wFill(p, c, 297, '#464945', rim);
  wFill(p, c, 298, '#354843', water);
  wWash(p, c, 299, '#7a9789', 116, [[-1.591, .722, 2.58], [-1.28, .722, 2.59],
    [-1.22, .722, 2.49], [-1.55, .722, 2.51]], 0.14, 0.29);
  const nearLip: V3[] = [rim[0], rim[1], rim[2], [-1.12, .794, 2.18], [-1.70, .794, 2.16], [-1.72, .794, 2.22]];
  wFill(p, c, 300, '#968a76', nearLip);
  wInk(p, c, 301, [rim[7], rim[0], rim[1], rim[2]], {closed: false, color: '#aaa08b', weight: 1.6});
  wInk(p, c, 302, [[-1.59, .723, 2.39], [-1.53, .723, 2.37], [-1.43, .723, 2.37], [-1.39, .723, 2.40]],
    {closed: false, color: '#8ea89a', weight: 1.25});
  wInk(p, c, 303, [[-1.37, .723, 2.55], [-1.29, .723, 2.53], [-1.234, .723, 2.55]],
    {closed: false, color: '#8ea89a', weight: 1.1});
  for (const [i, x] of [-1.28, -1.23, -1.20].entries()) {
    wInk(p, c, 304 + i, [[x, .765, 2.155], [x + .008, .67 - i * .06, 2.155], [x + .015, .63 - i * .06, 2.155]],
      {closed: false, color: '#57584f', weight: 1.55});
  }
}

type Placement = (x: number, y: number) => Pt;
const atCloth: Placement = (x, y) => {
  const point = camPoint(CAMERA, CLOTH_AT);
  if (!point) throw new Error('Opening garment is behind the workshop camera');
  return [point[0] + x, point[1] + y];
};

function paintGarment(p: Painter) {
  const fold = (points: Pt[]) => points.map(([x, y]) => atCloth(x, y));
  // The folded garment sits in front of the torso at an angle. Its upper
  // edge rises toward the receiving thumb, with the sleeve tucked inside.
  const shape: Pt[] = [
    [-185, 7], [-151, -9], [-99, -14], [-46, -27], [22, -31], [76, -46],
    [142, -48], [196, -53], [222, -42], [233, -11], [229, 23], [218, 67],
    [209, 109], [193, 133], [132, 135], [84, 148], [21, 153], [-48, 166],
    [-104, 163], [-142, 153], [-164, 114], [-173, 80], [-189, 46],
  ];
  solid(p, 308, '#bca888', fold([[-187, 20], [-97, 2], [100, -30], [223, -34],
    [236, 20], [208, 132], [186, 147], [93, 160], [-46, 173], [-134, 173],
    [-158, 155], [-174, 114], [-184, 68]]), 5, 0.08);
  solid(p, 310, '#eee0ba', fold(shape), 5, 0.10);
  washAt(p, 315, '#a38b68', 76, fold([[-178, 15], [-151, 1], [-122, 12], [-120, 76],
    [-103, 130], [-94, 156], [-141, 147], [-160, 111]]), 0.13, 0.32);
  washAt(p, 319, '#ad9872', 82, fold([[169, -45], [199, -44], [222, -23], [218, 32],
    [202, 92], [186, 125], [146, 126], [158, 86], [163, 30]]), 0.18, 0.38);
  washAt(p, 321, '#f8edcc', 105, fold([[-71, -14], [18, -26], [77, -37], [114, -37],
    [86, 39], [47, 131], [-33, 148], [-68, 86]]), 0.14, 0.37);
  inkLine(p, 325, fold(shape), {color: '#866f53', weight: 1.25, curve: 0.13});
  contour(p, 326, fold([[-176, 12], [-138, 9], [-54, -5], [19, -10], [100, -29], [192, -35]]), '#b49b76', 1.4);
  contour(p, 327, fold([[-144, 135], [-109, 147], [-49, 151], [20, 138], [82, 134], [125, 122], [191, 120]]), '#9b8060', 1.55);
  contour(p, 329, fold([[-135, 17], [-133, 50], [-113, 93], [-107, 113]]), '#aa9174');
  contour(p, 330, fold([[173, -26], [167, 7], [155, 40], [150, 81]]), '#aa9174');

  const oil = (id: number, color: string, op: number, points: Pt[]) =>
    washAt(p, id, color, op, points.map(([x, y]) => atCloth(x, y)), 0.24, 0.48);
  oil(332, '#aa7536', 170, [[25, 82], [48, 72], [75, 74], [99, 87], [115, 95], [113, 114],
    [95, 123], [70, 126], [52, 117], [35, 118], [17, 107], [13, 91]]);
  oil(333, '#805128', 147, [[38, 85], [62, 81], [76, 90], [98, 96], [101, 108],
    [79, 116], [57, 113], [45, 105], [29, 104], [27, 93]]);
  oil(334, '#be914e', 145, [[19, 80], [25, 76], [34, 80], [34, 85], [23, 89], [15, 85]]);
  contour(p, 335, [[49, 89], [60, 87], [75, 90], [85, 96]].map(([x, y]) => atCloth(x, y)), '#c59861', 1.5);
}

function paintReceiptHands(p: Painter, shoulder: Pt) {
  const shape = (id: number, color: string, points: Pt[], outline: string) => {
    const rounded = points.flatMap(([x, y], i) => {
      const [nextX, nextY] = points[(i + 1) % points.length];
      return [atCloth(x * .80 + nextX * .20, y * .80 + nextY * .20), atCloth(x * .20 + nextX * .80, y * .20 + nextY * .80)];
    });
    const projected = rounded;
    solid(p, id, color, projected, 4, 0.08);
    inkLine(p, id + 1, projected, {color: outline, weight: 1.35, curve: 0.18});
  };
  shape(430, '#8b6653', [[669, 502], [538, 384], [440, 237], [358, 125], [275, 42], [248, 45], [227, 74],
    [233, 99], [284, 151], [345, 250], [420, 386], [550, 527]], '#6a5143');
  washAt(p, 432, '#ad8064', 101, [[483, 352], [404, 215], [276, 59], [253, 57], [313, 149], [413, 314]].map(([x, y]) => atCloth(x, y)), 0.20, 0.39);
  contour(p, 433, [[287, 60], [267, 68], [239, 99]].map(([x, y]) => atCloth(x, y)), '#634c42', 2.1);
  contour(p, 434, [[296, 73], [275, 85], [249, 108]].map(([x, y]) => atCloth(x, y)), '#ba896b', 1.55);
  shape(437, '#e3b48d', [[263, 41], [245, 13], [228, 5], [211, 11], [201, 20], [206, 31], [222, 38],
    [208, 53], [207, 67], [222, 87], [248, 90], [272, 68]], '#906d54');
  contour(p, 440, [[222, 40], [236, 42], [249, 53]].map(([x,y]) => atCloth(x,y)), '#ab7e61');
  contour(p, 441, [[218, 53], [233, 54], [243, 62]].map(([x,y]) => atCloth(x,y)), '#ab7e61');

  const [clothX, clothY] = atCloth(0, 0);
  const sx = shoulder[0] - clothX;
  const sy = shoulder[1] - clothY;
  // The customer bends the near arm from the shoulder toward the hem. Her
  // supporting hand is tucked behind the lifted fold and never breaks its outline.
  shape(460, '#d2a17d', [[148, -82], [167, -72], [169, -49], [151, -16],
    [122, 26], [94, 51], [82, 66], [72, 70], [66, 63], [72, 49], [79, 31],
    [78, 13], [86, -3], [105, -15], [121, -40], [125, -64]], '#8e6953');
  contour(p, 463, [[91, 5], [100, 12], [103, 20]].map(([x,y]) => atCloth(x,y)), '#a4775a');
  shape(466, '#748776', [[sx - 18, sy - 19], [sx + 18, sy - 13], [sx + 51, sy + 9],
    [161, -100], [174, -78], [152, -62], [126, -67], [119, -87],
    [sx + 5, sy + 19], [sx - 20, sy + 5]], '#5d6c5c');
  contour(p, 469, [[128, -75], [147, -71], [166, -83]].map(([x,y]) => atCloth(x,y)), '#9e9d7e', 1.45);
}

export function paintWorkshopReceipt(p: Painter) {
  plasterAndThreshold(p);
  workroomProps(p);
  const head = paintFigureAt(p, CAMERA, CUSTOMER, {
    at: CUSTOMER_AT, view: 'front', pose: 'P01', face: 'neutral', t: 0, seed: 26101,
    faceState: {look: [0.13, 0.16]},
    fig: {
      headCock: -5,
      lArm: {to: atCloth(14, -61), via: atCloth(36, -87), behind: 'all'},
      rArm: {to: atCloth(-79, 38), via: atCloth(-103, -63), behind: 'all'},
    },
    tint: {to: '#a9815e', u: 0.10},
    shadow: {color: '#574939', op: 57},
  });
  paintGarment(p);
  if (!head) throw new Error('Opening customer is behind the workshop camera');
  paintReceiptHands(p, head.lShoulder);
  return head;
}
