# Boss polish pass, Group A (P01, P02, P09) — HANAKO-SHORT

31 Oct 2026 · base: working tree on `claude/plate-creation-scene-r3-344e6c` (HEAD `59ef2a2`), uncommitted · brief `boss-polish-brief.md` · SCENE-R3, FILM-R4, voice lock v3 · 1080×1920, 30 fps.
**Visual done is not claimed.** The user decides from the sheets below. Partial items are marked as such.

## Scope kept

- Shots touched: `HANAKO-B03-SH01`, `HANAKO-B07-SH01`, `HANAKO-B07-SH03`, `HANAKO-B08-SH01`. `HANAKO-B07-SH02` unchanged (byte-identical before/after; its pin, dots and book card are map work in P11).
- Not changed: story, timing, reveals, stable IDs, camera (`hanakoCamera`), caption zone, audio, `src/Root.tsx`, video registration, other groups' art (hands, drawer, page, book, door, corridor, map). Corridor and restroom sets are untouched.
- Callers of the changed helpers are the B03/B07/B08 plates and the Hanako QA entry/test only (checked by grep).

## Per-ID status

| ID | Status | Done | Still reads geometric / open |
| --- | --- | --- | --- |
| **P01** CH-KID (B03-SH01, B07-SH01 pupils, B08-SH01 silhouette) | **partial** | Body and hair are opaque cast bases (`cast()`: `solid` ×8 + `washAt` glaze), not `hardFill`. Cropped hair with a rounded crown, not an ellipse. One rim ink style on the lit edges (torso to floor, head). One cel shade on the torso's shadow side. Sailor collar wash, school-bag panel with flap, sleeve cuffs, kid hands (palm + thumb) replace mittens and capsule ends. Legs are two dark masses with a gap; foot contact shadows. Four-head proportions, 1.30/1.25 m at 700 px/m, top and foot line unchanged, no face (VD15). | Watercolour texture is faint (solid base + 35 % glaze), so the figures read as flat-tinted blocks. Torso and legs are still trapezoids. Hair caps read as helmets. The bag reads as a panel. Legs sit at ~48/41 luma (mean of two leg samples) against ~39/32 for floor samples at the left and right edges. The separation comes from the rim and foot shadows, as VD15 requires. |
| **P02** SVG → brush (KidSilhouette, TeacherIcon, Doodle) | **done** (port), **partial** (look) | `TeacherIcon` → `paintTeacher` (B07-SH01; pen wobble still 12-f from F1708). `Doodle` → `paintDoodle` paper-cut wash with one edge line on the poster (B07-SH03). The poster paper is a wash with a still edge. `KidSilhouette` → `paintKidSilhouette` (B08-SH01; same envelope, bag and collar variants, trouser gap, feet line). Date cards and the poster caption stay SVG (crisp labels). SVG figures removed from `generations.tsx`. | Teacher is still a generic pale figure. Silhouettes are flat value shapes (VD16 design). Poster edge is deckled by the wash texture. B07-SH03 room background is still `hardFill` (see Flags). |
| **P09** classroom set (B07-SH01) | **partial** | Wall and floor as washes, inset inside the straight ceiling and floor lines (hard edges kept). Chalk-dust wash and swipe on the board, chalk dust on the tray. Two stacked falloff washes under the light band (mid-wall pixel at 540,600: #abb797 → #737f6a) and a darker lower-right floor. Warm top-left light kept (pixels: top-left #404838 → #434c3c). Desk: wood wash, front edge, grain lines, opaque base; the old black smear on the desk is removed (teacher shadow moved behind the desk). | Desk grain is faint. Floor is still mostly flat dark (it is the caption band). |

## Evidence

### Renders (`--gl=angle`, `HANAKO_OUT` evidence folders)

- Before (working tree before any edit): `out/qa/hanako/polish-A/before/g1` (B03-SH01, 15 frames), `before/g3` (B07-SH01/02/03, B08-SH01, B09-SH01 plus masks and loop checks, 134 files).
- After (final code): `out/qa/hanako/polish-A/after/g1`, `after/g3`. Same frame lists.
- Iteration renders (kept, not evidence): `out/qa/hanako/polish-A/iter1`–`iter8`.

### Sheets (viewed)

- `out/qa/hanako/polish-A/sheets/B03-SH01-before-after.png`: labelled before | after, f000 / f100 / f201 (F443 / F543 / F644).
- `out/qa/hanako/polish-A/sheets/B07-SH01-before-after.png`: labelled, f000 / f100 / f189 (F1588 / F1688 / F1777).
- `out/qa/hanako/polish-A/sheets/B07-SH03-before-after.png`: labelled, f030 / f105 (F1970 / F2045).
- `out/qa/hanako/polish-A/sheets/B08-SH01-before-after.png`: labelled, f015 / f120 / f239 (F2061 / F2166 / F2285).
- `out/qa/hanako/polish-A/sheets/after-B03-SH01-all.png`: all 15 after frames of B03-SH01.
- `out/qa/hanako/polish-A/after/g3/G3-summary.png` and `after/g3/{B07-SH01,B07-SH02,B07-SH03,B08-SH01,B09-SH01}-labelled.png`: labelled G3 review sheets with manifests; `*-sheet-NN.png` parts (12-frame, 270 px tiles).
- Full-resolution crops (pixel judgement): `sheets/kids-crop-pair-B03-SH01-f100.png` (kids, before | after), `sheets/centre-crop-pair-B07-SH01-f100.png` (board, desk, teacher).
- Change heatmap: `sheets/diff-B08-SH01.png` (threshold 13/255; only the silhouette shows).

### Measured (after = final code)

| Check | Before | After | Gate | Result |
| --- | --- | --- | --- | --- |
| B03 lead height, f0 / f100 / f201 | 909 / 963 / 1018 px | **917 / 970 / 1025 px** | ≥ 909 (G1 min) | pass |
| B07-SH01 lead height, f0 / f95 / f189 | 727 / 757 / 786 px | **733 / 763 / 792 px** | ≥ 727 (G3 classroom) | pass |
| B08 silhouette bottoms (plate y) | 848–859 px | **847–858 px** | keep ≤ 859 | pass |
| Caption zone, 119 frames of B03/B07/B08 (band 860:1248) | max mean .176 / max p95 .290 | **max mean .178 / max p95 .285** (119/119 pass) | mean ≤ .25, p95 ≤ .40 | pass |
| Loop F2595 → F0 (hook off) | 3 channels, 1/255 (re-rendered pre-edit this session; G3 record said 0) | **0 channels, byte-identical** (this session) | identical | pass this session; see Repeatability |
| Layers-off F2383 / F2506 / F2595 | 1 / 0 / 1 channel (1/255) | **0 / 0 / 0** | — | pass this session |
| Repeat (same session) B03-SH01-f100, B09-SH01-f293 | — | byte-identical | identical | pass |
| RGB-zero pixels in 5 representative frames; endpoint alpha | 0; 255 | 0; 255 | 0; 255 | pass |
| `npm run typecheck` | — | exit 0 | pass | pass |
| `npm run lint` | — | 0 errors, 3 pre-existing hook warnings | 0 errors | pass |
| `npm test` (full) | — | **211/211** (Hanako 8/8, incl. 2 new envelope tests) | pass | pass |

Pixel change per shot, final pairs (share of pixels whose largest channel change is ≥ 8 levels; ≥ 2 and ≥ 32 in brackets, one-off ffmpeg decode + count, not kept in the repo; pair list `out/qa/hanako/polish-A/diff-pairs.txt`): B03 ~7 % (kids) [≥2 ~18 %, ≥32 ~0.8 %]; B07-SH01 ~16 % (set repaint, kids, teacher) [≥2 ~55 %, ≥32 ~2 %]; B07-SH03 ~3 % (poster) [≥32 ~2 %]; B08 ~0.8 % (silhouettes) [≥2 ~1.9 %, ≥32 ~0.2–0.5 %]; B07-SH02 0 %; B09 0 %.

### Repeatability (the brief's open item, recorded again, not isolated)

- Untouched B09 frames (no edited code path) differ between render sessions by 0–3 channels at 1/255: `B09-SH01-f293` (1), `loop-landing-f0` (3), `layers-off-f204` (0), `layers-off-f045` (2). Within one session, repeats are byte-identical. The G3 record of a byte-identical loop did not reproduce on the pre-edit tree in this session (3 channels). Recorded in `docs/dev-findings/DF-20261031-render-session-drift.md`.
- A frame-wide ±1/255 pattern also appears in B08 (17 % of pixels at ≥ 1, ~0.8 % at ≥ 8). Its cause is unverified; it appears where extra brush marks were added to the same canvas.

## Changes (files)

- `src/painted/hanako/assets.ts`: `cast()`, `ribbon()`, `kidHand()`, `hairPts()`; `paintKid` rewritten (world-space arms; pivot only for local parts); `paintNotebook` mittens → `kidHand`; `paintClassroom` rewritten. `paintClassKid` unchanged (it calls `paintKid`).
- `src/painted/hanako/generations.tsx`: SVG `TeacherIcon`, `KidSilhouette`, `Doodle` removed; brush `paintTeacher`, `paintDoodle`, `paintPoster`, `paintKidSilhouette`; `SILHOUETTE_FEET_Y = 838`. `DateCard` unchanged.
- `src/painted/shots/hanako.tsx`: B07-SH01 `paintTeacher` in paint (Overlay keeps the amber spot); B07-SH03 `paintPoster` in paint (Overlay keeps the caption); B08-SH01 silhouettes in paint with the former group opacity via `p.layer` (Overlay keeps the spots and door numbers).
- `src/painted/hanako/qa-index.tsx`: `SilhouetteMask` paints through the brush.
- `scripts/hanako/render-g1.mjs`, `scripts/hanako/measure-g1.py`: `HANAKO_OUT` env to write a before/after pair (defaults unchanged).
- `tests/hanako-plates.test.ts`: two envelope tests (CH-KID crown and floor line; silhouette feet line and height).
- `scripts/hanako/build-notes.md`: appended notes and the skill-rule proposal (not applied).
- `docs/dev-findings.md` + `docs/dev-findings/DF-20261031-painted-opaque-cast.md` and `DF-20261031-render-session-drift.md`: two findings recorded by Boss (rule documents not edited).

## Flags and decisions for the coordinator

- **Look change, B08:** the silhouettes now sit under the amber and ambient spots (they were above them). Same geometry, same group opacity. Film/Mark may want to confirm the look.
- **Skill rule gap (proposal, not applied):** cast is listed as `washAt` + `inkLine`, but a single p5.brush wash is translucent on dark figures. Proposed: an opaque `solid()` base (8 passes) with a `washAt` glaze. Full wording in `build-notes.md`.
- **Flag, not changed:** `B07-SH03` room background is still `hardFill`. The 31 Oct refinement keeps washes for POV/close-up backgrounds; B07-SH03 is a wide plate, so this is a question for the next pass.
- **Not changed (no row):** the notebook paper and the doodle drawn on it in B03 (flat, VD06).
- **Feet line 840 → 838** for B08 silhouettes (2 px) to keep the painted spread out of the caption band; heights unchanged.

## Not verified (limitations)

- No Studio cold load, play/pause, backward scrub or unordered seek; no assembled timeline (neighbour dissolves B06→B07, B07→B08 not checked).
- No continuous playback review and no adjacent-frame jump audit beyond the keyframe and 1 Hz samples the render script produces.
- No audio, subtitle/chrome or listening check.
- Other groups' plates (B01, B02, B04–B06) not re-rendered; they have no call path to the changed functions. B09 frames were re-rendered (identical this session, session drift noted above).
- The look is not approved: the user decides from the sheets. No cross-backend determinism test.
- Nothing committed or pushed: the Hanako files are untracked in this checkout, so `git diff` against HEAD does not show these edits.
