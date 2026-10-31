# Boss G2 — HANAKO-SHORT SCENE-R3

31 Oct 2026. Base `59ef2a2` + preserved G1 working tree; FILM-R4 / voice lock v3. Scope: B04-SH01, B05-SH01, B05-SH02, B06-SH01, B06-SH02, 1080×1920 / 30 fps. **Five production plates implemented; visual done is not claimed.** Source hashes and evidence: `out/qa/hanako/g2/`.

## Assets and handoff

- Added `HANAKO-` plate IDs matching the five shot IDs to the existing `hanakoShots` export/painted registry. Global start/duration frames: **645/255, 900/116, 1016/156, 1172/177, 1349/239**. Shot-local seconds drive camera, props and events. `HANAKO_G1` is retained; `HANAKO_G2`/`HANAKO_SPECS` extend the standalone QA entry. No `Root.tsx` edit, video registration or episode timeline assembly.
- Hardened Film's owning modules in place: `look.tsx` exports LF02 paper-cut panels with blunt asymmetric masonry fragments, torn overlap and hard-fill panel B; `look-r3.tsx` exports LF04 blank ruled pages and LF05 Natural Earth map. No second copy of the look art. LF04 uses SCENE-R3 coordinates directly, hard page fills and no lower-right bleed smudge. Existing G1 Noto Sans JP/Thai local fonts serve tags, date, callout and exact Japanese book credit.
- Extended `assets.ts`: CABINET, shared index-pinch anchor inversion, continuous grey cardigan sleeves, cover/page turns and BOOK-SPREAD. Drawer opens F903–921, tab flicks F951/967/983. Cover F1027–1041; page turns F1078–1088 and F1100–1110; hand is gone before the stop. Pages contain only evenly spaced rules. Book marks are reconstructed, illegible vertical strokes; no victim or Hanako figure.
- Map pin F1256–1264, single ring F1264–1276, callout/date F1296–1304. Screen-space leader uses `toScreen(camera, pinHead)`; sea dim remains outside the push. Book lamp ramps 0→.3 at F1430–1460, credit fades F1502–1508. Plate-owned Grade/Grain, vignette and labels are mounted in Overlay.
- CH-KID polish remains deferred and its G1 implementation is unchanged. Audio/SFX, captions, incoming B06-SH02 15-frame dissolve and neighboring shots belong to Editor; these silent plates add none of them.

## Rendered measurements

Viewed all five `scripts/qa-sheet.sh` sheets below, covering 1 Hz, endpoints and selected event-adjacent frames. Corresponding `*-labelled.png`/`*-manifest.tsv` identify SCENE-R3, shot, global F and local f. Final summary: `G2-summary.png`.

| Shot | Viewed sheet under `out/qa/hanako/g2/` | Frames | Caption mean max | p95 max | Lead height |
| --- | --- | ---: | ---: | ---: | --- |
| B04-SH01 | `B04-SH01-sheet.png` | 21 | .133 | .135 | N/A: no person |
| B05-SH01 | `B05-SH01-sheet.png` | 22 | .143 | .146 | N/A: POV hands |
| B05-SH02 | `B05-SH02-sheet.png` | 30 | .142 | .159 | N/A: POV hand |
| B06-SH01 | `B06-SH01-sheet.png` | 21 | .162 | .181 | N/A: map |
| B06-SH02 | `B06-SH02-sheet.png` | 21 | .151 | .157 | N/A: book |

- Caption band y860–1248: **115/115 pass**, mean≤.25 / p95≤.40 (`caption-zone.json`). There is no body lead to measure against 480px; explicit per-shot N/A entries are in `lead-height.json`.
- LF04 stop F1127: projected page y243.08–797.68, folder bottom **826**, tab top **160.48**. Viewed `blank-page-crop.png` at native crop resolution: rules only, no smudge. F1127 versus F1171: **0 changed RGB channels**, byte-identical PNG. Independent repeat of F1127 also byte-identical (`repeat-f111.png`, `pixel-checks.json`); repeatability of other shots is unverified.
- Map coastline data at s1.30: top ≈**60px**. Local-font measurement of default channel label: x60–145.27, y60–105 (`chrome-label-bounds.json`); coastline in the top 100px is around x690–736, horizontally clear. This is a projection/default-label check, not assembled chrome/platform UI proof; paint bleed is excluded from the coastline bounds.
- Five full silent motion clips, `*-motion.mp4`, rendered with `--gl=angle`; **943 frames** total. `motion-metadata.json` records dimensions/fps/counts. Five representative stills have **0 RGB-zero pixels**. Typecheck passes; lint **0 errors / 3 existing look hook warnings**; relevant tests **9/9 pass**. Logs: `out/logs/hanako-g2-*`.

## Limits and art still needing judgment

- **Still geometric:** the house and stall are deliberate paper-cut silhouettes; cabinet/folder silhouettes are rectangular; hands use the kit's polygon palm/capsule fingers; book is a flat spread with regular stroke columns. Drawer depth, cover/page turns are 2D projected geometry, without simulated paper curl. These areas can still read schematic, especially the drawer and book. No claim of a finished visual-quality verdict.
- No Studio cold-load/playback/backward scrub, continuous human/video playback review, exhaustive adjacent-frame jump check, assembled dissolve/neighbor continuity, subtitle/chrome integration, platform UI or audio/listening/mix proof. Full clip export is not evidence that those checks passed. LF02/LF04 look-only compositions were changed through their owning functions but not separately rendered; G1-only shots were not rerendered. G1's earlier CH-KID repeatability limitation is unchanged.
- Reproduce: `node scripts/hanako/render-g1.mjs --g2` (add `--motion` for clips); `python3 -I scripts/hanako/measure-g1.py --g2` (add `--sheets` for raw sheets/manifests). Label sheets with the existing `scripts/zombie-condo-paint/label-sheet.py` helper. Run `scripts/caption-zone.py --band 860:1248` on `B*-f???.png`. No commit, push or PR created.
