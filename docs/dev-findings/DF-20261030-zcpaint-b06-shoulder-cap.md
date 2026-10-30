# DF-20261030-zcpaint-b06-shoulder-cap — a projected reach sleeve rises above the back beside the neck (B06-SH02)

- Owner: Boss; first observed: 2026-10-30 (Boss pass 17 look check, `out/painted/zcpaint/r26-overview2/ZCP-B06-SH02_f24.png`: "มือยังพันคอตัวเอง"); last checked: 2026-10-30 (Boss pass 18, uncommitted worktree `usage-check-agent-tuning-16bd9b`)
- Status: fixed, look check pending (Film and Mark revalidate the read against the sheet)
- Type: implementation-bug (projected joint placement) + tool-limitation (a flat bust card has no depth; the 3D shoulder root projects toward the vanishing point above the shoulder line)
- Tags: 2D / painted / projection (PJ-ZCP-07) / back view / arm depth (CP-P) / sleeve cap / shoulder slope / B06-SH02
- Scope: `src/painted/zcpaint/fridge.ts` (`SHOULDER_LEAD`, `reachPose` shoulder root); test `tests/zcpaint-proj.test.ts` ("B06-SH02 shoulder cap (pass 18)"); consumers: ZCP-B06-SH02 only (the rest pose pf 0–5 is unchanged)

## Symptoms and evidence

- Pass 17 frames (`out/qa/zcp-b18/before/`, labelled `out/qa/zcp-b18/before-after-B06-labelled.png`): from f8 to f24 the sleeve cap starts inside the back beside the nape and runs across to the box, so the arm reads as wrapping round his neck.
- Geometry (scratch check, same modules, y = −py/H6 because plate y is down): the highest reach-arm point between x 0.2 and 0.62 sits **+0.139 head above the back's shoulder slope at pf 18** (pass 17 root).

## Cause

- The reach root `S` moved with the shoulder lead `(0.02, 0.06, 0.35)·lead` from `(0.6, 4.4, 0)`. In the projection the root moves toward the vanishing point at head height (y 5.6), so at lead 1 the joint projects to about `(0.63, 4.57)`: the shoulder line sits at 4.61 at that x.
- The upper-arm sleeve cap has radius 0.19 at the joint, so its top rose above the slope between the neck and the outer edge. The torso edge, not the joint, should set where the arm leaves the back.

## Fix (pass 18)

- `SHOULDER_LEAD = (0.14, −0.10, 0.35)`: at full lead the root projects to about `(0.74, 4.46)`, on the outer edge of the back (torso edge at that height 0.73). The lead still ramps with `minJerk(pf 5–12)`, so pf 0–5 is unchanged.
- Measured after the fix (same scratch check): worst point **−0.027 head (hidden) at pf 25** over pf 0–62. The reach stays inside the arm length: max **0.959** of the arm length (was 0.980 at the grasp, pf 15).
- The upper arm now emerges from the outer shoulder edge; the forearm and hand are beyond the edge. The elbow pole, the box path and the draw-in are unchanged. The decoded-RGB diff of B06-SH02 shows changes only on the arm outline (thresholded masks at f8/f41/f62).

## Limits and revalidation

- Look check pending (user): the outer-edge shoulder bump at pf 15–24 and the elbow flare during the draw-in (the elbow projects to x 1.63 at pf 48–62, was 1.48; the box is held at the chest).
- The metric checks the reach arm's polygon against the back's top edge (`BUST_TEE`); it does not check the armpit or the sleeve's inner edge, which the torso covers in the back view.
- Not verified: Studio cold load and seek parity for this plate (plates are pure functions of the plate frame; not run here), neighbour boundaries B06-SH01 → B06-SH02 → B06-SH03.
