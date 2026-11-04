import {useCallback} from 'react';
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {drawFigure, shoulderPoint, type FigPose} from '../kit/cast';
import {modelPart, type InteriorLight} from '../kit/draw';
import {ell, hardFill, inkLine, rectPts, washAt} from '../kit/draw';
import {affine, contact, crack, doorLeaf, extCabinet, fillF, fireSign, floorMap, glazeS, intercom, keyRack, lightSwitch, mailSlot, meterBox, noticePaper, numberPlate, plant, quadMap, resetIds, shoeRack, stroke, surface, tileFloor, tintS, tubeLight, umbrella, ventGrille, woodGrain, type M} from './sets';
import {handOverMouth, reachArm} from './arm';
import {EXPRESSIONS} from '../kit/expressions';
import {PEOPLE} from '../kit/people';
import {makePainter, mixColor, type Painter, type Pt} from '../kit/painter';
import {poseFor} from '../kit/poses';
import {Grain} from '../kit/screen';

// ZCONDO2-SHORT-TH W3.1 look frames in the KIT look (user reset, 3 Nov 2026; brief VB-ZC2-SHORT-R2): the project-default painted
// look (p5 paint, 4-head kit cast `PEOPLE`, kit poses/motions/expressions). Sets are drawn here with kit `washAt`/`hardFill`/`inkLine`
// (no zcondo2 look code). Four frames prove the hardest beats: KF-SH05 seated at the barricade, KF-SH03 infected close with blood,
// KF-SH04 drag walk, KF-SH02 corridor wide. Full-size, frame 0, no captions, no camera drift (scene sheets decide the push).
// Staging numbers are estimates (Film). Units: screen px, y down; `unit` = px per metre of the figure's plane.

export const PAPER = '#efe6d2';
const INK = '#2a211b';
type V3 = [number, number, number];

export const LEAD = PEOPLE['man-crop'];

/** Hand scale of the kit-figure arms in the ZCONDO2 looks (= `HS` of sb-lib.ts; user: hands too small for the body). */
export const HAND_SCALE = 1.45;
/**
 * Painted-figure light for the ZCONDO2 set (r4, user: figures must match the painted sets). Uses the kit's VD18 figure paint
 * (`FigPose.light`: glazed washes, form shadow / lit plane along the key, folds, face planes, coloured ink) with a warm morning palette,
 * an opaque underlay (the set never shows through a body), shaped limbs and fists, no pencil hatching. `key` is the direction the
 * light TRAVELS in plate px.
 */
export const morning = (key: [number, number], o: Partial<InteriorLight> = {}): InteriorLight => ({
  key, rim: key, rimScale: 0, under: true, shaped: true, handScale: HAND_SCALE, noHatch: true, ink: '#3a2a20',
  pal: {
    ambient: '#b79c78', ambientMix: 0.14, shadow: '#5a3f4e', shadowMix: 0.5, shadowOpacity: 185, shadowFrom: 0.42, shadowBleed: 0.1,
    light: '#ffe6b0', lightMix: 0.38, lightOpacity: 150, lightTo: 0.3, glazeOpacity: 60, glazeTexture: 0.7, glazeBorder: 0.6,
    lineMix: 0.55, lineOuter: 0.9, lineFold: 0.9, falloff: '#4a3a2c', falloffOpacity: 45, ground: '#3d2f25', groundCore: '#2d2119',
  },
  ...o,
});
export const hex = (c: string, m: string, k: number) => mixColor(c, m, k);

/** Parallelogram floor/door helper: flat architecture gets the crisp underlayer, then a soft watercolour pass for the paper feel. */
export const plane = (p: Painter, seed: number, color: string, pts: Pt[], _soft = 0) => hardFill(p, seed, color, pts);
/** Flat translucent light/shade (no texture, no bleed): large areas stay wash-flat (DF-20261030-p5brush-large-fill-mottle). */
export const tint = (p: Painter, seed: number, color: string, alpha: number, pts: Pt[]) => {
  const b = p.brush;
  b.seed(seed); b.noStroke(); b.noFill(); b.wash(color, alpha); b.polygon(pts); b.noWash();
};
export const edge = (p: Painter, id: number, pts: Pt[], w = 0.9, closed = true, color = '#4b3d33') => inkLine(p, id, pts, {color, weight: w, closed, curve: 0.02, still: true});

// ------------------------------------------------------------------ KF-SH05: seated at the barricade (ZC2-B02-SH05)
/**
 * W-UNIT view from the room toward the door, one plane, unit 1100 px/m (r3, UT13: medium shot, was 760), floor line y 1560. Door
 * 0.90 x 2.10 m centred x 380 (door top is off frame; the lock reads at 1.15 m), solid, lever 1.00 m and deadbolt thumb-turn 1.15 m on
 * its left edge, no peephole (CL05). Cabinet 0.77 w x 1.06 h m (847 x 1166 px), leaning 3 deg, one end jammed against the door. Lead:
 * `man-crop, P33 + right hand to mouth, scared`. Morning sun from camera-left. Wall strip right of the door: switch, intercom.
 * Layers: back = plaster wall, door, wall props; mid = cabinet, lead; fore = tiles, mat, slippers, plant (large, dark).
 */
/** G2 `hand_to_mouth_sit` (B02-SH05 draft): breath (idle-breathe) to f 31 where it stops, eyes lift to the lock f 3-9, then frozen (the sheet's 0.6 s freeze). */
const KF_SH05 = (p: Painter, v2 = false, dyn?: {f: number}) => {
  resetIds(5000);
  const U = 1100, GY = 1560, DC = 420;
  // Back layer: plaster wall with stains and a crack, skirting, tile floor.
  surface(p, [[-20, -20], [1100, -20], [1100, GY], [-20, GY]], '#cdbf9f', {seed: 1, patches: 22, grain: 'h', grainN: 30, streaks: 3, wear: 6});
  const wm = affine(0, GY, U);
  crack(p, wm, 1.5, 1.2, 0.18, -0.55, 6, 11);
  glazeS(p, '#6b5a3c', 70, [[860, 0], [1100, 0], [1100, 330], [1010, 230], [930, 120]]); // damp corner
  const fm = floorMap(540, GY - 1.2 * U, GY, U, 3.0);
  tileFloor(p, fm, -2.4, 2.6, 0, 2.4, 0.6, '#b3a487', 2);
  fillF(p, '#8d7f66', [[-20, GY - 70], [1100, GY - 70], [1100, GY], [-20, GY]]); // skirting
  stroke(p, 'HB', '#e8dcc0', 1.2, [[-20, GY - 68], [1100, GY - 68]], 0.01); stroke(p, '2B', '#4b3d33', 1.4, [[-20, GY - 1], [1100, GY - 1]], 0.01);
  // Door leaf and frame.
  const dx0 = DC - 0.45 * U, dx1 = DC + 0.45 * U;
  fillF(p, '#46372a', [[dx0 - 40, -20], [dx1 + 40, -20], [dx1 + 40, GY], [dx0 - 40, GY]]);
  woodGrain(p, [[dx0 - 40, -20], [dx0, -20], [dx0, GY], [dx0 - 40, GY]], '#6a5642', 31, 'v', 6);
  woodGrain(p, [[dx1, -20], [dx1 + 40, -20], [dx1 + 40, GY], [dx1, GY]], '#6a5642', 32, 'v', 6);
  doorLeaf(p, [[dx0, -20], [dx1, -20], [dx1, GY], [dx0, GY]], '#8a6b4c', 33, {panels: true, grainN: 40});
  tintS(p, '#2d2119', 80, [[dx1, -20], [dx1 + 40, -20], [dx1 + 40, GY], [dx1, GY]]);
  // Lever (1.00 m) and deadbolt thumb-turn (1.15 m) on the door's left edge, with brass back plates and a shadow.
  const lx = dx0 + 130, ly = GY - 1.0 * U, by = GY - 1.15 * U;
  tintS(p, '#2d2119', 90, ell(lx + 6, ly + 14, 44, 44, 14));
  fillF(p, '#b69a58', ell(lx, ly, 40, 40, 14)); stroke(p, '2B', '#4b3a1c', 1.2, ell(lx, ly, 40, 40, 14).concat([ell(lx, ly, 40, 40, 14)[0]]), 0.05);
  fillF(p, '#3d3a37', ell(lx, ly, 20, 20, 14));
  tintS(p, '#2d2119', 90, [[lx - 10, ly + 6], [lx + 150, ly + 4], [lx + 152, ly + 30], [lx - 10, ly + 28]]);
  fillF(p, '#6a6a6c', [[lx - 18, ly - 13], [lx + 150, ly - 15], [lx + 150, ly + 13], [lx - 18, ly + 13]]);
  tintS(p, '#ffffff', 90, [[lx - 10, ly - 12], [lx + 146, ly - 14], [lx + 146, ly - 6], [lx - 10, ly - 5]]);
  tintS(p, '#2d2119', 90, ell(lx + 6, by + 12, 54, 54, 14));
  fillF(p, '#b69a58', ell(lx, by, 52, 52, 14)); stroke(p, '2B', '#4b3a1c', 1.2, ell(lx, by, 52, 52, 14).concat([ell(lx, by, 52, 52, 14)[0]]), 0.05);
  fillF(p, '#6b6254', ell(lx, by, 30, 30, 14)); fillF(p, '#2f2d2c', [[lx - 26, by - 7], [lx + 26, by - 7], [lx + 26, by + 7], [lx - 26, by + 7]]);
  tintS(p, '#ffffff', 80, [[lx - 22, by - 6], [lx + 22, by - 6], [lx + 22, by - 2], [lx - 22, by - 2]]);
  // Wall strip right of the door: light switch at 1.20 m, intercom handset at 1.28 m.
  lightSwitch(p, affine(1010, GY - 0.98 * U, U));
  intercom(p, affine(1000, GY - 1.13 * U, U));
  // Mid layer: cabinet.
  const cx0 = dx0 + 30, cx1 = cx0 + 0.77 * U, cy0 = GY - 1.06 * U, cl = 22, ch = 1.06 * U;
  const cab = (x: number, y: number): Pt => [x + (GY - y) * 0.03, y];
  tintS(p, '#2d2119', 70, [[cx0 - 20, GY - 60], [cx1 + 70, GY - 60], [cx1 + 80, cy0 + 30], [cx0, cy0 + 30]]); // its shadow on the door
  contact(p, affine(0, GY + 10, 1), (cx0 + cx1) / 2 + 20, 450, 14, 110);
  const body: Pt[] = [cab(cx0, GY), cab(cx1, GY), cab(cx1, cy0), cab(cx0, cy0)];
  woodGrain(p, body, '#8f6c4b', 41, 'v', 36);
  const inner: Pt[] = [cab(cx0 + cl, GY - 26), cab(cx1 - cl, GY - 26), cab(cx1 - cl, cy0 + cl), cab(cx0 + cl, cy0 + cl)];
  fillF(p, '#3d2f25', inner);
  tintS(p, '#1d140e', 80, [cab(cx0 + cl, cy0 + cl), cab(cx1 - cl, cy0 + cl), cab(cx1 - cl, cy0 + cl + 50), cab(cx0 + cl, cy0 + cl + 50)]);
  [0.34, 0.68].forEach((h, i) => { const s = [cab(cx0 + cl, GY - h * ch), cab(cx1 - cl, GY - h * ch), cab(cx1 - cl, GY - h * ch + 22), cab(cx0 + cl, GY - h * ch + 22)]; woodGrain(p, s, '#a07b57', 50 + i, 'h', 4); tintS(p, '#1d140e', 90, [cab(cx0 + cl, GY - h * ch + 22), cab(cx1 - cl, GY - h * ch + 22), cab(cx1 - cl, GY - h * ch + 44), cab(cx0 + cl, GY - h * ch + 44)]); });
  const shoe = (x: number, h: number, c: string, i: number) => {
    const q: Pt[] = [cab(x, GY - h * ch), cab(x + 130, GY - h * ch), cab(x + 120, GY - h * ch - 58), cab(x + 20, GY - h * ch - 72)];
    tintS(p, '#0d0805', 120, [cab(x - 6, GY - h * ch), cab(x + 140, GY - h * ch), cab(x + 138, GY - h * ch - 8), cab(x - 4, GY - h * ch - 8)]);
    fillF(p, c, q); tintS(p, '#ffffff', 55, [cab(x + 24, GY - h * ch - 60), cab(x + 100, GY - h * ch - 50), cab(x + 118, GY - h * ch - 56), cab(x + 22, GY - h * ch - 70)]);
    edge(p, 60 + i, q, 0.9); fillF(p, '#e8e0cc', [cab(x, GY - h * ch), cab(x + 130, GY - h * ch), cab(x + 131, GY - h * ch - 10), cab(x, GY - h * ch - 10)]);
  };
  shoe(cx0 + 50, 0.68, '#5d6f82', 0); shoe(cx0 + 230, 0.68, '#8a4a3a', 1); shoe(cx0 + 470, 0.34, '#34414f', 2); shoe(cx0 + 300, 0.34, '#c9b78f', 3);
  edge(p, 43, body, 1.1); edge(p, 44, inner, 0.6);
  // Umbrella leaning on the wall right of the door.
  umbrella(p, affine(985, GY + 4, 760));
  // Fore layer: scuff trail, knocked-off shoe, mat with slippers, dust, lead shadow, big plant in the corner, fall-off.
  [[cx0 - 130, GY + 40], [cx0 - 170, GY + 70]].forEach((a, i) => stroke(p, 'charcoal', '#7d6e56', 1.4, [[a[0], a[1]], [a[0] + 300, a[1] - 2]], 0.1));
  const sh2: Pt[] = [[cx1 + 30, GY + 80], [cx1 + 180, GY + 66], [cx1 + 200, GY + 112], [cx1 + 50, GY + 130]];
  tintS(p, '#2d2119', 90, [[cx1 + 30, GY + 120], [cx1 + 200, GY + 108], [cx1 + 210, GY + 140], [cx1 + 40, GY + 150]]);
  fillF(p, '#8a4a3a', sh2); edge(p, 62, sh2, 0.9); fillF(p, '#e8e0cc', [[cx1 + 30, GY + 80], [cx1 + 180, GY + 66], [cx1 + 182, GY + 78], [cx1 + 32, GY + 92]]);
  const mat: Pt[] = [[30, GY + 380], [520, GY + 340], [580, GY + 470], [60, GY + 520]];
  tintS(p, '#2d2119', 100, [[24, GY + 400], [524, GY + 360], [592, GY + 490], [66, GY + 540]]);
  woodGrain(p, [mat[0], mat[1], mat[2], mat[3]], '#6a5a48', 71, 'h', 40); edge(p, 91, mat, 1.1);
  [0, 1, 2, 3, 4, 5].forEach((k) => stroke(p, '2B', '#3b2f26', 1.4, [[60 + k * 80, GY + 392 + k * -6], [92 + k * 80, GY + 505 - k * 2]], 0.1));
  [[640, GY + 470], [800, GY + 540]].forEach(([x, y], i) => { const q: Pt[] = [[x, y], [x + 150, y - 10], [x + 190, y + 28], [x + 120, y + 60], [x + 8, y + 52]]; tintS(p, '#2d2119', 100, q.map(([a, b]) => [a + 8, b + 14] as Pt)); fillF(p, '#7e8f9a', q); tintS(p, '#ffffff', 60, [[x + 10, y + 2], [x + 140, y - 6], [x + 150, y + 6], [x + 14, y + 14]]); edge(p, 100 + i, q, 1.0); });
  fillF(p, '#c9a24a', ell(330, GY + 640, 36, 14, 12)); edge(p, 113, ell(330, GY + 640, 36, 14, 12), 0.9); stroke(p, 'HB', '#5a5a5c', 1.6, [[360, GY + 636], [430, GY + 612], [460, GY + 634]], 0.2);
  tintS(p, '#d8caa8', 90, ell(540, GY + 30, 480, 20, 18));
  if (v2) { // ZC2-SB-R4: drag marks where the cabinet was hauled across (from the right), and the dropped trash bag by the door frame
    [[560, 22, 18], [600, 56, 15], [540, 92, 16], [640, 128, 12]].forEach(([x, y, t], i) => { tintS(p, '#3a2b1a', 200 - i * 14, [[x, GY + y], [1100, GY + y + 12 + i * 4], [1100, GY + y + 12 + i * 4 + t], [x + 40, GY + y + t + 5]]); tintS(p, '#f2e8cc', 130, [[x + 10, GY + y - 7], [1100, GY + y + 4 + i * 4], [1100, GY + y + 9 + i * 4], [x + 30, GY + y - 1]]); });
    tintS(p, '#e8dcb8', 120, ell(cx1 + 120, GY + 28, 90, 12, 14));
    const bx = 900, by = GY + 70, bag: Pt[] = [[bx - 92, by], [bx + 96, by - 4], [bx + 112, by - 120], [bx + 70, by - 200], [bx + 22, by - 236], [bx - 26, by - 232], [bx - 72, by - 190], [bx - 108, by - 110]];
    tintS(p, '#2d2119', 100, ell(bx + 10, by + 6, 130, 16, 14)); fillF(p, '#4b505c', bag); tintS(p, '#c8d0dc', 70, [[bx - 80, by - 150], [bx - 30, by - 205], [bx - 40, by - 40], [bx - 90, by - 60]]); tintS(p, '#10161c', 60, [[bx + 56, by - 190], [bx + 112, by - 120], [bx + 96, by - 4], [bx + 40, by - 8]]);
    fillF(p, '#3a3d44', [[bx - 30, by - 232], [bx - 6, by - 280], [bx + 24, by - 282], [bx + 26, by - 232]]); edge(p, 70, [[bx - 30, by - 232], [bx - 6, by - 280], [bx + 24, by - 282], [bx + 26, by - 232]], 0.9); edge(p, 71, bag, 1.1);
  }
  tintS(p, '#3d2f25', 75, ell(500, GY + 160, 380, 30, 18)); // lead's shadow
  // Morning sun from camera-left: soft warm bands over everything behind the lead.
  [[-80, 200], [300, 520]].forEach(([a, b], i) => { tintS(p, '#f6d9a0', 52, [[a, -20], [b, -20], [b + 700, GY], [a + 700, GY]]); tintS(p, '#f6d9a0', 60, [[a + 700, GY], [b + 700, GY], [b + 1100, 1940], [a + 1100, 1940]]); void i; });
  tintS(p, '#3d2f25', 60, [[560, GY - 560], [820, GY - 570], [840, GY + 20], [600, GY + 20]]);
  // Figure: sits on the floor, back to the cabinet, knees up, right hand to the mouth, eyes up to the lock.
  const g: Pt = [420, GY + 150];
  const base = poseFor('P33', LEAD, g, U, 'front');
  const lk = dyn ? Math.min(1, Math.max(0, (dyn.f - 3) / 6)) : 1, breath = dyn ? 0.007 * Math.sin(Math.min(dyn.f, 31) * 0.33) : 0;
  const face: FigPose['face'] = v2 ? {...EXPRESSIONS.scared, look: [0.4 + 0.6 * lk, 0.1 - 1.1 * lk], eyes: 'wide', mouth: 'flat', sweat: true} : {...EXPRESSIONS.scared, look: [0.45, -0.8], mouth: 'flat', sweat: true};
  const nop = new Proxy({}, {get: () => () => undefined}) as never;
  const dry = drawFigure(makePainter(nop, {t: 0, frame: 0, fade: PAPER}), LEAD, g, U, {...base, lean: 0.05 + breath, face}, 0.9);
  const mouthPt: Pt = v2 ? [dry.head[0] - 0.01 * U, dry.head[1] + 0.1 * U] : [dry.head[0] - 0.02 * U, dry.head[1] + 0.2 * U];
  const sh0 = dry.rShoulder;
  // Right fist at the mouth: knuckles under the lip. `to` is the wrist; the fist reaches 0.05 m past it along the forearm.
  // R3-fix: right fist at the mouth by kit two-bone IK (elbow outward and down onto the knee, bones equal), no hand-placed elbow.
  // R3-arm2 (user: IK alone still read wrong; CP-P07 hand near the shoulder needs an authored elbow): the mitten lies over the mouth,
  // the forearm rises 22 deg off vertical from an elbow tucked forward in front of the chest on the knee, so the upper arm is
  // foreshortened (points at the camera, ~0.4 of a bone on screen) and the forearm is a full BONE. Refs in build-notes.md.
  const {to: wrist, via} = handOverMouth(sh0, v2 ? [dry.head[0] + 0.02 * U, dry.head[1] + 0.07 * U] : mouthPt, U, 22, 0.07);
  const lWrist: Pt = [dry.lShoulder[0] - 0.05 * U, dry.lShoulder[1] + 0.3 * U]; // r6: left hand draped loosely over the knee (r5: crossed in front of the belly)
  const light = morning([0.75, 0.65]);
  const pose: FigPose = {...base, light, lean: 0.05 + breath, rArm: v2 ? {to: wrist, via, open: 1, noThumb: true} : {to: wrist, via, fist: 1}, ...(v2 ? {nod: [0, -0.3] as Pt} : {}), lArm: {...base.lArm!, to: lWrist, via: [dry.lShoulder[0] + 0.05 * U, dry.lShoulder[1] + 0.19 * U], open: -1}, face};
  drawFigure(p, LEAD, g, U, pose, 0.9);
  // Foreground plant (dark, big, out of the focus plane) bottom-right, and a fall-off.
  tintS(p, '#2d2119', 70, ell(960, 1900, 260, 36, 16));
  plant(p, affine(960, 1900, 1900 * 0.42), 0.6, 0);
  tintS(p, '#3d2f25', 40, [[-20, 1790], [1100, 1790], [1100, 1940], [-20, 1940]]);
};

// ------------------------------------------------------------------ KF-SH03: the infected turns (ZC2-B01-SH03)
/**
 * MCU on the long lens, unit 1400 px/m, head centre at (550, 740). `man-shaved` (no glasses, grey-green skin), front, `tired` face
 * (half lids, panting mouth), shoulders in house clothes. `new:` blood on mouth, chin, collar and a drip, painted over the kit head
 * with kit washes (not part of the kit yet). Backdrop: dim corridor, one fluorescent tube glaring upper left, face half in shadow.
 */
export const INF = {
  ...PEOPLE['man-shaved'],
  head: {...PEOPLE['man-shaved'].head, glasses: false, skin: '#9fae92', hair: '#2a2420'},
  outfit: {...PEOPLE['man-shaved'].outfit, shirt: '#9a9484', sleeve: '#9a9484', pants: '#7a746a'},
};
/** Corridor light for the infected close-up: the tube upper left (light travels right and down), cool green-grey, a faint rim from the window side. */
export const tubeLit: InteriorLight = {
  key: [0.45, 0.9], rim: [-0.5, 1], rimScale: 0, under: true, shaped: true, handScale: HAND_SCALE, noHatch: true, ink: '#232a22',
  pal: {ambient: '#7f8c7c', ambientMix: 0.12, shadow: '#2c3a34', shadowMix: 0.5, shadowOpacity: 185, shadowFrom: 0.42, shadowBleed: 0.1, light: '#eef4d8', lightMix: 0.34, lightOpacity: 140, lightTo: 0.3,
    glazeOpacity: 60, glazeTexture: 0.7, glazeBorder: 0.6, lineMix: 0.55, lineFold: 0.9, falloff: '#1c2420', falloffOpacity: 40, rimColor: '#dfe9d2', ground: '#1c2420', groundCore: '#10160f'},
};
/** `new:` profile face of the infected (G11): milky eye on the kit lid arc, wet blood round the open mouth, a run down the chin and one drop. Head units from the head centre; `Hpx` = 0.425 U. */
const profileFace = (p: Painter, hc: Pt, Hpx: number) => {
  const E2 = (x: number, y: number, rx: number, ry: number, a2 = 0): Pt[] => ell(hc[0] + x * Hpx, hc[1] + y * Hpx, rx * Hpx, ry * Hpx, 20, a2);
  const W2 = (x: number, y: number, rx: number, ry: number, k: number, a2 = 0): Pt[] => Array.from({length: 22}, (_, i) => {
    const t = (i / 22) * 6.2832, m = 1 + 0.1 * Math.sin(3 * t + k) + 0.06 * Math.sin(5 * t + 2 * k), u = rx * m * Hpx * Math.cos(t), v = ry * m * Hpx * Math.sin(t);
    return [hc[0] + x * Hpx + u * Math.cos(a2) - v * Math.sin(a2), hc[1] + y * Hpx + u * Math.sin(a2) + v * Math.cos(a2)] as Pt;
  });
  const bd = '#2d0808', bl = '#6a1410', bm = '#8f2018', bh = '#f0b4a6';
  // eye: sunk socket, milky ball with the pupil toward the nose, upper lid
  washAt(p, 160, '#2c3a34', 70, E2(0.245, 0.13, 0.1, 0.06), 0.45, 0.3);
  hardFill(p, 161, '#e6edc8', E2(0.245, 0.125, 0.07, 0.05, 0.05));
  hardFill(p, 162, '#1c1f18', E2(0.268, 0.13, 0.02, 0.02));
  hardFill(p, 163, '#ffffff', E2(0.255, 0.112, 0.01, 0.01));
  washAt(p, 164, '#55654f', 150, [[0.245 - 0.078, 0.118], [0.245 - 0.04, 0.085], [0.245 + 0.04, 0.085], [0.245 + 0.078, 0.118], [0.245, 0.105]].map(([x, y]) => [hc[0] + x * Hpx, hc[1] + y * Hpx] as Pt), 0.12, 0.25);
  inkLine(p, 165, [-1, -0.5, 0, 0.5, 1].map((q) => [hc[0] + (0.245 + q * 0.082) * Hpx, hc[1] + (0.11 - (1 - q * q) * 0.04) * Hpx] as Pt), {color: '#2a211b', weight: 1.8, closed: false, curve: 0.02, still: true});
  // mouth blood: dark halo, body, mid tone, gloss; run down the chin; a drop
  const parts: {pts: Pt[]; hl?: Pt[]}[] = [
    {pts: W2(0.352, 0.325, 0.1, 0.075, 0.3, 0.1), hl: [[0.29, 0.275], [0.34, 0.262], [0.39, 0.266], [0.34, 0.278]].map(([x, y]) => [hc[0] + x * Hpx, hc[1] + y * Hpx] as Pt)},
    {pts: [[0.335, 0.37], [0.36, 0.37], [0.352, 0.5], [0.34, 0.54], [0.326, 0.5]].map(([x, y]) => [hc[0] + x * Hpx, hc[1] + y * Hpx] as Pt)},
    {pts: W2(0.34, 0.575, 0.02, 0.03, 1.2)},
  ];
  const grow = (pts: Pt[], k: number): Pt[] => { const cx = pts.reduce((t, q) => t + q[0], 0) / pts.length, cy = pts.reduce((t, q) => t + q[1], 0) / pts.length; return pts.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k] as Pt); };
  parts.forEach((q, i) => hardFill(p, 170 + i, bd, grow(q.pts, 1.1)));
  parts.forEach((q, i) => hardFill(p, 180 + i, bl, q.pts));
  parts.forEach((q, i) => washAt(p, 190 + i, bm, 190, q.pts.map(([x, y]) => [x + 0.012 * Hpx, y + 0.014 * Hpx] as Pt), 0.12, 0.4));
  parts.forEach((q, i) => q.hl && washAt(p, 195 + i, bh, 165, q.hl, 0.1, 0.2));
  hardFill(p, 199, bd, E2(0.352, 0.31, 0.04, 0.04));
};
const KF_SH03 = (p: Painter, o: {prof?: boolean; creak?: number; shadow?: boolean} = {}) => {
  resetIds(3000);
  // Back layer: plaster corridor wall, ceiling tiles, tile floor sliver.
  surface(p, [[-20, 190], [1100, 190], [1100, 1320], [-20, 1320]], '#59635f', {seed: 5, patches: 26, grain: 'h', grainN: 30, streaks: 4, wear: 8, warm: '#262b27', cool: '#cdd7c6'});
  surface(p, [[-20, -20], [1100, -20], [1100, 190], [-20, 190]], '#4d5652', {seed: 6, patches: 10, grain: 'none', streaks: 0, warm: '#222824', cool: '#bfcab8'});
  [190, 560, 930].forEach((x, i) => stroke(p, '2B', '#2a302d', 1.6, [[x, -20], [x + (i - 1) * 8, 190]], 0.02)); stroke(p, '2B', '#2a302d', 1.6, [[-20, 100], [1100, 100]], 0.02);
  fillF(p, '#6e7770', [[-20, 1320], [1100, 1320], [1100, 1940], [-20, 1940]]);
  tileFloor(p, floorMap(540, 700, 1320, 538, 3.2), -2.6, 2.8, 0, 2.4, 0.6, '#6e7770', 6);
  fillF(p, '#44494a', [[-20, 1290], [1100, 1290], [1100, 1320], [-20, 1320]]); stroke(p, 'HB', '#aab4a6', 1.2, [[-20, 1292], [1100, 1292]], 0.01);
  // Mid layer left: a neighbour door, its number plate, notice paper, shoe rack. Right: fire-exit sign and extinguisher cabinet.
  fillF(p, '#2f332f', [[-220, 190], [310, 190], [310, 1320], [-220, 1320]]);
  doorLeaf(p, [[-200, 200], [284, 200], [284, 1320], [-200, 1320]], '#6a6454', 61, {grainN: 22});
  tintS(p, '#0d1210', 90, [[-200, 200], [284, 200], [284, 1320], [-200, 1320]]);
  numberPlate(p, affine(150, 1320 - 1.55 * 538, 538), '1206');
  noticePaper(p, affine(40, 1320 - 1.2 * 538, 538));
  mailSlot(p, affine(130, 1320 - 0.95 * 538, 538));
  shoeRack(p, affine(130, 1322, 538 * 0.95));
  tintS(p, '#0d1210', 70, [[-20, 190], [300, 190], [300, 1320], [-20, 1320]]);
  tubeLight(p, affine(330, 204, 520), 90);
  ventGrille(p, quadMap([700, 10], [1010, 10], [1010, 160], [700, 160], 0.6, 0.3, 0.3));
  fireSign(p, affine(930, 300, 520));
  extCabinet(p, affine(965, 1040, 520));
  meterBox(p, affine(1030, 1320 - 0.2 * 538, 300));
  crack(p, affine(800, 1100, 520), 0.0, 0.3, 0.08, 0.55, 6, 31);
  tintS(p, '#eaf0d8', 60, [[-20, 190], [700, 190], [520, 900], [-20, 900]]); // fluorescent glare on the wall
  const U = 1400, g: Pt = [550, 740 + (1.74 - 0.2) * U];
  // `eyes: 'none'` (kit) draws no eye, so no kit white, lash or lid is left under the milky eyes painted below.
  const prof = !!o.prof;
  const pose: FigPose = {light: tubeLit, view: 'front', head: prof ? 'right' : 'front', nod: [0.03 + (o.creak ?? 0), 0.1], face: {...EXPRESSIONS.tired, eyes: 'none', sweat: false, look: [0, 0.1], bags: 1}, lean: -0.02};
  const a = drawFigure(p, INF, g, U, pose, 0);
  const hc = a.head, Hpx = 0.425 * U, X = hc[0];
  /** One painted part: opaque flat underlay, then the kit's modelled glaze / form shadow / lit plane under the tube light (as the cast). */
  const body = (seed: number, color: string, pts: Pt[]) => { hardFill(p, seed, color, pts); modelPart(p, seed, color, pts, tubeLit); };
  const soft = (seed: number, color: string, op: number, pts: Pt[], bleed = 0.18, tex = 0.35) => washAt(p, seed, color, op, pts, bleed, tex);
  // `new:` shirt: sloped shoulders, ribbed crew collar, sleeve caps, painted folds (soft shade wedges + lit edges + warm ink creases), torn shoulder.
  const sh = '#9a8a52', shD = mixColor(sh, '#2a2a22', 0.38), shL = mixColor(sh, '#eef2dc', 0.4), crease = mixColor(sh, '#1f1812', 0.62);
  const ty = hc[1] + 0.62 * Hpx; // neck base
  const torso: Pt[] = [[X - 95, ty - 10], [X + 95, ty - 10], [X + 200, ty + 22], [X + 300, ty + 50], [X + 360, ty + 110], [X + 372, ty + 190], [X + 350, 1940], [X - 350, 1940], [X - 372, ty + 190], [X - 360, ty + 110], [X - 300, ty + 50], [X - 200, ty + 22]];
  body(90, sh, torso);
  [a.rShoulder, a.lShoulder].forEach((q, i) => body(88 + i, sh, ell(q[0], q[1] + 22, 92, 74, 16))); // round sleeve caps over the kit shoulder balls
  // r5: opaque shoulder line (the r4 translucent cap tops read as ghosts): a solid yoke from the neck to the sleeve caps, one lit slope on top
  hardFill(p, 130, sh, [[X - 100, ty - 14], [X + 100, ty - 14], [X + 215, ty + 18], [X + 330, ty + 52], [X + 350, ty + 120], [X - 350, ty + 120], [X - 330, ty + 52], [X - 215, ty + 18]]);
  [a.rShoulder, a.lShoulder].forEach((q, i) => { hardFill(p, 132 + i, sh, ell(q[0], q[1] + 8, 104, 100, 18)); soft(134 + i, shL, 90, ell(q[0] + (i ? 10 : -10), q[1] - 40, 66, 22, 12), 0.15, 0.25); });
  // fold shading: broad soft wedges in the shirt's own shadow colour, lit slivers beside them
  [[[X - 230, ty + 130], [X - 130, ty + 250], [X - 90, ty + 400], [X - 150, ty + 330]], [[X + 230, ty + 130], [X + 140, ty + 270], [X + 100, ty + 440], [X + 170, ty + 330]],
    [[X - 200, ty + 520], [X - 80, ty + 560], [X + 60, ty + 540], [X - 60, ty + 600]], [[X + 220, ty + 640], [X + 90, ty + 690], [X - 60, ty + 670], [X + 80, ty + 740]],
    [[X - 150, ty + 800], [X - 20, ty + 830], [X + 150, ty + 800], [X, ty + 880]], [[X + 20, ty + 110], [X + 120, ty + 180], [X + 80, ty + 300], [X + 10, ty + 220]]
  ].forEach((q, i) => soft(112 + i, shD, 120, q as Pt[], 0.22, 0.4));
  [[[X - 250, ty + 120], [X - 170, ty + 205], [X - 130, ty + 235], [X - 215, ty + 160]], [[X + 40, ty + 540], [X + 190, ty + 505], [X + 200, ty + 530], [X + 60, ty + 575]], [[X - 120, ty + 335], [X - 20, ty + 345], [X - 25, ty + 370], [X - 120, ty + 365]]
  ].forEach((q, i) => soft(122 + i, shL, 80, q as Pt[], 0.2, 0.3));
  [[[X - 230, ty + 130], [X - 130, ty + 250], [X - 90, ty + 400]], [[X + 230, ty + 130], [X + 140, ty + 270], [X + 100, ty + 440]],
    [[X - 200, ty + 520], [X - 80, ty + 560], [X + 60, ty + 540]], [[X + 220, ty + 640], [X + 90, ty + 690], [X - 60, ty + 670]],
    [[X - 150, ty + 800], [X - 20, ty + 830], [X + 150, ty + 800]], [[X - 330, ty + 330], [X - 280, ty + 460], [X - 300, ty + 600]], [[X + 330, ty + 330], [X + 285, ty + 470], [X + 305, ty + 610]]
  ].forEach((l, i) => edge(p, 97 + i, l as Pt[], 1.3, false, crease));
  edge(p, 95, [[X - 200, ty + 22], [X - 300, ty + 50], [X - 360, ty + 110], [X - 372, ty + 190], [X - 350, 1940]], 1.2, false, crease);
  edge(p, 96, [[X + 200, ty + 22], [X + 300, ty + 50], [X + 360, ty + 110], [X + 372, ty + 190], [X + 350, 1940]], 1.2, false, crease);
  // torn shoulder on his right (screen left): frayed hole, skin under it, torn cloth edge lighter, a little blood
  const tear: Pt[] = [[X - 300, ty + 190], [X - 275, ty + 172], [X - 255, ty + 182], [X - 228, ty + 205], [X - 240, ty + 240], [X - 262, ty + 262], [X - 290, ty + 252], [X - 304, ty + 225]];
  body(125, '#7f8d73', tear); soft(126, '#2c1a14', 120, [[X - 300, ty + 190], [X - 255, ty + 182], [X - 245, ty + 215], [X - 295, ty + 215]], 0.15, 0.3);
  edge(p, 127, tear, 1.0, true, crease);
  [[X - 305, ty + 196, 6], [X - 296, ty + 168, 5], [X - 226, ty + 214, 5], [X - 244, ty + 250, 6]].forEach(([x, y, r], i) => edge(p, 128 + i, [[x, y], [x + r * 1.6, y - r]], 1.4, false, shL));
  // neck, redrawn over the slab edge so the head sits on a throat; ribbed collar over its foot
  body(132, INF.head.skin, [[X - 88, ty - 70], [X + 88, ty - 70], [X + 96, ty + 10], [X + 50, ty + 46], [X, ty + 56], [X - 50, ty + 46], [X - 96, ty + 10]]);
  soft(133, '#2b3830', 120, [[X - 88, ty - 70], [X + 88, ty - 70], [X + 92, ty - 20], [X, ty + 4], [X - 92, ty - 20]], 0.2, 0.3); // chin shadow on the throat
  const rim = (d: number): Pt[] => [-1, -0.7, -0.4, 0, 0.4, 0.7, 1].map((q) => [X + q * 118, ty - 14 + 84 * (1 - q * q) - d]);
  body(134, mixColor(sh, '#6e665a', 0.3), [...rim(0), ...rim(34).reverse()]);
  [-1, -0.5, 0, 0.5, 1].forEach((q, i) => edge(p, 135 + i, [[X + q * 105, ty + 20 + 74 * (1 - q * q)], [X + q * 109, ty + 46 + 70 * (1 - q * q)]], 0.9, false, crease));
  // `new:` milky eyes. The kit draws only a shut lid arc (eyes 'shut'); a skin patch hides it, then socket shade, white, pupil, lid and glints.
  if (!prof) [-1, 1].forEach((sgn, i) => {
    const ex = X + sgn * 0.19 * Hpx, ey = hc[1] + 0.005 * Hpx, r = 0.064 * Hpx;
    soft(142 + i, '#2c3a34', 70, ell(ex, ey + 0.004 * Hpx, 0.12 * Hpx, 0.06 * Hpx, 18), 0.45, 0.3); // sunk socket
    hardFill(p, 146 + i, '#e6edc8', ell(ex, ey, r * 1.12, r, 18));
    soft(148 + i, '#7d8a5c', 120, [[ex - r, ey + r * 0.2], [ex + r, ey + r * 0.2], [ex + r * 0.7, ey + r], [ex - r * 0.7, ey + r]], 0.2, 0.2); // eyeball shade low
    hardFill(p, 150 + i, '#1c1f18', ell(ex, ey + 0.006 * Hpx, 0.021 * Hpx, 0.021 * Hpx, 10));
    hardFill(p, 152 + i, '#ffffff', ell(ex - 0.03 * Hpx, ey - 0.028 * Hpx, 0.014 * Hpx, 0.014 * Hpx, 8));
    soft(154 + i, '#55654f', 150, [[ex - r * 1.12, ey - r * 0.2], [ex - r * 0.6, ey - r * 0.82], [ex, ey - r * 1.0], [ex + r * 0.6, ey - r * 0.82], [ex + r * 1.12, ey - r * 0.2], [ex, ey - 0.03 * Hpx]], 0.12, 0.25); // upper lid weighs on the eyeball
    edge(p, 156 + i, [-1, -0.7, -0.35, 0, 0.35, 0.7, 1].map((q) => [ex + q * r * 1.2, ey - 0.02 * Hpx - (1 - q * q) * (r * 0.95 - 0.0)] as Pt), 1.8, false, '#2a211b');
  });
  // `new:` blood: wet paint. A dark hard underlay for body, a mid wash inset toward the shadow side for depth, a glossy pink-white highlight where
  // the tube catches it (upper left), a dark ink edge. Positions in head units from the head centre (H = 0.425 m = 595 px at 1400 px/m).
  const b = (x: number, y: number): Pt => [hc[0] + x * Hpx, hc[1] + y * Hpx];
  const B = (pts: [number, number][]): Pt[] => pts.map(([x, y]) => b(x, y));
  const E = (x: number, y: number, rx: number, ry: number, a2 = 0): Pt[] => ell(hc[0] + x * Hpx, hc[1] + y * Hpx, rx * Hpx, ry * Hpx, 20, a2);
  const bd = '#2d0808', bl = '#6a1410', bm = '#8f2018', bh = '#f0b4a6';
  /** Wet blood as a group: dark halo, solid body, a mid tone inset to the shadow side, a pink-white gloss where the tube hits. Halos first, so overlaps merge with no seams. */
  const wetGroup = (seed: number, parts: {pts: Pt[]; hl?: Pt[]}[]) => {
    const grow = (pts: Pt[], k: number): Pt[] => { const cx = pts.reduce((t, q) => t + q[0], 0) / pts.length, cy = pts.reduce((t, q) => t + q[1], 0) / pts.length; return pts.map(([x, y]) => [cx + (x - cx) * k + 0 * y, cy + (y - cy) * k] as Pt); };
    parts.forEach((q, i) => hardFill(p, seed + i, bd, grow(q.pts, 1.1)));
    parts.forEach((q, i) => hardFill(p, seed + 10 + i, bl, q.pts));
    parts.forEach((q, i) => soft(seed + 20 + i, bm, 190, q.pts.map(([x, y]) => [x + 0.012 * Hpx, y + 0.014 * Hpx] as Pt), 0.12, 0.4));
    parts.forEach((q, i) => q.hl && soft(seed + 30 + i, bh, 165, q.hl, 0.1, 0.2));
  };
  /** A wobbly blob (blood is never an ellipse): radius varies with the angle. */
  const W = (x: number, y: number, rx: number, ry: number, k: number, a2 = 0): Pt[] => Array.from({length: 22}, (_, i) => {
    const t = (i / 22) * 6.2832, m = 1 + 0.1 * Math.sin(3 * t + k) + 0.06 * Math.sin(5 * t + 2 * k), u = rx * m * Hpx * Math.cos(t), v = ry * m * Hpx * Math.sin(t);
    return [hc[0] + x * Hpx + u * Math.cos(a2) - v * Math.sin(a2), hc[1] + y * Hpx + u * Math.sin(a2) + v * Math.cos(a2)] as Pt;
  });
  // mouth: a blood rim offset to the lower right (thick on the drip side, thin on the upper left), the dark interior over it; a run from the corner that
  // tapers down the chin into a stain, and one drop that has let go below it. No ink edge: the dark halo is the edge.
  if (prof) profileFace(p, hc, Hpx);
  const run: Pt[] = [...[0, 0.25, 0.5, 0.75, 1].map((t): Pt => [hc[0] + (0.1 + 0.02 * Math.sin(t * 3)) * Hpx - (0.034 - 0.03 * t) * Hpx, hc[1] + (0.36 + 0.13 * t) * Hpx]),
    ...[1, 0.75, 0.5, 0.25, 0].map((t): Pt => [hc[0] + (0.1 + 0.02 * Math.sin(t * 3)) * Hpx + (0.034 - 0.03 * t) * Hpx, hc[1] + (0.36 + 0.13 * t) * Hpx])];
  if (!prof) wetGroup(171, [{pts: W(0.034, 0.315, 0.128, 0.078, 0.3, 0.1), hl: B([[-0.09, 0.262], [-0.03, 0.238], [0.04, 0.234], [-0.02, 0.252]])}, {pts: run}, {pts: W(0.085, 0.485, 0.05, 0.022, 1.7, 0.05), hl: B([[0.058, 0.478], [0.09, 0.474], [0.09, 0.482], [0.06, 0.484]])},
    {pts: B([[0.082, 0.535], [0.094, 0.565], [0.1, 0.585], [0.082, 0.6], [0.064, 0.585], [0.07, 0.565]]), hl: B([[0.074, 0.57], [0.08, 0.568], [0.078, 0.585], [0.073, 0.584]])}]);
  if (!prof) hardFill(p, 176, bd, E(0.0, 0.3, 0.1, 0.05));
  if (!prof) hardFill(p, 177, '#e4dfc8', rectPts(b(-0.045, 0.274)[0], b(-0.045, 0.274)[1], b(0.045, 0.274)[0], b(0.045, 0.274)[1] + 0.017 * Hpx)); // teeth edge
  // shirt and collar spatter: soft stains with a hard dark core, not tidy dots
  [[-0.2, 0.78, 0.07, 0.045, 0.3], [0.1, 0.98, 0.1, 0.055, -0.4], [0.31, 1.12, 0.03, 0.035, 0], [0.37, 1.22, 0.018, 0.024, 0]].forEach(([x, y, rx, ry, ro], i) => {
    soft(200 + i * 3, '#4a0e0b', 210, E(x, y, rx, ry, ro), 0.25, 0.5);
    hardFill(p, 201 + i * 3, bl, E(x + 0.004, y + 0.004, rx * 0.7, ry * 0.7, ro));
    soft(202 + i * 3, bh, 120, E(x - rx * 0.25, y - ry * 0.3, rx * 0.22, ry * 0.2, ro), 0.1, 0.2);
  });
  soft(220, '#4a0e0b', 150, B([[0.06, 0.72], [0.16, 0.74], [0.2, 0.82], [0.12, 0.88], [0.04, 0.82]]), 0.2, 0.5); // wet collar
  if (o.shadow) { // ZC2-R2 (sheet B01-SH03): the face above the mouth sits in shadow, only a pale glint stays in the eyes; blood at mouth and chin stays visible
    const cx = hc[0] + (prof ? 0.1 : 0) * Hpx;
    [[1.0, 60], [0.82, 60], [0.64, 55], [0.46, 45]].forEach(([k, al], i) => tint(p, 250 + i, '#0b1016', al, ell(cx, hc[1] - 0.02 * Hpx, (prof ? 0.4 : 0.44) * Hpx * k, 0.3 * Hpx * k, 22)));
    (prof ? [[hc[0] + 0.245 * Hpx, hc[1] + 0.125 * Hpx]] : [[X - 0.19 * Hpx, hc[1] + 0.005 * Hpx], [X + 0.19 * Hpx, hc[1] + 0.005 * Hpx]]).forEach(([ex, ey], i) => {
      hardFill(p, 242 + i * 2, '#e8f4e6', ell(ex, ey, 0.05 * Hpx, 0.03 * Hpx, 12)); hardFill(p, 243 + i * 2, '#ffffff', ell(ex - 0.012 * Hpx, ey - 0.008 * Hpx, 0.014 * Hpx, 0.012 * Hpx, 8));
    });
  }
};

// ------------------------------------------------------------------ KF-SH04: drag the cabinet (ZC2-B02-SH04)
/**
 * Side view, wall elevation, unit 700 px/m (r3, UT13: medium-wide on one man, was 440), floor y 1500. Door 0.90 x 2.10 m (x 380-1010,
 * its top is off frame). Cabinet 0.77 x 1.06 m (539 x 742 px) at x 420-959, the last 30 cm before it settles IN FRONT of the door: it
 * covers the lever and the door's width; the deadbolt thumb-turn (1.15 m) shows above its top (SH05 needs the lock above the cabinet,
 * so the 1.06 m height stays; recorded in build-notes). Lead: `man-crop`, right view, both fists on the cabinet's near edge, leaning back.
 */
/** G1 `drag` (B02-SH04 draft): cabinet pulled toward the lead in three 8-frame pulls at f 8 / 19 / 28 (word onsets), 0.45 m of the 0.9 m travel on screen, ends on the door at f 34; the lead hangs back off straight arms and steps with it. */
export const dragCX = (f: number) => 490 * (1 - (ease3(f, 8, 16) + ease3(f, 19, 27) + ease3(f, 28, 34)) / 3);
const ease3 = (f: number, a: number, b: number) => { const u = Math.min(1, Math.max(0, (f - a) / (b - a))); return u * u * (3 - 2 * u); };
const KF_SH04 = (p: Painter, v2 = false, dyn?: {f: number}) => {
  resetIds(8000);
  const U = 700, GY = 1500;
  surface(p, [[-20, -20], [1180, -20], [1180, GY], [-20, GY]], '#cdbf9f', {seed: 4, patches: 22, grain: 'h', grainN: 30, streaks: 3, wear: 6});
  const wm = affine(0, GY, U);
  crack(p, wm, 0.15, 1.6, 0.1, -0.6, 6, 21);
  glazeS(p, '#6b5a3c', 70, [[-20, -20], [260, -20], [200, 160], [90, 260], [-20, 330]]);
  const fm = floorMap(540, GY - 1.2 * U, GY, U, 3.0);
  tileFloor(p, fm, -3.5, 3.5, 0, 2.4, 0.6, '#b3a487', 3);
  fillF(p, '#8d7f66', [[-20, GY - 50], [1180, GY - 50], [1180, GY], [-20, GY]]);
  stroke(p, 'HB', '#e8dcc0', 1.2, [[-20, GY - 48], [1180, GY - 48]], 0.01); stroke(p, '2B', '#4b3d33', 1.4, [[-20, GY - 1], [1180, GY - 1]], 0.01);
  const d0 = 380, d1 = 1010, dy0 = GY - 2.1 * U;
  fillF(p, '#46372a', [[d0 - 26, -20], [d1 + 26, -20], [d1 + 26, GY], [d0 - 26, GY]]);
  woodGrain(p, [[d0 - 26, -20], [d0, -20], [d0, GY], [d0 - 26, GY]], '#6a5642', 34, 'v', 5);
  doorLeaf(p, [[d0, -20], [d1, -20], [d1, GY], [d0, GY]], '#8a6b4c', 35, {panels: true, grainN: 34});
  void dy0;
  // Lever and thumb-turn on the door's right edge (the lock end).
  const ly = GY - 1.0 * U, by = GY - 1.15 * U;
  fillF(p, '#b69a58', ell(d1 - 70, by, 34, 34, 12)); fillF(p, '#6b6254', ell(d1 - 70, by, 20, 20, 12)); fillF(p, '#2f2d2c', [[d1 - 88, by - 5], [d1 - 52, by - 5], [d1 - 52, by + 5], [d1 - 88, by + 5]]);
  tintS(p, '#2d2119', 90, ell(d1 - 64, by + 10, 36, 36, 12));
  fillF(p, '#6a6a6c', [[d1 - 150, ly - 9], [d1 - 40, ly - 9], [d1 - 40, ly + 9], [d1 - 150, ly + 9]]);
  // Wall props between the lead and the door, and above the cabinet.
  lightSwitch(p, affine(330, GY - 0.98 * U, U)); intercom(p, affine(330, GY - 1.14 * U, U));
  keyRack(p, affine(660, GY - 1.52 * U, U));
  // Drag marks and a dust drift on the tiles, from where the cabinet stood (right) to its feet.
  // R3-arm2: in the storyboard variant the cabinet is caught 0.13 m earlier in its slide (still right of its end place), so the
  // lead can stand back far enough for nearly straight pulling arms without the head leaving the frame.
  const CX = dyn ? dragCX(dyn.f) : v2 ? 90 : 0, cx0 = 420 + CX, cx1 = 959 + CX, cy0 = GY - 1.06 * U;
  tintS(p, '#6f6049', 70, [[cx0 - 20, GY + 2], [1180, GY + 2], [1180, GY + 70], [cx0 - 60, GY + 50]]);
  [[cx1 - 20, GY + 14, 1180, GY + 12], [cx1 - 30, GY + 34, 1180, GY + 40], [cx1 - 10, GY + 54, 1180, GY + 64], [cx1 + 40, GY + 90, 1180, GY + 110]].forEach(([x0, y0, x1, y1], i) =>
    stroke(p, 'charcoal', '#5b4b36', 3.0 - i * 0.3, [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2 + 3], [x1, y1]], 0.1));
  [[cx1 + 60, GY + 22, 26], [cx1 + 130, GY + 40, 20]].forEach(([x, y, r]) => tintS(p, '#e8dcb8', 150, ell(x, y, r * 2.4, r * 0.6, 12)));
  // Cabinet in front of the door: its shadow on the door and floor.
  contact(p, affine(0, GY + 6, 1), (cx0 + cx1) / 2 + 30, 300, 16, 110);
  tintS(p, '#2d2119', 70, [[cx0 + 30, GY - 8], [cx1 + 50, GY - 8], [cx1 + 50, cy0 + 24], [cx0 + 30, cy0 + 24]]);
  const body: Pt[] = [[cx0, GY], [cx1, GY], [cx1, cy0], [cx0, cy0]];
  woodGrain(p, body, '#8f6c4b', 42, 'v', 30);
  fillF(p, '#3d2f25', rectPts(cx0 + 16, cy0 + 16, cx1 - 16, GY - 18));
  tintS(p, '#1d140e', 80, rectPts(cx0 + 16, cy0 + 16, cx1 - 16, cy0 + 56));
  [0.34, 0.68].forEach((h, i) => { woodGrain(p, rectPts(cx0 + 16, GY - h * 742, cx1 - 16, GY - h * 742 + 16), '#a07b57', 52 + i, 'h', 3); tintS(p, '#1d140e', 90, rectPts(cx0 + 16, GY - h * 742 + 16, cx1 - 16, GY - h * 742 + 40)); });
  [[470, 0.68, '#5d6f82'], [660, 0.68, '#8a4a3a'], [520, 0.34, '#34414f'], [740, 0.34, '#c9b78f']].filter((_, i) => !(dyn && dyn.f >= 34 && i === 2)).forEach(([x, h, c], i) => {
    const X = (x as number) + CX, Y = GY - (h as number) * 742;
    const q: Pt[] = [[X, Y], [X + 96, Y], [X + 88, Y - 44], [X + 14, Y - 54]];
    tintS(p, '#0d0805', 120, rectPts(X - 4, Y - 8, X + 104, Y)); fillF(p, c as string, q); tintS(p, '#ffffff', 55, [[X + 18, Y - 46], [X + 72, Y - 38], [X + 86, Y - 42], [X + 16, Y - 52]]); edge(p, 20 + i, q, 0.9);
  });
  // W5.3d: a solid near stile (lighter wood, own edge) and top-left corner block that the fists hook, so the grip has a frame to hold.
  const stile: Pt[] = [[cx0 - 4, GY], [cx0 + 30, GY], [cx0 + 30, cy0], [cx0 - 4, cy0]];
  woodGrain(p, stile, '#a07b57', 44, 'v', 6); tintS(p, '#1d140e', 70, rectPts(cx0 + 30, cy0 + 6, cx0 + 42, GY - 6)); edge(p, 44, stile, 1.1);
  edge(p, 43, body, 1.1);
  // Knocked-off shoe and the floor in front: mat, keys, paper.
  // the shoe that falls from the lower shelf when the cabinet hits the door (f 34-44): x straight, y accelerating
  const st = dyn ? Math.min(1, Math.max(0, (dyn.f - 34) / 10)) : 1, so = (q: Pt[]) => q.map(([x, y]) => [x + 390 * (1 - st), y - 322 * (1 - st * st)] as Pt);
  const shoeQ: Pt[] = so([[170, GY + 70], [276, GY + 60], [288, GY + 92], [180, GY + 100]]);
  if (!dyn || dyn.f >= 34) {
    if (st >= 1) tintS(p, '#2d2119', 90, [[176, GY + 98], [292, GY + 90], [300, GY + 112], [182, GY + 120]]);
    fillF(p, dyn ? '#34414f' : '#8a4a3a', shoeQ); fillF(p, '#e8e0cc', so([[170, GY + 70], [276, GY + 60], [278, GY + 70], [172, GY + 80]])); edge(p, 61, shoeQ, 0.9);
  }
  const mat: Pt[] = [[90, GY + 250], [520, GY + 226], [580, GY + 330], [130, GY + 368]];
  tintS(p, '#2d2119', 100, [[84, GY + 268], [526, GY + 244], [590, GY + 348], [126, GY + 388]]);
  woodGrain(p, mat, '#6a5a48', 72, 'h', 34); edge(p, 101, mat, 1.1);
  [0, 1, 2, 3, 4].forEach((k) => stroke(p, '2B', '#3b2f26', 1.3, [[120 + k * 80, GY + 262 + k * -4], [150 + k * 80, GY + 355 - k * 3]], 0.1));
  fillF(p, '#c9a24a', ell(700, GY + 330, 28, 12, 10)); edge(p, 111, ell(700, GY + 330, 28, 12, 10), 0.8); stroke(p, 'HB', '#5a5a5c', 1.4, [[722, GY + 326], [770, GY + 308]], 0.2);
  const pap: Pt[] = [[800, GY + 420], [920, GY + 400], [940, GY + 450], [820, GY + 470]];
  tintS(p, '#2d2119', 80, pap.map(([a, b]) => [a + 6, b + 8] as Pt)); fillF(p, '#e8e2d0', pap); edge(p, 116, pap, 0.7); [0, 1, 2].forEach((k) => stroke(p, 'HB', '#6e675a', 0.8, [[816, GY + 430 + k * 10], [900, GY + 418 + k * 10]], 0.02));
  tintS(p, '#f6d9a0', 50, [[560, GY + 20], [900, GY + 20], [1180, 1940], [700, 1940]]);
  tintS(p, '#f6d9a0', 60, [[220, -20], [440, -20], [980, GY], [760, GY]]);
  // Lead: heels dug in left of the cabinet, body hung back off the grip, both fists on the cabinet's near edge.
  // R3-arm2 (user: the arms still read wrong; the lead stood 0.1 m off the cabinet so the elbows folded back like wings at chest
  // height): a heavy drag hangs the body weight off nearly straight arms, hips low and back, knees bent (refs in build-notes.md).
  // Both fists hook the cabinet's near side edge at 0.58 / 0.70 m; the shoulder sits ~0.42 m back from the edge, so the near arm is
  // straight and the far arm (behind the torso) has a slight bend, both running down-forward at ~45 deg under the leaning torso.
  // pull phase 0..1 of the current pull (hangs back off the grip), 0 between pulls (re-grip, leaning in)
  const pu = dyn ? Math.max(ease3(dyn.f, 8, 16) * (1 - ease3(dyn.f, 16, 19)), ease3(dyn.f, 19, 27) * (1 - ease3(dyn.f, 27, 28)), ease3(dyn.f, 28, 34) * (1 - ease3(dyn.f, 34, 40))) : 0;
  const eased = dyn ? ease3(dyn.f, 40, 56) : 0; // f 51: lead eases off, hand on the shelf edge
  const lean = dyn ? -0.3 - 0.1 * pu + 0.14 * eased : v2 ? -0.3 : -0.34, crouch = dyn ? 0.06 + 0.06 * pu : 0.1;
  const g: Pt = dyn ? [248 + CX + 8 * eased + 56 * pu, GY + 50] : v2 ? [338, GY + 50] : [250, GY + 50];
  const S = shoulderPoint(LEAD, g, U, {view: 'right', lean, crouch}, 'r');
  const hand: Pt = v2 || dyn ? [cx0 + 22, GY - 0.74 * U] : [cx0 - 6, cy0 + 250]; // ZC2-R2: fists higher and on the edge face, grip + lean
  const hand2: Pt = v2 || dyn ? [cx0 + 24, cy0 + 56] : [cx0 - 6, cy0 + 170];
  const face: FigPose['face'] = {...EXPRESSIONS.angry, mouth: 'frown', squint: 0.75, look: [0.7, 0.3], sweat: true};
  tintS(p, '#5a4c3a', 80, ell(g[0] + 80, GY + 56, 260, 18, 16));
  // Both fists hook the cabinet's near edge. `to` is the wrist; the fist reaches ~0.1 m past it along the forearm.
  const grip = (h: Pt, _drop: number): {to: Pt; via: Pt; fist: 1 | -1} => ({...reachArm(S, h, U, 1), fist: 1}); // R3-fix: kit two-bone IK
  drawFigure(p, LEAD, g, U, {view: 'right', head: 'right', lean, crouch, walk: dyn ? 0.3 + 0.5 * pu : 0.3, stride: 0.45, light: morning([0.7, 0.7]),
    lArm: grip(hand2, 30), rArm: grip(hand, 36), face}, 0.9);
  tintS(p, '#e8dcb8', 150, ell(g[0] - 90, GY + 44, 60, 12, 12));
  // Foreground: potted plant bottom-right, large and dark.
  tintS(p, '#2d2119', 70, ell(960, 1890, 230, 30, 16));
  plant(p, affine(960, 1890, 1500 * 0.42), 0.7, 1);
  tintS(p, '#3d2f25', 38, [[-20, 1800], [1180, 1800], [1180, 1940], [-20, 1940]]);
};

// ------------------------------------------------------------------ KF-SH02: corridor wide (ZC2-B01-SH02)
/**
 * Long-lens corridor, W-CORR, eye (-0.40, 1.50, 0), f 6800 px, principal point (540, 560). Corridor 1.8 m wide x 2.6 m high, to the
 * end window at z 30. Doors with shoes along both walls, three fluorescent tubes. The infected: `man-shaved`, right view facing its own
 * door, head down, flat silhouette (kit `silhouette`) at z 28, 1.74 m = ~243 px/m.
 */
export const KF_SH02 = (p: Painter, zo: {facing?: boolean; dark?: number; slack?: boolean; inf?: number; sway?: number; sil?: string} = {}) => {
  const eye: V3 = [-0.4, 1.5, 0], f = 6800, cxp = 540, cyp = 560;
  const P = ([x, y, z]: V3): Pt => { const d = Math.max(0.05, z - eye[2]); return [cxp + (f * (x - eye[0])) / d, cyp - (f * (y - eye[1])) / d]; };
  const far = (c: string, z: number) => hex(c, '#e9e5d4', Math.min(0.6, Math.max(0, (z - 8) / 34)));
  const C = {wall: '#b4ae9c', ceil: '#c8c3b2', floor: '#a39986', door: '#7d6e5d', frame: '#6b5f50'};
  resetIds(10000);
  const hz = (z: number) => Math.min(0.6, Math.max(0, (z - 8) / 34));
  plane(p, 1, '#f3f0e4', rectPts(-20, -20, 1100, 1940), 0.2);
  const zs = [4, 6, 8.5, 11, 14, 17, 20.5, 24, 27, 30];
  // Back layer: painted ceiling, walls and tile floor in 3 m segments, hazed towards the end window.
  zs.slice(0, -1).forEach((z0, i) => {
    const z1 = zs[i + 1], n = z0 < 12 ? 9 : 4;
    const hazeCol = '#ece8d6';
    const cq = [P([-0.9, 2.6, z0]), P([0.9, 2.6, z0]), P([0.9, 2.6, z1]), P([-0.9, 2.6, z1])];
    const wl = [P([-0.9, 2.6, z0]), P([-0.9, 2.6, z1]), P([-0.9, 0, z1]), P([-0.9, 0, z0])];
    const wr = [P([0.9, 2.6, z1]), P([0.9, 2.6, z0]), P([0.9, 0, z0]), P([0.9, 0, z1])];
    surface(p, cq, far(C.ceil, z0), {seed: 10 + i, patches: n, grain: 'none', streaks: 0});
    surface(p, wl, far(hex(C.wall, '#000000', 0.12), z0), {seed: 20 + i, patches: n, grain: 'h', grainN: n * 2, streaks: z0 < 14 ? 2 : 0, wear: z0 < 14 ? 3 : 0});
    surface(p, wr, far(C.wall, z0), {seed: 30 + i, patches: n, grain: 'h', grainN: n * 2, streaks: z0 < 14 ? 2 : 0, wear: z0 < 14 ? 3 : 0});
    [cq, wl, wr].forEach((q) => tintS(p, hazeCol, 40 + hz(z0) * 90, q));
    stroke(p, '2B', far('#7a7462', z0), 1.2, [P([-0.9, 2.6, z0]), P([0.9, 2.6, z0])], 0.01); // ceiling panel seam
  });
  for (let z = 6.8; z < 30; z += 0.6) stroke(p, '2B', far('#7a7462', z), 1.0, [P([-0.3, 2.6, z]), P([0.3, 2.6, z])], 0.01);
  fillF(p, C.floor, [P([-0.9, 0, 5]), P([0.9, 0, 5]), P([0.9, 0, 30]), P([-0.9, 0, 30])]);
  tileFloor(p, (x, z) => P([x, 0, z]), -0.9, 0.9, 7, 15.4, 0.6, C.floor, 7);
  tileFloor(p, (x, z) => P([x, 0, z]), -0.9, 0.9, 15.4, 30, 1.2, C.floor, 8);
  [[5, 8], [8, 12], [12, 18], [18, 30]].forEach(([a, b], i) => tintS(p, '#ece8d6', 25 + i * 40, [P([-0.9, 0, a]), P([0.9, 0, a]), P([0.9, 0, b]), P([-0.9, 0, b])]));
  // Mid layer: doors (grain, panels, plates), then the wall and floor props.
  [6, 9, 12, 15, 18, 21, 24, 27.2].forEach((z, i) => {
    [-0.9, 0.9].forEach((x, s) => {
      const z1 = z + 1.0;
      const q: Pt[] = x < 0 ? [P([x, 2.05, z]), P([x, 2.05, z1]), P([x, 0, z1]), P([x, 0, z])] : [P([x, 2.05, z1]), P([x, 2.05, z]), P([x, 0, z]), P([x, 0, z1])];
      const fr = [P([x, 2.12, z - 0.06]), P([x, 2.12, z1 + 0.06]), P([x, 0, z1 + 0.06]), P([x, 0, z - 0.06])];
      fillF(p, far('#5a4e40', z), fr);
      doorLeaf(p, q, far(C.door, z), 70 + i * 2 + s, {panels: z < 16, grainN: z < 12 ? 16 : 6});
      tintS(p, '#ece8d6', 20 + hz(z) * 110, q);
      edge(p, 100 + i * 2 + s, q, 0.6, true, hex('#4b3d33', '#e9e5d4', hz(z)));
    });
  });
  const wallM = (side: -1 | 1, zc: number, y0: number, w: number, h: number): M => {
    const x = side * 0.9, zl = side < 0 ? zc - w / 2 : zc + w / 2, zr = side < 0 ? zc + w / 2 : zc - w / 2;
    return quadMap(P([x, y0 + h, zl]), P([x, y0 + h, zr]), P([x, y0, zr]), P([x, y0, zl]), w, h, w / 2);
  };
  const flat = (z: number) => (side: -1 | 1, y: number) => P([side * 0.9, y, z]);
  void flat;
  numberPlate(p, wallM(-1, 6.5, 1.55, 0.3, 0.1), '1201'); numberPlate(p, wallM(1, 6.5, 1.55, 0.3, 0.1), '1202');
  numberPlate(p, wallM(-1, 9.5, 1.55, 0.3, 0.1), '1203'); numberPlate(p, wallM(1, 9.5, 1.55, 0.3, 0.1), '1204');
  numberPlate(p, wallM(1, 12.5, 1.55, 0.3, 0.1), '1206'); numberPlate(p, wallM(-1, 12.5, 1.55, 0.3, 0.1), '1205');
  noticePaper(p, wallM(-1, 9.5, 1.15, 0.3, 0.32)); mailSlot(p, wallM(1, 6.5, 1.0, 0.3, 0.06)); mailSlot(p, wallM(-1, 12.5, 1.0, 0.3, 0.06));
  meterBox(p, wallM(-1, 8.0, 1.1, 0.4, 0.55));
  extCabinet(p, wallM(1, 8.0, 0.8, 0.4, 0.75));
  fireSign(p, wallM(1, 22.5, 2.2, 0.5, 0.2));
  ventGrille(p, quadMap(P([-0.3, 2.6, 8.4]), P([0.3, 2.6, 8.4]), P([0.3, 2.6, 7.6]), P([-0.3, 2.6, 7.6]), 0.6, 0.3, 0.3));
  ventGrille(p, quadMap(P([-0.3, 2.6, 17.5]), P([0.3, 2.6, 17.5]), P([0.3, 2.6, 16.8]), P([-0.3, 2.6, 16.8]), 0.6, 0.3, 0.3));
  crack(p, wallM(1, 14.5, 0.4, 0.6, 2.0), 0.3, 1.9, 0.05, -1.4, 7, 41, 1.0);
  // floor-standing props: shoe racks and sandals, a plant, an umbrella at the doors (billboards at their depth).
  const bb = (x: number, z: number): M => { const b = P([x, 0, z]); return affine(b[0], b[1], f / (z - eye[2])); };
  shoeRack(p, bb(-0.64, 9.8)); shoeRack(p, bb(0.64, 6.9)); umbrella(p, bb(0.78, 12.2)); plant(p, bb(-0.68, 12.9), 0.4, 2);
  // End wall with the bright window.
  plane(p, 170, '#d8d4c4', [P([-0.9, 0, 30]), P([0.9, 0, 30]), P([0.9, 2.6, 30]), P([-0.9, 2.6, 30])], 0.2);
  plane(p, 171, '#fbf8ec', [P([-0.7, 0.6, 30]), P([0.7, 0.6, 30]), P([0.7, 2.3, 30]), P([-0.7, 2.3, 30])], 0.1);
  tint(p, 172, '#fffbea', 70, [P([-1.2, 0.2, 30]), P([1.2, 0.2, 30]), P([1.2, 2.6, 30]), P([-1.2, 2.6, 30])]);
  // Lower third (near floor, z 6-11): baseboards, wet floor reflections of the tubes and the end window, dropped items, a drag smear
  // and wall marks. Estimates in W-CORR metres.
  [-0.9, 0.9].forEach((x, s2) => {
    const q = (z0: number, z1: number): Pt[] => [P([x, 0, z0]), P([x, 0.12, z0]), P([x, 0.12, z1]), P([x, 0, z1])];
    plane(p, 180 + s2, '#6f6558', q(5, 30));
  });
  tint(p, 183, '#fffbea', 70, [P([-0.25, 0, 7.6]), P([0.35, 0, 7.6]), P([0.2, 0, 30]), P([-0.1, 0, 30])]); // window reflection down the middle
  [[7.6, 3], [14, 1.8], [21, 1.8]].forEach(([z, l], i) => tint(p, 184 + i, '#f4f6ea', 95 - i * 20, [P([-0.4, 0, z]), P([0.4, 0, z]), P([0.3, 0, z + l]), P([-0.3, 0, z + l])])); // tube pools
  [[-0.62, 8.3, 0.0], [0.2, 9.8, 0.05], [-0.4, 11.6, -0.05]].forEach(([x, z], i) => { // a dropped shoe each: sole footprint + upper
    const L = 0.27, Wd = 0.1, col = ['#8a4a3a', '#34414f', '#c9b78f'][i];
    const sole: Pt[] = [P([x, 0, z]), P([x + L * 0.8, 0, z - 0.01]), P([x + L, 0, z + Wd * 0.5]), P([x + L * 0.8, 0, z + Wd]), P([x, 0, z + Wd * 0.9])];
    plane(p, 190 + i, '#2a211b', sole);
    const up: Pt[] = [P([x + 0.01, 0.015, z + 0.01]), P([x + L * 0.6, 0.015, z]), P([x + L * 0.62, 0.08, z + 0.01]), P([x + L * 0.22, 0.12, z + Wd * 0.4]), P([x + 0.01, 0.12, z + Wd * 0.6])];
    plane(p, 194 + i, col, up); edge(p, 198 + i, up, 0.8);
  });
  const bag: Pt[] = [P([-0.38, 0, 10.6]), P([-0.04, 0, 10.6]), P([-0.04, 0.26, 10.65]), P([-0.2, 0.34, 10.7]), P([-0.36, 0.22, 10.65])];
  plane(p, 197, '#3a3d44', bag); edge(p, 189, bag, 1.0);
  [[-0.3, 9.9], [0.05, 11.6], [-0.65, 12.6]].forEach(([x, z], i) => { // loose papers
    const q: Pt[] = [P([x, 0, z]), P([x + 0.24, 0, z + 0.05]), P([x + 0.22, 0, z + 0.42]), P([x - 0.02, 0, z + 0.36])];
    plane(p, 200 + i, '#ece6d2', q); edge(p, 204 + i, q, 0.6);
  });
  const bottle: Pt[] = [P([0.0, 0, 12.4]), P([0.36, 0, 12.5]), P([0.36, 0.07, 12.5]), P([0.0, 0.07, 12.4])];
  plane(p, 208, '#b9cfd6', bottle); edge(p, 209, bottle, 0.8); plane(p, 210, '#4f6a8a', [P([0.36, 0, 12.5]), P([0.42, 0, 12.52]), P([0.42, 0.06, 12.52]), P([0.36, 0.07, 12.5])]);
  // drag smear from the middle of the floor to the infected's door (right wall), dark red-brown, and a few drops
  // painted drag smear: a wide wet start that thins and dries toward the door, ragged edges, dark streaks along the pull, lighter dry rim, grit
  const sx = (t: number) => 0.0 + 0.6 * t + 0.03 * Math.sin(t * 7), sz = (t: number) => 9.6 + 4.6 * t, sw = (t: number) => 0.034 * (1 - t) ** 0.9 + 0.006;
  const edgeP = (t: number, k: number, side: 1 | -1): Pt => P([sx(t) + side * (sw(t) * k + 0.025 * (H2(t * 31 + side) - 0.5)), 0, sz(t)]);
  const H2 = (v: number) => { const q = Math.sin(v * 12.9898) * 43758.5453; return q - Math.floor(q); };
  const ts = Array.from({length: 15}, (_, i) => i / 14);
  const smear = (k: number): Pt[] => [...ts.map((t) => edgeP(t, k, 1)), ...ts.slice().reverse().map((t) => edgeP(t, k, -1))];
  washAt(p, 300, '#6a1d17', 70, smear(1.35), 0.3, 0.5); // thin outer stain where it soaked into the grout
  washAt(p, 301, '#5a1612', 130, smear(1.0), 0.15, 0.55); // body of the smear
  washAt(p, 302, '#7c2a1e', 100, smear(0.55).map(([x, y]) => [x + 3, y - 2] as Pt), 0.2, 0.6); // lighter dried middle
  washAt(p, 303, '#2e0a08', 120, ts.slice(0, 7).map((t) => edgeP(t, 0.7, 1)).concat(ts.slice(0, 7).reverse().map((t) => edgeP(t, 0.1, -1))), 0.15, 0.4); // wet dark start
  [-0.8, -0.5, -0.15, 0.2, 0.55, 0.85].forEach((o, i) => stroke(p, '2B', i % 2 ? '#3a0e0b' : '#4a1410', 1.8 - i * 0.15, ts.filter((t) => t < 0.55 + 0.4 * H2(i + 3)).map((t) => P([sx(t) + o * sw(t), 0, sz(t)])), 0.2)); // drag streaks
  stroke(p, 'HB', '#9a4a36', 0.8, ts.map((t) => edgeP(t, 1.0, 1)), 0.2); // dry rim lit by the window
  [[0.3, 8.3], [0.45, 9.3], [0.62, 11.6]].forEach(([x, z], i) => washAt(p, 310 + i, '#4a1410', 200, ell(...P([x, 0, z]), 14 - i * 3, 5, 10), 0.2, 0.5)); // grit and spatter beside it
  [[-0.05, 8.8], [0.1, 10.0], [0.25, 12.2]].forEach(([x, z], i) => plane(p, 212 + i, '#6d1713', ell(...P([x, 0, z]), 26 - i * 8, 8, 10)));
  // wall marks: grey damp stain high on the left wall, scuffs and a bloody handprint smear on the right wall
  tint(p, 220, '#6e6a5a', 90, [P([-0.9, 1.6, 7]), P([-0.9, 2.4, 7.2]), P([-0.9, 2.5, 11]), P([-0.9, 1.9, 10])]);
  [[0.4, 7.5, 0.4], [0.8, 9.2, 0.9], [0.5, 11, 0.5]].forEach(([y, z, l], i) => edge(p, 221 + i, [P([-0.9, y, z]), P([-0.9, y + 0.1, z + l])], 1.4, false, '#6f6558'));
  const hp: Pt[] = [P([0.9, 1.1, 17.2]), P([0.9, 1.3, 17.3]), P([0.9, 1.35, 17.7]), P([0.9, 1.2, 17.8]), P([0.9, 0.9, 18.0]), P([0.9, 0.75, 17.4])];
  plane(p, 224, '#7a1a14', hp); [0, 1, 2].forEach((k) => edge(p, 225 + k, [P([0.9, 0.95 - k * 0.12, 17.9]), P([0.9, 0.45 - k * 0.12, 18.6])], 2.6, false, '#7a1a14'));
  // Foreground: your own door jamb edge (soft dark strip at left, seen through the gap) and the floor light pool.
  plane(p, 173, '#3e332a', [[-20, -20], [90, -20], [60, 1940], [-20, 1940]], 0.2);
  // The infected, far: kit figure in house clothes and grey-green skin, right view facing its own door on the right wall (unit ~243 px/m).
  const fc = !!zo.facing, dk = zo.dark ?? 0;
  const gz0 = fc ? P([0.42, 0, 27.6]) : P([0.5, 0, 28]), U = f / 28, gz: Pt = [gz0[0] + (zo.sway ?? 0), gz0[1]];
  const pi = zo.inf === undefined ? p : p.layer(zo.inf, 5000); // G11: the infected fades in (B01-SH01) over the finished corridor
  if (zo.inf !== undefined && zo.inf <= 0.01) return;
  const INF2 = {...INF, head: {...INF.head, skin: hex('#8fa07e', '#141a12', dk), hair: '#1c1814'}, outfit: {...INF.outfit, shirt: hex('#9a8a52', '#141a12', dk), sleeve: hex('#9a8a52', '#141a12', dk), pants: hex('#3b3f48', '#141a12', dk * 0.5)}};
  tint(pi, 230, '#3b3a30', 80, ell(gz[0] + 10, gz[1] + 4, 60, 6, 14)); // contact shadow
  const zl: InteriorLight = {...tubeLit, key: [0.2, 1], pal: {...tubeLit.pal, ambientMix: 0.12 + dk * 0.5, lightMix: 0.34 * (1 - dk), lightOpacity: 140 * (1 - dk * 0.8)}};
  // facing: knocking on his own door (right wall). R3-arm2 (user: the IK arm still read wrong: elbow tucked into the belly, fist up in
  // the air at head height): authored knock, upper arm forward-down 50 deg off vertical so the elbow stands clear in front of the
  // chest, forearm rising 55 deg toward the door, fist at chin/shoulder height with its knuckles on the door plane (x 0.9).
  // Both bones BONE (0.26 m). Refs in build-notes.md.
  let reach = {};
  if (fc) {
    const S0 = shoulderPoint(INF2, gz, U, {view: 'right', lean: 0.1}, 'r');
    reach = {rArm: {via: [S0[0] + 0.199 * U, S0[1] + 0.167 * U] as Pt, to: [S0[0] + 0.348 * U, S0[1] - 0.046 * U] as Pt, fist: 1 as const}};
  }
  if (!fc && zo.slack) { // R3-fix: shambling arms, elbow bent slightly forward, hand hanging at the thigh (kit two-bone IK), instead of the straight hang strip
    const S0 = shoulderPoint(INF2, gz, U, {view: 'right', lean: 0.06}, 'r');
    reach = {rArm: {to: [S0[0] + 0.055 * U, S0[1] + 0.47 * U] as Pt}, lArm: {to: [S0[0] + 0.05 * U, S0[1] + 0.44 * U] as Pt}};
  }
  const fig = drawFigure(pi, INF2, [gz[0], gz[1]], U, {light: zl, view: 'right', head: 'right', face: EXPRESSIONS.sleepy, nod: [0, 0.12], lean: fc ? 0.1 : 0.06, ...reach, ...(zo.sil ? {silhouette: zo.sil} : {})}, 0);
  if (!zo.sil) washAt(pi, 231, '#6d1713', 200, ell(fig.head[0] + 22, fig.head[1] + 18, 8, 6, 8), 0.05, 0.1); // blood at the jaw
};

// ------------------------------------------------------------------ plumbing
const FRAMES = {KF_SH05, KF_SH03, KF_SH04, KF_SH02} as const;
export {KF_SH05, KF_SH04, KF_SH03};
type FrameId = keyof typeof FRAMES;

const Frame = ({id}: {id: FrameId}) => {
  const paint = useCallback(({brush, frame}: PaintContext) => {
    const p = makePainter(brush, {t: frame / 30, frame, fade: PAPER});
    FRAMES[id](p);
  }, [id]);
  return (
    <AbsoluteFill style={{background: PAPER, width: 1080, height: 1920}}>
      <BrushCanvas paint={paint} paper={PAPER} />
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};

export const ZC2K_SH05 = () => <Frame id="KF_SH05" />;
export const ZC2K_SH03 = () => <Frame id="KF_SH03" />;
export const ZC2K_SH04 = () => <Frame id="KF_SH04" />;
export const ZC2K_SH02 = () => <Frame id="KF_SH02" />;
export {INK};
