# EDU-EP20-SHORT delivery QA

Revision: EDU-EP20-DELIVERY-QA-R1, 2026-11-16; Editor continuation audit.

## State and authorization

The user answered `ผ่าน` after Final v4 (all 11 shots, SS-R5 with W6.2 caption split). This audit inspected the current workspace and completed the interrupted W7/W8 verification; it did not resume the prior provider session. No source picture, narration, sound mix or caption timing was changed. No new video render, unpin, repaint, cover selection, posting or commit occurred.

W7 is complete: 11/11 A_fade scene pins, all timestamped 2026-11-16T14:22:28.165Z. Evidence: `out/qa/edu20/w8-delivery/pins.txt`; scene keys are also in the cache's pins.json. Prior delivery log `out/logs/edu20-w8-delivery.log` reports **0 painted, 11 reused**, 37.67 s, successful export and archive. The closing Puppeteer Target.closeTarget warning occurred after successful export/archive; the file decodes to all 1619 frames.

W8.1 and W8.2 are complete. After this initial Editor audit, the user selected P5 and then A-follow-you (`ตามคุณ` / `ใช่ไหม?`); the coordinator published that exact checked cover. The publish package now has MP4, cover PNG, `publish.json` and `history.tsv`, with status `ready`. W8.3 posting is not authorized. The earlier video-only `ready` state is superseded by this complete package.

## Video, sound and identity

- Published video: `$REELS_STORE/publish/edu/EDU/EDU-EP20-SHORT/EDU-EP20-SHORT.mp4` (this checkout: `/Users/mangkornkatawong/ReelsStore/publish/edu/EDU/EDU-EP20-SHORT/EDU-EP20-SHORT.mp4`).
- Immutable source: `projects/edu/EDU/renders/EDU-EP20-SHORT/c420a2cf7d96-dirty-202611162123/EDU-EP20-SHORT.mp4`.
- Local delivery: `out/EDU-EP20-SHORT/EDU-EP20-SHORT.mp4`, also `_A_fade.mp4`. Local and published SHA256: `dfb51c873a1a72d5297ea112803e4fb4c9b429fc2db5eca2cd058972d8a90779`; bytes equal. Final publish reason records both explicit cover picks; the approved video hash is unchanged.
- Fresh ffprobe: H.264, 1080x1920, 30/1 fps, 1619 video frames, 53.966667 s; AAC 48 kHz stereo, 53.952 s. All 9 files in the EP20 asset lock match their SHA256.
- Fresh FFmpeg ebur128: **-14.0 LUFS integrated, 2.4 LU LRA, true peak -1.5 dBFS** (`out/logs/edu20-w8-loudness-current.txt`). The render's loudnorm meter reports -14.1 LUFS / -1.5 dBTP; both satisfy the project's about -14 / TP <= -1 target. Different meters give different LRA (render 4.2); neither is claimed as a listening pass.
- Fresh sound-cues gate: 7 cues, all generated, 0 library, 0 swaps. Fresh mix-levels: exit 0, 0 FAIL. Warnings remain: B05 background speech dV 14.4 within 2 LU tolerance; bed/ambience may vanish on small speakers. The mix-levels report measures unnormalized source stems, not the encoded delivery; delivery peaks above are from the MP4.
- The delivery reuses all 11 pinned scenes. The prior all-frame delivery-versus-Final PSNR report compares 1619 frames, minimum 51.63 dB, with last black frame identical. Re-encoding means the files and most decoded pixels are not byte-identical; this is not evidence of changed staging. Comparison log: `out/logs/edu20-w8-psnr.txt`.

## Inspected pictures and geometry

Viewed these `qa-sheet.sh` sheets at 270px tile width:

1. `out/qa/edu20/w8-delivery/sheet-delivery-shots_G35-130-270-420-600-775-920-1045-1180-1300-1501-1618.png`: one representative frame for each of the 11 story shots, plus final black.
2. `out/qa/edu20/w8-delivery/sheet-delivery-ending_G1501-1579-1600-1618.png`: settled passenger/balloon, fade and black.
3. `out/qa/edu20/w8-delivery/sheet-delivery-capzone_G281-310-1180.png`: the two L03c cues and the other CLOSE shot, with the safe-box/band overlay. The caption glyphs lie on dark floor; the pale cabin wall occupies the left of the measured band.

The QA media archive is `projects/edu/EDU/previews/ep20/w8-delivery/` (54 newly archived media, 1 already stored, 0 unarchived). All three sheet filenames above exist there unchanged. Measurement tables persist below; JSON/log files in out are reproducible caches rather than archived media.

Actual sample mapping for composition `EDU-EP20-SHORT`, SS-R5 / SCRIPT-R2 with W6.2 caption split, first sheet in reading order:

| Scene | Shot | Global frame |
| --- | --- | --- |
| 1 | B01-SH01 | G35 |
| 2 | B01-SH02 | G130 |
| 3 | B01-SH03 | G270 |
| 4 | B02-SH01 | G420 |
| 5 | B03-SH01 | G600 |
| 6 | B03-SH02 | G775 |
| 7 | B04-SH01 | G920 |
| 8 | B04-SH02 | G1045 |
| 9 | B05-SH01 | G1180 |
| 10 | B05-SH02 | G1300 |
| 11 | B05-SH03 | G1501 |

G1618 is an additional final-black sample. These are decoded delivery frames, not placeholders or new user approvals.

Fresh current-source geometry via the existing `out/edu20-w53/measure-shots.ts` matches W6: A 734.8-745.2px; D 781.3-792.3; DR 780.3-791.3; CLOSE0 1086.7-1102.1; CLOSE1 1093.4-1108.9; LOW0 856.2-868.3; LOW1 911.6-924.4. No geometry edit was made. Output: `out/qa/edu20/w8-delivery/shots-geometry-current.json`.

G1618 signalstats is exact limited-range black (YMIN=YMAX=YAVG=16, U=V=128). Evidence: `final-frame-levels.txt` in the QA folder.

## Caption measurement

The interrupted broad white-pixel scan misclassified pale cabin walls in 9 CLOSE-shot cue frames. It is preserved as `caption-ink-superseded-false-wall-detection.txt`, not used as a verdict. The reusable episode helper `scripts/edu-series/ep20/measure-delivery-captions.py` instead scans the actual caption rows y1100-1260 with all three RGB channels >=248, excluding the shoes/white labels above the captions. It adds a conservative full 14px on every side for the outline. All **35 text cues pass** the x120-888 / y140-1344 box; fill overall x218-862, y1168-1233; expanded overall x204-876, y1154-1247. The helper was run on real delivery frame PNGs, without PIL, NumPy or new dependencies:

```bash
python3 -I scripts/edu-series/ep20/measure-delivery-captions.py \
  --frames-dir out/qa/edu20/w8-delivery/frames \
  --output out/qa/edu20/w8-delivery/caption-measurements.json
```

`caption-zone.py` was also run on G35/G270/G600/G1180/G1501 (`caption-zone.json`) and wrote the viewed overlays. Its raw statistics include the white glyphs, producing p95 about .99; its ink-centre scan y800-1400 includes white shoes/labels at y809. Those raw brightness/centre failures are measurement contamination, not caption overflow. The helper reports remaining band background after excluding the fill rectangle plus outline; this does not reconstruct pixels behind the glyphs. CLOSE backgrounds retain p95 **0.781** from the pale wall, while most other bands have p95 0.313. This is the prior Film judgment item, unchanged by delivery; do not mark it numerically passed. Readability was checked on the sheets and the user passed these Final shots.

In the following table, fill and outline boxes are `[left, top, right, bottom]`; background statistics exclude the outline rectangle within x120-888, y1150-1280.

| Cue | Frame | Fill box | Conservative outline box | Safe | Background mean / p95 |
| --- | --- | --- | --- | --- | --- |
| L01a | G10 | [455, 1177, 623, 1220] | [441, 1163, 637, 1234] | pass | 0.300 / 0.313 |
| L01b | G45 | [288, 1177, 792, 1233] | [274, 1163, 806, 1247] | pass | 0.288 / 0.313 |
| L02a | G96 | [280, 1168, 800, 1233] | [266, 1154, 814, 1247] | pass | 0.210 / 0.210 |
| L02b | G142 | [338, 1168, 741, 1233] | [324, 1154, 755, 1247] | pass | 0.210 / 0.210 |
| L02c | G174 | [399, 1178, 681, 1220] | [385, 1164, 695, 1234] | pass | 0.210 / 0.210 |
| L03a | G213 | [334, 1177, 743, 1220] | [320, 1163, 757, 1234] | pass | 0.271 / 0.781 |
| L03b | G254 | [385, 1184, 693, 1233] | [371, 1170, 707, 1247] | pass | 0.267 / 0.781 |
| L03c1 | G281 | [405, 1177, 674, 1233] | [391, 1163, 688, 1247] | pass | 0.267 / 0.781 |
| L03c2 | G310 | [286, 1178, 794, 1233] | [272, 1164, 808, 1247] | pass | 0.292 / 0.781 |
| L03d | G340 | [465, 1177, 614, 1220] | [451, 1163, 628, 1234] | pass | 0.261 / 0.779 |
| L04a | G356 | [503, 1184, 577, 1220] | [489, 1170, 591, 1234] | pass | 0.301 / 0.313 |
| L04b | G387 | [315, 1178, 765, 1220] | [301, 1164, 779, 1234] | pass | 0.296 / 0.313 |
| L05a | G439 | [336, 1177, 744, 1220] | [322, 1163, 758, 1234] | pass | 0.292 / 0.313 |
| L05b | G480 | [409, 1178, 673, 1220] | [395, 1164, 687, 1234] | pass | 0.290 / 0.313 |
| L06a | G517 | [396, 1178, 683, 1220] | [382, 1164, 697, 1234] | pass | 0.300 / 0.313 |
| L06b | G552 | [429, 1177, 651, 1220] | [415, 1163, 665, 1234] | pass | 0.298 / 0.313 |
| L06c | G580 | [308, 1178, 773, 1220] | [294, 1164, 787, 1234] | pass | 0.293 / 0.313 |
| L06d | G615 | [348, 1178, 729, 1220] | [334, 1164, 743, 1234] | pass | 0.292 / 0.313 |
| L07a | G660 | [281, 1168, 799, 1233] | [267, 1154, 813, 1247] | pass | 0.294 / 0.313 |
| L07b | G693 | [401, 1178, 675, 1220] | [387, 1164, 689, 1234] | pass | 0.289 / 0.313 |
| L08a | G741 | [267, 1168, 813, 1233] | [253, 1154, 827, 1247] | pass | 0.300 / 0.313 |
| L08b | G804 | [221, 1170, 857, 1233] | [207, 1156, 871, 1247] | pass | 0.293 / 0.313 |
| L08c | G836 | [399, 1178, 679, 1220] | [385, 1164, 693, 1234] | pass | 0.289 / 0.313 |
| L09a | G879 | [240, 1168, 837, 1220] | [226, 1154, 851, 1234] | pass | 0.302 / 0.313 |
| L09b | G936 | [311, 1177, 768, 1233] | [297, 1163, 782, 1247] | pass | 0.306 / 0.324 |
| L09c | G976 | [361, 1170, 720, 1220] | [347, 1156, 734, 1234] | pass | 0.301 / 0.313 |
| L10a | G1014 | [404, 1168, 673, 1220] | [390, 1154, 687, 1234] | pass | 0.302 / 0.313 |
| L10b | G1063 | [288, 1177, 792, 1220] | [274, 1163, 806, 1234] | pass | 0.290 / 0.313 |
| L11a | G1111 | [392, 1168, 687, 1220] | [378, 1154, 701, 1234] | pass | 0.266 / 0.781 |
| L11b | G1157 | [320, 1171, 759, 1220] | [306, 1157, 773, 1234] | pass | 0.277 / 0.781 |
| L11c | G1206 | [400, 1177, 681, 1220] | [386, 1163, 695, 1234] | pass | 0.266 / 0.781 |
| L11d | G1249 | [303, 1168, 777, 1233] | [289, 1154, 791, 1247] | pass | 0.296 / 0.781 |
| L12 | G1302 | [234, 1177, 844, 1233] | [220, 1163, 858, 1247] | pass | 0.284 / 0.313 |
| L13a | G1357 | [250, 1168, 830, 1220] | [236, 1154, 844, 1234] | pass | 0.297 / 0.313 |
| L13b | G1456 | [218, 1170, 862, 1220] | [204, 1156, 876, 1234] | pass | 0.295 / 0.313 |

## Checks and limits

Installed-package preflight: `npm ls --depth=0` and `npx remotion versions` completed, all Remotion packages have the correct version; logs `edu20-w8-npm-ls.txt` / `edu20-w8-remotion-versions.txt`. The helper passed its real-input smoke check (35 cues, 0 outside). No runtime scene change was made, so no repeated full test suite was run. Coordinator owns context-map registration and the TL01 build-notes entry for the helper.

This audit viewed stills and measured encoded files; it did not watch continuous video, scrub Studio, rerun backward seek, listen to the full mix, judge pronunciation or hear the L13 splice at 44.401s. The user passed the Final tab; do not infer which listening actions they performed from the one-word approval. Prior seek evidence remains in the W6/Boss notes, not a new audit result. Film's pale-wall judgment and Ton's may-vanish warnings remain open owner notes. No new blocking technical finding was found.

## Final package verification — coordinator, 2026-11-16

Selected cover `EDU-EP20-SHORT_cover.png` is 1080×1920, SHA256 `34779a0fd7f2dfebcba13ebae8e59de52dcabd953de6ae7427b8069cdc0a7592`, identical to immutable `projects/edu/EDU/covers/ep20/pick2/frames/A.png`. Both published file hashes match `publish.json`; MP4 hash remains unchanged. User picks are recorded in `cover-pick1.md` and `cover-pick2.md`; Boat and independent Film checks both passed 5/5. The selected cover versus the actual published G0 was checked on a 270px sheet; shared subject/setup and the early prediction promise match. Evidence is archived under `projects/edu/EDU/previews/ep20/delivery-package/`. No new video render or audio change occurred.
