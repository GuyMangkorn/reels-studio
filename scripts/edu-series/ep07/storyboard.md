# Storyboard EDU-EP07-ROWS-R1 — EDU-EP07-SHORT (first pass, untimed; R1.3 B03 update)

- **Current revision: EDU-EP07-ROWS-R1.3** (Film W5.1, 2026-11-08, script **EDU-EP07-SCRIPT-R1.2**): B03 is rewritten below (S01-B03-SH02/SH03 retired, new S01-B03-SH05, S01-B03-SH04 restaged); 17 shots, 1580 f = 52.67 s; frames and every number in [scene-sheets.md](scene-sheets.md) EDU-EP07-SHEETS-R1.2, which wins over this file. Rows in [review-rows.json](review-rows.json) (`timingEstimated: false`). Review page: pending.

- Revision **EDU-EP07-ROWS-R1** (Film W2.2, 2026-11-08). Inputs: script **EDU-EP07-SCRIPT-R1.1** ([script.md](script.md), user-approved and locked 2026-11-08, ending `B_loop`), brief **EDU-EP07-BRIEF-R1** ([film-brief.md](film-brief.md): SET-SOI, SET-SPACE, SET-GW, split frame, clock card, VD01–VD18, shot plan, N1–N10), fact-check [fact-check.md](fact-check.md) (W1.3 + recheck pass). No voice (W4 not run).
- Status: `ready-for-dev` for the first storyboard review (camera and VO only). **Untimed**: the review page shows no times; the lengths below are the brief's `est` (total ≈ 54.5 s, 18 shots). W3 adds the look frames to the same rows; W5.1 writes timed scene sheets with integer frames from the voice-lock measure file. Not user-approved; no render, no runtime or visual validation.
- Review rows: [review-rows.json](review-rows.json) (Thai, one row per shot, `lines` cites the script line IDs, `"untimed": true`). Review page: pending (coordinator publishes).
- Units and owners: SET-SOI in metres (origin on the paving at the cart's front-edge centre, +x right along the footpath, +y up, +z toward the road; day and night states); SET-SPACE in schematic units su (origin = the Sun / the empty spot, orbital plane y 0, Earth orbit R 1.0, φ counterclockwise from above); SET-GW in gu (origin = the neutron-star pair). Camera line: `cam: target, yaw a→b (orbit about the target), r, eye, pitch, f (px), hy (px)`, yaw 0 = on +z looking −z; or an explicit position. One kit yaw camera per set per shot owns projection; the split frame paints two cameras into one plate (space clip y 0–760, street clip y 760–1920). People are flat cards squared to the mid-shot camera (`squareToCam`); sky bodies at infinity; the clock card and its text in screen space (Remotion). All positions `est` until the look frames.
- Casting: VEN = **`woman-ponytail + vendor`** (`new: pound-pestle`, `new: point-up`, P32 at +1 h); CUS = **`man-crop`** (P31 on a stool, `new: fan-self`, MOTIONS `look-around`). Kit layers: ENV-SKY `paintSkyBands` (day, night), `paintSkyDisc` + `new: moon-phase`, `new: ENV-STARS`, `glow.tsx` `Bubbles` (sun motes, B05-SH02).

## Shot list

Est s = brief shot-plan length. Check = the observable test the shot must pass at Draft (brief spikes 1–8 where cited).

| Shot | Lines | Est s | Picture | Camera (brief, est) | Casting | Sound cue | Check | Look |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S01-B01-SH01 | L01a | 1.6 | Sunny soi, stall, VEN pounding, CUS on a stool with his forearm in the sun, pale quarter Moon; tilt up to the sky | pose A `T-STALL, yaw +24→+22, r 2.80→2.65, eye 1.35, pitch +6°→+40° (last 12 f), f 1050, hy 980` | VEN `woman-ponytail + vendor, pound-pestle, happy`; CUS `man-crop, P31, tired` | NG-A1 street, NG-M1 ukulele, NG-S1 pestle | spike 1 | LF01 |
| S01-B01-SH02 | L01b, L02 | 3.9 | Space: Sun, orbit, small Earth; the Sun blinks out; empty spot, Earth still lit | `T-SPACE, yaw 0→+3, pitch −32°, r 3.00→2.85 su, f 900, hy 960` | — | street ducks; NG-A3 pad; NG-S2 pop | blink on "ตอนนี้" | LF04 |
| S01-B02-SH01 | L03 | 3.7 | Split: space above (dashes still flowing to Earth, ring leaving the spot), sunny street below; card 08:19 racing | space `T-SPACE, yaw 0→+4, r 3.2, f 700, hy 480`; street `T-STALL, yaw +30→+28, r 4.2, eye 1.30, pitch +4°, f 900, hy 1250` | as B01 | ukulele back; `ui_click-tick_01` low | spikes 2, 3 | LF02 |
| S01-B02-SH02 | D01 | 1.5 | CUS fans himself, sunlit arm, "ร้อนจังวันนี้" | `T-CUS, yaw +10→+14, r 1.60→1.50, eye 1.05, f 1050, hy 900` | `man-crop, P31 + fan-self, tired` | NG-S3 fan | face ≥ 280 px unit | LF02 |
| S01-B02-SH03 | D02 | 1.7 | VEN grinning, pounding, "พรุ่งนี้ร้อนกว่านี้อีก" | `T-VEN, yaw +18→+14, r 1.70→1.60, eye 1.35, f 1050, hy 860` | `woman-ponytail + vendor, pound-pestle, talk` | NG-S1 | pestle contact | LF02 |
| S01-B03-SH01 | L05 | 4.9 → 5.5 (R1.2) | Split: Earth keeps curving (seen 0.5 s before the line), ring grows fast; CUS still fanning below; card races 07:11 → 02:00 | split (space yaw +4→+7; street yaw +28→+26) | CUS `man-crop, P31 + new: fan-self, tired`; VEN as B01 | tick faster/louder; motorbike (sound only) | Earth on the orbit ±2 px | LF02 |
| ~~S01-B03-SH02~~ | ~~L06~~ | — | **Retired in R1.2** (2017 merger; L06 cut). ID not reused. | — | — | — | — | — |
| ~~S01-B03-SH03~~ | ~~L07a~~ | — | **Retired in R1.2** (race to Earth; L07 cut). ID not reused. | — | — | — | — | — |
| S01-B03-SH05 | V01, L15 | 2.9 (R1.2, new) | Split: Earth on its curve above; below, close on CUS laughing (snort) at a cat clip on his phone, no alert on the screen; VEN pounding behind; card under 02:00 | space yaw +7→+8; street `orbit((1.40, 1.00, 0.35), az 8→11, r 1.55→1.50, eye 1.05, f 1000, hy 1010)` `est` | CUS `man-crop, P31 + new: phone-watch, amused → laugh`, kit phone + `new: phone-screen` (`cat-orange-tabby, startle-hop`) | ukulele on, steps down on L15; cat mrrp from the phone; V01 low | screen shows a cat clip only; head unit 260–300 px | LF02 |
| S01-B03-SH04 | L16 + tick | 2.4 → 3.8 (R1.2) | Split wide: the last light front just short of Earth, the empty spot behind; CUS scrolling, oblivious, then pockets the phone; music out, tick alone, card races 00:30 → 00:22 | split (space yaw +8→+10; street static) | CUS `man-crop, P31 + P10 arms + kit phone`, `new: pocket-phone` | music out on "แม้แต่ข่าวร้าย"; tick alone 0.5 s; race ticks | ring outside Earth's disc; phone gone by L112 | LF02 |
| S01-B04-SH01 | L08 | 2.4 | Card 00:00 on "ศูนย์"; Earth's day side darkens; the street sky darkens to stars; Moon still lit; silence | split, static | as B01, VEN `surprised` | **total silence from the 00:00 frame** | spikes 3, 4 | LF03 |
| S01-B04-SH02 | silence, D03 | 3.0 | Night: pestle frozen mid-air; CUS looks around, "เอ้า… ไฟดับเหรอ"; far dog | `T-PAIR, yaw +20→+19, r 2.40→2.35, eye 1.25, f 1050, hy 940` | VEN `surprised` (held); CUS `surprised` + `look-around` | silence ~1.5 s; NG-A2; NG-S7 dog | spike 4 | LF03 |
| S01-B04-SH03 | L09 | 2.4 | Space: dark Earth leaves straight along the tangent; the orbit curves on, empty | `T-EARTH-DEPART, yaw +10→+14, pitch −28°, r 1.60→1.75 su, f 900, hy 1000` | — | NG-M2 cold pad in | spike 5 | LF04 |
| S01-B04-SH04 | L10 | 2.6 | From behind the two looking up: the quarter Moon over the roofs fades out | pos (+1.20, 1.35, +2.90), along the Moon direction, pitch +20°→+26°, f 950, hy 1250 | both `back` | `reveal_glass-shimmer-soft_01` | spike 6 | LF03 |
| S01-B04-SH05 | L11 | 3.7 | Card flips to "+1 ชม."; the two now seated; Jupiter's steady bright dot over the wall; VEN points | same pos, yaw −14° from the Moon direction, pitch +16°, push 6 %, f 950, hy 1250 | VEN P32 + `point-up`; CUS P31; both `back` | `tone_thin-unresolved_01` | Jupiter after the flip | LF03 |
| S01-B04-SH06 | L12 | 2.8 | Diagram: dashes reach Jupiter, Jupiter goes dark, reflected dashes still flying to Earth | `T-SYS, yaw 0, pitch −40°, r 5.4→5.25 su, f 900, hy 1000` | — | Jupiter tone holds | spike 7 | LF04 |
| S01-B05-SH01 | L13 | 3.0 | Tilt up from the still stall into a sky full of stars, Jupiter among them | `T-STALL, yaw +24, r 3.0, eye 1.30, pitch +10°→+55°, f 950, hy 980` | both seated, `back` | NG-M3 warm pad | stars, not black | LF03 |
| S01-B05-SH02 | L14a | 2.5 | Hard cut to the sun: CUS's forearm in warm sunlight (CL03) | `T-ARM, yaw +30→+32, r 0.65→0.60, eye 0.75, f 1050, hy 900` | CUS `man-crop`, P31 | street + ukulele at full level on the cut | arm reads as sunlit skin | LF01 |
| S01-B05-SH03 | L14b + hold | 3.7 | The L01 framing returns; VEN pounding; camera settles into frame 0 | `T-STALL, yaw +20→+24, r 2.45→2.80, eye 1.35, pitch +6°, f 1050, hy 980`, stops 30 f before the end | as B01-SH01 | `stinger_pizz-tag-ending_01` (UT15) | spike 8 (seam) | LF01 |

## Rules carried from the brief and fact-check (every shot)

- **R01** On-screen text only: the clock digits (08:19 → 00:00), the ▸▸ glyph, "+1 ชม."; captions; `@TamMaiLa`. No "2017", "130", Moon or gap numbers, no labels, no title.
- **R02** The clock card shows 08:19 on its first frame, races visibly, and hits 00:00 on "ศูนย์" (L08) ± 1 f; it is hidden in the 2017 cutaway and in B05; it holds 00:00 through L10, flips to "+1 ชม." on L11. **R1.2 amendment (SD08):** there is no cutaway; the card is visible in every frame from its first frame to the end of S01-B04-SH01, under 02:00 for the whole phone beat, and races (visibly faster) from 00:30 after "แม้แต่ข่าวร้าย".
- **R03** Earth stays on its orbit (lit day side) until the ring reaches it at 00:00, then goes dark and leaves along the **tangent**; never outward.
- **R04** The Moon is a first-quarter Moon, lit half toward the Sun's direction (upper half in pose A); it stays lit after 00:00 until L10.
- **R05** *(retired in R1.2 with L06–L07)* The 2017 picture keeps the ripple first and the flash a hair later; never together; stylised, no data look.
- **R06** The dark is a starry night, never flat black (UT03); no electric light at all (no lamps, no stall bulb); no frost or cold cue. (R1.2: CUS pockets his phone before 00:00, so no screen glow in the night.)
- **R10 (R1.2)** Nothing may warn before 00:00 (Boat): CUS's phone shows one cat clip only: no text, icon, badge, notification, alert or news; no ding or siren in the sound.
- **R07** Jupiter is singled out only after "+1 ชม."; in L12 it is lit only on its Sun-facing side and never glows by itself.
- **R08** Frame zones: caption band y 1176–1344 (`bottomEdgeY` 1344, ≤ 2 lines, edu stroke, no band); faces, the mortar, Earth, the Moon and diagram events above y 1160; nothing important above y 140; clock card box x 700–1020, y 160–280 kept clear. Street ↔ space is a cut or the split frame, never a zoom.
- **R09** `B_loop`: B05-SH03's last frame equals B01-SH01 frame 0 (camera, poses, pestle phase, Moon, light); final ~0.5 s speech-free.

## Per-shot staging

Each block: staging (SET-SOI metres, SET-SPACE su, SET-GW gu; `est`), camera, light, sound, check. Shot-local integer frames and SFX frame cues come in W5.1; times below are seconds into the shot at the brief's est length. Library IDs from `~/ReelsStore/library/sound/INDEX.md` (checked by the brief 2026-11-08; generated entries "not listened"); NG-* = the brief's NEEDS-GEN list.

### S01-B01-SH01 — L01 "ถ้าดวงอาทิตย์…" (LF01)
- **Staging:** VEN behind the cart at (+0.35, 0, −1.15), facing +z, `front`, `pound-pestle` (stroke tip (+0.35, 1.30, −0.25) ↔ (+0.35, 0.98, −0.20), ~1.6 strokes/s). CUS on stool 1 (+1.45, 0, +0.35), facing (−0.3, 0, +0.95), `front`, P31, near forearm on his knee at (+1.30, 0.58, +0.50) in full sun (CL03, not featured). Moon sky disc at screen (760, 445) ± 40, first-quarter, lit upper half. Props as set plan.
- **Camera:** pose A `cam: T-STALL (+0.45, 1.05, −0.35), yaw +24→+22, r 2.80→2.65 m, eye 1.35, pitch +6°, f 1050, hy 980` for 0–1.2 s; then tilt pitch +6° → +40° over the last 12 f (ease-in), ending on bright sky (no Sun in frame). Frame 0 = the loop target.
- **Light:** afternoon key from behind-right high; umbrella shade on VEN with warm bounce; CUS in sun.
- **Sound:** NG-A1 street (fallback `crowd_murmur-far-bangkok_01`), NG-M1 ukulele (fallback `bed_curious-explainer-light_01`), NG-S1 pestle on each down-stroke; `whoosh_air-swish-rising_01` very soft under the tilt (optional).
- **Check:** spike 1; the stall and the two people read before the tilt starts.

### S01-B01-SH02 — L01 "หายไปตอนนี้… คุณจะยังไม่รู้ตัวไปอีก 8 นาที", L02 "แค่สมมตินะ" (LF04)
- **Staging:** SET-SPACE: Sun disc r 0.18 at the origin with halo; Earth r 0.06 at φ −60° (0.50, 0, 0.87), day side toward the origin; orbit polyline R 1.0; star field. On "ตอนนี้" (≈ 0.5 s): 2 f bloom (halo × 1.4), the disc gone on the 3rd frame, halo collapses over 8 f. From then: the empty spot; the dash stream still flowing toward Earth (tail starts at the origin and moves out); Earth stays lit.
- **Camera:** `cam: T-SPACE (0.30, 0, 0.30), yaw 0→+3, pitch −32°, r 3.00→2.85 su, f 900, hy 960` (slow push).
- **Light:** cool space; Earth's day side warm; Sun the brightest thing until the blink.
- **Sound:** street ducks to NG-A3 pad on the cut (fallback `bed_underwater-mystery-sparse_01` high-cut); NG-S2 pop on the blink frame (fallback `ui_pop_01` + `reveal_reverse-swell-airy_01`); street returns low on L02's end.
- **Check:** the empty spot reads as "where the Sun was" (orbit centred on it); Sun, Earth above y 1160.

### S01-B02-SH01 — L03 "แสงแดดเดินทางมาถึงโลก… ราว 8 นาที 20 วินาที" (LF02)
- **Staging:** split. Space panel: empty spot, Earth sliding from φ −60° (stylised compressed time; −45° at 00:00), the dash stream flowing to Earth, the news-front ring radius `R = (499 − clock_s)/499` (≈ 0.02 at the card's first frame). Street panel: the B01 state (VEN pounding, CUS waiting), the same sun. Clock card pops in (6 f) at **08:19** on the first frame of L03 and counts down at the shared rate (≈ 21×, set at W5).
- **Camera:** space `cam: T-SPACE, yaw 0→+4, pitch −32°, r 3.2 su, f 700, hy 480`; street `cam: T-STALL, yaw +30→+28, r 4.2 m, eye 1.30, pitch +4°, f 900, hy 1250`; seam line y 760.
- **Light:** each panel its own; the street exactly as sunny as B01.
- **Sound:** NG-M1 back; `ui_click-tick_01` sequenced at ~1.5 ticks/s, low-passed, low in the mix.
- **Check:** spike 2; spike 3 (first card frame 08:19).

### S01-B02-SH02 — D01 "ร้อนจังวันนี้"
- **Staging:** CUS P31 + `fan-self` (right hand fans a folded paper menu near his face, ~3 flaps/s), `tired` → `talk` on the line; his near forearm in sun in the lower frame (above y 1160). VEN out of focus behind left.
- **Camera:** `cam: T-CUS (+1.45, 1.00, +0.35), yaw +10→+14, r 1.60→1.50 m, eye 1.05, f 1050, hy 900`. Clock card racing.
- **Light:** full sun on him; the umbrella's shadow edge just left of him.
- **Sound:** NG-S3 fan flaps; street + ukulele under; tick continues.
- **Check:** CUS head unit ≥ 280 px; the arm is in frame but not centred.

### S01-B02-SH03 — D02 "พรุ่งนี้ร้อนกว่านี้อีก"
- **Staging:** VEN `pound-pestle`, `talk` with a grin, glancing at CUS (head toward +x); clock card racing.
- **Camera:** `cam: T-VEN (+0.35, 1.30, −1.15), yaw +18→+14, r 1.70→1.60 m, eye 1.35, f 1050, hy 860`.
- **Light:** umbrella shade with warm bounce; sun on the cart's right end.
- **Sound:** NG-S1 pestle on each stroke; tick.
- **Check:** pestle tip meets the mortar mouth ±4 px; the face reads at 270 px.

### S01-B03-SH01 — L05 "โลกยังวนต่อ… ไอน์สไตน์บอกว่า แรงดึงที่หายไป… ก็ต้องเดินทางมาเหมือนแสง" (R1.2)
- **Staging:** split. Earth keeps sliding on its curve from the shot's first frame, 0.5 s before the line (show, then tell); the ring grows fast with the racing clock (≈ 0.21 → 0.70) but never reaches Earth; dashes beyond the ring still flowing. Street: CUS still fanning himself with the menu in the sun (`fan-self`), VEN pounding. Motorbike: sound only (W5.2 build).
- **Camera:** split, space yaw +4→+7; street yaw +28→+26.
- **Light:** as B02-SH01.
- **Sound:** tick a step louder and faster; motorbike pass (sound).
- **Check:** Earth on the orbit polyline ±2 px; ring and Earth do not touch; the card's minutes visibly race.

### S01-B03-SH02, S01-B03-SH03 — retired (R1.2)
- The 2017 merger and the race to Earth left with L06–L07 (user pick "A + R", script R1.2). SET-GW and NG-S5/NG-S6 are dropped. The IDs stay unused.

### S01-B03-SH05 — V01 (CUS snort-laugh), L15 "แล้วไม่มีใครเตือนเลยเหรอ" (new, R1.2)
- **Staging:** split stays. Top: Earth on its curve, ring a little closer. Bottom: close on CUS seated, three-quarter front, holding his phone up at chin height; on the screen one cat clip (`cat-orange-tabby`, startle-hop), nothing else: no text, no notification, no news (R10). He snorts a laugh through his nose (V01), shoulders bounce, then keeps smiling at the screen while the narrator asks the question; he cannot hear it. VEN soft behind, pounding.
- **Camera:** split; space yaw +7→+8; street close derived from the D01 close, shifted into the bottom panel (`est`, Boss measures).
- **Light:** day; small cool screen glow on his chin.
- **Sound:** ukulele plays on obliviously; a tiny tinny cat mrrp from the phone; V01 low under the music; on L15 the music steps down and the tick gets louder. No ding.
- **Check:** at 540 px a viewer reads "he is laughing at a cat video"; the card is visible and under 02:00.

### S01-B03-SH04 — L16 "ไม่มีหรอก… ไม่มีอะไรเร็วกว่าแสง… แม้แต่ข่าวร้าย", tick alone (R1.2)
- **Staging:** split wide (the two worlds). Top: the last light front just short of Earth, the empty spot behind it, Earth ahead on its curve (CL04). Bottom: CUS scrolling his phone, oblivious; after the line he pockets it (so no glow in the night); VEN pounding.
- **Camera:** split, space yaw +8→+10; street static.
- **Sound:** the music falls out on "แม้แต่ข่าวร้าย"; the tick alone for 0.5 s; then the tick speeds up as the card races 00:30 → 00:00 (the riser starts on L08 in the next shot).
- **Check:** ring outside Earth's disc; card 00:30 at the end of the line, then visibly faster; phone gone before the cut.

### S01-B04-SH01 — L08 "พอนาฬิกาถึงศูนย์… ฟ้าก็มืดลง"
- **Staging:** split, cameras static. Card counts the last seconds and hits **00:00 on "ศูนย์"** (▸▸ off). On that frame the ring meets Earth; Earth's day side goes dark over 10 f (city specks appear); street sky darkens from day to night over 30 f (`day-night-grade` 0 → 1), stars fade in from 40 % of the grade; figures go to the night grade; the Moon stays lit; VEN's pestle stops at the top of its stroke and stays.
- **Camera:** as B03-SH04, static (the stillness is part of the beat).
- **Light:** day → night; no electric light.
- **Sound:** riser ends dead on the 00:00 frame; **total silence** from that frame (music, tick, street out); VO "…ฟ้าก็มืดลง" alone.
- **Check:** spike 3 (± 1 f); spike 4 on the last frame.

### S01-B04-SH02 — silence ~1.5 s, D03 "เอ้า… ไฟดับเหรอ" (LF03)
- **Staging:** night. VEN frozen, pestle mid-air (tip at y 1.30), `surprised` held, breathing only. After the silence CUS `surprised` → MOTIONS `look-around` (seated; fallback head turns) on D03. Stars over the wall; the Moon upper right gives a cool rim.
- **Camera:** `cam: T-PAIR (+0.90, 1.05, −0.40), yaw +20→+19, r 2.40→2.35 m, eye 1.25, f 1050, hy 940` (near-static drift).
- **Light:** night key (moon rim from the Moon's direction, starlight fill), faces readable.
- **Sound:** ~1.5 s nothing; then NG-A2 still night air fades in under D03; NG-S7 distant dog twice after the line (off screen).
- **Check:** spike 4; the frozen pestle reads as a stop, not a glitch (breath runs).

### S01-B04-SH03 — L09 "โลกหลุดวงโคจร… พุ่งไปตรง ๆ"
- **Staging:** SET-SPACE: dark Earth (night side, city specks, blue rim) at φ −45° (0.707, 0, 0.707); it moves along (0.707, 0, −0.707), 0.55 su over the shot (stylised), leaving a faint straight dashed trail; the orbit line curves on, empty; the ring is beyond the frame.
- **Camera:** `cam: T-EARTH-DEPART (0.95, 0, 0.45), yaw +10→+14, pitch −28°, r 1.60→1.75 su, f 900, hy 1000`.
- **Light:** cool; the empty orbit line the brightest line.
- **Sound:** NG-M2 cold pad enters (fallback `bed_edu05-cold-theme_01`); no whoosh.
- **Check:** spike 5.

### S01-B04-SH04 — L10 "อีกไม่กี่วินาที… ดวงจันทร์ดับตาม"
- **Staging:** night. CUS stands at (+1.30, 0, +0.55), VEN at (+0.50, 0, +0.40) beside him, both facing −z, `back`, heads tilted up. The first-quarter Moon over the roofline (its fixed direction) fades to its unlit disc over 20 f on "ดับตาม"; the moon rim on their shoulders and hair fades with it.
- **Camera:** `cam: pos (+1.20, 1.35, +2.90), looking along the Moon direction, pitch +20°→+26°, f 950, hy 1250` (slow tilt).
- **Light:** moon rim → starlight only; the frame stays readable (stars, sky gradient).
- **Sound:** `reveal_glass-shimmer-soft_01` on the fade; cold pad.
- **Check:** spike 6; the Moon above y 1160; heads above y 1160.

### S01-B04-SH05 — L11 "แต่ดาวพฤหัสบดี… ยังสว่างต่ออีกราวชั่วโมงกว่า"
- **Staging:** time skip on the cut: card flips (8 f) from 00:00 to **"+1 ชม."** on L11's first syllable. The two now seated on the stools turned to face −z (VEN P32 on stool 2 at (+0.60, 0, +0.45), CUS P31 on stool 1), `back`. Jupiter appears 10 f after the flip as the brightest steady cream dot (core Ø 10 px, glow Ø 40 px, no twinkle) low over the wall left of the Moon's old place; VEN points up at it (`point-up`) on "ยังสว่างต่อ".
- **Camera:** `cam: same pos as SH04, yaw −14° from the Moon direction toward the wall, pitch +16°, push 6 %, f 950, hy 1250`.
- **Light:** starlight only.
- **Sound:** `tone_thin-unresolved_01` enters with Jupiter and holds through L12.
- **Check:** Jupiter is not shown before the flip (R07); the card reads "+1 ชม." at 270 px.

### S01-B04-SH06 — L12 "เพราะแสงต้องไปถึงมันก่อน… แล้วสะท้อนกลับมา"
- **Staging:** SET-SPACE diagram (replay, not the +1 h world state): empty spot at the origin; dark Earth just off its orbit near (0.90, 0, 0.55); Jupiter r 0.16 at (−2.08, 0, −1.20). Dashes flow from the origin toward Jupiter; Jupiter's Sun-facing half lit; the stream's tail reaches Jupiter on "ไปถึงมันก่อน…" and Jupiter's lit half goes dark over 8 f after it passes; reflected dashes leave Jupiter's lit face toward Earth from the start of the shot; their tail leaves Jupiter as it goes dark and is mid-way to Earth when the shot ends on "…สะท้อนกลับมา". Card holds "+1 ชม.".
- **Camera:** `cam: T-SYS (−0.60, 0, 0.00), yaw 0, pitch −40°, r 5.4→5.25 su, f 900, hy 1000`.
- **Light:** warm dashes on deep blue; no glow on Jupiter beyond its lit half.
- **Sound:** Jupiter tone holds; cold pad.
- **Check:** spike 7; Jupiter, Earth and both legs above y 1160.

### S01-B05-SH01 — L13 "ที่จริง… ดาวทุกดวงที่คุณเห็น คือภาพในอดีต"
- **Staging:** night. The stall still; the two seated, facing −z, `back`, small at the frame bottom at the start; the sky full of stars with a faint Milky Way wash; Jupiter (the same dot) among them. No card.
- **Camera:** `cam: T-STALL, yaw +24, r 3.0 m, eye 1.30, pitch +10°→+55°, f 950, hy 980` (slow tilt up).
- **Light:** starlight; the most beautiful dark of the film.
- **Sound:** NG-M3 warm pad (fallback `tone_soft-sustain-reflective_01`); Jupiter tone fades.
- **Check:** UT03 (stars fill the frame, not flat black).

### S01-B05-SH02 — L14 "และแสงแดดที่โดนตัวคุณอยู่ตอนนี้…"
- **Staging:** day, real present, no card. Insert: CUS's near forearm resting on his knee at `T-ARM` (+1.30, 0.62, +0.48) in full warm sun, hand relaxed (UT14 mitten), the umbrella's shadow edge just beside it; a few dust motes in the sun (`Bubbles` ≤ 0.3).
- **Camera:** `cam: T-ARM, yaw +30→+32, r 0.65→0.60 m, eye 0.75, f 1050, hy 900`.
- **Light:** the full B01 key; the warmest skin of the film.
- **Sound:** **hard return** on the cut frame: NG-A1 street and NG-M1 ukulele at the B01 level; NG-S1 pestle off frame.
- **Check:** reads as sunlight on skin at 270 px; arm above y 1160.

### S01-B05-SH03 — L14 "ออกจากดวงอาทิตย์มาตั้งแต่ 8 นาทีที่แล้ว" + hold
- **Staging:** the B01-SH01 staging exactly (VEN pounding, CUS seated facing the road, forearm on his knee, Moon at its pose-A place). Pestle and breath phases chosen so the last frame equals B01-SH01 frame 0.
- **Camera:** `cam: T-STALL, yaw +20→+24, r 2.45→2.80 m, eye 1.35, pitch +6°, f 1050, hy 980`, ease-out, **at pose A (yaw +24, r 2.80) and still for the last 30 f**.
- **Light:** B01.
- **Sound:** `stinger_pizz-tag-ending_01` (UT15) from the end of "…ที่แล้ว", peak about −10 dB, trimmed 1.4–2.2 s, 0.5–0.6 s fade, finished before the seam; ukulele ducks under it and returns under the seam; final ~0.5 s speech-free.
- **Check:** spike 8; `video.ending: 'B_loop'`, `endHoldSec: 0`.

## Look frames (W3, from the brief)

LF01 S01-B01-SH01 (soi, sunny afternoon; the loop frame) · LF02 S01-B02-SH01 (split frame, card 08:19) · LF03 S01-B04-SH02 (soi at night) · LF04 S01-B01-SH02 (space, frame just before the blink; SET-GW checked against it). Beat → look for the rows at W3: B01 LF01, B02 LF02, B03 LF02 (R1.2: all split; was LF04 with the 2017 cutaway), B04 LF03, B05 LF01. The row `look` column above names the location family of each shot.

## Sound NEEDS-GEN list (from the brief; generated at W4+ by the Editor)

NG-M1 sunny ukulele + shaker loop 100 bpm, 30 s, seamless · NG-M2 cold sparse slow pad, glass harmonics, 20 s · NG-M3 the M2 pad warmed, 8 s · NG-A1 sunny Bangkok soi afternoon, 12 s loop · NG-A2 still night street air, no insects, 10 s loop · NG-A3 thin airy space pad, 8 s · NG-S1 pestle in clay mortar with papaya crunch, 4 s loop · NG-S2 soft muffled pop + short reverse tail, 0.8 s · NG-S3 paper-fan flaps, 1.5 s · NG-S4 small motorbike pass, Doppler, 3 s · NG-S5 soft low whomp, 1.2 s · NG-S6 tiny glassy ping, 0.4 s · NG-S7 distant street dog barking twice, 2 s.

## Open items

- **Missing evidence:** no voice (lengths `est`); no blockout; every `new:` asset `missing`; CUS seated eye line estimated; `unknown`: stool via `drawChair`, `look-around` seated, `back` view seated.
- **Added beyond the brief's N-list:** `new: motorbike-pass` (B03-SH01, small; fallback: sound only; built as sound only). R1.2: `new: phone-watch`, `new: phone-screen`, `new: pocket-phone` (B03-SH05/SH04).
- **Boat picture checks at W3** (brief): news-front ring; Moon's lit half; Jupiter dark in the L12 diagram.

## Change log

- **EDU-EP07-ROWS-R1 (2026-11-08, Film W2.2):** first untimed storyboard pass from script R1.1 and brief EDU-EP07-BRIEF-R1: 18 shots with the brief's IDs and est lengths, per-shot staging, camera lines, casting lines, light, sound (library IDs and NG-*) and checks; rules R01–R09; Thai rows in review-rows.json (`untimed: true`). No render, no paint.
- **2026-11-08 (Film W5.1, EDU-EP07-SHEETS-R1):** timing moved to [scene-sheets.md](scene-sheets.md); R02 amended there (SD08: the card returns from the cutaway at 00:59, not under 00:30, at one constant rate); B04-SH05 pans right (SD06); the camera and staging values above are superseded where the sheet lists a deviation (SD01-SD10). Rows EDU-EP07-ROWS-R1.1.
- **2026-11-08 (Film W5.1 revision, EDU-EP07-SHEETS-R1.1):** user answers Q1 = c (L01 at G16, S01-B01-SH01 33 f), Q2 = a (D01 take kept, caption "ร้อนจังวันนี้"), Q3 = b (the clock jumps in the hidden 2017 cutaway and returns at 00:30; visible rate 9.09×). R02 holds as written again (card ≤ 00:30 on S01-B03-SH04's first frame); the R1 SD08 amendment is withdrawn. Total 1798 f; ranges in [scene-sheets.md](scene-sheets.md). Rows EDU-EP07-ROWS-R1.2.
- **2026-11-08 (Film W5.1, EDU-EP07-SHEETS-R1.2 / ROWS-R1.3, script R1.2):** L06–L07 retired, so S01-B03-SH02/SH03 (2017 merger, SET-GW) are retired (IDs not reused) and R05 with them; L05 re-voiced; new S01-B03-SH05 (V01 + L15: CUS laughs at a cat clip, no alert); S01-B03-SH04 restaged for L16 (last light front, phone pocketed, tick alone, the race); R02 amended (card always visible, under 02:00 in the phone beat, races from 00:30); R10 added (nothing warns before 00:00); B03 look LF02. 17 shots, 1580 f; every number in [scene-sheets.md](scene-sheets.md). Rows EDU-EP07-ROWS-R1.3 (ROWS-R1.2 was taken).
