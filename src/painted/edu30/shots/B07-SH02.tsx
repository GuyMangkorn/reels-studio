import {paintArms, paintArmsSky, paintSandstoneWall, paintWattleBed} from '../arms';
import {blinkLid, EMU_POSES} from '../emu';
import {ARMS_WORD} from '../looks';
import {camLine, makeShot, type Reel30, type Shot30} from '../shot';

// B07-SH02 (Boss T33, 2026-11-20): push in on the relief emu; it turns its head to the lens (L 34-49, the KP-look / TA2 three-quarter yaw -1.25), one blink (L 54-57, base lid 0.30), then holds.
// Nothing else on the emblem moves; no overlay. Camera: eye (0.95, 3.9, 2.7) -> (0.95, 3.9, 2.4), yaw 4, pitch 16, f 1000, hy 900, ease-out over L 0-90, hold to 121.
const N = 122;
const HEAD_YAW = -1.25;
const easeIO = (t: number) => { const x = Math.max(0, Math.min(1, t)); return x * x * (3 - 2 * x); };
const camAt = (L: number) => {
  const t = Math.max(0, Math.min(1, L / 90));
  return camLine({eye: [0.95, 3.9, 2.7 - 0.3 * (1 - (1 - t) * (1 - t))], yaw: 4, pitch: 16, f: 1000, hy: 900});
};
export const def: Shot30 = {
  id: 'B07-SH02', N, paper: '#e8d8b8',
  cam: camAt,
  word: () => ARMS_WORD,
  paint: (p, L, c, pr) => {
    paintArmsSky(p, c);
    paintSandstoneWall(p, c, 41000);
    paintWattleBed(p, c, 41800);
    const emuPose = EMU_POSES.stand({head: [0.36, 1.62, 0], headYaw: HEAD_YAW * easeIO((L - 34) / 15), lid: blinkLid(L - 54, 0.30)});
    const r = paintArms(p, c, 42000, {emuPose});
    pr?.lead('EMU-RELIEF', r.emu);
  },
  reel: (): Reel30 => ({strength: 0, tint: 'cool'}),   // full colour: no grain, weave or tint, as from B07-SH01 L 10
};
export const shot = makeShot(def);
