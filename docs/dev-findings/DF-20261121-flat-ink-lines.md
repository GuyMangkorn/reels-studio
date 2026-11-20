# DF-20261121-flat-ink-lines — a rotring ink line paid a p5.brush stroke composite and a reseed each; `flatFill.ts` now draws it as a flat ribbon

- Owner: Boss; first observed: 2026-11-20 (user: what can be traded for a much faster render); last checked: 2026-11-21 (`claude/render-performance-tradeoffs-b17d08` on `381f046`; EDU-EP30 measured on a scratch checkout of `claude/ep30-continuation-493a12` `3b09948` with `BrushCanvas.tsx` and `flatFill.ts` copied in)
- Status: fixed for `rotring` splines (default on); open for the other brushes (`HB`, `pen`, `charcoal`, `cpencil`, `2B`, `marker` stay in p5.brush) and for a whole episode watched as video
- Type: tool-limitation (p5.brush 3.0.0: a stroke composite when a fill follows a line, and `seed` + `noiseSeed` before each line)
- Tags: render / p5.brush / painted 2D / profiling / ink line / look trade-off
- Scope: `src/painted/flatFill.ts` (`inkRibbon`, held-back stroke state), `src/painted/BrushCanvas.tsx` (`paintFlatLinesOff`, seed hint in `deferredSeeding`), `tests/flat-fill.test.ts`
- Consumers: every painted render through `BrushCanvas`; a shared `src/` change, so every cached scene re-renders once

## Trade-off
- **Given up:** the stamped-dot grain of the line. Edges are smooth instead of ragged; a line no longer mixes as pigment with what is under it. Thin outlines read slightly cleaner; wide strokes (EDU-EP30 wheat) keep their tone, width, thick ends and round caps but lose the dotted edge.
- **Kept:** call order with fills, the boil (the line's seed moves its pressure peak, edge wobble and width jitter), corner rounding, pressure profile, transform scale.

## Symptoms and evidence
- [DF-20261120-opaque-fill-composite](DF-20261120-opaque-fill-composite.md) left the stroke composite: about 1.2 ms whenever a fill follows a library line. EDU-EP30 frame 630 on `3b09948`: paint 18.9 s, of which `polygon:wash` 10.8 s (17,851 flushes), `spline` 3.3 s and `set` 2.5 s for 20,187 lines.
- The `set` time was not `set`: the deferred-seeding wrapper applied `seed` + `noiseSeed` (about 0.1 ms a pair) before each `set`.

## Change
- `inkRibbon` (pure, tested) turns a spline into device-space quads from the library's own numbers: corner rounding as `_createSpline`; dot diameter `pressure^2 * tip * weight` with the rotring's pressure 1 in a flat middle and 1.3 toward the ends (`stroke.js` `gauss`, `min_max [1.3, 1]`); tip = 0.15 × `brushScale`. Calibrated by eye against the library: opacity `0.45 + 0.3 × width px` (0.5 to 1), scatter width and a darkening of up to 32% on strokes wider than 1 px.
- The quads join the flat-fill queue as their own run (normal alpha blend, four jittered samples), so a part painted fill, outline, fill, outline never reaches the library.
- With lines on, `set` / `pick` / `stroke` / `strokeWeight` / `noStroke` stop in the wrapper and are sent only before a call that may draw with them. `deferredSeeding` hands a flat line its seed and does not seed the library for it.
- `paintFlatLinesOff` (paint-bench A/B) restores library lines; `paintFlatOff` still switches the whole wrapper off.

## Measurement (M1, `--gl=angle`, 1080×1920)
- **Stills, whole episode, every 60th frame** (`scripts/paint-bench.mjs <ID> <dir> --every=60`, then `--props='{"paintFlatLinesOff":true}'`):

| Episode | frames | paint ms, library lines → flat | still ms |
| --- | --- | --- | --- |
| EDU-EP30-SHORT | 33 | 11,099 → 1,741 (−84%) | 13,503 → 3,599 |
| EDU-EP21-SHORT | 22 | 151 → 113 (−25%) | 1,804 → 1,902 (export dominates) |

- **EDU-EP30 frames 400 / 630 / 1200, paint ms:** 427 → 169, 18,909 → 2,420, 3,295 → 834. Frame 630 after: scene JS 1.2 s, `wash` 0.5 s, `polygon:wash` 0.3 s, `spline` 0.2 s.
- **Video** (`renderMedia` direct, no scene cache, muted, concurrency 4, H.264 CRF 16, one run each, flat first on a cold browser; measured on the prototype before the last colour calibration, same geometry): EDU-EP30 frames 1185–1244 155.6 → 20.7 s (7.5×); frames 615–644 (B02-SH06 wheat) 521.0 → 19.3 s (27×).
- **Pictures:** not within render noise, by design. Stills PSNR library vs flat: EP30 22–29 dB on the four worst frames (wheat fields of wide strokes), EP21 34–38 dB. Viewed: whole-frame sheets of the three worst frames of each episode, 1:1 crops of EP30 frames 400, 600, 630 and 1200 and EP21 frame 600, and four consecutive video frames (615–618) for the boil. Sheets were `out/qa/ab-ep30-worst.png`, `ab-ep21-worst.png`, `ab-ep30-wheat.png`, `flat-lines-boil-f615-618.png` (not kept).

## Limits and follow-ups
- Only `rotring`. The pencil brushes are grain, which a flat ribbon would not imitate; `pen` is the nearest candidate.
- Calibration is by eye on two episodes in sepia and one in colour. Opacity and darkening are constants in `inkRibbon` and `flatFill.ts`; re-check on an episode with saturated wide strokes.
- Not watched: a whole episode as video (draft cut). Approved shots re-render with the new lines; a pinned shot keeps its old picture until re-rendered.
- `tip` reads the last `scaleBrushes` factor from `BrushCanvas`. A page that scales the brushes twice ([DF-20261116-brush-scale-cumulative](DF-20261116-brush-scale-cumulative.md)) would give flat lines the single-scale width.
- The `src/painted/edu18/stack.tsx` canvas is not covered.

## Planning impact
- Film/Boss: a rotring ink line now costs about as much as a small fill (about 0.01 ms); line count is no longer the budget to watch, scene JS is. Wide rotring strokes are a cheap way to draw grass, rain and hatching.
- Editor: first render after this change misses the scene cache for every painted scene.

## Re-check
- Date + branch/commit → method/result/coverage → status:
