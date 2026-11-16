# EDU-EP20 cover picture pick 1

- Revision: **EDU-EP20-COVER-PIC-R1**, Film, 2026-11-16; current working tree, parent HEAD `c420a2c`.
- Inputs: `short/script.md` SCRIPT-R2; `short/fact-check.md` FACT-R1 plus FACT-R2 (L13); `storyboards/edu-ep20/short/scene-sheet.md` SS-R5; `visual-brief.md` VB-R3; approved LF20-CABIN-B; user passed all 11 Final shots. Channel `edu`, profile `channel-default`, Short only.
- Scope: five **picture-only** candidates. No headline or extra dialogue. The small `@TamMaiLa` mark is retained. Pick 2 waits for the user's picture choice.
- Readiness: implemented and inspected at 270 px, 120 px and centre 3:4 crop; independent first-time viewer check **5/5 pass, no C findings**, recorded in `storyboards/edu-ep20/short/cover-review/viewer-check-look.json`; [report](../../../storyboards/edu-ep20/short/cover-review/viewer-check-look-r1.md). Shared UT11/UT12 flat-surface observations remain minor notes. Codex provider fallback follows AI14 after the Sonnet session limit. User selected **P5 / 5**, "ภาพ 5 — ลูกศรสองทาง (แนะนำ)", 2026-11-16. Locked for pick 2: `P5-which-way`, plate `EDU20-COVER-PAIR`, local 15; original picture-sheet frame 135. Text choice is pending.
- Runtime: `existing-integrated` in this checkout, evidenced by successful `render.mjs` still renders for all five registered candidates. No shared renderer change. Media under `out/` are local caches.

## Promise and concealment

The viewer learns which way a buoyant, floor-tethered balloon leans in an accelerating enclosed car (L04), what pushes it (L06-L07), why steady speed differs (L09-L10), and what reverses under braking (L12-L13). Every picture holds the balloon upright and the restrained passenger unleaned. No unequal-pressure diagram, air wall, forward/backward result or braking payoff appears. P5's two equal arrows indicate possible directions, not force vectors or simultaneous physical motions.

All new cover plates reuse `paintCabinFrame`, the approved set, cast, balloon, palette, seed and floor contact. **CV07 exception:** the film's wide/medium balloon is about 180 px or less and the passenger close shots deliberately exclude it; dedicated cover cameras make the subject readable. No new set or character look is introduced. Cameras are still because the deliverable is a static cover. No music, ambience or SFX applies to this picture-only composition (N/A); the approved film sound is unchanged.

## Candidates and first-time viewer reads

All coordinates below are 1080x1920 frame pixels. Posed cast throughout: `man-crop + hoodie`, P31 seated, right profile, belt fastened, hands on lap. Balloon `u=0`; passenger `lean=0`. Common paint clock G300 freezes the decorative exterior strip. No posed action is presented as a filmed experiment.

| Pick | Intended first-time read and picture idea | Cast / gaze | Reserved headline band for pick 2 | Weakest point |
| --- | --- | --- | --- | --- |
| P1 / 1 | **Subject close:** a large upright balloon floats inside a closed car, with one string leading to the floor. | Passenger contextual/cropped left, neutral. | Lower dark floor, y1300-1510; text may cross the secondary string, so keep envelope and ring unobscured. | Car-speed question needs the later headline; floor ring is low in the crop. |
| P2 / 2 | **Odd view:** the viewer is down beside the tether, looking up at the balloon; an unusual floor-level perspective. | Passenger contextual/cropped left, neutral. | Broad calm roof, y300-550; use a dark edge grade at pick 2. | Balloon smaller than P1; the secondary ring touches the 3:4 bottom edge. |
| P3 / 3 | **Face and emotion:** a restrained passenger looks at the upright balloon with raised-brow, open-mouth curiosity before its result. | `surprised` expression, gaze `LOOK_BALLOON`; no lean. | Top y240-390, above hair (one short line); alternatively lower floor with careful shoe clearance. | Profile expression is subtler at 120 px than the coral balloon. |
| P4 / 4 | **Setup action:** the ring highlights where the string is tied to the floor (L02); the continuous tether leads to the balloon. | Passenger contextual/cropped left, neutral. | Left middle x120-480, y820-1140, keeping clear of string x540; short condensed two-line copy. | Ring is a small secondary feature at 120 px; narrower text area. |
| P5 / 5 | **Diagram:** upright balloon, passenger and equal left/right alternatives ask which way the balloon will move. | Neutral passenger, gaze at balloon. | Dark floor y1300-1510, clear of subject, ring and arrows. | Diagram needs a headline to establish acceleration; arrows are clearly cover cues. |

**Recommendation: P5 / 5.** It states the prediction question before any headline, keeps the full passenger and balloon in the centre crop, and leaves the cleanest text band. P1 is the strongest pure-object alternative.

## Picture scores

Film self-check only; the coordinator's independent viewer review is separate. Scale 0-2. Pick-1 pass threshold is 6/8 and F1 > 0.

| Pick | F1 one salient subject | F2 readable face / guiding cue | F3 contrast | S2 concrete odd detail / question | Total |
| --- | --- | --- | --- | --- | --- |
| P1 | 2 | 2 | 2 | 1 | 7/8 |
| P2 | 2 | 1 | 2 | 1 | 6/8 |
| P3 | 1 | 2 | 2 | 1 | 6/8 |
| P4 | 1 | 2 | 2 | 1 | 6/8 |
| P5 | 1 | 2 | 2 | 2 | 7/8 |

## Geometry and crop evidence

Geometry uses the same kit geometry and camera projection as the production paint functions; numbers are unrounded in `out/qa/edu20/cover-pick1/final/geometry.json` to 0.001 px. Primary balloon bounds all fit x<960 and y240-1680. The full passenger remains contextual/cropped in P1/P2/P4 on purpose; P3/P5 retain the head. The P2 floor ring is secondary and is trimmed at the bottom edge in the 3:4 crop; the entire balloon survives.

| Pick / plate | Balloon fill bounds x,y to x,y | Balloon height | Seated actor geometry height, including intentionally cropped parts | Floor anchor |
| --- | --- | --- | --- | --- |
| P1 `EDU20-COVER-BALLOON` | 410.1,292.8 to 714.7,651.2 | 358.4 px | 1542.9 px | 562.4,1648.0 |
| P2 `EDU20-COVER-FLOOR` | 426.7,647.7 to 653.3,880.4 | 232.6 px | 1326.7 px | 540.0,1675.2 |
| P3 `EDU20-COVER-FACE` | 749.5,482.0 to 950.0,718.0 | 236.0 px | 1024.6 px | 849.8,1374.4 |
| P4 `EDU20-COVER-TETHER` | 424.4,354.0 to 655.6,626.0 | 272.0 px | 1159.8 px | 540.0,1382.5 |
| P5 `EDU20-COVER-PAIR` | 661.1,348.9 to 840.0,559.5 | 210.5 px | 918.4 px | 750.5,1145.0 |

`caption-zone.py --band 1300:1510` was run as a background diagnostic: P1 mean/p95 0.220/0.341, P2 0.645/0.789, P3 0.255/0.460, P4 0.279/0.784, P5 0.204/0.215. There are no captions/headlines in pick 1, so caption ink/break/centering checks are N/A. These values explain why P2/P3/P4 reserve other text areas and need a cover-local grade at pick 2; no film caption-zone rule is changed.

## Actual images and validation

- Composition: `EDU-EP20-SHORT-PIC-COVERS`, frames 15/45/75/105/135 map to P1-P5; each candidate `local=15`, `lines=[]`.
- **270 px labelled sheet:** `out/qa/edu20/cover-pick1/final/sheet-pictures-270.png`.
- **120 px labelled sheet:** `out/qa/edu20/cover-pick1/final/sheet-pictures-120.png`.
- **Centre 3:4 labelled sheet:** `out/qa/edu20/cover-pick1/final/sheet-pictures-3x4.png`.
- Full-size individual stills: `out/qa/edu20/cover-pick1/final/frames/P1.png` through `P5.png`; crop inputs in `final/crops/`. Number labels live outside the cover pixels, on the review sheets only. All three final sheets viewed by Film.
- Three picture render rounds through `render.mjs --stills --gl=angle`; fourth render repeats only frame 15 for determinism. Logs: `out/logs/edu20-cover-pick1-r1.log`, `-r2.log`, `-r3.log`, `-r4-determinism.log`.
- Determinism: frame 15 repeated byte-identically, 0 changed channels, max difference 0, PSNR infinity (`final/determinism.txt`; `paint-bench-compare.mjs`). DF-20261030-render-run-noise was consulted; no noise exception needed.
- Scoped ESLint passes (empty `out/logs/edu20-cover-lint.log`). Typecheck retains four known unrelated test errors in arm-depth, loudness and render-options; no cover errors (`out/logs/edu20-cover-typecheck.log`). Coordinator runs combined registry/plate tests and context-map validation after integrating this file.
- No video render, pins, episode shot/timeline/caption/audio change, final-cover publication or commit in this pass.

## Film verdict on W6 CLOSE-shot caption background

**Accept; minor measurement caveat, no repaint.** Viewed `out/qa/edu20/w8-delivery/sheet-delivery-shots_G35-130-270-420-600-775-920-1045-1180-1300-1501-1618.png`, specifically B01-SH03 G270 and B05-SH01 G1180. The reported whole-band p95 0.781 comes from the pale wall at the far left; outlined white glyphs sit on the continuous dark floor, clear of face/hand/prop overlaps, and read at 270 px. This does not claim playback or listening. The split L03c uses the already measured safe-box positions. User Final approval stands; no change to the approved picture is recommended.

## Coordinator handoff

Register these new source/doc paths in `docs/context-map.md`; update `task.md`, `delivery.md`, `build-notes.md` from the completed handoff. Run the independent viewer check on the actual three sheets and intended reads above before presenting them. Ask the user for **one picture number 1-5**; then start a fresh Film pick-2 pass on exactly that plate/local frame. No cover selection is implied by this recommendation.

Asset archive: `projects/edu/EDU/covers/ep20/pick1/` in `~/ReelsStore`; 16 PNG media filed, 0 already stored, 0 skipped (`out/logs/edu20-cover-pick1-archive.log`). The labelled sheets are `sheet-pictures-270.png`, `sheet-pictures-120.png`, `sheet-pictures-3x4.png` directly under that store path; full stills are `frames/P1.png` through `frames/P5.png`. Textual QA numbers and limitations are preserved in this Git handoff as well as the local QA JSON.
