// Pterosaur pass bounds per frame (EP16 shot 16): picture bounds of every vertex vs the 1080x1920 frame. Run: npx tsx scripts/edu-series/ep16/ptero-bounds-probe.mts
import * as P from '../../../src/painted/survival/pterosaur';
import * as B2 from '../../../src/painted/survival/look-batch2';
import * as CM from '../../../src/painted/kit/cam-moves';
import * as AS from '../../../src/painted/survival/look-assets';
const pt: any = (P as any).default ?? P, b2: any = (B2 as any).default ?? B2, cm: any = (CM as any).default ?? CM, as: any = (AS as any).default ?? AS;
const L = {amb: '#ffffff', k: 1};
for (let f = 4; f <= 30; f++) {
  const c = cm.camOf(as.CAM16_16, f / 81), u = (f - 4) / 26;
  const o = pt.pteroFlight(Math.min(1, Math.max(0, u)), b2.PASS, 2.2);
  const a = pt.paintPterosaur(null, c, o, L, 41000), b = a.bounds, hd = a.head;
  const inside = b.left >= 0 && b.right <= 1080 && b.top >= 0 && b.bottom <= 1920;
  console.log(`f${f}`, `L${b.left.toFixed(0)} R${b.right.toFixed(0)} T${b.top.toFixed(0)} B${b.bottom.toFixed(0)}`, `head ${hd ? hd.map((x: number) => x.toFixed(0)).join(',') : '-'}`, inside ? 'IN' : 'OUT', `h${(b.bottom - b.top).toFixed(0)}`);
}
