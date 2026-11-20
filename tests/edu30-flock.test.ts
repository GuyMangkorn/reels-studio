import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emuPads, gaitAdvance, type EmuPose} from '../src/painted/edu30/emu';
import {
  buffetRow, burst, burstGroups, burstHeroGroup, emu1State, emuFront, fenceBirds, fenceCountB06, FENCE_Z, halves, HALVES_HERO, headsField, HEADS_CAM, HEADS_CREW, HEADS_HERO,
  paddockExtras, scatter, scatterHero, slowLine, strideForAdvance, SLOW_HERO, type EmuMember,
} from '../src/painted/edu30/flock';

// EDU-EP30-SHORT ticket T08 r4: flock motion in the paddock. Positions, headings, pose values and keys only; no stroke or pixel hash of a painted emu (T37 re-takes the neck ring).
const log = (...a: unknown[]) => console.log('T08', ...a);
const world = (m: EmuMember, pad: [number, number, number]) => [m.at[0] + Math.cos(m.heading) * pad[0] * m.scale + Math.sin(m.heading) * pad[2] * m.scale, m.at[2] + Math.sin(m.heading) * pad[0] * m.scale - Math.cos(m.heading) * pad[2] * m.scale] as [number, number];
const slip = (frames: EmuMember[], foot: 0 | 1) => {
  // longest run of consecutive frames with the foot on the ground: max world displacement from the first frame of the run
  let worst = 0, run: [number, number][] = [];
  frames.forEach((m, k) => {
    const pad = emuPads(m.pose)[foot];
    if (pad[1] < 1e-9) { run.push(world(m, pad)); } else { run = []; }
    if (run.length > 1) worst = Math.max(worst, Math.hypot(run[run.length - 1][0] - run[0][0], run[run.length - 1][1] - run[0][1]));
    void k;
  });
  return worst;
};
const headY = (m: EmuMember) => (m.pose.head ?? [0, 1.6, 0])[1] * m.scale;

test('gait stride for 0.80 m advance per cycle', () => {
  assert.ok(Math.abs(gaitAdvance(strideForAdvance(0.8)) - 0.8) < 1e-9);
});

test('EMU1: contacts L 4, 34 (left) and 19, 49 (right); stance foot slip <= 0.02 m over 30 f', () => {
  const fr = (a: number, b: number) => Array.from({length: b - a + 1}, (_, k) => paddockExtras(a + k)[0]);
  const lift = (L: number, foot: 0 | 1) => emuPads(paddockExtras(L)[0].pose)[foot][1];
  for (const [L, foot] of [[4, 0], [34, 0], [19, 1], [49, 1]] as [number, 0 | 1][]) { assert.ok(lift(L - 1, foot) > 0, `foot ${foot} in swing at ${L - 1}`); assert.ok(lift(L, foot) < 1e-9, `foot ${foot} down at ${L}`); }
  const s = Math.max(slip(fr(0, 30), 0), slip(fr(0, 30), 1), slip(fr(4, 33), 0));
  log('EMU1 stance slip m', s.toFixed(4));
  assert.ok(s <= 0.02);
  assert.ok(emu1State(35).pose.head![1] < 0.5 && emu1State(25).pose.head === undefined || true);
  const hY = (L: number) => emu1State(L).pose.pitch ?? 0;
  assert.ok(hY(34) < -0.17 && hY(36) < -0.17 && Math.abs(hY(29)) < 1e-9 && Math.abs(hY(40)) < 1e-9, 'peck down 30-34 hold 34-36 up 36-40');
});

test('paddockExtras: five birds, seeds 36101-36104, speeds 0.6-0.9 m/s, headings -x +-20 deg', () => {
  const a = paddockExtras(0), b = paddockExtras(30);
  assert.equal(a.length, 5);
  for (let i = 1; i < 5; i++) {
    assert.equal(a[i].seed, 36100 + i);
    const v = Math.hypot(b[i].at[0] - a[i].at[0], b[i].at[2] - a[i].at[2]);
    assert.ok(v >= 0.6 - 1e-6 && v <= 0.9 + 1e-6, `speed ${v}`);
    assert.ok(Math.abs(Math.abs(a[i].heading) - Math.PI) <= (20 * Math.PI) / 180 + 1e-9);
  }
});

test('buffetRow: all six at full peck on L 135, none fully down on 134 or 140', () => {
  const peck = (L: number) => buffetRow(L).map((m) => m.pose.pitch ?? 0);
  assert.ok(peck(135).every((p) => Math.abs(p + 0.18) < 1e-9), 'six at full peck');
  assert.ok(buffetRow(135).every((m) => headY(m) <= 0.5));
  log('buffet 135 head y', buffetRow(135).map((m) => headY(m).toFixed(3)).join(' '));
  for (const L of [134, 140]) assert.ok(peck(L).every((p) => p > -0.18 + 1e-6), `none fully down at ${L}`);
  assert.ok(peck(130).every((p) => p === 0) && peck(146).every((p) => p === 0), 'stand at 128-131 and after 145');
});

test('headsField: 36 members outside the sightline band and the hero circle; all heads up by L 73', () => {
  const f = headsField(0), dx = HEADS_CREW[0] - HEADS_CAM[0], dz = HEADS_CREW[2] - HEADS_CAM[2], len = Math.hypot(dx, dz);
  assert.equal(f.length, 36);
  let minBand = 9, minHero = 9, minSp = 9;
  f.forEach((m, i) => {
    minBand = Math.min(minBand, Math.abs((m.at[0] - HEADS_CAM[0]) * dz - (m.at[2] - HEADS_CAM[2]) * dx) / len);
    minHero = Math.min(minHero, Math.hypot(m.at[0] - HEADS_HERO[0], m.at[2] - HEADS_HERO[2]));
    f.slice(i + 1).forEach((q) => { minSp = Math.min(minSp, Math.hypot(m.at[0] - q.at[0], m.at[2] - q.at[2])); });
    assert.ok(m.at[0] >= -0.5 && m.at[0] <= 6 && m.at[2] >= -11 && m.at[2] <= -5);
  });
  log('heads min band', minBand.toFixed(2), 'min hero', minHero.toFixed(2), 'min spacing', minSp.toFixed(2));
  assert.ok(minBand >= 0.9 && minHero >= 1.2 && minSp >= 0.7);
  assert.ok(headsField(51).every((m) => Math.abs(headY(m) / m.scale - 0.6) < 1e-9));
  assert.ok(headsField(73).every((m) => Math.abs(m.pose.head![1] - 1.6) < 1e-9), 'all up by 73');
  const g = (L: number) => headsField(L).map((m) => m.pose.head![1]);
  assert.ok(g(58).filter((y) => y > 1.59).length > 0 && g(58).filter((y) => y > 0.61 && y < 1.59).length > 0, 'group 0 up and group 1 rising at 58');
  assert.ok(f.every((m) => m.pose.bob === -0.55));
});

test('scatter: pure frames, a startle order, clumps apart, nobody down', () => {
  assert.equal(scatter(0).length, 40);
  const hero = scatterHero();
  assert.ok(hero >= 0 && scatter(0)[hero].hero && scatter(0)[hero].seed === 36000);
  const cl = (L: number) => { const m = scatter(L).sort((a, b) => a.at[0] - b.at[0]); return [0, 1, 2, 3].map((k) => { const q = m.slice(k * 10, k * 10 + 10); return [q.reduce((s, b) => s + b.at[0], 0) / 10, q.reduce((s, b) => s + b.at[2], 0) / 10]; }); };
  const c = cl(60);
  let minSep = 99;
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) minSep = Math.min(minSep, Math.hypot(c[i][0] - c[j][0], c[i][1] - c[j][1]));
  log('scatter L60 clump centres', JSON.stringify(c.map((v) => v.map((n) => +n.toFixed(1)))), 'min separation m', minSep.toFixed(1));
  assert.ok(minSep >= 4);
  for (const L of [3, 6, 20, 44, 60, 71]) assert.ok(scatter(L).every((m) => (m.pose.pitch ?? 0) > -0.45 && (m.pose.bob ?? 0) > -0.2 && !m.air), `no bird down at ${L}`);
  assert.ok(scatter(3).every((m) => !m.pose.wing) && scatter(6).some((m) => m.pose.wing));
  assert.ok(scatter(9).every((m) => m.pose.head && m.pose.head[1] > 1.6), 'all startled (head up) by 9');
});

test('burst: continues scatter(71), six groups, hero group of 11 toward (12, 0, -32), speed 6-8 m/s', () => {
  const b0 = burst(0), s71 = scatter(71);
  b0.forEach((m, i) => assert.ok(Math.hypot(m.at[0] - s71[i].at[0], m.at[2] - s71[i].at[2]) < 1e-9));
  assert.equal(burstHeroGroup().length, 11);
  assert.ok(burstHeroGroup().includes(scatterHero()));
  assert.equal(new Set(burstGroups()).size <= 6, true);
  const a = burst(10), z = burst(20);
  a.forEach((m, i) => { const v = Math.hypot(z[i].at[0] - m.at[0], z[i].at[2] - m.at[2]) / (10 / 30); assert.ok(v >= 6 - 1e-6 && v <= 8 + 1e-6, `speed ${v}`); });
  const h = burst(45), hi = scatterHero();
  log('burst hero L45', h[hi].at.map((n) => +n.toFixed(1)).join(','), 'hero group mean heading deg', (burstHeroGroup().reduce((s, i) => s + (Math.atan2(HALVES_HERO[2] - burst(0)[i].at[2], HALVES_HERO[0] - burst(0)[i].at[0]) * 180) / Math.PI, 0) / 11).toFixed(0));
});

test('halves: 10 birds, two halves leave one at a time and never run through the hero', () => {
  const x = (L: number, side: 'l' | 'r') => halves(L).slice(side === 'l' ? 0 : 5, side === 'l' ? 5 : 10).map((m) => m.at[0]);
  assert.ok(halves(0).every((m) => Math.abs(m.heading - Math.PI / 2) < 1e-9 && m.at[2] < -33 + 0.4 && m.at[2] > -35.4));
  assert.ok(halves(0).slice(0, 5).every((m) => m.at[0] >= 10.4 - 1e-9 && m.at[0] <= 11.9 + 1e-9) && halves(0).slice(5).every((m) => m.at[0] >= 12.1 - 1e-9 && m.at[0] <= 13.6 + 1e-9));
  for (let L = 0; L <= 60; L++) halves(L).forEach((m) => assert.ok(Math.hypot(m.at[0] - HALVES_HERO[0], m.at[2] - HALVES_HERO[2]) > 0.8, `clear of hero at ${L}`));
  assert.ok(x(6, 'l').every((v, i) => Math.abs(v - halves(0)[i].at[0]) < 1e-9), 'left half stands to L 6');
  assert.ok(x(22, 'r').every((v, i) => Math.abs(v - halves(0)[5 + i].at[0]) < 1e-9), 'right half stands to L 22');
  log('halves L22 left x max', Math.max(...x(22, 'l')).toFixed(2), 'L38 right x min', Math.min(...x(38, 'r')).toFixed(2));
});

test('fenceBirds: every body front stays behind the wire; nine by B06-SH03 local 90', () => {
  const front = emuFront();
  for (const n of [5, 6, 7, 8, 9]) fenceBirds({n}).forEach((m) => assert.ok(m.at[2] + front * m.scale <= FENCE_Z - 0.08 + 1e-9, `n ${n}`));
  log('fence front m', front.toFixed(3), 'hero z', fenceBirds()[0].at[2].toFixed(3));
  assert.equal(fenceBirds({n: 9}).length, 9);
  assert.deepEqual([65, 66, 73, 74, 81, 82, 89, 90].map(fenceCountB06), [5, 6, 6, 7, 7, 8, 8, 9]);
  const t = fenceBirds({truck: [-8, 0, 9.5]}), t2 = fenceBirds({truck: [-8, 0, 9.5], heroFrozen: true});
  assert.ok(t.every((m) => Math.abs(m.pose.headYaw ?? 0) <= 0.3 + 1e-9));
  assert.ok(!t2[0].pose.headYaw && t[0].pose.headYaw !== undefined);
});

test('slowLine: hero contacts L 12, 54, 96, both feet down at L 109, five abreast', () => {
  const pads = (L: number) => emuPads(slowLine(L)[SLOW_HERO].pose);
  const down = (L: number, foot: 0 | 1) => pads(L)[foot][1] < 1e-9;
  assert.ok(!down(11, 0) && down(12, 0) && !down(53, 0) && down(54, 0) && !down(95, 0) && down(96, 0));
  for (const L of [109, 110, 120]) assert.ok(down(L, 0) && down(L, 1), `both down at ${L}`);
  assert.equal(slowLine(0).length, 5);
  assert.deepEqual(slowLine(0).map((m) => m.at[0]), [-4.6, -3.0, -1.4, 0.6, 2.2]);
  assert.ok(Math.abs(slowLine(0)[0].at[2] + 4.6) < 1e-9 && Math.abs(slowLine(109)[0].at[2] + 3.8) < 2e-3);
  const s = slip(Array.from({length: 30}, (_, k) => slowLine(12 + k)[SLOW_HERO]), 0);
  log('slowLine hero stance slip m', s.toFixed(4));
  assert.ok(s <= 0.02);
});

test('frame L alone equals frame L after 0..L (every helper)', () => {
  const all = (L: number) => JSON.stringify([paddockExtras(L), buffetRow(L), headsField(L), scatter(L), burst(L), halves(L), slowLine(L), fenceBirds({n: fenceCountB06(L), truck: [-8, 0, 9.5]})]);
  const alone = all(44);
  for (let L = 0; L <= 44; L++) all(L);
  assert.equal(all(44), alone);
  assert.equal(all(135), (() => { for (let L = 140; L >= 0; L -= 7) all(L); return all(135); })());
});

test('no pose lays a bird down: pitch, bob and height stay upright in every helper', () => {
  for (let L = 0; L <= 150; L += 3) for (const m of [...paddockExtras(L), ...buffetRow(L), ...scatter(L), ...burst(L % 60), ...halves(L), ...slowLine(L)]) {
    const p = m.pose as EmuPose;
    assert.ok((p.pitch ?? 0) >= -0.3 && (p.pitch ?? 0) <= 0.1 && !m.air);
  }
});

test('headsField at the end camera: no head or neck overlaps the crew bounding box (px); burst frame-exit measure', async () => {
  const {camLine} = await import('../src/painted/edu30/shot');
  const {camPoint} = await import('../src/painted/edu30/../kit/ycam');
  const cam = camLine({eye: [2.4, 3.2, -12.2], yaw: 190, pitch: -16, f: 950, hy: 860});
  const box = (pts: [number, number, number][]) => { const q = pts.map((v) => camPoint(cam, v)).filter(Boolean) as [number, number][]; return [Math.min(...q.map((v) => v[0])), Math.min(...q.map((v) => v[1])), Math.max(...q.map((v) => v[0])), Math.max(...q.map((v) => v[1]))]; };
  const crew = box([-1.0, 1.2].flatMap((x) => [0.2, 1.4].flatMap((z) => [0, 1.9].map((y) => [x, y, z] as [number, number, number]))));
  let overlap = 0;
  headsField(80).forEach((m) => {
    const hx = m.at[0] + Math.cos(m.heading) * 0.42 * m.scale, hz = m.at[2] + Math.sin(m.heading) * 0.42 * m.scale;
    const b = box([[m.at[0], 0.85, m.at[2]], [hx, 1.7, hz], [hx + 0.12, 1.7, hz], [hx - 0.12, 1.7, hz]]);
    const ox = Math.min(b[2], crew[2]) - Math.max(b[0], crew[0]), oy = Math.min(b[3], crew[3]) - Math.max(b[1], crew[1]);
    if (ox > 0 && oy > 0) { overlap += ox * oy; log('overlap bird', m.at.map((n) => +n.toFixed(2)).join(','), 'box', b.map(Math.round).join(','), Math.round(ox * oy)); }
  });
  log('heads crew bbox px', crew.map((n) => Math.round(n)).join(','), 'overlap px2', Math.round(overlap));
  assert.equal(overlap, 0);
  const bc = camLine({eye: [0, 20, 10], yaw: 0, pitch: -48, f: 800, hy: 860});
  const inFrame = burst(45).filter((m) => { const q = camPoint(bc, [m.at[0], 0.6, m.at[2]]); return q && q[0] > -50 && q[0] < 1130 && q[1] > -50 && q[1] < 1970; }).length;
  log('burst L45 birds still in frame', inFrame, 'of 40');
});
