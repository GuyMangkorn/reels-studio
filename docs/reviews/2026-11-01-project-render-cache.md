# Project-scoped render cache

## Confirmed scope

User decision, 1 November 2026: p5.brush painting and SVG in Remotion; independent story projects with Reels and optional YouTube Long. Shared character changes propagate to consuming projects at their next render. Start with project-level dependency tracking, retain existing scene keys, and bypass reuse when dependencies cannot be determined. No project moves, editorial changes or character version system.

## Implementation

- `scripts/segments.mjs` passes composition ID and effective props to `scripts/render-inputs.ts` in a fresh tsx process. The helper returns a content digest; failure produces a unique digest and a warning, preventing stale reuse.
- Shared render imports are traversed from `src/index.ts`. At the painted registry, catalogue object identity identifies the selected shot inventories; their transitive imports include any shared character implementation. IDs are not inferred from prefixes or project directory names.
- Selected project declarations are evaluated for ownership but are not hashed as runtime source: their serialized output is already covered by the existing scene keys. A caption edit still invalidates only the scene and its neighbours.
- Picture media is identified from effective runtime `src` fields, static asset calls and source literals. Its bytes and applicable selected-project lock entries are included. Extensionless files are supported. Sound-only props and lock entries are excluded: audio is rebuilt independently.
- Package lock, TypeScript settings, render tooling and supported render configuration are included. Static imports, re-exports, literal dynamic imports and import-equals dependencies are followed. Unresolved imports, unknown ownership/shot inventory, unverified remote media and unsupported computed asset discovery bypass reuse.

## Conservative limits

- A shared-renderer edit or a selected inventory edit can invalidate every scene in a consuming project. Tracking individual art dependencies per scene is intentionally deferred.
- The existing central registry remains. Changing that dispatch implementation can invalidate all projects; moving registration into projects is a separate proposal.
- Discovery evaluates existing project declarations and shot inventories in a fresh process. This avoids stale module state; it does not isolate browser bundles or fix unrelated projects that fail to compile.
- Known props-driven media paths in the current shared renderer are supported explicitly. Unsupported discovery uses the safe bypass rather than guessing. Data URLs also bypass reuse conservatively.
- Existing cache keys change once with this implementation. Old cached segments remain in the store; they are not deleted or migrated.

## Verification evidence

Fixture tests in `tests/render-inputs.test.ts` cover unrelated project isolation, shared-character propagation through imported JSON, local media byte drift, picture locks/configuration, unknown/missing inputs, dynamic discovery, extensionless/remote media, import-equals, computed asset paths, sound-only edits and existing per-scene caption reuse. Existing segment tests continue to exercise duration, ending and neighbour invalidation.

Final verification: all 257 tests passed; repository typecheck, helper strict typecheck and helper lint passed. Repository lint reported zero errors and three existing Hanako hook warnings. Diff and documentation link checks passed.

Real helper execution successfully discovered inputs for `SHIPWRECK-SHORT`, `BLOOP-EP01-SHORT`, `WFOG-EP01-SHORT` and `ZCPAINT-SHORT-TH`. Each returned the same digest across two fresh-process executions after the fixes. Logs are under `out/logs/project-cache-*` (local QA scratch).

Fresh review identified stale extensionless/computed media, missing import-equals traversal and sound-only invalidation; regression tests reproduced these before correction.

No timeline, rendering implementation, picture, narration or caption content changed. No video render or visual QA was performed; tests and real input discovery establish cache selection behavior, not measured render speed or visual quality.
