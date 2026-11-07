# Project folder layout in the asset store (proposal, 7 Nov 2026)

Status: **accepted** (user, 7 Nov 2026: build now; archived QA and legacy 3D go to `_legacy`, nothing deleted). Rule text: [README project layout](../../README.md#project-layout). Implementation differences: `public` is an extra kind (`adopt`); `references/user/` stays series-level; `KIT/` is exempt (src/painted/kit owns its paths); ZOMBIE-7ELEVEN (no composition ID yet) waits in `_unsorted/`.

## Problem (measured 7 Nov 2026)

`$REELS_STORE/projects/` has 26 top folders. The README rule ([asset store](../../README.md#asset-store)) names a few subfolders (`renders/`, `reference/`, `audio/`, `previews/`, `references/user/`), but nothing enforces them. The gaps:

| Gap | Evidence |
| --- | --- |
| G1. `--project` is free text, so an episode ID becomes a project | `EDU-EP03/`, `EDU-EP05/`, `EDU-EP03-SHORT/`, `WDG-EP01-SHORT/` next to `EDU/` and `WDG/` |
| G2. `--kind` and `put` paths are free text, so the episode and round end up in the folder name | `EDU/w53-ep03-clips-round-f` (135 files), `w53-ep02-clips`, `ep05-r111`, `w6-final-ep03-flat`, `stills-e2` |
| G3. No episode level under a kind, so series episodes mix | `EDU/previews` (649 files) and `EDU/covers` (86 files) hold every EDU episode together |
| G4. The same thing has several names | `narration` / `narr-samples` / `narration-samples` / `samples` / `vo` / `voice-sample`; `reference` (reference frames) next to `references` (user files) |
| G5. Scratch got archived even though `qa` is never archived | `EDU/qa`, `EDU-EP03/qa`, `HANAKO/qa-sheets`, `qa-capzone`, `w53-ep03-b06sh02-run-qa` |
| G6. Loose files and legacy engines sit at the top | `HAUNTED/*.mp4`, `blender/`, `shots/`, `spike/` |

**Root cause.** The rule lists examples, not a schema, and `store.py` accepts any path. Every agent invents a name when the list does not fit.

## Design

### PL01: one path schema (Requirement)

```
projects/<SERIES>/<kind>/<CompositionId>/<label>/<file>
```

- `SERIES` = `project_of(<CompositionId>)` (EDU, KSO, WDG …). It is never an episode ID.
- `label` is optional: a review round, date or take set (`r111`, `w5-round-f`, `2026-11-07`).

| kind | Holds | Replaces |
| --- | --- | --- |
| `renders` | `render.mjs` output `<ID>/<version>/` (unchanged) | — |
| `reference` | reference frames `<ID>/<commit>/` (unchanged) | — |
| `review` | storyboard review page, draft/final clips, review stills | `w53-*`, `clips`, `review-page`, `ep05-r111`, `w6-final-*`, `review` |
| `previews` | look frames, element stills, plates, spikes | `previews`, `stills-e2`, `w52-element-stills`, `look-frames`, `painted`, `spike` |
| `covers` | cover candidates and fixes (the pick goes to [publish](../../README.md#publish-folder)) | `covers` |
| `audio` | narration takes, voice samples, stems | `audio`, `narration`, `narr-samples`, `narration-samples`, `samples`, `vo`, `voice-sample` |
| `references` | user-supplied and research material (`references/user/` as now) | `references` |

Series-wide material that belongs to no one ID uses `<ID>` = `_series`.

### PL02: store.py enforces it

- `put` to `projects/…` and `archive --path` refuse a path that does not match PL01: an unknown kind, a series folder named like an episode, or a missing ID. The error message prints the correct path.
- `archive --path DIR --id <ID> --kind K [--label L]` replaces `--project P --kind K`, and the series is derived from the ID.
- `qa` folders are scratch: `archive` already skips them, and `put` refuses them too.

### PL03: one-time migration

- `store.py mv OLD NEW` moves a file or folder, then rewrites the matching `manifest.tsv` rows and `assets.lock.json` entries. 33 lock entries point into `projects/` today.
- A `scripts/store-migrate-layout.py` plan prints every move (dry run first, then `--apply`), followed by `store.py verify`.
- Archived scratch (G5) and legacy engines (G6) move to `projects/_legacy/<SERIES>/…`, or are deleted only if the user confirms.

## Document changes (after approval)

| File | Change |
| --- | --- |
| `README.md#asset-store` | Replace the example list with PL01 and its table. |
| `AGENTS.md` "One home per file" | Change `--project <PROJECT> --kind <kind>` to `--id <ID> --kind <kind>` and link PL01. |
| `scripts/store.py`, `tests/store.test.ts`, `scripts/README.md`, `docs/context-map.md` | Add PL02 validation, `mv` and tests. |
| Docs and skills that cite `--project … --kind` | Update the call (grep: `docs/`, `.claude/`, `.agents/skills`). |
