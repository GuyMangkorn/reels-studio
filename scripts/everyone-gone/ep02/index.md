# EG-EP02-SHORT — timed scene sheets, index (SS-R2.0)

Deliverable: `EG-EP02-SHORT` · Revision: `SS-R2.0` (scene sheets `EG2-SC-R2.0`) · Status: **ready-for-dev** · Timing: **checked-with-audio** (voice T-v3, locked 2026-11-03; word edges inside a line are `est`, +-8 f)
Inputs: script `EG2-SCRIPT-R1.2` (L01–L19) · Film brief `EG2-BRIEF-FILM-R1.3` (VD01–VD13, CL01–CL06) · storyboard rows `SS-R1.1` (19 shots, user ok 19/19) · look frames LF01–LF05 (v3, LF04 v2) locked · viewer check [viewer-check.md](viewer-check.md) · delivery [delivery.md](../delivery.md#eg-ep02-short)
Voice: `~/ReelsStore/projects/EG/narration/EG-EP02-SHORT-narration-B-x108-tight-v3.wav` + `…-v3-meta.json` (rows line, start, end, dur, gap; 61.25 s). [voice-timing.md](voice-timing.md) is older; T-v3 supersedes it.
Target: branch `claude/eg-ideal-remaining-c19f75` · 30 fps (project) · 1080×1920 · **durationFrames 1928** = narration 1838 + 3 s end hold 90 · composition offset 0 · ranges are half-open `[start, endExclusive)` in composition-global frames; shot-local `f` = global − shot start.
Evidence: runtime unverified · render/samples none · audio sync: frames computed from the meta (round(sec×30)) · user approval of the timing: pending (page rows SS-R2.0)
Sheets: [sc01](sc01.md) S01-B01 + S01-B02 (5 shots) · [sc02](sc02.md) S02-B01 (4) · [sc03](sc03.md) S03-B01 (2) · [sc04](sc04.md) S04-B01 (7) · [sc05](sc05.md) S05-B01 (1 + hold). Page rows: [review-rows.json](review-rows.json).

## Timeline (one shot = one timeline scene; S04-SH04..SH07 are in-scene crossfades, see below)

Line frames (meta, `[start, end)`): L01 0–123 · L02 133–203 · L03 210–284 · L04 292–382 · L05 402–571 · L06 582–659 · L07 667–696 · L08 703–798 · L09 815–906 · L10 919–1056 · L11 1063–1119 · L12 1146–1199 · L13 1215–1282 · L14 1289–1383 · L15 1412–1490 · L16 1497–1625 · L17 1633–1720 · L18 1730–1778 · L19 1791–1838. Hold [1838, 1928).

| Shot | Global `[start, end)` | Frames | Seconds | Voice | Cut lands on |
| --- | --- | --- | --- | --- | --- |
| S01-B01-SH01 | [0, 128) | 128 | 4.27 | L01 | gap L01→L02 |
| S01-B01-SH02 | [128, 206) | 78 | 2.60 | L02 | gap; hood swap f60 |
| S01-B02-SH01 | [206, 288) | 82 | 2.73 | L03 | gap |
| S01-B02-SH02 | [288, 396) | 108 | 3.60 | L04 | 6 f before L05 |
| S01-B02-SH03 | [396, 577) | 181 | 6.03 | L05 | gap (CL02 murmur) |
| S02-B01-SH01 | [577, 663) | 86 | 2.87 | L06 | gap |
| S02-B01-SH02 | [663, 699) | 36 | 1.20 | L07 | gap |
| S02-B01-SH03 | [699, 806) | 107 | 3.57 | L08 | gap |
| S02-B01-SH04 | [806, 912) | 106 | 3.53 | L09 | gap |
| S03-B01-SH01 | [912, 1060) | 148 | 4.93 | L10 | gap |
| S03-B01-SH02 | [1060, 1123) | 63 | 2.10 | L11 | 4 f after L11; wind gust |
| S04-B01-SH01 | [1123, 1212) | 89 | 2.97 | L12 | flip f4–22 inside the gap |
| S04-B01-SH02 | [1212, 1286) | 74 | 2.47 | L13 | 3 f before L13; `ตามหา` ~f1257 est |
| S04-B01-SH03 | [1286, 1406) | 120 | 4.00 | L14 | hold through the 0.95 s pause |
| S04-B01-SH04 | [1406, 1493) | 87 | 2.90 | L15 | dissolve starts f42 on `ค่อยๆ` (est) |
| S04-B01-SH05 | [1493, 1556) | 63 | 2.10 | L16 (1st half) | dissolve at f10 |
| S04-B01-SH06 | [1556, 1592) | 36 | 1.20 | L16 `เดินผ่านข้างคุณ` | dissolve at f6 |
| S04-B01-SH07 | [1592, 1629) | 37 | 1.23 | L16 `เหมือนทุกเช้า` | gap L16→L17 |
| S05-B01-SH01 | [1629, 1928) | 299 | 9.97 | L17, L18, L19 + hold | end of video |

Sum 1928. No gap in T-v3 is edited by Film.

## Requests to Editor (gap changes; optional; Film does not touch audio)

The user allows a modest longer pause where a picture or story beat needs it. The sheets are written and valid for T-v3 as delivered; each request below only extends one shot's hold, so applying it is a mechanical shift (no re-authoring).

| ID | After line | T-v3 gap | Requested gap | Why (picture) | Priority | Effect on the frames |
| --- | --- | --- | --- | --- | --- | --- |
| `GR1` | L11 | 0.88 s | **1.25 s** (+0.37 s = +11 f) | The brief's own plan (P gap 1.25 s) holds the turned-away sheet in silence and then spends the 0.6 s wind-and-flip on the SFX gap. At 0.88 s the hold shrinks to about 4 f before the gust. This is the one beat in the video that turns on silence. | recommended | S03-B01-SH02 +11 f (hold); every shot from S04-B01-SH01 shifts +11 |
| `GR2` | L15 | 0.24 s | 0.50 s (+0.26 s = +8 f) | The first crowded frame (Yaowarat) gets 0.5 s to read before the cut (87 f → 95 f). | optional | S04-B01-SH04 +8 f; later shots shift +8 |
| `GR3` | L16 | 0.24 s | 0.55 s (+0.31 s = +9 f) | The soi crowd (the 4th fill) gets a breath before the mother (37 f → 46 f). | optional | S04-B01-SH07 +9 f; S05 shifts +9 |

All three accepted: S04-B01-SH01 starts 1134, SH04 1417, SH05 1512 (+19), S05 starts 1657 (+28), durationFrames 1956, narration 62.19 s. Any subset shifts only the shots after it by that subset's frames; the shot-local cues in the sheets do not change.

## Shared decisions for the sheets (links, not copies)

- **Baseline, projection, units** (metre, origin on the ground under each camera, +x right, +y up, camera looks toward −z; `Cam {x, y, z, f, hy}`): [brief Technical handoff](../ep02-brief.md#technical-handoff). Screen = 1080×1920 px, origin top-left, y down. All shot dimensions `estimated` unless marked `measured`. Cameras per place are the `places.ts` constants: Yaowarat `YW_CAM`, pier `PIER_CAM` / `PIER_CAM_S05`, soi `SOI_CAM` (`src/painted/everyone-gone/ep02/places.ts`, look-defining first versions, Boss hardens).
- **Camera drift** is a `CameraLayer` scale about a named screen anchor, the same function of shot-local frame in both states of a matched pair (VD05); wide drift < 1 % over the shot, close pushes as stated.
- **Cast:** `คุณ` = `woman-bob + hoodie, P01, neutral`, back view, coral override (`YOU2`, `paintYou`, kit `back.ts`; VD03). Mother = `woman-curly + sage blouse, plum skirt, P10, calm` (`MOTHER`, VD09). Crowd = kit cast walkers (`layerMotion` walks, `walkerAt`), seeded per place.
- **Captions** verbatim from the script, `CaptionShade` band only while a caption is up (delivery.md EP02 decision), position per VD12 (start low band, bottom edge about y 1150–1248). One cue per line: cue frames = the line frames above; L05, L10 and L16 may be split at the `…` by Editor, text verbatim. Keep garland, incense, sheet, poster header and mother's face above y 1000.
- **Matched crossfade (VD06):** one timeline scene per place; its `painted.shots[]` has cue 1 `empty` and cue 2 `crowd` with `dissolveSec`; never `transitionIn`. Dissolve frames are not byte-identical between renders ([DF-20261029-painted-timeline-dissolve](../../../docs/dev-findings/DF-20261029-painted-timeline-dissolve.md), last checked 2026-10-29, revalidate on these plates); full-alpha frames are. **Deviation from VD06 (about 0.5 s hold / 1.2 s dissolve):** the tight voice leaves 87–37 f per place, so the dissolves shorten place by place (30, 24, 18, 18 f = 1.0, 0.8, 0.6, 0.6 s) and the later empty holds are 6–10 f. The viewer has already seen each empty plate in S01–S03, so recognition does not need a long empty hold. `GR2`/`GR3` buy back crowd-hold time, not dissolve time.
- **Findings consulted:** DF-20261029-painted-timeline-dissolve (S04 SH04–SH07); DF-20261030-painted-story-hold-ambient-clock (S02-SH02 smoke, S03-SH02 hold, S05 hold: the ambient clock must keep moving); DF-20261030-ending-hold-option (S05 hold: Boss inspects `endHoldSec`, status `unknown`). None blocks.
- **Crowd collision (VD13):** every crowd cue (S04-SH04..SH06 crowd cues, S05-SH01) is checked per frame on the walker paths, not only on viewed frames: `tests/eg2-crowd-collision.test.ts` extended to sample every frame of each shot's cue. A failing path is re-routed, never hidden by the camera.

## Sound direction at the timeline level (shot-local cues are in each shot)

Brief [Sound direction](../ep02-brief.md#sound-direction) governs; this is the clock for it. Library checked 2026-11-03 (`~/ReelsStore/library/sound/INDEX.md`, 140 lines): usable `bed_sad-aftermath-ambient_01` (S04–S05 melancholic piano base), `bed_warm-pad-felt-third_01` (8 s, the warm pad under L09), `whoosh_page-flip-paper_01` (flip, candidate), `foley_notebook-paper-rustle_01` (paper tick, candidate), `electric_streetlamp-hum-loop_01` (night streetlamp mains hum, base for the soi cable hum, listen first), `foley_walk-sneakers-asphalt_01` (crowd steps, layered). Everything else is `NEEDS-GEN` below; labelled generated ambience (FIC007).

| Frames | Music state (energy /10) | Ambience bed | Crowd murmur (CL02) |
| --- | --- | --- | --- |
| 0–206 | solo piano, 1–2 notes at 60 bpm free, long reverb (1) | `AMB-DAWN` + one distant bird | `AMB-MURMUR-FAR` present below naming |
| 206–396 | same piano, slow three-note figure from f206 (1–2) | `AMB-YAOWARAT` → `AMB-WIND-OPEN` (f288) | same level |
| 396–577 | piano rests; near silence after L05 | `AMB-PIER` (water, pigeons, `SFX-BOAT-FAR`) | rises a hair f402–571 (`ไกลๆ เหมือนคนคุยกัน`), still unclear |
| 577–806 | piano holds; pad `bed_warm-pad-felt-third_01` enters f785 under L09 (2) | close, intimate: `SFX-INCENSE`, `SFX-WIND-PAPER` | back to the low level |
| 806–1123 | pad thins to one held note f912 (2), near silence from f1119 | `AMB-SOI` (cable hum, far motorbike) | low |
| 1123–1212 | silence is the build; the flip is the only effect | `SFX-GUST-FLIP` f1123–1146 | dips under the gust |
| 1212–1406 | piano returns quietly f1215 (not on `ตามหา`); holds one note f1290 (2–3) | wind settles | low |
| 1406–1629 | main melody swells with each dissolve (peak 3–4) | place beds cross with the picture | `AMB-MURMUR-CLOSE` fades up with each dissolve, ending as busy as the picture |
| 1629–1838 | drops back to the opening one- or two-note figure under L17–L19 (2) | `AMB-PIER` (crowd softened, boat closer) | recedes after L19 |
| 1838–1928 | last piano note rings, fades with the picture | river only (`AMB-PIER` water), then silence at the end of the fade | gone |

**Ending plan:** no stinger (`stinger_outro-resolve_01` avoided). Music ends under the fade; river ambience under the last 60 f; true silence for the final ~10 f.

**Silence policy:** near silence in the gaps after L05, L09, L11 (stronger with `GR1`), L14. **Ducking:** music and beds duck 3–5 dB under every voice line; the gust (S04-SH01) is not ducked and not boosted. No riser, siren, news sting or hit on `ตามหา` (FIC007). Editor sets levels (mix intent per shot).

### NEEDS-GEN requests (Editor, `audio-studio`; none exists in the library)

| ID | Sound | Used in | Length |
| --- | --- | --- | --- |
| `MUS-PIANO` | sparse solo piano, long reverb: (a) opening one/two-note figure, (b) slow three-note figure, (c) main melody (soft, hopeful-tender), 60 bpm free, instrumental | whole video | stems 20–60 s |
| `AMB-DAWN` | dawn city tone, empty street, one distant bird | S01-B01 | 12 s loop |
| `AMB-YAOWARAT` | shutter-street room tone, tall lit signs buzz, far hum | S01-B02-SH01, S02-SH01..03, S04-SH04 | 12 s loop |
| `AMB-WIND-OPEN` | open-air wind, no traffic, big roundabout | S01-B02-SH02, S04-SH05 | 12 s loop |
| `AMB-PIER` | river water lapping on pier posts, pigeons, calm covered hall | S01-B02-SH03, S02-SH04, S04-SH06, S05 | 15 s loop |
| `SFX-BOAT-FAR` / `SFX-BOAT-NEAR` | river ferry engine, far and near | S01-B02-SH03 / S04-SH06, S05 | 8 s each |
| `AMB-SOI` | residential soi, overhead cable hum, far motorbike (base: `electric_streetlamp-hum-loop_01` if it fits) | S03, S04-SH07 | 12 s loop |
| `AMB-MURMUR-FAR` / `AMB-MURMUR-CLOSE` | Bangkok street crowd murmur, unintelligible: far bed (below naming) / closer with footsteps, vendors, motorbikes | whole video | 15 s loops |
| `SFX-HOOD` | soft hoodie fabric rustle, close | S01-B01-SH02 | 1 s |
| `SFX-INCENSE` | faint incense stick crackle | S02-SH02 | 4 s |
| `SFX-WIND-PAPER` | outdoor breeze on taped paper, soft tick | S02-SH03, S03-SH01/SH02 | 4 s |
| `SFX-GUST-FLIP` | one wind gust (about 0.6 s) with paper flipping and settling, outdoors; fallback layer `whoosh_page-flip-paper_01` | S04-SH01 | 1.5 s |

## Boss needs (consolidated; `missing` unless noted)

| # | Need | Consumers | Notes |
| --- | --- | --- | --- |
| B1 | Victory Monument circle set, `empty` and `crowd` (obelisk silhouette, BTS viaduct (EP01 `viaduct.ts` reusable), no banners; a pole with the sheet) | S01-B02-SH02, S04-SH05 | not in `places.ts` yet; look frame not made, covered by the brief; matched pair + props identical within 2 px |
| B2 | Soi wide set (`SOI_WIDE`: lamp post at the soi head 5–6 m from camera, motorbikes, spirit house) with the same post/poster pixels as `paintSoiPost`; `state` empty / crowd; camera follow path | S03-SH01, S04-SH07 | `paintSoiPost` is the close plate only |
| B3 | Pier / Yaowarat close cameras (`CU` cams in the shot blocks) and a hi-res close of the poster + figure for SH03 (push to about 3×; do not upscale the plate) | S02-SH01..03, S04-SH02/SH03 | render the close from the world, not a crop |
| B4 | `sheetFlip(t)` (0.6 s turn about the tape line, horizontal scale through 0) and the loose-top-sheet hanging state | S03-SH02, S04-SH01 | VD07 |
| B5 | `hoodPull` (about 14-frame hands-to-hood sequence on `YOU2` back view; hood-down → hood-up swap on the last frame) | S01-B01-SH02 | VD04; fallback cut behind a 6-f rustle |
| B6 | Animated crowd paths for Yaowarat, Victory Monument, pier and soi (live walkers, seeded) and the VD13 per-frame check over every frame of each cue (also pier `mother` state) | S04-SH04..SH07, S05 | extend `tests/eg2-crowd-collision.test.ts` to per-frame sampling |
| B7 | Incense smoke ambient clock (continues under a hold) and garland sway; smoke legible at 270 px | S02-SH01/SH02 | DF-20261030-painted-story-hold-ambient-clock |
| B8 | Pier ambient clock in the `mother` state for the 90 f hold (water, crowd drift, pigeon) and `endHoldSec` / A_fade check | S05 | DF-20261030-ending-hold-option |

## Change log

- 2026-11-03 `SS-R2.0` — first timed revision (Film W5.1) from voice T-v3 (61.25 s + 3 s hold = 64.25 s; 1928 f). Supersedes the untimed `SS-R1.1` timing fields only; shot IDs, VO, looks and decisions are unchanged. Cuts land on the gaps; `GR1`–`GR3` recorded as optional requests. S05 starts 4 f before L17 (mid-gap), not on the line start.
