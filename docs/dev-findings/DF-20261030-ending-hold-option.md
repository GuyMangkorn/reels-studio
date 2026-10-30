# DF-20261030-ending-hold-option — `A_fade` freezes the final 3 s; the ending now takes `endHoldSec` / `endFadeSec`

- Owner: Boss; first observed: 2026-10-30 (BLOOP brief R2, `B10` rush and black, DEP04); last checked: 2026-10-30 (Boss, uncommitted working tree on `claude/bloop-p5-svg-viz-c10597`, base `3130527`)
- Status: fixed (uncommitted; not merged; the default `A_fade` behaviour is unchanged)
- Type: integration-gap
- Tags: 2D / painted / ending / timing / tooling
- Scope: `src/scenes/endings.ts` (`endingState`, `EndingOptions`), `src/scenes/painted.ts` (`paintedStateAt`), `src/scenes/SceneRenderer.tsx`, `src/scenes/media.ts` (`validateVideoStyle`), `src/videos/types.ts` (`VideoDefinition.endHoldSec`, `endFadeSec`), `src/painted/PaintedStage.tsx`; tests `tests/bloop.test.ts`, `tests/animation.test.ts` unchanged
- Consumers: BLOOP-EP01-SHORT (SH13, brief VD13, DEP04); no existing video sets the new fields, so SHIPWRECK, WORLD FOG and ZCPAINT are unchanged

## Symptoms and evidence
- Desired: the final scene plays to its last frame and fades to black on the plate's own layer (DEP07). Observed: `endingState` freezes the last scene's pose for `3 s` and fades the composition over the last second, so the `B10` rise and rush (G1692–G1758) would be frozen, and a composition fade would stack on the plate's black.
- Reproduce: `endingState(frame, duration, 30, 'A_fade')` for `duration = 1782` returns `poseFrame = 1692` for every frame after it (`src/scenes/endings.ts` before this change).

## Attempts and results
- Option 1: `C_seamless` with `loopBlendFrames: 0` (world-fog precedent). Works for the freeze, but it is not the editorial `A_fade` mapping and has no fade, so the black would be authored only in the plate. Rejected as the editorial mapping.
- Option 2 (used): `A_fade` with two optional video fields. `endHoldSec` (default 3) sets the freeze; `endFadeSec` (default 1) sets the composition fade; `0` disables each. BLOOP sets both to `0`, so the last scene runs to its end and DEP07 owns the fade.
- Verified (node unit tests, `tests/bloop.test.ts`): holdSec 0 gives `poseFrame = frame`; fadeSec 0 gives `opacity 1`; defaults unchanged; validation rejects the fields unless `ending` is `A_fade`.
- Verified (CLI stills, QA sequence `BLOOP-QA-SEQUENCE`): see `scripts/the-bloop/build-notes.md` (2026-10-30 Boss entry) for frame coverage.

## Planning impact
- Film: the `B10` rise and rush are not frozen when `endHoldSec: 0`; the black fade is the plate layer, not a composition fade.
- Mark: none (SH13 timing unchanged).
- Follow-up: Editor sets `endHoldSec`/`endFadeSec` in the episode registry entry when it assembles the timeline. A reviewer should check the last frame is RGB 0 (`scripts/the-bloop/frame-metrics.py dark`).

## Revalidation history
- 2026-10-30 (Boss, working tree on `claude/bloop-p5-svg-viz-c10597`, base `3130527`): unit tests and QA stills → fixed within the stated scope. Merge status: not merged.
