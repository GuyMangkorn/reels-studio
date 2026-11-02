# Visual brief — Z7-EP01-SHORT (ซอมบี้บุกเซเว่น ตี 2)

Deliverable: `Z7-EP01-SHORT` (Short, 1080×1920, 30 fps); delivery record: [../delivery.md](../delivery.md); target duration **115–120 s**, timing status **estimated** (script ≈116 s by hand count, voice sample paced 3.2–3.5 syl/s, full read not yet measured: see [Length risk](#length-risk)).
Revision: **`Z7-BRIEF-R1`**; status: **ready for the first storyboard pass** (text only; no stills, no look frames yet; legacy status name `ready-for-mark`). Author: Film, 2026-11-02.
Script: [script.md](script.md) `Z7-SCRIPT-R4.1`; fact-check: [factcheck.md](factcheck.md) `Z7-FACTCHECK-R4.1` ready-for-storyboard (0 fixes), clue ledger `CL01`–`CL08`, beats `B00`–`B12`.
Target checkout: `cde4183` on the worktree `claude/check-project-pipeline-4ec3f9` (clean at start). Scope: this one deliverable. No sibling brief, no shared brief.
Style profile: fiction survival thriller with a sound-rule twist (`default`, user may correct); engine **Painted 2D (p5.brush) + Remotion SVG inserts** (`default`); Gemini TTS Kore; ending **no loop**; no comment prompt.

Change log: R1 first brief. Nothing earlier.

## 1. Visual intent

**Audience knowledge and mood.** The viewer knows only what the narrator says: a lone night clerk, 50 zombies outside, 40 s of glass left. The picture must make three things readable without text help: (1) the shop is a lit island in a dead street, (2) the horde never looks at the clerk, (3) every head turn lands on a sound frame. Mood runs trapped dread (B00–B05) → cold click of understanding (B06–B07) → held-breath action (B08–B11) → quiet relief (B12).

**Colour / value key** (hex values are **estimates**; the look frames fix them):

| Zone | Key | Notes |
| --- | --- | --- |
| Shop interior | flat cool fluorescent white-green, light `#dfe9e3`, floor `#9fb0a8`, shelf shadow `#5b7a78`, counter `#c9d3cd` | Brightest thing on the street (script `B01`). Flat wash sets per `p5brush-large-fill-mottle`; no texture on large areas. Interior light model `VD18` from the kit (`draw.ts`) |
| Night outside | blue-black `#0b1620`, mid `#1c2f3d`; horde silhouettes `#1b2733` with a thin cool rim `#8fa3ad` | Horde reads as dark packed shapes behind the glass; faces are the only pale spots |
| Warm accents (the one warm light) | phone screen `#f2b25a` (the lure), back-door window glow and alley lamp `#c98f45` | Warm = sound source or exit. Glow peak ≤ 0.3 (`glow.tsx`), kept off faces. Nothing else is warm, so the phone and the back door pop when they matter |
| Stockroom | near black `#05090d`, box edges `#3a3126` only | Readable by silhouette and the back-door window glow only |
| CCTV | luma only mapped `#0a1410` → `#b8d1b9`, 2 px scanlines at 12 %, noise, 25 % vignette, mono timestamp `#e8f0e8`, small red REC dot | See [VD05](#scene-decisions) |

**Gore / platform note (Film default, user may correct):** no blood, no wounds, no biting. Zombies read as pale, slumped, hollow-eyed, mouths closed, mixed night-out clothes. This keeps the Short platform-safe and keeps the horde "silent".

**Camera language** (project default plus this story's rules):
- Eye level (≈1.5 m) and observational; slow drift or push on every painted shot (kit `pushCamera`), 1.02–1.06 scale over the shot. Exceptions: CCTV frames are **locked off** (a fixed security camera; only the CCTV noise moves), and the B06 freeze is held.
- **Repeated vantages carry the story.** (a) "Glass view": from inside the shop looking out at the horde through the front glass, used in `B00`, `B01`, `B05`, `B10`, `B11`, `B12`; the horde in it changes state: packed still → leaning on glass (`B02`) → shuffling past (`B05`) → surging (`B10`/`B11`) → standing still in broken glass (`B12`). (b) "Counter front": the clerk behind the counter, lit, repeated in `B01` and `B02`. (c) The same CCTV frame in `B00` and `B07`.
- No handheld wobble (painted). Impact is one camera impulse: dx/dy ≤ 8 px decaying over 8 frames at the glass crash (`S33`) only.
- **Lead height ≥ 25 % of frame (≥ 480 px of 1920)** whenever a lead figure is visible ([production rules](../../../docs/boss-asset-workflow.md#latest-production-rules)). Horde shots have the horde as lead; CCTV frames and `S36` keep the pair large enough to pass. No exception requested.
- **Caption band:** captions sit in the lower-middle ([vertical caption safe zone](../../../docs/production-requirements.md#vertical-caption-safe-zone), box x 120–888, y 288–1248). Faces and reveal objects sit above or beside the band; the counter and timer use the top rows (see [On-screen rules](#on-screen-rules)).

## 2. Sound direction

Checked against the library index `~/ReelsStore/library/sound/INDEX.md` (all entries generated, not user-listened unless the sidecar says so).

- **Music family:** one dark ambient horror underscore, narration-safe, sparse. Three levels: bed (`tension_drone-sparse-piano_01`, no drums) for `B01`–`B06`; build (`tension_pulsing-strings_01`, 90 bpm ticking pulse) for `B07`–`B11`; relief (`bed_warm-pad-felt-third_01` or `tone_soft-sustain-reflective_01`, then `stinger_outro-resolve_01`) for `B12`. **Do not use** `action_zombie-chase-percussive_01` (the story is a silence story) or `creature_zombie-horde-moans_01` / `creature_zombie-groan-single_01` / `creature_neck-creak-wet_01` (the horde makes no vocal sound anywhere).
- **Ending plan:** warm pad resolves, tiny tick-like accent on the `รอด 2` change, then a **hard cut to black** (silent, ≈1 s). No fade: a fade reads as a loop seam and the ending is final (Film proposal for the open "fade vs hard cut" item).
- **Ambience per location:** shop `room_shop-fridge-hum_01` (11 s, not a loop: Editor loops/crossfades) + `electric_light-flicker-buzz_01` sparingly; CCTV adds a hiss bed (`NEEDS-GEN`); outside/street `city_desolate-night_01` very low, heard only through glass (low-pass); stockroom `bed_sub-drone-fade-in_01` + `room_dark-empty-building_01`; alley `electric_streetlamp-hum-loop_01` + `outdoor_fog-forecourt-hush_01`.
- **SFX language:** dry, close and clean. Only seven **trigger sounds** exist and each lands alone: door chime, lock clack, back-door ring, low-battery chirp, phone alarm/ringtone, glass crash, mop knock. Everything else is footstep-level foley.
- **Silence policy** (script plan): `B06` first 2 s full silence; `B09` grab 1.5 s total silence; `B11` after the crash and during the door swing-back near silence; closing black silent. The horde is silent: its presence is shuffle foley (`foley_footsteps-shuffle-drag_01`) only when it moves, never groans.
- **Rule for every trigger sound (Requirement from the script):** it is also visible (door or object movement + on-screen sound word where the shot list says so + the head turn). Sound never replaces a clue.

### Sound-cue plan the story depends on

Door sounds are shown by **door movement, head turns and an on-screen sound word**; no door device is ever drawn, ringed or named. The chime has no visible source.

| Cue | Beat / shot | Visible on screen | Sound | Library ID or request |
| --- | --- | --- | --- | --- |
| SC01 | `B00` S01 | Front door leaf eases open (≥ 24 px at the leaf edge, 8–12 frames); shoulder → door → chime order; **no sound word** (clean CCTV hook, `CL03`) | Two-note generic door chime, isolated in the narration pause | `NEEDS-GEN` `door-chime-two-note_01`: source "two-note electronic shop door chime", action "ding then dong, 1 s ring-out", material "plastic speaker, bright", space "small tiled room, dry" (1.5 s) |
| SC02 | `B00` S02 | A few heads near the door snap on the chime's ring-out (≤ 0.3 s lag, never toward the clerk) | same sample, tail only | SC01 |
| SC03 | `B01` S06 | Another zombie bumps the door; it moves; **small sound word `ติ๊ง-ต่อง`** (same style as `B03`–`B05`, not ringed); every head snaps | SC01 | SC01 |
| SC04 | `B03` S11–S12 | Hand turns the lock, no door movement; sound word `แกร๊ก`; faces turn together | dry close clack | `foley_deadbolt-clack_01` (0.279 s) |
| SC05 | `B04` S15 | Back door pushed, moves; sound word `ติ๊ง-ต่อง`; alley group turns as one (in the small window) | SC01 slightly roomier (outdoor alley) | SC01 + Editor reverb; variant `NEEDS-GEN` only if the reverb fails |
| SC06 | `B05` S18 | Phone in pocket, 8 % low-battery icon, sound word; every head turns | generic double beep, small, piercing | `NEEDS-GEN` `phone-low-battery-chirp_01`: "phone low-battery double beep, generic, no brand tone" (0.6 s) |
| SC07 | `B08` S24 | Alarm set, volume to full (tiny key blips muted; the clerk mutes feedback) | none or near-inaudible | none |
| SC08 | `B10` S29 | Phone rings at the corner, screen lit warm, hordes turn | generic ringtone, muffled through the shop | `NEEDS-GEN` `phone-ringtone-generic_01` (loop 4 s, clear) and a low-passed variant by Editor |
| SC09 | `B11` S33 | Front glass bursts inward; same frame the back door is pushed (door covered by the crash) | the **biggest sound in the film** | `foley_glass-break_01` (1.0 s) + `impact_cinematic-boom_01`; if too small, `NEEDS-GEN` `shopfront-glass-burst_01`: "large plate-glass shopfront bursting inward, heavy crowd surge, long shard rain" (3 s) |
| SC10 | `B11` S35 | Back door swings back; rising half-chime; nearest shop-side heads begin to turn; mop stops the door | first note of SC01 cut mid-rise, then soft wood knock | SC01 (Editor cut) + `impact_knuckle-rap_01` (candidate) or `NEEDS-GEN` `mop-handle-door-knock_01` |
| SC11 | `B07` S21–S22 | Each replayed sound word is ringed at the exact frame of the head turn | rewind whoosh, then short accents in sync with each ring | `whoosh_heavy-cinematic_01` reversed by Editor; accents reuse SC01/SC04/SC06 |
| SC12 | `B02`, `B08`–`B11` | Timer (see rules) | dry clock pulse, not one tick per shown second in `B08`–`B10` | `tension_clock-pulse_01` (loop) + `ui_click-tick_01` |
| SC13 | `B03` S13, `B04` S16, `B05` S19 | Failure shots | glass-crack stinger; low impact hit; riser into hard stop | `impact_door-slam-body_01`, `stinger_low-muted-hit_01`, `reveal_riser-tension_01`; glass creak/crack `NEEDS-GEN` `glass-creak-crack_01` (2 s) |
| SC14 | `B09` S27 | Grab; everything cuts | silence 1.5 s, then fragile warm note | `tone_soft-sustain-reflective_01` |

Other `NEEDS-GEN`: CCTV hiss bed (loop 8 s), silent-sneaker footsteps on tile (close, very soft, 3 s). Existing reuse: `foley_footsteps-wet-concrete_01` (alley), `foley_glass-door-push_01` is **not** used (it is a sliding door).

## 3. Visual progression

| Scene / beat refs | Visible action | Information / emotional change | Visual form and reason | Repetition / reason to return |
| --- | --- | --- | --- | --- |
| `B00` S01–S02 | CCTV on the front door, `ซอมบี้ 50 \| คุณ 1` from frame 0; door eases open, chime; cut to the packed horde, a few heads turn | Hook: 50 outside, the door moved by itself; stakes in 3 s | Locked-off CCTV plate with painted-then-graded look; glass view | The CCTV frame returns in `B07` (identical) |
| `B01` S03–S06 | Clerk lit and ignored; monitor shows the last customer going into the stockroom at 01:00; another zombie bumps the door; all heads snap | Why does no one look at him; where is the customer; heads snap on sound (`CL01`, `CL02`, `CL05`) | Counter front + glass view + in-world monitor with two stacked CCTV tiles | Glass view and counter front are the two repeated vantages |
| `B02` S07–S10 | Mop, phone 8 %, spreading crack, face hold; timer 40 | What he has and the deadline | Tight inserts (flat hardFill crisp props, SVG phone) then one face hold | Props return: mop `B08`/`B11`, phone `B05`/`B08`/`B10`, crack `B08`/`B10` |
| `B03` S11–S13 | Imagined: lock clack, faces turn together, glass sags | Choice 1 fails by sound | "Imagined" grade + `ถ้า…` stamp; close then wide then failure | Same three-step shape in `B04`, `B05` (ask, sound, failure): the repetition teaches the viewer to wait for the sound |
| `B04` S14–S16 | Imagined: dark run, back door pushed, alley group in the small window turns | Choice 2 fails; back door rings; second group exists (`CL04`) | Silhouette run, then window view | Back door window returns `B09`, `B10`, `B11` |
| `B05` S17–S19 | Imagined: crouch, horde passes inches away, phone chirps | Choice 3 fails by his own phone (`CL06`) | Shelf POV, pocket insert, faces on glass | Phone becomes the lure |
| `B06` S20 | Freeze on the failure, dim, 2 s silence | "What happened first, every time?" | One held plate | — |
| `B07` S21–S23 | Replay `B00` frames slowed with ring; fast replay of every sound moment; hold on the horde | Rule: "มันไม่ได้ดู... มันฟัง" (`CL02`, `CL03`) | Same CCTV plate re-timed, ringed sound words | Pays off `B00`, `B01`, `B03`, `B05` |
| `B08` S24–S26 | Alarm set, phone laid at the far corner, clerk walks the other way with the mop | Inversion: the lure plan (`CL06`, `CL08`) | Phone insert, wide of the corner with faces inches away, tracking walk | Timer restarts |
| `B09` S27–S28 | Grab in the dark, customer alive, back-door window glows | Second reveal (`CL05`) | Silhouette then warm-lit face | Window returns `B10` |
| `B10` S29–S31 | Phone rings, hordes move, alley empties, hand on bar stops | The door would ring; wait for a louder sound (`CL04`, `CL07`) | Glass view, window view, hand close-up | Glass view and window view alternate |
| `B11` S32–S35 | 3-2-1-0; glass bursts, pair slips out; phone trampled; door swings back, mop jams | Payoff of the 40 s; last scare | Timer tight, crash, silence, door | Crash pays off `B02` crack |
| `B12` S36–S38 | Pair walks away; look back at the still horde; `รอด 2`; black | Relief, rule restated | Wide alley, glass view reversed, counter change | Counter closes the `B00` hook |

Every beat gives the viewer a new thing to see and a new question, none repeats a narrator-and-card pattern. Beats needing blockout proof: `B00` (door leaf + shoulder + chime timing), `B07` (identical-frame replay), `B11` (crash, door, swing-back, mop in two views).

## 4. Cast and casting lines

Decision `VD02`: all humans come from the template cast ([kit README](../../../src/painted/kit/README.md), `PEOPLE`); no new human look. Zombies are the one new look-defining creature (`VD04`).

| Role | Casting line | Reason |
| --- | --- | --- |
| Night clerk (you) | `man-crop` (34, 1.76 m, grey-blue short-sleeve work shirt, dark trousers; his default outfit already reads as a shop uniform; no wardrobe swap, no brand colours) | Working-age man, plain look, grey-blue reads on the cool shop palette. New recurring character for this episode |
| Last customer | `man-spiky` (24, rust jacket, jeans, sneakers) | Younger, rust jacket separates him from the clerk in the dark and in grayscale CCTV (hair and bulk) |
| Zombies | new look `Z7-ZOMBIE` built on `PEOPLE` templates (`man-crop`, `man-buzz`, `woman-curly`, `woman-ponytail`, `man-elder`, `boy-school` heads and bodies, skin pale, outfits torn/night-out, no blood) | Reuses the rig and proportions; only colour, posture and face are new |

Casting lines per beat (pose IDs from the sheet P01–P45; motions from `MOTIONS`; expressions from `EXPRESSIONS`). **Arms:** bent arms go back into depth ([CP-P](../../../docs/character-proportion-principles.md#cp-p-arm-depth)), no splayed elbows.

| Shot(s) | Casting line | Notes |
| --- | --- | --- |
| S03, S10 | `man-crop, P01, neutral` + `idle-breathe`; S10 `man-crop, P01, worried` | Counter front; hands on the counter edge use P01 over the counter plane |
| S08 phone insert | `man-crop, P10, worried` | Phone in both hands at the chest (CP-P10: elbows back) |
| S11 | `man-crop, P16 profile, scared` | Reach toward the lock; imagined |
| S14 | `man-crop, P38 run` (profile, `run-left-to-right`), scared | Imagined run through the stockroom (silhouette) |
| S15 | `man-crop, P16 profile, scared` | Pushes the back door |
| S17 | `man-crop, P35 crouch_hide (profile), scared` (`crouch-hide` motion) | Behind the shelf by the glass |
| S18 | `man-crop, P16 profile, terrified` reaching for the pocket too late | Phone prop `{kind:'phone'}` |
| S19–S20 | none (faces on glass); S20 freeze reuses S19 | |
| S24 | `man-crop, P10, whisper` | Alarm set; expression `whisper` |
| S25–S26 | `man-crop, P01` walking: `sideWalk` template, slow gait ≈0.7 m/s, `worried`; mop carried hanging (CP-P05) | Heel-to-toe is acted by the very slow gait |
| S27 | `man-crop, P12 hands at mouth (front), scared` held back; hand grab: contact on the wrist | |
| S28 | `man-spiky, shush` (**proposed pose P46, see handoff**) or fallback `man-spiky, P12, whisper`; `man-crop, P01, scared` | Finger to lips |
| S31 | `man-crop, P16 profile, worried` hand on the bar; `man-spiky, P16 profile, terrified` gripping the sleeve | Two-figure contact |
| S33–S35 | `man-crop, P16 profile, scared`; `man-spiky` same; mop jam P05-profile arm forward holding the mop | Mop is a new prop |
| S36 | `man-crop` + `man-spiky`, `sideWalk`, `neutral` → relief | Profile walk, no back view needed |
| Zombies (all) | `Z7-ZOMBIE, P01 + lean 0.06 + head down (stance Z-STANCE)`; shuffle in profile `sideWalk` slow; reach `P16` for the surge | **Deviation from the sheet, CP-P12:** a slack-arm forward-lean P01 variant, because no sheet pose is slumped and blank. Recorded here; Boss may promote it to the kit |

## 5. Set and prop list

All sets are **new episode sets** in `src/painted/z7eleven/` (Boss/Film per [look-assets](../../../docs/film-visual-brief-workflow.md#look-assets)); the WORLD FOG forecourt shop (`src/painted/worldfog/shop.ts`) is a gas-station shop in fog and is a **geometry/technique reference only** (same real-scale metre approach, same flat cool-white interior light), not reused as is (`unknown` whether its pieces are extractable; Boss to say). Generic signage everywhere (no real-store marks, no orange-green-red stripes).

**Plan (estimated, metres).** Named space `Z7-SHOP`: origin = floor at the centre of the front glass; x = along the glass, right as seen from inside looking out; y = up; z = depth into the shop from the glass (street side is z < 0). Shop 8 × 9 m.

| Item | Size / position (estimated) | Notes |
| --- | --- | --- |
| Front double glass door | 2 leaves × 0.9 m wide, 2.1 m tall, centre x 0, z 0; push handles at the meeting stiles; leaf opens inward | **Double front doors read in `B00`**; lock at the left leaf (S11); leaf movement is the only door "cue" |
| Front glass wall | x −4…+4, y 0–2.6, crack network starts at x −1.2…+0.4, y 1.0–1.9 | Crack from `B02` persists in `B08`, `B10`; the `B03` sag is imagined only |
| Counter | x +1.6…+4.4, z 1.4–2.2, 0.95 m high | Clerk behind it at z ≈ 1.0 |
| CCTV monitor | on the counter, 0.5 m wide, two stacked tiles | In-world prop for `B01` only |
| Shelves, drinks fridges | shelf rows along z in x −3…0; fridge wall at the back-left | Hide/reveal for the walk and the crouch; fridge edge visible in the CCTV frame |
| Far front corner (lure) | x −3.8, z 0.3 | Floor-level ledge/cloth under the phone |
| Stockroom door and room | door at x +3.2, z 8.5; room 3 × 3 m of boxes | Distance from the lure corner ≈ 10 m: at ≈ 0.7 m/s ≈ 14 s, matching timer 40 → ≈ 26 over `B08` (checkable) |
| Back door | 0.9 × 2.0 m, push bar at 1.0 m, **small wired-glass window 0.3 × 0.4 m centred at y 1.5**, opens outward into the alley | Window established in `B04` and `B09`, used `B10` |
| Alley | 3 m wide, wall opposite, one warm lamp, building corner to the screen right | Horde circling route = screen right; the pair exits screen left (`S36`) |
| Props | mop (new, leans by the counter), phone (kit `{kind:'phone'}` + SVG insert), keys/lock plate, generic signage (e.g. an unlettered lit sign and a "24" glyph), floor mat, hanging ceiling lights | Mop and signage are the only non-kit props |

**Scale baseline and projection contract.** Baseline: `man-crop` 1.76 m, 4 heads (head 0.44 m), `man-spiky` 1.72 m, zombies the same templates (all **estimated** from `PEOPLE_INFO`, not re-measured here). Set metres are the unit; every plate maps `Z7-SHOP` metres to pixels with one projector per shot (kit `Proj`, `cardProjector`; figures are flat cards at their depth; orthographic-like side set plates plus a perspective projector for the interior wide, as the WFOG shop did). Calibration view for Boss: clerk next to the counter (0.95 m) and the double door (2.1 m) in one frame at ≈ 400 px/m, showing the clerk ≈ 704 px tall (36.7 % of 1920). Near/far horde cards scale by the same projector. Separate checks: physical (door 2.1 m vs clerk 1.76 m) and projected pixel heights per shot. Status: estimated, to be measured in the first spike.

## 6. Crowd approach (50 zombies)

The count "50" is carried by the on-screen counter and the density of the horde, **never by drawing fifty individual figures in one frame**. Three tiers per shot:

| Tier | What | Count per shot (estimated) | How |
| --- | --- | --- | --- |
| T1 hero | Full `Z7-ZOMBIE` figures with faces, pressed to the glass or passing it | ≤ 4 | `drawFigure` with the cast rig, opaque multi-pass (`painted-opaque-cast`: dark figures must not be see-through) |
| T2 mid | Flat silhouette cards, 6 base shapes (stand, slump, lean left, lean right, head-down, reach), repeated with `hash(seed)` jitter in size ±8 %, offset and value | ≤ 12 | `washAt` + thin ink rim, painted far to near (`painted-layer-order`), lit from behind by the street lamp |
| T3 far mass | Overlapping head-and-shoulder blobs in the haze, one value band | a band, uncounted | `wash` only |

Rules:
- **Stillness is the horde.** Idle sway ≤ 3 px at ≈ 0.5 Hz per card, phase from `hash`. They move along the glass only in `B05` (≈ 0.3 m/s shuffle) and `B10`–`B11` (surge); the surge uses T1/T2 profile shuffle, not a rig run.
- **Gaze (`CL01`).** Every zombie's head faces a fixed point ≥ 25° away from the clerk's screen position (the "stare past"). Verified by a frame check in every shot where the clerk and horde are both visible. No zombie ever faces the clerk.
- **Head turn on a sound frame (`CL02`).** A turn is a head swap (`front` ↔ `left|right`, the rig's profile swap, see `painted-profile-head-turn`): an instant snap, with a 0–3 frame stagger by distance from the sound source so the crowd reads organic, never a wave. Zero turns in a shot without a sound frame.
- Mouths closed, no groan animation; no lunging, no reaching except `B10`/`B11` toward the ringing phone.
- Density states: `D0` packed still (`B00`–`B01`), `D1` leaning on glass (`B02`), `D2` moving along the glass (`B05`), `D3` surge toward the corner (`B10`–`B11`), `D4` standing still in broken glass (`B12`). Total visible per shot must never exceed what T1+T2 give; the alley group (second horde) uses the same tiers, ≤ 8 cards in the window view.

## 7. Scene decisions

| Scene / beat refs | Decision ID | Set / actors / props / effects medium | Framing / camera intent | Light / shadow / colour | Why / fallback |
| --- | --- | --- | --- | --- | --- |
| all | `VD01` | **Painted 2D (p5.brush)** for sets, cast, horde and CCTV plates; **crisp SVG** for the phone insert, the monitor bezel text, timer, counter, sound words and the `ถ้า…` stamp. One `BrushCanvas` per composition; hard cuts by default | 1080×1920 | Wash-flat sets; ink boil at the shared rate except the CCTV plate (see `VD05`) | Project default (`default`). Fallback: none |
| all humans | `VD02` | Template cast: `man-crop` clerk, `man-spiky` customer (casting lines above) | Lead ≥ 480 px | Rim light cool, no warm glow on faces | Reuse is a choice (project defaults): story needs two ordinary men, templates fit |
| `B01`–`B12` | `VD03` | Shop interior set and glass wall as in §5 | Counter front, glass view, back-door window view | Flat cool fluorescent interior (`VD18` model); glass uses the `sheen` veil workaround (`painted-glass-sheen-veil`); door frames, handles, shelf edges `hardFill` (`painted-straight-bars`) | Fallback for glass: a plain translucent wash with a hard highlight edge |
| `B00`–`B12` | `VD04` | New creature `Z7-ZOMBIE` + crowd tiers (§6); built by Film directly in `src/painted/z7eleven/` with key-pose stills for user approval ([look-assets](../../../docs/film-visual-brief-workflow.md#look-assets), [look-change](../../../docs/film-visual-brief-workflow.md#look-change)) | Faces readable in `S02`, `S09`, `S12`, `S19` | Pale `#c9d1cf` skin, rim only | **Look check required**: up to three zombie options shown to the user before Boss builds the crowd (no approved precedent). Fallback: silhouettes only, faces limited to T1 |
| `B00`, `B01` S05, `B07` | `VD05` | **CCTV look** = a painted plate (flat values, simplified) + a screen grade layer: luma-only green-grey, scanlines, noise, vignette, light barrel curve, REC dot, 10 fps held frames (clock quantised to 3 frames), mono timestamp | `B00`/`B07` full-frame feed, locked off, high corner camera at ≈ 2.6 m looking out at the double door; `B01` in-world monitor close-up, two **stacked** tiles (door/aisle cam on top, stockroom cam below) | `B00` frame also holds a shelf/fridge edge (left) and generic signage (top) so the store reads in 3 s | **Determinism:** the CCTV plate is painted with a fixed seed and a quantised clock (no ink boil), so `B07` reuses the **identical frames and crop** of `B00` when re-timed (`CL03`). Fallback: pre-rendered still sequence |
| `B00` S01 | `VD06` | `CL03` shoulder: pale/backlit, exactly **6 frames**, no head, no arm, order shoulder touches the door's outer edge → door moves → chime; contact at the frame edge (≤ 60 px of the shoulder visible at the right edge, handle-side leaf edge) | CCTV locked off | Backlit by the street lamp behind the glass | Readable on rewatch only, not meant to be caught first time; `B07` rings the same frames. Fallback: lengthen to 8 frames, record |
| `B02`–`B03`, `B05`, `B06`–`B07` | `VD07` | Imagined futures (`B03`–`B05`): sat −30 %, cool shift, slightly lifted blacks, grain +, `ถ้า…` stamp; the real world resumes at `B06` (freeze dims it) | Same vantages as the real shots, so the viewer compares | The `B03` glass sag, the `B04` run texture and the `B05` pass are imagined only and do not carry over | Fallback: stamp only. Timer is **frozen but the world keeps ambient motion** (`painted-story-hold-ambient-clock`: two clocks, `storyAt` for logic and `ambientAt` for sway/flicker) |
| `B01`–`B05`, `B07` | `VD08` | Sound words as Remotion SVG/typography overlays (not painted), anchored to the source (door, lock, back door, phone) and camera-mapped; chime word in `B01` is small and unstyled, in `B07` it is ringed; none in `B00` | Placed outside the caption band | White, dark outline, ≈ 100–120 px | Muted viewers still read the sound. Fallback: caption-style word at a fixed point |
| `B08`–`B11` | `VD09` | Timer and counter as Remotion overlays by the rules in §8 | Top rows only | White numerals, dark outline; frozen state dimmed to 40 % | Runtime component is a Boss/Editor dependency |
| `B09`, `B10`, `B11`, `B12` | `VD10` | Stockroom and alley sets (low-key) | `B09` locked-off, window view fixed | Warm window/alley lamp is the only light in the stockroom | Fallback: silhouettes against the window glow only |
| `B11` S35 | `VD11` | Back door swing-back with mop catch: door leaf angle animated by a pure function of time; mop as prop with contact at the door gap | Two-view cut: alley door close-up, then stockroom doorway looking toward the shop heads | Door stops a hand's width from the frame; mop handle crosses the gap | Contact is the risk (`unknown`): see spike SP-E. Fallback: cut on the catch, show only the mop crossing and the door stopping |
| ending | `VD12` | Last frame: hard cut to black, no loop, no fade (Film proposal); counter `รอด 2` with a tick accent | Black ≈ 1 s silent | — | Replaces the open fade-vs-cut item. User may correct |
| chrome | `VD13` | **Progress bar and channel label off** (Film recommendation; user may correct) | — | — | A progress bar kills dread and pre-announces the end, same reasoning as KSO `VD12` |

## 8. On-screen rules

**Counter `ซอมบี้ 50 | คุณ 1`:** on screen from frame 0 through `B12` (Editor/Boss overlay; Thai text unchanged), top row, left x 120, y 300–350 (the `PaintedLabel` slot-0 box, estimated), above the caption band. `คุณ 1` → `รอด 2` in `B12` with a tick accent and a 4-frame scale pop; no second counter.

**CCTV timestamp:** inside the CCTV frame (not the overlay), row at y ≈ 430–480, left x 120, legible for ≥ 30 frames in `B00` and in the `B01` playback (`01:00` visible). Latin digits, mono, no date, no real brand.

**Timer display rule (Film decision; script items Z7R4-03/05/06):**
- Shown values only at cuts, each constant within its shot: **40** (appears on "สี่สิบวินาที" in `S10`, with a single tick), **40 dimmed + `ถ้า…`** through `S11`–`S23`, **40** un-dimmed at `S24` (starts running in story time), **≈26** at `S27`, **≈18** at `S29`, **≈8** at `S31`. No continuous countdown between these.
- The tick is a pulse (≈ 65 per minute from `tension_clock-pulse_01`), **not** one tick per displayed second in `B08`–`B10`.
- The `≈8 → 3` gap is hidden behind the `S31 → S32` cut. `B11` is the only real-time stretch: **3 → 2 → 1** in `S32` (30 frames per value), and **0** lands on the first frame of `S33`, the crash frame. Film may run the whole timer continuously only if 0 still lands exactly on the crash frame after voice lock; otherwise this rule stands. The choice goes in the scene sheet.
- Position: slot 1 (y 360–410, left x 120), the `ถ้า…` stamp sits on the same row to the right of the numerals. Stepped numerals, no tween.
- Phone alarm insert (`S24`) shows a **timer-app style `00:22`**, never a clock time (the CCTV clock and the B00–B12 "≈02:00–02:04" stay unreconciled with a clock face; see open questions).

## 9. Shot plan (one shot = one timeline scene)

**38 shots**, `S01`–`S38` (working IDs; the scene sheets assign final IDs and keep legacy beat IDs). Nominal seconds sum to each beat window of the script table (post-tempo estimates). `Min` is the shortest the shot can hold without changing the story or a clue; `Flex` says how the shot stretches or shrinks (`A` = anchored to a narration phrase or a sound frame, `F` = picture-only hold that can shrink).

| Shot | Beat | Content (one line) | Medium | Nom s | Min s | Flex |
| --- | --- | --- | --- | --- | --- | --- |
| S01 | B00 | CCTV, double door, shoulder → door → chime | painted + CCTV grade | 2.5 | 2.5 | A (hook, never trimmed) |
| S02 | B00 | Glass view, packed horde, a few heads turn | painted | 0.8 | 0.8 | A (spills ≤ 0.3 s into B01) |
| S03 | B01 | Clerk behind counter, lit, in plain view | painted | 3.0 | 2.4 | A/F (loses "ไฟในร้านสว่างที่สุดในซอย" in trim T1) |
| S04 | B01 | Over-the-shoulder to the glass, horde stares past him | painted | 2.2 | 2.0 | F |
| S05 | B01 | Monitor close-up, 01:00 customer into stockroom, stockroom tile | painted + CCTV grade | 4.0 | 3.4 | A |
| S06 | B01 | Another zombie bumps the door, chime, every head snaps | painted | 2.0 | 2.0 | A |
| S07 | B02 | Mop by the counter (tight, hardFill) | painted | 1.5 | 1.0 | F |
| S08 | B02 | Phone 8 % (SVG insert) | SVG | 1.5 | 1.0 | F |
| S09 | B02 | Crack spreading, bodies pressed on the glass (D1) | painted | 2.5 | 2.0 | F |
| S10 | B02 | Clerk's face hold, timer 40 appears, one tick, then dead stop | painted + overlay | 2.5 | 2.0 | A ("คุณจะทำอะไรก่อน") |
| S11 | B03 | Imagined: hand turns the front lock | painted, imagined grade | 3.5 | 3.0 | A |
| S12 | B03 | Faces turn together, sound word `แกร๊ก` | painted | 3.5 | 3.0 | A |
| S13 | B03 | Failure: crack webs, pane sags (imagined) | painted | 2.0 | 1.2 | F |
| S14 | B04 | Imagined: dark stockroom run, box shapes only | painted silhouette | 3.0 | 2.5 | F |
| S15 | B04 | Back door pushed, small window, alley group turns, word | painted | 3.8 | 3.2 | A |
| S16 | B04 | Failure: alley packed, clerk pressed to the door | painted | 2.0 | 1.2 | F |
| S17 | B05 | Imagined: crouch behind shelf, horde passes behind glass (D2) | painted | 4.0 | 3.4 | A (loses "ห่างแค่กระจกกั้น" in T2) |
| S18 | B05 | Phone chirp in pocket, low-battery icon, heads turn | painted + SVG insert | 3.6 | 3.0 | A |
| S19 | B05 | Failure: faces on the glass above him | painted | 2.0 | 1.2 | F |
| S20 | B06 | Freeze on S19, dims, timer 40 dimmed; 2 s silence, then the line | painted (held) | 5.7 | 4.7 | A (silence 2.0 → 1.0 s) |
| S21 | B07 | `B00` CCTV frames re-timed slow, shoulder ringed, word `ติ๊ง-ต่อง` | same plate as S01 | 4.5 | 4.0 | A |
| S22 | B07 | Fast replay of sound moments with ringed words; clerk ringed once | existing frames + overlay | 3.5 | 2.5 | F |
| S23 | B07 | Hold on the horde, 0.5 s gap, "มันฟัง", low hit | painted | 2.8 | 2.8 | A |
| S24 | B08 | Timer un-dims at 40, alarm `00:22` set, volume to full | SVG insert | 2.5 | 2.0 | A |
| S25 | B08 | Wide of the corner: he lays the phone down, faces inches away | painted | 4.0 | 3.4 | A |
| S26 | B08 | Mop picked up, he walks the other way toward the stockroom | painted | 3.0 | 2.5 | F |
| S27 | B09 | Dark stockroom, hand grabs his wrist, 1.5 s silence, timer ≈26 | painted | 3.5 | 2.9 | A (silence 1.5 → 0.9 s) |
| S28 | B09 | Customer alive, finger to lips, nods to the glowing window | painted | 5.1 | 4.5 | A |
| S29 | B10 | Phone rings at the corner (warm), hordes surge toward it, timer ≈18 | painted | 3.2 | 2.8 | A |
| S30 | B10 | Back-door window: alley group turns and shuffles out of view right | painted | 3.2 | 2.8 | A (narration "ฝูงหลังร้าน…" is picture-redundant: tier-2 trim) |
| S31 | B10 | Hand on the bar stops; customer grips his sleeve; timer ≈8 | painted | 3.2 | 2.6 | A |
| S32 | B11 | Timer close-up on the bar: 3 → 2 → 1 | painted + overlay | 3.0 | 3.0 | A (real time) |
| S33 | B11 | Glass bursts inward, `0`, back door pushed, pair slips out | painted | 2.4 | 2.4 | A (crash frame) |
| S34 | B11 | Horde floods in, tramples the phone, ringing stops, silence | painted | 3.2 | 2.6 | A/F |
| S35 | B11 | Door swings back, half-chime, heads turn, mop catches | painted | 4.0 | 3.5 | A (near-silence 1.5 → 1.0 s) |
| S36 | B12 | Pair walks away down the empty alley, camera drifting, exit screen left | painted | 4.0 | 3.0 | F |
| S37 | B12 | Look back through the propped door: horde still around the phone; `รอด 2` | painted + overlay | 4.0 | 3.5 | F |
| S38 | B12 | Black, silent | black | 1.0 | 0.6 | F |

Sum of nominals = 115.7 s (matches the script table, `S02` spill of 0.3 s into `B01` included). Sum of minimums = 96.9 s: **about 19 s in theory, ≈ 10 s realistically**, are recoverable by picture alone (below).

## Length risk

Script estimate: 448 syllables ÷ 5.25 syl/s ≈ 85 s narration + ≈ 31 s of itemised holds = ≈ 116 s. The Kore sample ran **3.2–3.5 syl/s including pauses**, which would put the full read at **≈ 130–140 s** (delivery record), i.e. **≈ 12–22 s over** the 115–120 s target. Film cannot trim narration; this section gives the order and the picture room.

1. **Measure first.** Editor reads the full script in Kore (+5 % tempo) before any trim; the measured file sets the real overrun. Film then times the scene sheets to the measured file.
2. **Picture-side room, no text change (≈ 10 s):** B06 silence 2.0 → 1.0 (−1.0); failure shots `S13`, `S16`, `S19` 2.0 → 1.2 (−2.4); B09 silence 1.5 → 0.9 (−0.6); `S22` 3.5 → 2.5 (−1.0); B11 near-silence 1.5 → 1.0 (−0.5); `S36`+`S37`+`S38` −1.9; B02 `S07`–`S10` −1.5; B10 `S29`–`S31` −1.4. Total ≈ 10.3 s. Each shot's `Min` is in the table, so the Editor can pick any subset.
3. **Narration trim order from the script (Preaw owns the text; Boat rechecks):** T1 `B01` "ไฟในร้านสว่างที่สุดในซอย" (≈ 9 syl ≈ 2.7 s at 3.35 syl/s; `S03` loses 0.6 s of picture); T2 `B05` "ห่างแค่กระจกกั้น" (≈ 5 syl ≈ 1.5 s; `S17` loses 0.6 s); T3 `B11` "ร้านเงียบกริบอีกครั้ง" (≈ 5 syl ≈ 1.5 s; `S35` loses 0.5 s). T1–T3 ≈ 5.7 s. **Do not trim `B00` or the "ทำงานคนเดียว" line** (Z7F-06).
4. **If still over after steps 2 and 3 (≈ 16 s recovered):** Film's picture-based suggestions for Preaw to consider, not edits: `B10` "ฝูงหลังร้านเดินอ้อมไปหาเสียง" (`S30` shows it), `B11` "ทั้งฝูงทะลักเข้าไปเหยียบมือถือ" (`S34` shows it), each ≈ 2–2.5 s; both need a Boat recheck.
5. **If under 112 s:** lengthen the `B09` grab silence and the `B12` walk-away (`S36`), not narration (script rule).
6. **Design guarantees for cuts of ~10 s:** every beat ends on a self-contained shot; every failure shot, insert and walk-away shot is picture-only so it can shrink or drop without orphaning a clue; the anchored shots (`A`) carry every sound frame and clue, so no trim breaks `CL01`–`CL08`.
7. User decision needed only if the measured overrun exceeds step 4 (see questions): accept a longer Short (about 125–130 s) or approve narration cuts.

## 10. Technical handoff

**Seam table** (rows not relevant are `N/A`):

| Seam | Decision / handoff | Evidence to establish |
| --- | --- | --- |
| Composition | All painted shots on one `BrushCanvas`; SVG inserts (phone, timer, counter, sound words, stamp) as Remotion layers **above** the canvas and outside the camera transform; camera-mapped anchors for sound words computed from the shot camera at key frames | DOM overlays do not share depth; sound words never need to be occluded by the horde, so a plain overlay suffices. Seek parity at S10, S24, S32/S33 |
| Scale / projection | §5 baseline and `Z7-SHOP` space | Pixel heights per shot measured on rendered frames |
| Coordinates / camera | `Z7-SHOP` metres, kit `Camera` (`pushCamera`), CCTV locked off, impulse at S33 | Camera start/mid/end per shot in the scene sheets |
| Contact / identity | Wrist grab (S27) and sleeve grip (S31) are two-figure contacts; mop in hand (S25–S35) and mop at the door gap (S35); phone placed on the floor ledge (S25) | `missing`: two-figure hand contact, `mop` prop. Spike SP-E |
| Depth / alpha | Back to front: sky/street, far horde mass (T3), mid horde (T2), glass sheen veil, shop interior, cast, hero zombies (T1) pressed to glass **outside** the veil, foreground frame, then screen layers | Opaque underlayers for dark silhouettes (`painted-opaque-cast`) |
| Lighting / colour | §1; Grade/Grain via the plate `Overlay`; CCTV grade is a second overlay variant | `painted-screen-layers-overlay` workaround: render screen layers through the plate Overlay |
| Motion / clock | Two clocks (story and ambient) per plate; CCTV clock quantised to 3-frame holds; timer is event-driven values | Same frame from random seek; backward seek test |
| Loading / resources | Fonts for Thai overlays loaded under the Remotion lifecycle; one WebGL canvas | Studio vs render checked separately |
| Contract / delivery | New painted module `src/painted/z7eleven/`; registry entries by shot ID; overlay components for counter, timer, sound word, stamp (`missing`) | Types + validator + implementation before JSON use |
| Feasibility / cost | Crowd tiers keep brush calls bounded; CCTV grade is cheap (screen layer) | Measure ms/frame in SP-B |

**Runtime status (inspected `cde4183`):** `existing-integrated`: painted scene type, kit (`cast`, `people`, `poses`, `motions`, `shot-templates`, `screen`, `camera`, `glow`), WFOG `PaintedLabel` slot pattern. `exists-unintegrated` / `unknown`: WFOG shop and phone pieces (`worldfog/shop.ts`, `phone.tsx`) as sources. `missing`: the `Z7-SHOP`/alley/stockroom sets, `Z7-ZOMBIE`, the crowd generator, CCTV grade variant, the mop prop, two-figure contact, door-leaf animation helper (WFOG `doorAt` is a reference), counter/timer/sound-word/stamp overlays, back-view (kit `FigPose.view` has no back, so `S36` is a profile walk), the shush pose (proposed `P46`).

**Dev findings** (status lines read 2026-11-02; none revalidated on this checkout, Boss to revalidate at SP-A/SP-C; scope matches painted Short work):

| Finding | Decision / shot | Response |
| --- | --- | --- |
| `DF-20261030-painted-glass-sheen-veil` | `VD03` S02, S09, S25, S33 | Reuse the `Glass sheen` workaround |
| `DF-20261030-painted-straight-bars` | `VD03` doors, handles, shelves | `hardFill` for straight edges |
| `DF-20261031-painted-opaque-cast` | `VD04` all horde cards | Multi-pass opaque wash for dark silhouettes |
| `DF-20261030-p5brush-large-fill-mottle` | `VD03` shop walls, floor | Keep large areas flat |
| `DF-20261030-painted-layer-order` | crowd tiers | Opaque underlayer per tier |
| `DF-20261030-painted-screen-layers-overlay` | `VD05`, `VD07`, `VD09` | Grade/Grain/CCTV through the plate Overlay |
| `DF-20261030-painted-story-hold-ambient-clock` | `VD07`, S20 freeze | Two clocks; revalidate after the first frozen-timer shot |
| `DF-20261030-painted-profile-head-turn` | §6 head snap | Head swap; check `FigPose.nod` shift |
| `DF-20261031-render-speed` | all renders | Per-shot scene cache, stills on one Chrome |

**Smallest spikes and acceptance criteria (Boss, after the storyboard):**
- **SP-A CCTV determinism:** render `S01` frames 0–75 twice with a different time mapping for the shoulder frames; the 6 shoulder frames are pixel-identical. Timestamp legible ≥ 30 frames.
- **SP-B Crowd:** T1 ×4 + T2 ×12 + T3 band at D0, one head snap with 0–3 frame stagger; measure render ms/frame; faces not see-through; no figure faces the clerk.
- **SP-C Glass:** front glass with crack, sheen, horde behind; the crack stays visible over bodies; readable at full size.
- **SP-D Overlays:** counter, timer (stepped), sound word, stamp at S10, S24, S32/S33; random seek and backward seek give the same frame; no glyph crosses the caption box.
- **SP-E Door and contact:** back-door leaf swing, mop catch, wrist grab, sleeve grip at ≥ 480 px lead height with no hand-over pop (`painted-walk-bob-authored-hang` for hand targets).

## 11. Look families and look frames

Four look families; the first storyboard shot of each gets a finished-grade **look frame** (added to `review-rows.json` after the first storyboard pass, painted by Boss from this brief and that shot's row, user-approved before the full build): (1) **Shop interior + glass view** (S03), (2) **CCTV** (S01), (3) **Stockroom** (S27), (4) **Alley** (S36). The zombie options (`VD04`) are shown with the shop look frame. Precedents: none approved for this episode.

## 12. Handoff to the scene-sheet pass

**Constraints to preserve** (from the script, all carried):
- Every head turn lands on a sound frame (chime, clack, ring, chirp, ringtone, crash), never on the clerk standing or moving; the horde makes no vocal sound; nothing in the stockroom is revealed in `B04`; the `B01` stockroom tile shape stays ambiguous; ringtone generic; the `B02` crack persists into `B08`–`B11` (the `B03` sag does not); the `B11` crash reads as the payoff of the 40 s; the back-door window is established in `B04` and `B09` before `B10`.
- `B00`: timestamp ≥ 1 s, a few heads near the door turn and none toward the clerk, `ซอมบี้ 50` is the area total (alley group included), no second counter, `B01` bump not highlighted as a callback, `B07` reuses the identical frames and crop.
- `B08`: the clerk mutes key feedback and lays the phone on a cloth/ledge, no head turn. `B04` footsteps/breath are imagined only. `B05`: show him reaching for the phone too late. `B12`: the pair walks opposite the alley horde's circling route (horde exits screen right, the pair screen left). `B02` "pressed bodies" vs `B05` "shuffles past": the crowd leans in `B02` and moves along the glass in `B05`.
- No real-store door-device mechanism anywhere.

**Choices left to the scene sheets:** final shot IDs, frame counts from the voice-lock measure file, exact camera paths, sound-word anchor positions, per-shot Sound lines, the `S32`–`S33` timer implementation, the S35 two-view cut.

**Missing evidence / Boss dependencies:** `Z7-ZOMBIE` look (needs the user's pick), crowd generator, `Z7-SHOP`/stockroom/alley sets, mop prop, two-figure contact, overlay components, pose `P46` shush (**proposed to Boss**, fallback `P12 + whisper`), door-leaf helper, spikes SP-A to SP-E.

**Sound generation gaps** (to Editor): `door-chime-two-note_01`, `phone-low-battery-chirp_01`, `phone-ringtone-generic_01`, `shopfront-glass-burst_01` (if the library pair is too small), `glass-creak-crack_01`, `mop-handle-door-knock_01` (if `impact_knuckle-rap_01` is wrong), CCTV hiss loop, soft sneaker footsteps on tile.

**Affected decisions on revision:** a change to the timer rule touches `VD09`, S10, S24, S27, S29, S31–S33; a change to the CCTV look touches `VD05`, `VD06`, S01, S05, S21.

### Open questions for the user (to be asked through the structured-question tool by the coordinator)

1. **Zombie look** (`VD04`): pick one of up to three zombie options shown with the shop look frame (needed before Boss builds the crowd).
2. **Ending cut** (`VD12`): hard cut to black (Film recommendation) or a short fade.
3. **Gore / chrome** (`VD13`): no blood or wounds and progress bar off (Film defaults); confirm or change.
4. **Length:** if the measured full read is over the trim ladder (§ Length risk step 4), accept a Short of about 125–130 s or approve narration cuts.
5. **Clock continuity** (to Preaw, not a user decision): the script says `B00`–`B12` ≈ 02:00–02:04 while the 40 s timer starts in `B02`; Film shows no clock face besides the CCTV timestamp and a timer-app `00:22` on the phone, so the mismatch is not on screen.
