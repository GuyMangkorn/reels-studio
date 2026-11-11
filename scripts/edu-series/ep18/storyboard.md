# Storyboard — EDU-EP18-SHORT (first pass, estimated timing)

Deliverable: `EDU-EP18-SHORT` (channel `edu`) · Revision: **EDU-EP18-ROWS-R1.1** (Film, 2026-11-11, W2 revision: Q-F1 striped ยุงลาย applied, Q-F2 kept; [change log](#change-log)); R1 was the first storyboard pass · Status: **draft for the user's storyboard review**; timing **estimated** until the W4 voice lock, so not `ready-for-dev` for plates (W5.1 re-pegs every frame on the locked read). Readiness is not user approval, runtime or visual proof.
Inputs: [script.md](script.md) EDU-EP18-SCRIPT-R1 + 2026-11-11 change log (user-approved W1.5) · [fact-check.md](fact-check.md) W1.3 + Recheck (pass; O1, O3, O4, O6, O8 as picture notes) · [film-brief.md](film-brief.md) **EDU-EP18-BRIEF-R1.1** (VD01–VD14, D01–D10) · task record [task.md](task.md).
Target: this worktree, branch `claude/yung-to-principle-sound-f742cb` at `279b31c` · 30 fps · **durationFrames 1575 (52.5 s, estimated)** · 1080×1920 · composition offset 0 (one scene, S01).
Evidence: nothing painted or rendered; projections computed with `scripts/shot-projection.py` (pinhole, f 1000 px ⇒ vfov 87.7°, f 1300 ⇒ 72.9°, hy 960) on the brief's estimated anchors; the balance numbers are fixed-plane design values; no audio exists (timing from the script's N1 model scaled to the warm Kore read at atempo 1.08).
Rows file: [review-rows.json](review-rows.json) **EDU-EP18-ROWS-R1.1** (Thai, `untimed: true`, first-pass rule). Review page: pending.

## Units, clocks and conventions

- Clocks: **global** `f` = composition frame (= scene-local, offset 0); **shot-local** `+n` = `f − shot start`. Ranges are half-open `[start, end)`. All frames are `estimated`: the script's N1 model (0.20 s per syllable, 0.5 s per "…" or line boundary, 0.3 s lead) scaled ×1.133 to the warm-style estimate (raw ≈ 45.2 s at atempo 1.08): **6.8 f per syllable, 17 f per pause**; V01 0.7 s, W-HIT 1.0 s, V02 0.8 s, W-BACK 0.8 s, beat gaps 0.3 s, W-END slap and hold 3.3 s. ±15 f per line; the W4 lock replaces them.
- Spaces and axes as in the brief's [projection contract](film-brief.md#projection-contract-and-scale-baseline): `H` SET-SOI18 (m; origin O on the lane under the awning lip's centre, +x right along the shopfront, +y up, +z out into the lane), `M` macro set (sm, k = 405 sm per real metre; origin O_M = `H` (1.02, 0.22, 0.50); ground y −89.1, puddle surface y −85.9), `Dl` drop-local (sm; origin at the drop's centre, axes as `M`; bottom face y −0.875), `I` feather insert (m), `D` fixed-plane diagram (px).
- `ycam` lines give `pos → pos, look-at → look-at, f` (and `near` when not 0.3); the move is eased (smoothstep) over the stated window. Fall coordinate `s` = how far (sm) a drop's centre is below its hit height.
- Screen: pixels, origin top-left, y down. Caption band y 1176–1344; faces, the mosquito, the drop's contact face, the shrink point, the puddle clue, the ruler's 20 mark and the slap above y 1160 ([caption-zone rule](film-brief.md#caption-zone-rule)); slots LBL (816–1020, 148–204) for OT01, LBL-W (300–1020, 236–330) for OT02; `@TamMaiLa` top-left (x < 330, y < 140 clear).
- Views: `front`, `back`, `left`, `right`, plus `below` (a front view seen from beneath, for figures pressed on a drop's underside), squared to the lens from the mid-shot camera.

## Casting

| Role | Casting line | Notes |
| --- | --- | --- |
| WOMAN | `woman-curly, P38, worried` + `new: tote-bag` (held over her head, `new: bag-over-head` arms), flip-flops | 1.62 m / 1.62 sm. Own kit outfit (brief D01). Poses by shot: P38 run (SH01–SH02) → hanging, head tilted up, `scared` (B01-SH03) → P45, `terrified` (B01-SH05) → P01 `surprised` → `relieved` (B01-SH06) → P45 at contact (B02-SH01) → `new: pressed-spread`, `scared` / `terrified` / `worried` (B02-SH02 → B04-SH01) → P09 hands on hips, `tired`, `idle-breathe` ×1.8 (B05-SH03) → `new: slap-ankle`, `angry` → `suspicious` (B05-SH06) |
| WOMAN voice | V01 "ไม่นะ!" (squeak of panic), V02 "อ๊ะ… อ๊ะ!" (short breathless yelps), V03 slap grunt (optional) | Editor's casting at the voice lock |
| Mosquito | `new: mosquito` as the striped Thai ยุงลาย (Q-F1, user 2026-11-11: black body and legs, white abdomen bands, white leg rings, thorax lyre; palette in the brief's VD03 table), states hover / pressed / tip / clear; no species name on screen ([species limit](film-brief.md#species-limit)) | Body 1 bl = 4.0 mm = her height. Look-defining asset, Film at W3 (brief N1) |
| Kit layers | ENV-FALL rain (`kit/fall.ts`) at full size; ENV-SKY; `water-drop.ts` bun | ENV-P02 |

## Shot map

| # | Shot | Beat | Lines | Range (global, est) | Len | Start s | Camera | One-line read |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | S01-B01-SH01 | B01 | W-OPEN, L01a | [0, 30) | 30 | 0.00 | `H` ankle height, near 0.02, push 0.03 m | A mosquito hanging steady in the downpour; her feet splash in |
| 2 | S01-B01-SH02 | B01 | L01b ("ยุง") | [30, 50) | 20 | 1.00 | `H` medium, push 0.2 m | She runs for the awning, tote over her head, and shrinks with a pop |
| 3 | S01-B01-SH03 | B01 | L02 | [50, 150) | 100 | 1.67 | `M` her eye height, tilt up 45° | Tiny, hanging in slow rain; a van-heavy drop above (OT02) |
| 4 | S01-B01-SH04 | B01 | L03 | [150, 258) | 108 | 5.00 | `M` side, arc 8° | A drop swallows the mosquito, carries it down; it flies back up |
| 5 | S01-B01-SH05 | B01 | V01 | [258, 284) | 26 | 8.60 | `M` low angle, push 0.15 sm | Her drop right above, arms up: "ไม่นะ!" |
| 6 | S01-B01-SH06 | B01 | L04 | [284, 390) | 106 | 9.47 | `D` balance, push 8 % | Her and the mosquito on a tiny balance: level |
| 7 | S01-B02-SH01 | B02 | W-HIT | [390, 425) | 35 | 13.00 | `M` side, push 0.3 sm | Slow motion: the drop meets them |
| 8 | S01-B02-SH02 | B02 | L05 | [425, 510) | 85 | 14.17 | `Dl` below, push 8 % | Both pressed on the drop's underside; the mosquito whole |
| 9 | S01-B02-SH03 | B02 | L06 | [510, 594) | 84 | 17.00 | `Dl` wide side, falling with the drop | The drop keeps falling at full speed; the soi streams up |
| 10 | S01-B02-SH04 | B02 | L07a | [594, 655) | 61 | 19.80 | `I` side, truck 0.18 m | A ball meets a feather; the feather just goes with it |
| 11 | S01-B02-SH05 | B02 | L07b | [655, 722) | 67 | 21.83 | `Dl` 3/4 below, arc 12° | Back: both riding loose |
| 12 | S01-B03-SH01 | B03 | L08 | [722, 822) | 100 | 24.07 | `Dl` over the rim, tilt down 65° | "แต่…" the ground and the puddle far below |
| 13 | S01-B03-SH02 | B03 | V02 | [822, 866) | 44 | 27.40 | `Dl` close below, push 6 % | Her hair flat on the water: "อ๊ะ… อ๊ะ!" |
| 14 | S01-B04-SH01 | B04 | L09 | [866, 976) | 110 | 28.87 | `Dl` 3/4 below, falling; ruler | Ticks of her body length stream past to 20 |
| 15 | S01-B04-SH02 | B04 | L10 | [976, 1100) | 124 | 32.53 | `M` high 3/4, falling | Cold "if": a mosquito hit low, the puddle rushes up; cut |
| 16 | S01-B05-SH01 | B05 | (silence), L11 | [1100, 1230) | 130 | 36.67 | `M` → `Dl` of D0, push in from the SH04 angle | Silence, rewind to the L03 hit; the mosquito rides loose |
| 17 | S01-B05-SH02 | B05 | L12 | [1230, 1327) | 97 | 41.00 | `Dl` of D0 close, f 1300, follow | It tips, slides off the side, flies; the drop splashes |
| 18 | S01-B05-SH03 | B05 | W-BACK | [1327, 1349) | 22 | 44.23 | `H` front medium, push 0.15 m | Full size under the awning, dry, panting |
| 19 | S01-B05-SH04 | B05 | L13a | [1349, 1414) | 65 | 44.97 | `H` ankle height, near 0.02, arc 8° | The mosquito hovering in the drip curtain at her ankle |
| 20 | S01-B05-SH05 | B05 | L13b | [1414, 1480) | 66 | 47.13 | `H` ankle height, tilt down 40° | Down past it to the puddle just below |
| 21 | S01-B05-SH06 | B05 | W-END (+ hold) | [1480, 1575) | 95 | 49.33 | `H` front medium-wide, push 5 % | She slaps her ankle and misses; it drifts on; hold |

## Voice and subtitle cues (global, estimated)

| Cue | Line | Thai (VO, subtitle = VO) | Range | Shots |
| --- | --- | --- | --- | --- |
| C01 | L01 | ถ้าคุณตัวเท่ายุง… | [10, 44) (+ pause to 61) | 1–3 |
| C02 | L02 | ฝนเม็ดใหญ่ที่สุด หนักราวรถตู้ | [78, 139) | 3 |
| C03 | L03 | แต่ยุงโดนเม็ดแบบนี้ตรง ๆ… ก็ยังรอด | [156, 248) | 4 |
| C04 | V01 (WOMAN) | ไม่นะ! | [265, 286) | 5–6 |
| C05 | L04 | เพราะหดทั้งตัว… คุณก็เบาเท่ายุงด้วย | [286, 371) | 6 |
| C06 | L05 | โดนเต็ม ๆ… ยุงก็ไม่แบนนะ | [427, 498) | 8 |
| C07 | L06 | มันเบาจน เม็ดฝนแทบไม่ช้าลงเลย | [515, 583) | 9 |
| C08 | L07 | เหมือนขนนกโดนลูกบอล… ไม่ต้าน แค่ไปกับมัน | [600, 699) | 10–11 |
| C09 | L08 | แต่… เม็ดฝนไม่หยุดนะ มันพาคุณดิ่งลงพื้น | [725, 823) | 12 |
| C10 | V02 (WOMAN) | อ๊ะ… อ๊ะ! | [826, 850) | 13 |
| C11 | L09 | ติดหน้าเม็ดฝนลงไป ได้ไกลถึงยี่สิบเท่าตัวคุณ | [876, 972) | 14 |
| C12 | L10 | ถ้าโดนตอนบินต่ำ ๆ ใกล้พื้น… ก็อาจหลุดออกไม่ทัน | [989, 1101) | 15 |
| C13 | L11 | ทางรอดของยุง… คือไม่ต้าน แต่ไปกับมัน | [1127, 1219) | 16 |
| C14 | L12 | แล้วเอียงตัว… ไหลหลุดออกข้าง ๆ ก่อนถึงพื้น | [1236, 1327) | 17 |
| C15 | L13 | เม็ดฝนฆ่ายุงไม่ได้หรอก… ที่อาจเล่นงานมัน คือพื้นข้างล่าง | [1351, 1477) | 19–20 |
| — | V03 (WOMAN, optional) | ฮึ่ย! (no subtitle) | [1500, 1512) | 21 |

## On-screen text (global ranges, estimated)

| ID | Text | Range | Slot |
| --- | --- | --- | --- |
| OT01 | ภาพจำลอง | [38, 1327) (the shrink start to W-BACK) | LBL |
| OT02 | เม็ดใหญ่สุด หนักได้ถึง 50 เท่าของยุง | [84, 150) | LBL-W (two lines allowed) |
| OT03 | 20 เท่าความยาวตัว | [930, 976) | world-anchored to the ruler's 20th mark, leader 1 px |

## Rules for every shot

- **R01 Labels.** OT01 visible in every frame from f 38 to f 1326, per the brief's [truth limits](film-brief.md#truth-limits); none before the shrink or after W-BACK.
- **R02 Truth limits.** As the brief: her fate never shown (off screen from B04-SH02 to W-BACK), the mosquito never touches the puddle, no bounce at L03, legs not wings at L12, bun-shaped drops at true relative size, no slow-down at the hit, the ride never beyond 20 units with anyone on it, no number except OT02/OT03; the mosquito drawn as the striped ยุงลาย with no species name or study wording on screen, OT01 exactly "ภาพจำลอง" ([species limit](film-brief.md#species-limit)).
- **R03 Size reference.** Every shot keeps one: her or the awning (`H`), the drop or her (`M`), the ruler (B04-SH01), the puddle (B04-SH02), the ball (B02-SH04), the pans (B01-SH06).
- **R04 Contact.** At full size her feet on the lane (y 0) or the step (y 0.10); in `Dl` the passengers within 0.02 sm of the drop's face; the mosquito ≥ 1.0 sm above the puddle in `M` and ≥ 0.15 m above it in `H`.
- **R05 Screen.** Faces, the mosquito and the hero details above y 1160; the caption band calm per the brief's rule.
- **R06 Ambient clocks.** Rain (ENV-FALL), drip curtain, ripples, drop wobble, wingbeat (1.3 Hz in `M`, blur fan in `H`), idle-breathe and slow far drops run on ambient clocks; event clocks (run, shrink, `s(t)`, contact, ticks, tip angle, splash, slap) are shot-local (DF-20261030-painted-story-hold-ambient-clock).
- **R07 Continuity.** The tote over her head until the shrink, on her left shoulder after W-BACK; the mosquito on her +x side at the ankle; the shop glow behind the drops; the D1 passenger positions fixed from B02-SH02 to B04-SH01; grade by chapter (neutral B01–B02, cool B03–B04, coldest B04-SH02, warm B05).

## Per-shot staging

Key frames shot-local `+n`, all estimated. Sound lines give the shot-local frame and a description (source, action, material, space, length, feeling); the codes and library candidates are in the brief's [Sound direction](film-brief.md#sound-direction); every library ID is "not listened" and Ton checks it against its description before use. Editor sets levels.

**1. S01-B01-SH01** [0, 30), 30 f. VO C01 +10–+30 ("ถ้าคุณตัวเท่า").
- Camera: `ycam (H): pos (1.13, 0.16, 0.66) → (1.15, 0.165, 0.69), look-at (1.85, 0.34, 1.45) → (1.70, 0.30, 1.30), f 1000, near 0.02`; push and pan +0–+29. Computed at +0: the mosquito (1.19, 0.20, 0.71) at (411, 639), 0.08 m from the lens, body ≈ 50 px, leg span ≈ 140 px; her leading heel at (1.62, 0, 1.22) → (561, 1358), knee (559, 716), hip (558, 356): her leg fills the frame centre behind it.
- Staging: `H`. The mosquito (striped ยุงลาย: black body with white abdomen bands, white rings on the long hanging legs; the white marks catch the cool sky) `hover`, `left` view (head toward −x), steady in place while rain streaks (ENV-FALL, near streaks 4–6 px wide) pour past it and splash on the concrete below; behind it her flip-flop feet run in from the frame right toward the awning (P38 `run`, `left`), one splash crown per footfall (+4, +14, +24); the puddle is behind the camera. The shop glow warms the far left edge; the mosquito's wings are a soft blur fan with a warm rim.
- Key frames: +0 reads "a mosquito hanging steady in a downpour at ankle height" (UT01, K02); +24 her foot lands 0.3 m behind it.
- Sound: rain A1 (tin awning, behind) and A2 (soi floor) at full from +0; W1 whine close and centre-left from +0, swaying; flip-flop footsteps (running flip-flops on wet concrete through shallow water: slaps and splashes, four quick steps, 1.2 s, close, hurry) on the footfalls +4, +14, +24. No music.
- Entry → exit: +0 the mosquito close → +29 her leg passing behind it.

**2. S01-B01-SH02** [30, 50), 20 f. VO C01 "ยุง" +7–+14, then the pause.
- Camera: `ycam (H): pos (-0.40, 1.05, 3.40) → (-0.30, 1.02, 3.20), look-at (1.10, 0.62, 0.80) → (1.05, 0.55, 0.70), f 1000`; push +0–+19 (the set at about 40° to the lens). Computed at +0: her feet (1.45, 0, 1.15) → (700, 1171), head (713, 608), **563 px**; at +8 (feet (1.25, 0, 0.95)) 599 px; P_S (1.02, 0.22, 0.50) → (474, 1070); the puddle centre (413, 1133), its back edge (375, 1106) (**K01 above y 1160**); awning lip (78, 368); the shop door glow (44, 826).
- Staging: `H`. WOMAN `woman-curly`, P38 run + `new: bag-over-head` (tote held flat over her head by its two corners), `worried`, view `left` (running toward −x, the lens on her front-left: three-quarter read by `headCock`), mid-step at +8 with the left foot forward; the mosquito (≈ 6 px at 3.3 m: a dark speck with a blur fan) at her right ankle. The drip curtain falls off the lip into the filling puddle; the shop glow inside the half-up shutter; crates, motorbike under its cover, LED lamp across the lane (UT12). **Shrink** (VD05): her card scales about P_S over +8–+16 (ease-in, `shrinkScale`), the tote with her; the puff ring and 6–8 sparkle ticks from P_S +12–+20 (ENV-GLOW ≤ 0.3); **cut at +20 on the puff's peak**. OT01 "ภาพจำลอง" in LBL from +8.
- Key frames: +6 LF01; +8 shrink starts on "ยุง"; +19 the puff at its peak around P_S.
- Sound: S1 shrink at +8 (a fast pitch zip: the full-size rain and whine smear upward as she shrinks, ending in a soft round pop and a breath of air on the puff peak, 0.9 s, uncanny); A1/A2 and W1 smear into it and are gone by the cut.
- Entry → exit: +0 running → +19 the puff where she was.

**3. S01-B01-SH03** [50, 150), 100 f. VO C02 +28–+89 ("ฝนเม็ดใหญ่ที่สุด" +28–+62, "รถตู้" +76–+89).
- Camera: `ycam (M): pos (-0.35, -0.10, 3.30) → (-0.40, -0.95, 3.60), look-at (-0.55, 0.25, 0) → (-0.30, 1.55, 0), f 1000`; hold +0–+20 at her eye height, **tilt up and drop back** +20–+80 (the hook's scale move), hold +80–+99. Computed at +0: her feet (478, 1287), head (481, 796), 491 px; the mosquito (848, 1019). At +99: her head (426, 1112) feet (391, 1598) (487 px, her face above 1160), the mosquito (751, 1311); drop D1 centre (−0.15, 3.30, 0) → (568, 694), bun x 335–798 (**≈ 463–487 px wide**), top y 594, bottom y 813.
- Staging: `M`. The puff fades around her at the same screen point as SH02's P_S (±40 px) +0–+10. WOMAN hanging (slow-motion free fall under 0.1 sm), `front`, arms loose, the tote gone (lost in the shrink: it is not shown in `M`), `scared`, head tilting up +20–+40. The mosquito `hover`, `left` (facing her), 1.2 sm to her right at (0.45, 0.05, 0), wings beating slowly (1.3 Hz). Slow rain everywhere: small buns hanging and drifting down at 3–9 sm/s, far ones as soft discs; warm shop bokeh behind. D1 descends from y_c 5.6 → 3.3 over the shot (1.4 sm/s on screen: the slowest point of the slow motion, so it looms), wobbling (axis ratio 0.70 ± 0.04), the inverted shop glowing inside. OT02 in LBL-W +34–+99.
- Key frames: +10 her face clear, looking up; +60 the whole bun in frame above her; +90 LF02.
- Sound: A3 slowed giant rain from +0 (deep distant soft booms, a low hush); W2 slowed wingbeat (deep soft thrum-thrum about 2 per second, airy) from +0, to her right; D1 the drop overhead (a vast water mass descending: deep slow wobbling "wub", a soft low roar of pushed air, 3 s) from +30; M0 (one low bowed double-bass note with a soft swell, 2.2 s, ominous not horror) at +28 under "ฝนเม็ดใหญ่ที่สุด".
- Entry → exit: +0 her at eye height in hanging rain → +99 the drop above her, her below.

**4. S01-B01-SH04** [150, 258), 108 f. VO C03 +6–+98 ("โดน" +20, "ก็ยังรอด" +78–+98).
- Camera: `ycam (M): pos (1.30, -0.10, 4.70) → (1.05, -0.15, 4.60), look-at (0.75, 0.75, -0.10) → (0.80, 0.50, -0.10), f 1000`; arc 8° +0–+107. Computed at +0: the mosquito (1.6, 0.1, −0.2) at (718, 1094); D0 bottom (736, 700), bun x 496–985; WOMAN (−0.75, 0, 0) at the left edge, head (239, 951), feet (221, 1289), 338 px (witness; recorded exception).
- Staging: `M`. The mosquito has drifted to (1.60, 0.10, −0.20), `hover`, `right`. D0 (bun 2.51 × 1.75 sm, centre x 1.75, z −0.20) falls at 9 sm/s and its bottom face meets the mosquito's back at **+20** (f 170, "โดน"): the mosquito is swallowed onto its underside (`pressed`, legs splayed) and **carried down out of the frame bottom** by +34 (O3: not a bounce). WOMAN `front`, `scared`, turns her head to watch (`headCock` toward +x). +60–+86: the mosquito flies **back up** into frame from below, `clear`, whole, wings beating, to (1.4, 0.2, −0.2) by +98 on "ก็ยังรอด"; she stares.
- Key frames: +20 contact; +34 gone below; +86 back, whole.
- Sound: H1 at +20 (a deep soft wet "gloomp": a huge water body swallowing something small, muffled, round, no crack, 0.6 s, surprising not violent); W2 drops away with the mosquito (+20–+34, falling in pitch slightly) and returns unbroken at +60 as it flies back up (the joke); A3 under.
- Entry → exit: +0 mosquito beside her, a drop above it → +107 the mosquito back, whole.

**5. S01-B01-SH05** [258, 284), 26 f. V01 +7–+28.
- Camera: `ycam (M): pos (-0.55, -1.80, 1.45) → (-0.55, -1.72, 1.32), look-at (-0.75, 0.90, 0) fixed, f 1000`; push +0–+25. Computed: her feet (540, 1480), head (540, 974), 506 px; D1's bottom face (679, 787), bun x 414–954 at y_c 3.18, filling the upper frame.
- Staging: `M`. Low angle from below her. WOMAN P45 hands up (palms toward the drop), `terrified`, `front`; D1 right above, its flat bottom 1.1 sm over her hands, the inverted shop glowing in it, a highlight sliding across as it wobbles. The mosquito at the frame right edge (≈ 980, 1150).
- Key frames: +8 the scream; +20 the drop's shadow-tint darkens her face slightly (cool).
- Sound: V01 +7; D1 continues, closer (+3 dB); A3 under.
- Entry → exit: +0 looking up at her → +25 tighter, the drop overhead.

**6. S01-B01-SH06** [284, 390), 106 f. VO C05 +2–+87 ("เบาเท่ายุง" +60–+80).
- Camera: `D` fixed plane, push 8 % about (540, 820) +0–+105 (brush-space push: a diagram, recorded reason).
- Staging: `D` (VD08). Macro backdrop soft (the shop bokeh, slow far drops, D1 soft at the top y 0–260). A small brass balance: pivot (540, 640), beam 700 px, pans 260 px wide 300 px below each end; WOMAN `front`, P01, `surprised` standing in the left pan (≈ 300 px); the mosquito `right`, legs on the right pan, body ≈ 300 px. The figures **drop into the pans** at +4 (left) and +8 (right); the beam wobbles ±4° (decaying, 1.4 Hz) and **settles level by +60** on "เบาเท่ายุง"; at +70 her face goes `relieved`. Recorded lead exception (diagram).
- Key frames: +60 level; +80 her relief.
- Sound: B1 brass balance at +4 (a light clink as the pans take the weight, a soft beam wobble with two small ticks, settling level, 0.8 s, dry, "equal"); **M1-thin enters at +46** ("คุณก็…": kalimba and muted bass, curious, low energy); A3 −6 dB.
- Entry → exit: +0 empty balance → +105 level, her relieved.

**7. S01-B02-SH01** [390, 425), 35 f. W-HIT (no VO).
- Camera: `ycam (M): pos (0.20, 0.60, 3.10) → (0.15, 0.62, 2.80), look-at (-0.20, 0.90, 0) fixed, f 1000`; push +0–+34. Computed: her feet (361, 1521), head (370, 990), 531 px; hands (372, 867); the mosquito (757, 1242) (in the band: its wings above y 1160, body crossing the band edge; acceptable 1 s, the contact point above); D1's bottom at contact (556, 862).
- Staging: `M`, slow motion. D1 (centre x −0.15) descends at a constant 9 sm/s: its bottom face reaches her raised palms (P45) at **+15** (f 405) and the mosquito's back at +18; ripple rings spread across the bottom face from both contacts; her arms fold, body starting to tip back (cut-on-action into SH02's pressed pose). The drop's speed does not change through the contact (R02).
- Key frames: +15 contact (hands); +18 contact (mosquito); +34 both under the face.
- Sound: near-silence +0–+14 (A3 at −30 dB, W2 out); **H2 at +15** (one soft, heavy, watery "whump" with a slow low swell under it, the hush returning, 1.2 s, all around: the big moment, no crash).
- Entry → exit: +0 the drop about to arrive → +34 both swallowed under its face.

**8. S01-B02-SH02** [425, 510), 85 f. VO C06 +2–+73 ("ไม่แบน" +53–+66).
- Camera: `ycam (Dl of D1): pos (0.10, -3.00, 1.60) → (0.05, -2.75, 1.45), look-at (0, -0.95, 0) fixed, f 1000` (looking up at about 50°); push +0–+84. Computed at +0: her head (−0.81, −0.99, −0.42) → (267, 1098), feet (838, 1073), **572 px**; the mosquito head (191, 845), tail (877, 808); the bottom face spans the frame (rim at y ≈ 764–806 at x 173–917).
- Staging: `Dl`. Both on the drop's flat bottom face, faces down toward the lens: WOMAN `new: pressed-spread`, `below`, `scared`, arms and legs spread, hair fanned flat on the water; the mosquito `pressed`, `below`, whole, legs splayed radially, wings folded back; a shallow dimple under each (N2). Through the water above them the inverted shop glow and the rim highlight; slow far drops drift past below (moving up: the camera falls with D1). At +55 the mosquito's legs flex once (alive).
- Key frames: +40 LF03; +60 "ไม่แบน": the mosquito whole and round, not flat.
- Sound: F1 fall rush enters low (a steady broadband air rush, constant pitch, slight flutter, 6 s loop: momentum) at −12 dB; **M1-relief** from +38 (kalimba + pizzicato); W2 faint and muffled (wings pinned).
- Entry → exit: +0 both under the water ceiling → +84 closer, the mosquito whole.

**9. S01-B02-SH03** [510, 594), 84 f. VO C07 +5–+73 ("ไม่ช้าลง" +46–+66).
- Camera: `ycam (Dl of D1): pos (2.00, 0.30, 6.60) → (1.60, 0.00, 6.00), look-at (0, -0.60, 0) fixed, f 1000`; arc and push +0–+83 while falling with D1. Computed: the bun x 375–724 (≈ 350 px), the passengers at its bottom (≈ 540, 1010). Recorded lead exception (the drop is the subject).
- Staging: `Dl` (falling at 9 sm/s). D1 wide, its passengers small on its underside; the world streams **upward** past it at a constant 0.30 sm per frame: slow far drops, the shop bokeh, a faint vertical drip-curtain stream far behind; the ripple where they hit has already faded to one faint ring (+0–+20) ("barely a ripple"). A thin cream speed-line guide of 3 far drops moving up at the same rate shows the speed is constant (no slow-down).
- Key frames: +46 "ไม่ช้าลง": the streaming speed visibly unchanged since +0.
- Sound: F1 at −6 dB, steady; M1-relief continues; A3 under.
- Entry → exit: +0 wide on the falling drop → +83 closer, still falling at the same speed.

**10. S01-B02-SH04** [594, 655), 61 f. VO C08a +6–+47 ("ขนนก" +13–+26, "โดน" +27).
- Camera: `ycam (I): pos (0.00, 0.05, 0.45) → (0.18, 0.05, 0.45), look-at (0, 0, 0) → (0.18, 0, 0), f 1000`; truck +0–+60 with the ball. Ball 6.5 cm at 0.45 m ≈ 144 px; feather 6 cm ≈ 133 px. Recorded lead exception (insert, no person).
- Staging: `I`, slow motion ×20, at full size under the awning (background: the shop glow and the drip curtain out of focus, soft). The feather hangs turning slowly at (0, 0, 0); the red rubber ball enters from x −0.60 at 0.30 m/s on screen and meets it at **+27** ("โดน"); the feather folds onto the ball's front and travels with it at the ball's speed (no deflection, no bounce); both move +x to the frame right by +60. OT01 stays.
- Key frames: +27 contact; +45 the feather riding the ball's front.
- Sound: K1: the ball's light air pass (+10–+40, left to right, short airy swish, candidate `whoosh_air-swish-rising_01`) and a tiny soft feather flutter at +27 (0.4 s, dry, close); **no impact sound** (D06); M1 brightens to **M1-bright** at +0; A1 low-passed far behind (we are at full size under the awning: the tin rain heard softly).
- Entry → exit: +0 the feather alone → +60 the feather riding the ball.

**11. S01-B02-SH05** [655, 722), 67 f. VO C08b +3–+44 ("ไม่ต้าน" +3–+17, "ไปกับมัน" +24–+44).
- Camera: `ycam (Dl of D1): pos (1.35, -2.20, 1.90) → (0.90, -2.35, 2.40), look-at (0, -0.95, 0) fixed, f 1000`; arc 12° +0–+66. Computed at +0: her head (415, 1085), feet (899, 950), **502 px**; the mosquito (218, 984) → (760, 767).
- Staging: `Dl`. Both riding loose on the underside: WOMAN `pressed-spread`, `worried` → calmer, arms relaxing; the mosquito `pressed`, legs loose (not pushing). The world streams up behind (constant speed).
- Key frames: +17 "ไม่ต้าน": both bodies loose; +44 the refrain lands.
- Sound: M1-bright plays to its phrase end at +44 and stops clean; F1 −6 dB; **S4 riser** from +37 (a light airy riser, breath and a thin rising tone, not dark, 1.0 s) stopping dead on f 725 (B03-SH01 +3).
- Entry → exit: +0 3/4 from below → +66 arc toward the front.

**12. S01-B03-SH01** [722, 822), 100 f. VO C09 +3–+101 ("แต่…" +3, "ดิ่งลงพื้น" +81–+101).
- Camera: `ycam (Dl of D1): pos (1.90, -0.60, 1.40) → (1.75, -0.20, 1.30), look-at (0, -1.0, 0) → (0.30, -40.0, 0.60), f 1000`; hold +0–+20, **swing over the rim and tilt down ≈ 65°** +20–+75 (the rehook's reveal), hold +75–+99 while falling. At +99 the puddle surface is 70 sm below the lens (s ≈ 16 at this point), the puddle (486 × 292 sm) fills the lower two thirds of the frame; the drop's rim and the passengers' heads at the top edge (y ≈ 120–420).
- Staging: `Dl`, cool grade from +0. Looking down past the drop's rim: the soi ground far below, the puddle (K01) a lake with the warm shop reflection streak and ripple rings, the step edge and a crate's corner at the far edge; slow drops falling below them, smaller with distance, toward the lake. The passengers at the top of frame, her hair fanned.
- Key frames: +3 "แต่…"; +75 the ground fully revealed; +90 LF04.
- Sound: S4's stop at +3; M1 out; **F1 louder and lower** (0 dB, low shelf +4 dB) from +3, the rush swelling; A3 under.
- Entry → exit: +0 beside the rim → +99 straight down at the ground coming up.

**13. S01-B03-SH02** [822, 866), 44 f. V02 +4–+28.
- Camera: `ycam (Dl of D1): pos (-0.80, -1.95, 0.30) → (-0.78, -1.88, 0.20), look-at (-0.60, -0.99, -0.42) fixed, f 1000`; push +0–+43. Computed: her head (−0.81, −0.99, −0.42) at (369, 922), neck (524, 957), 1.18 sm from the lens: head ≈ 330 px; her body runs off the frame right.
- Staging: `Dl`, cool grade. Close on her from below: `pressed-spread`, `below`, `terrified`, hair flat and fanned on the water, fingers splayed against it, holding on; the lake far below reflected faintly in the water above her.
- Key frames: +4 "อ๊ะ"; +18 "อ๊ะ!"
- Sound: V02 +4; F1 0 dB.
- Entry → exit: +0 close on her face → +43 closer.

**14. S01-B04-SH01** [866, 976), 110 f. VO C11 +10–+106 ("ยี่สิบเท่า" +71–+92).
- Camera: `ycam (Dl of D1): pos (0.60, -3.30, 3.00) → (0.55, -3.10, 2.85), look-at (0.80, -1.20, 0) fixed, f 1000`, falling with D1. Computed: her head (136, 962), feet (536, 977): **400 px** (recorded exception: the ruler shot); the mosquito (75, 814) → (551, 836); the ruler at `M` x +2.0 (Dl x 2.15) passes through (887, 920) at the face's height.
- Staging: `Dl`, cool grade. Both riding (her `worried`); beside the fall the ruler (N11): a slim cream bar with a tick every 1.62 sm and a tiny her-silhouette at the first unit; ticks stream **upward** past the drop's bottom face at 0.30 sm/f (one tick every 5.4 f). The face passes tick 7 at +0 and tick **20 at +78** (f 944, on "ยี่สิบ"): the 20th tick is brighter `#ffd34a`; OT03 "20 เท่าความยาวตัว" world-anchored beside it +64–+109. The camera keeps falling with the drop; tick 20 rises toward the upper frame by +109 (y ≈ 300). Nobody is shown below tick 20 on the drop beyond this shot (R02).
- Key frames: +78 tick 20 at the face; +95 OT03 read.
- Sound: **M1b** pulse from +0 (low muted pizzicato eighths at 96 bpm with a soft clock tick, rising slightly); T1 ruler ticks (one soft dry wooden tick, 0.08 s) on every tick passing the face (+0, +5, +11 … every 5.4 f), the 20th at +78 a soft glass tick; F1 −4 dB.
- Entry → exit: +0 ticks streaming → +109 tick 20 above them.

**15. S01-B04-SH02** [976, 1100), 124 f. VO C12 +13–+125 ("ใกล้พื้น" +54–+67, "ไม่ทัน" +111–+125).
- Camera: `ycam (M, hypothetical, origin at the hit point 21 sm above the puddle): pos (1.60, 2.20, 3.20) → falling with the drop from +56, look-at (0, -4.0, 0) → (0, -10.0, 0), f 1000`. Computed at +0 (mosquito (0, −0.95, 0) in its own drop-local sense = hovering at the hit point): the mosquito at (540, 622), the puddle surface (21 sm below) at y ≈ 1151 centre, filling the lower frame.
- Staging: `M`, **coldest grade** (−20 % saturation). A mosquito alone (`hover`, `right`) flying low 21 sm (5 cm) above the puddle; drop D2 (same bun) descends into frame top +20–+56 and hits it at **+56** ("ใกล้พื้น"); `pressed` on its underside, carried down at 9 sm/s; the camera falls with them and the puddle surface (ripple rings, the warm reflection gone cold) rushes up and fills the frame; **cut at +124 with the drop's face 1.0 sm (2.5 mm) above the water** (D2, O6): no contact, no splash, no pinned mosquito. Her nowhere.
- Key frames: +56 the hit; +110 the water filling the frame; +123 last frame (gap 1.0 sm).
- Sound: A3 low-passed about 500 Hz, −4 dB; M1b swelling (+3 dB over the shot); F1 rising; **cut to hard silence at +124** (everything off, 12 f, into B05-SH01).
- Entry → exit: +0 a mosquito low over the water → +123 the water rushing up; cut.

**16. S01-B05-SH01** [1100, 1230), 130 f. Silence +0–+12, rewind +12–+25; VO C13 +27–+119 ("ไม่ต้าน" +78–+92, "ไปกับมัน" +99–+119).
- Camera: +0–+25 the B01-SH04 camera at its +34 frame (`ycam (M): pos (1.05, -0.15, 4.60), look-at (0.80, 0.50, -0.10)`); +25–+70 one continuous push and descent onto D0: → `ycam (Dl of D0): pos (0.45, -1.55, 2.35), look-at (0, -0.95, 0), f 1000 → 1300` (lens change eased with the push); +70–+129 falling with D0, arc 6°. Computed at +70: the mosquito (`pressed`, body along x on D0's underside, head (−0.81, −0.95, 0)) from (144, 978) to (986, 939): **843 px**; D0's right rim (1199, 539).
- Staging: +0–+12 frozen on B01-SH04's frame at +34 (D0 has just carried the mosquito down out of frame), warm grade returning; +12–+25 **rewind** (in-canvas reverse play of B01-SH04 +34 → +14: the mosquito flies back up out of the drop into its hover, the drop rises) — then forward again in slow motion: D0 meets it (+25 = its contact), and the camera follows down onto D0's underside. WOMAN: in the frozen frame she is at the left edge as in SH04; from +25 the camera leaves her and she is out of frame for the rest of the video (D08). The mosquito rides loose (`pressed`, legs relaxed, not pushing), D0's fall coordinate s 0 → 13 sm (8 bl) by +129, the world streaming up.
- Key frames: +12 rewind begins; +25 the replay's contact; +92 "ไม่ต้าน": loose.
- Sound: hard silence +0–+12; **S3 rewind** +12 (fast reverse sweep rising, stops abruptly on +25; candidate `reveal_rewind-whirr_01`); H1 again at +25, softer (−6 dB: the same hit, remembered); F1 −8 dB (gentler); **M1-thin returns at +27**, calm.
- Entry → exit: +0 the L03 frame, frozen → +129 close on the mosquito riding D0.

**17. S01-B05-SH02** [1230, 1327), 97 f. VO C14 +6–+97 ("เอียงตัว" +13–+26, "ไหลหลุดออกข้าง ๆ" +43–+77, "ก่อนถึงพื้น" +77–+97).
- Camera: `ycam (Dl of D0): pos (0.45, -1.55, 2.35) → (1.30, -1.20, 2.40), look-at (0, -0.95, 0) → (1.00, -1.10, 0), f 1300`; follow the mosquito +13–+70; from +60 the camera **stops falling** (holds its height in `M`) while D0 drops away below. Computed at +60: the mosquito leaving the rim, head (0.6, −1.4, 0.1) → (314, 1124), tail (2.0, −0.9, 0.1) → (1117, 837); rim (673, 478).
- Staging: `Dl`, warm grade (shop glow +15 % behind). The mosquito alone on D0: +13 it spreads its long legs wide (`tip`; legs, not wings: O1), the air catches them and it **rolls about its right legs** (+13–+43, 0° → 35°), **slides off the side** across the rim (+43–+60, s 18 → 22.7 sm = 14 bl), clear at +60; wings open +62, `clear`, it flies up and away to the frame right (+62–+96). D0 rushes on below, speeding up (the slow motion ramps out: 9 → about 50 sm/s, +60–+96) and **splashes into the puddle at +97** (a small crown far below, frame bottom centre, ≈ 120 px) — the hard cut lands on the splash. No one on D0.
- Key frames: +13 legs spread; +40 LF05; +60 clear of the rim; +96 the drop hits the water far below.
- Sound: S5 slide-off at +43 (a soft wet peel: a thin water film letting go of a small body with a tiny "shlip", then a light air swish as it tips away, 0.6 s, release); W2 wingbeat returns at +62 and flies off right (doppler down); **M1-relief** from +0, rising to its last phrase; F1 falls away with D0 (+60–+96); **P1 splash at +97** = the cut frame (a heavy drop landing in a puddle heard from above at mosquito scale: deep round splash with a crown, slowed, short low tail, 1.0 s) with **M1 hard stop** on the same frame.
- Entry → exit: +0 riding loose → +96 the mosquito flying free, the drop splashing far below.

**18. S01-B05-SH03** [1327, 1349), 22 f. W-BACK (no VO).
- Camera: `ycam (H): pos (0.80, 1.32, 2.05) → (0.78, 1.30, 1.90), look-at (0.55, 1.02, -0.12) fixed, f 1000`; push +0–+21. Computed: her feet (0.55, 0.10, −0.12) → (540, 1351), head (540, 631), face (540, 714): **720 px**.
- Staging: `H`, normal grade, OT01 off from +0. WOMAN at mark W on the step edge, `front`, P09 hands on hips, `tired`, panting (`idle-breathe` ×1.8), hair dry, the tote on her left shoulder; the drip curtain falling 12+ cm in front of her toes; the shop glow behind her (rim), the lamp across the lane. The what-if is over; her fate on the drop is not shown or said.
- Key frames: +0 hard cut on the splash; +10 her breath.
- Sound: S2 return at +0 (a low slowed rumble zipping up to normal speed and pitch in 0.5 s, landing exactly on the full-size rain), A1 + A2 back at full on +0; W1 whine faint from +10.
- Entry → exit: +0 full size, panting → +21 a breath slower.

**19. S01-B05-SH04** [1349, 1414), 65 f. VO C15a +2–+50 ("ฆ่ายุงไม่ได้" +16–+43).
- Camera: `ycam (H): pos (0.71, 0.19, 0.13) → (0.74, 0.19, 0.12), look-at (0.55, 0.14, -0.14) → (0.57, 0.14, -0.14), f 1000, near 0.02`; arc 8° +0–+64. Computed: the mosquito (0.66, 0.17, 0.06) at (457, 1031), 0.09 m: body ≈ 44 px, leg span ≈ 120 px (**above 1160**); her ankle (596, 837); her toe at the step edge (368, 1195); the puddle surface below frame (y > 1920 at the mosquito's x).
- Staging: `H`. The mosquito `hover`, `left` (facing her ankle), steady at (0.66, 0.17, 0.06) **inside the drip curtain**: streams and drops from the awning lip fall past it and around it (one stream 2 cm to its left, drops crossing behind it) and it keeps hovering, untouched (L13a, CL02 as said: the hit does not kill it; no hit drawn at this scale). Her bare ankle and flip-flop behind it, the step's wet edge.
- Key frames: +30 LF06.
- Sound: A1 + A2 at full size, ducked under NAR; W1 whine close, centre-left, steady; no music.
- Entry → exit: +0 the mosquito in the curtain → +64 arc 8°.

**20. S01-B05-SH05** [1414, 1480), 66 f. VO C15b +2–+63 ("พื้นข้างล่าง" +36–+63).
- Camera: `ycam (H): pos (0.74, 0.19, 0.12) → (0.74, 0.26, 0.20), look-at (0.57, 0.14, -0.14) → (0.66, 0.02, 0.10), f 1000, near 0.02`; **tilt down ≈ 40°** and rise +5–+50, hold +50–+65. Computed at +65: the mosquito (702, 324) at the top of frame; the puddle surface (0.66, 0.008, 0.10) at (540, 980), (0.75, 0.008, 0.30) at (241, 2017): the water fills the frame below it, ripple rings from the curtain's drops, the warm reflection streak.
- Staging: `H`. Down past the mosquito to the puddle 16 cm below it (K01 paid): the water's surface, rings and splash crowns where the curtain lands (EP14 method). The mosquito stays at the top of frame, hovering, never descending (O6). The cool lamp glints on the ripples.
- Key frames: +36 "พื้น": the water fills the frame under the mosquito.
- Sound: A2's puddle plops forward (+2 dB), W1 above; no music.
- Entry → exit: +0 level with the mosquito → +65 looking down at the puddle, the mosquito at the top.

**21. S01-B05-SH06** [1480, 1575), 95 f. W-END: slap +18, V03 (optional) +20–+32, hold to +94.
- Camera: `ycam (H): pos (1.05, 0.95, 2.30) → (1.00, 0.93, 2.18), look-at (0.62, 0.50, -0.10) fixed, f 1000`; push 5 % +0–+94. Computed: her feet (515, 1110), head (511, 433): **677 px**; the mosquito (0.66, 0.17, 0.06) at (545, 1109) (**above 1160**), its end point (0.80, 0.32, 0.20) at (597, 1068).
- Staging: `H`. WOMAN at W, `front`, `new: slap-ankle`: +0–+14 she spots it and bends (hip 35°), `angry`; **+18 slaps her left ankle with her right hand** (the hand lands on the ankle point (0.58, 0.18, −0.12)); the mosquito has already drifted up and right by 6 cm (+12–+22) to (0.72, 0.23, 0.10), untouched; +22–+40 she straightens, looks at her empty palm, then at it, `suspicious`; +40–+94 the mosquito drifts back down to her ankle height at (0.80, 0.32, 0.20) → (0.68, 0.18, 0.08) and hovers; hold. Ambient: rain, curtain, ripples, the wingbeat blur, idle-breathe.
- Key frames: +18 the slap; +30 her palm, empty; +94 last frame: her glare, the mosquito back at her ankle.
- Sound: **SL slap at +18** (a palm slapping a bare damp ankle: sharp crisp skin slap with a tiny wet note, a flip-flop scuff before it, 0.3 s, close, annoyed and funny); V03 +20 (optional); **E1 at +32** (two quick descending kalimba plucks, a playful "nope", dry, 0.7 s; candidate `comedy_kalimba-nope_01`); W1 whine carries on after E1, alone over the rain, and fades over the last 20 f (+75–+94); A1/A2 under, fading with it.
- Entry → exit: +0 she spots it → +94 the mosquito wins; hold.

## Acceptance (checks for W5 and W6)

| Check | Shots | Pass condition |
| --- | --- | --- |
| A01 First frame | 1 | Reads "a mosquito steady in pouring rain at ankle height" without narration (viewer check); mosquito body ≥ 45 px; black-and-white stripes legible at 270 px (reads as ยุงลาย) |
| A02 Shrink match | 2–3 | The puff centre at the same screen point ±40 px across the cut (SP1); OT01 from f 38 |
| A03 Drop size | 3, 5, 7 | The bun's width ≈ 1.5 × her height (±10 %) at the same depth; bun shape, never a teardrop |
| A04 Not a bounce | 4 | The mosquito carried down out of frame before it flies back up |
| A05 Constant speed | 7, 9 | The drop's screen speed constant ±3 % across the contact and through SH09 |
| A06 Pressed, whole | 8, 11, 13 | Both within 0.02 sm of the face; the mosquito's body round, legs splayed; her ≥ 480 px in SH08 and SH11 |
| A07 Ruler | 14 | One tick per 1.62 sm; tick 20 at the face on "ยี่สิบ" ±6 f; OT03 beside it |
| A08 Cut before contact | 15 | The last frame's gap between the drop's face and the water ≥ 1.0 sm; no splash, no woman |
| A09 Replay and slide-off | 16, 17 | No woman in frame after SH16 +25; legs spread before the roll; separation at 14 bl; the splash with no one on the drop |
| A10 Callback | 19–21 | The mosquito ≥ 15 cm above the puddle in every frame; untouched by the slap; above y 1160 |
| A11 Labels | all | OT01 on [38, 1327) only, text exactly "ภาพจำลอง"; no number except OT02/OT03; no species name anywhere on screen |
| A12 Zones | all | Hero details above y 1160; caption band mean ≤ 0.25, p95 ≤ 0.40 |

## Dependencies and open items

- Film (W3): `new: mosquito` look-defining card and stills (brief N1, LF00) for the user's approval; look frames LF01–LF06.
- Boss: N2–N13 in the brief ([new assets](film-brief.md#new-assets-and-missing-capability-boss-dependencies-w52)); spikes SP1 and SP3 before plates.
- Ton: the cue list in the brief's [sound direction](film-brief.md#sound-direction) (NEEDS-GEN M0, M1, M1b, A2, A3, S1, S2, S4, W1, W2, D1, H1, H2, F1, K1 flutter, B1, T1, S5, P1, SL, footsteps; library candidates A1 `weather_tin-roof-rain-shelter_01`, S3 `reveal_rewind-whirr_01`, K1 pass `whoosh_air-swish-rising_01`, E1 `comedy_kalimba-nope_01`).
- Editor: V01–V03 casting and the W4 voice lock; then Film re-pegs this sheet (W5.1).
- **Q-F1, Q-F2: answered** (user, 2026-11-11): striped ยุงลาย; drop at true relative size (brief [open questions](film-brief.md#open-questions)). No open user question in this sheet.
- Boat: picture checks B-P1–B-P6 (brief), B-P6 = the striped look under OT01 does not imply the study's species.

## Change log

| Revision | Date | Author | Change |
| --- | --- | --- | --- |
| EDU-EP18-ROWS-R1 | 2026-11-11 | Film | First storyboard pass (W2) from brief EDU-EP18-BRIEF-R1: 21 shots, estimated 1575 f = 52.5 s (warm Kore at atempo 1.08, scaled from N1); projections computed for the `H`, `M` and `Dl` shots; Sound line per shot; review-rows.json written untimed. |
| EDU-EP18-ROWS-R1.1 | 2026-11-11 | Film | From brief EDU-EP18-BRIEF-R1.1: Q-F1 striped ยุงลาย applied (casting, R02, SH01 staging, A01, A11), Q-F2 kept; no species name on screen; Q-F1/Q-F2 closed and removed from review-rows.json (lede and character fact updated, SH01 and SH17 `seen` mention the stripes). Timings, beat IDs, shot IDs and Sound lines unchanged. |
