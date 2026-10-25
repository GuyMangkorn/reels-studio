# reels-studio

Thai YouTube studio for Shorts and long-form videos, rendered with Remotion. Scenes reuse one asset library — a flat pastel 2D cut-out rig — so a new video is a timeline on top of characters, animals, poses, backgrounds, and props that the channel already uses.

The same scene renders twice at 30 fps:

- **Short** — 1080×1920
- **Long** — 1920×1080

Long-form episodes run 8–10 minutes, cut into 45–60 second chapters. Each chapter opens with its own hook so it can also be posted as a Short. Agents working in this repo should read [AGENTS.md](AGENTS.md) first.

## Setup

```bash
npm i
```

The demo voice line is `public/narration.mp3`. Audio files are gitignored, so copy that mp3 in locally before a render that plays narration. Mouth flap reads the committed levels in `src/amplitude.json`.

## Preview

```bash
npx remotion studio
```

## Render

Short (1080×1920):

```bash
npx remotion render src/index.ts Short out/short.mp4
```

Long (1920×1080):

```bash
npx remotion render src/index.ts Long out/long.mp4
```

`Rig2DDemo` is the original portrait composition, same size and scene as `Short`:

```bash
npx remotion render src/index.ts Rig2DDemo out/rig2d-demo.mp4
```

Check a few frames before opening a PR:

```bash
npm run typecheck
npx remotion render src/index.ts Short out/short-check.mp4 --frames=0-5
npx remotion render src/index.ts Long out/long-check.mp4 --frames=0-5
```

`out/`, `*.mp4`, and `*.mp3` are gitignored.

## Folder map

```
src/index.ts                 Remotion entry (registerRoot)
src/Root.tsx                 Short, Long, Rig2DDemo
src/Demo.tsx                 Sample timeline
src/amplitude.json           Per-frame voice levels for the demo line
src/rig/Character.tsx        Cut-out character
src/rig/types.ts             Pose, Costume, mixPose
src/rig/presets.ts           idle, walk, wave, point
src/rig/drivers.ts           Blink and mouth flap
src/rig/poses/               New poses go here once presets.ts grows (not created yet)
src/assets/backgrounds/      Reused locations (not created yet)
src/assets/props/            Reused objects (not created yet)
src/scenes/                  Thin scenes that only reference the library (not created yet)
scripts/                     JSON timelines, one per short or chapter (not created yet)
public/                      Local media such as narration.mp3 (audio is gitignored)
```

## rig2d — reusable 2D cut-out character

The rig that ships with the repo:

- `src/rig/Character.tsx` — `<Character pose costume x y scale rightHand showPivots/>` (SVG, nested joints: shoulder>elbow>wrist, hip>knee>ankle, torso>neck>head)
- `src/rig/types.ts` — `Pose` type, `ZERO`, `mixPose(a,b,t)` for blending
- `src/rig/presets.ts` — `idle`, `walk` (march in place), `wave`, `point`: `(frame,fps)=>Pose`
- `src/rig/drivers.ts` — `blinkAt(frame,fps,seed)` irregular blinks; `mouthAt(amp,frame,start)` lip-flap
- `src/Demo.tsx` — example timeline with cross-fades; `src/amplitude.json` per-frame RMS of `public/narration.mp3`

Usage:

```tsx
const pose = { ...presets.wave(frame, fps), blink: blinkAt(frame, fps), mouth: mouthAt(amp, frame, 12) };
<svg viewBox="0 0 1080 1920"><Character pose={pose} x={540} y={1180} scale={1.65} costume={{ shirt: "#A0E7E5" }} /></svg>
```

Costume keys: skin, shirt, shirtAccent, pants, shoes, hair, cheek, outline.
Set `showPivots` to show red joint dots when you check a rig.

Amplitude for a new voice line (30 fps = 1600 samples at 48 kHz):
`ffmpeg -i vo.mp3 -ac 1 -ar 48000 -f s16le -` → RMS per 1600 samples → normalize 0..1 → json.

Narration for new lines uses the Niwat voice at +5% rate. Subtitles are large, bottom-aligned, white with a dark stroke, in Noto Sans Thai or Sarabun, from the first frame. Shorts end as two files, `_A_fade` and `_B_loop`, with the moral held for about 3 seconds.
