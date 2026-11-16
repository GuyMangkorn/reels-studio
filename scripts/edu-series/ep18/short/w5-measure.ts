// EDU-EP18-SHORT W5 Boss measure (16 Nov 2026): the hippo rig's real eye / jaw-tip / snout points per shot, projected through the sheet's
// cameras, beside the sheet's Run marks (scene-sheets.md, projection-run.py). Usage: npx tsx scripts/edu-series/ep18/short/w5-measure.ts
import {apply, H3_TIP, hardParts, HIPPO3D_WATER, rig, type V3} from '../../../../src/painted/edu18/hippo3d-sdf';
import {HIPPO_SHOTS, b01sh02CanoeX} from '../../../../src/painted/edu18/hippo-shots';
import {cam} from '../../../../src/painted/edu18/looks-cams';
import {selfieCam} from '../../../../src/painted/edu18/post-photo';
import {camPoint, type YCam} from '../../../../src/painted/kit/ycam';

const toWorld = (at: V3, heading: number, q: V3): V3 => { const t = ((90 - heading) * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t); return [at[0] + q[0] * c + q[2] * s, at[1] - HIPPO3D_WATER + q[1], at[2] - q[0] * s + q[2] * c]; };
const pts = (id: string, L: number, g: number) => {
  const st = HIPPO_SHOTS[id](L, g), R = rig(st.pose), eyes = hardParts(R).filter((h) => h.kind === 'eye').map((h) => apply(h.frame, h.at));
  const eye: V3 = [0, 1, 2].map((i) => eyes.reduce((a, e) => a + e[i], 0) / eyes.length) as V3;
  return {eye: toWorld(st.at, st.heading, eye), tip: toWorld(st.at, st.heading, apply(R.head, H3_TIP))};
};
const px = (c: YCam, v: V3) => { const q = camPoint(c, v); return q ? `(${q[0].toFixed(0)}, ${q[1].toFixed(0)})` : 'behind'; };
const rows: [string, YCam, string, 'eye' | 'tip', string, number, number][] = [
  ['B01-SH01 start, jaw tip at the peak (L14 pose)', cam([0.6, 0.7, -1.3], -18, 6.6, 1.0, 2100, 700), 'B01-SH01', 'tip', '(682, 597)', 14, 14],
  ['B01-SH01 end (LF01), jaw tip', cam([0.6, 0.7, -1.3], -12, 6.0, 1.0, 2100, 700), 'B01-SH01', 'tip', '(739, 588)', 60, 60],
  ['B01-SH02 start, eyes', cam([b01sh02CanoeX(0), 0.7, 0], 72, 3.0, 0.95, 1700, 760), 'B01-SH02', 'eye', '(167, 843)', 0, 127],
  ['B01-SH02 end, eyes', cam([b01sh02CanoeX(36), 0.7, 0], 78, 3.0, 0.95, 1700, 760), 'B01-SH02', 'eye', '(314, 843)', 36, 163],
  ['B01-SH03 start, eyes', cam([7.5, 0.55, -0.25], 82, 9.6, 1.2, 2100, 740), 'B01-SH03', 'eye', '(421, 817)', 0, 163],
  ['B01-SH03 halt, eyes', cam([7.5, 0.55, -0.25], 82, 9.1, 1.2, 2100, 740), 'B01-SH03', 'eye', '(497, 852)', 30, 193],
  ['B01-SH05 start, eyes', cam([12, 0, -2], 30, 14, 4, 900, 700, {pitch: -12}), 'B01-SH05', 'eye', '(150, 705)', 0, 241],
  ['B01-SH05 end, eyes', cam([12, 0, -2], 40, 20, 9, 900, 700, {pitch: -22}), 'B01-SH05', 'eye', '(299, 665)', 55, 296],
  // B02-SH01 through the post-photo selfieCam (re-framed 16 Nov 2026); the Run marks are the sheet's, for the old lens
  ['B02-SH01 start, eyes', selfieCam(0), 'B02-SH01', 'eye', '(180, 1025)', 0, 297],
  ['B02-SH01 L29 (post photo), eyes', selfieCam(29), 'B02-SH01', 'eye', '(277, 1025)', 29, 326],
  ['B02-SH03 start, eyes', cam([59.6, 1.2, 14.5], 20, 2.4, 1.5, 1000, 600), 'B02-SH03', 'eye', '(523, 709)', 0, 389],
  ['B02-SH03 end, eyes (sunk by then: mark only)', cam([60.05, 1.35, 14.81], 12, 0.9, 1.55, 1000, 700, {pitch: -8}), 'B02-SH03', 'eye', '(363, 686)', 30, 419],
];
for (const [name, c, id, k, run, L, g] of rows) console.log(`${name}: rig ${px(c, pts(id, L, g)[k])} · Run mark ${run}`);

// snake head (kit anchor `head`) through the B04-SH03 camera, beside the Run (head 583 -> 627, 804 -> 840; raised sandal 443 -> 376, 687 -> 700)
import {paintSnake} from '../../../../src/painted/kit/snake';
import {SNAKE_SHOTS} from '../../../../src/painted/edu18/path-shots';
for (const [L, e] of [[0, 0], [20, 20 / 88], [87, 1]] as const) {
  const c = cam([0.35, 0.45, -0.2], 40 - 8 * e, 0.9 - 0.1 * e, 0.62, 1200, 760, {pitch: -10, near: 0.05}), s = SNAKE_SHOTS['B04-SH03'](L);
  const a = paintSnake(null, c, s.build, {...s.place});
  console.log(`B04-SH03 L${L} (linear cam e ${e.toFixed(2)}): snake head ${JSON.stringify(a.pt('head')?.map((v) => Math.round(v)))} snout ${JSON.stringify(a.pt('snout')?.map((v) => Math.round(v)))} world head ${a.world('head').map((v) => v.toFixed(2))}`);
}
