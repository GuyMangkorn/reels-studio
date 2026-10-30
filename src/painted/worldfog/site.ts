import {type Painter, type Pt} from '../kit/painter';
import {blob, projectPoly, quadX, quadY, quadZ, rectPts} from './draw';
import {ease, seg, smoothstep, type Proj} from './space';

// WORLD-SITE (MK-WF-DEP-12, ST-01S; brief VD19 / FP-B): the forecourt, canopy and shop box extended to a site plan with the
// main road, the access lane, the fields and tree clumps, seen from the high wide CAM-HIGH-WIDE. Low detail on purpose: flat
// washes and simple shapes in the FP-B manner (the user accepted Film's rough still as the look, 30 Oct 2026). No figure,
// no assembly. The fog wall is the region above the ground line of its front zF(x) = F + B · smoothstep(2.5, 20, |x|),
// F 14.0 and B 46 easing to 0 over f0–f114 (ST-05), so the wall takes the lane first and the road and fields after it.

export const SITE = {F: 14.0, B: 46, fall: 114};
/** Fog-wall lateral profile B(f): 46 at f0, 21.2 at f60, 9.8 at f80, 0 from f114 (held to the cut). */
export const siteB = (f: number) => SITE.B * (1 - ease(seg(f, 0, SITE.fall)));
/** The wall's front zF(x) (m from the glass along +z) at x metres from the station axis and shot-local frame f. */
export const siteFront = (f: number, x: number) => SITE.F + siteB(f) * smoothstep(2.5, 20, Math.abs(x));

/** Sample x (m) for the wall outline: dense on the station axis, where the front bends. */
const WALL_X = [-200, -120, -60, -40, -25, -15, -10, -7, -4, -2, 0, 2, 4, 7, 10, 15, 25, 40, 60, 120, 200];

/** Tree clumps and their centres (m) and radii (m), ST-01S: z 32…300. */
const CLUMPS: [number, number, number][] = [[-40, 60, 7], [25, 92, 9], [-95, 140, 12], [60, 210, 14], [-20, 300, 18]];

export const paintSite = (p: Painter, proj: Proj, f: number, t: number) => {
  // Night backdrop, then the far fields, tree clumps and the main road with its dashes.
  p.group(100);
  p.wash('#262d2d', 230, rectPts(-300, -400, 1400, 2400), 0.4, 0.5);
  p.group(120);
  const fields = projectPoly(proj, quadY(0, -200, 200, 32, 300));
  if (fields.length) p.wash('#2f3a36', 220, fields, 0.3, 0.5);
  CLUMPS.forEach(([x, z, r], i) => {
    const [cx, cy] = proj.P([x, 0, z]), k = proj.k([x, 0, z]);
    p.wash('#26302c', 200, blob(120 + i, cx, cy, r * k, r * k * 0.55, t), 0.5, 0.45);
  });
  p.group(140);
  const road = projectPoly(proj, quadY(0, -200, 200, 24, 32));
  if (road.length) p.wash('#3a403f', 230, road, 0.3, 0.5);
  for (let i = 0; i < 24; i++) {
    const x0 = -60 + i * 5;
    const dash = projectPoly(proj, quadY(0.001, x0, x0 + 2.5, 27.9, 28.1));
    if (dash.length) p.wash('#c9c4a8', 130, dash, 0.1, 0.3);
  }
  // Access lane x −2…+2, z 14…23: under the wall from f0 (it stays covered: zF = 14 on the axis).
  const lane = projectPoly(proj, quadY(0, -2, 2, 14, 23));
  if (lane.length) p.wash('#3e4442', 220, lane, 0.3, 0.5);

  // The fog wall: the region above its ground line, over the fields, road and lane (painted before the station).
  p.group(200);
  const base: Pt[] = WALL_X.map((x) => proj.P([x, 0, siteFront(f, x)]));
  const body: Pt[] = [...base, [1700, -600], [-600, -600]];
  p.wash('#8d948d', 240, body, 0.5, 0.35);
  // Two lower banks and a bright crest a little above the front line, lightest value at the front.
  const above = (d: number, wob: number): Pt[] => base.map(([x, y], i) => [x, y - d - wob * Math.sin(i * 1.7 + t * 0.2)]);
  p.wash('#a0a79f', 150, [...above(70, 14), [1700, base[base.length - 1][1] - 70], [-600, base[0][1] - 70]], 0.5, 0.4);
  p.wash('#bfc4bb', 150, [...above(26, 6), [1700, base[base.length - 1][1] - 26], [-600, base[0][1] - 26]], 0.4, 0.35);
  const k = proj.k([0, 0, SITE.F]);
  base.forEach(([x, y], i) => {
    if (i % 3 !== 1) return;
    p.wash('#58625f', 90, blob(140 + i, x, y + 6, 1.6 * k, 0.2 * k, t), 0.5, 0.4);
  });
  // Forecourt and the station: the warm pool round the canopy, slab, kerb, canopy roof, pumps, car and the shop box.
  p.group(180);
  const pool = projectPoly(proj, quadY(0.02, -8, 8, 1.5, 15));
  if (pool.length) p.wash('#c9a46a', 46, pool, 0.6, 0.4);
  const slab = projectPoly(proj, quadY(0, -8, 8, 2, 14));
  if (slab.length) p.wash('#5a5f5b', 220, slab, 0.3, 0.5);
  const kerb = projectPoly(proj, quadZ(2.0, -8, 8, 0, 0.12));
  if (kerb.length) p.wash('#8c8f88', 180, kerb, 0.15, 0.4);
  const roof = projectPoly(proj, quadY(5.2, -6, 6, 3.5, 13));
  if (roof.length) p.wash('#4d504a', 240, roof, 0.3, 0.4);
  for (const x of [-3.5, 3.5]) {
    const island = projectPoly(proj, quadY(0.18, x - 0.9, x + 0.9, 9.1, 9.5));
    if (island.length) p.wash('#77796f', 220, island, 0.2, 0.4);
    for (const dx of [-0.45, 0.45]) {
      const pump = projectPoly(proj, quadY(1.75, x + dx - 0.25, x + dx + 0.25, 9.3, 9.5));
      if (pump.length) p.wash('#d9d6c8', 230, pump, 0.15, 0.35);
    }
  }
  const car = projectPoly(proj, quadY(1.45, -4.15, 0.35, 4.2, 6.0));
  if (car.length) p.wash('#353d3f', 240, car, 0.2, 0.4);
  const glint = projectPoly(proj, quadY(1.46, -1.8, -0.4, 4.6, 4.9));
  if (glint.length) p.wash('#cfd6d2', 170, glint, 0.2, 0.3);

  // The shop box is the nearest set piece (z −6…0, between the camera at z −20 and the forecourt): drawn last.
  paintShopBox(p, proj);
};

/** The shop box roof, its lit front edge and its −x side, seen from the high camera. */
const paintShopBox = (p: Painter, proj: Proj) => {
  p.group(300);
  const roofT = projectPoly(proj, quadY(3.3, -3.2, 3.2, -6.2, 0));
  if (roofT.length) p.wash('#2b3233', 240, roofT, 0.2, 0.4);
  const litEdge = projectPoly(proj, quadZ(0, -3.2, 3.2, 3.2, 3.3));
  if (litEdge.length) p.wash('#e2c48e', 230, litEdge, 0.2, 0.3);
  const side = projectPoly(proj, quadX(-3.2, 0, 3.3, -6.2, 0));
  if (side.length) p.wash('#22292a', 240, side, 0.2, 0.4);
};
