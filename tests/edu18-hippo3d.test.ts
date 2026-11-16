import {test} from 'node:test';
import assert from 'node:assert/strict';
import {apply, buildHippo3D, H3_TIP, HIPPO3D_GAPE, HIPPO3D_POSES, HIPPO3D_WATER, skinVerts} from '../src/painted/edu18/hippo3d-sdf';

// AS-HIPPO3D-SPIKE (EDU-EP18 three.js hippo spike): brief sizes and frame purity of the marching-cubes skin.
const ext = (v: number[][], i: number) => [Math.min(...v.map((p) => p[i])), Math.max(...v.map((p) => p[i]))];

test('hippo3d stand matches the brief sizes (3.6 m body, 1.5 m shoulder, ~0.7 m head width)', () => {
  const M = buildHippo3D(HIPPO3D_POSES.stand(), {res: 72}), v = skinVerts(M);
  const body = v.filter((p) => Math.abs(p[2]) > 0.1);   // the tail stub sits on the midline
  const [x0, x1] = ext(body, 0), len = x1 - x0;
  assert.ok(Math.abs(len - 3.6) < 0.1, `length ${len.toFixed(2)}`);
  const sh = Math.max(...v.filter((p) => p[0] > 0.2 && p[0] < 0.8).map((p) => p[1]));
  assert.ok(Math.abs(sh - 1.5) < 0.08, `shoulder ${sh.toFixed(2)}`);
  assert.ok(ext(v, 1)[0] > -0.03, 'feet stand on the ground');
  const head = v.filter((p) => p[0] > 1.45), w = ext(head, 2)[1] - ext(head, 2)[0];
  assert.ok(Math.abs(w - 0.7) < 0.08, `muzzle width ${w.toFixed(2)}`);
});

test('hippo3d yawn peak: 140 deg gape, upper jaw tip ~1.4 m above the water', () => {
  const M = buildHippo3D(HIPPO3D_POSES.yawn(0.55), {res: 48});
  assert.ok(Math.abs(M.rig.gape - HIPPO3D_GAPE) < 0.02);
  const tip = apply(M.rig.head, H3_TIP)[1] - HIPPO3D_WATER;
  assert.ok(Math.abs(tip - 1.4) < 0.06, `tip ${tip.toFixed(2)}`);
});

test('hippo3d is a pure function of the pose (same pose twice = identical geometry)', () => {
  const P = HIPPO3D_POSES.charge(0.3), a = buildHippo3D(P, {res: 48}), b = buildHippo3D(HIPPO3D_POSES.charge(0.3), {res: 48});
  assert.equal(a.mc.count, b.mc.count);
  const pa = a.mc.geometry.getAttribute('position').array, pb = b.mc.geometry.getAttribute('position').array;
  for (let i = 0; i < a.mc.count * 3; i++) if (pa[i] !== pb[i]) assert.fail(`vertex component ${i} differs`);
  const ca = a.mc.geometry.getAttribute('color').array, cb = b.mc.geometry.getAttribute('color').array;
  for (let i = 0; i < a.mc.count * 3; i++) if (ca[i] !== cb[i]) assert.fail(`colour component ${i} differs`);
});
