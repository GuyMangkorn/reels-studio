# Timed scene sheets and index — EDU-EP05-SHORT (EDU-EP05-SHEETS-R1.2)

- **Deliverable:** `EDU-EP05-SHORT` · **Revision:** EDU-EP05-SHEETS-R1.2 (Film, 2026-11-07; N10 pose rulings FR04–FR08, see [Change log](#change-log); R1.1 Film 2026-11-06 FR01–FR03; R1 Film W5.1) · **Status:** `ready-for-dev` · **Timing:** audio-measured: every voice frame comes from the locked full read ([voice-measure.md](voice-measure.md) / [voice-measure.json](voice-measure.json), x1.10) and the TINY picks (in-file onsets measured by Film, `silencedetect -35 dB d 0.12`, 2026-11-06); phrase frames inside lines come from the full read's silence edges (`-30 dB d 0.06`, ±0.1 s). Boundaries marked **UB** depend on the uncertain L14/L15 split (±0.3 s, see [Uncertain boundaries](#uncertain-boundaries)). **Evidence:** runtime none (composition not registered); render/samples none; audio/subtitle sync not assembled; user approval of this revision none. Review page: pending (coordinator rebuilds from [review-rows.json](review-rows.json)).
- **Inputs (by revision):** script EDU-EP05-SCRIPT-R1.3a ([script.md](script.md), user-approved, ending `A_fade`); fact-check ([fact-check.md](fact-check.md), R1.1 PASS, R1.2/R1.3 L12/L15 pass); brief EDU-BRIEF-R1.1 ([brief.md](brief.md), VD01–VD20, set plans, sound direction, N1–N10); storyboard SS-R1 ([storyboard.md](storyboard.md), user-reviewed 2026-11-06: all shots ok, S01-B01-SH01 mug-hand change accepted); look frames ([look-frames.md](look-frames.md): LF01 v3, LF02 v1, LF03 v5, LF04 v5, ANT1–3 v5, all passed by the user 2026-11-06; code `src/painted/edu05/`, uncommitted); voice lock W4 (user-passed 2026-11-06: NAR Kore brisk x1.10, TINY Leda picks; length over 60 s accepted, no trim, no new TTS).
- **Content changes vs the passed storyboard:** none to script text, shot IDs, order, line assignment or approved looks. Staging values the projection check or the approved looks forced are listed in [Staging deviations](#staging-deviations-film-decisions). Review rows gain `start`/`end` frames only.
- **Target:** worktree `agent-voice-gen-limits-364db3`, branch `claude/education-tasks-remaining-7a5624` at `713812b` + uncommitted `src/painted/edu05/` · 30 fps · `durationFrames` **1963** · 1080×1920 portrait · composition offset 0 (composition not registered; Editor).
- **Baseline (link, not copied):** sets, origins, axes and units per [brief set plans](brief.md#set-plans-est-until-the-look-frames) (SET-BALCONY and SET-FACADE in metres; SET-MACRO-PLANTER, SET-DRIFT, SET-GARDEN-GRASS in set metres `sm`, k 320) and the [projection contract](brief.md#projection-contract-and-scale-baseline) (TINY 1.58 sm, head ≈ 0.40; D1 as built in LF03 v5: sphere R 0.55 cut 0.36 below its centre, height 0.91, contact `D1_CONTACT` (2.2, 1.12, −1.0), centre (2.2, 1.48, −1.0), top (2.2, 2.03, −1.0)). Camera line `cam: target, yaw a→b, r, eye, f, hy [, pitch] [, cx]` = kit `orbitYCam` (camera at target + r·(sin yaw, ·, cos yaw), eye = absolute camera height, positive yaw puts the camera on the +x side, positive pitch looks up); `pos:` = explicit camera position with kit `yaw` (0 looks −z). Picture x = 540 + cx + f·right/depth, y = hy − f·up/depth (`ycam.ts`). Camera moves ease in-out over the whole shot unless a block says otherwise. Screen-space layers: px, origin top-left, y down.
- **Clocks:** `G` = composition frame; shot-local `L` = G − shot start; ranges half-open `[start, end)`. Ambient clocks (breath, blade sway, antenna twitch, mote drift) run on G; event clocks (pop, lift-off, deform states, puffs, nibble, drag, bars, lift, glance) run on L and are seeded, so a seek renders the same frame.
- **Frame rule:** frame = round(s × 30). Narrator-led shots start 4 f before their line's onset (picture leads voice). Exceptions, each with its reason in the block: S01-B01-SH04 (cut on the pop peak), S01-B02-SH02 (cut on V02's onset), S01-B02-SH03 (starts on L05's last frame), S01-B02-SH04 (cut in L06's comma pause), S01-B05-SH01 (cut after V06 opens the silence).
- **Projection check:** every world-space camera below was run through a Film script mirroring `src/painted/kit/ycam.ts` (`camSpace`, `camToPicture`, `orbitYCam`) at the baseline above (scratch, not committed). Figure height = `camUnit(ground point) × 1.58` (flat card squared to the mid-shot camera); seated figures also give the standing-equivalent. Values marked `meas` come from that run; others are `est`. The look-frame measures (LF01 874 px, LF03 589 px, LF04 884 px) agree with the run within 15 px.
- **One shot = one timeline scene** (render by scene; scene ID = shot ID). All joins are hard cuts; the pop (S01-B01-SH03 → SH04) is a matched cut on a puff; the end fades to black.

## Totals

- **19 shots, 1963 frames = 65.43 s** at 30 fps. The user accepted "slightly over 60 s, about 61–65 s, no script trim" (2026-11-06): **at the top of that range** (+0.43 s). Limit 60 s for a Short: over by 5.43 s, accepted.
- Build-up (s): NAR speech 47.21 (16 lines, internal pauses kept as read) + L08 2.63 + V sounds 7.56 voiced, of which 0.92 overlap NAR (V02 tail under L05 0.65, V03 giggle tail under L07 0.15, V05 tail under L13 0.15, V04 first grunt under L10 0.20) + the 0.80 s silence + 2.00 s end hold + 6.15 s of gaps (0.25–0.35 s between lines, longer only where an action needs it: pop + squeak, crane, stand-and-grip before L16).
- Gap decisions (Film): NAR → NAR 0.30 s (B01) and 0.25–0.30 s (B02 onward), the minimum that kept every line distinct in the read; V04 is the **tight** edit (`…V04-t2-tight.wav`, 2.75 s, see SD15); no gap is longer than 0.75 s except the pop/squeak (S01-B01-SH03/SH04) and the V07 → L16 stand-and-grip (0.55 s after the gasp).
- Shortest shots: S01-B01-SH04 (32 f) and S01-B02-SH03 (32 f); none under 24 f.
- Ending: `video.ending: 'A_fade'`, `endHoldSec: 0` (live hold, no freeze), `endFadeSec: 0.8` (brief VD17). Last voiced frame G1903 (V08); hold G1903–1963 (60 f); fade over G1939–1963 (24 f) to full black on G1962.
- If a later tightening is wanted (user only; not planned): V04 is already tight; the next candidates are the 0.55 s stand-and-grip before L16 (−0.25 s), the end hold 2.0 → 1.6 s (−0.40 s) and the NAR gaps 0.30 → 0.25 s in B01 (−0.10 s). None is applied.

## Voice-lock defect VL-DEF-01 (Editor; blocks audio placement only) [RESOLVED 2026-11-06 by coordinator: all 16 NAR line files re-split from the full read at fileStart/fileDur, volumedetect max -1.5 to -1.7 dB each, store manifest hashes updated; Editor can place audio.]

Film measured the split files on 2026-11-06 (`ffmpeg volumedetect`): `projects/EDU/narration/ep05/lines/2026-11-06_ep05-nar-L03…L17-kore-x110.wav` are **digital silence** (max −91.0 dB) in the store and in `out/edu05/voice/final/`; `…-L02-…` holds speech only to 1.19 s of its 3.03 s (the source ran out at ~2.86 s of the read); `…-L01-…` is fine. The full read `2026-11-06_ep05-nar-kore-brisk-fullread-x110.wav` is fine (55.50 s, −16.0 dB mean, −1.5 dB peak) and is the source of every frame in this sheet. **Request:** Editor re-splits L02–L17 from the full read at `fileStart`/`fileDur` in voice-measure.json (0 Gemini requests), checks each split by ear and `volumedetect`, and re-files them before any audio placement. The TINY files (`tiny/`) were measured and are fine. This sheet does not change with the re-split.

## Uncertain boundaries

- **UB-1 (L14/L15):** Whisper merged the two lines; the 0.44 s silence at 39.79–40.23 s of the read is used. Film cross-check: L15's internal comma pauses (41.23–41.68, 42.39–42.74, 44.50–44.86) match its three commas, and the line breaks of the read are the longer gaps (0.4–0.7 s), so the split is likely right. If the ear check moves the boundary by Δ, shift S01-B05-SH01's end/S01-B05-SH02's start and every L15 cue by Δ (whole frames) and keep L15's phrase offsets.
- **UB-2 (L15 end / L16 start):** "แล้วคุณล่ะ…" (46.41–46.91 s) belongs to L16 (the TTS text has the line break before it; the 0.71 s gap 45.70–46.41 is a line-break gap). L15's end is taken at 45.70 (silence) not 45.52 (Whisper). S01-B05-SH02's last 6 f and the L15b caption end depend on it (±0.18 s).

## Staging deviations (Film decisions)

Each is forced by the approved look frames or by a projection result; the brief and storyboard `est` values lose to these numbers.

- **SD01 S01-B01-SH01:** LF01 v3 set-up: TINY at (−0.40, 0, +0.20) m, camera `yaw −24→−18, r 2.0→1.85, hy 600`, `new: mug-cradle` (look-frames W3.1 revisions).
- **SD02 S01-B01-SH02:** camera **yaw 180** (looking +z, back at the building) at `pos (−0.05, 1.55→1.45, −0.30)`. The brief's yaw 0 looks away from the building, so the facade and the rail cap fall behind the lens; its dolly to eye 1.25 pushes the cap behind the near plane (`meas`).
- **SD03 S01-B01-SH03:** target (0.05, 1.25, 0.05), `yaw +4→+10, r 1.8→1.65, cx −60`. The brief's T-PLANTER `yaw +20→+28, r 1.3→1.1` puts TINY at the left edge (x 12→−29 `meas`) at 1300–1440 px tall; `cx −60` lands the pop point on SH04's puff centre.
- **SD04 S01-B01-SH04:** crane shortened to the first quarter of the brief's move (eye 0.6→1.05, pitch 0→+8.75°, yaw 0→+2°). At u 0.6 her face enters the caption band, at u 1.0 she leaves the frame (`meas`); LF02 itself is the crane at u 0.2–0.3.
- **SD05 S01-B02-SH01:** target (−0.6, 1.5, −7.0), `yaw −35→−25, r 3.8→3.4, pitch +10→+12` so she stays in frame from the lip to clear air; she shrinks to 270 px as she is blown away (lead exception, below).
- **SD06 S01-B02-SH03:** tree at (−2.5, 0, +4.0) m leaning into the left edge (the brief's (+9, 0, +6) projects off frame at x 3721); pitch +50→+46 kept.
- **SD07 S01-B03-SH02 (R1.1 FR01):** side-on is `yaw +18→+12` about (1.5, 1.0, −0.85) at r 2.3→2.4 (R1: (1.75, 1.1, −0.85), r 2.0; widened so she and the stretched neck both hold) (the brief's +80 looks along the pull axis, with the drop in front of her); TINY steps in to (1.30, 0, −0.75) to put her hand in D1 (LF03's (0.95, 0, −0.55) is 0.8 sm from the drop, beyond her reach), then backs off two steps to (0.75, 0, −0.74) as the 0.5 sm neck draws her wrist out to (1.28, 1.21).
- **SD08 S01-B03-SH03 (R1.1 FR02):** `yaw +16→+10, r 1.6→1.45, eye 1.35` about (1.55, 1.3, −0.95), between the stretched-neck wrist (1.28, 1.21) and D1 (R1 aimed at (1.80, 1.42, −0.92), the hand-fully-in wrist, which is not where the wrist is in state c). The brief's `yaw +60, r 0.6` puts the lens inside D1, and f 1150 at r 0.6 would draw the drop ~1500 px wide.
- **SD09 S01-B03-SH04:** two-part camera: hold on the heave (drop in frame), then truck with the tumble into the shade (the brief's pull-back loses either the drop or the landing at the lead rule).
- **SD10 S01-B04-SH02:** LF04 v5 set-up: `yaw −25→−15, r 1.9, hy 640`; CL02 at z −13.0 walking −x, visible through the grass gap x −1.6..+0.8 (centre −0.4, half width 1.2); far tuft behind her head.
- **SD11 S01-B04-SH03:** time cut: she has already reached the crumb at entry (a 2.2 sm walk does not fit before "จะอุ่นได้…"). The drag is seen `left` (she walks backwards toward +x facing the crumb; the brief's `right` would show her back to it). The shade edge stays at x −0.5 in B04 (R06), so the storyboard's "crumb's +x face catches the sun" becomes a warm bounce glow at the right frame edge.
- **SD12 S01-B05-SH01:** T-PAIR moved to (−1.0, 0.8, −1.2) (the brief's (−0.3, 1.0, −1.3) puts seated TINY at x 21→−96 `meas`); the ant starts at x −4.2 (not −8.0) at 0.07 sm/f so it enters frame during the silence.
- **SD13 S01-B05-SH02:** camera on the stopped ant (1.2, 0.6, −2.0) with `cx +150, hy 800` so the card fits on the left; the icon shrinks on "แต่ตัวเล็กลง…" and **both bars start on "น้ำหนัก…"** (not on "แต่ตัวเล็กลง…"), so the bars move when the words say weight drops (brief VD15 "both starting on the same word" kept).
- **SD14 S01-B05-SH04:** `r 4.4→4.1, yaw −6→−3, cx +40` (the brief's r 5.0→4.6 draws TINY ~385 px); end-frame wide exception at 444→476 px.
- **SD15 V04 edit:** `…V04-t2-tight.wav` (2.75 s: grunt, 0.30 s, grunt, 0.30 s, gasp) instead of the 3.90 s trim; the 1.15 s pause between grunts would hold the heave too long in a video already at 65 s.

**Lead-size exceptions (Boss rule ≥ 480 px):** S01-B01-SH02 (no full figure, forearm and mug only), S01-B02-SH01 end (TINY blown away, 528→270 px), S01-B02-SH03 (speck by design), S01-B05-SH04 (wide end frame, 444→476 px; VD17 needs TINY, crumb and ant together). Every other shot `meas` ≥ 480 px (seated: standing-equivalent).

## Sound plan (whole video; per-shot cues in the shot blocks)

Library checked 2026-11-06 at `~/ReelsStore/library/sound/INDEX.md` (210 lines): every library ID below exists; all are generated and "not listened" (Editor ear-checks before use). No NG-* item has been generated yet. Sound never carries a fact; all macro foley is fiction (brief: Sound direction).

| Layer | Source | Global use |
| --- | --- | --- |
| Theme, curious | **NEEDS-GEN NG-M1**: curious celesta-harp theme with pizzicato strings and a glassy bell, ~92 bpm, 60 s, instrumental; sections: curious low (B01), airy harp + high pad (drift), light pluck resolve, comic cello pizzicato (B03). Fallback `bed_pool-curious-sparse_01` (partial) | G0–1000, low, ducked under every voice |
| Theme, cold | **NEEDS-GEN NG-M2**: the same tune as a cool sparse minor celesta, 15 s (same seed/prompt family) | G1000–1332; **hard out at G1332** |
| Theme, warm | **NEEDS-GEN NG-M3**: the same tune warm and building, ends on a held resolving chord, 25 s. Fallback layers `bed_warm-pad-felt-third_01` (build), `stinger_pizz-tag-ending_01` / `stinger_outro-resolve_01` (end chord) | G1356–1963, fades with the picture |
| Balcony bed | `outdoor_dawn-street-empty_01` + `room_soi-morning-quiet_01` (low) | G0–208; low-passed (~1.2 kHz) and −6 dB G208–329 |
| Air | `outdoor_wind-open-roundabout_01` (airy, no roar) | very low G41–137 (from below); blade breeze G208–329; drift G329–493 |
| Garden bed | `outdoor_park-birds-breeze_01`, low-passed (~1.5 kHz, far huge birds) | G493–1000; birds out G1000–1332 (breeze only); birds back low G1356–1963 |
| Ant steps | **NEEDS-GEN NG-S8**: tiny ticky ant footsteps, 4 s loop, fictional | G1077–1217 very low far; G1332–1430 close |
| One-shots | NG-S1 shrink pop + rising glissando sparkle 1.2 s · NG-S2 giant grass creak 3 s · NG-S3 soft muffled landing tap 0.4 s (no low thump) · NG-S4 glassy drop boing + rubber-band creak 1.5 s · NG-S5 wet plop 0.5 s · NG-S6 warmth "fwoop" 0.8 s ×2 · NG-S7 crumb drag scrape 2 s · NG-S9 brass-and-celesta triumph sting 1.5 s; library `whoosh_air-swish-rising_01` (0.80 s), `comedy_soft-boing_01` (1.0 s), `reveal_glass-shimmer-soft_01` (1.39 s), `foley_wet-pops-bubbles_01` (partial for NG-S5), `foley_bread-bite-crunch_01` (1.0 s), `stinger_pizz-shrug_01` (1.2 s), `ui_pop_01` (0.08 s), `whoosh_fast-slide_01` (0.27 s), `reveal_reverse-swell-airy_01` (0.80 s) | per shot |

**Silence policy (brief):** (1) G1332–1356: music and birds out (hard cut on the frame), breeze −6 dB, only NG-S8 ant steps; (2) no hard impact anywhere in the fall: the landing is NG-S3 + `comedy_soft-boing_01`, no thud, no low hit; (3) after V08 (G1903): no speech; the NG-M3 end chord, low birds and breeze fade with the picture to digital silence on G1962.

**Mix intent (EP08a):** B01 hold, lift on the pop (G192); B02 release (airy, floating), small hit on the landing boing; B03 hold with comic tension, hit on the snap (G976); B04 drop (cold, sparse); B05 silence → build → hit on the lift (G1648) → release under L17 → fade.

## Caption plan

- White captions with the edu stroke (series default; no overlay band), `captionStyle.bottomEdgeY` 1344, band y 1176–1344, ≤ 2 lines, break after "…" when a line wraps (brief VD19). Subtitle text = the spoken line verbatim (script: no subtitle differences). TINY's V01–V08 get no subtitle; L08 does.
- Cue rule: `[word onset, voiced end + 6)` capped at the next cue's onset. L06, L15 and L16 are split into two cues at their "…" pause (a, b) because the first half belongs to a different picture beat or the whole line would exceed two lines; text of each part verbatim. Exact ranges sit in each shot block.
- Nothing but feet, ground and the foreground blades enters y 1160–1344: faces, the drop, the crumb, the ant, the leaf and the bars card stay above (per-shot `meas`). The caption stroke must hold over the bright LF01 floor (band luma 0.82 at LF01, the brightest of the set; judged at W5.3).

## Shot map

| Shot | Beat | Frames [start, end) (len) | Voice | Claims / clues |
| --- | --- | --- | --- | --- |
| S01-B01-SH01 | B01 | 0–41 (41) | L01 | frame: hook premise |
| S01-B01-SH02 | B01 | 41–137 (96) | L02 | C01 `hedge` |
| S01-B01-SH03 | B01 | 137–208 (71) | L03 | C01 premise (A1) |
| S01-B01-SH04 | B01 | 208–240 (32) | V01 | dramatization |
| S01-B02-SH01 | B02 | 240–329 (89) | L04 | dramatization |
| S01-B02-SH02 | B02 | 329–461 (132) | V02, L05 | C03 `verified-physics` |
| S01-B02-SH03 | B02 | 461–493 (32) | L06a | C01 `hedge` |
| S01-B02-SH04 | B02 | 493–586 (93) | L06b, V03 | C01 `hedge` + `calc` |
| S01-B03-SH01 | B03 | 586–663 (77) | L07 | C07 `hedge` (drop ≤ 1.0× her height) |
| S01-B03-SH02 | B03 | 663–749 (86) | L08 | dramatization |
| S01-B03-SH03 | B03 | 749–868 (119) | L09 | C06 `hedge` |
| S01-B03-SH04 | B03 | 868–1000 (132) | L10, V04 | C06 `calc` (words only) |
| S01-B04-SH01 | B04 | 1000–1077 (77) | L11 | C11 `hedge` (shade only) |
| S01-B04-SH02 | B04 | 1077–1217 (140) | L12, V05 | C08 `verified-physics`; **CL02** plant |
| S01-B04-SH03 | B04 | 1217–1332 (115) | L13, V06 | C09 `hedge`; **CL01** plant |
| S01-B05-SH01 | B05 | 1332–1421 (89) **UB-1** | silence, L14 | C12 `hedge`; CL02 payoff |
| S01-B05-SH02 | B05 | 1421–1594 (173) **UB-1, UB-2** | L15 | C14 `verified-physics` (bars = illustration) |
| S01-B05-SH03 | B05 | 1594–1767 (173) | V07, L16 | C14/C15 direction only; CL01 payoff |
| S01-B05-SH04 | B05 | 1767–1963 (196) | L17, V08, hold | frame: takeaway; closing |

---

## Shot sheets

Picture intent per shot is the row's `seen` text in [review-rows.json](review-rows.json) and its look frame; the blocks add numbers. Voice placement: put each NAR split file at `onset/30 − 0.05 s` (its in-file onset) and each TINY file at `onset/30 − in-file onset` (given per cue), so the speech onset lands on the stated frame. TINY base casting (brief VD02): **`woman-bob + new: morning-pyjamas`**, 4-head kit rig, 1.58 m / 1.58 sm; the ant: **`new: ant` + `new: leaf-fragment` L1, `new: ant-walk`** (look ANT1–3 v5). Rules R01–R10 of the [storyboard](storyboard.md#rules-carried-from-the-brief-and-fact-check-every-shot) apply to every shot and are not repeated.

### S01-B01-SH01 · 0–41 · LF01 balcony at dawn

- **Time:** L01 G6–36 = L 6–36. Sip: mug rises L 8–16, at the lips L 16–26, back under the chin L 26–34.
- **Staging (SET-BALCONY, m):** TINY (−0.40, 0, +0.20), leaning back on the rail, facing +z; casting **`woman-bob + new: morning-pyjamas, new: mug-cradle (P19 base), sleepy`**, view `front`; `new: coffee-mug` in the right hand (mitten wrap of LF01 v3), steam wisp from the rim; left hand resting on the rail cap behind her. Planter x 0.00..+0.80 at the rail (screen right of her shoulder).
- **Camera:** `cam: T-TINY (−0.40, 1.40, +0.20), yaw −24→−18, r 2.0→1.85, eye 1.45, f 1050, hy 600` (SD01). `meas`: TINY x 540, 829→897 px (head top y 532→526), mug (561, 734), planter (812→836, 671); legs and feet in the band, face clear.
- **Look:** as LF01 v3; glass rail as a veil (DF-20261030-painted-glass-sheen-veil); warm low sun screen right.
- **VO + caption:** NAR "ถ้าคุณตัวเล็กเท่ามด…" onset G6; caption G6–42. No title (VD18).
- **Sound:** NG-M1 in from L0, curious, low; balcony bed in from L0; soft mug sip optional (`NEEDS-GEN`, not requested; drop if absent) at L 18.
- **Entry → exit:** mug in the right hand under the chin at both ends; left hand on the cap. **Accept:** "high balcony at dawn, planter, mug" readable at 270 px in the first second; lead ≥ 480 px; face above y 1160.

### S01-B01-SH02 · 41–137 · the drop past the rail

- **Time:** L02 G45–132 = L 4–91 ("ตกจากตึกสิบชั้น…" L 4–38; "คุณจะแทบไม่เป็นอะไรเลย" L 47–91).
- **Staging (SET-BALCONY / facade below, m):** her right forearm lying along the rail cap from the screen-right edge, the mitten round the mug resting on the cap at (−0.25, 1.12, 0.00); balcony slabs of the floors below every 2.9 m down the facade (z −0.05), the sunlit garden lawn 27 m below. No body or face in frame.
- **Camera:** `pos: (−0.05, 1.55→1.45, −0.30), yaw 180, pitch −65, f 950, hy 520` (SD02), ease in-out L 0–96. `meas`: mug on the cap (908→986, 354→225); facade from the cap down to the vertical vanishing point (540, 963); lawn foot at y 963 widening to the bottom (lawn 8 m out at y 1320). No spin, no shake.
- **Look:** facade in cool morning shade; the lawn below warm and sunlit.
- **VO + caption:** NAR L02 onset G45; caption "ตกจากตึกสิบชั้น… คุณจะแทบไม่เป็นอะไรเลย" G45–138.
- **Sound:** NG-M1 continues; `outdoor_wind-open-roundabout_01` very low from L 0 (a faint rise from below, +3 dB over L 0–40, then steady).
- **Entry → exit:** mug on the cap in her right hand both ends. **Accept:** height felt once (slabs converge to the lawn); no number on screen; mug and mitten read at 270 px at the top right.

### S01-B01-SH03 · 137–208 · touch and pop (VD05)

- **Time:** L03 G141–208 = L 4–71 ("สมมติว่าหดทั้งตัว…" L 4–38; "รวมทั้งน้ำหนักด้วย" L 44–71). Lets go of the mug L 2–8; turns `front`→`right` and steps L 4–18; left hand reaches L 18–50; **touch** the grass L 53 (G190); **shrink** L 55–63 (8 f ease-in, her card scales about the touch point to ~0); puff ring + 6–8 sparkle ticks L 59–71, **peak on L 71 = the cut**.
- **Staging (SET-BALCONY, m):** TINY (−0.40, 0, +0.20) → (−0.20, 0, +0.22) L 4–18, facing +x at the end; casting **`woman-bob + new: morning-pyjamas, P16 (left-hand reach), curious → surprised`**, view `right`; mug stays on the cap at (−0.25, 1.10, 0.00); touch point (+0.15, 1.30, −0.05) on the dewy outer blades; effect **`new: shrink-pop`** centred on the touch point.
- **Camera:** `cam: (0.05, 1.25, 0.05), yaw +4→+10, r 1.8→1.65, eye 1.35, f 1100, hy 700, cx −60` (SD03). `meas` at the end: TINY x 281, 1139 px tall (head top 534; face clear, legs in the band); touch / pop point (554, 732); planter x 514–1064 at y ~745; mug on the cap (≈300, 857).
- **Look:** warm sun; sparkle `#fff1cf`, ENV-GLOW ≤ 0.3; dew beads glint on the outer blades.
- **VO + caption:** NAR L03 onset G141; caption G141–214 (runs 6 f into SH04).
- **Sound:** NG-S1 at L 53 (touch; the glissando rises through the shrink); NG-M1 lifts with it (mix: lift).
- **Cut:** matched cut on the puff peak (VD05): the puff centre at (554, 732) here and (540, 762) at SH04 L0 (Δ 33 px ≤ 40, `meas`). Fallback: `Flash` white frame L 70–71.
- **Entry → exit:** mug in the right hand → on the cap (stays there, unseen after this shot); exit: TINY gone, puff at peak. **Accept:** spike 2 (pop reads as one event across the cut at speed).

### S01-B01-SH04 · 208–240 · macro planter, looking up (LF02)

- **Time:** puff fades L 0–10 around her; she is sitting (P33-like) L 0–8, stands L 8–16, head tilts back L 10–14; V01 G218 = L 10 (file at G218, in-file onset 0.00), voiced L 10–23. Cut 4 f before L04 (rule; not on a pop).
- **Staging (SET-MACRO-PLANTER, sm):** TINY (0, 0, 0) facing +z; casting **`woman-bob + new: morning-pyjamas, P33 → P12, surprised`**, view `front`; blade clumps (−4, −2), (−1.5, −4.5), (+2.5, −3), (+5, +1), (−6, +3) (x, z), 20–38 sm; outer lip z −6.4 (top y 1.3); near foreground sweeps as in LF02.
- **Camera:** `cam: T-TINY (0, 1.0, 0), yaw 0→+2, r 2.6, eye 0.6→1.05, pitch 0→+8.75, f 1000, hy 820` (SD04), ease-in L 6–32. `meas`: TINY x 540, 608→~650 px, head top 443→~800 (chin above y 1000), feet 1051→~1430 (feet in the band at the end).
- **Look:** LF02 v1: backlit gold blades, `Shafts` ≤ 0.3 from right-back, dew beads Ø 0.2–0.6.
- **VO + caption:** V01 (no caption). L03's caption ends G214.
- **Sound:** V01 L 10; NG-S2 grass creak in at L 4 (continues into SH05, 3 s); balcony bed low-passed and −6 dB from L 0; blade breeze low.
- **Entry → exit:** no props (the mug stayed on the human-scale rail). **Accept:** spike 1: blades slide in parallax over the crane (near faster than far); head ≥ 150 px (`meas` 169→185).

### S01-B02-SH01 · 240–329 · breeze and lift-off

- **Time:** L04 G244–325 = L 4–85 ("ลมพัดวูบเดียว…" L 4–34; "ปลิวหลุดจากระเบียงชั้นสิบ" L 45–85). Breeze bends blades toward −z L 4–30 (tip deflection ≤ 25% of height), holds; **lift-off** L 38 (G278); rises over the lip L 38–70; clears the lip L 70; drifting away and up L 70–89.
- **Staging (sm):** TINY at the lip (−0.4, 0, −6.0) → (−0.6, 1.5, −7.2) L 54 → (−0.8, 3.0, −8.5) L 89; casting **`woman-bob + new: morning-pyjamas, P39 (lift-off) → new: drift-spread (L 60–89), scared`**, view `left` at lift-off, squared to the mid-shot camera; hair and hem flutter.
- **Camera:** `cam: (−0.6, 1.5, −7.0), yaw −35→−25, r 3.8→3.4, eye 0.8, pitch +10→+12, f 1000, hy 760` (SD05). `meas`: TINY (793, feet 1216, 528 px) at the lip → (512, 760; 362 px) → (344–378, 508–525; 270 px) clear; lip (687, 790); beyond it open sky and the hazy city far below.
- **VO + caption:** NAR L04 onset G244; caption G244–331.
- **Sound:** `whoosh_air-swish-rising_01` at L 36 (G276, peak on the lift); blade breeze +4 dB L 4–40; NG-S2 tail; V02 file starts G318 (L 78; in-file onset 0.35, so the yelp sounds on the cut G329).
- **Entry → exit:** standing at the lip → in the air, arms opening. **Accept:** a breeze, not a storm; the lift is gentle (no throw, no spin > 20°); lead exception at the end (blown away).

### S01-B02-SH02 · 329–461 · the drift (VD07)

- **Time:** V02 voiced G329–367 = L 0–38 (file at G318); L05 G347–459 = L 18–130 ("แรงโน้มถ่วงเท่าเดิม…" L 18–46; "แต่ตัวยิ่งเล็ก อากาศยิ่งต้านเก่ง" L 58–79 / 85; "เมื่อเทียบกับน้ำหนัก" L 85–130). Cut on V02's onset (exception: the yelp starts the shot). Expression scared L 0–40 → surprised (wonder) L 40–132.
- **Staging (SET-DRIFT, sm):** TINY feet anchor at (0, 0, 0), body roll ±8° (sine, period 90 f), arms out; casting **`woman-bob + new: morning-pyjamas, new: drift-spread, scared → surprised`**, view `front`; ENV-FALL `dust` motes rising relative to her at 0.06 sm/s (≈ 26 px/s at her depth, 438 px/sm; R1.1 FR03: R1's 0.15 sm/s was 66 px/s; the screen speed governs), sparse, thinned in the caption band; facade as a soft vertical wash on screen left with one blurred slab band sliding up (enters the bottom at L 20, leaves the top at L 132); **`new: soft air streaks`**: 3–5 thin pale curved strokes hugging her outline, drawn on L 50–70 (on "อากาศยิ่งต้านเก่ง"), slow drift, never radial.
- **Camera:** `cam: follow T-TINY (0, 0.8, 0), yaw −10→+15, r 2.4, eye 1.0, f 1050, hy 780` (camera moves with her; no accumulated state). `meas`: TINY x 540, 692 px, head top 526, feet 1218 (feet in the band).
- **VO + caption:** NAR L05 onset G347; caption "แรงโน้มถ่วงเท่าเดิม… แต่ตัวยิ่งเล็ก อากาศยิ่งต้านเก่ง เมื่อเทียบกับน้ำหนัก" G347–461 (2 lines, break after "…").
- **Sound:** V02 yelp fades under L05 (Editor fade from L 24 to L 38); NG-M1 airy harp + high pad section from L 0; `outdoor_wind-open-roundabout_01` airy, no roar.
- **Entry → exit:** arms out both ends. **Accept:** spike 4 (6-frame strip: no speed lines, no blur, motes < 40 px/s); air strokes read as air holding her, not speed.

### S01-B02-SH03 · 461–493 · speck on the facade

- **Time:** starts on L05's last voiced frame (exception: the wide gets 8 f before the line); L06a G469–492 = L 8–31; ring drawn on L 2–8; cut in L06's comma pause G493.
- **Staging (SET-FACADE, m):** speck (TINY, no pose read, 4–6 px dot) (+0.2, 14.0, +1.4) → (+0.4, 12.6, +1.7) with a ±0.1 m sway; her balcony slab at y 27.0 with the planter as a green dot; tree at (−2.5, 0, +4.0) leaning into the left edge (SD06); **`new: ring marker`** chalk circle Ø 70 px, screen-space, centred on the speck.
- **Camera:** `pos: (+2.0, 0.25, +6.0), yaw −12, pitch +50→+46, f 900, hy 1100`. `meas`: speck (487, 764) → (490, 703); slab y 27 at (514, 646→564), planter dot (529, 631→548); tree crown x 0–200, y 760–1030; facade foot below the frame.
- **VO + caption:** NAR L06 onset G469; caption L06a "ตกสิบชั้น…" G469–493.
- **Sound:** wind bed thinned; NG-M1 floats (sustained harp chord).
- **Cut:** hard cut at G493 in the pause; L06 continues over SH04.
- **Accept:** the speck and ring are found in under 1 s at 270 px; the drift is dramatized slow (no real speed shown or stated); lead exception (speck by design).

### S01-B02-SH04 · 493–586 · soft landing, "huh?" (VD08)

- **Time:** L06b G495–555 = L 2–62; descends L 0–6 from y 0.6 sm; **feet touch L 6** (G499, on "ถึงพื้น"); bounce 0.3 sm L 6–16; knees bend and sit L 16–30; `sit-up-check` pats on arms and legs L 34–62; V03 file at G552 (in-file onset 0.26): "huh" G560–568 = L 67–75 (head tilt, looks at her hands), giggle G580–594 = L 87–101 (runs 8 f into the next shot).
- **Staging (SET-GARDEN-GRASS, sm):** TINY (0, 0.6, 0) → (0, 0, 0) facing +z; casting **`woman-bob + new: morning-pyjamas, P33 → new: sit-up-check, surprised → happy`**, view `front`; sunlit clearing x −1.0..+4.0, z −3..+3.
- **Camera:** `cam: T-TINY (0, 0.7, 0), yaw +15→+5, r 2.2→1.9, eye 0.7, f 1050, hy 820`. `meas`: standing 754→873 px; seated 453→525 px (standing-equivalent 754→873); seated head top 701→682; feet 1154→1207.
- **Look:** first view of the garden (LF03 family): backlit gold blade ring, sunlit thatch.
- **VO + caption:** caption L06b "ถึงพื้นก็แค่ราว ๆ กระโดดลงจากเก้าอี้" G493–561. V03: no caption.
- **Sound:** NG-S3 soft tap at L 6; `comedy_soft-boing_01` at L 8 (−6 dB); NG-M1 light pluck resolve on the giggle L 87; garden bed in from L 0 (birds low-passed, far).
- **Entry → exit:** in the air → seated, smiling, dry. **Accept:** R02: no dust burst, no impact frame, no shake, no low thump.

### S01-B03-SH01 · 586–663 · the dew drop (LF03)

- **Time:** L07 G590–659 = L 4–73 ("แต่ข้างล่าง…" L 4–23; "มีหยดน้ำค้างรออยู่" L 32–73). She stands and walks L 0–44, then reaches L 50–77. Drop glint L 34.
- **Staging (sm):** TINY (0, 0, 0) → (0.95, 0, −0.55) L 4–44 (walk, view `right`), then the right arm reaches toward D1 (`rArm` target 0.6 unit left and 0.3 above the contact, LF03); casting **`woman-bob + new: morning-pyjamas, walk → P16 (right-hand reach), curious`**; D1 at rest (state a) on `B-DEW` (LF03 v5 geometry).
- **Camera:** `cam: (1.55, 1.0, −0.8), yaw −12→−6, r 3.3→3.1, eye 1.0, f 1050, hy 760` (LF03). `meas`: TINY enters from the left edge (start x −106 → off frame), ends (325–348, 566–595 px, feet 1118–1137); D1 centre (735, 610), top 439, contact ~723.
- **Look:** LF03 v5: low sun back-left, D1 the brightest thing in frame (clear body, hot rim, inverted scene, soft veil).
- **VO + caption:** NAR L07 onset G590; caption G590–665.
- **Sound:** `reveal_glass-shimmer-soft_01` at L 34 (drop glint); NG-M1 curious.
- **Entry → exit:** seated smiling (giggle tail L 0–8) → reaching, hand 0.3 sm from the drop. **Accept:** drop reads as water at 270 px; D1 0.58× her height (C07).

### S01-B03-SH02 · 663–749 · stuck (L08)

- **Time:** L08 file at G658 (in-file onset 0.30): grunt G667–674 = L 4–11, words G678–746 = L 15–83. Hand enters D1 L 0–10 (state b: dimple L 0–4, wrap L 4–10, meniscus collar on the wrist from L 10); stuck; she pulls L 16–80 (state c: neck stretches toward her, 0 → 0.5 sm by L 60, holds with a slow 0.05 sm oscillation); comic lean-back.
- **Staging (sm, R1.1 FR01):** TINY (1.30, 0, −0.75) with the hand fully in (wrist (1.80, 1.42), L 10) → backs off in two planted steps, L 18–30 to (1.02, 0, −0.75) and L 40–54 to (0.75, 0, −0.74), upper-body lean away 0 → 12° by L 30 (hip pivot), facing +x; the wrist rides the neck tip from (1.80, 1.42) to (1.28, 1.21) by L 60 (z: painted at D1's contact scale, z −1.0); rule: shoulder–wrist ≤ 0.55 sm every frame (arm straight on the pull, never bent past 30°); casting **`woman-bob + new: morning-pyjamas, P16 pull-back (lean away), disgusted → angry (comic)`**, view `right`; drop contact patch stays on `B-DEW` (area within ±10%); neck 0.5 sm at L 60 kept (the 0.3 fallback is not used).
- **Camera:** `cam: (1.5, 1.0, −0.85), yaw +18→+12, r 2.3→2.4, eye 1.0, f 1100, hy 720` (SD07, R1.1). `meas` (projected with `camOf` + `dropGeometry`, est ±5 px): TINY feet x 433 (L 10) → 200 (L 60–86), ~760 → 708 px, head top ~443 → 462, feet 1203 → 1169 (feet in band); D1 contact (889→868, 661→665), top y 216→279, right edge 1158 → 1101 (bleeds the right edge early); wrist (696, 519) L 10 → (445, 622) L 60, neck tip ~(415, 630).
- **Layers:** `B-DEW` → drop body over her hand at 35–55% → rim and highlights over all (spike 3).
- **VO + caption:** TINY L08; caption "ทำไมน้ำมันเหนียวแบบนี้!" G678–752.
- **Sound:** NG-S4 at L 2 (glassy boing on entry), creak continuing under the pull L 16–80; NG-M1 comic pizzicato section in at L 40.
- **Entry → exit:** hand 0.3 sm from the drop → hand inside, neck stretched, TINY at (0.75, 0, −0.74). **Accept:** spike 3 (hand visibly inside, collar reads, neck stretches, patch stays on the blade); D1 never above 1.0× her height; feet planted between the two steps (no slide); her whole head in frame (x > 60).

### S01-B03-SH03 · 749–868 · the wrist close

- **Time:** L09 G753–863 = L 4–114 ("ตัวเล็กขนาดนี้…" L 4–31; "แรงตึงผิวน้ำ" L 37–64; "อาจแรงพอจะดึงคุณติดไว้" L 68–114). State c held; she tugs twice (L 20 and L 50, 0.06 sm each), the surface pulls back after each (L 26, L 56); on "ดึง" (≈ L 90) the collar tightens a little (0.03 sm up the wrist).
- **Staging (sm, R1.1 FR02):** state c, neck ~0.44 sm: wrist (1.33, 1.23, −1.0) at the neck tip in the collar, forearm down-left to the elbow ≈ (1.10, 1.16, −0.9) (est; arm line `ARM_DIR` (−0.95, −0.31)); the neck runs right from the wrist to D1's body (left rest edge x 1.65); D1 contact (2.2, 1.12, −1.0); caustic `#fff1b0` on the blade. TINY (0.75, 0, −0.74) is off frame left (hand and forearm only).
- **Camera:** `cam: (1.55, 1.3, −0.95), yaw +16→+10, r 1.6→1.45, eye 1.35, f 1150, hy 700` (SD08, R1.1). `meas` (projected, est ±5 px): wrist (358→355, 797→803), left of the body with the neck between them; neck tip x ~305; D1 body left edge ~610 → ~620, right off the right edge, top y 216→187, contact (1040→1078, 880→891); elbow ~(179→166, 855→864), forearm leaves the frame bottom-left. All above y 1160.
- **Casting:** TINY hand and forearm (`woman-bob + new: morning-pyjamas`); `new: dew-drop` state c.
- **VO + caption:** NAR L09 onset G753; caption "ตัวเล็กขนาดนี้… แรงตึงผิวน้ำอาจแรงพอจะดึงคุณติดไว้" G753–869.
- **Sound:** NG-M1 comic cello pizzicato tension; NG-S4 creak soft on each tug (L 20, L 50).
- **Accept:** no force arrows, no numbers (R01); the deform is the explanation; collar reads at 270 px.

### S01-B03-SH04 · 868–1000 · heave, snap, tumble into the shade

- **Time:** L10 G872–930 = L 4–62 ("แรงกว่าน้ำหนักตัวคุณ…" L 4–30; "ได้หลายเท่า" L 33–62). Brace (feet apart) L 4–30; heave 1 with grunt 1 (V04 file at G916, in-file onset 0.29: G924–941 = L 56–73); heave 2 with grunt 2 (G951–972 = L 83–104); **snap L 108** (G976, state d: neck breaks, drop recoils with 3 wobble cycles L 108–126); gasp G981–993 = L 113–125; tumble back L 108–124 (P39), sits L 124–132 at the shade side.
- **Staging (sm, R1.1 FR01):** TINY (0.76, 0, −0.72) braced (wrist (1.31, 1.22) at the neck tip, shoulder–wrist ≤ 0.55 sm) → (0.1, 0, −0.55) L 116 → seated (−1.2, 0, −0.4) L 128, across the shade edge x −0.5 at L 120; wet from the snap on (VD10: darker patches on the pyjamas, clumped hair, 3–5 beads on the arms; `wet: true`); casting **`woman-bob + new: morning-pyjamas, new: brace-heave → P39 → P33, angry → shock`**, view `right` on the heave, `front` once seated.
- **Camera (SD09):** L 0–104 `cam: (1.3, 0.9, −0.8), yaw +18, r 2.7, eye 0.8, f 1050, hy 780` (static; slight push r 2.7→2.6 L 0–100); L 104–132 truck to `cam: (−0.4, 0.9, −0.5), yaw +12, r 2.6` (ease in-out). `meas` (R1.1, projected): braced TINY x 337, ~591 px; wrist (552, 611); D1 contact (909, 651), centre (909, 507) at the start; at the end seated TINY (224, 1095), standing-equivalent 621 px; D1 out of frame right by L 124.
- **VO + caption:** NAR L10 onset G872; caption G872–936. V04: no caption (its first grunt overlaps L10's last 6 f).
- **Sound:** V04 as above; NG-S5 wet plop at L 108 (partial `foley_wet-pops-bubbles_01`); NG-M1 pizzicato stops on the snap (L 108, mix: hit); garden bed continues.
- **Entry → exit:** hand in the drop → free, wet, seated in shade. **Accept:** "หลายเท่า" words only (R01); the tumble is soft (R02); the wobble reads before the truck loses the drop.

### S01-B04-SH01 · 1000–1077 · cold shade

- **Time:** L11 G1004–1073 = L 4–73 ("ในร่มหญ้า…" L 4–24; "ศัตรูต่อไปคือความหนาว" L 30–73). Hugs herself from L 0 (P42), small shiver loop (kit `shiver`, amplitude half) from L 40.
- **Staging (sm):** TINY (−1.4, 0, −0.6) standing under `T-SHADE`, facing +z, wet; casting **`woman-bob + new: morning-pyjamas, P42, worried → sad`**, view `front`; the sunlit clearing glows behind on the right.
- **Camera:** `cam: T-TINY (−1.4, 1.4, −0.6), yaw −10→−4, r 2.0→1.8, eye 1.0, f 1050, hy 700`. `meas`: TINY x 540, 830→921 px, head top 395→362, chin ≈ 595; shade edge (792→858, ~1060), sun patch (993→1103, ~960).
- **Look:** cool shade air `#6f8fb0`, shade grass `#3f6b5a`→`#2f5560`, no shafts on her; shade tint through `tintAll` (LF04 v5 values); no visible breath.
- **VO + caption:** NAR L11 onset G1004; caption G1004–1079.
- **Sound:** NG-M2 in at L 0 (6 f crossfade from NG-M1); birds fade out L 0–12, soft breeze only.
- **Entry → exit:** standing hugging herself both ends. **Accept:** R06 (no sun on her); the warm patch reads as out of reach.

### S01-B04-SH02 · 1077–1217 · warmth puffs (LF04)

- **Time:** L12 G1081–1189 = L 4–112 ("ยิ่งตัวเล็ก" L 4–21; "ยิ่งเหมือนเปลือยกลางลม…" L 31–62; "ความร้อนหนีออกเร็วขึ้นมาก" L 72–112). Breeze (−x) ruffles the bob and the hem L 40–62; **puff 1** seeps from the shoulders L 72, **puff 2** from the top of the head L 84, puffs 3–4 L 92–100; they drift −x and up at 0.3 sm/s; she reaches and clutches puff 2 to her chest L 96–106 (`clutch-puff`), it squeezes out between her mittens L 106–116 and floats off; P42 + shiver L 116–140; V05 G1193–1225 = L 116–148 (file at G1193, in-file onset 0.00; the tail runs 8 f into SH03).
- **Staging (sm):** TINY (−1.4, 0, −0.6), view `front`; casting **`woman-bob + new: morning-pyjamas, new: clutch-puff → P42 + shiver, worried → sad (comic)`**; **`new: warmth-puff`** world-space from the torso/head anchors (LF04 `paintPuff`, untinted). **CL02:** ant + leaf L1 (`new: ant` + `new: leaf-fragment`, `new: ant-walk`, view `left`), z −13.0, x +2.5 → −3.5 over L 0–140 (0.043 sm/f, steady), seen only through the grass gap x −1.6..+0.8 (≈ L 40–96); leaf sway ≤ 4°, no shiver (SD10). Optional leaf blanket: dropped (busy frame).
- **Camera:** `cam: T-TINY (−1.4, 1.4, −0.6), yaw −25→−15, r 1.9, eye 1.0, f 1050, hy 640` (LF04). `meas`: TINY x 540, 874 px, head top 319, feet 1193; CL02 in the gap at x 380 → 195, y ≈ 691–695, leaf top y ≈ 564.
- **VO + caption:** NAR L12 onset G1081; caption "ยิ่งตัวเล็ก ยิ่งเหมือนเปลือยกลางลม… ความร้อนหนีออกเร็วขึ้นมาก" G1081–1195.
- **Sound:** NG-S6 fwoop at L 72 and L 84; V05 at L 116; NG-S8 ant steps very low and far L 40–96 (fictional); NG-M2 continues.
- **Entry → exit:** hugging herself → hugging herself, shivering. **Accept:** spike 5 (puff warm, soft, rising slowly, not grey, not breath; CL02 findable at 270 px but not the first thing the eye finds; the ant never shivers).

### S01-B04-SH03 · 1217–1332 · the crumb (CL01)

- **Time:** L13 G1221–1282 = L 4–65 ("จะอุ่นได้…" L 4–34; "ต้องกินแทบตลอดเวลา" L 37–65). Nibble 1 L 8, nibble 2 L 20 (one shallow bite mark appears at L 22); drag L 36–80 (small backward steps every 8 f, heels digging); V06 file at G1280 (in-file onset 0.14): grunt G1284–1298 = L 67–81; **slump** L 80–98 (turns, sits back against the crumb's +x face); sigh G1318–1328 = L 101–111.
- **Staging (sm, SD11):** entry: TINY (−2.85, 0, −0.95) at the crumb's +x face, facing −x, both hands on it, still shivering L 0–6; C1 **`new: breadcrumb`** (0.85 × 0.60 × 0.50) (−3.6, 0.25, −1.0) → (−2.4, 0.25, −0.6) L 36–80, TINY (−2.85, 0, −0.95) → (−1.70, 0, −0.60) with it; seated against its +x side at (−1.75, 0, −0.6) from L 98. Casting **`woman-bob + new: morning-pyjamas, new: nibble → new: drag-back → P33, hungry-hopeful → tired`**, view `left` (nibble and drag, facing the crumb), `front` seated.
- **Camera:** `cam: T-CRUMB (−3.3→−2.0, 0.6, −0.75) truck with the drag, yaw +20, r 2.4, eye 0.8, f 1050, hy 780`. `meas`: nibble TINY (752, 681 px, head top 444); crumb (465, 991) → (353, 1021); seated end TINY x 652, standing-equivalent 770 px; the shade edge x −0.5 lies just past the right edge (warm bounce glow on the right edge only).
- **VO + caption:** NAR L13 onset G1221; caption G1221–1288.
- **Sound:** `foley_bread-bite-crunch_01` pitched up ~3 semitones at L 8 and L 20; NG-S7 drag scrape L 36–80; V06; `stinger_pizz-shrug_01` at L 79 (G1296, ends G1332 on the cut); NG-M2 out with it.
- **Entry → exit:** hands on the crumb → seated against it, hands in her lap, still wet. **Accept:** CL01 reads as a burden; she stays in shade (R06); crumb ≈ 2× her head.

### S01-B05-SH01 · 1332–1421 · silence, the ant passes (UB-1)

- **Time:** cut 4 f after V06's sigh ends (exception: the cut opens the silence); **silence G1332–1356 = L 0–24**; L14 G1356–1416 = L 24–84. Ant x(G) = −4.2 + 0.07·(G − 1332), easing to a stop at +1.2 over G1400–1415; enters frame from the left L 19 (x ≈ −2.9), passes behind her L 35 (x −1.75), exits right ≈ L 85. Her head follows L 25–80 (`turn-head-right`), mouth opens L 30.
- **Staging (sm):** TINY seated (−1.75, 0, −0.6) against C1, still wet; casting **`woman-bob + new: morning-pyjamas, P33 + turn-head-right, shock → surprised`**, view `front`. Ant at z −2.0 walking +x with leaf L1 upright in its mandibles (top 2.0 sm, lean back 15°), view `right`; casting **`new: ant` + `new: leaf-fragment` L1, `new: ant-walk`**. Shade edge slides x −0.5 → −1.2 L 0–89 (story-time cheat); the ant walks out of shade into the sun at x −0.5 → −1.2.
- **Camera:** `cam: T-PAIR (−1.0, 0.8, −1.2), yaw −15→−5, r 3.4→3.0, eye 0.6, f 1000, hy 800` (SD12). `meas`: TINY x 323→243, seated 361→407 px (standing-equivalent 602→676); ant (−7 → 309 → 1072, y ≈ 880), leaf top y ≈ 400–450.
- **Look:** gloss `#d98c62` on the ant's back in the sun; leaf backlit edge `#e2f29a`.
- **VO + caption:** NAR L14 onset G1356; caption "มดบางชนิดแบกของหนักได้หลายเท่าของตัว" G1356–1422.
- **Sound:** silence policy 1 L 0–24 (only NG-S8 close, breeze −6 dB); NG-M3 in at L 24 (fade-in 12 f), birds back low.
- **Entry → exit:** slumped seated → seated, head turned right, mouth open. **Accept:** R04, R08 (first close view of the ant); spike 6 (an ant carrying a leaf, not a leaf walking).

### S01-B05-SH02 · 1421–1594 · two bars (VD15; UB-1, UB-2)

- **Time:** L15 G1425–1589 = L 4–168 ("ไม่ใช่เพราะกล้ามมันเก่ง…" L 4–34; "แต่ตัวเล็กลง…" L 48–69; "น้ำหนักลดเยอะกว่าแรงที่ลดลง" L 79–132; "เลยมีแรงเหลือใช้" L 143–168). Card wipes on L 8–14; "แรง" bar grows up L 14–20, "น้ำหนัก" bar L 20–26; icon shrinks to 40% L 48–66 (ease-out); **both bars start L 79**: "น้ำหนัก" to 15% over L 79–97 (ease-out 0.6 s), "แรง" to 45% over L 79–121 (ease-out 1.4 s) (SD13); surplus glow on "เลยมีแรงเหลือใช้" L 143–152 ramp, held to the cut.
- **Staging (sm):** ant stopped at (+1.2, 0, −2.0), leaf up, idle (antenna twitch on G), view `right`; TINY out of frame left. **`new: scale-bars`** card, screen px: cream `#f4ecd8` x 40–400, y 360–1000; TINY outline icon at (90, 430), 120 px → 48 px; bars x 130–210 ("แรง", amber `#e8a33a`) and 260–340 ("น้ำหนัก", slate `#5a7fa8`), base y 880, start height 480 px, end heights 216 px and 72 px; labels "แรง" / "น้ำหนัก" in two label slots y 900–980; glow `#ffe39a` on the "แรง" bar above the "น้ำหนัก" top (y 664–808). No digits, no axis, no ticks, no %.
- **Camera:** `cam: (1.2, 0.6, −2.0), yaw +10→+16, r 2.6→2.4, eye 0.6, f 1050, hy 800, cx +150`. `meas`: ant body (690, 921→931), head x 1004→1035, tail x ≈ 385, feet y 1042→1062, leaf top y 235→188. The plate dims 15% under the card.
- **VO + caption:** NAR L15 onset G1425; caption L15a "ไม่ใช่เพราะกล้ามมันเก่ง… แต่ตัวเล็กลง…" G1425–1500; L15b "น้ำหนักลดเยอะกว่าแรงที่ลดลง เลยมีแรงเหลือใช้" G1500–1595.
- **Sound:** `ui_pop_01` at L 14 and L 20; `whoosh_fast-slide_01` (soft) at L 79 and L 97; NG-M3 building; `reveal_reverse-swell-airy_01` at L 153 (G1574; its 0.8 s rise stops on V07 at G1598, across the cut).
- **Accept:** spike 7 ("แรง" and "น้ำหนัก" legible at 270 px; at the end "แรง" visibly taller; surplus glows); no muscle picture on "ไม่ใช่เพราะกล้ามมันเก่ง".

### S01-B05-SH03 · 1594–1767 · the lift (VD16)

- **Time:** V07 file at G1592 (in-file onset 0.19): gasp G1598–1603 = L 4–9; head turns ant (screen right) → crumb L 10–22 (`turn-head-left`); stands L 18–36; grips C1 at its two grip points L 36–44; L16 G1620–1762 = L 26–168 ("แล้วคุณล่ะ…" L 26–40; "ตัวเล็กขนาดนี้ก็ได้เปรียบเรื่องแรงเมื่อเทียบกับน้ำหนักตัวด้วย" L 58–168); **lift** L 42–54, key L 54 (G1648) in the comma pause; holds high, grinning L 54–173, laugh beat L 100–112. Shade edge x −1.2 → −3.0 L 0–80, crossing her at L 54. Dry from L 54 (sun).
- **Staging (sm):** TINY (−1.75, 0, −0.6) seated → standing, facing +z; C1 from (−2.4, 0.25, −0.6) (resting at her left) to centre (−1.75, 2.25, −0.6) parented to both hands; casting **`woman-bob + new: morning-pyjamas, new: lift-overhead (P45 base, elbows back into depth, DF-20261030-painted-arm-depth), shock → happy → laugh`**, view `front`.
- **Camera:** `cam: T-TINY (−1.75, 1.2, −0.6), yaw −20→−12, r 2.2→2.0, eye 0.7, pitch +8, f 1050, hy 860`. `meas`: TINY x 540, standing 762→838 px (seated 476 at entry, standing-equivalent 762); head top 602→564; feet 1364→1402 (feet in band); crumb top overhead y 222→152; crumb at rest (202→166, ~1265); ant off frame right (1084→1241).
- **VO + caption:** V07 no caption; NAR L16 onset G1620; caption L16a "แล้วคุณล่ะ…" G1620–1652; L16b "ตัวเล็กขนาดนี้ก็ได้เปรียบเรื่องแรงเมื่อเทียบกับน้ำหนักตัวด้วย" G1652–1768.
- **Sound:** riser ends on V07 (L 4); NG-S9 sting at L 54 (mix: hit); NG-M3 warm.
- **Entry → exit:** seated, crumb beside her → standing, crumb overhead. **Accept:** R07 (no flex, no wobble, nothing compares her with the ant); lift labelled dramatization (C15 direction).

### S01-B05-SH04 · 1767–1963 · end frame, glance, fade (VD17)

- **Time:** L17 G1771–1883 = L 4–116 ("โลกใบเดียวกันแท้ ๆ…" L 4–39; "แค่ขนาดตัวเปลี่ยน" L 49–77; "เกมก็เปลี่ยนทั้งเกม" L 84–116); V08 file at G1883 (in-file onset 0.23): G1890–1903 = L 123–136; ant glance (head and antennae toward her, `front` head turn on the `right` body) L 125–137, holds; live hold L 136–196 (breath, blade sway, antenna twitch on G); fade L 172–196 to full black on L 195.
- **Staging (sm):** TINY (−1.75, 0, −0.6) holding C1 overhead (centre (−1.75, 2.25, −0.6)); the ant (+1.2, 0, −2.0) on her right with leaf L1; the balcony slab and tower faint in the haze top centre (below y 160, right of the mark, Boss places); casting **`woman-bob + new: morning-pyjamas, new: lift-overhead hold, happy`**; **`new: ant` + `new: leaf-fragment`, stand → glance (ANT3)**.
- **Camera:** `cam: T-PAIR (−0.3, 1.0, −1.3), yaw −6→−3, r 4.4→4.1, eye 0.9, f 1000, hy 760, cx +40` (SD14), push easing to near-stop by L 136, then static. `meas`: TINY x 195→156, 444→476 px, crumb top y 310→279; ant (850→880, ~880), head x 986→1030, leaf top y 551→534.
- **Look:** warmest frame: low gold sun through the grass forest, backlit blades, gloss on the ant.
- **VO + caption:** NAR L17 onset G1771; caption "โลกใบเดียวกันแท้ ๆ… แค่ขนาดตัวเปลี่ยน เกมก็เปลี่ยนทั้งเกม" G1771–1889. None in the hold.
- **Sound:** NG-M3 resolves under L17 (end chord from ≈ L 116, rings out); V08 L 123; low birds and breeze; everything fades with the picture to digital silence on G1962 (silence policy 3).
- **Ending:** `video.ending: 'A_fade'`, `endHoldSec: 0`, `endFadeSec: 0.8`.
- **Accept:** spike 8 (TINY, crumb and ant read at 270 px; last frame full black); end-frame lead exception recorded.

---

## Boss and Editor handoff (W5.2)

Story first (AGENTS.md): every item was designed from the script; kit entries are used as they are where they match. Status at `713812b` + uncommitted `src/painted/edu05/` (Film inspection 2026-11-06, no render): `exists-unintegrated` = written as episode look-frame code, not in the kit catalog, not in a timeline.

| # | Asset / capability | Casting line (kit vs new) | Status (path) | Consumers | Acceptance |
| --- | --- | --- | --- | --- | --- |
| N1 | Macro grass blades | `new: macro-grass` (parametric ribbons, backlit/shade/MIDLIT palettes, dew beads, wind bend) | exists-unintegrated (`src/painted/edu05/macro.ts`, `paintBlade`); wind bend and parallax unproven | SH04 → SH19 | spike 1: parallax under each camera move; bend ≤ 25% in SH05; harden into the shared kit |
| N2 | Macro sets | `new: SET-MACRO-PLANTER`, `new: SET-GARDEN-GRASS` (moving shade edge x −0.5 → −1.2 → −3.0), `new: SET-DRIFT` (motes, slab band, air) | planter + garden exist-unintegrated (`garden.ts`); drift **missing** | SH04–SH19 | shade edge keyed per SH16/SH18; drift spike 4 |
| N3 | Human-scale sets | `new: SET-BALCONY` (+ look-down facade at yaw 180, SD02), `new: SET-FACADE` + `new: ring marker` | balcony exists-unintegrated (`balcony.ts`); look-down view, facade and ring **missing** | SH01–SH03, SH07 | SH02 cap/mug at top right, slabs converge to (540, 963); SH07 speck + ring at (487–490, 764–703) |
| N4 | Dew drop | `new: dew-drop` D1: rest (a) as LF03 v5; **contact states** (b) dimple + wrap + collar, (c) stretch neck ≤ 0.5 sm (fallback 0.3 not used, R1.1 FR01: she steps back instead), (d) snap + 3-cycle wobble + wet sheen; hand-inside-drop layering | (a) exists-unintegrated (`macro.ts` `paintDrop`, `dropShape`); (b)–(d) and layering **missing** (highest risk, L) | SH09–SH12 | spike 3; area within ±10% across states; never above 1.0× TINY height; patch never leaves `B-DEW` |
| N5 | Props | `new: breadcrumb` C1 (crust, porous crumb, bite state, two grip anchors); `new: leaf-fragment` L1 (as ANT v5) | leaf exists-unintegrated (`ant.ts`); crumb **missing** | SH15–SH19 | crumb parents to both hands (drag, lift); bite mark appears at SH15 L 22 |
| N6 | The ant | `new: ant` (insect body plan, views left/right/front head turn, mandible load anchor) + `new: ant-walk` (tripod gait via `animalMotion`, gait clock by distance) | look exists-unintegrated (`ant.ts`, ANT1–3 v5 user-passed); gait posed only, `ANIMALS` entry **missing** | SH14, SH16–SH19 | spike 6 in 24 f: six feet plant without sliding; leaf upright, sway ≤ 4°; speeds 0.043 sm/f (SH14), 0.07 sm/f (SH16) |
| N7 | Shrink pop | `new: shrink-pop` (card scale-down about a point over 8 f + puff ring + sparkles, matched across a cut) | **missing** | SH03 → SH04 | spike 2: puff centre within ±40 px across the cut (planned Δ 33 px) |
| N8 | Warmth puff | `new: warmth-puff` (world-space, emitted from torso/head anchors, drift, squeeze through fingers) | look exists-unintegrated (`scenes.ts` `paintPuff`); emission/drift/squeeze **missing** | SH14 | spike 5 |
| N9 | Bars card | `new: scale-bars` (card, two bars, label slots, icon, shrink, surplus glow; DF-20261030-painted-straight-bars, DF-20261030-painted-label-slots) | **missing** | SH17 | spike 7; screen boxes as in SH17 |
| N10 | TINY outfit, prop, poses | outfit `new: morning-pyjamas` (`cast.ts`), prop `new: coffee-mug` (`cast.ts` `paintMug`); poses `new: mug-cradle` (P19 base, LF01 v3), `new: drift-spread`, `new: sit-up-check`, `new: brace-heave`, `new: nibble`, `new: drag-back`, `new: clutch-puff`, `new: lift-overhead` (P45 base + prop); effect `new: soft air streaks`. **Pose bases (R1.1; R1.2 FR04–FR07):** `drift-spread` = P45 base, hands lowered to shoulder height and spread wide (CP-P01), palms down, knees soft, toes pointed (front); `sit-up-check` = P33 base, knees up (kit `floorSit`, R1.2 FR04; R1.1 said legs out), alternating hand pats on the opposite forearm then the near knee top, 1 pat / 7 f; the resting hand lies on its own knee inside the silhouette, not out to the side (front); `brace-heave` = P16 profile pull + feet 0.35 sm apart (heel to heel, both feet down; R1.2 FR05: a fixed walk phase + stride, no kit field), lean away 15–20°, left hand clamps the right forearm on each heave (right); `nibble` = P34 kneel base + forward bend (R1.2 FR06; R1.1 P19 standing put the hands and mouth ~0.7 sm above C1's top), both hands flat on C1's top / +x face at y 0.35–0.50 sm, mouth within 0.08 sm of C1's top +x edge (y ≈ 0.5 sm) at each bite peak, head forward 0.05 sm on each bite (left); `drag-back` = P26 base in profile, deep crouch with hands hooked on C1's top +x edge (y ≈ 0.45 sm, R1.2 FR06), lean away 18–22°, walk clock reversed, planted feet with the split visible (left); `clutch-puff` = P42 base, hands cupped at the chest (CP-P02): mittens meet at the sternum, gap ≤ 0.04 sm, above the shirt pockets (R1.2 FR07; the first pass held them outside the torso at the waist), as the puff squeezes out between the fingers (front); `lift-overhead` = P45 + prop (the prop is C1 `new: breadcrumb` parented to both hand anchors in the shot, not part of the pose; R1.2 FR08) | outfit, mug, mug-cradle exist-unintegrated; the other poses and streaks **missing** | all | poses read at 270 px; elbows into depth (DF-20261030-painted-arm-depth) for lift, drag, hug |
| K1 | Shade tint of a rig figure | fold the episode `tintAll` (`cast.ts`: a `Proxy` on `p.brush` routing `fill`/`wash`/`stroke`/`set` through `shadeColor`) into the kit `tintPainter` so rig `solid` fills take the tint | exists-unintegrated (episode fix); kit gap | SH13–SH15 (shade), SH12 end | LF04 v5 skin/hair values reproduce through the kit path; puffs stay untinted |
| — | Kit used as is | `woman-bob` (`PEOPLE`); poses P12, P16, P19, P33, P39, P42, P45; motions `turn-head-left/right`, `shiver`, `idle-breathe`; expressions `sleepy`, `surprised`, `scared`, `happy`, `laugh`, `worried`, `sad`, `tired`, `shock`, `disgusted`, `angry`; `wet: true` look; `ycam.ts`, `views.ts` `squareToCam`; ENV-FALL `dust`, `glow.tsx` `Shafts`/`Flash`, `sky.ts`, `fog.ts`; `video.ending 'A_fade'`, `captionStyle.bottomEdgeY` | existing-integrated (per brief, read at `713812b`) | per shot | — |

**Kit intake at delivery (KIT-P01):** `macro-grass`, `dew-drop`, `ant` + `ant-walk`, `breadcrumb`, `leaf-fragment`, `shrink-pop`, `warmth-puff`, `morning-pyjamas`, `coffee-mug`, `mug-cradle` (and the other poses if Boss builds them reusable) into the catalog; SET-BALCONY and SET-GARDEN-GRASS into `PLATES`; `tintAll` folded into `tintPainter` (K1).

**Dependency order for Boss:** (1) K1 tint fold + N1 parallax + N2 garden shade edge (most shots); (2) N4 deform states (b)–(d) + layering (spike 3, highest risk); (3) N6 gait; (4) N7 pop + N3 look-down/facade; (5) N8 puff motion; (6) N5 crumb + N10 poses; (7) N2 drift + streaks; (8) N9 bars.

**Editor:** (1) VL-DEF-01 re-split first; (2) register the composition (README: videos and parallel work), 1963 f; (3) blockout by scene in shot order with placeholders where Boss items are missing; (4) place voices at the stated onsets (one assembled narration wav is fine, as EP04); (5) captions per the shot blocks; (6) sound per the blocks, NG-* generated via the `sound-generation` skill (one seed/prompt family for NG-M1–M3). Representative sample proposal: S01-B03-SH02 G700 (hand in the drop) and S01-B01-SH03/SH04 G200–216 (pop cut).

## Dependencies and open items

| Owner | Dependency / acceptance | Status |
| --- | --- | --- |
| Editor | VL-DEF-01: re-split L02–L17 from the full read, ear + `volumedetect` check | open (blocks audio placement) |
| Editor | UB-1 / UB-2 ear check of the L14/L15 and L15/L16 splits; shift SH16/SH17 cues by Δ if needed | open |
| Editor | NG-M1–M3, NG-S1–S9 generation (none generated); ear-check the library one-shots (all "not listened") | open |
| Boss | N1–N10, K1 per the table | open |
| Film | review Editor's blockout frames against these sheets (W5.3) | waiting |
| User (non-blocking) | the open questions below | open |

Element captures: the approved look stills are the element captures (store `~/ReelsStore/projects/EDU/previews/look-frames/ep05/v3/` LF01, `v1/` LF02, `v7/` LF03, LF04, ANT1–3; asset/source revision `src/painted/edu05/` uncommitted at `713812b`; limitations: stills only, no motion, deform states and gait not shown). No new captures made in this pass.

**Open questions for the user (non-blocking; Film defaults applied):**
1. Length 65.4 s, at the top of the accepted 61–65 s. Keep, or take the listed tightenings (up to −0.75 s)? Default: keep.
2. V04 tight edit (2.75 s) instead of the 3.90 s trim the user heard. Default: tight.
3. L08 subtitle "ทำไมน้ำมันเหนียวแบบนี้!" while Whisper heard "ทำไมมันเหนียวแบบนี้" in take t1 ("น้ำ" may be swallowed, voice-notes section 4). Default: the script text; the user listens once in the Draft.

## Change log

- **2026-11-07 EDU-EP05-SHEETS-R1.2 (Film, review of Boss's N10 first pass, `src/painted/edu05/poses.ts` at 722410b, stills `out/edu05/w52/n10/POSES_*`):** verdicts: `drift-spread` pass (toes not pointed; unread at 270 px, accepted); `lift-overhead` pass; `brace-heave` pass on lean/arms, stance fix; `sit-up-check`, `nibble`, `drag-back`, `clutch-puff` fix. **FR04** `sit-up-check` keeps the kit `floorSit` knees-up sit (reads as sat-on-the-ground and gives a near knee to pat; no kit change); resting hands move from out-wide (r `[-0.2, -0.24]`, l `[0.2, -0.24]`, est) onto their own knee, about r `[0.03, -0.30]`, l `[-0.03, -0.30]` (est; accept: no hand outside the silhouette at rest). **FR05** stance 0.35 sm for `brace-heave` without a kit field: a fixed `walk` phase with `stride` tuned until heel-to-heel = 0.35 sm with both feet down (start `walk 0.25`, `stride 0.5`, est; measure in one still); clamp checked in a 24 f strip (L 0–24, 2 heaves). **FR06** C1 is ≤ 0.6 sm tall (top ≈ 0.5 sm) against TINY 1.58 sm, so the standing `nibble` (hands at chest, ≈ 1.1 sm) and `drag-back` (hands ≈ 0.95 sm, lean 0.2 rad reads nearly upright) cannot touch it: `nibble` becomes P34 kneel + bend (start `bend 0.7`, est), hands on C1's top/+x face at y 0.35–0.50 sm, mouth within 0.08 sm of the top edge at the bite peak; `drag-back` gets a deep crouch (start `crouch 0.45`, est) with hands at y ≈ 0.45 sm and lean magnitude 0.35 rad (≈ 20°, same away sign as now), stride ≥ 0.6 so the split reads; Boss checks both against a 0.85 × 0.50 sm stand-in box in the B04-SH03 camera. **FR07** `clutch-puff` hands cross inward (+x = screen right in `front`): r `to [+0.10, -0.12]`, l `to [-0.10, -0.12]`, via r `[-0.04, -0.22]`, l `[+0.04, -0.22]`, `behind: 'upper'` kept (CP-P02) (est; accept: mittens meet at the sternum, gap ≤ 0.04 sm). **FR08** the `lift-overhead` crumb is shot work (C1 parented to the figure's hand anchors in B05), not a kit or pose change; Draft proceeds without a kit change for all three Boss gaps.
- **2026-11-06 EDU-EP05-SHEETS-R1.1 (Film, rulings on Boss W5.2 sheet findings, build-notes N4 and the SET-DRIFT note):** **FR01** keep the 0.5 sm neck (the stretch is the beat and reads in Boss's g2 stills; 0.3 weakens it): TINY backs off two planted steps in SH02 to (0.75, 0, −0.74) and braces at (0.76, 0, −0.72) in SH04, SH02 camera widened to (1.5, 1.0, −0.85) r 2.3→2.4 so she (708–760 px) and the drop (top ≥ 216) both hold; SD07, N4 updated. **FR02** SH03 re-aimed at (1.55, 1.3, −0.95): the wrist sits at the neck tip left of D1's body, `meas` re-projected from `dropGeometry`; SD08 updated. **FR03** drift motes 0.06 sm/s (≈ 26 px/s): the screen speed is the intent (dramatized slow, < 40 px/s), Boss's 27 px/s cap matches. N10 pose bases added for the six new poses. Timing, frame ranges, IDs, narration and captions unchanged; review-rows.json SH02/SH03/SH04 `seen` and eyebrow updated. Evidence: projections only (est ±5 px), no render.
- **2026-11-06 EDU-EP05-SHEETS-R1 (Film W5.1):** first timed scene sheets from the W4 voice lock: 19 shots with the storyboard IDs, 1963 f = 65.43 s; integer frames for every voice, phrase, event, sound and caption cue; staging deviations SD01–SD15 from the approved looks and a ycam-mirror projection run; Boss list N1–N10 + K1; voice-lock defect VL-DEF-01 (split files silent) found and handed to the Editor; review rows gain `start`/`end` frames (no content change).
