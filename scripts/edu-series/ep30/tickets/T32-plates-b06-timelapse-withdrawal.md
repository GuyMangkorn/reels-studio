# T32 — plates B06-SH03 (the sequel and the time-lapse) and B06-SH04 (withdrawal two, one silent wave) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready, waits on T30 (R9) · was: ready
Class: set (plates) · Hard: yes (time-lapse state driver, back-view wave)
Blocked by: T30 (`vantage.ts`), T01, T03, T08, T09, T14, T15 · Consumers: B06-SH03, B06-SH04 (global 1580–1736)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); shot blocks [b06.md](../short/scene-sheets/b06.md) B06-SH03 and B06-SH04 (authoritative; SD10, SD16); T30 `vantage.ts`.

## Build
Replace the two stub shot files with the plates on the shared retreat vantage.
Files: `src/painted/edu30/shots/B06-SH03.tsx`, `src/painted/edu30/shots/B06-SH04.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Cameras | `VANTAGE_CAM('B06-SH03', L)` and `VANTAGE_CAM('B06-SH04', L)` (T30) | b06 Camera rows |
| B06-SH03 L 0–58 | light m 0 (morning), eaten 0.7, stubble 0.4, warm tint; five fence birds (T08), EMU-HERO back view frozen; truck absent to L 26, arrives L 27–45 and parks (T14 B06-SH03), dust | b06 B06-SH03 Staging |
| B06-SH03 time-lapse L 59–94 | six jumps of 6 frames at L 59, 65, 71, 77, 83, 89; per jump j 0…5: light m = [1, 0, 1, 0, 1, 1][j] (the sun swings W → NE → W → NE → W and stays west), eaten = 0.7 + 0.06 j (→ 1.0 at j 5), stubble = 0.4 + 0.12 j (→ 1.0), truck = [parked, gone, parked, gone, parked, parked][j] (T14, dir +1 when parked); fence birds: a T08 added bird (add frames L 66, 74, 82, 90) shows from the jump whose 6-frame block contains its add frame, so the counts per jump are 5, 6, 7, 8, 8, 9 (nine from L 89, meeting the sheet's "nine by L 90"); EMU-HERO identical in every jump | b06 B06-SH03 Staging |
| B06-SH03 L 95–98 | light m 1, eaten 1.0, stubble 1.0, truck parked dir +1 at x 2.0, tint `tintMix` 0 → 1 (T01) | b06 B06-SH03; T01 |
| B06-SH04 | light m 1, eaten 1.0, stubble 1.0, cool tint; nine fence birds; truck T14 B06-SH04 drive (leaving frame left by L 40); EMU-HERO back view: T15 back-view wave (FOLD → WAVE L 36–39, one swing to L 44, fold by L 50), head `headYaw` +0.3 toward the truck | b06 B06-SH04 Staging |
| B06-SH04 title | T02 "ถอนทัพ รอบที่ 2" via the adapter (1715–1737) | T02 |
| Match B05-SH03 | the B06-SH04 frame and truck path match B05-SH03 (side-by-side still at the same truck x) | b06 B06-SH04 Acceptance |
| Probe leads | EMU-HERO B06-SH03 L 0 and 98, B06-SH04 L 0 and 57 | T03 probe |

**Judgment for the builder (Hard).** The time-lapse is state jumps, not motion: each 6-frame block is one held day (the projector sound speeds over them). The hero never moves until its one small wave in B06-SH04: from behind, a dark wing lifts at the flank toward the truck, swings once and tucks back in.

## r7 notes (Film, 2026-11-20, `EDU-EP30-TICKETS-R7`)
- **Render cost of the fence birds (T08 r4).** A nine-bird `fenceBirds` frame at near detail took 191 s per still. EMU-HERO paints near. The other fence birds use the automatic `LOD_PX` rule, with the back row (z 0.5 m behind) forced to `lod: 'far'` when a frame takes more than 120 s. Log the frame time of the L 90 (nine-bird) frame.

## R9 notes (Film, 2026-11-20, `EDU-EP30-TICKETS-R9`)
These override any older value in this ticket that they name.
- **Wave (T15 R9, TF35).** B06-SH04 one swing of `emuWingWave(L, {back: true})` local 36–44, folded by 50.
- **Caption zone (TF46).**

## Proof
- Stills (`out/edu30-T32/`): SH03 L 0, 27, 45, 59, 65, 71, 77, 83, 89, 98; SH04 L 0, 20, 36, 39, 43, 50, 57; plus B05-SH03 at the matching truck x for the side-by-side.
- `scripts/qa-sheet.sh out/edu30-T32/sheet.png --cols 6 --width 270 out/edu30-T32/s*.png`; `measure-shots.ts B06-SH03 0,98` and `B06-SH04 0,57`; clean SH04 L 39 through `caption-zone.py`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| SH03 L 27 | truck entering from the left edge | truck left of x 200 |
| SH03 L 59 … 89 | six distinct days (light, stubble, truck alternate); hero identical | hero pixel diff ≤ 2 between jumps inside its bbox (light excluded: compare at equal m) |
| SH03 L 89 | nine birds at the fence | 9 counted |
| SH04 L 39 / 43 | wing up at the flank on screen left, swung | EMU-HERO 542–563 px; wing tip above the head row −100 px |
| SH04 vs B05-SH03 | same framing and truck path | camera lines identical within T30 values; truck screen x ± 10 px at equal world x |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
