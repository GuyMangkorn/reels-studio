# Contribution and Verification Workflow

**Status:** Required for repository delivery. Keep documentation changes separate from unrelated scene/runtime work. Read [sequence-workflow.md](sequence-workflow.md) for dependency ordering and [Boss’s visual QA](boss-asset-workflow.md#visual-and-runtime-qa-before-push) when compositions are affected.

## Workflow and verification

Tasks are GitHub issues on `GuyMangkorn/reels-studio`.

- Assign one owner label, `owner:codex` or `owner:grokbot`.
- Start one branch per issue from `main`: `codex/<issue>-<slug>` or `grokbot/<issue>-<slug>`.
- Keep a PR focused on one asset, shared foundation, scene, capability, bugfix or documentation change. Scene-sized PRs follow the shared [sequence and dependency order](sequence-workflow.md#shared-sequence-and-continuity). Preserve unrelated work already in the checkout.
- Run `npm run lint` and `npm run typecheck` before a runtime/visual PR. For changed runtime logic, run the relevant tests. For changed visuals, render a few frames of every affected composition and inspect representative storyboard beats, including the relevant camera/reveal frames.

```bash
npm run lint
npm run typecheck
npx remotion render src/index.ts Short out/short-check.mp4 --frames=0-5
npx remotion render src/index.ts Long out/long-check.mp4 --frames=0-5
```

For visual/runtime changes, complete Boss's pre-push QA: Studio checks, one-second contact sheets plus final frames for every affected composition, critical adjacent-frame boundaries, continuous-sequence review and random seeking. A one-second contact sheet alone cannot establish absence of single-frame jumps. Choose additional shot-local start/mid/end and reveal frames when `0-5` cannot exercise a camera, pose or lighting change. Compare both outputs against the storyboard. Keep generated previews, MP4s and MP3s out of Git; commit editable boards, runtime code, timeline and amplitude JSON. **Documentation-only exception:** Instruction/documentation-only changes need a diff/link check and TOML parsing for changed agent configs. Typecheck, runtime tests and video renders are unnecessary when runtime code and compositions are unaffected. Report the exception explicitly.


## Proportionate verification

Choose verification by the changed surface and risk, using the required checks above and the routed production workflow. A small task needs only a brief success criterion and the applicable checks; it does not need a separate verification plan or a new test for every edit. For a bug, reproduce the failure where practical and verify the corrected behavior; add a regression test when it protects meaningful runtime behavior.

Stop when the success criteria and required checks pass. Repeat affected checks after a fix or further edit, or expand coverage when failures or unresolved risks justify it. Reuse still-applicable results from the same revision and inputs; repeated full suites, renders or review loops are unnecessary without a relevant change. Report completed checks and any unverified areas accurately. This policy governs verification effort and repetition; factual evidence, visual quality, continuity and delivery requirements retain their stated scope.

## Finishing a task

Commit, push the issue branch and open a pull request into `main`. Never push directly to `main`. The PR description includes:

- `Closes #N`.
- The resulting behavior and a summary of the change.
- New/changed reusable assets, including 3D sets and cameras; write "none" for documentation-only changes.
- For sequence work: foundation/dependency PRs, executable timeline/input props, board revision and scene/shot mapping, placeholder status and adjacent-scene QA evidence. State missing or unverified boundaries explicitly.
- Verification results: typecheck, relevant tests and composition/frame ranges rendered. State why a render is unnecessary when no runtime or visuals changed. Identify storyboard shots covered by visual checks when applicable.

