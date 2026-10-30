# ZCPAINT build notes

Findings for the painted-2D (p5.brush) version of ZCONDO. The Blender build history stays in [ZCONDO build notes](../zombie-condo/build-notes.md).

## 2026-10-29 — Film brief `VB-ZCPAINT-SHORT-R1` and spike `SPK-ZCP-01`

- Checkout: `claude/zcondo-paint-tsx-remotion-bdb058`, fast-forwarded to `origin/main` `0df8dc6` (PR #115, WORLD FOG EP01) during the pass. User direction (29 Oct 2026): use WORLD FOG's character size, head, face and atmosphere as the base.
- Environment: this worktree had no `node_modules`. Film linked `node_modules` to the WORLD FOG worktree's (`.claude/worktrees/world-frog-main-6920cb/node_modules`; same `package.json`, `p5.brush` 3.0.0, Remotion 4.0.538). No install. Remove the symlink or run a clean install before Boss work.
- Spike: `src/painted/spike/ZcPaint.tsx` + own entry `src/painted/spike/zcpaint-index.ts` (`ZCPAINT-SPIKE-B01`, `ZCPAINT-SPIKE-B02S`). Reuses WORLD FOG `paintBodySide`, `makePaint`, `headOutline`, `ellipse`, `Grade`, `Grain`; only change to WORLD FOG code: `export` added to `Paint`, `makePaint`, `reach`, `paintBodySide` in `src/painted/spike/SideSheet.tsx` (no behaviour change). Commands: `npx remotion bundle src/painted/spike/zcpaint-index.ts --out-dir out/painted/zcpaint/bundle`, then `npx remotion still out/painted/zcpaint/bundle <ID> out/painted/zcpaint/<f>.png --frame=<n> --gl=angle` (logs `out/logs/zcpaint-*.log`). 9 stills in 19 s.
- Findings:
  - `Painter.flat` (it calls `brush.wash()`) under textured fills made a full-alpha frame re-render with 19 changed bytes (≤2 levels) in the first look test; without it the WORLD FOG-based frames re-render pixel-identical. Same cause as the WORLD FOG `brush.wash()` finding. Note: `cmp` on the PNG files reported a difference while the decoded RGB was identical; compare decoded pixels, not PNG bytes.
  - B01 OTS: the big foreground shoulder and the near floor put the caption band at mean luma 0.311; a screen-space dark falloff brings it to 0.246 (threshold 0.25). Thin margin.
  - SideSheet figures mirror correctly with `brush.scale(-k, k)` (p5.brush `scale(x, y = x)`; the repo typing declares one argument).
  - At `SEC-2D` 340 px/m, a 4-head standing lead at depth 0.75 m measures ≈530 px; the decal head ≈128 px tall, readable at full resolution.
- `npx tsc --noEmit -p . --typeRoots ./node_modules/@types` passes (`out/logs/zcpaint-tsc.log`); without `--typeRoots` it fails on duplicate `@types` directories (`DF-20261026-duplicate-types`).

### Proposed document changes (not applied; for user review per TL/DP)

1. `.claude/skills/painted-2d/SKILL.md` "Runtime status" and `docs/delivery-workflow.md` "Visual engine" table: painted 2D is `existing-integrated` as a timeline scene type since `6c5a5dc` (`src/scenes/painted.ts`, `PaintedStage`, registry; consumer SHIPWRECK-SHORT); only the character rig and per-episode plate modules are missing. (WORLD FOG build notes propose the same.)
2. painted-2d skill, Gotchas: "Do not call `brush.wash()` or `Painter.flat` after textured fills: re-renders differ by a few levels. Stack zero-bleed fill passes instead." Reproduced here (second episode).
3. painted-2d skill, Review loop: the determinism check should compare decoded pixels (for example with ffmpeg rawvideo) rather than `cmp` on PNG bytes.
4. `src/painted/p5-brush.d.ts` is code, not a rule document: Boss may declare `scale(x: number, y?: number)` when the character module needs mirroring.

## 2026-10-29 — Boss: profile decal head rebuilt (`HEAD-SIDE-R2`), shared with WORLD FOG

- Request: user (chat, 29 Oct 2026) keeps the WORLD FOG front decal head and asks for a more detailed profile after
  the side view of the pasted "Flat-face decal style" blueprint (not on disk; coordinator's description used).
  Shape from the reference, paint look from WORLD FOG (opaque zero-bleed fills, boiling ink, no `brush.wash()`).
- Owning module: `src/painted/spike/SideSheet.tsx` (the WORLD FOG profile code ZcPaint already reuses); no ZC copy.
  - `paintHeadSide(p, cx, cy, K, face, style)` is now exported. Same head units as `FaceSheet.paintHead` (K = half face
    width, crown -1.05, brow `BROW_Y`, eye 0.05, mouth 0.6, chin `CHIN` 1.22; head 0.425 m on the 4-head 1.7 m cast).
    Profile-only: upright face line ~0.95, nose bump tip (1.13, 0.33), recess to the mouth, rounded chin, full back
    of skull to -1.07, C ear with inner line at x -0.12 between eye line and nose.
  - Hair: `short` (default men's cut per the ref: cap over crown and whole back to the nape, edge diagonal from the
    forehead to a sideburn just in front of the ear, two crown tufts), `tied` (swept back, bun, ear in front of the
    edge), `bob` (jaw length, covers the ear, straight bangs), `hood` (hood + fringe). Skull outline inked only on the
    face side, so no line shows through the cap.
  - Face controls in profile: `eyes` dot/wide/half/shut, `look` [forward = toward the nose, down], all `brow` and
    `mouth` values of `Face`, `lines` age lines, automatic blink (0.4–2.6 s, 0.13 s shut, phase from the painter id).
    Features go through `p.fork(700)`, eyes last, so a blink never shifts another seed.
  - `Paint` gained `t`, `id`, `fork(offset)` and an optional ink colour; `paintBodySide` now returns `{head: {x, y, K}}`
    and puts the neck (centre X(-0.04)) under the back half of the head (head centre X(0.03), was X(-0.08)).
  - `ZcPaint.tsx`: `YOU` exported; `infectedFace` re-anchored to the returned head anchor (was hard-coded to the old
    head centre). `src/painted/p5-brush.d.ts`: `scale(x, y?)` (proposal 4 above applied; code, not a rule document).
- Review sheet: `PAINTED-SPIKE-HeadSide` (`src/painted/spike/HeadSideSheet.tsx`, spike entry `src/painted/spike/index.ts`):
  front vs profile at K 150 with crown/brow/eye/nose/mouth/chin guides; 7 profile expressions; 6 cuts incl. mirrored;
  WORLD FOG side cast + zc-you at the B02-SH02 section scale (302 px/m). Serves no specific shot. Images:
  `out/qa/headside/` (`PAINTED-SPIKE-HeadSide_F0_540.png`, `HEAD-SIDE-R2_front-vs-profile_F0.png`,
  `PAINTED-SPIKE-CastSide_F0_heads_before-over-after.png`, `B02-SH02_zc-you_before-after_F60.png`,
  `ZCPAINT_after_sheet.png`, `PAINTED-SPIKE-HeadSide_F0-F89_sheet.png`).
- Front identity (decoded RGB, before rendered first from the same worktree, `--gl=angle`): `PAINTED-SPIKE-FaceSheet`,
  `-Cast`, `-Proportions` F0/F30/F60 identical. Changed as expected (profile users): `PAINTED-SPIKE-CastSide` F0/F45;
  `ZCPAINT-SPIKE-B02S` F0/F60/F119 (both figures' heads and arms, bbox x 215–1052, y 297–838); `ZCPAINT-SPIKE-B01`
  F0/F60/F119 (the 12 m silhouette's head; 12–18 px elsewhere at ≤4 levels). B01's foreground back-of-head
  (`headOutline`) is unchanged. Not re-rendered (no import of `SideSheet`): `WFOG-SP01-*`, `WFOG-PREVIEW-S02-SH02`,
  `ZCPAINT-SPIKE-B02POV`/`-RAGE` (front `paintHead` only).
- Checks: `tsc --noEmit --typeRoots ./node_modules/@types` passes; eslint on the changed files passes (the untracked
  `ZcPaintPov.tsx`, not part of this work, has one unused-variable error); `npm test` 84/84. HeadSide F0 rendered
  twice → identical; F30/F60/F89 stills = sequence-render frames (seek parity). Studio not opened (stills/sequence only).
- Lead height: zc-you in B02-SH02 ≈533 px (hair-tuft top y≈299 to ground y≈832 at F60, read from the diff bbox and
  projection; ≥480).
- Finding (pre-existing, also in the front `PAINTED-SPIKE-Cast` F48→F49): when any head blinks, ink outlines drawn
  later on the canvas re-randomise inside the same boil step (fills and other seeds hold). It reads as one extra boil
  tick. Profile heads now blink, so `PAINTED-SPIKE-CastSide`/ZC profile figures show it too. Proposed dev-findings entry
  (not written): "p5.brush ink after a mark-count change re-randomises within a boil step; fork painters keep fills
  stable, not ink."
- Observation: in B02-SH02 the zc-you hair fades grey toward the back (before and after alike); the wet hair fill
  mixes with the warm wall. Not changed here.

## 2026-10-29 — Film brief `VB-ZCPAINT-SHORT-R2` and spike `SPK-ZCP-02`

- Spike: `src/painted/spike/ZcPaintPov.tsx` + own entry `src/painted/spike/zcpaint-pov-index.ts` (`ZCPAINT-SPIKE-B02POV`, `-RAGE`, `-B02LOW`, `-B02LOW-SHADE`, `-B02LOW-CAP`). Bundle `out/painted/zcpaint/bundle-pov`; stills `out/painted/zcpaint/r2/`; logs `out/logs/zcpaint-pov-*.log`, `out/logs/zcpaint-low.log`. No edit to `SideSheet.tsx`, `ZcPaint.tsx`, `FaceSheet.tsx` or `WfogPhone.tsx` (Boss is changing the first two); the spike imports `paintBodySide`/`makePaint`/`paintHead` as they are on disk, so its profile heads follow Boss's work in progress.
- Rive/Lottie: not in `package.json` at `0df8dc6`; not needed (p5.brush in the same canvas is the least work).
- Findings:
  - Cream sets fail the caption band (B02 wide, band y 1060–1248: 0.367 / p95 0.721; POV and rage at the R1 band: 0.59 and 0.65). Painted lower-frame bands at 200–225 opacity fix it but leave a lumpy edge and clip faces near the edge; a screen-space CSS gradient behind the caption block (`ZC-CAPSHADE`, peak 0.62) passes at 0.183 / 0.316 with a clean edge.
  - Translucent veils drawn through `Painter.wash` at 200 opacity barely darkened the frame (0.278 → 0.275); the same polygons as direct seeded `brush.fill` calls at texture 0.15 did (0.117). Low texture matters for dark covering fills.
  - `cmp` on PNGs is unreliable here (see R1 note): compare decoded RGB.
- Mock low caption: the existing `Subtitles` with `position: 'bottom'` inside an `AbsoluteFill` moved up 538 px puts the block bottom at y 1248. Runtime placement is Boss's `S-09` (c).

### Proposed document changes (not applied; for user review per TL/DP)

5. `docs/production-requirements.md` caption-safe zone: if the user wants the low caption block (bottom edge at y 1248) for new painted deliverables generally, the default `middle` placement guidance could name it as the preferred portrait placement once `S-09` (c) exists. ZCPAINT only for now (user: “เฉพาะคลิปใหม่”).
6. painted-2d skill, Art direction: a first-person hand recipe (WfogPhone: L0 defocused background, L1 painted hand, L2 SVG masked by the fingers) as the default POV approach, once `S-P07` makes it a shared module.

### HEAD-SIDE-R2 user decisions (chat via coordinator, 29 Oct 2026)

- Short-cut hair mass → keep ("ตามนี้"). Nose → keep. Profile blink → off by default; a shot switches it on
  ("ปิดไว้ เปิดรายช็อต").
- Implemented: `paintHeadSide(..., {blink})` and `paintBodySide(p, c, cx, ground, grip?, {blink})`, both default
  `false`; front `paintHead` unchanged (its blink stays as WORLD FOG has it). No current consumer sets `blink`.
- Re-check (decoded RGB vs the same "before" renders): FaceSheet/Cast/Proportions F0/F30/F60 identical; CastSide,
  ZCPAINT B01/B02S change exactly as listed above (same pixel counts). `PAINTED-SPIKE-HeadSide` 90-frame sequence: no
  change inside any boil step (so no profile blink and no blink-driven ink re-randomisation). Sheet re-rendered:
  `out/qa/headside/PAINTED-SPIKE-HeadSide_F0_540.png`. tsc: my files clean; the only error is in Film's concurrent
  `src/painted/spike/zcpaint-pov-index.ts` (not touched).

## 2026-10-29 — Film brief `VB-ZCPAINT-SHORT-R2.1` and spike `SPK-ZCP-03`

- Full-frame B02-SH02 POV (drag) in `src/painted/spike/ZcPaintPov.tsx` (`b02PovFull`, `CaptionShadeSoft`); compositions `ZCPAINT-SPIKE-B02POV-FULL`, `-FULL-BARE`, `-FULL-CAP`; stills `out/painted/zcpaint/r21/`; log `out/logs/zcpaint-r21.log`.
- Type error Boss reported in `src/painted/spike/zcpaint-pov-index.ts` line 17: a transient edit had put two components into one `createElement` props object (`{..., component: ZcPaintB02LowCap, ZcPaintB02LowShade, ...shot}`); fixed in R2 work; `npx tsc --noEmit -p . --typeRoots ./node_modules/@types` passes.
- Finding: in a full-frame cream POV the caption-zone default (0.25 / 0.40, from ZCONDO SP02 dark Blender plates) cannot pass without a visible dark band, which the user rejected. A soft elliptical shade under the text over a shadowed cabinet front gives 0.395 / 0.526 under the text and a clean outline read. The brief sets its own POV acceptance (≤0.45 / ≤0.60 + full-resolution read); caption-zone.py has no x-range option, so the under-text figure was measured with an ffmpeg crop (x 150–930, y 1140–1248).
- zsh note: `for spec in "A 0"; do set -- $spec` does not split words in zsh; use a small function with two arguments.
- Library check for the running footsteps (29 Oct 2026): only `foley_footsteps-shuffle-drag_01` (slow shuffle with a dragged foot); a new cue is needed (`NEEDS-GEN`, prompt fields in the brief's SFX table).

### Proposed tool change (not applied; TL/DP)

7. `scripts/caption-zone.py`: an `--xrange x0:x1` option so the band can be measured under the caption text only (full-frame POV acceptance in ZCPAINT R2.1).

## 2026-10-30 — Boss pass 1: model sheet `S-P01`, blink switch, hands, shared screen layers, jolt list

- Checkout: `claude/zcondo-paint-tsx-remotion-bdb058` at `0a35754` plus the uncommitted WORLD FOG spike work; `node_modules` is still Film's symlink. Nothing committed.
- Stage stopped at the first look check: the model sheet (`LC-ZCP-02`) before sets, plates or poses build on it. Not built this pass: `S-P02` pose tracks, `S-P03`, `S-P04` spikes, `S-P05`, `S-P10`, `S-07`, `S-08`, `S-09`, `S-11`.
- **New and changed code**
  - `src/painted/spike/FaceSheet.tsx`: `paintHead(..., style, opts: {blink?: boolean; blinkAt?: number})` (`MK-ZCP-B1`). Default is unchanged (blink on, seeded phase). `SideSheet.paintHeadSide`/`paintBodySide` gained the same `blinkAt`.
  - `src/painted/spike/CastSheet.tsx`: the front body moved out of the sheet loop into exported `paintBodyFront(ctx, cast, idx, cx, ground, {face, blink, blinkAt, lift, beforeArms})`; `lift` raises both forearms for the front bucket lift, `beforeArms` paints the load.
  - `src/painted/hands.ts` (`S-P07`): shared primitives `capsule`, `ring`, `solid`, `inkLine`, `twoBone`, `thumbShape`, tones `WFOG_HAND`/`ZC_HAND`, and `paintPovHand` (back-of-hand view, left/right, curl 0..1, spread, thumb target, per-finger curl, press, forearm and sleeve). `WfogPhone.tsx` now draws through the primitives and the shared thumb geometry.
  - `src/painted/screen.tsx` (`S-P06`, `S-P08`): `Grade`, `Grain` moved from `WfogShop.tsx` (re-exported there), plus `CaptionShade` (`band` y 990–1330 peak 0.62; `soft` ellipse 560×190 at (540, 1170) peak 0.5) gated by `shadeGate(tl, cues)` (`MK-ZCP-B3`: on from the first cue, off 6 f after the last, 4 f eased ramps, nothing when the shot has no cues). Plates call it from their `Overlay` (screen space, after `Grade`/`Grain`).
  - `src/painted/zcpaint/cast.ts`: `YOU`, `YOU_DAY3`, `INFECTED` (+ `INFECTED_SCALE` 0.95), `ZC_FACES` (brief mapping), overlays `paintRageFront`, `paintInfectedSide`, `paintDay3Face`, `paintDay3Shirt`.
  - `src/painted/zcpaint/figure.ts`: `paintBodyBack`, `paintSeatedFloor` (B09), `paintSeatedSofa` (B07), `rotated` (a head pitch through a wrapped `Paint`).
  - `src/painted/zcpaint/jolts.ts` (`MK-ZCP-B2`): one seeded list per language across B02-SH01/SH02; `poundJoltFrames(lang)` (composition frames for Editor), `poundJoltPlateFrames(lang, shot)` (plate clock), `joltAt` (kick/shudder). Export for Editor: `out/painted/zcpaint/b02-pound-jolts.json` via `node --import tsx scripts/zombie-condo-paint/jolts.ts`. TH 11 jolts `[155, 165, 181, 192, 202, 218, 234, 243, 258, 272, 282]`; EN 12 `[143, 180, 196, 207, 217, 233, 249, 258, 273, 287, 297, 307]`.
  - Review sheet `src/painted/spike/ZcModelSheet.tsx` + entry `src/painted/spike/zcpaint-model-index.ts` (`ZCPAINT-MODEL-A` calibration, `-B` standing views/infected/faces/blink switch, `-C` seated poses and POV hands). Tests: `tests/zcpaint.test.ts` (jolt list, shade gate).
  - Scripts: `scripts/zombie-condo-paint/render-frames.sh` (decoded-RGB md5 of spike stills), `model-sheet.sh`, `bbox.py`, `jolts.ts`.
- **Evidence** (images under `out/painted/zcpaint/model/`, logs `out/logs/zcp-*.log`)
  - WORLD FOG outputs identical (decoded RGB, 21 frames before vs after, `out/qa/zcp-s01/{before,after2}/md5.txt`): `PAINTED-SPIKE-FaceSheet`/`-Cast`/`-Proportions` F0/F30/F60, `-CastSide` F0/F45, `-HeadSide` F0/F30, `WFOG-PREVIEW-S02-SH02` F0/F40/F60/F89 (thumb moving), `WFOG-SP01-S02-SH09` F0/F100, `WFOG-SP01-S03-SH03` F0/F60. Not re-rendered: `ZCPAINT-SPIKE-*` (Film spikes; they only gained re-exports).
  - Determinism and seek parity: `ZCPAINT-MODEL-B`/`-C` F45 rendered twice identical and equal to the `--sequence` frame 45.
  - Leads (pixel bbox, hair tuft to floor, scaled to the shot scale): standing 1.70 m = 766 px at 447 px/m (front; 779 with the profile tufts); seated floor day 3 ≈ 466 px at scale 1 → **≈523 px at `SEC-2D-LL` B09 (502 px/m)**; sofa ≈ 681 px at scale 1 → ≈650 px at B07 (427 px/m). Both seated leads clear 480 (`S-P04` b: pose and lead measured on the model sheet, not on a section plate). Caption zone: N/A (no captions on the sheets).
- **Findings and open points for the look check**
  - Stylized legs (0.67 m) cannot sit on a 0.45 m sofa with the thigh horizontal: the figure's thigh slopes down 22° so the bare feet reach the floor. Alternative: lower the painted sofa seat to ≈0.36 m (Mark/Film).
  - Mark's B09 coordinates (knees z 0.50 m, feet 0.42 m ahead of the hips) do not fit 0.33 m bones; the painted pose keeps the intent (knees to the chest, shins leaning forward to the feet, forearms over the knees, head down 20°) at stylized dimensions. Lead is the measured one above.
  - The infected has no stoop yet (drawn at 0.95 scale); a stooped profile needs a torso lean in `paintBodySide`, wanted only if she is seen in profile (she is not after R2.1 except the B01 silhouette).
  - Head turn to the front decal (`S-P04` e) is not built: `paintBodyBack` takes `headScaleX` for the squash half; swap to `paintHead` at the narrowest width is the plan.
  - `ZcPaint.tsx`/`ZcPaintPov.tsx` still carry their own copies of `YOU`, `INFECTED`, the rage face and the hand code; the owned modules above supersede them (spikes left as Film's evidence). `ZcPaintPov.tsx` has one pre-existing lint error (`ell` unused), not mine.
  - p5.brush has no global `rotate` in the typings used here; head pitch is done by rotating the points of a wrapped `Paint` (`rotated`).
- **Proposed document changes (not applied)**: (1) brief `S-P01` owner path: the owned modules are `src/painted/{hands,screen}` and `src/painted/zcpaint/{cast,figure,jolts}`, the sheet stays in `src/painted/spike/`. (2) `MK-ZC-ST-09`: record the 4 f ramps on the gate (the sheet says on/off at the cue). (3) `MK-ZC-ST-03`/set kit: sofa seat height 0.45 m vs figure legs (above).

## 2026-10-30 — Boss pass 2: user answers on the model sheet, pose tracks, first section set

- User answers (30 Oct 2026, `LC-ZCP-02`) applied: (1) day-3 stubble as fine seeded dots (`paintDay3Face`, ~150 dots, no veil), under-eye marks light (`#b98a70`, weight 0.8); (2) infected stoop: `paintBodySide(..., {stoop})` leans everything above the hips about the hip point (rad; `INFECTED_LEAN` 0.3), `paintBodyFront`/`paintBodyBack` `stoop` 0..1 drops shoulders 0.09 and head 0.17 head-heights; `rotated(p, about, angle)` moved into `SideSheet.tsx` (exported there and re-exported from `zcpaint/figure.ts`); `paintBodySide` now returns `{head, tilt}` (head anchor rotated) and overlays use `rotated(overlayPaint, head, tilt)`. Height check on page A: you 766 px, infected 728 px = 0.95 (1.615 m class). Stoop with a `grip` is not supported. (3) B09 floor pose kept. (4) hands reworked in `src/painted/hands.ts`: curled fingers get a turned-over cel-shaded tip and a knuckle bump with ink (no nail), `pinch` param (index bends to meet the thumb tip, thumb target follows); edge grip = fist with the thumb across the knuckles, thumb-turn = index-thumb loop. Flat press and slam read as the WORLD FOG hand (same capsule/nail/cel construction). (5) B07 sofa: sloped thigh kept as the default.
- New: `src/painted/zcpaint/pose.ts` (`track`, `trackPt`, `trackHand`: eased keys on the plate clock, hold the last value); `src/painted/zcpaint/space.ts` (`section(SEC_2D, yc)` projector, `SEC_2D_LL_B09/B07`; reproduces the B03 sheet values: corridor face x 48, cabinet (283, 779), head (373, 615), lead 574); `src/painted/zcpaint/sets.ts` (cream section kit: rooms, door wall + door, flush cabinet, P1 with lintel-only cap, bathroom fixtures, flat corridor cap, slabs, neighbour slices, per-zone light levels); spike `src/painted/spike/ZcSetSheet.tsx` + `zcpaint-set-index.ts` (`ZCPAINT-SET-B03`, `-B03-CAP`: B03-SH01 with the lights-out keys of the sheet, band shade gated to the TH cue, mock low caption).
- Evidence: model pages `out/painted/zcpaint/model/` (`contact-sheet-F0.png`, `crop-C-hands.png`, `crop-B-infected.png`, `crop-B-day3.png`); set `out/painted/zcpaint/set/b03-sheet.png` (F0, F15, F30, F60, caption mock F20) and `*_capzone.png`. Caption zone (band 1060-1248, default 0.25/0.40): F15 0.187/0.362 pass, F30 0.103/0.155 pass, F60 0.168/0.295 pass; F0 0.377 fails but has no caption (the gate is off before the first cue). Lead about 590 px incl. hair tufts and shadow (projected 574). WORLD FOG identity re-run after the SideSheet/CastSheet/hands changes: 21 frames identical (`out/qa/zcp-s01/after3/md5.txt`). tsc passes; `npm test` 88/88; eslint clean except Film's `ZcPaintPov.tsx` `ell`.
- Known looks to judge: large dark fills show a mottled cloud texture (p5.brush fill texture 0.08 on big polygons) and the neighbour lamp pool reads as a yellow blob; fixtures are plain boxes; the kitchenette side and balcony are not built; the P1 face reads pale. Not built (waiting for this set look): plate module/registry (`S-P05`), neighbour/kitchen/living/balcony/B10 sets, `S-P04` spikes, `S-P10`, `S-07`.

## 2026-10-30 — Boss pass 3: clean kit, unit strip, plates, POV backdrop

- Inputs applied (chat, 30 Oct 2026, in `delivery.md`): (1) flatter fills, no cloudy blotch on large dark areas; (2) light only at the ceiling lamp, no wall pools; (3) blackout level approved; (4) hands: fingers curl round the cabinet edge, pinch with a visible gap; then the stronger rule “สะอาดแบบตัวละคร” (every set, plate and POV background as clean as the characters: opaque flat fills, paper grain only, no mottling, no dirty veils).
- **B03 change (coordinator, 30 Oct 2026):** B03-SH01 becomes a first-person POV (“POV หันมองในห้อง”, lights dying room by room). The B03 section plate is removed from production (`src/painted/shots/zcpaint.tsx` has no `ZCP-B03-SH01`). Its kit proof is kept as evidence only. The B03 POV plate follows with S-P10 once Mark's sheet exists. The shared pieces (unit strip, flat kit, lamp, POV backdrop) are reusable for it.

### The clean kit (shared default, ZC modules only)
- **Measured cause:** a textured, nine-pass p5.brush fill on a large polygon is mottled (luma SD 0.016 on 1000 x 400 px, `out/painted/zcpaint/flattest/clean0.png`). A `brush.wash(color, 255)` fill of the same area is flat (SD 0.000, `clean1.png`, dark; `clean2.png`, light). Tiles of 220 px with nine passes are between the two (SD 0.002–0.012, `clean3.png`). Two passes are light and blotchy; six are dark with a faint blot; nine to ten are even (earlier test).
- **Rule now in code:** `flatKit` (`src/painted/zcpaint/sets.ts`) fills every background, set and POV area with one `wash` and no texture; ink outlines are the boiling rotring lines. Character passes are unchanged (`hands.ts`, `figure.ts`, `makePaint`). `screen.tsx` is unchanged: Grade and Grain are the only texture; `CaptionShade` is a CSS gradient. `solid` (shared with WORLD FOG `WfogPhone`) is not changed.
- **Determinism:** `b04-F0` rendered twice, decoded RGB identical (`2123ab20…`). Wash-only backgrounds carry no noise, so no re-render drift.
- **Before/after (section):** `out/painted/zcpaint/set/before-after-B04-F0.png` (left `b04-F0_before-kit9.png`, nine textured passes; right `b04-F0.png`, wash). Neighbour area below the slab, `100,1400-1000,1800` (grain and vignette included): SD 0.0213 before, 0.0072 after.
- **Before/after (POV):** `out/painted/zcpaint/pov/before-after-B02-SH02.png` (left Film's current `ZCPAINT-SPIKE-B02POV-FULL-BARE`, F60, with the dark defocus band, the wash veils and the jagged latch line; right `ZCPAINT-POV-B02-SH02`, F60, the new `src/painted/zcpaint/pov.ts` backdrop with the WORLD FOG hand construction). Pure door area between the hands measures SD 0.0031 in both, so the difference is visual (veil, band, latch edge, cabinet mottle), not a flatness number. Measurements that include hands or forearms are not usable.

### Unit strip and plates
- `src/painted/zcpaint/rooms.ts` `paintUnit`: the whole unit once per frame (entry with door, cabinet and lamp; bathroom with basin, toilet and lamp; kitchenette with fridge, counter, shelf, stove case, window and lamp; living with sofa, table, glazing at Y 9.20 and lamp; partitions P1 and P2 with doorways). The truck plates draw the strip, so no bare paper shows at the frame's edge (the first render had that gap; fixed).
- `paintBathTap` (B04): louvre window, running tap and its stream.
- Plates in `src/painted/shots/zcpaint.tsx` (registered in `src/painted/registry.ts`, IDs unique):
  - `ZCP-B04-SH01`: truck, Yc 1.30 → 2.70 (`truckYc`, 85 f, 10 f ease), him walking Y 0.70 → 2.40.
  - `ZCP-B04-SH02-TH` / `-EN`: diagram, per-language keys (`diagram.ts`).
  - `ZCP-B06-SH01`: kitchen truck, Yc 2.80 → 4.20 (80 f), him walks to Y 4.45 and turns to the fridge.
  - `ZCP-B07-SH02`: living truck, Yc 5.40 → 8.20 (89 f), seated on the sofa at 480 px/m (`SEC_2D_LL_B07`).
  - `ZCP-B08-SH01`: balcony multiplane (`balcony.ts`): layers L4 s 1.08/dy 90, L3 1.05/60, L2 1.03/30, L1 1.015/12, ramp pf 30–204; L0 static.
  - `ZCP-B10-SH01`: interior (`interior.ts`), `PERSP-2D` F 1844 at (Y 3.25, d 0.52), eye 1.58; turn back to pf 107, profile 109–115, front from 117.
- **Projection check:** `persp()` reproduces the B10 staging (door x 408–948, top y 213). `truckYc` tests in `tests/zcpaint.test.ts`.
- **Sheets** (spike entry `src/painted/spike/zcpaint-set-index.ts`; each composition renders the plate through `PlatePreview`, the production `drawPlate` path): `ZCPAINT-SET-B04-SH01` (+ `-CAP`), `ZCPAINT-SET-B04-SH02-TH`, `ZCPAINT-SET-B06-SH01`, `ZCPAINT-SET-B07-SH02`, `ZCPAINT-SET-B08-SH01`, `ZCPAINT-SET-B10-SH01`, `ZCPAINT-GRIP`, `ZCPAINT-POV-B02-SH02`. Review images: `out/painted/zcpaint/set/sheet-latest.png` (B06 F80, B07 F89, B08 F120, B10 F111, diagram F60), `out/painted/zcpaint/set/b04-sheet.png`, `out/painted/zcpaint/set/grip-540.png`.

### Caption zone (band 1060–1248, default thresholds 0.25 / 0.40, with `ZC-CAPSHADE` band 0.62 gated to the TH cue 0–32 f)
- `ZCPAINT-SET-B04-SH01-CAP` F15 (with subtitle “แต่ก๊อกน้ำยังไหล”, the brief's TH line 1): mean 0.207, p95 0.327, pass.
- `ZCPAINT-SET-B04-SH01` F0: 0.171 / 0.296, pass. F15: 0.177 / 0.296, pass. (`out/logs/zcp-b04-capzone.log`, overlays `*_capzone.png`.)
- The earlier B03 caption numbers (F15 0.205 / 0.377) are not kept: B03 is removed from production.

### Measurements (S-P04 and seek parity)
- **Fire cluster above y 860 (c):** F0 fire pixels x 164–467, y 555–694; F120 x 158–466, y 565–726 (`flatness` script not used; a colour test on `#d89a4e` / `#f2c27a` core, excluding skin). Pass.
- **Cost (c):** B08 60 frames in 13 s including browser start; B04 60 frames in 12 s (sequence render). Roughly 0.2 s per frame; a full render is not estimated from this.
- **Seek parity:** B04 F0 still = `--sequence` frame 0 (identical). B10 F111 still = sequence = rerun (identical). B08 F120 rerun identical; B08 still vs sequence differ by 2 bytes, each by 1 level (of 6.2 M). Recorded as a limitation (layer transforms, p5.brush rounding); not fixed.
- **B10 turn (e):** staged in `interior.ts`; the face-box acceptance (x 140–460, y 420–780) is not verified numerically (the skin mask is too loose: arms and hands enter the box). Head top at 430 by construction (1.70 m at 791 px/m). Look check only.
- **Truck swim (a):** the truck plates are fixed-VP with flat fills (no per-frame texture), so no fill swim is expected; the swim check on a 540 px sheet across start/mid/end is for the user's look check (`ZCPAINT-SET-B04-SH01` F0/F40/F85 in `b04-sheet.png`).
- **WORLD FOG identity (decoded RGB, 21 frames, `out/qa/zcp-s01/after4/md5.txt` vs `before/md5.txt`):** identical.

### Hands (`src/painted/hands.ts`)
- `paintPovHand`: `pinchGap` puts the thumb tip beyond the index tip; `pinchGap` 90 local (≈54 px) in the grip sheet, the knob in the gap (`ZcSetSheet.tsx` `gripPaint`).
- `paintEdgeGrip` (new): knuckles on the cabinet top, fingers turn over the front lip and their tips hang down the front face, drawn after the cabinet; thumb on the end. Rendered on the cabinet in `ZCPAINT-GRIP` cell 1.
- `hands.ts` `INK` is now a local constant (no import of the spike sheet into plates).

### POV backdrop (B02-SH02, S-P10 part)
- `src/painted/zcpaint/pov.ts`: `paintPovBackdrop(ctx, {slide, bob, jolt, press})`: door leaf with panel, thumb-turn (locked), latch gap; jamb; cabinet top, back edge, front and base; two doors; floor at the corners; both hands (`paintPovHand`, `ZC_HAND`, palms flat, fingers toward the door) with sleeves from the lower corners. No veil, no falloff band, no CSS shade (the `ZC-CAPSHADE` soft ellipse is applied by the plate, not here). `slide`/`bob`/`jolt` are wired for the drag and the pound jolts (`jolts.ts`); the drag keys and pound plates are not built.

### Not built this pass (open, owner)
- **B09 section** (SEC-2D-LL floor seated day 3, entry with cabinet and buckets): the kit is ready (`paintUnit`, `paintSeatedFloor`); the plate is not built. Boss, next.
- **B03 POV** (Film's brief and Mark's sheet first, then S-P10).
- **B02-SH01 and B09-SH02B POV plates**, the pound-jolt wiring into the backdrop, and the B02 drag keys. Boss, S-P10.
- **B01 turn and charge (S-P04 d)**: needs the PERSP corridor (cream repaint of the Film spike). Boss.
- **Glow overlays** (fires, the ceiling lamp): the lamp is painted (stepped flat rings, no alpha), fires are warm fills. The Remotion glow layer (≤ `GLOW_PEAK`) is not built. Boss, with S-08.
- **Diagram labels** (`S-08`): Remotion text, not built. The diagram sheet is shown without the vignette.
- **Sections not yet built for inserts**: B05, B06-SH02 and B06-SH03, B07-SH01, the bowl and cistern inserts.
- **Seek parity on B08** (1-level difference, above): investigate the multiplane transforms or accept with the note.

### Proposed document changes (not applied; for user review, TL/DP)
1. `.claude/skills/painted-2d/SKILL.md` gotchas: "A textured p5.brush fill on a large polygon mottles (luma SD 0.016 at 1000 x 400); use `brush.wash` for backgrounds and large areas (SD 0.000), keep textured passes for characters. Measure with `scripts/zombie-condo-paint/flatness.py`."
2. `dev-findings` entry (not written in this pass): "p5.brush `fill` with fillTexture 0 on large polygons still mottles; `brush.wash(color, 255)` is flat. Reproduced: `out/painted/zcpaint/flattest/`."
3. Brief `VD-ZC-AU`/`ZC-CAPSHADE` and `MK-ZC-ST-08`: "backgrounds use the flat wash; no dirty veils or dark bands on POV or set plates."
4. Brief B03-SH01 POV: Film's revision (coordinator note, 30 Oct 2026); no Boss action until Mark's sheet.

## 2026-10-30 — Boss pass 4 (partial): B08 hero frame, B04 truck keys, diagram plain paper, thin ink edges

- Scope asked (coordinator, R2.3 / SS-R1.1): (1) thin ink on set edges; (2) default grain; (3) B02-SH02 drag hands hooked over the lip; (4) B08 pointed flickering flames and rising smoke, orange reflection; (5) diagram plain paper; (a) lived-in details; (b) material lines; (c) character detail (ZC overlays only); (d) B08 city detail; S-P10 POV plates; B09 section plates; B01 turn if time; B08 as the Short's hero frame (user, 30 Oct 2026: “แสงเงาของเมืองตอนไฟไหม้ … สวย ๆ”).
- **Done in this pass**
  - B08 hero (`src/painted/zcpaint/balcony.ts`): flat sky bands (16) and a pale moon; seven-plume smoke per source (two sources) lit orange low, dark up top, drifting with pf; pointed flickering flames (four nested tongues, flicker steps every 2 f, seeded), with a dark warm halo and an ember bed under them; far layer atmospheric fade (`mixColor` toward the horizon); the facing towers take a warm bounce on their fire-facing edge, falling off with distance from the cluster column; windows flicker orange (`hash(seed + floor(pf/4))`); a warm rim on his left side (silhouette copy offset 9 px, drawn first) and warm highlights on the rail and balusters; cars and a street band on the far layer (dark, lights off). Flat fills only; no textured passes in the backdrop.
  - Caption zone B08 (default 0.25 / 0.40, no shade as the brief says): mean 0.19 pass; p95 0.72 **fail**: his grey trousers sit in the caption band over the dark slab. Decision needed (see the question list).
  - B04-SH01 keys (R2.3): `truckYcHold(pf, 1.30, 2.40, hold 14, end 57)` (`space.ts`); him walks to 2.40 by pf 75. Caption cue (TH line 1 [0, 32) f) at F15: mean 0.204, p95 0.327, pass.
  - Diagram: plain paper, grain only, no vignette (`ZcSetB04Diagram`).
  - Edges: `box()` outlines the side and top; `roomShell()` inks the back-wall edge and skirting. Floor and ceiling seams are not inked yet.
  - Grain: default (0.09) kept on sets, as answered.
- **Checks:** determinism: B08 v3 F60 rerun, 13 bytes differ by 1 level (brush rounding in the fire area; the same class as the pass 3 note); B04 F0 and B10 F111 were exact in pass 3. WORLD FOG identity: 21 frames identical (`out/qa/zcp-s01/after5/md5.txt`). tsc passes; `npm test` 90/90.
- **Images:** B08 full frames `out/painted/zcpaint/set/b08-v3-F0.png`, `b08-v3-F60.png`, `b08-v3-F120.png` (1080 x 1920); sheet `b08-v3-sheet.png` (480 px tiles). B04 `b04-v3-F0.png`, `b04-v3-F40.png` (new keys), caption `b04cap-v3-F15.png`. Diagram `dg-F60.png` (plain paper: re-render from the sheet entry).
- **Not done (explicit):**
  - (a) lived-in details (switches, sockets, shoe rack, shelves, curtains, pictures, rug, kettle and dish rack);
  - (b) material lines (grout, wood grain, hinges, handles, floor and ceiling seams);
  - (c) character detail (collar, shirt folds, hair strands, toes, contact shadow) as ZC overlays;
  - (3) B02-SH02 hooked hands (`paintEdgeGrip` exists; the POV backdrop still uses palms flat);
  - S-P10 POV plates: B03-SH01 whip (the sheet's View A → View B, 7 f, smear), B02-SH01 (door, bolt, bag, hands), B02-SH02 drag keys and pound-jolt wiring (`jolts.ts` exists), B09-SH02B tilt-up;
  - B09 section plates (`paintUnit`, `paintSeatedFloor` ready);
  - S-P04 (d) B01 corridor and turn (the PERSP corridor in the cream key);
  - B08 Remotion glow bloom (≤ `GLOW_PEAK`) over the fires; B08 is painted-only so far.
- **Limitation:** the smoke reads as stacked round plumes; the fire flames are pointed but still small against the frame. First-pass look; for the user's review.

### Proposed document changes (not applied)
1. Brief B08 caption rule: p95 fails by the trousers. Options for Film or Mark: a cue-gated `ZC-CAPSHADE` band on B08 caption cues (the brief now says none), or lighter-cut trousers on the back view.

## 2026-10-30 — Boss pass 5: detail, POV plates, B09 plates

- Scope (chat, 30 Oct 2026, in `delivery.md`): detail pass (a) lived-in, (b) material lines, (c) ZC character detail; S-P10 POV plates; B09 section plates; hooked hands B02-SH02; B01 only if time (not done). B08 not touched (Film). No brief or rule-doc edits. Stop at the user's look check. Not committed.
- Coordinator direction (30 Oct 2026, received mid-pass): SVG or React layers over the painted canvas are allowed where an element reads better crisp (`WfogPhone.tsx` precedent). Per-element decisions and reasons are the `SVG-ZCP-*` list below, for Film's engine ownership in the brief.
- Runtime status: `existing-integrated` at this checkout: none of the pass 5 plates is in a timeline; plates are registered in `src/painted/registry.ts` via `src/painted/shots/zcpaint.tsx` (`exists-unintegrated`, Editor's blockout pending).

### Status by item

| Item | Status | Evidence |
| --- | --- | --- |
| 1a lived-in room | built: entry switch and wall-hung shoe shelf above the cabinet; bathroom shelf with bottles and a socket; kitchen socket, jar shelf, kettle, dish rack; living rug, wall picture, two cream curtains | `src/painted/zcpaint/detail.ts`, `rooms.ts`; B04-SH01 F0 crop `out/painted/zcpaint/p5/crops/B04-SH01_F0_entry.png`; B06 F40, B07 F45 in `sheets/SEC-B04-B06-B07-B10.png` |
| 1b material lines | built: tile grout every 0.6 m on each floor, plaster joints on each ceiling, wood grain on the entry door leaf and the cabinet front (upper), door frame, hinge knuckle, skirting kept from pass 4 | `detail.ts` (`floorGrout`, `ceilingSeams`, `entryWall`, `cabinetGrain`), `interior.ts` (B10 door grain and hinge) |
| 1c character detail (ZC-only) | built as overlays after the shared figure code: collar, shirt folds, hair strands (not on the B10 back view, see below), toes, flat contact shadow. WORLD FOG identical (decoded RGB, 21 frames) | `src/painted/zcpaint/figdetail.ts`; applied in `shots/zcpaint.tsx` (`stand`, B07 sofa) and `interior.ts` (B10 back view) |
| 2 hooked hands B02-SH02 | built: `hookHand` (`paintEdgeGrip`, scale 1.6) on the drag; palms flat from f 47 (regrip) | `pov.ts` `hookHand`; `hands.ts` `EdgeGrip.scale` (default 1, grip sheet unchanged); `sheets/B02-SH02-TH.png` |
| 3a B03-SH01 POV (A → whip → B) | built, per-language IDs `ZCP-B03-SH01-TH`/`-EN`: View A (door, left hand on the cabinet), 7-frame whip (smear, veil alpha 40), View B (one-point room, lamps out near → far, neighbour window last), dark hold | `povshots.ts` `paintB03Sh01`, `B03_KEYS`; `overlays.tsx` `b03Overlay`; `sheets/B03-TH.png`, `sheets/B03-EN.png` |
| 3b B02-SH01 POV | built, per-language IDs: left palm slam at f 2, right hand drops the bag (out of frame by f 7), rises to the thumb-turn (TH f 5 / EN f 17), bolt turns (TH 4–7 / EN 17–21), corridor light line at the top (y 34–40) and the latch edge; soft shade | `povshots.ts` `paintB02Sh01`, `B02_SH01_KEYS`; `sheets/B02-SH01-TH.png`, `-EN.png`; pinch crop `crops/B02-SH01-TH_F30_pinch.png` |
| 3c B02-SH02 POV | built, per-language IDs (see deviation D1): drag from the right (+420 → 0, three strides), shove to flush at f 54, door layer 0.92 → 1.00 (f 39–54), hooked grip to f 47 then palms, pound jolts from `jolts.ts`, soft shade | `povshots.ts` `paintB02Sh02`; `sheets/B02-SH02-TH.png`, `-EN.png` |
| 3d B09-SH02B POV tilt | built: camera tilt dy −1100 → 0 over 18 f (eased) from the knees to the still door; door, cabinet, floor, clasped hands on the knees, phone and cans | `povshots.ts` `paintB09Sh02b`; `shots/zcpaint.tsx` `CAM_B09_SH02B`; `sheets/B09-EN-POV.png` |
| 4 B09 section plates | built: `ZCP-B09-SH01-TH`/`-EN` (seated day 3 hugging knees, facing the door, buckets, cans, phone, counter board with SVG icons on the per-language keys); `ZCP-B09-SH03` (echo of the B04 start: corridor cap, door wall, cabinet, head lifted 15°) | `b09.ts`; `overlays.tsx` `B09Counter`; `sheets/B09-TH.png` |
| 4b trash bag | checked: no bag is painted in any section plate; the B04-SH01 start frame has the bag's projection (Y 0.20–0.48, d 1.25–1.65) inside the cabinet outline; the frame shows the cabinet there and no bag pixels | `crops/B04-SH01_F0_entry.png` (visual check; the acceptance row for the start frame is Mark's) |
| 5 B01 corridor and turn | not done (time) | open, Boss |

### SVG and React layers (coordinator direction; Film to record in the brief's engine ownership)

Each element is a Remotion layer over the painted canvas (`PaintedShot.Overlay`). The corridor light line is canvas, not SVG: an SVG line drew over the knuckles in the first review, so it moved under the hands.

- **SVG-ZCP-1 thumb-turn bar** (`overlays.tsx` `Bolt`, B02-SH01 keys): rotates 0 → 90° about the lock centre (860, 640) on the per-language bolt keys. Reason: a crisp rotating bar that sits in the index/thumb gap; painted, it would smear across the fingers.
- **SVG-ZCP-2 entry lamp glow** (`EntryGlow`, B03 View A): `Spot` at (540, 20), level ≤ `GLOW_PEAK`, follows View A's slide and lights out at key 1. Reason: a glow layer capped by the shared rule; painted glows read as a flat disk.
- **SVG-ZCP-3 lamp glows** (`LampGlows`, B03 View B): three `Spot`s at the ceiling fixtures (bath 440,190; kitchen 540,380; living 580,480), level ≤ `GLOW_PEAK`, each dims on its key. Reason: "glow at the fixture only" is the brief's rule; the fixture shapes stay painted.
- **SVG-ZCP-4 counter icons** (`B09Counter`, B09-SH01 per-language keys): bucket icons 4 → 2 (TH f 24 / EN f 21, 8 f fade), can icons 6 → 4 (TH 57 / EN 45), battery 100 → 12 % (TH 105 / EN 66, 12 f). Reason: crisp icons whose count changes on the VO keys; the painted board is under them. Numerals and the day card stay Remotion text (Editor, S-08 not built; `quadTexts` fallback).
- Screen layers, existing and shared (not new SVG): `Grade`, `Grain` (default 0.09) and `CaptionShade` (`band` for B04, `soft` for the POV plates) are mounted by each ZC plate's `Overlay` in the order Grade → Grain → CaptionShade (`screen.tsx` contract). See PS-1 in the layer contract notes below.

### Caption zone (band y 1060–1248, `scripts/caption-zone.py --band 1060:1248`, final batch)

| Frame | Shade | mean | p95 | Threshold | Result |
| --- | --- | --- | --- | --- | --- |
| `ZCPAINT-P5-B04-SH01-CAP_F15` (TH cue 0–32 f, shared band) | band 0.62 (union cue) | 0.204 | 0.330 | 0.25 / 0.40 | pass |
| `ZCPAINT-P5-B04-SH01_F30` | band | 0.184 | 0.296 | 0.25 / 0.40 | pass |
| `ZCPAINT-P5-B02-SH01-TH-CAP_F15` | soft 0.5 | 0.476 | 0.694 | 0.45 / 0.60 | **fail** (mean and p95) |
| `ZCPAINT-P5-B02-SH01-EN-CAP_F21` | soft 0.5 | 0.480 | 0.708 | 0.45 / 0.60 | **fail** |
| `ZCPAINT-P5-B02-SH02-TH-CAP_F12` | soft 0.5 | 0.434 | 0.660 | 0.45 / 0.60 | **fail** (p95) |
| `ZCPAINT-P5-B02-SH02-EN-CAP_F60` | soft 0.5 | 0.423 | 0.598 | 0.45 / 0.60 | pass |
| `ZCPAINT-P5-B03-SH01-TH-CAP_F12` (whip) | soft 0.5 | 0.402 | 0.599 | 0.45 / 0.60 | pass |
| `ZCPAINT-P5-B03-SH01-EN-CAP_F25` (whip) | soft 0.5 | 0.364 | 0.611 | 0.45 / 0.60 | fail (p95 by 0.011, a transitional whip frame) |
| `ZCPAINT-P5-B03-SH01-TH_F30` (View B, dark) | soft | 0.123 | 0.155 | 0.45 / 0.60 | pass |

- Test (not kept): soft peak 0.62 on the same B02 and B03 frames gives mean 0.440 / 0.445 / 0.402 / 0.391 / 0.385 / 0.351 and p95 0.672 / 0.688 / 0.625 / 0.591 / 0.593 / 0.597. The mean passes everywhere; the p95 still fails on the B02 frames, where the bright forearms and the hand skin sit at the band edges (the shade's falloff reaches them only weakly). A stronger shade alone does not meet the POV p95; the fix is in staging or the criterion (see the question list in the report).
- The shared B04 band uses the union of the two languages' cues (both 0–57 f in plate clock). The TH line is 9 frames later than the EN line, so the band starts 9 frames early in TH (deviation D3).

### Lead heights (painted extents from the figure geometry: a stub brush records the points of the same figure code at the stated scale; script kept in the Boss session scratchpad, not committed)

| Figure | Scale | Lead (painted top to floor) | Sheet value | Rule |
| --- | --- | --- | --- | --- |
| B04-SH01 standing (d 0.75, SEC-2D) | 0.756 | 591 px (includes hair tufts) | 574 px nominal | ≥ 480 |
| B09-SH01 seated (565 px/m, hips Y 1.20) | 1.124 | 514 px | 504 px | ≥ 480 (seated accepted by the user with ≈5 % margin) |
| B09-SH03 seated (565 px/m, head lifted 15°) | 1.124 | 536 px | ≈514 px | ≥ 480 |
| B07 seated on the sofa (480 px/m) | 0.955 | 650 px | not in sheets | ≥ 480 |

### Determinism and seek parity (final code)

- Cross-run determinism (second render run, six frames): four identical (`ZCPAINT-P5-B02-SH02-TH F40`, `B03-SH01-TH F14`, `B09-SH02B F9`, `B10-SH01 F116`); two differ by one pixel, two bytes, max level 1 (`B09-SH01-TH F57`, `B04-SH01 F30`). Same WebGL rounding class as the pass 4 B08 note; not a seek error.
- Seek parity (`remotion render --sequence --frames=8-18` vs stills), B03-SH01-TH: F8, F9, F11, F14, F18 identical; F17 differs in 2 pixels by level 1.
- WORLD FOG identity (21 frames, `out/qa/zcp-s01/after7/md5.txt` vs `before/md5.txt`): identical.

### Checks

- `npx tsc --noEmit --typeRoots ./node_modules/@types`: 0 errors (`out/logs/zcp-p5-tsc-final.log`).
- `npm test`: 93 / 93 (90 before; new tests for the B03 whip and lamp order, the B02 keys, the B09 tilt camera; the old "no B03 plate" assertion is now "B03 is the per-language POV plate").
- `npx eslint` on my files: clean. One pre-existing error in `src/painted/zcpaint/balcony.ts:98` (`'i' is defined but never used`, pass 4, B08 file): not touched (Film's B08 key art).
- Renders: 89 stills (`out/painted/zcpaint/p5/md5.txt`, 0 errors in `out/logs/zcp-p5-stills-final.log`). Sheets in `out/painted/zcpaint/p5/sheets/`; overview `sheets/overview-representative.png`.

### Deviations from the sheets (for Film and Mark to revalidate)

- **D1 B02-SH02 is per-language (`-TH`/`-EN`), not shared.** The seeded pound list (`jolts.ts`) starts at a different phase per language (first regular blow TH f 12 / EN f 39), so one shared plate would place the TH/EN pounds on the wrong frames. The paint is one function; the timing is unchanged.
- **D2 B02-SH01 and the B02 caption shade:** the sheet's "lower door in shade" now runs to the frame bottom (the sheet says "down past the frame bottom"; pass 3 stopped the leaf at y 900 and left bright wall under the captions).
- **D3 shared B04 cue union** (see the caption note above).
- **D4 B09-SH02B floor and knees:** the world floor starts at y 1500–1920; at f 0 the knees sit at y ~1050–1500 and the floor band from ~820 (sheet: floor 300–1000). The hands leave the frame at the end of the tilt (~f 18), not f 9. Phone and cans sit at world y 2050 (screen ~950 at f 0, sheet 760).
- **D5 B03 pounding picture:** no door jolts in B03 (the sheet puts the pounding fade on the sound; the picture jolts were not specified). Whip veil alpha 40/255 (my choice, not in the brief).
- **D6 pinch geometry:** the thumb-turn grip uses the grip sheet's pinch (`pinch` [195, 165], gap 49 at size 1.1, wrist (1068, 855)). The first version (index tip in the wrong place) was rejected by the crop check.
- **D7 shoe rack:** a floor rack would sit in the caption block at every truck position (projection VP y 860), so it is a wall-hung shoe shelf above the cabinet (Y 0.18–0.46, z 1.42–1.48). The switch moved to d 1.95 to clear it.
- **D8 B10 back view:** hair strands are off (the back hair already has two crown tufts; strands read as spikes). Collar and folds on.

### SVG and layer contract notes

- `trackHand` (`pose.ts`) copies the fields the track does not animate from the FIRST key only; `pinchGap` and `fingerCurl` must be on every key (see DF-20261030-zcpaint-pose-track-fields).
- **PS-1** Production PaintedStage does not mount `Grade`, `Grain` or `CaptionShade` (see DF-20261030-painted-screen-layers-overlay). The ZC plates carry them in their `Overlay`; the shipwreck plates and the B04-SH02 diagram do not (open, PS-1).

### Not done (open, owner)

- B01-SH01/SH02 corridor and turn (S-P04 d; Boss, if time).
- B09-SH02 profile close (PERSP-2D, held; Boss, not in this pass's list).
- B02-SH03 face close (PERSP-2D; Boss).
- B04-SH03/SH04 inserts, B05-SH01..03, B06-SH02/SH03, B07-SH01 (Boss sections).
- B10 side and front figure detail (only the back view has the ZC overlay); B10 lived-in items are not in the B10 framing except the door (partial (a)/(b)).
- Diagram B04-SH02: no Overlay (no grain in production); labels S-08 (Editor or Boss).
- Captions and numerals: Remotion text (Editor, S-08/S-09 placement).
- Sound (Editor): all `NEEDS-GEN` cues.
- B08: Film's key art (unchanged here).

### Proposed document changes (not applied; for user review, TL/DP)

1. Brief `VB-ZCPAINT-SHORT-R2.3` `S-P10` table: B02-SH02 per-language (D1); B02-SH01 door leaf to frame bottom (D2); B03 whip veil and no picture jolts (D5).
2. Brief POV acceptance (`VD-ZCP-POV`): the p95 ≤ 0.60 limit cannot be met on B02 with the hand and forearms in the caption band at peak 0.5; options in the report.
3. Brief engine ownership: add the SVG-ZCP-1…4 list above, with the reasons.
4. `.claude/skills/painted-2d/SKILL.md` gotchas: "trackHand copies non-animated fields from the first key"; "a SVG layer draws over the canvas figures: use canvas for anything a hand must cover".
5. Remotion toolkit / painted plates: "ZC plate Overlay carries Grade, Grain and CaptionShade; PaintedStage mounts none of them" (PS-1).

## 2026-10-30 — Boss pass 6: B08 production plate

- Scope (coordinator, 30 Oct 2026): build `ZCP-B08-SH01` from Film's key art `src/painted/spike/ZcB08Key.tsx` (brief `VB-ZCPAINT-SHORT-R2.4.1`, `VD-ZC-08`; sheets `ZCPAINT-SHORT-SS-R1.2`) and check the ten acceptance items. Uncommitted. No brief or rule-doc edit (proposals below). No other shot touched. No shared module touched, so the WORLD FOG md5 identity was not repeated (`registry.ts`, `screen.tsx`, `glow.tsx`, `camera.tsx`, `plate.ts`, `painter.ts`, `sets.ts`, `ctx.ts`, `PaintedStage.tsx`, `SceneRenderer.tsx` unchanged). Film's spike `ZcB08Key.tsx` is unchanged and remains the reference.
- **Built**
  - `src/painted/zcpaint/balcony.ts`: the production port, `paintBalcony(ctx, pf)`. Same paint calls, seeds and order as the spike (fidelity below); six layers through `layerAt`. Exports `layers`, `flare`, `slump`, `layerPoint`, `svgTransform`, `silhouetteParts`, `MAIN`, `SECOND`, `NIGHT`. The v3 paint is gone, and with it the eslint error at `balcony.ts:98` (`'i' is defined but never used`); eslint is clean on every changed file.
  - `src/painted/zcpaint/overlays.tsx`: `b08Overlay` = SVG bloom (`SVG-ZCP-6`) and embers (`SVG-ZCP-7`) in screen blend, each in the transform of the layer it lights, then `ScreenLayers` (Grade, Grain 0.09). No CaptionShade (`ZC-CAPSHADE` none on B08). `b08Bloom(pf)` is exported for the tests.
  - `src/painted/shots/zcpaint.tsx`: `plate('ZCP-B08-SH01', ['B08-SH01'], NIGHT, CAM_STILL, b08, b08Overlay)`. Paper `#21272a` → `#0c1014` (the key art's night). Hard cut; no label; no dissolve.
  - Review entries (spike only; not `Root.tsx`, not the episode registry): `src/painted/spike/zcpaint-b08-index.ts` and `ZcB08Plate.tsx`. Compositions: `ZCPAINT-B08-SH01` (plate + Overlay), `ZCPAINT-B08-SH01-BARE` (canvas only), `ZCPAINT-B08-TL-TH` / `-TL-EN` (`SceneRenderer`, one painted cue with `fromSec` 0.5 / 1.3, chrome off, `ending` B_loop with a trailing plain scene so the hold never touches the cue).
  - Tests (`tests/zcpaint.test.ts`, +5): the per-language clock; the flare half-way at pf 96 ± 2, full by 110, monotone; the slump from 127; the dark mass inside x ≥ 480 and y ≥ 1340 on every visible frame; coverage ≤ 14 %; glow ≤ `GLOW_PEAK` and above y 1040.
  - Checks: `npx tsc --noEmit --typeRoots ./node_modules/@types` exit 0 (`out/logs/zcp-b08-tsc-final.log`); `npx eslint` on all changed files exit 0 (`out/logs/zcp-b08-eslint-final.log`); `npm test` 98/98 (`out/logs/zcp-b08-npmtest.log`; 93 before this pass).
- **One shared plate, not per-language IDs (decision).** The paint has no language input: no captions, no VO-locked keys, no jolt list (contrast D1 for B02-SH02, whose jolt phase differs per language). The only difference is the start offset: TH cue `fromSec` 0.5 (pf = f + 15), EN cue `fromSec` 1.3 (pf = f + 39). Both land on pf 96 (TH f 81, EN f 57): the clock test and the pixel check in item 6 show it. Per-language IDs would duplicate identical art. The Editor sets `fromSec`; Boss owns every layer transform and key (sheet `sc01-b06-b08.md`).

### Acceptance `VD-ZC-08` (production plate `ZCP-B08-SH01`; measured on bare canvas frames unless noted)

| # | Item | Measured | Status |
| --- | --- | --- | --- |
| 1 | Silhouette inside x ≥ 480, y ≥ 1340, ≤ 14 %; city fills the rest; horizon y 880 ± 20 | Dark mass, geometry over pf 15–173: min x 512.4 (pf 128), min top 1344.3 (pf 127); coverage 8.2–8.5 % (pf 15, 20, 96, 110, 150, 173). Pixels (exact #06080a, x ≥ 400, y ≥ 1200): min x 514–522 at pf 20 / 110 / 150; 5–14 stray exact-colour pixels in the tower glass at x 144–427 are not the mass. The warm rim alone reaches y 1338.1 (pf 127). Horizon: VP y 880 by construction; the far-floor fill starts at y 910 in code; the step is ≤ 2 levels, so there is no edge to measure | PASS for the mass. Rim 1.9 px above the line (D-B08-3). Horizon not measurable (D-B08-4) |
| 2 | Four sources visible at pf 110 (far, mid, main, second); none in the near layer or below the caption block; main flames ≤ y 300 at full flare; fires brighter than luma 0.5 above y 860 | Main flame tip y 329 (pf 20), 303 (pf 96), 279 (pf 110), 278 (pf 150). Flame-core pixels (warm, luma > 0.5) at y ≥ 860: 0 at all four frames; at y ≥ 1040: 0. **Visible sources: two (main, second).** The far pair (96, 866) and (1004, 874) sits behind the L3 near towers: 0 flame-core pixels in their windows at every frame (`crop-far-and-rim-c110.png`). The approved key art has the same occlusion | **FAIL as written** on the far pair (`DF-20261030-b08-far-fires-occluded`, Q1). Other parts PASS |
| 3 | Smoke: continuous flowing columns, orange base, slate top; wobble travels up pf 20 → 60 | 270 px sheet viewed: two ribbons, no round plumes, orange base, slate top. Crop `crop-smoke-c20-c60.png` (full resolution): the column reshapes between pf 20 and pf 60. Direction of travel not measured | PASS (visual) |
| 4 | Light: fire-facing faces warm; a cool unlit face per layer; no window lit from inside; rim on top/left only, ≤ 10 px, warm from the main blaze | Rim at row 1600: left 6–7 px, right 0 px; top 4–5 px (column 884). Front glass dark; fire reflections only on the side faces (sheet, viewed) | PASS |
| 5 | Painted-clean: luma SD ≤ 0.010 on 200 × 200 of a tower face and of the sky (`flatness.py`) | Literal boxes: sky (0,0)-(200,200) SD 0.0144 / 0.0181 / 0.0096 at pf 20 / 96 / 150 (the smoke pall edge is inside); tower (920,400)-(1120,600) SD 0.0117 / 0.0120 / 0.0136 (the designed windows are inside). Wash-only boxes: sky (0,0)-(200,60) SD 0.0000 at pf 20 / 96 / 150; tower strip (920,434)-(1120,450), no window, SD 0.0000 | **FAIL as written**; PASS on wash-only areas (Q2) |
| 6 | Timing: flare mid-point pf 96 ± 2, full by pf 110; slump at pf 127 ± 2 | Formula (test): the flare reaches its half-way value at pf 97 (the smoothstep midpoint), 1.0 at pf 110; slump 0 at 127, 1.7 px at 129, 16 px by 137. Pixels: main flame tip 303 → 279 px from pf 96 to 110. TH f 81 ≡ EN f 57 ≡ plate pf 96 (chrome off; ≤ 2 levels on 0.007 % of pixels) | PASS |
| 7 | Caption: `caption-zone.py --band 1060:1248` mean ≤ 0.25 and p95 ≤ 0.40 at pf 20, 96, 150 with glow, Grade and Grain; no glow inside y 1040–1270 | Full frames: pf 20 mean 0.084 / p95 0.123; pf 96 0.084 / 0.130; pf 110 0.086 / 0.133; pf 150 0.087 / 0.133 (`out/logs/zcp-b08-capzone.json`). Glow spot bottoms ≤ y 941 (max 940.8 at pf 203, scratch geometry; test asserts < 1040) | PASS |
| 8 | Glow ≤ `GLOW_PEAK` in code; bloom never on his silhouette edge | Test: max spot opacity ≤ 0.30 over pf 0–203; spot bottoms < 1040, the mass starts at 1344 | PASS |
| 9 | Determinism, `--gl=angle`: identical, or the RK-24 class (≤ 3 levels on ≤ 0.02 % of pixels) | Not byte-identical. Run 1 vs run 2 (same bundle): pf 20 full 132 px (max 3); pf 110 full 130 px (max 2); pf 110 bare 181 px (max 3). Run 1 vs run 3 (new bundle): pf 96 133 px (max 2). The spike's own bare probe differs from itself by 142–152 px (max 3). RK-24 class, ≤ 0.009 % | PASS (RK-24 class, recorded) |
| 10 | Cost: 60-frame render timed | `remotion render` frames 0–59, `--gl=angle`, bundle included: 28.57 s wall, 216 % CPU (spike reference 28.6 s). Output `out/painted/zcpaint/b08/B08-SH01_f0-59.mp4` | PASS (measured) |

- **Port fidelity:** the plate canvas against the spike's bare probe at pf 20 / 96 / 110 / 150: 141–172 px differ, max 3 levels, none above 3; the full plate at pf 20 against the spike key art: 111 px, max 3. Same class as the spike's own run-to-run noise, so the port reproduces the key art.
- **Seek parity:** `remotion render --sequence --frames=94-98` (`seq/element-94..98.png`) against single-frame stills: 134–154 px, max 3 levels (RK-24 class).
- **Production path:** `ZCPAINT-B08-TL-TH` f 81 and `-TL-EN` f 57 (chrome off) against plate pf 96: 158 and 131 px, max 2 levels. With the default chrome, `SceneRenderer` draws a progress line and the channel label over the painted scene (all differences above 3 levels in y 1800–1919) → `DF-20261030-scenerenderer-default-chrome` (Editor sets `chrome`).
- **Lead height:** N/A (silhouette exception in `PROJ-ZCP-R1`, `VD-ZC-08` R2.4).
- **Not verified:** Studio (`npm run start`) was not run (no browser here): cold load, backward scrub and unordered seeks in Studio are unverified (`DF-20261026-studio-emfile` still open). The CLI stills, the image sequence and the TL compositions cover seek parity only. Neighbours B07-SH02 and B09-SH01 are not rendered in a sequence (the cuts are Editor's).

- **Deviations from the brief (for Film and Mark to revalidate)**
  - D-B08-1 Far pair hidden (item 2): as in the approved key art; Q1.
  - D-B08-2 Literal flatness boxes (item 5): the windows and the smoke pall sit inside them; the wash-only boxes pass; Q2.
  - D-B08-3 The warm rim reaches y 1338.1 at pf 127, 1.9 px above the 1340 line. The rim is light, not the dark mass, which stays at 1344.3.
  - D-B08-4 Horizon (item 1): no visible edge to measure; the VP is at 880 and the far-floor fill starts at 910.
  - D-B08-5 Paper `#21272a` → `#0c1014`: the sky covers the frame, so no visible change.

- **Questions for the user (proposed `Q-ZCP-10` / `Q-ZCP-11`; to go through the coordinator's structured question tool, not asked here)**
  - Q1 (`Q-ZCP-10`, Film + user): the far pair never shows, because the near towers hide it (also in the approved key art). A. keep the approved frame with two visible fires (main, second) and Film restates item 2. B. move the far pair to an open part of the skyline (a new look, user review). Boss recommends A: the frame was approved as shown.
  - Q2 (`Q-ZCP-11`, Film): item 5 cannot hold for a 200 × 200 box that contains the designed windows or the smoke pall. Proposed: wash-only boxes (sky 200 × 60 at x 0–200, y 0–60; tower strip 200 × 16 at x 920–1120, y 434–450).

- **Proposed document changes (not applied; for user review, TL/DP)**
  1. Brief `VD-ZC-08` item 2: "two fires visible at pf 110 (main, second); the far pair sits behind the near towers (L3)", unless Q1 B is chosen.
  2. Brief item 5: wash-only boxes, or the windows and the pall excluded from the box.
  3. Brief item 1: the dark mass is the test; the warm rim may reach y 1338 at pf 127; the horizon is the VP at y 880, or drop the horizon clause.
  4. Brief Editor handoff (`VD-ZC-08` plate clock; sheet `sc01-b06-b08.md` B08-SH01): one shared plate; TH `fromSec` 0.5, EN `fromSec` 1.3; the composition sets `chrome` off (ZC record).
  5. `scripts/README.md`: rows for `zombie-condo-paint/rgb-diff.py` (decoded-RGB compare: identical or differs, with count and max level) and `zombie-condo-paint/b08-measure.py` (B08 flame, fire, silhouette and rim measures from one bare frame).
  6. Editor checklist (`docs/editor-workflow.md`, on its next revision): the shared `SceneRenderer` default chrome draws over painted scenes; set `chrome` off for ZCPAINT.
  7. `src/painted/spike/PlatePreview.tsx` hard-codes the deliverable `WFOG-EP01-SHORT` in its burned-in label, so ZCPAINT previews with `label` on name the wrong deliverable. Fix proposed; the spike file is not changed here.

- **Editor handoff mapping (shared interfaces)**
  - Plate `ZCP-B08-SH01`, `serves` `['B08-SH01']`, paper `#0c1014`, camera STILL, hard cut, no label, no `dissolveSec`.
  - Cue in the TH scene (150 f): `{shot: 'ZCP-B08-SH01', atSec: 0, fromSec: 0.5}`. In the EN scene (135 f): `fromSec: 1.3`. Visible plate spans TH pf 15–164, EN pf 39–173 (inside the plate's 204 frames).
  - Scene `bg: 'none'`. Not the last scene of a composition (`B_loop` holds the last 3 s). Composition chrome off.
  - Sound: none in the plate. The wind and the crackle swell (pf 84–110) are Editor's cues (`sc01-b06-b08.md`). Captions: none in the plate; `ZC-CAPSHADE` none (the band measured with glow, Grade and Grain).

- **Images for the coordinator (`out/painted/zcpaint/b08/`)**
  - `B08-SH01_sheet_c20-96-110-150.png`: the required four-frame sheet (270 px, viewed).
  - `crop-smoke-c20-c60.png` (full-resolution crop, pf 20 | pf 60), `crop-far-and-rim-c110.png` (far windows and rim, pf 110), `sheet-tl-vs-plate.png` (TL frames with default chrome against the plate; viewed).
  - Stills: `B08-SH01_full_c{20,94,96,98,110,150}.png`, `B08-SH01_bare_c{20,60,96,110,150}.png`, `B08-TL-TH_f81.png`, `B08-TL-EN_f57.png`, `seq/element-94..98.png`, `B08-SH01_f0-59.mp4`. Spike baselines: `spike/key_F*.png`, `spike/bare_F*.png`.
- **Logs:** `out/logs/zcp-b08-*` (bundle, still, prodpath, run2, restill, measure-v2.jsonl, capzone.json, tsc-final, eslint-final, npmtest, test-zcpaint).
- **Tools:** `scripts/zombie-condo-paint/rgb-diff.py`, `scripts/zombie-condo-paint/b08-measure.py` (new, uncommitted; the scratch geometry script that gave the silhouette numbers stays outside the repo).

## 2026-10-30 — Coordinator: token-use findings and proposed workflow changes

Measured with a transcript breakdown of coordinator session `019d0f22` (cost weights: cache read 0.1×, cache write 2×, output 5×). Total was about 40M weighted tokens. Role agents took about 87% of it: Boss about 18.3M over 3 runs, Film 11.6M over 2, Mark 4.9M over 2. The coordinator took about 5M.

| Run | Turns | Peak context | Images viewed |
| --- | --- | --- | --- |
| Boss passes 1–2 | 171 | 519k | 37 |
| Boss pass 5 | 161 | 580k | 18 |
| Film brief R2.x and key art | 151 | 496k | 29 |
| Mark SS-R1 | 67 | 412k | 0 |

Finding: images are not the cost. Run length is. Each turn re-reads the whole accumulated context, so cost grows about with turns × context. Mark reached 412k with no images, from long Bash output and whole-file reads.

### Proposed document changes (not applied; for user review, TL/DP)

1. **`docs/delivery-workflow.md` AI01: split runtime-heavy stages by shot group.** Keep "one invocation per stage" for writing stages (Preaw, Boat, Mark, Film written brief). For Boss, Editor and Film spikes that paint or render, send one invocation per shot group of 3–5 shots (or one asset family). The record carries the remaining groups. Expected saving: 40–60% on Boss and Film.
2. **New AI08 — context checkpoint.** When a role agent passes about 80 turns or about 250k context, it stops at the next clean point, records progress and open items in the episode's `build-notes.md` and returns. The coordinator then starts a fresh invocation for the rest (AI04 continuation does not apply past the cap).
3. **`AGENTS.md` CB02: hard limits for Bash output.** Every Bash command a role agent runs either prints under about 40 lines or pipes through `head`, `tail` or `grep -m`. Test suites, renders and `tsc` always write to `out/logs/` first. Mark and Film read sheets by section only (CB01). This is already a Default, but the measured runs did not follow it.
4. **`docs/film-visual-brief-workflow.md`: no painted key art by default in the brief stage.** Film cites existing reference frames (for example WORLD FOG plates) and writes the spec. It paints key art only when the user asks, or when the brief changes the medium, light or projection and a picture is the only way to decide.
5. **`docs/editor-workflow.md` / `docs/mark-storyboard-workflow.md`: sketch before paint.** A shot gets user look approval on a cheap schematic (an SVG in the storyboard artifact, or an unpainted blockout) before Boss paints it. This cuts paint-and-fix rounds.
6. **Coordinator practice (Reference, no rule change):** collect the user's look notes for 3–5 shots and send them to the owner as one revision (already AI01's second sentence).

Measure before and after with `python3 -I scripts/usage-report.py --since 2026-10-30` (CB05).

Status: proposals 1–6 approved by the user on 30 Oct 2026 ("Apply all 6") and applied in [PR #119](https://github.com/GuyMangkorn/reels-studio/pull/119). Proposal 2 landed as AI09, because main already had an AI08. Proposal 6 needed no rule change.

## 2026-10-30 — Film brief `VB-ZCPAINT-SHORT-R2.5` and spike `SPK-ZCP-05`

- **Trigger:** the user rejected the Boss pass 5 look check and answered the coordinator's follow-ups. Both are recorded in [delivery.md](delivery.md): “Boss pass 5 look check”, “B02 POV captions”, “B09-SH02B”, “Pass 5 follow-up”.
- **Brief changes:** see the brief's change log. New decisions:
  - `VD-ZCP-LIGHT` (cel in two tones + cast shadows; key per set and shot).
  - `VD-ZCP-ROOM` (room dressing).
  - `BODY-ZCP-6H` (6-head ZC body, WORLD FOG untouched).
  - `VD-ZCP-HANDS`.
  - R2.5 POV staging for B02-SH01, B02-SH02 and B09-SH02B.
  - B08 acceptance items 1, 2 and 5 restated: two visible fires, wash-only flatness boxes, and the dark mass as the composition test.
  - The R2.4.1/R2.4 change-log entries moved to `visual-brief-history.md`.
- **Spike:** `src/painted/spike/ZcSpk05.tsx` + `src/painted/spike/zcpaint-spk05-index.ts` (own entry). No shared or Boss module edited; no production plate touched.
  - Viewed sheets: `out/painted/zcpaint/spk05/sheets/spk05-{1-section-before-after,2-bodies-4h-vs-6h,3-b02-sh02-pov,4-b09-sh02b-pov}.png`.
  - Determinism: B02-SH02 pf 20 and B09-SH02B f 0 identical; B04 f 10 differs by 7–8 px, ≤ 3 levels (`RK-24` class). Log: `out/logs/spk05-det-diff.txt`.
  - Captions:
    - B04 with the band shade: 0.225 / 0.34, pass.
    - B02-SH02 under the text, bare: 0.388 / 0.465 and 0.389 / 0.57; passes the POV limit with no shade.
- **What the rounds taught:**
  - Flat-ended limb quads read as a wooden mannequin; capsules fix the joints.
  - Textured figure fills blotch at section size (the pass 5 tee too); washes are clean.
  - A cel lens on the decal cheek reads as dirt, so faces stay unshaded.
  - A cel shift along a limb's axis shades only its end. The figure light is flattened toward horizontal so the cel tone reads as a side band.
  - A POV "looking down at the knees" reads as blobs; feet alone read at once.
  - Shadows cast on the thin section floor read only when they are long and fall across a mat or tile lines. Props standing off the back wall give the most legible shadows.
- **Tool:** `scripts/zombie-condo-paint/capzone-undertext.sh` (new). It measures the brief's under-text caption region (x 150–930, y 1140–1248, POV limits); I ran this procedure twice by hand, then scripted it.

### Proposed document changes (not applied; for user review per TL/DP)

1. `.claude/skills/painted-2d/SKILL.md`:
   - *Art direction defaults:* "one cel shade" → "two-tone cel (lit + one multiply tone) painted as the part in cel, then the part clipped by itself shifted toward the light in the lit tone; decal faces unshaded; cast shadows from one key per shot".
   - *Gotchas:*
     - "flat-ended limb quads read as a mannequin: use capsules";
     - "textured fills blotch on small figure parts: washes are clean (determinism `RK-24` class)";
     - "a cel shift along a limb's axis shades only its end".
2. `scripts/README.md`: a row for `zombie-condo-paint/capzone-undertext.sh` (and the pass 6 rows `rgb-diff.py`, `b08-measure.py`, still pending).
3. `docs/dev-findings`: Boss may close `DF-20261030-b08-far-fires-occluded` as accepted by design (user `Q-ZCP-10` A; brief R2.5 item 2).
