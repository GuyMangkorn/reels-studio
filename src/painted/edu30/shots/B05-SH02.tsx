import {truckPoint, truckState, truckCam, paintTruckRig, paintTruckDust, truckDustFor} from '../props';
import {paintPaddockScene, sunOf} from '../paddock';
import {EMU_POSES, WING_FLAP_OUT, WING_FOLD, gaitPhase, wingMix} from '../emu';
import {footEvents, paintFlock, paintPuffs, type EmuMember} from '../flock';
import {GUNFIRE_PRESETS, paintMuzzleFlash} from '../../kit/gunfire';
import {DEFAULT_REEL, makeShot, type Shot30} from '../shot';

// B05-SH02 (Boss T29, 2026-11-20): side close beside the tray. The camera follows the truck's travel but not its pitch (`truckCam` on the level centre), so the
// world stays level while the rig (truck, GUNNER-1, G2) pitches over the bumps through `paintTruckRig`; G2's elevation kick comes from the T14 schedule.
// Two single shots at L 72 and 79 (T04 `B05_SH02`: halo 160), aimed along G2's barrel at the sky, no strike, no smoke.
// Six emus run at 5.5 m/s over the wheat south of the fence line (truck-local z about -6), pulling away from the slowing truck.
const N = 84;
const D = Math.PI / 180;
// r5 C1b: the raised SH01 rest carries across the cut and settles to the 10 deg rest by L 8 (ease-in-out, before the first bump peak)
const easeIO = (x: number) => { const t = Math.min(1, Math.max(0, x)); return t * t * (3 - 2 * t); };
const SHOT = 'B05-SH02', LIGHT = 0, EATEN = 0.6, SEED = 36450, X0 = -5, Z0 = 9.5 - 6;   // truck centre x at L 0; world = truck-local + X0
const hs = (n: number) => { const s = Math.sin(n * 78.233 + 12.9898) * 43758.5453; return s - Math.floor(s); };
const q16 = (x: number) => Math.round(x * 16) / 16;
const ease3 = (u: number) => u * u * (3 - 2 * u);

// Runner 0 is the leader at T (6, 0, -6) (beyond the right edge at L 0); the rest follow 0.9-3.8 m behind and cross the right third before leaving frame right.
const BEHIND = [0, 0.9, 1.7, 2.5, 3.1, 3.8];
const runners = BEHIND.map((b, i) => ({x: X0 + 6 - b, z: Z0 + (i === 0 ? 0 : (hs(SEED + i * 4.3) - 0.5) * 1.4), v: 5.5, ph0: q16(hs(SEED + i * 2.3)), scale: 0.94 + 0.12 * hs(SEED + i * 6.1)}));
const state = (i: number, f: number) => { const r = runners[i]; return {at: [r.x + (r.v * f) / 30, 0, r.z] as [number, number, number], heading: 0, ph: gaitPhase(f, r.v, EMU_POSES.run(0).stride as number, r.ph0)}; };
const WING = wingMix(WING_FOLD, WING_FLAP_OUT, 0.15);
const birds = (L: number): EmuMember[] => runners.map((r, i) => { const s = state(i, L); return {at: s.at, heading: 0, pose: EMU_POSES.run(q16(s.ph % 1), {wing: WING}), scale: r.scale, seed: SEED + i}; });

const track = (l: number) => truckState(SHOT, l);
const CAM = (L: number) => truckCam(truckState(SHOT, L)!.centre, {eye: [-0.7, 2.0, 2.1 + 0.3 * ease3(Math.max(0, Math.min(1, (L - 60) / 23)))], yaw: 0, f: 950, hy: 860});

export const def: Shot30 = {
  id: SHOT, N, paper: '#efe6d0',
  cam: CAM,
  paint: (p, L, c, pr) => {
    const st = truckState(SHOT, L)!, at = truckPoint(st.centre, 1, 0, 0, 0), dust = {truckAt: at, ...truckDustFor(SHOT)};
    paintPaddockScene(p, c, {light: LIGHT, eaten: EATEN, stubble: 0}, () => {
      paintTruckDust(p, c, L, track, {part: 'far', ...dust});
      runners.forEach((_, i) => paintPuffs(p, c, SEED + 50 + i * 13, footEvents((f) => state(i, f), L, 10), 0.25));
      paintFlock(p, c, birds(L), {sun: sunOf(LIGHT)});
    });
    const rig = paintTruckRig(p, c, {centre: st.centre, dir: st.dir, pitch: st.pitch, roll: st.roll, riders: 'chase', gear: 'pedestal', g2Elev: st.g2Elev + 15 * D * (1 - easeIO(L / 8)), wheelTurn: st.wheelTurn, t: L / 30, seed: 14100});
    paintTruckDust(p, c, L, track, {part: 'near', ...dust});
    paintMuzzleFlash(p, rig.cam, rig.anchors.muzzle, rig.anchors.dir, L, [...GUNFIRE_PRESETS.B05_SH02.rounds], {halo: GUNFIRE_PRESETS.B05_SH02.halo, seed: 7500});
    if (rig.gunner) pr?.lead('GUNNER-1', {top: rig.gunner.top, bottom: rig.gunner.bottom, x: rig.gunner.head[0]});
    if (rig.muzzle) pr?.lead('G2 muzzle', {top: rig.muzzle[1], bottom: rig.muzzle[1], x: rig.muzzle[0]});
  },
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);
