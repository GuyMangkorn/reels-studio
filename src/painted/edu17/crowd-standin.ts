// EDU-EP17 SP2 stand-in crowd: heads and shoulders as wash-only polygons on the 0.50 m lattice (+-0.08 m seeded jitter), seen through a kit yaw camera. It exists to
// measure paint time and read density before person-top (N5) and crowd-heads (N6) are built; it is NOT the kit person and the colours are placeholders. The real
// layers replace `paintCrowdStandin` in group 2 (they keep the lattice and the culling rule below).
import {ell, hardFill} from '../kit/draw';
import {hash} from '../kit/hash';
import type {Painter, Pt} from '../kit/painter';
import {camSpace, camToPicture, type YCam} from '../kit/ycam';

export const LATTICE = 0.5, JITTER = 0.08;
/** Head radius (px) from which a head gets 3 polygons / 2 polygons; below that 1. */
export const TIER_NEAR = 10, TIER_MID = 5;
const HAIR = ['#1b1714', '#2a2019', '#3b2c20', '#6b4a2b', '#a9a39a'];
const TEE = ['#7a8fa6', '#b5543f', '#4f7a5a', '#cbb98d', '#5a5f8c', '#c98a5b', '#8a8a8a', '#a8c0c6', '#d6d0c4', '#6f5a46'];
export const MAN_TEE = '#d9a21b';

export type CrowdBox = {x0: number; x1: number; z0: number; z1: number};
/** Heads in a box, nearest the camera last. Culls a head under `minPx` px radius and any node at depth under 0.4 m. Returns the number drawn. */
export const paintCrowdStandin = (p: Painter, cam: YCam, box: CrowdBox, o: {manAt?: [number, number]; minPx?: number; seed?: number; lookDown?: boolean} = {}): number => {
  const minPx = o.minPx ?? 0.5, seed = o.seed ?? 7;
  const nodes: {x: number; z: number; d: number; h: number; i: number}[] = [];
  const i0 = Math.round(box.x0 / LATTICE), i1 = Math.round(box.x1 / LATTICE), j0 = Math.round(box.z0 / LATTICE), j1 = Math.round(box.z1 / LATTICE);
  for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) {
    const k = (i + 400) * 1000 + (j + 400);
    const isMan = !!o.manAt && i === o.manAt[0] && j === o.manAt[1];
    const jx = isMan ? 0 : (hash(seed + k) * 2 - 1) * JITTER, jz = isMan ? 0 : (hash(seed + k * 3 + 1) * 2 - 1) * JITTER;
    const h = isMan ? 1.72 : 1.45 + hash(seed + k * 5 + 2) * 0.3 - (hash(seed + k * 7 + 3) > 0.9 ? 0.35 : 0); // 1.45-1.75 m, some children
    const x = i * LATTICE + jx, z = j * LATTICE + jz;
    const q = camSpace(cam, [x, h - 0.11, z]);
    if (q.d < 0.4) continue;
    nodes.push({x, z, d: q.d, h, i: k});
  }
  nodes.sort((a, b) => b.d - a.d); // far to near
  let drawn = 0;
  for (const n of nodes) {
    const man = !!o.manAt && Math.round(n.x / LATTICE) === o.manAt[0] && Math.round(n.z / LATTICE) === o.manAt[1];
    const rHead = (cam.f * 0.105) / n.d;
    if (rHead < minPx) continue;
    const c = camToPicture(cam, camSpace(cam, [n.x, n.h - 0.11, n.z])), s = camToPicture(cam, camSpace(cam, [n.x, n.h - 0.33, n.z]));
    if (c[0] < -80 || c[0] > 1160 || c[1] < -80 || c[1] > 2000) continue;
    const tee = man ? MAN_TEE : TEE[Math.floor(hash(seed + n.i * 11) * TEE.length)], hair = man ? '#15110f' : HAIR[Math.floor(hash(seed + n.i * 13) * HAIR.length)];
    const sd = 5000 + (n.i % 9000);
    // paint-cost tiers (a wash polygon costs about 0.17 ms here): near heads 3 polygons, mid heads 2, far rows 1 (head dot over the tee tone)
    if (man || rHead >= TIER_NEAR) {
      hardFill(p, sd, tee, ell(s[0], s[1], rHead * 2.0, rHead * (o.lookDown ? 1.1 : 0.95), 10)); // shoulders
      hardFill(p, sd, '#e8bf98', ell(c[0], c[1], rHead * 0.95, rHead, 10)); // face
      hardFill(p, sd, hair, ell(c[0], c[1] - rHead * 0.18, rHead * 1.0, rHead * 0.82, 10)); // hair
    } else if (rHead >= TIER_MID) {
      hardFill(p, sd, tee, ell(s[0], s[1], rHead * 2.0, rHead * 0.95, 7));
      hardFill(p, sd, hair, ell(c[0], c[1], rHead, rHead, 7));
    } else {
      hardFill(p, sd, hair, ell(c[0], c[1] + rHead * 0.4, rHead * 1.5, rHead * 1.5, 5));
    }
    if (man) { // spiky hair: a ring of spikes
      for (let k = 0; k < 9; k++) { const a = (k / 9) * Math.PI * 2, b = a + 0.3; hardFill(p, 5100 + k, hair, [[c[0] + Math.cos(a) * rHead * 0.9, c[1] + Math.sin(a) * rHead * 0.9], [c[0] + Math.cos(a + 0.15) * rHead * 1.5, c[1] + Math.sin(a + 0.15) * rHead * 1.5], [c[0] + Math.cos(b) * rHead * 0.9, c[1] + Math.sin(b) * rHead * 0.9]] as Pt[]); }
    }
    drawn++;
  }
  return drawn;
};
