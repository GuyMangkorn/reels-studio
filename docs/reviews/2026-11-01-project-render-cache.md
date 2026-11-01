# Project-scoped render cache

## Confirmed scope

User decision, 1 November 2026: p5.brush painting and SVG in Remotion; independent story projects with Reels and optional YouTube Long. Shared character changes propagate to consuming projects at their next render. Start with project-level dependency tracking, retain existing scene keys, and bypass reuse when dependencies cannot be determined. No project moves, editorial changes or character version system.

## Implementation

- `scripts/segments.mjs` passes composition ID and effective props to `scripts/render-inputs.ts` in a fresh tsx process. The helper returns a content digest; failure returns no digest and a warning: the render then bypasses the cache and the pin check (nothing cached, pinned scenes not reported as changed), preventing stale reuse.
- Shared render imports are traversed from `src/index.ts`. At the painted registry, catalogue object identity identifies the selected shot inventories; their transitive imports include any shared character implementation. IDs are not inferred from prefixes or project directory names.
- Selected project declarations are evaluated for ownership but are not hashed as runtime source: their serialized output is already covered by the existing scene keys. A caption edit still invalidates only the scene and neighbours that actually read it, preserving the newer upstream key policy.
- Picture media is identified from effective runtime `src` fields, static asset calls and source literals. Its bytes and applicable selected-project lock entries are included. Extensionless files are supported. Sound-only props and lock entries are excluded: audio is rebuilt independently.
- Package lock, TypeScript settings and supported render configuration are included. Render tooling (`scripts/render.mjs`, `segments.mjs`, this helper, `package.json`) is excluded: its pixel settings are already in the segment keys, and a CLI edit must not trip every pin; the digest version string is bumped when the key logic changes. Static imports, re-exports, literal dynamic imports and import-equals dependencies are followed. Unresolved imports, unknown ownership/shot inventory, unverified remote media and unsupported computed asset discovery bypass reuse.

## Conservative limits

- A shared-renderer edit or a selected inventory edit can invalidate every scene in a consuming project. Tracking individual art dependencies per scene is intentionally deferred.
- The existing central registry remains. Changing that dispatch implementation can invalidate all projects; moving registration into projects is a separate proposal.
- Discovery evaluates existing project declarations and shot inventories in a fresh process. This avoids stale module state; it does not isolate browser bundles or fix unrelated projects that fail to compile.
- Known props-driven media paths in the current shared renderer are supported explicitly. Local readonly literal metadata such as Hanako's `staticFile(FILM_CARD.src)` is resolved by its lexical binding; shadowed parameters and overriding spreads bypass reuse. Unsupported discovery uses the safe bypass rather than guessing. Data URLs also bypass reuse conservatively.
- Existing cache keys change once with this implementation. Old cached segments remain in the store; they are not deleted or migrated.

## Verification evidence

Fixture tests in `tests/render-inputs.test.ts` cover unrelated project isolation, shared-character propagation through imported JSON, local media byte drift, picture locks/configuration, unknown/missing inputs, dynamic discovery, extensionless/remote media, import-equals, computed asset paths, sound-only edits and existing per-scene caption reuse. Existing segment tests continue to exercise duration, ending and neighbour invalidation.

Before reconciling newer upstream work, all 257 tests passed; repository typecheck, helper strict typecheck and helper lint passed. Repository lint reported zero errors and three existing Hanako hook warnings. Diff and documentation link checks passed.

Real helper execution successfully discovered inputs for `SHIPWRECK-SHORT`, `BLOOP-EP01-SHORT`, `WFOG-EP01-SHORT` and `ZCPAINT-SHORT-TH`. Each returned the same digest across two fresh-process executions after the fixes. Logs are under `out/logs/project-cache-*` (local QA scratch).

Fresh review identified stale extensionless/computed media, missing import-equals traversal and sound-only invalidation; regression tests reproduced these before correction.

No timeline, rendering implementation, picture, narration or caption content changed. No video render or visual QA was performed; tests and real input discovery establish cache selection behavior, not measured render speed or visual quality.

## Upstream reconciliation

PR #177 initially conflicted with newer main (`c56c15c`, PRs #174/#175). The resolution preserves its selective neighbour invalidation, range-based scene reuse, draft support and pin checks. Only the source-digest call and effective timeline range lookup are changed in the merged segmented-render implementation. The upstream lock regression now supplies an actual project and picture input to the scoped digest.

Hanako was newly registered upstream. Its readonly poster metadata is supported without changing the shot; its locked media was fetched into the checkout cache with `store.py fetch hanako` (19 fetched, 5 already present, zero problems).

Existing pins still protect approved finals. The new digest can trigger their existing changed-pin check; users choose the existing repaint/keep behavior rather than silently replacing an approved picture.

Final merged verification: 274 tests passed; repository typecheck and helper strict typecheck passed; changed-file/helper lint passed. Repository lint retained zero errors and three existing warnings. Input discovery was repeatable across fresh processes for all five registered painted projects, including `HANAKO-SHORT`. Diff and link checks passed. No video render was run.
