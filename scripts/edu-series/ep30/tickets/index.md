# EDU-EP30-SHORT — plate tickets (index)

Revision **`EDU-EP30-TICKETS-R2`** · Film, 2026-11-19 (R1 → R2: fix pass on T01, T02, T03, new T34, Q7/Q8 answered; see the change log) · procedure: [plate-tickets skill](../../../../.agents/skills/plate-tickets/SKILL.md) (trial, 19 Nov 2026)
Inputs: scene sheets [EDU-EP30-SCENE-R2](../short/scene-sheets/index.md) (ready-for-dev; 28 shots, 1977 f; b01–b07), brief [EDU-EP30-BRIEF-R3](../short/film-brief.md#r3-changes) (VD30-01 … VD30-13, W3.2 look lock), look-lock assets in `src/painted/edu30/` and `src/painted/kit/` at `63fa4f6` (branch `claude/ep30-continuation-493a12`). Evidence: planning only; no ticket built, no runtime or picture evidence.

## Tickets

| Ticket | Class | Hard | Blocked by | Status | Fix passes | Result commit |
| --- | --- | --- | --- | --- | --- | --- |
| [T01](T01-newsreel-kit-layer.md) newsreel layer in the kit (pop, tintMix) | capability | no | — | r2 ready: file the LF01a baseline (one command), no code change | 0 | r1 in ticket Result |
| [T02](T02-newsreel-titles.md) six newsreel title cards | capability | no | — | r2 done: place tag 48 px, box 967 px (4/4 tests) | 0 | r2 in ticket Result |
| [T03](T03-plate-adapter.md) adapter, 28 stubs, QA entry, probe, proof entries, calibration | capability | no | T01, T02 | r2 ready: Grade removed, CAL ranges and emu heading π (Q-B moved to T34) | 0 | r1 in ticket Result |
| [T34](T34-canvas-style-hook.md) `canvasStyle` hook: registered plate gets newsreel filter, weave, shake, 1.05 overscan | capability | no | T03 (after its r2) | ready | 0 | — |
| [T04](T04-gunfire-flash-smoke-shake.md) kit gunfire: flash, halation, pop, smoke, blast, shake | capability | no | T03 | done (Film answers three open questions in Result) | 0 | on branch `worktree-agent-a58fca69d4e9c2d39` |
| [T05](T05-gunfire-casings-strikes.md) kit gunfire debris: casings, spurts, spouts, splash | capability | no | T04 | ready (Q8 answered) | 0 | — |
| [T06](T06-emu-wings-reactions.md) emu wing rig, mixer, gait contact, startle/duck-flap/hop | figure | yes | T03 | done (look check pending) | 0 | T06 commit on the Boss branch |
| [T07](T07-emu-head-face.md) emu head: lens turn, blink, nod, beak-talk, sac, relief emu | figure | yes | T06 | ready | 0 | — |
| [T08](T08-flock-paddock.md) flock in the paddock: buffet, extras, heads field, scatter, burst, halves, fence birds, slow line | movement | yes | T07 | ready (Q8 answered) | 0 | — |
| [T09](T09-paddock-states.md) paddock states, ruts, high view, fence from the track | set | no | T03 | ready | 0 | — |
| [T10](T10-dam-shore-path.md) dam: east approach, queue path, reflect, stone, near slope + clearance | set | no | T03 | done (see Result: 6 values to confirm) | 0 | this commit on the T10 worktree branch |
| [T11](T11-seated-gunner.md) seated gunner four views + recoil jolt | figure | yes | T13, T03 | ready | 0 | — |
| [T12](T12-crew-farmer-poses.md) crew and farmer poses (salute, P30, P44-back, loader, farmer) | figure | yes | T11, T13 | ready | 0 | — |
| [T13](T13-lewis-gun-mechanics.md) Lewis gun anchors, recoil, pan, jam, cocking rack | prop | yes | T03 | ready (Q8 answered) | 0 | — |
| [T14](T14-truck-rig.md) truck rig and every drive schedule | movement | yes | T13, T11 | ready | 0 | — |
| [T15](T15-emu-mime-gestures.md) emu mime: wing flick, watch check, foot tap, wave front + back | movement | yes | T07 | ready (Q7 answered) | 0 | — |
| [T16](T16-queue-motion.md) queue at the dam: walk, unison step, flinch/hop, stare, turn-away | movement | yes | T10, T08 | ready (Q7 answered) | 0 | — |
| [T17](T17-cocking-pull-gunner-face.md) cocking pull + angry talking face (`man-crop` three-quarter) | figure | yes | T12, T13 | ready (Q7 answered) | 0 | — |
| [T18](T18-order-chop.md) MEREDITH order-chop + shouted mouth | figure | yes | T17 | ready (Q8 answered) | 0 | — |
| [T19](T19-plates-b01.md) plates B01-SH01, SH02, SH03 | set | yes | T03, T07, T08, T09, T11, T14 | ready | 0 | — |
| [T20](T20-plates-b02-crane-farmer.md) plates B02-SH01, SH02 | set | yes | T03, T08, T09, T12 | ready | 0 | — |
| [T21](T21-plates-b02-army.md) plates B02-SH03, SH04 | set | yes | T03, T09, T12, T13, T14 | ready | 0 | — |
| [T22](T22-plate-b02-sh06-heads.md) plate B02-SH06 | set | yes | T03, T07, T08, T09, T11, T12, T13 | ready | 0 | — |
| [T23](T23-plate-b03-sh05-order.md) plate B03-SH05 | set | yes | T03, T09, T11, T12, T13, T18 | ready (Q8 answered) | 0 | — |
| [T24](T24-plate-b03-sh01-burst.md) plate B03-SH01 (burst) | set | yes | T03, T04, T05, T06, T08, T09, T11, T13, T34 | ready (Q8 answered) | 0 | — |
| [T25](T25-plates-b03-scatter-signal.md) plates B03-SH02, SH03 (L07 mime) | set | yes | T03, T04, T05, T07, T08, T09, T11, T12, T15 | ready | 0 | — |
| [T26](T26-plates-b04-ambush-queue.md) plates B04-SH01, SH02 | set | yes | T03, T10, T11, T12, T16 | ready | 0 | — |
| [T27](T27-plates-b04-burst-jam.md) plates B04-SH03, SH04 | set | yes | T03, T04, T05, T06, T10, T11, T13, T16, T34 | ready | 0 | — |
| [T28](T28-plates-b04-gunner-watch.md) plates B04-SH06, SH05 (PB01) | set | yes | T03, T05, T07, T10, T11, T13, T15, T16, T17 | ready (Q7 answered) | 0 | — |
| [T29](T29-plates-b05-chase.md) plates B05-SH01, SH02 | set | yes | T03, T04, T06, T08, T09, T11, T14 | ready | 0 | — |
| [T30](T30-plates-b05-withdrawal-wave.md) retreat vantage + plates B05-SH03, SH04 | set | yes | T03, T07, T08, T09, T14, T15 | ready | 0 | — |
| [T31](T31-plates-b06-tanks-bow.md) plates B06-SH01, SH02 (L15 mime) | set | yes | T03, T06, T07, T08, T09, T12 | ready | 0 | — |
| [T32](T32-plates-b06-timelapse-withdrawal.md) plates B06-SH03, SH04 | set | yes | T30, T01, T03, T08, T09, T14, T15 | ready | 0 | — |
| [T33](T33-plates-b07-arms.md) plates B07-SH01, SH02 | set | yes | T01, T03, T07 | ready | 0 | — |

34 tickets: 19 asset/capability (T01–T18, T34), 15 plate tickets covering all 28 shots once. `needs-input`: none (every value decided; the two open user questions are carried as dependencies below, with the scene-sheet values as written). Same-file chains: `emu.ts`/`looks.ts`/`tests/edu30-emu.test.ts` T06 → T07 → T15; `flock.ts`/`proof-flock.tsx` T08 → T16; `cast.ts`/`proof-cast.tsx` T11 → T12 → T17 → T18; `props.ts`/`proof-props.tsx` T13 → T14; `kit/gunfire.ts`/`proof-fx.tsx` T04 → T05; every plate writes only its own `shots/<ID>.tsx` (T30 also `vantage.ts`, read by T32). First wave (no blockers): T01, T02; then T03; then T04, T06, T09, T10, T13 in parallel.

## User questions Q7 and Q8: answered (user, 19 Nov 2026)

Both answers keep the scene-sheet values: **Q7** PB01 length as written (gunner B04-SH06 [1062, 1086), emu B04-SH05 [1086, 1150)); **Q8** the B03 burst starts at the order as written (B03-SH05 [667, 688); 23 rounds at B03-SH01 local 2 … 68, about 2.2 s after the order). No ticket changes; the "(Q7 answered)" and "(Q8 answered)" marks in the table above replace the old open marks. The table below is kept only to show what a different answer would have touched.

| Question | Index item | As written | Tickets that change on a different answer |
| --- | --- | --- | --- |
| Q7 — PB01 on-screen length | [O8](../short/scene-sheets/index.md#dependencies-and-open-items) (SD14) | gunner B04-SH06 [1062, 1086), emu B04-SH05 [1086, 1150) | T03 (two shot-table rows), T15 (B04-SH05 local keys), T16 (turn-away local key), T17 (shot length: shake/talk keys), T28 (both plates) |
| Q8 — B03 burst from the order vs the narrator's "ยิง" | [O9](../short/scene-sheets/index.md#dependencies-and-open-items) (SD13) | B03-SH05 [667, 688); 23 rounds at B03-SH01 local 2 … 68 | T03 (two rows), T04 (B03 round list), T05 (casing count), T08 (scatter keys), T13 (pan total), T18 (hold length), T23, T24 |

## Plate tickets and T34 (registered-plate canvas hook)

T34 lets a registered plate wear the newsreel picture filter, gate weave, gunfire shake and the 1.05 overscan (T03 Q-B). **Blocks T24 (B03-SH01) and T27 (B04-SH03), the two overscan and shake shots: they cannot be `done` without it.** Does not block T04–T23, T25, T26, T28–T33: their proof runs through the QA stack (`shots-index.tsx`), which already shows the full picture; their registered-plate look is covered by T34's registered-vs-QA numbers and, per plate, by the Editor's W5.3 composition check. T34 itself waits for T03 r2 (both write `edu30/shot.tsx`). Dependency order: T03 r2 → T34 → T24, T27.

## Common rules
<a id="common-rules"></a>

Every ticket links here. A ticket's own value wins over this section.

- **Dispatch and model.** One ticket per fresh Boss invocation on Sonnet, `medium` ([plate-tickets skill](../../../../.agents/skills/plate-tickets/SKILL.md#coordinator-dispatch)); brief = ticket path + revision + model line. Tickets with no shared `Files` and no edge run in parallel, each in its own worktree. Fix-pass cap: two per ticket, then the user decides (one option: rerun on Opus); record it in Fix passes.
- **What is authoritative.** The linked shot block's Staging, Camera, Projection and Acceptance; the ticket adds build decisions. A ticket row marked **Film fix** overrides the sheet value it names (listed below for the next sheet revision). A missing or conflicting value: set `Status: blocked`, write the question in Result and return; Film answers by revising the ticket.
- **Man height (r2).** The kit man (`man-parted` + slouch hat) measures about 1.82 m to the hat top (304 px at 6 m, f 1000; T03 CAL); the 1.70 m cast height is the head top (283 px). A pass range computed for a man from 1.70 m is read to the head top; a probe `top` that includes the hat is 1.074 × it. The cast is never scaled to match.
- **Locked looks.** LF01a, LF02 (R4), LF03 (R2) and KP-EMU (r1) are user-locked (W3.2). At default options every extended module reproduces them (mean absolute pixel difference ≤ 2 on the 0–255 scale against a pre-change render, unless the ticket names another bound). Known limits accepted with the lock are fixed only where a ticket says so.
- **Clocks.** Story events (head turns, nods, wing gestures, taps, bow, rounds, scatter, jam, rack, time-lapse) on the shot clock; walk/peck/run phases, wheat sway, water ripples and the windmill on the ambient clock ([DF-20261030-painted-story-hold-ambient-clock](../../../../docs/dev-findings.md#df-20261030-painted-story-hold-ambient-clock)). Every helper is a pure function of the frame: frame L computed alone equals frame L after 0…L.
- **Screen layers.** Shake and weave move the plate canvas only; titles, captions, the `@TamMaiLa` mark and the label never move ([DF-20261030-painted-screen-layers-overlay](../../../../docs/dev-findings.md#df-20261030-painted-screen-layers-overlay)). Plates draw no caption, mark or label (Editor).
- **Plain fills for effects and large areas** ([DF-20261031-paint-seed-defer](../../../../docs/dev-findings.md#df-20261031-paint-seed-defer), [DF-20261030-p5brush-large-fill-mottle](../../../../docs/dev-findings.md#df-20261030-p5brush-large-fill-mottle)); one p5 canvas per composition ([DF-20261116-brush-scale-cumulative](../../../../docs/dev-findings.md#df-20261116-brush-scale-cumulative)).
- **CAT02.** No bird is ever hit, wounded, lying down or falling; nobody fumbles; no name, rank text, quote card, count, date, clock or tally is painted.
- **Hard-ticket checks** ([hand-drawing §7–8](../../../../.claude/skills/hand-drawing/SKILL.md)). Every visible hand: the hand line, `thumb check: <hand>: <side> ok` and `arm check: <character> <side>: attached ok` in Result, arm ratio ≤ 1.05 × bone measured on every proof frame of a motion, stills every 2–4 frames through each arm or body motion. Every planted foot or pad: world slip ≤ 0.02 m across its stance frames. Emu identity: EMU-HERO's tuft and bib visible wherever the sheet lists it.
- **Rendering stills.** No video renders in these tickets. Stills through `node scripts/stills.mjs <entry> --gl=angle` on one Chrome (`shots-index.tsx` for plates, `proof-<topic>.tsx` for asset tickets, `render-looks.sh <ticket> <IDs>` for KP stills, which writes `out/edu30/looks/<ticket>/`); other stills to `out/edu30-T<nn>/`; logs to `out/logs/T<nn>-*.log`, print only the tail ([CB02](../../../../AGENTS.md#context-budget)). View through `scripts/qa-sheet.sh … --width 270` ([CB03](../../../../AGENTS.md#context-budget)); 540 px crops only for hands. Plates: clean frames (`--props='{"guides":false,"tag":false}'`) through `python3 -I scripts/caption-zone.py`, and `measure-shots.ts` for the lead numbers. Run `python3 -I scripts/store.py fetch` first in a fresh worktree.
- **Keep the proof.** Archive the proof folder with `python3 -I scripts/store.py archive --path out/edu30-T<nn> --project EDU --kind previews` and cite the store path in Result.
- **Checks and commit.** `npx tsc --noEmit -p .` and `npm test` (logs to files) before the commit; commit per [docs/contributing.md](../../../../docs/contributing.md); the planned tests and `kit/gunfire.ts` are already named in [docs/context-map.md](../../../../docs/context-map.md) (Pending line, EP30), so no ticket edits the map unless it adds a file not listed there. Record findings in `scripts/edu-series/ep30/build-notes.md` (create it on first use).
- **Trial measurement.** Before the first ticket and after the last, the coordinator runs `python3 -I scripts/usage-report.py --since 2026-11-19` and records Boss cost and fix passes per ticket (all, and `Hard: yes` alone) in build-notes ([measuring the trial](../../../../.agents/skills/plate-tickets/SKILL.md#measuring-the-trial)).

## Look checks (Film answers here)

| Ticket | Proof | Film's answer |
| --- | --- | --- |
| T06 | reaction stills (startle, duck-flap, hop): `out/edu30-T06/sheet.png`, store `projects/edu/EDU/previews/sheet.png` | pending (Film to answer before T08 and T16) |
| T15 | mime stills and the watch strip (wing at high reach) | pending |

## Film fixes to fold into the next scene-sheet revision

Each is decided in the named ticket; the sheets still carry the old wording until SCENE-R2.1 (or the Q7/Q8 revision).

| ID | Ticket | Sheet value → ticket value | Reason |
| --- | --- | --- | --- |
| TF01 | T03 | B03-SH02 "shake of round 23 decays across the cut" → no shake in B03-SH02 | the 3-frame decay ends at B03-SH01 local 70, before the cut at 72 |
| TF02 | T07 | B02-SH06 head turns over its right shoulder → left shoulder | the camera is on the bird's left |
| TF03 | T08 | B03-SH02 hero group heads +x/−z → toward (12, 0, −32) (+x/+z) | the B03-SH03 mark wins |
| TF04 | T08 | fence birds at z 5.45–5.8 → body front ≥ 0.08 m behind the wire, back row 0.5 m behind | bodies would cross the wire seen from the track (B05-SH04) |
| TF05 | T09 | B05-SH04 truck dust plume at the right horizon → not painted | the truck is behind the lens plane, about 85° off axis |
| TF06 | T10 | B04-SH06 "slope about y 0.95 under the lens" → 0.75 (`southBankY`, 1.2 m crest); clearance 0.70 m | locked dam geometry; eye unchanged |
| TF07 | T12 | B02-SH06 MEREDITH right mitten at the brow → left (kit P30) | the locked LF01a pose |
| TF08 | T12 | B02-SH06 GUNNER-2 at (0.75, 0, 0.45) → (0.50, 0, 0.35) while seating the pan | reach 0.63 m > 0.52 m |
| TF09 | T12 | B02-SH02 FARMER `P41` → P41 body + `new: point-back-over-shoulder` | P41's arm points at the viewer |
| TF10 | T14 | B05-SH02 G2 muzzle kick to y 2.6 → 2.41 (elevation 50°) | out of reach of a 0.8 m barrel arm |
| TF11 | T14 | B06-SH03 truck direction unstated → arrives dir −1, parked dir +1 from the time-lapse | B06-SH04 starts heading +x |
| TF12 | T15 | watch wrist (1.45, 1.45, −4.6) → (1.19, 1.52, −4.57); wave tip (0.35, 1.95, 5.3) → (0.14, 1.73, 5.40) | wing reach (0.85 m max) from the 1.0 m root |
| TF13 | T16 | B04-SH02 head "walks 0.3 m/s from 4.6, 4.0 by local 49" → stands to L 40, steps L 41–49, walks on | both cannot hold with a 0.6 m step |
| TF14 | T18 | B03-SH05 "the near (right) arm" → the right arm is the far arm (screen left) | the lens is at his left front |
| TF16 | T03 | brief Composition seam "Grade → Newsreel → Grain" → no `Grade` in the plate stack (the Editor may add one above the plates) | it sat under the opaque canvas and did nothing; the locked looks never had it; `NewsreelOverlay` carries the vignette |
| TF15 | T32 | fence birds added at L 66, 74, 82, 90 → per-jump counts 5, 6, 7, 8, 8, 9 | the time-lapse shows held states |

## Coverage (every Boss row of SCENE-R2 → ticket)

| Row (sheet) | Ticket |
| --- | --- |
| Newsreel layer hardening + exposure pop; B07 burn-out (index Baseline; b01, b07) | T01 (T33 uses) |
| Title overlay style, six cards (index; b02–b06) | T02 |
| Emu: startle, flap, hop + splash (b03 B03-SH01, b04 B04-SH03) | T06 (+ T05 splash) |
| Emu: neck-sac boom, blink, nod, look to lens, `new: emu-beak-talk` (b01, b02 B02-SH06, b05 B05-SH04, b07 relief) | T07 |
| O3: `new: emu-wing-flick` (B03-SH03) | T15 (T25) |
| O3: `new: emu-watch-check`, `new: emu-foot-tap` (B04-SH05) | T15 (T28) |
| O3: `new: emu-wing-wave` front (B05-SH04) and back (B06-SH04) | T15 (T30, T32) |
| O3: rising flock heads (B02-SH06) | T08 (T22) |
| O3: flock splitting by halves (B03-SH03); per-bird delayed scatter (B03-SH01); six-group burst (B03-SH02) | T08 (T25, T24) |
| Flock extras, buffet sync, slow-motion line, fence birds; 60-bird render time | T08 |
| O3: queue turning away (B04-SH05); queue spacing, unison step, flinch and re-form | T16 (T26–T28) |
| Paddock: eaten growth, stubble, light mix, time-lapse sun/shadow, ruts, camp, high view | T09 (T32 drives the jumps) |
| O3: fence from the track (B05-SH04) | T09 (T30) |
| Dam: east approach, shore path, wet rim, reflections, jam stone | T10 |
| B04-SH06 slope clearance (`southBankY`), near slope under the lens; all B04 lens clearances | T10 |
| Cast: `new: seated-gunner`, `new: recoil-jolt`, four views | T11 |
| Cast: salute P21 (front; the back check left with B02-SH05), line-up, P30, P34, P44 back, farmer gesture and face, loader | T12 |
| O3: `new: cocking-pull`; `talk` + `angry` on `man-crop` three-quarter (B04-SH06) | T17 |
| O3: `new: order-chop` P07 → P05 + MEREDITH `talk` (B03-SH05) | T18 |
| Props: Lewis anchors, recoil, pan, traverse, jam action, cocking handle travel | T13 |
| Props: truck drive/stop/bump, G2 pedestal, `YCam.body` riders, dust, every truck schedule | T14 |
| Gunfire effects: flash, halation, pop, smoke, blast, shake, water mirror (index; VD30-11) | T04 |
| Gunfire effects: casings, strike spurts, water spouts, splash, jam casing | T05 |
| Crew withdrawal marks (SD06), no crew in B04-SH03/SH05/SH06 frames | T10 (export), T27, T28 |
| Identical retreat vantage and truck path (B05-SH03, B06-SH03, B06-SH04) | T30 (`vantage.ts`), T32 |
| Bow on the story clock (B06-SH02) | T31 |
| Relief emu head turn + blink, wattle bed, full colour (B07) | T07, T33 |
| Calibration sheet (brief Scale baseline) | T03 |
| All 28 plates | T19–T33 (T19 B01 ×3, T20 B02-SH01/02, T21 B02-SH03/04, T22 B02-SH06, T23 B03-SH05, T24 B03-SH01, T25 B03-SH02/03, T26 B04-SH01/02, T27 B04-SH03/04, T28 B04-SH06/05, T29 B05-SH01/02, T30 B05-SH03/04, T31 B06-SH01/02, T32 B06-SH03/04, T33 B07 ×2) |

Not ticketed here (other owners): sounds and the cue sheet (Ton, index O4), Editor items O7, O10–O13, the GUNNER-2 beard (user, O2: built as `man-buzz` until asked), Lewis ejection side (Boat, O5: +1 until answered; a change flips `side` in T05/T13 only), the arms supporter sides (Boat, brief open question 2: LF03 as painted), kit intake of the `new:` looks (W8.4).

## Dropped from the SCENE-R1 ticket set

The SCENE-R1 tickets T01–T23 (written from `EDU-EP30-SCENE-R1`, stopped at T23 before B05-SH03, never dispatched) were deleted in this revision; their numbers are reused here with SCENE-R2 content, and T01–T14 keep their subjects. Dropped with the retired shots and lines: B02-SH05 plate (heads rising behind the crew, `new: loader-kneel-back`, its woodblock beats), B03-SH04 plate (`new: binoculars-at-eyes`, the feather on the pan, the empty paddock), the emu head cock (B04-SH05 stare, L11), the emu talking while running in the B03-SH03 run-past, the tracking followers of the old B03-SH03, the tiny wing flaps of B05-SH03 and B06-SH04 (SD16), and the 26-shot / 2012-frame shot table. Old plate tickets T15–T23 are replaced by T19–T28.

## Change log

- 2026-11-19, Film, `EDU-EP30-TICKETS-R2` (fix pass on the three built tickets, nothing built): **T01 r2** re-baselines the proof on the current render, filed as `projects/edu/EDU/previews/EDU-EP30-W3-r1/LF01a.baseline-63fa4f6.png` (the approved store still untouched, drift 3.58 accepted; `strength 0` identity accepted, only the CAL reel and tests call it). **T02 r2** place tag 48 px, padding 56 px, box 967 ± 2 px. **T03 r2** CAL man 304 ± 10 px (hat), emu unchanged, CAL emu heading π and gun heading 0, `Grade` dropped (TF16), Shake30.rot degrees confirmed and Q-D confirmed. **T34 new** (`canvasStyle` hook), blocks T24 and T27. Q7 and Q8 answered by the user, values as written, no ticket change. Common rule "Man height" added.

- 2026-11-19, Film, `EDU-EP30-TICKETS-R1`: first ticket set from SCENE-R2 + BRIEF-R3 (33 tickets, all `ready`, none `needs-input`; Q7/Q8 carried as dependencies). The stale SCENE-R1 tickets deleted. TF01–TF15 recorded for the next sheet revision.
