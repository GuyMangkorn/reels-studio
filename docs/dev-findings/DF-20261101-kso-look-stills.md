# DF-20261101-kso-look-stills — painted woman at 1.95 m, no back view, reveal coat under the caption-zone rule

- Owner: Boss; first observed: 1 Nov 2026; last checked: 1 Nov 2026, working tree on `claude/check-project-pipeline-4ec3f9` (base `4568c05`, uncommitted).
- Status: workaround (look stills in `src/painted/kuchisake/`; no shared kit or renderer code changed).
- Type: rig measurement (two unknowns from KSO-BRIEF-FILM-R1) and a look conflict (caption band against a beige reveal coat).
- Tags: 2D / painted / cast / proportion / back view / caption-zone / look-lock.
- Scope: `src/painted/kit/cast.ts` (`drawFigure`, `CastDef.height`, `FigPose.view`), `src/painted/kit/head.ts` (decal head); episode module `src/painted/kuchisake/` (`cast.ts`, `face.ts`, `street.tsx`, `space.ts`, `look.tsx`, `look-index.ts`, `qa-index.tsx`).
- Consumers: `KSO-LF01`, `KSO-LF02`, `KSO-LF03` (+ `-RAW`) and `KSO-QA-LEAD-02/-03`, `KSO-QA-PROP`. Brief rows: VD05 (back view), VD06 (woman, 1.95 m), VD02 (coat colour), VD07 (mask), acceptance 3 and 4.

## Symptoms and evidence

- **Unknown 1, does `drawFigure` hold proportions at 1.95 m: yes, no distortion found.** The rig scales the body with `CastDef.height` (chin = height − H, shoulders, hips, knees, coat hem); the head stays at H = 0.425 m and the arm bone at 0.26 m. Measured from the rig's own anchors at 300 px/m (one-off script outside the repo, stub painter; not committed):

  | Landmark (fraction of height) | Woman 1.95 m (4.6 heads) | Narrator 1.70 m (4.0 heads) | CP-L adult reference (1.72 m) |
  | --- | --- | --- | --- |
  | Head top (anchor, 1.17 K) | 1.012 | 1.013 | 1.000 |
  | Chin | 0.782 | 0.750 | 0.867 (7.5 heads) |
  | Shoulder (R anchor) | 0.734 | 0.695 | 0.805 |
  | Hip (analytic, kit constants) | 0.436 | 0.418 | 0.538 |
  | Knee (analytic) | 0.228 | 0.220 | 0.279 |
  | Hand tip, arm hanging | 0.453 | 0.373 | about 0.5 (CP-L09) |

  The woman sits closer to the CP-L adult table than the narrator on every landmark. The picture `out/kuchisake/qa/prop_f0.png` (both figures on the same rig, landmark lines drawn) shows no broken part. Two consequences: the coat hem is set from the knee (`hem = knee − 0.05 m`), so a "long" coat ends at about 0.39 m, and the visible shins are about 0.4 m; the arms are the same metres as the narrator's, so they read proportionate on the taller figure.
- **Unknown 2, back view: missing in the rig, not needed by the KSO shot list.** `FigPose.view` and the decal head take `front | left | right` only (see [DF-20261030-painted-profile-head-turn](DF-20261030-painted-profile-head-turn.md)). Checked against KSO-BRIEF-FILM-R1: the narrator walks in profile, the narrator glances back from the front with the `look` vector, and the POV shot is empty. No shot needs a back-facing figure. VD05's "fallback profile" stays the rule.
- **Lead (acceptance 4), measured on pixels.** `KSO-QA-LEAD-02` (LF02 framing, push 1.03): visible artwork rows 268–904, feet anchor 880 → 612 px from feet to hair top (637 px with the ground shadow). `KSO-QA-LEAD-03` (LF03): rows 299–1919 (1621 px, runs off the bottom edge; not an extreme close). Both ≥ 480 px. At 300 px/m a waist-up "MS" would be about 330 px tall, so the brief's `S02-B02-SH01` "MS" is a full-length frame here; a true MS needs about 560 px/m (head about 240 px).
- **Caption zone (acceptance 3), LF03 reveal.** Raw plate: mean 0.305, p95 0.685 (fail). The bright area is the lit coat shoulders (about y 940–1060) and the mask. A beige shoulder in the band needs about 45 % darkening to keep p95 ≤ 0.40, so the coat reads charcoal under the rule. With the look falloff: mean 0.118, p95 0.302 (pass). LF01 and LF02 pass raw and with falloff.

## Attempts and results

- Mask bunched under the chin (first design): a bright white shape in the band, p95 fail. Changed: the whole mask drops about 1 m on its ear loops out of the close-up frame (`face.ts` `DROP`), so the band carries only the coat.
- Skin patch to clear the decal's flat mouth line: read as a pale blob. Changed: the mouth interior covers the decal's flat mouth line (v 0.6); no patch.
- **Closed smile line replaced by an open slit grin (user direction, 1 Nov 2026):** the mouth slashed ear to ear, dark interior, two rows of teeth with ink notches, lip edges and rips into the cheeks (`face.ts` `OPEN_TOP`, `OPEN_BOTTOM`, `teethBand`, `toothNotches`). Painted-2D ink and wash, no red (VD02), no blood. Measured on `LF03` (K = 230.1 px per head unit): visible dark interior x 331–749 (419 px), teeth x 333–736 (404 px) and y 669–712 (44 px, both rows); analytic corner-to-corner outline 479 px and opening about 94 px tall at the centre. The grin sits at y 648–786, above the caption band (860). Caption zone after the change: mean 0.118, p95 0.302 (pass; unchanged, the grin is above the band).
- **Round 3 — "more horrifying" (user direction, 1 Nov 2026), LF03 only; the round-2 grin is kept as `LF03-v2`.** Changes: eyes `wide` with small pupils and a fixed stare (`look` [0, 0]); brows `angry` (angled down toward the nose; a one-raised `quirk` was tried first and read too weak), both set in `cast.ts` `REVEAL_FACE`, passed to `drawWoman` only for LF03 and its QA entry (LF02 keeps `CALM_FACE`); the grin is asymmetric (`warp`: the left corner rises and reaches further into the cheek); uneven teeth, one quad each (`tooth`), fangs, two gaps where the gum shows, one broken tooth in a darker tint; a deeper interior with a shaded top; a tongue with a ridge; dusky mauve gums (`GUM` `#4b3336`, low saturation, no red); torn lip edges (jags) and five rips (three left, two right). Measured on `LF03` (K = 230.1 px per head unit): teeth x 326–750 (425 px) and y 667–725 (59 px, both rows); visible dark interior x 331–749 and y 642–790; the grin still sits above the caption band (y 790 < 860). Caption zone: mean 0.118, p95 0.302 (pass; unchanged). Red-dominant pixels in the mouth box: 0.00 %. Repeat render identical; RGB 0 none. Face read at 270 px: eyes, brows, teeth and grin read (`LF03-sheet-270.png`). LF02 md5 unchanged across the change (`ec7b47de40ad…`). Round-2 helpers `teethBand` and `toothNotches` were removed in round 3.
- Reveal head at centre y 679: chin and jaw in the band. Changed to y 579 (`CU_HEAD_Y`), so eyes, smile and chin sit above y 860.
- Backdrop as a wash rectangle: visible horizontal edge at y 1000. Changed to an ellipse.
- Lamp falloff as a screen layer (`Falloff` in `look.tsx`, from y 840 to 1060, peak 0.85 for LF03; 760 to 1920, peak 0.62 for LF02/LF01): the one look decision that makes the reveal pass. Raw plates are rendered too (`-RAW` compositions), so Film can judge it.
- Repeatability (two renders, `--gl=angle`): LF02 and LF03 identical; LF01 one pixel off by 1/255. RGB 0: LF01 0.043 % of pixels, LF02 and LF03 none.

## Planning impact

- **Film (brief revision needed, `KSO-BRIEF-FILM-R2` candidate):**
  1. `S02-B02-SH01` "woman MS": keep full length at 300 px/m (LF02 as painted), or move to ≥ 560 px/m for a true MS (head about 240 px; the face gets smaller at 270 px tiles relative to the frame).
  2. VD02 coat: beige is kept in the upper body only if the reveal band is exempt from the p95 rule or shaded by the production caption shade. Otherwise the coat is charcoal in `S02-B03-SH03`. Decide by look.
  3. VD06 "long coat": the kit hem is at the knee. A mid-calf hem needs a kit `hem` option (shared kit change, after the look lock) or episode paint. Decide if knee-length reads as "long".
  4. VD07 mask: in LF03 the mask has dropped out of frame on its ear loops, not under the chin (the chin version fails the band). Confirm.
  5. Fiction marker top-slot clearance is not in these stills (no SVG marker rendered); Editor must check it in the timeline.
  6. **Open grin (user direction, 1 Nov 2026) against the brief.** Acceptance 2 ("at full size no teeth, blood, flesh or open wound") and the `SH03` read ("smile line") no longer hold: the grin shows teeth and an open mouth from `S02-B03-SH03` onward. Film to revise `SH02`–`SH05`. The grin is a fixed shape: no lip-sync, no mouth movement, so `SH05` (static smile, head tilt on `ยังสวยอยู่ไหม`) stays a still mouth on a moving head; `SH04` keeps the mouth off screen. Check that a static open mouth does not read as speech in `SH05`. Round 3 also sets the reveal face to wide eyes with a fixed stare and angry brows (`REVEAL_FACE`): `SH03` and the head tilt in `SH05` need the same face state, and Film should describe it in the brief.
- **Editor:** the falloff layer is an episode screen layer, not a shared kit change; if the user keeps it, Editor/Boss move it to the shared `screen.tsx` after the look lock (shared painted code is frozen after approval, boss-asset-workflow W2).
- **Boss:** no shared code changed. The standalone look entries stay out of Root and the registry until the user approves.

## Revalidation history

- 1 Nov 2026: first measurement (base `4568c05` + uncommitted `src/painted/kuchisake/`). Method: `scripts/stills.mjs src/painted/kuchisake/look-index.ts` (one Chrome, `--gl=angle`), `scripts/caption-zone.py`, `scripts/qa-sheet.sh`, magenta-paper lead measure, kit anchors through a stub painter.
- 1 Nov 2026 (round 3, LF03 only): open grin with wide eyes, angry brows, asymmetry and interior details; the same method (stills through one Chrome, caption-zone, mouth-box red share, repeat render, LF02 md5). Round-2 frames archived as `LF03-v2` in `~/ReelsStore/projects/KSO/previews/look-stills/`; round-3 set in `~/ReelsStore/projects/KSO/previews/look-stills-r3/`.

## Round 4: LF04 back room and LF05 dark room (1 Nov 2026, Boss)

- Status: workaround (new episode files `backroom.tsx`, `darkroom.tsx`, `rooms.ts`, `room-screen.tsx`; `look-index.ts` appended; `room-qa-index.tsx` for the lead measure; no kit, LF01–LF03 or Root change). Frames: `out/kuchisake/review/LF04_S01-B02-SH01_f81.png`, `out/kuchisake/review/LF05_S03-B01-SH03_f70.png`; not user-approved (W2 look lock pending).
- Measured (lead: magenta-paper QA entries `KSO-QA-LEAD-04` f81 and `-05` f70, figure only, shadow excluded): LF04 coworker about 537 px (feet y 880, hair top y 343); LF04 narrator in profile about 706 px; LF05 narrator crouched 0.8 at 470 px/m about 510 px (feet y 1135, hair top y 625). The head drop costs about 18 px at this depth; a drop of 0.25 head units costs about 21 px more, so the rig nod is capped at 0.2 here.
- Measured (caption band 860–1248, `scripts/caption-zone.py` defaults): LF04 mean 0.128, p95 0.212 (RAW p95 0.223); LF05 mean 0.117, p95 0.273 (RAW p95 0.290). Both pass.
- Repeat: LF04 f81 from two Chrome runs differs by 1 byte of 6.2 M, by 1/255 (render noise, [DF-20261030-render-run-noise](DF-20261030-render-run-noise.md)); LF05 f70 md5 identical.
- Blocker (open, not fixed): the flashlight-under-chin read (VD04) is weak. The kit head model (`kit/head.ts` `faceModel`) lights the face evenly, and its jaw core (`planeBand` down the head) darkens the chin whatever the key. Key `[-0.25, -1]` with `warm` 1 changed little. An episode glaze under the chin (opacity 80, cream) only lightened the neck top and was removed. A real under-light needs a kit head change, which is frozen after the look lock: needs the user's agreement or Film's acceptance of the lantern read.
- Dark-room colour: the WFOG narrator's default shoes (`#d9d4c8`) and light shirt read as white patches in a near-black room. The room override (`NARRATOR_DARK` in `rooms.ts`: dark jacket, shirt, pants and shoes) is the per-video outfit swap of VD05; the head and body are unchanged.
- Floors: a `washAt` floor leaves ragged bleed along the wall line, which reads as terrain. A `hardFill` floor gives the straight architecture edge the rule asks for.
- Crouch arms: `poseArms` targets are standing-only (kit comment). `hangArms` in `rooms.ts` applies the P01 offsets from the crouched shoulder (`shoulderHeight(def, c)`), so the pose stays P01 at any crouch.
- Consumers: `KSO-LF04`, `KSO-LF04-RAW`, `KSO-LF05`, `KSO-LF05-RAW`, `KSO-QA-LEAD-04`, `KSO-QA-LEAD-05`.

## Round 5: LF04 izakaya, narrator from behind (1 Nov 2026, Boss)

- Status: workaround (episode files only). New: `izakaya.tsx` (the LF04 scene; replaces `backroom.tsx`, deleted; composition IDs unchanged) and `narrator-back.ts` (the back of the narrator's head, nape, hair, collar, shoulders and arms: new episode art, not kit). Edited: `room-qa-index.tsx` (lead entry), `look-index.ts` (import, comment), `rooms.ts` (comment only). No change to `src/painted/kit`, LF01–LF03, LF05 or Root. Not user-approved as a look (W2 look lock pending for LF04). Frames: `out/kuchisake/review/LF04_S01-B02-SH01_f81.png` and `_540.png`; store copies in `~/ReelsStore/projects/KSO/previews/LF04_S01-B02-SH01_*` (nine files, filed with `store.py archive --kind previews`).
- User decisions (chat, 1 Nov 2026): izakaya; coworker tells the story at a table, half-body (waist up); warm orange lamp-light, brighter and more orange; narrator seen from behind with new back-of-head art, dark work jacket as `NARRATOR_DARK`; keep the weak under-chin read, the kit head and the cast skin tone.
- Layout on the one street lens (`roomP`/`roomUnit`: camera z 4.7 m, eye 1.5 m, f 1410 px·m; table top 0.75 m):
  - Coworker stands behind the table at z 2.0 m: 522 px/m (round 4: z 0, 300 px/m). At 300 px/m a waist-up figure leaves about 250 px of artwork, under the 480 px rule, so she is placed nearer on the same lens; her scale is not raised.
  - Table back edge at z 2.2 m, front edge at z 2.65 m. The back edge cuts her at y 853 px (about 0.69 m; her hip line is 0.71 m).
  - Narrator seated at z 2.9 m (783 px/m, x −0.45 m), lowered 0.15 m for the seat (head top 1.55 m, shoulder line 1.06 m, hip line 0.56 m). The rig has no seated pose, so the back view is painted from the rig's proportions (same head unit, shoulders, torso and jacket colours).
  - Paper lantern on the table at z 2.4 m, x 0.2 m, centre 0.92 m (plate 663, 786): the one light source in front of the coworker, from below-right (round-4 key `L_COW`, unchanged). Two wall lanterns and a noren at the back.
  - Falloff for this look: from 840 to 1080 px, peak 0.6 (round 4: 800 to 1920). Table-top lamp sheen opacity 80 → 50.
- Measured (1 Nov 2026):
  - Lead, magenta entry `KSO-QA-LEAD-04` (coworker and table in the paper colour; non-magenta rows counted by a one-off script, not committed): f0 559 px (y 294–852), f81 572 (284–855), f161 587 (273–859). Minimum 559 px at f0, the push start. The top includes the tied bun.
  - Caption band 860–1248 (`scripts/caption-zone.py` defaults, max mean 0.25, max p95 0.40): f81 mean 0.180, p95 0.385 (pass); f0 0.177 / 0.382; f161 0.183 / 0.387. RAW (no falloff) f81 mean 0.267, p95 0.440 (fails raw; round-4 raw was p95 0.223). Round-4 f81 with falloff: mean 0.128, p95 0.212.
  - Before the falloff and sheen change, 51,006 pixels (12 %) of the band were above 0.40, all at y 860–959: the lamp-lit table top, not the coworker.
  - Whole-frame mean luma (540×960 downscale): 0.191 (round 4: 0.128).
  - Repeat: f81 as a standalone run twice and inside a three-frame run: 2–3 bytes of 6.2 M differ, each by 1/255 (render noise, [DF-20261030-render-run-noise](DF-20261030-render-run-noise.md)).
  - LF05 f70 md5 `b5326f5209…` before and after this round: byte-identical.
  - Checks: `tsc --noEmit` one error, `tests/loudness.test.ts` (pre-existing, unrelated to this round); `eslint src/painted/kuchisake` clean; `tests/painted.test.ts` 5 of 5 pass.
- Weak points (for the user and Film):
  1. Under-chin read: kept as the user asked; still weak (the kit head, round-4 blocker).
  2. The narrator's back is simplified. The long hair reads as a bob ending at the shoulder line; the nape is a small skin notch; the arms and the lap are flat cards and the lap reads as a box or cushion. No hands visible. The art needs the user's review.
  3. The coworker stands behind the table. A seated pose needs a rig pose that does not exist, and a nearer depth to keep 480 px (estimated, not built).
  4. The narrator sits nearer (head about 1.8 m from the lens), so her back of head (about 333 px high) is larger than the coworker's head (about 222 px). Consistent with the physical depths, but it is an over-the-shoulder foreground.
  5. At f0 the narrator's left shoulder touches the left frame edge, and the push (f161) crops it more. No exposed stage edge.
  6. The lantern covers the coworker's right shoulder and apron edge (about x 602–724, y 705–865).
  7. The lower third is near-black (falloff and floor). Not checked on a phone-sized screen.
  8. Not run: Studio cold load and seek; the full sequence (only f0, f81 and f161 of 162 frames rendered); neighbour shots; audio and Thai captions. These are still frames, not a sequence check.
- Planning impact (no brief or scene edits made here; owners to revise):
  - Film: VD04 (izakaya, table, half-body, table lamp); the `S01-B02-SH01` row ("narrator in profile at left" → narrator from behind, seated at the near side, left foreground); VD05's "missing: a back view" is closed for this shot by the episode art; the coworker stands behind the table.
  - Mark: the `S01-B02-SH01` scene sheet (izakaya set, table cut at the hip line, lantern on the table, narrator from behind).
  - Editor: no timeline change. Consumers: `KSO-LF04`, `KSO-LF04-RAW`, `KSO-QA-LEAD-04`. `KSO-LF05` is unchanged.
- Tooling note: `store.py archive --path DIR` stores each file at `prefix/<relpath>`, so a subfolder needs the parent folder as `--path`; this round's files sit at the top of `projects/KSO/previews/`.

## Round 6: W5 draft build, 26 shot plates (1 Nov 2026, Boss)

- Status: workaround, episode code only (new files `src/painted/kuchisake/shot-woman.ts`, `shot-art.tsx`, `shot-index.tsx`; plates `src/painted/shots/kuchisake.tsx`; one registry line in `src/painted/registry.ts`; test `tests/kuchisake-shots.test.ts`). LF01–LF05 look files, `src/painted/kit`, `src/Root.tsx` untouched. No timeline, composition registration, audio or captions (Editor).
- Plate IDs `KSO-<short shot ID>` (for example `KSO-S02-B03-SH03`), `serves` `KSO-EP01-SHORT-<short ID>`; the frame index is `KSO_SHOT_INDEX` (26 contiguous rows, 0–2461). Standalone stills entry `KSO-SH-<ID>` compositions in `src/painted/kuchisake/shot-index.tsx`.
- Mouth tear (`S02-B03-SH03`, user note): `paintMaskFaceTear` in `shot-woman.ts` repaints the face.ts mouth with `tear = {corner, open}`; `tearAt(lf)` splits the corners over f0–6 and opens the jaw and interior over f4–12, then holds. Verified: the full-tear woman at frame 0 with LF03's own layers is pixel-identical to the approved `LF03` still (PSNR inf; a scratch entry, deleted). Stills at f0/4/8/12/15/20/29 read as closed line → slit → full grin.
- Shot-to-look checks: `S02-B02-SH01` f37 is pixel-identical to `KSO-LF02` f37 (PSNR inf). `S01-B02-SH01` f81 vs `KSO-LF04` f81: PSNR 110 dB (one-LSB noise). Draft mode (`--props='{"paintDraft":true}'`) runs on the shot entry; the draft frame differs from final by design (PSNR 30 dB).
- Caption band (`scripts/caption-zone.py`, band 860–1248, mean ≤ 0.25, p95 ≤ 0.40), 94 frames: 16 fail, all in the shots below. Causes: the lower falloff does not reach lit table wood (S01-B02-SH03/SH04 crops), the 560 px/m step shows legs to the feet (S02-B02-SH03), the rigid mask drop puts the white mask edge in the band during the hook and the first reveal frame (S02-B03-SH02, SH03 f0), and close-up lit skin/jacket (S02-B03-SH04 f095, S03-B01-SH05). Per-shot falloff strengths were raised where a shot is a crop; the look files keep their approved falloff.
- Cold grade: `ColdGrade` is a screen blend and lifted the band (p95 0.66 on the cut-in); the izakaya cut-in now uses a multiply cool (`#8fa9c4`) and the stronger falloff.
- Lead height: not pixel-measured in this round (no magenta QA entries for the new shots). Analytic from rig units (metres × px/m, plate px): woman 300 px/m → 585 px, 560 px/m → 1092 px; narrator 300 px/m → 510 px (street walk and glance, at the 480 px floor); narrator crouched 470 px/m → ~510 px (LF05 measure); coworker waist-up 522 px/m → ~496 px above the table (LF04 measure 559 px at f0). Pixel measurement is open.
- Open for user / Film (not decided by Boss):
  1. `S01-B02-SH04` smile: the script event and CL01 say relief, not teasing; "sly/scheming" (เจ้าเล่ห์) is the opposite reading. Built as relief (`COW_RELIEF`). `COW_SLY` (one brow lifted, eyes aside) is defined in `shot-art.tsx` but not rendered or wired.
  2. `S02-B02-SH03` "waist-up": at 560 px/m the figure's legs remain visible to the feet (y ~1270). A true waist cut needs a dark ground mask or Film's acceptance.
  3. `S02-B03-SH02`: the mask slides down rigidly, so its lower edge is in the caption band from f18 (p95 0.52–0.56); the brief keeps the mouth covered until f1554, which means the mask stays low in the frame.
  4. `S02-B03-SH05` head as hero: 311 px per head unit (head ~706 px, ~37% of frame height), chosen so the grin stays above y 860. "Head fills most of the frame" (brief, user note) would put the grin in the caption band (p95 > 0.40).
  5. `S03-B01-SH05` is now a close profile (scale 1.9–2.2); the band fails (p95 0.43–0.50) and the body is still lit.
  6. Lip-sync is not wired: `S02-B03-SH01` and `SH06` hold a static talk or gasp mouth. Editor can pass amplitude later (`open` on the talk mouth).
- Known limits: head tilt rotates the whole figure about the head (brush rotation), not the head alone (`S02-B03-SH05`, `S03-B01-SH01`). The ear-loop hand is one painted card (`paintEarHook`, pinch-solved) and is a CP-P12 deviation from the pose sheet, as the brief records. `S03-B01-SH02` insert A (feet, profile, 0.1 cycles/f) crops the head and is a walk, not a run. `B_loop` hold is not built (Editor).
- Per-shot status: 17 done, 9 weak (`S01-B02-SH03`, `S01-B02-SH04`, `S02-B02-SH03`, `S02-B03-SH02`, `S02-B03-SH03`, `S02-B03-SH04`, `S02-B03-SH05`, `S03-B01-SH02`, `S03-B01-SH05`), 0 blocked. Contact sheets: out/kuchisake/sheets/ and ~/ReelsStore/projects/KSO/previews/kso-w5-shots/.
- Checks: `node --import tsx --test tests/kuchisake-shots.test.ts` 8/8; `tests/painted.test.ts` 5/5; eslint clean on the new and changed files; `tsc --noEmit` one pre-existing error (`tests/loudness.test.ts`, already recorded in Round 5).

### Round 6 addendum: two user decisions on S01-B02-SH04 and S02-B02-SH03 (1 Nov 2026, Boss)

- Status: workaround (episode code only: `src/painted/kuchisake/shot-art.tsx`, `src/painted/shots/kuchisake.tsx`; `tests/kuchisake-shots.test.ts` +3 tests). Kit, LF01–LF05, `src/Root.tsx`, registry, plate IDs, `KSO_SHOT_INDEX` rows and frame timings unchanged. No brief or script edit. Closes Round 6 open items 1 (smile reading) and 2 (waist-up legs) on the user's decision; the rest of the list stands.
- **Decision 1, `S01-B02-SH04` (user: "ยิ้มรู้ทันครึ่งเดียว", a knowing half smile that still reads as relief for `CL01`).** `COW_KNOW` (`shot-art.tsx`) takes `COW_RELIEF`'s brows and lids (squint 0.42), the eyes at 0.85 of `COW_SLY`'s look, and the kit's flat mouth. `knowingMouth()` paints the smile over the flat line, because the kit smile is symmetric and the kit is frozen: the left corner stays where relief puts it, the right corner sits 0.12 head units higher (11.7 px at 97.8 px per head unit, f0; 15.8 px at the 1.35 push, f137). `drawCoworkerKnowing` is wired into `S01-B02-SH04` only; `S03-B01-SH04` (the `CL01` payoff) still draws `COW_RELIEF`.
- **Decision 2, `S02-B02-SH03` (user: zoom onto the smiling ghost's face, camera pushing in, no longer full body, face lit).** The plate moves from the 560 px/m waist-up (head 238 px; a camera zoom to the same face size would upscale the painted canvas about 2.2x) to the reveal's CU lens: `CU_GROUND`/`CU_UNIT` (1229 px/m, head 522 px, head centre y 579 in the plate). Camera: push 1.00 → 1.06 about the face over the same 2.9 s, plus a fixed −40 px offset so the mask's lower edge (v 1.27) stays above the band. Backdrop: `paintCuBack`, as the narrator close-ups either side (the street leaves this shot). Overlay: `CuOv` with the lower falloff from y 850 to 960 at 0.95, shot-only (the look keeps 840 to 1060 at 0.85; the first pass with the look's own falloff gave p95 0.397 at f0, and the first pass without the offset put the mask edge at about y 890 in the band).

Measured (full-size stills through one Chrome, `--gl=angle`; `scripts/caption-zone.py --band 860:1248`):

| Frame | Before mean / p95 | After mean / p95 | Result |
| --- | --- | --- | --- |
| `S01-B02-SH04` f0 | 0.123 / 0.298 | unchanged | pass |
| `S01-B02-SH04` f60 | 0.142 / 0.363 | unchanged | pass |
| `S01-B02-SH04` f120 | 0.160 / 0.462 | unchanged | fail (lit table wood, W5 draft; not part of this decision) |
| `S01-B02-SH04` f137 | 0.161 / 0.462 | unchanged | fail (same) |
| `S02-B02-SH03` f0 | 0.145 / 0.500 | 0.076 / 0.165 | pass |
| `S02-B02-SH03` f43 | 0.152 / 0.527 | 0.074 / 0.158 | pass |
| `S02-B02-SH03` f86 | 0.159 / 0.557 | 0.072 / 0.150 | pass |

- Face lit (`S02-B02-SH03`, luma means over fixed boxes): eyes (x 380–700, y 500–580) 0.69; mask (x 380–700, y 640–780) 0.89 at f0 and 0.88 at f86. Mask lower edge on the centre column (luma below 150): y ≈ 833 at f0, ≈ 852 at f86, above the band.
- Head size on screen (analytic, H 0.425 m × 1229 px/m × scale): 522 px at f0 to 554 px at f86. Visible artwork from the head top (about y 297) to the frame bottom is about 1620 px, above the 480 px floor; not pixel-measured. A CU is an extreme-close case under the brief's lead note.
- Cuts (analytic head centre and size): `S02-B02-SH02` last frame (f45) centre y 579, 543 px → `S02-B02-SH03` f0 centre y 539, 522 px (centre −40 px, size −3.9%). `S02-B02-SH03` f86 centre y 539, 554 px → `S02-B02-SH05` f0 centre y 579, 522 px (centre +40 px, size +6.0%). Boundary stills (f45, f0, f86, f0) were checked as stills only; the composed timeline is Editor's.
- Repeat: `S02-B02-SH03` f0 and f86 byte-identical on a second render; `S01-B02-SH04` f137 differs in 7 bytes of 6.2 M, each by 1/255 (the Round 6 LSB class).
- Checks: `node --import tsx --test tests/kuchisake-shots.test.ts` 11/11 (8 existing; 3 new: the knowing mouth is half-sided and covers the kit flat line; the `S02-B02-SH03` mask edge stays above y 860 through the push; the cut head-size match into and out of the neighbours); `tests/painted.test.ts` 5/5; eslint clean on the three changed files; `tsc --noEmit` one pre-existing error (`tests/loudness.test.ts`).
- Sheets (out/, not committed): `out/kuchisake/r7/sheet-before.png`, `out/kuchisake/r7/sheet-after.png`, `out/kuchisake/r7/sheet-cut-sh02-sh03-sh05.png`, `out/kuchisake/r7/crops/sheet-coworker-face.png`, `out/kuchisake/r7/crops/sheet-sh03-face.png`.
- Planning impact: Film to revise the brief rows for `S02-B02-SH03` (a CU now, not waist-up at 560 px/m; the street backdrop leaves the shot) and `S01-B02-SH04` (CL01 says relief, not teasing; the user reads the knowing smile as still relief, so Film confirms the CL01 reading against the new mouth). Editor: the `S03-B01-SH04` payoff still uses the symmetric relief smile; decide whether it should match. Per-shot status: `S02-B02-SH03` now passes the band; `S01-B02-SH04` keeps its band fail at f120–137.
- Not verified here: Studio cold load and seek, full-range sequence playback, one-second contact sheets across the composed timeline, and the Thai caption overlay at the cuts (stills and tests only).

## Round 7: Draft-tab fixes on 12 shots (1 Nov 2026, Boss)

- Status: workaround, episode code only. New: `shot-motion.ts` (lip-sync `talkOpen`, `paintMassHand`, `drawFigureNeckTilt`), `coworker-tell.ts`, `ghost-hand.ts`, `walker-back.ts`, `runner.ts`. Edited: `shot-art.tsx` (`paintCloseup(p, slide)`, `paintBandHand`, `knowingMouth(k)`, `smileAt`), `shot-woman.ts` (`clean`, `arms`, `drawWomanNeckTilt`), `narrator-back.ts` (head split into `paintBackHead`; LF04 f81 PSNR 109 dB vs the earlier still), `shots/kuchisake.tsx`, `tests/kuchisake-shots.test.ts`. Kit, LF01-LF05 look files, plate IDs, `KSO_SHOT_INDEX` and timings unchanged.
- Lip-sync: `talkOpen(globalFrame, max)` reads `KSO-EP01-SHORT.amplitude.json` (per frame, 5-frame smooth, floor 0.05) at shot start + local frame; `KSO_AMP.amp` can be replaced, an empty array gives a default envelope. Used by the coworker (S01-B02-SH01/02/03) and the narrator (S02-B03-SH06, max 0.4).
- Pose basis: coworker P06 (shrug_palms_up) lifting on speech, ghost right arm P12 retargeted to the mask edge, free left arm P06. Run: no pose in P01-P30 (CP-P12 deviation, kit FK arms plus hop).
- Back view: `walker-back.ts` (new episode art, kit front gait, `paintBackHead` from `narrator-back.ts`); head turns to kit profile at turn > 0.5.
- Caption band (defaults, 6 frames per shot): pass for S01-B01-SH01, S01-B02-SH01/02, S02-B01-SH01/02, S02-B03-SH05/06, S03-B01-SH01/02/05 (S02-B01-SH01, S02-B03-SH05 and S03-B01-SH05 now pass). Fail, unchanged from Round 6: S01-B02-SH03 (all frames, p95 0.459), S01-B02-SH04 f82+ (0.462), S02-B03-SH02 f14-35 (mask edge, 0.543), S02-B03-SH03 f0 (0.589).
- Evidence: `out/kuchisake/r8/` (stills, sheet-A/B/C, `s/` 84 frames), `out/logs/r8-cz.json`. Checks: shots + painted tests 18/18, eslint clean, tsc only the loudness error.

## Round 8: Draft-tab fix round 3 on 11 shots (1 Nov 2026, Boss)

- Status: workaround, episode code only. Edited: `shot-art.tsx` (`paintCloseup(p, slide, push)`, `paintBandHand` removed, symmetric `SMILE`/creases), `coworker-tell.ts` (depth arms, `still`), `ghost-hand.ts` (authored reach, `release`, `hangLeftArm`; `freeLeftArm` removed), `shot-woman.ts` (`clean` also drops the jag ticks and corner shadows, tapers the under-lip shadow, and skips a fully dropped mask), `shot-motion.ts` (long-hair hem in `drawFigureNeckTilt`), `runner.ts` (runner arms), `shots/kuchisake.tsx` (`StreetOv` `hole`/`glow`, `walkerHole`, SH02 camera `dy -60`), `tests/kuchisake-shots.test.ts` (smile tests). Kit, LF01-LF05, plate IDs, `KSO_SHOT_INDEX` and timings unchanged.
- S01-B01-SH01: the user reads the LF01 skin card (upper right) as a finger on the strap. That card now rides the band down (painted over it, 14 px press); no second hand. f0 equals LF01, so the S03-B02-SH02 loop seam is unchanged.
- S01-B02-SH01/02: P06 hand placement with CP-P02 elbows (`via`, `behind: 'upper'`): the elbow at 0.66 m sits under the table's back edge (it covers her below 0.69 m from this lens), so only a short forearm rises toward the camera. CP-P10 would keep P06 spread; the user's note overrides it. SH03: hands rest at the table edge (`still`), mouth still lip-syncs.
- S01-B02-SH04: the smile is symmetric and closed to a thin crescent (0.17 head units tall); the creases are mirrored.
- S02-B01-SH01/02 lighting, finding: `StreetGlow` is a screen overlay, so the lamp cone and pool washed over the narrator although she stays in front of the lamp (z 2.8 -> 0.8, pool at z 0, feet below the pool). She read as lit and see-through. Fix: an SVG mask cuts her back-view silhouette (soft 6 px edge) out of the cone, so the light falls behind her and her edge keeps a thin rim. The same overlay put a cone over the S03-B01-SH02 running insert, which has no lamp; the cone is now off there (f0-27).
- S02-B03-SH02, cause of the jerk: the IK elbow solution flipped as the mask edge moved down, rotating the hand by about 90 deg in 6 frames. Now the wrist, elbow (`via`) and hand angle are smooth functions of the mask state: the fingers hook up and in, the forearm hangs 0.17 m (foreshortened) below the wrist, P12 base. The left arm hangs (P01).
- S02-B03-SH03: yank for 3 frames, then the arm eases to the P01 hang over f3-15, the hand turning to follow the forearm (thumb side fixed, no flip).
- Stray strokes at the mouth sides: in `clean` mode, the jag ticks along the lips, the two corner glazes and the under-lip shadow that poked past the corners onto the hair are gone. This applies to S02-B03-SH03, SH05 and S03-B01-SH01. S02-B03-SH04 is the narrator's eyes and has no grin; its draft clip opens with 1 s of SH03, which is where the user saw the strokes.
- S02-B03-SH05, finding: the long hair's back mass (to v 1.72, pivot v 1.92) rotated with the head, so its lower edge slanted across the coat. That read as a body tilt. A hair-coloured hem keeps the ends level, matching the rotated hair at v 1.3. Shoulders and coat are unchanged.
- S03-B01-SH01: the put-back beat is dropped (user's option). The figure stands with the grin bare, arms P01, no tilt, and no mask. The moving specks came from the street-scale two-mass hand (nails about 2 px); with the hand gone, none remain in the 6 sampled frames.
- S03-B01-SH02: runner arms. The upper arm swings +-0.8 rad about 0.29 rad behind vertical, so the elbow is low in front and drives 1.1 rad back. The elbow holds about 70-100 deg. No pose in P01-P30 covers this (CP-P12 deviation). Legs unchanged.
- Caption band, worst p95 per shot (6-14 frames per shot): pass for S01-B01-SH01 (0.198), S01-B02-SH01/02 (0.387), S02-B01-SH01 (0.24), S02-B01-SH02 (0.203), S02-B03-SH05 (0.362), S03-B01-SH01 (0.19) and S03-B01-SH02 (0.251). Still failing, all known: S01-B02-SH03 (all frames, 0.482; the narrator's back and the table, not the hands), S01-B02-SH04 f137 (0.462; the push brings the table into the band), S02-B03-SH02 f20-35 (0.552; the white mask must cross the band as it is pulled down; `dy -60` did not clear it), S02-B03-SH03 f0 (0.579; the mask at the band on the first frame).
- Evidence: `out/kuchisake/r9/` (`pre_*` before, `sheet_*` / `sheet2_*` after, `s/`, `s2/`, `z*.png` crops), `out/logs/r9-cz.json`, `r9-test.log` (18/18), `r9-eslint.log` (clean); tsc shows only the known loudness error.
