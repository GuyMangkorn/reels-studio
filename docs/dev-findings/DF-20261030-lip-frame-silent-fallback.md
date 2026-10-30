# DF-20261030-lip-frame-silent-fallback — a geometric timing trigger that can never fire returns its fallback without a flag

- Owner: Boss; first observed: 2026-10-30 (BLOOP SH13 pass 5, `SH13_LIP_FRAME`); last checked: 2026-10-30 (Boss, working tree, base `3130527`)
- Status: fixed in code, interim call (2026-10-30 pass 6): the trigger is the hydrophone top (option B, measured c293 = G2047); the function throws when no P4 frame qualifies; Film to confirm the rule
- Type: process-gap
- Tags: timing / fallback / geometry / test-coverage
- Scope: `src/painted/shots/bloop.tsx` `SH13_LIP_FRAME` (first P4 frame whose upper-lip world y at `x = HYD.cx` reaches `HYD.cy`; else `P4 + 19`); `tests/bloop.test.ts` asserts only the range [277, 307]
- Consumers: BLOOP-EP01-SHORT SH13 hydrophone front→inside switch (`paintHydrophone` in front while `c < SH13_LIP_FRAME`, inside and cable fade from it); Mark `storyboards/the-bloop/short/sc01-b09-b10.md` lip-line row; Editor's mono/low-pass mix switch (keyed to the same frame in Mark's proposal)

## Symptoms and evidence
- Rule (BLOOP-BRIEF-R7 H10): the hydrophone stays opaque in front until the upper lip passes `hyd.center` (540, 560).
- Measured with the current geometry (`crRealUpperLipWorld` at `0.86·sh13K`, mouth from `sh13Mouth`): the upper-lip polyline's y at x = 540 is 465 (291), 443.6 (292), 426.7 (293), 406.9 (296), 403 (305), 406 (307). It never reaches 560 in P4 (277–307). The lip arc's top sits about 200 px above the mouth centre, so a point test on the mouth centre cannot pass.
- The lip arc first reaches the hydrophone top (`HYD.top` y 430) at 293 (first 0.5 f step with y ≤ 430). The code's loop returns nothing and falls through to `P4 + 19` = 296, which the function returns silently.
- Pass 4 recorded 290.5 (P4 + 13.5) from an earlier lip definition. That value is stale. Mark's BLOOP-SHEETS-R7 update (11:14) adopted it as G1758, so the sheet and the Editor handoff disagree with the render.
- The existing test (`lip frame in [277, 307]`) passes for the fallback, so it cannot catch this.
- Frame check (`out/qa/the-bloop/sheets/lip-zone-crops.png`, frames 286, 291, 293, 296): the hydrophone is in front over the left rim at 286–293, then drawn inside at 296 with the upper teeth over its top. The switch is a z-order change at the fallback frame; no pop beyond that was seen in the 4-frame crop.

## Attempts and results
- Measured the crossing per P4 frame (scratch probe, not committed) and listed the upper-lip crossings at x = 540 per frame.
- Options for the owners (Film/Mark), not applied:
  - A: keep 296 (G1763, shipped value now); document the fallback as the rule's result.
  - B: change the trigger to the lip reaching `HYD.top` (430): frame 293 (G1760).
  - C: define the trigger on the lower lip or on the mouth opening; not measured.
- Not done: a test that asserts the frame came from the geometry (would need a source flag on the export).

## Planning impact
- Film/Mark: pick A, B or C before Mark's lip-line row and the Editor mix switch are re-synced. Until then, the value in use is 296 (G1763), and Mark's G1758 is stale.
- Boss: any geometric trigger with a fallback should expose which branch produced the value (or test the branch), so an unreachable rule is visible in QA rather than shipped under the fallback's name.

## Update (2026-10-30, pass 6)
- Applied option B: `SH13_LIP_FRAME` = the first P4 frame with the upper lip at or above `HYD.top` (y 430) at x = 540, measured 293 (c; G2047 = shot-local L351 on the R8 clock). The fallback is removed.
- Test `SH13 lip-line frame` now asserts 293.
