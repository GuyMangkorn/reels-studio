# EDU-EP17-SHORT look frames, set A (W3)

Film, 2026-11-11 (user "วาดเลย", 2026-11-11). Frames: LF01A, LF01B, LF03, LF07 of [film-brief.md](film-brief.md#look-frames-w3-painted-after-this-storyboard-pass-is-on-the-review-page) (EDU-EP17-BRIEF-R2.1, decisions added as R2.2) on the cameras of [storyboard.md](storyboard.md) EDU-EP17-ROWS-R2.1. Set B (LF02, LF04, LF05A/B, LF06) is a separate invocation and is not covered here. Worktree base `88eb2b6`, uncommitted.
Status: painted look frames, **not user-approved**; no viewer check has run yet ([viewer check](../../../docs/sequence-workflow.md#viewer-check) is the coordinator's next step). `review-rows.json`, `task.md`, `storyboard.md` and `delivery.md` were not edited (the coordinator merges both sets). Review page: pending.

## Files

- Look code (look-defining assets in the production owner folder, [look assets](../../../docs/film-visual-brief-workflow.md#look-assets); Boss hardens them): `src/painted/edu17/look-a-map.ts` (palette `LOOK_COL`, `paintL3Look`, `paintMetroLook` with the fill, `paintGlobeLook`, `paintDot`, `fillKey`, `bottomShade`, `discMinus`, `annulus`), `src/painted/edu17/look-a-crowd-top.ts` (`paintCrowdTop`, `new: person-top`).
- Spike entry: `src/painted/spike/edu17-look-a-index.ts` + `Edu17LookA.tsx`, compositions `EDU17-LFA-01A-{a,b,c}`, `EDU17-LFA-01B-{a,b,c}`, `EDU17-LFA-03-{a,b,final}`, `EDU17-LFA-07-{a,b,c}` (1 frame each; not in `src/Root.tsx`). Stills: `printf 'EDU17-LFA-01A-b 0 out.png\n' | node scripts/stills.mjs src/painted/spike/edu17-look-a-index.ts`.
- Store (all `projects/edu/EDU/looks/ep17/`):

  | Still | Store path |
  | --- | --- |
  | LF01A full size | `projects/edu/EDU/looks/ep17/2026-11-11_LF01A-set-a.png` |
  | LF01B full size | `projects/edu/EDU/looks/ep17/2026-11-11_LF01B-set-a.png` |
  | LF03 full size | `projects/edu/EDU/looks/ep17/2026-11-11_LF03-set-a.png` |
  | LF07 full size | `projects/edu/EDU/looks/ep17/2026-11-11_LF07-set-a.png` |
  | The four at 270 px | `projects/edu/EDU/looks/ep17/2026-11-11_LF-set-A-sheet-set-a.png` |
  | Thumbnail options (11 tiles, round 2) | `projects/edu/EDU/looks/ep17/2026-11-11_LF-set-A-thumbs-set-a.png` |

## Measured (clean frames, no captions; `scripts/caption-zone.py --band 1176:1344`, limits mean ≤ 0.25, p95 ≤ 0.40)

| LF | Shot @ frame | Camera | Band mean / p95 | Size checks |
| --- | --- | --- | --- | --- |
| LF01A | SH01 +0 | `gShotCam('S01-B01-SH01', 0)`: K02, h 0.58 km, 1,724 px/km, pp (540, 640) | **0.233 / 0.303 pass** | bowl outer 0.30 × 0.25 km = 517 × 431 px at (540, 640) (by construction); streets 0.014 km = 24 px, avenues 0.032 km = 55 px |
| LF01B | SH06 +55 | `gShotCam('S01-B02-SH01', 55)`, h ≈ 75 km, yaw ≈ 2° | **0.201 / 0.241 pass** | φ(+55) = 0.774 (Bangkok full; Nonthaburi 19.9 km² = 3.1 % of the 636.5 km² ring, the front just over the border, fingers along the Chao Phraya and the highways) |
| LF03 | SH04 +43 | ycam (0, 3.902, 0.08), pitch −89°, f 1000 | **0.183 / 0.384 pass** | the 0.5 m square at crown height y 1.62 m: 219 px, x 430–650, y 833–1052 (storyboard computed 220 px at y 847–1066; 14 px higher because the square sits at 1.62 m, not lower); his crown (540, 941) |
| LF07 | SH22 +170 | `gShotCam('S01-B05-SH01', 170)`, h 7,965 km | **0.242 / 0.337 pass** | disc radius 496.1 px at +170 (h drift ×1.005/s after +90; 500.7 px at +90): inside 500 ± 5; dot 18 px + 2.5 px white rim, pulse ring 2.5 s |

Stand-in values before this pass (Boss SP1): shot 3 map 0.47 / 0.46, h 1,100 0.51 / 0.75, globe 0.37 / 0.73. Band sheets were looked at at 270 px (`out/qa/edu17/lfa/final/LF-set-A-sheet.png`, same as the store sheet).

## Per frame: options, pick, reason

### LF01A (map L3, the K02 patch, SH01 +0)

Options (round 2): **a** street grid north-up, sun; **b** grid turned 24°, sun; **c** grid 24°, warm haze veil.
**Pick b.** The turned grid sends the four crowd-filled avenues into the bowl on diagonals, so the first frame reads "people pouring in" (UT01) instead of a chessboard; the bowl keeps its long axis horizontal for the SH16 match cut (VD10). Haze (c) lifted the caption band to 0.35 and flattened the rooftops.
Look: grey-beige shophouse rows (units 9–15 m, 4 storeys) around every block with a bigger building or a treed yard inside, a few rust, blue-metal and pale roofs, water tanks; shadows west-north-west at 0.7 m per metre of height (sun ESE 55°); an open bowl with concrete rim, slate stands, red track, striped turf; the stands about 55 % full (south and west) with shirt flecks; crowd ribbons filling the four avenue arms (dense near the plaza, ragged speck fronts at the frame edges) and thinner streams in alternate side streets; a khlong between two dark tree belts across y 1157–1364 (the caption band).

### LF01B (map L2 metro, SH06 +55)

Options: **a** outside dimmed, light sea shade 0.25; **b** dimmed outside, shade 0.35 from y 1100; **c** outside a step lighter (`outDim: 'mid'`), shade 0.40 from y 1100, streams on.
**Pick c.** The stage reads in every option (rice-green Nonthaburi and the brown-flecked crowd over Bangkok inside a dashed cream border); c keeps the outside a little lighter so the land around stays land, and puts the whole caption band over a deep Gulf (0.201 / 0.241). Below the band the sea keeps faint current streaks, so the lower third is water, not black (UT03).
Look: deep Gulf `#1d3c4e` with a silty shelf along the coast; outside land dim olive patchwork; Bangkok and Nonthaburi rice and orchard fields with urban grain along the main roads and a grey core; silt-brown Chao Phraya; the crowd `#5a4a42` with flecks in shirt colours over the whole of Bangkok (river included, O5); faint district lines over the crowd ("ทุกเขต" stays readable); the front in Nonthaburi a speck dither; thin streams along the highways outside.

### LF03 (crowd straight down, SH04 +43)

Options: **a** plain; **b** a 22 % dim outside the square; **final** = a plus a lens falloff (0.36 from y 1000 down).
**Pick a + falloff.** The dim in b is a graphic device the shot does not need (the yellow square already finds him); the falloff is the same darkening toward the frame bottom as the map shots and brings the band p95 under 0.40 (0.418 → 0.384) without recolouring anyone.
Look (`new: person-top`): per person, shoulders 0.45 × 0.28 m lit on the east and shaded west, upper arms, the torso and legs as a dark column seen in perspective off the lens axis (people lean out from the centre, as a wide lens straight down shows them), a skin sliver and nose on the facing side, hair, caps, scarves, a monk's shaved head, grey hair; facing mostly north ±70°. Him: mustard tee `#e3b23c`, black spiky hair as 11 spikes, the phone at his chest screen up with the K01 blue dot. Ground in shadow `#26231f`. Grid 0.5 m white 20 %, the square 3 px `#ffd34a` with a soft shadow (brief 2 px: 3 px reads at 270 px), OT03 with a yellow leader up-right.

### LF07 (globe, SH22 +170)

Options: **a** sun upper left (−0.5, −0.87), shade 1.2; **b** sun at 45°, shade 0.8; **c** sun straight up, shade 1.3, more cloud.
**Pick a.** The brief's sun direction; the shade darkens the lower globe under the band (0.242 / 0.337) and leaves the dot side lit (no terminator). b failed the band (0.287 / 0.428); c looked lit from above like a spotlight.
Look: navy space `#0b1430` brightening to `#1d2c54` around the Earth (UT03), 260 stars 1–2 px with a twinkle on the ambient clock; atmosphere glow in four rings of `#8fd0ff`; ocean `#1f5fa8` with a lighter sunward patch; NE 110 m land `#6b8f4e` with soft arid blobs (Gobi, Taklamakan, Tibet, Thar, Arabia, Australia); thin translucent cloud streaks fixed on the sphere and an ITCZ chain; inner limb haze; ten shading layers (`discMinus`, lit disc centred 0.35 r toward the sun). The dot `#2f7df6` 18 px, white rim, `#bfe0ff` pulse ring; OT06 with a leader to (760, 820).

## What Boss must change in the plates (group 3 N3/N4, group 2 N5, globe)

1. **`mapdraw.ts` `MAP_COL` → `LOOK_COL`** (`look-a-map.ts`): replace the BLOCKOUT palette; the Gulf `#1d3c4e` (`gulf`), coast shelf `#24475a` 3.2 km wide and silt `#3a5056` 1.1 km, outside land `#56603f`/`#4d5839` (option c lifts to `#6d7652`), stage rice `#93a463`, `#a6ae6e`, orchard `#6f8a4f`, urban `#b6aa94`, core `#a99d89`, rivers `#7a6f4f` (outside `#4f4a38`), roads `#e2d9c6` (outside `#8b8571`), border `#f4ecd8` dashed 9/6 px 2.2 px wide with a 35 % `#1a1a14` shadow offset 1.6 px, district lines `#e6dcc6` 35 % 1.2 px.
2. **Caption-band shade on every map shot (G)**: `bottomShade(p, 1100, 0.40)` (8 steps of 25 px to `#0c1820`) after the map layers; it is what makes the band pass with the mid-dark Gulf. LF01B passes with margin (0.201); keep it on SH01's end, SH03, SH06–SH09, SH16 and SH22's first half (the globe brings its own shade). Re-measure each shot at W5.
3. **`paintL3Standin` → `paintL3Look`** (`gridDeg: 24`, `light: 'sun'`, `standsFull` 0.55 at SH01 +0, rising with φ if wanted): shophouse rows, inner buildings, shadows (0.7 m per m of height, WNW), trees, the khlong belt at 0.36 km south of K02 (`KHLONG_N`, unrotated, 0.132 km wide, dark trees `#2e4225`/`#354b2b`, water `#2c3426`), the bowl (`BOWL` km table), crowd streams along the four avenue arms and alternate side streets. Cost: about 5,000 polygons at h 0.58; Boss adds a size cull (skip roof details and units under 3 px) for the rise to h 2–6 km.
4. **Fill layer N4** (`paintFill` in `look-a-map.ts`): the crowd base `#5a4a42` over full khet (or the province ring when all are full), partial khet at alpha 0.35 + 0.5 × fraction, Nonthaburi cells as 0.3 km blobs, a speck dither 0.9 km ahead of the front, world-anchored flecks on a 0.55 km lattice (42 % of nodes, 8 colours, 1.1–2.1 px). **`fill.ts` must order the Nonthaburi cells by `fillKey(m, finger)`** (the distance minus a lead of up to 4 km for cells within 0.45 km of the Chao Phraya or a motorway/trunk) so the painted fingers are counted in φ and the area clock stays exact; re-run the SP3 test (77 ± 2 %, front cells near the border < 20 %).
5. **Crowd top N5** (`look-a-crowd-top.ts`, `paintCrowdTop`): becomes `person-top`; keep the three passes (ground, bodies by shoulder height, heads by height), the outfit list `TOPS` (no yellow or mustard anywhere near him), and the `band` option (people whose shoulders project into y 1116–1404 take a mid or dark top; no skin is ever chosen by position). Add the SH04 lens falloff `bottomShade(p, 1000, 0.36)`. The square and grid sit at y 1.62 m.
6. **Globe** (`paintGlobeLook` + `paintDot`): replaces `paintGlobeBase` on the L0 side of `mapdraw.ts` for h ≥ 1,500 km; the shading is sun-relative to pp, so it holds through the shot 22 rise; clouds and deserts ride the sphere. The dot is painted in the canvas, not the DOM `div` of `EDU17-N14-SH22`.

## Decisions (owner: Film; recorded in the brief as R2.2)

1. **Fill total: keep 2,050 km²** (8.2 billion at exactly 4 per m²). Nonthaburi gets 2,050 − 1,566.2 = 483.8 km²: 76.0 % of the baked OSM ring (636.5 km²) and 77.8 % of the official 622 km², both inside 77 ± 2 %. Moving the total to 2,057 km² would tune the model (3.99 per m²) to hit a share in the picture; the brief's tolerance already covers the ring-area difference. The fingers (point 4 above) are inside the same total.
2. **SH11 crouched head: not seen from these frames** (LF03 is SH04 at 2.3 m, where he is unmistakable). From LF03 the colour rule carries over and is decided: his tee is the brief's `#e3b23c` (Boss's stand-in `#d9a21b` was darker), and no yellow, mustard or orange top within 1.5 m of him. Halo or no halo stays open until the SH11 frame is painted; set B does not paint SH11 either, so it falls to Boss's group 2 SH11 frame with Film's frame check.
3. **Province rings from OSM accepted** (Boss's N2 deviation). The rings must match the OSM district lines the fill floods through and give the areas the fill clock uses; NE admin-1 is coarser (Nonthaburi 591.8 km²) and does not meet the district lines. The OSM credit is already required by Q-F1 (a).

## Open

- Viewer check and the user's look of these four frames (coordinator).
- `review-rows.json` `looks` entries for LF01A, LF01B, LF03, LF07 with the store paths above (coordinator merge).
- Paint time not benchmarked on the look code (looks are stills); Boss benchmarks with `scripts/edu17/spike-bench.mjs --entry=src/painted/spike/edu17-look-a-index.ts` before group 3.
- Store folder: the coordinator's path `projects/edu/EDU/looks/ep17/`; earlier episodes used `projects/edu/EDU/look-frames/EDU-EPnn-SHORT/`.
