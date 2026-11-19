# T26 — plates B04-SH01 (ambush at the water, LF02) and B04-SH02 (the queue, the unison step) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: ready · r3: Film notes added (TICKETS-R3)
Class: set (plates) · Hard: yes (queue walk and unison step)
Blocked by: T03, T10, T11, T12, T16 · Consumers: B04-SH01, B04-SH02 (global 868–992)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); shot blocks [b04.md](../short/scene-sheets/b04.md) B04-SH01, B04-SH02 and Space D continuity (authoritative; SD06); brief [lf02-r4](../short/film-brief.md#lf02-r4).

## Build
Replace the two stub shot files with the plates. B04-SH01 L 0 is the locked LF02 (R4) composition (`lf02` in looks.ts) with motion added.
Files: `src/painted/edu30/shots/B04-SH01.tsx`, `src/painted/edu30/shots/B04-SH02.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Both | space D, morning, newsreel warm strength 1; the windmill wheel turns on the ambient clock at 0.25 rev/s; ripple dashes on the ambient clock | b04 B04-SH01 Staging |
| B04-SH01 camera | eye (0.5, 0.85, −6.4) → (0.22, 0.85, −6.30), yaw −110, pitch 0, f 950, hy 810, ease-in-out L 0–55 | b04 B04-SH01 Camera |
| B04-SH01 crew | the `LF02_MARKS` poses exactly as LF02 R4; a breath idle only: chest and shoulders rise 0.006 m on a 75 f sine (seeded phase per man), heads and hands fixed; G1 yaw 0.55 rad (`G1_AIM.sh01`) | lf02-r4; b04 B04-SH01 |
| B04-SH01 title | T02 "แผน 2" row via the adapter | T02 |
| B04-SH01 reflections | as R4; the known limit (reflections reach the band) is fixed only if the caption-zone check fails: then the reflection alpha below y 1150 drops to 0.6 | W3.2 known limits; b04 B04-SH01 Projection |
| B04-SH02 camera | eye (1.5, 1.1, −4.25), yaw 75 → 77, pitch 0, f 900, hy 820, ease-in-out L 0–68 | b04 B04-SH02 Camera |
| B04-SH02 queue | T16 B04-SH02 (stands to L 40, unison step L 41–49, walks on); `paintFarFlock` along the east shore beyond 40 m; EMU-HERO at the head | T16 |
| B04-SH02 off screen | the crew and G1 are behind the lens (not painted) | b04 Space D continuity |
| Probe leads | B04-SH01 MEREDITH L 0 and 55; B04-SH02 queue head L 0 and 68 | T03 probe |

References (store): `projects/edu/EDU/previews/LF02.58933d6b.png` (B04-SH01 L 0), `projects/edu/EDU/previews/EDU-EP30-W3-r1/thumbs/TD2.png` (queue reference).

**Judgment for the builder (Hard).** B04-SH01 is still: the ambush waits. In B04-SH02 the line is a queue, single file and even, and on "ต่อคิว" every bird takes one step on the same frames: comic precision.

## r3 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R3`)
These override any older value in this ticket that they name.
- **Lewis gun (T13 r3).** After the gun's `placeBuild`, call `paintLewisPanTicks(p, c, seed, at, heading, magTurn, {elev, recoil})` in the next paint slot (before anything in front of the gun); without it the pan step per round is invisible. Every gun point (muzzle, pan, port, grip, stock, cock) comes from `lewisAnchors(at, heading, {elev, recoil, cock})`, never from a sheet literal: the locked gun is 1.32 m long with the muzzle 0.66 m ahead of the tripod head, so the sheet anchors that assumed a 1.1 m gun are superseded (index TF17).

## Proof
- Stills (`out/edu30-T26/`): SH01 L 0, 30, 55; SH02 L 0, 40, 45, 49, 68.
- `scripts/qa-sheet.sh out/edu30-T26/sheet.png --cols 4 --width 270 out/edu30-T26/s*.png`; `measure-shots.ts B04-SH01 0,55` and `B04-SH02 0,68`; clean SH01 L 0 through `caption-zone.py`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| SH01 L 0 | matches LF02 (R4); title over the sky, clear of heads | MEREDITH 586 ± 20 px painted; title box y 300–475 |
| SH02 L 0 | the queue head big, line receding to the corner | head 484 ± 30 px; corner (712, 869) ± 30 |
| SH02 L 45 | every visible bird mid-step | all rear feet lifted |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
