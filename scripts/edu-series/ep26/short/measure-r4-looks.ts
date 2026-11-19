// EDU-EP26-SHORT W3 R4 look measures (Film, 2026-11-18): runs each R4 still's painter with a no-op brush and prints the probed figure spans
// (visible top/bottom, lead px, head centre) and, for the coin shots, the nose and coin points and the coin size in px.
// ARMS=1 prints the arm anatomy probe instead (upper arm and forearm in metres at the figure's depth against the rig bone; R5).
// Run: npx tsx scripts/edu-series/ep26/short/measure-r4-looks.ts [IDS...]
import type {Brush} from '../../../../src/painted/BrushCanvas';
import {makePainter} from '../../../../src/painted/kit/painter';
import {ARM_LOG, armTag, PROBE, R4_STILLS} from '../../../../src/painted/edu26/r4-looks';

const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(R4_STILLS);
for (const id of ids) {
  armTag.still = id;
  R4_STILLS[id].paint(makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0}));
}
if (process.env.ARMS) for (const r of ARM_LOG) console.log([r.still, r.who, r.side, 'before', r.before.join('/'), 'after', `${r.upper}/${r.fore}`, 'bone', r.bone, 'reach', r.reach, r.status].join(' '));
else console.log(JSON.stringify(Object.fromEntries(ids.map((id) => [id, PROBE[id] ?? {}])), null, 1));
