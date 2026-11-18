import {ell, hardFill, inkLine, shapedLimb, washAt} from '../kit/draw';
import {paintFigureAt} from '../kit/figure-at';
import {hash} from '../kit/hash';
import type {Painter, Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import type {V3} from '../kit/space';
import {wFill, wInk, wWash} from '../kit/world';
import type {YCam} from '../kit/ycam';
import {paintTransferBench, paintWashRoom, point, pottery} from './wash-bench-set';

export const LOOK_IDS = ['LF01', 'LF02', 'LF03'] as const;
export type LookId = typeof LOOK_IDS[number];

const radians = (d: number) => (d * Math.PI) / 180;
const CAMERAS: Record<LookId, YCam> = {
  LF01: {x: -.45, y: 1.47, z: 1.35, yaw: radians(12), pitch: radians(-19), f: 1040, hy: 1005},
  LF02: {x: -.22, y: 1.48, z: 1.05, yaw: radians(22), pitch: radians(-16), f: 1150, hy: 980},
  LF03: {x: -.39, y: 1.46, z: 1.12, yaw: radians(10), pitch: radians(-19), f: 1080, hy: 1004},
};

const CUSTOMER_AT: V3 = [-.37, 0, -.85];
const COWORKER_AT: V3 = [.58, 0, -.79];
const JAR_AT: V3 = [.57, .883, -.30];
const CUSTOMER = {
  ...PEOPLE['woman-curly'],
  outfit: {
    ...PEOPLE['woman-curly'].outfit,
    shirt: '#aa483d', sleeve: '#a74e3f', skirt: '#843c3b',
    shoulder: .365, gear: {drape: '#c16a4f'},
  },
};
const COWORKER = {
  ...PEOPLE['man-crop'], height: 1.68,
  outfit: {
    ...PEOPLE['man-crop'].outfit,
    shirt: '#bca080', sleeve: '#c2a27f', shoulder: .40,
    skirt: '#aa8d74', gear: {drape: '#5f7079'},
  },
};

const line = (p: Painter, id: number, pts: Pt[], color: string, weight = 1.55) =>
  inkLine(p, id, pts, {color, weight, closed: false, curve: .16, still: true});

function shadow(p: Painter, id: number, at: Pt, rx: number, ry: number) {
  washAt(p, id, '#493643', 132, ell(at[0] + 8, at[1] + 5, rx, ry, 22, .09), .19, .41);
}

// In both states, the doubled seam is the same local line on the same garment.
// The receiving frame lays it on the bench; the inspecting frame lifts its hem.
const clothPoint = (x: number, z: number, lifted: boolean, down = 0): V3 => {
  const raised = lifted ? .21 * Math.max(0, (x + .40) / .77) : 0;
  const drape = -Math.max(0, z - .013) * (lifted ? .46 : 1.6);
  return [x - .042 + z * .19, .903 + raised + drape - down, z - x * .15];
};

const INK_CLOTH = '#966c50';
function paintCloth(p: Painter, c: YCam, lifted: boolean, partial = false) {
  const v = (x: number, z: number, down = 0) => clothPoint(x, z, lifted, down);
  const corners: [number, number][] = [[-.43, -.414], [-.31, -.45], [-.07, -.432], [.14, -.459],
    [.33, -.383], [.39, -.25], [.34, -.15], [.391, -.025], [.30, .064], [.06, .082],
    [-.13, .063], [-.27, .091], [-.46, .039], [-.42, -.138], [-.48, -.225]];
  const rim = corners.map(([x, z]) => v(x, z));
  // Underpaint is opaque. Granular marks stay inside the silhouette and
  // keep the earlier bench strokes from showing through the garment.
  wWash(p, c, 27000, '#584252', 135, rim.map(([x, , z]) => [x + .018, .884, z + .022]), .13, .43);
  wFill(p, c, 27001, '#a97d62', corners.map(([x, z]) => v(x, z, .025)));
  wFill(p, c, 27002, partial ? '#b9ad9a' : '#f0d5a9', rim);
  wWash(p, c, 27003, '#fff3cc', 177, [v(-.42, -.39), v(-.09, -.40), v(.23, -.22), v(.29, -.065),
    v(.08, .052), v(-.24, .057), v(-.40, -.096)], .14, .48);
  wWash(p, c, 27004, '#bd9775', 155, [v(-.40, -.36), v(-.335, -.36), v(-.20, -.105), v(-.12, .047),
    v(-.255, .065), v(-.33, -.16)], .20, .43);
  wWash(p, c, 27005, '#c5a784', 141, [v(.08, -.39), v(.27, -.38), v(.28, -.24), v(.385, -.026),
    v(.28, .041), v(.20, -.10)], .13, .45);
  wWash(p, c, 27006, '#fff7d9', lifted ? 173 : 108, [v(.02, -.18), v(.20, -.22), v(.283, -.085),
    v(.26, .037), v(.056, .045)], .17, .36);
  wInk(p, c, 27007, rim, {color: '#9f795e', weight: 1.8});
  wInk(p, c, 27008, [v(-.44, .017), v(-.27, .067), v(-.12, .038), v(.06, .057), v(.28, .040), v(.361, -.02)],
    {color: INK_CLOTH, weight: 2.0, closed: false});
  wInk(p, c, 27009, [v(-.432, -.001), v(-.268, .048), v(-.117, .020), v(.063, .038), v(.275, .021), v(.343, -.028)],
    {color: '#ae825d', weight: 1.32, closed: false});
  // Folded collar edge gives the cream silhouette a garment cue before the
  // viewer sees the seam. Its position on the fold survives the lift.
  wWash(p, c, 27010, '#a28269', 139, [v(-.35, -.384), v(-.246, -.367), v(-.169, -.283),
    v(-.229, -.251), v(-.319, -.298), v(-.374, -.367)], .13, .32);
  wInk(p, c, 27011, [v(-.369, -.374), v(-.318, -.301), v(-.233, -.245), v(-.169, -.282)],
    {color: '#957052', weight: 1.6, closed: false});
  for (let i = 0; i < 18; i++) {
    const x = -.375 + i * .040;
    const z = .033 + (i < 5 ? i * .003 : .006 * hash(925 + i));
    wInk(p, c, 27030 + i, [v(x, z), v(x + .012, z - .012)],
      {color: hash(888 + i) > .5 ? '#7f5a4a' : '#edd6ac', weight: 1.21, closed: false});
  }
  if (!lifted) {
    const x = .127;
    const z = -.068;
    const stain: [number, number][] = [[-.119, -.032], [-.055, -.095], [.03, -.083], [.073, -.060],
      [.098, -.035], [.137, -.009], [.108, .02], [.050, .052], [-.011, .064], [-.095, .037]];
    wFill(p, c, 27015, partial ? '#887366' : '#aa6135', stain.map(([a,b]) => v(x + a, z + b)));
    wWash(p, c, 27016, '#784226', 110, [v(x - .076, z - .039), v(x + .008, z - .066), v(x + .093, z - .016),
      v(x + .054, z + .037), v(x - .072, z + .024)], .10, .37);
    wWash(p, c, 27017, '#deae61', 120, [v(x - .106, z - .029), v(x - .052, z - .078), v(x - .029, z - .053),
      v(x - .103, z + .007)], .17, .42);
  }
  return {
    corner: point(c, v(.34, -.017)),
    seam: point(c, v(.116, .031)),
    mark: point(c, v(.127, -.068)),
  };
}

function attachedArm(p: Painter, id: number, shoulder: Pt, elbow: Pt, wrist: Pt, skin: string, sleeve: string) {
  const upper = shapedLimb(shoulder, elbow, 51, 40, {capB: true, bulge: 4, n: 9});
  const fore = shapedLimb(elbow, wrist, 41, 31, {capB: true, bulge: 5, n: 9});
  hardFill(p, id, skin, upper);
  hardFill(p, id + 1, skin, fore);
  const bend: Pt = [(shoulder[0] + elbow[0]) * .5, (shoulder[1] + elbow[1]) * .5];
  hardFill(p, id + 2, sleeve, shapedLimb(shoulder, bend, 53, 52, {capB: false, flare: 3, n: 9}));
  const cuff: Pt = [bend[0] - 14, bend[1] - 10];
  line(p, id + 3, [cuff, [bend[0] - 1, bend[1] + 13], [bend[0] + 17, bend[1] + 15]], '#693d44');
  line(p, id + 4, [[elbow[0] + 14, elbow[1] + 5], [wrist[0] + 10, wrist[1] - 1]], '#774943', 1.2);
}

function customerContact(p: Painter, c: YCam, shoulder: Pt, target: Pt, lifted: boolean) {
  const [x,y] = target;
  const elbow: Pt = [shoulder[0] + (lifted ? 78 : 70), shoulder[1] + (lifted ? 74 : 86)];
  const wrist: Pt = [x - 38, y - 30];
  attachedArm(p, 27100, [shoulder[0] - 13, shoulder[1] + 12], elbow, wrist, '#a96e4c', '#a94d43');
  const tip: Pt = lifted ? [x, y + 6] : [x - 7, y - 7];
  const hand: Pt[] = [[wrist[0] - 10, wrist[1] - 5], [wrist[0] + 8, wrist[1] - 11],
    [tip[0] - 10, tip[1] - 13], [tip[0], tip[1] - 9], [tip[0] + 2, tip[1] - 3],
    [tip[0] - 1, tip[1] + 1], [tip[0] - 18, tip[1] - 4], [tip[0] - 19, tip[1] + 2],
    [wrist[0] + 3, wrist[1] + 12], [wrist[0] - 8, wrist[1] + 5]];
  hardFill(p, 27105, '#ba7e52', hand);
  line(p, 27106, [[tip[0] - 25, tip[1] - 3], [tip[0] - 22, tip[1] - 9], [tip[0] - 18, tip[1] - 9]], '#75483c', 1.15);
  // Tiny contact shadow lies on the cloth. Do not draw the player's other hand.
  if (lifted) wInk(p, c, 27107, [clothPoint(.10, .03, true), clothPoint(.14, .028, true)],
    {color: '#b9926c', weight: 1.9, closed: false});
}

function apprenticeGrip(p: Painter, [x, y]: Pt) {
  shadow(p, 27200, [x + 8, y + 14], 28, 9);
  const wrist: Pt = [x + 24, y + 12];
  const cuff: Pt = [x + 70, y + 56];
  const screen: Pt = [1200, 1580];
  hardFill(p, 27201, '#637f90', shapedLimb(screen, cuff, 201, 94, {capB: false, bulge: 12, n: 9}));
  washAt(p, 27202, '#8fa2a5', 101, [[x + 63, y + 53], [x + 85, y + 48], [1090, 1400], [1125, 1460]], .12, .37);
  hardFill(p, 27203, '#b88561', shapedLimb(cuff, wrist, 68, 36, {capB: true, bulge: 5, n: 9}));
  hardFill(p, 27204, '#8096a1', shapedLimb([x + 96, y + 75], cuff, 96, 80, {capB: false, flare: 6, n: 9}));
  hardFill(p, 27205, '#c69670', [[x + 22, y - 5], [x + 10, y - 22], [x - 5, y - 17], [x - 13, y - 6],
    [x - 7, y + 3], [x + 4, y + 2], [x + 6, y + 12], [x + 19, y + 17], [x + 30, y + 15]]);
  line(p, 27206, [[x - 6, y - 6], [x + 1, y - 10], [x + 7, y - 7]], '#815b4c');
  line(p, 27207, [[x + 66, y + 30], [x + 53, y + 50], [x + 56, y + 74]], '#456378', 2.25);
}

export function paintWashBenchLook(p: Painter, look: LookId) {
  const c = CAMERAS[look];
  paintWashRoom(p, c);
  const choice = look === 'LF02';
  const pickup = look === 'LF03';
  const actor = choice ? COWORKER : CUSTOMER;
  const at = choice ? COWORKER_AT : CUSTOMER_AT;
  const bodyCenter = point(c, [at[0], 1.06, at[2]]);
  // The hidden arm tracks sit behind the tunic. Only the episode's named
  // foreground contact arm extends past the shoulder.
  const figure = paintFigureAt(p, c, actor, {
    at, view: 'front', pose: 'P01', face: pickup ? 'happy' : 'neutral', t: 0,
    seed: choice ? 26111 : 26112,
    fig: {
      headCock: choice ? -6 : 5,
      lArm: {to: [bodyCenter[0] - 8, bodyCenter[1] + 123], via: [bodyCenter[0] + 13, bodyCenter[1] + 66], behind: 'all'},
      rArm: {to: [bodyCenter[0] + 6, bodyCenter[1] + 124], via: [bodyCenter[0] - 15, bodyCenter[1] + 67], behind: 'all'},
    },
    faceState: {look: choice ? [-.10, .15] : [.12, .24]},
    tint: {to: '#b97e63', u: .12},
    shadow: {color: '#312933', op: 81},
  });
  if (!figure) throw new Error('EDU26 look figure is behind the camera');
  paintTransferBench(p, c);
  const garment = paintCloth(p, c, pickup, choice);

  if (choice) {
    const jar = point(c, JAR_AT);
    const wrist: Pt = [jar[0] + 68, jar[1] - 14];
    const shoulder: Pt = [figure.lShoulder[0] - 12, figure.lShoulder[1] + 13];
    attachedArm(p, 27300, shoulder, [shoulder[0] + 47, shoulder[1] + 84], wrist, '#c19168', '#ba987b');
    shadow(p, 27305, wrist, 28, 10);
    hardFill(p, 27306, '#c69a72', ell(wrist[0] - 8, wrist[1] + 5, 23, 13, 17, -.03));
    line(p, 27307, [[wrist[0] - 22, wrist[1] + 5], [wrist[0] - 16, wrist[1] + 10], [wrist[0] - 9, wrist[1] + 10]],
      '#86604e', 1.2);
    pottery(p, c, 27310, JAR_AT, .26, .23);
    return;
  }
  customerContact(p, c, figure.lShoulder, pickup ? garment.seam : garment.mark, pickup);
  if (!pickup) apprenticeGrip(p, garment.corner);
}
