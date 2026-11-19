# T22 — plate B02-SH06 ("สามคนเหรอ…": EMU-HERO counts the crew, then the crane over a field of rising heads) is built and proven
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: set (plate) · Hard: yes (emu face and nods, rising heads, loader hands)
Blocked by: T03, T07, T08, T09, T11, T12, T13 · Consumers: B02-SH06 (global 592–666)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); shot block [b02.md](../short/scene-sheets/b02.md) B02-SH06 (authoritative; SD18).

## Build
Replace the stub shot file with the plate.
Files: `src/painted/edu30/shots/B02-SH06.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Set | space P, light m 0, eaten 0.4, newsreel warm strength 1; three wheat bands: near stalk strokes under the lens (`paintNearStalks` spots seeded in x 1.2..3.4, z −10.4..−9.0), mid texture over the heads field, far wash | b02 B02-SH06 Depth |
| Camera | L 0–48 eye (2.2, 1.55, −10.6), yaw 190, pitch −2, f 1000, hy 860; L 48–74 to eye (2.4, 3.2, −12.2), yaw 190, pitch −16, f 950, hy 860, ease-in-out (still settling on the cut) | b02 B02-SH06 Camera |
| EMU-HERO | (1.0, 0, −8.0) facing +z (heading π/2), stand, legs in the wheat; nods (T07 `nod`) at L 7, 17, 23; beak (T07 `talkBeak`) onsets L 7, 17, 51, 60; look back over its **left** shoulder (T07 B02-SH06 row) L 30–44, hold; blink from L 33 | b02 B02-SH06; T07 Film fix |
| Heads field | T08 `headsField(L)`; the plate paints a local wheat-top pass (`paintWheatTexture` strokes within 0.6 m of each member's base, drawn after the members) so the sitting bodies read as hidden in the crop | T08 |
| Crew | MEREDITH (−0.6, 0, 1.05) front, T12 C (`P30`, left mitten at the visor, gaze to the far horizon); GUNNER-1 (0, 0, 0.85) T11 front with head down to the sights; GUNNER-2 T12 F (loader at (0.50, 0, 0.35), seats the pan L 20–30); G1 (0, 0, 0) barrel −z, `magTurn` 0, the pan seated from L 30 | b02 B02-SH06 Staging; T11, T12 |
| Far | F1 flock mass and far paddock beyond the crew; the fence and the track beyond the crew | b02 B02-SH06 Depth |
| Exactly three men | readable as three at 270 px at L 0 (left of the emu's neck) | b02 B02-SH06 Acceptance |
| Probe leads | EMU-HERO at L 0 and 74; MEREDITH at L 0 | T03 probe |

**Judgment for the builder (Hard).** The count is deadpan: three small nods, one per syllable, then a slow look back to the lens with the left eye. The heads pop up in six quick waves as the camera rises: necks enter the wheat, heads in profile, eyes to the crew. MEREDITH never looks at them; the crew is busy, not foolish.

## Proof
- Stills (`out/edu30-T22/`): L 0, 7, 10, 30, 44, 52, 58, 64, 74.
- `scripts/qa-sheet.sh out/edu30-T22/sheet.png --cols 5 --width 270 out/edu30-T22/s*.png`; `measure-shots.ts B02-SH06 0,74`; clean L 0 and L 74 through `caption-zone.py`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| L 0 | EMU-HERO big at screen right, three small men side by side at its neck's left | EMU-HERO 604 ± 30 px; MEREDITH 141 ± 15 px |
| L 10 | head 4 cm down in the nod (from L 7) | head joint y 0.04 ± 0.01 m below the stand (logged) |
| L 44 | head turned back, left eye to the lens | T07 KP-lookback check |
| L 74 | field of heads all up, the three men unblocked | 36 heads up; crew bbox overlap 0 px; EMU-HERO 301 ± 30 px (wide exception) |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
