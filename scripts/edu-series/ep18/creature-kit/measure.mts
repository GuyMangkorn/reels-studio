// EDU-EP18 creature measures (Boss, 15 Nov 2026): the brief's picture sizes checked on the builds. node --import tsx scripts/edu-series/ep18/creature-kit/measure.mts > out/ep18/kit/measure.txt
import * as K0 from '../../../../src/painted/survival/beast-kit';
import * as H0 from '../../../../src/painted/survival/beast-hippo';
const {BEAST_KIT, animSamples} = ((K0 as any).default ?? K0) as typeof K0;
const {HIPPO_WATER} = ((H0 as any).default ?? H0) as typeof H0;
const ext = (B: any) => { const ps = B.parts.filter((q: any) => q.bone !== 'tail').flatMap((q: any) => q.keys.flatMap((k: any) => [[k.p[0] - k.a, k.p[1] - k.b, k.p[2] - k.a], [k.p[0] + k.a, k.p[1] + k.b, k.p[2] + k.a]]));
  const r = (i: number) => [Math.min(...ps.map((p: number[]) => p[i])), Math.max(...ps.map((p: number[]) => p[i]))]; return {s: r(0), y: r(1), l: r(2)}; };
const f2 = (v: number) => v.toFixed(2);
const H = BEAST_KIT.HIPPO;
{ const B = H.stand(), e = ext(B), a = B.anchors;
  const rk = B.parts[0].keys[0]; console.log(`HIPPO stand: length snout tip to rump ${f2(a.snout[0] + 0.05 - (rk.p[0] - rk.b))} m (brief 3.6), top ${f2(e.y[1])} m, back over the shoulder ${f2(a.backTop[1])} m (brief 1.5), width ${f2(e.l[1] - e.l[0])} m`);
  const hb = B.parts.filter((q: any) => q.bone === 'skull' || q.bone === 'jaw' || q.bone.startsWith('eye') || q.bone.startsWith('ear')), hs = hb.flatMap((q: any) => q.keys.map((k: any) => [k.p[0] - k.a, k.p[0] + k.a, k.p[2] + k.a]));
  console.log(`HIPPO head: snout tip s ${f2(a.snout[0])}, skull back s ${f2(Math.min(...hs.map((h: number[]) => h[0])))} -> head length ~${f2(a.snout[0] - B.joints['skull.joint'][0] + 0.08)} m (brief 0.95); head half-width max ${f2(Math.max(...hb.flatMap((q: any) => q.keys.map((k: any) => Math.abs(k.p[2]) + k.a))))} m (brief 0.35)`); }
for (const [an, A] of Object.entries(H.anims)) {
  const rows = animSamples(A).map((t) => { const B = A.build(t), a = B.anchors, wl = HIPPO_WATER, e = ext(B), gape = Math.atan2(a.upperTip[1] - a.hinge[1], a.upperTip[0] - a.hinge[0]) - Math.atan2(a.lowerTip[1] - a.hinge[1], a.lowerTip[0] - a.hinge[0]);
    return `t ${t.toFixed(2)}: top ${f2(e.y[1] - wl)} eye ${f2(a.eyeL[1] - wl)} nostril ${f2(a.nostril[1] - wl)} back ${f2(a.backTop[1] - wl)} upperTip ${f2(a.upperTip[1] - wl)} gape ${(gape * 180 / Math.PI).toFixed(0)}deg`; });
  console.log(`HIPPO ${an} (m above the water ${HIPPO_WATER}):\n  ${rows.join('\n  ')}`);
}
{ const S = BEAST_KIT.SNAKE, B = S.stand(), ks = B.parts[0].keys; let L = 0; for (let i = 1; i < ks.length; i++) L += Math.hypot(ks[i].p[0] - ks[i - 1].p[0], ks[i].p[1] - ks[i - 1].p[1], ks[i].p[2] - ks[i - 1].p[2]);
  const head = B.parts.find((q: any) => q.bone === 'skull')!, hl = Math.hypot(...[0, 1, 2].map((i) => head.keys[head.keys.length - 1].p[i] - head.keys[0].p[i]));
  console.log(`SNAKE lie: body ${f2(L)} m + head ${(hl * 100).toFixed(1)} cm (brief 1.4 m total), max thickness ${(2 * Math.max(...ks.map((k: any) => k.a)) * 100).toFixed(1)} cm (brief 4), head width ${(2 * Math.max(...head.keys.map((k: any) => k.a)) * 100).toFixed(1)} cm (brief 4.5)`);
  const hl2 = S.anims.HEADLIFT.build(0.57); console.log(`SNAKE head-lift t 0.57: head height ${(hl2.anchors.head[1] * 100).toFixed(1)} cm above the ground; lowest body point ${(Math.min(...hl2.parts[0].keys.map((k: any) => k.p[1] - k.b)) * 1000).toFixed(1)} mm (0 = on the ground)`);
  const sl = [0, 0.25, 0.5, 0.75].map((t) => Math.min(...S.anims.SLITHER.build(t).parts[0].keys.map((k: any) => k.p[1] - k.b)) * 1000); console.log(`SNAKE slither: lowest body point per sample ${sl.map((v) => v.toFixed(1)).join(', ')} mm (on the ground)`); }
{ const M = BEAST_KIT.MOSQUITO, B = M.stand(), a = B.anchors, body = Math.hypot(a.head[0] + 0.44 - a.abdomenTip[0], 0); const feet = B.parts.filter((q: any) => q.bone.endsWith('.foot')).map((q: any) => q.keys[q.keys.length - 1].p);
  const span = Math.max(...feet.flatMap((p: number[]) => feet.map((q: number[]) => Math.hypot(p[0] - q[0], p[2] - q[2]))));
  console.log(`MOSQUITO rest: body (eye front to abdomen tip) ${f2(body)} mm (brief 6), proboscis tip ${f2(a.proboscisTip[0] - a.head[0])} mm ahead of the head, leg span (widest foot pair, plan) ${f2(span)} mm (brief 14)`); }
