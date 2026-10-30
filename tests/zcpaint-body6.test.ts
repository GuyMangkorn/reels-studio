import {test} from 'node:test';
import assert from 'node:assert/strict';
import {INFECTED, INFECTED_SCALE, YOU, YOU_DAY3} from '../src/painted/zcpaint/cast';
import {figFront, figSeatFloor, figSeatSofa, figSlack, handParts, H6, PX_M, skullTopPx, topPx, type Fig} from '../src/painted/zcpaint/body6';
import {cel, castTone, floorCast, KEY_SEC_DAY, localTravel} from '../src/painted/zcpaint/light';
import type {Pt} from '../src/painted/painter';
import {SEAT_D} from '../src/painted/zcpaint/b09';

// BODY-ZCP-6H (S-P12, Boss pass 7): geometry checks on the 6-head figures. Pixel checks are on the model sheet stills.

/** Distance between two polygons (vertex to edge, both ways); enough for the non-overlapping grip parts tested here. */
const polyDistance = (a: Pt[], b: Pt[]): number => {
  const seg = (p: Pt, s0: Pt, s1: Pt) => {
    const [dx, dy] = [s1[0] - s0[0], s1[1] - s0[1]];
    const t = Math.max(0, Math.min(1, ((p[0] - s0[0]) * dx + (p[1] - s0[1]) * dy) / (dx * dx + dy * dy || 1)));
    return Math.hypot(p[0] - (s0[0] + t * dx), p[1] - (s0[1] + t * dy));
  };
  const edges = (poly: Pt[]) => poly.map((p, i) => [p, poly[(i + 1) % poly.length]] as const);
  let best = Infinity;
  for (const p of a) for (const [s0, s1] of edges(b)) best = Math.min(best, seg(p, s0, s1));
  for (const p of b) for (const [s0, s1] of edges(a)) best = Math.min(best, seg(p, s0, s1));
  return best;
};

/** px per metre at the B09 seated depth `SEAT_D` (d 0.60, b09.ts; SEC-2D-LL, U 565; s(d) = 1 / (1 + d/6)). */
const PX_M_B09 = 565 / (1 + SEAT_D / 6);
const B09_PITCH_20 = 0.3491;

test('BODY-ZCP-6H: zc-you stands 6.0 heads (1.70 m) to the skull crown; one head is 126.7 px at 447 px/m', () => {
  const fig = figFront(YOU);
  assert.ok(Math.abs(skullTopPx(fig) / H6 - 6) < 0.01, `heads ${skullTopPx(fig) / H6}`);
  assert.ok(Math.abs(skullTopPx(fig) / PX_M - 1.7) < 0.01);
  assert.ok(Math.abs(H6 - 126.67) < 0.05);
});

test('infected: 6 heads of 0.27 m at scale 0.95 upright (1.615 m skull, B1); left to gravity the crown drops monotonically', () => {
  const upright = figSlack(INFECTED, {view: 'front', slump: 0});
  const half = figSlack(INFECTED, {view: 'front', slump: 0.5});
  const slack = figSlack(INFECTED, {view: 'front', slump: 1});
  assert.ok(Math.abs(skullTopPx(upright) / H6 - 6) < 0.01, `upright heads ${skullTopPx(upright) / H6}`);
  assert.ok(Math.abs((skullTopPx(upright) * INFECTED_SCALE) / PX_M - 1.615) < 0.01);
  assert.ok(skullTopPx(slack) < skullTopPx(half) && skullTopPx(half) < skullTopPx(upright), 'the slump is continuous');
  // Pass 8 (user 7b look check: the head a little higher while she charges): the crown drops 0.10-0.15 head, not the 7b 0.22.
  const drop = (skullTopPx(upright) - skullTopPx(slack)) / H6;
  assert.ok(drop > 0.1 && drop < 0.15, `the head drops 0.10-0.15 head, got ${drop}`);
});

test('every figure has a floor contact patch that straddles the floor line (the cast shadow starts at the feet or seat)', () => {
  const figs = [figFront(YOU), figSeatFloor(YOU_DAY3, {pitch: 0.3491}), figSeatSofa(YOU), figSlack(INFECTED, {view: 'side', slump: 1})];
  for (const fig of figs) {
    assert.ok(fig.contact.length > 0, `${fig.view} has contact`);
    for (const poly of fig.contact) {
      const ys = poly.map(([, y]) => y);
      assert.ok(Math.min(...ys) < 0 && Math.max(...ys) > 0, `${fig.view} contact straddles the floor line`);
    }
  }
});

test('B09 seated lead at SEAT_D (d 0.60, 565 px/m section): the upright seated figure clears 480 px; a head pitch lowers it', () => {
  const lead = (pitch: number) => (topPx(figSeatFloor(YOU_DAY3, {pitch})) / PX_M) * PX_M_B09;
  const upright = lead(0);
  assert.ok(upright >= 480, `upright lead ${upright.toFixed(1)} px`);
  assert.ok(lead(0.35) < upright, 'pitching the head down lowers the lead');
  assert.ok(lead(B09_PITCH_20) >= 480, `20 degree pitch lead ${lead(B09_PITCH_20).toFixed(1)} px`);
});

/** The seated neck: the tube from the shoulder point up to the chin (`tub`, ink off), its length in heads. */
const neckLength = (fig: Fig, skin: string): number => {
  const neck = fig.parts.find((p) => p.tube && p.ink === false && p.col === skin);
  if (!neck?.tube) throw new Error('no neck tube');
  const us = neck.tube.c.map(([, u]) => u);
  return Math.max(...us) - Math.min(...us);
};

test('seated neck (pass 9): the tube from the shoulder point to the chin is 0.27 head on the floor and sofa figures (pass 8: 0.55)', () => {
  const cases: [Fig, string][] = [[figSeatFloor(YOU_DAY3, {pitch: 0}), YOU_DAY3.head.skin], [figSeatSofa(YOU, {pitch: 0}), YOU.head.skin]];
  for (const [fig, skin] of cases) {
    const len = neckLength(fig, skin);
    assert.ok(len > 0.2 && len <= 0.3, `${fig.view} neck ${len.toFixed(3)} heads`);
  }
});

test('B07 sofa: thigh from hip to knee within 10 degrees of horizontal; the shin lands under the knee on the floor', () => {
  const fig = figSeatSofa(YOU);
  const [hip] = fig.anchors.hips.length ? [fig.anchors.hips] : [[0, 0] as Pt];
  const knee = fig.anchors.knees[0], foot = fig.anchors.feet[0];
  const rise = -hip[1] + knee[1];
  const run = Math.abs(knee[0] - hip[0]);
  const angle = Math.atan2(Math.abs(rise), run) * (180 / Math.PI);
  assert.ok(angle < 10, `thigh angle ${angle.toFixed(1)} deg`);
  assert.equal(foot[1], 0, 'ankle on the floor');
  assert.ok(Math.abs(foot[0] - knee[0]) < 0.5, 'shin vertical under the knee');
});

test('pinch grip: index and thumb keep a visible gap of at least 0.05 head (B05-SH03 lid, B07-SH01 case)', () => {
  const parts = handParts({kind: 'pinch', w: [0, 0], dir: [0, -1], thumb: 1}, '#e2b084');
  const index = parts[1].pts, thumb = parts[2].pts;
  const gap = polyDistance(index, thumb) / H6;
  assert.ok(gap >= 0.05 && gap <= 0.12, `gap ${gap.toFixed(3)} heads`);
});

test('two-tone cel and cast tone: lit x #bdb4c0 for the cel tone (LT-02), x #9f99b1 for the cast tone (LT-03)', () => {
  assert.equal(cel('#ffffff'), '#bdb4c0');
  assert.equal(castTone('#ffffff'), '#9f99b1');
  assert.equal(cel('#000000'), '#000000');
});

test('key light: the travel points left and down on screen, so the lit side is right and up; a mirrored figure flips x only', () => {
  const [x1, y1] = localTravel(1), [x2, y2] = localTravel(-1);
  assert.ok(x1 < 0 && y1 > 0, `travel ${x1.toFixed(3)}, ${y1.toFixed(3)}`);
  assert.equal(x2, -x1);
  assert.equal(y2, y1);
  assert.ok(Math.abs(Math.hypot(x1, y1) - 1) < 1e-9);
});

test('cast shadow: a 1 m upright caster lands 0.615 m left at its top and rises 0.769 m back; the contact band is 0.24 m deep', () => {
  // KEY-SEC-DAY: L = (-0.4, -0.65, 0.5). A point h above the floor shades (-0.615 h, 0.769 h) on the floor.
  const strip: Pt[] = [[0, 0], [10, 0], [10, -PX_M], [0, -PX_M]];
  const poly = floorCast(strip, PX_M, 1, KEY_SEC_DAY, 0.26);
  const xs = poly.map(([x]) => x), ys = poly.map(([, y]) => y);
  assert.ok(Math.abs(Math.min(...xs) - -0.615 * PX_M) < 1, `left reach ${Math.min(...xs)}`);
  assert.ok(Math.abs(Math.max(...xs) - 10) < 1, 'nothing right of the contact');
  // Depth on the sheet: the rise is (0.769 + 0.12) m at the top, foreshortened by 0.26; the contact band is ±0.12 m.
  assert.ok(Math.abs(Math.min(...ys) - -(0.769 + 0.12) * PX_M * 0.26) < 1, `rise ${Math.min(...ys)}`);
  assert.ok(Math.abs(Math.max(...ys) - 0.12 * PX_M * 0.26) < 0.5, `contact band ${Math.max(...ys)}`);
});

test('mirror: the mitten thumb lobe sits on the thumb side; the mitten is two parts (palm, lobe)', () => {
  const left = handParts({kind: 'mitten', w: [0, 0], dir: [0, -1], thumb: 1}, '#e2b084');
  const right = handParts({kind: 'mitten', w: [0, 0], dir: [0, -1], thumb: -1}, '#e2b084');
  assert.equal(left.length, 2);
  const cx = (pts: Pt[]) => pts.reduce((s, p) => s + p[0], 0) / pts.length;
  assert.ok(cx(left[1].pts) > cx(left[0].pts), 'thumb toward +x');
  assert.ok(cx(right[1].pts) < cx(right[0].pts), 'thumb toward -x');
});
