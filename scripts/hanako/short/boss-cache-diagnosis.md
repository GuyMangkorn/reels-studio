# Boss cache diagnosis: HANAKO-SHORT segment cache (1 Nov 2026)

- Owner: Boss. Status: diagnosis; the section 7 proposal was applied in the working tree on 1 Nov 2026 (approval relayed by the coordinator, Boss could not verify it directly). Fix and evidence: `docs/dev-findings/DF-20261101-segment-cache-key.md` and section 10. No plate, cue, sound, lock or production output changed; nothing committed or pushed by Boss.
- Tree: HEAD `7ccacff` (HANAKO registration, committed during this run). `src/` has no diff against HEAD. The key logic last changed in `1d97835` (scene cache), before the observed runs; `bb0346c` only changed a comment in `segments.mjs`.
- Evidence: scratch probes (not in the repo): `/private/tmp/claude-501/-Users-mangkornkatawong-Developer-reels-creator--claude-worktrees-hanako-next-437b9b/df63fb10-edc9-41c3-a783-f8e0bbf38709/scratchpad/cache-key-probe.mts` (log `.../scratchpad/probe.log`), `.../scratchpad/readers-probe.mts`, `.../scratchpad/other-lock-probe.mts`. The probe imports the real `segmentKeys` and `sourceHash`, asserts that its reimplementation equals the real key on the baseline, and perturbs in memory or in a scratch copy of `src/`. The real cache directory was not listed or touched.

## Verdict

- No crash or wrong-pixel bug found. Each observed re-render is what `segmentKeys` computes, and the behaviour is documented (README "Render and verify", DF-20261031-render-speed, `tests/segments.test.ts`).
- It is coarser than the AGENTS.md promise ("after an edit only the touched scenes are painted") for three classes: any `src/` change or any lock change (including other episodes' locks), neighbour terms the renderer never reads, and a total-duration change.
- The audio array is not in the key. The lock file is. The sound re-wire re-renders every picture only because `store.py use` writes `src/videos/hanako/assets.lock.json`, which is hashed whole.
- Proposal, now applied in the working tree (section 10): read neighbours only where the renderer reads them, and leave `public/audio` lock entries out of the picture key. Per-shot and per-episode keys remain open design steps.

## 1. What the key contains (`scripts/segments.mjs`)

`key(scene i) = sha256(shared + {i, range, near})[:16]`

- `shared` = JSON of `{rest, narration, options, source, size}`:
  - `rest`: composition props plus `inputProps`, minus `timeline`, `narration`, `audio`. For HANAKO: `ending`, `endHoldSec`, `endFadeSec`, `captionStyle`.
  - `narration`: `narration` minus `src`, so `amplitude[]`, `fps`, `startFrame`. `startFrame` sets the mouth clock (`SceneRenderer.tsx:89`).
  - `options`: `{gl, scale, crf}` (`render.mjs:61`).
  - `source` = `sourceHash()`: sha256 over every file under `src/` except `src/videos/<episode>/**`, plus `package-lock.json`, plus every `src/videos/*/assets.lock.json` as whole JSON text (so every locked `sha256`, audio included, and every episode's locks).
  - `size`: `[width, height, fps, durationInFrames]`.
- `range`: the scene's first and last frame.
- `near`: `[prev scene, scene i, next scene, timeline[0] if i is last]`, each with `sfx` removed. Otherwise whole scene objects (`subtitleCues`, `painted`, `actors`, `transitionIn`, `durationSec`).

Not in the key: `sfx`; the `audio[]` array and `index.ts` (episode folder); `narration.src`; `public/` bytes that no lock covers (the fonts `public/fonts/NotoSansThai.ttf` and `NotoSansJP.ttf` are read by picture code and locked nowhere); `scripts/` render code (`render.mjs`, `segments.mjs`, loudness, stills); the codec constants `h264`/`yuv420p` hard-coded in `renderSegmented` (only `crf` is in `options`); the Chrome binary (`BROWSER_EXECUTABLE`); concurrency and timeout (no pixel effect).

Baseline keys at HEAD `7ccacff` (current rule): `8d18b55a…`, `73742ee2…`, `1852abed…`, `46fad316…`, `31cf5d17…`, `58325c09…`, `54422f68…`, `2d98618a…`, `61c52bb8…` (scenes 1 to 9).

## 2. Per-scene key diffs (probe)

Scene numbers are 1-based. Frames per scene: 304 139 202 255 272 416 458 256 294 (total 2,596). "cur" is `segments.mjs` as written. "prop" is the proposal in section 6.

| Case (edit in memory or scratch copy) | cur: scenes re-rendered | frames | prop: scenes | Driver |
| --- | --- | --- | --- | --- |
| C1 KN-1 caption text, scene 1 | 1, 2, 9 | 737 | 1 | own key; prev term (scene 2); loop term (scene 9) |
| C2 KN-2 caption timing, scene 1 | 1, 2, 9 | 737 | 1 | same |
| C3 SFX cue added, scene 1 | none | 0 | none | `sfx` stripped everywhere |
| C4 `audio[]` track added (`index.ts`) | none | 0 | none | `audio` not in `rest` |
| C5 caption text, scene 8 (B08) | 7, 8, 9 | 1,008 | 8 | next term (7); prev term (9) |
| C6 caption text, scene 9 | 8, 9 | 550 | 9 | prev term (8) |
| C7 `captionStyle` | 9/9 | 2,596 | 9/9 | global `rest` prop (correct) |
| C8 `narration.startFrame` 45 to 46 | 9/9 | 2,596 | 9/9 | mouth clock (picture; correct) |
| C9 scene 3 +0.1 s (total changes) | 9/9 | 2,596 | 9/9 | `size` term (`durationInFrames`) plus ranges |
| C10 scene 3 +0.1 s, total held | 2 to 9 | 2,292 | 3 to 9 | ranges only |
| S1 `src/painted/shots/hanako.tsx` (B08 overlay stand-in) | 9/9 | 2,596 | 9/9 | `source` (file-level) |
| S2 `src/painted/hanako/generations.tsx` (B07 poster kit stand-in) | 9/9 | 2,596 | 9/9 | `source` |
| S3 `src/painted/ship.ts` (unrelated shot file) | 9/9 | 2,596 | 9/9 | `source` (any `src/` file) |
| S4 `src/videos/hanako/index.ts` (audio edit) | none | 0 | none | episode folder excluded |
| S5 lock: new `public/audio/…` entry | 9/9 | 2,596 | none | lock JSON hashed whole |
| S6 lock: poster image `sha256` | 9/9 | 2,596 | 9/9 | picture lock (correct) |
| Other episode's lock changed (`zombie-condo-paint`) | 9/9 | 2,596 | not proposed | `src/videos/*/assets.lock.json` glob (other-lock-probe: hash changes) |

Ablations of the current rule (switch one neighbour term off in both base and edit):
- C1: prev off → `[1,9]`; next off → `[1,2,9]`; loop off → `[1,2]`. So scene 2 comes from the prev term and scene 9 from the loop term.
- C5: prev off → `[7,8]`; next off → `[8,9]`; loop off → `[7,8,9]`.

## 3. Observation 1: knock captions in scene 1 re-render scenes 1, 2 and 9

- KN-1..3 are `subtitleCues` of scene 1 (on-screen captions, a picture input). Scene 1's own key changes.
- Scene 2 changes only through `near[0]`, the whole of scene 1. The renderer reads the previous scene only for actor pose continuity (`SceneRenderer.tsx:64-66, 105-106`; HANAKO has no actors), for a painted cue at `atSec` 0 with `dissolveSec` (`painted.ts` `platesAt`; scene 2's cue has none), and for `sceneTransitionFrames` > 0 (0 here). None applies, so the term is unused.
- Scene 9 changes only through `near[3]`, `timeline[0]`, because it is the last scene. The renderer reads scene 1 from the last scene only for C_seamless (`SceneRenderer.tsx:159`, `painted.ts` `paintedStateAt`) and for the B_loop freeze, which is landscape-only (`SceneRenderer.tsx:153`). HANAKO is `A_fade` and portrait, so the term is unused.
- Classification: by design as written. The header of `segments.mjs` names "entry transitions, loop blend", and `tests/segments.test.ts` (lines 17-20 and 27-29) asserts neighbour invalidation, but the terms are unconditional. For this video both are over-invalidation: 737 frames instead of 304.

## 4. Observation 2: B08 overlay, B07-SH03 poster and audio re-wire re-render all 9

- Audio re-wire: the `audio` array is not in the key (C4: 0 scenes), and `index.ts` is outside the source walk (S4: 0). The only audio path into the key is the lock file (S5: 9/9). So the hypothesis "audio array included" is refuted. The mechanism is the lock.
- B08 overlay in `src/painted/shots/hanako.tsx` (14 shots in one file): S1 gives 9/9. The key is file-level, so it cannot see that only B08-SH01 changed.
- B07-SH03 poster: `FilmPoster`/`paintPoster` live in `src/painted/hanako/generations.tsx` (S2: 9/9). The PNG is a locked image (S6: 9/9).
- Any one of S1, S2, S5 or S6 alone gives 9/9, so the observed run is explained without any dissolve or loop effect.
- Dissolve neighbour (a real dependency, not the cause here): B08-SH01 starts at `atSec` 0 with `dissolveSec` 0.5 and paints over B07-SH03 (readers probe: B07-SH03 is painted in scenes 7 and 8; B08-SH01 in scene 8 only). A correct per-shot key must therefore re-render scene 8 for a B07-SH03 change, and the proposal keeps scene 8's prev term.
- Loop seam and hold: not involved for `A_fade`. The hold and fade are scene-local (`endings.ts`, `endingState`).

## 5. Bug or design

- Design, documented: README "Render and verify", DF-20261031-render-speed ("A change to shared code under `src/` … invalidates every cached scene, by design"), `tests/segments.test.ts`. No wrong pixel or crash found.
- Gap against AGENTS.md line 25 ("a re-render reuses every scene whose inputs did not change, so after an edit only the touched scenes are painted"):
  - any `src/` change, and any lock change including other episodes' locks;
  - unconditional neighbour terms (section 3);
  - a total-duration change re-renders scenes 1 and 2 whose ranges and content are unchanged (C9 vs C10). README says "a duration … re-renders the scenes after it, or all"; the code does all.
- Internal inconsistency: the `segments.mjs` header and the test title "SFX and sound beds never change a picture key" say sound is excluded from the picture key, but sound lock entries are hashed. Excluding them matches the stated intent.
- Latent correctness gaps (not observed, worth a follow-up): unlocked picture fonts; `scripts/` render code and codec constants not in the key; the key trusts the lock's `sha256` text and never checks the file bytes (the poster and one audio entry match today); `--preview` renders write keys into the same cache; old keys are never pruned.
- Not a clear-cut bug, so no code change is applied: the lock glob is probably deliberate for shared assets, and changing the key contract needs owner sign-off.

## 6. Cost per edit class (estimate)

Measured on 31 Oct (`scripts/hanako/short/render-report.md`): full miss 691 s for 2,596 frames (9/9 rendered); all-reused run 92 s, which is the floor (bundle, sound pass, normalization, archive). Scene cost is estimated at 0.266 s/frame, proportional to frames. B07 and B08 are heavier per frame (DF-20261031-render-speed), so their figures are low.

| Edit class | Today | With proposal (section 7) |
| --- | --- | --- |
| SFX cue, `audio[]` track, `narration.src` | 0 scenes; ~92 s floor | same |
| Knock caption text or timing, scene 1 | 1, 2, 9: 737 f ≈ 196 s | 1: 304 f ≈ 81 s |
| Caption, scene 8 | 7, 8, 9: 1,008 f ≈ 268 s | 8: 256 f ≈ 68 s |
| Caption, scene 9 | 8, 9: 550 f ≈ 146 s | 9: 294 f ≈ 78 s |
| New sound lock (`store.py use`) | 9/9 ≈ 691 s | 0 scenes; ~92 s floor |
| Lock change in another episode | 9/9 ≈ 691 s | unchanged (not proposed yet) |
| One-shot plate edit (B08 overlay, B07-SH03 poster) | 9/9 ≈ 691 s | unchanged 9/9 (per-shot ideal: B08 → scene 8 ≈ 68 s; B07-SH03 → scenes 7, 8 ≈ 190 s) |
| Shared kit edit (`src/painted`, `src/scenes`) | 9/9 ≈ 691 s | 9/9 (correct without dependency analysis) |
| Scene 3 duration +0.1 s | 9/9 ≈ 691 s | 9/9 with `size` term; 3 to 9 ≈ 573 s if the size term is dropped for `A_fade` (not proposed yet) |

## 7. Proposed fix (applied as described in section 10)

Smallest change, all in `scripts/segments.mjs` (the applied version differs in the details listed in section 10):

(a) Neighbours only where the renderer reads them:

```js
const readsPrev = (scene, rest) => Boolean(scene.actors?.length) || scene.painted?.shots?.[0]?.dissolveSec !== undefined || rest.sceneTransitionFrames > 0;
const readsNext = (next, rest) => next.transitionIn !== undefined || rest.sceneTransitionFrames > 0;
// near = [i > 0 && readsPrev(scene, rest) ? timeline[i - 1] : undefined, scene,
//         i < n - 1 && readsNext(timeline[i + 1], rest) ? timeline[i + 1] : undefined,
//         i === n - 1 && rest.ending !== 'A_fade' ? timeline[0] : undefined].map(sounds)
```

(b) `sourceHash`: skip `public/audio/` entries when hashing the lock JSON. Grep confirms no picture code in `src/` outside episode folders reads `public/audio`.

(c) Later, each with its own design step: a per-episode lock (needs the episode name in the key); per-shot hashing (needs a dependency map of `shots/hanako.tsx`; the reader map gives the expected scene sets); dropping `durationInFrames` from `size` for `A_fade`.

Test changes in `tests/segments.test.ts` (these are the owner's call because they change the contract):
- "a caption edit re-renders that scene and its neighbours only": `[1,2,3]` becomes `[2]` for `A_fade` without dissolves.
- "the last scene follows the first (loop)": `A_fade` `[0,1,4]` becomes `[0]`; add a `C_seamless` case that keeps `[0,1,4]`.
- New: a scene whose first cue has `dissolveSec` re-renders when the previous scene's caption changes.
- New: adding a `public/audio/…` lock entry to a temporary root leaves `sourceHash` unchanged.
- Unchanged: the SFX test and the durations/props/options test.

Verification if approved: rerun the probe (expect C1 `[1]`, C5 `[8]`, C6 `[9]`, S5 `[]`); `npm run typecheck`; `npm run lint`; `node --import tsx --test tests/segments.test.ts`. The dropped neighbour terms also need a render check (`render.mjs --range` at the scene 1/2 and scene 9 boundaries against a cache miss). That renders, so it needs the user's go-ahead.

## 8. Limits

- Section 2 is the pre-change probe. The post-change results are in section 10. The real cache directory was not listed or touched. Boundary renders used scratch copies and `render.mjs --range` only; no full-video render.
- The per-frame cost comes from one 31 Oct full miss (tree `f8788d1`), not from the current tree.
- The proposal's safety (that the dropped terms never change pixels) rests on reading `SceneRenderer.tsx`, `painted.ts` and `endings.ts`, not on renders.
- HEAD moved from `f8788d1` to `7ccacff` during this run (another session committed the HANAKO registration). `src/` is identical to HEAD.
- Not measured: cache size on disk and how fast old keys accumulate.

## 9. Records

- Written: `docs/dev-findings/DF-20261101-segment-cache-key.md` and its index row in `docs/dev-findings.md`.
- README "Render and verify" reuse sentence corrected to match the code. AGENTS.md line 25 is not edited; its "only the touched scenes are painted" wording still overstates shared-code, lock and duration edits (open, proposal in section 10).

## 10. Applied change, checks and risks (1 Nov 2026, working tree)

Applied, all in `scripts/segments.mjs` (uncommitted):
- (a) Neighbours as approved: previous scene only for actor poses, a first-cue `dissolveSec`, or a global `sceneTransitionFrames`; next scene only for `transitionIn` or a global transition; `timeline[0]` only when `ending !== 'A_fade'`. Detail kept on purpose: under a global transition the neighbours stay in the key, and the frame counts of all scenes are hashed, because `transitionOpacityAt` reads every boundary.
- (b) `sourceHash`: `public/audio/` entries are left out of each lock's JSON. Picture entries, `src/` and the episode `index.ts` behaviour are unchanged.
- (c) Not in the approval, added as a correctness fix: the scene count is hashed only while `chrome.progressBar` is on (`SceneView` draws one segment per scene). Without it, a scene split that keeps the total left untouched scenes with the old bar.
- `scripts/segments.d.mts` unchanged (no new exports). README reuse sentence corrected. New DF `DF-20261101-segment-cache-key` and its index row. AGENTS.md not edited.

Tests (`tests/segments.test.ts`): 12 tests (was 4). Two existing assertions flipped as approved: the caption test `[1,2,3]` → `[2]`; the loop test `[0,1,4]` → `[0]` for A_fade, with `[0,4]` kept for C_seamless, B_loop and an undefined ending. The duration assertion (5 keys for a total change) still holds; a held-total case is added. New tests cover each rule and each kept neighbour read (actors, first-cue dissolve, `transitionIn`, global transitions, C_seamless, B_loop), the progress-bar count, and the sound-lock exclusion in `sourceHash`. The old code fails 7 of the 12 (run after the last change).

Before → after, HANAKO-SHORT (scenes re-rendered, from the probe logs `out/logs/boss-cache-probe-oldcode-rerun.log` and `boss-cache-probe-after.log`):

| Case | Before | After |
| --- | --- | --- |
| C1 / C2 knock caption, scene 1 | 1, 2, 9 (737 f) | 1 (304 f) |
| C5 caption, scene 8 | 7, 8, 9 (1,008 f) | 8 (256 f) |
| C6 caption, scene 9 | 8, 9 (550 f) | 9 (294 f) |
| C10 scene 3 +0.1 s, total held | 2–9 (2,292 f) | 3–9 (2,153 f) |
| C11 knock caption under C_seamless | 1, 2, 9 | 1, 9 |
| E1 last scene split, total held, progress bar off | 8, 9 | 9 |
| E2 global `sceneTransitionFrames`, scene 9 caption | 8, 9 | 8, 9 (unchanged) |
| C3 SFX, C4 `audio[]`, S4 episode `index.ts` | none | none |
| S5 new sound lock entry | 1–9 | none |
| C7 captionStyle, C8 narration startFrame, C9 total change | 1–9 | 1–9 (correct, global) |
| S1 B08 overlay, S2 poster kit, S3 unrelated `src/`, S6 picture lock | 1–9 | 1–9 (correct at file granularity) |

Render checks: see DF-20261101 "Boundary render checks". Summary: the scene 2 cache hit (scene 1 caption changed), the scene 9 A_fade cache hit (scene 1 plate changed) and the harness-versus-`render.mjs --range` check are byte-identical (139/139, 294/294, 139/139). The scene 8 hit (scene 9 caption changed) shows no change above repeat noise. The scene 8 dissolve reads scene 7's last plate (mean 11.07 when that plate is swapped), so the kept term is needed. The C_seamless render could not run because the registry's `endHoldSec` blocks non-A_fade endings.

Verification: `scripts/segments.mjs` tests 12/12 (`out/logs/boss-cache-segments-test.log`); typecheck exit 0 (`boss-cache-typecheck.log`); lint 0 errors, 3 warnings in `src/painted/hanako/look*.tsx`, none in the changed files (`boss-cache-lint.log`); full `npm test` 256/256 (`boss-cache-npm-test.log`); range renders in `out/logs/boss-cache-range-*.log`.

Risks left:
- The first HANAKO render on this key version re-renders all 9 scenes once (every key changes). Expected cost about 691 s on the 31 Oct measure. No full render was run here.
- C_seamless and B_loop renders are not verified by render; the rule is only unit-tested and reads from `SceneRenderer.tsx` and `painted.ts`.
- Repeat noise is larger than the documented 1/255 for HANAKO scene 8 frames 0–92 (up to 48/255 between identical renders). Owner: Boss; flagged in the DF.
- Open keys: B08 or B07 plate edits still re-render all 9 (per-shot keys needed); other episodes' locks are still in every key; unlocked fonts; `scripts/` and codec constants not in the key; lock `sha256` text trusted; old keys not pruned.
- `global sceneTransitionFrames` keeps neighbours more than the renderer reads (it reads durations); conservative, no current episode uses it.
- Proposed AGENTS.md line 25 wording (not applied): "an edited scene re-renders, with the neighbours the renderer reads; shared-code, lock and duration edits re-render every scene (DF-20261101-segment-cache-key)."
- Coordination: the coordinator relayed the user's approval; Boss could not verify it directly. HEAD moved to `1628128` during this work (another session committed HANAKO docs, including this diagnosis in its earlier state). The changes listed here are uncommitted on top of it.
