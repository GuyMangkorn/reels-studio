# T25 — plates B03-SH02 (top shot: six groups burst out) and B03-SH03 (EMU-HERO's silent wing signal splits its group, L07 mime) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: **done** (R11: SH03 re-proof in T40 accepted, TF53, TF66) · was: built; SH03 re-proof in **T40** (R10) · was: ready · r3: Film notes added (TICKETS-R3) · r5: Film note added (TICKETS-R5) · r8: Film notes added (TICKETS-R8)
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

## r8 notes (Film, 2026-11-20, `EDU-EP30-TICKETS-R8`)
These override any older value in this ticket that they name.
- **B03-SH02 smoke continues B03-SH01 r5 (TF28).** Call `paintSmoke` with L + 72, the B03-SH01 rounds and the same options as B03-SH01 r5: `drift: [0.25, 0.06, 0]`, `seed: 7100`, `fadeAfter: 45` (not the preset's −x drift), so the haze over the gun keeps drifting +x across the cut.
- **Crowd phase (T08 r5).** `burst` uses the 1/96 phase step; log one B03-SH02 frame's paint time in Result.

## R9 notes (Film, 2026-11-20, `EDU-EP30-TICKETS-R9`)
These override any older value in this ticket that they name.
- **T15 as built (R9).** B03-SH03 flick: `emuWingFlick(L)` (both sides, tip 0.903 m out, head yaw ±0.26); the thin T06 plume wing is accepted (T15 R9).
- **Caption zone (TF46).** Measure with `--band 1150:1344 --max-mean 0.80 --max-p95 0.99`.


## R10 look check (Film, 2026-11-20, `EDU-EP30-TICKETS-R10`)
Viewed `T25-sheet.png`, `T25-wing-crop-L10.png`. **Verdict: SH02 accept with value change; SH03 fix via [T40](T40-gesture-wing-read.md) (T15 fix pass 1; this plate is re-rendered, no code change).**
- SH02: six groups, casings, smoke, crew: pass. Caption band mean 0.851 → the high-view exception **≤ 0.92** applies to B03-SH02 as to B02-SH01 (TF53). Back-view P01 crew accepted.
- SH03 hero height (TF53): row 510–567 → **614–660 px** (T15 base `look`, 1.84 m head). Feet at y 1215–1252 in the band accepted (band mean passes).
- SH03 wing: points correctly, unreadable at 270 px against the dark group. T40 raises the flick (tip ≈ 1.51 m) and gives it a fuller, paler plume fringe; new tip rows (270, 738) / (836, 738) ± 60 in T40.
- Pad slip: accepted by construction (`emuPads(stand)`, T15 test).

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
Built 2026-11-20 (Boss, Sonnet medium, worktree `agent-a6fb43305dcb45722`, merged `claude/ep30-continuation-493a12` at `0e100d1` first) · commit: this commit (see index) · fix passes: 0 · files `src/painted/edu30/shots/B03-SH02.tsx`, `B03-SH03.tsx` only.
Proof (store `projects/edu/EDU/previews/`, T25-prefixed): `T25-sheet.png` (15 frames at 270 px, viewed), `T25-s02_{00,14,30,45}.png`, `T25-s03_{00,06,08,10,16,22,24,26,34,40,52,56}.png` (guides and tag on), `T25-c03_08.png`, `T25-c03_24.png`, `T25-c02_14.png` (clean), `T25-wing-crop-L10.png` (wing zoom, viewed). Logs `out/logs/T25-*.log`. SH03 L 52 and L 56 stills timed out at the script's 180 s page timeout under machine load (L 56 twice); they were rendered with a local copy of `scripts/stills.mjs` at 900 s (`out/stills-t25.mjs`, not committed), no code change.
Built: B03-SH02 = paddock scene (light 0, eaten 0.4, no far flock) with T08 `burst(L)` + `paintBurstDust`, T05 `paintCasings(72 + L)` with the B03-SH01 rounds / spec / seed 8100, gun (`buildLewisGun` + `paintLewisPanTicks` at `lewisPanTurn(72 + L)`), MEREDITH, GUNNER-1 (back, jolt 0) and GUNNER-2 on the B03-SH01 / B01-SH01 marks (back views), `paintSmoke` at L + 72 with `drift [0.25, 0.06, 0]`, `seed 7100`, `fadeAfter 45`; camera eye (0, 18 -> 20, 10) linear over L 0-50; newsreel `{1, warm, 1}`, no shake, no overscan. B03-SH03 = paddock scene (stubble 0.6, 14 near stalks), `halves(L)` + `halvesDust`, EMU-HERO `emuWingFlick(L)` at (12, 0, -32) heading pi/2 scale 1 seed 36000 hero, dust `paintFall` count 80 -> 0 over L 0-30 (caption band thinning 1150-1344); camera eye (12, 1.1, -29 -> -29.3), yaw 0 -> -2, ease-in-out L 0-56.
Measured vs rows:
- SH02 L 14 / 45 six distinct groups: 6 groups (T08 `burstGroups`), minimum centroid separation 52 / 72 / 97 / 121 px at L 0 / 14 / 30 / 45; 40 of 40 birds in frame at every one of those frames (r7: nobody leaves by L 45); six groups seen in the L 14 and L 45 stills (viewed). Flock centre (540, 400 -> 434) per the sheet: centroid mean y 407 at L 0 (about), pass.
- SH02 gun above y 1100: gun top ~1035 at L 14 (viewed; guide 1100 stays below it). Probe: MEREDITH top 1025 / 1037 at L 0 / 14; gun muzzle not a probe lead, row (540, 1044 -> 1081) +-30 read off the stills as about 1040 at L 14: pass (not pixel-measured).
- SH02 casings: 23 of 23 rest positions inside the B03 box (x 0.8..1.5, z -0.2..0.4); drawn through T05 `paintCasings(72 + L)` so the ten in-air casings continue; the in-air count at L 0 and the landing at L 26 are T05's, not separately counted here.
- SH03 L 8: right wing tip projected from T15's tip (-0.002, 1.197, -0.903) through the stack camera = (269, 831); row (270, 830) +-60: pass. Drawn wing: a thin dark quill, low contrast against the dark left-half birds behind it (`T25-wing-crop-L10.png`); at 270 px on the sheet it reads weakly (see Not followed 2).
- SH03 L 24: left wing tip (836, 830); row (810, 830) +-60: pass (yaw -1.2 deg shifts it +26 px).
- SH03 L 40: EMU-HERO alone, wings folded, facing the lens, tuft and bib visible (viewed). Probe height 640 px at L 40 (582 at L 0, 585 L 8, 609 L 24, 656 L 56); row 510-567: **outside** (see Not followed 1). Left half off screen left by L 22 (x 6.2..7.3 at L 22 is the exit edge), right half x 17.1..18.2 at L 38: matches the sheet exit marks.
- Clean frames through `caption-zone.py --band 1150:1344 --max-mean 0.80 --max-p95 0.99`: SH03 L 8 mean 0.76 p95 0.904 pass; SH03 L 24 mean 0.756 p95 0.904 pass; SH02 L 14 (extra, not a ticket row) mean 0.851 p95 0.892 **pass false** (mean over 0.80: the pale high-view sand and track fill the band; B02-SH01 has a 0.92 exception for the same view).
- Paint time, one B03-SH02 frame (T08 r5 phase step 1/96): L 14 = 324 ms with a null brush (428 ms first call), 40 birds + 4 figures; browser frames about 1 min each under load 3-7.
- Tests: `node scripts/test.mjs tests/painted-canvas-style.test.ts tests/edu30-flock.test.ts` 26/26 pass. `npx tsc --noEmit -p .` 8 errors, none in the two new files (`out/logs/T25-tsc.log`).
Hard-ticket checks: no hand drawn; arm check: GUNNER-1 (back, `paintSeatedGunner` with `lewisAnchors` grip and stock, jolt 0): attached ok, not re-measured per frame (a 20 px figure at this view); planted pads: EMU-HERO pads via `emuWingFlick` `emuPads(stand)`, world slip 0 by construction (T15 test), not re-measured on stills.
Values not followed (need Film):
1. **EMU-HERO height row 510-567 (L 40): measured 614-640 px (probe 640, stills head top 638 to toe 1252).** The T15 `emuWingFlick` base is `EMU_POSES.look`, head top about 1.84 m; the sheet's 510 px projection assumed 1.70 m (the B01-SH01 standing top). Camera, bird and pose are exactly as decided; nothing bent. Acceptance (EMU-HERO >= 480 px, tuft and bib visible) holds. Feet at y 1215-1252 against the sheet's 1190-1227 (in the band, feet only).
2. **Wing read at 270 px.** The flicked wing is the accepted thin T06 plume wing; it points correctly (tip projections above) but in the sheet tiles the screen-left gesture at L 8-10 is hard to see against the dark birds behind it; the left half's turning and peeling does read. Film may want a lighter ground behind the group or a thicker flick wing (T15/T06), not changed here.
3. **SH02 band mean 0.851** (clean L 14) over the new 0.80 cap; not a ticket row; Film may extend the B02-SH01-style exception to B03-SH02.
4. SH02 crew faces: back views with `pose 'P01'` for MEREDITH and GUNNER-2 (the sheet gives no crew pose for this shot); chosen to match B03-SH01's back view.
No open question; not blocked.
