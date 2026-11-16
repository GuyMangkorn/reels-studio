# Timed scene sheets and index — EDU-EP18-SHORT (EDU-EP18-SHEETS-R1.0)

- **Deliverable:** `EDU-EP18-SHORT` (channel **edu**) · **Revision:** EDU-EP18-SHEETS-R1.0 (Film W4 timed pass, 2026-11-16) · **Status:** `ready-for-dev`, voice-timed to the locked narration v1. · **Timing:** `checked-with-audio` on paper: line onsets/ends and the read's pauses are `meas` from [narration-measure.json](narration-measure.json) (silencedetect, Editor; the confidence notes there carry over: the L03 "…" cut is weak, L07|L08, L10|L11, L11|L12, L13|L14 are medium); word anchors inside a line are `est` (syllable position inside the measured phrase, ±4 f) unless they sit on a measured gap. GIRL V01–V05 voiced lengths from the approved Leda takes (0.76 / 0.41 / 0.93 / 1.30 / 0.24 s).
- **Evidence:** runtime: none · render/samples: none at this timing · projection: every world-space shot's start/end camera run through `scripts/shot-projection.py` by [projection-run.py](projection-run.py) (log `out/logs/edu18-w4-projection.log`, JSON per state `out/edu18/w4-projection/`) · caption band on the look-frame cameras: `scripts/caption-zone.py --band 1176:1344 --x 120:960` on the approved clean look frames (log `out/logs/edu18-w4-caption-zone.log`) · audio/subtitle sync: none (Film cannot listen; placement on paper) · user approval: script R2 (2026-11-15), storyboard 24/24 (ROWS-R1.0, 2026-11-15), look lock LF01–LF04 incl. LF02B, LF03L, LF03B (2026-11-16), narration v1 Kore x1.05 locked (2026-11-16), GIRL Leda V01–V05 (2026-11-16). This sheet revision is not user-approved.
- **Inputs (by revision):** script **EDU-EP18-SCRIPT-R2** ([script.md](script.md)); fact-check [fact-check.md](fact-check.md) R1 + R2 recheck; brief **EDU-EP18-BRIEF-R1** with its W3 amendments ([film-brief.md](film-brief.md): VD01–VD14, N1–N14, [projection contract](film-brief.md#projection-contract-and-scale-baseline), [sound direction](film-brief.md#sound-direction), [caption-zone rule](film-brief.md#caption-zone-rule), set plans); look cameras `src/painted/edu18/looks-cams.ts` (W3, unchanged here); measure file [narration-measure.json](narration-measure.json) (W4 step 2; locked file `public/narration/EDU-EP18-SHORT-narration-v1.wav`, store `projects/edu/EDU/audio/2026-11-16_ep18-w4-nar-fullread/ep18_nar_kore_x1.05.wav`); GIRL takes `out/ep18/voice/girl/v0{1..5}_*.wav` (store `projects/edu/EDU/samples/2026-11-16_ep18-w4-girl-sample/`).
- **Target:** this worktree, branch `claude/edu-ep-18-continue-38a53a` at `6ad88fb` + uncommitted EP18 files · 30 fps · `durationFrames` **1872** (62.40 s) · 1080×1920 · composition `EDU-EP18-SHORT` (registered by the Editor, never in `src/Root.tsx`) · ending closed: 60 f hold, `A_fade`, no loop seam.
- **Review rows:** [review-rows.json](review-rows.json) **EDU-EP18-ROWS-R2.0** (timed, `start`/`end` in G frames). Review page: pending.

## Units and conventions

- **Spaces, origins, axes, sizes:** the brief's [projection contract](film-brief.md#projection-contract-and-scale-baseline) and set plans (`R` river, `V` gate, `F` rice path, `N` bedroom, `S` stadium, `M` macro in mm, `P` phone screen logical 1170×2532). Built values win over the brief's est values: the W3 changes in the brief change log (canoe heading 170 and H1 (1.6, 0, −2.6) facing 240 in B01-SH01; hens, eave shadow, sun x negated in V; snake centre x −0.08 in F; table (−1.35, 0, −1.5) and fan (1.2, 0, −1.5) in N) and `stadium.ts` `BOWL`.
- **Camera lines** use the W3 form `cam(at, az, r, eye, f, hy[, pitch])` = `cam` in `src/painted/edu18/looks-cams.ts` (kit `orbitYCam`): the camera stands at at + r·(sin az, 0, cos az) at absolute height `eye`, kit yaw = −az, level, then tilted by `pitch` (deg, + looks up). az 0 puts the camera on +z looking −z. Picture x = 540 + f·right/depth, y = hy − f·up/depth. Boss types these numbers into `cam` unchanged. Moves blend start → end with kit `mixYCam` over the stated L range, `easeInOutSine` unless written.
- **Clocks:** `G` = composition frame; shot-local `L` = G − shot start; ranges half-open `[start, end)`. Every event is a pure function of G or L (seek-safe); ambient clocks (mist, glints, ripples, rice sway, fan oscillation, hens, crowd shimmer, wing blur) run on G through holds ([DF-20261030-painted-story-hold-ambient-clock](../../../../docs/dev-findings.md#df-20261030-painted-story-hold-ambient-clock)).
- **One shot = one timeline scene** (scene ID = shot ID with the `S01-`/`S02-`/`S03-` prefix of the rows). Every cut is hard; the only other transition is the 3 f white selfie flash inside B02-SH01 (brief, Motion / clock).
- **Frame zones** (brief): caption band y 1176–1344 (stroke-only edu captions, calm by staging); faces, the hippo's mouth and eyes, hand-and-nose contact, the snake, the mosquito dot, the phone screen and the 500 above y 1160; `@TamMaiLa` top-left (x < 330, y < 140 clear of painted detail).
- **Figure anchors used by the run** (from the W3 look-frame measures, which the run reproduces within 15 px): standing GIRL top 1.64 m, chin 1.20 m above the feet; seated in the canoe head top y 1.04, chin 0.64 (water y 0, gunwale 0.25); seated in bed head top hips + 1.06, chin hips + 0.61. **Lead size:** GIRL ≥ 480 px when visible; recorded exceptions are named in the shot blocks (seated in the canoe: visible height above the gunwale < 480, full seated figure ≥ 480 as LF01; walk-in starts; the two crane ends).

## Casting, props and hands

Casting per brief VD02 (unchanged): `woman-long + travel-safari (+ life-vest in B01)`, `+ backpack` at the gate, path without the backpack, `home-lounge-night` in bed; poses `paddle-sit`, `selfie-peace`, P10, `swat-neck`, P07, `frozen-hand`, `step-freeze`, P37, `sit-up-phone`; `dog-thai` via `drawDog18`; hippo via `HippoInSet` (hippo3d v8); kit snake and mosquito; hens `hen-brown` / `hen-buff`.

| Prop | State and owner hand, by G | Possible? |
| --- | --- | --- |
| Paddle | Both mitten hands on the shaft (grip anchors, `paddleSitArms`) G0–297 (B01). Idle G0–8, stopped G8–112, dipping G112–127, hard strokes B01-SH02, held across her lap B01-SH03–SH04, calm strokes B01-SH05 | yes |
| Phone | Right hand from B02-SH01 (selfie, arm out) to B02-SH03 (scrolling at chest); in the pouch at the gate (G508–858; both hands free for the wave and the frozen hand); in the right hand at her side on the path (G858–1077); face-down on the bedside table (B05); taken by the right hand at B06-SH01 L28, both hands at the chest from L44, lowered over her knees in B06-SH05 | yes; the left hand is free for the V sign (B02-SH01) and the neck swat (B02-SH03) |
| Backpack | On both shoulders G508–858 | yes; the wave and the frozen hand are the right hand |
| Blanket | Over her to the shoulder B05-SH01, pulled to her nose with both hands B05-SH02, over her knees B06 | yes |
| Lamp switch | Right hand reaches up and back to the shade B06-SH01 L0–4 (she lies with her head toward the −x table) | yes |

## Narration placement (Editor)

The locked narration is **one continuous read** (56.626 s; no pause surgery). The Editor splits it at five line-boundary gaps (cut at each gap's centre) and places six segments; every added gap is filled with crossfaded room tone from that gap (the EP17 [narration-place.py](../../ep17/narration-place.py) method), never digital silence. Placement: **G = 30·t_file + c**. The head before the file starts and the tail after it are room tone from the file's own head and tail. The read's own pauses inside a segment are unchanged.

| Segment | Lines | File in → out (s) | c (f) | Added before it (f) | First onset G | Last end G |
| --- | --- | --- | --- | --- | --- | --- |
| A | L01, L02 | 0.000 → 5.2325 | +33 | 33 (head) | 38.7 (L01) | 183.3 (L02) |
| B | L03, L04, L05, L06 | 5.2325 → 18.5155 | +53 | 20 (charge + V02) | 216.7 (L03) | 601.5 (L06) |
| C | L07, L08, L09 | 18.5155 → 27.130 | +57 | 4 (the freeze) | 619.5 (L07) | 862.2 (L09) |
| D | L10, L11, L12 | 27.130 → 35.966 | +81 | 24 (V03) | 903.6 (L10) | 1153.0 (L12) |
| E | L13, L14, L15 | 35.966 → 46.307 | +117 | 36 (V04) | 1203.0 (L13) | 1498.9 (L15) |
| F | L16, L17, L18 | 46.307 → 56.626 | +126 | 9 (V05) | 1522.6 (L16) | 1811.9 (L18) |

Tail: file ends at G1824.8; room tone to G1872 under the hold.

| Take | File (`out/ep18/voice/girl/`) | Voiced length | Voiced span G | Gap before / after (f) | Treatment |
| --- | --- | --- | --- | --- | --- |
| V01 gasp | `v01_gasp.wav` | 0.76 s (23 f) | 10–33 | — / 5.7 to L01 | voiced onset on G10 (−35 dB onset in file ≈ 0.36 s: file start ≈ G−0.8); right after the yawn bellow's attack |
| V02 "เฮ้ย!" | `v02_hey.wav` | 0.41 s (12 f) | 197–209 | 13.7 after L02 / 7.7 to L03 | in the halt silence (onset in file ≈ 0.23 s) |
| V03 in-breath | `v03_inbreath.wav` | 0.93 s (28 f) | 867–895 | 4.8 after L09 / 8.6 to L10 | music cut at G866; in the clear |
| V04 whimper | `v04_whimper.wav` | 1.30 s (39 f) | 1158–1197 | 5.0 after L12 / 6.0 to L13 | S10 buzz under it, NAR clear |
| V05 "เอ๊ะ…" | `v05_eh.wav` | 0.24 s (7 f) | 1508–1515 | 9.1 after L15 / 7.6 to L16 | near-silence |

**Line table (G, `meas`):** L01 38.7–122.7 (… pause none inside) · L02 132.7–183.3 · L03 216.7–291.1, "…" 238.9–242.5 (weak) · L04 302.5–384.2 · L05 393.3–501.4, gap after "ลองเอาไปเทียบดู" 416.9–431.2, "…" 458.8–468.9 · L06 519.8–601.5, "…" 556.6–564.1 · L07 619.5–749.2 · L08 760.2–807.1 · L09 820.3–862.2 · L10 903.6–981.8 · L11 993.5–1069.1 · L12 1082.4–1152.8 (narration v2, script R2.1; v1 1084.3–1153.0), "…" 1121.9–1125.5 (v1 1103.0–1110.8) · L13 1203.0–1278.3 · L14 1289.4–1376.0 · L15 1393.6–1498.9, "…" 1427.5–1437.9 · L16 1522.6–1584.5, "…" 1553.1–1564.0 · L17 1603.4–1654.4 · L18 1661.1–1811.9, "…" 1724.9–1736.8.

**Word anchors (G, `est` ±4 f):** "สามอันดับแรกนะ" 158 · "ปีละห้าร้อยคน" 353 · "อย่าดูที่ความดุ" 431 (meas, gap end) · "ดูที่ตัวเลข" 469 (meas) · "อยู่ใกล้ตัว" 564 (meas) · "สี่หมื่น" 715 · "ที่หนึ่งนะ" 846 · "ห้าล้าน" 960 · "แสน" 1041 · "ไม่ต้องกัดใคร" 1111 (meas) · "นั้นอีก" ≈1141 (v1 "เจ็บเลย") · "มาลาเรีย" 1302 · "หลายแสน" 1345 · "แต่ยังเหลือ" 1438 (meas) · "ตัวเลขเดียว" 1453 · "ใครเป็นคนนับ" 1564 (meas) · "ขึ้นชื่อด้วยตัวเลข" 1737 (meas) · "ชี้ที่มาได้ชัด" 1785.

## Total runtime

| Part | Frames | Notes |
| --- | --- | --- |
| Head before L01 | 38.7 | 33 f room tone + the file's own 0.189 s lead; frame 0 bulge, surfacing, yawn, V01 |
| Narration span L01 onset → L18 end | 1773.2 | the read (1680.3 f) + 93 f of added gaps (charge 20, freeze 4, V03 24, V04 36, V05 9) |
| Hold after L18 | 60.1 | END1 + `A_fade` (series ending) |
| **Total** | **1872** | **62.40 s**; cap 63 s = 1890 f → **margin 18 f (0.60 s)**; 2.4 s over the 50–60 s target (the script's own projection was 56.5–62 s) |

Fit without a trim: three wordless beats overlap the end of the line before them instead of following it (SD13–SD16). If the Editor's placement grows past 1890 f, the trim is **T2 in B02-SH03**: cut "ลองเอาไปเทียบดู" (G393.3–416.9 plus the 14 f gap after it, ≈ 30 f), keeping the rule "อย่าดูที่ความดุ… ดูที่ตัวเลข" whole (Film does not take it here; user decision, Q7).

## Staging deviations (Film decisions from the projection run)

Every number below is already written into its shot block; the reasons live here.

| ID | Shot | Change | Reason |
| --- | --- | --- | --- |
| SD01 | B01-SH02 | camera az 25→35, r 3.2, f 1150 → az 72→78, r 3.0, eye 0.95, f 1700, hy 760; head turned back over her **right** (camera-side) shoulder | at the brief's camera the swimming hippo projected at x −290 → −90 (out of frame) and she measured 323 px; now the hippo sits behind her at x 167→314, her face reads in profile |
| SD02 | B01-SH03 | camera `at (6, 0.8, 0) yaw 90 r 7.5→6.8 f 1000` → `cam((7.5, 0.55, −0.25), 82, 9.6→9.1, 1.2, 2100, 740)`; hippo start x −8 → −2 | the brief's camera stood inside the hull (x 13.5 vs bow 14.75) with the hippo hidden behind her on the lens axis; the longer lens from ahead-right puts her right and the charge centre-left; a 32 f charge from x −2 runs at about 7 m/s (from −8 it would be 16 m/s) |
| SD03 | B02-SH01, SH03 | H4 (57.5, 0, 6.0) → (56.3, 0, 6.0) | in the selfie the eyes landed behind her shoulder; now beside it (x 180→277) |
| SD04 | B02-SH03 | camera az −35→−25 (brief) → az 20 → end on the phone `cam((60.05, 1.35, 14.81), 12, 0.9, 1.55, 1000, 700, −8)` | at az −35 the hippo was out of frame left (x −268); now it sits behind her (x 523→363) for the small yawn, and the push ends on the phone |
| SD05 | B02-SH02, B06-SH02 | FPOV framing written as a screen quad: 1700 → 1780 px tall, bottom edge 1176 → 1150, top cropped | the brief's "dolly z 0.55→0.45" gives a 270 px phone; the caption must be ≥ 40 px text and above y 1160 |
| SD06 | B03-SH02 | f 1000 → 1100, r 3.2→2.4 → 2.85→2.4 | lead 405 → 483 px at the start |
| SD07 | B04-SH03 | eye 0.42 level → eye 0.62, pitch −10, hy 760, at (0.35, 0.45, −0.2) | at eye 0.42 her raised sandal drew level with the lifted snake head; from just above, the sandal reads above-left of the head (y 687–700 vs 804–840) |
| SD08 | B04-SH04, B01-SH05 | pitches and hy added (B04-SH04 −6 → −26, hy 760 → 640; B01-SH05 −12 → −22, hy 700) | level cameras at eye 9 put the subject below the frame |
| SD09 | B05-SH03 | arc az −20 → +20, r 22 → 26 mm (L13), pull back 26 → 1100 mm (L14, log) | at the brief's 400 mm end the 6 mm body is 16 px; 1100 mm gives the 6 px dot of B02 |
| SD10 | B06-SH04 | at (−0.55, 1.22, −1.30), eye 1.30, hy 740 | the brief's head point predates the W3 seated measure (head top 1.51); chin now at 1016–1047 |
| SD11 | B06-SH05 | phone held at belly height over her knees (−0.45, 0.81, −0.96), screen tilted 50° up, not flat on the lap; camera `cam((−0.5, 1.0, −1.15), −6→−3, 0.95→0.90, 1.25, 1100, 640, −14)`; the screen keeps the B06-SH03 zoom ("500 คน/ปี" across ≥ 80 % of the screen width) | on the lap the phone fell in the caption band (y 1235–1359) about 950 px below her face, and a full post at 84 px wide cannot show a legible 500; zoomed, the 500 glyphs are about 28–30 px |
| SD12 | B06-SH03 | the share counter leaves the frame during the push (by L10) | at the end scale (≈ 2.3 px per logical unit) the counter (logical x ≥ 600) projects beyond x 1300; CL04 is carried by B06-SH02 |
| SD13 | B03-SH01/SH02 | L06 split at its "…": the dog trots in on "อยู่ใกล้ตัวกว่านั้นเยอะ" | length (the dog beat after L06 cost 32 f); the cut lands the dog on "close to you" |
| SD14 | B01-SH03 | the charge starts 20 f before L02 ends (on "อันดับแรกนะ"); S5 halt lands 2 f after L02 | length; the irony of "not even top three" over the charge |
| SD15 | B04-SH01/SH02 | the path shot opens mid-stride 4 f before L09 ends; the freeze is at L8 | length; B04-SH01 keeps 43 f for lick, wag and exit |
| SD16 | B05-SH01/SH02 | the close on her face starts 12 f before L12 ends ("นั้นอีก", R2.1; was "เจ็บเลย"); the buzz enters with the cut | length; the buzz arrives as the narrator says "kills even more than that" |
| SD17 | B01-SH01 | yawn front-loaded: head breaks L1, jaws open L2–14 (bellow attack L2), V01 at L10 | V01 "just after the bellow" (script) and a 5.7 f clear gap to L01 inside the 33 f head |

## Sound plan (whole video; per-shot cues in the shot blocks)

Cue designs are the brief's [sound direction](film-brief.md#sound-direction) (A1–A6, M1–M6, S1–S21, END1); this sheet adds frames and one new cue. Ton makes every NEEDS-GEN item and checks every library ID by ear; Editor places exactly the frames below (±3 f into syllable gaps).

- **New cue S22** NEEDS-GEN dog lick: one quick wet tongue lap on the back of a hand, small and friendly / one lick / tongue, skin / outdoors, close, dry / 0.3 s / "ew… okay, friend". B04-SH01 L3 (G818).
- **Music map (G):** M1 in at 39 (L01, energy 2.5) → out at the halt 185 → back under L03 at 217 → brighter (3) from 297 → out at 508; M2 in at 508 → ducks out at the freeze 580 → back on L07 620 → low under the stadium → out at the stopped step 866; M3 in low on L10 904 → through 1077; M4 1077 → cut dead on the buzz 1141; no music 1141–1391 (S10 only in the macro); M5 faint 1391 → 1661; M6 swell 1661, peak on "ชี้ที่มาได้ชัด" 1785; END1 at 1812 (first frame of the hold), rings into `A_fade`; A6 room tone fades to silence on 1871.
- **Ambience map (G):** A1 0–297 (−8 dB in gaps, −14 under NAR; near-silence 185–216) · A2 297–508 · A3 508–755 and 815–858 (motorbike pass 512–548) · A5 755–815 · A4 858–1077 · A6 + `nature_night-crickets_01` (−18 dB) 1077–1203 and 1381–1872 (fades to silence by 1871) · macro 1203–1381: no ambience.

## Caption plan

Subtitles are the VO verbatim (stroke-only edu captions, band 1176–1344, caption-safe x 120–888). One cue per line, split at a "…" pause where the line has one; display from the onset to the end + 6 f, clipped to 2 f before the next onset. Numbers, if shown as digits, match the spoken magnitude (VD12): L07 "ราว ๆ 40,000", L10 "ราว ๆ 5,000,000", L11 "ราว ๆ 100,000", L14 "หลายแสน"; L04 and L16 keep "ห้าร้อย" as spoken or "500" (the only drawn 500 is the post's). GIRL takes V02 "เฮ้ย!" and V05 "เอ๊ะ…" are captioned in their voiced spans (+6 f); V01, V03, V04 are not captioned (sounds). No caption during the hold.

## Shot map

| Shot | Beat | G [start, end) (len) | Voice | Claims / clues | Look |
| --- | --- | --- | --- | --- | --- |
| B01-SH01 | E18-C01-S01-B01 | 0–127 (127) | V01, L01 | meme stated (OQ1) | LF01 (end) |
| B01-SH02 | B01 | 127–163 (36) | L02 | "not top three" | LF01 set |
| B01-SH03 | B01 | 163–195 (32) | L02 tail | objection raised (charge) | LF01 set |
| B01-SH04 | B01 | 195–241 (46) | V02, L03a | — | LF01 set |
| B01-SH05 | B01 | 241–297 (56) | L03b | answer: fierce ≠ many | LF01 set |
| B02-SH01 | E18-C01-S01-B02 | 297–333 (36) | L04 start | CL01 photo | LF01 family |
| B02-SH02 | B02 | 333–389 (56) | L04 | **CL01** caption 500 (the only drawn number), **CL04** counter 0 → 1.2K | — |
| B02-SH03 | B02 | 389–508 (119) | L05 | **CL03** dot + buzz; **CL02** rule | LF01 family |
| B03-SH01 | E18-C01-S02-B03 | 508–560 (52) | L06a | — | LF02 (end) |
| B03-SH02 | B03 | 560–614 (54) | L06b | "closer to home" | LF02 set |
| B03-SH03 | B03 | 614–755 (141) | L07 | F022 "ราว ๆ" 40,000 (subtitle only) | LF02 set |
| B03-SH04 | B03 | 755–815 (60) | L08 | size picture, order of magnitude | LF04 (end) |
| B04-SH01 | E18-C01-S02-B04 | 815–858 (43) | L09 | OQ4 opened | LF02 set |
| B04-SH02 | B04 | 858–899 (41) | V03 | — | LF02B (end) |
| B04-SH03 | B04 | 899–987 (88) | L10 | 5 M bitten (subtitle only) | LF02B set |
| B04-SH04 | B04 | 987–1077 (90) | L11 | ~100,000 (subtitle only) | LF02B set |
| B05-SH01 | E18-C01-S03-B05 | 1077–1141 (64) | L12 | OQ5 opened | LF03 (end) |
| B05-SH02 | B05 | 1141–1203 (62) | L12 tail, V04 | CL03 paid (same dot, same buzz) | LF03 set |
| B05-SH03 | B05 | 1203–1381 (178) | L13, L14 | placeless range = L13 first frame → L14 end | LF03B |
| B06-SH01 | E18-C01-S03-B06 | 1381–1432 (51) | L15a | — | LF03L (end) |
| B06-SH02 | B06 | 1432–1501 (69) | L15b | CL01 again, CL04 58K rising | — |
| B06-SH03 | B06 | 1501–1587 (86) | V05, L16 | twist question; the 500 with nothing added | — |
| B06-SH04 | B06 | 1587–1658 (71) | beat, L17 | "nobody can clearly trace" (M1 wording) | LF03L set |
| B06-SH05 | B06 | 1658–1872 (214) | L18, hold | flip landed; closed ending | LF03L set |

Screen layers: PHONE-SVG post locked to the painted phone quad (B02-SH01 hand-held phone back only; B02-SH02, B02-SH03 small; B06-SH01 from L44, SH02, SH03, SH04 glow only, SH05); captions; `@TamMaiLa` every frame. Truth limits 1–7 of the brief bind every shot.

---

## Shot sheets

Picture intent is each row's `seen` text in [review-rows.json](review-rows.json) plus its look frame; the blocks add numbers. "Run" values are the projection run (px at 1080×1920).

### B01-SH01 · 0–127 · the yawn beside the canoe (V01, L01)

- **Time:** bulge L0; head breaks L1; jaws open L2–14 (peak gape 140°, top jaw tip y 1.4) and hold L14–96 (±3° breathing); V01 G10–33; L01 G38.7–122.7; jaws ease to a lazy half-close L96–118; her `smug` grin L100–127, paddle dips L112.
- **Staging (R):** canoe heading 170 at (0, 0, 0), drifting +x 0.05 m/s; GIRL seated at the centre, `paddle-sit`, squared to the lens; `gasp-recoil` L10–18, `surprised` L10–96. Hippo H1 head centre (1.6, 0, −2.6) facing 240 (body origin 1.2 m behind, `hippoOrigin`), SURFACE then YAWN; water bulge ring r 0.6 m at L0 with bubbles, ripples outward from L1. Hippo never closer than 2.1 m to the stern.
- **Camera (R):** start `cam((0.6, 0.7, −1.3), −18, 6.6, 1.0, 2100, 700)` → end LF01 `cam((0.6, 0.7, −1.3), −12, 6.0, 1.0, 2100, 700)` over L0–96; then r −0.5 % drift to L127. Run: start her head top (471, 684), chin 846, gunwale 1004, hippo jaw tip (682, 597), waterline 958; end head (396, 682), chin 864, jaw tip (739, 588). Lead: visible above the gunwale 320 → 360 px, seated figure 552 (LF01 exception).
- **Sound:** A1 from L0 (no hippo honk: S1 is the hippo here); **S1** water bulge L0 (G0), the gush on L1; **S2** yawn bellow attack L2 (G2), loud part to L10, rumbling tail ducked under L01; V01 at G10; M1 enters at energy 2.5 on G39. Mix: hit (S1/S2) → V01 → hold.
- **Cut:** hard at L127 (G127), 5.7 f before L02.
- **Entry → exit:** frame 0 water bulging beside her, no text → yawn half-closing, her grin, paddle dipping.
- **Accept:** frame 0 shows the bulge and the canoe with no caption; the gape peaks by L14; the jaw tip stays above her head top (y < 684); no part of the hippo touches the canoe; her chin above 1160 throughout.

### B01-SH02 · 127–163 · paddling off, grinning back (L02)

- **Time:** L02 G132.7 (L5.7) → continues over the cut; strokes L2, L11, L20, L29.
- **Staging (R):** canoe centre (10.2, 0, 0) → (11.4, 0, 0), heading 90 (1.0 m/s); GIRL paddling hard, torso to +x, head turned back over her right shoulder (camera side), `smug`. Hippo SWIM low (eyes, ears, back) 11.6 m behind her at z −0.5, keeping pace.
- **Camera (R):** follows the canoe: `cam(canoe + (0, 0.7, 0), 72 → 78, 3.0, 0.95, 1700, 760)` over L0–36. Run: her head top (540, 709), chin 936, gunwale 1157; hippo eyes (167 → 314, 843). Lead: visible 448, seated figure ≈ 690.
- **Sound:** A1; **S3** paddle strokes at L2, L11, L20, L29 (G129, 138, 147, 156): quick splashy wooden strokes, drips between; M1 2.5.
- **Cut:** hard at L36 on "อันดับแรกนะ" (G163, est 158 + 5).
- **Entry → exit:** grin, paddling → still paddling, hippo closer behind.
- **Accept:** the hippo is in frame behind her through the shot; her face reads in profile; gunwale above 1160.

### B01-SH03 · 163–195 · the charge (L02 tail)

- **Time:** charge L0–22, halt L22–30, still L30–32; L02 ends G183.3 (L20.3).
- **Staging (R):** hippo snout from x −2.0 (head and back out, bow wave 0.4 m) along +x at z −0.5, `easeInCubic` to L4 then ≈ 7 m/s, halt with an 8 f deceleration to snout x 3.75 (5.5 m from the stern at 9.25), surge wave to the canoe L30 → (rock ±3°, heave 0.05 m carries into SH04). Canoe centre (12.0, 0, 0) heading 90, drifting 0.2 m/s. GIRL faces the lens, head turned back to the hippo, `shock` building.
- **Camera (R):** `cam((7.5, 0.55, −0.25), 82, 9.6 → 9.1, 1.2, 2100, 740)` over L0–32 `easeOutCubic`. Run: start her head (696, 806), chin 970; hippo start (421, 817), halt (497, 852), halt waterline 929, wave crest at the halt y 789, stern (539, 995). Lead: visible 324 → 360, seated figure ≈ 500 (exception, as LF01).
- **Sound:** **S4** riser + surge from L0 (G163, 1.5 s); **S5** hard stop at L22 (G185): one heavy slap and spray, one wet snort, then near-silence; M1 out at G185.
- **Cut:** hard at L32 (G195).
- **Entry → exit:** hippo charging at the far left of her → halted a canoe-length short, wave arriving.
- **Accept:** the hippo grows toward the lens and stops with a visible gap of water to the stern; no contact; the halt slap lands after L02's last syllable.

### B01-SH04 · 195–241 · "เฮ้ย!" (V02, L03a)

- **Time:** V02 G197–209 (L2–14); breath out L16–30; L03 G216.7 (L21.7) "ดุจริงแหละ…" to G238.9; cut in the "…" (weak gap, Editor confirms ±3 f by ear).
- **Staging (R):** close on her: `front`, `shock` L0–16, `relieved` + nervous half-laugh face L30–46 (no sound); canoe roll decays ±3° → 0 over L0–30.
- **Camera (R):** `cam((12.0, 0.84, 0), 90 → 98, 1.3 → 1.15, 0.95, 1100, 820)` L0–46. Run: head top 744 → 734, chin 1082 → 1117 (head 338 → 383 px).
- **Sound:** near-silence (A1 −20 dB) L0–22, V02 alone; M1 back under L03 at G217 (L22).
- **Cut:** hard at G241 (L46).
- **Accept:** chin above 1160; V02 sits alone with no music under it.

### B01-SH05 · 241–297 · the hippo settles, she slips away (L03b)

- **Time:** L03b G242.5–291.1; snort L30.
- **Staging (R):** canoe centre (13.5, 0, 0) → (14.3, 0, 0), calm strokes; hippo H3 (4, 0, −0.8) LURK (eyes, ears, nostrils), SNORT spray at L30; the sun breaks through the mist L20–56 (mist glaze 0.35 → 0.20).
- **Camera (R):** crane `cam((12, 0, −2), 30 → 40, 14 → 20, 4 → 9, 900, 700, −12 → −22)` L0–56. Run: canoe x 400–765 → 445–639 at y 738–831; hippo (150, 705) → (299, 665). Lead 57 → 33 px (hook-wide exception).
- **Sound:** A1; **S6** snort at L30 (G271): lazy wet blast through the nostrils, spray pattering; M1 2.5.
- **Cut:** hard at G297 (L03|L04 gap).
- **Accept:** canoe and hippo both in frame, far apart; the band sits on water.

### B02-SH01 · 297–333 · the selfie (L04 start)

- **Time:** L04 G302.5 (L5.5); shutter L30; white flash L30–33.
- **Staging (R bank):** GIRL at B0 (60, 0.30, 14.5) facing +z (the lens = her phone), `selfie-peace` (right arm out holding the phone, left hand V by the cheek), big grin (`happy`); hippo H4 (56.3, 0, 6.0) eyes and ears above the water behind her right shoulder. The frame at L29 is rendered once as the post photo (`scripts/stills.mjs`, brief Loading).
- **Camera (R):** `cam((60, 1.55, 14.5), 0 → 6, 0.75 → 0.70, 1.55, 900, 900)` L0–30. Run: head top 432 → 399, chin 960 → 964; hippo eyes (180 → 277, 1025).
- **Sound:** A2 from L0; M1 brighter (3); **S7** shutter at L30 (G327) with the flash.
- **Cut:** after the 3 f white flash, hard at G333.
- **Accept:** the hippo's eyes read beside her shoulder, not behind it; chin above 1160.

### B02-SH02 · 333–389 · the post (L04)

- **Time:** thumb tap L4; card up L4–10; counter steps L14–54; L04 runs on, "ปีละห้าร้อยคน" G353 `est` (L20).
- **Staging (P on the painted phone):** FPOV down at the phone in her right hand, bank sand soft below. Screen quad 1700 → 1780 px tall, centred x 540, bottom edge 1176 → 1150 (anchored on the caption line), top cropped; at 1700 px: counter y ≈ 648, caption line 1 ≈ 812 (43 px text), "500 คน/ปี" ≈ 866 (58 px). Thumb taps the send icon in the bottom bar at L4; the card (her selfie, handle "เที่ยวคนเดียว", caption verbatim, "แชร์ 0") slides up L4–10; counter `SHARE_STEPS_B02` 0 → 1.2K over L14–54.
- **Camera (P):** painted phone at 0.074 → 0.071 m from the lens, f 900, near 0.05 (picture-stage push not used; the quad comes from the painted phone).
- **Sound:** **S8** send whoop L6 (G339); **S9** one tick per counter step (7 ticks L14–54, pitch stepping up); A2 low; M1 3.
- **Cut:** hard at G389 (L04|L05 gap).
- **Accept:** caption readable from L10 to L56 (46 f ≥ 45); the 500 above 1160; no other number on screen than the 500 and the counter.

### B02-SH03 · 389–508 · scrolling; the rule (L05)

- **Time:** L05 G393.3–501.4; "อย่าดูที่ความดุ…" G431.2–458.8 (L42–70); "ดูที่ตัวเลข" G468.9–501.4 (L80–112).
- **Staging (R bank):** GIRL at B0 `front`, head down scrolling (right thumb), `smug`; the dot (mosquito card at room scale, 5 px + 2 px trail) drifts past her left ear L2–28 from x 600 to 820 at y ≈ 520–540; `swat-neck` (left hand) L22–30 without looking up; hippo H4 behind: small yawn L42–70 (head to y 0.6), sinks L70–90.
- **Camera (R):** start `cam((59.6, 1.2, 14.5), 20, 2.4, 1.5, 1000, 600)` → key L80 at 25 % of the move → end on the phone `cam((60.05, 1.35, 14.81), 12, 0.9, 1.55, 1000, 700, −8)` at L112, hold to L119. Run: start lead 724 (top 406, chin 600, feet 1130), hippo (523, 709), phone (701, 641–712); end phone (538–542, 705–850), hippo (363, 686), chin 601.
- **Sound:** **S10** `creature_mosquito-whine-close_01` quiet, panned left → right L0–30 (G389–419); **S11** `action_slap-forearm_01` at L26 (G415), light; **S12** `stinger_low-muted-hit_01` at L80 (G469) on "ดูที่ตัวเลข"; A2; M1 3.
- **Cut:** hard at G508 (6.6 f after L05).
- **Accept:** the dot is never centred or pointed at; the push lands on the phone during "ดูที่ตัวเลข"; the hippo yawn plays on "ความดุ"; phone and faces above 1160.

### B03-SH01 · 508–560 · home at grandma's gate (L06a)

- **Time:** L06 G519.8; "…" G556.6–564.1 (the cut).
- **Staging (V):** GIRL with backpack walks in from screen left along the lane at z 1.3: (1.9, 0, 1.3) → (0.4, 0, 1.1) L0–22 (`walk-in-from-left`, profile), turns to the lens L18–28, steps in to G0 (0.3, 0, 0.4) L24–36, stops `happy`, waves the right hand to the house (P07) L36–52. Hens peck (W3 marks); motorbike passes far on the lane (z 4.5) L4–40.
- **Camera (V):** `cam((0.3, 1.0, 0), 200, 6.6, 1.4, 1900, 690)` → LF02 `cam((0.3, 1.0, 0), 192, 6.0, 1.4, 1900, 690)` L0–40, drift to L52. Run: start lead 372 (feet 1008), end lead 487 (top 619, chin 749, feet 1106) between the posts (212, 1100). Lead < 480 L0–30 (walk-in exception).
- **Sound:** A3 from L0; motorbike `vehicle_motorbike-pass-doppler_01` L4 (G512); **S13** sandal steps on laterite L4, L12, L20, L28 (4 then stop); M2 enters at G508.
- **Cut:** hard at L52 (G560) in the L06 "…".
- **Accept:** her feet above 1160 from L30; the band on the yard earth (LF02 band mean 0.671).

### B03-SH02 · 560–614 · the dog trots up (L06b)

- **Time:** "อยู่ใกล้ตัวกว่านั้นเยอะ" G564.1–601.5 (L4–41); freeze L20 (G580); dog stops L36.
- **Staging (V):** `dog-thai` (`drawDog18`, `walk-in`, back three-quarter) trots from (0.15, 0, −2.6) (enters at frame bottom-left) to D1 (0.35, 0, −0.5) L0–36 (≈ 1.75 m/s, slowing L30–36), stops facing +z, nose 0.10 m short of her right hand H (0.45, 0.60, −0.05) by L44; GIRL at G0 finishes the wave L0–8, sees the dog L8, freezes L20 in `frozen-hand` (right hand stopped mid-air at hip height, fingers open, shoulders up), `scared`, holds.
- **Camera (V):** `cam((0.3, 0.6, −0.5), 190 → 182, 2.85 → 2.4, 0.55, 1100, 880)` L0–54. Run: start lead 483, dog entry head (224, 953), paws 1680; end lead 546, hand (488, 861), dog top (517, 903), paws 1132.
- **Sound:** **S14** dog trot on packed dirt L0–36 (6 steps, stop at G596); M2 ducks out at the freeze G580; A3.
- **Cut:** hard at G614 (5.5 f before L07).
- **Accept:** the dog stops short of her hand (no contact yet); her hand stays frozen from L20; the open gate leaf reads as a leaf at this lens (W3 defect: check).

### B03-SH03 · 614–755 · the sniff (L07)

- **Time:** L07 G619.5–749.2; "สี่หมื่น" G715 `est`.
- **Staging (V):** dog nose to H from L4 (contact) to L128, sniff cycle every 12 f (1 cm bob), profile to the lens; tail slow wag from L110; GIRL frozen above, `quarter` front-left, eyes down on the dog, a swallow at L60.
- **Camera (V):** `cam((0.35, 0.85, −0.2), 145 → 135, 1.6 → 1.4, 0.85, 1100, 760)` L0–141. Run: lead 851 → 970, chin 578 → 553, hand (429 → 405, 925 → 952), dog top 1044 → 1084, paws 1450 → 1547; her feet in the band (1201 → 1263; sandals on earth, no face or contact).
- **Sound:** **S15** `creature_dog-sniff-snuffle_01` at L2 (G616), again −6 dB at L90 (G704); M2 back on L07 (G620); A3.
- **Cut:** hard at G755 (L07|L08 gap, medium confidence).
- **Accept:** nose-to-hand contact holds without a gap L4–128; contact above 1160.

### B03-SH04 · 755–815 · a full stadium (L08)

- **Time:** L08 G760.2–807.1; crane L0–56, hold L56–60.
- **Staging (S):** the N9 bowl and dot crowd (42,591 dots), still, shimmer ≈ 1 % of dots every 3 f on G; no banners, numbers or captions in the picture.
- **Camera (S):** start `cam((0, 8, 0), 55, 110, 52, 1000, 840, −22)` → end LF04 `cam((0, 8, 0), 65, 141.6, 189.2, 1000, 840, −52)` via `mixYCam` L0–56. Run: start centre spot (540, 898), far rim y 554–579, near rim out of frame; midpoint (e 0.5) far rim 592–689, near rim enters at (1071, 1356); end (LF04) rim 526–1179, centre spot (540, 861). The camera rises 137 m and backs out (distance to the target 118 → 230 m) while the far rim moves inward (x 239 → 387) and the near rim rises in from the lower right: **reads as a crane up and back.** Back-facing check: every near-stand point in frame at the start lies at a sight-line depression ≥ 41.8° (> 36.7° upper rake), so no seat backs show; the near stand outside the frame needs no check.
- **Sound:** **A5** hush of a huge open bowl from L0 (G755); M2 low.
- **Cut:** hard at G815 (L08|L09 gap).
- **Accept:** the whole bowl in frame by L56; no person, no number; band on the pitch at the start, on the rim and outer wall at the end (LF04 mean 0.610). Note: a fast rise (2 s); check pace at the draft.

### B04-SH01 · 815–858 · the lick, the dog leaves (L09)

- **Time:** L09 G820.3–862.2; lick L2–8; exit L20–40.
- **Staging (V):** dog licks her hand L2–8, `happy-wag` L0–43, turns L12–20, trots off screen left (+x) to (2.2, 0, −0.9), out of frame by L34 (`walk-out`); GIRL `relieved`, shakes the right hand L16–26, shoulders drop L22–34 (no voiced breath).
- **Camera (V):** `cam((0.3, 1.0, −0.2), 195 → 188, 2.6 → 2.3, 1.3, 1050, 700)` L0–43. Run: lead 541 → 595, hand (500, 964), dog paws 1288 at the start (paws on earth in the band; no contact).
- **Sound:** **S22** lick L3 (G818, new, above); **S14** trot out L20 (G835, 4 steps); A3; M2 2.
- **Cut:** hard at G858 (4 f before L09 ends, SD15).
- **Accept:** the lick is the only contact; she reads relieved by L34.

### B04-SH02 · 858–899 · the stopped step (V03)

- **Time:** freeze L8 (G866); V03 G867–895; music cut G866.
- **Staging (F):** GIRL opens mid-stride toward the lens (`front`) from (0, 0.35, −1.0), right foot swinging; plants and freezes at L8 at P0 (0, 0.35, −0.75) in `step-freeze`, right foot raised 0.12 m and forward to z −0.45, phone in the right hand at her side, `scared`; snake lying still across the path at z 0 (centre x −0.08, head at +x facing her); her shadow down the path across the snake (W3 sun).
- **Camera (F):** `cam((0, 0.7, −0.6), 0, 2.2 → 2.0, 0.7, 1100, 850)` L0–41 `easeOutCubic` (end = LF02B). Run: lead ≥ 633 → 839, snake y 1005–1138, head (844 → 885, 1005 → 1026).
- **Sound:** one sandal step on dry dirt at L0 (S13 family, single step); A4 low; music cuts at L8; V03 in the clear.
- **Cut:** hard at G899.
- **Accept:** the snake stays fully above 1160; the raised foot never reaches the snake (0.45 m clear).

### B04-SH03 · 899–987 · the snake's head (L10)

- **Time:** L10 G903.6–981.8; head lift L6–20; tongue flicks L24–30, L54–60; "ห้าล้าน" G960 `est`.
- **Staging (F):** snake head lifts 0.02 → 0.10 m and turns toward her foot; her raised sandal hovers above-left of it with a 2 px tremble; her standing foot planted behind.
- **Camera (F):** `cam((0.35, 0.45, −0.2), 40 → 32, 0.9 → 0.8, 0.62, 1200, 760, −10)`, near 0.05, L0–88. Run: snake head (583 → 627, 804 → 840), raised sandal (443 → 376, 687 → 700), standing foot (605, 758); the band on the near bund dirt.
- **Sound:** **S16** dry slither at L6 (G905), the single quiet hiss at L24 (G923); M3 enters low on L10 (G904); A4.
- **Cut:** hard at G987 (L10|L11 gap, medium confidence).
- **Accept:** no strike, no contact; the sandal reads above the head.

### B04-SH04 · 987–1077 · she steps back; the snake slides away (L11)

- **Time:** L11 G993.5–1069.1; steps back L4–28; slither L20–60; paddy entry L60; grade cools L30–90.
- **Staging (F):** GIRL steps back two steps to (0, 0.35, −1.9) (`front`, `scared` → `relieved`); snake slithers off the +x edge of the bund L20–60 into the rice and water (ripple line L60–80); sky toward `#7f9ab0`.
- **Camera (F):** crane `cam((0, 0.8, −1.0), 20, 3.0, 1.2, 900, 760, −6)` → `cam((0, 0.3, −1.0), 35, 16, 9, 900, 640, −26)` L0–90. Run: start lead 497, snake (154–598, 990–1017); end lead 72 (crane-end exception), snake exit (555, 723).
- **Sound:** **S16** slither L20 (G1007); **S17** paddy entry L60 (G1047); A4; M3 1.5.
- **Cut:** hard at G1077 (L11|L12 gap).
- **Accept:** the snake is gone into the rice before the cut; the light visibly cooler at the end.

### B05-SH01 · 1077–1141 · bedtime (L12)

- **Time:** L12 G1082.4 (narration v2, R2.1; v1 G1084.3); "…" 1121.9–1125.5 (v1 1103.0–1110.8); blanket L0–20; eyes close L40–52.
- **Staging (N):** GIRL lies on her left side facing the lens (P37, `home-lounge-night`), blanket pulled to the shoulder L0–20, exhale, `relieved` → `sleepy`, eyes close; fan oscillates ±40° (6 s period on G); moonlight; knotted net above (Q4).
- **Camera (N):** `cam((−0.15, 0.55, −1.0), −5 → 0, 2.35 → 2.1, 1.45, 880, 700)` L0–64 (end = LF03). Run: lying length 522 → 588, head (320 → 305, 998 → 1025), lamp (143, 892), fan (926 → 997, 789 → 802); band on the bed front and blanket.
- **Sound:** A6 fan + crickets −18 dB from L0; M4 `bed_warm-pad-felt-third_01` from L0 (G1077), energy 1; **S18** blanket settle + sigh L6 (G1083).
- **Cut:** hard at G1141 on "นั้นอีก" (SD16; R2.1 text, was "เจ็บเลย"; L12 end G1152.8, still 12 f after the cut).
- **Accept:** lamp and fan in frame; her head above 1160.

### B05-SH02 · 1141–1203 · the buzz returns (V04)

- **Time:** eyes snap L6 (G1147); V04 G1158–1197; blanket to the nose L14–28; cut on L13's first frame.
- **Staging (N):** close on the pillow: eyes snap open, `scared`; the dot (same card, 5 px + trail) circles her head on a 0.2 m orbit centred 0.18 m above it, 30 f period, from L4; she pulls the blanket to her nose with both hands.
- **Camera (N):** `cam((−0.75, 0.62, −1.15), 0 → −6, 0.9 → 0.8, 0.75, 1100, 820)` L0–62. Run: head (540, 979 → 999), head width ≈ 490 px, dot orbit centre (540 → 578, 741 → 729), blanket edge 1094–1113.
- **Sound:** M4 cut dead at L0 (G1141); **S10** the same whine file, close and circling (pan period 30 f) from L0; A6 stays; V04 over it.
- **Cut:** hard at G1203 = L13 onset (placeless range starts).
- **Accept:** the dot is the same size and trail as in B02; never shown biting.

### B05-SH03 · 1203–1381 · the mosquito alone (L13, L14)

- **Time:** L13 G1203.0–1278.3 (L0–75); L14 G1289.4–1376.0 (L86–173); "หลายแสน" G1345 `est`.
- **Staging (M, mm):** mosquito hovering, wings blurred, legs trailing, drifting +x 0 → 4 mm over L0–75; one cool rim light top-left; particle drift. No room, no person, no marker.
- **Camera (M):** arc `cam((0, 8, 0), −20 → 20, 22 → 26, 8, 1100, 700)`, near 2 mm, L0–75 (trucking with the drift); hold L75–86; pull back r 26 → 1100 mm log-eased L86–173; hold L173–178. Run: body 283 → 239 px (L13), 6 px at the end (the B02 dot size); legs end above y 1100.
- **Sound:** **S10** only, centred; −6 dB over the pull-back; no fan, no music.
- **Cut:** hard at G1381 (L14|L15 gap).
- **Accept:** placeless from G1203 to ≥ G1376; ends on a 6 px dot with its trail; caption band on the dark ground (LF03B mean 0.103).

### B06-SH01 · 1381–1432 · the lamp (L15a)

- **Time:** click L4; flood L4–10; sit-up L8–32; phone L28–44; L15 G1393.6, "…" 1427.5 (the cut).
- **Staging (N):** dark (moonlight) L0–4; right hand finds the lamp, click L4, warm flood (CSS overlay, LF03L method) L4–10; she sits up (`sit-up-phone`) to hips (−0.55, 0.45, −1.35) L8–32, takes the phone from the table with the right hand L28–40, both hands at the chest L44, screen wakes (cool glow on her face) L44.
- **Camera (N):** `cam((−0.6, 0.8, −1.0), −20 → −12, 2.0 → 1.75, 1.2, 1150, 640)` L0–51 (end = LF03L). Run: seated lead 565 → 580, chin 715 → 717, lamp (85 → 78, 822 → 833).
- **Sound:** **S19** lamp switch L4 (G1385); **S20** `electric_phone-wake-click_01` L44 (G1425); M5 faint from L10 (G1391); A6.
- **Cut:** hard at G1432 in the L15 "…".
- **Accept:** the lamp turns on visibly before she moves; chin above 1160.

### B06-SH02 · 1432–1501 · back to her post (L15b)

- **Time:** "แต่ยังเหลือตัวเลขเดียว ที่เรายังไม่ได้ดู" G1437.9–1498.9; "ตัวเลข" G1453 `est`; scrolls L4, L10; post L14.
- **Staging (P):** the B02-SH02 framing (screen quad 1700 → 1780 px, bottom 1176 → 1150), warm lamp edge in the background; two thumb flicks back to the river post, which settles at L14: same photo, caption, counter "แชร์ 58K" rising.
- **Camera (P):** as B02-SH02.
- **Sound:** **S21** two scroll flicks L4, L10 (G1436, 1442); **S12** at −6 dB on "ตัวเลข" L21 (G1453); M5.
- **Cut:** hard at G1501.
- **Accept:** caption readable L14–69 (55 f); **the counter label visibly rises within the shot** (needs a step across a thousand, e.g. 58K → 59K at about L40: `SHARE_STEPS_B06` is 58,000–58,600 and stays "58K"; Boss item B4).

### B06-SH03 · 1501–1587 · the push onto 500 (V05, L16)

- **Time:** push L0–16 `easeOutCubic`, creep +3 % L16–86; V05 G1508–1515 (L7–14); L16 G1522.6–1584.5, "…" 1553.1–1564.0.
- **Staging (P):** picture-stage zoom of the screen layer (brief recorded reason): from the SH02 end framing to "500 คน/ปี" spanning x 60–1020 at y ≈ 860 (≈ 2.3 px per logical unit; Boss measures the line's bbox in `Post.tsx`); the painted phone edge and hand slide out of frame under it by L10; the counter leaves the frame by L10 (SD12). Nothing added: no stamp, no "?", no red.
- **Sound:** near-silence (A6 −20 dB); M5 faint; V05 in the clear.
- **Cut:** hard at G1587 (2.5 f after L16).
- **Accept:** from L16 the 500 fills the width above 1160 and nothing else changes on it.

### B06-SH04 · 1587–1658 · her face (beat, L17)

- **Time:** silence beat G1587–1603.4 (16 f; the read's own 19 f gap); L17 G1603.4–1654.4.
- **Staging (N):** close: face lit cool from below by the phone at the chest (−0.5, 0.98, −1.05), warm lamp rim from frame left; slow blink L6–10, brow knits L10–20, `suspicious` → `worried` by L40.
- **Camera (N):** `cam((−0.55, 1.22, −1.30), −8 → 0, 0.95 → 0.85, 1.30, 1150, 740)` L0–71. Run: head top 498 → 472, chin 1016 → 1047; the phone's back crosses the band at the start (1259; back, not the screen).
- **Sound:** silence (A6 −20 dB, M5 faint) then NAR; no cue.
- **Cut:** hard at G1658 (L17|L18 gap, 3 f before L18).
- **Accept:** chin above 1160; no sound event in the beat.

### B06-SH05 · 1658–1872 · the tableau and the hold (L18, hold)

- **Time:** phone lowered L0–30; camera move L0–154; L18 G1661.1–1811.9 ("…" 1724.9–1736.8; "ชี้ที่มาได้ชัด" G1785 `est`); half-smile L120–150; hold L154–214 (G1812–1872).
- **Staging (N):** she lowers the phone from the chest to belly height over her knees (−0.45, 0.81, −0.96), screen tilted 50° up toward her, still showing the zoomed "500 คน/ปี" across ≥ 80 % of the screen width (SD11; Boss item B3); her face above, cool glow from below, warm lamp; small sheepish half-smile at the end.
- **Camera (N):** `cam((−0.5, 1.0, −1.15), −6 → −3, 0.95 → 0.90, 1.25, 1100, 640, −14)` L0–154, then fixed (the last 20 f move 0 %). Run: face centre (471 → 477, 312 → 309), chin 552 → 560, phone centre (630 → 623, 953 → 991), phone width 84 → 91 px (500 glyphs ≈ 28–30 px), hips 1062 → 1087; band on the blanket over her knees.
- **Sound:** **M6** swell from G1661, peak on "ชี้ที่มาได้ชัด" (G1785); **END1** at L154 (G1812, first frame of the hold), rings into `A_fade`; A6 room tone fades to silence by G1871.
- **Cut / ending:** none; `A_fade` closed ending, no loop seam.
- **Accept:** phone screen and face above 1160 for the whole shot; the 500 legible as a number in the hold; no camera motion in the last 60 f.

## Boss, Ton and Editor handoff

- **Boss (plates from this sheet):** B1 harden `PaintedStack` + `HippoInSet` for the shot adapter (hippo light from the set, W3 finding 4); hippo anims SURFACE (fast, head breaks L1), YAWN (front-loaded L2–14), SWIM, CHARGE (from x −2), HALT (8 f), SNORT, LURK at the marks above. B2 snake states lie, head-lift + tongue, slither + paddy entry; dog lick (`new: lick`, tongue out L2–8, not in the kit motions) and the gate leaf for B03-SH02/03. B3 `PostScreen` zoom state (a viewBox crop on the "500 คน/ปี" line) for B06-SH03 → SH05 (proposed API; not existing). B4 `SHARE_STEPS_B06` crossing a thousand during B06-SH02 (owner `Post.tsx`; value change). B5 the FPOV quad from the painted phone (`paintPhoneBody`, WORLD FOG VD09 method). B6 the post photo still from B02-SH01 L29.
- **Ton:** every NEEDS-GEN cue in the brief plus S22; library IDs by ear; the frames above.
- **Editor:** narration placement (segments A–F and c above, room-tone fills), V01–V05 at the G spans above, captions per the caption plan, `durationFrames` 1872, END1 at G1812, `A_fade`. Draft cut renders at half size per the render skill stage order.

## Dependencies and open items

| Owner | Dependency / acceptance | Status |
| --- | --- | --- |
| Boss | B1–B6 above; contact and size checks against the Run values per shot (±15 px) | missing |
| Ton | A1–A6, M1–M3, M5, END1, S1–S8, S13–S14, S16–S19, S21–S22 NEEDS-GEN; library IDs by ear | missing |
| Editor | placement script for segments A–F; V takes; captions; registration | missing |
| User | Q7 length 62.4 s (inside the 63 s cap, over the 50–60 s target): keep, or take T2 | open |
| Film | draft review: B03-SH04 crane pace (2 s), B01-SH03 hippo scale in the charge (≈ 250 px wide at the halt), weak L03 "…" cut | at W5 |

## Change log

- 2026-11-16 **R1.1 text-only (Editor, script R2.1 L12):** L12 is now "แต่ที่หนึ่ง… ตัวเล็กนิดเดียว แต่ฆ่าได้มากกว่านั้นอีก" (user, option B). Narration v2 swaps L12 in the locked read: onset G1082.4 (was 1084.3), "…" pause G1121.9–1125.5 (0.12 s; was 0.26 s), end G1152.8 (was 1153.0), so every other line, cut, cue and V01–V05 keeps its G value (V04 G1158–1197 still starts 5 f after L12 end). The sheet header stays R1.0; Film to bless the wording of SD16 and the B05-SH01 note. No shot, timing, staging or sound change.
- 2026-11-16 EDU-EP18-SHEETS-R1.0 (Film W4 timed pass): first timed sheet from the locked narration v1 ([narration-measure.json](narration-measure.json)) and the approved V01–V05; 24 shots, 1872 f (62.40 s, margin 18 f to the 63 s cap); narration placement A–F; staging deviations SD01–SD17 from the projection run ([projection-run.py](projection-run.py)); new cue S22; review rows EDU-EP18-ROWS-R2.0.
