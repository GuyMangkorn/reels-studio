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

test('render options default to ANGLE and reject bad values', () => {
  const args = parseRenderArgs(['Short', '--stills', '--frames=10,20']);
  assert.deepEqual([args.stills, args.frames, args.gl, args.timeoutInMilliseconds, args.concurrency], [true, [10, 20], 'angle', undefined, 4]);
  assert.equal(parseRenderArgs(['Short', '--gl=swangle']).gl, 'swangle');
  assert.throws(() => parseRenderArgs(['Short', '--gl=opengl']), /--gl must be one of/);
  assert.throws(() => parseRenderArgs(['Short', '--timeout=3s']), /--timeout needs a positive integer/);
  assert.throws(() => parseRenderArgs(['Short', '--concurrency=0']), /--concurrency needs a positive integer/);
});

test('endings default to the registry ending; --endings overrides', () => {
  assert.deepEqual(endingsFor(undefined, {ending: 'C_seamless'}), ['C_seamless']);
  assert.deepEqual(endingsFor(undefined, {}), ['A_fade']);
  assert.deepEqual(endingsFor(['A_fade', 'B_loop'], {ending: 'C_seamless'}), ['A_fade', 'B_loop']);
});

test('--keep-pinned and --repaint', () => {
  const off = parseRenderArgs(['ZCPAINT-SHORT-TH']);
  assert.deepEqual([off.keepPinned, off.repaint], [false, []]);
  const on = parseRenderArgs(['ZCPAINT-SHORT-TH', '--keep-pinned', '--repaint=B01-SH01,B02-SH03']);
  assert.deepEqual([on.keepPinned, on.repaint], [true, ['B01-SH01', 'B02-SH03']]);
});

test('--draft is off by default', () => {
  assert.equal(parseRenderArgs(['ZCPAINT-SHORT-TH']).draft, false);
  assert.equal(parseRenderArgs(['ZCPAINT-SHORT-TH', '--draft']).draft, true);
});

test('--preview and --no-cache are off by default', () => {
  const off = parseRenderArgs(['ZCPAINT-SHORT-TH']);
  assert.deepEqual([off.preview, off.noCache], [false, false]);
  const on = parseRenderArgs(['ZCPAINT-SHORT-TH', '--preview', '--no-cache']);
  assert.deepEqual([on.preview, on.noCache], [true, true]);
});

test('--range parses <from>-<to> and rejects bad ranges', () => {
  assert.deepEqual(parseRenderArgs(['Short', '--range=198-497']).range, [198, 497]);
  assert.equal(parseRenderArgs(['Short']).range, undefined);
  assert.throws(() => parseRenderArgs(['Short', '--range=500-100']), /--range needs/);
  assert.throws(() => parseRenderArgs(['Short', '--range=10']), /--range needs/);
});
