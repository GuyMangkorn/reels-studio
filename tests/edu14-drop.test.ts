import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bagDims, bounds, burstFragments, dropOutline, dropStateFor, type DropState} from '../src/painted/edu14/drop';

// EDU-EP14 `new: drop` (N2, SP1): picture sizes from the brief's scale baseline (CL08-CL11) and the shape truth (only the pendant
// is a teardrop).
const near = (v: number, want: number, tol: number, msg: string) => assert.ok(Math.abs(v - want) <= tol, `${msg}: ${v.toFixed(3)} vs ${want}`);
const size = (st: DropState) => bounds(dropOutline(st));

test('pendant teardrop is 6.0 x 4.2 mm and hangs from its anchor', () => {
  const b = size({kind: 'pendant', size: 6, swell: 1});
  near(b.h, 6, 0.05, 'length');
  near(b.w, 4.2, 0.05, 'width');
  near(b.y1, 0, 1e-6, 'top on the lip');
});

test('sphere, bun and the ruler drop match their widths (ruler check +-3 %)', () => {
  near(size({kind: 'sphere', size: 5}).w, 5, 0.01, 'hero sphere');
  near(size({kind: 'sphere', size: 2}).w, 2, 0.01, 'small round');
  near(size(dropStateFor('S01-B03-SH03', 60)!).w, 4, 0.01, 'bun width');
  const ruler = size(dropStateFor('S01-B04-SH03', 25)!).w;
  assert.ok(Math.abs(ruler / 5 - 1) <= 0.03, `ruler drop ${ruler}`);
});

test('bun is flat underneath: the bottom third is wider than a circle of the same width', () => {
  const P = dropOutline({kind: 'bun', size: 4, flat: 0.35}), b = bounds(P);
  const low = P.filter(([, y]) => y < b.y0 + 0.05 * b.h).map(([x]) => x);
  assert.ok(Math.max(...low) - Math.min(...low) > 0.45 * b.w, 'flat base');
  assert.ok(b.h < 0.85 * b.w, 'shorter than wide');
});

test('bag hollows to 0.6 and stays within 1.6x width until the burst', () => {
  const at70 = dropStateFor('S01-B04-SH02', 76)!;
  near(at70.hollow!, 0.6, 1e-6, 'hollow at +76');
  near(dropStateFor('S01-B04-SH02', 52)!.hollow!, 0.35, 0.02, 'hollow at +52 ("บุ๋ม")');
  const d = bagDims(5, 0.6, 0);
  assert.ok(d.apex > 0.6 * d.ht && d.rt > 0, 'deep hollow under a thin film, with a rim');
  assert.ok(bagDims(5, 0.6, 1).a * 2 <= 1.6 * 5 + 1e-9, 'inflated width <= 1.6x');
  assert.equal(dropStateFor('S01-B04-SH03', 51)!.kind, 'bag');
  assert.equal(dropStateFor('S01-B04-SH03', 52)!.kind, 'burst');
  near(dropStateFor('S01-B03-SH03', 41)!.flat!, 0.35, 1e-6, 'bun flat reached at +41 (R4.1)');
});

test('burst (Boat PC-1): 12-16 round fragments of 0.3-3.5 mm in three groups, volumes near but not over the parent drop', () => {
  const F = burstFragments(5, 0), ds = F.drops.map((d) => d.d), vol = (d: number) => (Math.PI / 6) * d ** 3;
  assert.ok(ds.length >= 12 && ds.length <= 16, `count ${ds.length}`);
  ds.forEach((d) => assert.ok(d >= 0.3 && d <= 3.5, `fragment ${d}`));
  const n = (lo: number, hi: number) => ds.filter((d) => d >= lo && d <= hi).length;
  assert.equal(n(2.5, 3.5), 2, 'two large node/rim pieces 2.5-3.5 mm');
  assert.ok(n(1.5, 2.49) >= 4 && n(1.5, 2.49) <= 6, 'four to six rim drops 1.5-2.5 mm');
  assert.ok(n(0.3, 1.0) >= 6 && n(0.3, 1.0) <= 10, 'six to ten film droplets 0.3-1.0 mm');
  const ratio = ds.reduce((s, d) => s + vol(d), 0) / vol(5);
  assert.ok(ratio >= 0.85 && ratio <= 1, `volume ratio ${ratio.toFixed(3)}`);
  // a pure function of frame: same input, same picture; sizes do not change as they fly
  assert.deepEqual(burstFragments(5, 17), burstFragments(5, 17));
  assert.deepEqual(burstFragments(5, 30).drops.map((d) => d.d), ds);
});

test('only the pendant is a teardrop: every other state is left-right symmetric and has no point on top', () => {
  const pointy = (st: DropState) => {
    const P = dropOutline(st), b = bounds(P), top = P.filter(([, y]) => y > b.y1 - 0.1 * b.h).map(([x]) => x);
    return Math.max(...top) - Math.min(...top) < 0.25 * b.w; // the top tenth narrower than a quarter of the width
  };
  assert.ok(pointy({kind: 'pendant', size: 6, swell: 1}));
  for (const st of [{kind: 'sphere', size: 5}, {kind: 'bun', size: 4, flat: 0.35}, {kind: 'bag', size: 5, hollow: 0.6}] as DropState[]) assert.ok(!pointy(st), st.kind);
});
