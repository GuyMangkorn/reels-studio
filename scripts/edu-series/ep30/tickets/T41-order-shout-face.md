# T41 — MEREDITH's "ยิง!" reads as a shouted order: stern brows and the kit `shout` mouth on the chop (T18 fix pass 1) + re-proof of B03-SH05
Deliverable: EDU-EP30-SHORT · Revision: r1 (`EDU-EP30-TICKETS-R10`) · Status: ready
Class: figure (fix bundle) · Hard: yes (face)
Blocked by: none (T18, T23 built) · Consumers: B03-SH05 (T23)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); [T18](T18-order-chop.md) (Decided values, Result, R10 notes); kit [expressions.ts](../../../../src/painted/kit/expressions.ts) (`angry` brow, `furious` uses `mouth: 'shout'`); kit `KIT-MOUTH-STRIPS` (the `shout` mouth on the turned 3/4 head).

## Why (Film, R10 look check)
Viewed `T18-sheet-chop.png`, `T18-hands-L0-L7.png`, `T23-sheet.png`. The arm, the chop timing, the end point and the body pass. At L 7–12 the `talk` mouth at open 0.8 with neutral brows reads as a small round "oh" of surprise, which makes the order look startled or comic; the ticket judgment asks for a real commander's order, played straight. Only the face changes.

## Build
In `src/painted/edu30/cast.ts`, the `chop` pose's face keys: stern brows from the start of the chop and the kit `shout` mouth on the word. Arm keys, lean, gaze, timing and every other pose unchanged.
Files: `src/painted/edu30/cast.ts`, `tests/edu30-cast.test.ts` (no plate change; B03-SH05 is re-rendered only).

## Decided values
| Row | What | Value | Source |
| --- | --- | --- | --- |
| S1 | brows | L 0–4: `neutral` as built. From L 5 on: `brow: 'angry'`, `squint: 0.3` (a set, determined face, not rage); eyes keep `CHOP_LOOK` | ticket (war-film grammar, T18 judgment) |
| S2 | mouth | L < 6: closed as built. L 6: `talk` open 0.3. L 7–11: `shout` open 0.8. L 12–14: `shout` open 0.5. L 15: `talk` open 0.2. L 16 on: `flat` (closed, firm). Speech window [673, 683) = local 6–16 unchanged | ticket; T18 face row |
| S3 | scope | only `chopTalk` / the `chop` branch's `faceState`; no other pose, no kit file | ticket |
| S4 | tests | a test: `chop` at L 8 gives mouth `shout`, brow `angry`; L 2 gives `neutral`; T11/T36/T12/T17/T18 arm hashes unchanged (the face is not in the arm hash; if a face hash exists for `chop`, retake only that one) | ticket |

**Judgment for the builder (Hard, face).** At 540 px L 7 must read as a man shouting an order: brows down and level-hard, mouth open wide and squarer than round, eyes on the flock. Not frightened (no raised brows), not a grin, not a scream.

## Proof
- `npx tsc --noEmit -p .`; `node scripts/test.mjs tests/edu30-cast.test.ts` (log `out/logs/T41-test.log`).
- `C30-chop` stills L 0, 5, 6, 7, 12, 16 → `out/edu30-T41/`; B03-SH05 plate stills (clean and guides-on) L 0, 6, 7, 12, 20. Sheet at 270 px; 540 px face crops at L 6, 7, 12. Archive `out/edu30-T41` as `T41-*.png`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| C30-chop L 7 vs L 6 (540 px) | shouted mouth, stern brows | mouth bbox height at L 7 **≥ 1.6 ×** L 6 and width **≥ 1.2 ×** L 6 (logged from the face anchors or the frame) |
| B03-SH05 L 7, 12 (270 px) | the order lands on the word; the face reads as a shout, not surprise | viewed; MEREDITH lead **700–780** px (R10, as built 742 at L 7) |
| B03-SH05 L 0, 20 | arm, point and gunners unchanged | lead L 0 **717 ± 10**, L 20 **763 ± 10** (as built); mitten within 5 px of the T23 Result positions |
| caption zone (TF46) | clean B03-SH05 L 7 | pass (`--band 1150:1344 --max-mean 0.80 --max-p95 0.99`) |
| hard checks | arm unchanged | `thumb check: MEREDITH RIGHT: screen right ok` (L 0), `screen top ok` (L 7); `arm check: MEREDITH r: attached ok` (unchanged solve) |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
