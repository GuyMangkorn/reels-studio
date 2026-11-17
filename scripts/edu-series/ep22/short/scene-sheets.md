# Scene sheets — EDU-EP22-SHORT (EDU-EP22-SCENES-R2)

- **R2 (Film W6.2 fix round, 2026-11-17):** one batched revision after the Draft viewer check (`out/EDU-EP22-SHORT/viewer-check-draft.md`, verdicts `out/EDU-EP22-SHORT/viewer-check/draft/verdicts.json`, on ROWS-R3 and Editor's sheets `out/EDU-EP22-SHORT/qa/draft-sheet-*.png`; worktree cache, not yet archived) failed SH09, SH12, SH15, SH16 and SH17. Changed blocks: SH09, SH12, SH15, SH16, SH17 (fails) and SH06, SH08, SH11 (cheap pass notes); every other block is R1 unchanged. No shot length, cut, VO anchor, subtitle, sound cue frame or fact boundary changed (1717 f, MEASURE-R2). R2 projections: Film with the kit camera itself (`camOf` / `demoCam` + `camPoint`, `src/painted/kit/`) on the R2 lines, values at l 0 and the last frame, ±3 px; demo values at l 40 ±10 px. Each changed block carries **R2** markers; the [R2 fix list](#r2-fix-list-boss) below the shot sheets is Boss's numbered list.
- **Deliverable:** `EDU-EP22-SHORT` (channel **edu**) · **Revision:** EDU-EP22-SCENES-R2 (Film W6.2 Draft fix round, 2026-11-17; R1 = W4.2 timed pass after the voice lock, 2026-11-16) · **Status:** `ready-for-dev` · **Timing:** `checked-with-audio`: every line placed from the Editor's measure **EDU-EP22-NARRATION-MEASURE-R2**; inner word anchors refined by Film from 10 ms RMS on the same locked file (marked `RMS`, ±2 f) or taken from the measure's Whisper anchors (±5 f); the SH01→SH02 cut is a syllable-rate estimate (`est`, ±5 f). Picture beats are authored frames, not measured. Nobody has listened to the sync.
- **Evidence:** runtime none · look frames LF01, LF01b, LF02 by Boss (`out/edu22/looks/v1/`, store `projects/edu/EDU/previews/ep22-w3-looks-v1/`) **approved by the user = look lock** (2026-11-16, "ผ่านครับ") · projection: `scripts/shot-projection.py` on every world-space shot at its first and last frame (inputs generated from the camera lines below; pinhole, physical baseline of the brief) plus Boss's kit probe for LF01/LF01b (`measure-thumbs.ts`: LF01 lead 729 px, LF01b lead 503 px) · audio/subtitle sync: computed from the measure, not rendered · user approval: SCRIPT-R3 text, voice lock Kore x0.9025 ("ล็อกเลย"), look lock. This sheet revision is not user-approved.
- **Inputs (by revision):** script **EDU-EP22-SCRIPT-R3** ([script.md](script.md): S01-B01..B05, L01–L16, CL22-01..04); fact-check **EDU-EP22-FACT-R3** ([fact-check.md](fact-check.md)); brief **EDU-EP22-BRIEF-R2** ([film-brief.md](film-brief.md): VD01–VD12, N1–N7, TL1–TL8, [projection contract](film-brief.md#projection-contract-and-scale-baseline), [SET-HALL22](film-brief.md#set-plan--set-hall22-space-h-metres-est), [DEMO22](film-brief.md#set-plan--demo22-space-d-metres-est), [sound direction](film-brief.md#sound-direction)); storyboard **EDU-EP22-STORYBOARD-R2** ([storyboard.md](storyboard.md): casting, purposes, truth limits per shot; this sheet owns every timed and numeric value and wins on conflict); measure **EDU-EP22-NARRATION-MEASURE-R2** ([narration-measure.json](narration-measure.json)); locked audio `~/ReelsStore/projects/edu/EDU/narration/EP22_narration_kore_x0.9025.wav` (sha256 `ca6ca187…f602`, 54.59 s, 1638 f).
- **Target:** branch `claude/ep22-khun-tee-chim-yaphit-3ae8d2` at `a3cae72` + uncommitted EP22 files · 30 fps · `durationFrames` **1717** (57.24 s; speech ends G 1627, closing hold 90 f) · 1080×1920 · composition `EDU-EP22-SHORT` `missing` (Editor registers it, never in `src/Root.tsx`) · one story scene S01 = one composition, offset 0 · ending closed, no loop seam.
- **Review rows:** [review-rows.json](review-rows.json) **EDU-EP22-ROWS-R4** (R2: `seen` text of SH09, SH12, SH15, SH16, SH17 rewritten, SH12's flag replaced; every other row unchanged so its answers carry over by hash). Review page: pending.

## Units and conventions

- **Spaces** `H` (hall) and `D` (demo top), metres, axes as the brief's projection contract (brief: VD01). `H`: origin on the floor under the centre of CT, +x screen-right from the open-hall side, +y up, +z toward the open doors; yaw 0 puts the camera on +z looking −z, positive yaw swings it toward +x. `D`: origin on the paper at the egg-dish centre, +z toward the camera.
- **Camera lines** map one-to-one to `camMove(at, yaw, r, eye, {f, hy, pitch, ease})` (`src/painted/kit/cam-moves.ts`, read with `camOf`): `at` start → end, `yaw`/`r`/`eye` start → end, `pitch` in degrees (positive up), `hy` the picture row of the optical axis, `ease` the smoothstep window as shot fractions. **Pitch is level (0) unless written** (kit default; LF01 and LF01b were painted level), replacing the storyboard's "pitch follows from eye and at.y". Without `ease` the whole shot runs `sine01` (as `camAt` in `src/painted/edu22/stage.ts`). In `D`, `eye = at.y + r·tan(−pitch)` (as `SH14` in `looks.ts`).
- **Clocks.** `G` = composition frame = scene-local frame (offset 0). Shot-local `l` = G − shot start. Ranges are half-open `[start, endExclusive)`.
- **Projection lines** give pixel x,y (origin top-left, 1080×1920) of named anchors at the shot's first / last frame. "Lead" = the CHILD's cap top (0, 1.28, −0.72) to the table plane (0, 0.66, −0.72), a conservative pinhole span (Boss's probe measures cap top to the visible bottom and reads higher: LF01 729 px vs 612 here).
- **Frame zones:** caption band y 1176–1344 (stroke captions, no backdrop, inside x 120–888); faces, the tag, spoons, egg strip, cup strip and glints above y 1160; `@TamMaiLa` top-left, keep x < 330, y < 140 clear.
- **Axis:** camera stays at z > −0.5 in `H`; LT always screen-left of the child, the dowager's doorway screen-right.
- **Prop anchors** (brief set plan, plus): LT bowls `LT-A01..A14` (x −3.35, z +2.04 → −2.64, pitch 0.36) and `LT-B01..B14` (x −3.85); a removed cover sits on the runner on its bowl's +z side at (bowl x, 0.823, bowl z + 0.17) (`hall.ts`, existing-integrated); tag in A01 (−3.35, 0.90, 1.68); taster's saucer `SAU` (−3.30, 0.83, 2.24); CT trays `TR1` (−0.30, 0.66, −0.16), `TR2` (+0.30, 0.66, −0.16), `TR3` (−0.30, 0.66, +0.24), `TR4` (+0.30, 0.66, +0.24); rice bowl `RB` (0, 0.66, −0.36), child's spoon `CS` (0.12, 0.66, −0.36).
- **Glint anchors** (screen SVG locked to world points through the shot camera, brief VD08): `G-TAG` (−3.35, 0.90, 1.68), `G-SPOON` the spoon on SAU (−3.30, 0.84, 2.24), `G-COVER` the rim of A05's removed cover (−3.35, 0.86, 0.77) (R1 change: A03 → A05, see change log).
- **Caller Y marks (R1):** the brief's mark (−2.70, 0, +2.70) stands in the lens line of SH02, SH09, SH11, SH12 and SH17 (0.1–1.3 m from those cameras: on the lens or a giant foreground figure). Y therefore waits at the stand-by mark **(−1.80, 0, +3.70)**, facing −x, in SH01–SH09 and SH11–SH17 (body corners at y 0.2–1.58 m, ±0.25 m, behind or outside every one of those frames by projection), and stands on (−2.70, 0, +2.70) in SH10, SH19 and SH20 (outside SH18 and SH20a by projection). The off-screen moves happen across cuts; no frame shows him travel.
- **Casting** as the storyboard's [casting table](storyboard.md#casting) (brief VD02/VD03); not repeated.

## Narration and subtitles (checked-with-audio, MEASURE-R2)

One continuous narration file placed at **G 0** (file time × 30 = G). Subtitle rule: a cue shows from speech onset to speech end + 6 f, never past the next line's onset; a line with an ellipsis or a named split changes card on its inner anchor. Stroke captions in the band, `captionStyle.position: 'middle'` or the episode's band placement (Editor), no backdrop. V01 (non-verbal "หืม?") is not subtitled. No other on-screen text.

| Line | Speech G [on, end) | Subtitle cards G [start, end) | Inner anchors G |
| --- | --- | --- | --- |
| L01 | 8–132 | "ถ้าคุณเป็นขันที ชิมอาหารให้ฮ่องเต้จีน..." 8–86 · "คุณต้องชิมก่อนทุกจาน" 86–138 | "ถ้าคุณเป็นขันที" ends ≈ 36 (est); "ชิมอาหาร" ≈ 37 (est); "คุณต้องชิมก่อนทุกจาน" 86 (RMS; measure 85) |
| L02 | 146–243 | "แต่ฮ่องเต้องค์สุดท้าย..." 146–186 · "ไม่แตะโต๊ะเกือบสามสิบจานนั้นเลยนะ" 186–249 | ellipsis gap 182–186; "ไม่แตะ" 186 (RMS; measure 183) |
| V01 | 247–259 (child, Editor's cast) | not subtitled | — |
| L03 | 263–302 | "อ้าว แล้วเด็กคนนี้กินอะไร?" 263–308 | "อ้าว" 263–269; "แล้วเด็กคนนี้" 278 (RMS; measure 280) |
| L04 | 321–437 | "ปูยีกินกับข้าวที่ฝั่งไทเฮาส่งมาต่างหาก..." 321–403 · "ราว ๆ ยี่สิบจาน!" 403–443 | ellipsis gap 395–402; "ราว ๆ ยี่สิบจาน" 403 (RMS; measure 406); "ยี่สิบ" ≈ 413 (est) |
| L05 | 463–540 | "แต่ถ้าไม่กิน..." 463–502 · "โต๊ะยาวนั่นตั้งไว้ทำไม?" 502–546 | "โต๊ะยาวนั่น" 502 |
| L06 | 565–662 | "ดูก่อนนะ..." 565–594 · "ทุกจานมีแผ่นเงินเล็ก ๆ ใส่ไว้กันพิษ" 594–668 | "ทุกจาน" 594; "แผ่นเงินเล็ก ๆ" ≈ 612 (est) |
| L07 | 677–806 | "ขันทีชิมจานละนิดก่อนยกมา" 677–744 · "แล้วขันทีน้อยก็ร้อง "เปิดฝา!"" 744–812 | "ชิม" ≈ 689 (est); "แล้วขันทีน้อย" 744; "เปิดฝา" 785 (RMS; measure 784), "ฝา" ≈ 795 |
| L08 | 823–880 | "ยิ่งด่านเยอะ ยิ่งดูปลอดภัย ใช่ไหม?" 823–886 | "ยิ่งดูปลอดภัย" 848 (RMS) |
| L09 | 888–968 | "แต่แผ่นเงินเนี่ย จับพิษได้จริงเหรอ?" 888–974 | — |
| L10 | 974–1019 | "ไข่ต้ม ยังทำเงินดำได้เลย" 974–1025 | "ทำเงินดำ" 990 |
| L11 | 1032–1141 | "ในไข่มีกำมะถัน" 1032–1077 · "เงินดำเพราะมัน ไม่ใช่เพราะพิษ" 1077–1146 | "เงินดำเพราะมัน" 1077; "ไม่ใช่เพราะพิษ" ≈ 1109 (RMS dip) |
| L12 | 1146–1211 | "พิษที่ไม่มีกำมะถัน เงินก็เฉย" 1146–1217 | "เงินก็เฉย" 1190 (RMS) |
| L13 | 1225–1280 | "ด่านนี้ ดูปลอดภัยกว่าที่เป็นนะ" 1225–1286 | "ด่านนี้" 1225; "นี้" ≈ 1232 (est) |
| L14 | 1304–1363 | "แล้วตกลง โต๊ะยาวนั่นมีไว้ทำไม?" 1304–1369 | "โต๊ะยาวนั่น" 1332 (RMS) |
| L15 | 1384–1456 | "เพราะมันทำไว้โชว์..." 1384–1429 · "ไม่ได้ทำไว้กิน" 1429–1462 | "ไม่ได้ทำไว้กิน" 1429 (RMS) |
| L16 | 1463–1627 | "โต๊ะยาวนั่น มีไว้ให้ดูจริง ๆ..." 1463–1552 · "ส่วนที่ปูยีกินจริง คือจานตรงหน้าเขา" 1552–1633 | "มีไว้ให้ดูจริง ๆ" 1493; breath 1537–1551; "ส่วนที่ปูยีกินจริง" 1552 (RMS; measure 1546); "คือ" 1596; "จานตรงหน้าเขา" 1602 (RMS; measure 1600) |

ER09 check on the read (Preaw/Boat own the rule): the silver explanation L10–L12 runs G 974–1211 = 7.9 s; L10 onset to L13 end 10.2 s. Recorded, not a Film change.

## Shot map

| Shot | Beat | G [start, end) | Length | Lines | Clues / claims |
| --- | --- | --- | --- | --- | --- |
| B01-SH01 | S01-B01 | 0–37 | 37 f (1.23 s) | L01 "ถ้าคุณเป็นขันที" | CL22-01 plant |
| B01-SH02 | S01-B01 | 37–140 | 103 f (3.43 s) | L01 rest | C03, CL22-04 |
| B01-SH03 | S01-B01 | 140–244 | 104 f (3.47 s) | L02 | C05; CL22-03 glimpse |
| B02-SH04 | S01-B02 | 244–274 | 30 f (1.00 s) | V01, L03 "อ้าว" | — |
| B02-SH05 | S01-B02 | 274–400 | 126 f (4.20 s) | L03 rest, L04 first half | C05, CL22-03 |
| B02-SH06 | S01-B02 | 400–456 | 56 f (1.87 s) | L04 "ราว ๆ ยี่สิบจาน!" | C05 (twenty), F06/O1 |
| B03-SH07 | S01-B03 | 456–562 | 106 f (3.53 s) | L05 | central question |
| B03-SH08 | S01-B03 | 562–674 | 112 f (3.73 s) | L06 | C04, CL22-02 plant |
| B03-SH09 | S01-B03 | 674–740 | 66 f (2.20 s) | L07 first half | C03, CL22-04 |
| B03-SH10 | S01-B03 | 740–800 | 60 f (2.00 s) | L07 "แล้วขันทีน้อยก็ร้อง "เปิดฝา!"" | lid call |
| B03-SH11 | S01-B03 | 800–846 | 46 f (1.53 s) | L07 tail, L08 "ยิ่งด่านเยอะ" | lid ripple (reconstructed) |
| B03-SH12 | S01-B03 | 846–886 | 40 f (1.33 s) | L08 rest | refrain plant |
| B04-SH13 | S01-B04 | 886–972 | 86 f (2.87 s) | L09 | silver question |
| B04-SH14 | S01-B04 | 972–1026 | 54 f (1.80 s) | L10 | C07/C08 show |
| B04-SH15 | S01-B04 | 1026–1144 | 118 f (3.93 s) | L11 | C07 sulfur |
| B04-SH16 | S01-B04 | 1144–1220 | 76 f (2.53 s) | L12 + silence | S06 |
| B04-SH17 | S01-B04 | 1220–1292 | 72 f (2.40 s) | L13 | refrain flip (silver only) |
| B05-SH18 | S01-B05 | 1292–1380 | 88 f (2.93 s) | L14 | central question re-asked |
| B05-SH19 | S01-B05 | 1380–1460 | 80 f (2.67 s) | L15 | C05 "for show" |
| B05-SH20 | S01-B05 | 1460–1717 | 257 f (8.57 s) | L16 + hold 90 f | C05 payoff, CL22-01/03 |

Every cut except SH01→SH02 (mid-L01, est) and SH10→SH11 (on "ฝา", intended) falls in a measured speech gap. All cuts are hard cuts; no transitions.

## Sound plan (whole video)

As the brief's [sound direction](film-brief.md#sound-direction) (M1/M1b/M2, END1, A1/A2, S1–S14, V01–V02, silence policy, ducking); the shot blocks place every cue at a shot-local frame with its global frame. All cues NEEDS-GEN for Ton except S7 (library candidate `comedy_pluck-question-bend_01`). New in R1: **S2b** NEEDS-GEN, the S2 cover set back down: a domed silver cover lowered onto a porcelain bowl rim, a soft settle and a very short damped ring / one / thin silver on porcelain / hall, close / 0.4 s / tidy, routine. **V02 is dropped** (optional in the brief): the hold carries END1 and two spoon taps only. **END1** note 1 at G 1602, note 2 at G 1647 (+45 f) left ringing; nothing new after note 2. A1 runs to the end, fading over G 1697–1717.

## Shot sheets

### B01-SH01 · 0–37 · frame 0, the child and the long table

- **Direction:** frame 0 shows the strange thing (retention camera): the tiny emperor on the huge carved seat at right of centre, LT's 28 silver domes running out of frame left behind him, lifters E1–E3 on its far side. CT empty. Reveals nothing about who eats what.
- **Camera (binding hy, LF01):** `cam: H, at (−0.2, 1.0, −0.7), yaw 72 → 64, r 1.35 → 1.25, eye 1.05, pitch 0, f 1150, hy 580` over l 0–37 (8° arc, 7 % push). LF01 = l 0.
- **Staging:** CHILD hips (0, 0.62, −0.72), view `front` squared to the mid-shot camera (LF01 card, accepted), P31, `neutral` (bored), pupils toward LT (look −1.35, 0.1 as LF01); feet swing above the footstool, ambient clock period 40 f. E1–E3 at (−4.50, 0, +1.20 / −0.30 / −1.80), view `front`, P01, arms down.
- **Projection:** l 0 cap (620, 353), eye (620, 511), table plane (620, 965), lead 612 px (Boss probe 729), LT far end (787, 630), E2 head (170, 439); l 36 cap (653, 335), lead 661 px, LT far end (665, 630), E2 head (17, 429). Face above the band; CT out of frame bottom-left.
- **VO/subs:** L01 from G 8 (l 8) "ถ้าคุณเป็นขันที"; card 1 from G 8.
- **Sound:** A1 from l 0 (G 0). M1 from l 0 (G 0), medium-low, the four-note motif's first phrase. No SFX.
- **Mix intent:** lift (open on the setup).
- **Cut:** hard cut at G 37 on "ชิมอาหาร" (est ±5 f; Editor nudges to the syllable by ear).
- **Entry → exit:** LF01 → same, 8° later; covers all on; CT empty.
- **Acceptance:** l 0 reads child + LT + lifters with no text; child lead ≥ 480 px; covers read as silver domes.

### B01-SH02 · 37–140 · "you" are the taster

- **Direction:** over T's shoulder at the near end of LT, row of domes receding up and right of frame; A01 at centre. Calm practised tasting (C03). No child (TL1).
- **Camera:** `cam: H, at (−3.35, 0.88, 1.68), yaw 30 → 27, r 1.10 → 1.02, eye 1.55, pitch −25, f 1100, hy 760` over l 0–103. Camera at (−2.80, 1.55, 2.63) → (−2.89, 1.55, 2.59). R1 change: storyboard yaw 64 → 58 put T between the lens and A01; at yaw 30 T stands just right of the lens line, so **his shoulder is the right foreground** (the storyboard's "left" is geometrically impossible while the row recedes away from the camera: T stands on the +x side of the bowls, as SH09 also shows).
- **Staging:** T at (−2.90, 0, +1.80), world `facing` −x (`backQuarter` cue), P01 → `new: spoon-taste`, `neutral`. Left mitten lifts A01's cover l 3–15 and holds it beside the bowl; right mitten (spoon) dips l 50 (G 87, "คุณต้องชิม"), lifts l 50–60, tastes l 60–74 (spoon to mouth, out of frame top-right), left mitten sets the cover back l 76–86, T turns half a step toward A02 (−3.35, 0.88, 1.32) l 88–103.
- **Props/hands:** entry spoon in right mitten, left free, A01 covered; exit spoon in right mitten, A01 covered.
- **Projection:** l 0 A01 (540, 882), A02 (667, 767), A14 (1049, 421), T shoulder (1016, 486); l 102 A01 (540, 920), T shoulder (1080, 505, cut by the right edge). SAU (230, 1289) sits in the band (empty, no story).
- **VO/subs:** L01 continues; card 2 "คุณต้องชิมก่อนทุกจาน" G 86–138.
- **Sound:** M1 continues. **S2** cover lift at l 3 (G 40). **S4** spoon dip at l 50 (G 87). **S2b** set-down at l 84 (G 121).
- **Mix intent:** hold.
- **Cut:** hard cut at G 140 (gap 132–146) on T's turn, never on the spoon (brief risk 2).
- **Entry → exit:** A01 covered → A01 covered, T turned toward A02.
- **Acceptance:** cover moves only in a hand; spoon in the mitten through the dip; T calm; A01 above the band.

### B01-SH03 · 140–244 · the emperor does not touch it

- **Direction:** child right of centre behind CT, LT soft at screen-left. His eyes slide along the covers, then on "ไม่แตะ" he turns his head screen-right toward the warm doorway; the first tray edge pokes in at the right edge as L02 ends (CL22-03 glimpse).
- **Camera:** `cam: H, at (−0.25, 0.98, −0.72), yaw 34 → 28, r 1.40 → 1.28, eye 1.08, pitch 0, f 1150, hy 760` over l 0–104.
- **Staging:** CHILD view `front`, P31, `neutral`; pupils sweep from LT far end to beyond it l 6–40; `turn-head-right` l 40–46, landing l 46 (G 186, "ไม่แตะ"); a small `surprised` lift l 90–100 as the tray edge appears. Faint warm spill grows on his right cheek l 46–104. K1 (body out of frame) on a line z −0.75 walking −x: tray leading edge (+0.60, 1.10, −0.75) at l 86 → (+0.21, 1.10, −0.75) at l 103 (screen x ≈ 1000, about 80 px inside the right edge; ≤ 15 % of the width).
- **Projection:** l 0 cap (729, 577), eye (729, 723), lead 566 px, LT far end (205, 818); l 103 cap (758, 562), lead 613 px, LT far end (94, 821), tray edge at x ≈ 1000 (solved: +0.25 → x 1029 at l 103).
- **VO/subs:** L02 G 146–243 (l 6–103); cards G 146–186, 186–249.
- **Sound:** M1 under "แต่ฮ่องเต้องค์สุดท้าย..."; **M1 cuts to near-silence at l 43 (G 183)** in the ellipsis gap, **S1** dry porcelain tick alone at l 43 (G 183). A1 continues. **S5** tray procession starts off-screen right at l 88 (G 228), low.
- **Mix intent:** drop on "ไม่แตะ".
- **Cut:** hard cut at G 244, right after L02 ends (243).
- **Entry → exit:** gaze on LT (match SH01) → head turned screen-right, tray edge in frame right.
- **Acceptance:** head turn lands G 186 ± 3; no disgust; tray edge visible from l 95; face above the band.

### B02-SH04 · 244–274 · "huh?"

- **Direction:** close on the child, front three-quarter, leaning screen-right, head cocked, warm door light on that side. The child reacts before the narrator asks (ER02). The narrator's "อ้าว" (L03's first word) lands on this face.
- **Camera:** `cam: H, at (0.0, 1.08, −0.72), yaw 22 → 18, r 0.95 → 0.85, eye 1.10, pitch 0, f 1150, hy 760` over l 0–30 (a 1 s punch-in, intended for the comic beat).
- **Staging:** CHILD front three-quarter (close-up allowance), P31 leaning 8° toward +x l 0–8, `headCock` right l 0–8, `suspicious` l 0–19 → `surprised` l 19–30 (on "อ้าว", G 263).
- **Projection:** l 0 cap (540, 542), eye (540, 736), lead 751 px; l 29 cap (540, 516), eye (540, 733), lead 839 px; body below y 1176 (no story there).
- **VO/subs:** V01 "หืม?" G 247–259 (l 3–15, Editor's cast; not subtitled); L03 "อ้าว" G 263–269 (l 19–25), card "อ้าว แล้วเด็กคนนี้กินอะไร?" from G 263.
- **Sound:** **S7** `comedy_pluck-question-bend_01` at l 5 (G 249) under V01 (library candidate; Ton checks key against M1). S5 steps grow off-screen right. M1 near-silent.
- **Mix intent:** hit (comic question).
- **Cut:** hard cut at G 274 (gap 269–278).
- **Entry → exit:** head already turned right (match on SH03 exit) → lean held, eyes right.
- **Acceptance:** face above y 1160; reads about five years old; "อ้าว" plays on the face.

### B02-SH05 · 274–400 · the dishes arrive

- **Direction:** the procession from the warm doorway: carriers walk screen-left toward CT, the camera trucks with them; the child enters frame at left and reaches before "ปูยีกิน" (ER02); four trays land one after another on L04.
- **Camera:** `cam: H, at (3.8, 1.2, −1.0) → (0.35, 0.95, −0.25), yaw 12 → 24, r 3.1 → 2.4, eye 1.5, pitch 0, f 1000, hy 680, ease [0, 0.87]` (truck l 0–110, hold l 110–126). R1 change: hy 760 → 680 so TR4's set-down (y 1106) and CT's near edge (y 1121) clear the band.
- **Staging (R1 carrier plan; replaces the brief's carrier marks, reason: every tray must be reachable from its carrier's mark, ≤ 0.75 m from the shoulder line, and TR1 is reachable only from the left side):** all P26 tray grip at the short ends, `walk-in-from-right`, view by travel (`left` while walking −x), `neutral`, about 1.0–1.1 m/s.
  | Carrier | l 0 position | Path | Mark (arrive) | Sets tray (S6) |
  | --- | --- | --- | --- | --- |
  | K1 | (−0.70, 0, +0.85) rounding the front-left (time compressed across the SH04 cutaway; out of frame) | → (−0.95, 0, −0.25) | l 45 | TR1 at l 64 (G 338) |
  | K2 | (+1.50, 0, −1.00) | → (+0.80, 0, −0.50) | l 26 | TR2 at l 78 (G 352) |
  | K4 | (+3.30, 0, −1.00) | via (+1.25, 0, −0.60) → (+0.95, 0, +0.45) | l 85 | TR4 at l 92 (G 366) |
  | K3 | (+2.40, 0, −1.00) | via (+1.30, −0.60), (+0.60, +0.95) → (−0.30, 0, +0.95) | l 100 | TR3 at l 106 (G 380) |
  Each tray is released only on contact; the carrier steps back 0.3 m over the next 10 f. CHILD view `front`, P31, `surprised` → `seated-reach-hover` l 32–47 (reach starts before "ปูยีกิน", G 321) → `happy` from l 64; hands hover over the landed trays, never touch a carrier.
- **Projection:** l 0 doorway (1028, 751), child out of frame left; l 125 cap (497, 754), eye (497, 808), lead 209 px, TR1 (296, 1005), TR4 (416, 1106), CT near edge (222, 1121). **Lead exception** (brief: carriers and trays are the subject); the child reaches 296+ px with his face at the top of SH06 and ≥ 480 px again in SH07.
- **VO/subs:** L03 "แล้วเด็กคนนี้กินอะไร?" G 278–302 (l 4–28); L04 G 321–394 first half (l 47–120); cards G 263–308, 321–403.
- **Sound:** **S5** tray procession under l 0–90 (cloth-shoe steps, porcelain rattle). **S6** ×4 at l 64, 78, 92, 106 (G 338, 352, 366, 380), each a little varied. M1 near-silent. A1.
- **Mix intent:** build.
- **Cut:** hard cut at G 400 (gap 395–402).
- **Entry → exit:** doorway, carriers walking → four trays on CT, carriers stepping back, child's hands over the dishes.
- **Acceptance:** reach starts by G 314; each tray lands on contact at its frame ± 2; dishes do not slide; no carrier tastes, lifts or checks anything (TL2); about twenty dishes (four trays of five).

### B02-SH06 · 400–456 · about twenty dishes

- **Direction:** high angle over CT: twenty open, lightly steaming home-style dishes fill the table; the child at the top of frame grabs CS, laughing; carriers leave frame right.
- **R2 (viewer note: a scowling foreground eunuch covers the left third):** only **K2 and K4** (code indices 1 and 3, the paths behind CT) are drawn; K1 and K3 (the front-of-table paths along z +0.75 / +0.9 that pass beside the lens) have left across the cut and are not in this shot. Shot-local (`B02-SH06.ts`: `[1, 3]` instead of `[0, 1, 2, 3]`); `procession.ts` unchanged. Acceptance: on l 0, l 28 and l 55 no figure in the left 40 % of the frame (x < 432) below y 700; K2/K4 out of frame by l 40.
- **Camera:** `cam: H, at (0.0, 0.70, −0.10), yaw 15 → 12, r 1.55 → 1.35, eye 1.70, pitch −35, f 1050, hy 700` over l 0–56.
- **Staging:** CHILD view `front` (pitch cue on), P31 → right mitten picks up CS at (0.12, 0.66, −0.36) l 10–20, `laugh` from l 13 (G 413). K1–K4 `walk-out-to-right`, out of frame by l 40 (K1 rounds the front of CT first).
- **Props/hands:** exit CS in the child's right mitten over RB.
- **Projection:** l 0 cap (624, 234), eye (621, 320), TR1 (394, 639), TR4 (678, 834), CT near edge (436, 896); l 55 cap (613, 257), TR4 (710, 932), CT near edge (445, 1021). The whole spread above y 1176. Child lead 296–314 px: **lead exception** (R1, Film: the spread is the subject, F06/O1; his face is at the top of frame and above the band).
- **VO/subs:** "ราว ๆ ยี่สิบจาน!" G 403–437 (l 3–37); card G 403–443.
- **Sound:** **M1 returns bouncy** at l 3 (G 403) on "ราว ๆ". **S8** soft round comic pop at l 13 (G 413) on "ยี่สิบ". A1.
- **Mix intent:** lift.
- **Cut:** hard cut at G 456 (gap 437–463).
- **Entry → exit:** trays just landed → child holding CS over RB, smiling; no carrier in frame.
- **Acceptance:** about twenty separate dishes countable at 540 px; no tag, cover or glint on CT (TL2); no count label (VD12).

### B03-SH07 · 456–562 · the question swings to the long table

- **Direction:** starts on the child eating at right (not looking at LT); on "โต๊ะยาวนั่น" the camera swings screen-left across the hall and settles on the row of covered domes and the lifters by "ตั้งไว้ทำไม?".
- **Camera:** `cam: H, at (−0.3, 0.95, −0.6) → (−3.5, 0.95, −0.4), yaw 62 → 74, r 1.4 → 2.8, eye 1.05, pitch 0, f 1100, hy 760, ease [0.43, 0.79]` (hold l 0–46, swing l 46–84 = G 502–540, settle l 84–106). End camera at (−0.81, 1.05, 0.37), 0.21 m clear of CT's left edge.
- **Staging:** CHILD view `front`, `new: seated-spoon-to-mouth` + `eat-chew`, one bite l 4–34, `happy`, never looks at LT; leaves frame right around l 60. E1–E3 view `front`, P01. T at (−2.90, 0, +1.80) view `left`, idle.
- **Projection:** l 0 cap (768, 548), eye (768, 695), lead 572 px, LT far end (655, 807); l 105 child behind the camera, E2 head (430, 569), E3 head (824, 588), LT spans the frame (near end out left, far end out right).
- **VO/subs:** L05 G 463–540 (l 7–84); cards G 463–502, 502–546.
- **Sound:** M1 → **M1b** crossfade l 40–46 (G 496–502), M1b (wood block every beat, light zither tremolo) established on "โต๊ะยาวนั่น". A1.
- **Mix intent:** turn.
- **Cut:** hard cut at G 562 (gap 540–565).
- **Entry → exit:** child eating (SH06 exit plus one bite) → LT covers on, lifters still.
- **Acceptance:** swing starts G 502 ± 3 and settles by G 540; no dead frame; child never looks at LT.

### B03-SH08 · 562–674 · the silver tag

- **Direction:** close on A01; T's left mitten enters from screen right on "ดูก่อนนะ", lifts the cover up and out and sets it on the runner; braised food, light steam, the small silver tag leaning in it, readable by "แผ่นเงินเล็ก ๆ" (CL22-02 plant).
- **Camera:** `cam: H, at (−3.35, 0.86, 1.68), yaw 22 → 14, r 0.38 → 0.32, eye 1.02, pitch −25, f 1100, hy 760, near 0.05` over l 0–112.
- **Staging:** T's mitten and sleeve only (`new: cover-lift` one-hand). Mitten enters l 0–4; lift l 4–22 (G 566–584); cover set on the runner at (−3.35, 0.823, 1.85) by l 30 (G 592); mitten exits right l 30–40. Tag readable from l 40 (G 602).
- **Projection:** l 0 tag (540, 616); l 111 tag (540, 675); the set-down cover (284, 1002) → (327, 1219, partly in the band at the end, no story there).
- **VO/subs:** L06 G 565–662 (l 3–100); cards G 565–594, 594–668.
- **Sound:** M1b. **S2** cover lift at l 4 (G 566) on "ดูก่อนนะ".
- **Mix intent:** hold, then reveal.
- **Cut:** hard cut at G 674 (gap 662–677).
- **Entry → exit:** A01 covered → A01 open, its cover on the runner, tag visible.
- **Acceptance:** tag readable at 540 px wide; cover moves only with the hand; tag above y 1160; food looks good (TL6).
- **R2 (viewer note: the strip reads as a stick):** shot-local metal read on the tag from l 36 (G 598), drawn in `B03-SH08.ts` through `longTable.after` (no `tableware.ts` edit): a 2 px (at 1080) edge line `#5f6870` round the tag's face, a white specular streak `#ffffff` at 0.85 opacity along its long axis (0.003 m wide, the middle 70 % of its 0.06 m length, i.e. ≈ 9 × 120 px at 1080 at l 40, 4–5 × 60 px at 540), and the face fill lifted to cool silver `#dfe6ee`. Acceptance: at 540 px the tag shows a dark edge and a white streak and reads as a flat metal plate, not a stick; it stays inside the food (no new geometry).

### B03-SH09 · 674–740 · the taster tastes a little

- **Direction:** side view, **R2: medium shot** (T from the cap to the hips; the spoon's trip bowl → mouth crosses about a quarter of the frame): T spoons a little from A01, tastes, nods once, rests the spoon on SAU, puts A01's cover back on and steps toward A02. Lifters still at the far side. No child (TL1).
- **Camera (R2):** `cam: H, at (−3.15, 1.15, 1.85), yaw 12 → 9, r 1.30 → 1.20, eye 1.40, pitch −10, f 1000, hy 640` over l 0–66 (sine). Camera (−2.88, 1.40, 3.12) → (−2.96, 1.40, 3.04), 1.3 m from T (UT13). Replaces R1 `at (−3.2, 1.2, 1.75), yaw 8 → 3, r 2.3 → 2.1, eye 1.5, pitch 0, f 1100, hy 680` (T 837–908 px full figure, the spoon ≈ 25 px at 540: viewer fail).
- **Dressing fix (R2, Boss, shared `hall.ts`):** the "grey box on the table" is the stone base of column (−5, 0, 0), painted over LT by the sort: `paintSorted` orders by camera distance + bias, and LT's item carries `bias 0.3` at its centre (−3.6, 0, −0.3), so from this camera LT sorts at 4.69 m and the column at 4.55 m and the column paints last. The columns at x −5 stand behind LT from every EP22 camera (all cameras at x > −4.05). Fix in `hall.ts` (Boss picks the mechanism, e.g. a column bias ≥ +0.5 m or drawing the x −5 columns in the back pass) so the base sits behind LT's top and apron. The same base projects next to the glints in the R2 SH12 (298, 731) and SH17 (255, 612) frames, so this fix is a dependency of SH09, SH12 and SH17. Shared code: the coordinator lists the pinned shots it repaints before Boss applies it ([fix routing](../../../../docs/sequence-workflow.md#painted-shot-by-shot)).
- **Staging:** T view `left` (profile facing LT), `new: spoon-taste`, `neutral`. Right mitten dips into A01 l 12–18 (G 686–692, "ชิม" ≈ 689), spoon to mouth l 18–30, small nod l 30–36, spoon rests on SAU l 36–44, left mitten lifts the cover from (−3.35, 0.823, 1.85) back onto A01 l 44–56, half step −z toward A02 l 56–66. E1–E3 view `front`, P01.
- **Props/hands:** entry spoon in right mitten, A01 open; exit spoon on SAU, A01 covered, both mittens free.
- **Projection (R2):** l 0 T head top y 1.80 (751, 127), mouth (663, 384), waist y 1.0 (729, 765), A01 (438, 799), SAU (320, 1023), A02 (496, 738), E2 head (297, 407), E1 head (−12, 369, cut by the left edge: far-side background, accepted); l 65 head top (767, 102), mouth (671, 378), A01 (424, 823), SAU (314, 1090), E2 head (251, 405). Spoon trip A01 → mouth ≈ 480 px at 1080 (240 px at 540); spoon ≈ 0.13 m × 700 px/m ≈ 90 px (45 px at 540). T's head and cap clear the mark box (x ≥ 660). Column (−5, 0, 0) base (148, 771) → (95, 787): hidden behind LT's far apron once the dressing fix is in.
- **VO/subs:** L07 first half G 677–733 (l 3–59); card G 677–744.
- **Sound:** M1b. **S4** spoon dip at l 15 (G 689) on "ชิม". **S2b** set-down at l 54 (G 728). Spoon onto SAU: no cue (do not echo S1).
- **Mix intent:** hold.
- **Cut:** hard cut at G 740 (gap 733–744).
- **Entry → exit:** A01 open with the tag → A01 covered, spoon on SAU, T beside A02.
- **Acceptance:** spoon contact on the bowl and on SAU held; T calm throughout (TL6). Risk: six actions in 66 f; if Boss's motion reads rushed, drop the nod first (no story loss). **R2:** on the 540 px draft frames l 15, l 24 and l 40 a viewer names "he tastes from the bowl with a spoon": spoon visible in the mitten at the bowl (l 15) and at the mouth (l 24), T's face ≥ 110 px tall at 540; no grey box or other prop on the table top; staging, motion frames and sound cues unchanged from R1.

### B03-SH10 · 740–800 · the young eunuch's call

- **Direction:** close on caller Y at the near end of LT; on "เปิดฝา!" he lifts his chin and opens his mouth, head turned toward the lifters at screen-left; LT and lifters soft behind him.
- **Camera:** `cam: H, at (−2.75, 1.42, 2.70), yaw 20 → 14, r 1.20 → 1.05, eye 1.45, pitch 0, f 1100, hy 760` over l 0–60.
- **Staging:** Y at (−2.70, 0, +2.70), front three-quarter (close-up), P01, mouth closed l 0–40; chin up 12° l 40–46; `talk` mouth open from l 45 (G 785, "เปิด") through l 60 ("ฝา" from ≈ l 55).
- **Projection:** l 0 head top (584, 639), chin (584, 806), E1 head (152, 674), LT far end (725, 861); l 59 head top (591, 622), chin (591, 813), E1 head (39, 666).
- **VO/subs:** "แล้วขันทีน้อยก็ร้อง "เปิดฝา!"" G 744–806 (l 4–60+); card G 744–812.
- **Sound:** M1b; the call is the narrator's line (no extra voice).
- **Mix intent:** hold.
- **Cut:** hard cut at G 800 on "ฝา" (call still sounding; the ripple starts on the call).
- **Entry → exit:** Y still, mouth closed → chin up, mouth open on the last syllable.
- **Acceptance:** mouth opens G 785 ± 3; face above y 1160.

### B03-SH11 · 800–846 · the lid ripple (reconstructed)

- **Direction:** truck along LT from the near end toward the far end; covers come off in a quick ripple left → right, each under a lifter's mitten, set on the runner beside their own bowls; T lifts A01/A02 at the near end. CT never in frame (TL2).
- **Camera:** `cam: H, truck at (−3.6, 0.9, +2.0) → (−3.6, 0.9, −0.8), yaw 68, r 2.0, eye 1.35, pitch 0, f 1000, hy 760` over l 0–46 (1.8 m/s truck; the table is the subject, lead exception).
- **Staging:** T (spoon on SAU, both mittens free) lifts A01 l 0–6 and A02 l 4–10. E1–E3 view `front` (facing +x, toward the camera side), `new: cover-lift`, each covering ±0.6 m of z around its mark; covers come off in z order from A03 at l 6 with 2.5 f offsets (both rows paired), each set at (bowl x, 0.823, bowl z + 0.17); covers beyond any visible lifter's reach are already off when they enter frame (brief VD07). About 14 visible lifts in l 6–40.
- **Projection:** l 0 LT near end (340, 1046), A01 (747, 1009), E1 head (669, 648), E2 head (1026, 665); l 45 E2 head (238, 628), E3 head (724, 651); LT far end beyond the right edge throughout.
- **VO/subs:** L07 "ฝา" ends G 806 (l 6); L08 "ยิ่งด่านเยอะ" G 823–844 (l 23–44); card 812 ends, L08 card from G 823.
- **Sound:** **S3** lid ripple cascade from l 0 (G 800), about 1.5 s, travelling left → right in stereo (label **reconstructed** in the cue sheet). M1b peaks under it.
- **Mix intent:** hit.
- **Cut:** hard cut at G 846 (gap 844–848).
- **Entry → exit:** all 28 covers on → covers off and beside their bowls along the visible length.
- **R2 (viewer note: the ripple starts late, frame 1 still shows closed lids):** the ripple starts **6 f earlier**: row jobs start at l 0 instead of l 6 (A03 at l 0, same 2.5 f offsets, a hand's second cover still 11 f after its first, so the cascade ends ≈ l 34); T's A01 lift is already 40 % up at l 0 (lift completes l 0–3), A02 l 0–6. Shot-local timing constant in `B03-SH11.ts`. S3 stays at l 0 (G 800) and now meets the first lift. Acceptance: l 0 shows ≥ 2 covers in the air, each in a mitten.
- **Acceptance:** no cover moves without a hand; 28 covers stay matched to 28 bowls. **Build risk:** 14 synced hand-cover contacts in 46 f; fallback (brief VD07): a 3-cover close with the far table already open, same range and cue.

### B03-SH12 · 846–886 · three checkpoints

- **Direction:** warm, orderly three-quarter view down the open LT, **R2: the three checkpoints are the subject** (tag in A01 at centre, the spoon on SAU lower left, A05's removed cover upper right, a diagonal across the middle of the frame); T, a step back with hands folded, is only a sleeve edge at the right; three warm gold glints pop in turn on the tag, the spoon and the cover. R2: SH17 no longer reuses this framing (it pushes in closer, see SH17).
- **Camera (R2):** `cam: H, at (−3.30, 0.88, 1.50), yaw 24 → 20, r 1.50 → 1.40, eye 1.30, pitch −15, f 950, hy 720` over l 0–40 (sine). Camera (−2.69, 1.30, 2.87) → (−2.82, 1.30, 2.82). Replaces R1 `at (−3.4, 0.9, +1.2), yaw 40 → 36, r 2.6 → 2.4, eye 1.5, pitch 0, f 1000, hy 660` (T 924–1037 px filled the right half, glints 6 px at 540: viewer fail). The cut from SH11 (yaw 68 truck) changes the angle by 44° on the same side of LT.
- **Staging:** T at `T_SH12` (−2.45, 0, +1.85) (Boss W5.1 mark, kept) view `left`, P01 hands folded, `neutral`; E1–E3 `front`, P01. Glints in the **R2 glint style GS2** (below), timing unchanged: **G-TAG** l 6 (G 852), **G-SPOON** l 16 (G 862), **G-COVER** l 26 (G 872).
- **Glint style GS2 (R2; SH12 and SH17; sizes in px at 1080, halve for 540):** a four-point star per glint, world-locked through the shot camera as R1. Core radius r = **16** (core Ø 16 px at 540), arms 2.6 r (tip to tip 83 px, **42 px at 540**), body `#ffd36a`, hot centre `#fffaf0` at 0.55 r, a **3 px outline `#5a3c0a` at 0.75 opacity** round the star (edge contrast on the gold runner, the beige wall and the silver cover). Halo radius **90**, centre opacity **0.5** → 0 at the edge, normal blend (screen blend vanishes on beige; this exceeds the kit's `GLOW_PEAK` 0.3 for these three glints only: they are the shot's hero, UT02). Pop: R1's 6 f grow (`glintPop`) plus **one ring** per pop: stroke circle r 16 → 80 over 10 f, stroke 5 → 1 px `#fff2c0` with a 1.5 px `#5a3c0a` outer line, opacity 0.9 → 0. Live after the pop: scale 1 ± 0.06, period 20 f, phases 7 f apart. No ticks, icons or text (VD12). Build home: a module imported **only by SH12 and SH17** (or code in those two shot files), so only those two scenes repaint; `glints.tsx` is imported by `shot.tsx` (every shot), so an edit there needs the coordinator's repaint list first.
- **Projection (R2):** l 0 G-TAG (460, 744), G-SPOON (227, 960), G-COVER (647, 660), E1 head (101, 325), E2 head (439, 379), E3 head (589, 403), LT far end (801, 549), T waist (1222, 799): T's left edge ≈ x 860 (sleeve and folded hands, head out of frame top); l 39 G-TAG (461, 766), G-SPOON (239, 1031), G-COVER (630, 667), E2 head (393, 376), T waist (1316, 820), left edge ≈ x 1030. Glint spread 420 px across, every glint ≥ 210 px from T. G-SPOON's lowest arm tip y 1031 + 42 = 1073 < 1160. Column (−5, 0, 0) base (298, 731) → (249, 744): must be behind LT (SH09 dressing fix).
- **VO/subs:** "ยิ่งดูปลอดภัย ใช่ไหม?" G 848–880 (l 2–34); L08 card to G 886.
- **Sound:** M1 settles warm and confident (from M1b at l 0). **S9** three warm chime ticks rising, at l 6, 16, 26 (G 852, 862, 872), one per glint.
- **Mix intent:** release (comfort).
- **Cut:** hard cut at G 886 (gap 880–888).
- **Entry → exit:** covers off (SH11 exit) → all three glints on.
- **Acceptance:** glints locked to their anchors within 1 px through the push; all three above y 1160; no ticks, icons or text (VD12). **R2, measured on the 540 px draft frame l 39:** each glint core ≥ 14 px across and arms ≥ 36 px tip to tip; core luma ≥ 35 % above its 20 px surround; a viewer without narration counts three lights on the tag, the spoon and the cover; T is not the first thing seen (his sleeve ≤ 20 % of the frame width at l 0, ≤ 5 % at l 39).

### B04-SH13 · 886–972 · can silver catch poison?

- **Direction:** hard cut to the placeless demo top (cool light): white dish with a halved boiled egg, strip A lying beside it, a small clear cup with strip B already standing in it; the child's mitten hand enters from screen right-front and picks up strip A.
- **Camera:** `cam: D, at (0, 0.01, 0), yaw 15 → 9, r 0.38 → 0.33, pitch −55, f 1100, hy 960` (eye 0.553 → 0.481) over l 0–86.
- **Staging:** CHILD HAND (kit `paintHandMacro`, child `MacroTone`, mitten) enters l 20–34 (G 906–920) from screen right-front, pinches strip A at (−0.10, 0.002, +0.05) l 50 (G 936), lifts it above the left yolk by l 80 (G 966): strip tip at (−0.02, 0.04, 0.00).
- **Props/hands:** exit strip A in the right mitten above the yolk; strip B in the cup.
- **Projection:** l 0 left yolk (508, 951), strip A (356, 998), cup (759, 909), strip B top (768, 876); l 85 left yolk (502, 953), cup (788, 881), lifted tip (501, 921).
- **VO/subs:** L09 G 888–968 (l 2–82); card G 888–974.
- **Sound:** hard cut **A1 → A2** at l 0 (G 886). **M2** single low held bowed-bass note with faint cool shimmer from l 2 (G 888).
- **Mix intent:** drop (chapter change).
- **Cut:** hard cut at G 972 (gap 968–974).
- **Entry → exit:** hand out of frame → strip A held above the left yolk.
- **Acceptance:** reads as a demonstration, not a palace; no text, no "ภาพจำลอง" label (user Q1).

### B04-SH14 · 972–1026 · a boiled egg darkens silver

- **Direction:** the hand presses strip A's tip into the left yolk; the tarnish runs from the tip to about 60 % of the strip (time-compressed, unlabelled). LF02 = mid-ramp.
- **Camera (binding, LF02):** `cam: D, at (0.03, 0.012, −0.005), yaw 9 → 4, r 0.19 → 0.15, pitch −50, f 1100, hy 880, near 0.05` (eye 0.238 → 0.191) over l 0–54.
- **Staging:** contact l 6 (G 978), no deeper than 0.01 m; tarnish ramp 0 → 60 % l 12–44 (G 984–1016; grey-black, accepted), passing 40 % (LF02) at l 33 (G 1005); hold l 44–54. Hand pinches the tail only.
- **Projection:** l 0 left yolk (354, 872), pressed tip (353, 865), cup (911, 722); l 53 left yolk (302, 885), tip (300, 876), cup (996, 651). Strip and egg above y 1160.
- **VO/subs:** L10 G 974–1019 (l 2–47); card G 974–1025.
- **Sound:** M2 holds. **S10** tiny damp squish at l 6 (G 978). **S11** dull downward shimmer l 18–54 (G 990–1026, "ทำเงินดำ"), 1.2 s.
- **Mix intent:** hit (soft).
- **Cut:** hard cut at G 1026 (gap 1019–1032).
- **Entry → exit:** strip above the yolk → strip in the yolk, tip ≈ 60 % dark.
- **Acceptance:** darkening visible at 540 px wide; contact shadow under the hand and strip tip (Boss minor note); tarnish never runs backward.

### B04-SH15 · 1026–1144 · sulfur, not poison

- **Direction:** the hand lifts strip A just above the yolk; the camera pushes in on the strip; yellow motes rise from the yolk in short arcs and land on **the still-bright upper part of the strip** (R2), each landing turning the silver black only under it, so cause → effect happens on clean silver in front of the viewer. SH14's 60 % tarnish at the tip stays as it is (continuity; tarnish never runs backward). On "ไม่ใช่เพราะพิษ" nothing new appears.
- **Camera (R2):** two phases, both `demoCam`, pitch −40, f 1100, near 0.05. **Push** l 0–40 (smoothstep, G 1026–1066): at (−0.03, 0.03, 0.01) → (−0.002, 0.038, 0.012), yaw 4 → 1, r 0.22 → 0.125, hy 960 → 860. **Hold** l 40–118 (sine): at fixed, yaw 1 → 0, r 0.125 → 0.115, hy 860. l 0 equals R1 l 0. Replaces R1 `at (−0.03, 0.03, 0.01), yaw 4 → 0, r 0.22 → 0.20, hy 960` (strip ≈ 115 px long at 540, specks ≈ 8 px: viewer fail).
- **Staging (R2):** lift tip from (−0.02, 0.015, 0) to (−0.02, 0.04, 0) l 0–10 (R1). **12 motes** (was 16; deterministic seed), each **Ø 30 px at 1080 (15 px at 540)** at its depth (world radius ≈ 0.0025 m), body `#f0b400`, **2 px outline `#5a3c00`**, highlight `#fff4c0` Ø 10 px offset up-left: the outline keeps them visible on the yolk (yellow on yellow failed). They emerge from the yolk l 14–40 (G 1040–1066, "ในไข่มีกำมะถัน"), rising 0.004 m; each flies a 12 f arc (peak +0.012 m) and lands l 40–74 (G 1066–1100, into "เงินดำเพราะมัน"; R1 ran l 40–80, shortened so the last blot is complete by l 83), one about every 3 f, at u 0.62–0.92 along the strip (u 0 = tip; SH14's front is 0.60, the grip 0.97), across s −0.8…0.8. Each mote sits visibly on the bright silver for **3 f**, then fades into its spot over 3 f while the spot grows over 6 f: a dark blot **Ø 40 px at 1080 (20 px at 540)**, tarnish `#1c1a19`, soft edge 4 px. The tarnish front parameter stays 0.60 (no darkening where no mote landed); by l 86 the overlapping blots cover most of u 0.62–0.92, the strip is dark to about 0.9 and the last 0.9–0.97 by the mitten stays bright. Nothing new from l 83 (G 1109).
- **Projection (R2):** l 0 left yolk (579, 955), lifted tip (581, 908) (R1 values at hy 960); l 40 yolk (437, 873), tip (431, 796), strip u 0.60 (614, 864), u 0.90 (727, 906), grip (757, 916): bright section ≈ 130 × 105 px at 1080 (65 × 52 at 540); l 117 yolk (422, 880), tip (415, 796), u 0.60 (626, 860), u 0.90 (758, 900). Everything above y 1160; cup out of frame right. ±10 px (the demo values were taken at yaw 4 → 0 for the hold).
- **VO/subs:** L11 G 1032–1141 (l 6–115); cards G 1032–1077, 1077–1146.
- **Sound:** M2 holds; specks silent (TL8).
- **Mix intent:** hold.
- **Cut:** hard cut at G 1144 (gap 1141–1146).
- **Entry → exit:** strip in the yolk, 60 % dark → strip above the yolk, dark to about 0.9 where the motes landed.
- **Acceptance:** tarnish grows only under landed specks; no skull, smoke, "S" or text (TL6, VD12). **R2, on 540 px frames:** l 30 shows ≥ 6 motes, each ≥ 13 px across, distinct on the yolk and on the paper; l 42 shows the bright upper part ≥ 55 px long with the first mote sitting on it before any new dark appears; l 90 shows ≥ 8 dark blots on what was bright at l 40. Build home: shot-local in `B04-SH15.ts` (pass `specks: []`, paint the motes and blots after `paintDemo`, never over the mitten), or default-preserving size options in `demo.ts` (SH13/SH14 must render bit-identical; the coordinator lists them as repainted).

### B04-SH16 · 1144–1220 · silver stays bright

- **Direction:** truck right to the cup; the hand sets strip A down **beside the cup on the paper** (R2: was the dish rim, which sat at the frame's left edge in the band), lifts strip B and dips it again, then **lifts it out of the liquid and holds it up in front of the child's dark navy vest** (R2) so the bright silver reads against a dark ground, the black strip A lying just below-left of it on the light paper; on "เงินก็เฉย" a highlight runs down strip B: it stays bright. The child's face leans in from the top of frame, puzzled; a short near-silence after the line.
- **Camera:** `cam: D, at (0.12, 0.03, −0.04), yaw 0 → −4, r 0.36 → 0.32, pitch −30, f 1100, hy 1040` (eye 0.238 → 0.215) over l 0–76. R1 change: hy 960 → 1040 so the leaning face is in frame (top 224 → 128) while the cup stays above the band.
- **Staging:** strip A laid on the dish rim at (−0.05, 0.012, +0.045), tarnished end on the rim, l 0–8 (frame left); the same mitten lifts strip B l 10, dips it l 12 (G 1156), holds it upright, bright throughout. CHILD head, shoulders and one hand, front three-quarter, face anchor (0.14, 0.15–0.30, −0.21): leans in l 20–40 (G 1164–1184) `suspicious`, → `surprised` l 46–52 (G 1190–1196, "เงินก็เฉย"), hold. **R2 staging (replaces the strip A and strip B parts above; the child is unchanged):** strip A starts in the mitten 0.02 m above its new rest and is laid on the paper **beside the cup**, tip (0.075, 0.002, −0.06), top (0.02, 0.002, −0.04), tarnished end toward the cup, l 0–6 (its tarnish as SH15's exit: front 0.60 plus the 12 blots, dark to about 0.9); the mitten moves to strip B l 6–10, lifts it 2.5 cm l 10–11 and dips it back by l 12 (G 1156) as R1; then **lifts strip B out of the liquid l 24–34 (G 1168–1178)** by +0.04 m (tip (0.112, 0.044, −0.034), top (0.132, 0.098, −0.062): the tip just inside the rim, clear of the liquid) and holds it there to the cut. **Highlight sweep** l 46–58 (G 1190–1202, "เงินก็เฉย"): a white band `#ffffff` at 0.9 opacity, 25 % of the strip length, runs tip → top along strip B, then its normal highlight stays. Dark ground: the child's navy vest sits behind strip B from l 34 (Boss may shift the child ±0.02 m in x in this shot file only to keep it there). Fallback if the vest cannot sit behind it: none in R2 (a dark card behind the cup would appear only in SH16 while SH13/SH14 show the cup on plain paper); report to Film.
- **Projection:** l 0 cup (540, 993), strip B top (540, 918), face (590, 224)–(585, 631) 407 px, left yolk (145, 1140); l 75 cup (540, 987), strip B top (540, 902), face (561, 128)–(562, 588) 460 px; strip A on the rim near (90–145, 1140–1173), at the band's top edge. **R2:** cup rim (540, 993) → (540, 987) as R1; strip A rest tip (429, 1075) → (412, 1084), top (284, 1102) → (249, 1121), above the band (R1's rim pose sat at x 7–145 in the band); strip B lifted, l 34 ≈ tip (518, 1015), top (573, 848), l 75 tip (517, 1013), top (572, 822): ≈ 170–195 px long at 1080 (85–98 at 540), over the vest region (Draft frame: vest ≈ x 464–656, y 672–952). Face as R1.
- **VO/subs:** L12 G 1146–1211 (l 2–67); card G 1146–1217.
- **Sound:** **S12** plink at l 8 (G 1152) in the syllable gap (dip at l 12). **M2 fades out** l 46–67 (G 1190–1211). Then **A2 only** l 67–76 (G 1211–1220) and on across the cut to G 1225 (near-silence 14 f, the whole measured gap). R2: the lift-out l 24–34 and the highlight sweep are silent (no new cue).
- **Mix intent:** drop to silence.
- **Cut:** hard cut at G 1220 (gap 1211–1225).
- **Entry → exit:** strip B standing in the cup, strip A in the hand → strip B bright, held up out of the liquid in front of the vest; strip A black on the paper beside the cup; face puzzled (R2).
- **Acceptance:** strip B visibly brighter than strip A by the cut; face above y 1160; plain clear liquid, no label (TL6). **R2, on the 540 px frame l 60:** strip B ≥ 80 px long, ≥ 70 % of its length over the vest or another dark ground, its mean luma ≥ 1.6 × its 15 px surround; strip A's dark part reads black on the light paper, fully above y 1160; both strips in one view, ≤ 200 px apart at 540. Shot-local in `B04-SH16.ts` (strip poses and the sweep are passed or painted there); no `demo.ts` change needed if `paintDemo` takes a free strip A pose.

### B04-SH17 · 1220–1292 · this checkpoint looks safer than it is

- **Direction (R2):** back in the hall, **closer than SH12** on the same three checkpoints (R1 reused SH12's end frame exactly; the viewer read it as a repeat and missed the dim): the tag in A01 just above centre, the spoon on SAU lower left, A05's cover upper right, three warm glints already on; a slow push toward the tag; on "ด่านนี้" G-TAG sputters and goes grey and small; G-SPOON and G-COVER stay warm and keep their live twinkle. The flip is scoped to the silver only. No T in frame.
- **Camera (R2):** `cam: H, at (−3.33, 0.88, 1.62), yaw 22 → 19, r 1.05 → 0.97, eye 1.20, pitch −18, f 1000, hy 630` over l 0–72 (sine, 8 % push). Camera (−2.94, 1.20, 2.59) → (−3.01, 1.20, 2.54). Replaces R1 `at (−3.4, 0.9, +1.2), yaw 36 → 35, r 2.4 → 2.33, eye 1.5, pitch 0, f 1000, hy 660`.
- **Staging (R2):** covers off and T's spoon on SAU as SH12; T stays at `T_SH12`, out of frame right (waist x 1881 → 2039). Lifters: **E2 and E3 only** (E1's head would sit cut at the top-left corner under the mark at (−18, 52)); P01. Glints in **GS2** (SH12) at **scale 1.25** for this closer lens (core r 20, arms tip to tip 104 px at 1080, 52 at 540), all three on (`k` 1, no pop, no ring) from l 0 with the live twinkle. **G-TAG dim DIM2** l 12–24 (G 1232–1244, on "นี้"): l 12–14 core brightness 1 → 0.4, l 15–16 back to 0.8 (one sputter), l 17–24 smoothstep to the dim state: core `#8f8a80`, r × 0.6 (12 px), arms 2.6 r → 1.2 r (a dull dot ≤ 29 px tip to tip at 1080), hot centre off, halo off, twinkle off, the 3 px outline kept so the dead dot still reads. G-SPOON and G-COVER unchanged throughout.
- **Projection (R2):** l 0 G-TAG (501, 607), G-SPOON (170, 990), G-COVER (701, 497), E2 head (418, 164), E3 head (586, 207), LT far end (820, 381); l 71 G-TAG (500, 631), G-SPOON (168, 1116), G-COVER (683, 504), E2 head (373, 159). G-SPOON's lowest arm tip 1116 + 52 = 1168 < 1176 (band top), the tightest margin in the shot; Boss lowers the push to r 1.00 if the measured tip enters the band. Column (−5, 0, 0) base (255, 612) → (209, 623): behind LT after the SH09 dressing fix.
- **VO/subs:** L13 G 1225–1280 (l 5–60); card G 1225–1286.
- **Sound:** cut **A2 → A1** at G 1225 (5 f after the picture cut, keeping the silence whole). **S13** dimmed tag chime at l 12 (G 1232). Sparse **M1 fragment**: two plucks at l 24 and l 36 (G 1244, 1256).
- **Mix intent:** turn.
- **Cut:** hard cut at G 1292 (gap 1280–1304), on the dimmed tag, not the spoon (brief risk 2).
- **Entry → exit:** three warm glints (closer view than SH12) → tag glint a grey dot, two warm.
- **Acceptance:** warm tag glint visible l 0–11 before it dims; dimmed tag distinct at 540 px; the spoon glint never dims (TL1 / C03). **R2, on 540 px frames:** l 6 tag core ≥ 18 px across, arms ≥ 45 px; l 30 tag a grey dot ≤ 15 px with no halo, the other two still ≥ 18 px warm with halos; a viewer without narration says "one light went out"; frame differs visibly from SH12 l 39 (tag ≥ 1.3 × larger on screen).

### B05-SH18 · 1292–1380 · so why the long table?

- **Direction:** child at screen-right eating from his spread; he pauses with the spoon and turns his head toward LT at screen-left (open covers, lifters), curious. Intentional return to the frame-0 axis, now with food in front of him.
- **Camera:** `cam: H, at (−0.7, 1.0, −0.62), yaw 74 → 66, r 2.0 → 1.8, eye 1.05, pitch 0, f 1100, hy 700` over l 0–88. R1 change: storyboard `at x −1.0, yaw 74 → 68` put the child at x 1105 (out of frame right) at the end; at x −0.7 and yaw 66 he stays at x 775 → 884.
- **Staging:** CHILD view `front`, P31 with CS, `seated-spoon-to-mouth` one bite l 0–28, `happy`; spoon pauses mid-air l 30; `turn-head-left` l 32–40, landing l 40 (G 1332, "โต๊ะยาวนั่น"), `suspicious` (curious, not smug).
- **Projection:** l 0 cap (775, 513), eye (775, 643), lead 504 px, LT far end (841, 746), E2 head (272, 572); l 87 cap (884, 489), eye (884, 636), lead 568 px, LT far end (742, 747), E2 head (147, 561). LT runs in from the left edge to behind his head (as LF01).
- **VO/subs:** L14 G 1304–1363 (l 12–71); card G 1304–1369.
- **Sound:** **M1 returns** at l 12 (G 1304). Soft **riser** begins l 40 (G 1332). A1.
- **Mix intent:** build.
- **Cut:** hard cut at G 1380 (gap 1363–1384).
- **Entry → exit:** child eating, head front → head turned to LT, spoon paused.
- **Acceptance:** head turn lands G 1332 ± 3; child lead ≥ 480 px; LT screen-left; no smirk (TL1).

### B05-SH19 · 1380–1460 · made for show

- **Direction:** the one large reveal move: crane up and back from the child's eye height until LT's long row of open silver dishes with T, Y and E1–E3 in a line reads as a formal display, the child small at his table at right with his spread; ceiling beams at the top.
- **Camera:** `cam: H, at (−1.8, 0.8, −0.3) → (−2.1, 0.8, −0.3), yaw 20 → 22, r 4.2 → 6.0, eye 1.1 → 3.4, pitch 0 → −22, f 950, hy 760, ease [0.05, 0.875]` (crane l 4–70, settle l 70–80). End camera at (0.15, 3.4, 5.26): beyond the hall's z +4.2 shell, the near wall is not drawn (Boss check, open). R1 change: end target x −1.8 → −2.1 and yaw 28 → 22 bring Y, E1 and LT's near end in from the left edge (Y head 39 → 128 px).
- **Staging:** CHILD `front` (pitch cue), eating, `happy`. T (−2.90, 0, +1.80), Y (−2.70, 0, +2.70), E1–E3 at their marks, view `front`, P01, standing in attendance.
- **Projection:** l 0 child cap (978, 717), lead 148 px, LT far end (441, 796), Y and T out of frame left; l 79 child cap (874, 739), lead 89 px, LT near end (57, 935), LT far end (502, 658), E1 head (79, 679), T head (230, 753), Y head (128, 858). **Lead exception** (brief: the display is the subject).
- **VO/subs:** L15 G 1384–1456 (l 4–76); cards G 1384–1429, 1429–1462.
- **Sound:** riser resolves into a **warm chord** at l 49 (G 1429) on "ไม่ได้ทำไว้กิน". A1.
- **Mix intent:** release.
- **Cut:** hard cut at G 1460 (gap 1456–1463).
- **Entry → exit:** low near the child → high wide, both tables in frame.
- **Acceptance:** both tables and the child readable at the end; LT screen-left, CT screen-right; rich display, no dust (TL3).

### B05-SH20 · 1460–1717 · the dish in front of him, and the hold

- **Direction:** opens on LT (open domes, lifters) for the first half of L16; a breath at the ellipsis; the camera trucks and descends across the hall to the child eating from his spread and settles on "จานตรงหน้าเขา". Hold: he eats happily, LT soft and far at screen-left. LF01b = last frame.
- **Camera:** two moves. **20a** l 0–82 (G 1460–1542): `cam: H, at (−3.6, 0.9, −0.3), yaw 42 → 40, r 3.3 → 3.2, eye 1.6, pitch 0, f 1100, hy 640` (sine). **20b** l 82–144 (G 1542–1604): `cam: H, at (−3.6, 0.9, −0.3) → (0.0, 0.8, −0.35), yaw 40 → 30, r 3.2 → 1.5, eye 1.6 → 1.5, pitch 0, f 1100, hy 640` (sine, its last 20 f move < 0.5 % of the distance). l 144–257 hold on 20b's end (= LF01b camera `SH20_END`, binding).
- **Staging:** CHILD view `front`, `new: seated-spoon-to-mouth` + `eat-chew` (cycle 48 f; spoon to RB contacts at l 170 and l 178 for S14), `happy` → `relieved` from l 144. No eunuch at CT (TL2). Lifters in attendance at LT.
- **Projection:** l 0 LT far end (915, 802), E2 head (351, 612), E3 head (613, 618); l 82 child out of frame right; l 144+ cap (652, 773), eye (652, 870), lead 375 px pinhole / **503 px Boss probe on LF01b** (same camera), LT far end (188, 774), CT centre (379, 1412), TR1 (277, 1262), TR4 (494, 1741). **Accepted (LF01b, user look lock):** the spread lies in and below the caption band; the card "ส่วนที่ปูยีกินจริง คือจานตรงหน้าเขา" covers part of it G 1602–1633 only, then the hold is caption-free. If the Draft check finds the dish read lost, Boss's note applies: lower the eye 3–4 % (Film re-approves the frame).
- **VO/subs:** L16 G 1463–1627 (l 3–167); cards G 1463–1552, 1552–1633; nothing after G 1633.
- **Sound:** M1 thins under the first half (l 3–77). **Near-silence breath** l 77–92 (G 1537–1552). **END1** note 1 at l 142 (G 1602) on "จานตรงหน้าเขา", note 2 at l 187 (G 1647), left ringing over A1. **S14** two gentle spoon-on-rice-bowl taps at l 170 and l 178 (G 1630, 1638), close, warm, before END1's second note. No event after G 1647. A1 fades over l 237–257 (G 1697–1717).
- **Mix intent:** release, then rest.
- **Cut:** end of video at G 1717 (no loop seam).
- **Entry → exit:** LT framed → final frame: child eating at his spread, LT far left, camera still since l 144.
- **Acceptance:** settle by G 1604 (lands on "จานตรงหน้าเขา" G 1602 ± 3); hold after speech 90 f (≥ 3 s); last frame = LF01b composition; no text in the hold.

<a id="r2-fix-list-boss"></a>
## R2 fix list (Boss)

Numbers in px at 1080 × 1920 unless marked "at 540"; frames shot-local `l` with G in brackets. The blocks above are binding; this list orders the work. Shot lengths, cuts, VO, subtitles and sound cue frames are unchanged everywhere.

1. **Shared, needs the coordinator's repaint list first — column sort (`hall.ts`).** The stone base of column (−5, 0, 0) paints over LT (LT item `bias 0.3` sorts it behind the column). Make the x −5 columns sort behind LT for every EP22 camera. Dependency of items 2, 3 and 6; repaints every hall scene (pixels change only where a column met a table: Boss lists those shots).
2. **SH09** (`B03-SH09.ts`): camera `at (−3.15, 1.15, 1.85), yaw 12 → 9, r 1.30 → 1.20, eye 1.40, pitch −10, f 1000, hy 640`. Motion and timings unchanged. Check l 15 / l 24 / l 40 at 540: spoon ≈ 45 px, spoon trip ≈ 240 px, T's face ≥ 110 px, no grey box.
3. **SH12** (`B03-SH12.ts`): camera `at (−3.30, 0.88, 1.50), yaw 24 → 20, r 1.50 → 1.40, eye 1.30, pitch −15, f 950, hy 720`. Glints in **GS2**: core r 16 (Ø 16 at 540), arms 2.6 r (42 px tip to tip at 540), 3 px `#5a3c0a` outline at 0.75, halo r 90 at 0.5 normal blend, pop ring r 16 → 80 over 10 f, live scale ±6 % at 20 f; pops at l 6 / 16 / 26 (G 852 / 862 / 872) as R1. Build them in a module imported only by SH12 and SH17 (not `glints.tsx`/`shot.tsx`, which every shot imports). Check l 39 at 540: cores ≥ 14 px, arms ≥ 36 px, T's sleeve ≤ 5 % width.
4. **SH15** (`B04-SH15.ts`): camera push l 0–40 `at (−0.03, 0.03, 0.01) → (−0.002, 0.038, 0.012), yaw 4 → 1, r 0.22 → 0.125, hy 960 → 860` (smoothstep), hold l 40–118 `yaw 1 → 0, r 0.125 → 0.115`; 12 motes Ø 30 (15 at 540) `#f0b400` with a 2 px `#5a3c00` outline, emerge l 14–40, land l 40–74 at u 0.62–0.92 (the bright part), 3 f visible on the silver, then a blot Ø 40 (20 at 540) `#1c1a19` grows over 6 f; tarnish front stays 0.60; nothing new from l 83. Shot-local if possible; a `demo.ts` option must leave SH13/SH14 bit-identical.
5. **SH16** (`B04-SH16.ts`): strip A laid on the paper beside the cup (tip (0.075, 0.002, −0.06), top (0.02, 0.002, −0.04)) l 0–6 with SH15's exit tarnish; dip at l 12 as R1; strip B lifted +0.04 m out of the liquid l 24–34 (G 1168–1178) and held; highlight sweep l 46–58 (G 1190–1202), white 0.9, 25 % of the strip; child's navy vest behind strip B from l 34 (child x ±0.02 m allowed). Check l 60 at 540: strip B ≥ 80 px, ≥ 70 % over the vest, luma ≥ 1.6 × surround; strip A above y 1160.
6. **SH17** (`B04-SH17.ts`): camera `at (−3.33, 0.88, 1.62), yaw 22 → 19, r 1.05 → 0.97, eye 1.20, pitch −18, f 1000, hy 630`; lifters E2, E3 only; GS2 at scale 1.25 (core r 20, arms 104 px, 52 at 540), all on from l 0; G-TAG **DIM2** l 12–24 (G 1232–1244): sputter 1 → 0.4 (l 12–14) → 0.8 (l 15–16) → dim by l 24: `#8f8a80`, r × 0.6, arms 1.2 r, no halo, no twinkle, outline kept. G-SPOON's lower arm tip must stay < y 1176 (projected 1168; fall back to r 1.00 if it enters). Check l 6 and l 30 at 540.
7. **SH06** (`B02-SH06.ts`, cheap): draw carriers K2 and K4 only (indices 1, 3). Check no figure at x < 432, y > 700.
8. **SH08** (`B03-SH08.ts`, cheap): metal read on the tag from l 36 via `longTable.after`: 2 px `#5f6870` edge, white streak 0.85 opacity ≈ 9 × 120 px, face `#dfe6ee`.
9. **SH11** (`B03-SH11.ts`, cheap): ripple starts l 0 (was l 6), same offsets; A01 already 40 % lifted at l 0, A02 l 0–6. Check l 0 shows ≥ 2 covers in mittens.

Not fixed in R2 (pass notes): SH01/SH03 thin long table (SH01 l 0 is LF01, user-approved; SH03 is LF01's axis and its "does not touch" reads with the head turn; the table's size is carried by SH07, SH18, SH19); SH20 card over the top row of dishes (LF01b look lock; the card covers G 1602–1633 only and the hold after is caption-free; Boss's "eye −3–4 %" note stays available if the user asks); channel mark tiny on beige (channel `@TamMaiLa` mark, `defaultChrome`: reported, not a shot fix).

## Pre-handoff checks

- **Projection:** run on every world-space shot (values in each block). Lead ≥ 480 px holds in SH01, SH03, SH04, SH07 (start), SH18 and SH20 (Boss probe). Recorded exceptions: SH05 (carriers/trays), SH06 (spread, R1), SH11 (table), SH19 (display), demo closes. Faces, the tag, spoons, strips and glints are above y 1160 in every shot; SH20's spread under the last card is the one accepted overlap.
- **Props and hands** (entry → exit per shot in the blocks): T's spoon right mitten SH02 → SAU from SH09 l 44; A01's cover: on → runner (SH08) → on (SH09) → runner (SH11); CS in the child's right mitten from SH06 l 20; strip A right mitten SH13 l 50 → the paper beside the cup SH16 l 6 (R2; R1: dish rim l 8), the same mitten then holds strip B and lifts it out of the cup l 24–34 (R2). Every listed action is possible with that hand state (no two-handed action while a hand holds a prop).
- **Refrain flip (L13):** R2: SH17 is a closer frame on the same three anchors (R1 shared SH12's end state; read as a repeat); G-TAG dims on "นี้" (G 1232), after 12 f of the warm state; G-SPOON stays warm (C03 tasting stays true).
- **Caption band and mark:** cards stay in the band x 120–888, y 1176–1344; nothing painted in x < 330, y < 140 that competes with `@TamMaiLa` (closest: SH16 face top y 128 at x 561, outside the mark box; R2: SH09 T head top y 102 at x 767, SH17 E2 head (373, 159), both outside; SH17 drops E1, whose head would sit in the box).
- **Shot lengths:** shortest SH04 30 f (one comic beat) and SH01 37 f (frame-0 hook, then cut). Tight: SH09 66 f (six actions; nod is the first to drop), SH11 46 f (ripple; VD07 fallback), SH12 40 f (three glints at 10 f spacing). No move exceeds a 10° arc or 15 % push except the large moves SH07 swing, SH19 crane, SH20b truck and (R2) SH15's push-in l 0–40 (r 0.22 → 0.125, a 43 % push that motivates "look closer" before the motes land).

## Dependencies and open items

| Owner | Dependency / acceptance | Status |
| --- | --- | --- |
| Boss | N1–N7 (brief Boss dependencies) for all 20 shots; plates from this sheet only | open |
| Boss | Motions: `new: spoon-taste`, `new: cover-lift` (ripple sync, 14 contacts in SH11), `walk-in-from-right` / `walk-out-to-right` with P26 trays on the R1 carrier paths | open |
| Boss | SH19 end camera beyond z +4.2: near wall not drawn | open |
| Boss | Glints G-TAG / G-SPOON / G-COVER world-locked, G-TAG dim state (SH17) | R1 built; **R2: GS2 / DIM2** open |
| Boss | R2 fix list items 1–9 ([R2 fix list](#r2-fix-list-boss)); item 1 (`hall.ts` column sort) waits for the coordinator's repaint list | open |
| Coordinator | Shared-code routing for R2: `hall.ts` (item 1, every hall scene); `demo.ts` only if SH15 cannot stay shot-local (SH13/SH14 repaint unchanged); glint module must not be `glints.tsx` | open |
| Editor | Register `EDU-EP22-SHORT` (1717 f), place the locked narration at G 0, subtitle cards above; nudge the SH01→SH02 cut to the syllable by ear (est ±5 f) | open |
| Editor | V01 child "หืม?" cast (≤ 10 s samples first); if no take is chosen, SH04 plays on S7 and "อ้าว" alone | open |
| Ton | M1, M1b, M2, END1 (two notes 45 f apart), A1, A2, S1–S6, S2b, S8–S14 NEEDS-GEN; S7 library check | open, cue sheet from this sheet |
| Boat | Q-B1–Q-B3 (brief), not blocking | open |
| Film | Draft review: SH20 caption over the spread G 1602–1633; SH09/SH11/SH12 pacing | R2: SH20 kept (look lock), SH09/SH11/SH12 fixed; re-check SH09, SH12, SH15, SH16, SH17 (+ SH06, SH08, SH11) on the next Draft |

Element captures: look frames LF01, LF01b, LF02 (`out/edu22/looks/v1/`, store `projects/edu/EDU/previews/ep22-w3-looks-v1/`, `src/painted/edu22/looks.ts` at the working tree of `a3cae72`); no other EP22 element preview exists. Editor scene sample proposal: SH03 → SH05 (G 140–400: the "ไม่แตะ" turn, V01 and the four tray landings).

## Change log

- 2026-11-16 EDU-EP22-SCENES-R1 (Film W4.2): first timed sheet from MEASURE-R2 (voice locked, Kore x0.9025, 57.24 s, 1717 f). All 20 shot IDs, VO, reveals and story order kept from STORYBOARD-R2. Inner anchors refined by RMS on the locked file: "ไม่แตะ" 183 → 186, "ราว ๆ ยี่สิบจาน" 406 → 403, "ส่วนที่ปูยีกินจริง" 1546 → 1552, "จานตรงหน้าเขา" 1600 → 1602, "เปิดฝา" 784 → 785. Convention: pitch level unless written (kit default, matches LF01/LF01b), replacing "pitch follows from eye and at.y". Numeric changes from the storyboard's camera lines, each for a measured reason: SH02 yaw 64 → 58 became 30 → 27, r 1.10 → 0.98 became 1.10 → 1.02, pitch −20 → −25, and T's shoulder is now the right foreground (geometry); SH05 hy 680 (band); SH09 hy 680 (spoon on SAU out of the band); SH12/SH17 hy 660 (G-SPOON out of the band); SH16 hy 1040 (face in frame); SH18 at x −1.0 → −0.7, yaw end 68 → 66 (child was out of frame right); SH19 end target x −2.1, yaw end 22 (figures off the left edge); SH20 split into a small LT drift (20a) and the truck (20b), with LF01b's camera as the binding end. Caller Y gets a stand-by mark (−1.80, 0, +3.70) outside the near-end cameras (his brief mark sat in their lens line). G-COVER moved from A03's cover to A05's (60 px from G-TAG at A03, 230 px at A05). Carrier plan rewritten (K1 sets TR1 from the left after the SH04 cutaway; reachability), replacing the brief's carrier marks for SH05/SH06. SH03 tray glimpse solved to world (+0.21, 1.10, −0.75). New cue S2b; V02 dropped; END1 note 2 at G 1647 with S14 before it. SH06 lead exception added.
- 2026-11-17 EDU-EP22-SCENES-R2 (Film W6.2 Draft fix round, one batch): from the Draft viewer check on ROWS-R3 (fails SH09, SH12, SH15, SH16, SH17; pass notes SH01, SH03, SH06, SH08, SH11, SH20, mark). Changed: SH09 camera to a medium shot (r 2.3 → 1.3, f 1100 → 1000, pitch −10) and the grey box diagnosed as column (−5, 0, 0)'s base over LT by the sort bias (shared `hall.ts` fix, coordinator routing); SH12 camera closer on the three checkpoints (r 2.6 → 1.5, pitch −15) with glint style GS2 (core 16 px, arms 83 px, outline, halo 0.5, pop ring); SH15 camera push r 0.22 → 0.125 and 12 larger outlined motes that land l 40–74 on the bright upper part (u 0.62–0.92), front kept at 0.60 for continuity; SH16 strip A on the paper beside the cup, strip B lifted out of the liquid in front of the navy vest l 24–34, highlight sweep l 46–58; SH17 its own closer frame (r 1.05, pitch −18), E1 dropped, GS2 × 1.25, tag dim DIM2 with one sputter; SH06 front carriers K1/K3 not drawn; SH08 metal read on the tag; SH11 ripple 6 f earlier. Not changed: SH01/SH03 (LF01), SH20 (LF01b), the channel mark. No timing, cut, VO, subtitle, cue frame, claim or reveal changed. ROWS-R3 → ROWS-R4 (5 rows' `seen`, SH12 flag).
