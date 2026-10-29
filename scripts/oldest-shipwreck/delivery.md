# SHIPWRECK delivery record

**Selection:** Short only. The user asked on 29 October 2026 (Asia/Bangkok) for a Thai Short about "the oldest shipwreck in the world, of which about 30 jars remain", painted in p5.brush, with the story composed and sample images of the ship and the water.

## Style profile

```
Profile:        channel-default (user choice, 29 Oct 2026)
Genre:          mystery-educational
Visual medium:  illustrated 2D
Visual engine:  Painted 2D (p5.brush) — user choice; runtime exists-unintegrated (Boss dependency before Editor)
Voice:          Edge TTS th-TH-PremwadeeNeural, rate +5% (user choice after hearing the B01–B02 sample, 29 Oct 2026; overrides the Niwat default). Sample: out/voice-samples/oldest-shipwreck/premwadee-plus5.mp3
Music / SFX:    shared sound library / locally generated; ducked under voice
Captions:       outline (default)
Chrome:         channel label and progress bar on (default)
Ending:         B_loop (default)
Factual claims: named real case (Boat research + fact-check)
```

## Tier

**Light** (user choice, 29 Oct 2026). Stages: Preaw script → Boat fact-check → Film brief (one page with a timed shot list) → Editor. Mark: `N/A` (shot list lives in Film's brief). Boss: named capability gaps only — painted scene type in the timeline is `missing`, so painted-shot integration is a Boss dependency before Editor. Boat research before the script ran because the claim names a real wreck and the jar count was unverified.

| Deliverable ID | Stage / Next owner | Target / timing | Script + factual review | Visual brief | Runtime binding | Readiness, approval and gaps |
| --- | --- | --- | --- | --- | --- | --- |
| `SHIPWRECK-SHORT` | Editor integration done 29 Oct 2026 (narration Premwadee +5%, all 13 plates, assembly, captions, chrome, label, sound; see [build-notes](build-notes.md) Editor section and [edit plan](../../storyboards/oldest-shipwreck/short/edit-plan.md)). **Next: user review** of the render and the open items below; then Film for the three look confirmations. Boss: no request from Editor | 45–60 s; **actual 59.17 s (1,775 frames)**: 49.6 s speech in 21 narration slots + 6.2 s authored pauses + 3.0 s B_loop hold; VO `measured` (Edge TTS th-TH-PremwadeeNeural +5%); no trim applied | [research](research.md) r2 (Kekova wreck); [script](short/script.md) `SHIPWRECK-SHORT-R1.1`; [fact-check](short/fact-check.md) (R1 required fixes applied in R1.1) | [visual brief](../../storyboards/oldest-shipwreck/short/visual-brief.md) `VB-SHIPWRECK-SHORT-R1` (needs-feasibility; look check pending); style tests `PAINTED-SPIKE-Shipwreck` (spike entry) | Composition `SHIPWRECK-SHORT` (`src/videos/oldest-shipwreck/index.ts`, 1080×1920, 30 fps, B_loop, captions outline/middle, chrome default) `existing-integrated` (29 Oct 2026, from `a334f34` + Editor working tree); source `scripts/oldest-shipwreck/short/narration-timeline.json`; nine beat scenes B01–B09 → plates `SHIPWRECK-SH01`, `-SH02`, `-SH03a`, `-SH03b`, `-SH04a`, `-SH04b`, `-SH05`, `-SH06`, `-SH07a`, `-SH07b`, `-SH08`, `-SH09a`, `-SH09b` (frame map in the edit plan); narration `public/narration/SHIPWRECK-SHORT.mp3` (local) + committed amplitude; sounds in `public/audio`, `public/sfx` (local copies, NOTICE committed) | Render: `out/SHIPWRECK-SHORT/SHIPWRECK-SHORT_B_loop.mp4` (`--gl=angle`, 59.167 s, 39.1 MB, −14.0 LUFS / −1.5 dBTP after `scripts/loudness.mjs`). Caption band y 860–1248 passes on every shot's first and representative frame (27 bare frames; worst mean 0.228, worst p95 0.373; `scripts/caption-zone.py`). Seam: bare F1685 (hold start) and F1774 byte-identical to F0 (`cmp`); bed level at hold −30.2 dBFS vs −32.4 dBFS at F0 before speech. Determinism and backward seek: re-rendered full-opacity frames (F0, F189, F495, F880, F1100, F1416, F1649, F1774) byte-identical. Mid-dissolve frames not byte-identical, and incoming ink shows during dissolves ([DF-20261029-painted-timeline-dissolve](../../docs/dev-findings/DF-20261029-painted-timeline-dissolve.md), open). Viewed: `out/qa/oldest-shipwreck/editor/sheet-per-shot.png`, `contact-1s.png`, `sheet-adjacent.png`. Cue onsets 17–77 ms after each caption (`check-cues.py`). npm lint, typecheck and test (84) pass. Sounds: five new library files, `listened: no`; generated-audio licence: Stability AI Community License (commercial-use eligibility is the user's decision). For Film to confirm: SH03b drains to dark slate (#363d42) not light paper; SH06 hero jar ink held still; SH01 far jars off the flat-bed scale formula. For the user: listen to the mix, and review the Editor judgment calls in the build notes. No user approval of the render yet. Not release-ready. |
