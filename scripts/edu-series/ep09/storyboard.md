# Storyboard EDU-EP09-ROWS-R1.2 — EDU-EP09-SHORT (untimed rows, look frames added)

- Revision **EDU-EP09-ROWS-R1.2** (Film W3.1, 2026-11-08: look frames LF01–LF04 added, camera lines of the changed shots updated per the user's 2026-11-08 decisions; R1.1 Film, Q-F1/Q-F2 applied; R1 Film W2.2). Brief **EDU-EP09-BRIEF-R1.2**. Inputs: script **EDU-EP09-SCRIPT-R1.2** ([script.md](script.md), user-approved 2026-11-08, ending `B_loop`), brief **EDU-EP09-BRIEF-R1.1** ([film-brief.md](film-brief.md): SET-DINING, HAND-CLOSE, HAND-ROW, PIANO-CLOSE, VD01–VD24, shot plan, N1–N10, SP1–SP4), fact-check [fact-check.md](fact-check.md) (W1.3 pass, R-2 applied), measured read [voice-measure.md](voice-measure.md) (Kore A, atempo 0.95 at the user's request; L03 re-read slower at W4).
- Status: `ready-for-dev` for the first storyboard review (camera and VO only). The review rows are **untimed** (`"untimed": true`, no times on the page). The est lengths below come from the measured line lengths ×1/0.95 (splits inside a line syllable-proportional, `est`); total ≈ **56.9 s, 18 shots**. W3 adds look frames to the same rows; W5.1 writes timed scene sheets with integer frames from the W4 voice lock. Not user-approved; no render, no runtime or visual validation.
- Review rows: [review-rows.json](review-rows.json) (Thai, one row per shot, `lines` cites the script line IDs). Review page: pending (coordinator publishes).
- Units and owners: SET-DINING metres (origin on the floor under the table centre, +x right from the camera side, +y up, +z toward the camera side; BOY and ELDER sit on −z facing +z); HAND-CLOSE set-cm (origin on the table under BOY's left middle-finger knuckle, fingers along −z, wrist +z, thumb +x; `dining = (−0.14 − x/100, 0.72 + y/100, −0.08 − z/100)` (R1.2: the test hands sit 0.18 m further onto the table, brief VD25)); HAND-ROW and PIANO-CLOSE set-cm (brief). Camera line: `cam: target, yaw a→b (azimuth, 0 = camera on +z of the target, positive toward +x), r, eye (camera height), pitch (positive up; omitted = aimed at the target), f (px), hy (px)` = one kit `camMove`. One yaw camera per shot owns projection; rig characters are seated flat cards squared to the lens; macro hands are 3D joints projected per shot (N1).
- Casting: BOY = **`boy-school, new: seated-hands-on-table`**; ELDER = **`man-elder` (own cardigan), `new: seated-hands-on-table`**; hands = **`new: hand-macro`** (BOY left `size 1`; ELDER right `size 1.25`, elder tone; pianist right `size 1.2`, generic tone); diagram = **`new: tendon-diagram`**. Kit layers: ENV-GLOW `paintHalo` (lamp pool, nerve glow), ENV-SKY `paintSkyBands` (window). Reference plate only: `PL-EDU-KITCHEN`.

## Shot list

Est s from the measured read ×1/0.95. Check = the observable test at Draft (brief spikes SP1–SP4 where cited).

| Shot | Lines | Est s | Picture | Camera (brief, est) | Casting | Sound cue | Check | Look |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S01-B01-SH01 | L01 + try 1.2 | 5.30 | Frame 0: our own view of a child's left hand flat on warm wood; middle folds under; ring strains, tip stays down; camera leans in | CAM-POV r 28→26, eye 40→38, f 3500, hy 750 (R1.2, steeper) | BOY hand macro `flat` → `test-fold-middle` → `ring-strain` | Room tone + far clock only; no music | SP1; flat hand ≥ 560 px wide; tips above y 1160 | LF01 |
| S01-B01-SH02 | try 0.8 + V01 | 1.60 | Close-up: BOY's scrunched strain face, then he looks up to screen-right, outraged | T-BOY yaw 10→6, r 1.60→1.52, eye 0.98, pitch −2°, f 1650, hy 780 (R1.2) | BOY `new: strain` → `angry` + talk | Silence holds; V01 "ไม่ขึ้น!" dry and close | Head ≈ 408 px (LF02); comic, not pained | LF02 |
| S01-B01-SH03 | L02 | 2.70 | Low front macro: the ring lifts a hair and drops back | CAM-TRY yaw 168→164, r 26, eye 8 | hand macro `ring-hair` | M1 motif enters soft; NG-S1 tremble on the hair-lift | SP1: hair-lift ≥ 25 px with a visible shadow gap | (LF01) |
| S01-B01-SH04 | L03 | 2.40 | High two-shot: BOY's right hand reaches toward his left ring finger; grandpa's hand covers the wrist and lowers it | T-PAIR-L03 yaw −12→−8, r 1.30→1.24, eye 1.62, pitch −30° | BOY `new: reach-own-hand`, `worried`→`neutral`; ELDER `new: gentle-stop`, `happy` + small head shake | M1 low; a soft cloth brush is optional (Editor) | No finger touched; stop 6 cm before contact; SP3 | (LF02) |
| S01-B02-SH01 | L04 | 2.60 | Low front macro: thumb, index, little lift and land one by one; all three up on "ขึ้นหมด"; ring flat | CAM-TRY yaw 168→160 | hand macro `lift-thumb`, `lift-index`, `lift-little` | `foley_soft-landing-tap_01` ×3 on the landings; M1 | Taps on the word onsets (W5.1); no gap under the ring | (LF01) |
| S01-B02-SH02 | V02 | 1.80 | Grandpa's own hand big in the foreground, ring flat; he laughs behind it; BOY at frame left stares | T-ELD-FG yaw −6, r 0.95, eye 1.02, pitch −6°, f 1250 (R1.2, user) | ELDER `laugh`, hand macro `ring-strain` (size 1.25); BOY `surprised`, look at the hand | V02 (laugh acted in TTS); M1 | ELDER's hand ≥ 150 px wide; ring readable (SP3) | (LF02) |
| S01-B02-SH03 | L05 | 3.00 | High view of both hands side by side, both ring fingers flat; slow push onto BOY's | CAM-PAIR r 44→30, eye 36→27, f 1250 | ELDER hand screen-left, BOY hand screen-right, both TP | M1; `stinger_pizz-shrug_01` on "มันโดนอะไรรั้งไว้" | Both hands in frame at start | (LF01) |
| S01-B03-SH01 | L06 | 4.75 | High view down the whole forearm: skin turns see-through; coral muscle in the forearm; four cords to the fingers; faint puppet cross | DIAG-W r 40→37, eye 58→55, f 2350, hy 660 (R1.2) | BOY hand macro `flat`, skin 28 %; `new: tendon-diagram` | `reveal_glass-shimmer-soft_01` on the bloom; M1 out; one `pluck_soft-note-0n_01` per cord pulse | SP2: cords ≥ 6 px; label on; no flesh read | LF03 |
| S01-B03-SH02 | L07 | 4.00 | Index and little light their own teal muscle and cord; the ring cord stays alone | DIAG-W r 37→33, eye 55→50 | diagram: EI, EDM lit teal | Two plucks (index, little), one lone pluck on "นิ้วนางไม่มี" | Thumb unlit; ring has no second cord | (LF03) |
| S01-B03-SH03 | L08 | 4.60 | Shared set glows amber; push to the back of the hand; two coral ties draw in (middle–ring, ring–little) | DIAG-W → DIAG-B r 33→16, eye 50→24 | diagram: shared amber, ties in | Plucks as a three-note chord on "ชุดเดียวกัน"; two soft plucks on the ties | SP2: both ties ≥ 20 px | (LF03) |
| S01-B03-SH04 | L09 | 4.95 | Low front macro with the diagram: folded middle holds its cord; the tie tugs; the ring cord goes taut; the ring rises a hair and stops | CAM-TRY yaw 168→172, r 26→24 | hand macro TP + `ring-hair` 0.3 cm; diagram: middle held, ring taut | `tone_thin-unresolved_01` held, unresolved | Taut cord distinct; no pain cue; label on | (LF03) |
| S01-B03-SH05 | L10a | 2.95 | Back in the room, BOY looks at his hand; a soft glow runs from his shoulder down the arm into the whole hand | T-BOYMED yaw 16→10, r 1.30→1.22, eye 1.25, pitch −14° | BOY `neutral`→`surprised` (small), `seated-hands-on-table`; N9 glow | Cut on "แต่" to `tone_soft-sustain-reflective_01`; `reveal_reverse-swell-airy_01` under the glow | Glow reaches all five fingers; no brain or nerve map | (LF02) |
| S01-B03-SH06 | L10b | 1.85 | Paper row of three hands: ring flat / a hair / a little | HAND-ROW yaw 180, r 60→56, eye 16, f 2100 | three hand macros (tones light, medium, deep) | Warm pad continues | Ring differences ≥ 15 px apart; no numbers | (LF03) |
| S01-B04-SH01 | L12 | 4.50 | Insert: anonymous hands on piano keys, one finger at a time thumb → little and back, fluent, cool light | PIANO (6, 2, 2), yaw 80→74, r 34→31, eye 40, f 2300, hy 880 (R1.2) | pianist hand macro `piano-press-*` (LF04 uses a placeholder key-contact pose; W5); no face | NG-M2 fluent piano phrase | Label on; no logo; no wrong note | LF04 |
| S01-B04-SH03 | L13 | 2.70 | The pianist's hand turns see-through: same cords, same ties | PIANO r 31→27 | pianist hand + `tendon-diagram` (same state as B03-SH03) | The B03 pluck notes return | Identical diagram to BOY's; no extra cord | (LF03) |
| S01-B05-SH01 | retry | 1.30 | Back at the table, low front macro: BOY folds again; the ring trembles up a hair and drops (CL03) | CAM-TRY r 26→25 | hand macro TP → `ring-hair` 0.4 cm | Music drops to room tone + clock; NG-S1 tremble | Hair-lift visible, never more than 0.4 cm | (LF01) |
| S01-B05-SH02 | L15 | 3.40 | Our own view again: plain flat hand; a faint ghost of the shared cords and both ties glows once across the neighbours, then gone | CAM-POV r 26→26.8, eye 38→39, f 3500, hy 750 (R1.2) | hand macro `flat`; diagram ghost 35 % for 0.8 s | Sparse plucked phrase; `stinger_pizz-tag-ending_01` on the end of the last word (UT15) | Label only while the ghost shows | (LF01) |
| S01-B05-SH03 | hold | 2.50 | Hold on the flat hand, a tiny tremble; camera settles to frame 0's position | CAM-POV r 26.8→28, eye 39→40 (= frame 0, R1.2) | hand macro `flat` | Tag ends before the last ~0.8 s; room tone + clock into the seam | SP4: last frame = frame 0 | (LF01) |

## Rules carried from the brief and fact-check (every shot)

- **R01** Diagram safety: no cut, blood, cut edge, splint, surgery view, veins or red flesh; see-through skin at 28 % with the outline and nails kept; "ภาพประกอบ" label on every see-through, diagram-row and musician shot.
- **R02** No hand pulls, bends back or stretches a finger; no exercise, stretching or training picture; BOY's strain is comic, never pained (no tears, wince, white knuckles, red skin).
- **R03** Anatomy picture: cords and ties illustrative; both ties always (middle–ring and ring–little); the ring finger never has its own cord or muscle; the pianist's diagram is identical to BOY's.
- **R04** L10 glow: shoulder → whole hand, all five fingers; no brain, nerve map or names.
- **R05** Musicians generic and faceless, no names or logos; fluent playing (no stumbling note).
- **R06** On-screen text: captions, `@TamMaiLa` and the label only (Remotion DOM); no painted text, no digits on the clock face, no readable calendar.
- **R07** Frame zones: caption band y 1176–1344 (edu stroke, `bottomEdgeY` 1344, ≤ 2 lines); fingertips, cords, ties, faces and contacts above y 1160; label slot x 816–1020, y 148–204; nothing important above y 140.
- **R08** Room ↔ close plate is always a cut, never a zoom across scales.
- **R09** Seam: B05-SH03's last frame is B01-SH01's frame 0 (camera, pose, light, audio bed).

## Per-shot staging

Each block: staging (`est`), camera, light, sound, check. Seconds are into the shot at the est length; W5.1 replaces them with integer frames from the voice lock. Library IDs from `~/ReelsStore/library/sound/INDEX.md` (checked 2026-11-08; generated entries "not listened"); NG-* = the brief's NEEDS-GEN list. Poses and positions in HAND-CLOSE cm unless named.

### S01-B01-SH01 — L01 + try (LF01)
- **Staging (HAND-CLOSE):** BOY's left hand `flat` (wrist (0.3, 1.2, 8.6), tips as the brief) still from 0.0 to 0.2 s. On "พับนิ้วกลาง" (est 1.3 s) the middle finger folds under over 0.5 s to `test-fold-middle` while the knuckle ridge rises to y 3.0 and the other three arch (tips stay on the wood). On "ยกนิ้วนาง" (est 2.9 s) the ring finger strains: ring MCP pushes −4° (no tip gap), tremble ±0.08 cm, two crease strokes over the ring knuckle straighten; held to the shot end (the first 1.2 s of the try window). Shirt cuff white at the frame bottom.
- **Camera (R1.2):** `cam: (0, 1.5, 1.0), yaw 0, r 28→26, eye 40→38, f 3500, hy 750` (pitch ≈ −53°), eased over the whole shot. Why: user 2026-11-08 accepted Boss's steeper CAM-POV (eye 36–40, r 26–30: finger/palm 0.77–0.78 on screen instead of 0.70) so the flat hand reads long and flat; f raised from 2300 so the silhouette stays ≥ 560 px. Measured at frame 0 (LF01, `EDU9-LF01m` mask): hand silhouette x 220–805 = **585 px**, widest row 571 px, fingertips y 398 (middle) / 345 (ink top), wrist y 1113, finger/palm 0.78; end of shot: wrist y 1144 (above the band). The forearm runs off the bottom; the table edge (HAND z 32) is off frame.
- **Light:** lamp from upper frame-left, contact shadows under each tip falling toward the thumb side and wrist; window rim faint on the little-finger edge.
- **Sound:** `room_condo-night-quiet_01` + `tension_clock-pulse_01` (far); no music; NAR L01.
- **Check:** SP1; folded middle reads as folded (its knuckle bump between index and ring); no tip gap on the ring.

### S01-B01-SH02 — try + V01 (LF02)
- **Staging (SET-DINING):** BOY seated, `front`, test hand off frame bottom. 0.0–0.8 s `new: strain` (brows down, eyes squeezed, lips pressed, cheeks slightly puffed, a small shoulder tremble). 0.8 s head lifts and turns 15° toward screen-right (ELDER, off frame), `angry` + `talk` for V01 ("ไม่ขึ้น!", 0.6 s); hold 0.2 s.
- **Camera (R1.2):** `cam: (−0.26, 1.00, −0.62), yaw 10→6, r 1.60→1.52, eye 0.98, pitch −2°, f 1650, hy 780`. Why: at r 1.05 the camera stood over the table and the empty table top filled the lower half (LF02 round 1); pulled back with a longer lens (same head size) the table reads as a strip carrying its props, with the pendant lamp entering the top. Measured (LF02, frame 0): BOY head top y 447, chin 855 (**head 408 px**) at x ≈ 350–700; ELDER's laughing face cut by the right edge; clock at the top left; lamp shade top centre.
- **Light:** lamp from above-front, glow off the face (painted-2d); window rim on the screen-right cheek.
- **Sound:** silence (room tone and clock) through the strain; V01 dry and close.
- **Check:** comic, not pained (R02); head ≤ 400 px.

### S01-B01-SH03 — L02
- **Staging:** TP; at 0.6 s the ring tip lifts to 0.4 cm over 0.25 s, holds 0.3 s with tremble, drops back over 0.2 s (est at "นิดเดียว"); tip back on the wood by "หรือไม่ขึ้นเลย".
- **Camera:** `cam: (0, 1.5, −1.5), yaw 168→164, r 26, eye 8, f 2000, hy 760` (pitch ≈ −14°). Projection (est): thumb tip x ≈ 145, little tip x ≈ 855, tips y ≈ 890–955; ring hair-lift ≈ 33 px.
- **Light:** lamp from behind-above; the tip shadow separates by the hair-lift.
- **Sound:** NG-M1 motif enters soft under L02; NG-S1 tremble on the lift (fallback: none, silence).
- **Check:** SP1 hair-lift ≥ 25 px.

### S01-B01-SH04 — L03
- **Staging (SET-DINING):** BOY `front`, left hand in TP at (−0.14, 0.72, −0.26) (macro), right hand from (−0.38, 0.72, −0.28) moves toward his left ring finger from 0.2 s; ELDER's right hand lifts from (0.16, 0.72, −0.30) at 0.4 s and settles palm-down over BOY's right wrist at 0.9 s, 6 cm short of BOY's left hand; both hands lower to the table by 1.6 s. ELDER `happy`, a small head shake at 1.0 s; BOY `worried` → `neutral`.
- **Camera:** `cam: (−0.05, 0.86, −0.42), yaw −12→−8, r 1.30→1.24, eye 1.62, pitch −30°, f 1150, hy 760`. Projection (est): BOY head 485–731 at x ≈ 350; ELDER head 371–665 at x ≈ 745; hands y ≈ 856–945.
- **Light:** lamp pool on the table between them; window behind ELDER.
- **Sound:** M1 low under L03 (the slower re-read).
- **Check:** R02 (no finger touched); SP3 wrist handoff.

### S01-B02-SH01 — L04
- **Staging:** TP; thumb lifts on "นิ้วโป้ง" (to 2.5 cm, up 0.25 s, down 0.15 s), index on "นิ้วชี้" (4.0 cm), little on "นิ้วก้อย" (3.0 cm), then on "ขึ้นหมด" all three lift together and hold to the end; ring flat, small tremble.
- **Camera:** CAM-TRY `yaw 168→160`, r 26, eye 8, f 2000, hy 760. Projection (est): index lift ≈ 340 px, little ≈ 230 px, thumb ≈ 165 px.
- **Light:** three shadow gaps open, none under the ring.
- **Sound:** `foley_soft-landing-tap_01` on each of the three landings (fallback `foley_knife-tok-wood_01` first 0.12 s, low-passed); M1.
- **Check:** taps on the W5.1 word frames; ring gap 0 px.

### S01-B02-SH02 — V02
- **Staging (SET-DINING):** ELDER `front`, right hand in TP at (0.16, 0.72, −0.30) (macro, size 1.25), ring strain tremble; from 0.1 s `laugh` with V02, shoulders bouncing twice. BOY at frame left `surprised`, look vector down-right at ELDER's hand.
- **Camera (R1.2):** `cam: (0.12, 0.95, −0.45), yaw −6, r 0.95, eye 1.02, pitch −6°, f 1250, hy 620` (user 2026-11-08: lens 1250 so ELDER's hand is ≥ 150 px wide; Boss SP3). Projection (est at f 1050): ELDER head 260–654 at x ≈ 684; his hand y ≈ 866–925; BOY head at x ≈ 150.
- **Light:** lamp; window rim on ELDER's screen-right side.
- **Sound:** V02 (laugh acted inside the line); M1.
- **Check:** SP3; ELDER's ring finger reads flat beside the arched others.

### S01-B02-SH03 — L05
- **Staging (HAND-CLOSE):** BOY's left hand TP at the origin; ELDER's right hand TP at (−30, 0, 4) (mirrored, thumb toward −x); both ring fingers flat with faint tremble.
- **Camera:** `cam: (−15, 1.5, 3)→(−4, 1.5, 2), yaw 0, r 44→30, eye 36→27, f 1250, hy 650`, eased 0.2–1.0. Projection (est): start ELDER thumb x ≈ 30, BOY thumb x ≈ 990, hands y ≈ 570–840; end BOY's hand x ≈ 530–830.
- **Light:** lamp; two skin tones side by side.
- **Sound:** M1; `stinger_pizz-shrug_01` on "มันโดนอะไรรั้งไว้".
- **Check:** both hands fully in frame at 0.0 s.

### S01-B03-SH01 — L06 (LF03)
- **Staging:** BOY's left hand `flat` (relaxed for the diagram; the pose change is hidden by the cut), forearm to the elbow. 0.0–0.6 s skin fades to 28 % from the fingertips to the elbow; 0.9 s shared muscle glows coral on "กล้ามเนื้อ… ปลายแขน"; 2.3 s the four cords pulse once from the muscle to the tips on "ดึงนิ้วผ่านเส้นเอ็น"; 3.4 s puppet cross ghost (40 %) with four short strings appears 4 cm above the belly on "สายเชิดหุ่น", fades by the end. Label on from 0.3 s.
- **Camera (R1.2):** `cam: (0.3, 1.5, 12), yaw 0, r 40→37, eye 58→55, f 2350, hy 660` (pitch ≈ −55°). Why: at f 2050 the cords were ≈ 9 px and crowded; f 2350 enlarges the diagram 15 %. Measured at u 0.75 (LF03): fingertips y 221–273, wrist y 513, shared muscle y 591–1017, elbow y 1259 (in the band; nothing critical there), cords ≈ 11 px.
- **Light:** room dims to 70 %; diagram self-lit.
- **Sound:** `reveal_glass-shimmer-soft_01` on the bloom; M1 out; `pluck_soft-note-01_01`…`04_01` one per cord on the pulse (spread 0.1 s).
- **Check:** SP2; R01.

### S01-B03-SH02 — L07
- **Staging:** index's own muscle (forearm, thumb side) and cord light teal on "นิ้วชี้" (est 0.4 s), little's own on "นิ้วก้อย" (est 1.3 s); on "นิ้วนางไม่มี" (est 2.8 s) the ring cord flashes cream once, alone; the thumb stays unlit.
- **Camera (R1.2):** DIAG-W `r 37→33, eye 55→50`, f 2350, hy 660.
- **Light:** teal on cream.
- **Sound:** `pluck_soft-note-05_01`, `06_01` on the two extras; a lone `pluck_soft-note-03_01` on the ring.
- **Check:** R03.

### S01-B03-SH03 — L08
- **Staging:** shared muscle + middle, ring, little cords amber on "ชุดเดียวกับนิ้วกลางและนิ้วก้อย" (est 0.4–2.0 s); push from 2.0 s; middle–ring tie draws in at est 3.0 s, ring–little at 3.5 s (each 0.3 s).
- **Camera:** `cam: (0.3, 1.5, 12)→(−1.2, 1.8, 3), yaw 0, r 33→16, eye 50→24, f 2350→2000, hy 660→640` (R1.2 start lens), eased 0.45–0.95. Projection (est, end): ties y ≈ 610–645, x ≈ 420–560.
- **Light:** amber + coral.
- **Sound:** three plucks as a soft chord on "ชุดเดียวกัน"; two soft plucks on the ties.
- **Check:** SP2 ties ≥ 20 px; both ties present (R03).

### S01-B03-SH04 — L09
- **Staging:** TP with the diagram on: from est 1.4 s ("พอนิ้วกลางพับลง") the middle cord darkens and bends round its folded knuckle (held); 2.4 s ("สายร่วมก็ถูกกดไว้") the middle–ring tie pulls toward the middle; 3.3 s ("นิ้วนางเลยติด") the ring cord straightens taut (highlight, 1–2 px vibration) and the ring tip rises 0.3 cm and stops. Label on.
- **Camera:** CAM-TRY `yaw 168→172, r 26→24`, eye 8, f 2000, hy 760.
- **Light:** taut cord brightest.
- **Sound:** `tone_thin-unresolved_01` enters on the taut cord, held, unresolved.
- **Check:** R02 (no pain cue); the taut cord distinct from relaxed cords.

### S01-B03-SH05 — L10a
- **Staging (SET-DINING):** BOY `front`, both hands on the table (left flat, macro not needed at this scale: mitten), looks down at his left hand (look vector [0.2, 0.6]); 0.3 s a warm glow starts at the left shoulder, runs down the arm over 1.2 s and spreads into the whole hand (all five fingers) by 1.8 s; `neutral` → `surprised` small at 1.9 s. Label on.
- **Camera:** `cam: (−0.20, 0.92, −0.50), yaw 16→10, r 1.30→1.22, eye 1.25, pitch −14°, f 1150, hy 760`. Projection (est): head 527–806 at x ≈ 520; shoulder (625, 721); hand (532, 1015).
- **Light:** room back to 100 %; glow above.
- **Sound:** on "แต่" the taut tone cuts to `tone_soft-sustain-reflective_01`; `reveal_reverse-swell-airy_01` under the glow.
- **Check:** R04.

### S01-B03-SH06 — L10b
- **Staging (HAND-ROW):** three left hands in TP at x −13, 0, 13; ring lifts 0 / 0.4 / 1.2 cm (screen-left flat, centre a hair, screen-right a little), held still from 0.2 s. Label on.
- **Camera:** `cam: (−2, 1.5, −1), yaw 180, r 60→56, eye 16, f 2100, hy 800`.
- **Light:** even paper light.
- **Sound:** warm pad continues.
- **Check:** three lifts distinguishable at 270 px sheet size.

### S01-B04-SH01 — L12 (LF04)
- **Staging (PIANO-CLOSE):** pianist's right hand over C–G (wrist (4, 6, 16)); fingers press thumb → little → back to thumb one at a time every 0.45 s (9 presses, est 0.2–4.3 s), each key dropping 1.0 cm, fluent; carries all of L12 (piano only, Q-F2). Sleeve dark; no face. Label on.
- **Camera (R1.2):** `cam: (6, 2, 2), yaw 80→74, r 34→31, eye 40, f 2300, hy 880`. Why: at yaw 35 / eye 22 the camera sat over the player's shoulder and the forearm filled the lower half (LF04 rounds 1–2); from the treble side the hand is the hero, all fingers separate and the keyboard runs through the frame. Measured (LF04, u 0.4, middle finger on E): fingertips y 794–1062 (above 1160), wrist (238, 886). The hand's key-contact pose is a **placeholder** (curved fingers solved onto the key tops; the pressing tip sits 0.2 cm into its dropped key); W5 builds `piano-press-*`.
- **Light:** cool top light, dark surround.
- **Sound:** NG-M2 fluent piano phrase (fallback `bed_edu06-felt-piano-theme_01` excerpt).
- **Check:** R05; label on.

### S01-B04-SH03 — L13
- **Staging:** pianist's hand resting on the keys; skin fades to 28 % over 0.5 s; the tendon layer appears in the B03-SH03 end state (shared amber, both ties), no extra cord. Label on.
- **Camera (R1.2):** PIANO `(6, 2, 2), yaw 74, r 31→27, eye 40, f 2300, hy 880`.
- **Light:** cool, diagram self-lit.
- **Sound:** the B03 plucks return (same notes).
- **Check:** R03 identical diagram.

### S01-B05-SH01 — retry
- **Staging (HAND-CLOSE):** from `flat` the middle folds to TP over 0.3 s; at 0.6 s the ring trembles up 0.4 cm and drops by 1.1 s (CL03).
- **Camera:** CAM-TRY `r 26→25`, yaw 168, eye 8, f 2000, hy 760.
- **Light:** room light 100 %, warm.
- **Sound:** music out; room tone + clock at the B01 level; NG-S1 tremble.
- **Check:** hair-lift visible, ≤ 0.4 cm.

### S01-B05-SH02 — L15
- **Staging:** BOY's hand `flat`; on "สายร่วมกับนิ้วข้าง ๆ" (est 2.0 s) a ghost (35 %) of the shared cords and both ties glows across the middle, ring and little fingers for 0.8 s, then fades; label on only during the ghost.
- **Camera (R1.2):** CAM-POV `r 26→26.8, eye 38→39`, f 3500, hy 750.
- **Light:** as frame 0.
- **Sound:** sparse plucked phrase; `stinger_pizz-tag-ending_01` on the end of the last word (peak about −10 dB, trimmed 1.4–2.2 s, 0.5–0.6 s fade; UT15).
- **Check:** ghost never brighter than 35 %.

### S01-B05-SH03 — hold
- **Staging:** hand `flat`; ring tremble ±0.05 cm for 0.0–1.0 s, then still; no speech.
- **Camera (R1.2):** CAM-POV `r 26.8→28, eye 39→40`, f 3500, hy 750, eased 0–0.8, still for the last 0.5 s = frame 0's camera.
- **Light:** frame 0's light.
- **Sound:** tag ends ≥ 0.8 s before the seam; room tone + clock flow into L01.
- **Check:** SP4 seam identity (R09).

## Dependencies and open items

- Boss: N1–N9 (brief); SP1–SP4 before the look frames. Editor: NG-M1, NG-M2, NG-S1; V01/V02 TTS; L03 slower re-read at W4.
- **D01** ELDER's grin in the retry (script cue) dropped for time; restorable as a 0.8 s T-PAIR insert if the W4 lock leaves room.
- Open questions for the user: none. Decided by the user 2026-11-08: **Q-F1** yes, macro shots draw five separate fingers, body-scale shots keep mitten hands (UT14 exception for macro only); **Q-F2** piano only (guitar shot S01-B04-SH02 and its prop cut; ID retired).

## Change log

| Revision | Date | Author | Change |
| --- | --- | --- | --- |
| EDU-EP09-ROWS-R1 | 2026-11-08 | Film | First storyboard pass (W2.2), 19 shots, est 56.9 s, untimed rows; from brief EDU-EP09-BRIEF-R1. |
| EDU-EP09-ROWS-R1.1 | 2026-11-08 | Film | User decisions 2026-11-08 (Q-F1 yes, macro only; Q-F2 piano only): S01-B04-SH02 (guitar) removed, ID retired; S01-B04-SH01 carries all of L12, 4.50 s. 18 shots, est 56.9 s (unchanged); from brief EDU-EP09-BRIEF-R1.1. review-rows.json updated (ep.py), questions removed. |
| EDU-EP09-ROWS-R1.2 | 2026-11-08 | Film | W3.1 look frames LF01, LF01b, LF02, LF03, LF04 (`src/painted/edu09/`, stills `out/edu09/look-frames/v1/`, store `projects/EDU-EP09-SHORT/look-frames/`); review-rows.json `looks` + beat `look` (B01 LF01, B02 LF02, B03 LF03, B04 LF04, B05 LF01); camera lines updated for S01-B01-SH01, S01-B01-SH02, S01-B02-SH02, S01-B03-SH01–SH03, S01-B04-SH01, S01-B04-SH03, S01-B05-SH02–SH03 (user decisions 2026-11-08 + W3 framing; reasons in each shot); HAND-CLOSE ↔ dining mapping z −0.26 → −0.08. Thai rows text unchanged. |
