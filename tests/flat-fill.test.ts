// test-scope: shared
import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {flatFills, isConvex} from '../src/painted/flatFill';

test('isConvex accepts convex outlines either way round and rejects concave and double-wound ones', () => {
  const quad = [[0, 0], [10, 0], [10, 10], [0, 10]];
  assert.equal(isConvex(quad), true);
  assert.equal(isConvex([...quad].reverse()), true);
  assert.equal(isConvex([[0, 0], [10, 0], [5, 2], [10, 10], [0, 10]]), false);
  const star = Array.from({length: 5}, (_, i) => [Math.cos((i * 4 * Math.PI) / 5), Math.sin((i * 4 * Math.PI) / 5)]);
  assert.equal(isConvex(star), false);
});

/** A brush and a WebGL context that only record what reaches them. */
const rig = () => {
  const log: string[] = [];
  const names = ['push', 'pop', 'translate', 'scale', 'rotate', 'wash', 'noWash', 'fill', 'noFill', 'noStroke', 'noHatch', 'noMass', 'set', 'polygon', 'spline', 'render', 'clear'];
  const base = Object.fromEntries(names.map((n) => [n, () => { if (['polygon', 'spline', 'render'].includes(n)) log.push(n); }])) as Record<string, unknown>;
  base.getAngleMode = () => 'degrees';
  base.Color = class { _array = [1, 0, 0, 1]; };
  const uploads: Float32Array[] = [];
  const gl = new Proxy({} as Record<string, unknown>, {get: (_t, k) => {
    if (k === 'drawingBufferWidth' || k === 'drawingBufferHeight') return 100;
    if (k === 'getContextAttributes') return () => ({stencil: true});
    if (k === 'getProgramParameter') return () => true;
    if (k === 'isEnabled') return () => false;
    if (k === 'drawArrays') return (_mode: number, _first: number, count: number) => log.push(`draw ${count}`);
    if (k === 'bufferData') return (_t2: number, d: Float32Array) => uploads.push(d.slice());
    return typeof k === 'string' && /^[A-Z_0-9]+$/.test(k) ? 0 : () => ({});
  }});
  const canvas = {getContext: () => gl} as unknown as HTMLCanvasElement;
  const {brush, stats} = flatFills(base as unknown as Brush, () => canvas);
  const b = brush as unknown as Record<string, (...a: unknown[]) => void>;
  for (const n of ['noFill', 'noStroke', 'noHatch', 'noMass']) b[n]();
  return {b, log, uploads, stats};
};
const quad = [[0, 0], [10, 0], [10, 10], [0, 10]];

test('opaque washes are drawn in one call, after earlier library marks and before later ones', () => {
  const {b, log, stats} = rig();
  b.spline([[0, 0], [5, 5]], 0.1);
  b.wash('#ff0000', 255); b.polygon(quad); b.noWash();
  b.wash('#00ff00', 255); b.polygon(quad); b.noWash();
  b.spline([[0, 0], [5, 5]], 0.1);
  b.render();
  // two quads x 4 fan triangles x 3 vertices x 4 samples; the first render composites the first line under the fills
  assert.deepEqual(log, ['spline', 'render', 'draw 96', 'spline', 'render']);
  assert.deepEqual(stats(), {flat: 2, stencil: 0, draws: 1, flushes: 1});
});

test('a wash under 255, a stroked polygon and a non-convex polygon keep their library or stencil path', () => {
  const {b, log, stats} = rig();
  b.wash('#ff0000', 200); b.polygon(quad);
  b.wash('#ff0000', 255); b.set('rotring', '#000', 1); b.polygon(quad);
  assert.deepEqual(log, ['polygon', 'polygon']);
  b.noStroke();
  b.polygon([[0, 0], [10, 0], [5, 2], [10, 10], [0, 10]]);
  b.render();
  // stencil then cover, four samples: 5 fan triangles x 3 vertices, eight draws
  assert.deepEqual(log.slice(2), ['render', ...Array(8).fill('draw 15'), 'render']);
  assert.equal(stats().stencil, 1);
});

test('the queue uses the mirrored transform, restored by pop', () => {
  const {b, uploads} = rig();
  b.push(); b.translate(-50, -50); b.scale(2);
  b.wash('#ff0000', 255); b.polygon(quad);
  b.pop();
  b.wash('#ff0000', 255); b.polygon(quad);
  b.render();
  // vertex 1 of the first fan triangle is the polygon's first point plus the first sample offset (0.125, 0.375)
  const d = uploads[0];
  assert.deepEqual([d[5], d[6]], [0.125, 0.375]);
  // the second polygon (after pop: identity, origin at the canvas centre) starts 48 vertices later
  assert.deepEqual([d[48 * 5 + 5], d[48 * 5 + 6]], [50.125, 50.375]);
});
