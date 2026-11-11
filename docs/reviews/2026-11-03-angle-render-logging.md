# ANGLE defaults and render logs — 3 November 2026

## Change and usage

`scripts/render.mjs` and `scripts/storyboard-page/clips.mjs` default to `gl: 'angle'` through `parseRenderArgs`. An explicit `--gl=swangle` or other supported backend still wins. Resolution, frame rate, draft drawing, encode settings, cache keys and pin semantics are unchanged; changing the effective GL option selects separate scene-cache entries.

Both commands print a unique `out/logs/render-<tool>-<timestamp>-<uuid>.jsonl` path. Logs are written incrementally:

- `start`: requested GL backend, composition IDs, draft/preview mode and render settings. Requested ANGLE does not establish the actual device; the benchmark below probes it separately.
- `stage-start` / `stage`: bundle, browser, input discovery, scene rendering, sound, mux, trim, proxy, stills, loudness and archive, as applicable. Scene time includes browser capture and video encoding, not just brush painting.
- `cache`: rendered/reused counts for each requested range and whether reuse was bypassed.
- `warning` / `finish`: result, total elapsed milliseconds, stage totals and warning count. A failed best-effort archive retains the exported video but records its failed stage, exit status and warning. A run killed before `finish` remains incomplete.

Run a normal command and inspect its printed log path:

```sh
node scripts/render.mjs <CompositionId> --draft --range=0-29 --timeout=180000
node scripts/storyboard-page/clips.mjs <CompositionId> <review-rows.json> --shots=<shot> --draft --timeout=180000
tail -n 1 out/logs/<printed-log-name>.jsonl
```

These defaults affect future invocations of the changed scripts. An already-running Node process retains its loaded code and backend. The active EG episode exists in a separate, dirty production worktree; its running draft and review rows were left untouched.

## Bounded EG measurement

Source: the current EG production worktree `.claude/worktrees/check-project-pipeline-4ec3f9`, branch `claude/bangkok-continuation-eddcb7`, on 3 November 2026. This is a dirty production revision, not a claim about `main`'s episode registry. Installed Remotion 4.0.538; Apple M1. The existing CPU/SwiftShader render continued during the experiment, so these are local sample timings, not a full-episode speed promise.

Local harness: `out/angle-check/eg-bench.mjs`, one bundle, one browser per backend, draft props, full 1080×1920 at 30 fps. It used isolated segment storage and outputs in `out/angle-check/run-1793682416526/`, not EG's review/cache folders. Three stills used `renderStills` on one Chrome per backend. Setup/bundle time is excluded from the stills comparison.

| Check | Result |
| --- | --- |
| Explicit ANGLE device | `ANGLE Metal Renderer: Apple M1` |
| Old Chromium-default device | SwiftShader Vulkan software renderer |
| ANGLE, first scene, frames 0–159 | 24,087.89 ms, including capture and H.264 encode |
| Same scene requested again | 0 rendered, 1 reused |
| Three stills, frames 0, 80, 159, ANGLE | 2,646.02 ms |
| Same three stills, Chromium default | 33,039.93 ms |
| Sample stills ratio | 12.49× faster; not a video-render ratio |

Pixel comparison (`paint-bench-compare.mjs`): f0 48.3 dB, f80 45.0 dB, f159 37.3 dB PSNR; maximum channel difference 153/255. These are backend differences, larger than the tiny same-backend repeat noise. The viewed 3×2 sheet preserves the same staging, camera and text, but the pixels and some wash/edge details differ. Do not claim frame identity or full visual equivalence.

Caption-zone measurements were taken for both sets. The bright exterior fails the existing dark-band threshold on both backends; this is not a caption-layout pass. Lead height is N/A for this empty exterior shot. No scene, caption or art correction is part of this tooling change. Full-episode motion, voice/caption sync, random-seek and Final approval were not checked.

Raw local logs: `out/logs/render-angle-eg-check.log`, `render-angle-pixels.log`, `render-angle-caption-zone.json`, plus the experiment's `render-eg-check-*.jsonl` files under the EG worktree's `out/logs/`. A sandboxed Chrome launch failed with a socket error; its JSONL correctly recorded the failed browser stage and failed run. The authorized unsandboxed rerun completed.

The seven review images are filed in `$REELS_STORE/projects/legacy/EG/previews/angle-backend-check/` (three PNGs per backend plus `comparison.png`). The contact sheet's top row is Chromium default/SwiftShader; the bottom row is ANGLE. The raw benchmark JSONL logs were also copied into the root checkout's `out/logs/` for inspection.

Both changed entrypoints were then exercised on copied EG source/review inputs under `out/angle-check/cli/`, with a separate store and no `--gl` flag:

- `clips.mjs`, first shot with its one-second handles: 62.23 s total; two scenes rendered, with `scene`, `sound`, `mux`, `trim` and `proxy` stages in `render-clips-2026-11-03T05-11-26-224Z-fd094d2b.jsonl`.
- `render.mjs --draft --stills --frames=0`: 7.22 s, successful frame and JSONL summary.
- `render.mjs` with a nonexistent composition: nonzero exit and JSONL `finish.status = error`, confirming the failure path. Logs are in the fixture's `out/logs/`.

The first copied-fixture bundle lacked amplitude JSON files imported from `scripts/`; adding those original inputs fixed the fixture without changing production code. Its failed JSONL is retained.

## Verification and delivery status

Default and explicit override tests, immediate log writes, stage failures (including non-Error thrown values), unique paths, recovered warnings and idempotent finish are covered. Final full suite: **403/403 passed** (`out/logs/render-angle-suite-final.log`). Syntax checks for all changed JS entrypoints/helpers, changed-test lint, context-map coverage and `git diff --check` passed.

Full-project lint/typecheck have pre-existing errors in unchanged files: unused `poseBody` in `tests/poses-motions.test.ts` and missing declaration for `scripts/loudness.mjs` in `tests/loudness.test.ts`. Baseline checks reproduced those errors. Changed-test lint passes. No unrelated fix is included.

Fresh review identified an ignored-plan link and an incorrectly successful archive log on nonzero exits; both were corrected. The durable record is this file; local planning notes remain ignored. The user authorized commit, push, issue and PR creation on 3 November 2026; tracked by [issue #208](https://github.com/GuyMangkorn/reels-studio/issues/208), branch `codex/208-render-angle-logging`.
