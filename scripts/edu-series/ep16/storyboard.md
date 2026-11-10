# Storyboard — EDU-EP16-SHORT (first pass, estimated timing)

Deliverable: `EDU-EP16-SHORT` · Revision: **EDU-EP16-ROWS-R1.0** (Film, 2026-11-10, W2.2: first storyboard pass) · Status: **draft for the user's storyboard review (W2.3)**; timing **estimated** until the W4 voice lock, so not `ready-for-dev` for plates (W5.1 re-pegs every frame on the locked read). Readiness is not user approval, runtime or visual proof.
Inputs: [script.md](script.md) EDU-EP16-SCRIPT-R2 (user-approved 2026-11-10) · [fact-check.md](fact-check.md) R1 (O3–O8 applied as picture notes) · [film-brief.md](film-brief.md) **EDU-EP16-BRIEF-R1** (VD01–VD14, D01–D09) · task record [task.md](task.md).
Target: this worktree, branch `list-unmade-education-concepts` at `5b9c392` · 30 fps · **durationFrames 1662 (55.4 s, estimated)** · 1080×1920 · composition offset 0 (one scene, S01).
Evidence: nothing painted or rendered; street-shot projections computed with `scripts/shot-projection.py` (pinhole, f 1000 px ⇒ vfov 87.7°, hy 960) on the brief's estimated anchors; map and diagram numbers from the camera formula; no audio exists (timing from the script's N1 model).
Rows file: [review-rows.json](review-rows.json) **EDU-EP16-ROWS-R1.0** (Thai, `untimed: true`, first-pass rule). Review page: pending.

## Units, clocks and conventions

- Clocks: **global** `f` = composition frame (= scene-local, offset 0); **shot-local** `+n` = `f − shot start`. Ranges are half-open `[start, end)`. All frames are `estimated` from the script's N1 model (0.20 s per syllable, 0.5 s per pause, 0.3 s lead-in; L13 per R2, −0.4 s), ±15 f per line; the W4 lock replaces them.
- Spaces and axes as in the brief's [projection contract](film-brief.md#projection-contract-and-scale-baseline): `G` geographic (km; nadir camera `gcam: nadir (lat, lon), h km, f 1000, pp (cx, cy), yaw ψ°`; px/km = 1000 / h at the nadir), `S` SET-SUKH16 (m; origin M0 at the man's feet, +x east, +y up, +z south toward the cameras), `T` SET-STADIUM16 (m; origin field centre, +x toward the stage end, +z toward the instrument side), `D` fixed-plane diagrams (px).
- `ycam` lines give `pos → pos, look-at → look-at, f`; hy 960 unless stated. Moves in `G` are log-altitude (constant apparent zoom speed) inside the stated window, smoothstep at both ends.
- Screen: pixels, origin top-left, y down. Caption band y 1176–1344; faces, the phone, the square, the map provinces, the fill front, the speck, the pans, the stage, the pen and the dot above y 1160 ([caption-zone rule](film-brief.md#caption-zone-rule)); slots LBL (816–1020, 148–204), LBL-W (600–1020, 148–236) for OT01, LBL2 (60–520, 160–228) for OT05; `@TamMaiLa` top-left (x < 330, y < 140 clear).

## Casting

| Role | Casting line | Notes |
| --- | --- | --- |
| MAN | `man-spiky + park-casual (cap off), P10, neutral` | 1.72 m, on M0. Poses: P10 raised (back view, SH02) → P10 + `new: squeezed`, `tired` (SH05) → `nod` up + phone into the right shorts pocket, `neutral` → `happy` (SH10) → `standing-jump` crouch (P35 arms back), `happy` (SH11) → `standing-jump` take-off/apex (P08 arms up), `laugh` (SH12) → landing, `idle-breathe`, `relieved` (SH15). Brief VD02, D01 |
| MAN voice | V01 "แน่นจริง" (muttered complaint), V02 "ฮึบ!" (effort grunt) | Editor's casting at the voice lock |
| Crowd | `PEOPLE` (all 14) × `WARDROBE` (office, school, monk, yukata, kimono, nurse, police, hoodie, vendor, rider, kitchen-apron, park-casual), seeded tints and head turns; `new: crowd-heads` beyond 3 m; `new: person-top` straight down | brief VD03 |
| Seattle crowds | the same card mix in dark rain jackets (day) and light summer clothes with phone lights (night); no team kit, no logo | brief VD10 |
| Kit layers | ENV-EARTH (`kit/earth.ts`, limb and palette) in SH13, SH14, SH22 | ENV-P02 |

## Shot map

| # | Shot | Beat | Lines | Range (global, est) | Len | Start s | Camera | One-line read |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | S01-B01-SH01 | B01 | L01a | [0, 66) | 66 | 0.00 | `G` straight down, rise h 0.58 → 80 km | A stadium from above, people streaming in; rise to the whole map |
| 2 | S01-B01-SH02 | B01 | L01b | [66, 111) | 45 | 2.20 | `S` over his shoulder, push 0.2 m | His phone's blue dot; the crowd closing in |
| 3 | S01-B01-SH03 | B01 | L02 | [111, 216) | 105 | 3.70 | `G` h 85 → 80 km, yaw 2 → 0° | The crowd spreads over Bangkok and Nonthaburi |
| 4 | S01-B01-SH04 | B01 | L03 | [216, 276) | 60 | 7.20 | `S` straight down 2.3 m over heads | Heads in a grid; one 50 × 50 cm square around his head |
| 5 | S01-B01-SH05 | B01 | V01 | [276, 309) | 33 | 9.20 | `S` front close, push 0.08 m | Squeezed between two shoulders: "แน่นจริง" |
| 6 | S01-B02-SH01 | B02 | L04 | [309, 396) | 87 | 10.30 | `G` h 80 → 72 km, yaw 0 → 3° | Bangkok fills; the crowd crosses into Nonthaburi |
| 7 | S01-B02-SH02 | B02 | L05 | [396, 492) | 96 | 13.20 | `G` h 80 → 45 km toward Nonthaburi | The fill slows and stops; a quarter stays green |
| 8 | S01-B02-SH03 | B02 | L06 | [492, 591) | 99 | 16.40 | `G` rise h 45 → 1,100 km | Thailand: the patch is small |
| 9 | S01-B03-SH01 | B03 | L07a | [591, 642) | 51 | 19.70 | `G` dive h 1,100 → 6 km to M0 | Back down into the crowd |
| 10 | S01-B03-SH02 | B03 | L07b | [642, 678) | 36 | 21.40 | `S` low front, push 0.2 m | He looks up, pockets the phone, bends his knees |
| 11 | S01-B03-SH03 | B03 | W-COUNT | [678, 723) | 45 | 22.60 | `S` high angle over the heads | 3 · 2 · 1, the sea of heads crouches |
| 12 | S01-B03-SH04 | B03 | W-JUMP, V02 | [723, 759) | 36 | 24.10 | `S` low front, static | Everyone in the air: "ฮึบ!" |
| 13 | S01-B03-SH05 | B03 | L08 | [759, 861) | 102 | 25.30 | `D` Earth limb → loupe → atom | Less than one atom: a speck in a ring |
| 14 | S01-B03-SH06 | B03 | L09 | [861, 957) | 96 | 28.70 | `D` balance, push to the crowd pan | The Earth's pan slams down; ours flies up |
| 15 | S01-B03-SH07 | B03 | L10 | [957, 1044) | 87 | 31.90 | `S` = SH04 camera | Everyone lands; the inset speck goes back |
| 16 | S01-B04-SH01 | B04 | L11a | [1044, 1095) | 51 | 34.80 | `G` dive h 80 → 0.58 km to K02 | Down to the Bangkok stadium, full of people |
| 17 | S01-B04-SH02 | B04 | L11b | [1095, 1146) | 51 | 36.50 | `T` match cut from above, crane down | Another stadium from above, grey afternoon, roaring |
| 18 | S01-B04-SH03 | B04 | L12a | [1146, 1212) | 66 | 38.20 | `T` upper deck, truck 14 m | The game crowd roars; "ซีแอตเทิล · 2011" |
| 19 | S01-B04-SH04 | B04 | L12b | [1212, 1275) | 63 | 40.40 | `T` night, push 3 m | The concert at night; "2023" |
| 20 | S01-B04-SH05 | B04 | L13a | [1275, 1332) | 57 | 42.50 | `T` lower stands, push 4 m | Tens of thousands bouncing together |
| 21 | S01-B04-SH06 | B04 | L13b | [1332, 1416) | 84 | 44.40 | `T` close on the pen → pull back across the street | A pen scratching a jittery line in a box beside the stadium |
| 22 | S01-B05-SH01 | B05 | L14, L15, hold | [1416, 1662) | 246 | 47.20 | `G` rise h 80 → 7,860 km, then drift | Bangkok patch → Thailand → the whole globe; one dot |

## Voice and subtitle cues (global, estimated)

| Cue | Line | Thai (VO, subtitle = VO) | Range | Shots |
| --- | --- | --- | --- | --- |
| C01 | L01 | คนทั้งโลก รวมทั้งคุณด้วย… กว่าแปดพันล้านคน | [9, 96) | 1–2 |
| C02 | L02 | ยืนเบียดกันแน่น ๆ ได้หมด ในกรุงเทพฯ กับนนทบุรี | [111, 201) | 3 |
| C03 | L03 | คนละช่อง แค่ครึ่งเมตร คูณครึ่งเมตร | [216, 270) | 4 |
| C04 | V01 (MAN) | แน่นจริง | [276, 300) | 5 |
| C05 | L04 | กรุงเทพฯ เต็มทุกเขต แล้วล้นเข้านนทบุรี | [309, 381) | 6 |
| C06 | L05 | แต่ยังไม่ทันเต็มจังหวัด… คนก็หมดแล้ว | [396, 477) | 7 |
| C07 | L06 | เราว่าเราเยอะแล้ว… โลกใหญ่กว่านั้นอีก | [492, 567) | 8 |
| C08 | L07 | แต่… ถ้าทุกคนตรงนี้ กระโดดพร้อมกันล่ะ | [591, 672) | 9–10 |
| — | V02 (MAN) | ฮึบ! (no subtitle) | [727, 739) | 12 |
| C09 | L08 | โลกขยับจริง… แต่น้อยกว่าความกว้างอะตอมเดียว | [759, 846) | 13 |
| C10 | L09 | เราว่าเราหนักแล้ว… โลกหนักกว่ามหาศาล | [861, 942) | 14 |
| C11 | L10 | พอลงพื้น… โลกก็กลับที่เดิม | [957, 1020) | 15 |
| C12 | L11 | แต่… คนแค่สนามเดียว ก็ทำพื้นสั่นได้นะ | [1044, 1131) | 16–17 |
| C13 | L12 | ที่ซีแอตเทิล เกมฟุตบอลอเมริกัน กับคอนเสิร์ตในสนามกีฬา | [1146, 1260) | 18–19 |
| C14 | L13 | คนหลายหมื่นขยับพร้อมกัน… พื้นสั่นจนเครื่องวัดข้างสนามจับได้ | [1275, 1392) | 20–21 |
| C15 | L14 | ถอยออกไปดูจากอวกาศ… | [1416, 1479) | 22 |
| C16 | L15 | คนกว่าแปดพันล้านคน… บนโลกใบนี้ เป็นแค่จุดเดียว | [1494, 1593) | 22 |

## On-screen text (global ranges, estimated)

| ID | Text | Range | Slot |
| --- | --- | --- | --- |
| LBL | ภาพจำลอง | [0, 111) and [1044, 1662) | LBL |
| OT01 | ยืนแน่นประมาณ 4 คน/ตร.ม. · ภาพจำลอง | [117, 1044) (SH03 +6 to the end of SH15) | LBL-W (two lines allowed) |
| OT02 | กรุงเทพฯ / นนทบุรี | "กรุงเทพฯ" from 159, "นนทบุรี" from 183 to 216; again [309, 492) | world-anchored at the province label points |
| OT03 | 50 × 50 ซม. | [242, 276) | world-anchored beside the square, leader 1 px |
| OT04 | 3 · 2 · 1 | "3" [678, 693), "2" [693, 708), "1" [708, 723) | centred (540, 520), 260 px |
| OT05a | ซีแอตเทิล · 2011 | [1152, 1212) | LBL2 |
| OT05b | ซีแอตเทิล · 2023 | [1215, 1416) | LBL2 |
| OT06 | คนทั้งโลก | [1581, 1662) | world-anchored to the dot, leader to (760, 820) |

## Rules for every shot

- **R01 Labels.** "ภาพจำลอง" visible in every frame (LBL or inside OT01), per the brief's [truth limits](film-brief.md#truth-limits).
- **R02 Truth limits.** As the brief: fill over water, the fill ends inside Nonthaburi at 77 ± 2 %, the jump only in the Bangkok crowd, no visible Earth move at Earth scale, the speck far smaller than the atom, the Earth's pan down, day game / night concert, no cause cue from crowd to trace, no city-still pull-back, no number on screen.
- **R03 Size reference.** Every shot keeps one: people (street, stadium), roads and province outlines (map), Thailand's outline (SH08–SH09), the Earth (SH13, SH14, SH22).
- **R04 Feet and lattice.** In `S` everyone stands on y 0 on the 0.5 m lattice (±0.08 m jitter); in the jump each body leaves and lands on its own lattice point (no drift); the man on M0.
- **R05 Screen.** Faces, the phone, labels and every hero detail above y 1160; the caption band calm per the brief's rule.
- **R06 Ambient clocks.** Cloud drift (map, globe), idle-breathe and seeded head turns (crowd), beam sway (balance), the drum turning and the stadium beams run on ambient clocks; event clocks (h, φ, jump, beam slam, pen jitter) are shot-local (DF-20261030-painted-story-hold-ambient-clock).
- **R07 Continuity.** φ carries across map shots (VD05); the phone in his right hand until SH10 +20, then in his right pocket; the stadium night state SH19–SH21; K02 identical in SH01 and SH16.

## Per-shot staging

Key frames shot-local `+n`, all estimated. Sound lines give the shot-local frame and the brief's code or library ID (brief [Sound direction](film-brief.md#sound-direction)); every library ID is "not listened" and Ton checks it against its description before use. Editor sets levels.

**1. S01-B01-SH01** [0, 66), 66 f. VO C01 +9–+57 ("คนทั้งโลก" +9, "รวมทั้งคุณด้วย" +24).
- Camera: `gcam: nadir K02 (13.755, 100.622) → MC (13.815, 100.600), h 0.58 → 80 km, f 1000, pp (540, 640) → (540, 660), yaw 0°`; hold +0–+10, rise +10–+60 (log h), hold +60–+65. At +0: 1,724 px/km, the bowl roof ≈ 517 × 431 px at (540, 640); at +65: 12.5 px/km, Bangkok + Nonthaburi ≈ x 81–999, y 211–1109.
- Staging: `G` L3 → L2 cross-fade (h 2–6 km). +0: the stadium bowl (K02) straight down, rooftops and streets around it, streams of people (coloured speck ribbons) flowing along every street into the bowl and the blocks; the bowl's stands already half full. As the camera rises, the streams become rivers pouring along the highways from every frame edge into Bangkok; φ 0 → 0.03 (streams + first pools); the river, the Gulf, Nonthaburi's green read by +50.
- Key frames: +0 reads "a city from above, people pouring in" (UT01; LF01A); +40 the whole of Bangkok enters the frame; +65 the whole map.
- Sound: S1 arrival wave +0 (its rise peaks about +45); A1 from +0; A2 rising from +20 with the streams. No music.
- Entry → exit: +0 the stadium close from above → +65 the whole map, streams at the edges.

**2. S01-B01-SH02** [66, 111), 45 f. VO C01 +0–+30 ("กว่าแปดพันล้านคน").
- Camera: `ycam: pos (0.55, 2.05, 1.60) → (0.50, 2.00, 1.40), look-at (0, 0.85, −4.0), f 1000`; slow push +0–+44. Computed at +0: his head 240 px (back of head y 950–1185, x ≈ 310, left third), phone ≈ (430, 1085), crowd at 8 m ≈ y 800, shophouse base y ≈ 725, viaduct far edge y ≈ 45.
- Staging: `S`. MAN `back`, P10 raised (phone at upper chest in the right hand, screen tilted toward the lens): the phone's map shows streets and a blue "you are here" dot with a pulse ring (K01, ≈ 6 px dot on a 35 × 70 px screen). Ahead: the packed crowd to the shophouses, the viaduct and its pillar (x −8) upper frame; people squeezing in from both frame edges (+0–+30), the last gaps closing.
- Key frames: +0 the phone and the crowd read together; +30 no gap left.
- Sound: A3 packed crowd from +0 (A1/A2 out on the cut); S3 squeeze +18 (a neighbour's shoulder in).
- Entry → exit: +0 over his shoulder, gaps → +44 packed.

**3. S01-B01-SH03** [111, 216), 105 f. VO C02 +0–+90 ("ได้หมด" +30, "กรุงเทพฯ" +48, "นนทบุรี" +72).
- Camera: `gcam: nadir MC, h 85 → 80 km, f 1000, pp (540, 660), yaw 2 → 0°`; slow settle +0–+104.
- Staging: `G` L2. The crowd spreads from the streams over the map as a grey-brown flecked texture, φ 0.03 → 0.30, over the river and canals too (O5); the K02 bowl is a speck inside the fill. OT01 in LBL-W from +6; OT02 "กรุงเทพฯ" at +48 and "นนทบุรี" at +72 (world-anchored); the province borders brighten on their names.
- Key frames: +48 Bangkok's outline highlighted; +72 Nonthaburi's; +104 about a third filled, centre first.
- Sound: **M1 enters at +0** (pick-up, energy 1.5); A1 + A2 (A2 rising with φ).
- Entry → exit: +0 map with streams → +104 a third filled.

**4. S01-B01-SH04** [216, 276), 60 f. VO C03 +0–+54 ("คนละช่อง" +0, "ครึ่งเมตร" +24, "คูณครึ่งเมตร" +36).
- Camera: `ycam: pos (0, 4.00, 0.08) → (0, 3.85, 0.08), look-at (0, 0, 0), f 1000` (straight down, EP14 `topdown.ts` precedent); push +0–+59. Computed at +0: the 0.5 m square ≈ 220 px (x 430–650, y 847–1066), his head centre (540, 956).
- Staging: `S` from above. `new: person-top` crowd on the 0.5 m lattice: hair discs, shoulders in outfit colours, arms tucked; his spiky black hair and mustard tee in the centre. A faint 0.5 m grid fades in +0–+10; one square draws on around his head +12–+24 (2 px `#ffd34a`); OT03 "50 × 50 ซม." at +26 beside its right edge.
- Key frames: +24 the square complete; +40 LF03.
- Sound: S2 at +12 (the square drawing on); A3 continues; M1 thins to its bass and pluck.
- Entry → exit: +0 heads from above → +59 the square around him.

**5. S01-B01-SH05** [276, 309), 33 f. V01 +0–+24.
- Camera: `ycam: pos (0.10, 1.62, 1.30) → (0.08, 1.60, 1.22), look-at (0, 1.20, 0), f 1000`. Computed: head 345 px (y 551–896), phone y 1069, neighbours' heads at x ≈ 247 and 840; full figure ≈ 1,290 px.
- Staging: `S`. MAN `front`, P10 + `new: squeezed` (elbows tucked, shoulders up, phone held to his chest), `tired`; two neighbours' shoulders press in from both sides at +2 (a man in an office shirt, a woman in a nurse's uniform, `neutral`); he mutters V01.
- Key frames: +2 the squeeze; +4 V01 starts; +15 LF02.
- Sound: S3 +2; V01; M1 holds one bar.
- Entry → exit: +0 face front → +32 squeezed, eyes half shut.

**6. S01-B02-SH01** [309, 396), 87 f. VO C05 +0–+72 ("ทุกเขต" +18, "ล้นเข้านนทบุรี" +36).
- Camera: `gcam: nadir MC, h 80 → 72 km, f 1000, pp (540, 660), yaw 0 → 3°`; slow push +0–+86.
- Staging: `G` L2. φ 0.30 → 0.80: the fill floods Bangkok district by district (inside Q-F1's district lines, or as one front), reaching every border by +40 (φ 0.765), then crosses north into Nonthaburi +40–+86 along the river and roads first; OT02 both names; OT01.
- Key frames: +18 the last districts flooding; +40 Bangkok full; +60 LF01B.
- Sound: M1 builds (felt-piano layer joins); A2 swells with φ.
- Entry → exit: +0 a third filled → +86 Bangkok full, the front inside Nonthaburi.

**7. S01-B02-SH02** [396, 492), 96 f. VO C06 +0–+81 ("ยังไม่ทันเต็มจังหวัด" +6, "คนก็หมดแล้ว" +57, "หมด" +65).
- Camera: `gcam: nadir MC → Nonthaburi centre (13.95, 100.42), h 80 → 45 km, f 1000, pp (540, 660), yaw 3°`; push +0–+60, hold +60–+95. At +60: 22.2 px/km, Nonthaburi ≈ 865 px across.
- Staging: `G` L2. The fill slows (ease-out) φ 0.80 → 1.00 at +65, the front reaching into Nonthaburi from the south and east; the last thin trickle of specks along one road stops at +65; the north-west quarter (about 23 % of the province, plan area) stays green with field grids; no fill at the province border there.
- Key frames: +65 the stop on "หมด"; +70 the empty quarter reads.
- Sound: M1 continues to +64, **stops dead at +65** with S4 at +66; A2 drops to a steady murmur.
- Entry → exit: +0 the whole map → +95 Nonthaburi, the fill stopped, a quarter green.

**8. S01-B02-SH03** [492, 591), 99 f. VO C07 +0–+75 ("เราว่าเราเยอะแล้ว" +0, "โลกใหญ่กว่านั้นอีก" +45).
- Camera: `gcam: nadir Nonthaburi centre → (13.75, 100.50), h 45 → 1,100 km, f 1000, pp (540, 660) → (540, 820), yaw 3 → 0°`; hold +0–+6, rise +6–+66, settle +66–+98. At +98: 0.91 px/km, Thailand ≈ x 230–1044, y 145–1638; the patch ≈ 66 px at (540, 820).
- Staging: `G` L2 → L1 (cross-fade h 150–300 km, +35–+50): the grey patch shrinks into Thailand; neighbouring countries muted, the Gulf and the Andaman Sea blue; light cloud wisps at altitude.
- Key frames: +45 "โลก" the whole country in frame; +66 settled.
- Sound: S5 at +6; A1 thinning to air; no music.
- Entry → exit: +0 Nonthaburi → +98 Thailand with a small patch.

**9. S01-B03-SH01** [591, 642), 51 f. VO C08 +0–+51 ("แต่…" +0, "ทุกคนตรงนี้" +27).
- Camera: `gcam: nadir (13.75, 100.50) → M0 (13.737, 100.560), h 1,100 → 6 km, f 1000, pp (540, 820) → (540, 700), yaw 0°`; hold +0–+8 (on "แต่…"), dive +8–+48, hold +48–+50. At +50: 167 px/km, the BTS line a pale stripe through the crowd texture at (540, 700).
- Staging: `G` L1 → L2: Thailand → Bangkok → the street grid around M0, the whole frame the flecked crowd texture.
- Key frames: +27 "ตรงนี้" the street grid under us.
- Sound: S6 dive at +8, landing into A3 at +48; M1 returns at +30 on a busier phrase.
- Entry → exit: +0 Thailand → +50 the crowd texture straight down.

**10. S01-B03-SH02** [642, 678), 36 f. VO C08 +0–+30 ("กระโดด" +0).
- Camera: `ycam: pos (0.20, 1.00, 2.40) → (0.18, 0.98, 2.20), look-at (0, 1.30, 0), f 1000`. Computed: standing head 172 px (y 792–964), crouched head y 879–1055; full figure ≈ 740 px; sky above him (the viaduct out of frame top).
- Staging: `S`. MAN `front`: +2–+10 `nod` up (looks up at the sky), `neutral` → `happy`; +8–+20 slides the phone into his right shorts pocket; +22–+35 `standing-jump` crouch begins (knees bend, arms swing back). Neighbours look up too (seeded +2–+8).
- Key frames: +4 looking up; +20 hands free; +35 crouch half down.
- Sound: A3; M1 phrase; a soft pocket rustle inside A3 (no cue).
- Entry → exit: +0 looking ahead → +35 crouching, looking up.

**11. S01-B03-SH03** [678, 723), 45 f. W-COUNT.
- Camera: `ycam: pos (0, 4.5, 6.0) → (0, 4.6, 6.0), look-at (0, 0.6, −4.0), f 1000`; a 0.1 m rise. Computed: his head (540, 1051) → crouched (540, 1092); the sea of heads from y ≈ 660 (shophouse base) to the frame bottom; pillar base at x ≈ 56.
- Staging: `S` high angle. Everyone faces roughly up and ready; OT04 "3" +0, "2" +15, "1" +30; on "1" the whole sea of heads drops (crouch, seeded ±2 f) +30–+42; his spiky hair and mustard tee findable at the centre.
- Key frames: +30 the drop starts; +42 all crouched.
- Sound: **silence**: M1 and A3 cut at +0 (A3 kept at −30 dB); S7 at +0, +15, +30; S8 at +31.
- Entry → exit: +0 standing → +44 crouched, still.

**12. S01-B03-SH04** [723, 759), 36 f. V02 +4–+16.
- Camera: `ycam: pos (0.30, 0.95, 2.60), look-at (0, 1.40, 0), f 1100` (static: the background is the reference). Computed: crouched head y 919–1100; apex head y 667–834; figure at apex ≈ 930 px.
- Staging: `S`. `standing-jump` take-off at +3 (P08 arms up), apex +16 (0.42 m clearance), descending from +20; `laugh`; every neighbour leaves the ground with him (seeded ±2 f, clearances 0.25–0.45 m), arms up; the shophouse awnings and the sky stay put.
- Key frames: +3 lift-off; +16 apex (everyone in the air).
- Sound: S9 at +3; V02 at +4; A3 back at −8 dB at +3.
- Entry → exit: +0 crouched → +35 descending (the landing is in shot 15).

**13. S01-B03-SH05** [759, 861), 102 f. VO C09 +0–+87 ("โลกขยับจริง" +0, "น้อยกว่า" +45, "อะตอมเดียว" +66).
- Camera: `D` fixed plane; in-canvas push. +0–+24 the Earth limb (arc top y 600, Thailand and the crowd patch at (540, 600), the patch a 4 px bump inside the marker ring); loupe opens from the patch +24–+38 to full frame; inside: a row of atoms at the surface, hero atom 360 px at (540, 760); slow push 6 % +40–+101.
- Staging: no visible Earth motion. On "น้อยกว่า" (+45) the marker ring draws on the hero atom's lower edge; +50 the 3 px speck appears inside it; +66 the push leans toward the ring. OT01 holds.
- Key frames: +24 loupe starts; +50 the speck (LF04 at +80).
- Sound: A6 space pad from +0; S10 at +24; S11 at +50.
- Entry → exit: +0 the curve of the Earth → +101 the atom and the speck.

**14. S01-B03-SH06** [861, 957), 96 f. VO C10 +0–+81 ("หนัก" +18, "โลกหนักกว่ามหาศาล" +45).
- Camera: `D` fixed plane; static +0–+40, push 8 % toward the crowd pan +40–+95.
- Staging: the brass balance in space (pivot (560, 560)); the Earth (r 165) in the left pan, the crowd speck in the right pan with its ring. +0 the beam level; +2–+10 the Earth's side slams down to the 28° stop, the crowd pan flung to the top; overshoot 2° and settle by +18; then still, with the crowd pan's chains wobbling to +40. OT01 holds.
- Key frames: +10 the stop (O7); +30 LF04 (balance); +60 the speck in the pan centre frame.
- Sound: A6; S12 at +9; S13 at +11.
- Entry → exit: +0 level → +95 Earth down, the crowd pan high and close.

**15. S01-B03-SH07** [957, 1044), 87 f. VO C11 +0–+63 ("ลงพื้น" +6, "กลับที่เดิม" +33).
- Camera: `ycam: pos (0.30, 0.95, 2.60), look-at (0, 1.40, 0), f 1100` (= shot 12).
- Staging: `S`. The jump's event clock resumes from shot 12 +20 (the cutaways are explainer time): everyone descends and lands at +14 with a knees-bent dip; the man steadies, `relieved` at +30, `idle-breathe`. Inset: a loupe circle (centre (850, 430), r 150, below LBL-W) opens +20–+28 with the hero atom edge and the speck in its ring; at +45 the speck slides back onto the atom's edge line and the ring fades by +60; the inset closes +70–+78.
- Key frames: +14 landing; +45 the speck back.
- Sound: S14 at +14; A3 settles; S11 at +45 (the same tink); M1 out.
- Entry → exit: +0 in the air → +86 standing, relieved.

**16. S01-B04-SH01** [1044, 1095), 51 f. VO C12 +0–+51 ("แต่…" +0, "สนามเดียว" +36).
- Camera: `gcam: nadir MC → K02, h 80 → 0.58 km, f 1000, pp (540, 660) → (540, 640), yaw 0°`; hold +0–+4, dive +4–+46, hold +46–+50 (the bowl ≈ 517 px at (540, 640), as shot 1's first frame).
- Staging: `G` L2 → L3: the fully filled map → the K02 bowl packed with people, streets around it solid crowd. LBL "ภาพจำลอง" (OT01 ends at the cut).
- Key frames: +36 "สนามเดียว" the bowl fills the frame.
- Sound: S6 at +4; A2 → A3 far.
- Entry → exit: +0 the filled map → +50 the Bangkok bowl, matched outline.

**17. S01-B04-SH02** [1095, 1146), 51 f. VO C12 +0–+36 ("พื้นสั่น" +18).
- Camera: `ycam (T): pos (0, 580, 0.5) → (−70, 120, 170), look-at (0, 0, 0) → (0, 15, 0), f 1000`; hold +0–+6 (match: outer wall ≈ 517 px wide at (540, 640), long axis horizontal), crane down +6–+50 (ease).
- Staging: `T` day state (O4): grey overcast January afternoon, the generic bowl full, the field below; at the end the camera is over the upper rim looking across the roaring stands.
- Key frames: +0 the match; +40 the stands' crowd readable as people.
- Sound: A4 roar swells in on +0 (energy jump); A3 out on the cut.
- Entry → exit: +0 the bowl from above → +50 over the rim, three-quarter view.

**18. S01-B04-SH03** [1146, 1212), 66 f. VO C13 +0–+66 ("ซีแอตเทิล" +0, "เกมฟุตบอลอเมริกัน" +24).
- Camera: `ycam (T): pos (−10, 40, 92) → (4, 40, 92), look-at (0, 0, 0) → (4, 0, 0), f 1000`; truck +0–+65.
- Staging: `T` day. Foreground: fans in rain jackets from behind, arms up, cheering (kit cards `back`, seeded); below, the field with two plain-jersey teams lined up (1–2 px figures), no logos, the blank video board. OT05a in LBL2 from +6; LBL.
- Key frames: +30 LF05A.
- Sound: A4 roar with rhythmic claps.
- Entry → exit: the stands moving past, the field below.

**19. S01-B04-SH04** [1212, 1275), 63 f. VO C13 +0–+48 ("คอนเสิร์ต" +6).
- Camera: `ycam (T): pos (−30, 32, 96) → (−28, 31, 93), look-at (58, 8, 0), f 1000`; push +0–+62.
- Staging: `T` night state: the stage at the +x end lit warm white, coloured beams in haze, no performer drawn; the field floor packed, phone lights speckling; the stands dark with a warm rim. OT05b "ซีแอตเทิล · 2023" in LBL2 from +3; LBL.
- Key frames: +30 LF05B.
- Sound: A5 concert pulse and cheer from +0 (A4 out on the cut).
- Entry → exit: night stadium wide, slowly closer.

**20. S01-B04-SH05** [1275, 1332), 57 f. VO C14 +0–+57 ("ขยับพร้อมกัน" +24).
- Camera: `ycam (T): pos (15, 9, 52) → (15, 8.5, 48), look-at (30, 2, 10), f 1000`; push +0–+56.
- Staging: `T` night. The floor and lower stands crowd bounce and sway together, four bounces (peaks +6, +19, +32, +45), arms up, phone lights bobbing; the stage light washes over them. Nothing points from the crowd to the ground (O3).
- Key frames: +24 "ขยับพร้อมกัน" mid-bounce.
- Sound: S15 from +0 (accents off any later trace peak); A5 under.
- Entry → exit: the bouncing crowd, closer.

**21. S01-B04-SH06** [1332, 1416), 84 f. VO C14 +0–+60 ("พื้นสั่น" +0, "เครื่องวัด" +18, "ข้างสนาม" +30, "จับได้" +48).
- Camera: `ycam (T): pos (0.30, 1.10, 145.55) → (−1.20, 0.75, 148.80), look-at (0, 0.95, 146.00) → (0.4, 6.0, 118), f 1000`; hold close +0–+26, pull back and turn +26–+60, hold +60–+83. Computed: at +0 the pen at (540, 872), the drum ≈ 520 px across; at +60 the box ≈ 337 px tall at x ≈ 910 (top y 1077, pen y 1042), the stadium's wall filling the frame behind it (top y ≈ 29, base y ≈ 1153).
- Staging: `T` night, instrument KB. Close: the brass pen scratching a jittery line on the turning paper drum (no grid numbers, no label), the trace's jitter growing in bursts on an independent seeded clock; the pull-back reveals the steel box with its glass lid on the pavement under a street lamp, the street, and the glowing stadium right across it. LBL; OT05b holds. No pull-back past the stadium (R2).
- Key frames: +0 the trace (LF06 at +20); +30 "ข้างสนาม" box and stadium together; +60 hold.
- Sound: S16 from +0; A7 + A5 low-passed (the concert through the walls).
- Entry → exit: +0 the pen close → +83 the box beside the stadium.

**22. S01-B05-SH01** [1416, 1662), 246 f. VO C15 +0–+63 ("อวกาศ" +40); C16 +78–+177 ("คนกว่าแปดพันล้านคน" +78, "จุดเดียว" +165); hold +177–+245.
- Camera: `gcam: nadir MC → (13.75, 100.60), h 80 → 7,860 km, f 1000, pp (540, 660) → (540, 960), yaw 0°`; hold +0–+12, rise +12–+100 (log h), drift +100–+245 (h × 1.005 per second). At +100: globe radius 500 px (y 460–1460), the patch's true size ≈ 6.5 px.
- Staging: `G` L2 → L1 → L0. The filled patch from above (the map as SH06's end) → Thailand (+40) → Southeast Asia (+60) → the whole globe (+100), full-lit, clouds, atmosphere glow, navy space with stars (UT03: not flat black). From +90 the patch is drawn as an 18 px dot in K01's blue with a soft pulse ring (2.5 s period). OT06 "คนทั้งโลก" at +165 with a leader to (760, 820). LBL "ภาพจำลอง".
- Key frames: +40 Thailand; +100 the whole globe; +165 the tag (LF07 at +200); +245 last frame.
- Sound: hard cut to silence at +0, A1 at −20 dB from +2; S5 at +12; A6 from +40, A1 out by +70; E1 at +165; A6 fades to −∞ over +216–+245.
- Entry → exit: +0 the Bangkok patch from above → +245 the globe with one dot.

## Acceptance (checks for W5 and W6)

| Check | Shots | Pass condition |
| --- | --- | --- |
| A01 Place reads | 1, 2, 17 | First frame names "a city from above, people pouring in" without narration; SH02 names "a street in Bangkok under the skytrain"; SH17 a stadium (viewer check) |
| A02 Fill share | 7 | Nonthaburi filled 77 ± 2 % of its baked ring area at +65 onward; the front never on the province border; Bangkok 100 % |
| A03 Water filled | 3, 6, 7, 22 | The fill continuous over the Chao Phraya and canals (O5) |
| A04 Square | 4 | The square = 0.5 m on the lattice (220 ± 10 px at +0) around his head |
| A05 Jump | 11, 12, 15 | Everyone crouches, leaves and lands together (±2 f); each on its own lattice point; the background still |
| A06 Speck | 13, 15 | Speck ≤ 4 px, atom ≥ 340 px, ring visible at 270 px |
| A07 Balance | 14 | Earth's pan at the bottom stop, the crowd pan at the top from +18 to the end |
| A08 Seattle | 17–21 | Day overcast for 2011, night for 2023; no logo, no performer, no name; OT05 + "ภาพจำลอง" |
| A09 No cause cue | 20–21 | No line, arrow or synced accent links the crowd and the trace |
| A10 Globe | 22 | Radius 500 ± 5 px at +100; dot 18 px; OT06 from +165; 60 f hold |
| A11 Labels | all | "ภาพจำลอง" in every frame; no number anywhere |
| A12 Zones | all | Hero details above y 1160; caption band mean ≤ 0.25, p95 ≤ 0.40 |

## Dependencies and open items

- Boss: N1–N14 in the brief ([new assets](film-brief.md#new-assets-and-missing-capability-boss-dependencies-w52)); spikes SP1–SP3 before plates.
- Ton: the cue list in the brief's [sound direction](film-brief.md#sound-direction) (NEEDS-GEN M1, E1, A3–A5, S1, S3, S6–S9, S13–S16).
- Editor: V01/V02 casting and the W4 voice lock; then Film re-pegs this sheet (W5.1).
- **Q-F1 (user):** district lines from OpenStreetMap with a description credit, or no district lines (brief [handoff](film-brief.md#handoff-to-the-scene-sheet-pass)).

## Change log

| Revision | Date | Author | Change |
| --- | --- | --- | --- |
| EDU-EP16-ROWS-R1.0 | 2026-11-10 | Film | First storyboard pass (W2.2) from brief R1: 22 shots, estimated 1662 f = 55.4 s; projections of the street and instrument shots computed; review-rows.json written untimed. |
