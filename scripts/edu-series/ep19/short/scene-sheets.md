# Scene sheets and index — EDU-EP19-SHORT (EDU-EP19-SHEETS-R3)

- **Deliverable:** `EDU-EP19-SHORT` (channel **edu**) · **Revision:** EDU-EP19-SHEETS-R3 (Film W5.1 timed pass after the voice lock, 2026-11-15; R2 Film W3.2, R1 Film W2.2) · **Status:** `ready-for-dev` · **Timing:** `checked-with-audio` (every line placed from the Editor's measure file EDU-EP19-VOICE-R2; inner word anchors measured by Film with `silencedetect` −32 dB / 0.05 s on the same take and girl files; picture beats are authored frames, not measured).
- **Evidence:** runtime none · look frames v6 by Boss (`out/edu19-lf/v6/`, store `previews/EDU19-LF/v6/`) **approved by the user = look lock** (2026-11-15) · projection: `scripts/shot-projection.py` values per shot from R2 (cameras unchanged in R3; only frame ranges and local event frames moved) · audio/subtitle sync: line placement and subtitle ranges computed from measured audio, not rendered or listened · user approval: script wording R4, NAR take r4_t1_slow8 (W1.4b), girl voice Gemini Leda V01–V06 (W4.3, relayed by the coordinator 2026-11-15), look frames v6 (W3.3). This sheet revision is not user-approved.
- **Inputs (by revision):** script **EDU-EP19-SCRIPT-R4** ([script.md](script.md): beats B01–B04, lines L01–L10, V01–V06, W-WAIT, W-SNIFF, W-MATS, W-HOLD, clue ledger CL01–CL04, sound intent); fact-check [fact-check.md](fact-check.md) R1 + R3 recheck (`ready-for-storyboard`); brief **EDU-EP19-BRIEF-R2** ([film-brief.md](film-brief.md): VD01–VD17, N1–N9, [projection contract](film-brief.md#projection-contract-and-scale-baseline), [set plan](film-brief.md#set-plan--set-field19-space-f-metres-est), [sound direction](film-brief.md#sound-direction)); voice measure **EDU-EP19-VOICE-R2** ([voice-measure.md](voice-measure.md) / [voice-measure.json](voice-measure.json)): NAR files `out/ep19-narr/lines_norm/L*.wav` (store `projects/edu/EDU/audio/`), girl files `out/ep19-narr/girl_norm_leda/V0n.wav` (store `projects/edu/EDU/audio/2026-11-15_ep19-girl-leda-v0n-norm.wav`).
- **Target:** branch `claude/edu-ep19-continue-25af15` at `6ad88fb` + uncommitted EP19 files · 30 fps · `durationFrames` **1704** (56.8 s) · 1080×1920 · composition `EDU-EP19-SHORT` (registered by the Editor, never in `src/Root.tsx`) · ending closed: W-HOLD 64 f, `A_fade` over the last 24 f, no loop seam.
- **Review rows:** [review-rows.json](review-rows.json) **EDU-EP19-ROWS-R4** (Thai, timed `start`/`end` per shot; looks v6 kept). Review page: pending.

## Units and conventions

- Spaces `F` (field), `S` (soi inset), `V` (vignette px) and the `camMove` formula as in the brief's [projection contract](film-brief.md#projection-contract-and-scale-baseline) (brief: VD01). `F`: origin M0 at the trail midpoint, +x toward the tree (screen right), +z toward the open lawn (camera side), yaw 0 looks at the fence. Every number is `est` (Film pinhole check, not rendered); Boss tunes within ±10 % and records changes.
- **Clocks.** `G` = composition frame; shot-local `l` = G − shot start. Ranges are half-open `[start, endExclusive)`. Default eases: `easeInOutSine` camera, `easeOutCubic` arrivals.
- **Projection lines** give pixel x,y (origin top-left) of the named anchors at the shot's first/last frame and the lead's height in px.
- **Frame zones:** caption band y 1176–1344; faces, the dog's nose, the print under the nose and the prints ahead of it, the stopwatch face and the mat order above y 1160 (R2: prints already passed may run into the band in travel shots, B01-SH06); people's legs and the dog's legs may run into and below the band; mark top-left clear x < 330, y < 140.
- <a id="fr-frame-rule"></a>**FR — field framing (R2, brief VD14; user verdict 2026-11-15: "the lower half of every field frame is empty lawn").** Every field shot is re-checked against: **FR1** the lead group's vertical extent (top of the highest lead to the lowest story contact) is centred at y 860–1010; **FR2** the FR1 floor above (faces/nose ≤ 1160); **FR3** the horizon (lawn/fence line) sits at y 360–700 by raising the eye and pitching down, not by shifting the picture up; **FR4** a dog-card shot pitches no steeper than −12° (B01-SH04's −24° made the front card read flat; Boss W3.1), people and mats-only shots may go steeper; **FR5** close working shots grow the lead (dog ≥ 380 px, girl ≥ 480 px, VD10 R2). In shots whose lowest story contact is the nose on the ground, FR2 floors the action at y ≈ 1150, so y 1160–1920 stays near ground: there it is the painted near shade (value one step under the lit lawn, so the stroke captions read), never a bright empty lawn (FQ1 answered 2026-11-15: near shade, Boss `nearShade` y 1160). Shots marked **"R1 kept (meets FR)"** were checked and need no change.
- **Glow ladder (R2, brief VD04 R2; user 2026-11-15: size, not opacity).** Every `level` number below is read as a **size step**: 0.08 → S1, 0.10–0.12 → S2, 0.14–0.17 → S3, 0.23–0.26 → S4, 0.28–0.30 → S5; halo radius = r0 × {S1 0.40, S2 0.55, S3 0.70, S4 0.85, S5 1.00} (r0 0.22 m on a print, 0.40 m on a mat), at **one fixed opacity 0.26** (≤ GLOW_PEAK 0.3) for every lit spot; curl height scales with the step (0.06–0.15 m). Ramps keep their timing (6 f in, 12 f out) as a radius ramp.

## Casting, props and hands

| Character | Casting line | Notes |
| --- | --- | --- |
| GIRL | `girl-school + park-casual (cap off, tee recoloured coral #e0654f), P35 crouch_hide (R2: side view in B01-SH07) · P33 side, arms back (R2, B01-SH07: new arm variant "sit_floor_lean_back", hands planted behind the hips) · P43 peek_around · P12 surprise_cover_mouth · P08 celebrate_V · P38 run · P33 sit_floor_hug_knees · new: crouch-sniff · new: one-finger idea (try P27 count_fingers, one finger, first)`; expressions happy, sly, smug, shocked, gleeful | 1.34 m; pigtails with red ties kept |
| MUM | `woman-ponytail + new: trainer vest (olive multi-pocket vest over grey tee, khaki cargo trousers, treat pouch on the right hip, stopwatch on the left wrist), P01 (line in left hand) · new: crouch-swap-mats`, calm → amused | 1.64 m; never speaks |
| DOG | `dog-black-lab, stand, sniff` + `new: tracking harness (orange #e8892f, back ring) + long line (5 m, orange-red)`; motions `walk-in`, `new: sniff-track`, trot, `new: lick`, `happy-wag`, `new: look-left-right`, `sit-down`, `new: head-tilt` | front/left/right views only (kit) |
| YOU (inset) | `woman-bob + hoodie`, back view, `walk-in-from-left` | inside the L03b vignette only |

Kit layers used: ENV-SKY (`sky.ts`). Plates: none (PL-EDU-PARK is reference only).

**Props and hands (entry → exit per shot).** Long line: always MUM's **left** hand → harness ring when MUM is in the shot with the dog; she unclips it off-screen before the dog runs to the tree (B01-SH06, B02-SH06 trot free; the harness stays on). Stopwatch: MUM's left wrist; she presses it with her right index finger (B02-SH02) and raises the left wrist to read it (B02-SH03, B02-SH06); the left hand can hold the line while the wrist is raised. Mats: GIRL drags the top mat with **both** hands (B03-SH02); in B03-SH03 she has no mat in hand when she hops; MUM swaps with both hands, the long line coiled over her shoulder (B03-SH04) and back in her left hand in B03-SH05. GIRL's hands are empty in every other shot (mouth cover, fists, finger).

## Narration and girl-line placement (checked-with-audio, EDU-EP19-VOICE-R2)

The Editor places **one file per line**. NAR: speech G = take time × 30 + offset; each NAR file carries a 30 ms (1 f) head pad, so its **file start = speech onset − 1 f**. Girl files are placed by file start (their 30 ms pad and trimmed lead are inside the file; speech starts ≈ 1 f in) and run their full length; **no stretching** (Editor rule, measure file). Take times and line edges are the measure file's; inner anchors are Film's `silencedetect` pauses (−32 dB, 0.05 s) on `r4_t1_slow8.wav` and on the girl files (±1 f; V03 anchor ±3 f, a listening check).

| Line | Thai | Take s (measure) | Offset f (s) | File start G | Speech G [on, end) | Subtitle G [start, end) | Inner anchors (G) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| L01 | หมาตามรอยที่ฝึกมา… ดมรอยเท้าคุณแค่ห้ารอย ก็บอกได้แล้วว่าคุณเดินไปทางไหน | 0.24–5.02 | 0 (0) | 6 | 7–151 | 7–157 | "ดมรอยเท้าคุณ" 49 |
| L02 | ทุกรอยก็กลิ่นคุณเหมือนกันนี่… รู้ได้ไง | 5.66–8.05 | 0 (0) | 169 | 170–242 | 170–248 | "รู้ได้ไง" 226 |
| L03 | รอยที่เหยียบก่อน… น่าจะจางกว่า | 8.77–10.77 | 0 (0) | 262 | 263–323 | 263–329 | "น่าจะจางกว่า" 296 |
| L03b | เหมือนคุณเดินตามกลิ่นข้าวผัด… ไปทางที่หอมขึ้นเรื่อย ๆ | 11.00–14.79 | 0 (0) | 329 | 330–444 | 330–448 | "ไปทางที่หอมขึ้นเรื่อย ๆ" 387; last word ends ≈ 433 (14.42 s), a 1 f tail blip at 443 |
| V01 | โธ่… เจอจนได้! | file 1.934 s = 59 f | — | 447 | 448–505 | 448–511 | "เจอจนได้!" 478 (file 1.03 s) |
| L04 | กลิ่นยิ่งเก่า ยิ่งจาง… เธอเลยมีแผน | 14.97–17.49 | 62 (2.067) | 510 | 511–587 | 511–593 | "เธอเลยมีแผน" 566 |
| V02 | แม่ รอยี่สิบนาทีนะ… กลิ่นหายหมดแน่ | file 2.744 s = 83 f | — | 593 | 594–675 | 594–681 | "ยี่สิบนาที" ≈ 612 (est); "กลิ่นหายหมดแน่" 646 (file 1.75 s) |
| W-WAIT | — | — | — | — | 676–721 | — | — |
| V03 | ฟุดฟิด… หายเกลี้ยงแล้ว! | file 2.519 s = 76 f | — | 721 | 722–796 | 722–802 | "ฟุดฟิด" 722–730; "หายเกลี้ยงแล้ว!" 763 (file 1.39 s, ±3 f) |
| W-SNIFF | — | — | — | — | 797–869 clean (72 f, VD11) | — | sniff continues under L05a to 940 |
| L05 | แต่รอยบนหญ้าที่ทิ้งไว้ยี่สิบนาที… หมาตามรอยก็ยังเลือกทางถูก | 18.24–22.19 | 322 (10.733) | 868 | 869–988 | L05a 869–941 · L05b 941–994 | "หมาตามรอยก็ยังเลือกทางถูก" 941 |
| V04 | ห๊ะ!? ยังได้อีก | file 1.358 s = 41 f | — | 993 | 994–1033 | 994–1039 | "ยังได้อีก" 1012 (file 0.65 s) |
| L07 | แต่ถ้ามันไล่ดมทีละรอย… งั้นสลับลำดับรอยดูสิ | 22.47–25.80 | 366 (12.200) | 1039 | 1040–1140 | L07a 1040–1101 · L07b 1101–1146 | "งั้นสลับลำดับรอยดูสิ" 1101; "สลับลำดับรอย" ≈ 1120 |
| V05 | (giggle) ฮิ ฮิ | file 0.650 s = 20 f | — | 1143 | 1144–1162 | not subtitled | — |
| W-MATS | — | — | — | — | 1163–1307 (144 f) | — | — |
| L08 | พอสลับลำดับรอย… ลำดับกลิ่นก็มั่ว หมาตามรอยก็บอกทางไม่ได้ | 26.32–31.14 | 520 (17.333) | 1309 | 1310–1454 | L08a 1310–1353 · L08b 1353–1397 · L08c 1397–1460 | "ลำดับกลิ่นก็มั่ว" 1353; "หมาตามรอยก็บอกทางไม่ได้" 1397; last word ends ≈ 1444 (30.81 s), tail blip to 1454 |
| V06 | (whisper) เย้! | file 0.917 s = 28 f | — | 1459 | 1460–1486 | 1460–1492 | — |
| L10 | เวลาที่ผ่านไป ไม่ได้ซ่อนเธอ… ลำดับที่ถูกสลับ ต่างหากที่ซ่อนเธอ | 31.30–36.19 | 554 (18.467) | 1492 | 1493–1640 | L10a 1493–1562 · L10b 1562–1646 | "ลำดับที่ถูกสลับ" 1562; "ต่างหากที่ซ่อนเธอ" 1603 |
| W-HOLD | — | — | — | — | 1640–1704 (64 f) | — | `A_fade` 1680–1704 |

**Gaps between voice files** (file end → next file start): 5–6 f everywhere except the designed silences (W-WAIT 45 f, W-SNIFF 72 f, W-MATS 144 f). **Girl windows widened by their full overshoot** (V01 +23 f to 59, V02 +17 to 83, V03 +31 to 76, V04 +2 to 41, V05 +2 to 20, V06 +10 to 28; R2 windows 36/66/45/39/18/18). The total is 1704 f, not the measure file's 1676 f estimate, because the measured NAR edges also moved against the R2 silencedetect values: L03b ends 14.79 s (R2 14.41, +11 f), L07 starts 22.47 s (R2 22.70, +7 f), L08 ends 31.14 s (R2 30.80, +10 f).

**Subtitles:** each subtitled line displays over its listed G range (speech end + 6 f, never past the next line's onset); split lines change card on the inner anchor; V05 is not subtitled; no on-screen text otherwise. Stroke captions in the band y 1176–1344.

## Shot map

| Shot | Beat | G range [start, end) | Lines | Claims / clues |
| --- | --- | --- | --- | --- |
| B01-SH01 | B01 | 0–48 (48 f) | L01 (start) | F001/F002 picture; CL02 plant; CL03 |
| B01-SH02 | B01 | 48–162 (114) | L01 | F001, F006; CL03, CL04 |
| B01-SH03 | B01 | 162–252 (90) | L02 | F003 |
| B01-SH04 | B01 | 252–332 (80) | L03 | F004 (hedged; glow illustration); CL04 |
| B01-SH05 | B01 | 332–399 (67) | L03b | F004 analogy |
| B01-SH06 | B01 | 399–446 (47) | L03b end | CL04 |
| B01-SH07 | B01 | 446–508 (62) | V01 | dramatisation |
| B02-SH01 | B02 | 508–591 (83) | L04 | refrain |
| B02-SH02 | B02 | 591–676 (85) | V02 | CL01 |
| B02-SH03 | B02 | 676–721 (45) | W-WAIT | N4 (no glow) |
| B02-SH04 | B02 | 721–797 (76) | V03 | F008 handling (dramatisation) |
| B02-SH05 | B02 | 797–940 (143) | W-SNIFF, L05a | F006; CL03 |
| B02-SH06 | B02 | 940–991 (51) | L05b | F009 replacement line |
| B02-SH07 | B02 | 991–1037 (46) | V04 | dramatisation |
| B03-SH01 | B03 | 1037–1100 (63) | L07a | F006 premise |
| B03-SH02 | B03 | 1100–1163 (63) | L07b, V05 | CL02 paid |
| B03-SH03 | B03 | 1163–1205 (42) | W-MATS (lay, step) | F003 staging (SRC001) |
| B03-SH04 | B03 | 1205–1235 (30) | W-MATS (shuffle) | F003 staging |
| B03-SH05 | B03 | 1235–1307 (72) | W-MATS (dog fails) | F003 staging; CL04 jumbled |
| B03-SH06 | B03 | 1307–1397 (90) | L08a, L08b | F003; CL04 (ghost row) |
| B03-SH07 | B03 | 1397–1457 (60) | L08c | F003 result |
| B04-SH01 | B04 | 1457–1490 (33) | V06 | dramatisation |
| B04-SH02 | B04 | 1490–1704 (214) | L10, W-HOLD | F003, F009 replacement (flip) |

23 shots, 1704 f (56.8 s), contiguous. Runtime mapping: planned one painted scene per shot in `src/painted/edu19/shots.tsx` (Editor/Boss); unverified.

## Sound plan (whole video)

Bed **M1** (candidate `bed_comic-pizz-marimba-pulse_01`, Ton confirms by ear, else NEEDS-GEN to the brief) from G 0; ambience **A1** field (NEEDS-GEN) under every field shot; **A2** soi (NEEDS-GEN) inside the inset only; **G1–G5** glow tones (NEEDS-GEN pitched set: soft celesta/glass plinks, 0.35 s each, rising pentatonic C–D–E–G–A, dry, close, "a little light switching on in your head"); **M2** warm resolve (NEEDS-GEN); **E1** ending (NEEDS-GEN). Mix intents per shot follow [EP08a](../../../../docs/editor-principles.md#ep08a-shape-audio-emphasis-by-story-beat); the Editor sets levels. Cue IDs below (S01…) are this deliverable's cue-sheet IDs for Ton.

## Shot sheets

### B01-SH01 · 0–48 · the dog comes in (L01 start)

- **Purpose:** frame 0 holds the strange thing (UT01, retention camera): a harnessed dog led onto a trail in a field, a girl hiding at the tree, the mat stack by the fence (CL02 plant, no emphasis).
- **Camera (F, R2):** `camMove(at [(2.2,0.5,−2.2),(2.1,0.5,−1.9)], yaw [56,50], r [5.6,5.0], eye 1.8, {f 950, hy 720, pitch [−9,−9]})` over l 0–48, `easeInOutSine` (6° arc, 11 % push). Camera at (−2.44,1.80,0.93) → (−1.73,1.80,1.31); horizon y 570. R2 reason (FR, LF01): R1 sat the whole cast at y 694–925 with ~1000 px of lawn below and small figures; the camera moves to the swing side, higher and pitched down 9°, so the **trail runs as a diagonal from the bottom of the frame to the tree** (the prints fill the lower half as a leading line) and the cast grows +35–60 %. (R1: `camMove(at [(2.2,0.5,−2.2),(2.0,0.5,−1.8)], yaw [46,38], r [6.0,5.3], eye 1.1, {f 760, hy 760})`.)
- **Staging:** DOG front view (heading +z, ≈ 30° off the lens) walks from (0,0,−3.2) l 0 to (0,0,−0.6) l 48, 1.6 m/s easing to 1.0 m/s, nose already dipping at l 36; tail level. MUM front view, P01, from (0.75,0,−4.4) to (0.75,0,−3.0) (R2: x 0.75, Boss W3.1 change accepted by the user), left hand holding the line (sag 0.25 m). GIRL at GP (P43 peek_around, head and coral shoulder out at the trunk's +z edge, happy-sly), pulls back behind the trunk l 24–34. Prints along z 0 visible as pressed ovals (no glow yet).
- **Projection (R2):** start dog (100–111, 803–949) 146 px, MUM (92–111, 597–866) 270 px, GIRL head at GP (1036–1040, 636–678; head 42 px, peeking at the right edge), trunk base (973, 788), stack top (67, 725), prints +1.2 (858, 1028), +3.6 (971, 871), −1.2 (499, 1524, below the band: an unlit print, the trail's near end); end dog (415–420, 955–1187) 232 px, nose (536, 1153), MUM (190–208, 603–923) 321 px, GP (1100, 644) off frame right (she has pulled back, l 24–34). Group extent 597–1187, centre 892 (FR1). **Exception (VD10):** establishing wide; the dog reaches ≥ 398 px in SH02.
- **VO/subs:** L01 file at G 6, speech from G 7 (l 7): "หมาตามรอยที่ฝึกมา…"; subtitle L01 G 7–157 (spans SH01–SH02).
- **Sound:** A1 from l 0 (wind in short grass, two far birds, a far-off kid's shout once at l 20 (G 20); open, airy, "a quiet afternoon at the training field"). **S01** harness clip jingle (NEEDS-GEN; `foley_dog-collar-jingle_01` is a collar, try it first; small metal clip on nylon webbing bouncing with each step, close-mid, 1.5 s, "a working dog on duty") from l 0 (G 0). **S02** paws on grass, light patter, 4 steps from l 4 (G 4) (NEEDS-GEN, 1.5 s). M1 enters at l 7 (G 7) on the first syllable, energy 2, tiptoe pizzicato.
- **Mix intent:** lift (open on the setup).
- **Cut:** hard cut on the dog's nose dip to SH02.
- **Entry → exit:** cold open → dog at (0,0,−0.6) nose dipping, MUM at (0.35,−3.0), GIRL hidden.
- **Acceptance:** l 0 shows dog + harness + line + MUM + the tree with GIRL peeking + the stack by the fence, no text; the tree is screen right; the dog walks toward the trail, which runs from the frame bottom to the tree; no glow; FR1 centre 860–1010 at l 47.

### B01-SH02 · 48–162 · nose on five prints (L01)

- **Purpose:** the dog slows and reads the prints **one after another** (CL03); five prints light up in order, dim to bright (CL04).
- **Camera (F, R2):** nose vantage (VD05 R2) `camMove(at [(−1.57,0.3,−0.1),(0.83,0.3,−0.1)], yaw [−4,2], r 1.9, eye 0.85, {f 1300, hy 660, pitch [−6,−6]})`; the target follows the **dog's body** (ground point + 0.25 m), linear l 0–96 with the nose, then holds l 96–114. Camera (−1.44,0.85,1.80) → (0.76,0.85,1.80); horizon y 523. R2 reason (FR, LF02): eye up 0.3 m and 6° down so the field, not the sky, is behind the dog; longer lens, dog +17 %. (R1: `at [(−0.5,0.3,−0.2),(0.4,0.3,−0.2)], yaw [−4,2], r [1.9,1.75], eye 0.55, {f 950, hy 820}`; Boss W3.1 target −0.15 → 0.75.)
- **Staging (R2, Boss W3.1 feasibility change accepted by the user):** DOG `new: sniff-track` in **right profile** (half-speed walk, head low, F006), ground point (nose − 0.62, 0, −0.12), the gait clock following the distance travelled so the planted paws hold. Nose path (y 0.06, z 0): over print x −1.2 at l 0, −0.6 at l 24, 0 at l 48, +0.6 at l 72, +1.2 at l 96, then nose-down on +1.2 with a head swing back toward +0.9 l 100–114 (hesitates; does **not** turn; the body holds). Each print lights as the nose passes (VD04 R2 round-1 size steps, left→right S1, S2, S3, S4, S5 = levels 0.08, 0.12, 0.17, 0.23, 0.30) and stays lit inside the 1.3 m radius. Tail still, ears forward. MUM off frame (line enters top-right toward the harness ring).
- **Projection (R2):** start dog paws (380, 1075), top 677: 398 px, tail (24, 784), nose (795, 1082), print −1.2 (800, 1146); end paws (376, 1082), top 680: 402 px, nose (797, 1071), prints +0.6 (387, 1096) and +1.2 (808, 1133); the next print ahead is off frame right until the truck reaches it (two to three lit prints in frame at a time; the whole ladder is SH04's job). Dog extent 677–1082, centre 880 (FR1); nose and lit prints ≤ 1146.
- **VO/subs:** L01 continues; "ดมรอยเท้าคุณ" at G 49 (l 1) with the first sniff; speech ends G 151 (l 103), subtitle to G 157 (l 109): "ดมรอยเท้าคุณแค่ห้ารอย ก็บอกได้แล้วว่าคุณเดินไปทางไหน".
- **Sound:** **S03** sniff bursts (lib candidate `creature_dog-sniff-snuffle_01` minus its snort, else NEEDS-GEN): quick sniff-sniff on each print at l 0, 24, 48, 72, 96 (G 48, 72, 96, 120, 144), close, nose-level, dry. **G1–G5** at l 2, 26, 50, 74, 98 (G 50, 74, 98, 122, 146; one per print as it lights, each a step higher). M1 continues, energy 2, ducked under L01.
- **Mix intent:** hold.
- **Cut:** hard cut to SH03 at l 114.
- **Entry → exit:** dog at M0 front paws (0,−0.5) → (0.2,−0.45), five prints lit.
- **Acceptance:** the five prints light in left-to-right order on the listed frames, each halo one size step larger; the largest is nearest the tree side; the nose crosses each print centre within ±3 f; dog ≥ 380 px; the long line enters from the top right.

### B01-SH03 · 162–252 · "รู้ได้ไง" (L02)

- **Purpose:** the objection: every print is her. Macro nose, a mock-puzzled pause.
- **Camera (F, R2):** `camMove(at [(0.1,0.1,−0.05),(0.5,0.1,−0.05)], yaw [12,6], r [0.95,0.85], eye 0.32, {f 1000, hy 760})`, l 0–65 then 2 % drift. R2: hy 700 → 760 only (FR1: the head moves 60 px down toward the centre; the print under the nose stays ≤ 1160).
- **Staging:** DOG nose over print x 0 (lit S3) l 0–30, moves to print +0.6 (lit S4) by l 50, sniff puffs ruffling grass blades; on "รู้ได้ไง" (G 226, l 64) the nose stops, both ears lift 10°, eyes flick up toward the lens (head stays low) and hold to l 90.
- **Projection (R2):** start nose (441, 1055), eye (301, 900), ear tips (177, 688), print 0 (450, 1154); end nose (669, 1081), eye (522, 910), ear tips (395, 684), print +0.6 (651, 1123). Head extent 684–1081, centre 883 (FR1).
- **VO/subs:** L02 file G 169, speech G 170–242 (l 8–80), subtitle G 170–248: "ทุกรอยก็กลิ่นคุณเหมือนกันนี่… รู้ได้ไง".
- **Sound:** **S04** close sniffs l 0–60 (G 162–222; same family as S03, slower: soft nasal draws on short grass, close, dry). M1 **pauses** at l 64 (G 226) for "รู้ได้ไง" (sniffs stop too: one beat of air), resumes on the cut at l 90 (G 252).
- **Mix intent:** drop on "รู้ได้ไง".
- **Cut:** hard cut to SH04.
- **Entry → exit:** two prints lit in close-up; the dog's eyes up.
- **Acceptance:** face and nose above y 1160; the pause lands on G 226 ± 3.

### B01-SH04 · 252–332 · the earlier print is fainter (L03)

- **Purpose:** the hedged answer made visible: the glow ladder reads dim (swing side) to bright (tree side); the dog chooses.
- **Camera (F, R2):** raised three-quarter `camMove(at [(0.1,0.25,−0.1),(0.2,0.25,−0.1)], yaw [−34,−26], r [2.7,2.45], eye 1.2, {f 1100, hy 690, pitch [−10,−10]})`, l 0–80. Camera (1.61,1.20,2.14) → (1.27,1.20,2.10); horizon y 496. R2 reason: Boss W3.1 found the front dog card flat under the −24° pitch, and FR: R1 sat the ladder at y 650–1009 with lawn below. The camera drops to 1.2 m and −10° (FR4) and turns 6° more toward the tree side, so the five prints climb from far-left (S1) to near-right (S5) and the near print lands just above the band; perspective and the size ladder grow in the same direction (the arrow points at the camera's right, toward the tree). (R1: `at [(0.2,0.2,−0.2),(0.3,0.2,−0.2)], yaw [−28,−20], r [2.8,2.5], eye 2.1, {f 950, hy 600, pitch [−24,−24]}`.)
- **Staging:** five prints lit at round-1 size steps S1–S5; on "น่าจะจางกว่า" (G 296, l 44) every halo swells one notch (+15 % radius, order kept) for legibility (R2: replaces "brightens 20 %"). DOG lifts head l 50–58, turns its body toward +x l 58–72 (cut-on-turn front → right profile at l 66), first step toward the tree l 74.
- **Projection (R2):** start dog (593–596, 696–975) 279 px; prints −1.2 (165, 885), −0.6 (337, 911), 0 (470, 978), +0.6 (710, 1018), +1.2 (963, 1127); end dog (563, 711–1008) 297 px; prints (63, 932), (266, 952), (431, 1020), (697, 1049), (985, 1153). Group extent 696–1153, centre 925 (FR1). **Exception (VD10):** the ladder is the subject.
- **VO/subs:** L03 file G 262, speech G 263–323 (l 11–71), subtitle G 263–329; "น่าจะจางกว่า" G 296 (l 44). L03b speech starts G 330 (l 78), on the iris's last 2 f (its subtitle from G 330).
- **Sound:** G1–G5 replayed as a quick rising arpeggio at l 44 (G 296; doubles the ladder), soft, 0.6 s. **S05** harness jingle on the turn l 62 (G 314; one shake of the clip as the body swings, 0.5 s). M1 back at energy 2, steps up at l 66 (G 318; pizzicato climbs).
- **Mix intent:** lift on the turn.
- **Cut:** iris-in to the inset over l 71–80 (G 323–332; vignette opens, 9 f; N8 capability check; fallback hard cut at G 330 on the L03b onset).
- **Entry → exit:** head low → dog in right profile, first step to the tree.
- **Acceptance:** the five size steps are distinguishable on a 270 px contact sheet; the dog card does not read flat (no visible squash at −10°); the dog turns toward screen right.

### B01-SH05 · 332–399 · the fried-rice comparison (L03b)

- **Purpose:** everyday analogy: you follow the smell toward where it gets stronger. Styled apart (VD07).
- **Frame:** vignette `V` circle centre (540, 760), Ø 820 px (y 350–1170, above the band), cream ring 10 px; behind it the SH04 end frame held and dimmed to 55 % (R2: the new SH04 camera, so LF04's background is repainted; the inset itself is unchanged).
- **Camera (S, inside the circle):** `camMove(at [(0,0.9,0),(2.2,0.9,0)], yaw [90,86], r [2.4,2.2], eye 1.3, {f 900, hy 760})`: trucking behind the walker toward the stall (+x).
- **Staging:** YOU back view walks x 0 → 2.2 (1.0 m/s); soi at dusk, shophouse fronts, a street-food stall at x 6 with a bulb and a wok; a smell curl (same drawing as the print curls) rises from the wok and drifts toward YOU, thin at l 0, doubled in width on "ไปทางที่หอมขึ้นเรื่อย ๆ" (G 387, l 55; measured); YOU's head lifts, sniffing, at l 55.
- **VO/subs:** L03b speech G 330–444 (began in SH04 at l 78; here l 0–67), subtitle G 330–448: "เหมือนคุณเดินตามกลิ่นข้าวผัด… ไปทางที่หอมขึ้นเรื่อย ๆ".
- **Sound:** A2 soi from l 0 (G 332; wok sizzle, stall hum, a far motorbike; warm, close; fades in over the SH04 iris G 323–332). **S06** wok toss sizzle swell (NEEDS-GEN; `foley_fish-grill-sizzle_01` is grill not wok, try first): rising sizzle at l 50 (G 382), 1.0 s, "smell you can hear". A2 and S06 cut out with the iris-out l 58–67 (G 390–399). M1 under at energy 1.5.
- **Mix intent:** hold, then release into SH06.
- **Cut:** iris-out l 58–67: the circle grows to full frame and becomes SH06.
- **Acceptance:** reads as "a person walking toward a fried-rice stall" within 1 s; the curl thickens toward the stall; nothing of the inset sits in the band.

### B01-SH06 · 399–446 · along the brightening prints (L03b end)

- **Purpose:** payoff of round 1's reading: the dog follows the prints toward the stronger end.
- **Camera (F, R2):** `camMove(at [(1.8,0.4,0),(5.2,0.4,0)], yaw [66,72], r [3.4,2.7], eye 1.1, {f 1200, hy 720, pitch [−7,−7]})` over l 0–47, truck following the dog. Camera (−1.31,1.10,1.38) → (2.63,1.10,0.83); horizon y 573. R2 reason (FR): the trail behind the dog now runs down to the frame's lower left; dog +35 %. (R1: `at [(1.8,0.4,0),(5.4,0.4,0)], yaw [70,76], r [4.2,3.2], eye 0.8, {f 950, hy 760}`.)
- **Staging:** DOG trot, right profile, from (1.0,0,0) l 0 to (4.9,0,0.2) l 47 (2.5 m/s, a working trot; R3: the shot grew 35 → 47 f with the measured L03b end, path unchanged), off the line (MUM unclipped it off screen). Prints ahead light within 1.3 m as it passes, each brighter than the last (continuing the ladder at S5). GIRL's shoulder visible at GP (711, 721) → (586, 681), pulls back at l 27.
- **Projection (R2):** start dog (396–400, 787–1050) 263 px, nose (510, 813), print ahead (534, 976), print behind (266, 1174), trunk base (755, 750), GP (831, 565); end dog (587–589, 815–1111) 296 px, prints ahead (602, 1005) / (609, 934), print behind (409, 1257: in the band, allowed for passed prints, FR), trunk base (497, 933), GP (645, 557). Group extent 787–1111, centre 950 (FR1). **Exception (VD10):** travel shot.
- **VO/subs:** L03b's last word ends ≈ G 433 (l 34); its file ends G 445; subtitle L03b to G 448.
- **Sound:** **S07** paws trotting on grass from l 0 (G 399; lib candidate `foley_dog-paws-gallop-skid_01` first 0.8 s without the skid, else NEEDS-GEN: light quick four-beat trot on short dry grass, close-mid, 1.5 s, "on the scent, sure of itself"); G-tones continue rising, two notes at l 10, 30 (G 409, 429). M1 at energy 3, eases to 2 by l 44 (G 443) to clear V01.
- **Mix intent:** lift.
- **Cut:** hard cut at l 47 (G 446) on the dog reaching the trunk, 1 f before the V01 file.
- **Acceptance:** dog moves screen left → right; prints brighten in its direction of travel.

### B01-SH07 · 446–508 · "โธ่… เจอจนได้!" (V01)

- **Purpose:** round lost; affection; comic warmth.
- **Camera (F, R2):** `camMove(at (6.5,0.45,−0.25), yaw [−24,−16], r [1.8,1.65], eye 0.95, {f 1300, hy 770, pitch [−7,−7]})`; trunk screen left, GIRL right of centre. Camera (7.23,0.95,1.39) → (6.95,0.95,1.34); horizon y 610. R2 reason: FR (LF03 sat the pair at y 814–1345 with lawn below) and the user's LF03 notes (legs, dog neck). Supersedes Boss's W3.1 tune (f 1080, r 1.62, accepted for GIRL ≥ 480 px and kept as the minimum). (R1: `at (6.7,0.5,−0.4), yaw [−24,−16], r [1.9,1.7], eye 1.0, {f 1000, hy 700}`.)
- **Staging (R2):** GIRL crouched at G1 in **left profile** (P35 side = squat, facing screen left toward the dog), happy → laughing; on "เจอจนได้!" (G 478, l 32) she falls back, l 30–48, onto her bottom into **P33 side with the arms back** (`new: sit_floor_lean_back`: knees up, hands planted behind the hips, head tipped back laughing). **Legs fix (user LF03 note), by pose:** the kit's P35 *front* crouch draws straight shins under a hovering seat, which read as odd legs; the side squat and the side floor-sit show bent knees in silhouette. A front three-quarter (`facing`, view cues) is allowed only if Boss's still shows the P35/P33 legs bending correctly in that view; otherwise profile. DOG comes round the trunk's open-lawn (+z) side from screen left in right profile, ground point **(6.1, 0, 0.1)** (R1/W3.1: (6.3, 0, −0.18) with `lean: 1, leanTo` to the cheek), head raised 12° on the kit neck, nose tip at her cheek (6.62, 0.64, −0.25), `new: lick` l 6–30 (V01 "โธ่…" plays under the lick), tail `happy-wag` throughout. **Neck fix (user LF03 note), by moving the dog back:** the shrunken neck came from `leanTo`/`leanAnchor: 'nose'` pulling the head to a point nearer than the kit neck reaches; R2 drops the lean, keeps the kit neck geometry and places the dog 0.27 m back along its heading so the nose reaches her cheek at the neutral neck length; Boss tunes the ground point ±0.1 m to land the contact, never by shortening the neck. Through the fall (l 30–48) her cheek moves away and the dog's nose follows by a half step (no lean). She holds the floor-sit laughing l 48–62. Tree shade disc covers G1 (Boss W3.1, accepted). R3 timing note: the approved look frame LF03-FALL was painted at R2 l 34; the same pose is now reached at l 48 (pose and camera unchanged).
- **Projection (R2):** start GIRL crouched (743–754, 673–1238) 565 px, face (693, 780); dog (140–162, 730–1323: near paw in the band, allowed), nose at her cheek (620, 839), tail off frame left; trunk base (310, 1166), trunk edge at 1.2 m (520, 441); end GIRL (745–757, 677–1274) 597 px, face (690, 791), dog nose (631, 858). Group extent 673–1274, centre 974 (FR1). Faces above the band; her feet in the band (allowed).
- **VO/subs:** V01 file G 447 (l 1), speech G 448–505 (l 2–59), subtitle G 448–511: "โธ่… เจอจนได้!"; "เจอจนได้!" at G 478 (l 32).
- **Sound:** V01 in the clear; **S08** happy dog pant + one lick (NEEDS-GEN: a labrador's quick open-mouth panting with one wet tongue swipe on a cheek, close, under the tree shade, 1.0 s, "a sloppy kiss, she has lost and doesn't mind") at l 6 (G 452), kept under V01; **S08b** soft body flop on grass (NEEDS-GEN: a child sitting down hard on short grass, dull cloth-and-turf thud, close, 0.3 s) at l 44 (G 490) as she lands; M1 ducked under V01, then a small up-flourish (pizz run upward, 0.5 s) at l 56 (G 502) after the line.
- **Mix intent:** hit (laugh).
- **Cut:** hard cut at l 62 (G 508), 2 f after the V01 file ends and 2 f before the L04 file.
- **Entry → exit:** GIRL hidden → sitting, laughing, the dog at her cheek.
- **Acceptance:** GIRL ≥ 480 px; tree screen left with the dog from that side; her knees read bent in the squat and the floor-sit (no straight shins under a floating seat); the dog's neck is the kit length in every frame (no squash between head and shoulders); faces ≤ 1160.

### B02-SH01 · 508–591 · she has a plan (L04)

- **Purpose:** the refrain becomes her plan.
- **Camera (F, R2):** `camMove(at (5.9,0.6,0.5), yaw [−20,−12], r [1.3,1.15], eye 0.75, {f 1000, hy 700})`, slow push over l 0–83. R2: hy 760 → 700 only (FR1: R1 centre ≈ 1035).
- **Staging:** GIRL sitting on the grass at (5.9,0,0.5), front, P33 (knees up) l 0–30; on "กลิ่นยิ่งเก่า ยิ่งจาง" (l 3–40) she sits up, eyes narrowing (sly), and on "เธอเลยมีแผน" (G 566, l 58) raises one finger (`new: one-finger idea`, try P27). DOG lying at her left (5.3,0,0.6), partly at frame left, head on paws.
- **Projection (R2):** start GIRL sitting (540, 646–1277) 631 px, face (540, 738); end (540, 639–1352) 713 px, face 743, finger (621, 607); dog head (116, 1054 → 24, 1125). GIRL centre 962 → 996 (FR1). **Legs check (LF03 note carried over):** P33 *front* floor-sit is unproven; Boss checks it on the first still; if the legs read odd, P33 side facing screen left with the head turned to the lens (`headCock`) is the fallback.
- **VO/subs:** L04 file G 510, speech G 511–587 (l 3–79), subtitle G 511–593: "กลิ่นยิ่งเก่า ยิ่งจาง… เธอเลยมีแผน".
- **Sound:** M1 drops to a sly two-note figure (pizz, low-high) at l 58 (G 566); A1 continues. **S09** tiny "idea" pluck (lib `comedy_pluck-question-bend_01` fits: pizzicato with an upward-bending tail, 0.4 s) at l 58 (G 566), under the voice.
- **Mix intent:** drop.
- **Acceptance:** her face above y 1160; finger up on "เธอเลยมีแผน".

### B02-SH02 · 591–676 · "แม่ รอยี่สิบนาทีนะ…" (V02)

- **Purpose:** the plan out loud (CL01); shows the whole trail once side-on.
- **Camera (F, R2):** `camMove(at [(−4.9,0.7,−0.8),(−1.5,0.7,−0.8)], yaw [8,0], r 3.6, eye 1.7, {f 1000, hy 860, pitch [−10,−10]})` over l 0–85, truck following her. Camera (−5.40,1.70,2.76) → (−1.50,1.70,2.80); horizon y 684. R2 reason (FR): R1 kept her at y 693–958 with the lower half empty; closer, higher, pitched down: she runs through the frame centre and MUM with the dog sit just above her at the fence. (R1: `at [(−4.6,0.7,0),(−1.6,0.7,0)], yaw [4,−2], r 4.6, eye 1.0, {f 900, hy 760}`.)
- **Staging:** GIRL `P38 run`, right profile, from the swing (−5.4,0,0) l 0 to (−1.2,0,0) l 85 (≈ 1.5 m/s, a tiptoe skip-run along z 0; R3: 68 → 85 f, path unchanged), head turned back over her left shoulder toward MUM while calling. MUM at the fence gate (0.2,0,−5.0), front, DOG sitting at her left (−0.5,0,−4.9) on the line; on "ยี่สิบนาที" (≈ G 612) MUM presses the stopwatch (right index on left wrist) l 21. New prints appear under GIRL's feet (no glow).
- **Projection (R2):** start GIRL (401–412, 816–1261) 445 px, swing top bar (153, 483), seat (195, 1132), MUM (1057–1075, 691–884), dog head (995, 806); end GIRL (638–646, 813–1249) 436 px, MUM (753–761, 692–900), dog head (669, 815). Group extent 691–1261, centre 976 (FR1); her face ≈ 870, feet in the band (allowed). **Exception (VD10):** tracking wide, the trail is the subject.
- **VO/subs:** V02 file G 593 (l 2), speech G 594–675 (l 3–84), subtitle G 594–681 (its 6 f tail runs into SH03 l 0–5): "แม่ รอยี่สิบนาทีนะ… กลิ่นหายหมดแน่"; "กลิ่นหายหมดแน่" G 646 (l 55).
- **Sound:** V02 clear; **S10** sneaker patter on grass (NEEDS-GEN: light quick child steps in canvas sneakers on short grass, mid distance, tracking, 3 s, "sneaky and pleased with herself") l 0–85 (G 591–676); **S11** stopwatch click (NEEDS-GEN: small plastic button, crisp, 0.1 s, far: MUM is at the fence, so softer and with a touch of open air) at l 21 (G 612). M1 continues at energy 2, ducked under V02.
- **Mix intent:** hold.
- **Cut:** hard cut at l 85 (G 676) as the V02 file ends, into SH03.
- **Acceptance:** swing at frame left, she runs toward screen right; MUM and the dog are back by the fence.

### B02-SH03 · 676–721 · twenty minutes (W-WAIT)

- **Purpose:** time passes; nothing is claimed about the trail (N4). **No glow.**
- **Camera (F):** insert, end-on toward the tree (axis exception: the trail runs into depth): `camMove(at (0.55,1.05,−3.95), yaw [118,112], r [0.38,0.34], eye 1.12, {f 1000, hy 820})`.
- **R2 frame check:** R1 kept (meets FR): insert; the wrist and watch fill the lower middle (watch y 1004–1026), GP 816.
- **Staging:** FG MUM's left wrist with the stopwatch (face toward the lens), SVG digits run 00:00 → 20:00 over l 3–42 (ease-in-out). BG field: the tree's shade sweeps 25° and lengthens across the trail (event clock), sun 28° → 22°, light flattens; GIRL at GP yawns l 18–30 (P43, mouth open), then ducks back. Grass sway on the ambient clock.
- **Projection:** watch (540, 1004 → 1026); trunk base (624, 983 → 726, 987); GP (631, 816 → 733, 816). Digits face ≈ 130 px wide.
- **Sound:** **S12** fast-forward ticking (NEEDS-GEN: rapid stopwatch ticks accelerating, small plastic, close, 1.5 s; `tension_clock-pulse_01` is too slow) l 0–42 (G 676–718); **S13** time whoosh (NEEDS-GEN, soft airy sweep, 1.2 s) l 2 (G 678); **S14** small yawn (GIRL, far, at the tree; a short child's yawn with a sleepy little hum at the end, 0.8 s) l 18 (G 694): **not recorded at W4** (V01–V06 only), so it is a dependency: Editor with Gemini Leda (`gemini-tts` skill, vocal sound) or Ton NEEDS-GEN; fallback drop the cue (picture yawn stays). M1 **out** l 0 (G 676); A1 continues, birds sparser.
- **Mix intent:** release.
- **Acceptance:** zero glow on any print in all 45 frames (G 676–721); digits read 00:00 at l 0–3 and 20:00 from l 42; no voice in the shot except the V02 subtitle tail l 0–5.

### B02-SH04 · 721–797 · "ฟุดฟิด… หายเกลี้ยงแล้ว!" (V03)

- **Purpose:** her (dramatised) belief that the smell is gone; a giggle.
- **Camera (F):** `camMove(at (4.8,0.4,0), yaw [−20,−12], r [1.5,1.35], eye 0.6, {f 1000, hy 720})` over l 0–45, then holds while she dashes out (R3).
- **R2 frame check:** R1 kept (meets FR): GIRL 489–1161, centre ≈ 840; the face over the print sits at y 989–1023 and the print at 1103–1151, so the picture cannot move down without breaking FR2.
- **Staging:** GIRL `new: crouch-sniff` (on hands and knees, nose 5 cm over her print at (4.6,0,0)), front three-quarter, l 0–34 (two exaggerated sniffs on "ฟุดฟิด" l 1–9, then nose hovering, eyes darting, l 10–34); sits up grinning, smug, l 36–44, landing the grin on "หายเกลี้ยงแล้ว!" (G 763, l 42); dashes off screen right toward the tree l 60–76 (R3: 45 → 76 f with the Leda read; the action keeps its order). The print is ordinary: **no glow**.
- **Projection:** start GIRL (549, 540–1152) 612 px, print (420, 1103); at the push end (l 45, camera holds after) GIRL 684 px, print (399, 1151).
- **VO/subs:** V03 file G 721 (l 0), speech G 722–796 (l 1–75), subtitle G 722–802 (6 f tail into SH05): "ฟุดฟิด… หายเกลี้ยงแล้ว!".
- **Sound:** V03 clear ("ฟุดฟิด" is hers); **S15** smug little ding (lib `ui_notification-ding_01` only if it is soft and toy-like; else NEEDS-GEN: one small bright toy bell, close, dry, 0.4 s, "pleased with herself") at l 44 (G 765), just after "หายเกลี้ยงแล้ว!"; **S10b** sneaker patter dashing off (S10 family, quicker, receding, 0.6 s) at l 60 (G 781). A1; M1 stays out.
- **Mix intent:** hit (comic).
- **Acceptance:** no glow; face above y 1160.

### B02-SH05 · 797–940 · the slow sniff (W-SNIFF + L05a)

- **Purpose:** the held breath: will twenty minutes beat it? (VD11: 72 f clean, sniffing continues under L05's first phrase.)
- **Camera (F, R2):** nose vantage (VD05 R2, the SH02 vantage with a slow push): `camMove(at [(−0.97,0.3,−0.1),(0.23,0.3,−0.1)], yaw [−4,0], r [2.1,1.9], eye 0.85, {f 1300, hy 660, pitch [−6,−6]})` over l 0–143; the target follows the body like SH02 (linear l 18–100, holds after). Camera (−0.82,0.85,1.99) → (0.25,0.85,1.84); horizon y 523. (R1: `at (0,0.3,−0.2), yaw [−4,0], r [1.9,1.6], eye 0.5, {f 950, hy 820}`.)
- **Staging (R2):** DOG front view brought in by MUM (off frame, line top-right) from (−1.2,0,−1.6) l 0 to (−1.22,0,−0.12) l 18 (slowing), cut-on-turn to **right profile** at l 20 (consistency with SH02's accepted profile sniff-track: the same view each round is the experiment, VD05 R2); `new: sniff-track` at half the SH02 pace: nose over print −0.6 l 24, 0 l 62, +0.6 l 100 (ground point = nose − 0.62), then the body holds and the head swings back to nose +0.3 by l 130; head low, **tail still**. Glow round 2: reading radius 0.7 m, at the nose only (two or three prints), size steps S1–S3 in the same rising order (an older trail = smaller halos, top step S3). Light: flatter, sun 22°, longer shadows.
- **Projection (R2):** l 0 dog front (495, 570–825) 255 px (walking in); l 24 dog profile paws (392, 1033), top 665: 368 px, nose (774, 1034), print −0.6 (768, 1053); l 100 paws (381, 1068), top 675: 393 px, nose (791, 1065), print +0.6 (782, 1083), print 0 (377, 1123). Dog extent 665–1068, centre 866 (FR1); nose and lit prints ≤ 1123.
- **VO/subs:** W-SNIFF clean l 0–72 (G 797–869); L05 file G 868, speech from G 869 (l 72); subtitle L05a G 869–941: "แต่รอยบนหญ้าที่ทิ้งไว้ยี่สิบนาที…" (L05b continues in SH06).
- **Sound:** music **out** (near-silence); A1 low; one soft harness jingle on the turn at l 20 (G 817; S05 family); **S16** slow deliberate sniffs (NEEDS-GEN: one long draw then two short, close, nose to grass, 0.9 s each, "every breath counts") at l 24, 62, 100, 130 (G 821, 859, 897, 927; the l 100/130 sniffs sit under L05a and are ducked); **S17** grass rustle under the nose (NEEDS-GEN: fine blades brushing a muzzle, very close, soft, continuous loop) l 18–143 (G 815–940); G-tones very soft, one per print (l 26, 64, 102 = G 823, 861, 899) rising, at round-2 levels. Silence policy: nothing else from l 0 to l 72 (G 797–869).
- **Mix intent:** drop → hold (tension).
- **Cut:** hard cut at l 143 (G 940), 1 f before "หมาตามรอย" (G 941), to SH06.
- **Acceptance:** sniffing visible ≥ 120 f after the nose reaches the trail (l 18 → 143 ≈ 4.2 s); no voice before l 72 (G 869); no turn toward the tree before the cut; glow limited to prints within 0.7 m of the nose, halos no larger than S3; the framing matches SH02's (same eye, lens, pitch, side).

### B02-SH06 · 940–991 · it still picks the right way (L05b)

- **Purpose:** the result: twenty minutes on grass is not enough.
- **Camera (F, R2):** `camMove(at [(0.5,0.6,−1.2),(1.2,0.6,−1.0)], yaw [10,16], r [3.0,2.8], eye 1.3, {f 1050, hy 820, pitch [−9,−9]})`. Camera (−0.02,1.30,1.75) → (0.43,1.30,1.69); horizon y 654. R2 reason (FR): R1 group at y 622–1075 with lawn below; closer and higher. (R1: `at [(0.4,0.6,−1.2),(1.2,0.6,−1.0)], yaw [10,16], r [3.6,3.4], eye 0.9, {f 950, hy 760}`.)
- **Staging:** DOG turns (front → right profile, cut-on-turn at l 6) from where SH05 left it, trots off toward +x, (0,0,−0.45) → (2.2,0,0) by l 51 (R2 note: SH05 now ends with the dog at (−0.02,0,−0.12) in profile; Boss either starts SH06 at that ground point or keeps (0,0,−0.45): 0.33 m, hidden by the cut-on-turn); line unclipped. MUM behind at (0.35,0,−3.0), front, raises her left wrist to read the stopwatch l 0–20, then looks up after the dog, eyebrows up (amused).
- **Projection (R2):** start dog (370–378, 929–1241) 312 px, MUM (436–441, 576–936) 360 px, watch (475, 642); end dog (2.2,0,0) at (1107–1132, 983–1257), leaving frame right on the last frames; MUM (212–230, 571–952), watch (253, 641). Group extent 576–1241, centre 908 (FR1); the dog's head ≈ y 990. **Exception (VD10):** two-subject action; the dog's direction is the information.
- **VO/subs:** L05b speech G 941–988 (l 1–48), subtitle G 941–994: "หมาตามรอยก็ยังเลือกทางถูก".
- **Sound:** M1 returns at l 4 (G 944; pizz steps up), ducked under L05b; G-tones climb (three quick rising notes l 8, 14, 20 = G 948, 954, 960); S07 trot paws l 10 (G 950), receding toward frame right; M1 dips at l 49 (G 989) to clear V04.
- **Mix intent:** lift.
- **Cut:** hard cut at l 51 (G 991), 2 f before the V04 file.
- **Acceptance:** the dog exits screen right; MUM's wrist raised.

### B02-SH07 · 991–1037 · "ห๊ะ!? ยังได้อีก" (V04)

- **Purpose:** deflation, comic; the setback.
- **Camera (F):** `camMove(at (6.7,0.9,−0.4), yaw [−24,−18], r [1.4,1.3], eye 1.2, {f 1000, hy 640})`.
- **R2 frame check:** R1 kept (meets FR): medium close, head top 542, body to the frame bottom.
- **Staging:** GIRL standing at G1, front, P12 surprise_cover_mouth from l 4 on "ห๊ะ!?" (shocked), held through "ยังได้อีก" (G 1012, l 21) to the cut; DOG's head pops round the trunk (screen left) at l 10, tongue out (`happy-wag`). Light a touch cooler (setback).
- **Projection:** GIRL head top (586, 542), feet below frame; 940 → 1006 px (medium close); dog head (162, 1012 → 124, 1062).
- **VO/subs:** V04 file G 993 (l 2), speech G 994–1033 (l 3–42), subtitle G 994–1039: "ห๊ะ!? ยังได้อีก".
- **Sound:** V04 clear; **S18** soft deflation "bonk" (NEEDS-GEN: hollow wooden-toy bonk with a short down-bend, close, dry, 0.4 s, "plan failed, comic") at l 34 (G 1025), after "ยังได้อีก" and under the line's tail; M1 ducked, cut to a held note.
- **Mix intent:** hit then drop.
- **Cut:** hard cut at l 46 (G 1037), 2 f before the L07 file.
- **Acceptance:** her face and hands above y 1160.

### B03-SH01 · 1037–1100 · "แต่ถ้ามันไล่ดมทีละรอย…" (L07a)

- **Purpose:** her idea forms; the look toward the mats.
- **Camera (F):** `camMove(at (6.7,1.0,−0.4), yaw [−22,−30], r [1.2,1.1], eye 1.25, {f 1000, hy 600})` over l 0–63: arc opening toward the fence side.
- **R2 frame check:** R1 kept (meets FR): medium close, head top 520–527, body to the frame bottom.
- **Staging:** GIRL at G1 front, thinking (sly), then her eyes slide to screen left-back (toward the stack at (1.6,·,−6.3)) l 36–46 (on "ทีละรอย…"), head follows 15° (`headCock`), grin spreads l 50 (R3: +6 f with the measured L07 onset; order kept).
- **Projection:** GIRL head top (593, 527 → 601, 520), medium close (1091 → 1198 px).
- **VO/subs:** L07 file G 1039, speech from G 1040 (l 3); subtitle L07a G 1040–1101: "แต่ถ้ามันไล่ดมทีละรอย…".
- **Sound:** M1 back at energy 2 from l 0 (G 1037), ducked under L07; **S19** bright idea pluck (NEEDS-GEN: single harp-pizz pluck with a little sparkle, close, dry, 0.5 s, "a light bulb, mischievous") at l 50 (G 1087) with the grin.
- **Mix intent:** lift.
- **Cut:** hard cut at l 63 (G 1100), 1 f before "งั้นสลับลำดับรอยดูสิ" (G 1101), on her held glance (eyeline match) to SH02.
- **Acceptance:** eyeline points screen left and away; face above y 1160.

### B03-SH02 · 1100–1163 · the mat stack (L07b, V05)

- **Purpose:** CL02 paid: the scenery stack becomes the trick.
- **Camera (F, R2):** `camMove(at (1.6,0.4,−6.3), yaw [−10,−4], r [1.3,1.1], eye 0.8, {f 950, hy 600})` over l 0–63: push on the stack (camera on its lawn side, looking at the fence). R2: hy 820 → 600 only (FR1: R1 put the stack at y 973–1511, centre ≈ 1220).
- **Staging:** stack ST (14 mats, four colours, pallet) centre frame, cones right; on "สลับลำดับรอย" (≈ G 1120, l 20) GIRL's two hands enter from the frame's right edge (R2; R1 bottom-right), grab the top teal mat l 26, drag it off frame right l 40–63 (`new:` drag, both hands); V05 giggle l 43–63.
- **Projection (R2):** stack top (540, 753 → 781), base (540, 1185 → 1291): 432 → 510 px tall, centre 969 → 1036; the base sits in the band; the stack's top and the hands are above y 1160 throughout (the hands enter from the frame's right edge at y ≈ 800).
- **VO/subs:** L07b speech G 1101–1140 (l 1–40), subtitle G 1101–1146: "งั้นสลับลำดับรอยดูสิ"; V05 file G 1143–1163 (l 43–63; giggle, not subtitled).
- **Sound:** **S20** rubber mat drag (NEEDS-GEN: EVA foam sliding off a stack, soft squeaky scrape, outdoor, close, 0.8 s, "sneaky, a little naughty") at l 40 (G 1140); V05 giggle file at l 43 (G 1143). M1 energy 2.5.
- **Mix intent:** lift.
- **Cut:** hard cut at l 63 (G 1163) as V05 ends, on the beat that starts the W-MATS montage.
- **Acceptance:** the stack is the same object, colours and place as in B01-SH01.

### B03-SH03 · 1163–1205 · lay the row, one step per mat (W-MATS 1)

- **Purpose:** the trick, staged: the whole trail on mats, one step each (F003, SRC001 design).
- **Camera (F):** high diagonal from the swing end: `camMove(at (−1.8,0,0), yaw 72, r [5.0,4.6], eye 2.8, {f 900, hy 700, pitch [−22,−22]})`.
- **R2 frame check:** R1 kept (meets FR): the row runs from mat 0 at y 1415 to the tree at 320, filling the frame.
- **Staging:** l 0–18: the 13 mats slap down in four quick beats along z 0, x −5.4 → +5.4 (time-compressed; order O1 = T, R, O, S, T, R, O, S, T, R, O, S, T by slot 0–12; T teal, R terracotta, O ochre, S slate). l 18–42: GIRL hops from slot 0 to slot 12, one hop per mat (P38, small hops, 2 f per hop in time-lapse), a damp footprint mark appearing on each mat; she reaches the tree.
- **Projection:** mat 0 (140, 1415, below the band), mat 6 (609, 708), mat 12 (707, 561); tree (698, 320); GIRL 390 px at slot 0 → 110 px at the tree. **Exception (VD10):** the row is the subject.
- **Sound:** **S21** mat slaps (NEEDS-GEN: four flat EVA slaps on grass, rubbery, outdoor, 0.25 s each) at l 0, 5, 10, 15 (G 1163, 1168, 1173, 1178); **S22** sneaker pats, quick hops, 13 light taps l 18–42 (G 1181–1205; NEEDS-GEN: a child hopping on foam mats, soft rubbery pats, mid distance, "one step per mat"). M1 montage rhythm, energy 3.
- **Mix intent:** lift.
- **Cut:** jump cut, same vantage, to SH04.
- **Acceptance:** the colour order O1 is readable on the near 7 mats.

### B03-SH04 · 1205–1235 · Mum shuffles (W-MATS 2)

- **Purpose:** same line, new order.
- **Camera (F):** same vantage, push continues: `camMove(at (−1.8,0,0), yaw 72, r [4.6,4.4], eye 2.8, {f 900, hy 700, pitch [−22,−22]})`.
- **R2 frame check:** R1 kept (meets FR): as SH03; MUM 636–957.
- **Staging:** MUM (`new: crouch-swap-mats`, line coiled over her shoulder) at (−2.7,0,0.5) lifts slot 3 and slot 5 and swaps them l 0–15, then a time-cut flicker to the finished order O2 = R, S, T, T, O, R, S, O, R, T, S, O, T (l 16–30); the row stays straight on z 0. Footprint marks travel with their mats.
- **Projection:** MUM (581, 636–957) 321 → 334 px; mats as SH03.
- **Sound:** **S23** rubbery scrape + flop (NEEDS-GEN: two mats lifted and dropped on grass, adult hands, mid distance, 0.6 s) at l 2, l 10 (G 1207, 1215); M1 energy 3.
- **Mix intent:** hold.
- **Acceptance:** comparing SH03 l 41 with SH04 l 29, the colour order differs and the row line is identical.

### B03-SH05 · 1235–1307 · the dog cannot tell (W-MATS 3)

- **Purpose:** the third round from the same nose vantage: this time it fails.
- **Camera (F, R2):** nose vantage, wider (same eye, pitch and side as SH02/B02-SH05): `camMove(at (0,0.3,−0.2), yaw [0,4], r [2.4,2.2], eye 0.85, {f 1050, hy 790, pitch [−6,−6]})`. Camera (0.00,0.85,2.20) → (−0.15,0.85,1.99); horizon y 680. R2 reason (FR, LF05): R1 put the dog at y 744–994 (250 px) with lawn below. (R1: `{f 700, hy 820}`, eye 0.55, no pitch.)
- **Staging:** DOG front, brought in from (0,0,−1.4) to the middle mat (slot 6) l 0–14, line in MUM's left hand (off frame). **Long line (R2, Boss open item: LF05 drew it across the shoulder):** MUM stands behind the dog toward the gate, off frame; the line's far anchor is **(−0.8, 0.95, −2.8)** and it leaves the harness ring **behind the withers** (drawn under the head and shoulders in depth), so in the front view it rises from behind the back toward the top left and never crosses the near shoulder or chest. Sniffs slot 6 l 16, slot 5 l 24, slot 7 l 32: glow jumbled, reading radius 1.0 m: slot 5 = S5, slot 6 = S2, slot 7 = S4 (large, small, large; the full O2 jumble by slot 0–12: S2, S5, S2, S4, S1, S5, S2, S4, S3, S5, S1, S4, S2 = levels 0.10, 0.28, 0.12, 0.26, 0.08, 0.28, 0.10, 0.26, 0.14, 0.30, 0.08, 0.24, 0.12). `new: look-left-right`: looks screen left l 38, right l 46, left l 54; `sit-down` l 58–72.
- **Projection (R2):** l 0 dog entering at (540, 924) paws; l 14 dog standing on slot 6 (540, 738–1050) 312 px, nose 1072, mats 5/6/7 at (124, 1060) / (540, 1060) / (956, 1060); end dog sitting (542, 714–1083) 369 px, nose 1114, mats (79, 1110) / (547, 1097) / (988, 1085), mat 5 near edge (12, 1184, in the band: a mat edge, allowed). Group extent 714–1110, centre 912 (FR1). **Exception (VD10):** the mats and the head turns are the subject; the dog is still ≥ 300 px.
- **Sound:** S03-family sniffs l 16, 24, 32 (G 1251, 1259, 1267); G-tones jump high, low, high (G5, G1, G4) at l 18, 26, 34 (G 1253, 1261, 1269); one harness jingle per head turn at l 38, 46, 54 (G 1273, 1281, 1289; S05 family, smaller); M1 **stops dead** at l 58 (G 1293) on the sit. Silence from l 58 to the L08 onset (G 1310).
- **Mix intent:** drop to silence.
- **Acceptance:** looks left-right-left on the listed frames; glow sizes jumbled (no monotone run of three); the long line never crosses the dog's shoulder or chest.

### B03-SH06 · 1307–1397 · the order of smells is scrambled (L08a, L08b)

- **Purpose:** name what broke, visually: the jumbled row, against a ghost of round 1's rising row (VD09).
- **Camera (F, R2):** high slide `camMove(at [(−2.4,0.05,0),(1.4,0.05,0)], yaw [−6,−2], r 1.6, eye 1.2, {f 950, hy 1000, pitch [−34,−34]})`, l 0–90, `easeInOutSine`. Camera (−2.23,1.20,1.59) → (1.46,1.20,1.60); horizon y 359. R2 reason (FR): R1's 0.28 m eye showed one mat at a time as a thin strip at y 901–985 with the lower half empty; the slide now looks down on the row (no dog in frame, so FR4 does not limit the pitch), three mats in frame at a time with their colours and halo sizes read as a diagram. (R1: `r 1.3, eye 0.28, {f 900, hy 760}`.)
- **Staging:** the mats lit at their O2 jumble sizes pass under the lens (mat centre at y ≈ 1036 through the slide). On "ลำดับกลิ่นก็มั่ว" (G 1353, l 46) the **ghost row** fades in at 35 % opacity for 18 f, 0.4 m above the mats (y ≈ 876): five small glows in round 1's rising size order (S1 → S5, left → right), then l 64–79 they slide down into the mats' jumbled levels and vanish (the arrow breaks). The sitting dog is off frame until the cut.
- **Projection (R2):** l 45 (mid) mats 5/6/7 at (120, 1019) / (540, 1036) / (982, 1054), mat 6 near edge 1133, far edge 961, ghost row y 876; l 0 mats 3/4 at (399, 1027) / (834, 1054); l 90 mats 7/8 at (302, 1031) / (733, 1040). Mats + ghost extent 876–1133, centre 1005 (FR1).
- **VO/subs:** L08 file G 1309, speech from G 1310 (l 3); subtitles L08a G 1310–1353 "พอสลับลำดับรอย…", L08b G 1353–1397 "ลำดับกลิ่นก็มั่ว".
- **Sound:** near-silence; A1 only, low; one very soft jumbled G-tone tick (G4, G1, G5, G2) at l 46, 50, 54, 58 (G 1353, 1357, 1361, 1365; doubles the picture only). **No music.**
- **Mix intent:** hold (quiet).
- **Cut:** hard cut at l 90 (G 1397) on "หมาตามรอย" (G 1397).
- **Acceptance:** the ghost row is clearly a drawing (no realistic haze); it rises left→right and then scrambles.

### B03-SH07 · 1397–1457 · head tilt (L08c)

- **Purpose:** the result, felt: the dog cannot tell the way.
- **Camera (F):** `camMove(at (0,0.55,−0.2), yaw [8,2], r [1.25,1.1], eye 0.6, {f 1000, hy 700})`.
- **R2 frame check:** R1 kept (meets FR): dog 556–1180, centre 868. Glow on the two mats either side at their sizes (S5 slot 5, S4 slot 7), held low in brightness by the fixed opacity.
- **Staging:** DOG sitting on slot 6, front; `new: head-tilt` to screen right 14° at l 10, ears lift; holds; tiny tilt back at l 46 (R3: the shot grew 51 → 60 f with the measured L08 end). Jumbled glow on the two mats either side, low.
- **Projection:** dog (540, 556–1180) 624 → 709 px; paws at the band's top edge (allowed); head well above.
- **VO/subs:** L08c speech G 1397–1454 (l 0–57; last word ends ≈ G 1444), subtitle G 1397–1460: "หมาตามรอยก็บอกทางไม่ได้".
- **Sound:** **S24** one soft confused whine (lib candidate `creature_dog-whine-puzzled_01`, Ton checks it is short, soft and rising like a question; else NEEDS-GEN) at l 12 (G 1409), under the voice; then stillness; A1 low. No stinger.
- **Mix intent:** drop (stillness is the beat).
- **Cut:** hard cut at l 60 (G 1457), 2 f before the V06 file.
- **Acceptance:** the tilt lands on l 10 ± 3 (G 1407), the whine with it; no music.

### B04-SH01 · 1457–1490 · "เย้!" (V06)

- **Purpose:** her silent win.
- **Camera (F):** `camMove(at (6.7,1.0,−0.4), yaw [−20,−14], r [1.4,1.3], eye 1.2, {f 1000, hy 640})`.
- **R2 frame check:** R1 kept (meets FR): medium close, fists 453–465, head top 542.
- **Staging:** GIRL at G1 front, P08 celebrate_V with both fists up l 2–24 (fists peak on "เย้!" l 4–12), gleeful, mouth in a whisper shape. Deep gold light (sun 18°).
- **Projection:** fists (585, 465 → 453), head top (585, 542); medium close 937 → 1003 px.
- **VO/subs:** V06 file G 1459 (l 2), speech G 1460–1486 (l 3–29), subtitle G 1460–1492: "เย้!".
- **Sound:** V06 whisper in the clear, mixed lower than the other girl lines (a silent cheer; measure file note: the file is normalised to −16 LUFS like the rest); A1. M2 not yet.
- **Mix intent:** hit (small).
- **Cut:** hard cut at l 33 (G 1490), 2 f before the L10 file.
- **Acceptance:** fists and face above y 1160.

### B04-SH02 · 1490–1704 · the flip and the hold (L10, W-HOLD)

- **Purpose:** the flip in one frame: the dog's tilt, the jumbled row as a leading line, her grin at the tree.
- **Camera (F):** crane `camMove(at [(0,0.55,−0.2),(2.4,0.5,−0.1)], yaw [70,76], r [1.1,4.0], eye [0.6,1.25], {f 950, hy 730, pitch [0,−6]})` over l 0–150 (to the end of "ต่างหากที่ซ่อนเธอ", G 1640), then a 2 % drift-in through the hold (l 150–214).
- **R2 frame check:** R1 kept (meets FR), re-run 2026-11-15: end dog (192–209, 869–1292), GP (663–664, 630–672), trunk base (612, 786), slots 12/9/8 at (652, 797) / (577, 897) / (527, 963); group 630–1292, centre 961. Jumbled sizes as B03-SH05.
- **Staging:** DOG sitting on slot 6 facing +z as in B03-SH07; from this camera that is a **right profile** (facing screen right); head tilt held from B03-SH07 (14°), a second small tilt at l 150 (G 1640); no head turn (the kit dog has no back three-quarter). The row of jumbled mats runs from the dog toward the tree. GIRL at GP P43 peek_around, grinning, from l 72 ("ลำดับที่ถูกสลับ", G 1562) to the end. Low sun behind-left, long shadows.
- **Projection:** start dog (540, 575–1248) 673 px, GP (854, 657), trunk (800, 814); end dog (169–186, 889–1287) 398 px, GP (664, 642), trunk base (612, 786), slot 12 (652, 799). The dog's paws are in the band at the end (allowed); faces above.
- **VO/subs:** L10 file G 1492, speech G 1493–1640 (l 3–150); subtitles L10a G 1493–1562 "เวลาที่ผ่านไป ไม่ได้ซ่อนเธอ…", L10b G 1562–1646 "ลำดับที่ถูกสลับ ต่างหากที่ซ่อนเธอ"; W-HOLD G 1640–1704 (l 150–214).
- **Sound:** **M2** warm resolve (NEEDS-GEN: nylon guitar + pizzicato, quiet, 3–4 bars, resolving on a major chord timed to "ต่างหากที่ซ่อนเธอ", G 1603 = l 113) from l 3 (G 1493), ducked under L10; **E1** ending (NEEDS-GEN, see brief) from G 1640 (l 150), 2.4 s (to G 1712: its tail rides the `A_fade` and is cut at G 1704; Ton may trim E1 to 2.1 s so the chord lands by G 1690); one soft dog huff at G 1656 (l 166; NEEDS-GEN: a labrador's short nasal huff, close, "puzzled, giving up"); A1 carries the hold and fades with `A_fade` G 1680–1704.
- **Mix intent:** release.
- **Cut:** end; `A_fade` over the last 24 f.
- **Entry → exit:** dog tilt close → dog FG left + row + GIRL grinning at the tree; final frame held.
- **Acceptance:** at G 1640 (l 150) the dog, the jumbled row and GIRL's face are all readable at 270 px; GIRL's face above y 1160; no text.

## Dependencies and open items

| Owner | Dependency / acceptance | Status |
| --- | --- | --- |
| Editor | Place the line files exactly at the file-start G frames of the [placement table](#narration-and-girl-line-placement-checked-with-audio-edu-ep19-voice-r2) (no stretch), subtitles per the table; `durationFrames` 1704; S14 yawn (B02-SH03 l 18) not recorded at W4: generate with Gemini Leda or hand to Ton, else drop the cue; V05 giggle and V06 level are listening checks | open |
| Boss | N1–N9 in the brief's [dependency table](film-brief.md#new-assets-and-missing-capability-boss-dependencies); plates for all 23 shots from these timed ranges (look lock v6); the shot files `src/painted/edu19/shots/*.ts` take the R3 ranges and local event frames (changed shots listed in the change log) | open |
| Boss | Iris-in/out capability (B01-SH04 → SH05 → SH06); fallback hard cuts | unknown |
| Boss | ~~W3.3 repaint (R2)~~ done 2026-11-15 (v6, approved): LF01 (B01-SH01 l 0, new camera), LF02 (B01-SH02 l 102, new camera, size-ladder glow), LF03 (B01-SH07 l 16, new camera, girl P35 side, dog at (6.1,0,0.1) without lean; add a still at l 34 for the P33-side fall), LF04 (B01-SH05: background = new B01-SH04 end frame; inset unchanged), LF05 (B03-SH05 l 38, new camera, line anchor, size glow); update the shot files `src/painted/edu19/shots/B01-SH01.ts`, `B01-SH02.ts`, `B01-SH04.ts`, `B01-SH07.ts`, `B03-SH05.ts` and the glow layer to the R2 lines; measure FR1 (group centre), FR2 (≤ 1160) and lead heights with `lf-measure.ts`; GLOW-OPACITY is retired, GLOW-SIZE becomes the ladder | open |
| Boss | Glow layer (N3) to the R2 size ladder: radius steps S1–S5 at one opacity 0.26 (brief VD04 R2) | open |
| Boss | Rim light (VD16): strength from the sun's side relative to each camera, still one-sided | open |
| User | FQ1 (near shade below the band), FQ2 (B02-SH05 profile), FQ3 (girl profile P35 in B01-SH07) | answered 2026-11-15 (Boss W3.3a built to the answers; v6 approved) |
| Ton | NEEDS-GEN cues S01–S24 (+ R3 additions S08b body flop, S10b dash patter, B04-SH02 dog huff), A1, A2, G1–G5, M2, E1 (≤ 2.1 s to land inside the 64 f hold, or let the tail ride the fade); ear checks of the library candidates named per shot (M1, S01, S03, S06, S07, S09, S15, S24); cue onsets are given per shot as shot-local l and composition G | open |
| Film | Review the Editor's draft cut against these ranges (expected → observed → owner) | waiting |

Element captures: none taken (no preview of the new set, harness or outfit exists); kit references for the cast are the catalog sheets `KIT-CAST-CARDS`, `KIT-ANIMALS-LINEUP`, `KIT-POSES`. Editor scene sample proposal: B02-SH05 (the slow sniff with the glow at the nose, near-silence).

## Change log

- 2026-11-15 EDU-EP19-SHEETS-R1 (Film W2.2) — first written pass, 23 shots, estimated frames from the picked take r4_t1_slow8 (silencedetect) plus estimated girl lines; O4 decided (VD11); projection run on every camera.
- 2026-11-15 EDU-EP19-SHEETS-R2 (Film W3.2, fix round after the user's look-frame verdict on LF01–LF05 v5) — **framing:** new FR rule (VD14) and new cameras for B01-SH01, SH02, SH03 (hy only), SH04, SH06, SH07, B02-SH01 (hy only), B02-SH02, B02-SH05, B02-SH06, B03-SH02 (hy only), B03-SH05, B03-SH06; nine shots checked and kept (R2 frame check lines); `shot-projection.py` re-run on every changed camera. **Accepted Boss W3.1 changes:** B01-SH02 right-profile sniff-track with the camera on the body (carried to B02-SH05 for the repeated vantage, FQ2); B01-SH07 GIRL ≥ 480 px (now 565 px); B01-SH01 MUM x 0.75; tree shade disc over G1. **Glow:** size ladder S1–S5 at one opacity (VD04 R2), every level number mapped. **LF03 notes:** legs fixed by pose (P35 side, P33 side lean-back); dog neck fixed by moving the dog back to (6.1,0,0.1) and dropping `leanTo`. **Boss open items:** LF01 tightened (+35–60 %); LF05 line anchor behind the withers; rim stays one-sided with a per-camera strength (VD16); B01-SH04 pitch −24° → −10° for the dog card (FR4). Frame numbers remain estimated until W4.
- 2026-11-15 EDU-EP19-SHEETS-R3 (Film W5.1, timed after the voice lock EDU-EP19-VOICE-R2; user picks: NAR r4_t1_slow8, girl Gemini Leda V01–V06, looks v6) — **timing `checked-with-audio`:** one file per line at measured offsets (L01–L03b 0 f, L04 +62, L05 +322, L07 +366, L08 +520, L10 +554; R2 offsets +0 / +31 / +241.5 / +276 / +428 / +444 f on silencedetect onsets); inner anchors measured by Film with `silencedetect`; girl windows widened by their full overshoot (V01 59 f, V02 83, V03 76, V04 41, V05 20, V06 28); W-WAIT 45, W-SNIFF 72 (VD11 holds: L05a length +1 f), W-MATS 144, W-HOLD 64 kept. **durationFrames 1593 → 1704 (53.1 → 56.8 s)**; +28 f over the measure file's 1676 estimate from the measured NAR edges (L03b end +11, L07 onset −7, L08 end +10). **Ranges changed:** B01-SH06 35 → 47 f, B01-SH07 43 → 62, B02-SH01 82 → 83, B02-SH02 68 → 85, B02-SH04 45 → 76, B02-SH05 142 → 143, B02-SH07 44 → 46, B03-SH01 56 → 63, B03-SH02 61 → 63, B03-SH07 51 → 60, B04-SH01 24 → 33, B04-SH02 213 → 214; all later shots shift. **Local event frames changed:** B01-SH03 pause l 65 → 64; B01-SH06 trot l 0–47 (2.5 m/s), GP pull-back l 27, G-tones l 10/30; B01-SH07 lick l 6–30, fall l 30–48 on "เจอจนได้!" (LF03-FALL pose now at l 48), S08b new; B02-SH02 run l 0–85 (1.5 m/s), click l 21; B02-SH04 sniffs l 1–9, grin l 42, dash l 60–76, camera holds after l 45, S15 l 44, S10b new; B02-SH07 bonk l 30 → 34; B03-SH01 glance l 36–46, grin/S19 l 50; B03-SH02 drag to l 63; B03-SH06 ghost row l 46, slide l 64–79; B03-SH07 tilt back l 46; B04-SH01 fists l 2–24; B04-SH02 crane l 0–150, huff G 1656, `A_fade` G 1680–1704. **No camera, staging position, casting or look changed.** Sound lines carry G onsets for Ton; S14 yawn flagged unrecorded. FQ1–FQ3 closed (answered). Status → `ready-for-dev`.
