# Storyboard EDU-EP08-ROWS-R1.3 — EDU-EP08-SHORT (untimed rows + look frames)

- Revision **EDU-EP08-ROWS-R1.3** (Film, Boss pass A/B open items, 2026-11-08: SH04 ring plate, B03-SH05 gauge target, B05-SH01 tow view, B05-SH02 Earth camera; brief **EDU-EP08-BRIEF-R1.3**; R1.2 Film W3 arm check: look frames v2, arm proportions fixed, rows text unchanged; R1.1 Film W3.1: BC1/BC2 applied, look frames v1 added; R1 Film W2.2, all 21 shots passed by the user on the review page 2026-11-08). Inputs: script **EDU-EP08-SCRIPT-R1.1** ([script.md](script.md), user-approved 2026-11-08, ending `A_fade`), brief **EDU-EP08-BRIEF-R1** ([film-brief.md](film-brief.md): SET-ORBIT, SET-AIRLOCK, SET-CHAMBER66, RING-CLOSE, EARTH backdrop, VD01–VD25, shot plan, B1–B6, N1–N10), fact-check [fact-check.md](fact-check.md) (W1.3 + R1.1 recheck pass), measured read [voice-measure.md](voice-measure.md) (Kore A, no atempo).
- Status: `ready-for-dev` for the first storyboard review (camera and VO only). The review rows are **untimed** (`"untimed": true`, no times on the page). The est lengths below come from the measured line lengths (splits inside a line syllable-proportional, `est`); total ≈ **57.6 s, 21 shots**. W3 adds look frames to the same rows; W5.1 writes timed scene sheets with integer frames from the W4 voice lock. Not user-approved; no render, no runtime or visual validation.
- **R2.4 / ROWS-R2.5 (2026-11-08, script R1.3):** L11 is now "ปล่อยลมหายใจออกมา…" (36 f voiced). [scene-sheets.md](scene-sheets.md) SHEETS-R2.4: S01-B04-SH03 grows 58 → 72 f (the stream runs under the whole line, same thinning tail, slower pull-back; no new look); S01-B05-SH01–SH05 start 14 f later, unchanged in shot-local frames; total 1745 f = 58.2 s. Only S01-B04-SH03 is flagged changed on the review page.
- **R2.3 / ROWS-R2.4 (2026-11-08, script R1.2):** the B05 ending follows [scene-sheets.md](scene-sheets.md) SHEETS-R2.3: S01-B05-SH03 is now silent beat + L13a "คุณจะอยากกลั้นหายใจไว้… แต่ในที่ที่ไม่มีอากาศ" (the urge to hold: chest lift with pressed lips, CREW's glove tightens, shoulders drop on "แต่"; SD16), S01-B05-SH04 is L13b "สิ่งที่ช่วยปอดคุณ คือหายใจออก" (exhale-keyed face, no smile; SD17); the SH03/SH04 rows in the shot list below are R1.3 history. Total 1731 f.
- **Timed (W5.1):** integer frames, built camera values and deviations SD01–SD11 live in [scene-sheets.md](scene-sheets.md) (EDU-EP08-SHEETS-R1, 2026-11-08); where a value here differs, the sheet wins. Rows → ROWS-R2.0 (times only).
- Review rows: [review-rows.json](review-rows.json) (Thai, one row per shot, `lines` cites the script line IDs; R1.1 adds `looks`, a `look` per beat and three look questions). Review page: https://claude.ai/artifact/22bSN7dVFv377xF2aaRXPX — look frames: pending republish (coordinator).
- Units and owners: SET-ORBIT metres (origin on the handrail under AST's tether clip, +x along the truss away from the airlock, +y local zenith, +z out from the truss toward the camera side; Earth at −y, infinity); SET-AIRLOCK metres (origin on the cylinder axis at its middle, outer hatch at z +1.20); SET-CHAMBER66 metres (origin floor centre, +z toward the camera side); RING-CLOSE 1 set-m ≈ 1 cm. Camera line: `cam: target, yaw a→b (azimuth, 0 = camera on +z of the target, positive toward +x), r, eye (camera height), pitch (positive up), f (px), hy (px)` = one kit `camMove`; or an explicit position. One yaw camera per shot owns projection; characters are floating flat cards squared to the mid-shot camera (`paintFigureAt`, `shadow: false`); the Earth is direction-only; cards, ring, stamp and captions are screen layers. Positions `est` until the look frames and Boss's measurements.
- Casting: AST = **`woman-bob + new: eva-suit, new: zero-g-neutral`** (helmet `new: eva-helmet` on in SH01 only; Q-F1 open); CREW = **`man-crop + new: eva-suit (visor down, red leg stripes)`**; TECH = **`man-parted + new: eva-suit (1960s silver tint, round helmet), P01`**, back view only. Kit layers: ENV-SKY `paintSkyBands` (space), ENV-GLOW `paintHalo` (sun glint, hatch light, amber lamp), `fall.ts` dust marks as the glitter base; `new: earth-backdrop`, `new: vac-glitter`, `new: timer-ring`, `new: stamp`, cards N8, `new: ice-shell-gag`.

## Shot list

Est s from the measured read. Ring = timer story seconds at shot start → end (full ring 15, band 10–15, no digits). Check = the observable test at Draft (brief spikes 1–8 where cited).

| Shot | Lines | Est s | Ring | Picture | Camera (brief, est) | Casting | Sound cue | Check | Look |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S01-B01-SH01 | L01 | 1.75 | — | Frame 0: glove on the helmet clasp over the Earth; clasp slips; helmet lifts 5 cm; CREW small at the open hatch (CL02) | T-HOOK yaw 55→47, r 3.4→3.1, eye 1.90, pitch −16° | AST `woman-bob + new: eva-suit, new: zero-g-neutral, neutral→surprised`, helmet on; CREW `man-crop + new: eva-suit, right` | NG-S1 breath + NG-S2 hiss + `space_thin-airy-pad_01`; `foley_flashlight-click_01` muffled on the slip | Spike 1; Earth ≥ 40 %; AST ≥ 480 px | LF01 |
| S01-B01-SH02 | V01 + silence | 1.00 | fade in at 0 | Low tilt-up: the helmet clears her head and drifts toward the lens; gasp, lips press shut (CL01); silence | T-HELM yaw 25→30, r 1.9→1.8, eye 0.90, pitch +12°→+16° | AST `shock` → `scared` (mouth closed) | V01 "เฮ้ย—" cut dead on the rim-clear frame; everything out; `tension_heartbeat-slow_01` + `ui_click-tick_01` from the ring fade | Spike 2: silence on one named frame; no puffed cheeks | (LF01) |
| S01-B01-SH03 | L02 | 5.30 | 0.0→1.0 | Film-strip card: balloon pops, red cross (first ~2.1 s); she floats whole, wide-eyed; helmet exits frame top | T-AST yaw 20→12, r 2.30→2.05, eye 1.75, pitch −14° | AST `surprised` (mouth closed), `zero-g-neutral`; `new: film-strip-card` | `ui_pop_01` + `comedy_record-scratch_01` on the pop; heartbeat + tick | Balloon only; eyes at medium (head ≈ 200 px) | (LF01) |
| S01-B01-SH04 | L03a | 1.10 | 1.0→1.2 | Insert: a real neck ring's latch locks, two-stage | RING-CLOSE yaw 15→9, r 22→19 set-cm, hy 900 (R1.3) | RING-CLOSE (generic, no logos) | NG-S3 latch click (insert sound) | No text or colour labels on the collar | (LF01) |
| S01-B01-SH05 | L03b | 1.10 | 1.2→1.4 | Her helmet tumbling away against the Earth; "สมมติ" stamp lands | T-HELM follow yaw 10→16, r 1.6→1.5, eye 2.4, pitch −22° | `new: eva-helmet` detached; `new: stamp` | Heartbeat + tick; soft stamp thud optional (Editor) | Stamp lands on "สมมติ", outside the caption band and the ring | (LF01) |
| S01-B02-SH01 | L04 | 3.10 | 1.4→2.0 | Pat-check: chest twice, each arm once; small relieved breath, no puff | T-AST yaw −15→−6, r 2.1→1.9, eye 1.65, pitch −12° | AST `new: pat-check`, `worried`→`neutral` | NG-M1 enters low; heartbeat + tick | No swelling shape at any size; elbows tucked | (LF01) |
| S01-B02-SH02 | L05a | 1.40 | 2.0→2.3 | Ice-shell gag: frost creeps over the suit, cracks, flakes float away | T-AST yaw 35→42, r 2.6→2.4, eye 1.70, pitch −14° | AST `zero-g-neutral`, `suspicious`→`smug`; `new: ice-shell-gag` | NG-S4 crackle (fallback `water_ice-settle-tick_01` ×3); `stinger_pizz-shrug_01` on the crumble | Frost on the suit only, stops at the neck ring | (LF01) |
| S01-B02-SH03 | L05b | 3.00 | 2.3→2.9 | Flask card: warm inside, heat wiggles bounce off the empty gap, outside cool; AST lower left | T-AST yaw 10→16, r 2.8→2.6, eye 1.70, pitch −14°, cx −160 | AST `zero-g-neutral`, `happy` (small); `new: flask-card` | NG-M1 continues | No body in the card; no text | (LF01) |
| S01-B03-SH01 | show + L06a | 3.25 | 2.9→3.7 | Medium close: frown, glove toward the lips (stops short), glitter at the lips, silent "หืม?"; glitter drifts | T-HEAD yaw 34→27, r 1.55→1.40, eye 1.45, pitch −5° | AST front ¾, `worried`, P12 (hand 0.12 m short of the mouth), `talk` ≤ 0.25 once; `new: vac-glitter` | Music out; heartbeat + tick; `reveal_glass-shimmer-soft_01` very soft on the first sparkle | Spike 3: head ≤ 340 px; glitter outside the mouth only | LF02 |
| S01-B03-SH02 | L06b | 2.80 | 3.7→4.3 | Water-drop card: arrow presses, fades; bubbles rise; warm glow | full-frame card, push 8 % | `new: drop-diagram` | Heartbeat + tick; tiny bubble pops (`ui_pop_01` pitched, low) | No body part; no labels | (LF02) |
| S01-B03-SH03 | L07 | 5.90 | 4.3 paused | Sepia in; 1960s chamber; TECH from behind; push to the hose; it pops; needle drops | CHAMBER T-TECH yaw 10→4, r 2.6→2.0, eye 1.30 | TECH `man-parted + new: eva-suit (1960s), P01, back` | Tick pauses; NG-S6 chamber hum; NG-S5 hose pop + hiss | Spike 5: no face, text, logo | LF03 |
| S01-B03-SH04 | L08 | 4.55 | paused | TECH steps back, leaves frame left upright; camera on to the porthole and gauge; lights dim | moving target (0.00, 1.10, −0.80)→(1.30, 1.40, −2.20), yaw 4→−8, r 2.0→2.2 | TECH `back`, `new: step-back` | `bed_sub-drone-fade-in_01` low under the hum | Leaves frame before the dim completes; no fall | (LF03) |
| S01-B03-SH05 | L09 | 2.65 | paused | Needle swings up; lights warm; sepia drains; cut | gauge yaw 0→6, r 0.62→0.52, eye 1.48 | — | `reveal_memory-swell-muffled_01` rising with the needle; hum fades | Needle reaches ~90 %; no time shown | (LF03) |
| S01-B04-SH01 | show + L10a | 2.40 | 4.3→5.4 | Shade side: hunched, lips sealed, glove to the chest (CL01 payoff), tiny tremble | T-AST yaw −20→−12, r 1.65→1.50, eye 1.50, pitch −8° | AST `P42`, `scared` (mouth closed) | Tick resumes; heartbeat faster and closer; `tone_thin-unresolved_01` enters | Cool Earthshine key, sun rim; no puffed cheeks | (LF04) |
| S01-B04-SH02 | L10b | 4.45 | 5.4→6.6 | Chest outline overlay: arrows push out, nothing outside, amber glow on "บาดเจ็บ" | T-AST yaw 4→−4, r 2.10→1.85, eye 1.60, pitch −10° | AST `P42`, `scared`; `new: chest-outline` | Riser (string harmonic) builds | No organs or injury marks | (LF04) |
| S01-B04-SH03 | exhale + L11 | 2.30 | 6.6→7.5 | Shoulders drop, lips part, a long glitter stream flows across the blue Earth; rising pull-back; thinning | T-EXHALE yaw −60→−50, r 2.10→2.15, eye 1.55→2.75, pitch −12°→−30° | AST `right` profile, `zero-g-neutral`, `neutral` (lips open 0.2); `new: vac-glitter` stream | Riser releases into NG-S7 shimmer; L11 on near-silence | Spike 4: stream over blue ≥ 1 s; AST ≥ 480 px (≥ 440 tolerance) | LF04 |
| S01-B05-SH01 | V02 | 1.30 | 7.5→8.1 | Red-striped glove grabs her wrist from frame left; tow along the gold handrail | T-TOW yaw 22→16, r 2.5→2.4, eye 1.65, pitch −12° | CREW `rail-tow`, `left` (faces screen left, −x; R1.3); AST towed | `electric_radio-static-burst_01` crackle 0.4 s + V02 (radio-filtered); NG-M2 pulse enters | Spike 7: grab locked ±6 px; grips planted ±4 px | (LF04) |
| S01-B05-SH02 | L12a | 1.95 | 8.1→9.0 stop, fade | Both from behind against the hatch; CREW swings it shut on the Earth; ring stops short of the band | AIRLOCK pos (+0.30, −0.25, −0.95)→(+0.24, −0.22, −0.85), target (−0.05, 0.05, +1.20), f 900 | AST `back`; CREW `back` | `pulse_underwater-soft-thump_01` low-passed on the shut frame (felt thud, VD20); tick stops | Spike 6: ring stops at 216°, band at 240° | (LF05) |
| S01-B05-SH03 | L12b | 3.05 | — | Two-shot: she holds CREW's glove; CREW leans in; the shut hatch behind | AIRLOCK target (+0.12, 0.25, +0.28), yaw 200→192, r 1.10→1.00, eye 0.35, f 900 | AST `front`, `neutral`; CREW `right` | `bed_edu1-warm-pad-loop62_01` (or NG-M2) low; no airborne sound yet | Faces above y 1160; no eye detail | (LF05) |
| S01-B05-SH04 | L13 | 3.05 | — | Medium on her (front ¾), eyes open, soft at "หายใจออก"; joined gloves low; CREW soft at frame left | AIRLOCK target (−0.15, 0.55, +0.20), yaw 190→184, r 1.00→0.92, eye 0.55, f 1000 | AST front ¾, `neutral`→`happy` (mouth closed) | Pad; `stinger_pizz-tag-ending_01` from the last word's end (UT15) | Head ≤ 340 px; normal expression | LF05 |
| S01-B05-SH05 | closing | 2.20 | — | Hands in front, gauge and amber lamp behind: lamp on, needle starts to climb, CREW's glove settles over her hand; fade | AIRLOCK target hands (+0.15, 0.25, +0.30), yaw −80→−72, r 0.62→0.56, eye 0.32, f 1000 | gloves only | Tag rings; NG-S8 hiss rises under it, never full; all fade with the picture | Spike 8: needle < 20 % at the last visible frame; black last frame | (LF05) |

## Rules carried from the brief and fact-check (every shot)

- **R01** Safety: no swelling, eye, skin or injury imagery; no puffed cheeks; AST's head ≤ 340 px; "wide-eyed" and "eyes open" are kit expressions at medium framing only.
- **R02** Glitter only at or outside the lips (emitter 3 cm in front); never drawn inside the mouth; mouth open ≤ 0.25.
- **R03** TECH: back view only, helmet on, no face, name, caption, date, logo, gauge label or signage; leaves frame upright; no fall or collapse.
- **R04** Timer ring: no digits; label "ประมาณ 10–15 วินาที" only; continuous story value across cuts; paused in the flashback; stops at 9/15 before the band.
- **R05** On-screen text: captions, `@TamMaiLa`, the ring label and the "สมมติ" stamp only; cards carry no words.
- **R06** No NASA logo or flag on any suit, station part or chamber.
- **R07** Frame zones: caption band y 1176–1344 (edu stroke, `bottomEdgeY` 1344, ≤ 2 lines); faces, lips, gloves at contact, the helmet and gauges above y 1160; ring zone top-right (centre (905, 300), r 92, label to y ≈ 430); card zone x 80–760, y 200–980; nothing important above y 140.
- **R08** Sound carries no fact; silence after the helmet clears; no airborne clunk in vacuum (felt thud only); no instant-recovery image or sound (hiss never full, needle < 20 %).
- **R09** Orbit ↔ insert / card / flashback is always a cut (or the in-canvas sepia grade), never a continuous zoom across scales.

## Per-shot staging

Each block: staging (`est`), camera, light, sound, check. Seconds are into the shot at the est length; W5.1 replaces them with integer frames from the voice lock. Library IDs from `~/ReelsStore/library/sound/INDEX.md` (checked 2026-11-08; generated entries "not listened"); NG-* = the brief's NEEDS-GEN list.

### S01-B01-SH01 — L01 (LF01)
- **Staging (SET-ORBIT):** AST hips (0.00, 0.80, 0.25), facing az +30°, `front`, helmet on (bubble centre (0.00, 1.40, 0.25)); right glove on the clasp at the neck ring's right side (≈ (−0.14, 1.20, 0.30)), left glove floating at chest height. Clasp slips at 0.65 s (lever flicks 30°), helmet lifts 0.05 m over 1.05–1.75 s. Face `neutral` → `surprised` at 0.9 s, seen through the bubble (sheen ≤ 0.15). Tether slack to the clip (+0.35, 0.00, −0.15). CREW hips (−3.90, 0.90, 0.00), `right`, right glove reaching to the handrail from 0.8 s (CL02, small, unlit relative to AST).
- **Camera:** `cam: T-HOOK (−0.30, 1.00, 0.20), yaw 55→47, r 3.4→3.1, eye 1.90, pitch −16°, f 1100, hy 620`, eased. Projection (est): AST helmet top y ≈ 383–391, feet y ≈ 902–955, 519–564 px tall, x ≈ 590; CREW 219–239 px at x ≈ 100–230; limb y ≈ 693 (Earth 64 % of the frame).
- **Light:** sun from upper screen-left (world (−0.60, 0.55, 0.58)), hard; Earthshine blue from below; helmet glint (the helmet's `glint` option, `kit/eva.ts`: soft warm wash + four-point star; R1.3) on the bubble's upper left.
- **Sound:** NG-S1 breath and NG-S2 hiss (fallback `electric_radio-static-burst_01` at very low level), `space_thin-airy-pad_01` low; `foley_flashlight-click_01` muffled at 0.65 s.
- **Check:** spike 1; glove-on-clasp contact ±6 px.

### S01-B01-SH02 — V01 + silence
- **Staging:** the helmet moves (0.00, 1.45, 0.25) → (0.10, 1.85, 0.45), spin 25°, passing in front of her face line upward toward the lens; the rim clears the top of her head at 0.35 s (**the silence frame**, est). Her chest lifts (shoulders +0.03 m) in a sharp gasp over 0.15–0.35 s (`shock`, mouth open 0.4), then the lips press shut by 0.45 s (`scared`, mouth closed; no cheek puff). Hair begins to lift (optional `hair-float`). Ring fades in over the last 8 f at 0.0.
- **Camera:** `cam: T-HELM (0.00, 1.50, 0.30), yaw 25→30, r 1.9→1.8, eye 0.90, pitch +12°→+16°, f 1050, hy 1000` (low, tilting up with the helmet; signature move 1). Head ≈ 217–227 px; helmet passes y ≈ 946 → 651; the Earth only at the frame bottom (limb y ≈ 1650, deliberate: the low angle puts her against black for one second, the frame is filled by her and the helmet).
- **Light:** sun glints along the helmet rim as it turns; her face in sun.
- **Sound:** V01 "เฮ้ย—" from 0.0, cut dead at the silence frame together with breath, hiss and pad; then `tension_heartbeat-slow_01` (felt, sub) and `ui_click-tick_01` (one tick when the ring appears).
- **Check:** spike 2.

### S01-B01-SH03 — L02 "ตัวคุณจะไม่ระเบิดอย่างในหนัง… แต่อาจมีสติอยู่แค่ประมาณ สิบถึงสิบห้าวินาที"
- **Staging:** AST hips (0.00, 0.80, 0.25) drifting 0.02 m/s −x, `front`, `zero-g-neutral`, `surprised` (eyes wide, mouth closed), hair floating. The helmet exits frame top by 1.5 s (≈ (0.25, 2.1, 0.6) at y ≈ 105–138). Film-strip card (R1.1, BC2: x 70–560, y 165–395, −4°, above her head row; LF06 head top y 451) pops in at 0.3 s ("ไม่ระเบิด", est), balloon inflates 0.3–0.9 s, pops at 1.0 s, red cross stamps at 1.3 s, card slides out 1.9–2.1 s.
- **Camera:** `cam: T-AST (0.00, 1.10, 0.25), yaw 20→12, r 2.30→2.05, eye 1.75, pitch −14°, f 1100, hy 640`. AST 653–722 px, head ≈ 199–222 px, face y ≈ 450–680 (the card now sits above the head row, BC2); limb y ≈ 752 (LF06 measured 752–797).
- **Light:** as SH01.
- **Sound:** heartbeat + tick (ring 0.0 → 1.0: one tick); `ui_pop_01` on the pop, `comedy_record-scratch_01` on the cross; no music.
- **Check:** balloon only; eyes at medium framing.

### S01-B01-SH04 — L03a "หมวกจริงล็อกแน่นนะ…"
- **Staging (RING-CLOSE, set-cm):** neck ring Ø 30, blue lock collar, latch lever rotates 0 → 20° at 0.25 s, → 35° (locked) at 0.55 s; the indicator stripe aligns. No hands (the latch moves by itself as an insert demonstration).
- **Camera:** `cam: RING-CLOSE latch, yaw 15→9, r 22→19 set-cm, f 1000, hy 900` (R1.3, was hy 820: the white rim ran at y 389–410 behind the timer-ring label; now its top is y 469–490, ≥ 39 px clear of the ring zone to y ≈ 430).
- **Light:** sun key upper left, Earthshine below; black sky; the ring sits on the suit's shoulders, which flare out of frame bottom and sides (R1.3), and the Earth limb shows as a sliver over the left shoulder (backdrop hy 260).
- **Sound:** NG-S3 two-stage latch click at 0.25 / 0.55 s; heartbeat continues under.
- **Check:** generic ring, no text, no labels.

### S01-B01-SH05 — L03b "นี่แค่สมมติ"
- **Staging:** helmet at ≈ (0.45, 2.80, 1.05) → (0.52, 2.95, 1.15), spinning 18°/s, against the Earth; AST small and soft at frame bottom (optional). Stamp "สมมติ" lands at 0.25 s (on "สมมติ", est) at screen (300, 560), ~300 × 130 px, −8°, red `#c8342b` with a heavier stroke and a thin warm-white glow (R1.3, Boss B), scale 1.3 → 1.0 over 4 f, holds; fades over the first 6 f of the next shot.
- **Camera:** `cam: T-HELM follow (0.40, 2.60, 0.95), yaw 10→16, r 1.6→1.5, eye 2.4, pitch −22°, f 1100, hy 700`.
- **Sound:** heartbeat + tick; optional soft stamp thump (Editor; it is a graphic, not an in-world sound).
- **Check:** the stamp avoids the ring zone and the caption band.

### S01-B02-SH01 — L04 "ตัวอาจบวมขึ้น… แต่ผิวหนังยังรั้งไว้ได้"
- **Staging:** AST hips (−0.04, 0.80, 0.25); `new: pat-check`: both gloves pat the chest at 0.4 / 0.8 s, right glove to the left upper arm at 1.4 s, left glove to the right upper arm at 1.9 s; shoulders drop 0.02 m at 2.4 s (breath out through closed lips, no puff); `worried` → `neutral`.
- **Camera:** `cam: T-AST, yaw −15→−6, r 2.1→1.9, eye 1.65, pitch −12°, f 1100, hy 680`. AST 712–786 px; limb y ≈ 831.
- **Sound:** stamp fade; NG-M1 enters at 1.5 s, low; heartbeat + tick (one tick).
- **Check:** no swelling shape; pats land on the suit ±6 px; elbows tucked.

### S01-B02-SH02 — L05a "และไม่แข็งทันทีด้วย…"
- **Staging:** frost creeps from the suit's silhouette edges toward the centre 0.1–0.45 s, holds 0.45–0.6 s (she looks down at it, `suspicious`), cracks at 0.6 s, flakes drift outward and away 0.6–1.4 s (no falling); she looks back up, `smug`. Frost never crosses the neck ring.
- **Camera:** `cam: T-AST, yaw 35→42, r 2.6→2.4, eye 1.70, pitch −14°, f 1100, hy 660`.
- **Sound:** NG-S4 crackle at 0.1 s and 0.6 s; `stinger_pizz-shrug_01` at 0.65 s; NG-M1 under.
- **Check:** frost on fabric only.

### S01-B02-SH03 — L05b "เหมือนกระติกน้ำร้อน ไม่มีอากาศมาพาความร้อนไป"
- **Staging:** AST lower left (cx −160), `zero-g-neutral`, small `happy`. Flask card (x 300–760, y 230–860): cream thermos, red cap, floral band; at 0.3 s the card's cutaway opens down the middle (inner bottle warm orange, an empty dark gap, outer wall cool blue); two heat wiggles rise from the inner bottle and bounce back off the gap at 1.2 s and 2.0 s ("ไม่มีอากาศมาพาความร้อนไป"). No text.
- **Camera:** `cam: T-AST, yaw 10→16, r 2.8→2.6, eye 1.70, pitch −14°, f 1100, hy 700, cx −160`.
- **Sound:** NG-M1; ticks.
- **Check:** card has no body and no words; AST whole.

### S01-B03-SH01 — silent beat + L06a "แต่น้ำลายบนลิ้นคุณ… เริ่มเดือดจริง ๆ นะ…" (LF02)
- **Staging:** AST front ¾ (`quarterDeg` ~30), `worried` (frown). 0.0–1.0 s silent beat: right glove rises (P12) to 0.12 m in front of the mouth at 0.5 s and stops; glitter starts at 0.4 s (3–6 particles/frame from lips + 0.03 m, life 1.2 s, speed 0.05–0.15 m/s, spread 25°); mouths "หืม?" (`talk` open ≤ 0.25) at 0.7 s; glove lowers 1.2–1.6 s; glitter continues through L06a, drifting off up-right.
- **Camera:** `cam: T-HEAD (0.00, 1.25, 0.25), yaw 34→27, r 1.55→1.40, eye 1.45, pitch −5°, f 1100, hy 800`. Head 301–333 px (cap 340); lips y ≈ 865–885; limb y ≈ 1091.
- **Light:** sun rim on the lips (glitter catches it), face in sun from the left.
- **Sound:** music out at 0.0; heartbeat + tick; `reveal_glass-shimmer-soft_01` at 0.4 s, very soft.
- **Check:** spike 3.

### S01-B03-SH02 — L06b "ไม่มีอากาศกด น้ำเลยเดือดได้ แค่ด้วยความอุ่นในตัว"
- **Staging (full-frame card):** a water drop ~460 px wide at the card centre (y ≈ 700); three amber arrows press on its top; arrows fade out 0.2–0.6 s ("ไม่มีอากาศกด"); the surface trembles and 6–10 small bubbles rise and pop 0.9–2.0 s ("เดือดได้"); a soft warm glow under the drop from 1.9 s ("ความอุ่นในตัว"). Timer ring stays in its zone.
- **Camera:** card push 8 % (screen-space), eased.
- **Sound:** heartbeat + tick; tiny bubble pops (`ui_pop_01` pitched up, very low).
- **Check:** no body part, no words.

### S01-B03-SH03 — L07 "ตามรายงาน ปี 1966… คนทดสอบชุดของนาซ่า เจอชุดเสียแรงดันในห้องสุญญากาศ" (LF03)
- **Staging (SET-CHAMBER66):** first 12 f: in-canvas cross-grade from a freeze of the previous orbit frame to the sepia chamber. TECH feet (0.00, 0.00, −0.80), `back`, P01, helmet on; hose from his left hip port to the wall fitting (−1.10, 0.90, −1.70). Hose pops off at ≈ 3.9 s ("เสียแรงดัน", est) and swings down; gauge needle (wall (+0.75, 1.45, −2.15)) drops 100 % → 5 % over 20 f; TECH's arms lift 0.05 m (startle) and stay. Ring paused, sepia, 50 %, pause mark.
- **Camera:** `cam: T-TECH (0.00, 1.10, −0.80), yaw 10→4, r 2.6→2.0, eye 1.30, pitch 0°, f 1000, hy 820` (push).
- **Light:** sepia grade; cage lamps 100 %.
- **Sound:** tick pauses; NG-S6 hum in with the grade; NG-S5 pop + falling hiss on the pop.
- **Check:** spike 5.

### S01-B03-SH04 — L08 "เขาเล่าว่า… สิ่งสุดท้ายที่จำได้ คือน้ำลายบนลิ้นเริ่มเป็นฟอง ก่อนจะหมดสติ"
- **Staging:** TECH steps back 0.30 m (z −0.80 → −0.50) over 0.3–1.8 s with a small sway (`new: step-back`, back view), still upright; the camera's target trucks right to the porthole (+1.30, 1.40, −2.20), so TECH leaves frame left by ≈ 2.4 s, upright. Lamps dim 100 % → 45 % over 2.0–4.3 s (after he has left frame). The porthole's control-room glow stays.
- **Camera:** `cam: at (0.00, 1.10, −0.80) → (1.30, 1.40, −2.20), yaw 4→−8, r 2.0→2.2, eye 1.30→1.40, pitch 0°, f 1000, hy 820`.
- **Sound:** hum; `bed_sub-drone-fade-in_01` from 0.5 s, low.
- **Check:** no fall; he leaves frame before the dim starts.

### S01-B03-SH05 — L09 "แล้วเขาก็ฟื้น… ตอนห้องมีอากาศกลับมา"
- **Staging:** gauge close: needle 5 % → 90 % over 0.4–1.9 s; lamps warm back to 100 % over 0.6–2.0 s; sepia drains to near full colour over 1.2–2.65 s; cut to orbit.
- **Camera:** `cam: gauge (0.62, 1.45, −2.15), yaw 0→6, r 0.62→0.52, eye 1.48, f 1000, hy 820`.
- **Sound:** `reveal_memory-swell-muffled_01` from 0.3 s with the needle; drone and hum fade by the cut.
- **Check:** no time or number on the dial.

### S01-B04-SH01 — silent beat + L10a "แต่ถ้ากลั้นหายใจ…"
- **Staging:** AST hips (−0.15, 0.78, 0.22), roll +4°, `P42` (arms across the chest, shoulders up 0.03 m), `scared` with the mouth closed, tremble roll ±1° at 6 Hz; ring resumes from 4.3.
- **Camera:** `cam: T-AST shade side, yaw −20→−12, r 1.65→1.50, eye 1.50, pitch −8°, f 1100, hy 760`. Head 283–310 px; limb y ≈ 990.
- **Light:** sun behind her (rim on the helmet ring and shoulders), face in cool Earthshine.
- **Sound:** tick resumes; heartbeat faster and closer (speed 1.25× or NG); `tone_thin-unresolved_01` enters at 0.8 s.
- **Check:** no cheek puff; the hold reads from shoulders and sealed lips.

### S01-B04-SH02 — L10b "อากาศในปอดจะดันออก เพราะข้างนอกไม่มีอากาศดันกลับ… ปอดอาจบาดเจ็บได้"
- **Staging:** chest-outline overlay at her chest anchor (hips + 0.18, 0.34 m wide): outline draws on 0.1–0.5 s; four amber arrows push outward from 0.6 s ("ดันออก"); a faint dashed ring outside fades 1.6–2.6 s ("ข้างนอกไม่มีอากาศดันกลับ"); the outline glows amber ≤ 0.3 once at ≈ 3.6 s ("บาดเจ็บ"). Her pose as SH01.
- **Camera:** `cam: T-AST, yaw 4→−4, r 2.10→1.85, eye 1.60, pitch −10°, f 1100, hy 700`. AST 736–824 px; chest y ≈ 835–878.
- **Sound:** riser builds; heartbeat.
- **Check:** no organs, no injury marks.

### S01-B04-SH03 — exhale + L11 "ปล่อยลมหายใจออกมา…" (script R1.3; R1.2 "ปล่อยมันออกมา…") + hold (LF04)
- **Staging:** 0.0–0.3 s her shoulders drop, lips part (open 0.2); stream 0.3–1.3 s (300–500 particles, 0.5 m/s, spread 12°, along her facing az +30° from the lips, slightly rising), then drifting and thinning to 2.3 s. Arms float back to `zero-g-neutral`; expression `neutral` (relief in the body, not the face).
- **Camera:** `cam: T-EXHALE (0.30, 1.20, 0.60) → (0.45, 1.20, 0.90), yaw −60→−50, r 2.10→2.15, eye 1.55→2.75, pitch −12°→−30°, f 1100, hy 740→560`, eased 0.2–1.0 (signature move 2: rise + pull-back). Projection (est): start AST 718 px, stream y ≈ 645–677 across x 358 → 1336; end AST ≈ 480 px (end r trimmed from 2.6; ≥ 440 tolerance), stream y ≈ 550–595 over the Earth (limb y ≈ 362).
- **Light:** sun behind (forward scatter: the stream blazes white-warm); the frame warms by ~10 %.
- **Sound:** the riser releases (no hit) into NG-S7 shimmer at 0.3 s; L11 at ≈ 1.05 s on near-silence with the shimmer tail; heartbeat softer.
- **Check:** spike 4.
- **R2.4 timing (sheet wins):** 72 f = 2.40 s; stream 0.30–1.77 s (L9–53) under L11 (0.80–2.00 s), thinning to 2.40 s; see [scene-sheets.md](scene-sheets.md) S01-B04-SH03.

### S01-B05-SH01 — V02 "จับได้แล้ว!"
- **Staging:** CREW hips (−0.85, 0.85, 0.15) → (−1.50, 0.85, 0.10), view `left` (R1.3: faces screen left = −x, toward the airlock; `rail-tow` travels toward the facing side), far (right) glove works the handrail (re-grips at ≈ 0.43 s and 1.13 s, the 0.7 s `rail-tow` cycle), near (left) glove enters from frame left, reaching back, and closes on AST's right wrist (−0.30, 1.00, 0.35) at frame 6 (`TOW_GRAB_SEC` 0.2 s), then tows; AST trails at screen right, towed −x ≈ 0.65 m (the motion's advance over 1.3 s), arm extended, body trailing, `neutral`.
- **Camera:** `cam: T-TOW (−0.35, 1.10, 0.25) → (−1.00, 1.10, 0.20), yaw 22→16, r 2.5→2.4, eye 1.65, pitch −12°, f 1100, hy 700` (truck follows the tow). AST 651–734 px, CREW 527–600 px.
- **Light:** sun front-left again (warmer than B04).
- **Sound:** `electric_radio-static-burst_01` trimmed 0.4 s at 0.05 s, V02 radio-filtered from 0.15 s; NG-M2 pulse enters at 0.6 s; ticks.
- **Check:** spike 7.

### S01-B05-SH02 — L12a "ถ้าช่วยเร็วมาก… ก็อาจรอด"
- **Staging (SET-AIRLOCK):** AST hips (−0.15, 0.00, +0.40) and CREW hips (+0.35, +0.05, +0.55), both `back`, facing the outer hatch; CREW's right glove on the hatch handle; the door swings from 100° to shut over 0.5–1.3 s (24 f) against the Earth; the shut frame at 1.3 s (est). Ring holds at 9.0 on the shut frame and fades over 12 f.
- **Camera:** `cam: AIRLOCK pos (+0.30, −0.25, −0.95) → (+0.24, −0.22, −0.85), target (−0.05, 0.05, +1.20), pitch +6°, f 900, hy 900`; the Earth seen through the opening is the infinity layer from the same camera pitched down 32° (R1.3: the station attitude points the outer hatch toward the Earth, so the limb sits high in the hole; rotation only, it follows the camera's small move without parallax).
- **Light:** cool panel light; the Earth's blue through the opening goes out on the shut.
- **Sound:** `pulse_underwater-soft-thump_01`, low-passed below ~150 Hz, on the shut frame (felt thud through suit contact, VD20); the tick stops on the same frame; NG-M2 thins.
- **Check:** spike 6.

### S01-B05-SH03 — L12b "แต่ข้อมูลส่วนใหญ่มาจากสัตว์ กับอุบัติเหตุไม่กี่ครั้งนะ"
- **Staging:** after the cut they have turned: AST hips (−0.15, 0.00, +0.20), facing az 190° (`front`, screen right), holding CREW's left glove with her right at (+0.15, 0.25, +0.30); CREW hips (+0.40, +0.05, +0.35), facing az −100° (`right`, screen left), leaning in 12° over 0.5–2.0 s. The shut hatch behind them.
- **Camera:** `cam: AIRLOCK target (+0.12, 0.25, +0.28), yaw 200→192, r 1.10→1.00, eye 0.35, pitch −4°, f 900, hy 820`.
- **Light:** cool white panel light.
- **Sound:** `bed_edu1-warm-pad-loop62_01` (or NG-M2's tail) low; no airborne sound.
- **Check:** faces above y 1160; no eye detail.

### S01-B05-SH04 — L13 "คุณไม่ระเบิดหรอก… สิ่งที่ควรทำ คือหายใจออก" (LF05)
- **Staging:** AST front ¾, `neutral` → a small `happy` with the mouth closed on "หายใจออก"; their joined gloves low in frame; CREW soft at frame left.
- **Camera:** `cam: AIRLOCK target (−0.15, 0.55, +0.20), yaw 190→184, r 1.36→1.30, eye 0.55, pitch −2°, f 1000, hy 800` (R1.1, BC1 amended: LF05 measured head 334 px at r 1.30 (cap 340); BC1's end r 1.22 would give ≈ 356 px, so the push is r 1.36→1.30, ≈ 319→334 px).
- **Light:** cool white with a faint warm edge from the lamp (off yet).
- **Sound:** pad; `stinger_pizz-tag-ending_01` from the end of "หายใจออก" (UT15, peak about −10 dB).
- **Check:** normal expression; head ≤ 340 px.

### S01-B05-SH05 — closing (`A_fade`)
- **Staging:** hands in front (her right glove in CREW's left; CREW's right glove settles over both 0.4–1.2 s); behind them the gauge (+0.86, 0.30, +0.30) and the amber lamp (+0.86, 0.50, +0.30): lamp on at 0.2 s (`paintHalo` ≤ 0.3), needle 0 → 18 % of its travel over 0.4–2.2 s. Fade to black over the last 0.8 s; `endHoldSec: 0`.
- **Camera:** `cam: AIRLOCK target hands (+0.15, 0.25, +0.30), yaw −80→−72, r 0.62→0.56, eye 0.32, pitch −2°, f 1000, hy 860`.
- **Light:** amber warms the frame (relief).
- **Sound:** tag rings; NG-S8 hiss from 0.3 s, rising, never full; pad, hiss and tag fade with the picture to true silence.
- **Check:** spike 8.
- **Superseded (ROWS-R2.3 / SHEETS-R2.2, 2026-11-08):** user Draft verdict "does not read"; redesigned as a high three-quarter two-shot (her face, his visor, joined hands; gauge and lamp behind his helmet), see [scene-sheets.md](scene-sheets.md) S01-B05-SH05 and SD15.

## Look frames (W3, from the brief)

v1 painted 2026-11-08 (measurements, sources and W3 tuning in the brief R1.1 [Look frames](film-brief.md#look-frames-w3-painted-after-the-w22-storyboard-pass-is-on-the-review-page)): LF00 VD25 suit/helmet look check (AST helmet on front; AST helmet off ¾ with glitter; CREW visor down, profile) · LF01 S01-B01-SH01 · LF02 S01-B03-SH01 · LF03 S01-B03-SH03 · LF04 S01-B04-SH03 · LF05 S01-B05-SH04 · LF06 S01-B01-SH03 (film strip + ring, BC2) · LF07 S01-B02-SH03 (flask card + ring). Rows: beat looks B01 LF01, B02 LF07, B03 LF02, B04 LF04, B05 LF05; LF00, LF03, LF06 as page questions Q-LF00, Q-LF03, Q-LF06. Stills `out/edu08/look-frames/v1/`, store `projects/edu/EDU/previews/EDU-EP08-SHORT/look-frames/`.

## Sound NEEDS-GEN list (from the brief; generated at W4+ by the Editor)

NG-M1 playful muted pizzicato + soft plucks over a thin airy pad, 84 bpm, 16 s · NG-M2 gentle warm pulse + pad, 84 bpm, 12 s · NG-S1 suit breathing in a helmet, 3 s loop · NG-S2 radio carrier hiss, no voices, 6 s loop · NG-S3 two-stage neck-ring latch click, 0.6 s · NG-S4 thin ice crust crackle and crumble, 1.2 s · NG-S5 hose pop + falling air hiss, 1.5 s · NG-S6 1960s chamber fan hum, 10 s loop · NG-S7 long airy glitter shimmer, 2.5 s · NG-S8 airlock repressurisation hiss rising, 3 s.

## Brief changes (applied in brief R1.1, 2026-11-08)

- **BC1 (S01-B05-SH04 radius):** the brief's `r 1.00→0.92` gives AST's head ≈ 450 px, above the 340 px safety cap (R01). Proposed `r 1.30→1.22` (head ≈ 330–350 px; est). Applied in brief R1.1 as `r 1.36→1.30` (LF05 measured head 334 px at r 1.30; 1.22 would exceed the cap).
- **BC2 (S01-B01-SH03 card position):** the film-strip card overlaps her head row if it spans x 90–620; keep its right edge at x ≤ 420 at y 430–690, or raise it to y 200–420. Applied: raised to y 165–395, x 70–560 (LF06).

## Open items

- **Missing evidence:** look frames v1 only (not approved), no blockout; every new asset `missing` (brief B1–B6, N1–N10); floating anchors estimated from the rig; within-line split points `est` until the voice lock.
- **Q-F1, Q-F2:** answered by the user 2026-11-08 (AST `woman-bob`; Earth generic sea and clouds).
- **Look verdicts (user):** LF00–LF07 (Q-LF00 suit/helmet before Boss builds B2; Q-LF03 flashback; Q-LF06 film strip + ring).
- **Film calls recorded (not questions):** "สมมติ" stamp on screen (VD09); felt thud at the hatch (VD20); flask card staging (VD12).

## Change log

- **EDU-EP08-ROWS-R1 (2026-11-08, Film W2.2):** first storyboard pass from script R1.1 and brief EDU-EP08-BRIEF-R1: 21 shots with stable IDs, est lengths from the measured read (≈ 57.6 s), ring story values, per-shot staging, camera lines, casting lines, light, sound (library IDs and NG-*), checks; rules R01–R09; Thai rows in review-rows.json (untimed). Proposed BC1–BC2; questions Q-F1, Q-F2. No paint, no render.
- **EDU-EP08-ROWS-R1.1 (2026-11-08, Film W3.1):** BC1 (S01-B05-SH04, amended to `r 1.36→1.30` by the LF05 measurement) and BC2 (S01-B01-SH03 film-strip box above the head row) applied with the brief R1.1; look frames v1 LF00–LF07 added to review-rows.json (`looks`, beat `look`, questions Q-LF00/Q-LF03/Q-LF06 replace the answered Q-F1/Q-F2); S01-B01-SH03 `seen` updated (card above her head) with a `changed` line. Stable IDs unchanged.
- **EDU-EP08-ROWS-R1.2 (2026-11-08, Film W3 arm check):** look-frame images moved to `out/edu08/look-frames/v2/` (arms re-authored from the kit bone after the shoulder-anchor fix, brief R1.2); no row, ID, timing or Thai text changed.
- **EDU-EP08-ROWS-R1.3 (2026-11-08, Film, Boss pass A/B open items):** S01-B03-SH05 camera target x 0.62 (the approved LF03 gauge, `CHAMBER.gauge`; LF03 unchanged); S01-B01-SH04 RING-CLOSE accepted with shoulders out of frame, Earth sliver over the left shoulder and camera hy 900 (`ring-close.ts`, stills `out/edu08/film-r13/`); S01-B01-SH05 stamp glow + heavier stroke accepted; S01-B05-SH01 CREW `left`, near glove on the wrist, far glove on the rail; S01-B05-SH02 Earth through the hatch from the camera pitched down 32°; helmet glint = `glint` option; review rows: SH04 and B05-SH01 `seen` text updated. No ID, timing, narration or reveal changed.
- **EDU-EP08-ROWS-R2.0 (2026-11-08, Film W5.1):** review-rows.json gets `start`/`end` from the voice lock (1684 f), `untimed`/`timingEstimated` false; no row text, ID or reveal changed. Timed direction moved to [scene-sheets.md](scene-sheets.md) SHEETS-R1.
- **EDU-EP08-ROWS-R2.1 (2026-11-08, Film W5.1 re-time):** user decision (narration atempo 0.95 per line and vocal take, gaps kept, L13 0.9 s `qsin` fade-out): review-rows.json `start`/`end` from the re-locked timeline (`voice-lock.py --tempo 0.95`, **1762 f = 58.73 s**, R1 1684 f), revision, eyebrow, lede and the frame fact updated; no row text, ID, beat or reveal changed. The attached draft clips still point into the 1.0-pace draft cut. Timed direction in [scene-sheets.md](scene-sheets.md) **SHEETS-R2** (per-shot changes in its "R2 re-time" section).
- **EDU-EP08-ROWS-R2.2 (2026-11-08, Film):** review-rows.json revision and eyebrow point to [scene-sheets.md](scene-sheets.md) **SHEETS-R2.1** (user decision: S01-B01-SH02 helmet path raised 0.11 m so the collar ring clears the hair by 9 px at the silence frame L40/G95, silence and V01 slot unchanged; S01-B01-SH05 camera follows the helmet; S01-B02-SH03 cx −240 confirmed). No row text, timing, ID, beat or reveal changed.
- **EDU-EP08-ROWS-R2.3 (2026-11-08, Film, Draft fix round 1):** user verdicts `change` on S01-B05-SH01 (rescued face read as a plain smile), SH03 (arm sketch lines beside the torso), SH05 (shot does not read); all other shots ok. review-rows.json: revision, eyebrow (SHEETS-R2.2), lede, SH01/SH03 `seen` notes and the SH05 title/`seen` rewritten (Thai narration and subtitles unchanged; clips still the pre-fix Draft). Decisions in [scene-sheets.md](scene-sheets.md) SD13–SD15; work items in [fixlist.md](fixlist.md).
- **EDU-EP08-ROWS-R2.4 (2026-11-08, Film, script R1.2 ending):** review-rows.json from SHEETS-R2.3 and the Editor's R1.2 voice re-lock (1731 f = 57.7 s): revision, eyebrow (script R1.2), lede, frame fact; S01-B05-SH02 1439–1497 and SH05 1665–1731 `changed` = time shift only (SH05 also: no blink at the cut); S01-B05-SH03 1497–1596 and SH04 1596–1665 new `title`/`vo`/`seen`/`sound`, `lines` L13, `changed` flagged for a storyboard verdict, their R2.2 Draft clips removed (the old draft shows the R1.1 lines). Thai VO verbatim from script R1.2. review page: pending.
- **EDU-EP08-ROWS-R2.5 (2026-11-08, Film, script R1.3 L11):** review-rows.json from SHEETS-R2.4 and the Editor's R1.3 voice re-lock (1745 f = 58.2 s): revision, eyebrow (script R1.3), lede, frame fact, B04 beat name and S01-B04-SH03 VO "ปล่อยลมหายใจออกมา…"; S01-B04-SH03 1340–1412 flagged `changed` "เปลี่ยน: ช่วงถือภาพยาวขึ้น 14 เฟรมตามบทใหม่"; S01-B05-SH01–SH05 `start`/`end` +14 (time shift only, no flag); earlier `changed` flags cleared. Draft clips still point at the R2.3 Draft cut (1731 f).
