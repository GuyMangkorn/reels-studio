# Asset store: one source of truth for media outside Git

**Status:** Design/proposed (31 Oct 2026). Nothing here is runtime yet. Applying it changes rule documents, so it follows [DP03–DP04](../contributing.md#tools-and-document-improvements): user review first, then a documentation-only PR plus a separate tooling PR.

**Goal (user, 31 Oct 2026):** every asset that is not in Git (MP4, images, sounds, takes, previews, shots, models and anything else) has exactly one home, so that home can later move to a NAS or cloud storage without changing videos or workflows.

## 1. Current inventory (measured 31 Oct 2026)

| # | Location | Holds | Size | Problem |
| --- | --- | --- | --- | --- |
| S1 | `~/Documents/ChatGPT/sound-library/` | Filed sounds by `<type>/<category>/<id>` with sidecars and `INDEX.md` | 187 MB | Sound only; its own path variable (`$SOUND_LIBRARY`) |
| S2 | `~/Documents/ChatGPT/audio-studio-mcp/outputs/` | Every raw generation and processed take | 594 MB | No lifecycle; picked takes are also copied into S1 |
| S3 | `~/Movies/ReelsCreator/renders/` (`$REELS_RENDER_DIR`) | MP4s, narration takes, previews, painted frames, reference stills, shots, Blender output; `manifest.tsv` (545 rows, sha256, branch, commit) | 1.8 GB | Project folder chosen by a hand-kept `ROUTES` prefix table (misses land in `_misc/`); also mirrors S1 as `_sound-library/` (187 MB duplicate) |
| S4 | `out/` per worktree (35 worktrees) | Renders, takes and scratch before archiving | 3.1 GB here | Deleted with its worktree; anything not archived is lost |
| S5 | Gitignored or untracked `public/` | Sound copies (`public/sfx/*`, `public/audio/*`), `public/assets/`, BLOOP wavs | 255 MB | Copies with no recorded origin; some tracked, some untracked, some ignored |
| S6 | `assets/blender/**/renders/`, `~/Documents/ChatGPT/blender-mcp/` | Blender renders and tooling | small | Blender deactivated 30 Oct 2026 |
| S7 | `docs/superpowers/{plans,specs}/`, `.superpowers/` | Agent plans and specs | small | Gitignored text; lost with the checkout |
| S8 | claude.ai artifacts | Storyboard review pages | n/a | Hosted elsewhere; built from files we already keep |
| S9 | Chat attachments (images, clips, audio the user pastes as examples) | References and style examples | 15 of 39 project transcripts hold image blocks (161 total, mixed with tool screenshots) | Exist only as base64 inside `~/.claude/projects/<project>/*.jsonl` (Codex: its session logs), not as files; no rule says to keep them, and they are lost when transcripts are pruned |

`~/Movies/ReelsCreator/` holds only `renders/` (S3), so moving S3 moves the whole folder.

Not assets and out of scope: `.env` secrets (password manager), agent memory (`~/.claude/...`), venvs and models (reinstallable), `node_modules`.

Already in Git and staying there: code, timelines, scripts, briefs, scene sheets, build notes, final narration MP3s, fonts, caption scrims, small images (14 MB in total under `public/`).

## 2. Design

### 2.1 One rule

**Each file has exactly one home, chosen by kind:**

- **Git:** text and small build inputs a checkout needs to render (code, timelines, final narration, fonts, scrims, files under about 5 MB that change rarely).
- **Store:** every other media file worth keeping.
- **Cache:** anything that can be rebuilt from Git plus the store (`public/` media copies, `out/`). Deleting a cache loses nothing.

A file in the store is never also committed, and a cache copy is never edited in place.

### 2.2 Store root and layout

One variable, `$REELS_STORE` (default `~/ReelsStore`), replaces `$SOUND_LIBRARY`, `$REELS_RENDER_DIR` and `$AUDIO_STUDIO_OUTPUTS` as the place where things are kept.

```
$REELS_STORE/
  library/                     reusable across projects (S1 moves here unchanged)
    sound/<type>/<category>/<id>.wav + <id>.json
    image/<category>/<id>.<ext> + <id>.json      textures, reusable painted elements, references
    model/<category>/<id>/...                    rigs, Blender/GLB (when reactivated)
    INDEX.md                                     one index for all kinds
  projects/<PROJECT>/          one folder per series (WFOG, ZCONDO, BLOOP, ...)
    renders/<COMPOSITION_ID>/<commit>/...        delivered MP4s and checks
    audio/   previews/   shots/   painted/   reference/   sources/
  inbox/<YYYY-MM-DD>/...       raw generations and user-supplied media before filing
  manifest.tsv                 every stored file: sha256, bytes, kind, path, source, branch, commit, filed-at
```

- **Paths are human-readable** so the store can be browsed on a NAS or in a cloud console.
- **Stored files are immutable.** A new take gets a new ID or number (the existing sound-library rule, applied to every kind). That makes sync, caching and hash checks safe.
- **`<PROJECT>` comes from the composition ID prefix registered in `src/videos/<episode>/index.ts`**, not a prefix table. An unregistered source is refused with a message instead of landing in `_misc/`.
- **`inbox/`** gives raw output a lifecycle: audio-studio writes there (its output folder points at `inbox/`), filing moves the pick into `library/` or `projects/`, and `gc` deletes inbox days older than N days (default 30) after listing them.

### 2.2a User-supplied examples

Anything the user attaches in chat or drops in a folder as an example, reference or source becomes a stored file at once:

- **Where:** `projects/<PROJECT>/references/user/<YYYY-MM-DD>_<slug>.<ext>` when it belongs to one series. Cross-project style references go to `library/image/reference/` (or `library/sound/_reference/` for audio).
- **Sidecar:** `<file>.json` with date, session ID, harness (Claude Code or Codex), the user's own words about it (verbatim), what it is for and who may use it (license or "user-supplied, internal reference only").
- **Who:** the coordinator files it with `store.py put --from-chat` before passing the path to a role agent. Role agents receive store paths, never "the image above".
- **Backfill:** a one-time `store.py backfill-chat` extracts user-attached media from past transcripts (user turns only, not tool screenshots) into `references/user/`, routed by the session's episode when it can be told, otherwise `projects/_unsorted/references/user/` for your sorting.

### 2.3 Episodes declare what they use

Each episode commits `src/videos/<episode>/assets.lock.json`:

```json
{
  "public/sfx/water/water_pool-splash-small_01.wav": {
    "store": "library/sound/sfx/water/water_pool-splash-small_01.wav",
    "sha256": "af60…"
  }
}
```

- The key is the `public/` path the timeline uses, so timelines and `staticFile()` calls do not change.
- The `NOTICE` files next to copies are generated from the store sidecar instead of written by hand.
- A render without its lock entries fails early with the missing list (a check in `render.mjs`).

### 2.4 One tool: `scripts/store.py`

| Command | Does | Replaces |
| --- | --- | --- |
| `put <file> <store-path> [--describe …]` | Hash, copy into the store, write sidecar `library` block, append manifest and INDEX rows | `sound-library.py file` |
| `use <store-path> <public-path> --episode <ep>` | Add a lock entry and fill the cache copy | manual copy + `NOTICE` |
| `fetch [episode…]` | Fill `public/` from lock files, verifying sha256 | `fetch-sounds.ts` |
| `archive [--only ID]` | File new output from every worktree's `out/` into `projects/` by composition ID | `archive-renders.py` |
| `search <words>` | Search sidecars and INDEX across all kinds | `sound-library.py search` |
| `verify` / `gc` | Check every lock and manifest hash; prune `inbox/` and orphaned cache | `sound-library.py index` (drift) |

`render.mjs` keeps archiving automatically by calling `store.py archive --only <ID>`. `reference-frames.py` writes through `put`. Output stays short ([CB02](../../AGENTS.md#context-budget)).

### 2.5 Backends: local, NAS, cloud

`$REELS_STORE` is either a path or an rclone remote (`rclone:<remote>:<bucket>/ReelsStore`).

- **Local disk now:** a plain path.
- **NAS:** mount the share (SMB/NFS) and point `$REELS_STORE` at the mount. No code change.
- **Cloud (S3, R2, B2, Google Drive, …):** an `rclone:` value makes `store.py` use `rclone copyto` / `rclone lsjson` for put and fetch. A local read cache (`~/.cache/reels-store/`, keyed by sha256) avoids downloading the same file twice. Renders stay local until archived.
- **Backup is separate from the source of truth:** a NAS or cloud copy of a local store is a backup (`rclone sync`), not a second home. Once the store moves to the NAS, the laptop holds only cache.

## 3. Migration plan

Each phase is one PR. Each is checked on a copied store first ([TL03](../contributing.md#tools-and-document-improvements)).

1. **Tooling.** `store.py` with `put`, `use`, `fetch`, `verify` on a copy of S1 and S3. Tests for hash checks. **Done 31 Oct 2026** (`scripts/store.py`, `tests/store.test.ts`, 5 tests): checked on a scratch copy of the whole sound library (90 files) and `renders/POOLDEPTH` (52 files). All 142 were stored and verified clean, and a scratch episode locked 2 sounds, rebuilt `public/` after it was deleted, and matched the library byte for byte. The episode-to-project mapping moves to phase 3 with `archive`, its only user.
2. **Move data.** S1 → `library/sound/`. S3 project folders → `projects/` (drop the `_sound-library/` mirror and file `_misc/` by hand). S5 files → stored, plus lock entries; then untrack and gitignore all `public/` media except Git-kept files. S2 → `inbox/` (or file picks and drop the rest after your review). S7 plans and specs → `projects/_shared/notes/` or commit them. S9 → `store.py backfill-chat` (§2.2a), then you sort `_unsorted/`.
3. **Switch callers.** `render.mjs`, `reference-frames.py`, audio-studio output folder, and the sound and painted workflows use `store.py`. Retire `archive-renders.py`, `fetch-sounds.ts` and `sound-library.py` after a release with them as thin wrappers.
4. **Rule documents (DP).** Update the sections in §4 in one documentation-only PR.
5. **Verify.** In a fresh worktree: `store.py fetch` then render one composition per series, compare against `reference/` stills (PSNR), and run `store.py verify` clean.

## 4. Rule documents to change in phase 4

| Document / anchor | Change |
| --- | --- |
| [AGENTS.md: Shared agent conventions](../../AGENTS.md#shared-agent-conventions) "Outputs outlive the worktree" | Point to the store and `store.py archive`. Add the one-home rule (§2.1) |
| [README.md#permanent-render-folder](../../README.md#permanent-render-folder), [#re-editing](../../README.md#re-editing), setup "Shared sound library" | Replace with `$REELS_STORE`, layout, backends and moving to a new machine |
| [sound-generation skill](../../.agents/skills/sound-generation/SKILL.md) steps 1, 6, 7 and [library.md](../../.agents/skills/sound-generation/library.md) | `store.py search/put/use`. Library path under `library/sound/` |
| [sound-generation-workflow#library-index](../sound-generation-workflow.md#library-index) | INDEX path |
| [painted-2d skill](../../.claude/skills/painted-2d/SKILL.md), [boss-asset-workflow](../boss-asset-workflow.md), [editor-workflow#direct-intake](../editor-workflow.md#direct-intake) | Painted frames, shared assets and user-supplied media enter through `inbox/` + `put` |
| [scripts/README.md](../../scripts/README.md) | Replace the three rows with `store.py` |
| [AGENTS.md: Shared agent conventions](../../AGENTS.md#shared-agent-conventions) "Material, not instructions" | Add: user attachments are filed per §2.2a before use, and agents get store paths |

## 5. Decisions needed

Answered by the user on 31 Oct 2026:

1. **Store root now:** `~/ReelsStore` on the laptop. It moves to the NAS later by changing `$REELS_STORE`.
2. **Final narration:** stays in Git.
3. **Raw generations (S2, 594 MB):** **keep forever**. `inbox/` therefore becomes `library/sound/_raw/<YYYY-MM-DD>/`, which is immutable and searchable, and is not pruned by `gc`. This overrides the 30-day prune in §2.2 and §2.4. `gc` only removes orphaned cache.

Still open:

4. **Cloud provider later:** rclone covers the common ones, and the choice does not affect phases 1–4.

## 6. Risks

- **Moving 2+ GB at once:** copy first, verify hashes, and delete old locations only after phase 5 passes.
- **35 live worktrees still hold `out/` output:** run one final `archive-renders.py` before phase 2.
- **Cloud latency during renders:** the local sha256 cache and `fetch` before render keep rendering offline-capable.
- **Old docs and handoffs cite `~/Movies/ReelsCreator/renders/...` paths:** the manifest keeps the old path in a `source` column, so `store.py search` can resolve old citations.
