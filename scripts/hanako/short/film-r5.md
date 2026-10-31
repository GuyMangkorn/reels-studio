# Film R5 — HANAKO-SHORT: checks F-R4-1..7 for `HANAKO-SHORT-SCENE-R4` (31 Oct 2026)

Revision `HANAKO-SHORT-FILM-R5`; extends [film-brief.md](film-brief.md) `FILM-R4` (nothing there is removed; `VD05` and `VD15` are amended by the decisions below). Inputs: [scene-sheet.md](scene-sheet.md) `SCENE-R4` (`B02-SH01`, `B03-SH01`, FPOV review), [mark-r4-report.md](mark-r4-report.md), [boss-polish-A-report.md](boss-polish-A-report.md), [boss-polish-brief.md](boss-polish-brief.md). Evidence: source read only (`src/painted/kit/hands.ts`, `kit/camera.tsx`, `PaintedStage.tsx`, `hanako/assets.ts`, `hanako/look.tsx`, `shots/hanako.tsx`, `public/fonts/*`); no render was run. Shot numbers stay Mark's: numeric changes below are returned as a request (section "Requests to Mark"). Status words: estimate = Film arithmetic or choice, not yet seen in a frame.

Findings consulted: [DF-20261030-painted-screen-layers-overlay](../../../docs/dev-findings/DF-20261030-painted-screen-layers-overlay.md) (status `workaround`; revalidated 31 Oct 2026 on this checkout: `PaintedStage.tsx:49-51` still passes `camera` to `shot.Overlay`, still no shared mount) and `CameraLayer`/`cameraTransform` in `kit/camera.tsx` (`existing-integrated`).

## Verdicts

| Check | Verdict | Decision ID |
| --- | --- | --- |
| `F-R4-1` | **Yes, with conditions**; `VD05` amended | `VD24` |
| `F-R4-2` | **Amend** (tag, scarf, blouse hexes; the rest passes) | `VD25` |
| `F-R4-3` | **Pass**: SVG in the plate `Overlay` with `cameraTransform(camera)`; font present, untracked | `VD26` |
| `F-R4-4` | **Pass with additions**: `VD15` drops `B03`; acceptance rows accepted plus 4 rows; push step accepted | `VD27` |
| `F-R4-5` | **Not needed**; Boat not required | `VD28` |
| `F-R4-6` | **Amend**: smaller fist, anchor moved right, dimmed hand tone; transform convention accepted | `VD29` |
| `F-R4-7` | **No change** for all existing POV hands and props | `VD30` |

## VD24 (`F-R4-1`): headless front chest crop is feasible; `VD05` amended

Yes: painted + `hardFill`, no new engine capability. The crop is flat shapes (torso, collar, scarf, sleeves) plus two simple hands; `hardFill` and `inkLine`/`rectPts` exist in `kit/draw.ts`; `kidHand` exists in `hanako/assets.ts` (polish A, mitten-style kid hand). Precedent for crisp front-facing foreground over a painted ground: `src/painted/worldfog/phone.tsx`.

**`VD05` amendment (new text, applies to `B03-SH01` only):** "`CH-KID` may appear as a **front-view headless chest crop** in an FPOV shot (`B03-SH01`): frame top below the chin, so no chin, jaw, mouth, hair or eye at any frame. `B07-SH01`, `B07-SH03` pupils and `B08` keep `VD05` as written (back or ¾-back view, no face; silhouettes in `B08`). The front crop reuses the `CH-KID` uniform (cardigan, sailor collar, scarf) and `kidHand`; no other front-view child is authorised." Risk class: low; the unverified item stays "estimated proportions, needs a first Boss frame".

Conditions Boss must respect:
1. **Fingers stay hidden.** Each hand shows only the heel of the hand and a thumb on the page front; fingers are behind the page. No finger count to get wrong (the front-view hand is the costliest part, `CP-P`).
2. **Forearm foreshortening** ([CP-P](../../../docs/character-proportion-principles.md#cp-p-arm-depth)): sleeves run from the shoulders down the frame sides to the hands as foreshortened cardigan shapes (wide cuff, short visible length), not as long side-view arms. Cuffs of the blouse may show at the wrists (one `#b4bbb1` strip).
3. **`hardFill` for cardigan, collar, scarf, sleeves, hands, notebook; one `inkLine`, one cel shade on the screen-right side.** Corridor behind = `washAt` wash only, no outlines (matches `MK-R4-D3` and the [painted-2d defaults](../../../.claude/skills/painted-2d/SKILL.md)).
4. **Silhouette separation:** the wash at the shoulder gaps is lighter than the cardigan: window light upper left up to `#6f8f8c`, right side not below `#3d5453`; the cardigan `#26303a` must read as a dark mass on both sides at 270 px.
5. **No face and no head shapes behind the crop**: nothing rises above the scarf knot (plate y 250); the wash above the shoulders is empty corridor.
6. Breathing drift (dy ±3 px, 90-f sine) stays optional; if used, it moves the whole torso, tag and notebook together (plate camera `dy`).

Pose limits: notebook tilt 70° → 8° as in the sheet; page drawn as a quad whose top edge moves, not a re-drawn page; hands ride the bottom corners (thumb shift ≤ 20 px).

## VD25 (`F-R4-2`): palette

Light direction **confirmed**: dim cool daylight from the upper left, rim on the screen-left shoulder (rim colour `#7f9a98`, ≤ 3 px, one side only), page brightest value, doodle red the only saturated value, no amber (stays `B06`, `VD03`). Hexes (estimates, not yet seen in a frame):

| Part | R4 estimate | R5 decision | Reason |
| --- | --- | --- | --- |
| Cardigan | `#26303a` | **keep** | one step above the plate dark `#1d2a2c`; reads as a mass against `#3d5453`+ wash |
| Collar | `#1f2a36` + line `#cfd3c8` | **keep** (line 2 px max, never wider) | the line equals the page value; thin keeps the page brightest |
| Blouse V | `#c9cfc4` | **`#b4bbb1`** | `#c9cfc4` would compete with the page `#d8dccf` right under the face-less frame top |
| Scarf | `#2f4a4a` | **`#3c5d5b`** (shade side `#2c4645`) | `#2f4a4a` sits within a few luminance points of the cardigan, so the knot would not read at 270 px; still dark teal, no red, no amber |
| Notebook paper | `#d8dccf` | **keep** (brightest value in the frame) | `VD06` |
| Tag body | `#e3e1d6` | **`#cdd1c3`** | `#e3e1d6` is brighter than the page; the tag would pull the eye before the doodle |
| Tag border | `#5d6f7a` | **keep** | |
| Tag text | `#1d2a2c` | **keep** | contrast with `#cdd1c3` is high |
| Teller skin (hands) | n/a | kid hand tone from polish A `kidHand`; if its saturation is above 0.35 reduce to that | skin is the only warm value besides the doodle; kept low-saturation so red stays "the only saturated" |
| Doodle skirt | `#c8403f` | **keep** | `VD03`, `VD06` |

Check at the first frame: the page is the maximum-luminance region (measure the box: page mean > tag body mean > blouse mean).

## VD26 (`F-R4-3`): `NAMETAG-B03` as SVG on the plate camera

**Approach:** the `B03-SH01` plate's `Overlay` (it already receives `camera`, `PaintedStage.tsx:49-51`) renders the tag inside `CameraLayer` with `blend="normal"` (or an `<svg><g transform={cameraTransform(camera)}>`), so the tag pushes with the torso and the lean-in step is exact. Layer order from the sheet: wash < torso < tag < notebook + doodle < hands < label < subtitles. The tag sits under the notebook and hands in z-order, but the notebook and the tag do not overlap on screen (tag x ≥ 720), so a single Overlay layer is enough; if the notebook ever overlaps the tag, split the tag into the canvas (brushed) instead. Screen layers follow the [workaround](../../../docs/dev-findings/DF-20261030-painted-screen-layers-overlay.md): per-plate Overlay, no change to `PaintedStage`.
- Text fixed: small line 「3年2組」, main line 「たなか」, never 「花子」 or «ฮานาโกะ» (`R4-Q1`). Estimated sizes: small 20 px / weight 500, main 34 px / weight 700, font `Noto Sans JP`, `lang="ja"`, tag plate box x 700–900, y 375–445 (200 × 70). At s 1.14 the main line is ≈ 39 px; the small line (≈ 23 px) is mood, not meant to be read at phone size.
- Thin tag details only: border 2 px, one pin dot, a cel shade strip; no extra text.
- **Font status:** `public/fonts/NotoSansJP.ttf` (9.6 MB, variable 100–900), `OFL-NotoSansJP.txt`, `NOTICE-NotoSansJP.txt` are present, **untracked** (`git ls-files public/fonts` lists only `NotoSansThai.ttf` and `OFL.txt`). Licence SIL OFL 1.1: embedding in a rendered video is allowed, no attribution on screen needed; the notice file records source and SHA-256. The glyphs 3 年 2 組 た な か are ordinary Noto Sans JP coverage (I could not confirm with `fontTools`, which is not installed here → Boss verifies on the first frame; any missing glyph is a blocker). **Delivery notes:** (a) the three files must be committed with the work that uses them; (b) the font is registered only in `look.tsx:12` (`loadFont`, guarded by `typeof document`), and `shots/hanako.tsx` does not import it, so the production plate module must call `loadFont` itself (or import the same registration) with `delayRender` semantics so the first frame never falls back to a Thai font; (c) proposed, untested: a subset of the font to the used glyphs (≈ 10 KB instead of 9.6 MB) would cut repository and bundle size; this is optional and a Boss/TL decision, noted in build-notes.

## VD27 (`F-R4-4`): `VD15` scope and FPOV acceptance numbers

- **`VD15` amended:** "Accepted for `B07-SH01` only (conditions unchanged). `B03-SH01` is removed from `VD15`: its lead is the chest crop and notebook, with no legs in frame; the caption band holds only the lower cardigan and the corridor wash, and is checked by the `B03` acceptance table (`caption-zone.py --band 860:1248`, mean ≤ 0.25, p95 ≤ 0.40)." The `VD05` "lead ≥ 480 px" row also does not apply to `B03` (no figure lead); it stays for `B07`.
- **Acceptance rows in the sheet block accepted as a replacement for "lead ≥ 480 px"**, with these additions (return to Mark):
  1. **Value order** (F479): page mean > tag-body mean > blouse mean > scarf mean; doodle red remains the only region with saturation above 0.5 (Boss measures the boxes).
  2. **Silhouette:** at F443 the cardigan outline is separated from the wash on both sides by ≥ 20 luminance levels (0–255) at y 400 and y 700.
  3. **Tag legibility:** full-resolution crop at s 1.14 shows 「たなか」 and 「3年2組」 with no clipped glyph; main line cap height ≥ 36 px on screen.
  4. **Hands:** no fingers visible beyond the page edge; both thumbs overlap the page front; hand bottoms ≤ y 849 at s 1.14 (sheet value kept).
- **Push step accepted** (s 1.04 → 1.12 over F513–F528, sine in-out, 15 f). Arithmetic: peak rate ≈ 0.08 · π/2 / 15 ≈ 0.0084 s per frame; at 500 px from the focus that is ≈ 4 px/frame at the middle and 0 at the ends, so no jump at either end; the whole change is 8 % in 0.5 s at 30 fps, a lean not a zoom cut. Because the plate camera also moves the tag, the notebook and the hands as one, nothing slides relative to the torso. Fallback if the QA sheet F510/F520/F530 shows a pop: extend to 18 f by starting at F510 (Film request to Mark; not needed now).
- The tag (screen x up to 948, y 338–418) is outside the platform right-rail height (rail icons sit lower), and it is not a caption, so the caption-safe box x ≤ 888 does not apply to it; recorded so QA does not flag it.

## VD28 (`F-R4-5`): Boat not needed

**Not needed.** No script claim, label or Boat fact depends on the tag; a 名札 with class and surname is a normal Japanese elementary school detail (Film's general knowledge, `unverified` — no source was retrieved), the shot never claims a particular era, and the name is a fictional classmate's. If the user later wants era-specific authenticity (for example whether tags show a full name in a given decade), route one question to Boat through the coordinator; it does not block Boss.

## VD29 (`F-R4-6`): `B02-SH01` viewer's fist

Transform convention **accepted**: a screen layer outside the `RR-DOOR` plate camera (the door creeps, the hand stays with the viewer). Reuse `paintPovHand` with `HANAKO_HAND`'s hue family and a fixed seed range; low cost holds.

**Changes (numbers returned to Mark):**
- **Size 0.80 (was ≈ 1.05)** and **knuckle anchor (990, 745) at F304 (was (965, 735))**. Reason, from `hands.ts`: the wrist sits `150 · size` behind the knuckles and the palm is `190 · size` wide. With dir −2.4 rad the knuckle line spans ±(0.675, 0.737) · palm/2 and the curled fingers reach ≈ 0.45 · 150 · size forward (up-left). At size 1.05 and anchor (965, 735) the fist's left extent is ≈ x 846, i.e. across the caption box edge (x 888) and within ≈ 15 px of the seam on screen; at size 0.80 and anchor (990, 745) it is ≈ x 899, clear. The `B01-SH01` knock hand is size 0.66 → 0.54 on the same focal length (`knockPose`: 0.66 corresponds to ≈ 0.64 m from the eye), so 0.80 (≈ 0.53 m) reads as the same hand, slightly nearer, rather than a new bigger object; 199 px palm at 1.05 would be the largest moving thing near the seam event. These are estimates: **Boss confirms the measured bounding box from the anchors `paintPovHand` returns; if the left extent of fist (not sleeve) is below x 892 at any key, shift the anchor right (not the size below 0.72).**
- Keys unchanged otherwise: sink dy +6 over F304–F409, still F409–F417, flinch F417–F421 (4 f, ease-out, +10 px x, +6 px y), hold to F443. Flinch amplitude ≤ 12 px stays (small motion near, not on, the seam: it is the viewer's reaction and supports the F417 beat; it must not start before F417 −1).
- **Value rule (fist darkest on the right, no seam rim): confirmed and made concrete.** `HANAKO_HAND` at full value (skin `#e9c2a2`) would be brighter than a 0.2-level ivory seam. For `B02` use a dimmed copy `HANAKO_HAND_B02` = `HANAKO_HAND` blended 50 % toward `#060c0d` (the `VD21` dip colour): skin `#786758`, shade `#6b5748`, deep `#635144`, nail `#7d746d`, crease `#513d2f`, sleeve `#313939`, sleeveShade `#262e2e` (estimates; computed per channel `0.5·c + 0.5·dip`). No rim, no ivory on the knuckles at any frame. Acceptance: fist mean luminance < the seam strip mean at F417 and < the local door/tile background mean beside it.
- **Sleeve:** the sheet's "sleeve tone matches `B01-SH01`" is replaced by "same hue family as `HANAKO_HAND`, dimmed per the table above" (a full-value grey sleeve would be a bright patch in the cold frame). Sleeve geometry (not yet verified: `capsule` width semantics not read): the forearm must leave the frame at the lower right; if the sleeve's left edge at y 860+ falls left of x 888, or left of x 890 at y < 860, steepen the forearm (elbow directly below the wrist, e.g. elbow ≈ (1080, 1000), `sleeveFrom` ≈ (1100, 1250)) so it stays right of the seam clearance.
- **Competition with the seam light at F417:** acceptable. The fist is ≥ 55 px (target ≥ 65) from the seam on screen, dimmer than it, and its only motion (a 4-f, ≤ 12 px flinch) coincides with the event by design. No SFX on it (sheet text kept).
- Fist y envelope: bottom of the **hand** ≤ y 850; the sleeve may run to the bottom edge at x ≥ 888 (outside the caption box).

## VD30 (`F-R4-7`): `hardFill` and the existing POV hands, drawer and folder

| Shot group | Decision |
| --- | --- |
| `B01-SH01`, `B09-SH01` knock hand and the door | **No change.** `paintPovHand` already draws opaque seeded `solid` fills with one ink line (`hands.ts` header: "solid seeded fills, no watercolour border"), which is the crisp flat look the skill default wants; the user said the originals read well, and polish `P03`/`P04`/`P07` are dropped for this reason. The door is the architecture/subject (`hardFill` panels in `paintRestroom`). |
| `B05-SH01`, `B05-SH02` drawer, folders, folder hand | **No change.** Already opaque flat (`hardFill` count 53 in `hanako/assets.ts`); dropped `P05`/`P06` stay dropped. |
| `B02-SH01` new fist | **Same as `B01`** (`paintPovHand`, no `hardFill`); consistent with the hand it follows. |
| `B03-SH01` torso, notebook, hands | **`hardFill` foreground, wash background** (`VD24`). |

One recorded deviation, not a request: the restroom plates (`RR-KNOCK`, `RR-DOOR`) paint wall and floor strata with `hardFill` (`assets.ts` lines 18–19), which the skill calls "backgrounds stay painted washes". They are user-approved ("the originals read well"), so no change; the proposal below is to word the skill exception.

## Requests to Mark (numbers/text; sheet revision, not edited here)

1. `B02-SH01` fist table: size 1.05 → **0.80**; knuckle anchor (965, 735) → **(990, 745)**; sink and flinch deltas unchanged (end (990, 751) → flinch (1000, 757)); envelope line: "hand left extent ≥ x 892; sleeve may be left of 888 only above y 860 and never within 55 px of the seam"; sleeve tone line → "`HANAKO_HAND_B02` (dimmed 50 % toward `#060c0d`)"; add acceptance "fist mean luminance below the seam and the local background at F417".
2. `B03-SH01` Look line: replace the colour list with `VD25` (blouse `#b4bbb1`, scarf `#3c5d5b`, tag `#cdd1c3`, rim `#7f9a98`).
3. `B03-SH01` Acceptance: add the four rows in `VD27`; strike "lead height" and `VD15` references; Baseline note: `VD15` now covers `B07-SH01` only.
4. Dependencies: `F-R4-1`..`7` closed by `VD24`..`VD30`.
No change to range, VO, cues, label frame, sound frames, IDs or the caption zone.

## What Boss may build now (`S1-R4`)

- **`B02-SH01` fist layer:** go, using `VD29` numbers (they are Film's; Mark's sheet sync does not change geometry beyond them). One shot-group invocation with the B03 plate.
- **`B03-SH01` `FPOV-CHEST`:** go for torso/collar/scarf/sleeves/hands/notebook/doodle/corridor wash and the Overlay tag, using `VD24`–`VD27`. The user asked for this FPOV on 31 Oct 2026 and chose the tag text; the missing explicit R4 row verdict (`U1`) is the coordinator's confirmation and does not change construction.
- Deliverables to return: stills F443, F467, F473, F479, F513, F520, F528, F644 for `B03`; F304, F409, F417, F421, F442 for `B02`, as `scripts/qa-sheet.sh` sheets plus measured boxes (hand bbox, page/tag/blouse means, `caption-zone.py --band 860:1248`).

**Must wait:**
- Editor integration and any claim that the shots are done: needs the Boss frames and QA, the user's `B03-SH01` row verdict (`U1`), and the Mark sheet sync.
- Committing the Noto Sans JP files: delivery step (`docs/contributing.md`), with the code that uses them.
- The optional font subset and any shared `PaintedStage` mount: TL/Boss decisions, not blockers.
- Anything about era-specific tag authenticity: Boat only if the user asks (`VD28`).

## Status

`F-R4-1`..`F-R4-4`, `F-R4-6`, `F-R4-7` answered; `F-R4-5` closed as not needed. Open: Mark sheet sync (requests above), `U1` user confirm, Boss `S1-R4` frames. Untested: fist envelope numbers (arithmetic only), glyph coverage of the font, front-view kid hands at 1.14 (needs a first Boss frame), cardigan/tag value order (hexes estimated).

---

# FILM-R6 — `F-R6`: `B03-SH01` reframe re-checks (31 Oct 2026, Film; appended, same file)

Inputs: `SCENE-R4` `B03-SH01` block (Mark reframe), `VD24`–`VD30` above, [boss-s1r4-fix-report.md](boss-s1r4-fix-report.md) (caption band measured on the previous painted build), CP-P02. Arithmetic only, nothing rendered. Hex luma = 0.299 R + 0.587 G + 0.114 B (0–255).

## Verdicts

| Check | Verdict | Record |
| --- | --- | --- |
| (1) caption zone | **Pass by bound**, remeasure after build | `VD31` |
| (2) hand size | **Pass** (visible heel + thumb only; a full hand at this size would be too small) | `VD32` |
| (3) value order | **Pass with 3 amendments** | `VD33` |
| (4) look record, label | **Accepted** | `VD34`, `VD35` |
| Mark arithmetic | 2 errors (cuff bottom; sliver length unit), everything else checks | below |

## VD31 caption zone

Band y 860–1248 at s 1.14 is plate y 830–1170 (s 1.00: 860–1248). Contents: dark cardigan x 118–962 (78 % of width, `#26303a`, luma 46 = 0.18) and wash ≤ `#3d5453` (luma 77 = 0.30) in the 22 % side gaps. Mean ≈ 0.78 · 0.18 + 0.22 · 0.30 = 0.21; p95 bounded by the wash 0.30. This reproduces the previous build (max mean 0.208, p95 0.280, 28 sampled B02/B03 frames) and sits under 0.25 / 0.40. Nothing bright enters: notebook bottom 846, elbows 846, cuffs 830, hands 780 at s 1.14; pockets start at plate 1260 (outside at s 1.00; at 1.14 band ends plate 1170). **Pass.** Conditions: the wash below y 860 stays ≤ `#3d5453` and the hem band (plate 1620) stays outside the band; Boss re-runs `scripts/caption-zone.py` on F443, F479, F528, F644 (sampled, not every frame).

## VD32 hand size

k 3400 px/m. A child's palm is 0.06 m wide (204 px) and ≈ 0.14 m long (476 px); the thumb ≈ 0.045 m (153 px). Fingers sit behind the page (`VD24` cond. 1), so the visible parts are the heel outside the page edge (page edge x 270; box x 200–300, so ≈ 70 px outside + thumb ≈ 35 px on the page) and the thumb foreshortened toward the viewer: 100 × 120 px = 0.029 × 0.035 m, about half the palm width and a thumb pad seen end-on. Plausible. It would be too small (doll hands) only if a whole hand were drawn there. The pocket notebook 540 × 360 px = 0.16 × 0.11 m is open A7 (148 × 105 mm): consistent. Allowed range for Boss: visible hand 100–125 × 120–150 px plate (mitten stylisation of the WORLD FOG style may enlarge, never shrink); no fingertips visible. Untested: the painted hand at 1.14 (needs the first frame).

## VD33 value order (luma)

page `#d8dccf` 217 > tag `#cdd1c3` 206 > blouse `#b4bbb1` 184 > scarf `#3c5d5b` 83; cuff strip = blouse (not brighter); sliver `#1b232b` 33 vs cardigan 46 (12 levels, needs ≥ 6) vs right/low wash 77 (44 levels). Order holds. Amendments:
1. **Page vs tag margin is only 11 levels.** The painted doodle must not tint or darken the page: page ground (outside the doodle) stays ≥ `#d4d8cb` (luma ≥ 211), tag body unchanged. Do not add a cel shade to the page.
2. **Painted ink colour on the figure** ≥ `#141b21`; no ink line on the sliver's inner edge (already in the sheet), and no ink wider than 2 px on the sliver's outer edge, or it swallows the 12-level step. Cel shade side of the body ≥ `#202932`; the right sliver stays ≥ 6 levels under the body's tone on its own side (about `#151c23`).
3. Cuff strips `#b4bbb1` may take the cel shade (≥ `#9ea69d`), never lighter than the blouse in the V.

## VD34 look record

The user's decision (31 Oct 2026) is recorded: classmate figure and `DOODLE-HANAKO` **painted in the WORLD FOG character style**, notebook paper may stay crisp, tag crisp SVG. This **replaces `VD24` condition 3 for `B03-SH01`** ("`hardFill` for cardigan, collar, scarf, sleeves, hands, notebook") and **the `VD30` `B03-SH01` row** (now: "painted figure and doodle, crisp paper and tag, wash corridor"). Unchanged: `VD24` conditions 1, 2, 4, 5, 6, the `VD05` amendment, `VD25` palette (plus `VD33`), `VD26` tag, `VD27` rows. Risk: painted fills must stay opaque (see `DF-20261031-painted-opaque-cast`); the elbow construction follows CP-P02 as in WORLD FOG `S02-SH03` (side-by-side QA sheet already in the acceptance).

## VD35 label position

Accepted as a B03-only override of the slot-0 y: ink box x 120–664, y 357–405. Checked: 357 − 336 = 21 px below the V apex at F467; 439 − 405 = 34 px above the notebook top at F644; tag screen x ≥ 722 at F467 (≥ 745 at 1.14), 58 px clear; only the dark scarf tails (teal luma 83) lie under it, light text with the dark outline stays legible.

## Mark arithmetic check (s 1.14, focus (540, 620))

Verified: elbows (67, 846)/(1013, 846) and 8 px inside the torso edge (59/1021); torso edge y 450 → 33/1047; notebook x 232–848; **notebook bottom 699 + 120 cos 8° = 817.8 → y 845.5 ≤ 849**; top 439; tag 745–996, 261–346; apex 300 (336 at F467); hem 1760, skirt 160 (300 at F443); frame top plate y 76; doodle 208/212/237 px; forearm √(105² + 46²) = 115; s(F467) 1.0105, s(F479) 1.0209. Errors:
1. **Cuff bottom**: plate 804 → y 830, not 825 (still ≤ 849 and 30 px above the band).
2. **Sliver visible length ≤ 320 px**: plate length y 520–818 is 298 px, on screen at 1.14 it is 340 px. State the unit: ≤ 300 plate / ≤ 340 screen. Width 25 px plate at y 760 (28 on screen) is inside ≤ 30.
Note: the elbow's lowest contour 820 plate + 2–3 px ink = 849–851 on screen, still 9 px above the band; accept ±3 px on the 849 row.

## Requests to Mark
Amend the acceptance rows for items 1–2 above; add `VD33` hexes to the Look line; replace "Film re-confirms in `F-R6`" with "`FILM-R6` `VD31`–`VD35`".

## What Boss may build now
**Go** for `B03-SH01` rebuild (`S1-R4`): painted figure and doodle per `VD34`, crisp paper and SVG tag, with `VD33` amendments; then caption-zone and value measurements on F443/F479/F528/F644 and the `S02-SH03` side-by-side. Untested: painted hand and elbow at 1.14, ink-colour separation of the sliver.
