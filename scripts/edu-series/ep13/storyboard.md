# Storyboard — EDU-EP13-SHORT (storyboard pass; rows timed in R2.1)

Revision: **EDU-EP13-ROWS-R2.1** (Film, 2026-11-09, W5.1 re-time for the R5 voice re-lock, Take B: ranges from [scene-sheets.md](scene-sheets.md) EDU-EP13-SHEETS-R2.1, 1542 f = 51.40 s; script R5 text in B02-SH01/B02-SH03, label "แรงดีด ↑", ending sound without the pizzicato tag; those three rows ask again, the other 13 keep their verdicts). Previous: **EDU-EP13-ROWS-R2.0** (Film, 2026-11-09, W5.1: rows timed from the W4 voice lock; **the timed ranges, event frames, camera values and sound frames now live in [scene-sheets.md](scene-sheets.md) EDU-EP13-SHEETS-R2.0, which wins on conflict; the shot list below carries the timed ranges, the per-shot staging blocks keep the superseded R1.5 estimates for history**; shot text unchanged, so the storyboard verdicts hold). Previous: EDU-EP13-ROWS-R1.5 (Film, 2026-11-09, W3 look lock of the trailer: LF04 and LF04b locked by the user 2026-11-09; B01's beat look moves from LF03 to LF04; shots, text and timing unchanged, see [Look lock R1.5](film-brief.md#look-lock-r15)). R1.4 was the W2 update for script R4: B03-SH02 (L08 slow motion) retired; B04-SH01 rebuilt for the new L15/L16 (slingshot "?", icon greys and stays, lit long legs); B04-SH02 opens on the crouch (L11 removed); new words in B02-SH01 (L03), B02-SH03 (L05), B03-SH03 (L09); V01 adds MAN's look at the legs (B01-SH05). R1.3 was the W2 update for script R3: TR01 sci-fi trailer in B01 (SH04 changed, SH04B–SH04D new), B02 cut to two shots (SH01 and SH03 changed, SH02 and SH04 retired), V02 trailer callback inset in B04-SH02; R1.2 added the locked look frames; rows untimed on the review page, estimated frames here for planning only).
Inputs: [script.md](script.md) **EDU-EP13-SCRIPT-R4** (user-approved 2026-11-09, chat), [fact-check.md](fact-check.md) W1.3 + R2 recheck + R3 recheck (four picture limits, R09) + **R4 check** (pass, no must-fix; B04 picture limits, applied as R10), [film-brief.md](film-brief.md) **EDU-EP13-BRIEF-R1.4** (decisions VD01–VD32, sets, cameras, assets N1–N21, sound codes M1, A1–A3, S1–S23, TR1–TR7).
Rows file: [review-rows.json](review-rows.json) **EDU-EP13-ROWS-R2.1** (R2.0: `"untimed": false`, `start`/`end` per shot from the scene sheets; title, VO, seen and sound unchanged). Before R2.0: ROWS-R1.5 (`"untimed": true`; `looks` LF01–LF04, LF04b, FL1–FL3; B01 beat look LF04; LF04b is in `looks` for shot 5, but the page shows one look per beat, so only LF04 appears in the B01 header). Review page: pending (coordinator publishes).

**R1.2 coordinate note:** room numbers per shot below are the pre-lock plan. Read them with the brief's [R1.2 offsets](film-brief.md#look-lock-r12): in `R`, chart-group positions and chart-camera target x + 0.50 (OX), sofa-group positions + 0.15 (DS), CAM-SOFA unchanged. Street numbers in shots 4–7 are already the locked SET-SOI marks (MAN (0.20, 0, 0), giant (1.50, 0, −0.60)). The W5.1 timed scene sheets carry the shifted numbers.

## Status

- **R2.1:** re-timed to SHEETS-R2.1 (Take B, 1542 f = 51.40 s); the per-shot blocks below stay the R1.5 record.
- **R2.0:** production readiness moves to [scene-sheets.md](scene-sheets.md) (`ready-for-dev`, voice-timed, 1390 f = 46.33 s). The two lines below describe the R1.5 storyboard pass.
- **Readiness (R1.5): `ready-for-dev` for the storyboard review only** (camera, staging, VO and sound per shot, for the user's verdicts on the review page). Not ready for production: timing is estimated (W4 voice lock, then the W5.1 timed scene sheets); the trailer look is locked as stills only (LF04, LF04b, user 2026-11-09; look code `exists-unintegrated` in `src/painted/edu13/trailer.ts`, `flea.ts`, `scenes.ts`); the leg-length light and most motions are missing (Boss N2–N21); no trailer motion has been rendered or viewed.
- Readiness is not approval: this pass adds no approval and proves no runtime or visual result.

## Units and conventions

- 30 fps; frames are global and half-open `[start, end)`; seconds `est` from the script R4 N1 syllable counts × 0.237 s with 0.28 s gaps (method in the brief header). R2.1 timed: **16 shots, 1542 f = 51.40 s**; R2.0 timed: **16 shots, 1390 f = 46.33 s** (scene sheets). R1.5 plan: **16 shots, 1561 f ≈ 52.0 s** (range 50–56 s; script R4 N1 ≈ 53.0 s, the difference is the unchanged B05 hold and per-line gap counting; R1.3 was 17 shots, 1671 f ≈ 55.7 s).
- Spaces and axes: `R` room (m), `M` macro studio (mm), `D` insert studio (m), `S` street and skyline (m), as in the brief's projection contract and set plans (+x screen-right from the main camera side, +y up, +z toward the camera; in `S`, −z toward the tower). Camera lines use the kit form `cam: target (x, y, z), yaw, r, eye, f, hy` (hy = picture row of the target; yaw positive = camera swung toward +x).
- Frame zones: caption band y 1176–1344; faces, feet contact, band, marks and labels above y 1160 (except the street back views, brief VD11/VD28/VD30); label slot LBL (816–1020, 148–204); trailer card slot TC (centred, rows 1010–1100, est); `@TamMaiLa` top-left (x < 330, y < 140 kept clear).
- Lead sizes are computed (px/m = f / distance), not rendered.
- `changed` in a heading marks a shot whose text changed in R1.4 (the review page asks again); R1.3's changed shots 4–7 keep their R1.3 note (their content is unchanged in R1.4, so a saved verdict holds).

## Casting

| Role | Casting line | Notes |
| --- | --- | --- |
| MAN | `man-parted + home-lounge (outfit override: cardigan off), P31, neutral` | 1.80 m; poses through the episode: P31 seated → P02 thinking → P30 (back view, street) → `gasp-recoil` → `new: standing-jump` (P35 crouch body) → P09 smug → `sit-down` (front); faces neutral → shock → neutral → smug → relieved. R1.3: the P06 shrug shot is gone; B02-SH03 ends on a front head swap instead |
| DOG | `dog-golden, lie, idle` + kit `lid: 1` (eyes shut); end `new: dog-head-lift-sigh` | 0.58 m; only on the sofa, only in CAM-SOFA; never scratching (FIX-5); never in the street or trailer |
| FLEA (macro) | `new: flea`, right profile, 2.0 mm, `new: flea-catapult-jump` | only on the paper studio, "ภาพจำลอง"; never in a trailer frame (Boat R3 condition 4) |
| FLEA (giant) | `new: flea`, right profile, 1.80 m long (VD05), `new: flea-muscle-jump`, grow/shrink clock; `new: flea silhouette` (dark fill + warm rim) in the trailer | front head once (V01); never in a frame with the dog |
| GHOST | MAN's figure at 40 %, no glow, no pack | B02-SH03 only |

## Shot list

| # | Shot | Lines | Start s | Len s | Frames (R2.1 timed) | Camera | One-line read |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | S01-B01-SH01 | L01 a | 0.00 | 1.47 | [0, 44) | CAM-SOFA | Sunlit room, MAN on the sofa, dog asleep, chart on the wall |
| 2 | S01-B01-SH02 | L01 b | 1.47 | 1.73 | [44, 96) | CAM-MACRO → crane | Paper studio: flea, "2 มม.", vanishes up; counter ×10 … ×50 |
| 3 | S01-B01-SH03 | L01 c | 3.20 | 1.10 | [96, 129) | CAM-CHART-2S (fixed) | A dot grows into a person-length flea beside thinking MAN |
| 4 | S01-B01-SH04 **changed (R1.3)** | L01 d (TR01) | 4.30 | 0.77 | [129, 152) | CAM-TR-SOI | Trailer: dusk soi, a long shadow sweeps over tiny MAN; he looks up |
| 5 | S01-B01-SH04B **new (R1.3)** | L01 tail (TR01) | 5.07 | 1.00 | [152, 182) | CAM-MYTH (trailer grade) | Trailer: the giant crouched beside MAN, legs folded; launch |
| 6 | S01-B01-SH04C **new (R1.3)** | TR01, L02 "ไม่หรอก" | 6.07 | 1.53 | [182, 228) | CAM-TR-SKY (locked) | Trailer money shot: silhouette arcs over the tower against the skyline; tape-stop, droop |
| 7 | S01-B01-SH04D **new (R1.3)** | L02 | 7.60 | 2.97 | [228, 317) | CAM-MYTH (plain) | Plain afternoon soi: the flea drops back, one knee-high hop beside MAN |
| 8 | S01-B01-SH05 **changed** | V01 | 10.57 | 2.10 | [317, 380) | CAM-CHART-2S + push | MAN sees it: "เฮ้ย… ตัวเท่าเราเลย!"; flea looks at us; MAN's eyes drop to its huge hind legs |
| 9 | S01-B02-SH01 **changed** | L03 | 12.67 | 3.27 | [380, 478) | CAM-FLEA-LEGS | Leg glow swells "แรงดีด ↑" (R5), then a weight dial swings up in step |
| 10 | S01-B02-SH03 **changed** | L05, L06 | 15.93 | 7.10 | [478, 691) | CAM-INSERT | Studio: MAN ×2 legs, ×2 backpack, hops with his ghost to one line; refrain over the landing |
| 11 | S01-B03-SH01 | L07 | 23.03 | 3.13 | [691, 785) | CAM-MACRO | Studio: real flea, legs folded |
| 12 | S01-B03-SH03 **changed** | L09 | 26.17 | 4.40 | [785, 917) | CAM-MACRO-THORAX | See-through pad squeezes, locks, snaps; gone; slingshot icon |
| 13 | S01-B04-SH01 **changed** | L15, L16 | 30.57 | 7.27 | [917, 1135) | CAM-CHART-2S | Slingshot icon with "?" over the giant; "?" off, icon greys and stays; light runs down its long hind leg |
| 14 | S01-B04-SH02 **changed** | V02, L12 | 37.83 | 4.80 | [1135, 1279) | CAM-TRUTH (locked) | Matched crouch from the first frame, jump, apex freeze in the band, tag, thud; frozen trailer inset on "ไม่ใช่ร้อยเมตร"; greyed icon rides on the giant's back |
| 15 | S01-B05-SH01 | L13 | 42.63 | 4.13 | [1279, 1403) | CAM-CHART-LOW | Giant shrinks away; flea mark low, MAN's mark higher; smug |
| 16 | S01-B05-SH02 | L14, V03, hold | 46.77 | 4.63 | [1403, 1542) | CAM-SOFA | MAN back on the sofa; dog lifts head, sighs; hold |

Retired in R1.3 (IDs not reused): **S01-B02-SH02** (L04 weight dial; L04 removed, the dial moved into B02-SH01) and **S01-B02-SH04** (L06 shrug; L06 now plays over the B02-SH03 landing).
Retired in R1.4 (ID not reused): **S01-B03-SH02** (L08 slow-motion leg, muscle icon and mini clock; L08 removed in script R4, its idea returns by contrast in L16 over shot 13).

## Rules for every shot

- **R01 Dog (FIX-5).** The dog appears only in shots 1 and 16, resting or asleep; never scratching, never with any flea in frame. Every giant-flea room shot frames x ≤ 2.45 pre-shift (2.95 shifted) at the actors' plane (brief SET-LR13 dog-free zone). No dog in the street or trailer.
- **R02 Macro (FIX-5, FIX-4).** The real-size flea appears only on the paper studio (shots 2, 11, 12) with "ภาพจำลอง" in LBL (R1.4: no slowed shot remains; "ภาพช้า · ภาพจำลอง" only if W5.1 slows the shot-12 snap, FIX-4). The ghost-hop insert (shot 10) also carries "ภาพจำลอง" in LBL (Boat B-P6). No skin, fur, bite, itch, sofa or floor under it.
- **R03 No digits.** On-screen text is exactly brief VD24; the chart and the marks carry no numerals; the clock icon and the weight dial have no digits; the trailer has no floor count, metre figure or counter.
- **R04 Same order, not equal.** In shot 14 the band is broad (0.10–0.50 m) and the giant peaks a little below MAN; the tag says "สูงพอ ๆ กัน" only (Boat N4 e).
- **R05 One plane, locked camera.** Shot 14: MAN and the giant on z 0.35, the camera does not move; the trailer inset is a screen layer and moves nothing in the world.
- **R06 Size reference.** Every shot keeps one size reference in frame: MAN and the chart (room), the bar then the counter (macro), MAN + ghost + chart strip (insert), MAN (street shots 4, 5, 7), the tower's 3.3 m storey bands (skyline shot 6).
- **R07 Screen.** Faces and contacts above y 1160 (street back views in shots 4, 5, 7 excepted); each label in its own slot; captions = VO.
- **R08 Continuity.** MAN: sofa (1) → chart (3, 8–9, 13–14) → imagined street (4–7, same P30 back view and marks) → chart side (15) → sofa (16); the giant's anchors identical in every chart shot and in shots 5 and 7; the slingshot icon's drawing identical in 12, 13 and 14 (colour in 12, colour → grey in 13, grey in 14); room light constant; the trailer grade only in shots 4–6 and inside the shot-14 inset.
- **R09 Trailer (Boat R3 recheck, binding).** (1) The card "ถ้าคิดแบบง่าย ๆ" is on screen in TC from shot 4 +0 until the flea leaves the frame in shot 6 (+42), and inside the shot-14 inset. (2) No spoken or on-screen floor count, metre figure or counter digits. (3) No damage, cracks, debris, crowd, panic, sirens, screams or news-style sound; the trailer bed is labelled fiction in the cue sheet. (4) The real macro flea and its "ภาพจำลอง" label never share a trailer frame. (5) Peak hold ≤ 15 f (0.5 s) with the card showing, no dotted-arc end marker, no "ผล" label, no apex tick; "ไม่หรอก" breaks it on its first frame. (6) No title card (user decision).
- **R10 B04 pictures (Boat R4 check, binding).** (1) Once the slingshot icon greys in shot 13 it stays on screen to the cut and rides on the giant's back through shot 14: never faded out, popped off or crossed out ("ไม่ค่อย", CL11: the giant could still keep a pad). (2) The lit long leg carries no figure, ruler, tick, arrow label or "ความจริง" label; it is light only. (3) No text, label or sound says "muscle is slow" or gives a timing figure (no "1 ms"). (4) The tiny flea's short legs are not re-shown in B04 (the contrast stays implied, Boat L16 note).

## Per-shot staging

**Superseded by [scene-sheets.md](scene-sheets.md) SHEETS-R2.1 (R2.0 before it) for every range, key frame, camera value and sound frame** (kept here as the R1.5 record). Values `est`; frames global; key frames shot-local `+n`. Sound lines give the shot-local frame and the brief's code or library ID (brief [Sound direction](film-brief.md#sound-direction)).

**1. S01-B01-SH01** [0, 42). L01 "หมัดกระโดดได้…" (to about +40).
- Camera: CAM-SOFA `cam: target (3.30, 0.70, 0.55), yaw 40→38, r 2.80→2.72, eye 1.15, f 1200, hy 850` (slow push).
- Staging: R. MAN seated `front` at (3.15, 0.30, 0.45), P31, phone face-down on his thigh, eyes on the dog, `neutral`; seated lead est 530 px. Dog `left` profile lying at (4.00, 0.30, 0.45), head toward MAN, eyes shut, `idle` breathing. Chart visible in the left third (background). Sun patches on the dog's back and the rug.
- Key frames: +0 frame reads at once (UT01); +30 MAN's eyes drift up to the window (a thought).
- Sound: room tone (`city_soi-afternoon-day_01` low + A1 fan) from +0; S1 dog breathing +0–+42; M1 enters at +6, energy 2.

**2. S01-B01-SH02** [42, 102). L01 "…สูงกว่าตัวมันหลายสิบเท่า…".
- Camera: CAM-MACRO `cam: target (0, 0.45, 0) mm, yaw 0, r 4.0, eye 0.45, f 1200, hy 900` for +0–+14, then the crane: target y rides the flea, r 4.0 → 40 mm over +15–+60, still rising at the cut (no ease-out settle; Boat B-P2).
- Staging: M. Flea `right` profile at (0, 0, 0), legs folded (CL02), 600 px long; "2 มม." bar (600 px, y ≈ 1100) and "ภาพจำลอง" in LBL.
- Key frames: +14 rest; **+15 gone** (1-frame take-off, smear streak; contact shadow stays); the bar fades +15–+20; the flea shrinks with the pull-back to ≈ 60 px by +45, ring marker from +40; counter pill beside it: ×10 at +24, ×20 +32, ×30 +40, ×40 +48, ×50 +56 (heights 20…100 mm); ×50 is on screen only +56–+59 while the ring marker and camera keep rising: never a held apex or last frame, no digit past ×50 (Boat B-P2).
- Sound: A2 studio hush replaces room tone at +0; S2 tick at +15; S3 rising swish +15–+60; S4 counter ticks at +24, +32, +40, +48, +56 rising; the S3 swish runs on through the cut (no tail-off on ×50).

**3. S01-B01-SH03** [102, 144). L01 "…ถ้ามันตัวเท่าคุณ…".
- Camera: CAM-CHART-2S **fixed** `cam: target (0.95, 1.00, 0.35), yaw 0, r 6.6, eye 1.15, f 2400, hy 770` (no move: MAN and the chart are the reference while only the flea changes).
- Staging: R. MAN `front` at (0, 0, 0.35), P02 (hand to chin), eyes up-left, `neutral`, unaware; MAN 655 px. Ring marker on the floor at (1.35, 0, 0.35) +0–+8.
- Key frames: +4 grow starts about the feet, k(t) = 900^((n−4)/32); +36 full size (1.80 m long, 1.05 m tall) on "คุณ" (est); +38 the giant tilts its head up; MAN still thinking; cut on "จะกระโดด…".
- Sound: room tone back at +0; S5 grow glissando +4–+40; M1 lifts to energy 3, **cut dead on the last frame** (the trailer takes over on the cut).

**4. S01-B01-SH04 — changed (R1.3)** [144, 174). L01 "…จะกระโดดข้ามตึก…" (TR01 opens on the cut).
- Camera: CAM-TR-SOI `cam: target (1.0, 8.0, −30), yaw 0, r 46, eye 1.6, pitch +8, f 1100, hy 900` (camera down the soi behind MAN at about z +16; MAN ≈ 69 px/m → **124 px, tiny**; the tower cropped by the top edge, looming; est, SP4 computes). Slow creep r 46 → 45.
- Staging: S, **trailer grade** (VD26: dusk sky, amber low sun behind the tower, teal haze, warm rims, grain + vignette on this plate only). MAN back view at (0.20, 0, 0), P30 visor_look_far; shophouses both sides, textless; nobody else in the soi.
- Key frames: +0 card "ถ้าคิดแบบง่าย ๆ" fades in in TC over 4 f (trailer type); **+6–+24 a long soft shadow** (the giant's silhouette stretched about ×3 by the low sun) sweeps down the road toward the lens and passes over MAN (+16); +16 MAN's head tilts up; cut at +30.
- Sound: M1 out; **TR1 braam at +0** (fictional trailer bed starts); soi ambience drops to 30 % with A3 high wind; TR2 shadow pass +6–+24; `reveal_riser-tension_01` (its last 1.6 s) runs from +0 toward its dead stop on the launch (shot 5 +18).

**5. S01-B01-SH04B — new (R1.3)** [174, 201). L01 "…ได้มั้ย" (tail; TR01).
- Camera: CAM-MYTH with the locked LF03 values `cam: target (1.0, 1.4, 0), yaw −6, r 2.6, eye 0.45, pitch +30, f 820` (no push; the composition the user locked, regraded).
- Staging: S, trailer grade (the sky behind the tower dusk, the giant and MAN rim-lit, near-silhouette). MAN back view at (0.20, 0, 0), P30; the giant `right` profile at feet (1.50, 0, −0.60) in `new: flea-muscle-jump` fold (CL02 echo). Card on in TC.
- Look (R1.5): **LF04b** locked (user 2026-11-09, `out/edu13/look-frames/v7/LF04b.png`) at about +10: giant in flea pose state `crouch`, near-silhouette with a warm rim; card in slot TC; sky and sun ungraded (see the brief's [Look lock R1.5](film-brief.md#look-lock-r15)).
- Key frames: +0–+16 the hind legs fold deeper (crouch); **+18 launch** (body leaves the frame top by +22, smear streak, a small grit swirl at its feet, no crack or debris); +18–+27 MAN's head tilts up after it; cut at +27.
- Sound: TR3 drum pulse, 4 hits accelerating +0–+16; riser stops dead at +18; **TR4 launch whoosh-boom at +18**; A3 wind continues.

**6. S01-B01-SH04C — new (R1.3)** [201, 246). TR01 money shot; L02 "ไม่หรอก…" from +21 (est 7.40 s).
- Camera: CAM-TR-SKY **locked** `cam: target (10, 70, −60), yaw −9, r 327, eye 25, pitch +8, f 3600, hy 820` (long lens from a far rooftop: ≈ 11 px/m; tower 100 m ≈ 1100 px, top row ≈ 490; arc apex 130 m ≈ row 160; skyline silhouettes rise from row ≈ 1120 behind the caption band; est, SP4 computes).
- Look (R1.5): **LF04** locked (user 2026-11-09, `out/edu13/look-frames/v6/LF04.png`) at +12 apex; the dotted trail runs near-vertical below the silhouette with a slight lean from lower left (replaces "rising from low right" for the apex frame; the rise path in W5.1 follows it); card in slot TC; sky and sun ungraded.
- Staging: S + skyline plate (VD29). The tower centred against a low amber sun disc and dusk bands; the far skyline (textless towers, haze-faded) both sides. The giant as `new: flea silhouette` at **true scale (1.80 m ≈ 20 px)** inside the LF03 ring marker, a short dotted trail behind it. Card on in TC.
- Key frames: +0 the silhouette enters low right, rising along the arc; **+12 apex** above the roof (no end marker, no tick); **+12–+21 hold (9 f ≤ 15 f)**; **+21 "ไม่หรอก": tape-stop** (picture decelerates to a stop over 6 f, the whole frame sags 2 % and the grade drains to flat grey); +27–+42 a short droop arc drops the silhouette down out of the frame bottom (dotted trail fades with it); **+42 card off**; cut at +45.
- Sound: TR5 wind rush +0–+12; near-silence +12–+21 (thin high air only); **TR6 tape-stop at +21** kills the trailer bed; S7 slide-whistle droop +27–+42; NAR on top.

**7. S01-B01-SH04D — new (R1.3)** [246, 354). L02 "…มันน่าจะกระโดดได้แค่หลักสิบเซน… พอ ๆ กับคุณนี่แหละ".
- Camera: CAM-MYTH plain (the LF03 look, afternoon, no grade) `cam: target (1.0, 1.4, 0), yaw −6→−3, r 2.6→2.45, eye 0.45, pitch +30, f 820` (slow push).
- Staging: S. MAN back view at (0.20, 0, 0), P30; the giant `right` profile drops into its mark (1.50, 0, −0.60) from about y 3 over +0–+6 and lands, a little deflated (antennae droop); no arc, no card.
- Key frames: +0–+6 drop and land; on "หลักสิบเซน" (est +30) **one small hop** 0.36 m (knee height; 18 f airtime +30–+48, `new: flea-muscle-jump` small amplitude); on "พอ ๆ กับคุณ" (est +69) MAN's head tips down and turns toward it.
- Sound: soi ambience back at full (`city_soi-afternoon-day_01`) + A3 breeze; `foley_soft-landing-tap_01` at +6 (drop landing) and tiny at +48 (hop landing); M1 re-enters at +10, energy 1.

**8. S01-B01-SH05 — changed** [354, 396). V01 "เฮ้ย… ตัวเท่าเราเลย!".
- Camera: CAM-CHART-2S as shot 3, then a comic push r 6.6 → 5.8 over +6–+14 (hy adjusted so the floor stays ≤ y 1160; scene sheet computes).
- Staging: R. MAN `turn-head-right` +0–+6, then `gasp-recoil` with `shock` +6–+20, V01 lip-sync; the giant swaps to its `front` head at +10 and looks at the lens to +22, then back to profile. **R1.4 (script R4 V01 cue):** +24–+32 MAN's eyes drop and his head tips down about 10° to the giant's folded near hind leg (gaze target the knee at about (0.85, 0.50, 0.35), est, pre-shift) and hold there to the cut (`shock` softening to wide-eyed `neutral`); the leg stays in frame and unlit (it is the clue CL02, the light comes in shot 13).
- Sound: room tone back at +0; M1 half-beat dropout +0–+12; S8 flinch sting at +8; V01 +4–+33; no cue on the look (the look is silent so V01 and the cut carry it).

**9. S01-B02-SH01 — changed** [396, 502). L03 "ขามันแรงขึ้นก็จริง… แต่ตัวก็หนักขึ้นตาม".
- Camera: CAM-FLEA-LEGS `cam: target (1.20, 0.55, 0.35), yaw 6→10, r 3.4→3.1, eye 0.9, f 1500, hy 860` (flea 795 → 870 px long; MAN's shoulder at the left edge). Same camera; the move now runs over 106 f.
- Staging: R. The giant at rest; coral glow on the hind-leg muscle 0 → 1 from "ขามันแรงขึ้น" (est +4) to the end; "แรง ↑" arrow beside the leg at +12; on "แต่ตัวก็หนักขึ้นตาม" (est +56) the round weight-dial icon (no numerals) pops in above the flea's back (≈ row 507) and its needle swings up **in step with the still-rising glow** +56–+95; a small down-arrow under the body. Glow and dial carry no digits, no "×" and no equal-size bars (Boat R3, R4 check). "ก็จริง" (est +30–+40) is a beat for the glow to reach about 0.6 before the "แต่".
- Sound: M1 back at energy 2 (lighter); S9 fwoop at +4; S10 floor groan +58–+92.

**10. S01-B02-SH03 — changed** [502, 680). L05 "เหมือนขาคุณแรงสองเท่า… แต่แบกเป้หนักสองเท่า", then L06 "ตัวใหญ่ขึ้น… กระโดดไม่ได้สูงขึ้นตาม" over the landing.
- Camera: CAM-INSERT `cam: target (0, 0.95, 0), yaw 0→3, r 2.9→2.7, eye 1.0, f 1300, hy 690` (MAN 865 px; floor ≈ y 1147).
- Staging: D (paper studio, metres). MAN `right` profile at (−0.40, 0, 0); ghost `right` profile at (+0.40, 0, 0), 40 %; chart strip at (0, 0, −0.30). "ภาพจำลอง" in LBL +0 to the end (Boat B-P6).
- Key frames (R1.4: L05 is 2 syllables shorter, every key from "แบกเป้" on moves −7 f, then −14 f): +4 coral glow on MAN's legs + "×2" tag; on "แบกเป้" (est +48) the backpack drops onto his shoulders + "×2" tag; +74–+80 both crouch; **+80 both take off** (0.20 m, 12 f), dashed line at the apex feet row +86; **+92 both land** on one frame; L06 from about +101 over the held landing (both straighten, the dashed line stays); on "ไม่ได้สูงขึ้นตาม" (est +136) the dashed line pulses once and MAN swaps to his `front` head, deadpan to the lens, to the end.
- Sound: A2 studio hush; S11 backpack thump at +48; `whoosh_fast-slide_01` at +80; `foley_soft-landing-tap_01` at +92 (quieter than B04's thud); S12 pluck at +136.

**11. S01-B03-SH01** [680, 773). L07 "แต่… แล้วหมัดตัวจิ๋ว กระโดดเก่งได้ยังไง".
- Camera: CAM-MACRO `cam: target (0, 0.45, 0) mm, yaw 0→4, r 4.0→3.6, eye 0.5, f 1200, hy 900` (slow push).
- Staging: M. The real flea at rest, legs folded; "2 มม." bar; "ภาพจำลอง" in LBL.
- Sound: A2 hush (room tone out); M1 thins, energy 1.5.

**12. S01-B03-SH03 — changed** [773, 895). L09 "มันบีบแผ่นยางยืดในตัวไว้… แล้วปล่อยทีเดียว เหมือนหนังสติ๊ก". (R1.4: follows shot 11 directly; the slow-motion shot S01-B03-SH02 is retired.)
- Camera: CAM-MACRO-THORAX from the locked F2 still: `cam: target (0, 0.55, 0) mm, yaw 0, r 2.9→2.7, eye 0.55, f 1200, hy 900` (brief R1.2 look lock).
- Staging: M. "ภาพจำลอง" in LBL. Body goes translucent +0–+6 (a cut straight from the matching macro rest frame, so the see-through reads as "look inside the same flea"); on "บีบ" (est +6, now the second syllable) the amber pad squeezes (scale-y 1 → 0.7) to +34; catch icon clicks shut at +36; hold to +55; on "ปล่อย" (est +55) **release: the flea is gone in one frame** (+56), smear streak up, pad glow fading in the air +56–+73; on "หนังสติ๊ก" (est +98) the slingshot icon pops in beside the empty spot. Not slowed, so the label stays "ภาพจำลอง" (FIX-4).
- Sound: S15 squeeze +6–+34, lock click at +36; **S16 snap at +56** + whip at +56; music stops dead at +56, A2 hush only to the end (the snap carries the beat; script R4 sound intent).

**13. S01-B04-SH01 — changed** [895, 1099). L15 "แล้วหมัดยักษ์ล่ะ… ยังต้องพึ่งหนังสติ๊กมั้ย", L16 "ไม่ค่อยต้องแล้ว… ขามันยาว มีเวลาให้กล้ามดันพื้นทัน".
- Camera: CAM-CHART-2S `cam: target (0.95, 1.00, 0.35), yaw 0→−3, r 6.6→6.3, eye 1.15, f 2400, hy 770` (slow push over the whole shot; ≈ 364 → 381 px/m; frame right edge at the actors' plane ≤ x 2.40 pre-shift, inside the dog-free zone R01).
- Staging: R. MAN `front` at (0, 0, 0.35), `neutral`; the giant `right` profile at (1.35, 0, 0.35), rest (the shot-3/8 anchors). Slingshot icon (the shot-12 drawing, 90 px, colour) anchored to the world point (1.20, 1.25, 0.35) above the giant's back (screen ≈ x 631, y 679 at +0, est; DOM, re-projected each frame); "?" (ink, 40 px) at its upper right.
- Key frames: L15 from +2; **+4 icon pops in with "?"** (scale 0 → 1.1 → 1 over 6 f); on "หมัดยักษ์" (est +8) the giant tilts its head up toward the icon (+8–+16); +30 MAN glances right at the giant; L15 ends est +80, a light curious lift on "มั้ย". L16 from est +87: **+90 the "?" pops off (2 f) and the icon fades colour → grey over 12 f (+90–+102), then stays grey to the cut** (R10; never removed); the giant's head levels +96–+104 (a small shrug of the antennae). On "ขามันยาว" (est +124) **a soft white light line (`#fff6e0` core, pale-blue `#bfe3ff` glow 50 %, ≈ 10 px) travels along the giant's near hind leg from the hip (≈ (0.95, 0.60, 0.35)) through the knee to the foot (≈ (0.62, 0, 0.35)), est, +124–+142**, then the whole leg holds a faint even glow to +176 and fades out by +190; no figure, ruler, tick or label on it (R10; not the coral "แรง" glow of shot 9, so the viewer reads "length", not "strength"). On "กล้ามดันพื้น" (est +170) MAN's eyes go from the leg to the lens and back; +192–+204 both settle their weight (2 f anticipation, knees soften about 5°), ready; cut at +204 before the crouch (shot 14 opens on it).
- Sound: room tone back at +0 (A2 out); M1 resumes at +0, energy 2.5; **S21 question pluck at +4** with the icon; **S23 de-tune blip at +90** as the "?" goes and the icon greys; **S22 rising tone +124–+142** with the light line, stopping as it reaches the foot; M1 builds a little from +150 into the cut. NAR on top; SFX sit in syllable gaps (Editor ±3 f).

**14. S01-B04-SH02 — changed** [1099, 1243). V02 "ฮึบ!", L12 "สูงพอ ๆ กัน… แค่หลักสิบเซน ไม่ใช่ร้อยเมตร". (R1.4: L11 removed; the shot opens on the crouch.)
- Camera: CAM-TRUTH **locked** `cam: target (0.95, 1.00, 0.35), yaw 0, r 10.0, eye 1.0, f 3600, hy 790` (no move: measurement).
- Staging: R, both on z 0.35. MAN `front` at (0, 0, 0.35), 648 px (x ≈ 108–288); giant `right` profile at (1.35, 0, 0.35) (x ≈ 360–1008); floor row 1150. **The greyed slingshot icon (R10)** at 60 px, anchored to (1.20, 1.25, 0.35) + the giant's jump height (screen ≈ x 630, y 700 at rest, ≈ 570 at the apex; est), riding with the giant through the jump and the freeze, on screen to the cut; it never meets the tag (y 190–300), the band (rows 970–1114) or the inset (rows 340–600, shown only after the landing, when the icon is back at ≈ 670–730).
- Key frames: **crouch +0–+8** (both; MAN standing-jump crouch, giant legs fold; matched); **take-off +8** with V02; apex **+17** (MAN feet ≈ y 999 at 0.42 m, giant ≈ y 1020 at 0.36 m); **freeze +17–+44** (27 f): band 0.10–0.50 m (rows 970–1114) fades in +18–+24 with "หลักสิบเซน" at its left end, tag "สูงพอ ๆ กัน" (y 190–300) with a leader to the band +24; resume +44, **landing +53** (both on one frame); **trailer callback (VD31): on "ไม่ใช่" (est +88) an inset pops in upper right (x ≈ 600–1040, rows ≈ 340–600, est; beside, never on, the band; clear of the tag, MAN's head, the giant and the icon): the shot-6 apex frame, frozen in its tape-stopped grey, with the card "ถ้าคิดแบบง่าย ๆ" inside, no ruler, no number; it snaps off at +122 at the end of "ร้อยเมตร"**; band and tag fade +120–+135; both straighten, MAN glances at the giant.
- Sound: S17 crouch pair at +0 (the script's "two cloth creaks on the crouch"); S18 jump pair + V02 at +8; **silence +17–+44** (music and room tone out, NAR only); S19 landing thud at +53, room tone back; M1 back at energy 2 from +53; **TR7 braam echo** (TR1 low-passed, far, −18 dB) +88, cut dead at +122 with a pitched-down `ui_click-tick_01` as the inset snaps off.
- Cut note (est, W5.1 checks): shot 13 ends on CAM-CHART-2S at r 6.3, yaw −3 and this shot is CAM-TRUTH at the same target and about the same px/m; the change reads as a small flattening, not a new angle (as in R1.3). If the cut reads as a jump at the draft, W5.1 ends shot 13's push at r 6.0 instead.

**15. S01-B05-SH01** [1243, 1402). L13 "แต่ถ้าวัดเป็นเซน… ปกติ คุณก็กระโดดสูงกว่าหมัดตัวจริงอีกนะ".
- Camera: CAM-CHART-LOW `cam: target (0.05, 0.85, 0.30), yaw −8→−4, r 2.75→2.60, eye 1.0, f 1400, hy 700` (≈ 509 → 538 px/m).
- Staging: R. Opens on the giant shrinking away about its feet +0–+12 (sparkle fades by +20; no flea remains); MAN at (0.45, 0, 0.30) `front` beside the chart (chart at screen left of him).
- Key frames: on "เซน" (est +30) the flea mark (line + tiny flea icon) ticks on at 0.15 m (row ≈ 1076); +55 MAN's mark (line + tiny man icon) at 0.42 m (row ≈ 931); MAN glances down at both +60–+90; on "สูงกว่า" (est +110) P09 hands on hips, `smug` to the lens.
- Sound: S20 shrink pop at +0; S20 ticks at +30 (high) and +55 (low); M1 warm, energy 2.

**16. S01-B05-SH02** [1402, 1561). L14 "หมัดดูเก่ง… ก็เพราะตัวมันเล็กมาก", V03, hold.
- Camera: CAM-SOFA `cam: target (3.30, 0.70, 0.55), yaw 37→35, r 2.65→2.55, eye 1.15, f 1200, hy 850` (very slow push through the hold).
- Staging: R. MAN in front of his seat, `sit-down` (front, 1.8 s) +0–+54, `relieved` → `neutral`; L14 lands as he settles (est +20–+92); the dog lifts its head at +95, sighs (V03) +100–+136, lies back down by +150; hold to the end (~2.5 s after L14).
- Sound: S20 sofa press at +40; `stinger_pizz-tag-ending_01` from the end of "…ตัวเล็กมาก" (est +92); S1 collar jingle at +95; dog sigh +100; room tone fades to zero by +159; no loop seam.

## Dependencies and open items

- **Boss (W5.2):** N1–N21 in the brief (R1.4: N2 loses its slowed variant, N10 loses the muscle icon and mini clock and gains the "?" mark, new N21 leg-length light for shot 13) ([New assets](film-brief.md#new-assets-and-missing-capability-boss-dependencies-w52)); spikes SP2 (truth shot), SP3 (myth camera) and **SP4 (trailer: CAM-TR-SOI, CAM-TR-SKY, skyline plate, grade, silhouette size)** before the full build.
- **Look frame LF04 (W3):** done. LF04 (CAM-TR-SKY, shot 6 +12) and LF04b (graded CAM-MYTH, shot 5 +10) locked by the user 2026-11-09; in `review-rows.json` `looks` (R1.5), B01's beat look is LF04; LF03 stays the look of shot 7 (SH04D). Shot 4 (SH04, CAM-TR-SOI) takes the locked trailer grade (`TRAILER_GRADE`, as in LF04/LF04b) on the LF03 set. Next: W4 voice lock.
- **Ton (parallel to W5):** M1, A1–A3, TR1–TR7 and the NEEDS-GEN SFX in the brief; S21–S23 are new NEEDS-GEN cues for shot 13; S13 and S14 are retired with B03-SH02; listens to `reveal_riser-tension_01`, `stinger_pizz-tag-ending_01`, `whoosh_air-swish-rising_01`, `reveal_warmth-fwoop_01`, `stinger_pizz-shrug_01`, `comedy_shrink-pop-gliss_01`, `foley_soft-landing-tap_01`, `foley_flashlight-click_01` before use (all "not listened").
- **Boat:** R3 recheck conditions applied (R09, B02-SH01 no numbers, shot 14 inset keeps the card); R4 check picture limits applied as R10 (greyed icon stays on screen; the lit leg carries no figure or "ความจริง" label).
- **W4/W5.1:** voice lock, then the timed scene sheets with integer frames, word onsets and per-shot Sound lines. In shot 6 the apex is placed at max(+0, onset("ไม่หรอก") − 15) and any slack goes into the rise, never into the hold.

### Open questions

User-owned, non-blocking (the recommendation applies if unanswered; on the review page):
- Q-F1–Q-F4 answered `ok` on the storyboard page (2026-11-09); unchanged.
- **Q-F5** In the skyline money shot the giant is drawn at its true size (1.80 m long ≈ 20 px against a 100 m tower), carried by a dark silhouette, the ring marker and the dotted trail (recommended: keeps "ตัวเท่าคน" honest; the big read of the flea is in shot 5). Alternative: cheat it about ×4 bigger (reads as a monster, but contradicts the man-sized premise; Boat recheck needed).

## Change log

| Revision | Date | Author | Change |
| --- | --- | --- | --- |
| EDU-EP13-ROWS-R1.0 | 2026-11-09 | Film | First storyboard pass (W2) from script R2 and brief R1: 16 shots, est 57.6 s (1728 f), rules R01–R08, per-shot camera, staging and sound; rows file untimed; open questions Q-F1–Q-F4. |
| EDU-EP13-ROWS-R1.1 | 2026-11-09 | Film | Boat W2 picture recheck: shot 2 crane runs to the cut still rising, counter ticks +24/+32/+40/+48/+56 so ×50 is never held (B-P2), S3/S4 cue frames moved to match; shot 8 gets "ภาพจำลอง" in LBL and R02 lists it (B-P6); shot 11 notes the B-P5 condition. 16 shots, 1728 f est unchanged. |
| EDU-EP13-ROWS-R1.2 | 2026-11-09 | Film | W3 look lock (user, 2026-11-09): rows file gets `looks` LF01–LF03 + flea stills FL1–FL3 (F1, F2, F3 from `out/edu13/look-frames/v5/`) and `look` per beat (B01 LF03, B02 LF02, B03 FL2, B04 FL3, B05 LF01); eyebrow/lede updated; coordinate note points to brief R1.2 offsets (OX 0.50, DS 0.15, SOI marks). Shot IDs, text and timing unchanged. |
| EDU-EP13-ROWS-R1.3 | 2026-11-09 | Film | Script R3 (user-approved 2026-11-09) and Boat R3 recheck: TR01 trailer — S01-B01-SH04 changed (dusk soi, shadow over tiny MAN), new SH04B (graded CAM-MYTH crouch + launch), SH04C (skyline money shot, ≤ 15 f peak hold, tape-stop and droop on "ไม่หรอก"), SH04D (plain soi, drop and knee-high hop under L02); no title card (user); B02 to two shots: SH01 changed (L03 glow + weight dial in one shot), SH03 changed (L05 + L06 over the landing, front-head deadpan instead of the shrug), SH02 and SH04 retired; B04-SH02 changed (frozen trailer inset with the card on "ไม่ใช่ร้อยเมตร", user kept the callback); B03-SH03 camera line now the locked F2 camera (text unchanged in rows); rule R09 (Boat R3 conditions); R01/R02/R06–R08 shot numbers renumbered; sound lines with TR1–TR7. 17 shots, est 1671 f ≈ 55.7 s. Open question Q-F5 (silhouette scale). |
| EDU-EP13-ROWS-R1.4 | 2026-11-09 | Film | Script R4 (user-approved 2026-11-09, chat) and Boat R4 check (pass, no must-fix): **S01-B03-SH02 retired** (L08 removed; ID not reused); S01-B04-SH01 changed (L15 + L16: slingshot icon with "?", "?" off and the icon greys and stays, a light line along the giant's long hind leg, both settle ready; replaces L10); S01-B04-SH02 changed (L11 removed, opens on the matched crouch, greyed icon rides on the giant's back, keys −60 f, callback inset unchanged); S01-B01-SH05 changed (MAN's eyes drop to the hind legs, script V01 cue); S01-B02-SH01, S01-B02-SH03, S01-B03-SH03 changed (new L03/L05/L09 words; keys re-timed); rule R10 (Boat R4 limits); R01/R02/R04/R05/R08/R09 shot numbers renumbered; shots 4–7 marked as R1.3 changes; sound S21–S23 new, S13/S14 retired. 16 shots, est 1561 f ≈ 52.0 s. Rows: 6 shots ask again (SH05, B02-SH01, B02-SH03, B03-SH03, B04-SH01, B04-SH02) plus any R1.3 shot still unanswered; Q-F5 unchanged. |
| EDU-EP13-ROWS-R1.5 | 2026-11-09 | Film | W3 trailer look lock (user, 2026-11-09): rows file gets `looks.LF04` (`out/edu13/look-frames/v6/LF04.png`, shot 6 S01-B01-SH04C apex) and `looks.LF04b` (`out/edu13/look-frames/v7/LF04b.png`, shot 5 S01-B01-SH04B crouch); B01 beat look LF03 → LF04; LF03 kept in `looks` (caption notes it stays for shot 7 SH04D); lede and eyebrow updated. Shots 5 and 6 get a Look line with the locked deviations (trail near-vertical with a slight lean from lower left, card in TC, sky/sun ungraded, flea state `crouch`). Shot IDs, text, sound and timing unchanged (no shot asks again). |
| EDU-EP13-ROWS-R2.0 | 2026-11-09 | Film | W5.1 timing from the W4 voice lock (`measure.json`, slow6 41.14 s): shot list gets the timed ranges (16 shots, **1390 f = 46.33 s**, was 1561 f est); rows file gets `start`/`end`, `untimed: false`, `timingEstimated: false`, eyebrow, lede and facts (length 46.3 s); shot title, VO, seen and sound unchanged on all 16 shots (hash check: identical), so no shot asks again. Timed ranges, keys, the SD01 `hy` changes (feet out of the caption band) and Ton cue lengths live in [scene-sheets.md](scene-sheets.md) EDU-EP13-SHEETS-R2.0; the per-shot staging blocks here stay as the R1.5 estimate. |
| EDU-EP13-ROWS-R2.1 | 2026-11-09 | Film | Re-time for the R5 voice re-lock (Take B, `measure.json` `r5b_B_slow10`): shot-list ranges from SHEETS-R2.1 (16 shots, **1542 f = 51.40 s**, was 1390 f). Rows: `start`/`end` per shot; B02-SH01 VO R5 + label "แรงดีด ↑", B02-SH03 VO R5, B05-SH02 sound (pizzicato tag dropped, felt-mallet vibraphone note S24); those three hashes change, 13 unchanged; lede and facts updated. build.py exit 0. Review page: pending. |
