# EP20 cover picture independent viewer check

Revision: `EDU-EP20-COVER-PIC-R1`
Reviewer: Film, checking-only; fresh first-time-viewer pass, not the painter.
Provider: OpenAI / Codex. Model: GPT-6 family per session identity; exact runtime model ID not exposed. Effort: not supplied in the dispatch or exposed to this reviewer. This is the explicitly dispatched Codex check, not a claim of the workflow's prescribed Sonnet/medium execution.

Result: **5 pass, 0 fail; no C findings.** Minor observations remain notes and request no polish pass.

| Picture | Unaided read | Against intended picture | Pose / anatomy findings | Other P/A/H/R findings and taste IDs | Crop check |
| --- | --- | --- | --- | --- | --- |
| P1 | A coral balloon stands above a long string ending at a small floor ring inside a passenger cabin; a seated person's legs enter from the left. | pass | No visible P31 conflict; the partial person is context. | R-M, UT11 / UT12: broad flat colour fields and very little visible painted surface texture give the cabin a graphic rather than brushed appearance. No C finding. | The balloon, string and floor ring remain visible in the centre 3:4 crop. |
| P2 | A low upward-looking cabin view follows a vertical string to a coral balloon, with the closed window behind it. | pass | No visible P31 conflict in the partial passenger. | R-M, UT11 / UT12: broad flat colour fields and very little visible painted surface texture give the cabin a graphic rather than brushed appearance. No C finding. | The primary balloon and string survive; the small floor ring reaches the lower edge of the 3:4 crop. This does not defeat the upward balloon read. |
| P3 | A belted seated passenger looks toward the nearby coral balloon with a surprised, questioning face. | pass | Right profile, hands at lap and seated silhouette read coherently; no visible A finding. | R-M, UT11 / UT12: broad flat colour fields and very little visible painted surface texture give the cabin a graphic rather than brushed appearance. No C finding. | The face and balloon remain a readable pair in the 3:4 crop. |
| P4 | A vertical balloon string ends at a floor attachment singled out by a yellow oval. | pass | The contextual passenger is deliberately partial; no visible P31 conflict. | R-M, UT11 / UT12: broad flat colour fields and very little visible painted surface texture give the cabin a graphic rather than brushed appearance. No C finding. | Balloon, tether and highlighted floor attachment all survive the 3:4 crop. |
| P5 | A seated passenger watches a balloon while two balanced arrows offer left and right alternatives. | pass | Right-profile seated pose and lap hands read coherently; no visible A finding. | R-M, UT11 / UT12: broad flat colour fields and very little visible painted surface texture give the cabin a graphic rather than brushed appearance. No C finding. | Passenger, balloon and both arrows remain readable in the 3:4 crop. |

## Checked evidence

Read the supplied bundle and inspected each of these three listed sheets once:

- `out/EDU-EP20-SHORT-PIC-COVERS/viewer-check/look/bundle.md`
- `out/EDU-EP20-SHORT-PIC-COVERS/viewer-check/look/sheet-01.png` — all five pictures at 270 px.
- `out/qa/edu20/cover-pick1/final/sheet-pictures-120.png` — all five pictures at phone-grid size.
- `out/qa/edu20/cover-pick1/final/sheet-pictures-3x4.png` — all five centre crops.

## Limits

No extra actual frames were opened. Picture readability and the supplied P31 description were judged from the sheets only; no hidden limb or finger defects are inferred from crops or small-scale detail. The balloon is identifiable at phone-grid size in all five candidates, and the cabin setting remains legible. The common flat-surface observation is a minor style/taste note, not a critical spatial or anatomy defect.

These are static picture checks: no audio, playback, motion, runtime, render measurements or prior film approval was assessed. No headline is expected yet; the small channel mark and contextual partial people are intentional. P5's opposing arrows read as equally offered guesses; no actual result direction or unequal-pressure answer is disclosed. No cover is selected, and no source, picture, production record or publication was changed.

## Coordinator dispatch evidence

The successful fallback receipt for task `task_ec0e6cd11a53`, dispatch `ctx_e86d4d1bb093`, run `run_eaaf08fd1d49` configured agent `codex`, model `gpt-6.1-sol`, effort `medium`. This is coordinator-observed launch metadata, separate from the reviewer's self-report above. The original Sonnet attempt `ctx_ec66842771e9` reached its session limit before any verdict and was confirmed stopped before the same task was retried, following AI14. The coordinator recorded all five image hashes and passes with `viewer-check.py record`; no picture was selected or changed.
