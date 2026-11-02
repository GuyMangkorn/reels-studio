// Dump the painted kit tables (people with face looks, poses, motions with their KIT-MOTIONS scene times, expressions, wardrobe)
// as one JSON object on stdout, for the asset-store kit page. Usage: npx tsx scripts/painted-kit/kit-data.ts > data.json
import {PEOPLE, PEOPLE_INFO} from '../../src/painted/kit/people';
import {MOTION_INFO} from '../../src/painted/kit/motions';
import {POSE_INFO} from '../../src/painted/kit/poses';
import {EXPRESSION_INFO} from '../../src/painted/kit/expressions';
import {WARDROBE_INFO} from '../../src/painted/kit/wardrobe';
import {MOTION_REEL, reelSceneSec} from '../../src/painted/kit/motion-reel';
const people = Object.entries(PEOPLE_INFO).map(([id, info]) => ({id, ...info, look: PEOPLE[id as keyof typeof PEOPLE].head.look}));
let at = 0;
const motions = MOTION_REEL.map((e) => { const r = {id: e.motion, ...MOTION_INFO[e.motion], start: at, sec: reelSceneSec(e), cast: e.cast.map((c) => c.person)}; at += r.sec; return r; });
console.log(JSON.stringify({people, motions, poses: POSE_INFO, expressions: EXPRESSION_INFO, wardrobe: WARDROBE_INFO}));
