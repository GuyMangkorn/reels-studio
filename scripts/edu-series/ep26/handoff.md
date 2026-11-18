# EDU-EP26-SHORT — W2 storyboard handoff

2026-11-18. [Delivery record](delivery.md) and [task file](task.md). User-approved [SCRIPT-R1](short/script.md), [FACT-R1](short/fact-check.md), [BRIEF-R1](short/film-brief.md), [13-shot storyboard](short/storyboard.md) and [EDU-EP26-ROWS-R1](short/review-rows.json) match. This review covers the planned camera, action and Thai narration. The workshop look and measured timing follow in later passes.

Review at [localhost:8766](http://127.0.0.1:8766/). Rebuild, serve and read verdicts from the repository root.

```sh
python3 -I scripts/storyboard-page/build.py scripts/edu-series/ep26/short/review-rows.json
python3 -I scripts/storyboard-page/serve.py scripts/edu-series/ep26/short/review-rows.json --port 8766
python3 -I scripts/storyboard-page/verdicts.py scripts/edu-series/ep26/short/review-rows.json
```

The server saves verdicts in `short/reviews.json` under `<shot ID>@<stage>` with `rev`. At first publish, 13 storyboard shots were open. Use the same rows path and port for later revisions. For mobile review on the same Wi-Fi, add `--lan` when starting the server and use the phone URL it prints. The LAN page and verdict endpoint were verified from the Mac on 2026-11-18. Access from the phone is pending.

W3 update, 2026-11-18. Storyboard approved 13/13. The same review page and rows revision show LF01 R3 for the workshop. If the local image is absent in another worktree, restore `projects/edu/EDU/ep26-workshop-look-r3/LF01.png` from the store to `out/EDU-EP26-SHORT/looks/r3/LF01.png` before rebuilding. See the [build notes](build-notes.md#w32-lf01-r3-2026-11-18) for the fixes and measurements. R3 awaits the user's review.
