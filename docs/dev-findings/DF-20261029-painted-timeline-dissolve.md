# DF-20261029-painted-timeline-dissolve — painted plates in the timeline: one canvas, in-canvas dissolves, ink alpha and sub-level nondeterminism

- Owner: Boss; first observed: 2026-10-29; last checked: 2026-10-29
- Status: workaround (dissolves and drains work; translucent-plate frames are not byte-identical between renders)
- Type: tool-limitation / integration-gap
- Tags: 2D / painted / p5.brush / transitions / determinism / tooling
- Scope: branch `claude/shipwreck-boss-painted` from `82c3ceb` (uncommitted at time of writing); p5.brush 3.0.0 standalone, Remotion 4.0.538, `--gl=angle`; `src/painted/PaintedStage.tsx`, `src/painted/painter.ts`, `src/scenes/painted.ts`
- Consumers: SHIPWRECK-SHORT (VB-SHIPWRECK-SHORT-R1) VD01, VD08; SH03b → SH04a, SH06, SH07b, SH09b dissolves

## Symptoms and evidence
- One canvas per composition: p5.brush has one global WebGL runtime, and `SceneRenderer` premounts the next scene (`premountFor`), so a `BrushCanvas` inside each scene would mount twice and steal the canvas. Fix: `PaintedStage` mounts one canvas at the renderer level and paints the plates of the current frame (`paintedStateAt`); painted scenes render transparent above it.
- Ink alpha: `brush.set(name, 'rgba(...)', w)` parses the alpha but strokes draw at full strength. Seen as full-strength ship outlines on a drained plate and jar outlines popping in at the first dissolve frame. Workaround: `makePainter` mixes the ink colour toward the base paper by `1 - alpha` (`mixColor`).
- Nondeterminism: frames where a plate is painted at alpha < 1 (drain F174, dissolve F207 of `PAINTED-PLATES-Shipwreck`) differ between two cold renders by at most 2–3 levels on about 170–1,040 px. Full-alpha frames are byte-identical: F0, F122, F446 (seek still equals sequential render) and spike F225 rendered twice. Rounding wash/fill opacities to integers did not change this. p5.brush reseeds every generator in `seed()`, so unseeded JS randomness is unlikely. Hypothesis: GPU blend precision on translucent layers. Not confirmed.
- Reproduce: `npx remotion bundle src/painted/spike/index.ts --out-dir out/painted-boss/bundle`, then render the same frame twice: `npx remotion still out/painted-boss/bundle PAINTED-PLATES-Shipwreck a.png --frame=207 --gl=angle`. Compare with `cmp`.
- Coverage: CLI stills and sequence renders only. Studio seeking not checked. Short only.

## Attempts and results
- Integer opacities → no change (reverted).
- Visual effect of the variance: none seen. MAD 0.00 at 1/4 scale, and no pixel changes by more than 8 levels.

## Planning impact
- Film: in-canvas dissolves (VD08) and the B03 drain are feasible and read cleanly. The SH06 jar interior is identical through the match (MAD ≤ 0.18/255). Two canvases are still impossible: use `painted.shots[].dissolveSec`, not `transitionIn`.
- Mark: N/A (Light tier).
- Follow-up: before claiming frame-identical re-renders of dissolve ranges, try `--gl=swangle` on a dissolve frame (this deviates from the `--gl=angle` default, so record it), or accept the variance with a recorded tolerance. Owner: Boss.

## Revalidation history
- 2026-10-29 `claude/shipwreck-boss-painted` (uncommitted) → cmp pairs listed above → workaround.
