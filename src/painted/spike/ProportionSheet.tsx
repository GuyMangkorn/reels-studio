import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {CHIN, FACES, HEAD_SPAN, INK, SKIN, paintHead} from './FaceSheet';

type Pt = [number, number];

// Proportion spike: the flat-face decal head on short cartoon block-out bodies at 3, 3.5 and 4 heads tall, front
// view, same head size, with head-unit guides and the joint skeleton drawn over the block-out. Not a rig: this only
// chooses proportions before Boss builds one. 1080x1920 frame.

const HEADS = [3, 3.5, 4];
const UNIT = 290; // one head (forehead top to chin), px
const GROUND = 1700;
const COL_W = 360;
const SHIRT = '#8fa6b8', PANTS = '#56636f', SHOE = '#2f3336', BONE = '#c0392b';

/**
 * Joint positions of a front-view standing body `n` heads tall, from the chin down, in px. `h` is one head, `ground`
 * the floor line, `shoulder` the half shoulder width in heads.
 */
export const skeleton = (cx: number, n: number, ground = GROUND, h = UNIT, shoulder = 0.4) => {
  const chin = ground - (n - 1) * h;
  const shoulderY = chin + 0.16 * h;
  // Taller figures give the extra length mostly to the legs; the torso stays chunky.
  const torso = ((n - 1) * h - 0.16 * h) * (n <= 3 ? 0.5 : n <= 3.5 ? 0.47 : 0.44);
  const hipY = shoulderY + torso - 0.08 * h;
  const ankleY = ground - 0.09 * h;
  const sw = shoulder * h;
  const armLen = torso * 0.98;
  const arm = (side: number) => {
    const shoulder: Pt = [cx + side * (sw - 0.06 * h), shoulderY + 0.06 * h];
    const elbow: Pt = [shoulder[0] + side * 0.05 * h, shoulder[1] + armLen * 0.5];
    const wrist: Pt = [shoulder[0] + side * 0.08 * h, shoulder[1] + armLen];
    return {shoulder, elbow, wrist};
  };
  const leg = (side: number) => {
    const hip: Pt = [cx + side * 0.17 * h, hipY];
    const ankle: Pt = [cx + side * 0.19 * h, ankleY];
    const knee: Pt = [(hip[0] + ankle[0]) / 2, (hipY + ankleY) / 2];
    return {hip, knee, ankle};
  };
  return {chin, neck: [cx, chin + 0.04 * h] as Pt, shoulderY, hipY, crotchY: hipY + 0.1 * h, sw, arms: [arm(-1), arm(1)], legs: [leg(-1), leg(1)]};
};

// A limb segment as a quad of width w0 at a, w1 at b.
export const limb = ([ax, ay]: Pt, [bx, by]: Pt, w0: number, w1: number): Pt[] => {
  const len = Math.hypot(bx - ax, by - ay), nx = -(by - ay) / len, ny = (bx - ax) / len;
  return [[ax + nx * w0 / 2, ay + ny * w0 / 2], [bx + nx * w1 / 2, by + ny * w1 / 2], [bx - nx * w1 / 2, by - ny * w1 / 2], [ax - nx * w0 / 2, ay - ny * w0 / 2]];
};
export const ellipse = (cx: number, cy: number, rx: number, ry: number, n = 20): Pt[] =>
  Array.from({length: n}, (_, i) => [cx + rx * Math.cos((i / n) * 6.283), cy + ry * Math.sin((i / n) * 6.283)]);

const paint = (ctx: PaintContext) => {
  const {brush, width: W, still, boil} = ctx;
  const h = UNIT;
  let seed = 20000;
  const fill = (color: string, pts: Pt[], passes = 4) => {
    for (let p = 0; p < passes; p++) {
      still(++seed);
      brush.noStroke();
      brush.fill(color, 255);
      brush.fillBleed(0);
      brush.fillTexture(0.08, 0.2);
      brush.polygon(pts);
      brush.noFill();
    }
  };

  // Head-unit guides from the ground up, held still (no boil) so they read as a ruler.
  for (let i = 0; i <= 4; i++) {
    still(19000 + i);
    brush.set('HB', i === 0 ? INK : '#9fb3c4', i === 0 ? 1.6 : 1);
    brush.line(30, GROUND - i * h, W - 30, GROUND - i * h);
  }

  HEADS.forEach((n, col) => {
    const cx = col * COL_W + COL_W / 2;
    const k = skeleton(cx, n);
    const hw = 0.3 * h;

    // Block-out, back to front: legs and shoes, torso, arms and mitten hands, neck, head.
    for (const {hip, ankle} of k.legs) fill(PANTS, limb([hip[0], hip[1] - 0.04 * h], ankle, 0.26 * h, 0.19 * h));
    for (const {ankle} of k.legs) fill(SHOE, ellipse(ankle[0] + Math.sign(ankle[0] - cx) * 0.04 * h, GROUND - 0.05 * h, 0.16 * h, 0.07 * h));
    fill(PANTS, [[cx - hw - 0.02 * h, k.hipY - 0.06 * h], [cx + hw + 0.02 * h, k.hipY - 0.06 * h], [cx + hw, k.crotchY], [cx - hw, k.crotchY]]);
    fill(SHIRT, [[cx - k.sw + 0.04 * h, k.shoulderY], [cx + k.sw - 0.04 * h, k.shoulderY], [cx + k.sw, k.shoulderY + 0.08 * h], [cx + hw + 0.03 * h, k.hipY], [cx - hw - 0.03 * h, k.hipY], [cx - k.sw, k.shoulderY + 0.08 * h]]);
    for (const {shoulder, elbow, wrist} of k.arms) {
      fill(SHIRT, limb(shoulder, elbow, 0.19 * h, 0.16 * h));
      fill(SKIN, limb(elbow, wrist, 0.15 * h, 0.13 * h));
      fill(SKIN, ellipse(wrist[0], wrist[1] + 0.07 * h, 0.1 * h, 0.12 * h));
    }
    fill(SKIN, [[cx - 0.1 * h, k.chin - 0.1 * h], [cx + 0.1 * h, k.chin - 0.1 * h], [cx + 0.11 * h, k.shoulderY + 0.02 * h], [cx - 0.11 * h, k.shoulderY + 0.02 * h]]);
    const K = h / HEAD_SPAN;
    paintHead(ctx, col, cx, k.chin - CHIN * K, K, FACES[0]);

    // Skeleton over the block-out: bones as lines, joints as dots.
    boil(30000 + col);
    brush.set('rotring', BONE, 1.4);
    const bone = ([ax, ay]: Pt, [bx, by]: Pt) => brush.line(ax, ay, bx, by);
    const pelvis: Pt = [cx, k.hipY];
    bone(k.neck, pelvis);
    bone(k.arms[0].shoulder, k.arms[1].shoulder);
    bone(k.legs[0].hip, k.legs[1].hip);
    for (const {shoulder, elbow, wrist} of k.arms) {
      bone(shoulder, elbow);
      bone(elbow, wrist);
    }
    for (const {hip, knee, ankle} of k.legs) {
      bone(hip, knee);
      bone(knee, ankle);
    }
    const joints: Pt[] = [k.neck, pelvis, ...k.arms.flatMap((a) => [a.shoulder, a.elbow, a.wrist]), ...k.legs.flatMap((l) => [l.hip, l.knee, l.ankle])];
    joints.forEach(([x, y]) => fill(BONE, ellipse(x, y, 9, 9, 12), 3));
  });
};

const Labels = () => (
  <AbsoluteFill style={{fontFamily: 'Noto Sans Thai, sans-serif', color: INK}}>
    <div style={{position: 'absolute', left: 60, top: 50, fontSize: 40}}>Short cartoon body · proportions</div>
    <div style={{position: 'absolute', left: 60, top: 104, fontSize: 26, color: '#5d6b78'}}>same head size · guide lines = 1 head</div>
    {[0, 1, 2, 3, 4].map((i) => (
      <div key={i} style={{position: 'absolute', left: 8, top: GROUND - i * UNIT - 34, fontSize: 22, color: '#5d6b78'}}>{i}</div>
    ))}
    {HEADS.map((n, col) => (
      <div key={n} style={{position: 'absolute', left: col * COL_W, width: COL_W, top: GROUND + 40, textAlign: 'center', fontSize: 40, fontWeight: 700}}>
        {n} หัว
      </div>
    ))}
  </AbsoluteFill>
);

export const ProportionSheet = () => (
  <AbsoluteFill style={{backgroundColor: '#f3ecdc'}}>
    <BrushCanvas paint={paint} paper="#f3ecdc" />
    <Labels />
  </AbsoluteFill>
);
