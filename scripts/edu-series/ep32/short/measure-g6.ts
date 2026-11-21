// EDU-EP32 G6 plate measures (Boss W5.2, 2026-11-21): B05-SH01..B06-SH01 screen positions and cap heights of the memo lines (a monospace layout
// model of memo-type.tsx in the 'B06-FIT' body layout: Courier advance 0.6 em, body cap 0.06, subject cap 0.09), the stamp box, the printout and
// its fragment lines, per key frame; stamp coverage by the printout at rest.
//   node --import tsx scripts/edu-series/ep32/short/measure-g6.ts
import {camPoint, camUnit, type YCam} from '../../../../src/painted/kit/ycam';
import {MEMO, MEMO_STAMP, memoPt} from '../../../../src/painted/edu32/office';
import {B05SH01_N, b05sh01Cam} from '../../../../src/painted/edu32/b05-sh01';
import {B05SH02_N, b05sh02Cam} from '../../../../src/painted/edu32/b05-sh02';
import {B05SH03_N, b05sh03Cam} from '../../../../src/painted/edu32/b05-sh03';
import {B06SH01_N, PRINTOUT, b06sh01Cam, printoutCorners, printoutPose, printoutPt} from '../../../../src/painted/edu32/b06-sh01';
import {PRINTOUT_LAYOUT} from '../../../../src/painted/edu32/printout-text';
import {B05SH02_TYPE, B05SH03_STAMP} from '../../../../src/painted/edu32/b05-memo';

const K = 1000, BODY_FS = (0.06 / 0.57) * K, ADV = 0.6 * BODY_FS, SUBJ_FS = (0.09 / 0.57) * K;
const bodyTop = 0.76 * K, bodyLH = 0.098 * K, subjTop = Number(process.env.SUBJ_TOP ?? 0.30) * K;
/** Page px (from the top-left) -> world on the memo. */
const pw = (x: number, y: number) => memoPt(x / K - MEMO.w / 2, y / K - MEMO.h / 2, MEMO.y + 0.002);
const bodyBase = (line: number) => bodyTop + (line - 1) * bodyLH + (bodyLH - 1.133 * BODY_FS) / 2 + 0.833 * BODY_FS;
const subjBase = (line: number) => subjTop + (line - 1) * 150 + (150 - 1.133 * SUBJ_FS) / 2 + 0.833 * SUBJ_FS;
// spans: [label, x0 px, x1 px, baseline, cap px]
const spans: [string, number, number, number, number][] = [
  ['subj1 "SUBJECT: Views on"', 200, 200 + 17 * 0.6 * SUBJ_FS, subjBase(1), 0.57 * SUBJ_FS],
  ['subj2 "Trained Cats ▬"', 200, 200 + 13 * 0.6 * SUBJ_FS + 330, subjBase(2), 0.57 * SUBJ_FS],
  ['subj3 "for ▬ Use"', 200, 1228, subjBase(3), 0.57 * SUBJ_FS],
  ['body1 bar1.5', 200, 1706, bodyBase(1), 60],
  ['L2 "▬ This is"', 200 + 1169, 200 + 1612, bodyBase(2), 60],
  ['L3 "in itself a remarkable"', 200, 200 + 22 * ADV, bodyBase(3), 60],
  ['L4 "scientific achievement."', 200, 200 + 23 * ADV, bodyBase(4), 60],
  ['L8 "not be practical."', 200, 200 + 17 * ADV, bodyBase(8), 60],
  ['L7 "▬ …it would"', 200, 200 + 906 + 10 * ADV, bodyBase(7), 60],
];
const f0 = (n: number) => n.toFixed(0);
const memoRow = (c: YCam) => spans.map(([n, x0, x1, b, cap]) => {
  const a = camPoint(c, pw(x0, b)), z = camPoint(c, pw(x1, b)), top = camPoint(c, pw((x0 + x1) / 2, b - cap)), mid = camPoint(c, pw((x0 + x1) / 2, b));
  if (!a || !z || !top || !mid) return `${n}: behind`;
  return `${n}: x ${f0(a[0])}..${f0(z[0])} y ${f0(top[1])}-${f0(mid[1])} cap ${f0(mid[1] - top[1])}px`;
}).join('\n    ');
const stampBox = (c: YCam) => {
  const r = (MEMO_STAMP.rot * Math.PI) / 180, pts = [[-0.5, -0.22], [0.5, -0.22], [0.5, 0.22], [-0.5, 0.22]].map(([u, v]) => {
    const x = u * Math.cos(r) - v * Math.sin(r), z = u * Math.sin(r) + v * Math.cos(r);
    return camPoint(c, memoPt(MEMO_STAMP.x + x * MEMO_STAMP.w, MEMO_STAMP.z + z * MEMO_STAMP.h * 2.27 * 0.44 / 0.44 / 2.27, MEMO.y + 0.002));
  });
  if (!pts.every(Boolean)) return 'stamp behind';
  const xs = pts.map((p) => p![0]), ys = pts.map((p) => p![1]);
  // stamp letter cap: font 0.3 x h, Arial Black caps ~0.72 em
  const ctr = memoPt(MEMO_STAMP.x, MEMO_STAMP.z, MEMO.y), cap = 0.3 * MEMO_STAMP.h * 0.72 * camUnit(c, ctr);
  return `stamp x ${f0(Math.min(...xs))}..${f0(Math.max(...xs))} y ${f0(Math.min(...ys))}..${f0(Math.max(...ys))} letter cap ~${cap.toFixed(1)}px (x-scale only)`;
};
const report = (name: string, c: YCam) => console.log(`${name} eye (${c.x.toFixed(2)}, ${c.y.toFixed(2)}, ${c.z.toFixed(2)})\n    ${memoRow(c)}\n    ${stampBox(c)}`);

for (const L of [0, 26, 50, 76, B05SH01_N - 1]) report(`B05-SH01 L${L}`, b05sh01Cam(L));
for (const L of [0, B05SH02_TYPE.a[1], 60, B05SH02_TYPE.b[1], B05SH02_N - 1]) report(`B05-SH02 L${L}`, b05sh02Cam(L));
for (const L of [0, 20, B05SH03_STAMP.impact, B05SH03_N - 1]) report(`B05-SH03 L${L}`, b05sh03Cam(L));
for (const L of [0, 10, 20, 24, 89, B06SH01_N - 1]) {
  const c = b06sh01Cam(L), o = printoutPose(L), q = printoutCorners(o).map((v) => camPoint(c, v));
  const H = PRINTOUT.h / 2, W = PRINTOUT.w / 2, fr = (top: number, w: number) => {
    const b = top + PRINTOUT_LAYOUT.line * 0.75, a = camPoint(c, printoutPt(o, 0.2 - W, b / K - H)), z = camPoint(c, printoutPt(o, 0.2 - W + w, b / K - H));
    const t = camPoint(c, printoutPt(o, 0.2 - W + w / 2, (b - 0.06 * K) / K - H)), m = camPoint(c, printoutPt(o, 0.2 - W + w / 2, b / K - H));
    return a && z && t && m ? `x ${f0(a[0])}..${f0(z[0])} y ${f0(t[1])}-${f0(m[1])} cap ${f0(m[1] - t[1])}px` : 'behind';
  };
  console.log(`B06-SH01 L${L} printout corners ${q.map((p) => (p ? `(${f0(p[0])},${f0(p[1])})` : 'behind')).join(' ')} | frag1 ${fr(PRINTOUT_LAYOUT.frag1Top, 1.0)} | frag2 ${fr(PRINTOUT_LAYOUT.frag2Top, 1.7)}`);
  if (L === 24 || L === B06SH01_N - 1) report(`B06-SH01 L${L} memo`, c);
}
