# T26 — plates B04-SH01 (ambush at the water, LF02) and B04-SH02 (the queue, the unison step) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: built 2026-11-20, awaiting Film look check · was: ready, dispatchable (R9: T16 done) · r3: Film notes added (TICKETS-R3)
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

## R9 notes (Film, 2026-11-20, `EDU-EP30-TICKETS-R9`)
These override any older value in this ticket that they name.
- **Queue shadows (TF37).** Every queue bird paints with `shadowOp: 45`.
- **Queue as built (T16 R9).** B04-SH02 head stands at x 4.6 to L 40, one unison step L 41–49 (0.57–0.64 m by scale), walks on to x 3.797 at L 68.
- **Caption zone (TF46).**

## Proof
- Stills (`out/edu30-T26/`): SH01 L 0, 30, 55; SH02 L 0, 40, 45, 49, 68.
- `scripts/qa-sheet.sh out/edu30-T26/sheet.png --cols 4 --width 270 out/edu30-T26/s*.png`; `measure-shots.ts B04-SH01 0,55` and `B04-SH02 0,68`; clean SH01 L 0 through `caption-zone.py`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| SH01 L 0 | matches LF02 (R4); title over the sky, clear of heads | MEREDITH 586 ± 20 px painted; title box y 300–475 |
| SH02 L 0 | the queue head big, line receding to the corner | head 484 ± 30 px; corner (712, 869) ± 30 |
| SH02 L 45 | every visible bird mid-step | all rear feet lifted |

## Result (Boss fills)
Commit: the T26 commit on branch `worktree-agent-a0d927ddab1a220c0` (see the handoff for the hash). Files: `src/painted/edu30/shots/B04-SH01.tsx`, `B04-SH02.tsx`; shared: `looks.ts` (`crewAtDam(..., mirror, L)`: optional breath `rise` and `paintLewisPanTicks`, both off when `L` is absent so LF02 is unchanged), `dam.ts` (`DamOpts.ambient`: wheel 0.25 rev/s, ripple dashes drift and breathe; absent = locked LF02).
Proof (store `projects/edu/EDU/previews/`): `T26-sheet.png` (cols 4, 270 px: SH01 L 0, 30, 55; SH02 L 0, 40, 45, 49, 68), per-frame guided `T26-s1_L*.png`, `T26-s2_L*.png`, clean (no guides, no tag) `T26-c1_L00/05/30/55.png`, `T26-c2_L00/68.png`. `npx tsc` errors only in tests unrelated to EP30; `npm test` 498 pass / 8 fail (the known set: HIPPO joints, loudness, new-shot, render-inputs, segments, store adopt).

| Frame | Pass range | Measured |
| --- | --- | --- |
| SH01 L 0 MEREDITH | 586 ± 20 | 587 px (458-1045); L 55: 678 px (405-1083); GUNNER-2 348, GUNNER-1 155 |
| SH01 title | box y 300-475, clear of heads | box 420 wide, x 330-750, viewed at L 5 (`T26-c1_L05.png`): clear of MEREDITH's hat (top 458, x about 150-345) |
| SH02 L 0 head | 484 ± 30 | **583 px painted** (probe top 504 to bottom 1086, tuft to toe line incl. shadow); the sheet-line projection (head top 1.70 m to ground) is 484 (555 to 1039), the number T16 recorded. The painted bird is taller and reaches lower than the sheet line, as CAL (T03 r3: 290 painted vs 1.70 m). L 68: 794 painted (386-1180) vs 592 sheet. Conflict recorded below |
| SH02 L 0 corner (712, 869) | ± 30 | not probed (the corner is far-shore mass, no lead); queue recedes to the east shore at the left, viewed |
| SH02 L 45 | all rear feet lifted | 25 of 25 lifted (T16 test, 0.113-0.127 m), viewed: rear feet up on the visible birds |
| Caption zone `--band 1150:1344 --max-mean 0.80 --max-p95 0.99` | pass | SH01 L 0 **mean 0.806 FAIL** (p95 0.951 ok); L 30 0.809 fail; L 55 0.797 ok. SH02 L 0 0.643, L 68 0.632 ok |

Fix passes used: 0 (one trial of the ticket's reflection-alpha fix, then reverted). The ticket's fix does not work: reflection alpha 0.6 below y 1150 fades the dark reflection toward the light paper and raises the band mean (0.806 to 0.808), so it was not kept.
Not followed / open for Film: (1) SH01 caption-zone mean 0.806 / 0.809 vs 0.80 (L 0, 30): reflections are darker than the water, so only a darker or smaller water band (not alpha) could lower it; accept 0.81 or give a different fix. (2) SH02 head row 484 is the sheet-line projection, the painted probe reads 583; Film to restate the row (and the sheet's L 68 feet y 1088 vs painted 1180, which sits in the band). (3) No queue reflections in the water in SH02 (not in the ticket). (4) Far mass beyond 40 m is the static `paintQueueFar`. Hands-fixed breath: arm targets keep the unrisen shoulder, heads and hands do not move; thumb and arm checks: LF02 arms unchanged, not re-measured.
