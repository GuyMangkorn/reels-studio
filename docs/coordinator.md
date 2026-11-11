<a id="coordinator-and-agent-parity"></a>
# Coordinator duties and agent parity

**Status:** moved here from [AGENTS.md](../AGENTS.md#coordinator-and-agent-parity) on 11 Nov 2026 so role agents no longer load it on every invocation. Rule levels are unchanged. **Read when:** you are the coordinator (before coordinating a deliverable or invoking a role) or you edit a role config.


The **coordinator** is the chat session the user talks to (Claude Code or Codex). It does the following:

- selects deliverables, style profile and tier;
- invokes role agents for the assigned scope (Claude Code: the `Agent` tool with `subagent_type` set to the role name; Codex: the custom agent of that name);
- passes matching revisions;
- publishes the [user storyboard review page](mark-storyboard-workflow.md#user-storyboard-review-page) whenever Film returns a `ready-for-dev` scene-sheet revision or Film adds look frames, built with `scripts/storyboard-page/build.py` from Film's `review-rows.json`, and relays the verdicts back;
- follows the [agent invocation defaults](delivery-workflow.md#agent-invocation): whole stage per call (shot groups for painting and rendering), inline mechanical edits, separate checking.

<a id="coordinator-duties"></a>
**Coordinator duties kept in other documents** (user, 7 Nov 2026). Each rule lives in the linked document; read that section when its moment comes:

- **Start and pick:** create `delivery.md` and `task.md` ([delivery record](delivery-workflow.md#delivery-record-and-handoff-checks), [task file](delivery-workflow.md#task-file)); have the user pick a concept ([ideation](docs/delivery-workflow.md#ideation)); propose the open deliverable closest to W8 first ([finish first](delivery-workflow.md#wip-limit)).
- **Before the user sees pictures:** run the [viewer check](sequence-workflow.md#viewer-check); voice takes for choosing are at most 10 s ([audition cap](delivery-workflow.md#voice-audition-cap)).
- **Review page:** batch ready shots into one [review round](mark-storyboard-workflow.md#review-rounds) (no daily cap); record the page URL in `delivery.md` in the same turn; read verdicts, render the next [stage](render-rules.md#render-stage) and pin passed finals with `pin.mjs` ([moving a shot on](sequence-workflow.md#painted-shot-by-shot), W7).
- **Publish and post:** after a delivery render or a cover pick or fix, run `store.py publish` and give the user `publish/<channel>/<PROJECT>/<ID>/` (W8.2); when the user says it is posted, `store.py publish <ID> --posted <date>` (W8.3) ([publish folder](../README.md#publish-folder)).
- **Fix rounds:** one `fixlist.md` per round ([AI12](docs/delivery-workflow.md#ai12)); after two fix passes on a shot group the user decides ([fix-pass cap](boss-asset-workflow.md#latest-production-rules)).
- **Rules and repo:** list `proposed` rule changes for the user at a stage end and apply them in a docs-only PR ([DP03–DP04](docs/contributing.md#tools-and-document-improvements)); tooling waits for the [maintenance window](contributing.md#maintenance-window); check that a PR is unmerged before pushing to its branch ([merged-PR check](contributing.md#merged-pr-check)); a user note repeated on a second episode goes into [user taste](user-taste.md); tick W8.3 when the user says a video is posted.

[Role configs](../AGENTS.md#coordinator-and-agent-parity) install no runner; a role agent never invokes the next role.

`.claude/agents/<role>.md` and `.codex/agents/<role>.toml` must carry the same name, description and instructions. `tests/agents.test.ts` enforces this, so edit both in the same change. Claude front matter also carries a required `tools:` allowlist (Claude-only) that keeps each role's startup context small. Add a tool there before a role depends on it. Optional Claude-only `model:` and `effort:` lines pin a role's model and reasoning effort; the front matter is the current record and `git log -p .claude/agents/` its history. The coordinator may override them per call. OpenCode copies (`.opencode/agents/<role>.md`) are generated from the Claude files by `python3 -I scripts/opencode-agents.py`; rerun it after editing a role (the same test checks them). OpenCode reads skills from `.claude/skills` and `.agents/skills` directly and MCP servers from `opencode.json`. ZCode copies (`.zcode/agents/<role>.md`, GLM-5.3) are generated the same way by `python3 -I scripts/zcode-agents.py`; ZCode reads skills from `.agents/skills` and MCP servers from `.agents/mcp.json`, a symlink to `.mcp.json`.
