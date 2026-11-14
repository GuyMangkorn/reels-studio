# Storyboard — EDU-EP17-SHORT (timed scene sheet)

Deliverable: `EDU-EP17-SHORT` · Revision: **EDU-EP17-SHEET-R1.2 (timed scene sheet, W3 look-frame revision R1.2: predator volume build, shots 21–23)** (Film, 2026-11-14).
Inputs: [script.md](script.md) EDU-EP17-SCRIPT R2.2 (user-locked) · Boat's R2 check (recorded in script.md; research in [../ep16/research-r2.md](../ep16/research-r2.md)) · [film-brief.md](film-brief.md) **EDU-EP17-BRIEF-R1** · series decisions in [EP16 brief](../ep16/film-brief.md) · voice lock: EP17 narration R2.2 (`ep17_narration_kore_x1.05.3f4b801b.wav`) + R2.2 character takes + L10 whisper take (`ep17_L10_whisper_kore.wav`, 2.40 s).
Target: worktree `adoring-panini-24500a`, branch `claude/education-oak-street-dino-23617a` at `d4f0ee2` (uncommitted EP16–18 files) · 30 fps · **durationFrames 1815 (60.50 s)** · 1080×1920 · one scene S01, offset 0.
Evidence: timing measured from the audio files by silence detection (voice-take R2.2/R2.3; `out/voice/ep16-18-r23/est.py` model, re-run in Film's scratch `tl.py`); not listened by Film. Camera numbers are design estimates checked with `scripts/shot-projection.py` (each world-space shot, start and end camera); no look frame, plate, blockout or render exists yet. Readiness: **ready for look frames (W3) and Boss/Ton intake; not ready-for-dev until the user passes the look frames and the new looks** (see Dependencies).
Rows file: [review-rows.json](review-rows.json) **EDU-EP17-ROWS-R1.3** (Thai, timed; look frames v16 + r12 for the predator). Review page: pending.

## Units, clocks and conventions

- Clocks: **global** `f` = composition frame (scene S01, offset 0); **shot-local** `+n` = `f − shot start`. Ranges are half-open `[start, end)`. Character takes and W rows are placed by the est.py model: lead 0.25 s, narration gaps as read, +0.2 s padding next to character/W items; W-RAIN, W-DUSK and W-PRED are picture-only gaps at their script lengths.
- Spaces (brief [projection contract](film-brief.md#projection-contract)): `VIL` village (m; origin on the ground at the yard centre, +x east, +y up, +z south toward the usual camera), `RIV` river (m; origin on the near bank waterline at the fishing spot, +x downstream, +z toward the bank), `SHOP` (m; origin at the shop floor centre, +z toward the door), `UNDER` is the part of `VIL` under the house (same axes). Screen: px, origin top-left, y down.
- Camera lines use the kit yaw camera `camMove(at, yaw, r, eye, {f, hy, pitch})`: camera at `at + r·(sin yaw, 0, cos yaw)` at height `eye`, yaw 0 = camera on +z of the target. `proj` lines are `scripts/shot-projection.py` output (start → end; `band` = touches y 1176–1344, `cropped` = partly out of frame by design unless flagged).
- Caption band y 1176–1344 (edu stroke captions, `captionStyle.position` bottom); faces, contacts, cards and reveals above y 1160; `@TamMaiLa` mark top-left (keep x < 330, y < 140 clear). Lead ≥ 480 px applies to M/MC/CU shots; W/EW shots are named wides and list the lead height for reference.
- Sizes: EW extreme wide, W wide, M medium, MC medium close, CU close, INS insert, MAC macro, OH overhead.

## Casting

| Role | Casting line | Notes |
| --- | --- | --- |
| ยาย (Y) | `woman-elder + new: isan-home (pha sin, loose cotton blouse, pha khao ma at the waist; kitchen-apron over it in morning shots)`, P01/P34/P32, worried/stern/laugh | 1.52 m; voice Gacrux (character takes); four views squared to the lens |
| เก่ง (K) | `boy-school + new: kid-home (faded tee, shorts, flip-flops)`; fallback `boy-school + park-casual` with a recorded reason | 1.30 m, about 10; voice Leda boy |
| Villagers | PEOPLE (`man-elder`, `man-buzz`, `woman-curly`, `woman-bob`, `man-crop`) + `new: isan-home` colour variants | background crowd; 1.55–1.72 m |
| Neighbours | `man-buzz + new: isan-home` (matches, sh14); axe hands (sh7) | 1.70 m |
| Hen (K01) | `new: Thai backyard hen (gai ban: red-brown, black tail, small comb)`, peck/trot/head-tilt/huddle/cluck | 0.42 m to the comb; three-toed scaly feet readable in CU |
| Long-neck far | `new: long-neck far` (drinking, out of focus layer) | sh17 only |
| Predator | `new: spinosaurus-like, firelight only` (R1.1, user 14 Nov 2026: tall rounded ridged sail with vertical ribs, long narrow crocodile-like snout with conical teeth, crouched biped, large three-clawed hands, long tapering tail, brownish-grey skin with a reddish flush on sail and tail; proportions from the user reference `projects/edu/EDU/references/user/2026-11-14_spinosaurus-ref.png`; painted in our style, no film likeness, never named on screen (VD-S04)); length ≈ 13 m, back top ≈ 4.4 m, hip 3.45 m, sail top ≈ 6.4 m, head ≈ 2.15 m long, snout tip ≈ 1.0 m above ground when lowered; R1.2 volume build (lofted body, thick crouched hind legs with thigh mass, robust arms with three big claws, far-side limbs one value darker, translucent ribbed sail), seen in true front-3/4 / side / rear-3/4 by the yaw camera (turnaround `AS-SPINO-TURN`); asset `paintSpino` + `spinoStride` in src/painted/survival/creatures.ts | sh21–23; never looks up, harms no one (user, 13 Nov 2026) |

## Shot map

| # | Shot | Beat | Lines | Range | Len | Start s | Size | One-line read |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | S01-B01-SH01 | B01 | L01 | [0, 92) | 92 | 0.00 | EW | Signature (shared with EP16 shot 1) |
| 2 | S01-B01-SH02 | B01 | L02 | [92, 149) | 57 | 3.07 | W | Morning reveal, push toward the stilt house |
| 3 | S01-B01-SH03 | B01 | L02 | [149, 168) | 19 | 4.97 | INS | "ไม่ใช่ทอง": Grandma's gold necklace on a hook |
| 4 | S01-B01-SH04 | B01 | L02 | [168, 199) | 31 | 5.60 | INS | "ไม่ใช่มือถือ": Keng's phone held high, no bars |
| 5 | S01-B01-SH05 | B01 | L02, V01 | [199, 298) | 99 | 6.63 | M | "แต่คือกองฟืน" + V01: the woodpile; Keng lowers the phone |
| 6 | S01-B02-SH06 | B02 | V05 | [298, 379) | 81 | 9.93 | MC | V05: Keng points the phone at the forest |
| 7 | S01-B02-SH07 | B02 | L02b | [379, 424) | 45 | 12.63 | CU | L02b: a fresh log split open is wet inside |
| 8 | S01-B02-SH08 | B02 | L02b | [424, 489) | 65 | 14.13 | M | L02b: push to the dry woodpile under the house |
| 9 | S01-B03-SH09 | B03 | L03 | [489, 598) | 109 | 16.30 | M | L03 "ข้อแรก": clear stream; Grandma catches Keng's wrist |
| 10 | S01-B03-SH10 | B03 | V02 | [598, 673) | 75 | 19.93 | MC | V02: Keng holds up his cupped clear water |
| 11 | S01-B03-SH11 | B03 | L04 | [673, 732) | 59 | 22.43 | CU | L04: push into the cupped water; nothing shows |
| 12 | S01-B03-SH12 | B03 | L05 | [732, 877) | 145 | 24.40 | W | L05: a row of temple-fair pots steaming; the woodpile shrinks |
| 13 | S01-B04-SH13 | B04 | W-RAIN | [877, 928) | 51 | 29.23 | W | W-RAIN: downpour; tarps over the pile; Keng's bucket under the eaves |
| 14 | S01-B04-SH14 | B04 | L06 | [928, 1052) | 124 | 30.93 | M | L06 "ข้อสอง": a neighbour strikes match after match at a wet log |
| 15 | S01-B04-SH15 | B04 | L06b | [1052, 1126) | 74 | 35.07 | M | L06b: Keng lifts the brimming bucket; Grandma points to the pot |
| 16 | S01-B05-SH16 | B05 | W-DUSK, V03 | [1126, 1222) | 96 | 37.53 | M | W-DUSK/V03: orange dusk at the stream, mosquitoes; Keng slaps his arm |
| 17 | S01-B05-SH17 | B05 | L07 | [1222, 1299) | 77 | 40.73 | MAC | L07: mosquito on a fern frond; a long-neck drinks far behind |
| 18 | S01-B05-SH18 | B05 | L08 | [1299, 1425) | 126 | 43.30 | M | L08 "ข้อสาม": Grandma adds green leaves; smoke drives the mosquitoes off |
| 19 | S01-B05-SH19 | B05 | V04 | [1425, 1502) | 77 | 47.50 | MC | V04: Grandma tosses another log on, sighing |
| 20 | S01-B06-SH20 | B06 | L09 | [1502, 1587) | 85 | 50.07 | W | L09 "ข้อสุดท้าย": the family on the veranda; the hens go silent |
| 21 | S01-B06-SH21 | B06 | W-PRED | [1587, 1632) | 45 | 52.90 | M | W-PRED: a huge foot and head enter the firelight, sniffing |
| 22 | S01-B06-SH22 | B06 | W-PRED | [1632, 1683) | 51 | 54.40 | M | W-PRED: from the veranda, Grandma's hand over Keng's mouth; it steps around the fire |
| 23 | S01-B06-SH23 | B06 | L10 | [1683, 1815) | 132 | 56.10 | W | L10 whisper: it walks off into the dark; the fire crackles on |

Total 1815 f = 60.50 s; 23 shots; shots tile [0, 1815) with no gap.

## Voice and subtitle cues (global frames)

| Item | Speaker | Item range | Voice | Source |
| --- | --- | --- | --- | --- |
| L01 | ผู้บรรยาย | [8, 93) | [8, 93] | `~/ReelsStore/projects/edu/EDU/voice/ep17_narration_kore_x1.05.3f4b801b.wav` (R2.2) |
| L02 | ผู้บรรยาย | [100, 232) | [100, 232] | `~/ReelsStore/projects/edu/EDU/voice/ep17_narration_kore_x1.05.3f4b801b.wav` (R2.2) |
| V01 | เก่ง | [238, 292) | [251, 284] | `out/voice/ep16-18-r23/send/ep17_V01_boy.wav` |
| V05 | เก่ง | [298, 373) | [302, 362] | `out/voice/ep16-18-r23/send/ep17_V05_boy.wav` |
| L02b | ผู้บรรยาย | [379, 475) | [379, 475] | `~/ReelsStore/projects/edu/EDU/voice/ep17_narration_kore_x1.05.3f4b801b.wav` (R2.2) |
| L03 | ผู้บรรยาย | [489, 592) | [489, 592] | `~/ReelsStore/projects/edu/EDU/voice/ep17_narration_kore_x1.05.3f4b801b.wav` (R2.2) |
| V02 | เก่ง | [598, 667) | [607, 654] | `out/voice/ep16-18-r23/send/ep17_V02_boy.wav` |
| L04 | ผู้บรรยาย | [673, 721) | [673, 721] | `~/ReelsStore/projects/edu/EDU/voice/ep17_narration_kore_x1.05.3f4b801b.wav` (R2.2) |
| L05 | ผู้บรรยาย | [732, 871) | [732, 871] | `~/ReelsStore/projects/edu/EDU/voice/ep17_narration_kore_x1.05.3f4b801b.wav` (R2.2) |
| W-RAIN | — | [877, 922) |  | picture only |
| L06 | ผู้บรรยาย | [928, 1041) | [928, 1041] | `~/ReelsStore/projects/edu/EDU/voice/ep17_narration_kore_x1.05.3f4b801b.wav` (R2.2) |
| L06b | ผู้บรรยาย | [1052, 1120) | [1052, 1120] | `~/ReelsStore/projects/edu/EDU/voice/ep17_narration_kore_x1.05.3f4b801b.wav` (R2.2) |
| W-DUSK | — | [1126, 1156) |  | picture only |
| V03 | เก่ง | [1162, 1216) | [1167, 1206] | `out/voice/ep16-18-r23/send/ep17_V03_boy.wav` |
| L07 | ผู้บรรยาย | [1222, 1282) | [1222, 1282] | `~/ReelsStore/projects/edu/EDU/voice/ep17_narration_kore_x1.05.3f4b801b.wav` (R2.2) |
| L08 | ผู้บรรยาย | [1299, 1419) | [1299, 1419] | `~/ReelsStore/projects/edu/EDU/voice/ep17_narration_kore_x1.05.3f4b801b.wav` (R2.2) |
| V04 | ยาย | [1425, 1496) | [1434, 1482] | `out/voice/ep16-18-r23/send/ep17_V04_grandma.wav` |
| L09 | ผู้บรรยาย | [1502, 1581) | [1502, 1581] | `~/ReelsStore/projects/edu/EDU/voice/ep17_narration_kore_x1.05.3f4b801b.wav` (R2.2) |
| W-PRED | — | [1587, 1677) |  | picture only |
| L10W | ผู้บรรยาย | [1683, 1755) | [1688, 1746] | `out/voice/ep16-18-r23/send/ep17_L10_whisper_kore.wav` |
| hold | — | [1755, 1815) | — | end hold 2 s (est.py rule) |

Subtitles: every narration and character line, exactly the script text (Thai unchanged); no subtitle on W rows or the hen cluck. Narration subtitle on the voice range; character subtitles on their voice range.

## Word-pegged key frames

- L02 "ไม่ใช่ทอง" f149 (measured), "ไม่ใช่มือถือ" ≈ f168 (est, syllable), "แต่คือกองฟืน" f199 (measured)
- L02b "ต้องตาก" ≈ f424 (est)
- L03 "ข้อแรก" ends f507 (measured)
- L05 "อย่างกับมีงานบุญ" f836 (measured)
- L06 phrase 2 f954, "เปียกฝน" f996 (measured)
- L06b "แต่ก็ต้องต้ม" f1093 (measured)
- L07 phrase 2 f1239 (measured)
- L08 f1327, f1352, "ควันช่วย" f1387 (measured)
- L10 whisper voice f1688–1746 (separate take)

## On-screen text (global ranges)

- Rule cards (Film's call: used): "ข้อ 1" f489–598, "ข้อ 2" f928–1052, "ข้อ 3" f1299–1425, "ข้อสุดท้าย" f1502–1587. Slot RC: a small painted wooden sign, top right x 760–1020, y 180–290 (clear of the mark at top left); text crisp SVG over the painted board, Thai 72 px bold; pops in over 6 f with a 2° wobble, out over 8 f at the range end (DF-20261030-painted-screen-layers-overlay, DF-20261030-painted-label-slots).
- No other text besides subtitles; the phone screen in shot 4 shows bars only.

## Rules for every shot

- R01 Truth limits: dinosaurs are hazards or props only (no species name on screen, no film likeness); creatures are partial builds as listed (head/neck, foot/head, silhouettes, far herds).
- R02 Size reference: every shot keeps one known-size reference in frame (K 1.30 m, Y 1.52 m, a hen, the fence 1.2 m, a cup or jar).
- R03 Feet on the ground: planted feet sit on y 0 (or the platform/veranda/granary floor y named in the shot); no float, sink or slide while planted.
- R04 Screen: faces, contacts, cards and reveals above y 1160; the caption band calm (mean ≤ 0.25, p95 ≤ 0.40 on clean frames, `scripts/caption-zone.py`).
- R05 Retention camera (channel): every shot has a small eased yaw arc (6–10°) and a 5–15 % push unless the shot says hold; frame 0 of shot 1 already shows the rippling sky.
- R06 Light marks the chapter (brief visual progression); night shots use the opaque cast base (DF-20261031-painted-opaque-cast).
- R07 Ambient clocks: fire, hens, fronds, water and mosquitoes run on ambient clocks through holds (DF-20261030-painted-story-hold-ambient-clock); event clocks are shot-local.
- R08 Four views squared to the lens: Y, K, villagers and the hen pick the view by the camera yaw (front / 3/4 / side / back), view cues on.
- R09 Woodpile continuity: full (sh2–8) → three shrink steps in sh12 → covered by tarps (sh13–15) → the evening fire feeds from it; K02: the house stands high on its posts in every yard shot.
- R10 W-PRED: the predator never looks up at the house and harms no one; the family is safe up on the veranda.

## Per-shot staging

Key frames are shot-local `+n`. Every library ID in a Sound line is a candidate only (not listened); Ton checks it against the description, otherwise NEEDS-GEN. Codes (A-, M-, S-, E-) are defined in the [EP16 brief sound direction](../ep16/film-brief.md#sound-direction).

**1. S01-B01-SH01** [0, 92), 92 f. Signature (shared with EP16 shot 1). VO: L01 voice f8–93 (+8–+92).
- Camera: `cam: at (-1, 2, -6), yaw 35→32, r 22→20.5 m, eye 1.6, f 760, hy 880`, ease in-out over the shot (est) (space VIL).
- proj: house_ridge 201 px, x 382, y 728–929 → 215 px, x 365, y 717–932; coop 66 px, x 691, y 880–946 → 70 px, x 710, y 880–950; gate 36 px, x 721, y 892–928 → 38 px, x 724, y 893–931; conifer 555 px, x 810, y 355–910 → 565 px, x 796, y 345–910. Wide: no lead check.
- Staging: Identical picture and timing to EP16 shot 1 (one shared plate/scene module, see the EP16 brief VD-S01). K02 here: the stilt house's posts and the woodpile under it are readable as dark shapes under the warm window.
- Key frames: +0 ripple moving; +8 VO; +84 white bloom; cut in white at +92.
- Sound: A-VN; S-WORM (shared). No music.
- Entry → exit: +0 night wide → +91 white.

**2. S01-B01-SH02** [92, 149), 57 f. Morning reveal, push toward the stilt house. VO: L02 voice f100–232 (+8–+57).
- Camera: `cam: at (-1, 2, -6) → (-5, 1.8, -6), yaw 32→26, r 20.5→16 m, eye 1.6, f 760, hy 880`, ease in-out over the shot (est) (space VIL).
- proj: house_ridge 215 px, x 365, y 717–932 → 305 px, x 447, y 649–954; woodpile 39 px, x 354, y 889–928 → 54 px, x 412, y 892–946. Wide: no lead check.
- Staging: Hard cut to VIL morning, same framing, then a push west toward the stilt house: its high posts and the woodpile under it (K02). Villagers start the day.
- Key frames: +0 white → morning; +8 L02 starts ("ของที่มีค่าที่สุด…"); +56 last frame.
- Sound: M17 pickup: brisk wooden march figure (pong lang + hand drum) from +0; A-VM.
- Entry → exit: +0 yard wide → +56 the house and the pile under it.

**3. S01-B01-SH03** [149, 168), 19 f. "ไม่ใช่ทอง": Grandma's gold necklace on a hook. VO: L02 voice f100–232 (+0–+19).
- Camera: `cam: at (-3, 1.6, -3.1), yaw 0→6, r 0.55→0.5 m, eye 1.6, f 1000, hy 900`, ease in-out over the shot (est) (space VIL).
- proj: necklace 423 px, x 540, y 708–1131 → 468 px, x 533, y 687–1155. Lead: necklace.
- Staging: Close on ยาย's thin gold chain hanging on a nail on the house post (−3.0, 1.37–1.59, −3.07), morning light glinting. Nobody touches it.
- Key frames: +0 "ไม่ใช่ทอง"; glint travels along the chain +2–+12; +18 last frame.
- Sound: S17-01 tiny glint chime +3 (thin metal shimmer, 0.3 s, NEEDS-GEN).
- Entry → exit: +0 necklace → +18 same.

**4. S01-B01-SH04** [168, 199), 31 f. "ไม่ใช่มือถือ": Keng's phone held high, no bars. VO: L02 voice f100–232 (+0–+31).
- Camera: `cam: at (0.55, 1.5, 0.45), yaw 30, r 0.9→0.8 m, eye 1, f 1000, hy 1100, pitch 30°`, ease in-out over the shot (est) (space VIL).
- proj: phone 110 px, x 540, y 941–1051 → 116 px, x 540, y 880–996; K_head 379 px, x 451, y 1298–1677 [band] → 419 px, x 439, y 1258–1677 [band]. Lead: phone.
- Staging: Low angle (pitch 30°) up at K's phone held high at arm's length (0.55, 1.58, 0.45); the screen shows no signal bars (crisp SVG screen, no words); K's head and hair at the bottom of frame, `worried`.
- Key frames: +0 "ไม่ใช่มือถือ" (est onset f168); the phone wobbles left-right twice +4–+26; +30 last frame.
- Sound: S17-02 one dull error buzz from the phone +6 (short low vibrate, 0.3 s).
- Entry → exit: +0 phone high → +30 phone high.

**5. S01-B01-SH05** [199, 298), 99 f. "แต่คือกองฟืน" + V01: the woodpile; Keng lowers the phone. VO: L02 voice f100–232 (+0–+33); V01 voice f251–284 (+52–+85).
- Camera: `cam: at (-8, 1.5, -5), yaw 30→22, r 7→6 m, eye 1.1, f 820, hy 880, pitch 10°`, ease in-out over the shot (est) (space VIL).
- proj: K 468 px, x 604, y 958–1426 → 777 px, x 1022, y 920–1697; woodpile 123 px, x 556, y 1006–1129 → 138 px, x 527, y 1004–1142; house_floor 16 px, x 518, y 789–805 → 20 px, x 577, y 730–750; hen 49 px, x 637, y 1108–1157 → 56 px, x 646, y 1120–1176 [band]. Lead: K.
- Staging: Under-house woodpile W1 (x −9.5..−8.3, z −7.5..−6.3, 1.3 m high, split logs stacked neat), hens pecking by it (K01). K walks in from frame right to (−5.6, 0, −1.2), lowers the phone, `smug`/unimpressed (P10 phone at chest).
- Key frames: +0 "แต่คือกองฟืน"; +6 hens peck; +20 K enters; +52–+85 V01 ("ฟืนเนี่ยนะ?" one eyebrow up); +98 last frame.
- Sound: M17 brief stop on +0 (tick), resumes +20; S17-03 hens pecking on dirt +6 loop (light, dry); S17-04 a sceptical phone-lock click +50 (tiny, close).
- Entry → exit: +0 the pile with hens → +98 K unimpressed in front of it.

**6. S01-B02-SH06** [298, 379), 81 f. V05: Keng points the phone at the forest. VO: V05 voice f302–362 (+4–+64).
- Camera: `cam: at (-5.6, 1, -1.2), yaw 40→48, r 2.4→2.1 m, eye 1, f 900, hy 960, pitch 6°`, ease in-out over the shot (est) (space VIL).
- proj: K 509 px, x 540, y 942–1451 → 584 px, x 540, y 927–1511; westfence 111 px, x 114, y 1036–1147 → 108 px, x 223, y 1037–1145. Lead: K.
- Staging: K swings round 180° and points the phone at the green forest wall beyond the west fence (`turn-around` then P05 point side), `happy`, trunks everywhere behind.
- Key frames: +0 turn (10 f); +4–+64 V05; +20 arm fully out; +80 last frame.
- Sound: M17 two-beat flourish +20; A-VM; S17-05 sleeve swish on the turn +2.
- Entry → exit: +0 turning → +80 pointing at the forest.

**7. S01-B02-SH07** [379, 424), 45 f. L02b: a fresh log split open is wet inside. VO: L02b voice f379–475 (+0–+45).
- Camera: `cam: at (-2, 0.45, -0.5), yaw 30→38, r 1.3→1.1 m, eye 0.9, f 950, hy 900, pitch -15°`, ease in-out over the shot (est) (space VIL).
- proj: block 272 px, x 540, y 968–1240 [band] → 308 px, x 540, y 1021–1329 [band]; log 284 px, x 540, y 684–968 → 330 px, x 540, y 691–1021; nb_hands 178 px, x 507, y 467–645 → 201 px, x 546, y 444–645. Lead: log.
- Staging: Chopping block (−2.0, 0, −0.5). A neighbour's axe (only hands and blade) splits a freshly cut log: the inside is pale and wet-dark, a bead of sap. Camera low, looking down 15°.
- Key frames: +0 axe up; +6 blade contact (log top, y 0.85); +8–+20 halves fall apart; +44 last frame.
- Sound: S17-06 axe into green wood +6 (heavy thock, wet fibre squeal, close, dry acoustic, 0.5 s, NEEDS-GEN).
- Entry → exit: +0 whole log → +44 wet halves.

**8. S01-B02-SH08** [424, 489), 65 f. L02b: push to the dry woodpile under the house. VO: L02b voice f379–475 (+0–+51).
- Camera: `cam: at (-8.9, 0.7, -6.2), yaw 10→20, r 2→1.6 m, eye 1, f 950, hy 940`, ease in-out over the shot (est) (space VIL).
- proj: Y 675 px, x 957, y 709–1384 → 918 px, x 1112, y 626–1544 [cropped]; pile_face 617 px, x 540, y 798–1415 → 772 px, x 540, y 762–1534. Lead: Y.
- Staging: Push to the pile face (−8.9, 0, −6.2): grey, cracked, dry logs (K02); ยาย pulls one dry log out and knocks it (it rings hollow), `smug`.
- Key frames: +0 "ต้องตาก" (est f424); +20 Y pulls a log; +38 knock; +64 last frame.
- Sound: S17-07 dry log knock +38 (hollow, bright wooden clack, 0.3 s).
- Entry → exit: +0 pile → +64 Y with a dry log.

**9. S01-B03-SH09** [489, 598), 109 f. L03 "ข้อแรก": clear stream; Grandma catches Keng's wrist. VO: L03 voice f489–592 (+0–+103).
- Camera: `cam: at (0.4, 0.6, 0.3), yaw 160→170, r 2.2→1.9 m, eye 0.55, f 900, hy 1000, pitch 8°`, ease in-out over the shot (est) (space RIV).
- proj: K_kneel 400 px, x 540, y 964–1364 → 464 px, x 540, y 939–1403; Y 541 px, x 219, y 792–1333 [band] → 576 px, x 225, y 771–1347; pebbles 39 px, x 825, y 1624–1663 → 55 px, x 790, y 1815–1870. Lead: K_kneel.
- Staging: SET-RIVER shallows, water so clear the pebbles show. K kneels at R2 (0.4, 0, 0.3) and cups his hands to drink; Y (1.1, 0, 0.9) catches his wrist. Rule card "ข้อ 1" pops in (screen slot RC). At the end a big pot is set on a fire on the bank (background, frame left).
- Key frames: +0 card "ข้อ 1" on ("ข้อแรก" ends f507 = +18); +20 hands cupped near the mouth; +40 Y's hand closes on his wrist (contact); +70 Y points to the pot; +108 last frame.
- Sound: M17 pauses to a light pulse; A-RV (stream over pebbles); S17-08 water scooped in cupped hands +12 (small splash, close); S17-09 card pop +0 (wooden peg tap, 0.2 s).
- Entry → exit: +0 K kneeling → +108 wrist held, the pot on the fire.

**10. S01-B03-SH10** [598, 673), 75 f. V02: Keng holds up his cupped clear water. VO: V02 voice f607–654 (+9–+56).
- Camera: `cam: at (0.4, 0.7, 0.3), yaw 175→168, r 1→0.9 m, eye 0.75, f 1000, hy 900`, ease in-out over the shot (est) (space RIV).
- proj: K_kneel 950 px, x 540, y 700–1650 → 1055 px, x 540, y 678–1733; hands 97 px, x 559, y 961–1058 → 111 px, x 592, y 969–1080. Lead: K_kneel.
- Staging: K close, kneeling, holds up his cupped hands of perfectly clear water (0.4, 0.62, 0.12), `smug` pout.
- Key frames: +9–+56 V02; +60 a drip falls from his fingers; +74 last frame.
- Sound: A-RV; S17-10 single drip into the stream +60.
- Entry → exit: +0 cupped hands up → +74 same.

**11. S01-B03-SH11** [673, 732), 59 f. L04: push into the cupped water; nothing shows. VO: L04 voice f673–721 (+0–+48).
- Camera: `cam: at (0.4, 0.7, 0.3), yaw 175→168, r 1→0.9 m, eye 0.75, f 1000, hy 900`, ease in-out over the shot (est) (space RIV).
- proj: K_kneel 950 px, x 540, y 700–1650 → 1055 px, x 540, y 678–1733; hands 97 px, x 559, y 961–1058 → 111 px, x 592, y 969–1080. Lead: K_kneel.
- Staging: Continuation of shot 10's camera: push from r 0.9 to 0.5 m into the cupped water; it stays perfectly clear (no germ graphics; the point is that nothing shows).
- Key frames: +0 push starts; +48 tightest; +58 last frame.
- Sound: M17 one held low note; A-RV low-passed slightly.
- Entry → exit: +0 hands → +58 water filling the frame.

**12. S01-B03-SH12** [732, 877), 145 f. L05: a row of temple-fair pots steaming; the woodpile shrinks. VO: L05 voice f732–871 (+0–+139).
- Camera: `cam: at (2, 1, 3) → (-6, 1, -4.5), yaw 30→25, r 5→7.5 m, eye 1.5, f 820, hy 920`, ease in-out over the shot (est) (space VIL).
- proj: pot1 246 px, x 1487, y 1084–1330 [cropped, band] → behind; pot4 130 px, x 366, y 1006–1136 → behind; villager 311 px, x 339, y 901–1212 [band] → behind; woodpile 56 px, x 346, y 929–985 → 98 px, x 419, y 935–1033. Lead: villager.
- Staging: VIL yard: four huge temple-fair pots (กระทะ/หม้อใหญ่) on wood fires in a row at z 3, x 0.6..6; villagers queue with buckets (`new: bucket`). Camera trucks west to the woodpile, which visibly shrinks (painted dissolve, three steps). K03 (EP17 clue): the sugar and salt jars on the under-house kitchen shelf, soft, at the end of the move.
- Key frames: +0 pots steaming; +30 queue; +60–+120 truck west; woodpile shrink dissolves at +90, +110, +130; +104 "อย่างกับมีงานบุญ"; +144 last frame.
- Sound: M17 full march with a festive reed line on +104; A-VM + crowd murmur; S17-11 fires roaring under the pots loop (big, layered, warm); S17-12 buckets clank +30, +55.
- Entry → exit: +0 pots → +144 a small pile.

**13. S01-B04-SH13** [877, 928), 51 f. W-RAIN: downpour; tarps over the pile; Keng's bucket under the eaves. VO: W-RAIN voice f877–922 (+0–+45).
- Camera: `cam: at (-6.5, 1.2, -4), yaw 15→8, r 6→5.2 m, eye 1.3, f 820, hy 840`, ease in-out over the shot (est) (space VIL).
- proj: K 282 px, x 658, y 840–1122 → 348 px, x 757, y 840–1188 [band]; bucket 60 px, x 543, y 1038–1098 → 73 px, x 600, y 1085–1158; woodpile 113 px, x 404, y 840–953 → 127 px, x 348, y 840–967. Lead: K.
- Staging: Sudden downpour (ENV-FALL rain). Villagers drag tarps and banana leaves over the woodpile; K hugs an armful of logs to his chest, then shoves a bucket under the eaves where the roof water pours (−6.0, 0, −2.2).
- Key frames: +0 rain hits; +10–+30 tarp pulled; +32 K drops the logs under cover; +40 bucket placed, water drumming in.
- Sound: M17 cut; A-RN heavy rain on thatch and tin from +0; S17-13 tarp drag and flap +10 (rough plastic, wet); S17-14 water drumming into a tin bucket from +40 (rising pitch as it fills).
- Entry → exit: +0 rain → +50 bucket filling.

**14. S01-B04-SH14** [928, 1052), 124 f. L06 "ข้อสอง": a neighbour strikes match after match at a wet log. VO: L06 voice f928–1041 (+0–+113).
- Camera: `cam: at (-4, 0.4, -3.4), yaw 40→48, r 1.6→1.4 m, eye 0.7, f 950, hy 820`, ease in-out over the shot (est) (space VIL).
- proj: nb_squat 820 px, x 516, y 604–1424 → 992 px, x 439, y 559–1551; log 79 px, x 567, y 1055–1134 → 88 px, x 588, y 1086–1174. Lead: nb_squat.
- Staging: Under the house out of the rain: a neighbour squats (P32, `man-buzz + new: isan-home`) striking matches at a soaked log; only smoke and a hiss. Rule card "ข้อ 2".
- Key frames: +0 card "ข้อ 2"; +26 match 1 flares and dies; +68 "เปียกฝน" match 2; +100 match 3 dies, a wisp of smoke; +123 last frame.
- Sound: A-RN under eaves (muffled); S17-15 match strike ×3 at +26, +68, +100 (candidate `foley_match-strike_01`, Ton tests); S17-16 hiss of wet wood +30, +72, +104 (short sizzle-out); S17-09 card pop +0.
- Entry → exit: +0 neighbour with matches → +123 smoke only.

**15. S01-B04-SH15** [1052, 1126), 74 f. L06b: Keng lifts the brimming bucket; Grandma points to the pot. VO: L06b voice f1052–1120 (+0–+68).
- Camera: `cam: at (-5.5, 1, -2.4), yaw 10→0, r 2.8→2.5 m, eye 1.1, f 920, hy 860`, ease in-out over the shot (est) (space VIL).
- proj: K 480 px, x 333, y 786–1266 [band] → 570 px, x 321, y 772–1342 [band]; Y 481 px, x 707, y 727–1208 [band] → 518 px, x 710, y 717–1235 [band]; pot 133 px, x 1085, y 1020–1153 [cropped] → 131 px, x 1039, y 1018–1149. Lead: K.
- Staging: Rain stopped, drip. K lifts the brimming bucket (P26 carry variant), `happy`; Y points from the bucket to the big pot (−3.6, 0, −3.4), then to the tarp-covered pile; his grin falls (`sad`).
- Key frames: +0 lift; +20 Y points to the pot; +41 "แต่ก็ต้องต้ม"; +50 points to the pile; +60 grin falls; +73 last frame.
- Sound: M17 deflating trombone-like reed slide +60 (candidate `stinger_marimba-deflate-shrug_01`, Ton tests); A drips from the eaves.
- Entry → exit: +0 bucket up → +73 K deflated.

**16. S01-B05-SH16** [1126, 1222), 96 f. W-DUSK/V03: orange dusk at the stream, mosquitoes; Keng slaps his arm. VO: W-DUSK voice f1126–1156 (+0–+30); V03 voice f1167–1206 (+41–+80).
- Camera: `cam: at (0.8, 1, 1), yaw 200→192, r 3.4→2.8 m, eye 1, f 880, hy 960`, ease in-out over the shot (est) (space RIV).
- proj: K 313 px, x 511, y 888–1201 [band] → 377 px, x 495, y 873–1250 [band]; mozzies 184 px, x 536, y 684–868 → 265 px, x 671, y 562–827. Lead: K.
- Staging: SET-RIVER at dusk, orange light; a thin cloud of mosquitoes over the water (0.3, 1.2, −0.4) drifts to K (1.0, 0, 1.2); he slaps his arm (`ouch`).
- Key frames: +0 dusk, cloud hovering; +30 cloud reaches him; +41 slap contact (palm on forearm); +41–+80 V03; +95 last frame.
- Sound: M17 out; A-DU (stream, frogs starting, mosquito whine rising from +0, NEEDS-GEN); S17-17 slap on forearm +41 (skin, sharp, close).
- Entry → exit: +0 dusk stream → +95 K rubbing his arm.

**17. S01-B05-SH17** [1222, 1299), 77 f. L07: mosquito on a fern frond; a long-neck drinks far behind. VO: L07 voice f1222–1282 (+0–+60).
- Camera: `cam: at (-1.5, 0.62, 1), yaw 80→72, r 0.06→0.05 m, eye 0.63, f 1000, hy 960`, ease in-out over the shot (est) (space RIV).
- proj: mozzie 100 px, x 540, y 1027–1127 → 120 px, x 540, y 1040–1160; LN_far 266 px, x 514, y 713–979 → 269 px, x 373, y 710–979. Lead: mozzie.
- Staging: Macro: a mosquito on a fern frond tip (−1.5, 0.62, 1.0), sharp; far behind, out of focus, a long-neck drinks at the stream (−35, 0, −4) (`new: long-neck far`, prop).
- Key frames: +0 mosquito still; +17 "ยุงมีอยู่แล้ว" (est); +40 the long-neck lifts its head slowly; +76 last frame.
- Sound: A-DU; S17-18 mosquito wing whine close +0 (thin, close, 1 s, NEEDS-GEN); far water slurp +40 (huge animal, distant).
- Entry → exit: +0 mosquito → +76 same, the long-neck head up.

**18. S01-B05-SH18** [1299, 1425), 126 f. L08 "ข้อสาม": Grandma adds green leaves; smoke drives the mosquitoes off. VO: L08 voice f1299–1419 (+0–+120).
- Camera: `cam: at (-1, 1.2, 1.5), yaw -30→-40, r 4→3.4 m, eye 1.3, f 850, hy 860`, ease in-out over the shot (est) (space VIL).
- proj: Y 417 px, x 493, y 800–1217 [band] → 521 px, x 537, y 785–1306 [band]; fire 127 px, x 540, y 1009–1136 → 150 px, x 540, y 1035–1185 [band]. Lead: Y.
- Staging: VIL yard evening fire F1. Y squats at (−1.6, 0, 2.2) and drops green leaves on the fire; white smoke rolls over the yard; the mosquito cloud thins. Rule card "ข้อ 3".
- Key frames: +0 card "ข้อ 3"; +28 leaves on (f1327); +53 smoke billows (f1352); +88 "ควันช่วย" cloud thins; +125 last frame.
- Sound: M17 night variant, soft drum; A-FI; S17-19 green leaves crackle and hiss on flame +28 (wet, sappy, 1 s); S17-20 mosquito whine fades out +88–+120; S17-09 card pop +0.
- Entry → exit: +0 fire → +125 smoky yard, no mosquitoes.

**19. S01-B05-SH19** [1425, 1502), 77 f. V04: Grandma tosses another log on, sighing. VO: V04 voice f1434–1482 (+9–+57).
- Camera: `cam: at (-1.5, 1, 2), yaw -10→-4, r 1.8→1.6 m, eye 1.1, f 950, hy 920`, ease in-out over the shot (est) (space VIL).
- proj: Y 911 px, x 502, y 668–1579 → 1036 px, x 482, y 634–1670; fire 239 px, x 702, y 1120–1359 → 267 px, x 747, y 1143–1410. Lead: Y.
- Staging: Y close by the fire, tired (`tired`), tosses another log on (P11 offer variant, throw).
- Key frames: +9–+57 V04; +40 log lands, sparks rise; +76 last frame.
- Sound: A-FI; S17-21 log onto fire +40 (thump, sparks crackle up, 1 s).
- Entry → exit: +0 Y with a log → +76 sparks.

**20. S01-B06-SH20** [1502, 1587), 85 f. L09 "ข้อสุดท้าย": the family on the veranda; the hens go silent. VO: L09 voice f1502–1581 (+0–+79).
- Camera: `cam: at (0.5, 1.5, -2), yaw 30→22, r 9→8 m, eye 1.2, f 820, hy 960, pitch 8°`, ease in-out over the shot (est) (space VIL).
- proj: Y_ver 94 px, x 547, y 905–999 → 101 px, x 509, y 891–992; K_ver 83 px, x 574, y 913–996 → 90 px, x 542, y 900–990; fire 77 px, x 155, y 1151–1228 [band] → 99 px, x 105, y 1171–1270 [band]; coop 134 px, x 930, y 1042–1176 [band] → 139 px, x 927, y 1041–1180 [band]. Lead: Y_ver.
- Staging: Night wide. The family up on the stilt-house veranda (floor y 2.4; Y (−1.4, 2.4, −5.5), K (−0.8, 2.4, −5.3)) (K02); the fire glowing in the yard below; the coop frame right: the hens go silent and huddle (K01). Rule card "ข้อสุดท้าย".
- Key frames: +0 card "ข้อสุดท้าย"; +10 hens stop clucking and press together; +40 the crickets stop too; +84 last frame.
- Sound: M17 out after +0; A-VN with the fire; S17-22 hens' clucks cut off one by one +10–+30; crickets stop +40 (SILENCE POLICY: fire crackle only from +40).
- Entry → exit: +0 night yard, fire → +84 silent yard.

**21. S01-B06-SH21** [1587, 1632), 45 f. W-PRED: a huge foot and the long snout enter the firelight, sniffing; sail edge above. VO: W-PRED voice f1587–1677 (+0–+45).
- Camera (R1.2): `cam: at (1.2, 1.8, 3.0), yaw -74→-68, r 5.2→4.8 m, eye 0.5, f 820, hy 780, cx +110, pitch 16°`, ease in-out over the shot (space VIL). Matches LF17-PRED (`CAM17_21`, src/painted/survival/look-b.tsx). R1.1 → R1.2: r 6.4→6.0 became 5.2→4.8 (closer), hy 820 → 780 (fire base out of the band), lens shift cx +110 (fire stays in at the left edge).
- proj (+0 / +8 / +40; Film probe `paintSpino(null, …)` of the look-frame camera): snout tip x 372, y 912 → x 335, y 905; eye x 594, y 786 → x 590, y 771; near claw tip x 755, y 900 → x 779, y 890; sail peak x 797, y 508 → x 835, y 477; near foot plant (+8) x 934, y 1070 → x 989, y 1075 (+40); far foot x 813, y 1060; creature box x 364–1000, y 485–1088 (+0) → x 328–1082, y 453–1096 (+40, tail tip cropped right); fire base x 129, y 1147 → x 57, y 1155, flame top y 854 → 846 (fire partly cropped left by design); hearth stones to y 1163 (+40). Lead: the creature, 603 px (+0) → 643 px (+40) tall; head (snout to eye) ≈ 255 px wide. Caption band: see Acceptance.
- Staging: Low camera by the fire, **front-3/4 of the animal's left flank** (R1.2, was 18° off side-on: the user's "paper doll" verdict). The spinosaurus-like animal (N17-02, volume build) stands crouched, body axis from O (−0.2, 0, 1.95) along (0.94, 0, 0.342) (R1.2, was (0.75, 0.661)), so the chest, near arm and near thigh face the lens and the body, sail and tail recede into the dark at frame right. Near foot ball (lens side) at (5.41, 0.14, 3.29), far foot ball at (6.35, 0.14, 2.84) (both planted, toe tips on y 0). Head lowered, snout tip ≈ (−0.2, 1.0, 1.95) toward the fire smoke, jaws closed with the conical teeth showing on the lip, sniffs, unbothered. Firelight only (one point light at the fire, reach 8 m, 15 fps flicker): warm on the snout, throat, chest, near arm and the front of the near thigh; starlight rim (amb 0.55) on the back, neck top and sail edge; far-side legs and arm one value darker; everything below 1.3 m darkens toward black (the dark lower frame). It never looks up at the house.
- Key frames: +0 dark edge, sail edge and snout faintly rim-lit; +8 near foot plants (contact x ≈ 934, y ≈ 1070); +20 snout enters the brightest light; +28–+44 two sniffs (nostril set back on the snout; smoke ribbon bends toward it).
- Sound: S17-23 heavy footfall +8 (huge, soft earth, sub thump, 0.8 s, NEEDS-GEN); S17-24 two big nasal sniffs +28, +38 (huge animal, close, dry, NEEDS-GEN); fire crackle continues.
- Entry → exit: +0 dark edge of firelight → +44 head in the light, sniffing.

**22. S01-B06-SH22** [1632, 1683), 51 f. W-PRED: from the veranda, Grandma's hand over Keng's mouth; it steps around the fire. VO: W-PRED voice f1587–1677 (+0–+45).
- Camera (R1.2): `cam: at (-1.8, 0, 5.2), yaw 181→179, r 7.8 m, eye 3.3, f 820, hy 720, pitch -8°`, ease in-out over the shot (space VIL; camera at (−1.94, 3.3, −2.60) → (−1.66, 3.3, −2.60), kneeling eye on the veranda floor y 2.4, 0.3 m arc). Matches LF17-PRED-22 (`CAM17_22`). R1 → R1.2 reason: the R1 lens (eye 3.6 at z −6.7) stood under the lean-to eave (y 3.8–4.35, 0.2–0.4 m over a standing eye), which hid everything above ≈ 3° of elevation, i.e. the whole back and sail of a 6.4 m animal; the veranda floor edge (z −1) hides the fire itself from any eye on the veranda, so the fire reads by its ground glow and the light on the animal.
- proj (+0 / +25 / +50): animal eye x 71, y 642 → x 55, y 643 (snout out left by design); sail peak x 371, y 336 → x 364, y 334; near claw tip x 174, y 744; near foot x 441, y 907, far foot (lifted) x 479, y 860; creature box x −23–1095, y 336–923 (head out left, tail out right); eave edge y 268; floor edge y 1040; fire glow edge y 1000; Y knee contact x 865 → 996, y 1156 → 1147; K knee contact x 129 → 256, y 1128 → 1136. Lead: the creature (587 px tall).
- Staging: Over-the-shoulder from the south end of the veranda: Y (−2.45, 2.4, −1.35) and K (−1.2, 2.4, −1.3) kneel at the rail as dark back views (P34, tinted toward night) at the frame's right and left edges, Y's hand over K's mouth (not drawn in the look still: Boss plate adds her arm reaching across to his mouth, open item). Below and beyond, the animal walks east 6–7 m past the fire (O (5.4, 8.0) at +25, axis (−0.985, −0.17) toward the tail, left flank to the lens: the reference side silhouette), mid-stride (`spinoStride` phase 0.3, head 0.6 carried), lit from below by the unseen fire. It never looks up.
- Key frames: +0 hand already over his mouth; +10–+45 it steps around the fire (two steps, at +14 and +34; proposed walk 2.0 m/s, untested in motion); +50 last frame.
- Sound: Footfalls +14, +34 (S17-23 variants); A fire only; no music, no breath sounds from them.
- Entry → exit: +0 the predator past the fire → +50 walking on.

**23. S01-B06-SH23** [1683, 1815), 132 f. L10 whisper: it walks off into the dark; the fire crackles on. VO: L10 voice f1688–1746 (+5–+63).
- Camera (R1.2): `cam: at (2, 1, 2), yaw -80→-84, r 5→5.6 m, eye 1, f 850, hy 760`, ease in-out over the shot (space VIL). Matches LF17-PRED-23 (`CAM17_23`). R1 → R1.2: hy 960 → 760 (the fire base sat in the caption band at y 1279–1359).
- proj (+0 / +20 / +40; animal at 2.0 m/s along (0.866, −0.5)): fire base x 136, y 1159 → x 147, y 1152 (+20) → x 282, y 1079 (+131), flame top y 692–706; animal box x 311–589, y 411–835 (+0) → x 302–525, y 443–828 (+20) → x 290–478, y 470–822 (+40); sail peak x 393, y 418 → x 359, y 474; feet y 816–830. Lead: fire (467 px flame to base).
- Staging: Low wide from behind the fire looking east: the animal walks away north-east toward the paddy and the fence (O (14.25, −4.33) at +0, axis (−0.866, 0.5) toward the tail; rear-3/4 of its right flank, so the right-side limbs are the near ones), the tail tip leaving the edge of the firelight; then hold on the fire. R1.2 path end ≈ (22, 0, −9) by +131 (was "to (14, 0, 4)"), out of the light by +40.
- Key frames: +5–+63 L10 whisper; +40 the tail leaves the light; +72–+131 hold on the fire (2 s).
- Sound: A fire crackle only; E-FIRE ending: one low muted wooden note at +72 and a soft pad that fades by +131 (NEEDS-GEN, UT15); footfalls fade +10–+40.
- Entry → exit: +0 the predator leaving → +131 the fire alone.

## Acceptance (timed checks for review and integration)

- Shot 3/4: necklace on "ไม่ใช่ทอง" f149, phone on ≈ f168, pile on "แต่คือกองฟืน" f199 (cuts on the pegs).
- Shot 7 +6: the axe contact; the wet inside reads (dark, sap bead) by +12.
- Shot 9: rule card "ข้อ 1" on at f489; the wrist catch at f529, above y 1160.
- Shot 12: three visible shrink steps on the pile by f862.
- Shot 14: three match strikes; each dies to smoke; card "ข้อ 2" at f928.
- Shot 20: the hens stop and huddle by f1512; crickets stop at f1542; only fire from there.
- Shot 21: the foot plant at f1595 above y 1160 (R1.2 probe: y 1070); the head in the light by f1607. Caption band y 1176–1344 on the clean R1.2 stills (`scripts/caption-zone.py`): shot 21 mean 0.143 / p95 0.188, shot 22 0.155 / 0.211, shot 23 0.191 / 0.344 (all pass).
- Shot 23: the predator out of the light by f1723; hold on the fire to f1814; ending note at f1755.

## New assets for Boss

| ID | Need | Kind | Shots | Status |
| --- | --- | --- | --- | --- |
| N17-01 | Shared from EP16: N16-01..N16-05, N16-11, N16-12 (village, forest, river, outfits, hen, ENV-FIRE) | shared | — | see EP16 sheet |
| N17-02 | `new: spinosaurus-like` (firelight only: planted foot, lowered long snout with nostrils and conical teeth, three-clawed hand, ridged sail edge, flank, tapering tail; walk cycle of 2 steps) | creature (look-defining) | 21–23 | exists-unintegrated: `paintSpino` R1.2 volume build + `spinoStride` walk-pose proposal (src/painted/survival/creatures.ts, uncommitted; stills LF17-PRED, LF17-PRED-22, LF17-PRED-23, turnaround AS-SPINO-TURN, r12); any yaw renders a true 3/4 / side / rear view; walk and sniff motion untested in motion (stills only); awaiting user approval of the stills |
| N17-03 | `new: long-neck far` drinking layer | creature layer | 17 | missing |
| N17-04 | Rule-card wooden sign (slot RC) with crisp SVG Thai text | screen card | 9,14,18,20 | missing |
| N17-05 | Mosquito cloud layer + single mosquito macro (on a frond) | ENV/prop | 16–18 | missing |
| N17-06 | Props: gold necklace on a nail, phone (kit rig `phone`) with no-bars screen, axe + chopping block + split log (wet inside), dry log, four temple-fair pots on fires, buckets, tarps, banana leaves, matches, rain bucket, big pot, green leaves | props | 2–19 | phone exists-integrated (rig prop); rest missing |
| N17-07 | ENV-FALL rain (kit) over the yard + roof run-off stream | ENV (existing) | 13 | existing-integrated (kit ENV-FALL); run-off missing |
| N17-08 | Smoke layer from green leaves (ENV-FOG drift) | ENV | 18 | exists in kit as fog; smoke look missing |

## Sound needs for Ton

| Code | Sound (source, action, material, space, length, feel) | Shots (shot-local frame) | Library candidate |
| --- | --- | --- | --- |
| M17 | Music: brisk camp-march in the same Isan family, pong lang + hand drum + phin, ≈ 112 bpm; festive reed line for "งานบุญ", deflate for the bucket gag, out from L09 | sh2–19 | NEEDS-GEN |
| E-FIRE | Ending: one low muted wooden note and a soft pad fading over 2 s, the fire crackle stays; quiet relief with a chill | sh23 +72 | NEEDS-GEN |
| S17-01 / S17-02 | Thin gold glint shimmer (0.3 s); dull phone error vibrate (0.3 s) | sh3 +3; sh4 +6 | NEEDS-GEN |
| S17-03..S17-07 | Hens pecking dirt; phone lock click; sleeve swish; axe into green wood (wet thock + fibre squeal, 0.5 s); hollow dry-log knock | sh5–8 | NEEDS-GEN |
| S17-08..S17-10 | Water scooped in cupped hands; card pop (wooden peg tap); single drip | sh9–10; card pops sh9,14,18,20 | NEEDS-GEN |
| S17-11 / S17-12 | Fires roaring under big pots (loop); bucket clanks | sh12 | NEEDS-GEN |
| A-RN / S17-13 / S17-14 | Heavy rain on thatch and tin; wet tarp drag and flap; water drumming into a tin bucket, rising pitch | sh13–15 | candidate `weather_rain-thunder-distant_01` (thunder may not fit) |
| S17-15 / S17-16 | Match strike ×3; short hiss of wet wood | sh14 +26,+68,+100 | match candidate `foley_match-strike_01` |
| A-DU / S17-17 / S17-18 | Dusk stream + rising mosquito whine; slap on forearm; close mosquito wing whine | sh16–17 | NEEDS-GEN |
| S17-19..S17-21 | Green leaves hiss on flame; mosquito whine fade; log onto fire with sparks | sh18–19 | NEEDS-GEN |
| S17-22 | Hens' clucks cut off one by one; crickets stop (silence policy) | sh20 +10..+40 | NEEDS-GEN |
| S17-23 / S17-24 | Huge soft footfalls on earth (sub thump, 0.8 s); two big nasal sniffs, close, dry; no roar | sh21–23 | NEEDS-GEN |

## Dependencies and open items

- Look frames (W3): LF-VIL-MORN, LF-RIVER, LF-RAIN, LF-DUSK, LF-NIGHT-FIRE; the predator look N17-02 (spinosaurus-like, R1.2 volume build: stills LF17-PRED, LF17-PRED-22, LF17-PRED-23 and turnaround AS-SPINO-TURN) needs the user's approval first. Open for Boat and the user: spinosaurus is Cretaceous (≈ 95 Ma, flowering plants already present) while the series forest is "no flowers" (SET-MESO-FOREST); and the reference proportions give ≈ 13 m length.
- Rule cards used (script leaves them to Film); user may drop them (shots unchanged).
- K03 (sugar/salt jars) sits in shot 12's end framing as a soft background plant only.
- Word pegs "ไม่ใช่มือถือ" and "ต้องตาก" are syllable estimates (no measured pause).
- Ear checks pending on R2.2 takes as listed in the voice-take notes.

## Change log

- 2026-11-14 R1 (Film): first timed scene sheet from the locked voice (EP17 narration R2.2 (`ep17_narration_kore_x1.05.3f4b801b.wav`) + R2.2 character takes + L10 whisper take (`ep17_L10_whisper_kore.wav`, 2.40 s)); 23 shots, 1815 f. Brief and sheet written in one invocation by the coordinator's assignment (AI04 exception noted in the handoff).
- 2026-11-14 R1.1 (Film, user verdict 14 Nov 2026 + user reference image): the predator becomes spinosaurus-like (casting, shot 21 camera/proj/staging, N17-02 status, open items); shots 22–23 keep their R1 cameras with a re-probe note for the larger animal. Wording only elsewhere; timing, narration and IDs unchanged.
- 2026-11-14 R1.2 (Film, user verdict on LF17-PRED R1.1: "Spino looks like a paper doll: it is turned side-on but the legs and arms look tiny, like paper"): N17-02 rebuilt as a volume model (casting line, N17-02 status, dependencies); shot 21 turned to a front-3/4 with the lens at r 5.2→4.8, hy 780, cx +110 (camera, proj, staging, acceptance); shot 22 camera re-designed (kneeling eye at the veranda's south end, under the eave) and shot 23 hy 960 → 760 with a north-east exit path; new stills LF17-PRED-22, LF17-PRED-23 and turnaround AS-SPINO-TURN (`out/survival/look-frames/r12/`). Timing, narration, sound cues and IDs unchanged.
