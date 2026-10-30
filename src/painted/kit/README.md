# Painted kit (`src/painted/kit/`)

Episode-neutral painted-2D building blocks shared by WORLD FOG, ZCPAINT, BLOOP and SHIPWRECK. Pick pieces from the
catalog image (`out/kit-catalog/KIT-CATALOG.png`, regenerate with `node scripts/painted-kit/catalog.mjs --out=out/kit-catalog`,
view with `scripts/qa-sheet.sh`). Source of the catalog: [catalog.tsx](catalog.tsx).

| Module | Exports | Use |
| --- | --- | --- |
| `painter.ts` | `Painter`, `makePainter`, `tintPainter`, `mixColor`, `ramp`, `lerp`, `clamp01`, `rot`, `range`, `ring`, `Pt` | One plate's wash/flat/ink calls, seeded per plate frame |
| `draw.ts` | `INK`, `solid`, `hardFill`, `washAt`, `glaze`, `inkLine`, `ell`, `limb`, `capsule`, `rectPts`, `blob`, `band`, `projectPoly`, `clipScreen`, `quadX/Y/Z`, `bbox`, `clipHalf`, `planeBand`, `formDir`, `finite`, `norm` | Fills, ink and polygon geometry |
| `space.ts` | `V3`, `DEG`, `ease`, `seg`, `smoothstep`, `bump`, `pchip`, `hermite`, vector helpers, `NEAR`, `Proj<S>`, `cardProjector`, `ptLerp` | Easing, curves, projector contract |
| `hands.ts` | `HandTone`, `DEFAULT_HAND_TONE`, `paintPovHand`, `paintEdgeGrip`, `thumbShape`, `twoBone`, plus local `ring`, `capsule`, `solid`, `inkLine` | Painted hands; pass the episode's `HandTone` |
| `camera.tsx` | `Camera`, `STILL_CAMERA`, `pushCamera`, `easeOver`, `toScreen`, `applyCamera`, `cameraTransform`, `CameraLayer` | Shot camera for brush and SVG layers |
| `glow.tsx` | `GLOW_PEAK`, `Shafts`, `Flash`, `Spot`, `Bubbles`, `Vignette` | Light overlays (<= 0.3 peak) |
| `screen.tsx` | `Grade`, `Grain`, `CaptionShade`, `shadeGate`, `CaptionCue` | Screen-space grade, grain, caption shade |
| `hash.ts` | `hash` | Deterministic 0..1 noise |

Rules
- Nothing here may import an episode module (`worldfog/`, `zcpaint/`, `bloop/`, ...); episodes pass their constants in
  (`WFOG_HAND` in `worldfog/hand.ts`, `ZC_HAND` in `zcpaint/hand.ts`).
- `hands.ts` defines its own `ring`/`capsule`/`solid`/`inkLine` (different signatures from `painter.ts`/`draw.ts`): import by module, not by guess.
- WFOG lighting (`VD18`, `modelPart`) and story clocks stay in `worldfog/draw.ts` / `worldfog/space.ts`, which re-export the kit.
- Kit changes need a before/after still check: `node scripts/painted-kit/regress.mjs --out=DIR` and `python3 -I scripts/painted-kit/compare.py OLD NEW`.
