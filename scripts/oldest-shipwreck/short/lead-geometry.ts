// Geometric lead extents of SHIPWRECK-SHORT plates in screen pixels at a shot-local time (TL02, episode-only).
// Usage: npx tsx scripts/oldest-shipwreck/short/lead-geometry.ts   Prints one line per shot: lead, top, bottom, height.
// Jar outlines come from jarHalf (outline only, handles excluded), clipped at each jar's sand line; cameras from the registry.
import {cameraAt} from '../../../src/painted/registry';
import {toScreen, type Camera} from '../../../src/painted/kit/camera';
import {jarHalf} from '../../../src/painted/jar';
import {range, rot, type Pt} from '../../../src/painted/kit/painter';
import {hash} from '../../../src/painted/kit/hash';
import {diverBounds} from '../../../src/painted/diver';
import {HERO_JAR, SITE_JARS} from '../../../src/painted/shots/shipwreck';

type J = [number, number, number, number, boolean, number];
const outline = (cx: number, cy: number, len: number, a: number, bury = Infinity): Pt[] => {
  const f = rot(cx, cy, len, a);
  return [...range(20, (u) => f([u - 0.5, -jarHalf(u)])), ...range(20, (u) => f([0.5 - u, jarHalf(1 - u)]))].map(([x, y]) => [x, Math.min(y, bury)] as Pt);
};
const field = (jars: J[], o: {settle?: number; squash?: number} = {}) => jars.flatMap(([cx, cy0, len, a], i) => {
  const cy = 850 - (850 - cy0) * (o.squash ?? 1);
  return outline(cx, cy, len, a, cy + len * (0.1 + 0.08 * hash(i + 120) - 0.07 * (o.settle ?? 0)));
});
const wide = (pts: Pt[]) => pts.map(([x, y]) => [540 + (x - 540) * 0.8, 850 + (y - 850) * 0.8] as Pt);
const report = (shot: string, tl: number, lead: string, pts: Pt[]) => {
  const c: Camera = cameraAt(`SHIPWRECK-${shot}`, tl);
  const ys = pts.map((p) => toScreen(c, p)[1]);
  const top = Math.min(...ys), bottom = Math.max(...ys);
  console.log(`${shot} tl ${tl}: ${lead} top ${top.toFixed(0)} bottom ${bottom.toFixed(0)} height ${(bottom - top).toFixed(0)}`);
};
const H = HERO_JAR;
report('SH01', 0, 'jar group', field(SITE_JARS as J[]));
report('SH01', 3, 'jar group', field(SITE_JARS as J[]));
report('SH02', 4.7, 'jar group (wide, intent smaller)', wide(field(SITE_JARS as J[])));
report('SH04a', 2.57, 'jar group', field(SITE_JARS as J[], {settle: 0.8, squash: 0.97}));
report('SH04b', 4.5, 'hero jar (length on x: 620 x s)', outline(H.cx, H.cy, H.len, H.angle));
report('SH05', 2.57, 'near jar', field([[560, 772, 300, 0.22, false, 2]]));
{
  // SH05 diver (hip 470, 392 + hover drift; s 84, a 0.32) with the near jar: the brief's >= 480 px group.
  const d = diverBounds(470 + 10 * Math.sin(2.57 * 0.35 + 5), 392 + 6 * Math.sin(2.57 * 0.5 + 10), 84, 0.32, 0, false);
  report('SH05', 2.57, 'diver + near jar group', [...field([[560, 772, 300, 0.22, false, 2]]), [d.left, d.top], [d.right, d.bottom]]);
  console.log(`SH05 diver head-to-fin ${(Math.hypot(d.right - d.left, d.bottom - d.top)).toFixed(0)} px (bounding diagonal, world)`);
}
report('SH06', 2.87, 'hero jar', outline(H.cx, H.cy, H.len, H.angle));
report('SH07a', 3.17, 'left jar (right equal)', outline(300, 560, 500, Math.PI / 2));
report('SH07b', 2.5, 'hero jar', outline(H.cx, H.cy, H.len, H.angle));
report('SH08', 2.8, 'jar group (wide)', wide(field(SITE_JARS as J[])));
report('SH09a', 1.3, 'jar mouth + shoulder', [[540, 366], [540, 862]]);
report('SH09b', 1.8, 'jar group (= SH01 frame 0)', field(SITE_JARS as J[]));
