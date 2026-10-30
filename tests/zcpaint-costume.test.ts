import {test} from 'node:test';
import assert from 'node:assert/strict';
import {INFECTED, YOU, YOU_DAY3} from '../src/painted/zcpaint/cast';
import {clothTones, costumeOf, COSTUME, COSTUME_DAY3, figFront, figSeatFloor, figSeatSofa, figSide, figSlack, H6, handParts, K6, MITTEN_6H, rotPt, type Fig, type HU} from '../src/painted/zcpaint/body6';
import {bustFig, placeClose, visibleNeckHU, waistCutHeads} from '../src/painted/zcpaint/bust';
import {cel as celTone} from '../src/painted/zcpaint/light';

// BOSS PASS 11 (R2.6, `CS-ZCP-R26`, `TX-ZCP-CLOTH`, `FR-ZCP-CLOSE`): the costume covers every figure view and pose, the bust neck and collar
// stay within the close rule, the bucket elbows go back instead of splaying out, the waist-cut placement puts the chin on the measured
// plate row, and the cloth texture targets cloth only. Pixel checks are on the R2.6 model sheet (`scripts/zombie-condo-paint/r26-sheet.sh`).

/** Every figure view and pose of the R2.6 model sheet, with the skin colour of its cast. */
const figures = (): [string, Fig, string][] => [
  ['front hang', figFront(YOU), YOU.head.skin],
  ['back', figFront(YOU, {back: true}), YOU.head.skin],
  ['bucket grip', figFront(YOU, {arms: 'bucket'}), YOU.head.skin],
  ['profile standing', figSide(YOU), YOU.head.skin],
  ['walk', figSide(YOU, {stride: 1}), YOU.head.skin],
  ['seated floor day 3', figSeatFloor(YOU_DAY3, {pitch: 0.35}), YOU_DAY3.head.skin],
  ['seated sofa', figSeatSofa(YOU), YOU.head.skin],
  ['infected front', figSlack(INFECTED, {view: 'front', slump: 1}), INFECTED.head.skin],
  ['infected profile', figSlack(INFECTED, {view: 'side', slump: 1}), INFECTED.head.skin],
  ['bust front', bustFig(YOU, {view: 'front'}), YOU.head.skin],
  ['bust back', bustFig(YOU, {view: 'back'}), YOU.head.skin],
  ['bust profile', bustFig(YOU, {view: 'side'}), YOU.head.skin],
  ['bust seated day 3', bustFig(YOU_DAY3, {view: 'side', seated: true, pitch: 0}), YOU_DAY3.head.skin],
  ['bust infected front', bustFig(INFECTED, {view: 'front', slump: 1}), INFECTED.head.skin],
  ['bust infected profile', bustFig(INFECTED, {view: 'side', slump: 1}), INFECTED.head.skin],
  // The R2.6 G2 plate variants (pass 13): the bucket lift, the B04 walk, the B06 hover and the B07 bread hold.
  ['G2 bucket lift', figFront(YOU, {arms: 'bucket', mitten: MITTEN_6H}), YOU.head.skin],
  ['G2 walk', figSide(YOU, {stride: 1, mitten: MITTEN_6H}), YOU.head.skin],
  ['G2 hover', figSide(YOU, {stride: 0, mitten: MITTEN_6H, hover: {grip: [1.13, 3.56], e: 1}}), YOU.head.skin],
  ['G2 sofa bread', figSeatSofa(YOU, {mitten: MITTEN_6H, hold: 'bread'}), YOU.head.skin],
];

test('costume: bare skin only at the hands, feet and neck (no forearm or shin tube on any view, pose or bust)', () => {
  for (const [name, fig, skin] of figures()) {
    for (const p of fig.parts) {
      // A neck is a skin tube drawn without ink (`ink: false`), the feet are skin tubes that stay below the ankle line; hands are convex parts.
      if (!p.tube || p.col !== skin || p.ink === false) continue;
      const us = p.tube.c.map(([, u]) => u);
      assert.ok(Math.max(...us) <= 0.45, `${name}: bare skin tube from u ${Math.min(...us).toFixed(2)} to ${Math.max(...us).toFixed(2)} (a forearm or shin)`);
    }
  }
});

test('costume: the zc-you figures wear the R2.6 colours and day 3 the darker set; the infected keeps its khaki and grey-green', () => {
  const cloth = (fig: Fig) => new Set(fig.parts.filter((p) => p.cloth).map((p) => p.col));
  const you = cloth(figFront(YOU));
  assert.ok(you.has(COSTUME.over) && you.has(COSTUME.pants), 'overshirt and trousers in the costume colours');
  const day3 = cloth(figSeatFloor(YOU_DAY3, {pitch: 0}));
  assert.ok(day3.has(COSTUME_DAY3.over) && day3.has(COSTUME_DAY3.pants), 'day 3 uses the darker costume');
  assert.equal(costumeOf(YOU).over, COSTUME.over);
  const inf = cloth(figSlack(INFECTED, {view: 'front', slump: 1}));
  assert.ok(inf.has(INFECTED.outfit.shirt) && inf.has(INFECTED.outfit.pants), 'the infected shirt and trousers');
});

test('collar: the visible bare neck from the chin to the collar stand is at most 0.10 head on every bust, front and profile (B8)', () => {
  const cases: [string, Fig][] = [
    ['bust front', bustFig(YOU, {view: 'front'})],
    ['bust front legs off (waist cut)', bustFig(YOU, {view: 'front', legs: false})],
    ['bust front day 3', bustFig(YOU_DAY3, {view: 'front'})],
    ['bust profile', bustFig(YOU, {view: 'side'})],
    ['bust front infected, slump 0', bustFig(INFECTED, {view: 'front', slump: 0})],
    ['bust front infected, slump 1', bustFig(INFECTED, {view: 'front', slump: 1})],
    ['bust profile infected, slump 1 (pitched chin)', bustFig(INFECTED, {view: 'side', slump: 1})],
  ];
  for (const [name, fig] of cases) {
    const neck = visibleNeckHU(fig);
    assert.ok(Number.isFinite(neck) && neck >= 0 && neck <= 0.1 + 1e-9, `${name}: visible neck ${neck.toFixed(3)} heads`);
  }
});

test('bucket grip (CP-P02): the elbows go back into depth, so no arm part splays out past the torso and sleeve', () => {
  const fig = figFront(YOU, {arms: 'bucket'});
  const reach = Math.max(...fig.parts.flatMap((p) => p.pts.map(([x]) => Math.abs(x)))) / H6;
  assert.ok(reach <= 0.95, `widest bucket part ${reach.toFixed(3)} heads (an outward elbow reached 1.2 before the rule)`);
  const upper = fig.parts.filter((p) => p.far && p.col === COSTUME.over);
  assert.ok(upper.length >= 2, 'the upper arms are drawn in the cel tone behind the torso');
});

test('waist-cut close: the chin lands on the plate row and the head is the measured size (B02-SH03 587 px at chin y 1002)', () => {
  const fig = bustFig(YOU, {view: 'front', legs: false});
  const place = placeClose(fig, 515, 587, 1002, 1);
  const chinY = place.gy + place.k * (fig.head.y + 1.22 * K6);
  assert.ok(Math.abs(chinY - 1002) < 0.01, `chin y ${chinY.toFixed(2)}`);
  assert.ok(Math.abs(place.k * H6 - 587) < 0.01, `head ${(place.k * H6).toFixed(2)} px`);
  assert.ok(Math.abs(place.gx + place.k * fig.head.x - 515) < 0.01, 'head centre column');
  const cut = waistCutHeads(1002, 587);
  assert.ok(cut >= 3.0 && cut <= 3.6, `waist cut ${cut.toFixed(3)} heads (FR-ZCP-CLOSE 3.0-3.6)`);
});

test('texture (TX-ZCP-CLOTH): the cloth targets are the cloth washes and their cel tones only, never skin or hair', () => {
  const fig = figFront(YOU);
  const tones = clothTones(fig);
  assert.ok(tones.has(COSTUME.over) && tones.has(celTone(COSTUME.over)), 'the overshirt lit and cel tones');
  assert.ok(tones.has(COSTUME.tee), 'the tee');
  assert.ok(!tones.has(YOU.head.skin) && !tones.has(celTone(YOU.head.skin)), 'no skin tone');
  assert.ok(!tones.has('#14110f'), 'no hair strand colour');
});

test('waist-cut closes (G1, R1.4): the cut is 3.0-3.6 heads, faces stay above y 1040, and a pitched chin lands on its row', () => {
  // B01-SH01 and B06-SH02 backs, B01-SH02 infected front, B02-SH03 front, B07-SH01 profile: the head size and chin row of the sheets.
  const closes: [string, Fig, number, number, 1 | -1, boolean][] = [
    ['B01-SH01 back', bustFig(YOU, {view: 'back'}), 600, 1000, 1, false],
    ['B06-SH02 back', bustFig(YOU, {view: 'back'}), 560, 900, 1, false],
    ['B01-SH02 infected front', bustFig(INFECTED, {view: 'front', slump: 1}), 600, 860, 1, true],
    ['B02-SH03 front', bustFig(YOU, {view: 'front'}), 587, 1002, 1, true],
    ['B07-SH01 profile', bustFig(YOU, {view: 'side'}), 600, 760, -1, true],
  ];
  for (const [name, fig, headPx, chinY, dir, face] of closes) {
    const cut = waistCutHeads(chinY, headPx);
    assert.ok(cut >= 3.0 && cut <= 3.6, `${name}: waist cut ${cut.toFixed(3)} heads`);
    if (face) assert.ok(chinY <= 1040, `${name}: chin ${chinY} is above the caption line y 1040`);
    assert.ok(Math.abs(placeClose(fig, 500, headPx, chinY, dir).k * H6 - headPx) < 0.01, `${name}: head ${headPx} px`);
  }
  // A pitched head (the infected profile, slump 1): the chin turns with the head, so the rotated chin is what lands on the row.
  const tilted = bustFig(INFECTED, {view: 'side', slump: 1});
  assert.ok(tilted.head.tilt && tilted.head.pivot, 'the infected profile head is pitched');
  const p = placeClose(tilted, 540, 600, 860, -1);
  const chin = rotPt([tilted.head.x, tilted.head.y + 1.22 * K6], tilted.head.pivot!, tilted.head.tilt!);
  assert.ok(Math.abs(p.gy + p.k * chin[1] - 860) < 0.01, `pitched chin y ${(p.gy + p.k * chin[1]).toFixed(2)} (row 860)`);
});

// BOSS PASS 13 (G2, `BODY-ZCP-6H` mitten, B06-SH01 hover, B07-SH02 bread): the G2 options are opt-in, so every other figure keeps its
// geometry; the mitten measures the BODY-ZCP-6H size; the bread hold adds the far sleeve and the loaf between both mittens.

/** Hand extents in its own frame (dir +x): the length from the wrist cap to the fingertips, and the width across the palm and thumb. */
const handSize = (size?: {across?: number; along?: number}) => {
  const parts = handParts({kind: 'mitten', w: [0, 0] as HU, dir: [1, 0] as HU, thumb: 1, ...size}, '#000');
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const p of parts) for (const [x, y] of p.pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  return {long: (x1 - x0) / H6, across: (y1 - y0) / H6};
};

test('mitten (BODY-ZCP-6H): the G2 plates draw 0.26 across and 0.40 long, and the shared mitten keeps its size for the other plates', () => {
  const g2 = handSize(MITTEN_6H);
  assert.ok(Math.abs(g2.long - 0.4) <= 0.01, `long ${g2.long.toFixed(3)} head`);
  assert.ok(Math.abs(g2.across - 0.26) <= 0.01, `across ${g2.across.toFixed(3)} head`);
  const shared = handSize();
  assert.ok(shared.long > 0.5 && shared.across > 0.35, 'the shared default mitten is not scaled');
});

test('B07-SH02 bread hold: the far sleeve and a loaf between both mittens are added; the default sofa figure is unchanged', () => {
  const held = figSeatSofa(YOU, {hold: 'bread'}), plain = figSeatSofa(YOU);
  assert.ok(held.parts.some((p) => p.col === '#d9a25c'), 'a bread loaf is drawn');
  assert.ok(held.parts.length > plain.parts.length, 'the far sleeve and mitten are added');
  assert.deepEqual(figSeatSofa(YOU).parts.map((p) => p.pts), plain.parts.map((p) => p.pts), 'the default sofa is deterministic');
});

test('B06-SH01 hover at blend 0 is the plain walk (the hover is opt-in and starts from the hang)', () => {
  const plain = figSide(YOU, {stride: 1}), zero = figSide(YOU, {stride: 1, hover: {grip: [1.13, 3.56], e: 0}});
  assert.deepEqual(zero.parts.map((p) => p.pts), plain.parts.map((p) => p.pts));
});

