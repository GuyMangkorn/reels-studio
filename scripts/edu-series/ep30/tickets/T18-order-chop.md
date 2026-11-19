# T18 — MEREDITH gives the order: `new: order-chop` (raised arm chopped forward into a point) with the shouted "ยิง!" mouth
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready (Q8 answered by the user: values as written)
Class: figure · Hard: yes (arm, hand, face)
Blocked by: T17 (same files `cast.ts`, `proof-cast.tsx`, `tests/edu30-cast.test.ts`) · Consumers: B03-SH05
Model: sonnet, medium

Read first: [common rules](index.md#common-rules) (Hard-ticket checks); [hand-drawing skill](../../../../.claude/skills/hand-drawing/SKILL.md) §1–3, §7, §8; b03 B03-SH05; brief [VD30-13](../short/film-brief.md#r3-changes); kit [poses.ts](../../../../src/painted/kit/poses.ts) P07 (`wave`: RIGHT hand raised beside the head) and P05 (`point_side`: LEFT arm straight out) and [poses-more.ts](../../../../src/painted/kit/poses-more.ts) their profile arms.

## Build
A keyed right-arm move from the kit P07 raised arm to a mirrored P05 point aimed at the flock, in the episode cast module, on MEREDITH front three-quarter, with a neutral face and a shouted mouth. War-film grammar played straight: serious, crisp, not mocking (script; CAT02).
Casting line: MEREDITH `man-parted + new: aus-army-1932-officer, P07 → new: order-chop → P05 (mirrored to the right arm), neutral` + `talk` mouth.
Files: `src/painted/edu30/cast.ts`, `src/painted/edu30/proof-cast.tsx` (adds `C30-chop`), `tests/edu30-cast.test.ts`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Staging | (−0.6, 0, 1.05) facing −z (toward the flock), front three-quarter to the B03-SH05 lens (the lens is at his left front: his RIGHT arm is on screen left and is the **far** arm; the sheet's "near (right) arm" is a slip, the numbers and the screen side stand) | b03 B03-SH05; hand-drawing §1 |
| Start key (L 0–4) | right arm = kit P07 hand target (offset (−0.207, 0.443) from the right shoulder, front table), raised beside the head; sheet world point (−0.35, 2.05, 1.05) is the screen guide, ± 40 px | b03 B03-SH05 (P07 hold) |
| Chop (L 4–7, global 671–674) | the hand travels down and forward on an arc about the shoulder (ease-in: fast at the end), elbow straightening, to the end key at L 7; one solved chain per frame | b03 B03-SH05 ("chops down and forward local 4–7, lands on ยิง! 673") |
| End key (L 7–20) | right arm straight, pointing at the flock: the kit P05 arm mirrored to the right side and turned forward (−z) about 20° below the shoulder line (world mitten ≈ (−0.35, 1.45, 0.45), screen guide (250, 712) ± 40 px); held still | b03 B03-SH05 |
| Hand lines | start: `MEREDITH RIGHT hand, flat mitten raised, shows palm (to the lens), fingers screen up` → thumb screen right; end: `MEREDITH RIGHT hand, mitten, index-point not drawn (mitten scale), shows edge (thumb side up), fingers toward the lens and screen left` → thumb on top | hand-drawing §2, §3, §4 |
| Left arm | P01 hang every frame | ticket |
| Body | feet planted; torso leans 0.04 rad forward with the chop (L 4–7) and holds | ticket |
| Face | `neutral` brows and eyes (straight, serious; no smirk); mouth: kit `talk`, `open` L 6: 0.3, L 7–11: 0.8, L 12–14: 0.5, L 15: 0.2, L 16 on: 0 (closed, firm) (speech [673, 683) = local 6–16) | b03 B03-SH05 VO; VD30-13 |
| Eyes | toward the flock (down the line of the point), never to the lens | b03 B03-SH05 Direction |

**Open-question dependency (Q8, index O9).** As written B03-SH05 is 21 f (667–688). The alternative holds the shot to 704 (37 f): the keys stay and the end key holds to L 36.

**Judgment for the builder (Hard, arm, hand, face).** One decisive chop, the arm whole from shoulder to mitten in every frame, ending in a straight point that aims at the flock off screen; the body stays planted and upright, the face set. It must read as a real commander's order, not a comic flail.

## Proof
- `node scripts/test.mjs tests/edu30-cast.test.ts`: arm ratio ≤ 1.05 at every frame L 0–8; right wrist reach ≤ 0.52 m from the shoulder at every frame.
- `C30-chop` in `proof-cast.tsx` (newsreel off, paddock, the B03-SH05 camera line `eye (−2.0, 0.75, −1.2) → (−1.95, 0.75, −1.05), yaw 148 → 150, pitch 10, f 1000, hy 860`): stills at L 0, 4, 5, 6, 7, 12 → `out/edu30-T18/`; `scripts/qa-sheet.sh out/edu30-T18/sheet.png --cols 6 --width 270 out/edu30-T18/*.png` and a `--width 540` crop at L 0 and L 7.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| L 0 | right arm raised beside the head on screen left | mitten near (470, 591) ± 40 px; `thumb check: MEREDITH RIGHT: screen right ok` |
| L 7 | straight point toward the flock, mouth open | mitten near (250, 712) ± 40 px; MEREDITH 654–696 px |
| L 4–7 | the arm is one chain through the chop | `arm check: MEREDITH r: attached ok`; max arm ratio logged ≤ 1.05 |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
