// R3 (Boss): measure ELDER's arm segments in world metres. The rig shoulder (picture px) is unprojected onto the body plane (z = seat z + lean z).
import type {Brush} from '../../../src/painted/BrushCanvas';
import {makePainter} from '../../../src/painted/kit/painter';
import {paintDining, SEAT} from '../../../src/painted/edu09/dining';
import {SH04_MOVE, D01_LAMP_Y} from '../../../src/painted/edu09/scenes';
import {camAt} from '../../../src/painted/edu09/stage';
import {stopSitters, gentleStopAt, ELDER_LEAN} from '../../../src/painted/edu09/tracks';
import type {YCam} from '../../../src/painted/kit/ycam';
import type {V3} from '../../../src/painted/kit/space';
const brush = new Proxy({}, {get: () => () => undefined}) as Brush;
const unproject = (c: YCam, px: [number, number], zPlane: number): V3 => {
  const rp = (px[0] - 540 - (c.cx ?? 0)) / c.f, up = (c.hy - px[1]) / c.f;
  const cs = Math.cos(c.pitch ?? 0), sn = Math.sin(c.pitch ?? 0);
  // unit ray in camera space (r, u, d) -> yaw frame
  const uc = up, dc = 1, u = uc * cs + dc * sn, d = dc * cs - uc * sn;
  const s = Math.sin(c.yaw), co = Math.cos(c.yaw), dx = rp * co + d * s, dz = rp * s - d * co;
  const t = (zPlane - c.z) / dz;
  return [c.x + dx * t, c.y + u * t, zPlane];
};
const dist = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const bendDeg = (s: V3, e: V3, h: V3) => { const a = [e[0] - s[0], e[1] - s[1], e[2] - s[2]], b = [h[0] - e[0], h[1] - e[1], h[2] - e[2]]; const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; return (Math.acos(dot / (Math.hypot(...a) * Math.hypot(...b))) * 180) / Math.PI; };
export const measure = (L: number) => {
  const c = camAt(SH04_MOVE, L, 68), st = stopSitters(L);
  const out = paintDining(makePainter(brush, {t: L / 30, frame: L}), c, {boy: st.boy, elder: st.elder, lampY: D01_LAMP_Y} as never);
  const zb = SEAT.elder[2] + (st.elder.lean?.[1] ?? 0);
  const sR = unproject(c, out.elder!.rShoulder as [number, number], zb), sL = unproject(c, out.elder!.lShoulder as [number, number], zb);
  const g = gentleStopAt(L), eL = st.elder.lElbow!, hL = st.elder.lHand!;
  const hR = g.hand, eR = g.elbow;
  const wr = (h: V3, e: V3): V3 => { const dx = h[0] - e[0], dz = h[2] - e[2], l = Math.hypot(dx, dz); return [h[0] - (dx / l) * 0.08, h[1], h[2] - (dz / l) * 0.08]; };
  const hl = wr(hL, eL), hr = wr(hR, eR);
  return {L, eR, eL, hr, hl, c, shR: out.elder!.rShoulder as [number, number], shL: out.elder!.lShoulder as [number, number], upperR: dist(sR, eR), foreR: dist(eR, hr), upperL: dist(sL, eL), foreL: dist(eL, hl), bendR: bendDeg(sR, eR, hr), bendL: bendDeg(sL, eL, hl), sR, sL};
};
if (process.argv[1]?.endsWith('r3-arm.ts')) for (const L of [0, 12, 20, 27, 47, 67]) { const m = measure(L); console.log(L, 'upper R/L', m.upperR.toFixed(3), m.upperL.toFixed(3), (m.upperR / m.upperL).toFixed(2), 'fore R/L', m.foreR.toFixed(3), m.foreL.toFixed(3), (m.foreR / m.foreL).toFixed(2), 'bend R/L', m.bendR.toFixed(0), m.bendL.toFixed(0), 'sR', m.sR.map((v) => v.toFixed(2)).join(','), 'sL', m.sL.map((v) => v.toFixed(2)).join(',')); }
void ELDER_LEAN;
