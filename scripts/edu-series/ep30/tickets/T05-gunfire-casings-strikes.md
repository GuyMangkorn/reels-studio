# T05 — kit gunfire debris: ejected casings, strike spurts, water spouts and splashes
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready (B03 casing count depends on open Q8)
Class: capability · Hard: no
Blocked by: T04 (same files `kit/gunfire.ts`, `tests/gunfire.test.ts`, `proof-fx.tsx`; uses `roundPhase`) · Consumers: B03-SH01, B04-SH03, B04-SH04 (jam casing), B04-SH06 and B04-SH05 (casings at rest)
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
| Keyed path (jam casing) | `casingKeyed(keys: {L; pos: V3; angle}[], L)` linear between keys; B04-SH04 keys: L 13 at the port (−5.45, 0.82, −4.95), L 17 on the stone (−5.4, 0.33, −4.9), bounce apexes L 19 (+0.04 m) and L 21 (rest) | b04 B04-SH04 Staging (SD07) |
| Ejection side | +1 (receiver's right) until Boat answers index O5; a change flips only `side` | index O5 |

**Open-question dependency (Q8).** The B03 casing count is the round count (23 as written); the alternative changes the count only.

## Proof
- `node scripts/test.mjs tests/gunfire.test.ts`: casing i before `rounds[i] + 1` returns nothing; frame L computed alone equals frame L after 0…L (no hidden state); 23 paddock casings rest inside the B03 box; no B03 strike point within 4 m of a `flockIn` bird (seed 31000, the F1 call of T08).
- `FX30-debris` in `proof-fx.tsx` (80 f): `FX30-fire` set plus casings (ground y 0), dust spurts at the B03 points, one spout and one splash on a flat water rectangle at y 0.3 in front of the camera.
- Stills at L 3, 8, 14, 22, 75 → `out/edu30-T05/`; `scripts/qa-sheet.sh out/edu30-T05/sheet.png --cols 5 --width 270 out/edu30-T05/fx*.png`

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| L 8 | casings in the air with one glint; a dust spurt at height | spurt height 0.6–1.2 m (projected, logged) |
| L 75 | 23 casings at rest right of the gun; no spurt left | all 23 inside the box (logged) |
| L 14 | spout column and splash crown readable at 270 px | spout width ≥ 3 px at 270 px scale |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
