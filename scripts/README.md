# Scripts

Shared tools any role may run. Check here before writing a one-off command. A procedure that agents repeat becomes a script under the [tooling rule](../docs/contributing.md#tools-and-document-improvements). Episode-only scripts stay in `scripts/<episode>/` or the asset folder, and are listed in that episode's `build-notes.md`.

| Script | Does | Run |
| --- | --- | --- |
| `render.mjs` | Renders compositions, stills or frame lists into `out/<CompositionId>/`; parallel-safe | `npm run render -- <CompositionId> [--stills] [--frames=90,210]` |
| `narration.py` | Local Edge TTS narration (default Niwat +5%; female: `--voice th-TH-PremwadeeNeural`; `--rate`) plus the committed 30 fps RMS envelope | `npm run narration -- …` |
| `voice-preset.py` | One Thai line in a character register (child, elderly, alternate adult) from Edge TTS + ffmpeg; child/elderly via Praat/WORLD in the `out/voice-venv` venv ([voice-tuning skill](../.agents/skills/voice-tuning/SKILL.md)) | `out/voice-venv/bin/python -I scripts/voice-preset.py --preset child-girl --text "…" out.wav` |
| `narration_files.py` | Narration from supplied per-beat audio files (e.g. Botnoi) plus the envelope | `python3 scripts/narration_files.py …` |
| `transcribe.py` | Thai speech to text (faster-whisper), for intake or caption QA | `python3 scripts/transcribe.py …` |
| `loudness.mjs` | Two-pass loudnorm on a finished MP4 (≈ −14 LUFS, ≤ −1 dBTP), video copied | `node scripts/loudness.mjs …` |
| `qa-sheet.sh` | Downscales and tiles frames into one PNG for an agent to view ([CB03](../AGENTS.md#context-budget)) | `scripts/qa-sheet.sh out.png [--cols 4] [--width 270] f1.png f2.png …` |
| `caption-breaks.mjs` | Thai caption line breaks: authored breaks that split a word, cues over 2 lines, lines likely to wrap ([editor step 5](../docs/editor-workflow.md#steps-and-completion-criteria)) | `node scripts/caption-breaks.mjs <cue JSON> [--max 26]` |
| `caption-zone.py` | Caption band background brightness per frame, plus an overlay of the caption-safe box and band ([caption safe zone](../docs/production-requirements.md#vertical-caption-safe-zone)) | `python3 -I scripts/caption-zone.py [--band 860:1248] [--overlay-dir DIR] f1.png …` |
| `zombie-condo-paint/label-sheet.py` | Labelled review sheet: frames at a fixed width, each with its label lines (shot ID, clocks, plate frame), rendered by headless Chrome ([preview labels](../docs/boss-asset-workflow.md#preview-labels)) | `python3 -I scripts/zombie-condo-paint/label-sheet.py MANIFEST.tsv OUT.png [--cols 3] [--width 540] [--title TEXT]` |
| `zombie-condo-paint/place-narration.py` | ZCPAINT Editor: Edge TTS per VO line (`short/vo-<LANG>.json`), each onset pinned to its anchor, overlap check, loudness to the export target, `ZCPAINT-SHORT-<LANG>.lines.json` and the 30 fps envelope | `python3 -I scripts/zombie-condo-paint/place-narration.py --lang TH --total 71.2 --write` |
| `zombie-condo-paint/measure-sfx.py` | Sound candidate measurement for cue selection (peak, RMS, onset, tail, dB envelope); agents cannot listen, so a measured pick is not an audio approval | `python3 -I scripts/zombie-condo-paint/measure-sfx.py FILE.wav ...` |
| `zombie-condo-paint/copy-sounds.sh` | Copies the shared-library IDs used by ZCPAINT-SHORT into `public/sfx` and `public/audio`, adds the NOTICE block (idempotent) | `bash scripts/zombie-condo-paint/copy-sounds.sh` |
| `zombie-condo-paint/editor-stills.sh` | ZCPAINT Editor stills from the real registry (`--gl=angle`), per-ID output under `out/samples/`, TSV manifest | `sh scripts/zombie-condo-paint/editor-stills.sh REVISION ZCPAINT-SHORT-TH B01:45,B02:180` |
| `zombie-condo-paint/render-chunks.sh` | ZCPAINT-SHORT MP4 in frame chunks (fresh bundle, `--gl=angle`, progress under `out/logs/`), joined, then `loudness.mjs` in place and an ffprobe check; resumable per chunk | `sh scripts/zombie-condo-paint/render-chunks.sh ZCPAINT-SHORT-TH 534` |
| `shot-projection.py` | Projects scene-sheet anchors through the shot camera to pixels: lead height, screen side, caption-band overlap ([Mark pre-handoff checks](../docs/mark-storyboard-workflow.md#pre-handoff-checks)) | `python3 -I scripts/shot-projection.py shot.json [--min-height 480]` |
| `check-links.py` | Relative Markdown links and `#anchors`; changed files by default | `python3 -I scripts/check-links.py [--all \| FILE.md …]` |
| `sound-library.py` | Shared sound library: search sidecars, file a processed sound (copy + `library` block + INDEX row), check INDEX drift | `python3 -I scripts/sound-library.py search zombie` |
| `usage-report.py` | Token usage of this project's Claude Code sessions and role agents ([CB05](../AGENTS.md#context-budget)); `--by-model` adds API dollars per role, model and effort, `--rework` repeat runs per role and branch | `python3 -I scripts/usage-report.py [--since YYYY-MM-DD] [--by-model] [--rework]` |
| `hooks/agent-run-log.py` | PreToolUse hook (`.claude/settings.json`): logs each role agent's starting model and effort to `out/logs/agent-runs.jsonl` in the main checkout, for `usage-report.py --by-model` | Runs automatically in Claude Code sessions |
| `git-hooks/post-checkout` | Moves every new `git worktree add` onto freshly fetched `origin/main` (only when the start point has no commits of its own) | Install once per clone: `ln -s ../../scripts/git-hooks/post-checkout .git/hooks/post-checkout` |

Each script's header comment is its full usage.
