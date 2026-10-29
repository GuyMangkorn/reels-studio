# Contribution and Verification Workflow

**Status:** Required for repository delivery. Keep documentation changes separate from unrelated scene/runtime work. Read [sequence-workflow.md](sequence-workflow.md) for dependency ordering and [Boss’s visual QA](boss-asset-workflow.md#visual-and-runtime-qa-before-push) when compositions are affected.

## Workflow and verification

Tasks are GitHub issues on `GuyMangkorn/reels-studio`.

- Assign one owner label, `owner:codex` or `owner:grokbot`.
- Start one branch per issue from `main`: `codex/<issue>-<slug>` or `grokbot/<issue>-<slug>`.
- Keep a PR focused on one asset, shared foundation, scene, capability, bugfix or documentation change. Scene-sized PRs follow the shared [sequence and dependency order](sequence-workflow.md#shared-sequence-and-continuity). Preserve unrelated work already in the checkout.
- Run `npm run lint` and `npm run typecheck` before a runtime/visual PR. For changed runtime logic, run the relevant tests. For changed visuals, render a few frames of every affected composition and inspect representative scene handoff beats, including the relevant camera/reveal frames.

```bash
npm run lint
npm run typecheck
npx remotion render src/index.ts Short out/short-check.mp4 --frames=0-5
npx remotion render src/index.ts Long out/long-check.mp4 --frames=0-5
```

For visual/runtime changes, use the [delivery record](delivery-workflow.md) to identify selected compositions and actual timelines. Apply release checks to those deliverables and regression checks to affected shared consumers; examples showing Short and Long are not a request to produce both. Complete Boss's pre-push QA: Studio checks, one-second contact sheets plus final frames for every affected composition, critical adjacent-frame boundaries, continuous-sequence review and random seeking. A one-second contact sheet alone cannot establish absence of single-frame jumps. Choose additional shot-local start/mid/end and reveal frames when `0-5` cannot exercise a camera, pose or lighting change. Compare each selected/affected output against its matching scene handoff. Keep generated previews, MP4s and MP3s out of Git; commit written scene sheets, runtime code, timeline and amplitude JSON. **Documentation-only exception:** Instruction/documentation-only changes need a diff/link check (`git diff --check` and `python3 -I scripts/check-links.py`) and TOML parsing for changed agent configs. Typecheck, runtime tests and video renders are unnecessary when runtime code and compositions are unaffected. Report the exception explicitly.


## Proportionate verification

Choose verification by the changed surface and risk, using the required checks above and the routed production workflow. A small task needs only a brief success criterion and the applicable checks; it does not need a separate verification plan or a new test for every edit. For a bug, reproduce the failure where practical and verify the corrected behavior; add a regression test when it protects meaningful runtime behavior.

Stop when the success criteria and required checks pass. Repeat affected checks after a fix or further edit, or expand coverage when failures or unresolved risks justify it. Reuse still-applicable results from the same revision and inputs; repeated full suites, renders or review loops are unnecessary without a relevant change. Report completed checks and any unverified areas accurately. This policy governs verification effort and repetition; factual evidence, visual quality, continuity and delivery requirements retain their stated scope.

<a id="tools-and-document-improvements"></a>
## Tools and document improvements

**Requirement** for every role. The workflow improves from what agents find while building. Tools change freely. Rule documents change only after the user's review.

**Build notes per episode.** Each episode keeps `scripts/<episode>/build-notes.md`; any role creates it on first use. Agents record what they find while working on that episode in it, under the two sections below. A note is not an instruction to any other role, and writing one sends no message.

**TL — repeated procedures become scripts.**

- **TL01 — Script on the second repeat.** When a role runs the same multi-step procedure a second time, in this or an earlier session, it writes a script instead of retyping it. This covers measuring, checking, converting, filing and polling. Check [scripts/README.md](../scripts/README.md) first.
- **TL02 — Where scripts live.** A script that only this episode or asset needs lives in `scripts/<episode>/` or the asset folder, and gets a `TLnn` row in the episode's build notes. A script that a second episode needs moves to `scripts/` (promotion) and gets a row in `scripts/README.md`. Its header comment gives usage, inputs and outputs.
- **TL03 — Scripts print summaries.** Keep output short ([CB02](../AGENTS.md#context-budget)): one result line or JSON, with full logs in a file. Scripts are runtime work: verify them on real inputs, never in place on shared data (for example, use a copied library), and report the check.
- A skill or slash command is only a thin wrapper around a script, and only when the user asks for one. The procedure itself stays a script that Codex and Claude can both run.

**DP — document proposals, applied only after user review.**

- **DP01 — Propose, don't edit.** While doing production work, roles do not edit rule documents: `AGENTS.md`, `docs/*.md`, `.claude/agents/`, `.codex/agents/`, `scripts/README.md`. Production records are excluded and keep their own owners: dev-findings entries, briefs, scene sheets, delivery records and build notes. When a rule is wrong, unclear, missing, contradicts another rule or costs needless work, the role adds a `DPnn` entry to the episode's build notes.
- **DP02 — Entry content.** Each entry gives:
  - the document and section anchor;
  - what happened, as evidence (command, shot, revision or quote);
  - the proposed change as exact replacement text or a short diff;
  - the roles affected;
  - status `proposed`.
- **DP03 — Review.** When a stage ends, or when the user asks, the coordinator lists the `proposed` entries for the user with the structured-question tool. Approve, reject and edit are per entry. The coordinator records the decision with date and the user's words.
- **DP04 — Apply.** The coordinator applies approved entries in a documentation-only PR, separate from production work, and marks each entry `applied` with the PR link. Apply them in one batch at a deliverable boundary (a delivery, or a stage end the user picks) so an episode in progress keeps one rule set; apply a single entry sooner only when the user asks. The user's merge is the final review. A rejected entry stays as `rejected` with the reason, so it is not proposed again.

Template for `scripts/<episode>/build-notes.md`:

```markdown
# Build notes — <EPISODE>

## Tools (TL)
| ID | Procedure (repeats seen) | Script / location | Status: episode / promoted (scripts/README.md) |
| --- | --- | --- | --- |
| TL01 | ... | ... | episode |

## Document proposals (DP)
### DP01 — <doc>#<anchor>: <one-line problem>
- Seen: <date, role, evidence>
- Proposed: <exact text or diff>
- Affects: <roles>
- Status: proposed | approved <date, user's words> | rejected <date, reason> | applied <PR>
```

## Finishing a task

Commit, push the issue branch and open a pull request into `main`. Never push directly to `main`. Ask for these once, at the end, in one structured question (commit + push + PR together); verification runs need no approval. Merging stays the user's. The PR description includes:

- `Closes #N`.
- The resulting behavior and a summary of the change.
- User-facing scene samples and their manifest/reproduction paths when scene integration is in scope; see [Editor sample contract](editor-workflow.md#scene-samples-for-the-user).
- New/changed reusable assets, including 3D sets and cameras; write "none" for documentation-only changes.
- For sequence work: foundation/dependency PRs, executable timeline/input props, handoff revision and scene/shot mapping, placeholder status and adjacent-scene QA evidence. State missing or unverified boundaries explicitly.
- Verification results: typecheck, relevant tests and composition/frame ranges rendered. State why a render is unnecessary when no runtime or visuals changed. Identify scene handoff shots covered by visual checks when applicable.
