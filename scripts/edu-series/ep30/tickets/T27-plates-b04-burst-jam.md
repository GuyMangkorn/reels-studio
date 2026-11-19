# T27 — plates B04-SH03 (second firing beat, stop dead at E) and B04-SH04 (the jam close-up) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r2 · Status: ready (r2 adds T34 to Blocked by: the registered plate needs the overscan and shake canvas hook)
Class: set (plates) · Hard: yes (queue flinch and hops, gunner mitten, jam action)
Blocked by: T03, T04, T05, T06, T10, T11, T13, T16, T34 · Consumers: B04-SH03, B04-SH04 (global 993–1061)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); shot blocks [b04.md](../short/scene-sheets/b04.md) B04-SH03 and B04-SH04 (authoritative; SD07, SD08); brief [VD30-11](../short/film-brief.md#vd30-11) (Stop, Value).

## Build
Replace the two stub shot files with the plates.
Files: `src/painted/edu30/shots/B04-SH03.tsx`, `src/painted/edu30/shots/B04-SH04.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Both | space D, morning, newsreel warm strength 1 | b04 |
| B04-SH03 camera | fixed eye (−6.30, 0.92, −5.75), yaw 112, pitch 0, f 800, hy 820; `overscan: true`; shake = T04 `shakeAt` B04 spec (stop 42) | b04 B04-SH03 Camera |
| B04-SH03 rounds | `roundFrames(10, 11, 3)` → local 10 … 40 (global 1003 … 1033); at **L 42 everything stops dead**: no flash, no shake, pop 0; L 43 still | index VD30-11; b04 Stop row |
| B04-SH03 G1 | (−5.6, 0.32, −5.0), barrel +x (`G1_AIM.fire`), three-quarter rear-left; recoil and pan turn (84.3° at L 40) per T13 | b04 G1 row |
| B04-SH03 GUNNER-1 | only the right forearm and fist entering from the right edge (T11 B04-SH03 line), jolting with each round, still from L 42 | b04 B04-SH03 |
| B04-SH03 effects | flash halo 260 px + its water mirror (T04 `o.clip` with T10 `reflect`); smoke (B04 drift) still drifting after L 42; blast `'mud'`; casings (T05, water spec: plop into the shallows or ping on the slope); strikes T05 B04 points (mud on the rim, spouts in the shallows) | b04 Effects rows |
| B04-SH03 queue | T16 B04-SH03 (walk 3.6 → 3.0, flinch from L 12, two hops from L 19 with splashes at L 25, re-formed by L 40) + far mass | T16 |
| B04-SH03 concealment | no click, no puff from the action, no gunner reaction | b04 Intent |
| B04-SH04 camera | fixed eye (−5.45, 1.0, −4.45), yaw −5, pitch −32, f 1100, hy 860 | b04 B04-SH04 Camera |
| B04-SH04 action | T13 jam nudge (L 4–11), click frame L 12 (no visual flash; the puff starts), jam puff L 12–21; T05 `casingKeyed` jam casing (port L 13 → stone L 17 → bounces 19, 21); T10 `paintStone`; smoke wisps from the burst drifting through L 0–11 (T04 smoke at L + 47 with the B04-SH03 rounds) | b04 B04-SH04 (SD07) |
| B04-SH04 | no hand, no face in frame | b04 B04-SH04 Acceptance |
| Probe leads | B04-SH03 muzzle and receiver points; B04-SH04 pan centre and port | T03 probe |

**Judgment for the builder (Hard).** The burst is loud and competent, the flash mirrored in the water; the queue flinches, two birds hop into the shallows, and the line re-forms and walks on: nobody is hit. The stop at L 42 is a vacuum: the next frame is still except the drifting smoke and the walking queue. The jam is told on the prop alone: a tired nudge, a click, a puff, one casing on a stone.

## Proof
- Stills (`out/edu30-T27/`): SH03 L 0, 10, 11, 19, 25, 40, 42, 43, 46; SH04 L 0, 8, 12, 17, 21.
- `scripts/qa-sheet.sh out/edu30-T27/sheet.png --cols 7 --width 270 out/edu30-T27/s*.png`; `measure-shots.ts B04-SH03 10` and `B04-SH04 12`; clean SH03 L 10 and SH04 L 12 through `caption-zone.py`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| SH03 L 10 / 11 | flash + halation + pop and its mirror / decay | core luma ≥ 250; muzzle (541, 860) ± 30 |
| SH03 L 25 | two splashes in the shallows, the line bunched | 2 splashes; no bird within 1.5 m of a strike |
| SH03 L 42 / 43 | no flash, no shake on either; smoke and queue still move | shake 0; smoke centroid moves ≥ 1 px between 42 and 43 |
| SH04 L 12 / 21 | puff at the port / casing at rest on the stone | pan (422, 226) ± 25, port (633, 624) ± 25; stone (674, 1361) ± 25 |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
