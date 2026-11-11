# Storyboard — EDU-EP15-SHORT (timed scene sheet)

Deliverable: `EDU-EP15-SHORT` · Revision: **EDU-EP15-ROWS-R2.3 (timed scene sheet, re-pegged to the C1 narration read)** (Film, 2026-11-10: R2.2 with every range, cue, word peg and changed shot-local key frame re-pegged to the user-approved C1 read, see [R2.3 re-peg](#r23-re-peg-c1-read); story order, reveals, IDs, staging, cameras and sound designs unchanged; R2.2: R2.1 plus the [W5-F1 round-2 verdicts](#w5-f1-round-2-verdicts-r22); R2.1: R2.0 plus the [W5 review decisions](#w5-review-decisions-r21) on Boss's W5.2 build, which win over the shot blocks below where they differ; R2.0: every shot range, cue and shot-local key frame pegged to the W4 voice lock; staging, cameras and sound designs are the user-passed R1.3 text, with the W3/W3.1 camera findings folded into the shot blocks) · Status: **ready-for-dev (timing)** for Boss's W5 shot code and Ton's cue sheet; not a user approval, not runtime or audio proof · Timing: **audio-measured** on the locked narration (line edges from speech energy ±0.03 s; word pegs inside a line syllable-interpolated between energy anchors ±0.15 s, see [Word pegs](#word-pegged-key-frames-r20); narration **not listened**; V01/V02 picked by ear by the user).
Inputs: [script.md](script.md) EDU-EP15-SCRIPT-R2 (user-approved 2026-11-10) · [fact-check.md](fact-check.md) R1 + R2 recheck · [film-brief.md](film-brief.md) **EDU-EP15-BRIEF-R1.2** · narration **R2.3: C1 read** `out/edu15/narr-samples/ep15_nar_kore_C1_fullread.wav` (51.40 s, no atempo, user-approved by ear 2026-11-10; store filing pending, Editor) (superseded W4.1 lock: store `projects/edu/EDU/audio/2026-11-10_ep15-nar-kore-fullread.wav`, 49.20 s; [measure.json](measure.json)) · V01 `projects/edu/EDU/audio/2026-11-10_ep15-char-v01-b-despina.wav` · V02 `projects/edu/EDU/audio/2026-11-10_ep15-char-v02-c-algenib.wav` (user picks W4.2) · task [task.md](task.md) · delivery record [../delivery.md](../delivery.md).
Target: this worktree, branch `claude/c43-education-concept-300411` at `7e01220` (+ uncommitted EP15 work: `src/painted/edu15/` look frames v10/v11) · 30 fps · **durationFrames 1793 (59.77 s)** (R2.2: 1738) · 1080×1920 · composition offset 0 (one scene, S01).
Evidence: look frames LF01–LF05B and tokay stills TK1–TK8 painted (v10, LF05A/LF05B/TK7 v11) and passed by the user 2026-11-10 ("ผ่านหมด", ROWS-R1.3); no shot rendered, no blockout, no seek-parity render; timing measured from the audio files (not listened); viewer check not yet run.
Rows file: [review-rows.json](review-rows.json) **EDU-EP15-ROWS-R2.3** (R2.3: every shot `start`/`end` re-timed to the C1 read, `facts` length and `lede` updated; titles, `seen` and `sound` unchanged, so saved answers survive; draft clips are from the R2.2 cut until Editor rebuilds them; R2.2: shot 9 `seen`, `title` and `changed` updated for the brighter dusty glass, so the page asks shot 9 again; R2.1: shot 9 `seen` text and `changed` note updated for the W5 fix, so the page asks shot 9 again; R2.0: timed: `start`/`end` on every shot, `untimed` removed, R1.3 `changed` notes removed as passed; text unchanged, so saved answers survive). Review page: pending.

## Units, clocks and conventions

- Clocks: **global** `f` = composition frame (= scene-local, offset 0); **shot-local** `+n` = `f − shot start`. Ranges are half-open `[start, end)`; a shot's last frame is `+len−1`. Read time `t` (seconds in the locked narration WAV) → global frame = `round((t + offset) · 30)`, R2.3 (C1 read, 51.40 s): offset **0.30 s** for L01–L03 (lead-in), **1.00 s** for L04–L05 (V01 slot 0.70 s), **1.40 s** for L07–L08 (zoom gap 0.40 s), **1.70 s** for L09–L12 (TV-cut gap 0.30 s), **1.41 s** for L13–L15 (the breath before L13 cut out: read 38.70–38.99 s dropped, −0.29 s), **5.5577 s** for L16 (W-HANG + V02 + W-MOTH: L16 onset pinned to shot 20 +4 = f1592). The narration is one file placed in six segments: cut it in silence at 9.48 s (before L04), 16.09 s (before L07), 23.99 s (before L09), 38.70 s and 38.99 s (around the L13 breath; 38.70–38.99 is not placed) and 47.21 s (before L16), and start each segment at its offset (segment starts: read 0.00 → 0.30 s, 9.48 → 10.48 s, 16.09 → 17.49 s, 23.99 → 25.69 s, 38.99 → 40.40 s (= the end of the L09–L12 segment, no overlap), 47.21 → 52.7677 s). No gap is added between L10 and L13: the longest answer is **9.60 s** (L10 onset f931 → L13 onset f1219, limit 10 s; 9.90 s if the breath were kept). *R2.2 (W4.1 read): 0.30 / 1.00 / 1.40 / 1.70 / 5.8257 s, cuts 8.80 / 15.31 / 22.49 / 45.14 s, longest answer 9.31 s.*
- Character takes (ffmpeg silencedetect −35 dB / 0.06 s, file seconds): **V01** Despina "เอ๊ะ?" file 0.84 s, voice 0.256–0.483 s (7 f); **V02** Algenib "อย่าปล่อยนะ!" file 1.84 s, voice 0.227–1.602 s (41 f; a 0.08 s dip at 0.411–0.489 s between "อย่า" and "ปล่อยนะ"). Files are placed by their voice onset (table below).
- Spaces and axes as in the brief's [projection contract](film-brief.md#projection-contract-and-scale-baseline): `R` room (m; origin on the floor below the lamp centre, +x right seen from the TV side, +y up, +z toward the TV wall; ceiling y 2.70), `T` toe macro (mm; origin at toe 3's pad centre of the front-left foot, +x toward the toe tip, +y out of the pad), `U` micro (µm; origin at the hero hair's base, +y along the hair toward the surface). Camera lines give `pos` (camera position) → `look-at` and the focal length `f` in px (1080-wide frame); the heading convention of `ycam.ts` is not restated here: the look-at point governs. `near` per the brief.
- Screen: pixels, origin top-left, y down. Caption band y 1176–1344; faces, contacts, the tokay's head and feet, labels and the bubble above y 1160 ([caption-zone rule](film-brief.md#caption-zone-rule)); label slot LBL (816–1020, 148–204) for "ภาพจำลอง"; bubble slot BUB x 520–1020, y 220–760; `@TamMaiLa` top-left (x < 330, y < 140 kept clear). Lead sizes are computed (px/m = f / distance), not rendered.
- In shot headers `VO C05 +3–+90` means shot-local voice range [3, 90) of cue C05; word onsets in brackets.
- Values in Camera/Staging are design `est` unless marked `measured`; every frame number below is an integer on the measured timeline (R2.0).

## Casting

| Role | Casting line | Notes |
| --- | --- | --- |
| WOMAN | `woman-curly + home-lounge, new: sit-phone, neutral` | 1.62 m, mid-forties; mark W0 on the sofa (hips (−0.35, 0.30, −0.75), head ≈ (−0.35, 0.98, −0.80)), facing +z. Poses: `new: sit-phone` (P31 body, phone in both hands at the chest) → head up → P31 back view with `headCock` +12 → **P32** profile lean with head raised (`new: sit-lean-look-up` if P32 cannot lift the head) → P31 front, phone on the lap. Faces: `neutral` → `surprised` → `suspicious` → `happy` |
| WOMAN voice | V01 "เอ๊ะ?" = Despina, `projects/edu/EDU/audio/2026-11-10_ep15-char-v01-b-despina.wav` (user pick W4.2) | voice 7 f; file start f265 |
| MAN (imagined) | `man-spiky, new: hang-held-wrists, scared` (supersedes `hang-two-hands`, R1.1) | 1.72 m; on the brief's [hang rig H](film-brief.md#hang-rig-h): arms straight up, wrists together at (0.33, 2.48, 0.38) (W3.1, user Q-F6: rig moved 0.5 m forward from z −0.12) held by the tokay's hind feet, head top ≈ 2.18, eyes ≈ 1.98, chin ≈ 1.75, feet ≈ 0.70 m above the floor (kit 4-head MAN, measured W3; brief est 0.46); `front`; faces `scared` → `shock` → `relieved`; never in the real room |
| MAN voice | V02 "อย่าปล่อยนะ!" = Algenib, `projects/edu/EDU/audio/2026-11-10_ep15-char-v02-c-algenib.wav` (user pick W4.2) | voice 41 f; file start f1437 |
| TOKAY | `new: tokay (Gekko gecko: blue-grey, rust-orange and pale spots, yellow slit eyes, banded tail), rest-ceiling` | 0.29 m; on the ceiling belly-up (spotted back toward the room); marks T0 (0.42, 2.70, −0.12) → T1 (0.14, 2.70, −0.40) → T2 (0.30, 2.70, −0.25) → T3 (0.20, 2.70, −0.18); hero foot front-left; views `dorsal`, profile, `front`; states rest (K02), walk, peel, brace, lunge, call; imagined only: `hang-front` (R1.1: hanging head-up from the two front feet on the plaster, belly to the lens, hind feet clasping the man's wrists, tail free) |
| TOKAY call | V03 one "ตุ๊ก-แก" | designed sound (Ton, NEEDS-GEN V03), no subtitle |
| Props | `new: plunger`, `new: tape strip`, `new: moth` (sling, rope and toggle dropped, R1.1) | brief N8–N10 (N7 retired) |
| Kit layers | ENV-GLOW `paintHalo` (lamp halo); grades and thought bubble from EP14 (`edu14/grade.tsx`, `edu14/bubble.ts`, ENV-P01 promotion) | ENV-P02 |

## Shot map

| # | Shot | Beat | Lines | Range (global) | Len | R2.2 len | Start s | Camera | One-line read |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | S01-B01-SH01 | B01 | L01 | [0, 140) | 140 | 128 | 0.00 | low sofa-side wide → crane up | She scrolls on the sofa; a big tokay on the ceiling by the lamp; crane up to its feet |
| 2 | S01-B01-SH02 | B01 | L02 | [140, 204) | 64 | 56 | 4.67 | close on the feet → pull back and down to a low wide | "ภาพจำลอง": the tokay hangs from its front feet and grips a whole man by the wrists |
| 3 | S01-B01-SH03 | B01 | L03 | [204, 277) | 73 | 73 | 6.80 | below → ceiling-level side view | Snap back; the camera rises to the ceiling: a foot pressed flat and dry on rough plaster |
| 4 | S01-B01-SH04 | B01 | V01 | [277, 317) | 40 | 40 | 9.23 | medium close, low | She looks up: "เอ๊ะ?"; a thought bubble with a plunger |
| 5 | S01-B02-SH01 | B02 | L04 | [317, 414) | 97 | 92 | 10.57 | ceiling-level close (her thought) | The plunger thwops on, grit lifts its rim, it drops; bubble pops |
| 6 | S01-B02-SH02 | B02 | L05 | [414, 522) | 108 | 111 | 13.80 | straight up | The tokay walks over the dust; specks fall off step by step |
| 7 | S01-B03-SH01 | B03 | L07 | [522, 684) | 162 | 143 | 17.40 | macro dive (mm) | Under a lifted toe: ridges, then a dense carpet of hairs to the horizon |
| 8 | S01-B03-SH02 | B03 | L08 | [684, 775) | 91 | 87 | 22.80 | micro track (µm) | One hair splits into hundreds of tips |
| 9 | S01-B03-SH03 | B03 | L09 a | [775, 837) | 62 | 62 | 25.83 | close, slow truck | Dust and fluff on the black TV glass |
| 10 | S01-B03-SH04 | B03 | L09 b | [837, 928) | 91 | 91 | 27.90 | over her shoulder, looking up | She tilts her head at the tokay hanging upside down |
| 11 | S01-B03-SH05 | B03 | L10 | [928, 1009) | 81 | 80 | 30.93 | micro section, truck | Tips settle into the plaster's bumps |
| 12 | S01-B03-SH06 | B03 | L11 | [1009, 1155) | 146 | 133 | 33.63 | micro → pull back through every scale | One glint, then a field; they merge into one warm line to the foot |
| 13 | S01-B03-SH07 | B03 | L12 | [1155, 1216) | 61 | 66 | 38.50 | ceiling-level side view, pull back | The whole tokay upside down, bracing, holding firm |
| 14 | S01-B04-SH01 | B04 | L13 | [1216, 1293) | 77 | 86 | 40.53 | low profile two-plane | She leans in; the tokay starts to walk |
| 15 | S01-B04-SH02 | B04 | L14 | [1293, 1376) | 83 | 77 | 43.10 | ceiling-level side close | A toe rolls up from the tip; tape beside it peels the same way |
| 16 | S01-B04-SH03 | B04 | L15 | [1376, 1454) | 78 | 75 | 45.87 | micro section → room | Hairs let go row by row; the foot snaps free and steps on |
| 17 | S01-B05-SH01 | B05 | W-HANG | [1454, 1490) | 36 | 36 | 48.47 | shot 2's end → whip push to the feet | "ภาพจำลอง": the man dangles; the tokay curls one whole front foot, the other stays flat |
| 18 | S01-B05-SH02 | B05 | V02 | [1490, 1550) | 60 | 60 | 49.67 | close from below | His eyes snap up: "อย่าปล่อยนะ!"; the foot settles |
| 19 | S01-B05-SH03 | B05 | W-MOTH | [1550, 1588) | 38 | 38 | 51.67 | up at the lamp, push in on the head | The tokay peels and lunges; the moth flashes in its jaws, then is swallowed |
| 20 | S01-B05-SH04 | B05 | L16, V03, hold | [1588, 1793) | 205 | 204 | 52.93 | her smile → slow crane to the tokay | She smiles; the tokay by the lamp calls; hold |

Total **1793 f = 59.77 s** (R2.3, C1 read; target 40–60 s: pass, 0.23 s margin; limit 63 s; R2.2 was 1738 f, +55 f). Speech ends f1697 (L16); V03 [1700, 1733); closed hold [1733, 1793) = 60 f = 2.00 s. Lengths changed (R2.2 → R2.3): shot 1 128 → 140, 2 56 → 64, 5 92 → 97, 6 111 → 108, 7 143 → 162, 8 87 → 91, 11 80 → 81, 12 133 → 146, 13 66 → 61, 14 86 → 77, 15 77 → 83, 16 75 → 78, 20 204 → 205; shots 3, 4, 9, 10, 17, 18, 19 keep their length and move whole. *R2.2 total (W4.1 read): 1738 f = 57.93 s.*

<a id="measured-line-edges-w4-lock"></a>
## Measured line edges (R2.3, C1 read)

Line edges of the R2.3 narration (Gemini Kore, style C1 "quick, clear", user-approved by ear 2026-11-10; `out/edu15/narr-samples/ep15_nar_kore_C1_fullread.wav`, 51.40 s, 48 kHz mono, −16.08 LUFS, TP −1.5; to be filed in the store by Editor) in read seconds (ffmpeg silencedetect −35 dB / 0.12 s plus a 20 ms RMS envelope; breaths at −40 to −50 dB are not onsets) and their global frames; R2.2 (W4.1 read, 49.20 s) in brackets. Lines run 0–18 % longer (L07 +0.64 s, L11 +0.45 s, L01 +0.37 s); pauses between lines are within ±0.1 s of the old read except L12 → L13 (0.73 s with a breath, cut to 0.44 s). Whisper (large-v3-turbo, per line with the line text as prompt) confirmed every line's words in order; its line onsets were 0.12 s early at L01, L02, L08, L10, L12, L14, L15, L16 and 0.19 s late at L13 (it started on "เกาะ"); the energy edges below win.

| Line | Onset s | End s | Dur s (R2.2) | Global [onset, end) | R2.2 global | Internal pauses (s) |
| --- | --- | --- | --- | --- | --- | --- |
| L01 | 0.274 | 3.971 | 3.70 (3.34) | [17, 128) | [17, 117) | 1.672–1.867 ("คุณ,"), 2.946–3.078 |
| L02 | 4.367 | 6.598 | 2.23 (1.99) | [140, 207) | [128, 187) | — |
| L03 | 7.122 | 9.243 | 2.12 (2.09) | [223, 286) | [203, 266) | (8.384–8.499, 0.12 s: before "ไม่มีแรงดูด") |
| L04 | 9.716 | 12.275 | 2.56 (2.41) | [321, 398) | [301, 374) | 11.443–11.719 |
| L05 | 12.912 | 15.779 | 2.87 (2.88) | [417, 503) | [392, 479) | 14.149–14.469 |
| L07 | 16.396 | 20.944 | 4.55 (3.91) | [534, 670) | [512, 629) | 18.734–19.107 ("…") |
| L08 | 21.491 | 23.701 | 2.21 (2.07) | [687, 753) | [646, 708) | 21.982–22.220 |
| L09 | 24.274 | 28.558 | 4.28 (4.38) | [779, 908) | [734, 865) | 25.877–26.333 ("…", the 9→10 cut) |
| L10 | 29.334 | 31.589 | 2.25 (2.21) | [931, 999) | [886, 952) | — |
| L11 | 32.040 | 36.430 | 4.39 (3.94) | [1012, 1144) | [966, 1085) | 32.841–32.963, 34.154–34.538 ("…") |
| L12 | 36.907 | 38.499 | 1.59 (1.62) | [1158, 1206) | [1099, 1148) | 37.718–37.917 ("…") |
| L13 | 39.232 | 41.167 | 1.94 (2.20) | [1219, 1277) | [1165, 1231) | 39.572–39.772 ("แต่…"); a breath at 38.78–38.97 before the onset (−41 to −50 dB) is cut out |
| L14 | 41.785 | 43.986 | 2.20 (2.01) | [1296, 1362) | [1251, 1312) | 42.815–42.970 |
| L15 | 44.546 | 46.916 | 2.37 (2.29) | [1379, 1450) | [1328, 1396) | 45.413–45.616 ("…") |
| L16 | 47.509 | 51.018 | 3.51 (3.48) | [1592, 1697) | [1538, 1642) | 47.939–48.064, 48.209–48.329, 49.470–49.769 ("…") |

<details><summary>R2.2 line edges (W4.1 read, superseded)</summary>

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

</details>

<a id="voice-and-subtitle-cues-global-measured"></a>
## Voice and subtitle cues (global, measured, R2.3)

Captions = VO, Thai verbatim; one cue per voice run (Editor's caption rules set holds and splits; split only at a word boundary). V03, W-HANG and W-MOTH have no caption.

| Cue | Line | Text | Voice [start, end) | Shot(s) |
| --- | --- | --- | --- | --- |
| C01 | L01 | ตุ๊กแกบนเพดานบ้านคุณ… ถ้าขนที่เท้ามันจับพร้อมกันทุกเส้น | [17, 128) | 1 |
| C02 | L02 | แรงพอจะห้อยคนไว้ได้ประมาณหนึ่งคน | [140, 207) | 2, 3 (+0–+3) |
| C03 | L03 | ทั้งที่เท้ามันไม่มีกาว ไม่มีแรงดูด | [223, 286) | 3, 4 (+0–+9) |
| V01 | V01 | เอ๊ะ? | [293, 300) (caption may hold to 305 for reading) | 4 |
| C04 | L04 | จุ๊บดูดเจอเพดานฝุ่น ๆ แบบนี้ อยู่ไม่ได้หรอก | [321, 398) | 5 |
| C05 | L05 | แต่ตุ๊กแกเดินต่อได้ ฝุ่นร่วงออกทีละก้าว | [417, 503) | 6 |
| C06 | L07 | ใต้นิ้วมัน มีขนเล็ก ๆ เรียงกันแน่น… สี่เท้ารวมกันหลายล้านเส้น | [534, 670) | 7 |
| C07 | L08 | แต่ละเส้น ปลายแตกเป็นหลายร้อยปลาย | [687, 753) | 8 |
| C08 | L09 | ฝุ่นเกาะจอทีวีน่ะเห็นบ่อย… แต่ขนแห้ง ๆ เกาะเพดานกลับหัวได้ยังไง | [779, 908) (runs [779, 827) and [841, 908); the 9→10 cut at 837 sits in the pause) | 9, 10 |
| C09 | L10 | ปลายมันเล็กจนแนบชิดไปตามผิวเพดาน | [931, 999) | 11 |
| C10 | L11 | ชิดขนาดนั้น จะดึงกันนิดนึง… นับพันล้านจุดรวมกันก็แรงมาก | [1012, 1144) | 12 |
| C11 | L12 | ยิ่งแนบชิด… ยิ่งเกาะแน่น | [1158, 1206) | 13 |
| C12 | L13 | แต่… เกาะแน่นขนาดนี้ มันเดินยังไง | [1219, 1277) | 14 |
| C13 | L14 | มันม้วนนิ้วขึ้นจากปลาย เหมือนลอกเทป | [1296, 1362) | 15 |
| C14 | L15 | พอขนไม่แนบชิด… ก็หลุดในเสี้ยววินาที | [1379, 1450) | 16 |
| V02 | V02 | อย่าปล่อยนะ! | [1498, 1539) | 18 |
| C15 | L16 | สัตว์ที่เกาะเก่งขนาดนี้ในบ้านคุณ… ไม่ได้ใช้กาวสักหยดเลย | [1592, 1697) | 20 |
| — | V03 | (tokay call, no caption) | [1700, 1733) (Ton's file, ≈ 1.10 s; Editor fits its onset to f1700) | 20 |

V01 placement: file start f285 (shot 4 +8), voice onset f293 (+16). V02 placement: file start f1491 (shot 18 +1), voice onset f1498 (+8), voice end f1539 (+49). (R2.2: f265/f273, f1437/f1444–1485.)

<a id="word-pegged-key-frames-r20"></a>
## Word-pegged key frames (R2.3)

Every key frame that sits on a spoken word, on the C1 read. `anchor` = the word starts on a measured energy edge (line onset or end of an internal pause, ±0.03 s); `Whisper` = first matched character of the word in a per-line faster-whisper pass (large-v3-turbo, int8, word timestamps; ±0.15 s ≈ ±5 f; it runs up to 0.3 s early on a word right after a pause, which is why those words are anchors). Rule (unchanged): a picture beat within 3 f of its word keeps its R2.2 shot-local frame; a beat more than 3 f off moves to the word (the audio does not move). Editor still checks the Whisper pegs by ear on the draft.

| Shot | Word | Line | Kind | Read s | R2.2 local | R2.3 local | Global | Picture beat |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | "ตุ๊กแก" | L01 | anchor | 0.274 | +17 | +17 | 17 | unchanged |
| 1 | "ถ้า" | L01 | Whisper | 1.694 | +61 | +60 | 60 | keeps R2.2 frame (≤ 3 f) (-1 f) |
| 1 | "ทุกเส้น" | L01 | Whisper | 3.534 | +105 | +115 | 115 | moves (+10 f) |
| 2 | "ห้อย" | L02 | Whisper | 4.907 | +16 | +16 | 156 | unchanged |
| 2 | "หนึ่งคน" | L02 | Whisper | 5.947 | +49 | +47 | 187 | keeps R2.2 frame (≤ 3 f) (-2 f) |
| 3 | "กาว" | L03 | Whisper | 7.962 | +48 | +44 | 248 | moves (-4 f) |
| 3 | "ไม่มีแรงดูด" | L03 | anchor | 8.499 | +60 | +60 | 264 | unchanged |
| 5 | "ฝุ่น" | L04 | Whisper | 10.636 | +32 | +32 | 349 | unchanged |
| 5 | "อยู่ไม่ได้" | L04 | anchor | 11.719 | +59 | +65 | 382 | moves (+6 f) |
| 6 | "เดิน" | L05 | Whisper | 13.352 | +20 | +17 | 431 | keeps R2.2 frame (≤ 3 f) (-3 f) |
| 6 | "ฝุ่นร่วง" | L05 | anchor | 14.469 | +49 | +50 | 464 | keeps R2.2 frame (≤ 3 f) (+1 f) |
| 6 | "ก้าว" | L05 | Whisper | 15.492 | +83 | +81 | 495 | keeps R2.2 frame (≤ 3 f) (-2 f) |
| 7 | "ขน" | L07 | Whisper | 17.296 | +36 | +39 | 561 | keeps R2.2 frame (≤ 3 f) (+3 f) |
| 7 | "สี่เท้า" | L07 | anchor | 19.107 | +83 | +93 | 615 | moves (+10 f) |
| 7 | "หลายล้าน" | L07 | Whisper | 20.056 | +109 | +122 | 644 | moves (+13 f) |
| 8 | "ปลายแตก" | L08 | Whisper | 22.211 | +24 | +24 | 708 | unchanged |
| 8 | "หลายร้อย" | L08 | Whisper | 22.911 | +44 | +45 | 729 | keeps R2.2 frame (≤ 3 f) (+1 f) |
| 10 | "แต่" | L09 | anchor | 26.333 | +4 | +4 | 841 | unchanged |
| 10 | "กลับหัว" | L09 | Whisper | 27.554 | +50 | +41 | 878 | moves (-9 f) |
| 11 | "แนบชิด" | L10 | Whisper | 30.194 | +27 | +29 | 957 | keeps R2.2 frame (≤ 3 f) (+2 f) |
| 11 | "ผิวเพดาน" | L10 | Whisper | 30.934 | +51 | +51 | 979 | unchanged |
| 12 | "ดึง" | L11 | Whisper | 33.040 | +34 | +33 | 1042 | keeps R2.2 frame (≤ 3 f) (-1 f) |
| 12 | "นับพันล้าน" | L11 | anchor | 34.538 | +67 | +78 | 1087 | moves (+11 f) |
| 12 | "แรงมาก" | L11 | Whisper | 35.960 | +110 | +121 | 1130 | moves (+11 f) |
| 13 | "ยิ่งเกาะ" | L12 | anchor | 37.917 | +30 | +34 | 1189 | moves (+4 f) |
| 14 | "เกาะแน่น" | L13 | anchor | 39.772 | +19 | +19 | 1235 | unchanged |
| 14 | "เดิน" | L13 | Whisper | 40.759 | +55 | +49 | 1265 | moves (-6 f) |
| 15 | "ม้วน" | L14 | Whisper | 41.985 | +10 | +9 | 1302 | keeps R2.2 frame (≤ 3 f) (-1 f) |
| 15 | "ลอกเทป" | L14 | Whisper | 43.485 | +50 | +54 | 1347 | moves (+4 f) |
| 16 | "หลุด" | L15 | Whisper | 45.806 | +39 | +40 | 1416 | keeps R2.2 frame (≤ 3 f) (+1 f) |
| 20 | "ไม่ได้ใช้กาว" | L16 | anchor | 49.769 | +71 | +72 | 1660 | keeps R2.2 frame (≤ 3 f) (+1 f) |

Unpegged picture beats: V01 voice f293, V02 voice f1498–1539, W-HANG [1454, 1490), W-MOTH [1550, 1588) (catch f1570), V03 f1700, end f1793.

<details><summary>R2.2 word pegs (W4.1 read, superseded)</summary>

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

</details>

## On-screen text (global ranges)

Exactly brief VD25.

| Text | Range | Shot(s) |
| --- | --- | --- |
| "ภาพจำลอง" (LBL) | [140, 204) · [522, 775) · [928, 1135) · [1376, 1415) · [1454, 1550) | 2; 7–8; 11–12 (to the loupe-out into the room, +126); 16 (+0–+39); 17–18 |
| Captions | per the cue table | all |

No numbers, no scale bars, no other text; every set item textless.

## Rules for every shot

- **R01 Model labels.** "ภาพจำลอง" ranges as above: every hanging-man picture and every drawn-scale macro (D03 adds the L15 macro part).
- **R02 Truth limits.** As the brief's [Visual intent](film-brief.md#visual-intent): no number on screen; the man never in the real room; in the imagined hang the tokay holds him with its own feet (no sling, rope or prop) and the force reads from the pressed, splayed front feet, never from a glow, line or glint (held back until L11); the TV dust never linked by picture to the hairs; no tail use or tail drop; pads always flat and dry (no blob, shine, strands or dome); dust recovery partial; peel = toes rolling up and back from the tip, rows letting go in sequence.
- **R03 Size reference.** Every shot keeps one size reference in frame: WOMAN, sofa or lamp (room), the toe and its ridges (`T`), the hair and its neighbours (`U`), the TV edge and the room's reflection (TV glass), the man and the tokay (imagined).
- **R04 Feet on the plane.** The tokay's planted feet sit on y 2.70 in `R` (no float, no sink, no slide while planted); a lifted foot leaves toe-tips-first. In the imagined hang (shots 2, 17, 18) the two front feet are the planted pair and the hind feet are locked to the man's wrist anchor; the sway pivots on the front-foot line.
- **R05 Screen.** Faces, contacts, the tokay's head and feet, labels and the bubble above y 1160; the caption band calm per the [caption-zone rule](film-brief.md#caption-zone-rule) (mean ≤ 0.25, p95 ≤ 0.40 on clean frames); LBL and BUB slots only. *R2.1: the user removed the calm band (2026-11-10, stroke-only captions); the luma targets are suspended and the replacement [R21-CZ](#w5-review-decisions-r21) is proposed to the user (keep-out, texture, captioned proof).*
- **R06 Grades.** Imagined grade (saturation 35 %, cool tint, vignette) on shots 2, 17, 18 only; her-thought grade (sepia, cloud-edged bubble) on shot 5 (and the small bubble in shot 4); both snap in over 3 f.
- **R07 Ambient clocks.** The fan, the moth (until shot 19), the cobweb strand and the tokay's flank breathing run on ambient clocks through holds and slow motion (DF-20261030-painted-story-hold-ambient-clock); event clocks are shot-local.
- **R08 Continuity.** WOMAN on W0 in every room shot (phone in hand to shot 10, lowered after, on her lap in shot 20); the tokay T0 (shots 1–6 start) → T1 (end of 6, shots 10, 14 start) → toward T2 (14–16) → T2 (19 start) → T3 (19 end, 20); the hero foot front-left (3, 7, 12 end, 13, 15, 16); the imagined hang uses rig H at z 0.38 (W3.1; not T0), the curling foot in 17–18 front-right (screen left, the tokay facing the lens); the dust ring identical in every ceiling shot; no woman in the imagined room.

## Per-shot staging

Key frames shot-local `+n`. Sound lines give the shot-local frame and the brief's code or library ID (brief [Sound direction](film-brief.md#sound-direction)); every library ID is "not listened" and Ton checks it against its description before use. Mix intent per the brief's arc; Editor sets levels.

**1. S01-B01-SH01** [0, 140), 140 f. VO C01 +17–+128 ("ตุ๊กแก" +17, "ถ้า" +60, "ทุกเส้น" +115).
- Camera: `ycam: pos (0.10, 0.70, 1.50) → (0.34, 2.36, 0.12), look-at (0.00, 1.30, −0.75) → (0.33, 2.70, −0.16), f 950 → 1000`, start hy 860 (W3: phone and chest above the caption band); hold +0–+40, crane up (ease in-out) +40–+115, hold +115–+139 (R2.3; R2.2 +40–+105). At +0 (measured, LF01 v10 @ +20 on the held start camera): WOMAN 801 px, face y 881, tokay 135 px. At +115 ≈ 3300 px/m at the front-left foot: foot ≈ 80 px, toes ≈ 33 px.
- Staging: R, real night. WOMAN `front` on W0, `new: sit-phone`, `neutral`, thumb scrolling (phone glow on her face); the coffee table soft in the foreground across the caption band; the ceiling above: lamp pool, dust ring (K01), cobweb corner, fan turning; the moth orbiting the lamp (K03); the tokay at T0, `dorsal`, `rest`, head toward the lamp, toe tips of the hind feet lifted (K02, small). The crane rises past the lamp edge to the tokay's front half and feet.
- Key frames: +0 reads "living room, night, lizard on the ceiling" at once (UT01; LF01 at +20); +17 the tokay already in frame on "ตุ๊กแก"; +115 lands on the feet on "ทุกเส้น".
- Sound: A1 + A2 from +0 (no music); S17 moth flutter loop from +0 at a low level, panned to the lamp; nothing on the tokay (it is still).
- Entry → exit: +0 room wide, WOMAN scrolling → +139 close on the tokay's front feet.

**2. S01-B01-SH02** [140, 204), 64 f. VO C02 +0–+64 (continues into shot 3 to +3; "ห้อย" +16, "หนึ่งคน" +47). *Changed R1.1 (user: the tokay grips the man itself, force first).*
- Camera (W3.1, rig at z 0.38; end camera swung to the room's front left so his feet hang over open floor, not the sofa): `ycam: pos (0.33, 2.42, 1.10) → (−1.50, 1.00, 2.20), look-at (0.33, 2.56, 0.38) → (0.33, 1.50, 0.38), f 1050 → 1000` (the yaw swings about 40° during the pull-back); hold +0–+4, pull back and crane down (ease-out, fast start) +4–+36, hold +36–+63 (R2.3: the end hold grows 8 f). At +0 ≈ 1415 px/m at the tokay: tokay ≈ 410 px, front feet y ≈ 770 (foot ≈ 35 px), wrists y ≈ 1075, the man's hair crown at the bottom edge (y ≈ 1550; face out of frame). At +36 (measured W3.1, LF05A v11): ≈ 354 px/m at the tokay: tokay 100 px (y 541–617), MAN 704 px (top y 574 → feet y 1278), eyes y 663, floor under him y 1588 (gap 311 px); the sofa screen left of his legs, the coffee table soft lower-left and in front (feet 0.30 m above its top, x 0.33 > table edge 0.25), the fan stand behind his legs with its base hidden by the table. +0 values are pinhole estimates (Film, `est`); Boss measures with `scripts/shot-projection.py`.
- Staging: R, imagined grade (snap in +0–+3), no woman, sofa empty, on [hang rig H](film-brief.md#hang-rig-h). +0 matches shot 1's end framing (same scale, feet centred; a framing match, rig H is 0.5 m in front of T0, see [H2](#w5-handoff-notes-film)): the tokay `hang-front`, hanging head-up from its two front feet (all ten toes splayed and pressed flat, forelimbs straight, body pulled long and straight), belly to the lens, calm (`rest` face, one slow blink +8); its hind feet clasp the man's two wrists; the tail hangs free behind his hands, touched by nothing. The pull-back follows the line of force: feet → wrists → MAN (`front`, `new: hang-held-wrists`, `scared`, legs dangling) → the floor gap under his shoes. Two small leg kicks (+22, +40); after each the man and the tokay sway together ±2° about the front-foot line and settle within 12 f (by +52), the front feet locked (≤ 2 px drift). "ภาพจำลอง" in LBL from +0.
- Key frames: +0 the feet hold (force first); +16 "ห้อย" wrists, his head and torso in frame (the hang reads); +36 the whole man and the floor gap; +49 "หนึ่งคน" held wide; +63 last frame (hard cut back; the last 3 f of "คน" run over the snap back).
- Sound: S4 swish at +0 (Editor may pre-roll 3 f); S3 held-breath swell +0 → cut dead at +64; S2 grip strain at +22 and +40 (revised R1.1: no rope); A1 imagined (−10 dB, low-passed), A2 out.
- Entry → exit: +0 imagined, close on the front feet → +63 the whole hang, low wide.

**3. S01-B01-SH03** [204, 277), 73 f. VO C02 tail +0–+3; C03 +19–+73 (continues into shot 4 to +9; "กาว" +44, "ไม่มีแรงดูด" +60).
- Camera (W3, mirrored to the sofa side so the hero front-left foot is the near foot; = LF02): `ycam: pos (0.34, 2.36, 0.12) → (0.305, 2.667, −0.315), look-at (0.33, 2.70, −0.16) → (0.315, 2.671, −0.18), f 1000, end hy 860, near 0.01`; hold +0–+12 (= shot 1's end framing), descend and swing round the tokay's head side +12–+56 (ease; arc the path, see [W5 handoff](#w5-handoff-notes-film) H3), hold to +72. End (measured, LF02 v10): contact y 648, front-left foot 88 px (7390 px/m at the palm), plaster bumps 0.6–1.9 mm stippled.
- Staging: R, real colour back on one frame (snap back). +0–+12 the real feet, no man. The tokay card changes view `dorsal` → `left` profile as a cut-on-move at +30 (the camera passes the ceiling's grazing angle). End: the front-left foot pressed flat on the rough plaster, toes splayed, pads dry and flat (no blob, no shine, no dome); the plaster bumps throw tiny shadows in the raking lamp light; the hind foot soft behind with two toe tips lifted (K02 clear); a corner of the lamp's glow at frame left.
- Key frames: +12 the move starts; +44 "กาว" the dry pad reads (R2.3; R2.2 +48); +60 "ไม่มีแรงดูด" the flat pad reads (LF02).
- Sound: A1 + A2 back on +0 (one frame); **M1 enters on +19** with a light pizzicato pick-up (energy 1.5); S17 moth faint.
- Entry → exit: +0 feet from below → +72 ceiling-level side view of the pressed foot.

**4. S01-B01-SH04** [277, 317), 40 f. VO C03 tail +0–+9; V01 voice +16–+23 (file from +8).
- Camera: `ycam: pos (−0.30, 0.70, 0.30) → (−0.30, 0.71, 0.25), look-at (−0.35, 1.05, −0.80), f 1000`; head ≈ 365 px, face y ≈ 900.
- Staging: R, real. WOMAN `front`, phone at her chest; +4–+14 her eyes then head lift to the ceiling (look up 25°); `neutral` → `surprised` at +14; V01 at +16 (Despina, 7 f); the thought bubble (BUB, cloud-edged, her-thought grade inside) pops in at +22 above screen right of her head with a tiny red plunger in it.
- Key frames: +14 looking up; +16 "เอ๊ะ?"; +22 bubble.
- Sound: S5 `ui_pop_01` at +22; M1 holds a two-note question figure.
- Entry → exit: +0 face down to the phone → +39 looking up, bubble open.

**5. S01-B02-SH01** [317, 414), 97 f. VO C04 +4–+81 ("ฝุ่น" +32, "อยู่ไม่ได้" +65).
- Camera: `ycam: pos (0.00, 2.55, 0.42) → (0.00, 2.56, 0.38), look-at (0.00, 2.68, 0.38), f 1000` (slow push). Plunger cup 0.12 m ≈ 600 px wide.
- Staging: R ceiling at the dust ring (0.38 m from the lamp), her-thought grade, cloud-edged frame (the bubble filling the screen). +0–+8 the red plunger rises into frame and **thwops** onto the plaster (+8); +8–+33 close on the rim: grit specks and plaster bumps prop it, a thin line of lamp light shows under it (gap ≥ 6 px) on "ฝุ่น" (+32); +32–+62 air leaks in, the rim lifts at one side; +65 on "อยู่ไม่ได้" it drops out of frame bottom; +88 the bubble pops (edge collapses to a point) to the cut.
- Key frames: +8 thwop; +32 gap reads; +65 drop; +88 pop (R2.3; R2.2 +59, +83).
- Sound: S6 thwop at +8; S7 leak hiss from +42, slip +60, drop away +65–+85; S5 `ui_pop_01` at +88; M1 playful (energy 2); A1 at −12 dB.
- Entry → exit: +0 empty dusty plaster (thought) → +96 bubble gone (white flash 2 f, +95–+96).

**6. S01-B02-SH02** [414, 522), 108 f. VO C05 +3–+89 ("เดิน" +17, "ฝุ่นร่วง" +50, "ก้าว" +81; R2.3: all within 3 f, so the gait keeps its R2.2 frames).
- Camera: `ycam: pos (0.27, 2.15, −0.26), look up (pitch +88, −90 avoided), f 900`, slow roll 0 → 4°; ≈ 1640 px/m at the ceiling: tokay ≈ 475 px, path T0 → T1 ≈ 720 px.
- Staging: R, real, looking straight up at the plaster: the dust ring fills the frame, the lamp's glow at screen right. The tokay (`dorsal`) walks T0 → T1, diagonal gait, 9 foot-falls (+12 to +83, every 9 f, the last on "ก้าว"); each lifted foot peels toe-tips-first; from +48 each lift drops 3–6 specks that fall toward the lens, growing and glinting; by +83 one or two specks still cling to two toes (partial). The moth crosses the frame edge once (+60). At T1, still, from +90.
- Key frames: +20 "เดิน" walking; +49 "ฝุ่นร่วง" first clear fall; +83 "ก้าว" last step; +90 at T1, still.
- Sound: S1 step ticks at +12, +21, +30, +39, +48, +57, +66, +75, +83; S8 dust falls at +48, +57, +66, +75, +83; M1 (1.5).
- Entry → exit: +0 the tokay at T0 on the dust → +107 at T1, specks settling.

**7. S01-B03-SH01** [522, 684), 162 f. VO C06 +12–+148 ("ขน" +39, "สี่เท้า" +93, "หลายล้าน" +122).
- Camera: `T (mm): pos (0, −60, 0) → (0, −4, 1.5), look-at the pad of toe 3, f 1000`; loupe-in +12–+28 (into toe 3) and +30–+40 (into one ridge); skim +93–+161 (R2.3; R2.2 +83–+142) at 0.3 mm over the hair carpet, pitch −12 → −4 (rows run to a soft horizon). At +0 the foot's pad ≈ 420 px across.
- Staging: the front-left foot lifted mid-step and held (staged, D06), its pad toward the lens: five splayed toes with pale ridges; the room behind as warm bokeh (lamp disc). "ภาพจำลอง" in LBL from +0. +36 hairs fill the frame on "ขน": a dense brush in rows; +93 on "สี่เท้า" the camera rises over the carpet; +122 "หลายล้าน" rows to the horizon.
- Key frames: +28 one toe; +40 one ridge; +36–+50 hairs resolve; +90 LF03; +122 the endless carpet.
- Sound: S9 dive whoosh +0–+30 (it starts in the gap before the VO at +12); A1 ducks to H1 `room_studio-hush_01` from +10; M1 thins to the pizzicato figure (1).
- Entry → exit: +0 the lifted pad → +161 skimming the hair carpet.

**8. S01-B03-SH02** [684, 775), 91 f. VO C07 +3–+69 ("ปลายแตก" +24, "หลายร้อย" +45).
- Camera: `U (µm): truck y 20 → 115 along the hero hair, distance 60, f 1000`, slight arc 0 → 10°.
- Staging: one hero hair (5 µm wide) among softer neighbours, side view; near its end it branches (about 4 branches, then hundreds of stalks) and fans into flat tips from +24; about 200 tips visible by +44, catching the warm rim light. LBL on.
- Key frames: +24 the split; +44 the full fan.
- Sound: S10 `reveal_glass-shimmer-soft_01` at +24; H1; M1 (1.5).
- Entry → exit: +0 the hair's shaft → +90 the fanned tips, still.

**9. S01-B03-SH03** [775, 837), 62 f. VO C08 first half +4–+52.
- Camera: `ycam: pos (−0.25, 1.05, 2.20) → (−0.15, 1.05, 2.22), look-at (−0.25, 1.05, 2.58), f 1000` (slow truck right); ≈ 2600 px/m.
- Staging: R, real. The off TV's black glass fills the frame: fluff, a lint fibre (≈ 50 px), dust specks clinging; a faint reflection of the lamp streak and the room with her small silhouette on the sofa (15 % overlay). The TV's bezel edge at screen left as the size reference. No link to the hairs (R02).
- Key frames: +4 reads "dusty TV screen" at once.
- Sound: A1 full at +0, mains hum layer `electric_streetlamp-hum-loop_01` at about −30 dB; M1 low.
- Entry → exit: +0 dusty glass → +61 same, moved right.

**10. S01-B03-SH04** [837, 928), 91 f. VO C08 second half +4–+71 ("แต่" +4, "กลับหัว" +41).
- Camera: `ycam: pos (−0.25, 1.15, −1.12) → (−0.25, 1.17, −1.10), look-at (0.10, 2.40, −0.35), f 900`; her head y ≈ 950–1150, the tokay ≈ 160 px at y ≈ 330.
- Staging: R, real. WOMAN `back` (P31, phone lowered to her lap), the back of her head and shoulders lower-middle; above, the tokay hanging still at T1 (`dorsal`), the lamp pool beside it. On "กลับหัว" (+41) she tilts her head (`headCock` 0 → +12 over +37–+49; R2.3, R2.2 +46–+58; R21-06 sets the end value 18); held to the cut.
- Key frames: +41 head tilt.
- Sound: A1 + A2; M1 question figure (two plucks rising) on +41.
- Entry → exit: +0 looking up → +90 head tilted.

**11. S01-B03-SH05** [928, 1009), 81 f. VO C09 +3–+71 ("แนบชิด" +29, "ผิวเพดาน" +51; picture keeps +27).
- Camera: `U (µm): pos (0, 80, 70) → truck x +20, look-at the contact line, f 1000`; contact line y ≈ 420.
- Staging: micro section: the plaster's bumpy underside along the top (bumps 2–6 µm, dips between); a row of hairs rises from below with their tip fans; on "แนบชิด" (+27) the tips settle along the bumps and into the dips, conforming; by +51 the whole row is in close contact. LBL on.
- Key frames: +27 tips settle; +51 full contact.
- Sound: H1; S11 tips settling +22–+64; M1 (1.5).
- Entry → exit: +0 tips just below the plaster → +80 tips pressed into it.

**12. S01-B03-SH06** [1009, 1155), 146 f. VO C10 +3–+135 ("ดึง" +33, "นับพันล้าน" +78, "แรงมาก" +121).
- Camera: starts as shot 11's end (`U`), then reverse loupes: `U → T` +78–+96, `T` pull-back +96–+111, `T → R` +111–+126 (R2.3; R2.2 +67/+85/+100/+115), ends `R: pos (0.33, 2.55, −0.02), look-at (0.33, 2.70, −0.16), f 1000`.
- Staging: +34 on "ดึง" one glint and a tiny amber pull-line where one tip touches; +34–+78 glints spread across the field; +78 on "นับพันล้าน" the camera pulls back through every scale as glints multiply into a glowing field over the whole carpet, then the toe, then the foot; +121 on "แรงมาก" one warm line runs from the foot up into the ceiling; LBL off at +126 (the room).
- Key frames: +34 first glint; +45 LF04; +78 pull-back starts; +121 one strong line; +126 the room.
- Sound: S12 glints gathering +34–+139 (the low swell firming at +121); S19 zoom-out whooshes on each loupe-out (+78, +111); M1 lifts (2.5) at +78.
- Entry → exit: +0 tips in contact (µm) → +145 the foot on the ceiling, glowing line fading.

**13. S01-B03-SH07** [1155, 1216), 61 f. VO C11 +3–+51 ("ยิ่งเกาะ" +34).
- Camera: `ycam: pos (0.14, 2.63, 0.05) → (0.14, 2.62, 0.30), look-at (0.14, 2.68, −0.40), f 1000` (pull back); tokay ≈ 640 → 460 px long.
- Staging: R, ceiling-level side view: the whole tokay upside down at T1 in profile, all four feet pressed flat, the plaster edge-on above. On "ยิ่งเกาะ" (+34) it braces: pads flatten, body dips 2 mm, holds.
- Key frames: +34 brace; +51 held (R2.3; R2.2 +30, +52).
- Sound: A1 back at +0; **S13 `stinger_low-muted-hit_01` at +34** on M1's downbeat (energy 3).
- Entry → exit: +0 close profile → +60 whole tokay, firm.

**14. S01-B04-SH01** [1216, 1293), 77 f. VO C12 +3–+61 ("เกาะแน่น" +19, "เดิน" +49).
- Camera: `ycam: pos (0.90, 0.72, 0.15) → (0.88, 0.74, 0.10), look-at (−0.25, 1.70, −0.45), f 900`; her head ≈ 350 px at y ≈ 1000, the tokay ≈ 120 px in the upper third.
- Staging: R, real. WOMAN in profile facing screen left, P32 lean with head raised (`suspicious`), leaning in over +3–+19; the tokay above at T1 starts to walk toward T2 on "เดิน" (+49).
- Key frames: +19 lean complete; +49 first step (R2.3; R2.2 +55).
- Sound: M1 figure returns a touch faster at +3 (2); S1 steps at +49, +59, +69; A1 + A2.
- Entry → exit: +0 sitting back → +76 leaning in, the tokay walking.

**15. S01-B04-SH02** [1293, 1376), 83 f. VO C13 +3–+69 ("ม้วน" +9, "ลอกเทป" +54; the roll keeps its +10 start).
- Camera (W3 mirror as shot 3's end, est): `ycam: pos (0.29, 2.667, −0.315), look-at (0.30, 2.671, −0.18), f 1000, hy 860, near 0.01`, slow truck x −0.01 m; foot ≈ 180 px; tape strip 18 mm ≈ 130 px wide.
- Staging: R, ceiling-level side close: the front-left foot planted (same framing family as shot 3's end), a cream masking-tape strip stuck on the ceiling 30 mm beside it, its free end pinched down. On "ม้วน" (+10) the toes roll up and back from the tips in staged slow motion (roll 0 → 1 over +10–+54; R2.3, R2.2 +10–+50), the tape's free end curling back in sync with the same radius; the curled toe shape matches K02 from shot 3.
- Key frames: +10 roll starts; +32 roll 0.5 (SP1 still); +54 "ลอกเทป" both peeled.
- Sound: S14 tape peel, slowed, +10–+69; A1 −4 dB; M1 (2).
- Entry → exit: +0 foot planted, tape flat → +82 toes and tape curled back.

**16. S01-B04-SH03** [1376, 1454), 78 f. VO C14 +3–+74 ("หลุด" +40; picture keeps +39).
- Camera: `T (mm): side of toe 3, pos (6, 3, 20), look-at the ridge line, f 1000` → loupe-out +39–+50 → `R: pos (0.30, 2.62, 0.00), look-at (0.30, 2.68, −0.16), f 1000`.
- Staging: section along toe 3 as it rolls: the rows of hairs let go in sequence from the tip end, their glints going out row by row (+0–+36); LBL +0–+39 (D03); on "หลุด" (+39) the last row lets go and the foot snaps free; in the room the foot lifts, swings and steps on (+50–+77), the tokay walking toward T2.
- Key frames: +16 half the rows released; +39 free; +60 next step placed.
- Sound: H1 +0–+39; glints going out (Editor reverses the head of S12) +0–+32; **S15 `foley_rubber-snap-release_01` at +39**; S19 whoosh-out +39–+50; S1 step at +60; M1 (2.5).
- Entry → exit: +0 rows in contact (mm) → +77 the tokay stepping on (room).

**17. S01-B05-SH01** [1454, 1490), 36 f. W-HANG (no VO). *Changed R1.1 (new hang; the curl framed big).*
- Camera (W3.1: starts on shot 2's new end camera, ends on the LF05B push end moved with the rig): `ycam: pos (−1.50, 1.00, 2.20) → (0.33, 2.40, 0.68), look-at (0.33, 1.50, 0.38) → (0.33, 2.57, 0.38), f 1000 → 1450, hy 800 at the end`; hold +0–+6 (= shot 2's end framing, the callback), whip push swinging to the front axis (ease in-out) +6–+16, see [W5 handoff](#w5-handoff-notes-film) H1, hold +16–+35; end camera = `camLF05B` (pos (0.33, 2.40, 0.68), look-at (0.33, 2.57, 0.38), f 1450, hy 800, near 0.02). End (measured, LF05B v11, unchanged from v10): front feet 51 / 40 px at y 399 (front-right half curled), wrists y 1045, his face out of frame below.
- Staging: R imagined (snap in +0–+3), LBL from +0, rig H. +0–+6 the man dangling (`scared`), the tokay calm; +18–+30 it curls the toes of its whole front-right foot (screen left) from the tips, toe roll 0 → 0.6, the heel pad still down (Q-F2, Boat O6); the front-left foot stays pressed flat with toes splayed, the body does not drop or slide, the hind feet keep his wrists. The read is "it is about to take a step" (the L14 move), not "one toe lets go of everything".
- Key frames: +6 the push starts; +26 LF05 (curl half way, both feet in frame); +30 foot curled, held to +35.
- Sound: S4 swish at +0; A1 imagined; S2 grip strain +4; the S14 head (0.25 s) tick on the curl +18; near silence +18–+36.
- Entry → exit: +0 the whole hang (wide) → +35 close on the front feet, one curled.

**18. S01-B05-SH02** [1490, 1550), 60 f. V02 voice +8–+49 (file from +1; "อย่า" +8, "ปล่อยนะ" +16). *Retimed R2.0: the picked Algenib take is 41 f of voice (R1 est 24 f), so the shot grows 45 → 60 f and the replant moves after the line.* *Changed R1.1 (wrists held by the tokay, no toggle or rope; new camera).*
- Camera (W3.1: +0.5 m z with the rig): `ycam: pos (0.50, 2.05, 1.90) → (0.50, 2.05, 1.87), look-at (0.36, 1.98, 0.38), f 1250` (slight push); ≈ 770 px/m at the tokay: tokay ≈ 220 px, front feet y ≈ 360 (the curled foot ≈ 19 px), wrists y ≈ 545; MAN head ≈ 350 px, eyes y ≈ 960, chin y ≈ 1145 (above the caption band).
- Staging: R imagined, LBL on, rig H. MAN's face and raised arms, his wrists clasped by the tokay's hind feet; the tokay above, hanging by the flat front-left foot with the front-right still curled; +0–+4 his eyes snap up (`shock`); V02 +8–+49 (he holds `shock`, mouth open on the shout, eyes on the foot); +45–+57 the foot uncurls and presses back flat (toe roll 0.6 → 0), the tokay's body easing 1 cm toward it as it replants; `relieved` +53, held to the cut.
- Key frames: +4 eyes up; +8 "อย่าปล่อยนะ!"; +45 uncurl starts; +57 foot back down.
- Sound: V02 in the clear (+8–+49); S16 relieved pluck at +51.
- Entry → exit: +0 looking at the foot → +59 relief.

**19. S01-B05-SH03** [1550, 1588), 38 f. W-MOTH (no VO). *Changed R1.1 (user: the moth flashes in the jaws).*
- Camera: `ycam: pos (0.05, 2.05, 0.45), look-at (0.20, 2.70, −0.20) → (0.11, 2.70, −0.18), f 1000 → 1350`; hold +0–+14, push in on the head (ease-out) +14–+28, hold +28–+37. Start ≈ 1100 px/m at the head: tokay ≈ 320 px; end ≈ 1490 px/m: head ≈ 67 px at (x ≈ 505, y ≈ 955), the moth ≈ 33 px wing to wing, tail tip near the right edge (x ≈ 1060), the lamp core upper left.
- Staging: R real (snap back). The lamp core in frame, the moth orbiting close; the tokay at T2 (`dorsal`); +6–+14 it peels all four feet in quick sequence; +14–+20 lunges to T3, front feet replanting; +20 jaws close on the moth. +20–+31 the moth held whole across the jaws, both pale wings sticking out either side and catching the lamp light, still (no flutter, no legs, no chewing, nothing broken or wet); +31–+35 one throat bob swallows it, the wings slip in; +35 gone, two wing-scale motes drifting down; +35–+37 it settles. Kids-safe: a quick, clean catch, never a close study of the insect.
- Key frames: +20 the catch; +26 the moth reads in the jaws; +33 swallow; +37 settled, no moth.
- Sound: S17 moth flutter up from +0, cut at +20; S18 lunge and jaw tick +6–+24 (tick +20); no chew or swallow sound; M1 resolves to a phrase end by +30 (fallback fade +26–+38); A1 + A2.
- Entry → exit: +0 moth circling → +37 the tokay at T3, no moth.

**20. S01-B05-SH04** [1588, 1793), 205 f. VO C15 +4–+109 ("ไม่ได้ใช้กาว" +72; picture keeps +71); V03 +112–+145; hold +145–+204.
- Camera: `ycam: pos (−0.05, 0.75, 0.95) → (0.10, 2.00, 0.40), look-at (−0.35, 1.10, −0.80) → (0.10, 2.70, −0.10), f 1000`; hold +0–+50 on her, crane (ease in-out) +50–+108, hold +108–+204. End ≈ 1430 px/m: tokay ≈ 410 px, lamp ≈ 570 px.
- Staging: R real. WOMAN `front` (P31, phone on her lap) looking up; she smiles (`happy`) at +30; the crane rises past the lamp to the tokay at T3 (`dorsal`, `rest`, toe tips lifted again: K02 echo), moth gone, fan turning. On V03 (+112) its throat pulses and the jaw opens on each syllable; hold with ambient motion only (fan, cobweb strand, a breath in the flank).
- Key frames: +30 smile; +71 "ไม่ได้ใช้กาว" crane mid-way; +108 settled on the tokay; +112 call; +145 hold starts; +204 last frame.
- Sound: A1 + A2 (room only, no music); V03 at +112 in the clear; A1 + A2 fade to −∞ over +175–+204; no loop seam.
- Entry → exit: +0 her upturned face → +204 the tokay by the lamp, still.

## Acceptance (timed checks for W5 and W6)

- Length 1793 f = 59.77 s (40–60 s); every cue inside the shot ranges of the cue table (C02, C03 and C08 cross a cut exactly as listed); longest answer L10 onset f931 to L13 onset f1219 = 9.60 s < 10 s.
- Narration placed in six segments at the offsets of [Units](#units-clocks-and-conventions) (R2.3, C1 read, the L13 breath not placed): line onsets land on the cue table frames ±1 f; V01 voice at f293, V02 voice [1498, 1539) inside shot 18, V03 onset f1700.
- Word pegs: Editor checks the `Whisper` pegs of the [word-peg table](#word-pegged-key-frames-r20) by ear on the draft; a picture beat more than 3 f off its word moves to the word (the audio does not move).
- Shot 1 +0 nameable as "living room at night with a lizard on the ceiling" by a fresh viewer (viewer check, UT01); the tokay ≥ 100 px at +0 and reads as a tokay at 270 px (blue-grey, orange spots).
- K02 visible on the hind toes in shot 3's end; K01 dust ring visible in shots 1, 5, 6; K03 moth visible in shots 1, 3 (corner), 6, 19.
- Pads flat and dry in every contact view (shots 3, 13, 15 start); no glue blob, shine, strand or dome.
- Labels exactly per the text table; no number anywhere.
- WOMAN seated ≥ 480 px and face above y 1160 in shot 1; MAN ≥ 700 px at shot 2's end and shot 17's start with the floor visible under his feet.
- Imagined hang (shots 2, 17, 18; R1.1): no sling, rope or prop; both front feet flat and splayed on the plaster at shot 2 +0 (tokay ≥ 400 px); the hind feet on his wrists in every frame; the tail free; in shot 17 the curling foot ≥ 40 px and the other front foot flat throughout; the man's face out of the caption band.
- Shot 19 (R1.1): the moth readable in the jaws +20–+31 (≥ 30 px wing to wing), whole and still, no chewing; gone from +35.
- Caption band per the [caption-zone rule](film-brief.md#caption-zone-rule) on every shot (clean frames, `scripts/caption-zone.py --band 1176:1344`). *R2.1: luma targets suspended (band removed by the user); check R21-CZ (a) keep-out and (b) texture now, (c) captioned stills when the user adopts it.*
- Feet on the ceiling plane (≤ 2 px drift on held frames); seek parity on shots 6, 12, 16.
- The closed hold ≥ 60 f after V03 with ambient motion (no frozen tail).

## Dependencies and open items

- Boss: N1–N12 in the brief ([New assets](film-brief.md#new-assets-and-missing-capability-boss-dependencies-w52)); spikes SP2–SP4; Film writes the tokay (N1) and the look of N2/N3 at W3.
- Ton: M1, A1, A2, V03, S1–S3, S6–S9, S11, S12, S14, S16–S19 (NEEDS-GEN); library checks for S4, S5, S10, S13, S15, H1 and the mains hum.
- Editor: V01 = Despina and V02 = Algenib (user picks W4.2); narration not listened yet (listen at W5 with the draft); places the narration segments and the character files per the cue table.
- Boat: picture checks B-P1–B-P9 (brief handoff; B-P5 revised and B-P8, B-P9 new in R1.1).

<a id="r23-re-peg-c1-read"></a>
### R2.3 re-peg on the C1 read

Film, 2026-11-10. The user picked a new Gemini Kore style (C1: clearer words, quick pace) and approved the full read by ear; text and line order are unchanged (15 NAR rows). Every range, cue, word peg and text range above is re-pegged to it with the R2.2 rules: shot cuts keep their frame distance to the line edge they hang on (shot 2 = L02 onset; shot 3 = L02 end −3; shot 4 = L03 end −9; shots 5, 6, 8, 11–16 = line onset −3 or −4; shot 7 = L07 onset −12; shot 10 = "แต่" −4; shot 17 = L15 end +4); shots 17–19 keep 36 / 60 / 38 f; shot 20 keeps L16 at +4, V03 3 f after L16 and the 60 f closed hold. Story order, reveals, shot IDs, staging, cameras and sound designs are unchanged. One placement decision: **the breath before L13 (read 38.78–38.97 s) is not placed** (cuts at 38.70 and 38.99 s, both in silence), which brings the total from 1801 f (60.03 s, over the 60 s target) to 1793 f and the longest answer from 9.90 s to 9.60 s; the L12 → L13 pause is 0.44 s (R2.2 0.59 s). Fallback if the ear check at W5 rejects the cut: place 38.70–38.99 back, offset L13–L15 1.70 s, every frame from f1216 on +9 (1802 f = 60.07 s, answer 9.90 s).

**Boss: picture re-times (shot-local frames; exact).** Shots 3, 4, 9, 17, 18, 19 need no change beyond their new global start. Shots that only change length lose or gain frames at the end of a hold:

| Shot | Len R2.2 → R2.3 | Re-time (R2.2 → R2.3) |
| --- | --- | --- |
| 1 | 128 → 140 | crane end +105 → **+115** (crane +40–+115, ease unchanged), end hold +105–+127 → +115–+139 |
| 2 | 56 → 64 | end hold +36–+55 → +36–+63 (pull-back, kicks +22 / +40 and sway settle by +52 unchanged); the snap back cuts at +64 |
| 3 | 73 | "กาว" dry-pad read +48 → **+44**: the pad must be legible by +44 (the descent +12–+56 is unchanged; if the pad is not yet legible at +44, end the descent at +52 instead of +56) |
| 5 | 92 → 97 | rim lift +32–+56 → **+32–+62**; drop **+59 → +65**; bubble pop **+83 → +88**; white flash +90–+91 → **+95–+96** (thwop +8, gap +32 unchanged) |
| 6 | 111 → 108 | none: steps +12…+83, dust from +48, moth +60 keep; the T1 still runs +90–+107 (3 f shorter) |
| 7 | 143 → 162 | skim **+83–+142 → +93–+161** (pitch −12 → −4 over it); LF03 framing +80 → **+90**; "หลายล้าน" horizon +109 → **+122**; loupe-ins +12–+28, +30–+40 unchanged |
| 8 | 87 → 91 | truck y 20 → 115 now over +0–+90 (4 f slower); split +24, fan +44 unchanged |
| 10 | 91 | head tilt `headCock` 0 → 18 over +46–+58 → **+37–+49** ("กลับหัว" +41) |
| 11 | 80 → 81 | truck over +0–+80; tips settle +27, full contact +51 unchanged |
| 12 | 133 → 146 | U → T **+78–+96**, T pull-back **+96–+111**, T → R **+111–+126** (R2.2 +67 / +85 / +100 / +115); glint spread +34–+78; one strong line +110 → **+121**; LBL off +115 → **+126** (global 1135); first glint +34 and LF04 +45 unchanged |
| 13 | 66 → 61 | brace +30 → **+34** (pads flatten, 2 mm dip); held +52 → +51; pull-back over +0–+60 |
| 14 | 86 → 77 | first step +55 → **+49**, steps at **+49, +59, +69** (R2.2 +55, +65, +75); lean +3–+19 unchanged |
| 15 | 77 → 83 | roll 0 → 1 over +10–+50 → **+10–+54** (0.5 at +32); tape curl in sync |
| 16 | 75 → 78 | room step +50–+74 → +50–+77; release +0–+36, free +39, LBL +0–+39, next step +60 unchanged |
| 20 | 204 → 205 | V03 throat pulse +111 → **+112**; hold +144–+203 → +145–+204; R22-08 push `f` 1000 → 1025 over +108–+204; crane +50–+108 unchanged |

Code owners (not edited by Film): `SHOT_TABLE` / `TOTAL_FRAMES` in `src/painted/edu15/clock.ts` (1738 → 1793, starts per the [shot map](#shot-map)) and every shot-local frame above in `shots-a.tsx`–`shots-d.tsx`; label ranges per [On-screen text](#on-screen-text-global-ranges).

**Ton: sound cue shifts** (`sound-cues.json`, global frames; every cue moves with its shot unless noted; unchanged: A1-open, A2-open, S17-moth-open).

| Cue | Shot | R2.2 frame (local) | R2.3 frame (local) | Change |
| --- | --- | --- | --- | --- |
| S4-snap-in | 2 | 128 (+0) | 140 (+0) | shift only |
| S3-held-breath | 2 | 128 (+0) | 140 (+0) | length 57 → 65 f |
| S2-grip-a | 2 | 150 (+22) | 162 (+22) | shift only |
| S2-grip-b | 2 | 168 (+40) | 180 (+40) | shift only |
| A1-imagined | 2 | 128 (+0) | 140 (+0) | length 56 → 64 f |
| A1A2-return | 3 | 184 (+0) | 204 (+0) | shift only |
| M1-enter | 3 | 203 (+19) | 223 (+19) | shift only |
| S5-pop-1 | 4 | 279 (+22) | 299 (+22) | shift only |
| S6-thwop | 5 | 305 (+8) | 325 (+8) | shift only |
| S7-leak | 5 | 333 (+36) | 359 (+42) | local +6 f |
| S5-pop-2 | 5 | 380 (+83) | 405 (+88) | local +5 f |
| S1-step-1 | 6 | 401 (+12) | 426 (+12) | shift only |
| S1-step-2 | 6 | 410 (+21) | 435 (+21) | shift only |
| S1-step-3 | 6 | 419 (+30) | 444 (+30) | shift only |
| S1-step-4 | 6 | 428 (+39) | 453 (+39) | shift only |
| S1-step-5 | 6 | 437 (+48) | 462 (+48) | shift only |
| S1-step-6 | 6 | 446 (+57) | 471 (+57) | shift only |
| S1-step-7 | 6 | 455 (+66) | 480 (+66) | shift only |
| S1-step-8 | 6 | 464 (+75) | 489 (+75) | shift only |
| S1-step-9 | 6 | 472 (+83) | 497 (+83) | shift only |
| S8-dust-1 | 6 | 437 (+48) | 462 (+48) | shift only |
| S8-dust-2 | 6 | 446 (+57) | 471 (+57) | shift only |
| S8-dust-3 | 6 | 455 (+66) | 480 (+66) | shift only |
| S8-dust-4 | 6 | 464 (+75) | 489 (+75) | shift only |
| S8-dust-5 | 6 | 472 (+83) | 497 (+83) | shift only |
| S9-dive | 7 | 500 (+0) | 522 (+0) | shift only |
| H1-macro | 7 | 510 (+10) | 532 (+10) | length 220 → 253 f |
| S10-fan | 8 | 667 (+24) | 708 (+24) | shift only |
| A1-tv | 9 | 730 (+0) | 775 (+0) | shift only |
| hum-tv | 9 | 730 (+0) | 775 (+0) | shift only |
| M1-question | 10 | 842 (+50) | 878 (+41) | local -9 f |
| H1-hush-2 | 11 | 883 (+0) | 928 (+0) | length 213 → 227 f |
| S11-settle | 11 | 905 (+22) | 950 (+22) | shift only |
| S12-glints | 12 | 997 (+34) | 1043 (+34) | length 89 → 106 f |
| S19-zoomout-1 | 12 | 1030 (+67) | 1087 (+78) | local +11 f |
| S19-zoomout-2 | 12 | 1063 (+100) | 1120 (+111) | local +11 f |
| A1-refrain | 13 | 1096 (+0) | 1155 (+0) | shift only |
| S13-refrain-hit | 13 | 1126 (+30) | 1189 (+34) | local +4 f |
| S1-step-b1 | 14 | 1217 (+55) | 1265 (+49) | local -6 f |
| S1-step-b2 | 14 | 1227 (+65) | 1275 (+59) | local -6 f |
| S1-step-b3 | 14 | 1237 (+75) | 1285 (+69) | local -6 f |
| S14-peel | 15 | 1258 (+10) | 1303 (+10) | length 57 → 60 f |
| H1-snap | 16 | 1325 (+0) | 1376 (+0) | shift only |
| S12-glints-out | 16 | 1325 (+0) | 1376 (+0) | shift only |
| S15-snap-free | 16 | 1364 (+39) | 1415 (+39) | shift only |
| S19-zoomout-out | 16 | 1364 (+39) | 1415 (+39) | shift only |
| S1-step-c | 16 | 1385 (+60) | 1436 (+60) | shift only |
| S4-snap-hang | 17 | 1400 (+0) | 1454 (+0) | shift only |
| S2-grip-hang | 17 | 1404 (+4) | 1458 (+4) | shift only |
| S14-head-tick | 17 | 1418 (+18) | 1472 (+18) | shift only |
| S16-relief | 18 | 1487 (+51) | 1541 (+51) | shift only |
| S17-moth-flutter | 19 | 1496 (+0) | 1550 (+0) | shift only |
| S18-lunge | 19 | 1501 (+5) | 1555 (+5) | shift only |
| V03-call | 20 | 1645 (+111) | 1700 (+112) | local +1 f |
| A1A2-fade | 20 | 1708 (+174) | 1763 (+175) | local +1 f |

Regeneration or re-edit needed: **M1** runs f223 → shot 19 +30 = f1580 (1357 f, R2.2 1323 f) and its sync points move by different amounts: enter f223 (+20 f), shot 7 thin-out f522 (+22), question figure f878 (+36), lift 2.5 f1087 (+57), S13 downbeat f1189 (+63), faster figure f1219 (+54), resolve by f1580 (+54); re-edit at phrase boundaries or regenerate. **S12** 89 → about 106 f with the swell firming at file +87 (R2.2 +76). **S3** 57 → 65 f (held-breath swell cut dead at f204). **S14** 57 → 60 f (both peeled at +54). Loops (H1, A1 imagined) only change length. `totalFrames` 1738 → 1793.

**Editor:** (1) file the C1 read in the store and update `narration-place.py` to the R2.3 segments ([Units](#units-clocks-and-conventions)): cuts 9.48 / 16.09 / 23.99 / 38.70 + 38.99 / 47.21 s, offsets 0.30 / 1.00 / 1.40 / 1.70 / 1.41 / 5.5577 s, V01 file at f285, V02 file at f1491, total 1793; (2) captions per the [cue table](#voice-and-subtitle-cues-global-measured-r23); (3) ear-check the Whisper pegs and the L13 breath cut; (4) re-derive the `levels.checks` windows in `sound-cues.json` from the R2.3 line and cue frames (a linear map is not enough for the accent windows, which follow their cues); (5) re-render the draft and rebuild the review clips (the rows' `clips` are from the R2.2 cut).

### W5 review decisions (R2.1)

Film, 2026-11-10, on Boss's W5.2 build (draft stills only: sheets `out/edu15/build/sheet-e1-B01B02.png`, `sheet-e1-B03.png`, `sheet-e1-B04B05.png`, `sheet-B02B03-final.png`; Film clean stills `out/edu15/build/f1/`, sheets `sheet-f1-a.png`, `sheet-f1-b.png`, `sheet-f1-c.png`, viewed at 270 px). Exact fix numbers for Boss are in [fixlist.md](fixlist.md) round W5-F1; this table is the plan record. Values are `measured` where marked, otherwise design.

| ID | Shot | Boss's build | Decision | Reason |
| --- | --- | --- | --- | --- |
| R21-01 | 4 | camera pos z 1.10 (sheet 0.30 → 0.25), head 365 px | **accept**; Camera line now `pos (−0.30, 0.70, 1.10) → (−0.30, 0.71, 1.05), look-at (−0.35, 1.20, −0.80), f 1000` as built (`KEY4A/B`), head ≈ 365 px, face y ≈ 900 | the acceptance numbers (head 365 px, face above 1160) are met and the table front adds a size reference; her hands and phone in the band are not on the keep-out list |
| R21-02 | 2 | +0 shows his eyes at y ≈ 1810 (sheet: face out of frame) | **accept**, with the face inside the band ≤ 8 f during the pull-back (fixlist 2) | force first still holds (feet and tokay dominate +0); the eyes add the "a whole man" hint the pull-back pays off at +36; below the band at rest |
| R21-03 | 2 | legs do not kick (sway only) | **fix**: knee kicks at +22 / +40 (fixlist 1) | the sheet's "two small leg kicks" carry the weight read; sway alone moves ≤ 25 px at the feet |
| R21-04 | 5 | plunger rim's light gap at y ≈ 1290–1330 | **fix**: cup 200 px higher (fixlist 3) | the gap is the "ฝุ่น" read and on the keep-out list |
| R21-05 | 9 | truck 0.06 m (sheet 0.10) | **accept** the truck; **fix** the look and camera: TV outline, dust film, wisps, glass sheen (fixlist 4); Camera now `pos (−0.20, 0.80, 2.05) → (−0.14, 0.80, 2.05), look-at (−0.32, 0.86, 2.60) → (−0.26, 0.86, 2.60), f 1000`, ≈ 1820 px/m | 0.06 m moves ≈ 110 px, enough drift for 62 f; the full-frame black glass with point specks reads as a night sky at 270 px; the TV corner is the size reference R03 asks for |
| R21-06 | 10 | pos (−0.20, 1.20, −1.25), head ≈ 160 px, tokay y ≈ 340 | **accept**; `headCock` 0 → 18 (fixlist 5) | framing meets the sheet (tokay y ≈ 330, her head lower-middle); 0.05 m in front of the back wall is physical; at 160 px a 12° tilt does not read |
| R21-07 | 12 | loupe-outs as in-canvas dissolves | **accept**, each outgoing layer scaling up while it fades (as shot 16, fixlist 7) | same read as a loupe-out without a renderer change; S19 whooshes stay on +67 and +100 |
| R21-08 | 13 | camera on the sofa side (sheet: TV side) | **accept**; Camera as built (`KEY13A/B`): `pos T1 + (0.32, −0.07, −0.32) → T1 + (0.53, −0.08, −0.53), look-at (T1x, 2.68, T1z), f 1000, near 0.02` (sofa side, pull back 0.30 m) | keeps the hero front-left foot near (R08) and one side of the line with shots 3 and 15 |
| R21-09 | 14 | look-at (−0.25, 1.40, −0.20), f 650, hy 860, lean bend 0.4 | **accept** | her head ≈ 350 px and the tokay in the upper third hold; the wider lens keeps both planes; tokay ≥ 100 px to be confirmed in the fix render |
| R21-10 | 15, 16 | cameras relative to the hero foot (walk frame) | **accept** the method; **fix** shot 15 framing (fixlist 6) and shot 16 stray lines (fixlist 7) | the foot moves with the walk, so foot-relative cameras keep the framing exact; at ≈ 7400 px/m the 12 mm foot is ≈ 90 px and the roll is invisible at 270 px |
| R21-11 | 15 | tape 30 mm beside the foot | **change**: near edge 12 mm from the foot (fixlist 6) | keeps the tape in the tighter frame; the read is the same curl side by side |
| R21-12 | 17 | curl roll 0.45 (sheet 0.6), foot ≥ 40 px | **accept** | the measured ≥ 40 px floor (acceptance) wins over the design roll; 0.45 still reads as a whole-foot curl |
| R21-13 | 18 | 1 cm body ease on the replant skipped | **accept** | 1 cm ≈ 8 px at 770 px/m, below the read; the uncurl carries the beat |
| R21-14 | 19 | moth wing span 0.042 m | **accept** the size; **fix** orientation and contrast (fixlist 8) | built edge-on along the body's `v` axis it measures ≈ 20 px; broadside 0.042 m is ≈ 60 px at 1490 px/m |
| R21-15 | 19 | tokay heading jumps to 180 at the start (shot 16 ends at 320) | **accept** | shots 17–18 (96 f, 3.2 s, imagined) cut away between, so the turn happens off screen; shot 19's camera is new and the lunge direction to T3 needs 180 |
| R21-16 | 14 | the tokay turns on the spot at T1 (heading 225 → 255) | **accept** | the T1 → T2 line runs against T1's heading; a small arc is natural gecko gait |
| R21-CZ | all | calm band removed by the user; luma targets fail everywhere (`out/logs/cz-e1.json`) | **proposed to the user (U1 in fixlist)**: (a) keep-out at rest in x 120–888, y 1176–1344 (faces, contacts, the tokay's head and feet, plunger rim, the man's face and wrists, the moth, label, bubble), a move may carry one through ≤ 8 f; (b) texture: mean \|dx\|+\|dy\| ≤ 0.035 and steps > 40/255 ≤ 5 % on clean frames, no luma cap; (c) Editor's captioned stills at 270 px all legible, a failure softens band-row detail by ≤ 30 %, never a plate. Per shot: stroke alone suffices everywhere except shot 5 (rim, R21-04); shot 2 +0 passes under the ≤ 8 f pass; micro hair rows (11, 12 +0–+66, 16 +0–+37) sit at the texture limit (edge share 4.9 %) and are the first to check captioned | with a white fill and heavy warm-black stroke the risk is texture and covered subjects, not brightness; measured max gradient 0.033 (shot 7 +71), all other frames ≤ 0.025 (`out/logs/edu15-busy-e1.txt`) |

### W5-F1 round-2 verdicts (R2.2)

Film, 2026-11-10, on Boss's W5-F1 fixes (sheets `out/edu15/build/sheet-w5f1-guided.png`, `sheet-f2-s16.png`, `sheet-f2-s9s20.png`, `sheet-f2-s5s15.png`, viewed at 270 px; clean stills `out/edu15/build/w5f1/`, `out/edu15/build/fr2/`). Boss numbers in [fixlist.md](fixlist.md) round W5-F2. Story timing, ranges, cues, reveals and IDs unchanged.

| ID | Shot | Verdict | Decision / reason |
| --- | --- | --- | --- |
| R22-01 | 2 | **pass** (kicks); face-pass count still to report | a shoe rises ≈ 30 px at 270 px on each kick |
| R22-02 | 5 | **pass** | light gap at y ≈ 1070–1085, above the band |
| R22-03 | 9 | **needs fix** (W5-F2 item 2) | glass luma 0.15 against the wall's 0.39 still reads as a night sky; user wants it brighter: glass base `#4b5057` (≈ 0.31), light dust haze `#cfc8b8` 22–40 %, dust bunnies instead of branched wisps, clean-glass finger wipe, rimless lamp glow; target glass mean 77–107/255 |
| R22-04 | 10 | **pass** | the afro rolls ≈ 18° with a slanted lower edge; readable in motion |
| R22-05 | 15 | **pass** | flat pads at +10, tips curled at +30/+50, tape curl clear |
| R22-06 | 16 | **needs fix** (item 3) | hair lines still cross the tokay at +42–+44: the micro layer shrinks (`S` 12 → 4); loupe-out `S` 12 → 36, alpha 0 from +44, strokes clipped |
| R22-07 | 19 | **needs fix** (item 4) | ≈ 12 px at 270 px over the eye; span 0.042 → 0.065 m, held ahead of the snout, one flutter |
| R22-08 | 20 | **needs fix, small** (item 5) | the closed hold reads frozen; `f` 1000 → 1025 push over +108–+203, flank breath, one tail-tip sway |

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
| EDU-EP15-ROWS-R2.3 | 2026-11-10 | Film | Re-peg to the new C1 narration read (Gemini Kore, quick and clear, 51.40 s, user-approved by ear): line edges re-measured (energy) and word pegs from a per-line Whisper pass; every shot range, cue, text range and word peg re-pegged with the R2.2 rules; the breath before L13 not placed. Total 1738 → 1793 f (59.77 s); longest answer 9.31 → 9.60 s. Length changes on shots 1, 2, 5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 20; picture re-times for Boss and cue shifts for Ton in [R2.3 re-peg](#r23-re-peg-c1-read). Story order, reveals, IDs, staging, cameras and sound designs unchanged. Rows R2.3: `start`/`end`, `facts`, `lede`. Review page: pending. |
| EDU-EP15-ROWS-R2.2 | 2026-11-10 | Film | W5-F1 round-2 review of Boss's fixes: R22-01 to R22-08 (pass: shots 2 kicks, 5, 10, 15; fix: 9 brighter dusty glass per the user, 16 loupe-out, 19 bigger moth ahead of the snout, 20 hold ambient motion). Boss numbers in [fixlist.md](fixlist.md) round W5-F2. Rows R2.2: shot 9 `title`, `seen`, `changed`. Story timing, cues, reveals and IDs unchanged. Review page: pending. |
| EDU-EP15-ROWS-R2.1 | 2026-11-10 | Film | W5 review of Boss's W5.2 draft stills: decisions R21-01 to R21-16 (camera deviations in shots 4, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19 accepted with reasons; fixes for shot 2 kicks, 5 plunger rim in the band, 9 TV glass read and camera, 10 head tilt 18°, 15 tighter foot-relative camera f 1300 and tape 12 mm, 16 stray hair lines, 19 moth broadside) and R21-CZ, a proposed stroke-only caption-zone rule for the user (band removed by the user 2026-11-10; luma targets suspended). Boss numbers in [fixlist.md](fixlist.md) round W5-F1. Story timing, ranges, cues, reveals and IDs unchanged. Rows R2.1: shot 9 `seen` and `changed`. Review page: pending. |
| EDU-EP15-ROWS-R2.0 | 2026-11-10 | Film | W4 timing re-peg on the voice lock (narration W4.1 Kore read, V01 Despina, V02 Algenib): line edges re-measured from speech energy (Whisper onsets at L02, L08, L10, L12, L15 were 0.15–0.24 s early), character takes measured; every shot range, cue, text range, word peg and shot-local key frame pegged, offsets kept (0.30 / 1.00 / 1.40 / 1.70 s; L16 5.8257 s = shot 20 +4). Total 1738 f = 57.93 s (R1.3 est 1729 f); shot 18 45 → 60 f (V02 voice 41 f), replant after the line; longest answer 9.31 s. W3/W3.1 cameras folded into shots 1, 3, 15, 17 (LF01 hy 860, LF02 mirror, LF05B end). New sections: measured line edges, word-peg table, W5 handoff notes H1–H4 (B05-SH01 swing, rig z 0.38, shot 3 path, timing risks). Story timing, reveals, IDs, staging and sound designs unchanged. Status ready-for-dev (timing). Rows R2.0 timed. Review page: pending. |
| EDU-EP15-ROWS-R1.3 | 2026-11-10 | Film | User Q-F6 (R1.2 page): hang rig H and the hanging tokay moved 0.5 m forward (z −0.12 → 0.38, brief [hang rig H](film-brief.md#hang-rig-h), W3.1 note); cameras of shots 2, 17, 18 moved with it. The move alone left his feet over the sofa seat in the shot 2 end wide (feet 0.70 m level with the sofa back 0.72 m), so the shot 2 end / shot 17 start camera swings to the room's front left (pos (−1.50, 1.00, 2.20), look-at (0.33, 1.50, 0.38), f 1000). Q-F6 removed; `changed` on S01-B01-SH02 and S01-B05-SH01; LF05A, LF05B and TK7 images to `v11-clean`. |
| EDU-EP15-ROWS-R1.2 | 2026-11-10 | Film | Look frames added to review-rows.json (LF01-LF05B, SP1 tokay sheet, TK elements; Q-F2/Q-F3/Q-F5 answered and removed, Q-F6 new). Shot plan changes from the W3 findings, recorded as `changed` on S01-B01-SH01, SH02, SH03, S01-B04-SH02, S01-B05-SH01: (1) B01-SH01 start hy 960 -> 860 (phone and chest above the caption band); window moved to the back wall x 0.95-1.85 (UT01 night read), calendar to (-1.55, 1.5). (2) B01-SH03 / B04-SH02: the brief camera sits on the tokay's right, hiding the hero front-left foot; mirrored to the sofa side, pos (0.305, 2.667, -0.315) -> (0.315, 2.671, -0.18), f 1000, hy 860, near 0.01 (eye at body height, plaster edge-on). (3) B01-SH02 end: eye 1.10 -> 1.35 m (pos (0.30, 1.35, 2.00) -> (0.33, 1.45, -0.12)); the kit 4-head MAN hangs with feet 0.70 m above the floor (brief 0.46), at the sofa-back height, so his feet read as standing on the sofa (open, Q-F6); hands 0.06 m apart, no crossed forearms; floor shadow added. (4) B05-SH01 push end: pos (0.33, 2.40, 0.18) -> (0.33, 2.57, -0.12), f 1450, hy 800 so each front foot >= 40 px with the wrists above y 1160; MAN in the picture plane through the wrists (his feet are behind the lens). (5) Caption band: calm band levels per still in `look.tsx` CALM (0.24-0.74). |
| EDU-EP15-ROWS-R1.1 | 2026-11-10 | Film | User review of R1.0 (structured answers on the review page): 19 shots ok; Q-F2, Q-F3 ok. Q-F1 change: shots 2, 17, 18 rebuilt on the brief's hang rig H (the tokay hangs from its two front feet and clasps the man's wrists with its hind feet; sling, rope, toggle dropped; MAN pose `new: hang-held-wrists` supersedes `hang-two-hands`); shot 2 now opens close on the feet and pulls back along the line of force; shot 17 pushes from shot 2's end to the feet so the whole-foot curl reads (≈ 48 px foot) while the other foot stays flat; shot 18 new camera keeps his face above the caption band. Q-F4 change: shot 19 pushes in on the head and shows the moth whole in the jaws for 11 f, then one swallow. Shot IDs, ranges, cue table, text ranges and total (1729 f, 57.63 s est) unchanged: no timing was forced. Rows: `changed` on the four shots, Q-F1/Q-F4 removed as answered, Q-F5 added. Sizes are pinhole estimates. |
| EDU-EP15-ROWS-R1.0 | 2026-11-10 | Film | First storyboard pass (W2.2) on brief EDU-EP15-BRIEF-R1 and script R2: 20 shots, 1729 f = 57.63 s est from the W1.4 read (offsets 0.30 / 1.00 / 1.40 / 1.70 / 5.50 s), cue table C01–C15 + V01–V03, text ranges, rules R01–R08, per-shot camera, staging, key frames and sound, acceptance, Q-F1–Q-F4. Review rows written untimed. |
