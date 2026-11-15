import {hardFill, washAt} from '../../kit/draw';
import {mixColor, type Pt} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {camPoint} from '../../kit/ycam';
import {mix, sine} from '../clock';
import {paintHoseClose} from '../hose';
import {C, sheetCam} from '../palette';
import {bedY, cableAt, paintSea} from '../sea';
import {paintSeamEdge, paintUpperBackdrop} from '../split';
import {makeShot} from '../stage';
import {planeBlots, tone} from '../marks';

// S01-B03-SH02 (G 607-660, 53 f) hose vs cable, L07b "หนาแค่ประมาณสายยางรดน้ำ" (sheet EDU-EP17-SHEETS-R1.2; N15). Over-under split: the waterline seam
// wipes up from the frame bottom to y 860 over L0-10 and holds. Upper (R): the hose end in his right fist, sunlit, FLOW. Lower (W deep, SD05): the cable
// coming out of the ooze. Both 0.50 m from the lens at f 1000 = 40 px, left ends at x 300 at L20; both truck 0.1 m along -z over L0-53 (R1.2: N 49 -> 53).
const N = 53;
const dz = (L: number) => -0.1 * sine(L, 0, N);
const camUp = (L: number) => sheetCam([0.18, 0.95, -0.30 + dz(L)], 90, 0.5, 0.95, {f: 1000, hy: 640});
const camLo = (L: number) => sheetCam([-0.46, -41.33, -303 + dz(L)], 90, 0.5, -41.33, {f: 1000, hy: 1080, near: 0.01});
// left ends at screen x 300 at L20: 0.12 m left of the camera's z (0.5 m * 240 / 1000)
const END_UP: V3 = [0.18, 0.95, -0.30 + dz(20) - 0.12];
const EDGE_LO = -303 + dz(20) - 0.12;
export const seamAt = (L: number) => mix(1960, 860, sine(L, 0, 10));

export const shot = makeShot('S01-B03-SH02', {
  paper: '#0f2a40',
  paint: (p, L) => {
    const t = L / 30, lo = camLo(L), up = camUp(L);
    // lower: deep floor seen across the cable, no glow halo (the comparison is the sheath), no generic props at this range
    paintSea(p, lo, {bed: 'view', noProps: true, t, cable: {zFar: lo.z - 1.2, zNear: lo.z + 1.2, step: 0.01, pulses: [], glow: 0}});
    // near floor in front of the cable: ooze lumps and pale specks, flat at this grazing angle
    planeBlots(p, lo, 8860, (u, v) => { const z = lo.z - 0.9 + v * 1.8; return [lo.x + 0.03 + u * 0.42, bedY(z) + 0.0005, z]; }, {n: 70, r: 0.006, flat: 0.12, col: (i) => (i % 3 ? tone('#5f7680', 0.3) : '#9fb4b8')});
    // the floor falls into shadow toward the frame bottom; a faint cyan spill from the cable on the floor just in front of it
    washAt(p, 8870, C.glow, 40, [[-40, 1092], [1120, 1092], [1120, 1150], [-40, 1150]], 0.3, 0);
    [1300, 1500, 1700].forEach((y, i) => washAt(p, 8871 + i, C.deep1, 70 + i * 25, [[-40, y], [1120, y], [1120, 1960], [-40, 1960]], 0.2, 0));
    // the ooze bank burying the cable left of EDGE_LO (its "left end"), sloping to nothing at the edge
    const top: Pt[] = [], foot: Pt[] = [];
    for (let i = 0; i <= 20; i++) {
      const z = EDGE_LO - 0.7 + (0.7 * i) / 20, h = 0.04 * Math.min(1, (EDGE_LO - z) / 0.25) ** 0.7, cx = cableAt(z)[0];
      const a = camPoint(lo, [cx, bedY(z) + h, z]), b = camPoint(lo, [cx - 0.12, bedY(z) - 0.002, z]);
      if (a && b) { top.push(a); foot.push(b); }
    }
    if (top.length > 2) {
      hardFill(p, 8850, mixColor(C.ooze, '#5a6a70', 0.35), [...top, ...foot.reverse()]);
      hardFill(p, 8851, mixColor(C.ooze, '#7a8a8a', 0.3), [...top, ...top.map(([x, y]) => [x, y + 6] as Pt).reverse()]);
    }
    // upper: the sunlit yard above the seam, then the hose in his fist
    const sy = seamAt(L);
    paintUpperBackdrop(p, sy, t);
    paintHoseClose(p, up, END_UP, {t, flow: 1});
    paintSeamEdge(p, sy, t);
  },
});
