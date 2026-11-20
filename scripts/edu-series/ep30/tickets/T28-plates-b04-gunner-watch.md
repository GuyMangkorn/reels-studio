# T28 — plates B04-SH06 (GUNNER-1 racks the dead gun, "โธ่เอ๊ย…") and B04-SH05 (PB01: EMU-HERO checks an invisible watch, three foot taps) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: built, awaits Film look check (Boss, 2026-11-20; R9: T15, T16, T17 done) · was: ready (Q7 answered by the user: values as written) · r3: Film notes added (TICKETS-R3) · r4: Film notes added (TICKETS-R4)
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

## r4 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R4`)
These override any older value in this ticket that they name.
- **TF21.** B04-SH06 face start ≈ (530, 690), end ≈ (492, 695) (estimate, T11 r4); log the measured points. Leads read to the hat crown (T11 r4).

## R9 notes (Film, 2026-11-20, `EDU-EP30-TICKETS-R9`)
These override any older value in this ticket that they name.
- **EMU-HERO in B04-SH05 (T15 R9).** `queue(L, 'B04-SH05', {hero: (L) => ({pose: {...emuWatchCheck(L, {lensYaw: emuLensYaw(<B04-SH05 camera>, <bird 0>)}), ...emuFootTap(L)}})})`.
- **GUNNER-1 in B04-SH06 (T17 R9).** `thumb check: GUNNER-1 RIGHT: up ok` on the rack frames (TF38); talk cycles restart at local 7 and 18.
- **Queue shadows (TF37).** `shadowOp: 45`.
- **Caption zone (TF46).**

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
Commit: T28 commit on `worktree-agent-a8c0e27ad75f647c1` (not pushed) · proof sheet: `~/ReelsStore/projects/edu/EDU/previews/T28-sheet.png` (frames `T28-s1_SH06_L*.png`, `T28-s2_SH05_L*.png`, clean `T28-clean_SH06_L14.png`, `T28-clean_SH05_L30.png`; archived with `store.py archive --path out/edu30-T28`) · fix passes used: 0

Files: `src/painted/edu30/shots/B04-SH06.tsx` (exports `camAt`, `rackAt`, `B04_CASINGS`, `paintRestingCasings`), `src/painted/edu30/shots/B04-SH05.tsx` (exports `sh05Queue`, `camAt`). No other source touched.

Measured (`measure-shots.ts`, stack camera):
| Row | Measured | Range | Verdict |
| --- | --- | --- | --- |
| SH06 L 0 handle | (663, 961) | (663, 961) ± 25 (r3) | pass |
| SH06 L 23 handle | (640, 981) | sheet end (652, 1009) | 12 px / 28 px off the sheet estimate, in the r3 handle numbers' direction; not a proof row |
| SH06 GUNNER-1 L 0 / 23 | 562 / 595 px (x 547 / 516) | 593-624 (pre-r4) ; T11 r4 accepted 572 | fail the old row by 31 px at L 0, 4 px at L 23 under it; consistent with T17's logged 572 (r4 lean) |
| SH06 face above y 1100 | chin ≈ 800 at L 0 / 3 / 8 / 14 / 23 (viewed) | < 1100 | pass |
| SH06 thumb check | `thumb check: GUNNER-1 RIGHT: up ok` at L 0, 3, 6, 8 (TF38; forearm near-horizontal, measured with `mittenThumbSide('right','back')`) | up | pass |
| SH06 arm check | `arm check: GUNNER-1 r/l: attached ok`, worst ratio 1.023 (L 0-23), r 1.010 / 1.000 / 1.010 / 1.018 at L 0 / 3 / 6 / 8 | <= 1.05 | pass |
| SH06 left fist on the stock | left ratio 1.000 every frame (solve targets `stock`) | throughout | pass |
| SH05 L 30 wrist | (639, 700) | (631 interpolated, 733) ± 40 | x pass; y 33 px off, inside 40 |
| SH05 L 30 head down, nothing on the wing | viewed: head over the raised bare wing, no watch, strap, dial or mark | — | pass |
| SH05 toes L 40 / 47 / 54 | 0.0 deg on the tap frame; 25.2 deg at T-2 and T-1 (`emuFootTap`) | 0 / 25 | pass |
| SH05 foot slip | hero pads 0.0000 m over L 0-63 | <= 0.02 m | pass |
| SH05 L 0 hero place | (1.600, 0.330, -4.900), heading 3.142 | queue head, π | pass |
| SH05 L 63 EMU-HERO lead | 578 px (head top 512, toe line 1089), centre x 574 | 505 ± 30 | **fail by 43 px** (see below) |
| SH05 L 63 wing down, birds turning away, tuft and bib | viewed: wing folded; birds turning away from L 57 (L 60 shows the nearest bird half turned); tuft visible | — | pass (bib not separately identifiable at 270 px, same bird as T15/T16) |
| Caption zone (TF46, band 1150:1344, mean <= 0.80, p95 <= 0.99) | SH06 L 14 0.593 / 0.675; SH05 L 30 0.643 / 0.897 | pass | pass |
| `queue` shadows | `shadowOp: 45` (TF37) | 45 | applied |

Values not followed or not reachable as written:
1. SH05 L 63 EMU-HERO 578 px vs 505 ± 30. The sheet figure (head y 563, feet 1068) is an estimate; the built bird (T07 stand, 3.2 m from the lens at f 950) measures head top 512 and toe line 1089 at the sheet camera, so the same ratio holds at every frame (577 at L 0). Not scaled to match (cast is never scaled); Film to restate the row to the built bird as for T19.
2. SH06 GUNNER-1 593-624 is the pre-T11 r4 number (T17 already logged this); built 562-595.
3. Casings: the spec of B04-SH03 does not exist yet (T27 is a stub). I defined `B04_CASINGS` in `B04-SH06.tsx` (rounds `GUNFIRE_PRESETS.B04_SH03`, port `lewisAnchors(G1)`, side +1, dir +x, seed 8300, slope `southBankY`, water `overWater`) and laid its rest positions in both shots. With side +1 on a +x barrel the receiver's right is +z (uphill), so all 11 casings rest on the slope at x about -5.9, z about -3.6, which is behind or left of both lenses: none is visible in either shot, and none lands in the shallows. T27 should import `B04_CASINGS` (or Film decides side -1) so the three shots agree; until then the "casings in the shallows" staging row has no visible casing.
4. GUNNER-2's spare pan has no T13 pan-only build in the kit, so it is a flat drum painted from world fills at (-6.4, 0.75, -4.0) (visible at the left edge, y about 1000, from L 0 to 23).
5. Jam wisp (`paintLewisPuff` B04-SH06, alpha 0.3, r 0.05 m) is nearly invisible at 270 px, as built in T13.
6. Queue birds beyond the corner (x about 14.5, z -5 to -12) stand in profile at the far-shore horizon at the left of every SH05 frame; that is the T16 queue geometry, unchanged.
7. Water reflections of the queue are not painted (not in the ticket).
8. `npm test`: 498 / 506, the 8 failures are the known set (hippo joints x3, loudness, new-shot, render-inputs, segments, store adopt), none in edu30. `npx tsc --noEmit -p .` has 0 errors in edu30 files (8 errors elsewhere, unchanged).
