# Storyboard EDU-EP06-ROWS-R1.2 — EDU-EP06-SHORT (first pass, untimed)

- Revision **EDU-EP06-ROWS-R1.2** (Film W3, 2026-11-07; R1.1 + look frames LF01–LF04; brief EDU-EP06-BRIEF-R1.1 applies BC1–BC3). Earlier: R1.1 (Film W2.2; R1 + user answer Q-R1). Inputs: script **EDU-EP06-SCRIPT-R1.2** ([script.md](script.md), user-approved 2026-11-07, ending `A_fade`), brief **EDU-EP06-BRIEF-R1** ([film-brief.md](film-brief.md): SET-LIVINGROOM, close plates EYE/CATFACE, VD01–VD18, shot plan, K1–K8, N1–N7; user answers Q-F1/Q-F2/Q-F3 recorded 2026-11-07), fact-check [fact-check.md](fact-check.md) (R1.1 and R1.2 rechecks pass). No voice (W1.4 blocked, [voice-measure.md](voice-measure.md)).
- Status: `ready-for-dev` for the first storyboard review (camera and VO only). **Untimed**: the review page shows no times; the lengths below are the brief's `est` (total ≈ 53.4 s, 19 shots). W3 adds the look frames to the same rows; W5.1 writes timed scene sheets with integer frames from the voice-lock measure file. Not user-approved; no render, no runtime or visual validation.
- Review rows: [review-rows.json](review-rows.json) (Thai, one row per shot, `lines` cites the script line IDs). **Current rows: EDU-EP06-ROWS-R1.4** (voice-timed `start`/`end` from [scene sheets R1.1](scene-sheets.md), `timingEstimated: false`, L13 text = script R1.3); this file's shot list below is the R1.2 storyboard pass with R1.4 text fixes. Review page: pending (coordinator publishes).
- Units and owners: SET-LIVINGROOM in metres (origin floor at the sofa front-edge centre, +x right, +y up, +z into the room; night and day states); EYE and CATFACE close plates at 1 set-m ≈ 1 cm, reached only by a cut. Camera line: `cam: target, yaw a→b (orbit about the target), r, eye, f (px), hy (px)`, yaw 0 = on +z looking −z, positive yaw toward +x; or an explicit position. One kit yaw camera per shot owns projection; the owner and the cat are flat cards squared to the mid-shot camera (`squareToCam`); the visitor forearm is a world-space card; glow motes are a screen-space light layer. All positions `est` until LF01 and Boss's seated-eye measurement.
- Casting: OWN = **`woman-curly + new: home-lounge`** (4-head rig; P31 seated base; `new: seated-lean-in`, `new: seated-offer-palm`); CAT = **`cat-orange-tabby`** + K1–K8; close plates: EYE (promoted `edu02/eye.ts`, N3), **`new: cat-face-close`** (N2, look check VD18 first); `new: glare-repaint` (N4), `new: glow-pass` (N5), `new: visitor-hand` (N6).

## Shot list

Est s = brief shot-plan length (script N1 syllable estimate). Check = the observable test the shot must pass at Draft (brief spikes 1–8 where cited).

| Shot | Lines | Est s | Picture | Camera (brief, est) | Casting | Sound cue | Check | Look |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S01-B01-SH01 | L01 | 1.8 | Lamp-lit sofa; she leans in, eyes wide, no blink; cat on the right cushion, eyes soft half-closed (CL03, not featured) | T-PAIR arc yaw +28→+20, r 1.50→1.35 | `woman-curly + new: home-lounge, new: seated-lean-in, happy` (eyes `wide`, no blink); `cat-orange-tabby, sit, idle` lid 0.5 | NG-M1 in; NG-A1 + `tension_clock-pulse_01` | Spike 1: room reads in 1 s; her head ≥ 280 px; CL03 visible only on crop | LF01 |
| S01-B01-SH02 | L02a | 1.8 | Her eye ECU, wide, unblinking, warm catchlight | EYE yaw −8→−5, push 8 % | EYE lid 1.3, effects off | M1 continues; `bed_sub-drone-fade-in_01` creeps in | Same eye as `PL-EDU-EYE`; no blink frame; catchlight from screen left | (LF03) |
| S01-B01-SH03 | L02b | 1.8 | Cat face: pupils widen, whiskers stiffen, ears up | CATFACE r 16→14, yaw +6→+2 | `new: cat-face-close` pupil 0.35→0.9, whiskers 0→1 | Drone under M1 | Pupils/whiskers change readable at 270 px; ears stay up | (LF02 family) |
| S01-B01-SH04 | L03, V01 | 2.2 | She coos closer; ears flat; mrrp; cut-on-turn; stands, walks out +x | T-PAIR yaw +14→+18, r 1.25→1.20 | OWN lean 25°, `happy`; cat K2 ears 0→1, `left`→`right`, `stand-up`, `walk-out-to-right` | NG-S7 creak; NG-S1 mrrp; NG-S3 thump under the cut | No head-turn at medium (cut-on-turn); no sting on V01; paws do not slide | (LF01) |
| S01-B02-SH01 | L04 | 1.6 | Cat-side low vantage: she looms, staring; grade begins on/after "ลองนึก" | pos (+1.00, 0.72, +0.70)→(+0.92, 0.74, +0.58), target T-OWN, pitch +10° | OWN `front` ¾ (`quarterDeg` ~40), eyes `wide`, `neutral`; cat off frame | M1 out; `reveal_reverse-swell-airy_01`; drone + `tone_thin-unresolved_01` | Grade first frame ≥ first frame of "ลองนึก"; no cat-vision filter | (LF01→LF04) |
| S01-B02-SH02 | L05 | 2.2 | Her eye in the glare state, slow push | EYE yaw −4→−2, push 12 % | EYE lid 1.3 + `new: glare-repaint` grade 1 | Drone + thin tone hold | Spike 4: stern, still human; no slit pupil, red, blur | LF04 |
| S01-B02-SH03 | L06 | 4.0 | Her face close in the glare, drains back to warm on "…มากกว่าความรัก" | T-OWN cat side yaw +40→+36, r 0.72→0.68 | OWN ¾, `neutral` (stare); glare grade 1→0 over ~30 f | Thin tone fades; room tone returns | Drain starts inside "มากกว่าความรัก"; face reads same person as SH01 | (LF04→LF01) |
| S01-B03-SH01 | L07 | 3.6 | Widest frame: she sits back, turns to the cat on the armchair; ~1 m gap reads; ears relax | T-GAP yaw −20→−12, r 2.0→1.85 | OWN sit-back P31, `neutral`→`happy` soft; cat `sit` on armchair, K2 ears 1→0 | Piano returns very low; clock tick | Gap readable at 270 px; both eyes above y 1160 | (LF01) |
| S01-B03-SH02 | L08 | 5.4 | Eye: smile-narrow → close → hold "หนึ่ง… สอง…" → open | EYE yaw −6→−3, push 10 % | EYE lid 1.0→0.45→0→1.0 | NG-M3 note on "หนึ่ง", second on "สอง" | Spike 2: lid states keyed to the words; no numbers on screen | LF03 |
| S01-B04-SH01 | (silence) | 2.0 | Cat face turns back, holds, half-close; chime; halo; motes drift frame left | CATFACE head yaw −45→0, r 14→13 | `new: cat-face-close` lid 0→0.58, brow relax, ears relaxed | Music out; room tone + tick; `reveal_glass-shimmer-soft_01` on the half-close frame | Spike 3: "relaxed/content", lid ≤ 0.6; no hearts/sparkles | LF02 |
| S01-B04-SH02 | L03b | 1.6 | Her delighted soft face (rhymes B02-SH03, warm); motes arrive from frame right | T-OWN cat side yaw +40→+38, r 0.75→0.70 | OWN ¾, `happy` + `whisper`, eyes `half` | Room tone; `bed_warm-pad-felt-third_01` / NG-M2 returns | Screen direction of motes matched across the cut | (LF01) |
| S01-B04-SH03 | L09 | 5.6 | Cat stands, steps up onto the sofa arm, walks along it, steps down to the cushion; she watches | T-PAIR→T-CAT-SOFA yaw +8→+16, truck x +0.70→+0.35, r 1.6 | cat `stand-up`, K7 `step-up`, `walk-in-from-right`; OWN `happy` | NG-M2 warmer; NG-S4 paw steps | Spike 6: paws plant, hop 0.20 m, no float; no graphic | (LF01) |
| S01-B04-SH04 | L10a | 2.6 | Day cutaway: visitor forearm, still palm from frame left; same cat leans, steps, sniffs | T-STRANGER-HAND yaw +15→+10, r 0.90→0.80, eye 0.22; 6 f dissolve in | `new: visitor-hand`; cat `stand`, K4 lean 0→0.7, `sniff` | `room_soi-morning-quiet_01` crossfade; NG-S5 sniffs | Spike 5: other person within 1 s; no rub, no face, no text | (LF01 day) |
| S01-B04-SH05 | L10b | 2.4 | Night again: cat rubs its head into her offered palm twice; she smiles | T-HAND yaw +20→+26, r 0.90→0.85; hard cut in | OWN `new: seated-offer-palm`, `happy`; cat `front`, K5 `head-rub`, lid 0.5 | Night tone back; NG-S6 rubs | Spike 7: contact ±6 px; palm still | (LF01) |
| S01-B05-SH01 | L11, V02 | 3.6 | Wide B03 framing (user Q-R1): she sits back and slow-blinks at the cat sitting on the armchair, the ~1 m gap readable | T-GAP yaw −12→−18, r 1.85→1.95 | OWN P31 sit-back, `happy`, eyes half→shut→half→open + `squint`; `cat-orange-tabby, sit, idle` on the armchair facing her (`left`), lid 0.5, ears relaxed | NG-S2 purr fades in, very low; M2 warm | Gap readable at 270 px; blink readable at wide; cat faces her (not half-turned as in B03) | (LF01 warm) |
| S01-B05-SH02 | L12 | 3.4 | Insert: tail curls over her knee; her hand open, still | T-KNEE yaw +30→+34, r 0.60→0.55, pitch −20° | OWN hand on thigh, open; cat K6 `tailTo` T-KNEE | Purr; NG-S8 settle | Tail tip lands on the knee anchor; hand does not move | (LF01 warm) |
| S01-B05-SH03 | L13 | 5.6 | Two-shot holds, warmest; slow push | T-PAIR yaw +10→+6, r 1.50→1.35 | OWN `happy`, eyes `half`; cat curled, lid 0.5 | Piano low until "ที่คนเลี้ยงแมวหลายคนเชื่อว่ามันกำลังบอก" ends; resolve on "…รัก" | Attribution clause audible; no hearts or text | (LF01 warm) |
| S01-B05-SH04 | (closing) | 1.0 | Cat face curled, slow half-close toward her | CATFACE roll +10°, r 15→14 | `new: cat-face-close` lid 0.2→0.6 | Resolve chord; purr; optional quieter chime (Editor) | Lid ≤ 0.6 | (LF02) |
| S01-B05-SH05 | (closing) | 1.2 | Her soft smile; fade to black over the last 0.8 s | T-OWN yaw +36→+34, r 0.75→0.72 | OWN ¾, `happy`, eyes `half` | Chord, purr, room tone fade to true silence | Spike 8: smile reads at 270 px; last frame full black; live, no freeze | (LF01 warm) |

## Rules carried from the brief and fact-check (every shot)

- **R01** No on-screen text except captions and `@TamMaiLa`: no study card, chart, numbers, labels or "imagined view" tag; nothing in L09–L10 implies a stare-vs-blink test.
- **R02** The cat's answer and the closing blink are a **half-close** (lid ≤ 0.6), never a full close; no hearts, sparkles or love symbols; the glow is light only (≤ 0.3).
- **R03** The glare is painterly light on her own human eye, starting on/after "ลองนึก"; never a cat-vision filter, slit pupil, red or blur. The cat-side frames are a vantage, not cat sight.
- **R04** L10's approach finding is pictured with an **unfamiliar person's** hand (day cutaway), never the owner; lean + step + sniff only, no rub.
- **R05** CL02: OWN holds `eyes: 'wide'` with no `blinking()` through B01. CL03: the cat's soft eyes in B01-SH01 are visible but never centred, lit or held.
- **R06** Room ↔ EYE/CATFACE is always a cut, never a continuous zoom.
- **R07** Frame zones: caption band y 1176–1344 (`bottomEdgeY` 1344, ≤ 2 lines, edu stroke, no band); eyes, faces, hand contact and the cat's head above y 1160; nothing important above y 140. No title (Q-F2).
- **R08** Sound carries no fact; the purr is never explained; no sting on V01; L13 attribution audible under the resolve.

## Per-shot staging

Each block: staging (SET-LIVINGROOM metres or close-plate set-cm, `est`), camera, light, sound, check. Shot-local integer frames and SFX frame cues come in W5.1; times below are seconds into the shot at the brief's est length. Library IDs from `~/ReelsStore/library/sound/INDEX.md` (checked by the brief 2026-11-07; generated entries "not listened"); NG-* = the brief's NEEDS-GEN list.

### S01-B01-SH01 — L01 (LF01)
- **Staging:** OWN hips (−0.15, 0.35, −0.40) (W3: seat 0.30 m for the 4-head seated rig; brief R1.1), feet z +0.05, facing +z, `front`; lean 15°→20° toward +x over the shot, hands on the cushion between them; eyes `wide`, no blink. Cat sitting on the right cushion (+0.45, 0.30, −0.42), `left` view (facing her), lid 0.5 (CL03), ears up, tail sway ambient. Mug, phone face-down, feather toy, clock, window glow as set.
- **Camera:** `cam: T-PAIR (+0.15, 0.95, −0.40), yaw +28→+20 arc, r 1.60→1.45 m (W3: r 1.75→1.60 in LF01, cx +60), eye 1.00, f 1050, hy 760`; sofa ~25° to lens.
- **Light:** lamp key from screen left (shade (−1.05, 1.45, −0.55), halo ≤ 0.3), cool violet fill right, window night glow.
- **Sound:** NG-M1 (fallback `bed_eg2-solo-piano-sparse_01`) in at 0; NG-A1 room tone + `tension_clock-pulse_01` low.
- **Check:** spike 1; the cat findable but the woman is the first read.

### S01-B01-SH02 — L02 "แมวหลายตัว… อาจอ่านสายตาแบบนี้ว่า…"
- **Staging (EYE, set-cm):** her right eye, lid 1.3 (wide) held, no blink; EP02 mist/sparks/tear off; warm catchlight upper left.
- **Camera:** `cam: EYE (EP02 LF03_CAM arc base), yaw −8→−5, push 8 %`.
- **Light:** warm lamp from screen left, soft skin falloff.
- **Sound:** M1 continues; `bed_sub-drone-fade-in_01` starts ~0.6 s, very low.
- **Check:** same eye as `PL-EDU-EYE`; no lid motion > 0.02 through the shot.

### S01-B01-SH03 — L02 "เป็นการท้าทาย"
- **Staging (CATFACE, set-cm):** head front, yaw −5° (toward her, i.e. the lens side), pupil 0.35→0.9 over 0.2–1.2 s, whiskers 0→1 over 0.4–1.4 s, ears up (0), lid 0.15 (eyes open, no longer soft).
- **Camera:** `cam: CATFACE eyes midpoint, yaw +6→+2, r 16→14 set-cm, f 1000, hy 820`.
- **Light:** warm key screen left, cool fill right.
- **Sound:** drone under M1 (M1 ducks −3 dB).
- **Check:** change readable at 270 px; cat matches body-rig coat (M brow, cheek stripes, pale chin, amber eyes).

### S01-B01-SH04 — L03, V01
- **Staging:** OWN lean 20°→25°, head to (+0.10, 1.05, −0.30) at the L03 peak (~0.8 s), elbows back (DF-20261030-painted-arm-depth). Cat at (+0.45, 0.44, −0.40): K2 ears 0→1 at ~1.0 s (on V01), cut-on-turn at ~1.3 s to `right` view, `stand-up` then `walk-out-to-right` along the cushion toward +x, exits frame right by the end. No leap on screen (VD06).
- **Camera:** `cam: T-PAIR, yaw +14→+18, r 1.25→1.20 m, eye 0.95, f 1100, hy 760`.
- **Light:** warm as SH01.
- **Sound:** OWN L03 (voice at W4); NG-S7 creak on the lean (~0.2 s); NG-S1 mrrp on the ear flatten; NG-S3 landing thump under the cut out. M1 dips; no sting.
- **Check:** cut-on-turn hides the head turn; paws do not slide; the cat is not cowering (dramatization, not fear).

### S01-B02-SH01 — L04 "ลองนึกจากฝั่งแมวดู…"
- **Staging:** cat off frame (on the armchair below/behind the lens). OWN seated as at the B01 end (lean 25° easing to 20°), staring at the lens side, `front` three-quarter (`quarterDeg` ~40).
- **Camera:** `cam: pos (+1.00, 0.72, +0.70) → (+0.92, 0.74, +0.58), target T-OWN (−0.15, 1.12, −0.38), pitch +10°, f 1050, hy 700`.
- **Light:** warm at 0; `glare-repaint` grade 0→0.4 starting on/after the first syllable of "ลองนึก", on her (and her frame) only.
- **Sound:** M1 out; `reveal_reverse-swell-airy_01` into "ลองนึก"; drone + `tone_thin-unresolved_01`.
- **Check:** grade start frame ≥ "ลองนึก" onset (W5.1 frame); a vantage, no filter.

### S01-B02-SH02 — L05 (LF04)
- **Staging (EYE):** lid 1.3 held; glare grade 0.4→1 over ~24 f from shot start, then held: cool key above-front, hard brow shadow across the upper lid, iris a step darker, one small sharp white catchlight, halo to 30 %, brow line slightly straighter.
- **Camera:** `cam: EYE, yaw −4→−2, push 12 %`.
- **Sound:** drone + thin tone hold; no hit.
- **Check:** spike 4.

### S01-B02-SH03 — L06
- **Staging:** OWN face close, three-quarter from the cat side, stare held (`neutral`, eyes `wide`); glare grade 1 held, then 1→0 over ~30 f starting inside "มากกว่าความรัก".
- **Camera:** `cam: T-OWN, cat side yaw +40→+36, r 0.72→0.68 m, eye 1.10, f 1100, hy 700`.
- **Sound:** thin tone fades with the drain; drone out; room tone returns.
- **Check:** face reads the same person; the drain is a smooth in-canvas blend (DF-20261029-painted-timeline-dissolve).

### S01-B03-SH01 — L07
- **Staging:** OWN sitting back, eye line (−0.18, 1.12, −0.45), head turned toward the armchair, `front` squared; expression `neutral` → soft `happy`. Cat on the armchair seat (+1.05, 0.42, +0.45), `sit`, body half-turned away (+x+z), head front-ish to the room, K2 ears 1→0 over the second half.
- **Camera:** `cam: T-GAP (+0.45, 0.90, +0.05), yaw −20→−12 arc, r 2.0→1.85 m, eye 0.95, f 1000, hy 760`.
- **Light:** warm, a step calmer than B01.
- **Sound:** piano back, very low (M1 tail or NG-M3 lead-in); clock tick.
- **Check:** gap (eye-to-eye ≈ 1.2–1.3 m) readable; both above y 1160.

### S01-B03-SH02 — L08 (LF03)
- **Staging (EYE):** lid 1.0 → 0.45 (smile: lower lid lifts, cheek crease) on "หรี่ตาเหมือนยิ้ม" → 0 on "ค่อย ๆ หลับ", held through "หนึ่ง… สอง…" → 1.0 on "แล้วค่อย ๆ ลืม". Warm catchlight.
- **Camera:** `cam: EYE, yaw −6→−3, push 10 %`.
- **Sound:** NG-M3 felt note on "หนึ่ง", the fifth on "สอง"; room tone.
- **Check:** spike 2; each lid state lands within ±3 f of its word (W5.1).

### S01-B04-SH01 — silence ~2 s (LF02)
- **Staging (CATFACE):** head yaw −45° → 0° over ~10 f (gaze to the lens = her eyeline), hold ~0.8 s, lids 0 → 0.58 over ~15 f, brow relax, ears forward-relaxed, whiskers relaxed. On the half-close frame: `paintHalo` bloom around the eyes (≤ 0.3), then 5–8 warm motes drift toward frame left (`new: glow-pass`, seeded).
- **Camera:** `cam: CATFACE, r 14→13 set-cm, f 1000, hy 820`.
- **Sound:** music out; room tone + clock tick only; `reveal_glass-shimmer-soft_01` exactly on the half-close frame.
- **Check:** spike 3.

### S01-B04-SH02 — L03b "(กระซิบ) ตอบกลับมาด้วย…"
- **Staging:** OWN face close three-quarter, same vantage as B02-SH03, `happy` with a `whisper` mouth, eyes `half`; motes enter from frame right and fade at her eyes by ~1.0 s.
- **Camera:** `cam: T-OWN, cat-side yaw +40→+38, r 0.75→0.70 m, eye 1.12, f 1100, hy 700`.
- **Light:** warmest face light so far.
- **Sound:** L03b whisper (W4); `bed_warm-pad-felt-third_01` or NG-M2 head returns under the whisper tail.
- **Check:** mote direction continuous across the cut.

### S01-B04-SH03 — L09
- **Staging (proposed refinement, see "Brief changes proposed"):** cat on the armchair (+1.05, 0.42, +0.45) `stand-up` (0–0.6 s), walks to the seat edge, K7 `step-up` 0.20 m onto the **front end** of the sofa's right arm at (+0.72, 0.62, −0.05) (~10 f, ~1.4 s), walks −z along the arm top to (+0.72, 0.62, −0.40), steps down onto the right cushion at (+0.40, 0.44, −0.40) by ~4.6 s, sits facing her. View `left` profile throughout (diagonal path). OWN sitting back, watching the cat, `happy`.
- **Camera:** `cam: T-PAIR → T-CAT-SOFA, yaw +8→+16, truck x +0.70→+0.35, r 1.6 m, eye 0.85, f 1000, hy 760` (brief value kept; see proposal).
- **Sound:** NG-M2 warmer, a touch brighter; NG-S4 paw steps; a soft cushion press on the step-down.
- **Check:** spike 6; L09 plays over the beat it describes; no graphic.

### S01-B04-SH04 — L10 "และยอมขยับเข้าหามือคนแปลกหน้า…"
- **Staging (day state):** lamp off, soft window key from back-right, no city glow. Visitor forearm card from frame left, palm flat and open at `T-STRANGER-HAND` (0.00, 0.15, +1.30), held still (drift ≤ 2 px/f); denim cuff `#3d5a80`, steel watch, skin `#e0b48c`. Cat on the rug at (+0.38, 0, +1.32) facing −x (`left`), K4 lean 0→0.7, one step at ~1.2 s, 2–3 sniffs from ~1.6 s.
- **Camera:** `cam: (0.15, 0.15, +1.30), yaw +15→+10, r 0.90→0.80 m, eye 0.22, f 1050, hy 900`; 6 f in-canvas dissolve in.
- **Sound:** `room_soi-morning-quiet_01` crossfaded in (far birds), night tone down; NG-S5 sniffs; M2 continues low.
- **Check:** spike 5.

### S01-B04-SH05 — L10 "มากกว่าตอนคนหันหน้าหนี นิดนึง"
- **Staging (night):** OWN `new: seated-offer-palm`, right palm up-and-out at T-HAND (+0.20, 0.55, −0.25), held still; `happy`. Cat on the right cushion, `front` view, K5 `head-rub` twice (~0.5 s and ~1.4 s), lid 0.5.
- **Camera:** `cam: T-HAND, yaw +20→+26, r 0.90→0.85 m, eye 0.75, f 1100, hy 760`; hard cut from day.
- **Sound:** night room tone back on the cut; NG-S6 fur rubs on each rub.
- **Check:** spike 7; labelled dramatization in W5.1 (not the study's measure).

### S01-B05-SH01 — L11, V02 in
- **Staging (R1.1, user Q-R1 2026-11-07: the wide B03 framing for L11):** OWN sitting back as in B03-SH01, eye line (−0.18, 1.12, −0.45), head turned toward the armchair, right hand open on her thigh; slow blink: `half` → `shut` → `half` → open with `squint` over ~1.2 s, starting on "กะพริบช้า ๆ". Cat sitting on the armchair seat (+1.05, 0.42, +0.45), now **facing her** (`left` view, body toward (−0.15, ., −0.40)), lid 0.5, ears relaxed (0), tail tip still. Continuity: after the B04-SH05 head-rub the cat has gone back to the armchair (time skip across the cut, same evening); the lamp a step warmer and the window glow dimmer than B03 mark the later moment. The cut to B05-SH02 (tail over her knee) then reads as the cat having come to her on its own, as L12 says.
- **Camera:** `cam: T-GAP (+0.45, 0.90, +0.05), yaw −12→−18 arc, r 1.85→1.95 m slow pull, eye 0.95, f 1000, hy 760` (mirrors B03-SH01's arc in reverse).
- **Light:** warm, warmer than B03; window glow dimmer.
- **Sound:** NG-S2 purr fades in from ~0.5 s, very low (the cat is ~1 m away); M2 warm.
- **Check:** eye-to-eye gap ≈ 1.2–1.3 m readable at 270 px; her blink readable at the wide size (head ≥ ~200 px est, Boss measures); both faces above y 1160; the frame differs from B03-SH01 by the cat facing her and the warmer light.

### S01-B05-SH02 — L12
- **Staging:** insert on her knee and hand: cat tail tip curls from the cushion over her right knee to T-KNEE (+0.05, 0.50, −0.02) (K6 `tailTo`, over ~1.2 s); her right hand open on her thigh, still.
- **Camera:** `cam: T-KNEE, yaw +30→+34, r 0.60→0.55 m, eye 0.65, pitch −20°, f 1100, hy 760`.
- **Sound:** purr; NG-S8 settle as the tail lands.
- **Check:** tail tip on the knee anchor; hand motion 0.

### S01-B05-SH03 — L13 "แต่ถ้ามันกะพริบกลับมา… นั่นคือสัญญาณที่ดี ที่คนเลี้ยงแมวหลายคนเชื่อว่ามันกำลังบอก… รัก" (script R1.3)
- **Staging:** two-shot holding; OWN `happy`, eyes `half`; cat curled, lid 0.5, ambient breath and tail.
- **Camera:** `cam: T-PAIR, yaw +10→+6, r 1.50→1.35 m slow push, eye 1.00, f 1050, hy 760`.
- **Sound:** piano low and sparse until "ที่คนเลี้ยงแมวหลายคนเชื่อว่ามันกำลังบอก" ends; M2 resolve lands on "…รัก" (fallback `stinger_outro-resolve_01`); purr under.
- **Check:** attribution audible (script N7); no symbol of love on screen; R1.3 delivery condition (Boat): the only pause before "รัก", and no caption over the closing picture saying she or the cat "loves" (the locked read's extra pause before "ที่คนเลี้ยง…" is open, [scene sheets RN08](scene-sheets.md#retime-notes-r11)).

### S01-B05-SH04 — closing (cat)
- **Staging (CATFACE):** curled pose, head roll +10°, resting low; lids 0.2 → 0.6 over ~0.6 s, then held.
- **Camera:** `cam: CATFACE (curled), r 15→14 set-cm, f 1000, hy 820`.
- **Sound:** resolve chord sustains; purr; optional quieter `reveal_glass-shimmer-soft_01` (Editor's call).
- **Check:** lid ≤ 0.6.

### S01-B05-SH05 — closing (her smile, `A_fade`)
- **Staging:** OWN face close three-quarter, soft smile, eyes `half`, live breath.
- **Camera:** `cam: T-OWN, yaw +36→+34, r 0.75→0.72 m, eye 1.12, f 1100, hy 700`.
- **Ending:** `video.ending: 'A_fade'`, `endHoldSec: 0`, `endFadeSec` ≈ 0.8 over this shot.
- **Sound:** chord, purr and room tone fade with the picture to true silence on the last frame.
- **Check:** spike 8.

## Look frames (W3, from the brief)

LF01 S01-B01-SH01 (room, night) · LF02 S01-B04-SH01 (cat face, warm; after the VD18 cat-face look check, ≤ 3 stills) · LF03 S01-B03-SH02 (her eye, warm) · LF04 S01-B02-SH02 (her eye, glare; may merge into LF03). The day cutaway (B04-SH04) is checked against LF01 at the W3 pass. Beat → look for the rows at W3: B01 LF01, B02 LF04, B03 LF03, B04 LF02, B05 LF01.

**W3 v1 (2026-11-07, not user-approved):** stills in the store at `projects/edu/EDU/previews/look-frames/ep06/v1/` (cache `out/edu06/look-frames/v1/`): `LF01.png` (B01, B05), `LF04.png` (B02), `LF03.png` + lid strip `eye-states.png` (B03), `LF02.png` (B04), cat-face look check `CF1.png`–`CF3.png` (`catface-sheet.png`). Code `src/painted/edu06/` (look-frame build; Boss N1–N3 promote). Status table and measures: brief R1.1 Look frames and Projection contract.

## Sound NEEDS-GEN list (from the brief; generated at W4+ by the Editor)

NG-M1 felt-piano lo-fi bed 72 bpm, no drums, 30 s · NG-M2 warmer brighter variant + pad, ends on a ~4 s resolving chord, 25 s · NG-M3 two felt notes a fifth apart, ~1.5 s each · NG-A1 condo living room at night, 12 s loop · NG-S1 cat mrrp 0.6 s · NG-S2 purr loop 8 s · NG-S3 paw thump on cushion 0.3 s · NG-S4 paw steps on sofa arm/cushion 2.5 s · NG-S5 sniffs 0.8 s · NG-S6 fur rubs on palm 1.2 s · NG-S7 sofa creak 0.8 s · NG-S8 cushion settle 0.8 s.

## Brief changes (BC1 and BC3 applied in EDU-EP06-BRIEF-R1.1; BC2 recorded as VD11's fallback camera, not adopted)

- **BC1 (S01-B04-SH03 path):** the brief lands the step-up at (+0.72, 0.62, −0.30), about 0.8 m from the armchair seat (+1.05, 0.42, +0.45), which is not a 0.20 m hop. Proposed: land on the arm's front end (+0.72, 0.62, −0.05) (≈ 0.28 m across, 0.20 m up from the seat edge), walk −z along the arm to −0.40, step down at (+0.40, 0.44, −0.40). Used above as `est`.
- **BC2 (S01-B04-SH03 camera, optional):** with the camera at yaw +8→+16 the arm leg runs mostly into depth (−z), so a `left` profile reads as a cheat and there is no cat back view. Option: `cam: T-CAT-SOFA, yaw −25→−18, r 1.6, eye 0.85`, which makes the whole path lateral and lets the cat enter from frame right (`walk-in-from-right` as named). Keep the brief value unless Boss's blockout shows the depth leg reading wrong.

## Open items

- **Missing evidence:** no voice (lengths `est`); no blockout; CATFACE `missing` (look check first); EYE lid control `missing`; seated 4-head eye line estimated; K8 raised ground `unknown`.
- **Q-R1 answered (user, 2026-11-07):** L11 uses the wide B03 framing showing the one-metre gap (applied in R1.1, S01-B05-SH01).
- **BC3 (from Q-R1, applied in brief R1.1):** brief VD14 and the shot-plan row S01-B05-SH01 (T-PAIR, cat curled beside her) and the B05 cat staging line need updating to: S01-B05-SH01 `cam: T-GAP, yaw −12→−18, r 1.85→1.95 m, eye 0.95, f 1000, hy 760`, cat sitting on the armchair facing her (lid 0.5); the curl (K6) starts at S01-B05-SH02. The script cue for L11 ("the cat curled beside her") differs from the picture now; rows and scene sheets carry the wide framing (checked again at ROWS-R1.4: no row or sheet block says the cat is curled during L11; the curl starts at S01-B05-SH02). The script cue note stays Preaw's to align (wording unchanged).

## Change log

- **EDU-EP06-ROWS-R1 (2026-11-07, Film W2.2):** first untimed storyboard pass from script R1.2 and brief EDU-EP06-BRIEF-R1: 19 shots with the brief's IDs and est lengths, per-shot staging, camera lines, casting lines, light, sound (library IDs and NG-*) and checks; rules R01–R08; Thai rows in review-rows.json. Proposed brief changes BC1–BC2 (not applied); question Q-R1. No render, no paint.
- **EDU-EP06-ROWS-R1.1 (2026-11-07, Film):** user answer Q-R1: S01-B05-SH01 (L11) changed to the wide B03 framing (T-GAP, cat on the armchair facing her, ~1 m gap); Thai row updated with a `changed` line, Q-R1 flag removed; B05-SH02 to SH05 unchanged; brief change BC3 proposed.
- **EDU-EP06-ROWS-R1.2 (2026-11-07, Film W3):** look frames LF01–LF04 added (`looks` in review-rows.json; beat looks B01 LF01, B02 LF04, B03 LF03, B04 LF02, B05 LF01); cat-face look check CF1–CF3; S01-B01-SH01 seat/hips at 0.30/0.35 m and W3 camera radius; BC1 and BC3 applied in brief R1.1, BC2 not adopted. No Thai row text changed.
- **R1.2 addendum (2026-11-07, Film W3 v2; no shot changed, rows stay R1.2):** user approved LF01–LF04; LF03 look still replaced by v2 (cheek push); cat-face style candidates CFa/CFb/CFc (store `projects/edu/EDU/previews/look-frames/ep06/v2/`); brief now EDU-EP06-BRIEF-R1.2.
- **EDU-EP06-ROWS-R1.3 (2026-11-07, Film W5.1, recorded here at R1.4):** est `start`/`end` added from scene sheets R1; Thai shot text unchanged.
- **EDU-EP06-ROWS-R1.4 (2026-11-07, Film W5.1 retime):** voice-timed `start`/`end` from scene sheets R1.1 (1685 f = 56.17 s; V01/V02 placement `est`), `timingEstimated: false`; L13 → script R1.3 "แต่ถ้ามันกะพริบกลับมา… นั่นคือสัญญาณที่ดี ที่คนเลี้ยงแมวหลายคนเชื่อว่ามันกำลังบอก… รัก" in the S01-B05-SH03 row, its sound line and this file (table, block); S01-B01-SH04 row picture updated for the full exit (ears flatten on the coo, mrrp while walking out; scene sheets RN01) and S01-B05-SH03 row for the 7.1 s hold (gaze settles on the cat), both with a `changed` line so the page asks again; header text (eyebrow, lede, facts) updated. L11 cue check: no stale "curled beside her" in rows or sheets.
