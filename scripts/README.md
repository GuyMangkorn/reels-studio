# Scripts

Shared tools any role may run. Check here before writing a one-off command. A procedure that agents repeat becomes a script under the [tooling rule](../docs/contributing.md#tools-and-document-improvements). Episode-only scripts stay in `scripts/<episode>/` or the asset folder, and are listed in that episode's `build-notes.md`.

| Script | Does | Run |
| --- | --- | --- |
| `render.mjs` | Renders compositions, stills or frame lists into `out/<CompositionId>/`; parallel-safe | `npm run render -- <CompositionId> [--stills] [--frames=90,210]` |
| `narration.py` | Local Niwat (+5%) narration plus the committed 30 fps RMS envelope | `npm run narration -- …` |
| `narration_files.py` | Narration from supplied per-beat audio files (e.g. Botnoi) plus the envelope | `python3 scripts/narration_files.py …` |
| `transcribe.py` | Thai speech to text (faster-whisper), for intake or caption QA | `python3 scripts/transcribe.py …` |
| `loudness.mjs` | Two-pass loudnorm on a finished MP4 (≈ −14 LUFS, ≤ −1 dBTP), video copied | `node scripts/loudness.mjs …` |
| `qa-sheet.sh` | Downscales and tiles frames into one PNG for an agent to view ([CB03](../AGENTS.md#context-budget)) | `scripts/qa-sheet.sh out.png [--cols 4] [--width 270] f1.png f2.png …` |
| `check-links.py` | Relative Markdown links and `#anchors`; changed files by default | `python3 -I scripts/check-links.py [--all \| FILE.md …]` |
| `sound-library.py` | Shared sound library: search sidecars, file a processed sound (copy + `library` block + INDEX row), check INDEX drift | `python3 -I scripts/sound-library.py search zombie` |
| `usage-report.py` | Token usage of this project's Claude Code sessions and role agents ([CB05](../AGENTS.md#context-budget)) | `python3 -I scripts/usage-report.py [--since YYYY-MM-DD]` |

Each script's header comment is its full usage.
