# Boss: B07-SH03 FILM-CARD uses the user's real flyer (31 Oct 2026, r2)

- Deliverable: HANAKO-SHORT (Thai Short, composition `HANAKO-SHORT`), shot `B07-SH03` [F1940, F2046), f0 = F1940.
- Checkout: `claude/hanako-next-437b9b` working tree on `f8788d1`. Uncommitted Group C/E2/E3 work kept. Nothing committed or pushed.
- Revision: r2 (coordinator request: enlarge the card, move DATE, keep redaction). r1 sheets (560 × 510 card) are superseded.
- Status: asset and shot code built; r2 stills and measured checks done. Not Studio-verified, not sequence-verified, not adopted by Film or Mark.
- Decisions applied (user, 31 Oct 2026): real flyer; partial blur allowed; hide the year and the title; no 『学校の怪談』 on the card (F012); disclaimer label stays removed; copy-mid-left blur stays; sigma 12 title stays.

## Final card geometry (r2)

| Item | Value |
| --- | --- |
| Card box (stage px, at posterY 0) | x 255–825 (570 px), y 30–844.3 (814.3 px), 7:10 |
| Fit | the flyer fills the box; 570 : 814.3 = 420 : 600, so no letterbox bars remain (contain-fit code kept) |
| Ink edge | 1.5 px outside the box, static |
| Height share of frame | 814 px = 42.4 % of 1920 at rest; 855 px (44.5 %) at the push end |
| Caption band y 860 at push end | card ink bottom at screen y 858.8 at s 1.05 (focus y 585). Clears 860 |
| Top in frame at push end | screen y 0.7 at s 1.05 (visible) |
| Slide | posterY 400 → 0 over F1940–F1952 (unchanged). Card bottom in band (y ≥ 860) for F1940–F1948; clear from F1949 |

Why not 700 px: at 7:10, 700 px wide is 1000 px tall. For its bottom to clear y 860 at the push end, its top would sit at about y −155, so the card would leave the frame. The largest whole card that clears the band with its top in frame is 570 px wide (814 px tall). If the top may clip ~28 px at the push end, 590 px wide (843 px tall) also clears the band. Asked as Q2.

## What changed

| Element | Before (r1) | After (r2) |
| --- | --- | --- |
| Card art `FILM-CARD` | painted paper card with the doodle (`paintDoodle`), SVG title stamp | the real flyer, a DOM layer `FilmPoster`; the brush keeps the card shadow and one static ink edge |
| Card box | 560 × 510 at x 260–820, y 330–840 | 570 × 814 at x 255–825, y 30–844 |
| Year and title | stamp «『トイレの花子さん』 1995» at F1994 | removed (no year, no title, no stamp event) |
| Disclaimer label | «ภาพประกอบ · ไม่ใช่โปสเตอร์จริง» at y 800 | removed (user, r2: no replacement) |
| DATE | «ยุค 90» at x 120–420, y 430–500, from F1941 | «ยุค 90» at x 40–340, y 430–500 (same y), from F1941 |
| Projector pulse | fill #efe3c4 at 0.15, F2022–F2024 | unchanged |
| Camera, posterY slide, SetLight .18, Thai VO and cues | — | unchanged |
| Shadow wash (brush) | fixed to the r1 card | derived from the box, same offsets |

DATE placement: the card now starts at x 255, and the card's top is at y 30. Above the card is not possible, and below it is the caption band. The DATE therefore overlaps the card's outer left margin for x 255–340 (85 px). That margin is blank poster (scan x 0–63, y 295–346). The ghost (card x ≥ 499), the mask face (card x 525–585, y 136–196) and the blurred copy (card x ≥ 415) are all clear of the DATE box.

Files (all uncommitted):
- `src/painted/hanako/generations.tsx`: `FILM_CARD` box 255/30/570/814.3; `paintPoster` shadow derived from the box; `FilmPoster`, `filmPosterBox`; `paintDoodle` removed.
- `src/painted/shots/hanako.tsx`: `FilmPoster` mount for B07-SH03 before the shot's `CameraLayer`; DATE `x={40}` for B07-SH03; label group and title stamp removed.
- `scripts/hanako/short/poster-redact.py` (new), `src/videos/hanako/assets.lock.json` (one entry), `.gitignore` (`public/images/hanako/`), `docs/dev-findings/DF-20261031-painted-raster-card.md` (new, r2 revalidation) and its index row, `scripts/hanako/build-notes.md` (appended section).

Store:
- `projects/legacy/HANAKO/reference/2026-10-31_b07-film-card-poster-redacted.png` (+ `.json` sidecar). Unchanged in r2. The user's original stays in `projects/legacy/HANAKO/references/user/`.
- r2 QA set: `projects/legacy/HANAKO/previews/B07-SH03-r2/` (16 images).
- r1 QA set (superseded): `projects/legacy/HANAKO/previews/B07-SH03/`. Its scan-versus-redacted comparison is still current: `projects/legacy/HANAKO/previews/B07-SH03/2026-10-31_b07-film-card-poster-scan-vs-redacted.png`.

## Redaction (unchanged in r2)

| Region | Box x, y (scan px, 420 × 600) | Sigma | Content |
| --- | --- | --- | --- |
| `tagline-top` | 10–412, −12–54 | 12 | red tagline across the top (contains 怪談) |
| `copy-mid-left` | 118–212, 190–338 | 6 | four columns of vertical marketing copy beside the ghost (not in the original list; kept blurred, user r2) |
| `title-lockup` | 72–360, 446–560 | 12 | 新生トイレの花子さん and the SCHOOL MYSTERY line |
| `credits` | 74–358, 548–590 | 6 | small staff and cast lines |
| `logo-bottom-right` | 376–414, 574–592 | 6 | small logo |

- Feather 6 px inward on each rectangle. Pixels: 76,875 touched (30.5 % of the scan), 73,017 at ≥ 50 % blur, 67,440 at full strength.
- Kept sharp: the mask face, the red ghost body, the building body (its base, y 446–463, falls in the title region), and the scan.

## Evidence

Clock: `F` composition-global (review page time), `f` shot-local.

| Frame | Clock | f | posterY | Card bottom (screen, ink) | Note |
| --- | --- | --- | --- | --- | --- |
| F1940 | TH 1:04.7 | f0 | 400 | 1245.8 | card rising from below the band |
| F1941 | TH 1:04.7 | f1 | 308 | 1153.9 | subtitle cue starts; card bottom 22 px above the subtitle rows |
| F1946 | TH 1:04.9 | f6 | 50 | 895.9 | mid-slide |
| F1948 | — | f8 | 14.8 | 860.8 | last frame with the card bottom in the band |
| F1952 | TH 1:05.1 | f12 | 0 | 846.2 | settled |
| F1994 | TH 1:06.5 | f54 | 0 | 852.6 (s ≈ 1.03) | former title-stamp frame; no stamp |
| F2022 | TH 1:07.4 | f82 | 0 | 857.4 (s ≈ 1.04) | projector pulse starts |
| F2040 | TH 1:08.0 | f100 | 0 | 858.8 (s ≈ 1.05) | before the dissolve to B08 at F2046 |

Subtitle text (F1952 frame, bright rows in the band): y 1176–1220. The card's bottom edge is above that from F1941 on (1153.9 at F1941, higher each frame after), so the card and the subtitle text do not overlap. The clearance at F1941 is 22 px.

Images (absolute paths; store copies in `~/ReelsStore/projects/legacy/HANAKO/previews/B07-SH03-r2/`):
- Labelled sheet, six frames (Chrome, preview labels): `/Users/mangkornkatawong/Developer/reels-creator/.claude/worktrees/hanako-next-437b9b/out/qa/hanako/B07-SH03-r2/sheet-B07-SH03-r2-F1940-2040.png`
- `scripts/qa-sheet.sh`, 3 × 2 at 270 px: `/Users/mangkornkatawong/Developer/reels-creator/.claude/worktrees/hanako-next-437b9b/out/qa/hanako/B07-SH03-r2/qa-sheet-B07-SH03-r2-F1940-2040.png`
- Full-resolution top-left crop, F1952 (DATE overlap, card top, backdrop edge): `/Users/mangkornkatawong/Developer/reels-creator/.claude/worktrees/hanako-next-437b9b/out/qa/hanako/B07-SH03-r2/B07-SH03_F1952_card-top-left-1x.png`
- Full-resolution bottom crop, F2040 (ink edge against the band): `/Users/mangkornkatawong/Developer/reels-creator/.claude/worktrees/hanako-next-437b9b/out/qa/hanako/B07-SH03-r2/B07-SH03_F2040_card-bottom-1x.png`
- Caption-zone overlays: `out/qa/hanako/B07-SH03-r2/*_capzone.png`.
- Stills: `out/HANAKO-SHORT/stills/{1940,1946,1952,1994,2022,2040}.png` (copies in `out/qa/hanako/B07-SH03-r2/`).

Measured:
- Caption zone (`scripts/caption-zone.py`, band y 860–1248), six frames, all pass (`out/logs/boss-b07-r2-caption-zone.json`). Mean 0.129–0.178 (limit 0.25). p95 0.125–0.212 (limit 0.40); the F1940 p95 of 0.212 is the rising card's bottom in the band.
- Lead (card as subject; no character in this shot): 814 px tall at rest = 42.4 % of 1920, the minimum across F1940–F2040. 855 px at the push end. Both above the 480 px rule.
- Legibility: at 2× and at sheet size the title, tagline and credits read as smears. Visual judgement only, no OCR.
- Text on the card: only «ยุค 90» (DATE). No `1995` in `src/painted/shots/hanako.tsx` or `src/painted/hanako/generations.tsx`. The channel label «ทำไมล่ะ» at top-left of every frame is scene chrome (`defaultChrome` in `src/scenes/media.ts`), not part of this change.
- Visual note: the card's top 150 px sit above the backdrop rectangle (its top is at y 180), so they show on the base plate colour. Left as is: the backdrop is outside this change.

Commands and logs (`out/logs/`):
- `npm run typecheck`: exit 0 (`boss-b07-r2-typecheck.log`). `eslint` on the two changed files: exit 0 (`boss-b07-r2-lint.log`).
- `npm run lint`: 0 errors, 3 warnings, all pre-existing in `src/painted/hanako/look*.tsx` (`boss-b07-r2-lint-full.log`).
- `npm test`: 247 pass, 0 fail (`boss-b07-r2-test.log`).
- `node scripts/render.mjs HANAKO-SHORT --stills --frames=1940,1946,1952,1994,2022,2040 --gl=angle --timeout=180000`: exit 0, one Chrome, six stills (`boss-b07-r2-stills.log`).
- `python3 -I scripts/store.py archive --path out/qa/hanako/B07-SH03-r2 --project HANAKO --kind previews/B07-SH03-r2`: 16 archived.

## Unverified
- Studio: cold load, play/pause, backward scrub and unordered seeks not run. The `<Img>` readiness in Studio is untested. The render stills did wait for the image.
- Sequence: no F−1/F/F+1 sweep at F1940 (hard cut from B07-SH02) or F2046 (dissolve to B08-SH01). No contact sheet per second. Neighbours B07-SH02 and B08-SH01 not rendered (B08 untouched, per instruction).
- B05 and WORLD FOG: no before/after pixel baseline. The changed symbols (`FILM_CARD`, `filmPosterBox`, `FilmPoster`, `paintPoster`) have one consumer, the B07-SH03 branch of `shots/hanako.tsx` (grep). No B05 code path changed.
- Full video render: not run, by instruction. Sound: not touched.
- Colour: the scan went through ffmpeg (yuvj444p to RGB). Not compared numerically to the scan.
- Rights: the flyer is the user's; copyright responsibility is the user's (sidecar). Not reviewed by Boss.

## Open questions
- **Q1 (resolved, r2).** The disclaimer label stays removed, no replacement.
- **Q2.** Is a 590 × 843 card acceptable, with its top clipped about 28 px at the push end (F2040 and the last frames of the push), so it clears the band? The 570 × 814 card is the fully-visible maximum.
- **Q3 (resolved, r2).** Copy-mid-left blur stays. Title sigma 12 stays.
- **Q4.** The F1994 stamp event is gone. The VO cue «ฮานาโกะซังก็มีหนังของตัวเอง» still spans F1994–F2066. Film or Mark should decide whether a replacement beat (hold, pulse or camera) is wanted.
- **Q5 (addressed, r2).** DATE moved to x 40 (same y). It overlaps the card's outer left margin for 85 px and covers no ghost or mask face. Confirm, or name another spot.
- **Q6.** At 7:10 the flyer fills the box, so no letterbox bars are visible. The contain-fit code path stays. Any visible dark side bars would need a narrower card, which conflicts with the size request. Confirm.

## Follow-up owners
- **Mark:** B07-SH03 in `scripts/hanako/short/scene-sheet.md` still describes the generic doodle poster, the 1995 stamp at F1994, and the acceptance "poster generic". `scripts/hanako/short/review-rows.json` (B07-SH03 `seen` and `flag`) has the same wording. Both files are modified in the working tree by another session. Boss did not edit them (per instruction).
- **Film:** brief decision VD10 (1995 film card) and FQ4 (B07-SH03 poster) need the real-flyer decision, the enlarged card and the removed F1994 event.
- **Coordinator:** republish the storyboard review page after Mark's revision.
- **Editor:** no timeline change (B07-SH03 range and cues unchanged).

## Re-run
- Redaction (unchanged): `python3 -I scripts/hanako/short/poster-redact.py` writes `out/hanako/film-card-poster-redacted.png` and its `.json`. A changed region means a new store file, not an overwrite (`store.py` refuses different bytes at an existing path). Then `store.py put` and `store.py use ... --episode hanako --replace`.
- Shot stills: the command above.

---

# r3 (31 Oct 2026): the 1995 poster replaces the 1998 flyer

- Revision: r3, user decision (new-poster option A from Boat's P2b, `signoff-boat-r5.md`). Supersedes the r2 card (570 × 814 at x 255) and the 1998 redaction. r2 stays as history: its store files and its `poster-redact.py` preset (`1998-r2`) are kept.
- Status: asset, lock and shot code built; r3 stills and caption-zone checks done. Not Studio-verified, not sequence-verified, not adopted by Film or Mark.
- Checkout: `claude/hanako-next-437b9b` on `f8788d1`, uncommitted work kept, nothing committed or pushed. `scene-sheet.md`, `review-rows.json` and sound not edited.

## Files

| Item | Path (store root `~/ReelsStore`) |
| --- | --- |
| Source (user, unchanged) | `projects/legacy/HANAKO/references/user/2026-10-31_b07-film-poster-toire-no-hanako-san-1995.jpg` (1000 × 1500) |
| Derived (r3) | `projects/legacy/HANAKO/reference/2026-10-31_b07-film-card-poster-1995-redacted.png` (1000 × 1500, 502 KB) + `.json` sidecar (regions, sigmas, source sha256 `48467f6b…`) |
| Lock | `public/images/hanako/film-card-poster-1995-redacted.png` → the derived file (sha256 `75809926…`) |
| Script | `scripts/hanako/short/poster-redact.py --poster 1995-r3` (presets `1995-r3`, `1998-r2`; `1998-r2` regions unchanged) |
| QA set | `projects/legacy/HANAKO/previews/B07-SH03-r3/` (20 files) |

Superseded: the 1998 derived file stays in the store (immutable) and its lock entry and `public/` cache copy are removed.

## Redaction (1995 scan, source px, feather 6 px inward)

| Region | Box x0,y0 – x1,y1 | Sigma | Content |
| --- | --- | --- | --- |
| `tagline-top` | 690,−10 – 1010,660 | 20 | あっ 花子さんだ…。 (top right) |
| `title-lockup` | −10,1070 – 420,1480 | 20 | red-framed トイレの花子さん, the Hanako-san romaji, the frame's bottom line |
| `credits-logo` | 760,1190 – 1010,1510 | 12 | staff and cast block, 百年松竹 logo |
| `child-face` | 436,530 – 542,728 | 6 | the child's hair, eyes, nose, mouth and chin |

Pixels touched 470,256 (31.4 % of the scan); 463,548 at ≥ 50 % blur. Keyhole, door, handle, cardigan and the reflection are outside every region.

Deviation from the brief: tagline and title at sigma 20 (brief: 12). At sigma 12 the tagline column and the title kanji stayed legible at 1× (read in the 1× crop). At sigma 20 both are unreadable at 1×. Credits at 12 are unreadable at 1×.

Iteration (kept for the record): the first face box (y 505–650) missed the lower face. A 2× grid crop put the eyes at source y ≈ 645 and the mouth at ≈ 697, so the box moved to y 530–728. The first title box stopped short of the frame's bottom line and of the romaji's left end (x 60 → −10, y1 1440 → 1480).

## Child's face

- Sigma 6 (brief). At 2× the eyes, nose and mouth are soft blobs; the head shape, hair and posture remain, so the figure still reads as a child peeking through a door. At the 540 view and at 1× the face is not legible. Identifiability is a judgement: Q3.
- The white door edge sits just outside the face box; the cardigan's upper edge at the chin is softened by the feather.

## Card (r3)

| Item | Value |
| --- | --- |
| Card box (stage px at posterY 0) | x 270–810 (540), y 30–840 (810), 2:3; the flyer fills it, no bars |
| Share of frame height | 810 / 1920 = 42.2 % at rest; 850.5 px = 44.3 % at s 1.05 |
| Ink outline | 1.5 px outside the box (static, as r2) |
| Caption band at the push end | ink bottom screen y 854.3 at s 1.05 (computed: 585 + (841.5 − 585) × 1.05), 5.7 px above band y 860; ink top y 0.7 (in frame) |
| Ceiling | 543 px wide with the top at y 30 (ink bottom 859.1). 540 chosen: the brief's example, with margin |
| Slide | unchanged: posterY 400 → 0 over F1940–F1952 |
| Band overlap while rising | ink bottom in band F1940–F1947 (8 f, r2 had 9); clear from F1948 (computed 856.3) |
| F1941 subtitle margin | card ink bottom 1149.5 (computed); subtitle text rows 1176–1220 (r2 measure): ~26 px clear. Full-res strip confirms |
| Lead | 810 px rest, 850 px push end (≥ 480 px, the r2 check) |
| DATE «ยุค 90» | unchanged at x 40, y 430–500, from F1941. It sits over the backdrop and the flyer's black left margin (stage x 270–340). Clear of the triangle (stage x ≥ 415 across y 430–500), the boy's face (≥ 506) and the door edge (≥ 562) |
| SetLight, projector pulse, camera, Thai VO and cues | unchanged (SetLight .18, pulse F2022–F2024, camera s 1 → 1.05, focus y 585) |

No year, title, stamp or disclaimer on the card. No new label. No `1995` text in code (grep on both shot files).

## Colour (Film VD03 red rule)

- Code: the derived file is the scan with regions blurred; nothing recolours the card.
- Sampled (F1952 still against the derived source, matched areas: 9 × 9 stage px ≈ 17 × 17 source px), six points: within about 2 levels (cardigan, title red included).
- The shared frame look applies over the card as over all picture: the `Grade` radial darkening (0.38 at the ellipse edge), `SetVignette` and `Grain`. Computed (not sampled): about 16 % Grade alpha at the card's top-left corner, plus about 7 % vignette. The cardigan and the title are outside both: Q1.
- No red label or glow added. The blurred title keeps a soft red haze of the poster's own colour inside the card box.

## Shot code (r3)

- `src/painted/hanako/generations.tsx`: `FILM_CARD` (box 270/30/540/810, src `film-card-poster-1995-redacted.png`, ratio 2/3) and doc comments. `FilmPoster`, `filmPosterBox` and `paintPoster` unchanged in code.
- `src/painted/shots/hanako.tsx`: comments only (DATE and the stamp note). No code change in r3; no B05 or B08 code touched.
- `src/videos/hanako/assets.lock.json`: 1998 entry removed, 1995 entry added through `store.py use` (it re-reads the lock; Editor's entries untouched).
- `public/images/hanako/film-card-poster-redacted.png` (1998 cache copy) deleted (gitignored; the store keeps it).
- `scripts/hanako/short/poster-redact.py`: presets (untracked file).
- `docs/dev-findings/DF-20261031-painted-raster-card.md`: r3 revalidation line; r2 values marked superseded.
- `scripts/hanako/build-notes.md`: r3 bullet.

## Evidence

Commands and logs under `out/logs/` (`boss-b07-r3-*`):
- `npm run typecheck`: exit 0.
- `eslint` on the two changed files: exit 0. `npm run lint`: 0 errors, 3 warnings, all in `src/painted/hanako/look*.tsx` (pre-existing).
- `npm test`: 248 pass, 0 fail (r2: 247).
- `node scripts/render.mjs HANAKO-SHORT --stills --frames=1940,1946,1952,1994,2022,2040 --gl=angle --timeout=180000`: exit 0, no warnings. Extra frames 1941 and 1948 (Film's F1941–F1948 condition), same command: exit 0.
- Stills: `out/HANAKO-SHORT/stills/{1940,1941,1946,1948,1952,1994,2022,2040}.png`; QA copies in `out/qa/hanako/B07-SH03-r3/`.

Caption zone (`scripts/caption-zone.py`, band y 860–1248; limits mean 0.25, p95 0.40): 8 of 8 pass.

| Frame | f | posterY | mean | p95 |
| --- | --- | --- | --- | --- |
| F1940 | 0 | 400 | 0.124 | 0.169 |
| F1941 | 1 | 308 | 0.135 | 0.160 |
| F1946 | 6 | 50 | 0.134 | 0.125 |
| F1948 | 8 | 14.8 | 0.134 | 0.125 |
| F1952 | 12 | 0 | 0.134 | 0.125 |
| F1994 | 54 | 0 | 0.147 | 0.172 |
| F2022 | 82 | 0 | 0.178 | 0.193 |
| F2040 | 100 | 0 | 0.147 | 0.172 |

(r2 F1940 p95 was 0.212; the card now clears the band one frame earlier.)

Sheets (viewed):
- Labelled, 8 tiles, preview labels: `out/qa/hanako/B07-SH03-r3/sheet-B07-SH03-r3-F1940-2040.png`
- `scripts/qa-sheet.sh`, 270 px, 4 × 2: `out/qa/hanako/B07-SH03-r3/qa-sheet-B07-SH03-r3-F1940-2040.png`
- Full-res card, F1952 (600 × 880 crop, x 240–840, y 0–880): `out/qa/hanako/B07-SH03-r3/B07-SH03_F1952_card-full-1x.png`
- Full-res band edges: F1941 subtitle margin (y 1080–1260) above F2040 band edge (y 760–900): `out/qa/hanako/B07-SH03-r3/B07-SH03_F1941-F2040_band-edge-1x.png`
- Store copy: `projects/legacy/HANAKO/previews/B07-SH03-r3/`

## Unverified

- Studio: cold load, play/pause, backward scrub and unordered seeks not run. The render waited for the image; Studio `<Img>` readiness untested.
- Sequence: no F−1/F/F+1 sweep at F1940 (hard cut from B07-SH02) or F2046 (dissolve to B08-SH01); no per-second contact sheet of the composition; B07-SH02 and B08-SH01 not rendered.
- B05 and B08: code-level only. The changed symbols have one consumer (the B07-SH03 branch of `shots/hanako.tsx`); no pixel before/after baseline exists for this checkout.
- Full video render and sound: not run, not touched.
- Identity: Boat's P2b check on the unblurred original is not done. The scan's credits name 松岡錠司 and 松竹 (sidecar); the title and year are not on the card.
- Rights: the user's responsibility (sidecar).

## Open questions

- **Q1 (Film).** Accept the shared frame `Grade`, `SetVignette` and `Grain` over the card? Measured: within about 2 levels at the red points; computed: about 16 % Grade alpha at the card's top-left corner. If not accepted, Boss adds a layer above `Grade` for the card only (a look change; Film decides).
- **Q2 (Film, user).** Tagline and title at sigma 20, not 12 (reason above). Confirm.
- **Q3 (user, Film).** Child's face at sigma 6 reads as a child and is not legible at 540 or 1×. Confirm, or raise to 8 (one-line change).
- **Q4 (Boat).** P2b identity of the 1995 poster against the credits on the unblurred scan. The narration «พอกลางยุค 90…» stays. The card needs no fact label.
- **Q5 (Mark, Film).** `scene-sheet.md` and `review-rows.json` still describe the old doodle and the 1995 stamp. Not edited (brief). The F1994 hold question (r2 Q4) stays open.
- **Q6 (Film).** DATE at x 40 now overlaps the flyer's black left margin for 70 px (r2: 85 px). Confirm, or name another spot.
