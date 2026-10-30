import {test} from 'node:test';
import assert from 'node:assert/strict';
import {INFECTED, YOU} from '../src/painted/zcpaint/cast';
import {H6, skullTopPx} from '../src/painted/zcpaint/body6';
import {bustFig, keyTravel} from '../src/painted/zcpaint/bust';
import {zcpaintShots} from '../src/painted/shots/zcpaint';

// Close-shot bust (Boss pass 10, `zcpaint/bust.ts`): geometry checks on the bust views, the reach solver and the plate registry. The pixel
// checks are on the bust model sheet and the plate stills (`scripts/zombie-condo-paint/bust-sheet.sh`, `plate-stills.sh`).

test('bust: the standing front, back and profile stand six heads to the skull crown (the same scale as the full figure)', () => {
  for (const view of ['front', 'back', 'side'] as const) {
    const fig = bustFig(YOU, {view});
    const heads = skullTopPx(fig) / H6;
    assert.ok(Math.abs(heads - 6.0) < 0.01, `${view}: ${heads.toFixed(3)} heads`);
  }
});

test('bust: the slack infected head sits 0.12 head lower than upright, and the infected is a slimmer torso (0.12 narrower at the side seams)', () => {
  const up = bustFig(INFECTED, {view: 'front', slump: 0});
  const slack = bustFig(INFECTED, {view: 'front', slump: 1});
  const drop = (slack.head.y - up.head.y) / H6;
  assert.ok(Math.abs(drop - 0.12) < 0.005, `head drop ${drop.toFixed(3)} heads`);
  const width = (fig: typeof up) => Math.max(...fig.parts.filter((p) => p.col === INFECTED.outfit.shirt && p.pts.length > 4).flatMap((p) => p.pts.map(([x]) => Math.abs(x))));
  assert.ok(width(slack) < width(up), 'the slack shirt is narrower than the upright one');
});

test('bust: a reaching arm solves to its grip point with the wrist 0.17 head behind it (two-bone IK, pinch)', () => {
  const to: [number, number] = [0.97, 4.92];
  const fig = bustFig(YOU, {view: 'side', arms: {R: {kind: 'reach', to, hand: 'pinch'}}});
  const wrist = fig.anchors.hands[0];
  const target = [to[0] * H6, -to[1] * H6];
  const d = Math.hypot(wrist[0] - target[0], wrist[1] - target[1]) / H6;
  assert.ok(Math.abs(d - 0.17) < 0.01, `wrist to grip ${d.toFixed(3)} heads`);
});

test('bust: the key travel mirrors with the figure, so a key on the screen-right lights a figure facing screen-left from its back', () => {
  const screen = keyTravel(-1, [-1, 0.25]);
  assert.ok(screen[0] > 0, 'local travel points forward (+x) for a figure facing left');
  const n = Math.hypot(screen[0], screen[1]);
  assert.ok(Math.abs(n - 1) < 1e-9, 'unit travel');
  assert.deepEqual(keyTravel(1, [0, 1]), [0, 1]);
});

test('bust: the close plates are registered under their sheet shot IDs (B01-SH01/02, B02-SH03, B04-SH03/04, B05, B06, B07-SH01, B09-SH02)', () => {
  const ids = new Set(zcpaintShots.map((s) => s.id));
  for (const id of [
    'ZCP-B01-SH01', 'ZCP-B01-SH02', 'ZCP-B02-SH03', 'ZCP-B04-SH03a', 'ZCP-B04-SH03b', 'ZCP-B04-SH03c-TH', 'ZCP-B04-SH03c-EN',
    'ZCP-B04-SH04-TH', 'ZCP-B04-SH04-EN', 'ZCP-B05-SH01-TH', 'ZCP-B05-SH01-EN', 'ZCP-B05-SH02', 'ZCP-B05-SH03', 'ZCP-B05-SH03-BOWL',
    'ZCP-B05-SH03-TH', 'ZCP-B05-SH03-EN', 'ZCP-B06-SH02', 'ZCP-B06-SH03', 'ZCP-B07-SH01', 'ZCP-B09-SH02',
  ]) assert.ok(ids.has(id), `missing plate ${id}`);
  const served = (id: string) => zcpaintShots.find((s) => s.id === id)?.serves;
  assert.deepEqual(served('ZCP-B07-SH01'), ['B07-SH01']);
  assert.deepEqual(served('ZCP-B05-SH03-TH'), ['B05-SH03']);
});
