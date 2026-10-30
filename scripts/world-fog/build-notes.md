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

## 2026-10-30 — Boss: fix pass five (r5) against SS-R3.4 (WFOG-EP01-SHORT r5)

Scope: user decision 30 Oct (front-view elbow goes back into depth; pick the pose per situation) and the sheet `WFOG-EP01-SHORT-SS-R3.4` (index "SS-R3.4 fix list (Boss)", arm rows in sc01, sc02-b01, sc02-b02-b03, sc03, sc04). Brief `VB-WFOG-EP01-SHORT-R4`, script, fact-check, timing, cues, Sound and IDs unchanged. Worktree `claude/worldfog-editor-adjust-5fd1ad`: nothing committed or pushed; no other role invoked; no rule document edited. Picture only (no VO, captions, music or SFX). IDs: R5-1 to R5-8 (per change), Q1–Q6 (questions for Mark and Film), DF-20261030-painted-arm-depth (new entry, workaround).

### What changed (owner files)
- **R5-1 rig** (`worldfog/cast.ts`): `shoulderHeight(who, crouch)` exported: the front-view shoulder anchor height from the same levels `drawFigure` uses (cast test: equal to the painted anchor at crouch 0, 0.3 and 1). `Arm.via` and `Arm.behind` kept as the coordinator wrote them; draw order unchanged.
- **R5-2 S01-SH02 phone (L)**: AB1. Hand unchanged (x+0.12, 0.90→1.15, z−0.12); `via` (x+0.15, 0.93, z+0.04) moves with her; `behind 'upper'`. The r4 gate `phone > 0` (first arm frame f85) is kept; the sheet's "from f84" is the same first frame.
- **R5-3 S02-SH01 phone (L)**: AB1. Hand unchanged (x+0.06, 1.12, z−0.20); `via` (x+0.15, 0.95, z+0.04); `behind 'upper'` f0–f113.
- **R5-4 S02-SH01 torch (R)**: lowering f96–f104 (sheet timing; the r4 code ran f96–f106) to the rig hang (x−0.17, 0.64, z) = (−0.62, 0.64, −2.30), lens down. The target is beyond the arm's reach (0.541 m against 2L = 0.52 m), so the IK clamp makes the arm straight. The r4 point (−0.65, 0.95, −2.25) is removed.
- **R5-5 S02-SH03 shop worker**: hands moved in to ±0.08 m on the far counter edge (r4 ±0.22 m); elbows (−1.85, 0.94, −3.56) and (−2.15, 0.94, −3.56) with `behind 'upper'` on both arms.
- **R5-6 S02-SH06**: narrator R torch arm AB1 (`via` (−0.85, 0.93, −1.36), `behind 'upper'`). Occupant R/L AB0-F (helper `clutch`): hands unchanged; elbows lerp with the hands' ease f30–f50, R (−1.16, 0.86, −1.97) → (−1.18, 0.90, −1.72), L (−1.44, 0.86, −1.97) → (−1.42, 0.90, −1.72); no behind.
- **R5-7 S03-SH02**: R elbow (−0.80, 0.93 → 1.00, −1.36 → −1.10) with the hand's ease f36–f96. Through the rise (f0–f12) the elbow keeps its 0.25 m offset from the crouched shoulder (`shoulderHeight`). `behind 'upper'` while the elbow is behind the torso front plane (z −1.22); first frame without behind: f68. L hand (−1.05, 1.05, −1.20) unchanged; L elbow (−1.10, 0.93, −1.36) with `behind 'upper'`. New export `sh02Arms(proj, f)` (also the test hook). Comment corrected: the torch hand is 0.42 m from the rig shoulder (−0.814, 1.18, −1.30); the r3 reference (−0.77, 1.40, −1.3) was wrong.
- **R5-8 S04-SH02 torch (R)**: profile f24–f36 the hand lowers from (0.60, 1.00, −1.00) to (0.86, 0.66, −1.10) and the torch lens turns from 0.6 rad to π/2 + 0.2 (the same lens-down angle as the front). Front from f36: the rig hang (1.02, 0.66, −1.10), no behind. The r4 point (0.62, 0.90, −1.05) is removed.
- **Label** (`worldfog/qa.tsx`): WFOG-QA note → fix pass five (r5).
- **Tests** (`tests/world-fog.test.ts`): ST-07 shoulder reference → rig anchor (reach band still 0.40–0.52 m; now 0.42 m). Three new tests: `behind` draw order (upper arm before the shirt; behind all: hand before the shirt; no behind: no far tint, hand after the torso); `shoulderHeight` equals the painted anchor at crouch 0, 0.3 and 1 for narrator and occupant; S03-SH02 rows (rig shoulder against the sheet, elbow offset through the rise, behind switch at f67/f68, G1680 and G1764 within 15 px, right elbow x ≥ 380 at every frame).

### Checks
- `npm run typecheck` exit 0 (`out/logs/r5-typecheck.log`); `npm run lint` exit 0 (`r5-lint.log`); `npm test` 118 pass, 0 fail, exit 0 (`r5-test-all.log`; world-fog file 20 of 20 including the 3 new: `r5-test-world-fog.log`).
- Lead check (`scripts/world-fog/lead-check.ts`, exit 0): head tops and leads unchanged (`r5-lead-check.log`).
- Determinism: labelled G474, G1723 and G1764 re-rendered in a second browser run in reverse order → byte-identical (`r5/det-b/`). Production: S04-SH01 G2340 re-rendered in a new session → byte-identical to the 1 s tile (`r5/det-c-prod/`). S03-SH07 G2100 and G2130 are not byte-stable across sessions (see Regression).
- r4 reproduction: the r4 commit `e96a4e1` (src, scripts and tests identical to the r4 worktree at `94fd2f3`) rendered with the same stills script → byte-identical to the r4 folders for labelled G474, G500 and G1764 and production G300 (`r4/1s`, `r4/det-a`). The before/after pairs therefore come from the same pipeline.
- Studio not run. Seek parity covered only by CLI stills in separate browser runs (above).

### Regression vs r4 (`pass-sheets.py --prev r4/1s`, byte-level per tile; `r5/1s/`)
- Identical 68, changed 20, new 0 (88 tiles).
- Expected changes (17): S02-SH01 G240, G270, G300, G330; S02-SH03 G450, G480, G510; S02-SH06 G810, G840, G870; S03-SH02 G1680, G1710, G1740, G1770; S04-SH02 G2430, G2460, G2490.
- Unexpected at byte level (3): S03-SH07 G2100 and G2130, S04-SH01 G2340. PSNR 95–111 dB against r4 (SSIM 1.000 for G2100 and G2340): about one LSB in a few pixels, no visible change. S04-SH01 G2340: the r5 render is byte-identical to the r4 code re-rendered in the same session, so the difference is in the stored r4 tile, not the code. S03-SH07 G2130: the same r5 code differs between two sessions (95.3 dB) and the stored r4 tile differs from the r4 code re-render (103.8 dB). Treated as session render noise, not an r5 change; root cause not established (no `Math.random` or `Date.now` in `src/painted` or `src/scenes`).
- No change expected and none seen: S01-SH01; S01-SH02 (G150, G180, G210 identical; the phone arm first appears at f85); S02-SH02; S02-SH04; S02-SH05; S02-SH07–S02-SH10; S03-SH01; S03-SH03–S03-SH06; S04-SH03.
- Sheets viewed: `r5/sheet_1s_A.png` (tiles 1–44) and `r5/sheet_1s_B.png` (tiles 45–88); no change beyond the expected tiles.

### Acceptance numbers (`r5/labelled/`, `r5/pops/`, `r5/1s/`)
- Plate px at s 1.0 from `PROJ` against the sheet (scratch projection check, not committed): S01-SH02 G222 L shoulder (756.4, 988.3) vs sheet (756, 989); L elbow (761.7, 1160.0) vs (762, 1160); L hand (759.0, 1028.1) vs (759, 1028). S02-SH01 G300 L elbow (797.9, 986.5) vs (797, 985); L hand (769.9, 910.7) vs (770, 911). S02-SH03 G474 elbows (446.9, 879.3) / (633.1, 879.3) vs (447, 879) / (633, 879); hands (481.1, 905.3) / (598.9, 905.3) vs (481, 905) / (599, 905). S02-SH06 G830 narrator elbow (488.1, 1255.8) vs (488, 1256), hand (417.8, 1272.2) vs (418, 1272), shoulder (500.4, 1005.4) vs (500, 1007); G850 occupant L elbow (942.8, 1168.6) vs (943, 1169). S04-SH02 G2470 hand (353.0, 1629.0) vs (353, 1629). All within 2 px. These check the arithmetic of the sheet numbers against the code constants, not the render.
- S03-SH02 (test): G1680 elbow (436, 1256) and hand (366, 1283); G1764 right elbow (403, 1301) and hand (350, 1180), left elbow (748, 1256) and hand (723, 1187): all within 15 px. Rig right shoulder at the narrator's ground point: (445, 1005) against the sheet (445, 1007).
- Measured on the frames: none (the frames were inspected by eye; no pixel measure of arm positions).

### Sheet and brief questions (not edited; for Mark and Film)
- **Q1 S03-SH02 f68 layer switch**: the right upper arm turns from behind the jacket to in front at f68, the frame the elbow crosses the torso front plane. The sleeve and its outline appear over the jacket in one frame (`pops/S03-SH02_switch_G1722-G1725_f66-f69_crop540.png`). Mark: keep the sheet's crossing rule, or move the switch to a frame where the upper arm is outside the torso silhouette (a tone-only change; the sheet's "never while outside" line would then need revising).
- **Q2 S04-SH02 f36 view switch**: the body flips from profile to front at f36 (already in r4). The hand moves about 176 px at s 1.0 (0.16 m) to her right side on the same frame (`pops/S04-SH02_switch_G2434-G2437_f34-f37_crop540.png`). Mark: accept the pose switch as written, or allow an 8-frame glide from the profile hand to the front hang (Boss; the end state is unchanged).
- **Q3 AB0-F reading (S03-SH02 from f68; S02-SH06 occupant)**: at G1764 the forward elbow lies over the jacket and reads as a sleeve panel on the chest (`crops/S03-SH02_G1764_frame_540.png`). The occupant's elbows at S02-SH06 are mostly behind the narrator (G850). Film/Mark: does the forward-elbow read hold, or should the hand or forearm move?
- **Q4 S02-SH01 lowering timing**: the sheet says f96–f104; the r4 code ran to f106. r5 follows the sheet (8 frames).
- **Q5 occupant clutch arms appear at f30** (sheet timing kept): the arms appear at the hip level at f30, as in r4, and the hands' ease then moves the elbows forward.
- **Q6 S01-SH02 phone arm appears at f85** (`phone > 0` gate, as in r4): the hand enters from the hip. Timing unchanged; flagged only.

### Remaining issues (not fixed)
- S03-SH02 f0–f12 rise: the right elbow hangs from the crouched shoulder by construction, but it sits behind the counter edge, so the attachment is not visible. The visible hand and forearm stay continuous in the checked frames (`pops/S03-SH02_rise_G1656_f0_G1668_f12_crop540.png`). The 1 s pass has no frame in that range.
- S02-SH06 occupant arms are mostly behind the narrator; the clutch read is weak in the stills.
- S03-SH07 G2100 and G2130 are not byte-stable across browser sessions (≈ one LSB); the stored r4 tiles have the same property. Not caused by the arm rows; root cause open.
- Long not rendered (no Long composition for this deliverable); Studio not run; captions and sound out of scope.

### Artifacts (`out/qa/world-fog/WFOG-EP01-SHORT/r5/`)
- `labelled/` (WFOG-QA, 23 frames: G222, G300, G350, G474, G500, G830, G850, G1680, G1764, G2470; neighbours G210, G211, G1656, G1662, G1668, G1722, G1723, G1724, G1725, G2434, G2435, G2436, G2437).
- `sheet_before_after_r4_r5.png` (viewed; nine pairs, r4 left and r5 right, labelled).
- `crops/S02-SH03_G500_frame_540.png` and `crops/S03-SH02_G1764_frame_540.png` (viewed).
- `pops/` (switch strips, rise strip, phone and occupant r4/r5 crops; viewed).
- `ba/r4-labelled/` and `ba/r4-prod/` (r4 re-renders from the r4 commit; byte-identity above).
- `det-b/` (reverse-order determinism run, labelled); `det-c-prod/` and `det-c-r4-prod/` (production re-renders, new session).
- `1s/` (88 production frames), `1s/manifest.txt`, `sheet_1s_A.png`, `sheet_1s_B.png` (both viewed).
- Logs: `out/logs/r5-*`.

## 2026-10-30 — Mark: SS-R3.5 arm read check (r5) and a proposed CP-P02 wording

Scope: Mark closing Boss r4 Q1–Q7 and r5 Q1–Q6 (decisions in `storyboards/world-fog/short/index.md` "SS-R3.5 fix list (Boss)"). Measured on r5 labelled frames with ffmpeg row scans (scratch, not committed; jacket/shirt colour runs per row):
- S02-SH03 G474: shirt edge x 424 / 652 at y 760–840; elbows (447, 879) / (633, 879) 20+ px inside; hands' skin x 447–524 / 553–611 at y 905 on the cream apron; forearm past the hand ≈ 8 px → "no arms". S03-SH02 G1764 left elbow 748 vs jacket edge 788 (40 px inside), forearm under the hand. S01-SH02 G222 and S02-SH01 G300 elbows 20–25 px inside the jacket edge (forearm visible but no upper-arm sliver). S02-SH06 G830 and S03-SH02 G1680 right arms pass (hand and forearm outside the torso).
- Rig numbers used (`src/painted/worldfog/cast.ts` at `bf0dd6e`): head H 0.425 m; torso shape half-width `outfit.shoulder·H` at the shoulder to `0.3·H + 0.013` (+0.021 with a jacket) at the hip; upper-arm capsule 0.08 → 0.068 m wide, forearm 0.066 → 0.056 m, hand ellipse 0.045 × 0.052 m centred 0.03 m past the target. Painted brush edge ≈ +0.01–0.02 m beyond the shape.

**Proposed rule change (not applied; for the user's review, [TL/DP](../../docs/contributing.md#tools-and-document-improvements)):** CP-P02 "The elbow sits just inside the torso edge, a little below the hand" → "The elbow centre sits on the torso's painted edge (not more than about a sleeve's half-width inside it), so the darker upper arm shows as a sliver down the torso side; the forearm stays visible between that sliver and the hand. With a low camera and hands on a surface the elbow may project above the hand." Reason: r5 measured every elbow placed "just inside" hiding the upper arm completely; with the hand also over the torso the arm read as missing (user, 30 Oct: "the worker's arms still look strange").

## 2026-10-29 — Shared profile head changed (`HEAD-SIDE-R2`, Boss, ZCPAINT pass)

- User (29 Oct 2026): front decal head stays; the profile was a draft. `src/painted/spike/SideSheet.tsx`
  `paintHeadSide` is rebuilt and exported (nose bump, C ear, short men's cut with sideburn and crown tufts, tied/bob/hood
  kept, profile face controls and blink); `paintBodySide` moves the neck under the back half of the head and returns
  the head anchor. Front `FaceSheet.paintHead` untouched: FaceSheet/Cast/Proportions re-render pixel-identical.
  `PAINTED-SPIKE-CastSide` changes. Details, evidence and review sheet `PAINTED-SPIKE-HeadSide`:
  [ZCPAINT build notes](../zombie-condo-paint/build-notes.md).

## 2026-10-30 — Boss: fix pass six (r6) against SS-R3.5 (WFOG-EP01-SHORT r6)

- Scope: index "SS-R3.5 fix list (Boss)" R6-1 to R6-5 and the sheet blocks it points to (sc01, sc02-b01, sc02-b02-b03, sc03). Mark's uncommitted SS-R3.5 sheet edits are kept and not changed. Brief VB-WFOG-EP01-SHORT-R4 unchanged; timing, cues, Sound, reveals, cameras and stable IDs unchanged. Worktree `claude/world-fog-next-steps-2817bc`, base `bf0dd6e`. No commit, no push, no other role invoked.

### What changed (owner files)

- `src/painted/shots/worldfog.tsx`
  - R6-2: S01-SH02 phone elbow x+0.15 → x+0.185 (y 0.93, z+0.04), f85–f113 (`phone > 0` gate unchanged).
  - R6-3: S02-SH01 phone elbow x+0.15 → x+0.185 (y 0.95, z+0.04), f0–f113.
  - R6-1: `counterWorkerArms(proj)` (new export) for S02-SH03: hands R (−1.87, 0.93, −3.22), L (−2.13, 0.93, −3.22); elbows R (−1.82, 1.02, −3.56), L (−2.18, 1.02, −3.56); `behind 'upper'` on both, whole shot.
  - R6-4: `clutch` (now exported) for S02-SH06: `behind 'upper'` f30–f107; elbows R (−1.12, 0.86→0.96, −1.97), L (−1.48, 0.86→0.96, −1.97) with the hands' ease f30–f50; hands R (−1.24, 0.90→1.20, −1.75), L (−1.36, 0.90→1.20, −1.75). The L hand end height is corrected (C1).
  - R6-5: `sh02Arms`: right upper arm `behind 'upper'` on every frame (the r5 `SH02_TORSO_FRONT` switch and constant are removed); left elbow x −1.10 → −1.135 (y 0.93, z −1.36).
- `src/painted/worldfog/car.ts` (`paintCabin`, S01-SH02 only): far-door armrest/trim line at 0.70 m (x −1.88…−0.93 on the body plane, colour `#23292b`, seed +337, projected point by point, C3). Courtesy glaze is now one wash over the far-door upper third 1.07–1.40 m (was the 1.20–1.40 headliner band); alpha 77·courtesy, so ≤ 0.30 as before. Body `#5f676b` and far-door `#353d40` were already built in r4.
- `src/painted/worldfog/qa.tsx`: preview note → "Boss fix pass six (r6)".
- `tests/world-fog.test.ts`: S03-SH02 switch assertion replaced (both upper arms `behind 'upper'` f0–f143); G1764 left elbow 748 → 784 px; new tests for the S02-SH03 worker points (G474) and the S02-SH06 occupant (no arms before f30, `behind` f30–f107, G850 points). Suite 120/120 (the r5 record shows 118).
- Docs: `DF-20261030-painted-arm-depth` revalidated (r6 bullet, status base); new `DF-20261030-projectpoly-two-point-line`, `DF-20261030-render-run-noise`, `DF-20261030-worktree-node-modules`; `docs/dev-findings.md` index rows updated.

### Corrections and deviations (read first)

- C1, occupant L hand (outside the fix list, which says "hands unchanged"): r5 code ended the L hand at y 1.15. The sheet says 0.90 → 1.20 for both hands, and the G850 sheet point (889, 934) is reached only at y 1.20; y 1.15 projects to (889, 972), 38 px off. Implemented 1.20 per the sheet. Question Q1.
- C2, timing of the far-door change: the fix list expects the S01-SH02 changes "from f84". The trim and glaze are drawn while the door is open: door > 0 from about f43, glaze ramp f44–f48, door shut again at f80. The first changed frame is therefore about G169, and G210 (f84) is unchanged. The phone elbow (f85–f113) is not sampled by the 1 s pass (G210 → G240); its check is the labelled G222.
- C3, trim line: the first version drew nothing, because `projectPoly` drops two-point input (`DF-20261030-projectpoly-two-point-line`). Fixed in this pass; all numbers below are after the fix. Six existing two-point lines in `car.ts` (dash, head top, seams, crease, chrome) were never drawn in r5 and are left as built.

### Checks

- Dependencies: the worktree `node_modules` was partial (p5.brush missing), so the first still failed at bundle time. `npm ci` (exit 0), then `npm ls --depth=0` exit 0 with no extraneous, invalid or missing entries (`out/logs/r6-npm-ci.log`, `r6-npm-ls.log`). `node_modules/.bin/remotion versions` → 4.0.538 (`npx` exited 127 on the first attempt).
- Typecheck `npm run typecheck`: exit 0, 0 errors, run after C3 (`out/logs/r6-typecheck2.log`).
- Lint `npm run lint`: exit 0 (`out/logs/r6-lint2.log`).
- Tests `npm test`: 120 pass, 0 fail (`out/logs/r6-test2.log`).
- Renders: production entry `src/index.ts` for the 1 s pass; QA entry `src/painted/worldfog/qa.tsx` (WFOG-QA, burned-in labels) for the labelled frames. Both after C3.
- Studio: not run. Long: no WORLD FOG Long composition is registered in this checkout (`src/videos/world-fog/index.ts` only).
- Shared consumers: `paintSedanBody` and `paintSedanDoor` (car.ts), and `clutch`, `sh02Arms`, `counterWorkerArms` (worldfog.tsx), are used only by the Short plates (grep, 2026-10-30).

### Sheet numbers

Plate px at s 1.0 are the runtime projection of the authored points (same `PROJ` the rig uses); pixel values come from the labelled r6 frames. Sources: `out/logs/r6-proj-final.log`, `r6-proj-s03.log`, `r6-g474-pixels.log`, `r6-far-door-luma.log`, `r6-switch-pop.log`.

| Frame (shot, f) | Sheet point or check | Runtime | Δ | Pixel check |
| --- | --- | --- | --- | --- |
| G186 (S01-SH02 f60) | band x 146–242 mean luma 0.15–0.28 | 0.2763 | — | trim band p05 0.2306 (base 0.2370); upper third 0.2972 at G180 (base 0.2878); free edge test x 242 ±15 passes |
| G222 (S01-SH02 f96) | L elbow (789, 1160) ±10 | (787, 1160) | 2 px | phone hand (762, 1028) → (759, 1028), 3 px (±15); r5 elbow (762, 1160); sleeve sliver visual only (C-Q3) |
| G300 (S02-SH01 f60) | elbow (818, 987) ±10; phone hand (770, 911) | (818, 987); (770, 911) | 0; 0 | visual only |
| G474 (S02-SH03 f30) | elbows (428, 830) / (652, 830) ±10 | (428, 830) / (652, 830) | 0 / 0 | sliver outward 16 px left, 17 px right (≥12; torso edges 424/652 from r5); forearm skin 53/78 px left (≥35), 28/78 px right (pale forearm, outside the skin class; visually about 70 px; Q2) |
| G474 | hands (444, 905) / (636, 905) ±15; elbow→hand ≈ 77 px | (444, 905) / (636, 905) | 0 / 0 | elbow→hand 77 px right |
| G850 (S02-SH06 f58) | L elbow (922, 1077) ±10; L hand (889, 934) ±15; R elbow (685, 1077) | same | 0; 0; 0 | at hand y 1.15 the L hand would be (889, 972) (C1) |
| G1722–G1725 (S03-SH02 f66–f69) | no sleeve pop; right upper arm stays behind | R elbow (422, 1275) → (419, 1279); L elbow (784, 1256) | — | consecutive mean abs RGB difference, right-arm box x 360–460 y 1200–1340: r6 1.28 / 1.39 / 1.02; r5 1.28 / 3.79 (f67→f68 switch) / 1.46 |
| G1764 (S03-SH02 f108) | R elbow (402, 1301) ±10; L elbow (784, 1256) ±10; L hand (723, 1187) ±15 | (403, 1301); (784, 1256); (723, 1187) | 1; 0; 0 | left forearm sleeve ≥30 px: visual only (Q3) |

### Lead height (camera unchanged; `scripts/world-fog/lead-check.ts`, no render)

- S02-SH03 G474: rig head top → counter far top 553 px (sheet 532; rig head top 381 vs sheet 397; counter far top 934 vs 929). ≥480 ✓.
- S01-SH02 G174 703 px, G188 792 px (unchanged).

### 1 s pass (88 frames: G0–G2580 step 30, plus G2609; production entry)

Outputs: `r6/1s/` (r6), `r6/baseline-1s/` (pre-change, this checkout), sheets `r6/pass-vs-baseline/sheet_1s_A.png` and `_B.png`, `r6/pass-vs-r5/sheet_1s_A.png` and `_B.png`.

- vs r5 (other worktree, `r5/1s`): identical 71, changed 17.
  - Intended: S01-SH02 G180 (door open; 51 dB); S02-SH01 G240, G270, G300, G330 (43–45 dB); S02-SH03 G450, G480, G510 (33–34 dB); S02-SH06 G840, G870 (43 dB); S03-SH02 G1680, G1710, G1740, G1770 (37–41 dB).
  - Noise: S03-SH07 G2100, G2130 and S04-SH01 G2160 (95–113 dB).
- vs pre-change baseline: identical 70, changed 18: the 14 intended tiles, plus noise tiles S03-SH01 G1650, S03-SH07 G2100, G2130 and S04-SH01 G2160.
- Pre-change baseline vs r5 (before any R6 edit): identical 82, changed 6 (S02-SH01 G240/270/300 at 107–111 dB; S03-SH01 G1650 111 dB; S03-SH07 G2100 109 dB, G2130 95 dB). The same noise class, so the r5 reference is reproducible.
- Noise check: two consecutive re-renders of the identical r6 code (`r6/determinism/a`, `b`) differ byte-wise on all four noise frames, 105–116 dB PSNR (DF-20261030-render-run-noise). These shots carry no changed code.
- Viewed: sheets A and B, and the labelled sheet. No visible discontinuity; the changed tiles are the door, shop, phone, occupant and torch-arm shots.

### Far-door (S01-SH02, G186 = f60)

- Band x 146–242, y 800–1190: mean 0.2763 (sheet 0.15–0.28 ✓, 0.004 under the ceiling). G180: base 0.2726 → r6 0.2760.
- Upper third (y 800–930): G180 base 0.2878 → r6 0.2972 (glaze +0.009).
- Trim band (y 1066–1086): p05 0.2370 (base) → 0.2306 (r6). The line is visible in `r6/far-door/far-door_base-G180_r6-G180_r6-G186_crop260.png`.

### Questions for Mark (sheets not edited)

- Q1: occupant L hand end height. Confirm y 1.20 (sheet, implemented) over the r5 y 1.15 (C1).
- Q2: S02-SH03 G474 "bare forearm ≥35 px". Pixel skin class gives 28/78 right and 53/78 left; the right forearm is a pale tone outside the class. Accept a visual read (about 70 px), or define the criterion for a pale tone?
- Q3: sleeve slivers at G222, G850 and G1764. Narrator and occupant sleeves share the background tone, so they cannot be pixel-checked here; needs a Film/Mark picture read.
- Q4: the fix list's expected change for S01-SH02 ("from f84"). The door-open changes start about f43 (trim, glaze) and the phone from f85; G210 is unchanged (C2). Correct the expectation list?
- Q5: G186 band mean 0.2763 is close to the 0.28 ceiling, and the glaze alpha is at its cap (77/255 ≈ 0.30). If more margin is wanted, a lower glaze alpha is a sheet decision.
- Q6: G222 hand target: sheet (762, 1028), runtime (759, 1028); both within ±15. Keep the sheet value or update to 759?

### Limitations and not done

- Studio seeking not run. Stills are per-frame `renderStill` calls (random access), not Studio playback.
- Pixel checks not possible for narrator and occupant sleeve slivers (G222, G850, G1764); visual only.
- Six existing two-point lines in `car.ts` remain undrawn (a look change to S01-SH02; DF-20261030-projectpoly-two-point-line).
- Long: none registered in this checkout.
- Not committed or pushed. Scratch measurement scripts live in the session scratchpad; their outputs are in `out/logs/r6-*.log`.

### Artifacts (`out/qa/world-fog/WFOG-EP01-SHORT/r6/`)

- `labelled/`: S01-SH02_G174, _G186, _G222; S02-SH01_G300; S02-SH03_G474; S02-SH06_G850; S03-SH02_G1722, _G1723, _G1724, _G1725, _G1764 (WFOG-QA, burned-in labels).
- `labelled-sheet_G174-G1764.png` (qa-sheet, 270 px tiles).
- `crops/S02-SH03_G474_crop540.png` and `crops/S03-SH02_G1764_crop540.png` (540 px wide, 1:1 from the labelled frames; boxes x 300–840 × y 700–1060 and y 1100–1460).
- `arm-crops/arm-crops_r5-left_r6-right.png` (1080 px, one row per changed shot: G222, G300, G474, G850, G1764, then the r5 and r6 G1723|G1724 pairs) and `arm-crops/arm-crops_r5-left_r6-right_w540.png`.
- `far-door/far-door_base-G180_r6-G180_r6-G186_crop260.png`.
- `1s/`, `baseline-1s/`, `pass-vs-baseline/`, `pass-vs-r5/`, `determinism/a/`, `determinism/b/`.
- Logs: `out/logs/r6-*.log`.

## 2026-10-30 — Boss: SS-R4 retime on the runtime build (WFOG-EP01-SHORT r7)

Scope: user authorization in chat 30 Oct ("Boss can update the build") for the index "SS-R4 retime list (Boss)" RT-1…RT-5 (`storyboards/world-fog/short/index.md`) with the S03-SH06, S03-SH06A, S03-SH07 and S04-SH01–SH03 blocks of `sc03.md` / `sc04.md` (SS-R4, uncommitted in this checkout) and script `WFOG-SCRIPT-R5`. Narration, TTS, captions, sound and the caption scrim (MK-WF-DEP-10) are not integrated (Editor). Worktree `claude/world-fog-next-steps-2817bc`: nothing committed or pushed.

### What changed (owner files)
- **T-1 composition** (`src/painted/worldfog/space.ts`): `TOTAL_FRAMES` 2610 → 3000 (last painted frame G2999, hard cut). `SHOT_ROWS` 23 rows: new `S03-SH06A` G2070 len 120; `S03-SH07` G2190/150; `S04-SH01` G2340/330; `S04-SH02` G2670/120; `S04-SH03` G2790/210. Composition length follows the scene durations (`src/Root.tsx`, `timelineFrames`); no separate duration edit.
- **T-2 clocks** (`space.ts`): ASM-PATH push G2286–G2339 (was G2106–G2159), held at (−0.10, 0.74) G2064–G2286; pull-back G2040–G2064 unchanged. FOG-STATE FS2→FS3 G2802–G2973. Torch on G1764–G2680. Door leaf open G2262–G2292, closed G2352–G2376.
- **T-3 lamps per lamp** (`space.ts` `lampAt`, RT-5): far pair (index 2, 3) out G2802–G2874; near-left (index 0) out G2862–G2940; near-right (index 1) to 0.35 over G2862–G2940, held to G2955, out G2955–G2973. `LAMPS` in `outside.ts` keep this index order.
- **P-1 S03-SH06A** (`src/painted/shots/worldfog.tsx`): `windowPlate('S03-SH06A', push(120, 1.24→1.28, fx 560, fy 650), {assembly: true, veil: false, beamTo: beamSH06A})`: the S03-SH03 lit window plate at LIT-LOWER, `S` (−0.10, 0.74), `light` 1, `A` 0, veil off (PD12). `beamSH06A`: glow centre (590, 700) held f0–f30, eased to (588, 820) at f66, held. The beam option defaults to the S03-SH03 sweep, so S03-SH03–SH06 are unchanged.
- **A-1/A-2 held look** (`src/painted/worldfog/assembly.ts`, `heldLook(G)`, zero outside G2070–G2189): shoulders rise 0.012 m per breath (period 20 frames, added to `dip`); head tilts forward 5° f54–f66 and holds (`H()` rotates hood and face about the neck y 1.17; identity without a bow); eyelids close f84–f88 (`blink`); pupils go down f48–f60 (`gazeDown`). `AsmPose` gains optional `bow`, `blink`, `gazeDown`; absent fields are the old values.
- **H-1 brow relax** (`src/painted/worldfog/head.ts`): `FaceState.browTo` + `browMix` (0..1) blend the brow table; without them `browY` returns the table entry exactly. Used by the S03-SH07 occupant.
- **P-2 S03-SH07**: picture push (150, 1.00→1.05). Held glance: narrator head left and brow up f6–f81 (turn back to the door f78–f84, switch at the midpoint), occupant looks at narrator f6–f84. Occupant nod f72–f84; occupant brows relax f24–f48; leaf slide f72–f102 (`doorAt`) with the occupant's left hand released at f104 (was f44); narrator exhale `rise` −0.012 m f30–f48; cart push f96–f149 through `asmAt`.
- **P-3 S04-SH01**: picture push (330). Worker talk windows = the four SS-R4 worker cues, f138–f180, f186–f228, f234–f282, f288–f330 (SS-R3.5 windows were f138–f186, f192–f240 and matched the cue windows of that revision). Glance f190–f214: eye look toward the door side and `nod` dx −0.12 head units (approximation; `DF-20261030-painted-profile-head-turn`).
- **P-4 S04-SH02**: no edit (offset only; torch off and door follow the G clocks). **S04-SH03**: window plate push (210).
- **Tools and labels**: `scripts/world-fog/stills.mjs` regex accepts the `A` suffix (the old pattern would have labelled S03-SH06A frames as S03-SH06); `pass-sheets.py` ROWS and the G0–G2999 range; `lead-check.ts` frames moved to the SS-R4 acceptance frames, S03-SH06A numbers and the S03-SH07 worker lead added; `src/painted/worldfog/qa.tsx` note r7; `src/videos/world-fog/index.ts` comment (G2999, 23 shots).
- **Tests** (`tests/world-fog.test.ts`): 3000 frames and 23 plates; hard cut G2790–G2999 (last frame shot-local f209); lamp, fog, torch and door clocks; ASM-PATH push; S03-SH06A held look (LIT-LOWER values, `warp` 0, `assemblyParts` = `assemblyRaw`, breath, bow, blink, gaze, outside-the-shot zeros); head bow moves only the hood and face (helmet, cartons and cart unchanged); SH06A sheet numbers; camera push lengths.

### Checks
- Environment (`out/logs/r7-npm-ls.log`, `r7-remotion-versions.log`): `npm ls --depth=0` clean; `remotion` 4.0.538. The HEAD typecheck failed before any edit with TS2688 on an empty `node_modules/@types/react 2` (no `index.d.ts`, no `package.json`); `rmdir` of that empty directory → typecheck exit 0 (`r7-typecheck-baseline2.log`). Logged in `DF-20261026-duplicate-types`.
- `npm run typecheck` exit 0 (`r7-typecheck-final.log`); `npm run lint` exit 0, no messages (`r7-lint.log`); `npm test` **125 of 125** (HEAD baseline 120 of 120; `r7-test-final.log`); world-fog file 27 of 27 (`r7-test-world-fog-1.log`).
- Lead check (`out/logs/r7-lead-check.log`, no render): diff against the r6 lead check (`r6-lead-check.log`) changes only the S04-SH01 rows (the push length moves them by 1 px) and the new and moved SS-R4 rows; all other rows are identical.

### Regression: frames before G2070 and the moved shots
- **Picture parity, chrome off** (labelled entry `WFOG-QA`, below the label band; HEAD and r7 rendered in the same session): G0–G2040 every 30 frames 68 of 69 identical (inf dB); S02-SH01 G270 106 dB (render-noise band). G2069 identical. S04-SH02 offset: HEAD G2400/2430/2460/2490 vs r7 G2670/2700/2730/2760 identical; HEAD G2470 vs r7 G2740 (RT-4, f70) identical.
- **Production 1 s pass by bytes** (`pass-sheets.py --prev r6/1s`, `out/logs/r7-pass-sheets.log`): identical 50, changed 21, new 30 (101 tiles). Changed: S02-SH01 G270/G300 (noise, 108–111 dB); S03-SH01 ×4, S03-SH02 ×4, S03-SH03 ×4, S03-SH04 ×2, S03-SH05 ×2, S03-SH06 ×1 (G1560–G2040). These are the progress-bar fill only: picture identical with chrome off; bar pixels G2040 144 px, bbox x 634–669, y 1851–1854. S04-SH01 G2340/G2370 changed (picture push 240 → 330 and the fog phase).
- **Why the bar changes**: `SceneRenderer`'s progress bar fills each scene segment by `(frame + 1) / duration`; S03 went 630 → 810 frames and S04 450 → 660. The HEAD control in the same session matches r6 within noise (113 dB at G1650), so the difference is the code, and the bisect (`head.ts`, `assembly.ts`, `shots/worldfog.tsx`, `index.ts` alone: noise-level) puts it in the scene durations. `DF-20261030-retime-picture-parity`.
- **Outside fog drift follows absolute G**: `outside.ts` `t = G / 30`. S04-SH01 f0 (HEAD G2160 vs r7 G2340) differs at 46.7 dB and S04-SH03 f0 (G2520 vs G2790) at 42.6 dB, over the window area (labelled pairs, below the label: bbox y 420–1219 for S04-SH01 and y 420–1325 for S04-SH03). The drift is continuous across the cuts (G2339/2340 and G2789/2790 are the same clock). Expected from the story clock; not a regression.

### Sheet numbers (labelled QA frames, chrome off; `lead-check.ts`, `qa-measure.py`, `caption-zone.py`)
- **SH06A G2100 (f30)**: worker 679 px (sheet 674 ±15); face (615, 709) (sheet 615, 705 ±15). **G2136 (f66)** beam centre (595, 865) (sheet 595, 861 ±20), from `beamSH06A` and the plate camera.
- **SH06A G2070–G2189**: `A` 0 and veil off by construction (`lensAt` is 0 from G1822; `windowPlate` veil false); `assemblyParts` equals `assemblyRaw` (no warp). No lens-on pixel render was made, so "cmp against the VD17-off render" is met by construction, not by a pixel comparison.
- **Head bow (f54–f66, 5°)** at s 1.0: face centre +0.38 px x, +0.25 px y (down); hood top −0.23 px (up). Below the visible threshold in this front view (Q3).
- **SH07 G2339**: worker lead 904 px (rig, profile; sheet ≥ 480 ✓). Face (eye, nose, mouth) clear of the jamb; the jamb covers the back of the hood (rig hood centre x 855, jamb 861–912). Acceptance met by eye on the crop.
- **SH07 G2320**: door jamb bar 51 px wide (x 861–912; sheet ≤ 40 px): **not met** (Q1). The same bar is 51 px at G2140 in r6 (`r6-lead-check.log`); the camera and jamb are unchanged.
- **S04-SH01 G2380 (f40)**: lead 923 px, narrator 925 px (sheet ≥ 480 ✓). Slumped worker G2396/G2440/G2470 (f56/f100/f130): head top 584 vs sheet ~573, lead 796–804 vs ~805: unchanged from r6 (584, 798–812).
- **S04-SH03 lamps (RT-5)** by eye on the crops (`lamp band` at G2802, G2874, G2940, G2973): all four halos at G2802; far pair gone by G2874; only the near-right ember at the upper right of the window at G2940 (sheet point (881, 224)); no lamp at G2973. Lamp luma in ±8 px boxes was dominated by the fog and is not used as evidence.
- **S04-SH03 end**: G2999 is the painted FS3 view with the empty walkway, hard cut; `plateAt(2999)` is shot-local f209 (test).
- **Caption zone** (`caption-zone.py`, default band 860–1248, raw background, no scrim): mean / p95 at G2100 0.414/0.663; G2136 0.440/0.693; G2189 0.443/0.693; G2230 0.382/0.714; G2380 0.326/0.591; G2420 0.322/0.583; G2538 0.337/0.598; G2802 0.361/0.505; G2940 0.391/0.549. All fail the 0.25 / 0.40 rule without the Editor scrim (MK-WF-DEP-10); not evaluated with a scrim.

### Sheets and artifacts (`out/qa/world-fog/WFOG-EP01-SHORT/r7/`)
- `sheet_A_S03-SH06-SH07.png` (13 labelled frames: G2040, G2069, G2070, G2100, G2136, G2189, G2190, G2230, G2262, G2270, G2292, G2320, G2339) and `sheet_B_S04.png` (17 labelled frames: G2340, G2380, G2420, G2538, G2554, G2669, G2670, G2740, G2790, G2802, G2862, G2874, G2940, G2955, G2964, G2973, G2999). Both viewed; labels burned in (`WFOG-QA`, BLOCKOUT note).
- `labelled/` (30 frames, `WFOG-QA`), `1s/` (101 production frames, `manifest.txt`), `sheet_1s_A.png` / `sheet_1s_B.png` (generated by `pass-sheets.py`; not viewed in full).
- Logs: `out/logs/r7-*.log`; parity table `out/logs/r7-picture-parity-0-2040.tsv` (chrome off); production PSNR table `out/logs/r7-parity-psnr-1s.tsv` (chrome on: the progress-bar row lowers the S03/S04 values; S04-SH02 at 54–59 dB is that bar, identical with chrome off).

### Questions for Mark (sheets not edited)
- **Q1 SH07 jamb bar** (G2320): 51 px at s 1.04 against the sheet's ≤ 40 px. The SS-R3.2 projection's 21 px (x 859–880) does not match this plate's geometry (lead-check: x 861–912). Options: accept 51 px, move the camera (sheet-owned, ST-02), or re-state the rule. Not changed here.
- **Q2 glance** (RT-3, f190–f214): the profile rig cannot turn the head away from the lens (`DF-20261030-painted-profile-head-turn`). Built as eye look plus a small backward nod. Accept, restage (head stays forward; the line carries the beat), or approve a back-of-head view as new painted rig work.
- **Q3 head bow** (RT-1, 5° f54–f66): sub-pixel in this front view (above). Accept as a held tilt that does not read, or ask Film for a view where it reads (profile or three-quarter).
- **Q4 torch "lowered on the threshold"** (RT-2): no value in the sheet. The narrator's torch hand is unchanged (1.05 m). Give the hand and beam numbers.
- **Q5 beam hold value**: the sheet calls (590, 700) "SH03 hold value", but the build's S03-SH03 end and S03-SH04–SH06 beam use (583, 689) (`BEAM_END`). S03-SH06A follows the RT-1 values; SH03–SH06 keep `BEAM_END` because frames before G2070 must not change. Confirm which value the sheet means.
- **Q6 occupant brow relax** uses a continuous blend (`browTo`/`browMix`, f24–f48), a new optional rig field. Confirm it is acceptable for the occupant.
- **Q7 talk windows** follow the R5 cue windows (estimates pending TTS, PD04). Editor re-times them; the mouth moves with the windows.

### For Film / Editor
- **Progress bar** (production chrome, `SceneRenderer`): S03 and S04 segments change with their durations; picture before G2070 is unchanged with chrome off. Decide whether the episode keeps the default bar (Editor; the `chrome` setting; not changed here).
- **Window fog phase**: `outside.ts` drift follows absolute G, so the S03-SH07, S04-SH01 and S04-SH03 window views show a different fog phase than HEAD at the same local frame, continuous in G.

### Limitations and not done
- Studio not run; stills are per-frame `renderStill` calls (random access), not Studio playback. Seek parity in Studio is unverified.
- Continuity checks at the boundaries (F−1/F/F+1) were done only by eye on the labelled frames: G2069/2070 (SH06→SH06A) and G2189/2190 (SH06A→SH07) in sheet A; G2339/2340 (SH07→S04-SH01) in the sheets; G2789 (S04-SH02 end) was not rendered. No every-frame continuity pass.
- The production PSNR table (`r7-parity-psnr-1s.tsv`, scratch script, mapped old tiles) mixes the chrome bar with real changes: S03-SH07 and S04 rows are content changes (14–59 dB, expected). The chrome-off parity above is the picture-parity evidence; the byte table is the production-level one.
- Caption and scrim checks not done (Editor). Sound, narration and TTS not touched.
- Long: none registered in this checkout.
- Not committed or pushed. Scratch scripts and the HEAD baseline copy live in the session scratchpad (outside the repository).

## 2026-10-30 — Boss: fix pass r8 (WFOG-EP01-SHORT r8, SS-R4.1 fix list)

Scope: index "SS-R4.1 fix list (Boss)" (`storyboards/world-fog/short/index.md`, anchor `ss-r41-fix-list-boss`): R8-1, R8-2, R8-3 (label only), R8-4, R8-5, R8-8; R8-6 and R8-7 accepted as built (no change). Every change is at G2070 or later (S03-SH06A, S03-SH07, S04-SH01). Narration, TTS, captions, scrim and sound not touched (Editor). Storyboards, `visual-brief.md` and `fact-check.md` not edited (Mark/Film/Boat working-tree changes preserved). Not committed or pushed.

### What changed (owner files)
- **R8-1 torch** (`src/painted/shots/worldfog.tsx`, `SH07_TORCH`, `s3sh07`): hand (1.05, 0.95, −0.60) at her right hip, lens (0.951, 0.839, −0.542) = hand + 0.16 m along the aim (measured 0.1596 m), pool target (0.20, 0, −0.10) on the floor before the threshold; narrator `rArm` to the hand; torch angle = `torchAngle(hand, lens)` (0.908 rad, was a static 0.95); overlay beam from the lens to the pool (was (0.9, 1.05, −0.3) → (0.6, 0, 0.05)).
- **R8-2 beam hold** (`beamSH06A`): f0–f30 at `BEAM_END` (583, 689), eased to (588, 820) at f66, held (was (590, 700)). SH03–SH06 `beamAt` untouched.
- **R8-3 lead-check wording** (`scripts/world-fog/lead-check.ts`): "sheet <= 40" replaced by the purpose rule (report width, no px limit). Camera and jamb geometry unchanged.
- **R8-4 nod** (`s4sh01`): worker `nod` dx 0 (was −0.12 × glance); the nod y term for the slump stays; the eyes-only look toward the door stays. DF entry updated.
- **R8-5 bow** (`src/painted/worldfog/assembly.ts`, `heldLook`): `bow` 0 for f0–f119 (was 5° ease f54–f66). The `AsmPose.bow` tilt helper stays (identity at 0; the test still exercises it with an explicit bow).
- **R8-8 pole** (`s3sh07`, `paintShop` option `omit: [27, 28]`, this shot only): the reading was the glass-front **top rail (shop.ts box 27)** and **sill (box 28)**, both x-parallel members spanning x −3…3 at z −0.06…0. Their image lines meet at (540, 700), the principal point, so they read as one dark pole through the frame. Checked and ruled out: umbrella (worker's left hand (1030, 1121) to tip (969, 1467) at the right edge, not the diagonal), torch body (≈171 px drawn, not 600 px), cart handle, beam (light polygon, `Beam` in `layers.tsx`). The sheet's allowed-darks list did not name the rail or sill.
- **Label** (`src/painted/worldfog/qa.tsx`): burned-in note now "Boss SS-R4.1 fix pass (r8)" (text only; picture unchanged).
- **Tests** (`tests/world-fog.test.ts`, 29 of 29 in the file): bow assertions → 0 across f0–f119; head-tilt helper test uses an explicit bow; new test G2136/G2189 hood and face equal the f30 points (≤ 1 px, same breath, gaze and blink); beam f0–f30 = (583, 689) and f66 = (588, 820); new SH07 torch test (lens 0.16 m, pool on the aim line, projection at s 1.00 and 1.05 within ±2 px).

### Checks
- `npm run typecheck` exit 0 (`out/logs/r8-typecheck.log`); `npm run lint` exit 0 (`r8-lint.log`); `npm test` **143 of 143** (`r8-test-final.log`); world-fog file **29 of 29** (`r8-test-world-fog.log`). The count differs from r7's 125 because this checkout is `claude/world-fog-ep01-script-dba9ff`, not the r7 checkout; not compared like-for-like.
- Lead check (`out/logs/r8-lead-check.log`, no render; run twice, stable).

### Regression: frames before G2070 (picture below the label band, chrome off)
- Baseline = r7 source, rendered before any source edit (`out/tmp/r8-ref-r7/`, `r8-baseline-stills.log`, 93 frames, `WFOG-QA`). r8 = `out/tmp/r8-new/` (`r8-render-labelled-stills.log`, same 93 frames).
- Full-frame `cmp` differs on every frame, including G0, because the label text changed (r7 → r8); full-frame PSNR is about 30 dB for that reason (`r8-parity-psnr.tsv`).
- **Picture band (y 300–1920), ffmpeg PSNR** (`r8-parity-crop-psnr.tsv`): G0–G2069 sampled every 30 frames plus G2069: 69 of 70 identical (inf dB); G270 110.6 dB (render-noise band, same as r7's G270 106 dB). G2069 identical.
- Changed frames, picture band: S03-SH06A G2070 49.2 dB, G2100 49.2, G2136 46.9, G2189 46.9; S03-SH07 G2190 27.1, G2230 27.1, G2262 27.0, G2270 26.8, G2292 26.4, G2310 26.3, G2320 25.5, G2330 26.1, G2339 26.9; S04-SH01 G2538 35.7, G2546 33.2.
- Identical (inf dB): S04-SH01 G2340, G2380, G2420, G2520, G2530, G2554; S04-SH02 G2669, G2670. Matches the expected-change list in the fix list.
- Production entry (`src/index.ts`, WFOG-EP01-SHORT, `r8-prod-stills.log`): G2070, G2320, G2538 picture band identical (inf) to the QA entry frames.
- S04-SH01 head crop G2520 vs G2538 (x 340–600, y 430–730): r7 21.4 dB, r8 28.0 dB (residual = eye look, allowed).

### Sheet numbers (labelled frames, chrome off; `lead-check.ts` and `caption-zone.py`)
- **G2070** beam glow at (583, 689) plate px at s 1 (was (590, 700)); image PSNR vs r7 49 dB.
- **G2100** worker 679 px (sheet 674 ± 15), face (615, 709) (sheet 615, 705 ± 15); beam screen (589, 699) (r7 ≈ (590, 700) before the bow/beam change).
- **G2136** beam centre (595, 865) screen (sheet 595, 861 ± 20), unchanged from r7; face and hood equal the f30 points (test, ≤ 1 px).
- **G2189** no bow: hood/face at the f30 positions ± 1 px (test).
- **G2230** (f40, s 1.008): torch hand (540, 1111) (sheet ± 15 of (540, 1107)–(540, 1127): inside), lens (584, 1168), pool (792, 1431) (sheet ± 25 of (790, 1425)–(802, 1461): inside).
- **G2320** (f130, s 1.048): hand (540, 1127), lens (586, 1186), pool (802, 1460). Jamb bar 51 px (x 861–912); rig head centre (hood) x 855, 6 px clear of the jamb's left edge (861). Native crop of r8 G2339: eye at x ≈ 810, nose ≈ 775, jamb covers the back of the hood only. Rail/sill lines meet at (540, 700).
- **G2339** (f149, s 1.050): hand (540, 1128), lens (586, 1187), pool (803, 1461). Worker profile lead 904 px (≥ 480). Narrator and other leads unchanged (no change to their geometry).
- **G2538** head crop residual vs G2520 (above). Head position by construction unchanged (nod dx 0).
- **Caption zone** (raw background, no scrim; band 860–1248; `caption-zone.py`, `out/logs/r8-caption-zone-r8.log` and `-r7.log`): G2100 mean 0.411 / p95 0.660 (r7 0.414 / 0.663); G2230 0.381 / 0.716 (0.382 / 0.714); G2320 0.401 / 0.713 (0.394 / 0.713); G2339 0.400 / 0.712 (0.403 / 0.710); G2538 0.337 / 0.598 (same). All fail 0.25 / 0.40 raw; the scrim is Editor's (MK-WF-DEP-10); not evaluated with a scrim.

### Artifacts (`out/qa/world-fog/WFOG-EP01-SHORT/r8/`)
- `sheet_A_S03-SH06A-SH07.png`: G2070, G2100, G2136, G2189 (S03-SH06A); G2190, G2230, G2262, G2320, G2339 (S03-SH07). Viewed.
- `sheet_B_S04-SH01.png`: G2538, G2546. Viewed.
- `compare/S03-SH07_G2320_G2339_r7-vs-r8.png`: r7 left, r8 right, G2320 and G2339. Viewed: rail and sill diagonals gone; torch low at the hip with its pool on the threshold floor; jamb unchanged.
- `labelled/`: 11 labelled `WFOG-QA` frames (every frame named above).

### Questions for Mark / Film (sheets not edited)
- **Q-R8-1 R8-8 source** (Mark, sc03 S03-SH07 acceptance): the pole was the glass-front rail and sill, not one of the sheet's listed darks. They are omitted in S03-SH07 only. Confirm that omission is acceptable, or say whether the sill edge is needed for the threshold read (the render shows the floor edge reads cleanly without it).
- **Q-R8-2 frame-bar wording** (Film VB-R5 / Mark R8-3): the vertical glass mullions (shop.ts boxes 20–22, 24–25) are still visible as thin dark verticals in S03-SH07. They are not diagonals and the R8-3 rule is about the jamb, but "the door jamb is the only frame bar" is not literally true of this frame. Film to confirm the intent (keep the mullions, or omit them too).
- **Q-R8-3 torch lens convention**: the drawn torch ends 0.13 m past the grip, plus the 0.03 m grip offset along the forearm, which lands close to the sheet's 0.16 m lens. Same convention as S03-SH02. No change made; Mark may want the sheet to state the grip offset.

### Limitations and not done
- Studio not run (no browser session); seek/scrub parity in Studio unverified. Renders are per-frame `renderStill` calls.
- No 1 s production pass against r7 (`pass-sheets.py --prev`); the chrome-off 93-frame pass above is the comparison instead.
- Continuity at boundaries (G2069/G2070, G2189/G2190, G2339/G2340) checked by eye on sheets only; no every-frame pass.
- Caption/scrim checks not done (Editor). Sound, narration and TTS not touched.
- `scripts/world-fog/delivery.md`, `research.md` and `short/script.md` show uncommitted changes that were not made in this pass (another role's work in this checkout); preserved and not read.

### r8b — S03-SH07 narrator glance, eyes only (R8-9; coordinator decision from the user's review of r8, chat 30 Oct)
- **Decision (user):** the r8 whole-head flip to screen-left while the torso faces the door reads as a twisted neck. Fix: eyes only. The narrator's head stays in profile toward the door for the whole shot (no flip or switch at any frame); pupils go back toward screen-left and the brow lifts f6–f78; eyes and brow return f78–f84. Occupant unchanged. Mullions kept (user). The R8-8 rail/sill omission stands. Mark records R8-9 and the R8-8 omission in the sheets (storyboards not edited here).
- **Change** (`src/painted/shots/worldfog.tsx`): `sh07NarratorGlance(f)` returns `head` 'right' (constant), `look` [lerp(1, −1, back), 0.2] and brow 'up' with `browTo` 'worry' and `browMix` 1 − back during f78–f84 (`back` = 1 from f6 to f78, eased to 0 over f78–f84). The brow return is eased with the eyes (the brief says eyes return f78–f84; a hard brow snap at f78 would pop). `s3sh07` uses it for the narrator; the r8 `glance` flag and head flip are gone. The occupant code is untouched.
- **Tests** (`tests/world-fog.test.ts`, 30 of 30 in the file): new test "S03-SH07 narrator glance is eyes only" (head 'right' at every f0–f149; pupils forward at f0, f5, f84+; back at f6, f40, f77, f78; monotone return f78–f84; brow up f6–f77; brow worry at f0, f5, f84+; `browMix` 0 at f78; no blend from f84).
- **Checks:** typecheck exit 0 (`out/logs/r8b-typecheck.log`); lint exit 0 (`r8b-lint.log`); world-fog file 30 of 30 (`r8b-test-world-fog.log`); `npm test` **144 of 144** (`r8b-test-final.log`).
- **Pupil travel (rig limit, measured):** the pupil sits at +0.05 head units right of the eye-white centre on a `right` head (`head.ts` `ell(0.67 + 0.03 * lx, ...)` against the white at 0.62). `look` −1 therefore brings the pupil to the white's centre, not to the screen-left side; the forward-to-back travel is about 9 px at 1080 px width (native crop `out/qa/world-fog/WFOG-EP01-SHORT/r8b/eyes_narrator_G2190-2230-2262-2280_x6.png`, ×6 nearest). The pupil reads as a glance back, not as a pupil on the screen-left side. A true screen-left pupil needs a shared head-rig change (all profile heads, consumer checks). Not made; recorded in DF-20261030-painted-profile-head-turn.
- **Frames changed vs r8** (`out/logs/r8b-vs-r8.tsv`, full frame, `cmp` then ffmpeg PSNR; `out/tmp/r8b-new/` vs `out/tmp/r8-new/`): G2196 23.8 dB, G2230 23.8, G2262 23.6, G2270 23.6. All other sampled frames are identical or in the render-noise band: G2380, G2538 and G2554 (S04-SH01, outside the glance window) are not byte-identical but measure 111 dB full frame (render noise, same class as r7's G270); no change was made to S04-SH01 in r8b.
- **Frames outside the changed range identical:** G0–G2189 (every 30 frames, G2069, G2070, G2100, G2136, G2189), G2190 (f0), G2274 (f84), G2280 (f90) against r8 renders (G2274/G2280/G2196 r8 references rendered from the r8 narrator lines, `out/tmp/r8-ref3/`, source restored byte-identical after; `r8b-render-r8-reference3.log`); G2292, G2310, G2320, G2330, G2339 (SH07 f102+); S04-SH01 G2340, G2420, G2520, G2530; S04-SH02 G2669, G2670. The changed range is G2196–G2270 (f6–f80) only.
- **Artifacts:** `out/qa/world-fog/WFOG-EP01-SHORT/r8b/sheet_C_S03-SH07-narrator-glance.png` (G2190, G2196, G2230, G2262, G2274, G2280; viewed: head in profile toward the door in all six; pupils back at G2196–G2262, forward at G2190, G2274 and G2280; brow lifted at G2196 and G2230); `.../r8b/eyes_narrator_G2190-2230-2262-2280_x6.png` (native crops, ×6); `.../r8b/labelled/` (the six labelled frames).
- **Logs:** `out/logs/r8b-*.log`, `r8b-vs-r8.tsv`.
- **Limitations:** Studio not run; no 1 s production pass; the r8b QA frames are the `WFOG-QA` chrome-off entry, and the production-entry picture check from r8 still stands for the r8 changes (not re-run for r8b). No commit.

### Coordinator decisions on r8/r8b (30 Oct 2026, user via structured questions)
- R8-9 eyes-only glance accepted as built: the pupil reaches only the eye-white centre (~9 px travel, profile head-rig limit); no shared head-rig change. Mullions in S03-SH07 kept. Editor authorized next: TTS → retime → captions/scrim/sound.

## 2026-10-30 — Editor r1: TTS, retime, captions and scrim, sound (WFOG-EP01-SHORT, uncommitted)

Scope: coordinator authorization in chat 30 Oct ("Editor: TTS → retime → captions/scrim/sound") on SS-R4.1 / r8b (`src/painted/worldfog/*`, `shots/worldfog.tsx` talk windows). Files: `scripts/world-fog/narration.py` (new: verify, tts, measure, compose, captions), `scripts/world-fog/short/narration-lines.json` (16 lines, startG, planned windows, gains), `scripts/world-fog/short/captions.json` (39 cues, scene-local timeline), `scripts/world-fog/short/WFOG-EP01-SHORT.amplitude.json` (3000 frames), `src/videos/world-fog/index.ts` (narration, captions, scrim, audio, SFX), `src/painted/shots/worldfog.tsx` (7 talk-window arrays only), `public/narration|sfx|audio|scrim/` (ignored MP3; WAV copies with NOTICE entries). Storyboards, script and brief not edited. Nothing committed or pushed.

### 1. Verbatim and timing (TTS → measured)
- `narration.py verify`: 16/16 lines equal a `script.md` blockquote; caption pieces join back to each line.
- Voices (voice-tuning skill): narrator `woman-base` = Premwadee +5%; delivery worker `man-base` = Niwat +5%; shop worker `woman-younger` (adult preset, distinct female); occupant `elder-woman` (WORLD elderly, −20% preset; `out/voice-venv` installed). **User listening not done** (voice-tuning step 6: clips in `out/editor/world-fog/WFOG-EP01-SHORT/lines/`).
- Per-line gains (EP08a, baked into the narration file; runtime has no per-scene narration gain): VO-01 1.12 (hook), whispers VO-06/07/08/09 and VO-13 0.7, VO-16 0.75, shop worker VO-04 0.8, VO-10 0.85 with `lowpass=3800` (through glass), others 1.0.
- Measured speech (frames at 30 fps) against the sheet's planned span (first cue to last cue end):

| ID | Speaker | Planned span | Measured speech | New startG → speech end | Shot(s) |
| --- | --- | --- | --- | --- | --- |
| VO-01 | narrator | 0–40 | 29 | 0 → 29 | S01-SH01 |
| VO-02 | narrator | 48–234 | 107 | 83 → 190 | S01-SH01/SH02 |
| VO-03 | narrator | 246–444 | 115 | 293 → 408 | S02-SH01/SH02 |
| VO-04 | shop worker | 468–510 | 26 | 468 → 494 | S02-SH03 |
| VO-05 | narrator | 570–774 | 155 | 583 → 738 | S02-SH04/SH05 |
| VO-06 | narrator | 810–870 | 47 | 810 → 857 | S02-SH06 |
| VO-07 | occupant | 1047–1077 | 31 | 1047 → 1078 | S02-SH08 |
| VO-08 | narrator | 1095–1185 | 57 | 1101 → 1158 | S02-SH08 |
| VO-09 | narrator | 1446–1500 | 33 | 1446 → 1479 | S02-SH10 |
| VO-10 | worker (off screen) | 1530–1650 | 89 | 1544 → 1633 | S03-SH01 |
| VO-11 | narrator | 1680–1734 | 43 | 1680 → 1723 | S03-SH02 |
| VO-12 | narrator | 1830–2034 | 143 | 1866 → 2009 | S03-SH03/SH04/SH05 |
| VO-13 | narrator (mouth closed) | 2082–2262 | 176 | 2089 → 2265 | S03-SH06A/SH07 |
| VO-14 | narrator | 2358–2454 | 90 | 2357 → 2447 | S04-SH01 |
| VO-15 | worker | 2478–2670 | 208 | 2462 → 2670 | S04-SH01 |
| VO-16 | narrator (mouth closed) | 2796–2949 | 161 | 2790 → 2951 | S04-SH03 |

- Estimate vs measured: most planned spans were 1.3–2.0× the measured speech; the sheets' cue windows were generous, not tight.
- Method: one clip per speaker turn (no splitting inside a sentence). Piece boundaries inside one continuous clip are proportional to Thai characters; where the clip has the same number of silent runs (≥0.12 s) as caption pieces, the measured runs are used (VO-10, VO-14, VO-15). Start frames were chosen to keep each caption piece inside its planned shot (objective: no piece crosses its shot end; nearest planned piece starts; 6-frame tolerance).

### 2. Retime proposal (Mark) — no shot boundary or length changed
- Composition stays 3000 frames = 100.00 s (no total change). **Frames before G2070 keep their picture timing;** shot boundaries unchanged.
- **One overrun to decide:** VO-12 (speech 143 f) cannot fit its five planned pieces into SH03 (1830–1920), SH04 helmet insert (1920–1962) and SH05 (1962–2034) without a pause at each insert cut (the TTS has no pause there; splitting a sentence is not allowed). Chosen start 1866: caption `กำลังประคองกล่องบนรถเข็น` ends 2 f past the cut at 1920; `ที่เคาะกระจกเมื่อกี้…` ends 3 f past 1962. **Proposal A (recommended, no picture change):** accept the 2–3 f caption overlap. Proposal B (not recommended): Mark lengthens S03-SH04 by 4 f; this moves every frame from G1962 on, including G1962–G2069, so it breaks the G2070 rule.
- **Sync shift for Mark:** VO-12's first cue `คนส่งของ…` moves from 1830 to 1866 (+36 f). The sheet said the words name what the light has just shown; the cue now lags the light by about 1.2 s. Accept, or Mark chooses a different planned shot for the cue.
- VO-16 ends 2951, so the held silence to G2999 is 48 f (1.6 s), within the script's 1.5–2 s (open item 6 satisfied; S04-SH03 not extended).
- Picture change before G2070 from Editor: only the talk windows below (mouth open/closed; no camera, pose or timing). Scrim pixels before G2070 change on caption spans (interim MK-WF-DEP-10, see 4).

### 3. Talk windows (Boss-owned `shots/worldfog.tsx`, changed as Editor's timed cues per index R8-7; Boss to review)
- S02-SH03 shop worker `[24,50)` (was `[24,66)`); S02-SH08 occupant `[18,49)` (was `[18,48)`), narrator `[72,91) [95,129)` (was `[66,96) [102,156)`); S02-SH06 narrator `[18,65)` (was `[18,78)`); S02-SH10 narrator `[36,69)` (was `[36,90)`); S04-SH01 worker `[122,190) [199,216) [225,269) [282,330)` (was `[138,180) [186,228) [234,282) [288,330)`), narrator `[17,62) [73,107)` (was `[18,66) [72,114)`). VO lines (narrator VO in S01, S02-SH01/SH04/SH05, S03-SH02/SH03/SH06A/SH07, S04-SH03; worker in S03-SH01 off screen) keep closed mouths per the sheets.

### 4. Captions and scrim (MK-WF-DEP-08, MK-WF-DEP-10)
- Captions: `video.captionStyle {preset: 'outline', position: 'middle'}` (production-requirements vertical caption rule for new portrait deliverables; the outline look is the profile's). 39 cues, verbatim, from `captions.json`; blank cues between lines. `caption-breaks.mjs` on the derived timeline: 0 BREAK-MID-WORD, 0 MORE-THAN-2-LINES, 1 MAY-WRAP (`แล้วความกลัว ก็ชวนให้ฉันมองว่ามันเป็นอันตราย`, cue 2190–2265): frame checked (G2262), wrap falls between two whole words (`เป็น | อันตราย`), no word split; no authored `\n`.
- **MK-WF-DEP-08 not met as written:** the sheet asks for the block bottom near y 1240 (band 1000–1248); `middle` centres the block at y 960 (≈ 876–1044). Boss/Film to decide; I followed the channel rule.
- **Scrim (interim MK-WF-DEP-10):** `public/scrim/WFOG-caption-scrim-960x230.png` (RGB 16,16,24, 62 % core alpha, 40 px feather, box x 60–1020, y 840–1070) as one `scene.media` image clip per caption span (front layer). Not a shared renderer change; Boss's reusable scrim remains open.
- caption-zone.py results (0.25 mean / 0.40 p95, `scripts/caption-zone.py`, band default 860:1248; block band 840:1070 for the scrim rows). Frames: 44 (mid-cue frame of each of the 39 cues + G60, G420, G1275, G2262, G2600), `out/qa/world-fog/WFOG-EP01-SHORT/editor-r1/`.

| Frames | Pass default band | Pass block 840–1070 | Mean range | p95 range |
| --- | --- | --- | --- | --- |
| Production, captions on, no scrim (`raw/`) | 0 / 44 | — | 0.27–0.52 | 0.40–0.82 (includes glyphs) |
| Production, captions on, scrim 62 % (`scrim/`) | 1 / 44 | 6 / 44 | — | (glyph-contaminated; not the rule) |
| Background only, captions off, scrim 62 % (`bg-scrim/`) | 1 / 44 | 6 / 44 | 0.19–0.40 | 0.31–0.79 |
| Background only, scrim 80 % (test, not used; `bg-scrim80/`) | 4 / 44 | 8 / 44 | 0.17–0.36 | 0.37–0.81 |

- Reading: captions alone add glyph pixels to the band, so the background-only rows are the rule's measure. The picture itself is bright behind the caption block in most frames (fog lamps, shelves, windows, the torch beam), so a block-only plate does not reach p95 ≤ 0.40. Passing the full band would need a grade on the picture outside the block, which the sheet forbids. **Not met. Decision needed (user / Film / Boss):** (a) accept block-level measurement for this deliverable and record the exception; (b) widen the plate (grade on the picture); (c) Film lowers highlights in the caption zone (VD09/VD18 look rows).
- Legibility: viewed `sheet_caps_A.png` and `sheet_caps_B.png` (16 production frames, 270 px): all captions readable, inside the block, no caption crosses a face or the torch hand in the sampled frames; S02-SH04 and S04-SH01 captions over the picture read clearly.

### 5. Sound (library-first; 11 generated, 5 existing)
- Existing library IDs used: `tension_drone-sparse-piano_01` (music, loop), `bed_dark-drone-sub_01` (ambience bed, loop), `reveal_riser-tension_01`, `ui_notification-ding_01`, `ui_pop_01`.
- Generated (audio-studio, 3 candidates each, picked by measured peak/onset/tail; filed with `sound-library.py file`, index 0 mismatches): `vehicle_car-engine-decel-stop_01` (v1), `foley_car-door-open-close_01` (v3, latch onset 0.77 s), `foley_footsteps-wet-concrete_01` (v3), `foley_cart-wheel-squeak-scrape_01` (v2), `foley_umbrella-tap-glass_01` (v2), `foley_carton-slide-helmet-catch_01` (v2), `foley_flashlight-click_01` (v1), `foley_glass-door-push_01` (v2), `room_shop-fridge-hum_01` (v2, loop 1 s crossfade, −14 LUFS), `outdoor_fog-forecourt-hush_01` (v2, −14 LUFS), `tone_soft-sustain-reflective_01` (v1, −14 LUFS, 400 ms fade). Candidate choice is a measured pick, not an audio approval (`listened: no`).
- Mix plan (EP08a, `video.audio[]`): bed S01–S02-B02 0.16 then 0.22 to G988; silence G988–G1047 (tap-3 drop); very low re-entry 0.10 (S02-SH08–SH09); none in S02-SH10 and S03-SH01; quiet release 0.10 G1830–G2070; tone 0.12 G2070–G2274 under the perception line; thinned release 0.05 to G2340; forecourt hush 0.22 (G156–G240); shop hum 0.14 G240 to the hard cut (duck 0.6); sub bed 0.10 G2790–G2961 (fade out f159–171 of S04-SH03). Duck under narration 0.35 (beds) to 0.5–0.6 (sub, hum).
- SFX (`scene.sfx[]`, cue frame = sheet event frame minus measured onset): engine G0; door latch G145 (open at G168); steps G209; phone ding G360 and press G376; squeak G521 (S02-SH03), move windows G540…720 every 30 f (per sheet's `f0, f30, f60 …`, not otherwise confirmed); S02-SH05 G750, G780; S02-SH06 G810/840/870; S02-SH07 scrape G900, three taps G950/968/986 (umbrella file); riser G1164–1275 (`ends dead at G1275`); helmet slide G1253 (catch at G1275); torch click G1761 (f108 exact); S03-SH06 scrape G2040; S03-SH07 door slide G2258, scrape G2286; S04-SH01 door close G2348; S04-SH02 torch click G2677.
- Measured (ffmpeg ebur128): narration MP3 −17.2 LUFS integrated, −1.6 dBFS true peak (render.mjs normalizes the MP4 to −14 LUFS afterwards); drone bed (normalized) −14.0 LUFS; the mix levels are as set above.
- **Not done / gaps:** human exertion breath (S02-SH02/SH04/SH06/SH08/SH09/SH10, S03-SH01/SH03/SH07, S04-SH01) — no library source; Stable Audio is instrumental; not generated (needs a recorded or licensed breath source). The release drone keeps its piano layer (no stem separation; sheet asks for the family's drone without piano). Outside muffling through the glass is approximated by the shop hum only. S02-SH09 brush at f100 and seat knock at f117 not placed. Car-door close thud (f80) not separately placed (one file, latch at G145).

### 6. Checks run (logs in out/logs/editor-*.log)
- `npm run typecheck` exit 0 (`editor-typecheck-final.log`); `npm run lint` exit 0 (`editor-lint-final.log`); `npm test` 144/144 (`editor-test-final.log`). Verify: 16/16 verbatim.
- Stills: `node scripts/world-fog/stills.mjs --out=<dir> --frames=<list> --gl=angle` (44 frames in 80–90 s). **Finding:** `scripts/render.mjs --stills` (no `--gl`) fails on this composition at G304 with a 28 s `delayRender` timeout on `Html5Audio` (tension drone and shop hum); the same frame renders with `--gl=angle` in 3.4 s. Recorded as a dev finding candidate. The 16-bit conversion of the two beds did not fix it.
- Not run: full MP4 render (audio mix and motion not verified in an export), Studio playback, random/backward seek, every-frame continuity, user listening (voice clips, SFX candidates, mix).

### 7. Samples and reproduction (ignored `out/`)
- Scene samples (one per story scene, production frames with captions and scrim, native 1080×1920): `out/samples/world-fog/WFOG-EP01-SHORT/editor-r1/` (`S01-SH01_G60_hook-marker.png`, `S02-SH09_G1275_catch.png`, `S03-SH07_G2262_door-perception.png`, `S04-SH01_G2600_worker-line.png`, `manifest.json`). Integration samples only, not approval.
- Reproduce: `python3 -I scripts/world-fog/narration.py tts|measure|compose|captions` (voices need `out/voice-venv` for `elder-woman`); `node scripts/caption-breaks.mjs out/editor/world-fog/WFOG-EP01-SHORT/timing/caption-timeline.json`; `node scripts/world-fog/stills.mjs --out=… --frames=$(cat out/editor/world-fog/WFOG-EP01-SHORT/timing/raw-frames.txt) --gl=angle`; `--entry=src/painted/worldfog/qa.tsx --id=WFOG-QA` for captions-off backgrounds; `python3 -I scripts/caption-zone.py [--band 840:1070] <frames>`.

### 8. Open items for coordinator / owners
- User: listen to the four new voice clips (shop worker, occupant, worker, narrator) and the sound candidates; decide the caption-zone exception (section 4); confirm VO-12 acceptance (section 2); authorize a full MP4 render if wanted (about 30–60 min).
- Mark: VO-12 proposal A and the +36 f sync shift; SS-R4 talk windows now measured (section 3); S02-SH04 move-window squeak pattern (f0…f180, every 30 f) is the sheet's wording, not a timed event.
- Boss: MK-WF-DEP-08 (placement; `middle` now), MK-WF-DEP-10 (reusable scrim; interim plate here), EP08a per-scene narration gain (missing; levels baked into the MP3), review of talk-window edits in `worldfog.tsx`, `render.mjs --stills` GL default (finding above).
- Film: caption-zone highlights (VD09/VD18), breath source for the exertion breath cues.
- Housekeeping: while debugging the still renders, `public/audio/tension/tension_drone-sparse-piano_01.wav` and `public/audio/room/room_shop-fridge-hum_01.wav` were re-encoded from 24-bit to 16-bit PCM (same rate and channels, no gain change). The library originals are unchanged. The bit-depth change did not fix the render error (section 6); keep or revert before export.

## 2026-10-30 — Editor r2: caption block to y 1240 (MK-WF-DEP-08), VO-12 accepted, voices approved, full MP4 render

Scope: coordinator decisions in chat 30 Oct (structured questions): (1) captions move down per MK-WF-DEP-08 (block bottom near y 1240, not `middle`), scrim moved with it, caption-zone re-measured on the same 44 frames in the new block band, per-frame exception only for remaining failures; (2) VO-12 Proposal A accepted; (3) voices VO-04 and VO-07 approved by the user (below); (4) full MP4 render authorized after the caption checks passed. No commit.

### Voices (voice-tuning step 6 done)
- User listened to and approved in chat (30 Oct, via the coordinator): VO-04 shop worker `woman-younger` and VO-07 occupant `elder-woman`. Narrator (`woman-base`) and worker (`man-base`) were not separately approved; the coordinator decided the voice defaults (2026-10-29). No voice change in r2.

### VO-12 (Proposal A, accepted by user)
- Accepted: VO-12 caption `กำลังประคองกล่องบนรถเข็น` ends 2 f past the cut at G1920; `ที่เคาะกระจกเมื่อกี้…` ends 3 f past the cut at G1962. No picture change at these cuts (shots unchanged).
- Accepted: VO-12 first cue `คนส่งของ…` starts G1866 (sheet 1830, +36 f), so it lags the torch light by about 1.2 s. No shot or picture change.

### Caption block to y 1240 (shared-module change, for Boss review)
- New `captionStyle.position: 'lower'`: block bottom edge at y 1240 of 1920 (`bottom = height × (1 − 1240/1920)`, 680 px at 1080×1920). Files: `src/scenes/types.ts` (union), `src/scenes/media.ts` (`captionPositions`, validator message), `src/scenes/Subtitles.tsx` (placement). Existing `bottom`, `middle`, `top` unchanged; `tests/media.test.ts` gained a `lower` accept and an invalid-position assertion (144/144 still).
- Episode: `src/videos/world-fog/index.ts` uses `captionStyle: {preset: 'outline', position: 'lower'}`.
- Scrim moved with the block: `public/scrim/WFOG-caption-scrim-960x260.png` (replaces 960×230), box x 60–1020, y 1020–1280, 62 % core alpha, 40 px feather. The 230-px file was removed. Caption spans and cues unchanged; caption-breaks unchanged (cue text unchanged).

### Caption-zone re-measure (same 44 frames; sheet caption band 1000:1248)
- Frames: `out/qa/world-fog/WFOG-EP01-SHORT/editor-r2/bg-lower/` (background: captions off, scrim on, `WFOG-QA` entry) and `scrim-lower/` (production, captions on and scrim on). Measured: `out/logs/editor-caption-zone-r2-bg-1000.json` (rule measure), `…-scrim-1000.json` (captions on, reference only: glyphs contaminate the band), `…-bg-860.json` (default band, reference).
- Result on background frames, band 1000:1248: **14 of 44 pass**; 30 fail (table below). Default band 860:1248: 1 of 44 pass.
- Reading: the picture itself is bright behind the block in these frames (fog lamps, shelves, windows, the torch beam). The scrim lowers the mean but not the p95 highlights. Per coordinator decision, the remaining failures are recorded as per-frame exceptions (not fixed by grading the picture).

Per-frame exceptions (background band 1000:1248, mean/p95; must be ≤ 0.25 / ≤ 0.40):

| Frame | mean/p95 |
| --- | --- |
| S01-SH01_G14 | 0.18/0.43 |
| S01-SH01_G60 | 0.28/0.49 |
| S01-SH01_G104 | 0.19/0.44 |
| S01-SH02_G148 | 0.23/0.41 |
| S02-SH01_G304 | 0.24/0.56 |
| S02-SH01_G335 | 0.25/0.58 |
| S02-SH02_G420 | 0.32/0.75 |
| S02-SH06_G833 | 0.32/0.69 |
| S02-SH09_G1275 | 0.27/0.38 |
| S02-SH10_G1462 | 0.24/0.56 |
| S03-SH01_G1616 | 0.19/0.42 |
| S03-SH02_G1701 | 0.31/0.71 |
| S03-SH03_G1873 | 0.25/0.53 |
| S03-SH03_G1901 | 0.25/0.54 |
| S03-SH04_G1940 | 0.31/0.58 |
| S03-SH05_G1976 | 0.25/0.43 |
| S03-SH05_G2001 | 0.25/0.43 |
| S03-SH06A_G2113 | 0.24/0.52 |
| S03-SH06A_G2163 | 0.26/0.54 |
| S03-SH07_G2227 | 0.21/0.44 |
| S03-SH07_G2262 | 0.21/0.43 |
| S04-SH01_G2379 | 0.20/0.53 |
| S04-SH01_G2430 | 0.20/0.46 |
| S04-SH01_G2496 | 0.20/0.51 |
| S04-SH01_G2547 | 0.20/0.48 |
| S04-SH01_G2587 | 0.20/0.45 |
| S04-SH01_G2600 | 0.20/0.45 |
| S04-SH01_G2646 | 0.20/0.44 |
| S04-SH03_G2889 | 0.23/0.41 |
| S04-SH03_G2931 | 0.24/0.43 |

### Face and clue check on the labelled caption frames
- `out/qa/world-fog/WFOG-EP01-SHORT/editor-r2/labelled-caption/` (44 production frames, captions and scrim on, labelled `G#### shot`). Sheets viewed: `sheet_caps_r2_A.png` (G14–G1581) and `sheet_caps_r2_B.png` (G1616–G2931).
- No caption covers a face in the 44 frames (narrator, occupant, shop worker, worker): all faces sit above the block; captions cover torsos, cartons, legs and counter.
- **Finding (Mark/Film):** the lowered torch hand and lens of S03-SH07 (sheet R8-1: hand near (540, 1107), lens near (584, 1168)) sit behind the caption VO-13-3 `แล้วความกลัว ก็ชวนให้ฉันมองว่ามันเป็นอันตราย` (G2190–2265, shot-local f0–f75). The sheet calls the hand "not a clue"; crop `out/qa/world-fog/WFOG-EP01-SHORT/editor-r2/crop_S03-SH07_G2227_torch_view.png` shows the hand under the text. Not changed in r2; Mark to accept or re-stage.
- caption-breaks: unchanged (cue text unchanged); the MAY-WRAP cue `แล้วความกลัว ก็ชวนให้ฉันมองว่ามันเป็นอันตราย` wraps between two whole words (`เป็น | อันตราย`) at the lower position too (sheet A/B).

### Checks (logs in out/logs/)
- `npm run typecheck` 0 (`editor-typecheck-r2.log`); `npm run lint` 0 (`editor-lint-r2.log`); `npm test` 144/144 (`editor-test-r2.log`).

### Full MP4 render (authorized; --gl=angle)
- Command: `npx remotion render src/index.ts WFOG-EP01-SHORT out/WFOG-EP01-SHORT/WFOG-EP01-SHORT_C_seamless.mp4 --gl=angle --codec=h264 --crf=18 --pixel-format=yuv420p --concurrency=4 --overwrite` (run in the background; log `out/logs/editor-r2-render.log`). `scripts/render.mjs` has no `--gl` option, so the CLI was used; the composition's defaultProps carry `ending: C_seamless` and `loopBlendFrames: 0`.
- Results: see the "Render result" entry below (filled when the render exits).

### Render result (Editor r2, 30 Oct 2026)
- Output: `out/WFOG-EP01-SHORT/WFOG-EP01-SHORT_C_seamless.mp4` (per-ID path; same file copied to `out/WFOG-EP01-SHORT/WFOG-EP01-SHORT.mp4`); log `out/logs/editor-r2-render.log` (render exit 0, 3000/3000 encoded). Loudness step log `out/logs/editor-r2-loudness.log`.
- Streams: H.264 1080×1920, 30 fps, 3000 video frames = 100.000 s; AAC 48 kHz stereo, trimmed by the project loudness step to 99.993 s (container 100.000 s). 55.1 MB before normalisation.
- Loudness (scripts/loudness.mjs, the render.mjs step): as rendered −18.1 LUFS integrated, true peak −3.5 dBTP, LRA 10.8 LU; after the project step **−14.1 LUFS integrated, −1.4 dBTP**, LRA 10.3 LU (dynamic loudnorm). Meets the project default (≈ −14 LUFS, ≤ −1 dBTP).
- Frames: 30 frames extracted from the final MP4 (`out/qa/world-fog/WFOG-EP01-SHORT/editor-r2/mp4-frames/`), labelled copies in `mp4-frames-labelled/`, sheets `sheet_mp4_frames_A.png` (G0–G1530) and `sheet_mp4_frames_B.png` (G1869–G2999); both viewed. Scene samples G60 (S01), G1275 (S02), G2262 (S03), G2600 (S04); cut frames G126, G240, G354, G540, G738, G1530, G2070, G2190, G2340, G2670, G2790; hold and hard-cut G2998/G2999 (no fade, no caption).
- Not checked in this pass: motion and seek (Studio), every-frame continuity, and listening by a person to the final mix (levels are from measurements, not by ear).

## 2026-10-30 — Boss r9: SS-R5 fog swallow (WFOG-EP01-SHORT, VB R6.1, SS-R5 Boss list B5-1…B5-10)

Scope: coordinator authorization for B5-1…B5-10 (index `ss-r5-boss-list`); user decisions FP-A + FP-B, S01-SH02A at low detail, S02-SH02 135 f, no duration cap. Narration not retimed (Gemini pending). Read: index SS-R5 list and sheet blocks (sc01 S01-SH02/S01-SH02A, sc02-b01 S02-SH00A/S02-SH01/S02-SH02), brief R6.1 VD06/VD08/VD09/VD19/VD20/SP05/SP06, `fog-proposals.md` (FP-A/FP-B), `boss-asset-workflow.md`, `painted-2d` skill, `remotion-toolkit.md` §1 preflight (`npm ls --depth=0`: all pinned; `npx remotion versions`: consistent; `out/logs/b5-npm-ls.log`, `b5-remotion-versions.log`), `sequence-workflow.md`, scale guide §3 (one projector owner; no double scaling). Scene sheets, brief, index and fact-check were not edited (uncommitted Film/Mark docs kept).

### What changed (owner files)
- **B5-1 shot list** (`src/painted/worldfog/space.ts`): `SHOT_ROWS` 25 rows (S01-SH02A g0 240/120 f, S02-SH00A 360/150 f, S02-SH01 510/96 f, S02-SH02 606/135 f, S02-SH03 741 … S04-SH03 3087); `TOTAL_FRAMES` 3297; `CAM-GLASS-SWALLOW` (−0.3, 1.75, −2.0; f 850; y_h 595) and `CAM-HIGH-WIDE` (−3.5, 20, −20; f 900; y_h 330) in `SETUPS`.
- **B5-2 story key (RK-1)**: `storyG(G)` = G − 297 from G741, identity below; `storyAt(id, f)` for SHOT_G0 reads. Plates read clocks at `storyG`; `fogAt`, `lampAt`, `asmAt`, `t = G/30` drifts and `riseAt` therefore see the SS-R4.1 values for S02-SH03 onward. Check: the picture band (y 300–1920) of 13 old/new pairs is identical (`out/logs/b5-parity-psnr.tsv`, PSNR inf); the full frames differ only in the burned-in label.
- **B5-3 `fogAt`**: 0 before G360; G360–G494 = 2·(14 − F)/12.2 from `frontAt` (14.0 held to G390, 1.8 from G494); 2 to G2802. `fogAt(239)` 0, `fogAt(494)` 2, `fogAt(600)` 2.
- **B5-4 `paintOutside` `front`** (`outside.ts`, MK-WF-DEP-11): `vis(z)` keeps a layer nearer than F; `zc(z)` clips ground planes at F; `clear` 1 and veil 0 with `front`; high banks and the forecourt low bank off; walkway, puddle and lamp-reflection washes gated by z. `paintFront`: 4 m bank (15 m for F ≥ 60) with crest, two lower banks and tendrils 0.5–1.5 m nearer the glass. `sedan: true` paints the parked car's side profile (`paintSedanBody`) gated at its near flank (z 4.2). Without `front` the call order is unchanged (the parity pairs above are the proof).
- **B5-5 S01-SH02** (`forecourtPlate`): `front: 60`, forecourt low bank dropped; staging, car, door, narrator and timing unchanged. Assembly not drawn (no cart in the plate).
- **B5-6 S02-SH00A** (`swallowPlate`): `paintShop` on CAM-GLASS-SWALLOW; narrator `view: 'left'` (profile facing screen-left) at (0.5, 0, −0.45), phone at her near side (dark), mouth closed, eyes on the car to f88 then to the kerb (f88–f134), blink f140–f143; `frontAt(G)`; `sedan: true`; push 1.00 → 1.03 about (560, 640) over [0, 150); no assembly (VD17 0). VD18 row `CAM-GLASS-SWALLOW` (key [0.2, 1], rim [0.3, 1]); AIR entry for the interior air.
- **B5-7 S01-SH02A** (`sitePlate`, new `src/painted/worldfog/site.ts`, MK-WF-DEP-12): `paintSite` on CAM-HIGH-WIDE at low detail: night backdrop, far fields and five tree clumps, main road with dashes, access lane, fog body above the ground line of zF(x) = 14 + B·smoothstep(2.5, 20, |x|) (B 46 → 0 at f114), crest and two lower banks, then the forecourt slab, pool, kerb, canopy roof, pumps, parked car and the shop box last. Push 1.00 → 1.03 about (600, 900) over [0, 120). No figure, no glow layer (warm washes ≤ 0.3 by alpha).
- **B5-8 S02-SH01** (`counterInPlate`): every SS-R4.1 local event −18 (occupant weight f22–f42, glance f36–f54, step f60–f68, reach f68–f78, torch lifted off f78 = G588, lowered f78–f86); `torchOnHook` G < 588; push over [0, 96); window `front: 1.8` (the S02-SH00A end state; the car ghost and the front are both gone).
- **B5-9 S02-SH02** (`phone.tsx`): thumb flick (735, 900) → (735, 760) f48–f66 → (735, 900) f78; list moves −360 px eased f48–f108 (6 cards); L0 drift −20 px over 135 f; thumb mask follows (`thumbShape`).
- **B5-10 clean-ups**: `src/videos/world-fog/index.ts` (comment: 25 shots, 3297 frames); `src/painted/worldfog/qa.tsx` note "Boss SS-R5 fog swallow pass (r9)". Tests in `tests/world-fog.test.ts`: 36 of 36 (was 29; new: 25 shots/3297 frames and the R6 plate starts, RK-1 key and + 297 starts, the B5-3 ramp and front, the WORLD-SITE wall profile, the depth gate with a recording painter, the far wall, the hard-cut ending at G3296, and the VO-03/ding/caption mapping).

### Composition cues (`src/videos/world-fog/index.ts`)
- SFX: entries from the S02-SH03 story point move +297 (`fromStory`); phone ding G612 and pop G628 per sheet sc02-b01; the S02 cues that were ding/pop on G360/G376 are gone.
- AUDIO: drone bed boundaries +297 from the S02-SH04 story point (G837, G1285, G1344, G2127, G2367, G2571, G3087, G3258); forecourt hush now G156–G494 (the open air is eaten by the wall and the front); fridge hum from G360 (sheet: fades in under the swallow, alone from G494).
- Captions: S02 cues from captions.json (seconds from G240) are mapped to composition frames: VO-03a `แต่พอเข้าร้าน` G416, `หมอกก็กลืนลานจอดจนหมด` G442 (closed by a blank at G482), VO-03b `ข่าวในมือถือ…` G624, `ก็มีแต่ภาพเดียวกัน` G654 (closed at G690); later S02 cues +297 (`ใครอยู่ตรงนั้น?` G765). S01, S03 and S04 are unchanged (they move with their scene start).
- Narration: the single Edge r1 file stays at G0 (not retimed; Gemini TTS pending). After G240 its words are out of step with the new shots until Editor retimes or splits it (index open items 25 and 28).

### Checks (logs in out/logs/)
- `npm run typecheck`: exit 0 (`b5-typecheck-final.log`).
- `npm run lint`: exit 0; one warning in `src/painted/spike/BloopLook.tsx` (not touched; pre-existing).
- `node --import tsx --test tests/world-fog.test.ts`: 36 of 36 (`b5-test-wf2.log`). `npm test`: **150 of 150** (`b5-test-all.log`).
- Parity: `out/tmp/b5-base/` (old timeline, before any source edit) vs `out/tmp/b5-new2/` (new): 13 pairs, picture band identical (`b5-parity-psnr.tsv`). Parity sheet: `out/qa/world-fog/r9/parity_window_pairs.png` (S02-SH04 G640 ↔ G937, S04-SH03 G2940 ↔ G3237).
- Determinism: G300 and G453 each rendered twice; PNGs byte-identical.
- Stills: `scripts/world-fog/stills.mjs --entry=src/painted/worldfog/qa.tsx --id=WFOG-QA --gl=angle`, one bundle per run (`b5-new-stills.log`, `b5-new2-stills.log`); unordered frames 156 … 3237 in one bundle.
- Lead (projection tool, `scripts/shot-projection.py` on `projection/S02-SH00A_CAM-GLASS-SWALLOW.json`, `b5-proj-S02-SH00A.log`): narrator span **933 px** (≥ 480), head (979, 622), feet (979, 1555); car headlamp (622, 746) = FA01 point. S01-SH02A: no figure (lead N/A).
- Caption zone (`scripts/caption-zone.py`, `b5-caption-zone*.json`, `b5-caption-zone-block.json`): raw QA frames (no scrim) fail (G452 mean 0.278, p95 0.484). With the production scrim PNG overlaid at its box (approximation: library WAVs are absent here, so the production entry cannot render with audio): default band 860–1248 G452 mean 0.244 pass, p95 0.477 fail; caption block 1020–1248 G452 mean 0.153, p95 0.433 (fail by 0.03); G624 and G654 pass (mean 0.14, p95 0.32).

### Visual review (sheets in out/qa/world-fog/r9/, labelled with shot, TH time, G and f)
- `S01-SH02_clear.png` (G156, 186, 206, 239), `S01-SH02_base_vs_new_G239.png`: clear FS0, pale wall at the back, no cart, no fog on the forecourt.
- `S01-SH02A_fb.png` (G240, 280, 300, 320, 359): FB01–FB02 order holds (fields → road → forecourt edge), lane covered, no figure, no dark mark on the lane, station lit.
- `S02-SH00A_early_mid.png` (G360–G459), `S02-SH00A_late.png` (G465–G509, with S01-SH02A G359): pumps and far cores go first, the car goes at the flank gate G465 (sheet G453 far face is not drawn separately), kerb gone by G487, panes grey at G509.
- `S02-SH01_SH02.png` (G510, 552, 588, 605, then G606, 624, 654, 740): FS2 through the glass, torch off the hook at G588, banner, press, flick.
- `parity_window_pairs.png` (see above).
- Film's pump-top condition at 270 px and full resolution: the right island and the left tops above the car roof both read; no contrast change needed (`b5-*`, scratch crop).

### Deviations and decisions for the owners
- **VD07 foreground (S02-SH00A)**: the painted interior frame (`paintShop` boxes 20–33, hard fills) replaces the SVG `Architecture` foreground, the same recorded route as S02-SH05 (index open item 15). Film to confirm.
- **VD18 row `CAM-GLASS-SWALLOW`** (key [0.2, 1], rim [0.3, 1]): not in the brief's table; the glass is ahead of this eye, so rimScale 1. Film to confirm.
- **Car at S02-SH00A**: side profile (`paintSedanBody`) because the ghost blob has no roof line or headlamp. The whole car drops at the near flank (G465) with no partial clip between z 4.2 and 6.0 (the far face is not drawn separately).
- **S02-SH01 window `front: 1.8`** (not in the sheet): keeps the car ghost out so the G510 panes equal the S02-SH00A end state.
- **VO-03 captions** are moved from their old G293–G376 positions to the sheet windows (open item 25). At the old positions they would fall on the wordless S01-SH02A and S02-SH01. Editor to confirm.
- **Hush and hum**: hush extended to G494, hum from G360 (sheet sc02-b01 sound lines); levels remain Editor's mix.

### Open items and limitations
- **S01-SH02 lane (sheet acceptance G239, lane centre (597, 855) ± 20, road dashes readable)**: this point is behind the parked car's bonnet and body in the unchanged SS-R3.5 framing (before and after this change). The road dashes are under the car. Mark/Film: choose a different acceptance point or change the car's staging.
- **Lower-pane dark band (G420–G487; FS2 windows)**: a hard-edged band from the sky-ramp and walkway bands below the front's ground line; the same band is in the SS-R4.1 window baseline (`S02-SH04_G640`). Look item for Film; DF-20261030-painted-fog-front-depth-gate.
- **Caption zone** at G452 with the production scrim: p95 0.433 in the block (threshold 0.40); the phone insert passes. Editor's scrim (MK-WF-DEP-10).
- **Narration** single file not retimed; VO-03 placement pending Editor/Gemini (index open items 25 and 28).
- **Studio** not run (no interactive session): cold load, play/pause, backward scrub and unordered seeks not verified; stills at unordered frames and identical re-renders are the evidence here.
- **Production MP4 and sound** not rendered: library WAVs under `public/audio` and `public/sfx` are absent from this worktree and from `shipwreck-short-82a71a` (only NOTICE files).
- **FA07** (viewer without sound says the fog covered the station) and user checks SP05/SP06 approval: not done here.
- Labels: the burned-in QA label is `WFOG-QA`; the production entry was not captured with captions (see above).

## 2026-10-30 — Editor r3: Gemini TTS samples for narrator and worker (WFOG-EP01-SHORT, samples only, uncommitted)

Scope: user request 30 Oct (via coordinator): narrator and worker to Gemini TTS with per-line emotion; samples first (2–3 voices per character, 2–3 lines each). No full 16-line run, no change to `narration-lines.json`, timeline, captions or mix, no commit. Edge production path unchanged.

### Status: samples generated, not yet heard by a person
- Run 1 (free-tier key): blocked. HTTP 429, "10 requests per day on Free Tier" for `gemini-3.8-flash-tts`. The google-genai SDK retries 429 silently, so `say` looked hung. No clip from this run.
- Run 2 (billing enabled on the key; coordinator tested one call): 15 of 15 Gemini calls succeeded on the first attempt; no 429 in the log. The key is loaded per run through `zsh -lic`; each call is guarded by `perl -e 'alarm 90; exec @ARGV'`; Gemini calls are not retried (a retry spends quota).
- Cost, from the pricing page rate ($9.00 per 1M output audio tokens, 25 tokens per second, until 31 Dec 2026): about $0.0135 per audio minute; 15 clips (about 1 min) ≈ $0.02. Estimate, not a billing statement.
- Data use: paid tier content is not used to improve Google products (pricing page). Terms unchanged from below.

### Casting candidates (prebuilt voices; gender and pitch from `gemini-tts.py voices --search`)
| Character | Candidate | Gender, pitch | Docs descriptor | Heard before |
| --- | --- | --- | --- | --- |
| narrator | Kore | female, medium | Firm, direct, authoritative | accent and emotion approved by ear 30 Oct (gemini-tts test) |
| narrator | Achernar | female, high | Soft, calm, soothing; recommended for quiet | no |
| narrator | Sulafat | female, medium | Warm, inviting, comforting | no |
| worker | Charon | male, low | Informative, steady | accent and emotion approved by ear 30 Oct (gemini-tts test) |
| worker | Enceladus | male, low | Breathy, intimate, soft-spoken | no |
| worker | Orus | male, low | Firm, serious, no-nonsense | no |

### Styles (same style per line for every candidate; Thai verbatim; no inline tags)
Inline tags would change the text that `narration.py verify` compares with `script.md`, so tags need a rule decision first.

| Line | Speaker | `--style` |
| --- | --- | --- |
| VO-01 | narrator | tense and quiet, low and controlled, slow |
| VO-09 | narrator | frightened, shaky tense whisper, breathless |
| VO-16 | narrator | relieved but uneasy, low and quiet, almost to herself, trailing off |
| VO-10 | worker | panicked and desperate, shouting for help, loud and strained |
| VO-15 | worker | tired and apologetic, out of breath, slow and flat, explaining |

### Durations and loudness vs Edge
Speech = first to last sample at or above the narration.py threshold (300 of 32768, about −40 dBFS), the same method as the r1 table. Edge references (`voice-preset.py` woman-base / man-base, +5%) reproduce r1 within 0.02 s. Loudness and true peak from ffmpeg `ebur128`. Speech in seconds; planned = sheet window (first cue to last cue end).

Narrator:
| ID | Planned | Edge Premwadee | Achernar | Kore | Sulafat |
| --- | --- | --- | --- | --- | --- |
| VO-01 | 1.33 | 0.95 | 1.10 (+15%) | 1.69 (+77%) | 1.45 (+52%) |
| VO-09 | 1.80 | 1.11 | 3.72 (+235%) | 2.78 (+150%) | 2.42 (+117%) |
| VO-16 | 5.10 | 5.38 | 11.18 (+108%) | 9.24 (+72%) | 8.56 (+59%) |

Worker:
| ID | Planned | Edge Niwat | Charon | Enceladus | Orus |
| --- | --- | --- | --- | --- | --- |
| VO-10 | 4.00 | 2.97 | 3.68 (+24%) | 3.52 (+19%) | 3.80 (+28%) |
| VO-15 | 6.40 | 6.94 | 13.85 (+100%) | 10.60 (+53%) | 12.06 (+74%) |

- Loudness: Edge −16.0 to −16.3 LUFS, true peak −1.5 to −3.0 dBTP. Gemini clips −15.8 to −16.7 LUFS, true peak −1.5 to −4.0 dBTP, except three narrator clips that land short of the −16 target: Kore VO-01 −20.1, Sulafat VO-01 −19.6, Sulafat VO-09 −20.9 LUFS. Re-normalize these before any mix.
- Envelope check (0.1 s RMS): the long spans are real word bursts with pauses between them (gaps around −50 to −75 dBFS), not breath or noise tails. The length comes from the pace the styles produce.
- Retime read against the planned window: VO-01, Achernar fits (1.10 s); Kore and Sulafat exceed by 0.1–0.4 s. VO-09: all three exceed by 0.6–1.9 s. VO-16: all three exceed by 3.5–6.1 s (Edge already exceeds by 0.28 s). VO-10: all three fit (3.5–3.8 s). VO-15: all three exceed by 4.2–7.5 s (Edge exceeds by 0.54 s).
- Voice choice does not fix the timing. The pace words ("slow", "trailing off", "slow and flat") drive the overrun for every candidate. The next test is a restyle of VO-09, VO-15 and VO-16 without pace words, before any retime decision.

### Reels (listening reels; 0.6 s gaps; fixed order)
- `out/gemini-tts/wfog-samples/reel-narrator.wav`, 63.22 s, integrated −16.1 LUFS, true peak −1.5 dBTP. Order: Edge Premwadee (VO-01, VO-09, VO-16) → Kore → Achernar → Sulafat, each block in the same line order.
- `out/gemini-tts/wfog-samples/reel-worker.wav`, 66.62 s, integrated −16.2 LUFS, true peak −1.5 dBTP. Order: Edge Niwat (VO-10, VO-15) → Charon → Enceladus → Orus.
- `reel-<character>.json` lists each clip's start and duration in seconds.
- Levels and timing were measured, not listened to. A person must listen before any voice is chosen.

### Provisional recommendation (not heard yet)
- Narrator: Achernar first. It matches the soft, calm descriptor and has the shortest VO-01 that fits the window. Sulafat has the shortest VO-09 and VO-16, but two of its clips need re-normalizing. Kore is the user-approved accent fallback.
- Worker: Enceladus first. It fits VO-10 (3.52 s) and is the shortest VO-15 (10.60 s), and the breathy descriptor suits the tired line. Orus is the firm alternative. Charon has the approved accent but the longest VO-15 (13.85 s).
- Blocker for the full run is pace, not voice. Restyle VO-09, VO-15 and VO-16 without pace words (keep the emotion), then retest the chosen voices (9 calls). The planned windows belong to Film and Mark: if pace cannot be fixed, they decide the retime. No call was made for the restyle; it needs the user's go-ahead.

### Commercial-use and SynthID terms (checked 30 Oct 2026; partial)
- Pages read: ai.google.dev gemini-api/terms, docs/pricing, docs/speech-generation.
- Terms, "Use of Generated Content": Google claims no ownership; the user is responsible for use of generated content, including use by anyone it is shared with. No explicit commercial-use grant for TTS audio on these pages.
- SynthID: not mentioned on the three pages (searched "SynthID" and "watermark"). **Unchecked.** The Additional Terms and the Generative AI Prohibited Use Policy were not read. Keep the gemini-tts skill's "unchecked" flag until checked before first delivery.

### Files and reproduction
- Driver (kept with outputs): `out/gemini-tts/wfog-samples/make-samples.py`. Run through a login shell: `zsh -lic 'python3 -I "<dir>/make-samples.py" "<dir>" gen|measure|reel'`. The Gemini calls use `perl -e 'alarm 90; exec @ARGV'` and are never retried; existing clips are skipped.
- Outputs: `out/gemini-tts/wfog-samples/` (5 Edge references, 15 Gemini clips with `.json` sidecars, `durations.json`, `reel-narrator.wav/.json`, `reel-worker.wav/.json`). Log: `out/logs/gemini-tts-wfog-samples.log` (includes the run 1 429 lines).
- Edit scope: this note is the only change to tracked files. `narration-lines.json`, `captions.json`, timeline and mix are unchanged.

### Next steps
1. User listens to the two reels and picks a voice per character (or asks for the restyle test).
2. If the restyle test is approved: VO-09, VO-15, VO-16 without pace words, chosen voices only (9 calls).
3. Re-normalize Kore VO-01, Sulafat VO-01 and Sulafat VO-09 before any mix.
4. Keep the Edge path in production until the user approves a voice (voice-tuning step 6).

## 2026-10-30 — Editor r3 continued: Sulafat and Orus on Gemini, pace wording, full narration pass (WFOG-EP01-SHORT, uncommitted; no retime, no captions)

Scope: user decisions 30 Oct 2026 after the r3 reels: narrator = Sulafat, worker = Orus; Gemini reads about 1.6–2× Edge, so brisker pace by style direction while keeping the emotion. Steps: pace test (VO-09, VO-15, VO-16); all narrator and worker lines with per-line style plus the chosen pace; 2 takes for VO-01, VO-09, VO-10, VO-15, VO-16; VO-03 split (Mark SS-R5 item 25); measured table vs SS-R5 windows; story-order listening reel. Shop-worker VO-04 and occupant VO-07 stay Edge. Not done: retime of shots or event frames (Mark first), captions, compose/mix.

### Key and run
- Each Gemini call ran under `zsh -lic` (key read fresh) with `perl -e 'alarm 90; exec @ARGV'`. No Gemini retry. No 429 in this run (the pace test and the full pass: 9 + 20 calls, all on the first attempt).
- Edge: VO-04 (`woman-younger`, +5%) and VO-07 (`elder-woman`, needs `out/voice-venv`, created locally with the docstring's packages). No Edge clip existed on disk, so both were generated.

### 1. Pace test (3 variants, same emotion words; the slow words of the first samples removed)
Speech s; SS-R5 window in brackets; "vs window" = speech over window.

| Line | Base (first samples, slow words) | pA "brisk natural pace, no long pauses" | pB "quick and steady, short pauses only" | pC "fast conversational pace, minimal pauses" |
| --- | --- | --- | --- | --- |
| VO-09 Sulafat (1.80) | 2.42 | **2.20 (+22%)** | 2.79 (+55%) | 2.56 (+42%) |
| VO-16 Sulafat (5.10) | 8.56 | **7.05 (+38%)** | 8.14 (+60%) | 6.94 (+36%) |
| VO-15 Orus (6.40) | 12.06 | **9.10 (+42%)** | 8.99 (+40%) | 8.70 (+36%) |
| mean overrun | | **+34%** | +52% | +38% |

- Pick: **pA** (lowest mean overrun, the user's own wording, closest on VO-09). pC is closer on VO-15 and VO-16 by 2–6 points. Emotion words are unchanged from the base, so the emotion is kept by construction; **not heard**.
- Pace words alone do not reach the windows. The remaining overrun goes to Mark (section 3).

### 2. Manifest and pipeline
- `narration-lines.json`: `voices.narrator` = `{engine: gemini, voice: Sulafat, pace: "brisk natural pace, no long pauses"}`; `voices.worker` = `{engine: gemini, voice: Orus, pace: same}`; `shop-worker` and `occupant` unchanged (Edge). A `style` field on the 14 Gemini lines (12 narrator, 2 worker). `VO-03` gets `tts_split`: VO-03a `แต่พอเข้าร้าน หมอกก็กลืนลานจอดจนหมด`, VO-03b `ข่าวในมือถือ… ก็มีแต่ภาพเดียวกัน`; both are exact substrings of the script.md VO-03 blockquote and join with a space to the full line. `verify` still passes 16/16. `planned`, `startG`, `gain`, `mix` untouched.
- `narration.py` (minimal): `tts` branches on `engine: gemini` (style = line style + speaker pace; per-piece `tts_split`); `tts --take K` writes `lines/takes/<id>.t<K>.wav`; new `pick --take K --only ID` copies the take to `lines/<id>.wav` and records `lines/takes/picks.json` (ignored); `measure` measures split pieces. The Edge path is unchanged. `compose` and `captions` untouched (not run).
- Styles used (narrator Sulafat): VO-01 tense and quiet, low and controlled; VO-02 calm, matter-of-fact retelling, slightly uneasy; VO-03a uneasy and low, describing the fog closing over the car park; VO-03b flat and weary, slightly disbelieving, looking at the phone; VO-05 tense, hushed, dread rising; VO-06 whispered, intimate, horrified recognition; VO-08 whispered, urgent but controlled, telling herself to keep still; VO-09 frightened, shaky tense whisper, breathless; VO-11 tense and careful, steady low voice; VO-12 dawning realization, quiet and clear, deliberate; VO-13 private, reflective, quieter than the reveal; VO-14 gentle and anxious, asking politely; VO-16 relieved but uneasy, low and quiet, almost to herself. Worker Orus: VO-10 panicked and desperate, shouting for help, loud and strained; VO-15 tired and apologetic, out of breath, explaining. Each + ", brisk natural pace, no long pauses".

### 3. Measured table vs SS-R5 planned windows (for Mark's retime)
Speech = first to last sample at or above the narration.py threshold; onset = clip start to first audible sample; window = SS-R5 first cue start to last cue end, in composition frames (30 fps). Delta = speech − window. Edge VO-04 and VO-07 measured the same way. "pick" = the take in `picks.json` (single take otherwise).

| ID | Speaker (engine) | Pick | Onset s | Speech s | SS-R5 window f (s) | Delta s | LUFS | TP dBTP |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| VO-01 | narrator (Gemini) | t1 | 0.26 | 0.93 | 0–40 (1.33) | −0.40 | −17.1 | −1.5 |
| VO-02 | narrator | 1 | 0.19 | 4.42 | 48–234 (6.20) | −1.78 | −16.0 | −1.5 |
| VO-03a | narrator | 1 | 0.08 | 3.79 | 416–482 (2.20) | +1.59 | −16.0 | −1.5 |
| VO-03b | narrator | 1 | 0.20 | 3.32 | 624–690 (2.20) | +1.12 | −15.9 | −1.5 |
| VO-04 | shop-worker (Edge) | — | 0.21 | 0.87 | 765–807 (1.40) | −0.53 | −16.0 | −2.7 |
| VO-05 | narrator | 1 | 0.33 | 7.25 | 867–1071 (6.80) | +0.45 | −16.6 | −1.7 |
| VO-06 | narrator | 1 | 0.12 | 1.90 | 1107–1167 (2.00) | −0.10 | −16.9 | −1.5 |
| VO-07 | occupant (Edge) | — | 0.33 | 1.03 | 1344–1374 (1.00) | +0.03 | −18.9 | −1.5 |
| VO-08 | narrator | 1 | 0.15 | 2.57 | 1392–1482 (3.00) | −0.43 | −19.2 | −1.5 |
| VO-09 | narrator | t1 | 0.20 | 2.27 | 1743–1797 (1.80) | +0.47 | −17.3 | −1.5 |
| VO-10 | worker | t2 | 0.24 | 3.72 | 1827–1947 (4.00) | −0.28 | −16.2 | −5.3 |
| VO-11 | narrator | 1 | 0.25 | 1.88 | 1977–2031 (1.80) | +0.08 | −20.8 | −1.5 |
| VO-12 | narrator | 1 | 0.27 | 8.96 | 2127–2331 (6.80) | +2.16 | −16.0 | −1.5 |
| VO-13 | narrator | 1 | 0.17 | 10.88 | 2379–2559 (6.00) | +4.88 | −16.1 | −1.5 |
| VO-14 | narrator | 1 | 0.24 | 3.33 | 2655–2751 (3.20) | +0.13 | −16.0 | −1.5 |
| VO-15 | worker | t2 | 0.17 | 9.54 | 2775–2967 (6.40) | +3.14 | −16.4 | −1.5 |
| VO-16 | narrator | t1 | 0.11 | 8.25 | 3093–3246 (5.10) | +3.15 | −15.9 | −1.5 |

- Take choice (key lines, ear-proxy): no clipping (TP ≤ −1), onset ≤ 0.4 s, no silent run > 1.2 s inside the speech, loudness within 2 LU of −16, then the speech closest to the window. VO-01 take 2 fails loudness (−18.3); VO-09 take 2 fails onset (0.46 s). The rest of the pair pass; VO-10 take 2 (−0.28) and VO-15 take 2 (+3.14, vs +3.23 for take 1) are closest. Picks in `out/editor/world-fog/WFOG-EP01-SHORT/lines/takes/picks.json`.
- Measured, not heard. Pace words did not bring the long lines inside the windows.
- For Mark (retime, not done here): VO-13 +4.9 s and VO-16 +3.2 s and VO-15 +3.1 s and VO-12 +2.2 s are the big overruns; VO-03a +1.6 s is over index item 28's ≈2.3 s threshold (lengthen the swallow, never move the car loss ahead of the words). VO-02 has room. VO-10 (worker) fits its window.
- Sheet windows: the R5 sheets sc02-b02-b03, sc03 and sc04 still show SS-R4.1 cue numbers ("stale pending TTS"). The table applies the index RK-1 shift (+297 frames from S02-SH03 on): S03-SH03 starts at 2097 (1800+297), S04-SH03 at 3087 (2790+297). Mark to confirm.
- Loudness: Gemini clips land at −15.9 to −16.9 LUFS for most lines, but VO-11 (−20.8), VO-08 (−19.2) and VO-07 (Edge occupant, −18.9) are quieter. The mix needs a per-line level correction before any listening verdict on balance.

### 4. Listening reel (story order, 17 clips, 0.6 s gaps)
- `out/gemini-tts/wfog-r3/reel-all-story-order.wav`, 93.53 s, −16.4 LUFS, TP −1.5 dBTP. Order: VO-01, VO-02, VO-03a, VO-03b, VO-04 (Edge), VO-05, VO-06, VO-07 (Edge), VO-08, VO-09, VO-10, VO-11, VO-12, VO-13, VO-14, VO-15, VO-16. `reel-all-story-order.json` has each clip's start, duration and take.

### Files
- Tracked: `scripts/world-fog/short/narration-lines.json`, `scripts/world-fog/narration.py`, `scripts/world-fog/build-notes.md`.
- Ignored outputs: `out/editor/world-fog/WFOG-EP01-SHORT/lines/` (17 clips, takes, picks), `timing/tts-measure.json`, `out/voice-venv/` (new), `out/gemini-tts/wfog-pace-test/` (9 clips, `pace-test.json`, `make-pace-test.py`), `out/gemini-tts/wfog-r3/` (reel, JSON, `r3-table.json`, `make-r3-table.py`), `out/logs/gemini-tts-wfog-pace.log`, `out/logs/gemini-r3-measure.log`.
- Not changed: shots, sheets, index, captions, timeline, mix, script.md, the Edge path of the other two speakers.

## 2026-10-30 — Boss r10: SS-R5.1 Boss list C-1…C-12 (WFOG-EP01-SHORT r10, picture only, uncommitted)

Scope: lengths, holds, story keys and push lengths of the SS-R5.1 Boss list (index `#ss-r51-boss-list`), mouth windows (C-12) and checks. Not changed: captions, caption scrim, narration, mix, cue tables (Editor's next pass).

### What changed (owner files)
- `src/painted/worldfog/space.ts`: `SHOT_ROWS` (25 shots, 3766 f) and `TOTAL_FRAMES` 3766 (C-1); `STORY_CLOCK` per shot (RK-2 shift, holds, S04-SH01 stretch); `storyAt` (event key) and `ambientAt` (continuous clock). `storyG`, `STORY_SHIFT`, `STORY_FROM` removed. `pchip` (monotone, flat at both ends) and `frontAt` on the S02-SH00A keys (C-3); `fogAt` derived from the front to G516, FS2→FS3 G2802–G3068; `lampAt` S04-SH03 thresholds (far pair f12–f120, near-left f100–f220, near-right 0.35 held to f260, out f278).
- `src/painted/shots/worldfog.tsx`: each plate reads `G` (event), `A` (ambient) and `f`; `windowPlate` passes `A` to the outside, halos and pose. S02-SH00A push 174, look on the car to f120, drift to the kerb f156, blink f164–f167 (C-3). S03-SH03 push over 160 with the f120–f159 hold (C-6). S03-SH04 fixed 46, S03-SH05 fixed 100 (C-7). S03-SH06A push 216 (C-8). S03-SH07 push 206; occupant nod, glance, look and brows on the event frame `e` = G − 2190, held at e71 over f72–f127 (C-9). S04-SH01 push 434; worker cue windows [138,148) [151,344) [350,377) [388,424), narrator [18,72) [77,109) (C-10, VO-14/VO-15). S04-SH03 push 306 (C-11). Mouth windows: S02-SH06 [18,75), S02-SH08 narrator [72,107) [117,150), S02-SH10 [28,89) (C-12).
- `src/painted/worldfog/phone.tsx`: list scroll f48–f114, held to f155; L0 drift `f / 156` (C-5). S02-SH02 is 156 f; S02-SH01 keeps its story key (510 + f, C-4), so the torch leaves the hook at f78 = G612.
- `src/painted/worldfog/outside.ts`, `shop.ts`, `layers.tsx`, `assembly.ts`: ambient clock for fog drift `t`, halo shimmer, lens-ripple phase (`fogWarp`), veil patches and held breath. `asmPoseAt(G, A = G)` sets `pose.g` = A (fog only); `heldLook(G, A)` breath and the extra blink f170–f174 on A; event blink, gaze and bow on G.
- `src/videos/world-fog/index.ts`: header comment only. Scene starts, durations and painted shot starts follow `SHOT_ROWS`. `fromStory` (+297) and the cue tables are unchanged, so the SFX, music and S02 captions after S02-SH03 are not yet re-keyed (Editor).
- `src/painted/worldfog/qa.tsx`: label note r10; the WFOG-QA entry draws a copy of the timeline without `media` (caption scrims). Before, it drew the scrims over the picture where caption windows fell.
- `tests/world-fog.test.ts`: 3766 frames, RK-2 keys (`storyAt`, `ambientAt`), PCHIP front, S04-SH03 lamps, FS3 at G3068, hard cut at G3765 = f305, pushes; S03-SH06A camera checked at f215; S03-SH07 torch checked at shot f0 and f205.
- `scripts/world-fog/lead-check.ts`: S03-SH07 rows re-keyed to shot frames (story G2320 = f186, G2339 = f205).
- `scripts/world-fog/parity-psnr.py` (new; TL02, episode-only): luma PSNR of y 300–1920 between two stills folders, caption-scrim band masked.
- `docs/dev-findings/DF-20261030-painted-story-hold-ambient-clock.md` (new) and its row in `docs/dev-findings.md`; a Boss r10 note in `DF-20261030-painted-fog-front-depth-gate.md`.

### Decisions (for the owners to confirm)
- Lens-ripple phase runs on the ambient clock (it is fog movement; the lens amount stays on the event clock). RK-2 names the amount, not the phase.
- S04-SH01 event logic (slump, turn, glance f190–f214) stays on the shot-local frame as built; only the story key is stretched, so the eyes glance at f190–f214 and the body turn at f140 are unchanged.
- S02-SH00A keeps its look keys on the shot-local frame (no hold in that shot).

### Checks (logs in out/logs/r10-*)
- Typecheck `r10-typecheck3.log` exit 0. Lint `r10-lint3.log`: 0 errors; 1 warning in `src/painted/spike/BloopLook.tsx` (not touched, pre-existing).
- Tests: world-fog 37/37 (`r10-test-wf2.log`); full `npm test` 151/151 (`r10-test-all.log`).
- Lead height: `r10-lead-check.log` (S04-SH01 worker 795–922 px over f56–f130 and f40; S03-SH07 worker profile 904 px at f205; S03-SH06A worker 676 px). `r10-proj-S02-SH00A.log`: narrator 933 px at s 1.00 (push to 1.03 keeps it above 480). Not measured: S03-SH03/04/05 window inserts (no figure lead).

### Parity with r9b (C-2): picture band, chrome off, scrim band masked
- 154 pairs of unchanged-length shots at the same story key (`out/tmp/r10-ref/pairs.json`; r9b frames `out/tmp/r10-ref/r9b/`, r10 frames `out/tmp/r10/render/`): 146 byte-identical in luma (inf dB). Table: `out/logs/r10-parity-picture.tsv`.
- Non-identical, all explained: S02-SH01 f0 (53.6 dB; story key 510 falls in the S02-SH00A fog ramp, fog level 1.967 instead of 2.0 for f0–f5); S02-SH06 f60 (52.5 dB); S02-SH08 f75, f90, f105, f120, f135 (53–67 dB); S02-SH10 f75 (41.4 dB). The last three shots changed narrator windows (C-12).
- Story-key check: G1751 (S02-SH09 f179) equals the r9b frame at story G1409, as C-2 asks.
- Determinism: S03-SH07 G2800 two renders, luma 111.3 dB (1-byte PNG size difference, render noise); S04-SH01 G3200 byte-identical.

### QA sheets (viewed; labels burned in by the QA entry; `out/qa/world-fog/WFOG-EP01-SHORT/r10/`)
- `sheet-S02-SH00A-front-hold.png` (G360, 390, 420, 454, 490, 510, 516, 533): car far face and flank go under the bank; grey from G516.
- `strip-car-loss-G454-G490.png` (13 frames, every 3 f): the car loss strip.
- `sheet-checkpoints-listed-numbers.png` (G400, 434, 470, 612, 2172, 2858, 3330, 3714): the other numbers in the list.
- `sheet-S02-SH02-list-hold.png` (G744, 765, 785): list at 360 px, L0 drift.
- `sheet-S03-SH03-lit-hold.png` (G2262, 2282, 2301): lit pose held, fog moving.
- `sheet-S03-SH04-S03-SH05-holds.png` (G2344, 2346, 2347, 2420, 2435, 2447): insert holds.
- `sheet-S03-SH06A-hold.png` (G2604, 2654 blink f170, 2699): hold, extra blink, push.
- `sheet-S03-SH07-hold-push.png` (G2772, 2800, 2827, 2852, 2905): glance held through the hold, cart through the door at G2905.
- `sheet-S04-SH01-talk-span.png` (G3044, 3200, 3339): talk span.
- `sheet-S04-SH03-close.png` (G3560, 3680, 3720, 3738, 3765): lamps out by f278, last frame f305.

### Deviations and open items
- Not verified: Studio cold load and scrub (no interactive session); the production `src/index.ts` render (blocked: `audio/room/room_shop-fridge-hum_01.wav` returns 404 in this worktree; the QA entry validates the same timeline with media removed).
- Cue frames not re-keyed (Editor): `fromStory` is still +297, so the SFX, music and S02 captions after S02-SH03 sit at the r9b positions (45 f early for S02-SH03…S03-SH02; later after the holds).
- Framing (Mark or Film): in S02-SH00A the narrator's head is cut by the right frame edge (also in r9b at G390, not changed here).
- Build notes: the working copy has no Boss r9 / r9b entries (their text survives in `out/tmp/build-notes.r9.md`); not reconstructed here.
- The r9b reference was rendered from the r9b tree before any r10 source edit (`out/logs/r10-ref-r9b-stills.log`).
- Scripts: `out/logs/r10-parity-picture.tsv` is the parity table; `scripts/world-fog/parity-psnr.py` reproduces it: `python3 -I scripts/world-fog/parity-psnr.py --old out/tmp/r10-ref/r9b --new out/tmp/r10/render --pairs out/tmp/r10-ref/pairs.json --tsv out/logs/r10-parity-picture.tsv`.

## 2026-10-30 — Editor r4: full integration of WFOG-EP01-SHORT (SS-R5.1 cue table, Gemini narration, scrim fit, mix, render)

Scope: coordinator message 30 Oct 2026 (approved inputs: Sulafat/Orus Gemini lines with VO-03a/b split, Mark SS-R5.1 with RK-2 and the cue table at `index.md#ss-r51-cue-table`, Boss r10 picture; open item 30 accepted: VO-02 as two parts of the one approved take). Picture code (`src/painted/*`) untouched. No commit.

### Placement and captions
- `scripts/world-fog/short/placement.json` (new, Editor): 18 clip placements (file frame `from` → composition frame `at`, the cue table's clip start) and 39 caption cues in G (half-open windows from the cue table). VO-02 is one take: part a = file f0–f63 at G42, part b = file f63 at G125 (the cut sits in the silence f60–f68 of the approved take).
- Caption splits from the audio (energy, 100 ms smoothing, midpoint of the pause run): VO-02b at G187 (`ตอนนั้นแค่คิดว่าจะเติมน้ำมัน…` G132–187, `แล้วกลับบ้าน` G187–207); VO-10 at G1901 and G1934; VO-15 at G3110, G3170, G3253. VO-13-3 has an authored break (`แล้วความกลัว` / `ก็ชวนให้ฉันมองว่ามันเป็นอันตราย`); the measured width (font advance sum, no shaping, 954 px regular) is over the 950 px line, so it is a two-line caption. All other captions are one line (widths 170–700 px).
- `narration.py compose` now places clips from `placement.json` (speech G measured: VO-01 7.8–36.5, VO-02b 132–200.5, VO-03a 382.5–496, VO-05 900–1119, VO-10 1872–1984, VO-12 2172–2441, VO-13 2495–2822, VO-15 3044–3330, VO-16 3466–3714; all within 0–4 f of the cue table; VO-03a onset is the first sample above −40 dBFS (2.4 f into the file), so the table's 386 is an energy start, 3 f later). `captions` writes `scripts/world-fog/short/captions.json` in G frames; `verify` checks that caption texts join back to each script line (16/16 lines, 39 cues, 18 clips).
- Level correction (`levelDb` per clip to −16 LUFS before the EP08a gains; alimiter at −1.5 dBTP): VO-11 +4.8, VO-08 +3.2, VO-07 +2.9 (Edge occupant), VO-09 +1.3, VO-01 +1.1, VO-06 +0.9, VO-05 +0.6.

### Sound, music, ambience (SS-R5.1)
- `src/videos/world-fog/index.ts`: `fromStory` (+297) replaced by `storyToG`, a piecewise map from RK-2 (story key Gk → G; the S04-SH01 talking span has slope 296/192). Shot-local cues use `shotG(id, f)` (phone ding f6 → G636, press f22 → G652; shop door f12 → G2918; torch S04-SH02 f10 → G3350). Sheet-driven checks: umbrella taps G1292/1310/1328 (f51/69/87 of S02-SH07), torch S03-SH02 G2103 (f108), S03-SH06 scrape G2454 (f6).
- Outside layer (sheet R6 sound direction): library hush dry from S01-SH02 f30 (G156) to the glass (G360); then `outdoor_fog-forecourt-hush_glass_01.wav` (lowpass 900 Hz, derived copy) at −12 dB, fading to silence at S02-SH00A f156 (G516); shop hum from G360 (library); drone swell from S01-SH02A (fades in over 9.2 s, 0.10, holds to the cut G534). No whoosh or fog SFX.
- Bed S04-SH03: from f0 with a 15-frame fade-in; sheet sc04 says fades out f159–f171, but that is R4.1 timing and the R5.1 line ends at f254, so the fade is placed f255–f267 (after the line). Mark to confirm.
- Library copies (gitignored): 16 files from the shared library (`/Users/mangkornkatawong/Documents/ChatGPT/sound-library/` INDEX IDs) copied to `public/audio/<cat>/` and `public/sfx/<cat>/` at the timeline paths. Derived file: `public/audio/outdoor/outdoor_fog-forecourt-hush_glass_01.wav` (not a library entry; file it with `sound-library.py` if kept).

### Caption scrim (user complaint: plate much taller than text)
- The fixed 960×260 plate (tracked in git) is removed from disk. Two plates generated with the r2 profile (colour 16,16,24; core alpha 158; 40 px smoothstep feather): `WFOG-caption-scrim-1line-960x180.png` (block + 8 px margin) and `…-2line-960x264.png`. Box y 1108 (1-line) and 1024 (2-line), block bottom y 1240. `index.ts` chooses the plate from the caption's line count.

### Mix and render
- Render: `npx remotion render src/index.ts WFOG-EP01-SHORT out/WFOG-EP01-SHORT/WFOG-EP01-SHORT_C_seamless_r4.mp4 --gl=angle --codec=h264 --crf=18 --pixel-format=yuv420p --concurrency=4 --overwrite` (log `out/logs/editor-r4-render.log`, 3766/3766 encoded, about 60 min on this machine).
- Project loudness step (`scripts/loudness.mjs` `normalizeLoudness`, log `out/logs/editor-r4-loudness.log`): as rendered −18.2 LUFS, TP −1.73 dBTP → after **−14.14 LUFS integrated, −1.46 dBTP**, LRA 9.3. As-rendered copy kept beside it (`…_r4_asrendered.mp4`).
- Streams: H.264 1080×1920 30 fps 3766 frames; AAC 48 kHz stereo; container 125.547 s.

### QA (measured; not heard by a person)
- Sheets (viewed): `out/qa/world-fog/WFOG-EP01-SHORT/editor-r4/sheet_caption_scrim_r4.png` (39 caption midpoints), `sheet_story_r4.png` (every 60 f and G3765), `scene-samples-sheet.png` (one production still per scene).
- Scene samples (production stills, `stills.mjs`, unordered run): S01 `scene-samples/S01-SH01_G120.png`, S02 `S02-SH02_G700.png`, S03 `S03-SH06A_G2600.png`, S04 `S04-SH03_G3500.png`.
- Seek parity (7 unordered stills vs exact MP4 frames, luma PSNR after encode): G30 49.1, G120 49.4, G700 49.0, G1900 41.2, G2600 48.4, G3500 41.6, G3765 49.7 dB; each still matches its own frame best (G1900 vs frames 1899/1900/1901: 36.3 / 41.2 / 26.9). Not run: interactive Studio scrub.
- caption-zone (`scripts/caption-zone.py`, band 1140:1248 for 1-line captions, 1070:1248 for VO-13-3; picture-only background frames from the QA entry, captions and scrim off): 2 of 39 pass at mean ≤ 0.25, p95 ≤ 0.40. Failing frames have bright fog or white shelves behind the caption line (mean 0.20–0.49). On production frames (captions on) the band includes glyphs, so the number is reference only. r2 had 14 of 44 with the band 1000:1248; this run used different midpoints and a shorter plate, so the figures are not directly comparable. **Open: the default threshold is not met on most frames; Film/Boss/user decision (stronger or taller plate on bright backgrounds, or accept).**
- Tests: `node --import tsx --test tests/world-fog.test.ts` 37/37 (updated the three SS-R5 caption/ding assertions to the R5.1 cue table: VO-03a G386, VO-03b G648, ding G636, `ใครอยู่ตรงนั้น?` G810; log `out/logs/editor-r4-tests-node.log`). `tsc --noEmit` clean.

### Open items
1. caption-zone on bright backgrounds (above): decision needed (plate alpha/height, or accept with per-frame exceptions as r2).
2. S04-SH03 bed fade: sheet timing f159–f171 (R4.1) vs R5.1 line end f254. Mark to confirm the f255–f267 placement.
3. S04-SH01 outside hush muffles again once the leaf is shut (sheet sc04, story G2376 → R5.1 G2942): not implemented in this pass.
4. The sheets have no lamp sound cue; lamp timing is picture only (nothing re-timed for lamps in audio).
5. Picture: no picture change requested by Editor r4 (shot ranges and Boss r10 code used as is). QA frames show no defect that needs a change; a person has not reviewed motion or continuity.
6. Gemini commercial-use and SynthID terms: still unchecked (from r3).

### Files changed (Editor r4)
- Tracked: `src/videos/world-fog/index.ts` (rewritten: RK-2, shot-local cues, scrim by line count, caption feed), `scripts/world-fog/narration.py` (compose/captions/verify on placement.json), `scripts/world-fog/short/placement.json` (new), `scripts/world-fog/short/captions.json` (regenerated, G frames), `scripts/world-fog/short/WFOG-EP01-SHORT.amplitude.json` (3766 frames), `public/scrim/WFOG-caption-scrim-1line-960x180.png` and `…-2line-960x264.png` (new), `public/scrim/WFOG-caption-scrim-960x260.png` (deleted from disk), `tests/world-fog.test.ts` (three R5.1 assertions), `scripts/world-fog/build-notes.md` (this note).
- Ignored: `public/narration/WFOG-EP01-SHORT.mp3`, `public/audio/…`, `public/sfx/…`, `out/WFOG-EP01-SHORT/…`, `out/qa/world-fog/WFOG-EP01-SHORT/editor-r4/…`, `out/logs/editor-r4-*`, `out/editor/world-fog/WFOG-EP01-SHORT/lines/…` (placed clips, takes, picks), `out/voice-venv/` (from r3).
