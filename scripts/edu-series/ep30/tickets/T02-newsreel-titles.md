# T02 — the six newsreel title cards (VD30-09) render from one component
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: done
Class: capability · Hard: no
Blocked by: none · Consumers: B02-SH01, B03-SH01, B04-SH01, B05-SH01, B05-SH03, B06-SH04 (through the T03 adapter)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); brief [VD30-09](../short/film-brief.md#scene-decisions); the six Title overlay lines in the sheets (b02 B02-SH01, b03 B03-SH01, b04 B04-SH01, b05 B05-SH01 and B05-SH03, b06 B06-SH04).

## Build
A screen-space React/SVG title card for the 1932 newsreel, episode-owned (kit intake at W8.4 decides if it moves to the kit), drawn by the T03 adapter above the newsreel overlay and below the Editor's captions.
Files: `src/painted/edu30/titles.tsx` (new: `NewsreelTitle` component and `TITLES` table), `tests/edu30-titles.test.ts` (new)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Texts and global frames [in, out) | "แคมเปียน รัฐเวสเทิร์นออสเตรเลีย · 1932" [206, 240) · "แผน 1" [704, 734) · "แผน 2" [868, 898) · "แผน 3" [1150, 1180) · "ถอนทัพ รอบที่ 1" [1363, 1388) · "ถอนทัพ รอบที่ 2" [1715, 1737) | sheets, Title overlay lines (SCENE-R2) |
| Thai text | verbatim from the row above | script |
| Box | centred x 540; width = text width + 2 × 72 px, min 420 px; band y 300–475 (175 px, inside the sheets' y 260–520; B04-SH01 requires y 300–475, so one band serves all six) | sheets |
| Plate | fill `rgba(20,14,8,0.62)`, corner radius 0 | VD30-09 "dark translucent plate" |
| Frame | two rules: outer 3 px at 14 px inset, inner 1.5 px at 22 px inset, colour `#efe3c4`; art-deco corner step: at each corner the inner rule steps in 10 px then 10 px | VD30-09 "thin double-rule art-deco frame" |
| Type | `Noto Sans Thai` 700, 92 px for "แผน n" and "ถอนทัพ รอบที่ n", 58 px for the place tag; colour `#efe3c4`; letter-spacing 0.02 em; one line | VD30-09 "cream Thai display text" |
| Flicker-in | frames in+0 … in+3: opacity 0.0, 0.8, 0.35, 1.0; then 1.0 to out−1; hard off at out | sheets ("flicker-in 4 f", "steady") |
| Era match | the card moves with the gate weave (`newsreelWeave` transform) and sits outside the CSS tint filter (cream is already in the tint family); `NewsreelOverlay` scratches and dust draw above it | VD30-09 |
| Shake | never moves with the VD30-11 canvas shake (B03-SH01 "never shaken") | b03 B03-SH01 Title overlay |
| API | `NewsreelTitle({text, frame, inFrame, outFrame, size})` returns null outside [in, out); `TITLES: {shot: string; text: string; in: number; out: number; size: 92 \| 58}[]` in global frames | ticket |

References (store): `projects/edu/EDU/previews/LF02.58933d6b.png` (LF02 R4 shows the "แผน 2" position over the sky).

## Proof
- `npx tsc --noEmit -p . > out/logs/T02-tsc.log 2>&1; tail -5 out/logs/T02-tsc.log`
- `node scripts/test.mjs tests/edu30-titles.test.ts`: render with `react-dom/server` `renderToStaticMarkup` at in−1, in, in+1, in+2, in+3, out−1, out for every row; check the opacity values, the box band and null outside; the six rows match the table above exactly.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| test | opacity 0 / 0.8 / 0.35 / 1.0, null at out and in−1 | exact |
| test | box top 300, bottom 475 | exact |

The cards are first seen over their plates in T20, T24, T26, T29, T30 and T32 at 270 px.

## Result (Boss fills)
Commit: this commit on the Boss worktree branch (see index) · proof sheet: none (the ticket proves by tests; cards are first seen in T20/T24/T26/T29/T30/T32) · fix passes: 0.
Measured: `node scripts/test.mjs tests/edu30-titles.test.ts` 3/3 pass (six rows exact; opacity 0 / 0.8 / 0.35 / 1.0 at in+0..3 and 1.0 at out-1 for all six; null at in-1 and out; band top 300, bottom 475). Box widths (Noto Sans Thai 700 advance widths measured in Chrome, plus 0.02 em letter-spacing, plus 2 x 72): place tag 1177.3 px at 58 px, "แผน n" 420 (min), "ถอนทัพ รอบที่ n" 789.5. `npx tsc --noEmit -p .`: no error in the new files (22 existing errors in other test files, unrelated). `npm test` in this fresh worktree: 16 failures in animation, catbox-short, loudness, media, new-shot, painted, people, plates and others; none touch the new files (worktree has no fetched media or local node_modules).
Open question for Film (value not followed): the place tag B02-SH01 at 58 px on one line is 989 + 38 x 1.16 = about 1033 px of text, so the ticket's box rule (text + 144) gives 1177 px, wider than the 1080 px frame (clipped about 48 px each side). The ticket gives no maximum. Options: reduce side padding for that card, drop the size, or allow two lines inside the 175 px band. Built exactly as written (no clamp) until Film decides; the change is one line in `boxWidth`/`TITLES` in `src/painted/edu30/titles.tsx`.
Width method: no browser measure at render time, so `EM` holds the measured em widths of the six strings; any other string uses 0.5 em per base glyph (ticket silent on the method).
