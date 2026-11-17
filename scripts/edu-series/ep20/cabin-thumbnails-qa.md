# EP20 cabin thumbnail handoff

- Revision: **EDU-EP20-THUMB-R1**, Film, 2026-11-16; one location/family, first storyboard shot **EDU-EP20-SHORT-S01-B01-SH01** only.
- Inputs: **EDU-EP20-VB-R1**, **EDU-EP20-BOARD-R1**, **EDU-EP20-SCRIPT-R1**, **EDU-EP20-FACT-R1**, **EDU-EP20-HOOK-R1**, delivery R2. Branch `GuyMangkorn/ep20-helium-continuation`, base `c420a2cf7d96f5aa7a3a63c5c744a7dc7c75603b`; source is uncommitted W3 work.
- Status: **three draft thumbnails produced / own geometry and image inspection complete**. Independent viewer check, user thumbnail selection, finished look lock, acting/contact hardening, scene integration, audio sync and timed sheets remain separate and unproved. **Review page: pending.** No review-row changes in this pass.

## Design and ownership

The same restrained right-profile adult and upright coral balloon appear in the same enclosed daylight cabin. No acceleration/braking result, air-pressure answer or driver action is introduced. A is warm balanced daylight; B is slightly closer with a cooler cabin and warm window; C is a slightly lower soft cream-bounce view. These are framing/light options within VB-R1, not three locations or story versions. The new shared primitive remains **exists-unintegrated**; the standalone look entry proves still rendering only.

- Sole reusable art owner: [car-cabin.ts](../../../src/painted/kit/car-cabin.ts), parameterized cabin palette/camera, P31 seat support, world-anchored belt and continuous balloon/neck/string/floor-ring assembly. No episode clocks in the kit. Boss owns subsequent hardening; no library or renderer contract was modified elsewhere.
- Episode-only staging: [cabin-look-data.ts](../../../src/painted/edu20/cabin-look-data.ts). Actual paint/labels: [cabin-look.tsx](../../../src/painted/edu20/cabin-look.tsx). Standalone entry: [look-index.ts](../../../src/painted/edu20/look-index.ts); no Root/registry/episode timeline registration.
- Reproduction: [cabin-thumbnails.mjs](cabin-thumbnails.mjs), [measure-cabin.ts](measure-cabin.ts). New files are for coordinator context-map indexing; no shared rule changes.

Named space W20: metres, origin at passenger root/floor, +x car front/right, +y up, +z near camera. Passenger root `[0,0,0]`; unchanged canonical `man-crop` 1.76 m/four-head identity, hoodie, **P31**, neutral, `right`. Fixed floor-ring anchor `[0.62,0.10,0.05]`; upright balloon centre `[0.62,1.15,0.05]`, envelope height 0.32 m, width 0.272 m. Its tied neck reaches y 0.955 m. The narrow pane-edge sheen leaves the face/belt/string unveiled.

**Calibration refinement:** actual P31 hip is `[-0.147,0.391,0]` m; the cushion top is 0.343 m, derived from the rig with its feet supported on y=0. This replaces the brief's explicitly estimated 0.48 m seat calibration for these thumbnails. No cast size was changed. Belt upper support `[-0.247,1.04,0.07]`, latch `[-0.037,0.461,0.07]`, lap start `[-0.257,0.416,0.07]`, projected by the same yaw camera. Later acting must preserve these contacts; this static proof does not validate leaning.

## Reproduction and retained media

Run from the repository root:

```sh
node scripts/edu-series/ep20/cabin-thumbnails.mjs
node --import tsx scripts/edu-series/ep20/measure-cabin.ts > out/edu20-cabin-thumbnails-r1/geometry.json
python3 -I scripts/caption-zone.py --overlay-dir out/edu20-cabin-thumbnails-r1/caption-overlay out/edu20-cabin-thumbnails-r1/A.png out/edu20-cabin-thumbnails-r1/B.png out/edu20-cabin-thumbnails-r1/C.png > out/edu20-cabin-thumbnails-r1/caption-zone.json
sh scripts/qa-sheet.sh out/edu20-cabin-thumbnails-r1/own-qa-270.png --cols 3 out/edu20-cabin-thumbnails-r1/caption-overlay/A_capzone.png out/edu20-cabin-thumbnails-r1/caption-overlay/B_capzone.png out/edu20-cabin-thumbnails-r1/caption-overlay/C_capzone.png
```

Stills use **scripts/stills.mjs / one Chrome / gl=angle / full 1080×1920 / flat washes, no hatching**; no video render. Composition IDs `EDU20-CABIN-A/B/C`, frame 0. The static passenger face samples t=1 s to show the neutral eye; there is no episode action clock. `A-repeat.png` is frame 1 of the identical state in the same browser, for pixel repeatability only.

Retained media: **`$REELS_STORE/projects/edu/EDU/previews/ep20/cabin-thumbnails-r1/`** (default `/Users/mangkornkatawong/ReelsStore/projects/edu/EDU/previews/ep20/cabin-thumbnails-r1/`). `store.py archive` filed nine PNGs; `store.py put` filed geometry/caption/settings JSON and determinism text. The coordinator receives `A.png`, `B.png`, `C.png`, **contact-270.png** (labels are inside each frame), **own-qa-270.png**, geometry/caption JSON and settings hashes. Copies under `out/` are caches.

## Numeric evidence

Actual painted figure fill vertices are captured from the same rig/projector, excluding shadows. This is the silhouette geometry measurement, not inference from canonical standing height. All coordinates below are full-size pixels.

| Variant | Camera x/y/z m; yaw radians; f; hy | Passenger fill bounds L/T/R/B | Lead height | Balloon height | Balloon centre | Floor ring |
| --- | --- | --- | --- | --- | --- | --- |
| A | .43/1.05/2.60; 0; 1300; 320 | 134.417/132.770/505.736/849.124 | 716.354 | 163.137 | 636.863/269.020 | 636.863/804.314 |
| B | .46/1.04/2.49; −.022; 1300; 305 | 131.055/105.042/517.303/850.194 | 745.152 | 170.779 | 654.015/246.295 | 654.015/806.665 |
| C | .39/1.01/2.68; .024; 1350; 335 | 117.602/125.431/493.112/849.870 | 724.438 | 163.962 | 625.475/263.267 | 625.475/801.266 |

All three exceed lead ≥480 px and hero ≥144 px. Actual silhouette bottoms stay above caption y860, with minimum 9.8 px clearance; ring y801–807 and full tether remain above the band. The face is inside the central safe region; hair extends above safe y140 without image-edge clipping. No subtitle glyphs are rendered/validated here because final caption integration belongs to Editor.

Final `caption-zone.py` at y860–1248: **A mean .246 / p95 .297; B .235 / .310; C .242 / .308 — all pass** the tool's default .25/.40 thresholds. No caption shade/overlay was added: these values come from the painted material. The QA overlay is a measurement image only. Static A frame0/frame1 same-browser repeat: **5 changed colour channels, maximum 1/255, PSNR109.1dB**; this measures still noise, not seek/motion approval. `settings.json` records exact source/image SHA256 and render settings.

## Own inspection, findings and limits

Film viewed the actual three-frame 270px contact sheet, then the caption-overlay QA sheet. The own-inspection correction batch improved car recognition with a near-side sloping pillar, rounded front headrest/struts and a leaning seat-back form; opened the resting neutral eye; kept feet and floor ring above the caption band by reframing the camera; and darkened the actual lower door/floor material until the caption-band measurement passed. This is painter QA, **not an independent viewer-check verdict**.

The lower frame is the near door/pocket/armrest, fully painted slate rather than a black strip. Details are deliberately flat/low contrast in this thumbnail pass. Finished texture, seam detail, contact shadows and refined restraint draping are not claimed. This first-shot still does not validate moving scenery, camera paths, buoyant lean states, braking concealment, backward/random seeking, the B04 dissolve or the whole sequence. Three options share a geometry family and differ subtly by design; the user is choosing framing/daylight balance, not a new style.

Findings applied: **DF-20261030-painted-straight-bars** to opaque hard-wash enclosure edges; **DF-20261030-painted-glass-sheen-veil** to edge-only sheen; **DF-20261031-paint-seed-defer** to context-only brush and per-element seeds. Current stills revalidate their local visual application only. No historical timing/performance or motion proof is imported. Sound remains VB-R1's quiet cabin/wood pulse; this still-only pass creates no audio.

Required next handoff: coordinator builds the independent viewer bundle from these exact image hashes before showing options; record that review separately. After the user's thumbnail pick, a fresh Film invocation paints one finished first-shot look frame. Boss then hardens the sole reusable owner against that locked look and later timed sheets; Editor supplies real narration timing and integrates captions/labels through the selected episode pipeline.

## Verification and change log

- Targeted ESLint for all four new source modules: pass. `node --check` reproduction script: pass. Geometry script ran on actual staging. Full `npm run lint`: 80 findings (73 errors/7 warnings) in existing files, none in new source modules.
- Full `npm run typecheck`: four existing errors only: duplicate view in `tests/arm-depth.test.ts:26`, missing declaration for loudness.mjs in `tests/loudness.test.ts:7`, two missing `covers` fields in `tests/render-options.test.ts:18`. No changed-source errors. No unrelated fixes made.
- `python3 -I scripts/check-links.py`: 11 files checked, zero problems; `git diff --check`: pass. Coordinator owns final context-map verification/commit.
- R1, 2026-11-16: first three upright cabin thumbnails, own critical-geometry/read fixes, reproduction scripts and measurements. Script/storyboard/brief/review rows/narration/EP21 remain unchanged.

## Finished B first-shot look — EDU-EP20-LOOK-R1, 2026-11-16

User selected **B — กลาง: ใกล้ขึ้น แสงเย็น**. Film retained B's exact camera, physical cast/balloon dimensions and upright opening state. The finished look adds moulded near-door insert/pocket/speaker, upholstery seams, floor contact/mat, two small divisions on the rig's existing mitten, a clearer continuous string/ring, balloon rim and a static paper Grain screen layer at0.07. All fills remain flat per the current painted engine rule; no textured-fill/hatch workaround, extra scene or motion was authored. Quiet cabin/wood pulse sound direction remains VB-R2; this still pass creates no sound.

Production owner `src/painted/kit/car-cabin.ts` gains optional finished materials, defaultfalse to preserve thumbnail callers. Existing `cabin-look.tsx`/`look-index.ts` expose standalone **EDU20-CABIN-LOOK-B**,1080×1920,30fps,2frames, outside Root/timelines. Reproduce with `node scripts/edu-series/ep20/cabin-thumbnails.mjs out/edu20-cabin-look-b-r1 --finished`. Both final stills were rendered with `scripts/stills.mjs` in one Chrome/ANGLE. The first own render revealed a misplaced warm reflection painting above the front seat and lower-door features falling below the crop; Film removed the reflection and moved those surface features into the visible same world plane before final rendering.

Film viewed `own-qa-270.png` (chosen thumbnailB beside finished look), then the final single-look sheet. Measured lead **745.152px**, balloon **170.779px**, actual silhouette bottom **850.194px** (9.806px above caption y860); anchor **[654.015,806.665]px**, centre **[654.015,246.295]px**. Final caption-band mean/p95 **0.238/0.317**, pass without extra shade. Two static rendered frames have **zero changed RGB channels, maxdifference0**; this is deterministic held-look proof only, not motion/contact-through-action or physical transient proof. Whole picture, hands, belt, string, ring, upright buoyant envelope and enclosure remain readable in own inspection. The lower near-door surface deliberately remains lowcontrast behind captions; independent viewer judgment remains separate.

Final image SHA256 **45eb3d34aac9dd7264a67a7cbf800213b600765b3ff22a508bd284e7255e7ff2**. Media/settings/geometry/caption evidence live at `$REELS_STORE/projects/edu/EDU/previews/ep20/cabin-look-b-r1/`: `look-b-repeat.png` (canonical stored bytes, identical to local `look-b.png`), `own-qa-270.png`, `review-540.png`, `caption-overlay/look-b_capzone.png`, `settings.json`, `geometry.json`, `caption-zone.json`. Archive retained6media including the caption review sheet; local `look-b.png` is deduplicated against identical `look-b-repeat.png`;3JSON inputs filed explicitly; store image hash checked. Targeted ESLint, reproduction script syntax,2changed-doc link checks and context-map436modules/0uncovered pass. Full-repo baseline lint/type errors are unchanged and recorded by coordinator; no unrelated fixes.

Film synchronized selected calibration into **VB-R2** and the index: cushion top0.343m derives from P31 hip0.391m−0.048m; C20-A uses camera[0.46,1.04,2.49]m/yaw−0.022rad/f1300/hy305. Canonical rows revision **LOOK-R1** adds **LF20-CABIN-B** to all five cabin beats; all11shot VO/seen/sound, IDs, story reveals and untimed status remain intact. Current locked voice E47.107229s / VOICE-MEASURE-R2 supersedes old D metadata. **Review page: pending. Independent viewer check and user finished-look lock: pending.** No timeline/Boss full-build authorization or `ready-for-dev` timed sheets is implied.
