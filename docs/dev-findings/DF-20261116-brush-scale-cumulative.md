# DF-20261116-brush-scale-cumulative — character ink lines look thick and drawn over many times

- Owner: Boss; first observed: 2026-11-16 (EDU-EP18-SHORT final cut, user note); last checked: 2026-11-16
- Status: workaround (EP18 only; shared kit unchanged)
- Type: implementation-bug
- Tags: 2D / painted / p5.brush / tooling
- Scope: branch `claude/edu-ep-18-continue-38a53a`, uncommitted; `src/painted/PaintedStage.tsx:52`, `src/painted/BrushCanvas.tsx`, `src/painted/edu18/stack.tsx`
- Consumers: EDU-EP18-SHORT all 24 shots; other episodes that mount a second brush canvas under `PaintedStage` are unchecked.

## Symptoms and evidence
- Full-size ink edges (hair, face, coat, canoe, wire) show a ragged band 4–7 px wide at 1080×1920 that reads as one line traced several times. Row profiles (luma < 90) across the B03-SH03 coat edge: dark runs 4–7 px before the fix, 1–4 px after. Look frames (no BrushCanvas) were clean.

## Attempts and results
- Root cause (confirmed): `brush.scaleBrushes(n)` multiplies p5.brush's single global brush table on every call. `PaintedStage` always mounts a `BrushCanvas` (scale 5), then the EP18 `PaintedStack` created a canvas and scaled by 5·k again, so brushes ran at 25×. Kit ink (`rotring`, weight 0.15) at 25× gives 3.75 px dots, ±1.25 px jitter and 10 % dropouts.
- EP18 fix: the stack scales only the missing factor (k if `canvas#brush-canvas` already exists, else 5k) and draws ink with its own `edu18-ink` brush (prop `edu18Ink`: `single` default, `hair`, `double` for the old look). Evidence: `out/ep18/lines/ab-sheet.png`; store `projects/edu/EDU/ep18-ink-single-ab/`.
- Not fixed: the check assumes the BrushCanvas mounts before the stack. Draft renders of `BrushCanvas.tsx` carry the same fixed-scale problem for other episodes (untouched).

## Planning impact
- Film: none; the approved look frames were already 5×.
- Follow-up: Boss to audit other episodes for two canvases on one page before their next final render; guideline: never call `scaleBrushes` twice on one page.

## Revalidation history
- 2026-11-16, working tree → six-shot A/B stills at full size → workaround in EP18; final cut re-render pending.
