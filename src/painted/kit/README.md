# Painted kit (`src/painted/kit/`)

Episode-neutral painted-2D building blocks shared by WORLD FOG, ZCPAINT, BLOOP and SHIPWRECK. Pick pieces from the
catalog image (`out/kit-catalog/KIT-CATALOG.png`, regenerate with `node scripts/painted-kit/catalog.mjs --out=out/kit-catalog`,
view with `scripts/qa-sheet.sh`). Source of the catalog: [catalog.tsx](catalog.tsx).

| Module | Exports | Use |
| --- | --- | --- |
| `painter.ts` | `Painter`, `makePainter`, `tintPainter`, `mixColor`, `ramp`, `lerp`, `clamp01`, `rot`, `range`, `ring`, `Pt` | One plate's wash/flat/ink calls, seeded per plate frame |
| `draw.ts` | interior-light model (`InteriorLight`, `VD18`, `modelPart`, `toneOf`, `lineOf`, `hatchIn`, `rimScaleOf`), `INK`, `solid`, `hardFill`, `washAt`, `glaze`, `inkLine`, `ell`, `limb`, `capsule`, `rectPts`, `blob`, `band`, `projectPoly`, `clipScreen`, `quadX/Y/Z`, `bbox`, `clipHalf`, `planeBand`, `formDir`, `finite`, `norm` | Fills, ink and polygon geometry |
| `space.ts` | `V3`, `DEG`, `ease`, `seg`, `smoothstep`, `bump`, `pchip`, `hermite`, vector helpers, `NEAR`, `Proj<S>`, `cardProjector`, `ptLerp` | Easing, curves, projector contract |
| `hands.ts` | `HandTone`, `DEFAULT_HAND_TONE`, `paintPovHand`, `paintEdgeGrip`, `thumbShape`, `twoBone`, plus local `ring`, `capsule`, `solid`, `inkLine` | Painted hands; pass the episode's `HandTone` |
| `camera.tsx` | `Camera`, `STILL_CAMERA`, `pushCamera`, `easeOver`, `toScreen`, `applyCamera`, `cameraTransform`, `CameraLayer` | Shot camera for brush and SVG layers |
| `glow.tsx` | `GLOW_PEAK`, `Shafts`, `Flash`, `Spot`, `Bubbles`, `Vignette` | Light overlays (<= 0.3 peak) |
| `screen.tsx` | `Grade`, `Grain`, `CaptionShade`, `shadeGate`, `CaptionCue` | Screen-space grade, grain, caption shade |
| `cast.ts` | `CastDef`, `Outfit`, `FigPose`, `Arm`, `Prop`, `FigAnchors`, `drawFigure(p, def, g, unit, pose, t)`, `shoulderHeight(def, crouch)`, `ikElbow`, `H`, `BONE`, `drawTorch`, `drawUmbrella` | Recurring 4-head cast rig (front and profile flat cards) |
| `poses.ts` | `POSE_IDS`, `PoseId`, `POSES`, `poseArms(id, def, g, unit)`, `shoulderAnchors(def)` | Pose sheet P01-P30 as shoulder-relative hand targets for the cast rig (front, standing; [CP-P11](../../../docs/character-proportion-principles.md#cp-p-pose-sheet)) |
| `head.ts` | `paintHeadFront`, `paintHeadSide`, `HeadStyle`, `FaceState`, `Brow`/`Eyes`/`Mouth`, `headOutline`, `BROW_Y`, `blinking`, `HEAD_SPAN`, `CHIN` | Decal heads with face controls |
| `hash.ts` | `hash` | Deterministic 0..1 noise |

Recurring cast
- A character is a `CastDef = {height, head: HeadStyle, outfit: Outfit, seed}`; the episode owns its entries (`worldfog/cast.ts` `CAST`) and calls `drawFigure(p, def, ...)`.
- A recurring character keeps the same head and body in every video. Per video only `outfit` (and props) changes: `{...def, outfit: {...def.outfit, jacket: ...}}` (catalog cell "outfit swap").
- Changing a recurring head or body (`head`, `height`, proportions in `cast.ts`/`head.ts`) is a look change and needs user approval.
- Arms: `Arm {to, out?, via?, behind?}`. `via` is an authored elbow (no IK, no reach clamp); `behind: 'upper' | 'all'` paints the arm behind the torso, a shade darker (front view).
- Limit: each figure is a flat card at one depth (front or profile views). It cannot turn around its body; a shot that needs a turn cuts or crossfades between views.
- Props in the rig today: torch, phone, umbrella. New props (bottle, glass, bucket) are not in the kit yet.

Rules
- Nothing here (except `catalog.tsx`, which shows WFOG's `CAST`) may import an episode module (`worldfog/`, `zcpaint/`, `bloop/`, ...); episodes pass their constants in
  (`WFOG_HAND` in `worldfog/hand.ts`, `ZC_HAND` in `zcpaint/hand.ts`).
- `hands.ts` defines its own `ring`/`capsule`/`solid`/`inkLine` (different signatures from `painter.ts`/`draw.ts`): import by module, not by guess.
- WFOG story clocks and setups stay in `worldfog/space.ts`; `worldfog/draw.ts` and `worldfog/cast.ts` re-export the kit (cast keeps `Who`, `CAST` and by-role `drawFigure`).
- Kit changes need a before/after still check: `node scripts/painted-kit/regress.mjs --out=DIR` and `python3 -I scripts/painted-kit/compare.py OLD NEW`.
