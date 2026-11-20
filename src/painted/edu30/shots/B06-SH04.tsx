import {emuWingWave} from '../emu';
import {paintEmu} from '../flock';
import {sunOf} from '../paddock';
import {paintTruckDust, paintTruckRig, truckDustFor, truckPoint, truckState} from '../props';
import {fenceLine, paintVantageSet, VANTAGE_CAM} from '../vantage';
import {makeShot, type Shot30} from '../shot';

// B06-SH04 (Boss T32, 2026-11-20): withdrawal two, same framing and truck path as B05-SH03 (T30 vantage). Low west sun (light 1), stubble and eaten 1.0, cool tint, nine fence birds,
// the truck (T14 B06-SH04) pulls away to frame left by L 40. EMU-HERO back view: one swing of T15 `emuWingWave(L, {back: true})` (L 36-44, folded by 50), head +0.3 toward the truck.
// The title "ถอนทัพ รอบที่ 2" comes from the adapter (T02).
const N = 58, SHOT = 'B06-SH04', LIGHT = 1;

export const def: Shot30 = {
  id: SHOT, N, paper: '#efe6d0',
  cam: (L) => VANTAGE_CAM(SHOT, L),
  paint: (p, L, c, pr) => {
    const st = truckState(SHOT, L)!, sun = sunOf(LIGHT), track = (l: number) => truckState(SHOT, l), dust = {truckAt: truckPoint(st.centre, 1, 0, 0, 0), ...truckDustFor(SHOT)};
    paintVantageSet(p, c, {light: LIGHT, eaten: 1, stubble: 1}, () => {
      paintTruckDust(p, c, L, track, {part: 'far', ...dust});
      paintTruckRig(p, c, {centre: st.centre, dir: st.dir, pitch: st.pitch, roll: st.roll, riders: 'silhouettes', gear: 'pedestal', g2Elev: st.g2Elev, wheelTurn: st.wheelTurn, t: L / 30, seed: 30300});
      paintTruckDust(p, c, L, track, {part: 'near', ...dust});
      [...fenceLine(9, {truck: st.centre})].sort((a, b) => b.at[2] - a.at[2] || a.at[0] - b.at[0]).forEach((m) => {
        const a = paintEmu(p, c, m.hero ? {...m, pose: emuWingWave(L, {back: true})} : m, {sun, lod: m.hero ? 'near' : 'far'});
        if (m.hero) {
          pr?.lead('EMU-HERO', {top: a.top, bottom: a.bottom, x: (a.left + a.right) / 2});
          const tip = a.pt('wingTipL');
          if (tip) pr?.lead('wingTip (x = tip x, top = bottom = tip y)', {top: tip[1], bottom: tip[1], x: tip[0]});
        }
      });
    });
  },
  reel: () => ({strength: 1, tint: 'cool', tintAmount: 1, tintMix: 1, pop: 0}),
};
export const shot = makeShot(def);
