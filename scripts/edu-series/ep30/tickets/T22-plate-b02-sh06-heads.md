# T22 — plate B02-SH06 ("สามคนเหรอ…": EMU-HERO counts the crew, then the crane over a field of rising heads) is built and proven
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: r8 accepted in part; fix pass 2 (last) = **T42 r2**, ready (R11: rows restated TF70; acceptance pre-decided in T42 r2) · was: r8 accepted in part; fix pass 2 (last) in **T42** (R10: near field birds culled) · was: built, open question (Film) · r3: Film notes added (TICKETS-R3)
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

## r8 fix rows (Film, 2026-11-20, `EDU-EP30-TICKETS-R9`): look check of the built plate and the answer to Q-T22-1
These override any older value in this ticket that they name. Viewed: store `T22-sheet.png` (L 0–74), `T22-crew-zoom.png`. **Verdict: fix (fix pass 1).** The count, the nods, the look back and the rising heads read; the crew does not read as three at L 0, the near stalks turn into dark leaf shapes once the crane rises, and the interleave rows read as light/dark rings at L 58–74.

**Q-T22-1 answered (Film): drop the loader's lean outside the pan seat.** The count beat needs three men at L 0 (three nods on three syllables). GUNNER-2 kneels upright with the pan held toward him until L 14, leans in to seat it over L 14–20 (the built 25°), and the built hold release (L 40–46) stands.

| Row | Value | Pass |
| --- | --- | --- |
| F1 loader lean | `paintCrewPose(p, c, GUNNER2, LOADER_AT, {pose: 'loader', L, seed: 34700, pan: heldAt(L), loaderLean: leanK(L), …})` with `leanK(L) = L <= 14 ? 0 : L < 20 ? easeIO((L − 14) / 6) : 1` (T18 row R9-1 adds `loaderLean`) | L 0, 4, 8, 12: GUNNER-1 hat + face box covered by GUNNER-2's figure **≤ 25 %** (logged from the probes); head centres **≥ 30 px** apart at L 0 (logged); viewed at 270 px: three men read |
| F1b held pan | `heldAt(L) = [pan[0] + 0.18 × (1 − easeIO(seg(L, 14, 20))), pan[1], pan[2]]` (m; toward the loader), passed both to the loader (rim targets) and to `heldPan` while L < 30; the seated pan is unchanged | arm ratio **≤ 1.05** every 2 frames L 0–34 (logged); rims on the seated pan at L 30 within 0.01 m |
| F1c fallback | if the L 0 cover stays > 25 %, raise the 0.18 m offset to 0.25 m (only that); if the arm ratio then exceeds 1.05, set Status blocked with both numbers | — |
| F2 near stalks | stalk stroke colour = `mixColor(<built stalk colour>, PAD.wheatLit, easeIO(seg(L, 48, 64)))`; positions, count and weights unchanged | L 58, 64, 74 viewed: no dark leaf shapes at the lower left; lower-left 300 × 300 box mean luma at L 74 within 20 of the mid-field box (logged) |
| F3 interleave tone | every interleave `paintWheatRidges` call passes `tone: 'even'` (T38 row P3) | L 58, 64, 74 viewed: no alternating light/dark rings; heads still come out of the wheat with bodies hidden |
| Leads | unchanged | L 0 EMU-HERO 604 ± 30, MEREDITH 141 ± 15 to the head top; L 74 EMU-HERO 301 ± 30 |
| Caption zone | TF46 | L 0 0.715 / 0.910, L 74 0.709 / 0.898 already pass |

**r8 Files:** `src/painted/edu30/shots/B02-SH06.tsx` only. **Blocked by:** T18 (`loaderLean` in `cast.ts`), T38 (`tone` in `paddock.ts`). **Proof:** re-render L 0, 4, 8, 12, 20, 30, 52, 58, 64, 74; sheet at 270 px plus the crew zoom at L 0; archive as `T22r8-*.png` with `T22r8-sheet.png`.


## R10 look check (Film, 2026-11-20, `EDU-EP30-TICKETS-R10`)
Viewed `T22r8-sheet.png`, `T22r8-crew-zoom.png`, `T22r8-ll74-box.png`. **Verdict: fix (fix pass 2 = [T42](T42-plate-fixes-b02sh06-b04sh03.md) rows H1–H3; cap reached after it).**
- F1 / F1b (three men read, cover 11.4 %, 38.9 px apart), F3 (no rings) and the leads: pass, accepted.
- F2: near stalks fade correctly; the luma row is **withdrawn** (TF63). The remaining dark mass is the nearest heads-field birds seen from above (body and wing flats as slabs; at L 52 one reads as a bird lying flat, CAT02). T42 H1 drops the birds whose ground point projects below y 1450 or lies within 6.0 m at the L 74 camera; heads up ≥ 28. Ridge stalk colour accepted as built.
- The thin vertical sky hairline is the newsreel scratch layer (T01): accepted.

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

### r8 fix pass 1 Result (Boss, 2026-11-20, Sonnet medium, worktree branch `worktree-agent-aecc3f11b9f4ed300`, merged `claude/ep30-continuation-493a12` at `c3c225f` first) · fix passes: 1 · `src/painted/edu30/shots/B02-SH06.tsx` only
Proof (store `projects/edu/EDU/previews/`, `T22r8-` prefix, clean frames, `sheet.png` untouched): `T22r8-sheet.png` (L 0, 4, 8, 12, 20, 30, 52, 58, 64, 74 at 270 px, viewed), `T22r8-s{00,04,08,12,20,30,52,58,64,74}.png`, `T22r8-crew-zoom.png` (L 0, viewed), `T22r8-ll74-box.png` (the lower-left 300 x 300 box at L 74). Logs `out/logs/T22r8-stills.log`.
Built: F1 `leanK(L)` passed as `loaderLean`; F1b `heldAt(L)` (+0.18 m toward the loader, 0 from L 20) passed to the loader and to `heldPan`; F2 `paintNearStalks` has no colour option and `paddock.ts` is out of scope, so the shot file carries `paintStalks`, a copy of its loop (same positions, count, weights, ear fills) with the stroke colour `mixColor(<built colour>, PAD.wheatLit, easeIO(seg(L, 48, 64)))`; F3 `tone: 'even'` on every interleave `paintWheatRidges`.
Measured vs rows:
- F1 (ad-hoc probe, not committed: `paintCrew`, `paintSeatedGunner`, `paintCrewPose` on the stack camera, hat + face box approximated as head x +- 0.55 head heights, headTop to chin): GUNNER-1 box covered by GUNNER-2: L 0, 4, 8, 12 = **11.4 %** each (row <= 25 %): pass. Head centres L 0: G1 (555, 881), G2 (520, 866), 38.9 px apart (35.7 px in x) (row >= 30 px): pass. Viewed at 270 px and in the zoom: three men read: pass. (Covers during the seat: L 16 24.3 %, L 18 53.8 %, L 20 74.8 %, after the count beat, as decided.)
- F1b: arm ratio right 1.000, left 1.000 at every 2 frames L 0-20 (row <= 1.05): pass; the offset is exactly 0 from L 20, so the seated pan and its rims at L 30 are the built ones (0 m difference, row 0.01): pass. F1c not needed.
- F2 viewed L 58, 64, 74: the near stalks (pointed ears and strokes) fade to the lit wheat tone; no dark leaf shapes from the near stalks. **Lower-left luma row not met:** 300 x 300 box at L 74 (x 0..300, y 1620..1920) mean luma 125.3 against 199.4 for the mid-field box (x 390..690, y 850..1150) (row: within 20). The box is dark because of elements outside the row: a field bird's wing flat at its top-left and the dark straight poles of `paintWheatRidges` (nearest ridge rows, `paddock.ts`), see `T22r8-ll74-box.png`. L 64: 112.6 against 197.9. Nothing else moved; needs Film (ridge pole colour or the wing flats, T38/T08).
- F3 viewed L 58, 64, 74: no alternating light/dark rings; heads still come out of the wheat with bodies hidden: pass.
- Leads (`measure-shots.ts B02-SH06 0,74`): L 0 EMU-HERO 594 (604 +- 30), MEREDITH 152 to the hat top = 141.5 to the head top (141 +- 15), L 74 EMU-HERO 326 (301 +- 30): unchanged, pass.
- Caption zone (`--band 1150:1344 --max-mean 0.80 --max-p95 0.99`, clean frames): L 0 mean 0.691 / p95 0.885, L 74 0.706 / 0.874: pass (both now `pass: true`, the even tone lightened the band).
Other: the thin vertical hairline in the sky (x 215 at L 0, 718 at L 74) is in the pre-r8 proof too (not from these rows; not touched). `npx tsc --noEmit -p .` no error in the shot file. `npm test` not run (known failing set, shot file has no test).
