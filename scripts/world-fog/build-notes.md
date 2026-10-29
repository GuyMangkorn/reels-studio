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
