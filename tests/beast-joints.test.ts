import {test} from 'node:test';
import assert from 'node:assert/strict';
import {checkJoints, checkRoots, ROOT_TOL, ik2, onLoft, JOINT_TOL, newRig, paintBeast, spline, type Build} from '../src/painted/survival/beast';
import {boneOverlapPx, boneGapPx, checkBuild, pictureCheck, viewCam, CHECK_VIEWS} from '../src/painted/survival/beast-check';
import {animSamples, BEAST_KIT} from '../src/painted/survival/beast-kit';

// EDU-EP16 creature kit joint integrity (Boss, 14 Nov 2026; user: "the joints come apart"). Tolerances: JOINT_TOL in src/painted/survival/beast.ts.
//   3D, per bone and pose: the child hangs on its named joint (the joint lies on the child's own axis within 1 mm) and the joint lies inside its parent's loft (distance to the parent's axis <= 1.0 x its radius).
//   Picture, per pose and view (8 eye-level yaws, 4 high-angle 35 deg, 2 top-down 70 deg): the drawn creature is ONE silhouette and every bone's raster touches its parent's, gaps up to JOINT_TOL.gapPx (6 px at 600 px per creature) bridged in the whole silhouette and JOINT_TOL.bonePx (12 px) between a bone and its parent.
// Draw order cannot expose a gap: fills are opaque and the silhouette is their union, so a gap would show here as a second component or a detached bone.

for (const [key, e] of Object.entries(BEAST_KIT)) {
  for (const [an, a] of Object.entries(e.anims)) {
    test(`${key}.${an}: every joint hangs on its parent and the silhouette stays one piece in all views`, () => {
      const fails: string[] = [];
      for (const t of animSamples(a)) {
        const r = checkBuild(a.build(t), e.size, e.hc, a.place);
        for (const j of r.joints) {
          if (j.attach > JOINT_TOL.attach) fails.push(`t=${t.toFixed(3)} ${j.bone}: attach ${j.attach.toFixed(4)} m`);
          if (j.embed > JOINT_TOL.embed) fails.push(`t=${t.toFixed(3)} ${j.bone}: joint outside parent, embed ${j.embed.toFixed(2)}`);
        }
        for (const v of r.views) if (v.picture.components !== 1 || v.picture.detached.length) fails.push(`t=${t.toFixed(3)} ${v.view}: ${v.picture.components} pieces, detached [${v.picture.detached.join(',')}]`);
      }
      assert.deepEqual(fails, [], fails.slice(0, 8).join('\n'));
    });
  }
}

test('the checks catch a part drawn without its parent (negative control)', () => {
  const R = newRig(), B = R.B, root = R.bone('body', null);
  R.loft(root, {m: 10, col: () => '#888', keys: spline([{p: [-1, 1, 0], a: 0.5, b: 0.5}, {p: [1, 1, 0], a: 0.5, b: 0.5}], 3)});
  const ok = R.bone('arm', root, 'arm.joint', [0, 1, 0.3]);
  R.loft(ok, {m: 8, col: () => '#888', keys: spline([{p: [0, 1, 0.3], a: 0.15, b: 0.15}, {p: [0, 0.4, 0.9], a: 0.12, b: 0.12}], 3)});
  assert.ok(checkJoints(B).every((j) => j.attach < 1e-9 && j.embed < 1), 'a joint on the parent passes');
  const cam = viewCam(3, 1, 0), drawn = paintBeast(null, cam, B, {at: [0, 0], heading: 0}).drawn;
  assert.equal(pictureCheck(B, drawn).components, 1);
  // a hand floating 1.2 m away from its wrist joint
  const R2 = newRig(), B2 = R2.B, r2 = R2.bone('body', null);
  R2.loft(r2, {m: 10, col: () => '#888', keys: spline([{p: [-1, 1, 0], a: 0.5, b: 0.5}, {p: [1, 1, 0], a: 0.5, b: 0.5}], 3)});
  const hand = R2.bone('hand', r2, 'hand.joint', [0, 1, 0.3]);
  R2.loft(hand, {m: 8, col: () => '#888', keys: spline([{p: [3, 1, 0.3], a: 0.15, b: 0.15}, {p: [3.6, 0.4, 0.3], a: 0.12, b: 0.12}], 3)});
  const row = checkJoints(B2)[0];
  assert.ok(row.attach > JOINT_TOL.attach * 100, `3D attach catches it: ${row.attach.toFixed(2)} m`);
  const p2 = pictureCheck(B2, paintBeast(null, cam, B2, {at: [0, 0], heading: 0}).drawn);
  assert.ok(p2.components > 1 && p2.detached.includes('hand'), 'the picture check catches it too');
  assert.ok(CHECK_VIEWS.length === 14);
});

test('joint registry: bones are unique, each non-root bone has a parent registered before it, every part belongs to a bone', () => {
  for (const [key, e] of Object.entries(BEAST_KIT)) for (const [an, a] of Object.entries(e.anims)) for (const t of animSamples(a, 3)) {
    const B: Build = a.build(t), ids = B.bones.map((b) => b.id);
    assert.equal(new Set(ids).size, ids.length, `${key}.${an} duplicate bones`);
    B.bones.forEach((b, i) => assert.ok(b.parent === null || ids.indexOf(b.parent) < i, `${key}.${an}: ${b.id} parent order`));
    assert.equal(B.bones.filter((b) => b.parent === null).length, 1);
    assert.ok(B.parts.every((p) => ids.includes(p.bone)) && B.flats.every((f) => ids.includes(f.bone)));
  }
});

test('limb segment lengths never change over a cycle (two-bone IK: a leg bends, it does not stretch)', () => {
  for (const [key, e] of Object.entries(BEAST_KIT)) for (const [an, a] of Object.entries(e.anims)) {
    const len = new Map<string, number>();
    for (const t of animSamples(a)) {
      const B = a.build(t);
      for (const b of B.bones) {
        if (!b.joint?.endsWith('.knee') && !b.joint?.endsWith('.ankle')) continue;
        const id = b.joint.split('.')[0], from = b.joint.endsWith('.knee') ? `${id}.hip` : `${id}.knee`;
        if (!B.joints[from]) continue;
        const d = Math.hypot(...B.joints[b.joint].map((v, i) => v - B.joints[from][i]));
        const k = `${key}.${an}.${b.joint}`, prev = len.get(k);
        if (b.joint.endsWith('.ankle') && key === 'TREX') continue;   // T. rex: the ankle is IK'd, the foot pad is a separate metatarsus
        if (prev === undefined) len.set(k, d); else assert.ok(Math.abs(prev - d) < 1e-6, `${k}: ${prev} vs ${d}`);
      }
    }
  }
});

// Tail / neck / head ROOT continuity (14 Nov 2026; user on the long-neck: "the tail still comes away from the body in some frames"). The joint-integrity rows above passed on a tail that was hung on the very END of the
// rump loft, with tilted rings, so a step and a notch showed at the root. Axial bones (ROOT_TOL.axial = tail, neck, head, skull) must therefore ALSO satisfy, in every sampled frame (animSamples x 2: mid-cycle frames included) and view:
//   3D: radius step childR/parentR in [ROOT_TOL.min, ROOT_TOL.max] (thick roots, childR >= 0.3 m); joint inside the parent (embed <= 0.6); a fat root (childR >= 0.9 m) buried >= 0.3 x childR of axis from the parent loft's end;
//   picture: the gap to the parent is 0, and for the tail the raster overlaps the body's by >= ROOT_TOL.overlap x (childR in px)^2 whenever both are drawn (a mere touch fails; a neck seen end-on is mostly hidden, so no overlap rule there).
for (const [key, e] of Object.entries(BEAST_KIT)) {
  for (const [an, a] of Object.entries(e.anims)) {
    test(`${key}.${an}: tail, neck, head and skull grow out of their parent (radius step, burial, picture overlap) in every frame and view`, () => {
      const fails: string[] = [];
      for (const t of animSamples(a, 16)) {
        const B = a.build(t), rows = checkRoots(B).filter((r) => ROOT_TOL.axial.test(r.bone) && r.childR >= ROOT_TOL.minR);
        for (const r of rows) {
          if (r.ratio < ROOT_TOL.min || r.ratio > ROOT_TOL.max) fails.push(`t=${t.toFixed(3)} ${r.bone}: radius step ${r.ratio.toFixed(2)}`);
          if (r.embed > ROOT_TOL.embed) fails.push(`t=${t.toFixed(3)} ${r.bone}: joint ${r.embed.toFixed(2)} of the parent radius from its axis`);
          if (r.childR >= ROOT_TOL.buriedFrom && r.buried < ROOT_TOL.buried) fails.push(`t=${t.toFixed(3)} ${r.bone}: hung on the parent's end face (buried ${r.buried.toFixed(2)})`);
        }
        for (const v of CHECK_VIEWS) {
          const dr = paintBeast(null, viewCam(e.size, e.hc, v.alpha), B, {at: [0, 0], heading: v.heading, ...a.place}).drawn;
          for (const r of rows) {
            const par = B.bones.find((b) => b.id === r.bone)!.parent!, ov = boneOverlapPx(dr, r.bone, par), gap = boneGapPx(dr, r.bone, par);
            if (ov === null) continue;
            const need = ROOT_TOL.overlap * (r.childR * 25) ** 2;
            if ((r.bone === 'tail' && ov < need) || gap !== 0) fails.push(`t=${t.toFixed(3)} ${v.name} ${r.bone}: overlap ${ov} px2 < ${need.toFixed(0)}, gap ${gap}`);
          }
        }
      }
      assert.deepEqual(fails, [], fails.slice(0, 8).join('\n'));
    });
  }
}

test('the root-continuity checks catch a floating tail, a thin stalk and a tail hung on the body end (negative control)', () => {
  const body = spline([{p: [-3, 3, 0], a: 1, b: 1.1}, {p: [0, 3.4, 0], a: 1.5, b: 1.7}, {p: [3, 3.8, 0], a: 1.1, b: 1.2}], 4);
  const make = (root: number, ra: number, off: number) => {
    const R = newRig(), B = R.B, rt = R.bone('body', null);
    R.loft(rt, {m: 14, col: () => '#888', cap: true, keys: body});
    const tb = onLoft(body, root), t = R.bone('tail', rt, 'tail.base', [tb[0], tb[1], tb[2]]);
    R.loft(t, {m: 10, col: () => '#888', keys: spline([{p: [tb[0] - off, tb[1], 0], a: ra, b: ra * 1.1}, {p: [tb[0] - off - 3, tb[1] - 0.6, 0], a: ra * 0.7, b: ra * 0.75}, {p: [tb[0] - off - 7, tb[1] - 1.4, 0], a: 0.05, b: 0.05}], 4)});
    return B;
  };
  const verdict = (B: Build) => {
    const r = checkRoots(B).find((x) => x.bone === 'tail')!, fails: string[] = [];
    if (r.ratio < ROOT_TOL.min || r.ratio > ROOT_TOL.max) fails.push('step');
    if (r.embed > ROOT_TOL.embed) fails.push('embed');
    if (r.childR >= ROOT_TOL.buriedFrom && r.buried < ROOT_TOL.buried) fails.push('end-face');
    for (const v of CHECK_VIEWS) { const dr = paintBeast(null, viewCam(24, 3, v.alpha), B, {at: [0, 0], heading: v.heading}).drawn, ov = boneOverlapPx(dr, 'tail', 'body'); if (ov !== null && (ov < ROOT_TOL.overlap * (r.childR * 25) ** 2 || boneGapPx(dr, 'tail', 'body') !== 0)) { fails.push(`picture@${v.name} ov=${ov} need=${ROOT_TOL.overlap * (r.childR * 25) ** 2} gap=${boneGapPx(dr, 'tail', 'body')}`); break; } }
    return fails;
  };
  assert.deepEqual(verdict(make(0.2, 0.92, 0)), [], 'a tail buried in the body, matching its radius, passes');
  assert.ok(verdict(make(0.2, 0.92, 2.5)).length > 0, 'a floating tail (first ring 2.5 m off its joint) is caught');
  assert.ok(verdict(make(0.2, 0.3, 0)).includes('step'), 'a thin stalk on a fat body is caught');
  assert.ok(verdict(make(0, 1.0, 0)).length > 0, 'a fat tail hung on the very end of the body loft is caught (the long-neck defect)');
  void ik2;
});
