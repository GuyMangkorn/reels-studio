import assert from 'node:assert/strict';
import test from 'node:test';
import {PEOPLE} from '../src/painted/kit/people';
import {PERIOD_OUTFIT_IDS, WARDROBE_1850S, WARDROBE_1850S_INFO, dressPeriod} from '../src/painted/kit/wardrobe-1850s';
import {OUTFIT_IDS} from '../src/painted/kit/wardrobe';

// KIT-P01 intake from EDU-EP11-SHORT: period outfits copied from src/painted/edu11/hall.ts, kept beside wardrobe.ts.
test('period outfits have info, unique ids and do not shadow WARDROBE', () => {
  for (const id of PERIOD_OUTFIT_IDS) {
    assert.ok(WARDROBE_1850S[id] && WARDROBE_1850S_INFO[id].description.length > 20, id);
    assert.ok(!(OUTFIT_IDS as readonly string[]).includes(id), id);
  }
});

test('dressPeriod keeps the wearer and scales hems to height', () => {
  const man = PEOPLE['man-parted'], dressed = dressPeriod(man, 'frock-1850s');
  assert.equal(dressed.height, man.height);
  assert.equal(dressed.seed, man.seed);
  assert.equal(dressed.outfit.shoulder, man.outfit.shoulder);
  assert.equal(dressed.outfit.gear?.hat?.kind, 'top');
  assert.ok(Math.abs(dressed.outfit.gear!.overcoat!.hem - 0.62 * man.height / 1.66) < 1e-9);
  const woman = dressPeriod(PEOPLE['woman-curly'], 'bonnet-1850s');
  assert.equal(woman.outfit.gear?.hat?.kind, 'bonnet');
  assert.ok(Math.abs(woman.outfit.skirtHem! - 0.1 * PEOPLE['woman-curly'].height / 1.66) < 1e-9);
});
