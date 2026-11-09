# EDU-EP11-SHORT spikes SP1–SP4 (Boss, 2026-11-09)

Brief [film-brief.md](film-brief.md) **EDU-EP11-BRIEF-R1.1** ("Spikes and acceptance"), rows ROWS-R1.1 (not edited). Checkout: worktree `check-project-pipeline-4ec3f9`, branch `claude/education-concepts-cleanup-61a91a` at `cfbfd4b` plus the uncommitted spike files below. Nothing committed, no episode composition registered in `src/Root.tsx`.
Render stage: **stills only** (no video render; no stage applies). All stills `scripts/stills.mjs` on one Chrome (`--gl=angle`), 1080×1920, viewed through `scripts/qa-sheet.sh` (CB03). Rerun everything: `sh scripts/edu-series/ep11/spikes/run-spikes.sh` (about 2 min; logs `out/logs/edu11-*`).

| Spike | Verdict | One line |
| --- | --- | --- |
| SP1 float in office clothes | **pass on every number; one visual call open** | feet gap 63 px, lead 800 px, phone separate, no arm pops; the still reads "shock/electrified" more than "weightless" because of the hair shape and the P46 arms (details below) |
| SP2 tracking section | **pass with two brief corrections** | car holds still to 0 px; but the brief's `hy 960` puts the car bottom at y 1189 (fail) and the crouched WOMAN is 293 px, not 501 (lead rule fail at r 8.5) |
| SP3 rewind and inset | **pass** | inset rect exact (0 px), f1236 = story frame 0 (noise floor only), seek identical within render noise; two small notes |
| SP4 two brakes | **pass** | unmistakably different devices; labels in slot; one framing correction for the bow spring |

## Sheets (send these)

| Sheet | Path | Frames (left to right) |
| --- | --- | --- |
| SP1 | `out/edu11/spikes/sheet-sp1.png` | frame 0 (LF01 base, P10, phone in hand) · float rise 0 · rise 0.5 · rise 1 |
| SP2 | `out/edu11/spikes/sheet-sp2.png` | f286 · f600 · f790 (tumbling) · f600 with yaw 3° · f600 close variant (r 5.0) |
| SP3 | `out/edu11/spikes/sheet-sp3.png` | f866 · f872 · f877 · f878 · f1211 · f1216 / f1221 · f1224 · f1228 · f1232 · f1236 · f1240 |
| SP4 | `out/edu11/spikes/sheet-sp4.png` | 1854 catch (B04-SH04 f1050 camera) · modern jaws (B05-SH03 f1405 camera) |

Full-size stills sit beside them in `out/edu11/spikes/` (`sp1-*.png`, `sp2-*.png`, `sp3-f*.png`, `sp4-*.png`, `inset-f877.png`). Measure logs: `out/logs/edu11-anchors.json`, `edu11-pixels.json`, `edu11-capzone.json`. `out/` is deleted with the worktree: file the sheets with `store.py archive --path out/edu11/spikes --project EDU-EP11 --kind spikes` when the coordinator has seen them.

## SP1 float in office clothes

Built: `woman-long + office` with the tie removed (`car.ts` `woman()`), N5 `hair-float` as the new optional field `HeadStyle.hairRise` (kit `head.ts`, `long` cut, front view; absent = the old polygon, unchanged), weightless figure = P46 + `zero-g-drift` through `layerMotion` with the whole card lifted (`paintFloat`), free-floating phone (N7, `paintPhone`), SET-CAR as far as the stills need (`paintCar`). Camera CAM-CAR-M at B01-SH03 mid values (`(0, 1.00, −0.30)`, yaw 4.5, r 2.28, eye 1.60, f 1200, hy 740).

| Acceptance | Result | Evidence |
| --- | --- | --- |
| Lead ≥ 700 px | **800 px** (head top 720 to feet 1520; frame 0: 801 px) | `measure-anchors.ts`, anchors of `drawFigure` through a stub painter |
| Feet gap ≥ 40 px | **63 px** at lift 0.15 m (0.12 m gave 47 px: the drift's ±0.03 m eats the margin, so lift 0.15 m) | anchors; a soft floor shadow under her makes the gap read |
| No arm pops | **max hand jump 2.2 px per frame** over 90 frames of `zero-g-drift` | anchors, per-frame hand points |
| Phone separate | **yes**, free at (0.30, 1.75, −0.20), spinning | still |
| Same frame on seek | **yes within render noise** (see SP3: fresh Chrome and reversed frame order differ by at most Δ7/255 in about 0.05 % of bytes; no structural difference) | `seek/` files |
| Reads weightless at 270 px (hair fanned up, feet gap, phone separate) | **partly** | hair fanned: yes; feet gap: yes (63 px + shadow); phone: yes. But rise 1 reads as *shock or static electricity* in a single frame: the fan is a ring of spiky strands round the head, and P46's forward-reaching arms are foreshortened in the front view, so the arms hang at the hips with mitten hands, not floating. The motion (drift, roll ±2.6°) and the phone carry the "weightless" read in playback; the still alone does not. |

**Film should decide (not a failure):** (a) accept hair at rise 1 as the key read and judge it in motion at LF01b, or (b) ask for a calmer fan (fewer, longer strands drifting up and sideways; I can rebuild `longBack` for that, about 1 h), or (c) add one more weightless cue to B01-SH03/B03: the hair plus a floating object near her (the phone is there) plus a slow body roll of 10–20° from f160. I recommend (c), since the roll is already in the kit (`roll`).

**Other findings (SET-CAR, N1):** at yaw 10 (frame 0) the right wall ends at z +0.65 and a dark strip 100 px wide shows at the right edge: extend the culled-front car's side walls to z +1.4 in the build (my call, no brief change). The pale steel palette of the brief puts the caption band over bright walls: caption-zone mean 0.58 / p95 0.86 (default limits 0.25 / 0.40); a three-step wall-base shadow ramp (painted floor bounce, kept in `paintCar`) brings it to **0.32 / 0.47 (frame 0)**; with her white shirt in the band the p95 stays about 0.73 in the float frames. The series default is the edu stroke without an overlay band, so this is a Film/Editor call whether the numbers matter (the stroke carries it); if they do, darken `steelMid` toward `#7b858e` below the handrail.

## SP2 tracking section

Built: SET-SHAFT section (N2): concrete cut faces with slabs and diagonal hatch, back wall with landing recesses every 3 m, rails (T, x ±0.85) with brackets, six cables, work lights, car shell cut at z = 0 with glowing interior, crosshead and guide shoes, speed streaks, WOMAN inside (crouched P35 at f286/f600, floating and rolled 160° at f790), shell cut edges drawn after her. Fall clock VD10 (`yCarAt`), camera `trackCam` (target rides the car, r 8.5, f 2600).

| Acceptance | Result | Evidence |
| --- | --- | --- |
| Car holds still ±2 px at f286 / f600 / f790 | **0 px**: pixel bounding box of the shell colour is x 310–769, y 394–1159 in all three stills (the projected corners are identical: 310.6/769.4, 394.7/1159.4) | `edu11-pixels.json`, `edu11-anchors.json` |
| Car bottom ≤ y 1160 | **1159 px, but only with `hy 930`.** The brief's `hy 960` gives 1189 (fail). Its own figures (car y 394–1159) are `hy 930`, so the brief line is the typo | corner projection |
| Rails continuous, no seams at slab repeats | **yes** (rails are single full-height strips; slab bands and hatch are world-anchored, so they stream without a join) | sheet-sp2 |
| Recesses and work lights stream upward | **yes by construction**: 14 px/frame at f286, 33 px/frame at f600, 44 px/frame at f790 | computed from the clock; no video viewed |
| Yaw drift 0→3° (VD06 parallax) | car edges move up to **2.5 px** (just over ±2), and the car shifts 1.4 px sideways | `SP2-F600-YAW` corners |
| WOMAN inside, lead ≥ 480 px | **fail at r 8.5**: crouched (P35) she is **293 px** at 295 px/m; standing 491 px. The brief's "WOMAN inside 501 px" is her standing height | anchors |

**Film must change:** (1) VD06 `hy 960` → **`hy 930`** (and the matching numbers stay). (2) The crouched WOMAN cannot reach 480 px in a full-car section at r 8.5 (the car would need about 484 px/m, 1210 px tall, which cannot sit above the caption band). Two options, both rendered or measured: **(a)** close variant `r 5.0, hy 770` (still `sp2-f600-close.png`): car floor at y 1160, lead **486 px**, the roof and the top of the cables fall off the frame (about 140 px of roof cut), the rails and recesses still stream; or **(b)** record a lead-size exception for the section shots (the car is the diagram subject; she is a dot-sized figure). I recommend (a) for B01-SH04 and B02-SH01/SH02 where she is crouched, and keeping r 8.5 only where the car is the subject. (3) Cap the yaw drift at 2° (or accept 2.5 px). (4) Cue strength: every landing recess is identical and repeats every 915 px, so a still cannot tell scrolling from standing and the streaks are faint; ask for 2–3 landing variants (an open door, a dark one, a lit one) and heavier streaks from f600, so the fall reads in playback. Not viewed as a video (stills only).

## SP3 rewind and inset

Built: `sp3.tsx` composition `EDU11-SP3` (1700 f, global frames as in the brief). The interior story is **one pure function of the story frame `s`** (`storyAt`, `paintStory`): frame 0 (`s` 0), the frozen end pose (`s` 748, B03-SH03 end: rolled 160°) and every rewind frame are the same function, with camera, paint clock and boil step following `s`. Layers: live frozen scene scaling into slot INSET (f866–878), raster `<Img>` of the f877 still (file `public/edu11-spike/inset-f877.png`, rendered once from `EDU11-SP3-FREEZE`), grow (f1211–1221), rewind (f1221–1236: `s = 748·(1 − ease)`, camera and grade blend to frame 0), HUD (`hud.tsx`), rewind streaks, kit `Stamp` "แทบ" at f1238.

| Acceptance | Result | Evidence |
| --- | --- | --- |
| Inset rect matches slot INSET ±4 px | **exact**: white border runs x 760–1039, y 640–1137 = 280 × 498 at f878, f1000 and f1211 (0 px error); border 6 px | `edu11-pixels.json` |
| f1236 = frame 0's pose and HUD state | **yes**: `storyAt` and `hudAt` at the rewind end equal story frame 0 (counter 20, needle 0, light 1, mode stand, rise 0), camera object equals CAM-CAR-M frame 0; pixels differ from the story-frame-0 render by **2882 bytes of 6.2 M, max Δ6/255**, the same size as the difference between two renders of one frame (noise floor) | `edu11-anchors.json` (`SP3-f1236-equals-story0` true), `sp3-f1236.png` vs `sp3-f0hud.png` |
| Identical frame on random seek (f1228) | **yes within noise**: sequence run vs fresh Chrome vs reversed-order run differ by 2146 / 2221 bytes, max Δ6; the raster-only frame f1000 is byte-identical (0 differing bytes). Painted frames are not byte-identical across Chrome runs on this machine (Δ ≤ 7/255, no structural difference), which also holds for frames that never moved | `seek/` |

**Notes for Film/Editor (no failure):** (1) The HUD is absent in the f877 raster and appears at full strength on f1221 (a one-frame pop at the swap): give the HUD a 3-frame fade-in at f1221. (2) VD18 says the HUD shows "20, needle 0, tag kept" after the rewind, but frame 0 (B01-SH01) has no HUD until f45; the spike follows VD18 (HUD on), so f1236 differs from the real f0 only by the HUD. Keep as is unless Film wants the HUD to slide in again. (3) The rewind runs through three pose-mode switches (standing ↔ float at `s` 132, float ↔ crouch at `s` 260, crouch ↔ float at `s` 680), so three one-frame arm/leg pops fall inside the 15 frames. At 0.5 s with streaks over it they will probably read as rewind jitter, but the clean fix is a keyed pose track with `poseMix` between P10/P46/P35 (about 3 h in the episode shot code); decide at the draft cut. (4) The shrink's last frame f877 is at 98 %: the box is 15 px off the slot (the ease ends at f878). The rect is exact from f878, which is where the raster takes over, so nothing to fix. (5) Stamp "แทบ" at (905, 720) sits clear of the HUD slot (y 224–600) and the caption band.

## SP4 two brakes side by side

Built: `catch-1854` (N11): timber upright with a sawtooth notched face (tooth tops face up), platform post and beam, bow-spring end, slack rope loop, iron pawl in the notch with amber outline on pawl and notch only, sepia palette; `safety-jaws` (N11): smooth steel T-rail, car side, steel shoe block with two angled wedge jaws on the rail head, cool steel, bolts, scratch marks, bite bloom available (off at f1405). Cameras CAM-HALL-CATCH and CAM-JAWS exactly as VD22/VD27.

| Acceptance | Result | Evidence |
| --- | --- | --- |
| A viewer cannot read them as the same device (material, colour, mechanism shape) | **pass**: timber + sepia + serrated edge + curved iron hook and spring vs smooth steel + cool grey + straight rail + symmetrical wedge block; no shared silhouette | sheet-sp4 |
| Both labels in slot | **pass**: "ภาพประกอบ" at x 816–1020, y 148–204 in both (HUD also in the jaws still: x 800–1040, y 224–600) | stills |
| Nothing in the caption band | **pass for story content**: the pawl, notch pocket and bolts end above y 1160; only the continuing sawtooth/rail background crosses y 1176–1344. Luma over the band (dashed guides drawn in the stills): catch mean 0.64 / p95 0.72, jaws 0.42 / 0.90 (default limits 0.25 / 0.40 fail, like every bright still; edu stroke default) | `edu11-capzone.json` |

**Film should change:** at r 0.90 the camera sees x ≥ 0.68 only, so the **bow spring across the platform top is out of frame** and only its end touches the pawl tail; B-P1-FIX-c ("rope slack first, then the pawl") cannot be told in this one close. Widen CAM-HALL-CATCH to **r 1.3** (frame 0.70 m wide, notches still 154 px) or add an 8-frame wide-to-close move so the flattening bow and the slack rope are seen before the bite. The jaws and catch both read at the brief's cameras otherwise.

## What was built and where (uncommitted)

| Path | What |
| --- | --- |
| `src/painted/edu11/car.ts`, `shaft.ts`, `brakes.ts`, `sp1.ts`, `sp2.ts`, `sp3.tsx`, `hud.tsx`, `stage.tsx`, `spikes.tsx`, `spike-index.ts` | spike code (SET-CAR, WOMAN, float, phone, SET-SHAFT, catch-1854, safety-jaws, HUD, inset and rewind); standalone entry `spike-index.ts` (not in `src/Root.tsx` or the episode registry) |
| `src/painted/kit/head.ts` | **kit change (proposed intake, N5):** optional `HeadStyle.hairRise` 0..1 (front view, `long` cut). Absent = the old polygon (same coordinates). Consumers: none yet. Needs a kit-README line and a test at intake |
| `scripts/edu-series/ep11/spikes/` | `run-spikes.sh`, `measure-anchors.ts`, `measure-pixels.py` |
| `public/edu11-spike/inset-f877.png` | the inset raster, a spike artifact: delete before any commit (`store.py` owns real media) |
| `docs/context-map.md` | one EP11 row (the context-map test needs it) |

Built from the brief's N1 (partly), N2 (partly), N5, N6 (spike form), N7, N9 and N10 (spike form), N11. Not built (not needed by a spike): N3 SET-HALL1854 hall (only the catch close), N4, N8, N12–N16 (poses `float-grab-rail`, `rail-crouch`, `push-off-float`, faces `ouch`/`relieved`: the spike used P35, P46, `scared`, `angry` and the rolled P46 as stand-ins).
Checks run: `npx tsc --noEmit` (no error from these files; the 3 errors in `tests/` are older and unrelated), `python3 -I scripts/context-map.py`. `npm test` not run.
