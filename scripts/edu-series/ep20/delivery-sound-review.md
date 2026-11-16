# EDU-EP20-SHORT — delivery sound warning disposition

Reviewer: Ton, 2026-11-16. Scope: existing SS-R5 layer-level warnings only, after the user approved Final v4. No cue, gain, file, timing or mix was changed. No generation or model loading occurred.

**Verdict: preserve the approved mix.** The reviewed SS-R5 report has zero `FAIL` rows. Accept the thin music/ambience as a nonblocking technical warning and retain B05's 0.6 LU shortfall as a tolerated warning, not an exact target pass. This closes the two open Ton level-decision items in [fixlist.md](fixlist.md); the coordinator records their disposition. It does not establish audibility on a phone or a listening pass.

## Inputs and evidence boundary

- [Cue sheet](short/sound-cues.json): `EDU-EP20-SS-R5`, 1619 frames at 30 fps, narration R2 / VOICE-MEASURE-R3. Seven existing cues: seven generated, zero library reuse, zero swaps; zero new cues in this review.
- Film's [scene sheet](../../../storyboards/edu-ep20/short/scene-sheet.md) Sound lines and [visual brief VD20-06](../../../storyboards/edu-ep20/short/visual-brief.md): quiet enclosed cabin, sparse warm muted mallet pulse, subdued dry accents, narration leads. Music and ambience carry mood, not a factual clue.
- Editor's SS-R5 measurement: `out/logs/edu20-r5-mix-levels.txt`, matched to the R2/v3 mix in the episode build-notes section "SS-R5 Editor narration R2 draft re-cut". This complete existing measurement was reviewed without rerunning identical analysis; no fresh independent stem distances are claimed.
- Delivery evidence: `out/logs/edu20-w8-loudness-current.txt` and published `publish.json`; published MP4 SHA256 `dfb51c873a1a72d5297ea112803e4fb4c9b429fc2db5eca2cd058972d8a90779`, stored source `projects/edu/EDU/renders/EDU-EP20-SHORT/c420a2cf7d96-dirty-202611162123/EDU-EP20-SHORT.mp4`. Editor measured approximately −14.0 LUFS integrated, true peak −1.5 dBFS on the delivery.

Cue-sheet SHA256: `df064bf48a698a70851f16bcb3ef09b951648004906f6b1c21b4502e1941378a`.
Reviewed level-report SHA256: `170e2397e427dd13a8a764925427c1d589804a6439d93399be5a459d819ed6cc`.

## Decisions

| Finding | Evidence | Ton disposition |
| --- | --- | --- |
| Music may vanish under speech | Beat dV 20.9, 26.0, 24.6, 25.5, 27.7 LU; cue-sheet rows use `warnAbove: 20`, with no required minimum audibility | Accept as a quiet mood layer. The sheet asks for a sparse subdued pulse and deliberate thinning/gaps, while narration carries the explanation. Do not raise the approved bed merely to remove an advisory warning. Phone audibility remains unverified. |
| Ambience may vanish under speech | Beat dV 20.2, 21.3, 22.4, 20.8, 22.9 LU; likewise `warnAbove: 20` | Accept as continuous low room support. It need not compete with narration or imply a driving event. The measurements do not prove the cabin texture is audible on ordinary phone speakers. |
| B05 combined background is nearer the voice than the starting target | dV 14.4 LU against minimum 15, short by 0.6 LU; tool reports `warn`, "within ±2 LU" | Accept the measured tolerance for this approved mix; record the warning rather than relabeling it as ≥15. No new cue or gain adjustment is required by the measured result. Whether L12/L13 is clear by ear remains unverified. |
| Story accents and release have their own valid distances | TAP/TICK speech dV 19.5/16.4 within 12–20; B05 accent peaks 2.5/−0.8 within −6–3; bed drop silent; END20 outro peak dV 1.4 within 0–8 | Retain. A quiet sustained bed does not establish that the prominent ending is too quiet; the release has a separately measured foreground level. |

The [EP08b defaults](../../../docs/editor-principles.md#ep08b-keep-each-layer-at-its-distance-from-the-voice) distinguish advisory bed audibility from background masking. The report's whole-mix minus voice is −0.2 LU, below the +5 LU cap. No level `FAIL` needs routing back to Editor. Overall delivery normalization is a master-level operation; it does not resolve the relative-layer warnings, and no corrected stem dV is inferred from the louder delivery master.

## Remaining limits and required work

`listened: no` for this Ton review. No agent listened to the normalized delivery, the 44.401 s narration splice, L13 pronunciation, or the outro/tail. The user's explicit Final acceptance is recorded by the coordinator; whether the user listened is not independently observed. Measurements cannot substitute for EP08a's ordinary-speaker/phone ear check.

No technical mix repair, new sound, repaint or additional generation is required by this review. A real listening note about masking, an inaudible intended cue, pronunciation or a seam should reopen that specific item through the normal fix list. Until then preserve the approved mix, retain the listening limitation in delivery QA, and continue the cover/package workflow.
