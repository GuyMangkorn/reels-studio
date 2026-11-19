# T22 — plate B04-SH05 (the whole queue stares at the gun; the hero cocks its head) is built and proven
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: set (plate) · Hard: yes (emu face: head cock, gaze)
Blocked by: T03, T07, T08, T10 · Consumers: B04-SH05 (global 1108–1185)
Model: sonnet, medium

Read first: [index common rules](index.md#common-rules), shot block [b04.md B04-SH05](../short/scene-sheets/b04.md) (and SD06).

## Build
Replace the stub: the lens on the gun's line of fire, the queue standing with every head to the lens.
Files: `src/painted/edu30/shots/B04-SH05.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Set | space D morning; newsreel warm, strength 1 | look lock |
| Camera | `eye (−1.6, 1.15, −4.75)`, `yaw 89.3° → 85.3°` ease-in-out L 0–77, pitch −2°, f 950, hy 860 | b04 B04-SH05 Camera |
| Queue | T08 `queue` standing (no walk): bird 0 = EMU-HERO at the rim x 1.6 (1.6, 0.33, −4.9), the rest at 1.4 m spacing along `QUEUE_PATH` to the corner and up the east shore; every bird `headYaw = emuLensYaw(at, heading, cam(L))` and `lid` 0.3; idle: none (they stare) | b04 B04-SH05 Staging |
| EMU-HERO | stand-stare, heading −x, head to the lens; head cock `headRoll` 0 → −0.436 rad (25°) ease-in-out L 45–52, held to L 77; grunt: `beak` 0 → 0.25 → 0 over L 38–41 (the "hm?" with SFX at L 38) | b04 B04-SH05; T07 `headRoll` |
| Ground between lens and birds | no casings (they lie on the slope behind the lens, T21); instead the B04-SH03 strike marks: a dark mud pock (ellipse 0.10 × 0.06 m, `#4a3a2a`) at every even-i rim strike point x_i = −2.5 + 0.45 i of T21 that lies in view, and calm water at the odd-i spout points (Film fix: the sheet's "spent casings on the rim and in the shallows between lens and birds" cannot exist with the gun behind the lens and +z ejection) | b04 B04-SH05 Staging; T21 |
| Crew | none in frame (SD06 withdrawal; G1 behind the lens) | b04 Space D continuity |
| Water | reflections of the nearest 8 birds via `reflect` | lf02-r4 |
| Probe leads | EMU-HERO | T03 |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/KP-look.png` (head to the lens), `projects/edu/EDU/previews/LF02.58933d6b.png` (dam look).

**Judgment for the builder (Hard, face).** Deadpan: every head faces the lens with the half lid; the hero's tilt is slow and clear (25°), eye kept on the lens; tuft and bib must read for identity.

## Proof
- Stills: L 0, 38, 45, 52, 77 via `stills.mjs` (log `out/logs/T22-stills.log`); `qa-sheet.sh --cols 5 --width 270`; `measure-shots.ts B04-SH05 0,52,77`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| L 0 | every visible head turned to the lens; hero first in line | EMU-HERO 505 ± 25 px (≥ 480); head y 563 ± 20; feet y < 1100 |
| L 52 | head tilted | eye-line angle 20–30° |
| L 77 | tuft and bib visible at 270 px | visual; hero x 574 ± 25 |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
