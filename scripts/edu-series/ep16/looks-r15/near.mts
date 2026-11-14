// R1.5b probe: nearest T. rex point (nostril) to the water (z -8) and to Keng over 16C/16D.
import * as S0 from './shots';
const S = ((S0 as any).default ?? S0) as typeof S0;
import * as B0 from '../../../../src/painted/survival/beast';
const {paintBeast} = ((B0 as any).default ?? B0) as typeof B0;
let worst = {z: -99, t: '', dK: 99};
for (const shot of ['16C', '16D'] as const) for (let t = 0; t <= S.LEN[shot]; t += 2) {
  const st = S.stateAt(shot, t); if (!st.rex) continue;
  const a = paintBeast(null, st.c, st.rex.B, st.rex.place), n = a.toWorld(st.rex.B.joints['nostril.L.pivot']);
  const dK = Math.hypot(n[0] - st.K!.at[0], n[2] - st.K!.at[2]);
  if (n[2] > worst.z) worst = {z: n[2], t: `${shot}+${t}`, dK};
}
console.log('max nostril z', worst.z.toFixed(2), 'at', worst.t, 'dist to K', worst.dK.toFixed(1));
