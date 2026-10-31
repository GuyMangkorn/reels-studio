# DF-20261101-segment-cache-key — scene cache re-rendered neighbours, sound locks and other episodes' locks

- Owner: Boss; first observed: 2026-10-31 (HANAKO-SHORT: a three-caption edit re-rendered 3 of 9 scenes; a B08 overlay plus a sound re-wire re-rendered 9 of 9); last checked: 2026-11-01 (working tree on `claude/hanako-next-437b9b`, base HEAD `7ccacff`)
- Status: fixed (uncommitted); revalidate after commit
- Type: implementation-bug (over-invalidation; one stale-output gap closed)
- Tags: render / scene cache / re-edit / sound / asset lock / progress bar
- Scope: `scripts/segments.mjs` (`segmentKeys`, `sourceHash`), `tests/segments.test.ts`; `scripts/segments.d.mts` unchanged; README "Render and verify"
- Consumers: HANAKO-SHORT (all re-edits); every scene-cached render (`scripts/render.mjs`); Editor sound re-wires; parallel episodes (their locks are in every key, see open items)

## Symptoms and evidence
- Desired → observed: a caption edit in scene 1 (knock captions KN-1..3) re-rendered scenes 1, 2 and 9, 737 of 2,596 frames, where only scene 1 can change. A B08 light-dip overlay plus a sound re-wire re-rendered all 9 scenes (691 s on 31 Oct).
- Reproduce: `node --import tsx --test tests/segments.test.ts` on the old code fails 8 of 12; the key probe (scratch, `cache-key-probe.mts`) on HEAD gives C1 → `[1,2,9]`, S5 (new sound lock entry) → all 9.
- Evidence:
  - `segmentKeys` put the full previous and next scene into every key, and `timeline[0]` into the last scene's key for every ending.
  - `sourceHash` hashed each episode's `assets.lock.json` whole, so sound entries (`public/audio/`) and other episodes' locks changed every key.
  - Renderer reads (checked in this pass): `SceneRenderer.tsx` `previous` only inside the actor maps; the entry transition `transitionIn` renders into the previous scene's last frames; `timeline[0]` only for C_seamless and for the landscape B_loop freeze; `painted.ts` `platesAt` reads the previous span only for a first-cue `dissolveSec`; `endings.ts` A_fade is scene-local.
  - Stale-output gap: `SceneView` draws one progress segment per scene when `chrome.progressBar` is on, and no key held the scene count. A split that keeps the total left untouched scenes with the old bar.
- Coverage: 12 unit tests (new code 12/12; HEAD 8 fail); probe on HEAD and new code (`cache-key-after.mts`); typecheck, lint (0 errors; 3 pre-existing warnings in `look*.tsx`), full `npm test` 256/256; boundary renders (below). Not run: Studio, a full HANAKO render, other episodes, Long videos.
- Unverified: a full-episode cache hit on this tree; a sound-only re-wire through the Editor path; `BROWSER_EXECUTABLE` other than Remotion's Chrome.
- Root cause: unconditional neighbour and loop terms; sound and cross-episode lock entries in the picture key; no scene count while the progress bar is on.

## Attempts and results
- Rules now in `segmentKeys` (evidence above): previous scene only for actor poses, a first-cue dissolve or a global `sceneTransitionFrames`; next scene only for `transitionIn` or a global transition; `timeline[0]` only when `ending !== 'A_fade'`; a global transition hashes every scene's frame count; the scene count only while the progress bar is on.
- `sourceHash` leaves `public/audio/` lock entries out. Picture lock entries, `src/` files, package-lock and the episode `index.ts` behaviour are unchanged.
- Key results (scene sets re-rendered, HANAKO-SHORT, before → after):
  - knock caption scene 1 (C1, C2): 1, 2, 9 → 1
  - caption scene 8 (C5): 7, 8, 9 → 8
  - caption scene 9 (C6): 8, 9 → 9
  - scene 1 caption under C_seamless (C11): 1, 2, 9 → 1, 9
  - scene 3 +0.1 s, total held (C10): 2–9 → 3–9
  - new sound lock entry (S5): 1–9 → none
  - unchanged: SFX and `audio[]` (none); captionStyle, narration startFrame, total-length change, B08 overlay / B07 poster / shared `src/` edits and picture lock entries (all 9, correct for the current key granularity)
  - split of the last scene with the progress bar on: 9 → 1–9 (correct); off: unchanged for untouched scenes
- Boundary renders (`--range`, cache-entry vs no-cache, `range-harness.mts` and `range-compare.mjs`): see the section below.
- Cost: first render after this change re-renders all 9 scenes once, because every key changes (segments shape and lock hashing). Old keys are not pruned.
- Remaining cost, by design: a B08 or B07 plate edit still re-renders all 9 (per-shot keys would give 8 and 7–8); a duration change re-renders all 9.

## Boundary render checks
Method: `render.mjs --range` for the production composition, and a scratch harness (`range-harness.mts`, the same bundle, browser options, encode settings and `frameRange` calls as `renderSegmented`) for edited input timelines. A "cache hit" is the base segment written under its base key and reused where the new key is unchanged. A "no-cache" render is a `frameRange` render of the edited state. Frames compared at full resolution with the Homebrew ffmpeg (decode, RGB difference; `range-compare.mjs`). Logs: `out/logs/boss-cache-range-*.log`, `out/logs/boss-cache-range-compare.log`. Renders wrote only `out/HANAKO-SHORT/range/` and the scratch `sim/` folder, not the segment store.

| Check | Result (per frame, 0–255) |
| --- | --- |
| H0 harness equals `render.mjs --range=304-442` (production, base) | 139/139 identical |
| T1 scene 2 hit (scene 1 knock caption edited) vs no-cache | 139/139 identical |
| T3 scene 9 hit, A_fade (scene 1 B01-SH01 plate changed) vs no-cache | 294/294 identical |
| T2 scene 8 hit (dissolve target; scene 9 caption edited) vs no-cache | frames 93–255 identical; frames 0–92 max 49, mean 0.45; same-code repeat renders of the same frames: max 48, mean 0.45 (N3) → no change above repeat noise |
| T2 dependency probe, weak: scene 7 B07-SH03 `fromSec` 0 → 1 s | mean 0.58 = repeat noise (N2 vs N1): not a usable probe |
| T2 dependency probe, strong: scene 7 last plate swapped to B07-SH02 | mean 11.07, max 216, 15 of 16 frames over 1 (N6) → the scene 8 dissolve reads the previous plate; the kept term is needed |
| C_seamless render (scene 1 change vs base, last frames) | not run: `validateVideoStyle` rejects `endHoldSec` (registry value 0) for any ending other than A_fade, and inputProps cannot unset it. The rule is covered by unit tests only |

- Repeat noise is larger than the 1/255 noted in DF-20261031-render-session-drift for HANAKO scene 8 frames 0–92 (the B08 plate with the dissolve): identical renders of the same code differ by up to 48/255 there (mean 0.45–0.6). Frames after the dissolve window repeat exactly. Owner: Boss; not investigated further here.
- Result: the cache-hit and no-cache renders agree wherever the key says they should, within the measured repeat noise. The previous-neighbour term for dissolves and the loop term for A_fade (T3) behave as the new rules assume.

## Open items
- Other episodes' locks are still in every key (`src/videos/*/assets.lock.json` glob). Restricting to the episode needs the episode name in the key.
- Per-shot keys for `src/painted/shots/<episode>.tsx` (needs a dependency map of the shot file).
- Unlocked picture fonts (`public/fonts/`), `scripts/` render code and the codec constants are not in the key. Lock `sha256` text is trusted, not checked against file bytes.
- `--preview` renders write keys into the same cache; no pruning.
- A total-length change re-renders scenes that have not changed; dropping `durationInFrames` from the key for `A_fade` needs a renderer check.

## Planning impact
- Editor: a sound re-wire no longer re-renders pictures after the first run on this key version; a caption edit re-renders its scene and any neighbour that reads it.
- Boss: the open items above; re-check after any change to `SceneRenderer.tsx`, `painted.ts` or `endings.ts` (the neighbour rules follow them).
- Film / Mark: none; no shot, staging or timing changes.

## Revalidation history
- 2026-11-01 working tree on `claude/hanako-next-437b9b` (base `7ccacff`) → key probe, 12/12 segment tests, typecheck, lint, `npm test` 256/256, boundary renders → fixed, uncommitted
