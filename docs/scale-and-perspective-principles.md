# Physical scale, dimensions and perspective for Film / Mark / Boss

Updated and sources inspected on 26 October 2026. Read when creating/resizing assets, staging depth, designing cameras or reviewing apparent size in 2D, 3D or hybrid work. Requirements and project-derived methods below are separate from the primary-source findings in section 7.

<a id="1-กฎผู้ใช้และเจ้าของงาน"></a>
## 1. User requirement and ownership

The user requires **believable relative dimensions for people, animals, objects and furniture first; camera angle and distance then determine their projected size**. Stylization is allowed while preserving identity and the chosen physical-size references. Implementation methods and QA below are project synthesis; primary-source evidence is listed separately.

| Owner | Required handoff |
| --- | --- |
| Film | Units/coordinate system, scale baseline, projection and camera approach; 2D/3D composition strategy, limitations and feasibility evidence in the visual brief |
| Mark | Shot detail using that baseline: relative positions/distances, ground plane, framing, contact, key panels and boundary states in the scene sheet |
| Boss | Dimensions/anchors and projection in shared owners, runtime-contract integration and Short/Long scale/contact/motion proof |

Film and Mark record approach changes in brief/board revisions; Boss returns observed limitations through [dev findings](dev-findings.md). Adding this guide does not repair an asset or establish any scene's runtime behavior.

<a id="2-ตั้งขนาดอ้างอิงก่อนจัดกล้อง"></a>
## 2. Establish reference dimensions before camera placement

Separate three quantities: **canonical physical size**, the asset's size in a reference pose; **world placement**, position/orientation and justified instance size; and **projected size**, pixels after camera/crop. Each stage must be traceable.

1. Choose shared units, such as meters or normalized units with an explicit conversion. Record origin, axes, handedness and floor plane. SVG pixels and Three.js units are not directly comparable.
2. Measure humans in a named reference standing pose. For animals, specify posture and measurement method, such as shoulder height and body length. Bending/sitting poses or moving tails do not redefine canonical height.
3. Use the body's/object's logical solid bounds. Exclude image canvas, transparent padding, glow and shadows. Equal image canvases can contain differently sized bodies.
4. Choose references appropriate to age/body type, species/breed and furniture type. Record image/drawing/measurement sources and `measured`, `estimated` or `design choice` status. Estimates are production baselines, not universal anthropometric statistics.
5. Compare relationships actually shown: hip–cushion, knee–table edge, hand–held object, person–door and animal–person. Preserve these dimensions and anchors in placeholders before detailing.
6. Normalize once in the library owner. Change instance size only for an intentionally different person/animal/object size, with reasons and continuity recorded. Avoid shot-specific resizing as an improvised perspective correction.

Keep the active baseline table with the library/sequence index and link scene sheets to it instead of maintaining copies:

| Asset ID / revision | Units + reference pose | Solid dimensions / bounds | Floor / seat / grip anchors + space | Reference / status | Consumers / exceptions |
| --- | --- | --- | --- | --- | --- |
| `<id>` | `<unit; pose>` | `<height/width/depth or measurement type>` | `<named anchors>` | `<path/URL; measured/estimated/design>` | `<shots; intentional stylization>` |

<a id="3-กล้องเป็นผู้กำหนดขนาดบนภาพ"></a>
## 3. Let the camera determine projected size

<a id="perspective-และ-orthographic"></a>
### Perspective and orthographic projection

Perspective combines physical dimensions, placement, orientation and camera. An object of unchanged size/orientation becomes smaller as its depth along the viewing direction increases under the same projection. Orthographic projection preserves projected size as the object moves along the viewing direction under the same camera. Film may choose orthographic for that appearance with a recorded reason. [S1–S2]

**The divisor is camera-space depth**, not merely straight-line camera distance. Define `d > 0` in the forward direction; under Three.js's local `-Z` viewing convention, `d = -zCamera`. Moving sideways at the same depth does not shrink the object according to radial distance.

This approximate check follows pinhole geometry. It applies to height parallel to image vertical on a frontoparallel plane, with top and bottom at the same depth:

```text
Hpx ≈ Hworld × viewportHeight / (2 × d × tan(vFOV / 2))
```

Use effective `vFOV` after camera zoom in radians, the viewport before picture crop/scale, square pixels and a centered perspective frustum. Points must lie in front of the camera and inside usable clipping bounds. Account separately for view/film offsets, post transforms and crop. This formula does not replace projected bounds for tilted, rotated, deep or occluded bodies.

Ratio example: doubling `d` halves projected height when all these conditions remain unchanged. This inference does not apply when FOV/pose changes or movement is sideways only.

<a id="ฉายตำแหน่งและ-anchors-ด้วยระบบเดียวกัน"></a>
### Project positions and anchors through one system

For a centered pinhole with the same conditions, transform a world point into camera coordinates `(xc, yc, zc)`, then use:

```text
d = -zc                         # Three.js camera convention; must be > 0
fPx = viewportHeight / (2 × tan(vFOV / 2))
xPx = viewportWidth / 2 + fPx × xc / d
yPx = viewportHeight / 2 - fPx × yc / d
```

General systems use the actual camera view/projection matrices and viewport/crop. Project foot/hip/grip anchors and target surface points through the same pipeline, then place actor artwork using projected anchors. Shrinking artwork while keeping its feet at the same screen y is not movement on a ground plane.

Use baseline world dimensions for 3D geometry and world-space cut-outs already projected by a perspective camera. Let the camera supply depth scaling **once**; multiplying object scale by `1/d` again distorts perspective. In simulated 2D perspective, one shared projection/staging owner handles position, size and anchors instead of scene-specific formulas.

<a id="zoom-dolly-และสองสัดส่วน"></a>
### Zoom, dolly and both aspect ratios

- Picture zoom/crop scales an already projected image. Optical/FOV zoom changes projection at a fixed camera position. Dolly changes camera position and spatial relationships. Record transform owner and order.
- Camera translation produces depth-dependent parallax: foreground/background move differently on screen. Pure picture zoom or pure rotation does not automatically justify the same added parallax.
- Short/Long share physical world dimensions; adapt camera/aspect/FOV/crop and staging so each output preserves action/contact/reveal readability.
- The [Boss workflow's Short lead ≥25% frame-height rule](boss-asset-workflow.md#กฎการผลิตล่าสุดของผู้ใช้) concerns projected visibility. Adjust framing/camera/staging while preserving actor–set–prop proportions. If it conflicts with wide/reveal intent, Film/Mark revise the shot with reasons rather than inflating one actor to pass the threshold.

<a id="4-perspective-ในงาน-2d-และ-hybrid"></a>
## 4. Perspective in 2D and hybrid work

1. Mark specifies ground plane, eye level/horizon and relevant vanishing directions consistent with the camera. Parallel world directions share the vanishing points implied by projection. Camera roll can tilt the horizon; not every shot needs a horizontal horizon line.
2. People, animals, furniture and props share space/depth. Higher image placement does not always mean greater distance: the object may be on a table or the camera tilted down. Derive projected foot/contact position from its named ground/surface.
3. Foreshortening changes projected shape when a part points toward the camera. Use pose/view artwork or geometry that supports the angle. Stretching/compressing the entire SVG does not create unseen sides and may distort limbs or held props.
4. Flat cut-outs have viewing-angle limits. Specify fixed-plane/billboard behavior and readable angle range, and check grip/seat/contact during camera movement. Billboarding creates neither volume nor unseen sides.
5. Depth ordering, occlusion and contact shadows must agree spatially during crossing/sitting/gripping. DOM/WebGL composites need verified mapping/masks/passes. Screen-space subtitles/UI remain outside spatial projection.

<a id="5-หลัก-animation-ที่นำมาประยุกต์"></a>
## 5. Applied animation principles

S3–S5 contain the instructors' principles. These pipeline applications are team synthesis:

- **Solid drawing / solid poses:** preserve volume, weight and balance through angle/pose changes. Check weight-bearing feet, hips on cushions and gripping hands. A compressed posed silhouette does not redefine physical size.
- **Staging:** use depth, projected size, occlusion and direction to guide attention. Build hierarchy with plausible camera/space while preserving the baseline.
- **Timing / spacing:** author paths in world/ground space and project every frame. Equal world movement per frame can produce unequal screen spacing as depth changes. Separate action easing from perspective effects.
- **Volume and squash/stretch:** intentional deformation communicates material/force while preserving perceived mass/volume. Specify extremes, duration and recovery; distinguish it from unintended scale drift and canonical size.
- **Parallax / continuity:** share depth definitions across motion, occlusion and anchors through cuts. Lens/angle changes can alter screen size while physical size remains constant. Mark records intentional changes so QA can distinguish them from pops.

<a id="6-authoring-handoff-และเกณฑ์จบงาน"></a>
## 6. Authoring handoff and completion criteria

The table describes **authoring notes**, not new JSON fields or APIs. Inspect target-checkout types, validator, renderer and shared registries before use. Integrate missing capabilities fully under [Remotion toolkit](remotion-toolkit.md).

| Document / owner | Required data | Complete when |
| --- | --- | --- |
| Visual brief / Film | Baseline reference, units/spaces, projection, camera intent, hybrid mapping, transform owner, feasibility/fallback | Mark can stage shots without guessing scale conventions; Boss knows shared owners and required proof |
| Scene sheet / Mark | Baseline revision, shot/decision IDs, ground/surface, FG/MG/BG/depth, camera/key panels for both aspect ratios, projected contact, entry/exit | Every scale/depth-changing beat has inspectable imagery and expected behavior |
| Library + QA / Boss | Actual dimensions/bounds/anchors, conversion/projection owner, consumers, frame mapping and evidence | Scoped checks below are completed or marked unverified with follow-up |

QA must record expected → observed, composition, shot ID, frame/clock and repair owner:

- [ ] Calibration view: actor/animal/prop/furniture at the same depth compared to baseline; check logical bounds/padding before storytelling cameras.
- [ ] Near/far: same-sized objects shrink correctly with perspective depth; same-depth comparisons share orientation; orthographic size follows intent.
- [ ] Movement start/mid/end and depth extrema: foot/surface, hip/seat, hand/grip and shadows align without double scaling, sliding, clipping or unsupported edge-on cut-outs.
- [ ] Short and Long: shared baseline, visible action/reveal, compliant projected lead size and readable subtitles/UI without distorted proportions.
- [ ] Cut/event boundaries: `F-1/F/F+1`, attach/detach, sit/stand, reveals and relevant adjacent scenes; distinguish intentional camera/pose changes from scale pops.
- [ ] Playback and random/backward seek/remount reproduce the same frame: projection, pose and camera derive from frame/fps/seed without accumulated state. Add continuous review to contact sheets under Boss QA.

<a id="7-ข้อค้นพบจากแหล่งต้นทางและขอบเขตหลักฐาน"></a>
## 7. Primary-source findings and evidence limits

The bodies of these sources were inspected on 26 October 2026. These summaries cover relevant points only and do not establish installed-API or repository-runtime support:

| ID / Primary source | Supported finding |
| --- | --- |
| S1 — [Three.js: PerspectiveCamera](https://threejs.org/docs/pages/PerspectiveCamera.html) | Perspective camera with vertical `fov`, image `aspect`, near/far, zoom and view offset; view size uses distance along the viewing direction |
| S2 — [Three.js: OrthographicCamera](https://threejs.org/docs/pages/OrthographicCamera.html) | Object image size remains constant with camera-distance changes under orthographic projection; frustum bounds and zoom are available |
| S3 — [Jay Jackson / Animation Mentor: Solid Drawing](https://www.animationmentor.com/blog/solid-drawing-the-12-basic-principles-of--animation/) | Solid drawing conveys 3D form through 2D imagery, including weight, depth and balance; poses consider gravity/support |
| S4 — [John Nguyen / Animation Mentor: Staging](https://www.animationmentor.com/blog/staging-the-12-basic-principles-of-animation/) | Foreground characters, composition, camera angles, lines of focus and screen direction guide attention and communicate story |
| S5 — [Chris Hurtt / Animation Mentor: Squash and Stretch](https://www.animationmentor.com/blog/squash-and-stretch-the-12-basic-principles-of-animation/) | Shape deformation conveys flexibility/material; volume should feel consistent, and mathematically preserved volume may still need stylistic visual adjustment |

Pinhole formulas, calibration tables, ownership, handoff and QA are project inference/synthesis, not a checklist certified by these sources. Each asset needs its own scale references. This guide defines no universal anthropometric values and claims no new render results.
