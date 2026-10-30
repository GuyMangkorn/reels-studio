// BLOOP-BRIEF-R7 H09/H10 measurements for SH13 P1–P4 (Boss pass 5): the P1–P2 profile silhouette (bounding box, glints,
// no overlap with the far ice), the front head's shadow and spine schedule, the lip-line frame and the swallow keys.
// Screen = world − (160, 0) while the camera is static (s 1). Writes the profile polygons to
// out/qa/the-bloop/b10-profile-polys.json for scripts/the-bloop/region-luma.py. Usage:
//   node --import tsx scripts/the-bloop/measure-b10-profile.ts
import {writeFileSync} from 'node:fs';
import {profileParts} from '../../src/painted/bloop/creatures';
import {keelRing} from '../../src/painted/bloop/sets';
import {FAR_ICE, SH13_LIP_FRAME, sh13Mouth, sh13K, sh13Shadow, sh13Jaw, sh13Profile} from '../../src/painted/shots/bloop';

type Pt = [number, number];
const round = (v: number, d = 1) => Math.round(v * 10 ** d) / 10 ** d;
const scr = (p: Pt): Pt => [p[0] - 160, p[1]];
const bb = (pts: Pt[]) => {
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  return [round(Math.min(...xs)), round(Math.min(...ys)), round(Math.max(...xs)), round(Math.max(...ys))];
};
const overlap = (a: number[], b: number[]) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];

const profileAt = (c: number) => {
  const pr = sh13Profile(c);
  const sp = profileParts(pr.hx, pr.hy, pr.len, pr.bend, pr.sx);
  const all = [...sp.body, ...sp.head, ...sp.fins.flat()].map(scr);
  return {frame: c, len: round(pr.len), headCentreScreen: scr([pr.hx, pr.hy]).map((v) => round(v)), sx: round(pr.sx, 3), bboxScreen: bb(all), glintsScreen: sp.eyes.map((e) => ({c: scr(e.c).map((v) => round(v)), rPx: round(e.r, 2)})), polys: {body: sp.body.map(scr), head: sp.head.map(scr), fins: sp.fins.flat().map(scr)}};
};

const ice = bb(keelRing(FAR_ICE).map(scr));
const frames = [164, 190, 219, 230, 234, 240, 244];
const profiles = frames.map(profileAt);
const profileChecks = profiles.map((p) => ({frame: p.frame, len: p.len, bboxScreen: p.bboxScreen, iceBboxScreen: ice, overlapsIce: overlap(p.bboxScreen, ice)}));
writeFileSync('out/qa/the-bloop/b10-profile-polys.json', JSON.stringify(Object.fromEntries(profiles.map((p) => [`P${p.frame}`, p.polys]))));

const front = [234, 240, 244, 250, 256, 266, 277, 286, 296, 307, 320, 343].map((c) => ({
  frame: c, k: round(sh13K(c), 3), shadow: round(sh13Shadow(c), 3), jawOpen: round(sh13Jaw(c), 3), mouthWorld: sh13Mouth(c).map((v) => round(v)), mouthScreen: scr(sh13Mouth(c)).map((v) => round(v)),
}));
const maxFrontShadow = Math.max(...front.filter((f) => f.frame >= 234).map((f) => f.shadow));
const spineHalved = front.map((f) => ({frame: f.frame, spineScale: f.shadow > 0.3 ? 0.5 : 1}));

console.log(JSON.stringify({
  iceBboxScreen: ice,
  profile: profileChecks,
  maxFrontHeadShadow: maxFrontShadow,
  spineScale: spineHalved,
  front,
  lipFrame: SH13_LIP_FRAME,
  profileGlintsAt164: profiles[0].glintsScreen,
  profileGlintsAt219: profiles[2].glintsScreen,
}, null, 1));
