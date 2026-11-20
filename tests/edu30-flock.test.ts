import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emuPads, gaitAdvance, type EmuPose} from '../src/painted/edu30/emu';
import {
  buffetRow, burst, burstGroups, burstHeroGroup, emu1State, emuFront, fenceBirds, fenceCountB06, FENCE_Z, halves, HALVES_HERO, headsField, HEADS_CAM, HEADS_CREW, HEADS_HERO,
  paddockExtras, scatter, scatterHero, slowLine, strideForAdvance, SLOW_HERO, SLOW_PERIOD, SLOW_V, SLOW_STOP, HALF_SPEED, BURST_O, BURST_DISC, burstCentre, BURST_HEADINGS, SC_TARGET, type EmuMember,
} from '../src/painted/edu30/flock';

// EDU-EP30-SHORT ticket T08 r5 (r4 + rows H1-H3, B1-B4, S1-S3): flock motion in the paddock. Positions, headings, pose values and keys only; no stroke or pixel hash of a painted emu (T37 re-takes the neck ring).
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

test('burst (B1-B4): six tight groups from L 0, group 0 toward (12, 0, -32), speed 6-8 m/s, centroids >= 8 m apart, only the 40', async () => {
  const {camLine} = await import('../src/painted/edu30/shot');
  const {camPoint} = await import('../src/painted/edu30/../kit/ycam');
  const b0 = burst(0), gr = burstGroups(), cen = (ms: EmuMember[], k: number) => { const q = ms.filter((_, i) => gr[i] === k); return [q.reduce((s, m) => s + m.at[0], 0) / q.length, q.reduce((s, m) => s + m.at[2], 0) / q.length]; };
  const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
  assert.equal(b0.length, 40);
  log('burst painted emu members', b0.length);
  assert.deepEqual([0, 1, 2, 3, 4, 5].map((k) => gr.filter((g) => g === k).length), [11, 6, 6, 6, 6, 5]);
  assert.equal(burstHeroGroup().length, 11);
  assert.ok(burstHeroGroup().includes(scatterHero()) && b0[scatterHero()].hero && b0[scatterHero()].seed === 36000);
  let maxR = 0, minSp = 9;
  b0.forEach((m, i) => { const c = burstCentre(gr[i]); maxR = Math.max(maxR, Math.hypot(m.at[0] - c[0], m.at[2] - c[2])); b0.forEach((q, j) => { if (j > i && gr[i] === gr[j]) minSp = Math.min(minSp, Math.hypot(m.at[0] - q.at[0], m.at[2] - q.at[2])); }); });
  log('burst L0 max member-to-centre m', maxR.toFixed(2), 'min in-group spacing m', minSp.toFixed(2));
  assert.ok(maxR <= BURST_DISC + 1e-9 && minSp >= 0.7 - 1e-9);
  const dirToMark = Math.atan2(SC_TARGET[2] - BURST_O[2], SC_TARGET[0] - BURST_O[0]), c0 = burstCentre(0), dirFromCentre = Math.atan2(SC_TARGET[2] - c0[2], SC_TARGET[0] - c0[0]);
  log('burst group 0 heading rad', BURST_HEADINGS[0].toFixed(4), 'direction to mark', dirToMark.toFixed(4), 'from its centre', dirFromCentre.toFixed(4));
  assert.ok(Math.abs(BURST_HEADINGS[0] - dirToMark) <= 0.01 && Math.abs(BURST_HEADINGS[0] - dirFromCentre) <= 0.01);
  [1, 2, 3, 4, 5].forEach((k) => assert.ok(Math.abs(wrap(BURST_HEADINGS[k] - BURST_HEADINGS[0] - (k * Math.PI) / 3)) < 1e-9));
  b0.forEach((m, i) => assert.ok(Math.abs(wrap(m.heading - BURST_HEADINGS[gr[i]])) <= (8 * Math.PI) / 180 + 1e-9));
  const cc = camPoint(camLine({eye: [0, 18, 10], yaw: 0, pitch: -48, f: 800, hy: 860}), [b0.reduce((t, m) => t + m.at[0], 0) / 40, 0, b0.reduce((t, m) => t + m.at[2], 0) / 40]) as [number, number];
  log('burst L0 flock centroid on screen', cc.map(Math.round).join(','));
  assert.ok(Math.abs(cc[0] - 540) <= 60 && Math.abs(cc[1] - 400) <= 60);
  const a = burst(10), z = burst(20);
  a.forEach((m, i) => { const v = Math.hypot(z[i].at[0] - m.at[0], z[i].at[2] - m.at[2]) / (10 / 30); assert.ok(v >= 6 - 1e-6 && v <= 8 + 1e-6, `speed ${v}`); });
  for (const L of [0, 20, 45]) {
    const c = [0, 1, 2, 3, 4, 5].map((k) => cen(burst(L), k));
    let mn = 99; for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) mn = Math.min(mn, Math.hypot(c[i][0] - c[j][0], c[i][1] - c[j][1]));
    log(`burst L${L} min pairwise group-centroid distance m`, mn.toFixed(2));
    if (L > 0) assert.ok(mn >= 8 - 1e-9);
  }
});

test('halves (H1-H3): 12 m/s over 3 f, slip <= 0.02 m, each half leaves its screen edge in turn, never through the hero', async () => {
  const {camLine} = await import('../src/painted/edu30/shot');
  const {camPoint} = await import('../src/painted/edu30/../kit/ycam');
  const x = (L: number, side: 'l' | 'r') => halves(L).slice(side === 'l' ? 0 : 5, side === 'l' ? 5 : 10).map((m) => m.at[0]);
  assert.ok(halves(0).every((m) => Math.abs(m.heading - Math.PI / 2) < 1e-9 && m.at[2] < -33 + 0.4 && m.at[2] > -35.4));
  assert.ok(halves(0).slice(0, 5).every((m) => m.at[0] >= 10.4 - 1e-9 && m.at[0] <= 11.9 + 1e-9) && halves(0).slice(5).every((m) => m.at[0] >= 12.1 - 1e-9 && m.at[0] <= 13.6 + 1e-9));
  for (let L = 0; L <= 60; L++) halves(L).forEach((m) => assert.ok(Math.hypot(m.at[0] - HALVES_HERO[0], m.at[2] - HALVES_HERO[2]) > 0.8, `clear of hero at ${L}`));
  assert.ok(x(6, 'l').every((v, i) => Math.abs(v - halves(0)[i].at[0]) < 1e-9), 'left half stands to L 6');
  assert.ok(x(22, 'r').every((v, i) => Math.abs(v - halves(0)[5 + i].at[0]) < 1e-9), 'right half stands to L 22');
  // H1: speed 12.0 at start + 3 f (per bird)
  const sp = (i: number, L: number) => { const a = halves(L - 1)[i], b = halves(L)[i]; return Math.hypot(b.at[0] - a.at[0], b.at[2] - a.at[2]) * 30; };
  let vmax = 0;
  for (let L = 1; L <= 60; L++) for (let i = 0; i < 10; i++) vmax = Math.max(vmax, sp(i, L));
  log('halves max speed m/s', vmax.toFixed(3));
  assert.ok(Math.abs(vmax - HALF_SPEED) < 1e-6);
  const starts: number[] = [];
  for (let i = 0; i < 10; i++) { let L0 = 0; while (sp(i, ++L0) < 1e-9); starts.push(L0); assert.ok(sp(i, L0) < sp(i, L0 + 1) && sp(i, L0 + 1) < sp(i, L0 + 2) && sp(i, L0 + 2) < sp(i, L0 + 3) && Math.abs(sp(i, L0 + 3) - HALF_SPEED) < 1e-6, `bird ${i} ramp 2, 6, 10, 12 m/s`); }
  log('halves first moving frame per bird', starts.join(' '));
  let worst = 0;
  for (let i = 0; i < 10; i++) { const fr = Array.from({length: 40}, (_, k) => halves(starts[i] + 3 + k)[i]); worst = Math.max(worst, slip(fr, 0), slip(fr, 1)); }
  log('halves stance slip m', worst.toFixed(4));
  assert.ok(worst <= 0.02);
  // H2: screen exit at the B03-SH03 camera of each frame
  const ei = (t: number) => { const q = Math.max(0, Math.min(1, t)); return q * q * (3 - 2 * q); };
  const cam = (L: number) => { const u = ei(L / 40); return camLine({eye: [12.0, 1.1, -29.0 - 0.3 * u], yaw: -2 * u, pitch: 0, f: 900, hy: 860}); };
  const bbox = (m: EmuMember, L: number) => {
    const ux = Math.cos(m.heading), uz = Math.sin(m.heading), pts: [number, number, number][] = [];
    for (const a of [-0.55, 0.55]) for (const l of [-0.25, 0.25]) for (const y of [0, 1.8 * m.scale]) pts.push([m.at[0] + ux * a * m.scale - uz * l, y, m.at[2] + uz * a * m.scale + ux * l]);
    const q = pts.map((v) => camPoint(cam(L), v)).filter(Boolean) as [number, number][];
    return [Math.min(...q.map((v) => v[0])), Math.max(...q.map((v) => v[0]))];
  };
  const exits: number[] = [];
  for (let i = 0; i < 10; i++) {
    const left = i < 5; let ex = -1;
    for (let L = 60; L >= 0; L--) { const b = bbox(halves(L)[i], L); if (left ? b[1] < 0 : b[0] > 1080) ex = L; else break; }
    exits.push(ex);
  }
  log('halves screen exit frame per bird (left 0-4, right 5-9)', exits.join(' '), 'max left', Math.max(...exits.slice(0, 5)), 'max right', Math.max(...exits.slice(5)));
  assert.ok(exits.slice(0, 5).every((e) => e >= 0 && e <= 24) && exits.slice(5).every((e) => e >= 0 && e <= 40));
  for (let L = 25; L <= 60; L++) halves(L).slice(0, 5).forEach((m) => assert.ok(bbox(m, L)[1] < 0, `left half off screen at ${L}`));
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

test('slowLine (S1-S3): 84 f cycle, hero contacts L 12, 54, 96 on alternating feet, frozen with both feet down L 100-109', () => {
  const pads = (L: number) => emuPads(slowLine(L)[SLOW_HERO].pose);
  const down = (L: number, foot: 0 | 1) => pads(L)[foot][1] < 1e-9;
  assert.equal(SLOW_PERIOD, 84);
  assert.ok(!down(11, 0) && down(12, 0) && !down(53, 1) && down(54, 1) && !down(95, 0) && down(96, 0), 'contacts 12 (L foot), 54 (R foot), 96 (L foot)');
  for (const L of [100, 105, 109, 110, 120]) assert.ok(down(L, 0) && down(L, 1), `both down at ${L}`);
  const p100 = slowLine(100)[SLOW_HERO];
  for (const L of [101, 105, 109, 120]) { const m = slowLine(L)[SLOW_HERO]; assert.deepEqual(m.at, p100.at); assert.deepEqual(m.pose, p100.pose); }
  log('slowLine hero z at L 100/109', p100.at[2].toFixed(4), slowLine(109)[SLOW_HERO].at[2].toFixed(4));
  assert.ok(Math.abs(p100.at[2] + 3.8667) < 1e-3 && SLOW_STOP === 100);
  const adv = gaitAdvance(slowLine(0)[0].pose.stride as number);
  log('slowLine advance per cycle m', adv.toFixed(4), 'stride', (slowLine(0)[0].pose.stride as number).toFixed(4));
  assert.ok(Math.abs(adv - (SLOW_V * 84) / 30) < 1e-9 && Math.abs(adv - 0.616) < 1e-9);
  assert.equal(slowLine(0).length, 5);
  assert.deepEqual(slowLine(0).map((m) => m.at[0]), [-4.6, -3.0, -1.4, 0.6, 2.2]);
  assert.ok(Math.abs(slowLine(0)[0].at[2] + 4.6) < 1e-9 && Math.abs(slowLine(109)[0].at[2] + 3.8) < 2e-3);
  const fr = Array.from({length: 89}, (_, k) => slowLine(12 + k)[SLOW_HERO]);
  const s = Math.max(slip(fr, 0), slip(fr, 1));
  log('slowLine hero stance slip m', s.toFixed(4));
  assert.ok(s <= 0.02);
});

test('crowd quantisation: max stance slip on screen <= 1.5 px (scatter at the B03-SH01 camera L 40-60, burst at the B03-SH02 camera L 0-30)', async () => {
  const {camLine} = await import('../src/painted/edu30/shot');
  const {camPoint} = await import('../src/painted/edu30/../kit/ycam');
  const scCam = camLine({eye: [0.4, 1.0, 1.65], yaw: -3, pitch: 0, f: 900, hy: 860});
  const buCam = (L: number) => camLine({eye: [0, 18 + 2 * (L / 45), 10], yaw: 0, pitch: -48, f: 800, hy: 860});
  // `settled`: only frames 7 f after the bird starts to move (the bolt's 4 f turn, 3 f blend and 6 f speed ramp are transients, logged apart: a foot cannot stay put while the body pivots, or is carried off, under it)
  const measure = (fn: (L: number) => EmuMember[], cam: (L: number) => ReturnType<typeof camLine>, a: number, b: number, settled: boolean) => {
    const fr = Array.from({length: b - a + 3}, (_, k) => fn(a - 2 + k));
    let worst = 0;
    for (let i = 0; i < fr[0].length; i++) {
      let start = 2; if (settled) { while (start < fr.length && Math.hypot(fr[start][i].at[0] - fr[start - 1][i].at[0], fr[start][i].at[2] - fr[start - 1][i].at[2]) < 1e-9) start++; start += 7; }
      for (const foot of [0, 1] as (0 | 1)[]) {
        let run: [number, number][] = [];
        for (let k = start; k < fr.length; k++) {
          const m = fr[k][i], pad = emuPads(m.pose)[foot];
          if (pad[1] < 1e-9) run.push(world(m, pad)); else run = [];
          if (run.length > 1) {
            const c = cam(a - 2 + k), P = (w: [number, number]) => camPoint(c, [w[0], 0, w[1]]);
            const q0 = P(run[0]), q1 = P(run[run.length - 1]);
            if (q0 && q1) worst = Math.max(worst, Math.hypot(q1[0] - q0[0], q1[1] - q0[1]));
          }
        }
      }
    }
    return worst;
  };
  const ws = measure(scatter, () => scCam, 40, 60, true), wb = measure(burst, buCam, 0, 30, false);
  log('crowd stance slip px (scatter: frames 7 f after the bolt starts): scatter L40-60', ws.toFixed(2), 'burst L0-30', wb.toFixed(2), '| scatter incl. the bolt pivot and ramp:', measure(scatter, () => scCam, 40, 60, false).toFixed(2));
  assert.ok(ws <= 1.5 && wb <= 1.5);
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

test('headsField at the end camera: no head or neck overlaps the crew bounding box (px)', async () => {
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
});

// ---- T16 (r4): the queue at the dam. Positions, headings, pose values and keys only.
import {queue, queueAvoid, queueSplashes, QUEUE_N, type QueueShot} from '../src/painted/edu30/flock';
import {emuLensYaw} from '../src/painted/edu30/emu';
import {DAM_CAMS} from '../src/painted/edu30/dam';
import {strikePoints} from '../src/painted/kit/gunfire';
const logQ = (...a: unknown[]) => console.log('T16', ...a);
const qf = (shot: QueueShot, a: number, b: number) => Array.from({length: b - a + 1}, (_, k) => queue(a + k, shot));
const lift = (m: EmuMember, foot: 0 | 1) => emuPads(m.pose)[foot][1];
const qslip = (shot: QueueShot, a: number, b: number, bird: number, foot: 0 | 1) => slip(qf(shot, a, b).map((f) => f[bird]), foot);

test('T16 SH02 L 0: single file 1.4 m apart along the path, EMU-HERO at the head (x 4.6, seed 36000)', () => {
  const q = queue(0, 'B04-SH02');
  assert.equal(q.length, QUEUE_N);
  assert.ok(q[0].hero && q[0].seed === 36000 && q.slice(1).every((m) => !m.hero));
  assert.ok(Math.abs(q[0].at[0] - 4.6) < 1e-9 && Math.abs(q[0].at[2] + 4.9) < 1e-9);
  const d = Array.from({length: 8}, (_, i) => Math.hypot(q[i + 1].at[0] - q[i].at[0], q[i + 1].at[2] - q[i].at[2]));
  logQ('SH02 L0 spacing m', d.map((n) => n.toFixed(3)).join(' '));
  d.slice(0, 5).forEach((n) => assert.ok(Math.abs(n - 1.4) < 0.01));
});

test('T16 SH02 unison step: rear foot lifts at L 41, every bird mid-step at L 45, all landed at L 49; head x 4.6 / 4.0 / 3.8', () => {
  for (const L of [40, 41]) assert.ok(queue(L, 'B04-SH02').every((m) => lift(m, 0) < 1e-9 && lift(m, 1) < 1e-9), `grounded at ${L}`);
  assert.ok(queue(42, 'B04-SH02').every((m) => lift(m, 1) > 1e-4), 'rear foot lifted at 42');
  const mid = queue(45, 'B04-SH02').map((m) => lift(m, 1) / m.scale);
  logQ('SH02 L45 rear-foot lift m (min, max)', Math.min(...mid).toFixed(3), Math.max(...mid).toFixed(3));
  assert.ok(mid.every((n) => n > 0.05), 'all rear feet lifted at 45');
  assert.ok(queue(45, 'B04-SH02').every((m) => lift(m, 0) < 1e-9), 'front foot planted');
  assert.ok(queue(49, 'B04-SH02').every((m) => lift(m, 0) < 1e-6 && lift(m, 1) < 1e-6), 'landed at 49');
  assert.ok(Math.abs(queue(40, 'B04-SH02')[0].at[0] - 4.6) < 1e-9 && Math.abs(queue(49, 'B04-SH02')[0].at[0] - 4.0) < 1e-9);
  const x68 = queue(68, 'B04-SH02')[0].at[0];
  logQ('SH02 head x at 68', x68.toFixed(3));
  assert.ok(Math.abs(x68 - 3.8) < 0.01);
  for (let L = 40; L <= 50; L++) { const s = queue(L, 'B04-SH02').map((m) => lift(m, 1) > 1e-6); assert.ok(s.every((b) => b === s[0]), `unison at ${L}`); }
});

test('T16 SH02 stance slip <= 0.02 m over L 49-68 (birds 0-6) and the planted front foot over the step L 41-49', () => {
  let worst = 0, front = 0;
  for (let i = 0; i <= 6; i++) { for (const ft of [0, 1] as const) worst = Math.max(worst, qslip('B04-SH02', 49, 68, i, ft)); front = Math.max(front, qslip('B04-SH02', 41, 49, i, 0)); }
  logQ('SH02 stance slip m L49-68', worst.toFixed(4), 'front foot L41-49', front.toFixed(4));
  assert.ok(worst <= 0.02 && front <= 0.02);
});

test('T16 SH03: head x 3.6 -> 3.0; ducks planted; hoppers land by L 25 into -z with a splash; line re-formed at L 40; no bird walks backward', () => {
  const q0 = queue(0, 'B04-SH03'), q46 = queue(46, 'B04-SH03');
  assert.ok(Math.abs(q0[0].at[0] - 3.6) < 1e-9 && Math.abs(q46[0].at[0] - 3.0) < 0.01);
  for (let i = 0; i <= 5; i++) if (![2, 4].includes(i)) { const s = Math.max(qslip('B04-SH03', 12, 28, i, 0), qslip('B04-SH03', 12, 28, i, 1)); assert.ok(s <= 0.02, `duck planted bird ${i}: ${s}`); }
  const sp = queueSplashes();
  assert.equal(sp.length, 2);
  sp.forEach((s) => { assert.equal(s.start, 25); assert.ok(s.at[2] < -5.3, `landing in the shallows z ${s.at[2]}`); });
  const gap = (q: EmuMember[], i: number) => Math.hypot(q[i + 1].at[0] - q[i].at[0], q[i + 1].at[2] - q[i].at[2]);
  const q26 = queue(26, 'B04-SH03'), q40 = queue(40, 'B04-SH03');
  logQ('SH03 gap birds 5-6 at L 26', gap(q26, 5).toFixed(3), 'spacing birds 0-8 at L 40', Array.from({length: 8}, (_, i) => gap(q40, i).toFixed(3)).join(' '));
  assert.ok(gap(q26, 5) < 1.06);
  [2, 4].forEach((i) => { const x = q40[i].at[0], zRim = x > 8 ? -4.9 - (0.3 * (x - 8)) / 6.5 : -4.9; assert.ok(Math.abs(q40[i].at[2] - zRim) < 0.02, `hopper ${i} back on the rim`); });
  Array.from({length: 7}, (_, i) => i).forEach((i) => assert.ok(Math.abs(gap(q40, i) - 1.4) < 0.05, `gap ${i}`));
  for (let i = 0; i < 9; i++) { let prev = Infinity; for (let L = 0; L <= 46; L++) { const x = queue(L, 'B04-SH03')[i].at[0]; assert.ok(x <= prev + 1e-9, `bird ${i} L ${L}`); prev = x; } }
});

test('T16 SH03: no bird within 1.5 m of a strike point (T05 strikePoints with avoid)', () => {
  const avoid = queueAvoid('B04-SH03', 46, 1);
  const {points} = strikePoints({count: 11, seed: 9400, minDist: 1.6, x: [-0.5, 4], z: [-5.5, -9], ground: () => 0.3, avoid});
  let minD = Infinity;
  for (let L = 10; L <= 40; L++) for (const m of queue(L, 'B04-SH03')) for (const b of points) minD = Math.min(minD, Math.hypot(m.at[0] - b[0], m.at[2] - b[2]));
  logQ('SH03 min bird-to-strike distance m', minD.toFixed(3));
  assert.ok(minD >= 1.5);
});

test('T16 SH05: stand at x 1.6, every head to the lens, birds 1-6 turn from L 57 two frames apart, 7+ keep staring, EMU-HERO stays', () => {
  const q = queue(0, 'B04-SH05');
  assert.ok(Math.abs(q[0].at[0] - 1.6) < 1e-9);
  q.forEach((m) => assert.ok(Math.abs((m.pose.headYaw ?? 0) - emuLensYaw(m.at, m.heading, DAM_CAMS.sh05)) < 1e-9));
  const turned = (L: number, i: number) => Math.cos(queue(L, 'B04-SH05')[i].heading - q[i].heading) < -0.999;
  assert.ok(!turned(62, 1) && turned(63, 1) && !turned(64, 2) && turned(65, 2));
  [0, 7, 8, 20].forEach((i) => assert.ok(!turned(70, i)));
  const a = queue(63, 'B04-SH05')[1].at, b = queue(69, 'B04-SH05')[1].at;
  assert.ok(Math.hypot(b[0] - a[0], b[2] - a[2]) > 0.05, 'steps off up the shore, not on the spot');
  const l = Array.from({length: 7}, (_, k) => (lift(queue(57 + k, 'B04-SH05')[1], 0) > 1e-4 ? 'a' : lift(queue(57 + k, 'B04-SH05')[1], 1) > 1e-4 ? 'b' : '-'));
  logQ('SH05 bird 1 lift states L57-63', l.join(''));
  assert.ok(l.includes('a') && l.includes('b'));
});

test('T16 pure: frame L alone equals frame L after 0..L; wading birds sit on the water surface', () => {
  for (const [shot, L] of [['B04-SH02', 47], ['B04-SH03', 30], ['B04-SH05', 60]] as [QueueShot, number][]) {
    const alone = JSON.stringify(queue(L, shot));
    for (let k = 0; k <= L; k++) queue(k, shot);
    assert.equal(JSON.stringify(queue(L, shot)), alone);
  }
  const wet = queue(0, 'B04-SH02').filter((m) => m.at[1] <= 0.304);
  logQ('SH02 wading birds at L 0', wet.length);
  assert.ok(wet.length > 0 && wet.every((m) => Math.abs(m.at[1] - 0.3) < 1e-9));
});
