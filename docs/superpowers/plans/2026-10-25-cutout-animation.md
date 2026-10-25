# Cut-out animation implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement task by task.

**Goal:** A reusable SVG animation toolkit and two 20-second demo exports.
**Architecture:** Nested SVG joint groups, pure frame-based pose sampling, layered procedural scenery, and a typed JSON timeline shared across aspect ratios.
**Tech Stack:** React, TypeScript, Remotion.
**Spec:** User request in this chat.

## Global constraints
Flat pastel vector shapes. Thai subtitles. Short 1080x1920 and Long 1920x1080 at 30fps. Five scenes, 20 seconds, no audio.

## Review focus
- Seeking directly to a frame must produce the same pose as playback.
- Pose transitions must work without React state or effects.
- Entering animals may begin outside the canvas, but settled actors must fit both layouts.
- Thai glyphs must use a bundled font and avoid subtitle clipping.
- JSON errors must report useful validation failures.

### Task 1: Rig and assets
- [x] Scaffold dependencies and Studio entry.
- [x] Implement pose sampling, nested Character joints, Cat/Dog and props.
- [x] Check TypeScript and pure pose endpoint/loop tests.

### Task 2: Scenes and layout
- [x] Implement five three-layer backgrounds with day/night palettes.
- [x] Implement validated JSON scene renderer, adaptive layout, local Thai subtitles.
- [x] Add five-scene demo JSON and both compositions.
- [x] Check timeline totals, invalid input, deterministic transitions, and aspect layouts.

### Task 3: Verification and delivery
- [x] Inspect representative rendered frames in both formats.
- [x] Render both MP4s and verify metadata.
- [x] Document extension points, API and file map.


## Completion record
- TypeScript passes; 10 animation/timeline tests pass.
- Inspected all five scenes in both formats; portrait animal staging corrected.
- Independent final code review found interrupted-transition jumps and missing live name-change easing. Both fixed, with regression tests and a deterministic Character-level pose track.
- ffprobe confirms each final H.264 MP4 has 600 frames, 30/1 fps, 20.000 seconds. Short is 1080x1920; Long is 1920x1080. Neither has an audio stream.
- npm install/audit reports zero vulnerabilities after a transitive Zod patch override.
- Render-authored pose changes carry explicit tracks for reproducible random-access rendering; live string edits use local change tracking. This distinction is documented in README.
- No deferred review findings. No commits or remote publication performed.
