# Storyboard EDU-EP09-ROWS-R1.6 — EDU-EP09-SHORT (untimed rows, look frames added)

- Revision **EDU-EP09-ROWS-R1.6** (Film, 2026-11-08: user request, macro hand distal segment longer, look frames re-rendered, LF02 note; R1.5 Film, script R1.3 cuts L10 and L13 applied, retimed to the script's R1.3 estimate, three picture-only reaction cutaways added in B03; R1.4 Film, LF02 fix round 2; R1.3 Film, LF02 fix round 1; R1.2 Film W3.1: look frames LF01–LF04 added, camera lines updated per the user's 2026-11-08 decisions; R1.1 Film, Q-F1/Q-F2 applied; R1 Film W2.2). Brief **EDU-EP09-BRIEF-R1.6**. Inputs: script **EDU-EP09-SCRIPT-R1.3** ([script.md](script.md), Preaw 2026-11-08: cuts only, L10 and L13 removed per the user's decision of 2026-11-08; L12 kept, "แค่" kept in L15; ending `B_loop`), brief **EDU-EP09-BRIEF-R1.6** ([film-brief.md](film-brief.md): SET-DINING, HAND-CLOSE, PIANO-CLOSE, VD01–VD27, shot plan, N1–N11, SP1–SP4), fact-check [fact-check.md](fact-check.md) (W1.3 pass; the R1.3 cut scope goes to Boat's recheck), measured read [voice-measure.md](voice-measure.md) (of R1.1, with L10 and L13; not re-read since).
- Status: `ready-for-dev` for the storyboard review (camera and VO only). The review rows are **untimed** (`"untimed": true`, no times on the page). **R1.5 timing basis:** the est starts and lengths below are the script's R1.3 estimate (beat and line times in [script.md](script.md#open-question-map): 0.237 s per NAR syllable plus the fixed non-speech items), splits inside a line syllable-proportional (`est`); total **48.5 s, 18 shots**. R1.4 used the R1.1 measured read ×1/0.95 (56.9 s); the same measured basis without L10/L13 gives about 52 s (script N1 cross-check), so expect the W4 lock to land between the two. B01–B02 pictures, cameras and staging are unchanged; only their est lengths are re-based (12.0 → 11.1 s and 7.4 → 7.3 s), so the seconds inside their staging blocks are still the R1.4 values and W5.1 rescales them. W5.1 writes timed scene sheets with integer frames from the W4 voice lock. Not user-approved; no render, no runtime or visual validation.
- Review rows: [review-rows.json](review-rows.json) (Thai, one row per shot, `lines` cites the script line IDs; the three new cutaways carry a `changed` note). Review page: pending (coordinator publishes).
- Units and owners: SET-DINING metres (origin on the floor under the table centre, +x right from the camera side, +y up, +z toward the camera side; BOY and ELDER sit on −z facing +z); HAND-CLOSE set-cm (origin on the table under BOY's left middle-finger knuckle, fingers along −z, wrist +z, thumb +x; `dining = (−0.14 − x/100, 0.72 + y/100, −0.08 − z/100)` (R1.2: the test hands sit 0.18 m further onto the table, brief VD25)); PIANO-CLOSE set-cm (brief). Camera line: `cam: target, yaw a→b (azimuth, 0 = camera on +z of the target, positive toward +x), r, eye (camera height), pitch (positive up; omitted = aimed at the target), f (px), hy (px), cx (px lens shift)` = one kit `camMove`. One yaw camera per shot owns projection; rig characters are seated flat cards squared to the lens; macro hands are 3D joints projected per shot (N1).
- Casting: BOY = **`boy-school, new: seated-hands-on-table`**; ELDER = **`man-elder` (own cardigan), `new: seated-hands-on-table`**; hands = **`new: hand-macro`** (BOY left `size 1`; ELDER right `size 1.25`, elder tone; pianist right `size 1.2`, generic tone); diagram = **`new: tendon-diagram`**. Kit layers: ENV-GLOW `paintHalo` (lamp pool), ENV-SKY `paintSkyBands` (window). Reference plate only: `PL-EDU-KITCHEN`.
- **Removed in R1.5 (script R1.3 cuts; IDs retired, not reused, nothing renumbered):** `S01-B03-SH05` (L10a, glow travelling shoulder → whole hand), `S01-B03-SH06` (L10b, paper row of three painted hands), `S01-B04-SH03` (L13, see-through pianist). Earlier retired: `S01-B04-SH02` (guitar, Q-F2). **New in R1.5 (picture only, no speech added):** `S01-B03-SH07`, `S01-B03-SH08`, `S01-B03-SH09` (reaction cutaways, brief VD27).

## Shot list

Start / Est s from the script R1.3 estimate (above). Check = the observable test at Draft (brief spikes SP1–SP4 where cited).

| Shot | Lines | Start | Est s | Picture | Camera (brief, est) | Casting | Sound cue | Check | Look |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S01-B01-SH01 | L01 + try 1.2 | 0.0 | 5.2 | Frame 0: our own view of a child's left hand flat on warm wood; middle folds under; ring strains, tip stays down; camera leans in | CAM-POV r 28→26, eye 40→38, f 3500, hy 750 (R1.2, steeper) | BOY hand macro `flat` → `test-fold-middle` → `ring-strain` | Room tone + far clock only; no music | SP1; flat hand ≥ 560 px wide; tips above y 1160 | LF01 |
| S01-B01-SH02 | try 0.8 + V01 | 5.2 | 1.4 | Close-up: BOY's scrunched strain face, then he looks up to screen-right, outraged | T-BOY yaw 7→6, r 1.60→1.52, eye 0.98, pitch −2°, f 1650, hy 780, cx −245 (R1.4) | BOY `new: strain` → `angry` + talk | Silence holds; V01 "ไม่ขึ้น!" dry and close | Head ≈ 408 px (LF02); comic, not pained | LF02 |
| S01-B01-SH03 | L02 | 6.6 | 2.4 | Low front macro: the ring lifts a hair and drops back | CAM-TRY yaw 168→164, r 26, eye 8 | hand macro `ring-hair` | M1 motif enters soft; NG-S1 tremble on the hair-lift | SP1: hair-lift ≥ 25 px with a visible shadow gap | (LF01) |
| S01-B01-SH04 | L03 | 9.0 | 2.1 | High two-shot: BOY's right hand reaches toward his left ring finger; grandpa's hand covers the wrist and lowers it | T-PAIR-L03 yaw −12→−8, r 1.30→1.24, eye 1.62, pitch −30° | BOY `new: reach-own-hand`, `worried`→`neutral`; ELDER `new: gentle-stop`, `happy` + small head shake | M1 low; a soft cloth brush is optional (Editor) | No finger touched; stop 6 cm before contact; SP3 | (LF02) |
| S01-B02-SH01 | L04 + taps | 11.1 | 2.8 | Low front macro: thumb, index, little lift and land one by one; all three up on "ขึ้นหมด"; ring flat | CAM-TRY yaw 168→160 | hand macro `lift-thumb`, `lift-index`, `lift-little` | `foley_soft-landing-tap_01` ×3 on the landings; M1 | Taps on the word onsets (W5.1); no gap under the ring | (LF01) |
| S01-B02-SH02 | V02 | 13.9 | 1.5 | Grandpa's own hand big in the foreground, ring flat; he laughs behind it; BOY at frame left stares | T-ELD-FG yaw −6, r 0.95, eye 1.02, pitch −6°, f 1250 (R1.2, user) | ELDER `laugh`, hand macro `ring-strain` (size 1.25); BOY `surprised`, look at the hand | V02 (laugh acted in TTS); M1 | ELDER's hand ≥ 150 px wide; ring readable (SP3) | (LF02) |
| S01-B02-SH03 | L05 | 15.4 | 3.0 | High view of both hands side by side, both ring fingers flat; slow push onto BOY's | CAM-PAIR r 44→30, eye 36→27, f 1250 | ELDER hand screen-left, BOY hand screen-right, both TP | M1; `stinger_pizz-shrug_01` on "มันโดนอะไรรั้งไว้" | Both hands in frame at start | (LF01) |
| S01-B03-SH01 | L06 to "…เส้นเอ็น" | 18.4 | 3.3 | High view down the whole forearm: skin turns see-through; coral muscle in the forearm; four cords pulse to the fingers; faint puppet cross with the pulse | DIAG-W r 40→37, eye 58→55, f 2350, hy 660 (R1.2) | BOY hand macro `flat`, skin 28 %; `new: tendon-diagram` | `reveal_glass-shimmer-soft_01` on the bloom; M1 out; one `pluck_soft-note-0n_01` per cord pulse | SP2: cords ≥ 6 px; label on; no flesh read | LF03 |
| S01-B03-SH07 **(new R1.5)** | L06 "เหมือนสายเชิดหุ่น" | 21.7 | 1.0 | Cutaway, room: BOY lifts his left hand off the wood, palm down, fingers dangling, and bobs it like a marionette; grandpa watches, amused | T-BOY yaw 6→5, r 1.52→1.47, eye 0.98, pitch −2°, f 1650, hy 780, cx −245 (est; LF02's camera continued) | BOY `surprised`→`happy`, `new: hand-lifted-dangle` (macro at the table arm); ELDER `happy` | The four cord plucks again, quicker, on the first bob; room bed stays at the B03 dip | Elbow stays on the wood; no finger pulled; hand above y 1160; label on (held) | (LF02) |
| S01-B03-SH02 | L07 to "…นิ้วนาง" | 22.7 | 3.3 | Index and little light their own teal muscle and cord; the ring cord flashes once, alone | DIAG-W r 37→33, eye 55→50 | diagram: EI, EDM lit teal | Two plucks (index, little), one lone pluck on "นิ้วนาง" | Thumb unlit; ring has no second cord | (LF03) |
| S01-B03-SH08 **(new R1.5)** | L07 "…ไม่มี" + L08 "ต้องใช้" | 26.0 | 1.0 | Cutaway, room: BOY eyes his own ring finger with suspicion; his index and little lift together, the ring stays down | T-BOY yaw 7→6, r 1.60→1.55, eye 0.98, pitch −2°, f 1650, hy 780, cx −245 (est; = B01-SH02's camera) | BOY `suspicious`, look at the hand; hand macro `flat` + index/little lift 2 cm; ELDER `happy` | No SFX; the lone ring pluck rings over the cut; room bed at the B03 dip | Ring gap 0 px; lifts ≥ 20 px; label on (held) | (LF02) |
| S01-B03-SH03 | L08 from "ชุดเดียวกับ" | 27.0 | 4.5 | Shared set glows amber; push to the back of the hand; two coral ties draw in (middle–ring, ring–little) | DIAG-W → DIAG-B r 33→16, eye 50→24 | diagram: shared amber, ties in | Plucks as a three-note chord on "ชุดเดียวกัน"; two soft plucks on the ties | SP2: both ties ≥ 20 px | (LF03) |
| S01-B03-SH09 **(new R1.5)** | L09 "มักอธิบายกันว่า…" | 31.5 | 1.4 | Cutaway, room: grandpa, his own hand in the test pose in the foreground, nods like someone who has heard this before; BOY looks to him | T-ELD-FG yaw −6→−4, r 0.95→0.92, eye 1.02, pitch −6°, f 1250, hy 620 (est; = B02-SH02's camera) | ELDER `smug` + two slow nods, hand macro TP (size 1.25); BOY `neutral`, look at ELDER | No SFX; room bed at the B03 dip | ELDER's ring flat (same TP as B02-SH02); label on (held) | (LF02) |
| S01-B03-SH04 | L09 from "พอนิ้วกลางพับลง" | 32.9 | 3.6 | Low front macro with the diagram: folded middle holds its cord; the tie tugs; the ring cord goes taut; the ring rises a hair and stops. **Hard cut** on its last frame to the piano insert | CAM-TRY yaw 168→172, r 26→24 | hand macro TP + `ring-hair` 0.3 cm; diagram: middle held, ring taut | `tone_thin-unresolved_01` held to the cut, cut dead on the cut frame | Taut cord distinct; no pain cue; label on | (LF03) |
| S01-B04-SH01 | L12 | 36.5 | 4.5 | Insert: anonymous hands on piano keys, one finger at a time thumb → little and back, fluent, cool light | PIANO (6, 2, 2), yaw 80→74, r 34→31, eye 40, f 2300, hy 880 (R1.2) | pianist hand macro `piano-press-*` (LF04 uses a placeholder key-contact pose; W5); no face | NG-M2 fluent piano phrase, first note on the cut frame | Label on; no logo; no wrong note | LF04 |
| S01-B05-SH01 | retry | 41.0 | 1.0 | Back at the table, low front macro: BOY folds again; the ring trembles up a hair and drops (CL03) | CAM-TRY r 26→25 | hand macro TP → `ring-hair` 0.4 cm | Music drops to room tone + clock; NG-S1 tremble | Hair-lift visible, never more than 0.4 cm | (LF01) |
| S01-B05-SH02 | L15 | 42.0 | 4.0 | Our own view again: plain flat hand; a faint ghost of the shared cords and both ties glows once across the neighbours, then gone | CAM-POV r 26→26.8, eye 38→39, f 3500, hy 750 (R1.2) | hand macro `flat`; diagram ghost 35 % for 0.8 s | Sparse plucked phrase; `stinger_pizz-tag-ending_01` on the end of the last word (UT15) | Label only while the ghost shows | (LF01) |
| S01-B05-SH03 | hold | 46.0 | 2.5 | Hold on the flat hand, a tiny tremble; camera settles to frame 0's position | CAM-POV r 26.8→28, eye 39→40 (= frame 0, R1.2) | hand macro `flat` | Tag ends before the last ~0.8 s; room tone + clock into the seam | SP4: last frame = frame 0 | (LF01) |

Beat check (est): B01 0.0–11.1, B02 11.1–18.4, B03 18.4–36.5, B04 36.5–41.0, B05 41.0–48.5 = script R1.3. B03 still has no new speech; with the cutaways the longest stretch without a character on screen is 4.5 s (B03-SH03, 27.0–31.5; was 18.1 s with no cutaway; ER06 asks about 6 s).

## Rules carried from the brief and fact-check (every shot)

- **R01** Diagram safety: no cut, blood, cut edge, splint, surgery view, veins or red flesh; see-through skin at 28 % with the outline and nails kept; "ภาพประกอบ" label on every see-through and musician shot, held in its slot without a blink from B03-SH01 through B04-SH01 (so it also stays on over the three B03 cutaways and across the L09 → piano cut).
- **R02** No hand pulls, bends back or stretches a finger; no exercise, stretching or training picture; BOY's strain is comic, never pained (no tears, wince, white knuckles, red skin). BOY's marionette bob (B03-SH07) is a loose dangle from the wrist, not a finger stretch.
- **R03** Anatomy picture: cords and ties illustrative; both ties always (middle–ring and ring–little); the ring finger never has its own cord or muscle.
- **R04** Retired R1.5 (was: the L10 glow; L10 cut).
- **R05** Musicians generic and faceless, no names or logos; fluent playing (no stumbling note).
- **R06** On-screen text: captions, `@TamMaiLa` and the label only (Remotion DOM); no painted text, no digits on the clock face, no readable calendar.
- **R07** Frame zones: caption band y 1176–1344 (edu stroke, `bottomEdgeY` 1344, ≤ 2 lines); fingertips, cords, ties, faces and contacts above y 1160; label slot x 816–1020, y 148–204; nothing important above y 140.
- **R08** Room ↔ close plate is always a cut, never a zoom across scales (the B03 cutaways are cuts both ways).
- **R09** Seam: B05-SH03's last frame is B01-SH01's frame 0 (camera, pose, light, audio bed).

## Per-shot staging

Each block: staging (`est`), camera, light, sound, check. Seconds are into the shot at the est length; W5.1 replaces them with integer frames from the voice lock. Library IDs from `~/ReelsStore/library/sound/INDEX.md` (checked 2026-11-08; generated entries "not listened"); NG-* = the brief's NEEDS-GEN list. Poses and positions in HAND-CLOSE cm unless named. B01–B02 blocks are unchanged from R1.4 (their seconds are at the R1.4 lengths; see the status line).

### S01-B01-SH01 — L01 + try (LF01)
- **Staging (HAND-CLOSE):** BOY's left hand `flat` (wrist (0.3, 1.2, 8.6), tips as the brief) still from 0.0 to 0.2 s. On "พับนิ้วกลาง" (est 1.3 s) the middle finger folds under over 0.5 s to `test-fold-middle` while the knuckle ridge rises to y 3.0 and the other three arch (tips stay on the wood). On "ยกนิ้วนาง" (est 2.9 s) the ring finger strains: ring MCP pushes −4° (no tip gap), tremble ±0.08 cm, two crease strokes over the ring knuckle straighten; held to the shot end (the first 1.2 s of the try window). Shirt cuff white at the frame bottom.
- **Camera (R1.2):** `cam: (0, 1.5, 1.0), yaw 0, r 28→26, eye 40→38, f 3500, hy 750` (pitch ≈ −53°), eased over the whole shot. Why: user 2026-11-08 accepted Boss's steeper CAM-POV (eye 36–40, r 26–30: finger/palm 0.77–0.78 on screen instead of 0.70) so the flat hand reads long and flat; f raised from 2300 so the silhouette stays ≥ 560 px. Measured at frame 0 (LF01, `EDU9-LF01m` mask): hand silhouette x 220–805 = **585 px**, widest row 571 px, fingertips y 398 (middle) / 345 (ink top), wrist y 1113, finger/palm 0.78; end of shot: wrist y 1144 (above the band). The forearm runs off the bottom; the table edge (HAND z 32) is off frame.
- **Light:** lamp from upper frame-left, contact shadows under each tip falling toward the thumb side and wrist; window rim faint on the little-finger edge.
- **Sound:** `room_condo-night-quiet_01` + `tension_clock-pulse_01` (far); no music; NAR L01.
- **Check:** SP1; folded middle reads as folded (its knuckle bump between index and ring); no tip gap on the ring.

### S01-B01-SH02 — try + V01 (LF02)
- **Staging (SET-DINING):** BOY seated, `front`, both forearms on the wood (R1.4: elbows on the wood outside the shoulders, forearms angled in toward the hands so each arm bends at a visible elbow, paired but not mirrored: test hand (middle MCP) at (−0.20, 0.72, −0.09) in `ring-strain`, the SH01 end pose, elbow (−0.13, 0.746, −0.32); right hand flat at (−0.315, 0.72, −0.12), elbow (−0.39, 0.746, −0.33); ELDER's right hand flat at (0.15, 0.72, −0.15), elbow (0.16, 0.746, −0.37), ribbed cardigan cuff; his left hand (0.40, 0.72, −0.16), elbow (0.47, 0.746, −0.38), out of frame right); five-finger macro hands (about 100 px wide). 0.0–0.8 s `new: strain` (brows down, eyes squeezed, lips pressed, cheeks slightly puffed, a small shoulder tremble). 0.8 s head lifts and turns 15° toward screen-right (ELDER, off frame), `angry` + `talk` for V01 ("ไม่ขึ้น!", 0.6 s); hold 0.2 s.
- **Camera (R1.4):** `cam: (−0.26, 1.00, −0.62), yaw 7→6, r 1.60→1.52, eye 0.98, pitch −2°, f 1650, hy 780, cx −245`. R1.4 why: in v2 ELDER's right cheek and far ear were still cut; the lens shift moves the picture 115 px left (position and target unchanged), both his ears are now in, BOY stays the lead left of centre. R1.3 why: the viewer check found ELDER's laugh more than half cut and the near table edge tilted; yaw narrowed inside the brief's 10→6 and a lens shift (position and target unchanged) bring his whole laughing face in at the right and level the near edge. Measured (LF02 v2, frame 0): BOY head top y 447, chin 856 (**head 409 px**, unchanged); ELDER's face whole at x ≈ 770–1080 (far ear at the edge). R1.2: Why: at r 1.05 the camera stood over the table and the empty table top filled the lower half (LF02 round 1); pulled back with a longer lens (same head size) the table reads as a strip carrying its props, with the pendant lamp entering the top. Measured (LF02, frame 0): BOY head top y 447, chin 855 (**head 408 px**) at x ≈ 350–700; ELDER's laughing face cut by the right edge; clock at the top left; lamp shade top centre.
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

### S01-B03-SH01 — L06 to "…เส้นเอ็น" (LF03)
- **Staging:** BOY's left hand `flat` (relaxed for the diagram; the pose change is hidden by the cut), forearm to the elbow. 0.0–0.6 s skin fades to 28 % from the fingertips to the elbow; 0.9 s shared muscle glows coral on "กล้ามเนื้อ… ปลายแขน"; 2.2 s the four cords pulse once from the muscle to the tips on "ดึงนิ้วผ่านเส้นเอ็น"; R1.5: the puppet cross ghost (40 %) with four short strings appears 4 cm above the belly with the pulse at 2.4 s and holds to the cut at 3.3 s (was on "สายเชิดหุ่น", which now plays over BOY's marionette hand in SH07). Label on from 0.3 s.
- **Camera (R1.2):** `cam: (0.3, 1.5, 12), yaw 0, r 40→37, eye 58→55, f 2350, hy 660` (pitch ≈ −55°). Why: at f 2050 the cords were ≈ 9 px and crowded; f 2350 enlarges the diagram 15 %. Measured at u 0.75 (LF03; at 3.3 s that is 2.5 s, puppet cross on, so LF03 still matches): fingertips y 221–273, wrist y 513, shared muscle y 591–1017, elbow y 1259 (in the band; nothing critical there), cords ≈ 11 px.
- **Light:** room dims to 70 %; diagram self-lit.
- **Sound:** `reveal_glass-shimmer-soft_01` on the bloom (0.0 s); M1 out; `pluck_soft-note-01_01`…`04_01` one per cord on the pulse (2.2 s, spread 0.1 s); room bed and clock dip a further −6 dB from 0.0 s and stay dipped through B03, cutaways included.
- **Check:** SP2; R01.

### S01-B03-SH07 — L06 "เหมือนสายเชิดหุ่น" (new R1.5, reaction cutaway)
- **Staging (SET-DINING; est):** LF02's room and seating as in B01-SH02 (R1.4 points): BOY's left elbow stays on the wood at (−0.13, 0.746, −0.32); his left hand (middle MCP) starts flat at (−0.20, 0.72, −0.09) (cut-matched to SH01's flat diagram hand) and lifts 0.0–0.25 s to (−0.19, 0.83, −0.14), palm down, fingers relaxed and hanging (MCP 15°, PIP 25°, DIP 10°, `new: hand-lifted-dangle`); 0.25–1.0 s the wrist bobs ±0.012 m in y at 3 Hz, each finger lagging the wrist by 0.04 s from index to little, so the fingers swing as if hung on strings. Right hand flat at (−0.315, 0.72, −0.12). BOY `surprised` 0.0–0.5 s → `happy` from 0.5 s, head tilted 10° down, look vector at his raised hand. ELDER at the right edge `happy`, look at BOY's hand. No speech from either.
- **Camera (est):** `cam: (−0.26, 1.00, −0.62), yaw 6→5, r 1.52→1.47, eye 0.98, pitch −2°, f 1650, hy 780, cx −245` (LF02's camera with a small further push: the same set, lens and look, so no new look frame). Projection (est from LF02's scale, about 106 px per 0.10 m at the hands): raised hand ≈ 120 px above its table position, centre y ≈ 950, fully above the band; BOY head ≈ 410 px as LF02.
- **Light:** room light 100 % (a cut out of the dimmed diagram), lamp key, window rim; same as LF02.
- **Sound:** NAR "เหมือนสายเชิดหุ่น"; `pluck_soft-note-01_01`…`04_01` (SH01's cord notes) again, spread 0.12 s, on the first bob at 0.3 s; room bed stays at the B03 dip level (no bump on a 1 s cut).
- **Check:** elbow contact on the wood held; no finger pulled or bent back (R02); fingers read as five separate dangling shapes at 270 px; label on in its slot (R01).

### S01-B03-SH02 — L07 to "…นิ้วนาง"
- **Staging:** index's own muscle (forearm, thumb side) and cord light teal on "นิ้วชี้" (est 0.1 s), little's own on "นิ้วก้อย" (est 0.9 s); on "นิ้วนาง" (est 2.85 s) the ring cord flashes cream once, alone, and holds to the cut (3.3 s); the thumb stays unlit.
- **Camera (R1.2):** DIAG-W `r 37→33, eye 55→50`, f 2350, hy 660 (the push resumes from SH01's end across the SH07 cutaway).
- **Light:** teal on cream.
- **Sound:** `pluck_soft-note-05_01`, `06_01` on the two extras; a lone `pluck_soft-note-03_01` on the ring (2.85 s), left to ring over the cut into SH08.
- **Check:** R03.

### S01-B03-SH08 — L07 "…ไม่มี" + L08 "ต้องใช้" (new R1.5, reaction cutaway)
- **Staging (SET-DINING; est):** same seating as SH07; BOY's left hand flat on the wood at (−0.20, 0.72, −0.09), elbow (−0.13, 0.746, −0.32). 0.0 s BOY `suspicious` (one brow up, side-eye), look vector down at his left hand [0.2, 0.7]; 0.15–0.35 s his index and little lift together 2.0 cm from `flat` (MCP extension only) and hold to the cut; the ring stays flat, no gap; thumb and middle flat. ELDER at the right edge `happy`, look at BOY's hand. No speech from either.
- **Camera (est):** `cam: (−0.26, 1.00, −0.62), yaw 7→6, r 1.60→1.55, eye 0.98, pitch −2°, f 1650, hy 780, cx −245` (B01-SH02's camera: the outraged close-up returns as a quieter, suspicious one). Projection (est): the 2 cm lifts ≈ 21 px at the hand's distance; hand y ≈ 1070, above the band.
- **Light:** room light 100 %, as LF02.
- **Sound:** no SFX; the lone ring pluck from SH02 decays over the cut; NAR "…ไม่มี" then the start of L08; room bed at the B03 dip.
- **Check:** ring gap 0 px; index and little lifts ≥ 20 px; label on (R01).

### S01-B03-SH03 — L08 from "ชุดเดียวกับ"
- **Staging:** shared muscle + middle, ring, little cords amber on "ชุดเดียวกับนิ้วกลางและนิ้วก้อย" (est 0.0–1.4 s); push from 1.6 s; middle–ring tie draws in at est 3.1 s, ring–little at 3.5 s (each 0.3 s), both held to the end (4.5 s).
- **Camera:** `cam: (0.3, 1.5, 12)→(−1.2, 1.8, 3), yaw 0, r 33→16, eye 50→24, f 2350→2000, hy 660→640` (R1.2 start lens), eased 0.40–0.95 (R1.5: was 0.45–0.95 at 4.6 s). Projection (est, end): ties y ≈ 610–645, x ≈ 420–560.
- **Light:** amber + coral.
- **Sound:** three plucks as a soft chord on "ชุดเดียวกัน" (0.2 s); two soft plucks on the ties (3.1 s, 3.5 s).
- **Check:** SP2 ties ≥ 20 px; both ties present (R03).

### S01-B03-SH09 — L09 "มักอธิบายกันว่า…" (new R1.5, reaction cutaway)
- **Staging (SET-DINING; est):** B02-SH02's staging held: ELDER `front`, right hand in TP at (0.16, 0.72, −0.30) (macro, size 1.25, ring flat, faint strain tremble), the same pose and position as in B02-SH02 so his test hand continues. 0.0 s ELDER `smug` (brow quirked, half-lidded), look vector toward BOY [−0.8, 0.1]; two slow nods (each 0.3 s down-up, 6°) at 0.2 s and 0.6 s, like someone who has heard this explanation before. BOY at frame left `neutral`, look vector at ELDER's face. No speech from either.
- **Camera (est):** `cam: (0.12, 0.95, −0.45), yaw −6→−4, r 0.95→0.92, eye 1.02, pitch −6°, f 1250, hy 620` (B02-SH02's camera with a small arc; same set and look, no new look frame). Projection (est, from VD12): ELDER head ≈ 430 px at x ≈ 690; his hand ≥ 150 px wide at y ≈ 880–940.
- **Light:** room light 100 %, lamp; window rim on ELDER's screen-right side.
- **Sound:** no SFX; NAR "มักอธิบายกันว่า…" (the hedge); room bed at the B03 dip.
- **Check:** SP3 framing as B02-SH02; ELDER's ring reads flat; the nod reads as "knowing", not mocking BOY; label on (R01).

### S01-B03-SH04 — L09 from "พอนิ้วกลางพับลง"
- **Staging:** TP with the diagram on: from est 0.1 s ("พอนิ้วกลางพับลง") the middle cord darkens and bends round its folded knuckle (held); 1.2 s ("สายร่วมก็ถูกกดไว้") the middle–ring tie pulls toward the middle; 2.6 s ("นิ้วนางเลยติด") the ring cord straightens taut (highlight, 1–2 px vibration) and the ring tip rises 0.3 cm by 2.9 s and stops, held to the shot's last frame (3.6 s). Label on.
- **Camera:** CAM-TRY `yaw 168→172, r 26→24`, eye 8, f 2000, hy 760.
- **Light:** taut cord brightest.
- **Sound:** `tone_thin-unresolved_01` enters on the taut cord (2.6 s), held, unresolved.
- **Transition to B04 (R1.5; L10 no longer sits between):** a **hard cut** on the first syllable of L12 "แล้วนักเปียโนล่ะ" (est 36.5 s). The taut picture holds still to the last frame (no fade, no push-out), so the "stuck" state is the image the question cuts out of. Sound: `tone_thin-unresolved_01` is cut dead on the cut frame (no tail, no crossfade); NG-M2's first piano note lands on B04-SH01's frame 0 as the release (it replaces the L10 warm pad of R1.4). Light jumps from the dimmed warm diagram to the cool piano top light; the room bed drops out on the cut and the piano room tone takes over. The label stays on in its slot across the cut (both shots are labelled), so it does not blink. Cut, not a dissolve: a different person in a different room (R08 spirit).
- **Check:** R02 (no pain cue); the taut cord distinct from relaxed cords; the cut frame carries no tone tail.

### S01-B04-SH01 — L12 (LF04)
- **Staging (PIANO-CLOSE):** enters on a hard cut from B03-SH04's taut cord (see the transition there). Pianist's right hand over C–G (wrist (4, 6, 16)); fingers press thumb → little → back to thumb one at a time every 0.45 s (9 presses, est 0.2–4.3 s), each key dropping 1.0 cm, fluent; carries all of L12 (piano only, Q-F2; R1.5: B04 is L12 alone, no see-through pianist). Sleeve dark; no face. Label on (held from B03).
- **Camera (R1.2):** `cam: (6, 2, 2), yaw 80→74, r 34→31, eye 40, f 2300, hy 880`. Why: at yaw 35 / eye 22 the camera sat over the player's shoulder and the forearm filled the lower half (LF04 rounds 1–2); from the treble side the hand is the hero, all fingers separate and the keyboard runs through the frame. Measured (LF04, u 0.4, middle finger on E): fingertips y 794–1062 (above 1160), wrist (238, 886). The hand's key-contact pose is a **placeholder** (curved fingers solved onto the key tops; the pressing tip sits 0.2 cm into its dropped key); W5 builds `piano-press-*`.
- **Light:** cool top light, dark surround.
- **Sound:** NG-M2 fluent piano phrase, first note on frame 0 (the release of B03-SH04's cut-dead taut tone; fallback `bed_edu06-felt-piano-theme_01` excerpt); piano room tone (dining bed low-passed and lower, no clock); the phrase ends with the shot (4.5 s), and music drops to room tone on the cut to B05-SH01.
- **Check:** R05; label on.

### S01-B05-SH01 — retry
- **Staging (HAND-CLOSE):** from `flat` the middle folds to TP over 0.3 s; at 0.45 s the ring trembles up 0.4 cm and drops by 0.9 s (CL03); 0.9–1.0 s still (R1.5: shot 1.3 → 1.0 s, beats compressed).
- **Camera:** CAM-TRY `r 26→25`, yaw 168, eye 8, f 2000, hy 760.
- **Light:** room light 100 %, warm.
- **Sound:** music out; room tone + clock at the B01 level; NG-S1 tremble (0.45 s).
- **Check:** hair-lift visible, ≤ 0.4 cm.

### S01-B05-SH02 — L15
- **Staging:** BOY's hand `flat`; on "สายร่วมกับนิ้วข้าง ๆ" (est 2.6 s) a ghost (35 %) of the shared cords and both ties glows across the middle, ring and little fingers for 0.8 s (to 3.4 s), then fades; label on only during the ghost.
- **Camera (R1.2):** CAM-POV `r 26→26.8, eye 38→39`, f 3500, hy 750.
- **Light:** as frame 0.
- **Sound:** sparse plucked phrase; `stinger_pizz-tag-ending_01` on the end of the last word (est 3.9 s; peak about −10 dB, trimmed 1.4–2.2 s, 0.5–0.6 s fade; UT15).
- **Check:** ghost never brighter than 35 %.

### S01-B05-SH03 — hold
- **Staging:** hand `flat`; ring tremble ±0.05 cm for 0.0–1.0 s, then still; no speech.
- **Camera (R1.2):** CAM-POV `r 26.8→28, eye 39→40`, f 3500, hy 750, eased 0–0.8, still for the last 0.5 s = frame 0's camera.
- **Light:** frame 0's light.
- **Sound:** tag ends ≥ 0.8 s before the seam; room tone + clock flow into L01.
- **Check:** SP4 seam identity (R09).

## Dependencies and open items

- Boss: N1–N6, N8, N10–N11 (brief; N7 HAND-ROW and N9 nerve glow retired R1.5); SP1–SP4. Editor: NG-M1, NG-M2, NG-S1; V01/V02 TTS; L03 slower re-read at W4; the R1.3 lines are not read aloud yet (the W4 lock replaces the est times).
- **D01** ELDER's grin in the retry (script cue) dropped for time; restorable as a 0.8 s T-PAIR insert if the W4 lock leaves room. R1.5: ELDER now reacts in B03-SH09, so D01 matters less.
- **New cutaways (R1.5):** B03-SH07–SH09 reuse SET-DINING with LF02's camera (SH07, SH08) and B02-SH02's camera (SH09); no new look frame painted (not still-checked). New pose `new: hand-lifted-dangle` (N11) for SH07; SH08 uses the macro `flat` + index/little lift; SH09 the existing TP. They are picture-only; the user sees them as new rows on the review page.
- Open questions for the user: whether the three B03 reaction cutaways stay (new picture, no speech; review page rows). Decided by the user 2026-11-08: **Q-F1** yes, macro shots draw five separate fingers, body-scale shots keep mitten hands (UT14 exception for macro only); **Q-F2** piano only (guitar shot S01-B04-SH02 and its prop cut; ID retired); script R1.3 cuts L10 and L13, L12 kept, "แค่" kept in L15, cuts only.

## Change log

| Revision | Date | Author | Change |
| --- | --- | --- | --- |
| EDU-EP09-ROWS-R1 | 2026-11-08 | Film | First storyboard pass (W2.2), 19 shots, est 56.9 s, untimed rows; from brief EDU-EP09-BRIEF-R1. |
| EDU-EP09-ROWS-R1.1 | 2026-11-08 | Film | User decisions 2026-11-08 (Q-F1 yes, macro only; Q-F2 piano only): S01-B04-SH02 (guitar) removed, ID retired; S01-B04-SH01 carries all of L12, 4.50 s. 18 shots, est 56.9 s (unchanged); from brief EDU-EP09-BRIEF-R1.1. review-rows.json updated (ep.py), questions removed. |
| EDU-EP09-ROWS-R1.2 | 2026-11-08 | Film | W3.1 look frames LF01, LF01b, LF02, LF03, LF04 (`src/painted/edu09/`, stills `out/edu09/look-frames/v1/`, store `projects/EDU-EP09-SHORT/look-frames/`); review-rows.json `looks` + beat `look` (B01 LF01, B02 LF02, B03 LF03, B04 LF04, B05 LF01); camera lines updated for S01-B01-SH01, S01-B01-SH02, S01-B02-SH02, S01-B03-SH01–SH03, S01-B04-SH01, S01-B04-SH03, S01-B05-SH02–SH03 (user decisions 2026-11-08 + W3 framing; reasons in each shot); HAND-CLOSE ↔ dining mapping z −0.26 → −0.08. Thai rows text unchanged. |
| EDU-EP09-ROWS-R1.3 | 2026-11-08 | Film | LF02 fix round 1 (viewer check, class A + M): forearms/hands on the table = rig upper arm to an elbow on the wood + kit macro forearm and five-finger hand; S01-B01-SH02 staging and camera (yaw 7→6, cx −130) updated; review-rows LF02 still → `out/edu09/look-frames/v2/LF02.png`, caption updated; from brief EDU-EP09-BRIEF-R1.3. |
| EDU-EP09-ROWS-R1.4 | 2026-11-08 | Film | LF02 fix round 2 (last): BOY's arms bent on the wood (new elbow/hand points), ELDER's hand forward with a ribbed cuff, lens shift `cx −245`; S01-B01-SH02 staging and camera updated; review-rows LF02 still → `out/edu09/look-frames/v3/LF02.png`; from brief EDU-EP09-BRIEF-R1.4. |
| EDU-EP09-ROWS-R1.5 | 2026-11-08 | Film | Script R1.3 (cuts L10, L13; user 2026-11-08): removed S01-B03-SH05, S01-B03-SH06, S01-B04-SH03 (IDs retired, no renumbering); added picture-only reaction cutaways S01-B03-SH07, SH08, SH09 (no new speech); retimed to the script R1.3 estimate (B03 18.4–36.5, B04 36.5–41.0, B05 41.0–48.5; total 48.5 s, 18 shots); L09 → piano hard cut written; label held through B03–B04; R04 retired; from brief EDU-EP09-BRIEF-R1.5. |
| EDU-EP09-ROWS-R1.6 | 2026-11-08 | Film | User request: kit hand macro distal segment longer (Boss be7b405); LF01/LF01b/LF02/LF03/LF04 re-rendered in place; review-rows.json LF02 look gets `changed` "ปลายนิ้วยืดขึ้นเล็กน้อยตามที่ผู้ใช้บอก" (also appended to its caption so the page shows it). No shot, timing or narration change. Brief R1.6. |
