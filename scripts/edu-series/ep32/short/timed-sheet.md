# E32-C01-S01 — CIA's spy cat, timed scene sheet (B01–B06, 19 shots)

Deliverable: `EDU-EP32-SHORT` · Revision: **`EDU-EP32-SHEET-R1`** · Status: **ready-for-dev** · Timing: checked-with-audio (the r2 measure plus Film's per-line Whisper word onsets; **not ear-checked**)
Inputs: [EDU-EP32-SCRIPT-R1](script.md) (locked, L01–L14) + [EDU-EP32-FACT-R1](fact-check.md) · [EDU-EP32-BRIEF-R3](film-brief.md) (VD32-01–VD32-30) · [EDU-EP32-BOARD-R3](storyboard.md) incl. [R3 camera keys](storyboard.md#r3-camera-keys) · voice lock [EDU-EP32-VOICE-R2](voice-measure-r2.md) / [json](voice-measure-r2.json) · delivery record [../delivery.md](../delivery.md) (to Editor's voice lock r2) · [fix list](../fixlist.md)
Target: branch `claude/pets-dogs-cats-exotic-9ef1fd` at `fca9cc3` plus the uncommitted EP32 work (`src/painted/edu32/`, `src/videos/edu32-gates/`, `src/painted/shots/edu32.tsx`) · 30 fps · **durationFrames 1689** (speech ends G1636, L14 file end G1641, hold 48 f) · 1080 × 1920 portrait · composition offset 0
Evidence: runtime unverified (no production composition yet; gates only) · render/samples: gate stills and the LF-BR draft clip (store `projects/edu/EDU/looks/EP32-*`) · audio/subtitle sync: measured read only (envelope on/off and pauses from the r2 measure; word onsets from Whisper large-v3-turbo per line file, about ±6 f, log `out/logs/ep32-words-lines.json`, cache) · projections: kit `camPoint` via [timed-projection.ts](timed-projection.ts) (log `out/logs/ep32-timed-projection.log`) · user approval: all W3 looks passed, voice x1.00 approved 2026-11-21; this sheet not yet reviewed. Review page: pending.

## Intent and continuity

Before → after: from f0 the viewer sees a paper cat wired up on a spy blueprint (hook) and learns the CIA really did it; the plan is a neat paper model (B01–B02); on "แต่" the camera dives into the model and it becomes a real field where the real cat picks the sun over the target (B03); it walks off when hungry, the team "adds more wire" behind a closed door, a bowl would have done (B04); the real memo calls it a remarkable achievement and stamps it impractical (B05); the CIA page agrees and the real cat sleeps on the memo where the paper cat stood, ending on the stamp (B06). Concealed until its line: the sun (L07), the memo (L11), the stamp (on "ใช้งานจริงไม่ได้"), the CIA page (L13), the real cat on the real desk (B06-SH02). Never on screen: the [brief list](film-brief.md#visual-intent) (vehicle, surgery, a transmitter on the body, a printed date, invented memo or web text, "TOP SECRET", the CIA logo, a light seam behind the door, a hand placing the cat). No cat on screen from B04-SH01's exit (G980) to B06-SH02 (G1583).

Previous scene: none. Next: none (one-scene Short). No time card; the bridge (B03-SH01) is the only transition that is not a hard cut.

### Clocks and conventions

- **G** = composition frame (offset 0). **L** = shot-local frame = G − shot start. Ranges half-open `[start, end)`. Seconds → frames `floor(s × 30 + 0.5)` on the r2 timeline (0 = L01 file start).
- Anchors: `env` = speech on/off or pause edges from the r2 envelope (±1 f); `W` = Whisper word onset (±6 f); `est` = no anchor. Events on `W` anchors carry ±6 f; Editor may move them to the nearest envelope dip without a sheet revision.
- **Spaces** (brief: [set plans](film-brief.md#set-plans-metres-estimates)): Space D (desk, model metres 10:1, origin lamp hot spot on the desk top, +x right, +y up, +z toward the master camera), Space F (field, metres, laid 1:1 on page P, [plan](film-brief.md#space-f)), Space C (corridor, metres, origin door threshold centre, door wall z 0, [plan](film-brief.md#space-c)). Camera line: `cam: eye (x, y, z), yaw° (0 looks −z, + toward +x), pitch° (+ up), f px, hy` (`hy` = horizon row as lens shift; kit `YCam`). Screen: px, origin top left, Y down.
- **Projection owner:** one `YCam` per plate (painted canvas and every camera-mapped DOM quad); screen layers (callouts, `Stamp` slam, `Grade`/`Grain`, caption shade, mark and label) on top ([brief projection contract](film-brief.md#technical-handoff)).
- **Baseline:** kit people (four heads, 1.70–1.78 m); cat `catDef` (`cat-gray-tabby`, height 0.25 m, `soft`, `fluffy`) at ×4 hero paper, ×1.6 diorama paper and real, ×16 desk real (VD32-04). Measured anchors: sitting ×1.6 cat 233 px and loaf 234 px at the B03-SH03 R2 keys (LF03R / LF03R-END); bridge cat 185 → 300 px (LF-BR); desk cat 508 px (LF04). Kit `camUnit` × 0.40 m under-reads the sitting cat by about 1.4 (finding F4); loaf = 0.82 × `camUnit` × 0.40 m.
- **Chrome:** `@TamMaiLa` top left for the whole clip (mark box x 120–240, y 128–160; clearance rule: no head or face inside x 100–260, y 110–180). Label "เรื่องจริง เล่าแบบขำ · ภาพและบทพูดจำลอง" under it at full opacity **G0–G89**, fades G90–G97, gone from G98, never back (VD32-14, user Q2). No "ฉากจำลอง" tag (Q6).
- **Captions** (VD32-29, Editor builds): EP26 look, `CAPTION_SCALE` 1.4 (71 px), one line per card, bottom edge y 1344, pop-in (`captionPose`), safe box x 120–888; cards planned in [Caption cards](#caption-cards). Staging band y 1230–1344: faces, the cat and hero props stay above y 1200 in every shot.
- **Hands:** mittens throughout; the only hand work is the AGENT's radio and point in B03-SH02 ([hand-drawing skill](../../../../.claude/skills/hand-drawing/SKILL.md)).

## Baseline and assets

| Asset / capability | Owner path (checkout above) | Status | Gap / consumer |
| --- | --- | --- | --- |
| Paper desk D, page BP and P, paper cast, `paper-card` treatment | `src/painted/edu32/desk.ts`, `cast.ts`, `looks.ts`; `src/painted/kit/paper-card.ts` | exists-unintegrated (LF02-r2) | page BP (blueprint) not painted as a still; B01 callouts; G1, G2 |
| Bridge: two plates PA/PB on one camera, fold, crossfade | `src/painted/edu32/bridge.ts` (`bridgeCam`, `BRIDGE`, `paintBridgePA/PB`), `PaintedShot.crossfade` | exists-unintegrated (LF-BR draft clip) | **`BRIDGE_CAM1.hy` is still 680 in code; R3 = 820** (Boss sets it); G3 |
| Field F: bench, trees, mannequins, sparrow pose, sun patch, light `overcast`/`sun` | `src/painted/edu32/field.ts` (`SF`, `SUN_DIR`) | exists-unintegrated (LF03R, LF03R-END) | overcast → sun transition over 16 f, sparrow land/tail-bob, step-down: **missing**; G4 |
| Real cat states: sit, walk, `CAT_LOAF`, get-up, `look-left-right`, `lie-down` | kit `animals.ts`, `animal-motions.ts`; `edu32/looks.ts` `CAT_LOAF` | existing-integrated (kit); EP32 dressing exists-unintegrated | cat **step-down** from 0.345 m and **ear flick** missing; G1, G4, G7 |
| AGENT real with radio + point | `edu32/cast.ts` (LF03R-AGENT still) | exists-unintegrated (character still, not this camera) | radio pose P20 mirrored + P05 at the B03-SH02 camera; G4 |
| Corridor C, door, sign, steel bowl | `edu32/corridor.ts`, `corridor-text.tsx` | exists-unintegrated (LF05, LF05-BOWL) | door close and sign swing **missing**; dressing moves for the R3 key; G5 |
| Office D real dressing, memo text, page stamp, sleeping cat, DOM cat hole | `edu32/office.ts` (`MEMO`, `MEMO_STAMP`, `CAT_DESK`, `catHole`, `CAM_B06_KEY`), `office-text.tsx` | exists-unintegrated (LF04) | type-on and redaction bars **missing**; printout page W **missing**; G6, G7 |
| Screen `Stamp` slam, `Grade`, `Grain` | kit `stamp.ts`, `screen.tsx` | existing-integrated | — |
| Camera-mapped DOM text | `src/scenes/quadText.ts` | existing-integrated | memo, printout, sign |
| Captions EP26 look (`captionPose`, `CaptionShade`) | `src/painted/edu26/captions26.ts`, `src/videos/edu-ep26/chrome.tsx` | existing-integrated for EP26; EP32 card data missing | Editor reuses the pattern with EP32 data |

Findings: DF-20261029-painted-timeline-dissolve (bridge crossfade; B03-SH01 revalidates it for two sets on one camera), DF-20261030-painted-screen-layers-overlay (`Grade`/`Grain` per plate), DF-20261116-painted-seated-card-low-in-cabin (seated men and mannequins), DF-20261030-painted-layer-order (paper card edge first), DF-20261031-painted-raster-card (memo is retyped DOM text). Fallbacks are in the shot blocks.

## Shot map

Runtime mapping: planned, one painted `shots[]` entry per row in this order (B03-SH01 = one shot with plates PA, PB). Sum check: 19 shots, 1689 f.

| Shot | Beat / line | G `[start, end)` | Frames | Claims / clues | Build | Boss group |
| --- | --- | --- | ---: | --- | --- | --- |
| `B01-SH01` | B01 L01a | [0, 81) | 81 | hook; F001, F002 spoken | hard | G1 |
| `B01-SH02` | B01 L01b | [81, 229) | 148 | F001, F002 dressing (ear mic, transmitter in the body, antenna in the fur) | easy | G1 |
| `B01-SH03` | B01 L02 | [229, 328) | 99 | CL01 plant (cat ignores us; mirror key) | hard | G1 |
| `B02-SH01` | B02 L03 | [328, 436) | 108 | plan (F001, F013) | hard | G2 |
| `B02-SH02` | B02 L04 | [436, 500) | 64 | F001 idea (AGENT line not factual) | hard | G2 |
| `B02-SH03` | B02 L05 | [500, 574) | 74 | CL02 plant (cat works for no one) | hard | G2 |
| `B03-SH01` | B03 L06 + gap | [574, 646) | 72 | F005 (field tests happened) | hard | G3 |
| `B03-SH02` | B03 L07a | [646, 689) | 43 | F012 invented gag | hard | G4 |
| `B03-SH03` | B03 L07b + L08 "CIA ยอมรับเองว่า" | [689, 786) | 97 | F012 sun gag (Q7); F005 opens | hard | G4 |
| `B03-SH04` | B03 L08 rest | [786, 880) | 94 | F005 CIA admission | easy | G4 |
| `B04-SH01` | B04 L09a | [880, 993) | 113 | F007 (ex-officer's account) | hard | G4 |
| `B04-SH02` | B04 L09b | [993, 1072) | 79 | F007 more wiring (never shown) | easy | G5 |
| `B04-SH03` | B04 L10 | [1072, 1131) | 59 | — | easy | G5 |
| `B05-SH01` | B05 L11a | [1131, 1210) | 79 | F004 memo 1967 (pencil "3-67") | hard | G6 |
| `B05-SH02` | B05 L11b | [1210, 1327) | 117 | F004 quote | easy | G6 |
| `B05-SH03` | B05 L12 | [1327, 1411) | 84 | F004 "would not be practical" | easy | G6 |
| `B06-SH01` | B06 L13 | [1411, 1583) | 172 | F005 CIA page (O3 open) | easy | G6 |
| `B06-SH02` | B06 L14 + hold 10 f | [1583, 1651) | 68 | CL01 payoff (mirror) | hard | G7 |
| `B06-SH03` | hold 38 f | [1651, 1689) | 38 | F004 stamp legible | easy | G7 |

Cut placement: every cut sits in a measured pause, a line gap or an envelope dip; the cuts not on a line file start are B01-SH01|SH02 (G81, middle of the 0.28 s L01 pause G77–G85), B03-SH02|SH03 (G689, in the L07 pause G686–G696), B03-SH03|SH04 (G786, word gap before "แมว" W788), B04-SH01|SH02 (G993, L09 pause G990–G999), B05-SH01|SH02 (G1210, envelope dip between "CIA" and "เรียก", peak 5.8k vs 20k+ around it) and the hold split G1651.

## Bridge frame map (VD32-18, fitted to L06)

The r2 lock gives L06 file start G574 to L07 speech G654 = **80 f** (L06 1.86 s plus the 0.8 s gap). The brief's 72-frame bridge fits with **8 f to spare, no trim**: B03-SH01 runs [574, 646) and the bridge frame `F` = L (identity), so `bridgeCam(F)`, `bridgeFold(F)` and `BRIDGE` in `edu32/bridge.ts` are used as built (`BRIDGE_N` 72, PB `fromSec` 0.8 s = F24). The 8 spare frames go to B03-SH02 as a radio key-up before the AGENT speaks.

| F (= L) | G | Picture | VO / sound |
| ---: | ---: | --- | --- |
| 0 | 574 | gate camera, paper P' (LF02 frame), dive starts eased | L06 file start; sly bass still on |
| 9 | 583 | dive under way | "แต่" (env); sly bass stops |
| 16–32 | 590–606 | — | page-turn air rush (C09) over "ปล่อยลง" (W590–W596) |
| 20–40 | 594–614 | tree cards fold down outward 0 → 75° | — |
| 24–40 | 598–614 | crossfade PA → PB; grade poster → real | paper park bed (A2) fades out; field bed (A3) opens; "สนาม" W601 lands mid-dissolve |
| 40–53 | 614–627 | real cat looks up and around once (head only, `look-left-right` first half) | "ทดสอบ…" W607–W620; mission ticks (M3) start F40 |
| 62 | 636 | camera at `BRIDGE_CAM1` (hy **820**) | L06 speech off G630 (env) |
| 62–71 | 636–645 | drift: push 0.05 m toward the cat, yaw −10 → −8 | silence of the 0.8 s gap, field bed only |
| 72 | 646 | hard cut to B03-SH02 | radio key-up (C10) |

Coincidence check (projection at hy 820, same camera for both plates): the cat foot anchor (0, 0.345, −0.3) goes (582, 587) F0 → (532, 711) F24 → (514, 781) F32 → (508, 847) F40 → (528, 931) F62 → (493, 931) F71; bench foot L (−0.95, 0, −0.18) (318, 666) F0 → (37, 1103) F62. Both plates evaluate `bridgeCam(F)`, so PA and PB coincide by construction; the 4 px tolerance is a check on the art anchors (paper cat card foot vs real cat foot, bench line), measured by Boss on F24, F32, F40 frames. At hy 680 (current code) the F62 cat foot sits at y 791 and the hat at y 97 (R2 crop): the code must change before the plate.

## B01-SH01 — the hook glide to the wired paper cat

Range: G [0, 81); L0 = G0.
Direction: spy-movie glide low over the night desk to the blueprint folder in the lamp pool; frame 0 already shows the hero paper cat on the cyan blueprint (hook proof). Stamp and pencils pass as a near layer. Lead: the cat, centre-right, growing.
Staging: | Entity | Space D | Start | End | Facing |
CAT hero paper ×4 (`catDef(4)` card, `sit`, proud; ear-mic r2 capsule + copper thread) | ground (+0.3, 0, −0.2) on page BP | static, blink at L40 | — | profile, faces −x |
Near layer: stamp and pad (+3.0, 0, +1.8), pencils along z +2.4 | | pass screen-left L0–L50 | | |
Camera: `cam: eye (+3.8, 0.9, +3.6), yaw −46, pitch −12, f 900, hy 700` at L0 → `eye (+1.3, 0.75, +1.7), yaw −35, pitch −12, f 900, hy 700` at L80, ease-in-out. Owner: world camera. Projection (R3, proj): cat 251 px at L0 (y 416–667), 615 px at L80 (y 202–817); no head in the mark box.
VO + subtitles: L01 part "CIA หน่วยสืบราชการลับที่เก่งที่สุดในโลก…" G1–G76 (env on G1; pause G77–G85). Cards L01a–L01c.
Sound: M1 spy-jazz theme in full swagger from L0 (NEEDS-GEN: original 1960s spy jazz, muted trumpet lead, bongos, walking upright bass, twangy surf-guitar lick, vibraphone, 116 bpm, minor, confident and a little cheesy; delivered as sections so it can cut dead). A1 evening office room tone with faint lamp-bulb hum (NEEDS-GEN; small wood-panelled office at night, very quiet, steady loop). No SFX at L0. Music ducks under the narration.
Mix intent: hit L0 (theme downbeat with the first picture); hold.
Caption band: walnut desk front edge and felt in y 1230–1344 (LF02 old-band luma 0.351, above the 0.25 outline threshold): Editor `CaptionShade` 0.3 (est) until Boss measures.
Cut: hard cut at G81 (middle of the L01 pause).
Build: hard — first build of the hero paper cat ×4 with dressing; start from `edu32/cast.ts` (card placers, `earMic`, `paintCatDressingProfile`), `kit/paper-card.ts`, `edu32/desk.ts`; casting `cat-gray-tabby {fluffy, soft} ×4 paper + new: ear-mic + new: antenna-thread, sit, proud`.
Entry → exit: entry: wide night desk, cat small in the lamp pool; exit: cat profile 615 px, blueprint behind.
Acceptance: | G | Observable | Evidence |
G0 | cat card on the blueprint readable at 540 px; mark + label visible; nothing in the mark box | frame |
G80 | cat 560–680 px tall, ears below y 230 | frame + `caption-zone.py` |

## B01-SH02 — the blueprint callouts

Range: G [81, 229); L0 = G81.
Direction: the hero cat held in profile; three screen-space callouts appear one per phrase, each from its anchor. No line touches the tail; no organ, outline or wound.
Staging: CAT hero paper ×4 as B01-SH01 end (`sit`, blink only, L60 and L120). Callouts (screen space, anchored with `camPoint` each frame; ink navy line + cream label card, kit fonts):
- CO1 ear circle 60 px on the ear-mic anchor, then label "ไมค์ · ในหู" — draws L32–L44 (G113 "ไมค์ที่หู" W107–W126).
- CO2 small box beside the torso, label "เครื่องส่ง · ในตัว", dashed arrow to the torso centre — L65–L77 (G146 "ฝัง" W146).
- CO3 the back-fur thread lights up shoulders → hips over L104–L124, label "เสาอากาศ · ถักในขน" at L110 (G185 "ถัก" env pause end G187, W185).
Labels stay above y 1100 and inside x 120–960; all three remain to the cut.
Camera: `cam: eye (+0.3, 0.55, +1.5), yaw 0, pitch 0, f 900, hy 680` at L0 → `eye (+0.65, 0.55, +1.35), yaw −8, pitch 0, f 900, hy 680` at L147, linear truck with ease-out on the last 20 f. Projection (R3, proj): cat 741 → 796 px, ears y 230 → 197, paws y 971 → 993.
VO + subtitles: L01 part "เคยผ่าตัดใส่ไมค์ที่หูแมว ฝังเครื่องส่งในตัว ถักเสาอากาศไว้ในขน" G85–G227 (env off G227). Cards L01d–L01g.
Sound: M1 continues. C01 ×3 at L32, L65, L104: an ink pen scratching a short line on drafting paper, then a tiny glassy "ping"; close and dry, 0.5 s each; the third ping a step higher; feels clever and smug (NEEDS-GEN, one file with three takes). A1 continues under.
Mix intent: lift each ping a little; music holds.
Caption band: blueprint cyan page (est luma 0.30–0.40): `CaptionShade` 0.3 (est).
Cut: hard cut at G229 (L01 file end); M1 **cuts dead** on this frame.
Build: easy — static cat plus screen-space SVG callouts on `camPoint` anchors; start from the B01-SH01 plate, `kit/ycam.ts`.
Entry → exit: entry = B01-SH01 exit framing pushed in; exit: three callouts on screen.
Acceptance: G113 CO1 starts drawing (frame); G146 CO2 (frame); G185 CO3 thread lit from the shoulders (frame); no callout line within 20 px of the tail (frame).

## B01-SH03 — the cat ignores us (CL01 template)

Range: G [229, 328); L0 = G229.
Direction: the topper. The cat yawns on "แมว ใช่", lies down on "ตัวที่เรียก" still facing screen-left, the camera pushes with it to the mirror key, one ear flicks back on "ไม่เคยมา". Dry; one bored mrrp.
Staging: CAT hero paper ×4 at (+0.3, 0, −0.2), profile facing −x: `sit` → yawn L9–L45 (mouth peak L28, inside the L02 pause G254–G269) → kit `lie-down` L52–L67 (on "ตัวที่เรียก" W281) → settled `lie` → `new: ear-flick` (near ear rotates back 35° and returns) L68–L76 (on "ไม่เคยมา" W297).
Camera: `cam: eye (+0.3, 0.6, +2.0), yaw 0, pitch −2, f 900, hy 520` held L0–L51 → push eased L52–L77 to `eye (+0.3, 0.5, +1.25), yaw +3, pitch −2, f 900, hy 460` (`CAM_B01_KEY`), held to the cut. Projection: sitting 575 px (y 157–732, proj); lying 508 px (y 219–728, measured LF04-REF). **Mirror reference for B06-SH02 = the L77 key.**
VO + subtitles: L02 "แมว ใช่ ตัวที่เรียกแล้วไม่เคยมาน่ะแหละ" G238–G318 (env). Cards L02a–L02c.
Sound: music out (M1 cut at G229). Room tone A1 alone for 9 f before "แมว". L02 dry. C02 at L89 (G318): one bored "mrrp", a short rising trill **0.35 s max** (ends by G329, before L03 starts at G329), unbothered and not friendly (`creature_cat-mrrp_01` candidate trimmed to 0.35 s if Ton's fit check passes, else NEEDS-GEN; the same file is the callback in B06-SH02).
Mix intent: drop (silence after the theme) then hit the mrrp.
Caption band: blueprint and felt: `CaptionShade` 0.3 (est).
Cut: hard cut at G328.
Build: hard — `lie-down` + yawn + `new: ear-flick` on the paper cat; start from kit `animal-motions.ts` (`lie-down`), `edu32/office.ts` `CAM_B01_KEY`, `paintB01Ref`.
Entry → exit: entry sitting cat, camera held; exit cat lying in `CAM_B01_KEY`, ear back at rest.
Acceptance: G257 yawn at its widest (frame); G296 cat settled, push still moving until G306; G297–G305 ear flick (frame); LF04-REF overlay at G306 within ±8 % (frame).

## B02-SH01 — the plan as a pop-up model

Range: G [328, 436); L0 = G328.
Direction: page P slides in and the park pops up during "แผนคือ…"; on "แมว" the diorama cat slides along a paper slot onto the bench between the two men, who talk over its head. Key state at L100 = LF02-r2.
Staging: FOREIGN AGENT paper (`man-crop + new: trench-1960s`, seated, `talk`) at (−0.6, 0, −0.1); HANDLER paper (`man-buzz + new: trench-1960s grey + new: fur-hat`, seated, `talk`) at (+0.62, 0, −0.1); CAT diorama paper ×1.6, `sit`, front: slides from (+1.3, 0.345, −0.3) to the seat (0, 0.345, −0.3) L32–L46 (on "ให้แมว" W354–W364). Page P slides in from screen-right L0–L8; pop-up flaps rise L4–L22 (snap ripple); tree cards (−1.8, 0, −1.2) h 2.4 and (+1.7, 0, −1.3) h 2.2.
Camera: `cam: eye (+1.7, 1.15, +3.1), yaw −31, pitch −18, f 1100, hy 700` at L0 → `eye (+1.45, 1.0, +2.7), yaw −28, pitch −17, f 1100, hy 700` at L100 (the gate camera, VD32-25), ease-out; hold L100–L107. Folder front edge, felt and walnut visible under the pop-up.
VO + subtitles: L03 "แผนคือ… ให้แมวไปแอบฟังสายลับคุยกับหัวหน้าฝั่งโซเวียตในสวน" G329–G431 (env). Cards L03a–L03d.
Sound: M2 sly section of the theme (walking bass and brushes) in at L1. A2 park birds and breeze played thin and high-passed as if from the page (`outdoor_park-birds-breeze_01` candidate, high-pass). C04 at L0: a stiff card folder slid across felt, dry, 0.5 s. C05 at L4: stiff card flaps snapping upright in a quick ripple, close, 0.6 s, playful. C06 at L32: a light card sliding in a paper slot, 0.4 s.
Mix intent: lift the snap; hold M2 low under the line.
Caption band: felt and folder front (LF02 framing): `CaptionShade` 0.3 (est; LF02 old-band 0.351).
Cut: hard cut at G436.
Build: hard — pop-up rise and the cat slide on the LF02 set; start from `edu32/looks.ts` (`paintParkPopUp`, `BENCH_P`), `edu32/cast.ts`.
Entry → exit: entry page arriving; exit = LF02-r2 framing, cat on the seat between the men.
Acceptance: G360–G374 cat slides onto the seat (frame); G428 matches LF02-r2 within 10 px on the bench line (frame).

## B02-SH02 — "ไม่มีใครระแวงแมวหรอก"

Range: G [436, 500); L0 = G436.
Direction: the smug AGENT in paper on the blotter beside page P, the pop-up behind him screen-right with the cat small and lit on the bench.
Staging: AGENT paper `man-parted + new: agent-1960s, P09 (hands on hips), smug`, front, at (−1.6, 0, +1.0); empty mittens; `talk` mouth L4–L48; one eyebrow lift at L40.
Camera: `cam: eye (−1.5, 1.25, +3.2), yaw −3, pitch 0, f 900, hy 560` → `eye (−1.35, 1.25, +2.9), yaw −6, pitch 0, f 900, hy 560` L0 → L63 eased. Projection (est): AGENT 695 → 805 px, face y 380–480, clear of the mark box (x > 300).
VO + subtitles: L04 AGENT "ไม่มีใครระแวงแมวหรอก" G440–G484 (env). Cards L04a–L04b.
Sound: M2 continues, lower. A2 lower. Voice clean (Algenib). C07 at L49 (G485): a smug two-note muted-trumpet "ta-daa", small, self-satisfied, dry, **0.5 s** (ends by G500) (NEEDS-GEN).
Mix intent: hit C07 after the line.
Caption band: blotter felt (est luma 0.25–0.35): `CaptionShade` 0.25 (est).
Cut: hard cut at G500.
Build: hard — new paper AGENT card (P09); start from `edu32/cast.ts` card placers, kit `poses.ts` P09, `kit/paper-card.ts`.
Entry → exit: AGENT smug, hands on hips, throughout.
Acceptance: G485 C07 lands after "หรอก" (sync); face above y 520 (frame).

## B02-SH03 — "ก็จริง…" the cat yawns

Range: G [500, 574); L0 = G500.
Direction: close on the diorama cat between the two men (cropped at the edges); it looks at one man, the other, then yawns wide.
Staging: CAT diorama paper ×1.6, front, on the seat (0, 0.345, −0.3): look left L4 (on "ก็จริง" W504), look right L14; dead air (pause G518–G527); yawn L36–L58 (on "ไม่ทำงานให้ใคร" W534–W553), mouth peak L44; hold. Men `talk`, cropped.
Camera: `cam: eye (+0.1, 0.62, +1.25), yaw −2, pitch 0, f 950, hy 740` → `eye (+0.1, 0.62, +1.05)` L0 → L73 eased. Projection (R3, proj): cat 342 → 393 px, y 566 → 933; FOREIGN AGENT head out of the mark box.
VO + subtitles: L05 "ก็จริง… เพราะแมวไม่ทำงานให้ใครอยู่แล้ว" G507–G566 (env). Cards L05a–L05c.
Sound: M2 stops for the pause G518–G527 (half a beat of dead air), walking bass resumes on "เพราะ" G527. C08 at L40: a tiny cat yawn, airy then a high squeak, close, 0.6 s, bored (NEEDS-GEN). A2 thin.
Mix intent: drop at G518, release at G527.
Caption band: bench front and lawn card (est 0.35): `CaptionShade` 0.3 (est).
Cut: hard cut at G574 (L06 file start) into the bridge.
Build: hard — paper cat `look-left-right` + yawn, men `talk`; start from kit `animal-motions.ts`, `edu32/looks.ts`.
Entry → exit: exit: cat mouth closed after the yawn, looking front.
Acceptance: G544 yawn peak (frame); no head inside the mark box at L0 or L73 (frame).

## B03-SH01 — the bridge: paper → real

Range: G [574, 646); L0 = G574; bridge frame F = L ([frame map](#bridge-frame-map-vd32-18-fitted-to-l06)).
Direction: the episode's one large move. From the gate camera on page P', the camera dives into the model to the cat's eye height; tree cards fold away; the room becomes overcast sky; the paper men's faces fade into blank mannequin heads in the same coats; the paper cat becomes the real cat at the same anchor and size. The real cat looks up and around once on "ทดสอบ…".
Staging: PA (Space D page P'): FOREIGN AGENT and HANDLER paper seated `talk` F0–F40; CAT diorama paper `sit`, blink F10. PB (Space F, same numbers): MANNEQUIN L (tan trench) at (−0.6, 0, −0.1), MANNEQUIN R (grey trench + fur hat) at (+0.62, 0, −0.1), seated front; CAT real ×1.6 `sit` front at (0, 0.345, −0.3), head look F40–F53. Real trunks at the card positions. Overcast.
Camera: `bridgeCam(F)`: `cam: eye (1.45, 1.0, 2.7), yaw −28, pitch −17, f 1100, hy 700` at F0 → `eye (0.35, 0.62, 1.55), yaw −10, pitch −2, f 1000, hy 820` at F62, ease-in-out (hy interpolates); drift F62 → F71 push 0.05 m, yaw −10 → −8. One camera for both plates. Projection: see the frame map; cat 300 px at F62 (measured LF-BR scale), y about 631–931; MANNEQUIN R hat top y 249, L head top y 330 (proj R3); MANNEQUIN R feet y 1244 (feet only in the band).
Look: PA poster `Grade` + `Grain` → PB painted grade over F24–F40.
VO + subtitles: L06 "แต่พอปล่อยลงสนามทดสอบ…" G583–G630 (env); then 16 f of the 0.8 s gap. Cards L06a–L06b.
Sound: per the frame map. M2 stops on "แต่" (F9). C09 F16–F32: a large sheet of paper swept past the ear, soft whoosh, close, 0.6 s, a feeling of falling through (NEEDS-GEN). A2 fades out F24–F40; A3 field bed opens to full width by F40 (`nature_training-field-afternoon_01` candidate: breeze in leaves, two near birds; Ton checks for traffic wash, forbidden). M3 mission ticks (bongos + muted guitar, a section of M1) start F40.
Mix intent: release (sound opens with the picture) at F40.
Caption band: F0–F30 desk felt and folder (0.35); F40 on lawn (LF-BR at 1.4 scale: 0.52 mean, fails): `CaptionShade` 0.4 from F24 (est) until Boss re-measures at hy 820.
Cut: hard cut at G646.
Build: hard — two plates on one camera, fold, crossfade, the first real Space F plate; start from `edu32/bridge.ts` (set `BRIDGE_CAM1.hy` 820), `edu32/field.ts`, `src/scenes/painted.ts` `crossfadeOf`, `src/painted/PaintedStage.tsx`.
Entry → exit: entry = LF02-r2 frame; exit: real field, cat at eye height looking front again, mannequins seated.
Acceptance: | G | Observable | Evidence |
G598, G606, G614 | bench line and cat foot coincide within 4 px between PA and PB; no doubled cat | per-plate stills BR-PA/PB-24/32/40 |
G598–G614 | no frame with walnut desk and sky each above 10 % of the frame | frame |
G636 | hat top below y 200; cat foot y 925–935; cat above y 1200 | frame |

## B03-SH02 — the AGENT on the radio

Range: G [646, 689); L0 = G646.
Direction: the same AGENT, now real, at the field's front-right corner outside the rope, radio at his ear, pointing screen-left with confidence; the bench with the mannequins small and soft at the left edge behind his hand. Overcast.
Staging: AGENT real `man-parted + new: agent-1960s`, front, at (+3.6, 0, +2.4); LEFT mitten holds `new: radio-handset-1960s` at the left ear (P20 mirrored) entry to exit; RIGHT arm P05 pointing screen-left at the bench (screen x ≈ 160); `talk` L8–L40; confident nod on the second "ซ้าย" (L27). Prop state: radio in the left hand only; the right hand empty. Arm sides per the hand-drawing skill: front view, his left = screen-right.
Camera: `cam: eye (+3.5, 1.35, +5.1), yaw −8, pitch 0, f 900, hy 560` → `eye (+3.45, 1.35, +4.8), yaw −11, pitch 0, f 900, hy 560` L0 → L42 (arc). Projection (est): AGENT 593 → 668 px, face y 420–520, screen-centre-right.
VO + subtitles: L07 AGENT part "เป้าหมายอยู่ซ้าย… ซ้าย…" G654–G686 (env on; pause G686–G696). Radio-filtered voice. Cards L07a–L07b.
Sound: C10 at L0: walkie-talkie key-up click and short squelch, narrow band, 0.3 s (NEEDS-GEN). C11 static bed under the line G654–G739 (`electric_radio-static-burst_01` candidate, low). M3 ticks rising. A3 continues.
Mix intent: hit C10 at L0 (breaks the gap's silence); hold.
Caption band: grass and his legs (est 0.45): `CaptionShade` 0.4 (est).
Cut: hard cut at G689 (in the L07 pause).
Build: hard — real AGENT with radio at ear (P20 mirrored) + point (P05); start from `edu32/cast.ts` (LF03R-AGENT), kit `poses.ts`, `.claude/skills/hand-drawing/SKILL.md`; `new: radio-handset-1960s`.
Entry → exit: radio at the ear, arm pointing, throughout.
Acceptance: G646 C10 on the cut (sync); thumb rule passes on both mittens (frame); face clear of the mark box (frame).

## B03-SH03 — left, right, or the sun (rule of three)

Range: G [689, 786); L0 = G689.
Direction: one low bench frame. The cat sits between the mannequins already looking left at MANNEQUIN L (the target, as ordered); a sparrow lands on the right armrest and the cat looks right; the cloud passes and one warm sun patch opens on the grass; on "ตากแดด" the cat steps down, walks to the patch and lies down in it; it settles as the narrator starts "CIA ยอมรับเองว่า".
Staging: | Entity | Space F | Start | Key / end (L) | Facing |
CAT real ×1.6 | seat (0, 0.345, −0.3) | sit, head turned to −x (look at MANNEQUIN L) L0–L13 | head turns right L14–L20; `new: step-down` to (+0.1, 0, −0.05) L30–L42; `walk` to the patch (+0.5, 0, +0.7), 0.85 m, L42–L70; kit `lie-down` into `CAT_LOAF` L70–L86; settled L86 (G775), slow blink L90 | front → profile walking +x/+z → loaf facing screen-left |
SPARROW `new: sparrow` | in from screen-right above frame | flutter L2–L12 | lands on the right armrest (+0.95, 0.55, −0.3) L12, tail-bob L14, L40 | faces −x |
MANNEQUIN L/R | (−0.6, 0, −0.1) / (+0.62, 0, −0.1) | static | — | front |
Light: overcast → sun L18–L34 (cloud shadow edge sweeps across the bench toward +x, canopy shade falls on the bench, patch ellipse 0.9 × 0.6 m at (+0.5, 0, +0.7) rises to full warmth `#ffe2a0`); sun direction `SUN_DIR` (−0.35, 0.85, −0.4).
Camera: `cam: eye (+0.3, 0.62, +2.6), yaw −2, pitch −4, f 1200, hy 760` at L0 → `eye (+0.25, 0.6, +2.35), yaw +1, pitch −4, f 1200, hy 760` at L96, ease-in-out. Projection (R3, `timed-projection.ts`): start: seat foot (458, 789), cat 233 px y 556–789 (measured size), mannequin head tops L (178, 315), R (729, 295) (measured LF03R + 260); patch centre (705, 1062), front y 1133. End: patch centre (697, 1103), front y 1194; loaf cat 234 px (measured) at about y 869–1103; head tops L (88, 260), R (704, 248). The cat's lowest point (y 1103) is 97 px above the y 1200 limit and 127 px above the band; mark box clear.
VO + subtitles: L07 AGENT "มันไปนอนตากแดดแล้วครับ" G696–G738 (env; "นอน" W713, "ตากแดด" W720–W729), radio-filtered; L08 "CIA ยอมรับเองว่า" G745–G779 (env on, W). Cards L07c–L07d, L08a.
Sound: radio voice continues; C11 static; C10b squelch-out at L50 (G739), 0.2 s. C12 at L2 small wings fluttering then one bright chirp at L12 as it lands, outdoor, light, 0.5 s (NEEDS-GEN). C13 at L18: a soft warm rising shimmer as the sun comes out, airy bells and a hush of leaves, 0.8 s, cosy, no switch click (NEEDS-GEN). C14 at L40: soft paw thump of a light cat landing on turf, 0.3 s (NEEDS-GEN). M3 ticks **drop out** at L8 (G697, on "มันไป"). C15 purr in from L80 (`creature_cat-purr_01` candidate). A3 continues.
Mix intent: drop at L8 (music out), release into the purr at L86.
Caption band: sunlit grass in front of the patch (LF03R old-band 0.367/0.397; the R3 band is lower, nearer, brighter): `CaptionShade` 0.4 (est) until Boss measures `--band 1230 1344` on this plate.
Cut: hard cut at G786 (word gap before "แมว").
Build: hard — real cat look, `new: step-down`, walk, lie-down; sparrow land; overcast → sun change with canopy shade; start from `edu32/field.ts` (`SF`, `SUN_DIR`, `sunShadow`), `edu32/looks.ts` `CAT_LOAF`, kit `animal-motions.ts` (`step-up` with a negative rise as the starting point for step-down).
Entry → exit: entry: overcast, cat sitting on the seat looking left; exit: sun, cat in loaf in the patch, sparrow on the armrest.
Acceptance: | G | Observable | Evidence |
G689 | cat looking at MANNEQUIN L; no head in the mark box | frame |
G701 | sparrow on the armrest, cat turning right | frame |
G723 | sun on, one warm patch, canopy shade on the bench | frame |
G775 | cat lying in the patch, all of it above y 1200 | frame + `caption-zone.py` |
Fallback: if step-down does not read, a cut-free `walk` off the front of the seat with a 6-frame drop arc (story intact).

## B03-SH04 — the plan on the clipboard

Range: G [786, 880); L0 = G786.
Direction: overhead on the clipboard lying on the grass at the field's corner: the pencil plan (bench box with two dots, left dot circled in red, a bird mark at the bench's right end, a sun circle in front, the cat's start dot on the bench). A red dashed paw path wanders everywhere, heads for the red circle on "ยกเว้น" and swerves away. No words or numbers. Sun dapple on the sheet.
Staging: `new: clipboard-plan` 0.23 × 0.32 m at (+3.3, 0, +2.9). Paw path (sheet-local, screen-space on the sheet quad): draws L4–L32 from the cat dot to the bird, round the sun, to two edges (on "แมวไปไหนก็ได้ตามใจ…" W788–W818); pause L32–L34; heads for the red circle L34–L62 (on "ยกเว้นที่ที่เขา" W820); swerves away L62–L76 (on "อยากให้ไป" W851–W861); holds.
Camera: `cam: eye (+3.3, 0.55, +2.95), yaw 0, pitch −88, f 1000` → `eye (+3.3, 0.48, +2.93), yaw +6, pitch −88, f 1000` L0 → L93 eased; plan centre lifted to y ≈ 600 by the lens shift; sheet 640 → 730 px tall (est). The sheet's lower edge may sit under the captions; the path and the circle stay above y 1100.
VO + subtitles: L08 rest "แมวไปไหนก็ได้ตามใจ… ยกเว้นที่ที่เขาอยากให้ไป" G788–G868 (env off G868). Cards L08b–L08d.
Sound: A3 low. C16 under the draw L4–L32 and L34–L76: a soft red pencil drawing a dotted line on paper over a hard board, close, dry, steady, can loop (NEEDS-GEN, 3 s). The pencil stops for L32–L34 (the drop before "ยกเว้น"). C17 at L80 (G866): a deflating brass "wah" droop, 0.5 s, ends by the cut (`comedy_brass-note-wah-droop_01` candidate).
Mix intent: drop L32, hit C17.
Caption band: clipboard board edge and grass (est 0.45): `CaptionShade` 0.35 (est).
Cut: hard cut at G880.
Build: easy — flat clipboard prop + brush path draw-on; start from `edu32/field.ts` lawn, kit `quadText.ts` sheet quad pattern.
Entry → exit: entry plan without path; exit path ending away from the red circle.
Acceptance: G820 path turns toward the circle (frame); G862 path has swerved, never touching the circle (frame); no text on the sheet (frame).

## B04-SH01 — hungry, off it goes

Range: G [880, 993); L0 = G880.
Direction: low near the ground: the cat lying in the sun patch, the mannequins soft behind; while the narrator says "เล่าว่า" it gets up, and through "แมวหนีงานเวลาหิว" it walks out of the patch and out of frame screen-right; the empty patch and the unattended mannequins hold.
Staging: CAT real ×1.6, profile: `CAT_LOAF` at (+0.5, 0, +0.7) L0–L51 (tail-tip flick L45); kit `get-up` L52–L63 (on "เล่าว่า" W932); `walk-out-to-right` along z +0.75 from x +0.5 to x +2.1 L63–L100 (1.6 m in 37 f, a purposeful hungry trot, 1.3 m/s); out of frame after x ≈ 2.1 at L100 (G980); empty patch holds L100–L112 (on "เวลาหิว" W971–W985).
Camera: `cam: eye (+0.6, 0.35, +2.3), yaw −4, pitch −4, f 1100, hy 800` → `eye (+0.8, 0.35, +2.3), yaw +2, pitch −4, f 1100, hy 800` L0 → L112 linear truck with eased ends. Projection (R3, proj): lying cat about 224 px, y 737–961; mannequin head tops y 198–231; empty patch centre x ≈ 297 at the end.
VO + subtitles: L09 part "แล้วก็… อดีตเจ้าหน้าที่คนหนึ่งเล่าว่า แมวหนีงานเวลาหิว" G885–G990 (env; pauses G946–G954, G990–G999). Cards L09a–L09d.
Sound: M4 one low suspicious bowed-bass note from L0 (`tone_bowed-bass-drone-d_01` candidate if key and fit pass). Silence of music movement under "แล้วก็…" (note only). A3 low. C18 L63–L100: light cat steps on short turf, about six soft steps, close, casual (NEEDS-GEN, 1.3 s). Purr C15 stops at L52.
Mix intent: hold; small lift on the steps.
Caption band: near grass (est 0.45): `CaptionShade` 0.4 (est).
Cut: hard cut at G993 (L09 pause).
Build: hard — real cat `get-up` + walk-out in the sun patch; start from kit `animal-motions.ts` (`get-up`, `walk-out-to-right`), `edu32/field.ts`.
Entry → exit: entry cat in loaf in the patch (B03-SH03 exit state, sun); exit empty patch, no cat (cat absent until G1583).
Acceptance: G932 get-up starts (frame); G961 ("หนีงาน") cat walking right of the patch (frame); G980 cat fully out of frame (frame).

## B04-SH02 — the door closes ("ทีมเลยต่อสายเพิ่ม")

Range: G [993, 1072); L0 = G993.
Direction: the camera stands down the 1960s corridor looking back along the door wall (a corridor, not a wall); the solid wooden door stands ajar onto a solid dark gap; on "ทีมเลย" it swings shut and the "ห้ามรบกวน" card on the knob swings and settles. Nothing from inside, no light seam.
Staging: Space C. Door leaf (hinge x −0.45, opens inward −z) ajar 40° (as LF05) L0–L3; swings shut L4–L20 (on "ทีมเลย" W997–W1004), latch L20 (G1013); sign card 0.30 × 0.22 m on the knob (+0.36, 0.98, +0.04): swings ±14° L20–L44, settles by L50. Dressing moved into frame for this key (Boss, est): radiator x +0.9..+1.5 on the door wall, notice board x +0.85..+1.55, y 1.2–1.7; clock about (−1.2, 2.1, 0).
Camera: `cam: eye (+1.9, 1.25, +2.6), yaw −35, pitch 0, f 1000, hy 740` → `eye (+1.75, 1.25, +2.3), yaw −33, pitch 0, f 1000, hy 740` L0 → L78 eased. Projection (R3, proj): door y 510–1162 → 484–1214 (door base 16 px above the y 1230 band at the end; it is a set line, not a lead); sign 87–97 px wide at y 858–957.
VO + subtitles: L09 part "ทีมเลยต่อสายเพิ่ม ไว้กดความหิว" G999–G1061 (env). Cards L09e–L09f.
Sound: A4 corridor bed on the cut: steady fluorescent hum, faint building air, hard walls, quiet loop (NEEDS-GEN). M4 note continues. C19 L4–L20: a solid wooden door swung shut gently on its hinge, latch click at L20, hard-walled corridor, 0.8 s, final but not ominous (NEEDS-GEN; `foley_door-latch-hinge_01` is open-then-swing and does not fit). C20 at L22 and L30: the card on its string tapping the wood twice, 0.3 s (NEEDS-GEN). Nothing heard behind the door.
Mix intent: hit the latch at L20.
Caption band: lino at the door foot (LF05 0.234 at the old key; the R3 key shows more lino): `CaptionShade` 0.3 (est).
Cut: hard cut at G1072.
Build: easy — corridor set, door hinge, sign swing; start from `edu32/corridor.ts`, `corridor-text.tsx`, `src/scenes/quadText.ts`.
Entry → exit: entry door ajar, gap flat dark; exit door shut, sign still.
Acceptance: G1013 door shut, latch (frame + sync); gap luma ≤ 15/255 and no seam at every frame L0–L20 (frame); sign text legible at 540 px (frame).

## B04-SH03 — a bowl would have done

Range: G [1072, 1131); L0 = G1072.
Direction: low on the lino in front of the closed door; a steel pet bowl slides in from screen-right and stops; a small handful of kibble drops in. The hanging sign's lower edge at the top of frame.
Staging: Space C. Bowl 0.18 × 0.06 m slides from (+1.4, 0, +0.3) to (+0.1, 0, +0.25) L6–L20 (on "ทั้งที่จริง ๆ…" env G1080), small wobble L20–L24; kibble (about 12 pieces) falls from above frame into the bowl L23–L35 (on "ให้ข้าว" W1095).
Camera: `cam: eye (+0.45, 0.42, +1.3), yaw −4, pitch −16, f 1000, hy 880` → `eye (+0.4, 0.38, +1.1), yaw −4, pitch −16, f 1000, hy 880` L0 → L58 eased. Projection (R3, proj): bowl 197 px wide (measured LF05-BOWL), at its stop y ≈ 925–1014; door base y ≈ 907–926; sign lower edge y ≈ 350 → 249.
VO + subtitles: L10 "ทั้งที่จริง ๆ… ให้ข้าวก็จบแล้ว" G1080–G1124 (env). Cards L10a–L10b.
Sound: A4 hum only under "ทั้งที่จริง ๆ…" (M4 out at L0). C21 at L6: a light metal pet bowl slid on linoleum, small scrape and wobble, 0.5 s (NEEDS-GEN; `foley_clay-bowl-slide-mat_01` does not fit). C22 at L23: dry kibble poured into a metal bowl, close, dry, 0.7 s, homely (NEEDS-GEN).
Mix intent: drop at L0, small hit at L23.
Caption band: cream lino `#ddd3bd` lit by the fluorescent (bright, est 0.6): `CaptionShade` 0.45 (est); Boss measures.
Cut: hard cut at G1131.
Build: easy — bowl slide, kibble drop on the corridor set; start from `edu32/corridor.ts` (`new: steel-pet-bowl`, LF05-BOWL).
Entry → exit: door shut, sign still; exit bowl with kibble in front of the door.
Acceptance: G1092 bowl stopped (frame); G1100 kibble in the bowl (frame); bowl above y 1200 (frame).

## B05-SH01 — back to the desk at full scale: the memo

Range: G [1131, 1210); L0 = G1131.
Direction: one eased move from a seated person's view of the night office (window blinds, filing cabinet, pushed-back chair, the desk under the lamp) gliding down into the lamp pool to the memo lying half out of a red-banded folder. The episode's second large move.
Staging: Space D real dressing ([brief](film-brief.md#set-plans-metres-estimates)): memo MM 2.10 × 2.97 at the origin, yaw +8°, real text as DOM quad: subject "Views on Trained Cats [bar] for [bar] Use", body lines with navy redaction bars, pencil "3-67" in the top corner; no date line, letterhead or "TOP SECRET". Red-banded folder under it.
Camera: `cam: eye (+2.6, 4.5, +9.0), yaw −14, pitch −20, f 900` → `eye (−0.2, 0.9, +1.9), yaw +6, pitch −30, f 900` L0 → L76, eased with the first third slow (L0–L26 covers about 15 % of the path), arriving L76 and holding to the cut. hy 960 default (est). The memo subject line ends above y 900.
VO + subtitles: L11 part "ปี 1967 เอกสารลับของ CIA" G1133–G1210 (env on; pause G1174–G1183). Cards L11a–L11b.
Sound: A1 office room tone on the cut (same bed as B01). M5 pompous slow brass enters at L2 (M1 restated as a section). C23 at L70: a single sheet shifting on a folder, papery hiss, 0.4 s (NEEDS-GEN).
Mix intent: lift M5 gently, duck under the line.
Caption band: L0–L40 the navy room and desk front (LF04 0.189, pass); L60 on the memo paper (bright): `CaptionShade` 0.2 → 0.4 by L60 (est).
Cut: hard cut at G1210 (envelope dip, "CIA|เรียก").
Build: hard — office dressing at human scale plus a long eased push with the memo quad; start from `edu32/office.ts`, `office-text.tsx`.
Entry → exit: entry office wide, lamp the only warm key; exit memo framed in the pool.
Acceptance: G1131 room reads as a night office, not black (frame); G1207 subject line and "3-67" legible at 540 px (frame).

## B05-SH02 — "ความสำเร็จทางวิทยาศาสตร์ที่น่าทึ่ง"

Range: G [1210, 1327); L0 = G1210.
Direction: close on the memo; after a redaction bar, the real sentence types on and lands with the Thai quote; a red pencil underline on "น่าทึ่ง".
Staging: memo quad line (page-local, est z −0.4): redaction bar visible from L0; type-on "This is in itself a" L4–L37 (on "เรียกการฝึกแมวว่า" W1211–W1246), pause L38–L47 (the near-silence G1248–G1257), "remarkable scientific achievement." L48–L90 (on the quote W1258–W1300, 35 characters, about 0.8 per frame, seek-safe per-character reveal); red pencil underline under "remarkable scientific achievement" L92–L106 (on "ที่น่าทึ่ง" W1302–W1316). Typed line at screen y 700–800 (est), above y 1200.
Camera: `cam: eye (−0.2, 0.55, +0.9), yaw 0, pitch −35, f 950` → `eye (+0.3, 0.55, +0.9)` L0 → L110, linear truck following the typing, eased ends. Type ≈ 57 px (est).
VO + subtitles: L11 part "เรียกการฝึกแมวว่า "ความสำเร็จทางวิทยาศาสตร์ที่น่าทึ่ง"" G1211–G1321 (env off). Cards L11c–L11f.
Sound: C24 typewriter strikes following the type-on L4–L37 and L48–L90 (`foley_typewriter-keys-run_01` candidate). M5 mock-solemn brass swell L48–L110 (`bed_brass-chorale-admiring_01` candidate, under the quote). C25 at L111 (G1321): typewriter bell and carriage slide, 0.4 s, pleased with itself (NEEDS-GEN).
Mix intent: lift the brass on the quote; hit the bell after the line.
Caption band: memo paper (bright cream, est 0.7): `CaptionShade` 0.45 (est).
Cut: hard cut at G1327.
Build: easy — type-on and underline on the memo quad; start from `edu32/office-text.tsx`, EP16 `logbook.tsx` / EP24 `board-text.tsx` precedents.
Entry → exit: entry the bar and empty line; exit full sentence underlined.
Acceptance: G1300 "achievement." complete (frame); G1316 underline complete (frame); every character a pure function of the frame (random seek).

## B05-SH03 — "แต่สรุปว่า… ใช้งานจริงไม่ได้" (the stamp)

Range: G [1327, 1411); L0 = G1327.
Direction: tilt down the memo to its last real line "…it would not be practical." ending about mid-page; silence on the "…"; the red stamp slams beside it.
Staging: stamp "WOULD NOT BE / PRACTICAL" (kit `Stamp`, screen-space slam, settling onto the page stamp `MEMO_STAMP` page-local (+0.45, +0.2), rot −8) slams L37–L41, impact **L41 (G1368)**, 2 f before "ใช้งานจริงไม่ได้" (pause end env G1370), so the transient sits in the silence and the voice enters over its decay.
Camera: `cam: eye (+0.3, 0.55, +0.9), pitch −35` → `eye (+0.3, 0.5, +0.8), pitch −45` (yaw 0, f 950) L0 → L40 eased; hold.
VO + subtitles: L12 "แต่สรุปว่า… ใช้งานจริงไม่ได้" G1343–G1394 (env; pause G1361–G1370). Cards L12a–L12b.
Sound: M5 out at L28 (G1355, on "ว่า…"); a full beat of silence G1355–G1368 (room tone only). C26 at L41: heavy rubber-stamp thud, weighty and final (`foley_rubber-stamp-thunk_01` candidate). C27 at L70 (G1397): card folder cover dropped shut on paper, soft, 0.4 s (NEEDS-GEN).
Mix intent: drop at L28, hit at L41.
Caption band: memo paper: `CaptionShade` 0.45 (est). Stamp above y 1100.
Cut: hard cut at G1411.
Build: easy — camera tilt + kit `Stamp`; start from kit `stamp.ts`, `edu32/office-text.tsx` (`MemoText` page stamp).
Entry → exit: exit stamp on the page beside the last line.
Acceptance: G1368 stamp impact (frame + sync); stamp words legible at 540 px (frame).

## B06-SH01 — the CIA page agrees

Range: G [1411, 1583); L0 = G1411.
Direction: a white modern printout drops into frame from above, drifts and settles over the memo, leaving the red stamp visible at its lower right; two yellow highlights on the real quoted phrases.
Staging: page W 2.10 × 2.97, yaw −5°, falls from above frame L0–L20 (drift ±4°, settles with a small slide L20–L24) onto the memo, stamp corner uncovered. Generic browser frame, greeked lines; real text only for the two quoted fragments (O3: Boat confirms the exact SRC004 fragment). Highlight 1 over "…had a mind of its own…" L59–L89 (on "มีความคิดของมันเอง" env pause end G1470–W1500); highlight 2 over "…something all cat owners are quite familiar with." L140–L161 (on "คุ้นเคยดี" W1551–W1572).
Camera: `cam: eye (+0.2, 0.8, +1.5), yaw −6, pitch −32, f 900` → `eye (+0.15, 0.75, +1.3), yaw −6, pitch −32, f 900` L0 → L171 slow ease. Highlighted lines above y 1150 (est).
VO + subtitles: L13 "เว็บ CIA ยังเขียนเองเลยว่า แมว "มีความคิดของมันเอง"… เรื่องที่คนเลี้ยงแมวทุกคน "คุ้นเคยดี"" G1413–G1577 (env; pause G1461–G1470). Cards L13a–L13f.
Sound: C28 L2–L20: one sheet of printer paper falling flat onto a desk, soft air flutter then a light pat at L20, 0.6 s (NEEDS-GEN). C29 at L59 and L140: felt highlighter squeak on paper, 0.4 s (NEEDS-GEN). M6 the theme slowed to a lone muted trumpet from L4, amused; pulls back on the "…" L89–L101; fades out by L170.
Mix intent: hold; release at L89.
Caption band: printout white (est 0.8): `CaptionShade` 0.5 (est).
Cut: hard cut at G1583.
Build: easy — printout drop + DOM highlights; start from `edu32/office-text.tsx`, `src/scenes/quadText.ts`.
Entry → exit: entry memo with the stamp; exit printout settled, two highlights, stamp visible.
Acceptance: G1435 printout settled, stamp corner visible (frame); highlights on their words ±6 f (sync).

## B06-SH02 — the real cat on the real desk (CL01 payoff)

Range: G [1583, 1651); L0 = G1583.
Direction: the mirror of B01-SH03's key: the real cat curled asleep on the memo in the lamp pool, facing screen-left; printout gone; on "เรียก" one ear flicks toward us; nothing else. Holds 10 f into the closing hold so the mrrp callback finishes on the cat.
Staging: Space D real. CAT real ×16, `CAT_SLEEP` (loaf, lids shut), profile, body centre `CAT_DESK` (−2.0, 0.03, −0.1) across the memo's left edge; breathing swell (period 60 f); `new: ear-flick` L27–L35 (on "เรียก" W1610). Stamp at about (+0.42, 0.03, +0.26), screen (881, 744), 11 px cap (not legible here; read in B05-SH03 and B06-SH03).
Camera: `cam: eye (−2.0, 2.0, +6.3), yaw 0, pitch −2, f 900, hy 460` → `eye (−2.0, 2.0, +5.7), yaw +3, pitch −2, f 900, hy 460` (`CAM_B06_KEY`) L0 → L67 eased. Mirror: within ±8 % of B01-SH03's L77 key (LF04: −2.2 % w, −2.5 % h, measured); cat 508 px, y 223–731.
VO + subtitles: L14 "ใช่… ตัวที่เรียกแล้วไม่เคยมาน่ะแหละ" G1585–G1636 (env; pause G1594–G1604). Cards L14a–L14c (last card ends G1647).
Sound: A1 office room tone; L14 dry; C15 purr under, rising at the hold. C02 at L54 (G1637): the same bored mrrp as B01-SH03 (callback), 0.35 s. M7 ending tag first note at L64 (G1647) — see B06-SH03.
Mix intent: drop (dry line), hit the mrrp, release into the tag.
Caption band: desk front walnut and lamp pool (LF04 0.189, pass): `CaptionShade` 0.2.
Cut: hard cut at G1651 (10 f into the hold).
Build: hard — real cat curled ×16 + `new: ear-flick`; mirror check; start from `edu32/office.ts` (`paintOfficeB06`, `CAT_SLEEP`, `CAM_B06_KEY`, `catHole`); LF04 weaknesses to fix in the plate: flat cat light, lamp-pool rings and greenish cast.
Entry → exit: cat curled asleep, ear back at rest at exit.
Acceptance: G1610–G1618 ear flick (frame); G1650 overlay on B01-SH03 G306 within ±8 % (frame).

## B06-SH03 — stamp insert, the last shot

Range: G [1651, 1689); L0 = G1651. Last frame of the clip G1688.
Direction: close top-down three-quarter on the memo: the red stamp "WOULD NOT BE / PRACTICAL" fills the middle of the frame, the sleeping cat's grey flank fills the top edge of the frame behind it, the tail tip sweeps once across the paper to the right of the stamp; slow push.
Staging: same set, light and DOM memo text. Stamp world centre (+0.418, 0.03, +0.261), 1.0 × 0.44 model m, rot −8. CAT ×16 static curl, breathing swell only; `new: tail-tip-sweep` one stroke L18–L30 along the paper right of the stamp (screen x 880–1060, y 650–900), never over a letter.
Camera: `cam: eye (+0.42, 1.22, +0.89), yaw 0, pitch −62, f 900, hy 760` → `eye (+0.42, 1.13, +0.84), yaw +2, pitch −62, f 900, hy 760` L0 → L37 eased (≈ 8 % push). Projection (`timed-projection.ts`): stamp centre (539, 762) → (524, 764); stamp box x 176–900 / y 641–903 at L0, x 131–920 / y 624–931 at L37 (≈ 670–790 px wide); a 0.12 m vertical on the stamp = 71 → 77 px (actual letter cap per `MemoText`, about 45–55 px native, Boss measures). The DOM cat hole (`catHole`) lowest edge is y 601 (x ≤ 338) at L0 and y 635 (x ≤ 297) at L37, rising to y ≈ 406–420 at x 690: **5 px from the stamp's top border at the top-left corner at L37**, about 35 px or more from the letters (est inset); fur never covers a letter. The cat fills the top ~30 % of the frame left of x ≈ 790 (it is 1 m behind the stamp and 4 model m tall), so the "haunch at one edge" of BOARD-R3 reads as a fur wall along the top edge.
VO + subtitles: none (hold). No caption card in this shot.
Sound: C15 purr continues, a little closer and warmer. C30 at L24 (G1675): soft long fur dragged once across a sheet of paper on a wooden desk, close, dry, 0.3 s, lazy and content (NEEDS-GEN). M7 ending tag (UT15, NEEDS-GEN): a lazy three-note muted-trumpet spy tag, notes at G1647 (B06-SH02 L64), G1657 (L6) and G1667 (L16), the third bending down like a yawn to G1686, decayed by G1688; total ≈ 1.4 s (the 1.6 s hold leaves no room for the 2.0 s of BRIEF-R3); the clip ends on its tail. No new music.
Mix intent: release; the tag is the last thing heard.
Caption band: memo paper (bright) but empty of captions.
Cut: end of composition at G1689.
Build: easy — new camera on the LF04 set with the `MemoText` stamp; start from `edu32/office.ts`, `office-text.tsx`, `catHole`; the tail sweep is optional garnish (fallback: breathing only).
Entry → exit: stamp legible from L0 to the end.
Acceptance: | G | Observable | Evidence |
G1651 | every letter of "WOULD NOT BE / PRACTICAL" legible at 540 px; stamp above y 1000 | frame |
G1651–G1688 | no fur over any letter; lamp pool warm, not black | frames L0, L18, L30, L37 |
G1675 | tail tip crossing the paper right of the stamp | frame |

## Caption cards

Planned splits for Editor (EP26 pattern, own data): onset = 2 f before the next word (pause end `env` or Whisper `W`), a card runs to the next card's onset, at least 15 f each, one line, width ≤ the EP26 widest card (17 width units ≈ 650 px at 71 px; units: 1 per Thai base glyph, 1.6 per Latin letter or digit, 0.5 per space or "…"; Editor confirms the pixel width with `node scripts/caption-breaks.mjs`). No card from G1647 (the stamp insert). Text verbatim from SCRIPT-R1.

| Card | G `[on, next)` | f | Text | Anchor |
| --- | --- | ---: | --- | --- |
| L01a | [0, 18) | 18 | CIA | env G1 |
| L01b | [18, 43) | 25 | หน่วยสืบราชการลับ | W20 |
| L01c | [43, 83) | 40 | ที่เก่งที่สุดในโลก… | W45 |
| L01d | [83, 105) | 22 | เคยผ่าตัด | env pause end G85 |
| L01e | [105, 144) | 39 | ใส่ไมค์ที่หูแมว | W107 |
| L01f | [144, 185) | 41 | ฝังเครื่องส่งในตัว | W146 |
| L01g | [185, 236) | 51 | ถักเสาอากาศไว้ในขน | env G187 |
| L02a | [236, 269) | 33 | แมว | env G238 |
| L02b | [269, 295) | 26 | ใช่ ตัวที่เรียกแล้ว | env pause end G269 (W271) |
| L02c | [295, 327) | 32 | ไม่เคยมาน่ะแหละ | W297 |
| L03a | [327, 352) | 25 | แผนคือ… | env G329 |
| L03b | [352, 374) | 22 | ให้แมวไปแอบฟัง | W354 |
| L03c | [374, 403) | 29 | สายลับคุยกับหัวหน้า | W376 |
| L03d | [403, 438) | 35 | ฝั่งโซเวียตในสวน | W405 |
| L04a | [438, 459) | 21 | ไม่มีใครระแวง | env G440 |
| L04b | [459, 502) | 43 | แมวหรอก | W461 |
| L05a | [502, 525) | 23 | ก็จริง… | W504 (env G507) |
| L05b | [525, 543) | 18 | เพราะแมวไม่ทำงาน | env G527 |
| L05c | [543, 581) | 38 | ให้ใครอยู่แล้ว | W545 |
| L06a | [581, 599) | 18 | แต่พอปล่อยลง | env G583 |
| L06b | [599, 652) | 53 | สนามทดสอบ… | W601 |
| L07a | [652, 671) | 19 | เป้าหมายอยู่ซ้าย… | env G654 |
| L07b | [671, 694) | 23 | ซ้าย… | W673 |
| L07c | [694, 718) | 24 | มันไปนอน | env G696 |
| L07d | [718, 742) | 24 | ตากแดดแล้วครับ | W720 |
| L08a | [742, 786) | 44 | CIA ยอมรับเองว่า | env G745 |
| L08b | [786, 818) | 32 | แมวไปไหนก็ได้ตามใจ… | W788 |
| L08c | [818, 849) | 31 | ยกเว้นที่ที่เขา | W820 |
| L08d | [849, 881) | 32 | อยากให้ไป | W851 |
| L09a | [881, 899) | 18 | แล้วก็… | W883 (env G885) |
| L09b | [899, 920) | 21 | อดีตเจ้าหน้าที่ | W901 |
| L09c | [920, 953) | 33 | คนหนึ่งเล่าว่า | W922 |
| L09d | [953, 997) | 44 | แมวหนีงานเวลาหิว | env G954 |
| L09e | [997, 1034) | 37 | ทีมเลยต่อสายเพิ่ม | env G999 |
| L09f | [1034, 1078) | 44 | ไว้กดความหิว | W1036 |
| L10a | [1078, 1093) | 15 | ทั้งที่จริง ๆ… | env G1080 |
| L10b | [1093, 1131) | 38 | ให้ข้าวก็จบแล้ว | W1095 |
| L11a | [1131, 1181) | 50 | ปี 1967 | env G1133 |
| L11b | [1181, 1210) | 29 | เอกสารลับของ CIA | env G1183 |
| L11c | [1210, 1256) | 46 | เรียกการฝึกแมวว่า | envelope dip G1210 (on the cut, 1 f later than the 2 f rule) |
| L11d | [1256, 1275) | 19 | "ความสำเร็จ | near-silence end G1258 |
| L11e | [1275, 1300) | 25 | ทางวิทยาศาสตร์ | W1277 |
| L11f | [1300, 1341) | 41 | ที่น่าทึ่ง" | W1302 |
| L12a | [1341, 1368) | 27 | แต่สรุปว่า… | env G1343 |
| L12b | [1368, 1411) | 43 | ใช้งานจริงไม่ได้ | env G1370 |
| L13a | [1411, 1429) | 18 | เว็บ CIA | env G1413 |
| L13b | [1429, 1449) | 20 | ยังเขียนเองเลยว่า | W1431 |
| L13c | [1449, 1468) | 19 | แมว | W1451 |
| L13d | [1468, 1510) | 42 | "มีความคิดของมันเอง"… | env G1470 |
| L13e | [1510, 1539) | 29 | เรื่องที่คนเลี้ยงแมว | W1512 |
| L13f | [1539, 1583) | 44 | ทุกคน "คุ้นเคยดี" | W1541 |
| L14a | [1583, 1602) | 19 | ใช่… | env G1585 |
| L14b | [1602, 1628) | 26 | ตัวที่เรียกแล้วไม่เคยมา | env G1604 |
| L14c | [1628, 1647) | 19 | น่ะแหละ | W1630; ends 6 f into the hold |

55 cards; widest L14b (17.0 units) and L08b / L13d (16.5); none over the EP26 widest. "ทีมเลยต่อสายเพิ่ม ไว้กดความหิว" splits at the space (L09e / L09f) as VD32-29 asks. "CIA" is spoken as "ซีไอเอ" and captioned "CIA" (voice lock note 3).

## Shot groups for Boss (W5.2)

Beat batches ([plate-tickets trial ended](../../../../docs/memory/plate-tickets-trial-ended.md)); one Boss pass per group, hard groups first where they carry the risk.

| Group | Shots (build) | Set / start from | Risk and order |
| --- | --- | --- | --- |
| G1 | B01-SH01 (hard), B01-SH02 (easy), B01-SH03 (hard) | paper desk, page BP; hero cat ×4 | page BP not yet painted; ear flick (shared with G7) |
| G2 | B02-SH01, B02-SH02, B02-SH03 (all hard) | LF02 set; paper AGENT P09 | pop-up rise, cat slide, paper faces `talk` |
| G3 | B03-SH01 (hard) | `edu32/bridge.ts` | **first**: set `BRIDGE_CAM1.hy` 820, re-render the LF-BR draft at the timed frames; coincidence checks |
| G4 | B03-SH02 (hard), B03-SH03 (hard), B03-SH04 (easy), B04-SH01 (hard) | Space F | **second**: step-down, sparrow land, sun change, get-up/walk-out, AGENT radio arms |
| G5 | B04-SH02 (easy), B04-SH03 (easy) | Space C | door close, sign swing, dressing moved to the R3 key |
| G6 | B05-SH01 (hard), B05-SH02, B05-SH03, B06-SH01 (easy) | office D, memo/printout quads | type-on, printout page W, O3 text from Boat |
| G7 | B06-SH02 (hard), B06-SH03 (easy) | LF04 set | mirror check; insert legibility; tail sweep optional |

Hard 11, easy 8 (unchanged from BOARD-R3).

## Sound cue index (for Ton)

One home for the designs is each shot's Sound line; this index lists IDs and placements only. Library IDs are candidates for Ton's fit check, otherwise NEEDS-GEN.

| ID | Kind | G placement | Shot(s) | Source |
| --- | --- | --- | --- | --- |
| M1 | spy-jazz theme, full | 0–229 (cut dead at 229) | B01-SH01/02 | NEEDS-GEN (stems/sections) |
| M2 | sly section (bass + brushes) | 329–583 (stop G518–527) | B02, B03-SH01 F0–F9 | section of M1 |
| M3 | mission ticks (bongos + muted guitar) | 614–697 | B03-SH01 F40 → B03-SH03 L8 | section of M1 |
| M4 | low bowed-bass note | 880–1072 | B04-SH01/02 | `tone_bowed-bass-drone-d_01` candidate |
| M5 | pompous brass, swell on the quote | 1133–1355 | B05-SH01/02/03 | section of M1 + `bed_brass-chorale-admiring_01` candidate |
| M6 | lone muted trumpet | 1415–1581 | B06-SH01 | section of M1 |
| M7 | ending tag, 3 notes, yawn bend, ≈1.4 s | 1647–1688 | B06-SH02/03 | NEEDS-GEN (UT15) |
| A1 | night office room tone + lamp hum | 0–646 under paper; 1131–1689 | B01–B03-SH01, B05–B06 | NEEDS-GEN |
| A2 | thin park birds (paper) | 328–614 | B02, B03-SH01 | `outdoor_park-birds-breeze_01` candidate, high-passed |
| A3 | open field bed | 598–993 | B03, B04-SH01 | `nature_training-field-afternoon_01` candidate |
| A4 | 1960s corridor hum | 993–1131 | B04-SH02/03 | NEEDS-GEN |
| C01 | pen scratch + ping ×3 | 113, 146, 185 | B01-SH02 | NEEDS-GEN |
| C02 | bored mrrp 0.35 s ×2 | 318, 1637 | B01-SH03, B06-SH02 | `creature_cat-mrrp_01` candidate (trim) |
| C04–C06 | page slide, pop-up snap, card slide | 328, 332, 360 | B02-SH01 | NEEDS-GEN |
| C07 | smug ta-daa 0.5 s | 485 | B02-SH02 | NEEDS-GEN |
| C08 | tiny yawn squeak | 540 | B02-SH03 | NEEDS-GEN |
| C09 | page-turn air rush | 590–606 | B03-SH01 | NEEDS-GEN |
| C10 / C10b | radio key-up + squelch / squelch-out | 646 / 739 | B03-SH02/03 | NEEDS-GEN |
| C11 | radio static bed | 654–739 | B03-SH02/03 | `electric_radio-static-burst_01` candidate |
| C12–C14 | sparrow flutter+chirp, sun shimmer, paw thump | 691/701, 707, 729 | B03-SH03 | NEEDS-GEN |
| C15 | purr | 769–932; 1583–1688 | B03-SH03, B04-SH01, B06-SH02/03 | `creature_cat-purr_01` candidate |
| C16, C17 | pencil dotted line; brass wah | 790–862; 866 | B03-SH04 | NEEDS-GEN; `comedy_brass-note-wah-droop_01` candidate |
| C18 | cat steps on turf | 943–980 | B04-SH01 | NEEDS-GEN |
| C19, C20 | door close + latch; sign ticks | 997–1013; 1015, 1023 | B04-SH02 | NEEDS-GEN |
| C21, C22 | steel bowl on lino; kibble | 1078; 1095 | B04-SH03 | NEEDS-GEN |
| C23 | paper settle | 1201 | B05-SH01 | NEEDS-GEN |
| C24, C25 | typewriter strikes; bell + carriage | 1214–1300; 1321 | B05-SH02 | `foley_typewriter-keys-run_01` candidate; NEEDS-GEN |
| C26, C27 | rubber stamp thud; folder flap | 1368; 1397 | B05-SH03 | `foley_rubber-stamp-thunk_01` candidate; NEEDS-GEN |
| C28, C29 | printout drop; highlighter ×2 | 1413–1431; 1470, 1551 | B06-SH01 | NEEDS-GEN |
| C30 | tail fur brush on paper | 1675 | B06-SH03 | NEEDS-GEN |

Forbidden (brief): taxi, siren, brakes, horn, engine, traffic; any surgical sound; anything behind the closed door.

## Dependencies and open items

| Owner | Dependency / acceptance | Status |
| --- | --- | --- |
| User (via coordinator) | Q9 hold split (recommended 10 / 38 f); Q10 B04-SH01 get-up on "เล่าว่า" (recommended); storyboard and Draft verdicts on ROWS-R4 | open |
| Boss | G1–G7 above; `BRIDGE_CAM1.hy` 680 → 820; missing motions: step-down, ear flick, sparrow land/tail-bob, overcast → sun change, door close, sign swing, type-on, printout W, tail-tip sweep (optional); `caption-zone.py --band 1230 1344` on the first plate of every shot (the shade values here are estimates); B06-SH03 letter cap height and the cat-hole margin on the plate | after this sheet |
| Ton | every NEEDS-GEN cue in the index; fit checks on the candidates; M1 as sections that cut dead; C02 at 0.35 s; M7 ≈ 1.4 s ending inside G1688 | after this sheet |
| Editor | captions from [Caption cards](#caption-cards) (EP26 pattern, own data; pixel-width check); `CaptionShade` per shot from the Caption band lines until measured; ear check at the six tight joins and the L12 pause (voice lock open item 2); `store.py use --episode edu-ep32` once `src/videos/edu-ep32` exists; scene sample B02-SH03 → B03-SH01 → B03-SH02 | after Boss G3 |
| Boat | O3 exact SRC004 fragment for "had a mind of its own" (B06-SH01 highlight 1); O4 ending emblem; stamp text and callout labels recheck; mannequins and the sun gag inside F012 scope | open (does not block blockout) |

Element captures (Boss, 2026-11-21, store `projects/edu/EDU/looks/`): `EP32-LF02-gate-r2` (B02-SH01 key, paper), `EP32-LF03R-gate` / `-r2` (B03-SH03 R2 keys; cat polish), `EP32-LF-BR-gate` (B03-SH01 F0–F71, draft clip, at hy 680), `EP32-LF04-gate` and `EP32-earmic-r2/LF04.png` (B06-SH02 key), `LF04-REF` (B01-SH03 end key), `EP32-LF05-gate` (B04-SH02 at the R2 key, LF05-BOWL), `CAT-SHEET`. Limitation: single frames at R2 keys except the LF-BR clip; no still at any R3 key yet. Editor scene sample proposal: B02-SH03 → B03-SH01 → B03-SH02 (G500–G689, the bridge in context).

## Change log

- 2026-11-21 `EDU-EP32-SHEET-R1`, Film — first timed sheet from VOICE-R2 (x1.00, 1689 f) and BOARD-R3. Shot ranges on the composition clock; bridge fitted to L06 as identity (`F` = L, 72 f from G574; the 0.8 s gap removes the 18 f shortfall of the BRIEF-R3 estimate, no trim of L06 or L10); B03-SH02 now carries both "ซ้าย" (no measured pause between them; cut in the L07 pause G689); B03-SH03 extends through "CIA ยอมรับเองว่า" so step-down, walk and lie-down fit (97 f) and B03-SH04 starts on "แมวไปไหนก็ได้ตามใจ…"; B03-SH01 real cat's look moves from "ปล่อย" to "ทดสอบ…" (the field is not visible until F40); B04-SH01 get-up on "เล่าว่า" (on "หนีงาน" the cat could not leave frame before the cut); hold split 10 / 38 f (BOARD-R3 planned 6 / 42: the mrrp callback finishes on the cat); ending tag ≈ 1.4 s (was ≈ 2.0 s, the hold is 1.6 s); mrrp 0.35 s (fits the L02 → L03 gap); stamp impact 2 f before "ใช้งานจริงไม่ได้"; B06-SH03 projection shows the cat as a fur wall along the top edge, 5 px from the stamp border, clear of the letters; 55 caption cards planned. Projections in `timed-projection.ts`.
