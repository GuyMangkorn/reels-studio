# WORLD FOG build notes

## 2026-10-29 — Painted 2D fog sample (feasibility only)

- Scope: user asked for a p5 sample from WFOG-SCRIPT-R1 to see whether p5.brush can paint fog. Not a Film brief, not
  a scene handoff, not an approved style; visual engine is still unselected in [delivery.md](delivery.md).
- Shot: `PAINTED-SPIKE-WorldFog` in `src/painted/spike/WorldFog.tsx` (spike entry `src/painted/spike/index.ts`), 6 s,
  beat S02-B02 seen from inside the shop: fog density ramps 0→1 over 0.2–3.2 s and swallows canopy lights and pumps;
  the composite shape (raincoat + cart + carton stack + helmet + umbrella) walks to the glass as one silhouette.
- Fog technique: full-frame veils whose opacity follows a fog clock, plus drifting `blob()` banks (from FireFog);
  lamp bloom is a screen-blended Remotion layer that widens and dims as fog rises.
- Evidence: frames 0/45/90/135/179 viewed in a qa-sheet; frame 90 rendered twice with `--gl=angle`, `cmp` identical;
  full render 180 frames in 80 s. Lead (shape) height about 750 px of 1920 (39%) at frame 179, from shape geometry.
  Caption zone not measured against a band: no scene sheet records one yet.

### Findings

- `brush.wash()` (flat underlayer) drawn **after** textured fills rendered a few pixels differently on every run
  (199 px, max diff 8/255, at frame 90). Removing it made renders identical. Workaround here: stack three
  zero-bleed `fill` passes instead. Proposed addition to the painted-2d skill gotchas (not applied; user review).
- Fog banks drawn over a dark silhouette feather into its wet washes and punch light holes in it. Draw high banks
  behind the lead; only low ground banks pass in front.
- A dark painted interior over fog washes picks up the fog through texture gaps, even at opacity 255. The
  foreground interior (wall, frame, shelves) is a solid SVG layer above the canvas instead; it reads cleaner but less
  hand-made. Film decides whether that is acceptable.

## 2026-10-29 — Flat-face decal model sheet (feasibility only)

- Scope: user supplied a "flat-face decal style" reference (egg head, cap hair with scalloped fringe, almond eyes
  with dot pupils, bar brows, line/filled mouths) and asked whether our characters can reach that detail.
- Shot: `PAINTED-SPIKE-FaceSheet` in `src/painted/spike/FaceSheet.tsx`, 3 s, 12 expressions (neutral, happy,
  surprised, thinking, worried, angry, scared, look left/right/up/down, side-eye), per-cell blink, ink boil.
  Face controls follow the painted-2d skill's planned vocabulary (brows / eyes + look vector / mouth). Not a rig.
- Evidence: frame 0 viewed at 540 px and one face cropped at full resolution; frame 0 rendered twice, `cmp`
  identical; 90 frames rendered in 86 s.
- Findings: decal crispness needs `rotring` ink and opaque fills (bleed 0, texture ≤ 0.08). Dark fills (hair,
  pupils, brows) over lighter wet fills came out grey and uneven at 3 passes; 6 passes made them solid. A fill whose
  count changes with the blink must not shift later seeds: brows and mouth use fixed seed bases.

## 2026-10-29 — Short cartoon body proportions (feasibility only)

- User chose a short cartoon body for the decal head (structured reply "Short cartoon body") and asked to see
  proportions with a rough skeleton.
- Shot: `PAINTED-SPIKE-Proportions` in `src/painted/spike/ProportionSheet.tsx`: 3 / 3.5 / 4 heads tall, front view,
  same head size (one head = 290 px), head-unit guides, block-out clothes, mitten hands and a joint skeleton (neck,
  pelvis, shoulders, elbows, wrists, hips, knees, ankles). The head comes from `paintHead()` in `FaceSheet.tsx`,
  extracted from the face sheet (face sheet frame 0 re-rendered byte-identical after the extraction).
- Evidence: frame 0 viewed at 540 px; rendered twice, `cmp` identical. Proportion choice pending with the user.

## 2026-10-29 — Cast sheet at 4 heads (proposal)

- User chose 4 heads tall (reply "4 heads"). Shot: `PAINTED-SPIKE-Cast` in `src/painted/spike/CastSheet.tsx`, front
  view, 2x2: narrator (male driver, open jacket, jeans), delivery worker (hooded navy raincoat to below the knee,
  rubber boots, red helmet in hand), shop worker (woman, tied hair, blue polo, apron), other occupant (older woman,
  grey bob, cardigan, skirt). Gender/age of the shop worker and occupant are proposals: the script does not set them.
- `paintHead()` gained a `HeadStyle` (skin, hair colour, cut: short / tied / bob / hood); `skeleton()` in
  `ProportionSheet.tsx` takes ground, unit and shoulder width. Face sheet and proportion sheet frame 0 re-rendered
  byte-identical after both changes.
- Evidence: frame 0 viewed at 540 px, worker head cropped; rendered twice, `cmp` identical.
- Finding: a light fill painted over a recent dark one (face over hood or grey hair, apron over polo) takes on the
  dark colour while wet; 8 passes keep it clean. Applied only where something sits behind.

## 2026-10-29 — Side views and the worker/cart assembly (proposal)

- Shot: `PAINTED-SPIKE-CastSide` in `src/painted/spike/SideSheet.tsx`. Row 1: narrator, shop worker, occupant in
  profile facing right (profile head: same egg, one eye/brow, nose, ear; hood, bob and bun variants). Row 2: the
  delivery worker pushing a platform cart (5 cartons, red helmet on top, closed umbrella hooked on the handle, front
  wheel noted as the jammed one), then the same assembly from the shop side as one fog silhouette.
- Scale assumption: the 4-head cast is 1.7 m, so 1 m = 447 px at 190 px/head; cartons 0.40–0.52 × 0.32 m, deck
  0.17 m high, stack + helmet ≈ 1.9 m. Film/Mark may change this.
- Finding: in pure profile the worker stands clear of the stack and the silhouette reads as "person + boxes". The
  creature read needs the shop-side (front) view with the worker behind and to one side of the stack, as in the
  fog sample. Silhouettes use texture-free fills so the parts merge into one mass.
- Evidence: frame 0 viewed at 540 px; rendered twice, `cmp` identical; face, proportion and cast sheets re-rendered
  byte-identical after the shared exports.

## 2026-10-29 — Film brief R1: open decisions settled, runtime findings

- Brief: [VB-WFOG-EP01-SHORT-R1](../../storyboards/world-fog/short/visual-brief.md). The open items above are settled
  there: foreground split (VD07: SVG Overlay through `CameraLayer` only where no inside actor is nearer than the glass;
  otherwise all painted with fog limited to the panes), scale (VD02: 1.7 m = 4 heads, 447 px/m calibration only;
  sets real scale, helmet sized to the cartoon head), cast gender/age as design choices (VD03), concealment sector
  and `FOG-STATE` FS0–FS3 (VD05, VD06).
- Finding: the painted scene type is `existing-integrated` at `e1fe80e` (`src/scenes/painted.ts`, `PaintedStage`,
  `src/painted/registry.ts`; consumer `src/videos/oldest-shipwreck/index.ts`). The delivery record's visual-engine
  line, the delivery-workflow visual-engine table and the painted-2d skill's runtime note still say
  `exists-unintegrated` (checkout `733808f`). Proposed doc change (not applied; user review): update the skill's
  Runtime status and the delivery-workflow table to name the integrated stage and what is still missing (character
  rig, pose tracks).
- Finding: in this worktree `p5.brush` 3.0.0 is in `package.json` but does not resolve (`npx remotion bundle
  src/painted/spike/index.ts` failed: "Can't resolve 'p5.brush/standalone'"), so no spike frame was re-rendered for
  the brief. Boss/Editor need a clean install before any WORLD FOG render.
- Finding: the WorldFog spike's lamp glow peaks at opacity 0.75 × 0.85, above the production cap (`GLOW_PEAK` 0.3).
- Finding: `src/scenes/endings.ts` has no plain hard-cut ending. `B_loop` freezes the final 3 s of pose, which would
  stop the S04-B02 lamp fade; `C_seamless` with `loopBlendFrames: 0` appears equivalent to a hard cut but is
  unverified. Boss to confirm or add one.
- Proposed skill gotcha (not applied; user review): a Remotion `Overlay` always sits above the single canvas, so an
  SVG foreground can never be behind a painted actor; split such shots as in VD07.

## 2026-10-29 — Mark scene sheets SS-R1: planning findings

- Handoff: [index](../../storyboards/world-fog/short/index.md) `WFOG-EP01-SHORT-SS-R1`, 22 shots, `ready-for-dev`, timing estimated.
- Finding (caption placement): `src/scenes/Subtitles.tsx` at `e1fe80e` offers `top`, `middle` (centred at y 960, width
  x 65–1015) and `bottom` (134 px). None gives the brief's caption band (block bottom near y 1150–1248, lines inside x
  120–888). With `middle`, a two-line cue covers about y 876–1044 and the line width exceeds the safe box. Recorded as
  MK-WF-DEP-08 for Boss/Editor; the sheets keep clue reads inside y 300–950 and the wheel reads at y 843–881.
- Finding (projection tool): `scripts/shot-projection.py` assumes a right-handed world; `WORLD-SHOP` (+x right seen
  from inside, +y up, +z outward) is left-handed, so the inputs store x negated. Proposed (not applied; user review):
  an optional `"handed": "left"` field in the tool, or a note in `scripts/README.md`.
- Finding (lead rule vs fog approach): at FS2 the assembly cannot be shown farther than about 2.4 m behind the glass
  on CAM-GLASS-OUT and still be ≥ 480 px (484 px at 2.4 m). The approach therefore starts as a ghost at 2.4 m; the
  low glimpse on CAM-LOW-SHELF needs a picture push ≥ 1.12.
- Finding (door-height line): at the stop the helmet top (1.95 m) projects about 106 px under the 2.1 m door header
  at s 1 because the stack stands 0.6 m behind the glass. Open item 5 in the index (Film, at blockout).
- Element captures: no render possible here (`p5.brush` unresolved); spike frames from `world-frog-main-6920cb/out/painted/`
  were reused after `git diff 47a6737 e1fe80e -- src/painted/spike/` came back empty.

## 2026-10-29 — Boss: clean install, S02-SH02 phone sample, SP01 preview (S02-SH09, S03-SH03)

Scope: Boss limited stage (delivery.md, user "เริ่มเลย"). Rendered against `WFOG-EP01-SHORT-SS-R1` / `VB-WFOG-EP01-SHORT-R1`
at `e1fe80e` + uncommitted spike files. Spike entry only (`src/painted/spike/index.ts`); nothing added to
`src/painted/registry.ts`, `src/Root.tsx` or a video index. Not committed.

### Install (MK-WF-DEP-01)

- Cause: this worktree had no `node_modules` of its own (only `.cache`, `.remotion`). Node and webpack resolved upward
  into the main checkout's `node_modules`, installed from that checkout's branch (`claude/char-base`), whose
  `package.json` has no `p5.brush`. Hence "Can't resolve 'p5.brush/standalone'".
- Fix: `npm ci` in the worktree (log `out/logs/wfog-npm-ci.log`); `package-lock.json` unchanged. `p5.brush` 3.0.0 now
  resolves (`exports["./standalone"]`); `npx remotion bundle src/painted/spike/index.ts` succeeds.
- Finding (environment): the main checkout's `node_modules/@types` holds Finder duplicates `node 2` and `react 2`. tsc
  in a nested worktree also scans ancestor `node_modules/@types`, so `npm run typecheck` fails with TS2688 there.
  `npx tsc --noEmit -p . --typeRoots ./node_modules/@types` passes. The shared checkout was not touched; deleting
  those two folders (user decision) or giving each worktree its own install outside the repo tree would fix it.

### S02-SH02 phone sample (`WFOG-PREVIEW-S02-SH02`, `src/painted/spike/WfogPhone.tsx`)

- Painted (one canvas): soft shop background (fluorescent tubes, a shelf aisle of plain colour blocks, fogged glass far
  right, counter edge) drifting -20 px over the shot; the hand behind the handset, graphite handset, fingertips round
  the left edge, thumb in front. SVG (Overlay): home screen, banner `หมอกหนาปกคลุมทั่วโลก` (Noto Sans Thai bold 34 px,
  one line) drops f6-f14, press f22-f27, expands into the article f26-f32, list of four identical fog photos scrolls
  180 px f48-f78 with the thumb (735, 900) -> (735, 760). No source name, logo, place, time or instruction.
- Technique finding: an Overlay always sits above the canvas, so a painted thumb over an SVG screen needs the screen
  masked by the same thumb/fingertip polygons (stroke 5 px to cover the ink). Works cleanly, deterministic. Candidate
  painted-2d skill gotcha (proposed, not applied).
- Hand: neutral/feminine for the R2 narrator (slim fingers, short natural nails, knit cuff, no ring or hair). The cuff
  colour is a placeholder until her outfit is decided.
- Deviations from sc02-b01 for Mark (SS-R2): (1) the sheet's screen rect x 300-760 × y 330-960 (aspect 0.73) reads
  as a tablet; the sample uses x 336-744 × y 312-978 (0.61), same thumb points, handset bottom y 1000 (caption band
  clear). (2) The 44 px headline does not fit one line at that width (nor at 460 px): it breaks
  `หมอกหนาปกคลุม` / `ทั่วโลก`. (3) The banner is two rows (generic icon + grey bars, then the text) to keep 34 px on
  one line. (4) The "tap at f24" is shown as a press + ripple; the visible thumb stays at (735, 900) as the sheet
  places it, so no finger touches the banner. (5) Front view with the hand entering lower right, as the sheet says;
  a POV left hand would bring the thumb from the left.
- Caption zone (band y 1000-1248): f18 mean 0.32 / p95 0.75, f63 0.32 / 0.75 (fails the 0.25 / 0.40 defaults).
  The lower shelves were darkened (was 0.52); the remaining p95 is the skin of the gripping hand that the sheet places
  in the band. Editor: outline captions may need a scrim here, or Mark moves the grip up.
- Evidence: 13 stills f0-f89 sheet viewed; full-res crops of the banner and article; f63 rendered twice, `cmp`
  identical; MP4 rendered. Lead: N/A (insert, no character).

### SP01 preview (`WFOG-SP01-S02-SH09`, `WFOG-SP01-S03-SH03`, `src/painted/spike/WfogShop.tsx`)

- Built as `PaintedShot` objects (promotable to `src/painted/shots/worldfog.tsx` when the build is authorised):
  CAM-GLASS-OUT projection from ST-02 (f 1341, y_h 700, eye 1.45, camera z -3), ASM stop S (-0.10, 0.62), ST-03 poses,
  sheet push (SH09 s 1.22 -> 1.30 about (560, 650) eased to exactly 1.30 at f179; SH03 1.30 -> 1.34), fog drift on the
  story clock (G), `light` per-part colour lerp (VD04), FS2.
- Picture: lamp-lit night fog ramp, canopy ghost, four lamp hazes painted plus SVG halos (<= GLOW_PEAK 0.3), FS2 ghosts
  of pumps and the parked sedan, drifting high banks, wet walkway with puddles and far-lamp reflections, caster drag
  mark, backlit shadow pool, ripple reflection of the assembly, low ground fog over the boots/wheels only. Remotion
  layers through `CameraLayer`: halos, thin warm outer rim (SVG erode band of the merged mass, top-weighted, 0.3),
  torch beam (blurred cone + spot, SH03), outside condensation beads, foreground architecture (VD07: wall, head rail,
  transom, jambs with a cool inner edge, sliding leaf + pull handle, sill, polished floor with the panes mirrored,
  window-shelf end at the left edge) with a turbulence edge so it reads hand-cut; screen grade and paper grain.
- Measured (geometry via `sp01Anchors`, pixels via bare renders): assembly 881 px at f0 (top y 485), 761 px minimum at
  the catch (f45, top y 612), 939 px at the match frame f179 (top 474, ground 1413; bare-render bbox 942 px). Lead
  >= 480 px throughout. Helmet centre f0 (490, 587), catch (633, 743) [sheet 632, 742], match (491, 583); umbrella tip
  (740, 629); hand on rim (581, 668). Helmet, tap tip and face inside y 300-950 in every rendered frame.
- SP01 (b): bare renders (assembly only, white paper) of SH09 f179 and SH03 f0 are byte-identical (XOR 0 px). SH03 f30
  (light 1) differs by 3542 px = 1.29 % of the mask: the SH03 push is already at s 1.306 and the lit state adds the ink
  outline. Full frames differ beyond the assembly only by fog drift on the story clock and the label.
- SP01 (c): catch at hand height 1.28 m (sheet), palm under the shell; geometric contact holds. SP01 (d) N/A (no taps
  in SH09). SP01 (g): SH09 f45 and f179, SH03 f30 rendered twice with `--gl=angle`, `cmp` identical. SP01 (a) needs a
  reviewer who has not read the script (coordinator/user).
- Caption zone (band 1000-1248): SH09 f179 mean 0.27 / p95 0.42 (no captions in SH09); SH03 f30 0.41 / 0.63 (captions
  G1830-1920): the lit cartons and beam fill the band. Not darkened (it is the reveal); Editor/Film decide on scrim or
  caption placement (MK-WF-DEP-08).
- Evidence: SH09 15 frames (f0, 24, 30, 36, 40, 44-46, 60, 84, 100, 117, 150, 178, 179) and SH03 f0/15/30/60 sheets
  viewed; full-res crops of the silhouette and the lit face; F-1/F/F+1 at the catch (f44-46) continuous; MP4s
  rendered (SH09 180 frames, SH03 f0-59). Not checked: Studio seek/scrub; timeline integration (none).

### SP01 findings and conflicts with the brief (for Film/Mark)

- **Hood read as a second head.** With ST-03 values (hood centre x 0.2, top 1.7, round) the hood beside the helmet
  read as two heads. Fix used here (proposed refinement of ST-03, Mark to accept or change): the worker's upper body
  leans 9° toward the stack about the hips (bracing), and the hood flares into the shoulders with no neck notch. The
  hood then reads as a shoulder hump under the helmet "head" (VD05). Face position at the match moves from the sheet's
  (620, 698) to (569, 710).
- **Lean vs the lit face.** With the lean, the face at the lit match frame (S03-SH03 f30, no pose change before f36) is
  half hidden by the top carton and the gloved hand on the rim. The preview straightens him f36-f54 (S03-SH03 f60),
  which also reads as the reveal action (the "shoulder" becomes a hooded head). Mark: add it to S03-SH03's pose table,
  or keep ST-03 without the lean and accept a weaker silhouette.
- **Catch read risk (SP01 a).** The catch point (0.22, 1.38) lies in front of the worker's coat, so in silhouette the
  caught helmet merges into the shoulder mass: frames f45-f84 read as "the head slumps onto the shoulder" more than
  "a hand catches it at the side". If the reviewer test fails: catch lower and wider (about x 0.30, 1.05 m, at the
  0.5 m reach limit) so the dome bulges out of the coat outline, while keeping clear of the raised umbrella arm.
- **Cart depth.** The sheets project the stack at its centre (z = zs). Drawing the deck edge and casters at their true
  z (zs - 0.37) floats them as a separate bar below the stack, so the cart is drawn on the stack plane (flat card).
- **Detail the brief rules out.** The silhouette (light 0) carries no internal detail by design (VD04/VD05: merged,
  texture-free, face never lit, no inner rim). Carton tape, labels, helmet visor, face and coat shading exist only in
  the lit state. Richness pre-reveal comes from the set, fog layers, halos, outer rim, ground reflections and glass. A
  value step between the worker (0.45 m farther) and the stack, or a textured silhouette, would separate "person +
  boxes" and is left out.
- **Projection tool note.** The sheet's umbrella tip (778, 628) at s 1.30 does not match a direct projection of
  (0.36, 1.60, 0.05) with ST-02 values, which gives (740, 629); likely the x-negation for the tool. Mark to recheck.
- **Silhouette fills.** p5.brush's watercolour border (`fillTexture` border > 0) darkens every part edge and shows the
  parts inside a merged silhouette; the mass uses border 0, 9 passes, and cartons overlap 1.5 cm so abutting fills
  leave no light seam (the rim filter turned seams into bands). Candidate painted-2d skill gotcha (proposed).
- Speed: about 2.3 s per still including startup (32 stills in 75 s); the 90-frame S02-SH02 MP4 in about 41 s.

### Cast note (VD03, user Q3)

- The older occupant has age lines now (`HeadStyle.lines`, drawn last in `paintHead`, warm-brown thin ink): crow's
  feet, under-eye arcs, nasolabial and mouth-corner folds; enabled on the cast sheet only. Face, proportion and side
  sheets re-rendered byte-identical; cast sheet f0 rendered twice, identical. The profile head (`SideSheet.tsx`) has
  no lines yet; carry the flag into the cast asset when it is built.

### Previews (out/handoffs/world-fog/WFOG-EP01-SHORT/previews/, rendered against SS-R1)

- S02-SH02: `S02-SH02_phone-sample_f{0,18,30,63,89}.png`, `WFOG-PREVIEW-S02-SH02_f0-f89_sheet.png`,
  `S02-SH02_phone-sample_f0-f89.mp4`, `S02-SH02_phone-sample_f63_capzone.png`.
- S02-SH09: `S02-SH09_sp01-silhouette_f{0,30,36,45,84,117,179}.png`, `WFOG-SP01-S02-SH09_f0-f179_sheet.png`,
  `S02-SH09_sp01-silhouette_f0-f179.mp4`.
- S03-SH03: `S03-SH03_sp01-match-unlit_f0.png`, `S03-SH03_sp01-lit_f30.png`, `S03-SH03_sp01-lit-straighten_f60.png`
  (preview beyond the sheet), `WFOG-SP01-S03-SH03_f0-f60_sheet.png`, `S03-SH03_sp01-lit_f0-f59.mp4`,
  `S03-SH03_sp01-lit_f30_capzone.png`; pair `S02-SH09_f179-vs-S03-SH03_f30_match-pair.png`.
- Cast (no shot): `CAST-SHEET_occupant-age-lines_before-after.png`.

## 2026-10-29 — Film brief R3: fog-lens illusion (VD17), PHONE-SVG, SP01 look calls

Scope: Film stage `VB-WFOG-EP01-SHORT-R3` from the user's SS-R2 verdicts (delivery record) and Boss's previews. Brief:
[visual-brief.md](../../storyboards/world-fog/short/visual-brief.md#fog-lens-illusion-vd17). Not committed.

- Test (spike only): opt-in `warp` option in `src/painted/spike/WfogShop.tsx` (`fogWarp`, `FogVeil`, `warpAt`; default
  off) and a `warp` prop in `src/painted/spike/index.ts`. Frames: `out/handoffs/world-fog/WFOG-EP01-SHORT/previews/film-r3-fogwarp/`
  (`WFOG-FILM-R3-FW02_sheet.png`, two MP4s, FW01 first-pass sheet). Logs `out/logs/wfog-film-r3-*.log`.
- Finding (technique): a per-vertex warp of the assembly polygons, after resampling edges to <= 10 px, is deterministic
  (`cmp` identical twice with `--gl=angle`) and keeps the SVG rim and ground reflection aligned because they take the
  same parts. A displacement filter over the canvas would bend the whole plate and separate from the polygon-based
  overlays. Candidate painted-2d skill note (proposed, not applied; user review): "distort a painted shape by warping
  its polygons before `brush.polygon`, not by filtering the canvas".
- Finding (relax to honest): returning the parts unchanged at amount 0 (no resampling) keeps the lit frames byte-identical
  to the no-warp render (S03-SH03 f22, f30); warp-off f30 is byte-identical to Boss's preview.
- Measured at G1409 (bare): top 473 -> 449 px, height 939 -> 963 px, mask XOR 6.6 %. The test read: helmet becomes a
  taller hooded dome, umbrella arm slightly sinuous, edges dissolve in patches; still a figure, now a strange one.
  The user's motion read is the open check (SP04 a).
- Known test limitation: the veil patches wrap inside the outline's bounding box, which moves with the pose; the brief
  asks Boss for a fixed per-setup box with fade envelopes (SP04 f). Not rendered: SH04, SH07, SH08, S01.
- Finding (colour key): the PHONE-SVG sample's article top bar has a small red pill (`#b8473a`); VD16 withholds red
  until the beam and PD06 rules out live-news cues, so R3 asks for neutral grey.
- Film calls on Boss's SP01 proposals: lean (hood as a shoulder hump) and straighten after full light accepted as look
  (values Mark's); catch must break the dome out of the coat outline (Boss's lower/wider catch is a candidate);
  cart as a flat card on the stack plane accepted as a scale exception; no darkening of the reveal for captions.
- Possible fact-check touch: VD17 is optical, unchanged geometry; Film reads it as outside the fact-check's
  "anatomy deformation" exclusion. Boat confirmation recommended (coordinator's call).

## 2026-10-30 — Boss: SS-R3 re-render (VD17 productionized), S02-SH09, S03-SH03, S02-SH02

Scope: Boss limited stage. Rendered against `WFOG-EP01-SHORT-SS-R3` / `VB-WFOG-EP01-SHORT-R3` at `67b9f85` + uncommitted
spike files (open PR #115; not committed). Spike entry only (`src/painted/spike/index.ts`); no registry, Root, video
index or timeline change. Logs and scratch tools under `out/logs/wfog-ssr3*`.

### Code (spike)

- `src/painted/spike/WfogShop.tsx`
  - **VD17 on by default** (`windowShot({warp})` default true; composition prop `warp: false` renders the VD17-off
    reference). `warpAt` per ST-09: SH09 1 → 0.7 f18–f26, 0.7 to f56, → 1 f56–f64; SH03 1 → 0 f2–f22 (smoothstep),
    exactly 0 from f22.
  - **FW-A** as Film's spec, with the tip pin now taken from the pose's current umbrella tip. Parts that the field
    does not reach (w = 0 at every resampled point: wheels, casters, deck, boots) are returned unresampled, so their
    fills stay byte-identical to the VD17-off render (resampling alone changes p5.brush fill/edge noise, see below).
  - **FW-B veil (production fixes):** patch field anchored to a fixed per-setup box (`VEIL_BOX['CAM-GLASS-OUT']`
    plate x 330–850 × y 380–1060 at s 1), 6 patches, each pass up through the box is one cycle with an 18 % fade-in /
    18 % fade-out envelope (fill-opacity) and x re-seeded per pass; sideways ±20 px/s folds back at the box sides
    (continuous). A second mask multiplies the veil by the FW-A weight without `A` (height smoothstep 0.30–0.75 as a
    gradient, tip exclusion smoothstep 15–70 px as a radial gradient), opacity 0.75·`A`. `veilPatches(G)` exported for QA.
  - **SH09 poses (SS-R3):** slide f24–f32 → (0.10, 1.66), tip f32–f35 → (0.33, 1.56, 0.68), fall f35–f45 (y ∝ u²) to the
    catch (0.40, 1.03, 0.78) 22°; hand at (0.28, 0.91, 0.80) by f44, 3 cm give f45–f58, tilt 22 → 16 f45–f70; lift
    f84–f117 as a timed Hermite through (0.34, 1.62, 0.72) f100 and (0.10, 1.78, 0.66) f110 (eased ends, no stops at
    through-points); regrip to helmet + (0, −0.15, 0.18) f84–f88, carried there to f110, onto the rear-right rim
    (0.10, 1.55, 0.80) f110–f117; seated `MATCH` + 6 mm settle f117–f121. Glove layering is an explicit pose flag.
  - **SH03 poses (SS-R3):** `MATCH` f0–f35; f36–f54 lean 9° → 0 with the helmet pressed 12° → 0 (hand rides the rim);
    hand to the brace f54–f66; umbrella lowered to `LIT-LOWER` f66–f96 (direction nlerp about the hand, hook moves to
    the far end); shoulders drop f96–f110; squint f44–f56; gaze toward the torch from f96.
- `src/painted/spike/WfogPhone.tsx`: article top-bar pill `#6f777a` (was red `#b8473a`); sleeve olive `#6b7a5a` with a
  hem band and fold shade (knit ribs removed).
- Checks: `npx tsc --noEmit -p . --typeRoots ./node_modules/@types` 0; eslint on `src/painted/spike/` 0; `npm test`
  0 failures (`out/logs/wfog-ssr3-test.log`).

### Measurements (geometry via `sp01Anchors`; pixels via bare renders, dark-mask lum < 128)

- S02-SH09 f45 (s 1.2318): helmet centre (710, 895), bbox x 602–810 × y 796–1003, catch hand (657, 946) — sheet values.
  f179: helmet centre (491, 583), top 474, hand on rim (580, 669), face (569, 710), tip (740, 629), ground 1412/1413.
- Lead: bare VD17-off f179 940 px; VD17-on f179 964 px (top 449). Minimum over SH09 (VD17 on) 766 px at f52;
  SH03 942 px (f21). Top of the assembly over SH09 413–609, SH03 445–474 (inside 300–950).
- Item 12 (clue-safe): during f45–f84 the caught helmet's lower rim reaches y 1003 (f45) to **1016 (f51, impact
  give)**, 1006 at f84; the catch hand y 946 (f45) to **960 (f52)**, 952 at f84. Past 950 by ≤ 66 px (rim) / 10 px
  (hand) in this caption-free shot; helmet top and face stay inside.
- Item 14 (lift): reach from the leaned right shoulder (−0.02, 1.15, 1.07) peaks at **0.545 m at f110** (> 0.54 m bone
  sum on f106–f110, 5 frames). First pass blended the regrip→rim offset over the whole lift and peaked at 0.59 m; holding
  the rear-lower-rim grip to f110 (the sheet's basis) fixes it. Read (dense sheet): the helmet swings out at the side,
  rises over the corner (f96–f102) and drops onto the stack; at full extension the arm is hidden behind the helmet/hood
  mass, so no stiff straight arm reads. Looks right to me; user/reviewer read pending.
- VD17 strength (bare, on vs off): mask XOR 7.4 % (f0), 3.7 % (f45, A 0.7), 4.0 % (f84), 5.5 % (f100), 6.1 % (f179).
- Caption zone (band 1000–1248): S02-SH02 f63 mean 0.337 / p95 0.786; S03-SH03 f30 0.433 / 0.667, f80 0.432 / 0.669;
  S02-SH09 f179 0.287 / 0.436 (no captions). Unchanged by this pass; scrim is Editor's (MK-WF-DEP-10).

### SP01 / SP04 rows

- SP01 (b) R3: bare VD17-off SH09 f179 vs SH03 f0 **byte-identical** (`cmp`). From SH03 f22 the full frame VD17-on
  equals VD17-off **byte for byte** on stills (f22, f30, f60, f119). f21 (A 0.007) differs (expected); no f21→f22 pop:
  frame-to-frame change in the helmet/carton box is 199.9k px at f21→22 vs 197–199k for f20→21 and f22→23 (light lerp).
- SP01 (c): hand touches the helmet at the catch (palm under the inner lower rim; glove drawn behind the shell). The
  sheet's "fog ≥ 25 px between the dome and the umbrella hand" **fails as drawn**: the drawn left glove is 9 px from
  the dome at f45 and the umbrella handle/hook below the glove touches it (0.3 px; shaft root 1.8 px). The sheet's 35 px
  is to the hand point, not the glove edge. Dome share outside the coat outline not pixel-measured (visually clear).
- SP01 (e) pass; SP01 (f) pass except item 12; SP01 (g) / SP04 (g): SH09 f45, f87, f100, f105, f179 and SH03 f12, f22
  rendered twice as stills with `--gl=angle`, `cmp` identical.
- SP04 (c): geometric check over every SH09 frame and SH03 f0–f21: max displacement 0 for points below the 0.30 ramp
  and within the 15 px tip pin (overall max 33 px). Pixels below the ramp: wheels, deck, casters, boots byte-identical
  to VD17-off; differences only in a band just under the ramp line (coat hem and lower cartons, which straddle it).
- SP04 (d) pass (above). SP04 (e) pass. SP04 (f): one patch wrap falls in the rendered ranges (SH09 f87, patch 2,
  envelope 1e-4 → 0); F−1/F/F+1 crop shows nothing appearing or vanishing; dense sheets (SH09 f18–f66 and f84–f120
  every 6; SH03 f0–f36 every 3) and the MP4 show no veil pop. Three wrap points as the SP asks are not available inside
  these shots (passes last 21–48 s); the envelope makes any wrap zero-opacity by construction. No inside actor in
  these plates. SP04 (a), (b) and SP01 (a): need the user / a reviewer without the script.

### Findings

- **Seek vs sequence render (spike, painted window plate).** Stills rendered twice are byte-identical, but a PNG
  sequence render (`--sequence`, any concurrency) differs from the direct still of the same frame by ≤ 13 levels on
  ≤ ~900 px, along the architecture/foreground SVG edges (feTurbulence displacement) and floor, never in the assembly.
  Byte-equality checks (SP01 b, SP04 d) are therefore judged on stills; the sequence on/off comparison shows the same
  sparse edge noise. Candidate finding for dev-findings (proposed, not applied).
- **Resampling changes p5.brush fills.** Resampling a polygon (same outline) changes the seeded fill mottling and edge
  noise; hence the "untouched part" rule above. Candidate painted-2d note together with Film's warp note.
- **S03-SH03 brace covers the mouth (for Mark).** Upright, the face (≈ 621, 708) sits right above the stack's right
  edge, so the brace point (0.15, 1.30, 0.85) projects the glove (603, 787) over his chin/mouth from f60 to the end
  ("hand over mouth" read in the reveal). Proposal: brace lower, about y 1.05 (forearm 0.26 m from the upright
  shoulder), or keep the right hand on the helmet rim. Not changed here (Mark's value).
- **Wedge under the tilted helmet.** At `MATCH` (12°) the helmet's lower-left rim lifts off the carton; the fog wedge
  between them catches the rim light and, with VD17, reads as a narrow neck. Honest geometry (VD17-off shows it too).

### Previews (out/handoffs/world-fog/WFOG-EP01-SHORT/previews/ss-r3/, rendered against SS-R3)

- S02-SH09: `S02-SH09_ss-r3_f{0,24,32,35,40,45,70,84,100,110,117,179}.png`, `S02-SH09_ss-r3_f0-f179_sheet.png`,
  `S02-SH09_ss-r3_f18-f66_every6_crop-sheet.png`, `S02-SH09_ss-r3_f84-f120_every6_crop-sheet.png`,
  `S02-SH09_ss-r3_veil-wrap_f86-f88_crop.png`, `S02-SH09_ss-r3_f179_bare-vd17-off.png`, `S02-SH09_ss-r3_f0-f179.mp4`.
- S03-SH03: `S03-SH03_ss-r3_f{0,12,22,30,45,54,60,80,96,119}.png`, `S03-SH03_ss-r3_f0-f119_sheet.png`,
  `S03-SH03_ss-r3_f0-f36_every3_crop-sheet.png`, `S03-SH03_ss-r3_f0_bare-vd17-off.png`, `S03-SH03_ss-r3_f0-f119.mp4`.
- S02-SH02: `S02-SH02_ss-r3_f{0,18,30,63,89}.png`, `S02-SH02_ss-r3_f0-f89_sheet.png`,
  `S02-SH02_ss-r3_f63_pill-cuff_crop.png`, `S02-SH02_ss-r3_f0-f89.mp4`.
- MP4s are encoded from the PNG sequences (ffmpeg h264 crf 18, no audio). Not checked: Studio seek/scrub; SH04/SH07
  (VD17 with the approach and the moving tip pin), S01 car plate; timeline integration (none).

## 2026-10-30 — Boss: full build checkpoint (integrated plates, shared assets, all 22 shots)

Scope: Boss full build (delivery.md 2026-10-30), rendered against `WFOG-EP01-SHORT-SS-R3.1` / `VB-WFOG-EP01-SHORT-R3` at
`baa96b8` + uncommitted SS-R3.1 sheet edits. Not committed. Editor not invoked. Picture only: no narration, captions,
music or SFX.

### Runtime (status `existing-integrated` for the picture at this checkout, not committed)

- Video `src/videos/world-fog/index.ts`: composition `WFOG-EP01-SHORT`, four scenes S01–S04, 22 cues `WFOG-<shot ID>` on
  the SS-R3.1 G ranges, 2610 frames; fiction marker as the S01-SH01 cue `label` (G0–G125 only); `ending: 'C_seamless'`,
  `loopBlendFrames: 0`.
- **MK-WF-DEP-07 hard cut: existing capability, no code change.** `endingState('C_seamless')` returns the live frame at
  opacity 1 (no 3 s hold), `loopBlendOpacity(…, 0)` is 0 (no frame-0 blend), the B_loop `Freeze`/dip paths are not taken.
  Test `tests/world-fog.test.ts` checks G2520–G2609 paint the single S04-SH03 plate at f = G − 2520, opacity 1. Audio
  stopping on G2609 is Editor's (no tail cue). The mode name reads "seamless"; a named `D_cut` alias is optional.
- Plates `src/painted/shots/worldfog.tsx` (appended in `src/painted/registry.ts`). Each plate samples story clocks at
  G = shot start + local frame, so a cue time change never changes its picture.
- Shared library `src/painted/worldfog/`: `space.ts` (WORLD-SHOP, ST-02 projector for all ten setups with near-plane
  clipping, SHOT_ROWS, ASM-PATH lurch/sway/pull-back/push-in, FOG-STATE, lamp levels, light, torch, door, ST-09 A);
  `assembly.ts` (WFOG-ASSEMBLY front view for any projector, story pose `asmPoseAt(G)` PUSH → SH07 taps → BRACE-TAP →
  SH09 catch/lift (SS-R3.1 keys) → MATCH → SH03 straighten/LIT-LOWER brace via (0.02, 1.30, 0.86) → LIT-LOWER, umbrella
  handle on the shaft axis, caster hubs (jammed front-right does not turn), FW-A warp, cart-only pose, lit side view);
  `outside.ts` (fog plate FS0–FS3 for every outward camera); `layers.tsx` (halos ≤ 0.3, rim, FW-B veil, beams, lens glow,
  glass, CAM-GLASS-OUT architecture, grade, grain); `cast.ts` + `head.ts` (rig: four characters, front/profile, face
  controls, blink, talk mouth, crouch, bend, walk, lean, breath, IK arms, torch/phone/umbrella props; narrator a woman with
  loose shoulder-length hair; occupant age lines front and profile); `shop.ts` (ST-01 interior, depth-sorted boxes and
  actors, fog only through the panes); `car.ts` (S01-SH01 car plate, sedan); `phone.tsx` (PHONE-SVG promoted).
- QA entry `src/painted/worldfog/qa.tsx` (`WFOG-QA`, burned-in preview label) and `scripts/world-fog/stills.mjs` (one bundle,
  `--gl=angle`, frame lists/ranges, files `<shot>_G<frame>.png`).

### QA (out/qa/world-fog/WFOG-EP01-SHORT/)

- Checks: `npm run lint` 0; `npm test` 92 pass (8 new in `tests/world-fog.test.ts`); `npx tsc --noEmit -p . --typeRoots
  ./node_modules/@types` 0; `npm run typecheck` fails only with the known ancestor `@types/react 2` duplicate (environment).
- Sampled frames: 114 labelled stills (start/mid/end + events of all 22 shots, `r1-labelled/`, sheets
  `sheet_S01_S02B01.png`, `sheet_S02B02-B03.png`, `sheet_S02B04_S03B01.png`, `sheet_S03B02_S04.png`, viewed); 1-second pass
  G0…G2580 + G2609 from the production entry (`r1-1s/`, `sheet_1s_A.png`, `sheet_1s_B.png`).
- Determinism: G330, G1100, G1409, G1830, G2300 rendered twice, `cmp` identical; G330 and G1830 identical between two
  different render orders (seek independence on stills).
- Geometry (tests + `out/tmp/lead.ts`): match record G1409 = S03-SH03 f0 camera {1.30, 560, 650, 0, 0}; warp-off silhouettes
  of G1409 and G1800 identical; parts from G1822 equal the warp-off parts (FW-B returns nothing at A 0); taps on the glass
  plane exactly G951/G969/G987; catch helmet centre (710, 917) at G1275.
- Lead (min over start/mid/end, after the camera): S01-SH02 744, S02-SH01 1003, S02-SH03 582 (counter edge), S02-SH06 865
  (shelf edge), S02-SH08 782, S02-SH10 1020, S03-SH01 782 (until her head exits on the rise), S03-SH02 865, S03-SH07 1305,
  S04-SH01 923 standing, S04-SH02 1457; S01-SH01 1590 (design). Assembly: SH04 ≥ 500 (top 514–561), SH07 ≥ 776, SH09 ≥ 767
  (top 413–609), SH03 ≥ 942 — all ≥ 480, tops inside 300–950.
- Caption band y 1000–1248 (`capzone-1s.json`): fails 0.25 / 0.40 on 21 of 22 shots (worst S02-SH03 mean 0.70 / p95 0.82,
  interiors are light); only S03-SH06 passes. MK-WF-DEP-08/10 (placement, local scrim) remain open and now matter on
  nearly every cue.

### Findings and deviations (for Mark / Film)

- **S04-SH01 vs ST-01:** the gondola x 0.6–1.5, z −5.5…−2.0 stands between CAM-INT-2S (0.3, 1.45, −3.6) and the narrator
  at x 0.85 (top 1.6 m above the eye): she is hidden. The plate omits both gondolas in this shot (`omit: [6, 7]`). Mark:
  move the camera or the gondola end, or accept the omission.
- **S02-SH01:** with ST-01 the counter (x −2.9…−0.9) is not between CAM-COUNTER-IN and the narrator (x −0.3): she is seen
  full length (1003 px), not cut at the counter edge y 1110 as the sheet says.
- **S02-SH05 painted, not Overlay (VD07):** the low-shelf setup uses the same painted interior as SH08/S03-SH01 for
  continuity; no inside actor, no fog pickup seen. Film may prefer the Overlay form.
- **S03-SH07:** the near mullions read as large dark columns at the right edge and the cart starts outside behind them;
  the worker's face only clears the cart near the end. Staging is per sheet; check the read at review.
- Insert framing: S03-SH04 helmet centre lands at about (540, 604) (sheet 560); S03-SH06 jammed caster about (530, 700)
  (sheet 720). Sheet camera values used as given.
- Not built / not checked: no rim/halo overlays on painted-interior shots (overlays would cover inside actors; painted lamp
  glow instead); talk mouths use a flutter on the sheet cue windows (stale until TTS; Editor can drive them from amplitude);
  no Studio scrub session; no MP4 (no full sequential render, so no adjacent-frame jump claim); SP01 (a) / SP04 (a, b)
  reviewer reads; SP03 judged on 540 px sheets only.

## 2026-10-30 — Boss: fix pass two against SS-R3.2 (WFOG-EP01-SHORT r2)

Scope: delivery.md 2026-10-30 ("แก้รอบสองเลย"). Sheets `WFOG-EP01-SHORT-SS-R3.2` are the authority; no sheet or delivery edit (sheet changes requested below). Worktree `claude/wordfog-post-merge-main-959703` on `baa96b8` plus uncommitted work. Not committed; no push; Editor and other roles not invoked. Picture only (no narration, captions, music or SFX). IDs: A1–A10 (SS-R3.2 changes), B1–B5 (asset defects, open item 16), C (quality lift), DF-20261030-painted-straight-bars.

### What changed (owner file)
- **A1 gondolas (ST-01, z −2.8):** `src/painted/worldfog/shop.ts` ids 6/7 front ends at z −2.8, product rows follow. `src/painted/shots/worldfog.tsx` S04-SH01: the `omit` is removed, both gondolas drawn. Front-left edge x 1043 (sheet 1043).
- **A2 S02-SH01:** torch hand after the lift-off at her right hip (−0.65, 0.95, −2.25), lens down, held to f114 (`counterInPlate`). Full-length narrator and counter block were already in the build.
- **A3 S03-SH04:** `fixedCam` fy 598, dy −38. Helmet pivot lands at (540, 560) at s 2.2 and 2.3.
- **A4 S03-SH06:** camera unchanged. Per-frame hub check added (numbers below); no code change needed.
- **A5 torch-hold rule:** S02-SH08, S02-SH10 and S03-SH01 carry the torch across the right knee (grip (−1.07, 0.42, −1.50), lens (−0.97, 0.36, −1.50)); S03-SH02 raised forward to the sheet hand (−0.77, 1.30, −0.85) with the torch aimed lower-left (2.92 rad). The `KEY` table and `torchAngle` in `shots/worldfog.tsx` derive the plate angle from the world points.
- **A6 S02-SH10 arms:** authored elbows (`Arm.via`, new in `cast.ts`): elbows (−1.15, 0.48, −1.36) and (−0.75, 0.48, −1.36), hands on the knee tops; held breath lifts the elbows 0.02 m over f96–f104.
- **A7 S03-SH01 rise:** crouch = 1 − `riseAt(G)` on G1640–G1668 (now in `space.ts`). S03-SH02 uses the same clock, so the rise continues across the cut. Torch to her right side with lens down over f110–f125 (hang target (−1.23, 0.55, −1.25)); left hand leaves the floor at f110; occupant hand slips at f112; camera `dy` 0 → +130 over f110–f125 (`s3sh01Camera`).
- **A8 CAM-INT-SIDE (2.4, 1.45, −0.6)** in `space.ts` SETUPS. The mullion at x 1.75 projects to x 1548, off frame.
- **A9 S01-SH01 far shape (`car.ts` `farShapeAt`):** ground (190, 780) → (486, 788) at f108 → (492, 790) at f125; distance 16 → 11 m linear; k = 1104 / d (69 → 100 px/m, ST-09); height 1.95 m × k (134.5 → 195.7 px). Backlit: amber halo behind the upper half, painted in `paintFarShape`. A-pillar band 90 px in `paintCarInterior`.
- **A10 S02-SH05 painted foreground:** interior bars, transom, sill and the window-shelf end are flat-underlayer hard fills (`shop.ts` `hard` flag on ids 1 and 20–33; `draw.ts` `hardFill` = `brush.wash`). Reason and evidence: DF-20261030-painted-straight-bars.
- **B1 bent coat (S04-SH01):** the hem blends onto the rotated torso by `bend` (hip level, `cast.ts`); bent knees flex (`kneeBend` 0.45 × bend). Partial, see remaining defect 1.
- **B2 profile hip gap (S03-SH07 and S04-SH02 narrator):** shirt and jacket reach the top of the trousers (hip0 + 0.0255) in profile. The notch the far hanging hand showed through is closed.
- **B3 splayed arms:** crouched arms use authored elbows (`Arm.via`), no two-bone IK bulge. Every other pose keeps IK.
- **B4 sedan (S01-SH02):** wheel arches cut into the side panel, closed-door seam and sill line (`car.ts` `paintSedan`).
- **B5 blobby mullions:** flat hard fill (A10).
- **C quality lift (partial, `shop.ts` `paintShop`):** soft contact shadows under each floor-standing set piece (shelves, counter, gondolas, back shelf); tube-light pool on the floor; darker far corners; faint back-wall mottling. Faces, the cast drawing and the flat interior washes are unchanged, so the interior and character shots remain below the approved window-shot look.
- **Tests:** `tests/world-fog.test.ts` +3 (camera and rise staging incl. the S03-SH04 pivot and the S03-SH01 `dy`; far-shape scale; authored elbow places the hand). `src/painted/worldfog/qa.tsx` note now reads "BLOCKOUT — not the final look". Stills header and `src/videos/world-fog/index.ts` comment point to SS-R3.2.
- **Tools (episode-only):** `scripts/world-fog/lead-check.ts` (rig anchors through a no-op painter, plate camera; `node --import tsx`), `scripts/world-fog/qa-measure.py` (stdlib luma, colour mask and backlit ring on stills).

### Checks
- `npm run lint` exit 0. `npx tsc --noEmit -p . --typeRoots ./node_modules/@types` exit 0. `npm test` 95 pass (`world-fog` 11 pass). Logs under `out/logs/r2-*`.
- Determinism (production entry, separate browser runs in opposite order): G330, G1100, G1409, G1830, G2300 → 5 of 5 byte-identical by `cmp` (`r2/det-a`, `r2/det-b`).

### Numbers (`r2/lead-check.txt`, `qa-measure.py` on the labelled frames)
- **S01-SH01 G0 (contrast and size):** silhouette 139 px tall (y 641–780), centre (197, 715); silhouette mean luma 0.171 (≤ 0.20 ✓); 24 px ring mean 0.536 (≥ 0.45 ✓); difference 0.365 (≥ 0.25 ✓). G40 centre (300, 707), on the path key ✓.
- **S01-SH01 far shape (formula):** f0 h 134.5, f108 h 184.3, f125 h 195.7 px.
- **S02-SH01 f0 narrator (rig, 1.70 m):** head top 541, feet 1545, lead 1004 px (sheet 991).
- **S03-SH04 helmet centre:** (540, 560) at f0, f20 and f41 (±1 px).
- **S03-SH06 jammed hub:** f0 (540, 719), f16 (539, 700), f30 (537, 669) against the sheet (540, 720), (539, 700), (535, 669): within ±12 px at G2050 ✓.
- **S02-SH05 G760:** cart lowest part y 867 (< 950 ✓). Casters: free (701, 850), (804, 850), (707, 854); jammed (813, 854).
- **S04-SH01 G2200 (f40, rig):** worker lead 924 px (head top 454, feet 1378); narrator lead 926 px (head top 453, feet 1380). Face centres ≈ y 570 (head top + 1.17 head units), inside y 300–950 ✓; both ≥ 480 ✓.
- **S03-SH01 rise, head top with the camera tilt:** G1530 443, G1600 437, G1640 433, G1648 380 (crouch 0.80), G1655 215 px ✓ (≥ 150 throughout). Feet 1160 → 1308.
- **S02-SH08 crouched narrator (rig, crouch 1.0):** head top 443 / 438 / 433 px at f11 / f100 / f199; lead 717 / 731 / 746 ✓ (≥ 480). **S02-SH10 f60:** head top 573, lead 963 ✓.
- **S03-SH07:** G2140 jamb silhouette (both visible faces) 51 px at the push scale; the front face alone ≈ 36 px (≤ 40 ✓). G2159 worker face centre x 855, jamb edge 861 (6 px clearance): visible, the jamb touches the back of the hood.
- **Torch to mouth (estimated, not measured on the render; mouth at x −0.95, z −1.20, y ≈ 1.36 standing, ≈ 0.85 crouched):** knee grip ≈ 0.54 m; S03-SH02 hand ≈ 0.40 m (lens ≈ 0.52 m). All ≥ 0.25 m ✓.

### Visual review (contact sheets, viewed)
- Labelled frames: 54, `r2/labelled/`. Sheets: `r2/sheet_labelled_L1.png` (S01-SH01/02, S02-SH01), `L2` (S02-SH03/05/06/08), `L3` (S02-SH10, S03-SH01/02), `L4` (S03-SH04/06/07), `L5` (S04-SH01/02). Each frame's burned-in label reads `BLOCKOUT — not the final look`.
- 1 s pass: 88 frames (G0 … G2580 step 30, plus G2609) from the production entry, `r2/1s/`. Sheets `r2/sheet_1s_A.png` (tiles 1–44) and `r2/sheet_1s_B.png` (tiles 45–88). Tile order, shot IDs and TH times are in `r2/1s/manifest.txt`. Tile labels are not burned in: no drawtext or ImageMagick on this machine.

### Remaining defects (not fixed; reported honestly)
1. **S04-SH01 bent worker (G2240–G2290):** still reads as a raised leg at 270 px. The 60° torso pitch about the hip makes the coat and sleeve a long diagonal limb; the knee-bend and hem change did not fix the silhouette. Needs a bent-torso silhouette in the rig, or a smaller pitch agreed with Film and Mark.
2. **S01-SH01 halo:** passes the numbers, but reads as a flat amber disc behind the silhouette. Look call for Film.
3. **S02-SH05 wheel legibility at G760:** the jammed caster (813, 854) is a small dark mark inside the cart's dark mass. The sheet's "wheel discernible" is not clearly met.
4. **S03-SH06 jammed-wheel insert:** the hub numbers pass, but the wheel is dark on dark and weak to read.
5. **Interior and character quality (C):** only partly lifted. Faces, the cast drawing and the flat wall and floor washes are still blockout-grade next to the approved window shots.
6. **Standing leads in the sheet table** remain design heights; rig leads above cover the changed crouch and rise shots.

### Sheet change requests (Mark; not edited here)
1. **S03-SH07 "no frame bar wider than 40 px":** state the measure. The front face is ≈ 36 px, but the silhouette with the depth face is 51 px. The sheet's 21 px estimate (projection input `S03-SH07_CAM-INT-SIDE.json`) is not reproduced by the built geometry.
2. **S03-SH07 G2159 face:** the jamb touches the back of the hood, 6 px from the face centre. Confirm the acceptance wording.
3. **S02-SH05 G760 wheel:** choose a higher or lighter wheel read, or the SVG fallback the sheet names.
4. **S04-SH01 bend:** a 60° pitch reads as a raised leg. Consider a smaller bend value (sheet change) or Film's silhouette call.
5. **Projection inputs** under `storyboards/world-fog/short/projection/` were not re-run for the built shapes; the numbers above are rig-based.

### Dev findings
- DF-20261030-painted-straight-bars (new, workaround), indexed in `docs/dev-findings.md`.

## 2026-10-30 — Film: interior/character look development (VD18, brief VB-R4)

Scope: user decision "Film ตั้งลุคก่อน" (delivery record 30 Oct): one look frame for S02-SH08 at the S03-SH03 quality, plus S04-SH01 to show the look transfers. Sheets `WFOG-EP01-SHORT-SS-R3.2` unchanged (staging, cameras, timing). Brief bumped to `VB-WFOG-EP01-SHORT-R4` ([VD18](../../storyboards/world-fog/short/visual-brief.md#interior-character-look-vd18)). Worktree `claude/wordfog-post-merge-main-959703` on `baa96b8` plus uncommitted work; not committed; no other role invoked; delivery record and sheets not edited. **Look check pending**: the user picks before Boss applies VD18 to the other interior/character plates.

### Code (opt-in; the real pipeline, not a mock)
- `src/painted/worldfog/draw.ts`: `InteriorLight` (key, rim directions), `VD18` number table, `clipHalf`, `planeBand`, `formDir` (long parts shade across their axis), `glaze` (texture 0, no scatter), `modelPart` (glaze, lit plane, form shadow, hatching, opaque rim), `hatchIn`, `toneOf`, `lineOf`.
- `cast.ts`: `FigPose.light`; when set: toned bases with texture 0, `modelPart` per part, falloff down the body, coloured outlines, folds (elbow, knee, collar, waist, jacket), contact shadow + core, shaded neck; head functions get the light.
- `head.ts`: `faceModel` (crescent form shadow with a repainted lit oval, under-jaw, cheeks, skin rim), fringe shadow, modelled hair and back hair, sheen strokes, coloured lines; front and profile.
- `shop.ts`: `paintShop({light})`, `VD18_SET`; slate floor, ink tile joints, stacked pane reflections (clipped behind the window shelf), set-box modelling, lifted window shelf with lit pack tops, lips and slots, darker contact shadows. Module state `stockDim` is reset at every `paintShop` call.
- `layers.tsx`: `InteriorAir` (floor and ceiling falloff, screen-blend tube pool ≤ GLOW_PEAK). `src/painted/p5-brush.d.ts`: `hatchStyle`.
- `src/painted/shots/worldfog.tsx`: `LIGHT` table (CAM-LOW-SHELF, CAM-INT-2S); `lowShelfPlate`/`crouchedPair` take an optional light; **only S02-SH08 and S04-SH01 opt in**. Other shots: byte-identical to r2 (`cmp` vs `r2/1s/`: G330 S02-SH01, G1410 S02-SH10, G1560 S03-SH01, G1830 S03-SH03, G2400 S04-SH02).

### Frames (`out/qa/world-fog/WFOG-EP01-SHORT/lookdev/`)
- `full/` 1080×1920: S02-SH08 G1041, G1100, G1129, G1229; S04-SH01 G2200. `540/` copies. `compare/` before (r2, `before/`) | after, 540 px each: `S02-SH08_G1129_before-r2_vs_lookdev.png`, `S04-SH01_G2200_before-r2_vs_lookdev.png`. `sheet_S02-SH08.png` (4 frames, 270 px), `crop_S02-SH08_G1129_faces.png` (700 px full-res crop), `capzone/` overlays, `capzone.json`. All viewed.
- Determinism: two separate runs in opposite order (`full/`, `det-b/`), 5 of 5 byte-identical by `cmp`.
- Checks: `npm run lint` 0; `npx tsc --noEmit -p . --typeRoots ./node_modules/@types` 0; `npm test` 95 pass. Logs `out/logs/lookdev-*`.

### Numbers
- Lead (rig, geometry unchanged, `lead-check.ts`): S02-SH08 f11 717, f100 731, f199 746 px; S04-SH01 G2200 worker 924, narrator 926 px.
- Value structure S02-SH08 G1129 (luma, box mean): shape core (760–860, 420–700) 0.208 (r2 0.200); narrator hair crown (400–560, 450–520) 0.302 (r2 0.203, equal to the shape); window shelf (60–300, 420–520) 0.385 (r2 0.269); faces (420–560, 560–660) 0.536 (r2 0.508); floor y 1300–1920 0.159 (r2 0.437). The shape is the darkest subject in y 300–950.
- Caption band y 1000–1248: S02-SH08 mean 0.269 / 0.272 / 0.274 / 0.278, p95 0.508 / 0.532 / 0.535 / 0.557 (G1041/1100/1129/1229; r2 G1129 0.443 / 0.661). S04-SH01 G2200 0.346 / 0.643 (r2 0.380 / 0.672). Still fail 0.25 / 0.40 (knees, white shoes, torch hand are in the band): MK-WF-DEP-10 scrim still required.

### Findings
- **Textured fill pickup through opaque parts (proposed dev finding for Boss: `DF-20261030-painted-glaze-pickup`).** A `fill()` with `fillTexture(t > 0)` painted over an opaque multi-pass part shows marks painted before that part: the window shelf's pale lip showed through the occupant's hair and the narrator's jacket; the fog showed through a white shirt whose base had texture 0.07. Not fixed by `brush.render()` before the figure. Fixed by texture 0 with `scatter` false in every glaze over a part and texture 0 in VD18 bases (crops in `out/qa/.../lookdev/`, wip versions not kept). Reproduce: in `glaze` set `fillTexture(0.5, 0.4, true, 0.2)` and crop S02-SH08 G1129 at `crop=700:700:0:380`. Scope: p5.brush from `node_modules`, `--gl=angle`, Remotion 4.0.538. Same family as the SP03 fog pickup noted in the 29 Oct build notes.
- **Light over dark needs opaque passes.** A light glaze (rim, lit plane) barely changes a dark part (subtractive pigment); rims, lit ovals and shelf lips are 3 opaque passes or hard fills.
- **Painted strips for thin lines grow blobs.** Floor tile joints as filled strips looked like wobbly bands; still rotring ink lines are clean. A painted near-floor darkening band and a tube-pool quad grew puddle-like edges; both moved to the screen-space `InteriorAir` layer.
- Not addressed by the look (still open from r2): S04-SH01 bent worker silhouette, the right-edge gondola's wavy blockout edge in S04-SH01, sedan, wheel reads.

### For Boss (after the user's look pick)
Apply VD18 to S02-SH01, SH03, SH05, SH06, SH10, S03-SH01, SH02, SH07 and S04-SH02 by the brief's per-plate list (light table, `InteriorAir` tuning, checks). Extend the floor reflection clamp and `InteriorAir` placement to `-z`/`-x` cameras. Record the glaze-pickup dev finding. Re-measure render time on a sequence render.

## 2026-10-30 — Boss: fix pass three (r3): VD18 on every interior/character plate and the open r2 defects

Scope: user decision 30 Oct "ผ่าน ให้ Boss ทำทุกช็อต" (VD18 look check passed) and the delivery record's open defects. Sheets `WFOG-EP01-SHORT-SS-R3.2` and brief `VB-WFOG-EP01-SHORT-R4` unchanged (no edit here); changes proposed below. Worktree `claude/wordfog-post-merge-main-959703` (baa96b8 + uncommitted work): nothing committed or pushed; no other role invoked. Picture only (no VO, captions, music or SFX). IDs: V1–V5 (VD18), F1–F7 (defects), Q1–Q6 (questions for Film/Mark/Editor), DF-20261030-painted-glaze-pickup (new).

### What changed (owner files)
- **V1 VD18 per plate** (`src/painted/shots/worldfog.tsx`): every interior/character plate passes its setup's `InteriorLight` to the cast poses and to `paintShop` (new exported table `VD18_LIGHT`, all brief rows): S02-SH01 (CAM-COUNTER-IN), S02-SH03 (CAM-COUNTER-OUT), S02-SH05 (set only, CAM-LOW-SHELF), S02-SH06 (CAM-INT-REV), S02-SH08 (unchanged light), S02-SH10 (CAM-LOW-CU), S03-SH01 (CAM-LOW-SHELF, through `crouchedPair`), S03-SH02 (CAM-INT-REV), S03-SH07 (CAM-INT-SIDE), S04-SH01 (CAM-INT-2S, unchanged light), S04-SH02 (CAM-INT-DOOR-REV). Plate overlays are `interiorOverlay(id)`: `InteriorAir` + `Grade` 0.34 + `Grain` 0.11, with per-plate air table `AIR` (floor falloff and tube pool on the upper bodies; S04-SH01 pool moved from (600, 1250) to (674, 800), `floorFrom` 0.62 → 0.5, as the brief says).
- **V2 look-aware floor** (`src/painted/worldfog/shop.ts` `paintFloorLook`): joints behind the camera are dropped for `-z` as well as `+z`; the reflection-streak near clamp applies only to `+z` (`-z` and `-x` streaks run from the glass into the room; the clipper trims the part behind the camera). `paintBox` is look-agnostic (faces by the eye; VD18 bands are screen space): no change.
- **V3 rim strength** (`draw.ts` `InteriorLight.rimScale`, `rimScaleOf`; `head.ts` face rim): the glass-behind-camera rows (CAM-COUNTER-OUT, CAM-INT-REV, CAM-INT-DOOR-REV) use `rimScale` 0.5, as the brief's "rimMix × 0.5".
- **V4 face model** (`head.ts` `faceModel`): the lit oval is texture 0 (was 0.05), the glaze rule. Look not re-approved; Film may compare the S02-SH08 frame.
- **V5 S01-SH02 forecourt narrator (proposal)**: the brief has no CAM-FORECOURT row. The narrator (cast only; the exterior set is not VD18) takes the glass-behind-camera row (key [0.2, 1], rim [0.8, 0.6] × 0.5), because the shop glass is behind this camera. Film to confirm (Q5).
- **F1 S04-SH01 bent worker** (`shots/worldfog.tsx` `bend`): torso pitch 45° (bend 0.75), was 60°. At 60° the head sat behind the narrator and the coat and sleeve read as a kicked leg; at 45° the head shows (hood and face visible at 1080 px), the coat reads as a torso and the knees read bent. The sheet's "visible height ≈0.75 of standing (≈680 px)" is not met: bent lead 814 px (head top 566, feet 1380; `lead-check.txt`). Sheet change request Q1.
- **F2 S03-SH02 torch** (`torchSH02`, `SH02_TORCH_HAND`): hand (−0.80, 1.16, −0.88), was (−0.77, 1.30, −0.85). The old hand sat 2.5 cm above the chin line, 0.09 m below the mouth and 0.49 m from it in 3D, beside the jaw (microphone read). The new hand is below the chin line, 0.50 m from the mouth and 0.48 m from the right shoulder (reach 0.52 m). Torch angle 2.92 rad unchanged. Q2: the lens and hand now sit in the caption band (y ≈ 1180–1230 at 1 s).
- **F3 S01-SH02 sedan** (`car.ts` `paintSedan`, rebuilt side profile): rounded nose and tail, sloped windscreen and rear glass, sill at 0.18 m, wheels radius 0.32 m touching the ground inside arches (r2 radius 0.40 m by 0.39 m, centre on the sill, bottom about 7 cm below the ground). Shape reads as a car in the 1 s frame; still boxy in the door panel (large flat door).
- **F4 S01-SH01 backlight** (`car.ts` `paintFarShape`): one flat wash (opacity 230) replaced by ten stacked washes (opacity 128 down to 29; radius 0.46 h to 1.09 h; centre 0.6 h above the feet). Numbers on the mask-derived silhouette box [172, 641, 226, 780] (`qa-measure mask dark --thr 0.2`): silhouette mean 0.172 (≤ 0.20 ✓), 24 px ring mean 0.511 (≥ 0.45 ✓; r2 ring 0.536). Labelled crop `S01-SH01_G0`: no disc edge; a warm glow behind the upper body.
- **F5 profile notch** (`cast.ts`): the jacket's front-bottom corner at the hip moves from 0.12 H to 0.18 H (the trouser front), closing the step at the hip in S03-SH07 and S04-SH02 (full-res crop `S03-SH07_G2105_hip_fullres.png`).
- **F6 caster wheels** (`assembly.ts`): tyre 0.024 × 0.056 m (was 0.02 × 0.05), with base colour `#15181a` so the unlit silhouette (light 0) shows it (`base` on `Part`, used in `paintAssembly`). A separate hub part was tried and rejected: appended hubs changed the whole lit frame (S03-SH03 G1830 by 205k px) and inserted hubs shifted every later part's seed. The lit hub tick is the existing `paintHubs`.
- **F7 face see-through** (coordinator note): not reproduced; see DF-20261030-painted-glaze-pickup (shelf-swap diagnostic on S02-SH08 G1129: face 0 px over 8 levels, max 4; hair interior mean 0.76 levels). No glaze or texture fix needed beyond V4.
- **Tests** (`tests/world-fog.test.ts`, 3 new, 14 in file): VD18 light table (every interior setup defined; `-z` setups halve the rim); S03-SH02 hand geometry (below chin 1.275 m, ≥ 0.25 m from the mouth, 0.40–0.52 m from the shoulder); caster tyre base darker than the cart silhouette. `qa.tsx` label updated to r3.
- **Tools (episode-only)**: `scripts/world-fog/pass-sheets.py` (manifest, two 11-column sheets, byte comparison against a previous pass); `scripts/world-fog/lead-check.ts` row for the bent worker (f60, bend 0.75).

### Checks
- `npm run lint` exit 0 (no findings). `npx tsc --noEmit -p . --typeRoots ./node_modules/@types` exit 0 (after the last source change). `npm test`: 98 pass (95 + 3); `world-fog` 14 pass. Logs `out/logs/r3-*`.
- Determinism (production entry, separate browser runs in opposite frame order, G300, G1129, G1560, G1716, G2200): 5 of 5 byte-identical by `cmp` (`r3/det-a`, `r3/det-b`); G300 and G1560 also equal the one-second pass.
- Random-seek check: the one-second pass renders each frame in its own seek; the same frame rendered alone, in a batch and in the iteration run is byte-identical (G1530 checked three ways).
- Studio: not run interactively in this pass (no Studio session). Seek parity is covered only by the still renders above.

### Pass sheets and frames (`out/qa/world-fog/WFOG-EP01-SHORT/r3/`, viewed)
- `sheet_1s_A.png` (tiles 1–44) and `sheet_1s_B.png` (tiles 45–88): 1 s pass, production entry, 180 px tiles, manifest `1s/manifest.txt`. Both viewed.
- `sheet_labelled_L1.png` … `L5.png` (54 labelled frames, burned-in shot ID, TH time, G and f; `labelled/manifest.txt`). Labelled `BLOCKOUT — not the final look`.
- Full-res defect crops in `crops/`: `S02-SH08_G1129_faces_fullres.png`, `S01-SH01_G0_backlight_fullres.png`, `S01-SH02_G156_sedan_fullres.png`, `S03-SH02_G1764_torch_fullres.png`, `S03-SH07_G2105_hip_fullres.png`, `S02-SH05_G760_casters_3x.png`, `S03-SH06_G2050_jammed_caster_fullres.png`, `S04-SH01_G2260_worker_fullres.png`.
- Regression against r2 (`pass-sheets.py --prev r2/1s`): identical 7 (S02-SH02 phone ×3, S04-SH03 window without the cart ×4); changed 81. Window plates with the cart changed only at the casters (diff bounding boxes at the cart's foot: S02-SH04 G600 x 539–663, y 1060–1086; S02-SH07 G960 y 1265–1305; S02-SH09 G1290 y 1335–1379; S03-SH03 G1830 lit, x 378–594, y 1370–1421).

### Numbers
- **Caption band y 1000–1248** (`capzone-1s.json`, default thresholds mean ≤ 0.25, p95 ≤ 0.40): 87 of 88 frames fail; the one pass is a single S03-SH06 frame. Interior 1 s frames: S02-SH08 mean 0.269–0.278 / p95 0.513–0.558; S02-SH10 0.377–0.381 / 0.628–0.630; S02-SH03 0.610–0.635 / 0.742–0.753 (counter top and stock); S02-SH06 0.478–0.483; S03-SH02 0.475–0.492; S04-SH01 0.299–0.314 / 0.569–0.575; S04-SH02 0.461–0.483. MK-WF-DEP-10 (scrim) stays open for Editor.
- **S02-SH08 G1129 value structure** (labelled frame, Rec.709, `qa-measure lum`; Film's r2 numbers in brackets): shape core (760–860, 420–700) 0.208 [0.208]; narrator hair crown (400–560, 450–520) 0.302 [0.302]; window shelf (60–300, 420–520) 0.385 [0.385]; faces (420–560, 560–660) 0.535 [0.536]; floor (y 1300–1920) 0.161 [0.159]. The shape is still the darkest subject in y 300–950.
- **Lead** (`lead-check.txt`): all rig leads unchanged except the bent worker (814 px) ≥ 480; S02-SH05 cart lowest point y 869 (< 950); S03-SH04 helmet (540, 560) ✓; S03-SH06 jammed hub (540, 719) → (537, 669) ✓.
- **Jammed caster S03-SH06** (labelled G2050): the tyre box (520–560, 660–740) has no pixels below luma 0.22; the tyre reads as a mid-grey oval with a lit hub tick. The read is improved but still weak (Q4).

### Sheet and brief questions (not edited here)
1. **Q1 S04-SH01 bend**: sheet "visible height ≈0.75 (≈680 px)" against bent lead 814 px at 45°; the worker's head (x ≈ 802) still overlaps the narrator's left shoulder (torso ≈ 780–890). Options for Mark: torso pitch ≈30° (head x ≈ 724, clear), or narrator at x 0.95.
2. **Q2 S03-SH02 lens above the caption band**: with ST-07 (hand below the chin, ≥ 0.25 m from the mouth, 0.40–0.52 m from the shoulder) the hand and lens project into y ≈ 1180–1230 (caption band). The sheet's "lens above the caption band" cannot hold together with the ST-07 constraints; Editor/scrim owns the band.
3. **Q3 CAM-INT-SIDE wording (brief VD18 table)**: the row says "glass to screen-left", but the glass (z 0) is on screen right for this `-x` camera (lateral = z − cz). The rim vector [−1, 0.4] (light travels screen-left, from the glass) is applied as written. Film to confirm the wording.
4. **Q4 S03-SH06 jammed caster**: still mid-grey in the lit window plate (see Numbers). Film/Mark decide whether the read must be stronger (larger hub or lighter tyre).
5. **Q5 CAM-FORECOURT**: the proposed row (V5) needs Film's confirmation, or the S01-SH02 narrator returns to the blockout light.
6. **Q6 S02-SH03 caption band**: the counter top and stock keep the band at 0.61–0.64; a scrim fixes the band, the look does not.

### Open (not fixed in r3)
- Caption band (MK-WF-DEP-10) fails on nearly every shot; VD18 does not pass it alone (brief VD18 note).
- Floor reflections of the actors are not painted (brief VD18 open item; near floor is negative space by design).
- S04-SH01 right-edge gondola blockout wavy edge (brief VD18 open item) not addressed.
- Render cost: 88 one-second stills in 156 s on this machine (≈ 1.8 s per still including browser start); no sequence render or Studio session in r3.
- Brief VD18's "Boss re-measures when applying VD18 to all plates": done for the 1 s set and the caption band above.

### Dev findings
- DF-20261030-painted-glaze-pickup (new, workaround; indexed in `docs/dev-findings.md`): textured glazes over parts show earlier paint (Film, 30 Oct); the r3 shelf-swap diagnostic found no face pickup on S02-SH08 G1129; VD18 uses texture 0 throughout.

## 2026-10-30 — Boss: fix pass four (r4) against SS-R3.3 (WFOG-EP01-SHORT r4)

Scope: user decision 30 Oct "แก้อีกรอบก่อน (Mark+Boss)". Inputs: sheets `WFOG-EP01-SHORT-SS-R3.3` (index "SS-R3.3 fix list (Boss)", sc01 S01-SH02, sc02-b01 S02-SH03, sc03 S03-SH06, sc04 S04-SH01; projection JSONs for S01-SH02, S02-SH03, S03-SH02, S04-SH01); brief `VB-WFOG-EP01-SHORT-R4` (VD18) not edited. Index open item 17 (c) and (d) applied as Mark specified; (a) and (b) left to Film; item 16 gondola edge done. Worktree `claude/wordfog-post-merge-main-959703`: nothing committed or pushed; no other role invoked; no rule document edited. Picture only (no VO, captions, music or SFX). IDs: R4-1 to R4-5 (per shot), Q1 to Q7 (questions for Mark and Film), DF-20261030-painted-glass-sheen-veil (new). The r4 work starts from the r3 tree (baa96b8 + uncommitted work); the r3 frames are the regression baseline.

### What changed (owner files)
- **R4-1 S04-SH01 slump** (`shots/worldfog.tsx` `s4sh01`, `SLUMP`): worker stands at (0.25, −1.10), slumps facing the lens f48–f56 (`crouch` 0.30 eased, held to f130, straightens f130–f138), head bowed (`nod` 0.04), hands on thighs with elbows out by `via` (hands and elbows blend from the standing hang by `slump`), breath `rise` 0.012·slump, head to the narrator from f132 (`head: 'right'`), body to profile right at f140. The wavy right-edge gondola (item 16): aisle gondolas (ids 6, 7) are hard-edged in `shop.ts`.
- **R4-2 S01-SH02 sedan** (`worldfog/car.ts` `paintSedanBody`, `paintCabin`, `paintSedanDoor`, `SEDAN_DOOR`, `doorPt`; `outside.ts` `SEDAN` → ST-01 x −4.15…+0.35; `shots/worldfog.tsx` `forecourtPlate`): side profile from the sheet table (nose, bonnet 0.80→0.95, raked screen to roof 1.45, rear glass, boot, rocker), body colour `#5f676b` (see Q2), lit top faces (bonnet band, roof) at 25% toward `#f3efe2`, crease 0.62, wheels r 0.32 at −0.55 and −3.25, arches, side glass with one streak. Driver door 1.0 m, hinge −0.90, 55° (0.96 rad) at most, outer face (body panel, frame, dark glass, one streak), 0.07 m edge strip `#5d6466`, handle tick 0.15 m from the free edge. Opening (sill 0.40, top along the glass line to the B-pillar): far-door panel `#353d40` (see Q2), seat cushion, seatback, headrest with lit top edge, wheel rim (ink, x ≤ −0.93), dash line, courtesy glaze `#d8b878` at opacity 0.30 (max) on the headliner band and seat top while the door is open. Draw order (SS-R3.3): body → narrator → door for f48–f69; body + door → narrator from f70. Narrator: out of the car from f48 standing at (−1.35, 4.15), to (−1.35, 3.80) by f62, steps to (−1.55, 3.20) by f74, walks toward (0.3, 2.0) at 1.33 m/s and leaves frame right about f110; phone f84–f96; the hand on the free edge at 0.9 m, f72–f80 (screen-left hand, Q5). Door SFX: Editor's note, no Boss action. Far sedan ghost in the window shots (`paintOutside` `SEDAN`) moves with the car body (ST-01).
- **R4-3 S02-SH03 counter** (`space.ts` `CAM-COUNTER-OUT` eye 1.10 m, `y_h` 780; `shots/worldfog.tsx` `counterOutPlate` push about (540, 530), `COUNTER_OUT_DRESS`, `AIR` pool (540, 560) 460 × 300 at 0.14, `floorFrom` 0.52, `floor` 0.60; `worldfog/shop.ts` `ShopDress`, `counterDetail`, per-box `topLift`): counter front `#2e3335` with laminate seams every 0.6 m, counter top `#4a5150` with the top lift ×0.15 and no mottled glaze, hard nosing `#8f9794` 6 px at the near top edge, register at the counter's −x end (x −2.78…−2.42, y 0.90–1.20, centre z −2.95), back-shelf panel in the window shelf's VD18 colours (`VD18_SET.shelf` / `shelfSide`) with lit pack tops on the top row only (item 17 c). The stock dim of 0.30 toward `#262d2f` was already the shared VD18 value (`stockDim`), so it is unchanged. Other interior shots keep the shared set (`dress` is opt-in).
- **R4-4 S03-SH02**: no code change. Hand (−0.80, 1.16, −0.88) is the sheet value; lens checked against the sheet point (−0.749, 1.163, −0.771) in lead-check (Q2 r3 accepted).
- **R4-5 S03-SH06 jammed caster** (`worldfog/assembly.ts`: `LIT.wheel` `#24272a` → `#121516` for all casters, a shared tyre asset; `pose.judder` on the jammed caster and deck, 0.0018 m = 2.0 px at s 3.0, alternating 5-frame blocks f6–f30 (`asmPoseAt` wrapper, `JAM_JUDDER`); `paintJamGround` (torch pool 0.30 × 0.10 m, wet scrape 0.03 m from the f0 contact); `paintJamTyre` (fixed scuff on the tread face, warm rim `#e0b27a` on the upper-left edge, spray ticks beside the contact f6–f30). `worldfog/outside.ts` option `jam`; `worldfog/layers.tsx` `Glass` option `sheen` (default 1, unchanged); S03-SH06 window: `sheen` 0, `lowBank` 0.2 (see DF-20261030-painted-glass-sheen-veil).
- **Tests** (`tests/world-fog.test.ts`): the caster test now filters tyres by base colour and checks the lit colour (≤ 0.12); three new contract tests: counter-out projection (far top 929, nosing 1003), door free edge x 242 ± 15 at 55°, judder timing f6–f30 and 2.0 px at s 3.0. `worldfog/qa.tsx` label → r4.
- **Tools (episode-only)**: `scripts/world-fog/lead-check.ts` rows for the slumped worker, the step-out, the counter edges and the S03-SH02 hand and lens (imports `SH02_TORCH_HAND`); `scripts/world-fog/qa-gap.py` (new, stdlib): S04-SH01 worker-to-narrator outline gap per frame by colour segmentation (navy coat vs narrator non-background; approximate).

### Checks
- `npm run lint` exit 0 (no findings); `npx tsc --noEmit -p . --typeRoots ./node_modules/@types` exit 0; `npm test` 101 pass (world-fog 17 pass; 98 before, plus 3 new). Logs `out/logs/r4-*`.
- Determinism (production entry, two separate browser runs in opposite frame order; G300, G474, G1560, G2050, G2240): 5 of 5 byte-identical (`r4/det-a`, `r4/det-b`). The 1 s pass frames G300 and G1560 and the gap-run frame G2240 are byte-identical to det-a.
- Studio: not run (no interactive session). Seek parity is covered only by these still renders (separate browser runs, opposite order).
- Regression vs r3 (`pass-sheets.py --prev r3/1s`, byte-level per tile): identical 8 (S01-SH01 ×5 car interior; S02-SH02 phone ×3); changed 80. Changed shots: S01-SH02 (sheet), S02-SH03 (sheet), S03-SH06 (sheen 0 and jam), S04-SH01 (slump and gondola edge), S02-SH01 (small: the sedan ghost through the glass), S02-SH04/07/08/09/10, S03-SH01/03/04/05/07, S04-SH02/03 and S02-SH05/06 (casters: tyre colour, and window ghosts; S02-SH06, S03-SH02, S04-SH02 also show the gondola edge only, sparse pixels; checked by the r3/r4 difference image).

### Acceptance numbers (`r4/labelled/`, `r4/gap/`, `r4/1s/`)
- **S04-SH01** (every frame f48–f138, G2208–G2298, `r4/gap-s04sh01.txt`): worker-to-narrator outline gap min **90 px** (G2230), no frame below 80 → PASS (approximate colour method). Rig head top 580–584 (sheet ≈ 573) → 7–11 px off → noted (Q3). Lead 798 / 806 / 812 at f56 / f100 / f130 (sheet ≈ 805) → PASS. Head centre x 510–512 (sheet 513 ± 20) → PASS.
- **S01-SH02**: G174 (f48) standing lead 703 px (≥ 480) → PASS; G188 (f62, the step-out mark) lead 792 (design 759). Bonnet band lit top p95 0.537 vs side 0.398 at G156 → PASS (lighter). Side panel (x 300–500, y 985–1150) G156 mean 0.398 (sheet 0.30–0.42) → PASS after the colour change; the first build at `#6b7276` read 0.438 → FAIL, see Q2. Visible opening (x 150–236, y 820–1150) G186 mean 0.266 (sheet 0.15–0.28) → PASS after `#353d40` (the first build read 0.282 → FAIL). Door free edge projects to x 242.0 (test) → PASS; pixel scan not done. Seat, headrest and wheel rim visible at G186 → FAIL by geometry: they project behind the open door (Q1). Face and eyes not measured separately.
- **S02-SH03**: caption band (x 0–1080, y 1000–1248) G474 mean 0.203 / p95 0.233; G500 0.205 / 0.263; G539 0.211 / 0.308 → PASS (≤ 0.25 / ≤ 0.40) without a scrim. Face (x 500–580, y 540–600) 0.755 vs stock 0.319–0.358 (mean 0.340) → +0.41 → PASS (≥ +0.10). Counter far and near top at G474 934 / 1010 and at G500 944 / 1022 (the push at s ≈1.01–1.04; 929 / 1003 at s 1.0 by projection test) → PASS. Rig lead to counter far top 553 (G474) and 567 (G500) → PASS (≥ 480). Rig head top (hair) 381 / 377 vs the sheet's 397 at the 1.70 m point → 16–20 px off (Q4). Face y 531 not measured in pixels.
- **S03-SH02** (G1790, rig projection): hand (343, 1209) and lens (170, 1290) vs (342, 1209) and (169, 1290) ± 15 → PASS; hand to face centre 0.555 m (≥ 0.45) → PASS. The caption track is not rendered here (Editor).
- **S03-SH06** (G2050): tyre core luma L 0.095 / R 0.094 (≤ 0.12) → PASS (r3 was 0.31). Dark core bbox 64 × 112 px (≥ 30 wide, ≥ 100 tall) → PASS. Ground band (x 500–580, y 764–790) 0.398 (≥ 0.35) → PASS. Hub (rig) 719 / 698 / 667 at f0 / f16 / f30 (sheet 720 / 700 / 669, ± 12) → PASS. Judder 2.0 px at s 3.0 (test) → PASS. Warm rim, fixed scuff, wet scrape and spray ticks: visible in `crops/S03-SH06_G2050_caster_4x.png` and the 3-frame strip; not measured numerically (the amber detector finds 0 px on the rim) → VISUAL ONLY.
- **Caption band, all 88 one-second frames** (`r4/capzone-1s.json`): 4 pass (S02-SH03 3 of 3, S03-SH06 1 of 1); 84 fail (r3: 87 failed). The band still crosses figures and set fog on the other shots; the scrim is MK-WF-DEP-10 for Editor.

### Sheet and brief questions (not edited; for Mark and Film)
- **Q1 S01-SH02 cabin at G186**: the seat (x −1.25…−1.75), headrest and wheel project to screen x ≈ 232–413, and the door free edge is at x 242. The only visible opening band is the far-door panel (x 146–242). The sheet's "opening shows seat/headrest/wheel rim" at G186 cannot hold with a 55° door in front. Mark: move the acceptance (frame or door angle) or accept the flat panel.
- **Q2 S01-SH02 luma**: the sheet's body `#6b7276` has luma 0.45, above the side range 0.30–0.42 at G156, and the overlay stack keeps it at 0.44. Boss used `#5f676b` (0.40). Far-door fill: the sheet's `#3b4244` read 0.28 (limit) → `#353d40`. Mark to confirm the colours or the range.
- **Q3 S04-SH01 head top**: the rig's crouch 0.30 gives head top 580–584 vs ≈ 573 (lead 798–815 vs ≈ 805 matches). Crouch 0.27 would land near 573. Not applied (sheet value kept).
- **Q4 S02-SH03 head top**: rig head top (hair) 377–381 vs 397 at the 1.70 m point; counter edges match after the push. Mark to confirm whether 1.70 m or the hair top is the sheet's reference.
- **Q5 S01-SH02 hand**: the sheet says her left hand reaches the free edge (f72) and pushes it shut (f80). With the narrator facing the lens the free edge is on screen-left, the character's right hand in rig naming (`rArm`). Boss used the screen-left hand. Mark to confirm.
- **Q6 S01-SH02 handedness**: the sheet says a right-hand-drive car with the nose at +x. Then the driver's side (right) is z 6.0, the far side, but the sheet puts the driver door on z 4.2 (the shop side). Built as the sheet says. Mark to confirm.
- **Q7 S04-SH01 head turn**: the rig has front and profile heads only, no in-between. The head switches to profile at f132 while the body is front until f140, so f132–f139 show a profile head on a front body. An in-between pose would be a rig change (Boss, if wanted).
- **Film, item 17**: (c) applied as above (back-shelf panel colours and top-row lit tops; counter top lift 0.15; the stock dim was already 0.30). (d) courtesy glaze at 0.30 is implemented but is hidden behind the door at G186. (a) and (b) are not edited.

### Remaining issues (not fixed)
- S03-SH06 window: pane sheen 0 and low bank 0.2 for this insert (look deviation; DF-20261030-painted-glass-sheen-veil).
- `LIT.wheel` is a shared tyre asset: the near-black tyre reaches every lit cart frame (window and shelf shots). The S02-SH05 casters read at light 0 (unchanged) and darker when lit; Mark to recheck in the next review.
- The counter front shows a lighter VD18 head band at about y 1040–1140, inside the caption band; the band still passes (0.20–0.21 mean).
- Studio not run; the caption scrim (MK-WF-DEP-10) is for Editor.

### Artifacts (`out/qa/world-fog/WFOG-EP01-SHORT/r4/`)
- `1s/` (88 frames, production entry), `sheet_1s_A.png` and `sheet_1s_B.png` (viewed; tiles 1–44 and 45–88), `labelled/` (24 frames, `WFOG-QA` entry), `sheet_labelled_r4.png` (viewed), `gap/` (91 frames G2208–G2298), `gap-s04sh01.txt`, `lead-check.txt`, `capzone-1s.json`, `det-a/`, `det-b/`, `crops/` (S01-SH02 car at rest and door, 540 px; S02-SH03 frame at 540 px; S04-SH01 frame at 540 px and gondola edge at full resolution; S03-SH06 caster 4× and a 2× three-frame strip). `dev1/`, `dev2/`, `dev3/`, `measures-first.txt` are development renders and first measurements, superseded by the final tree.
- Logs: `out/logs/r4-*` (tsc-final, lint-final, test-all, 1s-stills-final, pass-sheets-final, labelled-final, det-a-final, det-b-final, gap-stills, gap-all, lead-check-2, capzone-1s).
