// Prop contact probe (hand kits, 18 Nov 2026): every finger joint of a POV action's hands in each prop's own frame (cm), so a grip can be
// tuned by numbers: a joint inside a prop's volume is a finger through it. Usage: npx tsx scripts/painted-kit/prop-contact.ts <action> [prop index]
import {POV_ACTIONS, type PovActionId} from '../../src/painted/kit/pov-hands';
import {macroSkeleton} from '../../src/painted/kit/hands';
import {sub3} from '../../src/painted/kit/space';
import {dot3} from '../../src/painted/kit/hand-place';
const [id, k = '0'] = process.argv.slice(2), s = POV_ACTIONS[id as PovActionId].build(), f = s.props[Number(k)].frame;
for (const h of s.hands) {
  const sk = macroSkeleton(h);
  for (const [name, fg] of Object.entries(sk.fingers)) console.log(h.side === 1 ? 'R' : 'L', name.padEnd(6), fg.joints.map((j) => { const d = sub3(j, f.o); return [dot3(d, f.x), dot3(d, f.y), dot3(d, f.z)].map((v) => (v * 100).toFixed(1)).join(','); }).join('  '));
}
