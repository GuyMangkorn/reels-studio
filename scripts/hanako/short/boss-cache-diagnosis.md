# Boss cache diagnosis: HANAKO-SHORT segment cache (1 Nov 2026)

- Owner: Boss. Status: diagnosis and proposal. No code, plate, cue, sound, lock or production output changed; nothing committed or pushed.
- Tree: HEAD `7ccacff` (HANAKO registration, committed during this run). `src/` has no diff against HEAD. The key logic last changed in `1d97835` (scene cache), before the observed runs; `bb0346c` only changed a comment in `segments.mjs`.
- Evidence: scratch probes (not in the repo): `/private/tmp/claude-501/-Users-mangkornkatawong-Developer-reels-creator--claude-worktrees-hanako-next-437b9b/df63fb10-edc9-41c3-a783-f8e0bbf38709/scratchpad/cache-key-probe.mts` (log `.../scratchpad/probe.log`), `.../scratchpad/readers-probe.mts`, `.../scratchpad/other-lock-probe.mts`. The probe imports the real `segmentKeys` and `sourceHash`, asserts that its reimplementation equals the real key on the baseline, and perturbs in memory or in a scratch copy of `src/`. The real cache directory was not listed or touched.

## Verdict

- No crash or wrong-pixel bug found. Each observed re-render is what `segmentKeys` computes, and the behaviour is documented (README "Render and verify", DF-20261031-render-speed, `tests/segments.test.ts`).
- It is coarser than the AGENTS.md promise ("after an edit only the touched scenes are painted") for three classes: any `src/` change or any lock change (including other episodes' locks), neighbour terms the renderer never reads, and a total-duration change.
- The audio array is not in the key. The lock file is. The sound re-wire re-renders every picture only because `store.py use` writes `src/videos/hanako/assets.lock.json`, which is hashed whole.
- Proposal (not applied): read neighbours only where the renderer reads them, and leave `public/audio` lock entries out of the picture key. It flips two existing assertions, so it needs owner sign-off. Per-shot and per-episode keys are a larger design step.

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

## 7. Proposed fix (proposal only; not applied)

Smallest change, all in `scripts/segments.mjs`:

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

- No render was run, because `--range` renders and has no dry-run. The worktree was not edited. The real cache directory was not listed or touched.
- The per-frame cost comes from one 31 Oct full miss (tree `f8788d1`), not from the current tree.
- The proposal's safety (that the dropped terms never change pixels) rests on reading `SceneRenderer.tsx`, `painted.ts` and `endings.ts`, not on renders.
- HEAD moved from `f8788d1` to `7ccacff` during this run (another session committed the HANAKO registration). `src/` is identical to HEAD.
- Not measured: cache size on disk and how fast old keys accumulate.

## 9. Records

- No `docs/dev-findings.md` entry written (scope). Suggested ID: `DF-20261101-segment-cache-key`, pointing to this file.
- AGENTS.md line 25, README "Render and verify" and the DF wording need updating only if the owner accepts the proposal. Rule documents were not edited.
