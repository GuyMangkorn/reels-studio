import {test} from 'node:test';
import assert from 'node:assert/strict';
import {endingsFor, parseRenderArgs} from '../scripts/render-options.mjs';

test('render options parse gl, timeout and concurrency', () => {
  const args = parseRenderArgs(['ZCPAINT-SHORT-TH', '--gl=angle', '--timeout=180000', '--concurrency=2']);
  assert.deepEqual(args.ids, ['ZCPAINT-SHORT-TH']);
  assert.equal(args.gl, 'angle');
  assert.equal(args.timeoutInMilliseconds, 180000);
  assert.equal(args.concurrency, 2);
  assert.equal(args.endings, undefined);
});

test('render options keep the old defaults and reject bad values', () => {
  const args = parseRenderArgs(['Short', '--stills', '--frames=10,20']);
  assert.deepEqual([args.stills, args.frames, args.gl, args.timeoutInMilliseconds, args.concurrency], [true, [10, 20], undefined, undefined, 4]);
  assert.throws(() => parseRenderArgs(['Short', '--gl=opengl']), /--gl must be one of/);
  assert.throws(() => parseRenderArgs(['Short', '--timeout=3s']), /--timeout needs a positive integer/);
  assert.throws(() => parseRenderArgs(['Short', '--concurrency=0']), /--concurrency needs a positive integer/);
});

test('endings default to the registry ending; --endings overrides', () => {
  assert.deepEqual(endingsFor(undefined, {ending: 'C_seamless'}), ['C_seamless']);
  assert.deepEqual(endingsFor(undefined, {}), ['A_fade']);
  assert.deepEqual(endingsFor(['A_fade', 'B_loop'], {ending: 'C_seamless'}), ['A_fade', 'B_loop']);
});
