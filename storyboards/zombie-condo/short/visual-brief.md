# Visual brief — ZCONDO-SHORT (TH + EN)

| Field | Value |
| --- | --- |
| Deliverables | `ZCONDO-SHORT-TH` (primary) and `ZCONDO-SHORT-EN`; delivery record [../../../scripts/zombie-condo/delivery.md](../../../scripts/zombie-condo/delivery.md) |
| Revision / status | **`VB-ZCONDO-SHORT-R3`** (28 Oct 2026, Film); **`ready-for-mark`**. Spikes `SP01` (corridor plate) and `SP02` (section cutaway) are still required before Boss produces plates; they do not block Mark's scene sheets. Supersedes `VB-ZCONDO-SHORT-R2` (same day), which was timed to script R2 |
| Scripts | TH [../../../scripts/zombie-condo/short/script.md](../../../scripts/zombie-condo/short/script.md) `ZCONDO-SHORT-TH-R3`; EN [../../../scripts/zombie-condo/short/script-en.md](../../../scripts/zombie-condo/short/script-en.md) `ZCONDO-SHORT-EN-R3`; both user-approved 28 Oct 2026 (“อนุมัติ R3”, which also authorizes this re-timing) |
| Fact-check | [../../../scripts/zombie-condo/short/fact-check.md](../../../scripts/zombie-condo/short/fact-check.md#recheck-r3), Boat recheck R3 (28 Oct 2026): both `ready-for-storyboard`; four non-blocking advisories, of which two bind this brief (B04 montage cut to the spoken list; B07 canister sound is handling, never an igniter click) |
| Style profile / tier | Survival drama + light fantasy, second person; illustrated 3D (Blender pre-render); licensed low drone from B03 + sparse SFX; outline captions; chrome hidden; comment-prompt cliffhanger; **Full** tier |
| User decisions used | 28 Oct 2026 (Asia/Bangkok), relayed by the coordinator. **Q1:** licensed low drone from B03, ducked under the VO. **Q2:** hide the `ทำไมล่ะ` label and the progress bar on TH and EN. **Q4:** plates stay local and are regenerable from build scripts; no LFS. **Q3/Q5:** “เห็นทั้งตัว มีหน้า เลือด มุมมองในห้องอาจ slice ครึ่ง”, i.e. a full-body "you" with a visible face, blood allowed, and interiors may use a half-slice cutaway. **Film Q-R2-1..3:** “ผู้ชาย / มองกล้อง / ตามนั้น”. **Duration:** 60–80 s, aim ≈65–70 s (“ทำ R3 เลย”) |
| Target / timing | **60–80 s** (user override of the 40–60 s default) at 30 fps, 1080×1920. TH ≈**70.8 s (2,124 frames)**, EN ≈**70.1 s (2,103 frames)**, both **`estimated`** from the R3 beat tables (TH ≈15 cp/s, EN ≈2.7 words/s, plus listed pauses, knocks/silence and the 3.0 s hold). TH Botnoi and EN edge-tts are not yet generated or measured |
| Target checkout | Re-inspected for R3 on `main` @ `9670266` (R2 was inspected on `claude/zombie-condo-reel-script-ade441` @ `f9ee024`); `scripts/zombie-condo/` has uncommitted R3 edits; `storyboards/zombie-condo/` is this brief |
| Scope | Whole Short, beats `ZCONDO-SHORT-S01-B01`–`B10`. No Long. One brief file covers both deliverables: the picture plan is shared and each deliverable has its own timing table ([VD-ZC-TL](#vd-zc-tl--one-shot-plan-two-conforms)) |
| Index | [index.md](index.md) (compact scoped index; no sequence blockout exists yet) |

## Visual intent

- **Audience knowledge and mood:** the viewer is addressed as "you" (คุณ). On screen, "you" is embodied by one recurring character ([VD-ZC-CH](#vd-zc-ch--you-character)). The viewer spots the danger a beat before the VO says it (hook). After that, they watch "you" inside one sealed unit where every tip becomes a physical action. The feeling runs jolt → urgency → small "aha" → grim control → isolation → unease. Only the corridor (B01–B02) and the city (B08) are outward views. Everything else turns inward and quiet.
- **R3 pacing:** the extra ≈12–13 s per language is breathing room, not new picture content. It lands as (a) holds on reactions and states the story already has (the turn landing, the freeze, the dark rooms, him *not* opening the fridge, the city before the VO, the knock silence), and (b) picture for the three restored/qualified lines (spoken container list, freezer upper bound, smoke and fire). No new set, character, prop or claim is added.
- **Look:** stylized 3D illustration, not photoreal: soft, simplified forms, clean materials, readable silhouettes, light film grain. The light fantasy lives in the infected (uncanny posture, faint pale eye-shine) and the city (embers, smoke columns). The survival tips stay grounded and plausible. Blood is allowed within [`VD-ZC-GORE`](#vd-zc-gore--blood-ceiling).
- **Interior device:** a dollhouse **section cutaway** of the unit ([`VD-ZC-CUT`](#vd-zc-cut--section-cutaway)) is used where it shows a spatial relationship that one room view cannot. Examples: "you" and the threat on either side of the door in B02; the blackout running through the rooms in B03; "you" moving room to room through B04–B07; "you" alone against a black, unknowable outside in B09. Inserts and reactions stay in normal perspective.
- **Value/colour key (design targets, not renderer settings):**

| Phase | Beats | Key | Palette direction |
| --- | --- | --- | --- |
| Powered morning | B01–B02 | Corridor: overhead fluorescent strips + bright far-end window backlight; unit: warm practicals + window | Corridor cool cyan-green (`#9fbfb8` midtones), far window warm-white bloom; unit warm neutral (`#d9c7ad`) |
| Blackout day | B03–B07 | Window daylight only, entering from the balcony end (screen-right in the section). Light falls off toward the entry, so **the door end is always the darkest**; bathroom from a frosted louvre window | Desaturated, cooler shadows (`#5d6670`), one warm daylight key; values drop about one stop after B03 |
| Night | B08 | Moonlit sky fill; fires as motivated warm points; rim from fire glow on "you" | Deep navy (`#141b2e`), ember orange (`#e8762c`), smoke grey lit warm from below |
| Day three | B09–B10 | Flat overcast window light; the door end in deep shadow; the corridor side pure black | Lower saturation, slight sick green in shadows |
| Blood (all) | B01–B02 | — | Dark, desaturated, matte red (`#5a1414`–`#7a1c1c`); never glossy bright red |

- **Camera language:**
  - No first-person POV shots ([POV re-check](#pov-re-check-r2)).
  - Perspective over-the-shoulder and close shots show the face and hands. Inserts show objects.
  - Section shots use one long-lens camera family, trucking sideways along the unit.
  - B08 is the one exterior wide.
  - Video plates bake their spatial moves in Blender. Still plates get slow pushes from Remotion `pictureMove`.
  - **R3: every frame is composed for the [caption-safe box](../../../docs/production-requirements.md#vertical-caption-safe-zone)** (`ZC-SCREEN` in [`PROJ-ZC-R3`](#projection-contract-proj-zc-r3)). Captions now sit in the middle of the frame, so faces, key hands and reveal objects stay above y ≈860.
- **Conceal/reveal constraints (story and user decisions, 28 Oct 2026):**
  - The figure is on screen by **2.0 s** (story requirement). **R3 target: F36 (1.2 s)**, tightened from F45 so she reads before the EN VO says "Someone's" (≈1.5 s) as well as before TH “มีคน” (≈2.7 s).
  - The unit door has **no peephole, viewer or door camera** in any shot (`CL05`).
  - **No one outside is ever shown or implied in B09–B10.** In the section, the corridor side is a solid, unlit black cap ([`ZC-CUT-02`](#vd-zc-cut--section-cutaway)). In door-face shots, the door gap and the under-door gap are black, with no light line and no feet shadow. The knock exists in sound only, and the room tone around it contains nothing that suggests a person (no steps, creaks, breathing or voices).
  - The pounding (B02) and the knock (B09) are designed as categorically different sounds ([sound direction](#vd-zc-au--music-and-sfx)).
  - The barricade is a light cabinet that can obviously be moved (`CL02`), never nailed, welded or wedged permanently.
  - No weapons anywhere, including improvised ones held by "you".

<a id="vd-zc-ch--you-character"></a>
## `VD-ZC-CH` — "you" character

Unchanged in R3.

- **Decision:** one recurring adult **man**, **Thai, about 28**, a condo resident who lives alone.
  - Build and height: slim, average, 1.72 m.
  - Face and hair: short black hair, soft rounded stylized features, expressive brows.
  - Clothes: faded dark-teal tee, grey drawstring shorts, barefoot indoors; flip-flops by the door in B01.
  - Day-three variant: the same clothes, now creased and lightly stained; hair messier; light stubble; darker under the eyes.
  - Expressions: neutral/tired, startle, fear, focused, listening, frozen. Faces are fully visible, including in close-ups.
- **Relation to "you":** the VO is second-person narration addressed to the viewer. The man is the viewer's on-screen stand-in.
  - He is never named and never speaks, so no lip-sync is needed.
  - The narration is not his voice.
  - He looks into the lens once, on “คอมเมนต์มา” / "Comment below" in B10 (user decision Q-R2-2), which hands the B10 question from "you" on screen to "you" watching.
- **Why a man:** both narration voices are male (EN edge-tts; TH Botnoi confirmed male, Q-R2-1). This is a casting choice, not a story fact. No beat or reveal depends on gender.
- **Lead rules apply in full:**
  - He is the lead, so his visible artwork must be **≥480 px tall whenever he is in frame**, measured as the minimum across any move (Boss production rules).
  - He needs a rim/edge light in dark shots and a real ground shadow (Blender).
  - Hand-only inserts are not lead-visible shots.
  - He is never injured or bloodied ([`VD-ZC-GORE`](#vd-zc-gore--blood-ceiling)).
- **The infected (`zc-infected`):** an adult **female** neighbour in a long, pale sleep shirt, with long hair partly over her face. The silhouette is deliberately unlike "you". She has a stooped, too-still posture, a slow head turn and faint pale eye-shine. Blood stays within the ceiling.

<a id="vd-zc-gore--blood-ceiling"></a>
## `VD-ZC-GORE` — blood ceiling

User decision (28 Oct 2026): blood is allowed; the level below was confirmed (“ตามนั้น”). Unchanged in R3.

| Allowed | Not allowed |
| --- | --- |
| Dark matte blood on the infected's mouth, chin, hands and shirt front (dried and wet-looking) | Dismemberment, exposed bone, organs or open wounds |
| Smears, handprints, drips and a drag trail on surfaces: the corridor floor, the corridor face of the unit door | Bites, attacks or any injury shown happening; blood spray or splatter events |
| Brief visibility in medium/long shots and the B01 SH02 close (≤ about 1 s with blood as the main subject) | Lingering close-ups on blood or injury; blood on "you" at any point |
| | Blood in or near the B10 hold; blood on the thumbnail frame (recommended) |

- **Where it appears:**
  - B01: on the infected; a smear trail on the corridor floor near her.
  - B02: bloody handprints on the corridor face of the door during the pounding, seen in the section.
  - Not in B03–B10. The corridor face of the door is never seen again after B02.
- **R3 timing check:** B01 SH02 is now 1.6 s in both languages. Blood becomes readable as her face comes round (≈0.5 s into the shot), so it is the main subject for ≤1.1 s; Mark keeps the mouth partly behind hair until the turn completes so the ≤ about 1 s guideline holds.
- **Rules checked:** `docs/production-requirements.md` has no gore rule. It requires safety and licences under every profile ([delivery workflow](../../../docs/delivery-workflow.md#style-profile)).
  - `docs/planned-visual-components.md` says "Creepy, not gory: no blood, wounds, or injury", but that text belongs to the planned `povWatcher` preset design, which this Short does not use. The user's 28 Oct 2026 decision overrides it for these deliverables.
  - The script has no weapons and no violence instructions; this ceiling adds none.
- **Platform:** YouTube's violent/graphic-content and age-restriction policy was **not inspected**, so platform compliance is `unverified` (`RK-10`). The coordinator or Boat may verify the current policy before release.

<a id="vd-zc-cut--section-cutaway"></a>
## `VD-ZC-CUT` — section cutaway

The unit is built so one long side can be **cut away**, showing the rooms side by side like a dollhouse. Cut surfaces are filled with solid wall-cap geometry ("poché").

- **`ZC-CUT-01` Layout along the section, screen-left → right:** corridor (1.8 m) | entry (door, cabinet; 1.5 m) | bathroom (shower-only; 1.8 m) | kitchenette (sink, fridge, counter, shelf; 2.4 m) | living (3.5 m) | balcony (1.5 m) | outside. About 12.5 m in total.
  - This linear plan is a stylization (`design choice`). It lets a sideways truck through B04–B07 run in one direction toward the balcony and B08.
  - The door wall is seen **edge-on** in section, as a thin vertical slab with the cabinet against it. The door's face (and its lack of a peephole) is shown only in perspective shots.
- **`ZC-CUT-02` Corridor rule:**
  - **B02 is the only shot with the corridor cut open.** Corridor and unit are seen on either side of the door wall, cool fluorescent on the left and warm on the right.
  - From B03 on, the corridor zone is **closed by an unlit solid cap**: the corridor's near wall stays intact, black, with no texture, light leak or gap.
  - Nothing is ever rendered behind it, so the knocker cannot be seen even by a frame-step. The story reading: while the threat was known we could see it; after that, outside is unknowable.
  - The switch from open to closed happens across a cut between non-section shots (B02 SH03 close → B03 section framed right of the door wall). It never happens within a shot.
- **`ZC-CUT-03` Building stack (R3 revised for the caption-safe box):** the unit floor line sits at **y ≈860** in every section frame (see `CAM-SECTION`), so the unit occupies the upper part of the portrait frame and the floor slab plus **the neighbour units below** fill y ≈860–1920. They are simple dressed shapes with **no people**. They go dark with the unit in B03 (“ทั้งตึก”) and stay dark afterwards. The slab and the dark lower slices sit behind the caption band and the platform UI, which gives the outline captions a dark, quiet background. Only a sliver of the unit above (≤ about 0.3 m) may show at the top edge; it follows the same lit/dark states.
- **`ZC-CUT-04` Section light:**
  - Light is motivated by the windows and practicals.
  - A soft "open-side" fill from the camera side lifts the interior. It stays a stylized device, at least 1.5 stops below the window key, so the blackout still reads.
  - Caps are matte, unlit-looking dark (`#1c1f24`) with a thin warm-grey edge line. They take no window light and no emission.
- **Per-beat evaluation:**

| Beat | Section? | Reason |
| --- | --- | --- |
| B01 | **No** | The hook is depth down a corridor; a section flattens it |
| B02 | **Yes**, one shot (SH02) | Shows the infected pounding and "you" barricading in one frame; the door between them is the whole beat |
| B03 | **Yes** | The blackout runs through the rooms left to right and through the neighbours below: "ทั้งตึก" in one image |
| B04–B07 | **Yes**, one master move per beat | A sideways truck carries "you" from room to room: bathroom (B04–B05) → kitchenette (B06–B07) → living, ending at the balcony door. Each truck goes further right, so it is progression, not repetition. Inserts carry the details |
| B08 | **No** | Exterior wide |
| B09 | **Yes** (SH01, SH03) | "You" inside, with the black corridor cap where the knocker is; isolation and concealment together |
| B10 | **No** | The hold needs the door's face (no peephole) and "you"'s face; perspective interior |

## Visual progression

| Scene / beat refs | Visible action | Information / emotional change | Visual form and reason | Repetition / reason to return |
| --- | --- | --- | --- | --- |
| B01 | Over his shoulder: he pulls the door open, trash bag in hand; a still woman stands at the far end of the corridor (readable by F36); long-lens cut as she turns, blood at her mouth; **R3:** the completed turn holds ≈0.4/0.3 s (TH/EN), her eye-shine on him, before the slam | Normal life → outbreak; the viewer spots her before the VO names her | **Reveal** through depth: long corridor, backlit silhouette, then a compressed long-lens close that lands on a stare | Corridor perspective never returns |
| B02 | His face as he slams and bolts; section: she pounds and leaves bloody handprints on one side of the door while he drags the cabinet flush on the other; close: he freezes, back to the cabinet, **R3:** held ≈0.6/0.5 s with only the pounding audible | Corridor closed; sound rule planted (`CL01`, `CL02`, `CL04`) | **Action + simultaneous geography** (section); the freeze is the only still moment | The door/cabinet returns in B09–B10, now with the outside sealed black |
| B03 | Section: lights die room by room, then in the neighbour slices below; **R3:** the dark state holds ≈0.8/0.6 s in near-silence | Power gone, building-wide; every clock starts | **Event** across space; the held dark frame is the new normal | Section language established for B04–B09 |
| B04 | Section truck into the bathroom: shower tap still running; generic tower diagram (pump → roof tank → pipes; power cut stops the pump; the tank level drains); **R3:** fill inserts cut in spoken order to “ถัง หม้อ ขวด” / "buckets, pots, bottles", then lids on | Water becomes a finite stock | **Demonstration + diagram** (`ZC-C01`, `ZC-C02`, `ZC-C03`, `ZC-C15`); flat schematic, so it reads as explanatory | Verb: *fill* |
| B05 | Same bathroom, toilet end: bottles on the basin, bucket by the toilet; bucket poured from a little height; cistern lid lifted in the pause, clear water; red cross over the bowl; back to the clear cistern for the conditions | The cistern "aha" | **Reveal** (lid lift) + one correction mark (`ZC-C05`, `ZC-C07`, `ZC-C08`, `ZC-C21`) | Verb: *discover*; the camera has moved along the room, not repeated it |
| B06 | Truck into the kitchenette; **R3:** he stands at the shut fridge through both hold times, hand hovering then withdrawn (the closed door is the instruction); one quick open, the fridge light does **not** come on, he takes ready-to-eat items; order device fridge → freezer → cans | Food plan fixed by the clock | **Comparison/order device** over an action of restraint (`ZC-C10`, `SRC022`) | Verb: *sort*; the dead fridge light restates the blackout |
| B07 | Close: he reaches for the boxed camp stove, stops, slides it back unlit; his face as the CO line lands; the section truck continues to the living room, where he sits with bread, fruit, nuts and a can; the balcony door is ahead | Cooking removed; the danger is the stove, not the zombie | **Refusal gesture**: an action that stops (`ZC-C13`; `ZC-C14` visual constraint) | Verb: *refuse*; ends at the balcony door and hands off to B08 |
| B08 | Night balcony; **R3:** ≈0.5/0.4 s of night picture and wind before the VO; slow spatial push-out past the railing over a blacked-out generic city; the main fire-and-smoke cluster enters frame on “มีแต่ควันกับเปลวไฟ” / "Only smoke and fire."; he stands in silhouette | Scale of collapse; rescue hope gone | **Spatial reveal**, the only exterior wide (fiction, `ZC-C19`) | Unique; the emotional low |
| B09 | Section, day three: he sits on the floor near the entry; two buckets, cans and a phone around him; counters tick down; close on his face as the knocks land; **R3:** cut into the section hold inside the ≈1.5 s silence, the black corridor cap left of the door | A new unknown at the door (`CL03`) | **Inventory + reaction + concealment**: the knocker's side is visibly *nothing* | Returns to the B02 composition with the outside now black |
| B10 | Perspective from inside: the plain door face (no peephole), cabinet, him standing between; the question with three choice labels; he turns his head from the door to the lens on “คอมเมนต์มา” / "Comment below" and holds it through the 3.0 s hold | Decision handed to the viewer | **Held composition + fourth-wall glance** | Ends on the image the story built toward |

Repetition check (unchanged in substance by R3):
- The four tip beats B04–B07 share one master device, the section truck, and each moves further right through a different room.
- Each has a different verb (fill, discover, sort, refuse) and a different explanatory form (diagram, mark, order device, none).
- Overlays appear in B04, B05 (one mark), B06 and B09–B10, each in a different form.
- No claims are added by visuals. The diagram is generic and schematic. The R3 holds add time to existing states only; none repeats an action already shown.

## Scene decisions

Shot IDs below are **shared by both deliverables**, `ZCONDO-SHORT-S01-Bxx-SHyy`, and are **unchanged from R2**. Mark may split, merge or reorder shots within a beat (routine refinement) while keeping the decision ID. "Video" means a Blender video plate; "still" means a Blender still plate + Remotion `pictureMove`. All framing below obeys `ZC-SCREEN` ([`PROJ-ZC-R3`](#projection-contract-proj-zc-r3)): no faces, key hands, reveal objects or counted props in the caption zone y 860–1248 or below it.

| Scene / beat refs | Decision ID | Set / actors / props / effects medium | Framing / camera intent (1080×1920) | Light / shadow / color | Why / fallback |
| --- | --- | --- | --- | --- | --- |
| All | `VD-ZC-00` | **Hybrid: Blender pre-rendered plates + Remotion screen layer.** All sets, characters and props are 3D in Blender, rendered to stills or short video plates. Remotion owns timeline, VO, captions, overlays, SFX/music and export | Plates rendered natively in portrait at 1080×1920 (no crop from landscape) | Blender owns all scene light and shadow; Remotion adds no light | Unchanged: an `existing-integrated` media path (now also proven on `main` by POOLDEPTH Blender clips); GLB/Three.js is `missing` ([feasibility](#blender-feasibility-and-runtime-status)). Fallback: all-still plates + `pictureMove` |
| B01 | `VD-ZC-01` (R3) | `zc-corridor`, `zc-you`, `zc-infected` (blood: mouth, chin, shirt; smear trail on the floor). SH01 video, SH02 video | SH01 **OTS** behind his right shoulder (head/shoulder in the left-third foreground, head y ≈300–700, ≥480 px), vFOV ≈55°. He pulls the inward door open (the door may already be ajar at F0). The infected stands ≈12 m away by the far window, her figure around y ≈560–820, a readable silhouette by **F36** (hard limit F60). SH02 long lens (vFOV ≈18°) on her head/shoulders, face above y 860; the turn starts on "แล้วมันก็หันมา" / "Then it turns" and completes ≈0.4/0.3 s before the B02 cut; blood readable ≤ about 1 s | Fluorescent strips, one flickering (seeded, baked); the far window backlights her into a hard silhouette with a thin rim; faint eye-shine on the turn | OTS introduces "you" and keeps the depth reveal. Fallback: SH01 as a still + `pictureMove`, keeping the F36 visibility |
| B02 | `VD-ZC-02` (R2, re-timed) | `zc-unit` entry + **section with the corridor open** (`ZC-CUT-02`), `zc-you`, `zc-infected`, `zc-cabinet`, blood handprints (corridor face only). SH01 video, SH02 video, SH03 still | SH01 close, profile from the hinge side: his startled face + hand slamming and bolting on "ปิด! ล็อก!" / "Shut it. Lock it."; the first pound hits while we are still on him. SH02 **section** (`CAM-SECTION`), framed on corridor \| door wall \| entry: she pounds and handprints appear on the corridor side; he drags the cabinet flush on the other side; the cabinet's lightness reads (one-arm drag, a wobble) under the "clears fast" line (trimmable plate; absorbs EN +0.8 s). SH03 close, low angle: back to the cabinet; he freezes, eyes up, on "พวกมันตามเสียง" / "they follow sound" and holds the freeze ≈0.6/0.5 s | Corridor cool and lit, unit warm; the door wall cap divides the two palettes; real contact shadows | The section shows threat and barricade in one frame. Fallback: SH02 as an interior perspective door shudder with off-screen pounding |
| B03 | `VD-ZC-03` (R3) | Section framed right of the door wall (corridor not in frame), with the neighbour slices below (`ZC-CUT-03`). 2–3 stills | Static `CAM-SECTION` frame (lead ≥480 px); motion is the light event | Practicals die room by room left → right on "ไฟก็ดับ" / "power dies", then the neighbour slices; window-only daylight remains and **holds ≈0.8/0.6 s** before B04 | Stills swapped with `media` `startSec`/`endSec` (existing fields) give a frame-exact cascade of ≈0.7–0.9 s plus the held dark state. Fallback: hard cut lit → dark |
| B04 | `VD-ZC-04` (R3) | SH01 section truck into the bathroom (video). SH02 **2D screen-space diagram** of a generic tower drawn in section style, over a darkened blurred still. SH03 fill inserts (perspective video): bucket at the shower tap, pot, bottles at the basin, **in spoken order**. SH04 lids-on still: **four buckets**, one pot, six bottles | SH01 `CAM-SECTION` truck right from the entry into the bathroom; the tap in the shower is running; may enter mid-truck (`trimStartSec`). SH02 diagram inside x 120–888, y 300–850, built step by step on the mechanism lines (tower + tank → pump arrow up → "power out" + pump stops → tank level drains → level low, no refill arrow). SH03 inserts open in the pause after "หมดแล้วไม่มีใครเติม" / "...all there is." with the bucket; each later cut lands on or just before its word; **minimum 12 frames per insert**; objects centred y ≈400–800, high angle. SH04 carries “แล้วปิดฝา” / "And cover it." | Frosted louvre window top light + open-side fill; water with a bright rim | The diagram must read as explanatory, not as a photo of a real building. **Bucket, pot and bottles must all be shown**, now cut to the spoken list (Boat `FC-TH-04c`, `FC-EN-04c`, R3 advisory). If measured TH audio makes the pot/bottle inserts shorter than 12 frames, merge them into one basin insert (pot and bottles together) cut on “หม้อ”. Fallback: inserts as stills |
| B05 | `VD-ZC-05` (R3) | Bathroom (shower-only, no bathtub; toilet with cistern). SH01 still (section or perspective, Mark's choice), SH02–SH03 perspective video; Remotion red cross + two condition icons | SH01: bottles on the basin, bucket at the toilet, him beside them. SH02 side angle: bucket (visibly ≥4–5 L) poured into the bowl from ≈0.4 m; the gurgle on "มันลงเอง" / "if it drains". SH03 high OTS: **the cistern lid lifts inside the planned pause** (TH: before “ส่วนน้ำสะอาดสำรอง”; EN: on "Spare clean water?"), clear water, **no blue tablet**, revealed on the TH line head / EN "The toilet tank"; cut to the bowl with the red cross on "ไม่ใช่ในโถ" / "not the bowl"; **cut back to the clear cistern** for the conditions line with the clear-drop and no-chemical icons (the conditions describe the cistern water) | Frosted window top light; tiles cool; water clear, cyan tint | Discovery beat. Fallback: SH02/SH03 as stills |
| B06 | `VD-ZC-06` (R3) | SH01 section truck into the kitchenette (video) **ending in an in-plate hold at the shut fridge**, then fridge perspective shots: SH02 video (quick open), SH03 still (counter top-down); Remotion cold clock + order device | SH01 truck ends with him at the shut fridge; through the two hold times his hand hovers near the handle and withdraws on the freezer line (acting, baked). The clock device sits in y 300–560: line 1 on the fridge line, line 2 on the freezer line, each with a pulse tick in the planned rest. SH02 quick open on "ของในตู้เย็นที่กินได้เลย" / "Ready-to-eat": the interior **stays dark (no fridge light)**, he takes ready-to-eat items, the door shuts. SH03 items in order, fridge items → freezer items → cans; a can set down on "กระป๋องไว้ท้ายสุด" / "cans last" | Window light grows as the truck moves right; the fridge interior is dark but legible by spill | **Ready-to-eat only; no raw meat, fish or eggs shown being taken or eaten.** Film recommends keeping raw items out of frame entirely. The R3 hold turns the added rests into the instruction "keep it shut". Fallback: SH02 as two stills |
| B07 | `VD-ZC-07` (R3) | `zc-camp-stove` (unbranded, in its carry case, canister **not** mounted, no pot anywhere near it). SH01 perspective video (hands + his face), SH02 section truck to the living room (video) | SH01 close: he reaches to the cased stove on a shelf, stops on "ห้ามจุดในห้อง" / "Never indoors" (held ≈0.3 s in TH), slides it back; **R3:** stays on his face as "คาร์บอนมอนอกไซด์" / "Carbon monoxide" lands. SH02 section truck right: he sits in the living room with bread, fruit, nuts and a pull-tab can on "กินของที่ไม่ต้องปรุงแทน" / "Eat no-cook food"; the balcony door stays ahead at the right edge | Neutral daylight; no flame, glow or ignition light anywhere | **Never lit, never with a pot over the canister** (`ZC-C13`, `ZC-C14`). The canister sound is handling only, never an igniter click (Boat R3 advisory). Optional icon-only overlay: crossed flame + CO, in `ZC-TEXT`. Fallback: SH02 as a still |
| B08 | `VD-ZC-08` (R3) | `zc-unit` balcony + `zc-city` (generic towers, no landmarks/brands, scattered fires, smoke, embers), `zc-you`. 1 video plate | Starts behind him at the railing during the ≈0.5/0.4 s ambience lead-in, then a slow spatial push-out and slight rise past the railing (vFOV ≈60°). **The main fire-and-smoke cluster enters frame at a fixed plate time** that each language trims onto “มีแต่ควันกับเปลวไฟ” / "Only smoke and fire.". He stays in the right-third foreground (x ≤880), ≥480 px tall throughout, head above y 860, face in a fire-lit three-quarter profile at the start. The brightest fires sit above y 860; the lower frame is dark city for caption contrast | Moon fill from upper left; fire-glow rim on him; smoke lit warm from below; city windows all dark | Parallax is the point; the restored line now has its picture anchor. Fallback: single still push |
| B09 | `VD-ZC-09` (R3) | SH01 section still: day three, `zc-you` day-3 variant, **two buckets**, cans, phone; corridor cap black (`ZC-CUT-02`); Remotion day card + counters. SH02 perspective still or video: close on his face. SH03 section still: the SH01 framing tightened | SH01 `CAM-SECTION` on entry \| bathroom, him sitting against the wall at screen-left (head ≈y 560–700), buckets/cans/phone beside him above the floor line; counters in `ZC-TEXT` over the bathroom wall (x ≈480–888, y 300–620): bucket icons 4 → 2, cans 6 → 4, battery → 12%, one tick per count word. SH02 close on his face from "แล้วก็มีเสียงเคาะประตู" / "Then, a knock." through the three knocks: his eyes go to the door (screen-left) on the first knock. SH03 **cut in the silence** (≈0.1 s after the last knock) to a slow `pictureMove` push on the section: him, the edge-on door, the cabinet, and to the left nothing but black; "พวกมันไม่เคาะ" / "They don't knock." lands ≈1.5 s after the knocks end | Flat overcast; the entry in deep shadow; a rim on him; the cap pure black | The counters carry the exact VO quantities. **Water counter uses bucket icons.** No rationing cue (`ZC-C22`). The black cap makes concealment structural. A cut inside true silence is the beat's strongest edit. Fallback: SH02 skipped (section only) |
| B10 | `VD-ZC-10` (R3) | Perspective interior still/video facing the **door face** (plain, no peephole), cabinet against it, `zc-you` standing in the foreground; Remotion question + three choice labels | Him right of centre in the foreground (face x ≈560–880, y ≈400–760; ≥480 px), three-quarter back to camera, looking at the door; very slow push (≤2 % over the 6.2/6.7 s). Choice labels stacked at the left in `ZC-TEXT` (x 120–540, y 320–780), each appearing as it is spoken. On "คอมเมนต์มา" / "Comment below" he turns his head to look into the lens and **holds the look through the 3.0 s hold** | Day-three overcast; the door in the darkest value band; door gap and under-door gap black, no light line or shadow | The face hands the decision over (user decision Q-R2-2). Cost option: a still for the question part and a short video plate from ≈0.5 s before the glance to the end (two `media` clips with `startSec`/`endSec`). Ending: `A_fade` or hard cut (Editor); not a loop |
| Overlays | `VD-ZC-OV` (R3) | Remotion screen-space overlays: B04 diagram, B05 cross + icons, B06 cold clock / order device, B07 optional icon, B09 day card + counters, B10 choice labels | **R3:** screen space outside `pictureMove`, inside `ZC-TEXT` (x 120–888, y 288–850), never under the caption band; in section shots, over walls or ceiling areas, not over his face | Style "survival notes": warm-white strokes `#f2ede4`, amber accent `#f2a541`, danger red `#e5484d`, dark panel `#10151a` at ≈70 % | One owner draws each overlay once (lesson from `DF-20261027-catbox-short-home-stage`). Text per deliverable language; icons shared |

<a id="pov-re-check-r2"></a>
### POV re-check (R2, unchanged in R3)

- **B01: POV → OTS.** The user wants "you" seen whole and with a face. Opening on his shoulder and head introduces the stand-in in the first frame, keeps the corridor-depth reveal and meets the lead-size rule. The reaction moves to B02 SH01, his face at the slam.
- **B09–B10: POV push → section + face close + door-face hold.** The section shows him, the barricade and the black outside in one image, which makes concealment structural rather than a matter of camera angle. His face close carries the listening beat. B10 needs the door face for the no-peephole rule.
- **Result:** no POV shots. That is within the POV defaults, which say POV is optional. If Mark wants one eyeline insert of the door at his eye height after SH02 in B09, it is allowed as a routine refinement. It must keep the gap black.

## Shared picture for TH and EN

<a id="vd-zc-tl--one-shot-plan-two-conforms"></a>
### `VD-ZC-TL` — one shot plan, two conforms

Both deliverables use **the same shots, shot order, plates and overlay designs**. Each deliverable gets its own executable timeline, narration, caption cues and cut points, as the delivery workflow requires. Per-beat lengths differ by up to 2.1 s, so one locked set of cut frames would leave gaps or overlaps. Filling those gaps with silence or speeding up the VO is not allowed. **Timing forces a split of cut points only; the picture content does not split.**

Estimated beat durations (s), from the R3 scripts (R2 values for reference):

| Beat | TH R3 (R2) | EN R3 (R2) | EN − TH | Where the R3 time lands / how the picture absorbs the difference |
| --- | --- | --- | --- | --- |
| B01 | 5.1 (4.4) | 4.7 (4.1) | −0.4 | Turn-landing hold in SH02 (+0.4/0.3 s). SH01 trimmed at its tail per language; the SH02 turn is anchored to the turn line |
| B02 | 6.6 (5.6) | 8.7 (7.6) | **+2.1** | Freeze hold in SH03 (+0.6/0.5 s). The SH02 section plate (pounding + cabinet, rendered long) and the SH03 freeze still absorb the EN difference; SH01 keeps its action length |
| B03 | 2.0 (1.1) | 2.1 (1.4) | +0.1 | Held dark state after the cascade (+0.8/0.6 s) |
| B04 | 11.0 (9.4) | 12.9 (10.7) | +1.9 | Spoken container list + mechanism → action pause. Diagram hold, then the insert run and the lids-on still (EN SH04 holds 1.1 s on "And cover it.") |
| B05 | 9.4 (8.4) | 9.9 (9.0) | +0.5 | Lid-lift pause in SH03. SH01 still hold |
| B06 | 9.0 (7.3) | 7.0 (5.8) | **−2.0** | "อย่างมาก" / "tops" + rests after each hold time → the in-plate hold at the shut fridge. The SH01 plate is trimmed at its head (`trimStartSec`) for EN; SH03 still trimmed |
| B07 | 5.9 (5.3) | 4.8 (4.5) | −1.1 | Stop hold (TH +0.3 s); SH01 stays on his face into the CO line. The SH02 truck plate is trimmed at its tail |
| B08 | 5.0 (3.1) | 4.5 (2.4) | −0.5 | Ambience lead-in + the restored smoke/fire line. The plate is trimmed per language so the fire cluster lands on that line. `RK-09` (EN too short) is closed |
| B09 | 10.6 (7.5) | 8.8 (6.2) | −1.8 | Count rests (TH), knock silence 1.0 → **1.5 s**, a short hold after "พวกมันไม่เคาะ". SH01 counter hold absorbs the difference; knock and silence timing is identical in both |
| B10 | 3.2 + 3.0 hold (3.0 + 3) | 3.7 + 3.0 hold (3.4 + 3) | +0.5 | The head turn is anchored to the last spoken line per language; the 3.0 s hold follows |
| **Total** | **≈70.8 s** (≈58 s) | **≈70.1 s** (≈58 s) | −0.7 | |

#### Per-shot timing (composition seconds and frames, `estimated`)

Mark refines these within each beat (routine); beat boundaries come from the scripts and change only when Preaw re-times or measured audio arrives.

| Shot | TH s (frames) | TH dur | EN s (frames) | EN dur |
| --- | --- | --- | --- | --- |
| B01-SH01 | 0.0–3.5 (0–105) | 3.5 | 0.0–3.1 (0–93) | 3.1 |
| B01-SH02 | 3.5–5.1 (105–153) | 1.6 | 3.1–4.7 (93–141) | 1.6 |
| B02-SH01 | 5.1–6.0 (153–180) | 0.9 | 4.7–6.2 (141–186) | 1.5 |
| B02-SH02 | 6.0–9.6 (180–288) | 3.6 | 6.2–10.6 (186–318) | 4.4 |
| B02-SH03 | 9.6–11.7 (288–351) | 2.1 | 10.6–13.4 (318–402) | 2.8 |
| B03-SH01 | 11.7–13.7 (351–411) | 2.0 | 13.4–15.5 (402–465) | 2.1 |
| B04-SH01 | 13.7–15.3 (411–459) | 1.6 | 15.5–17.4 (465–522) | 1.9 |
| B04-SH02 | 15.3–22.2 (459–666) | 6.9 | 17.4–25.1 (522–753) | 7.7 |
| B04-SH03 | 22.2–24.3 (666–729): bucket 22.2–23.5, pot 23.5–23.9, bottles 23.9–24.3 | 2.1 | 25.1–27.3 (753–819): bucket 25.1–26.4, pot 26.4–26.8, bottles 26.8–27.3 | 2.2 |
| B04-SH04 | 24.3–24.7 (729–741) | 0.4 | 27.3–28.4 (819–852) | 1.1 |
| B05-SH01 | 24.7–26.4 (741–792) | 1.7 | 28.4–30.0 (852–900) | 1.6 |
| B05-SH02 | 26.4–28.5 (792–855) | 2.1 | 30.0–33.1 (900–993) | 3.1 |
| B05-SH03 | 28.5–34.1 (855–1023): cistern 28.5–31.7, bowl 31.7–32.4, cistern 32.4–34.1 | 5.6 | 33.1–38.3 (993–1149): cistern 33.1–35.0, bowl 35.0–35.8, cistern 35.8–38.3 | 5.2 |
| B06-SH01 | 34.1–39.8 (1023–1194) | 5.7 | 38.3–43.0 (1149–1290) | 4.7 |
| B06-SH02 | 39.8–41.9 (1194–1257) | 2.1 | 43.0–44.5 (1290–1335) | 1.5 |
| B06-SH03 | 41.9–43.1 (1257–1293) | 1.2 | 44.5–45.3 (1335–1359) | 0.8 |
| B07-SH01 | 43.1–46.3 (1293–1389) | 3.2 | 45.3–47.6 (1359–1428) | 2.3 |
| B07-SH02 | 46.3–49.0 (1389–1470) | 2.7 | 47.6–50.1 (1428–1503) | 2.5 |
| B08-SH01 | 49.0–54.0 (1470–1620) | 5.0 | 50.1–54.6 (1503–1638) | 4.5 |
| B09-SH01 | 54.0–59.2 (1620–1776) | 5.2 | 54.6–58.0 (1638–1740) | 3.4 |
| B09-SH02 | 59.2–62.0 (1776–1860) | 2.8 | 58.0–60.6 (1740–1818) | 2.6 |
| B09-SH03 | 62.0–64.6 (1860–1938) | 2.6 | 60.6–63.4 (1818–1902) | 2.8 |
| B10-SH01 | 64.6–70.8 (1938–2124); VO to 67.8, hold 67.8–70.8 | 6.2 | 63.4–70.1 (1902–2103); VO to 67.1, hold 67.1–70.1 | 6.7 |

Basis: per-line estimates at ≈15 Thai code points/s and ≈2.7 words/s from [tts-th.txt](../../../scripts/zombie-condo/short/tts-th.txt) and [tts-en.txt](../../../scripts/zombie-condo/short/tts-en.txt), plus each script's listed pauses, placed inside the script's beat boundaries. Short words inside a line (list items, "ปิด", "ล็อก") are interpolated by character/word share and are the least reliable numbers here.

#### Sync anchors (per language, word-locked, `estimated` composition seconds)

| Anchor | TH | EN | Picture / sound event |
| --- | --- | --- | --- |
| Door open | 0.0 | 0.0 | F0, picture-locked; corridor hum from F0 |
| Figure readable | ≤1.2 (F36) | ≤1.2 (F36) | Picture-locked, same in both; hard limit 2.0 s |
| Turn starts | 3.73 “แล้วมันก็หันมา” | 3.33 "Then it turns." | SH02 head turn; the sub riser ends when the turn completes (≈4.6 / ≈4.3) |
| Slam / bolt | 5.1 “ปิด!” / ≈5.3 “ล็อก!” | 4.7 "Shut it." / ≈5.4 "Lock it." | Slam accent; deadbolt clack |
| Pounding starts | ≈5.6 “มันทุบประตูไม่หยุด” | ≈6.2 "It's pounding." | First pound may hit up to ≈0.2 s before the word |
| Cabinet scrape | ≈6.8 “ลากตู้มาดัน” | ≈6.9 "Barricade it" | SH02 drag starts |
| Freeze | ≈10.2 “พวกมันตามเสียง” | ≈11.9 "they follow sound" | SH03 freeze; the B02 pulse layer cuts; only the pounding remains for 0.6 / 0.5 s |
| Light cascade | ≈12.0 “ไฟก็ดับ” → ≈12.5 “ทั้งตึก” (neighbours) | ≈14.0 "power dies" → ≈14.6 (neighbours) | Power-down whoomp; pounding fades over ≈0.8 s |
| Tap running | 13.7 | 15.5 | First sound after the silence |
| Pump stops | 17.8 “ไฟดับ ปั๊มก็หยุด” | 20.3 "No power, no pump." | Diagram step 3 |
| Tank drains | 18.8 “น้ำที่ยังไหล…” | 21.8 "What's left in the tank" | Diagram step 4 |
| Clock pulse enters | 20.9 “หมดแล้วไม่มีใครเติม” | ≈24.0 "all there is" | Pulse layer starts |
| Container list | ≈23.4 ถัง / ≈23.6 หม้อ / ≈23.9 ขวด | ≈26.2 buckets / ≈26.5 pots / ≈26.9 bottles | Insert cuts on or just before each word |
| Lid clicks | ≈24.1–24.7 “แล้วปิดฝา” | 27.3–28.4 "And cover it." | Three lid clicks; SH04 |
| Pour / gurgle | 26.4 “เทแรงทีเดียว” / ≈28.0 “มันลงเอง” | ≈30.6 "one hard pour" / ≈32.3 "if it drains" | SH02 |
| Cistern reveal | lid lift 28.5–28.9 (pause), reveal + chime 28.9 | lid lift 33.1 "Spare clean water?", reveal + chime ≈34.3 "The toilet tank" | SH03 |
| Bowl cross | 31.8 “ไม่ใช่ในโถ” | ≈35.0 "not the bowl" | Red cross |
| Hold-time ticks | ≈36.0 “ราวสี่ชั่วโมง”; ≈38.6 “อย่างมากราวสองวัน” | ≈39.4 "about four hours"; ≈41.6 "about two days, tops" | Clock device lines 1–2; hand withdraws on the freezer line |
| Quick open / can down | 39.8 “ของในตู้เย็นที่กินได้เลย” / 41.9 “กระป๋องไว้ท้ายสุด” | 43.0 "Ready-to-eat" / ≈44.6 "cans last" | SH02 / SH03 |
| Hand stops | ≈44.2 “ห้ามจุดในห้อง” | ≈46.0 "Never indoors." | Low stinger; no ignition sound |
| Night lead-in | 49.0–49.5 | 50.1–50.5 | Wind only, picture moving |
| Fire cluster | 51.7 “มีแต่ควันกับเปลวไฟ” | 52.0 "Only smoke and fire." | Fixed plate time, trimmed per language |
| Counters | 54.0 day / 54.8 buckets / 55.9 cans / 57.5 battery | 54.6 / 55.3 / 56.1 / 56.8 | One dry tick per step |
| Knocks | 60.7–61.9 | ≈59.3–60.5 | Three knocks ≈0.45 s apart, identical in both |
| Silence | 61.9–63.4 (1.5 s) | ≈60.5–62.0 (1.5 s) | Cut to SH03 ≈0.1 s into it; all music out |
| Story rule | 63.4 “พวกมันไม่เคาะ” | ≈62.0 "They don't knock." | Low sub hit (the Short's one main hit) |
| Choice labels | as spoken, 64.6–67.1 | as spoken, 63.4–66.4 | Labels appear in order |
| Lens glance | 67.1 “คอมเมนต์มา” | 66.4 "Comment below." | Head turn to the lens, held |
| Closing hold | 67.8–70.8 | 67.1–70.1 | Near-silent; ending per Editor |

Rules:

1. **Sync anchors are per language and word-locked** (table above). Only F0 and the F36 figure visibility are picture-locked and shared.
2. **Plates are rendered with handles:** video plate length = the longer language's shot share + 0.5 s head + 1.0 s tail. Section trucks run at constant speed through their middle so either end can be trimmed; B06 SH01 ends in a baked hold, so it is trimmed at its head only. Editor conforms with `trimStartSec` and `endSec`. **Final plate lengths are confirmed only after the measured TH Botnoi and EN edge-tts audio exist**, then re-rendered if needed. Measured word times can come from `scripts/transcribe.py` (faster-whisper, local QA tool; rough word times that need review).
3. **Stills absorb timing; video plates hold action.**
4. **Pauses assume line-by-line TTS clips** (script TH Q5 / EN Q-EN3), so they can be placed in the timeline. If Editor receives a single take, Editor confirms that the pauses can still be cut in before plates are re-rendered to measured timing.
5. Overlays use the same layout per deliverable with language-specific text (below). Numerals and icons are identical.

Video plate lengths for Boss (`S-10`), from the rule above (`estimated`):

| Plate | Length | Plate | Length |
| --- | --- | --- | --- |
| B01-SH01 | 5.0 s | B05-SH03 cistern | 4.7 s (bowl and return as stills from the same set-up) |
| B01-SH02 | 3.1 s | B06-SH01 | 7.2 s |
| B02-SH01 | 3.0 s | B06-SH02 | 3.6 s |
| B02-SH02 | 5.9 s | B07-SH01 | 4.7 s |
| B04-SH01 | 3.4 s | B07-SH02 | 4.2 s |
| B04-SH03 bucket / pot / bottles | 2.8 / 1.9 / 2.0 s | B08-SH01 | ≈6.8 s (extra 0.3 s for the per-language anchor offset) |
| B05-SH02 | 4.6 s | B09-SH02 (if video) | 4.3 s |
| | | B10-SH01 | 8.2 s (or ≈5.2 s video + a still) |

Total ≈68–75 s of video plate (≈2,050–2,260 frames) plus ≈12 stills. This is about 1.6× the R2 estimate of ≈40–45 s: R3 adds ≈12 s of picture, and the R2 figure was low.

### Per-deliverable on-screen text (overlays only; captions follow the VO verbatim)

| Overlay | TH | EN |
| --- | --- | --- |
| B04 diagram labels | ปั๊ม · ถังบนดาดฟ้า · ไฟดับ | Pump · Roof tank · Power out |
| B06 cold clock / order (**R3**) | ตู้เย็น (ไม่เปิด) ราว 4 ชม. · ช่องแช่แข็งอัดแน่น อย่างมากราว 2 วัน · กระป๋อง ท้ายสุด | Fridge shut: about 4 h · Full freezer: about 2 days, tops · Cans last |
| B09 day card + counters | วันที่ 3 · bucket icon ×2 · can icon ×4 · battery 12% | Day 3 · same icons · 12% |
| B10 choice labels | เปิดประตู · ส่งเสียงตอบ · เงียบไว้ | Open the door · Call out · Stay silent |

Overlays draw original vector icons; counters show numerals beside the icons. **R3:** the B06 labels now mirror the VO qualifiers and conditions: "อย่างมาก" / "tops" (the upper bound added in R3), and the closed-door and full-freezer conditions ("ไม่เปิด", "อัดแน่น" / "shut", "Full") that the R2 labels left out. All label text uses the VO's own words. **Preaw and Boat check the changed B06 TH and EN label wording** before Editor uses it; if they prefer the R2 short labels, the minimum change is adding "อย่างมาก" / "tops".

<a id="vd-zc-au--music-and-sfx"></a>
## Sound direction (`VD-ZC-AU`)

R3 takes Preaw's new per-beat **sound intent** notes, Boat's R3 sound review and the user's music decision Q1. Where they disagree, the user decision governs (see the B01–B02 note). Library: [`sound-library/INDEX.md`](../../../../sound-library/INDEX.md) (outside the repo, `/Users/mangkornkatawong/Documents/ChatGPT/sound-library/INDEX.md`), checked 28 Oct 2026: 39 files, **none listened to by a human yet**.

### Music

- **Family:** one licensed low drone bed with no melody (user decision Q1). Unmetered. Energy is shaped by layers, not tempo:
  - **Bed:** the drone alone.
  - **Build:** the drone + a soft **clock pulse** (a muffled tick at about 60–70 per minute, slower than speech) for the water/food clock in B04–B07.
  - **Drop:** everything out in B09 before the knocks.
- **Arc:**
  - B01–B02: **no music** (user decision). Diegetic sound carries the hook.
  - B03: the drone fades in only in the last ≈0.3 s of the held silence, so the silence stays the beat.
  - B04–B06: drone bed; the clock pulse enters on “หมดแล้วไม่มีใครเติม” / "all there is" and marks the two hold times in B06. Mid → mid-low.
  - B07: the pulse thins out under “ฆ่าคุณได้ก่อนซอมบี้” / "can kill you first"; the drone stays.
  - B08: the pulse stops at the cut; the drone with a cold, sparse high layer. Low energy, isolation.
  - B09: the drone sits low under the counters and is fully out before the first knock.
  - B10: a thin, unresolved high tone from the same drone family, very low, under the question; it decays into room tone during the hold. No resolve.
- **Ending:** hard cut to black or `A_fade` (Editor); the tone does not resolve and does not loop.
- **Ducking:** `video.audio[]` with `duckUnderNarration` ≈0.25 (`existing-integrated`). EP08a's mix cue sheet applies, since this deliverable started on 28 Oct 2026 ([editor principles](../../../docs/editor-principles.md#ep08a-shape-audio-emphasis-by-story-beat)). Narration has no per-scene gain field (runtime gap noted there).
- **B01–B02 note (R3 conflict, resolved by Film):** Preaw's B01 "low sub swell" and B02 "tense low pulse… the music drops out" would put music before B03, which the user ruled out. Film keeps the user decision. Both become **non-musical sound design**: B01 is a sub riser that stops dead when the turn completes; B02 is a low, heartbeat-like pulse that cuts on the sound-rule line, leaving only the pounding. The felt effect Preaw asked for is kept. If the user wants an actual music cue in B02, that is a change to Q1 ([Q-R3-1](#questions-for-the-user)).

### Ambience per location

| Location / time | Bed | Library candidate | Notes |
| --- | --- | --- | --- |
| Corridor, powered (B01) | Fluorescent hum + one buzzing, flickering tube; dry corridor room tone | `electric_light-flicker-buzz_01` (flicker part) | From F0 |
| Unit, powered (B02) | Warm room tone with fridge compressor + AC hum | `NEEDS-GEN` (compressor/AC loop) | It must be heard so its cut in B03 registers |
| Unit, blackout day (B03–B07) | Quiet room tone, faint outside wind; bathroom reverb on all bathroom SFX | `room_dark-empty-building_01` (with care) | Use a segment with **no creaks or drips that could read as someone in the building** |
| Balcony, night (B08) | Wind at height, distant fire crackle; no traffic | `nature_wind-eerie-street_01` (wind); fire crackle `NEEDS-GEN` | **No sirens, helicopters, voices or dog barks.** `city_desolate-night_01` and `vehicle_car-alarm-distant_01` are **excluded** (they contain sirens or alarms). R2's "far dog bark" is dropped |
| Unit, day three (B09–B10) | Flatter room tone; drops to near-zero in the 1.5 s silence | as blackout day | Nothing that implies a person outside the door |

### SFX language

Foley is close, dry and matched to the shot distance (section shots a touch more distant than the perspective closes). Overlays are mostly silent; the only UI sounds are the B09 counter ticks. There are no whooshes on section trucks: the movement is diegetic, and repeated whooshes would become noise. Accents are rationed: one main hit (the B09 sub under the story rule) and three minor accents (B02 slam, B05 "aha" chime, B07 stinger).

| Beat | Cue | Library ID or gap | Design note |
| --- | --- | --- | --- |
| B01 | Door latch + hinge | `NEEDS-GEN` (source: apartment door latch and hinge; action: latch click then slow inward swing; material: painted steel-faced door; space: corridor, close, dry; ≈2 s) | F0 |
| B01 | Sub riser into the turn | `reveal_riser-tension_01` (stops dead at its peak) | Riser end on the completed turn |
| B01 | Wet, slow neck creak on the turn | `NEEDS-GEN` (≈1.5 s) | Under "แล้วมันก็หันมา" / "Then it turns" |
| B02 | Slam, deadbolt clack | `NEEDS-GEN` (≈1.5 s) | Slam is the beat's accent |
| B02 | **Pounding** (heavy, irregular, fists/body, door rattle, wet slaps as handprints land) | `foley_door-pound-wood_01` (candidate; check it reads as a heavy unit door) + wet-slap layer `NEEDS-GEN` | `CL01`: low, chaotic, resonant |
| B02 | Low pulse | `tension_heartbeat-slow_01` (candidate, 60 bpm; may need a faster variant `NEEDS-GEN`) | Non-musical; cuts on "พวกมันตามเสียง" / "they follow sound" |
| B02 | Cabinet scrape on tile | `NEEDS-GEN` (light MDF cabinet dragged on ceramic tile, ≈1.5 s) | Light, not heavy furniture |
| B03 | Power-down whoomp; compressor + AC cut together; pounding fades over ≈0.8 s | `NEEDS-GEN` (≈1.5 s) | The silence after is the new room tone |
| B04 | Tap running (then thinner); water into plastic bucket, metal pot, PET bottles; three lid clicks | `NEEDS-GEN` (tap/fill set; lid clicks) | Pitch rises as containers fill; clicks on "แล้วปิดฝา" / "And cover it." |
| B04–B07 | Clock pulse | `NEEDS-GEN` (soft muffled clock tick, ≈60–70 per minute, loopable 8–12 s); `ui_click-tick_01` is too crisp for this layer | Music-adjacent layer under the drone |
| B05 | Bucket pour + bowl siphon gurgle | `NEEDS-GEN` (≈3 s) | Gurgle on "มันลงเอง" / "if it drains" |
| B05 | Ceramic cistern lid scrape + small bright "aha" | lid `NEEDS-GEN`; chime `reveal_glass-shimmer-soft_01` | Chime on the reveal |
| B06 | Fridge seal pop, **no** compressor hum, packaging rustle, a can set down on the counter | `NEEDS-GEN` (seal, rustle, can on laminate) | The silent fridge is the point |
| B07 | Plastic case slide; **canister handling click**; a quiet set-down; low stinger on the stop; wrapper rustle on the food | handling click `NEEDS-GEN` (dull plastic/metal handling, not a sharp spark tick); stinger `NEEDS-GEN` (short low muted hit) | **No igniter click and no ignition sound, ever** (Boat R3 advisory). `stinger_twist-reveal_01` is too big for this minor accent |
| B08 | Wind, distant crackle | see ambience | No sirens or voices |
| B09 | Counter ticks | `ui_click-tick_01` | One per count step |
| B09 | **Three soft knocks**: dry knuckle raps on a solid door, evenly spaced ≈0.45 s, close, no rattle | `NEEDS-GEN` (source: knuckles; action: three even soft raps; material: solid door, dull wood/steel; space: interior, close, dry; ≈1.2 s) | `CL03`: categorically different from the `CL01` pounding; identical in TH and EN |
| B09 | Low sub hit under "พวกมันไม่เคาะ" / "They don't knock." | `NEEDS-GEN` (short sub hit, tail ≤1.0 s) or `impact_cinematic-boom_01` trimmed and low | Main hit; its tail must not run into the B10 question |
| B10 | Thin unresolved high tone + room tone | tone `NEEDS-GEN` (or derived from the drone source); room tone as day three | Hold near-silent |

### Silence policy

- **B03:** ≈0.8 s (TH) / 0.6 s (EN) of near-silence after the line: room tone only, pounding fading. The silence is the beat.
- **B09:** **1.5 s of true silence** after the knocks (R3, was ≈1.0 s): all music out, no riser, room tone dropped to near-zero. The cut to SH03 happens inside it.
- **B10 hold:** near-silent; the tone decays into room tone.
- The voice leads everywhere else; no cue on every cut.

### Licence and gaps

- The drone source is still not chosen. `bed_dark-drone-sub_01` (library, loopable 18.5 s, no melody) is the first candidate to audition. Generated library audio falls under the Stability AI Community License, so commercial-use eligibility is the user's decision. Whichever source is used, its licence goes in a NOTICE beside the file and is flagged in the delivery record if eligibility is unknown.
- Every `NEEDS-GEN` row above is a generation request for Editor (sound generation workflow). Library candidates must be listened to before use. Mark writes each cue's shot-local frame in the scene sheets.

### `VD-ZC-CAP` — captions and chrome (R3)

- **Caption-safe box (requirement, applies because this deliverable started on 28 Oct 2026):** every caption glyph, including tone marks and stroke, stays inside **x 120–888, y 288–1248** ([production requirements](../../../docs/production-requirements.md#vertical-caption-safe-zone)). R2's bottom band (y 1616–1786, `Subtitles.tsx` `bottom: 134`) violates it and is withdrawn.
- **Placement:** set `video.captionStyle.position: 'middle'` (centred at y 960; two lines ≈ y 876–1044) in `src/videos/zombie-condo/index.ts`. This is the documented route for new portrait deliverables (`existing-integrated`). The requirement's preferred lower-middle band (bottom edge near y 1150–1248) would need a caption offset that the runtime lacks (`missing`; `S-09`). **The plates are composed so either placement works:** nothing key sits in the caption zone y 860–1248 ([`ZC-SCREEN`](#projection-contract-proj-zc-r3)).
- **Width gap:** the caption container spans x ≈65–1015 (`left: 6%`, `width: 88%`), wider than the x 120–888 box. Long TH chunks, for example “ส่วนน้ำสะอาดสำรอง อยู่ในถังพักน้ำหลังชักโครก”, will wrap at about 950 px and can cross the box. This needs either a narrower caption width (`S-09`, Boss) or Editor's frame check on every two-line cue. **Subtitle wording and chunking stay as in the scripts.**
- Outline preset (`video.captionStyle`, default; `existing-integrated`). TH uses the script's ซับ chunks; EN uses one caption per [tts-en.txt](../../../scripts/zombie-condo/short/tts-en.txt) line. Captions are visible from F0. In section shots the caption zone lies over the floor slab and the dark lower neighbour slices (`ZC-CUT-03`). Use the `box` preset only if a plate tests too busy (B08 fires).
- **EN risk:** `Subtitles.tsx` hard-codes `lang="th"` and `Noto Sans Thai`, so EN Latin rendering is **`unknown`** (`S-09`). Re-inspected on `9670266`: unchanged.
- **Chrome (user decision Q2):** `video.chrome: {channelLabel: false, progressBar: false}` on both TH and EN (`existing-integrated`, toolkit 10a).
- **Check (Editor):** render the first frame and the longest two-line cue per deliverable with the box overlaid, and record that no glyph crosses it.

## Technical handoff

### Scale baseline `SCALE-ZC-R2` (unchanged in R3; metres; `estimated` / `design choice` production baselines, not measured standards)

| Asset ID | Reference pose | Solid dimensions | Anchors | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| `zc-you` | Standing neutral (A-pose for the rig) | 1.72 m tall; eye 1.61 m | Feet, hips (sit on floor/sofa), hands (grip), head | design choice | Thai man about 28, slim; face rig for expressions; day-1 and day-3 variants |
| `zc-infected` | Standing, stooped | 1.65 m (≈1.55 m stooped) | Feet, hands (pound contact on the door), head pivot | design choice | Woman, long hair, sleep shirt; blood decals per `VD-ZC-GORE` |
| Unit door | Closed | 0.90 W × 2.10 H × 0.045 D; inward swing; lever + deadbolt; **no peephole** | Hinge axis, handle | estimated | Seen edge-on in section, face-on in B10 |
| Corridor | — | 1.8 W × 2.6 H; ≈15 m to the end window | Floor | design choice | The infected stands at ≈12 m in B01 |
| Unit section (`ZC-CUT-01`) | — | Interior depth (camera axis) 3.2 m; length ≈10.7 m (entry 1.5, bath 1.8, kitchenette 2.4, living 3.5, balcony 1.5); ceiling 2.6 m | Floor plane z = 0 | design choice | Linear stylized plan |
| Wall caps | — | External/door wall 0.18 m; partitions 0.10 m; floor/ceiling slabs 0.25 m | Cut plane | design choice | Solid closed geometry, not open mesh edges |
| `zc-cabinet` | Upright | 0.80 W × 0.40 D × 1.20 H, light hollow MDF look | Floor, push hand ≈1.0 m | design choice | Must look movable |
| Bucket ×4 | With lid | Ø0.28 × 0.30 H (≈10–12 L) | Handle grip, floor | design choice | Reads ≥4–5 L (Boat `FC-TH-05b`) |
| Pot | With lid | Ø0.24 × 0.14 H | Handles | design choice | Never on or near the stove |
| PET bottle ×6 | Capped | Ø0.09 × 0.33 H (1.5 L) | Grip | estimated | Unbranded |
| Toilet + cistern | — | Cistern top ≈0.80 m; lid 0.45 × 0.20 | Lid grip | estimated | Clear water, no tablet |
| `zc-fridge` | Closed | 0.60 W × 0.65 D × 1.70 H, two-door (freezer top) | Door handle | estimated | |
| `zc-camp-stove` | In its case | 0.36 × 0.30 × 0.12 | Case grip | estimated | Unbranded; canister not mounted |
| Balcony railing | — | 1.10 m height | Hand rest | estimated | Not a building-code claim |

Calibration view (Boss, before any shot): `zc-you`, `zc-infected`, door, cabinet, bucket, bottle, fridge and stove side by side on one floor plane, orthographic front view, rendered once to `out/blender/zc-calibration.png`.

<a id="projection-contract-proj-zc-r3"></a>
### Projection contract `PROJ-ZC-R3`

Changed from `PROJ-ZC-R2` only in `ZC-SCREEN` (caption-safe zones) and the `CAM-SECTION` vertical framing. World, camera classes, lead size and clock are unchanged.

- **World `ZC-WORLD`:** Blender native, metres, Z-up, right-handed. Origin at floor level, centre of the unit-door threshold.
  - The door wall is the plane y = 0. The unit extends toward +Y (entry → balcony); the corridor lies at y < 0 and runs along X.
  - The unit interior spans x ∈ [−1.6, +1.6]. The **section cut plane is x = +1.78** (outer face of the removed near wall).
- **Perspective cameras:** render 1080×1920 natively, square pixels, sensor fit **vertical**. Classes give vertical FOV: OTS/medium ≈55°, close ≈35°, insert ≈30°, long lens ≈18°, B08 wide ≈60°. Frame with Blender **lens shift** where a subject must sit higher in frame, rather than extra tilt, so verticals stay true.
- **`CAM-SECTION`:**
  - Perspective, vFOV 20–24°, looking along **−X**, so screen-right = +Y (balcony) and screen-left = −Y (corridor).
  - Camera at x ≈ +17 m, lens height 1.5–2.0 m above the unit floor, tilt down ≤8°, **no roll and no pan**, so cut lines stay vertical.
  - Motion is a **sideways truck along Y only**, which gives slight, honest parallax between the caps (near) and the back wall (3.2 m deeper).
  - **Vertical coverage at the character plane (x ≈ 0) is 5.8–6.8 m.** Lead check: `Hpx = 1.72 × 1920 / coverage` ≥ 485 px at 6.8 m (≈550 px at 6.0 m).
  - **R3:** the unit floor line sits at **y ≈860** (via lens shift Y); the unit band occupies about y 30–860 at 6.0 m coverage; the floor slab and the neighbour units below fill y ≈860–1920 (`ZC-CUT-03`). A standing lead's head is at about y 310; a sitting lead's head at about y 560–700. (R2 placed the unit band at y 450–1400, which would put the caption band across the characters.)
- **Transform owner:** video plates bake their camera moves and get **no** `pictureMove`. Stills get `pictureMove` only. Never both on one clip.
- **Screen `ZC-SCREEN` (R3):** 1080×1920 px, origin top-left. Overlays and captions live here, outside the picture transform.
  - **`ZC-CAPZONE` y 860–1248 (full width):** captions only. The picture may pass through (bodies, floors, set dressing, dark city), but **no faces or eyes, key hands or contact, reveal objects or counted props**. This keeps both the `middle` caption position and a later lower-middle offset legal without re-rendering plates.
  - **`ZC-TEXT` x 120–888, y 288–850:** all overlays (diagram, icons, clock device, counters, labels). Not over his face.
  - **Key action zone:** x 90–990, y 150–860. Faces, key hands, reveal objects and counted props live here. Avoid the right rail x ≥888 for faces (platform buttons).
  - **Below y 1248:** platform title/description UI. Picture continues (floor, lower slices, city), with nothing the viewer must read or see.
- **Clock:** 30 fps. Blender frame 1 ↔ clip frame 0. A clip's frame 0 ↔ the shot start after `trimStartSec`. All randomness (flicker, embers, smoke, cascade order) is baked with fixed seeds.
- **Lead size:** "you" ≥480 px tall whenever visible (all section, OTS, B08 and B10 shots); the minimum across each move is checked. Hand inserts are exempt. The infected is not the lead.

### Per-decision technical seams

| Seam | Decision |
| --- | --- |
| Composition | Full pre-render per shot; no WebGL. Remotion layers: plate (`media`, back) → overlays (screen space) → captions; chrome hidden. **Do not put overlay PNGs in the `media` `front` layer on scenes that use `pictureMove`**: `SceneRenderer.tsx` L98–112 (re-checked on `9670266`) draws front media inside the picture-transform container. |
| Section geometry | The near wall lives in its own collection, hidden for `CAM-SECTION` and shown for perspective shots. Caps are **separate closed meshes** (not boolean-on-render, not open edges). Required states: corridor-open (B02) / corridor-capped (B03+). Neighbour slices: lit / dark. Check: no back-face holes, z-fighting or light leaks at cap/wall joints at the truck start, middle and end. |
| Scale / projection | `SCALE-ZC-R2` + `PROJ-ZC-R3`; one projection owner (the Blender camera). The orthographic `projection` field is not used, and the validator rejects `media` with `projection` (`media.ts`). |
| Contact / identity | All contact (hand–door, hand–cabinet, bucket pour, hand–food, sitting on the floor/sofa) is solved and baked in Blender. The same `zc-you` rig and clothing appear throughout; the day-3 variant appears only from B09. |
| Depth / alpha | Opaque full-frame plates; no alpha video (`missing`, not needed). Overlays are vector or PNG with alpha. |
| Lighting / color | Baked in Blender. Proposal: Eevee, AgX view transform, sRGB output, PNG masters, H.264 yuv420p for runtime. **R3:** encode with explicit bt709/tv colour tags (`scale=out_color_matrix=bt709:out_range=tv`, `-colorspace/-color_primaries/-color_trc bt709`) through `npx remotion ffmpeg`, the workaround recorded in `DF-20261028-blender-cycles-water-spike` (untagged files shifted about 8 levels; tagged about 1–2). `SP01` (b) still checks this for ZCONDO. Section fill per `ZC-CUT-04`. Channel demo lighting and the emissive cap are **N/A** (no runtime 3D; survival profile). Kept: rims and real ground shadows. Blood is matte with no emission. |
| Motion / clock | See `PROJ-ZC-R3`. `OffthreadVideo` seeking is deterministic per toolkit 10a; confirm with this codec. B06 SH01 and B10 contain baked holds (acting inside a static camera), so they are trimmed at the head only. |
| Loading / resources / storage | **User decision Q4: plates stay local, regenerable from build scripts, no LFS.** Runtime plates go under `public/assets/blender/zc-*/` and masters under `out/blender/`; neither is committed. MP4 is already Git-ignored. PNG stills are **not**, so Boss keeps them out of commits, e.g. with an ignore rule in Boss's scope. Commit only sources, `build.py`, manifests and the render/encode commands. Each manifest records the regeneration steps and output checksums. |
| Contract / delivery | No new timeline fields are needed for plates, SFX, music, chrome or the blackout cascade. **New shared overlay capability needed** (`S-08`). **R3:** caption width/offset for the safe box (`S-09`, proposed). Composition IDs distinct per deliverable (e.g. `ZCONDO-SHORT-TH`, `ZCONDO-SHORT-EN`) in `src/videos/zombie-condo/index.ts` with `captionStyle.position: 'middle'`; narration at `public/narration/<CompositionId>.mp3`. |
| Feasibility / cost | **R3:** about 17 video plates (≈68–75 s of frames incl. handles, ≈2,050–2,260 frames) + ≈12 stills, plus the section caps and a face rig. Eevee render time is **unmeasured** (`SP01`, `SP02`). **Boss update 28 Oct 2026:** Eevee measured on blockouts at ≈4.2–4.6 s/frame (64 samples) vs. Cycles ≈26–30 s/frame, i.e. ≈2.5–2.8 h vs. ≈15–17.6 h for ≈2,100 frames (`estimated`; see `SP01` status and `DF-20261028-zcondo-eevee-render-spike`). For scale only: Cycles on this M1 measured 11–35 s/frame for the POOLDEPTH scenes (`DF-20261028-blender-cycles-water-spike`), which would mean roughly 7–20 h for this plate set. That is why Eevee is proposed and why the still fallback stays. |

### Blender feasibility and runtime status

R2 inspection: 28 Oct 2026 on `claude/zombie-condo-reel-script-ade441` @ `f9ee024`. **R3 re-inspection: 28 Oct 2026 on `main` @ `9670266`** (source reads only; no build, typecheck or render run).

| Capability | Status | Evidence |
| --- | --- | --- |
| Blender application | available (R2 evidence) | `/Applications/Blender.app/Contents/MacOS/Blender --version` → `Blender 5.2.3 LTS`, build 2026-10-22; also recorded in `scripts/pool-depth/blender-preflight.md` |
| Blender MCP connection | connected at R2 (read-only probe); **not re-probed in R3** | R2: `get_blendfile_summary_path_info` → `status: ok`; default scene only. MCP add-on/server version `unknown` |
| Project Blender sources | `zc-*`: `missing`; another episode exists | `assets/blender/pool-depth/` (`build.py`, manifests) is tracked on `main`; no `assets/blender/zc-*` |
| Pre-rendered still in the timeline | `existing-integrated` | `MediaClip` `kind: 'image'` (`src/scenes/types.ts`), `validateSceneMedia` (`src/scenes/media.ts`), `<Img>` in `MediaLayer` (`src/scenes/MediaLayers.tsx`); toolkit 10a. Screen-space only; not allowed with `projection` |
| Pre-rendered video plate | `existing-integrated`; **Blender-sourced plates now proven on `main`** | `kind: 'video'` → `<OffthreadVideo>`; `trimStartSec`, `playbackRate`, `startSec`/`endSec`. POOLDEPTH-SHORT integrates eight Blender clips via `Scene.media` (commit `0324ef7`, `src/videos/pool-depth/index.ts`); encode recipe in `scripts/pool-depth/spike-results.md`. ZCONDO's Eevee/colour path is still untested (`SP01`) |
| Picture push on stills | `existing-integrated` | `pictureMove` wraps background + media (`SceneRenderer.tsx` L84–112) |
| Chrome off / music ducking / SFX / caption style + `middle` position | `existing-integrated` | `video.chrome`, `video.audio[].duckUnderNarration`, `scene.sfx[]`, `video.captionStyle.position` (`Subtitles.tsx` L10) |
| Caption width/offset inside the safe box | `missing` | `Subtitles.tsx`: `left: 6%`, `width: 88%`; positions top/middle/bottom only |
| Text on a moving quad | `existing-integrated`, Boss review pending | `scene.quadTexts[]` (`src/scenes/quadText.ts`, toolkit 10a, added 2026-10-28 for POOLDEPTH). Not needed by this brief; noted as a possible partial text fallback for `S-08` |
| Alpha video; image sequences | `missing` | No `transparent` option; one image per clip. Not needed |
| GLB/glTF in Three.js/R3F | **`missing`** | `package.json` on `9670266` declares none of `three`, `@react-three/*`, `@remotion/three`; R2's `npm ls` saw them only as extraneous |
| Generic screen-space overlay | `missing` | `SceneVisual` modes are CATBOX-specific (`src/assets/visuals/types.ts`) |

**Verdict (unchanged):** Blender **pre-render** for every set, character and prop, including the section cutaway, which is purely Blender geometry and camera work and needs no new runtime. **No GLB/Three.js.**

**Spikes for Boss (before plate production), R3-adjusted:**

- **`SP01` corridor plate.**
  - Scope: `zc-corridor` blockout + `zc-you`/`zc-infected` placeholders. Render `B01-SH01` (OTS) at 1080×1920, 30 fps, ≈105 frames via `assets/blender/zc-corridor/build.py`. Encode to H.264 with bt709 tags and load it as `media` `kind: 'video'` in a throwaway local timeline with one two-line TH caption at `position: 'middle'`.
  - (a) The infected is a readable silhouette ≥150 px tall by **F36**, inside the key action zone, and the "you" head/shoulder is ≥480 px with the head above y 860.
  - (b) CLI frames F0/F36/F104 match the Blender PNGs; any colour shift is recorded.
  - (c) Direct render vs. remount are identical at those frames.
  - (d) The caption stays inside the box x 120–888, y 288–1248 and is readable over the plate; no face or the figure sits under it.
  - (e) Eevee render time per frame and file size are measured.
    - **Status 28 Oct 2026 (Boss, render-speed spike only; `DF-20261028-zcondo-eevee-render-spike`):** measured on throwaway blockouts (`assets/blender/zc-render-spike/`, not `zc-corridor`), frames 0/36/104 at 1080×1920, Blender 5.2.3 on the M1. Eevee 64 samples 4.2–4.6 s/frame, 32 samples 2.2–2.4 s/frame; Cycles 40 spp + OIDN 25.8–30.1 s/frame; PNG ≈1.7–2.1 MB/frame. Interiors need a baked volume probe to match Cycles bounce. Extrapolated to ≈2,100 frames (`estimated`): Eevee 64 ≈2.5–2.8 h, Eevee 32 ≈1.3–1.5 h, Cycles ≈15–17.6 h. (e) is **partly met**: production-asset cost, MP4 size and temporal flicker are still unmeasured; (a)–(d) and (f) are not started.
    - **SP01 run 28 Oct 2026 (Boss; user approved Eevee: “ทำ SP01 ต่อ”; `DF-20261028-zcondo-sp01-corridor-plate`):** `assets/blender/zc-corridor/build.py` blockout (placeholder figures, two baked GI probes), `B01-SH01` 150 frames (0.5 s head + 3.5 s + 1.0 s tail), Eevee 64, encoded with bt709 tags, loaded as `media` `kind: 'video'` (`trimStartSec 0.5`) in a scratch composition with a two-line TH caption at `position: 'middle'`. Checked at shot F0/F36/F104 (CLI only; Studio, EN trim and B02 neighbour unverified).
      - (a) **pass:** infected 235–239 px tall, x 587–659, y 559–798, visible from clip F0; "you" head y 286–701, left third, visible height ≥1600 px.
      - (b) **pass, shift recorded:** Remotion vs Blender PNG mean abs ≈2.1, ≈−2 levels per channel (Remotion darker), max 32–36 at edges.
      - (c) **pass:** still vs sequence render identical (max diff 0).
      - (d) **pass:** caption bbox x 200–882, y 880–1030; over his torso/floor, no face under it; readable.
      - (e) **measured:** 5.39 s/frame (Eevee 64; 32 samples 2.89 s/frame but visible ceiling grain), MP4 8.54 MB, PNG masters 279 MB; temporal noise excess 0.14/255; the only frame jumps are the authored flicker.
      - (f) **pass:** connection, version, MCP tool list in `assets/blender/zc-corridor/sp01-manifest.json`.
      - Open for Film/Mark: the door pull is not visible from this OTS position; the infected reads as a grey figure on the bright window rather than a hard black silhouette with a rim.
  - (f) The connection, the Blender version and the MCP tool list are recorded in the manifest.
- **`SP02` section cutaway.**
  - Scope: `zc-unit` grey blockout with caps and neighbour slices. Render `CAM-SECTION` stills at the B02 framing (corridor open) and the B09 framing (corridor capped, lead sitting), plus a 60-frame truck.
  - (a) "You" ≥480 px at the truck start, middle and end, with the unit floor line at y ≈860 and his head above y 860 standing and sitting.
  - (b) Caps are closed: no holes, z-fighting or light leaks at the start, middle and end.
  - (c) In the capped state, a frame-step and a luminance check show **nothing rendered** in the corridor zone (pure cap colour).
  - (d) The floor slab and lower neighbour slices behind the caption zone are dark enough for outline captions.
  - (e) Render time is measured.
- **Studio:** expect `DF-20261026-studio-emfile`; CLI stills/renders are the evidence. Headless Cycles Metal crashed once in about 12 starts on the POOLDEPTH work; if Cycles is used, wrap long renders in a retry.

### Dev findings consulted (R3: 28 Oct 2026, against `9670266`)

| Finding | Last checked / scope | Effect on this brief | Outcome |
| --- | --- | --- | --- |
| `DF-20261026-studio-emfile` | 2026-10-26 / `906a85e`, open | Studio play/seek may fail | Use conditionally: CLI renders are the evidence for `SP01`/`SP02` and samples |
| `DF-20261027-catbox-short-home-stage` | 2026-10-27 / PR #38 branch, fixed | One owner per overlay; lead kept inside the portrait crop | Use conditionally: `VD-ZC-OV`; lead rule in `PROJ-ZC-R3` and the `CAM-SECTION` coverage limit |
| `DF-20261026-subpixel-stage-projection` | 2026-10-26 / `906a85e`, fixed | Orthographic DOM/SVG stage | Irrelevant: no `projection` stage is used |
| `DF-20261026-duplicate-types` | 2026-10-26 / `906a85e`, workaround | `node_modules` duplicate directories | Boss revalidates `npm run typecheck` before runtime work; not run in this planning pass |
| **`DF-20261028-blender-cycles-water-spike`** (new for R3) | 2026-10-28 / `claude/pool-depth-short` `59809c8` + working tree, workaround; different scene (water refraction), same machine and Blender 5.2.3 | (1) MP4 colour shift from untagged Blender PNG encodes, fixed by bt709 tags; (2) Cycles cost 11–35 s/frame at 1080×1920 with OIDN; (3) first-frame Metal kernel compile ≈135 s; (4) occasional headless crash | Use conditionally: bt709 encode tags adopted in the colour seam and `SP01`; cost used only as an order-of-magnitude bound (Eevee unmeasured); retry advice passed to Boss. Revalidate against ZCONDO in `SP01` (b), (e) |

No finding covers sections or Eevee yet. Boss records the `SP01`/`SP02` results as new findings.

Boss addition 28 Oct 2026: `DF-20261028-zcondo-eevee-render-spike` (blockout cost/look spike, `main` `9670266` + untracked spike scripts) now covers Eevee cost and look; `DF-20261028-zcondo-sp01-corridor-plate` covers the SP01 run. Film/Mark adoption pending. Neither covers sections.

## Boss asset and capability needs

All `zc-*` items are `missing` at `9670266`. They are listed in dependency order. Paths follow [blender-mcp-workflow](../../../docs/blender-mcp-workflow.md#2-shared-source-และ-export-contract).

| ID | Need | Owner path (proposed) | Consumers |
| --- | --- | --- | --- |
| `S-01` | `SP01` + `SP02` spikes + `zc-calibration` view | `assets/blender/zc-corridor/`, `assets/blender/zc-unit/`, `out/blender/` | All |
| `S-02` | `zc-corridor` set (doors without peepholes, fluorescent strips, end window, generic signage without text/brands), with blood smear trail and door-handprint decal states (clean / pounding) | `assets/blender/zc-corridor/` | B01–B02 |
| `S-03` | `zc-unit` set in the linear plan `ZC-CUT-01`: entry (inward door, deadbolt, **no peephole**), shower-only bathroom (toilet + cistern, frosted louvre window), kitchenette (sink, fridge, counter, shelf), living, balcony. **Section kit:** removable near-wall collection; closed **wall-cap meshes** for the external wall, partitions and slabs at the x = +1.78 cut; a corridor-open / corridor-capped switch; `CAM-SECTION` rig with a Y-only truck and the R3 lens-shift framing (floor at y ≈860). Lighting variants: powered morning, blackout day, night, day three; open-side fill per `ZC-CUT-04` | `assets/blender/zc-unit/` | B02–B10 |
| `S-04` | `zc-unit-stack` neighbour slices below (and a sliver above), linked, lightly dressed, no people, lit/dark states | `assets/blender/zc-unit/` | B02–B09 section shots |
| `S-05` | `zc-city` night backdrop: generic towers, dark windows, seeded fires, smoke, embers; no landmarks/brands; one main fire-and-smoke cluster placed for the B08 anchor | `assets/blender/zc-city/` | B08 |
| `S-06` | `zc-you`: full-body rig + **face rig** (neutral/tired, startle, fear, focused, listening, frozen; eye direction for the B10 lens glance), day-1 and day-3 variants (creased/stained shirt, messier hair, stubble). `zc-infected`: rig for the head turn and pounding hands, blood decals within `VD-ZC-GORE` | `assets/blender/zc-you/`, `assets/blender/zc-infected/` | All |
| `S-07` | Props: trash bag, `zc-cabinet`, 4 buckets + lids, pot + lid, 6 PET bottles, cistern lid, `zc-fridge`, ready-to-eat foods, 6 pull-tab cans, nuts, `zc-camp-stove` in case, phone, flip-flops. All unbranded | `assets/blender/zc-props/` | B01–B10 |
| `S-08` | **Shared screen-space overlay capability** (types + validator + renderer together): step diagram, timed icon counter (tick from → to), ordered list/clock device, mark (cross/check), stacked choice labels, with per-deliverable text; frame-driven, outside `pictureMove`, constrained to `ZC-TEXT`. Fallback, existing today: static alpha PNGs as `media` `kind: 'image'` on scenes **without** `pictureMove` | `src/assets/overlays/` + `src/scenes/` | B04–B07, B09–B10 |
| `S-09` | **R3 extended.** Captions: (a) EN Latin rendering, `lang` attribute and font in `Subtitles.tsx`; (b) proposed caption width and bottom offset so every line fits x 120–888 and can sit with its bottom edge near y 1150–1248 (design only, shared consumers to be checked) | `src/scenes/Subtitles.tsx` | `ZCONDO-SHORT-EN` (a); both (b) |
| `S-10` | Plate renders with handles per the R3 plate table: PNG masters + H.264 runtime files with bt709 tags, manifests (frame ranges, cameras/vFOV, section state, colour settings, regeneration command, checksums); local only, nothing committed | `public/assets/blender/zc-*/`, `out/blender/` | Editor |
| `S-11` | Drone bed + SFX set with a NOTICE per file; generation of the `NEEDS-GEN` cues is Editor's ([sound direction](#vd-zc-au--music-and-sfx)) | `public/sfx/zcondo/`, `public/music/zcondo/` (proposed) | Both |

Editor (after Boss): two timelines, `scripts/zombie-condo/short/timeline.json` (TH) and an EN timeline (path chosen by Editor/coordinator), both registered in `src/videos/zombie-condo/index.ts` with `captionStyle.position: 'middle'` and chrome hidden, each conformed to its own measured narration, plus an EP08a mix cue sheet per deliverable.

## Handoff to Mark

- **Constraints to preserve:**
  - Beat IDs and story timing per language (R3 beat tables); the infected readable by F36 (story limit 2.0 s).
  - No peephole/viewer/door camera.
  - Nobody, no light leak, no feet shadow and no suggestive room-tone sound outside the door in B09–B10; the corridor side capped black from B03 on (`ZC-CUT-02`).
  - The pounding vs. knock design; the movable light cabinet; no weapons.
  - B04 shows bucket, pot and bottles (four buckets), **cut in spoken order to the list**, with lids going on.
  - B05: shower-only, bucket ≥4–5 L poured from a little height, the cistern lid lifting in the pause, clear water with no tablet, a "not the bowl" mark, conditions over the cistern.
  - B06: ready-to-eat only, nothing raw taken or eaten, the fridge light dead, the shut-fridge hold through both hold times.
  - B07: the stove never lit and never with a pot; canister sound is handling only.
  - B08: the fire cluster lands on the restored smoke/fire line; no sirens or voices.
  - B09: bucket icons, quantities exactly as the VO, two buckets visible; 1.5 s silence with the cut inside it.
  - Continuity of the buckets, pot and bottles; daylight B04–B07, night B08, day three B09–B10.
  - The `VD-ZC-GORE` ceiling (blood only in B01–B02, never on "you").
  - "You" ≥480 px whenever visible.
  - **`ZC-SCREEN` zones in every shot** (caption zone y 860–1248 clear of faces, key hands, reveal objects and counted props; overlays in `ZC-TEXT`).
  - Generic city and building, no brands.
- **Decided here; do not reopen per shot:** `VD-ZC-00` medium, `VD-ZC-CH` character, `VD-ZC-GORE`, `VD-ZC-CUT` (which beats use the section, the layout, the corridor rule, the R3 stack framing), `PROJ-ZC-R3` incl. `CAM-SECTION` and `ZC-SCREEN`, `SCALE-ZC-R2`, no POV, video vs. still per shot, overlay style `VD-ZC-OV`, two conforms `VD-ZC-TL`, music/chrome, sound direction (music arc, silence policy, exclusions).
- **Left to Mark:**
  - Exact cameras and key frames, including truck start/end Y values within `CAM-SECTION` limits.
  - Acting and expressions per shot, including the B06 hand hover and the B10 held look.
  - Splitting/merging shots inside a beat, including the B04 pot/bottle merge if the measured audio is too fast.
  - The B03 cascade order and timing.
  - Overlay layout within `ZC-TEXT`.
  - Whether B05 SH01 is a section or a perspective shot.
  - The optional B09 eyeline insert.
  - Shot-local sync points per language, refined from the anchor table and marked `estimated`; a `Sound` line per shot with library IDs or `NEEDS-GEN`.
- **Format:** one scene-sheet set covering both deliverables is acceptable because the shot plan is shared, but each sheet needs **separate TH and EN timing columns** and sync anchors, and records the caption zone per portrait shot.
- **Missing evidence:** measured TH/EN audio; `SP01`/`SP02` results; the Eevee colour/cost path; `S-08`; `S-09`; music and SFX sources (none listened to); YouTube policy check for the blood ceiling; Preaw/Boat check of the B06 label wording.
- **Boundaries:**
  - B02 SH02 (corridor open) → SH03 close → B03 section (corridor out of frame, capped from here on).
  - B07 SH02 truck ends at the balcony door → B08 exterior (the cut carries the time jump; wind starts on the cut).
  - B09 SH02 face → SH03 section, cut inside the silence.
  - The B09 SH03 composition echoes B02 SH02 framing, so the return reads as the same door wall.
- **Affected decisions in this revision:** `VD-ZC-01`, `VD-ZC-03`–`VD-ZC-10`, `VD-ZC-OV`, `VD-ZC-TL`, `VD-ZC-AU`, `VD-ZC-CAP`, `ZC-CUT-03`, `PROJ-ZC-R2` → `PROJ-ZC-R3`, `S-03`–`S-05`, `S-08`–`S-11`, `SP01`/`SP02` criteria. `VD-ZC-02` is re-timed only.

## Open risks

| ID | Risk | Affects | Response |
| --- | --- | --- | --- |
| `RK-01` | TH/EN timing unmeasured; beats may shift ±1–2 s (TH sensitivity 67–80 s; EN 66–78 s) | `VD-ZC-TL`, all plates | Handles, constant-speed trucks, still-heavy tip beats; lock after measured audio; the scripts' reserve trims, never a voice speed-up |
| `RK-02` | Pre-render cost; R3 raises the plate estimate to ≈68–75 s of frames; face rig and section caps add build time | `VD-ZC-00`, `VD-ZC-CH`, `VD-ZC-CUT` | `SP01`/`SP02` measure Eevee; B10 still + short video option; fallback all-stills + `pictureMove` |
| `RK-03` | Local-only plates: other machines/workers must regenerate; PNG stills are not Git-ignored | `S-10` | Manifests + `build.py` + checksums; Boss keeps plates out of commits |
| `RK-04` | No generic overlay capability; front media moves with `pictureMove` | `VD-ZC-OV` | `S-08`; PNG fallback only without `pictureMove` |
| `RK-05` | EN caption font/lang hard-coded to Thai | `ZCONDO-SHORT-EN` | `S-09` (a) |
| `RK-06` | Busy plates (B08 fires) vs. captions now mid-frame | B08 | Brightest fires above y 860, dark city in the caption zone; `box` preset fallback |
| `RK-07` | Colour shift Blender PNG → H.264 | All video plates | bt709 tag workaround (`DF-20261028-blender-cycles-water-spike`); `SP01` (b) |
| `RK-08` | Studio unusable (`DF-20261026-studio-emfile`) | Review | CLI evidence |
| `RK-09` | EN B08 too short (2.4 s in R2) | B08 EN | **Closed in R3:** EN B08 is 4.5 s |
| `RK-10` | Blood vs. platform policy (age restriction, limited ads) | B01–B02 | Restrained ceiling `VD-ZC-GORE`; policy `unverified`; coordinator/Boat check before release |
| `RK-11` | Section caps leak light or reveal geometry behind the corridor cap | B09 concealment | `SP02` (b)(c); nothing modelled behind the cap |
| `RK-12` | Character gender vs. the TH Botnoi voice | `VD-ZC-CH` | Closed 28 Oct 2026: the Botnoi voice is male |
| `RK-13` (R3) | Caption container wider than the safe box (x 65–1015 vs 120–888); long TH chunks can cross it | `VD-ZC-CAP`, both | `S-09` (b) or Editor's two-line frame check; chunking unchanged |
| `RK-14` (R3) | Fast B04 TH insert run (pot/bottle inserts ≈0.4 s) may not read | B04 TH | 12-frame minimum; merge pot + bottles if measured audio is faster |
| `RK-15` (R3) | Library sounds unheard; `room_dark-empty-building_01` contains creaks/drips that could imply a presence | B03–B10 sound, concealment | Listen before use; choose clean segments or generate |

## Questions for the user

- **Q-R3-1 B02 sound (optional):** your music decision keeps music out until B03. Preaw's R3 notes ask for a "tense low pulse" under the B02 barricade. Film made it a non-musical heartbeat-style pulse, so your decision stands. Do you want real music in B02 instead? Recommended: no (keep the drone from B03).

History (R2, answered 28 Oct 2026, relayed by the coordinator: “ผู้ชาย / มองกล้อง / ตามนั้น”): **Q-R2-1** the Botnoi Thai voice is male, so `zc-you` stays a man. **Q-R2-2** he looks into the lens on “คอมเมนต์มา” / "Comment below". **Q-R2-3** the blood level stands as set in `VD-ZC-GORE`. RK-12 is closed; RK-10 (YouTube policy) is still `unverified`.

## Change log

- **`VB-ZCONDO-SHORT-R3`** (28 Oct 2026, Film): re-timed from scripts R2 (≈58 s) to the user-approved `ZCONDO-SHORT-TH-R3` / `ZCONDO-SHORT-EN-R3` (≈70.8 s / ≈70.1 s) and Boat recheck R3. Authorized by the user's “อนุมัติ R3”. Shot IDs are unchanged; no shot was added or removed.
  - **Timing:** new beat table (`VD-ZC-TL`), a per-shot TH/EN timing table, a per-language sync-anchor table and an R3 plate-length table.
  - **Where the time went:**
    - B01 turn-landing hold.
    - B02 freeze hold.
    - B03 held dark state.
    - B04 spoken list: inserts cut in spoken order, plus an EN lids-on hold.
    - B05 lid lift in the pause, with a return to the cistern for the conditions.
    - B06 shut-fridge hold through both hold times; labels add "อย่างมาก" / "tops" and the conditions.
    - B07 his face on the CO line.
    - B08 ambience lead-in, with the fire cluster anchored to the restored line.
    - B09 count ticks; silence 1.0 → 1.5 s with the cut inside it.
    - B10 held lens look.
  - **Figure target:** F45 → F36, so the figure reads before the EN VO names it.
  - **Sound:** the section is renamed "Sound direction" (anchor `vd-zc-au--music-and-sfx` kept) and expanded per the sound-workflow checklist. It now includes the music arc with the clock-pulse layer, ambience per location, SFX language, the silence policy, shared-library IDs and `NEEDS-GEN` gaps, the B07 handling-click rule (Boat advisory), the B08 exclusions (no sirens/voices; dog bark dropped) and the B01–B02 music conflict resolved in favour of user decision Q1.
  - **Caption-safe box (requirement found on `main`, not in the assignment):** `production-requirements.md#vertical-caption-safe-zone` (added 28 Oct 2026, applies to portrait deliverables started on or after that date) withdraws R2's bottom caption band. As a result:
    - `VD-ZC-CAP` moves captions to `position: 'middle'`.
    - `PROJ-ZC-R2` → `PROJ-ZC-R3` with `ZC-SCREEN` zones and the `CAM-SECTION` floor line at y ≈860.
    - `ZC-CUT-03` puts the neighbour slices below.
    - Overlay and framing positions move in B01, B04–B10.
    - `S-09` is extended; `RK-13` is added.
  - **Evidence refresh:**
    - Runtime re-inspected on `main` @ `9670266`.
    - POOLDEPTH Blender clips are now precedent for `kind: 'video'` plates.
    - `DF-20261028-blender-cycles-water-spike` consulted (bt709 encode tags, cost bound, retry).
    - `quadTexts` noted.
    - `RK-09` closed; `RK-14` and `RK-15` added.
  - **Unchanged:** medium and verdict, character, blood ceiling, section layout and corridor rule, scale baseline, POV decision, overlay style, the conform method. Spikes `SP01`/`SP02` are still pending; only their frame and caption criteria were updated.
- `VB-ZCONDO-SHORT-R2` (28 Oct 2026, Film), from the user's answers relayed by the coordinator the same day:
  - Q1 music (drone from B03, ducked); Q2 chrome hidden on TH and EN; Q4 local regenerable plates, no LFS.
  - Q3/Q5 "เห็นทั้งตัว มีหน้า เลือด มุมมองในห้องอาจ slice ครึ่ง" → new `VD-ZC-CH` (full-body man with a face), `VD-ZC-GORE` (blood ceiling), `VD-ZC-CUT` (section cutaway, per-beat evaluation, corridor rule).
  - Changed: `VD-ZC-01` (POV → OTS), `VD-ZC-02` (section SH02 with the corridor open, blood handprints), `VD-ZC-03` (section cascade + neighbours), `VD-ZC-04`, `VD-ZC-06`, `VD-ZC-07` (section trucks), `VD-ZC-09` (POV push → section + face close + black corridor cap), `VD-ZC-10` (door-face hold + lens glance).
  - Also changed: `SCALE-ZC-R1` → `SCALE-ZC-R2` (character, section, caps); `PROJ-ZC-R1` → `PROJ-ZC-R2` (`CAM-SECTION`, cut plane); spike `SP02` added; Boss needs `S-03`/`S-04`/`S-06` extended; `S-10`/`S-11` renumbered.
  - Unchanged: B05 and B08 decisions (except the character), feasibility verdict, overlays, captions, the TH/EN conform method.
- `VB-ZCONDO-SHORT-R1` (28 Oct 2026, Film): first brief. Medium: Blender pre-render hybrid; faceless "you"; POV at B01 and B09–B10. Superseded by R2.
