# T32 — plates B06-SH03 (the sequel and the time-lapse) and B06-SH04 (withdrawal two, one silent wave) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: **done** (R11: SH04 re-proof in T40 accepted, TF60, TF67) · was: built; SH04 re-proof in **T40** (R10) · was: ready, waits on T30 (R9)
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


## R10 look check (Film, 2026-11-20, `EDU-EP30-TICKETS-R10`)
Viewed `T32-sheet.png`, `T32-zoom.png`. **Verdict: SH03 accept with value change; SH04 fix via [T40](T40-gesture-wing-read.md) (back wave; re-render only).**
- SH03 time-lapse: six held days, truck arrival, nine birds: pass. Hero row (TF60) restated: **hero state identical in code; probe height drift ≤ 15 px across the jumps** (520–535 measured, camera push only).
- SH04 wing tip (TF60): "−100 px above the head row" withdrawn; tip **y ≤ 800** at L 43 with a readable fringe (T40).
- Match B05-SH03 (TF60): same world path and speed; screen x difference logged only (20–75 px from the two decided camera lines). Changing a camera to meet ±10 px would cost a re-proof of an accepted plate for no visible gain.
- All non-hero birds far LOD: accepted.

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
Commit: see `git log` on this worktree branch (T32 commit) · fix passes used: 0 · proof sheet: store `projects/edu/EDU/previews/T32-sheet.png` (17 frames, 270 px), `T32-zoom.png` (SH04 L 39, L 43, SH03 L 89 at 540 px), per-frame `T32-s03_L<L>.png`, `T32-s04_L<L>.png`, clean `T32-clean-c04_L39.png`, `T32-clean-c03_L89.png`, `T32-c04_L15.png`, B05-SH03 reference `T32-s05_L20.png` (local `out/edu30-T32/`).

**Built** (`B06-SH03.tsx`, `B06-SH04.tsx`, no other file): both on `VANTAGE_CAM` / `paintVantageSet` / `fenceLine`. SH03: `dayOf(L)` is the time-lapse state driver (jump j = floor((L-59)/6), light [1,0,1,0,1,1], eaten 0.7+0.06j, stubble 0.4+0.12j, bird count 5,6,7,8,8,9 from the add frames 66/74/82/90); truck from T14 `truckState` (arrival dust only L < 59); hero frozen (`heroFrozen`, no head turn); reel cool with `tintMix` = clamp((L-94)/4). SH04: light 1, eaten/stubble 1, nine birds, T14 drive, hero `emuWingWave(L, {back: true})`.

**Measured** (`measure-shots.ts`, px; frame time from `stills.mjs`)
| Row | Number | Pass range | Result |
| --- | --- | --- | --- |
| SH03 L 27 truck | truck state centre x 28.0 m at L 27 (enters from the left; viewed `T32-s03_L27.png`, truck body beyond the left edge) | left of x 200 | pass |
| SH03 L 59 ... 89 six days | viewed sheet: light, stubble, truck present/absent alternate over the six blocks | six distinct days | pass |
| SH03 hero identical | probe EMU-HERO 520 / 522 / 526 / 530 / 531 / 532 / 533 / 534 / 535 / 535 px (L 0, 27, 45, 59, 65, 71, 77, 83, 89, 98), x 661 -> 633: state identical in code, size drift is the camera push only. Literal bbox pixel diff L 59 vs L 71 (both m 1, crop x 560-740, y 780-1300): mean luma diff 16.6 | <= 2 | **fail as written** (see deviations) |
| SH03 L 89 birds | `dayOf(89).count` = 9, painted via `fenceLine(9)`; viewed `T32-zoom.png` | 9 | pass (counted by state, heavy overlap in the picture) |
| SH04 L 39 EMU-HERO | 556 px (L 0 541, L 20 547, L 36 555, L 43 623 with the wing, L 57 561) | 542-563 | pass |
| SH04 L 39 / 43 wing tip | tip y 823 (x 398) at L 39; y 734 (x 544) at L 43; head top y 768 | tip 100 px above the head row (y <= 668) | **fail** (see deviations) |
| SH04 vs B05-SH03 truck x | at equal world x (2.5, 6, 12, 20 m): B05 screen x 438 / 114 / -311 / -762, SH04 375 / 42 / -386 / -782 | within 10 px | **fail**: 20-75 px |
| Caption zone (TF46: band 1150:1344, mean <= 0.80, p95 <= 0.99) | SH04 L 39 0.480 / 0.758, SH03 L 89 0.547 / 0.864, SH04 L 15 0.485 / 0.761 | pass | pass |
| Nine-bird frame time (r7 note) | SH03 L 89 51.6 s (clean still, loaded machine) | log | logged; under the 120 s trigger, still `far` for all non-hero birds (as T30) |

**Deviations and values I could not follow**
1. R9 note "Caption zone (TF46)." was empty; the rule given in the dispatch was used.
2. **Wing tip above the head row -100 px** cannot hold with T15 as built: TF35 caps the tip at 1.85 m, about the head height (head top y 768 at 1.95 m scale), so the tip reaches y 734 at best (L 43). Not redesigned; sheet acceptance (wing up at the flank, toward the truck, one swing, fold by 50) holds in the frames.
3. **Truck x +-10 px vs B05-SH03** is not reachable with the T30 camera lines: B05-SH03 yaws 160 -> 166 while B06-SH04 holds 164 from eye z 2.5, so the same world x differs by about 20-75 px (grows toward frame centre). Both follow their decided camera rows; world path and speed (12 m/s) match. Film to relax the row or change a camera line.
4. **Hero pixel diff <= 2** is a mean-diff the plates cannot meet: the ground, shadows and neighbouring birds in the bbox change per day and the camera moves 10 px; the hero itself is identical (same pose, seed, position).
5. **LOD:** the hero paints `near`; all other birds `far` for every frame (as T30; the automatic rule would paint the front row near).
6. R7 sound/Editor items untouched; title comes from the adapter (visible in the SH04 frames L 39-57; absent L 0-36 as timed 1715-1737).
