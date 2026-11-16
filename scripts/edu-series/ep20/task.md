# Tasks — EP20

Record: [delivery.md](delivery.md) · Updated: 2026-11-16, coordinator (continuation audit)

## EDU-EP20-SHORT

**Now:** Delivery complete: all 11 scenes pinned; normalized MP4 and the explicitly selected P5 + A cover are together in the publish folder, with both hashes verified. Kit intake and re-edit reference/source retention are complete. **Next:** User can take the MP4 and cover from the publish folder. W8.3 is waiting only for a user-reported posting date; posting is not authorized.

- [x] W0 Ideation — C82 selected; existing Preaw pitch and Film annotation in discovery.
- [x] W1.1 Boat research — C82-RESEARCH-R1.
- [x] W1.2 Preaw script SCRIPT-R1 and portable HOOK-R1 complete
- [x] W1.3 Boat FACT-R1: ready-for-storyboard; zero must-fix findings
- [x] W1.4 D/0.9975 explicitly chosen; same-setting projection 44.93–46.93 s; no full read
- [x] W1.5 User explicitly approved SCRIPT-R1 and storyboard continuation, 2026-11-16
  - [x] W1.6 SCRIPT-R2 (Preaw, 16 Nov 2026): L13 → user-chosen "เพราะคราวนี้ อากาศด้านหน้ากลับดันแรงกว่าด้านหลังนั่นเอง"; L01–L12 unchanged; narration.txt, hook-guide, B05-SH03 VO/captions synced
  - [x] W1.7 Boat FACT-R2 supports R2 L13 / CK20-13; VOICE-MEASURE-R3 and narration R2 (SHA256 b6f8490d…) are integrated in the SS-R5 cut; L13 captions [1332,1384) / [1384,1529). Evidence: fact-check.md#fact-r2--changed-claim-recheck-l13-only and build-notes "SS-R5 Editor narration R2 draft re-cut".
- [x] W2 Brief + 11-shot untimed storyboard + private page published (BOARD-R1)
  - [x] W2.1 Film EDU-EP20-VB-R1 ready-for-mark; one cabin + explanatory inset
  - [x] W2.2 EDU-EP20-BOARD-R1: 11 untimed shots, five beats, exact L01–L13 coverage
  - [x] W2.3 BOARD-R1 private review page published; deployment succeeded 2026-11-16
- [x] W3 Look B locked and all11 storyboard shots explicitly approved
  - [x] W3.0 User chose B: closer cool cabin/warm window; independent thumbnails passed
  - [x] W3.1 Finished LF20-CABIN-B published on same private page; independent pass with minor notes
  - [x] W3.2 User locked finished B: ใช้ลุค B นี้ต่อ; LOOK-R1 LF20-CABIN-B, 2026-11-16
  - [x] W3.3 All11 shots explicitly approved; published/current board hashes match, user-review-board-r1.json
- [x] W4 Voice locked: full E47.107229 s explicitly approved, absolute pace0.967575
  - [x] W4.1 Kore, unchanged warm-smiling style; E relative0.97 (absolute0.967575) explicitly selected
  - [x] W4.2 Full E retimed and measured:47.107229 s; preserved D; no API or extra gaps
  - [x] W4.3 User explicitly approved full E take: ใช้เสียงเต็มนี้ต่อ, 2026-11-16
- [x] W5 Timed sheets, Boss assets, Ton sounds and Editor draft — SS-R5 Draft passed by user
  - [x] W5.1 SS-R1/VB-R3 released:11 shots0–1504, written preflight passed; page refresh in progress
  - [x] W5.2 Boss reusable cabin/helium/restraint capabilities and proof (kit car-cabin lean/belt/tether + cabinDriveAt; stills EDU20-CABIN-DRIVE/EXTREMES; store previews/ep20/cabin-motion-w52; camera-D rear-lean crop open for Film)
  - [x] W5.2s Ton filed sounds, levels and exact cue sheet (6 cues, 6 generated, 0 library; scripts/edu-series/ep20/short/sound-cues.json; store lock pending src/videos/edu-ep20)
    - [x] SS-R4 round 1 (Ton, 16 Nov 2026): 7 cues, 7 generated, 0 library; +MUS20-OUTRO G1416 (`stinger_marimba-outro-falling-open_01`, locked in src/videos/edu-ep20/assets.lock.json), SFX20-END G1531, AMB20 end G1590 (fade 1550–1590), TAP gain −6, ANSWER −9.5 confirmed, B02/B03 accent rows re-targeted to EP08b over-speech; mix-levels on SS-R3 draft stems: 0 FAIL (out/logs/ton-edu20-r1-mix-levels.txt); Editor places OUTRO/END/AMB20 per fixlist.md; models unloaded
    - [x] SS-R5 re-time (Ton, 16 Nov 2026): no new generation; 7 cues, 7 generated, 0 library; totalFrames 1619, narration R2, MUS20 off G1443, MUS20-OUTRO G1445, SFX20-END G1560, AMB20 end 1619 fade 1579–1619; B05 levels windows re-timed. Mix-levels re-measure waits for Editor's SS-R5 stems (fresh Ton pass).
  - [x] W5.2c Boss SS-R2 fixes FD20-W53-01..03 (shoulder strap from torso shoulder, envelope tilt, BALLOON_U_MAX 0.20, D-R measure + EDU20-CABIN-EXTREMES-D-R stills; LOOK-B byte-identical; out/qa/edu20/w53; Film ruling open on strap ±8° at lean ±0.09)
  - [x] W5.3 Draft SS-R5 passed by user ("ผ่าน", 2026-11-16): includes outro melody A and L13 splice; Final cut next
    - [x] SS-R4 Draft round 1 re-cut (Editor, 16 Nov 2026): PX20 animated explainer (B03-SH01 G520–704, B05-SH03 G1340–1432), END20 settle ending (kit cruise release, camera D→A, L13b to G1500, A_fade 40 f), total 1590 f, mark `outline`, B04-SH01 crossfade kept, sound per cue sheet SS-R4 (7 cues, stem v2; sound-cues.py pass; mix-levels 0 FAIL). Half-size draft cut `out/EDU-EP20-SHORT/clips/_draft_cut.mp4` (540×960, 1590 f, −16.0 LUFS), review-rows draft src updated 11/11; Editor sheets viewed; shots passed by review 0/11 (Film verdict on B03-SH01/B05-SH03, then republish). Details: build-notes "SS-R4 Editor Draft round 1 re-cut"
    - [x] SS-R5 narration R2 re-cut (Editor, 16 Nov 2026): narration R2 locked (`b6f8490d…`, 48.074 s), total 1619 f, L13a/L13b SCRIPT-R2 captions (L13b to G1529, hard off), PX20-B re-synced (INSET_BRAKE 1340–1461), END20 from G1465 (kit release + taper 1561–1585, face G1475, camera D→A 1465–1585), A_fade 1579–1619, stem v3 (sound-cues.py pass; mix-levels 0 FAIL, B05-END20 bed dV 1.4). Half-size draft cut `out/EDU-EP20-SHORT/clips/_draft_cut.mp4` (540×960, 1619 f, −16.0 LUFS), review-rows draft src 11/11; Editor sheets viewed; seek 600/1395/1501 byte-identical; not listened; shots passed by review 0/11 (Film verdict on B05-SH03, then republish). Details: build-notes "SS-R5 Editor narration R2 draft re-cut"
- [x] W6 Full-size final cut review — Final v4 explicitly approved by user
  - [x] W6.1 Final cut (Editor, 16 Nov 2026): `clips.mjs --full`, 167.1 s, repaint 11 of 11 (first full-size render); `out/EDU-EP20-SHORT/clips/_final_cut.full.mp4` 1080×1920, 30 fps, 1619 f, 53.967 s, AAC 48 kHz stereo, −16.0 LUFS / TP −3.2 dBFS (not loudness-normalized; `render.mjs` delivery normalizes to about −14); proxy `_final_cut.mp4` 540×960; store `projects/edu/EDU/previews/cut/EDU-EP20-SHORT_final-cut_W6.mp4`; review-rows `finalCut` + `clips.final` 11/11; sound-cues.py pass, mix-levels 0 FAIL; captions frame-exact (Boss fix); sheets viewed; seek 270/1529 byte-identical, 1384 1 px 1/255. **Finding:** L03c caption x147–932 is 44 px past the x888 safe box (also in the passed draft). Audio not listened to by anyone. Details: build-notes "W6 Editor final cut"
  - [x] W6.2 L03c caption safe-box fix (Editor, 16 Nov 2026): L03c split verbatim at the subject|predicate boundary into L03c1 `ลูกโป่งก็น่าจะ` G270–293 + L03c2 `เอนไปข้างหลังตามคุณ...` G293–329 (switch at the 10 ms energy valley 9.76 s between จะ|เอน), window G270–329 unchanged; script/VO unchanged. caption-breaks 0 bad / 0 MAY-WRAP; fill ink G281 x404–674, G311 x286–794 (inside x120–888); `clips.mjs --full` repaint 1 of 11 (scene 3, B01-SH03), 10 reused; audio + frames outside G187–351 decode-identical to W6.1; `_final_cut.full.mp4` (`3f36ef797f2583cb…`) + proxy `_final_cut.mp4`; review-rows `finalCut`/`clips.final` rewritten; store `projects/edu/EDU/previews/cut/EDU-EP20-SHORT_final-cut_W6.2.mp4` (+ `_proxy540`); sound-cues.py pass; sheet viewed. Scene sheet subtitle row for Film to sync. Details: build-notes "W6.2 Editor L03c caption split"
  - [x] W6.3 User replied "ผ่าน" after Final v4 at https://claude.ai/artifact/K3HpSYNFUmvqZmeCEC1S4b; all 11 shots approved, including the split L03c. This records user acceptance, not an independently observed listening pass.
- [x] W7 Approved final pins — 11/11 A_fade scenes already pinned at 2026-11-16T14:22:28Z; verified on continuation. No scene repainted.
- [x] W8 Delivery and publish folder — MP4 + selected P5/A cover ready; kit and re-edit retention complete. Posting remains a separate future user action.
  - [x] W8.1 Delivery rendered from 11/11 cached approved scenes: 1080×1920, 30 fps, 1619 frames, 53.966667 s; fresh audio measurement −14.0 LUFS, true peak −1.5 dBFS. [QA](delivery-qa.md).
  - [x] W8.2 Complete publish package — `$REELS_STORE/publish/edu/EDU/EDU-EP20-SHORT/` contains `EDU-EP20-SHORT.mp4`, selected `EDU-EP20-SHORT_cover.png`, `publish.json` and `history.tsv`; status ready, both SHA256 values verified.
  - [ ] W8.3 Posting — not authorized; record only when the user confirms a posting date.
  - [x] W8.4 Boss kit intake — `PL-EDU-CABIN20` filed and rendered; 58-entry gallery checked, plates tests 2/2. Existing `man-crop + hoodie, P31` and shared cabin motion need no new entry. [Evidence](kit-intake.md).
  - [x] W8.5 Cover pick 1 — user selected "ภาพ 5 — ลูกศรสองทาง (แนะนำ)" on 2026-11-16: P5-which-way, `EDU20-COVER-PAIR`, local 15 (picture-sheet frame 135). Independent review passed 5/5; picture archive `projects/edu/EDU/covers/ep20/pick1/`. [Handoff and scores](cover-pick1.md).
  - [x] W8.6 Cover pick 2 — user selected "A — ตามคุณ / ใช่ไหม? (แนะนำ)"; exact checked A-follow-you cover published with video. Boat and independent Film checks pass 5/5. [Text handoff](cover-pick2.md), [copy review](cover-copy-check.md), [visual review](../../../storyboards/edu-ep20/short/cover-text-review/viewer-check-look-r1.md).

  - [x] W8.7 Re-edit retention — canonical final MP3 + 1,443-frame amplitude sidecar retained, 12 reference stills + hashes stored, minimum delivery PSNR 50.63 dB, all 11 pins unchanged. [Evidence](reedit-retention.md). Final source checkpoint `bf9b167eb1a9`; runtime WAV remains a restorable store cache.

## Git publication — user authorized "commit + pr"

- [x] Final production source committed (`bf9b167`) and checkpoint recorded (`caea088`).
- [x] Production issue #351, owner:codex; branch `codex/351-ep20-delivery`. Latest main integrated, EP18/EP19/EP20 registrations preserved; verification limitations recorded in build-notes.
- [ ] Feature branch pushed and PR opened into main; user owns merge.
