import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {makePainter} from '../src/painted/kit/painter';
import {gProject, gShotCam, G_ANCHORS, lodAlpha} from '../src/painted/edu17/geo';
import {fillKey, fillModel, nonCount, phiAt} from '../src/painted/edu17/fill';
import {bandShade, dotMix, globeMix, paintMapPlate, plateFor, REGION_COL} from '../src/painted/edu17/mapdraw';
import {LOOK_COL, paintFill} from '../src/painted/edu17/look-a-map';

// EDU-EP17 group 3 (Boss, 2026-11-12): N3 map plate in the look palette, N4 fill layer, band shade, layer switches and polygon budgets. Pixel evidence: out/edu17/g3/.
type Poly = {color: string; alpha: number; n: number};
const recording = () => {
  const polys: Poly[] = [];
  let cur = '', alpha = 0;
  const brush = new Proxy({}, {get: (_t, k) => (...a: unknown[]) => { if (k === 'wash') { cur = a[0] as string; alpha = a[1] as number; } if (k === 'polygon') polys.push({color: cur, alpha, n: (a[0] as unknown[]).length}); }}) as unknown as Brush;
  return {painter: () => makePainter(brush, {t: 0, frame: 0}), polys};
};
const near = (a: number, b: number, tol: number, msg: string) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b} (tol ${tol})`);
const plate = (shot: string, f: number, o: Record<string, unknown> = {}) => { const r = recording(); paintMapPlate(r.painter(), gShotCam(shot, f), {...plateFor(shot, f), ...o}); return r.polys; };

test('N3: the plate paints in the look palette (the K02 frame is the LF01A street/stand colours, the Gulf and the stage the LF01B ones)', () => {
  const k = plate('S01-B01-SH01', 0), colors = new Set(k.map((q) => q.color));
  for (const c of [LOOK_COL.street, LOOK_COL.concrete, LOOK_COL.track, LOOK_COL.turf, LOOK_COL.crowd]) assert.ok(colors.has(c), `K02 frame has ${c}`);
  assert.ok(!colors.has('#3f7fae') && !colors.has('#c6c19b'), 'no BLOCKOUT colour left');
  const m = new Set(plate('S01-B02-SH01', 55).map((q) => q.color));
  for (const c of [LOOK_COL.gulf, LOOK_COL.rice, LOOK_COL.crowd, LOOK_COL.border, LOOK_COL.river]) assert.ok(m.has(c), `metro frame has ${c}`);
  const t = new Set(plate('S01-B02-SH03', 81).map((q) => q.color));
  for (const c of [LOOK_COL.gulf, REGION_COL.neighbour, REGION_COL.thailand, LOOK_COL.crowd]) assert.ok(t.has(c), `Thailand frame has ${c}`);
});

test('N3 layer switches: L3 alone below h 2 km, no metro under it; metro from h 2; the globe only from h 1,000 km, alone from 2,000', () => {
  const l3 = new Set(plate('S01-B01-SH01', 0).map((q) => q.color));
  assert.ok(!l3.has(LOOK_COL.rice) && !l3.has(LOOK_COL.gulf), 'L3 frame carries no L2 colours');
  const rise = new Set(plate('S01-B01-SH01', 30).map((q) => q.color)); // h about 3 km
  assert.ok(rise.has(LOOK_COL.street) && rise.has(LOOK_COL.rice), 'L3 over L2 in the cross-fade');
  assert.ok(!new Set(plate('S01-B02-SH01', 55).map((q) => q.color)).has(LOOK_COL.space0), 'no space at h 75');
  assert.equal(globeMix(1000), 0); assert.equal(globeMix(2000), 1); assert.ok(globeMix(1400) > 0 && globeMix(1400) < 1);
  const g = new Set(plate('S01-B05-SH01', 170).map((q) => q.color));
  assert.ok(g.has(LOOK_COL.space0) && g.has(LOOK_COL.ocean) && g.has(LOOK_COL.dot), 'globe, space and the canvas dot');
  assert.ok(!g.has(REGION_COL.thailand), 'the regional base is gone from h 2,000');
  assert.ok(lodAlpha(2000).l1 === 0 && lodAlpha(1000).l2 === 0);
});

test('N3: the dot is painted in the canvas, 18 px with a rim and a pulse ring, at the MC anchor; dotMix rises over h 2,400-6,400', () => {
  const r = recording(), cam = gShotCam('S01-B05-SH01', 170);
  paintMapPlate(r.painter(), cam, {...plateFor('S01-B05-SH01', 170), t: 1});
  assert.ok(r.polys.filter((q) => q.color === LOOK_COL.dot).length >= 1);
  assert.equal(dotMix(2400), 0); assert.equal(dotMix(6400), 1); assert.ok(dotMix(4000) > 0.2 && dotMix(4000) < 0.8);
  const d = gProject(cam, G_ANCHORS.MC.lat, G_ANCHORS.MC.lon);
  near(d.x, 540, 40, 'dot x'); near(d.y, 960, 80, 'dot y');
});

test('N3 band shade: none at the K02 frame (LF01A measured without it), 0.9 from h 1.4 km, 0.50 at h 80, 0.40 settled over the Gulf shots, fading under the globe', () => {
  assert.equal(bandShade(0.58), 0);
  near(bandShade(1.4), 0.9, 1e-9, 'h 1.4'); near(bandShade(12), 0.9, 1e-9, 'h 12'); near(bandShade(80), 0.5, 1e-9, 'h 80');
  assert.equal(plateFor('S01-B01-SH03', 40).shade, 0.4); assert.equal(plateFor('S01-B02-SH01', 55).shade, 0.4);
  near(plateFor('S01-B01-SH03', 0).shade!, 0.5, 1e-9, 'shot 3 starts where shot 1 ends'); near(plateFor('S01-B02-SH02', 48).shade!, 0.6, 1e-6, 'shot 7 end');
  near(plateFor('S01-B02-SH03', 0).shade!, plateFor('S01-B02-SH02', 48).shade!, 1e-9, 'shade'); // shot 8 continues shot 7's camera
});

test('N4 phi per shot: SH01 end 0.03, SH03 end 0.30, SH07 +48 1.00 and the stream stops; SH16 and the rest of the chain carry 1.00', () => {
  near(plateFor('S01-B01-SH01', 68).phi!, 0.03, 0.001, 'SH01 end'); near(plateFor('S01-B01-SH03', 77).phi!, 0.3, 0.001, 'SH03 end');
  assert.equal(plateFor('S01-B02-SH02', 48).phi, 1); assert.equal(plateFor('S01-B02-SH02', 48).streams, 0); assert.ok(plateFor('S01-B02-SH02', 10).streams! > 0.3);
  assert.equal(phiAt('S01-B02-SH02', 48), 1);
  for (const s of ['S01-B02-SH03', 'S01-B03-SH01', 'S01-B04-SH01', 'S01-B05-SH01']) assert.equal(plateFor(s, 0).phi, 1);
  const l3 = plateFor('S01-B04-SH01', 47).l3!;
  assert.equal(l3.standsFull, 1); assert.equal(l3.solid, 1);
});

test('N4: fill order key puts the river and highway fingers ahead, area clock exact (2,050 km2, Nonthaburi 76.0 %)', () => {
  const m = fillModel();
  near(fillKey(10, 0.2), 10 - 4, 1e-9, 'lead capped at 4 km'); near(fillKey(1, 0.2), 1 - 0.78, 1e-9, 'lead 0.58 m + 0.2'); assert.equal(fillKey(10, 0.6), 10);
  const nF = nonCount(1);
  near(nF / m.cells.length, 0.76, 0.006, 'Nonthaburi share at the stop');
  near(m.bangkokKm2 + nF * m.cellKm2, 2050, m.cellKm2, 'total area');
  const fingers = m.cells.slice(0, nF).filter((c) => c.finger < 0.45).length / m.cells.slice(0, nF).length;
  assert.ok(fingers > 0.1 && fingers < 0.5, `finger cells among the filled ${fingers.toFixed(2)}`);
});

test('N4 paintFill: Bangkok by khet then Nonthaburi runs, flecks only on filled crowd; phi 0 paints nothing', () => {
  const run = (phi: number) => { const r = recording(); paintFill(r.painter(), gShotCam('S01-B02-SH01', 55), phi); return r.polys; };
  assert.equal(run(0).length, 0);
  const full = run(1), crowd = full.filter((q) => q.color === LOOK_COL.crowd), flecks = full.filter((q) => LOOK_COL.flecks.includes(q.color));
  assert.ok(crowd.length > 20 && crowd.length < 600, `fill polygons ${crowd.length} (rows merged, not one per cell)`);
  assert.ok(flecks.length > 800, `${flecks.length} flecks`);
  const half = run(0.4).filter((q) => LOOK_COL.flecks.includes(q.color)).length;
  assert.ok(half < flecks.length * 0.8 && half > 50, 'flecks follow the fill');
});

test('polygon budgets at full size (colour-batched: about 60 colour changes a frame, so about 0.04 ms a polygon; measured paint <= 1.0 s at 12,000-19,000): K02 frame, the rise (size cull) and the metro shots', () => {
  const n = (shot: string, f: number) => plate(shot, f).length;
  const k02 = n('S01-B01-SH01', 0), rise = n('S01-B01-SH01', 30), l3mid = n('S01-B01-SH01', 22);
  assert.ok(k02 < 20000, `K02 frame ${k02} polygons`);
  assert.ok(l3mid < k02, `rise frame ${l3mid} against ${k02}: the size cull`);
  assert.ok(rise < 20000, `h 3 km ${rise}`);
  for (const [s, f] of [['S01-B01-SH03', 43], ['S01-B02-SH01', 55], ['S01-B02-SH02', 48], ['S01-B02-SH03', 43], ['S01-B03-SH01', 39], ['S01-B05-SH01', 170]] as const) assert.ok(n(s, f) < 20000, `${s} +${f}: ${n(s, f)}`);
});

// ---- fix pass B (mid-rise map look, B-MR1 to B-MR4) ----------------------------------------------------------------------------
import {builtShare, builtUpAlpha, isBuilt} from '../src/painted/edu17/builtup';
import {MAP_LANDUSE} from '../src/painted/edu17/map';

test('B-MR1: built-up weight is 0 at the K02 frame, 1 over h 3.2-30 km and 0 from h 60 (frames h >= 72 and h <= 2 do not change)', () => {
  assert.equal(builtUpAlpha(0.58), 0); assert.equal(builtUpAlpha(2), 0); assert.equal(builtUpAlpha(72), 0); assert.equal(builtUpAlpha(80), 0);
  for (const h of [3.2, 6, 14, 30]) assert.equal(builtUpAlpha(h), 1, `h ${h}`);
  assert.ok(builtUpAlpha(2.6) > 0 && builtUpAlpha(2.6) < 1 && builtUpAlpha(44) > 0 && builtUpAlpha(44) < 1);
});

test('B-MR1: the baked OSM land use covers central Bangkok and Nonthaburi, not the Gulf', () => {
  assert.ok(MAP_LANDUSE.rings.length > 3000 && MAP_LANDUSE.builtUpKm2 > 400);
  const km2 = builtShare(); assert.ok(km2 > 800 && km2 < 1200, `raster built-up (land use + fallback districts) ${km2.toFixed(0)} km2`);
  assert.ok(isBuilt(13.76, 100.55) || isBuilt(13.75, 100.58) || isBuilt(13.80, 100.56), 'inner Bangkok has built-up cells');
  assert.ok(!isBuilt(13.45, 100.40), 'the Gulf is not built-up');
});

test('B-MR2: L3 is gone by h 5 km, the grain and tone are in by h 3.2 km (no frame is the block grid alone)', () => {
  assert.equal(lodAlpha(2).l3, 1); assert.equal(lodAlpha(5).l3, 0);
  for (let h = 2; h <= 5; h *= 1.05) assert.ok(lodAlpha(h).l3 + builtUpAlpha(h) >= 0.99 || builtUpAlpha(h) > 0, `h ${h.toFixed(2)}`);
});

test('B-MR3/B-MR4: from h 2 to 60 km the plate carries stream ribbons and the skeleton on every shot-1 and shot-16 frame', () => {
  for (const [shot, frames] of [['S01-B01-SH01', [25, 30, 35, 41, 45, 51]], ['S01-B04-SH01', [12, 15, 20, 25, 30]]] as const) for (const f of frames) {
    const polys = plate(shot, f), colors = new Set(polys.map((q) => q.color));
    assert.ok(colors.has(LOOK_COL.crowd) || colors.has(LOOK_COL.crowdLit), `${shot} +${f}: stream ribbons`);
    assert.ok(polys.filter((q) => q.color === LOOK_COL.flecks[0]).length > 5, `${shot} +${f}: stream flecks`);
    if (gShotCam(shot, f).h > 6) assert.ok(colors.has(LOOK_COL.river) || colors.has('#2c261c'), `${shot} +${f}: the river`);
  }
});
