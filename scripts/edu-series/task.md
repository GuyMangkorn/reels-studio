# Tasks — EDU-SERIES

Record: [delivery.md](delivery.md) · Updated: 2026-11-05, Film

## EDU-EP01-SHORT

**Now:** W3.1 look frames LF01–LF05 v1 painted (Film). **Next:** viewer check (fresh Film, Opus), then coordinator republishes the page; user — storyboard verdicts and look lock

- [x] W0 Ideation
  - [x] W0.1 Preaw concepts (concepts.md R1)
  - [x] W0.2 Film annotation (Opus)
  - [x] W0.3 User picks a concept (C2, 2026-11-04)
- [ ] W1 Script lock
  - [x] W1.1 Boat research
  - [x] W1.2 Preaw script (R1)
  - [x] W1.3 Boat fact-check
  - [ ] W1.4 Length check: measured read ≤ target + 5 % (s)
  - [x] W1.5 User approves the script (R1.1, 2026-11-04)
- [ ] W2 Brief and storyboard
  - [x] W2.1 Film brief (text) (EDU-BRIEF-R1)
  - [x] W2.2 Film storyboard rows (SS-R1, 23 shots)
  - [x] W2.3 Storyboard page published
- [ ] W3 Look frames and storyboard pass
  - [ ] W3.1 Look frames on the page (5/5 locations painted, v1, store `projects/EDU/previews/look-frames/ep01/v1/`; rows updated, page rebuilt; thumbnails step skipped on coordinator instruction; viewer check and publish pending)
  - [ ] W3.2 Look frames approved (look lock)
  - [ ] W3.3 Storyboard passed (0/N shots)
- [ ] W4 Voice lock
  - [ ] W4.1 Voice chosen
  - [ ] W4.2 Narration generated and measured
  - [ ] W4.3 User approves the voice
- [ ] W5 Draft
  - [ ] W5.1 Film timed scene sheets
  - [ ] W5.2 Boss assets and plates (shot groups 0/G)
  - [ ] W5.3 Draft passed (0/N shots)
- [ ] W6 Final passed (0/N shots)
- [ ] W7 Pinned (0/N shots)
- [ ] W8 Deliver
  - [ ] W8.1 Assembled from the cache, picture lock
  - [ ] W8.2 Delivery render archived
  - [ ] W8.3 Posted to the channel (user, date)
  - [ ] W8.4 Kit intake: new people, outfits, animals, poses, sets filed (KIT-P01)

## EDU-EP02-SHORT

**Now:** W5.1 Film timed scene sheets SS-R2 `ready-for-dev` ([ep02/scenes/index.md](ep02/scenes/index.md), 23 shots, 1771 f = 59.03 s; rows SS-R2 timed, page builds, review page: pending). **Next:** coordinator republishes the review page (SS-R2); Boss W5.2 plates by shot group G-A…G-F (N6 LF03 mist / nerve / lid-shadow polish + f71 refraction line carried); Editor composition with narration segments N1–N7 and `bottomEdgeY` 1344 captions; user — storyboard verdicts

- [x] W0 Ideation (C1, user pick 2026-11-05; Short Thai, A_fade)
- [x] W1 Script lock (W1.4 measured read pending voice)
  - [x] W1.1 Boat research
  - [x] W1.2 Preaw script (R1, ep02/script.md)
  - [x] W1.3 Boat fact-check (R1.1, ep02/fact-check.md)
  - [ ] W1.4 Length check
  - [x] W1.5 User approves the script
- [ ] W2 Brief and storyboard
  - [x] W2.1 Film brief (text) (EDU-BRIEF-R1, ep02/brief.md)
  - [x] W2.2 Film storyboard rows (SS-R1, 23 shots, ep02/review-rows.json)
  - [x] W2.3 Storyboard page published
- [ ] W3 Look frames and storyboard pass
  - [ ] W3.1 Look frames on the page (3/3 locations painted; viewer check r1: LF01 fail, LF02 pass, LF03 fail → v2; r2: LF01 pass, LF02 pass, LF03 fail → LF03 v3; r3: LF03 fail → user: zoom the eye → LF03 v4; store `projects/EDU/previews/look-frames/ep02/v2/` (LF01, LF02) and `v4/` (LF03; v1/v3 kept); rows point at v2/v4, page rebuilt; thumbnails skipped (user asked for the looks now); viewer check on LF03 v4 and publish pending)
  - [x] W3.2 Look frames approved (look lock) — user "ผ่าน" 5 Nov 2026 on page version 1793851659-ce20: LF01 v6, LF02 v2, LF03 v6 (LF03 failed viewer check r6, user accepted; mist/nerve/lid-shadow polish carried to W5.2 N6)
  - [ ] W3.3 Storyboard passed (0/23 shots)
- [x] W4 Voice lock (user approved 2026-11-05 the Gemini-fast Kore read, replacing tempo 1.16: speech 53.97 s, est. video ~59.5 s, lines within 0.4 dB of -16 LUFS; [voice-measure.md](ep02/voice-measure.md) rev `gemini-fast`; store `projects/EDU/narration/ep02/2026-11-05_ep02-narration-kore-fast.wav`; listen to L08–L11 was recommended, whisper could not transcribe them)
  - [x] W4.1 Voice chosen (Kore, user)
  - [x] W4.2 Narration generated and measured (tempo 1.16 after user chose "read faster"; redo pass 3 `gemini-fast`: new Kore read with pace in the style prompt, speech end 53.97 s, per-line levelled, store `..._ep02-narration-kore-fast.wav`, pending user listen; replaces the 1.16 file as the voice-lock candidate)
  - [x] W4.3 User approves the voice
- [ ] W5–W8 as EDU-EP01-SHORT (draft, final, pin, deliver)
  - [x] W5.1 Film timed scene sheets (SS-R2, [ep02/scenes/](ep02/scenes/index.md), 2026-11-05; brief R1.5)
  - [ ] W5.2 Boss assets and plates (N6 eye-macro v6 built ahead of W5 on the user's call, viewer check r6 pending; LF01 v6 done; **G-A 5/23 shots plated 2026-11-05** (B01-SH01…SH03, B02-SH01…SH02: N3 chop, N4 halves, N7 droplets; `src/painted/edu02/shots.tsx`, stills `EDU2-S01-*` via `shots-index.ts`; uncommitted, Film W5.3 review open); G-B…G-F, N2 fridge interior, N4 frosty/pieces, N5 timing, N6 polish, N7 mist/waterfall, N8, N9 open)
    - [x] N6 `eye-macro plate + sparks + tear wave` v5 (`src/painted/edu02/eye.ts`, store `.../ep02/v5/`, [build notes](build-notes.md#ep02-w52-n6-eye-macro-v5-2026-11-05-boss))
    - [x] LF01 v6 + N6 v6 to the viewer check r5 list (store `.../ep02/v6/`, [build notes](build-notes.md#ep02-w52-lf01-lf03-v6-2026-11-05-boss))

