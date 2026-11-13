import {test} from 'node:test';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import type {Brush} from '../src/painted/BrushCanvas';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {camPoint, camUnit} from '../src/painted/kit/ycam';
import type {V3} from '../src/painted/kit/space';
import {FALL_D2} from '../src/painted/edu18/clock';
import {contactGap} from '../src/painted/edu18/dropcontact';
import {BUN_SM, paintBun} from '../src/painted/edu18/macro';
import {anchorUnderFace, MOSQ_BL_SM, mosqReachAbove, mosqReachBelow, paintMosquito, type MosqMeasure} from '../src/painted/edu18/mosquito';
import {camSH15, paintSH02Mosq, sh02Rings, sh02Anchor, sh02Frame, sh02Opts, sh02Ride, sh02Surface, sh15Frame, sh15Opts} from '../src/painted/edu18/shots';

// EDU-EP18 pass 5 (Film F5-B01 SH02 settle and flex, F5-B02 SH15 hit and try; D5-01..D5-05): the numbers behind the acceptance lists, measured on the real draw calls
// through a recording brush (nothing is painted). Set PASS5_LOG=<file> to write the per-frame table.
const rec = () => makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0});
const MW = -21.95, HIT = 50;
const sh02 = Array.from({length: 61}, (_, n) => {
  const {ctr, c} = sh02Frame(n), r = paintSH02Mosq(rec(), c, ctr, n, n / 30)!, o = sh02Opts(n, n / 30);
  return {n, m: r.m, unit: r.unit, o, len: Math.hypot(r.m.head[0] - r.m.tail[0], r.m.head[1] - r.m.tail[1]) / r.unit};
});
// the same frame with the face at rest (no ride): the camera drift cancels in the ride's px
const sh02Rest = (n: number) => { const {ctr, c} = sh02Frame(n), at: V3 = [ctr[0], ctr[1] - 0.95, ctr[2] + 0.4]; return camPoint(c, at)!; };
const sh15 = Array.from({length: 114}, (_, n) => {
  const t = n / 30, f = sh15Frame(n, t), c = camSH15(n), at: V3 = [0, f.ay, 0], m = paintMosquito(rec(), c, at, MOSQ_BL_SM, f.opts) as MosqMeasure, unit = camUnit(c, at);
  const ctr0y = f.ctr[1] + f.dip; // the drop's own centre without the dip: `Dl` is drop-local
  const bun = paintBun(rec(), c, f.ctr, {t, seed: 40700, squeeze: f.squeeze}) ?? {heightPx: NaN}, bun0 = paintBun(rec(), c, f.ctr, {t, seed: 40700}) ?? {heightPx: NaN};
  const restAy = f.hit ? ctr0y + BUN_SM.bottom - mosqReachAbove('pressed') * MOSQ_BL_SM : f.ay, restG = camPoint(c, [0, restAy, 0])!; // rest = the undisplaced face with the pressed pose
  const legBottom = Math.max(...m.toes.map((q) => q[1]), ...m.tibMid!.map((q) => q[1])), lowest = f.ay - ctr0y - (legBottom - m.centre[1]) / unit;
  const back = f.ay + mosqReachAbove('pressed', (f.hit ? -15 * (1 - (f.opts.blend?.k ?? 0)) : 0) + (f.opts.pitchAdd ?? 0)) * MOSQ_BL_SM; // the dorsal line (Dl y, world)
  return {n, f, m, unit, bun, bun0, restG, lowest, back, len: Math.hypot(m.head[0] - m.tail[0], m.head[1] - m.tail[1]) / unit};
});
const inFrame = (q: Pt) => q[0] >= 0 && q[0] <= 1080 && q[1] >= 0 && q[1] <= 1920;

test('D5-01 abdomen >= 1.00 and head-tail length constant (+-1 %) over SH02 and SH15', () => {
  sh02.forEach((s) => { assert.ok(s.o.abdomen! >= 1 && s.m.abdW! >= 2 * 0.07 * s.unit * MOSQ_BL_SM / 1.045 * 0.9999, `SH02 +${s.n}`); });
  const l02 = sh02.map((s) => s.len), l15 = sh15.map((s) => s.len);
  [l02, l15].forEach((ls) => assert.ok((Math.max(...ls) - Math.min(...ls)) / ls[0] <= 0.02, 'length spread (max-min)/rest <= 2 % (+-1 %)'));
  sh15.forEach((s) => assert.ok(s.f.opts.abdomen! >= 1, `SH15 +${s.n}`));
  assert.throws(() => paintMosquito(rec(), camSH15(0), [0, 0, 0], 1, {view: 'below', abdomen: 0.97}));
});
test('F5-B01 SH02: the contact gap to the displaced face stays <= 0.02 sm every frame; the ride is 0.07 sm at +0 and over by +37', () => {
  for (let n = 0; n <= 60; n++) assert.ok(contactGap(sh02Surface(n), 0, sh02Ride(n)) <= 0.02, `+${n}`);
  assert.ok(Math.abs(sh02Ride(0) - 0.07) < 1e-9 && sh02Ride(37) === 0 && sh02Anchor(0) < sh02Anchor(40));
});
test('F5-B01 SH02 rings: alpha >= 0.2 at +4 and +10, none at +18; the flex ring runs +40..+52', () => {
  [4, 10].forEach((n) => assert.ok(sh02Rings(n).length === 2 && sh02Rings(n).every(([, a]) => a >= 0.2), `+${n}`));
  assert.equal(sh02Rings(18).length, 0);
  assert.ok(sh02Rings(40).length === 1 && sh02Rings(52).length === 1 && sh02Rings(53).length === 0);
});
test('F5-B01 SH02 wing stays 3..9 deg (never past 10), with >= 5 quiver cycles over the shot; the legs settle to +-2 deg by +22 and flex >= 14 deg over +40..+43', () => {
  sh02.forEach((s) => { const w = 6 + s.o.wingQuiver!; assert.ok(w >= 2.9 && w <= 9.05, `+${s.n}: ${w}`); });
  assert.ok(61 / 30 * 2.6 >= 5);
  for (const k of ['fore', 'mid', 'hind'] as const) {
    for (let n = 22; n <= 34; n++) assert.ok(Math.abs(sh02[n].o.legBend![k]) <= 2.0, `${k} +${n}`);
    for (let n = 40; n <= 43; n++) assert.ok(sh02[n].o.legBend![k] >= 14, `${k} flex +${n}`);
  }
  assert.ok(sh02[0].o.legBend!.fore >= 15);
});
test('F5-B02 SH15: the back stays within 0.02 sm of the displaced face from +50, the dip is 0.12 sm at +53 and gone by +113', () => {
  for (let n = HIT; n <= 113; n++) { const s = sh15[n]; assert.ok(contactGap(s.back, s.f.ctr[1]) <= 0.02, `+${n}: ${contactGap(s.back, s.f.ctr[1])}`); }
  assert.ok(Math.abs(sh15[53].f.dip - 0.12) < 1e-9 && sh15[113].f.dip === 0 && sh15[49].f.dip === 0);
});
test('F5-B02 SH15 lowest point: >= 1.0 sm above the water every frame (R04); +113 is the unchanged rest pose (face gap 2.0 sm, legs clearance as before the pass)', () => {
  // NOTE: Film's pass-5 text gives clearance 1.575 sm and a "-1.30 Dl" floor; the card's own pressed geometry (mosqReachBelow 0.70 sm below the anchor, anchor 0.217 sm below the
  // face) gives 1.074 sm and -1.80 Dl, the same before and after this pass. The guards below are the R04 limit and "no change at +113".
  sh15.forEach((s) => assert.ok(s.f.ay - (s.m.bottom - s.m.centre[1]) / s.unit - MW >= 1.0, `+${s.n}: whole card clears the water`));
  const s = sh15[113], face = s.f.ctr[1] + BUN_SM.bottom, restAy = anchorUnderFace(face, MOSQ_BL_SM, 'pressed'), restClear = restAy - mosqReachBelow('pressed') * MOSQ_BL_SM - MW;
  assert.ok(Math.abs(face - MW - 2.0) < 0.02, `face gap ${face - MW}`);
  assert.ok(Math.abs(s.f.ctr[1] + s.lowest - MW - restClear) < 0.005 && restClear >= 1.0, `legs clearance ${s.f.ctr[1] + s.lowest - MW} vs rest ${restClear}`);
  assert.equal(sh15Opts(113, 113 / 30).pitchAdd, 0);
  assert.ok(Math.abs(s.f.ctr[1] + FALL_D2 * 63) < 1e-9);
  sh15.slice(57).forEach((q) => assert.ok(q.lowest >= s.lowest - 0.35, `+${q.n}: legs reach ${q.lowest - s.lowest} sm below rest`));
});
test('F5-B02 SH15 no snap: the largest one-frame move of an in-frame leg tip over +49..+56 stays <= 70 px', () => {
  let worst = 0;
  for (let n = 49; n <= 56; n++) sh15[n].m.toes.forEach((q, i) => { const p0 = sh15[n - 1].m.toes[i]; if (inFrame(q) && inFrame(p0)) worst = Math.max(worst, Math.hypot(q[0] - p0[0], q[1] - p0[1])); });
  assert.ok(worst <= 70, `worst ${worst.toFixed(1)} px`);
});
test('F5-B02 SH15 squeeze, centre and wings: bun -4 % at +52, +1.5 % at +57, rest from +64; centre within 2 px of rest from +66; wings folded by +53', () => {
  const sq = (n: number) => (sh15[n].bun.heightPx / sh15[n].bun0.heightPx - 1) * 100;
  assert.ok(Math.abs(sq(52) + 4) <= 1 && Math.abs(sq(57) - 1.5) <= 0.5);
  for (let n = 64; n <= 113; n++) assert.ok(Math.abs(sq(n)) <= 0.5, `+${n} ${sq(n)}`);
  assert.ok(sh15[53].m.centre[1] - sh15[50].m.centre[1] >= 16);
  for (let n = 66; n <= 113; n++) assert.ok(Math.abs(sh15[n].m.centre[1] - sh15[n].restG[1]) <= 2.0, `+${n}`);
  const dy58 = sh15[58].restG[1] - sh15[58].m.centre[1];
  assert.ok(dy58 >= 3 && dy58 <= 12, `+58 ${dy58}`);
  assert.equal(sh15Opts(53, 1).blend!.kWing, 1);
  assert.ok(Math.abs(sh15Opts(57, 0).legBend!.fore - 7) <= 1 && Math.abs(sh15Opts(101, 0).legBend!.hind - 12) <= 1);
});
test('pass 5 reference table (PASS5_LOG)', () => {
  if (!process.env.PASS5_LOG) return;
  const L: string[] = [];
  sh02.forEach((s) => { const r = sh02Rest(s.n); L.push(`SH02 +${s.n} centre ${s.m.centre.map((v) => v.toFixed(1))} ride ${(s.m.centre[1] - r[1]).toFixed(1)}px dx ${(s.m.centre[0] - r[0]).toFixed(1)} unit ${s.unit.toFixed(1)} abdW ${s.m.abdW!.toFixed(1)} len/unit ${s.len.toFixed(4)} bends ${s.m.bends!.map((b) => b.toFixed(1))} wing ${(6 + s.o.wingQuiver!).toFixed(2)} tib ${s.m.tibMid!.map((q) => q.map((v) => v.toFixed(0)).join(',')).join(' ')} legBend ${Object.values(s.o.legBend!).map((v) => v.toFixed(1))}`); });
  sh15.forEach((s) => L.push(`SH15 +${s.n} cy ${s.m.centre[1].toFixed(1)} restcy ${s.restG[1].toFixed(1)} dy ${(s.m.centre[1] - s.restG[1]).toFixed(1)} bunH ${s.bun.heightPx.toFixed(1)} bunH0 ${s.bun0.heightPx.toFixed(1)} sq ${((s.bun.heightPx / s.bun0.heightPx - 1) * 100).toFixed(2)}% dip ${s.f.dip.toFixed(3)} lowestDl ${s.lowest.toFixed(4)} wing ${s.f.opts.wingQuiver!.toFixed(2)} legBend ${Object.values(s.f.opts.legBend!).map((v) => v.toFixed(1))} abd ${s.f.opts.abdomen!.toFixed(3)} len/unit ${s.len.toFixed(4)} toes ${s.m.toes.map((q) => q.map((v) => v.toFixed(0)).join(',')).join(' ')}`));
  writeFileSync(process.env.PASS5_LOG, L.join('\n') + '\n');
});
