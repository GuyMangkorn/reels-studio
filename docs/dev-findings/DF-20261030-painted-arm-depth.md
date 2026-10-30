# DF-20261030-painted-arm-depth — front-view elbows splay sideways; depth needs `via` + `behind` and an instant layer switch

- Owner: Boss; first observed: 2026-10-30 (r4 labelled frames, user decision 30 Oct: front-view elbows go back into depth); last checked: 2026-10-30
- Status: workaround (rig option `Arm.behind` with an authored `via` elbow; uncommitted in the worktree on top of e96a4e1)
- Type: tool-limitation (front view is a flat card with no depth; two-bone IK with a fixed bone length; the layer switch and the view switch are instant)
- Tags: 2D / painted / p5.brush / character rig / arms / depth / pose switch
- Scope: uncommitted worktree `claude/worldfog-editor-adjust-5fd1ad` (base `e96a4e1`); `src/painted/worldfog/cast.ts` (`Arm.via`, `Arm.behind`, draw order in `drawFigure`, `shoulderHeight`); `src/painted/shots/worldfog.tsx` (SS-R3.4 arm rows); `remotion` and `@remotion/renderer` 4.0.538, `p5.brush` 3.0.0 (package.json), CLI stills with `--gl=angle`
- Consumers: WFOG-EP01-SHORT S01-SH02 (L phone), S02-SH01 (L phone, R torch hang), S02-SH03 (shop worker), S02-SH06 (narrator R torch, occupant clutch), S03-SH02 (R torch, L hand), S04-SH02 (R torch hang); scene handoff `WFOG-EP01-SHORT-SS-R3.4` (index anchor `ss-r34-fix-list-boss`); brief VB-WFOG-EP01-SHORT-R4 unchanged

## Symptoms and evidence
- Desired → observed: a bent arm with the elbow back in depth (AB1, hands held in front) read as an elbow splayed to the side. r4 rows with two-bone IK and no `via` placed the elbow outward: S01-SH02 G222 and S02-SH01 G300 (phone arm, forearm horizontal to screen-right), S02-SH06 G830 (narrator torch arm, diagonal forearm to screen-left), S03-SH02 G1764 (torch arm, wide triangle).
- Reproduce: `node scripts/world-fog/stills.mjs --out=DIR --entry=src/painted/worldfog/qa.tsx --id=WFOG-QA --frames=222,300,830,1764` in the r4 tree (`e96a4e1`) and in this worktree. The r4 re-render is byte-identical to the r4 labelled frames (G474, G500, G1764).
- Evidence: r4 labelled frames under `out/qa/world-fog/WFOG-EP01-SHORT/r4/labelled/`; r5 before/after sheet `out/qa/world-fog/WFOG-EP01-SHORT/r5/sheet_before_after_r4_r5.png`; switch strips `out/qa/world-fog/WFOG-EP01-SHORT/r5/pops/`.
- Coverage: CLI stills only (`--gl=angle`); Studio not run; Short only; Long and Studio seeking unverified.
- Root cause: confirmed for the splay: `ikElbow` chooses the bend solution by `out` and a short reach bends the elbow outward (`src/painted/worldfog/cast.ts`, SS-R3.2 note). Confirmed for depth: a front-view card has no depth, so "elbow back" needs an explicit draw order.

## Attempts and results
- `via` (SS-R3.2) fixes the elbow position exactly and removes the IK splay, but it is still drawn in front. Crouched poses use it.
- `behind: 'upper'` (r5): the upper arm is drawn under the torso, a shade darker; the forearm and hand are drawn over the torso. In the r5 crops (G222, G300, G500, G830, G1764) the elbow tucks in and no horizontal forearm remains. `behind: 'all'` exists for the sample only; no SS-R3.4 row uses it.
- Plate px of every SS-R3.4 row checked against the sheet numbers at s 1.0 by a scratch projection check: all within 2 px. The S03-SH02 rows are also covered by `tests/world-fog.test.ts` (within 15 px, elbow x ≥ 380 at every frame).
- Layer switch cost: when `behind` turns off while the upper arm lies over the jacket, its sleeve and outline appear over the torso in one frame (S03-SH02 f67 → f68, `pops/S03-SH02_switch_G1722-G1725_f66-f69_crop540.png`). The sheet's rule (switch on the depth-plane crossing) gives this; the choice of frame is for Mark.
- View switch cost: `view` is discrete (`front` / `left` / `right`); a hand target that differs between views jumps at the switch. S04-SH02 f35 → f36 moves the hand about 176 px at s 1.0 as the body flips from profile to front (the body flip already existed in r4; `pops/S04-SH02_switch_G2434-G2437_f34-f37_crop540.png`). The rig has no in-between views.
- Rise: `shoulderHeight(who, crouch)` returns the front-view shoulder anchor for a crouch (cast test: equal to the anchor `drawFigure` paints). The S03-SH02 elbow hangs from it through f0–f12. At f0–f12 the elbow sits behind the counter edge, so the attachment is not visible in the checked frames (`out/qa/world-fog/WFOG-EP01-SHORT/r5/pops/S03-SH02_rise_G1656_f0_G1668_f12_crop540.png`).

## Planning impact
- Film: depth in front view is a layer order on flat cards. AB1 and AB0-F arms are available for any arm with `via`; `behind` switches are one-frame layer changes, so the switch frame belongs in the scene sheet.
- Mark: SS-R3.4 rows as written. Open for Mark: (a) S03-SH02 f68 one-frame sleeve change; (b) S04-SH02 f36 hand jump (an 8-frame in-view glide is a Boss option if wanted); (c) whether the AB0-F forward elbow reads at S03-SH02 f68 onward (sleeve panel over the jacket at G1764); S02-SH06 occupant elbows are mostly hidden behind the narrator.
- Follow-up: Boss commits and opens the PR after the user reviews r5; `Arm.behind` stays `exists-unintegrated` until committed.

## Revalidation history
- 2026-10-30, worktree `claude/worldfog-editor-adjust-5fd1ad` (uncommitted, base `e96a4e1`): labelled frames, crops, 1 s pass and switch strips rendered; `npm run typecheck`, `npm run lint` and `npm test` exit 0 (world-fog 20/20; full suite 118/118) → workaround.
- Film/Mark adoption: pending SS-R3.4 review (r5).
