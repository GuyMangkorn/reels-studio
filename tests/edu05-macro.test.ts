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
