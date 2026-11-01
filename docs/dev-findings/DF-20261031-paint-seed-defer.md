# DF-20261031-paint-seed-defer — painted frames are CPU-bound in p5.brush calls; deferred seeding cuts wash-heavy shots by 40%

- Owner: Boss; first observed: 2026-10-31 (p5.brush pipeline optimisation study); last checked: 2026-10-31 (`claude/p5-brush-rendering-optimize-fd68e1`, working tree on `e59b8bc`)
- Status: fixed (deferred seeding in `src/painted/BrushCanvas.tsx`); open for textured fills and hatching (cost of the look, no change made)
- Type: tool-limitation (p5.brush 3.0.0 `seed()`/`noiseSeed()` cost per call; per-polygon call overhead)
- Tags: render / p5.brush / painted 2D / profiling / seed
- Scope: `src/painted/BrushCanvas.tsx` (deferred seeding, `paintProfile`, `paintSeedEager`), `scripts/paint-bench.mjs`, `scripts/paint-bench-compare.mjs`
- Consumers: every painted render; heaviest gain on plates built from `flatKit` / `hardFill` washes (ZCPAINT B08 and the other city/interior plates)

## Method
- `scripts/paint-bench.mjs`: one bundle, one Chrome (`--gl=angle`), `renderStill` per frame at concurrency 1, one warm-up still. The `paintProfile` input prop wraps every brush call and records scene JS (shot geometry, colours), time inside p5.brush per call, per-layer splits (push depth 1 and 2), `brush.render()`, and `gpuWait`: a 1-pixel `readPixels` after `render()`. A matching `readPixels` before the frame drains earlier GPU work. GPU time is never inferred from synchronous JS timing.
- Pictures: `scripts/paint-bench-compare.mjs` reports changed channels, max channel difference and PSNR against an A/A pair of the same code. Byte equality is not usable because stills differ by a few LSB between sessions ([DF-20261030-render-run-noise](DF-20261030-render-run-noise.md)).
- Episode: ZCPAINT-SHORT-TH, 1080×1920, M1, p5.brush 3.0.0 (installed since `733808f`; no older version was ever used here).

## Symptoms and evidence
- **Where a frame goes** (72 frames, every 30th, eager baseline): mean paint 167 ms = scene JS 14 + brush calls 153; `render()` 0.2 ms; GPU wait 15 ms. A plain `renderStill` costs about 900 ms, of which about 750 ms is page setup, screenshot and PNG export (stills only; a video frame's overhead is far smaller).
- **B08 f1500 by layer** (scene JS / brush ms): sky 1.5/18, far 4/43, mid 8/84, blaze 3/30, near 21/314, fore (silhouette) 1/8. The background is 98% of the frame, and inside p5.brush **`noiseSeed` 219 ms + `seed` 96 ms** of 498 ms. `flatKit.fill` seeds before each of about 3,150 wash polygons.
- **Cause:** `seed()` refills two 512-entry gaussian pools and `noiseSeed()` builds two simplex tables (`node_modules/p5.brush/src/core/utils.js`), about 0.1 ms per pair. A wash-only polygon reads neither: `Polygon.show` → `wash()` → `queuePolygon`/`flushFill`, with no rng, noise or `seedHash` read (`src/fill/wash.js`, `gl_fill.js`).
- **Per-call cost after the fix** (frames 0, 150, 300, 1200, 1500, 1710): textured `fill()` polygon about 2 ms each (`solid()` 4–6 passes per cast part: 139 ms for 69 polygons at f150), hatch polygon 3.5–4.8 ms each, wash polygon 0.04 ms, `set` + `spline` about 0.2 ms per ink line.
- **Canvas density** (`paintScale`, preview only; the standalone runtime's `pixelDensity` is already 1 and cannot go lower): at 0.75 and 0.5, GPU wait falls 58% and 65% but paint JS only 3–5%. The frames are CPU- and driver-bound in p5.brush calls, not fill-rate bound.

## Attempts and results
- **Deferred seeding (adopted).** The brush handed to `paint` records `seed`/`noiseSeed` and applies them just before the next call that may read them. Pure setters and wash-only polygons skip them. A mirror of the fill/stroke/hatch/mass modes (saved by push/pop, reset to "unknown" by any unlisted call) decides "wash-only"; the frame starts with those modes off.
  - Stills, profiled (72 frames): paint 167 → 128 ms (−23%); GPU wait 15 → 25 ms (GPU work that used to overlap the slow JS); paint + GPU 182 → 153 ms. B08 f1500–1620: about 540 → 330 ms (−40%); f1650–1770 −17%; f2040–2130 −25%; cast-heavy frames (0–330) unchanged.
  - Video (`remotion render`, `--gl=angle`, concurrency 4, incl. bundle, two alternating reps): B08 f1440–1679 81.1 / 76.2 s → 68.7 / 68.4 s (**−13%**); f0–329 42.6 / 43.3 s → 41.9 / 43.9 s (no change). Plain stills: 896 → 901 ms (export overhead dominates).
  - Picture: eager vs deferred, 72 frames: 44 differ, max 7/255, worst 83.4 dB. A/A, same eager code in two sessions: 42 differ, max 5/255, worst 85.4 dB. Differences fall on the same frames with the same magnitudes, so they are render noise, not a look change.
- **One target, one `render()`:** already the architecture. BrushCanvas clears, paints the whole scene and calls `render()` once per frame (0.2 ms). The mid-frame composites happen inside p5.brush on every colour change, whatever the `render()` boundary, so nothing is gained there.
- **Not done:** p5.brush 2.2.3 comparison (cancelled by the user, 31 Oct 2026); a vendor patch memoising seeds (the dist bundle is minified, and deferral already removes the cost from wash fills); fewer `solid()` passes or hatch density (changes the look: Film's call); `p5.Framebuffer` or DOM layers (excluded; see [DF-20261031-render-speed](DF-20261031-render-speed.md)).

## Planning impact
- Boss/Editor: no change to how shots are written. `brush.seed`/`noiseSeed` inside `paint` are now cheap when a wash follows; keep seeding per element as before.
- Film/Mark: the cost to budget is textured fills (about 2 ms per polygon per pass) and hatch polygons (about 4 ms), not washes or ink lines. A cast part painted with 6 `solid()` passes costs about 12 ms per frame.
- Re-measure with `node scripts/paint-bench.mjs <ID> out/bench/<name> --every=30`, then `--props='{"paintSeedEager":true}'` for the old path, and compare with `scripts/paint-bench-compare.mjs`.
