# Storyboard — EDU-EP17-SHORT (timed scene sheet)

Deliverable: `EDU-EP17-SHORT` · Revision: **EDU-EP17-ROWS-R2.5** (Film, 2026-11-13, rulings on Editor's draft staging gaps (H10): shot 2 gaps closing dropped (packed from +0), shot 10 neighbours and pocket accepted as built, shot 11 crouch gains a forward lean for a readable drop, E1 stays on "จุด" as an under-speech glint; no frame length, word peg or sound frame changed; R2.4 2026-11-12, rulings on Boss's group 5 and fix-pass-B questions (H9): shot 14 rebound short of the stop, shot 15 inset content, shot 2 dot, shot 1 L3 hand-over h 2–5 km; no frame length, word peg or sound frame changed; R2.3 the same day, rulings on Boss's group 3/4 questions: shot 17 start lens, shot 21 end pose, shot 11 pixels, shot 1/16 wording and the h 2–40 km map look; no frame length, word peg or sound frame changed; R2.2 the same day, W3 close-out: the user-approved look frames' camera and colour changes, no frame length changed; R2.1 2026-11-11 retime for the picked V01/V02 takes; R2.0 the same day, W4.3 timing on the W4.2 voice read) · Status: **ready-for-dev** · Timing: **audio-measured** (narration, V01 and V02 takes). Readiness is not user approval, runtime or visual proof.
Inputs: [script.md](script.md) EDU-EP17-SCRIPT-R2 (user-approved 2026-11-10) · [fact-check.md](fact-check.md) R1 · [film-brief.md](film-brief.md) **EDU-EP17-BRIEF-R2.5** · [measure.json](measure.json) (W4.2, Editor) · narration store `projects/edu/EDU/audio/2026-11-11_ep17-nar-kore-warm-fullread-r2-x1.08.wav` (Kore warm, atempo 1.08, 44.82 s; approved by ear by the user 2026-11-11) · MAN takes (Gemini Algenib, user pick 2026-11-11): V01 `projects/edu/EDU/samples/ep17_v01-A-strained.wav`, V02 `projects/edu/EDU/samples/ep17_v02-A-strained.wav` · task record [task.md](task.md).
User decisions applied (2026-11-12, structured question through the coordinator): **all eight look frames approved as picked** (LF01A, LF01B, LF02, LF03, LF04 atom + balance, LF05A, LF05B, LF06, LF07; [looks-a.md](looks-a.md), [looks-b.md](looks-b.md)), Film's SH11 fix (halo + 3 m clear zone + tee `#ffc21a`, `park-casual` out of the crowd mix) and Film's camera changes (SH18, SH19/SH20, SH21) approved; applied in R2.2. Earlier (2026-11-11, through the coordinator): the storyboard verdicts could not be opened, so Film's R1.0 recommendations stand; **Q-F1 = (a)** OpenStreetMap district lines, credit "© OpenStreetMap contributors" in the video description. **V01 = take A strained, V02 = take A strained** (user, 2026-11-11, structured question).
Target: this worktree, branch `claude/bangkok-world-people-new-sound-40c776` at `80063e5` (+ uncommitted EP17 records) · 30 fps · **durationFrames 1561 (52.03 s)** · 1080×1920 · composition offset 0 (one scene, S01).
Evidence: the eight look frames are painted stills (W3, [looks-a.md](looks-a.md), [looks-b.md](looks-b.md)); no shot is rendered. Line edges and pauses measured this pass on the placed read with ffmpeg silencedetect (−32 dB, 0.06 s); word pegs from faster-whisper large-v3-turbo word times (this pass, log `out/logs/ep17-w43-words.tsv`, not committed, rough ±0.3 s on Thai) checked against syllable counts between measured edges. Cameras are R1.0's (projections computed then with `scripts/shot-projection.py`) except the R2.2 changes in shots 18–21, recomputed this pass with the `lookCam`/`camSpace` maths of `src/painted/kit/ycam.ts` (pinhole, f 1000, hy 960) against the look-frame stadium (`standY`, `bowlPt` in `src/painted/edu17/look-b-stadium.ts`, field 110 × 49 m, superellipse exponent 1/3) and the LF06 instrument geometry. R2.1: the V01/V02 takes measured with ffprobe (container length) and ffmpeg silencedetect (−32/−40/−50 dB) on the store files; neither take listened by Film.
Rows file: [review-rows.json](review-rows.json) **EDU-EP17-ROWS-R2.5** (Thai, `untimed: true`) plus the eight approved look frames as `looks` (R2.2); R2.3 rewrites the `seen` text of shots 16 and 21 to match the rulings, R2.4 that of shot 15 (the inset shows the atom row), R2.5 the `title`/`seen`/`sound` text of shots 2, 10, 11 and 22 to match H10, narration unchanged. Review page: pending.

## Units, clocks and conventions

- Clocks: **global** `f` = composition frame (= scene-local, offset 0); **shot-local** `+n` = `f − shot start`. Ranges are half-open `[start, end)`; a shot's last frame is `+len−1`.
- **Narration placement.** One file, placed in seven segments, each cut inside a measured pause. Read time `t` (seconds in the placed x1.08 file) → global frame = `round((t + offset) · 30)`.

  | Seg | File range (s) | Offset (s) | Offset (f) | Global frames | Lines | Gap added before it |
  | --- | --- | --- | --- | --- | --- | --- |
  | A | [0.000, 8.555) | 0.000 | 0 | [0, 257) | L01–L03 | — |
  | B | [8.555, 13.765) | 1.733 | 52 | [309, 465) | L04–L05 | 1.733 s: V01 take (shot 5; R2.0 0.90 s + 25 f) |
  | C | [13.765, 19.655) | 2.133 | 64 | [477, 654) | L06–L07 | 0.40 s: the comic stop after "คนก็หมดแล้ว" |
  | D | [19.655, 25.685) | 4.733 | 142 | [732, 913) | L08–L09 | 2.60 s: countdown and jump (shots 11–12) |
  | E | [25.685, 28.080) | 5.033 | 151 | [922, 993) | L10 | 0.30 s: balance hold (file pause here is only 0.07 s, 25.655–25.718: Editor cuts inside it with 2 f fades) |
  | F | [28.080, 38.950) | 5.333 | 160 | [1002, 1329) | L11–L13 | 0.30 s: landing settle |
  | G | [38.950, 44.820) | 5.633 | 169 | [1337, 1514) | L14–L15 | 0.30 s: the drop to silence before space |

  Offsets are exact frame counts (offset s = frames / 30); use the frame column to avoid rounding drift. Between segments and after f1514 the narration track is silent; other tracks fill. Added gaps total 5.633 s (169 f); durationFrames = last narration frame 1499 + 62 f hold = 1561.
- **Character takes (R2.1, user pick 2026-11-11).** Both Gemini Algenib (MAN), not listened by Film; measured on the store files with ffprobe and silencedetect.

  | Take | Store file | File length | Voiced (file s) | Placed (global) | Shot-local | R2.0 slot |
  | --- | --- | --- | --- | --- | --- | --- |
  | V01 "แน่นจริง" | `projects/edu/EDU/samples/ep17_v01-A-strained.wav` | 1.79 s (ffprobe) | 0.00–1.42 (−50 dB; −32 dB: 0.00–1.30 with gaps 0.09–0.18, 0.40–0.57, 0.90–1.00); 1.42–1.79 silent (RMS −51 dB) | onset f261, voice [261, 304) (43 f) | shot 5 +4–+47 | [261, 279) 18 f |
  | V02 "ฮึบ!" | `projects/edu/EDU/samples/ep17_v02-A-strained.wav` | 0.21 s | 0.00–0.21, no gap at −40 dB | onset f704, [704, 711) (7 f) | shot 12 +4–+11 | [679, 691) 12 f |

  Rule applied (R2.0): a take that fits its slot ±3 f is placed by voice onset; a longer V01 extends shot 5 by the excess and shifts every later frame by the same count. **V01 excess = 43 − 18 = 25 f (0.833 s)**, measured on the voice, not the container: the file's last 0.37 s is silence, so counting it (36 f) would only add dead air before the cut. Shot 5 grows 30 → 55 f, keeping R2.0's 8 f between the voice end and the 5→6 cut; **every frame ≥ f279 moves +25** (segments B–G, shot ranges 5–22, cues, pegs, text ranges, checks). Editor trims the V01 file at 1.45 s with a 2 f fade (its silent tail would otherwise run 3 f into shot 6 under L04's onset at f314). V02 fits (7 f in a 12 f slot): placed at +4, no shift; it may read as a click (task note): if Editor's ear check rejects it, a re-take that fits ≤ 20 f keeps every frame.
- Spaces and axes as in the brief's [projection contract](film-brief.md#projection-contract-and-scale-baseline): `G` geographic (km; nadir camera `gcam: nadir (lat, lon), h km, f 1000, pp (cx, cy), yaw ψ°`; px/km = 1000 / h at the nadir), `S` SET-SUKH16 (m; origin M0 at the man's feet, +x east, +y up, +z south toward the cameras), `T` SET-STADIUM16 (m; origin field centre, +x toward the stage end, +z toward the instrument side), `D` fixed-plane diagrams (px). The set IDs keep their R1 names; EP17's modules live in `src/painted/edu17/` (brief R2.0).
- `ycam` lines give `pos → pos, look-at → look-at, f`; hy 960 unless stated. Moves in `G` are log-altitude (constant apparent zoom speed) inside the stated window, smoothstep at both ends. Linear pushes in `S`, `T` and `D` ease in and out over 6 f.
- Screen: pixels, origin top-left, y down. Caption band y 1176–1344; faces, the phone, the square, the map provinces, the fill front, the speck, the pans, the stage, the pen and the dot above y 1160 ([caption-zone rule](film-brief.md#caption-zone-rule)); slots LBL (816–1020, 148–204), LBL-W (600–1020, 148–236) for OT01, LBL2 (60–520, 160–228) for OT05; `@TamMaiLa` top-left (x < 330, y < 140 clear).
- In shot headers `VO C05 +2–+83` is the shot-local voice range of cue C05; word frames in brackets or in the word-peg table.

## Casting

| Role | Casting line | Notes |
| --- | --- | --- |
| MAN | `man-spiky + park-casual (cap off), P10, neutral` | 1.72 m, on M0. Poses: P10 raised (back view, shot 2) → P10 + `new: squeezed`, `tired` (shot 5) → `nod` up + phone into the right shorts pocket, `neutral` → `happy`, then the `standing-jump` anticipation dip (shot 10) → full crouch (P35 arms back), `happy` (shot 11) → take-off/apex (P08 arms up), `laugh` (shot 12) → landing, `idle-breathe`, `relieved` (shot 15). Brief VD02, D01 |
| MAN voice | V01 "แน่นจริง" (muttered complaint), V02 "ฮึบ!" (effort grunt) | Gemini Algenib, take A strained for both (user pick 2026-11-11); placed in R2.1 (conventions) |
| Crowd | `PEOPLE` (all 14) × `WARDROBE` (office, school, monk, yukata, kimono, nurse, police, hoodie, vendor, rider, kitchen-apron), seeded tints and head turns; `new: crowd-heads` beyond 3 m; `new: person-top` straight down. **R2.2: `park-casual` is not in the crowd mix** (it is his outfit; a second mustard tee read as a second him in the LF02 thumbnail), and no yellow, mustard, orange or cream top (`#e0b84a`, `#d98a3a`, `#f2ead8` and alike) within 3 m of M0 in any crowd shot (2, 4, 5, 10–12, 15) | brief VD03 |
| Seattle crowds | the same card mix in dark rain jackets (day) and light summer clothes with phone lights (night); no team kit, no logo | brief VD10 |
| Kit layers | ENV-EARTH (`kit/earth.ts`, limb and palette) in shots 13, 14, 22 | ENV-P02 |

## Shot map

| # | Shot | Beat | Lines | Range (global) | Len | Start s | Camera | One-line read |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | S01-B01-SH01 | B01 | L01 a | [0, 69) | 69 | 0.00 | `G` straight down, rise h 0.58 → 80 km | A stadium from above, people streaming in; rise to the whole map |
| 2 | S01-B01-SH02 | B01 | L01 b | [69, 112) | 43 | 2.30 | `S` over his shoulder, push 0.2 m | His phone's blue dot in a packed crowd |
| 3 | S01-B01-SH03 | B01 | L02 | [112, 190) | 78 | 3.73 | `G` h 85 → 80 km, yaw 2 → 0° | The crowd spreads over Bangkok and Nonthaburi |
| 4 | S01-B01-SH04 | B01 | L03 | [190, 257) | 67 | 6.33 | `S` straight down 2.3 m over heads | Heads in a grid; one 50 × 50 cm square around his head |
| 5 | S01-B01-SH05 | B01 | V01 | [257, 312) | 55 | 8.57 | `S` front close, push 0.08 m | Squeezed between two shoulders: "แน่นจริง" |
| 6 | S01-B02-SH01 | B02 | L04 | [312, 397) | 85 | 10.40 | `G` h 80 → 72 km, yaw 0 → 3° | Bangkok fills district by district; the crowd crosses into Nonthaburi |
| 7 | S01-B02-SH02 | B02 | L05 | [397, 477) | 80 | 13.23 | `G` h 80 → 45 km toward Nonthaburi | The fill slows and stops; a quarter stays green |
| 8 | S01-B02-SH03 | B02 | L06 | [477, 559) | 82 | 15.90 | `G` rise h 45 → 1,100 km | Thailand: the patch is small |
| 9 | S01-B03-SH01 | B03 | L07 a | [559, 614) | 55 | 18.63 | `G` dive h 1,100 → 6 km to M0 | Back down into the crowd |
| 10 | S01-B03-SH02 | B03 | L07 b | [614, 655) | 41 | 20.47 | `S` low front, push 0.2 m | He looks up, pockets the phone, gets ready |
| 11 | S01-B03-SH03 | B03 | W-COUNT | [655, 700) | 45 | 21.83 | `S` high angle over the heads | 3 · 2 · 1, the sea of heads crouches |
| 12 | S01-B03-SH04 | B03 | W-JUMP, V02 | [700, 736) | 36 | 23.33 | `S` low front, static | Everyone in the air: "ฮึบ!" |
| 13 | S01-B03-SH05 | B03 | L08 | [736, 829) | 93 | 24.53 | `D` Earth limb → loupe → atom | Less than one atom: a speck in a ring |
| 14 | S01-B03-SH06 | B03 | L09 | [829, 919) | 90 | 27.63 | `D` balance, push to the crowd pan | The Earth's pan slams down; ours flies up |
| 15 | S01-B03-SH07 | B03 | L10 | [919, 1006) | 87 | 30.63 | `S` = shot 12 camera | Everyone lands; the inset speck goes back |
| 16 | S01-B04-SH01 | B04 | L11 a | [1006, 1054) | 48 | 33.53 | `G` dive h 80 → 0.58 km to K02 | Down to the Bangkok stadium, full of people |
| 17 | S01-B04-SH02 | B04 | L11 b | [1054, 1101) | 47 | 35.13 | `T` match cut from above, crane down | Another stadium from above, grey afternoon, roaring |
| 18 | S01-B04-SH03 | B04 | L12 a | [1101, 1154) | 53 | 36.70 | `T` upper deck, truck 14 m | The game crowd roars; "ซีแอตเทิล · 2011" |
| 19 | S01-B04-SH04 | B04 | L12 b | [1154, 1200) | 46 | 38.47 | `T` night, push 3 m | The concert at night; "2023" |
| 20 | S01-B04-SH05 | B04 | L13 a | [1200, 1259) | 59 | 40.00 | `T` lower stands, push 4 m | Tens of thousands bouncing together |
| 21 | S01-B04-SH06 | B04 | L13 b | [1259, 1342) | 83 | 41.97 | `T` close on the pen → pull back across the street | A pen scratching a jittery line in a box beside the stadium |
| 22 | S01-B05-SH01 | B05 | L14, L15, hold | [1342, 1561) | 219 | 44.73 | `G` rise h 80 → 7,860 km, then drift | Bangkok patch → Thailand → the whole globe; one dot |

Sum 1561 f = 52.03 s (R2.0 1536 f + 25 f for the V01 take; target 40–60 s, hard limit 63 s: pass, 329 f = 10.97 s under). The real-world beat (Seattle) starts at 36.70 s.

## Measured line edges (this pass)

Read seconds in the placed x1.08 file. "Δ measure.json" marks where this pass's silencedetect edge differs from the Editor's W4.2 values by more than 0.04 s; the sheet uses the values in this table. **Editor: L09/L10 in measure.json are wrong by about 1 s** (see the note), please correct the file at W5.

| Line | Onset s | End s | Global [onset, end) | Pauses inside (s) | Δ measure.json |
| --- | --- | --- | --- | --- | --- |
| L01 | 0.27 | 3.67 | [8, 110) | 1.149–1.358; **2.257–2.363** ("…"); 2.455–2.533, 2.717–2.792 | — |
| L02 | 3.79 | 6.27 | [114, 188) | none ≥ 0.06 s | onset 3.74 → 3.79 (pause 3.668–3.792) |
| L03 | 6.40 | 8.37 | [192, 251) | 6.498–6.589, **7.161–7.244**, **7.686–7.756** | — |
| L04 | 8.74 | 11.45 | [314, 395) | 9.180–9.274, 9.572–9.649, 10.083–10.170 | onset 8.56 → 8.74 (silence 8.367–8.743 with a 12 ms blip); end 11.40 → 11.45 |
| L05 | 11.53 | 13.58 | [398, 459) | 11.674–11.765 (after "แต่"), **12.682–12.797** ("…") | onset 11.64 → 11.53 ("แต่" 11.525–11.674) |
| L06 | 13.95 | 16.26 | [483, 552) | **15.080–15.201** ("…") | — |
| L07 | 16.72 | 19.40 | [566, 646) | "แต่…" read without a gap; **18.285–18.427**, 18.765–18.835 | — |
| L08 | 19.91 | 22.75 | [739, 824) | 20.407–20.511, **20.791–20.897** ("…"), 21.020–21.115, 21.919–21.989 | — |
| L09 | 23.07 | 25.65 | [834, 911) | 23.633–23.720, **24.030–24.272** ("…"), 24.781–24.891 | **end 26.64 → 25.65** |
| L10 | 25.72 | 27.82 | [923, 986) | 25.865–25.939, **26.635–26.870** ("…"), 27.304–27.386 | **onset 26.87 → 25.72** |
| L11 | 28.34 | 30.99 | [1010, 1090) | 28.706–28.769, **28.883–29.025** ("แต่…") | — |
| L12 | 31.13 | 34.60 | [1094, 1198) | 31.321–31.396, **33.068–33.189** | — |
| L13 | 34.75 | 38.87 | [1203, 1326) | 35.823–35.923, 36.401–36.465, **36.600–36.712** ("…"), 37.827–37.906, 38.496–38.566 | — |
| L14 | 39.29 | 40.53 | [1348, 1385) | none | — |
| L15 | 40.83 | 44.35 | [1394, 1499) | 41.310–41.402, 41.592–41.662, **43.222–43.375**, 43.736–43.813, 43.914–44.035 | anchor "เป็นแค่จุดเดียว" 42.96 → 43.37 |

- **L09/L10 note.** measure.json puts L10 at 26.87–27.82: 9 syllables ("พอลงพื้น… โลกก็กลับที่เดิม") in 0.95 s = 9.5 syllables/s, against this read's ≈ 5.5. The silence 26.635–26.870 is L10's own "…"; whisper hears "พอ" at 25.82 and "พื้น" at 26.28–26.58; the only gap after "มหาศาล" is 25.655–25.718. So L09 ends 25.65 and L10 starts 25.72 (±0.05 s). Editor confirms by ear.
- **L15 note.** "บนโลกใบนี้" (4 syllables) 42.24–43.22 and "เป็นแค่จุดเดียว" (4 syllables) 43.37–44.35 split evenly around the 43.22–43.37 pause; whisper's "เป็น" at 42.96 is about 0.4 s early, as elsewhere in this read. E1 is pegged to "จุด" at 43.80 (±0.15 s); Editor moves E1, not the audio, if it lands more than 3 f off by ear.

## Voice and subtitle cues (global, measured)

Captions = VO, Thai verbatim; one cue per line (Editor's caption rules set holds and splits; split only at a word boundary). V02 has no caption.

| Cue | Line | Thai (VO, subtitle = VO) | Voice [start, end) | Shots |
| --- | --- | --- | --- | --- |
| C01 | L01 | คนทั้งโลก รวมทั้งคุณด้วย… กว่าแปดพันล้านคน | [8, 110) (the 1→2 cut at 69 sits in the "…" pause [68, 71)) | 1–2 |
| C02 | L02 | ยืนเบียดกันแน่น ๆ ได้หมด ในกรุงเทพฯ กับนนทบุรี | [114, 188) | 3 |
| C03 | L03 | คนละช่อง แค่ครึ่งเมตร คูณครึ่งเมตร | [192, 251) | 4 |
| C04 | V01 (MAN) | แน่นจริง | [261, 304) take A strained (voice 0.00–1.42 s of the 1.79 s file; the 5→6 cut at 312 is 8 f after the voice) | 5 |
| C05 | L04 | กรุงเทพฯ เต็มทุกเขต แล้วล้นเข้านนทบุรี | [314, 395) | 6 |
| C06 | L05 | แต่ยังไม่ทันเต็มจังหวัด… คนก็หมดแล้ว | [398, 459) (the 6→7 cut at 397 is 1 f before "แต่"; L04 ends 395) | 7 |
| C07 | L06 | เราว่าเราเยอะแล้ว… โลกใหญ่กว่านั้นอีก | [483, 552) | 8 |
| C08 | L07 | แต่… ถ้าทุกคนตรงนี้ กระโดดพร้อมกันล่ะ | [566, 646) (the 9→10 cut at 614 sits in the pause [612, 617)) | 9–10 |
| — | V02 (MAN) | ฮึบ! (no subtitle) | [704, 711) take A strained (0.21 s, all voiced) | 12 |
| C09 | L08 | โลกขยับจริง… แต่น้อยกว่าความกว้างอะตอมเดียว | [739, 824) | 13 |
| C10 | L09 | เราว่าเราหนักแล้ว… โลกหนักกว่ามหาศาล | [834, 911) | 14 |
| C11 | L10 | พอลงพื้น… โลกก็กลับที่เดิม | [923, 986) | 15 |
| C12 | L11 | แต่… คนแค่สนามเดียว ก็ทำพื้นสั่นได้นะ | [1010, 1090) (the 16→17 cut at 1054 is 2 f before "ก็", no pause: ±5 f risk) | 16–17 |
| C13 | L12 | ที่ซีแอตเทิล เกมฟุตบอลอเมริกัน กับคอนเสิร์ตในสนามกีฬา | [1094, 1198) (starts in shot 17 +40; the 17→18 cut at 1101 is 2 f before "ซีแอตเทิล", no pause; the 18→19 cut at 1154 sits in the pause [1152, 1156)) | 17–19 |
| C14 | L13 | คนหลายหมื่นขยับพร้อมกัน… พื้นสั่นจนเครื่องวัดข้างสนามจับได้ | [1203, 1326) (the 20→21 cut at 1259 sits in the "…" pause [1258, 1261)) | 20–21 |
| C15 | L14 | ถอยออกไปดูจากอวกาศ… | [1348, 1385) | 22 |
| C16 | L15 | คนกว่าแปดพันล้านคน… บนโลกใบนี้ เป็นแค่จุดเดียว | [1394, 1499) | 22 |

<a id="word-pegged-key-frames-r20"></a>
## Word-pegged key frames (R2.1)

`anchor` = the word starts on a measured pause end or line onset (±0.03 s); `interp` = whisper word time checked against the syllable count between the nearest anchors (±0.15 s = ±5 f). Editor checks the `interp` pegs by ear at W5 and moves the picture beat, not the audio, if a word lands more than 3 f off.

| Shot | Key frame | Word | Kind | Read s | Local | Global |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | whole Bangkok enters the frame | "รวมทั้งคุณด้วย" | anchor | 1.36 | +41 | 41 |
| 2 | phone and crowd read together | "กว่าแปดพันล้านคน" | anchor | 2.36 | +2 | 71 |
| 3 | fill spreading | "ได้หมด" | interp | 4.74 | +30 | 142 |
| 3 | Bangkok outline + OT02 | "กรุงเทพฯ" | interp | 5.18 | +43 | 155 |
| 3 | Nonthaburi outline + OT02 | "นนทบุรี" | interp | 5.75 | +60 | 172 |
| 4 | OT03 on | "ครึ่งเมตร" | anchor | 7.24 | +27 | 217 |
| 4 | square reads complete with tag | "คูณครึ่งเมตร" | anchor | 7.76 | +43 | 233 |
| 6 | last districts flooding | "เต็มทุกเขต" | anchor | 9.27 | +18 | 330 |
| 6 | front crosses the border | "ล้นเข้านนทบุรี" | interp | 10.30 | +49 | 361 |
| 6 | Nonthaburi outline pulses | "นนทบุรี" | interp | 10.84 | +65 | 377 |
| 7 | push begins to settle | "ยังไม่ทัน" | anchor | 11.76 | +8 | 405 |
| 7 | trickle thinning | "คนก็หมดแล้ว" | anchor | 12.80 | +39 | 436 |
| 7 | **fill stops, M1 stops dead** | "หมด" | interp | 13.10 | +48 | 445 |
| 8 | whole country in frame | "โลกใหญ่กว่านั้นอีก" | anchor | 15.20 | +43 | 520 |
| 9 | street grid under us | "ตรงนี้" | interp | 17.80 | +39 | 598 |
| 10 | looks up | "กระโดด" | anchor | 18.43 | +3 | 617 |
| 10 | hands free, ready dip | "พร้อมกัน" | anchor | 18.83 | +15 | 629 |
| 13 | limb holds | "ขยับ" | interp | 20.12 | +10 | 746 |
| 13 | ring draws on | "น้อยกว่า" | anchor | 21.12 | +40 | 776 |
| 13 | lean toward the ring | "อะตอมเดียว" | anchor | 22.00 | +66 | 802 |
| 14 | beam settled, crowd pan high | "หนัก" | interp | 23.45 | +16 | 845 |
| 14 | push toward the crowd pan begins | "โลกหนักกว่า" | anchor | 24.27 | +41 | 870 |
| 15 | landing | "ลงพื้น" | interp | 26.04 | +13 | 932 |
| 15 | speck slides back | "กลับที่เดิม" | interp | 27.14 | +46 | 965 |
| 16 | bowl fills the frame | "สนามเดียว" | interp | 29.36 | +35 | 1041 |
| 17 | crane under way | "พื้นสั่น" | interp | 30.10 | +9 | 1063 |
| 18 | OT05a on | "ซีแอตเทิล" | interp | 31.44 | +2 | 1103 |
| 19 | OT05b on | "คอนเสิร์ต" | interp | 33.28 | +4 | 1158 |
| 20 | mid-bounce | "ขยับพร้อมกัน" | interp | 35.55 | +27 | 1227 |
| 21 | pen close | "พื้นสั่น" | anchor | 36.71 | +2 | 1261 |
| 21 | pull back begins | "เครื่องวัด" | interp | 37.40 | +23 | 1282 |
| 21 | box and stadium together | "ข้างสนาม" | anchor | 37.91 | +38 | 1297 |
| 21 | hold settles | "จับได้" | interp | 38.30 | +50 | 1309 |
| 22 | Thailand reads | "อวกาศ" | interp | 40.00 | +27 | 1369 |
| 22 | **E1 + OT06** | "จุดเดียว" | interp | 43.80 | +141 | 1483 |

## On-screen text (global ranges)

| ID | Text | Range | Slot |
| --- | --- | --- | --- |
| LBL | ภาพจำลอง | [0, 118) and [1006, 1561) | LBL |
| OT01 | ยืนแน่นประมาณ 4 คน/ตร.ม. · ภาพจำลอง | [118, 1006) (shot 3 +6 to the end of shot 15; LBL cross-fades into it over [112, 118)) | LBL-W (two lines allowed) |
| OT02 | กรุงเทพฯ / นนทบุรี | "กรุงเทพฯ" [155, 190), "นนทบุรี" [172, 190); both again [312, 477) | world-anchored at the province label points |
| OT03 | 50 × 50 ซม. | [217, 257) | world-anchored beside the square's right edge, leader 1 px |
| OT04 | 3 · 2 · 1 | "3" [655, 670), "2" [670, 685), "1" [685, 700) | centred (540, 520), 260 px |
| OT05a | ซีแอตเทิล · 2011 | [1103, 1154) | LBL2 |
| OT05b | ซีแอตเทิล · 2023 | [1156, 1342) | LBL2 |
| OT06 | คนทั้งโลก | [1483, 1561) | world-anchored to the dot, leader to (760, 820) |

## Rules for every shot

- **R01 Labels.** "ภาพจำลอง" visible in every frame (LBL or inside OT01), per the brief's [truth limits](film-brief.md#truth-limits).
- **R02 Truth limits.** As the brief: fill over water, the fill ends inside Nonthaburi at 77 ± 2 %, the jump only in the Bangkok crowd, no visible Earth move at Earth scale, the speck far smaller than the atom, the Earth's pan down, day game / night concert, no cause cue from crowd to trace, no city-still pull-back, no number on screen except OT01's density, OT03's size and OT05's years.
- **R03 Size reference.** Every shot keeps one: people (street, stadium), roads and province outlines (map), Thailand's outline (shots 8–9), the Earth (shots 13, 14, 22).
- **R04 Feet and lattice.** In `S` everyone stands on y 0 on the 0.5 m lattice (±0.08 m jitter); in the jump each body leaves and lands on its own lattice point (no drift); the man on M0.
- **R05 Screen.** Faces, the phone, labels and every hero detail above y 1160; the caption band calm per the brief's rule.
- **R06 Ambient clocks.** Cloud drift (map, globe), idle-breathe and seeded head turns (crowd), beam sway (balance), the drum turning and the stadium beams run on ambient clocks; event clocks (h, φ, jump, beam slam, pen jitter) are shot-local (DF-20261030-painted-story-hold-ambient-clock).
- **R07 Continuity.** φ carries across map shots (VD05); the stadium night state shots 19–21; K02 identical in shots 1 and 16; the jump's event clock continues from shot 12 +20 into shot 15 +0.
- **R08 District lines (Q-F1 = a).** OSM district lines (Bangkok 50, Nonthaburi 6) on L2 at 35 % as the brief's palette; the fill floods inside them in shot 6. The credit "© OpenStreetMap contributors" goes in the video description, not on screen.

## Props and hands

| Shot | MAN right hand | MAN left hand | Phone |
| --- | --- | --- | --- |
| 2 | holds the phone at upper chest | free, at his side | in hand, screen lit (K01) |
| 4 | holds the phone (hidden below the shoulders from above) | free | in hand |
| 5 | phone held to his chest | tucked | in hand |
| 10 | +8–+20 slides the phone into the right shorts pocket; free from +20 | free; both arms swing back from +22 | in hand → pocket |
| 11–12, 15 | free (crouch, arms up, landing) | free | pocket |

No other carried prop. Every action is possible with these states (both hands are free before the crouch).

## Per-shot staging

Key frames shot-local `+n`. Sound lines give the shot-local frame, the brief's code or library ID ([Sound direction](film-brief.md#sound-direction)) and a short description (source / action / material / space / length / feeling); every library ID is "not listened" and Ton checks it against its description before use; NEEDS-GEN = Ton makes it. Mix intent per the brief's arc; Editor sets levels.

**1. S01-B01-SH01** [0, 69), 69 f. VO C01 +8–+69 (continues into shot 2; "รวมทั้งคุณด้วย" +41; the "…" pause +68–+71 straddles the cut).
- Camera: `gcam: nadir K02 (13.755, 100.622) → MC (13.815, 100.600), h 0.58 → 80 km, f 1000, pp (540, 640) → (540, 660), yaw 0°`; hold +0–+10, rise +10–+62 (log h), hold +62–+68. At +0: 1,724 px/km, the bowl roof ≈ 517 × 431 px at (540, 640); at +62: 12.5 px/km, Bangkok + Nonthaburi ≈ x 81–999, y 211–1109.
- Staging: `G` L3 → L2 cross-fade (**R2.4:** h 2–5 km, L3 alpha `(1 − ramp)^1.7`, into the B-MR1 built-up tone and grain, in by h 3.2 km; was 2–6). +0: the stadium bowl (K02) straight down, rooftops and streets around it, streams of people (coloured speck ribbons) flowing along every street into the bowl and the blocks; the bowl's stands already half full. As the camera rises, the streams become rivers pouring along the highways from every frame edge into Bangkok; φ 0 → 0.03 (streams + first pools); the river, the Gulf, Nonthaburi's green read by +50.
- Key frames: +0 reads "a city from above, people pouring in" (UT01; LF01A); +41 on "รวมทั้งคุณด้วย" central Bangkok fills the frame (h ≈ 14 km on the smoothstep log-h path; **R2.3:** R2.2's "the whole of Bangkok in frame" did not fit this camera, which reaches it only at about +52, h ≈ 55 km, est); +62 the whole map.
- **Mid-rise look (R2.3, Film ruling on Boss group 3).** Between h 2 and 40 km (this shot +25–+51; shot 16 +13–+31; shot 9's last frames) the city must read as a city with people streaming in, not as tiled blocks (h ≈ 3 km, +30) or empty fields (h ≈ 14 km, +41), as Boss's stills `out/edu17/g3/sh01_p30.png` and `sh01_p41.png` show. Change list B-MR1–B-MR5 in [film-brief.md](film-brief.md#look-c-rulings); pass: Film viewer check at 270 px on +25, +30, +35, +41, +45, +51. **R2.4: passed** on Boss's fix pass B (`out/edu17/gb/BMR5_sheet.png`, viewed at 1,100 px for the 10 tiles): +30 (h 2.9 km) is a hand-over frame, block grid over the tone and grain with the streams on top, accepted; +35–+51 read as a grey city with streams on the highways, distinct from the fields; built-up weight 1 to h 30 km (not 20) and ribbon floors 12 / 8 / 10 px accepted (brief H9 rulings).
- Sound: **S1** NEEDS-GEN at +0: a vast rush of countless footsteps and shuffling arriving from far away, growing denser and closer, sandals and shoes on asphalt, murmurs rising, open city air, 2.2 s, peaks about +45 (a wave of people pouring in); the first 0.3 s is S1 alone. **A1** `outdoor_aerial-town-air_01` from +9 (high open air, soft wind); **A2** `crowd_murmur-far-bangkok_01` rising from +20 with the streams. No music.
- Entry → exit: +0 the stadium close from above → +68 the whole map, streams at the edges.

**2. S01-B01-SH02** [69, 112), 43 f. VO C01 +0–+41 ("กว่าแปดพันล้านคน" +2).
- Camera: `ycam: pos (0.55, 2.05, 1.60) → (0.50, 2.00, 1.40), look-at (0, 0.85, −4.0), f 1000`; slow push +0–+42. Computed (R1.0) at +0: his head 240 px (back of head y 950–1185, x ≈ 310, left third), phone ≈ (430, 1085), crowd at 8 m ≈ y 800, shophouse base y ≈ 725, viaduct far edge y ≈ 45.
- Staging: `S`. MAN `back`, P10 raised (phone at upper chest in the right hand, screen tilted toward the lens): the phone's map shows streets and a blue "you are here" dot with a pulse ring (K01, ≈ 6 px dot on a 35 × 70 px screen; **R2.4:** the dot and its pulse ring are emissive and painted after the lens falloff at full colour over the dimmed phone, so K01 reads at 6 px; the screen map stays under the falloff). Ahead: the packed crowd to the shophouses, the viaduct and its pillar (x −8) upper frame; **R2.5 (H10-1):** the crowd is packed from +0 with no gap and no squeeze-in motion (the R2.4 "people squeezing in from both frame edges +0–+28" is dropped, accepted as built in the W5.3 draft); the crowd keeps its idle sway only.
- Key frames: +2 the phone and the crowd read together; +0–+42 no gap anywhere (R2.5).
- Sound: **A3** NEEDS-GEN from +0 (dense packed outdoor crowd from inside it: shuffling, cotton rustle, many overlapping unintelligible voices in many languages, no traffic, slight slap echo between shophouses under a viaduct, 14 s loop; cramped, hot, patient); A1/A2 out on the cut. **S3** NEEDS-GEN at +18: a neighbour's shoulder pressing in, cotton tees rustling, a sneaker scuff, close, 0.5 s (cramped); R2.5: an off-frame neighbour at his left shoulder, no picture sync needed.
- Entry → exit: +0 over his shoulder, packed → +42 packed, pushed in 0.2 m.

**3. S01-B01-SH03** [112, 190), 78 f. VO C02 +2–+76 ("ได้หมด" +30, "กรุงเทพฯ" +43, "นนทบุรี" +60).
- Camera: `gcam: nadir MC, h 85 → 80 km, f 1000, pp (540, 660), yaw 2 → 0°`; slow settle +0–+77.
- Staging: `G` L2 with the OSM district lines (R08). The crowd spreads from the streams over the map as a grey-brown flecked texture, φ 0.03 → 0.30, over the river and canals too (O5); the K02 bowl is a speck inside the fill. OT01 in LBL-W from +6; OT02 "กรุงเทพฯ" at +43 and "นนทบุรี" at +60 (world-anchored); each province border brightens on its name.
- Key frames: +43 Bangkok's outline highlighted; +60 Nonthaburi's; +77 about a third filled, centre first.
- Sound: **M1** NEEDS-GEN enters at +0 (pizzicato strings and marimba over soft upright bass and light shaker, curious and bouncy, 100 bpm; pick-up, energy 1.5); A1 + A2 (A2 rising with φ).
- Entry → exit: +0 map with streams → +77 a third filled.

**4. S01-B01-SH04** [190, 257), 67 f. VO C03 +2–+61 ("ครึ่งเมตร" +27, "คูณครึ่งเมตร" +43).
- Camera: `ycam: pos (0, 4.00, 0.08) → (0, 3.85, 0.08), look-at (0, 0, 0), f 1000` (straight down, EP14 `topdown.ts` precedent); push +0–+66. Computed at +0: the 0.5 m square ≈ 220 px (x 430–650, y 847–1066), his head centre (540, 956).
- Staging: `S` from above. `new: person-top` crowd on the 0.5 m lattice: hair discs, shoulders in outfit colours, arms tucked; his spiky black hair and mustard tee in the centre. A faint 0.5 m grid fades in +0–+10; one square draws on around his head +12–+24 (2 px `#ffd34a`); OT03 "50 × 50 ซม." at +27 on "ครึ่งเมตร" beside its right edge, holds to the cut.
- Key frames: +24 the square complete; +43 LF03.
- Sound: **S2** `whoosh_fast-slide_01` at +12 (very short light whoosh: the square drawing on); A3 continues; M1 thins to its bass and pluck.
- Entry → exit: +0 heads from above → +66 the square around him, tagged.

**5. S01-B01-SH05** [257, 312), 55 f. V01 +4–+47 (take A strained, voice 43 f; R2.1 grew this shot 30 → 55 f).
- Camera: `ycam: pos (0.10, 1.62, 1.30) → (0.08, 1.60, 1.22), look-at (0, 1.20, 0), f 1000`. Computed: head 345 px (y 551–896), phone y 1069, neighbours' heads at x ≈ 247 and 840; full figure ≈ 1,290 px.
- Staging: `S`. MAN `front`, P10 + `new: squeezed` (elbows tucked, shoulders up, phone held to his chest), `tired`; two neighbours' shoulders press in from both sides at +2 (a man in an office shirt, a woman in a nurse's uniform, `neutral`); he mutters V01.
- Key frames: +2 the squeeze; +4 V01 starts; +15 LF02; +47 V01 ends; +54 last frame (8 f beat on his face before the cut, as R2.0). The camera's push runs +0–+54. Inside V01 the take has gaps at +7–+9, +16–+21 and +31–+34 (file 0.09–0.18, 0.40–0.57, 0.90–1.00 s; not listened): Editor may time the second shoulder nudge into one by ear, no frame change.
- Sound: **S3** at +2 (the same squeeze sound as shot 2, both shoulders); V01 at +4 (to +47); M1 continues under it, ducked as under NAR (55 f ≈ 3 beats at 100 bpm); A3.
- Entry → exit: +0 face front → +54 squeezed, eyes half shut.

**6. S01-B02-SH01** [312, 397), 85 f. VO C05 +2–+83 ("เต็มทุกเขต" +18, "ล้นเข้านนทบุรี" +49, "นนทบุรี" +65).
- Camera: `gcam: nadir MC, h 80 → 72 km, f 1000, pp (540, 660), yaw 0 → 3°`; slow push +0–+84.
- Staging: `G` L2. φ 0.30 → 0.80: the fill floods Bangkok district by district inside the OSM district lines (each district's line flashes once as it fills), the last districts on "เต็มทุกเขต" (+18), every Bangkok border reached by +40 (φ 0.765); then it crosses north into Nonthaburi +40–+84 along the river and roads first, the border crossed on "ล้นเข้านนทบุรี" (+49); OT02 both names; OT01.
- Key frames: +18 the last districts flooding; +40 Bangkok full; +55 LF01B.
- Sound: M1 builds (felt-piano layer joins); A2 swells with φ.
- Entry → exit: +0 a third filled → +84 Bangkok full, the front inside Nonthaburi.

**7. S01-B02-SH02** [397, 477), 80 f. VO C06 +1–+62 ("ยังไม่ทัน" +8, "คนก็หมดแล้ว" +39, "หมด" +48).
- Camera: `gcam: nadir MC → Nonthaburi centre (13.95, 100.42), h 80 → 45 km, f 1000, pp (540, 660), yaw 3°`; push +0–+40, hold +40–+79. At +40: 22.2 px/km, Nonthaburi ≈ 865 px across.
- Staging: `G` L2. The fill slows (ease-out) φ 0.80 → 1.00 at +48, the front reaching into Nonthaburi from the south and east; the last thin trickle of specks along one road stops at +48; the north-west quarter (about 23 % of the province, plan area) stays green with field grids; no fill at the province border there. The 0.40 s gap after the line (+62–+79) is a still frame of the stopped map.
- Key frames: +48 the stop on "หมด"; +55 the empty quarter reads.
- Sound: M1 continues to +47, **stops dead at +48** with **S4** `comedy_pluck-knock-flinch_01` at +49 (tiny pizzicato pluck with a hollow woodblock knock: the dry comic stop); A2 drops to a steady murmur.
- Entry → exit: +0 the whole map → +79 Nonthaburi, the fill stopped, a quarter green.

**8. S01-B02-SH03** [477, 559), 82 f. VO C07 +6–+75 ("โลกใหญ่กว่านั้นอีก" +43).
- Camera: `gcam: nadir Nonthaburi centre → (13.75, 100.50), h 45 → 1,100 km, f 1000, pp (540, 660) → (540, 820), yaw 3 → 0°`; hold +0–+6, rise +6–+60, settle +60–+81. At +81: 0.91 px/km, Thailand ≈ x 230–1044, y 145–1638; the patch ≈ 66 px at (540, 820).
- Staging: `G` L2 → L1 (cross-fade h 150–300 km, +30–+44): the grey patch shrinks into Thailand; neighbouring countries muted, the Gulf and the Andaman Sea blue; light cloud wisps at altitude.
- Key frames: +43 "โลก…" the whole country in frame; +60 settled.
- Sound: **S5** `whoosh_height-wind-rush_01` at +6 (high-altitude wind rush rising then thinning); A1 thinning to air; no music.
- Entry → exit: +0 Nonthaburi → +81 Thailand with a small patch.

**9. S01-B03-SH01** [559, 614), 55 f. VO C08 +7–+55 (continues; "ทุกคน" +29, "ตรงนี้" +39).
- Camera: `gcam: nadir (13.75, 100.50) → M0 (13.737, 100.560), h 1,100 → 6 km, f 1000, pp (540, 820) → (540, 700), yaw 0°`; hold +0–+10 (on "แต่…"), dive +10–+50, hold +50–+54. At +50: 167 px/km, the BTS line a pale stripe through the crowd texture at (540, 700).
- Staging: `G` L1 → L2: Thailand → Bangkok → the street grid around M0, the whole frame the flecked crowd texture.
- Key frames: +39 "ตรงนี้" the street grid under us.
- Sound: **S6** NEEDS-GEN at +10: a descending air rush falling from high sky toward a city, pitch dropping, ending into crowd murmur, 1.2 s (plunging back in); lands into A3 at +50; M1 returns at +39 on a busier phrase.
- Entry → exit: +0 Thailand → +54 the crowd texture straight down.

**10. S01-B03-SH02** [614, 655), 41 f. VO C08 +0–+32 ("กระโดด" +3, "พร้อมกัน" +15).
- Camera: `ycam: pos (0.20, 1.00, 2.40) → (0.18, 0.98, 2.20), look-at (0, 1.30, 0), f 1000`. Computed: standing head 172 px (y 792–964); full figure ≈ 740 px; sky above him (the viaduct out of frame top).
- Staging: `S`. MAN `front`: +2–+10 `nod` up (looks up at the sky), `neutral` → `happy`; +8–+20 slides the phone into his right shorts pocket; +22–+40 `standing-jump` **anticipation only**: knees soft (pelvis −0.05 m), arms swing half back (R2.0 continuity fix: the full crouch belongs to shot 11's "1"). **R2.5 (H10-2, H10-3), accepted as built in the W5.3 draft:** the neighbours keep looking ahead (no look-up); the pocket is the P10 → P01 change with the phone back dark until +20 and gone from +21 (pass: no phone visible from +21, no frame where it vanishes from an open hand in front of the torso).
- Key frames: +3 looking up on "กระโดด"; +20 hands free (phone gone from +21); +40 ready stance.
- Sound: A3; M1 phrase ending clean at +32; a soft pocket rustle inside A3 (no cue).
- Entry → exit: +0 looking ahead → +40 ready stance, looking up.

**11. S01-B03-SH03** [655, 700), 45 f. W-COUNT.
- Camera: `ycam: pos (0, 4.5, 6.0) → (0, 4.6, 6.0), look-at (0, 0.6, −4.0), f 1000`; a 0.1 m rise. Computed (**R2.3**, corrected from R2.2's (540, 1051) → (540, 1092), which were 29 px low; Boss's ycam build and Film's recheck agree): his crown (head top 1.72 m) (540, 1022) standing at +0 → crouched crown (1.42 m) (540, 1067) at +44 (1063 if crouched at +0); halo centre 0.10 m below the crown (540, 1036) → (540, 1080); the sea of heads from y ≈ 660 (shophouse base) to the frame bottom; pillar base at x ≈ 56.
- Staging: `S` high angle. Everyone in the ready stance, faces up; OT04 "3" +0, "2" +15, "1" +30; on "1" the whole sea of heads drops into the full crouch (pelvis −0.30 m, seeded ±2 f) +30–+42; his spiky hair and tee findable at the centre.
- **Crouch read (R2.5, H10-4).** In the W5.3 draft the 0.30 m drop alone moves the heads about 13 px (far rows, z −17.5) to 45 px (him) at full size, so +30 and +44 look the same at 270 px. Add a **forward lean** on the same clock and seed (lean fraction `l = sm((c − 30) / 12)`, `c` = shot-local frame + the person's ±2 f jitter, as `dropAt`): torso pitched **30°** toward the lens (+z, the way the crowd faces) at l = 1 (people bend at the hips into the spring), so each head moves a further **0.08 m down** and **0.27 m toward +z** and pitches **15°** chin-down (more hair crown, less face); the torso card's visible height scales to **× 0.68** (est.: a torso leaning 30° toward a camera pitched 21° down foreshortens by cos 51° / cos 21°). Total head drop 0.38 m. Pelvis stays −0.30 m (`JUMP.crouch` unchanged, so shot 12 starts at the same crouch height). Applies to every head card and full figure in the shot and to him (crown 1.72 → 1.34 m; est. crown ≈ (540, 1085) at +44, halo centre 0.10 m below it, moving with the head). The far crowd mass drops by the mean head drop × 0.85 as now. Pass (viewer check at 270 px, +30 and +44 side by side): the shirt band between head rows visibly shorter and the sea darker (more hair) at +44; mean head y in the band y 900–1150 (full size) ≥ 25 px lower at +44 than at +30; him still findable at +44 (A16).
- **Find him (R2.2, user-approved 2026-11-12; looks-b.md SH11 check, still `projects/edu/EDU/looks/ep17/set-b/2026-11-12_SH11-CLEAR.png`).** As built (`..._SH11-NONE.png`) his head is a 7 px dot among same-size heads and does not read at 270 px. Three parts, all required: (1) **tee `#ffc21a`** in this shot (brighter than the brief's `#e3b23c`; shoulders 0.27 m); (2) **clear zone**: no yellow, mustard, orange or cream top within **3 m** of M0 (the crowd rule in Casting); (3) **halo**: a warm light pool on him, two washes in world metres centred 0.10 m below his head top, `#fff3c4` at 120/255 over 0.55 × 0.45 m and `#fff8e0` at 110/255 over 0.36 × 0.30 m, moving with his head through the crouch (halo centre ≈ (540, 1080) at +44, R2.3). It reads as sun through a gap, not a graphic marker. Pass: findable in about 1 s on a 270 px frame at +0 and +44 (viewer check).
- Key frames: +30 the drop and lean start; +42 all crouched and leaning (30°).
- Sound: **silence**: M1 and A3 cut at +0 (A3 kept at −30 dB, held breath); **S7** NEEDS-GEN at +0, +15, +30 (a dry hardwood clave knock, 0.15 s, each a semitone higher, dry and centred); **S8** NEEDS-GEN at +31 (thousands bending their knees at once: soft massed cloth rustle and a shoe-scuff dip on asphalt, 0.6 s, about to spring).
- Entry → exit: +0 ready → +44 crouched, still.

**12. S01-B03-SH04** [700, 736), 36 f. V02 +4–+11 (take A strained, 7 f).
- Camera: `ycam: pos (0.30, 0.95, 2.60), look-at (0, 1.40, 0), f 1100` (static: the background is the reference). Computed: crouched head y 919–1100; apex head y 667–834; figure at apex ≈ 930 px.
- Staging: `S`. `standing-jump` take-off at +3 (P08 arms up), apex +16 (0.42 m clearance), descending from +20; `laugh`; **R2.5:** the crowd's shot 11 lean (30°) carries over the cut at +0 and releases to upright over +0–+3 (`l = 1 − sm(c / 3)`, same jitter), so the spring reads from the bend; every neighbour leaves the ground with him (seeded ±2 f, clearances 0.25–0.45 m), arms up; the shophouse awnings and the sky stay put.
- Key frames: +3 lift-off; +16 apex (everyone in the air).
- Sound: **S9** NEEDS-GEN at +3 (thousands of bodies leaving the ground together: a wide soft upward air whoosh with cloth flutter, no boom, 0.8 s, lift-off, fun); V02 at +4; A3 back at −8 dB at +3.
- Entry → exit: +0 crouched → +35 descending (the landing is in shot 15).

**13. S01-B03-SH05** [736, 829), 93 f. VO C09 +3–+88 ("ขยับ" +10, "แต่" +33, "น้อยกว่า" +40, "อะตอมเดียว" +66).
- Camera: `D` fixed plane; in-canvas push. +0–+22 the Earth limb (arc top y 600, Thailand and the crowd patch at (540, 600), the patch a 4 px bump inside the marker ring); loupe opens from the patch +22–+36 to full frame; inside: a row of atoms at the surface, hero atom 360 px at (540, 760); slow push 6 % +38–+92.
- Staging: no visible Earth motion. On "น้อยกว่า" (+40) the marker ring draws on the hero atom's lower edge (**R2.2, LF04 atom pick B:** ring 44 px across × the push, stroke **5 px** `#ffd34a` with a 2 px `#1a2140` keyline and a 6 px soft glow; the brief's 2 px vanished at 270 px; the same ring style wherever the ring appears: the limb patch here, shot 14's pan ring, shot 15's inset); +45 the 3 px speck appears inside it; +66 the push leans toward the ring. OT01 holds.
- Key frames: +22 loupe starts; +45 the speck; LF04 at +72.
- Sound: **A6** `space_thin-airy-pad_01` from +0 (thin airy glassy pad, no melody); **S10** `reveal_glass-shimmer-soft_01` at +22 (the loupe opening); **S11** `water_ice-settle-tick_01` at +45 (one tiny glassy tink: the speck, the joke).
- Entry → exit: +0 the curve of the Earth → +92 the atom and the speck.

**14. S01-B03-SH06** [829, 919), 90 f. VO C10 +5–+82 ("หนัก" +16, "โลกหนักกว่า" +41, "มหาศาล" +64).
- Camera: `D` fixed plane; static +0–+40, push 8 % toward the crowd pan +41–+89.
- Staging: the brass balance in space (pivot (560, 560)); the Earth (r 165) in the left pan, the crowd speck (4 px) in the right pan with its ring (**R2.2:** 52 px across, stroke **5 px** `#ffd34a`, 2 px `#1a2140` keyline, 6 px glow, as shot 13). +0 the beam level; +2–+10 the Earth's side slams down to the 28° stop, the crowd pan flung to the top; **R2.4:** the beam never passes the stop: it rebounds off it to 26° at +14 (half sine) and drops back onto the stop at 28° by +18 (a second, smaller contact, no extra cue); then still, with the crowd pan's chains wobbling to +40. The 0.30 s gap after the line (+82–+89) holds on the high pan. OT01 holds.
- Key frames: +10 the stop (O7); +30 LF04 (balance); +64 the speck in the pan centre frame.
- Sound: A6; **S12** `stinger_low-muted-hit_01` at +9 (short low muted hit: the Earth's pan on its stop); **S13** NEEDS-GEN at +11 (a light brass pan springing up and clinking against its stop, small metal tink and a short chain wobble, dry, 0.5 s, comically light).
- Entry → exit: +0 level → +89 Earth down, the crowd pan high and close.

**15. S01-B03-SH07** [919, 1006), 87 f. VO C11 +4–+67 ("ลงพื้น" +13, "โลกก็กลับที่เดิม" +38, "กลับที่เดิม" +46).
- Camera: `ycam: pos (0.30, 0.95, 2.60), look-at (0, 1.40, 0), f 1100` (= shot 12).
- Staging: `S`. The jump's event clock resumes from shot 12 +20 (the cutaways are explainer time): everyone descends and lands at +14 with a knees-bent dip; the man steadies, `relieved` at +30, `idle-breathe`. Inset: a loupe circle (centre (850, 430), r 150, below LBL-W) opens +20–+28 with the hero atom edge and the speck in its ring (**R2.4:** the glass shows shot 13's own picture at its +92 state, space ground, the hero atom with its left and right neighbours and the row beneath, scaled about 0.35 so the hero atom is ≈ 125 px across (est) and at least three atoms show in the disc, centred on the hero atom's lower edge; the ring keeps its 44 px screen size; speck path and clock unchanged in atom-relative terms); at +46 the speck slides back onto the atom's edge line and the ring fades by +60; the inset closes +70–+78.
- Key frames: +14 landing; +46 the speck back.
- Sound: **S14** NEEDS-GEN at +14 (a vast soft thump of countless feet landing together on pavement, deep but cushioned, short low rumble tail and cloth settling, no crack, 1.4 s: heavy for us, nothing for the planet); A3 settles; S11 at +46 (the same tink); M1 out.
- Entry → exit: +0 in the air → +86 standing, relieved.

**16. S01-B04-SH01** [1006, 1054), 48 f. VO C12 +4–+48 (continues; "คนแค่สนามเดียว" +25, "สนามเดียว" +35).
- Camera: `gcam: nadir MC → K02, h 80 → 0.58 km, f 1000, pp (540, 660) → (540, 640), yaw 0°`; hold +0–+4, dive +4–+42, hold +42–+47 (the bowl ≈ 517 px at (540, 640), as shot 1's first frame).
- Staging: `G` L2 → L3: the fully filled map → the K02 bowl packed with people, streets around it solid crowd. LBL "ภาพจำลอง" (OT01 ended at the cut).
- Key frames (**R2.3 wording**): +0 the filled map at h 80 km; +35 "สนามเดียว" the bowl at frame centre, growing (h ≈ 0.9 km, roof ≈ 330 px wide, est; R2.2's "fills the frame" was wrong); +42–+47 hold on the match: bowl roof 517 × 431 px at (540, 640), the same frame as shot 1 +0 (Boss measured 518 × 432). The match cut is shot 16 +47 → shot 17 +0. Mid-rise frames +13–+31 follow shot 1's R2.3 mid-rise look.
- Sound: S6 at +4 (the same dive); A2 → A3 far.
- Entry → exit: +0 the filled map → +47 the Bangkok bowl, matched outline.

**17. S01-B04-SH02** [1054, 1101), 47 f. VO C12 +2–+36 ("พื้นสั่น" +9); C13 "ที่" from +40.
- Camera: `ycam (T): pos (0, 601, 0.5) → (−70, 120, 170), look-at (0, 0, 0) → (0, 15, 0), f 1000, hy 640 → 960`; hold +0–+5 (match: **roof edge** 517 px wide, x ≈ 281–799, centred (540, 640), long axis horizontal; wall base ≈ 476 px), crane down +5–+46 (ease; hy rides the same ease, so the end pose is the plain hy 960 camera). **R2.3:** start lens y 580 → 601 (at 580 the roof edge measured 536 px against shot 16's 518, a 3.6 % jump on a match cut; one number fixes it) and hy written down (Boss's 640 → 960 confirmed).
- Staging: `T` day state (O4): grey overcast January afternoon, the generic bowl full, the field below; at the end the camera is over the upper rim looking across the roaring stands.
- Key frames: +0 the match; +36 the stands' crowd readable as people.
- Sound: **A4** NEEDS-GEN swells in at +0 (a full open-air stadium crowd on a damp grey afternoon: wide roar that swells and settles, rhythmic clapping, a few horns, no announcer, no music, huge open concrete bowl, 10 s; big and loud); A3 out on the cut.
- Entry → exit: +0 the bowl from above → +46 over the rim, three-quarter view.

**18. S01-B04-SH03** [1101, 1154), 53 f. VO C13 +0–+53 ("ซีแอตเทิล" +2, "เกมฟุตบอลอเมริกัน" +14).
- Camera: `ycam (T): pos (−10, 33, 92) → (4, 33, 92), look-at (0, 0, 0) → (4, 0, 0), f 1000`; truck +0–+52. **R2.2 (LF05A pick B, user-approved 2026-11-12):** eye y 40 → **33**. At y 40 the lens floated 8.8 m over the upper-deck seats (surface y 31.18 at 67.5 m outside the field edge), so the fans were 130 px dots over empty concrete; at 33 it is 1.82 m over the deck (a standing fan's eye), pitch −23.4° → −19.6°. Three or four rain-jacket fans with arms up stand big in the foreground; the field and far stands sit at y ≈ 480–1060 (measured on LF05A).
- Staging: `T` day. Foreground: fans in rain jackets from behind, arms up, cheering (kit `hoodie` cards, `back`, tinted `#2d3440` `#4a5a6a` `#3a3f4a` `#6b7480`, one `#c94f3d`, P08 arms up for two in three, seeded; the two front rows on the deck surface `standY`); below, the field with two plain-jersey teams lined up (1–2 px figures), no logos, the blank video board. OT05a in LBL2 from +2; LBL.
- Key frames: +25 LF05A.
- Sound: A4 roar with rhythmic claps.
- Entry → exit: the stands moving past, the field below.

**19. S01-B04-SH04** [1154, 1200), 46 f. VO C13 +0–+44 ("คอนเสิร์ต" +4, "ในสนามกีฬา" +19).
- Camera: `ycam (T): pos (−30, 35.7, 96) → (−28, 33.6, 93), look-at (58, 8, 0), f 1000`; push +0–+45 (smoothstep). **R2.2 geometry fix:** R2.1's lens (y 32 → 31) was inside the upper deck: the seat surface is y 33.88 at the start (71.5 m outside the field edge) and 31.85 at the end (68.5 m), so the lens sat 1.88 m and 0.85 m under it. The lens now stands **1.8 m over the surface at both ends** (as shot 18); the surface is linear along the path, so every frame between clears it. The row in front (z 95.2) has heads at y ≤ 34.74, below the start lens. LF05B was painted at looks-b's interim (−30, 34.4, 96) → (−28, 33.6, 93); at its frame +24 the new lens is 0.59 m higher and the picture moves ≤ 3 px (stage deck top (540, 1001), truss top (492, 857), near field edge (199, 1214) vs (198, 1212)), so LF05B stands.
- Staging: `T` night state: the stage at the +x end lit warm white, coloured beams in haze, no performer drawn; the field floor packed, phone lights speckling; the stands dark with a warm rim. No foreground fans (their heads overlap the stage and read as performers from this lens); the near seats are dark head cards (LF05B). OT05b "ซีแอตเทิล · 2023" in LBL2 from +2; LBL.
- Key frames: +24 LF05B.
- Sound: **A5** NEEDS-GEN from +0 (a stadium concert from the stands at night: deep instrumental bass-and-kick pulse from a big system, no vocals, a huge cheer riding on it, roomy bowl, 10 s; exciting); A4 out on the cut.
- Entry → exit: night stadium wide, slowly closer.

**20. S01-B04-SH05** [1200, 1259), 59 f. VO C14 +3–+59 (continues; "ขยับพร้อมกัน" +27).
- Camera: `ycam (T): pos (15, 14.2, 52) → (15, 11.9, 48), look-at (30, 2, 10), f 1000`; push +0–+58. **R2.2 geometry fix:** R2.1's lens was inside the lower bowl (surface y 12.41 at 27.5 m outside the field edge at the start, 10.10 at 23.5 m at the end; lens 9 → 8.5 sat 3.41 m and 1.60 m under it). The lens now stands **1.8 m over the surface at both ends** (a standing fan in the lower stands, as shots 18 and 19); pitch −8.9° → −15.3° at the start, −13.6° at the end. Computed at +0 / +58: stage deck front (58, 2.5, 0) at (898, 875) / (907, 876), stage back-wall top (62, 18, 0) at (976, 622) / (984, 611), floor crowd heads near (20, 1.5, 22) at (373, 1095) / (364, 1104) and far (40, 1.5, −15) at (554, 869) / (542, 874); the lower stands' front heads (15, 1.4, 31) at y 1278 / 1323 are crowd mass in the caption band (no hero detail there).
- Staging: `T` night. The floor and lower stands crowd bounce and sway together, four bounces (peaks +6, +19, +32, +45; 13 f period ≈ 2.3 Hz), arms up, phone lights bobbing; the stage light washes over them. Nothing points from the crowd to the ground (O3).
- Key frames: +27 "ขยับพร้อมกัน" mid-bounce.
- Sound: **S15** NEEDS-GEN from +0 (tens of thousands bouncing in rhythm in concrete stands: deep rhythmic thud of many feet with cheering on top, under a muffled bass beat, 4 bounces, big bowl at night, 2 s; together); A5 under.
- Entry → exit: the bouncing crowd, closer.

**21. S01-B04-SH06** [1259, 1342), 83 f. VO C14 +0–+67 ("พื้นสั่น" +2, "เครื่องวัด" +23, "ข้างสนาม" +38, "จับได้" +50).
- Camera: `ycam (T): pos (−0.30, 1.10, 146.45) → (−1.20, 1.50, 148.80), look-at (0, 0.80, 146.00) → (4.0, −3.0, 118), f 1000`; hold close +0–+22, dolly back with a small rise +22–+52 (6 f ease each end, `pushU(f − 22, 30)`), hold +52–+82. **R2.3 end pose (Film ruling on Boss group 4 Q3):** R2.2's end (lens y 0.75, pitch +9.7°) dropped the lens under the glass lid (y 0.905) from about +38, so the box's steel walls hid the drum and pen through "จับได้" (+50) and the end hold; the instrument, the payoff of the line, vanished. The lens now rises 1.10 → 1.50 m (a standing adult's eye, always above the lid) and ends at yaw +9.6°, pitch −8.2°: the pen and trace stay visible through the lid in every frame (ray to the pen tip enters through the lid top, checked +0–+82), the box sits right of centre above the caption band, the street and the stadium wall behind it. Trade: the wall top (40 m) is out of frame at the end (the wall fills the upper frame with its lit concourse band); the sky is not needed. Start pose and LF06 (+12) unchanged. **R2.2 (LF06 pick B, user-approved 2026-11-12): reverse angle.** R2.1 started at (0.30, 1.10, 145.55) looking +z, away from the stadium, so the stadium glow could not show and the pull-back turned 149° (yaw −146° → +3°). The start now stands on the street side of the box looking −z across it at the stadium wall (yaw +33.7°, pitch −29.0°); the move to the unchanged end pose is a dolly back with a 31° yaw settle and a tilt up to +9.7°, no turn-around. The look-at is lowered 0.95 → 0.80 so the pen sits as computed. Computed this pass on the LF06 geometry (box 0.6 × 0.9 × 0.5 m centred (0, 0, 146), glass lid y 0.905; drum centre (0, 0.735, 146), r 0.125, half-length 0.175, axis x; pen tip at drum angle +0.28 rad; stadium wall z 114.9, concourse band y 2.6–4.4, wall top y 40):
  - +0 (and LF06 at +12, hold): pen tip (602, 891) (LF06 measured ≈ (588, 880)); drum ends (282, 1144) and (738, 973); the stadium wall and its concourse band across the upper frame behind the box.
  - +38 (u 0.54; R2.3): lens (−0.79, 1.32, 147.72), yaw 9.9°, pitch −8.5°; pen (813, 1062) through the lid; lid near edge x 683–1026 at y 1057–1073, far edge y ≈ 1002; drum ends (704, 1125) and (878, 1115); box base y 1543–1587 (steel side in the band, no hero detail); wall base y 851, concourse band y 711–769: box and stadium together.
  - +52 end pose (R2.3, recomputed on the LF06 geometry with `lookCam`; supersedes R2.2's under-the-lid pose): lens (−1.20, 1.50, 148.80); lid near edge x 710–914 at y 1029–1037, far edge x 658–834 at y 998–1003; pen (788, 1034) seen through the lid; drum ends (721, 1073) and (830, 1068), so the trace is above the band; box base y 1330–1348 (steel side in the band); wall base y 861, concourse band y 727–782, wall top off frame (y −584).
- Staging: `T` night, instrument KB. Close: the brass pen scratching a jittery line on the turning paper drum (no grid numbers, no label), the trace's jitter growing in bursts on an independent seeded clock; the stadium wall glows behind the box from +0 (lit concourse band `#f2c46a`, vents `#e9c79a`/`#9ad8e6` in three rows); the dolly back reveals the steel box with its glass lid on the pavement under a street lamp and the street between it and the stadium. LBL; OT05b holds. No pull-back past the stadium (R2).
- Key frames: +2 the trace (LF06 at +12); +38 "ข้างสนาม" box and stadium together; +50 "จับได้" the pen still scratching, seen through the lid; +52 hold (pen and trace visible to +82).
- Sound: **S16** NEEDS-GEN from +0 (a drum recorder pen scratching a jittery line on paper, fine nib scratch irregular in rhythm, slow drum-motor whir, quiet night pavement, close, 3 s; something tiny noticing); **A7** `city_still-night-air_01` + A5 low-passed about 400 Hz (the concert through the walls).
- Entry → exit: +0 the pen close → +82 the box beside the stadium.

**22. S01-B05-SH01** [1342, 1561), 219 f. VO C15 +6–+43 ("อวกาศ" +27); C16 +52–+157 ("บนโลกใบนี้" +94, "เป็นแค่จุดเดียว" +128, "จุดเดียว" +141); hold +157–+218 (62 f = 2.07 s).
- Camera: `gcam: nadir MC → (13.75, 100.60), h 80 → 7,860 km, f 1000, pp (540, 660) → (540, 960), yaw 0°`; hold +0–+5, rise +6–+90 (log h), drift +90–+218 (h × 1.005 per second). At +90: globe radius 500 px (y 460–1460), the patch's true size ≈ 6.5 px.
- Staging: `G` L2 → L1 → L0. The filled patch from above (the map as shot 7's end) → Thailand (+27) → Southeast Asia (+50) → the whole globe (+90), full-lit, clouds, atmosphere glow, navy space with stars (UT03: not flat black). From +80 the patch is drawn as an 18 px dot in K01's blue with a soft pulse ring (2.5 s period). OT06 "คนทั้งโลก" at +141 with a leader to (760, 820). LBL "ภาพจำลอง".
- Key frames: +27 Thailand; +90 the whole globe; +141 the tag (LF07 at +170); +218 last frame.
- Sound: hard cut to silence at +0, A1 at −20 dB from +2; S5 at +6 (the same rise as shot 8); A6 from +30, A1 out by +60; **E1** `stinger_celesta-glass-dot-note_01` (generated) at +141 (one soft celesta-and-glass note around C6, round attack, about 3 s natural decay, small hall, close: a tiny light in a big dark); **R2.5 (H10-5): E1 stays on "จุด" (f1483) as an under-speech glint, mixed at least 12 LU under the voice (the `speech` class, cue ≤ 2 s: 54 f = 1.8 s passes), not the −6..+3 `peak` accent; the episode's one ending accent is S19 after the last word (UT15, user request 2026-11-11); A6 fades to −∞ over +189–+218. **S19** `stinger_pizz-tag-ending_01` (library: EP14's closing pizzicato and marimba string tag, user request 2026-11-11) at +174 (f1516, as the last word ends), 45 f, 0.5 s fade to the last frame; E1 stays on "จุดเดียว". The older "no tag after E1" is replaced.
- Entry → exit: +0 the Bangkok patch from above → +218 the globe with one dot.

## Acceptance (timed checks for W5 and W6)

| Check | Shots | Pass condition |
| --- | --- | --- |
| A01 Place reads | 1, 2, 17 | First frame names "a city from above, people pouring in" without narration; shot 2 names "a street in Bangkok under the skytrain"; shot 17 a stadium (viewer check) |
| A02 Fill share | 7 | Nonthaburi filled 77 ± 2 % of its baked ring area from +48 (f445) onward; the front never on the province border; Bangkok 100 % |
| A03 Water filled | 3, 6, 7, 22 | The fill continuous over the Chao Phraya and canals (O5) |
| A04 Square | 4 | The square = 0.5 m on the lattice (220 ± 10 px at +0) around his head; OT03 from f217 |
| A05 Jump | 11, 12, 15 | Everyone crouches (f685–697), leaves (f703) and lands (f933) together (±2 f); each on its own lattice point; the background still |
| A06 Speck | 13, 14, 15 | Speck ≤ 4 px, atom ≥ 340 px, ring (5 px stroke, R2.2) visible at 270 px; speck in at f781 |
| A07 Balance | 14 | Earth's pan at the bottom stop, the crowd pan at the top from +18 (f847) to the end |
| A08 Seattle | 17–21 | Day overcast for 2011, night for 2023; no logo, no performer, no name; OT05 + "ภาพจำลอง" |
| A09 No cause cue | 20–21 | No line, arrow or synced accent links the crowd and the trace |
| A16 Find him (R2.2) | 11 | His head findable in about 1 s at 270 px at +0 and +44 (tee `#ffc21a`, halo, 3 m clear zone); no second mustard tee in any crowd shot |
| A17 Lens clear (R2.2; R2.3) | 18–21 | The lens is above every stand surface and outside the box in every frame (shots 18–20 at 1.8 m over `standY`); shot 21: lens above the lid (y > 0.905) in every frame and the pen tip visible through the lid +0–+82 |
| A18 Crouch read (R2.5) | 11, 12 | Shot 11 +30 vs +44 at 270 px: torso band visibly shorter, sea darker; mean head y in y 900–1150 ≥ 25 px lower at +44; shot 12 lean released by +3 (lift-off); him findable at +44 |
| A10 Globe | 22 | Radius 500 ± 5 px at +90 (f1432); dot 18 px; OT06 from f1483; ≥ 60 f hold after the last word |
| A11 Labels | all | "ภาพจำลอง" in every frame; numbers only in OT01, OT03, OT04, OT05 |
| A12 Zones | all | Hero details above y 1160; caption band mean ≤ 0.25, p95 ≤ 0.40 |
| A13 Cuts in pauses | all | Every cut listed as "in a pause" in the cue table lands in it; cuts at 1054 and 1101 within 3 f of the next word's onset by ear |
| A14 Credit | publish | "© OpenStreetMap contributors" in the video description (Q-F1) |
| A15 Takes (R2.1) | 5, 12 | V01 voice onset at f261 (shot 5 +4) ± 1 f, no cut inside it, its file trimmed at 1.45 s so nothing of it plays after f304; the 5→6 cut at f312; L04 onset at f314. V02 onset at f704 (shot 12 +4, 1 f after S9 at f703); total 1561 f |

## Dependencies and open items

- Boss: N1–N14 in the brief ([new assets](film-brief.md#new-assets-and-missing-capability-boss-dependencies-w52)), modules under `src/painted/edu17/` (brief R2.0); N2 bakes the OSM district lines with a NOTICE; spikes SP1–SP3 before plates; look frames LF01A–LF07 painted and **user-approved 2026-11-12** (store paths in review-rows.json `looks`, [looks-a.md](looks-a.md), [looks-b.md](looks-b.md)); the plate changes listed in both notes are Boss's.
- Ton: NEEDS-GEN M1, E1, A3–A5, S1, S3, S6–S9, S13–S16 per the Sound lines above; library checks for A1, A2, A6, A7, S2, S4, S5, S10, S11, S12 against their descriptions.
- Editor: correct L09/L10 (and L02, L04, L05 edges) in measure.json per the [measured line edges](#measured-line-edges-this-pass); place the seven narration segments; the V01/V02 takes as placed in the conventions (V01 trimmed at 1.45 s; V02 checked by ear for a click); listen to the `interp` pegs; carry the OSM credit to the description.
- Boat: picture checks B-P1–B-P4 (brief handoff).

### W5 handoff notes (Film)

- **H1 Shot 10 → 11 crouch (continuity fix).** R1.0 began the full crouch in shot 10 while shot 11 opened standing; R2.0 keeps shot 10 to an anticipation dip (pelvis −0.05 m) and the full crouch on "1" in shot 11.
- **H2 Tight cuts.** The 6→7 cut (f397) is 2 f after L04 ends and 1 f before "แต่"; the 16→17 (f1054) and 17→18 (f1101) cuts are inside running speech at word boundaries (±5 f). If the word lands later by ear, move the cut, not the audio.
- **H3 Segment E.** The L09/L10 file pause is 0.07 s; Editor cuts at 25.685 s with 2 f fades on both sides and checks for a click.
- **H4 Takes (R2.1).** V01 is 43 f of voice (shot 5 +4–+47), V02 7 f (shot 12 +4–+11). If V02 is re-taken after the ear check, a take ≤ 20 f keeps every frame; a V01 re-take with another length re-runs the rule (Film issues a new revision).
- **H5 Timing risks.** Every `interp` peg is ±5 f; E1 on "จุด" is the one peg the ending depends on (R2.5: an under-speech glint, H10-5).
- **H6 Caption band on three approved look frames (R2.2).** LF02 (shot 5 +15: mean 0.418, p95 0.756), LF05A (shot 18 +25: 0.379 / 0.608) and LF06 (shot 21 +12: 0.327 / 0.34) fail the band limit (mean ≤ 0.25, p95 ≤ 0.40) as painted. The user approved them as looks; the fix is in the plates, not the cameras or the heroes: Boss applies the darker grounds of [looks-b.md](looks-b.md) (LF02: ground under the crowd `#5d5a56` and a deeper contact shadow; LF05A: seat rows below y 1176 darker with fewer distinct cards; LF06: pavement under the box `#4a4a50` → about `#34343a`) and **re-measures all three at W5** with `scripts/caption-zone.py --band 1176:1344`. A shot still failing after that goes to Editor's caption treatment, recorded in build-notes.md.
- **H7 Camera changes (R2.2).** Shots 18–21 changed cameras only (no frame length, key frame or sound frame moved). Boss builds them from the numbers above, not from the R2.1 lines in older notes; `sh19Cam` in `look-b-stadium.ts` holds looks-b's interim start y 34.4 (sheet: 35.7).

- **H8 Rulings on Boss's group 3/4 questions (R2.3, 2026-11-12).** (1) Map caption-band shade 0.50–0.60 on shots 3, 7, 8, 9 accepted: land and crowd are brighter than the Gulf, and even at 0.50–0.60 the band means are 0.193–0.243 against the 0.25 limit, so the approved 0.40 would fail there; the hero detail above y 1160 is untouched and the Gulf shots keep 0.40. (2) Shot 17 start lens 580 → 601 m and hy 640 → 960 (camera line). (3) Shot 21 end pose changed (camera line). (4) Shot 4 clear zone is 3 m, as Casting already states for shots 2, 4, 5, 10–12, 15; `person-top.ts` `clearWarm` 1.5 m is a build gap, not a sheet change. (5) Mid-rise map look: change list B-MR1–B-MR5 in [film-brief.md](film-brief.md#look-c-rulings). (6) Shot 16 wording. (7) Shot 11 pixels corrected.
- **H9 Rulings on Boss's group 5 and fix-pass-B questions (R2.4, 2026-11-12; evidence `out/edu17/g5/g5_stills_sheet.png`, `out/edu17/gb/BMR5_sheet.png` and `base_sheet.png`, viewed small).** (1) Shot 14: rebound short to 26° at +14, back on the 28° stop by +18 (a stop is a hard contact; passing it reads as the beam going through its stop, and S12 at +9 is the hit on it). Boss change. (2) Shot 15 inset: ground rows as shot 13 (the flat blue ball at 270 px in the disc reads as a planet, not as shot 13's atom, and "the speck back on the edge line" needs the row to read). Boss change. (3) Shot 2 dot repainted after the falloff at full colour: accepted (an emissive screen dot; K01 must read at 6 px). (4) Built-up weight 1 to h 30 km: accepted (+51, h ≈ 44 km, still has to read as a city; +30 is a hand-over frame with tone and grain under the grid, L3 alpha 0.46). (5) Stream ribbon floors 12 / 8 / 10 px: accepted as the ceiling (3 / 2 / 2.5 px at the 270 px check, the brief's 5 / 3 px would vanish there); no thicker. (6) Shot 1 L3 hand-over h 2–5 km: sheet aligned.
- **H10 Rulings on Editor's W5.3 draft staging gaps (R2.5, 2026-11-13; evidence: draft cut `out/EDU-EP17-SHORT/clips/_draft_cut.mp4` frames f69, f97, f614–f654, f655/f685/f699, and `out/qa/edu-ep17/d1/sheetA.png`, `sheetB.png`, viewed at 270 px).** (1) **Shot 2 gaps closing: accepted without it.** The frames are packed from +0, which is the state the motion was to reach; the shot is 43 f and its one read is the 6 px blue dot plus the density, and edge motion would compete with the dot; shot 5 carries the squeeze ("แน่นจริง"). S3 stays at +18 as an off-frame shoulder. Sheet changed (no build). (2) **Shot 10 neighbours not looking up: accepted.** The shot's read is his decision (look up, phone away, ready); "ทุกคน" is carried by shot 11's whole-crowd crouch and shot 12's whole-crowd jump; neighbours' eyes at about 150 px heads would barely read in 41 f. (3) **Shot 10 pocket as P10 → P01 with the dark phone back until +20: accepted.** f640 shows hands free and no phone; the story needs only "hands free before the jump". Pass line added. (4) **Shot 11 crouch: spec a stronger read (forward lean, staging line above).** The crouch on "1" is the shot's only action; at f685 vs f699 nothing visibly changes at 270 px, so the count lands on no picture. The lean keeps the 0.30 m pelvis (no continuity change into shot 12) and releases over shot 12 +0–+3. (5) **E1 vs the accent range: E1 stays on "จุด", reclassified as an under-speech glint (≥ 12 LU under the voice, `speech` class), not widened and not moved.** Story: the payoff words "เป็นแค่จุดเดียว" must be heard clearly (one foreground at a time, never an accent on a stressed word); the user's S19 tag (f1516, after the last word ends at f1499) is now the ending accent, so E1 no longer has to be the hit; moving E1 off the word has no room: the gaps in L15 near it are 2–5 f (f1466–1470, f1481–1483, f1486–1490) and after f1499 it would stack on S19 (two accents in 0.6 s). A soft high glint under "จุด" while the dot pulses on screen is the picture's own sound; a celesta near C6 sits above the voice's main band, so it stays audible 12 LU down. Widening the peak range to fit it would let a 0 LU note sit on the key word. **Before the full-size final cut:** only (4) (and (5), a gain change). (1)–(3) need no work.

### Open questions

- None open for Film. V01/V02 cast and placed (R2.1). Editor's ear checks: V02 take A as a click (a re-take ≤ 20 f keeps every frame) and the V01 trim at 1.45 s.
- Q-F1 answered (a) on 2026-11-11.

## Change log

| Revision | Date | Author | Change |
| --- | --- | --- | --- |
| EDU-EP17-ROWS-R2.5 | 2026-11-13 | Film | Rulings on Editor's W5.3 draft staging gaps (H10). Shot 2: gaps closing dropped, packed from +0 (accepted as built). Shot 10: neighbours keep looking ahead; pocket P10 → P01 accepted with a pass line (no phone from +21). Shot 11: forward lean 30° on the drop clock (head −0.08 m, +0.27 m z, 15° chin-down, torso card × 0.68; pelvis −0.30 m unchanged), released over shot 12 +0–+3; acceptance A18. Shot 22: E1 stays at f1483 on "จุด" as an under-speech glint ≥ 12 LU under the voice; S19 is the ending accent. Rows text of shots 2, 10, 11, 22 rewritten. No frame length, word peg, narration or sound frame changed; 1561 f. |
| EDU-EP17-ROWS-R2.4 | 2026-11-12 | Film | Rulings on Boss's group 5 and fix-pass-B questions (H9). Shot 14 beam rebounds short to 26° (+14) and back on the 28° stop by +18 instead of a 2° overshoot past it; shot 15 inset shows shot 13's atom row (hero + neighbours + row beneath); shot 2 dot after the falloff accepted; shot 1 L3 → L2 hand-over h 2–6 → 2–5 km, mid-rise look passed (weight to h 30 km and ribbon floors accepted). Rows R2.4 (`seen` of shot 15). **No shot length, word peg or sound-cue frame changed**; total 1561 f. |
| EDU-EP17-ROWS-R2.3 | 2026-11-12 | Film | Rulings on Boss's group 3/4 open questions (H8). Shot 17 start lens y 580 → 601 (roof edge 536 → 517 px on the match) and hy 640 → 960 written; shot 21 end pose (−1.20, 0.75, 148.80) → (−1.20, **1.50**, 148.80), look-at end (0.4, 6.0, 118) → (4.0, −3.0, 118), so the lens stays above the lid and the pen shows to the end (+38/+52 recomputed); shot 11 pixels corrected (crown (540, 1022) → (540, 1067), halo (540, 1036) → (540, 1080)); shot 16 key-frame wording; shot 1 +41 wording and the mid-rise look note (h 2–40 km); A17 extended to shot 21; caption-band shade 0.50–0.60 on map shots 3, 7, 8, 9 accepted. Rows R2.3 (`seen` of shots 16 and 21). **No shot length, word peg or sound-cue frame changed**; one key-frame note added on an existing peg (shot 21 +50 "จับได้"); total 1561 f. |
| EDU-EP17-ROWS-R2.2 | 2026-11-12 | Film | W3 close-out after the user's approval of all eight look frames and Film's changes (2026-11-12). Shot 18 eye 40 → 33 m; shots 19 and 20 lens raised to 1.8 m over the stand surface (both were inside the concrete); shot 21 starts from the reverse angle (−0.30, 1.10, 146.45) → look-at (0, 0.80, 146.0), a dolly back to the unchanged end pose, projections recomputed; shots 13/14 marker ring stroke 5 px with keyline and glow; shot 11 halo + 3 m clear zone + tee `#ffc21a`; `park-casual` out of the crowd mix (VD03). A06 widened, A16–A17 added, H6 (caption band re-measure at W5) and H7. **No shot length, key frame, word peg or sound-cue frame changed**; total 1561 f. Film reviewed R2.1a's S19 tag (f1516, after the last word, inside the hold): accepted. |
| EDU-EP17-ROWS-R2.1 | 2026-11-11 | Film | Retime for the user's V01/V02 picks (take A strained both, Gemini Algenib). V01 voice 1.42 s of a 1.79 s file = 43 f against an 18 f slot: shot 5 30 → 55 f and every frame ≥ f279 +25 f (segments B–G offsets +25 f: 52 / 64 / 142 / 151 / 160 / 169 f; shot ranges 5–22, cue voice ranges, word pegs, text ranges, acceptance frames, H2). V02 0.21 s = 7 f fits its 12 f slot, no shift. **1561 f = 52.03 s** (hard limit 63 s: pass). Added A15. Ton's sound-cues.json frames retimed by Film to match (frames only). Shot IDs, lines, cameras, staging, sound design and shot-local key frames unchanged except shot 5's end keys; review-rows.json stays R1.0. |
| EDU-EP17-ROWS-R2.1a | 2026-11-11 | coordinator for Film | User asked for the EP14 closing string sound: shot 22 gains cue S19 (`stinger_pizz-tag-ending_01`, f1516, 45 f, fade to f1561). No frame range changes. | Film reviews in the next pass |
| EDU-EP17-ROWS-R2.0 | 2026-11-11 | Film | W4.3 timing on the W4.2 read (Kore warm x1.08, 44.82 s, approved by ear): seven narration segments (offsets 0 / 0.90 / 1.30 / 3.90 / 4.20 / 4.50 / 4.80 s), every shot range, cue, text range, word peg, sound cue and shot-local key frame pegged; **1536 f = 51.20 s** (R1.0 est 1662 f). Line edges re-measured (silencedetect + whisper): L09 end 25.65 / L10 onset 25.72 corrected from measure.json (26.64 / 26.87), L02/L04/L05/L15 small corrections. Q-F1 = (a) applied (R08, A14). Shot 10 → 11 crouch continuity fix (H1). Shot 4 square tag on "ครึ่งเมตร". V01/V02 placeholders. Shot IDs, lines, cameras, staging intent and sound design unchanged; review-rows.json stays R1.0. |
| EDU-EP17-ROWS-R1.0 | 2026-11-10 | Film | First storyboard pass (W2.2) from brief R1: 22 shots, estimated 1662 f = 55.4 s; projections of the street and instrument shots computed; review-rows.json written untimed. |
