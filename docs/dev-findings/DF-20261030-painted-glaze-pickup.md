# DF-20261030-painted-glaze-pickup — textured fills and glazes over a part show earlier paint; VD18 uses texture 0

- Owner: Boss; first observed: 2026-10-30 (Film look development, VD18 frames); last checked: 2026-10-30 (Boss r3)
- Status: workaround (VD18 part bases, glazes and the lit face oval use texture 0; light accents are opaque passes)
- Type: tool-limitation
- Tags: 2D / painted / p5.brush / texture / glaze / figures / lighting
- Scope: uncommitted worktree `claude/wordfog-post-merge-main-959703` (baa96b8 + working tree); `src/painted/worldfog/draw.ts` (`solid`, `glaze`, `modelPart`), `cast.ts` (part `fill`, VD18 base texture 0), `head.ts` (`faceModel` lit oval texture 0); p5.brush from `node_modules` (standalone build); Remotion 4.0.538; `--gl=angle`
- Consumers: WFOG-EP01-SHORT VD18 plates S02-SH01, SH03, SH05, SH06, SH08, SH10, S03-SH01, SH02, SH07, S04-SH01, SH02 and the S01-SH02 narrator (proposed cast-only light); brief `VB-WFOG-EP01-SHORT-R4` VD18

## Symptoms and evidence
- Film look development (30 Oct, before the texture-0 rule): the window shelf's pale lip showed through the occupant's hair and the narrator's jacket, and the fog showed through a white shirt whose base had texture 0.07 (`scripts/world-fog/build-notes.md`, Film 30 Oct entry; crops under `out/qa/world-fog/WFOG-EP01-SHORT/lookdev/`).
- Coordinator look-check note (30 Oct): figures read slightly washed or translucent, and the S02-SH08 narrator's face seemed to show the shelf.
- Boss r3 check of that note (not reproduced): the three `VD18_SET` shelf colours were set to `#ff00ff` for one render of S02-SH08 G1129 and diffed against the normal render (`stills.mjs --frames=1129`, byte comparison by channel).
  - Narrator face (x 400–560, y 560–680): 0 pixels changed by more than 8 levels, maximum change 4.
  - Dark hair pixels (luma < 0.30) inside the hair crown box (x 380–600, y 430–540): 12,641 px, mean change 0.76 levels; the 100 px above 8 levels sit on the outer hair edge against the shelf, not inside the hair.
  - Conclusion: at G1129 the face and hair interior show no pickup from the shelf. The washed read is not shelf pickup.
- Reproduce the texture failure: in `glaze` (`draw.ts`) use `fillTexture(0.5, 0.4, true, 0.2)` (granulation on) and crop S02-SH08 G1129 at `crop=700:700:250:380`; the earlier paint shows through the granular part.

## Attempts and results
- Textured `fill()` (texture > 0) over an opaque part: earlier paint shows through the granulation gaps (Film, 30 Oct).
- Texture 0 with `scatter` off in every VD18 glaze, and texture 0 for the part bases (`cast.ts` `fill`): no visible pickup in the Film frames or the Boss r3 diagnostic. Lit oval on the face changed from texture 0.05 to 0 in Boss r3 to keep the same rule.
- `brush.render()` before a figure: did not stop the see-through (Film, 30 Oct).
- Light watercolour glazes cannot lighten a dark part (pigment is subtractive): rims, lit planes and lips are 2–3 opaque passes or hard fills.
- Not changed: set bases (`shop.ts` `paintBox`, the shell) still use textured `solid()` (0.04 and 0.08) to keep the approved S02-SH08 look. Not measured separately.

## Planning impact
- Film: the VD18 texture rule stands. Texture comes from the pigment ring, pencil hatching, ink and the grain layer, not from granulation of a part.
- Mark: no shot change from this finding.
- Follow-up (Boss): if the set bases show granulation in a later review, test texture 0 on the set bases with the S02-SH08 frame before/after. Run the shelf-swap diagnostic on S04-SH01 and S03-SH07 faces (not run in r3).

## Revalidation history
- 2026-10-30 (worktree, uncommitted, Boss r3): shelf-swap diagnostic on S02-SH08 G1129 as above; 5 of 5 determinism frames byte-identical across opposite-order runs (`out/qa/world-fog/WFOG-EP01-SHORT/r3/det-a`, `det-b`). Status stays `workaround`.
- Film/Mark adoption: VD18 in `VB-WFOG-EP01-SHORT-R4`; no decision change recorded.
