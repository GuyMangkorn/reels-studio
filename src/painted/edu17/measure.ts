// EDU-EP17 W3 thumbnail and look-frame measures (Film): MAN's projected head top (1.72 m) and feet, clipped to the frame, per yard camera. Pinhole numbers
// from the same cameras the thumbnails use; run `npx tsx src/painted/edu17/measure.ts`.
import {camPoint, type YCam} from '../kit/ycam';
import {lookAtCam, sheetCam} from './palette';
import {cLF01, cLF01R, cLF04} from './looks-cams';
const cams: Record<string, YCam> = {
  T1A: sheetCam([-0.30, 1.10, -0.55], 3, 1.95, 1.68, {f: 1000, hy: 640}),
  'T1B/T1C': lookAtCam([-0.85, 1.6, 1.0], [0, 1.1, -1.5], 950, 700),
  T4A: sheetCam([-0.3, 1.6, -3], 2, 4.1, 1.9, {f: 1000, hy: 980}),
  T4B: sheetCam([-0.3, 1.5, -3], 6, 4.4, 1.75, {f: 900, hy: 1100}),
  LF01: cLF01, LF01R: cLF01R, LF04: cLF04,
};
for (const [id, c] of Object.entries(cams)) {
  const top = camPoint(c, [0, 1.72, 0]), feet = camPoint(c, [0, 0, 0]), chin = camPoint(c, [0, 1.72 - 0.425, 0]);
  if (!top || !feet || !chin) { console.log(id, 'behind lens'); continue; }
  const t = Math.max(0, top[1]), b = Math.min(1920, feet[1]);
  console.log(`${id}: head top y ${top[1].toFixed(0)}, chin y ${chin[1].toFixed(0)}, feet y ${feet[1].toFixed(0)}, visible lead ${(b - t).toFixed(0)} px, head x ${top[0].toFixed(0)}`);
}
