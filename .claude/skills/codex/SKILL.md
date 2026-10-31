---
name: codex
description: "Offload heavy coding, build and log-reading work to Codex (`codex exec`) from Claude Code: model and effort, sandbox, isolated worktrees, completion notice, live log tail and the usage-limit fallback. Use when the user asks to send a task to Codex or to save Claude quota."
---

# Codex offload

Codex builds and measures; Claude decides what looks right. Quality of painted art, framing and anything judged by eye stays with Claude (a Codex pass can add edge wobble and remove detail; see `scripts/hanako/build-notes.md`, 31 Oct 2026).

## Defaults

- **Model and effort:** `gpt-6.1-terra`, reasoning effort `high` (user, 31 Oct 2026). `gpt-6.1-tera` (one r) fails with `model_not_found` on this ChatGPT account; `gpt-6.1-sol` also works. Pass them explicitly: `-m gpt-6.1-terra -c model_reasoning_effort='"high"'`; do not rely on `~/.codex/config.toml`.
- **Sandbox:** `-s workspace-write` for edits, `-s read-only` for reading. Codex CLI 0.164.0 has no `--full-auto`; it exits at once. Run it with the working directory set by `-C <dir>`.
- **Short tasks:** `scripts/codex-run.sh [--write] "PROMPT"` (prints only the final message, log in `out/logs/`, exit 75 on usage limit). Long tasks use the recipe below.

## Recipe for a long task

1. Write the brief to a file (read the repo rules, name the files and sections to read, scope, what must stay green, the evidence to produce, where to write the report). Briefs, not prose in the command line.
2. Run it from Bash with `run_in_background`, **no trailing `&`**, so Claude Code notifies when Codex really ends:
   `codex exec -m gpt-6.1-terra -c model_reasoning_effort='"high"' -s workspace-write -C <dir> - < <brief>.md > out/logs/<name>.log 2>&1`
3. Show the log live: one Terminal-panel tab with `tail -n 60 -f out/logs/<name>.log`. **Stop the previous tail first** (Ctrl-C via `stop_terminal_tab`), then reuse or close that tab. A tab the user has typed in cannot be reused; open a new one.
4. On the completion notice, confirm the process ended (`pgrep -f "codex exec"`), then check the log for a usage limit. Only a run with no final message counts as limited; the log also echoes prompts and docs that mention "usage limit". On a limit, Claude does the task itself without asking.
5. View the sheets yourself before reporting; Codex's own "done" is not visual evidence.

## Role agents

Codex has custom agents from `.codex/agents/<role>.toml`. Start a brief with "Use the custom agent named boss for this task" (a role name from AGENTS.md), then still name the files to read, the scope and the evidence. Tested 31 Oct 2026 (CLI 0.164.0): a one-line question was delegated (`collab: Wait` in the log) and the agent answered with its own core reads. `@boss` does not work: it is read as plain text and the agent config is not loaded. Not yet tested on a long writing task; the delegation adds a layer (more quota, and the log shows only the sub-agent's summary), so on the first real run check which sandbox, model and effort the sub-agent used and confirm in the log that it read its core documents. Until then keep the brief's explicit "read these files" list.

## Parallel runs on the same files

Two writers must not touch the same files. Give each its own worktree: `git worktree add -b codex/<name> <path> <base-commit>` (a post-checkout hook may move it to `origin/main`: `git reset --hard <base-commit>` after), then copy uncommitted work in with `rsync -a --files-from=<list>` and symlink `node_modules`. Port results back by hand from an isolated patch; never copy whole shared modules over another writer's work.

## Auto-mode permissions

The permission classifier blocks `codex exec` until the user allows it: `Bash(codex exec:*)` in `.claude/settings.local.json` or `~/.claude/settings.json`.
