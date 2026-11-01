# Context map format — decision (2 Nov 2026)

**Status:** applied in [docs/context-map.md](../context-map.md), checked by [scripts/context-map.py](../../scripts/context-map.py).

## Problem

Agents locate files for a topic ("character pose", "scene cache", "captions") with wide greps. [AGENTS.md](../../AGENTS.md#document-index) indexes documents by role and trigger, and [README](../../README.md#documentation-map) and [scripts/README.md](../../scripts/README.md) list docs and scripts, but nothing maps a topic to its docs, source, scripts, compositions and tests together.

## Prior art looked at

| Tool | Shape | Fit here |
| --- | --- | --- |
| graphify (`/graphify` skill) | Generated `graph.json` knowledge graph of code, docs and media, plus `GRAPH_REPORT.md` and an HTML viewer; the JSON is queried by tools, not read whole | Too heavy: a generator, a Python package and a graph that must be rebuilt; the JSON costs context when read directly |
| aider repo-map | Generated per request from tree-sitter symbols, ranked by a PageRank over references, cut to a token budget | Good for symbols, but it answers "which function" rather than "which doc, script and composition belong to this topic", and needs tooling in every harness |
| llms.txt | One hand-written Markdown file: H1, short summary, H2 sections of links, each followed by a one-line description | Closest match: readable by any agent with one `grep` + `sed`, no tooling, links are checkable |
| Codebase knowledge graphs (Sourcegraph-style) | Indexed symbol/reference graph behind a query service | Needs a service; out of scope |

## Choice

**One hand-written Markdown file, llms.txt-style, keyed by topic.** No JSON.

- Agents already work by [CB01](../../AGENTS.md#context-budget): `grep -n` a heading, then `sed -n` the range. A Markdown map with one H2 per topic fits that exactly; a JSON graph would be read whole or need a query tool.
- Codex and Claude Code read it the same way; nothing to install.
- Paths are relative Markdown links, so the existing [check-links.py](../../scripts/check-links.py) already proves every path and `#anchor` exists. [context-map.py](../../scripts/context-map.py) reuses it and adds a coverage check (new modules no entry mentions), run by `tests/context-map.test.ts` under `npm test`.
- Entries point at sections by anchor and never copy rules ([one home per rule](../../AGENTS.md#language-and-rule-conventions)).
- Paths that exist only on an unmerged branch are written as code spans on a line starting `Pending`; they count as covered but are not link-checked, so branches merge without breaking the check. After the merge, the script prints them so they can become links.

Rejected: a generated map (drifts silently between runs, needs a generator), a JSON twin (two homes for one fact).
