import {drawFigure, type FigPose} from '../../kit/cast';
import {hardFill, inkLine, washAt, ell} from '../../kit/draw';
import {EXPRESSIONS} from '../../kit/expressions';
import {mixColor} from '../../kit/painter';
import {poseArms, poseFor} from '../../kit/poses';
import {hash} from '../../kit/hash';
import type {Painter, Pt} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {frontRect, groundQuad, proj, unitAt, type Cam} from '../space';
import {box} from './collide';
import {vmBg, vmFg, vmMid, vmMist} from './detail';
import {YOU2, dressAs, fillC, mix, paintSheetBack, sky, warmOf, washC, type State} from './places';
import {facingOf, type CrowdSet, type Facing, type Mover} from './walk';

// EG-EP02-SHORT Victory Monument circle (Boss B1; scene sheets S01-B02-SH02 `empty`, S04-B01-SH05 `crowd`). A new set under the same
// convention as Yaowarat: metres, origin on the ground under the camera, +x right, +y up, the camera looks toward -z. Film's
// brief has no look frame for it ("covered by the brief"), so the layout is Boss's first version: the plaza road, a pavement
// strip in front, the obelisk far away, the BTS viaduct as a band with pillars, a bus-stop pole with the sheet and a shelter.
// No banner, flag, tent or placard (LOC202). Every prop is drawn from the same numbers in both states (VD05).

export const VM_CAM: Cam = {x: 0, y: 1.6, z: 0, f: 700, hy: 900};
/** `คุณ`: walks away from the camera in S01-B02-SH02 (back view, (-1.1,-5.5) -> (0.1,-8.2) over 108 f, SS-R2.2), stands at the end point in S04-B01-SH05. */
export const VM_YOU_START: V3 = [-1.1, 0, -5.5];
export const VM_YOU_END: V3 = [0.1, 0, -8.2];
export const VM_YOU_FRAMES = 108;
export const vmYouAt = (f: number): V3 => {
  const u = Math.min(1, Math.max(0, f / VM_YOU_FRAMES));
  return [VM_YOU_START[0] + (VM_YOU_END[0] - VM_YOU_START[0]) * u, 0, VM_YOU_START[2] + (VM_YOU_END[2] - VM_YOU_START[2]) * u];
};
/** Bus-stop pole with the sheet beside the path (x 2.0, sheet at 1.35 m like the Yaowarat pole) and the shelter behind it. */
export const VM_POLE: V3 = [2.0, 0, -8.0];
const PAVE_Z0 = -13, PAVE_Z1 = -3;
export const vmSolids = () => [
  {id: 'pole', box: box(VM_POLE[0] - 0.1, VM_POLE[0] + 0.1, 0, 3, VM_POLE[2] - 0.1, VM_POLE[2] + 0.1)},
  {id: 'shelter', box: box(3.6, 6.6, 0, 2.6, -10.2, -9.2)},
  {id: 'tree', box: box(-6.1, -5.7, 0, 5, -10.4, -10)},
];

const mv = (id: string, who: Mover['who'], view: Mover['view'], x: number, z: number, pace: number, seed: number): Mover => ({id, who, view, seed, at: [x, 0, z], pace});
/** Victory Monument crowd (S04-B01-SH05, cue f10-62): 9 walkers on the pavement and crossing; `คุณ` stands, people pass both sides. */
export const VM_CROWD: CrowdSet = {
  id: 'monument',
  cam: VM_CAM,
  solids: vmSolids(),
  you: VM_YOU_END,
  bounds: box(-6.8, 7, 0, 3, -12.6, -3.2),
  ref: 62,
  cue: [10, 62],
  movers: [
    mv('v1', dressAs('man-buzz', 'office'), 'right', -2.2, -6.2, 1.0, 201),
    mv('v2', dressAs('woman-pixie', 'office'), 'left', 3.4, -5.6, 1.0, 202),
    mv('v3', dressAs('girl-school'), 'front', -4.6, -10.8, 0.9, 203),
    mv('v4', dressAs('man-elder'), 'right', -4.8, -7.4, 0.7, 204),
    mv('v5', dressAs('woman-long'), 'front', -1.6, -8.0, 0.9, 205),
    mv('v6', dressAs('man-shaved'), 'left', 4.6, -7.0, 0.9, 206),
    mv('v7', dressAs('woman-ponytail', 'vendor'), 'back', -1.2, -5.2, 0.8, 207),
    mv('v8', dressAs('boy-school'), 'right', -2.6, -11.4, 0.9, 208),
    mv('v9', dressAs('man-crop'), 'back', -0.6, -11.6, 0.9, 209),
  ],
};

export const paintMonument = (p: Painter, state: State, o: {you?: V3 | false; youWalk?: number; youFacing?: Facing} = {}) => {
  const c = VM_CAM, w = warmOf(state);
  sky(p, 51000, mix('#8fa2b8', '#b9cbd8', w), mix('#e4dcd2', '#f7e4c6', w), -20, 940);
  // Far skyline: low blocks and trees, haze.
  const far: Pt[] = [[-20, 905]];
  for (let k = 0; k <= 28; k++) { const x = -20 + k * 40, h = 14 + 40 * hash(k * 5.3) * (k % 4 === 1 ? 1.5 : 1); far.push([x, 905 - h], [x + 36, 905 - h]); }
  far.push([1100, 905]);
  washC(p, 51100, mix('#8f9aa7', '#cdbba2', w), 200, far, 0.1, 0.4);
  vmBg(p, c, w); // SD02 bg: ring of mid-rise buildings in haze
  // Obelisk: a tapered shaft, a stepped base and four small sculpture groups (generic silhouette, no text).
  const ob: V3 = [-1.5, 0, -95], ou = unitAt(c, ob[2]);
  const [ox, oy] = proj(c, ob);
  const tone = mix('#7b8794', '#b9a98f', w);
  hardFill(p, 51200, tone, [[ox - ou * 2.2, oy], [ox + ou * 2.2, oy], [ox + ou * 1.3, oy - ou * 9], [ox - ou * 1.3, oy - ou * 9]]);
  hardFill(p, 51201, tone, [[ox - ou * 1.3, oy - ou * 8.5], [ox + ou * 1.3, oy - ou * 8.5], [ox + ou * 0.55, oy - ou * 40], [ox - ou * 0.55, oy - ou * 40]]);
  hardFill(p, 51202, tone, [[ox - ou * 0.55, oy - ou * 40], [ox + ou * 0.55, oy - ou * 40], [ox, oy - ou * 47]]);
  for (const s of [-1, 1]) hardFill(p, 51203 + s, mix('#6c7886', '#a39378', w), ell(ox + s * ou * 3.2, oy - ou * 2.4, ou * 1.1, ou * 2.2, 12));
  // Ground: plaza road (asphalt), the pavement strip in front, kerb.
  fillC(p, 51300, mix('#5f6b79', '#8f8a82', w), groundQuad(c, -60, 60, -170, PAVE_Z0));
  fillC(p, 51301, mix('#7d848c', '#b4aa9a', w), groundQuad(c, -60, 60, PAVE_Z0, -0.5));
  fillC(p, 51302, mix('#a4abb0', '#d1c7b5', w), groundQuad(c, -60, 60, PAVE_Z0 - 0.15, PAVE_Z0 + 0.1, 0.12));
  for (let k = 0; k < 8; k++) fillC(p, 51310 + k, mixColor(mix('#7d848c', '#b4aa9a', w), mix('#55606c', '#8a8070', w), (k + 1) / 8), groundQuad(c, -60, 60, -6 + k * 0.1, -0.5)); // pavement darkens toward the lens
  // Zebra crossing on the road at the left (the walkers cross it), lane dashes on the road.
  for (let k = 0; k < 7; k++) fillC(p, 51400 + k, mix('#c3c9cc', '#e2ddd2', w), groundQuad(c, -6.6 + k * 0.9, -6.1 + k * 0.9, -30, PAVE_Z0));
  for (let x = -40; x < 40; x += 9) fillC(p, 51420 + x, mix('#b9bfc3', '#dcd6ca', w), groundQuad(c, x, x + 4, -36.3, -35.9));
  if (w < 1) for (let k = 0; k < 4; k++) washC(p, 51450 + k, '#a9b8c6', 60 * (1 - w), groundQuad(c, -10 + 5 * k, -8 + 5 * k, -80, -20), 0.25, 0.5);
  // BTS viaduct: a girder band across the picture on pillars (EP01 `viaduct.ts` is a pitched sky card; here the camera is level).
  const vz = -45;
  fillC(p, 51500, mix('#7c8793', '#b2a38c', w), frontRect(c, vz, -60, 60, 11.6, 13.2));
  fillC(p, 51501, mix('#59636e', '#877a68', w), frontRect(c, vz, -60, 60, 11.2, 11.6));
  for (let k = -4; k <= 4; k++) fillC(p, 51510 + k, mix('#6e7983', '#a09079', w), frontRect(c, vz, k * 14 - 0.7, k * 14 + 0.7, 0, 11.2));
  inkLine(p, 51520, [proj(c, [-60, 13.2, vz]), proj(c, [60, 13.2, vz])], {color: mix('#3f4852', '#5e554a', w), weight: 1, closed: false, curve: 0, still: true});
  vmMist(p, w); // SD02 bg: thin mist over the circle (ENV-FOG)
  vmMid(p, c, w); // SD02 mid: kerb stripes, lane arrows, traffic light, island planter
  // Trees along the pavement edge (rain-tree crowns as soft masses).
  for (const [k, x] of [-6, 9].entries()) {
    const at: V3 = [x, 0, -10.2], [tx, ty] = proj(c, at), tu = unitAt(c, at[2]);
    fillC(p, 51600 + k, mix('#5a4e44', '#6a5848', w), [[tx - tu * 0.18, ty], [tx + tu * 0.18, ty], [tx + tu * 0.14, ty - tu * 3.5], [tx - tu * 0.14, ty - tu * 3.5]]);
    washAt(p, 51610 + k, mix('#4f6a58', '#6f8458', w), 230, ell(tx, ty - tu * 5, tu * 3.3, tu * 2.1, 18), 0.3, 0.6);
  }
  // Bus-stop shelter (flat roof, two posts, back panel) and the pole with the sheet.
  {
    const [x0, x1, z] = [3.6, 6.6, -9.7];
    fillC(p, 51700, mix('#8a949c', '#c4b8a4', w), frontRect(c, z, x0, x1, 0.3, 2.3));
    fillC(p, 51701, mix('#4d5a66', '#7d6e5c', w), frontRect(c, z + 0.4, x0, x1, 2.3, 2.5));
    for (const x of [x0, x1]) fillC(p, 51702 + x, mix('#59636e', '#877a68', w), frontRect(c, z + 0.45, x - 0.06, x + 0.06, 0, 2.3));
    fillC(p, 51710, mix('#5a6470', '#8a7c68', w), frontRect(c, z + 0.45, x0 + 0.3, x1 - 0.3, 0.5, 0.58));
  }
  const [px, py] = proj(c, VM_POLE), pu = unitAt(c, VM_POLE[2]);
  fillC(p, 51800, mix('#868c90', '#a39888', w), [[px - pu * 0.06, py], [px + pu * 0.06, py], [px + pu * 0.06, py - pu * 3], [px - pu * 0.06, py - pu * 3]]);
  inkLine(p, 51801, [[px + pu * 0.06, py], [px + pu * 0.06, py - pu * 3]], {color: '#4b5157', weight: 0.8, closed: false, curve: 0, still: true});
  paintSheetBack(p, c, 51810, VM_POLE[0], 1.35, VM_POLE[2] + 0.1, w);
  // Lamp posts along the kerb.
  for (const [k, x] of [-9, 12].entries()) {
    const [lx, ly] = proj(c, [x, 0, -12.6]), lu = unitAt(c, -12.6);
    fillC(p, 51900 + k, mix('#4d5660', '#6f675e', w), [[lx - lu * 0.07, ly], [lx + lu * 0.07, ly], [lx + lu * 0.07, ly - lu * 7], [lx - lu * 0.07, ly - lu * 7]]);
    if (w < 1) washAt(p, 51910 + k, '#ffd690', 60 * (1 - w), ell(lx, ly - lu * 7, lu * 0.5, lu * 0.4, 14), 0.35, 0.2);
  }
  const you = o.you === false ? undefined : o.you;
  if (you) {
    const g = proj(c, you), u = unitAt(c, you[2]);
    paintYouWalking(p, g, u, o.youWalk, o.youFacing);
  }
  vmFg(p, w); // SD02 fg: rain-tree branch (top right), blurred street-sign back (left edge)
};
/** `คุณ` on the monument kerb: standing (back view), or walking (`walk` = phase in cycles) at a calm stride in profile facing the way she travels (`facing`, default along the kerb, x +). */
export const paintYouWalking = (p: Painter, g: Pt, u: number, walk?: number, facing: Facing = facingOf(VM_YOU_END[0] - VM_YOU_START[0], 0)) => {
  if (walk === undefined) return drawFigure(p, YOU2, g, u, {view: 'back', hoodUp: true, face: EXPRESSIONS.neutral, ...poseArms('P01', YOU2, g, u)} as FigPose, p.t, YOU2.seed);
  const view = facing === 'left' || facing === 'right' ? facing : 'back';
  const arms = view === 'back' ? poseArms('P01', YOU2, g, u) : poseFor('P01', YOU2, g, u, view);
  return drawFigure(p, YOU2, g, u, {...arms, view, hoodUp: true, face: EXPRESSIONS.neutral, walk, stride: 0.6} as FigPose, p.t, YOU2.seed);
};
