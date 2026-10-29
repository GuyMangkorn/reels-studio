<!-- Moved from docs/dev-findings.md on 2026-10-29; the index and workflow stay there. -->
# DF-20261026-studio-emfile — Remotion Studio exits while watching the checkout

- Owner: Boss; First observed: 26 October 2026; last checked: 26 October 2026
- Status: `open`; Type: `tool-limitation` (observed watcher failure; root cause not confirmed)
- Tags: tooling / Studio / preview
- Scope: `codex/33-catbox-foundation` HEAD `906a85e`, based on `main` `ce2a0b1`; macOS arm64, Node `v24.5.0`, npm `11.5.1`, Remotion `4.0.538`; `npm run start` / `remotion studio src/index.ts --no-open`
- Consumers: CATBOX C06-S02, Film decisions `VD-C06-S02-01`–`03`, storyboard R3 and current physical-scale follow-up. This finding concerns interactive Studio review, not 2D/3D feasibility.

<a id="อาการและหลักฐาน-1"></a>
## Symptoms and evidence

- Desired: open Remotion Studio to play, seek and inspect C06-S02 in `Short` and `Long`.
- Reproduced on HEAD `906a85e` with `npm run start`: server reports ready at `http://localhost:3000`, begins `Building...`, then Node exits with `EMFILE: too many open files, watch` from `FSWatcher._handle.onchange` before a Studio preview is available.
- Previous issue-branch attempts after clean `npm ci` also failed after moving raw QA folders aside, setting `CHOKIDAR_USEPOLLING=true`, passing `--webpack-poll=1000`, and passing `--disable-git-source`. Those attempts were recorded during the same CATBOX task; the process/file-watcher limit has not been identified.
- Evidence: local terminal output from `npm run start` on `906a85e`; environment and installed versions above. The checkout does not produce an interactive Studio session.
- Coverage: Studio play/seek remains `unverified`. CLI rendered a 46-second / 1,380-frame preview for each composition at 30 fps: `out/qa/cat-boxes/projection-final/Short-c06-preview.mp4` and `out/qa/cat-boxes/projection-final/Long-c06-preview.mp4`. There are 77 full-resolution checks per composition under `out/qa/cat-boxes/projection-final/Short/` and `Long/`, with review sheets under `contact-sheets/`. Random-remount frame comparisons used composition frames 16,050, 15,000 and 15,750: Long was pixel-identical at all three; Short was pixel-identical at 16,050 and 15,750, and differed at five subtitle pixels (maximum channel delta 2) at 15,000, with no geometry displacement.
- Root cause: unknown. The observed `EMFILE` is a file-watch limit surfaced by Studio's process; this evidence does not show that Remotion render itself or any medium is incompatible.

<a id="สิ่งที่ลองและผล"></a>
## Attempts and results

- `npm run start` → reproduces `EMFILE` before Studio is usable.
- `npm run start` with clean dependencies, raw QA folders moved aside, polling enabled, a webpack polling interval, and Git source watching disabled → prior recorded attempts still failed.
- `npx remotion still ...` inside the default sandbox separately aborted at Chromium MachPort rendezvous with permission denied. The same bounded render succeeded when invoked with `require_escalated`; this was a sandbox launch restriction, not the Studio `EMFILE` condition. Still renders do not substitute for interactive seeking.

<a id="ผลต่อการวางแผน"></a>
## Planning impact

- Film: continue selecting 2D / 3D / hybrid based on the approved visual brief and available renderer APIs; this tooling result gives no medium-level restriction. Use CLI-rendered contact sheets for bounded image evidence while Studio is unavailable.
- Mark: retain view/framing/contact criteria and identify the exact still frames used; do not label storyboard or runtime random seeking as Studio-verified.
- Follow-up: Boss/desktop runtime owner should identify the watcher limit or a supported Studio polling configuration, then retry `npm run start` and interactive seeking in both compositions. Keep Studio play/seek `unverified`; the CLI previews, stills and remount comparisons are separate evidence and do not establish Studio verification.
- History: 2026-10-26 / `codex/33-catbox-foundation` `906a85e` → `npm run start` reproduced `EMFILE`; bounded CLI previews, full-resolution stills and frame remount comparisons succeeded → `open`; no fix PR or Studio verification yet.
