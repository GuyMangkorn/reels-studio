# T27 — plates B04-SH03 (second firing beat, stop dead at E) and B04-SH04 (the jam close-up) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: **done** (R11: fix pass 1 = T42 r1 accepted, TF55–TF57, TF69) · was: built; fix pass 1 in **T42** (R10: spouts in the shallows, one casing spec) · was: ready (r2 adds T34 to Blocked by: the registered plate needs the overscan and shake canvas hook) · r3: Film notes added (TICKETS-R3) · r4: Film notes added (TICKETS-R4) · r5: Film note added (TICKETS-R5)
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
- **Caption zone (TF46).** `--band 1150:1344 --max-mean 0.80 --max-p95 0.99` (index TF46).


## R10 look check (Film, 2026-11-20, `EDU-EP30-TICKETS-R10`)
Viewed `T27-sheet.png`. **Verdict: fix (fix pass 1 = [T42](T42-plate-fixes-b02sh06-b04sh03.md) rows W1–W3).** SH04 jam passes (pan, port, stone 0 px; puff; casing on the stone). SH03 flash, halation, shake, stop dead, smoke drift and the queue pass.
- GUNNER-1 forearm (TF55): **accepted with no hand in SH03**; the locked gun puts grip and stock off frame right. The thumb check is waived for SH03; the jolting barrel and flash carry the burst.
- Strikes: 7 of 11 move into the shallows (T42 W1).
- Casings: SH03 paints from `B04_CASINGS` (T42 W2, TF57).
- Smoke (TF56): analytic bound **≤ 0.46** is the row (0.451 built); `measure.py` is not required: the analytic cover is the measure (accepted by construction).

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
Built 2026-11-20 (Boss, Sonnet medium, worktree branch `worktree-agent-a783cee3a1281584f`, merged `claude/ep30-continuation-493a12` at `0e100d1` first) · commit: this commit (see index) · fix passes: 0 · files `src/painted/edu30/shots/B04-SH03.tsx`, `B04-SH04.tsx` only.
Proof (store `projects/edu/EDU/previews/`, all `T27-` prefixed, 21 files): `T27-sheet.png` (SH03 L 0, 10, 11, 19, 25, 27, 40, 42, 43, 46; SH04 L 0, 8, 12, 17, 21; viewed), `T27-s03_L*.png` / `T27-s04_L*.png` (guides and tag on), `T27-c03_L10.png`, `T27-c03_L42.png`, `T27-c04_L12.png` (clean), `T27-r03_L10.png`, `T27-r03_L42.png` (registered). Logs `out/logs/T27-*.log`.
Built SH03: T10 `paintDam`, T16 `queue(L, 'B04-SH03')` + far mass + wade + `queueSplashes` (`shadowOp` 45), T05 11 strikes (x -1.0 to +1.4, z -4.9..-5.6, minDist 1.5 against `queueAvoid`; mud on dry points, spout on wet), T04 mud blast, T05 casings (water spec, `southBankY`/`overWater`), GUNNER-1 back view + G1 (T13 recoil, `lewisPanTurn` ticks) + `paintGunnerFists` after the gun, smoke, flash + 260 px halation (no mirror), pop and T34 shake (stop 42). SH04: `paintDam` with `nearSlope`, `paintStone`, G1 at the 11-round pan + `lewisJamNudge`, T04 smoke at L + 47, `paintLewisPuff`, `casingKeyed` r5 keys with `paintCasing` from L 13. Plates read every gun point from `lewisAnchors`.
Measured vs rows:
- SH03 L 10 core luma: 255 in the 40 x 40 box at the muzzle (clean frame; row >= 250, sky tie allowed): pass. Muzzle (`measure-shots.ts`) (633, 832) at L 10, (632, 833) at L 42; row (637, 827) +-30: pass (5 px). Receiver/port (987, 883).
- SH03 L 25: two splashes (`queueSplashes()` = 2, crown from L 27, rings from L 25); nearest bird to any strike point 2.04 m at L 25 and 1.60 m over L 0-46 (row >= 1.5 m): pass. Frames viewed: the splash crowns and rings are small and sit at the far shore edge at x about 230 (bunched front birds at x 250-310).
- SH03 L 42 / 43: shake (0, 0, 0) at both (L 10: 5.45, -7.24, 0.4 deg); smoke centroid (analytic, capped alpha-weighted puffs through the stack camera) (572.0, 819.0) at L 42 -> (568.0, 818.0) at L 43 = 4.0 px (row >= 1 px): pass. No flash on either (viewed). Queue moves (T16).
- SH04 L 12 / 21: pan (415, 253), port (638, 545) at both (row +-25): pass (0 px); stone (674, 1361) (row +-25): pass (probe of `STONE_AT`: (673.9, 1360.7)). Puff at the port at L 12 and 17, casing at rest on the stone at L 21 (viewed). No hand, no face.
- r4 row: registered `EDU30-REG-B04-SH03` vs QA clean stack MAD **0.00048** at L 10 (shake translate in the wrapper) and **0.00034** at L 42 (row <= 2): pass; L 42 shake 0 in the style. Smoke cover bound 1 - e^-0.60 = **0.451** and blast **0.393** at L 42 (analytic from the capped alpha sums; row <= 0.45 and <= 0.40: smoke is 0.001 over as an upper bound, same as T24; pixel cover not measured, T04's `measure.py` is not in this checkout). Lead probe: QA path only, equal to the registered plate by shared `def.paint`/`stackCam`/`canvasStyleOf`.
- Caption zone (TF46 flags `--band 1150:1344 --max-mean 0.80 --max-p95 0.99`): SH03 L 10 clean mean 0.714, p95 0.984, pass; SH04 L 12 clean mean 0.61, p95 0.627, pass.
Thumb check: GUNNER-1 RIGHT hand: not visible (see value 1); arm check: GUNNER-1 right: not drawn in frame, not measured.
Values not followed (need Film):
1. **Right forearm and fist entering from the right edge: not visible.** The locked gun puts the grip at (1171, 1026) and the stock at (1876, 997) on the stack camera, past the 1080 px edge, and the seat (-6.2, 0.36, -4.75) projects to x 1990. The man is painted (T11 back view, `paintGunnerFists` after the gun) but nothing of him lands in frame, so the T36 thumb check cannot be read on the picture. Not moved. Film: move the camera or accept no hand in SH03.
2. **Strikes: only 1 of 11 is a water spout.** The decided z range -4.9..-5.6 is on the dry rim except for one point (the waterline at these x is about z -5.65, `overWater`), so ten strikes are mud spurts and one a spout; the "spouts in the shallows" reads as one. Not changed. Film: widen z to about -6.0 for the spouts.
3. **Smoke cover 0.451 vs <= 0.45** (upper bound, as T24).
4. Casing positions `southBankY` was passed as `(x, z)`; fixed in the plate to `(_x, z) => southBankY(z)` before the proof.
Checks: `npx tsc --noEmit -p .` no error in the two files (8 existing errors in tests, unrelated); `node scripts/test.mjs tests/painted-canvas-style.test.ts` 5 / 5; full `npm test` not run (known failing set, machine load, disk 99 % full).
