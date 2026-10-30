# DF-20261030-font-import-side-effect — `loadFont` at module import broke `node --test` for plate modules

- Owner: Boss; first observed: 2026-10-30 (`npm test`, 10 suites failed after `src/painted/bloop/fx.tsx` called `loadFont` at import); last checked: 2026-10-30 (Boss, working tree, base `3130527`)
- Status: fixed (uncommitted; `fx.tsx` no longer loads a font at import)
- Type: tool-limitation
- Tags: tooling / fonts / tests
- Scope: `src/painted/bloop/fx.tsx` (removed `loadFont`), `src/scenes/Subtitles.tsx` (the production load of the Noto Sans Thai face, unchanged); `src/painted/registry.ts` imports every plate module, so any test that imports the registry runs the import
- Consumers: every test importing `src/painted/registry.ts` (`painted`, `zcpaint`, `world-fog`, `oldest-shipwreck`, `bloop`)

## Symptoms and evidence
- Desired: plate modules import without side effects.
- Observed: `loadFont({url: staticFile(...)})` in node resolves `/fonts/NotoSansThai.ttf` as a relative URL; the rejected promise is reported as an unhandled rejection and 10 suites fail (`out/logs/bloop-test-1.log`).

## Attempts and results
- Removed the call from `fx.tsx`; the face is loaded by `scenes/Subtitles` for every captioned composition, and the QA spike imports `Subtitles` for its side effect. `npm test` back to green (153 tests).
- Not changed: `Subtitles.tsx` and `src/painted/spike/BloopLook.tsx` (Film's spike) still call `loadFont` at import; they are not imported by tests.

## Planning impact
- Film/Mark: none.
- Boss/Editor: a new plate module must not load fonts at import; load them in the scene path or a spike entry.

## Revalidation history
- 2026-10-30 (Boss): `npm test` before → 10 failed suites; after → 153 passed, 0 failed.
