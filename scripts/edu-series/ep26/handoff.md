# EDU-EP26-SHORT — W2 storyboard handoff

2026-11-18. [Delivery record](delivery.md) and [task file](task.md). User-approved [SCRIPT-R1](short/script.md), [FACT-R1](short/fact-check.md), [BRIEF-R1](short/film-brief.md), [13-shot storyboard](short/storyboard.md) and [EDU-EP26-ROWS-R1](short/review-rows.json) match. This review covers the planned camera, action and Thai narration. The workshop look and measured timing follow in later passes.

Review at [localhost:8766](http://127.0.0.1:8766/). Rebuild, serve and read verdicts from the repository root.

```sh
python3 -I scripts/storyboard-page/build.py scripts/edu-series/ep26/short/review-rows.json
python3 -I scripts/storyboard-page/serve.py scripts/edu-series/ep26/short/review-rows.json --port 8766
python3 -I scripts/storyboard-page/verdicts.py scripts/edu-series/ep26/short/review-rows.json
```

The server saves verdicts in `short/reviews.json` under `<shot ID>@<stage>` with `rev`. At first publish, 13 storyboard shots were open. Use the same rows path and port for later revisions. For mobile review on the same Wi-Fi, add `--lan` when starting the server and use the phone URL it prints. The LAN page and verdict endpoint were verified from the Mac on 2026-11-18. Access from the phone is pending.

W3 redesign, 2026-11-18. The same review page now shows [ROWS-R2](short/review-rows.json) with the three user-approved [BRIEF-R2](short/film-brief-r2.md) looks. To rebuild in another worktree, restore `LF01.png`, `LF02.png` and `LF03.png` from `projects/edu/EDU/ep26-wash-bench-look-r1/` in ReelsStore to `out/EDU-EP26-SHORT/looks/reset-r1/`. Add `--lan` for mobile access on the same Wi-Fi. The [QA notes](build-notes.md#w3-redesign-look-set-2026-11-18) describe the checks. At ROWS-R2 publication, three prior shot verdicts were current and 10 changed shots were open.

W3.4 rebase, 2026-11-18, Film. [ROWS-R3](short/review-rows.json) (22 untimed shots on SCRIPT-R2 and [BRIEF-R3](short/film-brief-r3.md)) replaces ROWS-R2 on the same page and port 8766; rebuild with the same command after `store.py fetch` (or copy LF01–LF03 from `projects/edu/EDU/ep26-wash-bench-look-r1/` into `out/EDU-EP26-SHORT/looks/reset-r1/`). R2 verdicts in `short/reviews.json` are historical.
