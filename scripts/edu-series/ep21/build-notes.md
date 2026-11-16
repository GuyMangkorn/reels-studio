# EP21 — build notes

## Editorial assignment — 2026-11-15

- User allocated C83 to EP21 and requested a full script plus portable Hook Guide. Shared research remains `../ab-hook-pilot/research-c83.md` C83-RESEARCH-R1; no source duplication/migration.
- New authoring uses `short/` convention and reserved ID EDU-EP21-SHORT. No runtime module/composition exists for this assignment.
- Preaw owns script/Hook Guide; Boat reviews exact named revisions independently. Coordinator owns records and context-map integration. No concurrent overlap of these file responsibilities.
- Voice pace is not selected; W1.4 remains pending. Channel measured rates are reference-only until the episode's setting is selected; no full read/sample generated.
- Guide is an episode-local production brief, not a new global rule or skill. Another worktree must receive uncommitted dependencies explicitly.

## Verification

Completed: EDU-EP21-SCRIPT-R1 + HOOK-R1, independently reviewed by Boat in EDU-EP21-FACT-R1; ready-for-storyboard, zero must-fix findings. All spoken lines were mechanically matched to the exact-wording review after metadata synchronization. Optional prose notes remain documented; no factual text was changed after review.

Repository checks passed: changed Markdown link check (32 files, 0 problems), context-map check (427 modules, 0 uncovered), JSON parse, and `git diff --check`. Logs: `out/logs/ep20-ep21-links.log`, `out/logs/ep20-ep21-context-map.log`. Documentation-only verification exception applies: no runtime tests, audio or render has a subject.

W1.4/W1.5 remain open: timing uncalibrated for the episode-selected voice and user script approval unrecorded. At the writing handoff, files were local and uncommitted; no push, PR or transfer to another worktree had been performed.

## Tools / document proposals

None.

## Independent production continuation — 2026-11-16

- This session owns only EDU-EP21-SHORT; EP20 has a separate concurrent session/worktree. User authorization extends the earlier writing-only scope to normal production, with explicit script/voice choices and downstream workflow gates still separate.
- Intake `c420a2c` has PR #343 merge `c5326260b3923e669ba53f8a103e34d77f10bc1c` as an ancestor; `scripts/edu-series/ep21/` exists and the checkout was clean. Preserve newer main changes; no reset or recreation of the editorial bundle.
- Coordinator updates delivery to R2 and reopens W2–W8 through `ep.py`. No editorial claim or Thai narration changes are authorized by this bookkeeping.
- Preaw owns the timing-only audit; Editor owns ≤10 s opening samples. Existing ideation, C83 research and FACT-R1 are reused. No full read, frame render, media delivery or publication has occurred in this continuation.

### W1.4 evidence

- Preaw delivered `short/timing-projection.md` EDU-EP21-TIMING-R1: 176 syllables (L10=12), the existing 4–5 s pause allowance made explicit as 4.35 s, and the unchanged 3 s hold. New sample-calibrated projections are 43.06 s / 40.90 s at ×1.08 / ×1.15; gross-span sensitivity without adding pauses twice is 40.3 / 38.1 s. Recommend ×1.08 for margin; no setting selected.
- Only timing metadata changed in SCRIPT-R1; Preaw verified all twelve Thai narration lines byte-match HEAD. FACT-R1's unchanged-claim result is reused; no new factual review or ideation occurred.
- Editor delivered `short/voice-samples.md` and `.json` EDU-EP21-VOICE-SAMPLES-R1. One Gemini call; same take at both paces. Candidate WAV/MP3 durations are 7.057250 / 6.623125 s, below the 10 s cap. Retained assets and reproduction evidence: `projects/edu/EDU/samples/ep21/2026-11-16_r1-76603d9a5b7493a3/`; local `out/` is a cache.
- Local transcription encountered PyAV `open(..., metadata_errors='ignore')` incompatibility. Editor used ffmpeg-decoded float32 NumPy input with the already cached Whisper model; no dependency installation, shared-tool fix or extra API call. Adapter and logs are stored. Machine recognition of two words is ambiguous; listening/Thai pronunciation approval remains pending.
- The coordinator presented the two short auditions and requested episode pace plus explicit SCRIPT-R1 approval through structured questions. W1.4/W1.5 and W4.1 remain open until actual answers. No full narration before the pick and W2.3; no Film scene plan, visual validation or production completion is claimed.

### Continuation verification

- Changed Markdown links: eight files, zero problems (`out/logs/ep21-continuation-links.log`). Context map: 434 modules, zero uncovered (`out/logs/ep21-continuation-context-map.log`). Audition JSON parses; `git diff --check` passes.
- Editor verified all six retained audio files are ≤10 s and their cache/store SHA-256 values match. Whole-script metadata changed during timing synchronization; the exact two-line narration text/hash is unchanged, with intake and final identities distinguished in the manifest.
- Documentation-only verification exception applies to tracked changes: no runtime source or composition changed, so typecheck, runtime tests and video/still renders have no subject. Audio duration/storage checks above are separate from user listening approval. No jobs remain running; no commit, push, PR, merge or media posting performed in this continuation.

### Slower auditions requested — 2026-11-16

- Subsequent user reply: "เลือก 1.05". Coordinator records Kore ×1.05 in delivery and audition metadata, completes W1.4 at the existing 43.97 s projection and W4.1 (voice chosen). W1.5 stays explicitly deferred; W4.2/W4.3 and Film remain open. No regenerated speech or new factual/visual work is needed for this mechanical decision synchronization.

- User requested ×1.03 and ×1.05 and explicitly deferred SCRIPT-R1 approval to read it first. Neither original candidate was selected. A fresh Editor pass derives both requested paces from the same preserved Kore take, with no new speech/API generation. Film and the full read remain pending their existing gates.
- Editor delivered VOICE-SAMPLES-R2: ×1.03 = 7.384771 s, ×1.05 = 7.249375 s (each WAV/MP3 separately probed). New canonical derivatives and sidecars: `projects/edu/EDU/samples/ep21/2026-11-16_r1-76603d9a5b7493a3/r2-1.03-1.05/`; original source is reused once, not copied into R2.
- Coordinator mechanically applied Preaw's unchanged R1 formula to the new measured baselines (6.60/6.45 s for 31 syllables): TIMING-R2 projects 44.82/43.97 s, with gross-only sensitivity 42.2/41.4 s. Narration, 176-syllable count, 4.35 s authored pauses and 3 s hold are unchanged. Script approval remains explicitly deferred; no new factual review has a subject.
- R2 verification: four new media files ≤10 s; cache/store hashes match and original source hash unchanged (Editor). Coordinator's six-file link check passed (`out/logs/ep21-samples-r2-links.log`), audition JSON parses, and `git diff --check` passes. Existing context-map entries cover both updated manifests and the timing file; no module or path was added. Tracked changes remain documentation/metadata only; no runtime test or render subject. No jobs remain running.

## Git publication authorization — 2026-11-15

### Continuation publication — 2026-11-16

- User authorized "commit + pr" for the completed EP21 continuation records. Tracking issue: #345; publication branch: `codex/345-ep21-voice-continuation`. This covers commit, push and PR, not merge or media posting, and does not approve SCRIPT-R1.
- Intake branch matches the fetched `origin/main` (0 commits ahead/behind); no previous PR exists for that branch. Final metadata synchronizes the selected ×1.05 setting and keeps W1.5 deferred.
- Listening cache paths in the audition Markdown are code references, not repository links to machine-local media; canonical store paths and JSON reproduction data remain authoritative across checkouts. User-facing chat links remain playable locally. No media binaries are staged.

The user selected "Commit + push + เปิด PR" after reviewing the writing handoff. Issue: #342; publication branch: `codex/342-ep20-ep21-hook-guides`. This authorization covers Git publication, not script approval, media production or posting.
