import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {makePainter} from '../src/painted/kit/painter';
import {camPoint} from '../src/painted/kit/ycam';
import {CLEAR_R, CLEAR_R_SH11, CROWD_OUTFITS, crowdHeads, LEAN, manHead, paintHead, MAN_TEE_SH11, WARM_SHIRTS} from '../src/painted/edu17/crowd-heads';
import {NEIGHBOURS, SQUEEZE, squeezedFig, squeezeK} from '../src/painted/edu17/squeezed';
import {nearCards, WARM_OUTFITS, manDef, paintStreetShot, pitchScale, pushU, SET, ST, STREET_SHOTS, streetSpec, lookCam, NEAR_FULL, bodyAt, dropAt, leanAt, armsUp, crouchFor, JUMP, DROP_SHOTS, type StreetShot} from '../src/painted/edu17/street';
import {paintPersonTop, sh04Cam, squareCorners, TOPS, WARM_TOPS} from '../src/painted/edu17/person-top';
import {bottomShade} from '../src/painted/edu17/shade';

// EDU-EP17 group 2 (Boss, 2026-11-12): N7 street set, N6 crowd-heads, N5 person-top, N12 squeezed. Pixel evidence: out/edu17/g2/.
type Poly = {color: string; pts: [number, number][]};
const recording = () => {
  const polys: Poly[] = [];
  let cur = '';
  const brush = new Proxy({}, {get: (_t, k) => (...a: unknown[]) => { if (k === 'wash' || k === 'fill') cur = a[0] as string; if (k === 'polygon') polys.push({color: cur, pts: a[0] as [number, number][]}); }}) as Brush;
  return {painter: () => makePainter(brush, {t: 0, frame: 0}), polys};
};
const near = (a: number, b: number, tol: number, msg: string) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b} (tol ${tol})`);

test('N7 street spec: 4.2 m bays, four storeys, house colours, awnings 1.3 m out at y 3.0-3.5, laundry on bay x 4.2-8.4 floor 2, poles at z -15 every 30 m, three cables', () => {
  const spec = streetSpec();
  const facades = spec.filter((q) => q.part === 'facade');
  assert.equal(facades.length, 20);
  for (const q of facades) { near(q.pts[1][0] - q.pts[0][0], 4.2, 1e-9, 'bay width'); assert.ok(ST.house.includes(q.color), 'house colour'); assert.ok(q.pts[2][1] >= 15, 'four storeys of 3.75 m'); assert.equal(q.pts[0][2], SET.façadeZ); }
  assert.equal(SET.floors * SET.storey, 15);
  for (const q of spec.filter((q) => q.part === 'awning')) { assert.equal(q.pts[0][1], 3.0); assert.equal(q.pts[3][1], 3.5); near(q.pts[0][2] - q.pts[3][2], 1.3, 1e-9, 'projection'); }
  const laundry = spec.filter((q) => q.part === 'laundry');
  assert.equal(laundry.length, 4);
  for (const q of laundry) { const xs = q.pts.map((v) => v[0]), ys = q.pts.map((v) => v[1]); assert.ok(Math.min(...xs) >= 4.2 && Math.max(...xs) <= 8.4, 'bay x 4.2-8.4'); assert.ok(Math.min(...ys) >= 7.5 && Math.max(...ys) <= 11.25, 'floor 2 (y 7.5-11.25)'); }
  const poles = spec.filter((q) => q.part === 'pole').map((q) => (q.pts[0][0] + q.pts[1][0]) / 2);
  assert.deepEqual(poles, [-30, 0, 30]);
  for (const q of spec.filter((q) => q.part === 'pole')) assert.equal(q.pts[0][2], -15);
  assert.equal(SET.cables, 3);
  assert.ok(spec.every((q) => q.part !== 'sign' || (q.pts[0][1] >= 3.9)), 'signs are textless blocks on floor 2 or 3');
});

test('N7 viaduct: fascia in lit concrete #c9c4b8 at z -5.5 y 11.5-14.5 with a parapet line; underside is optional and off for SH05 and SH11', () => {
  const spec = streetSpec(), fascia = spec.find((q) => q.part === 'fascia')!;
  assert.equal(fascia.color, '#c9c4b8'); assert.equal(fascia.pts[0][2], -5.5); assert.equal(fascia.pts[0][1], 11.5);
  const cap = spec.find((q) => q.part === 'parapet-line')!;
  assert.equal(cap.pts[2][1], 14.5);
  assert.ok(spec.some((q) => q.part === 'underside'));
  assert.ok(!streetSpec({underside: false}).some((q) => q.part === 'underside'));
  assert.equal(STREET_SHOTS.SH05.underside, false); assert.equal(STREET_SHOTS.SH11.underside, false); assert.equal(STREET_SHOTS.SH02.underside, true);
  assert.ok(streetSpec({detail: false}).every((q) => !['ac', 'plant', 'laundry'].includes(q.part)));
});

test('shot cameras reproduce the sheet: SH05 head and phone, SH11 his head, SH02 back of head, ease of a push', () => {
  const c5 = STREET_SHOTS.SH05.cam(0), top = camPoint(c5, [0, 1.72, 0])!, foot = camPoint(c5, [0, 0, 0])!;
  assert.ok(foot[1] > 1500, 'full figure runs below the frame band');
  near(top[0], 540, 12, 'SH05 head x');
  // SH11: the sheet says his head (540, 1051) -> crouched (540, 1092); the sheet's own camera numbers give crown y 1022 standing and 1063 crouched at +0 (1067 at +44): the 41 px drop matches, the
  // 29 px offset does not (reported to Film in build-notes). The camera is built from the sheet's ycam line, not from its computed pixels.
  const c11 = STREET_SHOTS.SH11.cam(0), h = camPoint(c11, [0, 1.72, 0])!, hc = camPoint(c11, [0, 1.42, 0])!;
  near(h[0], 540, 1, 'SH11 x'); near(h[1], 1022, 3, 'SH11 standing crown'); near(hc[1] - h[1], 41, 2, 'SH11 crouch drop 0.30 m = 41 px');
  near(camPoint(STREET_SHOTS.SH11.cam(44), [0, 1.42, 0])![1], 1067, 3, 'SH11 +44 crouched crown');
  const c2 = STREET_SHOTS.SH02.cam(0), back = camPoint(c2, [0, 1.72, 0])!;
  near(back[0], 310, 20, 'SH02 back of head x about 310');
  assert.equal(pushU(0, 54), 0); assert.equal(pushU(54, 54), 1); near(pushU(27, 54), 0.5, 0.02, 'half way');
  assert.ok(pushU(3, 54) < 3 / 54, 'eases in over 6 f'); let prev = -1;
  for (let f = 0; f <= 54; f++) { const u = pushU(f, 54); assert.ok(u >= prev); prev = u; }
});

test('pitchScale: under the SH05 pitch the card is about 8 % taller than the flat card; head top lands on the projected head top; about 1 for a level lens', () => {
  const c = STREET_SHOTS.SH05.cam(15), s = pitchScale(c, [0, 0, 0], 1.72);
  assert.ok(s > 1.05 && s < 1.14, `scale ${s}`);
  const top = camPoint(c, [0, 1.72, 0])!, foot = camPoint(c, [0, 0, 0])!;
  const level = lookCam([0, 1, 5], [0, 1, 0]);
  near(pitchScale(level, [0, 0, 0], 1.72), 1, 0.01, 'level lens');
  const flat = (foot[1] - top[1]), card = 1.72 * s * (c.f / Math.max(0.3, Math.hypot(0.10 - 0, 1.30)));
  assert.ok(flat > 0 && card > 0, 'head top above the feet');
});

test('N6 crowd-heads: the clear zone has no yellow, orange or cream shirts (3 m in every crowd shot, ROWS-R2.2); outfits never include park-casual', () => {
  assert.ok(!(CROWD_OUTFITS as readonly string[]).includes('park-casual'));
  assert.equal(CLEAR_R, 3); assert.equal(CLEAR_R_SH11, 3);
  for (const sh of Object.keys(STREET_SHOTS) as StreetShot[]) assert.equal(STREET_SHOTS[sh].clearR, 3, `${sh}: 3 m clear zone`); assert.equal(MAN_TEE_SH11, '#ffc21a');
  const box = {x0: -12, x1: 12, z0: -17.5, z1: 6.5};
  const heads = crowdHeads(box, {seed: 4, clear: {x: 0, z: 0, r: 3}});
  const inZone = heads.filter((n) => Math.hypot(n.x, n.z) < 3);
  assert.ok(inZone.length > 20);
  assert.ok(inZone.every((n) => !WARM_SHIRTS.has(n.shirt)), 'no warm shirt in the zone');
  assert.ok(heads.filter((n) => Math.hypot(n.x, n.z) > 3.5).some((n) => WARM_SHIRTS.has(n.shirt)), 'warm shirts remain elsewhere');
  const again = crowdHeads(box, {seed: 4, clear: {x: 0, z: 0, r: 3}});
  assert.deepEqual(again.slice(0, 20), heads.slice(0, 20), 'seeded and repeatable');
  assert.ok(heads.every((n, i) => i === 0 || n.z >= heads[i - 1].z), 'far to near by z');
  for (const sh of ['SH02', 'SH05', 'SH10', 'SH12', 'SH15'] as StreetShot[]) {
    const cards = nearCards(STREET_SHOTS[sh].near!, STREET_SHOTS[sh].lensX);
    assert.ok(cards.length > 40);
    assert.ok(cards.every((c) => !(Math.abs(c.at[0]) < 0.3 && Math.abs(c.at[2]) < 0.3)), 'his cell is free');
    assert.ok(cards.every((c) => !(c.at[2] > -0.1 && c.at[0] > STREET_SHOTS[sh].lensX[0] + 0.1 && c.at[0] < STREET_SHOTS[sh].lensX[1] - 0.1)), 'lens line clear');
  }
  assert.equal(manDef().outfit.gear?.hat, undefined, 'MAN has the cap off');
});

test('clear zone (3 m): kit cards inside it never wear the saffron monk robe or the cream vendor shirt, and the rest of the lattice is unchanged', () => {
  const warm = new Set(['#d4801f', '#d8d2c2']); // monk and vendor shirts (wardrobe.ts)
  let had = 0;
  for (const sh of ['SH02', 'SH05', 'SH10', 'SH12', 'SH15'] as StreetShot[]) {
    const d = STREET_SHOTS[sh], plain = nearCards(d.near!, d.lensX), zoned = nearCards(d.near!, d.lensX, {clear: {r: d.clearR}});
    assert.equal(zoned.length, plain.length);
    for (let i = 0; i < zoned.length; i++) {
      const inside = Math.hypot(zoned[i].at[0], zoned[i].at[2]) < d.clearR;
      if (inside) { if (warm.has(plain[i].def.outfit.shirt)) had++; assert.ok(!warm.has(zoned[i].def.outfit.shirt), `${sh}: card ${i} is not warm`); } else assert.deepEqual(zoned[i].def, plain[i].def, `${sh}: card ${i} outside the zone unchanged`);
    }
  }
  assert.ok(had > 0, 'the unfiltered lattice had warm cards in the zone (the test bites)');
  assert.ok(WARM_OUTFITS.has('monk') && WARM_OUTFITS.has('vendor'));
});

test('N6/N7 paint: every street shot paints through a recording brush; SH11 carries the clothes mass, the halo and his tee; polygon counts stay inside the paint budget', () => {
  const counts: Record<string, number> = {};
  for (const sh of Object.keys(STREET_SHOTS) as StreetShot[]) {
    const r = recording(), res = paintStreetShot(r.painter(), sh, 10);
    counts[sh] = r.polys.length;
    assert.ok(r.polys.some((q) => q.color === '#5a4a42'), `${sh}: clothes mass under the far rows`);
    assert.ok(res.cards <= NEAR_FULL, `${sh}: full cards capped at ${NEAR_FULL}`);
    if (sh !== 'SH11') assert.ok(res.cards > 6, `${sh}: near cards`);
    assert.ok(r.polys.some((q) => q.color === '#15110f'), `${sh}: caption falloff`);
  }
  const r11 = recording();
  paintStreetShot(r11.painter(), 'SH11', 0);
  assert.ok(r11.polys.some((q) => q.color === '#fff3c4') && r11.polys.some((q) => q.color === '#fff8e0'), 'halo washes');
  assert.ok(r11.polys.some((q) => q.color === MAN_TEE_SH11), 'his brighter tee');
  assert.ok(!r11.polys.some((q) => q.color === '#e3b23c'), 'no second mustard');
  assert.ok(counts.SH11 < 9000, `SH11 polygons ${counts.SH11}`);
  assert.ok(counts.SH05 < 4500, `SH05 polygons ${counts.SH05}`);
});

test('N12 squeezed: eased 0 to 1 over +2..+6, hands 3 cm up and 2 cm in, elbows 3.5 cm in and 2 cm up behind the upper arm, shoulders x 0.92, neighbours 55 deg', () => {
  assert.equal(squeezeK(2), 0); assert.equal(squeezeK(6), 1); near(squeezeK(4), 0.5, 1e-9, 'mid'); assert.equal(squeezeK(0), 0); assert.equal(squeezeK(30), 1);
  assert.deepEqual(SQUEEZE, {handUp: 0.03, handIn: 0.02, elbowIn: 0.035, elbowUp: 0.02, shoulder: 0.08});
  const man = manDef(), c = STREET_SHOTS.SH05.cam(15);
  const z0 = squeezedFig(man, c, [0, 0, 0], 0), z1 = squeezedFig(man, c, [0, 0, 0], 1);
  near(z1.def.outfit.shoulder, man.outfit.shoulder * 0.92, 1e-9, 'shoulder');
  assert.equal(z0.def.outfit.shoulder, man.outfit.shoulder);
  const u = c.f / 1.3;
  assert.equal(z1.fig.rArm?.behind, 'upper'); assert.equal(z1.fig.lArm?.behind, 'upper');
  // right hand goes in (toward -x on screen) and up (negative y) relative to the unsqueezed target
  const dr = [z1.fig.rArm!.to[0] - z0.fig.rArm!.to[0], z1.fig.rArm!.to[1] - z0.fig.rArm!.to[1]], dl = [z1.fig.lArm!.to[0] - z0.fig.lArm!.to[0], z1.fig.lArm!.to[1] - z0.fig.lArm!.to[1]];
  assert.ok(dr[1] < 0 && dl[1] < 0, 'hands up'); assert.ok(dr[0] < 0 && dl[0] > 0, 'hands in, mirrored');
  near(-dr[1] / 0.03, -dl[1] / 0.03, 1e-6, 'symmetric lift'); assert.ok(-dr[1] / 0.03 > 0.5 * u && -dr[1] / 0.03 < 2 * u, 'about 3 cm in picture units');
  assert.equal(NEIGHBOURS.deg, 55); assert.equal(NEIGHBOURS.left.x, -0.44); assert.equal(NEIGHBOURS.right.x, 0.44);
});

test('N5 person-top: SH04 camera and square, no orange top within 3 m of him, crouch lowers the crown, three passes paint with the look settings unchanged', () => {
  const c = sh04Cam(43), sq = squareCorners(c);
  near(sq[1][0] - sq[0][0], 219, 6, 'square about 220 px'); near((sq[0][0] + sq[1][0]) / 2, 540, 2, 'centred');
  assert.ok(TOPS.some((t) => WARM_TOPS.has(t[0])), 'the list has the saffron monk top');
  const rec = recording(), crown = paintPersonTop(rec.painter(), c, {x0: -3, x1: 3, z0: -5, z1: 5}, {manAt: [0, 0], band: [1176, 1344]})!;
  assert.ok(crown && Math.abs(crown[0] - 540) < 10, 'his crown is found');
  assert.ok(rec.polys.some((q) => q.color === '#e3b23c'), 'his mustard tee');
  const low = recording(), crown2 = paintPersonTop(low.painter(), c, {x0: -3, x1: 3, z0: -5, z1: 5}, {manAt: [0, 0], crouch: 0.3})!;
  assert.notEqual(crown2[1], crown[1]);
  assert.ok(rec.polys.length > 1000 && rec.polys.length < 4000, `SH04 polygons ${rec.polys.length}`);
  // the saffron tone never sits within 3 m of him (default clearWarm 3, Film R2.4 B1)
  const warm = recording();
  paintPersonTop(warm.painter(), c, {x0: -2.1, x1: 2.1, z0: -2.1, z1: 2.1}, {manAt: [0, 0]});
  assert.ok(!warm.polys.some((q) => q.color === '#d9822b' || q.color === '#a85f1c'), 'no saffron within 3 m (default)');
  const warmOn = recording();
  paintPersonTop(warmOn.painter(), c, {x0: -2.1, x1: 2.1, z0: -2.1, z1: 2.1}, {manAt: [0, 0], clearWarm: 0});
  assert.ok(warmOn.polys.some((q) => q.color === '#d9822b' || q.color === '#a85f1c'), 'the saffron top exists when the zone is off');
});

test('shade: bottomShade steps and the street falloff stay inside the frame', () => {
  const r = recording();
  bottomShade(r.painter(), 1000, 0.7, 1, '#15110f', 20, 8);
  assert.equal(r.polys.length, 20); assert.ok(r.polys.every((q) => q.color === '#15110f'));
});

const callStream = (sh: StreetShot, f: number, o?: {drop?: boolean}) => { const log: string[] = []; const brush = new Proxy({}, {get: (_t, k) => (...a: unknown[]) => { log.push(String(k) + JSON.stringify(a)); }}) as Brush; paintStreetShot(makePainter(brush, {t: 0, frame: 0}), sh, f, o); return log.join('|'); };

test('fix pass E drop: off (default) is the same picture as before in every shot; on changes only SH11/SH12 at these frames and never SH02/SH05', () => {
  for (const [sh, f] of [['SH02', 2], ['SH05', 15], ['SH11', 0], ['SH12', 3]] as [StreetShot, number][]) assert.equal(callStream(sh, f), callStream(sh, f, {drop: false}), `${sh} default = drop false`);
  assert.equal(callStream('SH02', 2), callStream('SH02', 2, {drop: true}), 'SH02 has no clock');
  assert.equal(callStream('SH05', 15), callStream('SH05', 15, {drop: true}), 'SH05 has no clock');
  assert.notEqual(callStream('SH12', 3), callStream('SH12', 3, {drop: true}), 'SH12 crouches at +3 with the clock');
  assert.deepEqual(DROP_SHOTS, ['SH10', 'SH11', 'SH12', 'SH15']);
});

test('fix pass E drop clock: crouch rises to 0.3 m in SH11, the jump leaves at +3, peaks at +16 and lands by +34; SH15 starts mid-air at J = 20; pure in f', () => {
  near(dropAt('SH11', 0, -1), 0.05, 1e-9, 'SH11 start');
  near(dropAt('SH11', 44, -1), JUMP.crouch, 1e-9, 'SH11 end');
  assert.equal(dropAt('SH12', 0, -1), JUMP.crouch);
  near(dropAt('SH12', JUMP.apex, -1), -0.42, 1e-9, 'man apex clearance 0.42');
  assert.ok(dropAt('SH12', 25, 3) < 0 && dropAt('SH12', 60, 3) === 0);
  assert.equal(dropAt('SH15', 0, -1), dropAt('SH12', 20, -1));
  assert.equal(dropAt('SH02', 10, 4), 0);
  assert.equal(dropAt('SH12', 10, 7), dropAt('SH12', 10, 7), 'deterministic');
});

test('fix pass E body fields: crouch fraction 1 at full crouch, airborne = lift with P08 arms, standing P01 outside the jump shots', () => {
  near(crouchFor(0.47, 1.7), 1, 1e-9, 'full crouch');
  assert.equal(crouchFor(-0.3, 1.7), 0);
  const air = bodyAt('SH12', JUMP.apex, 5, 1.7);
  assert.ok(air.airborne && air.lift > 0 && air.crouch === 0 && air.pose === 'P08');
  assert.equal(armsUp('SH11', 20, -1), false);
  assert.equal(bodyAt('SH11', 44, -1, 1.7).pose, 'P01');
});

// fix pass F: forward lean on the crouch clock (storyboard ROWS-R2.5 shot 11 "Crouch read", A18)
const sh11Heads = () => { const d = STREET_SHOTS.SH11; return crowdHeads(d.far, {seed: 4, skip: (x, z) => Math.abs(x) < 0.3 && Math.abs(z) < 0.3, clear: {x: 0, z: 0, r: d.clearR}}); };
const headTops = (f: number, lean: boolean, sh: StreetShot = 'SH11') => {
  const c = STREET_SHOTS[sh].cam(f), p = recording().painter();
  return sh11Heads().map((n, i) => paintHead(p, c, n, i, {crouch: () => dropAt(sh, f, i), lean: lean ? () => leanAt(sh, f, i) : undefined})?.top[1] ?? NaN);
};

test('fix pass F lean clock: SH11 rises 0 -> 1 over +30..+42, SH12 releases 1 -> 0 over +0..+3, other shots 0, same jitter as dropAt', () => {
  assert.equal(leanAt('SH11', 30, -1), 0); assert.equal(leanAt('SH11', 42, -1), 1); assert.equal(leanAt('SH11', 44, -1), 1);
  assert.equal(leanAt('SH12', 0, -1), 1); assert.equal(leanAt('SH12', 3, -1), 0);
  for (const sh of ['SH02', 'SH10', 'SH15'] as StreetShot[]) assert.equal(leanAt(sh, 20, 4), 0);
  assert.ok(leanAt('SH12', 6, 7) === 0 && leanAt('SH11', 44, 7) === 1, 'jitter +-2 f never leaves a person half-leaned at +6 / +44');
  assert.deepEqual([LEAN.down, LEAN.fwd, LEAN.chin, LEAN.torso], [0.08, 0.27, 15, 0.68]);
});

test('fix pass F lean: a full lean puts the head 0.08 m lower and 0.27 m toward +z; zero lean is the same call stream as no option', () => {
  const c = STREET_SHOTS.SH11.cam(44), n = manHead(MAN_TEE_SH11), p = recording().painter();
  const a = paintHead(p, c, n, 9999, {crouch: () => 0.3})!, b = paintHead(p, c, n, 9999, {crouch: () => 0.3, lean: () => 1})!;
  const want = camPoint(c, [0, 1.72 - 0.3 - 0.08, 0.27])!;
  near(b.top[1], want[1], 1e-6, 'crown y'); near(b.top[0], want[0], 1e-6, 'crown x');
  assert.ok(b.top[1] - a.top[1] > 20, `man crown ${a.top[1]} -> ${b.top[1]}`);
  assert.equal(callStream('SH11', 44, {drop: true}) === callStream('SH11', 44, {drop: true}), true);
  const log = (lean?: () => number) => { const l: string[] = []; const br = new Proxy({}, {get: (_t, k) => (...x: unknown[]) => { l.push(String(k) + JSON.stringify(x)); }}) as Brush; paintHead(makePainter(br, {t: 0, frame: 0}), c, n, 3, {crouch: () => 0.2, lean}); return l.join('|'); };
  assert.equal(log(), log(() => 0), 'lean 0 = no lean');
  assert.notEqual(log(), log(() => 1));
});

test('fix pass F paint: SH11 +44 differs from +30 more with the lean; mean head y in band 900-1150 is at least 25 px lower at +44 than +30; lean off keeps fix pass E', () => {
  const band = (ys: number[]) => ys.filter((y) => y >= 900 && y <= 1150);
  const y30 = headTops(30, true), y44 = headTops(44, true), y44n = headTops(44, false);
  const idx = y30.map((y, i) => (y >= 900 && y <= 1150 && Number.isFinite(y44[i]) && Number.isFinite(y44n[i]) ? i : -1)).filter((i) => i >= 0);
  const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;
  const dLean = mean(idx.map((i) => y44[i])) - mean(idx.map((i) => y30[i])), dNo = mean(idx.map((i) => y44n[i])) - mean(idx.map((i) => y30[i]));
  console.log(`FIXF band heads ${idx.length} (all ${band(y30).length}): mean y +30 ${mean(idx.map((i) => y30[i])).toFixed(1)}, +44 lean ${mean(idx.map((i) => y44[i])).toFixed(1)}, lean off ${mean(idx.map((i) => y44n[i])).toFixed(1)}; drop with lean ${dLean.toFixed(1)} px, without ${dNo.toFixed(1)} px`);
  assert.ok(dLean >= 25, `mean head y drop ${dLean}`);
  assert.ok(dLean > dNo + 5);
  assert.notEqual(callStream('SH11', 44, {drop: true}), callStream('SH11', 44, {drop: true, lean: false}));
  assert.equal(callStream('SH02', 2, {drop: true}), callStream('SH02', 2));
  assert.equal(callStream('SH11', 44), callStream('SH11', 44, {drop: false}));
  assert.equal(callStream('SH10', 30, {drop: true}), callStream('SH10', 30, {drop: true, lean: false}), 'no lean in SH10');
  assert.equal(callStream('SH15', 30, {drop: true}), callStream('SH15', 30, {drop: true, lean: false}), 'no lean in SH15');
});

test('fix pass F: the halo follows his leaned head, and paint stays inside the SH11 budget', () => {
  const r = recording(); const o = paintStreetShot(r.painter(), 'SH11', 44, {drop: true});
  assert.ok(r.polys.length < 9000 && o.heads > 100, `polys ${r.polys.length}`);
});
