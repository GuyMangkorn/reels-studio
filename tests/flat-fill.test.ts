// test-scope: shared
import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {flatFills, inkRibbon, isConvex, ROTRING_TIP} from '../src/painted/flatFill';

test('isConvex accepts convex outlines either way round and rejects concave and double-wound ones', () => {
  const quad = [[0, 0], [10, 0], [10, 10], [0, 10]];
  assert.equal(isConvex(quad), true);
  assert.equal(isConvex([...quad].reverse()), true);
  assert.equal(isConvex([[0, 0], [10, 0], [5, 2], [10, 10], [0, 10]]), false);
  const star = Array.from({length: 5}, (_, i) => [Math.cos((i * 4 * Math.PI) / 5), Math.sin((i * 4 * Math.PI) / 5)]);
  assert.equal(isConvex(star), false);
});

/** A brush and a WebGL context that only record what reaches them. */
const rig = (opt: Parameters<typeof flatFills>[2] = {}) => {
  const log: string[] = [];
  const names = ['push', 'pop', 'translate', 'scale', 'rotate', 'wash', 'noWash', 'fill', 'noFill', 'noStroke', 'noHatch', 'noMass', 'set', 'pick', 'stroke', 'strokeWeight', 'seed', 'polygon', 'spline', 'render', 'clear'];
  const base = Object.fromEntries(names.map((n) => [n, () => { if (['polygon', 'spline', 'render', 'pick', 'set'].includes(n)) log.push(n); }])) as Record<string, unknown>;
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
  const {brush, stats, lines} = flatFills(base as unknown as Brush, () => canvas, opt);
  const b = brush as unknown as Record<string, (...a: unknown[]) => void>;
  for (const n of ['noFill', 'noStroke', 'noHatch', 'noMass']) b[n]();
  return {b, log, uploads, stats, lines};
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
  assert.deepEqual(stats(), {flat: 2, stencil: 0, draws: 1, flushes: 1, lines: 0});
});

test('a wash under 255, a stroked polygon and a non-convex polygon keep their library or stencil path', () => {
  const {b, log, stats} = rig();
  b.wash('#ff0000', 200); b.polygon(quad);
  b.wash('#ff0000', 255); b.set('rotring', '#000', 1); b.polygon(quad);
  assert.deepEqual(log, ['polygon', 'pick', 'polygon']); // the held-back stroke state reaches the library before it draws
  b.noStroke();
  b.polygon([[0, 0], [10, 0], [5, 2], [10, 10], [0, 10]]);
  b.render();
  // stencil then cover, four samples: 5 fan triangles x 3 vertices, eight draws
  assert.deepEqual(log.slice(3), ['render', ...Array(8).fill('draw 15'), 'render']);
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

const I = {a: 1, b: 0, c: 0, d: 1, x: 0, y: 0};
const span = (q: number[]) => Math.hypot(q[0] - q[6], q[1] - q[7]); // across the ribbon at a quad's start

test('inkRibbon: a hairline is one light quad per segment; a wide stroke is thicker at its ends, capped and deeper', () => {
  const thin = inkRibbon([[0, 0], [40, 0]], 0.15, I, [100, 100], 1, ROTRING_TIP, 7);
  assert.equal(thin.quads.length, 1);
  assert.ok(span(thin.quads[0]) > 0.6 && span(thin.quads[0]) < 1.6, `hairline width ${span(thin.quads[0])}`);
  assert.ok(thin.alpha < 1 && thin.deepen === 0);
  // device px: the origin is the canvas centre
  assert.ok(Math.abs(thin.quads[0][1] - 50) < 1.5 && thin.quads[0][0] === 50);

  const pts = Array.from({length: 21}, (_, i) => [i * 10, 0]);
  const wide = inkRibbon(pts, 0, I, [100, 100], 12, ROTRING_TIP, 7);
  assert.equal(wide.quads.length, 20 + 4); // body + two half-octagon caps
  const widths = wide.quads.slice(0, 20).map(span);
  assert.ok(Math.max(widths[0], widths[19]) > Math.min(...widths) * 1.3, 'pressure 1.3 at an end against 1 in the middle');
  assert.ok(Math.min(...widths) > 12 * ROTRING_TIP * 0.85 && Math.max(...widths) < 12 * (ROTRING_TIP * 1.69 + 0.2) * 1.15);
  assert.equal(wide.alpha, 1);
  assert.equal(wide.deepen, 1);
});

test('inkRibbon: a closed outline has no caps, rounds its corners, follows the transform scale and moves with the seed', () => {
  const square = [[0, 0], [40, 0], [40, 40], [0, 40], [0, 0]];
  const sharp = inkRibbon(square, 0, I, [100, 100], 1, ROTRING_TIP, 3), round = inkRibbon(square, 0.5, I, [100, 100], 1, ROTRING_TIP, 3);
  assert.equal(sharp.quads.length, 4);
  assert.equal(round.quads.length, 12); // each corner becomes three points
  const half = inkRibbon(square, 0, {...I, a: 0.5, d: 0.5}, [100, 100], 8, ROTRING_TIP, 3), full = inkRibbon(square, 0, I, [100, 100], 8, ROTRING_TIP, 3);
  assert.ok(Math.abs(span(half.quads[1]) / span(full.quads[1]) - 0.5) < 0.1);
  assert.deepEqual(inkRibbon(square, 0.5, I, [100, 100], 1, ROTRING_TIP, 3), round);
  assert.notDeepEqual(inkRibbon(square, 0.5, I, [100, 100], 1, ROTRING_TIP, 4).quads, round.quads);
  assert.equal(inkRibbon([[5, 5], [5, 5]], 0.2, I, [100, 100], 1, ROTRING_TIP, 1).quads.length, 0);
});

test('a rotring spline is drawn here in call order with the fills, and the library never hears of it', () => {
  const {b, log, stats, lines} = rig();
  b.wash('#ff0000', 255); b.polygon(quad); b.noWash();
  b.set('rotring', '#000', 1); lines!.hint(5); assert.equal(lines!.takes(), true);
  b.spline([[0, 0], [5, 5]], 0.1);
  b.noStroke();
  b.wash('#00ff00', 255); b.polygon(quad); b.noWash();
  b.render();
  // fill (48 vertices), the line's quad (2 triangles x 4 samples), fill: three runs in one flush, no composite between them
  assert.deepEqual(log, ['render', 'draw 48', 'draw 24', 'draw 48', 'render']);
  assert.deepEqual(stats(), {flat: 2, stencil: 0, draws: 3, flushes: 1, lines: 1});
});

test('other brushes and `lines: false` keep the library stroke, with its state sent first', () => {
  const pencil = rig();
  pencil.b.set('HB', '#000', 1);
  assert.equal(pencil.lines!.takes(), false);
  pencil.b.spline([[0, 0], [5, 5]], 0.1);
  assert.deepEqual(pencil.log, ['pick', 'spline']);
  pencil.b.push(); pencil.b.set('rotring', '#000', 2); pencil.b.pop();
  pencil.b.spline([[0, 0], [5, 5]], 0.1); // pop restored the pencil: still the library's
  assert.deepEqual(pencil.log, ['pick', 'spline', 'spline']);

  const off = rig({lines: false});
  assert.equal(off.lines, undefined);
  off.b.set('rotring', '#000', 1); off.b.spline([[0, 0], [5, 5]], 0.1);
  assert.deepEqual(off.log, ['set', 'spline']);
});
