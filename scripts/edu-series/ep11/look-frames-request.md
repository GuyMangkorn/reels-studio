# Look-frame painting request — EDU-EP11-SHORT (Film → Boss, W3)

Request: **EDU-EP11-LFREQ-R1** (Film, 2026-11-09). Source of truth: [film-brief.md](film-brief.md) **EDU-EP11-BRIEF-R1.2** ([Look frames](film-brief.md#look-frames), VD01–VD33) and [storyboard.md](storyboard.md) **EDU-EP11-ROWS-R1.2**. Spike base: [spikes.md](spikes.md) (SP1–SP4 code in `src/painted/edu11/`, uncommitted, branch `claude/education-concepts-cleanup-61a91a` at `cfbfd4b`). If this file and the brief disagree, the brief wins; tell Film.

## What to deliver

- Seven stills, 1080×1920, painted at production look (not blockout), in the production owner module `src/painted/edu11/` (sets, figures and layers you will reuse for the shots; promote spike code there, do not fork it). Each still is the real frame of the named shot at the named global frame, so the camera lines below are the shot's camera at that frame (eased values, `est`).
- Stills through `scripts/stills.mjs` on one Chrome (`--gl=angle`), output `out/edu11/lf/LF01.png`, `LF01b.png`, `LF02.png`, `LF03.png`, `LF04.png`, `LF05-jaws.png`, `LF05-catch.png`; one `scripts/qa-sheet.sh` sheet of all seven (`out/edu11/lf/sheet-lf.png`) and a 2-up sheet for LF05. Render stage: stills only ([render rules](../../../docs/render-rules.md)).
- Measurements per still: lead height (anchors, as in `spikes/measure-anchors.ts`), `python3 -I scripts/caption-zone.py --band 1176:1344 <stills>` to `out/logs/edu11-lf-capzone.json`, and slot rects of any DOM layer drawn. Report the numbers in a short table appended to [spikes.md](spikes.md) or in a new `scripts/edu-series/ep11/lf-results.md` (your choice; Film reads either).
- File the stills with `python3 -I scripts/store.py archive --path out/edu11/lf --project EDU-EP11 --kind look-frames` after the coordinator has seen them; cite the store path.
- Do not add the stills to `review-rows.json`: Film adds `looks` in the next pass and the coordinator republishes the page.

## Common to every look frame

- Look: painted 2D p5.brush through the kit yaw camera, sets in metres ([painted 3D camera](../../../docs/film-visual-brief-workflow.md#painted-3d-camera)); 4-head kit rig cards squared to the lens (`squareToCam` from that shot's mid camera); palette from the brief's colour key.
- Frame zones: caption band y 1176–1344 (no story read there; floor and legs may enter); faces, contacts, bites and the rope cut above y 1160; `@TamMaiLa` top-left (`video.chrome` default; draw it in the still or leave the top-left 360 × 120 clear).
- Slots (DOM, frame px; draw them in the still only where listed): LBL x 816–1020, y 148–204; HUD x 800–1040, y 224–600; CAP x 48–440, y 150–206; INSET x 760–1040, y 640–1138 (6 px white border); STAMP centre (905, 720).
- Stand-ins allowed (say which in the results): `rail-crouch` → P35; `float-grab-rail` → P46 with the right hand placed on the rail by `twoBone`; the INSET content → `public/edu11-spike/inset-f877.png` (spike raster). Not allowed as stand-ins: the showman's outfit and top hat (N12) and the crowd dress (N14), because LF03/LF04 are their look checks.
- Captions are not burned into the stills. Sound: N/A (stills).
- Viewer check: the coordinator runs it ([sequence-workflow viewer check](../../../docs/sequence-workflow.md#viewer-check)) before the user sees the sheet; also check each still against [user taste](../../../docs/user-taste.md) at 270 px yourself before handing back.

## LF01 — SET-CAR, S01-B01-SH01 @ f0 (place, woman, steel)

- Camera: `cam: target (0.0, 0.95, −0.30), yaw 10, r 2.50, eye 1.60, f 1200, hy 740` (CAM-CAR-M frame 0, VD05).
- Set (CAR space, brief set plan): floor/ceiling y 0 / 2.30, x −0.70…+0.70, z −0.65…+0.65; front wall culled; side walls extended to z +1.4 (SP1 dark-strip fix); LED ceiling panel `#eef6ff`; left-wall handrail y 0.90; panel centre (−0.70, 1.20, −0.20) with display "20" (`#ff5a36` on `#14181c`) ≈ (185, 495) and the amber bell button (−0.70, 0.95, −0.20) ≈ (204, 737), glow 30 % (ENV-GLOW `paintHalo`); right-wall plaque with no readable text.
- **Steel values (VD32):** above the handrail mid `#a7b0b8`, shadow `#6f7a84`, highlights `#dfe6ec`; below the handrail mid `#7b858e`, shadow `#59636c`, highlights `#b4bdc5`; three-step wall-base shadow ramp (as in `paintCar`).
- Casting: **`woman-long + office (tie off), P10, neutral`**, feet (0.05, 0, −0.30), faces +z, front view, phone in the right hand at the chest, looking down at it; hair at rest (`hairRise` 0).
- Screen: no HUD (it slides in at f45).
- Accept: lead ≥ 700 px (SP1 measured 801); caption-zone **mean 0.25–0.32** (p95 not targeted; if the mean is above 0.32 darken the lower mid one step toward `#6f7a84` and report); display, bell and her face readable at 270 px; the frame says "lift, alone, evening" with no motion (UT01).

## LF01b — SET-CAR float, S01-B01-SH03 @ f220 (weightless read)

- Camera: `cam: target (0.0, 1.00, −0.30), yaw 3.1, r 2.21, eye 1.60, f 1200, hy 740` (VD07 eased at f220).
- Casting: same woman, P46 + `zero-g-drift` (phase at t = 220/30 s), `scared`; right hand gripping the rail at (−0.66, 0.92, −0.30); **whole-card roll ≈ +13.5° (head toward the rail), pivot at the grip** (VD07; fallback hips pivot with the grip re-solved); feet 0.15 m above the floor; `hairRise` 1 (as built in SP1, unchanged).
- Phone: free at ≈ (0.28, 1.72, −0.20), rotated ≈ 107° (40°/s from f140).
- Screen: HUD in slot: counter 18, needle ≈ 24 % of the dial, tag pill "ถ้า…ร่วงจริง", no readout pill. Light at 85 %.
- Accept: lead ≥ 700 px (≈ 780 px expected at the roll); feet gap ≥ 40 px with the soft floor shadow; phone clearly separate from the hands; no arm pop against f219/f221 (render the two neighbours for the check, not for the sheet); at 270 px it reads **weightless, not electrified** (the SP1 open call; the user judges it here).

## LF02 — SET-SHAFT section, S01-B02-SH01 @ f400 (the rule)

- Camera: **CAM-SHAFT-CLOSE** `cam: target (0, 45.15, 0), yaw 1.9, r 5.0, eye 45.15, f 2600, hy 770` (y_car = 44.50 from VD10 at f400).
- Set: SET-SHAFT as SP2, plus **landing variants** LV-A closed dark / LV-B half open with a warm lobby strip `#ffe2a8` / LV-C closed with a lit call-button dot and a light line under the doors, order `LV[(n·7 + 3) mod 3]`, every 4th floor LV-B (brief set plan); rails at x ≈ 95 / 980 both visible (CL01); car shell cut at z 0, shell bottom ≈ y 1160, roof ≈ 140 px off the top; work-light dots; **streaks ≈ 42 %** alpha, length = px/frame × 3 (≈ 23 px/frame here, est), never over the car or her.
- Casting: WOMAN crouched (P35 stand-in for `rail-crouch`), right hand on the rail, left hand on her knee, `angry` (determined), hair rise 1.
- Diagram layer (N8): two identical white down-arrows with ink edge `#2b211c`: on the car's right side x ≈ 925–995, y ≈ 700–960; on her x ≈ 505–575, y ≈ 700–960 (both full size at f400).
- Screen: HUD counter 15, needle ≈ 48 %, readout pill "ราว 120 กม./ชม." at the top tick, tag pill.
- Accept: crouched lead ≥ 480 px (SP2 close variant 486); shell bottom ≤ y 1160; arrows equal in size (±2 px) and clear of the HUD; the still alone hints at falling (streaks, varied landings).

## LF03 — SET-HALL1854, S01-B04-SH02 @ f980 (era, showman look check)

- Camera: `cam: target (0.0, 3.00, 0.0), yaw 1.9, r 5.10, eye 1.60, f 1600, hy 960` (CAM-HALL-W eased at f980).
- Set (HALL space, brief set plan): platform top y 2.40, x/z ±0.90, low rail on three sides, two crates and a barrel; notched timber uprights x ±1.00 (notch pitch 0.10, tooth tops up as in SP4 `catch-1854`); hoist rope from (0, 2.95, 0) up to the pulley and down the right upright to the winch (1.45, 0.6, 0.30), intact at f980; iron columns x ±4.0; arched glass roof y 9–13 with light shafts from upper left (ENV-FOG `paintFogCone`, `#fff3d6` at 40 %); bunting y 6.5, **textless**; no building name anywhere (B-P1-FIX-b). Sepia palette (paper `#efe2c4`, mid `#b89b6e`, shadow `#6e5a3e`, ink `#3d2f22`).
- Casting:
  - SHOWMAN **`man-parted + new: 1850s showman, P05, neutral`** (frock coat, waistcoat, cravat, top hat; N12, kit `wardrobe.ts` + `gear.ts` HatKind): feet (0.0, 2.40, 0.30), front, pointing down-right at the assistant; no portrait likeness.
  - ASSISTANT `man-buzz` own apron outfit + `cap`, right view, feet (1.45, 1.20, 0.55) on the trestle, axe raised high (75 % of `new: axe-chop`; N13).
  - CROWD ×4 `new: 1850s crowd dress` (N14), back view, heads at (−0.6, 1.72, 3.0), (0.7, 1.65, 2.8), (−1.5, 1.60, 3.6), (1.6, 1.78, 3.4).
- Screen: CAP "นิวยอร์ก 1854"; INSET (stand-in raster) bottom-right; no HUD.
- Accept: showman ≥ 480 px (est 518: head ≈ y 625, feet ≈ 1143); rope cut point ≈ (1030, 1086) visible and above y 1160; crowd heads may overlap the band (backs only); era reads at once against LF01 (warm sepia vs cool steel).

## LF04 — SET-STORE1857, S01-B04-SH06 @ f1180 (first passenger lift)

- Camera: `cam: target (0, 5.95, 0), yaw 0, r 5.0, eye 1.60, f 1300, hy 960` (CAM-STORE tilt eased at f1180).
- Set (STORE space): cast-iron front, five storeys × 4.2 m, arched windows, generic; centre bay x −2.0…+2.0 cut open from y 4.2 up; open cage car 1.6 × 2.2 m at y_car ≈ 5.85; hoist hidden in shadow above the cut; **no safety catch and no rope detail on the cage**; no store or street name anywhere (Boat W2). Sepia with cooler shadows `#8c93a0`; gas lamp (3.2, 0, 1.5) `#ffd08a` if in frame.
- Casting: PASSENGERS ×2 `new: 1850s crowd dress`, front, `neutral`, standing in the cage.
- Screen: CAP "1857"; INSET (stand-in raster).
- Accept: passengers ≈ 440 px (below 480: **lead-size exception** pending, VD24; report the measured value); the cage reads as a passenger lift in a store at 270 px; nothing readable except "1857".

## LF05 — two brakes pair: S01-B05-SH03 @ f1405 beside S01-B04-SH04 @ f1050

- **Jaws** camera: `cam: target (0.85, y_car + 0.95, 0.15), yaw −20, r 0.75, eye = target y, f 2600, hy 800` (CAM-JAWS, VD27; car-relative as in SP4). Jaws bitten on the smooth T-rail, no bloom (the bloom is f1400 only), slide finished. HUD: counter 20, needle ≈ 2 % (returning to 0), tag; LBL "ภาพประกอบ". No governor drawn.
- **Catch** camera (R1.2, VD22): `cam: target (0.72, 2.65, 0.10), yaw −15, r 1.28, eye 2.80, f 2000, hy 760` (push from r 1.30 at f1047, eased at f1050). Staging: slack cut rope draped (0.37, 3.05) → (0.55, 2.92); bow spring leaf (0.50, 2.88) → (0.77, 2.72) flat; pawl in the notch, tip ≈ (915, 1098); amber outline `#ffb84d` on pawl and notch only; LBL "ภาพประกอบ"; sepia; no HUD. Also render f1042 and f1045 (not for the sheet) so Film can check the order rope slack → spring → pawl.
- Accept: the two share no shape, colour or angle (R04, SP4 pass kept); rope, spring and pawl all inside the catch frame; bite, pawl tip and notch pocket above y 1160; labels in slot LBL.

## Open for Boss to report

Any value here that does not land (lead, shell bottom, arrow rects, pawl position, caption-zone mean): report the measured number and the change you suggest; Film updates the brief rather than you moving the plan to fit the still.
