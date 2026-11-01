# DF-20261031-painted-walk-bob-authored-hang — authored arm targets miss the walk bob and pop at the hand-over

- Owner: Boss; first observed: 31 Oct 2026 (WFOG-EP01-SHORT SS-R6 build, S04-SH04 FIG-KNOCK and S04-SH01 stack pat); last checked: 31 Oct 2026, working tree on `claude/word-fog-premiere-ep1-edit-e91211` (pre-commit, `3166499` + SS-R6 uncommitted)
- Status: workaround (`walkBob` in `src/painted/worldfog/cast.ts`; authored hangs add it in `knock.ts` and `shots/worldfog.tsx`)
- Type: implementation-bug (against the rig's hang: the hang moves with the walk phase, an authored hand target does not)
- Tags: 2D / painted / cast / arms / walk / continuity
- Scope: `src/painted/kit/cast.ts` (`drawFigure`: `bob` lowers the hip and everything above it), `src/painted/worldfog/cast.ts` (`walkBob`), `src/painted/worldfog/knock.ts`, `src/painted/shots/worldfog.tsx` (`hangRight`, `s4sh01PatArm`)
- Consumers: WFOG-EP01-SHORT S04-SH04 `FIG-KNOCK` (f28–f35 raise), S04-SH01 f450 pat start (walk phase 18/22); sheet sc04 SS-R6, Boss list D-2 and D-4

## Symptoms and evidence
- A plain (undefined) arm is drawn at the hang, which the rig computes from the hip. The hip drops by `0.018 · |sin(2π · walk)|` m during a walk, so the hang moves with it (about 7 px at 450 px/m).
- Authored targets (`via`, `to`) are absolute. Starting a raise or a pat from the body-relative hang with no bob moved the hand by about 7 px at the first authored frame (rig anchors `lHand`/`rUpper` off by 6–8 px in the unit test before the fix).

## Fix (applied)
- `walkBob(walk)` in `worldfog/cast.ts` mirrors the rig's bob. Every authored hang computes its hand and elbow y minus that bob at the same walk phase as the paint.
- Continuity is tested at the switch: the rig anchors with a plain arm and with the authored arm at the first frame agree within 0.5 px (`tests/world-fog.test.ts`, SS-R6 tests).

## Planning impact
- Film and Mark: a hand-over from a plain arm to an authored target is continuous only when both use the same walk phase. Walk stops should land on phase 0 or 1 (no bob, neutral legs), or the arm drops at the stop.
- Recorded deviation: the knock walk is one cycle (two steps) by f34 instead of the sheet's "≈ 2.5 steps", so the stop lands on phase 1 with no pop.
