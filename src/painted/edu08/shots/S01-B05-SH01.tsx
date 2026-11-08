import {camMove} from '../../kit/cam-moves';
import {ZG_NEUTRAL} from '../../kit/eva';
import {AST_DEF, CREW_DEF, paintSuited} from '../suit';
import {camAt, dry, orbitBack, reachTo} from '../stage';
import {makeShot} from '../shot';

// S01-B05-SH01 (G 1412-1453, SHEETS-R2.4: time shift only, +14; R2-R2.3 1398-1439) grab and tow (V02, radio filter at mix time). rail-tow clock t = (39 / 41) * L / 30 (SD12): near glove closes on her wrist at L7, re-grips the rail at L14 and L36.
// CREW faces screen left (view left), foot (-0.85, 0.33, 0.45); her right wrist is placed on his near-glove anchor every frame (arm solved in picture space).
// cam: (-0.35,1.36,0.55)->(-1.00,1.36,0.50), yaw 22->16, r 2.5->2.4, eye 1.91, pitch -12, f 1100, hy 700.
const N = 41, cam = (L: number) => camAt(camMove([[-0.35, 1.36, 0.55], [-1.0, 1.36, 0.5]], [22, 16], [2.5, 2.4], 1.91, {pitch: [-12, -12], f: 1100, hy: 700}), L, N);
const CREW_AT: [number, number, number] = [-0.85, 0.33, 0.45];
export const shot = makeShot('S01-B05-SH01', {
  paper: '#05070d',
  paint: (p, L, G) => {
    const c = cam(L), t = ((39 / 41) * L) / 30;
    orbitBack(p, c, G, {at: CREW_AT});
    const crew = paintSuited(p, c, CREW_DEF, {at: CREW_AT, view: 'left', helmet: 'visor', stripes: true, t: G / 30, seed: 7101, motion: {id: 'rail-tow', t}});
    if (!crew) return;
    const travel = 0.5 * t, at: [number, number, number] = [CREW_AT[0] - travel + 0.95, 0.4, 0.5];
    const probe = paintSuited(dry(p), c, AST_DEF, {at, view: 'front', helmet: 'off', t: G / 30, seed: 7201, pose: 'P46'});
    if (!probe) return;
    // the wrist-hand of the tow is the near arm of the facing-left figure (left)
    // face by segment (SD13): open mouth throughout (the closed `line` mouth draws a smile), pupils toward CREW (screen left)
    const face = L <= 6 ? {face: 'tired' as const, faceState: {mouth: 'o' as const, open: 0.2, sweat: false, bags: 0, look: [0, 0.3] as [number, number]}}
      : L <= 10 ? {face: 'scared' as const, faceState: {mouth: 'o' as const, open: 0.2, look: [-0.6, 0.1] as [number, number]}}
      : {face: 'worried' as const, faceState: {eyes: 'dot' as const, mouth: 'o' as const, open: 0.2, look: [-0.6, 0.1] as [number, number]}};
    paintSuited(p, c, AST_DEF, {at, view: 'front', helmet: 'off', ...face, t: G / 30, rim: -1, seed: 7201, pose: 'P46', roll: -6,
      r: reachTo(probe.rShoulder, probe.u, crew.lHand, 0.1, 0.1), l: ZG_NEUTRAL('l')});
  },
});
