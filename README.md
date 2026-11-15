<a id="from-storyboard-to-video"></a>
# reels-studio

A Thai YouTube studio that develops videos from scene handoffs, using Remotion for timing and export, and Three.js for 3D sets, cameras, depth and lighting. Existing 2D cut-out characters and screen overlays can be combined with 3D scenes when the scene handoff calls for them.

Choose Shorts, YouTube Long or both before scriptwriting through the [delivery workflow](docs/delivery-workflow.md). Each selected video has its own script, factual review, visual brief, scene-handoff set, timeline and audio/subtitle timing, using shared research and reusable assets. [Production requirements](docs/production-requirements.md#outputs-and-story-timing) define duration, dimensions and fps. Both means one Short and one Long by default; extra Shorts require explicit scope. Shorter scene handoff fragments and asset demos are development previews.

Agents start at [AGENTS.md](AGENTS.md), the task router for authoritative workflows and requirements. `AGENTS.md`, `GLOSSARY.md`, the shared workflow and principle docs, the skills and the role configs are symlinks into the home repo `~/Developer/reels-home` ([repositories](AGENTS.md#repositories)): clone it there first, edit and commit shared files there, and relink with `~/Developer/reels-home/bin/link-home.sh .` after it gains a file. Agent-facing documentation is English; narration, subtitles and other viewer-facing copy remain Thai.

Pick a [style profile and pipeline tier](docs/delivery-workflow.md#style-profile) per video: the full illustrated-story pipeline, a lighter script→brief→edit path, or Editor alone on user-supplied footage ([direct intake](docs/editor-workflow.md#direct-intake)). The full planning handoff is **Boat research → Preaw script → Boat fact-check → Film visual/technical brief and written scene handoff → Boss shared assets → Editor integration/editing**. [Film](docs/film-visual-brief-workflow.md) chooses suitable 2D/3D/hybrid techniques, lighting and camera language, and specifies how the parts can work together. [Film](docs/mark-storyboard-workflow.md) develops the brief into written scene sheets for Editor. Sets, characters and interaction props may all use 2D or 3D as appropriate; actual capabilities still require checkout verification. Agent files, including role instructions, live in `.codex/agents/`; this is a handoff convention, not an automatic runner.

[docs/remotion-toolkit.md](docs/remotion-toolkit.md) maps the installed animation, text layout, noise, captions, transitions, sound and SVG tools to reusable scene components, with examples and integration checks. Run `npm run lint` for the Remotion, TypeScript and React Hooks checks.

## From written handoff to video

1. **Film brief:** select the visual approach, coordinate/physical baseline and projection per selected deliverable.
2. **Film scene sheets:** specify stable shot/key-state IDs, numeric placement/paths with spaces/units, camera, acting, light, frame timing, Thai narration/subtitles and acceptance criteria. Capture useful existing elements with source/revision labels when available.
3. **Boss shared assets:** implement missing reusable art/rigs/props/sets and renderer capabilities once; verify contracts and affected consumers. In parallel, **Ton** makes each cue's sound from the scene sheets' Sound lines and writes the [sound cue sheet](docs/sound-generation-workflow.md#sound-cue-sheet).
4. **Editor blockout and edit:** assemble a deterministic timeline from those sheets and supported assets; review action, pacing, contact, reveals and continuity before polish, then integrate audio/captions/effects/transitions under [editing principles](docs/editor-principles.md).
5. **Samples and QA:** Editor sends one inspected actual Remotion frame per story scene per selected deliverable, with composition/frame/revision metadata. Complete motion/seek/continuity QA separately before delivery.

Written packs stay under `storyboards/<episode>/<selected-variant>/` with scene `.md` sheets, `visual-brief.md` and `index.md`; the directory name preserves existing paths. Excalidraw drawings are retired. Generated element captures, samples and QA belong in ignored `out/`; see [Film handoff](docs/mark-storyboard-workflow.md) and [Editor workflow](docs/editor-workflow.md).

## Current implementation

The JSON scene pipeline already exists in [SceneRenderer](src/scenes/SceneRenderer.tsx), [scene types](src/scenes/types.ts) and [timeline validation](src/scenes/timeline.ts). [Root.tsx](src/Root.tsx) registers every composition declared by an episode registry under `src/videos/<episode>/index.ts`, with duration derived from the timeline; see [Videos and parallel work](#videos-and-parallel-work). `Rig2DDemo` and the original seven-second hand-written rig demo are historical APIs.

The historical `main` baseline ships the reusable 2D human/cat/dog library and a five-shot JSON demo. Three.js integration and episode-specific assets are under development on working branches. The intended home for shared 3D staging is `src/three/`, with cameras under `src/camera/`. Check the active branch's source and validator for available sets and camera fields; a requested asset or planned POV example is not automatically implemented.

[docs/character-toolkit.md](docs/character-toolkit.md) documents the existing rig, pose tracks and JSON layout. [Planned visual components](docs/planned-visual-components.md) contains overlay and POV designs, explicitly separate from the [runtime contract](docs/runtime-contract.md).

## Setup and preview

```bash
npm ci
npm start
```

Studio opens the compositions declared under `src/videos/`, grouped in one folder per episode. The baseline demo expects local `public/narration.mp3` plus the committed amplitude envelope in `src/amplitude.json`. To generate its Niwat Thai narration at +5%, `npm run narration` requires Python with `edge-tts==7.3.1` and sends the demo subtitle text to the TTS provider. For a silent custom preview, pass `narration: null` as an input prop.

### Claude Code / Codex setup

Agent instructions travel with the repository: `CLAUDE.md` → `AGENTS.md`, role agents in `.claude/agents/` and `.codex/agents/`, and `docs/`. A new account or machine needs only the local tools below.

- **audio-studio MCP** (sound generation): declared for Claude Code in `.mcp.json`; approve it on first open. Install [audio-studio-mcp](https://github.com/kanaworksai-hue/audio-studio-mcp) with its `install.sh`; `.mcp.json` points to `~/Developer/audio-studio-mcp` with absolute paths (the Claude desktop app does not expand `${VAR}` in MCP commands), so edit those paths if it is installed elsewhere. Generations are written to `$REELS_STORE/library/sound/_raw` (`AUDIO_STUDIO_OUTPUT_DIR` in `.mcp.json`; restart the server after changing it). Codex registers it separately in its own config.
- **youtube-analytics MCP** (posted-video numbers, read-only scopes): declared in `.mcp.json` and `opencode.json`, pointing to `~/Developer/youtube-analytics-mcp` (a local `server.py`; setup and Google Cloud steps in its README). Tools `list_videos`, `query`, `video_report`; feeds [channel performance](channels/edu/performance.md). "Viewed vs swiped away" exists only in YouTube Studio; `engagedViews / views` is the API proxy.
- **Asset store:** `~/ReelsStore` (`$REELS_STORE`; outside Git and iCloud; copy it to the new machine, then run `python3 -I scripts/store.py verify`). The shared sound library is its `library/sound/` ([`sound-generation` skill](.agents/skills/sound-generation/library.md)).
- **Blender MCP** (Blender assets/shots only): enable the Blender connector in the Claude desktop app and the MCP add-on in Blender; see [Blender MCP workflow](docs/blender-mcp-workflow.md).
- **Optional plugins:** `remotion` skills (Remotion docs/best practices) and `superpowers`; install from the plugin marketplace. Nothing in the workflows requires them.
- **Transcription:** local `.venv-whisper/`; see the faster-whisper notes under [Render and verify](#render-and-verify).

## Timeline data

The executable timeline is an array of scenes. This example uses fields supported by the baseline renderer:

```json
[
  {
    "durationSec": 4,
    "bg": "room",
    "time": "night",
    "actors": [
      {"id": "host", "type": "narrator", "pose": "shock", "x": 0.4}
    ],
    "subtitle": "คืนแรก... มีเสียงดังจากชั้นบน"
  }
]
```

Each composition's default timeline is selected in its episode registry, `src/videos/<episode>/index.ts`. To preview another timeline, supply input props with a `timeline` array and optional `narration` and `ending`. Keep scene/shot/key-state IDs mapped to timeline indices in the shot sheet. For new 3D camera, lighting or asset options, extend types, validation and scene dispatch together before adding those fields to an episode.

## Render and verify

`scripts/render.mjs` renders the composition IDs it is given with both `_A_fade` and `_B_loop` endings (or `--endings=`, e.g. `C_seamless` for a seamless Reels loop), or `--stills` at `--frames=`. Output goes to `out/<CompositionId>/`. Each exported MP4 is loudness-normalized in place to about −14 LUFS / ≤ −1 dBTP and the before/after levels are logged. Videos render one scene at a time and each scene is kept in `$REELS_STORE/cache/segments/<CompositionId>/` ([rule](AGENTS.md#shared-agent-conventions)): a second render reuses every scene whose inputs did not change: an edited scene re-renders, and a neighbour only where the renderer reads it (actor poses or a first-cue dissolve from the previous scene, an entry transition into the next, the C_seamless or B_loop wrap to the first scene); a duration change re-renders every scene (the total length is in every key), and so do narration timing and shared code; sound-only edits (SFX, audio tracks, sound locks, the narration file) re-render no picture. The scenes are then joined with the whole-video sound. `--range=a-b` renders the scenes those frames touch into the cache, then writes just the range to `out/<id>/range/`; `--draft` renders the blocking draft (flat washes, no hatching) to `out/<id>/draft/`; `--preview` renders a half-size quick look to `out/<id>/preview/` (none of these archived); `--no-cache` renders every scene again. Approved finals are pinned with `scripts/pin.mjs`: a render that would change a pinned scene stops until `--keep-pinned` or `--repaint=<shot,...|all>` ([shot-by-shot review](docs/sequence-workflow.md#painted-shot-by-shot)). Set `BROWSER_EXECUTABLE` to use an installed Chromium.

```bash
npm run render -- CATBOX-C01-Short
npm run render:short          # historical Short
npm run render:long
npm run render:stills
```

For direct composition renders:

```bash
npx remotion render src/index.ts Short out/short.mp4
npx remotion render src/index.ts Long out/long.mp4
```

Check contracts and representative frames before a visual PR (full requirements: [contribution workflow](docs/contributing.md) and [Boss QA](docs/boss-asset-workflow.md#visual-and-runtime-qa-before-push)):

```bash
npm run lint
npm run typecheck
npm test
npx remotion render src/index.ts Short out/short-check.mp4 --frames=0-5
npx remotion render src/index.ts Long out/long-check.mp4 --frames=0-5
```

Also inspect the scene handoff's key action/reveal frames and the start/middle/end of camera moves. Check 3D depth ordering, actor contact, clipping and subtitle safety in each selected or affected output. Narration uses Niwat (`th-TH`) at +5%; Thai subtitles use Noto Sans Thai or Sarabun from frame 0. Hold the closing line or final beat for about 3 seconds. Use the shared `A_fade` and `B_loop` endings and review the loop seam.

`out/`, generated MP4 files, other MP3 files, dependencies and secrets are gitignored. Commit the final narration track `public/narration/<CompositionId>.mp3` (exception, 31 Oct 2026: Gemini TTS reads cannot be regenerated identically), timeline/amplitude JSON, written scene sheets, reusable assets and their commercial-use license notices.

<a id="videos-and-parallel-work"></a>
## Videos and parallel work

Each episode owns `src/videos/<episode>/index.ts`, whose default export is `{episode, videos}` (see `src/videos/types.ts`). `Root.tsx` discovers these files automatically, so adding or changing a video edits only that episode's folder and its `scripts/<episode>/` and `storyboards/<episode>/` packs. Composition IDs must be unique across episodes; `npm test` rejects duplicates and validates every registered timeline. Episode-only components may live beside the registry; anything a second episode needs belongs in the shared `src/scenes/`, `src/assets/` or `src/rig/` owners.

Two videos can be produced at the same time without colliding:

- Renders: each `scripts/render.mjs` run bundles into its own temp directory, picks a free port and writes only `out/<CompositionId>/`, then archives that folder (see the next bullet).
- <a id="asset-store"></a><a id="permanent-render-folder"></a>Asset store: every media file kept outside Git has one home in `$REELS_STORE` (default `~/ReelsStore`, outside iCloud), managed by `scripts/store.py` ([design](docs/reviews/2026-10-31-asset-store-proposal.md)). `library/` holds reusable material (`sound/` with `INDEX.md`, `sound/_raw/` for every audio-studio generation, `image/`), and `projects/<channel>/<PROJECT>/` holds per-series output, where `<channel>` is `edu`, `fiction`, `legacy` (series made before the channels were split) or `shared` (`KIT`, `_shared`: material both channels use) and `SERIES` in `scripts/store.py` maps each series to its channel; a new series is added there before its first file is stored, and `store.py` rejects any other `projects/` path (`renders/<CompositionId>/<commit>/`, `reference/`, `audio/`, `previews/`, `references/user/` for files the user supplied). `manifest.tsv` records sha256, source, branch and commit for every file. Stored media is immutable: a new take gets a new name, and metadata (`.json` sidecars, `.md` indexes) may be edited. `render.mjs` archives renders automatically. Other output is filed with `store.py archive --path <dir> --project <PROJECT> --kind <kind>`, and `store.py archive --all-worktrees` lists anything not yet stored. Run it before removing a worktree. `store.py prune <gitignored dir> [--delete]` frees a folder of copies already stored and of scratch (`qa`, bundles, venvs, logs, tmp), which is never archived. `public/audio`, `public/sfx` and `public/pool-depth` media are gitignored cache: each episode's `src/videos/<episode>/assets.lock.json` maps them to store paths with sha256, `store.py use` adds an entry, and `store.py fetch` restores them.
- <a id="publish-folder"></a>Publish folder: the files the user posts live only in `$REELS_STORE/publish/<channel>/<PROJECT>/<CompositionId>/`, one folder per video holding exactly `<ID>.mp4`, `<ID>_cover.png`, `publish.json` (sources, sha256, commit, status, title) and `history.tsv` (every change and why); `publish/INDEX.md` lists every video with its status (`ready`, `posted <date>`, or re-cut after posting). It is the one mutable folder in the store: `python3 -I scripts/store.py publish <ID> [--video <stored delivery render>] [--cover <path>] [--posted <date>] [--title <t>] --reason "<why>"` replaces the files in place with APFS clones of stored files (no extra space), while the originals stay immutable under `renders/`. `--video` defaults to the newest delivery render and refuses draft, final-cut, range and clip renders; a local cover file is stored first. Any new delivery render or cover change is published in the same turn (W8.2, [cover principles](docs/cover-principles.md)); a file outside `publish/` is not final ([design](docs/reviews/2026-11-07-publish-folder-proposal.md)).
- <a id="re-editing"></a>Re-editing a finished video: the MP4 is only a reference; a video is re-edited by changing its source and rendering again. Keep all four inputs: (1) the code and timeline in git (`src/videos/<episode>/`, `scripts/<episode>/`, scene sheets); (2) the final narration `public/narration/<CompositionId>.mp3` committed ([production requirements](docs/production-requirements.md)), with per-line takes in the [asset store](#asset-store) for replacing single lines; (3) every `public/` sound and picture the timeline uses, locked in `assets.lock.json` and restored with `python3 -I scripts/store.py fetch`; (4) any supplied or generated picture that is not code, committed or stored. The store manifest records the commit that produced each render (`<commit>-dirty-<time>` = uncommitted changes at render time): check that commit out, `fetch`, insert or change shots, audio or captions in `index.ts`, then render. Each delivered video also has reference stills at `projects/<channel>/<PROJECT>/reference/<CompositionId>/<commit>/` (a PNG every 5 s, `hashes.tsv` with SHA-256 and PSNR against the delivered MP4); `python3 -I scripts/reference-frames.py <CompositionId>` re-renders them and reports how many frames are byte-identical, and a PSNR above about 35 dB against the MP4 means the picture still matches. Make a reference set whenever a video is delivered.
- Narration: `npm run narration -- --timeline scripts/<episode>/<variant>/timeline.json --name <CompositionId>` writes `public/narration/<CompositionId>.mp3` and `<CompositionId>.amplitude.json` beside the timeline. Reference them from the video's `narration` field. Without arguments it regenerates the demo's `public/narration.mp3` and `src/amplitude.json`. A timeline entry may carry `leadSec` to delay its speech inside its slot (the overrun check then ignores trailing TTS silence).
- Transcription: `.venv-whisper/bin/python scripts/transcribe.py <audio-or-video> [--timeline scripts/<episode>/<variant>/narration-timeline.json]` runs faster-whisper (`large-v3-turbo`, Thai) locally, writes `out/transcripts/<name>.srt`/`.json` and, with a timeline, reports per slot how closely the audio matches its spoken text and where speech starts. Setup: `python3 -m venv .venv-whisper && .venv-whisper/bin/pip install faster-whisper "av>=14,<17"`; the first run downloads the model (about 1.6 GB). Thai word times are rough: use it to find lines to listen to, not as caption timing.
- Episode QA scripts keep their own `out/qa/<episode>/...` folders.

## Code ownership

| Path | Responsibility |
| --- | --- |
| `src/Root.tsx`, `src/index.ts` | Generic composition registration (auto-discovers episode registries) and Remotion entry; no per-episode edits |
| `src/videos/<episode>/` | One episode's composition list (ID, format, timeline, ending, narration) and any episode-only components |
| `src/scenes/` | Scene contracts, validation, sequencing, subtitles and endings |
| `src/rig/` | Shared 2D skeletons, poses, appearance and animation drivers |
| `src/assets/` | Reusable 2D backgrounds, props and screen overlays as implemented |
| `src/three/` | Shared 3D stage, sets, geometry/material helpers and cut-out integration; under development |
| `src/camera/` | Shared camera behavior; under development |
| `storyboards/` | Written scene sheets, visual briefs and sequence indices; created on first use |
| `scripts/` | Episode/chapter JSON and narration/render helpers |
| `public/` | Licensed fonts and local media |

## Documentation map

- [Production requirements](docs/production-requirements.md): output formats, timing, Thai narration/subtitles, reusable assets and licensing.
- [Editor workflow](docs/editor-workflow.md): integration, editing and actual scene-frame samples.
- [Editing principles](docs/editor-principles.md): Reels and 9–10 minute video rhythm, sound, effects and transitions.
- [Sequence workflow](docs/sequence-workflow.md): handoff-to-runtime authoring, blockout, boundaries and continuity.
- [Runtime contract](docs/runtime-contract.md): capability evidence and module ownership.
- [Planned visual components](docs/planned-visual-components.md): overlay and POV design specifications.
- [Contribution workflow](docs/contributing.md): issues, branches, verification and PR delivery.

The role workflows linked from [AGENTS.md](AGENTS.md) own their detailed handoff and review procedures. Requirements, defaults, reference examples and proposed capabilities are labeled separately.
