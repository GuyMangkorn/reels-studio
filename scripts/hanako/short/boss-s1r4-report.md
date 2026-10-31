# Boss S1-R4 — HANAKO-SHORT `B02-SH01` fist and `B03-SH01` FPOV-CHEST (31 Oct 2026)

Scope: Film `VD24`–`VD30` ([film-r5.md](film-r5.md)), scene sheet `HANAKO-SHORT-SCENE-R4` (B02-SH01, B03-SH01), user verdict on the B03 row (`ok`, relayed by the coordinator, 31 Oct 2026), and the arm-depth note (CP-P02, DF-20261030-painted-arm-depth).
Base: working tree on `claude/plate-creation-scene-r3-344e6c` (HEAD `59ef2a2`), uncommitted. 1080×1920, 30 fps, plate-local clocks (`f` = F − start).
**Visual done is not claimed.** Partial items are marked. Nothing committed; the Noto Sans JP files stay untracked.

## Per-item status

| Item | Status | Done | Still open / reads geometric |
| --- | --- | --- | --- |
| **B02-SH01 fist** (`VD29`) | **done** (plate), **partial** (envelope) | Screen layer after the door push (`screen` callback, `paintFistB02` → `paintPovHand`), size 0.80, dir −2.4, anchor (990, 745) F304 → sink +6 y linear to F409 → still → flinch F417–F421 (ease-out, +10 x, +6 y) → hold. Tone `HANAKO_HAND_B02` = `HANAKO_HAND` 50 % toward `#060c0d` (skin `#786758`, Film's estimate reproduced). Left extent 922.3 at every key (≥ 892). Fist mean luma 66.8 vs seam strip 141.5 and local background 98.5 at F417 (darker than both). | Wrist-side palm corner reaches y 892 at F421 (x ≈ 979), not ≤ 850 as `VD29` asks. It is right of the caption-safe box (x > 888), so the caption rule holds; the literal bottom does not. Film decides (see deviations, `DF-20261031-povhand-wrist-corner`). |
| **B03-SH01 FPOV-CHEST** (`VD24`–`VD27`) | **built**, **partial** (look) | Chest-only plate replaces the two-children plate: no head at any frame; cardigan `#26303a` with one cel shade (right), rim `#7f9a98` (left shoulder), sleeve seam; sailor collar `#1f2a36` with `#cfd3c8` line; blouse V `#b4bbb1`; scarf `#3c5d5b` (shade `#2c4645`); notebook (A6, `hardFill` paper `#d8dccf`, doodle `DOODLE-HANAKO` red skirt `#c8403f` only saturated value); painted corridor wash (no outlines, no hardFill); tilt 70° → 8° over F467–F479 (ease-out); name tag as SVG in the plate Overlay under `cameraTransform`; camera 1.00 → 1.04 (F443–F513) → lean 1.04 → 1.12 (F513–F528) → 1.14 (F528–F645), focus (560, 640); label slot 0 unchanged. | The figure reads as flat shapes (see "Still geometric"). The arm construction was reworked after the arm-depth verdict (below); the forearm is still mostly covered by the hand. Not a visual pass. |
| Name tag `NAMETAG-B03` (`VD26`) | **done** (render), tag text checked by cmap | 「3年2組」 small (20 px, 500), 「たなか」 main (40 px, 700), `lang="ja"`. Glyphs 3 年 2 組 た な か checked in `public/fonts/NotoSansJP.ttf` (cmap parse, all present). Font gate `FpovTag` (`delayRender`/`continueRender`, `loadFont` in the component, not at import). | Main-line size is 40 px, not Film's estimated 34 px: Film's acceptance "cap height ≥ 36 px on screen" needs it (measured 40 px ink at s 1.14). Recorded as a deviation for Film/Mark. |
| B03 camera (`VD27` push) | **done** (numbers), render verified at F443/F467/F479/F513/F520/F528/F644 | `fpovCamera`; per-frame max step < 0.009 (test). | Studio not run. |
| Loop F2595 → F0 | **done** | `B09-SH01` f293 (= F2595) and `loop-landing-f0` (= F0) are byte-identical in the same render session. B09 f293 is also byte-identical before vs after this change (B09 path untouched). | Cross-session repeat not tested beyond this. |
| Caption zone (B02, B03) | **done** | `caption-zone.py --band 860:1248`: 33/33 frames pass. B02 mean 0.206–0.208 / p95 0.237–0.238; B03 mean 0.208–0.212 / p95 0.277–0.280. | — |
| B03 FPOV acceptance (`VD27` rows) | **partial** | (1) value order at F479: page 219 > tag 208 > blouse 163 > scarf 88 (luma, measured); at F644 page 219 > tag 203.5 > blouse 186 > scarf 88. Doodle red is the only region with HSV saturation > 0.5 (0 samples outside the skirt box, sampled every 2 px). (2) silhouette separation at F443: left y 300 / 400 / 600 = 61 / 65 / 31 levels, right y 300 / 400 / 600 = 30 / 31 / 27 levels (≥ 20 on every valid row). Row y 700 left hits the hand, so it is not a valid row. (3) tag main line ink 40 px at s 1.14 (≥ 36); no clipped glyph in the 540 px view; no full-resolution crop taken. (4) hands: thumbs on the page surface, no finger drawn beyond the page; hand and cuff bottoms plate y ≤ 818 → screen ≤ 849 at s 1.14 (test). | Not a user verdict. Full-resolution tag crop not made. |
| Doodle size | **estimated** | Face-on box 220 px tall, foreshortened by cos θ: ≈ 221.5 plate px at F479 (≈ 226 on screen with s 1.021), ≈ 252 at F644 (s 1.14). Film's targets 223 / 248. | Not pixel-measured. |
| Tests / typecheck / lint | **done** | `npm run typecheck` 0 errors. `npm run lint` 0 errors, 3 pre-existing hook warnings (look-r3/look-r4/look). `npm test` 218/218 (Hanako plate suite 15/15 incl. 6 new S1-R4 tests). | — |

## Arm-depth verdict (coordinator relay, 31 Oct 2026)

The user found the R3 arms "very wrong" in depth. Handled as follows (construction in `src/painted/hanako/plates-r4.tsx`, `ARM`, `cuffAt`):

- Upper arms hang from rounded shoulder joints (capsule, width 170 → 96) **behind** the torso, a shade darker (`#1f2a33`), so only their outer edges show (CP-P02). Elbow (128, 770) sits outside the torso edge and a little below the hand (CP-P02: elbow a little below the hand; DF-20261030-painted-arm-depth: elbow outside the torso edge; no layer switch in this shot, so CP-P06 does not apply).
- Forearm comes toward the viewer: short (≈ 107 px) and widening to the wrist (96 → 118 px), so the nearer end is larger. Forearm and upper arm share the sleeve colour; the cuff (`#b4bbb1`, 118 px) sits across the wrist end and the hand emerges from under it (overlap).
- Hand (heel + thumb on the page front, fingers behind the page) is about the cuff width (104 × 88 px heel) so hand size and forearm wrist read as one scale.
- Tests check: forearm shorter than a third of the upper arm; wrist wider than the elbow; elbow a little below the heel centre; cuff and forearm inside the 1.14 bottom limit.

What I looked at: frames F443–F644 at 270 px (sheets) and F479 at 540 px. Continuity from upper arm to elbow to forearm to cuff to hand reads in the 540 px view. **It still looks off in two ways:** the forearm is mostly hidden by the hand, so it reads as a sleeve end with a cuff stub; and the lower body runs to the frame bottom with the same width, so the figure reads as a long coat. I am not claiming the arms are done.

## Still geometric (what a reviewer will still see)

- Everything is flat `hardFill` polygons with one ink or rim line; no brush texture on the foreground (the Film rule; it reads like clip art at 540 px).
- Hands: a round heel and a peg thumb; no knuckle or finger structure (by design: fingers behind the page).
- Forearm mostly under the hand; the cuff reads as a small grey stub.
- Lower body: long dark mass to the frame bottom (the sheet's "waist narrows" is only partly designed).
- Shoulder line and collar: a flat band; the scarf is two tails and a knot.
- Doodle: simple bob, face outline, red skirt (readable at F479, not detailed).

## Deviations from the sheet and Film (recorded, not silently applied)

1. **Shoulders and elbows (Mark's sheet):** the sheet puts the shoulders at the frame sides at y 40–120 and the elbows at (150, 700). An upper arm of ~430 px (a 1.3 m child at 2400 px/m, ≈ 0.18 m) needs the shoulder joints near y 340; the plate uses shoulder (150, 340) and elbow (128, 770), per CP-P02. Mark to confirm.
2. **Fist bottom:** the wrist-side corner reaches y 892 (x ≈ 979) at F421; `VD29` asks ≤ 850. Anchor, size and direction kept as Film set. Options for Film: accept (outside the caption box) or dir ≈ −2.9 rad (corner ≈ 847 at this anchor; fingers point toward the seam). `DF-20261031-povhand-wrist-corner`.
3. **Thumbs:** kept fixed on the page side edges at y 700 (the page top corners rise 226 px through the tilt, so "ride up with the top corners ≤ 20 px" cannot be literal). Both hands stay in the sheet's x ranges.
4. **Main name line 40 px** (sheet estimate 34 px) for the cap-height acceptance (≥ 36 px on screen at s 1.14).
5. **Spot removed for B03:** the R3 overlay `Spot` lit the cardigan as well as the corridor. The window light is now painted into the wash (`#6f8f8c` upper left). Flicker was not in the B03 sheet.
6. **Breathing drift (optional, VD24 item 6):** not added.
7. **Right thumb** is the exact mirror (tip at x 766, on the page), not x 800.

## Evidence (paths)

Render folders (CLI, `--gl=angle`, `scripts/hanako/render-g1.mjs` with `HANAKO_FRAMES`):
- `out/qa/hanako/s1r4/before/` — pre-change frames (B02 f000/105/113/115/117/126/138; B03 f000/024/036/070/077/085/201; B09 f293, loop-landing f0).
- `out/qa/hanako/s1r4/after/` — final frames (same frames; B03 also f030 = F473; B03 f100 repeat identical in-session).
- `out/qa/hanako/s1r4/iter1/`, `iter2/` — iterations (iter1 rejected: arms and doodle; iter2 = final code, ≤ 1 level drift).

Sheets (viewed):
- `out/qa/hanako/s1r4/sheets/B02-SH01-before-labelled.png`, `out/qa/hanako/s1r4/sheets/B02-SH01-after-labelled.png` — F304, F409, F417, F419, F421, F430, F442.
- `out/qa/hanako/s1r4/sheets/B03-SH01-before-labelled.png`, `out/qa/hanako/s1r4/sheets/B03-SH01-after-labelled.png` — F443, F467, F479, F513, F520, F528, F644.
- `out/qa/hanako/s1r4/sheets/B03-SH01-after-F467-F473-F479.png` — the tilt.
- `out/qa/hanako/s1r4/sheets/B03-SH01-after-F479-540.png` — F479 at 540 px (arms and doodle).
- `out/qa/hanako/s1r4/sheets/B02-F417-crop-right.png` — F417 full-res crop of the fist and seam.

Measurements:
- `out/qa/hanako/s1r4/measure-s1r4.json` from `python3 -I scripts/hanako/measure-s1r4.py out/qa/hanako/s1r4` (fist diff boxes and means; tag body box and text runs; value order; silhouette rows; saturation).
- Caption zone: `out/logs/s1r4-caption-after.json` (33/33 pass).
- Tag box at F644 (s 1.14): screen x 721–945, y 339–415 (body; border adds 2 px: sheet 720–948 × 338–418). At F479: x 704–905, y 371–439.

Logs: `out/logs/s1r4-*.log` (renders, typecheck, lint, tests, label sheets, measure).

## Checks

- `npm run typecheck`: exit 0.
- `npm run lint`: exit 0 (0 errors; 3 pre-existing warnings in look-r3/look-r4/look).
- `npm test`: 218/218 pass.
- Caption zone 33/33; loop F2595 → F0 byte-identical (same session); B09 untouched (byte-identical before/after).
- Not run: Studio (cold load, play/pause, unordered seeks, reload), Long composition, subtitles, audio, Editor timeline or neighbour shots (B01 → B02, B03 → B04 cuts). These are unverified.

## Files

- New: `src/painted/hanako/plates-r4.tsx` (B02 fist, B03 FPOV-CHEST, camera, tilt, tag SVG, font gate); `scripts/hanako/measure-s1r4.py`; this report.
- Changed: `src/painted/shots/hanako.tsx` (B03 camera branch, B03 paint and overlay, B02 `screen`; `paintCorridor`, `paintKid`, `paintNotebook` imports removed); `tests/hanako-plates.test.ts` (6 new S1-R4 tests appended); `scripts/hanako/render-g1.mjs` (`HANAKO_FRAMES`, default unchanged); `scripts/hanako/build-notes.md` (S1-R4 section: proposals, not applied); `docs/dev-findings.md` (index row) + `docs/dev-findings/DF-20261031-povhand-wrist-corner.md`.
- Untouched: `src/Root.tsx`, video registration, `scene-sheet.md` (Mark's sync), `film-r5.md`, rule documents, `assets.ts` (`paintCorridor`/`paintNotebook` kept, now without a production consumer), kit files, font files.

## Not verified / limitations

- Visual: the figure is not judged as "done"; it still looks geometric and the forearm and lower body are as described above.
- Font: glyph coverage by cmap parse; the `delayRender` gate ran in CLI renders with no errors, not in Studio.
- Repeatability: in-session repeat identical; cross-session drift observed at 7 channels ≤ 1 level (f036).
- Hand-to-page contact and the tilt's hinge are drawn as flat overlap, not as a physical grip.
