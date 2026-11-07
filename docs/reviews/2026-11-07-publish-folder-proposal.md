# Publish folder: one place for the files the user posts (proposal, 7 Nov 2026)

Status: **accepted** (user, 7 Nov 2026: build now, folder name `publish/`, backfill one series at a time). Applied in README `#publish-folder`, AGENTS.md, cover-principles, delivery-workflow (task file), sequence-workflow W8 and render-rules; `store.py publish` implemented. The rule text lives in those documents; this file is the rationale. Implementation differences from the sketch below: per-folder `publish.json` replaces `post.md`.

## Problem (measured 7 Nov 2026)

The user posts from `~/ReelsStore` and cannot tell which MP4 and which cover are final.

- 1,010 MP4 files under `projects/`. Delivery, final-cut, draft and per-scene clips share `renders/<ID>/<commit>/`. `EDU-EP05-SHORT` alone has many commit folders.
- `EDU-EP03-SHORT_cover.png` exists in **four** commit folders. Nothing says which one was posted.
- Covers also sit in ad-hoc folders (`projects/EDU/covers/`, `covers/ep04/`), next to drafts such as `cover-A.2884e4d7.png`.
- Project folders are mixed: `EDU`, `EDU-EP03`, `EDU-EP03-SHORT` and `EDU-EP05` all exist.
- Six posted videos have W8.2 marked `not recorded` (hanako, kuchisake-onna, the-bloop, wendigo …).

**Root cause.** The cover rule says to put the picked cover "beside the MP4". Because the store is immutable, every re-render or cover fix adds another folder, and none of them is marked as the current one.

## Design

### PF01: publish folder

```
$REELS_STORE/publish/
  INDEX.md                      # one row per deliverable: series, ID, status, date, title
  EDU/
    EDU-EP05-SHORT/
      EDU-EP05-SHORT.mp4        # the file to upload
      EDU-EP05-SHORT_cover.png  # the cover to upload
      post.md                   # title, caption, hashtags, status, source paths + sha256 + commit
      history.tsv               # every publish: date, file, sha256, source path, reason
    EDU-EP06-SHORT/ …
  KSO/
    KSO-EP01-SHORT-C/ …
```

- One folder per **CompositionId**, grouped by series (`project_of()` in `store.py`). Episodes that run in parallel, such as EDU EP01–EP06, never collide because each one owns its own folder.
- Each folder holds exactly one MP4 and one cover. The user only looks here.
- `publish/` is the **only mutable media folder** in the store. It holds copies (APFS clone, so no extra disk space). The immutable originals stay in `renders/`. `history.tsv` and `manifest.tsv` record every replacement, so nothing is lost.
- `INDEX.md` statuses: `ready` (published, not yet posted) → `posted <date>` → `superseded` (a re-cut after posting, with the reason).

### PF02: one command writes it

`python3 -I scripts/store.py publish <ID> [--video <store path>] [--cover <store path>] [--posted YYYY-MM-DD] --reason "<why>"`

- `--video` accepts only a delivery render (`render.mjs` without a review flag). It refuses draft, final-cut and clip files.
- If `--video` is omitted, the command uses the newest delivery render of `<ID>`.
- The command copies the file, updates `post.md`, `history.tsv` and `INDEX.md`, and prints the publish folder path.
- `--posted` changes only the status. The coordinator runs it when the user says the video is up (W8.3).

### PF03: any change republishes in the same turn (Requirement)

A new delivery render, a cover pick or a cover fix counts as done only after `store.py publish` has run and the coordinator has given the user the publish path. A file that is not in `publish/` is not final, wherever else it sits.

### PF04: task file

- W8.2 becomes "Delivery render **published**: `publish/<PROJECT>/<ID>/`".
- W8.3 is ticked together with `--posted`.

### PF05: backfill once

For each delivered ID, the user picks the posted MP4 and cover from a short list (newest delivery render plus the cover candidates). Those picks are published with `--posted <date>` and `--reason backfill`. The coordinator asks one structured question per series.

## Document changes (applied in a docs-and-tooling PR after approval)

| File | Change |
| --- | --- |
| `AGENTS.md` | "One home per file" bullet: add "the files the user posts live only in `publish/` (PF01–PF03)". Coordinator duties: add "publish after every delivery render or cover change". |
| `README.md#asset-store` | Add `publish/` and its exception to immutability. Point to `store.py publish`. |
| `docs/cover-principles.md` (intro) | Replace "copied beside the MP4 … `store.py put`" with `store.py publish <ID> --cover`. A later cover fix republishes. |
| `docs/delivery-workflow.md` (task file) | Update the W8.2 and W8.3 wording and the "Posted" bullet (`--posted`). |
| `docs/sequence-workflow.md` W8 row | Output: `publish/<PROJECT>/<ID>/`. |
| `docs/render-rules.md` (Delivery stage) | Add: after delivery, publish (PF03). |
| `scripts/store.py`, `scripts/README.md`, `docs/context-map.md`, tests | Add the `publish` subcommand, a test, and map entries. |

## Out of scope / later

- Cleaning old clip and draft MP4s from `renders/` (a separate `prune` policy).
- Merging the `EDU-EP03`/`EDU-EP05` stray project folders into `EDU` (needs a `store.py mv` that rewrites the manifest).
