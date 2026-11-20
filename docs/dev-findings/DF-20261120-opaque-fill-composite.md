# DF-20261120-opaque-fill-composite — an opaque flat fill paid a p5.brush composite pass at every colour change; opaque washes are now drawn straight to the canvas

- Owner: Boss; first observed: 2026-11-20 (EDU-EP30 draft frames at 18–45 s); last checked: 2026-11-20 (`claude/charming-cartwright-93d6d6`; measured on a detached checkout of `2955862`, EDU-EP30 W5.3, with this change copied in)
- Status: fixed for fill-to-fill colour changes (`src/painted/flatFill.ts`); open for the composite an ink line needs when a fill follows it (about 1.2 ms each, inside p5.brush)
- Type: tool-limitation (p5.brush 3.0.0: one composite pass per colour change, `Mix.blend` → `applyShader`)
- Tags: render / p5.brush / painted 2D / profiling / wash / composite
- Scope: `src/painted/flatFill.ts` (new), `src/painted/BrushCanvas.tsx` (canvas context, wrapper order, `paintFlatOff`, `__paintMark` / `byLabel` in the profiler)
- Consumers: every painted render through `BrushCanvas` (all fills are flat washes since 6 Nov 2026); not `src/painted/edu18/stack.tsx`, which drives p5.brush on its own canvas

## Method
- `scripts/paint-bench.mjs EDU-EP30-SHORT <dir> --frames=400,630,1200` (1080×1920, M1, `--gl=angle`, one Chrome, profiled) in three variants: the original `BrushCanvas.tsx`; the new code with `--props='{"paintFlatOff":true}'` (new canvas context only); the new code. Pictures compared with `scripts/paint-bench-compare.mjs --list` and a per-pixel histogram.
- Micro-benchmark: a temporary block at the top of `paint` in `src/painted/edu30/shots/B02-SH06.tsx` (frame 630, the rest of the shot skipped): 3,000 `hardFill` 12 px quads in one colour, 3,000 alternating two colours, 3,000 calls alternating `inkLine` and `hardFill`, each under a `__paintMark` label (profiler `byLabel`: time in `polygon` + `spline`, call count). The block is not committed.

## Symptoms and evidence
- **Cause (library source):** `drawWashPolygon` (`node_modules/p5.brush/src/fill/wash.js`) calls `Mix.blend(color)` before it draws. When the colour differs from the last one, or the last mark was a stroke, `Mix.blend` runs `applyShader` (`src/core/color.js`): copy the canvas's dirty rect to a framebuffer, run the spectral pigment-mix shader over it, clear the mask. The polygon itself is eight draw calls into a half-float mask (`src/fill/gl_fill.js`, four jittered samples, stencil then cover). An opaque wash stores `-ln(1 - 0.9999)` in the mask, so the mix returns the fill colour: the pass changes nothing but edge pixels.
- **Micro-benchmark, ms per call (before → after):** one colour 0.050 → 0.010; alternating two colours 0.69 → 0.007; alternating line and fill 0.71 → 0.088. The micro picture is byte-identical (axis-aligned quads have no edge pixels).
- **The shipped bundle cannot be patched sensibly:** the app imports `dist/brush.esm.js`, one 113 KB minified line; a rebuild from `src/` needs rollup and glslify as new dev dependencies.

## Attempts and results
- **Flat-fill layer in `BrushCanvas` (adopted).** `flatFills()` in `src/painted/flatFill.ts` wraps the brush under the seeding, profiling and `drafted` wrappers. A `polygon()` whose only active mode is a wash of opacity ≥ 255 never reaches p5.brush: it is queued with its colour and device-space vertices (the wrapper mirrors `push`/`pop`/`translate`/`scale`/`rotate` and the fill/stroke/hatch/mass modes) and drawn to the canvas with plain alpha blending just before the next call that lets the library paint, or at `render()`. Order with ink lines holds: the library's pending marks are composited (`render()`) before a queue starts; the queue is drawn before the library paints again.
  - **Same coverage as the library:** four sub-pixel samples at alpha 0.9 each (`1 - 0.1^k` for k covered samples, exactly what the mask's log sum composites to). Convex polygons are a centroid fan (each pixel covered once), so a run of them is **one draw call whatever the colours**; non-convex ones use stencil-then-cover as the library does.
  - **Canvas context:** `BrushCanvas` now creates the canvas itself (`stencil: true`, `antialias: false`) and hands it to `brush.load()`. p5.brush only draws scissored rectangles to the canvas, so multisampling bought nothing; without it the direct polygons are sampled as the mask was.
  - **Why this route:** no dependency, no build step, nothing to re-apply when p5.brush is upgraded; it uses only the public API (`load`, `render`, `Color`, `getAngleMode`). A dist patch would be a diff of one minified line; a rebuilt bundle adds a toolchain. `paintFlatOff` (paint-bench only) switches it off for A/B.
- **Frames, profiled (paint ms = scene JS + brush calls; original → context only → adopted):**

| Frame | wash polygons / ink lines | original | context only | adopted | `polygon:wash` ms | still s |
| --- | --- | --- | --- | --- | --- | --- |
| 400 | 1,263 / 1,327 | 1,151 | 1,341 | **422** (−63%) | 649 → 45 | 3.9 → 3.6 |
| 630 (B02-SH06) | 50,245 / 20,187 | 57,259 | 47,771 | **32,403** (−43%) | 44,615 → 21,107 | 60.1 → 36.9 |
| 1200 | 14,432 / 5,023 | 13,921 | 14,318 | **4,971** (−64%) | 10,869 → 2,622 | 16.8 → 8.7 |

  - GPU wait after `render()` rises (630: 0.8 → 2.5 s; mean 0.8 → 1.5 s): batched GL work that used to be spread over the slow JS. It is inside the still times above.
  - Flat polygons: 630 49,871 convex + 279 stencil in 17,851 queue flushes; 1200 14,025 + 216 in 4,456; 400 1,109 + 140 in 367.
- **Pictures (original vs adopted):** PSNR 60.6 / 58.5 / 58.3 dB (frames 400 / 630 / 1200); about 1% of pixels change (17–25 thousand of 2.07 million), 95% of them by under 8/255; 50–70 pixels per frame by 16 or more, max 44 (one pixel pair at a far bird's edge, frame 630). All are polygon edge pixels: they now mix linearly in RGB instead of by pigment. Original vs context only: 76.6–83.1 dB, max 10, about 1–3 thousand channels (session noise is of this order, [DF-20261030-render-run-noise](DF-20261030-render-run-noise.md)). Sheet and 8× crop viewed: no visible change (`out/qa/opaque-fill-sheet.png`, `out/qa/opaque-fill-crop-f630.png`, not kept).
- **What is left in frame 630:** `polygon:wash` still reads 21 s because the queue's first polygon after an ink line triggers the library's stroke composite: 17,851 of them at about 1.2 ms (dirty-rect copy, pigment shader, two mask clears). That is the line's cost, not the fill's, and it existed before (then joined by a fill composite per switch). Shots that paint fill, outline, fill, outline per part pay it per part.

## Limits and follow-ups
- Not taken out of the library: washes under opacity 255 (`p.alpha < 1` fades), a polygon with stroke, hatch or mass on, `rect`/`circle`/`beginShape` shapes, anything through `ctx.textured` with a real `fill`. They still work, at the old cost.
- A flat queue starting after library marks calls `render()`, which also "dries" watercolour fills (`Mix.afterFlush`). Only the `textured` POC paints those.
- The wrapper trusts that the active p5.brush target is the `BrushCanvas` canvas. A page that also mounts the EDU-EP18 stack (its own `createCanvas`) is not covered by a test here.
- Fewer stroke composites need a scene-level change (paint a part's fills, then its lines: the far-bird experiment on `claude/ep30-stamp-experiment`, 73 → 37 s on its own, look review pending) or deferring a line's composite while later fills do not overlap its bounds (not tried: needs a safe bound for a spline's ink).
- Other episodes were not measured: three EDU-EP30 stills here and one EP30 scene as video (Re-check).

## Re-check
- Date + branch/commit → method/result/coverage → status:
- 2026-11-20, coordinator session, detached checkout of `2955862` with the four changed files of `196f425` copied in, scratch `REELS_STORE` → video render of EDU-EP30-SHORT scene 8 (B02-SH06, frames 592–666, 75 frames; `render.mjs --draft --range=592-666 --gl=angle --timeout=900000 --concurrency=2`): **1,521 s (20.3 s/frame)** against 3,344 s (44.6 s/frame) for the same scene in the EP30 draft cut earlier the same day with the original engine and the same flags. Both ran while another EP30 draft render used the machine: similar load, not controlled. Old vs new segment, 540×960, 75 frames: PSNR average 43.5 dB, min 41.0 (two separate H.264 encodes); frames 10, 38 and 70 of the scene viewed side by side, no visible difference → status unchanged (fixed for fill colour changes; stroke composite open).
