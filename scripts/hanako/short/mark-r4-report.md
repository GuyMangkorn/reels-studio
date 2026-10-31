# Mark report — HANAKO-SHORT-SCENE-R4 (31 Oct 2026)

Revision `HANAKO-SHORT-SCENE-R4` of [scene-sheet.md](scene-sheet.md) (supersedes `SCENE-R3`). Status (verdict fold, 31 Oct 2026): **`ready-for-dev`** for `B02-SH01` (`R4-P1` accepted, fist layer in the shot block) and `B03-SH01` (**flagged: no explicit R4 row verdict; the coordinator asks the user to confirm**); all other shots keep the user-approved `SCENE-R3` text. Boss builds the `B02` fist and `B03` FPOV plates only after the [Film checks](#film-checks-f-r4-17). Review rows: [review-rows.json](review-rows.json) (closed items «ตอบแล้ว: ผ่าน», `B03-SH01` open) — review page: pending.

Inputs: `SCENE-R3`, `FILM-R4` (`VD04`–`VD06`, `VD15`, `VD16`), voice lock v3 (`B03-a1` F444, `B03-a2` F583), Boss polish-A report, Boss g1 frames (`out/qa/hanako/g1/B03-SH01-*`, viewed at 270 px), WORLD FOG `PHONE-SVG` precedent (`src/painted/worldfog/phone.tsx`), painted-2d art defaults (FPOV foreground `hardFill`, wash background).

## What changed

- `B03-SH01` re-framed as FPOV ([shot block](scene-sheet.md#b03-sh01--a-child-retells-her-to-you-fpov-notebook-name)). Unchanged: range [443, 645), VO, subtitle cues, label slot 0 at F467, doodle readable from F479, music F443, whispers F585, hard cuts F443/F645.
- New section [FPOV review (R4)](scene-sheet.md#fpov-review-r4): decisions `MK-R4-D1`–`D5`, a verdict for every shot except `B07-SH01`, and proposal `R4-P1`.
- Shot map, Baseline/assets (`FPOV-CHEST`, `CH-KID` front chest crop, `NAMETAG-B03`), caption-zone table, Dependencies (`F-R4-1`–`F-R4-7`, `S1-R4`, U1 for R4) and Change log updated. [handoff.md](../handoff.md) next steps and [delivery.md](../delivery.md) got one note each.

## Decisions

- `MK-R4-D1` The viewer is the listening classmate. The teller's chest fills the frame, there is no head, and the frame top sits below the chin. The A6 notebook is held at chest height and tilts 70° → 8° over F467–F479. The doodle is ≈ 223 px at F479 and ≈ 248 px at F644 (R3: 130–145 px). The push runs s 1.00 → 1.04 → 1.12 (lean-in F513–F528, which replaces child R's lean) → 1.14, with focus (560, 640). At s 1.14 everything stays above y 849.
- `MK-R4-D2` The name tag reads 「3年2組 たなか」 and never Hanako, because a living child tagged Hanako blurs the ghost's identity. The alternatives (blank tag, or the name hidden by the scarf) are offered as `R4-Q1`.
- `MK-R4-D3` The foreground is crisp `hardFill` art, the tag is SVG on the plate camera, and the corridor background is a painted wash.
- `MK-R4-D4` In `B03`, `CH-KID` is reduced to a front chest crop plus hands. `VD15` drops `B03`, and FPOV acceptance numbers replace the lead ≥ 480 px row.
- `MK-R4-D5` Continuity:
  - `B02 → B03` is a centred graphic match.
  - `B03 → B04` cuts paper to paper.
  - The teller's navy cardigan is not the viewer's grey `HANAKO_HAND` sleeve.
  - The chain reads B03 told to you → B07 → B08 → B09 you knock.

## FPOV verdicts (summary)

- Already FPOV, kept: `B01-SH01`, `B05-SH01`, `B05-SH02`, `B09-SH01`.
- Changed by user decision: `B03-SH01`. New art needed, so high cost.
- Proposed, **accepted by the user 31 Oct 2026**: `R4-P1` `B02-SH01`. The viewer's raised fist sits in the lower-right corner, x 890–1080, y 620–850. It is a screen layer outside the door push, and it flinches 4 f on «ค่ะ» at F417. It reuses `paintKnockHand` / `paintPovHand` with `HANAKO_HAND`, so cost is low. It replaces nothing.
- Kept as is, with a one-line reason each in the sheet: `B01-SH02`, `B04-SH01`, `B06-SH01`, `B06-SH02` (no hand allowed on the record), `B07-SH01` (the user likes it), `B07-SH02`, `B07-SH03`, `B08-SH01`.

## User verdicts (R4 review page, 31 Oct 2026)

- `R4-Q1` name tag: `ok`, «ตามแนะนำได้เลย» → 「3年2組 たなか」, never Hanako.
- `R4-P1` `B02-SH01` fist flinch at F417: `ok` → accepted, now in the `B02-SH01` block.
- `R4-Q2` keep list: `ok`.
- `B03-SH01` row: **no R4 verdict** (stored row is the R3 `ok` on the old framing). Accepted in substance via `R4-Q1`; not user approval; still to confirm.

<a id="film-checks-f-r4-17"></a>
## Film checks (F-R4-1..7)

For a fresh Film invocation (AI11: read by path and revision). Inputs: [scene-sheet.md](scene-sheet.md) `HANAKO-SHORT-SCENE-R4` (verdict fold, 31 Oct 2026) and [film-brief.md](film-brief.md) `HANAKO-SHORT-FILM-R4`. Read by section (CB01): sheet sections **`B02-SH01`**, **`B03-SH01`**, **FPOV review (R4)** (`MK-R4-D1`–`D5`, `R4-P1`), **Baseline and assets** (named spaces, `RR-DOOR` row, POV hand line, asset table), **Caption-zone check** (`B02`, `B03` rows) and **Dependencies** (`F-R4-*`). Output: a `FILM-R5` pass in `film-brief.md` (new section + change log) that answers each check with a decision ID, and a status per check. Film owns the approach and conventions; shot numbers stay Mark's (return a number change as a request, not an edit to the sheet). Not in scope: story, VO, timing, frame ranges, the tag text (user-chosen), shots other than `B02`/`B03` except the look question in `F-R4-7`.

| Check | Question | Read | Done means |
| --- | --- | --- | --- |
| `F-R4-1` | Is the `B03` FPOV chest art feasible in painted + `hardFill`: a front-view child torso with no head (frame top below the chin), sailor collar + scarf knot, sleeves to the elbows, front-view hands holding an A6 notebook with thumbs on the page front? | Sheet `B03-SH01` (staging table, Look line), `MK-R4-D1`/`D3`/`D4`; brief `VD05` (Scene decisions) and User decisions Q2; [painted-2d skill](../../../.claude/skills/painted-2d/SKILL.md) "Art direction defaults"; [CP-P](../../../docs/character-proportion-principles.md#cp-p-arm-depth) (front-view arms, foreshortened forearms); precedent `src/painted/worldfog/phone.tsx` | A yes/no with conditions; `VD05` amended (new decision ID) to allow a headless front chest crop for `B03` while `B07-SH01`/`B08` keep back / ¾-back; any pose or construction limit Boss must respect, named |
| `F-R4-2` | Do the `B03` colours hold against `VD03`: cardigan `#26303a`, collar `#1f2a36` + line `#cfd3c8`, blouse `#c9cfc4`, scarf `#2f4a4a`, paper `#d8dccf`, tag `#e3e1d6` / border `#5d6f7a` / text `#1d2a2c`; doodle red `#c8403f` the only saturated value; no amber (reserved for `B06`)? | Sheet `B03-SH01` Look line; brief `VD03`, `VD06`, Look judgement (R2 look stills) | Palette accepted or replaced hex by hex in the brief; light direction (cool daylight upper left, rim screen-left shoulder, page brightest) confirmed or changed |
| `F-R4-3` | Can `NAMETAG-B03` be an SVG layer that rides the plate camera (the plate's `Overlay` with the plate transform) so it pushes with the torso, and are the font and licence files ready? | Sheet `B03-SH01` (tag row, Camera line: tag x 720–948, y 338–418 at s 1.14); [DF-20261030-painted-screen-layers-overlay](../../../docs/dev-findings/DF-20261030-painted-screen-layers-overlay.md) (revalidate); `public/fonts/NotoSansJP.ttf`, `OFL-NotoSansJP.txt`, `NOTICE-NotoSansJP.txt` (untracked); sheet `MK-R4-D3` | Approach stated (plate-camera overlay vs. brushed tag) with the finding ID linked; font/licence status recorded (present, licence OK, still untracked → delivery note); text fixed as 「3年2組」 small + 「たなか」 main |
| `F-R4-4` | Does `VD15` drop `B03` (stays for `B07-SH01`), and are the FPOV acceptance rows a sufficient replacement for "lead ≥ 480 px"? Does the lean-in push step s 1.04 → 1.12 over F513–F528 (sine in-out) read as a lean, not a jump? | Sheet `B03-SH01` Camera and Acceptance tables, `MK-R4-D4`; brief `VD15` (Film answers R2); sheet Caption-zone `B03` row | `VD15` scope amended; acceptance rows accepted or amended (number change returned to Mark); push step accepted or a change requested |
| `F-R4-5` | (Optional, Boat) Is a 名札 with class + surname plausible on a 1990s–2020s Japanese elementary uniform? Only if Film wants it checked; no script claim depends on it | Sheet `MK-R4-D2`; Dependencies `F-R4-5` | Film records "not needed" or hands the question to Boat via the coordinator |
| `F-R4-6` | `B02-SH01` (`R4-P1`, user-accepted): is the POV fist the right size and place on `RR-DOOR` (knuckle (965, 735), size ≈ 1.05, envelope x 890–1080, y 620–850, screen layer outside the push), and does it compete with the seam light at F417? | Sheet `B02-SH01` block (fist table, Look and Acceptance lines), `R4-P1` record in FPOV review; sheet Baseline `RR-DOOR` row and POV hand line; brief `VD04`, `VD12`, `VD13`; `B01-SH01` hand row for sleeve tone | Size/position accepted or a numeric change requested; value rule confirmed (fist darkest on the right, no rim from the seam); "screen layer outside the push" accepted as the transform convention |
| `F-R4-7` | Look only: does the FPOV `hardFill` foreground default apply to the existing `B01`/`B05`/`B09` POV hands and the drawer/folder, given the Boss polish brief kept those plates' `hardFill` look (P03–P07 dropped)? No framing change | painted-2d skill "Art direction defaults"; [boss-polish-brief.md](boss-polish-brief.md) (dropped P03–P07 line); brief `VD04` | A one-line decision per shot group (apply / already applies / no change) recorded in the brief; no sheet change unless Film asks for one |

When `F-R4-1`–`F-R4-4` and `F-R4-6` are answered (and `F-R4-7` recorded), Film returns to the coordinator; next boundary: Boss `S1-R4` plates (`B02` fist, `B03` FPOV) in one shot-group invocation. A Film change to a shot number comes back to Mark as a sheet revision request. Superseded: the earlier short list "For Film to check before `ready-for-dev`" (replaced by this table).

## Notes for the coordinator

- `review-rows.json` passes the build schema check. `build.py` stops with "missing media file: out/hanako-look/LF01-HOOK-A.png" in this worktree because the look stills sit in the main checkout's `out/`, which is ignored. Build the page from a checkout that has `out/hanako-look/`.
- Question IDs are new (`R4-Q1`, `R4-P1`, `R4-Q2`) so they do not overwrite the R3 `Q1`–`Q4` verdicts stored at the same artifact URL.
- No code, `src/`, rule documents or voice lock were edited. No element preview of the FPOV chest exists. The `B03` preview on the page is the superseded R3 Boss frame, labelled as such.
- Next boundary (31 Oct 2026, after the verdict fold): coordinator republishes the page and asks for the `B03-SH01` row → Film [checks](#film-checks-f-r4-17) → Boss `S1-R4` (`B02` fist, `B03` FPOV).
