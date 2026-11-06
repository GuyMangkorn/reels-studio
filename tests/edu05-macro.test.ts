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
