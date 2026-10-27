<a id="หลัก-cinema-สำหรับ-film-และ-mark"></a>
# Cinematography principles for Film and Mark

Sources checked on 26 October 2026. Film uses this reference for visual briefs; Mark develops the boards. These are decision tools for the channel's stylized work, not a formula requiring the same lens, palette, shot count or technique in every scene. Roles and workflow: [film-visual-brief-workflow.md](film-visual-brief-workflow.md).

<a id="หลักฐานต้นทาง"></a>
## Primary-source evidence

| Inspected source | What it supports |
| --- | --- |
| [Pixar / Museum of Science — Sets and Cameras](https://sciencebehindpixar.org/pipeline/sets-and-cameras) | Composition, camera movement and lenses serve story and feeling |
| [Pixar / Museum of Science — Story and Art](https://sciencebehindpixar.org/pipeline/story-and-art) | Boards use key moments; colorscripts explore palette/lighting |
| [Pixar / Museum of Science — Lighting](https://sciencebehindpixar.org/pipeline/lighting) | Lighting guides attention, mood and visual hierarchy |
| [Animation Mentor — Staging](https://www.animationmentor.com/blog/staging-the-12-basic-principles-of-animation/) | Staging, lines of focus, foreground and screen direction make meaning legible |
| [Alfred Hitchcock — My own methods / BFI](https://www.bfi.org.uk/sight-and-sound/features/alfred-hitchcock-my-own-methods) | Advance planning, audience knowledge and cuts between details/reactions create meaning and suspense |

<a id="คำสั่งประยุกต์สำหรับงานนี้"></a>
## Application to this project

This section synthesizes the sources with channel requirements. It does not attribute each instruction to one source or claim universal rules.

1. **Begin with a story change:** each scene brief states how audience understanding or feeling changes. Camera, light and medium serve it. Preserve clues/reveals and factual qualifications; a reconstruction must not implicitly become real evidence.
2. **Make the focal point immediately legible:** choose one per beat. Use silhouette, contrast, gaze and negative space to guide attention. Foreground can establish depth or conceal information while preserving essential action and subtitles. Test thumbnails and values before adding detail.
3. **Change shot size for information:** wide for essential spatial relationships, medium for gestures/interactions, close-up/insert for meaning-changing details or reactions. These are reasons to choose a shot, not a mandatory repeating order. Leave time to read clues.
4. **Motivate angle and movement:** specify viewer, camera height/target and what movement reveals. Distinguish pan/crop/picture push from spatial camera movement that changes parallax. Small movement may preserve emotional stillness while meeting channel motion requirements; solve unclear staging directly.
5. **Preserve geography:** specify screen direction, eyelines, entrances/exits and action axis. Bridge or justify axis crossings/direction changes so viewers can follow. Record intentional disorientation and check continuity across scenes.
6. **Build suspense with information:** state audience knowledge, character knowledge, expectation and what must remain hidden. Place empty holds, offscreen sound, reactions and reveals according to the script. Use POV when the beat needs it, within channel frequency defaults linked from AGENTS.md. Darkness alone does not establish suspense.
7. **Give lighting a cause and purpose:** identify motivated sources, direction, softness, warm/cool balance and value hierarchy. Use rim/fill for readable silhouettes; shadow/occlusion for depth and reveals. Keep gestures/subtitles legible. Use colorscripts/value keys for continuity, separating desired look from untested renderer settings.
8. **Cut when action or meaning changes:** include preparation → action → result where needed for readability. Allow reactions and processing time. Place sound before/after visuals intentionally. Listen to narration or watch an animatic before claiming successful timing.
9. **Compose for both aspect ratios:** preserve beat and timing while adapting staging, camera aspect/FOV and crop so focal point/contact/reveal remain visible. Plan the Short framing explicitly and reserve subtitle space in the brief.
10. **Choose a technique that can make the image:** any element may be 2D, 3D or hybrid. Choose for needed views, occlusion, acting, light/shadow, reuse and integration risk. If a cut-out needs unseen sides, propose more views/poses or 3D rather than expecting billboarding to supply missing art. Use Film's technical handoff workflow.

<a id="ขอบเขตทางเทคนิคของกล้อง"></a>
## Technical camera boundaries

Use the shared [scale and perspective principles](scale-and-perspective-principles.md) for physical scale, projection, horizon/foreshortening, parallax and dolly versus zoom. Supply the scale baseline before choosing framing.

Three.js `PerspectiveCamera` specifies vertical FOV, aspect and near/far clipping. A brief's “35mm lens” is not a complete runtime setting: define mapping/film gauge and test framing. Setting `focus` alone does not add depth of field to a normal render. Specify a DOF pass/implementation and separately test its cost if required.

Source: [Three.js — PerspectiveCamera](https://threejs.org/docs/pages/PerspectiveCamera.html). Separate camera intent from the installed API parameters Boss verifies. Label unmeasured physical values and benchmarks honestly.
