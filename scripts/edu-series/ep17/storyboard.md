# Scene sheets — EDU-EP17-SHORT (ทำไมสายอินเทอร์เน็ตต้องอยู่ใต้ทะเล)

Revision: **EDU-EP17-ROWS-R1.2** (Film W3.1, 2026-11-15; Q8 camera changes accepted by the user and the look-frame cameras; R1.1 Film W2, 2026-11-14; user Q2: B04-SH05 is a 3D cutaway block), **untimed first storyboard pass**; status **draft** (not ready-for-dev: integer frames, `scripts/shot-projection.py` and caption-band checks come at the W4 timed pass from the voice lock). Readiness is not approval, runtime proof or visual proof; no frame exists.
Inputs: script [script.md](script.md) **EDU-EP17-SCRIPT-R1.2.1** (user-approved 2026-11-14); review [fact-check.md](fact-check.md) R1.1 + R1.2.1 recheck (`ready-for-storyboard`); brief [film-brief.md](film-brief.md) **EDU-EP17-BRIEF-R1.1**. Target checkout: branch `claude/underwater-cable-question-f0f950` at `64291e8` (+ uncommitted EP17 files).
Review rows: [review-rows.json](review-rows.json) ROWS-R1.1 (Thai, `"untimed": true`). Review page: pending.

## Units and conventions

- Spaces, origins and axes as in the brief's [projection contract](film-brief.md#projection-contract-and-scale-baseline): `R` yard (origin M0 on the ground, +z toward the house, sea at −z), `W` = R + (0, +1.5, +14) under the sea (compressed staging), `G` globe (unit sphere), `B` bubble (screen px), `F` Red Sea surface, `FS` flashback seabed, `D` cutaway block (3D model block in block units, +x toward the deep, +z toward the camera; R1.1).
- **Camera lines** use kit `camMove(at, yaw, r, eye, {f, hy})` (`src/painted/kit/cam-moves.ts`): camera point = at + r·(sin(−yaw), 0, cos(−yaw)) at height eye; yaw 0 looks toward −z (out to sea), yaw +90 toward +x. "pos" values are the resulting camera points. Every number is **est** (Film pinhole scratch check, not rendered); Boss tunes within ±10 % and records changes.
- **Timing:** untimed. Key states are VO-relative ("on the word X"); W4 converts them to shot-local integer frames. Default eases: `easeInOutSine` for camera, `easeOutCubic` for arrivals.
- **Frame zones:** caption band y 1176–1344 (stroke captions, kept calm by staging); faces, phone screen, contacts, labels, bubble above y 1160; LBL (816–1020, 148–204); CARD (60–620, 168–236); BUB (90–990, 200–900); mark top-left clear x < 330, y < 140.
- **Lead size:** MAN ≥ 480 px when visible, except the recorded wides (B01-SH01 start, B02-SH01, B06-SH04 end).
- **Sound lines:** cue IDs from the brief's [sound direction](film-brief.md#sound-direction); "lib" = library ID (Ton checks by ear), NEEDS-GEN = Ton generates; cue times VO-relative until W4.

## Casting

| Role | Casting line | Poses (in order) | Faces | Motions | Status |
| --- | --- | --- | --- | --- | --- |
| MAN | `man-spiky + park-casual, new: hose-water, neutral` (outfit fields: no cap, sock = skin, flip-flops `#2b3a5a`) | `new: hose-water`, P09 hands_on_hips (hose in right fist), P30 visor_look_far, `new: hose-pinch` | neutral, surprised, worried, suspicious, laugh, happy | shake-head, turn-head-right, talk | person/outfit existing-integrated; two poses missing (N14) |
| SISTER (phone screen) | `woman-long, P07, happy` (cream knit colour fields) | P07 wave, then rest + talk | happy, laugh | talk | existing-integrated (screen framing new, N4) |
| Animals | none | — | — | — | — |

New looks (Boss dependencies, brief N1–N15): N1 seaside yard; N2 longtail ×2, cabin boat, trawler; N3 garden hose + spray; N4 phone on tripod + call screen; N5 signal line + data pulse; N6 seabed slope + cable; N7 anchors, chains, furrow, bottom trawl; N8 data globe; N9 kit bubble promotion + toy helicopter + motorway fold; N10 damaged cargo ship + overcast sea; N11 flashback seabed + three cables; N12 3D cutaway block (R1.1; fallback the flat diagram); N13 grade + LBL + CARD (existing components); N14 poses hose-water, hose-pinch; N15 over-under split seam.

## Shot map

| Shot | Line(s) | Space / set | Shot type | Move | Look frame |
| --- | --- | --- | --- | --- | --- |
| B01-SH01 | (pre-roll) + L01 | R yard | phone close → OTS | big pull-back (hook) | LF01 |
| B01-SH02 | L02a | R yard | high wide | crane follow of the line | — |
| B01-SH03 | L02b | W sea | underwater descent | big descent (hook) | LF02 |
| B01-SH04 | L03 | G globe | globe | pulse match + orbit pull-back | LF03 |
| B01-SH05 | V01 | R yard | reverse medium | small push + arc | LF01 (reverse) |
| B02-SH01 | L04 | R yard | high back wide | slow arc | — |
| B02-SH02 | W-SKY | R yard | low angle close | slow tilt-up push | — |
| B02-SH03 | L05, L06 | R yard + B bubble | bubble analogy | picture-stage push inside bubble | LF04 |
| B03-SH01 | L07a | W deep | cable truck | lateral truck | — |
| B03-SH02 | L07b | R + W split | over-under split | both halves truck together | — |
| B03-SH03 | V02 | R yard | reverse medium-close | small push | — |
| B04-SH01 | L09a | R yard | OTS to the open sea | slow push | — |
| B04-SH02 | L09b, L10 | W sea | sink then climb | big move (twist) | — |
| B04-SH03 | V03 | R yard | OTS, head turn | small arc | — |
| B04-SH04 | L12 | W shallows | anchor drag close | follow truck | — |
| B04-SH05 | L13 | D cutaway block | high 3/4 on a 3D block | yaw arc + pull-out | LF07 |
| B05-SH01 | L14a | F Red Sea | long-lens wide | slow arc | LF05 |
| B05-SH02 | L14b | FS seabed | low over floor | slow truck | LF06 |
| B05-SH03 | L15a | R yard | reverse medium-close (label on) | small push | — |
| B05-SH04 | L15b | F/FS | chain run-down | big move (descent) | — |
| B05-SH05 | gap after L15 | R yard | reverse medium | small arc | — |
| B06-SH01 | L17 | G globe | globe | slow orbit | — |
| B06-SH02 | L18 | G globe | close on one coast | push + slide | — |
| B06-SH03 | L19a | R yard | reverse medium | small arc | — |
| B06-SH04 | L19b + W-HOLD | R yard | crane to high wide, hold | crane up/back, ease to still | — |

25 shots. Cuts are hard unless written (two in-canvas dissolves: B01-SH02 → SH03 splash, B01-SH03 → SH04 pulse match).

## Rules for every shot

1. One action axis in the yard (MAN ↔ phone); every yard camera stays on the camera-left side of that line (behind his right shoulder or in front of him at his left beyond the wall).
2. K01 (boats at anchor, trawler) and K02 (green hose) are in every yard wide; the hose end stays in frame in every yard shot.
3. Ambient clock never stops: spray, boat bob, trawler drift, palm sway, caustics, globe pulses, smoke.
4. Under water, the cable is always readable (its own glow at depth).
5. B05: LBL "ภาพจำลอง" on every frame from the first frame of L14 to the last frame of L15, including B05-SH03; CARD "2024 · ทะเลแดง" on L14 only (B05-SH01, SH02); grade on SH01, SH02, SH04 only. No missile, fire, attacker, flag, weapon, face, crew, name.
6. No numbers or labels on screen besides subtitles, LBL and CARD.
7. Faces, phone screen, contacts and labels above y 1160; band y 1176–1344 over calm surfaces.

## Shots

### B01-SH01 — the call by the sea (pre-roll + L01)

- **Purpose:** UT01 frame 0: subject in frame, plant K01/K02, raise the question; the signal line goes up and is braked.
- **Camera (R):** start `camMove(at (−0.40, 1.10, −0.60), yaw −12, r 0.42, eye 1.14, {f 1000, hy 820})`, near 0.05 → end `camMove(at (−0.30, 1.10, −0.55), yaw 3, r 1.95, eye 1.68, {f 1000, hy 640})`; pull-back starts at L01's first syllable, ends on "ต่างประเทศ", `easeInOutSine`; then a 3 % drift-in to the line's brake.
- **Frame 0:** phone fills the centre (≈ 381 px tall at x 540, y 820), screen: SISTER waving (P07, happy); left of it the chilli pot P2 with the spray fan landing on it; bay soft behind. Self-view tile top-right of the screen shows a tiny MAN.
- **End framing (est):** MAN's back/right three-quarter in foreground right (head x ≈ 772, head span ≈ 303 px, cropped at the waist by frame right/bottom), phone x ≈ 489, y 891–971, the hose end and spray at x ≈ 600 y ≈ 1000, waterline y ≈ 847, boats B1–B3 y 650–714, trawler small near the horizon right; band over the wall's whitewash.
- **Staging:** MAN `new: hose-water`, neutral, watering P2 throughout; head turned slightly toward the phone. SISTER on screen: waves until "คนต่างประเทศ", then laughs/talks.
- **Key states (VO-relative):** pre-roll ≈ 15 f (A1 + S1 + S2 chime); on "ดาวเทียม" the signal line (N5) springs up out of the phone, rising ≈ 2.5 m in world (to y ≈ 3.6), reaches toward the sky top-right, brakes (a squash at the tip) and bends down toward the beach by "นะ"; it holds there, curling down at frame top-left-of-centre.
- **Sound:** A1 seaside yard (NEEDS-GEN) from frame 0, −8 dB until L01 then −14; S1 hose spray loop (NEEDS-GEN) from frame 0; S2 call chime (NEEDS-GEN), two soft rising tones from the small phone speaker at f 3, 0.6 s, "she's on the line"; M1 `bed_curious-explainer-light_01` (lib) enters on L01's first syllable at energy 2; S3 signal zip up (NEEDS-GEN), 0.5 s, on "ดาวเทียม"; S4 cartoon brake (NEEDS-GEN), squeaky rubbery skid bending down, 0.35 s, at the tip's squash; ducking per brief.
- **Entry → exit:** cold open → hard cut on the line's down-bend to SH02 (the line continues).
- **Acceptance:** frame 0 shows phone, sister, hose spray and bay with no text; the line occludes correctly behind the sky edge of CP1; MAN head and phone above y 1160.

### B01-SH02 — the line dives into the sea (L02a)

- **Purpose:** show the real path: down, not up.
- **Camera (R):** high wide behind and right of him, `camMove(at (−1.5, 0.3, −8), yaw −14, r 10.5, eye 4.2, {f 1000, hy 560})` → crane follow `camMove(at (−0.5, −1.0, −13), yaw −10, r 9.5, eye 3.2)` along the line, `easeInOutSine`, 12 % push.
- **Framing:** MAN small at frame bottom right (≈ 420 px, recorded exception inside the move, lead returns in SH05), wall, beach, bay; the line from the phone arcs over the wall, down the beach and into the water at z ≈ −14 by "นอน".
- **VO split:** L02 is split at "มันวิ่งไปตามสาย" (SH02) / "ที่นอนอยู่ก้นทะเล" (SH03); W4 places the cut at the voice-lock word boundary.
- **Key states:** on "วิ่ง" the line runs from the wall down the beach (head moving ≈ 6 m/s world); on the end of "ตามสาย" its head enters the water with a splash ring; dissolve (6 f est) from the splash to SH03, so "ก้นทะเล" lands on the descent.
- **Sound:** A1 continues; M1 at 2.5; S5 splash-whoosh (NEEDS-GEN), air whoosh into one clean splash then a muffled bubble roar going under, 0.9 s, the splash on the line's water entry; S1 ducked −6 dB.
- **Entry → exit:** cut in on the line's motion → in-canvas dissolve on the splash.
- **Acceptance:** the line visibly enters the water; band over sand/water.

### B01-SH03 — down to the cable (L02b)

- **Purpose:** the hook pays: a cable on the seabed, glowing.
- **Camera (W):** start just under the surface over the beach shoal, `camMove(at (0, −2, −20), yaw 0, r 6, eye −0.8, {f 1000, hy 760})` facing the open sea → descend along the line to the deep `camMove(at (0.5, −38.8, −190), yaw 4, r 7, eye −37.7, {f 1000, hy 820})` (W3.1, Q8 accepted: eye 1.2 m over the cable on the brief floor y_bed(−190) = −38.9; was at y −45 / eye −43, under the floor); big move `easeInOutSine`, through shafts and caustics into the dark; the signal line becomes the cable (it threads into the buried ridge at z ≈ −16, the cable takes the glow).
- **Framing end:** the cable crossing frame lower-centre on the deep ooze, glowing, pulses travelling away (to −z); the slope dark behind.
- **Key states:** bubbles and hull silhouettes overhead in the first third; caustics fade by the middle; at L02 end the camera settles 1.2 m above the cable; one pulse runs along it and fills the frame centre, matching into SH04.
- **Sound:** A2 shallow stems (NEEDS-GEN) at the start, crossfading to A3 deep hush (NEEDS-GEN) over the descent; M1 continues; S6 data pulse tick (NEEDS-GEN), soft round sonar-like tick, 0.3 s, as the pulse passes centre at the end.
- **Entry → exit:** dissolve from the splash → pulse-match dissolve to the globe.
- **Acceptance:** LF02; cable readable at depth; shallows-to-deep falloff continuous; no numbers.

### B01-SH04 — the globe (L03)

- **Purpose:** "nearly all" crossing-country traffic goes this way.
- **Camera (G):** start close on the warm dot (his yard) with the pulse arriving, `camMove(at (0,0,0), yaw 100°E-facing, r 2.8 → 3.4, eye 0.35, {f 1000, hy 900})`, orbit 8° toward the Pacific; pull-back `easeInOutSine`.
- **Framing:** globe centre (540, 900), radius ≈ 340 px at the end; lines L1–L16 light up in a ripple from the dot on "เน็ตข้ามประเทศ"; pulses on all lines by "ทางนี้"; no labels; subtitle carries "ราว 99%".
- **Sound:** no ambience; M1 at 2.5; S7 `reveal_glass-shimmer-soft_01` (lib) as the lines light, on "ข้ามประเทศ"; S6 ticks ×3 soft, staggered under the pulses.
- **Entry → exit:** dissolve in → hard cut to SH05.
- **Acceptance:** LF03; continents read; no straight bars from clipped rings; band over the dark background below the globe.

### B01-SH05 — "ห๊ะ? ใต้ทะเล?" (V01)

- **Purpose:** his surprise, in the clear.
- **Camera (R):** reverse from his front-left beyond the wall `camMove(at (0.05, 1.2, 0), yaw 124, r 4.2, eye 1.85, {f 2500, hy 720, pitch −8})` → 6 % push, 4° arc (W3.1 LF01R, pending the user's Q4: a longer lens from further back so the wall reads as a calm band and the props sit back from the lens; fallback the R1.1 numbers `at (0.05, 1.25, 0), yaw 123, r 1.91, eye 1.42, {f 1000, hy 760}`). LF01R measures head top y 448, chin y 703, visible lead 988 px (pinhole est).
- **Framing:** MAN front-left three-quarter, head-to-waist ≈ 464 px (whole figure ≈ 920 px, feet hidden by the wall top), head ≈ y 560; phone back lower-left (x ≈ 329) on the plank; house and terrace behind, shutters blue.
- **Staging:** at shot start the spray stops (thumb off, hose end drops), face neutral → surprised on "ห๊ะ"; he looks at the phone (left) on "ห๊ะ", then over his left shoulder toward the sea on "ใต้ทะเล" (turn-head, est).
- **Sound:** S1 stops at f 0 with a small last dribble; M1 ducked −20 dB; A1 −10; V01 in the clear.
- **Acceptance:** face above y 1160; lead ≥ 480 px; hose end in frame.

### B02-SH01 — why not satellites? (L04)

- **Camera (R):** high back wide `pos (1.3, 2.6, 2.6)` targeting (−1.5, 0.5, −6), yaw −18, `{f 1000, hy 560}` → 8° arc to yaw −10, 6 % push.
- **Framing:** MAN ≈ 598 px at x ≈ 390 (recorded wide), P09 with the hose in his right fist; the bay and the long sea to the horizon fill the frame; boats B1–B3 and TR visible.
- **Staging:** shake-head on "ทำไม"; face worried (seen in profile edge); trawler drifts.
- **Sound:** A1 −14; M1 at 2; no SFX.
- **Acceptance:** horizon reads long; band over wall and sand.

### B02-SH02 — the sky (W-SKY)

- **Purpose:** the delay; he looks up for a satellite.
- **Camera (R):** low angle from the phone side `pos (−0.55, 0.95, −0.85)` looking up at his face, `{f 900, hy 1500}` → slow tilt-up/push 6 %.
- **Framing:** MAN chest-up from below, P30 visor (left hand shading his eyes), face suspicious squint, head ≈ y 700; sky upper right; a tiny satellite blinks at about (860, 260).
- **Key state:** the satellite's blink mid-shot; at the end a small bubble starts from that spot (ui pop at the cut).
- **Sound:** music out; A1 at −16; S8 `reveal_glass-pluck-ring_01` (lib) on the blink; near silence.
- **Acceptance:** face above y 1160; satellite tiny (≤ 14 px), clear of LBL.

### B02-SH03 — helicopter vs motorway (L05, L06)

- **Purpose:** the analogy in one bubble.
- **Camera:** yard behind the bubble: OTS `camMove(at (−0.1, 1.5, −3), yaw 2 → 6, r 4.1, eye 1.85, {f 760, hy 740})`, 4° arc (W3.1: r 4.1 per Q8 accepted, the rest from LF04 so his head top sits at y ≈ 828 above the band; was at x −0.3, y 1.6, r 3.6, eye 1.9, f 1000, hy 980) (his head and shoulder lower right as the bubble's owner). Bubble in BUB (90–990, 200–900), tail to his head. Inside the bubble: picture-stage push 1.0 → 1.10 over L05, page-turn wipe in the gap between L05 and L06, push 1.0 → 1.08 over L06 (fixed plane, recorded reason).
- **Key states:** bubble pops on at the shot start (ui pop); L05: toy helicopter lifts one crate of four glowing cubes on "เฮลิคอปเตอร์", bobs; "ทีละนิด" the crate swings. L06: page-turn wipe to the motorway (about 20 lanes of light streaks) on "สายใต้ทะเลเส้นเดียว"; on "ทางด่วนหลายสิบเลน" the lanes squeeze to the centre and roll into one thin glowing cable crossing the bubble.
- **Sound:** A1 −10; M1 back at 2.5 on L05; S24 `ui_pop_01` (lib) at the bubble pop; S9 toy helicopter flutter (NEEDS-GEN), 2 s, light rotor passing left to right; S10 motorway to cable (NEEDS-GEN), broad traffic wash tightening into a low hum, 2.5 s, across the fold.
- **Acceptance:** LF04; the fold reads as many lanes into one line in ≤ 1.5 s; bubble bottom above y 1160.

### B03-SH01 — the deep cable (L07a: "แต่กลางทะเลลึก… สายที่แบกเน็ตข้ามโลก")

- **Camera (W deep):** truck along the cable `camMove(at (0.6, −46, −300), yaw 90, r 1.6, eye −45.4, {f 1000, hy 820})` → at (0.6, −46, −303); 3 m lateral truck, `easeInOutSine`.
- **Framing:** the cable crosses the frame left to right on y ≈ 900, a pulse riding it; ooze, a sea pen, dark.
- **Sound:** hard cut: M1 stops dead at the cut; M3 held note (NEEDS-GEN) begins; A3 deep hush; S6 tick once.
- **Acceptance:** cable readable; band over ooze.

### B03-SH02 — hose vs cable (L07b: "หนาแค่ประมาณสายยางรดน้ำ")

- **Purpose:** K02 paid, at equal scale.
- **Camera:** upper half (R): `camMove(at (0.18, 0.95, −0.30), yaw 90, r 0.50, eye 0.95, {f 1000, hy 640})` on the hose in his right hand, sunlit; lower half (W deep): `camMove(at (0.6, −46, −303), yaw 90, r 0.50, eye −46, {f 1000, hy 1080})`; both truck 0.1 m together.
- **Framing:** wavy waterline seam (N15) at y ≈ 860; hose on y ≈ 640, cable on y ≈ 1080, both 40 px ±2, parallel, left ends aligned at x ≈ 300.
- **Key state:** the seam wipes in from frame bottom up to y 860 on "หนาแค่"; holds.
- **Sound:** M3 continues alone; S1 faint in the upper half (−20 dB); A3 under.
- **Acceptance:** one still proves 40 px both; cable line at y 1080 + 20 < 1160.
- **Fallback:** match cut hose → cable on the same screen line.

### B03-SH03 — "แค่นี้เองเหรอ?" (V02)

- **Camera (R):** `camMove(at (0.05, 1.30, 0), yaw 123, r 1.55, eye 1.45, {f 1000, hy 740})` → 5 % push.
- **Framing:** MAN head-to-waist ≈ 576 px; `new: hose-pinch` with the end at chest height, pinch at (388, 836); face surprised.
- **Key state:** pinches on "แค่"; the spray sputters out.
- **Sound:** M3 releases; S11 hose pinch (NEEDS-GEN), rubbery squeak-boing with a little water sputter, 0.5 s, on the pinch; V02 in the clear; M1 returns at 1.5 at shot end.
- **Acceptance:** pinch contact above y 1160; lead ≥ 480.

### B04-SH01 — the dark open sea (L09a: "แล้วอะไรทำมันขาดล่ะ")

- **Camera (R):** OTS `pos (0.40, 1.78, 1.30)` aimed at the far horizon left, yaw ≈ −2, `{f 1000, hy 600}` → 6 % push.
- **Framing:** back of his head lower left, the bay, the dark open-sea band, horizon at y ≈ 600.
- **Staging:** P09 with the hose; slight lean forward, peering.
- **Sound:** A1; M1 thin at 1.
- **Acceptance:** boats in frame (K01 not pointed at).

### B04-SH02 — not the deep: the shallows (end of L09 + L10)

- **Purpose:** the twist as a camera move.
- **Camera (W):** sink `camMove(at (0.5, −48, −420), yaw 0, r 8, eye −44, {f 1000, hy 760})` (empty deep, the calm cable) → on "แปลกตรงที่" turn 180° and climb along the cable up the slope `camMove(at (0.8, −6.5, −58), yaw 180, r 9, eye −5, {f 1000, hy 700})`, facing the shore; big move, `easeInOutSine`, ≈ 70 % of the shot.
- **Key states:** on "ไม่ใช่กลางทะเลลึก" the camera arrives in the bright shallows: three hulls overhead, anchor chains hanging to the sand, the cable a buried ridge with a bared stretch at z −52 → −58.
- **Sound:** A3 → A2 (both stems); S12 climb riser (NEEDS-GEN), 3 s, under the climb; S13 chain clinks (NEEDS-GEN) as chains enter frame; M1 at 2.5.
- **Acceptance:** cable continuous through the move; hulls and chains read; band over sand.

### B04-SH03 — "เอ๊ะ?" (V03)

- **Camera (R):** OTS `pos (0.42, 1.78, 1.25)` aimed at the boats, yaw ≈ 1, `{f 1000, hy 700}` → 5° arc.
- **Framing:** back of his head x ≈ 184 → turns into profile; B2 x ≈ 613, B1 and B3 visible; TR far right.
- **Staging:** turn-head-right, face worried as the profile comes round.
- **Sound:** M1 ducked −20; A1; V03 in the clear.
- **Acceptance:** boats all readable; profile above y 1160.

### B04-SH04 — anchor and net (L12)

- **Camera (W shallows):** follow truck low over the sand `camMove(at (−1.0, −5.4, −51), yaw 70, r 3.2, eye −4.6, {f 1000, hy 760})` → at (1.2, −5.6, −55), yaw 78.
- **Key states:** on "สมอ" the anchor drags in from left on its chain (from a boat above, off frame top), ploughing a furrow; on "เกี่ยว" its fluke catches the bared cable at K, lifts it 0.4 m taut; on "ขาด" it parts with a puff of sand, the glow stops at the break; on "อวนลาก" the otter board and net scrape past in the background.
- **Sound:** A2; M1 at 3; S14 anchor drag (NEEDS-GEN), chain rattle, gritty sand drag, strain and one taut muffled snap on "ขาด", 3 s; S15 trawl scrape (NEEDS-GEN), 2 s, on "อวนลาก".
- **Acceptance:** anchor reads as an anchor; contact at K above y 1160; break clear.

### B04-SH05 — the rule (L13: "สายไม่ได้กลัวทะเลลึก… มันกลัวเรือ")

R1.1 (user Q2, 2026-11-14): a **3D cutaway block**, not the flat diagram. Same refrain picture: the calm deep cable on one side, the busy shallow bay full of boats on the other.

- **Set (D, block units, est; brief [cutaway block](film-brief.md#set-plans--globe-bubble-red-sea-flashback-seabed-est)):** block x −4.5 → +4.5 (shore end −x, deep end +x), z −1.5 → +1.5 (front cut face at z +1.5), water top y 0, floor y −1.0 (x ≤ −1.5) sloping to y −5.0 (x ≥ +1.5), base y −5.6. Anchors: beach strip x −4.5 → −3.7 on top; longtail A (−3.3, 0, 0.6), longtail B (−2.6, 0, −0.7), cabin boat (−2.0, 0, 0.4), trawler (−1.2, 0, −0.9), each moored by a chain to an anchor on the floor below it; net bag on the floor at (−1.8, −1.0, 0.9); shallow cable ridge along z +0.9 from x −4.5 to −1.5 with the **break KD at x −2.4** (glow ends there); deep cable along z +0.9 on the floor from x +1.5 to +4.5, glowing steady; empty water surface over the deep half.
- **Camera (D):** `camMove(at (0.3, −2.4, 0), yaw −6 → −14, r 12.0 → 13.8, eye 3.0 → 3.4, {f 1150, hy 380})`, `easeInOutSine` over the shot; pos (1.55, 3.0, 11.93) → (3.64, 3.4, 13.39) (sheet yaw convention above: negative yaw puts the camera on the +x side, so the deep end face turns into view). 8° yaw arc + 15 % pull-out = the script's "pull out wide". Projection: one pinhole; the block holds still, only the camera moves.
- **Framing (est, pinhole scratch):** block about 860 px wide at the start, 750 px at the end, centred x ≈ 540; boat tops y ≈ 530, top front edge y ≈ 665, block base y ≈ 1200 → 1130 (above the caption band 1176–1344 at the end; Boss checks the start frame with `scripts/shot-projection.py` at W4 and lifts `hy` if the base enters the band). Shore and boats screen-left, deep screen-right at every frame. Mark zone clear (backdrop only).
- **Depth / layers (back → front):** backdrop wash and the block's soft contact shadow → back and far faces → floor, slope, strata → cables, anchors, chains, net → boats on the top face (miniatures, waterline at y 0) → the front cut face as a glaze ≤ 0.35 (bright top-left → near-black bottom-right) → the deep end face (x +4.5).
- **Key states:** on "ทะเลลึก" the deep half settles: the deep cable's glow brightens a touch and holds steady (the calm side), the shallow half dims slightly; on "มันกลัวเรือ" the four boats on the left bob once in sequence and their chains tug taut and slack. Ambient clock through the shot: ripple on the top face, slow boat bob, faint particles in the shallow water only.
- **Claim limits:** no number, metres, depth scale or scale bar; no labels planned (if any are needed, depth-neutral words only); no fault statistic; no natural hazard; the break KD continues B04-SH04's anchor snag.
- **Sound (unchanged by R1.1):** S16 `stinger_low-muted-hit_01` (lib) on "เรือ", on M1's downbeat: one short low muted hit, fast decay, the rule landing like a full stop; then M1 at 2. No new cue for the block (a model has no place sound).
- **Acceptance:** LF07 plus the N12 3-still arc strip; faces sort correctly through the arc with no popping or edge slivers; shore left / deep right at every frame; deep cable glow and all four boats readable at 1×; block above the caption band; no number or non-neutral label. **Fallback:** the flat side-section diagram (R1 plan: picture-stage pull-out 1.18 → 1.0 + 30 px truck, same layout and key states).

### B05-SH01 — the Red Sea (L14a: "แต่ปี 2024 ในทะเลแดง… เรือลำหนึ่งโดนขีปนาวุธ")

- **Camera (F):** long lens `camMove(at (−4, 6, 0), yaw 16 → 12, r 260 → 200, eye 3, {f 1300, hy 900})`, slow push (W3.1: Q8 accepted push-in to 260 m, ending on LF05 at r 200, broadside from the T5B pick; was yaw 70 → 62, r 380 → 340, eye 4, f 1400).
- **Framing:** the listing damaged ship (N10) across the middle, stern low, scorch patch, thin smoke drifting −x; grey sea; LBL "ภาพจำลอง" top-right from the first frame of L14; CARD "2024 · ทะเลแดง" top-left under the mark.
- **Sound:** M1 out on L14; M2 dark pulse (NEEDS-GEN) at 1.5; A5 open sea (NEEDS-GEN); S17 hull groan (NEEDS-GEN), distant, 2.5 s, after "ขีปนาวุธ" (no hit on the word).
- **Acceptance:** LF05; no missile/fire/flag/crew/name; grade on.

### B05-SH02 — three cables go dark (L14b: "แล้วสายขาดสามเส้น")

- **Camera (FS):** low over the floor `camMove(at (0, 0.2, 0), yaw 25, r 6, eye 1.4, {f 1000, hy 820})` → 3 m truck.
- **Key states:** C1, C2, C3 go dark on "สาย", "ขาด", "สามเส้น".
- **Sound:** A2 stem (a), low-passed; M2; S18 `pulse_underwater-soft-thump_01` (lib) ×3 on the three words.
- **Acceptance:** LF06; depth-neutral palette; LBL and CARD on; grade on.

### B05-SH03 — sounds deliberate (L15a: "ฟังเหมือนจงใจ…")

- **Camera (R):** `camMove(at (0, 1.45, 0), yaw 125, r 1.40, eye 1.50, {f 1000, hy 660})` → 5 % push.
- **Framing:** MAN medium-close, face suspicious, eyes narrowed at the phone; phone back lower left kept above y 1160 (Boss tunes hy); normal colour; LBL stays on; no CARD.
- **Sound:** A1 −14; M2 continues.
- **Acceptance:** LBL on; no grade; face above y 1160.

### B05-SH04 — probably its own anchor (L15b: "แต่ทำเนียบขาวบอกว่า น่าจะโดนสมอเรือลำนั้นเอง ลากพื้น")

- **Camera (F → FS):** start under the drifting hull looking along the bow chain `camMove(at hawse (70, −3, 0), yaw 90, r 20, eye −6, {f 1000, hy 600})`; run down the taut chain (35°) to `camMove(at anchor (0, 1.2, 0)FS, yaw 25, r 6, eye 1.6)`; big descent `easeInOutSine`, done by "สมอ".
- **Key states:** on "สมอ" the 2.5 m anchor ploughs a furrow over C1–C3; held through "ลากพื้น" (furrow continuing).
- **Sound:** S19 turn sting (NEEDS-GEN), two soft muted marimba notes, the second a step up and open, 0.6 s, on "แต่"; M2 thins; S20 chain run-out (NEEDS-GEN), 1.5 s, under the run-down; S14-texture drag under the furrow.
- **Acceptance:** chain continuous hull → anchor; LBL on; grade on; same drag look as B04-SH04.

### B05-SH05 — "oh, the anchor" (gap after L15)

- **Camera (R):** `camMove(at (0.05, 1.25, 0), yaw 123, r 1.91, eye 1.42, {f 1000, hy 760})`, 4° arc.
- **Staging:** LBL off on the first frame; face surprised, eyebrows up, glance toward the boats (turn-head-right).
- **Sound:** A1 back at −8; M2 out; no SFX.
- **Acceptance:** label off; lead ≥ 480.

### B06-SH01 — breaks every week (L17)

- **Camera (G):** `r 3.4, eye 0.35`, slow 8° orbit, warm light lift.
- **Key states:** red sparks flicker on 6–8 near-coast segments through the line.
- **Sound:** M1 returns warm at 2; S21 spark crackle (NEEDS-GEN) ×4 variations on sparks.
- **Acceptance:** sparks mostly near coasts; no numbers.

### B06-SH02 — the reroute (L18)

- **Camera (G):** push to the junction J, `r 2.0`, 5 % push.
- **Key states:** on "ไม่รู้ตัว" spark on L7, L7 dims; on "อ้อม" its pulse slides through J onto L8.
- **Sound:** S22 glitch (NEEDS-GEN), 0.3 s, on the dim; S23 glide (NEEDS-GEN), 0.6 s, on the slide.
- **Acceptance:** reroute reads at 1×.

### B06-SH03 — still talking (L19a: "สายที่เขาคุยอยู่ตอนนี้…")

- **Camera (R):** `camMove(at (0, 1.25, 0), yaw 126, r 2.15, eye 1.45, {f 1000, hy 700})` → 4° arc; MAN ≈ 800 px.
- **Staging:** `new: hose-water` again, laugh → happy + talk to the phone; spray on.
- **Sound:** A1, S1 back; M1 at 1.5; sister's laugh through the phone speaker (Editor TTS casting, filtered small speaker).
- **Acceptance:** lead ≥ 480; warm grade.

### B06-SH04 — the line goes around (L19b: "ก็อาจกำลังอ้อมอยู่" + W-HOLD)

- **Camera (R):** crane up behind from `camMove(at (−0.3, 1.1, −0.6), yaw 3, r 2.2, eye 1.7, {hy 640})` to `camMove(at (−0.4, 1.0, −1.0), yaw −8, r 4.55, eye 3.6, {f 1000, hy 440})`; ease-out; the last 20 f move < 0.5 % of distance; hold ≈ 2 s (W-HOLD).
- **Framing end:** MAN ≈ 492 px (recorded tableau), head y ≈ 977; boats y 460–550; the faint dashed signal line from his phone dips over the beach into the bay and bends along a curve toward the headland.
- **Key states:** the line draws on "อ้อม"; holds with ambient motion.
- **Sound:** M1 out before the hold; END1 (NEEDS-GEN) on the hold's first frame: the S2 chime interval on marimba + glass bell, resolving, 2.2 s; A1 fades to silence on the last frame.
- **Acceptance:** closed hold, no loop seam; line curved (bookend of B01-SH01).

## Dependencies and open items

- Boss: N1–N15 (brief table); look frames LF01–LF07 at W3.
- Ton: every NEEDS-GEN cue above; library checks by ear (M1, S7, S8, S16, S18, S24).
- Editor: V01–V03 and the sister's laugh casting; voice lock for W4.
- Questions for the user (all answered 2026-11-14): Q1 sister's snowy-window room as the abroad cue (kept as drawn, country unnamed); Q2 answered 2026-11-14: 3D cutaway block (applied in R1.1); Q3 over-under split frame for hose vs cable (kept as drawn).

## Change log

- 2026-11-15 superseded for timing and camera numbers by [scene-sheets.md](scene-sheets.md) EDU-EP17-SHEETS-R1.0 (Film W5.1; staging deviations SD01–SD17 there) and review rows EDU-EP17-ROWS-R2.0 (timed). This file keeps the untimed R1.2 text.

- 2026-11-15 EDU-EP17-ROWS-R1.2 (Film W3.1; user picks 2026-11-15 LF01 = T1A, LF02 = T2B, LF03 = T3B, LF04 = T4B, LF05 = T5B, LF06 = T6A, LF07 = T7B, Q8 accepted): B01-SH03 end camera 1.2 m over the cable (above the floor); B02-SH03 r 4.1 with the LF04 framing; B05-SH01 push 260 → 200 m broadside (LF05); B01-SH05 camera from LF01R (pending Q4, old numbers kept as the fallback). Yard boats side-on is a set change (brief K01). Timing, VO, sound and every other shot unchanged. Look frames: brief "Look frames", `src/painted/edu17/looks.tsx`.
- 2026-11-14 EDU-EP17-ROWS-R1.1 (Film W2, user structured answers 2026-11-14): Q2 applied: B04-SH05 restaged as a 3D cutaway block (set anchors, camera, framing, layers, key states, claim limits, acceptance, flat-diagram fallback); its sound unchanged; Q1 and Q3 kept as drawn. No other shot touched.
- 2026-11-14 EDU-EP17-ROWS-R1.0 (Film W2): first untimed pass, 25 shots, from script R1.2.1 and brief R1.
