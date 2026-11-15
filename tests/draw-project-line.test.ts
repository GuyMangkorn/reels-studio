import assert from 'node:assert/strict';
import {test} from 'node:test';
import {projectLine, projectPoly} from '../src/painted/kit/draw';
import {NEAR, type Proj, type V3} from '../src/painted/kit/space';

// Looking +z from the origin: depth is z, 100 px per metre at 1 m.
const proj: Proj = {
  P: ([x, y, z]) => [x * 100 / Math.max(z, NEAR), -y * 100 / Math.max(z, NEAR)],
  depth: (v) => Math.max(v[2], NEAR),
  rawDepth: (v) => v[2],
  k: (v) => 100 / Math.max(v[2], NEAR),
  right: [1, 0, 0],
  eye: [0, 0, 0],
};

test('projectLine projects a two-point line in front of the camera', () => {
  assert.deepEqual(projectLine(proj, [-1, 0, 2], [1, 0, 2]), [[-50, -0], [50, -0]]);
});

test('projectLine clips the end behind the near plane and drops a line fully behind it', () => {
  const a: V3 = [0, 1, 1], b: V3 = [0, 1, -1];
  const [p0, p1] = projectLine(proj, a, b);
  assert.deepEqual(p0, [0, -100]);
  assert.ok(Math.abs(p1[1] + 100 / NEAR) < 1e-6, 'the clipped end sits on the near plane');
  assert.ok(Math.abs(projectLine(proj, b, a)[0][1] - p1[1]) < 1e-6, 'the same cut from either end');
  assert.deepEqual(projectLine(proj, [0, 0, -1], [1, 0, -2]), []);
});

test('projectPoly throws on fewer than three points instead of returning nothing', () => {
  assert.throws(() => projectPoly(proj, [[-1, 0, 2], [1, 0, 2]]), /projectLine/);
  assert.equal(projectPoly(proj, [[-1, 0, 2], [1, 0, 2], [0, 1, 2]]).length, 3);
});
