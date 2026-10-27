# POOLDEPTH-SHORT feasibility spikes S0, S1, S2 (Boss)

Date: 2026-10-28. Branch `claude/pool-depth-short`, HEAD `59809c8` + untracked work. Blender 5.2.3 LTS headless (CLI, not MCP), Cycles Metal on Apple M1 GPU (8 cores), Remotion 4.0.538. Brief: `storyboards/pool-depth/short/visual-brief.md` `VB-POOLDEPTH-SHORT-R1` (not edited). Source: `assets/blender/pool-depth/build.py` (all geometry numbers computed there); computed output: `assets/blender/pool-depth/spike-manifest.json`; Remotion scratch entry (not in `src/Root.tsx`): `scripts/pool-depth/spike/entry.tsx`. Pass here is spike evidence, not approval of the final look. S3, S4 not run. Studio `unverified` (`DF-20261026-studio-emfile`); CLI stills/renders only.

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
