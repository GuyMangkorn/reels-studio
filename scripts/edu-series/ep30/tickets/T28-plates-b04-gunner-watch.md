# T28 — plates B04-SH06 (GUNNER-1 racks the dead gun, "โธ่เอ๊ย…") and B04-SH05 (PB01: EMU-HERO checks an invisible watch, three foot taps) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: ready (Q7 answered by the user: values as written) · r3: Film notes added (TICKETS-R3)
Class: set (plates) · Hard: yes (gunner arm and face, emu mime)
Blocked by: T03, T05, T07, T10, T11, T13, T15, T16, T17 · Consumers: B04-SH06, B04-SH05 (global 1062–1149; play order SH06 then SH05)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); shot blocks [b04.md](../short/scene-sheets/b04.md) B04-SH06 and B04-SH05 (authoritative; SD14, SD15); brief [VD30-12, VD30-13](../short/film-brief.md#r3-changes) (no watch, strap, clock face, time or date painted; the gunner unnamed, never idle).

## Build
Replace the two stub shot files with the plates.
Files: `src/painted/edu30/shots/B04-SH06.tsx`, `src/painted/edu30/shots/B04-SH05.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Both | space D, morning, newsreel warm strength 1; no shake | b04 |
| B04-SH06 camera | eye (−4.6, 1.45, −3.9) → (−4.68, 1.45, −3.95), yaw −57 → −55, pitch −12, f 950, hy 800, ease-in-out L 0–23; clearance 0.70–0.72 m (T10) | b04 B04-SH06 Camera; T10 |
| B04-SH06 set | T10 `paintDam({nearSlope: true})`: lit inner slope in the lower frame, wet rim, water and far bank, sky; spent casings at rest on the slope and in the shallows (T05 `restingCasings` of B04-SH03); the jam wisp from the action (T13, L 0–12) | b04 B04-SH06 Staging |
| B04-SH06 GUNNER-1 and G1 | T17 `cockingPull` + face keys on T11 `front34` at (−6.2, 0.36, −4.75); G1 (−5.6, 0.32, −5.0) barrel +x with T13 `cock` keys; GUNNER-2's spare pan just at the left edge at the start (T13 pan build at (−6.4, 0.75, −4.0), no figure) | b04 B04-SH06; T17 |
| B04-SH06 off frame | MEREDITH and GUNNER-2 at their withdrawal marks, not painted | b04 Space D continuity |
| B04-SH05 camera | fixed eye (−1.6, 1.15, −4.75), yaw 89.3 → 85.3, pitch −2, f 950, hy 860, ease-in-out L 0–63 (the SCENE-R1 camera) | b04 B04-SH05 Camera |
| B04-SH05 EMU-HERO | queue head (1.6, 0.33, −4.9), heading π (facing −x, the lens): T15 `emuWatchCheck(L)` and `emuFootTap(L, [40, 47, 54])` | b04 B04-SH05; T15 |
| B04-SH05 queue | T16 B04-SH05 stare (heads to the lens) and the turn-away from L 57 | T16 |
| B04-SH05 set | spent casings on the rim and in the shallows between lens and birds (T05 resting positions; those within 0.5 m of the lens are skipped); water, far bank, east shore; G1 behind the lens (not painted) | b04 B04-SH05 Staging |
| B04-SH05 nothing painted | no watch, strap, dial, number or mark on the wing; no gunner in frame | VD30-12; FACTCHECK-R3 |
| Probe leads | B04-SH06 GUNNER-1 L 0 and 23; B04-SH05 EMU-HERO L 0 and 63 | T03 probe |

**Open-question dependency (Q7, index O8).** As written: gunner 1062–1086, emu 1086–1150. If the user picks emu from 1076 (gunner 0.47 s) or gunner to 1096 (emu 1.8 s), T03, T15 and T17 are revised first and this ticket follows at r2; the global frames of the wing lift (1094–1102), the taps (1126, 1133, 1140) and the turn-away (1143) do not change.

**Judgment for the builder (Hard).** B04-SH06: one practised rack and an angry groan at the gun, eyes on the gun, both fists back on the gun by L 8. B04-SH05: deadpan patience: the wing comes up like a wristwatch, a long still read, the head back up, three small taps, the wing down; the queue shuffles off as the narrator starts Plan 3. The wait reads short and the gunners are heard working (the click is off screen).

## r3 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R3`)
These override any older value in this ticket that they name.
- **Lewis gun (T13 r3).** After the gun's `placeBuild`, call `paintLewisPanTicks(p, c, seed, at, heading, magTurn, {elev, recoil})` in the next paint slot (before anything in front of the gun); without it the pan step per round is invisible. Every gun point (muzzle, pan, port, grip, stock, cock) comes from `lewisAnchors(at, heading, {elev, recoil, cock})`, never from a sheet literal: the locked gun is 1.32 m long with the muzzle 0.66 m ahead of the tripod head, so the sheet anchors that assumed a 1.1 m gun are superseded (index TF17). B04-SH06: handle rest at (663, 961) ± 25 on the start camera (T13 r3).

## Proof
- Stills (`out/edu30-T28/`): SH06 L 0, 3, 6, 8, 14, 23; SH05 L 0, 6, 12, 18, 30, 38, 40, 47, 54, 60, 63.
- `scripts/qa-sheet.sh out/edu30-T28/sheet.png --cols 6 --width 270 out/edu30-T28/s*.png`; `measure-shots.ts B04-SH06 0,23` and `B04-SH05 0,63`; clean SH06 L 14 and SH05 L 30 through `caption-zone.py`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| SH06 L 3 / 8 | handle pulled back / right fist back on the grip; left fist on the stock throughout | GUNNER-1 593–624 px; face above y 1100; `thumb check` and `arm check` lines |
| SH05 L 30 | bare wing bent across the chest at wrist height, head down to it | wrist near (599 → 666, 733) ± 40 px; nothing painted on the wing |
| SH05 L 40 / 47 / 54 | right toes down on each tap frame, pad planted | toe angle 0 on the tap frame, 25° two frames before |
| SH05 L 63 | wing down, nearest birds turning away up the shore | EMU-HERO 505 ± 30 px; tuft and bib visible |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
