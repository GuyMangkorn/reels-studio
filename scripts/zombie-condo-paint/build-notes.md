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

## 2026-10-30 — Boss pass 11 (R2.6 costume)

- Scope: brief `VB-ZCPAINT-SHORT-R2.6`, Boss needs `S-P12` rev (items 1–5, acceptance `B6`–`B11`), asset family only: the costume port into `body6.ts` and `bust.ts`, collar stand and bust neck (`FR-ZCP-CLOSE`, RK-30), CP-P arm depth, the `washPaint` cloth texture (off by default), the waist-cut bust placement and the R2.6 model sheet. **Plates are not rebuilt in this pass** (B7: the user's look check of the sheet comes first; all 24 shots follow it). Worktree `usage-check-agent-tuning-16bd9b` at `541385d`, uncommitted, not pushed.
- Start state: `body6.ts`, `bust.ts`, `ZcSpk06Figs.ts` identical to the sibling worktree's committed HEAD (`e9a542e`, source `d13446a`); no uncommitted source there. The stopped pass 11 patch exists only as frames (`out/painted/zcpaint/p11/before`, `spk06/final`), so the waist-cut framing was rebuilt from the sheet values (B02-SH03 head ≈587 px, chin y 1002; B01-SH01 head ≈600 px, chin y 1000).
- Environment: this worktree's `node_modules` symlink pointed to the main checkout's partial install (no `p5.brush`; `DF-20261030-worktree-node-modules`). The untracked symlink now points to the sibling `world-frog-main-6920cb/node_modules` (has `p5.brush`; `remotion versions` 4.0.538). Never committed.

### Status by item (stable IDs)

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| S-P12 rev 1 | Costume port: front, back, profile, walk, floor-seated, sofa-seated, busts front/back/profile/seated, infected, day 3 | built (geometry and sheet; look check pending) | `out/painted/zcpaint/r26/review-A.png`, `review-B.png`, `review-C.png`, `review-E.png` |
| S-P12 rev 2 | Collar stand (`CS-ZCP-R26`) and shorter bust neck; `RK-30` read | built; read at full resolution (stand reads as a band with points, not a hood) | `crop-B02-SH03-collar.png`, `crop-B01-SH01-nape.png`, `review-E.png` |
| S-P12 rev 2 | Waist-cut bust placement (`placeClose`, `waistCutHeads`) | built (shared helper; no plate changed) | `review-F.png`, `review-G.png` |
| S-P12 rev 3 | CP-P arm depth: CP-P05 hang, CP-P03 walk, CP-P02 bucket grip (upper arm behind); back-view `depth: 'behind'` reach option | built; the back-view reach option is not on a plate yet | `review-A.png` row 2 |
| S-P12 rev 4 | `washPaint` cloth texture, glaze + hatch, cloth only, off by default | built | `review-D.png`; `tests/zcpaint-costume.test.ts` texture test |
| S-P12 rev 5 | R2.6 model sheet, pages A–G | built | `out/painted/zcpaint/r26/review-A.png` … `review-G.png`; overview `model-sheet-overview-A-G.png` |
| B6 | No bare forearm, knee or shin; bare skin only at hands, feet, neck, face | pass (geometry, all views and poses listed above) | test `costume: bare skin …` |
| B7 | Model sheet viewed, then the user's look check before any plate | sheet viewed by Boss; **user look check pending** | `Q-R26-1` |
| B8 | Closes: cut 3.0–3.6 heads, face above y 1040, visible neck ≤ 0.10, collar reads | measured (below); crops viewed; Film/Mark and user check pending | test `collar: …`, `waist-cut close …` |
| B9 | Cloth texture holds still across adjacent frames; no specks outside the silhouette at the close scale | **not verified**: no multi-frame render of a textured figure in this pass; specks not seen on `review-D.png` and `crop-B02-SH03-collar.png` | plate pass |
| B10 | Each pose names its CP-P row on the sheet; front-view bent arms behind | pass (page A labels name CP-P05 / CP-P03 / CP-P02) | `review-A.png` |
| B11 | Determinism recorded per plate; WORLD FOG 21-frame md5 re-run | WORLD FOG re-run on the final code: see *Checks*; per-plate determinism not applicable (no plate rendered) | `out/qa/zcp-r26/wfog-final/md5.txt` |

### Measurements (geometry at the stated scale; `out/logs/r26-measure-3.log`, `r26-head-measure.log`, `r26-neck-default.log`)

- **Bare limb tubes (HEAD → now):** front 4 → 0, walk 4 → 0, bust front 4 → 0, bust profile 3 → 0, bust seated 4 → 0, infected front 2 → 0. (The remaining skin tubes are necks, which `B6` exempts.)
- **Bucket grip, widest arm part:** HEAD 1.33 heads (the elbow splayed outward) → now 0.93 heads.
- **Visible bare neck (chin to collar top, at the chin's column):** bust front zc-you 0.090 head (≈53 px at a 587 px head); bust front infected 0.090; bust profile zc-you 0.054; bust profile infected slump 1 0.029 (pitched chin). All ≤ 0.10.
- **Collar stand top:** 4.91 heads at the front opening (0.09 under the decal chin at 5.00), 4.95 at the sides and nape.
- **Waist cut:** B02-SH03 chin y 1002, head 587 px (k 4.635), crown y 415, cut **3.44 heads**, lead 1505 px; B01-SH01 chin y 1000, head 600 px (k 4.738), crown y 400, cut **3.47 heads**, lead 1520 px. Both inside 3.0–3.6 and above the 1040 face line.
- **Lead heights:** B09 seated (`K_B09` 517.6 px/m) 504 px upright, 492.5 px at the 20° pitch (≥ 480); unchanged from HEAD. B04 walk at `SEC-2D` 586 px, unchanged. Infected full figure 737 px at 447 px/m (geometry).
- Crown heights unchanged: 6.00 heads (zc-you), 5.88 (infected, 0.95 scale).

### Deviations (for Film and Mark to revalidate)

- D-R26-1 Collar front top 4.91 (brief: ≈4.88) so the visible neck meets ≤ 0.10 against the decal chin at 5.00 (`Boss may tune values within the read`).
- D-R26-2 Bust neck: the capsule runs from 4.80 (less the slump) to the chin, 0.34 head wide; the full-figure neck is the approved 4.66 → 5.02.
- D-R26-3 Infected profile close: the khaki band follows the pitched chin (`DF-20261030-zcpaint-collar-neck-close`); in profile it reads as a short flat shelf under the chin (`review-E.png`). Fallback in `CS-ZCP-R26`: band on front busts only.
- D-R26-4 Bucket grip: CP-P02 is drawn as an explicit elbow at the torso edge (not IK); the bucket insert belongs to the plate and is not in the sheet.
- D-R26-5 Standing figures: the stride sets the arm swing (CP-P03 for walk stride > 0); standing arms hang (CP-P05). The R2.5 walk and standing poses changed accordingly.
- D-R26-6 Texture scope: `cloth` parts only (overshirt, tee, trousers, sleeves; infected shirt, trousers, sleeves). Skin, hands, hair, decal faces, props and sets stay flat. Hatch only in the cel tones.
- D-R26-7 The seated bust (B09-SH02) keeps the pass 10 head placement (`T(0.73, 1.8)`); it was not re-reviewed at full resolution in this pass.
- D-R26-8 `ZcS12Sheet` and `ZcBustSheet` now draw the costume (their spike pages changed); their measure values in pass 7b / pass 10 notes are superseded by this pass.

### Checks

- `npx tsc --noEmit`: 0 errors (`out/logs/r26-tsc-4.log`).
- `npx eslint` on `src/painted/zcpaint`, the R2.6 spike files and the three bust/body6/costume tests: 0 problems (`out/logs/r26-eslint-4.log`).
- `npm test`: 142 of 142 (136 before, plus the 6 costume tests in `tests/zcpaint-costume.test.ts`; `out/logs/r26-npmtest-2.log`).
- Sheet renders: `scripts/zombie-condo-paint/r26-sheet.sh` (`--gl=angle`, pages A–G, `out/logs/r26-sheet-run3.log`).
- WORLD FOG 21-frame identity (`render-frames.sh src/painted/spike/index.ts`), final code: `out/qa/zcp-r26/wfog-final/md5.txt`. The eight composition frames (`WFOG-PREVIEW-S02-SH02`, `WFOG-SP01-S02-SH09`, `WFOG-SP01-S03-SH03`) match the HEAD render (`541385d`, git archive in scratch; `out/logs/r26-wfog-final-vs-head8.log`, empty). The 13 spike-sheet frames match the pass 10 list (`out/qa/zcp-r26/wfog/baseline-pass10-md5.txt`) and the first run of this pass (`out/logs/r26-wfog-final-vs-pass10-13.log`, `out/logs/r26-wfog-final-vs-first13.log`, both empty). The pass 10 list differs from HEAD on the eight composition frames; the sibling checkout's source under `src/painted`, `src/scenes`, `src/videos` matches HEAD, so HEAD is the gate. Result: **21 of 21 identical to HEAD** (13 frames: `out/qa/zcp-r26/wfog-final/head-13.txt`, `out/logs/r26-wfog-final-vs-head13.log` empty; 8 frames: `out/qa/zcp-r26/wfog-final/final-8.sorted.txt` against `out/qa/zcp-r26/wfog/head-baseline-8.txt`, empty). The 13 also match the pass 10 list and the first run of this pass.
- Lint and typecheck were run on the final code (after the last `bust.ts` and sheet edits): `out/logs/r26-tsc-4.log`, `out/logs/r26-eslint-4.log`.
- `scripts/zombie-condo-paint/delivery.md` shows a one-line change in this checkout (14:28, not made by this pass; not edited, not committed).
- Not run: Studio, seek parity, plate renders (no plate is rebuilt in this pass), the adjacent-frame texture check (`B9`).

### Scripting and tool lessons (this pass)

- zsh does not split an unquoted `$SPECS`: the first HEAD baseline passed one spec string and failed with `Frame NaN is not finite` (repeat of the pass 10 lesson). Pass literal arguments or arrays to `render-frames.sh`.
- The WORLD FOG spike entry reaches ZCPAINT modules through `src/painted/registry.ts` (module walk: 95 files, `zcpaint/sets.ts`, `balcony.ts`, `shots/zcpaint.tsx`). A shared ZCPAINT change therefore needs the 21-frame check even when WORLD FOG code is unchanged.
- `visibleNeckHU` must rotate the chin with the head pitch. The first version (un-pitched chin) read 0.093 on the infected profile while the pitched chin left about 0.15 bare neck in front of the band.

### Proposed document changes (TL/DP; not applied)

1. `docs/boss-asset-workflow.md` QA (figure plates): name the entry reach (a shared ZCPAINT change re-runs the WORLD FOG 21-frame check, even when WORLD FOG code is unchanged).
2. `.claude/skills/painted-2d/SKILL.md` gotchas: "render-frames specs: pass literal arguments (zsh does not split `$SPECS`)"; "a close's neck is measured at the pitched chin".
3. `storyboards/zombie-condo-paint/short/sc01-b01-b03.md`, `sc01-b09-b10.md` (Mark): the infected profile close (B01-SH02) and the seated bust close (B09-SH02) need a look at the collar and neck read after the plate pass.

### Questions for the user (relay through the coordinator; not asked here)

- Q-R26-1 (B7 look check, before any plate): `out/painted/zcpaint/r26/model-sheet-overview-A-G.png` and the labelled pages `review-A.png` (standing, walk, CP-P rows), `review-B.png` (infected), `review-C.png` (seated, sofa), `review-D.png` (texture off and on), `review-E.png` (busts), `review-F.png` and `review-G.png` (waist-cut closes).
- Q-R26-2 Collar on busts: keep the stand with points (as built), or band only on busts (the `CS-ZCP-R26` fallback)?
- Q-R26-3 Infected profile close: accept the short collar shelf under the pitched chin (`review-E.png`), or the front-only band?

### Files changed (uncommitted)

- `src/painted/zcpaint/body6.ts`: costume (`Costume`, `costumeOf`, `trouserLeg`, `collarStand`, `collarSide`, `collarSeat`, `placket`, `cuffLine`, `strokes`, `foldTone`), cloth and collar flags on `Part`, `figFront`, `figSide`, `figSlack` (sleeves, trousers), `figSeatFloor`, `figSeatSofa`, `washPaint(ctx, base, {cloth, tex, scale})`, `drawFig(…, {tex})`, `clothTones`.
- `src/painted/zcpaint/bust.ts`: rewritten for the costume, the collar stand, the shorter neck, `ArmPose.depth`, and the new `placeClose`, `waistCutHeads`, `visibleNeckHU`.
- New: `src/painted/spike/ZcR26Sheet.tsx`, `src/painted/spike/zcpaint-r26-index.ts`, `scripts/zombie-condo-paint/r26-sheet.sh`, `tests/zcpaint-costume.test.ts`, `docs/dev-findings/DF-20261030-zcpaint-collar-neck-close.md`.
- Edited: `docs/dev-findings.md` (index row), `docs/dev-findings/DF-20261030-worktree-node-modules.md` (revalidation), this file.
- Outputs (not committed): `out/painted/zcpaint/r26/`, `out/logs/r26-*`, `out/qa/zcp-r26/`.

## 2026-10-30 — Boss pass 12 G1 (R2.6 plates)

- Scope: brief `VB-ZCPAINT-SHORT-R2.6` (`CS-ZCP-R26`, `TX-ZCP-CLOTH`, `FR-ZCP-CLOSE`, acceptance `B6`–`B11`), sheets `ZCPAINT-SHORT-SS-R1.4`, **group G1 of 5**: `ZCP-B01-SH01`, `ZCP-B01-SH02`, `ZCP-B02-SH03`, `ZCP-B06-SH02`, `ZCP-B07-SH01`. Each shot has one plate ID (the TH and EN keys share it; no `-TH`/`-EN` plate). User decisions in force: model sheet approved (`Q-R26-1`), collar stand with points on busts (`Q-R26-2`), infected busts front view only (`Q-R26-3`), `Q-ZCP-15` B (trash bag below the frame). Worktree `usage-check-agent-tuning-16bd9b` at `541385d`, uncommitted, not pushed, not committed; `delivery.md` not edited.
- Start state: pass 11 source (`body6.ts`, `bust.ts`) as it was; the five closes still at pass 10 sizes (B01-SH01 head 280 px, B01-SH02 K 220, B02-SH03 322 px, B06-SH02 250 px, B07-SH01 260 px) and no cloth texture on any plate.
- Environment: unchanged from pass 11 (untracked `node_modules` symlink to the sibling `world-frog-main-6920cb/node_modules`; never committed).

### Status by item (stable IDs)

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| P12-1 | Waist-cut placement on the five closes through the shared `placeClose` (head px, chin row, `waistCutHeads`) | built (plate pass; look check pending) | table *Measurements*; `tests/zcpaint-costume.test.ts` "waist-cut closes (G1, R1.4)" |
| P12-2 | Shared fix: `placeClose` pitches the chin with `head.tilt` (as `visibleNeckHU` does), so a tilted head lands its chin on the row | built | same test (pitched chin 860); B01-SH02 silhouette |
| P12-3 | `TX-ZCP-CLOTH` on the five plates: `drawFig(…, {tex: TEX_B})` on the cloth parts only; the B01-SH02 silhouette (`sil`) stays flat | built | `out/painted/zcpaint/g1/crops-4shots-540.png`, `crop-B02-SH03-f60-collar.png` |
| P12-4 | R1.4 camera pivots: B02-SH03 about (515, 690); B07-SH01 about (560, 430) (`shots/zcpaint.tsx`); B01-SH01, B01-SH02, B06-SH02 unchanged (already the sheet values) | built | `shots/zcpaint.tsx` |
| P12-5 | R1.4 sets: B02-SH03 door to y 1455, cabinet top 1455 (spans the frame, lip at the edges); B06-SH02 fridge x 400–960, interior x 450–920, y 280–860, handle x 400–412; B07-SH01 case x 30–400, y 830–1030 on the shelf edge y 1030, clasp at (384, 921) | built | plate frames |
| P12-6 | `Q-ZCP-15` B: trash bag below the frame (`bagPart` top at plate y 2548) | built | pixel count: 0 bag-coloured px in B01-SH01 f0 and f104, 1 px (tolerance 2) at f36 |
| P12-7 | `B9` adjacent-frame texture on a textured close (B02-SH03 f60 / f61) | pass with limits (see *Checks*) | `out/qa/zcp-g1/tools/box-diff.py` output in *Checks*; `out/painted/zcpaint/g1/B02-SH03_diff-tile-540.png` |
| P12-8 | `B11` determinism: same-plate re-render | B02-SH03 f60 identical; B01-SH01 f36 within the residual class (max 8 levels, 24 px over 3) | `out/painted/zcpaint/g1/det/`; `DF-20261030-zcpaint-figure-texture-residual` |
| P12-9 | `B8` closes: cut 3.0–3.6, faces above y 1040, visible neck ≤ 0.10, collar reads as a stand with points | measured; crop viewed (B02-SH03); look check pending | *Measurements* |
| P12-10 | Caption band 1060–1248 (`caption-zone.py`, information only) | measured; default thresholds do not apply to outline captions | `out/logs/g1-caption-zone-plates.json` |

### Measurements (plate px at scale 1; `out/logs/g1-measure-2.log` from `out/qa/zcp-g1/tools/g1-measure2.ts`; rendered frames for B9/B11)

- Art top = highest artwork point incl. hair tufts (the lead measure); skull crown = crown without tufts (the sheets' "head top y"). Lead = 1920 − art top.

| Shot (plate) | Head px | Chin y | Skull crown y | Art top y | Lead px (≥ 480) | Cut heads (3.0–3.6) | Visible neck HU (≤ 0.10) | Camera end |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B01-SH01 back, pf 0 | 600 | 1000 | 400 | 323 | 1597 | 3.47 | 0.049 (nape) | pf 29 centre (260, 690), s 1.035: chin 1000.5, lead 1620, cut 3.47 |
| B01-SH02 silhouette, pf 0–7 | 600 | 860 (pitched, rotated) | 279 | 204 | 1716 | 3.23 | 0.029 | — |
| B01-SH02 rage front, pf 23–33 | 600 | 860 | 260 | 183 | 1737 | 3.23 | 0.090 | — |
| B01-SH02 charge, pf 47 | 672 (×1.12) | 896 pre-push, 902.8 after 1.02 | 217 | 130 | 1790 | 3.49 | 0.090 | see D-G1-2 |
| B02-SH03 front, pf 0 | 587 | 1002 (heave 991–1013) | 415 | 340 | 1580 | 3.44 (3.42–3.46) | 0.090 | pf 83, s 1.02: chin 1008.3, lead 1587, cut 3.45 |
| B06-SH02 back, pf 0 | 560 | 900 | 340 | 268 | 1652 | 3.18 | 0.049 (nape) | pf 62, s 1.01: chin 903.4, lead 1654 |
| B07-SH01 profile, pf 0 | 600 | 760 | 160 | 83 | 1837 | 3.07 | 0.054 | pf 140, s 1.02: chin 766.6, lead 1844 |

- Sheet agreement: the skull crowns match the R1.4 head boxes (B01-SH01 y 400, B02-SH03 y 415, B06-SH02 y 340); the chins are the R1.4 values.
- Collar and neck: the visible bare neck on the front busts is 0.09 head (B02-SH03, B01-SH02 rage); the collar stand with points reads as a stand at full resolution (B02-SH03 crop, neck band about 0.07 head by eye).

### Deviations (for Film and Mark to revalidate)

- D-G1-1 B07-SH01 eye: R1.4 gives the eye at (560, 430) and the chin at 760 with a 600 px head; the profile geometry (eye 0.72 K in front of the head centre, 0.05 K below it) puts the eye at (560, 451). The explicit chin (760) is kept; the push pivot stays (560, 430) as the sheet says.
- D-G1-2 B01-SH02 charge: the chin is 896 before the 1.02 push (the sheet's ≤ 900 holds for the charge itself) and 902.8 after it. Not moved; Mark to decide if the push should not be included in the ≤ 900 line.
- D-G1-3 B01-SH02 pf 0–23: the turn starts from a texture-free profile silhouette of the infected bust (`MK-ZCP-F8`, no features, no collar read). Q-R26-3 asked for front-only infected busts; see the question below.
- D-G1-4 B02-SH03 cabinet: the R1.4 sheet gives the top edge (y 1455) only. The cabinet spans the frame (x −100 → 1200) so its lip shows beside the shoulders (torso covers x 15–1015); knobs at y 1600 sit behind the torso.
- D-G1-5 B06-SH02 fridge: the R1.4 interior (x 450–920, y 280–860) and body (x 400–960) are used; the body continues below y 860 as the lower door (the sheet's caption sits over it); the device overlay strip (x 420–880, y 300–420) is an Editor overlay, not painted in the plate.
- D-G1-6 B07-SH01 hand: the rest point is the hanging near wrist from the figure's anchors (below the frame), so the arm enters from the bottom edge; the sheet gives no rest coordinates.
- D-G1-7 Stale sheet lines: `ZC-CAPSHADE band 0.62` still appears in the B02-SH03, B06-SH02 and B07-SH01 captions of `ZCPAINT-SHORT-SS-R1.4`. The user dropped the caption shade in pass 8; no shade is painted here. Mark to revalidate those lines.
- D-G1-8 Visual note for Film (look, not a deviation): at the charge scale (B01-SH02 c47) the infected's dried-blood collar band reads as a flat disc above the shoulders, with no points.

### Checks

- `npx tsc --noEmit`: 0 errors (`out/logs/g1-tsc-2.log`).
- `npx eslint src tests`: 0 problems (`out/logs/g1-eslint-full.log`).
- `npm test`: 143 of 143 (142 + the new G1 test) (`out/logs/g1-npmtest-1.log`); costume file 7 of 7 (`out/logs/g1-costume-test.log`).
- WORLD FOG 21-frame identity (`scripts/zombie-condo-paint/render-frames.sh src/painted/spike/index.ts out/qa/zcp-g1/wfog …`): **21 of 21 identical** to the pass 11 final baseline `out/qa/zcp-r26/wfog-final/md5.txt` (empty diff in `out/logs/g1-wfog-vs-r26final.log`).
- `B9` (B02-SH03 f60 against f61, the textured overshirt and tee): inside two flat cloth boxes (x 110–300, y 1420–1800 and x 600–700, y 1420–1800) the largest change is 19 levels with 478 px over 3 levels of 72 200 px in the first box; the same-frame control is 0. The difference image (`out/painted/zcpaint/g1/B02-SH03_diff-tile-540.png`) shows changes on outlines and the silhouette edge only, no speckle inside the glaze or outside the silhouette. The f60 against f62 pair changes more (max 39), which fits camera resampling (the push is still moving), not a re-seeded glaze. This is indirect: no fixed-camera render was available, so the claim is "no reseed seen", not bit-exact stability.
- `B11`: B02-SH03 f60 re-rendered from the same bundle is identical; B01-SH01 f36 differs by max 8 levels in 24 px over 3 (inside `DF-20261030-zcpaint-figure-texture-residual`).
- Frames viewed through `scripts/qa-sheet.sh`: `out/painted/zcpaint/g1/first-look-270.png` (five shots), `B07-SH01-f0-f40-270.png` (rest, clasp, stop, withdrawn). Full-resolution crops: `out/painted/zcpaint/g1/crop-B02-SH03-f60-collar-540.png`, `out/painted/zcpaint/g1/crops-4shots-540.png`.
- Caption band (`scripts/caption-zone.py --band 1060:1248`, information only): B01-SH01 f36 mean 0.311 / p95 0.608; B01-SH02 f23 0.484 / 0.600; B02-SH03 f60 0.518 / 0.807; B06-SH02 f24 0.369 / 0.894; B07-SH01 f48 0.426 / 0.768. The default thresholds (mean ≤ 0.25, p95 ≤ 0.40) fail on cream backgrounds for all five; they were set for the shaded ZCONDO captions, and outline captions carry the legibility here (user, pass 8).
- Labelled user sheet: `out/qa/zcp-g1/G1-R26-plates-sheet.png` (HTML source `G1-R26-plates-sheet.html`), six 540 px tiles (five outline-caption checks at the sheet's Thai lines, plus B01-SH02 c47 charge) and the measured legend.
- Not run: Studio, seek parity (cold load, unordered seeks), the Editor timeline and boundary neighbours, the other 19 shots, Long composition (none selected).

### Scripting and tool lessons (this pass)

- zsh does not split an unquoted `$spec` in a `for` loop (the caption-still loop failed with an empty plate ID; literal arguments worked). Repeat of the pass 11 lesson.
- This environment's ffmpeg has no `drawtext` (no text filter; ImageMagick and PIL are absent). Labelled sheets were built as HTML and screenshot with Google Chrome headless: recorded as `DF-20261030-zcpaint-qa-label-sheet`. The grid needed a window wider than its tiles (1704 px for three 540 px tiles plus gaps) and a height of about 2880 px for the legend.
- The geometry measure (`placeClose` plus `topPx`/`skullTopPx`, run with `node --import tsx`) and the ink-free box diff are repeated per group now; script them as repo tools before G2 (`scripts/zombie-condo-paint/`). Copies: `out/qa/zcp-g1/tools/`.
- `placeClose` ignored head pitch before this pass: a pitched chin would have landed about 20 px off the row on a tilted profile (fixed, shared).

### Proposed document changes (TL/DP; not applied)

1. `docs/boss-asset-workflow.md` QA step 5 (adjacent frames): use ink-free boxes and a same-frame re-render control; the outline boil is not a clean two-frame cycle here (f60/f62 differ more than f60/f61).
2. `storyboards/zombie-condo-paint/short/sc01-b01-b03.md`, `sc01-b06-b08.md` (Mark): drop the `ZC-CAPSHADE band 0.62` lines (pass 8 decision, D-G1-7); record the B07 eye (D-G1-1) and the B01-SH02 charge push (D-G1-2).
3. `scripts/caption-zone.py`: its default thresholds assume a shaded caption; outline captions need their own thresholds or an information-only flag.

### Questions for the user (relay through the coordinator; not asked here)

- Q-G1-1 (B01-SH02 turn): the first 23 frames are a profile silhouette of the infected bust (`MK-ZCP-F8`), which is texture-free and has no features. Your pass 11 answer (`Q-R26-3`) asked for front-only infected busts. Keep the silhouette start, or start the turn from a front silhouette? The second option changes the reveal, so Film must agree first.

### Files changed (uncommitted)

- `src/painted/zcpaint/bust.ts`: `placeClose` pitches the chin with `head.tilt`.
- `src/painted/zcpaint/corridor.ts`: B01-SH01 back bust (waist cut, bag below frame, texture); B01-SH02 silhouette and rage front (chin row 860, texture on the front).
- `src/painted/zcpaint/closeups.ts`: B02-SH03 (chin row 1002, heave ±11, cabinet and door to 1455, texture); B07-SH01 (chin 760, case and shelf, clasp, stop +40, rest from anchors, texture). `placeHead` stays exported for the spike.
- `src/painted/zcpaint/fridge.ts`: B06-SH02 (back bust chin 900, fridge geometry, handle, texture).
- `src/painted/shots/zcpaint.tsx`: B02-SH03 and B07-SH01 camera pivots.
- `tests/zcpaint-costume.test.ts`: one new test (G1 closes and pitched chin).
- `scripts/zombie-condo-paint/build-notes.md` (this section); `docs/dev-findings.md` and the DF entries (see below).
- Outputs (not committed): `out/painted/zcpaint/g1/`, `out/qa/zcp-g1/`, `out/logs/g1-*`.

## 2026-10-30 — Boss pass 12 G1 fixes (look check of the R2.6 plates)

- Scope: the top entry of `delivery.md` "Boss pass 12 G1 look check" (binding): fixes 1–3 on B01-SH02 and B06-SH02; B01-SH01, B02-SH03 and B07-SH01 kept. Uncommitted in worktree `usage-check-agent-tuning-16bd9b`; `delivery.md` not edited; nothing committed or pushed.
- Start state: pass 12 G1 code as reviewed (files at 14:59–15:00; sheet at 15:10); before frames rendered from it in `out/painted/zcpaint/g1fix/before/`.

### Status by item (stable IDs)

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| G12-1 | B01-SH02 silhouette (pf 0–22): no black bar across the face, no spike, shaped hair mass, profile kept (Q-G1-1 “เงาข้างเดิม”) | built (look check pending) | `corridor.ts` `hairSweep` (BOB_SIDE `silHair` rotated about the crown, 0 → 1.2 rad, pf 19–23; the rectangle wash removed); `bust.ts` profile band back edge at x 0.12; frames c7, c19, c21 |
| G12-2 | B01-SH02 rage front and charge: no grey box neck, blood not a flat disc, collar and neck as the approved model sheet | built (look check pending) | `bust.ts` standing infected neck = taper (jaw 0.26 → band 0.38, cel 0.07; YOU unchanged); `body6.ts` `torsoMarks` blood = streak with one drip on the band's lower edge; frames c23, c33, c47 |
| G12-3 | B06-SH02 fridge arm: elbow bent like a person, not round the neck; hand at mitten scale (BODY-ZCP-6H); held box clear | built (look check pending); pose switches pf 6 and pf 41 unverified | `fridge.ts` (his left door hand = `R` with `depth: 'behind'`; his right box hand = `L`, `lowBend`; box on the bottom shelf; crisp box); `bust.ts` `ArmPose.across`; `body6.ts` `Hand.across` (opt-in, mitten one hull); frames f0, f6, f24, f41 |
| G12-4 | B01-SH01, B02-SH03, B07-SH01 unchanged | verified by pixel diff (see *Checks*) | decoded-RGB diff against the pass 12 frames |

### Root causes (for the record; DF `DF-20261030-zcpaint-back-view-arm-sides`)

- B06 door arm: in a back view the bust's `L` is screen-left = his RIGHT arm. Pass 10 put his left (door) hand on `L`, so it crossed the back of the neck. Fixed by the sheet's own sides (left door, right box).
- B06 box arm at head height: the shoulder-to-box distance (1.07 heads) against a 1.78-head arm solves the elbow onto the neck. Fixed by the lower elbow and a bottom-shelf box (plate y 800) instead of y 640.
- Mitten: the shared mitten is 0.52 long and 0.37 across including the wrist cap (`handParts`, measured with `node --import tsx`); BODY-ZCP-6H says 0.40 × 0.26. Added opt-in `across` (default 1); B06 uses 0.7 with one merged hull.
- B01 spike: `profile()` infected collar band had its back edge at x −0.28, 0.41 head behind the neck's back edge (x 0.13). The sliver was the spike in the silhouette. Now x 0.12.
- B01 bar: the pass 12 flat wash at pf 19–23 read as a censor bar. Replaced by the 7b bob mass (`BOB_SIDE`), rotated about the crown, in the hair tone at 0.9.
- B01 disc: `torsoMarks` blood was an ellipse (0.12 × 0.05 head). Now a streak with a drip.
- B01 grey box neck: the infected neck was a straight `tub` with `far` (whole cel tone). Now a taper from the jaw to the band (infected only).

### Measurements (`out/logs/g1fix-measure.log`, g1-measure2; unchanged by these fixes)

- B01-SH02 pf0 silhouette: head 600 px, chin 840.3 (pitched), lead 1716 px, visible neck 0.03 HU, cut 3.20.
- B01-SH02 pf23 rage: lead 1737 px, visible neck 0.09 HU, cut 3.23.
- B01-SH02 pf47 charge: lead 1790 px, visible neck 0.09 HU, cut 3.49 (chin 902.8 after the 1.02 push, D-G1-2 unchanged).
- B06-SH02 pf0 back: head 560 px, chin 900, lead 1652 px, visible neck 0.049 HU (nape), cut 3.18; pf62: lead 1654 px.
- The lead and the visible neck are set by the head top and the collar top, which these fixes do not move. The neck taper and the mitten width were judged at 540 px, not measured.

### Deviations (for Film and Mark to revalidate)

- D-G12-1 B06-SH02 sides: his left hand (door) is on the screen-right side and his right hand (box) on the screen-left side (back view). SS-R1.4 names the hands, not the screen sides; Mark should name them with the anatomy.
- D-G12-2 B06-SH02 staging: the box sits on the bottom shelf (plate y 800; was y 640 at head height) and the door handle on the lower door (plate y 930; was y 600). Reason: a head-height cross-body reach puts the elbow on the neck. The sheet's "over his shoulder line into the interior" still holds (the hand is above the shoulder line, inside the interior).
- D-G12-3 R2.6 model sheet page E (infected profile): the collar band no longer protrudes behind the neck (the spike is gone). The model sheet image is not regenerated.
- D-G12-4 B01-SH02 pf 21: the rotated bob mass overhangs the crown for about one frame (transitional, pf 19–22). Look check: keep, or fade instead.
- D-G12-5 B06-SH02 pose switches: the box arm changes from hang to reach at pf 6 and the door arm from reach to hang at pf 41 (not interpolated; the same switches existed in pass 12). Mark names the switch frames (CP-P06).

### Checks

- `npx tsc --noEmit`: exit 0 (`out/logs/g1fix-tsc.log`). `npx eslint src tests`: exit 0 (`out/logs/g1fix-eslint.log`). `npm test`: 143 pass, 0 fail of 143 (`out/logs/g1fix-npmtest.log`).
- WORLD FOG 21-frame identity: `scripts/zombie-condo-paint/render-frames.sh src/painted/spike/index.ts out/qa/zcp-g1fix/wfog …`; `diff` against `out/qa/zcp-r26/wfog-final/md5.txt` is empty (exit 0, `out/logs/g1fix-wfog-vs-r26final.log`).
- Unchanged shots (decoded RGB, `rgb-diff.py`, against the pass 12 G1 frames in `out/painted/zcpaint/g1/`): B02-SH03 f0 and f60 identical. B01-SH01 f0 differs by 283 px (max 6 levels), f36 by 516 px (max 4). B07-SH01 f0 by 3 px (max 1), f40 by 12 px (max 3). A same-code re-render of B01-SH01 f0 (`out/painted/zcpaint/g1fix/after2/`) differs from the first after render by 314 px (max 6): these are the render-run noise class (`DF-20261030-render-run-noise`, `DF-20261030-zcpaint-figure-texture-residual`). The changed code paths are not used by B01-SH01 (YOU back, infected figSlack) or B07-SH01 (YOU profile): the infected branches and the `across` option are the only edits.
- Frames viewed through `scripts/qa-sheet.sh`: `out/qa/zcp-g1-fix/qa-B01-SH02-before-270.png`, `qa-B01-SH02-after-270.png`, `qa-B06-SH02-before-540.png`, `qa-B06-SH02-after-270.png`. Labelled user sheet (540 px tiles, Chrome headless from `G1-fix-B01-B06-sheet.html`): `out/qa/zcp-g1-fix/G1-fix-B01-B06-sheet.png`.
- Not run: Studio, seek parity (cold load, unordered seeks), neighbour boundaries (B01-SH01 → B01-SH02 → B02-SH01; B06-SH02 → B06-SH03), the other 19 shots, Long composition (none selected).

### Scripting and tool lessons (this pass)

- The background `plate-stills.sh` run reported completion before its stills existed (the `echo` marker was not written). Check the output files, not the notification, before reading them.
- `timeout` is not on this macOS shell; use the tool's own timeout.
- Remaining chrome headless processes from another worktree (`wordfog-post-merge-main-959703`) are running; left alone (not this session's).

### Proposed document changes (TL/DP; not applied)

1. `storyboards/zombie-condo-paint/short/sc01-b06-b08.md` (Mark): name the screen side of each back-view hand, and the reach target height.
2. `docs/character-proportion-principles.md` CP-P02 / CP-P01: add a cross-body reach row (target at head height forces the elbow to the neck; move the target or use a low elbow).
3. `docs/boss-asset-workflow.md` QA step 5: the pose-switch frames (F−1/F/F+1) for hang↔reach switches.

### Questions for the user (relay through the coordinator; not asked here)

- Q-G12-1: B06-SH02 box on the bottom shelf and the handle on the lower door (D-G12-2): accept?
- Q-G12-2: B01-SH02 turn (pf 19–22): keep the rotating bob mass (overhang at pf 21, D-G12-4), or fade the hair in instead?

### Files changed (uncommitted, this pass)

- `src/painted/zcpaint/corridor.ts`: `hairSweep`; the bar wash removed; the silhouette placement held for the sweep.
- `src/painted/zcpaint/bust.ts`: `ArmPose.across`; the standing hand carries `across`; the infected neck taper; the profile band back edge.
- `src/painted/zcpaint/body6.ts`: `Hand.across` and the one-hull mitten; `torsoMarks` blood streak.
- `src/painted/zcpaint/fridge.ts`: sides, depth, lower bend, box drawn in plate px, handle and box positions.
- `docs/dev-findings/DF-20261030-zcpaint-back-view-arm-sides.md` (new), `docs/dev-findings.md` (index row), `docs/dev-findings/DF-20261030-zcpaint-collar-neck-close.md` (revalidation line).
- Outputs (not committed): `out/painted/zcpaint/g1fix/`, `out/qa/zcp-g1-fix/`, `out/qa/zcp-g1fix/wfog/`, `out/logs/g1fix-*`.

## 2026-10-30 — Boss pass 13 G2 (R2.6 plates, group G2): checkpoint

- Scope: brief `VB-ZCPAINT-SHORT-R2.6` (`CS-ZCP-R26`, `TX-ZCP-CLOTH`, `BODY-ZCP-6H`, `VD-ZCP-HANDS`), sheets `ZCPAINT-SHORT-SS-R1.4`, group **G2** of 5: `ZCP-B04-SH01` (shared TH/EN), `ZCP-B05-SH01-TH`/`-EN`, `ZCP-B06-SH01`, `ZCP-B07-SH02`; plus the two G1 leftovers from `delivery.md` "Boss pass 12 G1 fixes look check": B01-SH02 charge neck and collar (`Q-G1-…` item), B01-SH02 turn hair (`Q-G12-2`). User binding (G2 message): no caption shade, cloth texture on cloth only, sets clean, CP-P arm depth, elbows bend like a person (never across the neck), mitten size per `BODY-ZCP-6H`, B07-SH02 bread in both sleeved mitten hands.
- **Status: checkpoint at the AI09 turn cap, not a look-check pass.** Code is in and gated (results below); the look check of G2 and the B01-SH02 charge neck are open. Uncommitted; `delivery.md` not edited; Film's spike files (`ZcSpk07*`) not touched; B06-SH02 staging (`fridge.ts`) not touched.
- Start state: pass 12 G1 fixes (`out/qa/zcp-g2/before/` = plate renders of that state; `out/qa/zcp-g1fix/after/` for the guard shots).

### Status by item (stable IDs)

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| G2-1 | Costume `CS-ZCP-R26` on B04-SH01, B05-SH01, B06-SH01, B07-SH02; no bare forearm, knee or shin | built (costume unchanged); bare-skin test now includes the four G2 variants | `tests/zcpaint-costume.test.ts` "costume: bare skin …" (10 of 10 in `out/logs/g2-costume-test-1.log`) |
| G2-2 | `TX-ZCP-CLOTH` on cloth parts of the four plates (`truck()` frame and the B05 figure); sets, bucket and bread flat | built | `out/qa/zcp-g2/after1/ZCP-B06-SH01_f150.png`, `cmp-b07-f60-2.png` (hatch on overshirt and trousers only) |
| G2-3 | Mitten `BODY-ZCP-6H` (0.26 across × 0.40 long), opt-in `MITTEN_6H` (`across` 0.7, `along` 0.84); shared default unchanged | built; measured **0.399 × 0.259** (default 0.514 × 0.370) | `scripts/zombie-condo-paint/g-measure.ts` (`mitten` rows) |
| G2-4 | CP-P arm depth: B05 bucket lift stays CP-P02 (upper arm behind, forearm and mitten in front); B04 walk CP-P03 unchanged | built; sheet names CP-P05 for the bucket, see Q-G2-2 | `bathroom.ts`, `body6.ts` `figFront` |
| G2-5 | B06-SH01 right hand hovers 5 cm short of the fridge handle (grip (1.13, 3.56) head units, sheet screen (517, 851)), rises pf 100–110, withdraws pf 177–190. **Not in pass 10 or 12**: `figSide` had no reach, so the sheet's right-hand row was unbuilt | built as opt-in `figSide` `hover` (far arm, IK elbow the lower solution); pose switches not frame-checked | `out/qa/zcp-g2/after1/ZCP-B06-SH01_f150.png`; crop `cmp-b06-f150.png` |
| G2-6 | B07-SH02 bread in both sleeved mitten hands: far sleeve to the bread (opt-in `figSeatSofa` `hold: 'bread'`), loaf between the mittens; far target lowered to (0.60, 2.78) after the first look | built; frame check after the move | `out/qa/zcp-g2/after2/ZCP-B07-SH02_f60.png`, `cmp-b07-f60-2.png` |
| G2-7 | B07 sofa reads as a thin chair: the back and seat are edge-on in the section (sheet geometry, stand-in) | **not changed**; user question Q-G2-1 | `cmp-b07-f60-2.png` |
| G2-8 | B01-SH02 charge: infected neck returns to the page E straight tube (`bust.ts`; the pass 12 taper removed) and the tube is non-far for the infected (the far cel tone read as a grey box at 1:1) | **open**: neck is pale in the centre with cel side bands; the band still reads as a wide flat ring at charge scale. Not accepted against review-E | `out/qa/zcp-g2/after2/ZCP-B01-SH02_f47.png`, `cmp-b01-f47-neck2.png`; DF `DF-20261030-zcpaint-g2-far-tube-neck` |
| G2-9 | B01-SH02 turn pf 19–22: hair fades in place (`hairFade`, alpha 0 → 0.9 over pf 19–22, no rotation) instead of the rotating `silHair` (`hairSweep`) | built; frames rendered (pf 19–23), not yet viewed | `out/qa/zcp-g2/after1/ZCP-B01-SH02_f19.png` … `_f23.png` |

### Measurements (`scripts/zombie-condo-paint/g-measure.ts`; `out/logs/g2-measure-1.log`, mitten rerun after `along` 0.84)

- Section lead (full figure top to floor, projected at the sheet's scale): B04-SH01 586 px (sheet 574), B06-SH01 586 px (574), B07-SH02 seated 595 px (594), B05-SH01 bucket lift 1,140 px (1,120). All ≥ 480 px.
- Close visible neck (HU, `visibleNeckHU`): B01-SH02 charge 0.09, rage 0.09, silhouette 0.03; B01-SH01, B02-SH03, B06-SH02, B07-SH01 unchanged (`g-measure.ts` rows).
- Lead heights and neck values are geometry, not frame measures; the frame check is the QA sheet below.

### Checks (gate batch, `out/logs/g2-gate-summary.log`)

- `npx tsc --noEmit`, `npx eslint src tests`, `npm test` (`out/logs/g2-tsc-2.log`, `g2-eslint-1.log`, `g2-npmtest-1.log`); the costume file on its own passed 10 of 10 (`out/logs/g2-costume-test-1.log`).
- WORLD FOG 21-frame identity (`render-frames.sh src/painted/spike/index.ts out/qa/zcp-g2/wfog …`) against `out/qa/zcp-r26/wfog-final/md5.txt` (`out/logs/g2-wfog-vs-r26final.log`). Shared `body6.ts` changed, so this check is required (see the pass 11 lesson).
- Guard shots (decoded RGB against the pass 12 G1 fixes frames, `out/qa/zcp-g2/guard/`): B01-SH01 f0/f36, B02-SH03 f0/f60, B07-SH01 f0/f40 (G1 passed) and B06-SH02 f0/f24/f41 (staging frozen by Film's spike rule). Results in the summary log.
- Not run: Studio and seek parity, neighbour boundaries (B04 → B05, B05 → B06, B06 → B07, B07 → B08, B01-SH01 → B01-SH02), the Editor timeline, the other 16 plates, the 540 px labelled sheet (only the G2 crops above were viewed through `qa-sheet.sh`).

### Deviations (for Film and Mark to revalidate)

- D-G2-1 B06-SH01 hover is the far arm (his right, facing the fridge). In profile the upper arm sits behind the torso, so the visible forearm reads close to straight; the elbow is the lower IK solution (inside the torso edge), not across the neck.
- D-G2-2 B05-SH01 bucket: CP-P02 (elbows back, mittens at the belly) is kept because a lift to chest height needs bent arms. The sheet's "hang straight (CP-P05)" line conflicts; Mark to choose (Q-G2-2).
- D-G2-3 B07-SH02 bread is a flat cel loaf (0.52 head long, 0.22 tall) at (0.58, 2.97); the far mitten is lower (0.60, 2.78) so both hands read. The sheet's "unwrap and bite pf 51/45" is not built in this pass.
- D-G2-4 G2 mitten size is opt-in (`MITTEN_6H`); the shared default still measures 0.514 × 0.370. The B06-SH02 `across` 0.7 path is unchanged (`along` defaults to 1).

### Scripting and tool lessons (this pass)

- The close and section measures are now the repo tool `scripts/zombie-condo-paint/g-measure.ts` (`node --import tsx`), replacing the G1 copy in `out/qa/zcp-g1/tools/`.
- The bare-skin test (`figures()`) now takes the G2 variants, so a new opt-in pose is covered by B6 without a new test.
- A `far: true` tube takes the cel tone for its whole length; on a bust that reads as a grey box (B01-SH02 charge). Use `far: false` for a neck that must stay skin-toned.

### Proposed document changes (TL/DP; not applied)

1. `storyboards/zombie-condo-paint/short/sc01-b04-b05.md` (Mark): the B05-SH01 bucket row says "bucket-carrying arms hang straight (CP-P05)" while the lift is at chest height; name the CP row (Q-G2-2).
2. `storyboards/zombie-condo-paint/short/sc01-b06-b08.md` (Mark): name the B06-SH01 hover arm as his right (far) arm, and the CP-P06 switch frames at pf 100 and pf 177.
3. `docs/character-proportion-principles.md` (CP-P): a profile reach to a front target (fridge handle) has no front-view depth rule; say so.

### Questions for the user (relay through the coordinator)

- Q-G2-1 B07-SH02 sofa: the sofa reads as a thin chair (the section geometry of the sheet). Keep the stand-in and accept the chair read, or ask Film/Boss to build a fuller sofa (seat cushion, back cushion, arm) in this pass?
- Q-G2-2 B05-SH01 bucket: keep the lift (bent arms, elbows behind, bucket at the belly, as built), or straight hanging arms with the bucket low (the sheet's CP-P05 line; the bucket then sits in the caption band)?
- Q-G2-3 B06-SH01 hover: accept the far-arm reach (forearm straight-looking in profile), or use the near arm for the hover?
- Q-G2-4 B01-SH02 charge neck: pale centre with cel side bands (as now), or plain skin tone with no side bands (page E read at a small scale)?

### Files changed (uncommitted)

- `src/painted/zcpaint/body6.ts`: `MittenSize`, `MITTEN_6H`, `Hand.along`, `handParts` (`along`), `figFront` (`mitten`), `figSide` (`mitten`, `hover`), `lowElbow`, `SeatOpts` (`mitten`, `hold`), `breadPart`, the far sleeve of the bread hold.
- `src/painted/zcpaint/bust.ts`: infected neck is the page E tube (`far: !inf`), no taper.
- `src/painted/zcpaint/corridor.ts`: `hairSweep` → `hairFade` (in place, pf 19–22); `K6` import removed.
- `src/painted/zcpaint/bathroom.ts`: B05-SH01 mitten `MITTEN_6H` and `TEX_B` on the figure.
- `src/painted/shots/zcpaint.tsx`: `truck()` figures take `TEX_B`; B04 mitten; B06 hover (`b06HoverEase`, `B06_HOVER_GRIP`); B07 hold.
- `tests/zcpaint-costume.test.ts`: four G2 fixtures in `figures()`; three new tests (mitten size, bread hold, hover at blend 0).
- `scripts/zombie-condo-paint/g-measure.ts` (new, repo tool).
- `scripts/zombie-condo-paint/build-notes.md` (this section); `docs/dev-findings.md` index row and `docs/dev-findings/DF-20261030-zcpaint-g2-far-tube-neck.md` (new).
- Outputs (not committed): `out/qa/zcp-g2/{before,after1,after2,guard,wfog}/`, `out/logs/g2-*`.

### Gate results (addendum, pass 13 G2 checkpoint, `out/logs/g2-gate-summary.log`)

- `tsc --noEmit` exit 0 (`g2-tsc-2.log`); `eslint src tests` exit 0 (`g2-eslint-1.log`); `npm test` 146 of 146 pass, 0 fail (`g2-npmtest-1.log`).
- WORLD FOG 21-frame identity: **21 of 21 identical** to `out/qa/zcp-r26/wfog-final/md5.txt` (`g2-wfog-vs-r26final.log` empty diff).
- Guard shots against `out/painted/zcpaint/g1fix/after/` (decoded RGB, `out/qa/zcp-g2/guard/`): B02-SH03 f0 and f60 identical. B01-SH01 f0 339 px (max 6 levels), f36 538 px (max 8); B07-SH01 f0 3 px (max 1), f40 27 px (max 2); B06-SH02 f0 6 px (max 2), f24 8 px (max 1), f41 9 px (max 1). The deltas are in the render-run noise class (`DF-20261030-render-run-noise`); a same-code re-render was not run in this checkpoint, so the cause is not proven. The changed code paths are not used by B07-SH01 or B06-SH02 (B06-SH02 keeps `across` 0.7 with `along` unset). **Unverified:** B01-SH01 at 8 levels is inside the noise class but not bit-identical.
- Not viewed at 540 px in this checkpoint: B01-SH02 turn pf 19–23 (`after1`), B07-SH02 after the far-hand move (`after2/ZCP-B07-SH02_f60.png`, crop `cmp-b07-f60-2.png`). The labelled G2 contact sheet was not produced (turn cap). Studio and seek parity not run.

## 2026-10-30 — Film SPK-ZCP-07: B06-SH02 reach into the fridge (projected arm, R2.6 paint)

- Scope: `delivery.md` top entry, `Q-G12-1` (binding): research how a person reaches out to take something, and show it with a 3D-like perspective (foreshortening, overlap of upper arm / forearm / hand toward the shelf) in the same painted look. Boss's bottom-shelf staging (D-G12-2) was not accepted as the answer. Spike only: no production file edited (`src/painted/zcpaint/*` untouched, Boss works there in parallel); `delivery.md` not edited; nothing committed.
- Files (new, uncommitted): `src/painted/spike/ZcSpk07.ts`, `src/painted/spike/zcpaint-spk07-index.ts` (compositions `ZCPAINT-SPK07-A|B|C`, 63 f). Frames `out/painted/zcpaint/spk07/r7/` (f0, 8, 13, 24 per variant). Labelled user sheet (540 px tiles, Chrome headless): `out/qa/zcp-spk07/SPK-ZCP-07-sheet.png` (HTML next to it).

### Research (sources from knowledge, not re-fetched in this pass)

- Two components (Jeannerod 1984, *J. Motor Behavior* 16): the transport (arm carries the hand) and the grasp (the hand opens and turns to the object during the transport, max aperture at about 70 % of the movement); the hand arrives already oriented to the object. → the hand turns from palm-in (hanging) to palm-down-in over f7–14, before contact.
- Smooth bell-shaped speed, curved path (Flash & Hogan 1985, *J. Neurosci.* 5; Williams 2001, *The Animator's Survival Kit*, arcs; Thomas & Johnston 1981, *The Illusion of Life*). → minimum-jerk timing f6–15, the hand arcs out and up, never a straight slide.
- Shoulder leads (scapulohumeral rhythm, Inman et al. 1944; overlapping action, Williams): the scapula protracts and lifts first, the elbow opens, the wrist arrives last. Beyond about 90 % of arm length the trunk joins in (Kaminski, Bock & Gentile 1995, *Exp. Brain Res.* 106). → shoulder joint forward 0.2 head (A, C) / 0.35 (B, the longer reach); B is at 103 % of the arm (a lean is needed, see gaps).
- Elbow drop: a forward reach opens the elbow to the side and down; it does not hang under the shoulder and never rises toward the head. On the draw-back the elbow drops and comes back. → IK pole out-and-down, blending to down-and-back during the lift.
- Drawing foreshortening (Loomis 1943, *Figure Drawing for All It's Worth*; Hampton 2009, *Figure Drawing: Design and Invention*): overlap of near over far forms, taper with distance, cross-contour arcs (rings on the sleeve bowed toward the near end). → depth-ordered draw, radii × perspective scale, two fold rings on the sleeve.
- The other hand: on a right-hinged door with the handle on the left edge, the left hand pulls, lets the door swing, and the right hand reaches in. Seen from behind, the left hand works in front of his torso and is hidden.

### Findings

- F7-1 Back-view sides (Film; contradicts `DF-20261030-zcpaint-back-view-arm-sides` *Cause*): seen from behind, his RIGHT hand is on screen-right. The bust's back view reuses the front geometry with the viewer behind, so `R` (screen-right) is his right. The fridge interior is on his right, so the sheet's "right hand takes the box" is a same-side forward reach: no cross-body path, the elbow cannot reach the neck. The pass 12 "fix" made the box arm a cross-body arm, which is what forced the elbow toward the neck. SS-R1.4 also names the screen-right shoulder "left" ("left shoulder across x ≈−300–620"). Needs Boss revalidation of the DF and a Mark sheet correction.
- F7-2 Draw order: an arm that reaches forward goes away from the camera, so in a back view it is drawn BEFORE the torso (the back occludes the arm root, the hand appears over or beside the shoulder). Pass 10/12 drew reaching arms after the torso (`overArms`), which reads as an arm pasted on the back.
- F7-3 Reach geometry against the plate: at the sheet camera (F 1844, head 560 px → camera 0.93 m behind his head) the R1.4 fridge (interior 470 px wide) is about 2.2 m from the camera, 1.2 m in front of him: out of reach. A reachable fridge (front 0.38 m ahead of his shoulder plane, interior 0.51 m wide) draws much larger (interior ≈ x 330–960, y 150–1300 in A/B). The fridge plate must be redrawn in the same projection.
- F7-4 A hand that points into depth hides behind its own cuff (renders 1–4). The grasp turns the hand across the view (palm down on the box top, fingers toward his midline), and the sleeve stops at the cuff instead of a round cap past the wrist; then the mitten reads at 270 px.

### Projection contract PJ-ZCP-07 (spike; proposed for Mark/Boss/Editor)

- The back bust stays a flat card on his body plane z = 0 at the sheet placement (head 560 px, chin y 900, head x 135; unchanged). Everything in front of it is 3D in the bust's head units (x = his right = screen right, y up from the floor, z forward) and projected by one pinhole: s = D / (D + z), x′ = ax + (x − ax)·s, y′ = ay + (y − ay)·s. Sheet camera D 3.29 heads (0.93 m), axis (0.723, 5.607) heads = VP (540, 560). C: D 2.4, axis (1.15, 6.3).
- Draw order by depth: fridge interior → food → leftovers box → upper door → hand → forearm (+ rings) → upper arm (+ ring) → torso card → head.
- Limit: the card does not turn with the camera, so C's higher camera shows only in the fridge and arm (a true 3/4 back torso is not built).

### Variants (stable IDs; all: R2.6 costume, cel two tones, `TEX_B` cloth texture, sleeve to the wrist, mitten 0.40 × 0.25 head projected)

| ID | Camera | Box (bottom-centre, heads) | Read |
| --- | --- | --- | --- |
| SPK07-A | sheet | (0.75, 4.1, 2.0): shoulder-height shelf, front half | bent-elbow reach; hand appears over the right shoulder line (the sheet's wording) |
| SPK07-B | sheet | (1.1, 4.1, 2.15): same shelf, deeper and right | near-straight reach, the longest tapering diagonal; clearest depth read at contact |
| SPK07-C | 0.25 m closer, 0.2 m higher, further right | as A | stronger convergence, but depth reads as "up" on screen: at f24 the forearm stands upright (reads like a raised arm) |

Measured (`spk07Measure`, `node --import tsx`): f15 elbow plate (633, 1119) A, (643, 1042) B, (697, 957) C; the elbow's minimum x over f0–62 is 633 / 642 / 668 px, far right of the neck (x ≈ 40–230): it never crosses the neck. Wrist perspective scale at contact 0.63 / 0.62 / 0.56. Shoulder-to-wrist at contact 0.97 / 1.03 / 0.97 of the arm length (1.78).

### Recommendation (Film)

- SPK07-B geometry at the sheet camera: his right arm (screen right) reaches forward to the box on the shoulder-height shelf, drawn behind the torso, perspective taper and cross-contour rings, hand turned across the view on the box top. A is the fallback if the user prefers the box nearer (bent elbow). C is not recommended (the high camera turns the held forearm upright and needs a 3/4 torso that does not exist).
- Door hand: his left hand stays hidden in front of the torso; the door's swing (0→95° f0–6, shut f32–41) carries the open and the seal. This deviates from SS-R1.4 "left hand on the door edge" (visible).

### Feasibility for Boss (what goes into `bust.ts` / `body6.ts` / `fridge.ts`; not done here)

1. `bust.ts`: an opt-in arm pose `{kind: 'reach3'; to: V3; hand frame {F, N}; pole: V3}` plus a bust-level `proj?: {D; ax; ay}`; solve with a 3D two-bone IK with a pole (`ik3` in the spike), radii × s at each joint, upper arm and forearm as separate tubes (the elbow overlap), the forearm tube stopping one cuff radius short of the wrist. Back view with z > 0: push into `armBack` (before the torso); front view: `overArms`. Default arms unchanged.
2. `body6.ts`: a projected mitten (3D paddle 0.40 × 0.25 × 0.12 with the thumb lobe, projected and hulled; spike `mitten`) as an opt-in `Hand` variant; cross-contour ring strokes in `foldTone` (spike `ring`).
3. `fridge.ts`: redraw the fridge, shelves, food, box and the hinged door in PJ-ZCP-07 (spike `fridge`, `box3`, `leftovers`); the box rides with the hand from contact (f15–17) and comes 0.3 head back and 0.08 up by f24.
4. Sides: `R` = his right in the back view; revalidate DF `DF-20261030-zcpaint-back-view-arm-sides`.
5. Risks: one pose path (no hang↔reach switch: the spike interpolates from the hang at f6, which also removes D-G12-5); B at 103 % of the arm needs a small torso lean or the box 0.1 head nearer; caption zone and overlay strip to recheck against the bigger fridge (`scripts/caption-zone.py`).

### Sound

- No new sound. Move the packaging rustle onset from f6 to the contact (f15–17); the transport is silent. Seal pop f0 and seal thump f41 unchanged (`NEEDS-GEN` as in the sheet).

### Checks

- `npx tsc --noEmit` exit 0 (`out/logs/spk07-tsc.log`); `npx eslint` on the two spike files exit 0 (`out/logs/spk07-eslint.log`); `npm test` 146 pass, 0 fail (`out/logs/spk07-npmtest.log`, with Boss's parallel uncommitted changes in the tree).
- Frames viewed through `scripts/qa-sheet.sh` (270 px: `out/painted/zcpaint/spk07/r7/qa.png`; 540 px: `out/painted/zcpaint/spk07/qa-B15-A24-540.png`) and crops at contact. Not run: Studio, seek parity, caption-zone measure, the production plate.

### Material change (for the coordinator; Mark sheet owner, Boss DF owner)

- If the user picks B or A: SS-R1.4 B06-SH02 staging changes (fridge size and position under PJ-ZCP-07, box on the shoulder-height shelf, his right arm screen-right, left hand hidden). Brief note to `VB-ZCPAINT-SHORT-R2.6` through the coordinator; Mark revises the sheet row; Boss implements items 1–4.

## 2026-10-30 — Mark: sheets ZCPAINT-SHORT-SS-R1.5

- Scope: coordinator task; documentation only (`storyboards/zombie-condo-paint/short/index.md`, `sc01-*.md`; dated note in `visual-brief.md`). No code, `delivery.md` or commit.
- B06-SH02 restaged to Film `SPK-ZCP-07` variant B (`Q-SPK07-1`) under `PJ-ZCP-07`. Screen values recomputed from the spike's formula (plate px = (135 + 560·x′, 3700 − 560·y′), D 3.29, axis (0.723, 5.607)); one inline `python3 -I` calculation, not kept (it may be scripted if a second projected shot appears). Box moved 0.1 head nearer than spike B (z 2.05) so the wrist reaches without a torso lean; Boss item `MK-ZCP-B5`.
- Deviations decided: `D-G1-1` accepted (B07-SH01 eye (560, 451), pivot kept); `D-G1-2` accepted (B01-SH02 face line ≤ y 905 with the 1.02 push). B06-SH01 CP-P06 switch reach → hang at pf 190 (end of the withdraw), not Boss's proposed pf 177.
- For Boss: `DF-20261030-zcpaint-back-view-arm-sides` *Cause* (back-view screen-left = his right) conflicts with Film `F7-1` and with B01-SH01 (his right arm at screen right); revalidate when building `MK-ZCP-B5`.
- Not done: no production frame of the new B06-SH02 exists; caption-zone at f 15 / f 24 is Boss's check (box bottom edge y ≈1101 may sit behind the caption block).

## 2026-10-30 — Boss pass 14 (B06-SH02 reach, Film SPK-ZCP-07 variant B): Task A checkpoint

- Scope: Film SPK-ZCP-07 feasibility items 1–5 (`bust.ts` reach3, projected mitten and rings, `fridge.ts` in PJ-ZCP-07, sides, reach risk); Mark sheet `ZCPAINT-SHORT-SS-R1.5` MK-ZCP-B5 (box bottom-centre (1.10, 4.10, 2.05), transport f6–15, contact f15–17, lift f17–24, arm before torso) as the target.
- **Status: Task A code built and gated; look check of the new B06-SH02 pending the user. Task B (G3: B08-SH01, B09-SH01, B09-SH02, B09-SH03, B10-SH01) not started: AI09 turn cap reached after Task A.** Uncommitted; `delivery.md` and `storyboards/` not edited; no push.

### Status by item (stable IDs)

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| A1 | `ArmPose` kind `reach3` and `BustOpts.proj` in `bust.ts` (standing front and back; back view draws the arm in `armBack`, front in `overArms`); default arms unchanged; `anchors.hands` now built in arm order (same values for 2D hands) | built | `tests/zcpaint-proj.test.ts` (reach3 order, anchors, throw without proj) |
| A2 | Projected mitten (BODY-ZCP-6H 0.40 × 0.25) and cross-contour rings, in new `src/painted/zcpaint/proj.ts` (PJ-ZCP-07 module). Deviation: not a `Hand` option in `body6.ts`, because `Hand` is 2D; `body6.ts` unchanged | built | `proj.ts` `mittenPJ`, `reachArm` |
| A3 | `fridge.ts` redrawn in PJ-ZCP-07 (fridge, shelves, food, box, hinged door; box rides from contact f15–17); 2D `BOX`/`HANDLE`/`lowBend` removed | built; spike-port check below | `out/qa/zcp-g3/after3/` frames; `out/qa/zcp-g3/check/B06-SH02-port-270.png` (viewed) |
| A4 | Sides: his right = screen right = `R` in the back view (Film F7-1). Box arm is `R`; his left hangs off frame left (hidden, per variant B) | built | `fridge.ts` comment; DF `DF-20261030-zcpaint-back-view-arm-sides` revalidated (below) |
| A5 | Reach risk: box z 2.15 → 2.05 (Mark MK-ZCP-B5). Wrist/shoulder distance over pf 6–24: **0.98 of the arm length at pf 15** (was ~1.03 for the spike B box) | built | `out/logs/g3-after3.log`; `tests/zcpaint-proj.test.ts` (≤ 1) |
| A6 | Caption band vs the bigger fridge: box bottom-centre plate y **1080**, box front-bottom edge y **1101** (Mark's note), box top y 997. TH caption block y 1060–1248 therefore **overlaps the box**. Not applied: the fallback (shelf 4.25) needs Film/Mark sign-off | **open, report** | numbers from `reachPose(0)` through `placeClose` (measured by a stdout script, `node --import tsx` over `reachPose` and `placeClose`; not saved as a log); `scripts/caption-zone.py` not run in this checkpoint |
| A7 | `legs: false` for the waist cut (spike and sheet: no trouser leg in frame; the default legs showed a trouser top at plate y ≈1830) | built | frames after3 |
| A8 | Overlay strip (x 420–880, y 300–420) against the bigger fridge: not measured (Editor's text overlay) | unverified | — |

### Measurements

- Box bottom-centre pf 0: plate (670, 1080); top (670, 997); bottom front edge (z − 0.21) ≈ y 1101.
- Reach ratio pf 6–24: max 0.98 (pf 15); contact pf 15 0.98.
- Fridge bbox in plate px and sheet numbers: not measured in this checkpoint (sheet R1.5 targets: fridge x 173–1007, interior x 233–948 y 305–1595, shelf y 1152). Unverified.
- Lead: close bust, no section lead applies (waist cut, head 560 px).

### Spike identity (variant B port vs `out/painted/zcpaint/spk07/r7/ZCPAINT-SPK07-B_F{0,8,13,24}.png`)

- Measured with the spike label band cropped (top 120 px). Band mean luma (320 px bands) equal within 1 level at every band.
- **Not bit-identical.** The difference is in outlines, cloth hatching and the head (amplified diff: `out/qa/zcp-g3/check/diff-B06-f13.png`). Two causes are plausible and not separated: (a) draw order changed (the spike drew the arm first, the port draws it after the L sleeve), which shifts the seeds of later parts; (b) the spike frames were rendered before the pass 13 shared-code changes. Not proven. Logged as a residual, see DF below.
- Legs differ by design (A7).

### Guard shots (pass 13 state → pass 14, `out/qa/zcp-g3/before` vs `after3`, decoded RGB)

| Shot | Result | Note |
| --- | --- | --- |
| B02-SH03 f0, f60 | identical | flat and bust-front default path |
| B09-SH02B f0, f18 | identical | flat POV, no figure |
| B01-SH01 f0 | 394 px, max 7 levels | textured figure; `bust.ts` default path has the same parts order |
| B01-SH01 f36 | differs (not sized) | textured |
| B07-SH01 f0 | 10 px, max 1 | |
| B07-SH01 f40 | differs (not sized) | |
| B07-SH02 f60 | diff_px=6 max_channel=1 bbox=(660,657)-(677,679) | textured |
| B05-SH01-TH f40 | diff_px=2 max_channel=1 bbox=(597,549)-(834,765) | textured |
| B04-SH01 f40 | 7 px, max 2 | |
| B06-SH01 f150 | 9 px, max 3 | |

- All differences are in the textured-pass residual class (≤ 9 levels, edge pixels; `DF-20261030-zcpaint-figure-texture-residual`). No same-code re-render was run to prove it, so the cause is not isolated: **unverified**.
- WORLD FOG 21-frame md5 against `out/qa/zcp-r26/wfog-final/md5.txt`: **not run in this checkpoint** (required by the workflow when shared code changes; `bust.ts` changed). Open for the next pass.

### Checks

- `npx tsc --noEmit` exit 0 (`out/logs/g3-tsc-2.log`).
- `npx eslint` on `proj.ts`, `fridge.ts`, `bust.ts`, `tests/zcpaint-proj.test.ts` exit 0 (`out/logs/g3-eslint-2.log`).
- `npm test` exit 0; totals in `out/logs/g3-npmtest-1.log` (the four new PJ-ZCP-07 tests pass).
- Frames viewed through `scripts/qa-sheet.sh` (270 px, 5 tiles, pf 0/13/24/41/62): `out/qa/zcp-g3/check/B06-SH02-port-270.png`. The door is shut at pf 0 and 41–62, open at 13–24, the arm reaches into depth and the box lifts with the hand.
- Not run: Studio and seek parity, neighbour boundaries (B06-SH01 → B06-SH02 → B06-SH03), labelled 540 px sheet, caption-zone measure, WORLD FOG identity.

### Deviations (for Film and Mark to revalidate)

- D-P14-1 Box z 2.05 (Mark R1.5 MK-ZCP-B5, 0.1 head nearer than spike B). Reach 0.98 instead of ~1.03.
- D-P14-2 `proj.ts` is a new PJ-ZCP-07 module (the projected mitten is not a `Hand` option).
- D-P14-3 `legs: false` on B06-SH02 (trouser top was in frame).
- D-P14-4 Box bottom front edge y 1101 falls inside the TH caption block (1060–1248). Fallback shelf 4.25 needs Film/Mark sign-off.

### Files changed (uncommitted)

- `src/painted/zcpaint/proj.ts` (new), `src/painted/zcpaint/bust.ts` (reach3, proj, anchors), `src/painted/zcpaint/fridge.ts` (PJ-ZCP-07 port), `tests/zcpaint-proj.test.ts` (new).
- `scripts/zombie-condo-paint/build-notes.md` (this section); `docs/dev-findings.md` index row and `docs/dev-findings/DF-20261030-zcpaint-pj07-reach3.md` (new); `docs/dev-findings/DF-20261030-zcpaint-back-view-arm-sides.md` (revalidation line).
- Outputs (not committed): `out/qa/zcp-g3/{before,after1,after2,after3,check}/`, `out/logs/g3-*`.

### Next (pass 14 continuation or a fresh invocation)

1. Film/Mark: decide D-P14-4 (caption block vs box bottom); revalidate variant B on the port.
2. Boss: WORLD FOG identity and Studio seek parity for B06-SH02; labelled 540 px sheet.
3. Boss Task B (G3) as scoped by the coordinator: cloth texture (`tex: TEX_B`) on B09-SH01/SH03 (`b09.ts`), B09-SH02 (`closeups.ts`) and B10 (`interior.ts`); B10 mitten `MITTEN_6H`; B09 seated distance d 0.55 per sheet R1.4 (code is 0.60, lead 484 px); B08 silhouette costume check (no collar stand or sleeve shape in the flat silhouette; the sheet's R2.6 cue needs Mark's word).

## 2026-10-30 — Boss pass 15 (B06 fix + G3)

- Scope: coordinator task. Start state: pass 14 checkpoint (`out/qa/zcp-g3/after3/`). Brief `VB-ZCPAINT-SHORT-R2.6`, sheets `ZCPAINT-SHORT-SS-R1.5`; costume `CS-ZCP-R26`; body `BODY-ZCP-6H`; `TX-ZCP-CLOTH` (`TEX_B`); projection `PJ-ZCP-07` (B06-SH02 only). User binding: no caption shade, texture on cloth only, CP-P arm depth, mitten per `BODY-ZCP-6H`, B08 hero look (R2.4) unchanged apart from the costume.
- Part 1 (B06-SH02): after the lift the box is drawn in to the chest before the door shuts (user look check, `delivery.md` "Boss pass 14 B06-SH02 port look check"); the caption overlap with the box accepted; shelf stays 4.10.
- Part 2 (G3): B08-SH01, B09-SH01, B09-SH02, B09-SH03, B10-SH01. B09-SH01 and B10-SH01 have TH and EN plate IDs over one paint function; only the TH frames were rendered and viewed (the EN IDs use the same code, not separately checked).
- **Status: built and frame-checked by Boss; not a user look-check pass.** Uncommitted; `delivery.md` and `storyboards/` not edited; no push. Studio and seek parity not run (limitations below).

### Status by item (stable IDs)

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| P15-1 | B06-SH02 draw-in: lift 17–24 (unchanged), **draw in 24–32** (`DRAW` (−0.02, 0.16, −1.25) from the lift pose), box held to the last frame; arm bends, elbow down-and-back (pole unchanged) | built | `src/painted/zcpaint/fridge.ts` `reachPose`; `tests/zcpaint-proj.test.ts` "B06-SH02 draw-in" (reach ≤ 1 over pf 6–62; box holds from 32; z 0.5, y 4.34) |
| P15-2 | B06-SH02 box vs shut door depth: the box is painted before the door while the door is nearer, after it once the box front (z 0.29) is nearer than the door's free edge; without this the box was hidden at f 41–62 | built; new DF | `fridge()` `boxFirst`; `docs/dev-findings/DF-20261030-zcpaint-b06-box-door-depth.md`; `out/qa/zcp-p15/after2-f41-62-crop.png` |
| P15-3 | Fridge edges vs R1.5 targets (shut door f 0; open door f 24) | built; measured, see Measurements (stdlib decoded-RGB scan, not saved as a log) | `out/qa/zcp-p15/after2/ZCP-B06-SH02_f0.png`, `_f24.png` |
| P15-4 | WORLD FOG 21-frame identity (shared `body6.ts` path was not changed this pass; required check outstanding from pass 14) | **21 of 21 identical** | `out/logs/p15-wfog-vs-r26final.log` (diff exit 0); `out/qa/zcp-p15/wfog/md5.txt` |
| P15-5 | G3-B08: silhouette costume cue (raised collar stand round the nape; overshirt sleeve caps over both shoulders); colour `#06080a`, rim, head, slump and flare unchanged | built (deviation D-P15-4) | `src/painted/zcpaint/balcony.ts` `silhouetteParts`; `out/qa/zcp-p15/b08-f40-cmp-540.png` |
| P15-6 | G3-B09-SH01 and B09-SH03: seated depth `SEAT_D` 0.60 → **0.55** (sheet RK-28); `TEX_B` on the figure (both draws) | built | `b09.ts`; seated leads 493 px (SH01, sheet 491) and 501 px (SH03, sheet 496), `out/logs/g3-measure-1.log` |
| P15-7 | G3-B09-SH02: `TEX_B` on the bust; framing moved from R1.3 (540, 610; 360 px; floor at y 1290) to **R1.4** (560, 720; 600 px; floor below the frame; camera about (470, 690)) | built; **foot at the frame bottom: open** (D-P15-3, `Q-P15-1`) | `closeups.ts` `B09_HEAD`, `B09_FLOOR_Y`; `shots/zcpaint.tsx` `camB09Sh02`; `out/qa/zcp-p15/b09sh02-bottom-540.png` |
| P15-8 | G3-B10-SH01: `TEX_B` on the figure; `MITTEN_6H` on the back, side (turn) and front views | built; standing lead 1374 px (sheet 1345; +2 %, D-P15-5) | `interior.ts`; `out/logs/g3-measure-1.log` |
| P15-9 | Hands: B09 keeps the fist kit (HD-04, no mitten); B08 shows no hands | N/A for mitten | — |

### Measurements

- Fridge (R1.5 target → measured, `out/qa/zcp-p15/after2/` frames, decoded RGB): front panel right edge x 1007 → **1007**; front panel top y 225 → **226**; interior top y 305 → **304**; interior right x 948 → **948**; shelf 4.10 front edge y 1152 → **1153–1154**; front panel left edge x 173: occluded by the head and torso (formula 174), not measured.
- B06-SH02 box (projected with `PJ-ZCP-07`, computed not sampled): bottom-centre (1.00, 4.34, 0.50) → plate (≈674, 1176); lid top ≈ y 1060 (the caption block's top edge). Wrist at pf 41 ≈ (791, 1029). Reach (wrist to shoulder) ≤ 1 arm length (test).
- Caption band (`scripts/caption-zone.py --band 1060:1248`, default thresholds mean ≤ 0.25, p95 ≤ 0.40): **B06-SH02 f 24 mean 0.354 / p95 0.84, f 41 0.403 / 0.871, f 62 0.403 / 0.871: fail** (the sheet's fallback to shelf 4.25 not applied; the user accepted the overlap in pass 14). B09-SH01 0.119 / 0.131 pass; B09-SH03 0.119 / 0.131 pass; **B09-SH02 f 0 0.447 / 0.724 fail; B10-SH01 f 100 0.452 / 0.62 fail** (B10 before this pass: 0.465 / 0.631, so this is not caused by the pass).
- Leads (`scripts/zombie-condo-paint/g-measure.ts`, rows added this pass): seated B09-SH01 **493 px**, B09-SH03 **501 px** (both ≥ 480); standing B10-SH01 **1374 px** (sheet 1345). B06-SH02 and B09-SH02 are close busts (no section lead; B09-SH02 face y 420–1020 per R1.4 but feet in frame, see Q-P15-1).
- Silhouette diff B08-SH01 f 40 (pass 14 state → now): 8,180 px, all but ≈ 66 px in y 1600–1919 (the silhouette band); max 168 levels at the collar and cap rim edges. Dark-mass top unchanged (y 1360).
- Determinism (same code, two runs, `out/logs/p15-det-stills.log`): B06 f 0 4 px and f 24 8 px differ at max 1 level. Pass 14 → now (decoded RGB): f 0 2 px, f 24 11 px, max 1 level. These are render-run noise (the same class as `DF-20261030-render-run-noise`), not a change.

### Checks

- `npx tsc --noEmit` exit 0 (`out/logs/p15-tsc-2.log`).
- `npx eslint` on the changed src/test files exit 0 (`out/logs/p15-eslint-1.log`); `tests/zcpaint-proj.test.ts` and `scripts/zombie-condo-paint/g-measure.ts` exit 0 (`out/logs/p15-eslint-2.log`).
- `npm test` 152 of 152 pass (`out/logs/p15-npmtest-2.log`; the new draw-in test and the existing B08 silhouette, B09 seated-lead and B10 perspective tests included).
- WORLD FOG 21-frame identity: 21 of 21 identical (P15-4).
- Final re-run after a behaviour-neutral cleanup of the box/door depth check (`boxFirst` reuses the door's free-edge depth): `tsc` exit 0 (`out/logs/p15-tsc-3.log`), `eslint` exit 0 (`p15-eslint-3.log`), `npm test` 152 of 152 (`p15-npmtest-3.log`); B06-SH02 f 41 against the verified frame: 7 px, max 1 level (`out/qa/zcp-p15/final/`).
- Frames viewed through `scripts/qa-sheet.sh` (270 px) and at 1:1 crops: `out/qa/zcp-p15/b06-seq-270.png` (f 0, 24, 32, 35, 38, 41, 62), `out/qa/zcp-p15/g3-after-270.png` (B08 f 127 and f 40, B09 SH01/02/03, B10 f 30/100/130), `out/qa/zcp-p15/b09sh02-bottom-540.png` (foot), `out/qa/zcp-p15/b08-f40-cmp-540.png` (silhouette).
- **Labelled 540 px sheet for the user:** `out/qa/zcp-p15/pass15-labelled-540.png` (12 tiles, shot ID, TH composition time and plate frame per tile; viewed at 900 px in `out/qa/zcp-p15/pass15-labelled-view.png`).
- Not run: Studio cold load and seek parity (`npm run start`), neighbour boundaries (B06-SH01 → B06-SH02, the EN cut at f 45 as its own render, B06-SH02 → B06-SH03, B08 → B09, B09-SH01 → B09-SH02 → B09-SH02B → B09-SH03, B09-SH03 → B10), the Editor timeline, and the sheet's 20 other plates (not in this pass).

### Deviations (for Film and Mark to revalidate)

- D-P15-1 B06-SH02 box: draw-in 24–32 to bottom-centre (1.00, 4.34, 0.50). The sheet says "box + cup in his right hand at about shoulder height" and "draws in toward the chest" (user). The box's lid sits at the caption block's top edge (≈ y 1060) and the box and hand lie in the caption band (overlap accepted in pass 14). From the back view the forearm and upper arm cover most of the box; the cup and lid show above the wrist. Film to confirm the read.
- D-P15-2 Depth order in `fridge()` (box vs shut door, by the box front z against the door's free edge). A painter rule, not in the sheet. See the DF.
- D-P15-3 B09-SH02 framing moved from R1.3 to the R1.4 numbers (head 600 px at (560, 720), camera about (470, 690), floor below the frame). **The bare foot stays visible at the bottom edge** (top ≈ y 1820, to the frame bottom): the seated bust's feet sit 1.83–1.99 head units below the head centre, and the sheet's chin (≤ 1020) and foot (≥ 1920) numbers cannot both hold at 600 px. Shared bust not changed (WORLD FOG uses `seated: true` too). DF `DF-20261030-zcpaint-b09-sh02-feet-frame`.
- D-P15-4 B08 costume: the sheet's costume note says the silhouette shows "collar stand and sleeve shape only". The sheet row gives no explicit cue, so Boss used the note: a raised collar stand (reads at the nape below the jaw) and overshirt sleeve caps (bulge over both shoulders). No texture (dark silhouette). The cue is small (≈ 8k px); a frame check at 540 px shows it. If the user wants it stronger, Mark names the cue.
- D-P15-5 B10 standing lead 1374 px, sheet 1345 (+2 %): the sheet value was an estimate; the figure is unchanged in height.

### Scripting and tool lessons (this pass)

- The Bash tool's shell is zsh: an unquoted `$SPECS` is one argument, not a word list, so `render-frames.sh` rendered nothing and failed with `Frame NaN`. Pass the ID:frames specs explicitly (or use `${=SPECS}` in zsh). Lost one WORLD FOG run to this.
- ffmpeg here has no `drawtext`; the system `python3 -I` has no PIL (the existing finding `DF-20261030-zcpaint-qa-label-sheet` records the same gap). The labelled sheet was drawn with a small Swift AppKit helper kept outside the repo (scratchpad `labelsheet.swift`, `swiftc`). A repeated labelled sheet needs a repo helper (see proposed changes).
- `g-measure.ts` gained seated (B09 at `SEAT_D`) and standing (B10 back view) rows; `rgb-diff.py` and the stdlib fridge scan (decoded RGB) were used for the edge and diff checks.

### Proposed document changes (TL/DP; not applied)

1. `.claude/skills/painted-2d/SKILL.md` gotchas: "A prop moved across a plane (door, wall) needs its draw order checked against that plane; a fixed painter order that was right behind the plane is wrong in front of it (DF-20261030-zcpaint-b06-box-door-depth)."
2. `scripts/README.md`: a labelled review-sheet helper (label text per tile, 540 px) for the shot-ID preview rule; the Swift helper is a candidate. Needs the user's or the TL's decision on language/tooling.
3. `storyboards/zombie-condo-paint/short/sc01-b09-b10.md` (Mark): B09-SH02 numbers (head centre and foot acceptance) conflict at 600 px; Mark chooses (see Q-P15-1). Not edited by Boss.

### Questions for the user (relay through the coordinator; not asked here)

- `Q-P15-1` B09-SH02 close (R1.4 framing): the bare foot stays at the bottom edge (y ≈ 1820 to the frame edge). Options: (a) accept the foot tips at the edge (current build); (b) lower the head about 100 px (chin ≈ 1120, the sheet's chin rule changes); (c) smaller head (≈ 660 px, chin ≈ 1050, the same rule shifts); (d) back to the R1.3 framing (360 px, floor visible). Boss default: (a) until Mark chooses numbers.
- `Q-P15-2` Captions over cream and the teal costume: B06-SH02 (f 24–62), B09-SH02 and B10-SH01 fail the default caption-zone thresholds for outline captions (band mean 0.35–0.45). The user accepted the B06 overlap in pass 14. Keep the outline-caption band as it is (no shade, per pass 8), or ask Film for a band threshold for this look?
- `Q-P15-3` B06-SH02 read from the back: the box is mostly behind the forearm and upper arm; the cup and lid show above the wrist (`out/qa/zcp-p15/pass15-labelled-540.png`, tile 4–5). Is this the box-in-hand read the user wants, or should the box move further right to clear the arm?

### Files changed (uncommitted)

- `src/painted/zcpaint/fridge.ts` (LIFT/DRAW, draw-in 24–32, box/door depth order, `reachPose` comments)
- `src/painted/zcpaint/balcony.ts` (`silhouetteParts`: collar and sleeve caps)
- `src/painted/zcpaint/b09.ts` (`SEAT_D` 0.55; `TEX_B` on two draws)
- `src/painted/zcpaint/closeups.ts` (B09-SH02 `B09_HEAD` R1.4, `B09_FLOOR_Y`, `TEX_B`)
- `src/painted/zcpaint/interior.ts` (`MITTEN_6H`, `TEX_B`)
- `src/painted/shots/zcpaint.tsx` (`camB09Sh02` about (470, 690))
- `tests/zcpaint-proj.test.ts` (draw-in test)
- `scripts/zombie-condo-paint/g-measure.ts` (seated and standing rows)
- `scripts/zombie-condo-paint/build-notes.md` (this section)
- `docs/dev-findings.md` (two index rows); `docs/dev-findings/DF-20261030-zcpaint-b06-box-door-depth.md` (new); `docs/dev-findings/DF-20261030-zcpaint-b09-sh02-feet-frame.md` (new)
- Outputs (not committed): `out/qa/zcp-p15/{before,after1,after2,wfog,det}/`, `out/qa/zcp-p15/*.png` (sheets and crops), `out/logs/p15-*`, `out/logs/zcp-p15-*`, `out/logs/g3-measure-1.log`.

### Next

1. Film/Mark: D-P15-1 (box read), D-P15-3 / `Q-P15-1` (B09-SH02 numbers), D-P15-4 (B08 cue).
2. User: look check of `out/qa/zcp-p15/pass15-labelled-540.png`; answers to `Q-P15-1`–`3`.
3. Boss: Studio cold load and seek parity for the B06-SH02 and B09 plates; neighbour boundary frames; the EN f 45 render; the other plates in the registry (not in this pass).

## 2026-10-30 — Boss pass 16 G5 (R2.6 plates, group G5)

- Scope: coordinator task. Brief `VB-ZCPAINT-SHORT-R2.6`, sheets `ZCPAINT-SHORT-SS-R1.5`. G5 = `ZCP-B03-SH01-TH/EN`, `ZCP-B04-SH02-TH/EN`, `ZCP-B04-SH03a`, `-b`, `-c-TH/-c-EN`, `ZCP-B04-SH04-TH/-EN`, `ZCP-B09-SH02B`. None of these plates has a figure in frame (lead rule N/A). Not in scope: G4 shots (B02-SH01, B02-SH02, B05-SH02, B05-SH03, B06-SH03), `body6.ts`, `bust.ts`, `hands.ts`, `proj.ts`. `delivery.md` and `storyboards/` not edited; no commit, no push.
- Coexistence: G4 had edits in flight in this checkout. `povshots.ts` and `inserts.ts` are shared files; my hunks are in the B03, B09 and B04 functions only. `WATER_DEEP` is kept because the B05-SH02 stream (G4's shot) uses it. tsc, eslint and npm test below ran on the checkout state at the time, including G4's uncommitted edits; re-run after G4 settles.
- **Status: built and frame-checked by Boss; not a user look-check pass.** Studio and cold-load seek not run (limitation). Coordinator defaults applied: B04-SH02 keeps the pass 9 Grade vignette; B03 View B keeps the new cast tone.

### Status by item (stable IDs)

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| P16G5-1 | B03-SH01 View B: far-window floor shadows (the two curtain shadows) drawn in the LT-03 cast tone of the floor, not a near-black mix (they read as two dark legs) | built; partly addressed (D-P16G5-3) | `povshots.ts` `paintViewB` (`castTone(floor)`); `out/qa/zcp-g5/after/sheet-B03.png` |
| P16G5-2 | B03 keys, whip, lamps and blackout: unchanged | checked against R1.5 | `out/qa/zcp-g5/before/sheet-B03.png`, `after/sheet-B03.png` |
| P16G5-3 | B04-SH02 power-out painted crossed-bolt icon (`#e5484d`, x 160-200, y 722-790) from the power key (TH 75, EN 87); Remotion label stays Editor's | built | `diagram.ts` `powerIcon`; `after/sheet-B04-SH02.png` |
| P16G5-4 | B04-SH02 refill path dashed (14 px on, 12 px off) and struck out; appears f168-180 (TH), f196-208 (EN) | built | `diagram.ts` `dashRun`; `after/ZCP-B04-SH02-TH_f180.png`, `after/ZCP-B04-SH02-EN_f220.png` |
| P16G5-5 | B04-SH03 a/b and the c streams: lighter than the wall (`WATER_AQUA`), per R1.5 "water strands lighter than the wall" | built (D-P16G5-5) | `inserts.ts` `stream(..., WATER_AQUA)`; `after/sheet-B04-SH03-04.png` |
| P16G5-6 | B04-SH04 per-object flat cast shadows (under each bucket, the pot and the bottle row) replace one detached grey bar below the row | built; lid-snap shadow not built (D-P16G5-4) | `inserts.ts` `paintB04Sh04`; `after/sheet-B04-SH03-04.png` |
| P16G5-7 | B04-SH04 lid keys TH 0/4/8, EN 3/12/21; count 4 / 1 / 6 on the last frame | checked, unchanged | `inserts.ts` `LIDS`; `out/qa/zcp-g5/after/sheet-B04-SH03-04.png` |
| P16G5-8 | B09-SH02B floor props were drawn on the cabinet face at f0 (plate y 860-930). Now a tile floor below the cabinet base (plate y 2100, grout one step darker: grout lines drawn, not confirmed at full resolution), two stacks of two cans and the phone at plate y ≈2230-2400, short shadows toward the cabinet, cabinet base line | built | `povshots.ts` `floorTiles`, `floorProps`, `paintB09Sh02b`; `after/sheet-B09-SH02B.png`; `zcp-g5-labelled-540.png` tiles c0, c9 |
| P16G5-9 | B09-SH02B prop exit | measured: props still in frame at the bottom edge at f9, gone by f13 (sheet "by ≈f9"); D-P16G5-1 | `after/sheet-B09-SH02B.png` |

### Measurements

- Caption band (`scripts/caption-zone.py --band 1060:1248`, default thresholds mean ≤ 0.25 / p95 ≤ 0.40). The plates carry no caption text, so these are the paper and set values under the band. Logs `out/logs/zcp-g5-caption-before.log`, `zcp-g5-caption-after.log`:
  - B09-SH02B f0: before mean 0.785 / p95 0.810; after 0.439 / 0.456. B09-SH02B f9 after 0.464 / 0.801.
  - B04-SH04 TH f8: 0.809 / 0.833 (unchanged). B04-SH02 TH f75 after 0.844 / 0.869.
  - B03-SH01 TH f18: 0.428 / 0.714 (unchanged; the POV limits of ≤ 0.45 / ≤ 0.60 are exceeded on p95).
  - All fail the default thresholds. The user chose outline captions with no shade (pass 8, `delivery.md`); the same class of result was recorded as `Q-P15-2`. Not changed here.
- Determinism and seek: re-rendered single frames with the same bundle, decoded RGB md5 identical to the in-order frames: `ZCP-B09-SH02B` f9 (`4ae28727…`) and `ZCP-B04-SH02-TH` f180 (`53c41373…`). Not an unordered sweep (limitation).
- Lead heights: N/A (no figure in frame in any G5 plate).

### Checks

- `npx tsc --noEmit`: exit 0, 0 `error TS` lines (`out/logs/zcp-g5-tsc-1.log`).
- `npx eslint` on `diagram.ts`, `inserts.ts`, `povshots.ts`: exit 0 (`out/logs/zcp-g5-eslint-1.log`).
- `npm test`: 152 of 152 pass, exit 0 (`out/logs/zcp-g5-npmtest-1.log`).
- Frames viewed through `scripts/qa-sheet.sh` (270 px): before and after sheets (`out/qa/zcp-g5/before/sheet-*.png`, `out/qa/zcp-g5/after/sheet-*.png`); 540 px zooms `out/qa/zcp-g5/before/zoom-*.png`.
- **Labelled 540 px sheet for the user:** `out/qa/zcp-g5/zcp-g5-labelled-540.png` (13 tiles, shot ID, lang, plate clock `c` and frame); ~900 px view copy `out/qa/zcp-g5/zcp-g5-labelled-540-view.png`. Built with the new `scripts/zombie-condo-paint/label-sheet.sh` (see proposed changes).
- Not run: Studio cold load and play/pause/scrub (`npm run start`); unordered seek sweep; neighbour boundaries (B03 → B04-SH01, B04-SH02 → B04-SH03, B04-SH04 → B05-SH01, B09-SH02 → B09-SH02B → B09-SH03); the Editor timeline; the EN f 45 render.

### Deviations (for Film and Mark to revalidate)

- D-P16G5-1 B09-SH02B prop exit: sheet "by ≈f9"; measured in frame at f9, gone by f13. The sheet's own f0 numbers (cans ≈ y 1130) give about f10-12 with the current ease. Timing left as built; Mark or Film to choose.
- D-P16G5-2 B09 floor: the sheet gives no tile size; tile grout uses 110 px rows and 180 px columns (plate px), one step darker (22 % mix). Design value; Film may revise.
- D-P16G5-3 B03 View B: the two curtain shadows are unchanged in geometry (tapered, about 300 px long). The tone is lighter, but at f14-23 they still read as two dark trousers. Options for Film: shorter shadows or a softer edge. Not changed by Boss without Film.
- D-P16G5-4 B04-SH04: the sheet's "lid's shadow appears with its snap" is not built; the per-object base shadows are (P16G5-6).
- D-P16G5-5 B04-SH03 streams: lighter than the wall now, but still a plain rod in the frame (no splash or taper). Film may ask for a more water-like stream.
- D-P16G5-6 B04-SH02 Grade vignette kept (coordinator default; pass 9). The sheet says "plain paper" and pass 3 recorded "no vignette". Film/Mark to decide.
- D-P16G5-7 B04-SH03 insert objects end at plate y 960-1000: meets the acceptance "above y 1040", not the "target ≤ 800" (unchanged from pass 10).

### Scripting and tool lessons (this pass)

- `scripts/zombie-condo-paint/label-sheet.sh` (new): labelled 540 px tiles as an HTML page captured by Chrome headless, then `sips -Z 900` for the view copy. It replaces the Swift helper of pass 15. Labels are ASCII only; Thai text stays on the page, not in the helper.
- The background render chain stalls when other worktrees' Chrome processes load the machine (the after set ran at about 15 stills per 10 minutes). Use a completion marker in the log (`stills exit`) and wait on it, not on elapsed time.
- `WATER_DEEP` looked unused after the edit; it was still used by a G4 shot. Grep the whole file before removing a constant in a shared module.

### Proposed document changes (TL/DP; not applied)

1. `docs/dev-findings/DF-20261030-zcpaint-qa-label-sheet.md`: the labelled sheet is scripted (`label-sheet.sh`, Chrome headless). Update the "Planning impact" line.
2. `scripts/README.md`: a row for `label-sheet.sh` (labelled review sheet, 540 px, ASCII labels; Chrome headless).
3. `storyboards/zombie-condo-paint/short/sc01-b09-b10.md` (Mark): B09-SH02B prop exit timing (D-P16G5-1) and the floor layout numbers. Not edited by Boss.

### Questions for the user (relay through the coordinator; not asked here)

- `Q-P16G5-1` Coordinator defaults applied (B04-SH02 Grade kept; B03 cast tone kept); confirm at the overview.
- `Q-P16G5-2` Caption band on the POV and insert plates (B03 p95 0.714; B04-SH02 mean 0.844; B09-SH02B f9 p95 0.801) under the outline-caption decision: keep as is, or ask Film for a band threshold for this look (same as `Q-P15-2`)?

### Files changed (uncommitted, this pass)

- `src/painted/zcpaint/diagram.ts` (`dashRun`, `powerIcon`, dashed refill path; a dead loop removed in the same block)
- `src/painted/zcpaint/inserts.ts` (B04-SH03 stream colour, B04-SH04 shadows; B05 untouched)
- `src/painted/zcpaint/povshots.ts` (B03 `paintViewB` shadow tone; B09 `floorTiles`, `floorProps`, cabinet base line; `castTone` import)
- `scripts/zombie-condo-paint/label-sheet.sh` (new)
- `scripts/zombie-condo-paint/build-notes.md` (this section)
- Outputs (not committed): `out/qa/zcp-g5/{before,after,det}/`, `out/qa/zcp-g5/zcp-g5-labelled-540*.png`, `out/logs/zcp-g5-*`.

## 2026-10-30 — Boss pass 16 G4 (R2.6 plates, group G4): checkpoint

- Scope: brief `VB-ZCPAINT-SHORT-R2.6` (`CS-ZCP-R26`, `TX-ZCP-CLOTH`, `BODY-ZCP-6H`, `VD-ZCP-HANDS`), sheets `ZCPAINT-SHORT-SS-R1.5`, group **G4**: `ZCP-B02-SH01-TH`/`-EN`, `ZCP-B02-SH02-TH`/`-EN`, `ZCP-B05-SH02`, `ZCP-B05-SH03` (+ `-BOWL`, `-TH`, `-EN`), `ZCP-B06-SH03`. User binding (coordinator): no caption shade, texture on cloth only, sets clean, mitten per `BODY-ZCP-6H` except the two pinch inserts (B05-SH02, B05-SH03), B02-SH01 no hand (pass 8), POV hands per the WORLD FOG phone-insert model where applicable.
- Start state: `out/qa/zcp-g4/before/` (38 plate frames, rendered before any G4 edit; `before.md5`).
- **Status: built and frame-checked by Boss; not a user look-check pass.** Uncommitted; `delivery.md`, `storyboards/` and G5 scene code not edited. Studio cold load and seek parity not run (limitations).
- Shared-file note: `src/painted/zcpaint/inserts.ts` was also edited in flight by the G5 agent (B04-SH03 water colour and cast shadows, 16:55–16:58; `WATER_DEEP` removed then restored). Only the G4 functions (`sleeve()`, `hand()` signature, B05-SH02, B05-SH03 forearm, B06-SH03) are G4 edits. `povshots.ts` G5 hunks are at lines 156 (B03) and 204+ (B09-SH02B); none in the B02 code (lines 1–76).

### Status by item (stable IDs)

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| G4-1 | B02-SH01 (TH/EN): no hand, forearm or sleeve at any frame; bolt turns by itself (pass 8); camera push 1.00 → 1.03 unchanged | verified, **no code change** | `out/qa/zcp-g4/final/ZCP-B02-SH01-*`; `zcp-g4-labelled-540.png` tiles 1–2 |
| G4-2 | B02-SH02 (TH/EN): no hands or arms; cabinet, flush and wobble unchanged | verified, **no code change** | `final/ZCP-B02-SH02-*`; tiles 3–4 |
| G4-3 | B05-SH02 pour insert: bare SKIN forearms → overshirt sleeves to the wrist with a cuff (`sleeve()`, `COSTUME.over`, `TX-ZCP-CLOTH`); both hands **pinch** (`hand(..., 'pinch')`, was mitten) | built; cuff and pinch frame-checked at full resolution | `inserts.ts` B05-SH02; `out/qa/zcp-g4/after1-crops-hands.png`; tiles 5–7 |
| G4-4 | B05-SH03 cistern insert: bare forearm → sleeve with cuff (16:58 fix: cuff ink curve 0.5); visible pinch kept (lid grip, pf < 60); part 2 (BOWL) and part 3 (TH/EN) hold unchanged (no hand) | built; `md5` of BOWL and part 3 frames unchanged | `out/qa/zcp-g4/after2b-cuff-zoom.png`; tiles 8–11 |
| G4-5 | B06-SH03 counter top-down: bare forearm → sleeve with cuff, mitten kept (`BODY-ZCP-6H`); mitten cast onto the counter (sheet light row; silhouette offset screen-left, `castTone`) | built (cast is new) | `inserts.ts` B06-SH03; tiles 12–13 |
| G4-6 | Sleeve and cuff geometry on the three inserts: width = the old forearm width (66–70 px), cel band on the right (2s = 0.4 w), cuff 0.12 head back from the wrist at the hand scale (1.9 / 2.2 / 2.0) | built; see D-G4-3 | `inserts.ts` `sleeve()` |
| G4-7 | Bare forearm removed from the plates: `forearm()` deleted (its only callers were these three plates) | done | `grep forearm(` in `src/painted/zcpaint/` → none |
| G4-8 | Caption band `--band 1060:1248` measured for all 38 frames (before and final); no shade added | **fails the default thresholds on every frame** (Q-G4-3); B02 also above the POV limit (mean ≤0.45, p95 ≤0.60) | see Measurements |

### Measurements

- Decoded-RGB md5 (38 plate frames, `before.md5` vs `final.md5`): **20 identical**. The 17 changed frames are the expected set: B05-SH02 (f 0, 15, 36, 50, 72, 100), B05-SH03 (f 15, 21, 33, 45, 59), B06-SH03 (f 0, 2, 3, 6, 12, 24). The B05-SH03 BOWL (f 0, 6) and part 3 (TH f 19, 30; EN f 30, 60) frames are identical, so the parts without a hand are unchanged. The B02 frames are identical except `ZCP-B02-SH02-TH_f9` (9–77 px, max 1–3 levels, x 974: the latch edge).
- Render-run noise on the B02 code (no edit): the same code rendered twice differs by 6–144 px at max 2 levels (`out/qa/zcp-g4/after1` vs `after2`; `DF-20261030-render-run-noise` class). So the B02 f9 difference is noise.
- Caption band, full-width `--band 1060:1248` (mean / p95, before → final, same for all frames of a plate unless noted): B02-SH01 0.62–0.63 / 0.79–0.81; B02-SH02 0.53 / 0.80; B05-SH02 and B05-SH03 (incl. part 3) 0.81 / 0.83; B05-SH03-BOWL 0.87 / 0.89; B06-SH03 0.61 → 0.61 / 0.64 (mean moves 0.615 → 0.612 at f 0–6 from the cast). Default thresholds (mean ≤ 0.25, p95 ≤ 0.40) fail on all; the B02 POV limit (≤ 0.45 / ≤ 0.60) fails. The sheet's under-text box (x 150–930) was **not** measured (the script has no x range): unverified.
- Leads: N/A (no full figure in these plates; the lead rule is exempt for inserts per the sheet, and B02 is POV).
- WORLD FOG 21-frame md5 (`out/qa/zcp-g4/wfog/md5.txt` vs `out/qa/zcp-r26/wfog-final/md5.txt`): **21 of 21 identical** (`out/logs/zcp-g4-wfog-diff.log` empty). Measured on the current tree, including the G5 in-flight edits to `body6.ts`/`bust.ts`, which the WORLD FOG path also uses.

### Checks

- `npx tsc --noEmit` exit 0 (`out/logs/zcp-g4-tsc.log`).
- `npx eslint src/painted/zcpaint/inserts.ts src/painted/zcpaint/povshots.ts` exit 0 (`out/logs/zcp-g4-eslint.log`).
- `npm test` 152 of 152 (`out/logs/zcp-g4-npmtest.log`). No new automated test: the insert sleeve and pinch are checked by frame and md5, not a unit test (a pixel test would need a recording PaintContext).
- Frames viewed through `scripts/qa-sheet.sh` (270 px) and at full resolution (crops `after1-crops-hands.png`, zooms `after2b-cuff-zoom.png`).
- **Labelled 540 px sheet for the user:** `out/qa/zcp-g4/zcp-g4-labelled-540.png` (1684 × 5308, 13 tiles, shot ID, TH/EN composition time and plate frame per tile), view copy `out/qa/zcp-g4/zcp-g4-labelled-900.png`. Rendered by the new `scripts/zombie-condo-paint/label-sheet.py` from `label-manifest.tsv` (registered in `scripts/README.md`; the third labelled sheet, so scripted per the TL rule).
- Not run: Studio cold load, play/pause, backward scrub and unordered seeks (`npm run start`); neighbour boundaries (B02-SH01 → SH02 → SH03, B04-SH04 → B05-SH02 → B05-SH03 → B06-SH01, B06-SH03 → B07-SH01). The plates are pure functions of the plate frame, so seek parity follows from the code, but it is not observed.

### Deviations (for Film and Mark to revalidate; Boss does not edit the sheets)

- D-G4-1 **Pinch on B05-SH02, both hands** (the coordinator's binding). The R1.5 row says "mitten with a thumb lobe" and `HD-03` says "no finger articulation, except the B02-SH01 bolt pinch". The pinch is the body6 `pinch` kind, the same one B05-SH03 already used. Film to record the HD-03 exception for the two pinch inserts; Mark to change the B05-SH02 hands row.
- D-G4-2 **POV hands:** the sleeve and cuff follow the WORLD FOG phone-insert construction (teal `#2f5a5c`, cuff, sleeve off-frame to the wrist). The hand shape stays the BODY-ZCP-6H mitten or pinch from `body6.ts`, not `hands.ts` `paintPovHand` (that hand is not BODY-ZCP-6H). See Q-G4-2.
- D-G4-3 **Sleeve width kept at the old forearm width** (66–70 px full width). At the hand scale of 2.0 a figure sleeve (radius 0.215 head) would be about 120 px wide, so these sleeves read thinner than the figures. Not changed; Film to say whether the inserts should match the figure width.
- D-G4-4 **Cast added** on the B06-SH03 mitten (sheet light row); was missing.
- D-G4-5 **Cuff is a fold-tone line** (the figure `cuffLine` convention, weight 1.0). Visible at full resolution (zoom), faint at tile scale.

### Questions (relay through the coordinator; not asked here)

- `Q-G4-1` B05-SH02: both hands pinch (as built), or only the right hand pinches on the rim and the left stays a mitten under the base?
- `Q-G4-2` "POV hands follow the WORLD FOG phone-insert model where applicable": confirm this means the sleeve and cuff construction (as built), not the `hands.ts` hand shape for B05/B06.
- `Q-G4-3` Captions: every G4 band fails the default thresholds and the B02 POV limit (full-width measure), as with Q-P15-2 for B06-SH02 and B09. Keep the outline captions with no shade, and ask Film for a band threshold for the cream and tan sets?

### Files changed (uncommitted)

- `src/painted/zcpaint/inserts.ts` (`sleeve()` added, `forearm()` removed, `hand()` takes an optional `sil`, B05-SH02 hands and sleeves, B05-SH03 sleeve, B06-SH03 sleeve and cast). The G5 hunks in the B04 region are not G4's.
- `scripts/zombie-condo-paint/label-sheet.py` (new), `scripts/README.md` (one row).
- `scripts/zombie-condo-paint/build-notes.md` (this section only).
- Outputs (not committed): `out/qa/zcp-g4/{before,after1,after2,after2b,final,wfog}/`, `out/qa/zcp-g4/*.png|html|tsv|md5|json`, `out/logs/zcp-g4-*`.

### Next

1. Film and Mark: D-G4-1 to D-G4-5 and the HD-03 exception.
2. User: look check of `out/qa/zcp-g4/zcp-g4-labelled-540.png`; answers to `Q-G4-1` to `Q-G4-3`.
3. Boss: Studio cold load and seek; neighbour boundaries; the under-text caption box (x 150–930) measure.

## 2026-10-30 — Boss pass 17 (overview fixes)

- Scope: 24-plate R2.6 overview fix list (delivery record "24-plate R2.6 overview", `out/painted/zcpaint/r26-overview/overview-24-270.png`): O17-1 B07-SH01 hand/arm path, O17-2 day-3 stubble (all day-3 plates), O17-3 B05-SH02 hands. Brief `VB-ZCPAINT-SHORT-R2.6`, sheets `ZCPAINT-SHORT-SS-R1.5` (no sheet edits; storyboards/ and delivery.md not edited; Editor files not touched).
- Status: **built and frame-checked by Boss; not a user look-check pass.** Uncommitted.

### Status by item (stable IDs)

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| O17-1 | B07-SH01 pinch reach: fingers pointed up the forearm, index and thumb stood upright at chin height (two raised hands read as a wai). Fix: optional `dir` on the side-view reach (`ArmPose`, `reachPts()` in `bust.ts`); the fingertip contact is `to`, the wrist sits 0.5 head behind it along the fingers; `B07_FINGERS = [1, 0]` (forward, at the case). Front/back reach throws if `dir` is set. | built; key frames pf 36/45/48/60 viewed; pf 0–30 and 66–140 rendered (md5 changed) but **not viewed at sheet scale** | `out/qa/zcp-r26-fix/before/ZCP-B07-SH01_f*.png` vs `after/`; crops `out/qa/zcp-r26-fix/crops/B07-SH01_*`; DF-20261030-zcpaint-reach-finger-dir |
| O17-2 | Day-3 stubble: 40 random dots, radius 0.03–0.042 K (clumped blobs, hexagons ~15–20 px at the bust close). Fix in `body6.ts` `stubble()` (shared by every day-3 overlay: front, side, seated, bust): one jittered dot per 0.03 K grid cell over the jaw box, radius 0.0045–0.006 K (about 1.2–1.6 px at the bust close). Mix 50 % unchanged. | built; viewed at bust close (B09-SH02), full figure (B09-SH01-TH, B09-SH03, B10-SH01) at full res and 270 px | `crops/B09-SH02_*`, `crops/B09-SH01-TH_*`, `crops/B10-SH01_*`; DF-20261030-zcpaint-day3-stubble-spots (status updated) |
| O17-3 | B05-SH02 pour: both hands pinch → BODY-ZCP-6H mitten (round/oval mass, user "กลม หรือเป็นรีทั้งก้อนได้"; sleeves and cuffs kept). Supersedes D-G4-1 (pass 16 G4) and the HD-03 pinch exception for B05-SH02. B05-SH03 pinch kept. | built; viewed at full frame and crop | `crops/B05-SH02_*`; `out/painted/zcpaint/r26-overview2/ZCP-B05-SH02_f50.png` |

### Measurements and checks

- Overview re-render: `out/painted/zcpaint/r26-overview2/` (24 frames, same plate:frame list as r26-overview) and `overview-24-270.png` (`scripts/qa-sheet.sh --cols 6`, 270 px, 6×4). Viewed: B07-SH01 pf45 one forward pinch, no upright pair; B05-SH02 oval mittens; B09-SH02 fine jaw stubble.
- Decoded-RGB md5, 49 pre-edit (`out/qa/zcp-r26-fix/before/`) vs post-edit (`after/`) frames: **the changed set is exactly the edit scope**: B05-SH02 f0/15/36/50/72/100; B07-SH01 (all 20 sweep frames); B09-SH01-TH f57; B09-SH01-EN f57; B09-SH02 f30; B09-SH03 f40; B10-SH01 f112. B09-SH02B f0 unchanged (no face).
- Eight other plates changed by 1–7 levels on a few to a few hundred pixels (B01-SH01 f36 649 px max 7; B01-SH02, B04-SH01, B04-SH04, B06-SH01, B06-SH02, B07-SH02, B08-SH01). Not edit leaks: the pre-edit overview render (17:07, same source) vs the pre-edit baseline gives the same magnitude (B01-SH01 f36 549 px, max 6; B08 f96 124 px, max 2). This is the run-to-run render noise class (DF-20261030-zcpaint-figure-texture-residual). So "untouched plates unchanged" holds within that noise, not bit-identical.
- WORLD FOG 21-frame md5 (`render-frames.sh src/painted/spike/index.ts out/qa/zcp-r26-fix/wfog-after`): **21 of 21 identical** to `out/qa/zcp-r26/wfog-final/md5.txt` (`out/logs/zcp-r26-fix-wfog-vs-final.log` empty). Pre-edit run also 21 of 21 (`wfog-before`).
- `npx tsc --noEmit` exit 0 (`out/logs/zcp-r26-fix-tsc.log`, empty); `npx eslint` on bust/body6/closeups/inserts exit 0 (`out/logs/zcp-r26-fix-eslint.log`); `npm test` 152 of 152 (`out/logs/zcp-r26-fix-npmtest.log`). No new automated test: the arm direction and stubble density are frame-checked.
- Labelled before/after sheet: `out/qa/zcp-r26-fix/before-after-crops-labelled.png` (`label-sheet.py`, manifest `out/qa/zcp-r26-fix/crops/manifest.tsv`).

### Deviations and questions (for Film and Mark to revalidate; Boss does not edit the sheets)

- `Q-R26-O17-1` B07-SH01: the pinch now points forward at the case from a forearm that runs near horizontal at chin-to-collar height. The user's look check decides whether that reads as a reach (accepted here as the Boss reading; the earlier look had the fingers up).
- `Q-R26-O17-2` Stubble density is Boss's choice within the S-P01 decision ("หนวดเป็นจุดเล็กๆ"). At full figure the dots are sub-pixel at 270 px, so they read as a grain rather than individual dots; confirm the density.
- B05-SH02 both mittens: Film/Mark record HD-03 (pinch exceptions now only B05-SH03 and B07-SH01).

### Not run / limitations

- Studio cold load, play/pause, backward scrub and unordered seeks (`npm run start`): not run. The plates are pure functions of plate frame, so seek parity follows from the code, not observed.
- Neighbour boundaries for B07-SH01 (B06-SH03 → B07-SH01 → B07-SH02) and B09-SH02 → B09-SH02B not checked.
- Caption bands were not re-measured (no caption changed in this pass).
- Visual evidence: frames viewed as listed above; the B07-SH01 pf 0–30 and 66–140 sweep frames are rendered but not yet viewed.

### Files changed (uncommitted, this pass)

- `src/painted/zcpaint/bust.ts` (`ArmPose.dir`, `reachPts()`, side-view near-arm reach routed through it; standing reach throws on `dir`).
- `src/painted/zcpaint/closeups.ts` (`B07_FINGERS`, B07-SH01 reach arm).
- `src/painted/zcpaint/body6.ts` (`stubble()` grid, `STUBBLE_PITCH`).
- `src/painted/zcpaint/inserts.ts` (B05-SH02 hands `mitten`).
- `docs/dev-findings/DF-20261030-zcpaint-reach-finger-dir.md` (new), `docs/dev-findings/DF-20261030-zcpaint-day3-stubble-spots.md` (status), `docs/dev-findings.md` (index), this section.
- Outputs (not committed): `out/painted/zcpaint/r26-overview2/`, `out/qa/zcp-r26-fix/`, `out/logs/zcp-r26-fix-*`, `out/logs/zcp-r26-overview2-stills.log`.

### Next

1. Boss or the next invocation: view the B07-SH01 sweep at 270 px (pf 0–30, 66–140) for any raised-hand frame; Studio cold load and seek; neighbour boundaries.
2. User: look check of `out/painted/zcpaint/r26-overview2/overview-24-270.png` and the labelled crop sheet; answers to `Q-R26-O17-1` and `Q-R26-O17-2`.
3. Film and Mark: HD-03 exception update for B05-SH02 (mitten) and B07-SH01 (pinch forward).

## 2026-10-30 — Boss pass 18 (fix round: B06-SH02 shoulder, B09 seated mittens)

- Scope: delivery record top entry "Boss pass 17 look check" (`scripts/zombie-condo-paint/delivery.md`, not edited) and this file's "Boss pass 17" section. Two items, stable IDs `P18-1` (knee-hug hands) and `P18-2` (B06-SH02 reach read). Brief, sheets and `delivery.md` not edited; Editor files not touched; no commit.
- Status: **built and frame-checked by Boss; not a user look-check pass.** Uncommitted.

### Status by item (stable IDs)

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| P18-1 | Knee-hug seated hands (B09-SH01 TH/EN, B09-SH02 bust, B09-SH03; `figSeatFloor` and `bust.ts` `seatFloor`): the closed `fist` (finger blocks) replaced by the BODY-ZCP-6H mitten (`MITTEN_6H`), far and near hand | built; viewed at 540 px (three plates) and the B09-SH02 close | `out/qa/zcp-b18/before-B09-seated-540.png`, `out/qa/zcp-b18/after-B09-seated-540.png`; DF-20261030-zcpaint-seated-knee-mitten |
| P18-2 | B06-SH02 reach sleeve: the shoulder root (reach3 `S`) moved to the back's outer edge (`SHOULDER_LEAD = (0.14, −0.10, 0.35)` in `fridge.ts`); the rest pose (pf 0–5) unchanged; the reach, elbow pole and draw-in unchanged | built; viewed at 270 px (f0–62, eight frames) and labelled 540 px (f8/f15/f24/f41); masks at f8/f41/f62 | `out/qa/zcp-b18/before-after-B06-labelled.png` (`-view.png` 900 px), `out/qa/zcp-b18/before-B06-sh02-seq-270.png`, `out/qa/zcp-b18/after-B06-sh02-seq-270.png`, `out/qa/zcp-b18/mask-B06-SH02-sheet.png`; DF-20261030-zcpaint-b06-shoulder-cap |

### Diagnosis (P18-2, from the picture and the geometry)

- The reach arm is drawn before the torso in the back view, so only the parts beyond the torso edge show. The problem was not the draw order: the shoulder root projects toward the vanishing point at head height (y 5.6), so the joint at lead 1 sat at about (0.63, 4.57), and the 0.19-head sleeve cap there rose 0.14 head above the back's shoulder slope beside the neck (pf 18).
- Fix: the root moves to the outer edge of the back (projects to about (0.74, 4.46); the torso edge at that height is 0.73). The lead still ramps with the existing minimum-jerk segment, so the rest pose is unchanged.

### Measurements and checks

- Geometry (`scratchpad/arm-geom.ts`, scratch, not in the repo; same modules; the real function was verified against the scan): highest reach-arm point between x 0.2 and 0.62 minus the back's top edge, pf 0–62: **+0.139 at pf 18 before → −0.027 (hidden) at pf 25 after**. Max reach ratio (|W−S| / 1.78): 0.980 at pf 15 before → **0.959 after** (pf 0 rest is the maximum; grasp pf 15 is inside).
- Scan of the offset (for the record): (0.02, 0.06) +0.139; (0.10, 0.00) +0.059; (0.12, −0.04) +0.010; (0.14, −0.06) +0.007; **(0.14, −0.10) −0.027**; (0.16, −0.08) −0.020; (0.18, −0.12) −0.042. The chosen offset is the first one with a clear margin.
- Decoded-RGB diff, 32 frames, pass 17 (`out/qa/zcp-b18/before/`) vs pass 18 (`out/qa/zcp-b18/after/`) (`out/logs/zcp-b18-rgbdiff.log`): changed = B06-SH02 f8/f15/f24/f32/f41/f50/f62 (arm outline only, masks checked) and B09-SH01-TH f57, B09-SH01-EN f57, B09-SH02 f30, B09-SH03 f40 (hands). Identical: B02-SH01-TH f7, B02-SH02-TH f20, B02-SH03 f39, B03-SH01-TH f14, B04-SH02-TH f180, B04-SH04-TH f11, B05-SH01-TH f40, B05-SH02 f50, B05-SH03 f40, B06-SH03 f5, B09-SH02B f0. Render-noise class (≤ 6 levels, ≤ 534 px; same class as pass 17 DF-20261030-zcpaint-figure-texture-residual): B01-SH01 f36 (534 px, max 6), B01-SH02 f33, B04-SH01 f30, B04-SH03a f20, B06-SH01 f150, B06-SH02 f0 (4 px, max 1: the rest pose is unchanged), B07-SH01 f45 (11 px, max 4), B07-SH02 f60, B08-SH01 f96, B10-SH01 f112.
- `npx tsc --noEmit` exit 0 (`out/logs/zcp-b18-tsc.log`, empty); `npx eslint src/painted/zcpaint/{fridge,body6,bust}.ts` exit 0 (`out/logs/zcp-b18-eslint.log`); `node --import tsx --test tests/zcpaint-proj.test.ts` 7 of 7 (new test "B06-SH02 shoulder cap (pass 18)": worst −0.027 ≤ 0); `npm test` 158 of 158 (`out/logs/zcp-b18-npmtest.log`).
- WORLD FOG 21-frame md5 (`render-frames.sh src/painted/spike/index.ts out/qa/zcp-b18/wfog-after`) vs `out/qa/zcp-r26/wfog-final/md5.txt`: **21 of 21 identical** to `out/qa/zcp-r26/wfog-final/md5.txt` (`out/logs/zcp-b18-wfog-vs-ref.log` empty; run `out/logs/zcp-b18-wfog.log`, frames `out/qa/zcp-b18/wfog-after/`).

### Deviations and questions (for Film and Mark to revalidate; Boss does not edit the sheets)

- `Q-P18-1` B06-SH02: the elbow flares further out during the draw-in (projected x 1.48 → 1.63 at pf 48–62, the box held at the chest). The pole is unchanged; the user's look check decides whether the flare reads. Options if not: a pole with less outward component for the draw-in (Boss), or a Film/Mark note.
- `Q-P18-2` B09 seated: the mitten is BODY-ZCP-6H (0.26 across); the sheet still says "closed fist" (HD-04) for the knee hug. Film and Mark revalidate the wording in the next revision; Boss did not edit the sheets.
- The `fist` branch of `handParts` stays (no other fist use found in `src/painted/zcpaint/`; POV uses its own palm/fist code in `pov.ts`); removing it is outside this fix.

### Not run / limitations

- Studio cold load, play/pause, backward scrub and unordered seeks (`npm run start`): not run. The plates are pure functions of the plate frame; seek parity is not observed.
- Neighbour boundaries B06-SH01 → B06-SH02 → B06-SH03 and B09-SH02 → B09-SH02B not checked in a sequence.
- Visual evidence: frames above viewed; the B09 mitten crops at full resolution not checked (540 px tiles only).
- The geometry check uses the reach-arm vertices against the `BUST_TEE` top edge, not the rendered pixels; the pixel evidence is the sheets and masks.

### Scripting and tool lessons (this pass)

- The Bash tool runs zsh: an unquoted `$SPEC` does not word-split, so `plate-stills.sh OUT $SPEC` passed one long argument and failed with `Frame NaN is not finite`. Use `${=SPEC}` (zsh) or pass the words explicitly. The first baseline attempt failed for this reason; the rerun is the one used.
- `timeout` is not installed on macOS; a `sed -i` replacement with `\n` broke the scratch file (line 2 read as a `sed` command). Use a heredoc or a short Python edit for multi-line changes.
- Foreground `sleep` is blocked by the harness; wait on background-task completion instead.

### Proposed document changes (TL/DP; not applied)

- `scripts/zombie-condo-paint/` `plate-stills.sh`: document that the spec list must be split (`${=SPEC}` in zsh, or quoted words).
- `docs/boss-asset-workflow.md` projection note: a 3D joint projected toward the vanishing point moves up/inward; check the sleeve cap against the silhouette, not only the joint.

### Files changed (uncommitted, this pass)

- `src/painted/zcpaint/fridge.ts` (`SHOULDER_LEAD`, reach root).
- `src/painted/zcpaint/body6.ts` (`figSeatFloor`: two `mitten` hands, doc and comments).
- `src/painted/zcpaint/bust.ts` (`seatFloor`: two `mitten` hands, `MITTEN_6H` import, doc and comments).
- `tests/zcpaint-proj.test.ts` (import `H6`, `reachArm`; new test "B06-SH02 shoulder cap (pass 18)").
- `docs/dev-findings/DF-20261030-zcpaint-b06-shoulder-cap.md` (new), `docs/dev-findings/DF-20261030-zcpaint-seated-knee-mitten.md` (new), `docs/dev-findings.md` (two index rows), this section.
- Outputs (not committed): `out/qa/zcp-b18/` (`before/`, `after/`, `wfog-after/`, sheets, masks, `spec.txt`, `overview-spec.txt`), `out/painted/zcpaint/r26-overview3/` (24 frames, `overview-24-270.png`, `manifest.tsv`), `out/logs/zcp-b18-*`.

### Next

1. User look check of `out/painted/zcpaint/r26-overview3/overview-24-270.png` (B06-SH02 and B09 seated) and `out/qa/zcp-b18/before-after-B06-labelled-view.png`; answer `Q-P18-1`.
2. Film and Mark: B06-SH02 reach note (outer-edge shoulder; elbow flare at the draw-in) and the B09 seated hand wording (`Q-P18-2`).
3. Boss or the next invocation: Studio cold load and seek for B06-SH02 and B09; neighbour boundaries.

## 2026-10-30 — Editor pass 1 (R2.6): ZCPAINT-SHORT-TH and -EN, first assembled timeline

- Scope: Editor stage for `ZCPAINT-SHORT-TH` and `ZCPAINT-SHORT-EN` (Full tier). Inputs: brief `VB-ZCPAINT-SHORT-R2.6` (`VD-ZC-TL`, `VD-ZC-AU`, `VD-ZC-CAP`), sheets `ZCPAINT-SHORT-SS-R1.5`, scripts `ZCONDO-SHORT-{TH,EN}-R3` (`tts-th.txt`, `tts-en.txt`, ซับ chunks). Plates: the working tree as Boss left it (uncommitted; G4/G5 built, pass 16). Nothing committed; `delivery.md` not edited; no plate code touched.
- Runtime status: `existing-integrated` for the registry (`src/videos/zombie-condo-paint/index.ts`, two compositions), the narration/caption/sfx/audio/quadText fields and the painted plate IDs. Captions use the shared outline preset at `middle` (`S-09` (c) missing, see ED-5).

| ID | Item | Status | Evidence |
| --- | --- | --- | --- |
| ED-1 | Registration: `ZCPAINT-SHORT-TH` / `-EN` in `src/videos/zombie-condo-paint/index.ts`; one scene per beat B01–B10 (the shipwreck convention); `ending: 'A_fade'`; chrome off; outline captions, middle | built | `tests/zombie-condo-paint.test.ts` 5 of 5 pass; `out/logs/zcp-e4-test.log` |
| ED-2 | TH narration: Niwat +5% **stand-in** (`scripts/zombie-condo-paint/short/vo-TH.json`); the user's Botnoi render is not in the repo (`index.md` "Measured audio" open) | built as stand-in; replace with `narration_files.py` Botnoi files | `public/narration/ZCPAINT-SHORT-TH.mp3` 71.20 s |
| ED-3 | EN narration: `en-US-GuyNeural` +5% (Q-EN1 open: voice and rate were never fixed; Editor's pick, not user-approved) | built | `public/narration/ZCPAINT-SHORT-EN.mp3` 71.00 s |
| ED-4 | Timing re-lock: `place-narration.py` pins each speech onset to its anchor and reports overlaps; TH B05 SH03 holds +0.4 s and B06 onward +0.4 s; EN: "Shut it. Lock it." split into two utterances with the same words (anchors 4.7 / 5.4); EN B07–B09 overflow absorbed by held plates; EN knocks after "Then, a knock." (60.9) so the 1.5 s silence follows them | built; `measure.json` per language | TH totals 71.2 s, EN 71.0 s (R3 estimate ≈70.8 / ≈70.1) |
| ED-5 | Captions: TH = script ซับ chunks (verbatim; "ปิด! ล็อก!" merged; "ในโลกนี้... พวกมันตามเสียง" with the script's ellipsis); EN = one per `tts-en.txt` line; authored `\n` at word boundaries on 14 long lines (`caption` key in `vo-*.json`; VO words unchanged). Placement `middle` (fallback: `Subtitles.tsx` has top/middle/bottom only; block bottom at y 1248 needs `S-09` (c)) | built; `middle` open | `caption-breaks.mjs`: TH 0 flags; EN 4 `BREAK-MID-WORD` and 7 `MAY-WRAP` flags, all on English word boundaries (the tool segments Thai, so it joins English words at the authored `\n`); EN frames viewed, no split word |
| ED-6 | Screen-space text (S-08 fallback `quadTexts`, positions from the sheets): B04 roof tank / pump / power out (red); B06 cold-clock device lines (SH01 box, then SH02+ strip); B09 day card and numerals 2 / 4 / 12%; B10 choice labels in order | built; numeral x positions approximate | 10 TH + 14 EN overlay entries in `cues-*.json` `overlays` |
| ED-7 | Sound: 24 generated cues (Stable Audio 3, measured picks, filed to the shared library with `--picked`, not listened) + 9 library reuses; full list below | built; **no human listening yet** | `scripts/sound-library.py index`: 90 sidecars, 90 rows, 0 mismatches |
| ED-8 | B02 pound blows from `poundJoltFrames(lang)` (one fist blow per jolt after the slam; hold blows every 0.45 s until 0.8 s before the power cut) | built | `tests/zombie-condo-paint.test.ts` (blow at each jolt frame ±1) |
| ED-9 | Render and QA: 20 stills (`editor-stills.sh`, `--gl=angle`), 2 contact sheets, caption-zone numbers, seek check (reverse order), 15 s audio check, full MP4 per language with the repo loudness step | done; Studio not run | see Checks |

Story scenes: `S01` is the only story scene in the ID plan; beats B01–B10 are used as the user-facing scene samples (one still per beat per language), following the shipwreck precedent.

### Timing decisions (for Mark and Film to revalidate)

- TH: B01–B04 keep the R3 anchors. TH-08 at 7.75 (was 7.6), TH-12 at 14.8, B05 SH03 cistern hold +0.4 s (34.5), B06 onward +0.4 s (B06 34.5, B07 43.5, B08 49.4, B09 54.4, B10 65.0; end 71.2). Knocks 61.1 / 61.55 / 62.0 (three copies of one knuckle rap at 0.45 s).
- EN: B01–B06 near anchors (EN-02 1.3, EN-06 7.2, EN-13 25.4, EN-14 27.95, EN-15 28.9, EN-16 30.2, EN-22 45.6); B07 SH01 45.3 and SH02 47.6; B08 51.4 (so the flare pf 84 lands on "Only smoke and fire." at 52.9); B09 55.4 / 59.3 / 60.9 (SH02B tilt on knock 1) / 62.2; B10 64.0 (end 71.0).
- Plate `fromSec` per language from the sheet index (B02-SH02 TH 0.1, B02-SH03 TH 0.7, B04-SH01 TH 0.3, B05-SH02 TH 1.2 / EN 0.5, B06-SH01 TH 1.5 / EN 2.5, B07-SH01 TH 0.5 / EN 0.9, B07-SH02 TH 0.3 / EN 0.5, B08 TH 0.5 / EN 1.3, B10 TH 1.0 / EN 0.5).
- Known sync gaps: the EN gurgle (`water_bucket-pour-gurgle_01`) peaks about 1.2 s after "มันลงเอง" / "if it drains" (TH 26.2 pour, EN 29.97); the library candidate `v2` has its peak nearer 1.6 s and may fit better. Cabinet thud placed so the thud lands on B02-SH02 f 3 / f 6 (TH 6.7 / EN 6.8).

### Sound cues (`cues-*.json`; library IDs; listened: no)

- Generated and filed (`sfx/...`, `music/tone/...`, `ambience/city/...`): `foley_door-latch-hinge_01`, `foley_footsteps-run-slam_01` (trimmed 0.58 s, hit at file 1.15 s), `creature_neck-creak-wet_01`, `impact_door-slam-body_01`, `foley_deadbolt-clack_01`, `foley_bag-drop-tile_01` (very low), `foley_cabinet-scrape-thud_01`, `impact_power-cut-whoomp_01`, `water_tap-fill-containers_01`, `foley_lid-snaps-three_01`, `tension_clock-pulse_01` (loop), `water_bucket-pour-gurgle_01`, `foley_cistern-lid-tap_01`, `foley_fridge-seal-pop_01`, `foley_fridge-seal-thump_01`, `foley_packaging-rustle_01` (also the TH/EN wrapper rustle), `foley_can-setdown-laminate_01`, `mechanical_canister-handling_01`, `stinger_low-muted-hit_01`, `impact_knuckle-rap_01`, `impact_sub-hit-short_01`, `foley_fist-blow-door_01`, `tone_thin-unresolved_01` (B10; loudnorm dynamic, about -24 LUFS; leveled on the timeline), `city_distant-fire-crackle_01` (loop).
- Library reused: `room_shop-fridge-hum_01` (unit tone, not looped), `electric_light-flicker-buzz_01`, `reveal_riser-tension_01`, `tension_heartbeat-slow_01`, `bed_dark-drone-sub_01` (drone; the B03 fade-in at the end of the held silence), `room_dark-empty-building_01` (room tone; creaks or drips not heard, "with care" unverified), `nature_wind-eerie-street_01` (B08), `reveal_glass-shimmer-soft_01` (B05 chime), `ui_click-tick_01` (B09 counters).
- Not used: `whoosh_air-swish-rising_01` (optional, B03 whip; omitted for restraint), `creature_zombie-snarl-lunge_01` (optional layer; not found in the index), `foley_door-pound-wood_01` (replaced by the single fist blow so each jolt is one hit).
- Licence: generated audio falls under the Stability AI Community License (commercial-use eligibility is the user's decision). `public/sfx/NOTICE` and `public/audio/NOTICE` have a ZCPAINT block (`copy-sounds.sh`).
- Loudness: `public/sfx` masters were processed at peak ceilings -1 to -9 dBFS (library rule is -1 for sfx; levels set on the timeline instead; deviation noted).

### Checks (this pass)

- `npx tsc --noEmit` exit 0; `npx eslint` on the new files exit 0; `npm test` (full) and the ZCPAINT test file (5 of 5) pass (`out/logs/zcp-e4-test.log`).
- Stills: 20 frames (`out/samples/zombie-condo-paint/<ID>/editor-pass1/`, manifest.tsv with composition and plate frames), contact sheets `TH-sheet-editor-pass1.png`, `EN-sheet-editor-pass1.png`. Viewed; captions read with the outline, the overlays appear in place, the B08 flare and the B10 labels are right.
- Caption zone (band y 860–1060, middle placement, `caption-zone.py`): 18 of 20 frames fail the default thresholds (mean ≤ 0.25, p95 ≤ 0.40; means 0.10–0.86). Expected without shade (user, Boss pass 8/9); judged on the outlined text. Full-resolution crops (`out/samples/zombie-condo-paint/crops/caption-crops-TH-EN.png`) read clearly. Two TH lines previously crossed x 888 (safe box); fixed with authored breaks.
- Seek parity: 5 stills re-rendered in reverse order (`seekcheck-reverse/`): 2 identical, 3 differ by PSNR 81–107 dB (a few levels on a few pixels, the documented render-run noise class). Not a state difference. Studio cold load, play/pause and unordered seeks in Studio: not run.
- Audio: 15 s check (B01–B03): -15.5 LUFS integrated, -2.3 dBTP. Full MP4 after `scripts/loudness.mjs`: TH -14.0 LUFS, -1.5 dBTP (was -15.7 / 0.1, dynamic); EN -14.0 / -1.5 (was -15.7 / 0.1, dynamic). Narration tracks: TH -15.8 LUFS / -1.7 dBFS, EN -15.8 / -1.8 (`loudnorm` to -14 / -1.5 at 48 kHz). Found and fixed: the first loudnorm pass returned 4x the samples (192 kHz internal rate) and would have slowed the narration; output rate is now forced to 48 kHz and the duration is checked (71.20 / 71.00 s).
- Full renders: `out/ZCPAINT-SHORT-TH/ZCPAINT-SHORT-TH_A_fade.mp4` (2136 frames, 1080×1920, 30 fps, AAC 48 kHz stereo) and `out/ZCPAINT-SHORT-EN/ZCPAINT-SHORT-EN_A_fade.mp4` (2130 frames). MP4 frames at 12.5 / 40.0 / 56.0 / 66.5 s tiled in `out/samples/zombie-condo-paint/mp4-check-TH-EN.png` (viewed).

### Open items and deviations (route as noted)

- ED-5 / `S-09` (c): caption block bottom at y 1248 needs a shared position (Boss). Until then `middle` (centre y 960) covers faces in some frames (B01-SH01 TH f 45 on the back of his head; B06 captions over the arm). Also `S-09` (b): TH long lines still reach x 950 without the authored breaks; the breaks fix the line lengths only.
- Plate/staging notes for Film and Mark (no plate change made): EN B06-SH02 device lines at 44 s sit over the dark open-fridge interior (low contrast); B09 numerals need a check of their x positions against the painted icons; B04 labels are small at 216 px (check at full size).
- Narration: TH stand-in (ED-2). EN voice (ED-3). Thai narration unchanged.

### Questions for the user (relay through the coordinator)

- Q-ED-1 TH narration: send the Botnoi render (per-beat MP3s for `narration_files.py`, or one file plus cut points). Until then the TH timing is the stand-in's.
- Q-ED-2 EN voice (Q-EN1): accept `en-US-GuyNeural` +5%, or name another.
- Q-ED-3 Caption placement: keep `middle` until `S-09` (c), or ask Boss now for a bottom placement at y 1248.
- Q-ED-4 Listening: the prominent cues need a human ear before approval: footsteps + slam + bolt (B01–B02), fist pounds, pour and gurgle, power-cut whoomp, knocks + sub hit (B09), the B10 tone, the drone bed and its licence.
- Q-ED-5 Ending: `A_fade` (fade over the last second after a 3 s hold) as set, or a hard cut to black (brief allowed either).
- Q-ED-6 Export loudness: the repo target is -14 LUFS; the mix now needs dynamic loudnorm on the loudest moments. Keep -14 or accept -16 for the Short?

### Files changed (uncommitted)

- `src/videos/zombie-condo-paint/index.ts` (new), `tests/zombie-condo-paint.test.ts` (new).
- `scripts/zombie-condo-paint/place-narration.py`, `measure-sfx.py`, `copy-sounds.sh`, `editor-stills.sh` (new); `scripts/README.md` (4 rows).
- `scripts/zombie-condo-paint/short/vo-TH.json`, `vo-EN.json`, `cues-TH.json`, `cues-EN.json`, `ZCPAINT-SHORT-{TH,EN}.lines.json`, `ZCPAINT-SHORT-{TH,EN}.amplitude.json` (new).
- `public/narration/ZCPAINT-SHORT-{TH,EN}.mp3`, `public/sfx/**` and `public/audio/**` (copies, git-ignored MP3 only where applicable; WAV copies are not ignored, so commit only what the episode needs), `NOTICE` blocks.
- `out/` (ignored): stills, sheets, MP4s, logs, the library processing outputs.

### Next

1. Boss: `S-09` (c) placement; S-09 (b) width check on the TH lines after the breaks; look check of the overlays at full size.
2. User: Q-ED-1 to Q-ED-6, and a listen to the prominent cues.
3. Film/Mark: the EN device contrast and the sync gaps above; Mark to note the TH/EN timing re-lock in the sheets (`timing estimated` → measured).

## 2026-10-30 — Boss pass 19 (TH fixes after the Editor pass 1 review)

- Scope: delivery record "Editor pass 1 review" (not edited), Thai only (EN parked; no EN plate rebuilt or rendered). Stable IDs `P19-1` B07-SH01 hand, `P19-2` toilet B05-SH01/02/03, `P19-3` walk cycle B04-SH01/B06-SH01, `P19-4` captions at y 1248. Uncommitted. **Built and frame-checked by Boss; not a user look check.**

| # | Item | Result | Evidence |
| --- | --- | --- | --- |
| P19-1 | B07-SH01 hand | the `pinch` (two sticks) replaced by a BODY-ZCP-6H-style mitten (thumb lobe, cuff, sleeve) resting on the case front at the clasp. The reach arm keeps the elbow low and the forearm rising (the case sits at chest height 0.4 head in front of him, so a straight arm is impossible); new `lay` field on the side-view `reach` pose (`bust.ts`) folds the hand forward at the wrist (`B07_LAY` 1.15 rad) so the fingers lie on the case, not up the forearm (no wai: a test render at `lay` 0.3 read as a prayer hand and was rejected). Rest pose pf 0-15 and 75+ unchanged. | `out/qa/zcp-b19/before-after-b19-view.png`, `out/qa/zcp-b19/t1.png` |
| P19-2 | Toilet | new `src/painted/zcpaint/toilet.ts` (`paintToilet`, `toiletWater`): ONE front, slightly raised toilet: oval seat ring with bowl opening and water, raised seat lid with hinges, tank with lid slab, chrome flush button on the lid top and a side lever. Used by B05-SH01 (background, scale 0.5, dimmed), B05-SH02 (scale 1.45, the pour lands on `toiletWater`, siphon swirl follows it), B05-SH03 (scale 1.7, the tank lid with its button lifts off, the mitten holds the lid edge, clear water in a cutaway tank window; part 3 and the icons unchanged) and `ZCP-B05-SH03-BOWL` (scale 3.2, red cross on the bowl water). Shot IDs, frame counts, keys and cues unchanged. The section-plate bathroom fixtures in `rooms.ts` (B04/B06 cut view) are the old boxes and were not changed (not in the user report). | same sheet, `out/qa/zcp-b19/t2.png` |
| P19-3 | Walk cycle | `figSide` option `gait` (phase in strides) and `gaitBlend`: hip-driven two-bone legs (`GAIT_LEG` 1.44), stance 60 %, stride 2.6 heads, swing lift 0.34 head, heel and toe tilt, arm swing against the own-side leg (CP-P03). Phase follows the distance walked (`gaitPhase`, 0.2833 m per head), so a planted foot is fixed in the world. B04-SH01: stands facing the door pf 0-5, front-stand turn pf 5-10, first step pf 10-18, walks to Y 2.40, closing step pf 67-75 (travel same endpoints 0.70 to 2.40, speed now trapezoid). B06-SH01: walking from pf 0 (Y 2.70 to 4.45), slows pf 67-75, front-stand turn pf 75-80, then the profile facing the fridge as before (the hover pf 100-190 unchanged). Section feet: no cast or contact change except the lifted foot drops its contact ellipse. | `out/qa/zcp-b19/t3.png`, `t4.png`, test `tests/zcpaint-gait.test.ts` (3 tests) |
| P19-4 | Captions | `CaptionStyle.bottomEdgeY` (composition y of the block's bottom edge; overrides `position`): `types.ts`, validator in `media.ts` (finite, 0-4320), `Subtitles.tsx` (`bottom: height - bottomEdgeY`), row in `docs/remotion-toolkit.md` 10a. Default path unchanged (no other video sets it). `ZCPAINT-SHORT-TH` is `{preset: 'outline', position: 'bottom', bottomEdgeY: 1248}`; EN stays `middle` (parked). Test updated. | TH comp stills `out/samples/zombie-condo-paint/ZCPAINT-SHORT-TH/boss19-cap/` (23 frames), `out/qa/zcp-b19/cap-1.png` |

### Caption crossing check (TH, section plates)

- Captions are drawn above the plate, so no column hides glyphs; the issue is contrast where a light wall edge or the fridge passes behind the text block (y about 1070-1248, which is the floor band of the wide section plates). Measured on caption-less plate stills with `capzone-undertext.sh` (x 150-930, y 1140-1248; limits mean 0.45, p95 0.60): B04-SH01 (pf 9-37) mean 0.35, p95 0.43-0.58 pass; B07-SH02 (pf 9-69) mean 0.34-0.43, p95 0.57 pass; **B06-SH01 (pf 45-159, comp 34.5-39.95 s) p95 0.65 on every frame (mean 0.39-0.41): fails the p95 limit by 0.05**, cause: the grey fridge (luma about 0.6) and the cream partition-edge wedge at the floor line. Viewed at 900 px with captions on (B04 f412-455, B06 f1040-1190, B07 f1405-1480): the white 51 px outline glyphs stay legible; the cream wedge at the floor line crosses the first line only at B04 comp f455 (the 2-line caption) and B06 comp f1040-1060.
- Not changed: a jamb tone test (`rooms.ts`) moved p95 only 0.58 to 0.55 and was reverted. Options if the user still sees a column over the captions: (a) the soft elliptical caption shade (`ZC-CAPSHADE`), which the user rejected for ZC plates in pass 9; (b) darken the partition wedge and the fridge face in `rooms.ts` for the three section plates (set art change, Film/Mark to revalidate); (c) move the fridge in B06-SH01. `Q-P19-1` below.

### Checks

- `npx tsc --noEmit` exit 0; `npx eslint` on the changed files exit 0 (`out/logs/zcp-b19-eslint.log`; one unused import removed); `npm test` 161 of 161 (`out/logs/zcp-b19-npmtest.log`; 3 new tests).
- WORLD FOG 21-frame md5 vs `out/qa/zcp-r26/wfog-final/md5.txt`: identical (`out/qa/zcp-b19/wfog/md5.txt`, `out/logs/zcp-b19-wfog.log`).
- Not run: Studio cold load, play/pause and unordered seek (plates are pure functions of the plate frame); neighbour cuts B03 to B04, B04-SH01 to SH02, B06-SH01 to SH02 checked only as stills; no MP4 re-render; no foot-slide pixel measurement (the world-fixed stance is asserted in the geometry test and viewed in 14-frame strips only).
- Walk limits: no hip bob; the leg stays within reach by lifting the ankle at the extremes (heel-strike toe up, push-off heel up); the first and closing steps blend feet from the stand pose (a short, slow slide at speed near zero). Turns are a 4 to 5 frame front stand, not a pivot step.

### Questions

- `Q-P19-1` B06-SH01 caption contrast p95 0.65 (limit 0.60): accept as is (legible in stills), or pick option (b) or (c) above?
- `Q-P19-2` The 10a row of `docs/remotion-toolkit.md` was edited for `bottomEdgeY` (runtime-contract requires the field documented with the code); revert it if rule documents must stay user-reviewed first.

### Files changed (uncommitted)

`src/painted/zcpaint/{toilet(new),inserts,bathroom,body6,bust,closeups}.ts`, `src/painted/shots/zcpaint.tsx`, `src/scenes/{types,media}.ts`, `src/scenes/Subtitles.tsx`, `src/videos/zombie-condo-paint/index.ts`, `tests/{zcpaint-gait(new),zombie-condo-paint}.test.ts`, `docs/remotion-toolkit.md`, this section. Outputs (not committed): `out/qa/zcp-b19/`, `out/samples/zombie-condo-paint/ZCPAINT-SHORT-TH/boss19-cap/`, `out/logs/zcp-b19-*`.

## 2026-10-30 — Editor pass 2 (TH): re-render after Boss pass 19

- Scope: `ZCPAINT-SHORT-TH` (A_fade) only. EN not rendered (parked by the user, delivery record). Inputs: Boss pass 19 (P19-1 to P19-4, uncommitted working tree, user look check approved, "re-render the TH MP4"). TTS lock held: Niwat +5 % stand-in, `public/narration/ZCPAINT-SHORT-TH.mp3` not regenerated (Q-ED-1 still open). No source, plate, cue, narration or timing change in this pass; `delivery.md` not edited; no plate code touched; nothing committed.
- Runtime status: `existing-integrated` for the TH composition in the working tree (`src/videos/zombie-condo-paint/index.ts`, `captionStyle` `bottomEdgeY` 1248). Bundle rebuilt from that tree (checkout `541385d` + uncommitted changes).

| ID | Item | Status | Evidence |
| --- | --- | --- | --- |
| E2-1 | Re-render TH MP4 after Boss pass 19 | done | `out/ZCPAINT-SHORT-TH/ZCPAINT-SHORT-TH_A_fade.mp4`; progress `out/logs/ZCPAINT-SHORT-TH-chunks.log`; chunks `out/ZCPAINT-SHORT-TH/chunks-pass2/c01.mov` to `c04.mov` (PCM audio) |
| E2-2 | Duration | done | video 2136 frames, 71.201 s, start 0; AAC 48 kHz stereo 71.193 s, start 0 (pass 1: 2136 frames, 71.200 / 71.193 s) |
| E2-3 | Loudness (`scripts/loudness.mjs`) | done | -14.0 LUFS, -1.4 dBTP, LRA 4.4 (before: -15.7 LUFS, -0.4 dBTP, LRA 4.1; dynamic). Pass 1 was -14.0 / -1.5. Within the -1 dBTP ceiling |
| E2-4 | Captions at bottom edge 1248 | checked | 10 beat stills and sheet (below); caption-breaks: 0 flags, 0 MAY-WRAP; caption-zone numbers below |
| E2-5 | Walk timing against the new frames | checked, no change | see Timing decisions |
| E2-6 | Footstep/foley sync | N/A: no cue references the walk | `cues-TH.json` has footsteps only at 4.6 s (B02 run); nothing changed |
| E2-7 | Chunk seams and frame mapping | checked | MP4 frames 533, 534, 1067, 1068 vs composition stills: each matches its own still at 41 dB and the neighbour at 24.4 dB or less (`out/samples/zombie-condo-paint/ZCPAINT-SHORT-TH/seam-pass2/`) |

### Timing decisions (for Mark and Film to revalidate; no change made)

Plate clock: pf = composition frame − beat start frame + `fromSec` × 30 (TH values from Mark's index).

- **B04-SH01** (beat start 13.700 s, `fromSec` 0.3 → pf 9 at the cut, window to 15.300 s = pf 56). Turn pf 5–10: only pf 9 is on screen (the turn ends at the cut). First step pf 10–18 = 13.733–14.000 s, under TH-11 (13.70–14.63 s). Closing step pf 67–75 falls after the B04-SH02 cut: not visible in TH or EN.
- **B06-SH01** (beat start 34.500 s, `fromSec` 1.5 → pf 45 at the cut, ends 40.200 s = pf 215). The cut lands mid-walk: pf 45–67 is the walk (34.500–35.233 s), slow pf 67–75 (35.233–35.500 s), turn pf 75–80 (35.500–35.667 s), fridge hover pf 100–190 (36.333–39.000 s). The walk and turn sit under TH-22 (34.50–36.47 s); the hover runs under the end of TH-22 and TH-23 (37.80–39.95 s). The walk from pf 0 is not in the TH cut.
- The index composition frames (`B04-SH01 [411, 459)`, `B06-SH01 [1023, 1194)`) predate the TH re-lock (+0.4 s from B05 SH03 on): B06 now starts at 1035. The `fromSec` values match Mark's TH conform (0.3 and 1.5) and are kept.
- Decision for the user: whether the TH B06 entry should show the full walk (`fromSec` 0 moves the hover to 37.83–40.20 s). That changes Mark's conform, so it is routed as Q-E2-1, not applied.

### Sound (no cue change; listened: no)

- `cues-TH.json`, the narration file and the amplitude envelope are unchanged. The walks are silent by design: both walk windows sit under narration (TH-11, TH-22), and there is no speech gap during either walk (B04 walk ends 14.00 s, next gap starts 14.63 s; B06 walk ends 35.67 s, next gap starts 36.47 s). EP08: one foreground sound at a time, so no footstep cue was added.
- Listen for: whether the two walks feel silent. If the ear wants them, add soft footsteps in the gaps only (none exists inside either walk window), with a sound-generation search first.

### Checks (this pass)

- Bundle: `out/zcpaint-editor/bundle` rebuilt from the current tree (`out/logs/ZCPAINT-SHORT-TH-bundle.log`). The pass 1 bundle predates Boss pass 19 and was deleted before rendering.
- Tests: `node --import tsx --test tests/zombie-condo-paint.test.ts` exit 0 (`out/logs/zcp-p2-test.log`). No source changed, so `tsc` and the full suite were not rerun.
- Caption breaks: `node scripts/caption-breaks.mjs out/zcpaint-editor/timeline-TH-pass2.json` → 0 bad breaks, 0 MAY-WRAP.
- Caption zone (`caption-zone.py --band 860:1248`, mean / p95 by beat): B01 0.42 / 0.73; B02 0.63 / 0.83; B03 0.37 / 0.66; B04 0.50 / 0.77; B05 0.82 / 0.94; B06 0.53 / 0.81; B07 0.45 / 0.81; B08 0.11 / 0.19 (pass); B09 0.24 / 0.65; B10 0.45 / 0.64. Nine of ten fail the default thresholds (mean ≤ 0.25, p95 ≤ 0.40): cream or white plates with outline captions and no shade (user's pass 8/9 decision). Judged by eye on the outlined glyphs in the sheet; captions read at the new position, none crosses a face.
- Walk check at 540 px (`walk-B04-B06-540.png`): B04 f430 mid-stride with both feet on the floor; B06 f1060 at the fridge, caption legible. Foot slide is not measured (stills only).
- Not run: Studio cold load, play/pause, unordered seeks, a human listen, the EN render (parked).

### Scene samples (integration samples, TH, one per beat; S01 with beats as scene samples, shipwreck precedent)

| Beat | Composition frame | Beat-local frame | Still | Image |
| --- | --- | --- | --- | --- |
| B01 | 45 | 45 | `B01_f45.png` | corridor, the door |
| B02 | 180 | 27 | `B02_f180.png` | door pound, cabinet |
| B03 | 370 | 19 | `B03_f370.png` | POV corridor lights |
| B04 | 430 | 19 | `B04_f430.png` | walk, first steps (B04-SH01) |
| B05 | 880 | 139 | `B05_f880.png` | toilet, cistern lid (B05-SH03) |
| B06 | 1060 | 25 | `B06_f1060.png` | walk to the fridge (B06-SH01) |
| B07 | 1350 | 45 | `B07_f1350.png` | hand at the stove case (B07-SH01) |
| B08 | 1575 | 93 | `B08_f1575.png` | fire flare on the line |
| B09 | 1740 | 108 | `B09_f1740.png` | day card |
| B10 | 2010 | 60 | `B10_f2010.png` | choice labels |

- Location: `out/samples/zombie-condo-paint/ZCPAINT-SHORT-TH/editor-pass2/` (manifest.tsv, `TH-sheet-editor-pass2.png` 5 × 2, `walk-B04-B06-540.png`). Revision: source `541385d` + uncommitted Boss pass 19 and Editor pass 2 scripts. Label: integration sample, not a look approval.
- Reproduce: `sh scripts/zombie-condo-paint/render-chunks.sh ZCPAINT-SHORT-TH 534`; `sh scripts/zombie-condo-paint/editor-stills.sh editor-pass2 ZCPAINT-SHORT-TH B01:45,B02:180,B03:370,B04:430,B05:880,B06:1060,B07:1350,B08:1575,B09:1740,B10:2010`; `sh scripts/qa-sheet.sh <OUT.png> --cols 5 --width 270 <10 stills in beat order>`.

### Scripting and tool lessons (this pass)

- AAC chunks do not join cleanly. Each chunk's AAC decodes about 13 ms off its frames, so the first join drifted about 60 ms, and `-shortest` then dropped two video frames (2134). Fix in `render-chunks.sh`: chunks as `.mov` with `pcm-16` audio (exact samples), a video-only join, one AAC encode with an explicit `-t`, and a frame-count guard before and after the loudness pass.
- `scripts/loudness.mjs` uses `-shortest`, which can cost a video frame when the container duration runs past the audio end. It did not here (2136 frames), because the join now ends both streams at 71.2 s. Proposed for Boss/TL review (not applied): replace `-shortest` with an explicit duration.
- `editor-stills.sh` bundles only when the bundle folder is missing, so a stale bundle would render old plates. This pass deleted the bundle first and `render-chunks.sh` rebuilds it on every run. Proposed (not applied): make the stills script rebuild too.
- `timeout` is not available in this shell (macOS); the probe was rerun without it.

### Questions (relay through the coordinator; not asked here)

- `Q-E2-1` B06-SH01 entry: keep the mid-walk cut at pf 45 (the walk is seen from 34.5 s, about 0.7 s before the slow), or show the walk from pf 0 (`fromSec` 0; Mark's conform changes, the hover moves to 37.83–40.20 s)? Route to Mark if changed.
- `Q-E2-2` Walk sound: keep both walks silent (current), or add soft footsteps in the gaps? None fits inside the walk windows.
- Still open from pass 1: `Q-ED-1` (Botnoi render), `Q-ED-4` (a listen to the prominent cues), `Q-ED-5` (ending `A_fade`), `Q-ED-6` (loudness -14 or -16 LUFS). `Q-P19-1` accepted by the user (delivery record).

### Files changed (uncommitted, this pass)

- `scripts/zombie-condo-paint/render-chunks.sh` (new), `scripts/README.md` (1 row), this section.
- Outputs (ignored, under `out/`): `ZCPAINT-SHORT-TH/ZCPAINT-SHORT-TH_A_fade.mp4`; the pass 1 MP4 kept at `ZCPAINT-SHORT-TH/pass1/ZCPAINT-SHORT-TH_A_fade.mp4`; `ZCPAINT-SHORT-TH/chunks-pass2/`; `samples/zombie-condo-paint/ZCPAINT-SHORT-TH/editor-pass2/` and `seam-pass2/`; `logs/ZCPAINT-SHORT-TH-chunks.log` and `zcp-p2-*.log`; `zcpaint-editor/timeline-TH-pass2.json`.

### Next

1. User: watch the B04 and B06 walks in the MP4 (`out/ZCPAINT-SHORT-TH/ZCPAINT-SHORT-TH_A_fade.mp4`) and listen to the TH mix once; decide `Q-E2-1` and `Q-E2-2`.
2. Mark (only if `Q-E2-1` changes): TH `fromSec` for B06-SH01 and the index frames after the re-lock.

## Boss retime pass: painted TH keys (SS-R1.6 / SS-R1.7, 31 Oct 2026)

Source: index "SS-R1.6 retime list" (SS-R1.7 call +59 f). Painted code only; EN plates, EN IDs and EN timing unchanged (EN frame check below). Not committed.

- **TH-only plate IDs (Editor repoints `cues-TH.json`; EN cues keep the old IDs):** `ZCP-B01-SH02-TH` (push 53 f; charge pf 33-52, bob 33/38/43/48), `ZCP-B04-SH03a-TH` (push 78 f), `ZCP-B04-SH03b-TH` (push 22 f), `ZCP-B05-SH03-P1-TH` (push 132 f from its fromSec 0.7), `ZCP-B06-SH02-TH` (push 76 f), `ZCP-B08-SH01-TH` (B08_KEYS TH: flare 98-124, slump 166-176, push 245), `ZCP-B09-SH02-TH` (push 62 f), `ZCP-B09-SH03-TH` (push 96 f), `ZCP-B10-SH01-TH` (back view every frame, push 191 f). The retime list named three; the other six exist because the shared plate's TH push length differs from its EN one.
- **Re-keyed TH in place:** B02-SH01 bolt 22-26; B03 living 22 / neighbour 23; diagram 23 / 51 / 95 / drain 155-230 / strike 230; LIDS 3 / 7 / 11; B05 icons 0 / 39; LIFT 37-53; `ZCP-B02-SH01-TH` push 91 f; `ZCP-B04-SH03c-TH` 19 f (fill and push); `ZCP-B04-SH04-TH` push 41 f; `ZCP-B05-SH01-TH` push 81 f; `ZCP-B09-SH01-TH` push 198 f and counter keys 36 / 84 / 136.
- **Blow export:** `B02_TIMING.TH.blowsTo` = 551 (B02-SH03 pounds and the B03 fade), so the TH list runs 218 to 535. The plates still read only the SH01/SH02 jolts. EN `blowsTo` = 318, unchanged.
- **Comments:** "knock" removed where TH is now the call (`b09.ts`, `povshots.ts`, `closeups.ts`). Also corrected: `diagram.ts`, `inserts.ts`, `bathroom.ts`, `fridge.ts` header lengths.
- **Not applied / open:** (1) the B06-SH01 device overlay (clock and tick icons, TH f 68 / 98 / 160 / 190) is not in the checkout (no clock/tick code under `src/painted`), so its keys cannot be re-keyed; (2) B04-SH03a/b fill keeps its EN rise (39 f / 12 f) and holds, as the sheet allows; (3) EN pounds in B02-SH03 / B03 are not extended (EN frozen); the EN sheet also describes pounding there, so this needs a Mark decision.
- **Tests (not edited, Editor-owned):** `tests/zcpaint.test.ts` line 20 (blows inside `sh02[1]`; TH now uses `blowsTo`) and line 117 (`boltAngle('TH', 7) === 90`; TH bolt is now 22-26) fail by design. The B08 mapping test still passes but its comments describe the old TH clock.

## 2026-10-31 — Editor pass 3 (TH, SS-R1.7: Gemini read + B09 call)

Inputs: index `ZCPAINT-SHORT-SS-R1.7` (TH frames) and its "SS-R1.6 retime list" (Editor part); Boss retime report ("Boss retime pass" above; TH-only IDs). Narration: candidate `projects/ZCONDO/audio/gemini-tts/zcpaint-th-call/candidate/ZCPAINT-SHORT-TH.candidate-call.mp3` (sha256 e979a731…, 93.15 s), locked with `store.py use` to `public/narration/ZCPAINT-SHORT-TH.mp3` (Git-tracked; the lock entry is in `assets.lock.json`). Amplitude `ZCPAINT-SHORT-TH.amplitude.json` already from the candidate: 2795 f; call 2550–2587 active, 2590–2626 silent, TH-37 2632 active (checked). `ZCPAINT-SHORT-TH.lines.json` unchanged. `store.py fetch zombie-condo-paint` restored the 33 locked `public/` audio/sfx files (missing in this checkout).

Changes (uncommitted):
- `scripts/zombie-condo-paint/short/cues-TH.json` regenerated: `durationSec` 95.9 (2877 f); beats at 0 / 216 / 518 / 580 / 1072 / 1468 / 1810 / 2044 / 2290 / 2686 f; shot IDs and `fromSec` per the index TH map and Boss's TH-only IDs; `sheetRevision` SS-R1.7.
- `src/videos/zombie-condo-paint/index.ts`: `captionsFor` clamps a caption onset at 0. TH-11 (“แต่ก๊อกน้ำยังไหล”) is measured at 19.318 s, 0.5 f before B04 (580 f). EN is unaffected: the resolved EN episode object is byte-identical before and after (JSON snapshot compare).
- Tests: `tests/zombie-condo-paint.test.ts` (TH 2877 f; amplitude 93.15 s; new test "TH cue events (SS-R1.7)"); `tests/zcpaint.test.ts` (blow range to TH `blowsTo` 551; TH bolt 22–26; plate comparison limited to SH01/SH02).

Editor decisions not in the index (Mark to confirm):
1. B09 day card and counters (`วันที่ 3`, `2`, `4`, `12%`) end at the B09-SH01 cut (2488). The cue file carried them over the B09-SH02/SH02B/SH03 shots; the sheet places them in B09-SH01 with the painted icons on that plate.
2. B04 diagram labels: `ปั๊ม` from 667, `ถังบนดาดฟ้า` from 695, `ไฟดับ` from 739 (sheet keys 23 / 51 / 95), held to the SH02 cut (912).
3. B06 device text (`ตู้เย็น…`, `ช่องแช่แข็ง…`, `กระป๋อง ท้ายสุด`): lines at 1536 / 1628 / 1760, the pass-1 box layout (SH01 box to 1681, strip after), held to the B07 cut (1810). Text still `pending-label-check` (Preaw/Boat). The painted clock/tick icons (TH f 68/98/160/190) are not in the checkout (Boss).
4. B10 labels at 2696 / 2728 / 2772, held to the last frame (sheet TH f 10 / 42 / 86).
5. Beds: drone out at 2550 (sheet: drone out by the last frame before the call); clock pulse enters at 874 (sheet step 6) and thins at TH-27 onset 1892 (±0.3 s, the word time is not measured), out at the B08 cut; heartbeat ends at the B02-SH03 freeze word (468); B09-SH03 room tone starts after the true-silence section (2632); fridge hum and the electric buzz end at the power cut (527).
6. SFX not in the index kept from pass 2 at their shot-relative offsets: bag thump 222 (sheet B02-SH01 f 6), creature neck creak 170 (sheet B01-SH02 f 7; library stand-in, sheet says NEEDS-GEN), tap-fill 912 (library placeholder for the per-container fills, NEEDS-GEN). `foley_cistern-lid-tap_01` now sits at the lift start 1109 (sheet B05-SH01 f 37, lid tap) with `trimStartSec` 0.7; the bucket creak is not placed.
7. Lid snaps: `foley_lid-snaps-three_01` (1.25 s; transients at ~0.09 s and ~0.98 s, not the sheet's 4-frame spacing) is used once per snap at 1034 / 1038 / 1042 with `trimStartSec` 0.08 and `durationSec` 0.12. Listen before approving.
8. Riser `reveal_riser-tension_01` runs 80 → 196 (`durationSec` 3.867; the sheet stops it at SH02 f 33).

Checks (this pass):
- `tsc --noEmit`: clean. `npm test`: 248 pass, 0 fail (before: 247 tests, 7 fail: registry, CATBOX, the two Boss-retime asserts, and the three cue-driven ZCPAINT tests). Logs: `out/logs/zcp-th-after-test.log`, baseline `out/logs/zcp-th-baseline-test.log`. eslint on the three changed files: clean.
- `scripts/caption-breaks.mjs` on the TH timeline (cues as scenes): 0 bad breaks, 0 MAY-WRAP.
- Stills (`render.mjs --stills`, one Chrome, `--gl=angle`): 38 frames in `out/ZCPAINT-SHORT-TH/stills/`. Sheets: `out/qa/zcp-th-ss17/B09-B10-sheet-v2.png` (2290–2876, cut and event frames), `out/qa/zcp-th-ss17/B04-B06-overlay-sheet.png`.
- `scripts/caption-zone.py` (B10 and the sub-hit caption): mean 0.21–0.46, p95 0.55–0.65; every B10 caption frame fails the default (mean ≤ 0.25, p95 ≤ 0.40) because the caption sits over the cream door. The outlined white captions over cream were the approved basis (delivery record, Boss pass 8/9 and P15-2). Recorded as a fail on the numbers, not a pass.
- Preview: `render.mjs ZCPAINT-SHORT-TH --preview --range=2490-2876` (`out/ZCPAINT-SHORT-TH/range/`). `--range` is inclusive; `2877` is out of range.

Not verified: no audio listening (the call, the sub hit, the B09 knocks removal and the bed levels are unheard); Studio and random/backward seek not run; no full-length render (not requested); the final −14 LUFS check is on the full export only.
