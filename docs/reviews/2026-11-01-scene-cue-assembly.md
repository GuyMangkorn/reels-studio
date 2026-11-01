# Shared painted-scene cue assembly

## Scope and module ownership

Requested 1 November 2026 as architecture candidate 3. Base: `c56c15c` (`origin/main`); branch: `codex/178-scene-cue-assembly`. This change is independent of cache PR #177.

The deep module [assemble.ts](../../src/scenes/assemble.ts) owns one interface, `assemblePaintedTimeline`: native-clock tracks and contiguous cuts produce the existing `Timeline`. Its implementation handles onset ownership in `[start,end)`, subtraction before clock conversion, optional decimal rounding, common painted scene construction and omission of empty SFX. It does not sort, carry, shorten or retime events.

Two real clock adapters justify the seam: Bloop/WORLD FOG supply frame-native tracks at 30 units/second; ZCPAINT supplies second-native tracks with three-decimal output. Locality improves because cut ownership and localization have one implementation; leverage comes from testing the same interface across the three project adapters. Deleting this module would redistribute those rules across the projects again.

Project-owned implementation remains in its existing files:

- [Bloop](../../src/videos/the-bloop/timeline.ts): phrase knots, inverse clock mapping, painted-piece splits, labels and dissolves.
- [WORLD FOG](../../src/videos/world-fog/index.ts): story mapping, caption gap events, fiction marker and per-caption scrim media; its empty `subtitle` stays unchanged.
- [ZCPAINT](../../src/videos/zombie-condo-paint/index.ts): beat-assigned narration, clamped caption onsets, speech-gap blanks, pounding cues and overlay clipping. TH and EN remain separate deliveries. Its existing builder is exported so regression tests use the same full authoring interface as registration.

No new runtime fields, renderer behavior, visual assets, voice generation, sound selection, dependency or project-directory changes. Short and Long remain independent editorial timelines. The module does not call AI.

## Verification

- All **269 tests passed**; repository typecheck passed.
- Repository lint: zero errors, three existing Hanako hook warnings.
- Six assembly tests cover cut-edge ownership, exact frame arithmetic, second-clock rounding, original event order, unchanged duration/trim/plate clocks, input immutability, optional field presence, malformed cuts/clocks, and ZCPAINT caption ownership.
- Before editing, complete definitions for four deliveries were captured at `c56c15c` using V8 serialization. Final `assert.deepStrictEqual` passes for all four definitions, covering all fields in 34 scenes plus audio, narration/amplitude, captions, media, overlays and registration settings. Local capture/verification script and evidence: `out/logs/scene-assembly-parity.cjs`, `scene-assembly-before.bin`, `scene-assembly-parity-final.log`.
- Field-sorted JSON digests also match before/after:

| Delivery | Scenes | SHA-256 |
| --- | --- | --- |
| `BLOOP-EP01-SHORT` | 10 | `45399523861652470d593e0fd415995936377d2413b45d904abc60dc5e9f7c86` |
| `WFOG-EP01-SHORT` | 4 | `cba06405cee10ec09c3e9052bf29650fa7313e488ad73c0221120c24a76599a9` |
| `ZCPAINT-SHORT-TH` | 10 | `09ea46e161275b21fb3b06d07658e24d77b9ab3476eaa62c3eb31cf8360aaaeb` |
| `ZCPAINT-SHORT-EN` | 10 | `adc1e28270ca1014b9aa0731279190ea12c1bc301c0fda5d719571f1b909cab9` |

The interface is the test surface: focused tests call the shared assembler; the project regression calls ZCPAINT's actual builder. Temporary parity captures are verification scratch, not a permanent freeze on editorial changes.

## Review finding and resolution

Fresh read-only review found a near-cut caption defect in the first adapter: reconstructing an absolute onset from an already rounded local time could move an outgoing caption into the next scene. A regression reproduced the defect with onset `0.9997` and a cut at `1.0`.

ZCPAINT now retains unrounded absolute onsets until the shared module chooses the scene, then rounds local seconds. Existing rounded caption-gap/order policy remains project-owned. An onset outside its explicitly authored beat fails rather than silently moving to another beat. Both regressions were observed RED then GREEN; full-definition equality remained intact.

## Limits

No video render, frame sheet, listening review or visual QA was performed. Complete renderer-input equality establishes this refactor's preservation criterion; it is not a claim of new visual or audio quality. Existing cache keys may change once because source code and object insertion order changed. The current main branch's approved-scene pin checks remain in place. No render-speed or token-saving benchmark was performed.
