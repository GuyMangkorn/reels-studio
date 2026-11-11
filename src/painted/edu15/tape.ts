// EDU-EP15 N3 masking-tape strip stuck on the ceiling plaster beside the hero foot (shot 15). A ribbon in the tokay's local frame (u along the body, v across, n out of the plaster):
// the fixed end `uA`, the free end `uB`; `curl` 0..1 peels the free end up and back (toward -u) from the tip on a radius of 6 mm, the same way the toes roll (the roll of the foot is
// `pose.roll`). Pure of its arguments (seekable). Returns the width and the curled length in px for the QA numbers.
import {hardFill, inkLine} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import type {Frame} from './tokay';

export type TapeOpts = {uA: number; uB: number; v: number; /** Strip width in metres (default 0.018). */ width?: number; curl: number};
export const paintTape = (p: Painter, c: YCam, f: Frame, o: TapeOpts): {widthPx: number; curlPx: number} => {
  const w = o.width ?? 0.018, R = 0.006, len = o.uB - o.uA, lc = Math.min(0.03, o.curl * 0.032), lf = len - lc;
  const W = (u: number, v: number, n: number): V3 => [f.o[0] + f.U[0] * u + f.V[0] * v + f.N[0] * n, f.o[1] + f.U[1] * u + f.V[1] * v + f.N[1] * n, f.o[2] + f.U[2] * u + f.V[2] * v + f.N[2] * n];
  const near = c.near ?? 0.01;
  const P = (u: number, v: number, n: number): Pt | null => camPoint(c, W(u, v, n), near);
  // centreline samples: flat part then the arc (u(phi) = u1 + R sin phi, n = 0.0004 + R (1 - cos phi))
  const cl: {u: number; n: number; phi: number}[] = [];
  const nf = 6; for (let i = 0; i <= nf; i++) cl.push({u: o.uA + (lf * i) / nf, n: 0.0004, phi: 0});
  const phiMax = lc / R, na = Math.max(0, Math.ceil(phiMax / 0.35));
  for (let i = 1; i <= na; i++) { const ph = (phiMax * i) / na; cl.push({u: o.uA + lf + R * Math.sin(ph), n: 0.0004 + R * (1 - Math.cos(ph)), phi: ph}); }
  let curlPx = 0, widthPx = 0;
  for (let i = 1; i < cl.length; i++) {
    const a = cl[i - 1], b = cl[i];
    const q = [P(a.u, o.v - w / 2, a.n), P(a.u, o.v + w / 2, a.n), P(b.u, o.v + w / 2, b.n), P(b.u, o.v - w / 2, b.n)];
    if (q.some((x) => !x)) continue;
    const under = b.phi > Math.PI / 2 && b.phi < Math.PI * 1.5 + 0.2, lit = 0.5 + 0.5 * Math.cos(b.phi - 0.6);
    const col = under ? mixColor('#d3c397', '#e8dcb9', 0.3) : mixColor('#dccda3', '#f4ead0', lit);
    hardFill(p, 66200 + i, col, q as Pt[]);
    if (i % 2 === 0) inkLine(p, 66240 + i, [q[0]!, q[1]!], {closed: false, weight: 0.5, color: '#b5a57c', still: true});
  }
  const e0 = P(o.uA, o.v - w / 2, 0.0004), e1 = P(o.uA, o.v + w / 2, 0.0004), t0 = P(o.uA + lf, o.v, 0.0004), t1 = P(o.uB, o.v, 0.0004);
  if (e0 && e1) widthPx = Math.hypot(e0[0] - e1[0], e0[1] - e1[1]);
  const mid = W(o.uA + len / 2, o.v, 0); widthPx = Math.max(widthPx, w * camUnit(c, mid, near));
  if (t0 && t1) curlPx = Math.hypot(t0[0] - t1[0], t0[1] - t1[1]);
  // the fixed edge: a thin darker rim along both long edges of the flat part (the strip lies on the plaster)
  const r0 = [P(o.uA, o.v - w / 2, 0.0004), P(o.uA + lf, o.v - w / 2, 0.0004)], r1 = [P(o.uA, o.v + w / 2, 0.0004), P(o.uA + lf, o.v + w / 2, 0.0004)];
  for (const [r, id] of [[r0, 66290], [r1, 66291]] as const) if (r[0] && r[1]) inkLine(p, id, [r[0], r[1]], {closed: false, weight: 0.8, color: '#a79770', still: true});
  return {widthPx: Math.round(widthPx), curlPx: Math.round(curlPx)};
};
