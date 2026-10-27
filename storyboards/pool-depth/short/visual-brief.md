# Visual brief — POOLDEPTH-SHORT (Blender-only)

Deliverable: `POOLDEPTH-SHORT`; delivery record: `scripts/pool-depth/delivery.md`; target 40–60 s, estimated about 52 s (+3 s `B_loop` hold included in that estimate); timing status: **estimated** (no read-aloud, no audio test). 1080×1920, 30 fps (Short).
Revision: `VB-POOLDEPTH-SHORT-R1`; status: `ready-for-mark` for planning, with `needs-feasibility` on the Blender route (see Runtime status). Readiness is not approval, runtime proof or visual proof.
Script: `scripts/pool-depth/short/script.md` `POOLDEPTH-SHORT-R2` (user-approved in chat 2026-10-27); fact-check: `scripts/pool-depth/short/fact-check.md` R2 recheck `ready-for-storyboard` (factual scope only); research `scripts/pool-depth/research.md` R1.
Style profile / tier: explainer-educational with a safety payoff, Niwat TTS, sparse SFX/music, outline captions, ending `B_loop`; Full tier. Medium: **Blender-only** (user decision 2026-10-27). Channel-default illustrated rules (demo lighting, 2D rig contact, `ทำไมล่ะ`-era palette) are overridden for this profile with this reason; lead-size, ground shadow, scale and QA rules still apply to whatever is rendered (`boss-asset-workflow.md#latest-production-rules`).
Target checkout: branch `claude/compact-scene-sheet-template`, HEAD `cfa9188` (untracked `scripts/pool-depth/` only); scope: all six beats of S01; adjacent boundary: the loop seam B06 → B01 only (no other scenes).

## Runtime status and feasibility evidence (inspected 2026-10-27, HEAD `cfa9188`)

Kept in three separate groups. Nothing here is visual proof.

### A. Remotion runtime support for Blender-produced media

| Capability | Status | Evidence |
| --- | --- | --- |
| Full-frame video or image in a scene (`Scene.media[]`, `bg: 'none'`) | `existing-integrated` for unprojected scenes | `src/scenes/types.ts` (`MediaClip`), `src/scenes/media.ts` (validator), `src/scenes/MediaLayers.tsx` (`Img`, `OffthreadVideo`), `docs/remotion-toolkit.md` 10a, `tests/media.test.ts`. Media clips are **rejected on projected scenes** (`media.ts` line ~28), so media and `Scene.projection` cannot be combined. |
| Blender output used by any existing video | `missing` | No `assets/blender/`, no manifest/`build.py`, no `.blend`, no `three`/`@react-three` in `package.json`, no `src/three`. `grep -ril blender src scripts tests` returns nothing; only docs/briefs mention Blender. |
| How CATBOX consumes it | **it does not** | CATBOX is 2D SVG/coded art. Its `storyboards/cat-boxes/visual-brief.md` says "No external imagery… or Blender output needed". The only raster-adjacent path is the HEAD experiment `Scene.worldArt` (SVG pieces exported from coded art, `scripts/cat-boxes/export-sc01-pieces.tsx`, `CATBOX-C01-Short-pieces`), marked "Experimental, not Boss-reviewed"; it is for projected metre-stage scenes and is not a Blender path. |
| GLB/glTF → Three.js route | `missing` | No loader, stage or dependency. Not chosen (see VD01). |
| `pool-depth` composition / timeline | `missing` | No `src/videos/pool-depth/index.ts`; delivery record says "not implemented". |
| Image-sequence input | `missing` | `MediaClip.kind` is only `video` or `image`. |
| Video packaging | `unknown` policy | `.gitignore` ignores `*.mp4` (and `*.mp3`); WebM/PNG are not ignored. Commit/LFS/regeneration policy for Blender clips is undecided (Boss/coordinator). |
| Clip hold/seek behavior at scene end under `B_loop` | `unknown` | `endingState` freezes only actor `poseFrame`; video clips run on their own clock. `OffthreadVideo` past clip end is untested here, so every clip must cover its full scene window (incl. the 3 s hold in B06). |
| "ฉากสมมติ" label from frame 0 | `unknown` | `Scene.eyebrow` exists but fades in over 12 frames (`SceneRenderer.tsx` ~line 128); captions are visible from frame 0. Editor must choose and prove: eyebrow with no fade, or a second subtitle line. |

### B. Blender MCP setup (checked on user request; read-only; evidence per `blender-mcp-workflow.md` preflight)

| Check | Result |
| --- | --- |
| MCP server process (client side) | **Running**: `blender-mcp` from the Claude extension `ant.dir.gh.blender.blender-mcp` (uv-run, pids 13738–13740 and 98296–98302). Tool schemas are exposed in this session (e.g. `get_objects_summary`, `render_viewport_to_path`, `execute_blender_code`). |
| Connection to Blender | **Failed**: `get_blendfile_summary_path_info` and `get_objects_summary` both return "Cannot connect to Blender at localhost:9876". Nothing listens on TCP 9876 (`lsof`). |
| Blender application | **Not installed**: no `/Applications/Blender*`, none in `~/Applications`, no Homebrew cask, no Spotlight hit for `Blender.app`, no `~/Library/Application Support/Blender` (no user config, so no add-on installed), no Blender process, `blender` not on `PATH`. |
| Add-on enabled / server started | Cannot exist without Blender; **not met**. |
| Blender version, EEVEE/Cycles availability, scene/camera state, glTF/image export path | **Unknown**: unreachable. `render_viewport_to_path`/`render_thumbnail_to_path` were not called (they need a live connection). Modern Blender ships both engines, but Cycles on this Mac is unverified. |
| `ffmpeg`/`ffprobe` | Not on `PATH`. Blender can encode H.264/WebM itself; `npx remotion ffmpeg` may cover conversion (**unverified**). |
| Fix (owner: user for install, then Boss) | 1) Install Blender (pick a current stable release; record the version). 2) Install and enable the MCP add-on in Blender, start its server (default port 9876), keep the app open. 3) Boss reruns preflight: `get_blendfile_summary_path_info`, `get_objects_summary`, one `render_thumbnail_to_path` into the scratch/`out/blender/` folder, confirm Cycles + EEVEE render and the FFmpeg video output format. Until then every Blender-dependent decision below is `unverified`; brief work does not depend on it. |

### C. Dev findings consulted (checked 2026-10-27, HEAD `cfa9188`; none establishes Blender or media feasibility)

| Finding | Scope match | Effect on this brief |
| --- | --- | --- |
| `DF-20261026-studio-emfile` (open) | tooling, same machine class | Studio seeking is `unverified` here; use CLI renders, one-second contact sheets and `F-1/F/F+1` stills as bounded evidence; do not label anything Studio-verified. |
| `DF-20261026-subpixel-stage-projection` (fixed on its branch) | 2D metre-space DOM/SVG stage | Irrelevant: Blender media is a screen-space raster; no metre-space DOM stage. Lesson reused: one projection owner. |
| `DF-20261027-catbox-short-home-stage` (fixed on PR #38 branch) | portrait crop/overlay ownership | Lesson reused: draw each element once (VD11: label and captions only in Remotion; no text baked into Blender frames). |
| `DF-20261026-duplicate-types` | typecheck env | Irrelevant. |

## Visual intent

Audience knowledge change: from "that water looks knee-deep" to "the picture of the floor is lifted, so judge depth by markers, not by eye". Mood: bright, clear, slightly uneasy at B01, curious at B03 ("oh!"), calm and clear at B05, open-ended at B06. Color/value key: cool, saturated water and floor (aqua `#4CC9D8` → deep teal `#1B6F86`) against warm deck and skin tones (sun-warm `#FFE2B8`, deck `#F6E7D0`), shirt accent from the channel palette (`#FF8FA3`) so the child is the warmest, highest-contrast shape in B01/B05/B06. Diagrams (B02/B04) use a pale neutral ground (`#F4F7FA`), ray colour `#FF9F5A`, true-floor `#1B6F86`, apparent-floor `#FFD166`. Camera language: grounded, mostly static or slow spatial pushes owned by Blender; the demo (B03) is a locked camera on purpose.

Conceal/reveal: no twist. Honesty rules (binding, from script R2 + fact-check R2):

1. **The 3/4 ratio and "2 ม. → 1.5 ม." appear only in the B04 straight-down state** (side cross-section with a vertical line of sight). Never on the B01/B05/B06 pool-edge views, never on the oblique state. A ratio mark must disappear before the oblique state appears.
2. **Oblique views show no ratio and no number**; only the trend "ยิ่งเฉียง ยิ่งตื้น" (caption `มองเฉียง: ยิ่งดูตื้นขึ้น`).
3. **Coin demo (B03):** locked camera ("still eye"), calm gentle pour, coin transform has **no keyframes**, mug opaque, coin hidden by the rim before the pour and visible only through the water, and the refraction is real (not an animated coin move).
4. **B01 is a labeled dramatization** (child is an invented stylized dummy, no injury, no outcome). "ฉากสมมติ" on screen through the whole of B01, including after a loop.
5. Diagrams are schematic, not measured pool footage; ray angles in B02 are exaggerated for legibility and carry no numbers (suggest to Preaw/Editor an optional "ภาพประกอบ" tag; not a blocker).

## Visual progression

| Scene / beat refs | Visible action | Information / emotional change | Visual form and reason | Repetition / reason to return |
| --- | --- | --- | --- | --- |
| `S01-B01` 0–6 s | Child dummy at the pool edge, toes at the lip, about to jump; slow dolly-in over clear water; floor tiles visible and looking near | Pose the question "knee-deep?"; small unease | Rendered 3D pool-side, real refraction so the floor genuinely reads raised; photographic-ish but stylized | Opening anchor; the same set and frame return at B05/B06 |
| `S01-B02` 6–16 s | Pool is revealed as a side cross-section; rays from a floor marker rise, bend flatter at the surface, dashed straight extensions back into the water meet at an apparent marker above the true one | "Why": light bends leaving water, brain assumes straight light, floor image lifted | Orthographic diagram in the same Blender world (cutaway of the same pool), computed from Snell, no numbers | Different form from B01 (diagram vs scene); returns in B04 with the same set |
| `S01-B03` 16–26 s | Macro tabletop: opaque mug, coin hidden behind rim from a locked eye; calm pour; coin image rises into view; coin never moves | The "oh!": the viewer can reproduce the lift | Rendered 3D demo, real refraction, locked camera, no diagram on top | Different action and scale from B01/B02; physical proof of B02 |
| `S01-B04` 26–38 s | Same cutaway as B02 but to scale: eye above, vertical line of sight, true floor bar vs apparent floor bar (4:3), then bars dissolve and the eye swings to an oblique angle, the apparent marker rises further | Quantify: n ≈ 1.33 (voice), 3/4 straight down, 2 m → 1.5 m, oblique shallower still | Diagram with explicit state change (ratio state → oblique state) so the ratio cannot appear on the oblique view | Reuses B02 set for continuity; new information is the number and the angle dependence |
| `S01-B05` 38–47 s | Back at the pool: depth marker sign, child sits and lowers feet in first, no-diving pictogram sign | Turn physics into three actions | Three short shots on the B01 set (sign, legs/feet entering water, pictogram); legs-only crop avoids a full child rig | Returns to the opening set deliberately: payoff location equals hook location; each shot shows a different action |
| `S01-B06` 47–51 s +3 s hold | Camera eases back to the exact B01 frame 0 composition; child as at B01 frame 0 | Re-raises the question for the viewer's own water | Match to B01 frame 0 for a near-invisible loop seam | Intentional return; no goodbye, no CTA |

## Scene decisions

| Scene / beat refs | Decision ID | Set / actors / props / effects medium | Framing / camera intent (9:16) | Light / shadow / color | Why / fallback |
| --- | --- | --- | --- | --- | --- |
| All | `VD01` | **Route: Blender pre-render to full-frame video** per beat/sub-shot, consumed through `Scene.media` (`bg: 'none'`, `actors: []`). Remotion owns timeline, narration, captions, label, chrome, ending. | See per-beat rows | Blender-baked light only | Reason: no GLB/Three.js stack exists in the checkout; pre-render keeps Blender's refraction, which is the story's honest core. Alt: GLB/Three.js = `missing`; hybrid = not needed. Fallback if video route fails S0: PNG stills with a Remotion picture move for static holds. Status: `needs-feasibility` (Blender not installed). |
| `S01-B01`, `B05`, `B06` | `VD02` | Pool set: rectangular pool, white tile floor with a dark lane line and checker patch (floor must carry features that visibly shift under refraction), deck, one sign post; child = stylized faceless dummy (back or 3/4-back view) | B01: camera behind-left of the child, camera height about 2.2 m, distance about 3.0–3.5 m behind the child, pitch down about 30–35°, vertical FOV about 45° (design values, not rendered); slow dolly-in about 0.15 m over the beat (spatial, Blender-owned). Child projected height target at least 480 px of 1920 (estimate by the frontoparallel formula: 1.25 m child at 3.2 m, 45° vFOV → about 47% of frame) | Key: sun from upper left rear (elevation about 50°, warm), fill: procedural sky (no external HDRI, avoids license), rim from the sun on the child's shoulders; ground shadow on the deck from the sun (real); small ripple amplitude so the floor stays legible; no strong glare. Demo-lighting caps are Three.js and `N/A` here | Why: Cycles refraction through a closed water volume (IOR 1.333) lifts the floor physically. Fallback: EEVEE with a scripted "raised floor" (underwater geometry compressed toward the surface by the computed factor); acceptable for B01/B06 only if labeled as a dramatization (already `ฉากสมมติ`), not for B03. |
| `S01-B01` | `VD03` | Label and caption: "ฉากสมมติ" and "ดูตื้นแค่เข่า... จริงเหรอ?" as Remotion text only | Reserve top ~14% (label/chrome) and bottom ~25% (captions) as estimates; child and water edge stay between | n/a | B01 must be one scene (or every sub-scene carries the label). Dependency: label visible at frame 0 (see Runtime table). Fallback: put "ฉากสมมติ" in the subtitle string. |
| `S01-B02` | `VD04` | Cutaway diagram in Blender: glass-clear pool slice (flat translucent water block, **no refraction shader**), true-floor marker (ball), eye icon, rays as thin emissive tubes, dashed back-extensions, apparent marker (ghost ball) | Orthographic, side-on (looking along +Y), static with a very slow ortho push (Blender-owned); eye upper right; marker lower left | Flat unlit-ish, low contrast ground, rays colour-coded; no shadows needed | Geometry must come from `build.py` solving Snell (n = 1.333), not hand placement: exit rays flatter to the surface than in water; back-extensions meet above the true floor marker. Angles exaggerated, no numbers. Fallback: pre-solved 2D vector layout rendered flat in Blender. |
| `S01-B03` | `VD05` | Opaque ceramic mug (design: inner Ø 8 cm, inner height 9 cm), generic plain coin (design Ø 2.0 cm, no national design), small jug or kettle, calm water rise plus a thin deterministic stream (animated mesh, **no fluid simulation**) | **Locked camera, no motion** (stillness is the content; picture-motion rule `N/A`, reason recorded). Camera on the line of sight about 40° from vertical over the near rim; mug fills the lower-middle frame; pouring hand/jug enters from the side without crossing the sightline | Soft window key from left, daylight neutral, wood table; coin gets a small specular so it reads as it appears; shadow under mug | Film-derived design check (not rendered): sight line 40° off vertical over a 9 cm wall reaches the floor 7.55 cm from the near wall, so a coin spanning 5.4–7.4 cm is fully hidden; after water at 7 cm depth, Snell (n = 1.333, refraction angle 28.8°) moves the visible floor limit to 5.53 cm, exposing about 94% of the coin. Boss's `build.py` solves exact numbers. Acceptance: coin hidden at start, visible after fill, coin and camera carry no keyframes. Fallback: if Cycles refraction fails the acceptance, do not fake the coin rising; instead show a labeled diagram variant (side view with the fixed sight line) and return the beat to Film. |
| `S01-B04` | `VD06` | Same cutaway as `VD04`, now to scale: true depth marker at 2.0 units, apparent at 1.5 (ratio 0.7502 from n = 1.333), vertical sight line through both bars. Then bars dissolve; the eye swings to an oblique angle; the apparent marker is the back-extension of the sight ray crossing the marker's vertical (higher, no bar, no number) | Orthographic side-on, static; 2 states with a dissolve between them, Remotion captions carry "มองตรงลงมา: เห็น ≈ ¾ ของความลึกจริง" and "ลึก 2 ม. ดูราว 1.5 ม." only during the straight-down state, and "มองเฉียง: ยิ่งดูตื้นขึ้น" only during the oblique state | Same flat key as `VD04` | Straight-down view is the only place the ratio appears. Do not show 0.63/0.50. Pass/fail is geometric (see S3). |
| `S01-B05` | `VD07` | Pool set from `VD02`: (a) depth-marker sign close-up (generic plate, digits allowed, no Thai baked in; any number equals the design true depth of the B01 pool, design value 1.0 m, and avoids 2 m/1.5 m), (b) legs-only crop: feet and shins lowering into water from a seated edge, (c) generic red-slash no-diving pictogram (no real organization's sign) | Short shots about 2.5–3.5 s each; modest Blender-owned pushes; no dive and no splash/injury imagery | Same sun as B01, slightly lower and warmer for calm; calmer water | Fallback for (b): stills plus Remotion picture move. Do not show a head-first dive. |
| `S01-B06` | `VD08` | Same set/child as B01, camera path ends exactly on B01 frame 0 (position, lens, child pose, water state, sun) | Ease back over about 3 s, then hold about 3 s on the identical frame | Identical to B01 frame 0 | See Loop seam. |
| All | `VD09` | Sound: light pour SFX at B03 only, sparse music optional, ducked under voice | n/a | n/a | From script; Remotion `sfx`/`audio` fields exist. |
| All | `VD10` | Frame mapping and clocks | Blender 30 fps; Blender frame 1 = scene-local frame 0; N frames = round(sec × 30); each clip covers its whole scene window; all motion keyed, no history-dependent physics | Ripples: seeded noise with a period that divides the clip | Verify random seek returns the same frames. |
| All | `VD11` | Text ownership | **No text baked into Blender frames**: all Thai (label, captions) and the numeric captions are Remotion; diagram marks are geometry (bars, dots), mapped to captions by timing | n/a | Avoids Thai font risk and double ownership. |

## Technical handoff

**Scale baseline** (one shared reference for Mark/Boss/Editor; **design/estimated**, not measured; to be stored as `assets/blender/pool-depth/manifest.md`): units metres, 1 Blender unit = 1 m, Z up, forward −Y for cameras; child dummy standing height 1.25 m, knee height 0.35 m, eye height 1.15 m, width about 0.30 m; deck 0.15 m above waterline; pool B01/B05/B06 true depth 1.0 m (design; the floor appears about 0.5–0.75 of that depending on angle, Cycles decides); mug/coin values in VD05; cutaway true depth 2.0 units / apparent 1.5 (computed). Stylization exception: faceless toy-like child (identity needed only across B01/B05/B06).

**Projection contract:** spaces `POOL` (origin on the deck edge line at the waterline mid-point, x along edge, y into pool, z up, m), `MUG` (origin on the inner floor centre, z up, m), `DIAG` (XZ side plane, y = 0, surface at z = 0, m). Perspective cameras for B01/B03/B05/B06 (vertical FOV proposals above; the physical lens must be converted from vFOV by Boss, since "35 mm" alone is incomplete); orthographic cameras for B02/B04. Output 1080×1920. Camera owner is Blender alone; Remotion applies no `pictureMove` or other transform to these clips (no duplicate transform). Remotion screen-space overlays only.

**Per decision technical seams** (Composition: full-frame raster video + DOM text; Depth/alpha: none, opaque frames; Lighting: all baked, no Three.js lights; Loading: video via `OffthreadVideo`, clip length must cover the window; Contract: existing `Scene.media`, no new field required except possibly the label).

| Dependency | Owner | Order | Consumers |
| --- | --- | --- | --- |
| D1 Blender installed, add-on running, preflight recorded, Cycles/EEVEE and video export confirmed | user (install), Boss | first | all |
| D2 `assets/blender/pool-depth/` source, `build.py` (Snell solver, deterministic animation), manifest, export settings, packaging policy for clips (`*.mp4` is gitignored) | Boss | after D1 | all |
| D3 Child dummy and simple idle/seated-leg motion | Boss | after D2 | B01, B05, B06 |
| D4 Label visible at frame 0 (eyebrow without fade, or subtitle line) | Editor/Boss | any time | B01 |
| D5 `pool-depth` composition + timeline JSON + narration | Editor | after D2 | all |

**Smallest spikes and observable acceptance criteria** (none run by Film; Blender unavailable):

- **S0 pipeline:** a 2 s Blender clip (any shape, 1080×1920, 30 fps) as one scene (`bg:'none'`, media). Pass: Remotion CLI frames 0, middle, last match the Blender frames 1, middle, last; random-seek/remount parity; clip length covers a 3 s hold; document codec and file size.
- **S1 refraction fidelity (B01/B03/B05):** same camera rendered with water IOR 1.000 vs 1.333. Pass: floor features shift upward with 1.333 and not with 1.000; at a near-vertical test camera the floor marker position matches the analytic Snell prediction within 2 px at 1080 width; render time per frame measured and recorded (about 1,000 Cycles frames are likely, unmeasured). Fallback per VD02.
- **S2 coin demo (VD05):** start frame has 0 coin pixels visible; after the pour the coin shows at least 80% of its area; coin object and camera have no keyframes; pour has no splash that moves the coin; calm surface during the reveal.
- **S3 diagram geometry (VD04/VD06):** bar ratio 0.750 ± 0.002; sight line vertical in the ratio state; oblique state contains no bars and no ratio caption frame; exit rays satisfy Snell (angle in air larger than in water); back-extensions meet at the marker.
- **S4 loop seam:** pixel difference between the B06 last frame and B01 frame 0 (video layer only) under an agreed threshold; the frame before the seam differs only by intended motion; identical ripple phase.
- **Studio:** `DF-20261026-studio-emfile` means Studio is `unverified`; rely on CLI stills and contact sheets (one-second sheets, `F-1/F/F+1` at each cut and at the dissolve in B04).

## Loop seam (B06 → B01)

`B_loop` here is a hold of the final staging for 3 s, then the shared seam. The pixel plan: B06's video returns to B01's exact frame 0 and holds; the seam is a cut between identical images, so only text changes ("แล้วน้ำตรงหน้าคุณตอนนี้..." → "ดูตื้นแค่เข่า... จริงเหรอ?" plus the label appearing). Inspection note: `endings.ts` keeps opacity 1 through the hold for `B_loop` (the doc comment mentions a dip to dark, the code does not apply one); Editor must confirm what the rendered output actually does. The last 0.5 s of B06 stays speech-free (script). Keep the label and caption timing at frame 0 identical to a cold start so loop playback is indistinguishable from the first play.

## Handoff to Mark

Constraints to preserve: beat IDs and windows; the 3/4 / 2 m → 1.5 m only in the B04 straight-down state; oblique views unlabeled by ratio; coin demo locked camera, gentle pour, stationary coin; "ฉากสมมติ" through all of B01; B06 ends on B01 frame 0; no injury, no dive, no real incident; no numbers on B02; no Thai text baked into Blender.

Choices left to Mark: sub-shot splits inside B03/B04/B05 (keep B01 as one scene), exact camera paths and key frames, child pose and sign number (if a number is shown it equals the pool's design true depth), whether B03 gets a 1 s side inset only if the VO has slack (B03 and B05 are word-tight), and exact caption/diagram cue timing (estimated until audio exists).

Missing evidence: Blender not installed (nothing rendered), narration timing estimated, Studio unverified, clip packaging policy undecided, label-at-frame-0 unproven, Cycles cost unmeasured.

If any of S0–S4 fails, return the affected decision ID to Film; changes to medium, camera ownership or the honesty rules need a new brief revision and a matching scene-sheet revision via the coordinator.
