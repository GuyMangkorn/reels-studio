# HANAKO-SHORT — full render report (Editor, 31 Oct 2026)

- Deliverable: `HANAKO-SHORT`, format `short`, ending `A_fade` (registry: `endHoldSec` 0, `endFadeSec` 0), 9 scenes, 2596 frames (86.533 s), 1080x1920, 30 fps.
- Code state: `f8788d1a17c4-dirty-202610312212` (HEAD `f8788d1`, tracked files modified, not committed). Scene sheet R4 / script R2 / voice lock v3 as in `src/videos/hanako/index.ts`.
- Not committed or pushed. Plates, cues and sound not changed.

## Summary

- Run 1 (full render, scene cache empty): exit 0, wall 691 s, 9 of 9 scene segments rendered, 0 reused. Exported, normalized and archived.
- Run 2 (same command, unchanged): exit 0, wall 92 s, 0 of 9 rendered, 9 reused. Output MP4 SHA-256 identical to run 1.
- MP4 checks: 1080x1920 H.264 yuv420p, 30/1 fps, 2596 frames counted, AAC 48 kHz stereo; integrated -14.0 to -14.1 LUFS, LRA 4.2 LU, true peak -1.4 dBTP, 0 full-scale samples.
- Caption zone (19 sampled frames): all pass; mean 0.129 to 0.226 (limit 0.25), p95 0.119 to 0.334 (limit 0.40).
- Reference stills (19 frames, `reference-frames.py`): min PSNR against the MP4 48.1 dB (limit 35 dB).
- Per-scene samples: 9 actual Remotion stills at scene midpoints (native 1080x1920), filed with `manifest.tsv`.
- Overall: render complete and reproducible. Not listened to; not seen in Studio or on a phone. See "Unverified".

## Commands (cwd: worktree `hanako-next-437b9b`)

```
python3 -I scripts/store.py fetch            # out/logs/hanako-fetch.log: fetched 0, present 116, problems 0
python3 -I scripts/store.py verify           # out/logs/hanako-verify.log: 7287 stored, 116 locked, 0 problems
node scripts/render.mjs HANAKO-SHORT --gl=angle --timeout=180000     # run 1, log out/logs/hanako-render.log
node scripts/render.mjs HANAKO-SHORT --gl=angle --timeout=180000     # run 2, log out/logs/hanako-render-run2.log
node scripts/render.mjs HANAKO-SHORT --stills --frames=152,373,544,772,1036,1380,1816,2174,2448 --gl=angle --timeout=180000   # out/logs/hanako-samples-stills.log, 13 s
python3 -I scripts/reference-frames.py HANAKO-SHORT --mp4 "HANAKO-SHORT=<store MP4>"   # out/logs/hanako-reference-frames.log, 74 s
```

Flags: `--gl=angle --timeout=180000` added to the bare command. render.mjs documents them for painted episodes, and the E2 stills used them. The gl value is part of the segment cache key, so run 2 used the same flags. Run 1 status: `out/logs/hanako-render.run1.status`; run 2 status: `out/logs/hanako-render.run2.status`.

## Scene cache (run 1: all misses)

| Segment | Frames | Seconds | Result |
| --- | --- | --- | --- |
| 1 | f0-303 | 0.00-10.13 | rendered |
| 2 | f304-442 | 10.13-14.77 | rendered |
| 3 | f443-644 | 14.77-21.50 | rendered |
| 4 | f645-899 | 21.50-30.00 | rendered |
| 5 | f900-1171 | 30.00-39.07 | rendered |
| 6 | f1172-1587 | 39.07-52.93 | rendered |
| 7 | f1588-2045 | 52.93-68.20 | rendered |
| 8 | f2046-2301 | 68.20-76.73 | rendered |
| 9 | f2302-2595 | 76.73-86.53 | rendered |

Log line: `HANAKO-SHORT A_fade: 9 of 9 segments rendered, 0 reused`. Run 2: `0 of 9 segments rendered, 9 reused`. Segment cache: `$REELS_STORE/cache/segments/HANAKO-SHORT/` (9 segment files).

## Loudness and MP4 measurements

- Render log, after in-place normalization (run 1): `-14.1 LUFS, -1.4 dBTP, LRA 4.2` (was `-16.1 LUFS, -2.4 dBTP, LRA 4.3`; dynamic).
- Independent ebur128 on the archived MP4: integrated -14.0 LUFS, LRA 4.2 LU, sample peak -1.4 dBFS, true peak -1.4 dBFS.
- Clip check (decoded s16 at 48 kHz, 8,300,480 samples): max 27871, min -27602, full-scale samples 0.
- ffprobe: video `h264`, `1080x1920`, `yuv420p`, `r_frame_rate 30/1`, `nb_frames 2596`, `nb_read_frames 2596`, `duration 86.533333`. Audio `aac`, `48000 Hz`, 2 ch, `duration 86.514000` (19 ms shorter than the video stream). Full output: `out/logs/hanako-run1-ffprobe.txt`; EBU log: `out/logs/hanako-run1-ebur128.log`.

## Frame checks

- Sampled frames: 0, 150, ..., 2550 and 2595 (19 PNG). Extracted from the archived MP4 to `out/qa/HANAKO-SHORT/run1/frames/`.
- Caption zone (`scripts/caption-zone.py`, default band 860:1248, box 120-888 x 288-1248): 19/19 pass. Overlays: `out/qa/HANAKO-SHORT/capzone/`.
- Sheets viewed: every-5-s sheet (4x5 tiles, 270 px) and the F2595 / F0 seam sheet (540 px). Scene sample sheet viewed too.
- Seam F2595 → F0: hard cut, not a loop blend. F2595 shows the closing caption "ทุกครั้งที่ใครสักคน ยกมือขึ้นเคาะ"; F0 shows the opening caption "เคาะสามครั้ง... มีคนตอบ?". The ending is `A_fade` with no fade hold, so this is expected. A loop seam check applies only if this is later rendered as `C_seamless`.
- Sampled frames without a Thai caption: f0300 (only the on-screen Japanese sign), f0900, f1500, f1650, f2400. The caption source was not traced: `timeline.json` `subtitleCues` alone does not explain frame 0 (cue text empty, caption shown). Open for Editor/Film with the scene `subtitle` field.

## Per-scene samples (integration samples, render stills from this revision)

Midpoint frame of each scene's range, rendered as `--stills` at native size. Folder: `out/samples/hanako/HANAKO-SHORT/R4-f8788d1a17c4-dirty-202610312212/` (manifest.tsv with SHA-256).

| Scene | Frame | Local frame | Sample file |
| --- | --- | --- | --- |
| S01 (B01) | 152 | 152 of 0-303 | S01_B01_f0152.png |
| S02 (B02) | 373 | 69 of 304-442 | S02_B02_f0373.png |
| S03 (B03) | 544 | 101 of 443-644 | S03_B03_f0544.png |
| S04 (B04) | 772 | 127 of 645-899 | S04_B04_f0772.png |
| S05 (B05) | 1036 | 136 of 900-1171 | S05_B05_f1036.png |
| S06 (B06) | 1380 | 208 of 1172-1587 | S06_B06_f1380.png |
| S07 (B07) | 1816 | 228 of 1588-2045 | S07_B07_f1816.png |
| S08 (B08) | 2174 | 128 of 2046-2301 | S08_B08_f2174.png |
| S09 (B09) | 2448 | 146 of 2302-2595 | S09_B09_f2448.png |

Scene IDs B01-B09 follow the registry header order (one scene per beat). Frames are midpoints, not Mark's key frames; no key-frame choice was checked against the scene handoff. Contact sheet: `sheet-scenes.png` in the same folder.

## Store paths (asset store `/Users/mangkornkatawong/ReelsStore`)

- MP4 (run 1 archive, the delivered render): `projects/HANAKO/renders/HANAKO-SHORT/f8788d1a17c4-dirty-202610312212/HANAKO-SHORT.mp4` (SHA-256 `6b6709c4911d254ca974d313c32bc0c214b7a5a801805020103420a138ea91ad`, 25,101,198 bytes). Archive output run 1: archived 79, already stored 1 (the second MP4 name). Run 2 archive: archived 0, already stored 80 (identical bytes).
- Run 1 archive also filed the 78 E2 stills under the same label (`.../stills/`).
- E2 stills filed earlier by hand: `projects/HANAKO/stills-e2/` (78 files, `--project hanako` path; the store folder is case-insensitive, so this is the same folder). These 78 PNGs are now stored twice (here and under the render label), because archive dedupe is per render prefix.
- Reference set: `projects/HANAKO/reference/HANAKO-SHORT/f8788d1a17c4-dirty-202610312216/` (19 PNG, `hashes.tsv`, PSNR vs MP4 min 48.1 dB).
- Per-scene samples: `projects/HANAKO/samples/` (`S01_B01_f0152.png` … `S09_B09_f2448.png`, `manifest.tsv`, `sheet-scenes.png`). Older HANAKO sample files already there (different names) were not touched.
- QA sheets: `projects/HANAKO/qa-sheets/` (`run1-every5s-19frames.png`, `run1-seam-F2595-then-F0.png`); caption-zone overlays: `projects/HANAKO/qa-capzone/` (19 files).

## Sheet image paths (local, absolute)

- `/Users/mangkornkatawong/Developer/reels-creator/.claude/worktrees/hanako-next-437b9b/out/qa/HANAKO-SHORT/sheets/run1-every5s-19frames.png`
- `/Users/mangkornkatawong/Developer/reels-creator/.claude/worktrees/hanako-next-437b9b/out/qa/HANAKO-SHORT/sheets/run1-seam-F2595-then-F0.png`
- `/Users/mangkornkatawong/Developer/reels-creator/.claude/worktrees/hanako-next-437b9b/out/samples/hanako/HANAKO-SHORT/R4-f8788d1a17c4-dirty-202610312212/sheet-scenes.png`

## Unverified

- Audio content not listened to; only levels, true peak and clipping measured.
- Not seen in Studio or on a phone.
- Captions at the five uncaptioned frames not traced to their source.
- Scene samples are midpoint stills, checked only on the contact sheet; motion, continuity and key-frame choice not reviewed.
- Loop seam: not applicable to `A_fade`; not checked.
- Audio is 19 ms shorter than the video stream (AAC padding), not corrected here.

## Findings for the coordinator

- Store: E2 stills are filed twice (see above); archive dedupe is per render prefix. Not changed.
- Store: `--project hanako` created paths under the lowercase spelling; manifest rows show `projects/hanako/stills-e2`. The store is case-insensitive, so the folder is the same. Future archives should use `--project HANAKO`.
- The render's loudness log (-14.1 LUFS) and ebur128 (-14.0 LUFS) differ by 0.1 LU: different measurement passes; both within target.
