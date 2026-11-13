import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bodyFrame} from '../src/painted/kit/cast';
import {PEOPLE} from '../src/painted/kit/people';

// Run in a skirt (sarong): bodyFrame holds the step short in every view (SARONG_STEP), so front, side and back match (13 Nov 2026).
const spread = (skirt: boolean, view: 'front' | 'right') => {
  const base = PEOPLE['woman-curly'];
  const def = {...base, outfit: {...base.outfit, skirt: skirt ? base.outfit.skirt ?? '#4a3a5a' : undefined}};
  let stride = 0, lift = 0;
  for (let i = 0; i < 20; i++) {
    const legs = bodyFrame(def, {view, run: i / 20}).mode!.legs;
    stride = Math.max(stride, Math.abs(legs[0].ankle[0] - legs[1].ankle[0]));
    lift = Math.max(lift, Math.abs(legs[0].ankle[1] - legs[1].ankle[1]));
  }
  return {stride, lift};
};

test('a skirt shortens the run step in profile and lowers the foot lift in front', () => {
  assert.ok(spread(true, 'right').stride < 0.6 * spread(false, 'right').stride);
  assert.ok(spread(true, 'front').lift < 0.6 * spread(false, 'front').lift);
});
