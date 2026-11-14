// Prints the card IDs (one per line) from BEAST_KIT: node --import tsx scripts/edu-series/ep16/creature-kit/ids.mts [CREATURE]
import * as K0 from '../../../../src/painted/survival/beast-kit';
const {BEAST_KIT} = ((K0 as any).default ?? K0) as typeof K0;
const only = process.argv[2];
for (const [k, e] of Object.entries(BEAST_KIT)) { if (only && k !== only) continue; console.log(`${k}-TURN\n${k}-RIG`); for (const [a, v] of Object.entries(e.anims)) { console.log(`${k}-${a}`); if (v.side) console.log(`${k}-${a}-SIDE`); } }
