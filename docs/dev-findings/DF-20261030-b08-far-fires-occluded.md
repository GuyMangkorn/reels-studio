# DF-20261030-b08-far-fires-occluded — B08 far fires sit behind the near towers and do not show

- Owner: Boss (plate); Film decides the acceptance wording and whether the far pair should show
- Status: open (decision)
- Type: layout / occlusion
- Tags: 2D / painted / layers / acceptance
- Scope: `src/painted/zcpaint/balcony.ts` (`paintFar`: L1 fires at (96, 866) and (1004, 874); `paintNear`: L3 framing towers x -60–196 top 318 and x 900–1140 top 400); plate `ZCP-B08-SH01`
- Consumers: `ZCP-B08-SH01` (production); Film's key art `src/painted/spike/ZcB08Key.tsx` (same layers, same occlusion)

## Symptoms and evidence
- Brief `VD-ZC-08` item 2 expects four fire sources visible at pf 110 (far, mid, main blaze, second blaze).
- Measured on the bare plate frames at pf 20, 96, 110 and 150 (`scripts/zombie-condo-paint/b08-measure.py`, `far_windows_core_px`): flame-core pixels (warm, luma > 0.5) in the far-fire windows x 40–170 and 930–1080, y 780–900 = 0 at every frame.
- Crop `out/painted/zcpaint/b08/crop-far-and-rim-c110.png`: the same windows are dark near-tower faces.
- The approved key art has the same occlusion (`out/painted/zcpaint/b08/spike/key_F110.png`).
- Visible fire sources at pf 110: the main blaze and the second blaze.

## Attempts and results
- The open gaps in the layers at y 880 are 14–22 px wide (around x 236–250, 586–606 and 936–950); none holds a fire.
- Not changed: moving or raising the far pair changes the approved frame and is a look decision for Film and the user.

## Planning impact
- Film: either restate item 2 as two visible fires (main, second) with the far pair behind the near towers, or place the far pair where it shows (a new look, needs user review).
- Mark: the B08-SH01 sheet text "four fires at three distances" follows the same decision.
- Editor: none (one shared plate ID).

## Revalidation history
- 30 Oct 2026, Boss pass 6 (`ZCP-B08-SH01`, uncommitted) → measured on bare frames and cropped at full resolution → open (decision).
