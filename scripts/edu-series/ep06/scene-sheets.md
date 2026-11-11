# Timed scene sheets and index — EDU-EP06-SHORT (EDU-EP06-SHEETS-R1.1)

- **Deliverable:** `EDU-EP06-SHORT` · **Revision:** EDU-EP06-SHEETS-R1.1 (Film W5.1 retime, 2026-11-07; R1 history in the [change log](#change-log)) · **Status:** `ready-for-dev`, **voice-timed**: Boss may build finished-grade plates from this revision. · **Timing:** shot ranges and line onsets are `measured` from the W4 voice lock (user closed 2026-11-07): NAR Revision E (`lines.json`), OWN L03/L03b Leda takes, shot table = [voice-measure.md "OWN takes"](voice-measure.md#own-takes-2026-11-07-user-picked-v1--gemini-leda-revision-e-otherwise-unchanged) (`out/ep06-voice/slow/shots-own.json`, 1685 f). Word anchors inside a line are `meas` where a pause in the read locates them (Film run on the locked file, 5 ms RMS, gaps below −40/−32 dB) and `est` where they are syllable-proportional inside a measured segment; each is labelled. **V01 (mrrp) and V02 (purr) stay `est`:** sound-library/NEEDS-GEN cues placed by Film, no take measured.
- **Evidence:** runtime: none (no composition, no blockout) · audio: locked takes measured, not placed on a timeline · render/samples: none; projection numbers come from a Film script that mirrors `kit/ycam.ts` (`camSpace`, `camToPicture`, `orbitYCam`), calibrated on LF01 (her rig head unit 323 px at frame 27, identical to the W3 measure); values marked `meas` come from that run, everything else is `est` · audio/subtitle sync: none (frames computed, not rendered) · user approval: script R1.2 (2026-11-07), storyboard rows R1.2 passed, LF01–LF04 and cat face CFa approved (2026-11-07), NAR Revision E and OWN takes locked by ear (2026-11-07); script R1.3 wording and this sheet revision are not user-approved.
- **Inputs (by revision):** script **EDU-EP06-SCRIPT-R1.3** ([script.md](script.md), L13 reworded, ending `A_fade`; R1.2 was the R1 input); fact-check [fact-check.md](fact-check.md) (W1.3 + R1.1/R1.2 rechecks pass, [R1.3 recheck](fact-check.md#r13-recheck-boat-2026-11-07) pass with the L13 delivery condition); voice lock [voice-measure.md](voice-measure.md) Revision E + OWN takes, store `projects/edu/EDU/narration/ep06/lines.json` (Revision E + OWN rows); brief EDU-EP06-BRIEF-R1.2 ([film-brief.md](film-brief.md): VD01–VD18, set plan, projection contract, sound direction, spikes 1–8, K1–K8, N1–N7, user picks 2026-11-07); storyboard EDU-EP06-ROWS-R1.2 ([storyboard.md](storyboard.md), rules R01–R08); look frames v3 `out/edu06/look-frames/v3/LF01–LF04.png` (store `projects/edu/EDU/previews/look-frames/ep06/`); Boss W5.2 modules (uncommitted, read 2026-11-07): `src/painted/edu06/` (`room.ts` `LR`, `paintRoom`, `catItem`; `room-light.tsx` `RoomLight`; `cast.ts` `OWN`, `paintOwn`; `qa.tsx`), kit `eye.ts`, `catface.ts`, `glare.ts`, `glow.tsx`, `hands.ts`, `poses-seated.ts`, `animals.ts`, `animal-motions.ts`, `wardrobe.ts` (`home-lounge`).
- **Target:** worktree `hanako-progress-06cb22`, branch `claude/cat-stare-progress-0a4422` at `869cc29` + the uncommitted Boss W5.2 files above · 30 fps · `durationFrames` **1685** (`measured`, 56.17 s) · 1080×1920 · composition offset 0 (not registered; Editor, never in `src/Root.tsx`).
- **Baseline (link, not copied):** SET-LIVINGROOM metres, origin, axes, furniture and day state per the [brief set plan](film-brief.md#set-plan--set-livingroom-metres-est-until-the-look-frames) as built in `room.ts` (`LR.seat` 0.302, `LR.arm` = seat + 0.18, anchors `LR.*`); EYE and CATFACE close plates at 1 set-m ≈ 1 cm per the [projection contract](film-brief.md#projection-contract-and-scale-baseline). Camera line `cam: target, yaw a→b, r, eye, f, hy [, cx] [, pitch]` = kit `orbitYCam(target, r, yaw·DEG, eye, f, hy)` (camera at target + r·(sin yaw, ·, cos yaw), `eye` = absolute camera height, yaw 0 on +z looking −z, positive toward +x), `cx`/`pitch` set on the returned YCam; `pos → target` lines are a camera at `pos` turned toward the target. Moves ease in-out (`0.5 − 0.5·cos(π·L/(n−1))`, as `scenes.ts` `ease`) over the whole shot unless stated.
- **Card convention (W3, kept):** OWN is one flat card standing at her feet line `LR.ownFeet` (−0.15, 0, +0.05), squared to the mid-shot camera; her head, hands and knees are drawn on that card, so every camera that frames her face, hand or knee targets the card (`T-OWN-CARD` (−0.15, 1.07, +0.05)), not the brief's T-OWN (z −0.38). Seated OWN est sizes: eye 1.07, head top 1.27, chin 0.87 m on the card; lead measure = standing-equivalent (1.62 m × `camUnit`) as EP05. Cat sit: eye +0.33, ears +0.40 above its paw plane (calibrated on LF01: eye y 1010 measured vs 1016 run).
- **Clocks:** `G` composition frame; shot-local `L` = G − shot start; ranges half-open `[start, end)`. Ambient clocks (breath, cat tail sway, lamp halo, ear twitch) run on G; event clocks (lid curves, glare grade, cat motions, glow pass, blink, tail) run on L and are pure functions of L (seek-safe).
- **One shot = one timeline scene** (scene ID = shot ID). All joins are hard cuts except B04-SH03 → B04-SH04 (6 f dissolve) and the `A_fade` end.

<a id="retime-after-voice-lock"></a>
## Retime after voice lock (Requirement for R1.1)

R1 was `est` throughout. **R1.1 applies these rules** to the W4 lock (2026-11-07); the [retime notes RN01–RN08](#retime-notes-r11) list every place where a rule met a consequence.

- **RT01 Stable:** shot IDs, order, beats, line assignment, casting, staging positions, camera lines, light states, sound IDs and acceptance checks stay as written. Only shot ranges and event frames move.
- **RT02 Shot starts:** a narrator- or OWN-led shot starts 4 f before its line's measured onset (picture leads voice). Exceptions: S01-B01-SH03 cuts 0–3 f before the onset of "เป็นการท้าทาย"; S01-B04-SH05 cuts inside L10's pause after "…มือคนแปลกหน้า…"; S01-B04-SH01 (60 f), S01-B05-SH04 (30 f) and S01-B05-SH05 (36 f) keep their lengths (silence/closing, not voice-bound); S01-B01-SH04 = L03 + V01 + at least 30 f for the cat's exit (see its block).
- **RT03 Word anchors move, fixed actions keep length:** every cue written "on <word>" moves to that word's measured onset (glare start, drain, lid states, count notes, blink, tail landing, resolve). Fixed-duration actions keep their frame counts: glare rise 40/24 f, drain 30 f, CATFACE turn 10 f and half-close 15 f, EYE lid curves, step-up hop 10 f (motion 21 f), head-rub motion clock, blink 32 f, tail curl 36 f, fade 24 f.
- **RT04 Camera:** each move eases over the whole retimed shot (no change to start/end values).
- **RT05 Length:** if the locked total exceeds 60 s, report it with the numbers; trims are the script's N1 candidates (Preaw/user only, never Film or Editor).
- **RT06 Rows:** `review-rows.json` gets the new `start`/`end` and `timingEstimated: false`; Thai text unchanged, so storyboard verdicts carry over.

## Totals

- **19 shots, 1685 frames = 56.17 s `measured`** (inside 40–60 s; 3.83 s slack, RT05 not triggered). R1 est was 1602 f / 53.4 s (+83 f).
- Build-up: NAR speech 43.02 s (Revision E, re-gapped 0.28 s on the timeline) + OWN L03 2.66 s + L03b 0.95 s (`measured`) + V01 0.60 s (`est`) + silent answer 2.0 s + closing 2.2 s + leads/holds; no line overlaps another (V01 starts 2 f after L03's last voiced frame).
- Shortest shots: S01-B05-SH04 (30 f), S01-B05-SH05 (36 f), S01-B04-SH02 (37 f), S01-B01-SH03 (41 f); none under 24 f.
- Ending: `video.ending: 'A_fade'`, `endHoldSec: 0` (live, no freeze; the default 3 s hold must be overridden), `endFadeSec: 0.8`: fade G1661–1685 (24 f), G1684 full black. No loop seam (user decision 2026-11-07).
- **Source note:** the store `projects/edu/EDU/narration/ep06/shots.json` still holds Revision E without the OWN takes (1639 f); the 1685 f table is `out/ep06-voice/slow/shots-own.json` (worktree cache) = voice-measure.md "OWN takes" table, which R1.1 uses. Editor files `shots-own.json` to the store (or replaces `shots.json`) before the worktree goes.

<a id="retime-notes-r11"></a>
## Retime notes (R1.1)

Line onsets on the timeline (G, NAR/OWN placed 4 f after their shot start, `measured`): L01 4 · L02 50 · L03 160 · L04 294 · L05 343 · L06 411 · L07 526 · L08 644 · L03b 851 · L09 888 · L10 1044 · L11 1183 · L12 1312 · L13 1410. Word anchors per shot block.

- **RN01 S01-B01-SH04 (134 f, was 66 f est): full exit restored, beat order adjusted (SD01).** L03 is 80 f (2.5× the est), so V01 lands at L86–104 and only 30 f follow it; at the kit walk speed (`cat-orange-tabby` 0.37 m/s, 0.5 s start ramp) a 0.55 m exit needs 52 f of walking, so "mrrp, then stand, then walk" cannot clear frame. Film order: ears flatten on the coo's drawn tail (L50–56), stand (view swap) L60, walk out from L75, **the mrrp V01 while it walks away** (L86–104), frame clear by ≈ L127, 7 f of empty cushion before the cut. Script V01 lists ears, turn and leaving with the mrrp; all three still happen inside the V01 beat, the mrrp is placed over the leaving. The longer coo gets a held lean (peak L31) with the cat sitting stiff (lid 0.15) and ears flattening: no added story.
- **RN02 S01-B01-SH03 (41 f, was 54):** reaction keyed to "เป็นการท้าทาย" (onset L2); whiskers compressed 30 → 26 f (L12–38) so the stiffening completes 3 f before the cut.
- **RN03 S01-B02-SH03 drain:** "มากกว่าความรัก" onset `meas` L88 (pause 2.69–2.82 s in L06), shot 115 f; the 30 f drain would run 3 f past the cut. Drain L88–115 = **27 f** (−3 f, RT03 deviation); the full warm state lands on the last frame and B03-SH01 continues it.
- **RN04 S01-B04-SH04 (72 f, was 78):** cat beats moved 2–4 f earlier so the three sniffs end inside the shot (L52–70). The cut to SH05 sits at the end of L10's 60 ms pause (2.17–2.23 s `meas`): G1112 is 0.7 f after the L10b onset; Editor may move the cut 1 f earlier (G1111) if the onset clips.
- **RN05 S01-B04-SH05 (67 f, was 72):** head-rub clock `t = (L + 11)/30` (was L + 6) so both rubs and the release finish by the cut (2.6 s motion).
- **RN06 S01-B05-SH01 (129 f, was 108):** 21 f more of the wide gap before L11b; the blink keeps its 32 f, on "กะพริบ" (`meas` L97), and ends on the cut as in R1.
- **RN07 S01-B05-SH03 (213 f = 7.10 s, was 168 f est): picture holds, open question Q-RT2.** "รัก" at L200 (G1606) and ends on the cut (L213). A quiet two-shot is the Film recommendation (the attribution must be heard, warmest frame), with picture-only micro beats (her look drifts to the cat L60–100, cat ear twitch on the ambient clock, tail-tip breath). A visible action beat would be a story choice; see Open decisions.
- **RN08 L13 read vs delivery condition (Boat R1.3, script N7):** the locked read has a **0.31 s pause between "สัญญาณที่ดี" and "ที่คนเลี้ยง…"** (`meas` 3.41–3.72 s in L13; voice-measure Revision D flag, already in the user-chosen splice V2) besides the 0.35 s breath before "รัก". Condition: the only pause should be the one before "รัก". Not changed by Film (W4 closed by the user); the caption plan keeps "นั่นคือสัญญาณที่ดี" and the attribution in one cue so the eye reads them as one phrase; open question Q-RT1. Second R1.3 condition held: no caption over the closing picture (L13b caption ends on the cut, G1619) and nothing on screen says the cat loves her.

## Staging deviations (Film decisions)

Forced by the projection run, the approved look frames or Boss's built capability; these numbers win over the brief/storyboard `est` values (brief owns everything not listed).

- **SD01 S01-B01-SH04:** `cam: T-PAIR, yaw +14→+18, r 1.60→1.50, eye 0.95, f 1100, hy 760, cx +60`. The brief's r 1.25→1.20 puts her feet at x 0–43 and cuts her body at frame left (`meas`), the same fault LF01 fixed at W3. R1 (est 66 f): the cat stood and took its first step on the cut. **R1.1 (134 f): full exit restored** with the beat order of [RN01](#retime-notes-r11) (user answer 2026-11-07: full exit if the read gives ≥ 3 s).
- **SD02 S01-B02-SH01:** camera turned toward `T-OWN-CARD` instead of T-OWN: the brief target puts her at x 311–344 with empty right half; on the card eye she is centred (x 589→590 `meas`), head 380→426 px.
- **SD03 Face closes (S01-B02-SH03, S01-B04-SH02, S01-B05-SH05):** orbit about `T-OWN-CARD`. About T-OWN at r 0.72 her card is 0.39 m from the lens (head ≈ 1200 px); about the card eye her head is 623–687 px (`meas`; brief target 640).
- **SD04 S01-B04-SH03 — VD11 fallback camera adopted (BC2 family):** `cam: (0.35, 0.60, −0.30), yaw −25→−18, r 1.9, eye 0.85, f 1000, hy 760, cx −40`. The brief camera fails the projection check: she starts off frame (eye x −171), the cat on the armchair is 564 px tall in the lens, and the arm leg moves **screen-right** (517 → 552) under a left-facing card (a moonwalk), then left again (`meas`). On the fallback every leg moves left (rim 932 → landing 741 → arm end 637 → cushion 502) under a `left` card, she holds frame left (eye x 277→240, head 310→301 px). This is VD11's recorded trigger ("the −z leg reading as a profile card sliding in depth"), found by projection instead of blockout. The cat starts sitting at the armchair seat **rim** (0.90, 0.30, 0.22) (the seat centre projects off frame right at this camera; the cut via the two closes hides the shift).
- **SD05 S01-B04-SH05:** `cam: (0.15, 0.62, −0.05), yaw +20→+26, r 1.05→1.00, eye 0.80, f 1100, hy 760`. The brief's T-HAND r 0.90 puts her face off frame left (eye x −103) and the cat 643 px in the lens. The cat is in **profile `left`** (facing her palm = −x, which is what `squareToCam` gives; kit `head-rub` is profile-only), not `front`; it stands on the **front half of the cushion** so its card is within 0.15 m of her card's depth.
- **SD06 Side of her hand and knee:** the hand she offers and the knee the tail reaches are her **left** (screen right, toward the cat): `seatedPose('seated-offer-palm', …, {toward: 1})` draws her left arm; anchor `lHand`. The brief's "right palm / right knee" is a side slip; positions are unchanged.
- **SD07 B05 curled cat:** curled on the right cushion's front half at (0.20, 0.30, −0.10), facing her (`left`), nose at her thigh, tail wrapped forward over her knee (as Boss QA `curl + tailTo`); brief (0.30, 0.30, −0.45) leaves the tail 0.5 m from her knee in the card plane.
- **SD08 S01-B05-SH03:** `cam: T-PAIR, yaw +12→+8, r 1.75→1.62, eye 1.00, f 1050, hy 660, cx +60`. The brief's yaw +10→+6, r 1.50→1.35, hy 760 puts the whole curled cat in the caption band (top y 1205–1263) and cuts her at left; this frame keeps the cat's head and back at y 1038–1149 (`meas`).
- **SD09 S01-B05-SH02:** target (0.10, 0.42, −0.02), r 0.70→0.65 (brief 0.60→0.55 pushed the cat's body off the right edge).
- **SD10 EYE smile state:** kit `lid 0.75, lift 1` (LF03 v2, user-approved) replaces the brief's lid 0.45; shut = `lid 0, lift 0.2` (kit QA).
- **SD11 S01-B04-SH01:** hold before the half-close 20 f (brief ~0.8 s) so the bloom and motes get 15 f before the cut inside the 60 f beat.
- **SD12 Step-up numbers:** `rise LR.hop.rise` 0.18 m, `across LR.hop.across` 0.32 m (built set; brief text says 0.20 m hop). Spike 6 reads "small hop ≈ 0.18 m".

**Lead-size notes:** her standing-equivalent is ≥ 900 px in every room shot that shows her (`meas`); her head ≥ 280 px everywhere except the two T-GAP wides (237–246 px, accepted: VD08/VD14 want the gap, blink readability is an acceptance check). Cat-led frames: S01-B04-SH04 cat 422→468 px tall (whole animal; exception like EP05's close inserts), CATFACE plates head ≈ 640 px wide.

## Asset and capability bindings

| Need | Module / ID / parameters (as built) | Status | Gap |
| --- | --- | --- | --- |
| Living room night/day | `paintRoom(p, cam, {t, cast, light, fore, dressing})`, anchors `LR`, `catItem(at, pose, t, layer)`, overlay `<RoomLight cam light>` | exists-unintegrated (Boss QA stills `out/edu06/boss/qa/room-night.png`, `room-day.png`) | no warmth step for B05 (BOSS-6) |
| OWN | `OWN = dress(PEOPLE['woman-curly'], 'home-lounge')`, `paintOwn(p, cam, {at, view, pose, face, faceState, fig, t, warm})` | exists-unintegrated | three-quarter via `fig.quarter` unverified at 650 px head (BOSS-5) |
| Seated poses | `seatedPose('seated-lean-in' \| 'seated-offer-palm', OWN, g, u, view, {amount, toward})` spread into `fig` (as `qa.tsx` `QA_SEATED`); outside P01–P45, cite by ID | exists-unintegrated (`seated.png`) | `paintOwn` uses `poseFor` only; the seated pose goes through `fig` |
| Cat body | `drawAnimal` / `catItem` with `AnimalPose` `lid`, `ears`, `lean`+`leanTo`+`leanAnchor`, `tilt`, `curl`, `tailTo`, `contact`; motions `stand-up`, `sit-down`, `walk-in-from-right`, `step-up` (ctx `rise`, `across`), `head-rub` (ctx `target`) | exists-unintegrated (`cats.png`, `cats2.png`, `rub*.png`) | lean/head-rub/curl/tailTo profile only (used so); no step-down (BOSS-1); tailTo reach (BOSS-2) |
| EYE | kit `paintEyeMacro(p, cam, {t, u: 0, mist: false, catch, lid, lift, glare})`, camera `orbitYCam([0,0,0], r, yaw, 0, 1000, 880)` + `pitch 0` | exists-unintegrated (EP02 consumer re-pointed) | — |
| Glare | `glarePainter(p, g)`, `glareGrade(L, {start, rise, drainAt, drain})`, `<GlareVeil g>` | exists-unintegrated | no brow shadow for the rig face (BOSS-4) |
| CATFACE | kit `paintCatFace(p, {r, f, hy, cx, camYaw}, {lid, pupil, ears, whiskers, yaw, roll, gaze, brow}, {warm, halo, motes, t})`, style CFa | exists-unintegrated (`out/edu06/boss/n2/CFa.png`, `LF02.png`) | — |
| Glow pass | `<GlowPass x y u dir count travel r level seed lead>`, `GLOW_DIR_LEFT`, peak ≤ 0.3, inside `<svg>` with screen blend | exists-unintegrated (`glow.png`) | LF02 match (BOSS-7) |
| Visitor hand | `paintVisitorHand(p, {base, wrist, dir, side, size, skin: 'light', watch: true})` | exists-unintegrated (`room-day.png`) | — |
| Ending / captions / chrome | `endHoldSec`/`endFadeSec` (`src/scenes/endings.ts`), `captionStyle.bottomEdgeY`, `video.chrome` | existing-integrated | — |

Dev findings carried from the brief (no revalidation run): DF-20261030-painted-layer-order, DF-20261030-painted-arm-depth (lean-in, offered palm), DF-20261030-painted-profile-head-turn (S01-B01-SH04 view swap on motion), DF-20261029-painted-timeline-dissolve (glare grade and the day dissolve in-canvas), DF-20261030-painted-story-hold-ambient-clock (S01-B04-SH01), DF-20261030-ending-hold-option (live fade), DF-20261031-povhand-wrist-corner (visitor wrist).

## Sound plan (whole video; per-shot cues in the shot blocks)

Library checked 2026-11-07 at `~/ReelsStore/library/sound/INDEX.md` (222 lines): every library ID below exists; all are generated and "not listened" (Editor ear-checks before use). The library has **no cat sounds, no felt-piano theme and no night living-room tone**, so the brief's NEEDS-GEN list stands unchanged. Sound never carries a fact; the purr is never explained.

| Layer | Source | Global use (G; word-anchored frames `meas`, V01/V02 `est`) |
| --- | --- | --- |
| Theme | **NEEDS-GEN NG-M1** lo-fi felt-piano bed, 72 bpm, warm, no drums, 30 s (fallback `bed_eg2-solo-piano-sparse_01`, partial: reverberant) | G0–294, low; out on "ลองนึก" |
| Tension | `bed_sub-drone-fade-in_01` (drone) + `tone_thin-unresolved_01` (thin harmonic) | drone G62–522; thin tone G294–522 (fades G495–522) |
| Count notes | **NEEDS-GEN NG-M3** two felt notes a fifth apart, ~1.5 s each | G717 ("หนึ่ง"), G733 ("สอง") |
| Warm return | `bed_warm-pad-felt-third_01` (8 s) under L03b, then **NEEDS-GEN NG-M2** (same theme warmer + pad, 25 s, ends on a ~4 s resolving chord; fallback resolve `stinger_outro-resolve_01`) | G877–1685; resolve onset on "รัก" (G1606) |
| Room night | **NEEDS-GEN NG-A1** quiet condo living room at night, 12 s loop + `tension_clock-pulse_01` (tick) | every night shot, continuous across cuts |
| Room day | `room_soi-morning-quiet_01` (far birds) | G1040–1112 only, crossfaded |
| Cat / foley one-shots | **NEEDS-GEN** NG-S1 mrrp 0.6 s · NG-S2 purr loop 8 s · NG-S3 paw thump on cushion 0.3 s · NG-S4 paw steps 2.5 s · NG-S5 sniffs 0.8 s (partial fallback `creature_dog-sniff-snuffle_01`, likely too big) · NG-S6 fur rubs 1.2 s · NG-S7 sofa creak 0.8 s · NG-S8 cushion settle 0.8 s | per shot |
| Accents | `reveal_reverse-swell-airy_01` (0.8 s) into "ลองนึก"; `reveal_glass-shimmer-soft_01` chime on the half-close; optional quieter copy on the closing blink (Editor's call) | G286, G832, (G1639) |

**Silence policy (brief):** (1) S01-B04-SH01: music out, NG-A1 + tick only, the chime exactly on the half-close frame; (2) no sting or hit on V01; (3) L13 attribution rule below; (4) closing: no speech; chord, purr and room tone fade with the picture to digital silence on G1684.

<a id="l13-attribution-rule"></a>**L13 attribution audibility (Requirement; script N7, fact-check N4b and [R1.3 recheck](fact-check.md#r13-recheck-boat-2026-11-07)).** (a) NAR reads "สัญญาณที่ดี ที่คนเลี้ยงแมวหลายคนเชื่อว่ามันกำลังบอก… รัก" as one phrase, the only pause the breath before "รัก" (voice-lock condition; the locked read also pauses 0.31 s before "ที่คนเลี้ยง…", [RN08](#retime-notes-r11)). (b) From the onset of "ที่คนเลี้ยงแมวหลายคนเชื่อว่ามันกำลังบอก" (G1522 `meas`) to its last voiced frame + 4 f (G1599), M2 stays at its B05-SH01 bed level (no swell, no new instrument), the purr is ducked under the voice like the music, and no one-shot fires. (c) The resolve chord's onset is **no earlier than the onset of "รัก" (G1606 `meas`)**. (d) Acceptance: ear check on a phone speaker that the clause is intelligible, plus Editor's measured speech-over-bed margin for that window recorded in build notes (proposed target ≥ 10 dB; Editor owns levels). (e) No caption or on-screen text over the closing picture (SH04/SH05) says or implies the cat loves her.

**Mix intent (EP08a):** B01 hold, small lift on the lean-in, drop on V01 (no hit); B02 drop (cold, sparse); B03 release, two soft hits on the count notes; B04 silence → hit (chime) → release into warmth, lift on the walk; B05 hold warm → release on "รัก" → fade.

## Caption plan

- White captions with the edu stroke (series default; **no shade band**, user 2026-11-07), `captionStyle.bottomEdgeY` 1344, band y 1176–1344, ≤ 2 lines, break after "…" when a cue wraps. Subtitle text = spoken line verbatim; one Film choice allowed by the script: L03 subtitle "น่ารักจังเลย". V01/V02 get no subtitle. `video.chrome` `@TamMaiLa` top-left; no other on-screen text (R01, VD17).
- Cue rule: `[word onset, voiced end + 6)` capped at the next cue's onset. Split cues (Film; each part verbatim): L02 a/b at the B01-SH02/SH03 cut; L06 a "ในภาษากายแมว… แบบนี้อาจดูเป็นการข่มขู่…" / b "มากกว่าความรัก"; L07 a "ถ้าอยากส่งสัญญาณที่นุ่มกว่านั้น…" / b "ลองกะพริบตาช้า ๆ"; L08 a "หรี่ตาเหมือนยิ้ม… ค่อย ๆ หลับ…" / b "หนึ่ง… สอง… แล้วค่อย ๆ ลืม"; L09 a "งานวิจัยเล็ก ๆ ในอังกฤษพบว่า…" / b "แมวมีแนวโน้มหรี่ตา หรือกะพริบช้า ๆ ตอบ"; L10 a/b at the B04-SH04/SH05 cut; L11 a "ลองคืนนี้ดู… นั่งห่างสักเมตรนึง…" / b "แล้วกะพริบช้า ๆ"; L13 a "แต่ถ้ามันกะพริบกลับมา…" / b "นั่นคือสัญญาณที่ดี ที่คนเลี้ยงแมวหลายคนเชื่อว่ามันกำลังบอก… รัก" (R1.1: split moved so "สัญญาณที่ดี" and the attribution share one cue and "รัก" is never alone; b ends on the cut G1619, never over the closing picture). Editor confirms every cue fits two lines at the caption font (L13b is the longest cue).
- Frame zones (R07): eyes, faces, the hand contact and the cat's head stay above y 1160 (per-shot `meas`); nothing important above y 140.
- **Open check (Editor, W5.3):** the stroke captions sit on bright picture in several shots (W3 band luma mean/p95: LF01 0.46/0.66, LF02 0.66/0.87, CFa 0.63/0.87). User decision 2026-11-07: no darkening, no band move. Editor verifies legibility on **real caption frames** of S01-B04-SH01 (CATFACE bib), S01-B01-SH01 and S01-B03-SH01 with `scripts/caption-zone.py --band 1176:1344` and a viewed sheet; if a cue is not legible, report to the user (do not darken or move on your own).

## Shot map

| Shot | Beat | Frames [start, end) (len), R1.1 | R1 est | Voice | Claims / clues |
| --- | --- | --- | --- | --- | --- |
| S01-B01-SH01 | B01 | 0–46 (46) | 0–54 (54) | L01 | frame: hook; CL02 plant; CL03 plant (not featured) |
| S01-B01-SH02 | B01 | 46–115 (69) | 54–108 (54) | L02a | C01/C03/C04 `hedge` (VO) |
| S01-B01-SH03 | B01 | 115–156 (41) | 108–162 (54) | L02b | as L02; pupils/whiskers dramatization |
| S01-B01-SH04 | B01 | 156–290 (134) | 162–228 (66) | L03, V01 (`est` placement) | C02 dramatization; CL01 plant |
| S01-B02-SH01 | B02 | 290–339 (49) | 228–276 (48) | L04 | C06 dramatization (vantage, not cat vision) |
| S01-B02-SH02 | B02 | 339–407 (68) | 276–342 (66) | L05 | C04 `hedge`; CL02 named |
| S01-B02-SH03 | B02 | 407–522 (115) | 342–462 (120) | L06 | C03/C04/C05 `hedge` |
| S01-B03-SH01 | B03 | 522–640 (118) | 462–570 (108) | L07 | C14 setup; gap ≈ 1.2–1.3 m |
| S01-B03-SH02 | B03 | 640–787 (147) | 570–732 (162) | L08 | C14 practice tip (count `hedge`) |
| S01-B04-SH01 | B04 | 787–847 (60) | 732–792 (60) | silence | C07 dramatization (half-close); CL03 payoff |
| S01-B04-SH02 | B04 | 847–884 (37) | 792–840 (48) | L03b | dramatization |
| S01-B04-SH03 | B04 | 884–1040 (156) | 840–1008 (168) | L09 | C07 `verified-limited` (VO) |
| S01-B04-SH04 | B04 | 1040–1112 (72) | 1008–1086 (78) | L10a | C08 `verified-limited`, unfamiliar person's hand (R04) |
| S01-B04-SH05 | B04 | 1112–1179 (67) | 1086–1158 (72) | L10b | C08 (VO); head-rub = dramatization |
| S01-B05-SH01 | B05 | 1179–1308 (129) | 1158–1266 (108) | L11, V02 in (`est`) | C14 `verified` protocol (~1 m) |
| S01-B05-SH02 | B05 | 1308–1406 (98) | 1266–1368 (102) | L12 | C12/C15 limit and welfare |
| S01-B05-SH03 | B05 | 1406–1619 (213) | 1368–1536 (168) | L13 | C10 `hedge` (attributed); [L13 rule](#l13-attribution-rule) |
| S01-B05-SH04 | B05 | 1619–1649 (30) | 1536–1566 (30) | closing | C07 dramatization |
| S01-B05-SH05 | B05 | 1649–1685 (36) | 1566–1602 (36) | closing, fade | `A_fade` |

---

## Shot sheets

Picture intent per shot is the row's `seen` text in [review-rows.json](review-rows.json) and its look frame; the blocks add numbers. Rules R01–R08 of the [storyboard](storyboard.md#rules-carried-from-the-brief-and-fact-check-every-shot) apply to every shot and are not repeated. Base casting (brief VD02/VD03): OWN **`woman-curly + home-lounge`** (kit outfit since W5.2), CAT **`cat-orange-tabby`** (kit + K1–K8). Room shots paint `paintRoom(… {light: 'night', dressing: true})` + `<RoomLight light="night">` unless stated; `fore` is given per shot. OWN night `warm: 0.08` (LF01), B05 `warm: 0.12`. OWN never calls a blink in B01 (CL02); her `look` is a gaze offset toward the cat.

### S01-B01-SH01 · 0–46 · LF01 two-shot, the stare (L01)

- **Time (measured):** L01 "จ้องตาแมวด้วยความรัก…" L4–41 (1.24 s); caption G4–47.
- **Staging (SET-LIVINGROOM, m):** OWN card at `LR.ownFeet`, view `front`; casting **`woman-curly + home-lounge, seated-lean-in (P31 base), happy`**, `seatedPose('seated-lean-in', OWN, g, u, 'front', {amount: e})` with e = the shot ease (0→1 = 15°→25°), `faceState {eyes: 'wide', brow: 'up', look: [0.7, 0.1]}`, no blink. Cat `catItem(LR.catStart, {view: 'left', state: 'sit', lid: 0.5, ears: 0}, t, 'sofa')` = **`cat-orange-tabby, sit, idle`, lid 0.5** (CL03; the lid control now exists, LF01 drew no lid). `fore: false` (as LF01).
- **Camera:** = LF01 `camLF01` (values unchanged; the move now eases over 46 f, not `LF_FRAMES.LF01` 54 f, RT04): `cam: T-PAIR (0.15, 0.95, −0.40), yaw +28→+20, r 1.75→1.60, eye 1.00, f 1050, hy 760, cx +60`. `meas` start→end: her head unit 299→349 px, eye (330, 709)→(326, 701), feet y 1463→1580; cat at x 777→800, eye y 999→1016, 258→277 px tall.
- **Look:** LF01 (approved); lamp key screen left, cool fill right.
- **Sound:** NG-M1 in at L0 (fallback `bed_eg2-solo-piano-sparse_01`); NG-A1 + `tension_clock-pulse_01` low from L0. Mix: hold.
- **Entry → exit:** her hands on her thighs, lean 15° → 25°; cat sitting on the right cushion facing her, eyes soft.
- **Accept:** spike 1 (room reads in 1 s at 270 px; head ≥ 280 px `meas` 299); the cat findable but not first read; its half-lid visible only on a full-res crop; no blink frame on her.

### S01-B01-SH02 · 46–115 · her eye ECU, wide (L02a)

- **Time (measured):** L02a "แมวหลายตัว… อาจอ่านสายตาแบบนี้ว่า…" L4–65 (voiced to 2.04 s, pause to the cut); caption L02a G50–115.
- **Staging (EYE, set-cm):** `paintEyeMacro(warm(p), cam, {t: G/30, u: 0, mist: false, catch: 'warm', lid: 1.3, lift: 0, glare: 0})`, warm = `tintPainter(p, '#ffb060', 0.14, {mul: [1.04, 0.98, 0.9]})` (as LF03). Lid held, change ≤ 0.02 through the shot.
- **Camera:** `cam: EYE (0, 0, 0), yaw −8→−5, r 0.300→0.276 (push 8 %), eye 0, f 1000, hy 880, pitch 0`.
- **Sound:** M1 continues; `bed_sub-drone-fade-in_01` starts L16 (G62), very low. Mix: hold, tension creeps.
- **Cut:** hard cut out G115, 2 f before the onset of "เป็นการท้าทาย" (G117, `meas` sub-anchor 2.24 s) (RT02).
- **Accept:** same eye as `PL-EDU-EYE`/LF03; no blink or lid motion; catchlight from screen left.

### S01-B01-SH03 · 115–156 · cat face reacts (L02b)

- **Time (measured):** L02b "เป็นการท้าทาย" L2–37 (G117–152); caption G117–158.
- **Staging (CATFACE, set-cm):** `paintCatFace(p, cam, s, {t: G/30, warm: 1})` with `s = {lid: 0.5→0.15 (L2–14), pupil: 0.35→0.9 (L8–38), whiskers: 0→1 (L12–38, RN02), ears: 0, yaw: −5, gaze: [0, 0], brow: 0}`; then hold to L41. Ears stay up (the flatten is SH04's).
- **Camera:** `cam: CATFACE, r 16→14, f 1000, hy 820, camYaw +6→+2`. Ear tips below y 140, eyes ≈ y 780 (CF measures).
- **Sound:** drone under M1 (M1 −3 dB from L0).
- **Accept:** pupil and whisker change readable at 270 px; coat matches the body rig (M brow, cheek stripes, pale chin, amber eyes); CFa style.

### S01-B01-SH04 · 156–290 · coo, ears flat, the cat leaves (L03, V01)

- **Time (OWN `measured`, V01 `est`; beat order per [RN01](#retime-notes-r11)):** OWN L03 L4–84 (2.66 s Leda take; caption "น่ารักจังเลย" G160–246). Lean peak L31 (the take's internal word gap, `est` ±3 f), held to the cut. Ears 0→1 L50–56 (on the drawn "ยยย" and coo). View swap `left`→`right` on L60 (on the start of the stand, DF-20261030-painted-profile-head-turn). `stand-up` L60–81 (21 f). `walk-out-to-right` from L75 (motion t = (L − 75)/30); clear of frame right by ≈ L127 (0.55 m at 0.37 m/s with the 0.5 s start ramp, kit numbers). V01 mrrp L86–104 (`est` 18 f, 2 f after L03) while it walks away. Empty cushion L127–134; cut G290.
- **Staging (m):** OWN as SH01 end, `seated-lean-in {amount: 1}`, `face: 'happy'`, `faceState {eyes: 'wide', look: [0.8, 0.1]}`, mouth `talk` on L03 frames. Cat `catItem(LR.catStart, pose, t, 'sofa')`: `{view: 'left', state: 'sit', lid: 0.15, ears}` → L60 `{view: 'right', …stand-up frame, ears: 1}` → `walk-out-to-right` pose with ground moving +x at `animalWalkSpeed` (no slide); the cat leaves frame fully. `fore: false`. No leap on screen (VD06).
- **Camera:** `cam: T-PAIR, yaw +14→+18, r 1.60→1.50, eye 0.95, f 1100, hy 760, cx +60` (SD01). `meas`: her head 378→401 px, eye (375, 650)→(332, 642); cat at x 810→825, eye y 988→1007, 284→308 px; a 0.55 m exit to +x leaves frame.
- **Sound:** NG-S7 sofa creak L4; NG-S1 mrrp L86 (`est`); NG-S3 paw thump on the armchair cushion L132 = G288 (2 f before the cut, under it; the leap stays off screen). M1 dips −3 dB L56–104. **No sting** on V01.
- **Entry → exit:** cat sitting facing her → gone off frame right, cushion empty; she still leaning, eyes wide.
- **Accept:** no visible head-turn at medium scale (view swap on the stand); paws do not slide; the cat fully off frame before the cut; the cat reads annoyed-and-leaving, not cowering; V01 has no subtitle; shot ≥ 3 s (4.47 s).

### S01-B02-SH01 · 290–339 · the cat-side vantage, the grade begins (L04)

- **Time (measured):** L04 "ลองนึกจากฝั่งแมวดู…" L4–45 (onset G293.6); caption G294–341. **Grade start = the first frame at/after the onset of "ลองนึก" (L4, G294); never earlier.**
- **Staging (m):** cat off frame (it sits on the armchair behind/below the lens). OWN card at `LR.ownFeet`, `view: 'front'`, `seated-lean-in {amount: 1→0.5}` over the shot, `face: 'neutral'`, `faceState {eyes: 'wide', look: [0, 0]}` (staring into the lens = at the cat). `fore: false` (the armchair is at the lens).
- **Camera:** pos (1.00, 0.72, 0.70) → (0.92, 0.74, 0.58) looking at `T-OWN-CARD`, `pitch +10°, f 1050, hy 700` (SD02). `meas`: her eye (589, 589)→(590, 573), head 380→426 px, feet y 1538→1638.
- **Look:** `g = 0.4 · glareGrade(L, {start: 4, rise: 40})` through `glarePainter(p, g)` on the whole plate + `<GlareVeil g={g}>`. Cool key, darker; brow shadow on the rig face not available (BOSS-4; fallback = tint + veil only).
- **Sound:** M1 out by L4 (fade L0–4); `reveal_reverse-swell-airy_01` G286–310 (swell peaks into "ลองนึก"); drone continues; `tone_thin-unresolved_01` in at L4.
- **Accept:** spike 4 part: grade start frame ≥ "ลองนึก" onset; reads as a low vantage on her, not a filter or "cat vision" (no slit pupil, red, blur); no text.

### S01-B02-SH02 · 339–407 · LF04 glare ECU (L05)

- **Time (measured):** L05 "ตาโต… ไม่กะพริบ… จ้องไม่วาง" L4–63 (1.96 s); caption G343–408.
- **Staging (EYE):** `paintEyeMacro(glarePainter(warm(p), g), cam, {t, u: 0, mist: false, catch: g < 0.5 ? 'warm' : 'sharp', lid: 1.3, lift: 0, glare: g})` + `<GlareVeil g>`, `g = 0.4 + 0.6 · glareGrade(L, {start: 0, rise: 24})` (1.0 from L24, held).
- **Camera:** `cam: EYE, yaw −4→−2, r 0.300→0.270, eye 0, f 1000, hy 880, pitch 0` (= LF04).
- **Sound:** drone + thin tone hold; no hit.
- **Accept:** spike 4: stern, still her human eye (LF04 approved); hard brow shadow, one sharp catchlight; skin stays brown.

### S01-B02-SH03 · 407–522 · her face in the glare, drain to warm (L06)

- **Time (measured):** L06 L4–110 (3.55 s); "มากกว่าความรัก" onset **L88 `meas`** (G495, after the 2.69–2.82 s pause). **Drain L88–115 (27 f, inside the phrase, ends on the cut; RN03).** Captions L06a G411–495, L06b G495–523.
- **Staging (m):** OWN card at `LR.ownFeet`, `view: 'front'` + `fig: {quarter: 'right', quarterDeg: 25}` (face turned a little to screen right, toward the cat behind the lens; BOSS-5), P31, `face: 'neutral'`, `faceState {eyes: 'wide', look: [0.25, 0]}`. `fore: false`.
- **Camera:** `cam: T-OWN-CARD (−0.15, 1.07, 0.05), yaw +40→+36, r 0.72→0.68, eye 1.10, f 1100, hy 700` (SD03). `meas`: eye (540, 746)→(540, 749), head top 440→425, chin 1051→1072, head 649→687 px.
- **Look:** `g = glareGrade(L, {start: −24, drainAt: 88, drain: 27})` (1 at L0, 0 at L115 = the last frame) via `glarePainter` + `GlareVeil`; warm lamp look on the last frame, carried by S01-B03-SH01.
- **Sound:** thin tone fades L88–115 with the drain; drone out by L115 (G522); NG-A1 room tone returns to full.
- **Entry → exit:** glare full, stare held → warm, stare still held (she has not yet changed).
- **Accept:** drain begins inside "มากกว่าความรัก" (L88 ±3 f); g = 0 on the last frame; same person as SH01; smooth in-canvas blend, no pop.

### S01-B03-SH01 · 522–640 · the gap, she sits back (L07)

- **Time (measured):** L07 L4–114 (3.66 s); captions L07a G526–584, L07b G584–641. Expression `neutral` → `happy` switch at **L61** (end of "…ที่นุ่มกว่านั้น…", `meas` pause 1.90–1.96 s). Cat ears 1→0 L67–109.
- **Staging (m):** OWN card at `LR.ownFeet`, `view: 'front'`, **P31** (sitting back, lean 0), `faceState {eyes: 'dot', look: [0.8, 0]}` (toward the armchair). Cat `catItem(LR.armchairSeat, {view: 'right', state: 'sit', lid: 0.15, ears: 1→0}, t, 'armchair')` (half-turned away). `fore: true`.
- **Camera:** `cam: T-GAP (0.45, 0.90, 0.05), yaw −20→−12, r 2.00→1.85, eye 0.95, f 1000, hy 760`. `meas`: her eye (226, 693)→(200, 690), head 237→246 px, standing-eq 903→939; cat eye (923, 935)→(963, 962), 219→253 px; window in frame top centre (x 616–919).
- **Look:** warm, a step calmer than B01.
- **Sound:** NG-A1 + tick; piano returns very low from L20 (M1 tail, sparse).
- **Accept:** gap readable at 270 px (eye-to-eye ≈ 1.2–1.3 m); both eyes above y 1160; cat's right edge inside frame (≈ 1043 px).

### S01-B03-SH02 · 640–787 · LF03 counted blink (L08)

- **Time (measured unless marked):** L08 L4–141 (4.59 s). "หรี่ตาเหมือนยิ้ม…" L4–38; "ค่อย ๆ หลับ…" L44–63 (`meas`, after the 1.13–1.35 s pause); "หนึ่ง…" onset **L77** (`meas`, after the 1.96–2.44 s pause); "สอง…" onset **L93** (`est` ±3 f: the "ส" fricative after the "หนึ่ง" tail, no clean pause in this read; vowel L97); "แล้วค่อย ๆ ลืม" L116–141 (`meas` onset after the 3.51–3.73 s pause), "ลืม" onset **L133** (`est`, syllable-proportional inside that segment). Captions L08a G644–709, L08b G717–787. The count reads brisk: "หนึ่ง" to "สอง" 16 f.
- **Staging (EYE):** `paintEyeMacro(warm(p), cam, {t, u: 0, mist: false, catch: 'warm', lid, lift})`: lid 1.0/lift 0 → **lid 0.75/lift 1** over L6–20 (on "หรี่ตาเหมือนยิ้ม") → **lid 0/lift 0.2** over L46–60 (on "ค่อย ๆ หลับ") → held to L129 → lid 1.0/lift 0 over L129–145 (lands on "ลืม", L133) (SD10).
- **Camera:** `cam: EYE, yaw −6→−3, r 0.300→0.270 (push 10 %), eye 0, f 1000, hy 880, pitch 0`.
- **Sound:** NG-M3 note 1 onset L77 (G717, on "หนึ่ง"), note 2 L93 (G733, on "สอง"; 16 f apart, so the ~1.5 s notes overlap: Editor trims note 1 or lets it ring under note 2); NG-A1 room tone; piano otherwise silent.
- **Accept:** spike 2: each lid state lands within ±3 f of its word; smile reads as a smile (LF03 v2); no numbers on screen.

### S01-B04-SH01 · 787–847 · LF02 the cat answers (silence)

- **Time (fixed 60 f, silence; G787–847):** head yaw −45→0 L0–10; hold L10–30; half-close L30–45 (**half-close frame L45 = G832**); bloom and motes L45–60.
- **Staging (CATFACE):** start = CF2 `{lid: 0.15, pupil: 0.5, ears: 0.5, whiskers: 0.4, yaw: −45, brow: 0, gaze: [−0.3, 0]}`; L0–10 yaw → 0 and gaze → [0, 0]; L30–45 lid → 0.58, pupil → 0.35, ears → 0.05, whiskers → 0, brow → 1 (= CF3). Light `{t, warm: 1, halo: 0.7·ramp(L45–60), motes: 0}`; motes from `<GlowPass x={540} y={780} u={(L−45)/30} dir={GLOW_DIR_LEFT} seed={5} count={7}>` (u 0→0.5 by the cut).
- **Camera:** `cam: CATFACE, r 14→13, f 1000, hy 820` (= LF02).
- **Sound:** music out from L0 (M1 tail gone); NG-A1 + tick only; `reveal_glass-shimmer-soft_01` onset exactly L45.
- **Accept:** spike 3: end frame reads "relaxed / content / soft" (viewer check), lid ≤ 0.6, ears forward-relaxed; bloom ≤ 0.3; no hearts or sparkles; end frame matches LF02 (BOSS-7).

### S01-B04-SH02 · 847–884 · her soft face, the glow arrives (L03b)

- **Time (measured):** OWN L03b whisper "ตอบกลับมาด้วย…" L4–33 (0.95 s Leda take), 4 f hold after; caption G851–886.
- **Staging (m):** OWN as S01-B02-SH03 (same vantage), P31, `face: 'happy'`, `faceState {eyes: 'half', mouth: 'talk', open: 0.2 on L03b frames, else 'smile', look: [0.25, 0]}`, `fig: {quarter: 'right', quarterDeg: 25}`; warm 0.10. Motes: `<GlowPass x={1180} y={760} u={L/30} dir={GLOW_DIR_LEFT} seed={5} lead={0.5} travel={640}>` enter from frame right and fade at her eyes (540, 776) by L30. `fore: false`.
- **Camera:** `cam: T-OWN-CARD, yaw +40→+38, r 0.75→0.70, eye 1.12, f 1100, hy 700` (SD03). `meas`: eye (540, 773)→(540, 779), head 623→668 px, chin ≤ 1093.
- **Sound:** NG-A1; `bed_warm-pad-felt-third_01` in at L30 under the whisper tail, then NG-M2 from G877.
- **Accept:** mote screen direction continuous across the cut (left in SH01, entering from right here, same seed/dir); warmest face light so far; rhymes with S01-B02-SH03.

### S01-B04-SH03 · 884–1040 · the walk-over (L09)

- **Time (measured):** L09a "งานวิจัยเล็ก ๆ ในอังกฤษพบว่า…" L4–65, L09b L73–152 (`meas` pause 2.03–2.29 s); captions G888–955, G957–1042. Cat (fixed actions, unchanged): `stand-up` L0–21 → `step-up` L30–51 (hop L30–40, paws land L40) → walk along the arm L51–80 → step down L84–105 (lands L94) → `sit-down` L110–134 → hold L134–156 (22 f, R1 34 f).
- **Staging (m), path in world:** rim (0.90, 0.30, 0.22) → landing `LR.armLanding` (0.72, 0.48, −0.05) → `LR.armEnd` (0.72, 0.48, −0.40) → cushion (0.40, 0.30, −0.40). Pose `view: 'left'` throughout (SD04). Step-up: `animalMotion('step-up', t, {animal, view: 'left', rise: LR.hop.rise, across: LR.hop.across})` for pose/stride/contact; world ground point eased rim → landing with `ease(tt / STEP_UP_HOP)`; height = motion `offset[1]`. Walk: `walk-in-from-right` pose (gait clock from metres travelled, distance 0.35). Step down: `step-up` with `rise: −LR.hop.rise` (**untested, BOSS-1**). Layers: `catItem(…, 'armchair')` until L40, `'arm'` L40–94, `'sofa'` after. `contact: 1` on every surface. OWN P31, `face: 'happy'`, `look` follows the cat [0.8, 0] → [0.4, 0.1]. `fore: true`.
- **Camera:** `cam: (0.35, 0.60, −0.30), yaw −25→−18, r 1.9, eye 0.85, f 1000, hy 760, cx −40` (SD04). `meas` (yaw −25 / −18): her eye x 277/240, head 310/301 px; cat x rim 932, landing 741, arm end 637, cushion 502; cat 180–186 px tall on the arm.
- **Sound:** NG-M2 warmer, a touch brighter (mix: lift); NG-S4 paw steps L40–80; NG-S3 soft press at L94; NG-A1 under.
- **Entry → exit:** cat sitting at the rim, she sitting back → cat sitting on the right cushion facing her, she smiling.
- **Accept:** spike 6 (24 f strip): paws plant without sliding, the hop reads ≈ 0.18 m, no float; every leg moves screen-left; L09 plays over the walk; no graphic.

### S01-B04-SH04 · 1040–1112 · day cutaway, a stranger's hand (L10a)

- **Time (measured):** 6 f in-canvas dissolve from S01-B04-SH03 L0–6 (G1040–1046). L10a "และยอมขยับเข้าหามือคนแปลกหน้า…" L4–69 (voiced to 2.17 s); caption G1044–1111. Cat lean 0→0.5 L8–30; one step L34–48; lean 0.5→0.7 L48–58; 3 sniffs L52–70 (RN04).
- **Staging (m, day state):** `paintRoom(…, {light: 'day', fore: true, dressing: true})` + `<RoomLight light="day">`. Visitor hand: `paintVisitorHand(p, {base: 30000, wrist: camPoint(cam, LR.visitorHand), dir: π + 0.3, side: −1, size: 0.9·(camUnit/700), skin: 'light', watch: true})` entering from frame left, **held still** (pure function, 0 px drift). Cat `catItem([0.38→0.30, 0, 1.32], {view: 'left', state: 'stand', lean, leanTo: [0.24, 0.15 ± 0.01 per sniff], leanAnchor: 'nose', contact: 1}, t, 'floor')`; nose stops ≈ 0.04 m short of the fingertips (no touch, **no rub**).
- **Camera:** `cam: (0.15, 0.15, 1.30), yaw +15→+10, r 0.90→0.80, eye 0.22, f 1050, hy 900`. `meas`: palm (378, 978)→(352, 989); cat eye (817, 836)→(856, 829), 422→468 px; window top right (daylight).
- **Sound:** `room_soi-morning-quiet_01` crossfaded in over the dissolve, NG-A1 down; NG-S5 sniffs L52; M2 continues low.
- **Accept:** spike 5: within 1 s the hand reads as another person (denim cuff, watch, lighter skin, daylight); lean + step + sniff only; no face, no text, no second card.

### S01-B04-SH05 · 1112–1179 · head-rub into her palm (L10b)

- **Time (measured):** hard cut in at the end of L10's pause (RN04). L10b "มากกว่าตอนคนหันหน้าหนี นิดนึง" L0–63 (onset G1111.3, 0.7 f before the cut); caption G1112–1181. Head-rub motion clock `t = (L + 11)/30` (RN05): lean-in to L4, rub 1 L7–28, rub 2 L28–49, release L49–67.
- **Staging (m):** OWN `seatedPose('seated-offer-palm', OWN, g, u, 'front', {toward: 1})` (left arm, SD06), `face: 'happy'`, `faceState {eyes: 'half', look: [0.6, 0.3]}`; palm still. Cat stands on the cushion front half at (0.34 ±0.05, 0.30, −0.10), `view: 'left'`, `animalMotion('head-rub', t, {animal, view: 'left', target: [fwd, up]})` (lid 0.5 built in). **Contact rule:** at L0 solve the cat's ground x and `target` so the head-rub `top` anchor meets her `lHand` anchor (picture px); hold that solution for the shot. `fore: false`.
- **Camera:** `cam: (0.15, 0.62, −0.05), yaw +20→+26, r 1.05→1.00, eye 0.80, f 1100, hy 760` (SD05). `meas`: her eye (212, 479)→(209, 475), head 442→449 px; palm on her card ≈ (469, 1113)→(456, 1129) `est` (until `lHand` is read); cat eye y 946→962, 438→475 px.
- **Sound:** night NG-A1 back on the cut (day tone out); NG-S6 rubs at L7 and L28; M2 continues.
- **Accept:** spike 7: `top` meets `lHand` within ±6 px through both rubs; palm moves 0 px; labelled dramatization (not the study's measure).

### S01-B05-SH01 · 1179–1308 · she slow-blinks across the gap (L11)

- **Time (measured):** L11 L4–125 (4.02 s): L11a "ลองคืนนี้ดู… นั่งห่างสักเมตรนึง…" L4–87, L11b "แล้วกะพริบช้า ๆ" L90–125 (`meas` pause 2.76–2.86 s); "กะพริบ" onset **L97** (`meas`, stop after the 3.04–3.09 s dip). Captions G1183–1269, G1269–1310. Blink (on "กะพริบช้า ๆ", 32 f kept): `eyes 'half'` L97–102, `'shut'` L103–118, `'half'` L119–123, `'dot'` + `squint: 0.5` L124–129.
- **Staging (m):** OWN P31 sitting back, `face: 'happy'`, `look: [0.8, 0]`, left hand open on her thigh (P31 hands), `warm: 0.12`. Cat `catItem(LR.armchairSeat, {view: 'left', state: 'sit', lid: 0.5, ears: 0}, t, 'armchair')` **facing her** (BC3; time skip after the head-rub). `fore: true`. Window glow dimmer / lamp warmer than B03 (BOSS-6; fallback tint only).
- **Camera:** `cam: T-GAP, yaw −12→−18, r 1.85→1.95, eye 0.95, f 1000, hy 760` (B03-SH01's arc reversed). `meas`: her eye (200, 690)→(217, 692), head 246→241 px; cat eye (963, 962)→(936, 942).
- **Sound:** NG-S2 purr (V02, `est` placement) fades in from L15 over 45 f, very low (cat ~1 m away); M2 warm.
- **Accept:** gap readable at 270 px; the blink readable at this size (head ≈ 241 px; if not, report, do not resize); differs from S01-B03-SH01 by the cat facing her and warmer light.

### S01-B05-SH02 · 1308–1406 · the tail over her knee (L12)

- **Time (measured):** L12 L4–94 (2.99 s): "ไม่ใช่ทุกตัวจะตอบ…" L4–34, "และให้มันเดินมาหาเอง" L50–94 (`meas`, the Revision E slowed phrase 1.44 s); caption G1312–1407. Tail curl L39–75 (36 f), tip lands **L75** on "มาหาเอง" (`est`, syllable-proportional inside the measured phrase; R1 L76).
- **Staging (m):** OWN P31, left hand open and still on her thigh (no motion). Cat curled at (0.20, 0.30, −0.10) (SD07), `{view: 'left', state: 'lie', curl: 1, lid: 0.55, tailTo}`: `tailTo` eases from the curl's rest tail to the point whose picture px is her left knee (≈ [0.26, 0.10] m `est`); tip on the knee ±8 px from L76 (BOSS-2, BOSS-3). `fore: false`.
- **Camera:** `cam: (0.10, 0.42, −0.02), yaw +30→+34, r 0.70→0.65, eye 0.65, pitch −20°, f 1100, hy 760` (SD09). `meas`: knee ≈ (356, 730)→(345, 751), hand ≈ (473, 697)→(465, 719), cat nose (502, 706)→(510, 725), rump x 1034→1077; her face out of frame (top).
- **Sound:** purr steady; NG-S8 settle at L75.
- **Accept:** tail tip on the knee anchor; hand motion 0 px; not a grab (she does not touch the cat).

### S01-B05-SH03 · 1406–1619 · two-shot, warmest (L13)

- **Time (measured, L13 = script R1.3 "แต่ถ้ามันกะพริบกลับมา… นั่นคือสัญญาณที่ดี ที่คนเลี้ยงแมวหลายคนเชื่อว่ามันกำลังบอก… รัก"):** runs `meas` (Revision E): "แต่ถ้ามันกะพริบกลับมา…" L4–52; "นั่นคือสัญญาณที่ดี" L56–106; pause 0.31 s ([RN08](#retime-notes-r11)); "ที่คนเลี้ยงแมวหลายคนเชื่อว่ามันกำลังบอก" **L116–189 (G1522–1595)**; breath 0.35 s; "รัก" **L200–213 (G1606–1619)**, held and rising, ends on the cut. Captions L13a "แต่ถ้ามันกะพริบกลับมา…" G1410–1462; L13b "นั่นคือสัญญาณที่ดี ที่คนเลี้ยงแมวหลายคนเชื่อว่ามันกำลังบอก… รัก" G1462–1619 (ends on the cut, never over the closing picture).
- **Staging (m):** OWN P31, `face: 'happy'`, `faceState {eyes: 'half', look: [0.6, 0.2] → [0.75, 0.3] over L60–100}` (picture-only micro beat: her gaze settles down onto the cat; RN07), `warm: 0.12`. Cat curled as SH02 end (tail on her knee, ambient breath and ear twitch on G; lid 0.5). `fore: false`. 7.10 s hold: see RN07 / Q-RT2.
- **Camera:** `cam: T-PAIR, yaw +12→+8, r 1.75→1.62, eye 1.00, f 1050, hy 660, cx +60` (SD08). `meas`: her eye (304, 606)→(289, 600), head 325→367 px; cat top y 1038→1075, nose 1085→1130 (above 1160).
- **Sound:** [L13 rule](#l13-attribution-rule): M2 low and sparse; no swell, no one-shot L116–193 (G1522–1599); resolve onset ≥ L200 (G1606, on "รัก"; fallback `stinger_outro-resolve_01`), sustaining across the cut into SH04; purr under, ducked with the music.
- **Accept:** attribution clause intelligible (ear + measured margin); no hearts or text; warmest frame; the 7.1 s hold reads alive (breath, gaze settle), not frozen.

### S01-B05-SH04 · 1619–1649 · the cat slow-blinks back (closing)

- **Time (fixed 30 f, G1619–1649):** lid 0.2→0.6 over L2–20, held.
- **Staging (CATFACE):** `{lid, pupil: 0.35, ears: 0.1, whiskers: 0, yaw: 0, roll: 10, gaze: [0, 0], brow: 1}`, light `{t, warm: 1, halo: 0, motes: 0}` (curled, resting low).
- **Camera:** `cam: CATFACE, r 15→14, f 1000, hy 820`.
- **Sound:** resolve chord sustains; purr; optional quieter `reveal_glass-shimmer-soft_01` at L20 = G1639 (Editor's call, ≤ −6 dB vs G832).
- **Accept:** lid ≤ 0.6 (half-close, never shut); same face as S01-B04-SH01.

### S01-B05-SH05 · 1649–1685 · her smile, fade (closing, `A_fade`)

- **Time (fixed 36 f):** fade L12–36 = G1661–1685 (24 f = `endFadeSec 0.8`); G1684 full black.
- **Staging (m):** OWN as S01-B04-SH02 vantage, `face: 'happy'`, `faceState {eyes: 'half', look: [0.25, 0]}`, `fig: {quarter: 'right', quarterDeg: 25}`, live breath (ambient clock keeps running; no freeze), `warm: 0.12`. `fore: false`.
- **Camera:** `cam: T-OWN-CARD, yaw +36→+34, r 0.75→0.72, eye 1.12, f 1100, hy 700` (SD03). `meas`: eye (540, 773)→(540, 776), head 623→649 px.
- **Sound:** chord, purr and NG-A1 fade with the picture L12–36 to digital silence on G1684; no drone, no seam.
- **Accept:** spike 8: smile reads at 270 px; last frame full black; `endHoldSec 0`, live motion until the fade.

## Boss and Editor handoff (W5.2 / W5.3)

**Boss (flag, do not work around):**
- **BOSS-1 Step-down (S01-B04-SH03):** no `step-down` motion; the sheet uses `step-up` with `rise: −0.18` (untested: arc, stride and landing contact may misbehave). Prove it on a 24 f strip or add a `step-down` ID. Fallback (Film): end the walk at `LR.armEnd`; the step down happens across the dissolve into S01-B04-SH04.
- **BOSS-2 tailTo reach (S01-B05-SH02):** curled `tailTo` ≈ [0.26, 0.10] m from the ground point (QA proved [0.2, 0.24]). Confirm the tip reaches and lands within ±8 px of a picture point. Fallback (brief VD14): the cat's head resting on her thigh.
- **BOSS-3 Knee anchor:** `FigAnchors` has no knee; add a seated `lKnee` (small) or Editor measures her knee px on the first frame and holds it.
- **BOSS-4 Glare on the rig face (S01-B02-SH01, S01-B02-SH03):** only `glarePainter` + `GlareVeil`; no hard brow shadow for the face close. Film call: tint + veil is acceptable for the draft (the ECU carries the shadow); a face brow-shadow helper only if the Draft review asks.
- **BOSS-5 Face-close three-quarter:** `paintOwn` derives `view` from the camera and takes `quarter` only through `fig`; verify `fig: {quarter: 'right', quarterDeg: 25}` reads at a 650 px head (the kit notes three-quarter as an optional extra).
- **BOSS-6 B05 warmth step (optional):** `RoomLight` has no warmth level; a `warm` prop or a documented tint recipe for "a step warmer, window dimmer". Fallback: `OwnOpts.warm 0.12` only.
- **BOSS-7 LF02 match:** LF02 painted motes inside `paintCatFace` (`motes: 0.9`); the sheet uses `GlowPass` for cut-matched motes with `motes: 0`. Confirm the S01-B04-SH01 end frame matches the approved LF02.
- Plates: finished-grade plates may now be built from this revision (SHEETS-R1.1, voice-timed). Retime consequences for Boss: RN01 (S01-B01-SH04 full exit: walk-out must clear frame right in ≈ 52 f from L75; prove on the strip), RN05 (head-rub clock offset).

**Editor:**
- **ED-1 Retime after voice lock:** done (W4 closed by the user 2026-11-07; R1.1 written by [RT01–RT06](#retime-after-voice-lock)). Remaining: file `out/ep06-voice/slow/shots-own.json` to the store (the store `shots.json` is Revision E without OWN, 1639 f); place V01/V02 and report their real lengths (they are `est` here; a V01 longer than 18 f eats the 7 f empty-cushion tail of S01-B01-SH04, a shorter one changes nothing).
- **ED-2 Caption legibility:** real caption frames per the [caption plan](#caption-plan); report numbers and a viewed sheet; no darkening without the user.
- **ED-3 L13 audibility:** ear check + measured margin per the [L13 rule](#l13-attribution-rule).
- **ED-4 Sound generation:** NG-M1–M3, NG-A1, NG-S1–S8 via the sound-generation skill (library has none of them); ear-check every "not listened" library pick.
- **ED-5 Integration:** composition outside `src/Root.tsx`; one scene per shot; event clocks on L, seek-safe; `endHoldSec 0`, `endFadeSec 0.8`.

## Dependencies and open items

| Owner | Dependency / acceptance | Status |
| --- | --- | --- |
| Editor | W4 voice lock + measure file | done (user closed W4 2026-11-07; NAR Revision E + OWN Leda) |
| Film | SHEETS-R1.1 retime (RT01–RT06) | done 2026-11-07 (this revision) |
| User | Q-RT1 L13 pause before "ที่คนเลี้ยง…" (RN08); Q-RT2 S01-B05-SH03 7.1 s hold (RN07); R1.3 L13 wording OK | open (Film report) |
| Boss | BOSS-1, BOSS-2, BOSS-5, BOSS-7 proofs; BOSS-3, BOSS-4, BOSS-6 optional | open |
| Editor | ED-2 caption check, ED-3 L13 check, ED-4 NEEDS-GEN sounds | open (W5.3) |
| User | B04-SH03 camera on the VD11 fallback (SD04); B01-SH04 full exit (SD01, RN01) | answered 2026-11-07; RN01 applies the answer |

- **Element captures (existing, Boss W5.2, 2026-11-07, uncommitted code):** `out/edu06/boss/qa/room-night.png`, `room-day.png` (`EDU6-QA-ROOM-*`), `seated.png` (`seated-lean-in`, `seated-offer-palm`, front), `cats.png` + `cats2.png` (lid, ears, lean, curl, tailTo, contact; profile), `rub0…75.png` (head-rub, profile), `glow.png`, `eye0.png`/`eye2.png`, `gl0–2.png` (glare 0/0.5/1); look frames `out/edu06/look-frames/v3/LF01–LF04.png`, `out/edu06/boss/n2/CFa.png`. Limits: isolated elements, not the shot cameras; no motion proof of step-down, tailTo at the knee, or the face-close glare.
- **Editor scene sample proposal:** S01-B04-SH01 → S01-B04-SH02 (the silent answer, chime and the cut-matched glow) and S01-B04-SH03 (step-up strip).

## Change log

- **2026-11-07 EDU-EP06-SHEETS-R1 (Film W5.1):** first timed scene sheets from script R1.2, brief R1.2, rows R1.2, LF01–LF04 + CFa and Boss W5.2 modules. **Timing estimated** (no voice lock; brief shot-plan lengths, 1602 f) with the retime rule RT01–RT06. Projection run on every room shot (scratch mirror of `kit/ycam.ts`, LF01-calibrated). Staging deviations SD01–SD12 (camera radii/targets for the W3 card-at-feet convention, B04-SH03 on the VD11 fallback camera, head-rub in profile, left hand/knee, curled-cat position, kit smile lid, step-up 0.18/0.32). Boss flags BOSS-1–7, Editor items ED-1–5. `review-rows.json` → EDU-EP06-ROWS-R1.3 (est `start`/`end` added, Thai shot text unchanged).

- **User answers (2026-11-07):** SD fallback camera for B04-SH03 accepted; B01-SH04 full exit returns if the voice read gives it >= 3 s; draft glare on her face closes without hard brow shadow accepted. No sheet change.

- **2026-11-07 EDU-EP06-SHEETS-R1.1 (Film W5.1 retime):** retimed from the W4 lock (NAR Revision E `lines.json`, OWN Leda takes, voice-measure.md "OWN takes" table = `out/ep06-voice/slow/shots-own.json`): 19 shots, IDs and order unchanged, **1685 f = 56.17 s `measured`** (R1 1602 f est). Shot ranges, line onsets, captions, sound G-frames and word-anchored cues moved per RT01–RT06; word anchors measured from pauses in the locked read (Film RMS run) or labelled `est`; V01/V02 stay `est`. L13 text → script R1.3 everywhere (rule, captions, SH03 block; split moved so "รัก" never stands alone, no caption over the closing picture). Retime notes RN01–RN08: S01-B01-SH04 full exit with the mrrp over the walk-away (user answer applied), B01-SH03 whiskers 26 f, B02-SH03 drain 27 f, B04-SH04/SH05 beat shifts and head-rub clock, B05-SH01 longer wide, B05-SH03 7.1 s hold (Q-RT2), L13 extra pause vs the R1.3 delivery condition (Q-RT1). Camera values, staging positions, casting and sound IDs unchanged. `review-rows.json` → EDU-EP06-ROWS-R1.4.
