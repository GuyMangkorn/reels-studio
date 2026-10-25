# AGENTS.md

Instructions for coding agents (Codex, Grokbot, and others) working in this repo.
Read this file before adding a video, a character, or a pose.

## Purpose

This is a Thai YouTube studio for Shorts and long-form videos, rendered with [Remotion](https://www.remotion.dev/).

The goal is a reusable asset library plus a scene-from-JSON pipeline, so a new video needs little new code. Characters, animals (dog, cat, and later others), poses, backgrounds, and props are channel icons. They recur from video to video. A scene picks assets by id and describes timing. It does not redraw them.

Today the library is the human cut-out in `src/rig/` and four poses (`idle`, `walk`, `wave`, `point`). `src/Demo.tsx` is a hand-written timeline that cross-fades those poses. The JSON loader is the target, not a finished system. Until it exists, a new scene is a thin component under `src/scenes/` that only references library ids. When you add the loader, keep that rule: JSON selects assets, it does not inline art.

Example scene the channel would repeat (library ids, not new drawings):

```json
{
  "id": "dog-found-money",
  "fps": 30,
  "hook": "น้องหมาเจอเงินตกอยู่... มันจะเก็บไว้ไหม?",
  "moral": "ของที่ไม่ได้เป็นของเรา ควรคืนเจ้าของ",
  "voice": { "name": "Niwat", "rate": 1.05 },
  "shots": [
    { "start": 0, "pose": "idle", "background": "park-day", "subtitle": "เช้าวันหนึ่งที่สวน" },
    { "start": 48, "pose": "point", "character": "kid-mint", "prop": "banknote", "subtitle": "เงินกองนี้อยู่กลางทางเดิน" }
  ]
}
```

Put timelines like this in `scripts/` (one JSON file per chapter or short). Do not copy `Character.tsx` into the scene.

## Visual style

Flat 2D vector, cut-out rig, bright pastel. The picture is solid fills, round corners, and a consistent dark outline. It is not a low-poly style.

Match the palette already in the rig:

| Role | Hex |
| --- | --- |
| Skin | `#FFD9B8` |
| Shirt / accent | `#FF8FA3` / `#FFF3B0` |
| Pants | `#7ED6B2` |
| Shoes | `#FF9F5A` |
| Hair | `#6B4A3A` |
| Cheek | `#FFADAD` |
| Outline | `#4A3B3B` |
| Sky gradient | `#FFF1C9` → `#FFE0E6` |
| Sun | `#FFD166` |
| Ground | `#B8F2C9` |

Motion:

- Joint pivots, nested. Arms: shoulder → elbow → wrist. Legs: hip → knee → ankle. Body: torso → neck → head. Angles are degrees, SVG clockwise. Arms hang at `0`. The right arm raises with negative angles.
- Secondary motion is a pendulum with lag. Forearm lags the upper arm, wrist lags the forearm (`armSwing` in `src/rig/presets.ts` uses phase offsets `0.9` and `1.6`). A new gesture keeps that lag. A stiff arm that copies one angle onto every joint is wrong.
- Blink comes from `blinkAt` (about every 1.8–4.2s, 6 frames). Mouth flap comes from `mouthAt` driven by a per-frame amplitude array. Do not keyframe blinks or visemes by hand inside a scene.
- `showPivots` draws red dots on the joints. Use it while checking a pose, and leave it off in delivered renders.

## Outputs

Every scene renders twice from the same component, at 30 fps:

| Composition | Size | Use |
| --- | --- | --- |
| `Short` | 1080×1920 | YouTube Shorts |
| `Long` | 1920×1080 | long-form |

`Rig2DDemo` is the original portrait id. It is the same frame as `Short` (1080×1920, 210 frames). Layout math is defined at 1080×1920 and scaled with `width / 1080` and `height / 1920`, so `Long` shows the same staging.

Long-form runs 8–10 minutes and is split into chapters of 45–60 seconds. Each chapter has its own hook in the first 2 seconds, so the chapter can be cut out and posted as a Short without a recut of the story.

## Shorts spec

- Length about 40–45 seconds. A moral drama may run up to 55 seconds. The current `Short` composition is only the 7-second rig demo (`durationInFrames={210}`). A real short replaces that duration; it does not add a second renderer.
- Hook inside the first 2 seconds (60 frames). No intro, no logo card, no "subscribe" open.
- Subtitles visible from frame 0.
- The ending moral stays readable for about 3 seconds (90 frames).
- Render two ending files:
  - `_A_fade` — moral hold, then fade out.
  - `_B_loop` — moral hold with the last pose still on screen so the short can loop.
- Example filenames: `dog-found-money_A_fade.mp4`, `dog-found-money_B_loop.mp4`. Write them under `out/`. `out/` and `*.mp4` are gitignored.

Thai subtitle example (on screen for the hook):

> น้องหมาเจอเงินตกอยู่... มันจะเก็บไว้ไหม?

Moral held at the end:

> ของที่ไม่ได้เป็นของเรา ควรคืนเจ้าของ

## Thai subtitles and narration

Subtitles:

- Large, bottom of the frame, white fill, dark stroke.
- Font: Noto Sans Thai, or Sarabun if Noto Sans Thai is not loaded.
- On Shorts, sit the line high enough that the platform's bottom buttons do not cover the glyphs.
- Thai text from the first frame. Do not burn an English duplicate on top of the Thai line.

Narration:

- TTS voice: **Niwat** (Thai `th-TH`).
- Rate: **+5%** (`speakingRate: 1.05`).
- Write the mp3 locally (for example `public/narration.mp3`). Do not commit it. `*.mp3` is gitignored.
- Mouth flap needs a committed amplitude JSON, not the audio file. Recipe at 30 fps (1600 samples at 48 kHz):

```bash
ffmpeg -i vo.mp3 -ac 1 -ar 48000 -f s16le -
```

RMS per 1600 samples, normalize to 0..1, save JSON next to the scene (the demo file is `src/amplitude.json` for `public/narration.mp3`). Feed that array to `mouthAt(amp, frame, startFrame)`.

## Folder conventions

What exists now:

```
src/index.ts             registerRoot
src/Root.tsx             Short, Long, Rig2DDemo
src/Demo.tsx             sample timeline (idle → wave → walk → point)
src/amplitude.json       per-frame RMS for the demo voice line
src/rig/Character.tsx    <Character pose costume x y scale rightHand showPivots />
src/rig/types.ts         Pose, Costume, ZERO, mixPose
src/rig/presets.ts       idle, walk, wave, point
src/rig/drivers.ts       blinkAt, mouthAt
public/narration.mp3     demo voice line, present locally, gitignored
```

`Character` props: `pose`, `costume` (partial override of skin, shirt, shirtAccent, pants, shoes, hair, cheek, outline), `x`, `y`, `scale`, `rightHand` (`"open"` | `"point"`), `showPivots`.

Add new work in these places. Create the folder when the first file needs it:

| Path | Put here |
| --- | --- |
| `src/rig/` | Shared skeletons. One component per body type (human already). A dog or cat that cannot use the human joints gets `src/rig/Dog.tsx` or `src/rig/Cat.tsx`, once. |
| `src/rig/poses/` | One pose module per file once `presets.ts` is crowded. Re-export from `src/rig/presets.ts` so scenes still import `{ presets }`. |
| `src/rig/costumes.ts` | Named channel costumes (`kid-mint`, `kid-peach`, …) as `Costume` objects. Add this file with the second outfit. |
| `src/assets/backgrounds/` | One background component per location (`park-day`, `kitchen`, …). |
| `src/assets/props/` | One prop component per object (`banknote`, `bowl`, `sofa`, …). The sofa exposes a seat height. See [Known visual issues](#known-visual-issues). |
| `src/assets/overlays/` | Planned shared screen graphics: `RuleCard.tsx` (`rule-card`), `PhoneChat.tsx` (`phone-chat`). Not in the repo yet. See [Planned reusable overlay components](#planned-reusable-overlay-components). |
| `src/scenes/` | Thin scene components, or the renderer that reads scene JSON. No pasted art. |
| `scripts/` | JSON timelines, one file per short or chapter. Helpers that call TTS stay here and read secrets from the environment. |

`Pose` fields (degrees unless noted): `bodyY` (px), `torso`, `breath` (0..1), `head`, `lShoulder`, `lElbow`, `lWrist`, `rShoulder`, `rElbow`, `rWrist`, `lHip`, `lKnee`, `rHip`, `rKnee`, `lFootLift`, `rFootLift`, `lLegUp`, `rLegUp` (px), `mouth` (0..1), `blink` (0 open .. 1 closed). Blend with `mixPose(a, b, t)`.

## How to add assets

Extend the library. A new video references an existing id. If the id is missing, add it once in the library, then reference it. Do not duplicate a pose function, an SVG, or a costume into a scene file.

### New pose

1. Add `(frame, fps) => Pose` in `src/rig/presets.ts`, or in `src/rig/poses/<name>.ts` that re-exports through `presets`.
2. Start from `idle(frame, fps)` or `ZERO`. Override only the joints that change.
3. Keep pendulum lag on the limb that is moving (see `wave`: the wrist uses a later phase than the elbow).
4. Register the function on the `presets` object. `PresetName` updates from that object.
5. Call it from a timeline as a name (`"wave"`). A cross-fade of about 12 frames via `mixPose` matches the demo.
6. Preview with `showPivots` on, then render a few frames of `Short` and `Long`.

### New character

A costume is not a new skeleton. Add a named `Costume` (proposed file `src/rig/costumes.ts`) and pass it as `costume={costumes["kid-mint"]}`.

```tsx
const pose = {
  ...presets.wave(frame, fps),
  blink: blinkAt(frame, fps),
  mouth: mouthAt(amp, frame, 12),
};
<Character pose={pose} costume={costumes["kid-mint"]} x={540} y={1180} scale={1.65} />
```

Add `src/rig/Dog.tsx` or `src/rig/Cat.tsx` only when the body cannot share the human joint map. That file becomes the only dog or the only cat. Later videos import it. They do not draw a second dog.

### New background or prop

Add `src/assets/backgrounds/ParkDay.tsx` or `src/assets/props/Banknote.tsx`. Export one component, named for the id the JSON will use (`park-day`, `banknote`). Scenes import that module. Copying paths into `Demo.tsx` or a chapter file creates a second source of truth. Do not do that.

The pastel sky, sun, clouds, and ground currently live inline in `src/Demo.tsx`. The next background should extract that staging into `src/assets/backgrounds/` instead of growing another copy inside a scene.

## Planned reusable overlay components

These two overlays are not in the repo yet. Build each one once, under `src/assets/overlays/`, and select it from scene JSON by id. A chapter does not redraw the card or the phone. Both use Noto Sans Thai. Both are the same component in `Short` and `Long`.

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
| `badge` | `string` (optional) | Mark inside the header circle |

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

## Known visual issues

These show up in channel pictures. Fix them in the shared rig or prop, once that asset is in the repo. A scene does not get its own private workaround.

(a) **Cat walking right to left looks like it walks backwards.** Facing comes from the move: `to.x < from.x` faces left, `to.x > from.x` faces right. The walk cycle has to travel in that same direction. Mirroring the body and leaving the cycle unflipped is the backwards walk. One rule on the cat rig, used by every scene.

(b) **Sitting on the sofa leaves the hips floating.** The sofa prop exposes a seat height (the cushion surface, in scene pixels). The sit pose puts the hip origin on that height. If the sofa moves or scales, the sitter stays on the cushion. Scenes do not hand-nudge `bodyY` to fake contact.

(c) **The footer label `LITTLE WANDER` is hard-coded English.** The channel name is a scene field, or the footer is hidden. It must not cover subtitles. Subtitles own the bottom band. A channel name, when it is shown, sits clear of that band.

## Workflow

Tasks are GitHub issues on `GuyMangkorn/reels-studio`.

- Label the issue `owner:codex` or `owner:grokbot`. One owner per issue.
- One branch per issue, from `main`. Name it after the issue: `codex/12-walk-cycle`, or `grokbot/<issue>-<slug>`.
- Keep the PR small: one pose, one background, one scene, or one bugfix.
- Before the PR, run `npm run typecheck` and a few-frame render of each composition you touched:

```bash
npx remotion render src/index.ts Short out/short-check.mp4 --frames=0-5
npx remotion render src/index.ts Long out/long-check.mp4 --frames=0-5
```

- Do not commit `out/`, mp4, or mp3. Do commit amplitude JSON and library code.
- Never push directly to `main`. Landing a task is the pull request in [Finishing a task](#finishing-a-task).

## Finishing a task

When a coding agent (Codex) finishes a task, it commits, pushes, and opens a pull request. It does not push to `main`.

1. Commit on a branch named after the issue, for example `codex/12-walk-cycle`.
2. Push that branch.
3. Open a pull request into `main`. The description must include all of the following:
   - The issue reference `Closes #N` (for example `Closes #12`).
   - A summary of the change.
   - The new or changed reusable assets (poses, characters, animals, backgrounds, props, scenes). Write "none" when the change does not add or edit library assets.
   - How it was verified: `npm run typecheck`, and the test render (which composition, which frames).

A `grokbot/` branch uses the same close-out. The base branch is always `main`.

## Secrets, brands, licenses

- Never commit secrets or API keys. That includes `.env`, Google TTS credentials, service-account JSON, and tokens. Scripts read them from the environment.
- No real brand logos, no trademarked characters, no copied network bugs. The channel's people and animals are original.
- Only commercially licensed assets. Prefer art written in this repo. If you import a font, sound, or SVG, the license must allow commercial YouTube use. Note the license beside the file (a one-line `LICENSE` comment or a sibling `NOTICE`). Noto Sans Thai and Sarabun are both OFL and are the approved subtitle faces.
