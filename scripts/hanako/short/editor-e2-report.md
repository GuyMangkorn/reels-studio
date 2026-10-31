# HANAKO-SHORT: Editor E2 report (subtitle cues) and registration

Status: **E2 and registration done in the working tree (uncommitted, by instruction)**. Not done: E3 sound, E4 seam/progress-bar finish, E5 B09 read and ear checks.

- Deliverable `HANAKO-SHORT` (Thai Short 9:16, Full tier), script `HANAKO-SHORT-SCRIPT-R2`, scene sheet `HANAKO-SHORT-SCENE-R4` (`ready-for-dev`; B03-SH01 user confirmation still pending per the handoff), voice lock v3 (`scripts/hanako/short/voice-measure.json`).
- Checkout: branch `claude/hanako-next-437b9b` on `3166499` (origin/main) plus uncommitted work. Plate art (`src/painted/shots/hanako.tsx`, `src/painted/hanako/*`) untouched by this pass.
- Composition `HANAKO-SHORT`: 1080×1920, 30 fps, **2596 frames = 86.533 s** (45 pre-roll + 2461 narration track + 90 hold). Runtime: registered and validated (validator in tests, stills render at the final frames); no MP4 export and no Studio session in this pass.

## 1. What was built

| Item | Where | Evidence |
| --- | --- | --- |
| Registration (only episode file; `src/Root.tsx` untouched) | `src/videos/hanako/index.ts` | typecheck, tests (241/241), stills render |
| Narration locked (`store.py use`) | `src/videos/hanako/assets.lock.json` | `store.py verify`: 7147 stored, 94 locked, 0 problems |
| Scenes and painted plates (9 scenes = beats B01–B09; 14 plates `HANAKO-<shot>`) | `scripts/hanako/short/timeline.json` (written by the builder) | builder frame check: scene sum 2596; plate spans inside scenes |
| Subtitle cues (35 = 32 speech + 3 knock events) | `timeline.json` `subtitleCues`; per-cue measure `scripts/hanako/short/cue-measure.json` | §3 table |
| Cue builder | `scripts/hanako/short/build-cues.py` (`python3 -I`, `--check` mode) | reruns deterministically from `voice-measure.json` and the amplitude file |

Registration fields: `ending: 'A_fade'`, `endHoldSec: 0`, `endFadeSec: 0`; `narration: {src: 'narration/HANAKO-SHORT.mp3', amplitude, fps: 30, startFrame: 45}`; `captionStyle: {preset: 'outline', position: 'lower'}` (bottom edge y 1240, inside the caption-safe box). No `audio`, no `sfx`, no `chrome` override (default channel label `ทำไมล่ะ`, top-left, as the other shorts).

Narration files: `public/narration/HANAKO-SHORT.mp3` = store `projects/HANAKO/audio/final/s3-tail-reread/HANAKO-SHORT-tail.mp3` (sha256 `ed3a339f…`, 82.033 s, 48 kHz mono, matches the committed file). `public/narration/HANAKO-SHORT.amplitude.json` = store `projects/HANAKO/audio/final/lock-v3/HANAKO-SHORT.amplitude.json` (filed by this pass, sha256 `fdfe80f9…`, 2461 values). Both were already committed in Git; the lock adds the store path.

## 2. Decisions and why

- **D1 Ending `A_fade` with `endHoldSec: 0`, `endFadeSec: 0` (not `B_loop`).** The scene sheet asks for `B_loop` with no hold. `validateVideoStyle` rejects `endHoldSec` unless the ending is `A_fade`. The default `B_loop` hold (3 s) makes `paintedStateAt` freeze the final scene's painted plates at scene-local frame 204 (`endingState` → `stageFrame`), which would drop the B09 amber cool-down (F2581–F2595) and the seam. `A_fade` with 0/0 is plain playback, the same as `BLOOP-EP01-SHORT`. No `loopFadeFrames` (no dip to dark).
- **D2 Hook text and labels are in the plates.** Boss paints the B01-SH01 hook text (SVG layer, opacity 1 to F45, `1−progress(f−46, 8)` to F54), the B01-SH02 Japanese line (F251 fade), the B03 name label (F467), the B06-SH01 callout (F1296), the B06-SH02 source credit (F1502) and the B07 date and name cards with their own frame opacity. So Editor adds no Remotion overlay and no `painted.label`. The scene sheet's wording "label slot 0 …" and "Editor builds it as an overlay layer" is superseded by the in-plate implementation (for Mark/Film to record; not edited here).
- **D3 Cue end = measured speech end, not "hold to the next cue".** The scene sheet proposed cues that stay on until the next cue starts, which carries the written pauses (up to 27 f). This pass ends each cue at its measured speech end: the beat off-edge at the last cue of a beat (voice-lock 300-sample rule), and the last speech frame before the next cue at internal splits (4 % envelope). Blank cues fill the gaps. **Needs Mark's or the user's acknowledgement** (§8 Q1).
- **D4 Cue start.** The first cue of each beat starts at the voice-lock beat on-edge. Internal cues start at the first frame after a low-energy gap (4 % of peak, gap ≥ 4 f), the sheet's word-onset rule.
- **D5 Knock captions kept** (`ก๊อก`, `ก๊อก ก๊อก`, `ก๊อก ก๊อก ก๊อก`, F4–F45). They are event-timed from the sheet's knock frames (no measured line), so they are not compared. Script: "the knocks may be captioned".
- **D6 B09-02 held to F2596** (the loop line stays on F2595, as the sheet requires). Intentional difference of +91 f from the measured end (F2505); reported in §3.
- **D7 Authored line breaks** (display only; the Thai text is unchanged) in `B04-02` (`บางคนเล่าว่า` / `เธอตายตอน…`), `B05-01` (`ถ้าเรื่องพวกนี้จริง` / `ก็น่าจะ…`) and `B07-02` (`ยุค 80 ครูคนหนึ่ง` / `เก็บเรื่องผี…`). `caption-breaks.mjs`: 0 flags after this.
- **D8 Captions `lower`, not `middle`.** The scene sheet's band line says "captions `position: 'middle'`"; `lower` (bottom edge y 1240) matches the production-requirement box and the WORLD FOG precedent. Confirm with Mark.

## 3. Cue check against the measured line ranges (E2)

Reference: voice lock v3 (`voice-measure.json`) beat on/off (300-sample rule) for beat edges; the 4 % envelope for internal splits; Whisper anchors (±0.2 s) as a cross-check only. Frames are composition-global, half-open. Δ = cue − measured, in frames.

- **Scene-sheet proposed cues vs measured (speech cues, 32):** end differs by more than 3 f in **31 of 32** (the sheet holds each cue to the next cue; range +2 to +91 f). Start differs by more than 3 f in **1**: `B08-01` (sheet 2066, voice-lock beat on 2055, +11 f; see §8 Q3).
- **Built cues vs measured:** only `B09-02` exceeds 3 f (end +91 f, the intentional hold to F2596). Knock events have no measured range.
- **Measure disagreements to hear:** 300-sample beat on vs 4 % envelope onset: `B07-01` 1589 vs 1596 (+7), `B08-01` 2055 vs 2066 (+11), `KA-01` 417 vs 426 (+9). Built cues use the voice-lock values.
- **Whisper anchor cross-check** (Δ = anchor − built start; anchors are ±0.2 s estimates and sit at the start of the preceding gap, per the sheet): 10 of 18 compared anchors differ by more than 3 f (largest `B05-02` −27, `B08-01` +13). Expected precision; not a cue error.

| Cue | Beat | Text | Sheet g0–g1 | Built g0–g1 | Measured g0–g1 | Δ sheet (start / end) | Δ built (start / end) | Anchor Δ | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| KN-1 | KNOCK | ก๊อก | 4–18 | 4–18 | – | – | – | – |  |
| KN-2 | KNOCK | ก๊อก ก๊อก | 18–31 | 18–31 | – | – | – | – |  |
| KN-3 | KNOCK | ก๊อก ก๊อก ก๊อก | 31–46 | 31–46 | – | – | – | – |  |
| B01-01 | B01 | ชั้นสาม… ห้องน้ำหญิง | 46–117 | 46–105 | 46–105 | +0 / +12 | +0 / +0 | – | sheet >3 f |
| B01-02 | B01 | ห้องที่สาม เคาะสามครั้ง แล้วถามว่า… | 117–251 | 117–224 | 117–224 | +0 / +27 | +0 / +0 | B01-a2 -10 | sheet >3 f |
| B01-03 | B01 | “ฮานาโกะซัง อยู่ไหมคะ?” | 251–304 | 251–297 | 251–297 | +0 / +7 | +0 / +0 | – | sheet >3 f |
| B02-01 | B02 | ตามที่เล่ากันบ่อย ๆ… | 305–349 | 305–337 | 305–337 | +0 / +12 | +0 / +0 | – | sheet >3 f |
| B02-02 | B02 | จะมีเสียงตอบกลับมาว่า… | 349–417 | 349–409 | 349–409 | +0 / +8 | +0 / +0 | B02-a2 -9 | sheet >3 f |
| KA-01 | KA | “ค่ะ” | 417–443 | 417–436 | 417–436 | +0 / +7 | +0 / +0 | – | sheet >3 f |
| B03-01 | B03 | เธอคือฮานาโกะซัง | 444–513 | 444–495 | 444–495 | +0 / +18 | +0 / +0 | B03-a1 +0 | sheet >3 f |
| B03-02 | B03 | ผีห้องน้ำโรงเรียน | 513–557 | 513–545 | 513–545 | +0 / +12 | +0 / +0 | – | sheet >3 f |
| B03-03 | B03 | ที่เด็กญี่ปุ่นเล่าต่อกันมาหลายรุ่น | 557–645 | 557–638 | 557–638 | +0 / +7 | +0 / +0 | – | sheet >3 f |
| B04-01 | B04 | แต่เธอเป็นใคร? | 646–707 | 646–681 | 646–681 | +0 / +26 | +0 / +0 | B04-a1 +0 | sheet >3 f |
| B04-02 | B04 | บางคนเล่าว่า
เธอตายตอนระเบิดลงสมัยสงคราม | 707–820 | 707–800 | 707–800 | +0 / +20 | +0 / +0 | B04-a2 -9 | sheet >3 f |
| B04-03 | B04 | บ้างก็ว่า ถูกฆ่าในห้องน้ำ | 820–900 | 820–893 | 820–893 | +0 / +7 | +0 / +0 | B04-a3 -3 | sheet >3 f |
| B05-01 | B05 | ถ้าเรื่องพวกนี้จริง
ก็น่าจะมีร่องรอยของเธอสักที่… | 903–1027 | 903–1002 | 903–1002 | +0 / +25 | +0 / +0 | B05-a1 +0 | sheet >3 f |
| B05-02 | B05 | แต่ยังไม่พบหลักฐานเลย | 1027–1078 | 1027–1068 | 1027–1068 | +0 / +10 | +0 / +0 | B05-a2 -27 | sheet >3 f |
| B05-03 | B05 | ว่ามีเด็กผู้หญิงจริง ๆ ที่เป็นต้นเรื่อง | 1078–1172 | 1078–1170 | 1078–1170 | +0 / +2 | +0 / +0 | – |  |
| B06-01 | B06 | เรื่องฮานาโกะที่เก่าที่สุดเท่าที่รู้กัน | 1173–1256 | 1173–1244 | 1173–1244 | +0 / +12 | +0 / +0 | B06-a0 +0 | sheet >3 f |
| B06-02 | B06 | มาจากอิวาเตะ ราวปี 1948… | 1256–1372 | 1256–1349 | 1256–1349 | +0 / +23 | +0 / +0 | B06-a1 -10 | sheet >3 f |
| B06-03 | B06 | บันทึกนั้นไม่ใช่ข่าว… | 1372–1430 | 1372–1413 | 1372–1413 | +0 / +17 | +0 / +0 | – | sheet >3 f |
| B06-04 | B06 | แต่เป็นเรื่องผีที่มีคนเล่าไว้ | 1430–1502 | 1430–1486 | 1430–1486 | +0 / +16 | +0 / +0 | B06-a4 +0 | sheet >3 f |
| B06-05 | B06 | แล้วถูกเก็บลงหนังสือ หลายสิบปีต่อมา | 1502–1588 | 1502–1581 | 1502–1581 | +0 / +7 | +0 / +0 | – | sheet >3 f |
| B07-01 | B07 | แล้วเธอดังได้ยังไง? | 1589–1653 | 1589–1625 | 1589–1625 | +0 / +28 | +0 / +0 | B07-a1 +3 | sheet >3 f |
| B07-02 | B07 | ยุค 80 ครูคนหนึ่ง
เก็บเรื่องผีที่นักเรียนเล่าให้ฟัง | 1653–1782 | 1653–1759 | 1653–1759 | +0 / +23 | +0 / +0 | B07-a2 +3 | sheet >3 f |
| B07-03 | B07 | หนังสือของเขาปี 1990 | 1782–1860 | 1782–1842 | 1782–1842 | +0 / +18 | +0 / +0 | – | sheet >3 f |
| B07-04 | B07 | ช่วยพาเรื่องพวกนี้ไปทั่วญี่ปุ่น | 1860–1941 | 1860–1913 | 1860–1913 | +0 / +28 | +0 / +0 | – | sheet >3 f |
| B07-05 | B07 | พอกลางยุค 90… | 1941–1994 | 1941–1981 | 1941–1981 | +0 / +13 | +0 / +0 | B07-a5 -4 | sheet >3 f |
| B07-06 | B07 | ฮานาโกะซังก็มีหนังของตัวเอง | 1994–2066 | 1994–2047 | 1994–2047 | +0 / +19 | +0 / +0 | – | sheet >3 f |
| B08-01 | B08 | ฮานาโกะซังอาจไม่เคยมีตัวตนจริง… | 2066–2147 | 2055–2127 | 2055–2127 | +11 / +20 | +0 / +0 | B08-a1 +13 | sheet >3 f |
| B08-02 | B08 | แต่เธอก็ไม่เคยหายไป | 2147–2217 | 2147–2192 | 2147–2192 | +0 / +25 | +0 / +0 | B08-a2 -10 | sheet >3 f |
| B08-03 | B08 | เพราะเด็กรุ่นแล้วรุ่นเล่า | 2217–2273 | 2217–2260 | 2217–2260 | +0 / +13 | +0 / +0 | B08-a3 +5 | sheet >3 f |
| B08-04 | B08 | เล่าเรื่องเธอต่อกันมา | 2273–2303 | 2273–2295 | 2273–2295 | +0 / +8 | +0 / +0 | – | sheet >3 f |
| B09-01 | B09 | และเธอจะกลับมาอีกครั้ง… | 2303–2416 | 2303–2392 | 2303–2392 | +0 / +24 | +0 / +0 | – | sheet >3 f |
| B09-02 | B09 | ทุกครั้งที่ใครสักคน ยกมือขึ้นเคาะ | 2416–2596 | 2416–2596 | 2416–2505 | +0 / +91 | +0 / +91 | B09-a2 -5 | sheet >3 f; built >3 f (intentional) |

## 4. Checks run (logs under `out/logs/`)

| Check | Result | Log / artefact |
| --- | --- | --- |
| `npm run typecheck` | exit 0 | `out/logs/hanako-e2-typecheck.log` |
| `npm run lint` | exit 0, 0 errors, 3 warnings in `src/painted/hanako/look.tsx`, `look-r3.tsx`, `look-r4.tsx` (not edited here; pre-existing) | `out/logs/hanako-e2-lint.log` |
| `npm test` | 241 pass, 0 fail (first run failed on `endHoldSec` with `B_loop`; fixed by D1) | `out/logs/hanako-e2-test.log` |
| `node scripts/caption-breaks.mjs scripts/hanako/short/timeline.json` | 0 bad breaks, 0 MAY-WRAP, 35 cues | `out/logs/hanako-caption-breaks.log` |
| Stills, 78 frames (every shot: first, event, cut and last frames; loop frames 0 and 2595) | rendered with `node scripts/render.mjs HANAKO-SHORT --stills --frames=… --gl=angle --timeout=180000` | `out/HANAKO-SHORT/stills/`, copy `out/qa/hanako/e2/pass1/` |
| Contact sheets (viewed) | 5 sheets + 3 full-resolution crops | §5 |
| Caption zone (`scripts/caption-zone.py --band 860:1248`, 78 frames) | **78/78 pass** (thresholds mean ≤ 0.25, p95 ≤ 0.40); mean 0.106–0.231, p95 0.134–0.352 | `out/qa/hanako/e2/caption-zone.json`, overlays `out/qa/hanako/e2/capzone/` |
| Loop seam F0 vs F2595, PSNR by band | y 0–280 identical; y 280–370 (hook text, F0 only) 13.3 dB; y 370–860 identical; y 860–1250 (caption «ทุกครั้ง…», F2595 only) 17.0 dB; y 1250–1920 identical | `ffmpeg psnr` on `out/qa/hanako/e2/pass1/0.png` and `2595.png`, one crop per band (see §12) |
| Seek parity (12 frames re-rendered in shuffled order: 2595, 1653, 0, 417, 2505, 958, 31, 2302, 1348, 479, 303, 2061) | 8 byte-identical; 4 PNGs (2595, 31, 2302, 479) differ by at most 1 level in at most 2 luma pixels (no seek error) | `out/logs/hanako-e2-seek-pass2.log` |
| Store | `store.py verify`: 0 problems; samples archived `--kind samples`, sheets `--kind previews` | — |

## 5. Pictures (viewed; not approval)

Contact sheets (rows read left to right, top to bottom; labels are the frame numbers in §5 order):
- `out/qa/hanako/e2/sheets/B01-sheet.png`: F0, 4, 17, 18, 31, 45 / 46, 54, 60, 116, 117, 132 / 186, 251, 273, 297, 303.
- `out/qa/hanako/e2/sheets/B02-B03-sheet.png`: F304, 340, 409, 417, 421, 436, 442 / 443, 467, 479, 513, 528, 600, 644.
- `out/qa/hanako/e2/sheets/B04-B05-sheet.png`: F645, 700, 800, 899, 900, 958, 1002 / 1015, 1016, 1068, 1100, 1143, 1171.
- `out/qa/hanako/e2/sheets/B06-B07-sheet.png`: F1172, 1246, 1296, 1348, 1349, 1364, 1430 / 1502, 1587, 1588, 1653, 1700, 1777, 1778 / 1860, 1939, 1940, 1994, 2045.
- `out/qa/hanako/e2/sheets/B08-B09-sheet.png`: F2046, 2061, 2127, 2200, 2301, 2302, 2323, 2347 / 2383, 2416, 2482, 2505, 2506, 2581, 2595.
- Full-resolution checks: `out/qa/hanako/e2/sheets/crop-B01-273-numbers.png` (stall numbers 1–5 render; the tofu look in the small sheet was a downscale artefact), `crop-B01-273-doors.png`, `crop-B05-958-caption.png` (two-line caption, clean wrap, tone marks intact).

What the frames show (checked by eye against the cue table): the hook text is on F0–F45, fading F46–F53, absent at F54; the knock captions step at F4/F18/F31; the B01-SH01→SH02 dissolve starts F117; the Japanese line appears at F251 and is in place from F273; B02 «ค่ะ» appears at F417 with the seam glow, and the fist sits at the right edge without touching the caption; B03 label fades in at F467 and the doodle reads by F479; B05 drawer and folder frames match; B06 pin and callout at F1296 to F1348; B06 credit at F1502; B07 date and name cards on the classroom; B07-SH03 film card; B08 dissolve from F2046; B09 hand raised by F2505; the B09 caption holds to F2595. Captions appear and clear on their cue frames in every sheet.

**Visual findings for owners (not fixed here):**
- **B04 opening (F645–F706):** the frames read as a near-black field. The B04 block describes "plain paper with a slow push" during «แต่เธอเป็นใคร?». Film/Boss to confirm the intended value before polish (§8 Q5).
- The default channel label (`ทำไมล่ะ`, top-left) is present on every frame, as with other shorts. Not reviewed by the user for this video.

## 6. Scene samples (integration samples, not approval)

Folder: `out/samples/hanako/HANAKO-SHORT/SCENE-R4-E2/` (ignored; archived with `store.py archive --kind samples`). Each file is a native 1080×1920 Remotion still from the selected timeline, composition `HANAKO-SHORT`, `--gl=angle`.

| Sample | Scene / shot | Frame (composition, scene-local) | Purpose | Limits |
| --- | --- | --- | --- | --- |
| `HANAKO-S01_story-scene_F0417.png` | S01 (one story scene) · B02-SH01 | F417 (scene-local 113) | story-scene representative: the reply light and «ค่ะ» | no audio; no motion check |
| `HANAKO-SHORT-B01_F0031.png` | B01-SH01 | F31 (local 31) | hook + third knock | hook fade not in frame |
| `HANAKO-SHORT-B02_F0417.png` | B02-SH01 | F417 (local 113) | same frame as S01 | duplicate of S01 file |
| `HANAKO-SHORT-B03_F0479.png` | B03-SH01 | F479 (local 36) | name label and doodle | B03 user verdict is pending on the reframe |
| `HANAKO-SHORT-B04_F0800.png` | B04-SH01 | F800 (local 155) | story panel and tag | the opening field is dark (§5) |
| `HANAKO-SHORT-B05_F0958.png` | B05-SH01 | F958 (local 58) | drawer, two-line caption | — |
| `HANAKO-SHORT-B06_F1348.png` | B06-SH01 | F1348 (local 176) | Iwate pin, callout | last frame before the dissolve |
| `HANAKO-SHORT-B07_F1700.png` | B07-SH01 | F1700 (local 112) | teacher, date, name cards | — |
| `HANAKO-SHORT-B08_F2061.png` | B08-SH01 | F2061 (local 15) | generations, caption | first frame after the dissolve |
| `HANAKO-SHORT-B09_F2505.png` | B09-SH01 | F2505 (local 203) | hand raised, caption | hold starts at F2506 |

Absolute paths: `/Users/mangkornkatawong/Developer/reels-creator/.claude/worktrees/hanako-next-437b9b/out/samples/hanako/HANAKO-SHORT/SCENE-R4-E2/<name>.png`.

## 7. Loop seam (E2 check; final seam QA is E4)

F0 (with hook) against F2595 (with the amber cool-down at its end and the caption). Above the hook band, in the mid-plate band and below the caption band the frames are pixel-identical (PSNR ∞). The only differences are the hook text (F0) and the B09 caption (F2595). So the plate, the cold key, the hand rest pose and the camera scale (s 1.08 at F2595 and at B01 f0, per the sheet) match. Still to do in E4: full-alpha seam diff of the complete frame, a played seam, and the progress-bar reset (progress bar is off by default).

## 8. Open questions (returned to the coordinator; not asked here)

- **Q1 Cue end policy (D3).** Mark or the user: approve "caption ends at measured speech" instead of the sheet's hold-to-next-cue? If not, the builder can hold to the next cue (one line change per cue).
- **Q2 Ending (D1).** Accept `A_fade` with 0/0 (the same frames as `B_loop` with no hold), or ask Boss to allow `endHoldSec` for `B_loop`?
- **Q3 Onsets (§3).** `B07-01`, `B08-01`, `KA-01` start 7–11 f before the 4 % envelope onset. Ear check (E5) decides which measure to use.
- **Q4 Knock captions (D5).** Keep the three knock captions, or drop them? The script allows either.
- **Q5 B04 opening (§5).** Intended near-black field, or the "plain paper" of the block? Film/Boss.
- **Q6 Captions `lower` (D8).** Confirm with Mark (the sheet says `middle`).
- **Q7 Samples.** Send the story-scene sample only, or the ten above? The user review is per story scene; the per-beat set is for the Editor review.

## 9. Sound (E3 input; nothing wired, nothing generated)

The timeline has no music, ambience or SFX yet (narration only). The NEEDS-GEN list from the scene sheet (lines 134, 157, 187, 226, 248, 270, 325, 341, 377, 401, 522) for E3, with the shared library candidates found in `~/ReelsStore/library/sound/INDEX.md` (not wired):
- B01-SH02 F117–F304: very low sustained sub drone (NEEDS-GEN; `bed_dark-drone-sub_01` is a library ambience candidate, not an exact match; `tone_thin-unresolved_01` rejected by the sheet).
- B01 knocks F4, F18, F31: `impact_knuckle-rap_01` (library; sheet says three copies at 0.45 s; not listened).
- B01 and B09 room tone: `room_dark-empty-building_01` (library).
- B02 F393–F417: soft reverse swell (NEEDS-GEN).
- B03: notebook rustle (NEEDS-GEN), children's whispers (NEEDS-GEN), music-box motif (NEEDS-GEN).
- B04 F645–F900: muffled wooden door slam (NEEDS-GEN) and muffled rumble (NEEDS-GEN; `quake_seafloor-rumble-muffled_01` is a possible library candidate, not auditioned).
- B05: drawer slide and paper flicks (NEEDS-GEN, F903–F1100).
- B06 F1391: soft sub hit, `impact_sub-hit-short_01` (library, sheet says candidate; must stay soft); warm pad from F1430 (NEEDS-GEN).
- B07-SH01 page-flip whoosh at F1653 (NEEDS-GEN; the sheet's interim is `whoosh_fast-slide_01`); B07 bed `bed_mystery-investigation_01` (sheet: candidate, 100 bpm, from F1588); projector click at F2022 (NEEDS-GEN; interim `ui_click-tick_01`).
- Not in the library index: whispers, music box, reverse swell, page-flip whoosh, projector click, drawer foley, warm pad.

## 10. Unverified and limitations

- Studio (`npm start`) not run; the seek check is still-based (12 shuffled frames), not a Studio random-seek session.
- No motion or continuity pass; the stills are sampled frames, not a playback check.
- No MP4 export; the render route used is `--stills`, which this configuration does not treat as runtime sample-export support.
- Audio not listened to. Timing is from the lock's proxies (energy and Whisper); ear list in `scripts/hanako/short/voice-measure.md`.
- Thai readability checked at full resolution for one two-line caption and at sheet resolution for the rest. Caption-zone numbers are background only (not glyph overlap).
- The loop seam pixel check above is a partial E4 item.
- Branch state: uncommitted; `scripts/hanako/build-notes.md` and `scripts/hanako/handoff.md` already had uncommitted edits from earlier passes (not touched beyond the appended section).

## 11. Proposals (rule documents not edited; user reviews)

- **Validator / B_loop (shared, Boss):** either allow `endHoldSec` on `B_loop`, or document that `B_loop` freezes the last 3 s of painted plates (`paintedStateAt`), so episodes with a final painted scene need `A_fade` 0/0 for no hold.
- **Scene sheet / labels (Mark):** the "label slot N … fade-in at F…" items are in-plate in the code. Record that in the sheet so the handoff stops asking for `painted.label` timing.
- **Scene sheet / hook (Mark, Film):** record that the B01-SH01 hook text is an in-plate layer, not an Editor overlay.
- **Scene sheet / cue policy (Mark):** replace "hold to next cue" with the measured-end rule in D3, or confirm the hold.
- **Scene sheet / captions (Mark):** `position: 'middle'` vs `lower` (D8).

## 12. Reproduction

Inputs: `public/narration/HANAKO-SHORT.mp3` and `.amplitude.json` (store paths in §1), `scripts/hanako/short/voice-measure.json`, `scripts/hanako/short/scene-sheet.md` (R4, cue lines), `scripts/hanako/short/script.md` (Thai text), `src/painted/shots/hanako.tsx` (shot table and plates).

```
python3 -I scripts/hanako/short/build-cues.py          # writes timeline.json and cue-measure.json
node scripts/caption-breaks.mjs scripts/hanako/short/timeline.json
npm run typecheck && npm run lint && npm test
node scripts/render.mjs HANAKO-SHORT --stills --frames=0,4,…,2595 --gl=angle --timeout=180000
sh scripts/qa-sheet.sh <out.png> --cols 6 --width 216 <frames…>
python3 -I scripts/caption-zone.py --band 860:1248 --overlay-dir <dir> <frames…>
```

Frame list (78): 0,4,17,18,31,45,46,54,60,116,117,132,186,251,273,297,303,304,340,409,417,421,436,442,443,467,479,513,528,600,644,645,700,800,899,900,958,1002,1015,1016,1068,1100,1143,1171,1172,1246,1296,1348,1349,1364,1430,1502,1587,1588,1653,1700,1777,1778,1860,1939,1940,1994,2045,2046,2061,2127,2200,2301,2302,2323,2347,2383,2416,2482,2505,2506,2581,2595.

Code revision: `3166499` + uncommitted (`src/videos/hanako/`, `scripts/hanako/short/build-cues.py`, `timeline.json`, `cue-measure.json`, this report, the appended build notes).
