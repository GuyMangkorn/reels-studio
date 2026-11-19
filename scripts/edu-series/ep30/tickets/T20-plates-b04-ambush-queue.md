# T20 — plates B04-SH01 (ambush at the water, LF02) and B04-SH02 (the queue) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: set (plates) · Hard: yes (queue walk and unison step)
Blocked by: T03, T08, T10 · Consumers: B04-SH01, B04-SH02 (global 912–1036)
Model: sonnet, medium

Read first: [index common rules](index.md#common-rules), shot blocks [b04.md](../short/scene-sheets/b04.md) Space D continuity, B04-SH01, B04-SH02; brief [lf02-r4](../short/film-brief.md#lf02-r4).

## Build
Replace the two stub shot files. B04-SH01 is the locked LF02 (R4) composition set in motion; B04-SH02 the queue along the shore.
Files: `src/painted/edu30/shots/B04-SH01.tsx`, `src/painted/edu30/shots/B04-SH02.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Both | space D, morning sun as LF02; newsreel warm, strength 1 | look lock |
| B04-SH01 composition | exactly `LOOK_DEFS.LF02`'s paint: `paintDam` + `crewAtDam` at `LF02_MARKS`, trees and windmill at `LF02_DAM`, reflections as R4; G1 heading as LF02 (0.55 rad) | b04 B04-SH01 Staging |
| B04-SH01 motion | windmill wheel `t` = global frame / 30 (ambient, 0.25 rev/s); ripple dashes on the ambient clock (seeded phase drift 0.3 px/frame); breath idle on the three men: `rise` 0.005 m × sin(2π G / 90) with phase offsets 0, 30, 60 f; nothing else moves; binoculars stay on MEREDITH's strap | b04 B04-SH01 ("nobody moves except a slow breath idle") |
| B04-SH01 camera | `eye (0.5, 0.85, −6.4) → (0.22, 0.85, −6.30)`, yaw −110°, pitch 0, f 950, hy 810, ease-in-out L 0–55 | b04 B04-SH01 Camera |
| B04-SH01 known limit | reflections reaching the caption band are accepted (W3.2); fix only if the Editor finds captions hard to read | brief w32 known limits |
| B04-SH02 queue | T08 `queue(L, QUEUE_PATH, {sHead})` with the B04-SH02 schedule (stand at x 4.6 to L 40, unison step L 41–49 to x 4.0, walk on 0.32 m/s to x 3.8 at L 68); 25 instanced birds nearest, painted far mass (`paintFarFlock`) along the path beyond 40 m from the camera up to the horizon; every bird faces along the path toward the gun | b04 B04-SH02 Staging; T08 Film fix |
| B04-SH02 crew | not in frame (they withdraw off screen during this shot) | b04 Space D continuity |
| B04-SH02 camera | `eye (1.5, 1.1, −4.25)`, `yaw 75° → 77°` ease-in-out L 0–68, pitch 0, f 900, hy 820 | b04 B04-SH02 Camera |
| B04-SH02 water | reflections of the nearest 10 birds via `reflect` (T10), toned as R4 | lf02-r4 |
| Probe leads | B04-SH01: MEREDITH; B04-SH02: queue head bird | T03 |

References (store): `projects/edu/EDU/previews/LF02.58933d6b.png` (LF02 R4, B04-SH01 L 0), `projects/edu/EDU/previews/EDU-EP30-W3-r1/thumbs/TD2.png` (D2, the queue along the east bank: B04-SH02's reference).

**Judgment for the builder (Hard).** The queue is a line of real birds: single file, even 1.4 m spacing, stance feet static. The unison step is one step by every visible bird on the same frames (rear foot lifts L 41, lands L 49); it must read as comic precision at 270 px.

## Proof
- Stills: B04-SH01 L 0, 30, 55; B04-SH02 L 0, 40, 41, 45, 49, 68 via `stills.mjs` (log `out/logs/T20-stills.log`); `qa-sheet.sh --cols 5 --width 270`; `measure-shots.ts`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| B04-SH01 L 0 | matches LF02 (R4); title "แผน 2" over the sky, clear of heads | MEREDITH 586 ± 20 px (painted LF02 measure) |
| B04-SH02 L 0 | queue head big, the line to the corner and up the east shore | queue head 484 ± 25 px (≥ 480); corner at (712 ± 25, 869 ± 25) |
| B04-SH02 L 45 | every visible bird mid-step | all rear feet lifted (probe log) |
| B04-SH02 L 68 | head bird at x 3.8, walking | queue head ≤ 600 px (sheet 592); feet y < 1100 |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
