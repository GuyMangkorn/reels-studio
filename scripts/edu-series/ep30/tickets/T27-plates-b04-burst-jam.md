# T27 — plates B04-SH03 (second firing beat, stop dead at E) and B04-SH04 (the jam close-up) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: ready, **dispatchable** (R9: T16 done) · was: ready (r2 adds T34 to Blocked by: the registered plate needs the overscan and shake canvas hook) · r3: Film notes added (TICKETS-R3) · r4: Film notes added (TICKETS-R4) · r5: Film note added (TICKETS-R5)
Class: set (plates) · Hard: yes (queue flinch and hops, gunner mitten, jam action)
Blocked by: T03, T04 (r4), T05, T06 (r4), T10 (r4), T11, T13, T16, T34, T35 (done), T36 · Consumers: B04-SH03, B04-SH04 (global 993–1061)
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
| B04-SH03 effects | flash halo 260 px; **no water mirror** (r3, TF20: from this lens the mirrored flash would sit on the south bank); smoke (B04 drift) still drifting after L 42; blast `'mud'`; casings (T05, water spec: plop into the shallows or ping on the slope); strikes T05 B04 points (mud on the rim, spouts in the shallows) | b04 Effects rows |
| B04-SH03 queue | T16 B04-SH03 (walk 3.6 → 3.0, flinch from L 12, two hops from L 19 with splashes at L 25, re-formed by L 40) + far mass | T16 |
| B04-SH03 concealment | no click, no puff from the action, no gunner reaction | b04 Intent |
| B04-SH04 camera | fixed eye **(−5.68, 1.0, −4.45)**, yaw −5, pitch −32, f 1100, hy 860 (r3, TF18: moved −0.23 m x with the locked gun's pan and port) | b04 B04-SH04 Camera; Film r3 |
| B04-SH04 action | T13 jam nudge (L 4–11), click frame L 12 (no visual flash; the puff starts), jam puff L 12–21; T05 `casingKeyed` jam casing (port L 13 → stone L 17 → bounces 19, 21); T10 `paintStone`; smoke wisps from the burst drifting through L 0–11 (T04 smoke at L + 47 with the B04-SH03 rounds) | b04 B04-SH04 (SD07) |
| B04-SH04 | no hand, no face in frame | b04 B04-SH04 Acceptance |
| Probe leads | B04-SH03 muzzle and receiver points; B04-SH04 pan centre and port | T03 probe |

**Judgment for the builder (Hard).** The burst is loud and competent, the flash lighting the frame and the water kicked up by the spouts (no mirror, r3); the queue flinches, two birds hop into the shallows, and the line re-forms and walks on: nobody is hit. The stop at L 42 is a vacuum: the next frame is still except the drifting smoke and the walking queue. The jam is told on the prop alone: a tired nudge, a click, a puff, one casing on a stone.

## r3 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R3`)
These override any older value in this ticket that they name.
- **Lewis gun (T13 r3).** After the gun's `placeBuild`, call `paintLewisPanTicks(p, c, seed, at, heading, magTurn, {elev, recoil})` in the next paint slot (before anything in front of the gun); without it the pan step per round is invisible. Every gun point (muzzle, pan, port, grip, stock, cock) comes from `lewisAnchors(at, heading, {elev, recoil, cock})`, never from a sheet literal: the locked gun is 1.32 m long with the muzzle 0.66 m ahead of the tripod head, so the sheet anchors that assumed a 1.1 m gun are superseded (index TF17).
- **B04-SH03 muzzle (r3).** `lewisAnchors([−5.6, 0.32, −5.0], 0).muzzle` = (−4.941, 0.906, −5.0), projecting to **(637, 827)** on the B04-SH03 camera (was (541, 860)). No water mirror of the flash (TF20, T04 r3 decision 3): the water side of the burst is the halation, the T05 spouts and the casings.
- **B04-SH04 camera (r3, TF18).** G1 stays at its LF02 mark (−5.6, 0.32, −5.0); the locked gun's pan and port lie 0.23 m further −x than the sheet assumed, so the close-up camera moves with them: **eye (−5.68, 1.0, −4.45)**, yaw −5, pitch −32, f 1100, hy 860 (clearance 0.47 m unchanged, z unchanged). The jam stone moves with it to T10 r3 `STONE_AT` (−5.63, 0.33, −4.9), so the stone projects to (674, 1361) as before. New targets: pan (415, 253) ± 25, port (638, 545) ± 25 (computed from the built anchors at this camera).
- **Hop (T35).** The two hops pass `air`; the shadows stay on the water/ground.
- **Gunfire (T04 r3).** Smoke and blast use the r3 haze caps; tie rule as T04 r3.

## r4 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R4`)
These override any older value in this ticket that they name.
- **Smoke (T04 r4).** Per-circle α_c, the B04-SH03 11-round list; smoke cover ≤ 0.45 and blast (mud) ≤ 0.40 at SH03 L 42 (Proof row added).
- **T34 carry-over.** Registered plate vs QA stack at SH03 L 10 (k 0) MAD ≤ 2 with the shake translate in the wrapper style, and at L 42 shake 0 in the style; lead probe equal to the QA stack ± 1 px (Proof row added).
- **Mitten (T36).** `GUNNER-1 RIGHT hand, fist on grip, shows back, fingers screen left (into frame)` → thumb screen down, drawn with `flatFist`; thumb check read on the picture.
- **Hops (T35 done).** `air` = `emuHop` offset y; the shadow centre equals an `air` 0 bird at the same ground point ± 4 px.
- **No flash mirror (TF20)**: confirmed with the user told (index R4); not asked back.

## r5 notes (Film, 2026-11-20, `EDU-EP30-TICKETS-R5`)
These override any older value in this ticket that they name.
- **Jam casing keys (T05 r5).** `casingKeyed` keys with angle (rad, tilt out of the horizontal) and heading 0 at every key: L 13 port `lewisAnchors(...).port` angle 0; L 17 stone top `STONE_AT` + (0, 0.05, 0) angle 5.80; L 19 stone top + (0, 0.04, 0) angle 6.78; L 21 stone top angle 9.42 (lying flat, to the shot end); no glint. Paint with `paintCasing(p, c, pos, angle, 0, seed)`.
- **Fists over the gun (T36 r2, index common rule R5).** If this plate paints G1 after GUNNER-1, call `paintGunnerFists` right after the gun so the fists wrap the grip and stock.

## R9 notes (Film, 2026-11-20, `EDU-EP30-TICKETS-R9`)
These override any older value in this ticket that they name.
- **Queue shadows (TF37).** `shadowOp: 45` for every queue bird.
- **Bunching (TF36).** B04-SH03 bunches at the front only (birds 0–5 stop L 12–28, bird 6 closes to 1.0 m L 24–28); birds 2 and 4 hop and land at L 25 (splash crowns from L 27).
- **Caption zone (TF46).**

## Proof
- Stills (`out/edu30-T27/`): SH03 L 0, 10, 11, 19, 25, 40, 42, 43, 46; SH04 L 0, 8, 12, 17, 21.
- `scripts/qa-sheet.sh out/edu30-T27/sheet.png --cols 7 --width 270 out/edu30-T27/s*.png`; `measure-shots.ts B04-SH03 10` and `B04-SH04 12`; clean SH03 L 10 and SH04 L 12 through `caption-zone.py`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| SH03 L 10 / 11 | flash + halation + pop (no mirror, r3) / decay | core luma ≥ 250 (sky tie allowed, T04 r3); muzzle (637, 827) ± 30 (r3) |
| SH03 L 25 | two splashes in the shallows, the line bunched | 2 splashes; no bird within 1.5 m of a strike |
| SH03 L 42 / 43 | no flash, no shake on either; smoke and queue still move | shake 0; smoke centroid moves ≥ 1 px between 42 and 43 |
| SH04 L 12 / 21 | puff at the port / casing at rest on the stone | pan (415, 253) ± 25, port (638, 545) ± 25 (r3); stone (674, 1361) ± 25 |
| SH03 L 10 / L 42 (r4) | registered = QA stack; smoke a haze | L 10 MAD ≤ 2 with the shake translate present, L 42 shake 0 in the style; smoke cover ≤ 0.45, blast ≤ 0.40 at L 42; lead probe ± 1 px |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
