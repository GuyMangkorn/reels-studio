# Storyboard — EDU-EP13-SHORT (storyboard pass, untimed rows)

Revision: **EDU-EP13-ROWS-R1.3** (Film, 2026-11-09, W2 update for script R3: TR01 sci-fi trailer in B01 (SH04 changed, SH04B–SH04D new), B02 cut to two shots (SH01 and SH03 changed, SH02 and SH04 retired), V02 trailer callback inset in B04-SH02; R1.2 added the locked look frames; rows untimed on the review page, estimated frames here for planning only).
Inputs: [script.md](script.md) **EDU-EP13-SCRIPT-R3** (user-approved 2026-11-09, chat), [fact-check.md](fact-check.md) W1.3 + R2 recheck + **R3 recheck** (pass, no wording FIX; four picture limits, applied as R09), [film-brief.md](film-brief.md) **EDU-EP13-BRIEF-R1.3** (decisions VD01–VD31, sets, cameras, assets N1–N20, sound codes M1, A1–A3, S1–S20, TR1–TR7).
Rows file: [review-rows.json](review-rows.json) EDU-EP13-ROWS-R1.3 (`"untimed": true`; `looks` LF01–LF03, FL1–FL3; LF04 trailer look still to paint). Review page: pending (coordinator publishes).

**R1.2 coordinate note:** room numbers per shot below are the pre-lock plan. Read them with the brief's [R1.2 offsets](film-brief.md#look-lock-r12): in `R`, chart-group positions and chart-camera target x + 0.50 (OX), sofa-group positions + 0.15 (DS), CAM-SOFA unchanged. Street numbers in shots 4–7 are already the locked SET-SOI marks (MAN (0.20, 0, 0), giant (1.50, 0, −0.60)). The W5.1 timed scene sheets carry the shifted numbers.

## Status

- **Readiness: `ready-for-dev` for the storyboard review only** (camera, staging, VO and sound per shot, for the user's verdicts on the review page). Not ready for production: timing is estimated (W4 voice lock, then the W5.1 timed scene sheets); the trailer look (LF04), the skyline plate, the trailer grade, the flea silhouette and most motions are missing (Boss N2–N20); no trailer frame has been painted or viewed.
- Readiness is not approval: this pass adds no approval and proves no runtime or visual result.

## Units and conventions

- 30 fps; frames are global and half-open `[start, end)`; seconds `est` from the script R3 N1 syllable counts × 0.237 s with 0.28 s gaps (method in the brief header). Plan: **17 shots, 1671 f ≈ 55.7 s** (range 53–59 s; R1.2 was 16 shots, 1728 f ≈ 57.6 s).
- Spaces and axes: `R` room (m), `M` macro studio (mm), `D` insert studio (m), `S` street and skyline (m), as in the brief's projection contract and set plans (+x screen-right from the main camera side, +y up, +z toward the camera; in `S`, −z toward the tower). Camera lines use the kit form `cam: target (x, y, z), yaw, r, eye, f, hy` (hy = picture row of the target; yaw positive = camera swung toward +x).
- Frame zones: caption band y 1176–1344; faces, feet contact, band, marks and labels above y 1160 (except the street back views, brief VD11/VD28/VD30); label slot LBL (816–1020, 148–204); trailer card slot TC (centred, rows 1010–1100, est); `@TamMaiLa` top-left (x < 330, y < 140 kept clear).
- Lead sizes are computed (px/m = f / distance), not rendered.
- `changed` in a heading marks a shot whose text changed in R1.3 (the review page asks again).

## Casting

| Role | Casting line | Notes |
| --- | --- | --- |
| MAN | `man-parted + home-lounge (outfit override: cardigan off), P31, neutral` | 1.80 m; poses through the episode: P31 seated → P02 thinking → P30 (back view, street) → `gasp-recoil` → `new: standing-jump` (P35 crouch body) → P09 smug → `sit-down` (front); faces neutral → shock → neutral → smug → relieved. R1.3: the P06 shrug shot is gone; B02-SH03 ends on a front head swap instead |
| DOG | `dog-golden, lie, idle` + kit `lid: 1` (eyes shut); end `new: dog-head-lift-sigh` | 0.58 m; only on the sofa, only in CAM-SOFA; never scratching (FIX-5); never in the street or trailer |
| FLEA (macro) | `new: flea`, right profile, 2.0 mm, `new: flea-catapult-jump` | only on the paper studio, "ภาพจำลอง"; never in a trailer frame (Boat R3 condition 4) |
| FLEA (giant) | `new: flea`, right profile, 1.80 m long (VD05), `new: flea-muscle-jump`, grow/shrink clock; `new: flea silhouette` (dark fill + warm rim) in the trailer | front head once (V01); never in a frame with the dog |
| GHOST | MAN's figure at 40 %, no glow, no pack | B02-SH03 only |

## Shot list

| # | Shot | Lines | Start s (est) | Len s | Frames (est) | Camera | One-line read |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | S01-B01-SH01 | L01 a | 0.00 | 1.40 | [0, 42) | CAM-SOFA | Sunlit room, MAN on the sofa, dog asleep, chart on the wall |
| 2 | S01-B01-SH02 | L01 b | 1.40 | 2.00 | [42, 102) | CAM-MACRO → crane | Paper studio: flea, "2 มม.", vanishes up; counter ×10 … ×50 |
| 3 | S01-B01-SH03 | L01 c | 3.40 | 1.40 | [102, 144) | CAM-CHART-2S (fixed) | A dot grows into a person-length flea beside thinking MAN |
| 4 | S01-B01-SH04 **changed** | L01 d (TR01) | 4.80 | 1.00 | [144, 174) | CAM-TR-SOI | Trailer: dusk soi, a long shadow sweeps over tiny MAN; he looks up |
| 5 | S01-B01-SH04B **new** | L01 tail (TR01) | 5.80 | 0.90 | [174, 201) | CAM-MYTH (trailer grade) | Trailer: the giant crouched beside MAN, legs folded; launch |
| 6 | S01-B01-SH04C **new** | TR01, L02 "ไม่หรอก" | 6.70 | 1.50 | [201, 246) | CAM-TR-SKY (locked) | Trailer money shot: silhouette arcs over the tower against the skyline; tape-stop, droop |
| 7 | S01-B01-SH04D **new** | L02 | 8.20 | 3.60 | [246, 354) | CAM-MYTH (plain) | Plain afternoon soi: the flea drops back, one knee-high hop beside MAN |
| 8 | S01-B01-SH05 | V01 | 11.80 | 1.40 | [354, 396) | CAM-CHART-2S + push | MAN sees it: "เฮ้ย… ตัวเท่าเราเลย!"; flea looks at us |
| 9 | S01-B02-SH01 **changed** | L03 | 13.20 | 4.00 | [396, 516) | CAM-FLEA-LEGS | Leg glow swells "แรง ↑", then a weight dial swings up in step |
| 10 | S01-B02-SH03 **changed** | L05, L06 | 17.20 | 6.40 | [516, 708) | CAM-INSERT | Studio: MAN ×2 legs, ×2 backpack, hops with his ghost to one line; refrain over the landing |
| 11 | S01-B03-SH01 | L07 | 23.60 | 3.10 | [708, 801) | CAM-MACRO | Studio: real flea, legs folded |
| 12 | S01-B03-SH02 | L08 | 26.70 | 3.40 | [801, 903) | CAM-MACRO-LEG | Slow motion: leg pushes, muscle lags a mini clock |
| 13 | S01-B03-SH03 | L09 | 30.10 | 4.30 | [903, 1032) | CAM-MACRO-THORAX | See-through pad squeezes, locks, snaps; gone; slingshot icon |
| 14 | S01-B04-SH01 | L10 | 34.40 | 3.90 | [1032, 1149) | CAM-CHART-2S | The giant's slingshot icon fades to grey |
| 15 | S01-B04-SH02 **changed** | L11, V02, L12 | 38.30 | 6.80 | [1149, 1353) | CAM-TRUTH (locked) | Matched crouch, jump, apex freeze in the band, tag, thud; frozen trailer inset on "ไม่ใช่ร้อยเมตร" |
| 16 | S01-B05-SH01 | L13 | 45.10 | 5.30 | [1353, 1512) | CAM-CHART-LOW | Giant shrinks away; flea mark low, MAN's mark higher; smug |
| 17 | S01-B05-SH02 | L14, V03, hold | 50.40 | 5.30 | [1512, 1671) | CAM-SOFA | MAN back on the sofa; dog lifts head, sighs; hold |

Retired in R1.3 (IDs not reused): **S01-B02-SH02** (L04 weight dial; L04 removed, the dial moved into B02-SH01) and **S01-B02-SH04** (L06 shrug; L06 now plays over the B02-SH03 landing).

## Rules for every shot

- **R01 Dog (FIX-5).** The dog appears only in shots 1 and 17, resting or asleep; never scratching, never with any flea in frame. Every giant-flea room shot frames x ≤ 2.45 pre-shift (2.95 shifted) at the actors' plane (brief SET-LR13 dog-free zone). No dog in the street or trailer.
- **R02 Macro (FIX-5, FIX-4).** The real-size flea appears only on the paper studio (shots 2, 11, 12, 13) with "ภาพจำลอง" in LBL (shot 12: "ภาพช้า · ภาพจำลอง"). The ghost-hop insert (shot 10) also carries "ภาพจำลอง" in LBL (Boat B-P6). No skin, fur, bite, itch, sofa or floor under it.
- **R03 No digits.** On-screen text is exactly brief VD24; the chart and the marks carry no numerals; the clock icon and the weight dial have no digits; the trailer has no floor count, metre figure or counter.
- **R04 Same order, not equal.** In shot 15 the band is broad (0.10–0.50 m) and the giant peaks a little below MAN; the tag says "สูงพอ ๆ กัน" only (Boat N4 e).
- **R05 One plane, locked camera.** Shot 15: MAN and the giant on z 0.35, the camera does not move; the trailer inset is a screen layer and moves nothing in the world.
- **R06 Size reference.** Every shot keeps one size reference in frame: MAN and the chart (room), the bar then the counter (macro), MAN + ghost + chart strip (insert), MAN (street shots 4, 5, 7), the tower's 3.3 m storey bands (skyline shot 6).
- **R07 Screen.** Faces and contacts above y 1160 (street back views in shots 4, 5, 7 excepted); each label in its own slot; captions = VO.
- **R08 Continuity.** MAN: sofa (1) → chart (3, 8–9, 14–15) → imagined street (4–7, same P30 back view and marks) → chart side (16) → sofa (17); the giant's anchors identical in every chart shot and in shots 5 and 7; the slingshot icon identical in 13 and 14; room light constant; the trailer grade only in shots 4–6 and inside the shot-15 inset.
- **R09 Trailer (Boat R3 recheck, binding).** (1) The card "ถ้าคิดแบบง่าย ๆ" is on screen in TC from shot 4 +0 until the flea leaves the frame in shot 6 (+42), and inside the shot-15 inset. (2) No spoken or on-screen floor count, metre figure or counter digits. (3) No damage, cracks, debris, crowd, panic, sirens, screams or news-style sound; the trailer bed is labelled fiction in the cue sheet. (4) The real macro flea and its "ภาพจำลอง" label never share a trailer frame. (5) Peak hold ≤ 15 f (0.5 s) with the card showing, no dotted-arc end marker, no "ผล" label, no apex tick; "ไม่หรอก" breaks it on its first frame. (6) No title card (user decision).

## Per-shot staging

Values `est`; frames global; key frames shot-local `+n`. Sound lines give the shot-local frame and the brief's code or library ID (brief [Sound direction](film-brief.md#sound-direction)).

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

**4. S01-B01-SH04 — changed** [144, 174). L01 "…จะกระโดดข้ามตึก…" (TR01 opens on the cut).
- Camera: CAM-TR-SOI `cam: target (1.0, 8.0, −30), yaw 0, r 46, eye 1.6, pitch +8, f 1100, hy 900` (camera down the soi behind MAN at about z +16; MAN ≈ 69 px/m → **124 px, tiny**; the tower cropped by the top edge, looming; est, SP4 computes). Slow creep r 46 → 45.
- Staging: S, **trailer grade** (VD26: dusk sky, amber low sun behind the tower, teal haze, warm rims, grain + vignette on this plate only). MAN back view at (0.20, 0, 0), P30 visor_look_far; shophouses both sides, textless; nobody else in the soi.
- Key frames: +0 card "ถ้าคิดแบบง่าย ๆ" fades in in TC over 4 f (trailer type); **+6–+24 a long soft shadow** (the giant's silhouette stretched about ×3 by the low sun) sweeps down the road toward the lens and passes over MAN (+16); +16 MAN's head tilts up; cut at +30.
- Sound: M1 out; **TR1 braam at +0** (fictional trailer bed starts); soi ambience drops to 30 % with A3 high wind; TR2 shadow pass +6–+24; `reveal_riser-tension_01` (its last 1.6 s) runs from +0 toward its dead stop on the launch (shot 5 +18).

**5. S01-B01-SH04B — new** [174, 201). L01 "…ได้มั้ย" (tail; TR01).
- Camera: CAM-MYTH with the locked LF03 values `cam: target (1.0, 1.4, 0), yaw −6, r 2.6, eye 0.45, pitch +30, f 820` (no push; the composition the user locked, regraded).
- Staging: S, trailer grade (the sky behind the tower dusk, the giant and MAN rim-lit, near-silhouette). MAN back view at (0.20, 0, 0), P30; the giant `right` profile at feet (1.50, 0, −0.60) in `new: flea-muscle-jump` fold (CL02 echo). Card on in TC.
- Key frames: +0–+16 the hind legs fold deeper (crouch); **+18 launch** (body leaves the frame top by +22, smear streak, a small grit swirl at its feet, no crack or debris); +18–+27 MAN's head tilts up after it; cut at +27.
- Sound: TR3 drum pulse, 4 hits accelerating +0–+16; riser stops dead at +18; **TR4 launch whoosh-boom at +18**; A3 wind continues.

**6. S01-B01-SH04C — new** [201, 246). TR01 money shot; L02 "ไม่หรอก…" from +21 (est 7.40 s).
- Camera: CAM-TR-SKY **locked** `cam: target (10, 70, −60), yaw −9, r 327, eye 25, pitch +8, f 3600, hy 820` (long lens from a far rooftop: ≈ 11 px/m; tower 100 m ≈ 1100 px, top row ≈ 490; arc apex 130 m ≈ row 160; skyline silhouettes rise from row ≈ 1120 behind the caption band; est, SP4 computes).
- Staging: S + skyline plate (VD29). The tower centred against a low amber sun disc and dusk bands; the far skyline (textless towers, haze-faded) both sides. The giant as `new: flea silhouette` at **true scale (1.80 m ≈ 20 px)** inside the LF03 ring marker, a short dotted trail behind it. Card on in TC.
- Key frames: +0 the silhouette enters low right, rising along the arc; **+12 apex** above the roof (no end marker, no tick); **+12–+21 hold (9 f ≤ 15 f)**; **+21 "ไม่หรอก": tape-stop** (picture decelerates to a stop over 6 f, the whole frame sags 2 % and the grade drains to flat grey); +27–+42 a short droop arc drops the silhouette down out of the frame bottom (dotted trail fades with it); **+42 card off**; cut at +45.
- Sound: TR5 wind rush +0–+12; near-silence +12–+21 (thin high air only); **TR6 tape-stop at +21** kills the trailer bed; S7 slide-whistle droop +27–+42; NAR on top.

**7. S01-B01-SH04D — new** [246, 354). L02 "…มันน่าจะกระโดดได้แค่หลักสิบเซน… พอ ๆ กับคุณนี่แหละ".
- Camera: CAM-MYTH plain (the LF03 look, afternoon, no grade) `cam: target (1.0, 1.4, 0), yaw −6→−3, r 2.6→2.45, eye 0.45, pitch +30, f 820` (slow push).
- Staging: S. MAN back view at (0.20, 0, 0), P30; the giant `right` profile drops into its mark (1.50, 0, −0.60) from about y 3 over +0–+6 and lands, a little deflated (antennae droop); no arc, no card.
- Key frames: +0–+6 drop and land; on "หลักสิบเซน" (est +30) **one small hop** 0.36 m (knee height; 18 f airtime +30–+48, `new: flea-muscle-jump` small amplitude); on "พอ ๆ กับคุณ" (est +69) MAN's head tips down and turns toward it.
- Sound: soi ambience back at full (`city_soi-afternoon-day_01`) + A3 breeze; `foley_soft-landing-tap_01` at +6 (drop landing) and tiny at +48 (hop landing); M1 re-enters at +10, energy 1.

**8. S01-B01-SH05** [354, 396). V01 "เฮ้ย… ตัวเท่าเราเลย!".
- Camera: CAM-CHART-2S as shot 3, then a comic push r 6.6 → 5.8 over +6–+14 (hy adjusted so the floor stays ≤ y 1160; scene sheet computes).
- Staging: R. MAN `turn-head-right` +0–+6, then `gasp-recoil` with `shock` +6–+20, V01 lip-sync; the giant swaps to its `front` head at +10 and looks at the lens to +22, then back to profile.
- Sound: room tone back at +0; M1 half-beat dropout +0–+12; S8 flinch sting at +8; V01 +4–+33.

**9. S01-B02-SH01 — changed** [396, 516). L03 "สมมติมันโตทั้งตัว… ขาแรงขึ้น ตัวก็หนักขึ้นตาม".
- Camera: CAM-FLEA-LEGS `cam: target (1.20, 0.55, 0.35), yaw 6→10, r 3.4→3.1, eye 0.9, f 1500, hy 860` (flea 795 → 870 px long; MAN's shoulder at the left edge).
- Staging: R. The giant at rest; coral glow on the hind-leg muscle 0 → 1 from "ขาแรงขึ้น" (est +40) to the end; "แรง ↑" arrow beside the leg at +48; on "ตัวก็หนักขึ้นตาม" (est +75) the round weight-dial icon (no numerals) pops in above the flea's back (≈ row 507) and its needle swings up **in step with the still-rising glow** +75–+112; a small down-arrow under the body. Glow and dial carry no digits, no "×" and no equal-size bars (Boat R3).
- Sound: M1 back at energy 2 (lighter); S9 fwoop at +40; S10 floor groan +78–+110.

**10. S01-B02-SH03 — changed** [516, 708). L05 "เหมือนขาคุณแรงขึ้นสองเท่า… แต่แบกเป้หนักขึ้นสองเท่า", then L06 "ตัวใหญ่ขึ้น… กระโดดไม่ได้สูงขึ้นตาม" over the landing.
- Camera: CAM-INSERT `cam: target (0, 0.95, 0), yaw 0→3, r 2.9→2.7, eye 1.0, f 1300, hy 690` (MAN 865 px; floor ≈ y 1147).
- Staging: D (paper studio, metres). MAN `right` profile at (−0.40, 0, 0); ghost `right` profile at (+0.40, 0, 0), 40 %; chart strip at (0, 0, −0.30). "ภาพจำลอง" in LBL +0 to the end (Boat B-P6).
- Key frames: +4 coral glow on MAN's legs + "×2" tag; on "แบกเป้" (est +55) the backpack drops onto his shoulders + "×2" tag; +88–+94 both crouch; **+94 both take off** (0.20 m, 12 f), dashed line at the apex feet row +100; **+106 both land** on one frame; L06 from about +115 over the held landing (both straighten, the dashed line stays); on "ไม่ได้สูงขึ้นตาม" (est +150) the dashed line pulses once and MAN swaps to his `front` head, deadpan to the lens, to the end.
- Sound: A2 studio hush; S11 backpack thump at +55; `whoosh_fast-slide_01` at +94; `foley_soft-landing-tap_01` at +106 (quieter than B04's thud); S12 pluck at +150.

**11. S01-B03-SH01** [708, 801). L07 "แต่… แล้วหมัดตัวจิ๋ว กระโดดเก่งได้ยังไง".
- Camera: CAM-MACRO `cam: target (0, 0.45, 0) mm, yaw 0→4, r 4.0→3.6, eye 0.5, f 1200, hy 900` (slow push).
- Staging: M. The real flea at rest, legs folded; "2 มม." bar; "ภาพจำลอง" in LBL.
- Sound: A2 hush (room tone out); M1 thins, energy 1.5.

**12. S01-B03-SH02** [801, 903). L08 "ขามันสั้น ดันพื้นเสร็จในพริบตา… กล้ามหดไม่ทัน".
- Camera: CAM-MACRO-LEG `cam: target (−0.45, 0.35, 0) mm, yaw 4→6, r 2.4→2.1, eye 0.35, f 1200, hy 880`.
- Staging: M. "ภาพช้า · ภาพจำลอง" in LBL; the muscle icon sits only on the flea leg (Boat B-P5), no caption/sound says "muscle is slow". The hind leg extends slowly (push at 1/3 speed) +10–+70; the mini clock icon's hand whips round +10–+70; the muscle icon contracts only halfway by +70, when the leg is already straight ("กล้ามหดไม่ทัน", est +75).
- Sound: M1 a held pad; S13 slowed creak +10–+70; S14 fast tick run +10–+70.

**13. S01-B03-SH03** [903, 1032). L09 "มันเลยบีบแผ่นยางยืดในตัวไว้… แล้วปล่อยทีเดียว เหมือนหนังสติ๊ก".
- Camera: CAM-MACRO-THORAX from the locked F2 still: `cam: target (0, 0.55, 0) mm, yaw 0, r 2.9→2.7, eye 0.55, f 1200, hy 900` (brief R1.2 look lock).
- Staging: M. "ภาพจำลอง" in LBL. Body goes translucent +0–+8; on "บีบ" (est +10) the amber pad squeezes (scale-y 1 → 0.7) to +40; catch icon clicks shut at +42; hold to +62; on "ปล่อย" (est +62) **release: the flea is gone in one frame** (+63), smear streak up, pad glow fading in the air +63–+80; on "หนังสติ๊ก" (est +105) the slingshot icon pops in beside the empty spot.
- Sound: S15 squeeze +10–+40, lock click at +42; **S16 snap at +63** + whip at +63; music stops dead at +63, A2 hush only to the end.

**14. S01-B04-SH01** [1032, 1149). L10 "ตามแบบจำลอง… ตัวใหญ่ไม่ต้องพึ่งหนังสติ๊กเท่าตัวเล็ก".
- Camera: CAM-CHART-2S `cam: target (0.95, 1.00, 0.35), yaw 0→−3, r 6.6→6.3, eye 1.15, f 2400, hy 770`.
- Staging: R. The same slingshot icon appears beside the giant's thorax in colour at +4; the giant glances at it (+20); on "ไม่ต้องพึ่ง" (est +55) the icon fades to grey over 15 f and **stays**; MAN glances at the giant (+70).
- Sound: room tone back; M1 resumes, energy 2.5.

**15. S01-B04-SH02 — changed** [1149, 1353). L11 "ย่อตัว แล้วใช้กล้ามดันแบบคุณ ก็ได้", V02 "ฮึบ!", L12 "สูงพอ ๆ กัน… แค่หลักสิบเซน ไม่ใช่ร้อยเมตร".
- Camera: CAM-TRUTH **locked** `cam: target (0.95, 1.00, 0.35), yaw 0, r 10.0, eye 1.0, f 3600, hy 790` (no move: measurement).
- Staging: R, both on z 0.35. MAN `front` at (0, 0, 0.35), 648 px (x ≈ 108–288); giant `right` profile at (1.35, 0, 0.35) (x ≈ 360–1008); floor row 1150.
- Key frames: L11 +0–+63; **crouch +60–+68** (both; MAN standing-jump crouch, giant legs fold); **take-off +68** with V02; apex **+77** (MAN feet ≈ y 999 at 0.42 m, giant ≈ y 1020 at 0.36 m); **freeze +77–+104** (27 f): band 0.10–0.50 m (rows 970–1114) fades in +78–+84 with "หลักสิบเซน" at its left end, tag "สูงพอ ๆ กัน" (y 190–300) with a leader to the band +84; resume +104, **landing +113** (both on one frame); **trailer callback (VD31): on "ไม่ใช่" (est +148) an inset pops in upper right (x ≈ 600–1040, rows ≈ 340–600, est; beside, never on, the band; clear of the tag, MAN's head and the giant): the shot-6 apex frame, frozen in its tape-stopped grey, with the card "ถ้าคิดแบบง่าย ๆ" inside, no ruler, no number; it snaps off at +182 at the end of "ร้อยเมตร"**; band and tag fade +180–+195; both straighten, MAN glances at the giant.
- Sound: S17 crouch pair at +60; S18 jump pair + V02 at +68; **silence +77–+104** (music and room tone out, NAR only); S19 landing thud at +113, room tone back; M1 back at energy 2 from +113; **TR7 braam echo** (TR1 low-passed, far, −18 dB) +148, cut dead at +182 with a pitched-down `ui_click-tick_01` as the inset snaps off.

**16. S01-B05-SH01** [1353, 1512). L13 "แต่ถ้าวัดเป็นเซน… ปกติ คุณก็กระโดดสูงกว่าหมัดตัวจริงอีกนะ".
- Camera: CAM-CHART-LOW `cam: target (0.05, 0.85, 0.30), yaw −8→−4, r 2.75→2.60, eye 1.0, f 1400, hy 700` (≈ 509 → 538 px/m).
- Staging: R. Opens on the giant shrinking away about its feet +0–+12 (sparkle fades by +20; no flea remains); MAN at (0.45, 0, 0.30) `front` beside the chart (chart at screen left of him).
- Key frames: on "เซน" (est +30) the flea mark (line + tiny flea icon) ticks on at 0.15 m (row ≈ 1076); +55 MAN's mark (line + tiny man icon) at 0.42 m (row ≈ 931); MAN glances down at both +60–+90; on "สูงกว่า" (est +110) P09 hands on hips, `smug` to the lens.
- Sound: S20 shrink pop at +0; S20 ticks at +30 (high) and +55 (low); M1 warm, energy 2.

**17. S01-B05-SH02** [1512, 1671). L14 "หมัดดูเก่ง… ก็เพราะตัวมันเล็กมาก", V03, hold.
- Camera: CAM-SOFA `cam: target (3.30, 0.70, 0.55), yaw 37→35, r 2.65→2.55, eye 1.15, f 1200, hy 850` (very slow push through the hold).
- Staging: R. MAN in front of his seat, `sit-down` (front, 1.8 s) +0–+54, `relieved` → `neutral`; L14 lands as he settles (est +20–+92); the dog lifts its head at +95, sighs (V03) +100–+136, lies back down by +150; hold to the end (~2.5 s after L14).
- Sound: S20 sofa press at +40; `stinger_pizz-tag-ending_01` from the end of "…ตัวเล็กมาก" (est +92); S1 collar jingle at +95; dog sigh +100; room tone fades to zero by +159; no loop seam.

## Dependencies and open items

- **Boss (W5.2):** N1–N20 in the brief ([New assets](film-brief.md#new-assets-and-missing-capability-boss-dependencies-w52)); spikes SP2 (truth shot), SP3 (myth camera) and **SP4 (trailer: CAM-TR-SOI, CAM-TR-SKY, skyline plate, grade, silhouette size)** before the full build.
- **Look frame LF04 (W3, before W5):** the trailer look (CAM-TR-SKY at shot 6 +12, plus the graded CAM-MYTH at shot 5 +10 as LF04b) for the user's look check; added to `review-rows.json` `looks` when painted, and B01's beat look moves to it.
- **Ton (parallel to W5):** M1, A1–A3, TR1–TR7 and the NEEDS-GEN SFX in the brief; listens to `reveal_riser-tension_01`, `stinger_pizz-tag-ending_01`, `whoosh_air-swish-rising_01`, `reveal_warmth-fwoop_01`, `stinger_pizz-shrug_01`, `comedy_shrink-pop-gliss_01`, `foley_soft-landing-tap_01`, `foley_flashlight-click_01` before use (all "not listened").
- **Boat:** R3 recheck conditions applied (R09, B02-SH01 no numbers, shot 15 inset keeps the card).
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
