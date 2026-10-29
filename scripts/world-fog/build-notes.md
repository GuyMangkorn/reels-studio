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
