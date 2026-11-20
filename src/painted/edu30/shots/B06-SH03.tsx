import {paintEmu} from '../flock';
import {sunOf} from '../paddock';
import {paintTruckDust, paintTruckRig, truckDustFor, truckPoint, truckState} from '../props';
import {fenceLine, paintVantageSet, VANTAGE_CAM} from '../vantage';
import {makeShot, type Shot30} from '../shot';

// B06-SH03 (Boss T32, 2026-11-20): the retreat vantage again, the sequel and the time-lapse. EMU-HERO (back view, frozen) never moves. L 0-58 morning (light 0, eaten 0.7, stubble 0.4),
// the truck drives in from frame left L 27-45 (T14, dir -1, dust). L 59-94 six held days of 6 f (`jumpOf`): sun W/NE swing, eaten and stubble climb, truck parked/gone, birds 5..9 (T08 add frames
// L 66, 74, 82, 90 shown from the jump whose block holds them). L 95-98 low west light, truck parked dir +1 at x 2.0, tint cools (tintMix 0 -> 1). Warm tint until then.
const N = 99, SHOT = 'B06-SH03';
const jumpOf = (L: number): number => (L < 59 ? -1 : Math.min(5, Math.floor((L - 59) / 6)));
const LIGHT = [1, 0, 1, 0, 1, 1];
const ADDS = [66, 74, 82, 90];
/** Day state at shot-local L: sun m, eaten, stubble and bird count (the held values inside a jump block). */
export const dayOf = (L: number) => {
  const j = jumpOf(L);
  if (j < 0) return {light: 0, eaten: 0.7, stubble: 0.4, count: 5};
  const hi = 59 + 6 * j + 5;   // last frame of the block: an add frame inside the block shows from its jump on
  return {light: LIGHT[j], eaten: 0.7 + 0.06 * j, stubble: 0.4 + 0.12 * j, count: 5 + ADDS.filter((a) => a <= hi).length};
};

export const def: Shot30 = {
  id: SHOT, N, paper: '#efe6d0',
  cam: (L) => VANTAGE_CAM(SHOT, L),
  paint: (p, L, c, pr) => {
    const d = dayOf(L), sun = sunOf(d.light), st = truckState(SHOT, L), arrive = (l: number) => (l < 59 ? truckState(SHOT, l) : null), dustOn = L < 59;
    const dust = {truckAt: st ? truckPoint(st.centre, 1, 0, 0, 0) : undefined, ...truckDustFor(SHOT)};
    paintVantageSet(p, c, {light: d.light, eaten: d.eaten, stubble: d.stubble}, () => {
      if (st && dustOn) paintTruckDust(p, c, L, arrive, {part: 'far', ...dust});
      if (st) paintTruckRig(p, c, {centre: st.centre, dir: st.dir, pitch: st.pitch, roll: st.roll, riders: 'silhouettes', gear: 'pedestal', g2Elev: st.g2Elev, wheelTurn: st.wheelTurn, t: L / 30, seed: 30300});
      if (st && dustOn) paintTruckDust(p, c, L, arrive, {part: 'near', ...dust});
      // far to near so the nearest bird overlaps the others; the hero is frozen (no head turn toward the truck) and paints near, the rest far (render budget, as T30)
      [...fenceLine(d.count, {truck: st?.centre, heroFrozen: true})].sort((a, b) => b.at[2] - a.at[2] || a.at[0] - b.at[0]).forEach((m) => {
        const a = paintEmu(p, c, m, {sun, lod: m.hero ? 'near' : 'far'});
        if (m.hero) pr?.lead('EMU-HERO', {top: a.top, bottom: a.bottom, x: (a.left + a.right) / 2});
      });
    });
  },
  reel: (L) => ({strength: 1, tint: 'cool', tintAmount: 1, tintMix: Math.max(0, Math.min(1, (L - 94) / 4)), pop: 0}),
};
export const shot = makeShot(def);
