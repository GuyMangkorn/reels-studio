# DF-20261030-qa-plate-overlay-clock — the QA plate composition passed the raw shot time to the overlay and camera

- Owner: Boss; first observed: 2026-10-30 (BLOOP SH13 pass 6 QA frames: whole frame black from raw tl about 328, while the canonical clock was 282); last checked: 2026-10-30 (Boss, working tree, base `3130527`)
- Status: fixed (uncommitted)
- Type: tool-limitation
- Tags: QA / painted / shot clock / overlay / camera
- Scope: `src/painted/spike/BloopPlates.tsx` `BloopPlate` (overlay `tl` and `camera`); production path `src/painted/PaintedStage.tsx` and `src/painted/plate.ts` already apply `shot.clock`
- Consumers: BLOOP-EP01-SHORT QA stills for any shot with a `clock` (SH13 only); sheets built from them (`sp03-rise-rush.png`, `g4-b09-b10.png`, `diag` renders)

## Symptoms and evidence
- `drawPlate` applies `shot.clock` to the paint, but the QA composition passed the raw `tl` to `Overlay` and to `shot.camera`.
- SH13 `clock` = the canonical remap (R8 boundaries). At raw tl 335 (canonical 277) the overlay's DEP07 fade read `L(tl)` = 335 and faded the frame; measured mean luma 0.8 at tl 350 before the fix, 33–35 after.

## Attempts and results
- Clocked the overlay and camera in `BloopPlate` (`ctl = shot.clock ? shot.clock(tl) : tl`). Re-rendered tl 320, 335, 342, 350, 351, 354: mean 33.5–34.7.

## Planning impact
- Any QA still of a clocked shot made before this fix is invalid after the clock's end; re-render before reading it.
- The production render was unaffected; the Editor's timeline uses `PaintedStage`.
