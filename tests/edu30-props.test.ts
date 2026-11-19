import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildLewisGun, lewisAnchors, lewisCock, lewisJamNudge, lewisPanTurn, lewisRecoil, PAN_STEP} from '../src/painted/edu30/props';

// EDU-EP30-SHORT ticket T13 r1: Lewis gun anchors, recoil, pan turn, jam nudge, cocking rack.
const DEG = Math.PI / 180;
const rounds = (first: number, n: number, gap: number) => Array.from({length: n}, (_, i) => first + i * gap);
const near = (a: readonly number[], b: readonly number[], tol: number, what: string) => a.forEach((v, i) => assert.ok(Math.abs(v - b[i]) <= tol, `${what}[${i}] ${v.toFixed(3)} vs ${b[i]} +-${tol}`));

test('anchors follow the placeBuild transform: barrel direction and the muzzle ahead of the tripod head', () => {
  const a = lewisAnchors([0, 0, 0], -Math.PI / 2);
  near(a.dir, [0, Math.sin(0.04), -Math.cos(0.04)], 1e-9, 'dir');
  assert.ok(a.muzzle[2] < -0.6 && a.muzzle[2] > -0.7);
  const b = lewisAnchors([-5.6, 0.32, -5.0], 0);
  assert.ok(b.port[2] > b.pan[2], 'port on the receiver right (+z for a gun facing +x)');
  assert.ok(b.cock[2] > b.pan[2], 'cocking handle on the receiver right');
  assert.ok(b.cock[0] < b.port[0], 'handle behind the port');
});

test('build anchors equal lewisAnchors in the local frame', () => {
  const B = buildLewisGun({recoil: {back: 0.005, rise: 0.3 * DEG}, cock: 0.5});
  const a = lewisAnchors([0, 0, 0], 0, {recoil: {back: 0.005, rise: 0.3 * DEG}, cock: 0.5});
  near(B.anchors.muzzle, a.muzzle.map((v, i) => (i === 2 ? -v : v)), 1e-9, 'muzzle');
  near(B.anchors.cock, a.cock.map((v, i) => (i === 2 ? -v : v)), 1e-9, 'cock');
});

test('lewisRecoil: k 0, 1, >= 2', () => {
  const r = rounds(2, 23, 3);
  assert.deepEqual(lewisRecoil(1, r), {back: 0, rise: 0});
  assert.deepEqual(lewisRecoil(2, r), {back: 0.005, rise: 0.3 * DEG});
  assert.deepEqual(lewisRecoil(3, r), {back: 0.0025, rise: 0.15 * DEG});
  assert.deepEqual(lewisRecoil(4, r), {back: 0, rise: 0});
  assert.deepEqual(lewisRecoil(5, r), {back: 0.005, rise: 0.3 * DEG});
  assert.deepEqual(lewisRecoil(70, r), {back: 0, rise: 0});
  assert.ok(Math.abs(0.3 * DEG - 0.00524) < 1e-5);
});

test('pan turn: 7.66 degrees per round, 23 rounds 176.18, 11 rounds 84.26, none before round 1', () => {
  assert.equal(lewisPanTurn(1, rounds(2, 23, 3)), 0);
  assert.ok(Math.abs(lewisPanTurn(2, rounds(2, 23, 3)) - PAN_STEP) < 1e-12);
  assert.ok(Math.abs(lewisPanTurn(68, rounds(2, 23, 3)) / DEG - 176.18) <= 0.1);
  assert.ok(Math.abs(lewisPanTurn(40, rounds(10, 11, 3)) / DEG - 84.26) <= 0.1);
  assert.ok(Math.abs(lewisPanTurn(67, rounds(2, 23, 3)) / DEG - 168.52) <= 0.1, 'step lands on the round frame, not before');
});

test('tripod feet identical at k 0 and k 2; the gun body moves', () => {
  const feet = (B: ReturnType<typeof buildLewisGun>) => B.parts.filter((p) => p.m === 6).map((p) => p.keys[p.keys.length - 1].p);
  const k0 = buildLewisGun({recoil: lewisRecoil(2, [2])}), k2 = buildLewisGun({recoil: lewisRecoil(4, [2])});
  assert.equal(feet(k0).length, 3);
  assert.deepEqual(feet(k0), feet(k2));
  assert.notDeepEqual(k0.anchors.muzzle, k2.anchors.muzzle);
  assert.ok(Math.abs(k2.anchors.muzzle[0] - k0.anchors.muzzle[0]) > 0.004, 'muzzle back 5 mm');
});

test('default options keep the locked look: no handle, same anchors as before', () => {
  const B = buildLewisGun();
  assert.equal(B.flats.length, 0);
  assert.equal(B.parts.length, 9);
  near(B.anchors.muzzle, [0.66 * Math.cos(0.04), 0.56 + 0.66 * Math.sin(0.04), 0], 1e-9, 'muzzle');
  assert.equal(buildLewisGun({cock: 0}).parts.length, 11);
});

test('cock 1 is 0.12 m behind cock 0 along -dir; rack keys', () => {
  const a0 = lewisAnchors([0, 0, 0], 0, {cock: 0}), a1 = lewisAnchors([0, 0, 0], 0, {cock: 1});
  const d = [a0.cock[0] - a1.cock[0], a0.cock[1] - a1.cock[1], a0.cock[2] - a1.cock[2]];
  assert.ok(Math.abs(Math.hypot(...d) - 0.12) < 1e-9);
  assert.ok(Math.abs(d[0] * a0.dir[0] + d[1] * a0.dir[1] + d[2] * a0.dir[2] - 0.12) < 1e-9);
  assert.deepEqual([0, 3, 6, 7].map(lewisCock), [0, 1, 0, 0]);
  assert.ok(lewisCock(1) > 0.5 && lewisCock(2) < 1 && lewisCock(5) < lewisCock(4) && lewisCock(4) < 1, 'out then in');
});

test('jam nudge: 2 degrees over local 4..11, then still; pure in L', () => {
  assert.equal(lewisJamNudge(0), 0);
  assert.equal(lewisJamNudge(4), 0);
  assert.ok(Math.abs(lewisJamNudge(11) / DEG - 2) < 1e-9);
  assert.equal(lewisJamNudge(21), lewisJamNudge(11));
  assert.ok(lewisJamNudge(7) / DEG > 1, 'ease-out: past half at the middle');
  assert.ok(Math.abs((lewisPanTurn(40, rounds(10, 11, 3)) + lewisJamNudge(11)) / DEG - 86.26) <= 0.1);
});
