# DF-20261031-render-speed — painted renders: scene cache is the lever; concurrency, `--scale` and ProRes plates are not

- Owner: Boss; first observed: 2026-10-31 (user: a small edit re-rendered the whole episode); last checked: 2026-10-31 (`claude/paint-render-speed`, uncommitted, base `3166499`)
- Status: fixed in `scripts/render.mjs` (scene cache by default; `--preview`, `--range`, `--no-cache`); rule in AGENTS.md "Render by scene, keep the scenes"
- Type: tool-limitation (Remotion renders the whole timeline per call; nothing remembers unchanged frames)
- Tags: render / p5.brush / painted 2D / cache / re-edit
- Scope: `scripts/render.mjs`, `scripts/segments.mjs`, `src/painted/BrushCanvas.tsx` (`paintScale`, `soundOnly`)
- Consumers: every painted or long episode render; re-edits (captions, sound, timing)

## Symptoms and evidence
- ZCPAINT-SHORT-TH whole render: **475 s** (2,136 frames, `--gl=angle`, concurrency 4, M1). Any edit repeated it.
- Bench shot: frames 198–497 (300 frames) of ZCPAINT-SHORT-TH; times are wall clock incl. browser start and encode. Raw: `out/bench/times.txt`, `out/bench/RESULTS.md` (not kept; numbers below).
  - Concurrency 1 / 2 / 3 / 4: 42 / 39–43 / 38–40 / 41–42 s. 6 and 8 slower and unstable (44–81 s). Two processes in parallel: 38 s. One GPU is the limit.
  - `--scale=0.5` alone: 38–54 s (no gain: the p5 canvas stays full size).
  - Half-size p5 canvas (`paintScale` 0.5, brush scale kept so ink lines survive): 29 s vs 38–54 s. Output `--scale=0.5` on top: 24–32 s.
  - Paint every 2nd frame (on twos): 25 s vs 49–59 s, but 114 of 150 odd frames move (figure and camera), so it changes the look. **Not adopted.**
  - Re-edit from a cached plate video: H.264 CRF 10 26 s vs 40 s painting; ProRes 4444 50 s (slower than painting). A whole-layer plate misses on any painted-cue edit, so it was replaced by the scene cache.
- Scene cache, first 3 scenes of the same episode (411 frames, `out/bench/seg-e2e.mjs`): direct render 50.8 s; cache miss 59.6 s; **cache hit 5.0 s**; caption edit in scene 3 (scenes 2 and 3 re-render, 1 reused) 32.2 s.
- Cache output vs direct render, same timeline: video 47–61 dB PSNR (re-encode), audio RMS 4092 vs 4091, same onset sample; miss and hit byte-identical in video and audio. Duration 13.70 s both.

## Attempts and results
- The cache key covers a scene, its neighbours (transitions, loop blend), its range, the non-sound props, `src/` outside the episode folders, asset locks and render options. SFX and `audio` beds are excluded from the picture key: sound renders once for the whole video with `soundOnly` (no p5 painting).
- A miss costs about 10 s more than a direct render (per-scene browser frames and joining); a hit or a one-scene edit saves most of the time.

## Planning impact
- Editor/Boss: re-edit renders go through `render.mjs` and reuse unchanged scenes; do not call `npx remotion render` for a deliverable. A change to shared code under `src/` (outside `src/videos/<episode>/`) invalidates every cached scene, by design.
- Not measured: a full-episode cache hit, `C_seamless` loop blend keys, concurrency on a long episode (WFOG, 3,766 frames).
