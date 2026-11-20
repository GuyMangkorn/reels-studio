# T23 — plate B03-SH05 (MEREDITH's order "ยิง!" on a low heroic three-quarter) is built and proven
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: built; re-proof in **T41** (R10) · was: ready (Q8 answered by the user: values as written) · r3: Film notes added (TICKETS-R3)
Class: set (plate) · Hard: yes (arm chop, talking face)
Blocked by: T03, T09, T11, T12, T13, T18 · Consumers: B03-SH05 (global 667–687)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); shot block [b03.md](../short/scene-sheets/b03.md) B03-SH05 (authoritative).

## Build
Replace the stub shot file with the plate.
Files: `src/painted/edu30/shots/B03-SH05.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Set | space P, the gun position, light m 0, eaten 0.4, newsreel warm strength 1; the paddock and the flock band beyond (F1 at stand/peck, ambient), sky | b03 B03-SH05 Depth |
| Camera | eye (−2.0, 0.75, −1.2) → (−1.95, 0.75, −1.05), yaw 148 → 150, pitch 10, f 1000, hy 860, ease-out over L 0–20 | b03 B03-SH05 Camera |
| MEREDITH | T18 `order-chop` keys and face (chop L 4–7, mouth L 6–16) | T18 |
| GUNNER-1 | T11 front, fists on G1, eyes on the sights, still | b03 B03-SH05 |
| GUNNER-2 | (0.75, 0, 0.45) T12 E (`P34`), spare pan in both mittens held on his thighs; at the left edge, leaving frame as the camera arcs | b03 B03-SH05 |
| G1 | (0, 0, 0), barrel −z, loaded (pan seated, `magTurn` 0), still; muzzle off frame left | b03 B03-SH05 |
| No text | no card, label or name: only the Editor's subtitle | FACTCHECK-R2 O2 |
| Probe leads | MEREDITH L 0 and 20 | T03 probe |

**Open-question dependency (Q8).** As written the shot is 21 f; the alternative holds it to global 704 (37 f) with the end key held.

**Judgment for the builder (Hard).** War-film grammar played straight: the low lens, the raised arm, the chop landing on "ยิง!" (L 6–7), a set face. No smirk, no comedy in this shot.

## r3 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R3`)
These override any older value in this ticket that they name.
- **Lewis gun (T13 r3).** After the gun's `placeBuild`, call `paintLewisPanTicks(p, c, seed, at, heading, magTurn, {elev, recoil})` in the next paint slot (before anything in front of the gun); without it the pan step per round is invisible. Every gun point (muzzle, pan, port, grip, stock, cock) comes from `lewisAnchors(at, heading, {elev, recoil, cock})`, never from a sheet literal: the locked gun is 1.32 m long with the muzzle 0.66 m ahead of the tripod head, so the sheet anchors that assumed a 1.1 m gun are superseded (index TF17).

## R9 notes (Film, 2026-11-20, `EDU-EP30-TICKETS-R9`)
These override any older value in this ticket that they name.
- **Caption zone (TF46).** Measure with `--band 1150:1344 --max-mean 0.80 --max-p95 0.99`.


## R10 look check (Film, 2026-11-20, `EDU-EP30-TICKETS-R10`)
Viewed `T23-sheet.png`. **Verdict: accept with value change; re-proof with the T41 face.**
- Lead (TF50): rows 654 / 696 ± 30 → **717 ± 30 at L 0, 763 ± 30 at L 20** (as built).
- Mittens read off the frame accepted (no mitten probe needed).
- F1 flock band behind the lens (TF52): accepted, nothing visible; the point aims off screen left, toward the lens side, which is the eyeline of the B03-SH01 reverse. Leaving the paint call is harmless.
- GUNNER-2's spare pan off frame: accepted.
- Face: T41 changes only `cast.ts`; this plate is re-rendered there, no code change here.

## Proof
- Stills (`out/edu30-T23/`): L 0, 4, 6, 7, 12, 20; `scripts/qa-sheet.sh out/edu30-T23/sheet.png --cols 6 --width 270 out/edu30-T23/s*.png`; `measure-shots.ts B03-SH05 0,20`; clean L 7 through `caption-zone.py`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| L 0 | arm raised, face serious | MEREDITH 654 ± 30 px; raised mitten (470, 591) ± 40 |
| L 7 | the point lands, mouth open | point mitten (318, 735) ± 40 (start camera) or (250, 712) ± 40 (end); mitten above y 1100 |
| L 20 | held point | MEREDITH 696 ± 30 px |

## Result (Boss fills)
Commit (this branch, see git log "T23") · built 2026-11-20 on Sonnet medium · fix passes used 0 · no open question.
- Code: `src/painted/edu30/shots/B03-SH05.tsx` (plate replaces the stub; N 21; camera ease-out L 0-20; MEREDITH T18 `chop`; GUNNER-1 T11 front fists on G1; GUNNER-2 `loader` pose at (0.75, 0, 0.45) with a spare pan drum (T12 `heldPan` shape) at y 0.5 in both mittens; G1 loaded, `paintLewisPanTicks` in the next slot, anchors from `lewisAnchors`; F1 40 birds stand/peck over the paddock; newsreel default reel warm strength 1; no text).
- Proof: store `projects/edu/EDU/previews/T23-sheet.png` (L 0, 4, 6, 7, 12, 20), frames `T23-s00/04/06/07/12/20.png` (clean, no guides or tag).
- Measured (`measure-shots.ts B03-SH05 0,4,6,7,12,20`): MEREDITH lead L 0 **717** px (x 542), L 20 **763** (x 475), L 7 742; GUNNER-1 408 / 436; GUNNER-2 448 / 483 (head x 124 to 37, leaves frame). Caption zone clean L 7 `--band 1150:1344 --max-mean 0.80 --max-p95 0.99`: mean 0.736, p95 0.877, pass. Raised mitten L 0 about (432, 608) read off the frame (guide 470, 591: 38 / 17 px, inside 40); point mitten L 7 about (228, 708) (end guide 250, 712: 22 / 4 px); mitten y far above 1100. Mouth open L 7, face set. tsc: 0 errors in `src`; `edu30-cast` and `edu30-props` tests pass.
- **Not followed:** (1) MEREDITH lead 717 (L 0) and 763 (L 20) vs rows 654 and 696 ±30: same cause as T18 (decided staging (-0.6, 0, 1.05) and the camera give 1.78 m + hat at about 403 px/m); left as decided, Film to rule (figure 0.2 m farther or f about 920 would meet the row). (2) Mitten rows were read off the frame, not a probe number (no mitten anchor in `measure-shots`). (3) The flock band beyond is behind the lens at yaw 148 (flock at z -60..-30, camera looks +z), so F1 is painted but clips out; no flock is visible. (4) The spare pan on GUNNER-2's thighs is at the left edge and not visible in any frame.
