import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JOINT_TOL, ringFrames} from '../src/painted/survival/beast';
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

// T37 (EDU-EP30): the ring frame is carried along a tube. A neck whose tangent turns from +y through +x to -y (and one that runs +s, up, over and back) keeps both frame axes on one side station to station.
for (const [name, pts] of Object.entries({
  'quarter circle +y to +x and on to -y': Array.from({length: 25}, (_, i) => { const a = (i / 24) * Math.PI; return [Math.sin(a), -Math.cos(a), 0] as [number, number, number]; }),
  'arch with a lateral drift': Array.from({length: 25}, (_, i) => { const a = (i / 24) * Math.PI * 1.1; return [Math.sin(a), -Math.cos(a), 0.2 * Math.sin(a * 2)] as [number, number, number]; }),
})) {
  test(`ring frame continuity: ${name}`, () => {
    const fr = ringFrames(pts), d = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    for (let i = 1; i < fr.length; i++) {
      assert.ok(d(fr[i].Y, fr[i - 1].Y) > 0, `Y flips at station ${i}`);
      assert.ok(d(fr[i].X, fr[i - 1].X) > 0, `X flips at station ${i}`);
    }
  });
}
