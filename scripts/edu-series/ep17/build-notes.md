# EDU-EP17-SHORT build notes (Boss)

Brief EDU-EP17-BRIEF-R2.1, rows EDU-EP17-ROWS-R2.1. Worktree base `88eb2b6`, uncommitted. Group order (W5.2 Boss, user 2026-11-11): (1) N1, N2, N14 + SP1-SP3 **done 2026-11-11**; (2) N7 street + N5/N6 crowds + N12 squeezed **done 2026-11-12**; (3) N3/N4 map plate and fill layer; (4) N8 stadium + N9 instrument; (5) N10 atom/loupe + N11 balance + N13 phone map screen.

## Group 1 (2026-11-11): N1 gcam, N2 map bake, N14 labels, SP1-SP3

Everything is structure and data with BLOCKOUT stand-in colours. Film's look frames LF01A-LF07 are not painted, so nothing here is a final look.

### Files

- `src/painted/edu17/geo.ts`: `gcam` (`gProject`, `gUnproject`, `gProjectPath`, `gLerp`), the G shot cameras of shots 1, 3, 6, 7, 8, 9, 16, 22 (`G_SHOTS`, `gShotCam`) and the LOD alphas (`lodAlpha`).
- `src/painted/edu17/map.ts` + baked `map-l0.json` (65 KB), `map-l1.json` (765 KB), `map-l2.json` (611 KB) + `NOTICE.md`; bake `scripts/edu17/bake-map.py`; download `scripts/edu17/fetch-raw.sh` with the three Overpass queries in `scripts/edu17/overpass/`.
- `src/painted/edu17/mapdraw.ts` (flat wash structure painter, stand-in L3), `fill.ts` (SP3 data side of N4), `labels.tsx` (N14), `crowd-standin.ts` (SP2 only).
- Spike entry `src/painted/spike/edu17-spike-index.ts` + `Edu17Spike.tsx` (compositions `EDU17-SP1-CHAIN`, `EDU17-SP1-SEAMS`, `EDU17-SP2-SH04`, `EDU17-SP2-SH11`, `EDU17-N14-SH03`, `EDU17-N14-SH22`; not in `src/Root.tsx`, no `src/videos/edu-ep17`). Tools `scripts/edu17/spike-bench.mjs` (paint-bench with a choosable entry), `scripts/edu17/frame-metrics.py` (globe disc, pop and pair diffs through ffmpeg).
- Tests `tests/edu17-geo.test.ts` (12 tests).

### gcam decisions

- Pinhole on the sphere with nadir (lat, lon), altitude h, f 1000, principal point `pp`, yaw (clockwise); px/km at the nadir = f / h in both regimes (test: 1,724 px/km at h 0.58, 12.5 at h 80).
- Flat (azimuthal equidistant, rho = f R theta / h) up to h 1,500 km, sphere from h 2,400 km, smoothstep(log h) blend between. Past-the-horizon vertices clamp to the limb circle, so a clipped ring closes along the limb arc; a ring wholly past the horizon draws nothing. Limb radius at h 7,860 km = 500.7 px (measured on the still: 501.0 px, brief 500 +- 5).
- Brief scale checks reproduce: Bangkok + Nonthaburi x 81-999 at h 80 (within 25 px; the brief's rounded extents), Thailand y 145 / 1,638 at h 1,100 (within 12 px), K02 roof 517 x 431 px at h 0.58.
- Layer alphas (`lodAlpha`): L3 out over h 2-6 km (storyboard shot 1), L2 out over one decade h 100-1,000, L0 in over h 1,000-1,500 under an opaque L1, L1 out over h 1,500-2,000. Reason for the last two: SP1 seam pairs showed a step when L0 switched on at h 1,500 (its 110 m coast differs from L1's, mean pair diff 0.78) and L1's window closure edges first reach the frame at h 2,085 (shot 22 pp, yaw 3).
- Inverse `gUnproject` round-trips to 0.01 px in flat, blend and sphere regimes with yaw (test).

### Map data (N2)

Fetched 2026-11-11 (raw files in `out/ep17/raw`, outside git; none committed):

| Source | URL | Bytes |
| --- | --- | --- |
| NE 1:110m land | https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson | 138,160 |
| NE 1:10m land | .../geojson/ne_10m_land.geojson | 10,157,965 |
| NE 1:50m admin-0 boundary lines (land) | .../geojson/ne_50m_admin_0_boundary_lines_land.geojson | 760,189 |
| NE 1:10m admin-1 states and provinces | .../geojson/ne_10m_admin_1_states_provinces.geojson | 40,726,851 |
| NE 1:10m rivers and lake centerlines | .../geojson/ne_10m_rivers_lake_centerlines.geojson | 7,307,743 |
| NE 1:10m admin-0 countries (Thailand extent only) | .../geojson/ne_10m_admin_0_countries.geojson | 13,287,234 |
| OSM via Overpass: provinces + 6 amphoe (`q4`) | POST https://overpass-api.de/api/interpreter (query `scripts/edu17/overpass/q4-provinces-amphoe.overpassql`) | 511,849 |
| OSM: Bangkok's 50 khet (`q5`) | same endpoint, `q5-bangkok-khet.overpassql` | 860,112 |
| OSM: motorway, trunk, river ways, bbox 13.45-14.20 N, 100.20-101.00 E (`q6`) | same endpoint, `q6-roads-rivers.overpassql` | 5,409,418 |

Also fetched and not used: NE 1:50m land (1,636,166 bytes; deleted). Overpass `timestamp_osm_base` 2026-11-11T16:17:18Z. A bare curl gets HTTP 406 from Overpass; a generic User-Agent fixes it. Three small id-lookup queries (tags only, 6-27 KB) are not kept.

Results (`out/logs/ep17-bake.log`):
- L0: 127 rings, 4,964 points (one pole ring, Antarctica, flagged `pole: -1`); no clipping.
- L1: 1,066 land rings, 26,390 points (window lon 84-126, lat -12-42, 0.004 deg tolerance), admin-0 lines, Thailand admin-1 lines, rivers. Thailand extent lat 5.630-20.445, lon 97.351-105.651 (brief 5.61-20.46, 97.34-105.64).
- L2: 56 districts (50 khet + 6 amphoe) with 623 deduplicated district ways, 2,767 road ways, 125 river and 972 canal ways, fine coast (2 rings). Boundary tolerance about 9 m.
- Areas (km2, planar at the ring's latitude): Bangkok khet sum **1,566.2** (official 1,568.7), Bangkok land ring 1,566.9, Nonthaburi ring **636.5** = amphoe sum 636.7 (official 622: baked is 2.3 % larger), NE 1:10m admin-1: Bangkok 1,563.0, Nonthaburi 591.8 (coarse, not used for fills).
- Khet union bbox lat 13.491-13.955, lon 100.328-100.939 (brief 13.49-13.96, 100.33-100.94). Anchors MC, K02, M0 lie inside Bangkok, (13.95, 100.42) inside Nonthaburi.
- **Finding, Bangkok's OSM province relation includes a 77 km2 maritime triangle** (two province-only ways down to lat 13.219 at lon 100.454); it drew as a sliver in the Gulf. The baked province ring is the outer boundary of the khet union (ways used by exactly one district), so the triangle is out; its area is kept as `areasKm2.osmBangkokRingWithSea` (1,643.0).
- Deviation from the brief: the province rings are OSM-based, not NE 10m admin-1 (NE kept as `neAdm1` for comparison): NE's coarse polygons do not match the OSM district lines at the borders.

DF-20261030-map-land-clip-closure check (land clipped by Sutherland-Hodgman to a window): the report lists every ring edge lying on the window boundary (>= 0.05 deg). L1: mainland ring has W 23.8 deg, N 40.8 deg, E 4.1 deg edges, seven island rings E edges; L2 coast: one ring with S/W/N/E edges. No polar ring is clipped, so there is no bar of the DF kind. Test `clip closure edges ...` samples every closure edge every 0.25 deg and asserts it is outside the 1080 x 1920 frame on all shot G camera frames and a dense altitude chain (h 100-2,400, pp y 660/820/960, yaw 0/3) wherever L1 alpha > 0. The L2 coast closure edges lie under same-colour L1 land and `coastLines` (outline polylines) carry none of them.

### Labels (N14)

`labels.tsx`: `LBL` (the EP14 component, slot 816-1020 x 148-204), `LBLW` (slot 600-1020 x 148-236, one or two lines, `fade` for the cross-fade from LBL), `LBL2` (slot 60-520 x 160-228), `AnchoredLabel` (picture point + optional `to` + leader line + ring, pop `k`), `GeoLabel` (projects a lat/lon through `gcam`), and the pure `layoutLabel` (clamps into x 24-1056, y 150-1160 and out of the caption band, the channel-mark rect and the three slots; OT06 with `to` (760, 820) is unclamped). OT03 (S space) uses `AnchoredLabel` with a point from `camPoint`. Verified on `EDU17-N14-SH03` (OT01 in LBL-W, LBL2 sample, OT02 at both province centres) and `EDU17-N14-SH22` (LBL, OT06 leader to (760, 820)): `out/qa/edu17/n14/n14_sheet.png`.

### SP1 altitude chain (G; stand-in colours and stand-in L3)

- Frames at h 0.58 / 2.95 / 80 / 1,100 / 7,860 km (`EDU17-SP1-CHAIN` n0 / n30 / n68 / n150 / n296 = shot 1 +0, shot 1 +30, shot 1 +68, shot 8 +81, shot 22 +90): `out/qa/edu17/sp1/sp1_chain_sheet.png` (270 px tiles) and the full-size PNGs beside it.
- Globe radius 501.0 px (vertical and horizontal diameter 1,002 px, `frame-metrics.py disc`): pass (500 +- 5).
- No pop, path test: all 425 frames of the shot 1, 8, 9 and 22 camera paths rendered at paintScale 0.5 (`out/qa/edu17/sp1/chain`); consecutive-frame mean diffs show 0 steps with ratio > 3 and value > 0.4 per segment (`out/logs/ep17-sp1-pops.log`). One isolated 0.19 step at n305 is the limb edge moving under the shot 22 drift (550 px of anti-aliasing change along the limb circle), not a layer change.
- No pop, seam test (the metric that isolates layer changes: static camera, layer alphas sampled at h x 0.995 vs x 1.005): seams h 2, 6, 100, 1,000, 1,500, 2,000, 2,400 km give mean diffs 0.003-0.007 (0-255 scale); non-seam controls 0.003-0.017 except h 1,250 (0.063, inside the L0 fade-in) and h 1,800 (0.127, inside the L1 fade-out): `out/logs/ep17-sp1-seam-diffs.log`.
- Seek parity: the same frames rendered in different orders and runs are byte-different but PSNR 88-116 dB (WebGL dither): `out/qa/edu17/seek`.
- Not covered: Studio scrub (the spike entry was not opened in Studio); the real L3 patch (N3) and Film's colours; frames only at paintScale 0.5 for the pop sweep.
- Caption zone (band y 1176-1344, series metric mean <= 0.25, p95 <= 0.40) on the BLOCKOUT frames: shot 3 map mean 0.47 / p95 0.46; h 1,100 0.51 / 0.75; globe 0.37 / 0.73. They fail because the stand-in Gulf and land are light. Not a verdict on the look; the N3 plate and LF01B need a mid-dark Gulf and southern provinces under the band.

### SP2 crowd density and paint time (S; stand-in specks, person-top N5 and crowd-heads N6 not built)

- Heads and shoulders as wash-only polygons on the 0.5 m lattice (+-0.08 m jitter, seeded), tiers by head radius (>= 10 px 3 polygons, 5-10 px 2, below 1) so far rows are one polygon: `crowd-standin.ts`.
- SH04 (`EDU17-SP2-SH04`, ycam (0, 4.00 -> 3.85, 0.08) straight down, f 1000): a few dozen heads in view, still 0.43 s wall (paint 34 ms). Heads about 100 px; he is the mustard tee with spiky hair inside the white 0.5 m square: findable at 270 px in well under 1 s (`out/qa/edu17/sp2/sp2_sheet.png`).
- SH11 (`EDU17-SP2-SH11`, ycam (0, 4.5, 6.0) look-at (0, 0.6, -4.0)): 5,891 wash polygons (crowd box x +-11 m, z 7 to -52 m), paint 0.93-0.99 s (profiler on), **wall still 1.44-1.50 s** (profiler off, 6 stills; includes about 0.5 s of screenshot and PNG), 0.13 ms per wash polygon in this harness (the DF's 0.04 ms was not reproduced). First try with 3 polygons per head everywhere: 15,225 polygons, paint 2.99 s, still 3.5 s: fail; the tiers fix it.
- Budget left for the real figures: SH11 paint 0.96 s of the 1.5 s, so the 10-14 nearest rig cards must stay under about 0.5 s together, or far rows must get cheaper. SH04 has plenty of room.
- SH11 reads as a packed sea at 270 px, but his crouched head at (540, 1051) is a 6 px mustard dot among identical-size heads: findable only when you know the place. Film may want a halo or a brighter tee for SH11; not changed.
- Not covered: person-top and crowd-heads (group 2), the 10-14 rig cards, Studio.

### SP3 fill clock (data side of N4; `fill.ts`, test `SP3: fill clock keys on the baked rings`)

- phi = filled area / 2,050 km2 (8.2 billion at 4 per m2). Order: khet by distance from the old centre (13.752, 100.502) outward, running area decides the full ones and one partial; then Nonthaburi cells by distance to the Bangkok ring (0.4 km grid, 3,999 cells, area scaled to the ring's 636.5 km2).
- Bangkok full at **phi 0.764** (brief 0.765). Keys: SH01 end 0.03 (Bangkok 3.9 %), SH03 end 0.30 (Bangkok 39.3 %), SH06 end 0.80 (Nonthaburi 11.6 %, front 2.0 km from the Bangkok border), SH07 +48 phi 1.00 (**Nonthaburi 76.0 %** of the baked ring, front 18.1 km from the border).
- Acceptance 77 +- 2 % = 75-79 %: 76.0 % passes but only by one point and below the nominal 77: the baked Nonthaburi ring is 636.5 km2 (official 622). With 2,050 km2 fixed, a 622 km2 ring would give 77.4 %. Decision for Film: keep 2,050 and the baked area (76.0 %), or move the total to 2,057 km2 (77.0 %, density 3.99 per m2).
- Front is an iso-line of the distance to the Bangkok ring: of the 140 cells in the front band 6 (4.3 %) lie within 0.3 km of the Nonthaburi border (test: < 20 %; the iso-line meets the border only at its two ends); the unfilled quarter lies north-west of the filled part; the Chao Phraya samples inside Nonthaburi are all inside the filled cells (> 90 %, test).
- Waits for group 3 (N4): the painted layer (flecks, speck front, streams along the roads, the fill over water), the khet flash on fill; this file has only the numbers.

### What waits for Film's look frames (W3)

LF01A/LF01B (map plate colours, land use, urban grain, the K02 patch L3, the Gulf value under the caption band), LF02 (street), LF04 (atom, loupe, space), LF05-LF07. `MAP_COL` and `paintL3Standin` are placeholders and are replaced in group 3.

### Proposals (rule documents are not edited during production)

- boss-asset-workflow or remotion-toolkit: a "seam pair" check for LOD layers (static camera, layer alpha sampled at two altitudes around each seam) next to the F-1/F/F+1 check; it caught a step the consecutive-frame metric missed.
- dev-findings candidate: Overpass province relations can carry maritime triangles (Bangkok +77 km2); build province rings from the districts' unshared ways.
- dev-findings candidate: wash polygon cost in this harness is about 0.13 ms (DF-20261031-paint-seed-defer says 0.04 ms); budget crowds by polygon count (about 6,000 per second of the frame budget).

### Open questions

1. Fill total: 2,050 km2 (Nonthaburi 76.0 %) or 2,057 km2 (77.0 %)? Film.
2. SH11: his crouched head is hard to find in the crowd; a brighter tee, halo or a taller figure? Film.
3. Province rings come from OSM, not NE admin-1 (see N2 deviation): accepted? Film (no visual impact beyond a more accurate border).

## Group 2 (2026-11-12): N7 street, N6 crowd-heads, N5 person-top, N12 squeezed

Built from the approved look frames (W3, 2026-11-12). Look files `look-b-street.ts` and `look-a-crowd-top.ts` stay as the look record: `look-b-street.ts` now takes `squeezedFig` from `squeezed.ts`; `look-a-crowd-top.ts` is an alias of `paintPersonTop` with the look's own settings (LF03 renders as approved); `look-a-map.ts` takes `bottomShade` from `shade.ts` (same code).

### Files

- `src/painted/edu17/street.ts` (N7): `streetSpec` (tagged world polygons: 20 bays of 4.2 m, four storeys of 3.75 m, house colours, shutters, awnings y 3.0-3.5 reaching 1.3 m, textless signs, AC boxes, plants, laundry on bay x 4.2-8.4 floor 2, poles z -15 every 30 m, three sagging cables, viaduct fascia `#c9c4b8` with shadow line and parapet cap line, optional underside), `paintStreet`, `lookCam`, `pushU` (6 f ease), `pitchScale`, `STREET_SHOTS` (cameras of SH02, SH05, SH10, SH11, SH12, SH15 from the sheet's ycam lines, crowd boxes, lens line, clear radius, falloff), `nearCards` (full kit cards, outfits from `CROWD_OUTFITS`), `paintStreetShot(p, shot, f, {extra})` (set, clothes mass, far heads, nearest 12 cards, Editor's figures via `extra`, falloff). Asphalt is `#5d5a56` (Film's darker ground).
- `src/painted/edu17/crowd-heads.ts` (N6): `crowdHeads`, `paintHead` (tiers 4/3/2/1 polygons by head radius), `paintHeads` (any lens, far to near by depth: usable for SH18-SH20 seat positions in group 4), `paintCrowdMass` (the clothes `#5a4a42` quad at 0.9 m under the far rows), `paintHalo`, `manHead` (spiky hair), `WARM_SHIRTS`, `CLEAR_R` 1.5 / `CLEAR_R_SH11` 3, `CROWD_OUTFITS` (no `park-casual`), seeded bob (`t`, 1 cm).
- `src/painted/edu17/person-top.ts` (N5): `paintPersonTop` (three passes, `band`, `crouch`, `clearWarm`, `cuts`), `paintSh04` (people, grid fading in +0-+10, lens falloff `bottomShade(p, 1000, 0.36)`, square drawing on +12-+24), `sh04Cam`, `squareCorners`.
- `src/painted/edu17/squeezed.ts` (N12): `squeezedFig`, `squeezeK` (+2 to +6), `SQUEEZE`, `NEIGHBOURS`.
- `src/painted/edu17/shade.ts`: `bottomShade` (steps and colour now parameters).
- Check stills: `src/painted/spike/Edu17Group2.tsx` + `edu17-group2-index.ts` (`EDU17-G2-SH05-LF02`, `-SH05-f54`, `-SH02-f2/f40`, `-SH10-f10`, `-SH11-f0/f44`, `-SH12-f3`, `-SH15-f40`, `-SH04-f0/f43/f66`). The MAN and the neighbours in them are check staging only.
- Tests `tests/edu17-street.test.ts` (9 tests); `npm test` 668 pass, `scripts/context-map.py` 0 problems (`out/logs/ep17-g2-npmtest.log`).

### Decisions

- **Caption band (LF02 and every street shot).** Darker ground (`#5d5a56`) plus a deep contact shadow under each near card took LF02 from 0.418 / 0.756 to 0.353 mean, which is not enough: the shins, shorts and white shirts of the near crowd are the bright part. A lens falloff over the band (`bottomShade` in the warm shadow `#15110f`, 20 steps of 8 px, as LF03 and the map shots use) is what passes: SH05 from y 1030 at 0.65, the other street shots from y 1000 at 0.70-0.75. It darkens his lower torso, shorts and the background legs in the band, not his face, phone (y 990) or hands. Alternative if Film does not want the falloff in the plate: Editor's caption treatment (shade behind the captions); then these shots fail the band by plate.
- **Near cards capped at 12** (brief VD03 "nearest 10-14"): the first version drew all ~60 on-screen lattice nodes as full cards (paint 1.66 s, still 2.4 s). The rest of the near nodes are tall head cards (`body` 9 head radii). Paint 0.57-0.64 s.
- **Clear zone** (no yellow, orange or cream shirt): 1.5 m in every street shot, 3 m in SH11, in `crowdHeads`; `person-top` bans the saffron monk top within 1.5 m of him. Full kit cards pick outfits from `CROWD_OUTFITS`; two of them (monk saffron, vendor) can be warm: his cell and his neighbours' two marks are kept free, but a warm card at 0.5-3 m is possible. Not filtered (a kit outfit is not recoloured here).
- **SH11 halo.** Halo, clear zone and tee `#ffc21a` as in the CLEAR variant of set B; his head card gets seven spikes. At 270 px his head is a clear pale pool with a spiky dot in it (`out/edu17/g2/g2_street_sheet.png`, tile 5).
- **pitchScale** is applied to every near card and to his figure and neighbours in the check stills; his head in SH05 @ +15 measures about 340 px (face y 500-840, target 345).
- **Camera pushes** use the sheet's convention (linear with a 6 f ease in and out, `pushU`), not LF02's single smoothstep; at +15 the camera differs by under 3 cm.

### Measured (`out/logs/ep17-g2-caption.log`, `out/logs/ep17-g2-bench2.log`)

| Still | Caption band mean / p95 (limit 0.25 / 0.40) | Wall per still, full size (paint profiler) |
| --- | --- | --- |
| SH05 @ +15 (LF02's shot) | 0.196 / 0.392 pass | 1.33 s (paint 0.64 s) |
| SH05 @ +54 | 0.197 / 0.392 pass | not measured |
| SH02 @ +2 / @ +40 | 0.195 / 0.337 pass | 1.32 s (paint 0.57 s) |
| SH10 @ +10 | 0.169 / 0.324 pass | not measured |
| SH11 @ +0 / @ +44 | 0.186 / 0.324 and 0.188 / 0.324 pass | **1.32 s** (paint 0.71 s), budget 1.5 s |
| SH12 / SH15 | 0.193 / 0.336 pass | not measured |
| SH04 @ +0 / +43 / +66 | 0.188 / 0.389, 0.186 / 0.389, 0.185 / 0.388 pass | **0.68 s** (paint 0.16 s), budget 1.5 s |

Wall times: 6 stills, one Chrome, profiler off (about 0.5 s of each is screenshot and PNG). Sheets: `out/edu17/g2/g2_street_sheet.png` (SH02 @ +2, SH05 @ +15, SH10 @ +10, SH12 @ +3, SH11 @ +0, SH04 @ +43), `out/edu17/g2/g2_sh04_sheet.png`, single frames at 540 px `out/edu17/g2/v_sh05.png`, `v_sh11.png`.

### Finding for Film (R2.2)

- **SH11 sheet pixels vs the sheet's camera.** The sheet says "his head (540, 1051) -> crouched (540, 1092)". The ycam line (pos (0, 4.5, 6.0) -> (0, 4.6, 6.0), look-at (0, 0.6, -4.0), f 1000, hy 960) gives his crown at y 1022 standing and 1063 crouched at +0 (1067 at +44). The 41 px drop matches, the 29 px offset does not. The camera is built from the ycam line; the halo sits on the real head. Film may want to correct the computed pixels.
- **SH10 and SH12 / SH15 band.** The man's torso fills the band; the falloff makes his lower shirt and shorts dark. If Film wants his full outfit read there, the alternative is Editor's caption treatment instead of the plate falloff.

### Kit proposals (for W8.4 kit intake; the kit is not edited)

- `P10-squeezed` or a `squeeze` 0..1 modifier on any chest-hold pose (`poses-more.ts`): hands 3 cm up and 2 cm in, elbows 3.5 cm in and 2 cm up with `behind: 'upper'`, shoulder width x 0.92; the mirrored neighbours are front three-quarter cards at 55 deg (`quarter` fig field). Source: `src/painted/edu17/squeezed.ts`.
- `crowd-heads` (kit `crowd` module): `crowdHeads` + `paintHead` tiers + `paintCrowdMass` + `paintHalo`. `person-top` (kit view `top`): `paintPersonTop` with `crouch` and hair cuts. Source: `crowd-heads.ts`, `person-top.ts`.
- `pitchScale` belongs in the kit's `paintFigureAt` as an option (`pitchFit: true`): every `S` and `T` shot with pitch beyond about 10 deg needs it, and the scene author should not remember it.

### Not covered

- Studio scrub of the new compositions (not opened); no `src/videos/edu17-ep17`, nothing registered in `src/Root.tsx`.
- The MAN poses of SH10-SH15 (jump, crouch) and the neighbours' reactions: Editor stages them through `paintStreetShot`'s `extra`. SH12 and SH15 are static in the sheet but the crowd's jump (everyone leaves the ground with him) needs per-head `crouch`/lift in the heads: `paintHeads` has `crouch` (positive drops, negative lifts) by head, wired for SH11 only.
- Determinism re-render and F-1/F/F+1 seek check of the street frames: not run (stills at one frame each).
- Full-card outfit colours near him (above); NEAR_FULL 12 versus the look's ~60 cards changes the mid rows from full bodies to head cards (visible as taller, plainer figures behind the nearest twelve).

## Group 4 (2026-11-12): N8 SET-STADIUM16, N9 instrument KB, 3 m clear zone

Built from the approved look frames LF05A (pick B), LF05B and LF06 (pick B) and the ROWS-R2.2 cameras. Look file `look-b-stadium.ts` stays as the look record; it now imports `SD`, `standY`, `bowlPt` and `sh19Cam` from `stadium.ts` (LF05B moves at most 3 px, as Film computed).

### Files

- `src/painted/edu17/stadium.ts` (N8): `paintStadiumShot(p, 'SH17'|'SH18'|'SH19'|'SH20', f)`, `STADIUM_SHOTS`, the four R2.2 cameras (`sh17Cam` ... `sh20Cam`), `standY`, `bowlPt`, `bowlD` (inverse), `seatSurfaceY` (true bowl curve), `lensClearance`, `bounceLift` (SH20 peaks +6/+19/+32/+45), `seatHeads`, `thin`, `BAND_SHADE`, palettes `SD`. Day: sky, field with stripes and two plain teams, bowl, roof ring, outer wall, blank video board, near seat head cards and the seven hoodie fans (SH18); SH17 adds a ground plane with a plaza ring and approach roads. Night: bowl with rim light and phone specks, floor crowd (mass strips + specks + nearest 150-260 head cards, bouncing with arms up in SH20), stage, beams, haze, near seat heads. No foreground fans at night, no logo, no performer.
- `src/painted/edu17/instrument.ts` (N9): `paintSh21(p, f)`, `sh21Cam`, `KB` (box, drum, pen, lamp), `traceBurst` / `traceJitter` (the trace's own clock, pure function of sample, line, frame), `KB_SHADE`. Box, well, drum, grid (no numbers), 18 trace lines, brass pen arm, glass lid; the opaque steel faces are drawn after the interior so the drum and pen vanish when the lens drops under the lid at the end of the dolly.
- Check stills: `src/painted/spike/Edu17Group4.tsx` + `edu17-group4-index.ts` (`EDU17-G4-SH17-f0/5/36/46`, `SH18-f0/25/52`, `SH19-f0/24/45`, `SH20-f0/27/58`, `SH21-f2/12/22/38/52/82`). Not in Root; no `src/videos/edu-ep17`.
- `crowd-heads.ts`: `CLEAR_R` 1.5 -> **3** (every crowd shot), `CLEAR_R_SH11` kept at 3. `street.ts`: kit cards inside the clear zone no longer wear the saffron `monk` or cream `vendor` outfit (`WARM_OUTFITS`, next outfit in the list; cards outside the zone unchanged).
- Tests `tests/edu17-stadium.test.ts` (6) and the updated clear-zone tests in `tests/edu17-street.test.ts` (10 now). `npm test` log `out/logs/ep17-g4-npmtest.log`.

### Decisions

- **Cameras as written in R2.2.** SH18 y 33, SH19 (-30, 35.7, 96) -> (-28, 33.6, 93), SH20 (15, 14.2, 52) -> (15, 11.9, 48), SH21 reverse angle with the 6 f eases. Every number the sheet computed reproduces to under 1.5 px: SH20 +0 stage deck (898, 875), back-wall top (976, 622), near floor head (373, 1095), lower-stand head (225, 1278); SH19 +24 truss top (492, 857); SH21 pen +0 (602, 891), +38 (955, 1153), +52 (924, 1092), box top corner +52 (1063, 1072); SH21 start yaw 33.7 deg, pitch -29.0, end pitch +9.7.
- **A17 lens clearance** against the true superellipse bowl (`bowlD`), every frame: SH18 1.824 m, SH19 1.748-1.824 m (the sheet's 1.8 is rounded: 35.7 over 33.88 and 33.6 over 31.85), SH20 1.787-1.796 m; SH17 lens >= 120 m, above the roof (49 m); SH21 outside the box and above the pavement in all 83 frames. Test-covered.
- **SH17 hy.** The sheet gives `f 1000` and no hy, but the match cut wants the bowl at (540, 640) (brief VD10, shot 16 ends pp (540, 640)). With hy 960 the bowl would sit at y 960, so hy runs 640 (hold) -> 960 (end of the crane). Measured at +0: bowl centre y 640, roof edge x 272-808 (**536 px**, sheet 517) and wall base x 293-787 (493 px). The 536 is the approved 88 m bowl geometry (roof edge at 47 m, scale 1,000/533); an exact 517 needs the lens at y 601 instead of 580 (Film/Editor call, not changed).
- **Caption band** (`out/logs/ep17-g4-caption.log`, `scripts/caption-zone.py --band 1176:1344`): the darker grounds as asked, plus the series falloff (`bottomShade`) where a ground alone was not enough. LF05A (SH18): seat rows and fans darkened by the falloff y0 1000, amount 0.62 (a lighter 0.52 gave 0.289 / 0.455 and fails). LF06 (SH21): pavement `#4a4a50` -> `#34343a` under the box, `#26262c` elsewhere, steel `#7d868c` -> `#6f777d`, falloff 0.5. SH17 sits on light ground (0.51 mean unshaded): falloff 0.78. SH20 falloff 0.5. SH19 needs none.
- **Paint budget.** Crowd flecks never cover more than 22 % of a quad's screen area at a minimum 3.2 px blotch over a crowd-coloured base; head cards only within about 5-14 m (thinned beyond); the floor crowd is thinned by screen spacing and its nearest 150-260 heads are cards, with a clothes mass under them. Polygons: SH17 3,710, SH18 4,777, SH19 5,061, SH20 8,487.
- **Arms up (SH20).** Two-thirds of the card heads get two sleeve quads (hand dots when the head is >= 6 px radius), lifted with the bounce; the kit P08 card is not used (too slow for 100+ heads). Day fans (SH18) are the kit hoodie cards with P08 and P01, as in LF05A.
- **3 m clear zone.** `crowd-heads` heads and the near kit cards respect 3 m in SH02, SH05, SH10, SH11, SH12, SH15. `person-top.ts` (SH04) still bans the saffron top within 1.5 m (`clearWarm` default); group 3 owns that file this pass, so it is not changed (open question 2).

### Measured

| Still (full size, one Chrome, `spike-bench.mjs`) | Caption band mean / p95 (limit 0.25 / 0.40) | Paint profiler ms / wall ms (3 runs, load average 4-6) |
| --- | --- | --- |
| SH17 @ +0 / +36 | 0.188 / 0.230, 0.172 / 0.213 pass | 141 / 795, 813 / 1,720 |
| SH18 @ +25 (LF05A) | 0.219 / 0.341 pass (as painted 0.379 / 0.608) | 1,180 / 2,040 (1,260 wall and paint 613 on a quiet machine) |
| SH19 @ +24 (LF05B) | 0.197 / 0.283 pass | 1,186 / 1,470-1,980 |
| SH20 @ +27 | 0.189 / 0.257 pass | 734 / 1,290 |
| SH21 @ +12 (LF06, reverse angle) | 0.217 / 0.270 pass (as painted 0.327 / 0.34) | 48 / 440 |
| SH21 @ +52 | 0.166 / 0.337 pass | 48 / 460 |
| SH02 @ +2, SH05 @ +15, SH11 @ +0 (3 m zone) | 0.195 / 0.337, 0.196 / 0.392, 0.186 / 0.324 pass | not re-timed |

Every other frame of the check set (SH17 +5/+46, SH18 +0/+52, SH19 +0/+45, SH20 +0/+58, SH21 +2/+22/+38/+82) also passes (log). Paint is under the 1.5 s budget in every still; wall time includes about 0.5 s of screenshot and PNG and, in this table, a busy machine (the parallel group 3 run). Field and far stands in SH18 sit at y 534-1112 (field near edge y 1113, far crest y 534), above 1160; the foreground seat rows and fans below are the darkened part. Sheets: `out/edu17/g4/g4_stills_sheet.png` (SH17 +0, SH17 +36, SH18 +25, SH19 +24, SH20 +27, SH21 +12, SH21 +52, SH21 +38), `out/edu17/g4/g4_g2_recheck_sheet.png` (SH05 +15, SH11 +0, SH02 +2 with the 3 m zone), single frames `out/edu17/g4/SH*.png`, 540 px views `out/edu17/g4/v_sh18.png`, `v_sh21_f12.png`, LF05A/B and LF06 look references `out/edu17/g4/ref/`.

### Not covered

- Studio scrub of the new compositions; determinism re-render and F-1/F/F+1 seek check of the stadium frames (stills at single frames; the recording-brush test shows repeatable polygons).
- SH17 wall and roof from outside are flat grey with alternating rib shade; no signage, no concourse windows (no text by design). The ground around the bowl is a plain plaza, not the map plate's L3 neighbourhood: the cut from SH16 shows the G map's streets for 5 f of hold only if Film wants them matched.
- SH21 lens drops below the glass lid at about +38 (y 0.911 at +38, 0.75 at +52): the pen and drum are not visible after that, the steel box hides them. The sheet lists "pen (924, 1092) seen through the lid" at +52; the geometry says the lens is under the lid, so the pen tip projects to that pixel but is hidden behind the box wall. Film to confirm that the end hold shows the box and street only.
- The bounce does not move the lower-stand head cards' shoulders, only the heads; no per-person crouch. Phone lights bob with the floor specks only.
- Instrument sound, stadium sound and the SH20 four-bounce S15 cue are Editor/Ton work.

### Proposals (rule documents are not edited during production)

- Kit intake (W8.4): `new: SET-STADIUM16` (`stadium.ts`) and `new: instrument KB` (`instrument.ts`); `crowd-heads` thinning helper `thin`.
- dev-findings candidate: p5.brush paint cost tracks polygon count only loosely: night shots with the same 5k polygons cost 2x a day shot's wall time under load; always bench with 3 runs and note the load average.

### Open questions

1. SH17 bowl outline 536 px vs the sheet's 517 px (see decision above): accept, or lens y 601? Film.
2. `person-top.ts` default `clearWarm` 1.5 -> 3 for SH04 (the only crowd shot still at 1.5 m). Group 3 / next invocation, one-line change.
3. SH21 end hold hides the pen behind the box (lens under the lid). Film.

## Group 3 (2026-11-12): N3 map plate in the look palette, N4 fill order, production stills

Looks LF01A / LF01B / LF07 user-approved 2026-11-12. Scope: map plate (mapdraw.ts), `paintL3Look`, `paintGlobeLook`, canvas dot, fill order (fill.ts), stills of SH01, SH03, SH06, SH07, SH08, SH09, SH16, SH22.

### Files
- `src/painted/edu17/mapdraw.ts` (rewritten): `LOOK_COL` replaces `MAP_COL`; `paintMapPlate`, `plateFor(shot, f)` (per-shot fill clock, streams, shade, L3 options), `bandShade(h)`, `globeMix`, `dotMix`, `paintDot` in canvas (the DOM dot of N14 SH22 is gone).
- `src/painted/edu17/look-a-map.ts` (look code hardened, not redesigned): batching by colour, size culls, `paintFill` exported, L3 options `solid`/`fade`.
- `src/painted/edu17/batch.ts` (new): `makeBatch()`, groups polygons by colour and draws them on flush.
- `src/painted/edu17/fill.ts`: Nonthaburi cells sorted by `fillKey(m, finger)`.
- `src/painted/spike/Edu17Group3.tsx` + `edu17-group3-index.ts`: `EDU17-G3-SH01 ... SH22` (frame = shot-local frame; inputProps `shade`/`shadeFrom` for sweeps). Not in Root.
- `scripts/edu17/g3-measure.py` (bowl, limb, dot, match), `tests/edu17-map.test.ts` (8 tests), `tests/edu17-geo.test.ts` (SP3 test updated for key order). `docs/context-map.md` EP17 row.

### Decisions
- Paint time was the main problem (2-4.6 s). p5.brush flushes its polygon queue on every colour change, so every layer draws through `makeBatch` (about 50-70 colour changes a frame instead of about 10,000). Z-order inside one colour group changed slightly (trees highlight pass, fields); no visible change against LF01A/LF01B.
- Culls by apparent size while the camera rises (`coarse`, `ultra`, `lite`), fields fade under 9 px/km, off-frame dashes dropped.
- Caption band shade is per shot (`plateFor`): 0.40 over the Gulf shots (approved), 0.50-0.60 for SH03/SH07/SH08/SH09 land and crowd, `bandShade(h)` 0.9 at the start of a rise or end of a dive, globe shade 0.85 x globe mix (group 3 found a step at h 1,000 when it was not scaled by the mix: SH08 +54 -> +56 diff 9.9, ratio 3.1; fixed).
- Fill: total 2,050 km2, Nonthaburi 76.0 % at SH07 +48, Bangkok full at phi 0.764 (test).

### Measured
- Paint (spike-bench, profiler on, 1,080x1,920): SH01 642 ms mean (3 frames), SH03 875 (max 893), SH06 926 (max 949), SH07 785 (max 965), SH08 609 (max 941), SH09 486 (max 748), SH16 667 (max 1,014), SH22 300 (max 1,017). All <= 1.5 s. Polygons 11,000-18,700 a frame, 46-69 colour changes. Logs `out/logs/ep17-g3-bench-*.log`, `out/bench/g3/`.
- Caption band 1176:1344 (15 stills, `out/logs/ep17-g3-caption3.log`): all pass, mean 0.145-0.244, p95 0.205-0.382.
- Bowl (SH01 +0 and SH16 +47): 518 x 432 px (sheet 517 x 431). Globe radius SH22 +170: 496.5 px (limb 497/496/497/496; target 500 +-5). Dot: 18 px wide through the centre; vertical run is cut by the highlight, so 18 px across (crop `out/edu17/g3/dotcrop_s.png`).
- SH01 +0 vs SH16 +47 (box 0:0:1080:1176): mean abs diff 11.1 (same bowl position and size; the difference is the crowd flecks).
- Pops (`frame-metrics.py pops`, ratio > 3.0, `out/logs/ep17-g3-pops2.log`, `-pops3.log`): SH01 every frame, SH16 every frame, SH08/SH09 every frame, SH22 every 3rd: 0 candidates after the globe-shade fix. The largest steps are the rise itself (SH01 +12 -> +13 diff 44.5, ratio 1.9; SH16 +40 -> +41 45.6, ratio 1.9): fast camera, not a layer switch.
- Seam pair check (`out/logs/ep17-g3-seam-diffs2.log`): seams h 2, 6, 100, 1,000, 2,000, 2,400 km 0.0025-0.0072; h 1,500 0.68 and controls h 1,250 0.93, h 1,800 0.22, h 300 0.20, h 30 0.09. Cause: the globe look now crossfades over the flat map between h 1,000 and 2,000 (group 1 had only a patch), so a 1 % altitude step moves a continuous crossfade. Reading: smooth blend, not a switch; the consecutive-frame pop check above is the effective test.

### Findings
- DF candidate: p5.brush polygon cost is dominated by colour changes; group by colour before drawing (0.13-0.19 ms a polygon scattered, about 0.04 ms batched).
- Bottom shade layers that depend on camera height must be scaled by the layer mix that replaces them, or they step when the replacing layer starts.

### Not covered
- SP2 stills of SH04/SH11 were not re-rendered (group 2 scope). Mid-rise h 6-40 km look (L3 gone, L2 not yet legible) was checked on the SH01 frames +17..+41 only; Film may want a look pass.
- Two transit frames (SH01 +12, SH16 +40) exceed p95 0.40 in the rise (mean passes); they last one frame each.
- Editor has not integrated these shots; no `src/videos/edu-ep17`, no Root registration.

### Open questions
1. Film: shade 0.50-0.60 on SH03/SH07/SH08/SH09 against the approved 0.40 (LF01B measured at 0.40 over the Gulf): accept?
2. Film: SH16 +0 (the map) vs +47 (the bowl match) wording in the storyboard row.
3. Kit proposals: `makeBatch` (colour-batched polygons) for `src/painted/kit/draw`.

## Fix pass A (2026-11-12, Boss): B1 SH04 clear zone, B2 SH17 start lens, B3 SH21 end pose (BRIEF-R2.4)

- **B1** `person-top.ts`: `clearWarm` default 1.5 -> **3** (SH04). Test in `tests/edu17-street.test.ts` now asserts no saffron polygon in a 2.1 m box (inside the 3 m circle) with the default, and that the saffron top exists when `clearWarm: 0`. Stills `out/edu17/fixA/SH04-f0/f43/f66.png`; caption band mean/p95 0.188/0.389, 0.186/0.389, 0.185/0.388 (limit 0.25/0.40) pass. Paint 161 ms (wall 610 ms, 2 runs).
- **B2** `stadium.ts` `sh17Cam` start 580 -> **601** m (hold to +5, crane unchanged; hy 640 -> 960 unchanged). Roof edge at +0 (d 88, y 47) projects to x 282 / 798 = **516 px** (target 517 +-3); pixel row 640 of `out/edu17/fixA/SH17-f0.png`: roof begins x 282, outer rim ends x 797-798 (516 px). Wall base 476 px, apron outer edge (d 104) 529 px, y 426-854. SH16 +47 plate bowl (`g3-measure.py bowl out/edu17/g3/sh16_p47.png`) is 518 x 432 px, x 281-798, y 424-855: the apron outline matches SH17 +0 within 2 px in x and y. `g3-measure.py match` gives mean abs diff 42.3 over the top 1176 rows, because the SH16 plate and the SH17 plaza are different paintings (grey plaza and bowl vs map plate); the 11.1 in Group 3 was SH01 +0 vs SH16 +47 (same plate). Caption band SH17 +0: 0.188 / 0.230 pass. (`g3-measure.py bowl` returns null on SH17: it keys on the map plate rim colour, not the stadium roof.)
- **B3** `instrument.ts` `sh21Cam`: end pos **(-1.20, 1.50, 148.80)**, end look-at **(4.0, -3.0, 118)**; start and timing unchanged. End pitch -8.2 deg. Pen tip at +38 (813, 1062), +52 and +82 (788, 1034); box top right corner +52 (914, 1031). Tests (`tests/edu17-stadium.test.ts`): lens > lid + 0.1 m in all 83 frames; the sight line to the pen tip crosses the glass lid inside its rectangle and clears the steel front top edge (y > 0.9) in all 83 frames; pen tip and drum centre on the picture in all 83 frames; the old +38/+52 pixel pins and the end pitch pin were replaced by the new numbers. Stills `out/edu17/fixA/SH21-f38/f52/f82.png` (+ f12), sheet `out/edu17/fixA/sheet-sh21.png`: caption band 0.196/0.338, 0.175/0.270, 0.175/0.270 pass without changing the ground. Paint 44 ms (wall 456 ms). The pen and drum are visible through the lid to the end; the wall top leaves the frame (accepted).
- Sheets: `out/edu17/fixA/sheet-sh21.png`, `out/edu17/fixA/sheet-sh04-sh17.png`. `npm test` log `out/logs/ep17-fixA-npmtest.log`.
- Not covered: Studio scrub, F-1/F/F+1 seek check, SH16 +47 re-render (map files are being rebuilt by another Boss pass; the 518 x 432 figure is from the group 3 still).

## Group 5 (2026-11-12): N10 atom + loupe + speck ring, N11 balance, N13 phone map screen

Built from the approved look frames LF04 atom pick B and LF04 balance pick A (`look-b-space.ts` stays the look record and still supplies `paintSpace`, `paintAtom`, `paintEarthBall`, `SP`) and the ROWS-R2.3 clocks of shots 2, 13, 14, 15.

### Files
- `src/painted/edu17/space.ts` (N10 + N11): `paintSh13(p, f)` (limb +0-+22, loupe +22-+36, atom to +92), `paintLimb`, `loupeAt`, `atomGeo`, `paintAtomGlass`, `paintLoupeRim`; `paintInset(p, f)` + `insetAt`/`insetSpeck` (SH15); `paintBalance(p, f)` + `beamAngle`/`balanceGeo`/`panSway`/`pushAt` (SH14); `paintMarkerRing` (one ring style: 5 px `#ffd34a`, 2 px `#1a2140` keyline, 6 px glow, `sweep` draw-on, `alpha`); `clipTo`/`clipPoly` (circle clip as a painter wrapper: polygons cut to the loupe circle).
- `src/painted/edu17/phone-map.ts` (N13): `paintPhone` (body + screen), `paintPhoneScreen`, `paintScreenDot` (the K01 dot alone), `heldPhone` (a `held` prop for `paintFigureAt`, MAN's back, P10), `screenQuad`, `pulseAt`. Textless map in screen uv mapped onto the quad, so it scales from 35 px to a close-up.
- `src/painted/spike/Edu17Group5.tsx` + `edu17-group5-index.ts`: `EDU17-G5-SH13-f0/21/26/30/36/40/45/60/72/92`, `SH14-f0/6/10/14/30/64/89`, `SH15-f24/30/40/50/66` (street SH15 + inset), `SH02-f2/28/42` (street + MAN back + phone), `PHONE-t0/t10`. Not in Root; no `src/videos/edu-ep17`.
- `tests/edu17-space.test.ts` (6). `npm test` log `out/logs/ep17-g5-npmtest.log` (the only failure there was the context-map check, fixed afterwards: `scripts/context-map.py` 398 modules, 0 uncovered).

### Decisions
- **Loupe by clipping.** The loupe glass is the atom picture painted through `clipTo` (a Proxy over the brush that clips every polygon to the circle), over the still limb picture; at open = 1 the glass covers the frame (r 1,260 from the centre (540, 960)) and the limb is not painted at all. The circle travels from the patch (540, 600) to the frame centre while the glass magnifies 0.05 -> 1. The SH15 inset uses the same clip over the street, so it is opaque (a loupe disc) and must be painted after the street.
- **Marker ring** is the R2.2 style everywhere: limb patch 44 px, atom 44 px x push, pan 52 px, inset 44 px. It draws on clockwise from the top +40-+45 in SH13 (3 px speck grows in +45-+47, leader after the sweep), fades +46-+60 in SH15.
- **Balance clock.** Level +0-+2; slam +2-+10 with `u^2.2` (accelerating) to the 28 deg stop; "2 deg overshoot" read as the beam swinging 2 deg past the stop (30 deg at +14, a half sine) and settling to 28 by +18 (open question 1). Crowd pan sway 14 px decaying to 0 by +40, Earth pan 3 px to +22; push 8 % from +41 about the crowd pan (895, 640).
- **SH02 dot after the falloff.** `paintStreetShot` applies the lens falloff (`bottomShade`, y0 1000, 0.75) after the staged items, which dims the phone (y about 1,100) by roughly half. `paintScreenDot` is painted again after the shot so the K01 blue keeps its colour; Editor does the same (spike `Edu17Group5.tsx` shows the order). The dot is 6 px, white rim, pulse 2.5 s, the globe dot's colours (`LOOK_COL.dot`).
- **Phone staging.** Screen 0.07 m wide (35 px at the SH02 camera, 1 : 2), tilted -10 deg with an 8 % taper, centred at his right shoulder + (0.07 u, -0.2 u): the dot lands at (452, 1097) in SH02 +2 (sheet: phone about (430, 1085); the figure's head sits at x 348, the sheet's 310). The forearm and a hand wrap the phone.
- **Caption band** shades: SH13 limb `bottomShade` y 1000 amount 0.62 (0.5 gave 0.303 and fails), atom glass y 1000 0.7, balance y 1100 0.45 drawn under the brass so the column and base keep their light.

### Measured
- Caption band `1176:1344` (`out/logs/ep17-g5-caption.log`, 25 stills): all pass, worst mean 0.233 (SH13 limb), worst p95 0.337 (street frames SH02/SH15, same as group 2); SH13 atom 0.093 / 0.114, SH14 0.152 / 0.167.
- Paint (spike-bench, profiler on, 3 runs, load average 4.7-7.2, `out/logs/ep17-g5-bench.log`): SH13 +26 100 ms, +30 104, +72 80; SH14 +30 56, +89 54; phone close-up 19; SH02 +2 1,076 and SH15 +40 1,100 (both the group 2 street; the phone and inset add under 50 ms). All <= 1.5 s.
- Pixels: dot in SH02 +2 / +28 6 px wide (x 450-455 / 451-456); ring outer diameter incl. glow and keyline: SH14 57 px (52 + 5), SH13 +72 51 px (44 x 1.06 + 5), limb patch 50, SH15 49.
- Sheets: `out/edu17/g5/g5_stills_sheet.png` (18 frames), `out/edu17/g5/g5_space_sheet.png` (12), individual stills `out/edu17/g5/*.png`.

### Not covered
- Studio scrub of the compositions; F-1/F/F+1 seek check (the recording-brush test shows the phone is polygon-identical on a repeat, and every clock is a pure function of f).
- SH13 +0 limb and +22-+36 loupe pop check (`frame-metrics.py pops`) was not run; the loupe frames were read on stills only.
- SH15 inset content is the hero atom's lower edge, two dimmed neighbours and the speck: a blue ball at 270 px (no surface line); Film to confirm it reads as "the atom" or ask for the ground rows as in shot 13.
- The man's pose in the SH02/SH15 stills is Boss's check staging; Editor stages the real MAN.
- Sound (S10 glass shimmer +22, S11 tink +45, S12/S13 balance hits, S14 landing) is Editor/Ton work.

### Open questions (Film)
1. Balance overshoot: the beam passes 2 deg beyond the 28 deg stop (30 deg at +14) and settles; or should it rebound short of the stop (26 deg)? The sheet says "2 deg overshoot".
2. SH15 inset: accept the ball-with-speck read, or ground rows inside the glass?
3. SH02: the phone dot is repainted after the falloff (undimmed against the dimmed phone): accept as the K01 reveal, or keep it falloff-dim?

## Fix pass B (2026-11-12): mid-rise map look h 2-80 km (BRIEF-R2.4 B-MR1..B-MR5)

Scope: shots 1, 9, 16 (shot 9's last frames). Not touched: person-top, stadium, instrument, crowd-heads, look-b, group 5, shared docs.

### Files
- New `src/painted/edu17/builtup.ts` (tone, grain, 55 m raster), `src/painted/edu17/map-landuse.json` (956 KB, `MAP_LANDUSE` in `map.ts`), `scripts/edu17/bake-landuse.py`, query `scripts/edu17/overpass/q7-landuse.overpassql`; NOTICE.md carries the OSM credit and ODbL licence for the new file (same credit "© OpenStreetMap contributors").
- `look-a-map.ts`: `armStreams` (the L3 avenue code, now shared), `paintStreamPass` (replaces the old metro `streams`), skeleton floors and over-fill skeleton in `paintMetroLook`, `MetroOpts.builtUp`, `L3Opts.noStreams/t`, `LOOK_COL.crowdLit`. `mapdraw.ts`: draw order, `PlateOpts.solid`, `plateFor` for shots 9 and 16, `bandShade`. `geo.ts`: `LOD.l3` [2, 6] -> [2, 5], L3 alpha curve `(1 - ramp) ** 1.7`. Tests: `tests/edu17-map.test.ts` (4 new), `tests/edu17-geo.test.ts` (l3 seam 5 km).

### Decisions
- **B-MR1 data**: OSM `landuse` residential/commercial/industrial/retail baked (q7, 13,816 rings seen, 5,668 kept: centroid in Bangkok or Nonthaburi, at least 1 ha, 22 m simplification, holes dropped): 565.6 km2 of 2,203. OSM land use is patchy in Bangkok, so the stated fallback is unioned in: the 31 khet with centroid within 15 km of MC (622 km2) and Mueang Nonthaburi, drawn at 0.55 weight under the land use; union raster 996 km2. Tone `#a39a8c`, roof flecks from `BUILT_COL.flecks` (the L3 roof palette), 2.6-4 px, about 5,000 on screen: a world-anchored lattice (20 m x 2^j), two neighbouring octaves cross-fade, flecks picked by hash rank so none swim. The old road-ribbon `urban` placeholder gives way to the tone (x (1 - weight)); it is back at h >= 60.
- Weight: in over h 2-3.2, 1 over 3.2-**30** (Film said 20: at +51, h 44, the city still has to read), log fade to 0 at h 60. A full Bangkok (phi >= 0.764) skips its own tone and grain (the crowd fill covers it): -5,000 polygons on shots 9 and 16.
- **B-MR2**: L3 out over h 2-5 (was 2-6), with the faster curve; the grain is in by h 3.2. At h 2.9 (+30) the grid is still the dominant texture but the tone and grain lie under it; no frame is bare grid.
- **B-MR3**: river floor 5 px, motorway/trunk 2.2 px, road tone `#5c5548` (darker than the grey) from h 2 to 40, easing back to the LF01B river 2.2 px, 1.2 px and light road by h 72. Over a full-fill city (shots 9, 16) the river (`#2c261c`) and highways (`#d8cdb6`) are drawn again over the crowd.
- **B-MR4**: one stream pass above L3 and L2 at full weight (`paintStreamPass`): below h 2 the L3 layer draws the arms as before, from h 2 the pass draws the same arms (same code, widths floored at 10 px, side streets while 0.012 px/km >= 1.4 px, fading out h 8-25) plus the OSM motorways and trunks (all 6,178 vertices; ways oriented toward MC; ribbon floor 12 px motorway / 8 px trunk, original 2.6 px at h >= 72; at 270 px a 12 px ribbon is 3 px; flecks every 100 m shown by rank, drifting toward MC at 0.35 of a way per second, toward the bowl on the arms at 0.16). Shots 9 and 16 pass `solid: 1`: all paths open, lit crowd ribbon `#97796a`, flecks static, weight x (1 - ramp h 40-72) so the filled map at h 80 is unchanged. Floors are above the brief's 3 / 5 px because the check is at 270 px.
- Band shade: `bandShade` attack 0.582-0.61 (was 0.64), the 0.9 -> 0.5 easing over h 25-80 (was 12-80); shot 9 takes max(0.6, bandShade). This fixed the two prior single-frame p95 misses (SH01 +12 p95 0.448 -> pass; SH16 +40 0.458 -> pass).

### Measured (stills `out/edu17/gb/`, logs `out/logs/ep17-gb-*.log`)
- Sheet B-MR5 (shot 1 +25, +30, +35, +41, +45, +51, then shot 16 +15, +20, +25, +30; row 1 left to right, row 2 the rest): `out/edu17/gb/BMR5_sheet.png`; before: `out/edu17/gb/base_sheet.png`.
- Unchanged: shot 1 +0 vs before mean abs diff **0.003**; shot 3 +0/+43/+77 0.27/0.27/0.27, shot 6 +0/+55/+84 0.27/0.21/0.21, shot 7 +0/+4 0.16/0.16 (limit 3): `ep17-gb-unchanged.log`, `out/edu17/gb/BMR5_unchanged_sheet.png` (first six = new, last four = before).
- Pops (`frame-metrics.py pops`, every frame): SH01 68 steps, SH09 54, SH16 47: **0 candidates** (largest ratios 2.03, 1.27, 2.58 = the rise itself): `ep17-gb-pops.log`.
- Paint (spike-bench, profiler on, every 2nd frame): SH01 mean 754 ms max 1,175 (+54), SH16 mean 845 max 1,322 (+10), SH09 mean 663 max 1,271 (+32); all <= 1.5 s (`ep17-gb-bench-*.log`, `out/bench/gb/`). First try: grain spacing 14 px gave 33,500 polygons and 1.74-1.91 s; 21 px and the full-Bangkok skip fixed it.
- Caption band 1176:1344, all 172 frames of shots 1, 9, 16: max mean 0.245, max p95 0.394, **0 fails** (`ep17-gb-caption.log`). First pass had 15 fails at +45..+54 (grey land under the band); fixed by the shade easing.
- `npm test` 694 pass; `tsc --noEmit` reports no edu17 error (other errors predate this pass).

### Not covered / limits
- No Studio scrub; no seam-pair test rerun (L3 window and curve changed: lodAlpha(2).l3 = 1 and lodAlpha(5).l3 = 0 are tested; the pop sweep above covers h 2-5 on all three shots).
- Shot 1 +30 (h 2.9) still reads mostly as the block grid with tone and grain under it; hand-over is in the numbers (L3 alpha 0.46 there), Film to judge on the sheet. Shot 16 +15..+30 is the dark crowd fill by design; the structure there is the river, highways, solid-crowd paths.
- The flecks drift toward MC only in shot 1 (shot 9/16 are static solid crowd). Shot 8 (45 -> 1,100 km) streams stay off (not in scope).
- OSM landuse holes (parks inside residential) are painted over; some Bangkok landuse mapping is thin, so the fallback districts carry the inner city at 0.55 weight. Pixel samples of the fallback shape show district edges at h 3-10 km.

### Open questions
1. Film: built-up weight kept at 1 to h 30 (not 20); L3 out over h 2-5 with the 1.7 power curve: accept?
2. Film: stream ribbons at 12 / 8 / 10 px floors (3 px at 270 px) heavier than the brief's 5 / 3 px: accept, or thinner?
3. Rule documents: storyboard shot 1 still says L3 -> L2 over h 2-6 km; B-MR2 and this build use 2-5.

## Fix pass C (2026-11-12, Boss): SH14 rebound short, SH15 inset shows shot 13's atom row (BRIEF-R2.5)

### Files
- `src/painted/edu17/space.ts`: `beamAngle` (28 -> 26 -> 28 half sine over +10..+18, `28 - 2 sin(pi (f-10)/8)`, low point 26 at +14, never above 28); `paintAtomGlass` gained `marks` (false = no speck/ring/leader) and `clipAt` (clip circle centre, default the picture centre); `INSET`/`insetSpeck`/`paintInset` rebuilt on `paintAtomGlass`. Test `tests/edu17-space.test.ts` SH14 now asserts max angle 28 and 26 +-0.1 at +14. Spike `Edu17Group5.tsx`: `SH14-f18` and a frame-driven `SH13-F` (Remotion frame = shot-local frame) for the pops sweep.
### Decisions
- Inset picture = shot 13's +92 state (push 1.06, the rows, neighbours, ground) at scale 0.35 (hero 126 px), placed so the settled speck point on the hero's lower edge sits at the disc centre (850, 430). `INSET.hero`/`R` are derived from that placement; the speck keeps its clock (hangs 34 px off, slides back +36-+46, ring fades +46-+60), 44 px ring, 1.6 px speck. "Centred on the hero's lower edge" and "speck path unchanged" cannot both hold in screen position (the old path ended 97 px below the disc centre), so the speck path is the same shape and clock translated onto the disc centre; hero now sits in the upper half of the disc, the row beneath in the lower half.
### Measured (`out/edu17/gc/`, logs `out/logs/ep17-gc-*.log`)
- Sheet `out/edu17/gc/gc_sheet.png` (SH14 +10, +14, +18; SH16 +47; SH15 +24, +30, +40, +50, +66); crops `out/edu17/gc/crops.png` (SH15 +30 / +50 inset at 340 px, before the final centre fix on the rim only; stills re-rendered after). At 270 px the inset reads as shot 13's atom row (bright hero, two side neighbours, row beneath) with the ring visible on the hero's edge; +24 (inset 25 % open) is the opening ball.
- Caption band 1176:1344: SH14 mean 0.152 / p95 0.167; SH15 0.194 / 0.337 (all five frames); SH16 +47 0.236 / 0.317; all pass.
- Paint SH15 +40 (spike-bench, profiler, 3 runs): 653 ms (limit 1.5 s).
- Pops on SH13 +0..+36 (`frame-metrics.py pops`, 36 steps): 0 candidates; max step 12.5 (+28->+29, ratio 1.14) is the loupe opening (`ep17-gc-pops.log`).
- `tests/edu17-space.test.ts` 6 pass; no tsc error in space.ts or Edu17Group5.tsx.
### Not covered
- Studio scrub, seek F-1/F/F+1 (inset and beam are pure functions of f), full `npm test`, context-map check (no file added).
- SH15 +24 inset mid-open reads as a small dark ball.

## Fix pass D (2026-11-12): stadium crowd flicker (SH17 end, SH18 start; SH19/SH20 same causes)

Files: `src/painted/edu17/stadium.ts`, `tests/edu17-stadium.test.ts`, new `scripts/edu17/crowd-churn.ts` (no cameras, timing or look changed; `look-b-stadium.ts` is look-frame code for LF05 and not used by the production shots, untouched).
Causes found (the brief's guesses were secondary; the first two were the main ones):
1. `paintBowl` seeded each stand quad's paint and flecks by its position in the per-frame depth sort (`1000 + k`, `20000 + k * 300`); the sort order changes as the camera moves, so every swap reseeded whole quads (SH17 crane, SH18 +0..). Now the id is `seg * 16 + ring`.
2. `seatHeads` and `lowerStandHeads` laid their lattice from the camera x (`x0 = c.x - 9`), so the whole crowd slid and re-hashed each frame (SH18 x -10 -> 4; SH19; SH20). Now a world grid (`x = ix * 0.55`), one fixed x range per shot (camera sweep +- reach), stable `id` per head; `paintHeads` (seeds by array index) replaced by local `paintCrowd` that seeds by id.
3. Per-frame screen-budget cuts flipped people: fleck count `n`, quad cut-offs (scr < 4, r0 > maxR), `thin()` (depth and array index), the head/speck switch at rpx 3.2, the `maxHeads` nearest-260 list, arms at r 3. Now every member has a seeded rank (hash of its id) and a weight that ramps over a band of the continuous keep share (`fadeIn`), painted as alpha; head/speck cross-fade over rpx 2.8-3.6; head cap fades over 15% of the cap distance; arms fade over r 2.4-3.2.
Side effects to know: seeds changed, so individual dots sit elsewhere than before (same density, checked on SH18 +10/+11 old vs new); paint polygons +3..25% (SH20 10,658, limit 14,000 in the paint test).

Numbers (every frame rendered through `scripts/stills.mjs`, then `frame-metrics.py pops`, 135x240):
| shot | mean consecutive diff before (draft mp4, h264 half size) | after (clean stills) |
| SH17 | 2.06 | 1.89 |
| SH18 | 4.42 | 3.06 |
| SH19 | 2.65 | 0.99 |
| SH20 | 2.50 | 1.97 |
Before numbers come from the draft video (my own pre-fix stills were overwritten while I edited), so they include codec noise; read them as indicative. SH18 residual ~3 is the real parallax of a 14 m sideways move past near heads. Pop candidates: SH19 one (+1 -> +2, 0.85 vs a 0.13 neighbourhood: the camera starts moving, not a crowd pop); SH20 none (before: one at 1202->1203).
Identity churn without rendering (`node --import tsx scripts/edu17/crowd-churn.ts`; seed present in one frame only = pop), old metric on identical settings: pops SH17 81,921 -> 5,799, SH18 77,540 -> 4,358, SH19 9,612 -> 1,336, SH20 59,756 -> 3,909 over the shot. The test asserts the worst consecutive pair (pops + teleports as a share of polygons): now SH17 7.8%, SH18 3.2%, SH19 0.9%, SH20 1.3% (limits 15 / 8 / 4 / 5%).
Caption band 1176:1344 (limit mean <= 0.25, p95 <= 0.40): SH17 +0/+36 0.188/0.230, 0.172/0.213; SH18 +0/+25/+52 0.219-0.222 / 0.341; SH19 +0/+24/+45 0.185-0.212 / 0.283; SH20 +0/+27/+58 0.192-0.194 / 0.257: all pass. Paint about 1 s per full-size still in the batch (under 1.5 s). SH21 not re-rendered (`instrument.ts` untouched).
Sheets: `out/qa/edu-ep17/fixD/fixD_sh18_old_vs_new.png` (old draft left, new right), `out/qa/edu-ep17/fixD/fixD_new_sh17_18_19_20.png`.

## Fix pass E (2026-11-13): `drop` option in `paintStreetShot`, scene cache diagnosis

- `src/painted/edu17/street.ts`: Editor's per-person crouch/jump clock moved in unchanged (`JUMP`, `jumpDrop`, `dropAt`, `crouchFor`, `armsUp`, `bodyAt`, `MAN_CLEARANCE`, `DROP_SHOTS`). New option `paintStreetShot(p, shot, f, {drop: true})`: live only in SH10, SH11, SH12, SH15 (other shots ignore it); crowd heads, clothes mass (mean of 8 sampled heads x 0.85), near cards (`fig {crouch, lift}`, P08 arms while airborne, no contact shadow in the air) and SH11's man/halo follow the clock. `drop` off (default) is the previous code path, untouched.
- Check: recorded brush-call stream (md5 of every call and argument) of the new function with `drop` off versus the pre-change function: identical for SH02 @2, SH05 @15, SH11 @0 and @44, SH10 @10, SH12 @3, SH15 @40 (`drop: true` differs in SH11 and SH12 and not in SH02/SH05). Pixel stills with `drop` off, SH02-f2 / SH05-LF02 / SH11-f0 / SH11-f44 (`out/edu17/g2e/`) against the group 2 stills of 12 Nov (`out/edu17/g2/`, older crowd code): ffmpeg mean abs luma diff 0.13 / 0.67 / 0.13 / 0.13 (not 0: the old stills pre-date crowd-heads and fix D; the call-stream equality is the exact check). Tests: three added to `tests/edu17-street.test.ts` (default equals drop false, SH02/SH05 unaffected, clock values, body fields).
- `src/videos/edu-ep17/street-live.ts` is now a thin wrapper (`paintStreetLive = paintStreetShot(..., {...o, drop: true})`, same exports re-exported), so `stage.ts` and `frame.tsx` need no edit. Editor may later call `paintStreetShot(..., {drop: true})` directly and delete the file.
- Scene cache: `scripts/render-inputs.ts` on the real EDU-EP17-SHORT props runs clean in 2.2 s here (hash, 22 scenes, no warnings), and the 12 Nov clips log shows `inputs` ok, `bypassed: false`, rendered 22 reused 0 (a true first render of that variant; manifest `A_fade|draft|scale0.5` was written at the start of that run). "render input helper did not complete" is printed by `sourceInputs` (scripts/segments.mjs) for ANY non-JSON helper result: with a spawn failure, 60 s timeout or kill, `run.stdout` is null, `JSON.parse(null)` gives null, `result.hash` throws, and the real cause was swallowed. A bypass sets the source to a random UUID, so keys never repeat and every scene repaints. Likeliest cause in Editor's runs: the helper spawn refused or killed inside the sandboxed shell (or the 60 s limit under a loaded machine); not reproduced here. Fix made (diagnostic only): the warning now appends spawn error code, signal, exit status and the last two stderr lines. Next time the full message names the cause.

## Fix pass F (2026-11-13): forward lean in shot 11 / 12 ("Crouch read", A18)

- `src/painted/edu17/crowd-heads.ts`: `LEAN = {down 0.08, fwd 0.27, chin 15, torso 0.68}` and head option `lean(n, i)` (0..1) in `paintHead`/`paintHeads`. At l: head `0.08 l` m lower and `0.27 l` m toward +z (position by `camPoint`, so the dot/card moves in perspective), hair cap reaches `0.35 l` r lower (chin-down, more crown, less face), torso length `1.35 + (body - 1.35)(1 - 0.32 l)` r (card height x0.68 at l = 1). l = 0 or absent runs the old code path numerically unchanged.
- `src/painted/edu17/street.ts`: `leanAt(shot, f, i)` (same `jitter` and clock as `dropAt`: SH11 `sm((c-30)/12)`, SH12 `1 - sm(c/3)`, else 0). `paintStreetShot` option `lean` (default on under `drop`, `lean: false` = fix pass E exactly; only SH11/SH12 are affected). Far crowd mass drops by `0.85 x` mean of (drop + 0.08 l) over the same 8 samples; him: `paintHead(manHead)` with the man's lean (crown 1.72 -> 1.34 m at l = 1), halo at `[0, 1.72 - m - 0.08 l, 0.27 l]` so it moves with the head. Editor's `street-live.ts` passes `drop: true`, so the lean arrives with no edit there.
- Near full figures (nearest 12 cards; the kit figure has no pitch): the extra 0.08 m is added to the crouch fraction (`bodyAt(..., extra)`, not while airborne), the card's torso/forward shift is not applied (a z shift would move the feet). Open: Film may want a torso foreshortening for those 12 cards (needs a pitch field in the kit figure).
- Numbers: mean head y in band 900-1150 (153 far heads of the crowd, same heads +30 -> +44): 989.4 -> 1045.4 = **56.0 px lower with the lean**, 30.2 px without (the push of the camera plus the 0.30 m drop); the lean adds 25.8 px. SH11 caption band 1176:1344: mean/p95 +0 0.183/0.321, +30 0.182/0.323, +44 0.181/0.323; SH12 +0 0.211/0.328, +3 0.220/0.337 (all pass 0.25/0.40). Geometry-only paint 9-18 ms (stills render in the usual time). 3 m clear zone untouched (`crowdHeads` unchanged).
- Check: recorded brush-call md5, new `paintStreetShot` vs the same code with the lean stripped, 72 cases (every `STREET_SHOTS` shot x f 0/15/30/44 x options undefined / `drop: false` / `drop: true, lean: false`): identical. SH10 and SH15 `drop: true` identical with `lean: false`. Tests added to `tests/edu17-street.test.ts` (lean clock, +0.08/+0.27 head offset, zero lean = no option, band 900-1150 >= 25 px, lean-off equals fix pass E). Sheet: `out/qa/edu-ep17/fixF/sheetF.png` (SH11 +0/+30/+44, SH12 +0/+3/+6, clean frames `GUIDES=0`).
- Caveat: with the +-2 f jitter a person can still carry l 0.74 at SH12 +3 (c = 1); the crowd is fully released at +5 (tested at +6 for sampled persons). Spec kept as written.
