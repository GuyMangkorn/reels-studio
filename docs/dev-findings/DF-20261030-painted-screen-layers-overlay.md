# DF-20261030-painted-screen-layers-overlay — production painted plates do not mount the shared screen layers

- Owner: Boss (plates); Editor and TL decide the shipwreck and scene path; first observed: 30 Oct 2026; last checked: 30 Oct 2026
- Status: workaround
- Type: integration-gap
- Tags: 2D / grade / grain / captions / tooling
- Scope: `src/painted/PaintedStage.tsx` (mounts the canvas, `Overlay` and labels only); `src/painted/screen.tsx` (`Grade`, `Grain`, `CaptionShade`, documented as "a plate's Overlay renders them"); `src/painted/shots/zcpaint.tsx`
- Consumers: ZCPAINT plates (now carry the layers in their `Overlay`); `src/painted/shots/shipwreck.tsx` (no layers in production); `src/scenes/SceneRenderer.tsx` (mounts PaintedStage)

## Symptoms and evidence
- Desired: the sheets' look (paper grain 0.09, vignette, cue-gated caption shade) in the production render. Observed: the grain, the vignette and the shade appear only in the spike sheet compositions, because `PaintedStage` never renders them (`grep -rn "Grain\|Grade" src` finds no production use outside `screen.tsx` and the spikes).
- Reproduce: render a production painted plate (`ZCP-B04-SH01` in the registry) and compare with `ZCPAINT-SET-B04-SH01` in the spike entry: the spike has grain and vignette, the production path does not.
- Coverage: Studio and CLI render of the registry plates not run here; the spike path verified in pass 5 (`out/painted/zcpaint/p5/`).

## Attempts and results
- Approach: each ZC plate's `PaintedShot.Overlay` renders `Grade`, `Grain` and `CaptionShade` (`ScreenLayers` in `src/painted/zcpaint/overlays.tsx`). Shipwreck plates keep their current output (no change to `PaintedStage`).
- Remaining: the diagram plate `ZCP-B04-SH02-TH/EN` has no Overlay (no grain in production) and the shipwreck plates are unchanged; a shared fix in `PaintedStage` would change the shipwreck output and needs its consumer check.

## Planning impact
- Film: the sheets show the grain and vignette; production shows them only for the ZC plates that carry them. Record in the brief's engine ownership that the screen layers are plate-owned.
- Mark: none.
- Follow-up: TL/Editor decision on a shared mount in `PaintedStage` (consumers: shipwreck, ZCPAINT, B08 when integrated); PS-1 in `scripts/zombie-condo-paint/build-notes.md`.

## Revalidation history
- 30 Oct 2026, pass 9 → the ZC plate Overlays carry Grade and Grain only (no `CaptionShade` on any ZC plate, `ScreenLayers` in `src/painted/zcpaint/overlays.tsx`); `PaintedStage` still mounts none of them → workaround unchanged; the screen-layer capability in `screen.tsx` is kept.
- 30 Oct 2026, uncommitted pass 5 → plate-level layers in the ZC `Overlay`, spike and plate frames checked → workaround → fix PR: none.
