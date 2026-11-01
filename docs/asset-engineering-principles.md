<a id="2d--threejs-integration-before-storyboarding"></a>
# Boss: reusable 2D/3D asset engineering principles

Sources inspected on 26 October 2026. This is technical reference for Boss and Film's technical analysis, not evidence that the current runtime has been repaired. Read [Boss's workflow](boss-asset-workflow.md) for production requirements and [Film's workflow](film-visual-brief-workflow.md) for the handoff contract. Recommendations below explain tradeoffs; verify APIs and integration in the target checkout.

<a id="1-ข้อกำหนดผู้ใช้กับหลักทั่วไป"></a>
## 1. User requirements and general principles

Choose 2D, 3D or hybrid according to Film's brief, including characters and interaction props. The former background-only 3D and one-image/plane-per-prop restrictions were revoked. Demo lighting, the emissive/glow cap, character size and QA remain project requirements in [current production rules](boss-asset-workflow.md#latest-production-rules). This reference does not establish which techniques are integrated.

<a id="การผสาน-2d--threejs-ก่อนเขียนบอร์ด"></a>
## 2D / Three.js integration before shot planning

Film selects a strategy before detailing shots. DOM/SVG over WebGL suits screen overlays but does not automatically share world depth or Three.js lighting. When a 2D actor must move in front of and behind a 3D prop, choose a world-space cut-out adapter or an explicit mask/render-pass plan. Specify camera, coordinate conversion, anchors and compositing order for Boss. A convincing static SVG composite does not prove integration under camera motion.

For world-space cut-outs, specify fixed-plane or billboard behavior and the viewing angles the artwork supports. Turning a billboard toward the camera does not create unseen character sides and can change grip/seat alignment. Choose camera and lit/unlit materials together with contact/shadow behavior. Test candidate assets in both aspect-ratio blockouts before claiming that angles and lighting are preserved.

This is proposed project architecture. Context/rendering constraints come from [Remotion — ThreeCanvas](https://www.remotion.dev/docs/three-canvas) and [R3F — Hooks](https://r3f.docs.pmnd.rs/api/hooks). Distinguish APIs present in the checkout from a proposed adapter.

<a id="2-frame-determinism-และการ-seek"></a>
## 2. Frame determinism and seeking

Remotion directs `<ThreeCanvas>` animations to use declarative `useCurrentFrame()` rather than R3F `useFrame`, allowing pause and backward scrubbing. Calculate flicker, shake, image movement, poses and lighting from frame/fps and stable seeds. Avoid accumulated `delta`, wall-clock timing and fresh randomness on each render.

Recommended QA: compare the same frame reached through forward playback, backward seeking and reload. Identical output is the contract; never assume Remotion renders every frame in order.

Source: [Remotion — ThreeCanvas](https://www.remotion.dev/docs/three-canvas).

<a id="3-async-readiness-ต้องแยก-studio-กับ-render"></a>
## 3. Separate preview and render readiness

Remotion states that `delayRender()` pauses final rendering until async work finishes and `continueRender(handle)` is called, but does not affect previews such as Studio/Player. It recommends `useDelayRender()` and `cancelRender()` for unrecoverable errors. Provide suitable preview loading/error states and wait for asset readiness during rendering.

Recommendation: release rendering only after required images/fonts/data are ready and the canvas has drawn the content to capture. Starting a request or scheduling a content update is insufficient.

`ThreeCanvas` uses `frameloop='never'` during rendering. For a texture changed in an async callback, the documentation directs `advance()` to draw synchronously before capture rather than `invalidate()`, which schedules a later draw. Follow the actual lifecycle rather than adding an independent animation loop.

Sources: [Remotion — delayRender / continueRender](https://www.remotion.dev/docs/delay-render), [Remotion — ThreeCanvas](https://www.remotion.dev/docs/three-canvas).

<a id="4-static-texture-cache-และ-ownership"></a>
## 4. Static textures, caching and ownership

R3F `useLoader` suspends while loading and caches by URL, enabling component-tree reuse. Its documentation warns about mutating or disposing shared assets.

Recommendations for Boss:

- Use stable loader/cache keys for static images.
- Create procedural canvases/textures once per mounted scene/asset instance; keep `new CanvasTexture` outside paths repeated every frame.
- After redrawing an existing texture's canvas, set `texture.needsUpdate = true`.
- Dispose scene-owned resources when no longer needed. A consumer must not dispose a shared cached resource while other consumers still use it.
- “Once per scene” means lifecycle reuse, not a single object shared across render workers, tabs or remounts.

Sources: [R3F — Hooks / useLoader](https://r3f.docs.pmnd.rs/api/hooks), [Three.js — Canvas Textures](https://threejs.org/manual/pages/canvas-textures.html).

Caution: Three.js manual examples use `requestAnimationFrame` and randomness to teach canvas textures generally. Those loops are not Remotion's timing model.

<a id="5-transparency-และลำดับภาพ"></a>
## 5. Transparency and image ordering

Three.js explains that depth writing, which works well for opaque objects, complicates transparency. The engine sorts transparent objects but does not automatically resolve every triangle's order. Neither `transparent=true` nor `DoubleSide` alone guarantees correct alpha-cutout overlap.

Recommendation: avoid intersecting planes, establish stable depth/layer ordering, and choose alpha cutout or soft transparency based on the actual output. Inspect actors crossing props/window edges. Disabling depth testing for the whole scene is not a general remedy. Justify and visually verify `depthWrite=false`, `alphaTest` and `renderOrder` choices.

Source: [Three.js — Transparency](https://threejs.org/manual/pages/transparency.html).

<a id="6-สี-ความสว่าง-และการอ่านตัวละคร"></a>
## 6. Color, brightness and character readability

Three.js computes lighting in Linear-sRGB. Color textures from PNG/JPEG, such as `map` and `emissiveMap`, require `SRGBColorSpace`; non-color maps need their appropriate setting. Incorrect color space can make output too bright or dark; adjusting lights does not fix that cause.

Recommendation: check input color space, output conversion and tone mapping before tuning ambient/lantern/emissive values. Then follow project settings and inspect dark-background output. Intensity depends on materials and pipeline; neither `2.6` nor `0.3` guarantees the same appearance in every scene.

Source: [Three.js — Color Management](https://threejs.org/manual/pages/color-management.html).

<a id="7-contact-และเงา"></a>
## 7. Contact and shadows

Use [scale and perspective principles](scale-and-perspective-principles.md) for reference sizes, visible bounds, units, projection and foot/seat/grip relationships as depth changes. Separate library physical dimensions from camera-projected size.

The Three.js manual describes extra render costs for shadow maps and presents fake shadows that move with their objects as an alternative. Choose according to medium, appearance and render cost; a flat image does not cast the same shadow as a volumetric mesh.

For hybrid work, choose real shadows, fake shadow planes or shared 2D layers according to the composition strategy. Specify caster/receiver, material and coordinate space. Align foot/hip/hand anchors with the floor/seat/grip and verify shadow relationships under camera/object motion. A shadow alone does not repair an actor floating above a cushion.

Source: [Three.js — Shadows](https://threejs.org/manual/pages/shadows.html).

<a id="8-qa-ที่จำเป็นเพิ่มเติมจาก-contact-sheet-ทุกวินาที"></a>
## 8. QA beyond one-second contact sheets

The following recommendations synthesize sampling limitations and frame-driven rendering; they are not a Three.js checklist. Project QA requirements remain owned by Boss's workflow.

1. Render the user's one-second contact-sheet samples with scene, shot and frame IDs.
2. Add `F-1`, `F`, `F+1` around cuts, pose/prop-parent changes, attach/detach, reveals, flashes, movement starts/ends and texture entrances/exits.
3. Review continuous critical segments and random/backward seeking in Studio for pops, stale textures, layer-order errors and accumulated state.
4. Inspect projected actor size, subtitle bands, foot/seat/hand contact, shadows, rim readability and 2D-image movement in every affected Short/Long output.
5. Record actual coverage. A 1 Hz contact sheet samples every 30 frames at 30 fps and can miss a one-frame glitch; it cannot justify a claim of “no jumps.”

<a id="การอ่านตัวอย่างจากแหล่งอ้างอิง"></a>
## Reading source examples

Source examples may use generic real-time loops, 3D shadow planes or APIs newer than the checkout. Follow frame-driven Remotion, user requirements and installed branch types. None of these examples establishes that a repository asset or scene has passed QA.
