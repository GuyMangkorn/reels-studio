# T25 — plates B03-SH02 (top shot: six groups burst out) and B03-SH03 (EMU-HERO's silent wing signal splits its group, L07 mime) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: ready · r3: Film notes added (TICKETS-R3) · r5: Film note added (TICKETS-R5)
Class: set (plates) · Hard: yes (running flock, wing gestures)
Blocked by: T03, T04, T05, T07, T08, T09, T11, T12, T15 · Consumers: B03-SH02, B03-SH03 (global 760–867)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); shot blocks [b03.md](../short/scene-sheets/b03.md) B03-SH02 and B03-SH03 (authoritative; SD17); brief [VD30-12](../short/film-brief.md#r3-changes) (no caption, word, arrow or overlay on the split).

## Build
Replace the two stub shot files with the plates.
Files: `src/painted/edu30/shots/B03-SH02.tsx`, `src/painted/edu30/shots/B03-SH03.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Both | space P, light m 0, eaten 0.4, newsreel warm strength 1, no shake (T03 overscan row) | T03, T09 |
| B03-SH02 camera | eye (0, 18 → 20, 10) linear over L 0–50, yaw 0, pitch −48, f 800, hy 860 | b03 B03-SH02 Camera |
| B03-SH02 set | T09 high-view wheat (pitch −48); gun position with the crew small (MEREDITH, GUNNER-1, GUNNER-2 and G1 at their marks, still), the 23 casings at rest (T05 `restingCasings`), smoke haze over the gun continuing B03-SH01's puffs (T04 `paintSmoke` called with L + 72 and the B03-SH01 rounds); fence and track at the bottom (in the band, set only) | b03 B03-SH02 Staging |
| B03-SH02 flock | T08 `burst(L)`; dust trails per group | T08 |
| B03-SH03 camera | eye (12.0, 1.1, −29.0) → (12.0, 1.1, −29.3), yaw 0 → −2, pitch 0, f 900, hy 860, ease-in-out L 0–56 | b03 B03-SH03 Camera |
| B03-SH03 set | stubble rows and the eaten patch around the bird (it stands on dry dirt between stalk rows, inside the eaten patch x −25..+25, z −60..−20; eaten 0.4), far wheat and paddock, sky; settling dust `fall.ts` density 0.3 → 0 over L 0–30 | b03 B03-SH03 Depth |
| B03-SH03 EMU-HERO | (12.0, 0, −32.0), heading π/2 (facing +z, front to the lens): T15 `emuWingFlick(L)`; T07 blink from L 44 | b03 B03-SH03; T15 |
| B03-SH03 group | T08 `halves(L)` | T08 |
| No overlay | no caption, word, arrow or diagram; the Editor's caption track is empty here | VD30-12; FACTCHECK-R3 |
| Probe leads | B03-SH03 EMU-HERO L 0 and 56 | T03 probe |

**Judgment for the builder (Hard).** The split must read with no words at 270 px: one wing points left and the left half peels off left, one wing points right and the right half peels off right, then the commander stands alone looking at the lens. One gesture at a time; stillness between them.

## r3 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R3`)
These override any older value in this ticket that they name.
- **Lewis gun (T13 r3).** After the gun's `placeBuild`, call `paintLewisPanTicks(p, c, seed, at, heading, magTurn, {elev, recoil})` in the next paint slot (before anything in front of the gun); without it the pan step per round is invisible. Every gun point (muzzle, pan, port, grip, stock, cock) comes from `lewisAnchors(at, heading, {elev, recoil, cock})`, never from a sheet literal: the locked gun is 1.32 m long with the muzzle 0.66 m ahead of the tripod head, so the sheet anchors that assumed a 1.1 m gun are superseded (index TF17).

## r5 notes (Film, 2026-11-20, `EDU-EP30-TICKETS-R5`)
These override any older value in this ticket that they name.
- **B03-SH02 casings continue B03-SH01 (T05 r5).** Ten of the 23 casings are still in the air at the B03-SH01 cut, so B03-SH02 paints them with `paintCasings(p, c, 72 + L, rounds, spec)` (the B03-SH01 rounds, spec and seed; L = B03-SH02 local), not `restingCasings`: the last ten land by local 26 and stay. Proof row: at B03-SH02 local 0 the count at rest equals T05's count at B03-SH01 L 72 (logged), and at local 26 all 23 rest inside the B03 box.

## r7 notes (Film, 2026-11-20, `EDU-EP30-TICKETS-R7`)
These override any older value in this ticket that they name.
- **B03-SH02 burst (T08 r5 B1–B4, TF25).** Six tight groups at L 0 run outward; nobody needs to leave the frame by L 45. Read the burst with T08 r5 `burst(L)` as built. The acceptance stays "six distinct groups read at 270 px"; the exit state becomes "six groups spreading out, the hero group heading for the B03-SH03 mark". Only the 40 birds and their dust are painted.
- **B03-SH03 halves (T08 r5 H1–H3, TF24).** 12 m/s; the left half is fully off screen left by local 24 and the right half off screen right by local 40, so EMU-HERO is alone from about local 40 to 56 (the blink at 44–46 falls inside).

## Proof
- Stills (`out/edu30-T25/`): SH02 L 0, 14, 30, 45; SH03 L 0, 6, 10, 16, 22, 26, 34, 40, 56.
- `scripts/qa-sheet.sh out/edu30-T25/sheet.png --cols 7 --width 270 out/edu30-T25/s*.png`; `measure-shots.ts B03-SH03 0,56`; clean SH03 L 8 and L 24 through `caption-zone.py`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| SH02 L 14 / 45 | six distinct groups / gone through the edges; gun above y 1100 | 6 groups (cluster count logged); gun (540, 1044 → 1081) ± 30 |
| SH03 L 8 | right wing pointing screen left, left half turning left | wing tip near (270, 830) ± 60 px |
| SH03 L 24 | left wing pointing screen right, right half turning right | wing tip near (810, 830) ± 60 px |
| SH03 L 40 | EMU-HERO alone, wings folded, facing the lens | EMU-HERO 510–567 px; tuft and bib visible |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
