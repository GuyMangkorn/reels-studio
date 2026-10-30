# DF-20261030-painted-fog-front-depth-gate — fog front removes layers by depth (no global fade); walkway and sky bands show a hard lower-pane edge

- Owner: Boss; first observed: 2026-10-30 (Boss r9, SS-R5 fog swallow, S02-SH00A); last checked: 2026-10-30 (Boss r9, uncommitted worktree `claude/world-fog-next-steps-2817bc`)
- Status: workaround (`paintOutside` `front` option; without `front` the window look is unchanged). Open look item: the lower-pane band (see Symptoms 3).
- Type: implementation-bug (fog as one global fade) and tool-limitation (ground and sky bands with straight edges)
- Tags: 2D / painted / p5.brush / window / fog / depth order / clip
- Scope: `src/painted/worldfog/outside.ts` (`OutsideOpts.front`, `sedan`; `paintFront`), `src/painted/worldfog/space.ts` (`fogAt`, `frontAt`, `storyG`), `src/painted/shots/worldfog.tsx` (`swallowPlate`, `counterInPlate` at front 1.8, `forecourtPlate` at front 60)
- Consumers: WFOG-EP01-SHORT S01-SH02 (front 60), S02-SH00A (front `frontAt`), S02-SH01 (front 1.8); every shot that calls `paintOutside` without `front` (S02-SH04, S02-SH07, S02-SH09, S03-SH03..S03-SH06A, S04-SH03 and the low-shelf plates) keeps the SS-R4.1 output (picture band identical to the baseline, see r9 parity table)

## Symptoms and evidence
1. Desired (brief VD06 R6, ST-05): the front removes layers in depth order (far lamps → pumps and columns → near lamps → car → kerb) with no ghost and no global fade. SS-R4.1 `paintOutside` faded every layer with one FOG-STATE `clear` factor, so the forecourt greyed as a whole.
2. Built (r9): each layer is kept when its own depth is nearer than the front (`vis`) and ground planes are clipped at the front (`zc`); `clear` is 1 with `front`; the veil is off; the high banks and the forecourt low bank are off; the front is painted as a 4 m bank (15 m far wall at F ≥ 60) with a crest, two lower banks and ground tendrils 0.5–1.5 m nearer the glass. Gate thresholds computed from F(G) (sheet order): far lamp cores gone at G424, pumps G434, near lamp cores G448, car flank G465, kerb G487; the labelled frames G420–G487 show pumps and car leaving in that order.
3. Observed: a hard-edged dark band crosses the lower panes and the window shelf at G420–G487 (S02-SH00A) and at FS2 in the SS-R4.1 window shots (S02-SH04 G640 baseline). Cause (checked by disabling the walkway strips at G470, the band stays): the sky ramp bands (`ramp8`, group 100) and the walkway strips have straight top edges below the front's ground line. Not changed in r9: the shared window look must stay byte-identical without `front`. Open for Film (look) and Boss (a soft edge in front mode only, if Film asks).
4. Lesson: a fog state that is only a level cannot give a depth order. Gate layers by their own depth and clip ground planes at the front; keep the FOG-STATE level for the veil and haze only.
5. Clock keys (RK-1): plates read story clocks at `storyG(G)` (G − 297 from S02-SH03 on). `fogAt` ramps on the R6 composition axis (G360–G494); a story value in 444–494 from the old S02-SH03 never reaches `paintOutside` (no glass in that setup), so the two uses do not collide.

## Checks (r9)
- Parity: 13 pairs of old and new frames (G0, 60, 125 and G444/470/540/640/738/1409/1830/2790/2940/2999 mapped +297): picture band y 300–1920 identical (PSNR inf). Table: `out/logs/b5-parity-psnr.tsv`.
- Determinism: G300 and G453 rendered twice, byte-identical.
- Not verified: Studio cold load and scrub (no interactive Studio in this run); the production MP4 with audio (library WAVs absent from both worktrees).

## Film / Mark implications
- Film: the walkway and sky bands read as a hard dark band in the lower panes at the front (look item); a soft edge in front mode is available if Film prefers it.
- Mark: the S01-SH02 lane centre (597, 855) is behind the parked car's bonnet in this framing (index open item 26 and the sc01 acceptance row at G239); the car is unchanged from SS-R3.5.

## Boss r9b (2026-10-30): bleed, fade and the car cover
6. Symptom: a wide pale wash with `bleed` 0.6 (the front bank body) spread about 100–150 px below its base line, so the far wall covered the road and the S02-SH00A forecourt went pale above the kerb. Thin light washes (kerb `#d2d4cb`) with the same bleed spread upward the same way. Measured by sampling columns and by disabling one layer at a time (walkway, bank, veil, halos, kerb, the whole outside painter): the pale band disappeared only with the kerb or the outside painter removed. Fix (front mode only): bleed 0.02–0.2 and texture 0.1–0.3 on the front layers; window look unchanged.
7. Symptom: the parked car dropped in one frame at the flank gate (`vis(4.2)`). Fix (front mode): the car is painted through `p.layer(1 − carCoverAt(F))`, so its paint fades with the front (far face z 6.0 first, flank z 4.2 last) and the bank painted behind shows through; the headlamp glow goes out between F 4.2 and 3.0. A pale hull cover was tried first and left a hard-edged patch, so it was removed.
8. Symptom: the broad `Halos` sky haze greyed the front-mode plates. Fix: `Halos` takes `haze` (default on; the front plates pass off). The window plates are unchanged.
9. Status unchanged: `workaround`. The lower-pane band (item 3) is still an open look item.


## Boss r10 (2026-10-30): keys and scope (SS-R5.1)
10. `storyG` and `STORY_SHIFT` are gone: plates read `storyAt(id, f)` (event key, RK-2 per-shot shift and holds) and `ambientAt(id, f)` (continuous clock for fog drift, see DF-20261030-painted-story-hold-ambient-clock). `frontAt` is a PCHIP through the S02-SH00A keys (14.0 to G390, 1.8 from G516; flat at both ends); `fogAt` is `2·(14 − frontAt)/12.2` on G360–G516 and FS2 from G516. Symptom 5 above is superseded by item 10.
11. Status unchanged: `workaround`. The lower-pane band (item 3) was not measured in r10. The r10 sheets (G360–G533, `out/qa/world-fog/WFOG-EP01-SHORT/r10/`) were viewed and showed no new band, but that is a look check, not a measurement.
