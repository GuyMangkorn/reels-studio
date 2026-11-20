// test-scope: shared (kit/screen newsreel layer, T01)
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {NewsreelOverlay, newsreelFilter, newsreelWeave} from '../src/painted/kit/screen';

const nums = (s: string) => (s.match(/-?\d+(\.\d+)?(e-?\d+)?/g) ?? []).map(Number);

test('(a) default filter is byte-identical to the pre-move strings', () => {
  assert.equal(newsreelFilter({frame: 0}), 'grayscale(0.92) sepia(0.78) saturate(1.25) contrast(1.1) brightness(0.9708098333206544)');
  assert.equal(newsreelFilter({frame: 0, tint: 'cool'}), 'grayscale(0.95) sepia(0.42) hue-rotate(-12deg) saturate(0.8) contrast(1.06) brightness(0.9113724965867368)');
  assert.equal(newsreelFilter({frame: 7, tintAmount: 0.6}), 'grayscale(0.552) sepia(0.46799999999999997) saturate(1.15) contrast(1.1) brightness(0.9715937958153139)');
});

test('(b) strength 0 is the identity', () => {
  assert.equal(newsreelFilter({frame: 5, strength: 0, pop: 0.1}), 'none');
  assert.equal(newsreelWeave({frame: 5, strength: 0}).transform, 'none');
  assert.equal(NewsreelOverlay({frame: 5, strength: 0}), null);
});

test('(c) pop appends brightness(1 + pop * strength)', () => {
  const base = newsreelFilter({frame: 0});
  assert.equal(newsreelFilter({frame: 0, pop: 0.08}), `${base} brightness(1.08)`);
  assert.equal(newsreelFilter({frame: 0, pop: 0.08, strength: 0.5}).endsWith('brightness(1.04)'), true);
  assert.equal(newsreelFilter({frame: 0, pop: 0}), base);
});

test('(d) tintMix 0.5 lies between warm and cool value by value', () => {
  const w = newsreelFilter({frame: 3, tintMix: 0}), c = newsreelFilter({frame: 3, tintMix: 1}), m = newsreelFilter({frame: 3, tintMix: 0.5});
  assert.equal(w, newsreelFilter({frame: 3}));
  assert.equal(c, newsreelFilter({frame: 3, tint: 'cool'}));
  const wn = nums(w), cn = nums(c), mn = nums(m);
  // warm has no hue-rotate: compare the shared values (grayscale, sepia) and the tail (saturate, contrast, brightness)
  const pick = (n: number[], hue: boolean) => (hue ? [n[0], n[1], n[3], n[4], n[5]] : n);
  const W = pick(wn, false), C = pick(cn, true), M = pick(mn, true);
  assert.equal(W.length, 5);
  for (let i = 0; i < 5; i++) assert.ok(M[i] >= Math.min(W[i], C[i]) - 1e-9 && M[i] <= Math.max(W[i], C[i]) + 1e-9, `value ${i}: ${W[i]} ${M[i]} ${C[i]}`);
  assert.ok(m.includes('hue-rotate(-6deg)'));
});
