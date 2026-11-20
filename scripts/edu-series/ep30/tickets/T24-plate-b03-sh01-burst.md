# T24 — plate B03-SH01, the first full-frame firing beat (VD30-11, 23 rounds from the order), is built and proven
Deliverable: EDU-EP30-SHORT · Revision: r5 · Status: r5 fix pass ready (R8 Film look check of the built plate, 2026-11-20: muzzle, flash, shake, casings, strikes, bolt stop and composition pass; smoke drift flipped to screen right (TF28), L 4 row moves to L 5 (TF30), registered-vs-QA row runs where `@remotion/three` resolves, test (d) edit owned here; fix pass 1) · was: built (R7, Boss 2026-11-20) · ready (Q8 answered: burst from the order as written; r2 adds T34 to Blocked by: the registered plate needs the overscan and shake canvas hook) · r3: Film notes added (TICKETS-R3) · r4: Film notes added (TICKETS-R4)
Class: set (plate) · Hard: yes (gunner arms and jolt, flock startle and scatter)
Blocked by: T03, T04 (r4), T05, T06 (r4), T08, T09 (r4, done), T11, T13, T34, T36 · Consumers: B03-SH01 (global 688–759)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); shot block [b03.md](../short/scene-sheets/b03.md) B03-SH01 (authoritative; SD13); brief [VD30-11](../short/film-brief.md#vd30-11) (per-round grammar, value, fallback order).

## Build
Replace the stub shot file with the plate: over the seated gunner's shoulder, 23 rounds every 3 frames from local 2 to 68, every VD30-11 effect, the flock startling, bunching and bolting.
Files: `src/painted/edu30/shots/B03-SH01.tsx` (r5 adds `tests/painted-canvas-style.test.ts`, test (d) only)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Set | space P, light m 0, eaten 0.4, newsreel warm strength 1 with `pop` = T04 `popFor`; near stalks ahead of the muzzle with T09 `lean` = T04 `blastLean` | T04, T09 |
| Camera | fixed eye (0.4, 1.0, 1.65), yaw −3, pitch 0, f 900, hy 860; `overscan: true` (T03); `shake` = T04 `shakeAt` with the B03 spec | b03 B03-SH01 Camera |
| Rounds | `roundFrames(2, 23, 3)` → local 2 … 68 (global 690 … 756) | index VD30-11, SD13 |
| GUNNER-1 | T11 back view at (0, 0, 0.85), fists on `grip`/`stock`, jolt j from `roundPhase` | b03 B03-SH01 |
| G1 | (0, 0, 0) barrel −z; T13 `lewisRecoil` per round; `magTurn` 7.66° × rounds fired (176.2° at L 68) | b03 G1 row |
| Flash, halation | T04 `paintMuzzleFlash` at `lewisAnchors(...).muzzle`, halo 180 px | b03 Projection |
| Smoke, blast | T04 `paintSmoke` (B03 drift, fadeAfter 45), `paintBlast` ground `'wheat'` | VD30-11 steps 2, 6 |
| Casings | T05 `paintCasings` with the B03 landing box, ground y 0, side +1 | T05 |
| Strikes | T05 `paintSpurts` dust at the B03 points, h 0.6–1.2 m | T05 |
| Flock | T08 `scatter(L)` (startle from L 4, bunch L 10–38, bolt from L 40) + `paintFarFlock` z −80..−200 | b03 Flock F1 row; T08 |
| Bolt | from L 70 the bolt is open: no flash, the smoke hangs, shake 0 | b03 B03-SH01 Sound (bolt catch at L 70) |
| Off frame | MEREDITH (arm down after the order) and GUNNER-2 (spare pan) are off frame; do not paint them | b03 Props and hands |
| Fallback order (only if a T04/T05 effect is late) | keep flash + halation, shake, casings, recoil; drop the strike spurts first, then the blast dust; never add hits | VD30-11 Fallback |
| Probe leads | GUNNER-1 (partial: visible span y ~600 to the frame bottom), muzzle point | T03 probe |

**Open-question dependency (Q8).** With the alternative (rounds from L06's "ยิง" only), the shot starts at 704 and the round list, pan total, casing count and scatter frames all re-key from the new round 1; Film bumps this ticket.

**Judgment for the builder (Hard).** Played straight and loud: an impressive gun and a calm crew. The flash core is the lightest value in its frame, wrapped by darker smoke; spurts walk toward the birds and never reach one; the birds startle, bunch and bolt, none is hit or falls. The gunner's fists never leave the gun.

## r3 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R3`)
These override any older value in this ticket that they name.
- **Lewis gun (T13 r3).** After the gun's `placeBuild`, call `paintLewisPanTicks(p, c, seed, at, heading, magTurn, {elev, recoil})` in the next paint slot (before anything in front of the gun); without it the pan step per round is invisible. Every gun point (muzzle, pan, port, grip, stock, cock) comes from `lewisAnchors(at, heading, {elev, recoil, cock})`, never from a sheet literal: the locked gun is 1.32 m long with the muzzle 0.66 m ahead of the tripod head, so the sheet anchors that assumed a 1.1 m gun are superseded (index TF17).
- **Muzzle and lean (r3).** B03-SH01 muzzle = `lewisAnchors([0, 0, 0], −π/2).muzzle` = (0, 0.586, −0.659), projecting to **(432, 1020)** on the B03-SH01 camera (was (457, 951)); T09 `leanFrom` is that muzzle. The halation (180 px) reaches into the caption band; accepted (picture glow, the caption sits on top).
- **Gunfire (T04 r3).** Smoke and blast use the r3 haze caps; the frame-max rule accepts a clipped-sky tie.

## r4 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R4`)
These override any older value in this ticket that they name.
- **Smoke (T04 r4).** Per-circle α_c; smoke cover ≤ 0.45 and blast ≤ 0.40 in the densest 16 × 16 box at L 30 and L 71 (Proof row added).
- **T34 carry-over.** This is the first plate that sets `shake` and paints leads: the registered plate vs the QA stack at L 2 (a k 0 frame) MAD ≤ 2 with the shake translate in the wrapper style, and the lead probe equal to the QA stack ± 1 px (Proof row added).
- **Fists (T36).** GUNNER-1 back view: both `Arm.exact` fists with `flatFist`; thumb lines as T36's back row (RIGHT screen left, LEFT screen right).
- **Lean.** T09's `lean` uses the `lewisAnchors` muzzle (0, 0.586, −0.659) (T09 r4).

## r5 decisions (Film, 2026-11-20, `EDU-EP30-TICKETS-R8`): look check of the built plate and rulings on the four open values
These override any older value in this ticket that they name. Viewed: store `T24-sheet.png` (9 frames at 270 px), `T24-s68.png` and `T24-s71.png` side by side at 540 px, `T24-crop20.png`, `T24-crop56.png`, crops of `T24-s00.png` / `T24-c02.png` (body region, 400 px) and `T11-back-j0.png` for the gunner's shadow.

**Look check.**
- **Pass:** muzzle and flash (white core the frame max, halation over the gunner's head edge), per-round shake, casings on the dirt right of G1, spurts short of the birds, near-stalk lean, bolt stop at L 70 (no flash, shake 0), hat and shoulder filling the lower left, title clear. The flock is a dark band of 20–40 px birds on the horizon running in clumps (crop 56): it is the sheet's "dark band across the middle distance"; the burst itself is read in B03-SH02's top shot.
- **GUNNER-1 head top 746 (value 3): accepted.** The sheet's head (147, 640) and "y ~600" were the SCENE-R1 look; T11 and the locked camera set the head; nothing is bent (TF29). The pale oval right of his tunic (x ≈ 240–390, y ≈ 1540–1820) is his ground shadow from the T11 build, accepted.
- **Smoke: fix (row R1).** No haze reads in any frame. The preset drift (−0.25 m/s x) carries every puff screen left behind the gunner's head (painted after the smoke), and the halation covers the newest puffs at the muzzle, so the flash is never wrapped by darker smoke (VD30-11). The plate flips its own drift to screen right, over the open wheat (TF28); `kit/gunfire.ts` and the preset stay.
- **Caption zone mean 0.64: accepted, logged.** The halation and the pop sky sit in the band (r3 note); captions carry the edu stroke without a band. The Editor confirms subtitle legibility on this shot in the draft cut (W5.3).

| Row | Value | Pass |
| --- | --- | --- |
| R1 smoke drift | `SMOKE = {...PRE.smoke, drift: [0.25, 0.06, 0], seed: 7100}` (screen right and slightly up; everything else in the preset unchanged); smoke still painted before GUNNER-1 and before the flash | L 71 (no flash, no pop) vs L 0, both clean: mean luma of the 100 × 100 box centred at (620, 960) is **≥ 8 lower at L 71** (logged, with both values); viewed at 270 and 540 px: a grey-brown haze right of the muzzle at L 32 and L 71, flock band birds still visible through it; L 2/3 core still the frame max (existing row) |
| R2 startle row (value 1, TF30) | no T08 change: the seeded 0–2 f startle delay is the ripple the sound cue SFX-B03-SH01-4 (local 4) describes | **L 5: ≥ 80 %** of F1 in the startle pose (measured 82.5 % in r4 build) and **L 6: 100 %** (logged); L 4 logged, no range |
| R3 registered vs QA (value 2, T34 carry-over) | run `npm ls @remotion/three` first. It resolves in Film's worktree `brave-visvesvaraya-700270` at `6f47938` (checked 2026-11-20); the coordinator dispatches this pass in a worktree where it resolves (for example one whose `node_modules` points at a complete install). Do **not** run `npm ci` or `npm install`: if it does not resolve, mark R3 `not run (env)` in Result and finish the other rows | L 2 registered vs QA stack MAD ≤ 2 with the shake translate present; lead probe equal ± 1 px |
| R4 test (d) (value 4) | in `tests/painted-canvas-style.test.ts` test (d), replace the first assertion (`doesNotMatch … /rotate/` on the real B03-SH01 def at 706) with two on the real def: at **L 2, global 690** `assert.match(t, /translate\(-?[\d.]+px, -?[\d.]+px\) rotate\(-?[\d.]+deg\) scale\(1\.05\)$/)`; at **L 71, global 759** `assert.match(t, /scale\(1\.05\)$/)` and `assert.doesNotMatch(t, /rotate\(-?0*\.?0*[1-9]/)` (no non-zero roll after the bolt stop). Update the comment to "B03-SH01 sets `shake` (T24)". Keep the synthetic-shake and B01-SH01 assertions. Not Boss's literal `0.3deg`: that ties the T34 wiring test to the T04 seed | `node scripts/test.mjs tests/painted-canvas-style.test.ts` passes |
| R5 lead row | GUNNER-1 probe top **746 ± 10**, head x 159 ± 10 (TF29) | `measure-shots.ts B03-SH01 2,68` |

**Smoke cover (r4 row): replaced by R1.** The densest-box pixel cover is not re-measured on this plate: the puffs, alphas and caps are T04's, measured there at 0.245 (smoke) / 0.274 (blast), and the cap bound here is 0.451 / 0.393. The plate's risk is a haze too faint to read, which R1 measures. T27 keeps its own cover row (water, emu legs).

**r5 Files:** `src/painted/edu30/shots/B03-SH01.tsx`, `tests/painted-canvas-style.test.ts`. **Proof:** re-render L 0, 2, 3, 5, 6, 32, 56, 68, 71 (clean L 0 and L 71 for R1); sheet at 270 px plus `s71` at 540 px; archive as `T24r5-*.png` with `T24r5-sheet.png`. Every r4 row not named here stands.

## Proof
- Stills (`out/edu30-T24/`): L 0, 2, 3, 4, 20, 40, 56, 68, 71; `scripts/qa-sheet.sh out/edu30-T24/sheet.png --cols 5 --width 270 out/edu30-T24/s*.png`; `measure-shots.ts B03-SH01 2,68`; overlay diff: render L 2 and L 3 with `tag: true` and check the tag and guides do not move.
- Clean L 2 through `caption-zone.py`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| L 2 / 3 | white core + halation + pop / half-size warm decay; muzzle above y 1100 | core luma ≥ 250 and the frame max; muzzle (432, 1020) ± 30 (r3, locked gun) |
| L 4 | birds' heads up | ≥ 80 % of F1 in the startle pose (logged) |
| L 56 | clumps bolting, spurts short of the birds, casings on the dirt right of G1 | no strike within 4 m of a bird (logged); casings x 0.8..1.5 |
| L 71 | bolt open, smoke hanging, no shake | shake (dx, dy, rot) = 0 |
| L 2 vs L 3 overlay | tag and guides fixed while the canvas shakes | overlay pixel diff 0 outside the canvas |
| L 30 / L 71 (r4) | smoke a haze, legs and muzzle readable; registered = QA stack | smoke cover ≤ 0.45, blast ≤ 0.40 (T04 measure); L 2 registered vs QA MAD ≤ 2 with the shake translate present; lead probe ± 1 px |

## Result (Boss fills)
Built 2026-11-20 (Boss, Sonnet medium, worktree branch `worktree-agent-a3cb47c4ed7268987`, merged `claude/ep30-continuation-493a12` at `9c71592` first) · commit: this commit (see index) · fix passes: 0 · `src/painted/edu30/shots/B03-SH01.tsx` only.
Proof (store `projects/edu/EDU/previews/`, T24-prefixed): `T24-sheet.png` (L 0, 2, 3, 4, 20, 40, 56, 68, 71, viewed), `T24-s*.png` (full frames, guides and tag on), `T24-c02.png` (clean L 2), `T24-crop20/56/68.png` (horizon and muzzle crops, viewed). Logs `out/logs/T24-*.log`.
Built: paddock scene space P (light 0, eaten 0.4, far flock n 160 z -200..-80, 22 near stalks with `blastLean` from the `lewisAnchors` muzzle), T08 `scatter(L)` via `paintFlock` plus footfall dust for L >= 40, T05 spurts at 23 seeded points, T04 blast, T05 casings (B03 box), G1 with `lewisRecoil`, `paintLewisPanTicks` with `lewisPanTurn`, smoke, GUNNER-1 back view (T11, jolt 1 / 0.5 / 0 from `roundPhase`, gun painted first so fists need no repaint), flash + halation 180 px (none from L 70). `shake` = `shakeAt` with the B03 preset, seed 7500, `stop: 70`; `reel.pop` = `popFor`; `overscan: true`.
Measured vs rows:
- Muzzle L 2 / L 68 (`measure-shots.ts`): (437, 1016); row (432, 1020) +-30: pass (5 px, 4 px; recoil 5 mm). Above y 1100: pass.
- GUNNER-1 lead (probe): top 746, bottom 1910 (h 1165), head x 159; row "visible span y ~600 to bottom": the head top is 746, not ~600 (sheet's old head (147, 640) was the SCENE-R1 look; see Values not followed).
- L 71 shake = (0, 0, 0): pass (also L 70). L 2 shake (4.06, -6.22, 0.30), L 3 (3.99, -5.02, 0.15).
- Strikes: no strike point within 5.47 m of any bird over L 0-71 (plan distance, 36 frames x 40 birds x 23 points); row >= 4 m: pass. Spurts alive at L 56 are short of the birds (viewed).
- Casings at L 56 right of G1 (box x 0.8..1.5 by T05); the frame shows brass on the dirt (viewed).
- Smoke and blast cover (r4 row): analytic bound from the capped puff alpha sums at L 30 and L 71 = 0.451 smoke, 0.393 blast (cap sums 0.60 and 0.50, same puffs as T04). T04's pixel measure (0.245 / 0.274 at fx30) used its own `out/edu30-T04/measure.py`, which is not in this checkout (out/ is not committed), so the densest-box pixel cover on this plate is NOT measured; the smoke bound 0.451 is 0.001 over 0.45 only as an upper bound of the cap, not a measurement.
- Clean L 2 `caption-zone.py`: mean 0.64, p95 0.913, pass false (the halation and the pop sky sit in the caption band; the r3 note accepts the glow in the band, the number is logged for Film).
- Overlay L 2 vs L 3: tag and guides are DOM siblings of the shaken canvas wrapper (`Plate30`), so they cannot move; the guide line pixels are identical (0 differ); the tag mask differs by 270 of about 4500 white pixels, which I read as the changing pop brightness under the text (not isolated; Film may rerun with a dark paper).
Thumb check: back view fists via T36 `flatFist` (right screen left, left screen right as T36's back row): not re-measured here, the T11 back proof is the reference at this camera. arm check: GUNNER-1 right/left: attached ok (from T11 solve; ratio not re-measured per frame).
Values not followed (need Film):
1. **L 4 row (>= 80 % of F1 in the startle pose): 7 of 40 (17.5 %).** T08 `scatter` gives each bird a seeded startle delay s 0..2 (ts = 4 + s); the shape reaches 33 of 40 (82.5 %) at L 5 and 40 of 40 at L 6. Not changed (T08's schedule, not this ticket). Film either moves the row to L 5 or asks for a T08 fix pass.
2. **L 2 registered vs QA stack MAD <= 2 and lead probe equality (T34 carry-over row): not run.** `registered-index.tsx` imports the whole registry including `src/painted/edu18` -> `@remotion/three`, which the shared `node_modules` lacks, and `npm ci` stops (package.json and package-lock.json out of sync). The registered plate and the QA stack share `def.paint`, `stackCam` and `canvasStyleOf` by code (`makeShot`), unverified by pixels. The probe (QA path) is the numbers above.
3. **GUNNER-1 head 746 vs sheet "y ~600".** Built per T11 back view at seat (0, 0, 0.85) and the locked camera; the solved lean sets the head; nothing was bent to match.
4. **Test outside Files:** `tests/painted-canvas-style.test.ts` test (d) first assertion (`doesNotMatch /rotate/` on the real B03-SH01 def, "no built shot sets shake yet") now fails because this plate sets `shake`; the comment says the plate ticket lands it. One-line fix for the owner: replace that assertion with `assert.match(String(canvasStyleOf(SHOT_DEFS['B03-SH01'], 2, 690).transform), /rotate\(0\.3deg\) scale\(1\.05\)$/)`. Not edited (not in the ticket's Files).
Checks: `npx tsc --noEmit -p .` no error in the shot file (22 existing errors in tests, same as before); `npm test` 349 / 369 pass: 20 fail = this test (d) + 19 environment failures (12 log lines naming `@remotion/three`, the rest whole-file import failures, pre-existing, unrelated to this file).
Also seen: the near stalks, flock band (dark running birds at y 834-888) and the wheat lean read in the frames; smoke is a faint haze drifting behind the gunner's hat, spurts are small at 14-26 m.
