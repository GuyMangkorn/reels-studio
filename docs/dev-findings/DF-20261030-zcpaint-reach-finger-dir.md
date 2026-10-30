# DF-20261030-zcpaint-reach-finger-dir — side-view reach with a pinch: fingers up the forearm read as a wai

- Owner: Boss; first observed: 2026-10-30 (24-plate R2.6 overview, `out/painted/zcpaint/r26-overview/overview-24-270.png`, B07-SH01 f45 and f36); last checked: 2026-10-30 (uncommitted worktree `usage-check-agent-tuning-16bd9b`, Boss pass 17)
- Status: fixed in the code, look check pending (the user's B07-SH01 look check and the 270 px sheet are not yet done)
- Type: implementation-bug (hand direction of a two-bone reach) + tool-limitation (the reach target is the wrist, so a pinch whose index tip sits 0.5 head out points up the forearm)
- Tags: 2D / painted / side view / reach / pinch (HD-03) / wai read / CP-P (front views only; this is a profile)
- Scope: `src/painted/zcpaint/bust.ts` (`ArmPose` reach `dir`, `reachPts()`, the front/back reach throws on `dir`), `src/painted/zcpaint/closeups.ts` (`B07_FINGERS`, B07-SH01 near arm)
- Consumers: ZCP-B07-SH01 (sheet `storyboards/zombie-condo-paint/short/sc01-b06-b08.md`, SS-R1.5, pinch on the stove case, insert HD-03). No other reach uses `dir`; the default path is unchanged (WORLD FOG 21-frame md5 identical; see the pass 17 build notes).

## Symptoms and evidence

- R2.6 overview f36 to f48: the near arm reached to the clasp with the forearm steep. The pinch's index and thumb pointed straight up, so two upright skin fingers stood in front of the chin and read as both hands raised in a wai. Before-frame: `out/qa/zcp-r26-fix/before/ZCP-B07-SH01_f45.png`.
- Cause: `reachPts()`'s default puts the wrist 0.17 head behind the grip along the forearm (`d = unit(to - E)`), so the hand always points up the forearm. The hand direction cannot be chosen independently of the arm.

## Fix (pass 17)

- `ArmPose` reach gets an optional `dir` (side view only). With `dir`, `to` is the fingertip contact: the wrist sits behind it along the fingers (0.5 head for a pinch, whose index tip is 0.5 from the wrist; 0.17 otherwise), and the IK solves to that wrist.
- B07-SH01 passes `dir: [1, 0]` (the figure faces +x; the case is forward, screen-left). The fingers point at the clasp at every frame of the reach, and the thumb and index show a gap.
- Front and back reach throw if `dir` is set, so the field is never silently ignored.

## Costs and risks (not measured on the final sheet)

- The wrist now sits about 300 px behind the grip, so the forearm runs close to horizontal at chin-to-collar height and the elbow drops low behind the chest. Sleeve and hand read as a reach; check the 270 px sheet for the chin-level pose.
- The existing pinch kit has a longer thumb than index, so the thumb reads as a long finger at bust scale (accepted in the pass 5 hand kit).
- `to` now means the fingertip for a `dir` reach; any future caller must follow that meaning.

## Next

1. Boss: 270 px sheet of B07-SH01 across the whole 141 frames, checking that no frame shows two raised hands (done in pass 17 for the sweep, see the build notes).
2. Film and Mark: record the B07-SH01 hand as "pinch forward at the case" (HD-03 exception, pinch fingers forward), if the user's look check accepts it.
3. User: look check of the B07-SH01 sweep sheet.
