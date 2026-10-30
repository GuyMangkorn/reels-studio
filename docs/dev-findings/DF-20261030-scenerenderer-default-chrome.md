# DF-20261030-scenerenderer-default-chrome — painted scenes draw the default chrome unless `chrome` is set

- Owner: Editor (composition option); Boss (review harness)
- Status: workaround
- Type: integration default
- Tags: Remotion / chrome / painted / composition
- Scope: `src/scenes/SceneRenderer.tsx` (`chrome` prop; progress bar and channel label), `src/scenes/media.ts` (`defaultChrome` = progress bar on, channel label `ทำไมล่ะ`); `src/painted/PaintedStage.tsx` draws no chrome
- Consumers: every composition that mounts `SceneRenderer` with painted scenes; the ZCPAINT review compositions `ZCPAINT-B08-TL-TH` and `-TL-EN`; the ZC delivery record hides both

## Symptoms and evidence
- `ZCPAINT-B08-TL-TH` at f 81 with the default props differs from plate frame 96 only in the bottom band: a progress line and the channel label. All pixels above y 1800 match within the run-to-run class (≤ 2 levels). Every difference above 3 levels is in y 1800–1919.
- With `chrome={{channelLabel: false, progressBar: false}}` the same frame matches the plate across the whole frame (≤ 2 levels on 0.007 % of pixels).
- Evidence: `out/painted/zcpaint/b08/sheet-tl-vs-plate.png` (default chrome, viewed), `out/logs/zcp-b08-restill.log` (chrome off).

## Attempts and results
- Passing `chrome` on the review `SceneRenderer` removes both items. The prop is set by the caller of the composition, so the episode's Editor sets it.

## Planning impact
- Editor: pass `chrome={{channelLabel: false, progressBar: false}}` for ZCPAINT scene renders (the record's "chrome hidden" rule).
- Film and Mark: none.

## Revalidation history
- 30 Oct 2026, Boss pass 6 → measured on the review compositions → workaround (per-composition prop) → fix PR: none.
