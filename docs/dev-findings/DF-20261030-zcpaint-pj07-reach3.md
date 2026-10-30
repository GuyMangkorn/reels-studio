# DF-20261030-zcpaint-pj07-reach3 — a projected arm into depth on a flat bust card (PJ-ZCP-07)

- Owner: Boss; first observed: 2026-10-30 (Film SPK-ZCP-07 spike, variant B); last checked: 2026-10-30 (pass 14, uncommitted worktree `usage-check-agent-tuning-16bd9b`)
- Status: workaround (B06-SH02 port built; look check and WORLD FOG identity pending)
- Type: tool-limitation (a bust is a flat card; a reach into depth needs a 3D solve and a projection) + reproducibility (a port of a spike is not bit-identical)
- Tags: 2D / painted / projection / IK (3D, pole) / back view draw order / mitten (BODY-ZCP-6H) / cloth texture
- Scope: `src/painted/zcpaint/proj.ts` (new), `src/painted/zcpaint/bust.ts` (`ArmPose` reach3, `BustOpts.proj`), `src/painted/zcpaint/fridge.ts`; consumers: ZCP-B06-SH02 only (default arms do not use it)

## Symptoms and evidence

- A 2D two-bone reach to a box at head height either crosses the neck or stops short (pass 10–12, `DF-20261030-zcpaint-back-view-arm-sides`).
- The spike port (`ZcSpk07.ts`) and the production port of variant B are visually the same (band luma within 1 level), not bit-identical (outlines, hatching, head edges). See the build-notes pass 14 section.

## Cause

- A forward reach moves the arm away from the camera. A flat card has no depth, so the arm must be solved in 3D and projected with one pinhole (`s = D / (D + z)`, identity at z = 0).
- Draw order: a reaching arm goes behind the torso in a back view and in front of it in a front view.

## Fix (pass 14)

- `proj.ts`: 3D vector helpers, `minJerk`, `proj3`, `ik3` (two-bone with a pole), `mittenPJ` (projected hull), `reachArm` (mitten, forearm with cuff, upper arm, cross-contour rings).
- `bust.ts`: `ArmPose` `{kind: 'reach3', pose}` and `BustOpts.proj`; standing front and back only; throws without `proj`.
- `fridge.ts`: `PJ_B06` camera (D 3.29 heads, axis (0.723, 5.607)); `reachPose(pf)` (door 0–6 open, transport 6–15, contact 15–17, lift 17–24); fridge and box drawn in the same projection, box before the figure.

## Limits and revalidation

- Reach at the grasp 0.98 of the arm length (pf 15); the box at z 2.05 (sheet R1.5 MK-ZCP-B5).
- The projected card does not turn with the camera (a true 3/4 back torso is not built).
- Not verified: Studio and seek parity, WORLD FOG identity, the labelled 540 px sheet, caption block vs the box bottom (y 1101 inside the TH caption block; Film/Mark decision).
- Residual: port vs spike is not bit-identical (see the textured-pass residual `DF-20261030-zcpaint-figure-texture-residual`).
