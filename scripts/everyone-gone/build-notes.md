# Build notes — EVERYONE-GONE

## 2026-11-03 — Film W3.1 look frames (EG-EP01-SHORT, brief EG-BRIEF-FILM-R1.2, rows SS-R1)

- Code (look-defining first versions, Film; Boss hardens): `src/painted/everyone-gone/` — `space.ts` (stations A/B/C, projector, sun), `set.ts` (soi + storefront, glass stack, set shadows), `figure-back.ts` (`man-crop` back view, no shadow), `stall.ts`, `SensorCard.tsx`, `look.tsx`, standalone entry `look-index.ts` (`EG-LF01`, `-WAVE`, `-REACH`, `EG-LF02`..`EG-LF05`). Not registered in `src/Root.tsx`; stills via `node scripts/stills.mjs src/painted/everyone-gone/look-index.ts` (one Chrome; `render.mjs --stills` only reaches compositions in `src/index.ts`).
- Frames: `$REELS_STORE/projects/EG/previews/look-frames/` (LF01–LF05, LF01-WAVE, LF01-REACH, `sheet-looks.png`, `sheet-capzone.png`, `capzone/`). Repo-relative cache for `build.py`: `out/eg/look/final/`.
- Look map to the brief's six: (1) back view at B = (4) storefront door = LF01; (2) station A frame 0 = LF02; (3) stall = LF03; (5) SVG card = LF04; (6) closing wide C = LF05.

### Findings (proposed for brief R1.3; the brief was not edited in this pass)

1. **VD04 lens direction is inverted.** Matching the door rect from a closer station needs a wider lens: f/d constant, so B uses f 587 px against A's 950 px (950/5.5 = 587/3.4). The brief says "B tighter lens 1.6x" and "lens widen B 1.6x to C 1x". The matched-size intent is kept in `space.ts`; the pull-back B to C is then a dolly back with the lens *lengthening* 587 to 950. Door rect at A and B: opening x 298..609 px (frame bars 286..621), y 640..1020 px, by construction (bars at z 0.02 differ by under 1 px).
2. **CL07 post placement broke the clue.** With the post at (-1.2, 0, 1.45) its long shadow passed behind your legs at station B and came out on the right, where it read as your own shadow. Fixed: the VD13 object 1.0 m from you is a 0.9 m steel bollard at (0.55, 0, 1.25) (VD13 allows "lamp-post or bollard"); its shadow runs parallel to where yours would run, about 120 px right of that strip, never behind you. The lamp post moved to (-2.6, 0, 0.7), out of the A and B frames (only its shadow enters at B); it shows in C with the wires.
3. **Plain `washAt` shadows read far paler than their opacity** on the light pavement (first render: shadows almost invisible). `shadowFill` lays a flat `brush.wash` layer plus a soft wash. Same for semi-transparent `washAt` bodies (scooters, stools): use `hardFill`.
4. **Caption band collides with the clues.** The default band y 860–1248 covers your legs and the shadow strip at B, the whole figure, door and bollard at C, and the table/glass in the stall. The pale key also fails the default outline thresholds everywhere (band 860–1248 mean/p95: LF01 0.692/0.789, LF02 0.728/0.794, LF03 0.740/0.883, LF04 0.946/0.946, LF05 0.720/0.846; limit 0.25/0.40). A lower band y 1400–1640: LF01 0.770/0.794, LF02 0.602/0.644, LF03 0.762/0.782, LF05 0.601/0.621 (still bright). Scene-sheet pass decides: captions low (about y 1400–1640, under the clue strip) plus `box` or a caption shade, or a brief threshold override.
5. The kit `Grade` is a night vignette (0.38) and muddies the high key; the looks use a light `DayGrade` (0.16) in `look.tsx`.
6. Station A/B show no sky (the shophouse rows fill the top at hy 744); the milky sky shows only in C. The BTS viaduct (S01-B02-SH02) is not painted yet; it is planned under the LF02 look.

### Measured

- Figure (`man-crop`, 1.76 m) at B: 646 px = 33.6% of frame height, feet y 1331, x about 180–315 (left third); at C: 232 px = 12.1%, feet y 1171 (brief 8–12%). Computed from the projection and checked on the sheets.
- Determinism: LF01 frame 0 from two separate sessions: max channel diff 7/255 on 3357 channels, PSNR 78.3 (`paint-bench-compare.mjs`), within run noise class (DF-20261030-render-run-noise says a few steps; 7 is at its upper end).
- SVG card legible at 270 px tile width; four labels match the brief strings.

## 2026-11-03 — Film W3.1 revision SS-R2 (brief R1.3, FPOV)

- User review: Q1 and S04-B01-SH01 `change` ("เป็น FPOV เลยดีกว่า"). Code: `space.ts` (STATION_B moved to (0.3, 1.6, 2.2) f 587; new STATION_G (0.3, 1.6, 0.8) f 700 hy 900; YOU_B, YOU_GLASS, TOUCH; SS-R1 values kept as `STATION_B_SSR1`, `YOU`), new `fpov.ts` (YOU_HAND tone, `paintWaveHand`, `paintReachHand` on kit `paintPovHand`, VIEWMODEL 1.2), `look.tsx`/`look-index.ts` (LF01 FPOV, LF01-WAVE, LF01-REACH, new EG-LF05-START, EG-LF05-GLASS). `figure-back.ts` is used only for the small figure (C and the proposed A-start).
- Frames: `$REELS_STORE/projects/EG/previews/look-frames/ss-r2/` (LF01, LF01-WAVE, LF01-REACH, LF05-START, LF05-GLASS, `sheet-looks.png` with all nine). SS-R1 LF01 frames stay at the parent folder (immutable store) and in `out/eg/look/final/ssr1/`.
- Measured (computed from the projection, checked on the sheet): door opening at B x 220..700, y 584..1171 (A x 298..609, y 640..1020, centre x A 453.6, B 460: 6 px offset, accepted in EG-SC-R2); bollard at B x 657..731, y 1176..1733; its shadow tip at the wall (857, 1171); the missing-shadow line x 980, y 1171..1920. Wave hand: wrist (812, 930), palm about 133 px. Reach: fingertips (449, 1064), hand about 196 px long (size 0.655). LF05-START figure about 356 px (18.5%), feet y 1067; LF05-GLASS about 204 px (10.6%), feet y 1145.
- Caption bands (caption-zone.py mean/p95): 860-1248: LF01 0.761/0.827, WAVE 0.745/0.827, REACH 0.713/0.788, START 0.718/0.794, GLASS 0.722/0.846; 300-560: LF01 0.670/0.878, REACH 0.782/0.903, LF02 0.642/0.904, LF03 0.779/0.822, LF04 0.911/0.946, LF05 0.738/0.815. All fail 0.25/0.40; brief R1.3 VD14 sets the override. Finding 4's low band 1400-1640 broke the safe-box Requirement (bottom edge <= 1248) and is withdrawn.
- Finding: at B the CL07 strip (x 980) and the whole pavement (y > 1171) sit under the platform UI (right rail x > 888, bottom 35%); CL07 is carried by the closing wide (brief R1.3 item 8).
- Not checked this pass: two-session determinism of the new frames.

## 2026-11-03 voice samples (W4.1)

- Voice samples: Achernar, style "calm, soft and close, awake, quiet wonder", atempo 1.08 (user liked it; "sleepy" style rejected).
- User note: cut the silent gaps between sentences shorter (trim after generation; fewer `<short pause>` tags). Apply in W4.2.
- Opening arc (user picked take t1, 3 Nov 2026): one read, Achernar, style "Starts sleepy, soft and hushed as if just woken up, then gradually wakes up and becomes calm, clear and quietly uneasy by the third sentence; same narrator throughout, do not speed up", atempo 1.08. Sample: out/eg-voice/arc-t1-x108.wav (L01–L05). Use this style for the full narration read.
- Still to do in W4.2: compact the pauses between sentences (user note); no sample made yet, apply when generating the full narration.

## 2026-11-03 voice lock (W4)

- **Locked take:** `EG-EP01-SHORT-narration-lock.wav` (store EG/narration, filed with `store.py archive`); raw Gemini take `EG-EP01-SHORT-narration-raw-gemini.wav` beside it. Voice Achernar, style = "natural everyday storytelling, no audible breathing; first two sentences slightly sleepy; last three firm and weighty, calm certainty", one read, 7 Gemini calls today.
- **Post-processing** ([voice-regap.py](voice-regap.py), run with the Whisper venv python): cut gaps between sentences proportionally (0.12 + 0.55 × (gap − 0.12)), set 0.9 s after L20a and 0.45 s where L16 was removed, 1.2 s tail; `atempo=1.05`; smooth 0→+3 dB gain curve from "คนที่หายไป" (no cutting inside it); alimiter 0.95.
- **L16 cut from the audio** at the user's choice (Preaw/Film agreed it can go, ~3–4 s). Script still has L16 until Preaw revises; Boat to recheck L14–L15 after.
- Film/Preaw opinion (not heard, text only): ending delivery may be too heavy against the quiet pull-back; boost on "คือคุณ" kept small (+3 dB) by the user's choice.
- `scripts/transcribe.py` fails with this venv's `av` (`metadata_errors` TypeError); used `faster_whisper` on a decoded array instead.
