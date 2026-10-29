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
| `SHIPWRECK-SHORT` | Script approved (`SHIPWRECK-SHORT-R1.1`). Brief `VB-SHIPWRECK-SHORT-R1`. Boss dependencies 1–5 done 29 Oct 2026 (painted scene type, shared modules + camera, in-canvas dissolve, label slot; see [build-notes](build-notes.md)). **Next: Editor** — add a voice option to `scripts/narration.py` and narrate in Edge TTS th-TH-PremwadeeNeural +5%; re-time the plates (`SH03B`, `SH06`, `SH04A_LEN` in `src/painted/shots/shipwreck.tsx`) to the read; paint the remaining plates SH02, SH04b, SH05, SH07a, SH07b, SH08, SH09a and the SH09b ease-back camera; register `src/videos/oldest-shipwreck/` | 45–60 s; est. 56.5 s; VO `estimated` | [research](research.md) r2 (Kekova wreck); [script](short/script.md) `SHIPWRECK-SHORT-R1.1`; [fact-check](short/fact-check.md) (R1 required fixes applied in R1.1) | [visual brief](../../storyboards/oldest-shipwreck/short/visual-brief.md) `VB-SHIPWRECK-SHORT-R1` (needs-feasibility; look check pending); style tests `PAINTED-SPIKE-Shipwreck` (spike entry) | Painted scene type `existing-integrated` (29 Oct 2026); plates `SHIPWRECK-SH01`, `-SH03a`, `-SH03b`, `-SH04a`, `-SH06`; proof comps `PAINTED-TIMELINE-Shipwreck`, `PAINTED-PLATES-Shipwreck` (spike entry); episode composition not yet registered | User approved script R1.1 and the s2/s3 painted look (with listed fixes; torn small sail) on 29 Oct 2026 (Asia/Bangkok). Painted engine unintegrated (Boss). Voice chosen: Premwadee +5% (`scripts/narration.py` is hard-coded to Niwat; Editor adds a voice option before narration). Look fixes applied 29 Oct 2026: caption band y 860–1248 passes on S1/S2/S3 (mean 0.229/0.183/0.192, p95 0.292/0.214/0.275, `scripts/caption-zone.py`); lower halves filled, S2 blotches removed, diver fins inside the safe box; ship has a small torn square sail. Evidence: `out/qa/oldest-shipwreck/painted-boss/boss_painted_review.png` (viewed). Determinism: full-opacity frames byte-identical (`cmp`); mid-dissolve frames differ ≤3/255 on ≤1,040 px ([DF-20261029-painted-timeline-dissolve](../../docs/dev-findings/DF-20261029-painted-timeline-dissolve.md), open). For Film to confirm: SH03b drains to dark slate (#363d42) not light paper; SH06 hero jar ink held still; SH01 far jars off the flat-bed scale formula. Not release-ready. |
