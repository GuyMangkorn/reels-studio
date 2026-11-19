# T01 — the newsreel screen layer lives in the kit with exposure pop, flare and a warm-to-cool mix
Deliverable: EDU-EP30-SHORT · Revision: r2 · Status: done (r2: baseline filed, proof numbers recorded; no code change)
Class: capability · Hard: no
Blocked by: none · Consumers: every plate B01-SH01 … B06-SH04 (strength 1), B07-SH01 (burn-out); T03 adapter
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); brief [VD30-01](../short/film-brief.md#scene-decisions), [VD30-11 step 1](../short/film-brief.md#vd30-11) (exposure pop), [W3.2 look lock](../short/film-brief.md#w32-look-lock) (VD30-01a: `tintAmount` 1); [edu30/newsreel.tsx](../../../../src/painted/edu30/newsreel.tsx).

## Build
Move the locked look asset `src/painted/edu30/newsreel.tsx` into the shared kit `src/painted/kit/screen.tsx` unchanged in look (brief VD30-01: build once in `kit/screen.tsx`, shared with concept C112) and add two inputs. `edu30/newsreel.tsx` becomes a re-export so `edu30/look.tsx` and the W3 stills keep working unedited.
Reuse the existing `newsreelFilter`, `newsreelWeave`, `NewsreelPicture`, `NewsreelOverlay` bodies verbatim, then extend.
Files: `src/painted/kit/screen.tsx`, `src/painted/edu30/newsreel.tsx`, `tests/newsreel.test.ts` (new)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Existing inputs kept | `frame`, `strength` 0..1, `tint` `'warm' \| 'cool'`, `tintAmount` 0..1 (default 1), `seed` (default 30) | edu30/newsreel.tsx, VD30-01a |
| New input `pop` | number 0..0.2, default 0: CSS `brightness(1 + pop × strength)` appended to the filter chain after the tint | VD30-11 step 1 |
| Pop values the plates pass | round frame (k 0) 0.08, k 1 0.03, else 0 (from T04 `popFor`); the layer holds no round logic | VD30-11 step 1 |
| New input `tintMix` | 0..1; default 0 for `tint: 'warm'`, 1 for `'cool'`; the filter interpolates the warm and cool sepia/hue/saturate values linearly by `tintMix`, and the vignette colour `40,24,10` → `16,18,22` by the same mix | b05 B05-SH03/SH04 (cool), b06 B06-SH03 (tint cools over local 95–98), B06-SH04 (cool) |
| Plate tint schedule | warm (`tintMix` 0): B01-SH01 … B05-SH02, B06-SH01, B06-SH02, B06-SH03 local 0–94 · mix 0 → 1 linear over B06-SH03 local 95–98 · cool (1): B05-SH03, B05-SH04, B06-SH04, B07-SH01 local 0 (burn-out start) | sheets |
| Flare for the burn-out | no new input: B07-SH01 passes `pop` 0.15 on local 0, 0.10 on 1, 0.05 on 2, 0 after, and `strength` 1 → 0 linear over local 0–9 | b07 B07-SH01 Newsreel burn-out |
| strength 0 | identity: filter `none`, weave transform `none`, overlay renders nothing. Accepted (r2): callers of the old `strength: 0` string are only `tests/newsreel.test.ts` and the T03 CAL reel (`calibration.ts`, wants plain colour); `look.tsx`, the W3 stills and every plate use strength > 0 or the default 1 | b07 B07-SH01 (from local 10 no grain, weave, tint) |
| Layer order | the T03 adapter and T34 compose NewsreelPicture(plate canvas) → NewsreelOverlay → Grain → titles (T02); no Grade (r2, TF16); captions, mark and label are the Editor's, above all | brief technical handoff, Composition seam |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/LF01a.png` (warm, full tint), `projects/edu/EDU/previews/EDU-EP30-W3-r1/thumbs/TP3.png` (cool).

## Proof
- `npx tsc --noEmit -p . > out/logs/T01-tsc.log 2>&1; tail -5 out/logs/T01-tsc.log`
- `node scripts/test.mjs tests/newsreel.test.ts` (`node:test` + `node:assert/strict`): (a) `newsreelFilter({frame: 0})` equals the pre-move string byte for byte; (b) `strength: 0` returns the identity; (c) `pop: 0.08` appends `brightness(1.08)`; (d) `tintMix: 0.5` lies between the warm and cool strings value by value.
- `sh scripts/edu-series/ep30/short/render-looks.sh T01 LF01a` (writes `out/edu30/looks/T01/LF01a.png`) and compare with the store LF01a.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| LF01a re-render | identical look to the locked still | r2: mean absolute pixel difference vs the **T01 baseline** (below) ≤ 2 and vs the pre-move render of `63fa4f6` ≤ 0.5 with max ≤ 8 (0–255), short PIL script, numbers logged. The locked store still `LF01a.png` is not the reference any more (drifted, 3.58 from both old and new code) |
| tests (a)–(d) | as listed | all pass |

## r2 decision (Film, 2026-11-19): re-baseline, do not re-key
The store LF01a is a drifted old render of a picture the user already approved; new code and the pre-move code agree (max 8 / 255, mean under rounding), so the move is clean and the locked picture is unchanged. The store still stays untouched (it is the user's approved picture). The proof baseline is the current render, filed once:
`python3 -I scripts/store.py put out/edu30/looks/T01/LF01a.png projects/edu/EDU/previews/EDU-EP30-W3-r1/LF01a.baseline-63fa4f6.png` with a sidecar: "LF01a render of the pre-move code at 63fa4f6 on 2026-11-19; baseline for the T01 ≤ 2 proof; the approved still LF01a.png differs by mean 3.58 (store drift)". Every later extension of `kit/screen.tsx` compares against this baseline, not LF01a.png. Result r2 line to add: baseline path, mean new-vs-baseline (expect 0), mean new-vs-old (expect < 0.5).

## Result (Boss fills)
- Commit: the commit that carries this edit on branch `worktree-agent-a2532a012de0fa7ed` (2026-11-19, Boss, Sonnet medium). Fix passes: 0.
- Built: newsreel layer moved into `src/painted/kit/screen.tsx` with `pop` and `tintMix`; `src/painted/edu30/newsreel.tsx` is a re-export; `tests/newsreel.test.ts` (4 tests (a)-(d), all pass). `tsc`: 22 errors, all in untouched files (tests/loudness, tests/render-options, ...), none in the changed files (`out/logs/T01-tsc.log`).
- Proof frame: `out/edu30/looks/T01/LF01a.png` (worktree, archived to the store with `store.py archive`).
- Measured: mean abs diff vs store LF01a = 3.58 (limit 2): NOT within range. The same still rendered from the pre-move code (HEAD) differs from the store by the same 3.58, and new vs old render differs by max 8 / 255 at one pixel value (mean not above rounding), so the gap is store-still drift, not this change.
- Deviations to note: strength 0 now returns filter `none` and weave `none` (ticket rule) which changes the old `strength: 0` output from a no-op-looking string; the cool string is byte-identical to the old one at `tint: 'cool'` (tintMix 1); `hue-rotate` appears only when `tintMix` > 0.
- Open question for Film: the LF01a store still is not reproducible within <= 2 from the locked code (3.58 with old code too). Re-baseline the proof number on the current render, or re-key the store still? (Answered r2: re-baseline.)
- r2 pass (Boss, Sonnet medium, 2026-11-19, fix passes: 0): no code change. Baseline rendered from the pre-move code (detached checkout of `63fa4f6`, `render-looks.sh T01old LF01a`) and filed with `store.py put` at `projects/edu/EDU/previews/EDU-EP30-W3-r1/LF01a.baseline-63fa4f6.png`; the sidecar `.json` with the ticket's wording was copied into the store beside it (`put` stores no sidecar from the file path alone). The moved code was re-rendered from this branch (`render-looks.sh T01 LF01a`, `out/edu30/looks/T01/LF01a.png`).
- Proof numbers r2: mean abs diff new vs baseline = 0.0004 (limit <= 2), max 8 / 255; new vs the pre-move render of `63fa4f6` = 0.0004 (limit <= 0.5), max 8 (limit <= 8). The baseline is that pre-move render, so both numbers are one measurement; not exactly 0 because of one-value rounding at isolated pixels. For reference, new vs the approved store `LF01a.png` = 3.53 (drift, not a pass criterion). Measured with a PIL/numpy script in a scratch venv (PIL is not installed system-wide).
- Open question: none.
