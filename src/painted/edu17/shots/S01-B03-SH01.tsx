import {inkLine} from '../../kit/draw';
import {camPoint} from '../../kit/ycam';
import {mix, sine} from '../clock';
import {sheetCam} from '../palette';
import {cableAt, paintSea} from '../sea';
import {makeShot} from '../stage';

// S01-B03-SH01 (G 541-607, 66 f) the deep cable (L07a; sheet EDU-EP17-SHEETS-R1.2, SD05, SD31). The cable on the ooze crossing the frame left to right, one
// pulse riding it (centre at L34, SD31; was L43), a sea pen; dark. Camera trucks 3 m along the cable (z -300 -> -303), `at` on cableAt(z), eye = cable y + 0.25.
const N = 66;
const cam = (L: number) => { const z = mix(-300, -303, sine(L, 0, N)), a = cableAt(z); return sheetCam([a[0], a[1], z], 90, 1.6, a[1] + 0.25, {f: 1000, hy: 745, near: 0.05}); };
export const shot = makeShot('S01-B03-SH01', {
  paper: '#08192a',
  paint: (p, L) => {
    const c = cam(L), pz = c.z + (L - 34) * -0.045;
    paintSea(p, c, {bed: 'view', noProps: true, t: L / 30, cable: {zFar: c.z - 6, zNear: c.z + 6, step: 0.03, pulses: [pz], glow: 1}});
    // a sea pen beside the cable and two small ooze mounds (the deep floor's life, dark)
    ([[-0.1, -301.2, 0.35], [0.5, -302.6, 0.25], [-0.8, -299.8, 0.3]] as const).forEach(([dx, z, h], i) => {
      const a = cableAt(z), b = camPoint(c, [a[0] + dx + 0.5, a[1] - 0.01, z]), t = camPoint(c, [a[0] + dx + 0.52, a[1] + h, z]);
      if (b && t) { inkLine(p, 6900 + i, [b, t], {closed: false, color: '#b9786a', weight: 3, still: true, curve: 0}); inkLine(p, 6910 + i, [[t[0] - 6, t[1] + 14], t, [t[0] + 6, t[1] + 14]], {closed: false, color: '#d89a88', weight: 2, still: false, curve: 0.4}); }
    });
  },
});
