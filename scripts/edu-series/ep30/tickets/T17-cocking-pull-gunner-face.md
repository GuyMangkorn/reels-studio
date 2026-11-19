# T17 — GUNNER-1 racks the cocking handle and groans at the gun: `new: cocking-pull` and the angry talking face on `man-crop` front three-quarter
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: ready (Q7 answered by the user: values as written) · r3: Film notes added (TICKETS-R3) · r4: Film notes added (TICKETS-R4)
Class: figure · Hard: yes (arm, hand, face)
Blocked by: T12 (same files `cast.ts`, `proof-cast.tsx`, `tests/edu30-cast.test.ts`; T11's `front34` view), T13 (`cock` anchor and rack keys) · Consumers: B04-SH06
Model: sonnet, medium

Read first: [common rules](index.md#common-rules) (Hard-ticket checks); [hand-drawing skill](../../../../.claude/skills/hand-drawing/SKILL.md) §1, §2, §7, §8; b04 B04-SH06 (Direction, Staging, Camera, VO); brief [VD30-13](../short/film-brief.md#r3-changes); [kit/expressions.ts](../../../../src/painted/kit/expressions.ts) `angry`, `talk`; kit `nod` ([kit/cast.ts](../../../../src/painted/kit/cast.ts)).

## Build
A keyed right-arm action on the seated gunner (T11 `front34`) and a combined angry/talking face, both in `cast.ts`, with a proof strip on the B04-SH06 camera. The gunner is frustrated at the gun's timing, competent, never fumbling, eyes on the gun (CAT02; FACTCHECK-R2 O1: unnamed, kit face, no likeness).
Casting line: GUNNER-1 `man-crop + new: aus-army-1932-gunner, new: seated-gunner + new: cocking-pull, angry` (+ `talk` mouth on voiced frames).
Files: `src/painted/edu30/cast.ts`, `src/painted/edu30/proof-cast.tsx` (adds `C30-rack`), `tests/edu30-cast.test.ts`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Staging | seated at (−6.2, 0.36, −4.75) facing +x at G1 (−5.6, 0.32, −5.0), barrel +x; lens at his right front (B04-SH06 camera), so his RIGHT arm is the near arm on screen left | b04 B04-SH06; hand-drawing §1 |
| `cockingPull(L)` right hand target (B04-SH06 local) | L 0: on T13 `cock` at cock 0 (the hand arrives on the knob at the cut; the rack starts on frame 0) → L 3: on `cock` at cock 1 (0.12 m back) → L 6: on `cock` at cock 0 → L 6–8: to `grip` (ease-in-out) → grip from L 8 to the end. `Arm.exact` every frame, one solved chain; the elbow pole points down and back (elbow low) | b04 B04-SH06 GUNNER-1 row |
| Right hand line | on the handle: `GUNNER-1 RIGHT hand, mitten fist over the cocking knob, shows back, fingers screen down` → thumb screen right (toward the receiver); on the grip: as T11 front | hand-drawing §2 |
| Left hand | on `stock` every frame: `GUNNER-1 LEFT hand, mitten fist on the stock comb, shows back, fingers screen down` → left arm screen right (far, partly behind the gun), thumb screen left | b04 B04-SH06 ("left mitten on the stock throughout") |
| Body | the jolt is 0; shoulders turn 5° toward the gun with the pull (L 0–3) and back (L 3–6) | ticket |
| Head shake | kit `nod` [dx, 0] in head units: L 12: 0, 14: +0.10, 17: −0.10, 20: 0 (ease-in-out): one shake at the gun | b04 B04-SH06 (head shakes once, local 12–20) |
| Gaze | eyes on the receiver every frame: face `look` toward the gun (screen right and down in this view, kit sign convention), never to the lens | b04 B04-SH06 Acceptance |
| Face | `angry` brow, eyes and squint every frame; mouth `frown` when silent; on voiced frames the kit `talk` mouth with `open` 0 → 0.7 → 0 every 6 f inside L23's "โธ่เอ๊ย…" in this shot: local [7, 24) (global [1069, 1086); onsets 1069, 1080 → cycles restart at local 7 and 18) | b04 B04-SH06 VO; VD30-13 |
| Never | no hand off the gun except the 6-frame rack; no hand to the head or face; no rank text, name or badge text | b04 B04-SH06 Direction; FACTCHECK-R2 O1 |

**Open-question dependency (Q7, index O8).** As written B04-SH06 is 24 f (1062–1086). If the user picks the longer emu shot (cut at 1076, the gunner shot 14 f), the head shake (local 12–20) is dropped and the talk runs local 7–13; with the longer gunner shot (cut at 1096) the shake and talk keys stay and the shot holds the grip pose to local 33. Film bumps this ticket to r2 on the answer.

**Judgment for the builder (Hard, arm, hand, face).** One practised pull: the fist closes on the knob, yanks it straight back along the receiver, runs it home, and the hand returns to the grip, all in 8 frames, with the elbow low and the arm chain whole. The anger is at the gun's timing: brows down, a tight frown, a small shake of the head, the eyes never leave the gun. No comic flailing.

## r3 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R3`)
These override any older value in this ticket that they name.
- **Lewis gun (T13 r3).** After the gun's `placeBuild`, call `paintLewisPanTicks(p, c, seed, at, heading, magTurn, {elev, recoil})` in the next paint slot (before anything in front of the gun); without it the pan step per round is invisible. Every gun point (muzzle, pan, port, grip, stock, cock) comes from `lewisAnchors(at, heading, {elev, recoil, cock})`, never from a sheet literal: the locked gun is 1.32 m long with the muzzle 0.66 m ahead of the tripod head, so the sheet anchors that assumed a 1.1 m gun are superseded (index TF17). The rack handle rest at the B04-SH06 start camera projects to (663, 961) (T13 r3; the sheet said (674, 987)).

## r4 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R4`)
These override any older value in this ticket that they name.
- **TF21 (T11 r4).** With T11's 0.225 rad lean, the 3/4 face at B04-SH06 start sits at about (530, 690) (was (445, 682)) and at the end ≈ (492, 695) (estimate); measure both and log them. Acceptance unchanged (face above y 1100, GUNNER-1 593–624 px to the hat crown).
- **Fist (T36 through T12).** The right fist on the knob and back on the grip and the left fist on the stock use `flatFist: true`; the thumb check is read on the picture.

## Proof
- `node scripts/test.mjs tests/edu30-cast.test.ts`: right wrist on `cock` ± 0.01 m at L 0, 3, 6 and on `grip` from L 8; arm ratio ≤ 1.05 at every frame L 0–8; left wrist on `stock` every frame.
- `C30-rack` in `proof-cast.tsx` (newsreel off, the T10 dam with `nearSlope`, the B04-SH06 camera line): stills at L 0, 2, 3, 5, 6, 8, 14, 17 → `out/edu30-T17/`; `scripts/qa-sheet.sh out/edu30-T17/sheet.png --cols 8 --width 270 out/edu30-T17/*.png` plus `--width 540` hand crops at L 3 and L 8.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| L 0 / 3 / 6 | fist on the knob, pulled back, run home | handle (674 ± 25, 987 ± 25) at L 0; `thumb check: GUNNER-1 RIGHT: screen right ok` |
| L 8 | right fist back on the grip, left on the stock | `arm check: GUNNER-1 r/l: attached ok`; arm ratio ≤ 1.05 |
| L 14 / 17 | head shaken either way, angry brows, mouth open on a voiced frame | GUNNER-1 593–624 px; face above y 1100 |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
