# Storyboard — EDU-EP13-SHORT (first pass, untimed rows)

Revision: **EDU-EP13-ROWS-R1.1** (Film, 2026-11-09, W2: first storyboard pass + Boat W2 picture recheck fixes B-P2, B-P6; rows untimed on the review page, estimated frames here for planning only).
Inputs: [script.md](script.md) EDU-EP13-SCRIPT-R2 (user-approved 2026-11-09), [fact-check.md](fact-check.md) W1.3 + R2 recheck (FIX-1 to FIX-5, dog ruling, N4 e), [film-brief.md](film-brief.md) **EDU-EP13-BRIEF-R1.1** (decisions VD01–VD25, sets, cameras, slots, assets N1–N14, sound codes M1, A1–A3, S1–S20).
Rows file: [review-rows.json](review-rows.json) EDU-EP13-ROWS-R1.1 (`"untimed": true`). Review page: pending (coordinator publishes).

## Status

- **Readiness: `ready-for-dev` for the storyboard review only** (camera, staging and VO per shot, for the user's verdicts on the review page). Not ready for production: timing is estimated (W4 voice lock, then the W5.1 timed scene sheets), sets, the flea and most motions are missing (Boss N1–N14), and no frame has been painted or viewed (look frames LF01–LF03 and the flea stills come at W3).
- Readiness is not approval: this pass adds no approval and proves no runtime or visual result.

## Units and conventions

- 30 fps; frames are global and half-open `[start, end)`; seconds `est` from the script's N1 syllable counts × 0.237 s with 0.28 s gaps (method in the brief header). Plan: **16 shots, 1728 f ≈ 57.6 s** (range 53–60 s).
- Spaces and axes: `R` room (m), `M` macro studio (mm), `D` insert studio (m), `S` street (m), as in the brief's projection contract and set plans (+x screen-right from the main camera side, +y up, +z toward the camera; in `S`, −z toward the tower). Camera lines use the kit form `cam: target (x, y, z), yaw, r, eye, f, hy` (hy = picture row of the target; yaw positive = camera swung toward +x).
- Frame zones: caption band y 1176–1344; faces, feet contact, band, marks and labels above y 1160 (except the myth shot's back view, brief VD11); label slot LBL (816–1020, 148–204); `@TamMaiLa` top-left (x < 330, y < 140 kept clear).
- Lead sizes are computed (px/m = f / distance), not rendered.

## Casting

| Role | Casting line | Notes |
| --- | --- | --- |
| MAN | `man-parted + home-lounge (outfit override: cardigan off), P31, neutral` | 1.80 m; poses through the episode: P31 seated → P02 thinking → P30 (back view) → `gasp-recoil` → P06 shrug → `new: standing-jump` (P35 crouch body) → P09 smug → `sit-down` (front); faces neutral → shock → neutral → smug → relieved |
| DOG | `dog-golden, lie, idle` + `new: dog eyes shut`; end `new: dog-head-lift-sigh` | 0.58 m; only on the sofa, only in CAM-SOFA; never scratching (FIX-5) |
| FLEA (macro) | `new: flea`, right profile, 2.0 mm, `new: flea-catapult-jump` | only on the paper studio, "ภาพจำลอง" |
| FLEA (giant) | `new: flea`, right profile, 1.80 m long (VD05), `new: flea-muscle-jump`, grow/shrink clock | front head once (V01); never in a frame with the dog |
| GHOST | MAN's figure at 40 %, no glow, no pack | B02-SH03 only |

## Shot list

| # | Shot | Lines | Start s (est) | Len s | Frames (est) | Camera | One-line read |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | S01-B01-SH01 | L01 a | 0.00 | 1.40 | [0, 42) | CAM-SOFA | Sunlit room, MAN on the sofa, dog asleep, chart on the wall |
| 2 | S01-B01-SH02 | L01 b | 1.40 | 2.00 | [42, 102) | CAM-MACRO → crane | Paper studio: flea, "2 มม.", vanishes up; counter ×10 … ×50 |
| 3 | S01-B01-SH03 | L01 c | 3.40 | 1.40 | [102, 144) | CAM-CHART-2S (fixed) | A dot grows into a person-length flea beside thinking MAN |
| 4 | S01-B01-SH04 | L01 d, L02 | 4.80 | 5.70 | [144, 315) | CAM-MYTH | Soi and tower; dotted arc over the roof; droops on "ไม่หรอก"; a small hop |
| 5 | S01-B01-SH05 | V01 | 10.50 | 1.10 | [315, 348) | CAM-CHART-2S + push | MAN sees it: "เฮ้ย… ตัวเท่าเราเลย!"; flea looks at us |
| 6 | S01-B02-SH01 | L03 | 11.60 | 4.80 | [348, 492) | CAM-FLEA-LEGS | Hind-leg glow swells, "แรง ↑" |
| 7 | S01-B02-SH02 | L04 | 16.40 | 2.00 | [492, 552) | CAM-CHART-2S | Weight dial swings up in step; floor groans |
| 8 | S01-B02-SH03 | L05 | 18.40 | 4.20 | [552, 678) | CAM-INSERT | Studio: MAN ×2 legs, ×2 backpack, hops with his ghost to one line |
| 9 | S01-B02-SH04 | L06 | 22.60 | 2.90 | [678, 765) | CAM-CHART-2S | MAN shrugs beside the giant |
| 10 | S01-B03-SH01 | L07 | 25.50 | 3.10 | [765, 858) | CAM-MACRO | Studio: real flea, legs folded |
| 11 | S01-B03-SH02 | L08 | 28.60 | 3.40 | [858, 960) | CAM-MACRO-LEG | Slow motion: leg pushes, muscle lags a mini clock |
| 12 | S01-B03-SH03 | L09 | 32.00 | 4.30 | [960, 1089) | CAM-MACRO-THORAX | See-through pad squeezes, locks, snaps; gone; slingshot icon |
| 13 | S01-B04-SH01 | L10 | 36.30 | 3.90 | [1089, 1206) | CAM-CHART-2S | The giant's slingshot icon fades to grey |
| 14 | S01-B04-SH02 | L11, V02, L12 | 40.20 | 6.80 | [1206, 1410) | CAM-TRUTH (locked) | Matched crouch, jump, apex freeze in the band, tag, thud |
| 15 | S01-B05-SH01 | L13 | 47.00 | 5.30 | [1410, 1569) | CAM-CHART-LOW | Giant shrinks away; flea mark low, MAN's mark higher; smug |
| 16 | S01-B05-SH02 | L14, V03, hold | 52.30 | 5.30 | [1569, 1728) | CAM-SOFA | MAN back on the sofa; dog lifts head, sighs; hold |

## Rules for every shot

- **R01 Dog (FIX-5).** The dog appears only in shots 1 and 16, resting or asleep; never scratching, never with any flea in frame. Every giant-flea shot frames x ≤ 2.45 at the actors' plane (brief SET-LR13 dog-free zone).
- **R02 Macro (FIX-5, FIX-4).** The real-size flea appears only on the paper studio (shots 2, 10, 11, 12) with "ภาพจำลอง" in LBL (shot 11: "ภาพช้า · ภาพจำลอง"). The ghost-hop insert (shot 8) also carries "ภาพจำลอง" in LBL (Boat B-P6). No skin, fur, bite, itch, sofa or floor under it.
- **R03 No digits.** On-screen text is exactly brief VD24; the chart and the marks carry no numerals; the clock icon has no digits.
- **R04 Same order, not equal.** In shot 14 the band is broad (0.10–0.50 m) and the giant peaks a little below MAN; the tag says "สูงพอ ๆ กัน" only (Boat N4 e).
- **R05 One plane, locked camera.** Shot 14: MAN and the giant on z 0.35, the camera does not move.
- **R06 Size reference.** Every shot keeps one size reference in frame: MAN and the chart (room), the bar then the counter (macro), MAN + ghost + chart strip (insert), MAN and the tower (street).
- **R07 Screen.** Faces and contacts above y 1160 (shot 4's back view excepted); each label in its own slot; captions = VO.
- **R08 Continuity.** MAN: sofa (1) → chart (3–9, 13–14) → chart side (15) → sofa (16); the giant's anchors identical in every chart shot; the slingshot icon identical in 12 and 13; light constant.

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
- Sound: room tone back at +0; S5 grow glissando +4–+40; M1 lifts to energy 3.

**4. S01-B01-SH04** [144, 315). L01 "…จะกระโดดข้ามตึกได้มั้ย", then L02 "ไม่หรอก… มันน่าจะกระโดดได้แค่หลักสิบเซน… พอ ๆ กับคุณนี่แหละ".
- Camera: CAM-MYTH `cam: target (1.0, 1.4, 0), yaw −6→−3, r 2.6→2.45, eye 0.45, pitch +30, f 820` (hy so the tower top sits ≈ y 260, ≥ 80 px below the top).
- Staging: S. MAN back view at (0, 0, 0), P30 looking up; the giant `right` profile at (1.70, 0, 0.20). Tower 100 m at (10, 0, −60), shophouses textless.
- Key frames: the dotted arc draws from the flea's head +2–+40 over "ข้ามตึกได้มั้ย" (apex ≈ 130 m over the roof) with a ring marker riding it; label "ถ้าคิดแบบง่าย ๆ" beside its rising half from +6; **on "ไม่หรอก" (est +50)** the far arc fades and a short droop arc falls back to the street by the flea (+50–+70); label off at +75; on "หลักสิบเซน" (est +95) the ring marker makes one small hop about knee height beside MAN (+95–+113); on "พอ ๆ กับคุณ" (est +125) MAN's head tips down to it.
- Sound: soi ambience full + A3 breeze; S6 swell +2–+46; S7 droop +50–+74 (lands on "ไม่หรอก"); `foley_soft-landing-tap_01` tiny at +113; M1 drops to energy 1 after the droop.

**5. S01-B01-SH05** [315, 348). V01 "เฮ้ย… ตัวเท่าเราเลย!".
- Camera: CAM-CHART-2S as shot 3, then a comic push r 6.6 → 5.8 over +6–+14 (hy adjusted so the floor stays ≤ y 1160; scene sheet computes).
- Staging: R. MAN `turn-head-right` +0–+6, then `gasp-recoil` with `shock` +6–+20, V01 lip-sync; the giant swaps to its `front` head at +10 and looks at the lens to +22, then back to profile.
- Sound: M1 half-beat dropout +0–+12; S8 flinch sting at +8; V01 +4–+33.

**6. S01-B02-SH01** [348, 492). L03 "สมมติว่ามันโตทั้งตัวนะ… กล้ามใหญ่ขึ้น แรงที่ออกได้ก็มากขึ้น".
- Camera: CAM-FLEA-LEGS `cam: target (1.20, 0.55, 0.35), yaw 6→10, r 3.4→3.1, eye 0.9, f 1500, hy 860` (flea 795 → 870 px long; MAN's shoulder at the left edge).
- Staging: R. The giant at rest; coral glow on the hind-leg muscle 0 → 1 from "กล้ามใหญ่ขึ้น" (est +50) to the end; "แรง ↑" arrow beside the leg from "แรงที่ออกได้" (est +95).
- Sound: M1 back at energy 2 (lighter); S9 fwoop at +50.

**7. S01-B02-SH02** [492, 552). L04 "แต่… ตัวก็หนักขึ้นตามกัน".
- Camera: CAM-CHART-2S `cam: target (0.95, 1.00, 0.35), yaw 2→4, r 6.5→6.3, eye 1.15, f 2400, hy 770`.
- Staging: R. MAN `front`, neutral, watching the flea; the glow continues rising; the weight-dial icon pops in above the flea's back at +12 and its needle swings up in step with the glow +12–+55; a small down-arrow under the body.
- Sound: S10 floor groan +14–+50.

**8. S01-B02-SH03** [552, 678). L05 "เหมือนขาคุณแรงขึ้นสองเท่า… แต่ต้องแบกเป้หนักขึ้นสองเท่า".
- Camera: CAM-INSERT `cam: target (0, 0.95, 0), yaw 0→3, r 2.9→2.7, eye 1.0, f 1300, hy 690` (MAN 865 px; floor ≈ y 1147).
- Staging: D (paper studio, metres). MAN `right` profile at (−0.40, 0, 0); ghost `right` profile at (+0.40, 0, 0), 40 %; chart strip at (0, 0, −0.30). "ภาพจำลอง" in LBL +0 to the end (Boat B-P6).
- Key frames: +4 coral glow on MAN's legs + "×2" tag; on "แบกเป้" (est +62) the backpack drops onto his shoulders + "×2" tag; +96–+102 both crouch; **+102 both take off** (0.20 m, 12 f), dashed line at the apex feet row +108; +114 both land; both straighten to the end.
- Sound: A2 studio hush; S11 backpack thump at +62; `whoosh_fast-slide_01` at +102; `foley_soft-landing-tap_01` at +114.

**9. S01-B02-SH04** [678, 765). L06 "ตัวใหญ่ขึ้น… กระโดดไม่ได้สูงขึ้นตาม".
- Camera: CAM-CHART-2S `cam: target (0.95, 1.00, 0.35), yaw 3→0, r 6.3→6.6, eye 1.15, f 2400, hy 770` (settling pull-back).
- Staging: R. MAN `front`, P06 shrug on "ไม่ได้สูงขึ้นตาม" (est +45), deadpan; the giant idles (antenna twitch at +20); glow and dial fade out +0–+15.
- Sound: room tone; S12 shrug pluck at +45.

**10. S01-B03-SH01** [765, 858). L07 "แต่… แล้วหมัดตัวจิ๋ว กระโดดเก่งได้ยังไง".
- Camera: CAM-MACRO `cam: target (0, 0.45, 0) mm, yaw 0→4, r 4.0→3.6, eye 0.5, f 1200, hy 900` (slow push).
- Staging: M. The real flea at rest, legs folded; "2 มม." bar; "ภาพจำลอง" in LBL.
- Sound: A2 hush (room tone out); M1 thins, energy 1.5.

**11. S01-B03-SH02** [858, 960). L08 "ขามันสั้น ดันพื้นเสร็จในพริบตา… กล้ามหดไม่ทัน".
- Camera: CAM-MACRO-LEG `cam: target (−0.45, 0.35, 0) mm, yaw 4→6, r 2.4→2.1, eye 0.35, f 1200, hy 880`.
- Staging: M. "ภาพช้า · ภาพจำลอง" in LBL; the muscle icon sits only on the flea leg (Boat B-P5), no caption/sound says "muscle is slow". The hind leg extends slowly (push at 1/3 speed) +10–+70; the mini clock icon's hand whips round +10–+70; the muscle icon contracts only halfway by +70, when the leg is already straight ("กล้ามหดไม่ทัน", est +75).
- Sound: M1 a held pad; S13 slowed creak +10–+70; S14 fast tick run +10–+70.

**12. S01-B03-SH03** [960, 1089). L09 "มันเลยบีบแผ่นยางยืดในตัวไว้… แล้วปล่อยทีเดียว เหมือนหนังสติ๊ก".
- Camera: CAM-MACRO-THORAX `cam: target (−0.15, 0.55, 0) mm, yaw 0, r 2.8→2.6, eye 0.55, f 1200, hy 880`.
- Staging: M. "ภาพจำลอง" in LBL. Body goes translucent +0–+8; on "บีบ" (est +10) the amber pad squeezes (scale-y 1 → 0.7) to +40; catch icon clicks shut at +42; hold to +62; on "ปล่อย" (est +62) **release: the flea is gone in one frame** (+63), smear streak up, pad glow fading in the air +63–+80; on "หนังสติ๊ก" (est +105) the slingshot icon pops in beside the empty spot.
- Sound: S15 squeeze +10–+40, lock click at +42; **S16 snap at +63** + whip at +63; music stops dead at +63, A2 hush only to the end.

**13. S01-B04-SH01** [1089, 1206). L10 "ตามแบบจำลอง… ตัวใหญ่ไม่ต้องพึ่งหนังสติ๊กเท่าตัวเล็ก".
- Camera: CAM-CHART-2S `cam: target (0.95, 1.00, 0.35), yaw 0→−3, r 6.6→6.3, eye 1.15, f 2400, hy 770`.
- Staging: R. The same slingshot icon appears beside the giant's thorax in colour at +4; the giant glances at it (+20); on "ไม่ต้องพึ่ง" (est +55) the icon fades to grey over 15 f and **stays**; MAN glances at the giant (+70).
- Sound: room tone back; M1 resumes, energy 2.5.

**14. S01-B04-SH02** [1206, 1410). L11 "ย่อตัว แล้วใช้กล้ามดันแบบคุณ ก็ได้", V02 "ฮึบ!", L12 "สูงพอ ๆ กัน… แค่หลักสิบเซน ไม่ใช่ร้อยเมตร".
- Camera: CAM-TRUTH **locked** `cam: target (0.95, 1.00, 0.35), yaw 0, r 10.0, eye 1.0, f 3600, hy 790` (no move: measurement).
- Staging: R, both on z 0.35. MAN `front` at (0, 0, 0.35), 648 px (x ≈ 108–288); giant `right` profile at (1.35, 0, 0.35) (x ≈ 360–1008); floor row 1150.
- Key frames: L11 +0–+63; **crouch +60–+68** (both; MAN standing-jump crouch, giant legs fold); **take-off +68** with V02; apex **+77** (MAN feet ≈ y 999 at 0.42 m, giant ≈ y 1020 at 0.36 m); **freeze +77–+104** (27 f): band 0.10–0.50 m (rows 970–1114) fades in +78–+84 with "หลักสิบเซน" at its left end, tag "สูงพอ ๆ กัน" (y 190–300) with a leader to the band +84; resume +104, **landing +113** (both on one frame); band and tag fade +180–+195; both straighten, MAN glances at the giant.
- Sound: S17 crouch pair at +60; S18 jump pair + V02 at +68; **silence +77–+104** (music and room tone out, NAR only); S19 landing thud at +113, room tone back; M1 back at energy 2 from +113.

**15. S01-B05-SH01** [1410, 1569). L13 "แต่ถ้าวัดเป็นเซน… ปกติ คุณก็กระโดดสูงกว่าหมัดตัวจริงอีกนะ".
- Camera: CAM-CHART-LOW `cam: target (0.05, 0.85, 0.30), yaw −8→−4, r 2.75→2.60, eye 1.0, f 1400, hy 700` (≈ 509 → 538 px/m).
- Staging: R. Opens on the giant shrinking away about its feet +0–+12 (sparkle fades by +20; no flea remains); MAN at (0.45, 0, 0.30) `front` beside the chart (chart at screen left of him).
- Key frames: on "เซน" (est +30) the flea mark (line + tiny flea icon) ticks on at 0.15 m (row ≈ 1076); +55 MAN's mark (line + tiny man icon) at 0.42 m (row ≈ 931); MAN glances down at both +60–+90; on "สูงกว่า" (est +110) P09 hands on hips, `smug` to the lens.
- Sound: S20 shrink pop at +0; S20 ticks at +30 (high) and +55 (low); M1 warm, energy 2.

**16. S01-B05-SH02** [1569, 1728). L14 "หมัดดูเก่ง… ก็เพราะตัวมันเล็กมาก", V03, hold.
- Camera: CAM-SOFA `cam: target (3.30, 0.70, 0.55), yaw 37→35, r 2.65→2.55, eye 1.15, f 1200, hy 850` (very slow push through the hold).
- Staging: R. MAN in front of his seat, `sit-down` (front, 1.8 s) +0–+54, `relieved` → `neutral`; L14 lands as he settles (est +20–+92); the dog lifts its head at +95, sighs (V03) +100–+136, lies back down by +150; hold to the end (~2.5 s after L14).
- Sound: S20 sofa press at +40; `stinger_pizz-tag-ending_01` from the end of "…ตัวเล็กมาก" (est +92); S1 collar jingle at +95; dog sigh +100; room tone fades to zero by +159; no loop seam.

## Dependencies and open items

- **Boss (W5.2):** N1–N14 in the brief ([New assets](film-brief.md#new-assets-and-missing-capability-boss-dependencies-w52)); spikes SP2 (truth shot) and SP3 (myth camera) before the full build.
- **Film (W3):** the flea look in `src/painted/edu13/flea.ts` with the six SP1 stills (user look check); look frames LF01–LF03 added to `review-rows.json` (`looks`, `look` per beat).
- **Ton (parallel to W5):** M1, A1–A3 and the NEEDS-GEN SFX in the brief; listens to `stinger_pizz-tag-ending_01`, `whoosh_air-swish-rising_01`, `reveal_warmth-fwoop_01`, `stinger_pizz-shrug_01`, `comedy_shrink-pop-gliss_01`, `foley_soft-landing-tap_01`, `foley_flashlight-click_01` before use (all "not listened").
- **Boat:** picture checks B-P1–B-P7 (brief, Handoff).
- **W4/W5.1:** voice lock, then the timed scene sheets with integer frames, word onsets and per-shot Sound lines.

### Open questions

User-owned, non-blocking (the recommendation applies if unanswered; also on the review page as Q-F1–Q-F4):
- **Q-F1** Macro flea on a plain paper studio backdrop (recommended) or on a leaf on the window sill.
- **Q-F2** Backpack insert on the paper studio with a see-through "normal you" hopping beside (recommended) or in the room with a pre-drawn line.
- **Q-F3** At L13 the giant shrinks away with a little pop (recommended) or a plain cut.
- **Q-F4** Flea size: body length = the man's height, so it stands about waist-high (recommended), or heads level (flea 2.7 m long, man smaller on screen).

## Change log

| Revision | Date | Author | Change |
| --- | --- | --- | --- |
| EDU-EP13-ROWS-R1.0 | 2026-11-09 | Film | First storyboard pass (W2) from script R2 and brief R1: 16 shots, est 57.6 s (1728 f), rules R01–R08, per-shot camera, staging and sound; rows file untimed; open questions Q-F1–Q-F4. |
| EDU-EP13-ROWS-R1.1 | 2026-11-09 | Film | Boat W2 picture recheck: shot 2 crane runs to the cut still rising, counter ticks +24/+32/+40/+48/+56 so ×50 is never held (B-P2), S3/S4 cue frames moved to match; shot 8 gets "ภาพจำลอง" in LBL and R02 lists it (B-P6); shot 11 notes the B-P5 condition. 16 shots, 1728 f est unchanged. |
