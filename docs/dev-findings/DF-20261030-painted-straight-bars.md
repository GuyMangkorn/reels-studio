# DF-20261030-painted-straight-bars — painted fills grow irregular watercolour edges; straight architecture needs the flat wash underlayer

- Owner: Boss; first observed: 2026-10-30; last checked: 2026-10-30
- Status: workaround (flat `brush.wash` underlayer gives straight, hard, opaque bars and shelf end; the textured `fill()` form stays for sets and characters)
- Type: tool-limitation
- Tags: 2D / painted / p5.brush / architecture / straight edges / VD07 / SP03
- Scope: uncommitted worktree `claude/wordfog-post-merge-main-959703`; `src/painted/worldfog/draw.ts` (`hardFill`), `src/painted/worldfog/shop.ts` (`hard` box flag: id 1 and ids 20-33); p5.brush from `node_modules` (README: `fill()` "irregular edge, pigment ring"; `wash()` "paints flat colour"); Remotion 4.0.538, `--gl=angle`
- Consumers: WFOG-EP01-SHORT interior shots with `paintShop` (S02-SH01, S02-SH03, S02-SH05, S02-SH06, S02-SH08, S02-SH10, S03-SH01, S03-SH02, S03-SH07, S04-SH01, S04-SH02) and the window-shelf foreground of S02-SH05 (SP03)

## Symptoms and evidence
- The interior mullions, transom and the window-shelf end, painted with the textured `solid()` fill (7 passes, texture 0.04, border 0.1), had blobby, wavy outlines on the 1 s sheet (`out/qa/world-fog/WFOG-EP01-SHORT/r1-1s/`) and in a 680 px full-resolution crop of S02-SH05 at G760.
- Reproduce: `node scripts/world-fog/stills.mjs --out=DIR --entry=src/painted/worldfog/qa.tsx --id=WFOG-QA --frames=760`, then crop `ffmpeg -i DIR/S02-SH05_G760.png -vf crop=680:700:400:500`.

## Attempts and results
- Textured `solid()` (old): blobby edges and a pigment ring.
- `fill()` with `fillTexture(0, 0, false)` and `fillBleed(0)`: still wobbly; `fill()` always grows its shape by the layered-polygon method, so the edge is not straight.
- Flat underlayer (`brush.wash` through `hardFill`, seeded, no bleed, no texture): straight, hard, opaque edges; no fog pickup through the bars (checked on the 680 px crop at G760).
- SVG overlay (the CAM-GLASS-OUT `Architecture` layer): straight, but VD07 forbids an overlay over painted actors, so interior bars that stand behind the crouched pair stay painted.

## Planning impact
- Film/Mark: interior straight bars are a painted flat underlayer when actors stand between the camera and the glass (VD07 "everything is painted"); window plates with no inside actor keep the SVG Overlay. SP03 (S02-SH05 G760) passes on the bars by this measure; the wheel legibility at G760 is a separate open item (see build-notes 2026-10-30 r2 entry).
- Re-check when p5.brush changes its fill or wash implementation.

## Revalidation history
- 2026-10-30 (worktree, uncommitted): crop check of S02-SH05 G760 after the change; 1 s pass and labelled frames under `out/qa/world-fog/WFOG-EP01-SHORT/r2/`.
