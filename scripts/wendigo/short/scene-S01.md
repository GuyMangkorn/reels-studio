# S01 — fiction cold open (B01 hook, B02 seven days, B03 footprints)
Deliverable: WDG-EP01-SHORT · Revision: WDG-SS-R2.5d · Status: ready-for-dev · Timing: checked-with-audio
Inputs: `WDG-SCRIPT-R3` S01 (CL01–CL04) · brief `WDG-BRIEF-FILM-R1.4` (`VD03e`, `VD04`–`VD07`, `VD13`, `VD13a`, `VD14`, `SN01`, `SN02`) · [scene-index.md](scene-index.md) (spaces, clocks, audio placement, dependencies `D01`–`D09`, `D10`, `D15`–`D17`)
Target: 30 fps · scene frames G [0, 1250) · 1080×1920 · composition offset 0
Evidence: runtime unverified · render none · audio sync: clip placements exact, intra-clip word edges ±0.2 s · user approval: look frames and storyboard SB-R2.2 approved in chat; these sheets not yet reviewed

## Intent and continuity
Before → after: a man hears a voice every night → we learn the setting (stranded, no food, a ring of footprints) → it was him. Concealed until `SH03`/`SH04`: that the whisper is his own mouth (`CL01`, `CL04`). Never shown: any figure outside the tent, blood, attack, eating. Companion is never harmed (`SH05` is stillness).
Return: `SH01` frame 0 = `S03-B02-SH02` last frame. Next: `S02-B01-SH01` (cut to black at G1250, narrator begins at G1272; N0 = 1262 unchanged under the pTIGHT3 narration).

## Baseline and assets
Shared baseline, clocks and dependencies are in the index. Cast (kit `PEOPLE`, [pose sheet](../../../docs/character-proportion-principles.md#cp-p-pose-sheet) P01–P45, `EXPRESSION_IDS`): man `man-parted + parka (override of hoodie), P01, worried|whisper|shock`, companion `man-crop, P37, asleep` (`D04`, `D05`). Findings: `DF-20261030-painted-profile-head-turn` (profile shots here never turn their head: front and profile are separate shots), ambient-clock finding (index). Prop states: lantern is on the tent floor at (255, 850) from `SH01` until `B03-SH01`; he picks it up between `B02-SH04` and `B03-SH01` (off screen) and holds it **in the hand nearest the camera, at hip height** through `B03-SH01`, in his hand at chin height in `B03-SH03`; it is out of frame in `SH04`/`SH05`. The tin is on the groundsheet in `SH01`/`SH02` of B02 and S03 and is never touched.

## Shot map
| Shot | Beat | Range G | Claims / clues |
| --- | --- | --- | --- |
| `S01-B01-SH01` | B01 | [0, 60) | `CL01` voice outside |
| `S01-B01-SH02` | B01 | [60, 192) | `CL01` (he hears it nightly) |
| `S01-B02-SH01` | B02 | [192, 291) | `CL03` stranded 7 days |
| `S01-B02-SH02` | B02 | [291, 406) | `CL03` food gone (tin) |
| `S01-B02-SH03` | B02 | [406, 446) | second person present |
| `S01-B02-SH04` | B02 | [446, 600) | `CL02` ring, no track in or out |
| `S01-B03-SH01` | B03 | [600, 713) | `CL02` he follows the ring |
| `S01-B03-SH02` | B03 | [713, 795) | `CL02` payoff: boot fits |
| `S01-B03-SH03` | B03 | [795, 987) | `CL01` hears it again |
| `S01-B03-SH04` | B03 | [987, 1100) | `CL01`/`CL04` payoff: his own mouth |
| `S01-B03-SH05` | B03 | [1100, 1250) | `CL03` the hunger now has a target; `VD13a` |

## S01-B01-SH01 — the wall
Range and clocks: scene/composition G [0, 60); L = G.
Direction: medium, eye level, tent interior looking at the back gable (plate `LF-TENT_r7`, `D01`). Canvas bows with the wind, lantern nearly out (glow peak ≤ 0.2, flickering), amber light through left-wall stitch holes. Nothing outside; only the canvas moves. Hook: the whisper comes from the wall.
Camera: scale 1.00 → 1.06, focus (540, 700), ease-in-out over L [0, 60). Transform owner: kit `CameraLayer`.
VO + subtitles: WHISPER `หิวไหม…` speech G [6, 28). Caption `หิวไหม…` G [6, 40). Marker `เรื่องแต่ง` visible from G0.
Sound: `AMB-WIND` at seam level from L0 (it is the loop bed). `SN01` wendigo texture L0–L90 (spans into `SH02`): thin high overtone fading in L0–5, rasp breath in the gaps between and after the syllables (strongest L28–L60), out by L90, dry, never replacing or processing the whisper (the whisper is the man's voice, `CL04`). No music.
Mix intent: whisper hold at the front; `SN01` lift after the word, release under M1.
Cut: hard cut to `SH02` at L60 (breath of M1 starts G51, 9 frames before the cut).
Entry → exit: entry frame 0 is the loop seam picture (scale 1.00, lantern as in the index clock t = 0). Exit scale 1.06.
R2.1 (W5.2 verdict: accept with a measured-size note): the lantern stands on the floor left of the door at about (250, 840), off the tent centre line as the user asked; the amber stitch-hole lines at the left wall are present. Lantern glow is `lanternPeak(…, 0.2)` on a glow stop of alpha 0.62 (`LF-TENT_r7`), i.e. 32 % of the look-frame glow: that is the `nearly out` state, not a conflict with the 0.62 stop. Size: the sheet's 130 px is the lantern **body height**; Boss reports 186 px, which Film could not reproduce on the body (about 100 px measured on a 400 px downscale), so Boss states which element measures 186 (halo?). Body 100-150 px passes; halo diameter ≤ 260 px.
Acceptance:
| Frame | Observable | Evidence |
| --- | --- | --- |
| G0, G59 | canvas bow differs between frames, lantern is the only warm light, off the centre line (x 200-320), no warm light leaking past the tent wall into the caption band, no figure, caption band mean ≤ 0.25 | frame sheet + `scripts/caption-zone.py` |
| G6–G28 | whisper audible, intelligible, not pitch-shifted; wendigo texture audible between syllables | Editor audio check |

## S01-B01-SH02 — "that voice"
Range and clocks: G [60, 192); L = G − 60.
Direction: close CU, eye level, profile, `man-parted + parka (override), P01, whisper`; mouth uses the `talk` envelope only on his words. He stares at the canvas wall at screen left. Lantern light rakes from low left.
Staging: screen px; head view `left` for the whole shot (no turn).
| Entity | Start | Key / end | Facing / gaze |
| --- | --- | --- | --- |
| head centre | (650, 500) | fixed | faces screen-left, gaze to (200, 560) on the wall |
| head height | 400 px (21 %) | fixed | — |
| shoulders | cropped by the lower shade at y ≈ 860 | fixed | — |
| backdrop | `D01` tent plate at scale 1.5, focus (300, 600), soft | fixed | wall at left, lantern pool low left |
Camera: scale 1.00 → 1.05, focus (650, 520), ease-in-out over L [0, 132).
Look: key from low left (amber), cool rim from upper right; pale gaunt face, stubble.
R2.1 (W5.2 verdict: **fix**). (a) Face: the plate reads as a healthy cartoon boy (round cheek, clean jaw). Required: cheek hollow under the cheekbone (a cool shadow wash from the ear to the mouth corner, value 12-15 % darker than the skin), deeper eye socket (brow shadow plus a dark under-eye wash), dry cracked lip colour, stubble as a visible grain over the jaw, hair slightly greasy and flat, a second wrinkle at the mouth corner; the jaw line is the only hard edge. Gaunt is the story fact (day-seven starvation), tired not frightening. (b) Parka: the crop at y 860 hides all of it. Reframe: head centre (650, 460), head height 380 px, shoulders visible down to y 840 with the **hood bunched behind the neck and the collar edge** so the parka reads at the neck and left shoulder (dark, bulky, value below the skin and the wall). The neck column stays short (it reads as a long flat tube in the plate). Keep the face above y 860. (c) Backdrop: the plate shows a simplified tent wall (flat blue wash, two cord lines), not the scaled `LF-TENT_r7` of the sheet. **Accept the simplified wall** if it keeps the wall at left, the stitch holes and the lantern pool low left with the lantern light raking the face; do not scale the r7 plate (it would show the lantern, boots and the open floor, a different shot). Update the plate note: backdrop = `D01` wall detail painted close, same hue family as `LF-TENT_r7`.
VO + subtitles: MAN `เสียงนั้น… ถามผมทุกคืน`. Mouth `talk` G [64, 91) and [101, 176). Captions `เสียงนั้น…` G [62, 96); `ถามผมทุกคืน` G [100, 182).
Sound: `AMB-WIND` steady; M1 breath starts G51; `SN01` out by G90. Close dry voice.
Mix intent: voice hold; wind hold.
Cut: hard cut to `S01-B02-SH01` at G192.
Entry → exit: entry man already in place; exit same, scale 1.05.
Acceptance:
| Frame | Observable | Evidence |
| --- | --- | --- |
| G126 | head 19-21 % of frame height, face above y 860, profile reads as exhausted and gaunt (cheek hollow, eye socket, stubble visible at 540 px width), parka visible at the neck and shoulder, not a monster | frame sheet at 540 px plus a 1:1 face crop |
| G64–G176 | mouth moves only on the two phrases | sync check |

## S01-B02-SH01 — tent under the snow
Range and clocks: G [192, 291); L = G − 192. (R2.3: was [192, 271); +20 frames, the cut moves to the tin.)
Direction: wide, slightly low, night exterior (`D02` night variant): tent half-buried at centre, body y 520–860, forest edge far at y ≈ 600. Lantern light leaks through the canvas as bright seam lines, door gap and pinholes, not a single round glow (`VD14`). A few large flakes.
Camera: scale 1.00 → 1.04, focus (540, 760), ease-in-out over L [0, 99).
VO + subtitles: M2 first phrase, speech G [197, 269). Caption `พายุหิมะขังเราไว้มาเจ็ดวัน` G [196, 272).
Sound: `MUS-DRONE` fades in G192–G222 under the voice (low, not ethnic-coded); `AMB-WIND` +2 dB over the shot.
Mix intent: drone lift to a low bed; voice hold.
Cut: hard cut to `SH02` at G291 (R2.3; M2 phrase 2 now begins at G316 per the round-2 edit plan, 25 frames after the cut; phrase 1 ends G269).
Entry → exit: from the man's face to a wide; exit scale 1.04.
R2.1 (W5.2 verdict: **fix**, user note `light must leak through`): the plate shows a blue tent with a dark door slit and a few cool dots; the warm leak is not readable. Required: seam lines and the door gap in warm amber (`#f6b24a` family, peak alpha ≤ 0.5 on the lines), pinholes as small warm dots, a faint warm spill onto the snow in front of the door (radius ≤ 120 px, nothing in the caption band), the snow cover and sky stay cold blue so the leak is the only warm colour; no round glow.
Acceptance:
| Frame | Observable | Evidence |
| --- | --- | --- |
| G230 | warm light visible as seam lines, door gap and pinholes (at least five warm marks readable at 540 px width), tent half-buried, no figure | frame sheet |

## S01-B02-SH02 — the empty tin
Range and clocks: G [291, 406); L = G − 291. (R2.3: shifted +20, length 115 unchanged.)
Direction: close, ground level, locked. Empty food tin on snow beside the lantern, the scene's hero (`VD14`): dents, rust, torn rolled lid, label remnants, frost on the rim, lantern raking from the left edge (-100, 700). No hand, no person.
Staging: tin centre (540, 520), width 620 px, base y ≈ 760 (above y 860). Camera locked, scale 1.00; only the lantern flicker and frost glints move (ambient).
R2.1 hero-detail list (W5.2 verdict: **fix**, user note `more detail on the tin`; the FINAL sheet tile is plain, the labelled variant in W5.2 sheet A shows what is wanted and is the base). Required, all readable at 540 px width: (1) rolled lid torn open, one jagged lip bent up with a bright cut edge; (2) a label remnant with torn paper edge and one or two unreadable ink marks (no legible brand, no Thai text), faded; (3) three or four dents along the body with a darker core and a light raking edge on the lantern side; (4) rust as streaks running down from the seam and the rim, not round spots; (5) frost crystals along the rim and in the lid shadow, a few bright glints; (6) the lid's inner dark with a faint scrape ring; (7) a thin ring of crushed snow at the base and the shadow on the snow. The same tin, same dents, same label remnant in `S03-B02-SH01`; there only the raking value (0.12) and the frost (heavier) change.
VO + subtitles: M2 second phrase speech G [273, 371). Caption `อาหารหมดตั้งแต่วันที่สาม…` G [274, 380). Hold 15 frames after the speech ends.
Sound: wind light (-3 dB), drone continues.
Mix intent: hold.
Cut: hard cut to `SH03` at G406.
Entry → exit: tin on snow, untouched.
Acceptance:
| Frame | Observable | Evidence |
| --- | --- | --- |
| G330 | tin occupies ≈ 57 % of frame width, rim frost and torn lid readable, nothing in the caption band but dark snow | frame sheet + caption-zone |

## S01-B02-SH03 — the sleeper
Range and clocks: G [406, 446); L = G − 406. (R2.3: 60 → 40 frames to cover less of the voice-less run after M2 phrase 2; cut at G446 unchanged so M3 G449 and every later cue is valid.)
Direction: close, eye level, locked. Companion `man-crop, P37, asleep` lies on his side, face turned away (hair and one shoulder visible), blanket a flat wash shape; safe, nothing wrong (`D04`). Tells the viewer there are two of them.
Staging: hair mass centre (330, 560), shoulder (480, 640), blanket mound from x 480 to 980 at y 640–760. Blanket rises 6 px and falls on an ambient period of 90 frames. Faint warm light from far right (0.12).
Camera: locked.
VO + subtitles: none (silent shot). No caption.
Sound: wind low, `FX-BREATH-SLEEP` [406, 446) under it (NEEDS-GEN, very quiet), drone continues.
Mix intent: voice-free breath; hold.
Cut: hard cut to `SH04` at G446 (M3 breath starts at G442, speech G449).
Entry → exit: sleeper in place; exit same.
Acceptance:
| Frame | Observable | Evidence |
| --- | --- | --- |
| G426 | no face, no distress, blanket rise visible (40 frames cover under half of the 90-frame breath period; unchanged) | frame sheet |

## S01-B02-SH04 — the ring
Range and clocks: G [446, 600); L = G − 446.
Direction: high angle (camera 60–70° down, estimate), morning (`D02` morning, `LF-SNOW`). Tent at the centre of a closed ellipse of small boot prints (`RING` cx 540, cy 590, rx 380, ry 270, 30 prints), all present from the first frame; no track enters or leaves.
Camera: scale 1.00 → 1.05, focus (540, 590), ease-in-out over L [0, 154).
VO + subtitles: M3 speech `ทุกเช้า` G [449, 484), `มีรอยเท้าเดินวนรอบเต็นท์` G [507, 580). Captions `ทุกเช้า…` G [449, 494); `มีรอยเท้าเดินวนรอบเต็นท์` G [505, 586).
Sound: `AMB-WIND` fades down by L30 to near still (-8 dB), snow smooth; one snow crunch `FX-SNOW-STEP` at L79 (G525) on `รอยเท้า`; drone continues.
Mix intent: wind drop; crunch hit.
Cut: hard cut to `B03-SH01` at G600 (bed drops at the cut).
Entry → exit: night interior to morning exterior (time jump by picture and light); exit scale 1.05.
Acceptance:
| Frame | Observable | Evidence |
| --- | --- | --- |
| G446, G599 | ring closed, no inbound or outbound tracks, ring reads with sound muted | frame sheet |
| G525 | crunch on `รอยเท้า` | audio check |

## S01-B03-SH01 — following the ring
Range and clocks: G [600, 713); L = G − 600.
Direction: medium wide, eye level, profile, `man-parted + parka (override), P01`, kit template `side-walk` (motion `walk-in-from-left`), follow fraction 1.0. Night: moon-blue, ring of prints along the ground; warm lantern in his near hand at hip, lighting the snow ahead. He looks down at the prints.
Staging (screen px): feet y 850, figure ≈ 620 px high (head top y ≈ 230), screen x ≈ 430 constant (camera follows), background slides left at ≈ 230 px/s (0.67 m/s at 344 px/m; R2.1, was 190 px/s = 0.55 m/s). Steps (boot lands) at L 26, 55, 84, 110 (about one per second; 29-frame period).
R2.1 (W5.2 verdict: **accept the cadence, fix the figure**). 0.67 m/s with one step per 29 frames is a stride of about 0.67 m: a slow, tired walk, inside normal slow-walk range; the 0.55 m/s figure was an estimate. Condition: **no skating**: the planted foot moves at the same screen speed as the ground and the print ring (230 px/s), measured over a contact (the foot x change between two frames inside a stance equals 230/30 = 7.7 px per frame, ±1 px). Steps stay at G626, 655, 684, 710 (sound plan unchanged). Figure: the parka reads as a thin grey-lilac coat at 270 px width; required dark bulky parka (value darker than the snow band behind him and clearly below the lit skin), hood bunched at the neck, hem to mid-thigh; face gaunt as in `S01-B01-SH02` (hollow cheek visible in profile).
Camera: kit follow; no extra push.
VO + subtitles: M4 first phrase speech G [607, 706). Caption `คืนนี้ผมตามรอยนั้นไป…` G [607, 712).
Sound: `MUS-DRONE` drops out L0–L12; `AMB-WIND` low; `FX-SNOW-STEP` at G626, 655, 684, 710; breath mist.
Mix intent: drop (bed), steps hold.
Cut: hard cut at G713 inside M4's pause (3.75–4.22 s source = G706–G720).
Entry → exit: he is mid-walk at L0 (enters from the left of the frame); at L112 the last step has just landed.
Acceptance:
| Frame | Observable | Evidence |
| --- | --- | --- |
| G650 | lantern in the near hand only, feet at y 850, no body part in the caption band, parka reads dark and bulky at 270 px width | frame sheet |
| G626–G710 | four steps in sync with the foot contact | sync check |

## S01-B03-SH02 — it fits
Range and clocks: G [713, 795); L = G − 713.
Direction: close, ground level, low angle (`D08`). A snow-dusted boot (profile, toe to the right) lowers into one footprint of the ring: starts hovering with its sole at y 520, lands at L19 (G732) with the sole at y 600 and a snow puff; the print's rim shows around it at 18–24 px all round, so the shape is visibly identical.
Staging: print centre (540, 640), sole length 560 px; everything above y 860, bottom is flat snow.
Camera: scale 1.00 → 1.08, focus (540, 620), ease-in-out over L [0, 82).
VO + subtitles: M4 second phrase speech G [724, 780). Caption `มันพอดีกับรองเท้าของผม` G [722, 790).
Sound: wind drops to near nothing L0–L20; `FX-SNOW-STEP` press at L19 (G732), no bed.
Mix intent: drop; the press is the only hit.
Cut: hard cut to `SH03` at G795 (M5 speech begins G795).
Entry → exit: boot hovers, then rests in the print; exit rests.
Acceptance:
| Frame | Observable | Evidence |
| --- | --- | --- |
| G732 / G780 | boot contacts the print at L19; the print rim is even all round | frame sheet |

## S01-B03-SH03 — hearing it again
Range and clocks: G [795, 987); L = G − 795.
Direction: close, eye level, front view, `man-parted + parka (override), P01`, expression track: `worried` L0 → `shock` L60 (hold) with the face going still by L150; mouth `talk` envelope while he speaks. Lantern in his hand at chin height, under-chin warm light. Wind has stopped by L165.
R2.1 (W5.2 verdict: **fix**): the plate crops at the neck, so the parka is not seen and the neck reads as a long flat tube; the hand is a floating disc at the cheek. Required: shoulders and parka visible to y 840 (collar, hood bunched, zip line), neck shortened by 40 px or hidden by the collar, hand drawn as a mitten gripping the lantern handle (kit mitten hand), gaunt face as in `S01-B01-SH02` (the expression track `worried` → `shock` stays; face still reads at 540 px). Lantern body height 100-150 px.
Staging: head centre (540, 500), head height 420 px (22 %), chin y 710; lantern body at (660, 780) y 700–830 in his near hand; background dark with a few flakes that slow to nothing by L165 (G960).
Camera: scale 1.00 → 1.05, focus (540, 520), ease-in-out over L [0, 192).
VO + subtitles: M5 (edited E2) `แล้วผมก็ได้ยิน…` speech G [795, 900), `เสียงนั้นอีก` G [918, 978). Captions `แล้วผมก็ได้ยิน…` G [795, 908); `เสียงนั้นอีก…` G [915, 982). Mouth `talk` on those two spans.
Sound: `AMB-WIND` fades to nothing G966–G978; **hard silence G [978, 987)** (wind, breath and room tone all out). No bed.
Mix intent: drop to silence.
Cut: hard cut to `SH04` at G987, on the onset of `จาก`.
Entry → exit: from the boot to his face; exit face still, lips closed.
Acceptance:
| Frame | Observable | Evidence |
| --- | --- | --- |
| G870 | shock reads, head 23 %, face above y 860 | frame sheet |
| G978–G986 | digital silence | waveform |

## S01-B03-SH04 — his own mouth
Range and clocks: G [987, 1100); L = G − 987.
Direction: extreme close, locked (`D09`). Lips from nose to chin, cracked and dry, light raking from below; small breath mist. During `จากปากของผมเอง` (his own inner line) the lips are closed and still; the mouth opens slightly with the whisper `หิว…` (open L50–L53, closed L106–L109). The picture reveals CL04.
Staging: lips centre (540, 520), width 620 px, nose at y 270, chin y 760. Breath mist puffs every 45 frames from L30.
Camera: locked.
VO + subtitles: M5 `จากปากของผมเอง` speech G [987, 1024); WHISPER W2 `หิว…` speech G [1040, 1092). Captions `จากปากของผมเอง` G [987, 1034); `หิว…` G [1038, 1100).
Sound: stinger `STG` (`stinger_low-muted-hit_01`) onset G996 (L9) on `ปาก`; then silence: no bed, no wind. W2 at G1039. `SN02` starts G1088 (L101), rising, close.
Mix intent: hit at L9, release to silence by L25; whisper hold barely audible; cry lift from L101.
Cut: hard cut to `SH05` at G1100.
Entry → exit: lips closed, then lips closed again; exit with the cry rising.
Acceptance:
| Frame | Observable | Evidence |
| --- | --- | --- |
| G996 | stinger on `ปาก` with the lips on screen | audio check |
| G1040–G1092 | lips open exactly with the whisper, closed before and after | sync check |

## S01-B03-SH05 — the shadow in the flap
Range and clocks: G [1100, 1250); L = G − 1100.
Direction: medium wide from inside the tent (`D10`, `VD07`, `VD13`, `VD13a`): flap opening 740 px wide, apex y 40, sill y 870, pale blue-white light beyond. The shadow of the man stands at the opening (`FLAP` cx 540, footY 856, scale 1.3), human at the start, flat dark, no face. The sleeper (`man-crop, P37`) is a dark mound at the lower left. Nobody moves. The shadow slowly lengthens into the `VD13` wendigo form (arms and legs stretch, torso and head stay).
Staging (R2.3: transformation +45 frames, 75 → 120): morph progress `k` 0 on L [0, 12]; ramps 0 → 1 with ease-in-out on L [12, 132] (G 1112–1232); holds at 1 on L [132, 150). Cut to black after L149. Motion of the form (R2.3: the wendigo must not freeze; R2.4: no jump in place; **R2.5d, user: no leap — it crawls slowly out of the frame to screen right**; `FLAP_CRAWL`, `CRAWL` posture and `GAIT` in `src/painted/wendigo/look.ts`), from the shot clock `m = L/30` s:
- **Posture** (`CRAWL`, weighted by the eased morph; the static look frame keeps the upright `WEND`): the pose the user approved for the crawl-out (`references/user/2026-11-02_wendigo-crawl-out-frame.png`, "คลานออกไป", answered yes): torso low and forward (hip 0.455 h, shoulder 0.50 h), head hung forward (0.47 h), both long arms reaching down to the floor ahead with the hands planted (wrists 0.115 h, fingertips on the foot line, elbows low), long hind legs with bent knees and feet planted apart (near ankle 0.11 h ahead of the origin, far ankle 0.27 h behind). Hind legs are solved by two-bone IK in `figureJoints` at the standing bone lengths of each leg (near thigh 0.314 h / shin 0.340 h / foot 0.095 h; far 0.267 / 0.369 / 0.085, i.e. 229/248/69 px and 194/269/62 px at h = 728), the knee always on the forward/up side.
- **Before the crawl** (L0–90): no stepping in place: breathing (±0.006 h), a slow fore-aft weight sway (0.008 h at 0.35 Hz), a head and finger twitch; hands and feet stay planted.
- **Crawl** from **L90 (G1190; first displaced frame G1191)**: ease-in over 0.4 s (L90–102) to a steady **0.5 h/s (364 px/s, ≈ 12 px/frame)** to screen right. Diagonal walking gait (`GAIT`): stride 0.40 h (291 px), stance 70 % of the cycle (cycle 0.8 s, swing ≈ 7 frames), lift 0.05 h on the swing; far hind leg with the near arm, near hind leg with the far arm, each arm 0.1 cycle after its leg. In stance a hand or foot stays fixed on the ground (measured planted slide 0.00 px/frame over L86–149; travel and gait are in wendigo heights so the late morph does not slide the feet). Weight bob 0.01 h twice per stride. Hip x ≈ 664 at G1210, 782 at G1220, 899 at G1230, 1017 at G1240 (camera push not applied). The head passes behind the right tent wall at about G1203, the torso by about G1225; the trailing far foot is the last part seen; **the rearmost limb passes x 910 at G1242 (fully hidden)**; empty opening G1242–1249.
- Ground contact: a flat shadow (0.3 h wide) under the body on the snow beyond the threshold, travelling with it (hidden with the body by the canvas).

**Geometry and layering (R2.5).** Screen space 1080×1920 px, origin top-left, y down; camera push about (540, 430). Figure space: hip-line origin x 520 (`FLAP.cx` − 20), foot line y 856, figure height h = 728 px (560 × 1.3), x forward = screen right (the form faces right), y up. Planes, front to back: the sleeper mound (inside the tent, nearest), the snow sill (threshold, y ≈ 852–884), the tent canvas and door flaps (the tent wall plane; the door opening `FLAP_OPEN` (170, 870)–(910, 870)–(910, 250)–(540, 40)–(170, 250)), then **the form, standing outside the tent beyond the threshold** (feet 14 px above the threshold line, i.e. a little beyond it), then the outside light. The form is drawn after the outside light and **before** the canvas (R2.5d: the crawl goes right, behind the right wall): the canvas right of the opening (x ≥ 910) and above the right roof slope is repainted over it (`FLAP_HIDE_SIDE`, `FLAP_HIDE_ROOF`, same washes as the canvas), then the flaps, their ink, the sill, the sleeper and the blowing snow. The form is therefore only ever seen through the lit opening; nothing of it is drawn on the canvas, flaps or floor. The sill now veils the bottom few px of the feet (the form stands in snow). The left canvas is not repainted (the bound never goes left of x ≈ 230, which is inside the opening or behind the sleeper). Look frame `WDG-LF-WENDIGO` (no `mv`) stays static.
Camera: scale 1.00 → 1.03, focus (540, 430), ease-in-out over L [0, 150).
VO + subtitles: none, no caption.
Sound: `AMB-WIND` far wind fades in L0–L30; `FX-FLAP` rustle L6; `SN02` cry continues rising through L140 (G1240), thins under the wind from L110, then **hard cut with the picture at G1250** (everything out; cry gone).
Mix intent: lift the cry slowly; release at the cut.
Cut: hard cut to black at G1250; `S02-B01-SH01` opens black (marker swap hidden in the black).
Entry → exit: entry shadow human; exit last image (R2.5d): empty opening (the form has crawled out right, behind the right tent wall, by G1242); the long-limbed form (arm-to-wrist ≈ 1.9× human, leg ≈ 1.7× per `VD13`) is last seen as its trailing hind leg (G1235–1241).
Acceptance:
| Frame | Observable | Evidence |
| --- | --- | --- |
| G1100 / G1219 | human shadow at the start, long-limbed at the end, with sound muted | frame pair |
| G1100–G1190 | the form is alive without stepping in place (breath, sway, twitch); hands and feet planted | frame sequence |
| G1186 / G1196 | crawl posture as in the user's crawl-out frame: torso low, arms reaching down to the floor, long legs with bent knees, feet planted | frame pair vs reference |
| G1191–G1242 | steady unhurried crawl right, diagonal gait, planted hands/feet do not slide, weight bob | frame sequence / measured slide |
| G1180 / G1186 | complete form, no face, eyes, teeth, blood or antlers (last full views before the crawl) | frame sheet |
| G1204–G1241 | the form never overlaps the tent canvas, flaps or floor: parts beyond x 910 or above the right roof slope are hidden by the canvas | frame sequence |
| G1242 / G1249 | form gone (empty opening, sleeper mound and sill remain) | frame pair |

## Dependencies and open items
| Owner | Dependency / acceptance | Status |
| --- | --- | --- |
| Boss | `D01`, `D02`, `D03`, `D04`, `D05`, `D06`, `D07`, `D08`, `D09`, `D10` | see index |
| Editor | E1/E2 edits, `SN01`, `SN02`, snow SFX, wind loop (index) | NEEDS-GEN |
| Film | verify intra-clip word edges on the first Draft | open |

Element captures: none taken by Film this pass (look frames in the store `look-frames/` cover tent, snow, flap; the cast, lantern, tin, boot and lips are missing elements). Scene sample proposal: `S01-B03-SH04` G987–G1100 (stinger, lips, whisper in one shot) and `S01-B01-SH01`/`SH02` G0–G192.

## Change log
2 Nov 2026 `WDG-SS-R2` — no S01 frame, cue or caption changed: the S01 voices are the voice-lock-v1 MAN/WHISPER clips, which the pTIGHT3 narration does not touch; E1/E2 are still required (they cut breaths inside those clips, not narrator pauses). Header revision and script reference only. Earlier `WDG-SS-R1` — first timed sheet; cut points from the voice lock; nothing superseded.
2 Nov 2026 `WDG-SS-R2.1` — W5.2 plate review by Film: acceptance and required fixes added to `S01-B01-SH01`, `SH02`, `S01-B02-SH01`, `SH02`, `S01-B03-SH01`, `SH03` (face gaunt, parka, framing, lantern size note, leak, tin detail list, walk 230 px/s with no-skate check); no timing, caption, cue or ID change.

2 Nov 2026 `WDG-SS-R2.3` — user timing/motion notes. (1) `S01-B02-SH01` [192, 291), `SH02` [291, 406) (115 unchanged), `SH03` [406, 446) 60 → 40 frames; cut at G446 and everything after it unchanged. (2) `S01-B03-SH05` morph ramp L12–132 (was L45–120); no donor shots: every shot after G446 carries a voice, the extra frames come from the shot's own opening hold and closing hold. (3) The wendigo form moves (lope, breath, twitch, crouch-and-leap) in `SH05`, `S02-B03-SH01`, `SH02`; `SH04` (lips) shows no form and is unchanged. Narration, spoken lines, captions in `episode.ts` and audio not touched.
2 Nov 2026 `WDG-SS-R2.4` — user note: the wendigo jumping in place looks funny. Decision (coordinator): it leaps out of the frame on all fours after a crouch. `S01-B03-SH05`: periodic in-place crouch-and-leap removed; one directed bound to screen right, crouch G1196–1220, launch G1220, out of frame by G1245, empty G1245–1249 (shot range, cut at G1250, morph ramp L12–132, `D16` unchanged). No audio, caption or narration change; Editor aligns hit/second wail to the new timeline (below the index change log). `G1249` acceptance changed from "form complete" to "empty" and the pre-leap frame check moved to G1210/G1220.
2 Nov 2026 `WDG-SS-R2.5` — user notes: (1) the form is outside the tent, so the tent must hide it; (2) the crouch must be a deep frog coil. `S01-B03-SH05`: draw order changed (form behind the tent canvas; canvas right of and above the opening repainted over it; geometry stated in the shot); spider-frog key poses COIL/PUSH/FLIGHT (R2.5b, same day: coil eased from half height to about a third lower, all four limbs splayed with the knees and elbows high and out, head low between the arms, per the user's reference `2026-11-02_wendigo-crouch-splayed-limbs-ref.jpg`); crouch G1186–1206 (was G1196–1220; starts 10 frames earlier, inside the morph), coil held G1206–1220, launch (push) G1220 unchanged, toes off G1225, fully hidden ≈ G1243, not drawn from G1245, empty G1244–1249. Shot range, cut at G1250, morph ramp L12–132, `D16`, audio, narration and captions unchanged. Look frame `WDG-LF-WENDIGO` stays static (no motion); its layering now also puts the figure behind the sill (feet veiled a few px).
2 Nov 2026 `WDG-SS-R2.5` (R2.5c, same day, user corrections): legs in the coil foreshortened and lost in shade (shins faded, knees just over the back, feet close under the hips); crawling arms in the lope (`CRAWL` base posture) and the coil (shoulders low, elbows bent out and low, hands flat ahead); snap exit: launch G1220 unchanged, toes off G1223, one blur frame G1224, gone from G1225 (was ≈ G1243/G1245), empty G1225–1249.
2 Nov 2026 `WDG-SS-R2.5d` — user dropped the leap: the wendigo crawls slowly out of the frame instead. Removed: crouch, coil, launch, push, flight and blur streak (`Bound`, `COIL`/`PUSH`/`FLIGHT`, snow kick, leg fading); also the in-place lope (no stepping in place). Added: `CRAWL` posture (the user-approved crawl-out frame), planted diagonal gait, hind-leg IK at standing bone lengths, `FLAP_CRAWL`. `S01-B03-SH05`: crawl from G1190 (first moves G1191), fully hidden behind the right tent wall at G1242, empty G1242–1249. Tent occlusion, morph ramp, shot range, cut G1250, `D16`, static look frame unchanged. Editor re-places wail 2 (was G1214) and the hit (was G1222) to the crawl; audio not touched by Film.
