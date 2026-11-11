# Timed scene sheets and index — EDU-EP01-SHORT (EDU-SHEETS-R1.1)

- **Status:** `ready-for-dev` (Film W5.1, 2026-11-04). Timing = **audio-measured** (Kore v1 lock, [narration-measure-kore.json](narration-measure-kore.json), 61.97 s). Picture, runtime and sound: not yet validated.
- **Inputs (by revision):** script EDU-SCRIPT-R1.1 ([script.md](script.md)); brief EDU-BRIEF-R1 ([brief.md](brief.md), decisions VD01–VD10, sound direction, technical handoff); storyboard SS-R1 23/23 passed and look lock LF01 v2, LF02 v5, LF03 v2, LF04 v3, LF05 v2 ([review-rows.json](review-rows.json), seen-text per shot lives there and is not repeated); voice lock `~/ReelsStore/projects/edu/EDU/audio/voice-lock-v1/EDU-EP01-SHORT-narration-kore-v1.wav` (store path, 61.97 s, -16.1 LUFS).
- **Content changes vs the passed storyboard: none.** Only start/end frames, the fall-to-jolt design, sound cues and caption plan are added.
- **Baseline (brief: VD01, Technical handoff):** canvas 1080×1920, 30 fps, plate px origin top-left, x right, y down. Camera push `s0→s1` is scale about the focal anchor `(fx 540, fy)` as in the look frames (`pushCamera`, [look.tsx](../../../src/painted/edu01/look.tsx)); anchors: bedroom `fy 820`, cliff `fy 800`, idea space `fy 900`, icons `fy 600`, doctor `fy 700`. Bedroom plate constants: `ROOM` in [set.ts](../../../src/painted/edu01/set.ts) (pillow (320, 985), mattress top y 1010, window x 590–990, clock (78, 1040)). Shot-local frame `L` = comp frame − shot start.
- **Frame rule:** frame = round(s × 30). A shot starts 4 f before its line's measured onset (picture leads voice); a shot that starts on a phrase inside a line starts 4 f before that phrase's onset (phrase onsets from `silencedetect -36 dB / 0.07 s` on the lock take, estimate ±4 f; Editor confirms with Whisper words at integration). Exceptions: SH01 (frame 0), and the fall/jolt shots (designed below).
- **One shot = one timeline scene** (AGENTS.md render-by-scene). Scene ID = shot ID. In-scene transitions (room to cloud bleed in B03-SH01, wash-out in B05-SH06) stay inside their scene. All shots join by hard cut except where stated.

## Totals

- **23 shots, 1860 frames = 62.00 s** at 30 fps (audio 61.97 s = 1859.1 f; 1 f of silence pad). Limit 63 s: pass. Script target 60 s: over by 2.0 s (the approved read, not a regression).
- Ending: `C_seamless`, `loopBlendFrames` 15 (brief: VD02). Silence at the seam: lead 0.35 s (10.5 f) + tail 0.65 s (L16 ends f1840, 20 f of no voice before f1860).

## Jolt gap decision (L05 end to L07 onset)

- **Kept at the measured 2.99 s (89 f, f490 to f579). No new gap, no regeneration of the voice lock.** Reasons: the user approved Kore v1 with this gap left to Film; 89 f holds exactly the designed content below with no padding, and cutting it would only save a second against a 63 s limit that is already met. If the user wants ≤ 61 s, shorten the fall to 30 f and Editor re-runs `voice-regap.py` with the jolt gap at 2.7 s placeholder (new length about 61.5 s); not done.

| Comp frames | Shot | Content | Length |
| --- | --- | --- | --- |
| 490–535 | B03-SH03 | fall through upward paint, wind peak | 45 f (1.50 s) |
| 535–550 | B03-SH04 | frozen frame, **hard silence** (all audio digital zero) | 15 f (0.50 s) |
| 550–579 | B03-SH05 | hard cut to bed, jolt, thump + **L06 gasp**, eyes wide, clock back | 29 f (0.97 s) |
| 579 | B04-SH01 | L07 onset | |

## L06 gasp decision

- **A separate character voice, not narrator Kore.** Reasons: script L06 ("one acted gasp from the character, not narrator"); the narrator is a non-character voice (brief sound direction, atempo and loudness-normalised) and the gasp is the woman's body, so it must not carry the narrator's timbre or the lock's atempo 1.08.
- **Editor generates (W5.1 handoff):** one wordless acted gasp (sharp inhale through the mouth, startled, young woman, no words, no exhale tail longer than 0.15 s) with the gemini-tts skill's inline `<gasp>` tag, in a young-woman Gemini voice that is not Kore or Achernar. Three takes, pick one, trim to 0.35–0.5 s, no atempo, peak −3 dBFS, file as library `vocal_gasp-young-woman_01`. Fallback if the tag gives words or a laugh: try another young-woman voice; the library has no usable vocal gasp (`foley_sleeper-breath-tent_01` is too quiet and slow).
- **Placement:** onset at comp f552 (B03-SH05 local f2), dry, no reverb, level 3 dB under the narrator's loudness (−19 LUFS-ish short term; Editor's mix call). No subtitle for the gasp (script).

## Sound plan (whole video; per-shot lines below)

Library check 2026-11-04, `~/ReelsStore/library/sound/INDEX.md`. All library files are `generated, not listened`; Editor ear-checks before use.

| Layer | Source | Use |
| --- | --- | --- |
| Clock tick | `tension_clock-pulse_01` (9.8 s, loop) | bedroom bed, f0–371, returns f565 to end |
| Thump (jolt) | `pulse_underwater-soft-thump_01` (0.634 s) | f550; replaces the brief's NEEDS-GEN thump |
| Wind (dramatised) | `outdoor_wind-open-roundabout_01` (11 s, loop) with gain automation | f331–535 rising |
| Fall accent | `whoosh_air-swish-rising_01` (0.8 s) | f490 |
| Fabric | `foley_hoodie-hood-pull_01` (0.86 s) | blanket and sit-up (candidate) |
| Pops | `ui_pop_01` (0.075 s) | icons, "?" and bubbles |
| Name card | `reveal_glass-shimmer-soft_01` (1.39 s) | f640 (optional, low) |
| Brain click / sun-moon catch | `impact_hit-punch_01` (0.254 s) lowpassed and −18 dB | B05-SH03 catch |
| **NEEDS-GEN 1** | Warm ambient pad, 62.5 s, no beat, about 60 bpm, loopable with matched head and tail (the f1860→f0 level and tone must be the same) | whole video bed |
| **NEEDS-GEN 2** | 6 single soft plucked notes (marimba or harp, close, 1.5 s each, varied pitch, dry) | B05, B06 sparkle |
| **NEEDS-GEN 3** | Gasp `vocal_gasp-young-woman_01` | f552 (above) |
| Optional gen | Quiet bedroom room tone, 20 s loop | under clock; skip if the pad covers it |

**Pad gain arc (dB re the B01 level = 0; Editor adjusts, ducks `duckUnderNarration`):** f0–331 `0`; f331–411 to `−8`; f411–535 to `−24` (near nothing); f535–550 hard cut (−∞); f550–579 off; f579–613 returns to `+1` (slightly brighter at the name); B05–B06 `−1` with plucks; B07 `+1`; f1746–1860 eases to `0`, exact B01 level at f1860, no fade-out, no stinger. Hard silence at 535: pad, clock and wind all gain to zero on frame 535 (no 4 f ramp).

## Caption-shade plan (UT12, [caption-backdrop](../../../docs/production-requirements.md#caption-backdrop))

- Captions: white text, `captionStyle.position: 'middle'` (band y ≈ 860–1248), subtitle text per script "Sub" lines; none during B03-SH03/04/05 (no VO, no subtitle for the gasp). Name card is a separate overlay above the band (VD06).
- Shade: kit `CaptionShade` ([screen.tsx](../../../src/painted/kit/screen.tsx)), centred on the ink, height follows 1 or 2 lines, cues `[from, to, lines]` from the sub timings. The look frames fail `caption-zone.py` on every ground (LF01 mean 0.37, LF02 0.78, LF03 0.82, LF04 0.90, LF05 0.86), so every spoken shot gets a shade; no dark-ink caption colour (one `captionStyle.color` per video).
- **Peak opacity is one value per video, the lowest that reads on the brightest ground.** Ladder at W5.3, judged at 360 px wide: 0.5, 0.4, 0.3. Judge frames (brightest first): B06-SH01 f1360 (LF04 paper), B05-SH03 f950 (paper), B03-SH02 f440 (dream cloud, lilac/pale), B07-SH03 f1700 (doctor paper), and the darkest B01-SH01 f60 as a sanity check. Expected result 0.4 (EG-EP02's cream ground failed at 0.3); record the kept value and its judge frame in `delivery.md`.
- Shots that carry a caption: B01-SH01, SH02, B02-SH01, SH02, B03-SH01, SH02, B04-SH01, SH02, all B05, B06, B07, B08. Overlap with faces: faces sit above y 840 (brief frame zones); check lead and shade centre on SH02 (close face) at W5.3.

## Shot map

| Shot | Beat | Frames (start–end, length) | Line / phrase anchor | Claims | Heading in sheet |
| --- | --- | --- | --- | --- | --- |
| S01-B01-SH01 | B01 | 0–124 (124) | L01 0.35–4.00 s (f10–120) | F001, F005 | below |
| S01-B01-SH02 | B01 | 124–161 (37) | L02 4.28–5.20 (f128–156) | — | |
| S01-B02-SH01 | B02 | 161–274 (113) | L03 5.49–8.98 (f165–269) | F002 | |
| S01-B02-SH02 | B02 | 274–331 (57) | L04 9.28–10.87 (f278–326) | F014, CL01 | |
| S01-B03-SH01 | B03 | 331–411 (80) | L05 phrase 1 11.16–13.53 (f335–406) | CL02 | |
| S01-B03-SH02 | B03 | 411–490 (79) | L05 phrase 2 13.82–16.32 (f415–490) | CL02 | |
| S01-B03-SH03 | B03 | 490–535 (45) | no VO | dramatised | |
| S01-B03-SH04 | B03 | 535–550 (15) | silence | dramatised | |
| S01-B03-SH05 | B03 | 550–579 (29) | L06 gasp f552 | dramatised | |
| S01-B04-SH01 | B04 | 579–613 (34) | L07 phrase 1 19.31–20.35 (f579–610) | F001 | |
| S01-B04-SH02 | B04 | 613–719 (106) | L07 phrase 2 20.43–23.82 (f617–715) | F001 | |
| S01-B05-SH01 | B05 | 719–842 (123) | L08 24.10–27.67 (f723–830) | F007 | |
| S01-B05-SH02 | B05 | 842–882 (40) | L09 28.21–29.25 (f846–878) | F007–F009 | |
| S01-B05-SH03 | B05 | 882–1008 (126) | L10 29.54–33.44 (f886–1003) | F008 | |
| S01-B05-SH04 | B05 | 1008–1153 (145) | L11 phrase 1 33.72–38.29 (f1012–1149) | F009 | |
| S01-B05-SH05 | B05 | 1153–1198 (45) | L11 phrase 2 38.57–39.50 (f1157–1185) | F009 | |
| S01-B05-SH06 | B05 | 1198–1269 (71) | L12 40.05–42.14 (f1202–1264) | F007 | |
| S01-B06-SH01 | B06 | 1269–1415 (146) | L13 phrase 1 42.42–47.02 (f1273–1411) | F011 | |
| S01-B06-SH02 | B06 | 1415–1483 (68) | L13 phrase 2 47.23–49.27 (f1419–1478) | F011 | |
| S01-B07-SH01 | B07 | 1483–1582 (99) | L14 49.56–52.40 (f1487–1572) | F003, F012 | |
| S01-B07-SH02 | B07 | 1582–1637 (55) | L15 phrase 1 52.66–54.50 (f1586–1635) | F013 | |
| S01-B07-SH03 | B07 | 1637–1746 (109) | L15 phrase 2 54.70–58.04 (f1641–1741) | F013 | |
| S01-B08-SH01 | B08 | 1746–1860 (114) | L16 58.34–61.32 (f1750–1840) | CL03 | |

---

## Shot sheets

Each block: **Time** (comp frames, shot-local key frames), **Motion** (actor, camera), **Sound** (shot-local frame cues), **Caption**, **Accept** (observable). Picture content is the row's `seen` text in [review-rows.json](review-rows.json) and look frame; casting and kit gaps are in the Boss list at the end.

### S01-B01-SH01 · 0–124 · LF01 bedroom (seam frame)

- **Time:** hold f0–124. L01 f10–120. Shoulder twitch (a few px, 6 f) at L 112–118.
- **Motion:** she lies, P36, eyes `sleepy`, lids close from half to shut over L 20–100; breath clock tied to ambient time, phase 0 at L0 (VD02). Wall softness `w0.25` at L0 (seam state, VD02) rising to `w0.30` by L124. Camera push 1.000→1.020, fy 820, linear; frame 0 is exactly the B08 final state.
- **Sound:** pad at B01 level from L0; `tension_clock-pulse_01` loop from L0, −24 dB re narrator; room tone (optional). No cue on the twitch.
- **Caption:** L01 two lines "กำลังจะหลับ… แล้วจู่ ๆ ก็รู้สึกเหมือนตกจากที่สูง" / "และตัวกระตุก" per script Sub; shade on at L 10.
- **Accept:** f0 and the last frame of B08 match before the 15 f loop blend; lids closed by L100.

### S01-B01-SH02 · 124–161 · LF01 face close-up

- **Time:** L0–36. Cut from the wide on L0; eyes open from L 6 to L 22 (slow), a small rueful smile L 22–30; L02 f128–156 = L 4–32.
- **Motion:** crop of the same plate, zoom 1.8 on the face (est), anchor on the head (pillow region around (320, 985) rotated by the lying head; Boss reads the head centre), push 1.8→1.84. Eyes toward camera; no amber light on the face.
- **Sound:** continue pad and clock; `foley_hoodie-hood-pull_01` very quiet at L 3 (pillow turn, optional).
- **Caption:** "คุณก็เคย… ใช่ไหม"; shade L 4–34.
- **Accept:** eyes fully open by L 24 and looking at the lens; no lid flicker.

### S01-B02-SH01 · 161–274 · LF01 half-close

- **Time:** L0–112. L03 f165–269 = L 4–108. Eyelids settle L 20–80; breath slows (period 2.4 s→3.2 s); room softness `w0.30→0.40` over L0–112.
- **Motion:** side-on medium, face into pillow, push 1.000→1.015, fy 820.
- **Sound:** clock −3 dB; pad +1 dB; fabric rustle (`foley_hoodie-hood-pull_01` −24 dB) at L 40.
- **Caption:** "ตอนที่เราเริ่มเคลิ้ม…" / "จากตื่น ไปสู่หลับตื้น ๆ"; shade L 4–110.
- **Accept:** the whole picture softens (mist ENV-FOG), no limb-wise change.

### S01-B02-SH02 · 274–331 · LF01 dimming wide

- **Time:** L0–56. L04 f278–326 = L 4–52. Whole-picture dim: value and saturation ×1.0→0.78 over L 4–56 (est; B05-SH04 reuses the same curve); clock glow ×1.0→0.5.
- **Motion:** wide side view, she sinks 8 px into the mattress over L 10–50. Push 1.000→1.012.
- **Sound:** clock −6 dB by L 50; pad +2 dB; no other cue.
- **Caption:** "กล้ามเนื้อ จะเริ่มคลายลง"; shade L 4–54.
- **Accept:** dimming reads as one change of mood, not a switch-off per limb (fact-check note on F014).

### S01-B03-SH01 · 331–411 · room to cloud bleed

- **Time:** L0–79. L05 phrase 1 f335–406 = L 4–75. Bleed: wall wet-in-wet into cloud L 8–70 (est 62 f; `dissolveSec` inside the scene), bed contour fades L 20–70, a faint cliff edge shows in the cloud from L 52. Eyes shut throughout.
- **Motion:** camera push 1.000→1.015, fy 820 (same as B02). Clock glow ×0.5→0.
- **Sound:** clock fades out L 0–40; pad −8 dB by L 79; wind starts at L 0 from −40 dB (distant) rising to −30 dB by L 79 (`outdoor_wind-open-roundabout_01` loop, labelled fiction); no tag yet.
- **Caption:** "บางที ก็มีภาพแวบเข้ามา…"; shade L 4–76.
- **Accept:** no pop at the wall-to-cloud blend; bed ink line fades, never cuts (brief spike 2).

### S01-B03-SH02 · 411–490 · cliff edge, back view

- **Time:** L0–78. Phrase 2 f415–490 = L 4–79; "ที่ไม่มีอยู่จริง" f466–490 = L 55–79. Tag "ภาพจำลอง" on from L0 (`scene.eyebrow`, `fade: false`).
- **Motion:** LF02 plate, back view, figure small on the ledge centred x 540; bowed head carried as a ≤ 6° roll with crown low, plus a 10 f slow nod at L 8–18 (look-check note). Lean (`lean`) 0.00 at L 0–54, 0.00→0.35 over L 55–66, then she slips down out of frame bottom over L 62–78 (she is gone at L 78; empty ledge at the last frame). Camera push 1.000→1.015, fy 800.
- **Sound:** wind −30→−20 dB over the shot; pad −8→−24 dB; at L 56 a soft low rise (the same wind, +4 dB).
- **Caption:** "เหมือนก้าวพลาด ตรงขอบหน้าผา" (L 4–50) then "ที่ไม่มีอยู่จริง" (L 55–79); shade follows.
- **Accept:** tag legible and inside y ≥ 140; she leaves frame by the last frame, not before L 62; figure ≥ 200 px tall at the 270 px QA only if the Boss plate allows (wide by design, user-accepted).

### S01-B03-SH03 · 490–535 · the fall

- **Time:** L0–44, no VO, no caption. Tag stays.
- **Motion:** front view `P39 fall_stumble` figure centred (540, 900), height ≈ 520 px (est), tumbling ±12°, camera drops with her; upward paint streaks (`new: upward paint-streak FX`) speed 1100 px/s at L0 → 4200 px/s at L 44 (est), colours lilac/rose/pale. Camera dolly down 0→260 px over L0–44 (ease-in).
- **Sound:** L0 `whoosh_air-swish-rising_01` (peak at L 3); wind −20→−6 dB over L0–44 (peak at L 44); pad −24 dB.
- **Accept:** streaks read as falling, not flying (brief spike 3); figure reads at ≥ 200 px tall at 270 px QA.

### S01-B03-SH04 · 535–550 · frozen silence

- **Time:** L0–14. Last frame of SH03 held; streaks stop (no jitter), her hair and sleeves static, tag stays.
- **Motion:** story clock (not the breath clock, DF-20261030-painted-story-hold-ambient-clock); camera 0.
- **Sound:** **hard silence L0–14: pad, wind, clock all to zero on L0 with no ramp, no room tone, no music**; narrator already silent.
- **Accept:** the cut to silence is on frame 535 and the next sound is at 550, exactly 15 f of digital zero.

### S01-B03-SH05 · 550–579 · the jolt (hard cut)

- **Time:** L0–28. L0 hard cut to the bedroom, room lights up for 3 f (L0–2, +value, glow ≤ 0.3), eyes `asleep→shock` at L0 and held wide to L28. Head and shoulders lift ≈ 56 px (est; a hand's breadth at U 640) L0–5, drop L5–12 with a 6 px overshoot, blanket jumps L0–10 and settles L12; no sit-up; tag off. Wall softness `w0` (awake).
- **Motion:** same camera as B01-SH01 start (scale 1.000, fy 820), static.
- **Sound:** L0 thump `pulse_underwater-soft-thump_01` (−12 dB re narrator); L2 gasp `vocal_gasp-young-woman_01` (about 12 f); L6 blanket fabric `foley_hoodie-hood-pull_01` −20 dB; L15 clock tick returns at −34 dB and rises to −24 dB by L28; pad off.
- **Caption:** none.
- **Accept:** lift of head and shoulders only, hard cut on one frame; eyes clearly wide at 270 px; gasp starts within 3 f of the lift.

### S01-B04-SH01 · 579–613 · sits up

- **Time:** L0–33. L07 phrase 1 f579–610 = L0–31. She rises from lying to sit at the bed edge L0–22 (`new: sit on bed edge`), hand on chest from L 14; breath slows. Room softness back `w0.2`, light eases up.
- **Motion:** side-on medium, push 1.000→1.010, fy 820.
- **Sound:** pad returns L0 from −∞ to +1 dB over 24 f; clock −24 dB; `foley_hoodie-hood-pull_01` L 4 (sit-up, −18 dB).
- **Caption:** "อาการนี้มีชื่อนะ…"; shade L0–34.
- **Accept:** she is seated by L 22; no frame shows the jolt pose.

### S01-B04-SH02 · 613–719 · name card

- **Time:** L0–105. L07 phrase 2 f617–715 = L 4–102. Card "hypnic jerk" (Latin) with "อาการกระตุกตอนเคลิ้มหลับ" below fades in at L 24 (comp f637, on "ฮิปนิก"; word time est from the line's pace, Editor confirms), holds to L 105. Card in y 200–420, above the caption band.
- **Motion:** medium, she sits still, breathing; push 1.000→1.012, fy 820.
- **Sound:** `reveal_glass-shimmer-soft_01` at L 24 at −26 dB, under the narration; pad +1 dB.
- **Caption:** "เรียกว่า ฮิปนิก เจิร์ก" / "หรือ อาการกระตุกตอนเคลิ้มหลับ" (script sub text; card shows the Latin form, captions the Thai read).
- **Accept:** Latin title legible at 360 px; card clear of the channel mark and the caption band. Capability `unknown` (N11); fallback in the brief.

### S01-B05-SH01 · 719–842 · idea space, "?"

- **Time:** L0–122. L08 f723–830 = L 4–111; "?" pause after "ล่ะ?" at f752–758 (L 33–39). Big painted "?" grows behind her L 6–40 and holds still to the end of the shot; she tilts her head to think L 10–30. Hard cut in from the bedroom (colour change is the signal; LF03).
- **Motion:** medium on warm paper, push 1.000→1.015, fy 900. After L 111 the "?" sits still for 11 f (reveal pause 0.55 s is the line gap to L09).
- **Sound:** pad shifts to the curious state at L0 (`−1 dB`), clock off; pluck note 1 at L 38 (after "ล่ะ?"); silence of the plucks from L 100 so the line lands.
- **Caption:** "แล้วมันเกิดจากอะไรล่ะ?…" / "ความจริงคือ ยังไม่มีใครรู้แน่ชัด"; shade L 4–112.
- **Accept:** reads as a thinking space, not the bedroom; "?" is the only glyph; reveal beat is held.

### S01-B05-SH02 · 842–882 · two bubbles

- **Time:** L0–39. L09 f846–878 = L 4–36. Left bubble pops at L 8 and right bubble at L 20, each with an empty "?" inside.
- **Motion:** wide, push 1.000→1.010, fy 900.
- **Sound:** `ui_pop_01` at L 8 and L 20 (−20 dB), pluck notes 2 and 3 on the same frames.
- **Caption:** "มีหลายสมมติฐาน"; shade L 4–37.
- **Accept:** both bubbles empty at the cut out; no arrows.

### S01-B05-SH03 · 882–1008 · hypothesis A, brain switch

- **Time:** L0–125. L10 f886–1003 = L 4–121. Left bubble fills the frame; brain-cloud settles L 0–20; sun slides to moon over L 40–95 on the switch, catches at L 95 ("สลับ จากตื่นไปหลับ" ends f~990, est) and stalls a few px L 95–110; "?" beside the bubble.
- **Motion:** close, push 1.000→1.015, fy 600 (bubble centred; est).
- **Sound:** catch click `impact_hit-punch_01` (lowpassed, −18 dB) at L 95; pluck 4 at L 14; pad open.
- **Caption:** "บ้างว่า… เป็นแค่สมองทำงานสะดุด" / "ตอนกำลังสลับจากตื่นไปหลับ"; shade L 4–122.
- **Accept:** idea is inside a bubble and shows a "?" at all times; the stall is visible at 270 px.

### S01-B05-SH04 · 1008–1153 · hypothesis B, misread

- **Time:** L0–144. L11 phrase 1 f1012–1149 = L 4–141. Right bubble fills; brain-cloud looks down at the tiny relaxed figure; the figure sinks 8 px with the same dimming curve as B02-SH02 (`×1.0→0.78`) over L 40–110; "?" wobbles at L 120.
- **Motion:** semi-close, push 1.000→1.012, fy 600.
- **Sound:** continues; pluck 5 at L 10; fabric whisper (−28 dB) at L 50; no thump yet.
- **Caption:** "บ้างว่า… สมองอาจเข้าใจผิด" (L 4–42) / "ว่ากล้ามเนื้อที่คลายลงนั้น คือตัวกำลังตก" (L 48–141); shade follows.
- **Accept:** the dimming matches B02-SH02 so the viewer recognises it (CL01); the thought is a bubble, not an event.

### S01-B05-SH05 · 1153–1198 · "twitch ordered"

- **Time:** L0–44. L11 phrase 2 f1157–1185 = L 4–32. Brain sends a short line down at L 6; the tiny figure twitches once L 8–16; "?" stays; no arrow toward a cause.
- **Motion:** same framing as SH04, no push (scale holds 1.012), fy 600.
- **Sound:** very soft thump `pulse_underwater-soft-thump_01` −26 dB at L 8; pluck 6 at L 20.
- **Caption:** "เลยสั่งกระตุกไว้ก่อน"; shade L 4–33.
- **Accept:** one twitch only; the "?" is on screen every frame.

### S01-B05-SH06 · 1198–1269 · both wash out

- **Time:** L0–70. L12 f1202–1264 = L 4–66. Colour runs and washes out of both bubbles L 0–60 (wet-in-wet, inside the scene), leaving "?" and the tiny figure on the paper; pause (L 66–70) and a breath of silence before L13.
- **Motion:** wide, push 1.000→1.012, fy 900.
- **Sound:** music breathes out: pad −4 dB by L 40; no plucks; fabric/water-like soft wash (optional, not required).
- **Caption:** "แต่ทั้งหมดนี้… ยังไม่มีใครพิสูจน์ได้"; shade L 4–67.
- **Accept:** by the last frame both bubbles are empty washes; no new idea appears.

### S01-B06-SH01 · 1269–1415 · three icons

- **Time:** L0–145. L13 phrase 1 f1273–1411 = L 4–142. Icons pop on the word onsets (Editor confirms with Whisper): cup (coffee) at L 64 (f1333, "คาเฟอีน"), scribble ball at L 90 (f1359, "ความเครียด"), moon and clock at L 121 (f1390, "การอดนอน"). Row of three at y 360–720 (LF04 v3).
- **Motion:** still on paper, push 1.000→1.020, fy 600.
- **Sound:** `ui_pop_01` at each icon frame (−18 dB), pluck notes optional on the same frames; pad −1 dB.
- **Caption:** "มีรายงานว่า มันเชื่อมโยงกับ" / "คาเฟอีน ความเครียด การอดนอน"; shade L 4–142.
- **Accept:** icons arrive one at a time on the words; no arrows; caption does not cover icons (they sit above y 840).

### S01-B06-SH02 · 1415–1483 · dumbbell

- **Time:** L0–67. L13 phrase 2 f1419–1478 = L 4–63. Dumbbell pops at L 4 (f1419, "และ" onset, Whisper/envelope 1419–1420), bottom-left under the caption band as in LF04 v3; the other three fade to 60 % over L 4–20.
- **Motion:** same framing, push 1.020→1.030 continuing, fy 600 (shot continues the SH01 push; total ≤ 3 %).
- **Sound:** `ui_pop_01` at L 4; pad `−1 dB`.
- **Caption:** "และการออกกำลังหนัก ๆ ใกล้เวลานอน"; shade L 4–64.
- **Accept:** four icons, no arrows, dumbbell's floor shadow intact.

### S01-B07-SH01 · 1483–1582 · common and harmless

- **Time:** L0–98. L14 f1487–1572 = L 4–89. Hard cut back to the bedroom (LF01 look, warmer); she sits, a soft smile from L 20, shoulders relax, hugs the pillow L 30–60.
- **Motion:** medium side-on, push 1.000→1.010, fy 820. Light warms +6 % over the shot.
- **Sound:** pad +1 dB, fuller; clock −24 dB returns at L0; fabric (−26 dB) at L 32.
- **Caption:** "อาการนี้พบได้บ่อย" / "และส่วนใหญ่ ไม่อันตราย"; shade L 4–90.
- **Accept:** posture and expression read as relief; no alarm cue.

### S01-B07-SH02 · 1582–1637 · lying awake

- **Time:** L0–54. L15 phrase 1 f1586–1635 = L 4–53. She lies eyes open on the ceiling, tired not scared; clock glow shows a late hour (no digits).
- **Motion:** semi-wide side-on, push 1.000→1.010, fy 820.
- **Sound:** clock −22 dB (a touch louder); pad holds, no new cue.
- **Caption:** "แต่ถ้าสะดุ้งถี่ จนนอนไม่หลับ…"; shade L 4–54.
- **Accept:** eyes open at all frames; mood calm, not frightening.

### S01-B07-SH03 · 1637–1746 · doctor

- **Time:** L0–108. L15 phrase 2 f1641–1741 = L 4–104. Cut to LF05 doctor (soft smile, nods at L 40 and L 80 once each).
- **Motion:** medium front, push 1.000→1.015, fy 700.
- **Sound:** pad warm; no other cue; keep L15 clear (no plucks).
- **Caption:** "หรือมีอาการกระตุกแบบอื่นด้วย" / "ควรปรึกษาแพทย์นะ"; shade L 4–105.
- **Accept:** doctor reads friendly and non-emergency; faces above y 840, lead height measured at W5.3.

### S01-B08-SH01 · 1746–1860 · lies back, loop

- **Time:** L0–113. L16 f1750–1840 = L 4–94; silence of voice L 94–113 (19 f). She lies back (reverse of sit-down, `new: lie-back motion`) L 10–70, lids close L 50–90, then holds still L 90–113; wall softness `w0→w0.25` over L 20–100 reaching the seam state exactly at L 113 (comp f1859); the last 15 f are frozen to the VD02 f0 state (breath phase 0).
- **Motion:** same camera as B01-SH01 at its last frame in reverse: start scale 1.020 and end at 1.000 (so the next loop begins at 1.000), fy 820; the camera ends 1.000 exactly at L 113.
- **Sound:** pad returns to the B01 level and tone at L 113; clock −24 dB returns to the level at B01-SH01 L0; no ending sound, no fade-out.
- **Caption:** "คืนนี้ ลองสังเกตดูนะ" / "ว่าตอนที่คุณ…" with the trailing "…" kept to the end; shade L 4–95.
- **Accept:** last frame equals B01-SH01 f0 (VD02, brief spike 1), no sound edge at the loop; at most 15 f of loop blend.

---

## Boss handoff (W5.2) and plates

Shot groups for painting (one shot = one timeline scene; groups G1–G5 are by plate).

| Group | Shots | Plate / asset |
| --- | --- | --- |
| G1 bedroom (LF01 v2) | B01-SH01, SH02; B02-SH01, SH02; B03-SH05; B04-SH01, SH02; B07-SH01, SH02; B08-SH01 | bedroom plate with animatable `wallSoft` (w0 to 0.40 and the cloud bleed), clock glow ×0–1, awake/lit variants; close-up crop for SH02 |
| G2 dream (LF02 v5) | B03-SH01 (bleed), SH02, SH03, SH04 | cloud-dream plate + half-painted ledge, empty-ledge variant, streak FX |
| G3 idea space (LF03 v2) | B05-SH01 to SH06 | paper ground, bubbles, brain-cloud, sun/moon switch, mini-figure, wash-out |
| G4 icons (LF04 v3) | B06-SH01, SH02 | four icons with pop timing, fade-to-60 % state |
| G5 doctor (LF05 v2) | B07-SH03 | doctor vignette |

**Kit gaps already known (from the look frames):**
1. `bowed` back-view head state in `src/painted/kit/back.ts` (built from the v3 construction sheet; LF02 v5 painter `paintBowedHeadBack` in `set.ts` is the source), with a roll/nod keyframe API and the 10 f nod at B03-SH02 L 8–18.
2. Back-view heel (bare narrow heel under the trouser hem) as a kit state, replacing the per-shot oval paint-out.
3. Female torso cues (UT08) in the kit, replacing per-shot painting; shoulder cap flatness/projecting corner (viewer note, UT11 minor).
4. Lying-head hardening (`paintLyingHead`): animatable jolt (lift ≈ 56 px, drop, overshoot), eyes-open and wide-eyes (`shock`) states, lids `sleepy` to open to shut over frames; used by B01-SH02, B02, B03-SH05, B07-SH02.

**New from the timed sheet:**
5. Shot-local animated parameters for G1: `wallSoft` curve w0.25→0.30→0.40, bleed into cloud (B03-SH01 L 8–70), clock glow fade, dimming curve ×1.0→0.78 shared by B02-SH02 and B05-SH04.
6. Back-view figure `lean` 0→0.35 and slip out of frame bottom (B03-SH02 L 55–78) and an empty-ledge last frame; no walk.
7. Front `P39 fall_stumble` in the pyjama, ±12° tumble, 520 px, camera dolly 260 px, streak FX speed ramp (B03-SH03).
8. Freeze for B03-SH04 (story clock, not the breath clock) and the 3 f room flash at B03-SH05.
9. `new: sit on bed edge` (B04, B07-SH01, hands in lap P31), `new: lie-back motion` (B08), `new: jolt motion`, breath phase 0 contract at f0 and B08's last frame.
10. B05 timing hooks: bubble pops L 8 / L 20 (SH02), sun-moon slide with a stall (SH03 L 40–110), brain looks down (SH04), twitch line (SH05), wash-out L 0–60 (SH06).
11. B06 icon pops at L 64 / 90 / 121 (SH01) and L 4 (SH02) with the fade-to-60 % of the other three.
12. Kit intake (KIT-P01) items: pyjama, stethoscope, soft closed smile, bedroom set as a `PLATES` entry (already in `src/painted/edu01/set.ts`).

**Plates not needed:** no new camera moves beyond ≤ 3 %; no Blender; no footage.

**Editor handoff (before or with W5.2):** (a) generate the gasp (see above) and the three NEEDS-GEN sounds; (b) timeline with the frame table above, scene IDs = shot IDs; (c) confirm L05 and L07 phrase onsets and the icon word onsets with Whisper word times; (d) caption-shade ladder at W5.3; (e) no voice regeneration needed (jolt gap kept).

## Change log

- **EDU-SHEETS-R1 (2026-11-04, Film W5.1):** first timed sheet from the Kore v1 measure (61.97 s). Jolt gap kept at 2.99 s; L06 = separate character voice; thump taken from `pulse_underwater-soft-thump_01` (the brief listed it NEEDS-GEN); `review-rows.json` start/end set to the timed frames.
- **EDU-SHEETS-R1.1 (2026-11-04, Film W5.1):** applies the Editor Whisper + envelope onset check (build-notes W5.1 Editor jobs). L07 p2 onset f613 -> f617, L13 p2 (dumbbell) f1417 -> f1419, L15 p1 f1580 -> f1586, icon 'moon and clock' f1387 -> f1390. Boundaries: B04-SH01/SH02 609 -> 613; B06-SH01/SH02 1413 -> 1415; B07-SH01/SH02 1576 -> 1582. Local L times, shade ranges, name-card and shimmer cue (L 28 -> L 24, same comp f637) and pop frames updated. 23 shots, still 1860 f; shortest shot B01-SH02 37 f, no shot under 24 f.
