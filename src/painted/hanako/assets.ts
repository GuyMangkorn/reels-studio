import {hash} from '../kit/hash';
import {ell, hardFill, inkLine, rectPts, solid, washAt} from '../kit/draw';
import {paintPovHand, wristAtKnuckles} from '../kit/hands';
import {lerp, ramp, makePainter, type Painter, type Pt} from '../kit/painter';
import {HANAKO_HAND, HK, paintDoorFace} from './look';

export type RestroomView = 'RR-KNOCK' | 'RR-WIDE' | 'RR-DOOR';
export const RESTROOM = {
  'RR-KNOCK': {k: 1200, ground: 2336, top: -64, bottom: 2192},
  'RR-WIDE': {k: 200, ground: 801, top: 400, bottom: 777},
  'RR-DOOR': {k: 600, ground: 1520, top: 320, bottom: 1448},
} as const;

/** One set owner, canonical 0.9 x 2 m doors at 0.95 m centres. */
export const paintRestroom = (p: Painter, view: RestroomView) => {
  if (view === 'RR-KNOCK') {paintDoorFace(p); return;}
  const {brush} = p, {k, ground, top, bottom} = RESTROOM[view];
  hardFill(p, 1, '#1b292b', rectPts(-300, -300, 1380, 2220));
  hardFill(p, 2, '#526f6d', rectPts(-300, -300, 1380, ground));
  // Tile courses stay quiet behind the doors; seeded mineral washes above the caption band.
  for (let y = 0; y < ground; y += 120) {
    inkLine(p, 10 + y, [[-100, y], [1180, y]], {color: '#405c5b', weight: 0.65, closed: false, still: true});
    for (let x = ((y / 120) % 2) * 100; x < 1080; x += 200)
      inkLine(p, 20 + x + y, [[x, y], [x, y + 120]], {color: '#405c5b', weight: 0.65, closed: false, still: true});
  }
  washAt(p, 6, '#b4cec0', 70, rectPts(-80, 150, 1160, top), 0.05, 0.15);
  for (let n = 1; n <= 5; n++) {
    const cx = 540 + (n - 3) * 0.95 * k, hw = 0.45 * k, x = cx - hw;
    if (x > 1100 || x + 2 * hw < -20) continue;
    const seed = n * 100;
    hardFill(p, seed, '#172627', rectPts(x - 8, top - 8, cx + hw + 8, bottom + 12));
    hardFill(p, seed + 1, n === 3 ? '#7d9486' : '#587169', rectPts(x, top, cx + hw, bottom));
    hardFill(p, seed + 2, n === 3 ? '#6e8478' : '#4b635d', rectPts(x + hw * .16, top + k * .13, cx + hw * .84, top + k * .76));
    inkLine(p, seed + 3, [[x + 2, bottom], [x + 2, top + 2], [cx + hw - 2, top + 2]], {color: '#adc1af', weight: .7, closed: false, still: true});
    hardFill(p, seed + 4, '#b8c7ba', rectPts(cx - .05 * k, ground - 1.60 * k, cx + .05 * k, ground - 1.50 * k));
    hardFill(p, seed + 5, '#2a3d39', rectPts(cx + hw * .73, ground - .95 * k, cx + hw * .87, ground - .84 * k));
    for (let j = 0; j < 5; j++) {
      const y = bottom - k * (.12 + j * .048);
      hardFill(p, seed + 10 + j, '#304740', rectPts(x + hw * .17, y, cx + hw * .83, y + k * .015));
    }
  }
  // Screen-space values below 860 are deliberately dark; no bright wet reflection.
  hardFill(p, 700, '#1a2b2d', rectPts(-300, ground, 1380, 2220));
  if (view === 'RR-WIDE') {
    for (const x of [-1800, -600, 0, 540, 1080, 1680, 2880]) {
      p.inkStill(710 + x, 'cpencil', '#2c4140', .7);
      brush.line(540 + (x - 540) * .23, ground, x, 1920);
    }
    for (const y of [850, 940, 1080, 1320, 1700]) inkLine(p, y, [[0, y], [1080, y]], {color: '#2b3c3d', weight: .7, closed: false, still: true});
    hardFill(p, 740, '#102021', [[244, 846], [277, 846], [286, 855], [237, 855]]);
    hardFill(p, 750, '#b2c9bd', rectPts(315, 270, 765, 282));
    hardFill(p, 751, '#354b49', rectPts(300, 260, 780, 269));
  }
};

// RR-KNOCK: f = 1200 * .78 = 936 px, principal y = 2336 - 1200 * 1.45 = 596.
// Restore the sheet elbow (.34, 1.30, .42), at .36 m eye depth.
export const KNOCK_DIR = -2.2;
export const KNOCK_ELBOW: Pt = [540 + 936 * .34 / .36, 596 + 936 * .15 / .36];
export const knockPose = (f: number) => {
  let u = 0;
  for (const hit of [4, 18, 31]) {
    if (f >= hit - 3 && f <= hit) u = ramp(f, hit - 3, hit);
    else if (f > hit && f <= hit + 5) u = 1 - ramp(f, hit, hit + 5);
  }
  const exit = ramp(f, 36, 50), size = lerp(.66, .54, u);
  const knuckles: Pt = [lerp(lerp(733, 660, u), 1180, exit), lerp(lerp(715, 740, u), 820, exit)];
  return {knuckles, size, wrist: wristAtKnuckles(knuckles, KNOCK_DIR, size), press: [4, 18, 31].includes(f) ? 1 : 0};
};
export const paintKnockHand = (p: Painter, f: number) => {
  if (f >= 50) return;
  const h = knockPose(f);
  return paintPovHand(p, {base: 900, side: 1, ...h, dir: KNOCK_DIR, curl: 1, thumb: [95, 70], elbow: [KNOCK_ELBOW[0] + h.wrist[0] - knockPose(0).wrist[0], KNOCK_ELBOW[1]], sleeveFrom: [1700, 1100], forearmElbowScale: 2, tone: HANAKO_HAND});
};

const brushHead = (p: Painter, foot: Pt, cy: number, degrees: number, draw: () => void) => {
  p.brush.push(); p.brush.translate(foot[0],cy); p.brush.rotate(degrees*Math.PI/180);
  p.brush.translate(-foot[0],-cy); draw(); p.brush.pop();
};

/** CH-KID (VD05): 4 heads, fixed 3/4 back artwork, short cropped hair, no face. Feet are the pivot. */
export const KIDS = {L: {height: 1.30, foot: [270, 1290] as Pt}, R: {height: 1.25, foot: [830, 1290] as Pt}};
export const notebookAt = (f: number) => {
  const angle = lerp(Math.PI / 3, Math.PI / 6, ramp(f, 24, 36));
  const hw = 105 * Math.cos(angle), left: Pt = [540 - hw, 600], right: Pt = [540 + hw, 600];
  return {angle, hw, left, right};
};
export const paintCorridor = (p: Painter) => {
  hardFill(p, 1, '#263c3e', rectPts(-300, -300, 1380, 2220));
  hardFill(p, 2, '#526c68', [[0, 150], [620, 350], [620, 800], [0, 800]]);
  hardFill(p, 3, '#354d4c', [[620, 350], [1080, 220], [1080, 800], [620, 800]]);
  for (let i = 0; i < 3; i++) {
    const x = 30 + i * 170, y = 260 + i * 45;
    hardFill(p, 10 + i, '#96b7af', rectPts(x, y, x + 135, 610));
    hardFill(p, 20 + i, '#44605c', rectPts(x + 64, y, x + 72, 610));
    inkLine(p, 30 + i, [[x, 615], [x + 135, 615]], {color: '#afc7bb', weight: 1, closed: false, still: true});
  }
  hardFill(p, 40, '#203436', rectPts(586, 445, 680, 795));
  hardFill(p, 41, '#142426', rectPts(-300, 800, 1380, 2220));
  for (const x of [-700, 0, 1080, 1780]) inkLine(p, 50 + x, [[620, 795], [x, 1920]], {color: '#233738', weight: .7, closed: false, still: true});
};
/**
 * Cast wash: an opaque base (`solid`, eight low-texture passes: four passes left a locker divider visible through the hair,
 * measured 31 Oct 2026; build-notes: 6-8 passes for dark over wet) plus one textured washAt glaze for the paper grain. Overlays (cel
 * shade, flap, collar, shade strokes) stay plain washAt on top.
 */
export const cast = (p: Painter, seed: number, color: string, pts: Pt[], glaze = .35) => {
  solid(p, seed, color, pts, 8, .02, .03);   // small border: the pigment ring must not widen the figure past its measured feet
  if (glaze > 0) washAt(p, seed + 300, color, Math.round(255 * glaze), pts, .03, .4);   // bleed kept small: the glaze must not extend the feet
};

/** Ribbon along a polyline (limb, sleeve, strap): the stroke outline, tapering from w0 to w1 px. */
export const ribbon = (pts: Pt[], w0: number, w1: number): Pt[] => {
  const n = pts.length, left: Pt[] = [], right: Pt[] = [];
  pts.forEach((q, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, hw = lerp(w0, w1, i / (n - 1)) / 2;
    const nx = (-(b[1] - a[1]) / len) * hw, ny = ((b[0] - a[0]) / len) * hw;
    left.push([q[0] + nx, q[1] + ny]);
    right.push([q[0] - nx, q[1] - ny]);
  });
  return [...left, ...right.reverse()];
};

/** Kid hand: a small skin palm, a thumb on `side` (-1 left, 1 right) and one shade wash. Replaces the mitten ellipse. */
export const kidHand = (p: Painter, seed: number, [x, y]: Pt, side: -1 | 1) => {
  cast(p, seed, HANAKO_HAND.skin, ell(x, y, 11, 14, 16), .25);
  washAt(p, seed + 1, HANAKO_HAND.shade, 150, ell(x, y + 6, 9, 6, 12), .04, .1);
  cast(p, seed + 2, HANAKO_HAND.skin, ell(x + side * 9, y - 3, 5.5, 7.5, 12, side * .5), .25);
};

/** Cropped back-view hair: a rounded crown, flatter nape, same top and nape line as before (x relative to the pivot). */
const hairPts = (top: number, head: number): Pt[] => {
  const crown: Pt[] = Array.from({length: 9}, (_, i) => {
    const t = Math.PI + (i / 8) * Math.PI;
    return [head * .40 * Math.cos(t), top + head * .5 + head * .5 * Math.sin(t)] as Pt;
  });
  return [...crown, [head * .38, top + head * .86], [head * .18, top + head], [-head * .18, top + head * .98], [-head * .36, top + head * .86]];
};

/** CH-KID (VD05): 4 heads, fixed 3/4 back artwork, short cropped hair, no face. Feet are the pivot. Brush-painted: washes, one rim line, one cel shade. */
export const paintKid = (p: Painter, id: 'L' | 'R', f: number, shadow = true, pose: {gesture?: number; headTurn?: number} = {}) => {
  const {height, foot} = KIDS[id], h = height * 700, head = h / 4, top = foot[1] - h, dir = id === 'L' ? 1 : -1;
  const lean = id === 'R' ? 10 * Math.PI / 180 * ramp(f, 70, 85) : 0;
  const T = ([x, y]: Pt): Pt => [foot[0] + x * Math.cos(lean) + (y - foot[1]) * Math.sin(lean), foot[1] - x * Math.sin(lean) + (y - foot[1]) * Math.cos(lean)];
  const poly = (pts: Pt[]) => pts.map(T), seed = id === 'L' ? 2000 : 3000;
  const nape = top + head, mid = top + h * .48, hip = top + h * .57, ground = foot[1];
  // Ground: a soft cast shadow and two contact shadows under the feet (no shoe or sock detail, VD15).
  if (shadow) {
    washAt(p, seed, '#050c0d', 220, ell(foot[0], foot[1] + 3, 118, 15, 24), .1, .3);
    washAt(p, seed + 1, '#020607', 225, ell(foot[0] - 40, foot[1] + 2, 50, 9, 18), .2, .2);
    washAt(p, seed + 2, '#020607', 225, ell(foot[0] + 40, foot[1] + 2, 50, 9, 18), .2, .2);
  }
  // R waiting: arms behind the torso (CP-P04), darker than the uniform so they sit back.
  if (id === 'R') for (const side of [-1, 1].filter(side => !(side === 1 && pose.gesture !== undefined)))
    cast(p, seed + 4 + (side > 0 ? 1 : 0), '#17252a', poly(ribbon([[side * 72, nape + 35], [side * 90, top + h * .36], [side * 98, top + h * .55]], 48, 38)));
  // Two separate legs with a gap: one dark low-detail mass each, value at the set's dark (VD15); the rim below separates them from the floor.
  cast(p, seed + 10, '#1a2c2f', poly([[-92, hip], [-6, hip], [-10, ground], [-72, ground]]));
  cast(p, seed + 11, '#1a2c2f', poly([[6, hip], [92, hip], [72, ground], [10, ground]]));
  // Uniform top: washed body, lighter cardigan yoke, and one cel shade on the shadow side (right, away from the key light).
  cast(p, seed + 12, '#25393c', poly([[-64, nape - 4], [58, nape - 4], [84, nape + 20], [92, hip], [-92, hip], [-84, nape + 20]]));
  washAt(p, seed + 13, '#2c4346', 200, poly([[-76, nape], [67, nape], [75, mid], [-82, mid]]), .06, .22);
  washAt(p, seed + 14, '#122023', 170, poly([[40, nape + 6], [67, nape], [92, hip], [44, hip], [30, mid]]), .08, .2);
  // School bag on the back: a satchel with a lighter flap and a darker lower edge.
  cast(p, seed + 15, '#284246', poly([[-56, nape + 22], [52, nape + 22], [56, nape + 34], [56, mid + 2], [-56, mid + 2]]));
  washAt(p, seed + 16, '#37575c', 210, poly([[-56, nape + 22], [52, nape + 22], [56, nape + 34], [-56, nape + 34]]), .05, .2);
  washAt(p, seed + 17, '#1a2c30', 150, poly([[-56, mid - 4], [56, mid - 4], [56, mid + 2], [-56, mid + 2]]), .05, .2);
  // Sailor collar: one pale-grey wash band at the nape.
  washAt(p, seed + 18, '#6b8a83', 230, poly([[-65, nape + 4], [dir * 22, nape + 73], [60, nape + 8], [32, nape + 9], [dir * 18, nape + 42], [-36, nape + 5]]), .08, .25);
  // One thin cool rim on the lit left edge, torso to floor: the dark body reads against the set.
  inkLine(p, seed + 19, poly([[-76, nape + 15], [-86, hip], [-80, ground - 60], [-74, ground]]), {color: '#7f9d95', weight: 1.2, closed: false});
  brushHead(p, foot, top + head / 2, pose.headTurn ?? 0, () => {
    cast(p, seed + 20, '#162325', poly(hairPts(top, head)));
    washAt(p, seed + 21, '#2f4a48', 150, poly(ell(-head * .14, top + head * .26, head * .2, head * .13, 16)), .1, .25);
    inkLine(p, seed + 22, poly([[-head * .36, top + head * .18], [-head * .42, top + head * .52], [-head * .34, top + head * .84]]), {color: '#7f9d95', weight: .9, closed: false});
  });
  if (pose.gesture !== undefined) {
    const u = pose.gesture, shoulder: Pt = [foot[0] + 60, nape + 35], elbow: Pt = [foot[0] + 87, top + h * .47];
    const hand: Pt = [foot[0] + 110, lerp(top + h * .56, nape + 35, u)];
    const cuff: Pt = [lerp(elbow[0], hand[0], .72), lerp(elbow[1], hand[1], .72)];
    // World-space points (as the original capsules): no pivot transform here.
    cast(p, seed + 30, '#2d4345', ribbon([shoulder, elbow, hand], 48, 26));
    washAt(p, seed + 31, '#22373a', 230, ribbon([cuff, hand], 30, 26), .05, .15);
    kidHand(p, seed + 32, hand, 1);
  }
  if (id === 'L') {
    // Authored elbows: arms cross forward to the notebook edges, with cuffs at the wrists. Hands are painted over the page by paintNotebook.
    const book = notebookAt(f);
    for (const [i, hand] of [book.left, book.right].entries()) {
      const shoulder: Pt = [foot[0] + (i ? 65 : -40), nape + 35], elbow: Pt = [foot[0] + 65 + i * 45, 742];
      const cuff: Pt = [lerp(elbow[0], hand[0], .72), lerp(elbow[1], hand[1], .72)];
      cast(p, seed + 40 + i * 2, '#2d4345', ribbon([shoulder, elbow, hand], 56, 30));
      washAt(p, seed + 41 + i * 2, '#22373a', 230, ribbon([cuff, hand], 34, 30), .05, .15);
    }
  }
  return {top: T([0, top]), foot, height: h, lean};
};

export const paintNotebook = (p: Painter, f: number) => {
  const b = notebookAt(f), x0 = 540 - b.hw, x1 = 540 + b.hw;
  hardFill(p, 4000, '#152426', rectPts(x0 - 5, 478, x1 + 5, 632));
  hardFill(p, 4001, '#b7c7b9', rectPts(x0, 481, x1, 628));
  hardFill(p, 4002, '#d3daca', rectPts(540, 483, x1 - 2, 625));
  inkLine(p, 4003, [[540, 483], [540, 626]], {color: '#71887f', weight: .7, closed: false, still: true});
  if (f >= 24) {
    const cx = (540 + x1) / 2, sx = b.hw / 2;
    // VD06: a flat childlike drawing on paper, never a body in the corridor.
    hardFill(p, 4010, HK.ink, ell(cx, 512, sx * .39, 19));
    hardFill(p, 4011, '#bfc9b8', rectPts(cx - sx * .18, 517, cx + sx * .18, 535));
    hardFill(p, 4012, '#dee1ce', rectPts(cx - sx * .3, 537, cx + sx * .3, 565));
    hardFill(p, 4013, HK.red, [[cx - sx * .27, 564], [cx + sx * .27, 564], [cx + sx * .49, 593], [cx - sx * .49, 593]]);
    inkLine(p, 4014, [[cx - sx * .22, 593], [cx - sx * .22, 612]], {weight: .65, closed: false});
    inkLine(p, 4015, [[cx + sx * .22, 593], [cx + sx * .22, 612]], {weight: .65, closed: false});
  }
  // Mittens overlap the page edges at exactly the forearm endpoints throughout the tilt.
  [b.left, b.right].forEach(([x, y], i) => kidHand(p, 4020 + i * 4, [x, y], i ? -1 : 1));
};

/** SCENE-R3 CABINET: 0.45 m drawer-face, depth pull represented on the fixed picture plane. */
export const drawerPose = (f: number) => {
  const u = ramp(f, 3, 21);
  return {u, x0: lerp(260, 230, u), x1: lerp(820, 850, u), top: lerp(420, 520, u), bottom: lerp(640, 790, u), handle: [540, lerp(520, 655, u)] as Pt};
};
/** Anchor inversion for the kit's index pinch; thumb closes on the same prop edge. */
export const paintEdgeHand = (p: Painter, target: Pt, side: -1 | 1, size: number, base: number) => {
  const dir = side === 1 ? Math.PI : 0, pinch: Pt = [210, 42];
  const wrist: Pt = [target[0] - (Math.cos(dir)*pinch[0] + side*Math.sin(dir)*pinch[1])*size,
    target[1] - (Math.sin(dir)*pinch[0] - side*Math.cos(dir)*pinch[1])*size];
  const elbow: Pt = [wrist[0] + side*130, target[1]+30];
  const sleeve: Pt = [side === 1 ? Math.max(1520,elbow[0]+400) : Math.min(-440,elbow[0]-400),target[1]+35];
  return paintPovHand(p, {base, side, size, dir, wrist, pinch, pinchGap: 4, curl: .8, spread: 0,
    elbow, sleeveFrom: sleeve, forearmElbowScale: 1.6, tone: HANAKO_HAND});
};
export const paintCabinet = (p: Painter, f: number) => {
  const {brush} = p, q = drawerPose(f);
  hardFill(p, 1, '#19272a', rectPts(-400, -400, 1480, 2320));
  hardFill(p, 2, '#263b3e', rectPts(210, 300, 870, 835));
  hardFill(p, 3, '#526b68', rectPts(230, 320, 850, 416));
  hardFill(p, 4, '#71867a', rectPts(245, 331, 835, 340));
  hardFill(p, 5, '#122124', rectPts(250, 415, 830, q.bottom-10));
  // The dark side walls open before the blank tab bank; no identifying text.
  hardFill(p, 6, '#3a504d', [[250,420],[q.x0,q.top],[q.x0,q.bottom],[250,640]]);
  hardFill(p, 7, '#304743', [[830,420],[q.x1,q.top],[q.x1,q.bottom],[830,640]]);
  if (q.u > 0) for (let i=0;i<7;i++) {
    const y = lerp(425, 550, i/6), x = 300 + (i%3)*115;
    hardFill(p, 20+i, '#657b6c', [[270,y],[810,y],[825,y+45*q.u],[255,y+45*q.u]]);
    hardFill(p, 30+i, '#9eac95', rectPts(x,y-13*q.u,x+95,y+6));
    inkLine(p, 40+i, [[270,y+2],[810,y+2]], {color:'#435c52',weight:.65,closed:false,still:true});
  }
  hardFill(p, 50, '#688176', [[q.x0,q.top],[q.x1,q.top],[q.x1,q.bottom],[q.x0,q.bottom]]);
  hardFill(p, 51, '#7d9587', rectPts(q.x0+7,q.top+6,q.x1-7,q.top+16));
  hardFill(p, 52, '#405b52', rectPts(q.x0+8,q.bottom-20,q.x1-8,q.bottom-7));
  hardFill(p, 53, '#293d3a', rectPts(451,q.handle[1]-20,629,q.handle[1]+19));
  hardFill(p, 54, '#a6b8aa', rectPts(460,q.handle[1]-13,620,q.handle[1]-3));
  hardFill(p, 55, '#172b29', rectPts(472,q.handle[1]-2,608,q.handle[1]+10));
  p.inkStill(56,'cpencil','#415b53',.7); brush.line(q.x0+14,q.top+55,q.x1-14,q.top+55);
  const reach = ramp(f,0,3);
  paintEdgeHand(p, [lerp(1350,q.handle[0],reach),lerp(700,q.handle[1],reach)], 1,.56,900);
  if (f >= 40) {
    let x = 420;
    if(f>=51) x=lerp(420,530,ramp(f,53,67));
    if(f>=67) x=lerp(530,640,ramp(f,69,83));
    let flick=0; for(const hit of [51,67,83]) if(f>=hit-2 && f<=hit+3) flick=12*Math.sin(Math.PI*(f-hit+2)/5);
    // Forefinger and thumb touch the tabs, never lift them.
    paintEdgeHand(p,[lerp(-260,x,ramp(f,40,49)),470-flick],-1,.56,1000);
  }
};

export const folderHandTarget = (f: number): Pt | undefined => {
  if(f>=106) return;
  const turns = [[11,25,840],[62,72,818],[84,94,818]];
  for(const [on,off,x] of turns) {
    if(f>=on-5 && f<=off) {
      if(f<on) return [lerp(1370,x,ramp(f,on-5,on)),530];
      const u=(f-on)/(off-on);
      // Release at edge-on; the paper finishes under its own swing, hand returns to the side.
      return [u<=.5 ? 240+(x-240)*Math.cos(Math.PI*u) : lerp(240,1370,ramp(u,.5,1)),530-20*Math.sin(Math.PI*u)];
    }
  }
  return;
};
export const paintFolderHand = (p: Painter, f: number) => {
  const q=folderHandTarget(f); if(q) paintEdgeHand(p,q,1,.84,1100);
};

/** BOOK-SPREAD: reconstructed marks, not readable documentary evidence. */
export const paintBook = (p: Painter) => {
  hardFill(p,1,'#1b292d',rectPts(-400,-400,1480,2320));
  washAt(p,2,'#293c3d',150,rectPts(-200,180,1300,850),0,.3);
  hardFill(p,10,'#101d21',[[142,390],[535,414],[940,390],[952,850],[535,832],[128,850]]);
  hardFill(p,11,'#687b72',[[140,380],[535,402],[940,380],[940,840],[535,820],[140,840]]);
  for(let i=0;i<4;i++) hardFill(p,12+i,i%2?'#96a797':'#7e9284',[[148+i*2,389+i*3],[535,410],[932-i*2,389+i*3],[932-i*2,833-i*3],[535,815],[148+i*2,833-i*3]]);
  const left: Pt[]=[[150,383],[528,407],[528,814],[150,829]], right: Pt[]=[[548,407],[930,383],[930,829],[548,814]];
  hardFill(p,20,'#acb9a8',left); hardFill(p,21,'#b5c0ae',right);
  hardFill(p,22,'#778e7e',[[517,406],[540,413],[560,406],[560,816],[540,823],[517,816]]);
  washAt(p,23,'#d1d3b7',45,[[164,390],[496,412],[496,798],[164,811]],0,.4);
  // Non-linguistic broken vertical rhythms with no glyph shapes or horizontal words.
  for(let col=0;col<18;col++) {
    const x=180+col*40+(col>=9?35:0);
    for(let row=0;row<11;row++) {
      const y=440+row*29+hash(col*100+row)*8;
      p.inkStill(200+col*20+row,'cpencil','#64796b',.9);
      p.brush.spline([[x,y],[x+(hash(row+col)*8-4),y+6],[x+2,y+13]],.25);
      if(hash(col*70+row)>.4) p.brush.line(x+6,y+5,x+7,y+10);
    }
  }
};


/** Re-stage the unchanged waiting CH-KID at the classroom's 560 px/m figure plane. */
export const paintClassKid = (p: Painter, child: 'A' | 'B', f: number, shadow = true) => {
  const height = child === 'A' ? 1.30 : 1.20, x = child === 'A' ? 300 : 760;
  const scale = height * 560 / (KIDS.R.height * 700);
  p.brush.push(); p.brush.translate(x,1240); p.brush.scale(scale);
  p.brush.translate(-KIDS.R.foot[0],-KIDS.R.foot[1]);
  paintKid(p,'R',0,shadow,{gesture: child === 'A' ? ramp(f,8,20) : undefined,
    headTurn: child === 'B' ? -8*ramp(f,101,113) : 0});
  p.brush.pop();
};
/** B07-SH01 classroom set (P09): wall, board and floor as washes with a falloff, chalk dust on the board, grained teacher's desk. */
export const paintClassroom = (p: Painter) => {
  hardFill(p,1,'#293c3c',rectPts(-400,-400,1480,2320));
  // Wall plane as a wash (backgrounds carry no outlines); the warm light band and a three-step falloff below it.
  // Wall: straight ceiling and floor lines stay hard (architecture); the wash texture is inset inside them.
  hardFill(p,2,'#4e6259',rectPts(-400,140,1480,790));
  washAt(p,25,'#4e6259',120,rectPts(-200,170,1180,772),.05,.35);
  washAt(p,3,'#a3b393',70,rectPts(-200,190,1180,745),.08,.3);
  washAt(p,4,'#1b2a2a',80,rectPts(-400,560,1480,790),.3,.35);
  washAt(p,5,'#1b2a2a',60,rectPts(-400,650,1480,790),.3,.35);
  // Board: the straight frame edges stay hard; the face gets chalk dust, an eraser swipe and faint smears (no legible writing).
  hardFill(p,6,'#1f3735',rectPts(100,190,980,480));
  washAt(p,7,'#8b9d91',40,rectPts(120,205,960,470),.5,.6);
  washAt(p,8,'#c9d3c4',22,[[120,300],[960,240],[960,300],[120,360]],.6,.7);
  p.inkStill(9,'cpencil','#7d8c80',.7);
  for (const [x, y, w] of [[250, 330, 140], [420, 300, 110], [600, 350, 150], [760, 280, 120]]) p.brush.spline([[x, y], [x + w * .5, y - 6], [x + w, y + 4]], .4);
  hardFill(p,10,'#667262',rectPts(96,480,984,490));
  washAt(p,11,'#b9c3b0',45,rectPts(120,490,960,545),.6,.7);
  // Floor: base, wash, and a darker falloff to the lower right (outside the lit light band; keeps the caption band quiet).
  hardFill(p,12,'#1b2b2c',rectPts(-400,790,1480,2320));
  washAt(p,13,'#2a3f40',70,rectPts(-400,806,1480,2320),.05,.35);
  washAt(p,14,'#070f10',80,rectPts(620,980,1480,2320),.1,.3);
  for(const x of [-900,0,1080,1980]) inkLine(p,10+x,[[540,790],[x,1920]],{color:'#30413d',weight:.7,closed:false,still:true});
  // Teacher's desk: wood wash with grain lines and a front edge; the legs and a floor shadow are washes too.
  // The teacher stands behind the desk: his floor shadow sits at the desk's back edge, under the desk top.
  washAt(p,19,'#0b1a19',200,ell(540,664,104,7,24),.3,.25);
  cast(p,20,'#6b5f4a',[[400,662],[680,662],[716,715],[366,715]],.3);
  for(let i=0;i<4;i++) {
    const y=672+i*12;
    p.inkStill(30+i,'cpencil','#4a4131',.8);
    p.brush.spline([[410,y],[470,y+1.5+(hash(i*7+1)-.5)*2],[540,y-1],[610,y+1+(hash(i*7+2)-.5)*2],[670,y]],.3);
  }
  washAt(p,21,'#4b4232',150,[[366,715],[716,715],[720,724],[362,724]],.05,.2);
  cast(p,22,'#3a3f35',rectPts(390,715,410,820),.2);
  cast(p,23,'#3a3f35',rectPts(670,715,690,820),.2);
  washAt(p,24,'#070d0e',60,ell(540,826,190,9,24),.2,.3);
};
export const endingHandPose = (F: number) => {
  if(F<2482) return undefined;
  const u=1-(1-Math.min(1,(F-2482)/24))**3;
  const knuckles: Pt = u<.7 ? [lerp(1320,800,u/.7),lerp(1376,760,u/.7)] : [lerp(800,733,(u-.7)/.3),lerp(760,715,(u-.7)/.3)];
  return {...knockPose(0),knuckles,wrist:wristAtKnuckles(knuckles,KNOCK_DIR,.66)};
};
export const paintEndingHand = (p: Painter,F: number) => {
  const h=endingHandPose(F); if(!h) return;
  const rest=knockPose(0);
  return paintPovHand(F>=2506 ? makePainter(p.brush,{t:0,frame:0,alpha:p.alpha,fade:HK.ink}) : p,{base:900,side:1,...h,dir:KNOCK_DIR,curl:1,thumb:[95,70],
    elbow:[KNOCK_ELBOW[0]+h.wrist[0]-rest.wrist[0],KNOCK_ELBOW[1]],
    sleeveFrom:[1700,1100],forearmElbowScale:2,tone:HANAKO_HAND});
};
