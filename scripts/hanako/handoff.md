# HANAKO-SHORT handoff (31 Oct 2026)

Written so a fresh session can continue without chat history. Source of truth stays in [delivery.md](delivery.md), the short/ files and [build-notes.md](build-notes.md); this page is the resume map.

## State

- Deliverable `HANAKO-SHORT` (Thai Short 9:16, one story scene, 9 beats, 14 shots). Tier **Full** (user, 31 Oct 2026). Length cap **90 s for the whole timeline** (user).
- Script `HANAKO-SHORT-SCRIPT-R2` (user-accepted; facts `verification-incomplete`, lead-only, known to the user).
- Film brief `HANAKO-SHORT-FILM-R4`. Scene sheet `HANAKO-SHORT-SCENE-R3` (`ready-for-dev`).
- Voice lock v3 (Gemini Charon, style S3, atempo 1.05, tail B05–B09 re-read): `short/voice-measure.json/.md`, timeline **2596 frames = 86.53 s**, hold [2506, 2596). Audio file `public/narration/HANAKO-SHORT.mp3` is **gitignored** (`*.mp3`) and exists only in the working checkout; the 30 fps envelope `public/narration/HANAKO-SHORT.amplitude.json` is committed. Rebuild path: `scripts/hanako/voice/` (copies of the builders; paths inside point at `out/hanako-voice/final/`, which is ignored; see build-notes). Backups of earlier locks were under `out/hanako-voice/final/lock-v1-hushed/` and `lock-v2-s3take1/` (local only).
- User review page: https://claude.ai/artifact/WUtWrNfhLn4cAj2XfM781p (SCENE-R3). **All 14 shots `ok`, Q1–Q4 `ok`, no notes** (31 Oct 2026): this approves SCENE-R3 and the look stills `LF04`/`LF05`, accepts glow (no eye), hook A and the 3.3 s door-only stretch after the glow. Rebuild with `python3 -I scripts/storyboard-page/build.py scripts/hanako/short/review-rows.json`; publish with `capabilities {"db": {}}` to the same URL.
- Voice not yet heard by the agents; the user listened to the lock v3 samples and chose it. Reply «ค่ะ» is `KA-T1` (Leda), no ASR take passes the particle check; «ฮานาโกะซัง» reads ≈0.67 in every ASR proxy.

## Decisions to keep

- Painted 2D (p5.brush) + Remotion SVG; cold mint-teal; red only for the doodle; Hanako never a body, face or shadow; no invented victim; B09 = ivory seam glow + key dip, no eye (VD21; eye is an unused fallback VD21b).
- Hook text A «เคาะสามครั้ง… มีคนตอบ?» as an overlay layer F0–F45, fade to F54, not in the hold, not in the subtitle track. The Japanese line 「花子さん、いらっしゃいますか」 stays at B01-SH02 F251.
- Narrator default +5% speed (atempo 1.05) for non-character narration (user preference, also in agent memory).
- Map: `src/painted/hanako/japan.json` baked from Natural Earth 1:50m (public domain, `NOTICE`) by `scripts/hanako/bake-map.py`.

## Next steps (in order)

1. **Boss: plates from SCENE-R3**, one invocation per shot group of 3–5 shots (AI01), finished-grade plates only for beats whose review notes are in (all are in). Fixes Film listed before the build: LF01 hand pose from the kit anchors, LF02 panel B hard-fill paper cuts and rubble-like shards, real fonts (Japanese line, the digit "3"), children cast `VD05`/`CH-KID` (not painted yet; optional still `LF04` name was reused for the blank page, so call the children still `LF07`), remove the paint-bleed smudge on the `LF04` lower right. Check Hokkaido top (y 60 at s 1.30) against the top chrome.
2. **Editor: E2** subtitle cue ranges (report differences over 3 frames) · **E3** sound audit and the `NEEDS-GEN` list (sub drone, reverse swell, whispers, music-box motif, warm B06 bed, muffled rumble, muffled wooden slam, drawer/paper foley, page-flip whoosh, projector click) via the sound-generation skill · **E4** `endHoldSec: 0` with the 90-frame hold inside B09, seam pixel check on full-alpha frames, progress-bar reset at the loop seam · **E5** B09 read: the 27-frame silence F2320–F2347 and whether «กลับมา» lands at F2347 (if ≈5 frames later, move the four glow keys by that amount) · ear check of the B05|B06 join (3-frame pause at F1170–F1173; rebuild B05 without the gain to restore 8 frames only if it sounds cut).
3. Register the video: `src/videos/hanako/index.ts` only (never edit `src/Root.tsx` per episode), composition ID `HANAKO-SHORT`, output paths per ID (README, "videos and parallel work"). Nothing exists yet under `src/videos/hanako/`.
4. Scene samples for the user (editor workflow), then render checks per docs/contributing.md (lint, typecheck, frames of every affected composition, loop seam F2595 → F0).
5. Optional later: Boat to inspect lead-only sources (SRC001/SRC004 access) to move facts from `verification-incomplete`; Preaw only if the hook wording or a script change is wanted.

## Open items and owners

- Findings not applied (document proposals, user reviews before applying): gain-before-trim in the narration tooling, `scripts/narration/cut-gaps.py` VERIFY, 300-threshold edge rule vs energy rule. See build-notes.
- Pipeline caveats: Gemini paid-tier rules (origin/main #150), no loops in batch calls.
