# Storyboard SS-R1 — EDU-EP05-SHORT (first pass, untimed)

- Revision **SS-R1** (Film W2.2, 2026-11-06). Inputs: script **EDU-EP05-SCRIPT-R1.3a** ([script.md](script.md), user-approved 2026-11-06, ending `A_fade`; the file's header line still reads R1.1, the table and revision log carry R1.3a), brief **EDU-BRIEF-R1.1** ([brief.md](brief.md): sets, projection contract k 320, VD01–VD20, shot plan), fact-check [fact-check.md](fact-check.md) (R1.1 recheck PASS; R1.2/R1.3 L15 pass, L12 pass with the comparator that R1.3a applied). No voice generated (NAR Kore, TINY Leda cast in the brief, W4).
- Status: `ready-for-dev` for the first storyboard review (camera and VO only). **Untimed**: no frames, no lengths (brief lengths are `est`, total ≈ 58.7 s). W3 adds the look frames to the same rows; W5.1 writes the timed scene sheets with integer frames from the voice-lock measure file. Not user-approved; no render, no runtime or visual validation.
- Review rows: [review-rows.json](review-rows.json) (Thai, one row per shot, `lines` cites R1.3a line IDs, `"untimed": true`). Review page: pending (coordinator publishes).
- Units and owners: human-scale sets in metres (SET-BALCONY, SET-FACADE); macro sets in set metres `sm`, k = 320 sm per real metre (SET-MACRO-PLANTER, SET-DRIFT, SET-GARDEN-GRASS). Origins, axes and set items as in the brief's [set plans](brief.md#set-plans-est-until-the-look-frames); all positions below are `est` until the look frames and Boss's blockout. Camera line: `cam: target, yaw a→b (orbit about the target), r, eye, f (px), hy (px)`, positive yaw turns toward +x; one kit yaw camera per shot owns the projection; TINY and the ant are flat cards squared to the mid-shot camera (`squareToCam`), blades are world-space ribbons, the bars card is screen-space, the warmth puff world-space.
- Casting: TINY = **`woman-bob + new: morning-pyjamas`** (4-head kit rig, 1.58 m / 1.58 sm, head ≈ 0.40); ant = **`new: ant` + `new: leaf-fragment` L1, `new: ant-walk`** (look check VD20 first). Props: `new: coffee-mug`, `new: dew-drop` D1, `new: breadcrumb` C1. Poses from the kit pose sheet (P12 `surprise_cover_mouth`, P16 `reach_grab_camera`, P19 `drink_cup`, P33 `sit_floor_hug_knees`, P39 `fall_stumble`, P42 `hug_self`, P45 `hands_up_surrender`) or `new:` where nothing matches.

## Shot list

| Shot | Lines | Camera (brief, est) | Picture direction | Look |
| --- | --- | --- | --- | --- |
| S01-B01-SH01 | L01 | Medium-wide eye-level arc on the balcony | TINY leans back on the rail at dawn with her mug, sips; dewy planter on her left; city haze below | LF01 |
| S01-B01-SH02 | L02 | Over-the-rail look down, pitch −65°, slow push down | Facade slabs recede to the garden lawn far below; her forearm and mug on the rail cap at the top edge | (LF01) |
| S01-B01-SH03 | L03 | Medium on the planter, small arc | Turns to the planter, touches the dewy grass; shrink pop on the hand point; mug stays on the rail | (LF01) |
| S01-B01-SH04 | V01 | Macro crane up the blades, pitch 0→+35° | Cut on the puff: tiny TINY among towering backlit blades, looks up, squeaks | LF02 |
| S01-B02-SH01 | L04 | Macro medium at the trough lip, arc | Breeze bends the blades toward the lip; TINY lifted and cleared over the lip; city far below | (LF02) |
| S01-B02-SH02 | V02, L05 | Follow-drift in open air, slow arc | Arms out, sinking slowly through rising motes; soft air strokes hug her; a blurred slab band slides up | (LF02) |
| S01-B02-SH03 | L06 (first half) | Low wide from the lawn looking up, slow tilt | A speck in a chalk ring drifting down the facade like a seed; tree edge in frame | (LF01) |
| S01-B02-SH04 | L06 (rest), V03 | Macro medium, eye 0.7 sm, slow push | Soft feet-first landing, small bounce, sits, pats arms and legs, "huh?" then giggle | (LF03) |
| S01-B03-SH01 | L07 | Macro medium on the drop, backlit | Dew drop glowing on its blade; TINY walks up and reaches in | LF03 |
| S01-B03-SH02 | L08 | Side-on two-shot to the pull | Hand stuck; she pulls; the drop stretches like jelly; her one line | (LF03) |
| S01-B03-SH03 | L09 | Macro close on the wrist | Meniscus collar on the wrist; the surface pulls back; caustic on the blade | (LF03) |
| S01-B03-SH04 | L10, V04 | Medium, pull back | Braces both feet, heaves; snap; tumbles back into the shade, wet | (LF03) |
| S01-B04-SH01 | L11 | Medium-close in shade, small arc | Cool blue shade; she hugs herself; the warm clearing glows behind | (LF04) |
| S01-B04-SH02 | L12, V05 | Medium, slow arc | Warmth-puff gag: orange puffs leak and drift, she clutches one, it slips through her fingers; shiver; far CL02 ant crosses with its leaf sail, steady | LF04 |
| S01-B04-SH03 | L13, V06 | Medium truck with the drag | Finds the crumb, nibbles, cannot dent it, drags it toward the sun, slumps against it (CL01) | (LF04) |
| S01-B05-SH01 | silence, L14 | Low medium two-shot, arc | 0.8 s silence, ant footsteps; the ant enters with the leaf sail, passes behind her; she watches, mouth open | (LF03) |
| S01-B05-SH02 | L15 | Medium on the ant, slow push; bars card | Two bars beside the ant, labels only; icon shrinks, "แรง" slowly, "น้ำหนัก" fast; surplus glows | (LF03) |
| S01-B05-SH03 | V07, L16 | Low medium, slow push up | Gasp; looks ant → crumb; grips, lifts it overhead as the sun patch reaches her; grin | (LF03) |
| S01-B05-SH04 | L17, V08 + hold | Wide two-shot, push easing to near-stop | End frame: TINY with the crumb overhead beside the ant, which glances at her; live ~2 s hold; fade to black | (LF03) |

**19 shots**, beats B01–B05, shot IDs exactly as the brief's shot plan. "(LFxx)" = the shot uses that look family but is not itself a look frame.

## Rules carried from the brief and fact-check (every shot)

- **R01** No number, speed, temperature, multiple, %, axis or tick anywhere in picture; on-screen text is only the L15 labels "แรง" and "น้ำหนัก" and the captions.
- **R02** Falls are slow and floaty: no speed lines, no motion blur, no camera shake. **No hard landing**: no dust burst, no impact frame, no thud in sound (C01).
- **R03** Dew drop D1 never drawn above 1.0× TINY's height (design 0.85 sm tall, 0.7×; C07); contact patch never leaves `B-DEW`; area conserved within ±10% across deform states.
- **R04** The ant never shivers, huddles, has a face decal or acts human (cold-blooded; fact-check L12 cue). It walks steadily, the leaf sail sways ≤ 4°.
- **R05** Warmth puff is a cartoon (soft cosy orange, rising slowly), never a thermometer, never grey smoke, never breath; the breeze stays small (C08 rests on size, not wind chill); clothes stay on.
- **R06** Cold only in shade (C11): TINY is never in sunlight in B04; the sun reaches her only in B05-SH03.
- **R07** The lift is dramatization of the C14/C15 direction: she lifts easily; no picture text or gesture compares her with the ant's feat (no flex, no "like the ant" side-by-side lift).
- **R08** Conceal: the ant is seen only as the far, unlit CL02 crossing in B04-SH02 before the B05 silence. The crumb is lifted only after V07.
- **R09** Frame zones: captions band y 1176–1344 (`bottomEdgeY` 1344); faces, drop, crumb, ant, bars above y 1160; `@TamMaiLa` top-left, nothing else above y 140. No title strip (VD18).
- **R10** Scale change is a matched cut on the pop (VD05), never a continuous zoom across k.

## Per-shot staging

Each block: staging (positions `est`, set units), camera, casting, light, sound, limits. Integer frames and SFX frame cues come in W5.1. Library IDs from `~/ReelsStore/library/sound/INDEX.md` (checked by the brief 2026-11-06; generated entries "not listened"); `NEEDS-GEN` IDs NG-* are listed at the end.

### S01-B01-SH01 — L01 (LF01)
- **Staging (SET-BALCONY, m):** TINY at (−0.30, 0, +0.30), leaning back on the rail, facing +z; mug in the right hand, one sip (cup to mouth and down). Planter trough x 0.00..+0.80 at z 0 on her left (screen right of her from this yaw est; Boss confirms the side at LF01); mug steam wisp.
- **Camera:** `cam: T-TINY (−0.30, 1.40, +0.30), yaw −30→−22 arc, r 2.4→2.2 m, eye 1.45, f 1050, hy 640`; rail diagonal, city haze dropping away screen left.
- **Casting:** `woman-bob + new: morning-pyjamas, P19, sleepy`; view `front`; prop `new: coffee-mug`.
- **Light:** warm low sun from screen right (elevation ~12°), long soft rail-post shadows across the tiles; sky `#a9c4dc`→`#f6d7a8`, sun disc with ENV-GLOW halo; glass rail as a veil (DF-20261030-painted-glass-sheen-veil).
- **Sound:** music NG-M1 in, curious, low (fallback `bed_pool-curious-sparse_01`); ambience `outdoor_dawn-street-empty_01` + `room_soi-morning-quiet_01` low; a soft mug sip (optional, NEEDS-GEN not requested; drop if absent).
- **Limits:** UT01 place at a glance; no brand, no text in the city.

### S01-B01-SH02 — L02
- **Staging (SET-BALCONY, m):** camera outside the rail at the planter; facade below z −0.05 down to y −27 (balcony slabs every 2.9 m), the garden lawn sunlit far below; TINY's left forearm and the mug on the rail cap at the top edge (cap y 1.10).
- **Camera:** `cam: (+0.40, 1.55, −0.30), pitch −65°, dolly y 1.55→1.25 push, yaw 0, f 950, hy 520`; no vertigo spin, no shake.
- **Casting:** TINY forearm only (`woman-bob + new: morning-pyjamas`, P19 hand on the cap); `new: coffee-mug`.
- **Light:** facade in cool morning shade, the lawn below in warm sun.
- **Sound:** music continues; a faint wind rise from below (`outdoor_wind-open-roundabout_01`, very low).
- **Limits:** the height is felt once; no measurement on screen.

### S01-B01-SH03 — L03
- **Staging (SET-BALCONY, m):** TINY turns from `front` to `right` toward the planter, sets the mug on the rail cap at (−0.25, 1.10, 0.00), touches the dewy grass with the left hand at (+0.15, 1.30, −0.05); `new: shrink-pop` on that hand point: her card scales down about the point (8 f ease-in in W5.1), puff ring + 6–8 sparkle ticks; the shot ends on the puff peak.
- **Camera:** `cam: T-PLANTER (+0.20, 1.28, 0.00), yaw +20→+28, r 1.3→1.1 m, eye 1.35, f 1100, hy 700`.
- **Casting:** `woman-bob + new: morning-pyjamas, P16 (reach, left hand), curious → surprised`; view `right`; effect `new: shrink-pop`.
- **Light:** warm sun; sparkle `#fff1cf`, ENV-GLOW ≤ 0.3; dew beads glint on the outer blades.
- **Sound:** NG-S1 shrink pop with a rising glissando sparkle on the touch; music lifts with it.
- **Limits:** R10; the puff screen position is the cut anchor for SH04 (±40 px, acceptance spike 2). Fallback: `Flash` white frame.

### S01-B01-SH04 — V01 (LF02)
- **Staging (SET-MACRO-PLANTER, sm):** TINY at (0, 0, 0), sitting (P33-like) as the puff fades around her at the same screen point, then standing; looks up (head tilted back) at blade clumps (−4, −2), (−1.5, −4.5), (+2.5, −3), (+5, +1), (−6, +3) (x, z), 20–38 sm tall; outer lip at z −6.4 with sky beyond.
- **Camera:** `cam: T-TINY (0, 1.0, 0), yaw 0→+8, r 2.6, crane eye 0.6→2.4, pitch 0→+35°, f 1000, hy 900`; near blades as dark soft sweeps at the frame edges (painted depth of field).
- **Casting:** `woman-bob + new: morning-pyjamas, P33 → P12, surprised`; view `front`.
- **Light:** backlit gold blades (`#b9d86a`→`#e8f2a0`), sun shafts (`Shafts` ≤ 0.3) from right-back, dew beads Ø 0.2–0.6 glinting.
- **Sound:** V01 squeak; NG-S2 giant grass creak under the crane; ambience the balcony bed low-passed and quieter + soft blade breeze.
- **Limits:** blades must slide in parallax (spike 1); TINY head ≥ 150 px.

### S01-B02-SH01 — L04
- **Staging (SET-MACRO-PLANTER, sm):** breeze bends the blades toward −z (tip deflection ≤ 25% of height); TINY at the lip (−0.4, 0, −6.0) is lifted off (P39), rising to (−0.8, 3.0, −8.5) as she clears the lip; hair and hem flutter.
- **Camera:** `cam: (−0.4, 1.0, −6.0), yaw −40→−25, r 3.2→2.8, eye 0.8, f 1000, hy 760`; beyond the lip the open sky and the hazy city far below.
- **Casting:** `woman-bob + new: morning-pyjamas, P39, scared`; view `left` at lift-off, squared at the mid-shot camera.
- **Light:** backlit blades; open bright sky past the lip.
- **Sound:** `whoosh_air-swish-rising_01` on the lift; blade breeze up.
- **Limits:** a breeze, not a storm; the lift is gentle, not a throw.

### S01-B02-SH02 — V02, L05
- **Staging (SET-DRIFT, sm):** TINY at the origin, arms out (`new: drift-spread`), slight body roll ≤ 10°; ENV-FALL `dust` motes drifting upward relative to her at 0.15 sm/s, sparse, thinned in the caption band; building face as a soft vertical wash with one blurred slab band sliding up (one band per ~4 s); `new: soft air streaks` = 3–5 thin pale curved strokes hugging her outline.
- **Camera:** `cam: follow T-TINY, yaw −10→+15 arc, r 2.4, eye level, f 1050, hy 780` (camera moves with her; no accumulated state).
- **Casting:** `woman-bob + new: morning-pyjamas, new: drift-spread, scared → surprised (wonder)`; view `front`.
- **Light:** bright open air; the facade wash in cool shade on one side, the morning sky on the open side.
- **Sound:** V02 falling yelp fading under L05; music thins to airy harp and high pad (NG-M1 section); `outdoor_wind-open-roundabout_01` airy, no roar.
- **Limits:** R02 (motes move < 40 px/s on screen, spike 4); air strokes are never radial speed lines.

### S01-B02-SH03 — L06 first half "ตกสิบชั้น…"
- **Staging (SET-FACADE, m):** TINY as a speck drifting (+0.2, 14.0, +1.4) → (+0.4, 12.6, +1.7) with a slight sway; her balcony slab at y 27.0 with the planter as a green dot; hedge z +1.0, tree (+9, 0, +6) leaning in at the frame edge; `new: ring marker` chalk circle Ø 70 px around the speck, drawn on over 6 f.
- **Camera:** `cam: (+2.0, 0.25, +6.0), pitch +50°→+46° tilt following the speck, yaw −12, f 900, hy 1100`.
- **Casting:** TINY speck (no pose read); ring overlay screen-space.
- **Light:** facade in cool shade, the sky bright above, tree leaves rim-lit.
- **Sound:** wind bed thin; music floats.
- **Limits:** the speck and ring are the point; the drift is dramatized slow (real terminal speed is not shown or stated).

### S01-B02-SH04 — L06 rest, V03
- **Staging (SET-GARDEN-GRASS, sm):** TINY lands feet-first at (0, 0, 0) in the sunlit clearing (x −1.0..+4.0, z −3..+3), small bounce 0.3 sm, knees bend, sits (P33-like), then `new: sit-up-check` hand pats on arms and legs.
- **Camera:** `cam: T-TINY (0, 0.7, 0), yaw +15→+5, r 2.2→1.9, eye 0.7, f 1050, hy 820`.
- **Casting:** `woman-bob + new: morning-pyjamas, P33 → new: sit-up-check, surprised → happy`; view `front`.
- **Light:** sunlit clearing, backlit gold blades ring; first view of the garden look (LF03 family).
- **Sound:** NG-S3 soft muffled tap on the thatch + `comedy_soft-boing_01` on the bounce; V03 "huh?" then giggle; music resolves with a light pluck; ambience `outdoor_park-birds-breeze_01` low-passed (far, huge birds).
- **Limits:** R02: no dust burst, no impact frame, no shake, no low thump.

### S01-B03-SH01 — L07 (LF03)
- **Staging (SET-GARDEN-GRASS, sm):** dew drop D1 at rest on `B-DEW` (root (+3.4, 0, −1.2), bent down to ~1.2 above ground at x +2.2), contact centre (+2.2, 1.15, −1.0), Ø 1.1, height 0.85; TINY walks from (0, 0, 0) to (+1.4, 0, −0.6) and reaches the right hand toward the drop (state a → start of b).
- **Camera:** `cam: T-DROP (+2.0, 1.1, −0.9), yaw −25→−15, r 3.0→2.6, eye 1.0, f 1050, hy 700`.
- **Casting:** `woman-bob + new: morning-pyjamas, walk → P16 (right-hand reach), curious`; view `right` on the walk, `front` three-quarter only if the reach needs it; prop `new: dew-drop` D1.
- **Light:** low sun from back-left (−x, −z), elevation 12°; the drop the brightest thing in frame: clear body 35–55%, hot rim `#fffbe8`, inverted refraction of sky and blades, caustic spot `#fff1b0` on the blade.
- **Sound:** `reveal_glass-shimmer-soft_01` on the drop glint; music curious.
- **Limits:** R03; the drop reads as water at 270 px (LF03 proof).

### S01-B03-SH02 — L08
- **Staging (sm):** TINY at (+1.2, 0, −0.6), right hand inside D1 (state b: dimple then wrap, meniscus collar on the wrist), she pulls back: state c, the drop stretches a neck toward her (neck ≤ 0.5 sm, fallback 0.3) while the contact patch stays on the blade; hand drawn inside the drop (drop body over the hand, rim over all).
- **Camera:** `cam: T-DROP, yaw +80→+72 (side-on to the pull), r 2.0, eye 1.0, f 1100, hy 720`.
- **Casting:** `woman-bob + new: morning-pyjamas, P16 pull-back (lean away), disgusted → angry (comic)`; view `left` or `right` profile squared to the side-on camera.
- **Light:** backlight through the drop; rim on her hair.
- **Sound:** L08 (TINY, the only spoken line); NG-S4 glassy drop boing + stretchy rubber-band creak.
- **Limits:** R03; layering hand-inside-drop is untested (spike 3).

### S01-B03-SH03 — L09
- **Staging (sm):** close on the wrist point (+2.0, 1.1, −0.9): the meniscus collar, the surface pulling back toward the blade (state c held, slight oscillation), caustics on the blade.
- **Camera:** `cam: wrist point (+2.0, 1.1, −0.9), yaw +60→+52, r 0.6→0.5, eye 1.1, f 1150, hy 640`; drop fills the upper half (~700 px), kept above y 1160.
- **Casting:** TINY hand and forearm (`woman-bob + new: morning-pyjamas`); D1.
- **Light:** backlit drop, caustic `#fff1b0`, hot rim.
- **Sound:** comic cello pizzicato tension (NG-M1 section); creak continues soft.
- **Limits:** no force arrows, no numbers (R01); the deform is the explanation.

### S01-B03-SH04 — L10, V04
- **Staging (sm):** TINY braced at (+1.2, 0, −0.6), both feet planted, leaning back, heaves; snap (state d): the neck breaks, the drop recoils with a 2–3-cycle wobble, her hand comes out with a wet sheen; she tumbles back and sits at (−1.2, 0, −0.4), across the shade edge (x −0.5) into shade, wet (VD10: darker patches on the pyjamas, clumped hair, 3–5 beads on the arms).
- **Camera:** `cam: T-TINY, yaw +30→+20, r 2.4→2.6 pull back, eye 0.8, f 1050, hy 780`.
- **Casting:** `woman-bob + new: morning-pyjamas, new: brace-heave → P39 → P33, angry → shock`; view `right` on the heave, `front` once seated.
- **Light:** sunlit drop side; she lands in the cool shade pocket.
- **Sound:** V04 grunt, pop, gasp; NG-S5 wet plop on release (partial `foley_wet-pops-bubbles_01`).
- **Limits:** "หลายเท่า" stays words only (R01); the tumble is soft (R02).

### S01-B04-SH01 — L11
- **Staging (sm):** TINY stands at (−1.4, 0, −0.6) in the shade pocket under the tuft `T-SHADE` (blades 22–26 tall leaning over), `front`, hugging herself; still wet.
- **Camera:** `cam: T-TINY (−1.4, 1.4, −0.6), yaw −10→−4, r 2.0→1.8, eye 1.0, f 1050, hy 700`; the sunlit clearing glows behind her (out-of-reach warm patch).
- **Casting:** `woman-bob + new: morning-pyjamas, P42, worried → sad`; view `front`.
- **Light:** cool blue shade air `#6f8fb0`, shade grass `#3f6b5a`→`#2f5560`, no shafts on her; warm patch behind.
- **Sound:** music shifts to the cool sparse minor (NG-M2); birds drop out, soft breeze only.
- **Limits:** R06; no visible breath.

### S01-B04-SH02 — L12, V05 (LF04)
- **Staging (sm):** TINY at (−1.4, 0, −0.6); a small breeze (−x) ruffles the bob and the shirt hem; `new: warmth-puff`: 3–4 soft orange clouds seep from the shoulders and top of the head (torso/head anchors), drifting −x and up at 0.3 sm/s; she reaches and clutches one to her chest (`new: clutch-puff`), it squeezes out between her mitten fingers and floats off; then P42 and V05 shiver. Optional (drop first if busy): a small leaf blanket blowing away. **CL02:** far ant at z −10.0 walking −x from x +9 → −9 through a blade gap in the upper middle, carrying leaf fragment L1 upright like a sail; ~40–60 px body, sail ~90–120 px, unlit, low contrast.
- **Camera:** `cam: T-TINY, yaw +5→+15 arc, r 1.9, eye 1.0, f 1050, hy 720`.
- **Casting:** `woman-bob + new: morning-pyjamas, new: clutch-puff → P42, worried → sad (comic)`; view `front`; far `new: ant` + `new: leaf-fragment`, `new: ant-walk`, view `left` profile.
- **Light:** cool shade; the puffs are the only warm colour on her (`#f4a259`→`#ffd29a`).
- **Sound:** NG-S6 warmth "fwoop" ×2 on emissions; V05 teeth-chatter "brrr"; NG-S8 tiny ant footsteps very low far (fictional); NG-M2 continues.
- **Limits:** R04, R05, R08; the ant is findable at 270 px but is not the first thing the eye lands on (spike 5); a gust would read as wind chill: keep it small.

### S01-B04-SH03 — L13, V06
- **Staging (sm):** crumb C1 (0.85 × 0.60 × 0.50) found at (−3.6, 0.25, −1.0); TINY nibbles (`new: nibble`, two tiny bites, one shallow bite mark appears), then drags it walking backwards toward +x (`new: drag-back`, both hands on the crumb, small steps, heels digging) to (−2.4, 0.25, −0.6); slumps seated against its +x side at (−1.75, 0, −0.6). The crumb's +x face catches the edge of the sun.
- **Camera:** `cam: T-CRUMB (−2.2, 0.6, −0.6), yaw +20, truck x −3.6→−2.2 with the drag, r 2.4, eye 0.8, f 1050, hy 780`.
- **Casting:** `woman-bob + new: morning-pyjamas, new: nibble → new: drag-back → P33, hungry-hopeful → tired`; view `front` for the nibble, `right` for the drag; prop `new: breadcrumb` C1.
- **Light:** shade edge at x −0.5: she stays in shade; the warm edge just ahead of her.
- **Sound:** `foley_bread-bite-crunch_01` pitched up slightly ×2; NG-S7 drag scrape; V06 grunt and defeated sigh; `stinger_pizz-shrug_01` on the slump.
- **Limits:** **CL01** planted as a burden; R06; crumb size is a gag.

### S01-B05-SH01 — silence, L14
- **Staging (sm):** silence first: TINY slumped at (−1.75, 0, −0.6); the ant enters from screen left at x −8.0, z −2.0, walking +x with leaf fragment L1 upright in its mandibles (top ~2.0 sm, taller than TINY, lean back 15°), passes behind her (z −2.0 vs her z −0.6) and walks on; she turns her head to follow (`turn-head-right`), mouth open. Shade edge slides x −0.5→−1.2 (sun climbing past the tuft, story-time cheat).
- **Camera:** `cam: T-PAIR (−0.3, 1.0, −1.3), yaw −15→−5, r 3.4→3.0, eye 0.6, f 1000, hy 800`.
- **Casting:** `woman-bob + new: morning-pyjamas, P33 + turn-head-right, shock → surprised`; `new: ant` + `new: leaf-fragment`, `new: ant-walk`, view `right` profile.
- **Light:** the ant walks out of shade into the sun patch; gloss highlight `#d98c62` on its back; leaf backlit edge `#e2f29a`.
- **Sound:** **silence policy 1:** music out, ambience down to the soft breeze, only NG-S8 ant footsteps for the ~0.8 s; music returns warm and building (NG-M3) under L14.
- **Limits:** R04, R08 (first close view of the ant); the load reads as "ant carrying a leaf", not "a leaf walking" (spike 6).

### S01-B05-SH02 — L15
- **Staging (sm):** the ant stops at (+1.2, 0, −2.0) (or holds mid-path near (0.0, 0, −2.0); Boss picks at blockout), leaf sail up; `new: scale-bars` card screen-space at y 360–1000 on the side away from the ant: cream card `#f4ecd8`, two vertical bars of equal start height, labels **"แรง"** (amber `#e8a33a`) and **"น้ำหนัก"** (slate `#5a7fa8`) under them in two label slots, a small TINY outline icon at the left. On "แต่ตัวเล็กลง…" the icon shrinks to ~40%, "แรง" shrinks slowly to ~45% (ease-out 1.4 s), "น้ำหนัก" fast to ~15% (ease-out 0.6 s), both starting on the same word; on "เลยมีแรงเหลือใช้" the part of "แรง" above "น้ำหนัก" glows `#ffe39a`.
- **Camera:** `cam: ant (0.0, 0.5, −2.0), yaw +10→+16, r 2.6→2.4, eye 0.6, f 1050, hy 760`; the plate keeps a slow push behind the card, dimmed 15% under it.
- **Casting:** `new: ant` + `new: leaf-fragment`, stand, view `right`; TINY at the frame edge or out of frame (est); overlay `new: scale-bars`.
- **Light:** sun patch on the ant; card in flat light (flat wash underlayer, DF-20261030-painted-straight-bars; labels DF-20261030-painted-label-slots).
- **Sound:** `ui_pop_01` as each bar appears; `whoosh_fast-slide_01` (soft) on each shrink; NG-M3 building.
- **Limits:** R01: labels only, no digits, no axis, no ticks, no %; end heights are illustration, not to scale; "ไม่ใช่เพราะกล้ามมันเก่ง" gets no muscle picture (no flexing ant).

### S01-B05-SH03 — V07, L16
- **Staging (sm):** TINY at (−1.75, 0, −0.6), dry now; V07 gasp, looks from the ant (screen right) to the crumb (`turn-head-left`), stands, grips C1 at its two-hand grip points, lifts it overhead in one move (`new: lift-overhead`, P45 arms, elbows back into depth per DF-20261030-painted-arm-depth); crumb centre ends at (−1.75, 2.25, −0.6); holds it high, grinning, through L16. The shade edge slides x −1.2→−3.0 and crosses her at the lift key.
- **Camera:** `cam: T-TINY (−1.75, 1.2, −0.6), yaw −20→−12, r 2.2→2.0, eye 0.7, pitch +8°, f 1050, hy 860`.
- **Casting:** `woman-bob + new: morning-pyjamas, new: lift-overhead (P45 base), shock → happy → laugh`; view `front`; prop C1 parented to both hands.
- **Light:** warm sun arriving across her on the lift, rim on the crumb; the first time she is in sun since the landing.
- **Sound:** `reveal_reverse-swell-airy_01` riser into V07; NG-S9 tiny triumphant brass-and-celesta sting on the lift; NG-M3 warm.
- **Limits:** R07: no flex, no wobble, no "as strong as an ant" picture; the lift is labelled dramatization (C15 direction only).

### S01-B05-SH04 — L17, V08 + hold
- **Staging (sm):** wide: TINY centre-left at (−1.75, 0, −0.6) holding C1 overhead; the ant on her right at (+1.2, 0, −2.0) with its leaf sail; on V08 the ant turns its head and antennae toward her (view `front`); the balcony slab and the tower faintly far above in the haze; live ~2 s hold (breath, blade sway, antenna twitch), then fade to black.
- **Camera:** `cam: T-PAIR (−0.3, 1.0, −1.3), yaw −8→−2, r 5.0→4.6, slow push easing to near-stop, eye 0.9, f 1000, hy 760`.
- **Casting:** `woman-bob + new: morning-pyjamas, new: lift-overhead hold, happy`; `new: ant` + `new: leaf-fragment`, stand → glance (`front` head turn).
- **Light:** warmest frame: low gold sun through the grass forest, backlit blades, gloss on the ant.
- **Sound:** NG-M3 theme resolves under L17 (fallback `stinger_pizz-tag-ending_01`, `stinger_outro-resolve_01`); V08 squeak; hold: the end chord rings out with low birds and breeze, fading with the picture to true silence (silence policy 3).
- **Limits:** `A_fade`, `endHoldSec` 0 (live hold), `endFadeSec` ≈ 0.8 (Editor confirms W5); TINY, crumb and ant all read at 270 px; last frame full black (spike 8).

## Look frames W3.1 needs

| ID | Shot | Must prove |
| --- | --- | --- |
| **LF01** | S01-B01-SH01 | Balcony at dawn reads in one second (rail, planter, city haze); morning light; TINY outfit `new: morning-pyjamas` and lead size |
| **LF02** | S01-B01-SH04 | Macro planter looking up: blades read as a forest, the scale joke lands, backlit dew beads |
| **LF03** | S01-B03-SH01 | Macro garden backlit with D1 at rest: drop reads as water, ≤ her size; the garden look B02-SH04 and B05 reuse |
| **LF04** | S01-B04-SH02 | Cool shade + warmth puff: shade reads cold, puff reads warm and comic, CL02 ant visible but not featured (may merge into LF03 if the user accepts the garden look) |
| **Ant look check** (VD20) | before LF04 / B05 | ≤ 3 stills of `new: ant` with `new: leaf-fragment` L1: walk with leaf `right`, stand with leaf, glance `front`; caption band shown; written in the shared kit (look-assets), user pick before Boss hardens the gait |

B02-SH02 (drift) and B02-SH03 (facade wide) are checked against LF01/LF02 at the W3 storyboard pass, not painted as look frames.

## Sound NEEDS-GEN list (from the brief; generated at W4+ by the Editor)

NG-M1 curious celesta-harp theme 60 s ~92 bpm · NG-M2 its cool minor sparse variant 15 s · NG-M3 its warm building variant + resolving end chord 25 s (one seed/prompt family) · NG-S1 shrink pop + rising glissando sparkle 1.2 s · NG-S2 giant grass creak 3 s · NG-S3 soft muffled landing tap on thatch 0.4 s, no low thump · NG-S4 glassy drop boing + rubber-band creak 1.5 s · NG-S5 wet plop 0.5 s · NG-S6 warmth puff "fwoop" 0.8 s ×2 · NG-S7 crumb drag scrape 2 s · NG-S8 tiny ant footsteps 4 s loop (fictional) · NG-S9 triumphant brass-and-celesta sting 1.5 s.

## Open items

- **Missing evidence:** no voice (lengths `est`); no blockout of the macro scale, the drop deform, the hand-inside-drop layering or the insect rig (`missing`).
- **Film calls the user may override at the review page (non-blocking):** the sun patch reaching TINY exactly at the lift (B05-SH03; story-time cheat of a few minutes); the ant stopping on her right for L15–L17 rather than walking out of frame; the optional leaf blanket in L12 (dropped first if busy).
- **New poses / looks to Boss (N10):** `drift-spread`, `sit-up-check`, `brace-heave` (added in this pass for B03-SH04; small, may be P16 pull-back + leg spread), `nibble`, `drag-back`, `clutch-puff`, `lift-overhead`, `soft air streaks`.

## Change log

- **SS-R1 (2026-11-06, Film W2.2):** first untimed storyboard pass from script R1.3a and brief EDU-BRIEF-R1.1: 19 shots with the brief's IDs, per-shot staging (est), camera lines, casting lines, light, sound (library IDs and NG-* requests) and limits R01–R10; LF01–LF04 + ant look check listed for W3.1; Thai rows in review-rows.json. One new pose proposal (`brace-heave`). No render, no paint, no audio.
