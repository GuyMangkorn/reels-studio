# Shot-by-shot painted workflow: look frame, blocking reel, pinned finals

**Status:** E1–E7 `applied` (1 Nov 2026, documentation-only PR [GuyMangkorn/reels-studio#173](https://github.com/GuyMangkorn/reels-studio/pull/173); user: "Apply in docs PR"). Tools T1–T4 are built in `claude/scene-brush-architecture-da189e` and land in their own PR. Applying it changes rule documents, so it follows [DP03–DP04](../contributing.md#tools-and-document-improvements): user review per entry, then a documentation-only PR, plus separate tool PRs for T1–T4.

**Goal (user, 31 Oct – 1 Nov 2026):** after the voice is generated, render real shots one at a time following the storyboard page, review and fix each shot there, so fewer fixes are needed overall and the video finishes sooner. Constraint from the user: no throwaway work ("animatic … วาดแล้วทิ้ง").

**Scope:** painted 2D (p5.brush) deliverables on the Full tier. Light-tier use is open question Q1.

## 1. Evidence

- **Preview saves little and is never reused.** `--preview` paints a half-size canvas: 300 frames take 24–32 s against 38–54 s full size ([DF-20261031-render-speed](../dev-findings/DF-20261031-render-speed.md#symptoms-and-evidence)). The scene-cache key includes `scale`, and `--range` bypasses the cache (`scripts/render.mjs`, `if (range || noCache)`), so an approved preview is painted again for delivery.
- **Lower resolution does not help further.** The canvas at 0.75 and 0.5 cuts GPU wait by 58% and 65%, but paint JS by only 3–5%. A frame is about 128 ms in p5.brush calls against 25 ms of GPU wait ([DF-20261031-paint-seed-defer](../dev-findings/DF-20261031-paint-seed-defer.md#symptoms-and-evidence)).
- **Cost per mark** (same entry): textured `fill()` about 2 ms per polygon per pass, hatch polygon about 4 ms, wash polygon 0.04 ms, ink line about 0.2 ms. Fewer expensive marks is the only large lever on paint time.
- **A cache hit is nearly free.** First 3 scenes: a miss takes 59.6 s, a hit 5.0 s, and the two produce byte-identical output ([DF-20261031-render-speed](../dev-findings/DF-20261031-render-speed.md#symptoms-and-evidence)).
- **Studio practice** ([research note](../research/animation-studio-pipeline.md)):
  - Studios edit before they animate, and work from the top down: colour script, then sequence keys, then lit key shots, whose setups are propagated to the remaining shots.
  - Blocking is approved before polish, and shots are reviewed in the cut with their neighbours.
  - Approved shots are protected from later asset changes by version pinning.
  - Decisions are locked in order: story reel, layout, animation final, lighting final, picture lock.

## 2. Workflow

| Step | What | Output | Gate |
| --- | --- | --- | --- |
| W1 | Script lock (research, script, fact-check unchanged) | Approved script | existing |
| W2 | **Look frame** at the Film brief, **before the storyboard**: 1–2 painted stills (the main set with the lead character), finished grade. Skipped when the episode reuses an approved look (e.g. WORLD FOG) with no new set or character, recorded as `reused` | Look stills | **Look lock** (user): shared code (`src/painted/kit`, rig, palette) is frozen for the episode |
| W3 | Storyboard review page, text rows (unchanged) | Verdicts per shot | existing, not a gate |
| W4 | [Voice lock](../delivery-workflow.md#voice-lock) (unchanged) | Final narration + measure file | existing |
| W5 | **Blocking reel**: every shot built with its real staging code (layers, camera, poses, timing, cut points), painted in **draft mode** (T1), assembled to the locked voice | One full-length draft video + its scenes in the cache | **Cut lock** (user) |
| W6 | **Shot finals**, in storyboard order: finished paint, full size, through the scene cache; each review includes the previous and next shot ([sequence-workflow §7](../sequence-workflow.md#shared-sequence-and-continuity)). While the user reviews shot N, shot N+1 renders | Final per shot | **Shot final** (user, per shot) |
| W7 | **Pinned finals** (T3): a final shot's cache segment is pinned. A later shared-code change lists the pinned shots whose key it would change, and asks the user to re-render them or keep them | Pin list in `delivery.md` | user per change |
| W8 | Assemble from the cache → picture lock → deliver | Deliverable | existing |

**Why there is no separate animatic.** A studio animatic is drawn and then replaced. Here the blocking reel *is* the animatic: it is built from the shot code that W6 finishes. Draft mode only drops the expensive passes (textured fill, hatch), so nothing drawn in W5 is thrown away. W5 replaces the "runnable blockout" of [sequence-workflow §3 and §5](../sequence-workflow.md#shared-sequence-and-continuity) for painted work; it does not add a stage.

**Fix routing after look lock.** A fix asked for in W6 goes into that shot's episode code (`src/videos/<episode>/` or the shot's own painted module). It goes into shared code only with W7's list of affected pinned shots, shown to the user before the change.

## 3. Tools needed (tools change freely; built and measured before E1–E5 are applied)

- **T1 — Draft mode.** The input prop `paintDraft: true` makes BrushCanvas/painter replace textured `fill()` and `hatch` polygons with a wash of the same colour; ink lines stay. The cache key includes it, like `paintScale`. `render.mjs --draft` sets it.
  - **Built and measured (1 Nov 2026, uncommitted):** `drafted()` in `src/painted/BrushCanvas.tsx`, `--draft` in `scripts/render-options.mjs` and `scripts/render.mjs` (output `out/<id>/draft/`, scene-cached, not archived).
  - ZCPAINT-SHORT-TH, 36 frames every 60, `scripts/paint-bench.mjs`. Paint + GPU wait per frame went from 259 to 192 ms on average (−26%), and wall time for the 36 stills from 66.0 to 45.4 s.
  - Cast and interior frames fell 41–62% (f0 385 → 177 ms, f1800 418 → 158, f2100 390 → 164).
  - B08 city frames (f1500–1620, about 530–610 ms) did not change (−9% to +8%). They are built from wash polygons and ink lines, which the draft leaves as they are.
  - Picture (`out/review/draft-vs-base.png`): staging, poses, camera and colour all read the same. Only the paper texture and hatching are gone, so the draft is enough for a blocking review.
- **T2 — `--range` through the scene cache.** Render the scenes that overlap the range through `renderSegmented`, then cut the range out of the joined file. A reviewed range is then reusable for delivery.
  - **Built and checked (1 Nov 2026, uncommitted):** `scenesInRange` and `renderSegmented({frameRange})` in `scripts/segments.mjs`; `--range` uses it unless `--no-cache`. The cut re-encodes with an output-side `-ss`, because Remotion's ffmpeg build has no `setpts` filter.
  - CATBOX-C01-Short `--range=100-400` on a scratch store: the first run (miss) rendered 2 scenes in 58 s; the second run (hit) reused both and took 25 s. Both outputs have 301 frames, matching the direct render.
  - **Painted check:** ZCPAINT-SHORT-TH `--range=180-300` rendered 1 scene (f153–350) and produced 121 frames. Frames 180, 240 and 300 match fresh stills at 39.5–41.0 dB, the same level as encode noise.
  - CATBOX scene 2 depends on where the render starts: the cat's walk phase differs, 26.7 dB. It is not followed up, because CATBOX and the pure-SVG rig are retired (user, 1 Nov 2026: only p5 + SVG from now on).
- **T3 — Pin finals.** Add `store.py pin <CompositionId> <shot>` or a pin file beside the timeline. A render reports pinned segments whose key changed and stops unless `--repaint=<shots>` is given.
  - **Built and checked (1 Nov 2026, uncommitted):**
    - `applyPins`, `variantOf` and the per-variant `manifest.json` live in `scripts/segments.mjs`. The CLI is `scripts/pin.mjs` (`pin <shot> <from>-<to>`, `unpin`, `list`), and `render.mjs` gained `--keep-pinned` and `--repaint=<shot,...|all>`.
    - Pins live in `$REELS_STORE/cache/segments/<ID>/pins.json`, keyed by ending and then by scene. A scene holding several shots is pinned once and stays pinned while any of its shots is.
  - ZCPAINT on a scratch store: B02-SH01 and B02-SH02 were pinned as scene 2 (f153–350).
    - After a one-line change to `src/painted/plate.ts`, `--range=153-197` stopped with "pinned finals would change: B02-SH01+B02-SH02 (scene 2, f153-350)".
    - `--keep-pinned` reused the pinned segment (0 rendered). The change was then reverted.
  - Granularity is the timeline scene, not the shot. In ZCPAINT, scene 2 holds B02-SH01 to B02-SH03.
- **T4 — Review page clips and status.** Add a clip column to the storyboard page (draft or final segment for the row's frames, plus about 1 s of each neighbour) and a stage status (`blocking` / `final`) beside the existing verdict.
  - **Built and checked (1 Nov 2026, uncommitted):**
    - `scripts/storyboard-page/clips.mjs` renders each shot ±1 s through the scene cache and writes a 360×640 proxy. It also sets `clip`, `clipIn`, `clipOut` and `stage` in the rows.
    - `template.html` gained the per-shot steps (storyboard → draft → final → pinned), an inline clip with "▶ ช็อตนี้" (loops the shot's own frames) and "▶ รอยต่อ", stage-specific pass labels, a per-stage count, and verdicts stored with `stage`. A verdict counts only for the shot's current stage.
    - `build.py` validates `stage` and `clip`, copies clips, and defaults to one page per deliverable (`out/review-pages/<deliverable>/`).
  - Test page: rows for ZCPAINT B01-SH01 to B03-SH01 (B02-SH01 final then pinned, B02-SH02 draft), built and published to the mock URL as version 3 with the `db` capability. `reviews` is empty after publishing, script syntax OK, `npm test` 253/253, `tsc` clean.
  - Clip cost: B02-SH01 (f123–227) rendered 1 new scene and reused 1; B02-SH02 draft (f168–317) reused its scene. Proxies are 130–170 KB.

## 4. Document entries (DP02)

### E1 — AGENTS.md, "Review renders use `--preview` and `--range`"

- Status: `applied` (1 Nov 2026, [GuyMangkorn/reels-studio#173](https://github.com/GuyMangkorn/reels-studio/pull/173))

- Roles: all (coordinator, Editor, Boss)
- Evidence: §1, first two bullets.
- Replace the bullet with:

> - **Review renders reuse the scene cache (Requirement):** a video rendered for the user to look at is rendered with `scripts/render.mjs <CompositionId> --range=<from>-<to>` at full size, so the reviewed scenes are cached and a later delivery reuses them; the range covers the frames under review plus about one second either side. Blocking reviews add `--draft` ([shot-by-shot workflow](docs/sequence-workflow.md#painted-shot-by-shot)). `--preview` (half size, not reused) is only for a quick look the user asked for, and the reply says so. Stills for frame checks stay full size.

### E2 — docs/sequence-workflow.md, new section `<a id="painted-shot-by-shot"></a>` after "Shared sequence and continuity"

- Status: `applied` (1 Nov 2026, [GuyMangkorn/reels-studio#173](https://github.com/GuyMangkorn/reels-studio/pull/173))

- Roles: Mark, Boss, Editor, coordinator
- Evidence: §1; studio practice in the research note.
- Text: §2 of this proposal (the W1–W8 table, "Why there is no separate animatic" and "Fix routing after look lock"), labelled **Default** for painted Full-tier deliverables.

### E3 — docs/sequence-workflow.md §3 and §5

- Status: `applied` (1 Nov 2026, [GuyMangkorn/reels-studio#173](https://github.com/GuyMangkorn/reels-studio/pull/173))

- Roles: Editor, Boss
- Append to §3: "For painted deliverables the blockout is the W5 blocking reel: real shot code in draft mode, not placeholders, wherever the shot's layers exist."
- Append to §5: "The user's cut lock on the blocking reel closes this check for painted deliverables."

### E4 — docs/mark-storyboard-workflow.md, "User storyboard review page", Previews bullet

- Status: `applied` (1 Nov 2026, [GuyMangkorn/reels-studio#173](https://github.com/GuyMangkorn/reels-studio/pull/173))

- Roles: coordinator, Mark
- Append: "For painted shot-by-shot work, the preview column shows the row's draft or final clip with about 1 s of each neighbour (T4), and a stage status `blocking` / `final` beside the verdict."
- Also change the Default "one review page per revision" to: "**one review page per deliverable**, from the first storyboard pass to the last shot final. Each new scene-sheet revision, blocking clip or final clip republishes the same URL (the artifact keeps earlier versions), and verdicts stay keyed by shot ID with `rev`. Clips on the page are 360×640 proxies; full files stay in the scene cache." (user, 1 Nov 2026: "ตอนแรกผมนึกว่าจะใช้ sheet เดียวยาวยันจบเลย")
- Per-shot flow on that page (user, 1 Nov 2026: "เริ่มจาก accept draft => => จน accept final"): each row walks **storyboard → draft → final → pinned**. It shows a three-step marker and one pass/change pair for the current step; a pass renders the next step for that shot. The page header counts shots passed per step. Mock: https://claude.ai/artifact/6gMFm8MSjcuyMCxvNmyFb4

### E5 — docs/boss-asset-workflow.md, latest production rules

- Status: `applied` (1 Nov 2026, [GuyMangkorn/reels-studio#173](https://github.com/GuyMangkorn/reels-studio/pull/173))

- Roles: Boss
- Add: "After the look lock (W2), shared painted code changes only with the list of pinned finals it would repaint (T3), shown to the user first."

### E6 — docs/film-visual-brief-workflow.md, "Deliverables"

- Status: `applied` (1 Nov 2026, [GuyMangkorn/reels-studio#173](https://github.com/GuyMangkorn/reels-studio/pull/173))

- Roles: Film, Boss, coordinator
- Evidence: the user's decision to move the look before the storyboard (§5).
- Add: "For painted deliverables the brief ends with a **look frame** (W2): 1–2 finished-grade painted stills of the main set with the lead character, published for the user before Mark's first storyboard pass. The user's approval is the look lock: shared painted code is frozen for the episode. When the episode reuses an approved look with no new set or character, record `look frame: reused (<episode>)` instead."

### E7 — AGENTS.md, "Render by scene, keep the scenes": one mechanism for review and re-edit

- Status: `applied` (1 Nov 2026, [GuyMangkorn/reels-studio#173](https://github.com/GuyMangkorn/reels-studio/pull/173))

- Roles: all (coordinator, Mark, Boss, Editor)
- Evidence:
  - The user asked whether shot-by-shot approval overlaps the scene-by-scene render that keeps re-edits cheap ("มันคือแบบเดียวกับที่เราจะทำที่ approve final ทีละฉาก ถ้าเป็นแบบนั้นแก้ rule ให้ชัดด้วย"). It is the same mechanism: a final review clip is a scene-cache segment (T2), and approval pins that segment (T3).
  - The cache unit is the timeline scene, not the shot. ZCPAINT scene 2 (f153–350) holds B02-SH01 to B02-SH03, so approving one shot pins all three, and a caption fix in one repaints all three.
- Replace the bullet with:

> - **Render by scene, keep the scenes (Requirement):** every video render goes through `scripts/render.mjs`, which renders one timeline scene at a time and keeps each in `$REELS_STORE/cache/segments/<CompositionId>/` ([scripts/segments.mjs](scripts/segments.mjs)). The same segments serve review and delivery:
>   - a review clip (`--range`, `scripts/storyboard-page/clips.mjs`) renders the scenes it touches into the cache;
>   - the user's final approval pins those segments (`scripts/pin.mjs`);
>   - the delivery render and every re-edit reuse each scene whose inputs did not change, so after an edit only the touched scenes are painted.
>
>   A re-edit that would change a pinned scene (a caption, a cue, shared code) stops the render. Then either `--repaint=<shot>` renders it again and returns it to the user's Final tab for a new approval, or `--keep-pinned` ships the approved picture unchanged, with the reason recorded. **Default:** for painted deliverables, one shot is one timeline scene, so approval, pinning and re-edits each touch exactly one shot; a scene that must hold several shots (a continuous camera move, a dissolve chain) is recorded in the scene sheet and reviewed as one unit. Never replace this with a whole-timeline `npx remotion render` for a deliverable or a re-edit; a whole-timeline render is for a frame-range check with `--no-cache` only, recorded with the reason. Measured in [DF-20261031-render-speed](docs/dev-findings/DF-20261031-render-speed.md).

## 5. Decisions (user, 1 Nov 2026)

- **Workflow E1–E5:** approved as proposed ("เอาตามนี้"). Build and measure T1–T4 first; apply E1–E5 in a documentation-only PR once the tools work.
- **Q1 (Light tier):** Light-tier painted Shorts use W3–W6 as well ("ครบ W3–W6"). The Scope line above changes to "painted 2D deliverables on the Full and Light tiers".
- **Q2 (shot final):** no separate approval. The same storyboard page carries it: "ใช้ storyboard เดียวกันไปเลย เพิ่ม column เอาหรืออื่น ๆ มีปุ่มให้กดดู video กับ action". T4 and E4 therefore add, per row, a button that plays the shot's video and the action controls, in the same row as the existing verdict.
- **Q3 (look pilot):** 1 key shot per sequence, 2 when the sequence has two looks.
- **Look step moved (1 Nov 2026):** the user asked whether the look pilot repeated the blocking reel ("5 render video แล้ว 6 ยังมา render 2 - 3 frame อีก"). They chose to move the look before the storyboard ("ย้ายลุคไปก่อน storyboard"). The look pilot became the W2 look frame at the Film brief: 1–2 stills, skipped when an approved look is reused. Steps were renumbered W1–W8; Q1's "W3–W6" now means W2 and W5–W7.

## 6. Risks

- The user waits on more, smaller reviews. Mitigation: pipeline the render of shot N+1 during the review of shot N, and batch short shots of the same beat into one review.
- Draft mode may hide problems that only show at finished grade (texture density, hatch over faces). The look frame (W2) covers the look, and a shot final is always reviewed at finished grade.
- A shared-code freeze can block a real fix. W7 makes the cost visible; it does not forbid the fix.
