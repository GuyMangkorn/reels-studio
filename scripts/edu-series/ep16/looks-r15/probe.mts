// EDU-EP16 R1.5b Film probe: screen bbox of the T. rex and Keng for the R1.5b 16C/16D cameras (no painting).
//   node --import tsx scripts/edu-series/ep16/looks-r15/probe.mts
import * as S0 from './shots';
const S = ((S0 as any).default ?? S0) as typeof S0;
import * as B0 from '../../../../src/painted/survival/beast';
const {paintBeast} = ((B0 as any).default ?? B0) as typeof B0;
import * as Y0 from '../../../../src/painted/kit/ycam';
const {camPoint} = ((Y0 as any).default ?? Y0) as typeof Y0;

const r = (n: number) => Math.round(n);
for (const sh of S.LOOKS) {
  const st = S.stateOf(sh);
  const out: string[] = [sh.id];
  if (st.rex) {
    const a = paintBeast(null, st.c, st.rex.B, st.rex.place);
    const head = camPoint(st.c, a.toWorld(st.rex.B.joints['skull.joint']));
    const sk = a.toWorld(st.rex.B.joints['skull.joint']), ns = a.toWorld(st.rex.B.joints['nostril.L.pivot']), ns2 = a.toWorld(st.rex.B.joints['nostril.R.pivot']);
    const nx = (ns[0] + ns2[0]) / 2 - sk[0], nz = (ns[2] + ns2[2]) / 2 - sk[2], hd = Math.atan2(nz, nx);
    const toK = Math.atan2(-0.5 - sk[2], 0.6 - sk[0]), toCam = Math.atan2(st.c.z - sk[2], st.c.x - sk[0]), toG = Math.atan2(-8 - sk[2], 9 - sk[0]);
    out.push(`headDir ${hd.toFixed(2)} offK ${Math.abs(hd - toK).toFixed(2)} offCam ${Math.abs(hd - toCam).toFixed(2)} offG1 ${(hd - toG).toFixed(2)} skull ${sk.map((v) => v.toFixed(1)).join(',')}`);
    out.push(`TX bbox x ${r(a.left)}..${r(a.right)} y ${r(a.top)}..${r(a.bottom)} h ${r(a.bottom - a.top)} (${(100 * (a.bottom - a.top) / 1920).toFixed(1)}%) w ${r(a.right - a.left)} head ${head ? head.map(r).join(',') : '-'}`);
  }
  if (st.K) {
    const top = camPoint(st.c, [st.K.at[0], st.K.at[1] + st.K.top, st.K.at[2]]), wl = camPoint(st.c, [st.K.at[0], 0, st.K.at[2]]);
    out.push(`K top ${top?.map(r).join(',')} waterline ${wl?.map(r).join(',')}`);
  }
  const b1 = camPoint(st.c, [0.75, 0.95, -0.9]); out.push(`B1 near-top ${b1?.map(r).join(',')}`);
  console.log(out.join(' | '));
}
