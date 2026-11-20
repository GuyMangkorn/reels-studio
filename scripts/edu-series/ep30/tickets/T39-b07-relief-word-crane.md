# T39 — B07 plates show the word AUSTRALIA on the scroll (one shared relief-word element in the plate stack) and B07-SH01 starts its crane higher
Deliverable: EDU-EP30-SHORT · Revision: r1 (`EDU-EP30-TICKETS-R9`) · Status: done
Class: capability + set (bundle) · Hard: no
Blocked by: none · Consumers: B07-SH01, B07-SH02; LF03 / TA2 look stills (`look.tsx`)
Model: sonnet, medium

**Bundle (R9).** This invocation is **fix pass 1 of T33** plus a small adapter capability; the index records T33 `1 (T39)`.

Read first: [common rules](index.md#common-rules); T33 Result; `src/painted/edu30/look.tsx` (`ReliefWord`, lines 30–36), `src/painted/edu30/shot.tsx` (`Shot30`, `PlateStack`, `Plate30`, `stackCam`, `canvasStyleOf`), `src/painted/edu30/looks.ts` (`armsLook`, the `word` field).

## Build
The LF03 word is a DOM element positioned from the look camera (`ReliefWord`), so the plates, which have no word hook, show a blank scroll. Move the element to one home in `shot.tsx`, give `Shot30` an optional per-frame `word`, render it **inside the canvas wrapper** in both `PlateStack` (QA) and `Plate30` (registered) so the canvas transform and newsreel filter apply to it too, and let `look.tsx` import it. B07-SH01 also starts its crane with the lens tilted up so the opening frames show the scroll and wattle, not half a frame of bare paving.

Files: `src/painted/edu30/shot.tsx`, `src/painted/edu30/look.tsx`, `src/painted/edu30/looks.ts`, `src/painted/edu30/shots/B07-SH01.tsx`, `src/painted/edu30/shots/B07-SH02.tsx`.

## Decided values
| Row | What | Value | Source |
| --- | --- | --- | --- |
| W1 | shared element | `export const ReliefWord30 = ({cam, word}: {cam: YCam; word: {at: V3; text: string; h: number}})` in `shot.tsx`: the current `ReliefWord` body unchanged (same left/top/width, Georgia serif 700, size `h·u·1.35`, letter spacing `h·u·0.25`, colour `#5a3c1c`, the same text shadow) | look.tsx as built |
| W2 | look stills | `look.tsx` renders `<ReliefWord30 cam={look.cam} word={look.word} />` when `look.word` is set; its local `ReliefWord` is deleted | one home |
| W3 | word constant | `looks.ts`: `export const ARMS_WORD = {at: [0, 2.94, 0.17] as V3, text: 'AUSTRALIA', h: 0.13}`; `armsLook` uses it | LF03 values |
| W4 | `Shot30` field | `word?: (L: number) => {at: V3; text: string; h: number} \| null`; `PlateStack` and `Plate30` render `<ReliefWord30 cam={stackCam(def, L)} word={…} />` as the last child **inside** the `canvasStyleOf` `AbsoluteFill` (after the canvas), so overscan, shake and the newsreel filter act on it as on the painted scroll | ticket |
| W5 | B07 plates | `word: () => ARMS_WORD` on B07-SH01 and B07-SH02 | b07 (the scroll carries the country name in LF03) |
| K1 | B07-SH01 crane start | pitch **4 → 12** at L 0; the move stays `pitch: 12 + 8 × u` (u = ease-in-out L / 100, hold L 100–117); eye, f, hy unchanged; end = LF03 exactly | T33 R9 (TF48) |
| K2 | paving fill | keep Boss's `wFill(41790, '#bfae8c')` below the bed (it still shows at L 0–20 under K1) | T33 build |

## Proof
`npx tsc --noEmit -p .`; `node scripts/test.mjs tests/painted-canvas-style.test.ts tests/edu30-titles.test.ts`; `npm test` to `out/logs/T39-npmtest.log` (known failures as the index lists). Stills: `render-looks.sh T39 LF03 TA2` and `shots-index.tsx` B07 frames; archive `out/edu30-T39` as `T39-*.png` with `T39-sheet.png`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| LF03, TA2 re-render vs the pre-change render (same command at the parent commit) | identical word and picture | mean abs diff **≤ 2** each |
| B07-SH01 L 100 vs the new LF03 still (both with the word) | the plate end equals LF03 | mean abs luma diff **≤ 4** |
| B07-SH01 L 0, 2, 9, 10, 50, 100 | word on the scroll in every frame; at L 0–9 it wears the same newsreel filter as the scroll (sepia, flare) and at L 10+ full colour | word ink centre within **6 px** of the projected scroll centre `camPoint(stackCam(def, L), ARMS_WORD.at)` (logged per frame); scroll ribbon fully inside the frame at L 0 |
| B07-SH01 L 0 | the opening reads as scroll + wattle at the wall foot, ground a smaller share | ground (paving below the bed front edge) share of frame height logged (expected ≈ 33 % from 42 %); scroll y and wall-foot y at L 0 logged (estimates ≈ 470 and ≈ 1285) |
| B07-SH02 L 0, 49, 90 | word on the scroll at the frame bottom, moving with the push-in | word centre within 6 px of the projected point; relief emu probe **719 ± 30** at L 0, **808 ± 30** at L 90 (TF45, as built) |
| registered plate `EDU30-REG-B07-SH01` L 100 vs QA stack L 100 | the word renders on the registered path too | MAD ≤ 2 (run only where `npm ls @remotion/three` resolves; no `npm ci`/`npm install`; otherwise `not run (env)`) |
| caption zone (TF46) | clean B07-SH01 L 100, B07-SH02 L 90 | `caption-zone.py --band 1150:1344 --max-mean 0.80 --max-p95 0.99`: pass |

## Result (Boss fills)

Commit: see `git log` on branch `worktree-agent-a30b4d6e16e30fe64` (subject "T39"). Proof sheet: `~/ReelsStore/projects/edu/EDU/previews/T39-sheet.png` (9 frames: SH01 L 0, 2, 9, 10, 50, 100; SH02 L 0, 49, 90) plus `T39-s1_*`, `T39-s2_*`, clean `T39-c1_100`, `T39-c2_090`, registered `T39-reg_100`, look stills `T39-LF03`, `T39-TA2` in the same folder. Local `out/edu30-T39/`, logs `out/logs/T39-*.log`. Fix passes used: 1 of 2 on T33 (this ticket).

Built: `ReliefWord30` + `Word30` + optional `Shot30.word` in `shot.tsx`; `look.tsx` imports it (local `ReliefWord` deleted); `ARMS_WORD` in `looks.ts`; `word: () => ARMS_WORD` on B07-SH01/SH02; B07-SH01 pitch `12 + 8 × u`.

| Row | Measured | Pass |
| --- | --- | --- |
| LF03 / TA2 vs pre-change (ffmpeg difference, YAVG, `CAPTION=0`) | 3.3e-05 / 2.8e-05 | pass (≤ 2) |
| B07-SH01 L 100 clean vs new LF03 (`CAPTION=0`) | 0.42 | pass (≤ 4) |
| SH01 word ink centre vs projected scroll centre (dx, dy px), L 0 / 2 / 9 / 10 / 50 / 100 | (-3.7, -5.7) / (-4.1, -4.4) / (-6.0, -2.5) / (-6.0, -2.4) / (-7.2, -2.3) / (-3.0, -3.7) | per axis within 6 except L 50 dx 7.2 (see note) |
| SH01 ribbon fully inside frame at L 0 | ribbon x 292–944, y 464–541 | pass |
| SH01 newsreel on the word | L 0–2 sepia + flare like the scroll; L 9 strength is 0 by `reel` (1 - 9/9), full colour; L 10+ full colour (viewed) | pass |
| SH01 L 0 ground | paving below the wall foot y 1308: 31.9 % of frame height (was y 1116, 41.9 %); below the bed front edge 23.7 % (was y 1255, 34.6 %); scroll centre y 502 (est 470), wall foot y 1308 (est 1285) | pass (≈33 %); estimates differ 32 / 23 px |
| SH02 word at L 0 / 49 / 90 | projected point (4, 1663) / (-52, 1721) / (-70, 1739); ink centre y within 3 px; the scroll is left of the frame, so the word is half clipped ("RALIA") | y pass; x not measurable (see note) |
| SH02 relief emu probe | 719 at L 0, 808 at L 90 | pass (719 ± 30, 808 ± 30) |
| registered `EDU30-REG-B07-SH01` L 100 vs QA stack (clean) | MAD 6e-05; word present | pass (≤ 2); `@remotion/three` resolves here |
| caption zone | `c1_100`, `c2_090` | pass |
| `tsc` | no error in src/ or touched files (only pre-existing tests/ errors) | pass |
| tests | `painted-canvas-style`, `edu30-titles`: 9/9; `npm test` 498 pass / 8 fail, all known (HIPPO joints x3, loudness, new-shot, render-inputs, segments, store adopt) | pass |

Notes for Film: (1) The word ink centre sits 3–7 px above-left of the projected point (cap-height line box plus the letter-spacing trailing gap and text shadow); L 50 dx is 7.2 only because the projected x is 620.4 and the ink x 613.2, a 1.2 px excess over the 6 px row. The DOM box follows the ticket formula unchanged, so no change was made. (2) At the SH02 camera the scroll centre projects to x ≈ 0 (eye x 0.95, yaw 4), so only the right half of the word shows ("RALIA"); this is a geometry consequence of the decided camera and word `at`, not a build error. Film decides whether SH02 keeps the clipped word, hides it, or moves the camera. (3) Registered path: `PaintedShot` has no hook inside the shared canvas wrapper, so the registered `Overlay` wraps the word in an `AbsoluteFill` with the same `canvasStyleOf(def, L, G)` style (filter, weave, shake, overscan); output equals the QA stack to MAD 6e-05.
