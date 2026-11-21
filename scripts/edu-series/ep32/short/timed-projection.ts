// EDU-EP32 W5.1 timed-sheet projections (Film, 2026-11-21, EDU-EP32-SHEET-R1): the tight spots through the kit camPoint (the renderer's yaw camera).
// B03-SH03 R2 vs R3 keys (cat seat/patch, ground points), B06-SH03 stamp corners + the DOM cat hole (catHole), B03-SH01 bridge marks at hy 680 (code) vs 820 (R3).
//   node --import tsx scripts/edu-series/ep32/short/timed-projection.ts
import {camPoint, camUnit, mixYCam, type YCam} from '../../../../src/painted/kit/ycam';
import {memoPt, MEMO_STAMP, catHole, CAT_DESK} from '../../../../src/painted/edu32/office';
import {bridgeCam, BRIDGE_CAM0} from '../../../../src/painted/edu32/bridge';
import {SF} from '../../../../src/painted/edu32/field';
const D = Math.PI/180;
const cam = (x:number,y:number,z:number,yaw:number,pitch:number,f:number,hy:number):YCam=>({x,y,z,yaw:yaw*D,pitch:pitch*D,f,hy});
const r = (p:any)=>p?p.map((v:number)=>Math.round(v)).join(','):'null';
// A: B03-SH03
const catH = 0.25*1.6;
const keys:{[k:string]:YCam} = {
 'SH03-R2-start':cam(0.3,0.62,2.6,-2,-4,1200,500),'SH03-R3-start':cam(0.3,0.62,2.6,-2,-4,1200,760),
 'SH03-R2-end':cam(0.25,0.6,2.35,3,-4,1200,500),'SH03-R3-end':cam(0.25,0.6,2.35,1,-4,1200,760)};
for (const [k,c] of Object.entries(keys)) {
  const u = camUnit(c, SF.patch);
  console.log(k,'seat',r(camPoint(c,SF.catSeat)),'patchC',r(camPoint(c,SF.patch)),'patchFront',r(camPoint(c,[0.5,0,1.0])),'patchBack',r(camPoint(c,[0.5,0,0.4])),
   'catH@patch px',Math.round(u*catH),'catH@seat px',Math.round(camUnit(c,SF.catSeat)*catH),
   'manL top1.20',r(camPoint(c,[-0.6,1.20,-0.1])),'manR top1.30',r(camPoint(c,[0.62,1.30,-0.1])), 'step x0.25',r(camPoint(c,[0.25,0,0.0])));
}
// B: B06-SH03 stamp
const st = (c:YCam)=>{ const a=MEMO_STAMP.rot*D, cs=Math.cos(a), sn=Math.sin(a);
  const P=(dx:number,dz:number)=>memoPt(MEMO_STAMP.x+dx*cs-dz*sn, MEMO_STAMP.z+dz*cs+dx*sn);
  const pts=[P(-0.5,-0.22),P(0.5,-0.22),P(0.5,0.22),P(-0.5,0.22)].map(v=>camPoint(c,v));
  const cap=[camPoint(c,P(0,-0.06)),camPoint(c,P(0,0.06))];
  return {corners:pts.map(r).join(' '), centre:r(camPoint(c,P(0,0))), capPx012:cap[0]&&cap[1]?Math.round(Math.hypot(cap[1][0]-cap[0][0],cap[1][1]-cap[0][1])):null};
};
const hole=(c:YCam)=>{const h=catHole(c); if(!h) return 'none'; const xs=h.map(p=>p[0]), ys=h.map(p=>p[1]); return 'hole bbox x '+Math.round(Math.min(...xs))+'..'+Math.round(Math.max(...xs))+' y '+Math.round(Math.min(...ys))+'..'+Math.round(Math.max(...ys));};
for (const [k,c] of Object.entries({'B06SH03-start':cam(0.42,1.22,0.89,0,-62,900,760),'B06SH03-end':cam(0.42,1.13,0.84,2,-62,900,760),'B06SH02-key':cam(-2.0,2.0,5.7,3,-2,900,460)})) {
  console.log(k, JSON.stringify(st(c)), hole(c), 'catGround', r(camPoint(c,CAT_DESK)), 'rumpTop', r(camPoint(c,[CAT_DESK[0]+0.71*4,CAT_DESK[1]+0.16*4,CAT_DESK[2]])));
}
// C: bridge
const C1R3 = {...bridgeCam(62), hy: 820};
for (const F of [0,24,32,40,62,71]) {
  const code = bridgeCam(F);
  const e = F<=62 ? 0.5-0.5*Math.cos(Math.PI*F/62) : 1;
  const r3 = F<=62 ? mixYCam(BRIDGE_CAM0, {...bridgeCam(62), hy:820}, e) : {...code, hy: 820};
  console.log('BR f'+F,'code hy',Math.round(code.hy),'catFoot',r(camPoint(code,SF.catSeat)),'| R3 hy',Math.round(r3.hy),'catFoot',r(camPoint(r3,SF.catSeat)),'catPx',Math.round(camUnit(r3,SF.catSeat)*catH),'benchFootL',r(camPoint(r3,[-0.95,0,-0.18])),'manRtop',r(camPoint(r3,[0.62,1.30,-0.1])));
}
// Cat hole polygon (px) at the two B06-SH03 keys: its lowest edge vs the stamp's top edge.
for (const c of [cam(0.42, 1.22, 0.89, 0, -62, 900, 760), cam(0.42, 1.13, 0.84, 2, -62, 900, 760)]) console.log('hole', catHole(c)!.map(r).join(' '));
