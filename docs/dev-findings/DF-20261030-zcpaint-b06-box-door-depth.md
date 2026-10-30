# DF-20261030-zcpaint-b06-box-door-depth — box drawn in to the chest vanishes behind the shut door

- Owner: Boss; first observed: 30 Oct 2026 (pass 15, B06-SH02 draw-in, uncommitted); last checked: 30 Oct 2026
- Status: workaround (depth-ordered paint in `fridge.ts`)
- Type: implementation-bug (painter order), found by a moved prop
- Tags: 2D / depth / draw order / prop / texture-free
- Scope: uncommitted `src/painted/zcpaint/fridge.ts` (`reachPose` draw-in 24–32, `fridge()` box order); plate `ZCP-B06-SH02`
- Consumers: B06-SH02 TH [1194, 1257) and EN [1290, 1335) (shared plate); the EN cut at f 45 shows the shut door and the box in hand; the FR-ZCP-CLOSE fridge set; Film `SPK-ZCP-07` / sheet `MK-ZCP-B5` (box bottom-centre moved)

## Symptoms and evidence
- Desired: after the lift the box is drawn in to his chest before the door shuts (user, pass 14 look check); at f 41 and f 62 the box is in his right hand at about shoulder height, the arm bent.
- Observed (first draw-in build): the arm bends, but the box is not visible at f 41–62. The box's near face is at z 0.29, in front of the shut door plane (z 1.35); `fridge()` painted the box before the door, so the door covered it.
- Reproduce: `sh scripts/zombie-condo-paint/plate-stills.sh out/qa/zcp-p15/x ZCP-B06-SH02:41`, crop `crop=640:620:440:840`.
- Evidence: `out/qa/zcp-p15/after1/ZCP-B06-SH02_f41.png` (box missing; the hand only), `out/qa/zcp-p15/after2-f41-62-crop.png` (box in hand after the fix).
- Coverage: still renders f 0–62 (`out/qa/zcp-p15/after2/`). Studio and seek parity not run. The EN cut (f 45) is not separately rendered.
- Root cause: confirmed. Painter order was fixed for a box behind the door (pass 14 box at z 1.75–2.05). Moving the box forward past the door plane needs a depth-ordered draw.

## Attempts and results
- Attempt 1: box in the lift pose, arm drawn in to the chest, box painted first → box hidden by the door (f 41–62). Rejected.
- Attempt 2 (kept): paint the box after the door once the box's front face (z) is nearer than the door's free edge (`doorZ = ZF − W·sin θ`); otherwise before it. Frames f 0 and f 24 are unchanged within render-run noise: decoded RGB against pass 14 differs by 2 px and 11 px at max 1 level; a same-code re-render differs from its first run by 4 and 8 px at max 1 level (`out/logs/p15-det-stills.log`).
- Attempt 3 (not kept): elbow pole down and box further right (`DRAW (0.10, 0.24, −1.30)`, pole `[0.35, −1, −0.45]`) and pole down (`DRAW (0.08, 0.28, −1.45)`, pole `[0.25, −1, −0.10]`): the box shows over the upper arm in both, the chosen target is kept (`DRAW (−0.02, 0.16, −1.25)`, pole unchanged).
- The arm is drawn over the box where they overlap (the upper arm and forearm are nearer than the box from the back view), which is the physical order.

## Planning impact
- Film: the box stays in the right hand through the seal (pf 41–62); from the back the forearm and the upper arm cover most of the box, the lid and the cup show above the wrist. Film to confirm the read.
- Mark: sheet B06-SH02 "box + cup at about shoulder height" is met at box bottom-centre (1.00, 4.34, 0.50); the box lid sits at the caption block's top edge (y ≈1060), the box in the caption band (accepted overlap, user `pass 14`).
- Follow-up: any future prop moved across a plane (door, wall, partition) needs a depth check for its order against that plane. Revalidate when the door or box geometry changes.

## Revalidation history
- 30 Oct 2026, pass 15, uncommitted → still frames f 0–62 viewed through `qa-sheet.sh` and 1:1 crops → workaround; no Studio check.
