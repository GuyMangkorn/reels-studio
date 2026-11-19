# T05 — kit gunfire debris: ejected casings, strike spurts, water spouts and splashes
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: capability · Hard: no
Blocked by: T04 (same file `kit/gunfire.ts`, its `roundPhase`) · Consumers: B03-SH01, B03-SH04 (casings at rest), B04-SH03, B04-SH04 (jam casing), B04-SH05 (casings at rest)
Model: sonnet, medium

Read first: [index common rules](index.md#common-rules), brief [VD30-11](../short/film-brief.md#vd30-11) steps 4, 7 and Continuity; sheet rows Casings and Strikes in [b03 B03-SH01](../short/scene-sheets/b03.md) and [b04 B04-SH03](../short/scene-sheets/b04.md).

## Build
Add ballistic casings and strike effects to `src/painted/kit/gunfire.ts`; story clock, seeded, deterministic per frame (closed-form positions, no simulation state carried between frames), plain fills.
Files: `src/painted/kit/gunfire.ts`, `tests/gunfire.test.ts`, `src/painted/edu30/shots-index.tsx` (extends `EDU30-FX`)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| `casingAt(i, L, spec)` | casing i is ejected on frame `rounds[i] + 1` from `spec.port` (world V3); initial velocity in the gun frame: side `spec.side` × U(1.5, 2.6) m/s (seeded per casing; side +1 = receiver's right), up U(2.6, 3.1) m/s, back 0.3 m/s; gravity 9.81 m/s²; spin 2–3 turns over the flight; returns `{pos, angle, state: 'air' \| 'rest' \| 'sunk', glint}` | VD30-11 step 4 |
| Landing | on `spec.ground(x, z)` (callback); first contact: restitution 0.3 vertical, 0.5 horizontal, one bounce, then rest at the second contact; paddock lands 0.8–1.5 m right of the gun (check: measured over 11 casings) | VD30-11 step 4 (B03 one bounce) |
| Water (`spec.water?: {y: number; inside(x, z): boolean}`) | a casing whose first contact is inside the water: state `sunk` from that frame, draws nothing, and spawns a plop ring (below); otherwise pings on the slope: one bounce, rest | VD30-11 step 4 (B04) |
| Glint | one frame at the apex of the arc: the casing drawn `#fff6d8` instead of brass | VD30-11 step 4 |
| `paintCasings(p, c, L, rounds, spec)` | every casing with `rounds[i] + 1 ≤ L` drawn as a plain quad 56 × 12 mm, brass `#c9a54a` body with the base 10 mm `#7a5c22`, min drawn length 3 px; casings at rest stay for the rest of the shot | VD30-11 step 4 |
| `restingCasings(rounds, spec)` | the rest positions only (for later shots: B03-SH04, B04-SH05 lay them static) | VD30-11 Continuity |
| Plop ring | ellipse on the water plane, radius 0 → 0.15 m over 8 f, stroke 1.5 px `#e8e4d8` alpha 0.8 → 0 | VD30-11 step 4 |
| `paintSpurts(p, c, L, rounds, s: {points: V3[]; kind: 'dust' \| 'mud' \| 'spout'; h: [min, max]; seed})` | round i uses `points[i]`; life 8 f from the round frame: f 0–2 rise to height h (seeded in range), f 3–7 fall and spread; dust: 6 streaks `#8a6a48` + 4 chaff flecks `#d8c48a` + a puff `#a08a66` alpha 0.4; mud: 6 streaks `#5a4632` + puff alpha 0.3; spout: one column 0.06 m wide `#e8e4d8` alpha 0.85 to height h, crown of 4 droplets, plus a plop ring at its base | VD30-11 step 7 |
| Heights | B03 dust 0.6–1.2 m; B04 mud and spout 0.4–0.9 m | sheets |
| `paintSplash(p, c, L, at: V3, start, seed)` | a crown 0.40 m wide, 0.35 m high at f 2, droplets falling to f 10, `#e8e4d8`, plus two rings radius → 0.5 m over 12 f | b04 B04-SH03 Queue row (two hops, splash at local 24) |
| Keyed path (jam casing) | `casingKeyed(keys: {L; pos: V3; angle}[], L)` linear between keys; B04-SH04 provides the keys | b04 B04-SH04 Staging |
| Ejection side | +1 (receiver's right) until Boat answers index O5; a change flips only `side` | index O5 |

## Proof
- `node scripts/test.mjs tests/gunfire.test.ts`: casing i before `rounds[i] + 1` returns nothing; positions are the same when computed for frame L directly or after computing frames 0…L (no hidden state); 11 paddock casings rest 0.8–1.5 m to the right.
- Extend `EDU30-FX`: casings with ground y 0, dust spurts at points along z −3..−6 ahead of the CAL gun, plus one spout and one splash on a flat water rectangle at y 0.3 in front of the camera. Stills at FX frames 1, 6, 12, 20, 40.
- `scripts/qa-sheet.sh out/edu30-T05/sheet.png --cols 5 --width 270 out/edu30-T05/fx*.png`

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| FX 6 | casings in the air with one glint; a dust spurt at height | spurt height 0.6–1.2 m (projected, logged) |
| FX 40 | 11 casings at rest right of the gun; no spurt left | rest distance 0.8–1.5 m for all 11 (logged) |
| FX 12 | spout column and splash crown readable at 270 px | spout width ≥ 3 px at 270 px scale |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
