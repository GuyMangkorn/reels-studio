# Visual brief — EDU-EP01-SHORT (ตกจากที่สูงตอนกำลังจะหลับ)

Deliverable: `EDU-EP01-SHORT`; delivery record [../delivery.md](../delivery.md); task file [../task.md](../task.md); target 40–60 s, **timing estimated** (voice not locked; shot lengths below are `est`).
Revision: **EDU-BRIEF-R1**; status: `ready-for-storyboard` (text brief; no stills; look frames come at W3 after the storyboard page).
Script: [script.md](script.md) **EDU-SCRIPT-R1.1** (approved by the user at W1.5, 2026-11-04); fact-check [fact-check.md](fact-check.md) (Boat W1.3, 4 inline fixes applied; recheck pending). Concept: [../concepts.md](../concepts.md) R1 C2 + Film W0.2 annotation.
Target checkout: branch `worktree-bridge-cse_01Y1EhffSX82UqHL4R67KDX1` at `e38187e` (kit README read at this commit). Scope: this Short only; sibling episodes (C1, C3–C6) are not touched.
Rows file: [review-rows.json](review-rows.json) (SS-R1, 23 shots, untimed-by-voice: times are `est`).

## Visual intent

- **Audience knowledge and mood.** Viewers know the jolt but not its name or cause. They should feel recognition (B01), a small shock (B03 jolt), calm curiosity (B04–B06), then be put gently back to sleep (B08). The reveal is an absence: nobody knows. The picture must never make a hypothesis look like a fact.
- **Story first.** One young woman, alone in a small bedroom at night; a cool moon, one tiny warm clock-glow. When she drifts, the room does not cut to a dream: its walls go wet-in-wet into cloud paper, and the cliff is made of the same paint, so the viewer reads "imagined" from the material itself ("ที่ไม่มีอยู่จริง", CL02). The jolt is the only hard cut.
- **Medium.** Painted 2D, p5.brush (project default; engine fixed by the user at W0). Backgrounds are washes without outlines; the character, bed and key props get one thin ink line and one cel shade (painted-2d art-direction defaults). `hardFill` only for the straight bed frame/window frame and the name-card ground. No SVG characters.
- **Colour and value key.** Cool night world, one warm accent. Values are low and soft; the only bright area is the moon wash and, at the jolt, the room lights up briefly.
  | Role | Colour (est, Boss tunes at W3) |
  | --- | --- |
  | Night wall / shadow | `#14203a` ink-blue, `#27406b` mid |
  | Moon / window light | `#bcd2f0` cool, glow ≤ 0.3 peak, off her face |
  | Linen, pillow | `#8f9bc4` lilac-grey, `#d9def2` highlight |
  | Warm accent (clock glow, one) | `#e8a35c`, small, behind/beside the bed, never on the face |
  | Dream clouds | `#8c7bc4` lilac, `#e7a8a0` rose-peach, `#f1e6ee` pale cloud; cliff edge `#c98c86` ochre-rose, left half-finished (edge dissolves into paper) |
  | Idea space (B05–B06) | warm paper `#efe6d6` wash with blue-violet bubbles; this is the "daylight of the mind", the only warm-bright location besides B07-SH03 |
- **Camera language.** Vertical 1080×1920. Slow pushes only (≤ 3 % scale over a shot, painted-2d "camera always drifts"), side-on for lying shots (the kit's `lie` is a side view), front for faces and for the fall, back view for the cliff walk. Nothing handheld. Fast motion is reserved for the fall and the jolt.
- **Frame zones.** Captions sit in the middle band (`captionStyle.position: 'middle'`, band about y 860–1248; production-requirements box x 120–888, y 140–1344). Faces, the name card and icons sit above y 840 or beside the band; the lower frame carries bed foreground, blanket and cloud wash. The `@TamMaiLa` channel mark sits top-left (x 120, y 128, `video.chrome` default); nothing else above y 140.
- **Conceal / reveal.** The name "hypnic jerk" appears only at L07 (B04). "Nobody knows" lands at L08. The cliff is not shown before L05.

## Sound direction

(Following script "Sound intent"; Editor decides final levels at W4+.)

- **Music family.** One low warm ambient pad, no beat, about 60 bpm feel, very quiet (energy 1/5). Arc: constant in B01–B02; thins to near nothing under the fall (B03); returns slightly brighter at the name (B04); curious sparse pad plus a few soft plucked notes in B05–B06; warmer, a little fuller in B07; back to the **exact B01 level and tone** in B08. No fade-out, no stinger at the end (ending plan below).
- **Ambience per location.** Bedroom (LF01): close dry clock tick (`tension_clock-pulse_01`, loop, from the shared library) plus faint room tone. Dream (LF02): no room tone; dramatised wind (NEEDS-GEN, fiction). Idea space (LF03/LF04): none. Doctor vignette (LF05): none, or very soft room tone.
- **SFX language.** Soft and round, never sharp: fabric rustle (NEEDS-GEN), air riser/wind (NEEDS-GEN `whoosh`-family, fiction), one low soft thump on the jolt (NEEDS-GEN, fiction), icon pops (`ui_pop_01`), name-card shimmer (`reveal_glass-shimmer-soft_01`, optional). The gasp (L06) is one acted vocal take, Editor's W4 decision (narrator or separate performer).
- **Silence policy.** A true hard silence of about 0.5 s (15 f, est) on the jolt frame (B03-SH04): music, tick and wind all cut together, then thump + gasp. Short pauses after L08 "ยังไม่มีใครรู้แน่ชัด" and before L12. Last 0.5 s (15 f) of the video: no VO, pad and tick continue across the seam.
- **Library check (2026-11-04, `~/ReelsStore/library/sound/INDEX.md`).** Present: `tension_clock-pulse_01`, `ui_pop_01`, `reveal_glass-shimmer-soft_01`, `whoosh_air-swish-rising_01` (partial fit for the fall). Gaps (NEEDS-GEN): warm ambient pad (loopable, matched head/tail for the seam), soft plucked-note bed, wind rise 2 s (dramatised), soft body thump, bedding/fabric rustle, room tone. Gasp: vocal, not from the sound library.
- **Not claimed.** Wind and thump are dramatised; the tag "ภาพจำลอง" (VD04) covers picture and sound of the fall.

## Visual progression

| Beat | Visible action | Information / emotional change | Visual form and reason | Return / repeat rationale | Factual status |
| --- | --- | --- | --- | --- | --- |
| `EDU-EP01-S01-B01` | She lies in bed, eyes closing; a tiny shoulder twitch; then she opens her eyes to the viewer | Hook: "that is me" | Slow push on the bedroom; the twitch is a teaser that shows no cliff | Frame 0 is the seam frame (VD02) | Experience (F001, F005); no frequency |
| `B02` | Her eyelids settle on the pillow; the whole room dims softly | Falling asleep is quiet and gentle; plants "loosening" (CL01) | Light and saturation drop over the whole picture. **Not** limb-by-limb, not a body-wide switch-off (fact-check note) | The dimming is reused in B05-SH04 as the thing the brain "reads" | F002; F014 (lightly sourced) shown only as mood |
| `B03` | Wall wets into cloud; she stands (back view) at a half-painted cliff; steps off; falls through upward-streaming paint; hard silence; cut to bed jolt, eyes snap open, gasp | The imagined fall; the cliff is paper-and-paint, not a place | Wet-in-wet bleed in, back view small figure on a ledge, vertical fall, one hard cut (the only hard cut) | Cliff paint reappears nowhere else (so it stays imagined) | Dramatisation, tag "ภาพจำลอง" on SH02–SH04 (VD04); jolt is a brief twitch, no sit-up (script constraint) |
| `B04` | She sits up, breathes, hand on chest; the name card appears | The word to search | Calm after the shock; the name is one clear Latin line with the Thai term below, over the quiet wall | Card is the only "title" in the video | F001 |
| `B05` | She sits thinking in the idea space; two bubbles each hold a "?"; A: brain-cloud with a sun/moon switch that catches; B: brain-cloud reads a sinking body and flicks a twitch; both bubbles wash out | Reveal: several ideas, none proven | Painted ideas inside bubbles with "?" marks, never in the real room; L12 blurs both with running water | Reuses B02's dimming for hypothesis B (CL01 payoff) | F007–F009; every image is labelled as an idea by the "?" bubble form; no arrows, no diagram of fact |
| `B06` | Four simple icons arrive one by one: cup, tangled scribble, moon-and-clock, dumbbell | What it is linked to | Painted icons on paper wash, no arrows, no "causes" reading | Same paper ground as B05 so it reads as "more about the ideas" | F011 (associations only) |
| `B07` | She sits, smiling lightly; lies awake at a late hour (no alarm); a doctor in a pale vignette smiles | Common, usually harmless, but see a doctor if... | Warm, calm, soft light; no alarm imagery | Return to the bedroom only for LF01 continuity | F003, F012, F013 |
| `B08` | She lies back, eyes close, walls soften to watercolour | Invitation; loop | Same camera/pose/light as B01-SH01 frame 0 | Seam (VD02) | none |

## Scene decisions

Casting lines use [CP casting-line](../../../docs/character-proportion-principles.md#cp-casting-line); kit layers are named per ENV-P02. Estimates labelled `est`. Where no kit entry fits, the line is `new:`.

| Scene / beat refs | Decision ID | Set / actors / props / effects medium | Framing / camera intent | Light / shadow / colour | Why / fallback |
| --- | --- | --- | --- | --- | --- |
| all | **VD01** Medium and cast | Painted 2D p5.brush, 4-head kit rig. Cast: **`woman-bob + new: pyjama, P36 (lie on back), asleep / sleepy / shock`** (see VD01 note and Q1). Doctor: `woman-pixie + doctor, P01, happy` | See below per shot | See key above | Fallback for the cast choice: `girl-school + new: pyjama` (the W0.2 proposal); same sets and shots |
| B01, B08 | **VD02** Seam frame | Bedroom LF01 as built at B01-SH01 frame 0; the same plate, pose, breath phase 0, eye state `sleepy` (lids half), wall softness level `w0.25` (est), moon, clock glow | Static start at f0 with a push of ≤ 3 % over the shot; B08 ends on exactly that frame state | Same grade; grain seed fixed | `video.ending: 'C_seamless'`, `loopBlendFrames` 15 (default); runtime crossfades the last 15 f into frozen frame 0 (remotion-toolkit 10a). If the last frame differs by more than the crossfade hides, Boss repeats the f0 state in B08's last 30 f |
| B01-SH01..B02 | **VD03** Bedroom LF01 | `new: bedroom set` (bed with headboard, pillow, blanket, window with moon, wall, bedside clock, tiny warm glow); kit: ENV-SKY moon disc (`paintSkyDisc`), ENV-GLOW (`paintHalo`) for the clock glow, ENV-FOG retinted for the soft wall mist (B08) | Side-on, camera at bed height, wide-medium; she lies screen-left to right, head at left; bed top edge near y 700 (est); push ≤ 3 % | Moon from the window cool, glow ≤ 0.3, off the face; clock glow `#e8a35c` | PLATES `PL-ZCPAINT-ROOM-NIGHT` as reference only (never a default). Fallback: simplify the window to a wash rectangle |
| B03-SH02..SH04 | **VD04** Dream, fall and "ภาพจำลอง" tag | `new: cloud-dream plate` (cloud washes, a half-painted cliff ledge, no outlines); the walking/falling figure is the same cast in `back` view (kit `drawFigure view: 'back'`) then `P39 fall_stumble` front; `new: upward paint-streak FX` for the fall; the tag is `scene.eyebrow` text "ภาพจำลอง" (`eyebrowStyle.fade: false`) on SH02–SH04, small | Back view wide on the ledge; fall: camera drops with her, streaks run upward; SH04 freeze | Lilac/rose/pale cloud; no hard edge on the cliff | Dev finding: dissolves are in-canvas `painted.shots[].dissolveSec` ([DF-20261029-painted-timeline-dissolve](../../../docs/dev-findings/DF-20261029-painted-timeline-dissolve.md), checked 2026-11-04 at `e38187e` by reading only; translucent frames are not byte-identical, tolerance accepted for the bleed shots); large textured fills mottle, so the cloud washes are washes ([DF-20261030-p5brush-large-fill-mottle](../../../docs/dev-findings/DF-20261030-p5brush-large-fill-mottle.md)). Fallback for upward streaks: vertical rain-like `paintFall` kind `dust` retinted, sped up |
| B03-SH05 | **VD05** The jolt | Bedroom LF01, P36 lie-on-back with a `new: jolt motion` (`lie` stays; head/shoulder lifts a hand's breadth and drops, eyes `asleep` → `shock`, blanket jumps); lights up briefly (+value for 3 f) | Hard cut from the frozen fall; same side-on camera as B01 | The one brief value flash (≤ 0.3 glow) | No sit-up (script constraint). `startle-jump` exists in `MOTIONS` but is standing; not reused |
| B04 | **VD06** Name card | Same bedroom; she sits at the bed edge (`new: sit on bed edge`, P31 hands-in-lap arms, `sleepy` → `neutral`); the card "hypnic jerk" (Latin) with "อาการกระตุกตอนเคลิ้มหลับ" under it appears over the upper wall | Medium, slight push; card in y 200–420 (est), above the caption band | Soft glow only | Text on screen is Editor-owned overlay (script sub differs from VO: Latin letters). Runtime: text overlay capability `unknown` for Latin big title (captions exist; see remotion-toolkit 10a); Boss/Editor confirm. Fallback: caption cue carries the Latin term |
| B05 | **VD07** Idea space LF03 | `new: idea-space ground` (warm paper wash, no horizon); she sits at the bed edge in a vignette (same pose as B04, `neutral/worried`); two thought bubbles (`new: idea bubble` wash cloud with a "?" brush glyph); `new: brain-cloud` (soft stylised brain lump, painted not anatomical); `new: sun/moon switch` (ENV-SKY disc reuse, two discs on a slider); `new: relaxed-body mini-figure` (the cast `P36` small) | Hypothesis A fills the left bubble; B fills the right; L12: both wash out (water-run) | Warm paper vs the cool night: the viewer reads "thinking, not the bedroom" | The "?" is the only glyph (painted-2d: at most one word of painted text). Ideas are tagged by the bubble form and "?", never an arrow diagram of fact (script constraint). Fallback: drop the brain lump, show a plain sun/moon switch only |
| B06 | **VD08** Trigger icons LF04 | Same paper ground; `new: icons ×4` (cup of coffee, tangled scribble-ball, moon + clock past midnight, dumbbell); each arrives with `ui_pop_01` | Icons in a row of three (y 300–520 est) then the fourth below-left; push ≤ 2 %; no arrows | Paper `#efe6d6`; icons in muted colour | Associations only ("เชื่อมโยงกับ"); nothing links them to the girl by an arrow |
| B07 | **VD09** Calm and doctor | SH01: LF01 bed, `new: sit on bed` posture with P31 hands-in-lap arms, face `happy` (soft). SH02: LF01 lying awake, eyes open on the ceiling, the clock glow shows a late hour without a face. SH03: LF05 `woman-pixie + doctor, P01, happy` in a pale vignette (`new: doctor vignette ground`, paper wash, soft window light) | SH03 medium front, small push | Warm, soft; not alarm | The doctor is a friendly figure, not an emergency. Fallback for LF05: a painted stethoscope icon in the bedroom (S) |
| B08 | **VD10** Closing | LF01 as VD02: she lies back (reverse of `sit-down` as `new: lie-back motion`), eyes close, wall softness rises from `w0` to `w0.25` (the same state as f0) via ENV-FOG mist | Same camera as B01-SH01 f0 at the end | As B01 | See VD02 |

**VD01 note (cast).** The W0.2 annotation proposed `girl-school`. From the story, caffeine, stress and late workouts (B06) and the narrator's "คุณ" read better with an adult viewer-stand-in; an 8-year-old schoolgirl in a bedroom suggests a child audience. `woman-bob` (21, student age, `PEOPLE_INFO`) fits both. The outfit `new: pyjama` is a lavender sleep top and shorts, hair loose with bob unchanged, bare feet. Pending the user's answer (Q1); every shot below works with either cast.

## Technical handoff

- **Scale baseline and projection contract.** Mostly flat plates with a side-on camera at bed height (not a 3D projection). Named space: plate px, origin top-left, x right, y down, canvas 1080×1920; cast rig scaled by the kit `unit` (px per metre) from the plate projector. Lying figure length is about 700 px (est, 1.58 m at ~440 px/m); a seated figure ~ 1.0 m at the same unit; faces for B01-SH02 and B02-SH01 are a close crop of the same plate (zoom 1.6–2.0, est). Baseline source: kit `PEOPLE` height (`woman-bob` 1.58 m) and `lie` rotation about the ground contact (`FigPose.lie`). Status: estimates; the look frame at W3 confirms.
- **Per decision.** VD01–VD10 above carry the strategy. Shared owner: kit (`src/painted/kit/`) for person, wardrobe, poses, motions, ENV layers; episode module `src/painted/edu01/` (proposed) for the bedroom set, dream plate, idea space, icons, brain-cloud, doctor vignette. Dependency order: (1) bedroom set + pyjama + lie/jolt/lie-back motions (B01, B02, B03-SH05, B04, B07, B08), (2) seam check (VD02), (3) dream plate + fall FX (B03), (4) idea space + bubbles + brain (B05), (5) icons (B06), (6) doctor vignette (B07-SH03).
- **Runtime status.** `existing-integrated` (10a, `e38187e`): `video.ending: 'C_seamless'` + `loopBlendFrames`, `scene.eyebrow` + `eyebrowStyle.fade:false`, `captionStyle.position`, `video.chrome` `@TamMaiLa`, `painted.shots[].dissolveSec`, `scene.sfx`, `video.audio` with `duckUnderNarration`. `unknown`: a large Latin title overlay for the name card (VD06), a "?" glyph as a painted mark (ordinary brush strokes, expected fine). `missing`: the new assets below.
- **Dev findings consulted (read only; no re-validation run in this pass).** DF-20261029-painted-timeline-dissolve → VD04 bleed and room-to-cloud dissolves (B03-SH01, B05-SH06); DF-20261030-p5brush-large-fill-mottle → VD04/VD07 wash grounds; DF-20261030-painted-layer-order → VD07 (bubble washes over the paper ground: paint order paper, bubble wash, icon/brain, never an opaque underlayer over an earlier mark); DF-20261030-painted-story-hold-ambient-clock → VD02 (the breath clock stays tied to ambient time so f0 and the last frame share phase; B02 and B03-SH04 holds use the story clock, not the breath); DF-20261030-ending-hold-option (loop vs hold: C_seamless chosen by the concept).
- **Smallest spikes and acceptance criteria.**
  1. *Seam* (Boss, W3): B01-SH01 f0 vs B08 last frame, frame difference visually zero before the crossfade, with breath at phase 0 on both.
  2. *Room-to-cloud bleed* (B03-SH01): wall washes into cloud over 66 f (est) with no pop; ink line of the bed fades, does not cut.
  3. *Fall* (B03-SH03): upward streaks read as falling, not as flying; the figure reads at ≥ 200 px tall (est) at 270 px QA.
  4. *Jolt* (B03-SH05): lift of head/shoulders only; no sit-up; hard cut from SH04 on one frame.
  5. *Faces*: caption zone (`scripts/caption-zone.py`) and lead height measured on LF01, LF03, LF05 look frames.

## New assets and missing capability (Boss dependencies)

| # | Asset (`new:`) | Used in | Size |
| --- | --- | --- | --- |
| N1 | `new: pyjama` outfit (WARDROBE) on `woman-bob` (or `girl-school`) | all | S |
| N2 | `new: bedroom set` (bed, headboard, pillow, blanket, window + moon, bedside clock, clock glow, wall with softness parameter) | B01, B02, B03-SH05, B04, B07, B08 | M |
| N3 | `new: jolt motion`, `new: lie-back motion`, `new: sit-on-bed posture`, small breath phase 0 contract | B03, B07, B08 | S–M |
| N4 | `new: cloud-dream plate` + half-painted cliff ledge | B03 | M |
| N5 | `new: upward paint-streak FX` for the fall | B03-SH03 | S |
| N6 | `new: idea-space ground` + `new: idea bubble` + "?" glyph | B05 | S |
| N7 | `new: brain-cloud`, `new: sun/moon switch`, `new: relaxed mini-figure` (reuse of P36 scaled) | B05 | S–M |
| N8 | `new: icons ×4` (cup, scribble-ball, moon+clock, dumbbell) | B06 | S |
| N9 | `new: doctor vignette ground` (paper wash, window light); `woman-pixie + doctor` is kit-ready | B07-SH03 | S |
| N10 | Wet-in-wet bleed helper between two washes (room → cloud, bubbles washing out) | B03-SH01, B05-SH06 | M, uses `dissolveSec` where possible |
| N11 | Latin title overlay for the name card (check `scene` text support; Editor/Boss) | B04 | capability `unknown` |
| (note) | The kit back view is standing only (no walk): the cliff figure stands still at the ledge and leans (`lean`) then drops out of frame; no walk motion is requested | B03-SH02 | none |

Kit intake (KIT-P01) at delivery: new `pyjama` outfit, any new pose/motion (jolt, lie-back, sit-on-bed), the bedroom set as a `PLATES` entry.

## Handoff to the scene-sheet pass

- **Preserve:** script R1.1 wording and L01–L16 order; seam; "ภาพจำลอง" tag on B03 SH02–SH04; L04 as a soft whole-picture dimming; jolt = brief twitch; hypnic jerk name hidden until L07; "?" marks on both hypotheses and a wash-out at L12; no arrows or percentages; wind/thump not claimed as recorded.
- **Left to W5.1 (timed sheets after voice lock):** exact frames, hold/silence frames, push amounts, SFX frame cues and library IDs, sub timing; whether L06 gasp is narrator or separate; whether ALT-A returns (Boat/user).
- **Open questions (user, via coordinator):** Q1 cast (below). Everything else decided.
- **One shot = one timeline scene** (AGENTS.md render-by-scene). Exceptions recorded: none; the B03-SH01 bleed and B05-SH06 wash-out are each inside one scene. The dissolve into the dream is inside SH01; SH02 begins on the cloud plate.
- **Review page:** pending (coordinator builds from [review-rows.json](review-rows.json)).
- **Look frames (W3):** planned families LF01 bedroom (B01-SH01), LF02 dream (B03-SH02), LF03 idea space (B05-SH01), LF04 icons (B06-SH01), LF05 doctor vignette (B07-SH03), each a finished-grade still painted by Boss from this brief and its row; user approves before the full build.

## Change log

- **EDU-BRIEF-R1 (2026-11-04, Film W2.1):** first brief from script R1.1; cast changed from W0.2 `girl-school` to `woman-bob` pending Q1.
- **W3.1 look frames v1 (2026-11-04, Film):** LF01–LF05 painted in `src/painted/edu01/` (no brief revision: decisions unchanged). Q1 settled by the user: `woman-bob + new: pyjama`. Proposed deviation awaiting the user: pyjama with long trousers instead of shorts (rig has no shorts). LF04 places the dumbbell bottom-left under the caption band (SH02 row text) and the row of three at y 360–720 (was est y 300–520). Measured numbers and caption-zone results: [build-notes](../build-notes.md#w31-look-frames-v1-2026-11-04-film).
