# Haunted house P1 asset library

Scope: Issue #6 P1 assets, a silent 31-second review timeline, and JSON camera controls. This is an asset showcase, not the narrated historical episode. P2 (street, garden, supporting cast, blood-cell diagram) is tracked in #7 and P3 (overlays) in #8 for separate PRs.

All artwork is original SVG written in this repository and uses the channel's pastel palette. No imported art, audio, fonts or new dependencies.

## Library IDs

| JSON field | IDs / options |
| --- | --- |
| Actor `type: narrator`, `character` | `mrsH` (bun/skirt), `mrH` (vest/moustache), `brotherH` (recolor/bald variant) |
| Human `pose` | Existing poses plus `stand` and `lie`; Mrs. H supports stand/walk/shock/lie |
| Actor `type: ghost`, `ghostVariant` | `womanBlack`, `seatedPair`, `crawler` |
| Ghost `opacity` | 0..1, default .55; `scale`, `flip`, `from`/`to` also apply |
| `bg: oldHouseExterior` | `time: day/dusk/night/moonlight`, `background.windowLights: boolean` |
| `bg: houseInterior`, `background.variant` | `drawing`, `dining`, `staircase`, `bedroom`, `kitchen` |
| `bg: basement` | Brick walls and pipes; add the furnace independently |
| Prop `type: furnace` | `smoke: 0..1`, default .35; deterministic frame-driven fire flicker |

Characters reuse `Character.tsx` and its nested joints. A lie transition rotates the root of that skeleton around the hip, with the same 12-frame blend as the other poses. Blinks and audio-driven mouths retain the existing drivers. `showPivots: true` shows the actual nested joint pivots for checking; it is absent from delivered showcase JSON.

Furnace smoke is a stylized combustion/exhaust cue. CO itself is invisible; do not describe these puffs as visible CO in episode narration.

## Camera data

```json
{
  "camera": {
    "zoom": [1.15, 1.3],
    "pan": {"from": [0.02, 0], "to": [-0.04, 0]},
    "parallax": 0.6,
    "view": "front",
    "lighting": "silhouette"
  }
}
```

Zoom endpoints are 1..4; pan coordinates are fractions of composition width/height, clamped to available zoom overscan so the stage cannot expose empty edges. Motion eases over shot-local duration and is deterministic when seeking. Parallax (0..1) adds depth-dependent movement to the existing far/mid/near layers. Background overscan covers the added layer motion. Silhouette lighting darkens actors while preserving the set and screen text. Titles and Thai subtitles stay outside the camera.

`view: topDown` selects authored overhead geometry in `houseInterior`; it requires the bedroom or staircase variant and is rejected for other sets. Staircase and bedroom default to overhead. It does not turn a frontal human drawing into a 3D overhead figure. `time: moonlight` adds a moonlight shaft. Drawing/dining/kitchen share the arch/window shell; overhead variants share the floor plan.

Optional scene `channelName` supplies the footer name; omission hides it. Thai subtitles own the bottom band.

## Preview and validation

```sh
npm test
npm run typecheck
node scripts/preview-haunted.mjs
```

The preview helper renders each of ten shots at local frame 60, plus joint debug images, to `out/haunted-qa/Short/` and `out/haunted-qa/Long/`. It bundles once and uses the existing production compositions. Nothing in `out/` is committed.

To load the showcase in Studio, use the timeline in `scripts/haunted-house-p1.json` as the `timeline` input prop, set `narration` to `null`, and choose Short or Long. For CLI renders, generate an ignored props file:

```sh
node -e 'const fs=require("fs"); fs.writeFileSync("out/haunted-p1-props.json",JSON.stringify({timeline:JSON.parse(fs.readFileSync("scripts/haunted-house-p1.json","utf8")),narration:null,ending:"B_loop"}));'
npx remotion render src/index.ts Short out/haunted-short-check.mp4 --props=out/haunted-p1-props.json --frames=0-5
npx remotion render src/index.ts Long out/haunted-long-check.mp4 --props=out/haunted-p1-props.json --frames=0-5
```

Omit `--frames` for a full silent showcase. This does not change the default demo, narration or renderer. The final narrated episode and its A/B endings are subsequent production work.
