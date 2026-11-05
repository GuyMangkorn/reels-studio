# Viewer check: EDU-EP01-SHORT W5.9, lying shoulder/blanket repaint

- **Checker:** Film, fresh viewer (did not paint), 5 Nov 2026. No code edits, no commit, no publish.
- **Checkout:** worktree `hanako-next-437b9b`, branch `claude/edu-ep1-continue-a8117c`, HEAD 05e5bfe plus uncommitted W5.9 changes in `src/painted/edu01/set.ts`.
- **Stills:** `node scripts/render.mjs EDU-EP01-SHORT --stills` (full size, 1080x1920), copied to `out/edu01/vc-w59/stills/`. Sheets and crops are in `out/edu01/vc-w59/sheets/` and `out/edu01/vc-w59/crops/`. The builder note was read only after Parts 1-3.
- **Result:** Part 1 PASS, Part 2 PASS (nits), Part 3 PASS (52.40 dB). **User complaint: resolved.** The hard-edged lilac rectangle beside the blanket is gone. The shirt now reads as a rounded shoulder under the turned-down sheet.

## Part 1: lying figure, blind (PASS)

| Shot | Frames | What a viewer sees |
| --- | --- | --- |
| S01-B08-SH01 | f1830, f1858 | A boy lying on his back under a blue blanket with a turned-down pale band. Beside the neck the lilac pyjama shows as a rounded shoulder that curves down toward the pillow. No box, no vertical back edge, and nothing stands up off the mattress. (`sheets/crop_a.png`, `sheets/zoom_shoulder.png`) |
| S01-B01-SH01 | f0, f60 | Same as f1858. It reads as a person asleep under a blanket. |
| S01-B01-SH02 | f130-160 | Close-up. The lilac shoulder in the lower right is rounded, and the corner of the sheet band slants over it. No slab. (`sheets/cu145_w58_w59.png`, w58 on the left, w59 on the right) |
| S01-B02-SH01/SH02 | f200, f250, f300 | Same clean shoulder at both scales. |
| S01-B03-SH05 | f560, f575 | Lying with the eyes open. Clean. |
| S01-B07-SH02 | f1600, f1620 | Lying awake. Clean. |

Before and after: `sheets/cmp_1830_w58_w59.png` shows the w58 version on the left, a lilac rectangle with a flat top, a square corner at the neck and a vertical back edge down to the bed, which is the user's "square back". The w59 version on the right has no such rectangle.

Remaining (nit): the turned-down sheet band is still a crisp parallelogram with straight edges and slightly sharp corners. It reads as folded cloth, not as a box, but it is the hardest-edged shape left in the bed area.

## Part 2: motion (PASS, nits)

- **Lie-back, S01-B08-SH01 f1795-1830, every frame** (`sheets/lieback_tile.png`; body-region PSNR from one frame to the next): the arc is smooth. PSNR runs 26-27 dB through the fast part (f1795-1809), rises steadily to 35 dB by f1816, and stays at 43-49 dB through f1830. No single-frame dip, so nothing pops. No block grows during the morph (`sheets/motion_zoom.png`, f1805, f1812, f1818). The blanket does not jump.
- **Rise, S01-B04-SH01 f575-605, every frame** (`sheets/rise_tile.png`): f578 to f579 is the hard cut from B03-SH05, which is expected. After the cut the PSNR falls and rises smoothly (22-30 dB during the move, 37-46 dB as it settles), with no isolated spike. The band fades out as the boy sits up, with no jump.
- **Nit:** in the middle of the rise (f584-f590) the blanket's head end is a near-vertical blue face standing between the pillow and the torso (`sheets/motion_zoom.png`, top right). It reads as blanket bulk, but it is the closest thing left to a "slab" in motion. It is unchanged from w58 (f590 is identical to w58 at 107 dB).
- **Seated frames unchanged vs `out/edu01/vc-w58/stills/`:** f605 116 dB, f650 113 dB, f700 105 dB, f1483 116 dB, f1530 113 dB, f1581 105 dB. f590 and f600 measure 107.6 dB, so they are unchanged too.

## Part 3: loop seam (PASS)

- f1858 vs f0: **52.40 dB** (w58 52.24 dB). The two lying frames match by eye (`sheets/crop_a.png`, top right vs bottom left).
- Neck/collar from W5.8: no regression. The neck is still one skin band, with no white collar wire and no skin spike. The small navy triangle between the hair and the neck in the close-up (W5.8 N2) is still there and unchanged (`sheets/cu145_w58_w59.png`).

## Builder note vs what I see

The note is "W5.9 repaint" in `scripts/edu-series/build-notes.md`. Its claims match the frames:
- The box is gone, the shoulder is a rounded contour, and the band slants over the upper arm: confirmed.
- "Start of the rise f579-590 changed": f580 differs from w58 (32 dB), and f590/f600 are identical. Consistent.
- The seated PSNR numbers fall within 1-6 dB of mine, all above 100 dB. Consistent.
- Seam 52.40 dB: the same as my measurement.
- I found no discrepancy.

## Ranked nits (none must-fix)

1. Mid-rise f584-590: the blanket's head end stands as a near-vertical blue face. It predates W5.9.
2. The turned-down sheet band has crisp straight edges and corners in every lying frame. It reads as cloth, but its corners could be softened.
3. Close-up f124-160: the small navy triangle between the hair and the neck (W5.8 N2) is still there.
