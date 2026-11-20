# DF-20261120-hyperframes-render-speed — HyperFrames does not render p5.brush faster than Remotion on this machine

- Owner: coordinator (user question, 20 Nov 2026: "HyperFrames renders p5.brush locally faster than Remotion?"); first observed and last checked: 2026-11-20 (`claude/hyperframe-remotion-perf-a4a68b`, base `06e5621`)
- Status: measured, no change adopted. Remotion stays the renderer.
- Type: tool-comparison
- Tags: render / p5.brush / painted 2D / HyperFrames / Remotion
- Scope: none in the repository. The harness lived in `out/bench/` and a scratch folder and was not kept (see "Harness" to rebuild it).
- Related: [DF-20261031-render-speed](DF-20261031-render-speed.md) (one GPU is the limit; the scene cache is the speed lever)

## Claim checked
- The public speed figure (60 s vs 162 s plus a 4-minute first build) comes from HeyGen, measures an AI agent making a video from one prompt, has no published method and is not a canvas workload.
- HyperFrames' deterministic BeginFrame capture runs on Linux with `chrome-headless-shell` only; macOS falls back to other capture modes.

## Measurement
- Same shot as DF-20261031: ZCPAINT-SHORT-TH frames 198–497 (300 frames, 1080×1920, 30 fps), Apple M1, no audio, H.264 CRF 16.
- Remotion 4.0.538: `renderMedia` direct (no scene cache), `gl: angle`, `muted`, Node 20. Times are render + encode and exclude the bundle.
- HyperFrames 0.9.72: `hyperframes render -w <n> --browser-gpu`, Node 22, hardware GPU. Times are its own "rendered in" figure.
- Both sides ran the same `SceneRenderer` and `BrushCanvas` code (see "Harness").

| Setting | Remotion | HyperFrames |
| --- | --- | --- |
| 4 workers / concurrency 4 | 24.8 s, 30.3 s (first run, cold browser) | 24.7 s, 30.7 s (`--no-experimental-fast-capture`) |
| 1 worker / concurrency 1 | 31.9 s | 39.2 s (`--no-experimental-fast-capture`) |
| HyperFrames auto workers (5) | — | 34.8 s (`--no-experimental-fast-capture`) |
| HyperFrames defaults, 1 worker | — | 68.7 s |

- **Default capture fails on our canvas.** The default fast capture (`drawElement`) failed its own check at frame 75 ("9.1dB < 32dB vs pre-injection screenshot") after 29.5 s, and the render started again in screenshot mode (38 s). `--no-experimental-fast-capture` skips the failed attempt.
- **Pictures match.** Frames 198, 348 and 497 from the two MP4s: 40.0, 45.1 and 37.9 dB PSNR at 540 px wide (two encoders); a side-by-side sheet showed the same plates, figures and captions.
- **Start-up differs by bundler, not by renderer.** Remotion's webpack bundle took 25.2 s per run; the HyperFrames page was bundled with esbuild in 0.4 s. First browser start plus `selectComposition`: 13.4 s cold, 2 s warm.

## Limits of this measurement
- One or two runs per setting; repeats at the same setting differed by about 20% (24.7 s and 30.7 s).
- One 300-frame range on one machine; no audio; no long episode.
- The HyperFrames side still mounted the scene through Remotion's `<Thumbnail>`, so React and Remotion's frame context cost were in both columns. A page that calls p5.brush without React was not measured.
- Linux BeginFrame mode and Docker mode were not measured.

## Harness
- Entry (esbuild, `--bundle --format=iife --jsx=automatic --minify`, `process.env.NODE_ENV` = production): mounts `<Thumbnail component={SceneRenderer} frameToDisplay={frame}>` from `@remotion/player` at 1080×1920 with the ZCPAINT-SHORT-TH props from `src/videos/zombie-condo-paint`.
- `BrushCanvas` calls `getInputProps()`, which throws inside a Player. The entry pinned `window.remotion_isPlayer` to `false` (a getter with an empty setter) and set `window.remotion_inputProps = '{}'` before mounting.
- Seek: `window.addEventListener('hf-seek', e => flushSync(() => setFrame(198 + Math.round(e.detail.time * 30))))`. `BrushCanvas` paints in a layout effect, so the frame is painted when the listener returns.
- Ready: `window.__hf.buildReady.app = document.fonts.ready.then(repaint)`.
- Page: a root `div` with `data-composition-id="root" data-width="1080" data-height="1920" data-fps="30" data-duration="10"`; `public/fonts` copied beside it (`staticFile` resolves to `/fonts/...` outside a Remotion render).
- `hyperframes lint` reports `missing_timeline_registry` for this page (no GSAP timeline); the render runs anyway.
- HyperFrames collects usage telemetry by default: `hyperframes telemetry disable`.

## Planning impact
- No renderer change. Painting on the one GPU sets the time on both tools; the scene cache ([DF-20261031-render-speed](DF-20261031-render-speed.md)) remains the lever for re-edits.
- A move to HyperFrames would also need the scene cache, captions, sound and `BrushCanvas` rebuilt, for no measured gain.
- Possible follow-up, not started: the 25 s webpack bundle per `render.mjs` run is the one start-up cost this test showed could be much smaller.
