# DF-20261031-painted-raster-card — a real raster poster cannot go through the p5.brush canvas; painted shots mount it as a camera-mapped DOM image

- Owner: Boss; first observed: 2026-10-31 (HANAKO-SHORT B07-SH03 FILM-CARD, user's real flyer); last checked: 2026-10-31 (`claude/hanako-next-437b9b` working tree on `f8788d1`)
- Status: workaround
- Type: tool-limitation
- Tags: 2D / painted / camera / tooling / asset
- Scope: `src/painted/hanako/generations.tsx` (`FILM_CARD`, `filmPosterBox`, `FilmPoster`, `paintPoster`); `src/painted/shots/hanako.tsx` (B07-SH03 Overlay); `scripts/hanako/short/poster-redact.py`; `public/images/hanako/` (locked in `src/videos/hanako/assets.lock.json`, git-ignored)
- Consumers: HANAKO-SHORT B07-SH03 (FILM-CARD). Film brief and Mark scene sheet not yet revised for the real flyer (see Planning impact); no other shot imports the changed symbols.

## Symptoms and evidence
- Desired: the user's flyer on the painted card, moving with the shot camera (s 1.00 → 1.05, focus (540, 585)) and the card slide (posterY 400 → 0 over F1940–F1952).
- Observed: `src/painted/BrushCanvas.tsx` and `src/painted/p5-brush.d.ts` have no image draw call, and painted code draws only through `ctx.brush` ([painted-2d skill](../../.claude/skills/painted-2d/SKILL.md)). No painted shot had drawn a raster image before this change.
- Observed: `CameraLayer` (`src/painted/kit/camera.tsx`) is an SVG `<g>` with the camera transform, so an HTML `<Img>` cannot sit inside it.
- Workaround: `FilmPoster` is an HTML `<Img>` (Remotion, `staticFile`) rendered before the shot's `CameraLayer`. Its box is the `toScreen(camera, …)` image of the stage rectangle, so the same camera maps the flyer and the painted plate. The brush keeps the card shadow and one static ink edge.
- Coverage: stills F1940, F1946, F1952, F1994, F2022, F2040 (`--gl=angle`, one Chrome); caption-zone check on the same six frames (all pass). Studio cold load, play/pause, scrub and seek not run. No full-video render.

## Attempts and results
- Considered an SVG `<image>` inside `CameraLayer`: not used. The scene code uses Remotion `Img`, which waits for the bitmap; a bare SVG `<image>` is not wrapped by `delayRender` (not tested here).
- Chosen: the `<Img>` layer below `CameraLayer`. The SetLight glow stays above the flyer, as it did over the old painted card.
- Redaction is done once, offline (ffmpeg `gblur` mixed through feathered rectangles, `poster-redact.py`), so each frame draws a static bitmap. Runtime blur filters were not used.
- Result: 5 regions, 76,875 px touched (30.5 % of the 420 × 600 scan), 73,017 px at ≥ 50 % blur. Tagline and title use sigma 12; copy and credits sigma 6.

## Planning impact
- Film: a real raster card in a painted shot is a DOM layer under the camera. The brush keeps the frame, shadow and ink edge. Redact the store copy rather than blurring at runtime.
- Mark (r2 values; superseded by r3 below): FILM-CARD box was 570 × 814 px at x 255, y 30 (7:10, the flyer fills it, no letterbox bars). Its outline clears caption band y 860 at the end of the push (s 1.05, screen bottom 859). The card is 42 % of frame height and above the 480 px lead rule. A 700 px card would be 1000 px tall and would need its top at about y −155, so it cannot fit in frame. Card bottom is in the band for F1940–F1948 while it rises (posterY > 15). The DATE label moved to x 40 (overlaps the card's outer left margin only). The old 1995 stamp (F1994) and doodle are removed; the scene sheet still describes them.
- Follow-up: Mark revises B07-SH03 (real flyer, no title, year or doodle; the F1994 stamp event becomes a hold). Film confirms the real-poster decision in the brief. The coordinator republishes the storyboard review page after Mark's revision.

## Revalidation history
- 2026-10-31 / `claude/hanako-next-437b9b` (r1, 560 × 510 card) → six stills, caption-zone (6/6 pass), typecheck, lint (no errors), 247 tests pass → workaround.
- 2026-10-31 / `claude/hanako-next-437b9b` (r2, 570 × 814 card, DATE x 40) → six stills re-rendered, caption-zone (6/6 pass, F1940 p95 0.212), typecheck, lint (no errors), 247 tests pass → workaround. Not yet adopted by Film or Mark.
- 2026-10-31 / `claude/hanako-next-437b9b` (r3, 1995 Shochiku flyer 2:3 at 540 × 810, x 270, y 30; ink bottom at screen y 854.3 at s 1.05; DOM `<Img>` unchanged) → stills F1940–F2040 plus F1941/F1948, caption-zone (8/8 pass, F1940 p95 0.169), typecheck, lint (no errors), 248 tests pass → workaround. Not yet adopted by Film or Mark. Report: `scripts/hanako/short/boss-b07-poster-report.md` (r3).
