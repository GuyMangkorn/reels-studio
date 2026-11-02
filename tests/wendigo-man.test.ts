import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PEOPLE} from '../src/painted/kit/people';
import {paintedShots} from '../src/painted/registry';
import {WDG_MAN, anchorsAt, talkEnv, talkVoiceEnv} from '../src/painted/wendigo/cast';
import {wdgManStage as S} from '../src/painted/shots/wendigo';
import {WDG_SHOTS} from '../src/painted/wendigo/timed';
import narration from '../public/narration/WDG-EP01-SHORT.amplitude.json';

// WDG-EP01-SHORT man shots (D05 parka override, D06 lantern, D07 night walk): S01-B01-SH02, S01-B03-SH01, S01-B03-SH03.

const ease = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, u)));
const sec = (id: keyof typeof WDG_SHOTS) => WDG_SHOTS[id].n / 30;

test('the parka is a local override: man-parted body and head, the kit entry is untouched', () => {
  const base = PEOPLE['man-parted'];
  assert.equal(WDG_MAN.height, base.height);
  assert.equal(WDG_MAN.seed, base.seed);
  assert.equal(WDG_MAN.head.cut, base.head.cut);
  assert.equal(base.outfit.jacket, '#34414f'); // the blazer of the kit entry
  assert.notEqual(WDG_MAN.outfit.jacket, base.outfit.jacket);
  assert.ok(WDG_MAN.outfit.gear?.collar?.kind === 'hood' && WDG_MAN.outfit.boots);
});

test('the three plates are registered under the shot IDs', () => {
  for (const id of ['S01-B01-SH02', 'S01-B03-SH01', 'S01-B03-SH03']) assert.ok(Object.hasOwn(paintedShots, `WDG-${id}`), id);
});

test('lead height stays >= 480 px across each shot (visible artwork after camera and the 900 px caption crop)', () => {
  const lead = (n: number, at: (tl: number) => {top: number; bottom: number; s: number; fy: number; clip: number}) => {
    let min = Infinity;
    for (let L = 0; L < n; L++) {
      const r = at(L / 30), y = (v: number) => (v - r.fy) * r.s + r.fy;
      min = Math.min(min, Math.min(y(r.bottom), r.clip) - y(r.top));
    }
    return min;
  };
  const sh02 = lead(WDG_SHOTS['S01-B01-SH02'].n, (tl) => {
    const a = anchorsAt(S.sh02Layer(tl), S.SH02.unit, tl);
    return {top: a.top, bottom: a.bottom, s: 1 + 0.05 * ease(tl / sec('S01-B01-SH02')), fy: 520, clip: 900};
  });
  const sh01 = lead(WDG_SHOTS['S01-B03-SH01'].n, (tl) => {
    const w = S.walkStage(tl), a = anchorsAt(w.layer, S.WALK.unit, tl);
    return {top: a.top, bottom: a.bottom, s: 1, fy: 960, clip: 1e9};
  });
  const sh03 = lead(WDG_SHOTS['S01-B03-SH03'].n, (tl) => {
    const a = anchorsAt(S.sh03Layer(tl), S.SH03.unit, tl);
    return {top: a.top, bottom: a.bottom, s: 1 + 0.05 * ease(tl / sec('S01-B03-SH03')), fy: 520, clip: 900};
  });
  for (const [n, v] of Object.entries({sh02, sh01, sh03})) assert.ok(v >= 480, `${n} lead ${v}`);
});

test('the walk keeps the walker on its screen place (follow 1.0) and the feet on y 850', () => {
  for (const L of [0, 40, 80, 112]) {
    const w = S.walkStage(L / 30), a = anchorsAt(w.layer, S.WALK.unit, L / 30);
    assert.ok(Math.abs(w.layer.g[0] + w.cam.dx - 430) < 1e-6, `x at L${L}`);
    assert.ok(Math.abs(a.bottom - 850) < 60, `feet y at L${L}: ${a.bottom}`);
  }
});

test('mouth moves only inside the speech spans (SH02 L [4,31) and [41,116); SH03 L [26,82) and [124,160))', () => {
  for (const L of [0, 2, 3, 31, 35, 40, 116, 130]) assert.equal(talkEnv(L, S.SH02.spans, 11), 0, `SH02 L${L}`);
  assert.ok([10, 15, 60, 90].some((L) => talkEnv(L, S.SH02.spans, 11) > 0.1));
  for (const L of [0, 10, 100, 110, 122, 165, 183, 191]) assert.equal(talkEnv(L, S.SH03.spans, 29), 0, `SH03 L${L}`);
  assert.ok([40, 60, 130, 150].some((L) => talkEnv(L, S.SH03.spans, 29) > 0.1));
});

test('voice-driven mouth (round 3): closed outside the spans, capped at 0.62, at most 4 open/close cycles in the first 1.87 s of M5 (5 syllables)', () => {
  const g = WDG_SHOTS['S01-B03-SH03'].g, v = (L: number) => talkVoiceEnv(L, g, S.SH03.spans, narration, 29);
  for (const L of [0, 10, 100, 110, 122, 165, 183, 191]) assert.equal(v(L), 0, `SH03 L${L}`);
  let max = 0, cycles = 0, up = false, lo = 1, hi = 0; for (let L = 26; L < 82; L++) { const x = v(L); max = Math.max(max, x); if (!up) { lo = Math.min(lo, x); if (x - lo >= 0.15) { up = true; hi = x; cycles++; } } else { hi = Math.max(hi, x); if (hi - x >= 0.15) { up = false; lo = x; } } }
  assert.ok(max <= 0.62 + 1e-9);
  assert.ok(cycles <= 4, `${cycles} cycles in 1.87 s (talkEnv gave 10)`);
});

test('staging is a pure function of the shot clock', () => {
  const snap = (tl: number) => JSON.stringify([S.sh02Layer(tl), S.walkStage(tl), S.sh03Layer(tl)]);
  for (const tl of [0, 1.234, 3.9]) assert.equal(snap(tl), snap(tl));
});

test('R2.1 framing: SH02 head 380 px at (650, 460), SH03 head 420 px at (540, 500) with the lantern body 100-150 px', () => {
  assert.equal(S.SH02.head[0], 650); assert.equal(S.SH02.head[1], 460); assert.ok(Math.abs(S.SH02.unit * 0.425 - 380) < 1e-6);
  assert.equal(S.SH03.head[0], 540); assert.equal(S.SH03.head[1], 500); assert.ok(Math.abs(S.SH03.unit * 0.425 - 420) < 1e-6);
  const h = 0.18 * S.SH03.unit; // prop height with the bail; the body (cap apex to base) is 0.7 h
  assert.ok(0.7 * h >= 100 && 0.7 * h <= 150, `body ${0.7 * h}`);
});

test('walk: the ground scrolls 230 px/s and the boot lands at L 26, 55, 84, 110 with the planted foot at the ground speed (+-1 px per frame)', () => {
  for (const L of [0, 30, 70, 111]) assert.ok(Math.abs(S.walkStage(L / 30).cam.dx - S.walkStage((L + 1) / 30).cam.dx - 230 / 30) < 1e-6, `scroll L${L}`);
  S.WALK.steps.forEach((L, k) => assert.ok(Math.abs(S.walkPhase(L) - (0.25 + 0.5 * k)) < 1e-9, `landing ${k}`));
  // profile leg kit/cast.ts: ankle u = L1 sin(sw0) + L2 sin(sw0 - kneeBend), sw0 = 0.42 sin(ph + off) * stride; the planted leg is the one at its front-most swing at the landing
  const hip0 = 1.207 - 0.531 + 0.034, ankleV = 0.038, L1 = hip0 - (hip0 + ankleV) / 2, L2 = L1;
  const ankle = (L: number, off: number) => { const ph = S.walkPhase(L) * 2 * Math.PI, sw0 = 0.42 * Math.sin(ph + off) * S.WALK.stride, kb = Math.max(0, 0.6 * Math.sin(ph + off + 1.2)) * S.WALK.stride; return (L1 * Math.sin(sw0) + L2 * Math.sin(sw0 - kb)) * S.WALK.unit; };
  const off = Math.PI / 2 - 0.25 * 2 * Math.PI; // sin(ph + off) = 1 at the first landing
  for (let k = 0; k < 3; k++) {
    const a = S.WALK.steps[k], b = S.WALK.steps[k + 1];
    const sign = k % 2 === 0 ? 1 : -1; // the legs alternate
    const mean = Math.abs(ankle(a, sign > 0 ? off : off + Math.PI) - ankle(b, sign > 0 ? off : off + Math.PI)) / (b - a);
    assert.ok(Math.abs(mean - 230 / 30) <= 1, `stance ${k} mean ${mean.toFixed(2)} px/frame`);
  }
});
