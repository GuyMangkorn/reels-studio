# POOLDEPTH-SHORT feasibility spikes S0, S1, S2 (Boss)

Date: 2026-10-28. Branch `claude/pool-depth-short`, HEAD `59809c8` + untracked work. Blender 5.2.3 LTS headless (CLI, not MCP), Cycles Metal on Apple M1 GPU (8 cores), Remotion 4.0.538. Brief: `storyboards/pool-depth/short/visual-brief.md` `VB-POOLDEPTH-SHORT-R1` (not edited). Source: `assets/blender/pool-depth/build.py` (all geometry numbers computed there); computed output: `assets/blender/pool-depth/spike-manifest.json`; Remotion scratch entry (not in `src/Root.tsx`): `scripts/pool-depth/spike/entry.tsx`. Pass here is spike evidence, not approval of the final look. S3, S4 and D3 were run in the second pass (sections below). Studio `unverified` (`DF-20261026-studio-emfile`); CLI stills/renders only.

## Summary

| ID | Result | Key numbers |
| --- | --- | --- |
| S0 pipeline | **pass** (video route); image-sequence route `missing` by design | 60 Blender frames 1080x1920@30 -> H.264 MP4 1.95 MB; all 150 frames of a Remotion render (`S0-Hold`) carry the exact frame index (progress-bar width within 1 px of expected, 0 mismatches); random-order stills equal full-render frames in index; clip past its end freezes on the last frame (no black); mean abs colour error vs Blender PNG 1.9 (still) / 3.0 (rendered MP4 re-encode) of 255 |
| S1 refraction | **pass** | max error 0.096 px (tolerance 2 px) over 11 markers; IOR 1.000 control matches un-refracted prediction within 0.096 px; lift 15.3 / 31.3 / 48.8 px at 0.3 / 0.6 / 0.9 m; apparent depth 0.7476 / 0.7423 (paraxial 0.7502) |
| S2 coin | **pass** (with two recorded deviations) | before pour 0 coin px; after pour 13,987 px = 96.9% of the unoccluded-through-water reference (98.8% of the in-air reference); coin, camera and camera data have no animation; IOR 1.0 control: 0 px after pour, so the reveal is real refraction |

## S0 pipeline

- Blender: `build.py -- s0`; orthographic camera, 60 frames, emissive progress bar whose width equals frame/60 of the frame width plus a moving card; PNG 8-bit, Cycles GPU, 32 spp, no denoise. Frame 1 = scene-local frame 0 (`VD10`).
- Encode (Remotion's bundled ffmpeg; plain `ffmpeg` is not on PATH): `npx remotion ffmpeg -y -framerate 30 -i frame_%04d.png -vf "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p" -c:v libx264 -crf 12 -g 30 -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv -movflags +faststart public/pool-depth-spike/s0.mp4`. `npx remotion ffprobe`: h264 High, 1080x1920, yuv420p, 30/1 fps, 60 frames, 2.000000 s, bt709/tv. Size 1.95 MB (crf 12; PNG sequence 106 MB for 60 frames, 1.8 MB/frame at 32 spp noise).
- Colour: without the bt709/tv tags the same clip shifted visibly (RGB 16,94,113 became 8,87,115, mean abs 6.3-7.8); with tags 1.9-3.0. Rule: always tag. (Grain from low sample counts also costs bitrate.)
- Remotion: `scripts/pool-depth/spike/entry.tsx`, compositions `S0-Hold` (scene 5 s, clip 2 s, `ending: 'B_loop'`, so frames 60-149 are the hold) and `S0-Exact` (scene 2 s). Scene = `bg:'none'`, `actors:[]`, `media:[{kind:'video'}]`. `npx remotion render ... S0-Hold --codec=h264 --crf=12` took 16.9 s wall for 150 frames. Extracted all 150 frames; bar width matched expected for every frame (min(f,59)+1)/60, 0 mismatches beyond 1 px. `remotion still` for frames 100, 0, 59, 30, 60, 149, 75, 1 (out of order) gave bar widths equal to the full render; pixel difference still vs full-render frame 1.1 mean abs (re-encode only).
- Hold under `B_loop` / clip shorter than the scene: from frame 60 to 149 the picture is the clip's last frame (bar 1080 px, not black); nothing flickers. Conclusion: a clip that is too short freezes instead of failing, so the brief's rule "every clip covers its window" is a safety margin, not a crash risk. Caveat from reading `SceneRenderer.tsx`: during the `B_loop` hold the scene clock for media is frozen at hold frame, but `OffthreadVideo` plays on the composition clock; B06 therefore must supply real frames (or a held last frame) for its full 3 s hold, and the last frame of the clip must equal the intended hold frame.
- Not verified: `Img` sequence (no sequence `MediaClip` kind exists), Blender-native FFMPEG output, VP9/WebM, loop-seam pixel parity (that is S4), Studio.
- Render time: Cycles Metal 1080x1920, 32 spp, no denoise, trivial emissive scene: first frame 135.4 s (kernel compile, one-time), then mean 3.79 s/frame (59 frames), total 359 s for 60 frames.

## S1 refraction fidelity

Setup (`build.py -- s1`, all numbers computed): camera straight above, 2.0 m over the water surface, vertical FOV 60 deg (f = 1662.77 px), floor at depth d = 1.0 m with a checker, marker discs on the floor (0.5 mm above it) at 0.3 / 0.6 / 0.9 m along +x and +y, water = closed Glass BSDF slab whose bottom is buried 1 mm under the floor, IOR 1.000 vs 1.333. Prediction: bisection solve of Snell for the surface hit point; compare with the red-emission centroid in the render (subpixel).

| Marker (floor offset) | IOR 1.000 predicted / measured / error (px) | IOR 1.333 predicted / measured / error (px) |
| --- | --- | --- |
| x 0.3 m | 166.30 / 166.30 / -0.009 | 181.53 / 181.55 / +0.016 |
| x 0.6 m | 332.61 / 332.56 / -0.051 | 363.83 / 363.81 / -0.026 |
| x 0.9 m | 498.91 / 498.89 / -0.023 | outside frame (predicted 547 px > 540) |
| y 0.3 m | 166.30 / 166.31 / +0.004 | 181.53 / 181.48 / -0.049 |
| y 0.6 m | 332.61 / 332.59 / -0.018 | 363.83 / 363.84 / +0.002 |
| y 0.9 m | 498.91 / 498.82 / -0.096 | 547.64 / 547.60 / -0.039 |

- Max |error| 0.096 px against the 2 px tolerance: pass. The images differ as expected: with 1.333 the markers sit 15.3, 31.3 and 48.8 px farther from the nadir than without refraction (floor reads closer to the camera, i.e. raised). Apparent depth from the measurement: 0.7476 (0.3 m), 0.7423 (0.6 m), 0.7328 (0.9 m) against the paraxial 0.7502 (brief 3/4); it falls with view angle as Snell predicts. The checker edges show the expected pincushion bending (looked at `renders/s1/ior_1.333.png`).
- Caveat: the straight-down ortho view has no lift, so the test uses a perspective nadir camera and a radial shift (the brief's "near-vertical test camera"). Oblique pool-edge views (B01) are not measured here beyond the Snell identity; S3 covers diagram geometry.
- Render time: 15.1 s (IOR 1.0) and 13.4 s (IOR 1.333) per frame at 1080x1920, 32 spp, no denoise.

## S2 coin demo

Setup (`build.py -- s2 --coin_x 0.024`): opaque diffuse cup (inner diameter 8 cm, inner height 9 cm, 5 mm wall), coin Ø 2.0 cm x 1 mm on the inner floor with centre 6.4 cm from the near wall (extent 5.4-7.4 cm, as in the brief), locked camera: 1.0 m away, vertical FOV 13.2 deg, optical axis 40 deg from vertical through the near-rim inner edge; water: closed Glass volume IOR 1.333, only its z scale keyed (frame 1 empty to frame 31, 7 cm deep), side/bottom buried in the cup wall. Computed design numbers (centre ray): floor hidden up to 7.55 cm from the near wall when empty; with 7 cm of water the visible limit is 5.53 cm (refraction angle 28.83 deg), analytic visible fraction 93.4%.
- Coin pixels are counted from an emissive magenta mask (threshold 0.5) in a second pass; a gold coin is used for the beauty frames (`renders/s2/beauty_*.png`, looked at). Reference: same view with the cup hidden and a wide flat water slab (a bare glass cylinder acts as a lens, so it was rejected as reference).

| Check | Result |
| --- | --- |
| Coin pixels, frame 1 (before pour) | 0 (criterion 0) |
| Coin pixels, frame 31 (after pour) | 13,987; 96.9% of the water-slab reference 14,431 (criterion >= 80%); 98.8% of the in-air reference 14,154 |
| Coin and camera keyframed | no (`animation_data` None on coin, camera object and camera data); only water scale is keyed |
| Real refraction (not a fake lift) | control with water IOR 1.0 and everything else identical: 0 coin px after the pour; with 1.333: 13,987 |
| Calm surface during reveal | flat water surface, no ripple, no pour stream or splash modelled (stream/ripples not built in this spike) |

- Deviations recorded: (1) coin Ø 2.0 cm in a 2.02 cm design window is tight: placing it centred in the analytic window (extent 5.54-7.54 cm, far edge on the 7.55 cm limit) left 117 px visible before the pour (first 16 spp, 50% scale test); the brief's 5.4-7.4 cm placement (one edge 1.3 mm inside the hidden limit) gave 0 px, so keep the coin in that position or shrink it slightly if the camera distance changes. (2) The mug has no handle and no pour hand/jug.
- Visual notes (from `beauty_01/12/22/31`): the coin appears at the near-rim end of the water ellipse as a flat gold disc; exposure is too hot (cup saturates white), the water surface is heavily grained at 64 spp because Glass blocks shadow rays so the cup floor is lit only by noisy indirect light, and the coin has no visible edge thickness. These are look-development items, not feasibility failures.
- Render time (1080x1920, 64 spp, no denoise): 5.8 s (coin only, air), 10.8-12.5 s (beauty frames), 11.3-12.7 s (mask frames), 20.6 s (slab reference).

## Render budget (measured, not extrapolated into a schedule)

Trivial emissive scene 3.8 s/frame, glass+floor scene 13-15 s/frame, mug scene 11-13 s/frame, all 32-64 spp, no denoise, 1080x1920. About 1,000 frames of glass scenes at those settings is roughly 3.5-4 h on this M1 before any extra samples or denoising; visible grain at 64 spp means B01/B03 need more samples or a denoise/shadow strategy (not tested). First frame of a session adds about 135 s of Metal kernel compile.

## Risks and open items

1. Grain: Cycles glass blocks shadow rays; water scenes need more samples, OIDN denoise (temporal flicker untested) or a shadow-ray trick (untested).
2. Per-frame cost: 3.5-4 h per 1,000 water frames at current settings; sub-shots with static holds could be rendered once and held.
3. Packaging: PNG sequences are 1.8 MB/frame (noisy); proposed policy below.
4. `B_loop` media behaviour: media plays on the composition clock during the hold while scene clock freezes; B06's clip must provide the hold frames; S4 seam parity not tested.
5. MP4 must carry bt709/tv tags (see recipe).
6. S3 (diagram), S4 (seam), pool-edge B01 look with a child, ripples/pour stream and Studio remain unverified.

## Proposed packaging policy (not applied; no `.gitignore` edit, nothing committed)

- Commit: `build.py`, `.blend` sources (if small), `manifest.md`, `spike-manifest.json`, this results file.
- Do not commit: `assets/blender/**/renders/` (PNG sequences, about 100 MB per 60 frames); propose adding that path to `.gitignore`. `*.mp4` is already ignored; delivery clips under `public/pool-depth/*.mp4` are regenerated locally by `build.py` plus the ffmpeg recipe above and are listed in the manifest with codec, size and checksum.
- If the user needs clips in Git, use a Git LFS pattern for `public/pool-depth/*.mp4` rather than un-ignoring `*.mp4`.

## Local artifacts (ignored or untracked)

`assets/blender/pool-depth/renders/{s0,s1,s2}/` (PNG), `public/pool-depth-spike/s0.mp4` (ignored by `*.mp4`), `out/spike/` (ignored): `hold.mp4`, stills, extracted frames. Reproduce S0 Remotion checks with `npx remotion render|still scripts/pool-depth/spike/entry.tsx S0-Hold ...`.


---

# Second pass: D3 assets, S3 diagram geometry, S4 loop seam (Boss, 2026-10-28)

Branch `claude/pool-depth-short` after `148f3bc` plus uncommitted working tree. Same machine and tools (Blender 5.2.3 LTS headless, Cycles Metal, Apple M1 8-core GPU). Source `assets/blender/pool-depth/build.py`; contract `assets/blender/pool-depth/manifest.md` (decisions, deviations, packaging table); numbers `assets/blender/pool-depth/spike-manifest.json` (keys `d3_stills`, `d3_checks`, `s3`, `s4_dn_40spp`); Remotion overlay data `assets/blender/pool-depth/plate-quads-SH05.json`. Brief and sheet not edited. Pass here is geometry/numeric evidence plus stills looked at by Boss; it is not approval of the look, not Remotion integration (no clip rendered, none encoded), not Studio.

## Summary

| ID | Result | Key numbers |
| --- | --- | --- |
| D3 pool set + child + sign | **built, source-ready** | pool depth 1.0 m, IOR 1.333 closed volume, rippled (bump from 4 sines, <=4.2 mm), procedural sky + sun, two-post sign with two blank plates; child 1.25 m, shirt `#FF8FA3`; SH01 child height 756-791 px (rule >= 480), Y 291-1082 inside [269,1440]; feet on the deck (gap 0.0 m) |
| D3 oblique refraction (new, B01 camera) | **pass** | 6 floor markers, max error 0.65 px (limit 2 px); IOR 1.000 control max 0.23 px; lift 174-187 px; apparent/true depth 0.29-0.44 at 65-76 deg from vertical |
| S3 diagram geometry | **pass** (11/11 checks) | bar ratio 0.75019 (geometry) and 0.75007 (rendered coverage), limit 0.750 +/- 0.002; sight line vertical; Snell n = 1.33300 on every ray; no bar in any oblique frame |
| S4 loop seam | **pass** on stills | SH08 F209 vs SH01 F0: camera, lens, 29 child parts, water phase identical to 0.0 (transforms); pixels: max difference 1/255, mean 0.0099/255, 0 pixels above 2/255 |

## D3 assets

- Child `PD_Child_*`: faceless doll-like, built from ellipsoids and tapered limbs, no armature; standing 1.25 m (head top), knee 0.35 m, hip joint 0.62 m, eye 1.14 m, shoulder width 0.31 m; shirt `#FF8FA3`. Poses: `pose_stand(phase)` (idle sway +-1.5 cm of the upper body, period 30 frames) for SH01/SH08, `pose_seated(t)` (planar two-bone IK for the legs) for SH06. Contact: lowest foot vertex z 0.15000 = deck top, toes at y -0.03; seated pelvis lowest vertex z 0.153, thigh lower edge clears the deck corner by +1.5 mm over F0-F75, head and hair never inside the SH06 frame. Known cosmetic defect: a lighter patch on the shorts at the hip in SH06 F0-F40 (not fixed); the shirt reads as puffy sleeves from behind.
- Pool set `PD_Pool_*`: opaque basin (4 deck blocks + floor slab, deck top +0.15 m, depth 1.0 m); water = closed Glass volume (IOR 1.333, absorption colour) whose bottom and sides sit 1 cm inside the slab and walls (`DF-20261028-blender-cycles-water-spike` rule), top face rippled by a bump; shadow rays see Transparent so the floor and the child's shadow are lit without grain. Floor carries tile joints, a dark lane line and a checker patch, so the lift is readable. Sun `#FFE2B8` 50 deg elevation from upper-left rear plus procedural Nishita sky (no HDRI/no external file).
- Sign `PD_Sign_*`: two uprights, two rails, a **blank** depth plate (0.30 x 0.20 m) and a generic no-diving plate (red ring and slash, flat diver glyph, no text, no organization sign). Yawed -40 deg so both plates face the SH01/SH05/SH07 cameras. `plate-quads-SH05.json` carries the plate's four screen corners for every SH05 frame.
- Looked at (not only measured): `renders/d3/contact_A.png`, `contact_B.png` and full-size `SH01_F000.png`, `SH05_F000.png`, `SH06_F040.png`. The floor is clearly lifted and rippled at SH01; the sign and plates read; SH06 shows legs refracted at the water line. The look is serviceable, not final: saturated aqua water, grey-beige deck, simple child.

### Framing and plate numbers (projection, 1080x1920)

| Check | Result |
| --- | --- |
| SH01 child, F0 / F90 / F179 | height 756 / 773 / 791 px; X 479-721 at F0, X range over motion 467-740; Y top >= 290.5, bottom <= 1081.7 (band [269,1440]; 21 px clear of the label band) |
| Sheet camera `CAM-POOL-A0` target (-0.2,1.6,-0.9) | head top at Y 194 px (inside the label band): replaced by target (0.21,0.90,-0.22), recorded in the manifest |
| Depth plate width / frame width | SH05 F0 45.2%, F99 51.3% (>= 50% from F56); SH07 F0 57.9%, F89 53.9% (plate partly above the frame) |
| Refraction at the B01 camera, flat water, IOR 1.333 (floor marker, measured vs predicted) | errors 0.33, 0.04, 0.65, 0.04, 0.19, 0.11 px; IOR 1.000 control 0.23, 0.19, 0.09, 0.21, 0.23, 0.18 px (render 17.7 s) |

## S3 diagram geometry (SH02 / SH04), `build.py -- s3`

Orthographic camera 6.4 u tall (300 px/u), flat emissive palette. Every check reads the geometry back from the built Blender objects (tube end points via `matrix_world`), not from the solver variables, and rendered values come from an EXR coverage mask (linear, sub-pixel).

| Check | Result | Limit |
| --- | --- | --- |
| Bar ratio, geometry (true 2.0 u, apparent 1.50038 u) | 0.750188 | 0.750 +/- 0.002 |
| Bar ratio, rendered coverage (16,200.1 / 12,151.2 px of coverage) | 0.750068 | 0.750 +/- 0.002 |
| Sight line vertical in the straight-down state | dx = 1e-7 u (float32); rendered centroid x 179.96-180.07 px (expected 180.0) | dx < 1e-5 u, spread < 0.25 px |
| Ghost marker in the straight-down state | z -1.500375 u = -(2.0/1.333) | within 1e-5 u |
| Snell on SH02 exit ray (surface point solved from the eye position) | air 49.98 deg, water 35.07 deg, n = 1.333000; air ray flatter than the water ray | n within 1e-6 |
| Snell on the SH04 oblique sight line | air 40.00 deg, water 28.83 deg, n = 1.333000; apparent depth 1.3120 u | n within 1e-6 |
| Back-extension meets the apparent marker (SH02 F230; SH04 F340) | line crosses the marker vertical at z -1.17871 (SH02) / -1.31197 (SH04); ghost ball z equal within 6e-8 u; SH02 ghost centroid error 0.004 px | within 1e-6 u |
| No bar in the oblique state | no bar object at F340; 0 pixels of bar colours in the bar columns | 0 |
| Honesty rule over all 360 SH04 frames | last frame with bars F287, first frame with an oblique eye F289, 0 frames with both | 0 |

Frame time (1080x1920, 16 spp, no denoise): 1.2-2.4 s.

## S4 loop seam, `build.py -- s4 --samples 40 --denoise 1`

State of every frame is a pure function of (shot, frame); the seam compares the real SH08 path (pull-back from `CAM-NODIVE-END`, eased to `CAM-POOL-A0` at F90, hold) against SH01 F0. Settings: 1080x1920, 40 spp, OIDN GPU, fixed seed.

| Pair | Max diff / 255 | Mean diff / 255 | Pixels with any diff | Pixels > 2 | Pixels > 8 |
| --- | ---: | ---: | ---: | ---: | ---: |
| **SH08 F209 vs SH01 F0 (the seam)** | 1.0 | 0.0099 | 60,300 (2.9%) | 0 | 0 |
| Control: SH01 F0 rendered twice in two processes | 1.0 | 0.0117 | 71,374 | 0 | 0 |
| SH08 F209 vs SH01 F0 from the separate process | 1.0 | 0.0122 | 74,488 | 0 | 0 |
| SH08 F208 vs F209 (one ripple + sway step) | 137 | 1.745 | 900,068 | 357,830 | 177,237 |
| SH08 F090 vs F209 (hold start vs end) | 136 | 1.715 | 932,403 | 358,002 | 174,526 |
| SH01 F0 vs F1 (dolly + ripple step) | 137 | 1.719 | 956,244 | 357,985 | 174,541 |
| SH08 F0 vs F209 (pull-back entry, intended) | 222 | 47.3 | 2,073,291 | 2,033,046 | 1,937,591 |

- Camera matrix, camera vFOV and all 29 child parts' world matrices at SH08 F209 equal SH01 F0 with max absolute difference 0.0; water phase 0 in both (`(209+1) % 30 = 0`). The remaining 1 level (of 255) on 3% of pixels is GPU path-tracing/denoiser nondeterminism between renders (it also appears between two renders of the same frame in two processes), not a scene difference; it is far below H.264 quantization at crf 12. Suggested threshold for the encoded seam: mean abs diff <= 1/255 on the decoded video layer; not measured on encoded clips (none exist).
- One ripple step changes about 1.7/255 on average (up to 137 on refracted floor lines): the water is lively frame to frame. Whether it reads as shimmer in a clip, and OIDN temporal flicker, are unverified (no sequence rendered).

## Render-time measurements and estimates (1080x1920, M1 8-core GPU, warm Metal cache)

| Shot | Frames | Measured s/frame | Settings | Estimate |
| --- | ---: | ---: | --- | --- |
| SH01 pool edge + child | 180 | 19.8 (19.4-19.9) | 40 spp + OIDN | 59 min |
| SH05 sign close-up | 100 | 11.4 (11.2-11.6) | same | 19 min |
| SH06 legs and water | 80 | 34.3 (33.3-34.9) | same | 46 min |
| SH07 pictogram | 90 | 19.7 (18.7-20.7) | same | 30 min |
| SH08 pull-back + hold | 210 | 20.3 (19.5-21.6) | same | 71 min naive; 41 min if F90-F119 is rendered once and copied to F120-F209 (period 30, static camera) |
| SH02 cutaway | 300 | 2.3 | 16 spp | 12 min |
| SH04 cutaway | 360 | 1.2-2.4 | 16 spp | 14 min |
| SH03 mug (not built in this pass) | 300 | 11-13 (S2, 64 spp, no denoise, no pour stream) | unmeasured with the stream | 1-2 h (guess) |
| Total built shots | 1,620 | | | about 3.7 h (3.1 h with the SH08 trick) plus diagrams 0.4 h, plus SH03: 4.5-6 h |

Notes: a 128 spp raw render cost 54 s (SH01), 26 s (SH05), 104 s (SH06); OIDN at 40 spp was cheaper than raw at 128 spp for similar visible grain, so 40 spp + OIDN is the proposed look setting; 48 spp raw at half resolution still showed visible grain. A cold Metal kernel cache adds about 135 s once (S0 measurement). One of about 12 Blender starts crashed in Metal kernel compilation (NSException); re-running worked, so wrap long renders in a retry.

## Decisions applied (coordinator answers to Mark's open questions, 2026-10-28; recorded in `manifest.md`)

- Q4a: depth sign text `1.0 m` is rendered by Remotion; Blender provides a blank plate plus `plate-quads-SH05.json` (screen corners for SH05 F0-F99). Q4b: `ฉากสมมติ` only on B01 (SH01). Packaging: do not commit clips or renders (`renders/` gitignored, `*.mp4` ignored); the manifest has an empty clip table (codec, size, SHA-256, source command) to fill when clips are rendered. Q6: no pour SFX for now. Q7: if an EEVEE fallback is ever needed it covers SH01/SH05-SH08 only; SH03 stays Cycles (not needed so far).
- Notes for Mark/Film/Editor: Mark/Film: the sheet camera/box numbers for SH01, SH05 and the SH06 ankle depth do not hold (manifest, deviations 1-6; measured values given). Editor: SH05 text overlay must follow the quad (the push is 0.2 m); SH08 hold frames repeat every 30 frames; `B_loop`/label behaviour still unproven.

## Risks and open items (this pass)

1. No clip was rendered or encoded: S0 recipe is unchanged; the seam is proven on PNG stills only; encoded-seam parity, Remotion decode of these clips and `B_loop` hold behaviour with real B06 frames are unverified. Studio unverified.
2. OIDN temporal flicker and ripple shimmer across consecutive frames are untested (no sequence). If it flickers: more samples or a lower ripple speed (period 60 would halve it).
3. SH03 (mug demo) was not part of this pass: pour stream, jug, hand and a calm surface during the reveal are still to build; its S2 look items (hot exposure, grain) remain.
4. Look is not final: simple doll child (puffy sleeves, a lighter patch on the shorts in SH06 F0-F40), saturated water, grey deck. Rim light on the dark hair is weak.
5. Plate width < 50% for SH05 F0-F55 unless Mark/Film accept the camera nudge; the apparent floor ratio at the B01 camera (0.29-0.44) is stronger than the brief's 0.5-0.75 estimate.
6. Metal kernel-compile crash seen once (retry needed); cold-cache first frame about 135 s.
