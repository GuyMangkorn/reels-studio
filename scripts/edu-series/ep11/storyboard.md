# Storyboard — EDU-EP11-SHORT (first pass, untimed rows)

Revision: **EDU-EP11-ROWS-R1.3** (Film, 2026-11-09, W5.1: rows timed from the voice lock; **the timed ranges, event frames and staging now live in [scene-sheets.md](scene-sheets.md) EDU-EP11-SHEETS-R1.3, which wins on conflict; the frames below are the superseded R1.2 estimates**). Previous: EDU-EP11-ROWS-R1.2 (Film, 2026-11-09, W3; Boss spike fixes from [spikes.md](spikes.md) on shots 2, 3, 4, 5, 6, 7, 12, 17 and 20, and the look-frame plan; R1.1 carried Boat's [W2 recheck](fact-check.md#w2-recheck) fixes; see the change log). Rows file: [review-rows.json](review-rows.json) (Thai, `untimed`, `timingEstimated`). Review page: **pending** (coordinator publishes with `scripts/storyboard-page/build.py`).
Inputs: [script.md](script.md) EDU-EP11-SCRIPT-R3 (user-approved 2026-11-08), [fact-check.md](fact-check.md) W1.3 (FIX-2), [voice-measure.md](voice-measure.md) R3 read ×0.92 (53.02 s), [film-brief.md](film-brief.md) **EDU-EP11-BRIEF-R1.2** (decisions VD01–VD33, sets, cameras, slots, assets N1–N18).

## Status

- **Readiness: `ready-for-dev` for the storyboard review only** (camera, staging and VO per shot, for the user's verdicts on the review page). Not ready for production: timing is estimated (W4 voice lock, then the W5.1 timed scene sheets), sets and most motions are missing (Boss N1–N18), and no frame has been painted or viewed (look frames LF01–LF05 come at W3).
- Readiness is not approval: this pass adds no approval and proves no runtime or visual result.

## Units and conventions

- 30 fps; frames are global and half-open `[start, end)`; seconds `est` from the R3 read re-gapped at 0.28 s (method in the brief header). Plan: **25 shots, 1695 f = 56.50 s** (target 53–57 s).
- Spaces and axes: SHAFT, CAR, HALL1854, STORE1857 as in the brief's set plans (metres, +x screen-right from the main camera side, +y up, +z toward the camera). Camera lines use the kit form `cam: target (x, y, z), yaw, r, eye, f, hy` (hy = picture row of the target).
- Frame zones: caption band y 1176–1344; faces and contacts above y 1160; slots LBL (816–1020, 148–204), HUD (800–1040, 224–600), CAP (48–440, 150–206), INSET (760–1040, 640–1138), STAMP centre (905, 720); `@TamMaiLa` top-left.
- Lead sizes from `scripts/shot-projection.py` (computed, not rendered).

## Casting

| Role | Casting line | Notes |
| --- | --- | --- |
| WOMAN | `woman-long + office (tie off), P10, neutral` | 1.64 m; faces through the episode: neutral → shock → scared → worried/angry → surprised → sad → worried → `new: ouch` → (frozen) → surprised → neutral → tired → `new: relieved` |
| SHOWMAN | `man-parted + new: 1850s showman, P01, neutral` | frock coat, waistcoat, cravat, top hat; a reconstruction figure, no portrait likeness |
| ASSISTANT | `man-buzz` (own apron outfit) + `cap`, right view, `new: axe-chop` | staging only (narration names only the order) |
| CROWD ×4 | `new: 1850s crowd dress`, back view, `gasp-recoil` | foreground silhouettes |
| PASSENGERS ×2 | `new: 1850s crowd dress`, front, neutral | in the 1857 cage car |

## Shot list

| # | Shot | Lines | Start s (est) | Len s | Frames | Camera | One-line read |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | S01-B01-SH01 | L01 a | 0.00 | 2.50 | [0, 75) | CAM-CAR-M | Lift, phone, "20", bell glows; snap, flicker, hair begins to lift |
| 2 | S01-B01-SH02 | L01 b | 2.50 | 1.90 | [75, 132) | CAM-SHAFT-TRACK | Section: car falls, slack cables, rails; HUD + "ถ้า…ร่วงจริง" |
| 3 | S01-B01-SH03 | V01, L02 | 4.40 | 3.22 | [132, 229) | CAM-CAR-M | She floats, phone drifts, grabs the rail |
| 4 | S01-B01-SH04 | V02 | 7.62 | 1.93 | [229, 286) | CAM-CAR-CROUCH | Crouches to spring |
| 5 | S01-B02-SH01 | L03 | 9.55 | 4.55 | [286, 423) | CAM-SHAFT-CLOSE | Same arrows on car and her; "ราว 120 กม./ชม." |
| 6 | S01-B02-SH02 | L04 | 14.10 | 2.45 | [423, 496) | CAM-SHAFT-CLOSE | Ghost jump; "−10 กม./ชม." |
| 7 | S01-B02-SH03 | L05 | 16.55 | 2.37 | [496, 568) | CAM-SHAFT-WIDE | Whole shaft; bracket "ชั้น 20" → "ชั้น 17" |
| 8 | S01-B02-SH04 | V03 | 18.92 | 0.63 | [568, 586) | CAM-CAR-CU | "ห๊ะ…" |
| 9 | S01-B03-SH01 | L06 a | 19.55 | 1.40 | [586, 628) | CAM-CAR-POV | Closed doors, no window, a ticking digit |
| 10 | S01-B03-SH02 | L06 b | 20.95 | 1.70 | [628, 680) | CAM-CAR-CU | Counting with her lips |
| 11 | S01-B03-SH03 | L07, V04 | 22.65 | 2.30 | [680, 748) | CAM-CAR-LOW | Pushes off early, soft bonk, rolls "โอ๊ย!" |
| 12 | S01-B03-SH04 | L08 | 24.95 | 1.55 | [748, 795) | CAM-SHAFT-TRACK | Fastest; floors 3 → 1; no pit in frame |
| 13 | S01-B03-SH05 | (black) | 26.50 | 0.40 | [795, 807) | — | Black, silence |
| 14 | S01-B04-SH01 | L09 | 26.90 | 2.35 | [807, 878) | CAM-CAR-FREEZE | Frozen; camera arcs; shrinks to inset |
| 15 | S01-B04-SH02 | L10 | 29.25 | 3.68 | [878, 988) | CAM-HALL-W | 1854 hall, showman orders, axe raised |
| 16 | S01-B04-SH03 | (gasp), L11 a | 32.93 | 1.77 | [988, 1041) | CAM-HALL-M | Rope cut, short drop, stop, gasp |
| 17 | S01-B04-SH04 | L11 b | 34.70 | 1.20 | [1041, 1077) | CAM-HALL-CATCH | Spring + pawl bite the notch; "ภาพประกอบ" |
| 18 | S01-B04-SH05 | L12 a | 35.90 | 1.05 | [1077, 1108) | CAM-HALL-M | Hat raise; inset pulses |
| 19 | S01-B04-SH06 | L12 b | 36.95 | 3.43 | [1108, 1211) | CAM-STORE | 1857 store, cage lift with passengers |
| 20 | S01-B05-SH01 | L13 | 40.38 | 2.32 | [1211, 1281) | CAM-CAR-M | Inset grows, rewind to a fresh start, stamp "แทบ" |
| 21 | S01-B05-SH02 | L14 a | 42.70 | 3.40 | [1281, 1383) | CAM-SHAFT-TOP | Cables light, one holds, all part |
| 22 | S01-B05-SH03 | L14 b, (clamp) | 46.10 | 1.10 | [1383, 1416) | CAM-JAWS | Short drop, jaws bite; "ภาพประกอบ" |
| 23 | S01-B05-SH04 | L15 | 47.20 | 2.45 | [1416, 1490) | CAM-CAR-M | Hair settles, she slides down to sit |
| 24 | S01-B05-SH05 | L16 | 49.65 | 4.80 | [1490, 1634) | CAM-CAR-SIT | Presses the bell button |
| 25 | S01-B05-SH06 | (hold) | 54.45 | 2.05 | [1634, 1695) | CAM-CAR-SIT | Head back, exhale, smile; pizz tag |

## Rules for every shot

- **R01 Hypothetical tag.** While the HUD shows (shots 2–12, 14, 20–23) the tag pill "ถ้า…ร่วงจริง" is on. Shot 1 gets the HUD from f45.
- **R02 No impact.** Never show or sound a crash, the pit floor during the fall, debris, injury, a siren or a body sound. The only contact gag is the soft ceiling bonk (shot 11).
- **R03 FIX-2.** From shot 20 the HUD reads floor 20 and needle 0. The jaws catch with the needle only a few notches up. The brake never stops the 120 km/h fall.
- **R04 Two brakes.** The 1854 catch (timber, bow spring, iron pawl, sepia, shot 17) and the modern jaws (steel T-rail, wedge jaws, cool steel, shot 22) never share a shape, colour or angle. Both carry "ภาพประกอบ" in slot LBL.
- **R05 Rails (CL01).** Both guide rails are visible in every section shot. Nobody points at them.
- **R06 Bell (CL03).** The amber bell button glows in every wide car shot (1, 3, 4, 11, 14, 20, 23, 24). She never looks at it before shot 24.
- **R07 Screen.** Faces and contacts stay above y 1160. Each label holds its own slot. No on-screen text beyond the list in brief VD24.
- **R08 One clock.** Counter, needle, car height and her float all come from the fall clock (brief VD10), so cuts between interior and section agree.
- **R09 Continuity.** Her pose at an interior ↔ section cut is the same pose key. The phone follows the prop states (brief, Technical handoff).

## Per-shot staging

Values `est`; frames global. Sound lines give the shot-local frame `+n` and the library ID or the brief's NEEDS-GEN code.

**1. S01-B01-SH01** [0, 75). L01 "ถ้าสลิงลิฟต์ขาด ร่วงจากชั้นยี่สิบ…" (to about f72).
- Camera: `cam: target (0.0, 0.95, −0.30), yaw 10→6, r 2.50→2.35, eye 1.60, f 1200, hy 740`.
- Staging: CAR. WOMAN feet (0.05, 0, −0.30), faces +z, P10, phone in her right hand, `neutral`. Lead 748 px (feet ≈ y 1143, head ≈ 395). Display "20" at ≈ (185, 495); bell at ≈ (204, 737), glow 30 %.
- Key frames:
  - f40 "ขาด" (est): snap, a 3 f frame jolt, `shock` at f42.
  - f40–52: flicker (3 dips), light settles at 85 %.
  - f45–54: HUD slides in (counter 20, needle 0, tag).
  - f50–74: hair rise 0 → 0.25; heels lift 2 cm.
- Sound: +3 S1 chime; A1 lift hum to f40; +40 S2 snap + `electric_light-flicker-buzz_01` (to +52); +44 `whoosh_heavy-cinematic_01`; A2 shaft wind fades in from +46; no music.

**2. S01-B01-SH02** [75, 132). L01 "คุณกระโดดตอนท้าย รอดมั้ย".
- Camera: CAM-SHAFT-TRACK `target (0, y_car + 0.65, 0), yaw 0→1, r 8.5, eye = target y, f 2600, hy 930` (R1.2; SP2 measured).
- Staging: SHAFT section, front wall and car front shell cut. Car 765 px (x 310–769, y 394–1159, SP2); WOMAN inside 491 px standing/floating (SP2), hair lifting, phone in hand. Landing recesses in variants LV-A/B/C (brief set plan), streaks 20–25 %. Rails at x ≈ 280 / 800 run the full frame (CL01). Six cables whip slack above the car (CL02). Counter 20 → 19 at about f110.
- Sound: A2 rising; +2 S2 tail (rattle); `ui_click-tick_01` on the floor change.

**3. S01-B01-SH03** [132, 229). V01 "เฮ้ย!" (f132–150), L02 "จากความสูงขนาดนี้… แทบไม่ช่วยอะไรเลย" (f153–227).
- Camera: `target (0.0, 1.00, −0.30), yaw 6→3, r 2.35→2.20, eye 1.60, f 1200, hy 740`.
- Staging: feet rise to y 0.15 (f132–160; SP1), P46 + `zero-g-drift`, `scared`, hair rise 1. The phone leaves her right hand at f140 and drifts to (0.30, 1.75, −0.20), spinning 40°/s. On "จากความสูง" (f155) her right hand grabs the rail at (−0.66, 0.92, −0.30) (`new: float-grab-rail`). **f160–229: slow whole-card body roll 0 → +14° (head toward the rail), ease-in-out, pivot at the right-hand grip** (fallback: hips pivot, grip re-solved by `twoBone`; brief VD07, R1.2). Lead ≈ 800 px upright (SP1), ≈ 780 px at 14°; feet gap ≥ 40 px (SP1 63 px).
- Sound: V01 WOMAN TTS at +0; A2 bed; ticks; no music.

**4. S01-B01-SH04** [229, 286). V02 "เอาไงดี… โดดสวนขึ้นไป!".
- Camera: CAM-CAR-CROUCH `target (−0.10, 0.75, −0.30), yaw 3→8, r 1.90→1.75, eye 1.30, f 1200, hy 760`.
- Staging: the body roll returns 14° → 0 over f229–250 (R1.2); she pulls down by the rail into `new: rail-crouch` (feet (−0.20, 0, −0.30), right hand on the rail, left hand on her knee). She looks up at the ceiling, then level. `worried` → `angry` (determined) on "โดดสวน". The phone drifts near the ceiling. Crouched figure ≈ 640 px.
- Sound: V02 TTS; A2; ticks.

**5. S01-B02-SH01** [286, 423). L03 "ใกล้พื้น ลิฟต์เร็วราวร้อยยี่สิบ… ลิฟต์เร็วเท่าไหร่ คุณก็เร็วเท่านั้น". **LF02 at f400.**
- Camera: **CAM-SHAFT-CLOSE** `target (0, y_car + 0.65, 0), yaw 0→2, r 5.0, eye = target y, f 2600, hy 770` (R1.2, brief VD09/VD33; SP2 close variant).
- Staging: she is crouched inside (pose of shot 4's end), lead 486 px (head top ≈ y 575, feet ≈ y 1090); car shell bottom ≈ y 1160, shell x ≈ 150–910, roof cut ≈ 140 px off the top; rails x ≈ 95 / 980. Landing variants stream; streaks ≈ 25 → 45 %. Counter 18 → 15.
- Key frames:
  - f324 "ร้อยยี่สิบ": the readout pill "ราว 120 กม./ชม." appears at the gauge's top tick. The needle is at ≈ 40 % and still climbing.
  - f354 "ลิฟต์เร็ว": a white down-arrow grows on the car's right side (x ≈ 925–995, y ≈ 700–960, est; below the HUD).
  - f389 "คุณก็เร็ว": an identical arrow appears on her (x ≈ 505–575, y ≈ 700–960).
  - f405–415: both arrows pulse together.
- Sound: A2; `pluck_soft-note-01_01` +38 (pill), `-02_01` +68, `-05_01` +103; ticks.

**6. S01-B02-SH02** [423, 496). L04 "กระโดดสุดแรง หักออกได้แค่ราวสิบ".
- Camera: CAM-SHAFT-CLOSE `target (0, y_car + 0.65, 0), yaw 0→−2, r 5.0, eye = target y, f 2600, hy 770` (R1.2: the old target + 1.0 / hy 900 put her feet at ≈ y 1420). Lead 486 px; no push.
- Staging:
  - f430: a 40 % ghost of her (`new: ghost-figure`) springs up 0.4 m from the crouch and holds (ghost head top ≈ y 390, est).
  - f477 "ราวสิบ": her arrow shortens 8 %; chip "−10 กม./ชม." beside the ghost (x ≈ 610–790, y ≈ 400–450).
  - f478–484: HUD needle twitches back 1°, then resumes.
  - Fallback: no ghost.
- Sound: +7 soft whoosh (`whoosh_air-swish-rising_01` low); +54 `pluck_soft-note-02_01`.

**7. S01-B02-SH03** [496, 568). L05 "ชั้นยี่สิบ… ก็แค่กลายเป็นเหมือนชั้นสิบเจ็ด".
- Camera: pull-back from shot 6's end frame (CAM-SHAFT-CLOSE, r 5.0, hy 770) to `target (0, 30, 0), r 120, f 2600, hy 960` over f496–525, ease-out; target, r and hy eased together (`untested` whether `camMove` eases hy).
- Staging: tower section; tower top y ≈ 245, floor 20 ≈ 375, floor 17 ≈ 570. The bracket on the tower's left runs from floor 20 to the ground, pill "ชั้น 20". On "สิบเจ็ด" (f554) the bracket top slides down to floor 17 (≈ 195 px) and the pill flicks to "ชั้น 17". The small lit car falls at about floor 12. **D02** (brief VD12).
- Sound: +0 whoosh out; +58 `stinger_wahwah-fail_01`; A2 thinner at distance.

**8. S01-B02-SH04** [568, 586). V03 "ห๊ะ…".
- Camera: CAM-CAR-CU `target (−0.20, 0.80, −0.30), yaw 12, r 1.00, eye 0.85, f 1300, hy 810`.
- Staging: front three-quarter, head ≈ 533 px, chin ≈ y 1041. `surprised` (f568) → `sad` (f576). Hair floating.
- Sound: V03 TTS; A2.

**9. S01-B03-SH01** [586, 628). L06 "แต่คุณมองไม่เห็นพื้น…".
- Camera: CAM-CAR-POV `target (0, 0.90, 0.65), yaw 180, r 1.00, eye 1.15, f 1100, hy 900`.
- Staging: front wall drawn (closed doors, seam at x 0); no figure. The panel shows screen-right with the in-world display ticking 10 → 9. No window, no landing marks.
- Sound: `tension_heartbeat-slow_01` starts +0; ticks; A2.

**10. S01-B03-SH02** [628, 680). L06 "ต้องกะให้ตรงเสี้ยววินาที".
- Camera: CAM-CAR-CU, yaw 12→10, r 1.00→0.92.
- Staging: eyes down (`worried`, look [0, 0.5]); lips moving silently (`talk` small, 3 Hz). The HUD counter ticks faster.
- Sound: heartbeat; ticks accelerate; `reveal_riser-tension_01` starts at +40 so it ends at f795.

**11. S01-B03-SH03** [680, 748). L07 "เร็วไป ก็ลอยไปชนเพดาน" (f680–731), V04 "โอ๊ย!" (f735–747).
- Camera: CAM-CAR-LOW `target (0.0, 1.25, −0.30), yaw 8→4, r 2.30, eye 0.55, f 1150, hy 810`.
- Staging: lead 748 px.
  - f696 "เร็วไป": she pushes off (`new: push-off-float`) and rises 0.66 m.
  - f732 "เพดาน": the top of her head meets the ceiling panel at (0, 2.30, −0.30), head ≈ y 380; the panel wobbles 1 cm.
  - f735–748: she rebounds 3 cm and rolls 160° (whole-card `roll`) with P04 (hand on head), `new: ouch`.
  - The phone drifts past. No lump, no stars.
- Sound: +16 push whoosh (small); +52 `comedy_soft-boing_01` + `impact_knuckle-rap_01` low-passed; V04 TTS +55; riser continues.

**12. S01-B03-SH04** [748, 795). L08 "ช้าไปนิด… ก็ไม่ทันแล้ว".
- Camera: CAM-SHAFT-TRACK (hy 930); 2 px shake from f780.
- Staging: speed streaks at 55 → 65 % (heavier set, R1.2), landing variants streaming; rolled figure length ≈ 490 px (SP2 f790); she tumbles inside (roll continues). Counter 3 → 2 → 1. Car bottom ≥ 3.5 m above the pit at f794; the pit is never in frame. The car glow flickers once at f790. Hard cut at f795.
- Sound: riser peaks and **ends dead at f795**; ticks fastest; A2 loudest; no impact.

**13. S01-B03-SH05** [795, 807). Black.
- Staging: total black; no picture element.
- Sound: total silence.

**14. S01-B04-SH01** [807, 878). L09 "แต่เดี๋ยวนะ… ลิฟต์ร่วงแบบนี้ได้จริงเหรอ".
- Camera: CAM-CAR-FREEZE `target (0.0, 1.30, −0.30), yaw 12→−8, r 2.40→2.20, eye 1.40, f 1200, hy 760`.
- Staging:
  - f807–815: fade up from black on shot 11's end pose, frozen (upside-down, hand on head, hair fanned, phone mid-air).
  - The frozen look (desat 50 %, cool tint) applies throughout. The event and ambient clocks both stop; only the camera arcs. HUD frozen (1, top tick, tag).
  - f866–878: the frame scales into slot INSET with the HUD fading; sepia paper fades in beneath.
  - The inset image is a still of f877 (N9).
- Sound: +0 `reveal_glass-shimmer-soft_01`; silence otherwise; NG-A3 hall murmur fades in from +60.

**15. S01-B04-SH02** [878, 988). L10 "ปี 1854… โอติสยืนบนแท่นสูง แล้วสั่งให้ตัดเชือก". **LF03 at f980.**
- Camera: CAM-HALL-W `target (0.0, 3.00, 0.0), yaw −4→2, r 5.40→5.10, eye 1.60, f 1600, hy 960`.
- Staging:
  - Showman on the platform (feet (0, 2.40, 0.30)), ≈ 518 px. The notched uprights at x ±1.00 frame him.
  - Crowd backs in the foreground (heads overlap the band: backs only).
  - Caption "นิวยอร์ก 1854" in CAP from f880.
  - f960 "สั่งให้ตัดเชือก": he points down-right (P05).
  - f965–985: the assistant raises the axe; the rope cut point is at ≈ (1030, 1086).
  - INSET (frozen WOMAN) stays bottom-right throughout.
  - Banners and bunting textless; no building name on screen (B-P1-FIX-b).
- Sound: NG-A3 hall bed; no music.

**16. S01-B04-SH03** [988, 1041). (gasp) then L11 "แท่นตกนิดเดียว…".
- Camera: CAM-HALL-M `target (0.0, 3.20, 0.0), yaw 4→2, r 4.20→4.00, eye 1.90, f 1500, hy 700`.
- Staging:
  - f988: the axe bites and the rope parts with an upward flick.
  - f990–998: the platform drops about 0.15 m (showman feet ≈ y 1062 → 1111, ≈ 49 px; B-P1-FIX-a) and stops with a 3 px frame jolt.
  - The showman stays upright and calm.
  - From f990: crowd `gasp-recoil`.
- Sound: +0 S3 axe; +1 S5 crowd gasp; +2 S4 drop-and-stop.

**17. S01-B04-SH04** [1041, 1077). L11 "แล้วเบรกก็จับราง".
- Camera: CAM-HALL-CATCH `target (0.72, 2.65, 0.10), yaw −15, r 1.30 → 1.18 (push f1047–1077, ease-out), eye 2.80, f 2000, hy 760` (R1.2, SP4: the r 0.90 frame lost the spring and rope). ≈ 1540 px/m; notch pitch ≈ 154 px.
- Staging: from f1041 the cut rope's slack end lies draped over the platform frame top (0.37, 3.05) → (0.55, 2.92), still settling to f1044 (≈ y 160–360); the bow spring leaf (0.50, 2.88) → (0.77, 2.72) flattens f1041–1045 (≈ y 400–650); the pawl swings out f1043–1046 and bites a notch of the timber upright at f1046, pawl tip ≈ (915, 1098), notch pocket bottom ≈ y 1145 (est). Order (B-P1-FIX-c): the rope goes slack first, then the pawl moves; never show the pawl engaged before the cut. An amber outline marks only the pawl and notch. "ภาพประกอบ" in LBL f1041–1077. Sepia.
- Sound: +5 S6 catch clack; M1 warm strings enter +5 (fallback `bed_warm-pad-felt-third_01`).

**18. S01-B04-SH05** [1077, 1108). L12 "สิ่งที่คุณกลัว…".
- Camera: CAM-HALL-M, yaw 2→0, r 4.00→3.85, hy 700.
- Staging: the showman raises his top hat (`new: hat-raise`, `smug`); the crowd relaxes. On "คุณกลัว" (f1086–1101) the INSET pulses 1.0 → 1.08 → 1.0.
- Sound: M1; hall bed −6 dB.

**19. S01-B04-SH06** [1108, 1211). L12 "ถูกแก้ไว้ก่อนมีลิฟต์โดยสารที่มีเบรกนิรภัยตัวแรกซะอีก". **LF04 at f1180.**
- Camera: CAM-STORE, target tilts (0, 4.0, 0) → (0, 6.5, 0), yaw 0, r 5.0, eye 1.60, f 1300, hy 960.
- Staging: the cast-iron store front, centre bay cut open. A cage car with two passengers rises from y_car 4.6 to 6.2. Gas lamp, two pedestrians (backs). Caption "1857" in CAP from f1112, "1857" only: no "Haughwout", store or street name. No safety catch and no rope detail on the cage car (hoist hidden in shadow above the cut). The cut-open bay and the cage are stylised (Boat W2). INSET stays on. Passengers ≈ 440 px (**lead-size exception**, brief VD24).
- Sound: M1 resolves by about +95; street hush (NG-A3 thinned), one far hoof.

**20. S01-B05-SH01** [1211, 1281). L13 "ลิฟต์สมัยนี้ แทบร่วงแบบนี้ไม่ได้เลย".
- Camera: CAM-CAR-M (frame-0 values), yaw 6→10.
- Staging:
  - f1211–1221: the INSET grows back to full frame.
  - f1221–1224: the HUD fades in over 3 frames (it is not in the inset raster; no pop).
  - f1221–1236: **rewind** (keyed pose track with `poseMix` across the P10/P46/P35 switches, Boss N10). Every clock runs backward to frame 0's state: she un-rolls and sinks to standing, the phone returns to her right hand, hair falls, colour returns. The HUD counter runs up to 20 and the needle to 0. Streak layer at 15 %.
  - From f1236: HUD equals frame 0's HUD state (20, needle 0, tag on, no readout pill, no chip); she blinks, `surprised` → `neutral`.
  - f1238 "แทบ": kit `Stamp` "แทบ" in STAMP; it holds to f1275 and then fades over 6 f.
  - **D03 / FIX-2.**
- Sound: +10 S9 rewind (fallback reversed `whoosh_air-swish-rising_01`); +27 `foley_rubber-stamp-thunk_01`; A1 lift hum back on.

**21. S01-B05-SH02** [1281, 1383). L14 "สลิงมีหลายเส้น เส้นเดียวก็รับไหว… ขาดหมด".
- Camera: CAM-SHAFT-TOP `target (0, 61.2, 0), yaw 0→2, r 12, eye 61.2, f 2600, hy 700`.
- Staging: car roof ≈ y 1067, sheave ≈ 182, rails visible. The car does not move until f1371.
  - f1286–1320: the six cables light in turn (5–6 f each).
  - f1323–1359: one stays lit and five fade to 25 %.
  - At the ellipsis all six return to full.
  - f1371 "ขาดหมด": all six part above the crosshead with a slack whip upward.
- Sound: `stinger_felt-note-single_01` ×6 pitch-stepped at +5…+39; +42 single held tone; +90 S2 snap (lower level); HUD tag stays on.

**22. S01-B05-SH03** [1383, 1416). L14 "เบรกก็จับราง" + (clamp). **LF05 at f1405.**
- Camera: CAM-JAWS `target (0.85, y_car + 0.95, 0.15), yaw −20, r 0.75, eye = target y, f 2600, hy 800`.
- Staging:
  - f1383–1400: the car drops 0.40 m (B-P2-FIX-a). The camera tracks the car, so the rail slides up ≈ 1390 px (est).
  - f1400 "จับ": two wedge jaws in a steel block bite the smooth T-rail; a one-frame amber bloom. The jaws block is ≈ 584 px (y 508–1092).
  - f1400–1406: the car slows over ≈ 0.28 m after the bite (ease-out, no one-frame dead stop; B-P2-FIX-b), then settles 1 cm up and back (f1406–1410). HUD: 20, needle peaks a few notches (≈ 8–9 %) at f1400 and returns to 0 as the car stops; tag stays.
  - "ภาพประกอบ" in LBL f1383–1416.
  - No governor drawn.
- Sound: +17 S7 clamp hit (fallback `impact_door-slam-body_01`), its scrape tail covers the slide (+17…+23), ring-out to the shot's end; A2 cut at +17.

**23. S01-B05-SH04** [1416, 1490). L15 "ลิฟต์หยุด… คุณก็หยุดไปด้วย".
- Camera: `target (−0.10, 0.85, −0.35), yaw 6→12, r 2.30→2.00, eye 1.40, f 1200, hy 760`.
- Staging:
  - Entry: hair lifted 30 %, knees dipped 0.15.
  - f1416–1431: hair settles; she exhales.
  - f1440–1470: she slides down the back wall to sit (`new: slide-sit-wall`, hips (−0.30, 0, −0.50)).
  - f1460: the phone moves to her left hand on her knee. `tired`.
  - f1478–1490: HUD and tag fade out.
  - Light 100 %.
- Sound: clamp ring-out tail; NG-A1 fan hum only (no motor); breath; no music.

**24. S01-B05-SH05** [1490, 1634). L16 "ถ้าเจอลิฟต์ค้างจริง… ไม่ต้องกระโดดเลย กดปุ่มฉุกเฉิน แล้วรอ".
- Camera: CAM-CAR-SIT `target (−0.30, 0.62, −0.40), yaw 15→20, r 1.60→1.50, eye 1.05, f 1300, hy 760`.
- Staging: seated lead ≈ 620 px; the bell button at ≈ (140, 692), glow 30 %. Phone on her left knee.
  - f1569 "กดปุ่ม": right-hand reach starts (`new: reach-press`).
  - f1580: press contact on the button centre (−0.70, 0.95, −0.20), ±6 px; the glow rises to 70 %.
  - f1612 "แล้วรอ": hand back to her lap. `neutral` → soft `tired`.
- Sound: fan hum; +91 S8 soft bell (fallback `ui_notification-ding_01` an octave down), not a siren; Editor's loudness fix on the last phrases.

**25. S01-B05-SH06** [1634, 1695). Hold.
- Camera: CAM-CAR-SIT continued, yaw 20→22, r 1.50→1.46.
- Staging: she leans her head back on the wall, eyes half-closed, a small smile (`new: relieved`), a long exhale. Only breath moves (ambient clock).
- Sound: exhale (acted, Editor) at +4; `stinger_pizz-tag-ending_01` from the last word's end (f1633 est), about 1.8 s, 0.5 s fade, done by f1695 (UT15); fan hum under it.

## Dependencies and open items

- **Boss (W5.2):** N1–N18 in the brief. The main items:
  - sets SET-CAR, SET-SHAFT, SET-HALL1854 and SET-STORE1857;
  - `lift-hud`, `hair-float`, `phone-float`, `speed-arrows`, `ghost-figure`, `fall-bracket`, `frozen-inset`, `rewind`, `safety-jaws`, `catch-1854`;
  - the 1850s showman with top hat and the crowd dress;
  - `axe-chop`, poses `float-grab-rail`, `rail-crouch`, `push-off-float`, `slide-sit-wall`, `reach-press`, `hat-raise`;
  - faces `ouch` and `relieved`.
- **Spikes:** SP1–SP4 done by Boss 2026-11-09 and accepted by the user ([spikes.md](spikes.md)); fixes applied in ROWS-R1.2 / BRIEF-R1.2.
- **Look frames (W3):** LF01, LF01b, LF02–LF05 per brief [Look frames](film-brief.md#look-frames); Boss painting request [look-frames-request.md](look-frames-request.md).
- **Editor (W4):**
  - the voice lock and word onsets (list in the brief handoff);
  - the WOMAN voice for V01–V04 and the exhale (≤ 10 s samples first);
  - sound NEEDS-GEN M1, A1–A3, S1–S9;
  - L16 loudness.
- **Boat (picture checks):** B-P1 (the 1854 catch drawing), B-P2 (the rewind meets FIX-2): pass with fixes in the W2 recheck, applied in ROWS-R1.1 / BRIEF-R1.1. The L10 recheck listed in the script log belongs to the script owner.

### Open questions

Asked as review-page items. Each is non-blocking; the recommendation applies if unanswered.

- **Q-F1** Keep shot 19 (1857 store front with the passenger cage, a new set), or stay in the 1854 hall with only the caption "1857"? Recommended: keep. It shows "a passenger lift" at last.
- **Q-F2** Keep the frozen WOMAN inset through the 1854 insert, or replace it with one 0.8 s cut back to her frozen face? Recommended: keep the inset.
- **Q-F3** L05: the bracket on the whole shaft sliding from "ชั้น 20" to "ชั้น 17" (D02), or the script's HUD counter flick 20 → 17? Recommended: the bracket.

## Change log

| Revision | Date | Author | Change |
| --- | --- | --- | --- |
| EDU-EP11-ROWS-R1.0 | 2026-11-09 | Film | First storyboard pass: 25 shots, est 56.50 s, from BRIEF-R1; review-rows.json written; review page pending. |
| EDU-EP11-ROWS-R1.1 | 2026-11-09 | Film | Boat W2 recheck picture-number fixes only (Thai narration, timing and frame totals unchanged, 25 shots, 1695 f = 56.50 s): shot 16 drop 0.30 → about 0.15 m (feet y 1062 → ≈ 1111); shot 15 banners textless, no building name; shot 17 pawl only after the rope goes slack; shot 19 caption "1857" only, no name, no catch/rope on the cage, stylised cut bay; shot 22 drop 0.60 → 0.40 m, needle ≈ 8–9 %, car slows over ≈ 0.28 m, no dead stop. review-rows.json: rows 16, 19, 22 text and `changed` set; rows 15 and 17 unchanged (their picture text already met the condition). From BRIEF-R1.1. |
| EDU-EP11-ROWS-R1.2 | 2026-11-09 | Film | W3 Boss spike fixes ([spikes.md](spikes.md), accepted by the user); Thai narration, timing and frame totals unchanged (25 shots, 1695 f = 56.50 s). Shots 2 and 12 CAM-SHAFT-TRACK hy 960 → 930, landing variants, heavier streaks; shots 5 and 6 CAM-SHAFT-CLOSE close variant (r 5.0, hy 770, crouched lead 486 px), yaw cap 2°; shot 7 pull-back starts from that frame; shot 3 body roll 0 → 14° from f160, shot 4 roll back to 0; shot 17 catch camera r 1.30 → 1.18 with the slack rope in frame; shot 20 HUD 3 f fade-in at f1221 and frame-0 HUD state after the rewind, `poseMix`; LF02 → f400, LF03 → f980. Review rows: Thai "changed" notes on shots 2, 3, 5, 6, 12, 17, 20 only (R1.1 notes on 16, 19, 22 removed). Review page: pending. |
| EDU-EP11-ROWS-R1.3 | 2026-11-09 | Film | W5.1: review-rows.json timed (`start`/`end` in G, `untimed: false`, 25 shots, 1788 f = 59.60 s) from scene-sheets SHEETS-R1.3; Thai VO unchanged; `seen` and `changed` on shots 3 (roll 7°, `hairCalm`, pen/tissue), 4 (weigh-up beat), 5 (counter 17 → 15), 8 (sigh), 9 (indicator above the doors), 15 (assistant on the left); R1.2 `changed` notes removed; LF captions updated. This file's per-shot frames are not updated (see the sheets). Review page: pending. |
