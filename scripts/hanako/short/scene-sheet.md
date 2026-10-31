# HANAKO-SHORT-S01 — Hanako-san: the knock, the stories, the absence

Deliverable: `HANAKO-SHORT` · Revision: **`HANAKO-SHORT-SCENE-R4`** (supersedes `SCENE-R3`, see [change log](#change-log)) · Status: **`ready-for-dev`** (31 Oct 2026, user verdicts on the R4 review page folded in: `R4-Q1` tag 「3年2組 たなか」, `R4-P1` accepted into `B02-SH01`, `R4-Q2` keep list; `B02-SH01` and `B03-SH01` are `ready-for-dev` at R4, **`B03-SH01` flagged: reframed after build; user verdict on the R4 row stands, reframe pending user look at the new plate** (31 Oct 2026, change log); Film checks `F-R4-1`–`F-R4-7` closed by [film-r5.md](film-r5.md) `FILM-R5` (`VD24`–`VD30`, folded in 31 Oct 2026), so Boss may build the `B02`/`B03` plates (see [Dependencies](#dependencies-and-open-items)); every other shot is unchanged `SCENE-R3` text, `ready-for-dev` and user-approved at R3) · Timing: **audio-measured** (voice lock v3: S3 take 1 for `B01`–`B04`/`KA`, S3 tail re-read for `B05`–`B09`; not heard by the user, not yet checked with blockout)
Inputs: script [script.md](script.md) `HANAKO-SHORT-SCRIPT-R2` (accepted by user 30 Oct 2026), beats `B01`–`B09`, claims F001, F004, F005, F008, F012, F013, clues `CL01`–`CL04` · fact-check [fact-check.md](fact-check.md) R1 + R2 recheck, `verification-incomplete` (all sources `lead-only`) · Film brief [film-brief.md](film-brief.md) `HANAKO-SHORT-FILM-R4` (includes `FILM-R3`): `VD01`–`VD23`, plus Film R5 [film-r5.md](film-r5.md) `FILM-R5` `VD24`–`VD30` (answers `F-R4-1`–`F-R4-7`; amends `VD05` for `B03` and `VD15` to `B07-SH01` only), [user decisions](film-brief.md#user-decisions-31-oct-2026), look stills `LF01`–`LF03`, `LF03B` (user-approved), `LF06`, `LF01-HOOK-A` (accepted by the user with the glow and hook-A choice, 31 Oct 2026), `LF04`, `LF05-START`, `LF05-PULSE`, `LF05` (**awaiting user approval**) · voice lock v3 [voice-measure.md](voice-measure.md) / [voice-measure.json](voice-measure.json) and retime table [retime-r2-to-r3.md](retime-r2-to-r3.md) (`audio-measured`, Editor 31 Oct 2026) · track amplitude `public/narration/HANAKO-SHORT.amplitude.json` (2461 track frames, v3) · delivery record [../delivery.md](../delivery.md) (Full tier; user decisions 31 Oct 2026: hook wording A, glow not eye)
Target: branch `claude/hanako-chapter-review-334674`, base `52bc9d6` · 30 fps · durationFrames **2596** (45 pre-roll + 2461 track + 90 hold inside `B09`; 86.53 s, 104 f under the 90 s cap) · 1080×1920 Short · composition offset 0 (one story scene)
Evidence: runtime none (look modules `src/painted/hanako/look.tsx`, `look-r3.tsx`, `look-r4.tsx`, untracked) · render/samples: look stills only (`out/hanako-look/`), no shot frames · audio/subtitle sync: frames below come from the v3 measure file and the v3 track amplitude, not from a blockout · Boss plates: `exists-unintegrated` (groups g1–g3 and polish pass A, built against `SCENE-R3`, untracked; `B03-SH01` plate superseded by R4) · user approval: `SCENE-R2` and `SCENE-R3` all shots `ok` (review page, 31 Oct 2026); `SCENE-R4`: `R4-Q1`, `R4-P1`, `R4-Q2` `ok` (31 Oct 2026), `B03-SH01` R4 row `ok` with the arm-depth note (31 Oct 2026, [delivery.md](../delivery.md)); reframe after build not yet seen by the user
File location: the coordinator assigned `scripts/hanako/short/scene-sheet.md` (index and sheet in one file, single story scene); review rows: [review-rows.json](review-rows.json).

**Clocks.** `F` = composition-global frame (the review page's time; [preview labels](../../../docs/boss-asset-workflow.md#preview-labels)); `f` = shot-local (f0 = shot start). Ranges are half-open `[start, end)`. Timeline frame = track frame + 45.
**Where event frames come from.** Beat on/off: `voice-measure.json` `beats` (±1 f). `B01`–`B04` and `KA` frames are unchanged from `SCENE-R2` (the v3 lock did not move them); every frame from F900 on is re-derived in R3 from the v3 files, not shifted from R2. Word onsets inside a beat: the end of the matching low-energy gap in `public/narration/HANAKO-SHORT.amplitude.json` (threshold 4 % of peak, gaps ≥ 4 f), cross-checked with the Whisper anchors (`B0x-aN`, ±6 f). Where they disagree the amplitude onset is used and the anchor is named. Whisper onsets sit at the start of the preceding gap in most checked cases (e.g. `B01-a3` 273 vs gap end 283, `B04-a2` 698 vs 707, `B05-a2` 1000 vs 1027); in the v3 tail several sit on the gap end (`B06-a4` 1430, `B09-a1` 2347, `B09-a3` 2481 vs 2482). Where a phrase has no gap ≥ 4 f before the word, the anchor is used and named (`B05-a3`, `B06-a3`, `B07-a6`) or the frame is marked `est.` Editor may snap any word event by ≤ 3 f to the waveform; a larger change is a sheet revision.

## Intent and continuity

- **Before → after:** at the start the viewer has a ritual and a creepy reply. At the end the viewer knows that no evidence of a real girl has been found, that the oldest known record is a told ghost story (≈1948, Iwate), and how a teacher's book and a film spread her. The final raised fist means something new: retelling is what brings her back.
- **Concealed (whole video):** Hanako never appears in the world as a body, face, shadow or hand. She appears only as a voice (`B02`) and as a doodle labelled as a popular image (`B03`, `B07-SH03`). R4: the living child in `B03` is never named Hanako (name tag `MK-R4-D2`). `B06` shows no hand and no girl. No grave, no newspaper, no police file, no legible fabricated Japanese text (F008; script Film→Mark list).
- **Vantage:** door 3 is the anchor (`B01`, `B02`, `B08`, `B09`, `VD02`). Every return carries a new information change (ritual → reply → generations → the knock handed to the viewer).
- **FPOV (R4, user preference):** the viewer is inside the event where something happens to them: the knock (`B01-SH01`), the search (`B05`), the raised hand (`B09`) and, from R4, **being told the story by a classmate** (`B03-SH01`). Per-shot verdicts and the one proposed addition: [FPOV review](#fpov-review-r4).
- **Neighbours:** none (single scene). The only boundary is the `B09 → B01` loop seam ([below](#loop-seam-b09--b01)).

## Visual hook and retention plan

Agent-facing summary; the binding values are in the shot blocks. Frames are R3 (voice lock v3).

- **Stop-scroll frame (F0–F45, before VO at F46):** `LF01` plate state plus hook text A «เคาะสามครั้ง… มีคนตอบ?» (`VD22`, user choice 31 Oct 2026; look still `LF01-HOOK-A`): door 3 fills the width, plate "3" upper centre, the hook line above it (baseline y 356), a raised fist (the only warm value) right of centre. Three knocks at F4/F18/F31, each with a 5-px picture jolt and a caption that builds «ก๊อก» → «ก๊อก ก๊อก» → «ก๊อก ก๊อก ก๊อก» in the band (works muted). The hook line fades F46–F54 as the VO caption takes over; the hand withdraws from f36 and the picture eases back. Promise (text) + image + sound all change inside the first 1.1 s.
- **Change cadence:** a new image or a visible change lands every 1.2–4.5 s. Longest gaps without a new element (the camera moves in all of them): `B01-SH02` wide F117→F251 (4.5 s), `B03` F513→F645 (4.4 s), `B02` hush F304→F417 (3.8 s, intentional: the answer is the event), `B09` door after the glow F2383→F2482 (3.3 s), `B08` empty row F2061→F2147 (2.9 s, intentional emptiness under «อาจไม่เคยมีตัวตนจริง…»), `B06-SH01` empty map F1172→F1256 (2.8 s, now a large, recognisable Japan with a push, `VD18`).
- **The `B05`→`B06` join (v3 fix):** the narration pause `B05|B06` is now 3 f (F1170–F1173, a decay, not a designed silence). Picture carries the breath instead: riser `reveal_riser-tension_01` stops dead on «ต้นเรื่อง» F1127, hand/camera/flips freeze and the vignette holds for 45 f (1.5 s) under the decaying word, the bed drops, and the hard cut to the large empty map lands on F1172, 1 f before «เรื่องฮานาโกะ…» (F1173). The v3 cut also closes `E1`: «เรื่องฮานาโกะที่» is now in the `B06` slot (anchor `B06-a0`).
- **One striking image per beat:** B01 hook line + fist at door "3"; B02 ivory light in the latch seam on «ค่ะ» (F417); B03 the red-skirt doodle in a classmate's notebook tilted up to the viewer (FPOV, F479); B04 dark storybook sky with falling shapes (`LF02`); B05 the pale ruled blank page in a dark vignette, everything stopping dead on «ต้นเรื่อง» (F1127, `LF04`); B06-SH01 a large real-coastline Japan pushing into Iwate, pin + one amber ring (F1264, `LF05-PULSE`); B06-SH02 **the amber lamp warming the page on «แต่เป็นเรื่องผี» (F1430)**, the reveal; B07 40 amber dots across Japan (F1860–F1936); B08 translucent generations queueing at a closed door; B09 the room dims and a faint ivory glow breathes in the latch seam on «กลับมา» (F2347, `VD21`, `LF06`), then the fist rises (F2482) and the loop.
- **`B09` glow event (`VD21`, user-accepted):** key dip to 0.4 and ivory seam glow peak 0.2 at F2347 («กลับมา» onset), rise 24 f from F2323, fall 36 f to F2383. Light only, no eye, no shape, no sting. Gone 99 f before the hand (F2482) and 198 f before the seam cool (F2581), so F2595 = F0.
- **Loop-back frame:** F2595 = F0 plate (`LF01`), light cooled over F2581–F2595 (last 15 f); the hook text is an overlay that is absent from the hold and appears again on F0. The replay starts with the knock that completes «…ยกมือขึ้นเคาะ».
- **Honest risk ranking (Mark, R3):**
  1. **Weakest stretch, now F1027–F1296 (34.2–43.2 s):** blank page, then the map before the callout. R3 applies `VD17`–`VD19`: the page is the brightest value so far in a dark vignette, two flips (F1078, F1100) give the riser a rhythm, a 45-f dead stop gives «ต้นเรื่อง» its beat, then a large real map pushes 1.00 → 1.30 about the Iwate pin with one 12-f ring (F1264–F1276). Residual risk: **medium-low** until a blockout is watched. `LF04`/`LF05` are not yet user-approved. Film fallback kept: a third flip F1117–F1126.
  2. `B09` door-alone stretch, now F2302→F2482 (6.0 s, was 4.6 s): the v3 read is slower here and has a 27-f pause inside the line («และเธอจะ… กลับมาอีกครั้ง», F2320–F2347). Closed in part by `VD21` (dip + glow F2323–F2383 sits right after the pause); the tail F2383→F2482 (3.3 s) is door + push only. **Thin; watch in blockout.** Option (Mark, not adopted): start the hand 6–10 f before «ยกมือ» (inside the ≤ 3 f snap only if the Editor finds it by ear; more is a revision).
  3. `B07` cards: each B07 shot is a new full image (classroom, map with dots, poster); the date cards are secondary. `B07-SH02` dots start on «ช่วยพา» (F1860); the book card moved to the sea side (x 120–420, y 250–420) so it no longer covers Iwate.
  4. Hook strength muted: closed by `VD22` (hook text A from F0).
- Constraints held throughout: no invented victim, no gore, no evidence-looking page (ruled lines only, `VD17`), Hanako never as body/face/shadow/hand/eye (`VD21`; `VD21b` unused), leads per the brief (`VD15`, `B07-SH01` only since `FILM-R5` `VD27`; `VD16`; `B03` uses its FPOV acceptance rows), story objects above y 860, hook text outside the subtitle track and outside the seam.

## Baseline and assets

Baseline, palette, medium and projection: [film-brief Technical handoff](film-brief.md#technical-handoff), `VD01`–`VD03`, `VD12`–`VD16`. This sheet adds only shot constants.

**Named spaces (Film convention, values are Mark estimates):**
- `restroom`: origin at the floor centre of door 3's face, +x right, +y up, +z toward camera, metres. Door 0.90 × 2.00 m, bottom gap 0.12 m, centre spacing 0.95 m, doors 1–5 at x = −1.90, −0.95, 0, +0.95, +1.90 (door 1 = screen-left). Number plate "3" (digit only) 0.10 × 0.10 m centred at (0, 1.55, 0).
- Restroom plates are fixed-plane cards via kit `cardProjector(g, k, x0)` (`src/painted/kit/space.ts`), checked with `scripts/shot-projection.py` (re-run for R2, see change log):

| Plate | Camera (restroom m) | Card `g` / `k` / `x0` | Door 3 on screen | Used by |
| --- | --- | --- | --- | --- |
| `RR-KNOCK` | eye (0, 1.45, 0.78), look −z, vfov 91.5°, shift_y −0.190 | g (540, 2336), k 1200 px/m, x0 0 | edges at x 0 / 1080; plate "3" (540, 476); knock point (0.10, 1.33, 0) → (660, 740) | `B01-SH01`, `B09-SH01` |
| `RR-DOOR` (`VD12`) | eye (0, 1.45, 1.56), look −z, vfov 91.5° | g (540, 1520), k 600, x0 0 | x 270–810, top y 320, plate y 590, bottom y 1448 | `B02-SH01` |
| `RR-WIDE` | eye (0, 1.50, 3.50), look −z, vfov 107.7°, shift_y −0.240 | g (540, 801), k 200, x0 0; floor 1-pt, VP (540, 500) | x 450–630, y 400–801 (401 px); row x 69–1011 | `B01-SH02`, `B08-SH01` |

- `desk`, `map`, `storybook`, `corridor`, `classroom`, `poster`: flat picture-plane spaces, 1080×1920 px, origin top-left, y down. A `k` on a figure plane is px per metre for sizes only.
- **Picture camera:** kit `pushCamera` (`{s, fx, fy, dx, dy}`, `src/painted/kit/camera.tsx`): a push/drift of the projected picture, never world travel. **s ≥ 1.00 always.** Transform owner: the plate. SVG labels and cards sit outside the camera unless a shot says otherwise. A "jolt" below is an added `dy` on the plate camera.
- **Caption band:** y 860–1248, x 120–888 ([caption-safe box](../../../docs/production-requirements.md#vertical-caption-safe-zone); captions `position: 'middle'`). Label slots: `PaintedLabel` slot 0 y 300–350, slot 1 y 360–410, x from 120. `DATE` box (B06/B07): x 120–420, y 430–500 (as `LF03`/`LF03B`).
- **POV hand:** kit `paintPovHand`; size 1 = palm 190 px; real palm 0.085 m, so `size = 0.085·k_depth/190`. Tone: `HANAKO_HAND` (grey cardigan sleeve, `VD04`). Wrist positions are estimates from knuckle anchors; Boss confirms from the anchors `paintPovHand` returns.
- **Ambient clock cycles (seam):** fluorescent flicker period **118 f**, drip period **236 f** (R3; were 116/232 for 2552). 2596 = 4 · 11 · 59, so 118 · 22 = 2596 and 236 · 11 = 2596: ambient phase at F2595+1 equals F0. Nearest other divisors are 59/236/649 f; 118 is the closest to the R2 rhythm.
- **Screen layers (R3):** the hook text (`B01-SH01`), the `B05-SH02` vignette, the `B09` key dip and seam glow are overlay layers. Production `PaintedStage` does not mount the shared screen layers by itself ([DF-20261030-painted-screen-layers-overlay](../../../docs/dev-findings/DF-20261030-painted-screen-layers-overlay.md), workaround: the plate's `Overlay` carries them); Boss mounts them per plate.
- **Map space `map` (R3, `VD18`):** `src/painted/hanako/japan.json` `MAP-JP-50M` (Natural Earth 1:50m, equirectangular, x = (lon − 129.5) · 42.841 + 170, y = (45.6 − lat) · 54 + 150; px, origin top-left, y down). Land bbox x 160–870, y 155–979 at s 1.00. **Iwate pin tip (679.8, 471.3) → (680, 471).** Transform owner: the `MAP-JP` plate camera; pin, ring and dots are plate layers (they push with the map); callout, `DATE` box and book card are screen layers.

| Asset / capability | Owner path + commit | Status (base `52bc9d6`) | Gap / consumer |
| --- | --- | --- | --- |
| Painted pipeline: `BrushCanvas`, `PaintedStage`, `painted.shots[]`, `dissolveSec`, label slots 0/1 | `src/painted/*`, `src/scenes/painted.ts` | `existing-integrated` (R1 inspection; files unchanged by `52bc9d6`) | all shots |
| Kit: `cardProjector`, `pushCamera`/`toScreen`, `paintPovHand`, `HandTone`, `Spot`/`Vignette`, `CaptionShade` | `src/painted/kit/` | `existing-integrated` | all shots |
| `B_loop`, `endHoldSec`, `loopFadeFrames` | `src/scenes/endings.ts`, `SceneRenderer.tsx` | `existing-integrated` | `B09` (see seam) |
| Look modules: `HK` palette, `HANAKO_HAND`, `makeDoorPaint`, `Cool`, `LF01`–`LF06` still builders | `src/painted/hanako/look.tsx`, `look-r3.tsx`, `look-r4.tsx`, `look-index.ts` (untracked, Film) | `exists-unintegrated` (stills only, not registered) | Boss hardens into plates |
| Map data `MAP-JP-50M` + bake script | `src/painted/hanako/japan.json`, `NOTICE`, `scripts/hanako/bake-map.py` (untracked, Film R3) | `exists-unintegrated` | `B06-SH01`, `B07-SH02` |
| Episode plates `RR-KNOCK`, `RR-DOOR`, `RR-WIDE`, `FPOV-CHEST` (R4, replaces `CORRIDOR` for `B03`), `STORYBOOK` (2 panels), `CABINET`, `DESK-FOLDER`, `MAP-JP` (real coastline), `BOOK-SPREAD`, `CLASSROOM-80S`, `FILM-CARD` | — | `missing` | Boss |
| Child cast `CH-KID` (back / ¾-back, 1.15–1.40 m, depth arms; 1980s variant; silhouette variant) | — | `missing` at R3; R4 note: Boss built `paintKid` (polish A, untracked, look `partial`) | `B07-SH01`, `B08` (R4: no longer `B03`) |
| `CH-KID` **front chest crop** for FPOV (R4): cardigan, sailor collar, scarf, sleeves, front-view kid hands, no head; **painted in the WORLD FOG character style** (user, 31 Oct 2026; was `hardFill`), CP-P02 arms, frame to the cardigan hem (reframe) | — (precedent: painted hand + crisp screen, `src/painted/worldfog/phone.tsx`, WORLD FOG) | `missing` | `B03-SH01` (Boss; Film `F-R4-1` closed by `VD24`, `VD05` amended for `B03`) |
| `NAMETAG-B03` SVG tag in the plate camera (Noto Sans JP, `public/fonts/NotoSansJP.ttf` untracked + OFL) | — | `missing` | `B03-SH01` (`MK-R4-D2`) |
| SVG: knock caption build (Editor subtitles), hook text layer A, doodle `DOODLE-HANAKO` (R4 reframe: in `B03` **painted** on the crisp notebook page, ≈ 212 px at F479; user, 31 Oct 2026), `TAG-LEGEND`, `DATE` card, book card, film title, teacher icon (pen loop), map pin + pulse ring + callout + 5° graticule, `B09` key-dip rect + seam-glow strip/spill | — | `missing` | `B01`, `B03`, `B04`, `B06`, `B07`, `B09` |

**Findings revalidated on `52bc9d6`** (R3: index + file presence; entries unchanged since R2; three added for R3 geometry): [DF-20261030-map-land-clip-closure](../../../docs/dev-findings/DF-20261030-map-land-clip-closure.md) (checked on `japan.json`: 9 closed island rings, longest edge 38 px, no straight clip bar; `B06-SH01`, `B07-SH02`) · [DF-20261030-painted-screen-layers-overlay](../../../docs/dev-findings/DF-20261030-painted-screen-layers-overlay.md) (`B01` hook text, `B05` vignette, `B09` dip/glow) · [DF-20261030-retime-picture-parity](../../../docs/dev-findings/DF-20261030-retime-picture-parity.md) (an R2→R3 comparison at the same F is not a picture regression; compare chrome-off at shot-local frames) · [DF-20261029-painted-timeline-dissolve](../../../docs/dev-findings/DF-20261029-painted-timeline-dissolve.md) (in-canvas dissolves; seam QA on full-alpha frames only) · [DF-20261030-painted-story-hold-ambient-clock](../../../docs/dev-findings/DF-20261030-painted-story-hold-ambient-clock.md) (`B09` hold) · [DF-20261030-ending-hold-option](../../../docs/dev-findings/DF-20261030-ending-hold-option.md) · [DF-20261030-painted-label-slots](../../../docs/dev-findings/DF-20261030-painted-label-slots.md) · [DF-20261030-painted-layer-order](../../../docs/dev-findings/DF-20261030-painted-layer-order.md) (`B08` silhouettes, `B06` marks) · [DF-20261030-painted-straight-bars](../../../docs/dev-findings/DF-20261030-painted-straight-bars.md) (stall doors) · [DF-20261030-p5brush-large-fill-mottle](../../../docs/dev-findings/DF-20261030-p5brush-large-fill-mottle.md) (tile walls) · [DF-20261030-painted-arm-depth](../../../docs/dev-findings/DF-20261030-painted-arm-depth.md), [DF-20261030-zcpaint-back-view-arm-sides](../../../docs/dev-findings/DF-20261030-zcpaint-back-view-arm-sides.md) (`CH-KID`).

## Shot map

| Shot | Beat | F range | Claims / clues | Runtime mapping (planned) |
| --- | --- | --- | --- | --- |
| `HANAKO-SHORT-S01-B01-SH01` knock | `B01` | [0, 117) | F005 · `CL01` | scene 1, `RR-KNOCK` |
| `…-B01-SH02` row | `B01` | [117, 304) | F005 · `CL01` | scene 1, `RR-WIDE` (dissolve in) |
| `…-B02-SH01` reply | `B02` + KA | [304, 443) | F005 · `CL02` | scene 2, `RR-DOOR` |
| `…-B03-SH01` FPOV: classmate's notebook + doodle (R4) | `B03` | [443, 645) | F001/F004/F013, name · `CL03` | scene 3, `FPOV-CHEST` (R4; was `CORRIDOR`) |
| `…-B04-SH01` two legends | `B04` | [645, 900) | F008 · `CL04` | scene 4, `STORYBOOK` |
| `…-B05-SH01` drawer | `B05` | [900, 1016) | NF reasoning | scene 5, `CABINET` |
| `…-B05-SH02` blank pages | `B05` | [1016, 1172) | F008 | scene 5, `DESK-FOLDER` |
| `…-B06-SH01` Iwate pin | `B06` | [1172, 1349) | F001 | scene 6, `MAP-JP` |
| `…-B06-SH02` book spread, lamp | `B06` | [1349, 1588) | F001, F008 | scene 6, `BOOK-SPREAD` (dissolve in) |
| `…-B07-SH01` teacher, 80s | `B07` | [1588, 1778) | F004 | scene 7, `CLASSROOM-80S` |
| `…-B07-SH02` 1990 book, dots | `B07` | [1778, 1940) | F004 | scene 7, `MAP-JP` (return) |
| `…-B07-SH03` mid-90s film | `B07` | [1940, 2046) | F012 | scene 7, `FILM-CARD` |
| `…-B08-SH01` generations | `B08` | [2046, 2302) | F008, F004/F013 · pays off `CL01`–`CL04` | scene 8, `RR-WIDE` (dissolve in) |
| `…-B09-SH01` glow, hand raised + hold | `B09` | [2302, 2596) incl. hold [2506, 2596) | NF · pays off `CL01` | scene 9, `RR-KNOCK` |

Short forms (`B01-SH01` …) are used below. `B01`–`B04` ranges are unchanged from R2; every range from `B05-SH01`'s end on is new in R3.

## B01-SH01 — the knock (hook, loop landing)

Range: F [0, 117); f = F. Ends where the dissolve to SH02 starts, on «ห้องที่สาม» onset F117 (amplitude; anchor `B01-a2` F107).
Direction: extreme close POV on door 3's face (`LF01`), with the hook line A above the plate for the first 1.5 s (`VD22`, `LF01-HOOK-A`). Plate "3" upper centre (y 426–526), knock point (660, 740). Three knocks before any VO, the hand withdraws, the picture eases back. Below y 860 only flat door panel and louvre, dark and quiet. No Japanese line in this shot (`VD23`; it enters in `B01-SH02` at F251).
Staging (`RR-KNOCK`, plate px; restroom m in brackets):

| Entity | f0 | Keys (shot-local) | Facing / contact |
| --- | --- | --- | --- |
| R fist knuckle anchor | rest (733, 715) [(0.13, 1.37, 0.15)], size 0.66, curl 1, dir −2.2 rad | contact f4, f18, f31 at (660, 740) [(0.10, 1.33, 0)], size 0.54, press 1 on the contact frame only (3 f ease-in, 5 f ease-out); back at rest f9, f23, f36; withdraw f36→f50 to (1180, 820), exits right | knuckles to the door; no door deflection |
| Elbow (off-frame) | (1424, 986) [(0.34, 1.30, 0.42)] | follows the wrist; forearm crosses x 1080 at y ≈ 851 | — |
| Door 3, plate "3" | static | — | closed |

| Hook text A (overlay, screen layer, `VD22`) | «เคาะสามครั้ง… มีคนตอบ?» one line, centred x 540, baseline y 356, Noto Sans Thai 800, 64 px, fill `#f2f4ee`, stroke `#10181a` 9 px (paint-order stroke) | hard on f0, held to f45; opacity 1 → 0 over f46–f54 (8 f, linear); absent from f54 | outside the plate camera (does not scale or jolt); not in the subtitle track |

depth: fixed plane; layers: plate (door, plate "3") < hand + forearm < hook text overlay < subtitles. Hook geometry check (R3, Mark estimate from the font metrics, confirmed by look on `LF01-HOOK-A`): glyph top ≈ y 292 (upper tone mark of «ครั้ง»; safe top 288), bottom ≈ y 360 (no below-base vowels in wording A); plate "3" top at f0 (s 1.08 about (660, 740)) = 740 + 1.08 · (426 − 740) ≈ y 401, so ≥ 40 px clear (Film's rule ≥ 20 px). Top margin is only ≈ 4 px: Boss keeps the baseline at y 356 and does not enlarge the type.
Camera: f0–f35 hold s 1.08, focus (660, 740) (= `B09` end). **Knock jolt:** dy +5 px on f4, f18, f31, back to 0 over 4 f (linear); f0 has no jolt. f36 → f116: s 1.08 → 1.00, same focus, sine in-out. Plate-owned.
Look: cold fluorescent key (`VD02`, `VD03`); f0 is the cold state (seam, user Q4). Ambient flicker on the 118-f cycle (R3).
VO + subtitles: VO starts F46 «ชั้นสาม… ห้องน้ำหญิง» (continues in SH02). Subtitle cues (proposed; Editor builds): [4, 18) «ก๊อก», [18, 31) «ก๊อก ก๊อก», [31, 46) «ก๊อก ก๊อก ก๊อก», [46, 117) «ชั้นสาม… ห้องน้ำหญิง». F0–F3 no caption. **On-screen text cue (separate from the subtitle track, `VD22`):** [0, 46) hook text A, fade-out [46, 54); Editor builds it as an overlay layer, not a subtitle.
Sound: room tone `room_dark-empty-building_01` from f0 (same bed as the `B09` hold). Knocks `impact_knuckle-rap_01` at f4, f18, f31 (library note: three copies at 0.45 s; not listened). No music.
Mix intent: hit (knocks dry and close) → hold.
Cut/transition: dissolve to SH02 (see SH02).
Entry → exit: f0 = `B09-SH01` last frame F2595 (hand raised, s 1.08, cold) plus the hook text overlay. Exit f116: no hand, no hook text, s 1.00.
Acceptance:

| Frame | Observable | Evidence |
| --- | --- | --- |
| F0 | plate layers (hook text layer **off**) equal `B09-SH01` F2595 (ambient terms equal by cycle 118/236) | pixel diff, full-alpha |
| F0–F45 | hook text inside x 120–888, y 288–860; last line ≥ 20 px above plate "3"; opacity 1; F54 opacity 0 | QA sheet F0, F45, F50, F54 |
| F4, F18, F31 | knuckle contact + jolt + knock onset + caption step on the same frame | QA sheet + waveform |
| all | hand never below y 860 inside x 120–888; plate "3" inside y ≥ 288 | QA sheet |

## B01-SH02 — the row (ritual spelled out)

Range: F [117, 304); f0 = F117. The dissolve occupies [117, 132). Ends at the `B02` slot start F304 (B01 VO ends F297).
Direction: the row of five stalls, door 3 centred: "third stall of five". Tile wall above, tube at y ≈ 280, floor in 1-pt perspective below y 801. Floor below y 860 is dark wet tile.
Staging (`RR-WIDE`): doors 1–5 closed, no figures. Floor drain (−1.2, 0, 0.5) ≈ (263, 851). The four other doors one value step darker.
Camera: in-canvas dissolve from `RR-KNOCK` (`dissolveSec` 0.5 = 15 f) at F117. `RR-WIDE` s 1.10 → 1.00 about (540, 600) over [117, 304), sine out, so the two eased pull-outs read as one pull-back (match-dissolve, plate ratio ≈ 6:1).
On-screen text: 「花子さん、いらっしゃいますか」 (F005, user Q3), SVG ≈ 30 px, light grey with outline, centred x 540, box y 800–846; 6-f fade-in from F251 («ฮานาโกะซัง» onset, amplitude; anchor `B01-a3` «อยู่ไหมคะ» F273), held to the cut.
VO + subtitles: «ชั้นสาม… ห้องน้ำหญิง ห้องที่สาม เคาะสามครั้ง แล้วถามว่า… “ฮานาโกะซัง อยู่ไหมคะ?”» (whole B01 line, F46–F297). Cues: [117, 251) «ห้องที่สาม เคาะสามครั้ง แล้วถามว่า…», [251, 304) «“ฮานาโกะซัง อยู่ไหมคะ?”».
Sound: room tone continues. Very low sub drone fades in over 30 f from F117: `NEEDS-GEN` "very low sustained sub drone, no pitch movement, fades in over 1 s, dry" (`tone_thin-unresolved_01` is thin/high, rejected unless the Editor audit accepts it). Bed drops to room tone only for F297–F305 (the locked pause is 8 f, not the script's 0.4 s; measure note).
Mix intent: lift (drone) → drop.
Cut/transition: hard cut to `B02-SH01` at F304.
Entry → exit: dissolve state → wide at s 1.00, Japanese line on.
Acceptance: door 3 at x 450–630, y 400–801 (±10 px) at f186 (s 1.00) · Japanese line inside y 800–846, x 120–888 · no figure.

<a id="b02-sh01--the-reply-ค่ะ-light-only-event"></a>
## B02-SH01 — the reply "ค่ะ" (light-only event; R4: your fist is still up)

Range: F [304, 443); f0 = F304. (R4: `R4-P1` accepted by the user 31 Oct 2026; the POV fist layer is added, everything else is the R3 block unchanged.)
Direction: `RR-DOOR` (`VD12`): the whole door with both side seams, plate "3" (y 560–620), dark seams x 262–270 and 810–818. In the world nothing moves except the camera and the light. **R4:** the viewer's own right fist (`HANAKO_HAND_B02`: `HANAKO_HAND` dimmed 50 % toward `#060c0d`, same hue family as the `B01-SH01` hand and sleeve; `FILM-R5` `VD29`) stays raised in the lower-right corner, so «ค่ะ» answers the knock the viewer just made ("you knocked, and she answered you").
Staging: door 3 closed throughout. No figure, shadow or hand of anyone else. The fist is the viewer's (`MK-R4-D5`: the viewer's grey sleeve, never the teller's navy cardigan).
Space `screen` (fist layer, R4): px, 1080×1920, origin top-left, y down; a screen layer **outside** the `RR-DOOR` plate camera (the door creeps closer, the hand stays with the viewer). Transform owner: the fist layer (not `pushCamera`). depth: layers plate (door, seam light) < POV fist + sleeve < subtitles.

| Entity | Anchor / box (`screen` px) | Keys (F, integer) | Facing / contact |
| --- | --- | --- | --- |
| R fist knuckle anchor (`paintPovHand` / `paintKnockHand`, `HANAKO_HAND_B02`) | **(990, 745)** at F304; size **0.80** (`FILM-R5` `VD29`, was (965, 735) / 1.05: palm 190 · 0.80 ≈ 152 px, ≈ 0.53 m from the eye, the `B01-SH01` knock hand slightly nearer; Film estimate from `hands.ts`, Boss confirms), curl 1, dir ≈ −2.4 rad; elbow and sleeve off-frame lower right | raised at F304 → sinks dy +6 px to (990, 751) over F304–F409 (linear) → still F409–F417 (bed drop) → **flinch F417–F421** (4 f, ease-out, not before F416): knuckles pull back +10 px x, +6 px y to (1000, 757) → hold to the cut F443 | knuckles toward the door, no contact; no motion after F421 |
| Fist + sleeve envelope (whole shot, incl. sink and flinch) | **hand left extent ≥ x 892** (Film estimate ≈ x 899 at size 0.80), hand bottom ≤ y 850; sleeve may be left of 888 only above y 860 and never within 55 px of the seam; below y 860 the sleeve stays at x ≥ 888 and may run to the bottom edge | — | right of the caption box (x ≤ 888); hand ≥ 55 px (target ≥ 65) right of the latch seam (screen x 810–835 through the push); above the band (y 860). If the sleeve breaks the envelope, steepen the forearm (elbow ≈ (1080, 1000), `sleeveFrom` ≈ (1100, 1250); Film estimate, `capsule` width not verified) |

Hands/props: entry = right hand closed in a fist, raised, holding nothing (the knock hand of `B01-SH01`; it withdrew there at f50 and `B01-SH02` is the objective wide, so its return here reads as a return to the viewer's eyes); exit = same fist, still, at (1000, 757). Left hand not in frame. Nothing held or moved.
Camera: `pushCamera` s 1.00 → 1.06, focus (540, 590), over [304, 443), linear (slow creep toward the latch seam: a hush the viewer leans into). The fist layer is not pushed.
Look: cold key. **Reply light (`VD13`):** latch-side seam (x 810–818, visible y 320–860) plus faint spill on the tile at its foot, ivory `#efe3c4`, kit `Spot` along the seam, level 0 → 0.2 over F414–F417, peak at **F417** (KA onset), 0.2 → 0 over F417–F435. No repeat. The under-door gap may warm too (not relied on). **Fist:** the darkest value on the right side of the frame (cold key, no seam-light rim and no ivory on the knuckles at any frame), so the seam stays the brightest event at F417 (`FILM-R5` `VD29`). Tone `HANAKO_HAND_B02` = `HANAKO_HAND` blended 50 % toward `#060c0d` (`VD21` dip colour), Film estimates: skin `#786758`, shade `#6b5748`, deep `#635144`, nail `#7d746d`, crease `#513d2f`, sleeve `#313939`, sleeveShade `#262e2e`.
VO + subtitles: «ตามที่เล่ากันบ่อย ๆ… จะมีเสียงตอบกลับมาว่า… “ค่ะ”». Narrator F305–F409; «ค่ะ» is the separate reply clip `KA-T1` F417–F436. Cues: [305, 349) «ตามที่เล่ากันบ่อย ๆ…», [349, 417) «จะมีเสียงตอบกลับมาว่า…», [417, 443) «“ค่ะ”».
Sound: room tone only. Silence by dropping the bed F409–F417. Reverse swell ending exactly at F417: `NEEDS-GEN` "soft reverse swell, 0.8 s, airy, ends abruptly, dry" (start F393). No hit, no music. **No SFX on the fist flinch** (f113 = F417): a cloth rustle would sit on «ค่ะ»; the flinch is picture only.
Mix intent: drop → hit (soft; the voice is the event) → hold.
Cut/transition: hard cut to `B03` at F443 (the fist leaves with the cut; `B03` shows no viewer hand).
Entry → exit: closed door, cold, fist raised at (990, 745) → closed door, cold (glow 0 from F435), fist held at (1000, 757).
Acceptance: glow peak frame = F417 ±1 · glow visible above y 860 · no shape or figure in the seam · door 3 x 270–810 at f0 · **R4 (`FILM-R5` `VD29`):** hand left extent ≥ x 892, hand bottom ≤ y 850; sleeve left of 888 only above y 860 and never within 55 px of the seam · seam glow unobstructed at F417 ±1 (fist ≥ 55 px right of the seam on screen) · flinch onset F417 ±1 with «ค่ะ», 4 f, ≤ 12 px · fist mean luminance below the seam strip mean and below the local door/tile background beside it at F417 · sleeve tone `HANAKO_HAND_B02` (dimmed 50 % toward `#060c0d`), same hue family as `HANAKO_HAND` · Boss confirms the knuckle anchor and size from the anchors `paintPovHand` returns (QA sheet F304, F409, F417, F421, F442 + measured box).

<a id="b03-sh01--children-retell-her-doodle-name"></a>
## B03-SH01 — a child retells her to you (FPOV, notebook, name)

Range: F [443, 645); f0 = F443. (R4: framing and staging replaced by the user's FPOV request; range, VO, cues, label timing and sound frames unchanged from R3. **Reframed after build**, 31 Oct 2026, user after seeing the built plate: tighter frame ending at the cardigan hem, notebook grip raised so forearms and elbows read; see [change log](#change-log).) **Review status:** user verdict on the R4 row `ok` (31 Oct 2026, note on arm anatomy/perspective in depth, [delivery.md](../delivery.md)) **stands**; the reframe is pending the user's look at the new plate. Not visual acceptance.
Direction: **first-person POV, the viewer is the listening child** (`MK-R4-D1`). A classmate stands close in front of the viewer; the frame runs from just below the chin to the cardigan hem: dark navy school cardigan buttoned over the sailor uniform, the sailor collar and scarf knot on top, sloped shoulders, a crisp name tag on the wearer's left chest (screen right). The frame top sits below the chin: no chin, jaw, mouth or hair at any frame. The classmate holds a small open pocket notebook in both hands at lower-chest height, **elbows back, forearms forward** ([CP-P02](../../../docs/character-proportion-principles.md#cp-p-arm-depth)): both forearms come forward to the notebook's side edges, foreshortened, cuffs over the wrists, thumbs on the page front; the upper arms sit behind the torso and show only as darker sleeve slivers down to the elbows. At entry the page is tipped back (top toward the teller), a thin strip that hides neither chest, tag nor arms (under «เธอคือ»). On «ฮานาโกะซัง» the teller rolls the notebook up about the grip line to face the viewer and the red-skirt bob doodle (`DOODLE-HANAKO`, `VD06`) reads full-face from F479; the label lands at F467. On «ผีห้องน้ำโรงเรียน» the viewer leans in (camera push step toward the notebook). Behind the classmate only a soft painted corridor wash shows at the side gaps. Story meaning: the story is being told **to the viewer**, who becomes the next child in the chain (`B07`, `B08`) and knocks in `B09`.
Space `chest` (reframe, Mark estimate): flat picture plane, 1080×1920 px at s 1.00, origin top-left, y down; **k ≈ 3400 px/m** on the chest plane for sizes only (shoulder width ≈ 1000 px ≈ 0.29 m for a ≈ 1.30 m child; pocket notebook open 540 × 360 px ≈ 0.16 × 0.11 m, smaller than the earlier A6; tag 220 × 75 px ≈ 0.065 × 0.022 m). depth: fixed plane; layer order: corridor wash < upper-arm sleeves (behind) < torso (cardigan, collar, scarf) < name tag (SVG) < notebook + doodle < forearm sleeves + cuffs < teller's hands (thumbs over the page front) < label < subtitles. No behind/front layer switch in the shot (CP-P06 not needed).
Staging (`chest` px; screen = focus + s · (p − focus), focus (540, 620)):

| Entity | Plate position / box | Keys (F) | Facing / contact |
| --- | --- | --- | --- |
| Teller torso (`CH-KID` front, frame top below the chin to the hem, ≈ 1.30 m child) | collar back and blouse V fill the frame top at x 400–680, y 0 (no neck skin in frame); sloped shoulders from the collar to outer shoulder points (40, 235) / (1040, 235), wash in both upper corners; torso edge x 95 / 985 at y 450, x 105 / 975 at y 700, **x 118 / 962 at y 818** (elbow height), x 135 / 945 at the waist y 930; boxy cardigan flares to x 115 / 965 at the **hem y 1620** (ribbed band ≈ 30 px, one value step lighter than the body); pleated skirt below y 1620; buttons on x 540 and two patch pockets x 230–400 / 680–850, y 1260–1400 (low contrast) | static; breathing drift dy ±3 px on a 90-f sine (ambient, optional; moves torso, arms, tag and notebook together) | faces the viewer square-on; no head in frame |
| Sailor collar + scarf knot | collar over the shoulders; front V apex (540, 339); outer collar edge straight from the apex to the shoulder points (50, 200) / (1030, 200) (white line ≤ 2 px on the collar side of that edge); scarf knot box x 505–575, y 310–350; tails x 515–565 to y 470 | static | — |
| Name tag (`NAMETAG-B03`, SVG, plate layer) | **x 720–940, y 305–380**, pinned flat on the wearer's left chest below the outer collar edge (edge y 288 at x 720, so ≥ 17 px clear) | static (pushes with the plate) | text (user, `R4-Q1`, 31 Oct 2026): 「3年2組」 small line + 「たなか」 main line (main ≈ 36 px plate size); never «ฮานาโกะ» / 「花子」 (`MK-R4-D2`) |
| Notebook (pocket notebook open, two pages 270 × 360 face-on; crisp allowed) | x 270–810; **pivot = grip line y 699** (hands); face-on 240 px above and 120 px below the grip; projected top = 699 − 240 · cos θ, bottom = 699 + 120 · cos θ | page angle to the viewer **70° → 8°** over **F467–F479** (12 f, ease-out), rotating about the grip line: plate y 617–740 at F443–F467 → y 461–818 at F479, held to the cut | held by the teller; tipped back (top toward the teller) at entry |
| Doodle (`DOODLE-HANAKO`, painted, on the right page) | face-on box x 600–760, from 230 to 20 px above the grip line (210 px tall); projected ×cos θ with the page | readable from **F479** (≈ 208 px on the plate, ≈ 212 px on screen); ≈ 237 px at F644 | red `#c8403f`, the only saturated value |
| Teller hands (kid hands, painted, front view) | L hand box x 200–300, y 640–760, thumb on the page front x 270–305, y 660–720; R hand box x 780–880, y 640–760, thumb x 775–810, y 660–720; wrist (235, 760) / (845, 760) | static (the tilt is a wrist roll about the grip line; thumbs stay on the side edges) | **fingers hidden behind the page**; each hand shows the heel/outer edge outside the page edge and the thumb on the page front (`VD24`); hand tone from polish-A `kidHand`, saturation ≤ 0.35 |
| Forearms + cuffs (cardigan sleeve, front layer, foreshortened) | cuff opening (an ellipse facing the viewer) L centre (230, 772), 120 × 64 px (x 170–290, y 740–804), R centre (850, 772) (x 790–910); a ≤ 10 px blouse cuff strip `#b4bbb1` on the cuff's upper rim over the wrist; sleeve tapers back from the cuff to the **elbow L (125, 818) / R (955, 818)**: visible forearm ≈ 115 px from cuff centre to elbow, angled up and inward | static | CP-P02: elbow 7 px inside the torso edge, 58 px below the wrist; the rounded elbow end is the back of the forearm sleeve, lowest contour ≤ y 820 |
| Upper arms (sleeve, behind the torso, one value darker) | visible only outside the torso edge: outer contour L (100, 520) → (88, 760) → rounding into the elbow (125, 818); R (980, 520) → (992, 760) → (955, 818); sliver width 0 at y 520 growing to ≤ 24 px at y 760; inner edge hidden by the torso | static | the sliver leans outward toward the elbow (arm angled back), never a parallel vertical tube; no ink line on its inner side |

Hands/props: the notebook is in the teller's two hands from entry to exit; the viewer's own hands do not appear (they appear in `B01`, `B05`, `B09`). Nothing is passed, written or pointed at.
Camera: `pushCamera`, focus (540, 620) fixed (the notebook centre, so the lean goes toward the book). s 1.00 → 1.04 over F443–F513 (sine in-out); **lean-in** s 1.04 → 1.12 over F513–F528 (sine in-out); s 1.12 → 1.14 over F528–F645 (linear). Plate-owned (torso, arms, tag, notebook, doodle, hands push together); label and subtitles are screen layers. Geometry (Mark, arithmetic on the formula above; s 1.0105 at F467, 1.0209 at F479): at s 1.14 notebook x 232–848, y 439–846; elbows (67, 846) / (1013, 846); cuff bottoms y 830; tag x 745–996, y 261–346; V apex y 300; hem y 1760 (skirt 160 px to the frame bottom; 300 px at F443); torso edge at y 450 x 33 / 1047; frame top shows plate y ≥ 76 (collar and knot stay in frame).
Look (user decisions, 31 Oct 2026, override `VD24`'s `hardFill` for this shot; recorded by `FILM-R6` `VD31`–`VD35`, `VD34`): the classmate figure (cardigan, collar, scarf, sleeves, hands) and the picture inside the notebook (`DOODLE-HANAKO`) are **painted in the WORLD FOG character style** (seeded wash, ink, one cel shade on the screen-right side), **not SVG and not flat `hardFill`**; the notebook paper **may stay crisp**; the name tag **stays crisp SVG**. Background is a painted wash of the dim corridor (no outlines, no hard edges; window light upper left), per the [painted-2d art defaults](../../../.claude/skills/painted-2d/SKILL.md). Colours (`FILM-R5` `VD25`): cardigan `#26303a`, upper-arm sleeves one step darker (≈ `#1b232b`, Mark estimate), collar `#1f2a36` with one off-white line `#cfd3c8` (≤ 2 px), blouse in the V and cuff strips `#b4bbb1`, scarf dark teal `#3c5d5b` (shade side `#2c4645`; never red or amber), notebook paper `#d8dccf` (brightest value), tag body `#cdd1c3`, tag border `#5d6f7a`, tag text `#1d2a2c`, teller hands `kidHand` tone (saturation ≤ 0.35), doodle skirt `#c8403f`. `VD33` limits: page ground outside the doodle ≥ `#d4d8cb`, no cel shade on the page; figure ink no darker than `#141b21`, no ink on the sliver's inner edge and ≤ 2 px on its outer edge; body cel-shade side ≥ `#202932`, right sliver ≥ 6 levels under its own side (≈ `#151c23`); cuff strips may take the cel shade (≥ `#9ea69d`), never lighter than the blouse in the V. Dim cool daylight from the upper left: rim `#7f9a98` on the screen-left shoulder only (≤ 3 px), the notebook page is the brightest value, the doodle red the only saturated one, no amber (`VD03`). Side-gap wash lighter than the cardigan: up to `#6f8f8c` upper left above y 700, not below `#3d5453` on the right, and ≤ `#3d5453` below y 860; nothing above the collar except empty corridor wash in the upper corners.
Label: slot 0 «ฮานาโกะซัง (トイレの花子さん)», one line, 6-f fade-in at F467 («ฮานาโกะซัง» onset, amplitude; anchor `B03-a1` F444 = «เธอคือ»), held to the cut. **Position (reframe): ink box incl. stroke x 120–664, y 357–405** (baseline ≈ 395, est.; B03-only override of the slot-0 y), on the cardigan below the V apex: ≥ 21 px below the apex and every collar line (apex on screen y 336 at F467, 300 at F644), ≥ 34 px above the notebook top (439 at F644), ≥ 58 px left of the tag (x ≥ 722); it crosses only the dark scarf tails (x 515–565).
VO + subtitles: «เธอคือฮานาโกะซัง ผีห้องน้ำโรงเรียน ที่เด็กญี่ปุ่นเล่าต่อกันมาหลายรุ่น» (F444–F638). Cues: [444, 513) «เธอคือฮานาโกะซัง», [513, 557) «ผีห้องน้ำโรงเรียน», [557, 645) «ที่เด็กญี่ปุ่นเล่าต่อกันมาหลายรุ่น».
Sound: music enters at F443: `NEEDS-GEN` "slow minor music-box motif, sparse, 70 bpm, loopable, no drums" (shared with `B08`; interim candidate `tension_drone-sparse-piano_01`). Children's whispers from F585 («เล่าต่อกันมาหลายรุ่น»; anchor `B03-a2` F583) to F645: `NEEDS-GEN` "overlapping children's whispers, unintelligible, no words, loop-safe, close-medium, dry". No room tone (new location). Optional (Editor's ear, R4): one soft paper rustle at f24 (F467) with the tilt, `NEEDS-GEN` "small notebook tilted in two hands, soft paper rustle, 0.3 s, close, dry"; it moves no existing cue.
Mix intent: lift (music enters low).
Cut/transition: hard cut in from `B02` at F443 (centred door → centred torso: a graphic match on the vertical centre, cold → dim daylight) and hard cut to `B04` at F645 (notebook paper → storybook paper: the told-story frame continues).
Entry → exit: notebook tipped back (thin strip, doodle unreadable), chest, tag, forearms and elbows readable, hem near the frame bottom, s 1.00 → doodle full-face, label on, s 1.14, hem at y 1760.
Acceptance (FPOV rows; `FILM-R5` `VD27` rows kept with the reframe numbers, amended by `FILM-R6` `VD31`–`VD35`; `VD15` covers `B07-SH01` only):

| Frame | Observable | Evidence |
| --- | --- | --- |
| F443 | wash visible on both sides of the torso at y 450 (torso x 95–985) and y 700; tag fully visible; no skin above the collar; doodle unreadable (page ≥ 60°); both forearms, cuffs and elbows unoccluded by the page strip (y 617–740) | QA sheet |
| F443 / F644 | framing ends at the hem: cardigan hem at y 1620 ±30 (F443) and 1760 ±30 (F644); skirt ≤ 300 px tall at any frame; no continuous dark column from y 860 to 1920 | QA sheet + measured hem line |
| all | **arms (CP-P02):** each elbow bend on screen inside x 60–135 / 945–1020, y 813–849, ≤ 15 px inside the torso edge and ≥ 40 px below its wrist; visible forearm cuff-to-elbow ≥ 90 px, foreshortened (cuff wider than the elbow end); upper-arm sliver darker than the cardigan by ≥ 6 luminance levels, ≤ 30 px wide, visible length ≤ 300 px on the plate (≤ 340 px on screen at s 1.14), leaning outward toward the elbow; side-by-side at 270 px with WORLD FOG `S02-SH03` (`out/qa/hanako/s1r4-painted/reference/S02-SH03_G816.png`) the elbows read as going back into depth | QA sheet + measured boxes + reference sheet |
| F467–F479 | tilt 70° → 8° about the grip line (thumbs move ≤ 5 px); label fade starts F467 ±1; F479 ±1 doodle ≥ 200 px tall on screen and recognisable (bob + red skirt) on a 270-px sheet | QA sheet F467, F473, F479 |
| F513–F528 | lean-in push step visible, no jump at its ends | QA sheet F510, F520, F530 |
| all | notebook, doodle, hands, cuffs and elbows above y 860 (planned max y 846; elbow lowest contour incl. ink ≤ 849 ±3 px, `VD31`/`FILM-R6` arithmetic note); label ink box ≥ 20 px clear of the tag, the notebook top, the V apex and the collar lines | QA sheet + measured boxes |
| all | no chin, jaw, mouth, hair or eye; tag reads 「3年2組」 + 「たなか」 exactly (`R4-Q1`), never «ฮานาโกะ»/「花子」 | QA sheet + full-res crop of the tag |
| F443 / F479 / F528 / F644 | `caption-zone.py --band 860:1248`: mean ≤ 0.25, p95 ≤ 0.40 (band = lower cardigan + side-gap wash; `VD31` passes by bound, Boss remeasures after the rebuild) | `caption-zone.py` |
| all | figure and doodle painted (no `hardFill` or SVG on them); notebook crisp allowed; tag crisp SVG; background wash with no hard edge behind the torso | full-res crop |
| F479 | value order: page mean > tag-body mean > blouse mean > scarf mean; page ground ≥ `#d4d8cb`; cuff strips ≤ blouse (`VD33`); doodle red is the only region with saturation > 0.5 (`VD27`-1) | measured boxes (Boss) |
| F443 | silhouette: cardigan outline separated from the wash on both sides by ≥ 20 luminance levels (0–255) at y 450 and y 700 (`VD27`-2) | measured samples |
| s 1.14 (F528–F644) | tag legibility: 「たなか」 and 「3年2組」 with no clipped glyph; main-line cap height ≥ 36 px on screen (`VD27`-3); any missing Noto Sans JP glyph is a blocker | full-res crop of the tag |
| all | hands: no fingers visible beyond the page edge; both thumbs overlap the page front; heel of each hand visible outside the page edge; visible hand (heel + thumb) box ≥ 100 × 120 and ≤ 125 × 150 px on the plate (`VD32`); hand bottoms ≤ y 849 at s 1.14 (`VD27`-4) | QA sheet + full-res crop |

## B04-SH01 — two legends, labelled as told

Range: F [645, 900); f0 = F645.
Direction: storybook paper backdrop (`STORYBOOK`, crayon/paper-cut, `VD07`). During «แต่เธอเป็นใคร?» plain paper with a slow push. Panel A arrives full size (the `LF02` layout) for the war story; on «บ้างก็ว่า» Panel B slides **over** it in the same box, its torn left edge being the seam. One large image at a time instead of two half-size panels (R2 change, see change log). No person in either panel.
Staging (`storybook` px):

| Element | Box | Motion | Content |
| --- | --- | --- | --- |
| Panel A | x 110–970, y 390–840 | slides in from x −900, F707–F719 (ease-out) («บางคนเล่าว่า» onset, amplitude; anchor `B04-a2` F698); dims to 70 % value under B from F820 | dusk sky, small house silhouette (base (540, 800)), irregular rubble-like falling shapes drifting down 90 px over F707–F832 (`LF02`; Film note (2): less crystal-like); **no flash, no fire, no figure** |
| Tag A «เรื่องเล่า» | x 120–300, y 340–390 | arrives F711 (6 f fade); covered when B lands | SVG pill |
| Panel B (torn left edge) | x 110–970, y 390–840 | slides in from x +1080, F820–F832 (ease-out) («บ้างก็ว่า» onset, amplitude; anchor `B04-a3` F817) | stall door ajar x 430–650, y 430–820, dark gap 30 px; hard-fill paper cuts (Film note (2)); no figure; door static |
| Tag B «เรื่องเล่า» | x 120–300, y 340–390 | arrives F836 | SVG pill |

depth: fixed plane; layers: paper < Panel A < Tag A < Panel B < Tag B < subtitles. Below y 860: plain paper only.
Camera: plate `pushCamera` s 1.00 → 1.05, focus (540, 615), over [645, 900). Panels and tags move with the plate camera.
Look: crayon palette, mid-dark values.
VO + subtitles: «แต่เธอเป็นใคร? บางคนเล่าว่า เธอตายตอนระเบิดลงสมัยสงคราม บ้างก็ว่า ถูกฆ่าในห้องน้ำ» (F646–F893). Cues: [646, 707) «แต่เธอเป็นใคร?», [707, 820) «บางคนเล่าว่า เธอตายตอนระเบิดลงสมัยสงคราม», [820, 900) «บ้างก็ว่า ถูกฆ่าในห้องน้ำ».
Sound: music thins to a held note from F645. Panel landings `whoosh_fast-slide_01` (soft) at F707 and F820. War-story cue at F742 («เธอตาย…» onset): `NEEDS-GEN` "distant low-passed rumble, storybook-muffled, no explosion transient, no siren". Second story at F851 («ถูกฆ่าในห้องน้ำ» onset; anchor `B04-a4` F848): `NEEDS-GEN` "single muffled wooden door slam, far, low-passed". **No real air-raid, siren, explosion or scream.**
Mix intent: drop (held note) → two small storybook hits under the VO.
Cut/transition: hard cut to `B05` at F900.
Entry → exit: plain paper → Panel B with Tag B (Panel A dimmed beneath, edge visible at the torn seam).
Acceptance: each tag on screen whenever its panel is the top panel · nothing below y 860 except paper · no depicted victim · Panel B's torn edge visibly overlaps A (the seam).

## B05-SH01 — the search: drawer of empty folders

Range: F [900, 1016); f0 = F900. Ends in the sentence pause F1002–F1026 (amplitude), 11 f before «แต่ยังไม่พบ…» (F1027).
Direction: POV at a filing cabinet (`CABINET`, drawer-face k ≈ 1245 px/m). R hand pulls the drawer; hanging folders inside have blank tabs; L hand flicks the tabs. Hands enter from the side edges, never the bottom (`VD04`).
Staging (`desk`-type flat plate px; R2 positions unchanged, frames R3):

| Entity | Start | Keys | End |
| --- | --- | --- | --- |
| Drawer front (0.45 m) | closed, x 260–820, y 420–640; handle (540, 520) | pulled 0.35 m over F903–F921 («ถ้าเรื่องพวกนี้จริง» onset F903 = beat on, anchor `B05-a1` F903); front grows to x 230–850, y 520–790; handle (540, 655) | open; tabs y 420–560 |
| R hand (size 0.56, curl 0.8) | off-frame right, wrist (1180, 700) | reaches the handle F900–F903, grips, pulls with the drawer | on the handle (540, 655) |
| L hand (size 0.56, curl 0.3) | off-frame left (−100, 450) | enters F940–F949; flicks tabs at F951, F967, F983 moving (420 → 530 → 640, 470) under «ก็น่าจะมีร่องรอยของเธอสักที่…» (F949–F1001, amplitude) | on tabs (640, 470) |

Hands/props: R grips the handle F903 → end; L touches tab tops only; nothing lifted out.
Camera: `pushCamera` s 1.00 → 1.06, focus (540, 520), dy −20, over [900, 1016), sine in-out. Plate-owned.
Look: cold, slightly dimmer than `B04`.
VO + subtitles: «ถ้าเรื่องพวกนี้จริง ก็น่าจะมีร่องรอยของเธอสักที่…» (F903–F1001). Cue [903, 1027) (spans the cut).
Sound: music near-silent. `NEEDS-GEN` "metal filing drawer sliding open on rails, then three dry paper tab flicks, close, dry": drawer f3 (F903), flicks f51/f67/f83 (F951/F967/F983).
Mix intent: hold (foley close).
Cut/transition: hard cut to SH02 at F1016 (in the pause F1002–F1026), on the riser start.
Entry → exit: closed drawer, no hands → open drawer, R on handle, L on tabs.
Acceptance: every tab blank (no text, names or dates) · no hand or forearm below y 860 inside x 120–888 · flicks on F951/F967/F983 ±1 with the foley.

## B05-SH02 — the last folder: blank pages

Range: F [1016, 1172); f0 = F1016. Ends at the `B06` slot start F1172 (B05 speech off F1170, `B05|B06` pause 3 f).
Direction: top-down on the desk (`DESK-FOLDER`, k ≈ 1875 px/m). One closed folder, hinge left. The R hand opens it on a **blank** page, flips two more pages (each blank), leaves; on «ต้นเรื่อง» everything stops dead and the frame darkens (`VD17`, `LF04`). The page is the **brightest value of `B01`–`B05`** (cold pale `#cfd8cb`) in a dark tunnel; **ruled lines only** (faint, even spacing), no columns, headings, stains, smudges or impressions. Flipped pages stay visible as stack slivers at the hinge side and bottom edge.
Staging (plate px, R3 per `VD17` (5); R2 staging superseded):

| Entity | Plate box / anchor | Keys | Screen at the stop (s 1.18 about (540, 590), `shot-projection.py`) |
| --- | --- | --- | --- |
| Folder (board + cover, hinge x 240) | x 240–840, y 270–790; blank tab top ≈ y 226 | cover pinched at its right edge (840, 530) F1027 («แต่ยังไม่พบหลักฐานเลย» onset, amplitude gap end; anchor `B05-a2` F1000 = gap start); cover rotates about x 240 over F1027–F1041, edge exits left | folder x 186–894, y 212–826 (≤ 830); tab top y 160 |
| Page stack (ruled) | x ≈ 262–818 (est., 22 px inset; Boss fixes), y 296–766 | flip 1 F1078–F1088 («ว่ามีเด็กผู้หญิง» onset F1078, amplitude); flip 2 F1100–F1110; each pinch at (818, 530) and 10-f swing about x 240; each reveals another blank ruled page | page y 243–798 (≤ 800) |
| R hand (size 0.84, curl 0.6 est.) | enters from right, wrist ≈ (1180, 600) est. | pinch F1027; returns right between flips; exits right F1110–F1122; **no hand after F1122** | never below y 860 |

Hands/props: the R hand touches only the cover and page edges; nothing written, lifted or pointed at.
Camera: `pushCamera` s 1.00 → 1.18, focus (540, 590), F1027 → F1127, ease-in (accelerating); s 1.00 held F1016–F1027; **s 1.18 held F1127 → F1171 (dead stop, 45 f).** Plate-owned. Dead stop = hand gone, camera and flips frozen; only grain and the vignette hold (ambient clock = grain; event clock = none).
Look: cold. Vignette (`VD17` (4), screen layer): radial about (540, 520), r 950, opacity stops 0 / 0.06 / 0.45 / 0.85 at 0 / 0.35 / 0.7 / 1.0, level ramps 0 → 1 over F1027–F1127 (linear), held to the cut.
VO + subtitles: «แต่ยังไม่พบหลักฐานเลย ว่ามีเด็กผู้หญิงจริง ๆ ที่เป็นต้นเรื่อง» (F1027–F1170; «ต้นเรื่อง» decays from ≈ F1143). Cues: [1027, 1078) «แต่ยังไม่พบหลักฐานเลย», [1078, 1172) «ว่ามีเด็กผู้หญิงจริง ๆ ที่เป็นต้นเรื่อง».
Sound: cover and flip foley (`NEEDS-GEN` as SH01) at f11 (F1027), f62 (F1078), f84 (F1100). `reveal_riser-tension_01` (3.692 s = 111 f, stops dead) on [1016, 1127): starts on the cut, **its end = «ต้นเรื่อง» onset F1127** (anchor `B05-a3`; the amplitude has no ≥ 4 f gap there, a 2-f dip at F1128–F1129 puts the consonant at ≈ F1130; Editor may snap ≤ 3 f by ear). Bed dropped to near-silence F1127–F1172 under the decaying word.
Mix intent: lift (riser) → drop to near-silence.
Cut/transition: hard cut to `B06` at F1172 (1 f before the B06 VO at F1173). The 3-f audio pause is not a picture pause: the 45-f dead stop is the beat.
Entry → exit: closed folder → third blank page, pushed in, vignetted, no hand.
Fallback (Film, `VD17`): if the blockout still sags, a third flip F1117–F1126 (hand then exits F1127 → frozen off-frame by the stop; never a mark on any page). Not adopted.
Acceptance:

| Frame | Observable | Evidence |
| --- | --- | --- |
| all | no page carries any mark except even ruled lines | QA sheet at full resolution crops |
| F1127 ±1 | riser end; camera s 1.18; vignette full | waveform + QA sheet |
| F1127–F1171 | camera, flips and hand still (frame diff = grain only) | frame diff |
| F1127 | page bottom ≤ y 800, folder bottom ≤ y 830, tab top ≈ y 160; `caption-zone.py` mean ≤ 0.25 (look still `LF04`: 0.102 / p95 0.140) | QA sheet + `caption-zone.py` |
| F1078, F1100 | flip start + foley on the same frame (±1) | QA sheet + waveform |

## B06-SH01 — the oldest known story: Iwate, about 1948

Range: F [1172, 1349); f0 = F1172.
Direction: painted map of Japan (`MAP-JP`), **real Natural Earth coastline, large** (`VD18`, `LF05-START`): Japan 710 px wide at s 1.00 (map space x 160–870, y 155–979), land `#7a9a96`, faint 5° graticule with no numbers. One pin on Iwate with its callout. No village name, no region borders, no other labels (F001).
Staging (`map` px = screen at s 1.00):

| Element | Position | Keys | Notes |
| --- | --- | --- | --- |
| Pin (amber, plate layer) | tip **(680, 471)** (`japan.json` `iwatePin`); head ≈ (680, 431) est. (40 px pin; Boss fixes) | drops F1256–F1264 («มาจากอิวาเตะ» onset F1256, amplitude gap end; anchor `B06-a1` F1246), 8 f ease-out with a 2-f settle | screen-fixed: it is the push focus |
| Pulse ring (`VD19`) | centred on the pin tip | **one** ring, amber, stroke 3 px, radius 0 → 60 px, opacity 0.8 → 0 over **F1264–F1276** (12 f), no repeat | gone 20 f before the callout; never reused in `B07` |
| Callout (screen layer) | label slot 0 (y 300–350, from x 120) «อิวาเตะ, ญี่ปุ่น · ราวปี 1948» (`LF03`/`LF05` style); leader from the label's right end ≈ (600, 360) to the pin head | 8-f fade-in F1296 («ราวปี» onset, amplitude gap end F1296) | leader end = `toScreen(camera, pin)`; static here because the pin is the focus |
| `DATE` box (screen layer) | x 120–420, y 430–500 «ราวปี 1948» | same frame as the callout | 1948 is never a publication date |
| Sea dim (screen layer) | everything below screen y 780 fades to the sea value, full by y 900 | static | Kyushu passes into it during the push |

Camera: `pushCamera` s 1.00 → 1.30, focus = pin tip (680, 471), over [1172, 1349), sine in-out. Plate-owned; pin and ring push with the map, callout/`DATE`/sea-dim are screen layers. Projection check (R3, `shot-projection.py` on the 429 `japan.json` ring points): s 1.00 land x 160–870, y 155–979 (39 points below y 860, all inside the sea dim); s 1.30 land x 4–927, y 60–1132 (Hokkaido top y 60, Kyushu y 1132, as `VD18`); pin stays at (680, 471). Fallback (Film): s 1.00 → 1.20 if Boss finds the 1.30 push softens the painted line.
Look: cold map paper; the pin is the only warm value; the lamp has not arrived.
VO + subtitles: «เรื่องฮานาโกะที่เก่าที่สุดเท่าที่รู้กัน มาจากอิวาเตะ ราวปี 1948…» (F1173–F1348). Cues: [1173, 1256) «เรื่องฮานาโกะที่เก่าที่สุดเท่าที่รู้กัน», [1256, 1372) «มาจากอิวาเตะ ราวปี 1948…» (spans the dissolve). The v3 read puts «เรื่องฮานาโกะที่» in the `B06` slot (anchor `B06-a0` F1173; R2 `E1` closed).
Sound: thin cold bed (`tension_drone-sparse-piano_01` low) from F1172. Pin landing `ui_click-tick_01` (soft) at f92 (F1264), with the ring. No other cue.
Mix intent: hold.
Cut/transition: in-canvas dissolve to SH02 (`dissolveSec` 0.5 = 15 f) starting F1349 (pause after «1948», F1349–F1371).
Entry → exit: large empty map s 1.00 → pin, ring gone, callout and date on, s 1.30.
Acceptance:

| Frame | Observable | Evidence |
| --- | --- | --- |
| F1172 | Japan ≥ 700 px wide, whole country visible (`LF05-START`) | QA sheet |
| F1264 ±1 | pin landed; ring starts with the tick; ring gone (opacity 0) by F1276 | QA sheet 360-px crop + waveform |
| F1296–F1348 | callout + `DATE` on; pin, callout, date above y 860 at all frames | QA sheet |
| all | no village name, no year other than «ราวปี 1948», no region borders | QA sheet |
| F1348 | `caption-zone.py` mean ≤ 0.25 (look still `LF05`: 0.162 / p95 0.181) | `caption-zone.py` |

## B06-SH02 — the record is a told ghost story (twist; lamp warms)

Range: F [1349, 1588); f0 = F1349; dissolve [1349, 1364). Ends at the `B07` slot start F1588 (B06 speech off F1581).
Direction: open book (`BOOK-SPREAD`) at x 140–940, y 380–840, columns of **illegible stylised handwriting marks** (reconstruction: no legible Japanese, no hand, no girl). **The reveal:** the amber lamp warms the pages on «แต่เป็นเรื่องผี» and stays to the end of the video (`VD03`, `VD09`).
Staging: spread static. Marks are vertical stroke columns at 40 px pitch, painted under the paper glaze.
Camera: `pushCamera` s 1.00 → 1.10, focus (540, 600), dx −15, over [1349, 1588), sine in-out.
Look: cold until F1430. Amber `#e0a95a` lamp from top-left off-frame (kit `Spot` at (220, 340), r 520) ramps 0 → 0.3 over **F1430–F1460** («แต่เป็นเรื่องผี» onset F1430: amplitude gap end and anchor `B06-a4` agree). Warm spill on the pages; shadows stay cool. Held at 0.3 to the cut.
Label: slot 0 «松谷みよ子『現代民話考 7 学校』» (no year), 6-f fade-in at F1502 («แล้วถูกเก็บลงหนังสือ» onset, amplitude gap end), held to the cut.
VO + subtitles: «บันทึกนั้นไม่ใช่ข่าว… แต่เป็นเรื่องผีที่มีคนเล่าไว้ แล้วถูกเก็บลงหนังสือ หลายสิบปีต่อมา» (F1372–F1581). Cues: [1372, 1430) «บันทึกนั้นไม่ใช่ข่าว…», [1430, 1502) «แต่เป็นเรื่องผีที่มีคนเล่าไว้», [1502, 1588) «แล้วถูกเก็บลงหนังสือ หลายสิบปีต่อมา».
Sound: one low soft impact at f42 (F1391, «ไม่ใช่ข่าว» onset; anchor `B06-a3` F1391, no ≥ 4 f gap inside «บันทึกนั้นไม่ใช่ข่าว»): `impact_sub-hit-short_01` (candidate; must be soft). Warm bed from f81 (F1430): `NEEDS-GEN` "warm soft pad with a felt-piano third, slow, hopeful-curious, 70 bpm, narration-safe" (not `bed_sad-aftermath-ambient_01`, kept for `B08`). Cold bed out under the dissolve F1349–F1364.
Mix intent: hit (soft) → release (warm).
Cut/transition: hard cut to `B07` at F1588.
Entry → exit: dissolve-in cold → lamp at 0.3, credit on.
Acceptance: no legible character at full resolution · lamp ≤ 0.3 · ramp starts F1430 ±2 · on a 270-px sheet F1429 vs F1460 the warm shift is visible · credit text exact, no year.

## B07-SH01 — 1980s: a teacher collects the children's stories

Range: F [1588, 1778); f0 = F1588. Ends in the pause F1759–F1781, 4 f before «หนังสือของเขา…».
Direction: 1980s classroom (`CLASSROOM-80S`). Two `CH-KID` children (1980s uniform, back view) foreground, telling. Teacher = generic SVG icon at a desk mid-ground, writing (no likeness, `VD10`). Callback to `B03`.
Staging (figure plane k 560; positions unchanged from R2): Child A (1.30 m) feet (300, 1240), head top y 512 (728 px lead); R hand raised to shoulder F1596–F1608 («แล้วเธอดังได้ยังไง?» amplitude onset F1596) and held mid-gesture (depth arm, `via` elbow). Child B (1.20 m) feet (760, 1240), head top y 568 (672 px), hands at sides; head turn 0° → 8° toward the teacher F1689–F1701 («ครูคนหนึ่ง» onset F1689, amplitude). Teacher icon box x 430–650, y 400–700, facing camera; pen loop (12-f writing loop) from F1708 to the cut.
Hands/props: the teacher's pen and notebook stay in the icon; children hold nothing.
Camera: `pushCamera` s 1.00 → 1.08, focus (540, 560), over [1588, 1778), sine in-out.
Look: amber lamp continues (`VD10`); warm classroom fill.
Labels: `DATE` «ยุค 80» slides in from the left F1653–F1663 («ยุค 80» onset F1653, amplitude gap end; anchor `B07-a2` F1656). Slot 0 «常光徹 Tsunemitsu Tōru», slot 1 «ครู / นักคติชนวิทยา» 6-f fade at F1689.
VO + subtitles: «แล้วเธอดังได้ยังไง? ยุค 80 ครูคนหนึ่งเก็บเรื่องผีที่นักเรียนเล่าให้ฟัง» (F1589–F1758). Cues: [1589, 1653) «แล้วเธอดังได้ยังไง?», [1653, 1782) «ยุค 80 ครูคนหนึ่งเก็บเรื่องผีที่นักเรียนเล่าให้ฟัง».
Sound: `bed_mystery-investigation_01` (100 bpm, candidate) from F1588. Page-flip whoosh at f65 (F1653): `NEEDS-GEN` "soft paper page-flip whoosh, 0.4 s, close, dry" (interim `whoosh_fast-slide_01`).
Mix intent: lift.
Cut/transition: hard cut to SH02 at F1778.
Entry → exit: children telling → labels and date on, teacher writing.
Acceptance: lead ≥ 480 px (planned 728) · labels clear of heads (heads from y 512) · teacher icon has no face detail · `VD15` (now `B07-SH01` only, `FILM-R5` `VD27`) caption-zone measure: f0/mid/end mean ≤ 0.25, p95 ≤ 0.40.

## B07-SH02 — 1990: the book carries the stories across Japan

Range: F [1778, 1940); f0 = F1778.
Direction: `MAP-JP` returns (same `map` space and pin as `B06-SH01`), whole country visible, warm-shifted. Book card and `DATE` on the Sea-of-Japan side (R3, `FILM-R3` consequence). Dots are **scattered, seeded, not radial** (`VD14`, `VD19`); Iwate pin dimmed to ≈ 50 %, **no ring**.
Staging (screen px):

| Element | Box / anchor | Keys | Notes |
| --- | --- | --- | --- |
| Book card (screen layer) «『学校の怪談』 1990» (generic illustrated card, not the real cover) | **x 120–420, y 250–420** (R2 x 600–900, y 330–520 superseded: it covered Iwate) | slides in from the left (x −300 → 120) F1782–F1792, ease-out («หนังสือของเขาปี» onset F1782, amplitude gap end) | on open sea at s 1.00 and 1.06 (projection: 0 land points inside x 120–420, y 250–500; nearest land at x ≤ 420 starts y 682 / 695) |
| `DATE` box (screen layer) «ปี 1990» | x 120–420, y 430–500 | with the card, F1782–F1792 | — |
| Pin (plate layer) | tip (680, 471), 50 % | static | no ring, no pulse |
| Dots (plate layer) | 40 seeded points inside the landmass, plate y ≤ 830 (screen ≤ 860 − 8 px pop at s 1.06), none on Kyushu below screen y 860, none within 30 px of the pin | **two on F1860** («ช่วยพาเรื่องพวกนี้» onset, amplitude gap end), then one every 2 f F1862–F1936 (38 more); each pops 0 → 8 → 6 px over 4 f; last pop complete F1940 | order seeded random across the country, never ordered by distance from Iwate |

Camera: `pushCamera` s 1.00 → 1.06, focus = pin tip (680, 471), over [1778, 1940), sine in-out (never 1.30). Projection check (R3): land at s 1.06 x 129–881, y 136–1010; 57 of 429 ring points below y 860, all inside the sea dim (as `B06-SH01`, screen y 780 → 900).
Look: amber; map warm-shifted compared with `B06`; sea dim as `B06-SH01`.
VO + subtitles: «หนังสือของเขาปี 1990 ช่วยพาเรื่องพวกนี้ไปทั่วญี่ปุ่น» (F1782–F1912). Cues: [1782, 1860) «หนังสือของเขาปี 1990», [1860, 1941) «ช่วยพาเรื่องพวกนี้ไปทั่วญี่ปุ่น».
Sound: bed continues. Page-flip whoosh at f4 (F1782). Optional ticks per 8-dot group `ui_click-tick_01`, very low (F1860, F1874, F1890, F1906, F1922).
Mix intent: lift.
Cut/transition: hard cut to SH03 at F1940 (1 f before «พอกลางยุค 90…»).
Entry → exit: map with dimmed pin → 40 dots, card and date on.
Acceptance: dots never below y 860 · card not presented as the real cover · card and `DATE` cover no land · no ring and no radial order from Iwate · dots, card, date read on a 270-px sheet (`LF03B` composition superseded for the card position).

## B07-SH03 — mid-90s: her own film

Range: F [1940, 2046); f0 = F1940.
Direction: `FILM-CARD`: a generic illustrated poster card on a dark screen-like backdrop, the doodle (`DOODLE-HANAKO`, the popular image) in the poster. Title «『トイレの花子さん』 1995». **Never 『学校の怪談』 on the film card** (F012).
Staging: poster card (x 260–820, y 330–840) slides up from y +400 over F1940–F1952 with the doodle already in it (x 400–680, y 420–720). `DATE` «ยุค 90» at F1941 (VO onset). Title text stamps in at F1994 («ฮานาโกะซัง» onset, amplitude gap end; scale 1.15 → 1.00, 6 f). Projector-flicker pulse +0.15 on F2022–F2024 («หนังของตัวเอง» onset, anchor `B07-a6` F2022; no ≥ 4 f gap inside the phrase, `est.` ±6 f).
Camera: s 1.00 → 1.05, focus (540, 585), over [1940, 2046).
Look: amber; doodle red is the accent.
VO + subtitles: «พอกลางยุค 90… ฮานาโกะซังก็มีหนังของตัวเอง» (F1941–F2045). Cues: [1941, 1994) «พอกลางยุค 90…», [1994, 2066) «ฮานาโกะซังก็มีหนังของตัวเอง» (spans the dissolve).
Sound: bed at its peak. Projector click at f82 (F2022): `NEEDS-GEN` "tiny film-projector shutter click, single, dry" (interim `ui_click-tick_01`).
Mix intent: hit (small) → release into `B08`.
Cut/transition: in-canvas dissolve to `B08` (`dissolveSec` 0.5) starting F2046 (VO end F2045).
Entry → exit: poster rising → poster with title.
Acceptance: film title exact · poster generic · doodle never animates · flicker and click on the same frame.

## B08-SH01 — generations at door 3 (takeaway)

Range: F [2046, 2302); f0 = F2046; dissolve [2046, 2061). Ends at the `B09` slot start F2302.
Direction: the row (`RR-WIDE`, the `B01-SH02` vantage). Door 3 stays closed. Translucent child silhouettes (`CH-KID` silhouette variant: different heights, bags, era uniforms) appear in front of door 3 and fade, generation after generation. None is Hanako (no bob, no skirt). F2061–F2147 the row is empty under «ฮานาโกะซังอาจไม่เคยมีตัวตนจริง…» (intentional emptiness).
Staging (restroom m, z 0.4, back view facing −z; projected at s 1.00, R2 projection unchanged; frames R3):

| Group | Members (x, height) | Fade in | Fade out | Screen (feet y 840) |
| --- | --- | --- | --- | --- |
| G1 | (0, 1.30) | F2147–F2159 («แต่เธอก็ไม่เคยหายไป» onset F2147) | F2219–F2231 | 295 px |
| G2 | (−0.55, 1.20), (0.55, 1.15) | F2217–F2229 («เพราะเด็กรุ่นแล้ว» onset F2217) | F2247–F2259 | 272 / 261 px |
| G3 | (0, 1.35), (1.10, 1.40) | F2240–F2252 («รุ่นเล่า», `est.`: no gap ≥ 4 f inside «รุ่นแล้วรุ่นเล่า» F2229–F2259) | F2266–F2278 | 306 / 317 px |
| G4 | (0.55, 1.25) | F2273–F2285 («เล่าเรื่องเธอต่อกันมา» onset F2273) | F2291–F2301 (10 f) | 283 px |

Opacity 0.45 at full (`VD16`; slight value rim if they sink into the door). Silhouettes paint as a layer over the plate (layer-order finding). G4 is at full only F2285–F2291 (6 f, the minimum) because the line ends F2295 and the cut is F2302.
**Lead (`VD16`):** door 3 (401 px) plus the ensemble; no silhouette under 250 px.
Camera: `pushCamera` s 1.00 → 1.08, focus (540, 600), dx −10, over [2046, 2302). Feet at s 1.08: y 859 (≤ 860).
Look: amber spill from off-frame left (kit `Spot` at (−40, 420), r 700, level 0.25) over the cold key; flicker on the 118-f cycle.
VO + subtitles: «ฮานาโกะซังอาจไม่เคยมีตัวตนจริง… แต่เธอก็ไม่เคยหายไป เพราะเด็กรุ่นแล้วรุ่นเล่า เล่าเรื่องเธอต่อกันมา» (F2066–F2295). Cues: [2066, 2147) «ฮานาโกะซังอาจไม่เคยมีตัวตนจริง…», [2147, 2217) «แต่เธอก็ไม่เคยหายไป», [2217, 2273) «เพราะเด็กรุ่นแล้วรุ่นเล่า», [2273, 2303) «เล่าเรื่องเธอต่อกันมา».
Sound: room tone returns low under the music from F2046. Music back to the `B03` motif, slower (same `NEEDS-GEN`; Film candidate `bed_sad-aftermath-ambient_01`). Bed dips F2127–F2147 (silence after «มีตัวตนจริง…»). `B03` whispers return F2217–F2295.
Mix intent: drop → hold.
Cut/transition: hard cut to `B09` at F2302.
Entry → exit: dissolve from the poster → empty row (G4 gone at F2301), door closed.
Acceptance: door 3 closed at all frames · no silhouette resembles the doodle · feet ≤ y 860 through the push · each group visible at ≥ 0.45 for ≥ 6 f · no silhouette at F2301.

## B09-SH01 — a hand raised to knock (loop line + hold)

Range: F [2302, 2596); f0 = F2302; VO part [2302, 2506), hold [2506, 2596) (90 f).
Direction: `RR-KNOCK`. Door alone while the line starts, the picture creeping in. In the pause after «และเธอจะ…» the room dims and a faint ivory glow breathes in the latch-side seam on «กลับมา» (`VD21`, user-accepted 31 Oct 2026; look still `LF06`), then fades: the room remembers the reply, nothing appears. The POV right hand rises into frame from lower right on «ยกมือขึ้นเคาะ» and stops in the raised, fist-ready pose. Hold.
Staging: hand off-frame until F2482 («ยกมือขึ้นเคาะ» onset, amplitude gap end; anchor `B09-a3` F2481). Knuckle anchor travels (1320, 1376) [(0.40, 1.05, 0.30)] → (800, 760) → rest (733, 715), size 0.66, curl 1, dir −2.2, elbow (1424, 986), over F2482–F2506 (24 f, ease-out), then holds. The rest pose is **exactly** `B01-SH01` f0. On-screen parts stay above y 860 inside x 120–888. No shape, eye, hand or shadow in the seam at any frame (`VD21b` eye not adopted).
Camera: `pushCamera` s 1.00 → 1.08, focus (660, 740), F2302 → F2506 (sine in-out); s 1.08 held F2506 → F2595. Camera scale at the glow keys (sine in-out): F2323 ≈ 1.002, F2347 ≈ 1.009, F2383 ≈ 1.027.
Look (`VD21` keys, retimed to v3; screen layers over the plate):

| Layer | Spec | Keys |
| --- | --- | --- |
| Key dip | full-frame rect `#060c0d` | opacity 0 → 0.4 F2323–F2347, 0.4 → 0 F2347–F2383 (sine in-out); 0 from F2383 |
| Seam glow, core | `VD13` ivory `#efe3c4`, plate strip x 1050–1066, y 130–855 (latch-side post), opacity `3.5 × level` | level 0 → **0.2** F2323–F2347 (rise 24 f), **peak F2347** («กลับมา», `est.`: end of the 27-f pause and anchor `B09-a1` agree on F2347; a 3-f burst F2347–F2349 then a 2-f dip may be «จะ», which would put «กลับมา» at ≈ F2352, see `E5`), 0.2 → 0 F2347–F2383 (fall 36 f); 0 from F2383 |
| Seam glow, spill | 160 px onto the door face left of the post (x 890–1050), horizontal gradient from the post, vertical fade to 0 by plate y 855 | follows the core level |
| Amber spill (as `B08`) | kit `Spot` level 0.25 | through VO and hold; **seam cool (user Q4):** F2581–F2595 (last 15 f) amber 0.25 → 0 and key back to the `B01` cold state, linear; F2595 = `B01` f0 |

No flicker, repeat, sting or cut on the glow. Projection (R3, plate on `pushCamera`): the core strip is at screen x 1054–1070 at F2347 and x 1061–1077 at F2383, still on screen; its plate bottom y 855 maps to screen ≤ 860 up to s 1.043, so the glow never enters the caption band. It leaves the right edge only at s ≈ 1.077 (≈ F2490), not at s ≈ 1.04 as `FILM-R4` estimated; harmless, because the glow is 0 from F2383.
VO + subtitles: «และเธอจะกลับมาอีกครั้ง… ทุกครั้งที่ใครสักคน ยกมือขึ้นเคาะ» (F2303–F2505; the v3 read pauses 27 f after «และเธอจะ», F2320–F2347). Cues: [2303, 2416) «และเธอจะกลับมาอีกครั้ง…», [2416, 2596) «ทุกครั้งที่ใครสักคน ยกมือขึ้นเคาะ» (held through the hold; «ทุกครั้ง» onset F2416 amplitude, anchor `B09-a2` F2411).
Sound: music (`B08` motif) continues low; room-tone bed −2 dB over F2323–F2383 under the glow (Editor's call, `VD21`), no stinger, no new sound. Music cuts at f180 (F2482, hand onset). Hold: room tone only (`room_dark-empty-building_01`, same bed and level as `B01` f0). No knock.
Mix intent: release → dip with the glow → room tone.
Cut/transition: loop seam (below).
Entry → exit: door alone, s 1.00 → dip + glow F2323–F2383 → hand raised, s 1.08, cold at F2595.
Acceptance:

| Frame | Observable | Evidence |
| --- | --- | --- |
| F2347 ±1 | glow peak; glow level ≤ 0.2; dip 0.4 | QA sheet 270 px + 540-px crop of x 840–1080 |
| F2383 → F2595 | glow 0 and dip 0 | frame diff vs the layers-off render |
| all | no shape, eye or figure in the seam; glow never below y 860 | QA sheet |
| F2482 | hand enters with the music cut | QA sheet + waveform |
| F2506 → F2595 | hand pose numerically identical to `B01` f0; camera s 1.08 | pose track + QA sheet |
| F2595 | plate layers equal `B01-SH01` F0 (hook text off); amber 0 | pixel diff, full-alpha |

## Loop seam B09 → B01

Contract: [film-brief Loop seam](film-brief.md#loop-seam-b09b01-b_loop-knock), `VD11`, user Q4. Added detail:
- **Runtime requirement (Editor/Boss):** `endHoldSec: 0`; the 90-f hold [2506, 2596) is authored inside `B09`'s scene (precedent `POOLDEPTH-SHORT`, `src/videos/pool-depth/index.ts`). Event logic reads the event clock; flicker and drip read the ambient clock ([finding](../../../docs/dev-findings/DF-20261030-painted-story-hold-ambient-clock.md)). `loopFadeFrames` 0.
- **Ambient terms (R3):** flicker 118 f and drip 236 f divide 2596 (22 and 11 cycles), so F2595 → F0 continues the cycle without a jump. The R2 values 116/232 do not divide 2596 and must not be reused.
- **Light:** cool F2581–F2595 (15 f); the `B09` dip and glow are 0 from F2383 (212 f before the last frame).
- **Hook text:** an overlay, absent from the hold; it appears on F0 like a title card on each replay (`VD22`). Seam equality is checked with the text layer off.
- **Sound:** room-tone level identical on both sides; the first event sound is the knock at F4.
- **Captions:** F2595 shows «ทุกครั้งที่ใครสักคน ยกมือขึ้นเคาะ»; F0–F3 none; «ก๊อก» from F4.
- **Chrome:** the progress bar resets at the seam; Editor confirms no flash.

<a id="fpov-review-r4"></a>
## FPOV review (R4)

User, 31 Oct 2026: `B03-SH01` becomes an FPOV close-up on a classmate's chest (decided); FPOV elsewhere only where something happens to or around the viewer and being inside it earns more than the current framing, with a small recommended set. Limits kept: story, reveals, VO, audio and frame ranges, shot IDs, caption band y 860–1248, no faces, `B09 → B01` seam landing frames pixel-identical.

**Mark decisions (R4; Film confirms feasibility `F-R4-1`–`F-R4-7` before Boss builds the `B02`/`B03` plates):**

| ID | Decision | Reason | Alternative |
| --- | --- | --- | --- |
| `MK-R4-D1` | `B03` eyes = **the listening child**, looking at the teller's chest; the teller holds the notebook at chest height and tilts it up to the viewer F467–F479 | The beat is being told: the viewer becomes the next child in the chain (pays off in `B07`, `B08`, `B09`). The frontal chest is the user's "camera pushed onto a student's chest" and matches the WORLD FOG front-view phone insert. The doodle faces the viewer upright | Wearer looking down at their own chest: tag upside-down and steeply foreshortened, the doodle faces the wearer, readability worse. Not adopted |
| `MK-R4-D2` | Name tag reads class 「3年2組」 (small) + a common surname 「たなか」 (hiragana, main line); **never** «ฮานาโกะ» / 「花子」. **User chose this (`R4-Q1` ok, «ตามแนะนำได้เลย», 31 Oct 2026)** | A living pupil tagged "Hanako" would read as the child being Hanako and blur the ghost identity and the conceal rule (Hanako never a body). «ฮานาโกะซัง» stays on the label and the doodle. An ordinary surname says "a normal Japanese pupil is telling you" | (b) blank tag with only 「3年2組」; (c) name line hidden under the scarf tail. User question `R4-Q1` |
| `MK-R4-D3` | FPOV foreground crisp (`hardFill`; tag in SVG on the plate camera), background a painted corridor wash | User preference (FPOV like WORLD FOG `PHONE-SVG`) and the [painted-2d art default](../../../.claude/skills/painted-2d/SKILL.md) for FPOV foregrounds | Film may soften the cardigan to `washAt` + ink if hardFill reads as cut paper |
| `MK-R4-D4` | `CH-KID` in `B03` = front chest crop + hands only (no head). `VD15` no longer applies to `B03` (stays for `B07-SH01`); the lead ≥ 480 px rule is replaced by the FPOV acceptance numbers in the shot block | No legs reach the band; an FPOV insert has no standing lead. `VD05` names back / ¾ views: Film amends it for a headless front crop (`F-R4-1`) | confirmed by `FILM-R5`: `VD24` (`VD05` amended, `B03` only), `VD27` (`VD15` = `B07-SH01` only; FPOV rows accepted) |
| `MK-R4-D5` | Continuity: `B02 → B03` hard cut is a graphic match (centred door → centred torso); `B03 → B04` cuts paper to paper (notebook → storybook). The teller's navy cardigan differs from the viewer's grey `HANAKO_HAND` sleeve (`B01`/`B05`/`B09`), so the teller never reads as the viewer's own body | Retelling reads `B03` (told to you) → `B07-SH01` (children tell a teacher) → `B08` (generations at the door) → `B09` (you raise your hand) | — |

**Per-shot verdicts** (cost: low = reuses existing POV art or a crisp SVG/hardFill foreground over an existing painted wash; high = new art):

| Shot | Verdict | Reason / moment |
| --- | --- | --- |
| `B01-SH01` | already FPOV, keep | the viewer's fist knocks on door 3 |
| `B01-SH02` | keep | the wide row teaches "third of five"; the pull-back is the breath after the knocks |
| `B02-SH01` | **changed, `R4-P1` accepted by the user 31 Oct 2026** (low cost; now in the [shot block](#b02-sh01--the-reply-ค่ะ-light-only-event)) | the answer «ค่ะ» comes to the viewer's knock (below) |
| `B03-SH01` | **changed (user decision)**, high cost (new chest art, tag) | being told the story by a classmate (shot block) |
| `B04-SH01` | keep | told legends in a storybook frame; nothing happens to the viewer, and an FPOV inside a war or murder story moves toward the depicted-victim line |
| `B05-SH01` | already FPOV, keep | the viewer's hands pull the drawer (FPOV foreground hardFill is a look call for Film/Boss, `F-R4-7`, not a framing change) |
| `B05-SH02` | already FPOV, keep | the viewer's hand opens the blank folder |
| `B06-SH01` | keep | map information; no event at the viewer |
| `B06-SH02` | keep | no hand may touch the reconstructed record (script `B06` visual note); the lamp reveal is light on an already close spread |
| `B07-SH01` | keep (user likes it) | not reviewed |
| `B07-SH02` | keep | map information |
| `B07-SH03` | keep | a fact card about the film; a cinema-seat FPOV adds a set without an event |
| `B08-SH01` | keep | the wide shows generations at the closed door (`VD16`); a close FPOV hides door 3 and the queue; the viewer joins the chain in `B09` |
| `B09-SH01` | already FPOV, keep | the viewer's hand rises to knock; seam landing frames unchanged |

**Recommended set:** `B03-SH01` (decided) + `R4-P1` (`B02-SH01`). Nothing else. **User, 31 Oct 2026:** `R4-P1` ok, `R4-Q2` ok (the per-shot verdicts above stand; `B07-SH01` untouched).

**`R4-P1` — `B02-SH01`: your fist is still up when she answers** (**accepted by the user, 31 Oct 2026, `R4-P1` ok**; moved into the `B02-SH01` block, which now owns the numbers; the text below is the proposal record)
- Moment: F417, «ค่ะ» answers the knock the viewer just made. With the viewer's own fist still in frame, the reply lands on someone: "you knocked, and she answered you". It also keeps the viewer's hand alive between `B01` and `B09`.
- What the viewer sees: the R3 frame unchanged (whole door, push s 1.00 → 1.06, seam light F414–F435) plus the viewer's right fist (`HANAKO_HAND`, grey sleeve) in the lower-right corner, already raised at F304. It sinks slowly (dy +6 px over F304–F409), stops still when the bed drops at F409, and on F417 makes one small flinch: knuckles pull back +10 px x, +6 px y over F417–F421 (ease-out, 4 f), then hold to the cut.
- Staging (estimates; Boss confirms with `scripts/shot-projection.py` on `RR-DOOR` before build): screen layer outside the plate camera (the door creeps closer, the hand stays with the viewer). Knuckle anchor ≈ (965, 735), `paintPovHand` size ≈ 1.05 (palm 0.085 m at ≈ 0.40 m from the eye: 600 · 1.56 / 0.40 ≈ 2340 px/m → ≈ 199 px), curl 1, dir ≈ −2.4 rad, elbow and sleeve off-frame lower right. Hand box ≈ x 890–1080, y 620–850: right of the caption box (x ≤ 888) and ≥ 55 px right of the seam (screen x 810–835 through the push).
- Cost: **low**, no new art (reuses `paintKnockHand` / `paintPovHand` + `HANAKO_HAND` from `B01`). Replaces nothing; door framing, light, timing and sound unchanged.
- Risks: the hand may pull the eye from the seam at F417 (keep it the darkest value on the right; Film checks `F-R4-6`); a bigger flinch reads comic, so it stays 4 f and ≤ 12 px; `B01-SH02` is the objective wide, so the fist reappearing in `B02` reads as a return to the viewer's eyes, not a jump.
- Acceptance if accepted: hand never left of x 888 or below y 860; seam glow unobstructed at F417 ±1; flinch onset F417 ±1 with «ค่ะ»; hand pose at F304 consistent with `B01-SH01` sleeve tone.

## Caption-zone check (design + look stills)

Band y 860–1248, x 120–888. Measured on the look stills (`python3 -I scripts/caption-zone.py --band 860:1248`): R2 `LF01` mean 0.180 / p95 0.258 · `LF02` 0.153 / 0.166 · `LF03` 0.162 / 0.190 · `LF03B` 0.162 / 0.190. **Re-run in R3 only for the changed geometry:** `LF04` 0.102 / 0.140 · `LF05-START` 0.159 / 0.166 · `LF05-PULSE` 0.160 / 0.167 · `LF05` 0.162 / 0.181 · `LF06` 0.160 / 0.225 · `LF01-HOOK-A` 0.180 / 0.258 — all pass, equal to Film's numbers. Design checks (`scripts/shot-projection.py`, flat plates modelled as a z = 0 plane under a camera at distance f/s above the focus, shift holding the focus; inputs in the session scratchpad): `B05-SH02` stop state page y 243–798, folder y 212–826, tab 160 (pass ≤ 800 / ≤ 830); `B06-SH01` s 1.30 land y 60–1132, pin fixed; `B07-SH02` card/`DATE` boxes clear of land at s 1.00 and 1.06; `B09` glow inside x 1054–1077, bottom ≤ y 860 while lit. No shot frames exist yet.

| Shot | Under the band | Story object in band? | Measure owed |
| --- | --- | --- | --- |
| `B01-SH01`, `B09` | flat door panel, louvre | no (forearm crosses only at x > 888; hook text above y 360) | blockout F0, F31, F2595 |
| `B01-SH02`, `B08` | dark wet floor tile | no (feet ≤ 859, drain ≈ 851) | reflections may brighten |
| `B02` | door panel + seam-foot spill | spill ends ≤ y 900; R4 hand x ≥ 892, y ≤ 850 (outside the band; `VD29`) | F417 (peak) |
| `B03` (R4 reframe) | teller's lower cardigan + side-gap wash ≤ `#3d5453` | no (notebook/hands/cuffs/elbows ≤ y 846) | f0/f100/f201: mean ≤ 0.25, p95 ≤ 0.40 |
| `B07-SH01` | children's dark legs/uniform | **partial: bodies cross** (`VD15` accepted with measure) | f0/mid/end each: mean ≤ 0.25, p95 ≤ 0.40 |
| `B04` | paper texture | no | — |
| `B05` | cabinet base / desk wood, vignette | no (folder ≤ 826 at the stop) | F1127 (vignette full) |
| `B06`, `B07-SH02` | dark sea | no; any Kyushu below 860 dimmed | after the enlarged map |
| `B06-SH02` | lower page margin + desk | no (spread ends y 840) | F1460 (lamp) |
| `B09` glow | door panel, dip overlay | no (glow bottom ≤ y 860) | F2347 (peak) |
| `B07-SH03` | poster lower edge + backdrop | no | — |

## Dependencies and open items

| ID | Owner | Dependency / acceptance | Status |
| --- | --- | --- | --- |
| `FQ1` | Film | `B09` door-alone stretch | **closed** by `VD21` (dip + seam glow, no eye; user accepted 31 Oct 2026). R3 note: the stretch is now F2302→F2482 (6.0 s); after the glow the door is alone F2383→F2482 (3.3 s), see risk 2 |
| `FQ2` | Film + Preaw | hook text F0–F45 | **closed** by `VD22`: wording A «เคาะสามครั้ง… มีคนตอบ?» chosen by the user (on-screen text, not a script revision; Boat may recheck the legend label on request). Editor builds the text layer |
| `FQ3` | Film | Japanese line at F0 | **closed** by `VD23`: stays in `B01-SH02` from F251 (unchanged) |
| `FQ4` | Film | R2 staging refinements | `B05-SH02` flips + dead stop and `B06-SH01` ring **decided** (`VD20`, applied as `VD17`/`VD19`); `B04` sequential panels, `B01` knock jolt, `B07-SH03` poster from shot start stay FYI (revert on Film's word) |
| E1 | Editor | Narration slot boundary B05\|B06 | **closed by voice lock v3** («เรื่องฮานาโกะที่» is in the `B06` slot, anchor `B06-a0` F1173). Remaining: ear check of the 3-f join (F1170–F1173), voice-measure open item 2 |
| E2 | Editor | Subtitle cue ranges above are proposals from the v3 amplitude; Editor builds the subtitle track and reports differences > 3 f. The hook text is a separate overlay cue [0, 46) + fade to F54 | open |
| E3 | Editor | Sound audit of candidates; `NEEDS-GEN`: sub drone, reverse swell, whispers, music-box motif, warm `B06` pad, muffled rumble, muffled wooden slam, drawer/paper foley, page-flip whoosh, projector click. `B09` bed −2 dB F2323–F2383 | open |
| E4 | Editor / Boss | `endHoldSec: 0` with the hold [2506, 2596) inside `B09`; ambient cycles **118/236**; seam pixel check (full-alpha, hook text off) | open |
| E5 | Editor (ear) | `B09` v3 read: a 27-f silence F2320–F2347 inside «และเธอจะกลับมาอีกครั้ง…» (speech F2303–F2319, then F2347 on). Mark reads it as «และเธอจะ… กลับมา» and keys the glow peak to F2347; the amplitude also allows «และเธอ… จะกลับมา» with «กลับมา» at ≈ F2352. Ear decides; if «กลับมา» is more than 3 f from F2347, all four glow/dip keys move by the same offset (sheet revision; the 99-f gap to the hand stays ≥ 90 f) | open |
| S1 | Boss | Episode plates (11), `CH-KID` (+1980s, silhouette variants), SVG cards/tags/pin/ring/callout/teacher icon, hook text layer, `B05` vignette, `B09` dip/glow layers; Film look notes (1)–(4) and R3/R4 notes: `LF01` hand re-pose against the knock anchors, `LF02` panel B paper cuts and rubble shapes, `MAP-JP` from `japan.json` (graticule, sea dim, land `#7a9a96`), `LF04` paper-bleed smudge removed (a smudge reads as a mark), seam-glow geometry on the real post edge (`LF06` strip sits on a torn edge), fonts. Build from this timed sheet; finished-grade plates per beat after that beat's review notes | `missing` |
| `F-R4-1` | Film | `B03` FPOV chest art feasible in painted + `hardFill` (front-view kid torso, no head, front-view hands per CP-P); amend `VD05` (front chest crop) | **closed** by `VD24` (`VD05` amended for `B03` only; fingers hidden, forearm foreshortening, no head shapes) |
| `F-R4-2` | Film | `B03` palette: cardigan, collar, scarf, tag colours against `VD03` (red reserved for the doodle, amber from `B06`) | **closed** by `VD25` (blouse `#b4bbb1`, scarf `#3c5d5b`, tag `#cdd1c3`, rim `#7f9a98`; in the `B03` Look line) |
| `F-R4-3` | Film → Boss | `NAMETAG-B03` as SVG riding the plate camera (Overlay with the plate transform, [screen-layers finding](../../../docs/dev-findings/DF-20261030-painted-screen-layers-overlay.md)); Noto Sans JP font file and OFL notice (`public/fonts/`, untracked) | **closed** by `VD26` (plate-camera Overlay; Boss verifies the glyphs on the first frame; font files committed with the work; plate module calls `loadFont`) |
| `F-R4-4` | Film | `VD15` scope: `B03` removed; FPOV acceptance numbers in the `B03` block replace the lead ≥ 480 px row; lean-in push step F513–F528 | **closed** by `VD27` (`VD15` = `B07-SH01` only; four rows added to the `B03` acceptance; push step accepted, fallback F510 start if F510/F520/F530 shows a pop) |
| `F-R4-5` | Boat (optional) | name-tag custom (名札 with class + surname on a 1990s–2020s elementary uniform) if the user or Film wants it checked; no script claim depends on it | **closed** by `VD28` (Boat not needed; route one question only if the user wants era-specific authenticity) |
| `F-R4-6` | Film | `R4-P1` (accepted 31 Oct 2026): hand size/position on `RR-DOOR`, competition with the seam light at F417 | **closed** by `VD29` (size 0.80, anchor (990, 745), `HANAKO_HAND_B02`; in the `B02` block) |
| `F-R4-7` | Film / Boss | look only: whether the FPOV `hardFill` foreground default applies to the existing `B01`/`B05`/`B09` POV hands and drawer/folder (no framing change) | **closed** by `VD30` (no change to `B01`/`B05`/`B09`; `B02` fist as `B01`; `hardFill` foreground only in `B03`) |
| `F-R6` | Film | `B03-SH01` reframe after build (31 Oct 2026, block above), short re-checks only: **(1) caption zone**: elbows/cuffs now end at y 846 at s 1.14 and the cardigan fills x 118–962 of the band; confirm mean ≤ 0.25 / p95 ≤ 0.40 still holds with the side-gap wash ≤ `#3d5453` below y 860; **(2) hand size**: visible kid hand ≈ 100 × 120 px plate (≈ 114 × 137 at s 1.14) on a pocket notebook 540 × 360 px (k ≈ 3400, smaller than A6), CP-P02 forearm ≈ 115 px; reads as a child's hand in the WORLD FOG style; **(3) value order** with the painted figure: page > tag > blouse > scarf, cuff strips ≤ blouse, upper-arm sliver ≈ `#1b232b` darker than `#26303a` yet separated from the wash; **(4) look record**: the user's painted figure + painted doodle (notebook crisp, tag SVG) supersedes `VD24` condition 3 and the `VD30` `B03` row; and the B03-only label y 357–405 (crosses the scarf tails) | **closed** by `FILM-R6` `VD31`–`VD35` ([film-r5.md](film-r5.md)): caption zone pass by bound (`VD31`), hand size pass (`VD32`), value order with 3 amendments (`VD33`, in the Look line), look record + label accepted (`VD34`, `VD35`) |
| S1-R4 | Boss | `B02-SH01` POV fist layer (block above; reuse `paintKnockHand`/`paintPovHand` + `HANAKO_HAND_B02`, `VD29`). `B03-SH01` re-plan to `FPOV-CHEST` per `VD24`–`VD27` (tag text chosen: 「3年2組 たなか」): corridor wash background (reuse the `paintCorridor` colours, no hard edges), front chest crop, notebook + doodle, tag. The polish-A `P01` work on `B03` kids is **superseded** (keep it for `B07-SH01` and `B08`) | `B02` and first `B03` build done (`boss-s1r4-fix-report.md`, not visually accepted); **`B03` rebuild build-ready** (`FILM-R6` go): Boss may rebuild `B03` after the arm-direction pass now running; remeasure caption zone at F443/F479/F528/F644, visible hand 100 × 120 to 125 × 150 px, page ground ≥ `#d4d8cb` with no cel shade, figure ink ≥ `#141b21`, cuff strips never lighter than the blouse | open (build-ready) |
| U1 | user (via coordinator) | Review page for `SCENE-R4` ([review-rows.json](review-rows.json)): `R4-Q1` ok «ตามแนะนำได้เลย», `R4-P1` ok, `R4-Q2` ok (31 Oct 2026). **Still open: the `B03-SH01` row** (no R4 verdict stored; the old R3 `ok` was for the superseded two-children framing). `B03-SH01` row answered `ok` 31 Oct 2026 with the arm-depth note ([delivery.md](../delivery.md)). New: the user looks at the reframed `B03` plate after the Boss rebuild (review row updated, page republish pending) | R4 rows answered; `B03` reframe look pending |
| U1-R3 | user (via coordinator) | Review page for `SCENE-R3` ([review-rows.json](review-rows.json)); approval of `LF04`/`LF05` (FILM-R3, not yet stated); ear check of the v3 lock (voice-measure open items, incl. E1/E5) | answered (all `ok`, 31 Oct 2026) |

**Element captures** (look stills, **not shots**; camera is a CSS scale, not `pushCamera`; timing and final plates differ):

| Capture | File | → shot / frame | Source / revision | Approval | Limitations |
| --- | --- | --- | --- | --- | --- |
| `LF01` | `out/hanako-look/LF01.png` | `B01-SH01` F0 plate, `B09-SH01` F2595 | `look.tsx`, `FILM-R2` | user-approved | Japanese line at f0 (superseded, `VD23`); hand pose placeholder |
| `LF01-HOOK-A` | `out/hanako-look/LF01-HOOK-A.png` | `B01-SH01` F0 with hook text A | `look-r4.tsx`, `FILM-R4` | accepted with the hook-A choice | hand placeholder |
| `LF02` | `out/hanako-look/LF02.png` | `B04-SH01` Panel A ≈ F760 | `look.tsx`, `FILM-R2` | user-approved | panel B layout not final |
| `LF03` | `out/hanako-look/LF03.png` | `B06-SH01` (superseded by `LF05`) | `look.tsx`, `FILM-R2` | user-approved | hand-keyed small map |
| `LF03B` | `out/hanako-look/LF03B.png` | `B07-SH02` dots ≈ F1936 | `look.tsx`, `FILM-R2` | user-approved | small map; card on the right (superseded, now x 120–420) |
| `LF04` | `out/hanako-look/LF04.png` | `B05-SH02` dead stop F1127–F1171 | `look-r3.tsx`, `FILM-R3` | **awaiting user approval** | paint-bleed smudge lower right (to remove) |
| `LF05-START` | `out/hanako-look/LF05-START.png` | `B06-SH01` F1172 | `look-r3.tsx`, `FILM-R3` | **awaiting user approval** | still frame; sea banding |
| `LF05-PULSE` | `out/hanako-look/LF05-PULSE.png` | `B06-SH01` ring ≈ F1268 | `look-r3.tsx`, `FILM-R3` | **awaiting user approval** | ring thin at 270 px (12 f event) |
| `LF05` | `out/hanako-look/LF05.png` | `B06-SH01` end F1348 | `look-r3.tsx`, `FILM-R3` | **awaiting user approval** | callout leader not yet Boss's screen-space leader |
| `LF06` | `out/hanako-look/LF06.png` | `B09-SH01` glow peak F2347 | `look-r4.tsx`, `FILM-R4` | accepted with the glow choice | CSS scale 1.011; flat dip overlay; subtle at 270 px |

Sheets: `out/hanako-look/LF-sheet.png` (R2), `out/hanako-look/LF-r3-sheet.png`, `out/hanako-look/LF-r4-sheet.png`. Kit swatches: `out/handoffs/hanako/HANAKO-SHORT/elements/KIT-CATALOG.png` (R1 capture; teal default sleeve). Not used: `LF01-HOOK-B`, `LF06-EYE` (rejected options). No child, corridor, cabinet, classroom, book or poster element exists (R3 statement; Boss plates exist since, untracked: `out/qa/hanako/g1`–`g3`, `out/qa/hanako/polish-A/`). R4: no FPOV chest or name-tag element exists; the R3 `B03` frame (`out/qa/hanako/g1/B03-SH01-f201.png`, two back-view children, doodle ≈ 40 px at the 270-px sheet) shows why the user asked for the close-up.
**Editor scene sample (proposal):** blockout of F2506–F2596 → F0–F117 (hold, seam, hook text, knocks), F1016–F1460 (blank pages → dead stop → map → lamp reveal; the weakest stretch plus the twist) and F2302–F2506 (`B09` glow and hand).

## Change log

- 31 Oct 2026 `HANAKO-SHORT-SCENE-R1` (Mark): first sheet. Staging-only, VO-relative, timing estimated (≈1776 f). Projection inputs (scratch): `RR-WIDE` camera (0, 1.5, 3.5) vfov 107.67 shift_y −0.2396 → door 3 401 px, silhouettes 261–317 px, feet y 840; `RR-KNOCK` camera (0, 1.45, 0.78) vfov 91.46 shift_y −0.1896 → contact (660, 740), rest knuckle (733, 715), plate "3" (540, 476), elbow (1424, 986).
- 31 Oct 2026 `HANAKO-SHORT-SCENE-R2` (Mark): timed from the voice lock (S3 take 1, 2552 f). Inputs `FILM-R2` (`VD12`–`VD16`), look stills. Changes:
  - **Timing:** every `est.` range replaced by integer frames; clock renamed `G` → `F` (preview-label convention). R1 estimate → R2: B01 [0, 183) → [0, 304); B02 [183, 282) → [304, 443); B03 [282, 402) → [443, 645); B04 [402, 555) → [645, 900); B05 [555, 750) → [900, 1146); B06 [750, 1068) → [1146, 1585); B07 [1068, 1395) → [1585, 2044); B08 [1395, 1575) → [2044, 2294); B09 [1575, 1776) → [2294, 2552). Word onsets from track-amplitude gaps, cross-checked with Whisper anchors (method in the header). `B06-a2` («1948», Whisper F1369) is not used: the amplitude places «หนึ่งพันเก้าร้อยสี่สิบแปด» at F1306–F1346 and F1369 is «บันทึกนั้น».
  - **Resolved by Film:** `RR-DOOR` and latch-seam light (`VD12`); `B02` hue ivory `#efe3c4` (`VD13`); scattered dots (`VD14`); legs in band with measure (`VD15`); `B08` silhouettes (`VD16`).
  - **Visual-hook pass (user concern):** new section "Visual hook and retention plan". Staging refinements (`FQ4`): `B01` knock jolt + caption build; `B02` push 1.03 → 1.06; `B03` notebook tilt reveal + R lean; `B04` stacked half-size panels → sequential full-size panels in the `LF02` box (x 110–970, y 390–840; superseded A y 300–570, B y 590–850); `B05-SH02` two blank-page flips, push 1.12 → 1.18 with a dead stop; `B06-SH01` enlarged map (pin estimate (661, 526) → (700, 500), pending Boss coastline), pulse ring; `B07-SH01` gesture/head turn/pen loop; `B07-SH02` dots start on «ช่วยพา» (F1858) at 2 f each (superseded: on «ไปทั่วญี่ปุ่น»); `B07-SH03` poster from shot start, title stamp; `B08` push 1.04 → 1.08 (feet y 859 at s 1.08).
  - **Seam:** ambient cycles 116/232 f (divide 2552); cool F2537–F2551.
  - **Projection re-run (scratch, `scripts/shot-projection.py`):** `RR-WIDE` door 3 x 450–630, y 400–801; G1 295, G2 272/261, G3 306/317, G4 283 px, all feet y 840, none in band; `RR-KNOCK` contact (660, 740), rest (733, 715), plate (540, 476), elbow (1424, 986) off-frame, B09 start (1320, 1376) off-frame. No restroom plate added or moved.
  - **Found:** narration slot boundary B05|B06 one phrase late (E1).
- 31 Oct 2026 `HANAKO-SHORT-SCENE-R3` (Mark): retimed to voice lock v3 and merged `FILM-R3`/`FILM-R4`. Inputs: [voice-measure.json](voice-measure.json) v3 (2596 f), [retime-r2-to-r3.md](retime-r2-to-r3.md), v3 amplitude, `FILM-R4` (`VD17`–`VD23`), user decisions 31 Oct 2026 (hook A, glow). Changes:
  - **Timing:** durationFrames 2552 → 2596; hold [2462, 2552) → [2506, 2596). `B01`–`B04` and `KA` unchanged. Ranges R2 → R3: `B05-SH01` [900, 998) → [900, 1016); `B05-SH02` [998, 1146) → [1016, 1172); `B06-SH01` [1146, 1349) → [1172, 1349); `B06-SH02` [1349, 1585) → [1349, 1588); `B07-SH01` [1585, 1766) → [1588, 1778); `B07-SH02` [1766, 1940) → [1778, 1940); `B07-SH03` [1940, 2044) → [1940, 2046); `B08-SH01` [2044, 2294) → [2046, 2302); `B09-SH01` [2294, 2552) → [2302, 2596). Every event, cue, camera key and sound frame from F900 on re-derived from the v3 amplitude/anchors (method in the header), not shifted: e.g. riser end/dead stop F1107 → F1127, pin F1250 → F1264, lamp F1429 → F1430, dots F1858 → F1860, hand F2431 → F2482, cool F2537–F2551 → F2581–F2595. `B06-a2` (fallback) unused again: the amplitude places «ราวปี» at F1296 and «1948» at ≈ F1304–F1348.
  - **Ambient cycles:** flicker 116 → 118 f, drip 232 → 236 f (divide 2596).
  - **`FILM-R3`:** `B05-SH02` pale ruled page, stack slivers, staging ≈ 60 px up (page ≤ 800, folder ≤ 830 at the stop), radial vignette, 45-f dead stop (`VD17`); `B06-SH01` `japan.json` map, pin tip (700, 500) est. → (680, 471), push about the pin, one 12-f ring F1264–F1276, sea dim below y 780, graticule (`VD18`, `VD19`); `B07-SH02` book card x 600–900, y 330–520 → x 120–420, y 250–420, slides from the left, camera focus (560, 600) → pin, no ring, no dots on dimmed Kyushu, two dots on the first frame so 40 dots finish by the cut.
  - **`FILM-R4`:** `B09-SH01` key dip + ivory seam glow (`VD21`) keyed to «กลับมา» F2347 (Film's R2-basis F2311–F2371 retimed; Film's "160 f before the hand" was 60 f in its own frames, now 99 f); bed −2 dB; "R2 adds a continuous push only" removed. `B01-SH01` hook text A overlay F0–F45, fade to F54, outside subtitles and the seam (`VD22`). Japanese line unchanged at F251 (`VD23`).
  - **Closed:** `FQ1`–`FQ3`, `FQ4` (B05/B06 part), `E1` (v3 cut). **New:** `E5` (27-f pause in the `B09` read). Visual hook plan rewritten for R3 frames.
  - **Checks:** `shot-projection.py` and `caption-zone.py` re-run for `B05-SH02`, `B06-SH01`, `B07-SH02`, `B09` glow, hook text (results in the caption-zone section); `FILM-R4` glow-exit estimate s ≈ 1.04 corrected to s ≈ 1.077 (no effect). Findings added: map-land-clip-closure (checked), screen-layers-overlay, retime-picture-parity.
- 31 Oct 2026 `HANAKO-SHORT-SCENE-R4` (Mark): user-requested FPOV changes (user, 31 Oct 2026: "B03 as a first-person close-up on a student's chest with cardigan over the sailor uniform and a name tag, crisp like the WORLD FOG phone insert; add FPOV elsewhere where it works", refined: FPOV only where something happens to the viewer, small set). Changes:
  - **`B03-SH01` re-framed** (range [443, 645), VO, cues, label F467, music F443, whispers F585, hard cuts F443/F645 unchanged): R3 two ¾-back children in the corridor (child L feet (270, 1290) 910 px, child R feet (830, 1290) 875 px, A5 notebook centre (540, 555) 210 × 147 px, tilt 60° → 30°, doodle ≈ 130 → 145 px, push s 1.00 → 1.12 focus (560, 560), child R lean F513–F528) → FPOV listener view of the teller's chest (`chest` space k 2400), name tag x 700–900 y 375–445, A6 notebook hinge y 815, tilt 70° → 8° F467–F479, doodle ≈ 223 px at F479 and ≈ 248 px at F644, push s 1.00 → 1.04 → 1.12 (lean-in F513–F528) → 1.14 focus (560, 640). Acceptance rows "lead ≥ 480 px" and `VD15` replaced by FPOV numbers. Optional paper rustle F467 added (Editor's ear).
  - **New:** [FPOV review](#fpov-review-r4) with `MK-R4-D1`–`D5`, per-shot verdicts, proposal `R4-P1` (`B02-SH01` raised fist flinch at F417; R3 `B02` text kept until the user accepts). Dependencies `F-R4-1`–`F-R4-7`, `S1-R4`; U1 → R4 page, R3 page recorded answered.
  - **Assets:** `FPOV-CHEST` replaces `CORRIDOR` for `B03`; new `CH-KID` front chest crop and `NAMETAG-B03`; `CH-KID` back views now serve `B07-SH01`, `B08` only. Boss polish-A `P01` for `B03` superseded.
  - **Status:** `ready-for-dev` → `needs-input` (ready for user review) for `B03-SH01` and `R4-P1`; all other shots unchanged and buildable from the R3 text.
- 31 Oct 2026 `HANAKO-SHORT-SCENE-R4` verdict fold (Mark; revision ID unchanged, status change): **user feedback** read back by the coordinator from the R4 review page (artifact db `reviews/*`, rev `HANAKO-SHORT-SCENE-R4`), recorded verbatim:
  - `R4-Q1` (name-tag text) = **ok**, note «ตามแนะนำได้เลย» → tag reads 「3年2組 たなか」, never Hanako (`MK-R4-D2` closed; `B03` tag row and acceptance row now name the text).
  - `R4-P1` (`B02-SH01` fist flinch at «ค่ะ», F417) = **ok**, no note → accepted as a plan change: the [`B02-SH01` block](#b02-sh01--the-reply-ค่ะ-light-only-event) now carries the POV fist layer (knuckle anchor (965, 735) → (965, 741) F304–F409 → flinch F417–F421 to (975, 747), 4 f; envelope x 890–1080, y 620–850; screen layer outside the push; no SFX on the flinch). Superseded: the R3 `B02` block without a hand. Heading text extended; old anchor kept.
  - `R4-Q2` (other shots stay; `B01-SH01`, `B05-SH01`/`SH02`, `B09-SH01` already FPOV; `B07-SH01` untouched) = **ok**, no note → per-shot verdicts closed.
  - `B03-SH01` row: **no R4 verdict recorded** (the stored row is the R3 `ok` on the superseded framing; the R4 page shows it unreviewed). Treated as accepted in substance by `R4-Q1`, recorded as **not** user approval; the coordinator asks the user to confirm it.
  - **Status:** `needs-input` → **`ready-for-dev`** for `B02-SH01` and `B03-SH01` (`B03` flagged pending the user's row verdict); all other shots unchanged `SCENE-R3` text. Film checks `F-R4-1`–`F-R4-7` stay before Boss builds the `B02` fist and `B03` FPOV plates ([mark-r4-report.md](mark-r4-report.md#film-checks-f-r4-17)); `F-R4-6` moved from "waits for user" to open. `S1-R4` gains the `B02` fist. Review rows updated: closed items read «ตอบแล้ว: ผ่าน», `B03-SH01` stays an open row (its R3 previous verdict removed because it judged the old framing).
  - **Checks (written numbers):** fist size 0.085 m × 2340 px/m ≈ 199 px → size 1.05 (`RR-DOOR` eye z 1.56, k 600; hand ≈ 0.40 m from the eye, Mark estimate); latch seam on screen at s 1.06 = 540 + 1.06 · (818 − 540) ≈ 835 → fist left edge 890 is 55 px clear; envelope bottom 850 < band top 860; props/hands: right fist empty at entry and exit, left hand absent. Projection script not run for the fist (screen layer, not a world-space anchor); Boss confirms from `paintPovHand` anchors.
- 31 Oct 2026 `HANAKO-SHORT-SCENE-R4` FILM-R5 sync (Mark; revision ID unchanged, status unchanged `ready-for-dev`, `B03-SH01` still flagged: row verdict pending from the user). Reason: `FILM-R5` ([film-r5.md](film-r5.md), `VD24`–`VD30`, "Requests to Mark" 1–4). Changes:
  - `B02-SH01`: fist size 1.05 → 0.80, knuckle anchor (965, 735) → (990, 745) at F304; sink/flinch deltas unchanged (→ (990, 751) at F409 → (1000, 757) at F421); envelope = hand left extent ≥ x 892, sleeve left of 888 only above y 860 and never within 55 px of the seam; tone `HANAKO_HAND_B02` (`HANAKO_HAND` dimmed 50 % toward `#060c0d`) replaces "sleeve tone matches `B01-SH01`"; new acceptance: fist mean luminance below the seam and the local background at F417 (`VD29`).
  - `B03-SH01`: Look palette per `VD25` (blouse `#b4bbb1`, scarf `#3c5d5b`, tag body `#cdd1c3`, rim `#7f9a98`); hands row: fingers hidden behind the page, thumb on the page front (`VD24`); four acceptance rows added (`VD27`: value order, silhouette, tag legibility, hands); lead-height/`VD15` wording struck from the acceptance header.
  - `VD15` references: `B07-SH01` only (constraints line, `B07-SH01` acceptance, `MK-R4-D4`); `F-R4-1`–`F-R4-7` closed by `VD24`–`VD30`; `S1-R4` no longer waits for Film.
  - Unchanged: range, VO, cues, label F467, sound frames, IDs, caption band 860–1248.
- 31 Oct 2026 `HANAKO-SHORT-SCENE-R4` `B03-SH01` reframe after build (Mark; revision ID unchanged, status unchanged `ready-for-dev`, `B03` flagged: reframed after build, user verdict on the R4 row stands, reframe pending the user's look at the new plate). Reason: user, 31 Oct 2026, after seeing the built plate (`out/qa/hanako/s1r4-painted/sheets/B03-final.png`, F443–F644; [boss-s1r4-fix-report.md](boss-s1r4-fix-report.md)): the chest top reads well, but the notebook hid upper arms, elbows and forearms (CP-P02 could not be judged; reference WORLD FOG `S02-SH03`) and the lower frame was one long dark column to the bottom edge. Changes in the [`B03-SH01` block](#b03-sh01--a-child-retells-her-to-you-fpov-notebook-name):
  - **Framing:** `chest` k 2400 → ≈ 3400 px/m; frame now below the chin to the cardigan hem (hem y 1620 at s 1.00, 1760 at s 1.14; was waist ≈ 820 with skirt to the frame bottom). Torso edges inside the frame at the elbows (x 118 / 962 at y 818; was sleeves to the frame edges, elbows (150, 700)/(930, 700) hidden).
  - **Arms (CP-P02):** elbows (125, 818) / (955, 818) just inside the torso edge; forearms ≈ 115 px foreshortened to cuffs centred (230, 772) / (850, 772); hands x 200–300 / 780–880, y 640–760, thumbs on the side edges at the grip line; upper-arm slivers ≤ 24 px, y 520–818, one value darker. Was: thumbs (300, 700)/(800, 700) at the bottom corners, forearms hidden.
  - **Notebook:** A6 500 × 350, x 300–800, hinge on the bottom edge y 815 → pocket notebook 540 × 360, x 270–810, rotating about the grip line y 699 (240 above, 120 below): y 617–740 at entry → 461–818 at F479. Doodle 220 → 210 px face-on, ≈ 223 → ≈ 212 px at F479, ≈ 248 → ≈ 237 px at F644.
  - **Camera:** focus (560, 640) → (540, 620); s keys unchanged 1.00 → 1.04 (F443–F513) → 1.12 (lean-in F513–F528) → 1.14 (F645). At s 1.14: notebook y 439–846 (was 444–840), elbows y 846, tag x 745–996, y 261–346 (was x 720–948, y 338–418).
  - **Tag** x 700–900, y 375–445 (200 × 70) → x 720–940, y 305–380 (220 × 75), ≥ 17 px below the outer collar edge. **Collar** apex (540, 300) → (540, 339), knot (540, 250) → box y 310–350. **Label** (slot 0, timing F467 unchanged): position now ink box x 120–664, y 357–405 (B03-only y override; the built plate had baseline y 375), below the apex and collar lines, above the notebook.
  - **Look line:** user decisions recorded: figure and doodle painted in the WORLD FOG character style (not SVG, not `hardFill`), notebook may stay crisp, tag crisp SVG (overrides `VD24` condition 3 for `B03`; Film records in `F-R6`). Baseline asset rows updated to match.
  - **Acceptance:** new rows for the hem framing and the CP-P02 arms (elbow boxes, forearm length, sliver width/length, `S02-SH03` side-by-side); geometry rows renumbered (silhouette at y 450/700, max y 846). Superseded: sleeves "x ≤ 90 to ≥ 990 at y 400", hand bottoms at the notebook bottom corners.
  - **Unchanged:** range [443, 645), VO, cues, label timing F467, doodle readable from F479, music F443, whispers F585, optional rustle F467, IDs, hard cuts F443/F645 and the cut to `B04`, caption band 860–1248.
  - **New dependency** `F-R6` (Film short re-checks: caption zone, hand size, value order, look record); `S1-R4` → `B03` rebuild after `F-R6`. Checks: arithmetic on the push formula for F443/F467/F473/F479/F513/F520/F528/F644 (scratch); no render, no projection script (flat plane).
- 31 Oct 2026 `HANAKO-SHORT-SCENE-R4` FILM-R6 sync (Mark; reason `FILM-R6` `VD31`–`VD35` accepted the `B03` reframe; ID and status unchanged): cuff bottom at s 1.14 825 → 830; sliver length ≤ 320 px → ≤ 300 px plate / ≤ 340 px screen; elbow row ±3 px; caption zone remeasured at F443/F479/F528/F644; hand box 100 × 120 to 125 × 150 px; `VD33` limits in the Look line; `F-R6` closed; `S1-R4` `B03` rebuild build-ready after the arm-direction pass.
