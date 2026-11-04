# Visual brief — ZCONDO2-SHORT-TH (คอนโดวันโลกแตก, kit look)

Deliverable: `ZCONDO2-SHORT-TH` (Thai Short, Full tier); delivery record: [scripts/zombie-condo2/delivery.md](../../../scripts/zombie-condo2/delivery.md); task file: [task.md](../../../scripts/zombie-condo2/task.md)
Revision: `VB-ZC2-SHORT-R2` (3 Nov 2026, Film); status: **draft, kit look proposed, frames for the user's check** (`Q-ZC2-K1`, `Q-ZC2-K2`, `Q-ZC2-F5` open)
Script: [scripts/zombie-condo2/short/script.md](../../../scripts/zombie-condo2/short/script.md) `ZCONDO-SHORT-TH-R3` (user-approved 28 Oct 2026; beats B01–B10, clues CL01–CL05 and ending unchanged). Fact-check: [fact-check.md](../../../scripts/zombie-condo2/short/fact-check.md) R3 recheck `ready-for-storyboard`.
Narration: reused ZCPAINT TH read (Gemini Kore +5 %, B09 call Enceladus take 3), measured lines [ZCPAINT-SHORT-TH.lines.json](../../../scripts/zombie-condo2/short/ZCPAINT-SHORT-TH.lines.json) (`relock` 31 Oct 2026); the spoken words match `script.md` R3 line for line.
Timing status: **VO-relative, estimated frames** (onsets × 30, track zero = frame 0), integer event frames only at the voice lock (W4.2) and the timed scene sheets (W5.1). Total **2877 frames = 95.9 s**; the user keeps 95.9 s for now (Q-ZC2-F4, 3 Nov 2026).
Target checkout: `claude/zcondo-rework-visuals-audio-fcf653` @ `e38187e`; engine painted 2D (`p5.brush` 3.0.0) + Remotion 4.0.538 SVG/text layers: `existing-integrated`.
Storyboard rows: [review-rows.json](review-rows.json) `ZC2-SB-R2` (untimed first pass, 29 shots, a casting line per shot).
Proof frames (R2, Film, 3 Nov 2026): store `projects/ZCONDO2/previews/ZC2-kit-frames-r1/` (four 1080×1920 frames and a sheet), code `src/painted/zc2kit/frames.tsx` (kit imports only).

## Superseded (user reset, 3 Nov 2026)

R1–R1.3 explored new looks (LK-A gouache, LK-B ink and wash, LK-M mixed, LK-S soft line), a custom 6-head-style cast and two animation spikes (SPK-ZC2-01/02). The user dropped all of it. History lives in `scripts/zombie-condo2/build-notes.md` and the old review rows in git (`ZC2-SB-R1.2`); `src/painted/zcondo2/` is parked and is not extended. Nothing from those looks, the `MAN` drawing or the LK media is used below.

## Look decision (R2)

**`VD-ZC2-00` — the project-default kit look** ([project defaults](../../../docs/delivery-workflow.md#project-defaults), recorded as `default` by the user's reset): painted 2D (p5.brush) for sets, 4-head template cast from `PEOPLE` (flat-face decal heads, mitten hands, depth arms), kit poses/motions/expressions, crisp Remotion text for captions, diagram labels, chips, counters and choice labels. 1080×1920, 30 fps, one shot = one timeline scene, hard cuts. Large architecture = flat `hardFill` / flat `brush.wash`, figures by `drawFigure`. Evidence it fits this story: the four R2 proof frames (see assessments below).

## Visual intent

**Story first.** One ordinary person, one small condo unit, one door. The door is the antagonist: it opens on the threat (B01), shakes (B02), goes silent (B03), and on day 3 speaks (B09–B10). Everything between is the unit turning into a stockroom while the light tells the clock: morning sun → blackout daylight → night city fire → flat grey day 3.

- **Audience:** learns four real tips by watching a person do them (fill and cover, bucket flush, cistern, fridge order, no stove); fears the door, never sees who is outside.
- **Mood arc:** jolt → urgency → small "aha" → grim control → isolation → unease and choice. Dread over jump scares ([UT09](../../../docs/user-taste.md#ut-horror)): the infected is seen once, far, then turns; afterwards only sound.
- **Place reads Thai at a glance ([UT01](../../../docs/user-taste.md#ut-read), UT05):** a mid-market Bangkok high-rise, ~30 m² one-bed unit. Corridor with shoes outside doors and long fluorescent tubes; inside: solid door (**no peephole**, CL05), a slim shoe/storage cabinet by the door, kitchenette strip (sink, two-ring electric hob, small two-door fridge, rice cooker), sofa, sliding glass door to a narrow balcony with AC compressor, drying rack and mosquito screen. Bathroom: shower-only wet area, toilet with cistern, bum gun, red plastic bucket with a ขัน. Food: bread, bananas, nuts, red sardine cans (no brand), 6 L water bottles. No real building, landmark or brand.
- **Continuity touch (new):** the trash bag you were taking out drops by the door in B02 and is still there on day 3 (B09–B10): the ordinary errand that never finished.
- **Colour/value key:** water = clean cyan, the only saturated cool; danger (stove, fire) = orange-red; everything else muted warm neutrals. Value: subject always the lightest or most contrasted area; dark scenes keep the set readable, no large dead black ([UT03](../../../docs/user-taste.md#ut-frame)).
- **Camera language:** observational, eye level, slow drift or push on every shot. Repeated fixed vantage on the door from inside (B02-SH03, B03, B09-SH03, B10) so the viewer learns that view and feels it change. Corridor on a long lens (depth, flattening). Inserts for hero objects are large and lit ([UT02](../../../docs/user-taste.md#ut-read)). One POV insert only (B02-SH02 deadbolt hand); other hands appear in third person and are always holding an object that hides most of the fingers.
- **Lessons kept from ZCPAINT that still apply to p5 paint:** no muddy blotch on large areas (large areas are `hardFill` or flat `brush.wash`, never textured `washAt`: [DF-20261030-p5brush-large-fill-mottle](../../../docs/dev-findings/DF-20261030-p5brush-large-fill-mottle.md); confirmed again in the R2 frames); light pools only at the source; no caption shade (white text, thick outline); no cross-section shots with figures; no open-palm push (fists or hooked fingers on an edge); fires as pointed flames with rising smoke, not blobs.

## Cast and casting lines (story first, kit second)

Designed from the story first (a man in his late 20s in day-off clothes in a ~30 m² Bangkok unit; a neighbour who has turned), then matched against the kit ([casting line](../../../docs/character-proportion-principles.md#cp-casting-line)).

- **คุณ (lead): `man-crop`** (`PEOPLE`: 1.76 m, short black crop, tan skin, grey-blue short-sleeve shirt, dark trousers: matches "oversized faded blue-grey T-shirt, dark pants"; user, Q-ZC2-F1: a man). Age 34 in `PEOPLE_INFO`, story says late 20s; accepted (no visible difference at 4 heads). Outfit unchanged; shoes recoloured to rubber-slipper tone is a per-video override, not a new look. Day 3: same person with `head.facial: 'stubble'` (kit), a thin blanket (`new:` prop), `tired` face. Poses and expressions per shot are in the rows (`cast` field): P01 stand, P15 hands at the door, P16 reach (B06-SH02, pull), P26 carry (pour), P33 floor-sit hug knees (SH05, B03, B09, B10), P11 hand flat (fridge), `scared`, `worried`, `neutral`, `tired`.
- **The infected: `man-shaved` base + `new:` look.** Neighbour in house clothes (kit teal polo recoloured grey-beige, khaki trousers), glasses off, skin `#9fae92` grey-green, `tired` expression (half lids, bags, open mouth). **Blood on the face and mouth** (user, Q-ZC2-F2): `new:` blood layer painted over the kit head with flat washes (smear round the mouth, chin, one drip, spatter on the collar); no other wound (UT09). The kit has no blood/wound layer; Boss files it as a head decal at kit intake. The user gave no reference image (UT10): Film designed it from the description; confirmation is `Q-ZC2-K2`. Seen once, far, as a flat silhouette in B01-SH01/SH02, then the head turn in SH03; never again.
- **The caller (B09):** never shown; voice only.
- **New poses proposed to Boss (CP-P12, no one-off):** `drag` (profile, leaning back, both hands on a cabinet edge; the R2 frame builds it on P01 + custom arms), `hand_to_mouth_sit` (P33 with the right fist at the mouth), `reach_shelf` (one arm up, B07-SH02). Fists-on-door slam (B02-SH01) is a variant of P15. All are authored by arm targets in the proof frames; none are in the kit yet.
- **Props the kit lacks (`new:`):** trash bag, bucket, pot, bottles and lids, cans, stove case and canister, blanket, shoe cabinet, door and deadbolt/lever. Kit has torch, phone, umbrella only; hands from `paintPovHand` / `paintEdgeGrip` (B02-SH02, B05-SH03, B06-SH03, B07-SH01/03).

## Proof frames and assessments (R2)

Four frames, kit code only, 1080×1920 frame 0, no caption, no drift. Viewed as a 400 px sheet and 540 px singles; checked against [user-taste](../../../docs/user-taste.md): UT01, UT02, UT03, UT04, UT06, UT09, UT11.

| Frame | Shot | Casting / set | Result | Weakness left |
| --- | --- | --- | --- | --- |
| `ZC2-B02-SH05-kit.png` | B02-SH05 seated MS (the hardest) | `man-crop, P33, scared`; right fist to mouth, eyes up to the deadbolt; door, 3° cabinet (0.77×1.06 m), sun bands, bag, shoe | Reads: man hiding at a barricaded solid door, lock above the cabinet (UT01); gaze up; hand at the mouth; lead ~870 px tall (≥ 480) | Plain flat set; forearm tubes (kit style); lever hidden by the cabinet (as designed); the lower third is empty floor |
| `ZC2-B01-SH03-kit.png` | B01-SH03 infected MCU | `man-shaved` modified, `tired`, `new:` blood | Reads as a turned neighbour, blood at mouth/chin/collar, no gore (UT09); face lighter than the dim wall | Body is a plain grey slab; blood is flat washes (no wet highlight); eye-shine not drawn |
| `ZC2-B02-SH04-kit.png` | B02-SH04 drag (walk/reach beat) | `man-crop` profile walk phase 0.3, lean -0.14, both hands on the cabinet edge | Reads as pulling a light open cabinet along a wall toward the door, shoe and trail visible; lead ~775 px | Hands are mitten stubs on the edge; the cabinet shows no motion cue yet (scene sheet adds scuffs and dust) |
| `ZC2-B01-SH02-kit.png` | B01-SH02 corridor wide | one-point perspective, f 6800, silhouette infected at z 28 | Long corridor, doors with shoes, bright end window, figure dark against the glare: depth and threat read | The infected is a pill (silhouette hides all design, intended); lower 35 % of frame is pale floor; no flicker yet |

Overall: the kit look carries the story. The weak point is surface richness (flat sets); acceptable for the project-default look, and set polish is the Boss's plate pass. No frame is proof of animation, caption fit or final grade (stills prove only the depicted state).

## Sound direction

Light by request: the user listens to the existing ZCPAINT sound first ([cues-TH.json](../../../scripts/zombie-condo2/short/cues-TH.json), all library files under `$REELS_STORE/library/sound/`). Film's intent matches that set, so no generation is requested now (`NEEDS-GEN`: none).
- **Music family:** no score melody; a low dark drone bed (`audio/bed/bed_dark-drone-sub_01`) from B04 to the call, ducked under VO; a clock pulse (`sfx/tension/tension_clock-pulse_01`) from "หมดแล้วไม่มีใครเติม" through B07, thinning at the stove; cut before B08.
- **Ambience per location:** corridor fluorescent hum (B01); unit room tone + fridge hum until the blackout cut (B02); empty building after (B04–B07, B09–B10); night wind at height + distant fire crackle (B08, no sirens, voices or helicopters).
- **SFX language:** foley-first and dry (latch, slam, deadbolt, cabinet scrape, tap, bucket pour, cistern lid, fridge seal, can set-down, canister handling, wrapper); pounding is fist-heavy and irregular (CL01) and must differ from the soft human call (CL03); UI ticks only on the B06 hold times and B09 counts.
- **Silence policy:** 0.6 s freeze after "พวกมันตามเสียง" (pounding only); ≈0.9 s near-silence after the blackout; ≈1.5 s true silence after the call; B10 hold near-silent, then three soft knuckle knocks (≈93.6 / 94.05 / 94.5 s); no ignition sound ever.

## Visual progression

| Beat | Visible action | Information / emotional change | Visual form and reason | Repetition / return |
| --- | --- | --- | --- | --- |
| B01 | Door opens on a corridor; a still figure at the far end turns | normal → threat, by 2.0 s | Reveal through the door gap (the vertical door = the vertical frame), long-lens push, turn | Door motif starts |
| B02 | Slam, lock, door shudders, drag a light cabinet, freeze | safe-ish but trapped; plants CL01, CL02, CL04 | Fast action cuts, then a held close freeze (sound rule) | Door-from-inside vantage set up |
| B03 | Every small light in the unit dies, corridor light under the door too | power gone, all clocks start | One wide, light cascade (UT04: each source lights its surroundings, then goes) | Same door vantage, now dim |
| B04 | Tap still runs; tower water diagram; fill bucket, pot, bottles, lids on | water is a stock, not a supply | Insert → explanatory diagram (labelled reconstruction, ZC-C01/C02) → top-down demonstration | Containers return in B05 and B09 |
| B05 | Assign bottles/bucket; pour flush; lift cistern lid; bowl crossed out | bathroom usable; the "aha" | Wide → action → reveal insert → top-down rule comparison | Bucket from B04 |
| B06 | Dark closed fridge as a clock chart; quick grab of ready-to-eat food; cans set last | food order fixed by time | The fridge front is the diagram (diegetic), then a reverse view from inside the dark fridge | Cans return in B09 |
| B07 | Hand reaches for the camp stove, stops, puts it away; the sealed room; no-cook food | danger is indoors, not the zombie | Insert stop → wide of the closed room → food close | Sealed-room wide is the only full-unit view |
| B08 | Night balcony; dark city, smoke and fires | no rescue; isolation | Silhouette through glass → wide push-out past the railing (only exterior wide) | — |
| B09 | Day-3 floor inventory counts down; head lifts; the door, silent call | supplies low; a new unknown | Top-down count of real objects with numerals → reaction → held door | Door vantage returns, now "speaking" |
| B10 | You and the door; three choices appear; knocks | decision handed to the viewer | Final wider two-shot hold, choice labels | Ends on the door, trash bag still there |

Factual visuals: B04 diagram is a generic schematic (not a real building), labelled with VO words only ("ปั๊ม", "ถังบนดาดฟ้า", "ไฟดับ"); B06 fridge chips use VO wording ("ราว 4 ชม.", "อย่างมากราว 2 วัน"); B09 counters use bucket icons/objects so "สองถัง" reads as two buckets (ZC-C22: counts supplies, never advises drinking less). Must not appear: a lit camp stove, a pot over a canister, a bathtub as storage, cleaner tablets in use, a peephole/viewer/door camera, anyone outside the door, weapons.

## Shot list (one shot = one timeline scene)

Frames = measured VO onset × 30, estimated until W4.2. `TH-xx` = line IDs in the lines file.

| Shot | Frames [start, end) | Seconds | VO | Camera / what is seen | Location |
| --- | --- | --- | --- | --- | --- |
| `ZC2-B01-SH01` | [0, 80) | 0.00–2.67 | TH-01 | Low MS from inside the entry beside your shoulder; the door swings in, corridor appears in the gap, figure dark against the far window at the vanishing point by f36 | L1/L2 door |
| `ZC2-B01-SH02` | [80, 170) | 2.67–5.67 | TH-02 | Your view, long lens, slow push down the corridor; figure stands facing its own door at the end; one tube flickers | L1 corridor |
| `ZC2-B01-SH03` | [170, 216) | 5.67–7.20 | TH-03 + 0.4 s | MCU on the long lens, head turns toward camera, face in shadow, pale eye-shine; hold | L1 |
| `ZC2-B02-SH01` | [216, 240) | 7.20–8.00 | TH-04 ปิด | Inside, MS: you slam the door with both hands and shoulder, bag drops; frame shake (picture-stage) | L2 unit |
| `ZC2-B02-SH02` | [240, 268) | 8.00–8.93 | TH-05 ล็อก | POV insert: right hand turns the deadbolt thumb-turn; no peephole in the door | L2 |
| `ZC2-B02-SH03` | [268, 307) | 8.93–10.23 | TH-06 | Door vantage (W, from the room): door shudders, dust from the frame, you back away | L2 |
| `ZC2-B02-SH04` | [307, 422) | 10.23–14.07 | TH-07, TH-08 | Side wide: you drag the low open-shelf shoe cabinet (~0.77 w × 1.06 h m) from beside the door across the tiles until it covers the door below the lock, one end jammed against the door; it is light, open shelves, not fixed (CL02); scuff trails and a shoe knocked off stay for SH05 | L2 |
| `ZC2-B02-SH05` | [422, 518) | 14.07–17.27 | TH-09 + 0.6 s freeze | **Seated MS (was MCU in R1)**: full figure on the floor, back to the angled cabinet, knees up and fallen to screen right, left arm hooked round the shins, right hand over mouth, eyes up to the deadbolt and lever above the cabinet; still (CL04). | L2 |
| `ZC2-B03-SH01` | [518, 578) | 17.27–19.27 | TH-10 + silence | Door vantage wider: ceiling light, AC standby LED, fridge strip and the corridor light under the door die in a cascade; daylight only | L2 |
| `ZC2-B04-SH01` | [578, 626) | 19.27–20.87 | TH-11 | Insert: kitchen tap still running, daylight glint | L3 kitchenette |
| `ZC2-B04-SH02` | [626, 740) est. | 20.87–24.67 | TH-12 | Diagram on paper: tower section, pump → riser → roof tank, water running down the floors; labels ถังบนดาดฟ้า / ปั๊ม | L4 diagram |
| `ZC2-B04-SH02b` | [740, 914) est. | 24.67–30.47 | TH-13–TH-15 | Same diagram world, close on the pump room: cable cut (red cross), red bolt, pump grey, empty riser; "ไฟดับ"; empty riser holds on "หมดแล้วไม่มีใครเติม"; the tank is not in frame, its level is spoken only (split of the former 9.86 s shot; final frames at the Editor's timing, cut ≈ 24.37 s per voice-lock.md) | L4 diagram |
| `ZC2-B04-SH03` | [914, 1076) | 30.47–35.87 | TH-16 | Top-down on the kitchen floor: bucket, pot, bottles fill on their words, three lids on "แล้วปิดฝา" | L3 |
| `ZC2-B05-SH01` | [1076, 1150) | 35.87–38.33 | TH-17 | From the bathroom door, MW: bottles on the sink counter (drink), bucket by the toilet (flush); shower-only | L5 bathroom |
| `ZC2-B05-SH02` | [1150, 1232) | 38.33–41.07 | TH-18 | Side MS: you pour the bucket into the bowl in one go; gurgle on "มันลงเอง" | L5 |
| `ZC2-B05-SH03` | [1232, 1355) | 41.07–45.17 | TH-19 | Insert: cistern lid lifts, clear water catches the window light ("aha") | L5 |
| `ZC2-B05-SH04` | [1355, 1478) | 45.17–49.27 | TH-20, TH-21 | Top-down on the toilet: tank open with a tick, bowl crossed on "ไม่ใช่ในโถ"; chips "น้ำใส", "ไม่ได้ใส่น้ำยา" | L5 |
| `ZC2-B06-SH01` | [1478, 1676) | 49.27–55.87 | TH-22, TH-23 | MS: the dark fridge, your hand flat on the closed door; clock chips draw on the fridge door then the freezer door | L3 |
| `ZC2-B06-SH02` | [1676, 1755) | 55.87–58.50 | TH-24 | Reverse from inside the dark fridge: door opens, daylight in, your hand takes yogurt/milk/bread/leftovers from the door shelf; no raw meat or eggs | L3 |
| `ZC2-B06-SH03` | [1755, 1808) | 58.50–60.27 | TH-25 | Counter, eye level: fridge food first in a row, a sardine can set down at the end on "ท้ายสุด" | L3 |
| `ZC2-B07-SH01` | [1808, 1890) | 60.27–63.00 | TH-26 | Insert: camp stove case open, hand with the canister stops mid-air on "ห้ามจุดในห้อง"; never lit | L3 |
| `ZC2-B07-SH02` | [1890, 1980) | 63.00–66.00 | TH-27 | Wide pull-back: you slide the stove case onto the top shelf; the whole unit reads as a sealed box (glass door shut, barricade = the low wide cabinet across the door below the lock, as in B02-SH05, R1.2) | L2 |
| `ZC2-B07-SH03` | [1980, 2044) | 66.00–68.13 | TH-28 | Close: bread bag torn, banana, nuts, a can on the low table | L2 |
| `ZC2-B08-SH01` | [2044, 2152) | 68.13–71.73 | 0.5 s ambience, TH-29 | Night, from the dark room through the glass: you a silhouette at the railing, city beyond, fire glow | L6 balcony night |
| `ZC2-B08-SH02` | [2152, 2290) | 71.73–76.33 | TH-30, TH-31 | Wide over the railing, slow push-out: dark towers, smoke columns, pointed fires; you small at the rail at the end | L6 |
| `ZC2-B09-SH01` | [2290, 2486) | 76.33–82.87 | TH-32–TH-35 | Top-down day-3 floor: "วันที่ 3", two buckets, four cans, phone at 12 %, each count ticks on its word | L2 day 3 |
| `ZC2-B09-SH02` | [2486, 2548) | 82.87–84.93 | TH-36 | Side MS: you on the floor by the sofa, blanket, head lifts toward the door | L2 day 3 |
| `ZC2-B09-SH03` | [2548, 2630) | 84.93–87.67 | TH-36a call + 1.5 s | Door vantage, very slow push; nothing moves, line of daylight under the door; silence | L2 day 3 |
| `ZC2-B09-SH04` | [2630, 2686) | 87.67–89.53 | TH-37 | CU: your eyes move to the door ("พวกมันไม่พูด"); sub hit | L2 day 3 |
| `ZC2-B10-SH01` | [2686, 2877) | 89.53–95.90 | TH-38, TH-39, knocks | Wider two-shot: you foreground left, door and barricade, trash bag; choice labels เปิดประตู / ส่งเสียงตอบ / เงียบไว้ appear with the words; three knocks; hold | L2 day 3 |

**30 shots, 2877 frames (95.9 s)** (B04-SH02 split into SH02 + SH02b, 4 Nov 2026, user). Location look frames (first shot per location, painted in the kit look once the user answers `Q-ZC2-K1`): L1 corridor `ZC2-B01-SH02` (proof frame done); L2 unit day 1 `ZC2-B02-SH05` (proof frame done); L3 kitchenette `ZC2-B04-SH01`; L4 diagram `ZC2-B04-SH02`; L5 bathroom `ZC2-B05-SH01`; L6 balcony night `ZC2-B08-SH01`; L2 day 3 reuses the L2 set with day-3 light (`ZC2-B09-SH02`).

## Scene decisions

| Beat refs | ID | Medium | Framing / camera | Light / colour | Why / fallback |
| --- | --- | --- | --- | --- | --- |
| all | `VD-ZC2-00` | Kit look (above) | 1080×1920, 30 fps, one shot = one scene | per beat | Project default by the user's reset |
| all | `VD-ZC2-01` | Lead `man-crop`; infected `man-shaved` + `new:` blood; close shots use the kit head at big scale (`talkingCloseUp`, unit ~1400 px/m in the proof) | — | — | Story-first casting; blood proof at SH03 |
| B01 | `VD-ZC2-02` | Corridor set (new) with the infected as kit figure at depth, flat silhouette | Door-gap reveal, long-lens push (kit `pushCamera`), then MCU turn (`turn-head-to-camera`) | Cold fluorescent + bright end window; figure darker than the window | Hook by 2.0 s; fallback: SH01 starts with the door already ajar |
| B02, B03, B09, B10 | `VD-ZC2-03` | Unit set (new), one door vantage reused | Door vantage ~3.2 m from the door, 1.5 m eye height (estimated); B09-SH03 push ≤ 4 % | Day 1 warm morning sun from the balcony behind camera-left (flat translucent bands); B03 drops to daylight only; day 3 flat grey | The door as antagonist by repetition |
| B02-SH05 | `VD-ZC2-09` | Seated MS, `man-crop, P33` + fist at mouth | Full figure, plane ~760 px/m in the proof, floor line y 1330 | Sun bands from camera-left, his shadow on the cabinet | Proof frame painted; `Q-ZC2-F5` pending |
| B02-SH02 | `VD-ZC2-04` | POV hand: kit `paintPovHand` re-toned to `man-crop` skin | Hand from the right frame edge, thumb-turn above the caption band | Same as SH01 | One POV only. Fallback: thumb-turn alone |
| B04-SH02 / SH02b | `VD-ZC2-05` | Diagram on plain paper, kit painter lines; labels in Remotion | Tilt up the tower (picture-stage pan) | Water cyan, power-off red label | Explanatory reconstruction |
| B04-SH03, B05-SH04, B09-SH01 | `VD-ZC2-06` | Top-down plates (new props) | Orthographic | Daylight from one side | Three top-downs carry quantities |
| B06 | `VD-ZC2-07` | Fridge front as a diegetic chart; inside-fridge reverse with `P16` toCam arm | MS, then reverse from the shelf | Dark fridge, daylight floods in on open | Fallback for SH02: side view at the open door |
| B08 | `VD-ZC2-08` | City layers using kit ENV-SKY (night), ENV-GLOW (fire), ENV-FOG; towers, smoke columns, pointed fires new | Silhouette through glass, then wide push-out past the railing | Blue night, orange fire under-light; no dead black (UT03) | Only exterior |
| B05-SH01 | `VD-ZC2-10` | Bathroom set new; plate gallery `PL-ZCPAINT-BATHROOM` is reference only for the layout (bottles on the sink, bucket by the toilet) | MW from the door | Window light | `PLATES` are never a default (ENV-P02); ZCPAINT is history |

## Seam rules that still apply (p5 paint)

One key light per shot shared by set and figure; the figure's cast shadow is a flat translucent wash on the set; contact shadow ellipse under feet (kit `drawFigure` provides it); no per-object glow; captions white with thick outline, no shade; figures drawn through `drawFigure` only (no custom tube limbs). The LK-era two-medium seam rules (VD-ZC2-10 of R1.2) are void.

## Technical handoff (summary; numbers at the scene-sheet pass)

- **Scale baseline (estimated, Film):** units metres. Lead 1.76 m (man-crop); door 0.90 × 2.10 m, solid, inward-opening, lever + deadbolt thumb-turn, no peephole; corridor 1.8 m wide, 2.6 m ceiling, ~30 m to the end window; shoe cabinet **~0.77 w × 0.35 d × 1.06 h m** (estimate; was 0.60 × 1.20 in R1), open shelves, low enough that the deadbolt (1.15 m) and lever (1.00 m, its tip behind the cabinet edge) read above/beside it, wide enough to cover the 0.90 m door from its left jamb; two-door fridge 1.45 × 0.55 m; toilet cistern top 0.75 m; bucket 15 L, 0.30 m; balcony rail 1.10 m. Calibration view: the door vantage with lead, door and cabinet on one plane.
- **Spaces:** `W-UNIT` origin at floor, centre of the door's inside face; +x right as seen from inside facing the door, +y up, +z into the room. `W-CORR` origin at floor on the corridor centreline outside your door; +z toward the far window, +x right looking along +z, +y up. `D` diagram plane (px). `S` screen 1080×1920, origin top-left. Perspective per shot via the kit camera/projector (`src/painted/kit/camera.tsx`, `space.ts`); top-downs orthographic.
- **Caption band and lead size:** captions sit inside x 120–888, bottom edge ≤ y 1344 ([production requirements](../../../docs/production-requirements.md)); faces, hands-on-object and reveals stay above or beside the band; lead ≥ 480 px whenever visible except deliberate wides (B07-SH02, B08-SH02, B10 foreground rule checked at W5.1). Checked with `scripts/shot-projection.py` and `scripts/caption-zone.py` at the scene-sheet pass.
- **Caption shade (ZC2-SB-R3, 4 Nov 2026):** per-shot, cue-gated band (0 at y990, peak y1080–1250, 0 at y1330, rgb 20,16,12). Peak = the lowest in 0.01 steps that keeps caption-zone 1080:1248 at mean ≤ 0.245 (limit 0.25, margin 0.005) and p95 ≤ 0.40: 0.00 (B08-SH01, passes unshaded) to 0.78 (B04-SH02); table in `$REELS_STORE/projects/ZCONDO2/previews/ZC2-SB-R3/shade/caption-shade-table.md`, values in `SHADE_FOR` (`src/painted/zc2kit/sb.tsx`). Change-log: replaces the single 0.76 band.
- **Chrome:** channel mark `@TamMaiLa` top-left on (project default, 3 Nov 2026); the old ZCONDO "hide chrome" decision is not carried over.
- **Dev findings applied:** [DF-20261030-p5brush-large-fill-mottle](../../../docs/dev-findings/DF-20261030-p5brush-large-fill-mottle.md) (large areas wash-flat), [DF-20261031-painted-opaque-cast](../../../docs/dev-findings/DF-20261031-painted-opaque-cast.md) (dark figures: opaque base under the glaze; B01 infected, B08 silhouette), [DF-20261030-painted-arm-depth](../../../docs/dev-findings/DF-20261030-painted-arm-depth.md) (reaches into depth B06-SH02), [DF-20261031-povhand-wrist-corner](../../../docs/dev-findings/DF-20261031-povhand-wrist-corner.md) (B02-SH02 hand), [DF-20261029-painted-timeline-dissolve](../../../docs/dev-findings/DF-20261029-painted-timeline-dissolve.md) (hard cuts only, no dissolves planned), [DF-20261031-paint-seed-defer](../../../docs/dev-findings/DF-20261031-paint-seed-defer.md) (not applied: no hatching in the kit look). All dated 30–31 Oct 2026 on other branches; revalidate on the first Draft plates.
- **Owner modules (proposed):** kit cast/poses/motions from `src/painted/kit/` (`existing-integrated`); episode sets, props and the infected blood in an episode module (Boss, name proposed `src/painted/zcondo2/` is parked history: use a new module, e.g. `src/painted/zc2/`); proof frames in `src/painted/zc2kit/` (Film, throwaway); episode registration `src/videos/zombie-condo2/` (Editor). Missing (`missing`): all sets, the props below, the infected blood layer, three poses.

## Handoff to the scene-sheet pass

Preserve: VO text and line order, beat/clue IDs, the figure on screen by 2.0 s, pounding ≠ call, no peephole, nobody outside shown, stove never lit, shower-only bathroom, cistern not bowl, bucket icons for "สองถัง", the trash bag continuity (drops in B02-SH01, still there B09-SH03 and B10). Left to the scene sheets: exact cameras/anchors per shot, word-level event frames inside long lines (TH-16 ถัง/หม้อ/ขวด, TH-22/23 chips), B10 choice-label frames, how each new prop and the three proposed poses are specified for Boss. Missing evidence: the user's reply on the frames, voice lock against this timeline.

## Open questions

- `Q-ZC2-K1` Does the kit look fit this story (four proof frames, on the page)? **Open.**
- `Q-ZC2-K2` Infected design (grey-green, blood at mouth/chin/collar), no reference image given. **Open.**
- `Q-ZC2-F5` Seated MS framing and the ~0.77 × 1.06 m cabinet, cast `man-crop`. **Open**, not user-approved.
- `Q-ZC2-F1`, `F2`, `F4`: **answered** (man; blood on face/mouth; keep 95.9 s). `Q-ZC2-F3`/`F3b` (look pick): **void** (reset).

## Change log

- `VB-ZC2-SHORT-R2` (3 Nov 2026, Film): user reset applied. LK-A/B/M/S looks, custom cast and animation spikes dropped; one superseded note; kit look (`VD-ZC2-00`), casting lines per shot (`man-crop`, `man-shaved` + `new:` blood), three poses proposed, props listed as `new:`; four proof frames with assessments; cabinet size, morning light, trash-bag continuity, seat/barricade beats and the technical baseline kept; `VD-ZC2-10` seam rules replaced; owner-module line corrected; rows `ZC2-SB-R2`.
- Earlier revisions R1, R1.1, R1.2 (3 Nov 2026, Film): history in git; their look decisions are superseded.

- Change log (3 Nov 2026, Film, R2 look frames r3; UT12/UT13): sets repainted with p5.brush texture and 6-9 named props per set; SH05 scale 760 -> 1100 px/m and SH04 440 -> 700 px/m (closer MS framing); SH03 unchanged; SH02 stays wide (whole corridor + distant infected, brief need). Cabinet height unchanged at 1.06 m (SH05 gaze needs the lock above it); SH04 cabinet now spans the door and covers the lever. No peephole (CL05). Stills: `ZC2-kit-frames-r3/`.
