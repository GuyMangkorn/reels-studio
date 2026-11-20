# T22 — plate B02-SH06 ("สามคนเหรอ…": EMU-HERO counts the crew, then the crane over a field of rising heads) is built and proven
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: built, open question (Film) · r3: Film notes added (TICKETS-R3)
Class: set (plate) · Hard: yes (emu face and nods, rising heads, loader hands)
Blocked by: T03, T07, T08, T09, T11, T12, T13 · Consumers: B02-SH06 (global 592–666)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); shot block [b02.md](../short/scene-sheets/b02.md) B02-SH06 (authoritative; SD18).

## Build
Replace the stub shot file with the plate.
Files: `src/painted/edu30/shots/B02-SH06.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Set | space P, light m 0, eaten 0.4, newsreel warm strength 1; three wheat bands: near stalk strokes under the lens (`paintNearStalks` spots seeded in x 1.2..3.4, z −10.4..−9.0), mid texture over the heads field, far wash | b02 B02-SH06 Depth |
| Camera | L 0–48 eye (2.2, 1.55, −10.6), yaw 190, pitch −2, f 1000, hy 860; L 48–74 to eye (2.4, 3.2, −12.2), yaw 190, pitch −16, f 950, hy 860, ease-in-out (still settling on the cut) | b02 B02-SH06 Camera |
| EMU-HERO | (1.0, 0, −8.0) facing +z (heading π/2), stand, legs in the wheat; nods (T07 `nod`) at L 7, 17, 23; beak (T07 `talkBeak`) onsets L 7, 17, 51, 60; look back over its **left** shoulder (T07 B02-SH06 row) L 30–44, hold; blink from L 33 | b02 B02-SH06; T07 Film fix |
| Heads field | T08 `headsField(L)`; the plate paints a local wheat-top pass (`paintWheatTexture` strokes within 0.6 m of each member's base, drawn after the members) so the sitting bodies read as hidden in the crop | T08 |
| Crew | MEREDITH (−0.6, 0, 1.05) front, T12 C (`P30`, left mitten at the visor, gaze to the far horizon); GUNNER-1 (0, 0, 0.85) T11 front with head down to the sights; GUNNER-2 T12 F (loader at (0.50, 0, 0.35), seats the pan L 20–30); G1 (0, 0, 0) barrel −z, `magTurn` 0, the pan seated from L 30 | b02 B02-SH06 Staging; T11, T12 |
| Far | F1 flock mass and far paddock beyond the crew; the fence and the track beyond the crew | b02 B02-SH06 Depth |
| Exactly three men | readable as three at 270 px at L 0 (left of the emu's neck) | b02 B02-SH06 Acceptance |
| Probe leads | EMU-HERO at L 0 and 74; MEREDITH at L 0 | T03 probe |

**Judgment for the builder (Hard).** The count is deadpan: three small nods, one per syllable, then a slow look back to the lens with the left eye. The heads pop up in six quick waves as the camera rises: necks enter the wheat, heads in profile, eyes to the crew. MEREDITH never looks at them; the crew is busy, not foolish.

## r3 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R3`)
These override any older value in this ticket that they name.
- **Lewis gun (T13 r3).** After the gun's `placeBuild`, call `paintLewisPanTicks(p, c, seed, at, heading, magTurn, {elev, recoil})` in the next paint slot (before anything in front of the gun); without it the pan step per round is invisible. Every gun point (muzzle, pan, port, grip, stock, cock) comes from `lewisAnchors(at, heading, {elev, recoil, cock})`, never from a sheet literal: the locked gun is 1.32 m long with the muzzle 0.66 m ahead of the tripod head, so the sheet anchors that assumed a 1.1 m gun are superseded (index TF17).

## r7 notes (Film, 2026-11-20, `EDU-EP30-TICKETS-R7`)
These override any older value in this ticket that they name.
- **Wheat interleave (T08 r4 look check).** Paint the near wheat per z band in front of the field birds, so that no sitting body shows above the stalks: only necks and heads come out of the wheat. EMU-HERO's legs stay hidden ("legs hidden in the wheat", sheet). The T08 proof shows bodies and the hero's legs only because it overpaints per band without interleaving.
- **LOD and render cost.** EMU-HERO paints at near detail. The 36 field members use the library's automatic `LOD_PX` rule; when one frame takes more than 120 s (the stills timeout is 180 s), force `lod: 'far'` on every field member except the hero and log the frame time (T08: 36 near birds exceeded 180 s).
- **Loader pan (T12 r6 note 7).** For L < 30 the held pan is painted over the seated one. Log the seated-pan rows visible below it; ≤ 4 px rows is accepted.
- T12's P30, P34 and loader poses pass the R7 look check; T22 still waits on T12 r6 only because of the same-file order (T12 r6 changes only the salute and the farmer, which this plate does not use), and on T07 r6 (the hero's blink at local 33–35).

## Proof
- Stills (`out/edu30-T22/`): L 0, 7, 10, 30, 44, 52, 58, 64, 74.
- `scripts/qa-sheet.sh out/edu30-T22/sheet.png --cols 5 --width 270 out/edu30-T22/s*.png`; `measure-shots.ts B02-SH06 0,74`; clean L 0 and L 74 through `caption-zone.py`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| L 0 | EMU-HERO big at screen right, three small men side by side at its neck's left | EMU-HERO 604 ± 30 px; MEREDITH 141 ± 15 px |
| L 10 | head 4 cm down in the nod (from L 7) | head joint y 0.04 ± 0.01 m below the stand (logged) |
| L 44 | head turned back, left eye to the lens | T07 KP-lookback check |
| L 74 | field of heads all up, the three men unblocked | 36 heads up; crew bbox overlap 0 px; EMU-HERO 301 ± 30 px (wide exception) |

## Result (Boss fills)
Built 2026-11-20 (Boss, Sonnet medium, worktree branch `worktree-agent-af0224ffedafe5c02`, merged `claude/ep30-continuation-493a12` at `bf9d664` first) · commit `0dcddc9` · fix passes: 0 · `src/painted/edu30/shots/B02-SH06.tsx` only.
Proof (store `projects/edu/EDU/previews/`, T22-prefixed, clean frames): `T22-sheet.png` (L 0, 7, 10, 30, 44, 52, 58, 64, 74, viewed), `T22-s*.png` (full frames), `T22-head-crop-L{0,30,44}.png`, `T22-crew-L0.png`, `T22-crew-L74.png`, `T22-crew-zoom.png` (viewed). Logs `out/logs/T22-*.log`.
Built: `paintPaddockScene` (light 0, eaten 0.4, far flock n 160 z 30..200, fence and clearing as the set); camera crane L 48-74 ease-in-out; then, far to near, the 36 `headsField` birds and EMU-HERO in distance bands (members within 1.6 m of the band's nearest share a band), each band followed by `paintWheatRidges` (3 rows, r0 = next band - 0.2, r1 = band + 0.1) and 6 seeded wheat-top ear strokes within 0.6 m of each member's base; crew on top: MEREDITH `P30` (T12 C, left mitten at the visor, `look [0, -0.2]`), GUNNER-1 `paintSeatedGunner` front, GUNNER-2 `paintCrewPose` loader at (0.50, 0, 0.35), G1 with `lewisRecoil`, `paintLewisPanTicks`, held pan over the seated one for L < 30, loader and gunner fists after the gun; the 16 near stalks (x 1.2..3.4, z -10.4..-9.0) last. EMU-HERO pose is a pure function of L (`heroPose`): nods L 7, 17, 23, beak onsets 7, 17, 51, 60, `headYaw` 0 to `emuLensYaw` (clamp 1.2) over L 30-44 (left shoulder), lid base 0.3 from L 30 with `blinkLid(L - 33)`.
Measured vs rows (`measure-shots.ts B02-SH06 0,30,74`, probe = stack camera):
- L 0 EMU-HERO 594 px, x 830 (row 604 +- 30): pass. MEREDITH 152 px to the hat top = 141.5 to the head top (row 141 +- 15; man-height rule x 1.074): pass.
- L 10 head joint 0.04 m below the stand (head y 1.56 against 1.60; `emuNod` 0.04): pass.
- L 44 head turned back, left eye to the lens: `headYaw` +1.20 (the clamp), crop `T22-head-crop-L44.png` viewed: face and eye toward the lens, tuft and bib visible; pass. Blink lids L 33..36 = 0.8, 1.0, 0.6, 0.3.
- L 74 EMU-HERO 326 px, x 674 (row 301 +- 30 = 271..331): pass at 5 px from the upper bound. Heads: 36 of 36 at 1.6 m (the last group is up at L 73); 18 of them inside the frame; crew bbox (457, 681)-(630, 834) overlap with every head box 0 px (same test as T08, 0 margin).
- Seated-pan rows under the held pan (T12 r6 note 7): front wall of the seated drum 3.9 px at 90.7 px/m for L 0-24, 3.2 px at L 28, 0 from L 30: <= 4 px accepted.
- Clean L 0 and L 74 `caption-zone.py`: mean 0.715 / 0.709, p95 0.910 / 0.898, pass false (sunlit wheat fills the caption band y 1150-1344 in both frames; logged for Film, the sheet camera and set fix it).
- Cost: 59,584 polygon calls at L 74 (T24 L 40: 40,437). Full-detail field birds timed out at 180 s (stills timeout) as T08 reported; frames now render in about 1 min each on a machine at load 10 to 20.
Thumb check: MEREDITH left (visor, T12 C): back of the mitten to the lens, thumb side not re-measured, kit P30 unchanged: not re-measured here (T12 is the reference). arm check: MEREDITH left, GUNNER-1 right/left (T11 solve), GUNNER-2 right/left (T12 loader solve): attached ok, ratios not re-measured per frame. Hand lines and ratios are the asset tickets' numbers; no new arm motion in this plate.
Values not followed (need Film):
1. **"Exactly three men, readable as three at 270 px at L 0": not met.** T12's Film fix moved GUNNER-2 to (0.50, 0, 0.35) with the 25 degree lean toward the gun; the head probes at L 0 are GUNNER-2 x 551 / GUNNER-1 x 555 (heads 4 px apart in x, 9 px apart in y), so the loader's head and hat cover GUNNER-1's head and only his lower back and the tripod show (`T22-crew-zoom.png`). The sheet projection (GUNNER-2 head 496, GUNNER-1 head 555) was computed from the old mark (0.75, 0, 0.45). Nothing was moved. Options for Film: move the loader further +x (no, his reach to the pan is 0.52 m), turn the lean off in this shot, or accept two men plus a seated gunner behind the loader (L 74 heads are 547 / 518, 29 px apart, better but still overlapping).
2. **Sheet "right shoulder" and "right mitten"**: followed the Film fixes (look back over the LEFT shoulder, MEREDITH left mitten) as the ticket and T07/T12 rows say.
3. **Field birds painted heads-first (library untouched):** the plate drops the `body` flats (mop feathers) and uses the far level of detail for the 36 field birds (`paintHeadOnly`, same build, pose, scale and seed as `paintEmu`; body, mop and legs sit under the 0.85 m wheat), EMU-HERO stays near (R7 LOD row; the stills timeout fired with 36 near birds, 36 far full birds still cost about 2x the time of the head-only birds). The hero's body above the stalks reads as a dark round mound (no mop detail at that tone).
4. **Paddock order:** the camera is north of the fence, so `paintPaddockScene` paints the clearing after its `cast` callback and covered every bird drawn there (the first still lost EMU-HERO). The plate calls the scene with no `cast` and paints the birds, crew and stalks after it; the set is unchanged.
5. **L 74 foreground:** the near stalks the sheet asks for lie 2-3 m below the raised camera and read as dark leaf shapes at the lower left of L 52-74; kept as specified.
Checks: `npx tsc --noEmit -p .` no error in the shot file (8 errors in tests, pre-existing); `npm test` 477 / 486 pass: 9 fail = HIPPO.YAWN, CHARGE, HALT, test (d) canvasStyleOf (until T24 r5), and loudness, new-shot, render-inputs, segments, adopt (environment), none touch this file.
