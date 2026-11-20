import {paintEmu} from '../flock';
import {sunOf} from '../paddock';
import {paintTruckDust, paintTruckRig, truckDustFor, truckPoint, truckState} from '../props';
import {fenceLine, paintVantageSet, VANTAGE_CAM} from '../vantage';
import {makeShot, type Shot30} from '../shot';

// B05-SH03 (Boss T30, 2026-11-20): the retreat vantage, withdrawal one. Five fence birds (T08 layout, backs to the lens, stand idle, heads follow the truck x 0.3),
// the truck (T14 B05-SH03 drive, silhouettes, G2 on its pedestal at rest, dust) leaves along the track beyond the wire in low west sun, cool newsreel tint.
// Space P through the shared vantage set (light m 1, eaten 0.7, stubble 0.4). Title "ถอนทัพ รอบที่ 1" comes from the adapter (T02).
const N = 94, SHOT = 'B05-SH03', LIGHT = 1;
const track = (l: number) => truckState(SHOT, l);

export const def: Shot30 = {
  id: SHOT, N, paper: '#efe6d0',
  cam: (L) => VANTAGE_CAM(SHOT, L),
  paint: (p, L, c, pr) => {
    const st = truckState(SHOT, L)!, dust = {truckAt: truckPoint(st.centre, 1, 0, 0, 0), ...truckDustFor(SHOT)}, sun = sunOf(LIGHT);
    paintVantageSet(p, c, {light: LIGHT, eaten: 0.7, stubble: 0.4}, () => {
      paintTruckDust(p, c, L, track, {part: 'far', ...dust});
      paintTruckRig(p, c, {centre: st.centre, dir: st.dir, pitch: st.pitch, roll: st.roll, riders: 'silhouettes', gear: 'pedestal', g2Elev: st.g2Elev, wheelTurn: st.wheelTurn, t: L / 30, seed: 30300});
      paintTruckDust(p, c, L, track, {part: 'near', ...dust});
      // far to near so the nearest bird overlaps the others
      [...fenceLine(5, {truck: st.centre})].sort((a, b) => b.at[2] - a.at[2] || a.at[0] - b.at[0]).forEach((m) => {
        const a = paintEmu(p, c, m, {sun, lod: m.hero ? 'near' : 'far'});   // render budget: five near birds are ~1.4M brush ops and time the still out (T30 Result)
        if (m.hero) pr?.lead('EMU-HERO', {top: a.top, bottom: a.bottom, x: (a.left + a.right) / 2});
      });
    });
  },
  reel: () => ({strength: 1, tint: 'cool', tintAmount: 1, tintMix: 1, pop: 0}),
};
export const shot = makeShot(def);
