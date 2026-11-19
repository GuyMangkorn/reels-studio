# T16 — the queue at the dam walks the shore, steps in unison, flinches and re-forms under fire, stares, and turns away
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready (B04-SH05 local frames depend on open Q7)
Class: movement · Hard: yes (animal movement)
Blocked by: T10 (`QUEUE_PATH`, `queuePoint`), T08 (same files `flock.ts`, `proof-flock.tsx`, `tests/edu30-flock.test.ts`) · Consumers: B04-SH02, B04-SH03, B04-SH05 (no queue bird is in B04-SH01, SH04 or SH06)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules) (Hard-ticket checks, clocks); b04 Space D continuity (SD06), B04-SH02, B04-SH03 Queue row, B04-SH05 Queue row; T06 (`duck`, duck-flap, `emuHop`), T07 (`emuLensYaw`), T10 (`queuePoint`, `sAtRimX`).

## Build
A pure `queue(L, shot)` helper in `flock.ts` returning `EmuMember[]` for the three queue shots: single file along `QUEUE_PATH`, EMU-HERO at the head in every shot (identity: tuft and bib), painted far mass beyond 40 m.
Files: `src/painted/edu30/flock.ts`, `src/painted/edu30/proof-flock.tsx` (adds `FL30-queue-*`), `tests/edu30-flock.test.ts`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Layout | bird i (0 = head = EMU-HERO, seed 36000) at arc length sHead(L) + 1.4 i along `QUEUE_PATH` (T10), heading = path tangent toward the gun, y from the path; 25 birds; beyond 40 m from the camera `paintFarFlock` instead of birds | b04 SD06 |
| B04-SH02 sHead (head x on the rim z −4.9) | **L 0–40 stands at x 4.6** (idle: head bob ± 0.02 m on a seeded 20–30 f cycle per bird); **L 41–49 every visible bird steps forward 0.6 m together** (one step: each bird's rear foot lifts at L 41 and lands at L 49, ease-in-out; the front foot planted); head at x 4.0 at L 49; L 49–68 walks on at 0.32 m/s to x 3.8 at L 68 (Film fix: the sheet's "walks at 0.3 m/s from 4.6" and "4.0 by local 49" cannot both hold with a 0.6 m step; the positions 4.6 → 4.0 → 3.8 and the unison step on "ต่อคิว" (L 41, global 965) are kept, so the line waits, then steps) | b04 B04-SH02 Staging |
| B04-SH03 sHead | x 3.6 at L 0 → 3.0 at L 46 (0.39 m/s, walk phase from speed). Overrides per bird: birds 0–5 duck-flap from **L 12** (T06); birds 2 and 4 hop sideways toward −z (into the shallows: `side` −1, the bird's right when it faces −x, which is −z; dist 0.6) from **L 19**, landing and splash at **L 25** (T05 `paintSplash` at the landing point); they walk back up to the rim on a 1.2 m arc and rejoin their slot by L 40; the line bunches (birds 1–8 close to 1.0 m spacing over L 14–24) and re-forms to 1.4 m by L 40; keeps walking to the cut | b04 B04-SH03 Queue row; VD30-11 Birds (continues, not breaks) |
| B04-SH03 no hits | no bird inside 1.5 m of any T05 strike point at its frame | CAT02 |
| B04-SH05 stare | sHead fixed at x 1.6 (s 4.6); the whole line stands; every bird's `headYaw` = `emuLensYaw` to the B04-SH05 camera (the gun line); EMU-HERO (bird 0) takes its pose from T15 `emuWatchCheck` / `emuFootTap` instead | b04 B04-SH05 |
| B04-SH05 turn-away | from **L 57** (global 1143, "แผนสาม"): birds 1–6 in order, 2 f apart (bird 1 at 57, bird 6 at 67, past the cut for the last ones), turn about over 6 f (heading +π, both feet stepping: one step per 3 f) and walk back up the shore at 0.4 m/s; birds 7+ stay staring to the cut; EMU-HERO stays | b04 B04-SH05 Queue row |
| Unison precision | the B04-SH02 step uses the same frames for every visible bird (no seeded delay) | b04 B04-SH02 Acceptance |

**Open-question dependency (Q7).** The turn-away is keyed at L 57 from a shot start at 1086 (= global 1143, L12's first word); if Q7 moves the start, the global frame 1143 is kept.

**Judgment for the builder (Hard).** A queue: single file, even spacing, comic patience. Planted feet: every stance foot holds its world position on the wet rim (slip ≤ 0.02 m); in the unison step every front foot stays planted. Under fire the birds flinch and two hop into the shallows, but the line never breaks and no bird is hit or falls. In the turn-away the birds step around, never spin on the spot.

## Proof
- `node scripts/test.mjs tests/edu30-flock.test.ts`: positions 1.4 m apart along the path at B04-SH02 L 0; at L 45 every visible bird mid-step and at L 49 all landed; stance slip ≤ 0.02 m over B04-SH02 L 49–68; no bird within 1.5 m of a strike point (B04-SH03, T05 points).
- `proof-flock.tsx` on the sheet cameras over the T10 dam: `FL30-queue-sh02` L 0, 45, 49; `FL30-queue-sh03` L 12, 22, 25, 40; `FL30-queue-sh05` L 0, 60. `scripts/qa-sheet.sh out/edu30-T16/sheet.png --cols 5 --width 270 out/edu30-T16/*.png`

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| FL30-queue-sh02 0 | a queue: single file, even spacing, head bird large | head bird 484 ± 30 px (sheet) |
| FL30-queue-sh02 45 | every bird mid-step | all rear feet lifted (logged) |
| FL30-queue-sh03 25 | two birds landing in the shallows, splash | 2 splashes at L 25 |
| FL30-queue-sh05 0 | every head turned to the lens | EMU-HERO 505 ± 30 px |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
