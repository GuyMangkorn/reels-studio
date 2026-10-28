# Visual brief — ZCONDO-SHORT (TH + EN)

| Field | Value |
| --- | --- |
| Deliverables | `ZCONDO-SHORT-TH` (primary) and `ZCONDO-SHORT-EN`; delivery record [../../../scripts/zombie-condo/delivery.md](../../../scripts/zombie-condo/delivery.md) |
| Revision / status | **`VB-ZCONDO-SHORT-R2`** (28 Oct 2026, Film); **`ready-for-mark`**. Spikes `SP01` (corridor plate) and `SP02` (section cutaway) are still required before Boss produces plates; they do not block Mark's scene sheets. Supersedes `VB-ZCONDO-SHORT-R1` (same day) |
| Scripts | TH [../../../scripts/zombie-condo/short/script.md](../../../scripts/zombie-condo/short/script.md) `ZCONDO-SHORT-TH-R2`; EN [../../../scripts/zombie-condo/short/script-en.md](../../../scripts/zombie-condo/short/script-en.md) `ZCONDO-SHORT-EN-R2`; both user-approved 28 Oct 2026 |
| Fact-check | [../../../scripts/zombie-condo/short/fact-check.md](../../../scripts/zombie-condo/short/fact-check.md), Boat recheck R2 (28 Oct 2026): both `ready-for-storyboard` |
| Style profile / tier | Survival drama + light fantasy, second person; illustrated 3D (Blender pre-render); licensed low drone from B03 + sparse SFX; outline captions; chrome hidden; comment-prompt cliffhanger; **Full** tier |
| User decisions used | 28 Oct 2026 (Asia/Bangkok), relayed by the coordinator. **Q1:** licensed low drone from B03, ducked under the VO. **Q2:** hide the `ทำไมล่ะ` label and the progress bar on TH and EN. **Q4:** plates stay local and are regenerable from build scripts; no LFS. **Q3/Q5:** “เห็นทั้งตัว มีหน้า เลือด มุมมองในห้องอาจ slice ครึ่ง”, i.e. a full-body "you" with a visible face, blood allowed, and interiors may use a half-slice cutaway |
| Target / timing | 40–60 s at 30 fps, 1080×1920; both versions ≈58 s, **`estimated`** (TH Botnoi and EN edge-tts not yet generated or measured) |
| Target checkout | `claude/zombie-condo-reel-script-ade441` @ `f9ee024` (= `main` merge of PR #79) + untracked `scripts/zombie-condo/`, `storyboards/zombie-condo/` |
| Scope | Whole Short, beats `ZCONDO-SHORT-S01-B01`–`B10`. No Long. One brief file covers both deliverables: the picture plan is shared and each deliverable has its own timing table ([VD-ZC-TL](#vd-zc-tl--one-shot-plan-two-conforms)) |
| Index | [index.md](index.md) (compact scoped index; no sequence blockout exists yet) |

## Visual intent

- **Audience knowledge and mood:** the viewer is addressed as "you" (คุณ). On screen, "you" is embodied by one recurring character ([VD-ZC-CH](#vd-zc-ch--you-character)). The viewer spots the danger a beat before the VO says it (hook). After that, they watch "you" inside one sealed unit where every tip becomes a physical action. The feeling runs jolt → urgency → small "aha" → grim control → isolation → unease. Only the corridor (B01–B02) and the city (B08) are outward views. Everything else turns inward and quiet.
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

- **Camera language (R2):**
  - No first-person POV shots in R2 ([POV re-check](#pov-re-check-r2)).
  - Perspective over-the-shoulder and close shots show the face and hands. Inserts show objects.
  - Section shots use one long-lens camera family, trucking sideways along the unit.
  - B08 is the one exterior wide.
  - Video plates bake their spatial moves in Blender. Still plates get slow pushes from Remotion `pictureMove`.
- **Conceal/reveal constraints (story and user decisions, 28 Oct 2026):**
  - The figure is on screen by **2.0 s**. Film's target is F45 (1.5 s), so it reads before the VO names it.
  - The unit door has **no peephole, viewer or door camera** in any shot (`CL05`).
  - **No one outside is ever shown or implied in B09–B10.** In the section, the corridor side is a solid, unlit black cap ([`ZC-CUT-02`](#vd-zc-cut--section-cutaway)). In door-face shots, the door gap and the under-door gap are black, with no light line and no feet shadow. The knock exists in sound only.
  - The pounding (B02) and the knock (B09) are designed as categorically different sounds ([VD-ZC-AU](#vd-zc-au--music-and-sfx)).
  - The barricade is a light cabinet that can obviously be moved (`CL02`), never nailed, welded or wedged permanently.
  - No weapons anywhere, including improvised ones held by "you".

<a id="vd-zc-ch--you-character"></a>
## `VD-ZC-CH` — "you" character

- **Decision:** one recurring adult **man**, **Thai, about 28**, a condo resident who lives alone.
  - Build and height: slim, average, 1.72 m.
  - Face and hair: short black hair, soft rounded stylized features, expressive brows.
  - Clothes: faded dark-teal tee, grey drawstring shorts, barefoot indoors; flip-flops by the door in B01.
  - Day-three variant: the same clothes, now creased and lightly stained; hair messier; light stubble; darker under the eyes.
  - Expressions: neutral/tired, startle, fear, focused, listening, frozen. Faces are fully visible, including in close-ups.
- **Relation to "you":** the VO is second-person narration addressed to the viewer. The man is the viewer's on-screen stand-in.
  - He is never named and never speaks, so no lip-sync is needed.
  - The narration is not his voice.
  - He looks into the lens once, at the end of B10 (Film recommendation, [Q-R2-2](#questions-for-the-user)), which hands the B10 question from "you" on screen to "you" watching.
- **Why a man:** the EN narration voice is male (edge-tts, delivery record), so the voice and the stand-in do not pull against each other for listeners who hear the VO as an inner voice. This is a casting choice, not a story fact. The TH Botnoi voice gender is unknown ([Q-R2-1](#questions-for-the-user)). If it is female and the user prefers a match, swap the design before Boss builds `zc-you`. No beat or reveal depends on gender.
- **Lead rules now apply in full:**
  - He is the lead, so his visible artwork must be **≥480 px tall whenever he is in frame**, measured as the minimum across any move (Boss production rules).
  - He needs a rim/edge light in dark shots and a real ground shadow (Blender).
  - Hand-only inserts are not lead-visible shots.
  - He is never injured or bloodied ([`VD-ZC-GORE`](#vd-zc-gore--blood-ceiling)).
- **The infected (`zc-infected`):** an adult **female** neighbour in a long, pale sleep shirt, with long hair partly over her face. The silhouette is deliberately unlike "you". She has a stooped, too-still posture, a slow head turn and faint pale eye-shine. Blood stays within the ceiling.

<a id="vd-zc-gore--blood-ceiling"></a>
## `VD-ZC-GORE` — blood ceiling

User decision (28 Oct 2026): blood is allowed. Film sets the ceiling below.

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
- **Rules checked:** `docs/production-requirements.md` has no gore rule. It requires safety and licences under every profile ([delivery workflow](../../../docs/delivery-workflow.md#style-profile)).
  - `docs/planned-visual-components.md` says "Creepy, not gory: no blood, wounds, or injury", but that text belongs to the planned `povWatcher` preset design, which this Short does not use. The user's 28 Oct 2026 decision overrides it for these deliverables.
  - The script has no weapons and no violence instructions; this ceiling adds none.
- **Platform:** YouTube's violent/graphic-content and age-restriction policy was **not inspected** in this pass, so platform compliance is `unverified`. The ceiling is deliberately stylized and restrained to stay clear of graphic-content treatment. The coordinator or Boat may verify the current policy before release ([Q-R2-3](#questions-for-the-user)).

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
- **`ZC-CUT-03` Building stack:** portrait framing shows slices of the neighbour units above and below. They are simple dressed shapes with **no people**. They go dark with the unit in B03 ("ทั้งตึก") and stay dark afterwards. The lower slice sits under the caption band and stays dark for caption contrast.
- **`ZC-CUT-04` Section light:**
  - Light is motivated by the windows and practicals.
  - A soft "open-side" fill from the camera side lifts the interior. It stays a stylized device, at least 1.5 stops below the window key, so the blackout still reads.
  - Caps are matte, unlit-looking dark (`#1c1f24`) with a thin warm-grey edge line. They take no window light and no emission.
- **Per-beat evaluation:**

| Beat | Section? | Reason |
| --- | --- | --- |
| B01 | **No** | The hook is depth down a corridor; a section flattens it |
| B02 | **Yes**, one shot (SH02) | Shows the infected pounding and "you" barricading in one frame; the door between them is the whole beat |
| B03 | **Yes** | The blackout runs through the rooms left to right and through the neighbours: "ทั้งตึก" in one image |
| B04–B07 | **Yes**, one master move per beat | A sideways truck carries "you" from room to room: bathroom (B04–B05) → kitchenette (B06–B07) → living, ending at the balcony door. Each truck goes further right, so it is progression, not repetition. Inserts carry the details |
| B08 | **No** | Exterior wide |
| B09 | **Yes** (SH01, SH03) | "You" inside, with the black corridor cap where the knocker is; isolation and concealment together |
| B10 | **No** | The hold needs the door's face (no peephole) and "you"'s face; perspective interior |

## Visual progression

| Scene / beat refs | Visible action | Information / emotional change | Visual form and reason | Repetition / reason to return |
| --- | --- | --- | --- | --- |
| B01 | Over his shoulder: he pulls the door open, trash bag in hand; a still woman stands at the far end of the corridor; long-lens cut as she turns, blood at her mouth | Normal life → outbreak; the viewer spots her before the VO names her | **Reveal** through depth: long corridor, backlit silhouette, then a compressed long-lens close | Corridor perspective never returns |
| B02 | His face as he slams and bolts; section: she pounds and leaves bloody handprints on one side of the door while he drags the cabinet flush on the other; close: he freezes, back to the cabinet | Corridor closed; sound rule planted (`CL01`, `CL02`, `CL04`) | **Action + simultaneous geography** (section); the freeze is the only still moment | The door/cabinet returns in B09–B10, now with the outside sealed black |
| B03 | Section: lights die room by room, then in the neighbour slices | Power gone, building-wide; every clock starts | **Event** across space | Section language established for B04–B09 |
| B04 | Section truck into the bathroom: shower tap still running; generic tower diagram (pump → roof tank → pipes; power cut stops the pump; the tank level drains); fill inserts of bucket, pot and bottles; lids on, four buckets lined up | Water becomes a finite stock | **Demonstration + diagram** (`ZC-C01`, `ZC-C02`, `ZC-C03`, `ZC-C15`); flat schematic, so it reads as explanatory | Verb: *fill* |
| B05 | Same bathroom, toilet end: bottles on the basin, bucket by the toilet; bucket poured from a little height; cistern lid lifted, clear water; red cross over the bowl | The cistern "aha" | **Reveal** (lid lift) + one correction mark (`ZC-C05`, `ZC-C07`, `ZC-C08`, `ZC-C21`) | Verb: *discover*; the camera has moved along the room, not repeated it |
| B06 | Truck into the kitchenette: fridge shut while the cold clock reads about 4 h / about 2 days; one quick open, the fridge light does **not** come on, he takes ready-to-eat items; order device fridge → freezer → cans | Food plan fixed by the clock | **Comparison/order device** over an action (`ZC-C10`, `SRC022`) | Verb: *sort*; the dead fridge light restates the blackout |
| B07 | Close: he reaches for the boxed camp stove, stops, slides it back unlit; the section truck continues to the living room, where he sits with bread, fruit, nuts and a can; the balcony door is ahead | Cooking removed; the danger is the stove, not the zombie | **Refusal gesture**: an action that stops (`ZC-C13`; `ZC-C14` visual constraint) | Verb: *refuse*; ends at the balcony door and hands off to B08 |
| B08 | Night balcony; slow spatial push-out past the railing over a blacked-out generic city with fires and smoke; he stands in silhouette | Scale of collapse; rescue hope gone | **Spatial reveal**, the only exterior wide (fiction, `ZC-C19`) | Unique; the emotional low |
| B09 | Section, day three: he sits on the floor near the entry; two buckets, cans and a phone around him; counters tick down; knocks; close on his face as he hears them; section hold in ≈1 s silence, the black corridor cap left of the door | A new unknown at the door (`CL03`) | **Inventory + reaction + concealment**: the knocker's side is visibly *nothing* | Returns to the B02 composition with the outside now black |
| B10 | Perspective from inside: the plain door face (no peephole), cabinet, him standing between; the question with three choice labels; he turns his head from the door to the lens | Decision handed to the viewer | **Held composition + fourth-wall glance** | Ends on the image the story built toward |

Repetition check:
- The four tip beats B04–B07 share one master device, the section truck, and each moves further right through a different room.
- Each has a different verb (fill, discover, sort, refuse) and a different explanatory form (diagram, mark, order device, none).
- Overlays appear in B04, B05 (one mark), B06 and B09–B10, each in a different form.
- No claims are added by visuals. The diagram is generic and schematic.

## Scene decisions

Shot IDs below are **shared by both deliverables**, `ZCONDO-SHORT-S01-Bxx-SHyy`. Mark may split, merge or reorder shots within a beat (routine refinement) while keeping the decision ID. "Video" means a Blender video plate; "still" means a Blender still plate + Remotion `pictureMove`.

| Scene / beat refs | Decision ID | Set / actors / props / effects medium | Framing / camera intent (1080×1920) | Light / shadow / color | Why / fallback |
| --- | --- | --- | --- | --- | --- |
| All | `VD-ZC-00` | **Hybrid: Blender pre-rendered plates + Remotion screen layer.** All sets, characters and props are 3D in Blender, rendered to stills or short video plates. Remotion owns timeline, VO, captions, overlays, SFX/music and export | Plates rendered natively in portrait at 1080×1920 (no crop from landscape) | Blender owns all scene light and shadow; Remotion adds no light | Unchanged from R1: an `existing-integrated` media path; GLB/Three.js is `missing` ([feasibility](#blender-feasibility-and-runtime-status)). Fallback: all-still plates + `pictureMove` |
| B01 | `VD-ZC-01` (R2) | `zc-corridor`, `zc-you`, `zc-infected` (blood: mouth, chin, shirt; smear trail on the floor). SH01 video, SH02 video | SH01 **OTS** behind his right shoulder (head/shoulder in the left-third foreground, ≥480 px), vFOV ≈55°. He pulls the inward door open; the trash bag stays above y 1560. The infected stands ≈12 m away by the far window, visible in the gap by **F45**. SH02 long lens (vFOV ≈18°) on her head/shoulders; the turn starts on "แล้วมันก็หันมา" / "Then it turns"; blood visible ≤1 s | Fluorescent strips, one flickering (seeded, baked); the far window backlights her into a hard silhouette with a thin rim; faint eye-shine on the turn | OTS introduces "you" and keeps the depth reveal. Fallback: SH01 as a still + `pictureMove`, keeping the F45 visibility |
| B02 | `VD-ZC-02` (R2) | `zc-unit` entry + **section with the corridor open** (`ZC-CUT-02`), `zc-you`, `zc-infected`, `zc-cabinet`, blood handprints (corridor face only). SH01 video, SH02 video, SH03 still | SH01 close, profile from the hinge side: his startled face + hand slamming and bolting on "ปิด! ล็อก!". SH02 **section** (`CAM-SECTION`), framed on corridor \| door wall \| entry: she pounds and handprints appear on the corridor side; he drags the cabinet flush on the other side (trimmable plate; absorbs EN +2.0 s). SH03 close, low angle: back to the cabinet, he freezes, eyes up, on "พวกมันตามเสียง" / "they follow sound" | Corridor cool and lit, unit warm; the door wall cap divides the two palettes; real contact shadows | The section shows threat and barricade in one frame. Fallback: SH02 as an interior perspective door shudder with off-screen pounding |
| B03 | `VD-ZC-03` (R2) | Section framed right of the door wall (corridor not in frame), with neighbour slices (`ZC-CUT-03`). 2–3 stills | Static `CAM-SECTION` frame (lead ≥480 px); motion is the light event | Practicals die room by room left → right, then the neighbour slices; window-only daylight remains | Stills swapped with `media` `startSec`/`endSec` (existing fields) give a frame-exact cascade inside 1.1–1.4 s. Fallback: hard cut lit → dark |
| B04 | `VD-ZC-04` (R2) | SH01 section truck into the bathroom (video). SH02 **2D screen-space diagram** of a generic tower drawn in section style, over a darkened blurred still. SH03 fill inserts (perspective video): bucket at the shower tap, pot, bottles at the basin. SH04 lids-on still: **four buckets**, one pot, six bottles | SH01 `CAM-SECTION` truck right from the entry into the bathroom; the tap in the shower is running. SH02 diagram y 300–1450. SH03 inserts ≈1.0–1.5 s each, high angle | Frosted louvre window top light + open-side fill; water with a bright rim | The diagram must read as explanatory, not as a photo of a real building. **Bucket, pot and bottles must all be shown** (Boat `FC-TH-04c`). Fallback: inserts as stills |
| B05 | `VD-ZC-05` | Bathroom (shower-only, no bathtub; toilet with cistern). SH01 still (section or perspective, Mark's choice), SH02–SH03 perspective video; Remotion red cross + two condition icons | SH01: bottles on the basin, bucket at the toilet, him beside them. SH02 side angle: bucket (visibly ≥4–5 L) poured into the bowl from ≈0.4 m. SH03 high OTS: cistern lid lifted, clear water, **no blue tablet**; cut to the bowl with the red cross on "ไม่ใช่ในโถ" / "not the bowl"; clear-drop and no-chemical icons on the conditions line | Frosted window top light; tiles cool; water clear, cyan tint | Discovery beat. Fallback: SH02/SH03 as stills |
| B06 | `VD-ZC-06` (R2) | SH01 section truck into the kitchenette (video), then fridge perspective shots: SH02 video (quick open), SH03 still (counter top-down); Remotion cold clock + order device | SH01 truck ends with him at the shut fridge, hand hovering; the clock device sits top third. SH02 quick open: the interior **stays dark (no fridge light)**, he takes ready-to-eat items, the door shuts. SH03 items in order, fridge items → freezer items → cans | Window light grows as the truck moves right; the fridge interior is dark but legible by spill | **Ready-to-eat only; no raw meat, fish or eggs shown being taken or eaten.** Film recommends keeping raw items out of frame entirely. Fallback: SH02 as two stills |
| B07 | `VD-ZC-07` (R2) | `zc-camp-stove` (unbranded, in its carry case, canister **not** mounted, no pot anywhere near it). SH01 perspective video (hands + his face), SH02 section truck to the living room (video) | SH01 close: he reaches to the cased stove on a shelf, stops, slides it back. SH02 section truck right: he sits in the living room with bread, fruit, nuts and a pull-tab can; the balcony door stays ahead at the right edge | Neutral daylight; no flame, glow or ignition light anywhere | **Never lit, never with a pot over the canister** (`ZC-C13`, `ZC-C14`). Optional icon-only overlay: crossed flame + CO. Fallback: SH02 as a still |
| B08 | `VD-ZC-08` | `zc-unit` balcony + `zc-city` (generic towers, no landmarks/brands, scattered fires, smoke, embers), `zc-you`. 1 video plate | Starts behind him at the railing, then a slow spatial push-out and slight rise past the railing (vFOV ≈60°). He stays in the right-third foreground, ≥480 px tall throughout, face in a fire-lit three-quarter profile at the start | Moon fill from upper left; fire-glow rim on him; smoke lit warm from below; city windows all dark | Parallax is the point. Fallback: single still push |
| B09 | `VD-ZC-09` (R2) | SH01 section still: day three, `zc-you` day-3 variant, **two buckets**, cans, phone; corridor cap black (`ZC-CUT-02`); Remotion day card + counters. SH02 perspective still or video: close on his face. SH03 section still: the SH01 framing tightened | SH01 `CAM-SECTION` on entry \| bathroom, him sitting against the wall; counters in the upper slice area: bucket icons 4 → 2, cans 6 → 4, battery → 12%. SH02 close on his face on "เสียงเคาะประตู" / "a knock": his eyes go to the door (screen-left). SH03 slow `pictureMove` push on the section during the ≈1 s silence and "พวกมันไม่เคาะ": him, the edge-on door, the cabinet, and to the left nothing but black | Flat overcast; the entry in deep shadow; a rim on him; the cap pure black | The counters carry the exact VO quantities. **Water counter uses bucket icons.** No rationing cue (`ZC-C22`). The black cap makes concealment structural. Fallback: SH02 skipped (section only) |
| B10 | `VD-ZC-10` (R2) | Perspective interior still/video facing the **door face** (plain, no peephole), cabinet against it, `zc-you` standing in the foreground; Remotion question + three choice labels | Him in the right-third foreground (≥480 px), three-quarter back to camera, looking at the door; very slow push (≤2 % over the hold). On "คอมเมนต์มา" / "Comment below" he turns his head to look into the lens (recommended; [Q-R2-2](#questions-for-the-user)). Choice labels stacked in y 700–1200 | Day-three overcast; the door in the darkest value band; door gap and under-door gap black, no light line or shadow | The face hands the decision over. Without the glance: a still hold. Ending: `A_fade` or hard cut (Editor); not a loop |
| Overlays | `VD-ZC-OV` | Remotion screen-space overlays: B04 diagram, B05 cross + icons, B06 cold clock / order device, B07 optional icon, B09 day card + counters, B10 choice labels | Screen space outside `pictureMove`, y 260–1450, x 90–990; in section shots, prefer the neighbour slice areas | Style "survival notes": warm-white strokes `#f2ede4`, amber accent `#f2a541`, danger red `#e5484d`, dark panel `#10151a` at ≈70 % | One owner draws each overlay once (lesson from `DF-20261027-catbox-short-home-stage`). Text per deliverable language; icons shared |

<a id="pov-re-check-r2"></a>
### POV re-check (R2)

- **B01: POV → OTS.** The user wants "you" seen whole and with a face. Opening on his shoulder and head introduces the stand-in in the first frame, keeps the corridor-depth reveal and meets the lead-size rule. The reaction moves to B02 SH01, his face at the slam.
- **B09–B10: POV push → section + face close + door-face hold.** The section shows him, the barricade and the black outside in one image, which makes concealment structural rather than a matter of camera angle. His face close carries the listening beat. B10 needs the door face for the no-peephole rule.
- **Result:** R2 has **no POV shots**. That is within the POV defaults, which say POV is optional. If Mark wants one eyeline insert of the door at his eye height after SH02 in B09, it is allowed as a routine refinement. It must keep the gap black.

## Shared picture for TH and EN

<a id="vd-zc-tl--one-shot-plan-two-conforms"></a>
### `VD-ZC-TL` — one shot plan, two conforms

Both deliverables use **the same shots, shot order, plates and overlay designs**. Each deliverable gets its own executable timeline, narration, caption cues and cut points, as the delivery workflow requires. Per-beat VO lengths differ by up to 2.0 s, so one locked set of cut frames would leave gaps or overlaps. Filling those gaps with silence or speeding up the VO is not allowed. **Timing forces a split of cut points only; the picture content does not split.**

Estimated beat durations (s), from the R2 scripts:

| Beat | TH | EN | EN − TH | How the picture absorbs it |
| --- | --- | --- | --- | --- |
| B01 | 4.4 | 4.1 | −0.3 | SH01 trimmed at its tail; the SH02 turn is anchored to the turn line per language |
| B02 | 5.6 | 7.6 | **+2.0** | The SH02 section plate (pounding + cabinet, rendered long) and the SH03 freeze still absorb it; SH01 keeps its action length |
| B03 | 1.1 | 1.4 | +0.3 | Dark-still hold after the cascade |
| B04 | 9.4 | 10.7 | +1.3 | SH02 diagram hold, then the lids-on still |
| B05 | 8.4 | 9.0 | +0.6 | SH01 still hold |
| B06 | 7.3 | 5.8 | −1.5 | The SH01 truck plate is trimmed at its head (`trimStartSec`); SH03 still trimmed |
| B07 | 5.3 | 4.5 | −0.8 | The SH02 truck plate is trimmed at its tail |
| B08 | 3.1 | 2.4 | −0.7 | Plate trimmed at its head. EN may keep ≤0.5 s of picture after the VO as a breath (an edit choice, inside the ≈58 s total) |
| B09 | 7.5 | 6.2 | −1.3 | SH01 counter hold; knock/silence timing is identical in both |
| B10 | 3.0 + 3 hold | 3.4 + 3 hold | +0.4 | The head turn is anchored to the last spoken line per language; the hold follows |

Rules:

1. **Sync anchors are per language and word-locked:** door open (F0), figure visible ≤F45 (picture-locked, same in both), slam on "ปิด!" / "Shut it.", pounding start, cabinet scrape on "ลากตู้มาดัน" / "Barricade it", freeze on the sound-rule line, light cascade on "ไฟก็ดับ" / "power dies", head turn (B01) on the turn line, knocks after "เสียงเคาะประตู" / "a knock", ≈1 s of silence before "พวกมันไม่เคาะ" / "They don't knock.", the B10 lens glance on "คอมเมนต์มา" / "Comment below".
2. **Plates are rendered with handles:** video plate length = the longer language's estimated shot share + 0.5 s head + 1.0 s tail. Section trucks run at constant speed through their middle so either end can be trimmed. Editor conforms with `trimStartSec` and `endSec`. **Final plate lengths are confirmed only after the measured TH Botnoi and EN edge-tts audio exist**, then re-rendered if needed.
3. **Stills absorb timing; video plates hold action.**
4. Overlays use the same layout per deliverable with language-specific text (below). Numerals and icons are identical.

### Per-deliverable on-screen text (overlays only; captions follow the VO verbatim)

| Overlay | TH | EN |
| --- | --- | --- |
| B04 diagram labels | ปั๊ม · ถังบนดาดฟ้า · ไฟดับ | Pump · Roof tank · Power out |
| B06 cold clock / order | ตู้เย็น ราว 4 ชม. · ช่องแช่แข็ง ราว 2 วัน · กระป๋อง ท้ายสุด | Fridge about 4 h · Freezer about 2 days · Cans last |
| B09 day card + counters | วันที่ 3 · bucket icon ×2 · can icon ×4 · battery 12% | Day 3 · same icons · 12% |
| B10 choice labels | เปิดประตู · ส่งเสียงตอบ · เงียบไว้ | Open the door · Call out · Stay silent |

Overlays draw original vector icons; counters show numerals beside the icons. B06 label wording mirrors the VO qualifiers ("ราว", "about"). Preaw and Boat check any change to the TH wording.

<a id="vd-zc-au--music-and-sfx"></a>
## Music, SFX and captions

### `VD-ZC-AU` — music and SFX (R2: music decided)

- **Music (user decision Q1, 28 Oct 2026):** one licensed low drone bed with no melody, entering under B03.
  - Ducked under narration: `video.audio[]` with `duckUnderNarration` ≈0.25, `existing-integrated`.
  - It drops out completely for the ≈1 s silence in B09 and returns very low under B10. It ends with the ending variant and does not loop.
  - No music in B01–B02; diegetic sound carries the hook.
  - The licence must allow commercial YouTube use and is recorded in a NOTICE beside the file. The source is not yet chosen (Boss/Editor).
- **SFX (all story events; licence + NOTICE; imported to `public/sfx/zcondo/`):**

| Beat | Cue | Design note |
| --- | --- | --- |
| B01 | Door latch + hinge, corridor fluorescent hum, one buzzing tube, wet slow neck creak on the turn | The hum starts at F0 |
| B02 | Slam, deadbolt clack, **pounding** (heavy, irregular, fists/body, door rattle in the frame, wet slaps as the handprints land), cabinet scrape on tile | `CL01`: low, chaotic, resonant |
| B03 | Fridge compressor + AC cut together; pounding fades over ≈0.8 s | The silence after is the new room tone |
| B04 | Tap running (then thinner), water into plastic/metal/PET, lids clicking | Pitch rises as containers fill |
| B05 | Bucket pour + bowl siphon gurgle, ceramic cistern lid scrape | |
| B06 | Fridge seal pop, no compressor hum, packaging rustle | |
| B07 | Plastic case slide, a quiet set-down | No igniter click |
| B08 | High wind, distant crackle, a far dog bark, no sirens | Sirens would imply rescue |
| B09 | **Three soft knocks**: dry knuckle raps, evenly spaced ≈0.45 s, close, no rattle; then ≈1 s of near-total silence, drone out | `CL03`: categorically different from `CL01` |
| B10 | Room tone + drone very low | |

### `VD-ZC-CAP` — captions and chrome

- Outline preset at the bottom (`video.captionStyle`, default; `existing-integrated`). TH uses the script's ซับ chunks; EN uses one caption per [tts-en.txt](../../../scripts/zombie-condo/short/tts-en.txt) line. Captions are visible from F0.
- **Caption band:** `src/scenes/Subtitles.tsx` places portrait captions 134 px from the bottom at 51 px with line-height 1.65, so two lines occupy roughly y 1616–1786.
  - Every plate keeps key action and overlays out of y ≥1560.
  - In section shots this band falls on the dark lower neighbour slice (`ZC-CUT-03`).
  - Use the `box` preset only if a plate tests too busy (B08 fires).
- **EN risk:** `Subtitles.tsx` hard-codes `lang="th"` and `Noto Sans Thai`, so EN Latin rendering is **`unknown`** (`S-09`).
- **Chrome (user decision Q2, 28 Oct 2026):** `video.chrome: {channelLabel: false, progressBar: false}` on both TH and EN (`existing-integrated`, toolkit 10a).

## Technical handoff

### Scale baseline `SCALE-ZC-R2` (metres; `estimated` / `design choice` production baselines, not measured standards)

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

### Projection contract `PROJ-ZC-R2`

- **World `ZC-WORLD`:** Blender native, metres, Z-up, right-handed. Origin at floor level, centre of the unit-door threshold.
  - The door wall is the plane y = 0. The unit extends toward +Y (entry → balcony); the corridor lies at y < 0 and runs along X.
  - The unit interior spans x ∈ [−1.6, +1.6]. The **section cut plane is x = +1.78** (outer face of the removed near wall).
- **Perspective cameras:** render 1080×1920 natively, square pixels, sensor fit **vertical**. Classes give vertical FOV: OTS/medium ≈55°, close ≈35°, insert ≈30°, long lens ≈18°, B08 wide ≈60°.
- **`CAM-SECTION` (new class):**
  - Perspective, vFOV 20–24°, looking along **−X**, so screen-right = +Y (balcony) and screen-left = −Y (corridor).
  - Camera at x ≈ +17 m, lens height 1.5–2.0 m above the unit floor, tilt down ≤8°, **no roll and no pan**, so cut lines stay vertical.
  - Motion is a **sideways truck along Y only**, which gives slight, honest parallax between the caps (near) and the back wall (3.2 m deeper).
  - **Vertical coverage at the character plane (x ≈ 0) is 5.8–6.8 m.** Lead check: `Hpx = 1.72 × 1920 / coverage` ≥ 485 px at 6.8 m (≈550 px at 6.0 m).
  - The unit band sits around y 450–1400; neighbour slices fill above and below.
- **Transform owner:** video plates bake their camera moves and get **no** `pictureMove`. Stills get `pictureMove` only. Never both on one clip.
- **Screen `ZC-SCREEN`:** 1080×1920 px, origin top-left. Overlays and captions live here, outside the picture transform. Key action stays inside x 90–990, y 200–1550. Avoid the right edge x ≥960 in y 1100–1700 (platform buttons, estimate).
- **Clock:** 30 fps. Blender frame 1 ↔ clip frame 0. A clip's frame 0 ↔ the shot start after `trimStartSec`. All randomness (flicker, embers, smoke, cascade order) is baked with fixed seeds.
- **Lead size:** "you" ≥480 px tall whenever visible (all section, OTS, B08 and B10 shots); the minimum across each move is checked. Hand inserts are exempt. The infected is not the lead.

### Per-decision technical seams

| Seam | Decision |
| --- | --- |
| Composition | Full pre-render per shot; no WebGL. Remotion layers: plate (`media`, back) → overlays (screen space) → captions; chrome hidden. **Do not put overlay PNGs in the `media` `front` layer on scenes that use `pictureMove`**: `SceneRenderer.tsx` L98–112 draws front media inside the picture-transform container. |
| Section geometry | The near wall lives in its own collection, hidden for `CAM-SECTION` and shown for perspective shots. Caps are **separate closed meshes** (not boolean-on-render, not open edges). Required states: corridor-open (B02) / corridor-capped (B03+). Neighbour slices: lit / dark. Check: no back-face holes, z-fighting or light leaks at cap/wall joints at the truck start, middle and end. |
| Scale / projection | `SCALE-ZC-R2` + `PROJ-ZC-R2`; one projection owner (the Blender camera). The orthographic `projection` field is not used, and the validator rejects `media` with `projection` (`media.ts`). |
| Contact / identity | All contact (hand–door, hand–cabinet, bucket pour, hand–food, sitting on the floor/sofa) is solved and baked in Blender. The same `zc-you` rig and clothing appear throughout; the day-3 variant appears only from B09. |
| Depth / alpha | Opaque full-frame plates; no alpha video (`missing`, not needed). Overlays are vector or PNG with alpha. |
| Lighting / color | Baked in Blender. Proposal: Eevee, AgX view transform, sRGB output, PNG masters, H.264 yuv420p for runtime; the shift must be checked in `SP01`. Section fill per `ZC-CUT-04`. Channel demo lighting and the emissive cap are **N/A**, with this reason: Three.js/channel-default rules, no runtime 3D, survival profile. Kept: rims and real ground shadows. Blood is matte with no emission. |
| Motion / clock | See `PROJ-ZC-R2`. `OffthreadVideo` seeking is deterministic per toolkit 10a; confirm with this codec. |
| Loading / resources / storage | **User decision Q4 (28 Oct 2026): plates stay local, regenerable from build scripts, no LFS.** Runtime plates go under `public/assets/blender/zc-*/` and masters under `out/blender/`; neither is committed. MP4 is already Git-ignored. PNG stills are **not**, so Boss keeps them out of commits, e.g. with an ignore rule in Boss's scope. Commit only sources, `build.py`, manifests and the render/encode commands. Each manifest records the regeneration steps and output checksums. |
| Contract / delivery | No new timeline fields are needed for plates, SFX, music, chrome or the blackout cascade. **New shared overlay capability needed** (`S-08`). Composition IDs distinct per deliverable (e.g. `ZCONDO-SHORT-TH`, `ZCONDO-SHORT-EN`) in `src/videos/zombie-condo/index.ts`; narration at `public/narration/<CompositionId>.mp3`. |
| Feasibility / cost | About 13 short video plates (≈40–45 s of frames incl. handles) + ≈12 stills, plus the section caps and a face rig. Render time, file size and face-rig cost are **unmeasured** (`SP01`, `SP02`). |

### Blender feasibility and runtime status

Inspected 28 Oct 2026 on `claude/zombie-condo-reel-script-ade441` @ `f9ee024`. Unchanged in R2.

| Capability | Status | Evidence |
| --- | --- | --- |
| Blender application | available | `/Applications/Blender.app/Contents/MacOS/Blender --version` → `Blender 5.2.3 LTS`, build 2026-10-22 |
| Blender MCP connection | **connected** (read-only probe) | `get_blendfile_summary_path_info` → `status: ok`, unsaved, dirty, no file path; `get_objects_summary` → scene `Scene` with the default `Camera`, `Cube`, `Light` only. The open scene is **not** project work. The MCP add-on/server version was not exposed: `unknown` |
| Project Blender sources | `missing` | No `assets/blender/` directory |
| Pre-rendered still in the timeline | `existing-integrated` | `MediaClip` `kind: 'image'` (`src/scenes/types.ts`), `validateSceneMedia` (`src/scenes/media.ts`), `<Img>` in `MediaLayer` (`src/scenes/MediaLayers.tsx`); toolkit 10a verification 2026-10-27 (issue #70, `tests/media.test.ts`). Screen-space only; not allowed with `projection` |
| Pre-rendered video plate | `existing-integrated` | `kind: 'video'` → `<OffthreadVideo trimBefore=…>`; `trimStartSec`, `playbackRate`, `startSec`/`endSec`. Blender codec/colour untested (`SP01`) |
| Picture push on stills | `existing-integrated` | `pictureMove` wraps background + media (`SceneRenderer.tsx` L84–112) |
| Chrome off / music ducking / SFX / caption style | `existing-integrated` | `video.chrome`, `video.audio[].duckUnderNarration`, `scene.sfx[]`, `video.captionStyle` (toolkit 10a) |
| Alpha video; image sequences | `missing` | No `transparent` option; one image per clip. Not needed |
| GLB/glTF in Three.js/R3F | **`missing`** | `package.json` declares none of these packages; `npm ls --depth=0` lists `@remotion/three@4.0.538`, `three@0.171.0`, `@react-three/fiber@9.1.2`, `@react-three/drei@10.7.9` only as **extraneous**; no source imports; no `src/three/` or `src/camera/` |
| Generic screen-space overlay | `missing` | `SceneVisual` modes are CATBOX-specific (`src/assets/visuals/types.ts`) |

**Verdict (unchanged):** Blender **pre-render** for every set, character and prop, including the section cutaway, which is purely Blender geometry and camera work and needs no new runtime. **No GLB/Three.js in R2.**

**Spikes for Boss (before plate production):**

- **`SP01` corridor plate.**
  - Scope: `zc-corridor` blockout + `zc-you`/`zc-infected` placeholders. Render `B01-SH01` (OTS) at 1080×1920, 30 fps, ≈90 frames via `assets/blender/zc-corridor/build.py`. Encode to H.264 and load it as `media` `kind: 'video'` in a throwaway local timeline with one TH caption.
  - (a) The infected is a readable silhouette ≥150 px tall by F45, and the "you" head/shoulder is ≥480 px.
  - (b) CLI frames F0/F45/F89 match the Blender PNGs; any colour shift is recorded.
  - (c) Direct render vs. remount are identical at those frames.
  - (d) The caption band y 1616–1786 stays readable.
  - (e) Render time per frame and file size are measured.
  - (f) The connection, the Blender version and the MCP tool list are recorded in the manifest.
- **`SP02` section cutaway.**
  - Scope: `zc-unit` grey blockout with caps and neighbour slices. Render `CAM-SECTION` stills at the B02 framing (corridor open) and the B09 framing (corridor capped), plus a 60-frame truck.
  - (a) "You" ≥480 px at the truck start, middle and end.
  - (b) Caps are closed: no holes, z-fighting or light leaks at the start, middle and end.
  - (c) In the capped state, a frame-step and a luminance check show **nothing rendered** in the corridor zone (pure cap colour).
  - (d) The lower neighbour slice behind the caption band is dark enough for outline captions.
  - (e) Render time is measured.
- **Studio:** expect `DF-20261026-studio-emfile`; CLI stills/renders are the evidence.

### Dev findings consulted (28 Oct 2026, against `f9ee024`; unchanged in R2)

| Finding | Last checked / scope | Effect on this brief | Outcome |
| --- | --- | --- | --- |
| `DF-20261026-studio-emfile` | 2026-10-26 / `906a85e`, open | Studio play/seek may fail | Use conditionally: CLI renders are the evidence for `SP01`/`SP02` and samples |
| `DF-20261027-catbox-short-home-stage` | 2026-10-27 / PR #38 branch, fixed | One owner per overlay; lead kept inside the portrait crop | Use conditionally: `VD-ZC-OV`; lead rule in `PROJ-ZC-R2` and the `CAM-SECTION` coverage limit |
| `DF-20261026-subpixel-stage-projection` | 2026-10-26 / `906a85e`, fixed | Orthographic DOM/SVG stage | Irrelevant: no `projection` stage is used |
| `DF-20261026-duplicate-types` | 2026-10-26 / `906a85e`, workaround | `node_modules` contains many `* 2` duplicate directories (none under `@types/`) | Boss revalidates `npm run typecheck` before runtime work; not run in this planning pass |

No finding covers Blender, sections or pre-rendered plates yet. Boss records the `SP01`/`SP02` results as new findings.

## Boss asset and capability needs

All are `missing` at `f9ee024`. They are listed in dependency order. Paths follow [blender-mcp-workflow](../../../docs/blender-mcp-workflow.md#2-shared-source-และ-export-contract).

| ID | Need | Owner path (proposed) | Consumers |
| --- | --- | --- | --- |
| `S-01` | `SP01` + `SP02` spikes + `zc-calibration` view | `assets/blender/zc-corridor/`, `assets/blender/zc-unit/`, `out/blender/` | All |
| `S-02` | `zc-corridor` set (doors without peepholes, fluorescent strips, end window, generic signage without text/brands), with blood smear trail and door-handprint decal states (clean / pounding) | `assets/blender/zc-corridor/` | B01–B02 |
| `S-03` | `zc-unit` set in the linear plan `ZC-CUT-01`: entry (inward door, deadbolt, **no peephole**), shower-only bathroom (toilet + cistern, frosted louvre window), kitchenette (sink, fridge, counter, shelf), living, balcony. **Section kit:** removable near-wall collection; closed **wall-cap meshes** for the external wall, partitions and slabs at the x = +1.78 cut; a corridor-open / corridor-capped switch; `CAM-SECTION` rig with a Y-only truck. Lighting variants: powered morning, blackout day, night, day three; open-side fill per `ZC-CUT-04` | `assets/blender/zc-unit/` | B02–B10 |
| `S-04` | `zc-unit-stack` neighbour slices above/below (linked, lightly dressed, no people), lit/dark states | `assets/blender/zc-unit/` | B02–B09 section shots |
| `S-05` | `zc-city` night backdrop: generic towers, dark windows, seeded fires, smoke, embers; no landmarks/brands | `assets/blender/zc-city/` | B08 |
| `S-06` | `zc-you`: full-body rig + **face rig** (neutral/tired, startle, fear, focused, listening, frozen; eye direction for the B10 lens glance), day-1 and day-3 variants (creased/stained shirt, messier hair, stubble). `zc-infected`: rig for the head turn and pounding hands, blood decals within `VD-ZC-GORE` | `assets/blender/zc-you/`, `assets/blender/zc-infected/` | All |
| `S-07` | Props: trash bag, `zc-cabinet`, 4 buckets + lids, pot + lid, 6 PET bottles, cistern lid, `zc-fridge`, ready-to-eat foods, 6 pull-tab cans, nuts, `zc-camp-stove` in case, phone, flip-flops. All unbranded | `assets/blender/zc-props/` | B01–B10 |
| `S-08` | **Shared screen-space overlay capability** (types + validator + renderer together): step diagram, timed icon counter (tick from → to), ordered list/clock device, mark (cross/check), stacked choice labels, with per-deliverable text; frame-driven, outside `pictureMove`. Fallback, existing today: static alpha PNGs as `media` `kind: 'image'` on scenes **without** `pictureMove` | `src/assets/overlays/` + `src/scenes/` | B04–B07, B09–B10 |
| `S-09` | EN caption check: Latin rendering, `lang` attribute and font in `Subtitles.tsx` | `src/scenes/Subtitles.tsx` | `ZCONDO-SHORT-EN` |
| `S-10` | Plate renders with handles per this shot plan: PNG masters + H.264 runtime files, manifests (frame ranges, cameras/vFOV, section state, colour settings, regeneration command, checksums); local only, nothing committed | `public/assets/blender/zc-*/`, `out/blender/` | Editor |
| `S-11` | Licensed drone bed + SFX set with a NOTICE per file | `public/sfx/zcondo/`, `public/music/zcondo/` (proposed) | Both |

Editor (after Boss): two timelines, `scripts/zombie-condo/short/timeline.json` (TH) and an EN timeline (path chosen by Editor/coordinator), both registered in `src/videos/zombie-condo/index.ts`, each conformed to its own measured narration, with chrome hidden.

## Handoff to Mark

- **Constraints to preserve:**
  - Beat IDs and story timing per language; the infected visible by 2.0 s (target F45).
  - No peephole/viewer/door camera.
  - Nobody, no light leak and no feet shadow outside the door in B09–B10; the corridor side capped black from B03 on (`ZC-CUT-02`).
  - The pounding vs. knock design; the movable light cabinet; no weapons.
  - B04 shows bucket, pot and bottles (four buckets) with lids going on.
  - B05: shower-only, bucket ≥4–5 L poured from a little height, cistern with clear water and no tablet, a "not the bowl" mark.
  - B06: ready-to-eat only, nothing raw taken or eaten, the fridge light dead.
  - B07: the stove never lit and never with a pot.
  - B09: bucket icons, quantities exactly as the VO, two buckets visible.
  - Continuity of the buckets, pot and bottles; daylight B04–B07, night B08, day three B09–B10.
  - The `VD-ZC-GORE` ceiling (blood only in B01–B02, never on "you").
  - "You" ≥480 px whenever visible.
  - Generic city and building, no brands.
- **Decided here; do not reopen per shot:** `VD-ZC-00` medium, `VD-ZC-CH` character, `VD-ZC-GORE`, `VD-ZC-CUT` (which beats use the section, the layout, the corridor rule), `PROJ-ZC-R2` incl. `CAM-SECTION`, `SCALE-ZC-R2`, no POV, video vs. still per shot, overlay style `VD-ZC-OV`, two conforms `VD-ZC-TL`, music/chrome.
- **Left to Mark:**
  - Exact cameras and key frames, including truck start/end Y values within `CAM-SECTION` limits.
  - Acting and expressions per shot.
  - Splitting/merging shots inside a beat.
  - The B03 cascade order and timing.
  - Overlay layout within `ZC-SCREEN`.
  - Whether B05 SH01 is a section or a perspective shot.
  - The optional B09 eyeline insert.
  - Shot-local sync points per language, marked `estimated`.
- **Format:** one scene-sheet set covering both deliverables is acceptable because the shot plan is shared, but each sheet needs **separate TH and EN timing columns** and sync anchors.
- **Missing evidence:** measured TH/EN audio; `SP01`/`SP02` results; the Blender colour pipeline; `S-08`; `S-09`; music and SFX sources; YouTube policy check for the blood ceiling.
- **Boundaries:**
  - B02 SH02 (corridor open) → SH03 close → B03 section (corridor out of frame, capped from here on).
  - B07 SH02 truck ends at the balcony door → B08 exterior.
  - The B09 SH03 composition echoes B02 SH02 framing, so the return reads as the same door wall.

## Open risks

| ID | Risk | Affects | Response |
| --- | --- | --- | --- |
| `RK-01` | TH/EN timing unmeasured; beats may shift ±1–2 s | `VD-ZC-TL`, all plates | Handles, constant-speed trucks, still-heavy tip beats; lock after measured audio |
| `RK-02` | Pre-render cost; a face rig and section caps add build time; no Blender sources yet | `VD-ZC-00`, `VD-ZC-CH`, `VD-ZC-CUT` | `SP01`/`SP02` measure; fallback all-stills + `pictureMove` |
| `RK-03` | Local-only plates: other machines/workers must regenerate; PNG stills are not Git-ignored | `S-10` | Manifests + `build.py` + checksums; Boss keeps plates out of commits |
| `RK-04` | No generic overlay capability; front media moves with `pictureMove` | `VD-ZC-OV` | `S-08`; PNG fallback only without `pictureMove` |
| `RK-05` | EN caption font/lang hard-coded to Thai | `ZCONDO-SHORT-EN` | `S-09` |
| `RK-06` | Busy plates (B08 fires) vs. outline captions | B08 | Dark lower quarter; `box` preset fallback |
| `RK-07` | Colour shift Blender PNG → H.264 | All video plates | `SP01` (b) |
| `RK-08` | Studio unusable (`DF-20261026-studio-emfile`) | Review | CLI evidence |
| `RK-09` | EN B08 is 2.4 s | B08 EN | ≤0.5 s breath; the push is already moving at F0 |
| `RK-10` | Blood vs. platform policy (age restriction, limited ads) | B01–B02 | Restrained ceiling `VD-ZC-GORE`; policy `unverified`; coordinator/Boat check before release |
| `RK-11` | Section caps leak light or reveal geometry behind the corridor cap | B09 concealment | `SP02` (b)(c); nothing modelled behind the cap |
| `RK-12` | Character gender vs. the TH Botnoi voice | `VD-ZC-CH` | Q-R2-1 before `zc-you` is built |

## Questions for the user

- **Q-R2-1 Voice/character:** the stand-in for "you" is designed as a Thai man about 28, to match the male EN voice. Is your Botnoi Thai voice male? If it is female, do you want the character to match (a woman), or keep the man?
- **Q-R2-2 B10 glance:** should he turn and look into the camera on "คอมเมนต์มา" / "Comment below" (recommended), or keep looking at the door?
- **Q-R2-3 Blood level:** the brief allows dark blood on the infected and smears/handprints on surfaces in B01–B02 only. There is no dismemberment, no wounds in close-up, no blood on "you" and none in the final hold. Is that the level you want? The YouTube policy has not been checked yet.

## Change log

- **`VB-ZCONDO-SHORT-R2`** (28 Oct 2026, Film), from the user's answers relayed by the coordinator the same day:
  - Q1 music (drone from B03, ducked); Q2 chrome hidden on TH and EN; Q4 local regenerable plates, no LFS.
  - Q3/Q5 "เห็นทั้งตัว มีหน้า เลือด มุมมองในห้องอาจ slice ครึ่ง" → new `VD-ZC-CH` (full-body man with a face), `VD-ZC-GORE` (blood ceiling), `VD-ZC-CUT` (section cutaway, per-beat evaluation, corridor rule).
  - Changed: `VD-ZC-01` (POV → OTS), `VD-ZC-02` (section SH02 with the corridor open, blood handprints), `VD-ZC-03` (section cascade + neighbours), `VD-ZC-04`, `VD-ZC-06`, `VD-ZC-07` (section trucks), `VD-ZC-09` (POV push → section + face close + black corridor cap), `VD-ZC-10` (door-face hold + lens glance).
  - Also changed: `SCALE-ZC-R1` → `SCALE-ZC-R2` (character, section, caps); `PROJ-ZC-R1` → `PROJ-ZC-R2` (`CAM-SECTION`, cut plane); spike `SP02` added; Boss needs `S-03`/`S-04`/`S-06` extended; `S-10`/`S-11` renumbered.
  - Unchanged: B05 and B08 decisions (except the character), feasibility verdict, overlays, captions, the TH/EN conform method.
- `VB-ZCONDO-SHORT-R1` (28 Oct 2026, Film): first brief. Medium: Blender pre-render hybrid; faceless "you"; POV at B01 and B09–B10. Superseded by R2.
