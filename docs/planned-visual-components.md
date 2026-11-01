# Planned Visual Components and POV Contracts

**Status: Design reference, not a usable JSON API.** These requirements describe proposed shared components/camera presets. Check the active source, types, validation and renderer before use. Implement all integration points before treating any example as executable. This documentation migration does not establish current implementation status.

Output, subtitle and narration rules are owned by [production-requirements.md](production-requirements.md); medium/lighting choices are owned by Film’s brief and [Boss production rules](boss-asset-workflow.md#latest-production-rules).

## Planned reusable overlay components

These are design specifications. Implement their components, JSON types, validation and renderer dispatch together before using these examples in a production timeline.

These overlays were specified as unimplemented designs; recheck the target checkout before assigning implementation status. Build each one once, under `src/assets/overlays/`, and select it from scene JSON by id. A chapter does not redraw the card or the phone. Both use Noto Sans Thai. Both are the same component in `Short` and `Long`.

### RuleCard

Style reference: a cream rules placard in a dark interior. File `src/assets/overlays/RuleCard.tsx`, JSON id `rule-card`.

- Cream fill, large corner radius, a thin dark border, and a soft shadow.
- A small heading line, lighter and smaller than the rules. Example: `คนในหุบนี้สอนว่า`.
- A hairline under the heading and between items.
- Each item is a black circle badge with a white number (1-based, in array order) and large bold Thai text.
- The card is centered, with side margins and a width cap, so a line stays readable at 1080×1920 and at 1920×1080.

The card and heading are in at `startFrame`. Item `i` pops in at `startFrame + i * staggerFrames` with Remotion `spring()` and a slight scale (about 0.92 settling at 1). An item that has not arrived yet is left out. Earlier items stay.

| Prop | Type | Role |
| --- | --- | --- |
| `heading` | `string` | The small line above the rules |
| `items` | `string[]` | Rule lines, in order |
| `startFrame` | `number` | Frame the card appears |
| `staggerFrames` | `number` | Frames between item pop-ins |

```json
{
  "overlay": "rule-card",
  "heading": "คนในหุบนี้สอนว่า",
  "items": [
    "อย่าขานรับเสียงเรียก",
    "อย่าเปิดประตู",
    "รอจนแดดส่องถึงพื้น"
  ],
  "startFrame": 90,
  "staggerFrames": 18
}
```

### PhoneChat

Style reference: a handset in a dark room, one group chat on the screen, episode subtitle in the bottom band under the phone. File `src/assets/overlays/PhoneChat.tsx`, JSON id `phone-chat`.

Draw a generic handset: rounded frame, a plain pill notch, time on the left of the status bar, signal bars and a battery outline on the right. Leave out the Apple logo and any trademark phone UI.

- The screen is a light panel.
- The header is a circular badge plus the chat name in bold. Example name: `รอหมอกจาง`. The reference badge reads `5`. Optional `badge` sets that mark; when it is omitted, show the number of distinct senders.
- Each message is a small sender label (example: `คุณเทียน`) and a rounded light bubble. Text wraps. Bubbles stack from the top and stay once shown. Overflow scrolls inside the screen.
- At `atSec` the next slot shows a typing-dots indicator, then the bubble replaces the dots after a short hold (about 0.4s). `atSec` is seconds from the start of the composition (`frame / fps`).

| Prop | Type | Role |
| --- | --- | --- |
| `time` | `string` | Status-bar clock, e.g. `05:40` |
| `chatName` | `string` | Group title in the header |
| `messages` | `{ sender: string, text: string, atSec: number }[]` | Lines, in order |
| `scale` | `number` | Uniform scale of the whole phone |
| `x`, `y` | `number` | Center of the phone, in composition pixels |
| `badge` | `string` (optional) | Film inside the header circle |

`x`, `y`, and `scale` are how one component fits both frames. A Short scene can pass a large centered phone. A Long scene passes a smaller one. Keep the bottom subtitle band clear. PhoneChat does not draw the episode subtitle.

```json
{
  "overlay": "phone-chat",
  "time": "05:40",
  "chatName": "รอหมอกจาง",
  "badge": "5",
  "x": 540,
  "y": 820,
  "scale": 1,
  "messages": [
    {
      "sender": "คุณเทียน",
      "text": "6:15 ลุงเปิดไฟหน้ารถ เปิดประตู รอ",
      "atSec": 2.4
    }
  ]
}
```

The `x` and `y` above are for a 1080×1920 frame. The Long composition supplies its own.


## Shot variety and POV (horror-film feel)

These are scene handoff directions and planned camera contracts. Check the active camera module, scene types and validator before using these fields in JSON. Implement shared POV/image framing under `src/camera/` according to Film's brief. Distinguish picture-space effects from spatial camera motion and keep subtitles in screen space.

Reuse characters, rooms and props while developing action, relationships, evidence and audience knowledge across the sequence. Camera, light and crop support that progression; changing them alone does not establish a new storytelling beat. A single location can sustain a story when its actions and discoveries develop. Choose additional locations, demonstrations, diagrams or representations when they clarify the story, with no quota for locations, cuts or 3D elements. Use the sequence review in [Film’s workflow](film-visual-brief-workflow.md#visual-progression-before-asset-selection) before polish.

Keep the channel's stylized palette across 3D sets and 2D cut-outs. Suspense comes from spatial framing, lighting, foreground occlusion and timing, with darker grades of that palette as needed.

Use a first-person POV now and then, for suspense, in the manner of a horror film. A Short cut from a chapter may keep a POV that is already in that chapter. Do not add a POV to every line of the Short.

Build each POV once, as a camera preset under `src/camera/`. Scene JSON selects it. A chapter does not draw its own window, door crack, keyhole, flashlight cone, curtain, or foliage.

### How often

Use this restraint when planning shots, including `povWatcher`. These are planning defaults. When a supplied scene handoff intentionally uses a different POV sequence, preserve its shot order and record that choice in the shot sheet.

- Use a POV only when the beat needs it: a suspense build, or a reveal. Default to normal framing otherwise.
- POV shots of any kind stay a minority of the shots in a chapter. As guidance, about 1–2 per long-form chapter when useful; chapter length follows the selected story under [production requirements](production-requirements.md#outputs-and-story-timing). Never every scene.
- Normally place a shot with normal framing between POV shots.
- `povWatcher` is rarer: at most about one per chapter, and not in consecutive chapters by default.

| Preset | Shot |
| --- | --- |
| `povWindow` | Looking out a window into darkness, where something may appear. |
| `povDoorCrack` | Peeking through a half-open door. |
| `povBed` | From the bed toward the foot of the bed (`bedroomPOV`). |
| `povHallway` | Down a dark staircase or a dark hallway. |
| `povKeyhole` | Through a keyhole. Same idea as the door crack, tighter frame. |
| `povFlashlight` | A flashlight cone sweeping a basement. |
| `povWatcher` | The view from an unseen presence watching the characters. |

Suspense grammar lives in the preset:

- Hold on an empty frame before anything enters.
- Leave dead space at the edges, so a shape has somewhere to arrive.
- A slow push-in.
- A delayed reveal. Whatever is in the window or the doorway appears a beat late, or the viewer catches it only on a second look.
- A false scare, the cat or the dog, before the real one.
- A sound cue before the visual.
- A vignette and darkened edges.

Subtitles stay as specified under [Thai subtitles, narration and channel label](production-requirements.md#thai-subtitles-narration-and-channel-label): large, bottom, white with a dark stroke, on screen from frame 0. The vignette sits on the picture. It does not move, restyle, or cover the subtitle line. The same preset frames itself in `Short` and in `Long`.

```json
{
  "camera": {
    "preset": "povWindow",
    "reveal": { "actor": "cat", "atSec": 3.6 }
  }
}
```

`preset` is `povWindow`, `povDoorCrack`, `povBed`, `povHallway`, `povFlashlight`, `povKeyhole`, or `povWatcher`.

`reveal.actor` is a library id: a character, the cat, the dog, or a simple silhouette. `reveal.atSec` is seconds from the start of the shot when that actor enters. Omit `reveal` to hold on the empty frame. A false scare is an early `reveal` of `cat` or `dog`. The beat that matters comes later, or on a second use of the same preset.

### Watcher POV

`povWatcher` is the camera of someone the characters do not see. The lens sits in a hiding place and looks at them:

- Behind curtains.
- Outside the window, looking in.
- The dark top of the stairs.
- Through foliage in the garden.
- A corner, with furniture between the lens and the room.

One preset covers those places. `place` picks the foreground: `curtains`, `outsideWindow`, `stairTop`, `foliage`, or `furnitureCorner`. The occluder (cloth, window frame, stair rail, leaves, a chair back) is part of the preset and covers part of the frame. The camera has a slight handheld sway, slow and small, like a body holding still. The same vignette and darkened edges as the other POV presets apply. The characters on screen are the scene's actors. `reveal` is optional here. Use it when something extra arrives late, such as a head turning toward the hiding place.

```json
{
  "camera": {
    "preset": "povWatcher",
    "place": "curtains",
    "reveal": { "actor": "kid-mint", "atSec": 1.2 }
  }
}
```

Keep it channel-safe. Creepy, not gory: no blood, wounds, or injury. The twist can be funny. The shape in the window can be the cat. A subtitle on the empty hold can be `มีอะไรรึเปล่า... นอกหน้าต่าง`.
