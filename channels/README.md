# Channels

**Status:** Requirement (user, 11 Nov 2026). One repository makes videos for more than one channel. A **channel** is a posting destination with its own audience, genre and style. Its rules live in `channels/<id>/`; the process every channel shares (pipeline, roles, render, store, runtime, painted kit) stays in [AGENTS.md](../AGENTS.md) and `docs/`.

| Channel | ID | Folder | Status |
| --- | --- | --- | --- |
| Education (`@TamMaiLa`) | `edu` | [edu/](edu/channel.md) | active |
| Fiction (`@mg.fiction`) | `fiction` | — | moved to its own repository, `reels-fiction` (user, 17 Nov 2026); the code keeps its mark for the channel machinery test |

## What a channel folder holds

Each file is created when the channel has a rule to put in it. A missing file means the channel has no rule of its own there, and the shared documents apply.

| File | Holds | Read by |
| --- | --- | --- |
| `channel.md` | Identity and channel-level values: mark, audience, genre, format, voice, captions, ending, factual policy, sound norms | every role, before work on a deliverable of this channel |
| `script.md` | Script rules learned on this channel | Preaw, Boat |
| `look.md` | Look, cast and camera choices that differ from the [project defaults](../docs/delivery-workflow.md#project-defaults) | Film, Boss |
| `edit.md` | Rhythm, transitions, mix and caption choices that differ from the [editor principles](../docs/editor-principles.md) | Editor, Ton |
| `cover.md` | Cover identity that differs from the [cover principles](../docs/cover-principles.md) | Film |
| `performance.md` | Posted videos' numbers; a production record, appended without a DP entry | coordinator, Preaw |

## Rules

- **CH01 — One channel per deliverable.** `delivery.md` names the channel ID in the [style profile](../docs/delivery-workflow.md#style-profile) block. When the request does not make the channel clear, the coordinator asks in the selection call. An episode of an existing series keeps its series' channel without a question.
- **CH02 — Channel over shared default.** Where a channel file sets a value, it replaces the shared Default for that channel's deliverables without a recorded reason per episode. A shared **Requirement** (safety, licensing, Thai readability, deterministic output, render and store rules) is not a channel's to override.
- **CH03 — One home.** A rule that only one channel follows lives in that channel's folder; a rule both channels follow lives in `docs/`. When a rule turns out to be channel-specific, move it and leave the old anchor pointing to the new home.
- **CH04 — Paths, not memory.** The coordinator passes the channel folder's files to each role by path and revision with the other inputs ([AI11](../docs/delivery-workflow.md#agent-invocation)). A role reads `channel.md` and the file for its own stage.
- **CH05 — Taste and evidence stay with their channel.** A user note or a retention lesson from one channel does not steer the other unless the user says so. [User taste](../docs/user-taste.md) keeps the notes that hold for both.

## Adding a channel

1. Create `channels/<id>/channel.md` with the same headings as [edu/channel.md](edu/channel.md) and add a row to the table above.
2. Add the channel to the `Channel` row of the [style profile](../docs/delivery-workflow.md#style-profile).
3. Add the mark to `CHANNEL_MARKS` in `src/videos/types.ts`. An episode of the channel exports `channel: '<id>'` from `src/videos/<episode>/index.ts`; the registry then gives every video that leaves `chrome.channelLabel` unset the channel's mark. An episode with no `channel` keeps the `edu` code default (`defaultChrome`).
4. Register the channel's first series in `SERIES` in `scripts/store.py` with the channel as its folder, so its media is stored under `projects/<channel>/<SERIES>/` and posted from `publish/<channel>/<SERIES>/<ID>/` ([asset store](../README.md#asset-store)).
5. Make one pilot episode, then write `script.md`, `look.md` and `edit.md` from what the pilot showed. Do not write them in advance.
