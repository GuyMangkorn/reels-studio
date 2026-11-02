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
| `head.ts` | `paintHeadFront`, `paintHeadSide`, `HeadStyle`, `FaceLook`, `FaceState`, `Brow`/`Eyes`/`Mouth`, `headOutline`, `BROW_Y`, `blinking`, `HEAD_SPAN`, `CHIN` | Decal heads with face controls; `HeadStyle.look` picks eye, nose, brow and closed-mouth drawing (front view) |
| `hash.ts` | `hash` | Deterministic 0..1 noise |
| `people.ts` | `PEOPLE`, `PEOPLE_INFO` | **Central template cast**: 14 ready `CastDef`s (men, women, children, elders). Pick one by id, then override `outfit`/`head` per video |
| `hair.ts` | hair geometry for the `HeadStyle.cut` values `crop parted spiky buzz balding bowl pixie ponytail pigtails curly perm` | Front and profile hair; extra `HeadStyle` fields `facial`, `glasses`, `accent`, `brows` |
| `people-sheet.tsx` | `KIT-PEOPLE-LINEUP`, `KIT-PERSON-<id>` | Lineup and per-character model sheets (front/left/right, 9 faces); render with `node scripts/painted-kit/people.mjs --out=DIR` |
| `face-looks-sheet.tsx` | `KIT-FACE-LOOKS`, `KIT-FACE-CAST` | Every `FaceLook` part side by side, and each PEOPLE head without and with its look; render with `printf 'KIT-FACE-CAST 0 out/face-looks/KIT-FACE-CAST.png\n' \| node scripts/stills.mjs src/painted/kit/face-looks-sheet.tsx` |
| `expressions.ts` | `EXPRESSION_IDS`, `EXPRESSIONS`, `EXPRESSION_INFO` | Named faces (neutral, happy, worried, angry, sad, surprised, scared, tired ...) as `FaceState`; sheet `KIT-EXPRESSIONS` |
| `wardrobe.ts`, `gear.ts` | `OUTFIT_IDS`, `WARDROBE`, `WARDROBE_INFO`, `dress(def, outfitId)`; `Outfit.gear` | Job and school outfits (police, nurse, monk, office ...) applied to any person; sheet `KIT-WARDROBE` |
| `legs.ts`, `props.ts` | `kneelSolution`, `KNEEL_STAGES`, `sitFootOffset`; `drawChair` | Sit, kneel and floor legs; chair prop |
| `poses-more.ts`, `poses-sheet.tsx` | `ALL_POSE_IDS` (P01-P45), `poseFor`, `poseMix`, `hasView`, `poseViews` | Profile arms for P02-P30 and body poses P31-P45; sheets `KIT-POSES`, `KIT-POSES-CLOSE` (`scripts/painted-kit/poses.mjs`) |
| `motions.ts`, `motion-reel.ts` | `MOTIONS`, `MOTION_INFO`, `layerMotion({person, motion, t, g, unit})` | Motion presets (walk, run, nod, sit-down, kneel-down ...) as pure functions of shot-local time; reel `KIT-MOTIONS`. Use `layerMotion`, don't hand-build walks |
| `shot-templates.ts`, `template-reel.ts` | `twoShot`, `threeShot`, `talkingCloseUp`, `sideWalk`, `povShot`, `SHOT_TEMPLATE_IDS` | Ready staging templates built on person/outfit/pose/motion ids; video `KIT-SHOT-TEMPLATES` |
| `animals.ts`, `animals-sheet.tsx` | `ANIMAL_IDS`, `ANIMALS`, `ANIMAL_INFO`, `drawAnimal(p, seed, def, g, unit, pose, t)`, `animalWalkSpeed` | Dogs (chihuahua, pom, Thai, golden, black lab) and cats (tabbies, black, white, siamese, calico, tuxedo); profile and front, stand/walk/sit/lie, wag, open mouth; sheets `KIT-ANIMALS`, `KIT-ANIMALS-LINEUP` |
| `animal-motions.ts` | `ANIMAL_MOTION_IDS`, `animalMotion(id, t, {animal, view})`, `animalMotionDuration`, `ANIMAL_MOTION_INFO` | Animal motions (idle, happy-wag, speak, sniff, startle-hop, walk in/out, run, sit-down, stand-up, lie-down, get-up) as pose + root offset; video `KIT-ANIMAL-MOTIONS` |
| `casting.ts`, `cast-cards-sheet.tsx` | `parseCasting`, `formatCasting`, `CARD_POSES` | Casting line `person [+ outfit] [, pose] [, expression]` for briefs, e.g. `man-parted + police, P15, scared`; catalog `KIT-CAST-CARDS` |

Template cast (look here first)
- Need a new person? Start from `PEOPLE` in `people.ts` (see `PEOPLE_INFO` for age, gender, hair) and view `KIT-PEOPLE-LINEUP` / `KIT-PERSON-<id>`; copy the entry into the episode's cast and change only `outfit` and props. Add a new character to `PEOPLE` only for a reusable look.
- Face look: every `PEOPLE` head carries a `look` (eye `almond|lidded|hooded|round`, nose `hook|ell|nostrils|broad|button`, brow `arch|tapered|thick`, mouth `line|lip|full|thin`), chosen to match the person (user-approved 2 Nov 2026, sheet `KIT-FACE-CAST`). Keep the look when copying a person; a new person picks parts that fit their age and features. Every `PEOPLE` entry must have a `look` (`tests/people.test.ts`); the bare round-eye face stays only for episode casts that predate it (WFOG, ZCPAINT, KSO). The profile view does not use `look` yet.
- Talking and turning: face controls (`FaceState`, `talk` mouth with `open` from `mouthAt()`), head `front|left|right`. Example: composition `KIT-PEOPLE-TALK`. No 3/4 view yet.
- `CastDef.headScale` / `armScale` size children; `Outfit.skirtHem` sets a short skirt.

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
