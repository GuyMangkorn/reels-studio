# T05 — kit gunfire debris: ejected casings, strike spurts, water spouts and splashes
Deliverable: EDU-EP30-SHORT · Revision: r5 · Status: done (r5 Film, 2026-11-20: casings still falling at the B03-SH01 cut accepted, proof row moved to L 71 / L 98; jam-casing angles and heading decided for T27; no Boss pass; r1 built, tests 18/18) · r3, r4: Film notes
Class: capability · Hard: no
Blocked by: T04 (r4 fix pass first; same files `kit/gunfire.ts`, `tests/gunfire.test.ts`, `proof-fx.tsx`; uses `roundPhase`), T10 (r3: `STONE_AT`) · Consumers: B03-SH01, B04-SH03, B04-SH04 (jam casing), B04-SH06 and B04-SH05 (casings at rest)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); brief [VD30-11](../short/film-brief.md#vd30-11) steps 4, 7 and Continuity; Casings and Strikes rows in b03 B03-SH01 and b04 B04-SH03; b04 B04-SH04 Staging (jam casing).

## Build
Add ballistic casings and strike effects to `src/painted/kit/gunfire.ts`: story clock, seeded, closed-form per frame (no simulation state between frames), plain fills.
Files: `src/painted/kit/gunfire.ts`, `tests/gunfire.test.ts`, `src/painted/edu30/proof-fx.tsx` (adds `FX30-debris`)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| `casingAt(i, L, spec)` | casing i leaves `spec.port` (world V3) on frame `rounds[i] + 1`; initial velocity in the gun frame: side `spec.side` × U(1.5, 2.6) m/s (seeded per casing; +1 = receiver's right), up U(2.6, 3.1) m/s, back 0.3 m/s; gravity 9.81 m/s²; 2–3 turns over the flight; returns `{pos, angle, state: 'air' \| 'rest' \| 'sunk', glint}` | VD30-11 step 4 |
| Landing | on `spec.ground(x, z)`; first contact: restitution 0.3 vertical, 0.5 horizontal, one bounce, rest at the second contact | VD30-11 step 4 (B03 one bounce) |
| B03-SH01 landing box | 23 casings rest in x +0.8..+1.5, z −0.2..+0.4 (paddock G1 at the origin, barrel −z, receiver right = +x); seed search per casing until inside | b03 B03-SH01 Casings row |
| Water (`spec.water?: {y; inside(x, z)}`) | a casing whose first contact is inside the water: state `sunk` from that frame, draws nothing, spawns a plop ring; otherwise one ping on the slope, rest | VD30-11 step 4 (B04) |
| Glint | one frame at the arc apex: drawn `#fff6d8` instead of brass | VD30-11 step 4 |
| `paintCasings(p, c, L, rounds, spec)` | every casing with `rounds[i] + 1 ≤ L`: plain quad 56 × 12 mm, brass `#c9a54a`, base 10 mm `#7a5c22`, min drawn length 3 px; resting casings stay to the end of the shot | VD30-11 step 4 |
| `restingCasings(rounds, spec)` | rest positions only; B04-SH06 and B04-SH05 lay the 11 dam casings static from it (same spec and seed as B04-SH03) | VD30-11 Continuity; b04 SH06/SH05 Spent casings rows |
| Plop ring | ellipse on the water plane, radius 0 → 0.15 m over 8 f, stroke 1.5 px `#e8e4d8`, alpha 0.8 → 0 | VD30-11 step 4 |
| `paintSpurts(p, c, L, rounds, s: {points: V3[]; kind: 'dust' \| 'mud' \| 'spout'; h: [min, max]; seed})` | round i uses `points[i]`; life 8 f from the round frame: f 0–2 rise to h (seeded in range), f 3–7 fall and spread; dust: 6 streaks `#8a6a48` + 4 chaff flecks `#d8c48a` + puff `#a08a66` alpha 0.4; mud: 6 streaks `#5a4632` + puff alpha 0.3; spout: one column 0.06 m wide `#e8e4d8` alpha 0.85 to h, crown of 4 droplets, plop ring at its base | VD30-11 step 7 |
| Strike points and heights | B03: 23 seeded points walking from z −14 to z −26 (round i at z −14 − 12 i / 22, x seeded −6..+6), dust, h 0.6–1.2 m, never closer than 4 m to a bird; B04: 11 points along the queue's line on the rim and the shallows between the gun and the queue head (x walking from −1.0 to +1.4, z seeded −4.9..−5.6; the head is at x 3.6 → 3.0), mud on the rim, spout in the water, h 0.4–0.9 m, never closer than 1.5 m to a bird | b03, b04 Strikes rows; CAT02 (no hits) |
| `paintSplash(p, c, L, at: V3, start, seed)` | crown 0.40 m wide, 0.35 m high at f 2, droplets falling to f 10, `#e8e4d8`, two rings → 0.5 m over 12 f | b04 B04-SH03 Queue row (two hops, splash at local 25) |
| Keyed path (jam casing) | `casingKeyed(keys: {L; pos: V3; angle}[], L)` linear between keys; B04-SH04 keys (r3): L 13 at the port `lewisAnchors(...).port` (−5.679, 0.857, −4.95), L 17 on the stone top `STONE_AT` + (0, 0.05, 0) = (−5.63, 0.38, −4.9), bounce apexes L 19 (+0.04 m) and L 21 (rest) | b04 B04-SH04 Staging (SD07) |
| Ejection side | +1 (receiver's right) until Boat answers index O5; a change flips only `side` | index O5 |

**Open-question dependency (Q8).** The B03 casing count is the round count (23 as written); the alternative changes the count only.

## r3 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R3`)
These override any older value in this ticket that they name.
- **Jam casing keys (r3).** L 13 at the port = `lewisAnchors([−5.6, 0.32, −5.0], 0).port` = (−5.679, 0.857, −4.95) (was (−5.45, 0.82, −4.95)); L 17 on the stone top = T10 r3 `STONE_AT` + (0, 0.05, 0) = (−5.63, 0.38, −4.9) (the stone moved with the gun's real port, TF19); bounce apexes L 19 (+0.04 m) and L 21 (rest) unchanged. Read both from `props.ts` / `dam.ts`, not literals.
- **Haze (T04 r3).** Debris drawn over the smoke keeps its own alpha; T04's haze cap does not apply to casings, spurts or spouts.
- **Lewis gun (T13 r3).** When this ticket's proof paints a gun, after its `placeBuild`, call `paintLewisPanTicks(p, c, seed, at, heading, magTurn, {elev, recoil})` in the next paint slot (before anything in front of the gun); without it the pan step per round is invisible. Every gun point (muzzle, pan, port, grip, stock, cock) comes from `lewisAnchors(at, heading, {elev, recoil, cock})`, never from a sheet literal: the locked gun is 1.32 m long with the muzzle 0.66 m ahead of the tripod head, so the sheet anchors that assumed a 1.1 m gun are superseded (index TF17).

## r4 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R4`)
These override any older value in this ticket that they name.
- **T04 r4.** The smoke puff's five circles each take α_c = 1 − (1 − α)^(1/5) (T04 r4 decision 1); T05 adds no smoke of its own. Build after the T04 r4 commit (same files).

## Proof
- `node scripts/test.mjs tests/gunfire.test.ts`: casing i before `rounds[i] + 1` returns nothing; frame L computed alone equals frame L after 0…L (no hidden state); 23 paddock casings rest inside the B03 box; no B03 strike point within 4 m of a `flockIn` bird (seed 31000, the F1 call of T08).
- `FX30-debris` in `proof-fx.tsx` (80 f): `FX30-fire` set plus casings (ground y 0), dust spurts at the B03 points, one spout and one splash on a flat water rectangle at y 0.3 in front of the camera.
- Stills at L 3, 8, 14, 22, 75 → `out/edu30-T05/`; `scripts/qa-sheet.sh out/edu30-T05/sheet.png --cols 5 --width 270 out/edu30-T05/fx*.png`

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| L 8 | casings in the air with one glint; a dust spurt at height | spurt height 0.6–1.2 m (projected, logged) |
| L 75 | 23 casings at rest right of the gun; no spurt left | all 23 inside the box (logged) |
| L 14 | spout column and splash crown readable at 270 px | spout width ≥ 3 px at 270 px scale |

## r5 decisions (Film, 2026-11-20, `EDU-EP30-TICKETS-R5`): Boss's two questions
Viewed: store `T05-sheet.png` (L 3, 8, 14, 22, 75) at about 220 px a tile. Casings, glint, dust spurts, the spout column and the splash are readable; the splash crown reads as a small white cone at this size, accepted for the capability (T27 judges it in the plate at its real size).
1. **L 75 row: accept the casings still falling at the cut; the row moves.** The ballistics are right (0.54 m port height, 2.6–3.1 m/s up: about 21 f in the air), and the burst runs to the last frames of the shot, so brass still in the air at the cut is what a real burst looks like and keeps the motion going into the hard cut. Replaced proof row: **L 71** (B03-SH01's last frame): 13 of 23 at rest, the other 10 in the air, none under the ground (measured 13 at L 71: pass); **L 98**: all 23 at rest inside the B03 box (the test at L 140 covers it: pass). No re-render.
2. **Continuity into B03-SH02 (new, T25).** B03-SH02 must not show all 23 at rest one frame after 10 were airborne: T25 paints the B03-SH02 casings with `paintCasings(p, c, 72 + L, rounds, spec)` (the B03-SH01 spec, rounds and seed; L = B03-SH02 local), so the last 10 land during B03-SH02 local 0–26, instead of `restingCasings` (note in T25 r5). B04-SH06 and B04-SH05 keep `restingCasings` (their burst ended four shots earlier).
3. **Jam casing (B04-SH04), keys with angle and heading.** `angle` is the tilt of the casing axis out of the horizontal (rad, as `casingAt`); `heading` 0 at every key (the axis along world x, side-on to the B04-SH04 lens, which looks roughly −z, so the casing shows its 56 mm length, not its end):

| Key | L (B04-SH04 local) | pos | angle (rad) | Reading |
| --- | --- | --- | --- | --- |
| leaves the port | 13 | `lewisAnchors([−5.6, 0.32, −5.0], 0).port` = (−5.679, 0.857, −4.95) | 0 | axis level as it is kicked out |
| hits the stone | 17 | `STONE_AT` + (0, 0.05, 0) = (−5.63, 0.38, −4.9) | 5.80 (one turn less 0.48 rad: base end down 27°) | strikes base first (the "tink") |
| bounce apex | 19 | stone top + (0, 0.04, 0) | 6.78 (2π + 0.50) | flips up off the stone |
| rest | 21 | stone top | 9.42 (3π: lying flat) | settles on its side to the last frame |

`casingKeyed` lerps angle linearly (as built). No glint on the jam casing (it is not ejected by firing). T27 reads these values (note in T27 r5).
4. **Plain defaults Boss chose (spurt rise/fall, streak widths, splash crown five spikes, second ring +3 f, glint frame rounded, second flight half a turn): accepted as built.**
- Fix passes used: 0. Status **done**.

## Result (Boss fills)
- Built 2026-11-19 (Boss, Sonnet medium) on `worktree-agent-a07e395bd5f082c0f` after T04 r4 and T10 r4; commit: this edit. Files: `src/painted/kit/gunfire.ts` (`casingAt`, `restingCasings`, `paintCasing`, `paintCasings`, `paintRing`, `casingKeyed`, `spurtHeight`, `spurtProfile`, `paintSpurts`, `strikePoints`, `paintSplash`; `CasingSpec` carries `port`, `side`, `seed`, `dir` (barrel direction, needed for the gun frame), `ground`, `water`, `box`), `tests/gunfire.test.ts` (18 pass, 6 new), `src/painted/edu30/proof-fx.tsx` (`FX30-debris`, 80 f; G1 at the origin, barrel -z, with T13 pan ticks and recoil).
- Proof: `out/edu30-T05/sheet.png` (fx03, fx08, fx14, fx22, fx75; viewed) plus crops viewed. Store (`projects/edu/EDU/previews/`): `T05-sheet.png`, `T05-fx03/08/14/22/75.png`, `T05-crop14.png`, `T05-low75.png`.
- Measured: L 8 spurts alive at heights 0.834, 0.678, 1.085 m (all in 0.6-1.2; 42, 33, 52 px at the full-res peak); L 14 spout width 0.06 m = 20 px full-res = 5.0 px at 270 px (needs >= 3: pass; the spout sits 3.0 m from the lens); no B03 strike point within 4 m of an F1 bird (seed 31000; test). Casings: 23 of 23 rest inside the box by L 98; **at L 75 only 15 of 23 are at rest** (13 at L 71, 16 at L 79) with all the rest still in the air.
- Values not followed: the L 75 row ("23 casings at rest, all 23 inside the box") cannot hold with this ticket's own ballistics: a casing leaves the port at about 0.54 m with up-speed 2.6-3.1 m/s, so its first flight alone is about 0.7 s (21 f) and the last round (local 68) lands about L 98; B03-SH01 is [688, 760) = 72 f, so the shot ends with 10 casings still falling. The built rest points are all inside the box (test, L 140), but the ticket's L 75 pass range is not met. Not changed because the values are Film's.
- Choices the ticket left open (implemented as plain defaults, listed for Film): spurt rise is linear to h at f 2 (f 0 = h/3), fall linear to 0 at f 8; dust/mud streak width 0.03 m tapering to 0.015, chaff fleck 0.02 m, puff ellipse radius 0.25 h, no puff fade; the splash crown is five spikes gone by f 6 and its second ring starts 3 f after the first; jam-casing key angles and the casing axis heading are caller values (the test uses 0, 1, 2, 3); the glint frame is the apex rounded to a frame; the second flight turns half a turn.
- Open questions for Film: (1) L 75 row: move the frame to L 98, or accept casings still falling at the shot end (B03-SH01 ends at L 71 with 13 at rest)? (2) jam casing angles at the four keys (L 13, 17, 19, 21).
- Fix passes used: 0.
