# T01 — the newsreel screen layer lives in the kit with exposure pop, flare and a warm-to-cool mix
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
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
| strength 0 | identity: filter `none`, weave transform `none`, overlay renders nothing | b07 B07-SH01 (from local 10 no grain, weave, tint) |
| Layer order | the T03 adapter composes Grade → NewsreelPicture(plate canvas) → NewsreelOverlay → Grain → titles (T02); captions, mark and label are the Editor's, above all | brief technical handoff, Composition seam |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/LF01a.png` (warm, full tint), `projects/edu/EDU/previews/EDU-EP30-W3-r1/thumbs/TP3.png` (cool).

## Proof
- `npx tsc --noEmit -p . > out/logs/T01-tsc.log 2>&1; tail -5 out/logs/T01-tsc.log`
- `node scripts/test.mjs tests/newsreel.test.ts` (`node:test` + `node:assert/strict`): (a) `newsreelFilter({frame: 0})` equals the pre-move string byte for byte; (b) `strength: 0` returns the identity; (c) `pop: 0.08` appends `brightness(1.08)`; (d) `tintMix: 0.5` lies between the warm and cool strings value by value.
- `sh scripts/edu-series/ep30/short/render-looks.sh T01 LF01a` (writes `out/edu30/looks/T01/LF01a.png`) and compare with the store LF01a.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| LF01a re-render | identical look to the locked still | mean absolute pixel difference vs store LF01a ≤ 2 (0–255), short PIL script, number logged |
| tests (a)–(d) | as listed | all pass |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
