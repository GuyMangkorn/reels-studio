---
name: painted-2d
description: Paint hand-made 2D animation (watercolour washes, boiling ink lines) with p5.brush inside Remotion, as a pure function of the frame. Use when the delivery record's visual engine is Painted 2D (p5.brush) or a mix that includes it, or when the user asks for a painted / watercolour / ink / p5 / "ภาพวาดสีน้ำ" / "ลายเส้นมือ" look. Covers the BrushCanvas contract, seeding, art direction, the brush character rig, the review loop and known gotchas.
---

# Painted 2D (p5.brush in Remotion)

Method adapted from the `code-video` skill in [Kreycin/ton-sea](https://github.com/Kreycin/ton-sea) (MIT), rebuilt
around this repo's Remotion timeline and role pipeline. This skill covers the **engine and the picture**. Story, script,
voice, captions and the mix stay with their owners (see [Role mapping](#role-mapping)).

## Runtime status (check before promising anything)

- `existing-integrated`: none yet.
- `exists-unintegrated` (commit `733808f`): `src/painted/BrushCanvas.tsx` and the 5 s spike `src/painted/spike/`
  (`PAINTED-SPIKE-Short`, its own entry point, outside `src/Root.tsx` and the episode registry).
- `missing`: a SceneRenderer/timeline scene type for painted shots, a brush character rig, pose tracks.

Inspect the active checkout first (`ls src/painted`, `grep -rn BrushCanvas src`). Anything still missing is a
**Boss dependency** recorded in the delivery record before Editor work, per
[delivery-workflow](../../../docs/delivery-workflow.md#visual-engine).

## Engine contract

```tsx
import {BrushCanvas, hash, type PaintContext} from '../painted/BrushCanvas';

const paint = ({brush, t, frame, width, height, still, boil}: PaintContext) => {
  still(1); /* washes: sky, sea, walls */       // same marks every frame
  boil(1);  /* ink outlines */                  // new marks every 2 frames: the hand-drawn boil
};
export const Shot = () => <BrushCanvas paint={paint} paper="#e8dfcc" />;
```

- **Every frame is a pure function of `t`.** Draw from nothing each frame and carry no state between frames.
  Never call `Math.random()`. Per-element randomness that must not boil (rain lanes, wave phases) comes from
  `hash(n)`. Brush texture randomness comes from `still(id)` or `boil(id)`.
- **Seed per element.** Call `still(id)` before each wash and `boil(id)` before each group of ink lines. One seed for
  the whole frame makes every wash re-randomise on each boil step, so the sky flickers.
- **Coordinates are top-left pixels** in the composition size (1080×1920 Short, 1920×1080 Long). `BrushCanvas`
  undoes the runtime's centre origin.
- **Brush scale** defaults to 5 at 1080 px wide. At 2.5 the `HB` and `pen` lines are hairlines that disappear in review.
- **One canvas per page.** p5.brush has one global WebGL2 runtime. Don't mount two `BrushCanvas` in the same frame.
  To layer painted content, draw it all in one `paint`. Put Remotion layers (captions, footage) above or below the canvas.
- **Render with `--gl=angle`** for stills and videos alike. The default backend also renders, but its pixels differ
  slightly, so mixing backends breaks frame-identical re-renders. Use the standalone import `p5.brush/standalone`; the p5 build isn't needed.
- Typings: add each newly used call to `src/painted/p5-brush.d.ts`. The signatures are in
  `node_modules/p5.brush/README.md` (find the call with `grep -n`, then read only that section).

## Art direction defaults

These are **Defaults**: Film's brief can override them with a recorded reason.

- Backgrounds are washes with no outlines. Characters and key props get one thin ink line and one cel shade.
- `hardFill` (`kit/draw.ts`) gives crisp flat shapes. Use it for straight architecture edges (frames, mullions, lockers)
  and for the foreground subject of close-up and first-person (FPOV) shots, where hands, doors, drawers, paper and books
  read well as clean flat art (user, 31 Oct 2026). Backgrounds behind them stay painted washes, never `hardFill`. In wide and medium shots, cast and in-set props use `washAt` plus `inkLine`, and characters
  inside a painted set are brush-painted, never SVG. Crisp SVG stays for close-up and FPOV inserts such as a phone screen.
- One warm light source in a cool world carries the mood. Keep its glow off faces.
- Paint back to front in a fixed depth order: sky strata, far land/sea, haze, set, floor, cast, weather, foreground frame.
- Fills drawn in the same frame are "wet": a fill touching a recent one feathers into it. Order and overlap are part of
  the look. Change them on purpose, never by accident.
- The camera always drifts or pushes a little (`brush.push/translate/scale` eased over the shot). Screen-space
  weather (rain) is drawn after `pop()`, so it doesn't zoom.
- No painted text, except at most one word the story needs. Thai text on screen is captions, owned by Editor.

## Characters (design/proposed until Boss builds the rig)

The planned rig follows ton-sea's model, implemented in TypeScript under `src/painted/` (owner: Boss):

- **One function per character:** `drawX(brush, x, y, unit, pose)`. (x, y) is the ground point. It returns the
  head and hand world points, so props, captions and other characters can attach to them.
- **Face controls** carry most of the acting: brows (up/worry/angry/sad), eyes (dot/shut/happy/wide/half plus a
  look vector), mouth (smile/o/flat/open/frown/grin), and an automatic blink every 2.5–4 s from `hash(id)`.
- **Body controls:** two-bone IK `reach` to world points (range about 1.2 units, never above the head; use arm
  angles there), plus turn, lean, tilt, squash, sit, walk and breath.
- **Pose tracks:** keys at shot-local times that ease numbers and switch strings halfway through. Add
  anticipation, nods and impact springs on top.
- **Lip-sync:** open the mouth from the narration amplitude, as `mouthAt()` does in `src/rig/drivers.ts`.
  Reuse that data rather than adding a second envelope.
- **Front-view arm depth:** bent elbows go back behind the torso, not out to the side; pick the pose type per
  action ([CP-P](../../../docs/character-proportion-principles.md#cp-p-arm-depth)).
- Approve a model sheet of every control before any acting shot.

## Role mapping

| ton-sea step | Here |
| --- | --- |
| Storyboard, one acted beat per line | Preaw script, then Mark's scene sheets ([mark-storyboard-workflow](../../../docs/mark-storyboard-workflow.md)). Each narration line gets a visible action, and something in the world answers it. |
| Style tests, palette, light | Film's brief records the painted look and its decisions. Keep rejected tests. |
| Look-defining assets (new creature, look, ending) | Film, directly in `src/painted/<episode>/` with stills for approval, no throwaway spike ([split](../../../docs/film-visual-brief-workflow.md#look-assets)) |
| Rig, shared sets, `BrushCanvas` features, hardening, measured QA | Boss, in `src/painted/` |
| Shots and cuts | Editor, through the timeline once integration exists |
| Voice / lip-sync | Gemini TTS by default ([project defaults](../../../docs/delivery-workflow.md#project-defaults)); amplitude as above |
| Subtitles | Remotion captions ([remotion-toolkit](../../../docs/remotion-toolkit.md)), not ton-sea's `subs.js` |
| SFX and music | [sound-generation-workflow](../../../docs/sound-generation-workflow.md) and the shared library |

## Review loop (every shot, every fix)

Logs go to `out/logs/`; images are viewed through `scripts/qa-sheet.sh` ([CB02/CB03](../../../AGENTS.md#context-budget)). Iteration frames under `out/` are scratch. File only the frames and sheets a handoff or review cites with `python3 -I scripts/store.py archive --path <dir> --project <PROJECT> --kind previews/<shot>` ([asset store](../../../README.md#asset-store)), and cite the store path.

```bash
E=src/painted/spike/index.ts; ID=PAINTED-SPIKE-Short          # swap for the real entry and composition
npx remotion still $E $ID out/painted/f75.png --frame=75 --gl=angle > out/logs/painted-still.log 2>&1
sh scripts/qa-sheet.sh out/painted/sheet.png --cols 4 out/painted/f*.png            # one frame per beat
ffmpeg -loglevel error -y -i out/painted/f75.png -vf crop=540:600:200:1000 out/painted/crop.png   # faces/hands/lines at full res
npx remotion render $E $ID out/painted/$ID.mp4 --gl=angle > out/logs/painted-render.log 2>&1      # timing and motion
```

Questions for each sheet:
- Does each beat read as a distinct action?
- Is the face readable, and is the lead large enough?
- Do hands touch what they hold?
- Is anything cropped?
- Does a glow wash out a face?
- Do washes hold still between two adjacent frames, while only ink, weather and motion change?

**Determinism check** before handing off: render one frame twice and `cmp` the PNGs. They must be identical.

## Gotchas

- Picture shifted right and down: the canvas origin is at the centre. Draw inside `BrushCanvas`, which translates.
- Sky or walls flicker: a wash was drawn under a `boil()` seed, or with no seed of its own. Give it `still(id)`.
- Lines invisible in the sheet: the brush scale or weight is too small for the frame width. Crop at full resolution
  before changing colours.
- A re-rendered frame doesn't match the earlier one: check that both used `--gl=angle`.
- Measured speed of the spike shot: 150 frames in about 16 s, including the bundle. Re-measure when a shot gets
  heavy (many fills); fills cost far more than lines.
