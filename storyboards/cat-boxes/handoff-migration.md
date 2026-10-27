# CATBOX — written handoff migration

Date: 27 October 2026. Source: origin/main `9cc83a7`; scope: retire repository drawing sources and their delivery requirement. The user selected a new Editor role for scene integration/editing, with Boss retaining reusable assets/capabilities. This migration changes documentation only; script wording, executable timelines, timing, selected deliverables, asset code and factual review results remain unchanged.

## Current status and ownership

Mark owns the [written scene contract](../../docs/mark-storyboard-workflow.md). Film owns coordinate/projection/physical baselines; Boss owns shared assets and runtime interfaces; Editor owns scene assembly/editing and [actual scene-frame samples](../../docs/editor-workflow.md#scene-samples-for-the-user). The retained `storyboards/` directory now holds written handoffs and historical production evidence.

Existing source sheets preserve their original shot/key-state IDs, frame ranges and revision references, including `BOARD` and `Pxx` provenance. Current handoff readiness is `needs-input` pending Mark's audit of named spaces/units, anchor positions, paths, camera keyframes, timing and acceptance criteria; this migration does not invent missing staging or upgrade old plans to ready-for-dev. Do not silently propagate a physical baseline from one scene to another. C06-S02's documented metre-space example is reference, not proof that every scene was calibrated.

The selected [Short index](short/index.md) and [Long index](long/index.md) retain their independent source/timing bindings. Root-level scene/Short packs remain legacy sources. Existing runtime evidence keeps its dated scope; new actual captures/samples, Studio checks and audio/visual approval remain unverified unless independently evidenced. No production rerender is included in this workflow change. Mark audits only the subsequently assigned production scope before Editor reuses it.

## Removed drawing → retained written source

The following 31 drawing files were removed. Their scene-sheet counterparts remain editable Markdown; drawings can be recovered from Git history at the source revision if needed. Authoring and acceptance now follow the written scene contract, not old diagram geometry.

| Removed drawing (historical path) | Retained written source |
| --- | --- |
| `ch01-sc01.excalidraw` | [ch01-sc01.md](ch01-sc01.md) |
| `ch01-sc02.excalidraw` | [ch01-sc02.md](ch01-sc02.md) |
| `ch02-sc01.excalidraw` | [ch02-sc01.md](ch02-sc01.md) |
| `ch02-sc02.excalidraw` | [ch02-sc02.md](ch02-sc02.md) |
| `ch03-sc01.excalidraw` | [ch03-sc01.md](ch03-sc01.md) |
| `ch03-sc02.excalidraw` | [ch03-sc02.md](ch03-sc02.md) |
| `ch04-sc01.excalidraw` | [ch04-sc01.md](ch04-sc01.md) |
| `ch04-sc02.excalidraw` | [ch04-sc02.md](ch04-sc02.md) |
| `ch05-sc01.excalidraw` | [ch05-sc01.md](ch05-sc01.md) |
| `ch05-sc02.excalidraw` | [ch05-sc02.md](ch05-sc02.md) |
| `ch06-sc01.excalidraw` | [ch06-sc01.md](ch06-sc01.md) |
| `ch06-sc02.excalidraw` | [ch06-sc02.md](ch06-sc02.md) |
| `long/ch01-sc01.excalidraw` | [ch01-sc01.md](long/ch01-sc01.md) |
| `long/ch01-sc02.excalidraw` | [ch01-sc02.md](long/ch01-sc02.md) |
| `long/ch02-sc01.excalidraw` | [ch02-sc01.md](long/ch02-sc01.md) |
| `long/ch02-sc02.excalidraw` | [ch02-sc02.md](long/ch02-sc02.md) |
| `long/ch03-sc01.excalidraw` | [ch03-sc01.md](long/ch03-sc01.md) |
| `long/ch03-sc02.excalidraw` | [ch03-sc02.md](long/ch03-sc02.md) |
| `long/ch04-sc01.excalidraw` | [ch04-sc01.md](long/ch04-sc01.md) |
| `long/ch04-sc02.excalidraw` | [ch04-sc02.md](long/ch04-sc02.md) |
| `long/ch05-sc01.excalidraw` | [ch05-sc01.md](long/ch05-sc01.md) |
| `long/ch05-sc02.excalidraw` | [ch05-sc02.md](long/ch05-sc02.md) |
| `long/ch06-sc01.excalidraw` | [ch06-sc01.md](long/ch06-sc01.md) |
| `long/ch06-sc02.excalidraw` | [ch06-sc02.md](long/ch06-sc02.md) |
| `short/sc01.excalidraw` | [sc01.md](short/sc01.md) |
| `short-c01.excalidraw` | [short-c01.md](short-c01.md) |
| `short-c02.excalidraw` | [short-c02.md](short-c02.md) |
| `short-c03.excalidraw` | [short-c03.md](short-c03.md) |
| `short-c04.excalidraw` | [short-c04.md](short-c04.md) |
| `short-c05.excalidraw` | [short-c05.md](short-c05.md) |
| `short-c06.excalidraw` | [short-c06.md](short-c06.md) |
