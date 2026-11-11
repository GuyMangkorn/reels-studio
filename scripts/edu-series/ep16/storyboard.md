# Storyboard — EDU-EP16-SHORT (timed scene sheet)

Deliverable: `EDU-EP16-SHORT` · Revision: **EDU-EP16-ROWS-R2.1 (Draft fix round 1)** (Film, 2026-11-10, W5.3 viewer check of the half-size Draft `out/EDU-EP16-SHORT/draft/EDU-EP16-SHORT.mp4`, sheets `out/qa/edu-ep16/draft/B01–B05.png`: cameras or staging changed in shots 2, 3, 4, 6, 8, 11, 13, 14, 15, 16, 18, 19, 20 and the caption-plate policy (R05); every shot range, line timing, cue, word peg, ID and the total 1632 f unchanged; fix list [fixlist.md](fixlist.md) round 1. Status **ready-for-dev** for the changed shots) · Base: EDU-EP16-ROWS-R2.0 (timed scene sheet) (Film, 2026-11-10: every shot range, cue and shot-local key frame pegged to the W4.2 voice lock; staging and sound designs are the user-passed R1.1 text with the W3 look-frame cameras (LF01–LF05, CR4) folded in and the B01-SH06 mob distance fixed) · Status: **ready-for-dev (timing)** for Boss's W5 shot code and Ton's cue sheet; not a user approval, not runtime or audio proof · Timing: **audio-measured** on the locked narration (line edges from measure.json `lock`, 5 ms RMS, ±0.03 s; internal pauses from silencedetect −32 dB / 0.06 s, this pass; word pegs inside a line from faster-whisper word times checked against those pauses or syllable-interpolated, ±0.15 s for `interp`, see [Word pegs](#word-pegged-key-frames-r20)); narration, V01 and V02 **not listened**.
Inputs: [script.md](script.md) EDU-EP16-SCRIPT-R3 (user-approved 2026-11-10) · [fact-check.md](fact-check.md) R1 + R2 recheck · [film-brief.md](film-brief.md) **EDU-EP16-BRIEF-R2.0** · narration (W4.2 lock) `public/narration/EDU-EP16-SHORT-narration-v1.wav` = store `projects/EDU/audio/2026-11-10_ep16-nar-kore-fullread-r3.wav` (48.32 s, Kore, no atempo; [measure.json](measure.json) `lock`) · V01 MAN Charon `projects/EDU/audio/2026-11-10_ep16-char-v01-man-charon-final.wav` · V02 WOMAN Aoede `projects/EDU/audio/2026-11-10_ep16-char-v02-woman-aoede-final.wav` · V03 Ton (NEEDS-GEN) · look frames v4-clean, store `projects/EDU/previews/EDU-EP16-SHORT/look-frames-w3/` (see task.md W3.1; user passed LF01–LF05, CR1–CR4 and mask A1, 2026-11-10) · task [task.md](task.md) · [build-notes.md](build-notes.md).
Target: this worktree, branch `claude/education-concept-tasks-308f85` at `80baf2e` (+ uncommitted EP16 work: `src/painted/edu16/` look frames v4) · 30 fps · **durationFrames 1632 (54.40 s)** · 1080×1920 · composition offset 0 (one scene, S01).
Evidence: look frames and stills painted and user-passed; no shot rendered, no blockout, no seek-parity render; timing measured from the audio files (not listened); whisper word times are rough on Thai (build-notes: garbled at L04–L06); viewer check not yet run.
Rows file (R2.1): [review-rows.json](review-rows.json) **EDU-EP16-ROWS-R2.1** (timed start/end, the changed shots' Thai "seen" lines and a `changed` note; review page: pending). Before R2.1 it stayed **EDU-EP16-ROWS-R1.2** (look frames passed; nothing new for the user to see in this timing pass: the B01-SH06 fix moves MAN onto the CR4 still the user already passed). No review page this pass.

## Units, clocks and conventions

- Clocks: **global** `f` = composition frame (= scene-local, offset 0); **shot-local** `+n` = `f − shot start`. Ranges are half-open `[start, end)`; a shot's last frame is `+len−1`. Read time `t` (seconds in the locked narration WAV) → global frame = `round((t + offset) · 30)`, offset **0.00 s** for L01–L03, **0.90 s** for L04–L06 (V01 slot), **2.10 s** for L07 (V02 slot), **2.40 s** for L08–L09 (0.30 s breath after the L07 sting), **3.00 s** for L10–L11 (0.60 s time-jump bridge), **3.30 s** for L12–L13 (0.30 s drop into dusk).
- **Narration placement.** One file placed in six segments, each cut at the middle of the real pause before its first line: A file [0, 13.77) at global 0.00 s; B [13.77, 22.08) at +0.90 s; C [22.08, 25.56) at +2.10 s; D [25.56, 32.16) at +2.40 s; E [32.16, 38.49) at +3.00 s; F [38.49, 48.32) at +3.30 s. The gaps between segments are silence on the narration track (other tracks fill them).
- Character takes (measure.json `lock`, file seconds): **V01** Charon "เอ้ย! อะไรเนี่ย" file 1.28 s, voice 0.27–1.00 s (22 f; internal gap 0.23 s); **V02** Aoede "ทำไมเป็นฉันล่ะ!" file 1.48 s, voice 0.28–1.17 s (27 f). Files are placed by their voice onset (cue table). **V03** Ton's designed caw, est 0.5 s (15 f); Editor fits its onset to f1549.
- Spaces and axes as in the brief's [projection contract](film-brief.md#projection-contract-and-scale-baseline): `P` path set (metres; origin on the path centreline, +x along the path to screen right in side-on views, +y up, +z toward the near lawn; ground y 0), `A` aerial (same origin and axes). Camera lines give `pos` → `look-at`, the focal length `f` in px (1080-wide frame) and `hy` (horizon row, default 960) as `lookCam(pos, at, f, {hy})` in [src/painted/edu16/palette.ts](../../../src/painted/edu16/palette.ts); the look-at point governs. Where a look frame fixed a camera, its constant in [src/painted/edu16/scenes.ts](../../../src/painted/edu16/scenes.ts) (`camLF01` …) is the single source.
- Screen: pixels, origin top-left, y down. Caption band y 1176–1344; faces, masks, the ring, crow heads and beaks, hands on the bird and feet on the wire above y 1160 ([caption-zone rule](film-brief.md#caption-zone-rule)); LBL slot (816–1020, 148–204), widened x 520–1020 for the species tag; `@TamMaiLa` top-left (x < 330, y < 140 clear). Sizes are computed (px = f · size / distance) unless marked `measured` (W3 v4).
- Walk speed 1.3 m/s (= 0.0433 m/f) for every walker; walker x at shot-local `n` is written `x(n)`. Head point for distance checks: MAN (−, 1.70, 0.30), WALKER (−, 1.62, 0.30), WOMAN (−, 1.45, 0.30).
- Marks as R1.1: wire W from PL1 (x −18) to PL2 (+12), `wireY(x) = 5.8 + 0.4·((x+3)/15)²`, z −2.4; spots WS1 −10.0, WS2 −8.5, WS3 −7.0, WS4 −5.5, **WS-H −4.0**, WS5 −2.5, WS6 −1.0, WS7 +0.5, WS8 +2.0; PL1 crossarm x −19 → −17 at y 7.5–7.7; nest K03 (2.0, 5.6, −3.6); NB (2.2, 5.5, −3.8) → (−0.2, 5.9, −2.9); catch spot C0; bench B1 centre (−2.5, 0, −1.6).
- In shot headers `VO C05 +8–+96` is the shot-local voice range of cue C05; word frames in brackets.

## Casting

| Role | Casting line | Notes |
| --- | --- | --- |
| MAN | `man-parted + office, P34, neutral` (catch); walk + `new: coffee-cup`; `new: kneel-net`, `new: hold-bird`, `new: open-hands`, `new: duck-cover`, `new: mask-off` (R2.1: right hand only); `new: kneel-net` in `right` profile (R2.1); P11 (offer, profile), P19 (`drink_cup`) | 1.80 m; MASK-A (**A1 pale latex**, user Q-F5) in shots 1, 3–7, 8 start; MASK-B in 10; bare-faced 8 end, 9, 11, 13; absent from 14–20 |
| MAN voice | V01 "เอ้ย! อะไรเนี่ย" = Charon (user pick W4.1), final take `...-v01-man-charon-final.wav` | voice 22 f; file start f412 |
| WOMAN | `woman-bob + home-lounge, P01, neutral` + `new: tote-bag` (left shoulder); `new: mask-on` → (R2.1: no P06 shrug) turn to `right` and walk; walk; `new: tote-over-head` (shots 12–13) | 1.58 m; in MASK-A A1 from shot 11 +48 |
| WOMAN voice | V02 "ทำไมเป็นฉันล่ะ!" = Aoede (user pick W4.1), final take `...-v02-woman-aoede-final.wav` | voice 27 f; file start f692 |
| WALKER (Q-F3) | `man-spiky + hoodie (tintHoodie #c8962e), walk, neutral`; winter visit adds `new: wool-scarf` (`#8a8d91`) | 1.72 m; MASK-A A1 in shots 16 (a dot), 17, 18, 19, 20; hands free, no coffee; face never shown |
| CROW | `new: crow` (N1, `src/painted/edu16/crow.ts`, look W3): variants `adult`, `adult-ringed` (orange ring, left leg), `young`, `young-ringless`; views `left`/`right`, `front`, `back`, `below` | adult 0.45 m, young 0.38 m |
| CROW voice | V03 one young-crow caw | Ton, NEEDS-GEN, no subtitle |
| Masks | MASK-A = `new: rubber-mask` **A1** (user pick 2026-11-10; A2/A3 dropped), MASK-B = `new: paper-mask-B` | `src/painted/edu16/masks.ts` |
| Props | `new: hand-net`, `new: coffee-cup`, `new: tote-bag`, `new: stick`, `new: wool-scarf` | brief N6 |
| Kit layers | ENV-SKY (morning, seasons, dusk), ENV-GLOW (lamp heads at dusk) | ENV-P02 |

## Shot map

| # | Shot | Beat | Lines | Range (global) | Len | Start s | Camera | One-line read |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | S01-B01-SH01 | B01 | L01 a | [0, 80) | 80 | 0.00 | over the crow's shoulder on the wire, slow push (LF01) | A ringed crow on the wire stares down at a masked walker |
| 2 | S01-B01-SH02 | B01 | L01 b | [80, 150) | 70 | 2.67 | nest-height close | A young crow pops up from the nest, red mouth open, scolding down |
| 3 | S01-B01-SH03 | B01 | L02 a | [150, 235) | 85 | 5.00 | low, long lens, slight push | Campus: the masked man nets a crow on the grass; two ringed crows hop off |
| 4 | S01-B01-SH04 | B01 | L02 b | [235, 278) | 43 | 7.83 | hands close | Calm hands, a ring clicks on, the crow looks at the mask and flies |
| 5 | S01-B01-SH05 | B01 | L03 a | [278, 339) | 61 | 9.27 | test rig, hy 600 (LF02) | The masked man walks with a coffee; the wire crows turn their heads together |
| 6 | S01-B01-SH06 | B01 | L03 b | [339, 408) | 69 | 11.30 | behind the mob at the pole (CR4) | The mob scolds and follows him, 10+ m back |
| 7 | S01-B01-SH07 | B01 | V01 | [408, 448) | 40 | 13.60 | side-on medium | One crow passes low; he ducks: "เอ้ย! อะไรเนี่ย" |
| 8 | S01-B02-SH01 | B02 | L04 | [448, 508) | 60 | 14.93 | medium close, front | Silence; he peels the mask off |
| 9 | S01-B02-SH02 | B02 | L05 a | [508, 546) | 38 | 16.93 | test rig (= shot 5) | Bare-faced: the crows preen |
| 10 | S01-B02-SH03 | B02 | L05 b | [546, 612) | 66 | 18.20 | test rig (= shot 5) | Paper smiley mask: one glance, then preening |
| 11 | S01-B03-SH01 | B03 | L06 | [612, 688) | 76 | 20.40 | two-shot, slight arc | By the bench he hands her the mask; she puts it on, shrugs |
| 12 | S01-B03-SH02 | B03 | V02 | [688, 733) | 45 | 22.93 | side-on medium | One crow passes low; tote over her head: "ทำไมเป็นฉันล่ะ!" |
| 13 | S01-B03-SH03 | B03 | L07 | [733, 838) | 105 | 24.43 | near-lawn wide (LF03) → push to the mask | She is mobbed ahead; he strolls behind, bare-faced, ignored |
| 14 | S01-B04-SH01 | B04 | L08 | [838, 928) | 90 | 27.93 | foot level on the wire, trucking | Feet land: one orange ring, then bare legs |
| 15 | S01-B04-SH02 | B04 | L09 a | [928, 989) | 61 | 30.93 | canopy height, two planes | A ringless crow watches a ringed one scold, then joins |
| 16 | S01-B04-SH03 | B04 | L09 b | [989, 1050) | 61 | 32.97 | crane up and back to aerial, pitch ≈ 57° (LF04A) | Scolding spreads tree to tree over rooftops while seasons turn |
| 17 | S01-B05-SH01 | B05 | L10 | [1050, 1148) | 98 | 35.00 | pulled-back low wide on the nest tree (LF04B), slow push | Seasons; the nest rebuilt; the mask passes again, and again |
| 18 | S01-B05-SH02 | B05 | L11 | [1148, 1250) | 102 | 38.27 | over the crows' shoulders, down to the path | Fledglings beside a ringed parent scold the mask like it |
| 19 | S01-B05-SH03 | B05 | L12 | [1250, 1394) | 144 | 41.67 | along the wire at dusk, slow truck | The ringed crows' spots empty; a few young scold softly |
| 20 | S01-B05-SH04 | B05 | L13, V03, hold | [1394, 1632) | 238 | 46.47 | crane up and push to under the wire (LF05) | One ringless young crow; caw; it looks into the lens; hold |

Total **1632 f = 54.40 s** (target 40–60 s: pass, 5.60 s margin; limit 63 s; W4.2 model 54.42 s; R1.1 est 1629 f). Speech ends f1538 (L13; narration v2: f1521); V03 [1549, 1564); turn to the lens [1564, 1572); closed hold [1572, 1632) = 60 f. Longest answer: OQ3, L03 onset f284 → L04 onset f448 = **5.47 s** (< 10 s); OQ5 V02 voice f700 → L08 onset f847 = 4.90 s; OQ8 L13 [1402, 1538) = 4.53 s. Against R1.1: shot 9 shorter (1.60 → 1.27 s, the L05 phrase "วันที่ไม่ใส่หน้ากาก" reads in 0.9 s), shot 4 shorter (1.76 → 1.43 s), shot 1 shorter (3.10 → 2.67 s), shots 7 and 12 longer (V01/V02 slots 1.33 / 1.50 s), shot 19 longer (4.58 → 4.80 s).

## Measured line edges (W4 lock)

Line edges in read seconds (measure.json `lock`); internal pauses from silencedetect −32 dB / 0.06 s on the same file (this pass; a "…" without a listed pause was read without a gap of 0.06 s at −32 dB).

| Line | Onset s | End s | Global [onset, end) | Internal pauses (s) |
| --- | --- | --- | --- | --- |
| L01 | 0.270 | 4.615 | [8, 138) | 1.034–1.176; **2.513–2.798** ("…") |
| L02 | 5.225 | 9.080 | [157, 272) | 6.292–6.357, 6.506–6.636, 7.467–7.551, 7.804–7.887, 8.558–8.626, 8.786–8.856 ("ที่อเมริกา…" read without a gap) |
| L03 | 9.450 | 13.500 | [284, 405) | **11.099–11.493** ("…") |
| L04 | 14.040 | 15.635 | [448, 496) | **14.334–14.722** ("แต่…") |
| L05 | 16.295 | 19.245 | [516, 604) | 17.863–17.927, **18.190–18.294** ("…"), 18.372–18.438 |
| L06 | 19.800 | 21.830 | [621, 682) | **20.155–20.409** ("แต่…") |
| L07 | 22.325 | 25.270 | [733, 821) | **23.045–23.466** (three runs; first "…"); second "…" no gap |
| L08 | 25.845 | 28.335 | [847, 922) | (r3 read; superseded by narration v2: r9 has no spoken "แต่", L08 [846, 911)) |
| L09 | 28.720 | 31.875 | [934, 1028) | **29.600–29.774** ("…"), 30.116–30.210, 30.536–30.602, 30.971–31.031, 31.122–31.184 |
| L10 | 32.445 | 35.075 | [1063, 1142) | 32.703–32.764, **33.493–33.670** ("…") |
| L11 | 35.455 | 38.170 | [1154, 1235) | **36.771–36.882** ("…") |
| L12 | 38.815 | 42.885 | [1263, 1386) | 39.638–39.706, **39.782–39.923** ("…"), 40.806–40.874, 41.193–41.264, 41.580–41.830 |
| L13 | 43.425 | 47.970 | [1402, 1538) | 44.079–44.145, 44.459–44.534, **44.783–45.062** ("…"), 45.124–45.195, 45.858–46.050, 46.347–46.414 |

**Narration v2 (2026-11-10, accepted r9 read, 46.52 s, no spoken "แต่" in L08).** The table above is the r3-based v1 lock in read seconds. `public/narration/EDU-EP16-SHORT-narration-v2.wav` (narration-place.py, 13 segments) holds every line onset within 0.25 s of v1 (L03 +0.07, L05 -0.10, L06 -0.15, others within 0.08 s); placed onsets, ends and word pegs: [measure.json](measure.json) `lock.narration_v2`. Line ends moved (L07 f808, L08 f910, L13 f1521); caption windows C05-C08, C10 and C13 follow. Picture length unchanged (1632 f).

## Voice and subtitle cues (global, measured)

Captions = VO, Thai verbatim; one cue per line (Editor's caption rules set holds and splits; split only at a word boundary). V03 has no caption.

| Cue | Line | Text | Voice [start, end) | Shot(s) |
| --- | --- | --- | --- | --- |
| C01 | L01 | อีกาบางชนิด จำหน้าคนที่เคยจับมันได้… แล้วลูกมันก็จะร้องด่าหน้านั้นด้วย | [8, 138) (the 1→2 cut at 80 sits in the "…" pause [75, 84)) | 1, 2 |
| C02 | L02 | ที่อเมริกา… คนใส่หน้ากาก จับอีกามาไม่กี่ตัว ใส่ห่วงขา แล้วปล่อยไป | [157, 272) (the 3→4 cut at 235 sits in the pause [234, 237)) | 3, 4 |
| C03 | L03 | พอเขาใส่หน้ากากนี้ เดินผ่านอีกที… อีการุมร้องด่า บินตามไปด้วย | [284, 405) (the 5→6 cut at 339 sits in the "…" pause [333, 345)) | 5, 6 |
| V01 | V01 | เอ้ย! อะไรเนี่ย | [420, 442) (file start f412; caption may hold to 446) | 7 |
| C04 | L04 | แต่… มันจำเขาได้จริงเหรอ | [448, 496) | 8 |
| C05 | L05 | วันที่ไม่ใส่หน้ากาก หรือใส่หน้ากากอื่น… อีกาแทบไม่สนใจ | [513, 608) (v2; the 9→10 cut at 546 is 1 f before "หรือ" f547; no pause there) | 9, 10 |
| C06 | L06 | แต่… ถ้าคนอื่นใส่หน้ากากอันนี้ล่ะ | [617, 686) (v2) | 11 |
| V02 | V02 | ทำไมเป็นฉันล่ะ! | [700, 727) (file start f692) | 12 |
| C07 | L07 | โดนเหมือนกัน… มันไม่ได้จำคน… มันจำหน้า | [733, 809) (v2) | 13 |
| C08 | L08 | อีกาที่รุมด่า หลายตัวไม่เคยโดนจับเลย | [846, 911) (r9: no spoken "แต่") | 14 |
| C09 | L09 | มันเห็นตัวอื่นด่า… ก็ด่าตาม ลามออกไปไกลเป็นกิโล | [934, 1028) (the 15→16 cut at 989 sits in the pause [988, 990)) | 15, 16 |
| C10 | L10 | หลายปีผ่านไป… หน้ากากเดิมออกมาเดินอีกครั้ง | [1063, 1133) (v2) | 17 |
| C11 | L11 | ลูกอีกาที่เกิดหลังวันนั้น… ก็ร้องด่าเหมือนพ่อแม่มัน | [1154, 1235) | 18 |
| C12 | L12 | นานหลังจากนั้น… อีกาที่เห็นวันนั้นตายไปเกือบหมด เสียงด่าก็เบาลง | [1263, 1386) | 19 |
| C13 | L13 | วันนั้นโดนจับไปไม่กี่ตัว… แต่ความจำนี้ ส่งต่อถึงตัวที่ไม่เคยเห็นวันนั้นเลย | [1402, 1522) (v2) | 20 |
| — | V03 | (young crow caw, no caption) | [1549, 1564) (Ton's file, est 0.5 s; Editor fits its onset to f1549) | 20 |

## Word-pegged key frames (R2.0)

`anchor` = the word starts on a measured energy edge (line onset or a pause end, ±0.03 s); `interp` = from faster-whisper word times (large-v3-turbo, this pass, log `out/logs/ep16-words.tsv`, not committed) checked against the syllable count between the nearest anchors (±0.15 s). Editor checks the `interp` pegs by ear at W5 and moves the picture beat, not the audio, if a word lands more than 3 f off.

| Shot | Key frame | Word | Kind | Read s | Local | Global |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | head turns to profile | "จำหน้า" | anchor | 1.18 | +35 | 35 |
| 1 | lean forward | "จับมันได้" | interp | 2.00 | +60 | 60 |
| 2 | nest pop | "ลูกมัน" | interp | 2.95 | +8 | 88 |
| 2 | gape | "ร้องด่า" | interp | 3.50 | +25 | 105 |
| 3 | (line starts; place reads) | "ที่อเมริกา" | anchor | 5.23 | +7 | 157 |
| 3 | mask face clear | "คนใส่หน้ากาก" | interp | 5.90 | +27 | 177 |
| 3 | net down | "จับอีกา" | anchor | 6.64 | +49 | 199 |
| 4 | ring closes | "ห่วงขา" | interp | 8.10 | +8 | 243 |
| 4 | hands open, take-off | "ปล่อยไป" | anchor | 8.63 | +24 | 259 |
| 5 | head-turn ripple | "หน้ากากนี้" | interp | 9.94 | +20 | 298 |
| 5 | nearest crow leans, beak opens | "อีกที" | interp | 10.88 | +48 | 326 |
| 6 | whole row scolding | "รุมร้องด่า" | interp | 11.78 | +14 | 353 |
| 6 | leapfrog lift | "บินตาม" | interp | 12.64 | +40 | 379 |
| 8 | cut dead, turn to front | "แต่" | anchor | 14.04 | +0 | 448 |
| 8 | mask off | "จริงเหรอ" | interp | 15.30 | +38 | 486 |
| 9 | bare face clear | "ไม่ใส่หน้ากาก" | interp | 16.60 | +17 | 525 |
| 10 | (second phrase starts) | "หรือ" | interp | 17.33 | +1 | 547 |
| 10 | MASK-B clear | "หน้ากากอื่น" | interp | 17.55 | +8 | 554 |
| 10 | the one glance | "อีกา" | anchor | 18.29 | +30 | 576 |
| 10 | looks away, preens | "แทบไม่สนใจ" | interp | 18.61 | +39 | 585 |
| 11 | (line starts) | "แต่" | anchor | 19.80 | +9 | 621 |
| 11 | she takes the mask | "คนอื่น" | interp | 20.54 | +31 | 643 |
| 11 | mask on | "หน้ากากอันนี้" | interp | 21.10 | +48 | 660 |
| 11 | shrug | "ล่ะ" | interp | 21.66 | +65 | 677 |
| 13 | key image | "โดนเหมือนกัน" | anchor | 22.33 | +0 | 733 |
| 13 | (second phrase) | "มันไม่ได้จำคน" | anchor | 23.47 | +34 | 767 |
| 13 | MAN sips | "จำคน" | interp | 23.98 | +49 | 782 |
| 13 | push lands on the mask | "มันจำหน้า" | interp | 24.42 | +63 | 796 |
| 14 | (line starts; r9: no spoken "แต่") | "อีกาที่รุมด่า" | anchor | 28.20 | +8 | 846 |
| 14 | ringed foot lands (5 f after the word starts) | "อีกาที่รุมด่า" | interp | 28.37 | +13 | 851 |
| 14 | three bare pairs land | "หลายตัว" | interp | 29.40 | +44 | 882 |
| 14 | fourth bare pair | "ไม่เคยโดนจับ" | interp | 29.77 | +55 | 893 |
| 15 | head tilt | "เห็น" | interp | 28.80 | +8 | 936 |
| 15 | the copy | "ก็ด่าตาม" | anchor | 29.77 | +37 | 965 |
| 16 | first clusters beyond the campus | "ลาม" | anchor | 30.60 | +1 | 990 |
| 16 | many streets lit | "เป็นกิโล" | interp | 31.32 | +23 | 1012 |
| 17 | visit 1 (winter) | "หลายปี" | anchor | 32.45 | +13 | 1063 |
| 17 | visit 2 (near) | "หน้ากากเดิม" | anchor | 33.67 | +50 | 1100 |
| 17 | mask centre frame | "อีกครั้ง" | interp | 34.68 | +80 | 1130 |
| 18 | (line starts) | "ลูกอีกา" | anchor | 35.46 | +6 | 1154 |
| 18 | young clear | "เกิดหลังวันนั้น" | interp | 36.04 | +23 | 1171 |
| 18 | the copy | "ก็ร้องด่า" | anchor | 36.88 | +48 | 1196 |
| 18 | three in step | "พ่อแม่" | interp | 37.54 | +68 | 1216 |
| 19 | state 1 (full wire) | "นานหลังจากนั้น" | anchor | 38.82 | +13 | 1263 |
| 19 | (second phrase) | "อีกาที่เห็น" | anchor | 39.92 | +47 | 1297 |
| 19 | state 2 (WS1, WS3 empty) | "ตายไป" | anchor | 40.87 | +75 | 1325 |
| 19 | state 3 (WS5 empty) | "เกือบหมด" | interp | 41.18 | +84 | 1334 |
| 19 | WALKER under the wire | "เสียงด่า" | anchor | 41.83 | +104 | 1354 |
| 19 | soft young calls | "เบาลง" | interp | 42.46 | +123 | 1373 |
| 20 | (line starts) | "วันนั้น" | anchor | 43.43 | +8 | 1402 |
| 20 | walker gone | "ไม่กี่ตัว" | anchor | 44.15 | +29 | 1423 |
| 20 | (second phrase) | "แต่ความจำนี้" | anchor | 45.06 | +57 | 1451 |
| 20 | push settles on the crow | "ส่งต่อ" | anchor | 46.05 | +86 | 1480 |
| 20 | (last phrase) | "ไม่เคยเห็นวันนั้นเลย" | interp | 47.00 | +115 | 1509 |

Unpegged picture beats: V01 voice [420, 442), V02 voice [700, 727), V03 [1549, 1564), turn to the lens [1564, 1572), end f1632.

## On-screen text (global ranges)

Exactly brief VD25 (Q-F1: no time cards; Q-F2: the tag once, on the L02 line).

| Text | Range | Shot(s) |
| --- | --- | --- |
| "อีกาอเมริกัน · ภาพจำลอง" (LBL widened x 520–1020), one continuous appearance | [150, 278) | 3 (+0) – 4 (end) |
| No label | every other frame | — |
| Captions | per the cue table; V01, V02 subtitled; V03 none | all |

No time cards, no numbers, no names; every set item textless.

## Rules for every shot

- **R01 Label.** The species tag on [150, 278) only; the slot empty elsewhere.
- **R02 Truth limits.** As the brief's [truth limits](film-brief.md#truth-limits): gentle catch; every following crow ≥ 10 m (straight line in `P`) from the masked walker's head; one low pass per walker (shots 7, 12); the other mask draws one glance; seasons visible across the spread and the young; L12 absence only; no number on screen.
- **R03 Size reference.** Every shot keeps a person, the bench, a lamp post, the path joints, the wire/poles or a branch next to a crow in frame; in `A` the street grid.
- **R04 Feet locked.** Perched crows' feet on the wire curve (`wireY`), branch, grass or in the hands (≤ 2 px drift); the ring on the left leg.
- **R05 Screen (R2.1).** Faces, masks, rings, crow heads, hands, the net on the crow and every contact stay above y 1160 on every frame where a caption shows (the composition gate; checked on `caption-zone.py --overlay-dir` frames). Captions use the channel's edu stroke look (`CAPTION_OUTLINE`, white with the warm-black stroke and halo) **with no plate by default** (R2.1, replacing R2.0's "fitted dim plate is the default"). Editor adds the fitted dim plate only on a shot where a frame check at phone size (360 px wide) shows the stroke alone failing on that shot's brightest caption frame, at the lowest step that reads (0.3, then 0.4; never above 0.5), and records the value and frame per shot ([caption backdrop](../../../docs/production-requirements.md#caption-backdrop), [UT12 caption shade](../../../docs/user-taste.md#captions)). Reason: on this sunlit pastel set the luma target (mean ≤ 0.25) can only be met by a near-black plate (CALM 0.5–0.92 = brightness 0.5–0.08), which the Draft shows as dark boxes; the luma numbers stay recorded as information. A plate never shows without its text (same gate and ramp as the text).
- **R06 Ambient clocks.** Breath, blink, wire sway, leaf flutter, feather ruffle and lamp glow run on ambient clocks through holds (DF-20261030-painted-story-hold-ambient-clock); the season clock is an event clock (shot-local).
- **R07 Continuity.** WS-H in shots 1 and 20; MAN's coffee in his right hand on every MAN walk (shots 1, 5–7, 9, 10, 13; R2.1: out of frame in 8, below the MCU's bottom edge); WALKER hands free; MAN absent from 14–20; tote on her left shoulder until shot 12 +6, then held over her head through shot 13 (R2.1); walkers walk +x; morning light 1–15; seasons 16–17; `later` 17 end–18; dusk 19–20. MAN's walk line in B01: shot 1 x −3.72 → −0.29 (day 0 morning), shot 5 −11.9 → −9.3, shot 6 −7.3 → −4.35, shot 7 −4.3 → −3.95, shot 8 stops at −3.9 (the 5→6 cut elides 2.0 m, about 1.5 s; R2.0).

## Per-shot staging

Key frames shot-local `+n`. Sound lines give the shot-local frame, the brief's code or library ID ([Sound direction](film-brief.md#sound-direction)) and a short description (source / action / material / space / length / feeling); every library ID is "not listened" and Ton checks it against its description before use; NEEDS-GEN = Ton makes it. Mix intent per the brief's arc; Editor sets levels.

**1. S01-B01-SH01** [0, 80), 80 f. VO C01 +8–+80 (continues into shot 2; "จำหน้า" +35, "จับมันได้" +60).
- Camera (W3 LF01: shifted left-back so MAN stays in frame below the crow): `lookCam` pos (−4.55, 6.29, −2.98) → (−4.45, 6.25, −2.82), look-at (−1.9, 1.2, 0.7) → (−0.9, 1.2, 0.7), f 1100, hy 900, near 0.05; slow linear push and pan with MAN; at +35 it passes `camLF01` (pos (−4.5, 6.27, −2.9), look-at (−1.4, 1.2, 0.7)). Measured at LF01 (+35): crow length 601 px, head 163 px, ring 16 px, MAN mask 71 px. Start and end values `est`; Boss checks the crow head ≥ 120 px and MAN's head inside x 80–1000 on +0 and +79.
- Staging: `P` `day0` morning. `adult-ringed` crow at WS-H, `back` view, head `profile-right` from +35; feet on the wire, the orange ring in view. MAN in MASK-A walks +x below, x(n) = −3.72 + 0.0433 n (x −2.2 at +35), coffee in his right hand. +35 head turn to profile tracking him (cut-on-turn of the head card); +60 it leans forward 6°. NT and the nest soft beyond.
- Key frames: +0 reads "a crow on a wire watching a masked person" (UT01); +35 head turn; +60 lean; +79 last frame.
- Sound: A1 `outdoor_park-birds-breeze_01` from +0 (morning songbirds and leaf breeze; Ton confirms no crow calls in it); **A1b** NEEDS-GEN at +6: one distant crow caw far across the lawns, single, light reverb, 1 s (the crows are here); S10 MAN's steps faint below from +0 (NEEDS-GEN: leather office shoes on a dry concrete path, unhurried, about one step per 14 f, 6 m away, quiet). No music.
- Entry → exit: over the crow → its profile locked on the walker.

**2. S01-B01-SH02** [80, 150), 70 f. VO C01 +0–+58 ("ลูกมัน" +8, "ร้องด่า" +25).
- Camera: `lookCam` pos (1.20, 5.95, −2.55) → (1.30, 5.92, −2.70), look-at (2.0, 5.70, −3.6), f 1300; slow push +0–+69. Nest at ≈ 1.3 m: ≈ 600 px wide; the young's head and neck ≈ 150 px (`est`).
- Staging: NT canopy, dappled light, leaves soft in front. +8 a `young` crow pops its head over the nest rim (`nest-pop`, 5 f), blue-grey eye; +25 it opens its red-pink gape wide and scolds down out of frame bottom toward the path (gaze down-left), pumping on the gape through +60.
- **R2.1 look (Draft: the nest reads as a wooden crate of parallel planks; the young reads as a sleek adult).** Nest K03 is a rounded bowl of crossing sticks: 25–40 twigs at varied angles (no two parallel neighbours, ends poking out 0.03–0.10 m past the rim), a darker cup inside, a ragged rim line, contact shadow on the fork. The `young`: head about 0.8× the adult's, loose grey-black tufts sticking up on the crown and nape (3–5 spikes), stubby tail, the pink rictal flange visible at the bill corners even when closed, blue-grey eye (brief VD crows). Check at 270 px: "a baby bird in a stick nest".
- Key frames: +0 the nest still; +8 pop; +25 gape; +69 last frame.
- Sound: **C3** (short) at +8: a tiny rough fledgling squeak as it pops up, close in the tree, 0.2 s; **M0** NEEDS-GEN from +8: a soft low muted double thump like a slow heartbeat with a faint high string harmonic, one rise, no hit, 2 s (uneasy); **C3** at +25: one young begging-scold "aah", higher, rough, nasal, wobbly, close in a tree, 0.5 s (small and rude); A1 down to −14 dB under NAR.
- Entry → exit: the nest still → the young scolding.

**3. S01-B01-SH03** [150, 235), 85 f. VO C02 +7–+85 (continues into shot 4; "คนใส่หน้ากาก" +27, "จับอีกา" +49).
- Camera (**R2.1**, side-on and slightly high; Draft: the front kneel foreshortened his thighs so he read as a short-legged man standing, and the net and crow sat in the caption band): `lookCam` pos (−5.55, 1.10, −0.85) → (−5.55, 1.08, −1.10), look-at (−5.60, 0.35, −3.70), f 1200; slight push +0–+84 (linear). Pitch ≈ −14.7°. Computed (`est`): MAN kneeling (head top ≈ 1.25 m) at ≈ 2.9 → 2.65 m: head top y ≈ 577, knees and the grass contact y ≈ 1095, ≈ 520 → 570 px; the crow on the grass ≈ 180 px, its feet y ≈ 1095, body y ≈ 980–1095; the hoop on the crow y ≈ 1050–1100; the band y 1176–1344 is plain lawn in front of them; horizon y ≈ 645 with the hall and firs behind his head (UT01 "American campus"). Boss checks on +0, +49, +84: knees, shins and the crow's feet above y 1160.
- Staging: `P` `day0` (the catch day). Species tag in the slot from +0. MAN in MASK-A, **`right` profile** (R2.1), `new: kneel-net` (P34 kneel: shins flat on the grass, sitting back toward the heels, torso upright), kneels at C0 (−5.95, 0, −3.70) facing +x with the net raised behind his shoulder; an `adult` crow walks on the grass in front of his knees at (−5.30, 0, −3.70) (R2.1; R2.0 (−5.78, 0, −3.15)); two `adult-ringed` crows start at (−6.6, 0, −3.4) and (−5.0, 0, −3.4) and hop away −x and +x (screen left and right) +0–+14, 4.0 m each, and leave frame (already released: "ไม่กี่ตัว"). The hoop swings forward over the crow (+x) when it lowers. +27 the mask face clear (MAN's head turns down to the crow); +41–+49 the hoop lowers and settles gently over the crow; +49 the mesh drapes; the crow crouches still, no flapping.
- Key frames: +0 the place reads as an American campus (brick hall, firs, maples); +27 mask; +49 net down; +84 last frame.
- Sound: **M1** NEEDS-GEN enters at +0 (sly-curious campus bed: plucked low strings, muted kalimba, dry woodblock off-beats, 96 bpm; energy 2); S1 (short) at +4: two crows' small hop-flaps, feathers and air, close-medium, 0.3 s; **S5** NEEDS-GEN +41 → settle +49: a soft nylon mesh net on a wooden pole lowering through air onto grass, hushed swish and soft settle, outdoors, 0.7 s (calm); A1.
- Entry → exit: kneeling with the net up → the crow under the net.

**4. S01-B01-SH04** [235, 278), 43 f. VO C02 +0–+37 ("ห่วงขา" +8, "ปล่อยไป" +24).
- Camera (**R2.1**: the Draft framed his whole upper body with the crow in the caption band and the take-off crossing the mask; the camera now faces him from +x, matching his shot 3 facing): `lookCam` pos (−4.85, 0.75, −3.70) → (−4.91, 0.76, −3.70), look-at (−6.20, 0.55, −3.70), f 1000; slight push +0–+42. MAN kneels at C0 in `front` view to this camera (he faces +x, as in shot 3). Computed (`est`): the crow in his hands at (−5.70, 0.58, −3.70), ≈ 0.85 m: ≈ 520 px long, centred x ≈ 540, y ≈ 1010; mitten hands ≈ 118 px; ring ≈ 17 px; MASK-A centre y ≈ 470, x 420–660 (the whole mask in the upper frame, so the crow can look up at it); the band y 1176–1344 over his navy trousers and lap.
- Staging: `new: hold-bird`: two mitten hands (UT14) hold the crow (`held`: wings folded, smooth, eye open, calm). +2–+8 one hand slips the orange ring onto its left leg (the leg toward the lens); it closes at +8. +12–+20 the crow turns its head up to the mask (memory moment). +24 `new: open-hands`: the hands open to about ±0.30 m (hands y ≈ 1000, above the band); **+24–+34 the crow springs up and to screen right on a rising arc from (540, 1010) to beyond the right edge at (1180, 300) (`takeoff`, wings up on +25)**; at y ≤ 600 its body is at x ≥ 880, so it never crosses the mask box (x 400–680, y 300–560). No struggle at any frame.
- Key frames: +8 ring; +16 the look up; +24 take-off; +34 out of frame; +42 empty hands.
- Sound: **S4** NEEDS-GEN at +8: a small plastic leg band snapping shut, one tiny crisp click, close, dry, 0.15 s (precise and gentle); **S1** NEEDS-GEN at +24: a crow springing up, three or four strong wingbeats, feathers and air, close, 0.6 s (lift and freedom); M1 continues.
- Entry → exit: the held crow → empty open hands.

**5. S01-B01-SH05 (test rig)** [278, 339), 61 f. VO C03 +6–+61 (continues into shot 6; "หน้ากากนี้" +20, "อีกที" +48).
- Camera **RIG** (W3 LF02: hy 960 → 600 lifts MAN whole above the band): `RIG(x_w) = lookCam(pos (x_w + 0.2, 0.95, 3.6), look-at (x_w + 0.4, 2.3, −0.8), f 900, hy 600)`, trucking with him, x_w = x(n) = −11.9 + 0.0433 n (−11.9 → −9.3; −10.6 at +30 = `camLF02`). Measured at LF02: MAN 571 px, mask 147 px, nearest wire crow 56 px.
- Staging: `P` `day0` light (a later day; no card, Q-F1). MAN in MASK-A, walk `right`, coffee in the right hand. Six crows on the wire (x −15.5, −14.5, −13.0, WS1, WS2, WS3; LF02 `wireRow`). +20 all heads turn to him in a ripple from the nearest (2 f apart); +48 the nearest crow (WS1) leans forward 16°, beak opening. **R2.1 (Draft: at ≈ 56 px a head turn alone does not read at phone size):** with each head turn the whole bird pivots on its feet to `front` toward him (4 f) and gives one wing flick and tail flare (6 f), so the silhouette changes; feet stay locked. The same rule makes shot 9's preening (bill buried in the lifted wing) and shot 10's one glance (+30 pivot to `front`, +39 back) read; check shots 5, 9, 10 side by side at 270 px.
- Key frames: +20 ripple; +48 lean; +60 last frame.
- Sound: A1; S10 leather steps close (one per 14 f); M1 sly figure; **C2** NEEDS-GEN at +55: one harsh adult "caw" with a short burst after it, raspy, loud, close outdoors, 0.6 s (the mob about to start).
- Entry → exit: walking in → walking on under turned heads.

**6. S01-B01-SH06** [339, 408), 69 f. VO C03 +6–+66 ("รุมร้องด่า" +14, "บินตาม" +40). **R2.0 fix: MAN moved forward so every following crow is ≥ 10 m from his head (W3 finding: 8.6 m at the R1.1 start mark).**
- Camera (W3 CR4: turned down and right so the row is the near foreground and MAN is ahead): `lookCam` pos (−19.8, 6.9, −0.9) → (−19.4, 6.9, −0.9), look-at (−10.6, 3.2, −1.2) → (−7.8, 3.2, −1.2), f 1000, hy 800, near 0.05; linear truck and pan, passing `camCR4` (pos (−19.6, 6.9, −0.9), look-at (−9.0, 3.2, −1.2)) at +39. T1 hidden in this shot (CR4 `skip T1`: the camera sits at its canopy edge). Foreground crows at 1.5–3 m: 110–220 px (cropped at the frame edges); MAN at ≈ 14–15.5 m: ≈ 120–130 px (`est`; recorded lead exception: the gap is the point, brief).
- **R2.1 (Draft: the six wire crows 0.4 m apart in profile overlap into one black blob in the tree):** every mob crow faces +x (toward MAN, the way they follow), so from this camera the bodies are `back` views (narrow, ≈ 0.18 m) with the head turned `profile-right` and back on each scold pump (alternate birds `profile-left`), open beaks in profile; no two bodies overlap by more than a quarter of their width; the wire stays visible between them; T1's leaves are not drawn behind the row (sky or the far lawn behind).
- Staging: MAN in MASK-A walks x(n) = −7.3 + 0.0433 n (−7.3 → −4.35; −5.6 at +39 = CR4). Mob, all `scold` (beak open, body pump, wing flick, tail flare; seeded phase offsets): six on the wire at x −18.0, −17.6, −17.2, −16.8, −16.4, −16.0 and two on the PL1 crossarm at (−17.3, 7.7, −2.4), (−18.7, 7.7, −2.4). +40 the two crossarm crows lift, fly forward over the row and land on T2's top at (−12.2, 8.4, −4.4) on +54 and (−11.4, 8.6, −4.6) on +58 (CR4 positions); +56–+66 the two rearmost wire crows hop forward along the wire to x −15.2 (+62) and −14.8 (+66). MAN glances back once (+44–+52, head `left` 3 f cut-on-turn and back).
- Distances (straight line to MAN's head (x(n), 1.70, 0.30), computed): at +0 wire row 10.1–11.9 m (front crow x −16.0: 10.1 m), crossarm 12.0 / 13.2 m; landings T2 top 10.9 m (+54, MAN x −4.96) and 10.7 m (+58, x −4.79); wire hops 11.8 m (+62) and 11.6 m (+66); every other distance grows as he walks. Rule: no perch closer than 10.0 m at any frame (Boss prints the minimum per frame in the shot's measure).
- Key frames: +0 the row scolding, MAN ahead; +14 whole row on "รุมร้องด่า"; +40 lift; +58 T2 landings done; +66 shuffle done; +68 last frame.
- Sound: **C1** NEEDS-GEN in at +0 (energy 3): five to seven American crows mobbing, harsh rapid caw bursts overlapping, near and far in the trees, raspy nasal voices, light reflections off a building, 8 s loop + near-left / near-right stems, panned with the row (pestering, outraged, comic-menacing); **C2** accents at +14 and +30; **S1** at +40 (two birds' take-off flaps, 0.6 s); **S3** NEEDS-GEN branch variant at +54 and +58: wings braking in a short flutter onto leafy twigs, a soft leaf rustle, no wire creak, medium distance, 0.4 s; **S3** wire variant at +62 and +66: short flutter and a tiny grip creak on a taut wire, close, 0.4 s; M1 ducked to −18 dB.
- Entry → exit: the row scolding → the mob advanced, him still 10+ m ahead.

**7. S01-B01-SH07** [408, 448), 40 f. V01 file from +4, voice +12–+34.
- Camera: `lookCam` pos (x_w + 0.3, 1.40, 2.75), look-at (x_w + 0.2, 1.35, 0.3), f 1000, x_w −4.3 → −3.95 (walk +0–+8, then the duck carries 0.1 m). MAN at ≈ 2.45 m: head to knees, ≈ 740 px full-height scale (UT13). Bench B1 behind him at ≈ 4.4 m (size reference; keep its back line soft).
- Staging: MAN in MASK-A walking `right`; one crow (`low-pass`, `below`/profile) comes from behind (screen left) at 0.6 m above his head, +0–+7 across frame, out right; +8–+11 he ducks (`new: duck-cover`: knees bent, head down, left arm over the head, cup arm out); +9 coffee sloshes from the lid (three drops, gone by +18). The mob scolds from the wire above-behind (out of frame, heard). +12 V01 in the duck; +36–+39 he starts to straighten.
- Key frames: +3 the crow over his head; +8 duck; +12 V01 voice; +39 last frame.
- Sound: **S2** NEEDS-GEN +0–+15: one large bird passing about half a metre over a head from behind, feathery air whoosh with a slight doppler, no call, outdoors, 0.5 s (a start); **S9** NEEDS-GEN at +9: hot coffee sloshing inside a lidded paper cup as the holder ducks, a small splash out of the lid, close, 0.4 s (a fluster); V01 (file +4) in the clear; C1 continues, −10 dB under V01, up to −4 dB +35–+39.
- Entry → exit: walking → ducked, cup held out.

**8. S01-B02-SH01** [448, 508), 60 f. VO C04 +0–+48 ("แต่" +0, pause +9–+21, "จริงเหรอ" +38).
- Camera (**R2.1, medium close-up**; R2.0's numbers framed him full length, so his shirt, hands and the hanging mask filled the caption band at +46–+59 and the cup had to be shown): `lookCam` pos (−3.90, 1.50, 1.20) → (−3.90, 1.50, 1.10), look-at (−3.90, 1.50, 0.30), f 1600, hy 1003; creep in +0–+59 (linear). Computed at +0 (`est`, d 0.90 m, ≈ 1778 px/m): head top y ≈ 470, MASK-A ≈ 480 px tall (y ≈ 450–930), chin ≈ 896, shoulders ≈ 1003–1090; band y 1176–1344 = Y 1.40–1.31 m, his upper chest (navy lapels, shirt and tie); frame bottom = Y ≈ 0.98 m, so both hands at rest (wrists ≈ 0.85–0.90 m) and the coffee cup are **below the frame**. Background: the hall and bench B1 soft behind his shoulders. Boss checks on +0, +40, +50, +59: no hand, mask or face inside y 1160–1344.
- Staging: MAN stops at x −3.9 and straightens (`right`); +0 cut-on-turn to `front`, still through the pause (arms at rest, out of frame); **R2.1 one-hand peel** (`new: mask-off`, right hand only; the left arm stays in the P01 hang below the frame with the cup): +34–+38 the right hand rises into frame at screen left and takes MASK-A's chin; +38–+46 it lifts the mask up and off over his head and out of the frame top (the mask leaves upward; it is not seen again in this shot); +46 his face (`suspicious`, eyes up toward screen left where the wire was), hair mussed into a tuft; +46–+52 the right arm, still holding the mask, swings out sideways and down beyond the frame's left edge (hand and mask at x < 0; only the shoulder and upper arm in frame, outside the caption block x 321–759). He keeps the mask off screen (he hands it over in shot 11); shot 9 does not show it (he walks bare-faced, cup in the right hand).
- Key frames: +0 everything stops; +38 peel; +46 face; +59 last frame.
- Sound: C1 and M1 **cut dead at +0** (one frame); A1 only, −8 dB in the gap; **S6** NEEDS-GEN at +38: a rubber latex mask pulled up and off a head, a stretchy squeak and a soft slap as it comes free, close, dry, 0.7 s (comic relief).
- Entry → exit: masked, still → bare-faced, mask in hand.

**9. S01-B02-SH02 (test rig)** [508, 546), 38 f. VO C05 +8–+38 ("ไม่ใส่หน้ากาก" +17).
- Camera **RIG** (= shot 5, hy 600), x_w = −11.4 + 0.0433 n (−11.4 → −9.8).
- Staging: another day, the same light. MAN bare-faced, walk `right`, coffee. The same six crows on the same perches preen (`preen`); one scratches its head with a foot (+10–+24); none looks at him.
- Key frames: +17 his bare face clear under the wire; +37 last frame.
- Sound: A1 normal birdsong; **S11** NEEDS-GEN at +10: a perched crow fluffing its feathers and running its bill through them, soft feather rustle, close, 0.6 s (calm indifference); S10 steps; M1 resumes softly at +0 (energy 1.5).
- Entry → exit: as shot 5, nothing happens.

**10. S01-B02-SH03 (test rig)** [546, 612), 66 f. VO C05 +1–+58 ("หรือ" +1, "หน้ากากอื่น" +8, "อีกา" +30, "แทบไม่สนใจ" +39).
- Camera **RIG** (= shot 5, hy 600), x_w = −12.0 + 0.0433 n (−12.0 → −9.2).
- Staging: MAN in MASK-B (paper smiley), walk `right`, coffee. +8 the mask clear; +30 the nearest crow (x −13.0) `glance`s down at him (6 f head turn); +39 it looks away and preens; the rest never look.
- Key frames: +8 MASK-B; +30 glance; +39 look away; +65 last frame.
- Sound: **S8** NEEDS-GEN at +2: a stiff paper plate mask lifted to a face, light papery rustle and an elastic twang, close, 0.4 s; **C4** NEEDS-GEN at +39: one flat, low, short adult caw, no follow-up, dry, medium distance, 0.4 s ("meh"); A1; M1 soft.
- Entry → exit: as shot 5, one glance.

**11. S01-B03-SH01** [612, 688), 76 f. VO C06 +9–+70 ("แต่" +9, "คนอื่น" +31, "หน้ากากอันนี้" +48, "ล่ะ" +65).
- Camera: `lookCam` pos (−2.2, 1.35, 3.6) → (−2.5, 1.35, 3.3), look-at (−2.6, 1.25, 0.3), f 1050; slight arc +0–+75. MAN ≈ 573 px, WOMAN ≈ 503 px (`est`).
- Staging: by the bench B1. MAN (−3.2, 0, 0.3) bare-faced, `right`, holds MASK-A out (P11) from +9; WOMAN (−2.0, 0, 0.3), `left`, tote on her left shoulder, takes it at +31; cut-on-turn to `front` at +40; `new: mask-on` +44–+52 (both hands pull it down; her bob shows at the nape); **R2.1 (no front shrug pose exists; the shrug is replaced, no new pose):** +52–+64 hands back to her sides (P01), mask on, facing the lens, still; +65 on "ล่ะ" cut-on-turn (3 f) to `right` and she sets off walking +x with the kit walk, x(n) = −2.0 + 0.0433 (n − 66) (−2.0 → −1.6 by +75), tote still on her left shoulder; MAN stays `right`, bare-faced, and watches her go (head only). The beat now reads "she puts it on and goes to test it", leading into shot 12's walk.
- Key frames: +31 hand-over; +48 mask on; +65 turn and first step; +75 last frame.
- Sound: M1 a step faster from +0 (energy 2); **S7** NEEDS-GEN at +48: a rubber latex mask pulled down over a head, a stretchy rub and a snap at the neck, close, dry, 0.6 s; A1; **R2.1:** her first two steps `foley_walk-sneakers-asphalt_01` at +68 and +74 (the same steps as shot 12; "unhurried walking sneakers on dry asphalt, close and dry": fits), carrying straight into shot 12.
- Entry → exit: two people talking → her in MASK-A, walking off to test it (R2.1; R2.0 "shrugging").

**12. S01-B03-SH02** [688, 733), 45 f. V02 file from +4, voice +12–+39.
- Camera: `lookCam` pos (x_w + 0.3, 1.25, 2.55), look-at (x_w + 0.2, 1.20, 0.3), f 1000, x_w 0.3 → 1.9 (R2.0: moved ahead so shot 13 picks her up at x 2.3). WOMAN ≈ 711 px scale, head to knees (`est`).
- Staging: WOMAN in MASK-A walking `right`; one crow passes low from behind 0.6 m above her head +0–+7; +6–+12 she swings the tote up over her head (`new: tote-over-head`), still walking; V02 at +12. **R2.1 (Draft: at 270 px the tote is hidden and the pose reads as a hand at her face):** from +12 the whole tote bag sits above the mask's top (bag bottom ≥ 0.05 m above the head top), both hands up holding its two sides, forearms beside the head; the near forearm never covers the mask's eye or grin.
- Key frames: +3 the pass; +12 tote up, V02; +44 last frame.
- Sound: C1 chorus back at +0 (the same sound as B01: the same face); **S2** +0–+15 (one low pass, as shot 7); **S18** NEEDS-GEN at +6: a canvas tote bag swung up over a head, cloth flap and a rattle of keys inside, close, 0.5 s; her steps `foley_walk-sneakers-asphalt_01` ("unhurried walking sneakers on dry asphalt, close and dry": fits) from +0; V02 (file +4) in the clear, C1 −10 dB under it.
- Entry → exit: walking → tote over her head.

**13. S01-B03-SH03** [733, 838), 105 f. VO C07 +0–+88 ("โดนเหมือนกัน" +0, "จำคน" +49, "มันจำหน้า" +63).
- Camera (W3 LF03: the sheet's camera left both walkers out of frame; re-placed on the near lawn ahead of her at about 34° off her side axis): hold `camLF03` = `lookCam` pos (5.2, 1.45, 3.0), look-at (−0.6, 2.6, −1.3), f 1000, hy 680 from +0 to +36; push (ease-in-out) +36–+72 to pos (x_W(72) − 0.6, 1.65, 1.9) = (4.8, 1.65, 1.9), look-at her head (x_W(72), 1.50, 0.3) = (5.4, 1.50, 0.3), f 1050, hy 860 (hy eases 680 → 860 with the push); +72–+104 truck +x with her at her pace (pos and look-at x += 0.0433/f). End: her head ≈ 245 px at ≈ 1.7 m, MASK-A filling the upper middle; camera ≤ 35° off her side axis throughout (`est`; Boss checks the mask stays above y 1160 at the end). Measured at LF03 (+20): WOMAN 486 px, mask 143 px, mob 10.6–21.9 m from her head, MAN to mob 6.3 m.
- **R2.1 (Draft: the end of the push put her arms, hands and the tote at her hip in the caption band; cold viewers could not tell the crows were after her, because the truthful 10 m rule keeps them nearer him).** Camera unchanged. (1) She keeps `new: tote-over-head` (shot 12's held pose, walking, `right`) for the whole shot, so at the push end (+72–+104; her head ≈ 1.7 m from the lens, ≈ 614 px/m, mask y ≈ 810–950, tote y ≈ 570–760) the band y 1176–1344 lies on her sweater hem and trousers (Y ≈ 0.98–0.71 m) with no hand or bag in it; the near forearm never covers the mask's eye or grin. (2) Every mob crow faces +x toward her: wire and T2 birds in `back` or `right` view with heads `profile-right`, open beaks pointing her way on the scold pumps; the two leapfrog flyers fly +x; none faces MAN. (3) Measurement note: the W5.3 caption-zone fail at +92 was sampled 2 f before the C07 plate finished fading out (plate at 0.67 of its strength); the C07 caption is gone by +94 (Draft frame `s13_90`). Editor samples only frames where the text is fully on.
- Staging: WOMAN in MASK-A walks x_W(n) = 2.3 + 0.0433 n (2.3 → 6.8; 2.8 at LF03); MAN 6 m behind, x_M(n) = −3.7 + 0.0433 n, bare-faced, coffee, P19 sip +49–+62, relaxed. The mob (LF03 `MOB3` + flyers) perches on the wire and T2 above and around **him** (3–6 m from him) and scolds **her** 10+ m ahead; leapfrog: one crow from WS3 to WS4 landing ≥ +40 (she x ≥ 4.0), one to WS-H landing ≥ +60 (she x ≥ 4.9) (computed 10.7 / 10.2 m); no crow looks at him. +63 the push is near the mask; +72 lands.
- Key frames: +0 the whole picture (key image; LF03 at +20); +49 MAN sips under the scolding crows; +63 "มันจำหน้า"; +72 mask close (K02 paid); +104 last frame.
- Sound: C1 kept on her side of the stereo field (screen right); MAN's leather steps calm in the clear on the left; **S12** `stinger_low-muted-hit_01` ("short low muted stinger hit with fast decay": fits) at +63 under "มันจำหน้า"; M1 energy 2.5, phrase end by +100.
- Entry → exit: the wide two-walker image → the mask.

**14. S01-B04-SH01** [838, 928), 90 f. VO C08 +8–+73 (r9, no spoken "แต่": "อีกาที่รุมด่า" +8, ring lands +13, "หลายตัว" +44, "ไม่เคยโดนจับ" +55).
- Camera (**R2.1**: R2.0's level camera at x 2–4 looked straight into the nest tree NT (x 2.5, canopy r 3.5), so the Draft shows foliage, and a level lens at wire height sees the hall behind; the camera now sits below the wire in the open stretch between the trees at x −11 and NT, looking up so the feet stand against the sky): `lookCam` pos (x_c, 5.05, −1.30), look-at (x_c, 6.01, −2.40), f 1200 (pitch ≈ 41°); x_c(n) = −6.3 + 0.027 n for +0–+60 (−6.3 → −4.68), easing to a stop at −4.60 by +75, held to +89. Computed (`est`, slant to the wire ≈ 1.34 m, ≈ 895 px/m): the wire at y ≈ 1075 (wireY ≈ 5.81 here); feet and rings just above it (y ≈ 1040–1070), above y 1160; bodies seen from below, y ≈ 880–1070; ring ≈ 13 px, feet ≈ 54 px; frame ≈ 1.2 m of wire wide (±0.60 m around x_c); sky behind everything above y ≈ 1176 (elevation > 23°, above the hall roof); the band y 1176–1344 = sky over the hall's slate roof (plain). No tree canopy in frame (Boss checks; if the x −11 canopy edge shows at the left on +0, start at x_c −6.1).
- Staging: crows `land` on the wire one by one in **`left` profile** (R2.1: facing −x, so the left leg and the ring are on the near side), legs forward, wings braking, at least 0.45 m apart (R2.1; the Draft's 0.3 m let a landing crow read as standing on another's back): +0–+12 the empty wire; +13 the first, `adult-ringed`, lands at x −6.05, the orange ring clear; bare pairs land at x −5.65 (+43), −5.20 (+47), −4.75 (+51) and −4.30 (+57) (each inside the frame at its landing frame: windows +43 (−5.74, −4.54), +51 (−5.52, −4.32), +57 (−5.36, −4.16)); +89 three bare pairs in frame. Their open beaks scold above (from below we see chins and open bills).
- Key frames: +13 ring; +43 bare legs; +57 fourth; +89 last frame.
- Sound: M1 thins to 1.5 at +0; **S3** wire landings at +13, +43, +47, +51, +57; **S13** NEEDS-GEN: tiny dry ticks of bird feet gripping a wire, close, 0.3 s, at +45, +49, +53, +59, and the variant with a faint plastic tick on the band at +15 (the ringed one); C1 distant.
- Entry → exit: an empty wire → a row of feet, one ringed.

**15. S01-B04-SH02** [928, 989), 61 f. VO C09 +6–+61 (continues into shot 16; "เห็น" +8, "ก็ด่าตาม" +37).
- Camera (**R2.1**: R2.0's aim put the near ringless crow about 35° off the lens axis, outside the frame, so the Draft shows one small crow in a whole tree; re-aimed along −x, over the near crow's shoulder): `lookCam` pos (10.3, 6.80, −3.45) → (10.1, 6.78, −3.50), look-at (5.4, 6.45, −3.55), f 1100; slow push +0–+60. The camera sits inside T4's canopy volume (x 11, z −4.5, r 3.2): T4 is drawn only as the branch under the near crow plus one soft out-of-focus leaf cluster in the top-right corner (as CR4 `skip T1`). Computed at +0 (`est`): ringless crow at ≈ 1.71 m, centre x ≈ 745, y ≈ 1010, ≈ 290 px long (≈ 225 px tall in `back` view), feet y ≈ 1060; ringed crow at ≈ 5.7 m, centre x ≈ 510, y ≈ 960, ≈ 87 px; NT's canopy and the sky behind the far crow.
- Staging: a ringless `adult` on a T4 branch at (8.6, 6.6, −3.8), **`back` view facing −x with the head in `profile-left` toward the far crow** (R2.1: over its shoulder; both bare legs clear against the branch), watches the `adult-ringed` crow scolding on NT's outer branch at (4.6, 6.4, −3.4) in `left` profile (it faces the path, +z), beak open on each pump. +8 the near crow tilts its head; +37 it leans and scolds in the same rhythm (its body pivots to `left` profile for the scold so the open beak shows). No leaf covers either crow's head or beak.
- Key frames: +8 tilt; +37 copy; +60 last frame.
- Sound: **C2** at +20 (the ringed bird's scold, background, medium distance); a second **C2** at +37 from the ringless bird, close (the answer).
- Entry → exit: watching → joining.

**16. S01-B04-SH03** [989, 1050), 61 f. VO C09 +1–+39 ("ลาม" +1, "เป็นกิโล" +23).
- Camera (W3 LF04A: the brief's 33° pitch read as a horizon grid; steepened to about 57°): ease-in-out crane up and back, keys +0 pos (6.0, 8.0, 2.0) look-at (5.0, 6.0, −3.5) → +30 `camLF04A` pos (12, 200, 50) look-at (0, 0, −80) → +60 pos (20, 380, 100) look-at (0, 0, −150) (pitch 56.6°), f 900, hy 700 from +15; `P` hands to `A` at about y 40 (≈ +15, in-canvas, no cut).
- Staging: rising over NT and the campus into the neighbourhood; the season clock runs across the move: summer +0 → autumn (orange canopies) by +30 (LF04A) → winter (bare, grey) by +50, held to the end (R2.0: ends in winter so shot 17 opens in winter; R1.1's "early spring" belongs to shot 17). Crow clusters (3–6 marks per tree, tiny open-beak flicks) appear on more and more street trees outward along the streets from +1; WALKER in MASK-A a dot on the path (MAN is not on the path). No scale bar, no label. **R2.1 (Draft: the autumn street trees read as orange balls with dark dots like faces, and the winter crows read as ants scattered on lawns and roofs):** (1) every street-tree canopy seen from above is an irregular lobed clump (4–7 overlapping lobes, a darker shadow side away from the sun, a cast shadow on the ground offset the same way for every tree), never a sphere with a highlight; (2) crow marks are 3–6 small dark V or comma flecks **on the canopy edge only**, never in pairs at the canopy centre (no eyes); (3) the spread reads by motion: when the wave reaches a tree its flecks lift about 3 m and settle back (6 f), the wave moving outward street by street from the campus (+1 → +45); (4) winter: bare crowns are grey branching star shapes and the flecks sit on those crowns, never on lawns, roofs or streets. Check at 270 px on +23, +30 and +55: "trees with crows; the alarm spreading across town".
- Key frames: +1 first clusters beyond the campus; +23 many streets lit; +30 autumn (LF04A); +50 winter; +60 last frame.
- Sound: C1 rolls off into the distance with widening reverb from +0 (Editor); **A3** NEEDS-GEN in at +10: high open air over a town, soft steady wind, faint far traffic wash, no birds, 6 s (lifted and far); **S15** NEEDS-GEN from +30, bleeding into shot 17 to its +44: a gentle wind swell through full leaves, then thinner through bare branches, then soft again, 3 s (time passing); M1 out by +45 at a phrase end.
- Entry → exit: the canopy → a whole neighbourhood in winter.

**17. S01-B05-SH01** [1050, 1148), 98 f. VO C10 +13–+92 ("หลายปี" +13, "หน้ากากเดิม" +50, "อีกครั้ง" +80).
- Camera (W3 LF04B: the sheet's camera put the walker below the frame; pulled back onto the near lawn and tilted down): slow push `camLF04B` pos (−1.6, 1.6, 4.2) → (−1.2, 1.65, 3.6), look-at (2.0, 4.0, −3.5) fixed, f 1000, hy 780. Measured at LF04B (+13): WALKER 418 px, mask 113 px, nest 64 px.
- Staging: NT through season states (N7 in-canvas dissolves). +0–+30 winter: bare, the old nest empty and broken; visit 1: WALKER in MASK-A, mustard hoodie and grey `new: wool-scarf`, walks the path, x(n) = 1.3 + 0.0433 (n − 13) (0.74 → 2.0 by +30), and **dissolves out with the winter state** +30–+40 (time carries him off; R2.0: there is no room for him to walk out of frame before visit 2). +30–+44 dissolve to early spring (buds); a crow lands at the nest with a `stick` +36 and works it in to +46; +44–+52 dissolve to full leaf `later`, nest rebuilt. Visit 2 (R2.0: on the near-lawn shortcut z +1.6 so the second pass is near and reads as a second pass): WALKER, no scarf, hood bunched at the neck, crosses +x at x(n) = −1.0 + 0.0433 (n − 44) (−1.0 → 1.3), head and torso in frame at ≈ 2.2–2.6 m (head ≈ 200 px, head y ≈ 1080, `est`; Boss checks the mask stays above y 1160); +60 the crows on NB turn to him; +80 the mask at frame centre. "หน้ากากเดิม" = the same mask on a different person (Q-F3); no blazer, no coffee.
- Key frames: +13 visit 1 (LF04B); +36 the stick; +50 visit 2; +80 mask centre; +97 last frame.
- Sound: **S14** `whoosh_parachute-ease-out_01` ("soft airy whoosh that swells and eases out, then settles": fits a gentle time jump) at +0; **M2** NEEDS-GEN enters at +0 (slow, low, cool pad: bowed string harmonics over a soft sub hum, still, minor-leaning, not horror; energy 1.5); S15 tail to +44; **S16** NEEDS-GEN at +42: a crow pushing a dry twig into a stick nest, a small woody crackle and rustle, close in a tree, 0.4 s; A1 thin in winter (+0–+36), full in spring from +44.
- Entry → exit: a bare tree, empty nest → a rebuilt nest, the mask back on someone else.

**18. S01-B05-SH02** [1148, 1250), 102 f. VO C11 +6–+87 ("ลูกอีกา" +6, "เกิดหลังวันนั้น" +23, "ก็ร้องด่า" +48, "พ่อแม่" +68).
- Camera (**R2.1**: the Draft's three crows sit at different depths, so the young read only as further-away adults, and the wire behind crosses at their head tops, so they read as hanging from it; the camera is 0.35 m higher and the three birds sit side by side at one distance): `lookCam` pos (1.05, 6.80, −4.55) → (1.00, 6.75, −4.45), look-at (0.7, 3.0, 0.0), f 1000 (pitch ≈ −40°); slow push +0–+101. Computed at +0 (`est`): parent at ≈ 1.50 m, centre x ≈ 230, feet y ≈ 1000, ≈ 300 px long; young at ≈ 1.53 and 1.61 m, centres x ≈ 490 and 690, feet y ≈ 960 and 920, ≈ 250 and 235 px (0.38 m bodies: visibly smaller at the same depth); the wire (z −2.4) at y ≈ 690, ≥ 80 px above every head top; WALKER's mask at ≈ y 1065 (above 1160) and x ≈ 760 at +48, his body ≈ 230 px tall below it.
- Staging: `later` spring. From behind a twig of NT, **NB2** (R2.1, drawn under their feet, 0.05 m thick, from (2.3, 5.62, −3.60) to (0.5, 5.76, −3.10)): an `adult-ringed` parent at (1.30, 5.70, −3.32) and two `young` at (1.00, 5.72, −3.24) and (0.72, 5.74, −3.16), feet on NB2 (≤ 2 px), backs to us (`back` view, ≈ 0.18 m wide: no overlap), heads in profile; the young are scruffy (crown tufts, stubby tails, pink flange; shot 2 look), all looking down at WALKER in MASK-A (mustard hoodie, hands free) walking the path below, x(n) = −2.5 + 0.0433 n. The parent `scold`s from +0; +23 the young clear (scruffy, blue-grey eyes, `beg`); +48 the two young copy it, the same pump and open beak, red gapes; +68 the three in step.
- Key frames: +23 young clear; +48 copy; +68 in step; +101 last frame.
- Sound: C1 small (two adults) from +0; **C3** young calls join at +48, +56, +64, +72 in the parent's rhythm (higher, rougher, nasal, close in a tree); M2 energy 2.
- Entry → exit: the parent scolding → three scolding as one.

**19. S01-B05-SH03** [1250, 1394), 144 f. VO C12 +13–+136 ("นานหลังจากนั้น" +13, "ตายไป" +75, "เกือบหมด" +84, "เสียงด่า" +104, "เบาลง" +123).
- Camera (**R2.1**: R2.0's start put WS1 0.6 m ahead of the lens and out of frame; Boss's W5.3 deviation (x −11.6) fixed that, but the near crow then sits against the dark dusk canopy of the tree at x −11 (black on black) and the lamp halos read as pale discs; the camera now sits **below** the wire so every perched crow is a silhouette against the bright dusk sky): `lookCam` pos (−11.6, 5.60, −1.90) → (−11.2, 5.60, −1.90), look-at (−3.5, 1.24, −2.0), f 900 (pitch ≈ −28°); slow linear truck +0–+143. The camera is inside the x −11 tree's canopy volume: that tree is not drawn (as CR4 `skip T1`). Computed at +0 (`est`): WS1 crow at ≈ 1.7 m, centre (270, 257), ≈ 240 px long, against the sky (clear of `@TamMaiLa`, x < 330, y < 140); horizon y ≈ 475; WS3 (455, 420), WS4 (477, 437), WS5 (502, 455), WS6–WS8 receding toward x ≈ 520, y ≈ 465, all just above the horizon, against the dusk sky or thinned far canopy; the lamp post at x −7 has its head at ≈ (590, 816).
- Staging: `dusk` (sky key, lamps on). State 1 (+0–+66): an old `adult-ringed` crow on WS1 (slightly ragged), ringed crows on WS3 and WS5, `young`-born adults on WS4, WS6, WS7; leaf state changes behind between states. +66–+75 dissolve to state 2: WS1 **empty** (just the wire), WS3 empty. +80–+88 dissolve to state 3: WS5 empty; one old ringed crow left on WS8, quiet (Q-F4). WALKER in MASK-A (mustard hoodie) walks the path below, **R2.1** x(n) = −8.6 + 0.0433 (n − 60) from +60 (R2.0 from +90 at −8.0, which this camera cannot see): he enters at the right edge at about +95 (x −7.1) and is in frame under the wire's line from +104 (x −6.7: mask ≈ (980, 1112), above 1160) to +143 (x −5.0: mask ≈ (870, 1002)) (`est`; Boss checks the mask above y 1160 from +100); **lamp light (R2.1, UT04):** each lit lamp head is a small bright warm lantern with a tight glow (radius ≤ 0.3 m, about 1.5× the head) and a soft warm pool on the path below it (an ellipse about 1.5 m across); no large pale disc around the head; two young-born crows scold small and soft +104–+140; the rest stay still. Nothing falls; no feather; no body.
- Key frames: +13 the occupied near spot; +75 the empty near spot; +88 state 3; +104 the walker under a quiet wire; +143 last frame.
- Sound: **A2** NEEDS-GEN from +0 (cross from A1 over +0–+10): dusk on a quiet campus path, low breeze through leaves, very distant traffic hum, one far dog bark once (around +40), no songbirds, 12 s loop (emptier, the day ending); C1 out; **C3** two or three soft, distant young calls at +106, +118, +131 (thin, far); M2 drops lower and quieter to energy 0.5 by +75. No sound marks the empty spots.
- Entry → exit: a full wire at dusk → a thin, quiet wire.

**20. S01-B05-SH04** [1394, 1632), 238 f. VO C13 +8–+144 ("ไม่กี่ตัว" +29, "ส่งต่อ" +86); V03 +155–+170; turn +170–+178; hold +178–+237.
- Camera (W3 LF05: ends 0.2 m below the wire looking up, so the crow stands against the dusk sky above the hall's roofline): crane up and push (ease-out) +0–+86 from pos (−4.0, 4.2, 3.2), look-at (−3.0, 3.0, −1.0), f 1000, hy 960 to `camLF05` pos (−4.0, 5.6, −1.78), look-at (−4.0, 5.98, −2.4), f 1150, hy 830, near 0.05; locked +86–+237. The path must keep the lens in front of the wire plane (z > −2.3) and below the wire (y < 5.75) at every frame. Measured at LF05: young crow 689 px long, head 121 px. **R2.1 (Draft: the wire under its feet lies on the hall's eave line, so the crow reads as standing on the roof):** end pos y 5.60 → 5.55 (the rest of `camLF05` unchanged), which lifts the wire about 60 px above the eave (`est`); the wire stays a visible dark curve under its feet across the frame; the crow and its head stay above y 1160.
- Staging: `dusk`. +0–+29 WALKER in MASK-A walks out of frame right along the path; the crows settle. The camera rises to the wire and pushes to one `young-ringless` crow on WS-H (bare legs, blue-grey eye), `left` profile. +155 `caw` (V03: beak open, throat puff, tail dip, to +170); +170–+178 `head-turn-to-lens` (head to `front`, body stays in profile). Hold +178–+237: wire sway, feather ruffle, lamp glow; no blink before +208.
- Key frames: +29 walker gone; +86 push settled; +155 caw; +178 the stare; +237 last frame.
- Sound: A2; WALKER's steps `foley_walk-sneakers-asphalt_01` faint +0–+25 (receding); M2 holds a low note, lifts very slightly at +86, fades out +130–+145 (out before V03); **V03** NEEDS-GEN at +155: one sharp single caw from a young crow, close and dry, a slight rasp at the end, no echo, 0.5 s (it looks at you); **S17** NEEDS-GEN from +155: a perched bird's feathers ruffling softly in a breeze, close, 3 s loop; A2 + S17 fade to −∞ over +208–+237 (last 30 f); no loop seam.
- Entry → exit: the walker leaving → a crow staring into the lens.

## Acceptance (timed checks for W5 and W6)

- Length 1632 f = 54.40 s (40–60 s); every cue inside the shot ranges of the cue table (C01, C02, C03, C05, C09 cross a cut exactly as listed); longest answer 5.47 s < 10 s.
- Narration placed in six segments at the offsets of [Units](#units-clocks-and-conventions): line onsets on the cue-table frames ±1 f; V01 voice [420, 442), V02 voice [700, 727), V03 onset f1549.
- Word pegs: Editor checks the `interp` pegs by ear on the draft; a picture beat more than 3 f off its word moves to the word (the audio does not move).
- Shot 1 +0 nameable as "crow on a wire, masked person below" at 270 px (viewer check, UT01); crow head ≥ 120 px; mask ≥ 40 px.
- Shots 3–4: the place reads American; the crow calm in every frame; the ring ≥ 6 px tall.
- Shots 5, 9, 10: identical `RIG(x_w)` camera and perches (only the face changes); MAN ≥ 480 px.
- **Shot 6: the per-frame minimum crow-to-head distance ≥ 10.0 m on every frame [339, 408)** (computed 10.1 m at +0); shot 13: every scolding crow ≥ 10 m from her head on every frame; one low pass only in 7 and 12.
- Shot 13: both walkers and the mob readable at +0–+36; the mask fills the end, above y 1160.
- Shot 14: the ring read (+13) before the first bare legs (+43).
- Shot 16: autumn readable at +30, winter by +50; no pop at the `P` → `A` hand-off (≈ +15); ends in winter, matching shot 17 +0.
- Shot 17: two visible visits (+13 path, +50 near lawn); WALKER reads as not-MAN; the nest empty in winter and rebuilt by +52.
- Shots 16–20: the masked walker is WALKER in every frame; MAN appears nowhere.
- Shot 19: the near spot occupied at +13, empty at +75; no falling motion anywhere.
- Shot 20: the hold has no frozen tail (ambient motion continues); not too dark (UT03); the closed hold 60 f after the turn.
- Caption band (R2.1, R05): no face, mask, ring, crow head, hand or contact inside y 1160–1344 on any frame where caption text is fully on (sampled only there, never in a cue's fade tail); captions stroke-only by default, a plate only where a 360 px frame check shows the stroke failing, at the lowest step that reads (≤ 0.5), recorded per shot; no plate without its text; luma numbers recorded, not gating. The species tag on [150, 278) only.
- R2.1 reads at 270 px (viewer check): shot 2 "a baby bird in a stick nest"; shot 3 "a man kneeling with a net over a crow" (thighs and shins visible); shot 4 crow above the band, take-off clear of the mask; shot 6 separate crows on a wire, no blob; shot 8 MCU, no cup or mask in the band; shot 11 she turns and walks, no shrug; shots 12–13 tote clearly above her head; shot 14 feet against sky, ring readable, no crow standing on another; shot 15 two crows, near and far; shot 16 trees not balls, crows not ants, a spreading wave; shot 18 two young visibly smaller beside the parent at one depth, wire clear of heads; shot 19 near crow silhouetted on sky, empty spot readable at +75, no pale discs; shot 20 wire visible under the feet.
- Feet on the wire (≤ 2 px drift on held frames); seek parity on shots 6, 13, 16, 17.

## Dependencies and open items

- Boss: brief N1–N8 ([New assets](film-brief.md#new-assets-and-missing-capability-boss-dependencies-w52)); W3 open items: crow flight cycle (shots 4, 6, 7, 12, 13), N5 poses, N6 hand-net and stick, N7 season dissolves (shots 16, 17, 19), N4 aerial camera move and polish (task.md W3.3: Boss before W5), the per-frame mob-distance measure (shots 6, 13).
- Ton: M0, M1, M2, A1b, A2, A3, C1–C4, V03, S1–S3, S4–S9, S11, S13, S15–S18 (NEEDS-GEN; S3 needs a branch and a wire variant, C3 a short pop squeak); library checks for A1 (no crow calls), S12, S14 and `foley_walk-sneakers-asphalt_01`.
- Editor: V01 Charon and V02 Aoede final takes (W4.2; not listened, the finals use new styles: listen at W5); narration not listened; places the six narration segments and the character files per the cue table; `store.py use` when the composition folder exists (build-notes).
- Boat: picture checks B-P1–B-P7 (brief handoff).

### W5 handoff notes (Film)

- **H1 Shot 6 mob distance (R2.0).** The R1.1 start (MAN x −9.0, row x −18 … −16) put the front crow 8.6 m from his head (W3 finding). The row cannot move further back (the wire ends at PL1, x −18), so MAN moves forward: x −7.3 → −4.35 (CR4's MAN x −5.6 is +39). The 5→6 cut now elides about 2.0 m of walk; shots 7 and 8 moved +0.5 m with him (shot 8 stops at −3.9, R1.1 −4.4). The R1.1 T2-top pair now starts on the PL1 crossarm and lands on T2 only after MAN passes x −5.0 (+54); T2 top at the shot start would be 9.4 m. Boss implements the minimum-distance print in the shot's measure, like `MEASURE.CR4.mobMinDistM`.
- **H2 Shot 13 camera.** The hold is `camLF03` exactly (+0–+36); the push end is computed from her walk line, not a fixed point, so if Boss changes her start x the end follows her head. WS4/WS-H leapfrog landings must not be earlier than +40 / +60.
- **H3 Shot 17 visits.** Visit 1 dissolves out with the winter state (no exit walk); visit 2 walks the near-lawn shortcut at z +1.6 (an exception to the z +0.3 walk line, recorded in BRIEF-R2.0). If the visit-2 mask falls below y 1160 at the pushed camera, lift `hy` to 740 for the whole shot rather than moving the walker.
- **H4 Shot 16 → 17 seasons.** Shot 16 ends in winter and shot 17 opens in winter (R2.0 wording fix; R1.1 said shot 16 hands over in early spring, which contradicted shot 17's winter start).
- **H5 Timing risks.** (1) Shot 9 is 38 f; the 9→10 cut is 1 f before "หรือ" with no pause, so the cut must not move earlier than f546. (2) Shot 19's state 2 and state 3 are 9 f apart (words "ตายไป" and "เกือบหมด"); if the dissolves read as one change, Editor may hold state 3 to +92 (no other shot moves). (3) Every `interp` peg is ±0.15 s (±5 f); whisper garbled L04–L06, so the pegs there are syllable counts. (4) V01/V02 final takes and the narration are not listened.

### Open questions

None open. Answered 2026-11-10 (user): Q-F1 no time cards; Q-F2 tag once on L02; Q-F3 WALKER wears the mask later (casting confirmed W2.5); Q-F4 one old ringed crow stays; Q-F5 mask A1. All look frames LF01–LF05 and stills CR1–CR4 passed (W3.3).

## Change log

| Revision | Date | Author | Change |
| --- | --- | --- | --- |
| EDU-EP16-ROWS-R2.1 | 2026-11-10 | Film | W5.3 Draft fix round 1 (viewer check of the half-size Draft; [fixlist.md](fixlist.md)). Cameras: shot 3 side-on and higher (profile kneel), shot 4 from +x with the crow above the band and a take-off arc clear of the mask, shot 8 MCU f 1600 (cup and hands below frame, one-hand peel, mask leaves upward), shot 14 below the wire looking up at sky between the x −11 tree and NT, 0.45 m landing spacing, `left` profile, shot 15 re-aimed over the near crow's shoulder (T4 skipped), shot 18 camera +0.35 m and the three crows side by side on NB2 at one depth, shot 19 camera below the wire (crows on the dusk sky), walker from +60, shot 20 end y 5.55. Staging: shot 6 mob in `back` view, shot 11 shrug replaced by a turn and walk (no new pose; steps added), shots 12–13 tote held above her head through 13, mob faces her; looks: shot 2 stick nest and scruffy young, shot 16 lobed canopies, edge flecks and a flutter wave, shots 5/9/10 whole-body reactions, shot 19 small lamp glows. R05: stroke-only captions by default, plate only where the stroke fails, lowest step; luma not gating; W5.3 fails at shot 8 +53 and shot 13 +92 were sampled in the plate's fade tail. Shot ranges, line timing, cues, word pegs, IDs, Thai text and 1632 f unchanged. Rows file R2.1 (timed), review page pending. |
| EDU-EP16-ROWS-R2.0 | 2026-11-10 | Film | W4.3 timing on the W4.2 voice lock (Kore narration v1, V01 Charon, V02 Aoede): six narration segments (offsets 0 / 0.90 / 2.10 / 2.40 / 3.00 / 3.30 s), every shot range, cue, text range, word peg and shot-local key frame pegged; total 1632 f = 54.40 s (R1.1 est 1629 f); longest answer 5.47 s. W3 cameras folded in: LF01 shifted camera (shot 1), LF02 hy 600 (shots 5, 9, 10), LF03 near-lawn camera (shot 13 hold, then a push computed from her walk), LF04A pitch ≈ 57° crane keys (shot 16), LF04B pulled-back camera (shot 17), LF05 end under the wire (shot 20), CR4 camera (shot 6). B01-SH06 mob distance fixed (MAN x −7.3 → −4.35, crossarm start for the T2 pair; min 10.1 m); shots 7, 8 moved +0.5 m; shot 12 moved ahead (x_w 0.3 → 1.9). Shot 16 ends in winter (wording fix); shot 17 visit 1 dissolves out, visit 2 on the near-lawn shortcut z +1.6. Sound lines carry shot-local frames and descriptions (new small cues: C3 pop squeak, S1 hop-flaps in shot 3, S3 branch variant, steps in shots 1, 12, 20). Species tag only on [150, 278). Shot IDs, Thai, reveals and story order unchanged. Rows file unchanged (R1.2). Status ready-for-dev (timing). |
| EDU-EP16-ROWS-R1.1 | 2026-11-10 | Film | User verdicts on R1.0 (all 20 shots ok; Q-F1, Q-F4, Q-F5 ok). Q-F2: the per-shot "ภาพจำลอง" label removed; the tag "อีกาอเมริกัน · ภาพจำลอง" once across the L02 line (shots 3–4). Q-F3: new WALKER `man-spiky + hoodie (mustard)` wears MASK-A on every later walk (shots 16–20; grey `new: wool-scarf` moved from MAN to WALKER for the winter visit in 17); MAN removed from 16–20 and never implied later; shot 13 (L07) and the woman beat unchanged. Shot IDs, lines, timing estimate (≈ 54.3 s) unchanged; untimed. |
| EDU-EP16-ROWS-R1.0 | 2026-11-10 | Film | First untimed scene sheet (W2.2) from script R3 and brief R1: 20 shots, est ≈ 54.3 s; camera lines, staging, key moments by word, sound per shot; review rows written in Thai with Q-F1–Q-F5. Ready for the storyboard review only. |
