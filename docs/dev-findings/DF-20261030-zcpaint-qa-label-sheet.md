# DF-20261030-zcpaint-qa-label-sheet — labelled QA sheets need a text renderer (no ffmpeg drawtext here)

## Symptoms and evidence
- The worktree's ffmpeg (Homebrew) has no text filter: `ffmpeg -hide_banner -filters | grep -c drawtext` prints 0. ImageMagick is absent and `python3 -I -c "import PIL"` fails, so a frame cannot be labelled from the shell.
- `scripts/qa-sheet.sh` tiles frames without labels. The preview-label rule (`docs/boss-asset-workflow.md#preview-labels`) needs shot ID, clock and plate on each tile for a user sheet.
- Evidence: `out/qa/zcp-g1/G1-R26-plates-sheet.html` (pass 12, six 540 px tiles and a measured legend).

## Attempts and results
- Google Chrome is installed (`/Applications/Google Chrome.app`). A static HTML page with `<img>` tiles and labels, screenshot headless: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --hide-scrollbars --window-size=1704,2880 --screenshot=OUT.png file://PAGE.html`. Works offline; the page width must be wider than the grid (1620 px clipped the third 540 px column; 1704 px fixed it) and the height must cover the legend.
- Not tried: a Swift/AppKit text script (`/usr/bin/swift` exists).

## Planning impact
- Film/Mark: labelled sheets are a screenshot of an HTML page, not a `qa-sheet.sh` output. Name the tiles with the preview-label IDs; the sheet is the reviewer's view, not a delivery render.
- Boss: a repeated labelled sheet per group (G2–G5) should be scripted (HTML from a manifest, then Chrome) before the next group. Not done in pass 12; proposed to TL/DP.

## Revalidation history
- 2026-10-30, worktree `usage-check-agent-tuning-16bd9b` (uncommitted pass 12, G1): the sheet above rendered at 1704 × 2880 px with Chrome headless; checked by viewing the downscaled screenshot.
