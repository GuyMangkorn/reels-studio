# Production Requirements

**Status:** Authoritative production requirements unless a passage is explicitly labeled as a default, reference or proposed capability. Applies across editorial, planning, implementation and review. English is the documentation language; viewer-facing content stays Thai.

**Style profiles:** the visual-direction, lighting, rig, label, TTS and ending rules below are the **`channel-default` style profile** ([delivery workflow](delivery-workflow.md#style-profile)). A deliverable with another profile (footage, typography, comedy, ad, etc.) overrides them with a recorded reason; rules on safety, licenses, Thai readability, determinism and the hook/duration targets still apply.

For medium flexibility, demo lighting, texture lifecycle, lead size, shot movement and visual QA, use the authoritative [Boss production rules](boss-asset-workflow.md#latest-production-rules). For sequence assembly and boundaries, read [sequence-workflow.md](sequence-workflow.md).

## Visual direction and motion

Use original stylized artwork, readable silhouettes, simple forms and a consistent channel palette. Characters and animals come from the painted kit (`src/painted/kit`): watercolour fills with boiling ink lines in a darkened shade of the fill, per the [painted-2d skill](../.claude/skills/painted-2d/SKILL.md). Character representation follows Film's brief; preserve identity and appearance when switching medium. Keep the chosen 2D/3D/hybrid assets visually consistent through shape language, materials, lighting and color. The brief and scene handoff determine daylight, dusk, night, moonlight, shadows and atmosphere; bright daytime pastel lighting is not mandatory for every shot. Three.js and Blender 3D are inactive ([visual engine](delivery-workflow.md#visual-engine)); 3D and hybrid rules below apply only if the user reactivates them.

**Reference palette:** The existing colors guide asset continuity; the brief determines the shot lighting and grade:

| Role | Hex |
| --- | --- |
| Skin | `#FFD9B8` |
| Shirt / accent | `#FF8FA3` / `#FFF3B0` |
| Pants | `#7ED6B2` |
| Shoes | `#FF9F5A` |
| Hair | `#6B4A3A` |
| Cheek | `#FFADAD` |
| Outline | `#4A3B3B` |
| Sky | `#FFF1C9` → `#FFE0E6` |
| Sun / ground | `#FFD166` / `#B8F2C9` |

- Pose and move characters with the kit: poses from the [pose sheet P01–P45](character-proportion-principles.md#cp-p-pose-sheet) (`poseArms`), motions from `MOTIONS` via `layerMotion`, faces from `EXPRESSIONS` with the kit blink, animals with `animalMotion`. Every pose and motion is a pure function of shot time, so random seeking and interrupted transitions reproduce the same frame.
- Derive animation, cameras, lighting, flicker and particles from Remotion frame/fps and seeded deterministic functions. Render seeking and parallel workers must reproduce the same frame.
- Preserve depth ordering, ground shadows and floor/seat contact across camera motion.
- Wait for textures, models and fonts through Remotion's render-loading lifecycle. Release GPU resources in shared components.
- Keep Thai subtitles, cards and channel labels in screen space unless the scene handoff explicitly places an element in the world. Camera movement must keep the subtitle band readable.


## Adding reusable assets

For a person, outfit, expression, pose, motion or animal, add it to the painted kit (`src/painted/kit`: `PEOPLE`, `WARDROBE`, `EXPRESSIONS`, `POSES`, `MOTIONS`, `ANIMALS`) with its info entry, kit-sheet row and context-map entry ([kit README](../src/painted/kit/README.md)). Start from the nearest existing entry; a new pose joins the [pose sheet](character-proportion-principles.md#cp-p-pose-sheet).

Cast characters from the painted kit per Film's brief. Reuse shared character assets across scenes. For a variant of an existing character, reuse its body type and expose appearance parameters or named costumes. Confirm the exported kit API before writing an example. Dogs and cats come from `ANIMALS` (`src/painted/kit/animals.ts`); the legacy `src/rig` Cat and Dog are retired.

If the user reactivates a 3D engine: for 3D sets, characters or props, implement shared modules and register them with the scene pipeline. Follow Film's composition strategy for hybrid work: specify spaces, camera, depth/alpha, lighting, anchors and resource ownership. Compose from reusable geometry, materials and lighting. Expose parameters for time of day, reveal state or set dressing when the scene handoff needs them. Define dimensions and floor/seat/grip anchors so actors stay in contact as assets move or scale. DOM overlays do not automatically share WebGL depth or lighting.

For a 2D background or prop, extend its shared registry and validator. For an overlay, implement the shared screen component and scene dispatch. A chapter references library ids and timing rather than copying SVG, geometry, pose functions or layout code.


## Outputs and story timing

Resolve the requested deliverables through [delivery workflow](delivery-workflow.md) before writing. Each selected editorial version has its own script, scene sheets, timeline, narration and subtitle timing, using shared scene components and assets at 30 fps:

| Composition | Size | Use |
| --- | --- | --- |
| `Short` | 1080×1920 | YouTube Shorts / Reels |
| `Long` | 1920×1080 | Long-form |

Short and Long may have different scene order, beat timing and spoken wording. Adapt framing, camera aspect/FOV and safe regions to each selected version's own scene handoff while keeping character proportions and 3D geometry intact. An explicitly requested alternate framing of the same edit preserves that edit's action/timing; it does not supply the other editorial version. In production guides, “both formats” checks apply when both are selected or an affected shared consumer needs regression coverage; a single-format request does not create another deliverable.

**Duration defaults:** A standalone Short targets **40–60 seconds**, and may run **60–90 seconds** when the story needs the length and the script stays interesting all the way through (user, 16 Nov 2026): Preaw records the reason in the script header and the delivery record names the longer target, which the user approves with the script; a normal YouTube Long targets **9–10 minutes (540–600 seconds)**. These are full-video durations including closing holds and ending behavior, not targets for each scene. Long chapters follow the story; no fixed chapter duration or automatic chapter-to-Short split is required. Explicit user durations override these defaults with a recorded reason. Keep timing `estimated` until a spoken read or audio/animatic check supports it; verify the final executable/rendered duration before release. Do not pad silence, repeat material or speed up narration merely to reach the range. **Hook requirement:** Each publishable chapter/Short opens with a hook in the first 2 seconds (60 frames), without an intro/logo/subscribe card. A 20-second scene handoff fragment or shorter asset demo is valid development material; its length is not a new production requirement.

Subtitles are visible from frame 0. Hold the closing line, moral when appropriate, or intended final beat for about 3 seconds. Deliver two endings through the shared ending behavior: `_A_fade` holds then fades; `_B_loop` holds and uses the shared loop seam. Check the last-to-first transition against the intended scene handoff. **Seamless loop (optional third ending, Reels/Shorts):** `_C_seamless` for platforms that replay automatically. It has no closing hold or fade; the last `loopBlendFrames` (default 15) crossfade into a frozen copy of frame 0, so the last frame equals the first. It replaces the 3-second hold requirement for that output only; the closing beat must land before the blend window (see [loop-friendly writing](scriptwriting-principles.md#loop-friendly-writing)). Choose it when the deliverable's style profile asks for a loop; A/B stay the default pair. Store MP4s in `out/`, for example `scene-a_A_fade.mp4` and `scene-a_B_loop.mp4`.


## Thai subtitles, narration and channel label

- Use large Thai subtitles in the lower part of the frame, white with a dark stroke, in Noto Sans Thai or Sarabun. Keep glyphs above platform controls and within the safe region in both formats. Use Thai from the first frame, without a duplicate English subtitle over it.

<a id="caption-look"></a>
**Default — caption look (user, 6 Nov 2026):** every deliverable of every project uses the education-clip look (EDU-EP02/EP03): white Noto Sans Thai 700 with a heavy warm-black stroke and a soft dark halo, `CAPTION_OUTLINE` in `src/scenes/media.ts` (14 px `#2b1a12`, halo `0 0 16px rgba(34,18,10,0.92), 0 0 5px rgba(34,18,10,0.9), 0 4px 0 #2b1a12`), which the `outline` preset applies when `strokeWidth`, `strokeColor` and `textShadow` are unset. No backdrop: a shade band, scrim or box behind the captions is used only when the brief records a reason (for example a frame check where the stroke alone does not read), and then follows the [caption backdrop](#caption-backdrop) rule. Replaces the 7 px `#3d3c53` stroke; an existing episode re-rendered after this date takes the new stroke unless its timeline sets its own; existing episodes keep their own backdrops (WFOG scrim plates, KSO `BandShade`) and are not changed for this rule (user, 6 Nov 2026).

<a id="vertical-caption-safe-zone"></a>
**Requirement — vertical caption safe zone (Reels/Shorts/TikTok, 1080×1920).** Every caption line, including tone marks and stroke, sits inside the **caption-safe box**: x 120–888 px (clear of the right-side like/comment/share rail), bottom edge at or above **y 1344 px** (≥ 576 px, 30 % of the height, above the bottom) for organic uploads whose title/description fits one line, top edge at or below **y 140 px** (best case: clear of the phone status bar and Dynamic Island only, for a viewer just watching; user, 2026-11-03, was y 288). Ads, boosted posts or a long description keep the bottom edge at or above **y 1248 px** (≥ 672 px, 35 %); Reels ads with a disclaimer y 1152 (40 %). Lower than y 1344 (down to y 1440) is a per-deliverable override recorded with a real-device screenshot of the upload on each target platform (user, 2026-11-03; was y 1248 for all). Place the default caption block with its **bottom edge near y 1250–1344 px** (the lower-middle band), growing upward for a second line. The bottom 30–35 % carries the platform's title, description, account name and audio row; the right column carries the action buttons; the top ~15 % carries the header. Keep eyebrows, numbers and key on-screen text inside the same box (the channel label is the exception below); picture may fill the whole frame.

- **Why:** uploaded Reels had subtitles at 134 px above the bottom, hidden under the clip title and description (user feedback 2026-10-28).
- **Framing consequence (Film):** the caption band now crosses the lower-middle of the frame. Stage the lead subject, faces and the reveal object above or beside the band, and record the band in each portrait scene handoff.
- **Check:** render the first frame and the longest two-line cue of each Short, overlay the box (x 120–888, y 140–1344; y 140–1248 for ads) and record that no glyph crosses it. `python3 -I scripts/caption-zone.py --overlay-dir <dir> <frames>` draws the box and the caption band and measures the band's background brightness. Recheck with a real upload preview when a platform changes its UI.
- **Evidence and limits:** Google's vertical video ad diagram for Shorts gives margins top 288 / bottom 672 / left 48 / right 192 px ([Google Ads](https://support.google.com/google-ads/answer/9128498?hl=en), ads); Meta's Ads Guide keeps the top 14 % and bottom 35 % clear with 6 % sides ([Meta Reels ads guide](https://www.facebook.com/business/ads-guide/update/video/instagram-reels), ads); TikTok's own templates were not read, third-party figures give about 240 / 660 px with a right button column. All published figures are for ads, which add a CTA and ad label; no platform publishes an organic figure, so the organic y 1344 is a project default from third-party estimates (bottom UI about 300–420 px). Platform UIs change; detail and the device-aspect notes are in [research: vertical safe areas](research/vertical-safe-areas.md).
- **Top items:** nothing but picture (and the channel mark) sits above y 140: the iPhone status bar ends about y 133 and the Dynamic Island about y 108 in video pixels (iPhone 15 Pro geometry, video filling the screen height; estimate, not a device screenshot). This is the best case: the app's own header row (Shorts search/camera icons, TikTok Following/For You tabs and LIVE icon, about y 200–250) may cover text between y 140 and y 288 while those controls show; the user accepts that (2026-11-03). Ads keep the platforms' published top 288 px. Filling the height also crops about 97 px off each side on 19.5:9 phones, inside the x 120 margin.
- **Scope:** applies to portrait deliverables started on or after 2026-10-28. Existing episodes keep their captions and are not re-rendered for this rule (user decision 2026-10-28).
- **Runtime status (2026-10-28, `main` 1dfe58f):** the shared portrait `position: 'bottom'` default in `src/scenes/Subtitles.tsx` (`bottom: 134` px) stays unchanged for existing episodes and violates this box. A new portrait deliverable sets `captionStyle.position: 'middle'` (centred at y 960, inside the box) in its `src/videos/<episode>/index.ts`, and records the frame check.
<a id="caption-backdrop"></a>
**Requirement — caption backdrop (user, 4 Nov 2026).** A semi-opaque overlay behind the captions (shade band, scrim plate, box) is sized and placed by the caption on screen, not by a fixed band:

- **Centred on the glyphs:** the overlay's vertical centre is the centre of the caption's ink (top of the upper vowels and tone marks to the baseline), within 6 px. The CSS line box is not the ink: Noto Sans Thai at line-height 1.65 leaves about 28 px below the baseline and less above, so an overlay centred on the line box or anchored to the block's bottom edge sits low.
- **Height follows the lines:** a one-line cue gets a one-line overlay, a two-line cue a two-line overlay (core = ink plus a margin, then a feather). No minimum two-line height: a one-line caption in a two-line band leaves the text off-centre, darkens about 85 px more of the picture than it needs and reads as an empty bar.
- **No pop between cues:** when back-to-back cues change line count while the overlay stays up, the height eases over 4 frames; the overlay fades in and out with the cues as before (shade gate, 4 f ramp, 6 f tail).
- **Lowest opacity that reads (user, 4 Nov 2026):** the overlay's peak opacity is the lowest value at which the caption is still clearly legible on the brightest background it crosses in that video, judged on a frame check at phone size (about 360 px wide) and not on the first value that looks safe. Try steps downward (for example 0.62, 0.5, 0.4, 0.3), keep the lowest that passes and record the value and the frame it was judged on in the delivery record. A darker overlay than needed dulls the picture the story was painted for. The `CaptionShade` defaults (0.62 band, 0.5 soft) are starting points, not a finding.
- **Check:** in the caption frame check, measure the ink rows and the overlay core rows on a one-line and a two-line cue and record both centres.
- **Runtime status (4 Nov 2026, this branch):** `existing-integrated` in `CaptionShade` (`src/painted/kit/screen.tsx`: `captionInk`, `shadeLines`; cue `[from, to, lines]`), checked on `ZCPAINT-SET-CAPTION-BACKDROP` (core centre 2.5 px from the ink centre for 1 and 2 lines, ease f30–34). WFOG-EP01 scrim plates already fit the line count and sit about 6 px low; KSO-EP01 `BandShade` is a fixed lamp-falloff step. Existing episodes are not re-rendered for this rule; the `box` preset in `src/scenes/Subtitles.tsx` is unused and unmeasured.

- Narration uses **Gemini TTS** by default ([project defaults](delivery-workflow.md#project-defaults): narrator Sulafat or Orus, user decision 30 Oct 2026). With Edge TTS, the male voice is **Niwat** (`th-TH-NiwatNeural`) and its **Default** rate is **+5%** (`speakingRate: 1.05`); the brief or delivery record may set another rate per deliverable, scene or line to suit the moment (e.g. slower for a reveal, faster for a list), with the reason recorded. The female Edge TTS voice is **Premwadee** (`th-TH-PremwadeeNeural`, `--voice th-TH-PremwadeeNeural`), used when the delivery record names it (first used in SHIPWRECK-SHORT). `scripts/narration.py` generates local audio for the existing demo; inspect its inputs when authoring a new episode.
- Commit the final narration MP3 `public/narration/<CompositionId>.mp3` and its amplitude JSON (changed 31 Oct 2026: a Gemini TTS read is not reproducible, so the approved track is the source; intermediate WAVs, takes and backups are filed into the [asset store](../README.md#asset-store) with `store.py archive --path`; see [re-editing](../README.md#re-editing)). Other MP3s stay gitignored. At 30 fps, decode mono 48 kHz audio and compute RMS per 1600 samples, normalized to 0..1. The demo uses `src/amplitude.json`; per-video narration uses `public/narration/<CompositionId>.mp3` with `<CompositionId>.amplitude.json` beside its timeline ([README](../README.md#videos-and-parallel-work)).
- Audio and its amplitude envelope use the composition clock across scene cuts. Pose and camera motion use the shot-local clock.
- **Default — channel mark on every deliverable:** every deliverable of every project shows its channel's mark, **`@TamMaiLa`** for `edu` (`CHANNEL_MARKS` in `src/videos/types.ts`, set by the episode's `channel`; `defaultChrome` in `src/scenes/media.ts` is the `edu` mark, 22 px) without the brief asking for it (user, 3 Nov 2026; replaced `ทำไมล่ะ`). Turn it off (`channelLabel: false`) only for internal compositions (kit sheets, look frames, proofs) or with a recorded user reason. Keep the label clear of the subtitle band. In portrait it sits top-left at **x 120, glyph top about y 135** (span `top: 128`, 22 px), just below the Dynamic Island in every display mode of [the research](research/vertical-safe-areas.md#2-device-aspect-taller-phones-notch-dynamic-island) (island bottom about y 108 filling the height, y 132 fitting the width) and inside the side crop of tall phones: at x 60, y 60 the Dynamic Island and status bar covered it on released clips (user, 2026-11-03: clear the island only; was x 60, y 60 from 2026-10-30, and at the bottom the platform's title and account rows covered it). The app's header icons may still cover it while they show. A high caption band must clear it by about 40 px. The progress bar is off by default for the same reason.


## Shared visual correctness

Fix contact, facing and layout in the owning rig, prop or stage so every scene benefits:

- Cat/dog facing follows travel direction, and the walk cycle travels with that facing. Explicit facing overrides remain supported.
- A sofa exposes its cushion surface. Sitting places the hip on that surface through the shared pose transition; scene-specific body nudges are not the contact model.
- In 3D, verify near/far clipping, transparent cut-out ordering, foreground occlusion, shadow/floor contact and framing at the start, middle and end of the camera move.
- The channel footer and all overlays stay clear of Thai subtitles in both formats.


## Secrets, brands and licenses

- Keep secrets, tokens, `.env` files and service-account credentials outside commits. Helpers read secrets from the environment.
- Use original channel characters and artwork. No real brand logos, trademarked characters or copied network bugs.
- Imported fonts, models, textures, sounds and other assets need a license allowing commercial YouTube use. Record it beside the asset in a `NOTICE` or license comment. Noto Sans Thai and Sarabun use OFL and are approved subtitle fonts.
