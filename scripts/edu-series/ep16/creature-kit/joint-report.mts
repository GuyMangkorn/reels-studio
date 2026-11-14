// Joint-integrity numbers per creature and animation (the same checks as tests/beast-joints.test.ts): node --import tsx scripts/edu-series/ep16/creature-kit/joint-report.mts > out/ep16/kit/joint-report.txt
import * as K0 from '../../../../src/painted/survival/beast-kit';
import * as C0 from '../../../../src/painted/survival/beast-check';
import * as B0 from '../../../../src/painted/survival/beast';
const {BEAST_KIT, animSamples} = ((K0 as any).default ?? K0) as typeof K0, {checkBuild} = ((C0 as any).default ?? C0) as typeof C0, {JOINT_TOL} = ((B0 as any).default ?? B0) as typeof B0;
console.log(`tolerances: attach <= ${JOINT_TOL.attach} m, embed <= ${JOINT_TOL.embed} x parent radius, silhouette gap <= ${JOINT_TOL.gapPx} px, bone-to-parent gap <= ${JOINT_TOL.bonePx} px (600 px per creature size)`);
for (const [key, e] of Object.entries(BEAST_KIT)) {
  let tot = {poses: 0, views: 0, bad: 0, attach: 0, embed: 0, worst: '', bones: 0, hidden: 0};
  for (const [an, a] of Object.entries(e.anims)) {
    let n = 0, bad = 0, attach = 0, embed = 0, worst = '';
    for (const t of animSamples(a)) {
      const r = checkBuild(a.build(t), e.size, e.hc, a.place); n++; tot.bones = r.joints.length;
      for (const j of r.joints) { attach = Math.max(attach, j.attach); if (j.embed > embed) { embed = j.embed; worst = j.bone; } }
      for (const v of r.views) { tot.views++; tot.hidden += v.picture.hidden; if (v.picture.components !== 1 || v.picture.detached.length) bad++; }
    }
    console.log(`${key}.${an.padEnd(7)} poses ${n} x 14 views  bad ${bad}  attach max ${attach.toExponential(1)} m  embed max ${embed.toFixed(2)} (${worst})`);
    tot.poses += n; tot.bad += bad; tot.attach = Math.max(tot.attach, attach); if (embed > tot.embed) { tot.embed = embed; tot.worst = worst; }
  }
  console.log(`${key} TOTAL: ${tot.poses} poses, ${tot.poses * 14} pose-views, ${tot.bad} failing, ${tot.bones - 0} child bones per pose, attach max ${tot.attach.toExponential(1)} m, embed max ${tot.embed.toFixed(2)} (${tot.worst})\n`);
}
