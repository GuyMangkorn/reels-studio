# DF-20261030-worktree-node-modules — a worktree's `node_modules` can be partial; stills fail at bundle time

- Owner: Boss; first observed: 2026-10-30 (WFOG r6 stills in this worktree); last checked: 2026-10-30
- Status: fixed (see the 2026-11-15 revalidation line)
- Type: environment blocker (install state, not code)
- Tags: npm / worktree / Remotion bundler / p5.brush
- Scope: this worktree's `node_modules` (`npm ls` listed extraneous packages; `p5.brush` absent)
- Consumers: every render or test in a worktree that was not installed from `package-lock.json`

## Symptoms and evidence
- `node scripts/world-fog/stills.mjs …` failed before any frame: `Module not found: Error: Can't resolve 'p5.brush/standalone'` (`out/logs/r6-baseline-1s.log`, first attempt).
- `npm ls --depth=0` listed many packages as extraneous; `node_modules/p5.brush` did not exist.
- After `npm ci` (exit 0, `out/logs/r6-npm-ci.log`): `p5.brush` 3.0.0 present; `npm ls --depth=0` exit 0 with no extraneous, invalid or missing entries (`out/logs/r6-npm-ls.log`).
- `npx remotion versions` exited 127 in the same worktree; `node_modules/.bin/remotion versions` prints 4.0.538 (`out/logs/r6-remotion-versions.log` has the first attempt).

## Planning impact
- Boss/Editor: run `npm ls --depth=0` before the first still in any new worktree; a missing `p5.brush` shows up at the bundle step, not as a scene error.

## Revalidation history
- 2026-10-30, worktree `claude/world-fog-next-steps-2817bc`: reinstalled with `npm ci`; stills, typecheck, lint and tests run.
- 2026-10-30, worktree `usage-check-agent-tuning-16bd9b` (Boss pass 11): the untracked `node_modules` symlink pointed to the main checkout's partial install (no `p5.brush`). Re-pointed the symlink to the sibling `world-frog-main-6920cb/node_modules` (contains `p5.brush`; `node_modules/.bin/remotion versions` 4.0.538), not `npm ci`. The main checkout's install is unchanged; the symlink is never committed. Stills render with `--gl=angle`.
- 2026-11-15, `claude/dev-finding-review-b2efff` (working tree): `scripts/setup.sh` now runs `npm ls --depth=0` and reinstalls with `npm ci` when the install is partial; a symlinked `node_modules` with a partial install is reported as a failure instead of being reinstalled through the link. Run `bash scripts/setup.sh --no-venvs` in a new worktree. Checked on a complete install only (npm step ok); the partial and symlink branches were not exercised. Status fixed.
