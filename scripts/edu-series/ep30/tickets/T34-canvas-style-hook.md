# T34 — a registered plate can restyle the shared canvas (newsreel filter, weave, shake, 1.05 overscan) through an optional `canvasStyle` hook
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: done
Class: capability · Hard: no
Blocked by: T03 (r2 fix pass first: both write `edu30/shot.tsx`) · Consumers: every registered EP30 plate; blocks T24 and T27 (see index)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); [T03 r2 decisions](T03-plate-adapter.md) (Q-B); [edu30/shot.tsx](../../../../src/painted/edu30/shot.tsx) (`PlateStack`, `makeShot`, `stackCam`); [PaintedStage.tsx](../../../../src/painted/PaintedStage.tsx); [shot.ts](../../../../src/painted/shot.ts) (`PaintedShot`); brief [VD30-11 step 5](../short/film-brief.md#vd30-11).

## Build
`PaintedStage` paints every plate on one shared `BrushCanvas` outside the plate's `Overlay`, so a registered plate cannot filter, weave, shake or scale its picture. Add one optional field `canvasStyle` to `PaintedShot`; `PaintedStage` always renders the canvas inside one stable wrapper `div` (so the single p5.brush canvas never remounts) and applies the first visible plate's `canvasStyle` to that wrapper when exactly one plate is visible. `makeShot` in `edu30/shot.tsx` supplies it, composes the same filter, weave, shake and overscan the QA `PlateStack` uses, and the registered `paint` uses `stackCam` (overscan-compensated camera) like the stack.
Files: `src/painted/edu30/registered-index.tsx` (new, registered-plate still entry for the proof), `src/painted/shot.ts`, `src/painted/PaintedStage.tsx`, `src/painted/edu30/shot.tsx`, `tests/painted-canvas-style.test.ts` (new), `docs/context-map.md` (add the test to the EP30 entry)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| New field | `PaintedShot.canvasStyle?: (props: ShotContext) => CSSProperties` (`ShotContext` as `Overlay` receives it: `tl`, `width`, `height`, `fps`); pure function of `tl`; absent = today's behaviour exactly | ticket |
| Wrapper | `PaintedStage`: `<div style={{position: 'absolute', inset: 0, ...style}}><BrushCanvas … /></div>` replaces the bare `<BrushCanvas>`; `style` = `{}` unless the rule below applies; the wrapper is rendered in every case (same element type and position, so no remount) | ticket |
| When it applies | `visible.length === 1` and that plate has `canvasStyle`: `style = shot.canvasStyle({tl, width, height, fps})` with the plate's own `tl` (after `shot.clock`). Two or more visible plates (a dissolve or crossfade) or a `fadeIn` layer: `{}` for the whole dissolve (EP30 plates are hard cuts; the Editor's transitions between EP30 plates are cuts) | ticket |
| EP30 style | `{transformOrigin: '540px 960px', filter: newsreelFilter(o), transform: [weave, shake, overscan].filter(Boolean).join(' ') \|\| 'none'}` where `o` = `{frame: G, strength, tint, tintAmount, tintMix, pop}` from `{...DEFAULT_REEL, ...def.reel(L)}`, `G = rowStart(def.id) + L`, `weave = newsreelWeave(o).transform` (dropped when `'none'`), `shake = translate(dx px, dy px) rotate(rot deg)` from `def.shake?.(L)`, `overscan = scale(1.05)` when `def.overscan`. Order is the stack's: weave outermost, then shake, then overscan | T03, VD30-11 step 5 |
| Registered paint | `paint: (p, ctx) => def.paint(p, L, stackCam(def, L))` (was `def.cam(L)`) | T03 Q-B |
| Registered Overlay | `NewsreelOverlay` → `Grain` 0.06 → titles, no `Grade` (T03 r2); unchanged otherwise; it never moves with weave or shake | T03 r2 Q-C |
| Shared helper | `PlateStack` and `makeShot` both call one new `canvasStyleOf(def, L, G): CSSProperties` (exported from `edu30/shot.tsx`) so the two paths cannot drift; `PlateStack` keeps `NewsreelPicture`'s element but reads `filter`/`transform` from the helper | ticket |
| Not in scope | other episodes' shots (none set `canvasStyle`), the Editor's caption shade, dissolves, `PaintedShot.Overlay` signature | ticket |

References: none (no look change; the QA stack picture is the reference).

## Proof
- `npx tsc --noEmit -p . > out/logs/T34-tsc.log 2>&1; tail -5 out/logs/T34-tsc.log`
- `node scripts/test.mjs tests/painted-canvas-style.test.ts`: (a) a stub shot with `canvasStyle` and one visible plate gives the wrapper that style; (b) two visible plates give `{}`; (c) a shot without `canvasStyle` gives `{}` and the wrapper is still present; (d) `canvasStyleOf` for B03-SH01 (overscan) at L 2 contains `scale(1.05)` and the shake translate; for B01-SH01 L 0 contains neither `scale(1.05)` nor a shake term.
- Registered vs QA frames of the same shot and L, clean (no guides, no tag, titles hidden by choosing a frame outside every title range): `B03-SH01` L 2 and L 40, `B01-SH01` L 0 and B07-SH01 L 4 (strength mid-burn-out). Render the registered plate through the same still path the EDU26 registered plates use (find it with `grep -n "edu26" scripts/README.md`) and the QA stack through `EDU30-B03-SH01` with `--props='{"guides":false,"tag":false}'`.
- `scripts/qa-sheet.sh out/edu30-T34/sheet.png --cols 4 --width 270 out/edu30-T34/*.png` and view it.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| B03-SH01 L 2, registered vs QA stack | tinted, grained, scratched picture; picture shifted by the round-0 shake | mean absolute difference registered vs QA ≤ 2 (0–255), PIL script, logged |
| B03-SH01 L 40, registered vs QA stack | no shake, 1.05 overscan on both | mean difference ≤ 2; a projected lead point (probe) equals the sheet value ± 1 px |
| B01-SH01 L 0 | newsreel look (sepia, no scale) | mean difference ≤ 2 |
| B07-SH01 L 4 | strength about 0.6: partly tinted | mean difference ≤ 2 |
| B01-SH01 L 0 titles-free frame | no vignette double: single `NewsreelOverlay` vignette | corner luma equals the QA stack ± 3 |

## Result (Boss fills)
- Commit: see the branch tip (`git log --grep T34`), worktree branch `worktree-agent-ae4ad9dbac4269975`, on `claude/ep30-continuation-493a12` at `8bbfa0d`.
- Built: `PaintedShot.canvasStyle` + pure `stageCanvasStyle` (shot.ts); `PaintedStage` always renders the stable wrapper div; `canvasStyleOf` shared by `PlateStack` and `makeShot`; registered `paint` uses `stackCam`. `PlateStack` now renders one `AbsoluteFill` with the helper style around the canvas (same composed transform as the old NewsreelPicture + inner div, weave outermost). New proof entry `src/painted/edu30/registered-index.tsx` (`EDU30-REG-<shot id>`: `PaintedStage` over a one-scene timeline, `C_seamless` so the pose clock is not held).
- Proof: `tsc` shows only 8 pre-existing errors in tests/ and scripts (`out/logs/T34-tsc.log`, none in src). `node scripts/test.mjs tests/painted-canvas-style.test.ts` 5/5 pass.
- Frames (registered vs QA stack, `out/edu30-T34/compare.log`): B03-SH01 L2 MAD 0.000; L40 MAD 0.378; B01-SH01 L0 MAD 0.000; B07-SH01 L4 MAD 0.000 (all <= 2); corner luma equal on all four (130.11, 130.11, 129.93, 133.90). Sheet (top row QA: B01 L0, B03 L2, B03 L40, B07 L4; bottom row registered): `out/edu30-T34/sheet.png`; store `~/ReelsStore/projects/edu/EDU/T34-canvas-style-proof/` (kind `T34-canvas-style-proof`).
- Values not followed as written: (1) no built shot sets `shake` yet (B03-SH01 is a T03 stub, T04 `shakeAt` comes with the T24 plate), so "picture shifted by the round-0 shake" and test (d)'s shake term on B03-SH01 L2 cannot show on the real def; test (d) asserts no shake on the real def and the exact `translate(3px, -2px) rotate(0.4deg) scale(1.05)` tail on a def with a synthetic shake. (2) B03-SH01 L40 (G 728) sits inside the "แผน 1" title range (704-734): the title shows on both frames (the comparison still holds); no title-free L is requested there. (3) The lead-point probe prints nothing for stubs (no leads recorded), so "lead point equals sheet value" is not measurable until a plate paints leads. (4) `canvasStyle` context is typed `ShotContext & {fps}` because `ShotContext` has no `fps`. (5) Test (c) checks the always-present wrapper by a source pattern on `PaintedStage.tsx` (no hook-free render). (6) The ticket's frame-script needed numpy and Pillow, installed in a scratchpad venv.
- Fix passes used: 0 · open question: none blocking; Film to confirm (1)-(3) are accepted until T24 supplies `shake`.
