# Storyboard — EDU-EP15-SHORT (timed scene sheet)

Deliverable: `EDU-EP15-SHORT` · Revision: **EDU-EP15-ROWS-R2.0 (timed scene sheet)** (Film, 2026-11-10: every shot range, cue and shot-local key frame pegged to the W4 voice lock; staging, cameras and sound designs are the user-passed R1.3 text, with the W3/W3.1 camera findings folded into the shot blocks) · Status: **ready-for-dev (timing)** for Boss's W5 shot code and Ton's cue sheet; not a user approval, not runtime or audio proof · Timing: **audio-measured** on the locked narration (line edges from speech energy ±0.03 s; word pegs inside a line syllable-interpolated between energy anchors ±0.15 s, see [Word pegs](#word-pegged-key-frames-r20); narration **not listened**; V01/V02 picked by ear by the user).
Inputs: [script.md](script.md) EDU-EP15-SCRIPT-R2 (user-approved 2026-11-10) · [fact-check.md](fact-check.md) R1 + R2 recheck · [film-brief.md](film-brief.md) **EDU-EP15-BRIEF-R1.2** · narration (W4.1 lock) store `projects/EDU/audio/2026-11-10_ep15-nar-kore-fullread.wav` (49.20 s, no atempo; [measure.json](measure.json)) · V01 `projects/EDU/audio/2026-11-10_ep15-char-v01-b-despina.wav` · V02 `projects/EDU/audio/2026-11-10_ep15-char-v02-c-algenib.wav` (user picks W4.2) · task [task.md](task.md) · delivery record [../delivery.md](../delivery.md).
Target: this worktree, branch `claude/c43-education-concept-300411` at `7e01220` (+ uncommitted EP15 work: `src/painted/edu15/` look frames v10/v11) · 30 fps · **durationFrames 1738 (57.93 s)** · 1080×1920 · composition offset 0 (one scene, S01).
Evidence: look frames LF01–LF05B and tokay stills TK1–TK8 painted (v10, LF05A/LF05B/TK7 v11) and passed by the user 2026-11-10 ("ผ่านหมด", ROWS-R1.3); no shot rendered, no blockout, no seek-parity render; timing measured from the audio files (not listened); viewer check not yet run.
Rows file: [review-rows.json](review-rows.json) **EDU-EP15-ROWS-R2.0** (timed: `start`/`end` on every shot, `untimed` removed, R1.3 `changed` notes removed as passed; text unchanged, so saved answers survive). Review page: pending.

## Units, clocks and conventions

- Clocks: **global** `f` = composition frame (= scene-local, offset 0); **shot-local** `+n` = `f − shot start`. Ranges are half-open `[start, end)`; a shot's last frame is `+len−1`. Read time `t` (seconds in the locked narration WAV) → global frame = `round((t + offset) · 30)`, offset **0.30 s** for L01–L03 (lead-in), **1.00 s** for L04–L05 (V01 slot 0.70 s), **1.40 s** for L07–L08 (zoom gap 0.40 s), **1.70 s** for L09–L15 (TV-cut gap 0.30 s), **5.8257 s** for L16 (W-HANG + V02 + W-MOTH: L16 onset pinned to shot 20 +4 = f1538). The narration is one file placed in segments: cut it at the mid-points of the real pauses before L04 (8.80 s), L07 (15.31 s), L09 (22.49 s) and L16 (45.14 s) and start each segment at its offset. No gap sits between L10 and L13: the longest answer is **9.31 s** (L10 onset f886 → L13 onset f1165, limit 10 s).
- Character takes (ffmpeg silencedetect −35 dB / 0.06 s, file seconds): **V01** Despina "เอ๊ะ?" file 0.84 s, voice 0.256–0.483 s (7 f); **V02** Algenib "อย่าปล่อยนะ!" file 1.84 s, voice 0.227–1.602 s (41 f; a 0.08 s dip at 0.411–0.489 s between "อย่า" and "ปล่อยนะ"). Files are placed by their voice onset (table below).
- Spaces and axes as in the brief's [projection contract](film-brief.md#projection-contract-and-scale-baseline): `R` room (m; origin on the floor below the lamp centre, +x right seen from the TV side, +y up, +z toward the TV wall; ceiling y 2.70), `T` toe macro (mm; origin at toe 3's pad centre of the front-left foot, +x toward the toe tip, +y out of the pad), `U` micro (µm; origin at the hero hair's base, +y along the hair toward the surface). Camera lines give `pos` (camera position) → `look-at` and the focal length `f` in px (1080-wide frame); the heading convention of `ycam.ts` is not restated here: the look-at point governs. `near` per the brief.
- Screen: pixels, origin top-left, y down. Caption band y 1176–1344; faces, contacts, the tokay's head and feet, labels and the bubble above y 1160 ([caption-zone rule](film-brief.md#caption-zone-rule)); label slot LBL (816–1020, 148–204) for "ภาพจำลอง"; bubble slot BUB x 520–1020, y 220–760; `@TamMaiLa` top-left (x < 330, y < 140 kept clear). Lead sizes are computed (px/m = f / distance), not rendered.
- In shot headers `VO C05 +3–+90` means shot-local voice range [3, 90) of cue C05; word onsets in brackets.
- Values in Camera/Staging are design `est` unless marked `measured`; every frame number below is an integer on the measured timeline (R2.0).

## Casting

| Role | Casting line | Notes |
| --- | --- | --- |
| WOMAN | `woman-curly + home-lounge, new: sit-phone, neutral` | 1.62 m, mid-forties; mark W0 on the sofa (hips (−0.35, 0.30, −0.75), head ≈ (−0.35, 0.98, −0.80)), facing +z. Poses: `new: sit-phone` (P31 body, phone in both hands at the chest) → head up → P31 back view with `headCock` +12 → **P32** profile lean with head raised (`new: sit-lean-look-up` if P32 cannot lift the head) → P31 front, phone on the lap. Faces: `neutral` → `surprised` → `suspicious` → `happy` |
| WOMAN voice | V01 "เอ๊ะ?" = Despina, `projects/EDU/audio/2026-11-10_ep15-char-v01-b-despina.wav` (user pick W4.2) | voice 7 f; file start f265 |
| MAN (imagined) | `man-spiky, new: hang-held-wrists, scared` (supersedes `hang-two-hands`, R1.1) | 1.72 m; on the brief's [hang rig H](film-brief.md#hang-rig-h): arms straight up, wrists together at (0.33, 2.48, 0.38) (W3.1, user Q-F6: rig moved 0.5 m forward from z −0.12) held by the tokay's hind feet, head top ≈ 2.18, eyes ≈ 1.98, chin ≈ 1.75, feet ≈ 0.70 m above the floor (kit 4-head MAN, measured W3; brief est 0.46); `front`; faces `scared` → `shock` → `relieved`; never in the real room |
| MAN voice | V02 "อย่าปล่อยนะ!" = Algenib, `projects/EDU/audio/2026-11-10_ep15-char-v02-c-algenib.wav` (user pick W4.2) | voice 41 f; file start f1437 |
| TOKAY | `new: tokay (Gekko gecko: blue-grey, rust-orange and pale spots, yellow slit eyes, banded tail), rest-ceiling` | 0.29 m; on the ceiling belly-up (spotted back toward the room); marks T0 (0.42, 2.70, −0.12) → T1 (0.14, 2.70, −0.40) → T2 (0.30, 2.70, −0.25) → T3 (0.20, 2.70, −0.18); hero foot front-left; views `dorsal`, profile, `front`; states rest (K02), walk, peel, brace, lunge, call; imagined only: `hang-front` (R1.1: hanging head-up from the two front feet on the plaster, belly to the lens, hind feet clasping the man's wrists, tail free) |
| TOKAY call | V03 one "ตุ๊ก-แก" | designed sound (Ton, NEEDS-GEN V03), no subtitle |
| Props | `new: plunger`, `new: tape strip`, `new: moth` (sling, rope and toggle dropped, R1.1) | brief N8–N10 (N7 retired) |
| Kit layers | ENV-GLOW `paintHalo` (lamp halo); grades and thought bubble from EP14 (`edu14/grade.tsx`, `edu14/bubble.ts`, ENV-P01 promotion) | ENV-P02 |

## Shot map

| # | Shot | Beat | Lines | Range (global) | Len | Start s | Camera | One-line read |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | S01-B01-SH01 | B01 | L01 | [0, 128) | 128 | 0.00 | low sofa-side wide → crane up | She scrolls on the sofa; a big tokay on the ceiling by the lamp; crane up to its feet |
| 2 | S01-B01-SH02 | B01 | L02 | [128, 184) | 56 | 4.27 | close on the feet → pull back and down to a low wide | "ภาพจำลอง": the tokay hangs from its front feet and grips a whole man by the wrists |
| 3 | S01-B01-SH03 | B01 | L03 | [184, 257) | 73 | 6.13 | below → ceiling-level side view | Snap back; the camera rises to the ceiling: a foot pressed flat and dry on rough plaster |
| 4 | S01-B01-SH04 | B01 | V01 | [257, 297) | 40 | 8.57 | medium close, low | She looks up: "เอ๊ะ?"; a thought bubble with a plunger |
| 5 | S01-B02-SH01 | B02 | L04 | [297, 389) | 92 | 9.90 | ceiling-level close (her thought) | The plunger thwops on, grit lifts its rim, it drops; bubble pops |
| 6 | S01-B02-SH02 | B02 | L05 | [389, 500) | 111 | 12.97 | straight up | The tokay walks over the dust; specks fall off step by step |
| 7 | S01-B03-SH01 | B03 | L07 | [500, 643) | 143 | 16.67 | macro dive (mm) | Under a lifted toe: ridges, then a dense carpet of hairs to the horizon |
| 8 | S01-B03-SH02 | B03 | L08 | [643, 730) | 87 | 21.43 | micro track (µm) | One hair splits into hundreds of tips |
| 9 | S01-B03-SH03 | B03 | L09 a | [730, 792) | 62 | 24.33 | close, slow truck | Dust and fluff on the black TV glass |
| 10 | S01-B03-SH04 | B03 | L09 b | [792, 883) | 91 | 26.40 | over her shoulder, looking up | She tilts her head at the tokay hanging upside down |
| 11 | S01-B03-SH05 | B03 | L10 | [883, 963) | 80 | 29.43 | micro section, truck | Tips settle into the plaster's bumps |
| 12 | S01-B03-SH06 | B03 | L11 | [963, 1096) | 133 | 32.10 | micro → pull back through every scale | One glint, then a field; they merge into one warm line to the foot |
| 13 | S01-B03-SH07 | B03 | L12 | [1096, 1162) | 66 | 36.53 | ceiling-level side view, pull back | The whole tokay upside down, bracing, holding firm |
| 14 | S01-B04-SH01 | B04 | L13 | [1162, 1248) | 86 | 38.73 | low profile two-plane | She leans in; the tokay starts to walk |
| 15 | S01-B04-SH02 | B04 | L14 | [1248, 1325) | 77 | 41.60 | ceiling-level side close | A toe rolls up from the tip; tape beside it peels the same way |
| 16 | S01-B04-SH03 | B04 | L15 | [1325, 1400) | 75 | 44.17 | micro section → room | Hairs let go row by row; the foot snaps free and steps on |
| 17 | S01-B05-SH01 | B05 | W-HANG | [1400, 1436) | 36 | 46.67 | shot 2's end → whip push to the feet | "ภาพจำลอง": the man dangles; the tokay curls one whole front foot, the other stays flat |
| 18 | S01-B05-SH02 | B05 | V02 | [1436, 1496) | 60 | 47.87 | close from below | His eyes snap up: "อย่าปล่อยนะ!"; the foot settles |
| 19 | S01-B05-SH03 | B05 | W-MOTH | [1496, 1534) | 38 | 49.87 | up at the lamp, push in on the head | The tokay peels and lunges; the moth flashes in its jaws, then is swallowed |
| 20 | S01-B05-SH04 | B05 | L16, V03, hold | [1534, 1738) | 204 | 51.13 | her smile → slow crane to the tokay | She smiles; the tokay by the lamp calls; hold |

Total **1738 f = 57.93 s** (target 40–60 s: pass, 2.07 s margin; limit 63 s; R1.3 est was 1729 f, +9 f). Speech ends f1642 (L16); V03 [1645, 1678); closed hold [1678, 1738) = 60 f = 2.00 s. Shot starts moved −2 to +9 f against R1.3; lengths changed most on shot 18 (45 → 60 f, the picked V02 take is 41 f of voice against the 24 f estimate), shot 16 (85 → 75), shot 11 (88 → 80), shot 10 (83 → 91) and shot 7 (138 → 143).

## Measured line edges (W4 lock)

Line edges of the locked narration in read seconds (ffmpeg silencedetect −35 dB / 0.12 s plus a 20 ms RMS envelope; breaths at −40 to −46 dB before a line are not onsets) and their global frames. Whisper onsets in [measure.json](measure.json) were 0.15–0.24 s early at L02, L08, L10, L12 and L15 (they started on the breath or a 34 ms click); the energy edges below win.

| Line | Onset s | End s | Global [onset, end) | Internal pauses (s) |
| --- | --- | --- | --- | --- |
| L01 | 0.253 | 3.589 | [17, 117) | 1.459–1.722 ("…") |
| L02 | 3.953 | 5.946 | [128, 187) | — |
| L03 | 6.472 | 8.566 | [203, 266) | 7.592–7.845 |
| L04 | 9.037 | 11.451 | [301, 374) | 10.690–10.878 |
| L05 | 12.073 | 14.952 | [392, 479) | 13.220–13.596 |
| L07 | 15.672 | 19.577 | [512, 629) | 17.656–18.019 ("…") |
| L08 | 20.133 | 22.206 | [646, 708) | — |
| L09 | 22.765 | 27.147 | [734, 865) | 24.308–24.831 ("…", breath inside), 25.730–25.893 |
| L10 | 27.827 | 30.033 | [886, 952) | — |
| L11 | 30.514 | 34.458 | [966, 1085) | 32.320–32.650 ("…") |
| L12 | 34.929 | 36.550 | [1099, 1148) | 35.564–35.838 ("…") |
| L13 | 37.141 | 39.340 | [1165, 1231) | 37.431–37.682 ("แต่…"), 38.565–38.704 |
| L14 | 40.010 | 42.019 | [1251, 1312) | — |
| L15 | 42.552 | 44.843 | [1328, 1396) | 43.420–43.584 ("…") |
| L16 | 45.441 | 48.918 | [1538, 1642) | 47.349–47.666 ("…") |

## Voice and subtitle cues (global, measured)

Captions = VO, Thai verbatim; one cue per voice run (Editor's caption rules set holds and splits; split only at a word boundary). V03, W-HANG and W-MOTH have no caption.

| Cue | Line | Text | Voice [start, end) | Shot(s) |
| --- | --- | --- | --- | --- |
| C01 | L01 | ตุ๊กแกบนเพดานบ้านคุณ… ถ้าขนที่เท้ามันจับพร้อมกันทุกเส้น | [17, 117) | 1 |
| C02 | L02 | แรงพอจะห้อยคนไว้ได้ประมาณหนึ่งคน | [128, 187) | 2, 3 (+0–+3) |
| C03 | L03 | ทั้งที่เท้ามันไม่มีกาว ไม่มีแรงดูด | [203, 266) | 3, 4 (+0–+9) |
| V01 | V01 | เอ๊ะ? | [273, 280) (caption may hold to 285 for reading) | 4 |
| C04 | L04 | จุ๊บดูดเจอเพดานฝุ่น ๆ แบบนี้ อยู่ไม่ได้หรอก | [301, 374) | 5 |
| C05 | L05 | แต่ตุ๊กแกเดินต่อได้ ฝุ่นร่วงออกทีละก้าว | [392, 479) | 6 |
| C06 | L07 | ใต้นิ้วมัน มีขนเล็ก ๆ เรียงกันแน่น… สี่เท้ารวมกันหลายล้านเส้น | [512, 629) | 7 |
| C07 | L08 | แต่ละเส้น ปลายแตกเป็นหลายร้อยปลาย | [646, 708) | 8 |
| C08 | L09 | ฝุ่นเกาะจอทีวีน่ะเห็นบ่อย… แต่ขนแห้ง ๆ เกาะเพดานกลับหัวได้ยังไง | [734, 865) (runs [734, 780) and [796, 865); the 9→10 cut at 792 sits in the pause) | 9, 10 |
| C09 | L10 | ปลายมันเล็กจนแนบชิดไปตามผิวเพดาน | [886, 952) | 11 |
| C10 | L11 | ชิดขนาดนั้น จะดึงกันนิดนึง… นับพันล้านจุดรวมกันก็แรงมาก | [966, 1085) | 12 |
| C11 | L12 | ยิ่งแนบชิด… ยิ่งเกาะแน่น | [1099, 1148) | 13 |
| C12 | L13 | แต่… เกาะแน่นขนาดนี้ มันเดินยังไง | [1165, 1231) | 14 |
| C13 | L14 | มันม้วนนิ้วขึ้นจากปลาย เหมือนลอกเทป | [1251, 1312) | 15 |
| C14 | L15 | พอขนไม่แนบชิด… ก็หลุดในเสี้ยววินาที | [1328, 1396) | 16 |
| V02 | V02 | อย่าปล่อยนะ! | [1444, 1485) | 18 |
| C15 | L16 | สัตว์ที่เกาะเก่งขนาดนี้ในบ้านคุณ… ไม่ได้ใช้กาวสักหยดเลย | [1538, 1642) | 20 |
| — | V03 | (tokay call, no caption) | [1645, 1678) (Ton's file, ≈ 1.10 s; Editor fits its onset to f1645) | 20 |

V01 placement: file start f265 (shot 4 +8), voice onset f273 (+16). V02 placement: file start f1437 (shot 18 +1), voice onset f1444 (+8), voice end f1485 (+49).

## Word-pegged key frames (R2.0)

Every key frame that sits on a spoken word. `anchor` = the word starts on a measured energy edge (line onset or end of an internal pause, ±0.03 s); `interp` = syllable-interpolated between the two nearest anchors (±0.15 s, no Whisper word pass in this checkout: `faster_whisper` is not installed). Editor checks the `interp` pegs by ear at W5 and moves the picture beat, not the audio, if a word lands more than 3 f off.

| Shot | Key frame | Word | Kind | R1.3 local (est) | R2.0 local | Global |
| --- | --- | --- | --- | --- | --- | --- |
| 1 B01-SH01 | the tokay in frame | "ตุ๊กแก" | anchor | +16 | +17 | 17 |
| 1 B01-SH01 | crane lands on the feet | "ทุกเส้น" | interp | +103 | +105 | 105 |
| 2 B01-SH02 | wrists, head and torso in frame | "ห้อย" | interp | +17 | +16 | 144 |
| 2 B01-SH02 | held wide | "หนึ่งคน" | interp | +52 | +49 | 177 |
| 3 B01-SH03 | the dry pad reads | "กาว" | interp | +54 | +48 | 232 |
| 3 B01-SH03 | the flat pad reads | "ไม่มีแรงดูด" | anchor | +60 | +60 | 244 |
| 5 B02-SH01 | gap under the rim reads | "ฝุ่น" | interp | +33 | +32 | 329 |
| 5 B02-SH01 | plunger drops | "อยู่ไม่ได้" | anchor | +55 | +59 | 356 |
| 6 B02-SH02 | walking | "เดิน" | interp | +27 | +20 | 409 |
| 6 B02-SH02 | first clear dust fall | "ฝุ่นร่วง" | anchor | +51 | +49 | 438 |
| 6 B02-SH02 | last step | "ก้าว" | interp | +91 | +83 | 472 |
| 7 B03-SH01 | hairs fill the frame | "ขน" | interp | +36 | +36 | 536 |
| 7 B03-SH01 | rise over the carpet | "สี่เท้า" | anchor | +86 | +83 | 583 |
| 7 B03-SH01 | rows to the horizon | "หลายล้าน" | interp | +110 | +109 | 609 |
| 8 B03-SH02 | the split | "ปลายแตก" | interp | +27 | +24 | 667 |
| 8 B03-SH02 | the full fan | "หลายร้อย" | interp | +51 | +44 | 687 |
| 10 B03-SH04 | (second half starts) | "แต่" | anchor | +3 | +4 | 796 |
| 10 B03-SH04 | head tilt | "กลับหัว" | interp | +44 | +50 | 842 |
| 11 B03-SH05 | tips settle | "แนบชิด" | interp | +30 | +27 | 910 |
| 11 B03-SH05 | full contact | "ผิวเพดาน" | interp | +57 | +51 | 934 |
| 12 B03-SH06 | first glint | "ดึง" | interp | +32 | +34 | 997 |
| 12 B03-SH06 | pull-back starts | "นับพันล้าน" | anchor | +69 | +67 | 1030 |
| 12 B03-SH06 | one strong line | "แรงมาก" | interp | +110 | +110 | 1073 |
| 13 B03-SH07 | brace | "ยิ่งเกาะ" | anchor | +35 | +30 | 1126 |
| 14 B04-SH01 | lean complete | "เกาะแน่น" | anchor | +23 | +19 | 1181 |
| 14 B04-SH01 | first step | "เดิน" (L13) | interp | +55 | +55 | 1217 |
| 15 B04-SH02 | roll starts | "ม้วน" | interp | +10 | +10 | 1258 |
| 15 B04-SH02 | both peeled | "ลอกเทป" | interp | +50 | +50 | 1298 |
| 16 B04-SH03 | the foot snaps free | "หลุด" | interp | +49 | +39 | 1364 |
| 20 B05-SH04 | crane mid-way | "ไม่ได้ใช้กาว" | anchor | +71 | +71 | 1605 |

Unpegged picture beats: V01 voice f273, V02 voice f1444–1485, W-HANG [1400, 1436), W-MOTH [1496, 1534) (catch f1516), V03 f1645, end f1738.

## On-screen text (global ranges)

Exactly brief VD25.

| Text | Range | Shot(s) |
| --- | --- | --- |
| "ภาพจำลอง" (LBL) | [128, 184) · [500, 730) · [883, 1078) · [1325, 1364) · [1400, 1496) | 2; 7–8; 11–12 (to the loupe-out into the room, +115); 16 (+0–+39); 17–18 |
| Captions | per the cue table | all |

No numbers, no scale bars, no other text; every set item textless.

## Rules for every shot

- **R01 Model labels.** "ภาพจำลอง" ranges as above: every hanging-man picture and every drawn-scale macro (D03 adds the L15 macro part).
- **R02 Truth limits.** As the brief's [Visual intent](film-brief.md#visual-intent): no number on screen; the man never in the real room; in the imagined hang the tokay holds him with its own feet (no sling, rope or prop) and the force reads from the pressed, splayed front feet, never from a glow, line or glint (held back until L11); the TV dust never linked by picture to the hairs; no tail use or tail drop; pads always flat and dry (no blob, shine, strands or dome); dust recovery partial; peel = toes rolling up and back from the tip, rows letting go in sequence.
- **R03 Size reference.** Every shot keeps one size reference in frame: WOMAN, sofa or lamp (room), the toe and its ridges (`T`), the hair and its neighbours (`U`), the TV edge and the room's reflection (TV glass), the man and the tokay (imagined).
- **R04 Feet on the plane.** The tokay's planted feet sit on y 2.70 in `R` (no float, no sink, no slide while planted); a lifted foot leaves toe-tips-first. In the imagined hang (shots 2, 17, 18) the two front feet are the planted pair and the hind feet are locked to the man's wrist anchor; the sway pivots on the front-foot line.
- **R05 Screen.** Faces, contacts, the tokay's head and feet, labels and the bubble above y 1160; the caption band calm per the [caption-zone rule](film-brief.md#caption-zone-rule) (mean ≤ 0.25, p95 ≤ 0.40 on clean frames); LBL and BUB slots only.
- **R06 Grades.** Imagined grade (saturation 35 %, cool tint, vignette) on shots 2, 17, 18 only; her-thought grade (sepia, cloud-edged bubble) on shot 5 (and the small bubble in shot 4); both snap in over 3 f.
- **R07 Ambient clocks.** The fan, the moth (until shot 19), the cobweb strand and the tokay's flank breathing run on ambient clocks through holds and slow motion (DF-20261030-painted-story-hold-ambient-clock); event clocks are shot-local.
- **R08 Continuity.** WOMAN on W0 in every room shot (phone in hand to shot 10, lowered after, on her lap in shot 20); the tokay T0 (shots 1–6 start) → T1 (end of 6, shots 10, 14 start) → toward T2 (14–16) → T2 (19 start) → T3 (19 end, 20); the hero foot front-left (3, 7, 12 end, 13, 15, 16); the imagined hang uses rig H at z 0.38 (W3.1; not T0), the curling foot in 17–18 front-right (screen left, the tokay facing the lens); the dust ring identical in every ceiling shot; no woman in the imagined room.

## Per-shot staging

Key frames shot-local `+n`. Sound lines give the shot-local frame and the brief's code or library ID (brief [Sound direction](film-brief.md#sound-direction)); every library ID is "not listened" and Ton checks it against its description before use. Mix intent per the brief's arc; Editor sets levels.

**1. S01-B01-SH01** [0, 128), 128 f. VO C01 +17–+117 ("ตุ๊กแก" +17, "ถ้า" +61, "ทุกเส้น" +105).
- Camera: `ycam: pos (0.10, 0.70, 1.50) → (0.34, 2.36, 0.12), look-at (0.00, 1.30, −0.75) → (0.33, 2.70, −0.16), f 950 → 1000`, start hy 860 (W3: phone and chest above the caption band); hold +0–+40, crane up (ease in-out) +40–+105, hold +105–+127. At +0 (measured, LF01 v10 @ +20 on the held start camera): WOMAN 801 px, face y 881, tokay 135 px. At +105 ≈ 3300 px/m at the front-left foot: foot ≈ 80 px, toes ≈ 33 px.
- Staging: R, real night. WOMAN `front` on W0, `new: sit-phone`, `neutral`, thumb scrolling (phone glow on her face); the coffee table soft in the foreground across the caption band; the ceiling above: lamp pool, dust ring (K01), cobweb corner, fan turning; the moth orbiting the lamp (K03); the tokay at T0, `dorsal`, `rest`, head toward the lamp, toe tips of the hind feet lifted (K02, small). The crane rises past the lamp edge to the tokay's front half and feet.
- Key frames: +0 reads "living room, night, lizard on the ceiling" at once (UT01; LF01 at +20); +17 the tokay already in frame on "ตุ๊กแก"; +105 lands on the feet on "ทุกเส้น".
- Sound: A1 + A2 from +0 (no music); S17 moth flutter loop from +0 at a low level, panned to the lamp; nothing on the tokay (it is still).
- Entry → exit: +0 room wide, WOMAN scrolling → +127 close on the tokay's front feet.

**2. S01-B01-SH02** [128, 184), 56 f. VO C02 +0–+56 (continues into shot 3 to +3; "ห้อย" +16, "หนึ่งคน" +49). *Changed R1.1 (user: the tokay grips the man itself, force first).*
- Camera (W3.1, rig at z 0.38; end camera swung to the room's front left so his feet hang over open floor, not the sofa): `ycam: pos (0.33, 2.42, 1.10) → (−1.50, 1.00, 2.20), look-at (0.33, 2.56, 0.38) → (0.33, 1.50, 0.38), f 1050 → 1000` (the yaw swings about 40° during the pull-back); hold +0–+4, pull back and crane down (ease-out, fast start) +4–+36, hold +36–+55. At +0 ≈ 1415 px/m at the tokay: tokay ≈ 410 px, front feet y ≈ 770 (foot ≈ 35 px), wrists y ≈ 1075, the man's hair crown at the bottom edge (y ≈ 1550; face out of frame). At +36 (measured W3.1, LF05A v11): ≈ 354 px/m at the tokay: tokay 100 px (y 541–617), MAN 704 px (top y 574 → feet y 1278), eyes y 663, floor under him y 1588 (gap 311 px); the sofa screen left of his legs, the coffee table soft lower-left and in front (feet 0.30 m above its top, x 0.33 > table edge 0.25), the fan stand behind his legs with its base hidden by the table. +0 values are pinhole estimates (Film, `est`); Boss measures with `scripts/shot-projection.py`.
- Staging: R, imagined grade (snap in +0–+3), no woman, sofa empty, on [hang rig H](film-brief.md#hang-rig-h). +0 matches shot 1's end framing (same scale, feet centred; a framing match, rig H is 0.5 m in front of T0, see [H2](#w5-handoff-notes-film)): the tokay `hang-front`, hanging head-up from its two front feet (all ten toes splayed and pressed flat, forelimbs straight, body pulled long and straight), belly to the lens, calm (`rest` face, one slow blink +8); its hind feet clasp the man's two wrists; the tail hangs free behind his hands, touched by nothing. The pull-back follows the line of force: feet → wrists → MAN (`front`, `new: hang-held-wrists`, `scared`, legs dangling) → the floor gap under his shoes. Two small leg kicks (+22, +40); after each the man and the tokay sway together ±2° about the front-foot line and settle within 12 f (by +52), the front feet locked (≤ 2 px drift). "ภาพจำลอง" in LBL from +0.
- Key frames: +0 the feet hold (force first); +16 "ห้อย" wrists, his head and torso in frame (the hang reads); +36 the whole man and the floor gap; +49 "หนึ่งคน" held wide; +55 last frame (hard cut back; the last 3 f of "คน" run over the snap back).
- Sound: S4 swish at +0 (Editor may pre-roll 3 f); S3 held-breath swell +0 → cut dead at +56; S2 grip strain at +22 and +40 (revised R1.1: no rope); A1 imagined (−10 dB, low-passed), A2 out.
- Entry → exit: +0 imagined, close on the front feet → +55 the whole hang, low wide.

**3. S01-B01-SH03** [184, 257), 73 f. VO C02 tail +0–+3; C03 +19–+73 (continues into shot 4 to +9; "กาว" +48, "ไม่มีแรงดูด" +60).
- Camera (W3, mirrored to the sofa side so the hero front-left foot is the near foot; = LF02): `ycam: pos (0.34, 2.36, 0.12) → (0.305, 2.667, −0.315), look-at (0.33, 2.70, −0.16) → (0.315, 2.671, −0.18), f 1000, end hy 860, near 0.01`; hold +0–+12 (= shot 1's end framing), descend and swing round the tokay's head side +12–+56 (ease; arc the path, see [W5 handoff](#w5-handoff-notes-film) H3), hold to +72. End (measured, LF02 v10): contact y 648, front-left foot 88 px (7390 px/m at the palm), plaster bumps 0.6–1.9 mm stippled.
- Staging: R, real colour back on one frame (snap back). +0–+12 the real feet, no man. The tokay card changes view `dorsal` → `left` profile as a cut-on-move at +30 (the camera passes the ceiling's grazing angle). End: the front-left foot pressed flat on the rough plaster, toes splayed, pads dry and flat (no blob, no shine, no dome); the plaster bumps throw tiny shadows in the raking lamp light; the hind foot soft behind with two toe tips lifted (K02 clear); a corner of the lamp's glow at frame left.
- Key frames: +12 the move starts; +48 "กาว" the dry pad reads; +60 "ไม่มีแรงดูด" the flat pad reads (LF02).
- Sound: A1 + A2 back on +0 (one frame); **M1 enters on +19** with a light pizzicato pick-up (energy 1.5); S17 moth faint.
- Entry → exit: +0 feet from below → +72 ceiling-level side view of the pressed foot.

**4. S01-B01-SH04** [257, 297), 40 f. VO C03 tail +0–+9; V01 voice +16–+23 (file from +8).
- Camera: `ycam: pos (−0.30, 0.70, 0.30) → (−0.30, 0.71, 0.25), look-at (−0.35, 1.05, −0.80), f 1000`; head ≈ 365 px, face y ≈ 900.
- Staging: R, real. WOMAN `front`, phone at her chest; +4–+14 her eyes then head lift to the ceiling (look up 25°); `neutral` → `surprised` at +14; V01 at +16 (Despina, 7 f); the thought bubble (BUB, cloud-edged, her-thought grade inside) pops in at +22 above screen right of her head with a tiny red plunger in it.
- Key frames: +14 looking up; +16 "เอ๊ะ?"; +22 bubble.
- Sound: S5 `ui_pop_01` at +22; M1 holds a two-note question figure.
- Entry → exit: +0 face down to the phone → +39 looking up, bubble open.

**5. S01-B02-SH01** [297, 389), 92 f. VO C04 +4–+77 ("ฝุ่น" +32, "อยู่ไม่ได้" +59).
- Camera: `ycam: pos (0.00, 2.55, 0.42) → (0.00, 2.56, 0.38), look-at (0.00, 2.68, 0.38), f 1000` (slow push). Plunger cup 0.12 m ≈ 600 px wide.
- Staging: R ceiling at the dust ring (0.38 m from the lamp), her-thought grade, cloud-edged frame (the bubble filling the screen). +0–+8 the red plunger rises into frame and **thwops** onto the plaster (+8); +8–+33 close on the rim: grit specks and plaster bumps prop it, a thin line of lamp light shows under it (gap ≥ 6 px) on "ฝุ่น" (+32); +32–+56 air leaks in, the rim lifts at one side; +59 on "อยู่ไม่ได้" it drops out of frame bottom; +83 the bubble pops (edge collapses to a point) to the cut.
- Key frames: +8 thwop; +32 gap reads; +59 drop; +83 pop.
- Sound: S6 thwop at +8; S7 leak hiss from +36, slip +54, drop away +59–+79; S5 `ui_pop_01` at +83; M1 playful (energy 2); A1 at −12 dB.
- Entry → exit: +0 empty dusty plaster (thought) → +91 bubble gone (white flash 2 f, +90–+91).

**6. S01-B02-SH02** [389, 500), 111 f. VO C05 +3–+90 ("เดิน" +20, "ฝุ่นร่วง" +49, "ก้าว" +83).
- Camera: `ycam: pos (0.27, 2.15, −0.26), look up (pitch +88, −90 avoided), f 900`, slow roll 0 → 4°; ≈ 1640 px/m at the ceiling: tokay ≈ 475 px, path T0 → T1 ≈ 720 px.
- Staging: R, real, looking straight up at the plaster: the dust ring fills the frame, the lamp's glow at screen right. The tokay (`dorsal`) walks T0 → T1, diagonal gait, 9 foot-falls (+12 to +83, every 9 f, the last on "ก้าว"); each lifted foot peels toe-tips-first; from +48 each lift drops 3–6 specks that fall toward the lens, growing and glinting; by +83 one or two specks still cling to two toes (partial). The moth crosses the frame edge once (+60). At T1, still, from +90.
- Key frames: +20 "เดิน" walking; +49 "ฝุ่นร่วง" first clear fall; +83 "ก้าว" last step; +90 at T1, still.
- Sound: S1 step ticks at +12, +21, +30, +39, +48, +57, +66, +75, +83; S8 dust falls at +48, +57, +66, +75, +83; M1 (1.5).
- Entry → exit: +0 the tokay at T0 on the dust → +110 at T1, specks settling.

**7. S01-B03-SH01** [500, 643), 143 f. VO C06 +12–+129 ("ขน" +36, "สี่เท้า" +83, "หลายล้าน" +109).
- Camera: `T (mm): pos (0, −60, 0) → (0, −4, 1.5), look-at the pad of toe 3, f 1000`; loupe-in +12–+28 (into toe 3) and +30–+40 (into one ridge); skim +83–+142 at 0.3 mm over the hair carpet, pitch −12 → −4 (rows run to a soft horizon). At +0 the foot's pad ≈ 420 px across.
- Staging: the front-left foot lifted mid-step and held (staged, D06), its pad toward the lens: five splayed toes with pale ridges; the room behind as warm bokeh (lamp disc). "ภาพจำลอง" in LBL from +0. +36 hairs fill the frame on "ขน": a dense brush in rows; +83 on "สี่เท้า" the camera rises over the carpet; +109 "หลายล้าน" rows to the horizon.
- Key frames: +28 one toe; +40 one ridge; +36–+50 hairs resolve; +80 LF03; +109 the endless carpet.
- Sound: S9 dive whoosh +0–+30 (it starts in the gap before the VO at +12); A1 ducks to H1 `room_studio-hush_01` from +10; M1 thins to the pizzicato figure (1).
- Entry → exit: +0 the lifted pad → +142 skimming the hair carpet.

**8. S01-B03-SH02** [643, 730), 87 f. VO C07 +3–+65 ("ปลายแตก" +24, "หลายร้อย" +44).
- Camera: `U (µm): truck y 20 → 115 along the hero hair, distance 60, f 1000`, slight arc 0 → 10°.
- Staging: one hero hair (5 µm wide) among softer neighbours, side view; near its end it branches (about 4 branches, then hundreds of stalks) and fans into flat tips from +24; about 200 tips visible by +44, catching the warm rim light. LBL on.
- Key frames: +24 the split; +44 the full fan.
- Sound: S10 `reveal_glass-shimmer-soft_01` at +24; H1; M1 (1.5).
- Entry → exit: +0 the hair's shaft → +86 the fanned tips, still.

**9. S01-B03-SH03** [730, 792), 62 f. VO C08 first half +4–+50.
- Camera: `ycam: pos (−0.25, 1.05, 2.20) → (−0.15, 1.05, 2.22), look-at (−0.25, 1.05, 2.58), f 1000` (slow truck right); ≈ 2600 px/m.
- Staging: R, real. The off TV's black glass fills the frame: fluff, a lint fibre (≈ 50 px), dust specks clinging; a faint reflection of the lamp streak and the room with her small silhouette on the sofa (15 % overlay). The TV's bezel edge at screen left as the size reference. No link to the hairs (R02).
- Key frames: +4 reads "dusty TV screen" at once.
- Sound: A1 full at +0, mains hum layer `electric_streetlamp-hum-loop_01` at about −30 dB; M1 low.
- Entry → exit: +0 dusty glass → +61 same, moved right.

**10. S01-B03-SH04** [792, 883), 91 f. VO C08 second half +4–+73 ("แต่" +4, "กลับหัว" +50).
- Camera: `ycam: pos (−0.25, 1.15, −1.12) → (−0.25, 1.17, −1.10), look-at (0.10, 2.40, −0.35), f 900`; her head y ≈ 950–1150, the tokay ≈ 160 px at y ≈ 330.
- Staging: R, real. WOMAN `back` (P31, phone lowered to her lap), the back of her head and shoulders lower-middle; above, the tokay hanging still at T1 (`dorsal`), the lamp pool beside it. On "กลับหัว" (+50) she tilts her head (`headCock` 0 → +12 over +46–+58); held to the cut.
- Key frames: +50 head tilt.
- Sound: A1 + A2; M1 question figure (two plucks rising) on +50.
- Entry → exit: +0 looking up → +90 head tilted.

**11. S01-B03-SH05** [883, 963), 80 f. VO C09 +3–+69 ("แนบชิด" +27, "ผิวเพดาน" +51).
- Camera: `U (µm): pos (0, 80, 70) → truck x +20, look-at the contact line, f 1000`; contact line y ≈ 420.
- Staging: micro section: the plaster's bumpy underside along the top (bumps 2–6 µm, dips between); a row of hairs rises from below with their tip fans; on "แนบชิด" (+27) the tips settle along the bumps and into the dips, conforming; by +51 the whole row is in close contact. LBL on.
- Key frames: +27 tips settle; +51 full contact.
- Sound: H1; S11 tips settling +22–+64; M1 (1.5).
- Entry → exit: +0 tips just below the plaster → +79 tips pressed into it.

**12. S01-B03-SH06** [963, 1096), 133 f. VO C10 +3–+122 ("ดึง" +34, "นับพันล้าน" +67, "แรงมาก" +110).
- Camera: starts as shot 11's end (`U`), then reverse loupes: `U → T` +67–+85, `T` pull-back +85–+100, `T → R` +100–+115, ends `R: pos (0.33, 2.55, −0.02), look-at (0.33, 2.70, −0.16), f 1000`.
- Staging: +34 on "ดึง" one glint and a tiny amber pull-line where one tip touches; +34–+67 glints spread across the field; +67 on "นับพันล้าน" the camera pulls back through every scale as glints multiply into a glowing field over the whole carpet, then the toe, then the foot; +110 on "แรงมาก" one warm line runs from the foot up into the ceiling; LBL off at +115 (the room).
- Key frames: +34 first glint; +45 LF04; +67 pull-back starts; +110 one strong line; +115 the room.
- Sound: S12 glints gathering +34–+126 (the low swell firming at +110); S19 zoom-out whooshes on each loupe-out (+67, +100); M1 lifts (2.5) at +67.
- Entry → exit: +0 tips in contact (µm) → +132 the foot on the ceiling, glowing line fading.

**13. S01-B03-SH07** [1096, 1162), 66 f. VO C11 +3–+52 ("ยิ่งเกาะ" +30).
- Camera: `ycam: pos (0.14, 2.63, 0.05) → (0.14, 2.62, 0.30), look-at (0.14, 2.68, −0.40), f 1000` (pull back); tokay ≈ 640 → 460 px long.
- Staging: R, ceiling-level side view: the whole tokay upside down at T1 in profile, all four feet pressed flat, the plaster edge-on above. On "ยิ่งเกาะ" (+30) it braces: pads flatten, body dips 2 mm, holds.
- Key frames: +30 brace; +52 held.
- Sound: A1 back at +0; **S13 `stinger_low-muted-hit_01` at +30** on M1's downbeat (energy 3).
- Entry → exit: +0 close profile → +65 whole tokay, firm.

**14. S01-B04-SH01** [1162, 1248), 86 f. VO C12 +3–+69 ("เกาะแน่น" +19, "เดิน" +55).
- Camera: `ycam: pos (0.90, 0.72, 0.15) → (0.88, 0.74, 0.10), look-at (−0.25, 1.70, −0.45), f 900`; her head ≈ 350 px at y ≈ 1000, the tokay ≈ 120 px in the upper third.
- Staging: R, real. WOMAN in profile facing screen left, P32 lean with head raised (`suspicious`), leaning in over +3–+19; the tokay above at T1 starts to walk toward T2 on "เดิน" (+55).
- Key frames: +19 lean complete; +55 first step.
- Sound: M1 figure returns a touch faster at +3 (2); S1 steps at +55, +65, +75; A1 + A2.
- Entry → exit: +0 sitting back → +85 leaning in, the tokay walking.

**15. S01-B04-SH02** [1248, 1325), 77 f. VO C13 +3–+64 ("ม้วน" +10, "ลอกเทป" +50).
- Camera (W3 mirror as shot 3's end, est): `ycam: pos (0.29, 2.667, −0.315), look-at (0.30, 2.671, −0.18), f 1000, hy 860, near 0.01`, slow truck x −0.01 m; foot ≈ 180 px; tape strip 18 mm ≈ 130 px wide.
- Staging: R, ceiling-level side close: the front-left foot planted (same framing family as shot 3's end), a cream masking-tape strip stuck on the ceiling 30 mm beside it, its free end pinched down. On "ม้วน" (+10) the toes roll up and back from the tips in staged slow motion (roll 0 → 1 over +10–+50), the tape's free end curling back in sync with the same radius; the curled toe shape matches K02 from shot 3.
- Key frames: +10 roll starts; +30 roll 0.5 (SP1 still); +50 "ลอกเทป" both peeled.
- Sound: S14 tape peel, slowed, +10–+64; A1 −4 dB; M1 (2).
- Entry → exit: +0 foot planted, tape flat → +76 toes and tape curled back.

**16. S01-B04-SH03** [1325, 1400), 75 f. VO C14 +3–+71 ("หลุด" +39).
- Camera: `T (mm): side of toe 3, pos (6, 3, 20), look-at the ridge line, f 1000` → loupe-out +39–+50 → `R: pos (0.30, 2.62, 0.00), look-at (0.30, 2.68, −0.16), f 1000`.
- Staging: section along toe 3 as it rolls: the rows of hairs let go in sequence from the tip end, their glints going out row by row (+0–+36); LBL +0–+39 (D03); on "หลุด" (+39) the last row lets go and the foot snaps free; in the room the foot lifts, swings and steps on (+50–+74), the tokay walking toward T2.
- Key frames: +16 half the rows released; +39 free; +60 next step placed.
- Sound: H1 +0–+39; glints going out (Editor reverses the head of S12) +0–+32; **S15 `foley_rubber-snap-release_01` at +39**; S19 whoosh-out +39–+50; S1 step at +60; M1 (2.5).
- Entry → exit: +0 rows in contact (mm) → +74 the tokay stepping on (room).

**17. S01-B05-SH01** [1400, 1436), 36 f. W-HANG (no VO). *Changed R1.1 (new hang; the curl framed big).*
- Camera (W3.1: starts on shot 2's new end camera, ends on the LF05B push end moved with the rig): `ycam: pos (−1.50, 1.00, 2.20) → (0.33, 2.40, 0.68), look-at (0.33, 1.50, 0.38) → (0.33, 2.57, 0.38), f 1000 → 1450, hy 800 at the end`; hold +0–+6 (= shot 2's end framing, the callback), whip push swinging to the front axis (ease in-out) +6–+16, see [W5 handoff](#w5-handoff-notes-film) H1, hold +16–+35; end camera = `camLF05B` (pos (0.33, 2.40, 0.68), look-at (0.33, 2.57, 0.38), f 1450, hy 800, near 0.02). End (measured, LF05B v11, unchanged from v10): front feet 51 / 40 px at y 399 (front-right half curled), wrists y 1045, his face out of frame below.
- Staging: R imagined (snap in +0–+3), LBL from +0, rig H. +0–+6 the man dangling (`scared`), the tokay calm; +18–+30 it curls the toes of its whole front-right foot (screen left) from the tips, toe roll 0 → 0.6, the heel pad still down (Q-F2, Boat O6); the front-left foot stays pressed flat with toes splayed, the body does not drop or slide, the hind feet keep his wrists. The read is "it is about to take a step" (the L14 move), not "one toe lets go of everything".
- Key frames: +6 the push starts; +26 LF05 (curl half way, both feet in frame); +30 foot curled, held to +35.
- Sound: S4 swish at +0; A1 imagined; S2 grip strain +4; the S14 head (0.25 s) tick on the curl +18; near silence +18–+36.
- Entry → exit: +0 the whole hang (wide) → +35 close on the front feet, one curled.

**18. S01-B05-SH02** [1436, 1496), 60 f. V02 voice +8–+49 (file from +1; "อย่า" +8, "ปล่อยนะ" +16). *Retimed R2.0: the picked Algenib take is 41 f of voice (R1 est 24 f), so the shot grows 45 → 60 f and the replant moves after the line.* *Changed R1.1 (wrists held by the tokay, no toggle or rope; new camera).*
- Camera (W3.1: +0.5 m z with the rig): `ycam: pos (0.50, 2.05, 1.90) → (0.50, 2.05, 1.87), look-at (0.36, 1.98, 0.38), f 1250` (slight push); ≈ 770 px/m at the tokay: tokay ≈ 220 px, front feet y ≈ 360 (the curled foot ≈ 19 px), wrists y ≈ 545; MAN head ≈ 350 px, eyes y ≈ 960, chin y ≈ 1145 (above the caption band).
- Staging: R imagined, LBL on, rig H. MAN's face and raised arms, his wrists clasped by the tokay's hind feet; the tokay above, hanging by the flat front-left foot with the front-right still curled; +0–+4 his eyes snap up (`shock`); V02 +8–+49 (he holds `shock`, mouth open on the shout, eyes on the foot); +45–+57 the foot uncurls and presses back flat (toe roll 0.6 → 0), the tokay's body easing 1 cm toward it as it replants; `relieved` +53, held to the cut.
- Key frames: +4 eyes up; +8 "อย่าปล่อยนะ!"; +45 uncurl starts; +57 foot back down.
- Sound: V02 in the clear (+8–+49); S16 relieved pluck at +51.
- Entry → exit: +0 looking at the foot → +59 relief.

**19. S01-B05-SH03** [1496, 1534), 38 f. W-MOTH (no VO). *Changed R1.1 (user: the moth flashes in the jaws).*
- Camera: `ycam: pos (0.05, 2.05, 0.45), look-at (0.20, 2.70, −0.20) → (0.11, 2.70, −0.18), f 1000 → 1350`; hold +0–+14, push in on the head (ease-out) +14–+28, hold +28–+37. Start ≈ 1100 px/m at the head: tokay ≈ 320 px; end ≈ 1490 px/m: head ≈ 67 px at (x ≈ 505, y ≈ 955), the moth ≈ 33 px wing to wing, tail tip near the right edge (x ≈ 1060), the lamp core upper left.
- Staging: R real (snap back). The lamp core in frame, the moth orbiting close; the tokay at T2 (`dorsal`); +6–+14 it peels all four feet in quick sequence; +14–+20 lunges to T3, front feet replanting; +20 jaws close on the moth. +20–+31 the moth held whole across the jaws, both pale wings sticking out either side and catching the lamp light, still (no flutter, no legs, no chewing, nothing broken or wet); +31–+35 one throat bob swallows it, the wings slip in; +35 gone, two wing-scale motes drifting down; +35–+37 it settles. Kids-safe: a quick, clean catch, never a close study of the insect.
- Key frames: +20 the catch; +26 the moth reads in the jaws; +33 swallow; +37 settled, no moth.
- Sound: S17 moth flutter up from +0, cut at +20; S18 lunge and jaw tick +6–+24 (tick +20); no chew or swallow sound; M1 resolves to a phrase end by +30 (fallback fade +26–+38); A1 + A2.
- Entry → exit: +0 moth circling → +37 the tokay at T3, no moth.

**20. S01-B05-SH04** [1534, 1738), 204 f. VO C15 +4–+108 ("ไม่ได้ใช้กาว" +71); V03 +111–+144; hold +144–+203.
- Camera: `ycam: pos (−0.05, 0.75, 0.95) → (0.10, 2.00, 0.40), look-at (−0.35, 1.10, −0.80) → (0.10, 2.70, −0.10), f 1000`; hold +0–+50 on her, crane (ease in-out) +50–+108, hold +108–+203. End ≈ 1430 px/m: tokay ≈ 410 px, lamp ≈ 570 px.
- Staging: R real. WOMAN `front` (P31, phone on her lap) looking up; she smiles (`happy`) at +30; the crane rises past the lamp to the tokay at T3 (`dorsal`, `rest`, toe tips lifted again: K02 echo), moth gone, fan turning. On V03 (+111) its throat pulses and the jaw opens on each syllable; hold with ambient motion only (fan, cobweb strand, a breath in the flank).
- Key frames: +30 smile; +71 "ไม่ได้ใช้กาว" crane mid-way; +108 settled on the tokay; +111 call; +144 hold starts; +203 last frame.
- Sound: A1 + A2 (room only, no music); V03 at +111 in the clear; A1 + A2 fade to −∞ over +174–+203; no loop seam.
- Entry → exit: +0 her upturned face → +203 the tokay by the lamp, still.

## Acceptance (timed checks for W5 and W6)

- Length 1738 f = 57.93 s (40–60 s); every cue inside the shot ranges of the cue table (C02, C03 and C08 cross a cut exactly as listed); longest answer L10 onset f886 to L13 onset f1165 = 9.31 s < 10 s.
- Narration placed in five segments at the offsets of [Units](#units-clocks-and-conventions): line onsets land on the cue table frames ±1 f; V01 voice at f273, V02 voice [1444, 1485) inside shot 18, V03 onset f1645.
- Word pegs: Editor checks the `interp` pegs of the [word-peg table](#word-pegged-key-frames-r20) by ear on the draft; a picture beat more than 3 f off its word moves to the word (the audio does not move).
- Shot 1 +0 nameable as "living room at night with a lizard on the ceiling" by a fresh viewer (viewer check, UT01); the tokay ≥ 100 px at +0 and reads as a tokay at 270 px (blue-grey, orange spots).
- K02 visible on the hind toes in shot 3's end; K01 dust ring visible in shots 1, 5, 6; K03 moth visible in shots 1, 3 (corner), 6, 19.
- Pads flat and dry in every contact view (shots 3, 13, 15 start); no glue blob, shine, strand or dome.
- Labels exactly per the text table; no number anywhere.
- WOMAN seated ≥ 480 px and face above y 1160 in shot 1; MAN ≥ 700 px at shot 2's end and shot 17's start with the floor visible under his feet.
- Imagined hang (shots 2, 17, 18; R1.1): no sling, rope or prop; both front feet flat and splayed on the plaster at shot 2 +0 (tokay ≥ 400 px); the hind feet on his wrists in every frame; the tail free; in shot 17 the curling foot ≥ 40 px and the other front foot flat throughout; the man's face out of the caption band.
- Shot 19 (R1.1): the moth readable in the jaws +20–+31 (≥ 30 px wing to wing), whole and still, no chewing; gone from +35.
- Caption band per the [caption-zone rule](film-brief.md#caption-zone-rule) on every shot (clean frames, `scripts/caption-zone.py --band 1176:1344`).
- Feet on the ceiling plane (≤ 2 px drift on held frames); seek parity on shots 6, 12, 16.
- The closed hold ≥ 60 f after V03 with ambient motion (no frozen tail).

## Dependencies and open items

- Boss: N1–N12 in the brief ([New assets](film-brief.md#new-assets-and-missing-capability-boss-dependencies-w52)); spikes SP2–SP4; Film writes the tokay (N1) and the look of N2/N3 at W3.
- Ton: M1, A1, A2, V03, S1–S3, S6–S9, S11, S12, S14, S16–S19 (NEEDS-GEN); library checks for S4, S5, S10, S13, S15, H1 and the mains hum.
- Editor: V01 = Despina and V02 = Algenib (user picks W4.2); narration not listened yet (listen at W5 with the draft); places the narration segments and the character files per the cue table.
- Boat: picture checks B-P1–B-P9 (brief handoff; B-P5 revised and B-P8, B-P9 new in R1.1).

### W5 handoff notes (Film)

- **H1 B05-SH01 swing (shot 17 +6–+16).** The camera travels from the shot 2 end wide (`camLF05A`: pos (−1.50, 1.00, 2.20), look-at (0.33, 1.50, 0.38), f 1000, default hy) to the curl close (`camLF05B`: pos (0.33, 2.40, 0.68), look-at (0.33, 2.57, 0.38), f 1450, hy 800, near 0.02) in 10 f: about 2.7 m of travel, a yaw swing of about 40° onto the front axis, the eye rising 1.40 m, f and hy changing together. Recommended: interpolate as an orbit about the moving look-at (yaw, distance, eye height eased in-out together, look-at from his chest to the front-foot line), not a straight line in `pos`, so the lens never passes closer than 0.30 m to his head or raised arms; f and hy ease with the same curve; up to 3 f of directional smear on the fastest frames (+9–+13) is allowed and wanted. Acceptance: +0–+6 identical to shot 2's last frame (the callback); +16 identical to LF05B v11 (front feet 51 / 40 px at y 399, wrists y 1045); no in-between frame where his body fills more than half the frame sharp, and the floor never shows through the ceiling. Fallback if the orbit reads messy: hold the wide to +10, a whip-pan smear +10–+12 and a straight cut into a 4 f push ending on LF05B (same end frame, same sound). S4 swish stays at +0; Editor may move it to +6 with the move.
- **H2 Rig z 0.38.** Hang rig H sits at z 0.38 (W3.1, user Q-F6): wrists (0.33, 2.48, 0.38), front feet (0.30 / 0.36, 2.70, 0.38). The single source is `RIG_Z` / `RIG_H` in [src/painted/edu15/palette.ts](../../../src/painted/edu15/palette.ts); shots 2, 17, 18 and TK7 read it, so the shot code must take the rig from there, not from the brief's older R1.1 numbers (z −0.12). The real tokay marks T0–T3 do not move. Consequence: the shot 1 → shot 2 cut is a framing match (same scale, feet centred, imagined grade snaps in), not the same plaster point (rig 0.50 m in front of T0); Boss keeps the lamp out of shot 2 +0's frame or at the same screen side as shot 1's end so the match holds. Shot 18's camera already includes the +0.5 m (pos z 1.90).
- **H3 Shot 3 path.** The W3 mirror moves the end camera to the tokay's sofa side (z −0.315) while the start is shot 1's end (z 0.12): a straight line passes about 0.2 m under the tokay's body. Arc the path round the head side (lower first, then rise to 2.667 at the end) so the body never crosses the near plane; the cut-on-move to the `left` profile stays at +30.
- **H4 Timing risks.** (1) Shot 2 is 56 f: "หนึ่งคน" (+49, interpolated) leaves 7 f before the snap back, and "คน" runs 3 f into shot 3; if the ear check puts the word later than +51, hold the wide and push the snap back to the word end (shot 2 and 3 split moves, shot 3 shortens; no other shot moves). (2) Shot 18 grew to 60 f for the 41 f V02 take; the replant now follows the line. (3) Shot 16 shrank to 75 f: the row release (+0–+36) and the room step (+50–+74) are tighter than R1.3; the snap S15 sits on "หลุด" (+39, interpolated). (4) The narration is not listened; every `interp` word peg is ±0.15 s (about ±5 f).

### Open questions

None open. Answered 2026-11-10 (user, review pages): **Q-F1** changed (the tokay grips the man itself, force first; shots 2, 17, 18); **Q-F2** ok (a whole front foot curls); **Q-F3** ok (tape beside the toe in one frame); **Q-F4** changed (the moth shows briefly in the jaws, shot 19); **Q-F5** default (head-up from the front feet, user passed R1.1); **Q-F6** move the hang point forward (ROWS-R1.3), new LF05A camera approved. All looks and shots passed (ROWS-R1.3, "ผ่านหมด").

## Change log

| Revision | Date | Author | Change |
| --- | --- | --- | --- |
| EDU-EP15-ROWS-R2.0 | 2026-11-10 | Film | W4 timing re-peg on the voice lock (narration W4.1 Kore read, V01 Despina, V02 Algenib): line edges re-measured from speech energy (Whisper onsets at L02, L08, L10, L12, L15 were 0.15–0.24 s early), character takes measured; every shot range, cue, text range, word peg and shot-local key frame pegged, offsets kept (0.30 / 1.00 / 1.40 / 1.70 s; L16 5.8257 s = shot 20 +4). Total 1738 f = 57.93 s (R1.3 est 1729 f); shot 18 45 → 60 f (V02 voice 41 f), replant after the line; longest answer 9.31 s. W3/W3.1 cameras folded into shots 1, 3, 15, 17 (LF01 hy 860, LF02 mirror, LF05B end). New sections: measured line edges, word-peg table, W5 handoff notes H1–H4 (B05-SH01 swing, rig z 0.38, shot 3 path, timing risks). Story timing, reveals, IDs, staging and sound designs unchanged. Status ready-for-dev (timing). Rows R2.0 timed. Review page: pending. |
| EDU-EP15-ROWS-R1.3 | 2026-11-10 | Film | User Q-F6 (R1.2 page): hang rig H and the hanging tokay moved 0.5 m forward (z −0.12 → 0.38, brief [hang rig H](film-brief.md#hang-rig-h), W3.1 note); cameras of shots 2, 17, 18 moved with it. The move alone left his feet over the sofa seat in the shot 2 end wide (feet 0.70 m level with the sofa back 0.72 m), so the shot 2 end / shot 17 start camera swings to the room's front left (pos (−1.50, 1.00, 2.20), look-at (0.33, 1.50, 0.38), f 1000). Q-F6 removed; `changed` on S01-B01-SH02 and S01-B05-SH01; LF05A, LF05B and TK7 images to `v11-clean`. |
| EDU-EP15-ROWS-R1.2 | 2026-11-10 | Film | Look frames added to review-rows.json (LF01-LF05B, SP1 tokay sheet, TK elements; Q-F2/Q-F3/Q-F5 answered and removed, Q-F6 new). Shot plan changes from the W3 findings, recorded as `changed` on S01-B01-SH01, SH02, SH03, S01-B04-SH02, S01-B05-SH01: (1) B01-SH01 start hy 960 -> 860 (phone and chest above the caption band); window moved to the back wall x 0.95-1.85 (UT01 night read), calendar to (-1.55, 1.5). (2) B01-SH03 / B04-SH02: the brief camera sits on the tokay's right, hiding the hero front-left foot; mirrored to the sofa side, pos (0.305, 2.667, -0.315) -> (0.315, 2.671, -0.18), f 1000, hy 860, near 0.01 (eye at body height, plaster edge-on). (3) B01-SH02 end: eye 1.10 -> 1.35 m (pos (0.30, 1.35, 2.00) -> (0.33, 1.45, -0.12)); the kit 4-head MAN hangs with feet 0.70 m above the floor (brief 0.46), at the sofa-back height, so his feet read as standing on the sofa (open, Q-F6); hands 0.06 m apart, no crossed forearms; floor shadow added. (4) B05-SH01 push end: pos (0.33, 2.40, 0.18) -> (0.33, 2.57, -0.12), f 1450, hy 800 so each front foot >= 40 px with the wrists above y 1160; MAN in the picture plane through the wrists (his feet are behind the lens). (5) Caption band: calm band levels per still in `look.tsx` CALM (0.24-0.74). |
| EDU-EP15-ROWS-R1.1 | 2026-11-10 | Film | User review of R1.0 (structured answers on the review page): 19 shots ok; Q-F2, Q-F3 ok. Q-F1 change: shots 2, 17, 18 rebuilt on the brief's hang rig H (the tokay hangs from its two front feet and clasps the man's wrists with its hind feet; sling, rope, toggle dropped; MAN pose `new: hang-held-wrists` supersedes `hang-two-hands`); shot 2 now opens close on the feet and pulls back along the line of force; shot 17 pushes from shot 2's end to the feet so the whole-foot curl reads (≈ 48 px foot) while the other foot stays flat; shot 18 new camera keeps his face above the caption band. Q-F4 change: shot 19 pushes in on the head and shows the moth whole in the jaws for 11 f, then one swallow. Shot IDs, ranges, cue table, text ranges and total (1729 f, 57.63 s est) unchanged: no timing was forced. Rows: `changed` on the four shots, Q-F1/Q-F4 removed as answered, Q-F5 added. Sizes are pinhole estimates. |
| EDU-EP15-ROWS-R1.0 | 2026-11-10 | Film | First storyboard pass (W2.2) on brief EDU-EP15-BRIEF-R1 and script R2: 20 shots, 1729 f = 57.63 s est from the W1.4 read (offsets 0.30 / 1.00 / 1.40 / 1.70 / 5.50 s), cue table C01–C15 + V01–V03, text ranges, rules R01–R08, per-shot camera, staging, key frames and sound, acceptance, Q-F1–Q-F4. Review rows written untimed. |
