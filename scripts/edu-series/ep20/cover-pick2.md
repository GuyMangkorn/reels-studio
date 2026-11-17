# EP20 cover text pick 2

Revision: **EDU-EP20-COVER-TEXT-R1**, Film, 2026-11-16. Inputs: SCRIPT-R2, FACT-R1 plus FACT-R2, SS-R5, cover PIC-R1. User chose **P5 / ลูกศรสองทาง**. All five entries use the exact `P5-which-way` picture: plate `EDU20-COVER-PAIR`, local 15, original vignette, equal-arrow paths and channel mark. No art/camera/timeline/audio edit.

Status: five text options rendered and inspected at 270px, 120px and centre 3:4 crop. Coordinator reports Boat copy check and independent Film picture/text check both pass all five; canonical checker records are owned by the coordinator. User selected **A-follow-you**, "A — ตามคุณ / ใช่ไหม? (แนะนำ)". The selected 1080×1920 cover is published beside the approved MP4 in `$REELS_STORE/publish/edu/EDU/EDU-EP20-SHORT/`. Runtime is existing-integrated in the current checkout, evidenced by successful still renders. Composition: `EDU-EP20-SHORT-COVERS`; stable export `EDU20_COVERS` in `src/videos/covers/edu-ep20.ts`.

## Copy ledger for Boat

Completed independent records: [Boat copy review](cover-copy-check.md), [Film viewer report](../../../storyboards/edu-ep20/short/cover-text-review/viewer-check-look-r1.md), and [image-hash verdicts](../../../storyboards/edu-ep20/short/cover-text-review/viewer-check-look.json). The coordinator's five-only user-choice sheets are also stored as `projects/edu/EDU/covers/ep20/pick2/sheet-choices-270.png` and `sheet-choices-120.png`; all actual A-E cover pixels are unchanged.

Actual review title: **ลูกโป่งจะเอนไปทางไหน?** (`storyboards/edu-ep20/short/review-rows.json`). None repeats that whole title. Each phrase uses words said in the film, shortened by omission only; no new empirical claim or number. The shared picture supplies the helium balloon/car context. All options conceal which actual direction wins and the pressure explanation.

| Entry | Exact displayed lines | Angle | Script / claim coverage | Adds to title | Weak point |
| --- | --- | --- | --- | --- | --- |
| A-follow-you | ตามคุณ / ใช่ไหม? | Misconception / plausible prediction | L03, CK20-03; explicit question, not a claimed result | Asks whether the pictured balloon follows the restrained passenger | Needs the image to identify the subject |
| B-what-pushes | อะไรดัน? | Hidden-cause question | L05, CK20-05; answer L06-L07, CK20-06/07 | Asks the cause rather than repeating direction | Does not name acceleration; relies on title/context |
| C-speed-trap | วิ่งเร็ว / เอนค้าง? | Imagined continuing-speed case | L08 question answered by L09-L10, CK20-08/09/10 | Introduces the speed-versus-acceleration trap without stating its answer | Short compression leaves the car/balloon as pictured subjects |
| D-guess-again | ทาย / อีกรอบ | Participation | Exact L11 phrase; answer L12-L13 | Invites a second prediction | Most generic wording; picture does more work |
| E-brake-question | รถชะลอ / เอนไปไหน? | Braking counterfactual | L11 setup; L01's direction vocabulary; answer L12-L13, CK20-11/12/13 | Adds the slowing condition, changing the prediction | Longest second line |

The standard numerical angle is **N/A and replaced by the braking question**: the script supplies no useful spoken count/measurement, so inventing one would misrepresent the film. Two balanced arrows remain alternative guesses, not simultaneous forces or real trajectory. Sound is N/A for static covers.

## Rendering and measured QA

Two render rounds through `scripts/render.mjs --stills`, one Chrome each. Round 1 exposed a 9px right-safe-box overrun on E; round 2 reduced only E's sub-line font and enlarged short primary lines for stronger small-size reading. Thai copy did not change. Final frames 15/45/75/105/135 map to A/B/C/D/E. No third art/text render was needed.

- Actual 270px comparison sheet: `out/qa/edu20/cover-pick2/final/sheet-texts-270.png`.
- Actual 120px comparison sheet: `out/qa/edu20/cover-pick2/final/sheet-texts-120.png`.
- Centre 3:4 comparison sheet: `out/qa/edu20/cover-pick2/final/sheet-texts-3x4.png`.
- All three sheets were viewed. Each has the selected no-text **P5** at left, then **A-E**. Review labels are outside the actual cover pixels. The labelled frame inputs are under `final/labelled/`; real full-size covers are `final/frames/A.png` through `E.png`. Crops are `final/crops/`.

| Entry | Actual outline bounds x0,y0 to x1,y1 | Visible fill heights per line | Primary font cap height | Inside safe zone |
| --- | --- | --- | --- | --- |
| A | 137,1194 to 936,1531 | 137 / 172px | 171.36px | yes |
| B | 159,1265 to 925,1462 | 178px | 149.94px | yes |
| C | 170,1133 to 921,1531 | 199 / 172px | 142.80px | yes |
| D | 239,1194 to 835,1531 | 138 / 163px | 171.36px | yes |
| E | 135,1194 to 955,1529 | 138 / 147px | 171.36px | yes |

Font cap heights use the actual shipped `NotoSansThai.ttf` OS/2 `sCapHeight` 714 / units-per-em 1000; all primary headlines exceed 7% of 1920 (134.4px). E's question is a secondary sub-line (font cap 124.236px, visible Thai ink 147px), and reads at 120px beside the larger `รถชะลอ` headline and directional arrows. This is distinct from measuring Thai tone/ascender ink as Latin cap height. All other line font cap heights exceed 135px. Noto Sans Thai weight 800, near-white plus episode amber, dark outline; no third headline colour. Last baselines are 1520px or 1450px, clear of the proposed y1540 badge line.

The measured primary balloon is unchanged from P5: height 210.5px, bounds x661.1-840.0 / y348.9-559.5. Seated actor geometry height 918.4px. No camera, figure, arrow or ring moves. The picture remains intact in the centre 3:4 crop; text lies below the actor and hero cues. C's upper Thai marks extend to y1133, at the left of the floor-ring cue rather than over it. All ink is above bottom-20% y1536 and inside x120-960 / y240-1680.

`caption-zone.py --band 1300:1510 --x 120:960` on the unchanged selected no-text P5 gives background mean **0.210**, p95 **0.215**, pass. Measuring the text itself would count bright glyphs and is not a background test. There are no narration captions in these stills, so caption-break/runtime-sync checks are N/A. Actual Thai line breaks are hand-authored at word boundaries; E's longest line has 9 spacing glyphs versus the skill's approximate 8, retained because it is a single short question, fits measured safe bounds and reads at 120px (T2 scored 1).

### Reproducible measurement tool (TL20-02 proposal)

`scripts/edu-series/ep20/measure-cover-text.py` is an episode-only standard-library + FFmpeg helper, authorized by the coordinator. It compares the actual text PNGs to the immutable selected P5, derives exact-colour fill/outline bounds, spacing-glyph counts and the shipped font's cap metrics, then builds labelled PNG/crop inputs without PIL, NumPy or FFmpeg drawtext. The installed FFmpeg lacks drawtext; tiny review labels are encoded directly from RGB rather than installing a new dependency.

```
python3 -I scripts/edu-series/ep20/measure-cover-text.py --base /Users/mangkornkatawong/ReelsStore/projects/edu/EDU/covers/ep20/pick1/frames/P5.png --frames out/qa/edu20/cover-pick2/final/frames --covers out/qa/edu20/cover-pick2/covers.json --out out/qa/edu20/cover-pick2/final
```

Real-input final output: all five safe, no changed pixel outside y1100-1640 exceeding 12 RGB levels. The threshold separates intended text from the known tiny cross-render noise (DF-20261030-render-run-noise); it does not claim byte equality. No geometry/grade source changed. `final/text-metrics.json` contains full line measurements, actual bounds and pass flags. Tool output is `out/logs/edu20-cover-pick2-metrics-final.txt`. The helper's labels affect QA media only, never the cover composition.

## Score and recommendation

Film self-score, 0-2 per row; independent checking is separate. All exceed 14/20 with no zero T1/F1/S3.

| Row | A | B | C | D | E |
| --- | --- | --- | --- | --- | --- |
| T1 reads at 120px | 2 | 2 | 2 | 2 | 2 |
| T2 length / line limits | 2 | 2 | 2 | 2 | 1 |
| T3 adds to title | 2 | 2 | 2 | 1 | 2 |
| F1 one salient subject | 1 | 1 | 1 | 1 | 1 |
| F2 face / guiding cue | 2 | 2 | 2 | 2 | 2 |
| F3 contrast | 2 | 2 | 2 | 2 | 2 |
| S1 opens paid gap | 2 | 2 | 2 | 1 | 2 |
| S2 concrete question | 2 | 1 | 2 | 1 | 2 |
| S3 promise paid | 2 | 2 | 2 | 2 | 2 |
| B1 series identity | 2 | 2 | 2 | 2 | 2 |
| **Total** | **19** | **18** | **19** | **16** | **18** |

**Recommend A**: `ตามคุณ / ใช่ไหม?` turns the seated passenger into the viewer's plausible guess while the arrows keep the answer open. **E** is the clearest alternative condition; **B** is the simplest hidden-cause question. Weak points are recorded in the copy ledger, not hidden by the score.

## Checks, durable media and next owner

- Scoped ESLint passes: `out/logs/edu20-cover-pick2-lint.txt`. Typecheck has the same four pre-existing diagnostics in arm-depth, loudness declarations and render-options; no cover diagnostic: `out/logs/edu20-cover-pick2-typecheck.txt`. No broad test suite was rerun for cover data and a standard-library QA helper. `git diff --check` on owned paths passes.
- Render logs: `out/logs/edu20-cover-pick2-r1.log`, `-r2.log`. The shared renderer and registry are untouched.
- `store.py archive --path out/qa/edu20/cover-pick2/final --project EDU --kind covers/ep20/pick2` archived **20 PNGs**, 0 skipped. Durable base: `$REELS_STORE/projects/edu/EDU/covers/ep20/pick2/`. The three sheets are at its top level, actual deliverable candidates under `frames/A.png` through `E.png`, labelled inputs under `labelled/`, crop inputs under `crops/`.
- Proposed CV11 (first-frame promise) is preliminary until a final text is chosen: the first film frame and all covers share the passenger, cabin and balloon. A/D share the prediction invitation; B/C/E name questions developed later in the film. This is a proposed first-frame-match caveat, not a factual/cover rejection; apply it to the selected final text after the user chooses.
- No final cover selected, no final-cover publish, movie render, pin change, commit or posting. The coordinator owns the final choice, publish-folder update and task/delivery/context-map/build-notes integration. New helper and this handoff both need indexing; the coordinator already owns that work.


## Final selected cover — coordinator, 2026-11-16

Both picks are explicit: P5 equal-direction arrows, then A-follow-you (`ตามคุณ` / `ใช่ไหม?`). `store.py publish` copied the immutable candidate `projects/edu/EDU/covers/ep20/pick2/frames/A.png` to `publish/edu/EDU/EDU-EP20-SHORT/EDU-EP20-SHORT_cover.png`. SHA256 `34779a0fd7f2dfebcba13ebae8e59de52dcabd953de6ae7427b8069cdc0a7592`, 1080×1920, matches the checked candidate. The MP4 SHA256 remains `dfb51c873a1a72d5297ea112803e4fb4c9b429fc2db5eca2cd058972d8a90779`. `publish.json` has both files and status `ready`; posting has not occurred.

Proposed CV11 checked on the actual published files: the selected cover and G0 share the restrained passenger, closed cabin and upright tethered balloon; G0 states the acceleration setup and A opens the L03 prediction question, paid in L04. No direction answer is shown on either. Viewed `out/qa/edu20/delivery-package/sheet-cover-first-frame.png` (270px tiles). Comparison and selected-cover thumbnail are archived under `projects/edu/EDU/previews/ep20/delivery-package/`. No video render, picture change or further approval was needed.
