# Storyboard — EDU-EP16-SHORT (timed scene sheet)

Deliverable: `EDU-EP16-SHORT` (channel `edu`) · Revision: **EDU-EP16-SHEETS-R2** (Film, 2026-11-15: re-timed to the 5 % slower read, user decision 15 Nov 2026; story order, IDs, label rule, looks, cameras and staging of R1 unchanged; every beat-to-word relation of R1 kept; [R2 re-time](#r2-re-time-old--new) lists every changed number) · Status: **ready-for-dev (timing)** for Boss's shot code re-key and Ton's cue sheet re-time; not a user approval, not runtime or audio proof · Timing: **estimate-scaled** — the slower-read measure is R1's audio measure scaled exactly ×1.05 (not re-aligned, not listened); Editor is re-locking it in parallel and the numbers may move 1–2 f; word pegs marked `est` are syllable-interpolated, ±5 f.
Inputs: [script.md](script.md) **EDU-EP16-SCRIPT-R3** (user-approved 2026-11-14) · [film-brief.md](film-brief.md) **EDU-EP16-BRIEF-R2** plus W3 change-log notes v9, v10, v11 · looks locked 2026-11-15 ([../delivery.md](../delivery.md#edu-ep16-short-dark-forest-ป่าเงียบ)) · narration: the same Kore take (`out/edu16/narr/full_raw.wav`) at **atempo 1.028571** (was 1.08), track `out/edu16/voice/slower5/full_x1.029.wav` (**55.045 s**), measure `out/edu16/voice/slower5/narration-measure-x1.029.json` (status ESTIMATE, scaled ×1.05 from [narration-measure.json](narration-measure.json)); the `public/narration/` file name of the re-locked read is Editor's · task [../task.md](../task.md#edu-ep16-short).
Target: this worktree, branch `claude/fermi-paradox-theory-a2de7d` at `79e111f` + uncommitted EP16 work (`src/painted/edu16/` W5.2–W5.4 shots built on R1) · 30 fps · **durationFrames 1800 (60.00 s)** · 1080×1920 · composition offset 0 (one story scene, S01).
Evidence: looks painted and approved at W3 (store `projects/edu/EDU/previews/look-frames/ep16/g1-v12`, `projects/edu/EDU/ep16-roof-looks-w3`, `projects/edu/EDU/ep16-roof-looks-w3-v11/`); this re-time renders nothing; projections as R1 (`est` unless marked `measured`). Boss's W5.2 framing re-keys (SH05, SH09, SH12, SH13 push, SH16, SH22; "Film to confirm" in the shot code) are **not reviewed in this pass** and the camera lines below keep R1's numbers ([open items](#dependencies-and-open-items)).
Rows file: [review-rows.json](review-rows.json) **EDU-EP16-ROWS-R3** (timed to this sheet); review page: pending.

## Units, clocks and conventions

- Clocks: **global** `f` = composition frame (= scene-local, offset 0); **shot-local** `+n` = `f − shot start`. Ranges half-open `[start, end)`. Global frame of a read time `t` (s, slower-read track) = `floor((t + offset)·30 + 0.5)`.
- **Narration placement (one file, placed in four pieces, each cut in a silence of the slower-read measure):**

  | Piece | File range (s) | Offset (s) | Global first frame | Lines | Why the gap before it |
  | --- | --- | --- | --- | --- | --- |
  | N1 | [0.000, 22.412) | +0.80 | f24 | L01 L02 V01 L03 L04 L05 L06 L17 L14 | W-PING lead-in (0.80 s) |
  | N2 | [22.412, 33.899) | +1.90 | f729 | L18 L07 L09 L10 | W-STOP: +1.10 s on top of the read's 0.39 s gap |
  | N3 | [33.899, 45.854) | +2.60 | f1095 | L08 L11 L13 | W-STRIKE: +0.70 s on top of the read's 0.66 s gap |
  | N4 | [45.854, 55.045) | +3.80 | f1490 | L15 L16 | W-OFF: +1.20 s on top of the read's 0.53 s gap |

  Cut points 22.412, 33.899 and 45.854 s lie inside the slower-read gaps L14→L18 22.218–22.607 (margins 0.19 / 0.20 s), L10→L08 33.569–34.230 (0.33 / 0.33 s) and L13→L15 45.591–46.116 (0.26 / 0.26 s); each margin is ≥ 5 f, so a 1–2 f shift in Editor's re-lock keeps the cut in silence (Editor confirms on the re-locked file). Speech ends f1755 (L16 end 54.715 s); N4's file tail ends f1765; the composition ends at f1800.
- Spaces, camera notation, screen zones and caption-zone targets: unchanged from R1 (`R` roof metres, origin on the deck under the stool-seat centre, +x right seen from the main camera side, +y up, +z south toward the main camera; `TH` picture px through `thCam`; `F` forest metres via `forestCam(k)`; kit YCam `orbit(target, r, az, eye, f, hy, pitch)`; moves eased in-out cubic unless stated; DOM layers never move with the camera). Caption band y 1176–1344; faces, hands, button, trace, lights and claws above y 1160 while a caption shows; label "ภาพจำลอง" top-right (`labelSide: 'right'`, x 816–1020, y 148–204); `@TamMaiLa` top-left (keep x < 330, y < 140 clear).
- **Blip clock (one clock for picture and sound; [blip-clock.json](blip-clock.json), R1 values in [blip-clock-r1.json](blip-clock-r1.json)):** spike frames `f = 21n`, **n = 0…32 (f0 … f672)**; spike 3 f (1, 0.62, 0.28); the trace is `flat` from **f675** to the end. f0 is the PING; **f693 is the first missing blip** (W-STOP), 2 f after L14 ends ([D9](#decisions)).
- **Label "ภาพจำลอง" (VD12, Boat P1, P5):** on **[0, 163)** (SH01–SH03), off **[163, 316)** (SH04–SH05), on **[316, 1495)** (SH06 through SH21, one continuous run including SH15S's black frames and the SH16 iris-out), off **[1495, 1800)** (from SH22's first frame, 2 f before L15). No other on-screen text.
- **Grade chapters (`RoofState.cool`):** unchanged per shot: SH01–SH02 0; SH03–SH05 0.25; SH08 0.3; SH09–SH11 0.35 (flat trace −30 % glow from **f693**); SH12 0.5; SH16–SH17 0.5; SH19–SH20 0.6; SH21 night grade; SH22–SH23 0.8.

## Casting

Unchanged from R1.

| Role | Casting line | Notes |
| --- | --- | --- |
| WOMAN | `woman-bob, P31 (seated side-on on the 0.30 m stool), happy → worried → scared → neutral` + `new: over-ear headphones` (gear) | 1.58 m, 4-head; root SH01_AT (0.04, 0, −0.02) in every roof shot ([D1](#decisions)); faces −x; view chosen by lens angle; head centre ≈ (0.02, 0.92, −0.02), head top ≈ 1.12, eye ≈ 0.88 (est). Poses: `new: seated reach-hover`, `new: withdraw-to-chest`, `new: look-up` (`headPitch` +30), `paintMitten` hands, `HAND_SH03` in the macros |
| WOMAN aged (IM1) | `new: woman-bob aged a50 / a81` | SH07 only; stills approved (v7) |
| Kind figure (IM2) | `woman-bob, P07, happy` (small card in their bubble) | SH13 only, 19 f ≈ 0.63 s (user kept it, Q1) |
| Monsters | `new: shadow-monster` (look A) | SH13, SH14 (sinking), SH15, SH15S |
| Lights, bead, thread, bubble rim | `thought.ts` | TH only |
| Props | SET-ROOF16 (`roof.ts`), positions as R1 | Code values win over the brief's set plan where they differ |

## Shot map

| # | Shot | Beat | Lines | Range | Len | Start s | Label | In → out | One-line read |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | S01-B01-SH01 | B01 | W-PING | [0, 30) | 30 | 0.00 | on | — → cut | Rooftop at 2 a.m.; the trace spikes; she gasps, finger near the lit button |
| 2 | S01-B01-SH02 | B01 | L01 | [30, 119) | 89 | 1.00 | on | cut → cut | She grins, presses the headphones; push down to her finger reaching the button |
| 3 | S01-B01-SH03 | B01 | L02 | [119, 163) | 44 | 3.97 | on | cut → cut | Macro: the finger stops 1 cm above the button |
| 4 | S01-B02-SH04 | B02 | V01 | [163, 234) | 71 | 5.43 | off | cut → none | Low close: she looks up off-frame at the star, half laughing |
| 5 | S01-B02-SH05 | B02 | L03 | [234, 316) | 82 | 7.80 | off | none → dissolve | The smile thins; push to her eyes; dots rise |
| 6 | S01-B02-SH06 | B02 | L04 | [316, 400) | 84 | 10.53 | on | dissolve 12 → dissolve 8 | IM1: tilt up from her small light to the far cold star |
| 7 | S01-B02-SH07 | B02 | L05 | [400, 489) | 89 | 13.33 | on | dissolve 8 → dissolve 12 | IM1: a bead goes up and back; she ages 21 → 50 → 81 |
| 8 | S01-B02-SH08 | B02 | L06 | [489, 571) | 82 | 16.30 | on | dissolve 12 → cut | Back on the roof over her left shoulder: finger still hovering, blip beating |
| 9 | S01-B03-SH09 | B03 | L17 | [571, 636) | 65 | 19.03 | on | cut → cut | Screen close, her face behind; her eyes rise off-frame |
| 10 | S01-B03-SH10 | B03 | L14 | [636, 675) | 39 | 21.20 | on | cut → none | ECU trace: blip… blip… last spike at +36 |
| 11 | S01-B03-SH11 | B03 | W-STOP | [675, 731) | 56 | 22.50 | on | none → cut | Same ECU, still: flat line; the next blip never comes |
| 12 | S01-B04-SH12 | B04 | L18 | [731, 803) | 72 | 24.37 | on | cut → dissolve | Her stare at the flat line, then up; push on her face |
| 13 | S01-B04-SH13 | B04 | L07 | [803, 907) | 104 | 26.77 | on | iris-in 12 → none | IM2 standoff: mirrored monsters, claws a hand apart; kind-figure flicker |
| 14 | S01-B04-SH14 | B04 | L09 | [907, 959) | 52 | 30.23 | on | none (hard boundary, continuous run, like D8) → cut | IM3: monsters sink; truck along the thread, bead crawls |
| 15 | S01-B04-SH15 | B04 | L10 | [959, 1073) | 114 | 31.97 | on | cut → cut on action | IM3: tiny far light swells, giant rises, arm lifts over her light |
| 16 | S01-B04-SH15S | B04 | W-STRIKE | [1073, 1097) | 24 | 35.77 | on | cut on action → iris-out | The claw comes down on her light: one amber flash, black |
| 17 | S01-B05-SH16 | B05 | L08 a | [1097, 1125) | 28 | 36.57 | on | iris-out 12 → cut | Iris-out to her face, alive, lamp-lit; she swallows; no receiver |
| 18 | S01-B05-SH17 | B05 | L08 b | [1125, 1171) | 46 | 37.50 | on | cut → dissolve | Macro: the finger still above the lit button, "เงียบไว้ก่อน" |
| 19 | S01-B05-SH18 | B05 | L11 | [1171, 1323) | 152 | 39.03 | on | dissolve 14 → dissolve 12 | IM4: the silent night forest, eye-height creep |
| 20 | S01-B05-SH19 | B05 | L13 | [1323, 1450) | 127 | 44.10 | on | dissolve 12 → cut | Macro push on the finger: "เหมือนคุณเมื่อกี้" |
| 21 | S01-B05-SH20 | B05 | W-OFF a | [1450, 1472) | 22 | 48.33 | on | cut → cut | She draws the hand back to her chest, holds her breath |
| 22 | S01-B05-SH21 | B05 | W-OFF b | [1472, 1495) | 23 | 49.07 | on | cut → cut | Wide: click, the lamp's light leaves the whole roof |
| 23 | S01-B05-SH22 | B05 | L15 | [1495, 1628) | 133 | 49.83 | off | cut → cut | Logbook's last "เงียบ" in cold light; tilt up to her looking at the sky |
| 24 | S01-B05-SH23 | B05 | L16, hold | [1628, 1800) | 172 | 54.27 | off | cut → end | Crane out to the still real sky over her small dark roof; 1.5 s hold |

Total **1800 f = 60.00 s** (target ≤ 60.0 s: pass at the limit; Short default 40–60 s; hard cap 63 s: 3.0 s margin). Untrimmed the slower read gave 1815 f (60.50 s); **trimmed: the end hold 60 → 45 f** (−15 f; [D10](#decisions)); no narration, no other wordless beat trimmed (the offsets are fixed, so W-PING, W-STOP, W-STRIKE and W-OFF follow from them). Dissolves (into the shot): SH06 12, SH07 8, SH08 12, SH13 12 (iris-in), SH16 12 (iris-out), SH18 14, SH19 12; **SH14 has none** ([D11](#decisions)). Wordless beats: **W-PING** [0, 31) = 31 f (1.03 s, to L01 onset, unchanged); **W-STOP** no voice L14 end f691 → L18 f735 = 44 f (1.47 s, R1 44 f); flat line [675, 735) = 60 f; missing blip f693 → L18 = 42 f (1.40 s, R1 31 f; [D9](#decisions)); **W-STRIKE** [1073, 1097) = 24 f (STK keys unchanged), plus SH15's 9 f wind-up after L10 (R1 8 f; [D12](#decisions)) and SH16's 8 f iris before L08 (no voice L10 end f1064 → L08 f1105 = 41 f); **W-OFF** [1450, 1495) = 45 f (unchanged; the voice gap L13 end f1446 → L15 onset f1497 is 51 f, as R1); **end hold** [1755, 1800) = 45 f (1.50 s, speech ends f1755).

**ER09 re-check (answer ≤ 10 s, counted on the placed read):** OQ1 L08 onset f1105 → L13 onset f1329 = 224 f = **7.47 s** (R1 7.10); OQ2 L04 f322 → L17 f575 = 253 f = **8.43 s** (R1 8.00; the longest); OQ4 L13 onset f1329 → end of W-OFF f1495 = 166 f = **5.53 s** (R1 5.37); OQ6 L10 onset f961 → L08 onset f1105 (W-STRIKE inside) = 144 f = **4.80 s**; OQ7 L16 f1632 → f1755 = 123 f = **4.10 s**. All under 10 s: **pass** (margin 1.57 s on OQ2).

## Voice and subtitle cues (global, slower-read measure)

Captions are the narration verbatim; Editor breaks and times them inside these ranges; no caption in W-PING, W-STOP, W-STRIKE, W-OFF or the hold. Ranges = line onset to line end of the slower-read measure; `est` words scaled from R1 (±5 f).

| Cue | Line | Thai | Range | Phrase onsets | Shots |
| --- | --- | --- | --- | --- | --- |
| C01 | L01 | ถ้าคืนนี้… มีเสียงจากต่างดาว ส่งมาถึงคุณ | [31, 114) | 31, 52 | SH02 |
| C02 | L02 | อย่าเพิ่งตอบนะ | [123, 148) | 123 | SH03 |
| C03 | V01 | ทำไมล่ะ… ถ้าเขาใจดีล่ะ? | [167, 218) | 167, 185 | SH04 |
| C04 | L03 | นั่นแหละปัญหา… คุณไม่มีทางรู้เลย | [237, 303) | 237, 265 | SH05 |
| C05 | L04 | แต่… ดาวดวงนั้นอยู่ไกลหลายสิบปีแสง | [322, 398) | 322, 334 | SH06 |
| C06 | L05 | ทักไปหนึ่งคำ… กว่าจะได้คำตอบ คุณก็ผมหงอกแล้ว | [404, 482) | 404, 437 ("ผมหงอก" 468 est) | SH07 |
| C07 | L06 | คุยกันไม่ได้… ก็ไม่รู้ใจกัน | [496, 561) | 496, 529 | SH08 |
| C08 | L17 | แต่… เสียงนี้ก็มาจากหลายสิบปีก่อน | [575, 631) | 575, 580 ("หลายสิบปีก่อน" 609 est) | SH09 |
| C09 | L14 | ป่านนี้… คนส่งยังอยู่ไหม | [640, 691) | 640, 655 | SH10 (tail +16 f over SH11's head) |
| C10 | L18 | แล้วใครกัน… ที่กล้าส่งเสียงออกมา | [735, 791) | 735, 755 | SH12 |
| C11 | L07 | ฝั่งเขาก็เหมือนกัน… ต่อให้คุณใจดี เขาก็ไม่รู้ | [809, 902) | 809 ("เหมือนกัน" 827 est), 848 ("เขาก็ไม่รู้" 878 est) | SH13 |
| C12 | L09 | แต่… ระหว่างรอคำตอบหลายสิบปี | [913, 961) | 913, 919 | SH14 (+2 f into SH15) |
| C13 | L10 | ใครที่ตอนนี้ตัวเล็กกว่า… อาจโตจนแซงคุณไปแล้ว | [961, 1064) | 961, 1015 ("แซงคุณไปแล้ว" 1037 est) | SH15 |
| C14 | L08 | ไม่รู้ใจกัน… ก็ต้องเงียบไว้ก่อน | [1105, 1162) | 1105, 1128 ("เงียบไว้ก่อน" 1142 est) | SH16 → SH17 |
| C15 | L11 | ถ้าทุกคนคิดแบบนี้… จักรวาลก็จะเหมือนป่าตอนกลางคืน ที่ไม่มีใครกล้าส่งเสียง | [1177, 1312) | 1177, 1208 ("ป่า" 1246 est) | SH18 |
| C16 | L13 | คนที่ส่งมา… อาจเป็นใครสักคน ที่ยังไม่รู้เรื่องนี้… เหมือนคุณเมื่อกี้ | [1329, 1446) | 1329, 1350, 1421 | SH19 |
| C17 | L15 | นี่เป็นแค่คำตอบหนึ่ง ว่าทำไมฟ้าจริง ๆ ยังเงียบ… แต่ถ้ามันใช่ | [1497, 1612) | 1497 ("ยังเงียบ" 1559 est), 1574 | SH22 |
| C18 | L16 | ป่าที่ไม่มีใครเลย… กับป่าที่ทุกคนกลั้นหายใจ… ฟังดูเงียบเหมือนกัน | [1632, 1755) | 1632, 1670, 1724 | SH23 |

## Rules for every shot

- Story first: nothing in a shot shows aliens; monsters exist only inside the bubble rim; the far light, the IM1 star and the receiver are never dimmed, struck or eaten; the only light that goes out in an insert is hers, once, in SH15S. W-STOP shows no cause. No Liu Cixin, novel or real names anywhere. No gore, blood, fire, smoke, debris, manufactured weapon or person hit.
- Every roof shot: WOMAN root SH01_AT, headphones on, lamp lit and button lit until SH21 +6, trace `blip` until f672 and `flat` from f675.
- Sound: the brief's [Sound direction](film-brief.md#sound-direction) is the design; per-shot lines give shot-local frames and cue IDs ([cue list](#sound-cue-list-for-ton)). Library IDs are candidates only ([fit beats reuse](../../../docs/sound-generation-workflow.md#fit-beats-reuse)); none is listened. Narration always in clear air; drone ducks 4–6 dB under lines (Editor).

## Per-shot staging

Camera lines, positions, projections and staging are R1's; only frames changed. Shot-local keys inside narration are R1's scaled ×1.05 about the shot's VO onset (the cut keeps R1's lead before the line), snapped to measured phrase onsets where a key lands on one.

**1. S01-B01-SH01 — W-PING** [0, 30), 30 f. No VO. *(unchanged)*
- Camera (W3 v9, approved LF-ROOF): `orbit((−0.20, 0.50, 0.10), r 1.20 → 1.15, az −14, eye 0.70, f 950, hy 560, pitch +6)` (= `camSH01(k)`, k 0 → 0.25), push +0–+29. Projection (k 0): head top y 375, eye (628, 534), button (468, 1028), screen (283, 988), bulb (212, 773). Lead 889 px (measured W3 v9).
- Staging: R, real. WOMAN `left`, `happy`, right index about 5 cm above the button, left hand on her knee. All four clues in frame from +0: logbook K01, lamp K02 lit, trace K03 spiking, button K04 lit.
- Key frames: +0 the spike up (blip n 0); +8 her small gasp (shoulders lift 1 cm, grin opens).
- Sound: A1 roof bed from +0 (no music); S01 PING +0; S02 BLIP from f21 on the blip clock; S03 happy gasp +8.
- Entry → exit: +0 roof wide-medium, finger near the button → +29 same, slightly closer.

**2. S01-B01-SH02 — L01** [30, 119), 89 f. VO C01 +1–+84.
- Camera: `orbit((−0.08, 0.82, 0.04), r 0.70, az −20, eye 0.86, f 950, hy 700, pitch 0)` → `orbit((−0.30, 0.42, 0.30), r 0.62, az −12, eye 0.62, f 1000, hy 900, pitch −14)`; hold +0–+10, push and tilt down **+10–+69**, hold **+69–+88**. Start/end projections as R1. The button rises through the band **+42–+58** (est); acceptance: above y 1160 from **+59**.
- Staging: WOMAN `left`, `happy` grin; **+8–+23** left hand up to the left headphone cup and presses it (held to **+63**, down to her knee by **+84**); **+21–+67** right hand reaches in, fingertip settles 3 cm above the button by **+67**.
- Sound: A1; S02 on the clock; S04 headphone creak **+13** (padded plastic band, tiny squeak); S05 cardigan rustle **+23** (soft).
- Entry → exit: +0 MCU on her grin → +88 her face top-right, finger over the lit button.

**3. S01-B01-SH03 — L02** [119, 163), 44 f. VO C02 +4–+29.
- Camera (W3 v8, approved): `camSH03` `{x −0.45, y 0.41, z 0.56, yaw 28.6, pitch −7, f 1250, hy 720, near 0.02}`, held.
- Staging: `HAND_SH03`; the fingertip descends 3 → 1 cm above the button +0–+4 and **stops at +4** (on "อย่า", f123); still to the end. Grade cool 0.25.
- Sound: A1 drops out at +2 (f121, 3 f); S02 blip alone; M1 sub drone fades in from +4 over 30 f.
- Entry → exit: finger moving → finger frozen 1 cm above.

**4. S01-B02-SH04 — V01** [163, 234), 71 f. VO C03 +4–+55.
- Camera: `orbit((0.02, 0.88, −0.02), r 0.95 → 0.90, az −55 → −47, eye 0.62, f 950, hy 900, pitch +17)`, arc **+0–+70**. Projections as R1.
- Staging: WOMAN `front`, `look-up` (headPitch +30 by +4), `happy` half laugh on "ทำไมล่ะ" (+4), eyebrows up on "ถ้าเขาใจดีล่ะ" (**+22**, f185 measured). Eyeline up and frame-left off-frame ([D4](#decisions)).
- Sound: M1 drone; S02 blip low; V01 in the clear.
- Entry → exit: face up-tilted, laughing → the same, the camera 8° round.

**5. S01-B02-SH05 — L03** [234, 316), 82 f. VO C04 +3–+69.
- Camera: continues SH04's end (no cut), then `→ orbit((−0.02, 0.88, −0.02), r 0.62, az −47, eye 0.70, f 1000, hy 860, pitch +12)`: tiny push **+0–+59**, push to the eyes **+59–+81**.
- Staging: `happy` → `worried`: the smile thins **+10–+42** (mouth flat from **+26**; `worried` from **+31**, "คุณไม่มีทางรู้เลย" measured); gaze drops from the sky at **+46** (look-up eases out **+42–+52**). **Thought entry (VD09):** three dotted circles rise from her head top **+61, +65, +69** (dot pop ramp **+57–+69**); the ragged circle opens from the last dot at **+73** (12 f bloom, **+73–+85**) and becomes SH06's dissolve.
- Sound: M1; M2 cold pad enters at +3; S06 bubble bloom **+73**; S07 whoosh-in starts **+75** into SH06. The blip at f315 (SH05 +81) is the last before the thought shots: Ton keeps it under S07.
- Entry → exit: smiling face → eyes close, bubble opening.

**6. S01-B02-SH06 — L04 (IM1)** [316, 400), 84 f. VO C05 +6–+82.
- Transition in: bubble iris dissolve [316, 328). Label on from +0.
- Camera (TH): `thCam(0, 0.10 → 0.71 rad)` = tilt up 35° over **+6–+77**. Her light (540, 440) at +6 → (540, 1140) at **+77**; the far star enters from the top at **+31** and lands at (600, 300) at **+77**.
- Staging: void, dim star dust, bubble rim. No name, no number.
- Sound: S08 inside-head air from +0 (blip muted in TH); M1/M2 under; S07 whoosh tail +0–+10.
- Entry → exit: her light centred → light low, star high.

**7. S01-B02-SH07 — L05 (IM1 ageing)** [400, 489), 89 f. VO C06 +4–+82.
- Transition in: dissolve [400, 408). Camera: `camSH07`, void `thCam(0, 0.25)`; slide cx 110 → 90 **+0–+88**.
- Staging (`paintSH07Age`): +4 warm bead leaves her light ("ทักไป"); **+37** bead at the star; **+37–+73** cold bead descends; a21 to **+44**, dissolve to **a50 +44–+52**, hold, dissolve to **a81 +62–+70** (lands on "ผมหงอก", f468 est = **+68**); **+73** the cold bead touches her light.
- Sound: S08; S09 travel tone up **+4–+37**, down **+37–+73** (pitch falling); S10 clock-tick bed **+4–+82**.
- Entry → exit: young bust, bead leaving → aged 81, bead home.

**8. S01-B02-SH08 — L06** [489, 571), 82 f. VO C07 +7–+72.
- Transition in: bubble close dissolve [489, 501).
- Camera: `orbit((−0.38, 0.38, 0.26), r 0.85 → 0.75, az 77 → 74, eye 0.85 → 0.82, f 950, hy 900, pitch −29)`, push **+12–+81** ([D5](#decisions)).
- Staging: finger still 1 cm over the lit button; trace blipping (clock **n 24–27: f504, 525, 546, 567** = +15, +36, +57, +78).
- Sound: S11 whoosh-out +0–+12 ending on A1 (thinned, −6 dB); S02 back on the clock; M2 thins out by **+63**, M1 stays.
- Entry → exit: bubble closing → stuck finger, blip.

**9. S01-B03-SH09 — L17** [571, 636), 65 f. VO C08 +4–+60.
- Camera: R1's orbits, slow push **+0–+64**.
- Staging: her eyes on the screen to **+36**, then up and frame-left off-frame (lift **+36–+42**) on "หลายสิบปีก่อน" (**+38**, f609 est). Rack focus `unknown`: fallback both sharp.
- Sound: A1 out; M2 out; M1 low; S02 forward, dry and close (clock **n 28–30: f588, 609, 630** = +17, +38, +59).
- Entry → exit: screen and eyes → eyes lifted.

**10. S01-B03-SH10 — L14** [636, 675), 39 f. VO C09 +4–+55 (runs 16 f into SH11).
- Camera: `orbit((−0.50, 0.37, 0.231), r 0.30 → 0.26, az 0, eye 0.40 → 0.39, f 1200, hy 900, pitch −5 → −4, near 0.05)`, push **+0–+36** and **stops dead at +36** with the last spike (R1 +44; the push is 8 f shorter, the same move).
- Staging: ECU trace; spikes at **f651 (+15)** and **f672 (+36, the last)**, inside "คนส่งยังอยู่ไหม" (f655–691).
- Sound: S02 blips +15, +36; S12 reverse-swell riser from +4 (f640), continues into SH11.
- Entry → exit: trace pulsing, camera creeping → last spike, camera stopped.

**11. S01-B03-SH11 — W-STOP** [675, 731), 56 f. VO C09 tail +0–+16.
- Camera: SH10's end camera, held still (D8).
- Staging: trace `flat` from +0; the next spike would be **f693 (+18)**, the frame after the question ends, and **never comes**; the flat line's glow dims 30 % over **+18–+24**; nothing else changes.
- Sound: S12 riser cuts dead at **+18 (f693)**; then only the faint city hum (A1 hum at −18 dB) to the end (42 f); no hit.
- Entry → exit: flat line → flat line, dimmer.

**12. S01-B04-SH12 — L18** [731, 803), 72 f. VO C10 +4–+60.
- Camera: R1's orbits; push **+0–+63**, then push to her eyes **+63–+71**.
- Staging: stares down-left at the flat line to **+24**, lifts her eyes to the black sky on "ที่กล้าส่งเสียงออกมา" (**+24**, f755 measured; lift **+24–+30**); cool 0.5.
- Sound: near-silence; M1 creeps back −3 dB lower from +4; S13 whoosh-in **+66** into SH13.
- Entry → exit: profile on the flat screen → eyes up, iris opening.

**13. S01-B04-SH13 — L07 (IM2 standoff)** [803, 907), 104 f. VO C11 +6–+99.
- Transition in: iris-in through her eyes [803, 815). Out: **no dissolve** (SH14 continues the run, [D11](#decisions)).
- Camera: `thCam(0.02 → 0.16 rad, 0.20)`; picture-stage push about the gap (540, 760), scale 1.00 → 1.12 and the bubbles' ±12 px slide, **+6–+103**.
- Keys: +6 her bubble blooms (blink +6–+10, pop +8–+19, monster +10–+19, rise +12–+36); **+24** ("เหมือนกัน", f827 est) their bubble blooms as the mirror (blink +24–+28, pop +26–+36, monster/rise +28–+36); **+36** both claws frozen a hand apart; **kind-figure flicker:** **+47–+53** their monster recedes, **+53–+72** the kind card stands in warm light (fade-in +53–+56; 19 f), **+72–+83** a shadow rises behind her ("เขาก็ไม่รู้", f878 est = **+75**; card fades +75–+83) and swallows her into the monster again, amber eyes open **+83–+87**; frozen to the end.
- Sound: S08; S14 swell left +6; S15 swell right **+24**; S16 warm shimmer **+53**; S17 low breath rise **+72–+87**. M1 low under.
- Entry → exit: two lights → frozen mirrored standoff.

**14. S01-B04-SH14 — L09 (IM3 crawl)** [907, 959), 52 f. VO C12 +6–+54.
- Transition in: **none — hard boundary, continuous run (like D8)**; frame +0 repaints SH13's end state (cards at SH13's length, 104), so no dissolve is needed ([D11](#decisions)).
- Camera: truck from the gap 60 px toward her light **+0–+21** and back with the bead **+21–+51**; star dust `thCam(0.16, 0.20 → 0.30 rad)` **+0–+51**.
- Staging: +0–+10 the monsters sink back and the bubbles fold; lights settle +0–+12 (hers 58 px, theirs 29 px); thread fades in +4–+12; the warm bead leaves her light at **+12** ("ระหว่างรอ...", f919 measured) and crawls (0 → 0.11 by **+51**; 0.40 at SH15S +0).
- Sound: S18 travel tone from +12, into SH15.
- Entry → exit: standoff dissolving → bead crawling.

**15. S01-B04-SH15 — L10 (IM3 giant)** [959, 1073), 114 f. VO C13 +2–+105.
- Camera: `thCam(0.05, 0.17 → 0.45 rad)` while the picture stage dollies back (1.12 → 1.00 about her light) **+42–+97**; hold **+97–+113**. End staging as R1, bead 0.40 ([D7](#decisions)).
- Keys: **+2–+46** hold on the tiny far light ("ตัวเล็กกว่า"); **+56** ("อาจโต", f1015 measured) it swells **+56–+88** (their round light fades **+56–+73**); **+62–+93** the monster rises; **+78** ("แซงคุณไปแล้ว", f1037 est) the shadow falls down the thread and the near arm lifts over her light **+78–+97** (monster opacity ramp **+62–+78**); **+97–+113 wind-up held** (17 f; 9 f after L10 ends at +105).
- Sound: S18 continues; S19 slow pressure riser from **+56**, tightening on **+78**, held tense to the cut (choked at SH15S +8).
- Entry → exit: two small lights → giant with raised claw.

**16. S01-B04-SH15S — W-STRIKE** [1073, 1097), 24 f. No VO. *(shot-local keys unchanged)*
- Cut on action, same axis, 1.4× closer; picture push 4 % +0–+8, then still. Staging px (`STK`) as R1.
- Keys: +0 STK-K0; +0–+7 STK-K1 downstroke; **+8 STK-K2 contact (f1081)**: one amber flash (`flashAt` +8…+13), ring from r 60; +9–+11 STK-K3 her light gone; +8–+15 STK-K4 ring; +16–+17 STK-K5 claw planted; **+18–+23 STK-K6 black** (f1091–1096), rim ≥ 30 %, label on.
- Sound: S19 chokes at +8; **S20 strike thud at +8 (f1081)** (deep sub thump with a short air-pressure whoomp, as if through water, inside her head, ≈ 0.4 s, fast-decaying low tail; never the blip or any receiver sound; ≤ narration average + 3 LU, TP ≤ −1 dBTP; `impact_sub-hit-short_01` candidate only with the muffle and whoomp, else NEEDS-GEN); S18 snaps off at +8; dead silence +18–+23 (S08 off too).
- **Contact timing re-check:** contact f1081 is 17 f after L10 ends (f1064; R1 16 f), 44 f after the arm-lift word (f1037 est; R1 42 f) and 24 f before L08 (f1105; R1 24 f). The approved strip is untouched.
- Acceptance: luminance rise at +8 and +9 ≤ 0.08; one flash only; frame strip viewed.
- Entry → exit: claw raised → black bubble.

**17. S01-B05-SH16 — L08 a** [1097, 1125), 28 f. VO C14 +8–+27 (phrase 0; the line continues into SH17).
- Transition in: iris-out from SH15S's black bubble through her eyes [1097, 1109).
- Camera: R1's camera, held (1 % drift over **+0–+28**). RX, bulb, button and rocker off-frame ([D2](#decisions)).
- Staging: alive, lamp-lit; she swallows **+14–+23**.
- Sound: S21 whoosh-out +0–+12 with A1 city hum returning first; S22 swallow **+15**.
- Entry → exit: iris opening on her face → swallowed, still.

**18. S01-B05-SH17 — L08 b** [1125, 1171), 46 f. VO C14 +3–+37 ("เงียบไว้ก่อน" **+17** est).
- Camera: `camSH03` → moved 6 % toward the button, push **+0–+17**, **still from +17**.
- Staging: finger 1 cm above the lit button, no movement. Three dotted circles at **+31, +36, +40** (pop ramp **+29–+42**); the ragged circle opens at **+44** (bloom **+44–+59**) into SH18.
- Sound: A1 thin; M1 low; no sting; S23 bubble bloom **+44**.
- Entry → exit: finger still → bubble opening.

**19. S01-B05-SH18 — L11 (IM4 forest)** [1171, 1323), 152 f. VO C15 +6–+141.
- Transition in: bubble dissolve [1171, 1185) (14 f): star dust thickens into mist, trunks rise **+4–+31**.
- Camera: `forestCam(k)`, k 0 → 1 over **+14–+151**.
- Staging: nothing moves but the mist; fully formed by "ป่า" (**+75**, f1246 est).
- Sound: S24 forest bed: wind high in the leaves **+0–+42** fading, thin insects **+6–+33** that **stop dead at +33** (f1204, 4 f before "จักรวาล" f1208 measured, as R1), then still air; M1 down to the drone.
- Entry → exit: dust becoming trunks → deeper in the still forest.

**20. S01-B05-SH19 — L13** [1323, 1450), 127 f. VO C16 +6–+123.
- Transition in: bubble close dissolve [1323, 1335).
- Camera: `camSH03` → moved 30 % toward the button, slow push **+12–+126**.
- Staging: no movement until "เหมือนคุณเมื่อกี้" (**+98**, f1421 measured): the fingertip trembles once (1 px, **+98–+100**).
- Sound: A1 thin; M1 drone **drops a semitone at +98** (f1421).
- Entry → exit: finger → finger, closest.

**21. S01-B05-SH20 — W-OFF a** [1450, 1472), 22 f. No VO. *(shot-local keys unchanged)*
- Camera and staging as R1: hand lifts +2–+12, to her chest +12–+16, leaves toward the switch +17–+21.
- Sound: S25 cardigan rustle +2 (f1452); S26 held breath +4 (f1454) then silence.

**22. S01-B05-SH21 — W-OFF b** [1472, 1495), 23 f. No VO. *(shot-local keys unchanged)*
- Camera `camSH21`, held. +0–+5 lit; **+6 click (f1478)**: lamp and button off; +6–+13 the pool collapses, filament dies; +14–+22 dark.
- Sound: S27 lamp click +6 (f1478); A1 dip −3 dB at +6 for 20 f; the AC hum stays.

**23. S01-B05-SH22 — L15** [1495, 1628), 133 f. VO C17 +2–+117. **Label off from +0.**
- Camera: `camSH22` held **+0–+63**, then pan and tilt up **+63–+105**, hold **+105–+132** (end values: R1's sheet line; Boss's W5.2 r3 re-key pending Film review).
- Staging: hold on the last "เงียบ" row to "ยังเงียบ" (**+64**, f1559 est); **+73** her eyes go up (look-up **+73–+84**); the camera arrives on her face looking at the sky over "แต่ถ้ามันใช่" (**+79–+117**, f1574 measured).
- Sound: A1 thinned to the city hum; S28 END-TONE begins at +2 (fade in 30 f).
- Entry → exit: logbook, label off → her face lifted to the sky.

**24. S01-B05-SH23 — L16 + hold** [1628, 1800), 172 f. VO C18 +4–+127.
- Camera: R1's orbits, eased **+0–+127** (ends with the last word, f1755, as R1); **hold +127–+171** (45 f, was 60) plate-owned with ambient motion, not a frozen frame.
- Staging: as R1. No label, no title.
- Sound: S28 END-TONE holds through L16; fades with the city hum over **+127–+157** (30 f, was 45); the hum alone **+157–+171** (15 f ≈ 0.5 s, unchanged); silence at the end. No tag, no sting.
- Entry → exit: her up-turned face → the still real sky over her small dark roof.

## Sound cue list (for Ton)

Global frames (shot start + shot-local). Descriptions unchanged from R1; every library ID is a candidate, "not listened"; NEEDS-GEN unless Ton finds the file fits. Ton re-times `sound-cues.json` to these frames (this pass does not touch it).

| Cue | Shot (+n) | Global (R1 → R2) | Description (source, action, material, space, length, feeling) | Library candidate |
| --- | --- | --- | --- | --- |
| A1 | SH01 +0 → SH23 end (out in TH shots) | 0–1737 → **0–1800** | Roof bed: far Bangkok night, traffic wash, one far motorbike, a dog far off, a few insects, faint AC hum; drops out at **f121**, back thinned at **f489**, city hum only from SH22 (**f1495**), dip −3 dB at **f1478** | `city_still-night-air_01` as base if it fits; insects and motorbike NEEDS-GEN |
| M1 | SH03 +4 → end | 118–1737 → **123–1800** | Sub drone, no pulse; ducks under lines; −3 dB lower from **f735**; semitone drop at **f1421** | `bed_sub-drone-fade-in_01` candidate |
| M2 | SH05 +3 → SH08 +63 | 227–526 → **237–552** | Cold minor pad, bowed glass or felt piano single notes far away, sparse | NEEDS-GEN |
| S01 | SH01 +0 | 0 → **0** | PING: bright, clean, slightly old-electronic tone, not a phone ding, close and dry, ≈ 0.6 s; thrill | NEEDS-GEN |
| S02 | blip clock | f21…f651 (muted f302–466) → **f21…f672 (muted f316–489)** | BLIP: soft short version of the ping, ≈ 0.12 s, every 21 f; forward and dry in B03 | NEEDS-GEN |
| S03 | SH01 +8 | 8 → **8** | Her small happy gasp, close, ≈ 0.4 s; delight | NEEDS-GEN |
| S04 | SH02 +13 | 42 → **43** | Headphone band creak, padded plastic, tiny squeak, close | NEEDS-GEN |
| S05 | SH02 +23 | 52 → **53** | Cardigan sleeve rustle as the arm reaches, soft knit | NEEDS-GEN |
| S06 | SH05 +73 | 294 → **307** | Bubble bloom: soft airy pop with a glassy tail, inside-head | NEEDS-GEN |
| S07 | SH05 +75 → SH06 +10 | 296–312 → **309–326** | Whoosh-in: short airy inhale-whoosh into thought, ≈ 0.5 s | NEEDS-GEN |
| S08 | TH shots | 302–466, 767–1042, 1119–1133 → **316–489, 803–1091, 1171–1185** | Inside-head air: very quiet, wide, slightly reverberant | NEEDS-GEN |
| S09 | SH07 +4 → +73 | 386–452 → **404–473** | Travel tone: thin high sine following the bead, falling on the return | NEEDS-GEN |
| S10 | SH07 +4 → +82 | 386–460 → **404–482** | Clock-tick bed: soft, dry, slightly slow ticks | NEEDS-GEN |
| S11 | SH08 +0 → +12 | 466–478 → **489–501** | Whoosh-out: reverse of S07 ending on A1 | NEEDS-GEN |
| S12 | SH10 +4 → SH11 +18 | 611–672 → **640–693** | Reverse-swell riser, quiet and airy, **stops dead** with the missing blip | `tension_airy-swell-stop-dead_01` candidate |
| S13 | SH12 +66 → SH13 +12 | 761–779 → **797–815** | Whoosh-in with a soft muffle (iris through her eyes) | NEEDS-GEN |
| S14 | SH13 +6 | 773 → **809** | Low breathy swell, panned left, ≈ 1.5 s; her fear; no growl | NEEDS-GEN |
| S15 | SH13 +24 | 790 → **827** | The mirror of S14, panned right | NEEDS-GEN |
| S16 | SH13 +53 | 818 → **856** | Tiny warm shimmer, two soft notes, ≈ 0.4 s; the kind figure | NEEDS-GEN |
| S17 | SH13 +72 → +87 | 836–850 → **875–890** | Low breath rise as the shadow swallows her; no creature voice | NEEDS-GEN |
| S18 | SH14 +12 → SH15S +8 | 878–1032 → **919–1081** | Travel tone, slower and lower than S09; snaps off at contact | NEEDS-GEN |
| S19 | SH15 +56 → SH15S +8 | 970–1032 → **1015–1081** | Slow pressure riser, tightening at **f1037**, choked at contact (no peak) | NEEDS-GEN |
| **S20** | **SH15S +8** | 1032 → **1081** | **Strike thud** (as SH15S line); then 6 f dead silence **f1091–1097** | `impact_sub-hit-short_01` candidate only with the muffle and whoomp; else NEEDS-GEN |
| S21 | SH16 +0 → +12 | 1048–1060 → **1097–1109** | Whoosh-out from the black bubble; A1 city hum returns first | NEEDS-GEN |
| S22 | SH16 +15 | 1063 → **1112** | Her swallow: small, close, dry | NEEDS-GEN |
| S23 | SH17 +44 | 1117 → **1169** | Bubble bloom (as S06) | S06 reused |
| S24 | SH18 +0 → +152 | 1119–1263 → **1171–1323** | Forest bed: wind fading by +42; insects +6–+33 that stop dead at **f1204**; then still air | NEEDS-GEN |
| S25 | SH20 +2 | 1387 → **1452** | Cardigan rustle, the hand drawing back | NEEDS-GEN |
| S26 | SH20 +4 | 1389 → **1454** | Held breath: small in-breath, then nothing | NEEDS-GEN |
| S27 | SH21 +6 | 1413 → **1478** | Lamp click: small plastic rocker switch with a spring tick, close, dry, ≈ 0.1 s | `foley_flashlight-click_01` candidate |
| S28 | SH22 +2 → SH23 +171 | 1432–1737 → **1497–1800** | END-TONE (the episode's closing sound, UT15): single low sustained tone, soft sine with a faint bowed-metal overtone; fade in 30 f, hold, fade over the hold **f1755–1785**, hum alone **f1785–1800** | NEEDS-GEN |

Silences (designed): **f121–163** everything but the blip; **f693–735** (W-STOP, hum only, 42 f); **f1091–1097** (dead, 6 f).

## Acceptance (timed checks)

| Frame (global) | Observable | Evidence |
| --- | --- | --- |
| f0 | Spike on screen, all four clues readable at 270 px; PING sounds | QA sheet + listen |
| f123 | Finger frozen 1 cm above the button; ambience gone, blip alone | QA sheet, mix |
| f468 ±5 | a81 face lands on "ผมหงอก" (a81 full at f470) | QA sheet at f468 |
| f672 / f693 | Last spike inside "ยังอยู่ไหม"; nothing at f693; riser stops dead at f693 | strip f665–700 + listen |
| f827, f856–875 | Mirror bubble on "เหมือนกัน"; kind figure 19 f | strip |
| f907 | SH13 → SH14 boundary with no visible cut and no see-through monster | strip f903–911 |
| f1037 ±5 | Arm lifts on "แซงคุณไปแล้ว" | strip |
| f1081 | One small amber flash behind the claw; luminance rise ≤ 0.08; thud at the same frame, ≤ narration avg + 3 LU | strip f1073–1097, luminance, loudness |
| f1097–1109 | Iris-out onto her lamp-lit face; no receiver, bulb or button in frame | QA sheet |
| f1421 | Drone drops a semitone on "เหมือนคุณเมื่อกี้" | listen |
| f1478 | Click; warm light leaves the whole roof within 8 f | strip |
| f1495 | Label off | QA sheet |
| f1755–1800 | Still sky, ambient motion only; END-TONE fades, hum alone last 0.5 s; no title | strip + listen |
| all captioned shots | Faces, hands, button, trace, lights above y 1160; caption band mean ≤ 0.25, p95 ≤ 0.40 | `scripts/caption-zone.py --band 1176:1344` |

<a id="decisions-r1"></a>
## Decisions

- **D1 — WOMAN root: SH01_AT (0.04, 0, −0.02) in every roof shot.** (R1, unchanged.)
- **D2 — L08 receiver: out of frame** (brief VD11, Boat P4). (R1, unchanged.)
- **D3 — Title "ป่าเงียบ": cover only.** (R1, unchanged.)
- **D4 — V01 star off-frame.** (R1, unchanged.)
- **D5 — SH08 over her left shoulder.** (R1, unchanged.)
- **D6 — Wordless beat lengths (R2):** W-PING 31 f; W-STOP 44 f of no voice (flat 60 f, 42 f after the missing blip); W-STRIKE 24 f (approved strip) with a 9 f wind-up before and an 8 f iris before L08; W-OFF 45 f (SH20 22 + SH21 23); end hold 45 f. Total 60.00 s.
- **D7 — Bead at 0.40 at the strike.** (R1, unchanged.)
- **D8 — SH10/SH11 and SH04/SH05 are continuous camera runs** with a beat boundary, no visible cut. (R1; SH13/SH14 joins them, D11.)
- **D9 — Blip clock keeps PING = spike 0 at f0 and the 21 f period; the last spike moves to f672 and the missing blip to f693 (R2).** With the slower read L14 ends at f691. R1's relation (last spike 8 f before the question ends, missing blip 13 f after) needs a spike near f683, which the 21 f grid from f0 cannot give. Chosen: last spike f672 inside "ยังอยู่ไหม", missing blip f693 two frames after the question ends, so the question is answered at once by the blip that never comes; the riser cuts dead with it. Cost: 42 f of hum-only silence before L18 (R1 31 f), still inside W-STOP. Rejected: last spike f693 / missing f714 (a blip would answer the question "yes" before stopping); shifting the clock phase by 11 f (exact R1 relation, but the film would no longer open on the spike at f0, losing the first-frame hook).
- **D10 — End hold 60 → 45 f (R2).** The fixed offsets give speech end f1755; a 60 f hold would make 1815 f (60.5 s), over the 60.0 s target. Only the hold is trimmed: the END-TONE fade shortens 45 → 30 f and the hum-alone tail stays 15 f.
- **D11 — SH13 → SH14 is a hard boundary, continuous run (Boss W5.4, adopted in R2).** The 8 f "same space" dissolve glazed SH14's opaque black monsters see-through over SH13's (opaque-cast rule, DF-20261031-painted-opaque-cast); SH14 +0 repaints SH13's end state, so no dissolve is needed. Removed from the dissolve list (`src/videos/edu-ep16/index.ts` already has it out).
- **D12 — The read's L10 → L08 gap grew 1 f (40 → 41 f); the extra frame goes to SH15's wind-up hold (8 → 9 f after L10)**, keeping the approved 24 f strike strip and SH16's 8 f iris lead before L08.

## R2 re-time: old → new

Rule: every cut keeps R1's lead before its line (or its wordless anchor); keys inside narration scale ×1.05 about the shot's VO onset, snapped to measured phrase onsets; wordless shots SH01, SH15S, SH20, SH21 keep their shot-local keys.

| Shot | R1 range (len) | R2 range (len) | Δ len | Key frames changed (shot-local, R1 → R2) |
| --- | --- | --- | --- | --- |
| SH01 | [0, 30) 30 | [0, 30) 30 | 0 | none |
| SH02 | [30, 114) 84 | [30, 119) 89 | +5 | push +10–66 → +10–69; hold to +83 → +88; press +8–22 → +8–23, held to +60 → +63, down by +80 → +84; reach +20–64 → +21–67; band +40–55 → +42–58, above from +56 → +59; S04 +12 → +13; S05 +22 → +23 |
| SH03 | [114, 156) 42 | [119, 163) 44 | +2 | none |
| SH04 | [156, 224) 68 | [163, 234) 71 | +3 | arc +0–67 → +0–70 |
| SH05 | [224, 302) 78 | [234, 316) 82 | +4 | push +0–56/+56–77 → +0–59/+59–81; mouth smile < +25 → < +26; worried +30 → +31; look-up out +40–50 → +42–52; dots pop +54–66 → +57–69 (dots +58/62/66 → +61/65/69); bubble +70–82 → +73–85; S06 +70 → +73; S07 +72 → +75 |
| SH06 | [302, 382) 80 | [316, 400) 84 | +4 | tilt +6–74 → +6–77; star enters +30 → +31 |
| SH07 | [382, 466) 84 | [400, 489) 89 | +5 | slide +0–83 → +0–88; bead up +4–35 → +4–37; down +35–70 → +37–73; a50 +42–50 → +44–52; a81 +59–67 → +62–70; S09/S10 ends +70/+78 → +73/+82 |
| SH08 | [466, 544) 78 | [489, 571) 82 | +4 | push +12–77 → +12–81; M2 out by +60 → +63; blips n 23–25 → n 24–27 |
| SH09 | [544, 607) 63 | [571, 636) 65 | +2 | push +0–62 → +0–64; eye lift +34–40 → +36–42 (word +36 → +38) |
| SH10 | [607, 654) 47 | [636, 675) 39 | −8 | push and dead stop +44 → +36; spikes +23/+44 → +15/+36 |
| SH11 | [654, 699) 45 | [675, 731) 56 | +11 | missing blip, riser dead, glow dim stay +18/+18–24 (f672 → f693); caption tail +5 → +16 |
| SH12 | [699, 767) 68 | [731, 803) 72 | +4 | push +0–60/+60–67 → +0–63/+63–71; eye lift +23–29 → +24–30; S13 +62 → +66 |
| SH13 | [767, 866) 99 | [803, 907) 104 | +5 | push/slide/thCam +6–98 → +6–103; hers pop +8–18 → +8–19, monster +10–18 → +10–19, rise +12–35 → +12–36; theirs blink +23–27 → +24–28, pop +25–35 → +26–36, monster/rise +27–35 → +28–36; recede +45–51 → +47–53; kind on ≥ +51 → ≥ +53, fade-in +51–54 → +53–56, fade-out +72–79 → +75–83, off at +79 → +83; shadow rise +69–79 → +72–83; monster switch +69 → +72; eyes dim +69–72 → +72–75, open +79–83 → +83–87; out dissolve 8 → none |
| SH14 | [866, 916) 50 | [907, 959) 52 | +2 | in dissolve 8 → none; SH13 end-state cards 99 → 104; truck +0–20/+20–49 → +0–21/+21–51; thCam +0–49 → +0–51; bead 0.11 at +49 → +51 |
| SH15 | [916, 1024) 108 | [959, 1073) 114 | +6 | dolly +40–92 → +42–97; hold +92–107 → +97–113; tiny hold to +44 → +46; swell +54–84 → +56–88; glow drawn from +54 → +56; their light fade +54–70 → +56–73; rise +59–89 → +62–93; opacity +59–74 → +62–78; arm +74–92 → +78–97; S19 +54/+74 → +56/+78 |
| SH15S | [1024, 1048) 24 | [1073, 1097) 24 | 0 | none (contact f1032 → f1081) |
| SH16 | [1048, 1075) 27 | [1097, 1125) 28 | +1 | drift +0–27 → +0–28; swallow +14–22 → +14–23 |
| SH17 | [1075, 1119) 44 | [1125, 1171) 46 | +2 | push/still +16 → +17; dots pop +28–40 → +29–42 (dots +30/34/38 → +31/36/40); bubble +42–56 → +44–59; S23 +42 → +44 |
| SH18 | [1119, 1263) 144 | [1171, 1323) 152 | +8 | trunks +4–30 → +4–31; forestCam +14–143 → +14–151; "ป่า" +72 → +75; wind to +40 → +42; insects stop +31 → +33 |
| SH19 | [1263, 1385) 122 | [1323, 1450) 127 | +5 | push +12–121 → +12–126; tremble +94/95/96 → +98/99/100; drone semitone +94 → +98 |
| SH20 | [1385, 1407) 22 | [1450, 1472) 22 | 0 | none |
| SH21 | [1407, 1430) 23 | [1472, 1495) 23 | 0 | none (click f1413 → f1478) |
| SH22 | [1430, 1555) 125 | [1495, 1628) 133 | +8 | hold +0–60 → +0–63; pan +60–100 → +63–105; hold +100–124 → +105–132; look-up +70–80 → +73–84; "ยังเงียบ" +61 → +64; arrive +74–110 → +79–117 |
| SH23 | [1555, 1737) 182 | [1628, 1800) 172 | −10 | crane +0–122 → +0–127; hold 60 f +122–181 → 45 f +127–171; END-TONE fade +122–167 → +127–157 |

### Frame-driven numbers in code (Boss; Editor where marked)

Read from the active checkout (uncommitted W5.2–W5.4 code); Film does not edit `src/`.

| File | Code (R1) | R2 |
| --- | --- | --- |
| `clock.ts` | `TOTAL = 1737` | `1800` |
| `clock.ts` | `SHOT_RANGES` | the R2 ranges of the shot map (SH02 [30, 119) … SH23 [1628, 1800)) |
| `clock.ts` | blip guard `length !== 32`, `BLIP_FRAMES[31] !== 651`, comments n 0..31, f654, f672 | `length !== 33`, `BLIP_FRAMES[32] !== 672`; n 0..32, flat f675, missing f693 (values come from `blip-clock.json`) |
| `clock.ts` | `traceLevelAt` comment f672–678 (SH11 +18..+24) | f693–699 (same shot-local frames) |
| `clock.ts` | `labelOn`: 156, 302, 1430 | 163, 316, 1495 |
| `clock.ts` | `STK_KEYS` comment contact f1032 | f1081 (keys unchanged) |
| `clock.ts` | `beadAt`: 878, 915, 1024 | 919, 958, 1073 |
| `shots/S01-B01-SH02.tsx` | `ease(L, 10, 66)` (camera and `fall`), `ease(L, 8, 22)`, `ease(L, 60, 80)`, `ease(L, 20, 64)` | `ease(L, 10, 69)`, `ease(L, 8, 23)`, `ease(L, 63, 84)`, `ease(L, 21, 67)` |
| `shots/S01-B02-SH04.tsx` | `ease(L, 0, 67)` | `ease(L, 0, 70)` (look-up +4 and brow +22–26 unchanged) |
| `shots/S01-B02-SH05.tsx` | `ease(L, 0, 56)`, `ease(L, 56, 77)`, `ease(L, 40, 50)` ×2, `L >= 30`, `L < 25`, `ramp(L, 54, 66)`, `ease(L, 70, 82)` | `ease(L, 0, 59)`, `ease(L, 59, 81)`, `ease(L, 42, 52)` ×2, `L >= 31`, `L < 26`, `ramp(L, 57, 69)`, `ease(L, 73, 85)` |
| `shots/S01-B02-SH06.tsx` | `ease(L, 6, 74)` | `ease(L, 6, 77)` |
| `shots/S01-B02-SH07.tsx` | `ramp(L, 0, 83)`, `L < 35`, `L >= 35 && L <= 70`, `ease(L, 4, 35)`, `ease(L, 35, 70)`, `ease(L, 42, 50)`, `ease(L, 59, 67)` | `ramp(L, 0, 88)`, `L < 37`, `L >= 37 && L <= 73`, `ease(L, 4, 37)`, `ease(L, 37, 73)`, `ease(L, 44, 52)`, `ease(L, 62, 70)` |
| `shots/S01-B02-SH08.tsx` | `ease(L, 12, 77)` | `ease(L, 12, 81)` |
| `shots/S01-B03-SH09.tsx` | `ease(L, 0, 62)`, `ease(L, 34, 40)` | `ease(L, 0, 64)`, `ease(L, 36, 42)` |
| `shots/S01-B03-SH10.tsx` | `pushTo`: `L / 44` | `L / 36` |
| `shots/S01-B04-SH12.tsx` | `ease(L, 0, 60)`, `ease(L, 60, 67)`, `ease(L, 23, 29)` | `ease(L, 0, 63)`, `ease(L, 63, 71)`, `ease(L, 24, 30)` |
| `shots/S01-B04-SH13.tsx` + `scenes-im.ts` | `ease(L, 6, 98)` (shot `k`, `sh13Push`, `slide`) | `ease(L, 6, 103)` |
| `scenes-im.ts` (hers) | `ramp(L, 6, 10)`, `ease(L, 8, 18)`, `ramp(L, 10, 18)`, `ease(L, 12, 35)` | `ramp(L, 6, 10)`, `ease(L, 8, 19)`, `ramp(L, 10, 19)`, `ease(L, 12, 36)` |
| `scenes-im.ts` (theirs) | `ramp(L, 23, 27)`, `ease(L, 25, 35)`, `ramp(L, 27, 35)`, `ease(L, 27, 35)` | `ramp(L, 24, 28)`, `ease(L, 26, 36)`, `ramp(L, 28, 36)`, `ease(L, 28, 36)` |
| `scenes-im.ts` (flicker) | `ease(L, 45, 51)`, `ease(L, 69, 79)`, eyes `L < 79`, `ramp(L, 69, 72)`, `ramp(L, 79, 83)`; kind `L >= 51 && L < 79`, `ramp(L, 51, 54)`, `ramp(L, 72, 79)`; `L < 69` / `L >= 69` | `ease(L, 47, 53)`, `ease(L, 72, 83)`, eyes `L < 83`, `ramp(L, 72, 75)`, `ramp(L, 83, 87)`; kind `L >= 53 && L < 83`, `ramp(L, 53, 56)`, `ramp(L, 75, 83)`; `L < 72` / `L >= 72` |
| `shots/S01-B04-SH14.tsx` | `paintSH13Cards(p, 99, …)`, `ease(L, 0, 20)`, `ease(L, 20, 49)`, `ease(L, 0, 49)` | `paintSH13Cards(p, 104, …)`, `ease(L, 0, 21)`, `ease(L, 21, 51)`, `ease(L, 0, 51)` (fold, settle, thread and bead-pop keys unchanged) |
| `shots/S01-B04-SH15.tsx` | `ease(L, 40, 92)`, `ease(L, 54, 84)`, `easeOut(L, 59, 89)`, `ease(L, 74, 92)`, `L >= 54`, `ramp(L, 54, 70)`, `ramp(L, 59, 74)` | `ease(L, 42, 97)`, `ease(L, 56, 88)`, `easeOut(L, 62, 93)`, `ease(L, 78, 97)`, `L >= 56`, `ramp(L, 56, 73)`, `ramp(L, 62, 78)` |
| `shots/S01-B04-SH15S.tsx` | none (comment f1032) | comment f1081 |
| `shots/S01-B05-SH16.tsx` | `ease(L, 0, 27)`, `ramp(L, 14, 22)` | `ease(L, 0, 28)`, `ramp(L, 14, 23)` |
| `shots/S01-B05-SH17.tsx` | `ease(L, 0, 16)`, `ramp(L, 28, 40)`, `ease(L, 42, 56)` | `ease(L, 0, 17)`, `ramp(L, 29, 42)`, `ease(L, 44, 59)` |
| `shots/S01-B05-SH18.tsx` | `ramp(L, 4, 30)`, `ease(L, 4, 30)`, `ease(L, 14, 143)` | `ramp(L, 4, 31)`, `ease(L, 4, 31)`, `ease(L, 14, 151)` |
| `shots/S01-B05-SH19.tsx` | `ease(L, 12, 121)`, `TREMBLE` keys 94/95/96 | `ease(L, 12, 126)`, keys 98/99/100 |
| `shots/S01-B05-SH20.tsx`, `SH21.tsx` | none (click comment f1413) | comment f1478 |
| `shots/S01-B05-SH22.tsx` | `ease(L, 60, 100)` (pan, and the r3 lens ease if it shares it), `ease(L, 70, 80)` | `ease(L, 63, 105)`, `ease(L, 73, 84)` |
| `shots/S01-B05-SH23.tsx` | `ease(L, 0, 122)` | `ease(L, 0, 127)` |
| `src/videos/edu-ep16/index.ts` (Editor) | `TOTAL !== 1737` guard, `labelOn` 156/302/1430, narration file | `1800`, 163/316/1495, the re-locked placed read; `DISSOLVE_IN` unchanged (SH14 already out) |
| `src/videos/edu-ep16/cues.ts` (Editor) | captions C01–C18 on R1 frames | the C01–C18 table above |
| Shot header comments | R1 ranges and frames | R2 values (doc only) |

## Dependencies and open items

| Owner | Dependency / acceptance | Status |
| --- | --- | --- |
| Boss | Re-key the shot code per the [code table](#frame-driven-numbers-in-code-boss-editor-where-marked); re-render the affected plates; frame-check SH10/SH11 (f665–700), SH13/SH14 boundary, SH15S strip | missing (R1 shots built) |
| Film (next pass) | Review Boss's W5.2 r2/r3 framing re-keys (SH05, SH09, SH12, SH13 push, SH16, SH22) against frames; this sheet keeps R1 camera numbers | open |
| Ton | Re-time `sound-cues.json` and the blip placements to the cue list above (S02 now 32 blips f21–f672; S12 ends f693; S28 fade 30 f) | missing |
| Editor | Re-lock the slower read (confirm the three cut points still lie in silence and frames within 1–2 f of this sheet; report any line that moves more); place N1–N4 at +0.80/+1.90/+2.60/+3.80 s; captions per C01–C18; labels per the label line; total 1800 f | in progress (parallel) |
| Boss | Rack focus SH09 | `unknown`; fallback both sharp |
| Boss | ENV-STARS kit promotion (second use) | missing |
| Preaw (optional) | Align script L08 cue with D2 | open, not blocking |

Element captures: as R1 (`out/edu16/look-frames/v12-clean/…`, `out/edu16/roof/v7…v11/clean/…`). The R1 draft cut (`out/EDU-EP16-SHORT/clips/_draft_cut.mp4`, 1737 f) no longer matches these frames.

## Change log

- 2026-11-15 **EDU-EP16-SHEETS-R1** (Film, W5.1) — first timed scene sheet on script R3, brief R2 + W3 notes, voice lock v1 (52.402 s, measured W4.2). 24 shots, 1737 f = 57.90 s. Narration placed in four pieces (N1–N4). Decisions D1–D8.
- 2026-11-15 **EDU-EP16-SHEETS-R2** (Film, re-time) — user decision 15 Nov 2026: narration 5 % slower (atempo 1.08 → 1.028571, 55.045 s). Every shot range, caption, label range, dissolve, wordless beat, sound cue and acceptance frame re-timed with the same offsets (+0.80/+1.90/+2.60/+3.80 s) and new cut points 22.412/33.899/45.854 s; beat-to-word relations of R1 kept. 1800 f = 60.00 s (end hold 60 → 45 f, D10). Blip clock: one more spike, last f672, flat f675, missing f693 (D9; `blip-clock.json` rewritten, R1 kept as `blip-clock-r1.json`). Wind-up +1 f (D12). SH13 → SH14 dissolve removed after Boss W5.4 (D11). Camera geometry, staging, looks and IDs unchanged. Timing source is an ESTIMATE (scaled measure) pending Editor's re-lock.
</content>
</invoke>
