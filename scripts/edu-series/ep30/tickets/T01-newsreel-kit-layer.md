# T01 — the newsreel screen layer lives in the kit with exposure pop, flare and a warm-to-cool mix
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: capability · Hard: no
Blocked by: none · Consumers: every plate (B01-SH01 … B06-SH04 at strength 1; B07-SH01 burn-out); T03 adapter
Model: sonnet, medium

Read first: [index common rules](index.md#common-rules), brief [VD30-01](../short/film-brief.md#scene-decisions) and [VD30-11 step 1](../short/film-brief.md#vd30-11) (exposure pop).

## Build
Move the locked look asset `src/painted/edu30/newsreel.tsx` (W3, user-locked as VD30-01a: `tintAmount` 1) unchanged in look into the shared kit `src/painted/kit/screen.tsx` (brief VD30-01: "build once in `kit/screen.tsx`", shared with concept C112), and add three inputs. `edu30/newsreel.tsx` becomes a one-line re-export so `edu30/look.tsx` and the W3 stills keep working without edits.
Reuse: the existing `newsreelFilter`, `newsreelWeave`, `NewsreelPicture`, `NewsreelOverlay` bodies, verbatim, then extend.
Files: `src/painted/kit/screen.tsx`, `src/painted/edu30/newsreel.tsx`, `docs/context-map.md` (EP30 entry: newsreel layer now in `kit/screen.tsx`; kit screen entry mentions the newsreel layer), `tests/newsreel.test.ts` (new)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Existing inputs kept | `frame`, `strength` 0..1, `tint` `'warm' \| 'cool'`, `tintAmount` 0..1 (default 1), `seed` (default 30) | edu30/newsreel.tsx (look lock VD30-01a) |
| New input `pop` | number 0..0.2, default 0: added luma on this frame, applied as a CSS `brightness(1 + pop)` appended to the filter chain after the tint, scaled by `strength` | VD30-11 step 1 |
| Pop values used by plates | round frame n: 0.08; n+1: 0.03; else 0 (plates pass it; the layer has no round logic) | VD30-11 step 1 |
| New input `tintMix` | number 0..1, default: 0 when `tint` is `'warm'`, 1 when `'cool'`; the filter interpolates the warm and the cool sepia/hue values linearly by `tintMix`, and the vignette colour `40,24,10` → `16,18,22` by the same mix | B06-SH03 Staging (tint cools over local 88–98) |
| Flare for the burn-out | no new input: B07-SH01 passes `pop` 0.15 on local 0, 0.10 on 1, 0.05 on 2, 0 after, and `strength` 1 → 0 linear over local 0–9 | b07.md B07-SH01 Newsreel burn-out |
| strength 0 | identity: no filter string (or `none`), weave transform `none`, overlay renders nothing | b07.md B07-SH01 (from local 10 no grain, weave, tint) |
| Layer order | the adapter (T03) composes Grade → NewsreelPicture(plate canvas) → NewsreelOverlay → Grain → titles; captions, mark and label are the Editor's and sit above all | brief technical handoff, Composition seam |

References: `projects/edu/EDU/previews/EDU-EP30-W3-r1/LF01a.png` (warm, full tint), `projects/edu/EDU/previews/EDU-EP30-W3-r1/thumbs/TP3.png` (cool).

## Proof
- `npx tsc --noEmit -p . > out/logs/T01-tsc.log 2>&1; tail -5 out/logs/T01-tsc.log`
- `node scripts/test.mjs tests/newsreel.test.ts` (`node:test` + `node:assert/strict`, as `tests/animals.test.ts`): asserts (a) `newsreelFilter({frame: 0})` equals the pre-move string byte for byte, (b) `strength: 0` returns the identity, (c) `pop: 0.08` adds `brightness(1.08)`, (d) `tintMix: 0.5` lies between the warm and cool strings.
- Re-render the W3 LF01a still: `sh scripts/edu-series/ep30/short/render-looks.sh T01 LF01a` and compare with the store LF01a.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| LF01a re-render | identical look to the locked still | mean absolute pixel difference vs store LF01a ≤ 2 (0–255 scale), measured with a short PIL script |
| test (a)–(d) | as listed | all pass |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
