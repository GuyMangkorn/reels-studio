# DF-20261030-zcpaint-pose-track-fields — pose tracks drop the fields only the first key carries

- Owner: Boss; first observed: 30 Oct 2026 (pass 5, B02-SH01 thumb-turn pinch); last checked: 30 Oct 2026
- Status: workaround
- Type: implementation-bug
- Tags: 2D / hands / pose / tooling
- Scope: branch `claude/zcondo-paint-tsx-remotion-bdb058` (uncommitted pass 5); `src/painted/zcpaint/pose.ts` `trackHand`; `src/painted/zcpaint/povshots.ts` `rightHandKeys`
- Consumers: ZCPAINT-SHORT-TH/EN B02-SH01 (`ZCP-B02-SH01-TH`/`-EN`); Film brief `VD-ZCP-POV` (hand poses); Mark N/A

## Symptoms and evidence
- Desired: the index and thumb pinch the bolt bar with a visible gap once the hand reaches the turn. Observed: at the mid-rise key the pinch shape appeared with no gap and the finger curl reverted to the open-hand default.
- Reproduce: `ZCPAINT-P5-B02-SH01-TH` frame 5 or later in the spike entry `src/painted/spike/zcpaint-p5-index.ts` (the pre-fix render was not kept; the current frame is `out/painted/zcpaint/p5/ZCPAINT-P5-B02-SH01-TH_F30.png`).
- Root cause (confirmed by reading `trackHand`): only the numeric fields (`curl`, `spread`, `press`, `size`, `dir`) and the points (`wrist`, `elbow`, `thumb`, `pinch`) are interpolated; every other field is copied from the first key (`out = {...A}`). `pinchGap` and `fingerCurl` on the pinch key were therefore never used.

## Attempts and results
- Approach → outcome: putting `pinch` only on the last key gave a gap-less pinch. Putting `pinchGap` and `fingerCurl` on every key (the first key included) gives the intended pinch at the last key; the pinch point itself switches at the mid-point of the segment (a visible snap of the fingers, accepted for the first look).
- Remaining limitation: `pinch` appears at `u >= 0.5` of the segment; a smoother pinch needs a pinch-aware interpolation in `trackHand`.

## Planning impact
- Film: none on the shot; the hand pose is blockout-level until the user's look check on the grip.
- Mark: none.
- Follow-up: Boss; if the pinch snap is rejected, add pinch-aware interpolation to `trackHand` with a test (not started).

## Revalidation history
- 30 Oct 2026, uncommitted pass 5 → rendered `ZCPAINT-P5-B02-SH01-TH` and `-EN` frames 0–56, pinch crop checked at full resolution → workaround → fix PR: none.
