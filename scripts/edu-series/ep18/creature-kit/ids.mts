// Prints the EP18 card IDs (one per line): node --import tsx scripts/edu-series/ep18/creature-kit/ids.mts [GROUP]   (GROUP = HIPPO, SNAKE, MOSQUITO, HEN, DOG, LINEUP)
import * as C0 from './cards';
const {CARDS} = ((C0 as any).default ?? C0) as typeof C0;
const only = process.argv[2];
for (const k of Object.keys(CARDS)) if (!only || k === only || k.startsWith(`${only}-`)) console.log(k);
