import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {houseInterior} from '../src/assets/backgrounds/HouseInterior';
import {BedroomPOV, bedEndPlacement, bedroomPOVAt} from '../src/assets/backgrounds/BedroomPOV';
import {samplePose} from '../src/rig/poses';
import {Ghost} from '../src/rig/Ghost';
import {CharacterArt} from '../src/rig/Character';
import {CatArt, DogArt} from '../src/rig/Animal';
import {layoutActor} from '../src/scenes/timeline';

test('interior and POV artwork preserve aspect ratio in both layouts', () => {
  for (const [w, h] of [
    [1080, 1920],
    [1920, 1080],
  ]) {
    const context = {w, h, time: 'moonlight', options: {variant: 'drawing'}} as Parameters<
      typeof houseInterior
    >[0];
    const html = renderToStaticMarkup(createElement('svg', null, houseInterior(context).mid));
    for (const match of html.matchAll(/scale\(([\d.]+) ([\d.]+)\)/g))
      assert.equal(match[1], match[2]);
    const pov = renderToStaticMarkup(
      createElement(BedroomPOV, {width: w, height: h, frame: 0, fps: 30, duration: 90}),
    );
    assert.doesNotMatch(pov, /preserveAspectRatio="none"/);
  }
});
test('bed-end figures follow set scale instead of foreground actor scale', () => {
  for (const [w, h] of [
    [1080, 1920],
    [1920, 1080],
  ]) {
    const actor = {type: 'ghost', ghostVariant: 'seatedPair', scale: 1.8} as const;
    const base = layoutActor(actor, 0.5, w, h);
    const placed = bedEndPlacement(base, actor, h, bedroomPOVAt(0, 30, 90));
    assert.ok(placed.scale <= (h / 1920) * 1.8 * 0.51);
  }
});
test('point keeps a visibly bent elbow while the forearm points outward', () => {
  for (const frame of [0, 30, 60]) {
    const pose = samplePose('point', frame, 30);
    assert.ok(Math.abs(pose.lowerArmR) >= 30);
    assert.ok(pose.upperArmR + pose.lowerArmR < -65);
    assert.ok(pose.upperArmR + pose.lowerArmR > -110);
  }
});

test('exterior people fit one floor and stand within the path in both layouts', async () => {
  const {exteriorPlacement, exteriorScale} =
    await import('../src/assets/backgrounds/OldHouseExterior');
  for (const [w, h] of [
    [1080, 1920],
    [1920, 1080],
  ]) {
    const actor = {type: 'narrator', scale: 0.8} as const;
    for (const x of [0.3, 0.55, 0.66]) {
      const placed = exteriorPlacement(layoutActor(actor, x, w, h), actor, w, h);
      assert.ok((430 * placed.scale) / (200 * exteriorScale(w, h)) < 0.5);
      assert.ok(placed.x > w * 0.4 && placed.x < w * 0.6);
      assert.equal(placed.y, h * 0.84);
    }
  }
});
test('ghost silhouettes keep the requested eerie poses and connected seated figures', () => {
  const seated = renderToStaticMarkup(
    createElement(Ghost, {x: 540, y: 1056, variant: 'seatedPair'}),
  );
  assert.equal((seated.match(/data-connected-seated/g) ?? []).length, 2);

  const woman = renderToStaticMarkup(
    createElement(Ghost, {x: 540, y: 1056, variant: 'womanBlack'}),
  );
  assert.match(woman, /data-woman-pose="still-arms-down"/);
  assert.match(woman, /rotate\(11 0 -198\)/);

  const crawler = renderToStaticMarkup(createElement(Ghost, {x: 540, y: 1056, variant: 'crawler'}));
  assert.match(crawler, /data-crawler-face="nightmare"/);
  assert.doesNotMatch(crawler, /fill="#FFF3B0"/);
});
test('existing character and animal rigs can render as cutouts without Remotion hooks', () => {
  assert.doesNotThrow(() =>
    renderToStaticMarkup(createElement(CharacterArt, {x: 540, y: 1400, frame: 24, fps: 30})),
  );
  assert.doesNotThrow(() =>
    renderToStaticMarkup(createElement(CatArt, {x: 540, y: 1400, frame: 24, fps: 30})),
  );
  assert.doesNotThrow(() =>
    renderToStaticMarkup(createElement(DogArt, {x: 540, y: 1400, frame: 24, fps: 30})),
  );
});
test('lying hip moves down to floor contact while remaining below the cabinets', async () => {
  const {lieFloorAnchor, interiorPlacement} = await import('../src/assets/backgrounds/layout');
  for (const [w, h] of [
    [1080, 1920],
    [1920, 1080],
  ]) {
    const actor = {type: 'narrator', scale: 0.85, y: 0.84} as const;
    const base = interiorPlacement(layoutActor(actor, 0.5, w, h), actor, w, h);
    const floor = base.y;
    const hip = lieFloorAnchor(floor, base.scale, 1) - 185 * base.scale;
    assert.equal(lieFloorAnchor(floor, base.scale, 0), floor);
    assert.ok(Math.abs(hip + 58 * base.scale - floor) < 0.001);
    assert.ok(hip - 70 * base.scale > h * 0.71);
    assert.ok(hip + 70 * base.scale < h * 0.88);
  }
});
test('spiral footsteps track successive treads and appear over time', async () => {
  const {stairFootsteps} = await import('../src/assets/backgrounds/HouseInterior');
  assert.ok(stairFootsteps.length >= 12);
  for (const [w, h] of [
    [1080, 1920],
    [1920, 1080],
  ]) {
    const render = (t: number) =>
      renderToStaticMarkup(
        createElement(
          'svg',
          null,
          houseInterior({w, h, t, time: 'night', options: {variant: 'staircase'}} as Parameters<
            typeof houseInterior
          >[0]).mid,
        ),
      );
    assert.notEqual(render(0), render(2));
    assert.match(render(2), /data-view="spiral-top-down"/);
    assert.equal((render(2).match(/data-footstep-shadow/g) ?? []).length, stairFootsteps.length);
  }
});
