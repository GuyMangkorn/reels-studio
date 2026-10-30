// Print the B02 pound-jolt frame lists (MK-ZCP-B2) as JSON for Editor: composition frames and seconds per language.
// Usage: node --import tsx scripts/zombie-condo-paint/jolts.ts
import {B02_TIMING, poundJoltFrames, poundJoltPlateFrames} from '../../src/painted/zcpaint/jolts';

const out = Object.fromEntries((['TH', 'EN'] as const).map((lang) => {
  const frames = poundJoltFrames(lang);
  return [lang, {
    compositionFrames: frames,
    seconds: frames.map((f) => Math.round((f / 30) * 1000) / 1000),
    plateFramesSH01: poundJoltPlateFrames(lang, 'SH01'),
    plateFramesSH02: poundJoltPlateFrames(lang, 'SH02'),
    timing: B02_TIMING[lang],
  }];
}));
console.log(JSON.stringify(out, null, 1));
