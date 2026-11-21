import {washAt} from '../../kit/draw';
import {flatCircle, paintBox, qy, wFill, wWash} from '../../kit/world';
import {LANDMARKS, norm3, specHand, toneFromSkin} from '../../kit/hand-place';
import {frameOf} from '../../kit/hand-props';
import {add3, scale3, sub3, type V3} from '../../kit/space';
import {camPoint} from '../../kit/ycam';
import {KITCHEN_PAPER, kitchenPool} from '../kitchen31';
import {paintBagTop, paintInstantPrint} from '../props31';
import {paintKitchenShell, paintLemonHalf, WHEELER} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {camMove, ez, lin, mix3} from '../stage31';

// B03-SH05 · F [857, 900) · top shot: the heist gear-up (SCENE-R1 b03). Straight down on the kitchen table: the blank print (the SH03 wash) at the
// top, a row of cut lemon halves on z 0 laid like ammunition (four at L0, `new: lay-out-row`: +0.15 snapped down by his LEFT hand at L3, +0.25 by
// his RIGHT hand at L10), then `new: canvas-money-bag` zipped right to left L14-30 ("ปล้น" L16). The broken camera is not in this shot.
// Hands: five-finger 3D hands entering from the frame bottom (hand-drawing 4: the hands carry the beat). His right hand is screen right (yaw 0).
// Feasibility (recorded for Film): at this framing the table plane is visible to z +0.9, so a body standing at the bottom edge would be in frame;
// the arms run straight off the frame bottom as a top-shot insert convention (forearm 0.26 m to the elbow, the upper arm leaves the frame), the
// body unseen. So that no arm crosses the finished row, the right arm comes in from the bottom right and the LEFT hand, after laying +0.15,
// rests flat on the table in front of the row (the sheet's "left mitten on the bag edge" would put its forearm over the last two lemons).
const N = 43, SHOT = 'B03-SH05';
const CAM = camMove({eye: [0, 1.6, -0.3], yaw: 0, pitch: -88, f: 900, hy: 700}, {eye: [0, 1.6, -0.3], yaw: 0, pitch: -88, f: 945, hy: 700}, 0, N - 1);
const TOP = 0.683, LEMON_R = 0.03, BAG: V3 = [0.3, 0.75, -0.3];
const ROW = [-0.25, -0.15, -0.05, 0.05, 0.15, 0.25];
const TONE = toneFromSkin(WHEELER.head.skin, '#2c8a88');
const DOWN: V3 = [0, -0.55, -1];

/** Lemon i: lying on the table from frame `laid` (L3 for +0.15, L10 for +0.25, L0 for the rest); before it, carried 0.09 m up. */
const LAID = [0, 0, 0, 0, 3, 10];
const lemonAt = (i: number, L: number): V3 => { const x = ROW[i], k = i < 4 ? 1 : ez(L, LAID[i] - 3, LAID[i]); return [x, TOP + 0.015 + 0.09 * (1 - k), i === 4 ? 0.03 * (1 - k) : 0.02 * (1 - k)]; };

/** The hand target per side at frame L: lemon carry -> lay -> left rests in front of the row, right goes to the zip pull. */
const targets = (L: number, pull: V3) => {
  const rest: V3 = [0.02, TOP, 0.14];
  const lemL = lemonAt(4, L), lemR = lemonAt(5, L);
  const left = L < 4 ? lemL : mix3(lemonAt(4, 4), rest, ez(L, 5, 12));
  const right = L < 11 ? lemR : mix3(lemonAt(5, 11), pull, ez(L, 11, 14));
  return {left, right};
};

export const def: Shot31 = {
  id: SHOT, N, paper: KITCHEN_PAPER, vignette: 0.45,
  cam: CAM,
  pool: (_L, c) => kitchenPool(c),
  hands: (L) => {
    const pull = pullAt(L), {left, right} = targets(L, pull);
    return [{arms: ([['left', -1, left], ['right', 1, right]] as const).map(([side, sx, at]) => {
      const holding = (side === 'left' && L < 4) || (side === 'right' && L < 11);
      const onZip = side === 'right' && L >= 11;
      const hand = onZip
        ? specHand({gesture: 'pinch', side, forward: [-0.45, -0.5, -1], back: [0.3, 1, 0], put: {landmark: LANDMARKS.pinch, at: [at[0], at[1] + 0.006, at[2]]}, size: 1.05, tone: TONE, base: 3760})
        : specHand({gesture: holding ? 'claw' : 'relaxed', side, forward: holding ? [sx * -0.15, DOWN[1], DOWN[2]] : [0.1, -0.12, -1], back: holding ? [0, 1, -0.3] : [0, 1, -0.1], put: {landmark: LANDMARKS.palm, at: [at[0], at[1] + (holding ? 0.03 : 0.02), at[2] + (holding ? 0.035 : 0.01)]}, size: 1.05, tone: TONE, base: 3720 + (sx > 0 ? 40 : 0)});
      // straight reach off the frame bottom (right arm from the bottom right): elbow 0.26 m back along the forearm, the upper arm runs past the edge
      const dir = norm3(sub3([at[0] + (sx > 0 ? 0.9 : -0.1), 1.05, 1.15], hand.wrist));
      const elbow = add3(hand.wrist, scale3(dir, 0.26)), shoulder = add3(elbow, scale3(dir, 1.2));
      return {hand, elbow, shoulder, sleeve: '#2c8a88', cuff: 0.6};
    })}];
  },
  paint: (p, L, c, pr) => {
    paintKitchenShell(p, c);
    // the table top only (seen from above the legs are under it): the kitchenTable top and its checked oilcloth
    paintBox(p, c, 37440, {x0: -0.55, x1: 0.55, y0: 0.64, y1: 0.68, z0: -0.35, z1: 0.35}, '#a37a4c', {}, {ink: true});
    wFill(p, c, 37441, '#e9dfc6', qy(0.681, -0.5, 0.5, -0.3, 0.3));
    for (let i = 0; i < 5; i++) wWash(p, c, 37442 + i, '#b24a3a', 80, qy(0.682, -0.5 + i * 0.2, -0.42 + i * 0.2, -0.3, 0.3), 0.05, 0.2);
    for (let i = 0; i < 3; i++) wWash(p, c, 37447 + i, '#b24a3a', 70, qy(0.683, -0.5, 0.5, -0.3 + i * 0.2, -0.22 + i * 0.2), 0.05, 0.2);
    paintInstantPrint(p, c, 37450, frameOf([0, TOP + 0.001, -0.25], [0, 0, -1], [0, 1, 0]), 1);
    const pull = paintBagTop(p, c, 37460, BAG, lin(L, 14, 30));
    ROW.forEach((_, i) => {
      const at = lemonAt(i, L);
      const sh = flatCircle(c, [at[0] + 0.012, TOP + 0.0005, at[2] + 0.01], LEMON_R * 1.1, 20);
      if (sh.length > 2) washAt(p, 37480 + i, '#1a120a', 90 * (at[1] < TOP + 0.03 ? 1 : 0.5), sh, 0.25, 0.1);
      paintLemonHalf(p, c, 37500 + i * 20, at, LEMON_R, {shadow: false});
    });
    if (pr) {
      const a = camPoint(c, lemonAt(0, L)), b = camPoint(c, lemonAt(5, 42)), e = camPoint(c, [LEMON_R, TOP, 0]), o = camPoint(c, [0, TOP, 0]);
      const pc = camPoint(c, [0, TOP, -0.25]), bq = camPoint(c, BAG);
      if (a && b) pr.lead('ROW', {top: a[1], bottom: b[1], left: a[0], right: b[0], x: (a[0] + b[0]) / 2});
      if (e && o) pr.lead('LEMON-D', {top: 2 * (e[0] - o[0]), bottom: 0});
      if (pc) pr.lead('PRINT', {top: pc[1], bottom: pc[1], x: pc[0]});
      if (bq) pr.lead('BAG', {top: bq[1], bottom: bq[1], x: bq[0]});
      void pull;
    }
  },
};
/** The zip pull (world) at frame L, the same formula paintBagTop uses (w 0.17: x from +0.15 to -0.15 of the bag centre). */
const pullAt = (L: number): V3 => { const k = lin(L, 14, 30), w = 0.17; return [BAG[0] + w - 0.02 - k * (2 * w - 0.04), BAG[1] + 0.004, BAG[2]]; };
export const shot = makeShot(def);
