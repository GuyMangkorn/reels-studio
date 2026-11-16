import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JOINT_TOL} from '../src/painted/survival/beast';
import {checkBuild} from '../src/painted/survival/beast-check';
import {animSamples, BEAST_KIT} from '../src/painted/survival/beast-kit';

// Every creature in BEAST_KIT, in every listed animation: each bone stays on its joint and the picture is one connected silhouette from all check views.
// A waterline is left out of the silhouette check (EDU-EP18 hippo, 15 Nov 2026): parts above the water are separate islands by design (ears, eyes, nostrils), and a
// surfacing animal starts fully under; the whole body must still hold together.
for (const [key, e] of Object.entries(BEAST_KIT)) {
  for (const [an, a] of Object.entries(e.anims)) {
    test(`${key}.${an} joints hold`, () => {
      for (const t of animSamples(a)) {
        const r = checkBuild(a.build(t), e.size, e.hc, {...a.place, waterline: undefined});
        for (const j of r.joints) assert.ok(j.attach <= JOINT_TOL.attach, `${j.bone} off its joint by ${j.attach} m at t ${t}`);
        for (const v of r.views) assert.ok(v.picture.components === 1 && !v.picture.detached.length, `detached part at t ${t}`);
      }
    });
  }
}
