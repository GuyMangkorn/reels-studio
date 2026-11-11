# HANAKO build notes

Findings from production work, newest first. Rule documents are not edited here ([TL/DP rules](../../docs/contributing.md#tools-and-document-improvements)).

## 2026-10-31: scene sheet SCENE-R3, retime to lock v3 (Mark, HANAKO-SHORT)

- **Re-derived, not shifted.** Every frame from F900 on comes from the v3 amplitude gaps (4 % of peak, ≥ 4 f) and the v3 anchors. In the tail read several Whisper onsets sit on the gap *end* (`B06-a4` 1430, `B09-a1` 2347, `B09-a3` 2481), unlike take 1 (gap start). Do not assume one side.
- **B09 pause.** The v3 B09 read has a 27-f silence F2320–F2347 inside «และเธอจะกลับมาอีกครั้ง…», not listed in the voice notes (which name the 0.5 s pause before «ยกมือขึ้นเคาะ», F2466–F2482). Glow keyed to F2347; open item `E5`.
- **Film frame slip.** `FILM-R4` says the glow is gone "160 f before the hand"; in its own frames (F2371 vs F2431) it is 60 f. R3: 99 f. Film's seam-exit estimate s ≈ 1.04 is s ≈ 1.077 for focus (660, 740).
- **Ambient cycles must be recomputed per total.** 2596 = 4 · 11 · 59: flicker 118, drip 236 (116/232 no longer divide).
- **Flat-plate projection with `shot-projection.py`.** A `pushCamera` state is a pinhole camera at distance f/s above the focus, looking −z at the plate on z = 0 (`up: y`, world y = −px y), with `shift = ((540 − fx)/1920, (fy − 960)/1920)` to hold the focus on screen. Used for `B05-SH02`, `B06-SH01`, `B07-SH02`, `B09`. If it repeats, a `--push s,fx,fy` option is the candidate (TL proposal, not applied).

## 2026-10-31: voice lock v3 installed, S3 tail re-read (Editor, HANAKO-SHORT)

- **Installed on the user's instruction** ("use it as the new lock"). `public/narration/HANAKO-SHORT.mp3` = the sample `s3-tail-reread/HANAKO-SHORT-tail.mp3` (sha256 prefix `ed3a339f`); `.amplitude.json` = the sample's (prefix `fdfe80f9`, identical to a reassembly with `scripts/narration/assemble-narration.py` on `sample/HANAKO-SHORT-tail-track`). Level kept: −16.0 LUFS, LRA 4.2, sample peak −0.5 dBFS. No re-encode, no fade.
- **Backup:** `out/hanako-voice/final/lock-v2-s3take1/` (MP3, amplitude, `voice-measure.json`, `.md`, `delivery.md`, `build-notes.md`; `manifest.sha256` verified). `delivery.md` and `build-notes.md` are in the backup because this run edits them. `lock-v1-hushed/` stays.
- **Click check, not confirmed.** The end is a decay (the last syllable at 82.00 s, −48 dBFS block), then a noise floor (−55…−63 dBFS, steps ≤ 8 LSB, last sample +22). No fade applied.
- **Finding for the owner (gain changes the trim, `finish-tail.py`).** The +1.20 dB gain was applied to the clips after measuring. The first sample ≥ 300 in the B05 clip moved from 11878 to 8100, so the assembler's head trim moved the whole B05 clip by 2.361 frames (onset 856 → 858; tail 1120 → 1125 as a decay crosses 300). The measure was therefore taken on the installed MP3. Owner decision: gain the assembled track, or measure after any gain (the trim rule is `scripts/narration/assemble-narration.py`, shared, not changed here).
- **Measure written from the installed audio.** `out/hanako-voice/final/write-measure.py` is now path-parametrised (arguments only; no lock path). It measures the speech edges in each slot, applies the clip-head shift to that beat's anchors, and checks the track against the slot plan. The draft's stale fields were corrected: `f0_late_vs_opening_pct` 24.2 was the superseded lock (now +6.2 %); B08 name check 0.56 was take 1's text (tail: 0.67); the `anchor_fallbacks` list (B06-a2, B07-a3) is correct as drafted.
- **B09 residual confirmed and resolved.** Lock v2's 300-rule speech-off was 2417; the energy rule (−45 and −50 dBFS, 10 ms) gives 2410: **7 frames late** (not 8; the one block at 80.56 s, peak 353, RMS −48 dBFS). The sample's B09 end is 2460 under all three rules. Finding for the owner: a single ≥ 300 sample after a quiet tail sets the 300-rule edge; a shared edge rule would need a sustain or energy check. Not applied.
- **Other beats, rule disagreement (for the owner, not applied).** On the same audio the energy rules differ from the 300 rule at soft onsets (B07 +7, B08 +11 at −45 dBFS) and at quiet final consonants (B05 end −27 at −45 dBFS).
- **Anchor added.** `B06-a0` («เรื่องฮานาโกะที่เก่าที่สุด», estOn 750, estEnd 1068) is in `out/hanako-voice/final/anchors.md`. The first tail cut at B05|B06 landed at 10.315 s inside «เรื่องฮานาโกะที่»; with `B06-a0` it is 9.220 s.
- **Reproduction note.** `finish-tail.py` names its output `sample/HANAKO-SHORT-tail.mp3`, but that file is not in `sample/`; the top-level copy is the one that reproduces byte-identically (see the reassembly above). Record this when the tool is next used.
- **Timeline.** Track 2461 frames (82.033 s); pauses 69 frames (`B04|B05` 10, `B05|B06` 3); timeline 2596 frames (86.533 s), 3.47 s under the 90 s cap. Old basis 2552. The retime for Mark is [short/retime-r2-to-r3.md](short/retime-r2-to-r3.md); `SCENE-R2` is not edited.
- **Git.** The MP3 is gitignored (`*.mp3`). `public/narration/HANAKO-SHORT.amplitude.json` is not, and `public/narration/` is untracked. Whether to commit the amplitude JSON is open. No commit made.
- **Scope kept.** `scripts/hanako/delivery.md`: only the lock paragraph changed; another writer's edits (the 10:06 change) are preserved. No `src/` edit, no scene sheet edit, no Gemini request, no sound generation.
- **Logs:** `out/logs/hanako-voice-v3-*.log`.

## 2026-10-31: tail re-read sample (Editor, HANAKO-SHORT, sample only, not the lock)

- **Sample, not applied.** `out/hanako-voice/final/s3-tail-reread/` (one Gemini request for B05–B09, Charon, the take-1 style plus «same narrator as the opening, steady low pitch, do not rise»). The lock files and the delivery lock paragraph are unchanged by this run. No commit.
- **Cut at B05|B06 was wrong on the first pass (finding for the owner).** The align-full midpoint used the first anchor of B06 (`B06-a1` «มาจากอิวาเตะ», 11.84 s) because the anchor table has no anchor for B06's opening phrase. The cut went to 10.32 s, inside «เรื่องฮานาโกะที่» (audible from 9.39 s). `cut-gaps.py` VERIFY passed (edge margins only). Found only by the Whisper word check. Fix used for the sample: sample-only anchor `B06-a0` «เรื่องฮานาโกะที่เก่าที่สุด» (`tail-anchors.md`), which puts the cut at 9.22 s, the centre of the 0.34 s pause. Proposed for the next lock revision: add `B06-a0` to `anchors.md`, and make VERIFY fail when a beat's first anchor is outside its segment or a cut uses the quietest-10 ms fallback.
- **Measure writer must not run on the sample.** `out/hanako-voice/final/write-measure.py` hard-codes the lock's paths (`scripts/hanako/short/voice-measure.json`, `public/narration/HANAKO-SHORT.mp3`). The sample uses `write-draft-measure.py`, which writes only under `s3-tail-reread/`. Proposal: take the paths as arguments.
- **Reproduction.** `build-tail-track.py` on the lock's own take-1 segments reproduces the lock's slot plan, all 10 beats and all 31 anchors. The un-gained assembly of the lock clips is byte-identical to the lock MP3 (sha256 `23cba303…`). `atempo=1.05` reproduces `HANAKO-NARR-x105.wav` byte-for-byte.
- **Late-drift result (estimator A, `beat-drift.py`).** F0 B05 117.1, B06 113.2, B07 122.8, B08 107.6, B09 95.6 Hz against the opening 102.3 Hz (B01–B04 unchanged). Group B07–B09 is +6.3 % (lock +24.2 %). Single beats are still high: B05 +14.5 %, B06 +10.7 %, B07 +20.0 %. The second request was not used: the rule is on the group metric.
- **B09 is longer.** The new final clause has a 0.5 s pause before «ยกมือขึ้นเคาะ» and ends at 6.77 s in the segment (lock about 5.4 s). Track +44 frames (+1.47 s). Speech-off B09 +43 frames.
- **B05|B06 tail (listen).** After «ต้นเรื่อง» the take keeps a low decay of peaks 200–400 (about −40 dBFS) for about 0.25 s. The lock's gap is digitally quiet there. Natural decay, not a cut defect; the inner-gap check flags it (396).
- **Gap check on a sample, not the lock.** An inner-gap check of each written gap in the sample MP3 flags only B05|B06. The lock check flags no gap. Keep this check in the sample QA for the next lock.
- **Other owners' items, not changed.** `scripts/hanako/delivery.md` was modified at 10:06:13 by another writer during this run. The run did not write to it. Its lock paragraph still reads S3.

## 2026-10-31: timed scene sheet SCENE-R2 (Mark, HANAKO-SHORT)

- **Word onsets from the amplitude file.** In this read the Whisper anchor onsets sit at the *start* of the gap before the word (e.g. `B01-a3` track 228 vs gap 225–238, `B04-a2` 653 vs gap 636–662). The end of the low-energy gap in `public/narration/HANAKO-SHORT.amplitude.json` (4 % of peak, ≥ 4 frames) gives the onset more tightly. `B06-a2` («1948», track 1324) is wrong: the amplitude puts the spelled year at track 1261–1301 and 1324 is «บันทึกนั้น». Procedure was a one-off Python snippet; script it if a second sheet needs it (TL rule).
- **Slot boundary B05|B06 one phrase late.** `clip-asr-s3.json` hears «…ต้นเรื่อง เรื่องฮนโกทิกษณ์» in the B05 clip; B06's clip starts at «เก่าที่สุด». So «เรื่องฮานาโกะที่» (track 1107–1134) sits in the B05 slot, followed by the 8-frame slot gap inside the phrase. The sheet cuts picture on the words (F1146); an audio re-cut needs a re-measure.

## 2026-10-31: pitch sample for the late drift (Editor, HANAKO-SHORT, sample only, not the lock)

- **Sample set, not applied.** `out/hanako-voice/final/s3-take1-pitchfix/` (see its README). Per-beat `asetrate`+`aresample`+`atempo` (ffmpeg 9.0.2 here has no `rubberband`/`librubberband`, no sox; formants move with the pitch). The lock files are unchanged. No Gemini request.
- **F0 metric reads high at lower pitch (finding for the owner, `scripts/narration/voice-match.py`).** `f0_stats` keeps a 40 ms frame only if its raw autocorrelation peak is above 0.5. Longer lags (lower F0) overlap less and pass less often, so the median is biased up. A pure resample of B05 by −2.77 st measures 109.0 Hz, where 102.0 Hz is expected. An overlap-normalised estimator gives 100.0 Hz. Proposal: normalise by the overlap or report both estimators. Not applied.
- **Slot recompute (finding for `out/hanako-voice/final/build-track.py`).** Slots are recomputed from the audible edges. A residual tail just above the 300 threshold changes a slot by up to 8 frames (B09 here), and B02 by 1 frame. The sample build pins the lock's slot plan (`build-track-pitchfix.py --pin-slots`). The original also writes `final/track/` and `final/track-measure.json` unconditionally, so it must not run as a sample build.
- **Lock B09 speech-off is 8 frames late.** The 300-threshold tail at 5.47–5.67 s of the B09 segment is residual noise (RMS about 35). The speech ends about 5.42 s. Correct at the next lock revision; the track length is unaffected.
- **Loudness.** The lock measures −16.8 LUFS. `assemble-narration.py` does not normalise, so the −16 target is not carried into the assembly. The sample and the lock reference are both set to −16.0 LUFS with one linear gain each, for a level-matched A/B.
- **Reproduction check.** Re-assembling the lock's clips with `assemble-narration.py` gives a byte-identical MP3 (sha256 `23cba303…`), so the assembler is deterministic for this track.
- Logs: `out/logs/hanako-voice-pitchfix-*.log`.

## 2026-10-31: voice re-lock with style S3 (Editor, HANAKO-SHORT)

- **Style S3, two whole reads, one retake.** The user chose S3 and said "lock". Take 1 (raw 85.88 s; previous raw 91.52 s) is locked. Take 2 (raw 85.44 s) is kept under `out/hanako-voice/final/s3-take2/`, not built. The retake was allowed only for a boundary or drift defect: take 1 had no boundary defect but a late pitch climb (F0 medians B07–B09 +24 % over B01–B04; superseded lock +6 %). The climb is open for the ear. No budget is left for another read.
- **Silent fallback in `cut-gaps.py` (finding for the owner, not applied).** When no audible gap of at least 0.1 s lies within ±0.6 s of the Whisper midpoint, the script cuts at the quietest 10 ms within ±0.3 s of that midpoint and says so in its report. Take 2 hit this at B05|B06 and B07|B08 (align 0.61, five anchor fallbacks, so the midpoints were off). The B07 segment then held B08 (25.1 s). VERIFY checks only edge margins (≥ 0.02 s), so it reported one edge failure and not the swallowed beat. Proposed for `scripts/narration/cut-gaps.py`: VERIFY also fails on any quietest-10 ms cut and on a segment whose speech is longer than its beat's slot. Take 1 had no fallback cut.
- **Re-lock proxies (not heard).** Align match 0.74 → 0.83; anchor fallbacks 3 → 1 (`B07-a3`); isolated-clip Whisper ratio mean 0.876 → 0.896 (B08 +0.13, B09 +0.09, B01 −0.05); «ฮานาโกะซัง» still garbled in every take (fuzzy 0.56–0.67, same as before); «อิวาเตะ» 0.92 in both. Timeline 2583 → 2552 frames (86.1 → 85.07 s).
- **The proxy reproduces.** `clip-asr.py` on the superseded segments gave the old per-beat ratios exactly (0.86 … 0.79), so old and new numbers compare like for like.
- **Builders (Editor, `out/` only).** `build-track.py` hashes the x1.05 read. `clip-asr.py` takes `--segments` and `--json`. `write-measure.py` computes its QA block from the proxy JSON and ffmpeg loudness instead of typed numbers. The fallback anchor list is still copied from the align-full stdout, because the align report has no fallback key. `beat-drift.py` is new (voice-match metrics per beat and in 10 s windows).
- **Whisper venv is in the main checkout.** The worktree has no `.venv-whisper`. Run the align and ASR tools with `<main>/.venv-whisper/bin/python` (absolute path).
- **Superseded lock kept.** `out/hanako-voice/final/lock-v1-hushed/` holds copies of the MP3, amplitude, measure JSON and MD, delivery.md, this file, the raw and ×1.133 reads, segments, track and measure, with `manifest.sha256`.
- Logs: `out/logs/hanako-voice-s3-*.log` (read, take 2, align, cut-gaps, beat-qa, F0, drift, clip-asr, build-track, assemble, write-measure) and `out/logs/hanako-voice-v1-*.log` (superseded lock, same tools). Gemini requests this session: 2 (take 1, take 2).

## 2026-10-31: voice lock (Editor, HANAKO-SHORT)

- **Continuous-read input needs a boundary mark.** The per-beat TTS texts carried no punctuation at beat ends, so one Gemini read ran the beats together (24–96 ms gaps) and the cut points landed inside speech. Fixed in the TTS input (sentence end at each beat end). Rule for later continuous reads: every beat boundary carries punctuation in the TTS text. Details: [voice-measure.md](short/voice-measure.md).
- **Two ASR views of one read.** Whisper on the continuous file scored 0.25–0.78 per beat, with English hallucinations; isolated beat clips scored 0.79–1.00. Cut on the continuous file, check words on the isolated clips.
- **Particle check is weak for «ค่ะ».** Whisper returns «ข้า» or «ห้า» for «ค่ะ» takes; «ข้า» and «ค่ะ» are near-homophones in Thai. No pass or fail verdict by ASR for short particles; use the ear.
- **align-full anchors:** fallbacks (no exact character match) on `B01-a1`, `B06-a2`, `B07-a3`; cut-gaps clamped 6 anchor times to segment edges. Anchor onsets are estimates (about ±0.2 s).
- **Assembler gaps:** with `trimHeadSec` of one frame and slot length = audible length + 8 frames, the onsets and ends fall on integer frames and each written gap is exactly 8 frames in the measure.
- **Not covered by a recipe:** a distance effect for a voice (quiet, low-pass, reverb) has no documented recipe; the reply is raw.

## 2026-10-31: Boss Group 1 production plates (SCENE-R3)

- Added the four G1 plate IDs and owning restroom/CH-KID/notebook assets; no video registration or Root edit. Report: [short/boss-g1-report.md](short/boss-g1-report.md).
- Repeatable standalone capture: `node scripts/hanako/render-g1.mjs [B01-SH01 B01-SH02 B02-SH01 B03-SH01]`; lead raster measurement: `python3 -I scripts/hanako/measure-g1.py`. Initial sandbox Chrome connection failed; renderer ran with approved external Chrome launch. Fonts are browser-gated so registry imports in Node tests do not fetch `/fonts/` URLs.
- Caption fix: first-pass close-door F31 p95 .411 and whole-door mean .480 failed; plate-owned lower light falloff now passes all 56 sampled frames. CH-KID head/torso hard underlayers prevent background pickup. See measured results and sheet paths in the report.
- Strict repeatability remains open: B03 f100 repeat has 2 color-channel differences, max 1/255; no cause established. No shared runtime workaround or rule-document change applied. LF04 lower-right paint bleed belongs to B05, not G1.

## 2026-10-31: Boss Group 2 production plates (SCENE-R3)

- Extended G1 modules/helpers for B04-SH01, both B05 shots and both B06 shots; report: [short/boss-g2-report.md](short/boss-g2-report.md). CH-KID untouched; Root/video registration unchanged.
- LF02 now owns hard paper cuts and blunt rubble; LF04 owns hard blank ruled pages in final plate coordinates. No duplicated look implementation. Pin leader is screen-projected, sea dim/vignette stay screen-space.
- QA exposed a POV entry/sleeve gap: the kit's short-sleeve construction ends at its midpoint. The episode owner now draws a continuous long cardigan behind the unchanged kit hand, with elbow/cuff following the wrist. G1 consumers are unaffected.
- Extended existing `render-g1.mjs` / `measure-g1.py` with `--g2`, motion and sheet modes rather than writing another one-off renderer. Reused the generic manifest-driven Chrome sheet label helper. Measured default chrome font bounds against projected Hokkaido; actual timeline chrome remains Editor QA.
- No rule-document changes. Plates/QA do not establish audio, Studio, continuous sequence or visual approval.

## Finding: G1–G3 plates paint with flat fills (coordinator, 31 Oct 2026)

- Codex-built plates render through `BrushCanvas` (via `PaintedShot.paint`), but `src/painted/hanako/assets.ts` uses `hardFill` 66× against `washAt` 4× and `inkLine` 13×. `hardFill` (`kit/draw.ts:30`) is a flat, no-bleed, no-texture underlayer meant for straight architecture, so kids, hands, drawer and book read as geometric. `generations.tsx` draws `KidSilhouette`/`TeacherIcon` as SVG (22 elements) inside wide shots.
- Polish pass fix: washes + one ink line + one cel shade for cast and props; move in-set characters from SVG into brush. FPOV inserts (e.g. the WORLD FOG phone swipe) stay SVG (user, 31 Oct 2026; `docs/delivery-workflow.md` visual engine row).
- **Rule change (DP, user approved 31 Oct 2026, applied):** added to `.claude/skills/painted-2d/SKILL.md` "Art direction defaults", after the backgrounds/characters bullet:
  > - `hardFill` (`kit/draw.ts`) is only for straight architecture edges (frames, mullions, lockers). Cast, props, paper and hands use `washAt` plus `inkLine`. Characters inside a painted set are brush-painted, never SVG; crisp SVG is for close-up and FPOV inserts such as a phone screen.

## 2026-10-31: Boss Group 3 production plates (SCENE-R3)

- Extended G1/G2 owners for B07-SH01/02/03, B08-SH01 and B09-SH01; full handoff and limitations: `short/boss-g3-report.md`. No episode registration or Root change. Existing CH-KID polish stays deferred.
- Review caught reversed poster entrance and bright poster passage through the caption band; corrected the entrance and added lower-band light falloff. B08 silhouette derivative separates trouser legs; no cast redesign. Isolated-mask `inputProps` must be supplied to `selectComposition` as well as `renderStill` so metadata/default props do not hide the selected group/member.
- Extended existing `render-g1.mjs` / `measure-g1.py` with `--g3`, isolated masks, loop/layers-off repeats, 12-frame sheet parts and labelled sheets. Loop endpoints are byte-identical, full alpha; post-glow F2383 still has a single 1/255 channel difference. Evidence and hashes: `out/qa/hanako/g3/`. Do not interpret these plate checks as Studio, audio, assembled continuity or visual-done approval.

- **Rule revised (user, 31 Oct 2026):** the POV/close-up plates (B01-SH01 door and hand, B05-SH01 drawer, B05-SH02 page, B06-SH02 book, B09-SH01) look right with `hardFill`; Codex's group B edge-wobble pass made them no better. `.claude/skills/painted-2d/SKILL.md` now allows `hardFill` for architecture and for close-up/FPOV shots; the wash + ink rule applies to wide/medium shots (cast, in-set props). Polish scope shrinks to P01, P02, P09 and the wide-shot light pass.
- Rule refined (user, 31 Oct 2026): `hardFill` is for the foreground subject of POV/close-up shots only; their backgrounds stay painted washes. Added brief item P12 (audit those five plates' backgrounds).

## 2026-10-31: Boss polish pass, Group A (P01 cast, P02 brush ports, P09 classroom) (Boss, HANAKO-SHORT)

- Report: `scripts/hanako/short/boss-polish-A-report.md`. Affected shots: B03-SH01, B07-SH01, B07-SH03, B08-SH01 (B07-SH02 unchanged: byte-identical, its map and pin are group C). Story, timing, camera, caption zone, audio and `src/Root.tsx` untouched.
- **Rule gap (proposal for `.claude/skills/painted-2d/SKILL.md`, not applied):** the skill says cast uses `washAt` + `inkLine`. One p5.brush wash at full opacity is translucent: on a dark figure over the light locker, the locker divider showed through the hair (four passes still showed it). Proposed wording: "A dark cast figure needs an opaque base: `solid()` with 8 low-texture passes (6–8 over wet light), then one textured `washAt` glaze for the paper grain. A single `washAt` is not opaque." Recorded in `docs/dev-findings/DF-20261031-painted-opaque-cast.md`.
- **Repeatability (open, recorded again, not isolated):** untouched B09 frames differ from the pre-edit render by 0–3 channels at 1/255 across render sessions (`B09-SH01-f293`, `loop-landing-f0`, `layers-off-f204`); within one session, the repeat frames are byte-identical. The G3 record of a byte-identical loop did not reproduce on the pre-edit tree in this session (3 channels, 1/255). Recorded in `docs/dev-findings/DF-20261031-render-session-drift.md`.
- B08 silhouettes moved from the SVG overlay (above the amber spot) into the plate (under it). The silhouettes take the same overlay glow as the set; geometry and group opacity unchanged. Feet line 838 (was 840) so the painted spread stays ≤858 px at the 1.08 push (caption band starts 860).
- Kid hands: `paintNotebook` mittens replaced by `kidHand`, a skin palm with thumb; the notebook paper and the doodle drawing on the page are unchanged (not in a P-row). Kid arms now world-space ribbons with cuffs (a first draft applied the pivot twice; caught by the bounds dump, fixed).
- Flagged, not changed: `B07-SH03` room background still uses `hardFill` (frames at 140–940 × 180–850). The 31 Oct refinement keeps washes for backgrounds of POV/close-up plates; B07-SH03 is a wide plate, so this is a question for the next pass, not an error.
- Tool change: `render-g1.mjs` and `measure-g1.py` accept `HANAKO_OUT` to write a before/after pair into a separate folder. Defaults are unchanged.

## 2026-10-31: Film R5 proposals (rule documents are not edited; user reviews)

- painted-2d skill, "Art direction defaults": word the exception that the wall/floor strata of an FPOV plate whose subject is the door (`RR-KNOCK`, `RR-DOOR`: `hardFill` at `assets.ts` lines 18-19) may stay `hardFill` when the user approved the look; today the rule reads "backgrounds never `hardFill`" and the approved plates break it.
- `docs/dev-findings`: no new entry; `DF-20261030-painted-screen-layers-overlay` revalidated 31 Oct 2026 (plate `Overlay` still receives `camera`; workaround holds for the `B03` name tag).
- Tooling idea (untested): subset `public/fonts/NotoSansJP.ttf` (9.6 MB) to the glyphs used on screen; needs `fontTools` (not installed here). Decision details in `short/film-r5.md` VD26.

## 2026-10-31: Boss S1-R4 (`B02-SH01` fist, `B03-SH01` FPOV-CHEST)

Evidence and per-item status: [boss-s1r4-report.md](short/boss-s1r4-report.md). Rule documents are not edited; these are proposals for the user and the owners.

- **Film (VD29):** the fist's bottom is at y ~892 at F421 (x ~979), not ≤ 850. It is right of the caption-safe box, so the caption rule holds. Decide: accept, or dir ≈ −2.9 rad (keeps the corner at ~847 at this anchor, fingers point toward the seam). Recorded in `docs/dev-findings/DF-20261031-povhand-wrist-corner.md`.
- **Film/Mark (VD26):** the main name line is 40 px at s 1.00 (not the estimated 34 px); the Film acceptance "cap height ≥ 36 px on screen" needs it (measured 40 px ink at s 1.14).
- **Mark (sheet):** the B03 staging shoulders at y 40–120 cannot hang an upper arm of ~450 px with the elbow at y ~700–770. The plate puts the shoulder joints at (150, 340) / (930, 340), the elbows at (128, 770) / (952, 770) (CP-P02: elbow a little below the hand, outside the torso edge). Request a sheet correction.
- **Tooling:** `scripts/hanako/render-g1.mjs` takes `HANAKO_FRAMES=f,f,…` (adds shot-local frames to one selected shot). Default unchanged.
- **Dead code after S1-R4:** `paintCorridor` and `paintNotebook` (`assets.ts`) have no production consumer; kept (the corridor look is not touched in this pass). Remove later with the user's go-ahead.
- **Font gate:** `FpovTag` calls `loadFont` inside a component with `delayRender`/`continueRender` (not at import). `look.tsx` still registers the same face at import, as before.
- **Not in this checkout:** `public/fonts/NotoSansJP.ttf` and its notices are untracked; commit them with the code that uses them (delivery step).


### S1-R4 painted fix, 31 Oct 2026

See `short/boss-s1r4-fix-report.md` for the WORLD FOG comparison, rendered checks and unresolved arm and fist readability. Final B03 f100 repeat differs slightly (116 dB PSNR); exact still determinism remains unverified.

### POV forearm taper (31 Oct 2026)

See `short/boss-taper-report.md` for the opt-in kit taper, projection estimates, viewed before/after sheets and limits. B02 still reads as a narrow vertical sleeve at 270 px; B01/B05/B09 have only a subtle depth read. A sampled loop pair matches, while one repeat showed one-level render drift. No rule-document change proposed in this pass.

### Raised forearm direction (31 Oct 2026)

See `short/boss-armdir-report.md` for projected elbows, the opt-in cuff and viewed before/after sheets. B01/B09 now angle up from the lower right but still read as long, narrow sleeves; B02 is mostly cropped. A newly rendered ZCPAINT pre-edit baseline remains open; no visual-done claim.

### 31 Oct 2026 — POV arm restore

Restored the user's preferred taper-pass B01/B02/B09 arms. All seven requested reference renders and two B05 controls are byte-identical to the stored pre-armdir frames; WORLD FOG default is byte-identical. See `short/boss-armrevert-report.md` and the viewed `out/qa/hanako/armrevert/before-restored.png`. Full playback and final visual acceptance remain unverified.

### 31 Oct 2026 — Polish Group C port (P08, P10, P11)

Ported the P08 restroom washes (`paintRestroom` RR-WIDE/RR-DOOR only) and the P10 light/vignette (`src/painted/hanako/lighting.tsx`, `SetLight`/`SetVignette`) onto main 3166499. P11 has no code: the Codex map trial was removed. Not ported: Codex P03–P07/P12 hunks (B05 must stay unchanged), the B03 corridor and FPOV hunks, the arm-direction code. Pixel check: B05-SH01/SH02 and B06-SH02 byte-identical; B01-SH01, B03-SH01, B09-SH01 differ by 1/255 on some frames, reproduced by a fresh-session re-render with identical code (render-session drift, see DF-20261031-render-session-drift). Lead heights (B03 917/1028/1043, B07-SH01 733/763/792) and the F2595→F0 seam are unchanged. Open for the user: corridor plates read ~10–14 levels darker (vignette), and the B08 floor-base wash reads as wet blotches at full resolution. Report `short/boss-polish-C-report.md`; sheets `out/qa/hanako/polish-c/sheets/`. Pixel helper `scripts/hanako/pixel-diff.py`.

## 2026-10-31: Editor E2 cues and registration (Editor, HANAKO-SHORT)

Full report: `short/editor-e2-report.md`. Registration `src/videos/hanako/index.ts`; cue builder `short/build-cues.py` (writes `short/timeline.json`, `short/cue-measure.json`).

- **Ending cannot be `B_loop` with a zero hold.** `validateVideoStyle` rejects `endHoldSec` unless the ending is `A_fade`, and the default `B_loop` hold freezes the final scene's painted plates (`paintedStateAt` → `endingState`). That would drop the B09 cool-down (F2581–F2595) and break the seam. Registered as `A_fade` with `endHoldSec: 0, endFadeSec: 0` (plain playback; the BLOOP precedent). Proposal for Boss: allow `endHoldSec` on `B_loop`, or document the freeze.
- **Hook text and labels are in the plates.** B01-SH01 hook (F0–F45, fade to F54), B01-SH02 Japanese line, B03 name label, B06 callout and credit, B07 date and name cards are SVG layers in `src/painted/shots/hanako.tsx` with their own frame opacity. No Remotion overlay and no `painted.label` is needed; the scene sheet's "label slot" and "Editor overlay" wording is superseded.
- **Scene-sheet cues hold to the next cue.** 31 of 32 speech cues end more than 3 frames after the measured speech end (range +2 to +91 f); the built cues end at the measured speech end (beat off at the last cue of a beat, last speech frame before the next cue otherwise). Only B09-02 is held on purpose (to F2596). Mark to confirm.
- **Onset disagreements between measures:** B07-01 (+7 f), B08-01 (+11 f) and KA-01 (+9 f) start earlier on the voice-lock 300-sample beat edge than on the 4 % envelope. The built cues use the voice-lock value; ear check needed.
- **Line breaks authored (display only):** B04-02, B05-01 and B07-02 wrap at existing word boundaries. `caption-breaks.mjs` reports 0 flags.
- **Loop seam (F0 vs F2595):** plate pixel-identical above the hook band, between y 370 and 860, and below the caption band. Only the hook text and the B09 caption differ. Seek parity: 12 shuffled-order re-renders match, with 4 PNGs at most 1 level off in 2 pixels.
- **Caption zone:** 78 of 78 frames pass (mean ≤ 0.231, p95 ≤ 0.352).
- **Visual question:** B04 opening frames F645–F706 read as a near-black field, not the "plain paper" the B04 block describes. Film/Boss to confirm intent.
- **Narration locks:** `public/narration/HANAKO-SHORT.mp3` locked to store `projects/legacy/HANAKO/audio/final/s3-tail-reread/HANAKO-SHORT-tail.mp3`; amplitude JSON filed as `projects/legacy/HANAKO/audio/final/lock-v3/HANAKO-SHORT.amplitude.json` and locked. `store.py verify`: 0 problems.
- **Not wired (E3–E5):** music, ambience, SFX and the NEEDS-GEN list (see report §9). No sound generated.

## Editor E3: sound audit, generation, wiring (31 Oct 2026)

Full report: `short/editor-e3-report.md` (cue table, sources, measures, gaps). Wiring: `src/videos/hanako/index.ts` (`audio`, 43 tracks); locks: `src/videos/hanako/assets.lock.json` (22 entries, `public/audio/<category>/<id>.wav`). Nothing committed.

- **Library:** 9 reused (room tone, knuckle knock, whoosh, tick, sub hit, riser, cold bed, mystery bed, held tone), 13 generated and filed (sub drone, reverse swell, whispers, two music-box motifs, warm pad, rumble, wooden slam, drawer, paper flick, page flip, notebook rustle, projector click). INDEX: 105 sidecars, 105 rows, 0 mismatches. Generated takes are in `_raw/` with seeds.
- **Measured picks only, nothing listened.** Each library sidecar carries `--picked` notes. The ear check is open for every generated file.
- **Processing traps found:** `trim_silence` moved the attack of two takes, so the first event was cut by hand; the projector click and the paper flick each carried a second transient (1.0 s and 0.8 s) and were cut to the first event. Superseded takes (`foley_paper-tab-flick_01.wav`, `mechanical_projector-shutter-click_01.wav`) stay in `_raw/`. The drone's measured peak is ceiling-limited (−12.8 LUFS, not −14).
- **Seam:** room tone is split at its 12.5 s file boundary (no `loop` flag). F2595 ends on the file's last sample, F0 starts on its first. Wrap step 0.58× median; the seam is room tone only on both sides (render levels −32.7 dB RMS and −32.6 dB RMS).
- **Mix:** voice −16.0 LUFS (fixed); beds −32 to −34 LUFS nominal, ducked 6–9 dB under speech; knocks −9 dBFS peak; no clipping in the two renders (true peak −3.4 and −3.3 dBFS).
- **Capability gaps for Boss:** keyframed track volume (B09 −2 dB room-tone dip, F2323–F2383); per-beat narration gain (EP08a runtime gap).
- **Open (returned, not asked):** B08 music source (the sheet names both the motif and `bed_sad-aftermath-ambient_01`); B09 F2320–F2347 pause (music kept low per the sheet); rumble choice vs `quake_seafloor-rumble-muffled_01`; B05 cover/flip sound choice.
- **Checks:** typecheck 0; lint 0 errors (3 pre-existing warnings in `src/painted/hanako/look*.tsx`); tests 241 pass; `store.py verify` 0 problems.
- **Full render (Editor, 31 Oct 2026, `f8788d1a17c4-dirty-202610312212`):** `node scripts/render.mjs HANAKO-SHORT --gl=angle --timeout=180000`; run 1 691 s, 9 of 9 segments rendered; run 2 92 s, 9 of 9 reused, MP4 SHA-256 identical; -14.1 LUFS (ebur128 -14.0), -1.4 dBTP, 0 full-scale samples; caption zone 19/19 pass; reference PSNR min 48.1 dB. Store: `projects/legacy/HANAKO/renders/HANAKO-SHORT/f8788d1a17c4-dirty-202610312212/`. Report: `scripts/hanako/short/render-report.md`. Unverified: not listened, not seen in Studio or on a phone.

## Boss B07-SH03 FILM-CARD: real flyer, redacted (31 Oct 2026)

- **Decision (user, 31 Oct 2026):** the card shows the user's real flyer (`projects/legacy/HANAKO/references/user/2026-10-31_b07-film-poster-shinsei-toire-no-hanako-san.jpg`, title reads 新生, year unverified). No year, no title stamp, no doodle. Title, tagline and credits blurred in a store copy; the rest of the scan is unchanged.
- **Build:** `scripts/hanako/short/poster-redact.py` (ffmpeg, 5 regions, 76,875 px touched) → `projects/legacy/HANAKO/reference/2026-10-31_b07-film-card-poster-redacted.png` (locked to `public/images/hanako/`, git-ignored). Shot code: `FilmPoster` in `src/painted/hanako/generations.tsx`, B07-SH03 Overlay in `src/painted/shots/hanako.tsx`. Report: `short/boss-b07-poster-report.md`. Finding: `DF-20261031-painted-raster-card`.
- **Open for Mark/Film:** the scene sheet and `review-rows.json` still describe the generic doodle poster, the 1995 stamp (F1994) and the disclaimer label that is now removed.
- **r2 (31 Oct 2026, coordinator request):** card 570 × 814 px at x 255, y 30 (7:10, clears caption band y 860 at the push end); DATE «ยุค 90» moved to x 40 (same y); r1 sheets superseded. Details: `short/boss-b07-poster-report.md`.
- **r3 (31 Oct 2026, user):** the 1998 flyer is replaced by the user's 1995 Shochiku poster (`projects/legacy/HANAKO/references/user/2026-10-31_b07-film-poster-toire-no-hanako-san-1995.jpg`, 1000 × 1500). Redacted by `scripts/hanako/short/poster-redact.py --poster 1995-r3` → `projects/legacy/HANAKO/reference/2026-10-31_b07-film-card-poster-1995-redacted.png` (locked to `public/images/hanako/film-card-poster-1995-redacted.png`). The 1998 lock entry and its cache copy are removed; the 1998 store file stays. Card 540 × 810 at x 270, y 30. Details: `short/boss-b07-poster-report.md` (r3).
- **E-R5 (Editor, 31 Oct 2026; SCENE-R5 I2/I4 sound re-wire, uncommitted):** `src/videos/hanako/index.ts` `audio` + `assets.lock.json` changed as the sheet says: WP1, MY1, MY2 and TK2–TK6 removed; CB1 piece a F1172–F1784 (fade F1778–F1784), CB1b (file 1.000 s) F1778–F1940, CB1c (file 6.400 s, 0.133) F1940–F2061 (fade F2046–F2061); MN1 F1430–F1456; BZ1/BZ2 F2129–F2147 from `electric_light-flicker-buzz_01` (locked to `public/audio/electric/`). Two 1-frame trims (BZ1 and MN1 start at file 1/30 s) because the library files start with 41–52 ms of silence; BZ2 at file 61/30 s (click at 2.047 s). Measured, not listened: `short/editor-e-r5-report.md`. Open for Boss: ducked tracks render at a per-track gain that `duckGainAt` does not predict (up to about ±1 dB; non-ducked tracks exact); CB1c step measures about +3.2 dB against the sheet's +2.5 dB. Tools: `short/render-sound-range.mjs`, `short/dump-audio-tracks.mts`, `short/measure-sound-range.py`.
