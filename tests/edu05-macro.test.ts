import {test} from 'node:test';
import assert from 'node:assert/strict';
import {camOf, MACRO_CAMS} from '../src/painted/edu05/cams';
import {bendLine, bladeLine, MAX_BEND, tipDeflection, type Blade} from '../src/painted/edu05/macro';
import {camPoint} from '../src/painted/kit/ycam';
import type {V3} from '../src/painted/kit/space';

// N1 (EDU-EP05 W5.2) spike 1: under each sheet camera move the blades slide in parallax (a near and a far blade on the same line of
// sight at the start end up a clear distance apart), and the breeze bend never exceeds 25% of the blade height.

test('parallax: near and far blades separate under every macro camera move', () => {
  const rows: string[] = [];
  for (const [id, m] of Object.entries(MACRO_CAMS)) {
    const c0 = camOf(m, 0), c1 = camOf(m, 1), sy = Math.sin(c0.yaw), cy = Math.cos(c0.yaw);
    // two ground points on the start camera's optical axis, 0.5x and 2x the shot radius ahead
    const pt = (d: number): V3 => [c0.x + sy * d, 0.3, c0.z - cy * d];
    const near = pt(m.r[0] * 0.5), far = pt(m.r[0] * 2.0);
    const p0n = camPoint(c0, near), p0f = camPoint(c0, far), p1n = camPoint(c1, near), p1f = camPoint(c1, far);
    assert.ok(p0n && p0f && p1n && p1f, id);
    const dn = Math.hypot(p1n[0] - p0n[0], p1n[1] - p0n[1]), df = Math.hypot(p1f[0] - p0f[0], p1f[1] - p0f[1]);
    const rel = Math.hypot(p1n[0] - p1f[0], p1n[1] - p1f[1]);
    rows.push(`${id} near ${dn.toFixed(0)} px far ${df.toFixed(0)} px apart-at-end ${rel.toFixed(0)} px`);
    assert.ok(dn > df * 1.2 && rel > 25, `${id}: no parallax (${rows.at(-1)})`);
  }
  console.log(rows.join('\n'));
});

test('breeze bend: tip deflection is clamped to 25% of the height and the root stays planted', () => {
  const b: Blade = {root: [0, 0, 0], h: 24, w: 1.2, dir: [0, 1], lean: 6, curl: 14, pal: {base: '', body: '', edge: '', vein: ''}, seed: 1};
  const base = bladeLine(b, 0);
  for (const amt of [0.1, 0.25, 0.6]) {
    const bent = bendLine(base, b.h, {dir: [0, -1], amt});
    assert.deepEqual(bent[0], base[0]);
    const d = tipDeflection(base, bent);
    assert.ok(d <= MAX_BEND + 0.02, `amt ${amt} deflected ${d}`);
    if (amt <= MAX_BEND) assert.ok(d > amt * 0.6, `amt ${amt} too small ${d}`);
    // length kept within 3%
    const len = (l: V3[]) => l.slice(1).reduce((s, v, i) => s + Math.hypot(v[0] - l[i][0], v[1] - l[i][1], v[2] - l[i][2]), 0);
    assert.ok(Math.abs(len(bent) / len(base) - 1) < 0.03);
  }
});

// N4 (EDU-EP05 W5.2) spike 3: the dew drop's contact states keep their volume (area within +-10% of rest), stay under 1.0x TINY's
// height, keep the foot on the blade (contact patch inside the rest patch + 0.1 sm), the neck never passes 0.5 sm, and the
// hand-inside layering has a wrist while the hand is in.
import {areaOf, dropGeometry, dropStateFor, footRange, MAX_NECK, neckLength, REST_AREA} from '../src/painted/edu05/drop';
import {dropShape} from '../src/painted/edu05/macro';

test('dew drop states: area, height, foot, neck length across the sheet timelines', () => {
  const rest = footRange(dropShape(72));
  let worstArea = 0, worstNeck = 0, worstFoot = 0, topMax = 0, n = 0;
  const frames: [string, number][] = [['S01-B03-SH02', 87], ['S01-B03-SH03', 119], ['S01-B03-SH04', 133]];
  for (const [shot, len] of frames) {
    for (let L = 0; L < len; L++) {
      const st = dropStateFor(shot, L)!, g = dropGeometry(st);
      const a = areaOf(g.outline.slice(0, -1)) / REST_AREA - 1, f = footRange(g.outline);
      worstArea = Math.max(worstArea, Math.abs(a));
      worstNeck = Math.max(worstNeck, neckLength(st));
      worstFoot = Math.max(worstFoot, rest[0] - f[0], f[1] - rest[1]);
      assert.ok(Math.min(...g.outline.map(([, y]) => y)) > -0.03, `${shot} L${L} dips below the blade`);
      topMax = Math.max(topMax, ...g.outline.map(([, y]) => y));
      n++;
      assert.ok(Math.abs(a) <= 0.1, `${shot} L${L} area ${a}`);
      if (st.push > 0.05) assert.ok(g.wrist, `${shot} L${L} no wrist`);
    }
  }
  console.log(`drop ${n} frames: worst area ${(worstArea * 100).toFixed(1)}%, neck ${worstNeck.toFixed(3)} sm, foot slip ${worstFoot.toFixed(3)} sm, top ${topMax.toFixed(2)} sm (TINY 1.58)`);
  assert.ok(worstNeck <= MAX_NECK + 0.06, `neck ${worstNeck}`);
  assert.ok(worstFoot <= 0.1, `foot ${worstFoot}`);
  assert.ok(topMax < 1.58);
});

// N6 (EDU-EP05 W5.2) spike 6: tripod gait, 24 f at each sheet speed: six feet plant without sliding, always >= 3 feet down, the leaf
// stays upright (sway <= 4 deg).
import {ANT_SPEED, antFoot, antWalk, GAIT} from '../src/painted/edu05/ant';

test('ant-walk: planted feet do not slide, three feet always down, leaf sway <= 4 deg', () => {
  for (const [shot, v] of Object.entries(ANT_SPEED)) {
    let worstSlide = 0, minDown = 6, maxSway = 0;
    const stance: Record<string, number[]> = {};
    for (let f = 0; f <= 24; f++) {
      const w = antWalk(v * f);
      maxSway = Math.max(maxSway, Math.abs(w.sway));
      let down = 0;
      for (const set of [0, 1] as const) {
        const ft = antFoot(w.walk, set);
        // three feet per tripod: the ones of a set move together, so one probe per set per leg offset is the same series
        if (ft.planted) { down += 3; (stance[`${set}`] ??= []).push(v * f + ft.dx); } else if (stance[`${set}`]?.length) { /* stance run ends */ }
      }
      minDown = Math.min(minDown, down);
    }
    // world x of a foot while planted must be constant within one stance run: split runs where the set was off the ground
    for (const set of [0, 1] as const) {
      let run: number[] = [], prev = true;
      for (let f = 0; f <= 24; f++) {
        const ft = antFoot(antWalk(v * f).walk, set), wx = v * f + ft.dx;
        if (ft.planted) { if (!prev) run = []; run.push(wx); prev = true; } else prev = false;
        if (run.length > 1) worstSlide = Math.max(worstSlide, Math.max(...run) - Math.min(...run));
      }
    }
    console.log(`ant ${shot} ${v} sm/f: worst planted slide ${worstSlide.toExponential(1)} sm, min feet down ${minDown}, max sway ${maxSway.toFixed(2)} deg, cycles in 24 f ${(24 * v / GAIT.cycle).toFixed(2)}`);
    assert.ok(worstSlide < 0.005, `${shot} slide ${worstSlide}`);
    assert.ok(minDown >= 3);
    assert.ok(maxSway <= 4, `${shot} sway ${maxSway}`);
  }
});

// N7/N8/N5/N9 (EDU-EP05 W5.2): pop timing and cut match, puff emitter, crumb grips, bar heights and boxes.
import {barsAt, BARS, crumbGrips, popCutDelta, popPeak, puffsOf, shrinkScale} from '../src/painted/edu05/effects';
import {orbitYCam} from '../src/painted/kit/ycam';

test('shrink-pop: 8 f ease-in to ~0, peak on the cut, puff centres within 40 px across the cut', () => {
  assert.equal(shrinkScale(55), 1);
  assert.ok(shrinkScale(63) < 0.01 && shrinkScale(59) < 0.9 && shrinkScale(59) > 0.1);
  assert.ok(popPeak(71) === 1 && popPeak(58) === 0);
  const d = popCutDelta([554, 732], [540, 762]);
  assert.ok(d <= 40, `cut delta ${d}`);
  console.log(`pop cut delta ${d.toFixed(1)} px (limit 40)`);
});

test('warmth puffs: drift away, fade in and out, the squeezed puff re-inflates', () => {
  const e = {anchor: [500, 600] as [number, number], r: 80, drift: [-120, -90] as [number, number], period: 0.5, life: 1.6, phase: 0, squeeze: true};
  let last = puffsOf(e, 2.0);
  assert.ok(last.length >= 3);
  for (const q of last) { assert.ok(q.a >= 0 && q.a <= 1); assert.ok(q.x <= 500 && q.y <= 600); }
  const young = puffsOf(e, 2.05).sort((a, b) => b.y - a.y)[0];
  assert.ok(young.rx < young.ry, 'squeezed when young');
});

test('breadcrumb grips are on opposite faces; scale-bars end heights and boxes', () => {
  const cam = {...orbitYCam([-2.4, 0.3, -0.6], 2.4, 0.3, 0.8, 1050, 780)};
  const g = crumbGrips(cam, [-2.4, 0, -0.6])!;
  assert.ok(g.r[0] - g.l[0] > 100 && Math.abs(g.r[1] - g.l[1]) < 1);
  const end = barsAt(150);
  assert.equal(Math.round(end.force), 216);
  assert.equal(Math.round(end.weight), 72);
  assert.equal(Math.round(barsAt(30).force), 480);
  assert.ok(end.force > end.weight * 2.9 && BARS.slots.force[1] === 900);
  assert.equal(Math.round(end.icon), 48);
});

// N3 (EDU-EP05 W5.2): the look-down camera and the facade-up camera reproduce the sheets' `meas`; N2/N10 drift motes stay under 40 px/s.
import {downVanish, lookDownCam, speckAt, speckCam} from '../src/painted/edu05/facade';
import {moteSpeedPx} from '../src/painted/edu05/effects';

test('look-down and speck cameras hit the sheet meas', () => {
  const near = (a: number[], b: number[], tol: number, what: string) => assert.ok(Math.hypot(a[0] - b[0], a[1] - b[1]) <= tol, `${what} ${a} vs ${b}`);
  near(downVanish(lookDownCam(0))!, [540, 963], 3, 'vanishing point');
  near(camPoint(lookDownCam(0), [-0.25, 1.12, 0])!, [908, 354], 4, 'mug start');
  near(camPoint(lookDownCam(1), [-0.25, 1.12, 0])!, [986, 225], 4, 'mug end');
  near(camPoint(speckCam(0), speckAt(0))!, [487, 764], 4, 'speck start');
  near(camPoint(speckCam(1), speckAt(1))!, [490, 703], 4, 'speck end');
  assert.ok(moteSpeedPx(438) <= 27 && moteSpeedPx(180) <= 27, 'motes under 40 px/s at her depth (692 px / 1.58 sm = 438 px/sm)');
});
