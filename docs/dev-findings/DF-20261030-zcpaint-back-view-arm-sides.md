# DF-20261030-zcpaint-back-view-arm-sides — back-view arm sides, cross-body reach at head height, shared mitten scale

- Owner: Boss; first observed: 2026-10-30 (Boss pass 12 G1 look check, `out/qa/zcp-g1/G1-R26-plates-sheet.png`, B06-SH02); last checked: 2026-10-30 (uncommitted worktree `usage-check-agent-tuning-16bd9b`, pass 12 G1 fixes)
- Status: workaround (B06-SH02 staging moved; the look check and Studio/seek checks are pending)
- Type: implementation-bug (screen sides of back-view arms) + tool-limitation (two-bone IK at a head-height target solves the elbow into the neck)
- Tags: 2D / painted / back view / arm depth (CP-P) / IK / mitten scale (BODY-ZCP-6H) / held prop
- Scope: `src/painted/zcpaint/fridge.ts`, `src/painted/zcpaint/bust.ts` (`ArmPose.across`, standing arms), `src/painted/zcpaint/body6.ts` (`Hand.across`, `handParts` mitten); branch uncommitted
- Consumers: ZCP-B06-SH02 (sheet `storyboards/zombie-condo-paint/short/sc01-b06-b08.md`, SS-R1.4); the shared mitten and the `across` option are opt-in (default 1, no other shot changed; B01-SH01, B02-SH03, B07-SH01 checked by pixel diff in the notes)

## Symptoms and evidence

- Pass 10/12 B06-SH02: the arm that pulls the door (his left) crossed the back of the neck to the handle at the right. The elbow sat on the nape (`out/painted/zcpaint/g1fix/before/ZCP-B06-SH02_f0.png`).
- The box arm (his right, cross-body) reached to a box at head height (plate y 640, u 5.46). The shoulder-to-box distance was 1.07 heads against a 1.78-head arm, so the two-bone solve put the elbow on the neck (`ik2`, both solutions near the nape).
- The mitten drew 0.52 long and 0.37 across including the wrist cap (`handParts`, measured); BODY-ZCP-6H says 0.40 by 0.26. Two capsules (palm and thumb lobe) read as a second finger once the palm is narrower.
- The held box was painted after the hand with a wash (blurred edges at 270 px).

## Cause

- Back view: the bust's `L` is screen-left. With the viewer behind him, screen-left is his RIGHT arm. Pass 10 put his left (door) hand on `L`, so the door arm crossed the body.
- A head-height target is too far for a cross-body arm; the elbow is forced onto the neck. A near target (CP-P02 `depth: 'behind'`) lifts the elbow beside the head.

## Fix (pass 12)

- Sides: his left (door) = `R`, `depth: 'behind'` (CP-P02) at the handle (lower door, plate y 930); his right (box) = `L`, a cross-body reach with the lower of the two IK elbows (`lowBend`), so the forearm crosses the upper back under the nape. Box on the bottom shelf (plate y 800, lifted 20 px in hand from pf 6).
- Mitten: `ArmPose.across` / `Hand.across` (default 1). B06-SH02 uses 0.7 on both arms, drawn as one hull (thumb lobe merged into the palm).
- Held box: flat cel faces with ink outline, drawn before the figure on the shelf (pf < 6) and after the hands in hand (pf ≥ 6).

## Limits and revalidation

- Not verified: Studio, seek parity, neighbour boundaries (B01-SH02 → B02-SH01 and B06-SH02 → B06-SH03), the look check of the hand scale and the new staging (user).
- Switch frames: the box arm changes from hang to reach at pf 6 and the door arm from reach to hang at pf 41 (pose switches, not interpolated; F−1/F/F+1 check pending, sheet CP-P06 frame to be named by Mark).
- Revalidated 2026-10-30 (pass 12): `tsc` 0, `eslint` 0, `npm test` 143 of 143 passing (0 failing) (`out/logs/g1fix-npmtest.log`); WORLD FOG 21 frames identical to `out/qa/zcp-r26/wfog-final/md5.txt`; B06-SH02 labelled sheet `out/qa/zcp-g1-fix/G1-fix-B01-B06-sheet.png`.

- Revalidated 2026-10-30 (pass 14, Film SPK-ZCP-07 F7-1): the pass 12 side rule was wrong. In a back view the figure's right hand is on the viewer's right (screen right, `R`); the pass 12 comment placed his right on `L`. The box arm is now `R`, and his left hand hangs off the frame left (variant B). The cross-body reach and `lowBend` are removed; the reach is the projected `reach3` arm (`DF-20261030-zcpaint-pj07-reach3`). Sheet R1.4 names the screen-right shoulder "left" (Mark to correct in R1.5).
