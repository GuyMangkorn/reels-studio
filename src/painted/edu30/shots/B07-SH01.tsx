import {paintArms, paintArmsSky, paintSandstoneWall, paintWattleBed} from '../arms';
import {wFill} from '../../kit/world';
import {ARMS_WORD} from '../looks';
import {camLine, makeShot, type Reel30, type Shot30} from '../shot';

// B07-SH01 (Boss T33, 2026-11-20): cut to full colour, crane up the wall to the coat of arms (LF03 at the end). Space A as LF03 (same seeds, so L 100+ equals the locked look).
// Newsreel burn-out inside this one plate: strength 1 -> 0 linear over L 0-9, flare pop 0.15 / 0.10 / 0.05 on L 0-2, cool tint released with the strength; from L 10 strength 0.
// Camera (SD11): eye (-0.3, 1.0, 4.5) pitch 12 -> eye (-0.3, 2.6, 4.5) pitch 20, f 1200, hy 760, ease-in-out over L 0-100, hold L 100-117.
const N = 118;
const easeIO = (t: number) => { const x = Math.max(0, Math.min(1, t)); return x * x * (3 - 2 * x); };
const camAt = (L: number) => {
  const u = easeIO(L / 100);
  return camLine({eye: [-0.3, 1.0 + 1.6 * u, 4.5], yaw: 0, pitch: 12 + 8 * u, f: 1200, hy: 760});
};
export const def: Shot30 = {
  id: 'B07-SH01', N, paper: '#e8d8b8',
  cam: camAt,
  word: () => ARMS_WORD,
  paint: (p, _L, c, pr) => {
    paintArmsSky(p, c);
    paintSandstoneWall(p, c, 41000);
    wFill(p, c, 41790, '#bfae8c', [[-6, 0, 1.5], [6, 0, 1.5], [6, 0, 4.4], [-6, 0, 4.4]]);   // paving in front of the bed, so the crane's first frames have ground below the bed (off screen from about L 40)
    paintWattleBed(p, c, 41800);
    const r = paintArms(p, c, 42000);
    pr?.lead('EMU-RELIEF', r.emu);
  },
  reel: (L): Reel30 => ({strength: L >= 10 ? 0 : Math.max(0, 1 - L / 9), tint: 'cool', tintAmount: 1, tintMix: 1, pop: [0.15, 0.10, 0.05][L] ?? 0}),
};
export const shot = makeShot(def);
