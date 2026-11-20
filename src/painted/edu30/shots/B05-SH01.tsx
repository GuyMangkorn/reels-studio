import {truckPoint, truckState, truckCam, truckSetCam, paintTruckRig, paintTruckDust, truckDustFor} from '../props';
import {paintPaddockScene, sunOf} from '../paddock';
import {EMU_POSES, WING_FLAP_OUT, WING_FOLD, gaitPhase, wingMix} from '../emu';
import {footEvents, paintFlock, paintPuffs, type EmuMember} from '../flock';
import {DEFAULT_REEL, makeShot, type Shot30} from '../shot';

// B05-SH01 (Boss T29, 2026-11-20): three-quarter rear chase, the camera rigid with the truck body (VD30-08). The world is painted through the body-tilted
// set camera (`truckSetCam`), the truck, GUNNER-1 and G2 through the level truck camera, so the bump reads on the ground and the riders never move on screen.
// Fourteen emus run ahead along the track at 5.5-6.5 m/s (the truck does 6.1): run phase from speed (T06 gait contact), a dust puff per footfall.
const N = 60;
const SHOT = 'B05-SH01', LIGHT = 0, EATEN = 0.6;
const hs = (n: number) => { const s = Math.sin(n * 78.233 + 12.9898) * 43758.5453; return s - Math.floor(s); };
const D = Math.PI / 180;   // r5 C1 (TF31): rest elevation 10 -> 25 deg so the barrel climbs over the cab
const q16 = (x: number) => Math.round(x * 16) / 16;
const SEED = 36400, X0 = -17;   // truck centre x at L 0: world = truck-local + this

// Runner i: truck-local x at L 0 from 6 (nearest) spreading to about 16, z -0.6..-2.6 (inside the track, off the fence), speed 5.5-6.5 m/s, seeded gait phase.
const runners = Array.from({length: 14}, (_, i) => ({
  x: X0 + 6 + (i === 0 ? 0 : 0.7 * i + 1.3 * hs(SEED + i * 3.1)), z: 9.5 - (i === 0 ? 1 : 0.6 + 2.0 * hs(SEED + i * 5.7)),
  v: 5.5 + hs(SEED + i * 7.3), ph0: q16(hs(SEED + i * 2.3)), scale: 0.94 + 0.12 * hs(SEED + i * 6.1),
}));
const state = (i: number, f: number) => { const r = runners[i]; return {at: [r.x + (r.v * f) / 30, 0, r.z] as [number, number, number], heading: 0, ph: gaitPhase(f, r.v, EMU_POSES.run(0).stride as number, r.ph0)}; };
const WING = wingMix(WING_FOLD, WING_FLAP_OUT, 0.15);
const birds = (L: number): EmuMember[] => runners.map((r, i) => { const s = state(i, L); return {at: s.at, heading: 0, pose: EMU_POSES.run(q16(s.ph % 1), {wing: WING}), scale: r.scale, seed: SEED + i}; });

const track = (l: number) => truckState(SHOT, l);
const CAM = (L: number) => truckCam(truckState(SHOT, L)!.centre, {eye: [-3.0, 2.4, 2.2], yaw: 60, pitch: -6, f: 1100, hy: 860});

export const def: Shot30 = {
  id: SHOT, N, paper: '#efe6d0',
  cam: CAM,
  paint: (p, L, c, pr) => {
    const st = truckState(SHOT, L)!, sc = truckSetCam(c, st.centre, st.pitch, st.roll), at = truckPoint(st.centre, 1, 0, 0, 0), dust = {truckAt: at, ...truckDustFor(SHOT)};
    paintPaddockScene(p, sc, {light: LIGHT, eaten: EATEN, stubble: 0}, () => {
      paintTruckDust(p, sc, L, track, {part: 'far', ...dust});
      runners.forEach((_, i) => paintPuffs(p, sc, SEED + 50 + i * 13, footEvents((f) => state(i, f), L, 10), 0.25));
      paintFlock(p, sc, birds(L), {sun: sunOf(LIGHT)});
    });
    const rig = paintTruckRig(p, c, {centre: st.centre, dir: st.dir, pitch: 0, roll: 0, riders: 'chase', gear: 'pedestal', g2Elev: st.g2Elev + 15 * D, wheelTurn: st.wheelTurn, t: L / 30, seed: 14100});
    paintTruckDust(p, sc, L, track, {part: 'near', ...dust});
    if (rig.gunner) pr?.lead('GUNNER-1', {top: rig.gunner.top, bottom: rig.gunner.bottom, x: rig.gunner.head[0]});
  },
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);
