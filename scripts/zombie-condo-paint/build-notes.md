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

## 2026-10-30 — Boss pass 7: S-P12 6-head model sheet

- Scope (coordinator, 30 Oct 2026): first step of the R2.5 rework. `S-P12` 6-head `zc-you` and `zc-infected` (`BODY-ZCP-6H`) for the user's look check. No production plate rebuilt, no Editor timeline, no brief or rule-document edit, WORLD FOG code untouched. Uncommitted (no commit, no push).
- Trigger reads: `docs/boss-asset-workflow.md` (production rules, QA), `docs/remotion-toolkit.md`, `painted-2d` skill, `character-proportion-principles` (CP-A, CP-L), `scale-and-perspective-principles` (sections 2 and 6), `asset-engineering-principles` (sections 6 and 7), dev-findings `DF-20261030-p5brush-large-fill-mottle` and `DF-20261030-zcpaint-pose-track-fields`.
- Built (ZCPAINT-only):
  - `src/painted/zcpaint/light.ts`: `KEY_SEC_DAY` (`KEY-SEC-DAY`, L = (-0.4, -0.65, +0.5)), `cel` (× `#bdb4c0`, `LT-02`), `castTone` (× `#9f99b1`, `LT-03`), `localTravel` (screen travel, flattened, mirrored by `dir`), `floorCast` (floor projection of a part: 0.615 h left, 0.769 h back, body depth ±0.12 m). Section receivers and per-shot keys remain S-P11.
  - `src/painted/zcpaint/body6.ts` (`BODY-ZCP-6H`): `H6` = 126.65 px per head at 447 px/m, `K6` = 55.79 decal unit. Views: `figFront` (standing, back, bucket lift, infected stoop, rage overlay), `figSide` (profile, walk, infected lean and lit overlay, day-3 overlay), `figSeatFloor` (B09, pitch), `figSeatSofa` (B07, bread in mitten hands), `handParts` (`mitten`, `fist`, `pinch`), `drawFig` (places, mirrors, paints the floor cast tone, silhouette), `castPolys`, `topPx` (artwork top incl. hair tufts), `skullTopPx`. Ported from the spike `front6`/`side6`/`seatHug6` (`SPK-ZCP-05`); WORLD FOG `figure.ts`, `CastSheet`, `SideSheet`, `FaceSheet`, `ProportionSheet`, `hands.ts` and `cast.ts` are unchanged (`hands.ts` is imported by WORLD FOG `WfogPhone.tsx`, so the hand code is in `body6.ts`).
  - `src/painted/spike/ZcS12Sheet.tsx` + `zcpaint-s-p12-index.ts`: pages `ZCPAINT-S-P12-A` (calibration, head ticks, WORLD FOG 4-head reference), `-B` (infected, hand kit), `-C` (seated B09 and B07 sofa with stand-in), measure compositions `-M1`…`-M9` (one bare figure each, no floor or shadow, for `bbox.py`). Spike entry only, not in `Root.tsx`.
  - `scripts/zombie-condo-paint/s-p12-sheet.sh`: bundle, pages A-C, review tiles (`qa-sheet.sh`), measure stills and `bbox.py` heights.
  - `tests/zcpaint-body6.test.ts` (9 tests): crown 6.0 heads; infected 6.0 heads at 0.95 (1.615 m) and the stoop −0.17 head; B09 lead ≥ 480 px at d 0.55 and pitch lowers it; sofa thigh < 10°, shin under the knee; pinch gap 0.05–0.12 head; cel and cast tones; key travel and mirror; cast shadow geometry; mitten thumb side.
  - `docs/dev-findings/DF-20261030-zcpaint-6head-seated-lead.md` (+ index row): seated lead and sofa numbers (open, Mark to revalidate).
- Pose coverage (sheet pages; shots named in each label):
  - standing front (hang, mitten hands; cel left, lit right) and bucket lift with mitten hands on the handle (B05-SH01, B05-SH02 hold);
  - back view (B01-SH01, B06-SH02, B10 before the turn);
  - profile facing right, and walk (B04-SH01);
  - infected front (rage decal, hair lock over one eye, blood on the mouth and collar, stoop 1), infected profile lit (blood, hair curtain), infected silhouette facing left (B01 K1, no cel, no ink);
  - B09 floor-seated, day 3, facing the door: pitch 20° (sheet row), pitch 12°, and SH03 head lifted 15° with the listening look;
  - B07 sofa-seated, bread in both mitten hands at the chest (sofa stand-in; thighs near-horizontal, `BODY-ZCP-6H`);
  - hand kit at 2.2 ×: mitten, mitten on the bar, pinch on the lid edge (B05-SH03, B07-SH01), closed fist (HD-04).
- Measured numbers (`out/painted/zcpaint/s-p12/measure/`, `bbox.py` full frame on bare figures; geometry from `topPx`/`skullTopPx`):

  | ID | Figure (scale, px per m) | Artwork height | Heads | Notes |
  | --- | --- | --- | --- | --- |
  | M1 | `zc-you` standing front (1, 447) | 768 px (1.72 m) | 6.06 (skull 6.00) | B1 passes (±0.1) |
  | M3 | `zc-you` walk, profile (1, 447) | 778 px | 6.14 | profile head hair (HEAD-SIDE-R2) rises 8 px above the front; outside ±0.1 for profile only |
  | M9 | infected upright front (0.95, 447) | 731 px (1.635 m) | 6.07 (skull 6.00, 1.615 m) | B1 passes |
  | M2 | infected stooped front (0.95, 447) | 711 px (1.59 m) | 5.91 (skull 5.83) | approved stoop costs 0.17 head |
  | M8 | `zc-you` standing at `SEC-2D` d 0.75 (0.756, 337.8 px/m) | 580 px | — | sheet nominal 574 px + hair; ≥ 480 |
  | M4 | B09 floor, pitch 20°, d 0.55 (1.158, 517.6 px/m) | 493 px | — | geometry 488 px; passes by 13 px (2.7 %) |
  | M5 | B09 floor, pitch 12°, d 0.55 | 501 px | — | geometry 498 px; skull only 479.5 px |
  | M6 | B09 SH03 lifted 15°, d 0.55 | 507 px | — | geometry 502 px |
  | M7 | B07 sofa, d 0.75 (0.955, 426.7 px/m) | 617 px (1.45 m) | — | sheet 594 px / head top 1.27 m not reproduced (crown 1.40 m skull, 1.44 m artwork) |

  Seated geometry: upright B09 skull 3.32 heads (3.34 in the sheet), artwork 505 px upright. Sofa thigh 8.5°, shin vertical, feet on the floor (x difference 0.00 px).
- Deviations (for Film and Mark to revalidate; record, not decided here):
  - D-P7-1 Seated knee and thigh: the brief's landmark thigh (1.25 heads vertical) cannot give the sheet's 0.5 m knee. Used the spike's thigh 1.42 and shin 1.48 heads (knee about 0.41 m) and the standing torso length 1.45 heads.
  - D-P7-2 Seated floor contact: the hip joint is 0.34 head up (was 0.2; the thigh radius 0.32 head sank 15 px into the floor).
  - D-P7-3 B09-SH01 head pitch: the sheet row is 20° down; it passes ≥ 480 px only because the hair tufts count (488 px geometry, 493 px bbox). 12° gives 498 / 501 px. Decision for the user (below).
  - D-P7-4 Sofa numbers: the sheet's head top 1.27 m and lead 594 px do not agree with each other; the figure gives 1.40 m skull / 1.44 m artwork and 617 px. Mark to revalidate.
  - D-P7-5 Infected height: the brief says 6 heads at 1.62 m with the approved stoop. The upright figure is 6.00 heads (1.615 m); the stoop lowers the crown 0.17 head (5.83 heads, artwork 5.91). Question for the user.
  - D-P7-6 Foot length: the spike's 0.59 head (heel to toe) is kept; the brief table says 0.48. Hands: mitten 0.41 × 0.26 head (brief 0.40 × 0.26).
  - D-P7-7 Shadows: the spike's skewed floor shadows (`paintBodies`) are replaced by the projection of the same parts from `KEY_SEC_DAY` (`floorCast`). The figures' cel uses the spike's flattened travel (0.45), which matches the key direction in screen terms.
  - D-P7-8 Rim light: the production rule "dark characters need rim/edge light" conflicts with `LT-02` "no rim light". The `zc-you` tee (`#2f5a5c`, luma ≈ 0.32) reads on the cream sheet; not tested on the dark B01 and B09 plates. Question for Film; no rim added.
  - D-P7-9 Canon: 6 heads is the CP-A03 child canon (8 years, 6.0 heads). It is recorded as the user's stylization (~6 heads), not as an age claim (CP-A08 note).
- Look-check items I could not settle from the sheet: sleeves read as puffs at the shoulder (tee sleeves 0.38 and 0.34 head diameter, kept from the spike); the shorts block is wide; the stubble is dense dots. Not changed in this pass.
- Fixed during pass 7: silhouette branch of `drawFig` now applies the head's lean or pitch (the infected silhouette head had detached from its neck); page layout (labels no longer collide with the second row; hand captions moved below the props).
- Checks:
  - `npx tsc --noEmit --typeRoots ./node_modules/@types`: exit 0 (`out/logs/zcp-s-p12-tsc-final.log`).
  - `npm test`: 107 / 107 (98 before + 9 new) (`out/logs/zcp-s-p12-npmtest-final.log`).
  - `npx eslint` on the five new files and the test: exit 0 (`out/logs/zcp-s-p12-eslint-final.log`).
  - Determinism: `ZCPAINT-S-P12-A` rendered twice, decoded RGB: 25 px differ, max level 2, no pixel over 3 levels (RK-24 class; `out/logs/zcp-s-p12-det.log`).
  - Renders: `out/logs/zcp-s-p12-run2.log` (pages A-C, M1-M9, `out/painted/zcpaint/s-p12/`).
  - WORLD FOG identity (21 frames, decoded RGB, HEAD baseline vs this tree): identical, 21 of 21 frames (also identical to the pass 5 `after7` baseline) (`out/qa/zcp-s01/pass7-before/md5.txt` vs `pass7-after/md5.txt`).
  - Frame checks viewed through `scripts/qa-sheet.sh`: `out/painted/zcpaint/s-p12/review-A.png`, `review-B.png`, `review-C.png` (540 px wide). Each review page names its shots in the labels; the measure compositions serve no shot.
- Not verified: no Studio session (stills only, no sequence or seek test: the sheet is static); no plate or timeline uses `body6.ts` yet, so no affected-consumer check; no dark-plate check of the cel and rim; no pinch on a real lid crop at full resolution (hand kit is at 2.2 ×).
- Questions for the user (return through the coordinator; the user answers, not Boss):
  - Q-P7-1 Is the look right for the next step (figure proportions, mitten hands, cel 2 tones, cast shadow)? Specific items: the tee sleeves, the shorts block, the stubble.
  - Q-P7-2 B09-SH01 head pitch: 20° down as the sheet row (488 px geometry, 493 px render, passes by 8–13 px), or 12° (498 / 501 px, more margin)?
  - Q-P7-3 Infected: is the stoop acceptable at 5.9 heads (1.59 m), or should the upright 6.0 heads (1.615 m) be kept with a lighter stoop?
  - Q-P7-4 Hands: the mitten size and the thumb lobe read as mittens on the kit; accept, or reshape?
  - Q-P7-5 Cast shadow: the long shadow to the left (`KEY-SEC-DAY`, ~1.0 × figure height) and its cool grey tone read as intended?
- Proposed document changes (not applied; for user review, TL/DP):
  1. Brief `VB-ZCPAINT-SHORT-R2.5` `BODY-ZCP-6H`: the seated thigh and knee values (D-P7-1) and the infected stoop height (D-P7-5).
  2. Sheets `sc01-b09-b10.md` and `sc01-b06-b08.md`: the B09 seated lead (state whether hair tufts count; pitch) and the B07 head top and lead (D-P7-3, D-P7-4); RK-28 status.
  3. `index.md` `S-P12` status: "model sheet built (pass 7, uncommitted), look check pending; `body6.ts` not yet in a timeline". Not applied here because `index.md` has uncommitted edits from Mark.
  4. `painted-2d` skill gotchas: "a silhouette or overlay branch must apply the same lean and pitch as the decal head" (pass 7) and "the seated buttock needs hip height above the thigh radius".
  5. `character-proportion-principles` CP-A: a note that 6-head stylization sits on the CP-A03 child canon and is recorded as stylization.

## 2026-10-30 — Boss pass 7b: S-P12 rework after the user's look check

- Trigger: coordinator relay of the user's look check of S-P12 (recorded at the top of `delivery.md`, 30 Oct 2026): (1) the 6-head proportions are right, but the body reads as a stiff jointed puppet: smooth tapered limbs with no visible segments or joint caps, shaped tee with natural sleeves (not puffs), shaped shorts (not a wide block); (2) the stubble reads as a black blob round the mouth: sparse fine dots on the jaw and upper lip (`หนวดเป็นจุดเล็กๆ`); (3) the cast shadows float away from the feet: each shadow must start at the contact; (4) the infected's white clothes read as a mannequin: dirty, muted clothes, and the posture left to gravity (slack hanging arms, drooping head and shoulders, weight sagging), not a fixed stoop angle; keep the rage face, blood and hair over one eye; (5) the hands kit is accepted as is; B09-SH01 head pitch 20° (sheet row).
- Scope unchanged from pass 7: look-check gate, no production plate rebuilt, WORLD FOG code unchanged, no commit.
- Changes (`src/painted/zcpaint/body6.ts`, `src/painted/spike/ZcS12Sheet.tsx`, `tests/zcpaint-body6.test.ts`):
  - Limbs, sleeves, neck and trouser legs: `tub()` builds one closed outline per part from a Catmull-Rom centreline with a radius per control point. No joint caps, no ring outlines at the elbow, knee or wrist. The cel band on a tube is its centreline moved toward the key by half the band and its radius reduced by the same amount (`paintPart`), so the lit tube stays inside its outline; non-convex shapes are not clipped.
  - Tee, torso, shorts waist and the infected shirt: `convexOf()` (closed spline, then convex hull), so the silhouettes are smooth. Shorts are a convex waist block and two trouser tubes, not a block.
  - Sleeves: tapered tubes that start inside the tee's shoulder corner (radius 0.15 head at the top) and follow the upper arm. The pass 7 version bulged as shoulder pads; the pass 7b first try still did, so the start point moved inside the shoulder.
  - Contact and shadows: a flat contact patch (cast tone) under each foot, under the B09 seat and on the sofa seat top (sheet stand-in). The cast projection is unchanged (`KEY-SEC-DAY`, `floorCast`), so each shadow starts at a contact patch.
  - Stubble: `stubble()` draws about 40 fine dots of 1.7–2.3 px on the jaw and upper-lip polygon, mixed 50 % toward the skin tone (low contrast). Pass 7 drew about 150 dark dots over the whole jaw (the blob).
  - Infected: `figSlack(c, {view, slump})`, where slump 0 is the upright 6.0-head figure (B1) and 1 is fully slack. Shoulders drop 0.22 head and come forward; the side head pitches forward 0.4 rad about the neck pivot (the chin toward the chest); arms hang straight with the elbows barely bent; the hips sit 0.08 head lower and the knees move forward 0.10 head; the neck is thicker. Every joint interpolates between the two postures, so there is no fixed stoop angle.
  - Infected clothes: `INFECTED_LOOK` in the sheet (shirt `#7a7460` dirty khaki with three cel smudges, trousers `#4f514b` to the ankle, bare feet). This is a look candidate; it is not yet in `cast.ts`, which production does not read.
  - Page B: infected front (rage decal, hair lock, blood, slack), profile lit, silhouette (B01 K1). Page C: B09-SH01 at 20° (sheet row), B09-SH03 lifted 15°, B07 sofa stand-in. The 12° figure left the page; `ZcS12M5` stays as a measure only.
- Measured numbers (`out/painted/zcpaint/s-p12/measure/`, run 5 `out/logs/zcp-s-p12-run5.log`; `bbox.py` on bare figures; geometry from `topPx` / `skullTopPx`; 1 head = 126.65 px at 447 px/m):

  | ID | Figure (scale, px per m) | Artwork height | Heads | Notes |
  | --- | --- | --- | --- | --- |
  | M1 | `zc-you` standing front (1, 447) | 767 px (1.72 m) | 6.06 (skull 6.00) | B1 passes (±0.1) |
  | M3 | `zc-you` walk, profile (1, 447) | 779 px | 6.15 | profile hair (HEAD-SIDE-R2) rises above the front; outside ±0.1 for profile only |
  | M9 | infected upright front, slump 0 (0.95, 447) | 730 px (1.63 m) | 6.07 (skull 6.00 = 1.615 m) | B1 passes |
  | M2 | infected slack front, slump 1 (0.95, 447) | 704 px | 5.85 (skull 5.78) | the slump costs 0.22 head |
  | M8 | `zc-you` standing at `SEC-2D` d 0.75 (0.756; 337.8 px/m) | 579 px | — | ≥ 480 |
  | M4 | B09-SH01 floor, day 3, head pitched down 20°, d 0.55 (1.158; 517.6 px/m) | 497 px (bbox) | — | geometry 488 px (artwork top with hair tufts); skull only 470.5 px |
  | M5 | B09 head pitched down 12° (measure only) | 505 px | — | geometry 498 px; skull only 479.5 px |
  | M6 | B09-SH03 head lifted 15°, d 0.55 | 511 px | — | geometry 502 px |
  | M7 | B07 sofa stand-in, d 0.75 (0.955; 426.7 px/m) | 618 px | — | skull crown 1.404 m, artwork 1.44 m |

  The seated upright crown is 3.32 heads (3.34 in the sheet). At 20° the rule holds only with the hair tufts counted: 488 px artwork, 470.5 px skull only. The lowest artwork pixel of the seated figures is 6 px below the nominal floor line (the ink of the foot and seat outlines).
- Checks:
  - `npx tsc --noEmit --typeRoots ./node_modules/@types`: exit 0, 0 errors (`out/logs/zcp-s-p12-7b-tsc-3.log`).
  - Body tests `tests/zcpaint-body6.test.ts`: 10 / 10 (`out/logs/zcp-s-p12-7b-body6-test-2.log`; the test file now also checks that every figure's contact straddles the floor line, and the infected height and slump).
  - `npx eslint` on the five new files and the test: 0 messages (`out/logs/zcp-s-p12-7b-eslint-final.log`).
  - `npm test`: 108 / 108 (`out/logs/zcp-s-p12-7b-npmtest-final.log`).
  - WORLD FOG identity, 21 frames decoded RGB: identical to the HEAD baseline (`out/qa/zcp-s01/pass7-before/md5.txt` vs `out/qa/zcp-s01/pass7b-after/md5.txt`, 21 of 21).
  - Frame checks: `review-A.png`, `review-B.png`, `review-C.png` under `out/painted/zcpaint/s-p12/` (540 px wide, viewed after the final render, run 5). Full-resolution pages `S-P12-A.png`, `S-P12-B.png`, `S-P12-C.png` beside them.
- Open after 7b (visible in the review tiles; not resolved):
  - The front shoulder still shows the sleeve top as a corner, less pad-like than in pass 7 but not clean.
  - The infected silhouette head is a bald egg; with the drooped pitch it reads as a ball at the end of the neck. Silhouette hair shape not drawn.
  - Stubble density and the shoe and foot shapes are judged on the 540 px tiles only; no full-resolution crop was taken in 7b.
- Questions for the user (the coordinator relays them): Q-P7b-1 is the body now a finished figure (limbs, tee, sleeves, shorts), or which part is still wrong? Q-P7b-2 are the dirty khaki shirt and grey-green trousers the right muted tones for the infected? Q-P7b-3 is the stubble density (about 40 sparse dots) right? Q-P7b-4 does the slack posture (head to the chest, arms hanging, sagging weight) read as intended, or should the head sit higher? Q-P7b-5 for the B01 K1 silhouette: keep the bald head, or add the hair shape?
- Not verified: no Studio, seek or sequence check (static spike stills); no production plate or Editor timeline uses `body6.ts` (no affected-consumer check); no dark-plate light check; no full-resolution crops of faces, hands or stubble in 7b.

## 2026-10-30 — Boss pass 8: S-P12 7b fixes, S-P11 light kit, S-P13 section and interior plates, R2.5 POV staging, B08 re-check

- Brief `VB-ZCPAINT-SHORT-R2.5`, sheets `ZCPAINT-SHORT-SS-R1.3`, delivery record decisions from "Boss pass 5 look check" on. Uncommitted, not pushed (the coordinator's instruction). Worktree `claude/zcondo-paint-tsx-remotion-bdb058`; no `node_modules` changes.
- Start state checked: `body6.ts` and `light.ts` compiled (tsc exit 0, `out/logs/zcp-p8-tsc-start.log`; the 7b stack was consistent). Pass 7b's `s-p12-sheet.sh` reproduced M1-M9 exactly before any change (`out/logs/zcp-p8-s-p12-baseline.log`).
- Pages before pass 8 are copied to `out/painted/zcpaint/p8/before-7b/`.

### Status by item (Mark's order)

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| 1 | S-P12 7b look-check fixes in `body6.ts` | done (look check pending) | `out/painted/zcpaint/s-p12/review-A/B/C.png`; measures below |
| 2 | S-P11 light kit (cel 2 tones, cast shadows per key, RK-26) | done for the section and B10 plates; L3 open for one cast (B06) | `zcpaint/light.ts`, `sets.ts` `castFloor`, `rooms.ts` casters; flatness table below |
| 3 | S-P13 room dressing and relight, 6-head figures | done for B04, B06, B07, B09-SH01/SH03, B10-SH01; not done for B03 View B, POV backdrops, RM-06 colours | `zcpaint/accents.ts`; `out/painted/zcpaint/p8/qa/beat-b04-b07-truck.png`, `beat-b09.png`, `beat-b10.png` |
| 4 | POV plates per R2.5 (B02-SH01, B02-SH02, B03 View A, B09-SH02B) | done (staging); acceptance P1-P7 per item below | `out/painted/zcpaint/p8/qa/beat-b02-b03-pov.png`; `out/painted/zcpaint/p8/crop-bolt-TH-F7.png` |
| 5 | S-P07 bolt hand (R2.5) | done for hand use; contact approximate | crop above; `body6.ts` `handParts` fist; `pov.ts` `pinchHand` |
| 6 | B08 re-confirm items 1, 2, 5 (no rebuild) | re-confirmed, pass | measures below; `out/painted/zcpaint/p8/qa/` `sheet-b08-pf.png` |

Every rebuilt plate has the same shared paint for TH and EN (`-TH` / `-EN` IDs), so the EN frames are the same plates with the EN caption windows.

### 1. S-P12 (7b look-check fixes, `body6.ts`)
- Neck: drawn before the tee so the collar hides its foot; thicker (front r 0.18 head, profile r 0.18/0.17, infected r 0.19-0.20). Front and profile read shorter and thicker on the sheet.
- Shoulder: the tee outline rounds into the sleeve (`[0.46, 4.79] → [0.6, 4.7] → [0.68, 4.5]`). Shoulder domes (`convexOf` ellipses under the sleeve) were built first and removed: they read as puffy pads, the pass 7 defect.
- Infected profile hair: `BOB_SIDE` (cast.ts) is a shaped bob mass with a fringe and ragged nape and jaw ends, with a sheen stroke; the same outline is the B01 silhouette's hair (`HeadMark.silHair`, drawn in the silhouette colour with the pitch). The old 9-corner black box is removed.
- Infected posture: the front head drops 0.12 head instead of 0.22 (shoulders and arms unchanged); the profile head pitches 0.25 rad instead of 0.4. Measure: slack front 716 px (was 704).
- Infected clothes: `INFECTED` in `cast.ts` now has the dirty khaki `#7a7460` shirt and grey-green `#4f514b` trousers. `INFECTED_LOOK` (spike-only copy) removed from `ZcS12Sheet.tsx`. `ZcModelSheet.tsx` (spike, not production) also reads `INFECTED` and changes colour; no production plate reads it.
- Test change (deliberate): `tests/zcpaint-body6.test.ts` asserted the infected head drops more than 0.15 head. Pass 8 asserts 0.10-0.15 head (the user asked for a higher head).
- Measures (`bbox.py`, `out/painted/zcpaint/s-p12/measure/`): M1 767 px (6.06 heads), M2 716 px (slack), M3 779 px (profile), M4 497 px (B09 20° at d 0.55, bbox; geometry 488), M5 505, M6 511, M7 618, M8 579, M9 730. The 6-head standing figure is unchanged (M1, M9).
- Open: the front shoulder still reads as a tee corner; the user's judgement. Q-P7b-1..5 stay with the user.

### 2. S-P11 light kit
- Key data (`light.ts`): `KEY_SEC_DAY` (-0.4, -0.65, 0.5), `KEY_SEC_D3` (same direction, day-three cel step 0.5), `KEY_B10` (-0.5, -0.6, 0.3). `cel(col, step)`: a half step is the lit tone mixed 0.5 toward the plum cel (`LT-02`).
- Cast shadows (`LT-03`): `castBy(proj, pts, at, key)` lifts each local point to 3D (447 px/m, body depth 0.24 m: `d ± 0.12`, or `Y ± 0.12` for a front or back view), projects along the key to z = 0 and through the section or perspective projection, returns the hull. `figCast` and `sectionCast` apply it to every part and the head and clip to the room's floor quad. `boxFloorCast` does the same for the eight corners of a box. `castFloor` (sets.ts) paints the room's box shadows before its boxes.
- Faces (`keyFaces`): the top and the +Y side take the lit tone, the camera-facing front the cel tone. The room multipliers (`LT-06`) are `UNIT_LIGHT` = entry 0.75, bath 0.9, kitchen 1.0, living 1.0.
- RK-26 decision: floor-only fallback. Receivers are the room floor only; partitions (Y 1.5, 3.3) and the back wall are not receivers, and a cast is clipped to the figure's room. Wall-hung items (mirror cabinet, towel, shoe shelf, jacket, switch) cast no shadow. Recorded in `docs/dev-findings/DF-20261030-zcpaint-section-floor-cast.md`.
- Clip rule found in this pass: the B10 floor quad at Y 3.3 is behind the camera (Y 3.25) and projects to negative depth (measured: quad corners at about (-98298, -57745)). The clip uses Y 0.18-1.5. Recorded in `DF-20261030-zcpaint-persp-floor-clip-behind-camera.md`.

### 3. S-P13 section and interior plates
- Figures (6-head, `BODY-ZCP-6H`; no plate calls the 4-head body functions `paintBodySide`, `paintBodyBack`, `paintBodyFront`, `paintSeatedFloor`, `paintSeatedSofa`; the decal heads `paintHead` and `paintHeadSide` stay in use, as the brief requires): B04-SH01 walk (`figSide` stride 1); B06-SH01 walk to the fridge then stand (stride 1 then 0, turns to dir -1); B07-SH02 `figSeatSofa` at Y 7.65; B09-SH01/SH03 `figSeatFloor` with its props' casts (see deviation D-P8-1); B10-SH01 `figFront` back, `figSide` profile and `figFront` front, day-3 overlay, with the KEY-B10 cast projected by `B10_PERSP`.
- Accents (`accents.ts`, RM-02/RM-04, one colour per room, 3+ readable props): entry navy jacket on a hook (plus the existing shoe shelf and pairs, switch); bathroom pale aqua wainscot to 1.2 m with grout lines (RM-05), wood mirror cabinet, mustard towel, terracotta floor mat, a plant on the vanity; kitchen terracotta herb pot and a red-capped bottle on the counter (plus the existing jar shelf, kettle, dish rack); living room mustard cushion against the sofa back, a potted plant by the glazing (floor cast) and the existing rug, picture and cream curtains.
- Not done this pass: B03 View B relight (`KEY-B03-B`, lamps die, far-window furniture shadows); POV backdrops (flat and clean; no key applied); RM-06 caps and neighbour bands (cap `#22201f`, neighbours `#2b2724`, edge `#4a433b`; the caps stay `#1c1f24`).

### 4. POV plates (R2.5)
- B02-SH01: no left palm, no bag (the bag is sound only), one right hand. It enters from the right frame edge: off-edge at f 0 (wrist x 1460), on the turn at `rise` (wrist 1040, y 840, sleeve from x 1420, never below y 900). After the bolt it holds as a loose fist. The ≈1° picture tilt is not painted (dropped, D-P8-2).
- B02-SH02: no hands at any frame. Cabinet `paintCabinetR25` (top from far y 830 to near y 1000, lip 1000-1022, front from 1022 to the frame bottom, doors split at x 540, knobs (506, 1150) and (574, 1150) with small shadows, grain). The last 24 px of the shove over pf 0-6 (`sh02Slide`), flush at pf 6, wobble ±3 px decaying by pf 20 (`sh02Bob`), cabinet jolt 0.25 × the door's kick. Camera lurch 1.5 % about (540, 760), pf 0-6, easing back by pf 20 (`CAM_B02_SH02`). Door panel `[230, 150, 860, 560]`.
- B03-SH01 View A: no hand (the `hookHand` line is removed); the barricade cabinet is the R2.5 cabinet.
- B09-SH02B: no body part (no knee, hand or foot). Door panel `[230, 150, 860, 560]`, latch line black, cabinet with the lit lip at y 900-922, then the floor props: phone face-up and four pull-tab cans (sheet: "four cans, two stacks of two"; the brief text says three, D-P8-7).
- Acceptance per item:
  - P1 (viewed sheets): SH01 f 0/2/5/7/30 and SH02 pf 0/3/6/12/20/60 in `beat-b02-b03-pov.png`; SH02B f 0/9/18/30 in `beat-b09.png`.
  - P2 (no hand where forbidden): verified on the sheets. SH01 shows one hand, at y ≈ 560-920; SH02 and SH02B show none.
  - P3 (cabinet reads on 270 px): lip, two doors, knobs and grain visible in `beat-b02-b03-pov.png` and `beat-b09.png`.
  - P4 (flush at pf 6, no gap, cabinet on the floor line): checked on the sheet frames 3/6/12 at 216 px; no full-resolution crop.
  - P5 (door pixel-stable on knocks): the door has no jolt input in SH02B (by construction); not measured by pixels.
  - P6 (caption under-text, `capzone-undertext.sh`, x 150-930, y 1140-1248, limits 0.45 / 0.60): B02-SH01 TH f7 and f30 0.402 / 0.467; EN f21 0.402 / 0.467; B02-SH02 f6, f20, f60 0.323-0.324 / 0.372-0.376; B03 View A f0 0.324 / 0.376 (all pass, soft shade on, cue-gated). B09-SH02B has no captions (sheet: "Captions: none active (no VO)"): N/A. Values with no shade f0 0.804 / 0.810, f9 0.474 / 0.483, recorded only.
  - P7 (determinism): `ZCPAINT-P8-B02-SH02-TH` f20 identical across two renders; see the determinism table.
- Defect not built: the sheet's "defocus veil" on the B09-SH02B door (depth line) is not in the plate. Open (Film or Mark to say whether it is wanted).

### 5. S-P07 bolt hand
- Third person: the closed fist (`HD-04`) is `handParts` kind `fist` in `body6.ts` and is used for the B09 seated hands; the mitten and the bar grip are the accepted kit (`S-P12` B page).
- POV: the bolt pinch is `pinchHand` (`pov.ts`, the shared POV hand used by WORLD FOG), with wrist (1040, 840). Full-resolution crop `out/painted/zcpaint/p8/crop-bolt-TH-F7.png` (460 × 380 at 620, 540): the hand enters from the right edge, the forearm is horizontal near y 840, the index tip meets the left end of the thumb-turn bar, and the thumb sits under the bar. The contact is approximate; no pixel test. Q-P8-4 asks the user to judge it.

### 6. B08 re-confirm (items 1, 2, 5; no rebuild)
- Bare frames `out/painted/zcpaint/p8/b08/ZCPAINT-B08-SH01-BARE_F{20,96,110,150}.png`, `b08-measure.py`:
  - Item 1: silhouette (#06080a) coverage 8.5 % (≤ 14 %); exact-colour pixels outside x ≥ 480, y ≥ 1340: 0 at pf 20, 110, 150; 2 at pf 96, at (409, 1584) and (427, 1584), which are about 280 px left of the head's nearest edge at that height (not the mass).
  - Item 2 (viewed sheet `sheet-b08-pf.png`): main blaze and second blaze visible at pf 110; far pair behind the near towers (as approved, D-B08-1); main flame tip y 279 at pf 110 (≤ 300); flame-core pixels (warm, luma > 0.5) at y ≥ 860: 0, the same as pass 6. The fires are not brighter than luma 0.5 anywhere in the bare frame.
  - Item 5 (`flatness.py` on bare frames): sky (0,0)-(200,60) SD 0.0000 at pf 20, 96, 150; tower strip (920,434)-(1080,450) SD 0.0000 (the box runs past the 1080 px frame; clipped).
  - Item 7 (caption band 1060:1248, full frames with Grade and Grain): mean 0.084-0.087, p95 0.123-0.133 at pf 20, 96, 110, 150.

### Measurements

Determinism (`render-frames.sh`, decoded RGB, second render of the same bundle):
| Frame | Result |
| --- | --- |
| `ZCPAINT-P8-B02-SH02-TH` f20 | identical (md5) |
| `ZCPAINT-P8-B09-SH01-TH` f57 | 9 px differ, max 1 level (RK-24 class) |
| `ZCPAINT-P8-B04-SH01` f30 | 2 px differ, max 1 level (RK-24 class) |

Seek parity (Remotion `--sequence --frames=29-30` against single-frame stills): `ZCPAINT-P8-B04-SH01` element-30 against still f30 differs in 1 px by 1 level (RK-24 class). Frame 29 has no still to compare against. Studio (`npm run start`) was not run (no browser here; `DF-20261026-studio-emfile` still open). Studio cold load, backward scrub and unordered seeks are unverified.

Lead height (artwork incl. hair tufts = `topPx` × px per metre at the plate depth; geometry, not a plate bbox):
| Plate | Figure | px per m | Lead | Rule ≥ 480 |
| --- | --- | --- | --- | --- |
| B09-SH01 | seated, 20° pitch, d 0.60 | 513.6 | 484.4 px (skull only 466.9) | pass, 4.4 px margin |
| B09-SH01 (was d 0.75) | seated, 20° | 502.2 | 473.6 px | fail, moved (D-P8-1) |
| B09-SH03 | seated, 15° lift, d 0.60 | 513.6 | 498.5 px | pass |
| B04-SH01 | walk, d 0.75 | 337.8 | 586.4 px | pass |
| B06-SH01 | standing, d 0.75 | 337.8 | 586.4 px | pass |
| B07-SH02 | sofa, d 0.75 | 426.7 | 614.0 px | pass |
| B10-SH01 | back, side, front (2.33 m) | 791.4 | 1374.1 px | pass |
Cross-check: pass 7b's bbox at d 0.55 read 497 px against 488 px geometry (+9 px of ink and tufts). Expect the bbox at d 0.60 to read about 493 px; not measured on a plate.

Caption zone (`caption-zone.py --band 1060:1248`; default 0.25 / 0.40):
| Plate frame | Overlay | Mean / p95 | Result |
| --- | --- | --- | --- |
| B04-SH01 f30 | band, cue 0-57 f (pass 5) | 0.200 / 0.331 | pass |
| B06-SH01 f40 | none (first build) | 0.451 / 0.765 | fail |
| B06-SH01 f40 | band, cue 0-90 f (full clock) | 0.215 / 0.347 | pass |
| B07-SH02 f45 | none (first build) | 0.399 / 0.572 | fail |
| B07-SH02 f45 | band, cue 0-90 f (full clock) | 0.195 / 0.260 | pass |
| B09-SH01-TH f57 | `b09Sh01Overlay` | 0.115 / 0.124 | pass |
| B09-SH03 f40 | none | 0.116 / 0.124 | pass |
| B10-SH01 f112 | none (first build) | 0.551 / 0.626 | fail |
| B10-SH01 f112 | band, peak 0.62 | 0.253 / 0.313 | fail by 0.003 |
| B10-SH01 f112 | band, peak 0.66 (shipped) | 0.235 / 0.289 | pass |
| B10-SH01 f150 | band, peak 0.66 (shipped) | 0.221 / 0.289 | pass |
The band shade cue covers the whole plate clock for B06, B07 and B10 as a conservative placeholder; the Editor narrows it to the caption cues. B10's band peak is set to 0.66 in `zcpaint.tsx`; the default 0.62 misses by 0.003.

Flatness (`flatness.py`, SD limit 0.010, bare frames `out/painted/zcpaint/p8/bare/`):
| Plate frame | Box | Mean | SD | Result |
| --- | --- | --- | --- | --- |
| B04-SH01 f30, lit wall | (652,729)-(712,779) | 0.715 | 0.0000 | pass |
| B04-SH01 f30, cast | (273,1155)-(295,1167) | 0.215 | 0.0000 | pass |
| B06-SH01 f40, lit wall | (801,779)-(875,853) | 0.779 | 0.0000 | pass |
| B06-SH01 f40, cast | (519,1179)-(541,1191), 22×12 | 0.473 | 0.0969 | fail (edge inside) |
| B06-SH01 f40, cast | (549,1185)-(561,1191), 12×6 | 0.406 | 0.0975 | fail (edge inside) |
| B07-SH02 f45, lit wall | (284,647)-(378,773) | 0.806 | 0.0000 | pass |
| B07-SH02 f45, cast | (521,1142)-(543,1154) | 0.562 | 0.0000 | pass |
| B09-SH01-TH f57, lit wall | (416,61)-(527,208) | 0.539 | 0.0000 | pass |
| B09-SH01-TH f57, cast | (400,976)-(412,982), 12×6 | 0.385 | 0.0000 | pass |
| B09-SH01-TH f57, cast | (665,982)-(687,994), 22×12 | 0.294 | 0.0162 | fail (edge inside) |
| B10-SH01 f112 (profile), cast | (533,1546)-(555,1558) | 0.588 | 0.0000 | pass |
| B10-SH01 f150 (front), cast | (476,1537)-(498,1549) | 0.588 | 0.0000 | pass |
| B10-SH01, lit wall | none chosen | | | not measured |
The B06 cast fails at an edge inside the cast. Another cast polygon's edge crosses the figure's cast there (the figure's cast and the fridge's cast meet), and the wet fills feather at that edge (`.claude/skills/painted-2d/SKILL.md`, art direction: fills drawn in the same frame are wet). The 12×6 box at (549,1185) lies inside one polygon, and the other polygon's edge still crosses it. Open: union the casts of one room before the wash, or move the figure.

Figure file checks: a grep of `src/painted/zcpaint` and `src/painted/shots` shows no plate import of `figure.ts` or `figdetail.ts`; the remaining hits are comments and the old definitions.

Cost (L8): `npx remotion render <bundle> ZCPAINT-P8-B10-SH01 --frames=0-59 --gl=angle` with the bundle pre-built: 5.9 s wall (`out/logs/zcp-p8-cost-time.log`). Pass 6's B08 figure (28.6 s) included the bundle and is not comparable. Measure the heaviest section plate with a bundle when Editor integrates.

WORLD FOG identity (`out/qa/zcp-s01/pass7b-after/md5.txt` as the baseline, `render-frames.sh src/painted/spike/index.ts`): 21 of 21 frames identical, checked before and after the last edits (`out/logs/zcp-p8-wfog-final-diff.log`, empty).

Tests and checks (final): `npx tsc --noEmit` exit 0; `npm test` 108 / 108 (`out/logs/zcp-p8-npmtest-final.log`); `npx eslint` on all changed files exit 0.

### Deviations (for Film and Mark to revalidate)
- D-P8-1 B09 seated depth: d 0.75 → d 0.60 for SH01 and SH03 (Mark's own option, RK-28). SH01 lead 473.6 → 484.4 px. SH03 at 0.60 keeps the same size across the cut. Mark must update the sheet's staging line.
- D-P8-2 B02-SH01 ≈1° picture tilt: dropped, not painted.
- D-P8-3 B02-SH01 bolt contact is approximate (no pixel test). The pinch is the approved R2.5 A pose.
- D-P8-4 B02-SH02 and B09-SH02B: the flush thud (TH f 3 / EN f 6) is the sound cue, not a picture change; the picture flush is pf 6 for both languages.
- D-P8-5 Caption band shade over the full plate clock for B06 and B07 (cue 0-90 f), and for B10 at peak 0.66 (cue 0-186 f). The Editor sets the real cues.
- D-P8-6 RK-26 floor-only fallback: no partition or back-wall receivers; wall-hung items cast no shadow; figure casts stop at the room's partition (a walk across Y 1.5 is unverified on a crop).
- D-P8-7 Brief and sheet conflict on the B09-SH02B cans: the brief's `VD-ZCP-HANDS` text says three cans; the sheet says four (two stacks of two). Built four. Film to confirm.
- D-P8-8 Not done: B03 View B relight; POV backdrop key; RM-06 cap and neighbour colours; the B09-SH02B door defocus veil; the wall-hung shadows; the B10 lit-wall flatness box.
- D-P8-9 B10 back-view shadow: KEY-B10 comes from behind the camera, so the cast runs toward the door, behind his body. Only the strip right of the feet shows (the cabinet covers it). The contact patches and the cast polygons are measured (14 polygons inside the entry floor, bounds x 188-831, y 1474-1842).
- D-P8-10 B06 cast flatness open (see flatness table).
- D-P8-11 Stubble density (Q-P7b-3) unchanged; new finding `DF-20261030-zcpaint-day3-stubble-spots` (open).

### Scripting and tool lessons (this pass)
- A scripted edit that used `str.replace(old, new)` with an empty or unmatched `old` inserted the new block between every character and grew `body6.ts` to 50 MB. It was recovered by removing the exact inserted copies (verified: the recovered text starts with the original import and contains the drawing functions), then the edit was re-applied with asserted, non-empty matches. Rule for later passes: slice to a found index, assert `start < end` and `count == 1` before any replace, and read the output size.
- zsh does not split an unquoted variable into arguments. The render-frames, flatness and comparison lists were passed as one string (a bogus "SAME" determinism result was caught and redone). Use `${=var}` or `bash -c "..."`. macOS has no `timeout` command. A foreground `sleep` is blocked; use Monitor with an until-loop.
- Remotion composition IDs must exist in the entry being rendered; the WORLD FOG IDs live in `src/painted/spike/index.ts`.

### Proposed document changes (TL/DP; not applied)
1. `docs/boss-asset-workflow.md`, QA section: add the section-plate check: the floor cast is the 3D projection of the figure (lift, key, section), and flatness of a cast or wall box is measured on a bare canvas frame (`ZCPAINT-*-BARE`), not on a frame with Grain.
2. `.claude/skills/painted-2d/SKILL.md`, gotchas: (a) a sheet skew cast is wrong on a section plate; (b) a perspective floor quad with Y past the camera has negative depth; (c) wet adjacent fills feather where two shadows meet (the B06 defect); (d) `screenOnly` / `ScreenLayers` adds Grain: measure SD on bare frames.
3. `scripts/zombie-condo-paint/`: a script that derives the L3 measurement boxes from the section projection and the figure geometry (done ad hoc in pass 8 with tsx; repeated for each plate, so it should be scripted).
4. `storyboards/zombie-condo-paint/short/index.md` (Mark's uncommitted edits, not changed here): S-P11/S-P13 status rows; the B09-SH01/SH03 depth 0.60; the B02-SH01 tilt dropped; the B09-SH02B cans count; the RK-26 fallback; the caption shade cue windows for B06, B07, B10.
5. `docs/character-proportion-principles.md` CP-A (from pass 7): a note that the 6-head stylization sits on the CP-A03 canon and is recorded as stylization.

### Questions for the user (relay through the coordinator; not asked here)
- Q-P8-1 Look: does the tee shoulder (no pads) read as intended? Does the neck read as intended? Does the infected's bob hair (profile and B01 silhouette) read as hair? Is the head a little higher (0.12 head, not 0.22)?
- Q-P8-2 B09 seated figure is now at d 0.60 (larger, 484 px lead). Accept, or lift the head instead (then recheck)?
- Q-P8-3 Stubble density, Q-P7b-3 (still open).
- Q-P8-4 B02-SH01 bolt: the right hand from the right edge, index on the bar's left end. Accept?
- Q-P8-5 B02-SH01 picture tilt (≈1°) dropped. Accept?
- Q-P8-6 Caption band shade over the full clock for B06, B07 and B10 (the Editor narrows the cues). Accept?
- Q-P8-7 B09-SH02B cans: four (sheet) or three (brief text)?

### Files changed in pass 8 (uncommitted)
- `src/painted/zcpaint/`: `body6.ts`, `light.ts`, `cast.ts`, `sets.ts`, `rooms.ts`, `accents.ts` (new), `b09.ts`, `interior.ts`, `povshots.ts`, `pov.ts`, `overlays.tsx` (`screenOnly` strength argument).
- `src/painted/shots/zcpaint.tsx` (plate list: section figures, B02-SH02 camera, caption shade cues and B10 peak).
- `src/painted/spike/`: `ZcS12Sheet.tsx` (infected look from the production cast), `zcpaint-p8-index.ts` and `zcpaint-p8-bare-index.ts` (new review entries, not in `Root.tsx`).
- `tests/zcpaint-body6.test.ts` (head drop 0.10-0.15), `tests/zcpaint.test.ts` (R2.5 staging: no drag, no hooked palms).
- `docs/dev-findings.md` (3 new rows), `docs/dev-findings/` (3 new entries; `DF-20261030-zcpaint-6head-seated-lead.md` status line updated).
- `scripts/zombie-condo-paint/build-notes.md` (this section), `scripts/zombie-condo-paint/delivery.md` (TH and EN stage cells).
- Stills: `out/painted/zcpaint/p8/` (`final/`, `shade/`, `shade2/`, `shade3/`, `pov1/`, `bare/`, `b08/`, `seq/`, `det-b/`, `qa/`); S-P12 pages in `out/painted/zcpaint/s-p12/`; logs in `out/logs/zcp-p8-*`.

## 2026-10-30 — Boss pass 9: user fixes from the pass 8 look check, then the remaining shots

- Scope: user fixes A1-A3 and the shots of Part B (30 Oct 2026, via the coordinator). Brief `VB-ZCPAINT-SHORT-R2.5`, sheets `ZCPAINT-SHORT-SS-R1.3`, delivery decisions through "Boss pass 8 look check". Uncommitted, not pushed. Worktree `claude/zcondo-paint-tsx-remotion-bdb058`; `node_modules` untouched.
- Start state: `npx tsc --noEmit` exit 0 (`out/logs/zcp-p9-tsc-start.log`). Pass 8 files copied to `out/painted/zcpaint/p9-*.before*` before each edit.
- Stills: `out/painted/zcpaint/p9/` (`cap/`, `b01/`, `b02/`, `b03/`, `b09/`, `qa/`, `det/`, `overview/`); logs `out/logs/zcp-p9-*`.

### Status by item (stable IDs; look check pending for every item)

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| A1 | `ZC-CAPSHADE` removed from every ZC plate Overlay; Grade and Grain only | done | `overlays.tsx` (`ScreenLayers`, `screenOnly()` take no shade); `shots/zcpaint.tsx` cue constants removed; `screen.tsx` `CaptionShade`/`shadeGate` kept (shared, unused by ZC) |
| A1r | Caption readability with the repo outline caption, worst frames | read at full resolution; numbers recorded for information only | `out/painted/zcpaint/p9/cap/crops/stack-caption-TH-7.png`; table below |
| A2 | B02-SH01: no hand; camera pushes in on the thumb-turn; the bolt turns by itself on the per-language keys; body-slam kick kept | done | `povshots.ts` (`rightHandKeys`, `turnHand`, `offEdgeHand` removed; `B02_SH01_KEYS` bolt only); `out/painted/zcpaint/p9/qa/beat-b02-sh01-check.png`, `bolt-f0-f7.png` |
| A3 | Seated neck (`body6.ts` `figSeatFloor`, `figSeatSofa`) | done | torso 1.8 heads (was 1.45 / 1.6), head centre 0.73 head above the shoulder line (was 1.09), chin 0.27 head above it (was 0.55); the standing neck is 0.27 by the same measure |
| B01-SH01 | OTS corridor, new plate `ZCP-B01-SH01` (TH and EN share one plate) | built | `corridor.ts` `paintB01Sh01`; `out/painted/zcpaint/p9/b01/beat-b01-sheet-r2.png` |
| B01-SH02 | Infected turn and charge, new plate `ZCP-B01-SH02` | built; settle tilt and eye-shine not painted (D-P9-2) | `corridor.ts` `paintB01Sh02`; `out/painted/zcpaint/p9/b01/beat-b01-sheet.png` (charge row) |
| B02-SH03 | Freeze face close, new plate `ZCP-B02-SH03` (plate clock 0-83, freeze pf 39) | built | `closeups.ts` `paintB02Sh03`; `out/painted/zcpaint/p9/b02/beat-b02-sh03-sheet-r2.png` |
| B03-SH01 | View B relight (`KEY-B03-B`): per-wall lamp tones, dressing (MK-ZC-ST-12), floor shadows from the far window; View A blackout at key 1 (LT-07) | built | `povshots.ts` `paintViewB`, `shadeRegion`; `out/painted/zcpaint/p9/b03/beat-b03-sheet.png` |
| RM-06 | Caps `#22201f`, neighbour bands `#2b2724`, thin edge line `#4a433b` (every section plate through `sets.ts`: B04, B06, B07, B09) | built | `sets.ts` `CAP`, `CREAM.neighbour`, `paintCaps` edge line |
| B04-SH02 | Diagram plate gets the plate Overlay (Grade and Grain) | done | `shots/zcpaint.tsx` (`screenOnly()` on both keys) |
| B09-SH02B | Door defocus veil (`#d6c9ad` at 60/255 over y 900 and above) | built | `povshots.ts` `paintB09Sh02b`; `out/painted/zcpaint/p9/b09/beat-b09-sh02b-sheet.png` |
| B04-SH03 | 3 fill inserts | not built | next owner: Boss pass 10 |
| B04-SH04 | Lids on, per-language keys | not built | pass 10 |
| B05-SH01, SH02, SH03 | Medium (per-language lift), one hard pour insert, cistern reveal with three cues (pinch kept) | not built | pass 10 |
| B06-SH02, SH03 | OTS fridge open, dark interior; top-down order on the counter | not built | pass 10 |
| B07-SH01 | Hand stops at the stove (pinch kept) | not built | pass 10 |
| B09-SH02 | Profile close before the knock | not built | pass 10 |
| B08 | Untouched (plate code unchanged; its Overlay was already Grade and Grain, so its output is unchanged by A1) | unchanged | not re-compared by md5 (no pass 8 frame with the same overlay) |

Prioritised in story order: B01 and B02-SH03 first, then B03, then the B09 veil. B04-SH03 onward did not fit in this pass; each unbuilt shot keeps its sheet's fallback (held plate) for Editor until built.

### A1 caption readability (information only; the user chose outline captions, no shade)
- Test caption: the repo's own outline style (`src/scenes/Subtitles.tsx`, preset `outline`: white `#fff`, 7 px `#3d3c53` stroke painted under the fill, text shadow `0 4px 0 #3d3c53`, Noto Sans Thai 700, 51 px portrait), drawn by `Pass5Plate` with its block bottom at y 1248. Compositions `ZCPAINT-P9-CAP-*` in `src/painted/spike/zcpaint-p9-index.ts`; text is real TH lines from `tts-th.txt`.
- Worst frames (Grade and Grain, no shade): B02-SH01 TH f7, B02-SH02 TH f6, B03 View A TH f0, B04-SH01 f30, B06-SH01 f40, B07-SH02 f45, B10-SH01 f112. Crops at full resolution, 840 x 220 px at (120, 1040): `out/painted/zcpaint/p9/cap/crops/stack-caption-TH-7.png`. Read: legible on all seven, the dark outline carries the white text over cream, brown and grey-green fills.
- Caption-zone numbers on the same frames without glyphs (bare background, Grade and Grain on; `out/logs/zcp-p9-capzone-bg.json`, `out/logs/zcp-p9-undertext-bg.json`):

| Frame | Band 1060-1248 mean / p95 | Under text x 150-930, y 1140-1248 mean / p95 |
| --- | --- | --- |
| B02-SH01 TH f7 | 0.620 / 0.801 | 0.604 / 0.610 |
| B02-SH01 TH f30 | 0.619 / 0.793 | 0.604 / 0.610 |
| B02-SH02 TH f6 | 0.526 / 0.795 | 0.476 / 0.483 |
| B02-SH02 TH f20 | 0.530 / 0.801 | 0.478 / 0.486 |
| B02-SH02 TH f60 | 0.530 / 0.801 | 0.478 / 0.486 |
| B03 View A TH f0 | 0.530 / 0.801 | 0.478 / 0.486 |
| B03 View A TH f5 | 0.529 / 0.801 | 0.478 / 0.486 |
| B04-SH01 f30 | 0.411 / 0.764 | 0.355 / 0.561 |
| B06-SH01 f40 | 0.451 / 0.765 | 0.403 / 0.645 |
| B07-SH02 f45 | 0.399 / 0.572 | 0.397 / 0.572 |
| B10-SH01 f112 | 0.551 / 0.626 | 0.554 / 0.606 |
| B10-SH01 f150 | 0.512 / 0.654 | 0.516 / 0.723 |

- The default band limits (0.25 / 0.40) and the POV under-text limits (0.45 / 0.60) are exceeded on several frames without the shade. Recorded, not enforced: the user chose the outline over the shade (`delivery.md`, Boss pass 8 look check).

### Lead heights (`topPx` measure, `out/logs/zcp-p9-seated-lead.log`; staging for the others)
| Plate | Figure | px per m | Lead (px) | Rule >= 480 |
| --- | --- | --- | --- | --- |
| B09-SH01 | seated, 20 deg pitch, d 0.60 | 513.6 | 488.8 (skull 471.3) | pass, margin 8.8 px (pass 8: 484.4) |
| B09-SH03 | seated, 15 deg lift, d 0.60 | 513.6 | 497.6 (pass 8: 498.5) | pass |
| B07-SH02 | sofa, d 0.75 | 426.7 | 594.9 (pass 8: 614.0) | pass |
| B01-SH01 | back view, head centre (250, 440) at K 123 | staging | crown y ~290, lead ~1630 | pass |
| B01-SH02 | long lens, head centre (540, 560) at K 220 | staging | crown y ~292, lead ~1628 | pass |
| B02-SH03 | front close, head centre (515, 440) at K 142 | staging | crown y ~267, lead ~1653 | pass |

The staging rows are computed from the head centre and K (crown = centre - 1.22 K), not measured on pixels: a bbox run on these plates is open.

### Determinism and seek parity (`out/painted/zcpaint/p9/det/`, `out/painted/zcpaint/p9/seq/`)
- Two renders of the same frame (`remotion still`, `--gl=angle`), decoded RGB: B03-SH01 TH f14 identical; B09-SH02B f18 identical; B02-SH03 f39 1 px differs by 1 level; B01-SH02 f23 46 px differ, max channel delta 9 (bbox 24,493 to 975,903). Not bit-identical: the residual is recorded as `DF-20261030-zcpaint-figure-texture-residual` (open).
- Seek parity, sequence render (`--sequence --frames=30-32`) against single-frame stills, B01-SH02: f30 13 px (max 1), f31 99 px (max 9), f32 69 px (max 8). Same residual class. Studio cold load, backward scrub and unordered seeks: not run (no browser here; `DF-20261026-studio-emfile` open).
- Helper: `out/painted/zcpaint/p9/scripts/pixdiff.py` (decoded RGB count, max delta, bbox).

### WORLD FOG identity
- `scripts/zombie-condo-paint/render-frames.sh src/painted/spike/index.ts out/qa/zcp-p9/wfog` with the pass 7b IDs (21 frames): `diff` against `out/qa/zcp-s01/pass7b-after/md5.txt` exit 0, all 21 identical (`out/logs/zcp-p9-wfog-diff.log` is empty).

### Overview (B01 to B10, one representative frame per shot, manifest)
- `out/painted/zcpaint/p9/overview/overview-B01-B10.png` (24 slots, story order, B08 included). Manifest `out/painted/zcpaint/p9/overview/manifest.tsv` (order, shot, plate ID, frame, status, tile path). Red tiles are shots not built in pass 9 (B04-SH03, B04-SH04, B05-SH01..03, B06-SH02..03, B07-SH01, B09-SH02); their tile is a placeholder, not a frame.
- Per-beat sheets viewed: `out/painted/zcpaint/p9/b01/beat-b01-sheet-r2.png`, `out/painted/zcpaint/p9/b02/beat-b02-sh03-sheet-r2.png`, `out/painted/zcpaint/p9/qa/beat-b02-sh01-check.png`, `out/painted/zcpaint/p9/b03/beat-b03-sheet.png`, `out/painted/zcpaint/p9/b09/beat-b09-sh02b-sheet.png`, `out/painted/zcpaint/p9/seated-neck-check.png` (B07-SH02 f45 and B09-SH01 f57 at half resolution).

### Checks
- `npx tsc --noEmit` exit 0 (`out/logs/zcp-p9-tsc-*.log`, final run after the last edit).
- `npm test` 109 / 109 (`out/logs/zcp-p9-npmtest.log`; pass 8 had 108; new: the seated-neck test; the B09 lead test now uses `SEAT_D` 0.60).
- `npx eslint` on `src/painted/zcpaint`, `src/painted/shots/zcpaint.tsx`, `src/painted/spike/zcpaint-p9-index.ts`, `tests/zcpaint*.test.ts`: exit 0 (`out/logs/zcp-p9-eslint.log`, re-run after the last edit).

### Deviations (for Film and Mark to revalidate)
- D-P9-1 Framing (B01-SH01 back view, B02-SH03 front close): the sheets' head size and shoulder line leave the 6-head hips in the lower third, so the shorts and legs would show. The tee runs to the frame bottom instead (`teeToFrameBottom`, `body6.ts`; `DF-20261030-zcpaint-tee-to-frame-bottom`). Film or Mark decide the framing.
- D-P9-2 B01-SH02: the 4 deg settle tilt (pf 23-33) and the eye-shine glow are not painted (the p5.brush typings have no `rotate`; not added unverified). The profile silhouette has no hair shape at 270 px (sheet: "no profile features").
- D-P9-3 B01-SH02 scale: K 220 is taken as the decal K (`k` = 220 / K6); `INFECTED_SCALE` is not applied to this figure.
- D-P9-4 B01-SH01 shadow: an estimated quad (about 3 m toward the camera, the sheet's estimate), not a figure projection, because the PERSP shots have no key kit yet.
- D-P9-5 B02-SH01 lurch: the body-slam lurch is the door's kick and shudder on f 2 (as pass 8). The sheet's camera slam lurch (s +0.02 over f 1-2) is not added; the 1 deg tilt stays dropped (D-P8-2).
- D-P9-6 B02-SH01 defocus veil (sheet: `#d6c9ad` at 60 over y <= 900): not added. Only B09-SH02B got the veil, as asked. Open for Film or Mark.
- D-P9-7 B03 View B relight: zoned by wall (bath lamp on the left wall, living on the right wall, the lamp mean on the ceiling and floor). The sheet asks for each room's own tones; the four-zone split is an approximation. The dressing positions are Boss's composition within MK-ZC-ST-12.
- D-P9-8 "POV backdrop key" read as the View A entry key going out at key 1 (LT-07: a flat blackout veil over View A). Film to confirm the reading.
- D-P9-9 Captions: no ZC plate carries a shade. Default caption-zone numbers fail on B06 f40, B07 f45, B10 f112 (above); the Editor's caption style is the repo outline.
- D-P9-10 Seated neck: chin 0.27 head above the shoulder line (the standing neck); torso 1.8 heads (the standing torso); crown height unchanged on the floor figure, 0.16 head lower on the sofa (sitting height about 0.93 m). The tee outline (Catmull-Rom closed spline) overshoots its nominal shoulder line by about 0.23 head, so the neck test measures the neck tube, not the shirt edge.
- D-P9-11 RM-06 reaches every section plate (B04, B06, B07, B09) through `sets.ts`. B10 is an interior plate without `paintCaps`: its caps and neighbour bands are not re-coloured (open).
- D-P9-12 The B02-SH03 freeze is pf 39 on a plate clock 0-83 (TH fromSec 0.7, EN 0, as the sheet); the heave uses a 12 f eye dart and a 1.2 Hz 6 px body breath, both as sheet values.

### Scripting and tool lessons (this pass)
- zsh does not split an unquoted variable: file lists are passed as one string ("File name too long"). Use `while read` into `set --` (`out/painted/zcpaint/p9/scripts/overview.sh`).
- The repo path contains spaces: `$(pwd)` and unquoted lists break. Quote every path.
- `node -e '...'` with apostrophes inside the JS breaks the shell parse (the first attempt failed before any edit). Write the edit as a `.cjs` file with a quoted heredoc and assert each replacement count (`out/painted/zcpaint/p9/scripts/edit-*.cjs`).
- A background `diff ... > log` finished without its log file in this pass; the same diff was re-run in the foreground. Check the log exists before citing it.
- `timeout` does not exist on macOS (as in pass 8).

### Proposed document changes (TL/DP; not applied)
1. `docs/boss-asset-workflow.md` QA: a determinism gate for textured figure plates (two renders plus the sequence-versus-still check), with the residual class named in `DF-20261030-zcpaint-figure-texture-residual`.
2. `.claude/skills/painted-2d/SKILL.md` gotchas: the tee outline overshoots (measure the neck tube); the 6-head hips at a sheet's head size fall below the frame (tee to the frame edge, `DF-20261030-zcpaint-tee-to-frame-bottom`).
3. `storyboards/zombie-condo-paint/short/sc01-b01-b03.md` and `sc01-b09-b10.md` (Mark): confirm the framing of B01-SH01 and B02-SH03 (D-P9-1); B02-SH01 defocus line (D-P9-6).

### Questions for the user (relay through the coordinator; not asked here)
- Q-P9-1 Framing: accept the tee running to the frame bottom (shorts and legs out of frame) on B01-SH01 and B02-SH03?
- Q-P9-2 Caption style: accept the repo outline (white, 7 px `#3d3c53` stroke, 4 px text shadow) as the Editor's style on every ZC caption?
- Q-P9-3 B03 View B: is the per-wall relight (D-P9-7) enough, or does Film want each room's own tones?
- Q-P9-4 "POV backdrop key" (D-P9-8): is the View A blackout at key 1 what was meant?
- Q-P9-5 B09-SH02B veil (`#d6c9ad` at 60/255): accepted?
- Q-P9-6 Remaining shots (B04-SH03, B04-SH04, B05-SH01..03, B06-SH02..03, B07-SH01, B09-SH02): continue in pass 10 in story order?

### Files changed in pass 9 (uncommitted)
- `src/painted/zcpaint/`: `overlays.tsx` (A1), `povshots.ts` (A2, B03 View B, B09-SH02B veil), `body6.ts` (A3, `teeToFrameBottom`), `sets.ts` (RM-06), `b09.ts` (`SEAT_D` exported), `corridor.ts` (new: B01-SH01, B01-SH02), `closeups.ts` (new: B02-SH03).
- `src/painted/shots/zcpaint.tsx`: plate list (new plates, no cue shade, B04-SH02 overlay), header.
- `src/painted/spike/zcpaint-p9-index.ts` (new review entry, outside `Root.tsx`).
- `tests/zcpaint-body6.test.ts`: the B09 lead test now uses `SEAT_D` (d 0.60, was 0.55); a new seated-neck test (neck tube 0.27 head, was 0.55).
- `docs/dev-findings.md` and `docs/dev-findings/`: `DF-20261030-zcpaint-6head-seated-lead.md` (updated), `DF-20261030-painted-screen-layers-overlay.md` (updated), `DF-20261030-zcpaint-tee-to-frame-bottom.md` and `DF-20261030-zcpaint-figure-texture-residual.md` (new).
- `scripts/zombie-condo-paint/build-notes.md` (this section), `scripts/zombie-condo-paint/delivery.md` (stage cells).
- Stills and logs: `out/painted/zcpaint/p9/`, `out/logs/zcp-p9-*`, `out/qa/zcp-p9/wfog/`.

## 2026-10-30 — Boss pass 10: close-shot bust (Part A) and the remaining shots (Part B)

- Scope: user (30 Oct 2026, “วาดตัวช็อตใกล้แยก”): a separate half-body bust for the close shots, then the remaining shots in story order. Brief `VB-ZCPAINT-SHORT-R2.5`, sheets `ZCPAINT-SHORT-SS-R1.3`, delivery decisions through "Boss pass 9 look check". Uncommitted, not pushed. Worktree `claude/zcondo-paint-tsx-remotion-bdb058`; `node_modules` untouched.
- Start state: `npx tsc --noEmit` exit 0 at pass 9 (`out/logs/zcp-p9-tsc-*`). Pass 9 `body6.ts`, `corridor.ts`, `closeups.ts` saved as `out/painted/zcpaint/p10-body6.before.ts` before the first edit.
- Stills: `out/painted/zcpaint/p10/` (`bust/` model sheet, `close/` and `parts/` review renders, `final/` the evidence set, `sheets/`, `overview/`, `det/`, `seq/`); logs `out/logs/zcp-p10-*`.

### Status by item (stable IDs; look check pending for every item)

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| S-P10-BUST | Close bust module `src/painted/zcpaint/bust.ts` (front, back, standing profile incl. infected slump, seated profile; reach arms; decal heads at the plate K; `tufts` and `blinkAt` on `HeadMark`) | built | `bust/bust-model-sheet.png` (pages A-E viewed, five passes); `tests/zcpaint-bust.test.ts` (5 tests) |
| A1 | B01-SH01 OTS back on the bust (bag in the right hand as an insert; the screen falloff veil removed, D-P10-3) | built | `final/ZCP-B01-SH01_f36.png`, `_f60`, `_f104`; `sheets/beat-b01-final.png` |
| A2 | B01-SH02 infected turn (profile silhouette on the bust) and charge (front rage bust, slack, blood, dirty khaki) | built (settle tilt and eye-shine not painted, D-P9-2 carried) | `final/ZCP-B01-SH02_f0`…`_f47` |
| A3 | B02-SH03 his face close (front bust; heave and freeze keys unchanged; `KEY-ENT-PWR` light from above) | built | `final/ZCP-B02-SH03_f0`, `_f20`, `_f39`, `_f60`, `_f83` |
| A4 | B09-SH02 profile close, seated on the floor (new plate; `tired` face, day-3 stubble, blink at pf 10) | built | `final/ZCP-B09-SH02_f0`, `_f12`, `_f30`, `_f44` |
| A5 | Bust model sheet, pages A-E (front, back, profile, infected front, infected profile and silhouette, seated, reach, hand kit) | viewed | `bust/bust-model-sheet.png`; pages `bust/page-A.png`…`page-E.png` |
| B-B04-SH03 | Three fill inserts: `ZCP-B04-SH03a` (bucket under the tap), `-b` (pot), `-c-TH` / `-c-EN` (bottles; the fill length differs) | built | `final/ZCP-B04-SH03*`; `sheets/beat-b04-final.png` |
| B-B04-SH04 | Lids on: `ZCP-B04-SH04-TH` (keys 0, 4, 8), `-EN` (keys 3, 12, 21); open buckets show their mouth | built | `final/ZCP-B04-SH04-*` |
| B-B05-SH01 | Bathroom medium: six capped bottles, cistern and bowl, the mirror cabinet, the towel rail, the bucket lift (TH f 20-36, EN f 36-46) on the approved full figure | built (lift simplified, D-P10-7) | `final/ZCP-B05-SH01-TH_f0`, `_f25`, `_f40`, `_f50`; `-EN_f30`, `_f47` |
| B-B05-SH02 | One hard pour: the bucket tips from its lip (pf 15-36), the stream, the siphon arcs from pf 72; hands on mittens | built | `final/ZCP-B05-SH02_f0`…`_f100` |
| B-B05-SH03 | Cistern reveal: the pinch on the lid's right edge, the lid lifted (pf 21-33) and set aside (by pf 60), clear water from pf 33 | built | `final/ZCP-B05-SH03_f0`…`_f95` |
| B-B05-SH03b | Part 2 bowl close: the red cross paints on in 6 f from part-f 3 (horizontal bar first) | built | `final/ZCP-B05-SH03-BOWL_f0`, `_f6`, `_f20` |
| B-B05-SH03c | Part 3: the cistern with its lid aside, condition icons on per-language keys (TH drop 0, bottle 19; EN 11, 55) | built (icons are flat glyphs, D-P10-9) | `final/ZCP-B05-SH03-TH_f0`, `_f30`, `_f60`; `-EN_f20` |
| B-B06-SH02 | Fridge one quick open: back bust at the left edge, left hand on the handle (pf 0-6, 32-41), right hand on the box and cup from pf 6; dark interior, no lamp | built | `final/ZCP-B06-SH02_f0`…`_f62`; `sheets/beat-b06-sheet.png` |
| B-B06-SH03 | Counter top-down: items left to right, the third can set down at f 3 (both), the hand leaves by f 12 | built (device line is Editor's text, D-P10-10) | `final/ZCP-B06-SH03_f0`…`_f30` |
| B-B07-SH01 | Hand stops at the stove: profile bust, reach (pf 15-45) to the clasp, stop (pf 48), back (57-75), face keys, one blink at pf 12; case on the shelf, no flame | built (elbow down, bend -1; stop offset 26 px, D-P10-6) | `final/ZCP-B07-SH01_f0`…`_f120`; `sheets/beat-b07-final.png`; `sheets/crop-B07-f45.png` |
| B-B09-SH02 | Face close before the knock (A4 above) | built | as A4 |
| R | Shots not changed in pass 10 (pass 5-9 plates): B02-SH01, B02-SH02, B03-SH01, B04-SH01, B04-SH02, B06-SH01, B07-SH02, B08-SH01, B09-SH01, B09-SH02B, B09-SH03, B10-SH01 | unchanged code path; in the overview | `overview/manifest.tsv` |

Every new plate is `ZCPAINT`-registered in `src/painted/shots/zcpaint.tsx` with its sheet cameras (`CAM_PUSH`, the B07 and B09 pushes) and `screenOnly()` (Grade and Grain only, no caption shade, D-P10-3).

### Measurements

- Lead heights (`≥ 480 px`, from the staging; the crown is the head centre less 1.05 K, the frame bottom is 1920, or the floor where it shows): B01-SH01 310 → 1920 = 1610 px; B01-SH02 charge (scale 1.12) crown 301 → 1619 px; B02-SH03 crown 289 (±6 breath) → 1631 px; B07-SH01 crown 310 → feet 1868 = 1558 px; B09-SH02 crown 443 → floor 1341 = 898 px; B05-SH01 (full figure, 186 px head) crown 300 → feet 1416 = 1116 px; B06-SH02 crown 229 → 1691 px. All pass. Method by staging arithmetic, not a pixel bbox (the bbox run on the plates is open).
- Caption zone on the bare plate frames (`scripts/caption-zone.py --band 1060:1248`, `out/logs/zcp-p10-capzone-bare.json`): the default thresholds (0.25 / 0.40) fail on every new frame checked; the light insert and set frames measure mean 0.81 (aqua tile) and the B01 corridor 0.34 (B01-SH01 f60) to 0.48 (B01-SH02 f20, B02-SH03 f20). Recorded, not enforced: the user chose the outline caption with no shade.
- Caption readability with the repo outline (`src/painted/spike/zcpaint-p10-index.ts`, `CAP`; the sheet's Thai line per frame): 13 full-resolution crops (840 × 220 at (120, 1040)), stacked at half size: `sheets/caption-readability-stack.png`. Read: every line is legible over the plate; the B07 line (`คาร์บอนมอนอกไซด์ ฆ่าคุณได้ก่อนซอมบี้`) runs wider than the caption-safe box as one line (test only; the Editor's wrap must break it, D-P10-17).
- Determinism (`remotion still` twice, decoded RGB, `out/painted/zcpaint/p9/scripts/pixdiff.py`): B02-SH03 f39 identical; B05-SH02 f50 identical; B09-SH02 f30 identical; B01-SH02 f23 22 px differ by 1 level (bbox 471-688, 496-799), the residual class of `DF-20261030-zcpaint-figure-texture-residual`.
- Seek parity (`remotion render --sequence --frames=37-39`, `out/painted/zcpaint/p10/seq/b02sh03/`): element-39 against the still `ZCP-B02-SH03_f39`: identical (0 px). One sample, not a Studio cold load (no browser here; `DF-20261026-studio-emfile` open).
- WORLD FOG identity: `scripts/zombie-condo-paint/render-frames.sh` with the pass 7b IDs (21 frames): `out/qa/zcp-p10/wfog/md5.txt` against `out/qa/zcp-s01/pass7b-after/md5.txt`: `diff` exit 0, 21 of 21 identical (`out/logs/zcp-p10-wfog-diff.log` empty).
- Overview (one representative frame per shot, B01 to B10, all 24 shots including B08): `out/painted/zcpaint/p10/overview/overview-B01-B10.png`; manifest with absolute tile paths `out/painted/zcpaint/p10/overview/manifest.tsv`.
- Checks: `npx tsc --noEmit` exit 0; `npm test` 114 of 114 (the 109 of pass 9 plus the 5 bust tests; `out/logs/zcp-p10-npmtest.log`); `npx eslint src tests` exit 0 (`out/logs/zcp-p10-eslint-full.log`).

### Deviations (for Film and Mark to revalidate)

- D-P10-1 Framing (carried from D-P9-1 and `DF-20261030-zcpaint-tee-to-frame-bottom`, now revalidated): at the sheets' head sizes the 6-head legs show in the lower frame (B01-SH01, B02-SH03, B07-SH01: the feet sit 0-0.9 head above the frame bottom). The bust draws the upper body and the 6-head legs, not a tee block. A true waist-up crop needs a larger head on those shots (Film/Mark decision, Q-P10-1).
- D-P10-2 The bust is also used for B06-SH02 (OTS back, head 250 px) and B07-SH01 (profile reach, head 260 px): both are closes by the sheets' head sizes. The user named B01-SH01, B01-SH02, B02-SH03 and B09-SH02. B05-SH01 keeps the approved full figure (a medium, lead 1116 px). Q-P10-2.
- D-P10-3 The B01 screen falloff veils (`#101514` at 0.55 from y 820 in B01-SH01; from y 900 in B01-SH02) are removed: they acted as a caption shade, which the user removed at pass 8 and pass 9. The outline captions read without them (`sheets/caption-readability-stack.png`).
- D-P10-4 B01-SH02 settle tilt (4 deg to 0) and the eye-shine stay unpainted (D-P9-2 carried; a front head tilt has no p5.brush typing here).
- D-P10-5 B09-SH02 keeps the approved `figSeatFloor` pose (fists on the shins under the chin, the head over the knees); the bust changes the torso, the neck and the arms. Q-P10-5.
- D-P10-6 B07-SH01 reach: the two-bone IK bends the elbow down (`bend` -1; the up-bend ran through the face). The stop is 26 px (about 2.8 cm at the 260 px head) off the clasp, the sheet says 2 cm (about 18 px). The pinch points up at the clasp from below. No pixel test of the contact.
- D-P10-7 B05-SH01 lift: the bucket sits on the floor before the lift and in the hands after the lift's midpoint (switch, not a continuous carry); the arm pose switches at TH f 28, EN f 41.
- D-P10-8 B06-SH02: the box and cup move with the right hand key as a flat insert (no grip model); the left arm is a 2D OTS reach that passes over the back.
- D-P10-9 B05-SH03 icons are flat glyphs; the crossed chemical bottle reads small at 270 px (it can read as a beetle). Redraw if Film wants it.
- D-P10-10 Text overlays (the B06 device lines, the B05-SH03 labels) are Editor's (`quadTexts` or `S-08`); only the painted parts are here.
- D-P10-11 B05-SH02: the bucket handle is an ink tip, the siphon is ink arcs (no level drop).
- D-P10-12 B04 inserts: water is a lighter flat band with a surface ellipse (no refraction); containers are flat cylinders; B04-SH03c is two plates (TH 12 f, EN 15 f).
- D-P10-13 The B05-SH01 full figure is the S-P12-approved `figFront` (bucket arms); the bust's upper-body shapes are not used on the medium.
- D-P10-14 Caption-zone default thresholds fail on the light frames (above); recorded, not enforced.
- D-P10-15 Head tufts: the bust turns off the back-head crown tufts (`HeadMark.tufts`, default on for the other figures; the S-P12 sheet is unchanged).
- D-P10-16 The screen falloff removal (D-P10-3) changes the B01 plates only; B01 captions are measured on the bare frames above.
- D-P10-17 The B07 caption line is wider than the caption-safe box as one line (the test composition has no break); the Editor's wrap must break it.

### Editor handoff (plate IDs, per-language keys; no timeline update in this pass)

- B01-SH01 `ZCP-B01-SH01` (shared, fromSec 0). B01-SH02 `ZCP-B01-SH02` (shared, fromSec 0).
- B02-SH03 `ZCP-B02-SH03` (TH fromSec 0.7; EN fromSec 0; unchanged mapping).
- B04-SH03 `ZCP-B04-SH03a` (TH and EN [0, 39), fromSec 0), `ZCP-B04-SH03b` (TH and EN [39, 51), fromSec 0), `ZCP-B04-SH03c-TH` (12 f) and `ZCP-B04-SH03c-EN` (15 f).
- B04-SH04 `ZCP-B04-SH04-TH` (12 f; lid keys 0, 4, 8), `ZCP-B04-SH04-EN` (33 f; lid keys 3, 12, 21).
- B05-SH01 `ZCP-B05-SH01-TH` (51 f; lift f 20-36), `ZCP-B05-SH01-EN` (48 f; lift f 36-46).
- B05-SH02 `ZCP-B05-SH02` (shared: TH fromSec 1.2, EN fromSec 0.5; pour tip at pf 36).
- B05-SH03 `ZCP-B05-SH03` (part 1: TH fromSec 0.7, EN fromSec 0; 96 f TH, 66 f EN), `ZCP-B05-SH03-BOWL` (part 2, fromSec 0, 21 f), `ZCP-B05-SH03-TH` (part 3, icon keys 0 and 19) and `ZCP-B05-SH03-EN` (part 3, icon keys 11 and 55).
- B06-SH02 `ZCP-B06-SH02` (shared, fromSec 0; EN cuts at f 45). B06-SH03 `ZCP-B06-SH03` (shared; the can lands at f 3).
- B07-SH01 `ZCP-B07-SH01` (shared, 141 frames; TH fromSec 0.5 = pf f + 15, EN fromSec 0.9 = pf f + 27).
- B09-SH02 `ZCP-B09-SH02` (held, fromSec 0; EN cut 6 f earlier, as the sheet).
- Unchanged plate IDs: as in the overview manifest.
- Review entries (outside `Root.tsx`): `src/painted/spike/zcpaint-p10-index.ts` (one composition per registered plate, plus the 13 caption checks), `src/painted/spike/zcpaint-p10-bust-index.ts` (bust sheet pages).

### Scripting and tool lessons (this pass)

- zsh does not split an unquoted variable, and it does split command-substitution output (the repo path has spaces). A spec list passed as one string made `render-frames.sh` read `PAINTED-SPIKE-Cast:0` as a frame (`Frame NaN is not finite`); the rerun passed the specs as literal arguments. Use arrays (`files=(); while read …`) for tile lists.
- zsh reserves `status` (read-only) and parses `$n[...]` as a subscript: brace every variable (`${n}`, `${lab}`).
- A quoted heredoc `.cjs` with `rep(path, [[old, new]])` and asserted counts did every source edit (no `node -e` with apostrophes). The one failure (a shell-stripped quote) stopped before writing, so no partial edit.
- A `prt`/`over` name clash and an unused constant were caught by tsc and eslint; both fixed.
- Remotion `still` takes `--frame` per call; compositions are 240 frames in the review entry, so a frame past 239 (B04-SH02 f300) fails; use the sheet's in-range frame (f150).

### Proposed document changes (TL/DP; not applied)

1. `docs/boss-asset-workflow.md` QA (figure plates): a determinism gate with the residual class named, and a seek sample per shot family (carry from pass 9).
2. `.claude/skills/painted-2d/SKILL.md` gotchas: the close bust (use `bustFig`, not the full figure, for closes); the screen falloff veil is a caption shade in disguise; zsh word splitting in the render helper.
3. `storyboards/zombie-condo-paint/short/sc01-b01-b03.md`, `sc01-b04-b05.md`, `sc01-b06-b08.md`, `sc01-b09-b10.md` (Mark): the head sizes that leave the legs in frame (D-P10-1); the B06-SH02 and B07-SH01 bust use (D-P10-2); the B07 stop offset (D-P10-6).

### Questions for the user (relay through the coordinator; not asked here)

- Q-P10-1 Framing: keep the sheets' head sizes (the 6-head legs at the frame bottom on B01-SH01, B02-SH03, B07-SH01), or change the head size so the frame cuts at the waist?
- Q-P10-2 Accept the bust on B06-SH02 (OTS back) and B07-SH01 (profile reach) as closes, beyond the four named shots?
- Q-P10-3 Accept the removal of the B01 screen falloff (D-P10-3)?
- Q-P10-4 Look check of the bust sheet (`bust/bust-model-sheet.png`) and the close plates (`sheets/close-overview.png`, `sheets/beat-b01-final.png`, `sheets/beat-b07-final.png`).
- Q-P10-5 B09-SH02: accept the approved seated pose (fists on the shins under the chin) with the new torso?
- Q-P10-6 B05-SH03 chemical icon: redraw it as a clearer bottle, or keep the glyph?

### Files changed in pass 10 (uncommitted)

- `src/painted/zcpaint/bust.ts` (new: close bust), `src/painted/zcpaint/inserts.ts` (new: B04-SH03/04, B05-SH02/03, B06-SH03), `src/painted/zcpaint/bathroom.ts` (new: B05-SH01), `src/painted/zcpaint/fridge.ts` (new: B06-SH02).
- `src/painted/zcpaint/closeups.ts` (B02-SH03 on the bust; new B07-SH01 and B09-SH02), `src/painted/zcpaint/corridor.ts` (B01-SH01 back bust, B01-SH02 infected bust, veils removed).
- `src/painted/zcpaint/body6.ts` (re-exports for the bust, optional `light` in `drawFig`, `HeadMark.tufts` and `blinkAt`; defaults unchanged).
- `src/painted/shots/zcpaint.tsx` (registry: all new plates and `CAM_PUSH`).
- `src/painted/spike/ZcBustSheet.tsx`, `zcpaint-p10-bust-index.ts`, `zcpaint-p10-index.ts` (new review entries).
- `tests/zcpaint-bust.test.ts` (new, 5 tests).
- `scripts/zombie-condo-paint/bust-sheet.sh`, `plate-stills.sh` (new; procedure scripts).
- `scripts/zombie-condo-paint/delivery.md` (stage cells), `scripts/zombie-condo-paint/build-notes.md` (this section).
- `docs/dev-findings.md` and `docs/dev-findings/` (see the pass 10 finding row).
- Stills and logs: `out/painted/zcpaint/p10/`, `out/logs/zcp-p10-*`, `out/qa/zcp-p10/wfog/`.

## 2026-10-30 — Film SPK-ZCP-06: the "puppet" look (costume and paint texture comparison)

**Trigger:** user “ตัวละครมันดูเป็นหุ่นกระบอกอยู่”, then after the WORLD FOG r6 comparison “6 หัวต่อ แต่เปลี่ยนชุด+เนื้อสี” and “ทำเทียบ” (delivery record, “Puppet look”). Spike only: no production plate, `src/Root.tsx`, `body6.ts`, `bust.ts` or WORLD FOG file changed. The stopped Boss pass 11 patch was read as reference (its B02-SH03 waist framing and `zoomAt` are copied into the spike), not applied.

**Diagnosis (pass 10 frames, `out/painted/zcpaint/p10/overview/`):** the puppet read comes from bare skin tubes: tee + shorts leave the forearms, shins and knees as one skin-coloured tapered tube each, with a hard hem line at the shorts and sleeves. That is where the eye sees the joints. The 6-head proportion itself is not the problem. WORLD FOG r6 covers the limbs (jacket, long sleeves, long trousers), so the joints sit inside cloth, and its cloth carries a glaze ring plus 2B hatch in the shade (VD18).

**Files (new, spike only):** `src/painted/spike/ZcSpk06Figs.ts` (variant figures `sideWalkV`, `seatFloorV`, `bustFrontV`, texture painter, `drawFigV`), `src/painted/spike/ZcSpk06.tsx` (B04-SH01, B09-SH01, B02-SH03 plates with the production sets, light, cameras and overlays; staging values copied), `src/painted/spike/zcpaint-spk06-index.ts` (compositions `ZCPAINT-SPK06-<B04|B09|B02>-<P10|P10W|A|B|C>`, labels burned in).

**Variants:**
- `P10`: the production plate as pass 10 ships it. `P10W` (B02 only): the pass 10 bust at the pass 11 waist/chest close framing (head 587 px, chin y 1002), so that framing and costume can be judged separately.
- `A`: 6 heads, costume over the limbs: open overshirt (teal `#2f5a5c`, his established colour) over a warm grey tee (`#cdc6b6`), sleeves to the wrist with a cuff line, long charcoal trousers (`#474d55`) to the ankle with knee and instep folds, overshirt hem over the hip joint, collar band/points, chest pocket on the close. Limb masses thicker (sleeve radius 0.215 → 0.17 head, trousers 0.30 → 0.20, vs skin arm 0.16 → 0.10). B04 walk: CP-P03, near arm swung back with the hand past the hip, far arm forward. Flat cel two tones (`paintPart`), decal heads, mittens/fists, B09 pitch 0.35 rad (20°) unchanged. Day 3 uses `COSTUME_DAY3` (slightly darker).
- `B`: A plus brush texture in the cloth only: after each flat cloth wash, one seeded glaze (18–26 % darker, opacity 150, `fillTexture(0.7, 0.6)`, no bleed), and in the cel tone a WORLD FOG VD18 2B hatch (7 px at 40°, weight 1.0, normalised to screen scale) that survives only in the shade band. Skin, hands, heads and sets stay flat.
- `C`: B on a 5.5-head build (heights below the chin × 0.9, widths × 1.08, the head unchanged).

**Iterations:** r1: costume works, texture invisible at sheet scale, and the profile collar cel block reads as a hood. r2: collar becomes a thin band, glaze stronger, hatch added, but hatch is invisible on dark teal. r3: hatch weight 1.0 and 0.6 mix are visible, but the close (≈4.6× scale) throws dark specks past the silhouette. r4/final: bleed 0, hatch spacing and weight divided by the screen scale, seated collar removed. No specks remain.

**Evidence (viewed):** `out/painted/zcpaint/spk06/final/SPK06-sheet-B04-SH01.png`, `SPK06-sheet-B09-SH01.png`, `SPK06-sheet-B02-SH03.png` (labelled, order P10 | (P10W) | A | B | C), full-resolution figure crops `SPK06-crops-P10-A-B-C.png` (B04 left four, B09 right four). Rounds r1–r4 kept under `out/painted/zcpaint/spk06/`.

**Measured:**
- Lead height (geometry `topPx × k`): B04 f45 P10 586 / A, B 586 / C 539 px; B09 P10 489 / A, B 489 / C 447 px. **C fails the 480 px seated rule (RK-28)**: it would need d ≈ 0.45 or a larger section scale.
- Caption zone (`scripts/caption-zone.py`, default thresholds): every frame fails as the shipped P10 frames do (B02 mean 0.66–0.68 vs P10W 0.68, B04-B 0.52, B09-B 0.21). This is the accepted cream-condo condition with the thick-outline captions (pass 8/9 decision), not a regression.
- Determinism: B02-B f50 decoded-RGB md5 identical across two separate bundles/runs (r4 and final). B09-B f60 and the untouched production B04-P10 f45 differ by 2 px at 1 level between runs (the known `DF-20261030-zcpaint-figure-texture-residual` class).
- Hold: B09-B f60 → f61 differs on the ink outlines (boil) and as sub-pixel resampling of the hatch under the B09 push. Texture seeds come from the part order and do not reseed per frame.
- `npx tsc --noEmit`: 0 errors; `npx eslint` on the three spike files: 0 problems. Tests not run (spike files only).
- Dev-findings consulted: `DF-20261030-painted-glaze-pickup` (the B glaze sits over the part's own opaque wash, so granulation shows only the cloth base, never the set), `DF-20261030-zcpaint-figure-texture-residual` (same class as above), `DF-20261030-painted-arm-depth` (CP-P03 used in profile; no front-view `behind` arm in these three frames).

**Read:** A already removes the puppet read in all three frames: no bare tubes, the joints are inside cloth, the hem breaks the hip. B adds the WORLD FOG hand-made surface without blotching the sets. C reads chunkiest and closest to WORLD FOG, but it reverses the user's 6-head choice and fails the B09 lead rule. In the close it differs from B only slightly.

**Film recommendation:** B. Open: the stubble still reads as a cluster of blobs (`DF-20261030-zcpaint-day3-stubble-spots`, unchanged), and the bare neck looks long in the close because the collar sits low. A taller collar stand is a Boss detail if the user wants it.

### Proposed brief change `VB-ZCPAINT-SHORT-R2.6` (proposal only; not applied; needs the user's choice)
- `BODY-ZCP-6H` → **R2.6 costume**: `zc-you` wears an open overshirt over a tee, sleeves to the wrist (cuff line) and long trousers to the ankle (knee/instep folds); bare skin only at hands, feet, neck and face. Landmarks and 6-head proportions unchanged. Limb masses: sleeve radius 0.215 → 0.17 head, trousers 0.30 → 0.20 head. Day-3 colours slightly darker. Overshirt teal `#2f5a5c`, tee `#cdc6b6`, trousers `#474d55` (Design; Boss may tune values within the read). Infected unchanged: dirty khaki shirt and grey-green trousers (approved 7b), with sleeves taken to the wrist to match.
- `VD-ZCP-LOOK` / `LT-04` → **R2.6 cloth texture**: figure cloth gets one seeded glaze (ring and granulation over its own opaque wash, no bleed) and a VD18 2B hatch in the cel band, normalised to screen scale. Skin, hands, decal heads, sets, plates and POV backgrounds keep the clean “สะอาดแบบตัวละคร” fills. This relaxes the clean-paint decision for figure cloth only.
- `VD-ZCP-LIGHT`: unchanged (cel two tones, cast shadows from the same parts).
- Arms: CP-P03 swing in profile walks. Front-view bent arms follow `Arm.behind`-style depth (pass 11 design), still Boss's.
- Boss work (S-P12 rev): port `sideWalkV` / `seatFloorV` / `bustFrontV` costume geometry into `body6.ts` / `bust.ts` for every view (front, back, profile, walk, floor-seated, sofa-seated, bust front/back/side, infected), add the texture painter to `washPaint` behind an option, re-run the model sheet and B1–B5, then the plates. Mark re-checks closes for collar/neck framing.
- Acceptance: no bare forearm or shin in any plate; lead ≥ 480 px; WORLD FOG 21-frame md5 unchanged; the texture holds still across adjacent frames apart from ink and camera resampling; no specks outside the silhouette at the close scale.
