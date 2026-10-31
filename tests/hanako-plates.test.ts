import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {makePainter} from '../src/painted/kit/painter';
import {knockPose, paintKnockHand, paintEdgeHand, folderHandTarget} from '../src/painted/hanako/assets';
import {hanakoCamera, replyLight, lampLevel, mapEvents} from '../src/painted/shots/hanako';

test('Hanako fist uses the kit returned anchor throughout contact, recovery and withdrawal', () => {
  const brush = new Proxy({}, {get: () => () => undefined}) as Brush;
  for (let f = 0; f < 50; f++) {
    const p = makePainter(brush, {t: f / 30, frame: f, fade: '#000000'});
    const actual = paintKnockHand(p, f)!;
    const target = knockPose(f).knuckles;
    assert.ok(Math.hypot(actual.knuckles[0] - target[0], actual.knuckles[1] - target[1]) < 1e-9);
  }
  for (const f of [4, 18, 31]) {
    assert.deepEqual(knockPose(f).knuckles, [660, 740]);
    assert.equal(knockPose(f).press, 1);
    assert.equal(hanakoCamera('B01-SH01', f).dy, 5);
    assert.equal(knockPose(f + 1).press, 0);
  }
  assert.equal(paintKnockHand(makePainter(brush, {t: 50 / 30, frame: 50, fade: '#000000'}), 50), undefined);
});

test('Hanako reply envelope has one peak at the locked reply onset and returns to cold', () => {
  const levels = Array.from({length: 139}, (_, f) => replyLight(304 + f));
  assert.equal(levels.indexOf(Math.max(...levels)) + 304, 417);
  assert.ok(levels.every((n) => n >= 0 && n <= .2));
  assert.ok(levels.slice(0, 111).every((n) => n === 0));
  assert.ok(levels.slice(131).every((n) => n === 0));
});


test('Hanako drawer/page pinch inverts the kit index anchor on both screen sides', () => {
  const brush = new Proxy({}, {get: () => () => undefined}) as Brush;
  const p = makePainter(brush, {t: 0, frame: 0});
  for (const side of [-1,1] as const) for (const size of [.56,.84]) {
    const target: [number,number] = [side === 1 ? 818 : 420,530];
    const h = paintEdgeHand(p,target,side,size,900);
    assert.ok(h.indexTip && Math.hypot(h.indexTip[0]-target[0],h.indexTip[1]-target[1]) < 1e-9);
  }
});
test('Hanako dead stop holds camera and removes the hand; map and lamp events use voice-lock frames', () => {
  const stop=hanakoCamera('B05-SH02',111);
  assert.equal(stop.s,1.18);
  for(let f=111;f<156;f++) {assert.deepEqual(hanakoCamera('B05-SH02',f),stop); assert.equal(folderHandTarget(f),undefined);}
  assert.equal(mapEvents(1255).pin,false); assert.equal(mapEvents(1264).pinDy,0);
  assert.ok(mapEvents(1265).ringOpacity > 0); assert.equal(mapEvents(1276).ringOpacity,0);
  assert.equal(mapEvents(1296).callout,0); assert.equal(mapEvents(1304).callout,1);
  assert.equal(lampLevel(1429),0); assert.equal(lampLevel(1460),.3);
  for(let F=1349;F<1588;F++) assert.ok(lampLevel(F)>=0 && lampLevel(F)<=.3);
});

// G3 protects the loop contact, event ordering and caption-safe pop geometry.
import {endingHandPose} from '../src/painted/hanako/assets';
import {endingLight, HANAKO_SPECS} from '../src/painted/shots/hanako';
import {mapDots, generationGroups} from '../src/painted/hanako/generations';
import {toScreen} from '../src/painted/kit/camera';
test('Hanako ending holds the same kit hand and camera as the loop landing',()=>{
  assert.equal(endingHandPose(2481),undefined);
  assert.deepEqual(endingHandPose(2482)?.knuckles,[1320,1376]);
  for(let F=2506;F<=2595;F++) {
    assert.deepEqual(endingHandPose(F),knockPose(0));
    assert.deepEqual(hanakoCamera('B09-SH01',F-2302),hanakoCamera('B01-SH01',0));
  }
  assert.deepEqual(endingLight(2322),{glow:0,dip:0,amber:.25});
  assert.deepEqual(endingLight(2347),{glow:.2,dip:.4,amber:.25});
  for(let F=2383;F<=2595;F++) {assert.equal(endingLight(F).glow,0);assert.equal(endingLight(F).dip,0);}
  assert.equal(endingLight(2595).amber,0);
  assert.equal(HANAKO_SPECS.at(-1)!.start+HANAKO_SPECS.at(-1)!.length,2596);
});
test('Hanako spread is scattered, separated and safe throughout the map push',()=>{
  assert.equal(mapDots.length,40);
  for(const p of mapDots) {
    assert.ok(Math.hypot(p[0]-680,p[1]-471)>30);
    for(let f=0;f<162;f++) assert.ok(toScreen(hanakoCamera('B07-SH02',f),p)[1]+8<=860);
  }
  const distances=mapDots.map(([x,y])=>Math.hypot(x-680,y-471));
  assert.ok(distances.some((d,i)=>i>0 && d<distances[i-1]));
  assert.ok(distances.some((d,i)=>i>0 && d>distances[i-1]));
  for(const g of generationGroups) {
    assert.ok(g.off-(g.on+12)>=6);
    for(const [,h] of g.members) assert.ok(h*227>=250);
  }
  assert.equal(generationGroups.at(-1)!.end,2301);
});

// Polish A (P01/P02): the brush-painted CH-KID and B08 silhouettes keep the measured envelopes (lead height, feet line).
import {paintKid, KIDS} from '../src/painted/hanako/assets';
import {paintKidSilhouette, SILHOUETTE_FEET_Y} from '../src/painted/hanako/generations';
const recordPoints = () => {
  const pts: Array<[number, number]> = [];
  const brush = new Proxy({}, {get: (_t, name) => (...args: unknown[]) => {
    if (name === 'polygon' || name === 'spline') pts.push(...(args[0] as Array<[number, number]>));
  }}) as Brush;
  return {brush, pts};
};
test('CH-KID keeps its crown-to-floor envelope (1.30 m / 1.25 m at 700 px/m) on the floor line', () => {
  for (const id of ['L', 'R'] as const) {
    const {brush, pts} = recordPoints();
    paintKid(makePainter(brush, {t: 0, frame: 0, fade: '#000000'}), id, 0, false);
    const ys = pts.map(([, y]) => y);
    const {height, foot} = KIDS[id];
    assert.equal(Math.min(...ys), foot[1] - height * 700);
    assert.equal(Math.max(...ys), foot[1]);
  }
});
test('B08 silhouettes stand on plate y 838 within their measured heights', () => {
  for (const height of [1.30 * 227, 1.20 * 227]) {
    const {brush, pts} = recordPoints();
    paintKidSilhouette(makePainter(brush, {t: 0, frame: 0, fade: '#000000'}), {x: 540, height, variant: 0, seed: 6000, shadow: false});
    const ys = pts.map(([, y]) => y);
    assert.ok(Math.abs(Math.max(...ys) - SILHOUETTE_FEET_Y) < 1e-6);
    assert.ok(Math.abs(Math.min(...ys) - (SILHOUETTE_FEET_Y - height)) < 2);
  }
});

// S1-R4 (Boss): B02 viewer's fist (VD29) and B03 FPOV-CHEST camera, tilt and arm/hand geometry (VD24–VD27).
import {fistKnuckles, paintFistB02, HANAKO_HAND_B02, handPolygons, cuffAt, ARM, TORSO, B03_TORSO_SCALE, B03_HEM_Y, paintFpovChest, fpovCamera, notebookTilt} from '../src/painted/hanako/plates-r4';
import {HANAKO_HAND} from '../src/painted/hanako/look';
import {capsule} from '../src/painted/kit/draw';
const capturePoints = (run: (p: ReturnType<typeof makePainter>) => void) => {
  const pts: Array<[number, number]> = [];
  const brush = new Proxy({}, {get: (_t, name) => (...args: unknown[]) => {
    if (name === 'polygon' || name === 'spline') pts.push(...(args[0] as Array<[number, number]>));
  }}) as Brush;
  run(makePainter(brush, {t: 0, frame: 0, fade: '#000000'}));
  return pts;
};
test('B02 viewer fist keeps the VD29 knuckle anchor, settle and flinch keys', () => {
  assert.deepEqual(fistKnuckles(0), [990, 745]);
  assert.deepEqual(fistKnuckles(105), [990, 751]);
  assert.deepEqual(fistKnuckles(113), [990, 751]);
  assert.deepEqual(fistKnuckles(117), [1000, 757]);
  assert.deepEqual(fistKnuckles(138), [1000, 757]);
  assert.ok(Math.hypot(10, 6) <= 12);
  for (let f = 1; f < 139; f++) assert.ok(fistKnuckles(f)[1] >= fistKnuckles(f - 1)[1]);
});
test('B02 fist and sleeve stay right of x 892 at every key (caption-safe box x 120–888)', () => {
  for (let f = 0; f < 139; f++) {
    const pts = capturePoints((p) => paintFistB02(p, f));
    assert.ok(pts.length > 0, `f${f} draws`);
    assert.ok(Math.min(...pts.map(([x]) => x)) >= 892, `f${f} left extent`);
  }
});
test('B02 fist wrist-side corner stays above y 850 at the preserved anchor and size', () => {
  let bottom = 0;
  for (let f = 0; f < 139; f++) {
    const pts = capturePoints((p) => paintFistB02(p, f));
    bottom = Math.max(bottom, ...pts.filter(([x]) => x > 888 && x < 1000).map(([, y]) => y));
  }
  assert.ok(bottom <= 850, `measured bottom ${bottom.toFixed(1)}`);
});
test('B02 dimmed hand tone is HANAKO_HAND blended 50% toward the dip colour (VD29 estimate)', () => {
  assert.equal(HANAKO_HAND_B02.skin, '#786758');
  assert.notEqual(HANAKO_HAND_B02.skin, HANAKO_HAND.skin);
});
test('B03 camera uses the VD27 push steps with no jump, focus (540, 620), and replaces the R3 default', () => {
  assert.ok(Math.abs(fpovCamera(0).s - 1) < 1e-9);
  assert.ok(Math.abs(fpovCamera(70).s - 1.04) < 1e-9);
  assert.ok(Math.abs(fpovCamera(85).s - 1.12) < 1e-9);
  assert.ok(Math.abs(fpovCamera(201).s - 1.14) < 0.002);
  for (let f = 1; f < 202; f++) assert.ok(Math.abs(fpovCamera(f).s - fpovCamera(f - 1).s) < 0.009, `f${f}`);
  for (const f of [0, 70, 85, 201]) assert.deepEqual([fpovCamera(f).fx, fpovCamera(f).fy], [540, 620]);
  assert.deepEqual(hanakoCamera('B03-SH01', 24), fpovCamera(24));
});
test('B03 notebook tilts 70 to 8 degrees over F467–F479 (f24–f36), monotonic', () => {
  assert.ok(Math.abs(notebookTilt(24) - (70 * Math.PI) / 180) < 1e-12);
  assert.ok(Math.abs(notebookTilt(36) - (8 * Math.PI) / 180) < 1e-12);
  for (let f = 1; f <= 36; f++) assert.ok(notebookTilt(f) <= notebookTilt(f - 1) + 1e-12);
});
test('B03 crop reaches frame top and hands and cuffs stay above the caption band at s 1.14', () => {
  assert.ok(Math.min(...TORSO.map(([, y]) => y)) < 0);
  const bottomAt114 = (y: number) => (y - 620) * 1.14 + 620;
  for (const side of [0, 1] as const) for (const poly of handPolygons(side)) for (const [, y] of poly) assert.ok(bottomAt114(y) < 860);
  const forearm = capsule(ARM.elbow, ARM.wrist, ARM.foreWidth[0], ARM.foreWidth[1]);
  for (const [, y] of [...forearm, ...cuffAt(ARM.elbow, ARM.wrist)]) assert.ok(bottomAt114(y) < 860);
  // User reference overrides CP-P02 for B03: arms are in front, with low outside elbows and a broad near cuff.
  for (const side of [0, 1] as const) assert.equal(handPolygons(side).length, 5); // palm plus four fingers
  const len = (a: number[], b: number[]) => Math.hypot(b[0] - a[0], b[1] - a[1]);
  assert.ok(len(ARM.elbow, ARM.wrist) < len(ARM.shoulder, ARM.elbow) / 2);
  assert.ok(ARM.foreWidth[1] > ARM.foreWidth[0]);
  assert.ok(ARM.elbow[1] - ARM.heel[1] >= 250);
  assert.ok(ARM.elbow[1] - ARM.wrist[1] >= 200);
  assert.deepEqual(ARM.shoulder, [110, 235]);
  assert.equal(B03_HEM_Y, 1180);
  assert.equal(Math.max(...TORSO.map(([, y]) => y)), B03_HEM_Y);
  const torsoUpperRatio = (B03_HEM_Y - ARM.shoulder[1]) / len(ARM.shoulder, ARM.elbow);
  assert.ok(torsoUpperRatio >= 1.6 && torsoUpperRatio <= 1.8);
  assert.ok(ARM.elbow[0] < 540 + (118 - 540) * B03_TORSO_SCALE && ARM.elbow[0] > ARM.shoulder[0]); // beside ribs, inside shoulder width
  assert.ok(len(ARM.heel, ARM.wrist) < ARM.heelRadius[0] + ARM.foreWidth[1]);
});

// Capture the actual sleeve polygons, including animated cuff/depth positions.
test('B03 sleeves stay inside shoulder width and the locked push crop', () => {
  const sleeveColors = new Set(['#1a232b', '#303b42', '#34434b', '#29363d', '#596e70', '#14232b', '#71817f']);
  for (let f = 0; f < 202; f++) {
    let color = '';
    const pts: Array<[number, number]> = [];
    const brush = new Proxy({}, {get: (_t, name) => (...args: unknown[]) => {
      if (name === 'fill') color = args[0] as string;
      if (name === 'polygon' && sleeveColors.has(color)) pts.push(...(args[0] as Array<[number, number]>));
    }}) as Brush;
    paintFpovChest(makePainter(brush, {t: f / 30, frame: f}), f);
    assert.ok(pts.length > 0);
    for (const [x] of pts) {
      assert.ok(x >= ARM.shoulder[0] - 15 && x <= 1080 - ARM.shoulder[0] + 15, `shoulder limit f${f} x${x}`);
      const screenX = (x - 540) * fpovCamera(f).s + 540;
      assert.ok(screenX >= 10 && screenX <= 1070, `frame-side clearance f${f} x${screenX}`);
    }
  }
});


test('B03 pass 7 narrows torso 14% and the actual upper sleeve 27%, with fixed grip anchors', () => {
  for (const [y, oldLeft] of [[450, 95], [818, 118], [930, 135]]) {
    const left = TORSO.find(([, py]) => py === y)![0];
    assert.ok(Math.abs((1080 - 2 * left) / (1080 - 2 * oldLeft) - 0.86) < 1e-9);
  }
  let color = '';
  const upper: Array<Array<[number, number]>> = [];
  const brush = new Proxy({}, {get: (_t, name) => (...args: unknown[]) => {
    if (name === 'fill') color = args[0] as string;
    if (name === 'polygon' && color === '#1a232b') upper.push(args[0] as Array<[number, number]>);
  }}) as Brush;
  paintFpovChest(makePainter(brush, {t: 85 / 30, frame: 85}), 85);
  const left = upper[0];
  const cross = (y: number) => left.flatMap(([x, py], i) => {
    const [bx, by] = left[(i + 1) % left.length];
    return py !== by && y >= Math.min(py, by) && y < Math.max(py, by) ? [x + (bx - x) * (y - py) / (by - py)] : [];
  });
  const xs = cross(450), oldWidth = 167 + (172 - 167) * 15 / 205 - 82;
  assert.ok(Math.abs((Math.max(...xs) - Math.min(...xs)) / oldWidth - 0.73) < 1e-9);
  assert.deepEqual(ARM.wrist, [195, 607]);
  assert.deepEqual(handPolygons(0)[0][0], [184, 600]);
});
