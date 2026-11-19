# EDU-EP30-SHORT — plate tickets (index)

Revision **`EDU-EP30-TICKETS-R5`** · Film, 2026-11-20 (R4 → R5: decisions on the merged Boss round T04 r4, T05, T06 r4, T10 r4, T14, T36 at `544cd10`; T04, T05, T10 done; fix passes T36 r2 and T14 r4; T06 neck rows N1–N4 wait on user question Q-R5-1 (fix-pass cap); TF22, TF23; see the change log) · procedure: [plate-tickets skill](../../../../.agents/skills/plate-tickets/SKILL.md) (trial, 19 Nov 2026)
Inputs: scene sheets [EDU-EP30-SCENE-R2](../short/scene-sheets/index.md) (ready-for-dev; 28 shots, 1977 f; b01–b07), brief [EDU-EP30-BRIEF-R3](../short/film-brief.md#r3-changes) (VD30-01 … VD30-13, W3.2 look lock), look-lock assets in `src/painted/edu30/` and `src/painted/kit/` at `63fa4f6`; Boss results merged on branch `claude/ep30-continuation-493a12` at `6904070` (T01–T04, T06, T09–T11, T13, T34, T35; r3 commits `82f4de8` T04, `9879bc9` T06, `aa56df2` T09, `f025e38` T10, `1bc0904` T11, `f1a8b01` T34, `177bc0d` T35). Evidence for built tickets: each ticket's Result (tests, measured numbers, proof sheets); Film viewed for R4 the T04 r3 sheet, the T06 r3 sheet and crops, the T09 fence-rev and P2 stills, the T10 queue still, three T11 views and the T35 hop stills (store paths in each ticket's r4 decisions). **R5 inputs:** branch `claude/ep30-continuation-493a12` at `544cd10` (T04 r4 `acf6085`, T05 `9446ac4`, T06 r4 `1875efd`, T10 r4 `a6907b7`, T14 `150e469`, T36 `419376c`); Film viewed for R5 the T04r4, T05, T06r4 (sheet, crops, neck and flap-back before/after, full-size startle neck crop), T14 (stop 44/53, chase 0/10, side 11, vantage 46) and T36 (sheet, crops, back and front 540 crops) stills (store `projects/edu/EDU/previews/`; paths in each ticket's r5 decisions). No T15 proof exists yet (T15 not built).

## Tickets

| Ticket | Class | Hard | Blocked by | Status | Fix passes | Result commit |
| --- | --- | --- | --- | --- | --- | --- |
| [T01](T01-newsreel-kit-layer.md) newsreel layer in the kit (pop, tintMix) | capability | no | — | done (r2: LF01a baseline `LF01a.baseline-63fa4f6.png` filed; new vs baseline mean 0.0004) | 1 | `817b899` (r1), `2143dff` (r2) |
| [T02](T02-newsreel-titles.md) six newsreel title cards | capability | no | — | done (r2: place tag 48 px, box 967.1 px, 4/4 tests) | 1 | `9a1dae6` (r1), `733c658` + `97c2e64` (r2) |
| [T03](T03-plate-adapter.md) adapter, 28 stubs, QA entry, probe, proof entries, calibration | capability | no | T01, T02 | done (r2 built: Grade removed, CAL emu heading π; r3 Film: CAL emu range 290 ± 10 px to the toe line, no Boss pass) | 1 | `9e40bbf` (r1), `6082ee6` (r2) |
| [T34](T34-canvas-style-hook.md) `canvasStyle` hook: registered plate gets newsreel filter, weave, shake, 1.05 overscan | capability | no | T03 (done) | done (r2 Film: shake and lead-probe rows proven on T24 and T27, rows added there) | 0 | `f1a8b01` |
| [T35](T35-airborne-shadow.md) airborne emu shadow stays on the ground (`BeastPlace.air`, `EmuMember.air`) | capability | no | T06 (done) | done (r2 Film: shadow centre = an `air` 0 bird at the same ground point ± 4 px; contact shadow fades by opacity) | 0 | `177bc0d` |
| [T36](T36-kit-flat-fist-thumb.md) unshaped kit fist with thumb on a held point (`Arm.flatFist`), T11 proofs re-rendered with the thumb check | capability | yes | T11 (done) | r2 built, awaiting Film look check (R5 look check: rounder fist 0.080 hu along, `paintGunnerFists` so the fist wraps the grip when the gun paints after the man; thumb sides as measured and the 27 × 19 px front fist accepted; r1 built, tests 4/4) | 1 (r2 built) | r2 commit: see ticket Result |
| [T04](T04-gunfire-flash-smoke-shake.md) kit gunfire: flash, halation, pop, smoke, blast, shake | capability | no | T03 | done (r5 Film look check: pass; r4 built: per-circle α_c, smoke cover 0.245, blast 0.274) | 2 (r3, r4) | `82f4de8` (r3), `acf6085` (r4) |
| [T05](T05-gunfire-casings-strikes.md) kit gunfire debris: casings, spurts, spouts, splash | capability | no | T04 (r4), T10 (r3, done) | done (r5 Film: casings still falling at the B03-SH01 cut accepted, rows L 71 / L 98; jam-casing angles 0, 5.80, 6.78, 9.42 rad, heading 0; B03-SH02 continues the casings, T25 r5) | 0 | `9446ac4` |
| [T06](T06-emu-wings-reactions.md) emu wing rig, mixer, gait contact, startle/duck-flap/hop | figure | yes | T03 | r4 accepted except the neck (r5 Film look check: flap-back, tuft 80.7 px and reactions pass; the neck join step 20 and the neck-mid notch need rows N1–N4: widen the bib blend to u 0.15–0.50, subdivision 6 only as fallback, outline check). **Fix-pass cap reached (r3, r4): the user decides where N1–N4 run (Q-R5-1)** | 2 (r3, r4) | `9879bc9` (r3), `1875efd` (r4) |
| [T07](T07-emu-head-face.md) emu head: lens turn, blink, nod, beak-talk, sac, relief emu | figure | yes | T06 (r4 built; neck rows per Q-R5-1) | ready (r5 notes: with Q-R5-1 (a) it builds T06 rows N1–N4 first, own commit) — **dispatchable once Q-R5-1 is answered (a) or (c)** | 0 | — |
| [T08](T08-flock-paddock.md) flock in the paddock: buffet, extras, heads field, scatter, burst, halves, fence birds, slow line | movement | yes | T35, T07 | ready (Q8 answered) | 0 | — |
| [T09](T09-paddock-states.md) paddock states, ruts, high view, fence from the track | set | no | T03 | done (r4 Film: Q-E wire contrast measured between posts at x 420 = 140; r3 built: P2-bare 2.81, LF01 0.000, `paintPaddockScene`) | 1 (r3) | `a9bf187` (r1), `aa56df2` (r3) |
| [T10](T10-dam-shore-path.md) dam: east approach, queue path, reflect, stone, near slope + clearance | set | no | T03 | done (r5 Film: linear ease confirmed; r4 built: 0.6 m ease, tests 9/9) | 2 (r3, r4) | `5c39438` (r1), `f025e38` (r3), `a6907b7` (r4) |
| [T11](T11-seated-gunner.md) seated gunner four views + recoil jolt | figure | yes | T13 (done), T03 | done (r4 Film: built rows accepted, 3/4 lead to the hat crown 572.1, j 1 reach bound 0.546 m; thumb rows move to T36; TF21) | 0 | `1bc0904` |
| [T12](T12-crew-farmer-poses.md) crew and farmer poses (salute, P30, P44-back, loader, farmer) | figure | yes | T36, T11, T13 | ready (r4 notes: `flatFist` on unlocked fists) | 0 | — |
| [T13](T13-lewis-gun-mechanics.md) Lewis gun anchors, recoil, pan, jam, cocking rack | prop | yes | T03 | done (r3 Film: A1–A5 answered, the locked gun wins; consumers call `paintLewisPanTicks`; no Boss pass) | 0 | `e7a496e` (r1) |
| [T14](T14-truck-rig.md) truck rig and every drive schedule | movement | yes | T13, T11 | r4 ready — **dispatchable** fix pass (R5: rows moved to cab height 440 ± 25 and GUNNER-1 ≥ 430, no rebuild; build the B02-SH03 dust carry 0.9 with × 0.95 decay and 40 f life, and the right-hand-drive cab seats z +0.45; other silent choices confirmed) | 1 (r4) | `150e469` (r1) |
| [T15](T15-emu-mime-gestures.md) emu mime: wing flick, watch check, foot tap, wave front + back | movement | yes | T07 | ready (Q7 answered) | 0 | — |
| [T16](T16-queue-motion.md) queue at the dam: walk, unison step, flinch/hop, stare, turn-away | movement | yes | T10 (r4), T08, T35 | ready (Q7 answered; r3 notes: wading, hop `air`; r4 notes: waterline ease) | 0 | — |
| [T17](T17-cocking-pull-gunner-face.md) cocking pull + angry talking face (`man-crop` three-quarter) | figure | yes | T12, T13 | ready (Q7 answered; r4 notes: TF21, fists) | 0 | — |
| [T18](T18-order-chop.md) MEREDITH order-chop + shouted mouth | figure | yes | T17 | ready (Q8 answered) | 0 | — |
| [T19](T19-plates-b01.md) plates B01-SH01, SH02, SH03 | set | yes | T03, T07, T08, T09, T11, T14 | ready | 0 | — |
| [T20](T20-plates-b02-crane-farmer.md) plates B02-SH01, SH02 | set | yes | T03, T08, T09, T12 | ready | 0 | — |
| [T21](T21-plates-b02-army.md) plates B02-SH03, SH04 | set | yes | T03, T09, T12, T13, T14 | ready | 0 | — |
| [T22](T22-plate-b02-sh06-heads.md) plate B02-SH06 | set | yes | T03, T07, T08, T09, T11, T12, T13 | ready | 0 | — |
| [T23](T23-plate-b03-sh05-order.md) plate B03-SH05 | set | yes | T03, T09, T11, T12, T13, T18 | ready (Q8 answered) | 0 | — |
| [T24](T24-plate-b03-sh01-burst.md) plate B03-SH01 (burst) | set | yes | T03, T04 (r4), T05, T06 (r4), T08, T09, T11, T13, T34, T36 | ready (Q8 answered; r3 notes: muzzle (432, 1020); r4 notes: smoke cover, T34 carry-over rows, fists) | 0 | — |
| [T25](T25-plates-b03-scatter-signal.md) plates B03-SH02, SH03 (L07 mime) | set | yes | T03, T04, T05, T07, T08, T09, T11, T12, T15 | ready (r5 notes: B03-SH02 casings continue from B03-SH01 L 72) | 0 | — |
| [T26](T26-plates-b04-ambush-queue.md) plates B04-SH01, SH02 | set | yes | T03, T10, T11, T12, T16 | ready | 0 | — |
| [T27](T27-plates-b04-burst-jam.md) plates B04-SH03, SH04 | set | yes | T03, T04 (r4), T05, T06 (r4), T10 (r4), T11, T13, T16, T34, T35, T36 | ready (r3 notes: muzzle (637, 827), no mirror, B04-SH04 eye x −5.68; r4 notes: smoke cover, T34 carry-over rows, right mitten with thumb; r5 notes: jam-casing angles, fists over the gun) | 0 | — |
| [T28](T28-plates-b04-gunner-watch.md) plates B04-SH06, SH05 (PB01) | set | yes | T03, T05, T07, T10, T11, T13, T15, T16, T17 | ready (Q7 answered; r4 notes: TF21) | 0 | — |
| [T29](T29-plates-b05-chase.md) plates B05-SH01, SH02 | set | yes | T03, T04 (r4), T06 (r4), T08, T09, T11, T14, T36 | ready (r4 notes) | 0 | — |
| [T30](T30-plates-b05-withdrawal-wave.md) retreat vantage + plates B05-SH03, SH04 | set | yes | T03, T07, T08, T09, T14, T15 | ready (r4 notes: wire contrast between birds) | 0 | — |
| [T31](T31-plates-b06-tanks-bow.md) plates B06-SH01, SH02 (L15 mime) | set | yes | T03, T06, T07, T08, T09, T12 | ready | 0 | — |
| [T32](T32-plates-b06-timelapse-withdrawal.md) plates B06-SH03, SH04 | set | yes | T30, T01, T03, T08, T09, T14, T15 | ready | 0 | — |
| [T33](T33-plates-b07-arms.md) plates B07-SH01, SH02 | set | yes | T01, T03, T07 | ready | 0 | — |

36 tickets: 21 asset/capability (T01–T18, T34–T36), 15 plate tickets covering all 28 shots once. `needs-input`: none. Same-file chains: `emu.ts`/`looks.ts`/`tests/edu30-emu.test.ts` T06 → T07 → T15; `flock.ts`/`proof-flock.tsx` T35 → T08 → T16; `cast.ts`/`proof-cast.tsx` T11 → T36 → T12 → T17 → T18 (T36 also `kit/cast.ts`, `kit/back.ts`); `props.ts`/`proof-props.tsx` T13 → T14; `kit/gunfire.ts`/`proof-fx.tsx` T04 → T05; `dam.ts` T10 alone; every plate writes only its own `shots/<ID>.tsx` (T30 also `vantage.ts`, read by T32).

**Done (11):** T01, T02, T03, T04, T05, T09, T10, T11, T13, T34, T35. **Built, fix pass to run (1):** T14 r4. **Built, awaiting Film look check:** T36 r2. **T06:** r4 accepted except the neck rows N1–N4, which wait on Q-R5-1.

**Dispatchable now (R5), in parallel, no shared file:**
1. **T36 r2** — Files: `src/painted/kit/draw.ts`, `src/painted/edu30/cast.ts`, `src/painted/edu30/proof-cast.tsx`, `tests/kit-flat-fist.test.ts` (plus `kit/cast.ts` / `kit/back.ts` only to export the flat-fist fill).
2. **T14 r4** — Files: `src/painted/edu30/props.ts`, `src/painted/edu30/proof-props.tsx` (if a proof call changes), `tests/edu30-props.test.ts`. Reads `edu30/cast.ts` (`paintSeatedGunner`), writes none of T36's files.
3. **T07 r5** once Q-R5-1 is answered (a) (with the T06 neck rows first) or (c) (without them) — Files: `src/painted/edu30/emu.ts`, `src/painted/edu30/looks.ts`, `tests/edu30-emu.test.ts`, `src/painted/edu30/arms.ts` (only if `headYaw`/`lid` do not survive the flatten). With (b) a T06 r5 pass on Opus (Files `emu.ts`, `tests/edu30-emu.test.ts`) runs first and T07 follows it.

**Not yet dispatchable (blocker → files):** T08 after T07 (`flock.ts`, `proof-flock.tsx`, `tests/edu30-flock.test.ts`); T15 after T07 (`emu.ts`, `looks.ts`, `tests/edu30-emu.test.ts`; same files as T07); T12 after T36 r2 and Film's look check of it (`edu30/cast.ts`, `proof-cast.tsx`, `tests/edu30-cast.test.ts`); T16 after T08 (`flock.ts`, `proof-flock.tsx`, `tests/edu30-flock.test.ts`; T10 and T35 done); T17 after T12 (`edu30/cast.ts`, `proof-cast.tsx`, `tests/edu30-cast.test.ts`); T18 after T17. When T07 lands, T08 and T15 run in parallel (no shared file). No plate ticket is dispatchable yet: every plate waits on at least one of T07, T08, T12, T14, T15, T16, T36 (T33 needs only T07).

## User questions Q7 and Q8: answered (user, 19 Nov 2026)

Both answers keep the scene-sheet values: **Q7** PB01 length as written (gunner B04-SH06 [1062, 1086), emu B04-SH05 [1086, 1150)); **Q8** the B03 burst starts at the order as written (B03-SH05 [667, 688); 23 rounds at B03-SH01 local 2 … 68, about 2.2 s after the order). No ticket changes; the "(Q7 answered)" and "(Q8 answered)" marks in the table above replace the old open marks. The table below is kept only to show what a different answer would have touched.

| Question | Index item | As written | Tickets that change on a different answer |
| --- | --- | --- | --- |
| Q7 — PB01 on-screen length | [O8](../short/scene-sheets/index.md#dependencies-and-open-items) (SD14) | gunner B04-SH06 [1062, 1086), emu B04-SH05 [1086, 1150) | T03 (two shot-table rows), T15 (B04-SH05 local keys), T16 (turn-away local key), T17 (shot length: shake/talk keys), T28 (both plates) |
| Q8 — B03 burst from the order vs the narrator's "ยิง" | [O9](../short/scene-sheets/index.md#dependencies-and-open-items) (SD13) | B03-SH05 [667, 688); 23 rounds at B03-SH01 local 2 … 68 | T03 (two rows), T04 (B03 round list), T05 (casing count), T08 (scatter keys), T13 (pan total), T18 (hold length), T23, T24 |

## User question Q-R5-1 (open, R5): where the T06 neck rows run

T06 has used its two fix passes (r3, r4); the [fix-pass cap](../../../../.agents/skills/plate-tickets/SKILL.md#coordinator-dispatch) gives the next choice to the user. The coordinator asks with the structured-question tool and shows `projects/edu/EDU/previews/T06r4-neck-before-after.png` (and `T06r4-neck-startle-after.png`):
- **(a) Recommended: fold rows N1–N4 into T07 on Sonnet.** T07 edits the same file (`emu.ts`) next anyway; the rows are one constant (blend start 0.40 → 0.15) plus a measured fallback; own commit inside T07. Also confirms the widened blend (u 0.15–0.50) the user was offered, which repaints the KP-EMU hero's pale bib over more of the lower neck front.
- (b) A separate T06 r5 pass on Opus, then T07.
- (c) Accept the r4 neck as built (luma step 20, the neck-mid notch stays); T07 skips the rows.
The coordinator writes the answer into this section and the T07 row before dispatching T07.

## Boat question R5-B1 (open, low stakes)
T14 r4 seats the driver on the truck's right (right-hand drive) for a 1932 Australian Army truck, because Australia drives on the left. Boat confirms or corrects; a correction flips the cab seat z (+0.45 ↔ −0.45) in T14 only. Not blocking.

## Plate tickets and T34 (registered-plate canvas hook)

T34 lets a registered plate wear the newsreel picture filter, gate weave, gunfire shake and the 1.05 overscan (T03 Q-B). **Blocks T24 (B03-SH01) and T27 (B04-SH03), the two overscan and shake shots: they cannot be `done` without it.** Does not block T04–T23, T25, T26, T28–T33: their proof runs through the QA stack (`shots-index.tsx`), which already shows the full picture; their registered-plate look is covered by T34's registered-vs-QA numbers and, per plate, by the Editor's W5.3 composition check. T34 itself waits for T03 r2 (both write `edu30/shot.tsx`). Dependency order: T03 r2 → T34 → T24, T27.

## Common rules
<a id="common-rules"></a>

Every ticket links here. A ticket's own value wins over this section.

- **Dispatch and model.** One ticket per fresh Boss invocation on Sonnet, `medium` ([plate-tickets skill](../../../../.agents/skills/plate-tickets/SKILL.md#coordinator-dispatch)); brief = ticket path + revision + model line. Tickets with no shared `Files` and no edge run in parallel, each in its own worktree. Fix-pass cap: two per ticket, then the user decides (one option: rerun on Opus); record it in Fix passes.
- **What is authoritative.** The linked shot block's Staging, Camera, Projection and Acceptance; the ticket adds build decisions. A ticket row marked **Film fix** overrides the sheet value it names (listed below for the next sheet revision). A missing or conflicting value: set `Status: blocked`, write the question in Result and return; Film answers by revising the ticket.
- **Man height (r2).** The kit man (`man-parted` + slouch hat) measures about 1.82 m to the hat top (304 px at 6 m, f 1000; T03 CAL); the 1.70 m cast height is the head top (283 px). A pass range computed for a man from 1.70 m is read to the head top; a probe `top` that includes the hat is 1.074 × it. The cast is never scaled to match.
- **Lewis gun (r3).** Every ticket that paints a Lewis gun reads its points from `lewisAnchors` (T13), never from sheet literals: the locked gun is 1.32 m with the muzzle 0.66 m ahead of the tripod head (TF17). Right after the gun's `placeBuild`, call `paintLewisPanTicks(p, c, seed, at, heading, magTurn, {elev, recoil})`; without it the pan step per round is invisible.
- **Fists over held parts (R5).** A hand closes around what it holds: when a plate paints the gun after GUNNER-1 (the gun between the lens and the man), it calls T36 `paintGunnerFists` right after the gun, so the grip and stock show above and below the fist and never across it.
- **Thumb check wording (R5).** A thumb check line names the measured screen side of the thumb crease (up, down, left or right), checked against hand-drawing §2 (back of a RIGHT hand: thumb counter-clockwise of wrist → fingers; LEFT: clockwise). A ticket's screen-side words are Film's estimates; when the forearm lies near-horizontal on screen the thumb lies up or down, and the measured side wins if line, code and picture agree.
- **Truck (R5).** Plates paint the truck only through T14 `paintTruckRig` (side wheels, hollow tray, riders in one body); the locked `paintTruck` default stays for LF01a and is not called by a plate (`looks.ts` `truck: null` where the plate paints the rig).
- **Space-P plates (r3).** Plates in space P paint the set through T09 `paintPaddockScene` (birds in its `cast` callback) with their schedule values (`eaten`, `stubble`, `light`), not `looks.ts` `paintPaddock` directly.
- **Emu lead height (r3).** An emu's probe height in side or three-quarter view is read from the head top to the toe line (T03 r3).
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
| T06 | reaction stills (startle, duck-flap, hop): r3 store `projects/edu/EDU/previews/T06-sheet.png`, `T06-crops.png`, `T06-KP-*.png`; r4 proof archived: `T06r4-sheet.png`, `T06r4-crops.png`, `T06r4-neck-before-after.png`, `T06r4-flap-back-before-after.png` | r1: **fix** (2026-11-19, Film): the startle wing at 0.4 reads as a dark arm with a claw and the flap-back tufts read as arms held out with fingers. r3: **fix** (2026-11-19, Film): flap-back still reads as short arms with dark ragged ends from behind; hard step where the hero bib ends on the neck (also KP-stand); stand, fold, startle (wing 0.15 accepted), duck, profile flap and hop pass; r4 fix pass in the ticket; r4 sheet: **pass except the neck** (2026-11-20, Film): flap-back now hangs as loose fringes (pass), tuft 80.7 px in range, reactions pass; the bib/neck join (step 20) and the neck-mid notch in KP-startle and KP-duck still read as a collar and a joint: rows N1–N4 (T06 r5 decisions), placement by Q-R5-1; the user sees the after crop |
| T15 | mime stills and the watch strip (wing at high reach) | pending (no proof yet: T15 not built; waits on T07) |
| T36 | the flat thumbed fist on the four T11 views, 540 px hand crops: store `T36-*.png`; r2: `T36r2-*.png` | r1: **fix** (2026-11-20, Film): 3/4 and right read as closed fists (pass); the back-view fist (107 × 75 px, aspect 1.42) reads as a bun or paw; in the front view the grip is drawn across the fist. Thumb sides as measured (up/down) and the 27 × 19 px front fist accepted. r2 fix pass in the ticket; **r2: pending** (Film answers before T12 dispatches) |

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
| TF17 | T13 | sheet gun anchors for a 1.1 m gun (paddock muzzle (0, 0.72, −1.1), pan top (0, 0.97, 0.15); B03-SH01 muzzle (457, 951); B04-SH03 muzzle (541, 860); G2 muzzle 0.80 m from the pivot) → the locked build: muzzle (0, 0.586, −0.659), pan (0, 0.650, 0.184), (432, 1020), (637, 827), 0.66 m | LF01a/LF02 lock the gun; the sheets assumed a shorter, taller-panned gun |
| TF18 | T13, T10, T27 | B04-SH04 eye (−5.45, 1.0, −4.45) → (−5.68, 1.0, −4.45); pan (422, 226) → (415, 253), port (633, 624) → (638, 545) | G1 keeps its LF02 mark; the locked pan and port sit 0.23 m further −x |
| TF19 | T10, T05 | jam stone (−5.4, 0.33, −4.9) → (−5.63, 0.33, −4.9); casing port key → (−5.679, 0.857, −4.95) | moves with the real port so the casing still lands on it |
| TF20 | T04, T27 | B04-SH03 "the water mirrors every flash" → no mirror; halation, spouts and casings carry the water side | from this lens the ray to the mirrored muzzle meets the water plane on the dry south bank (waterline z ≈ −5.65, 0.65 m in front of G1); the user was told the mirror was removed and has not asked for it back (recorded R4) |
| TF21 | T11, T17, T28 | B04-SH06 Projection GUNNER-1 face (445, 682) → (407, 687) → about (530, 690) → (492, 695) (end point an estimate; T17/T28 log both) | T11's 3/4 view leans 0.225 rad toward the gun so both fists reach; the head moves about 74 px toward the gun |
| TF15 | T32 | fence birds added at L 66, 74, 82, 90 → per-jump counts 5, 6, 7, 8, 8, 9 | the time-lapse shows held states |
| TF22 | T14 | B02-SH03 stop: cab height 486 ± 25 px → 440 ± 25 (front low (541, 1223) unchanged) | the locked truck's bonnet is ahead of the cab, so the roof front edge is about 1 m further from the lens than the bumper |
| TF23 | T14 | B05-SH01 GUNNER-1 497 px (1.25 m seated) → about 444 px (the built T11 seated figure, 1.12 m) | T11 is done; moving the seat toward the lens takes the fists off G2 |

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
| Kit hand: `new: flat-fist-thumb` (unshaped fist with the thumb across, UT14) for every unlocked closed hand | T36 (T11 proofs, T12, T17, T24, T27, T29) |
| Cast: salute P21 (front; the back check left with B02-SH05), line-up, P30, P34, P44 back, farmer gesture and face, loader | T12 |
| O3: `new: cocking-pull`; `talk` + `angry` on `man-crop` three-quarter (B04-SH06) | T17 |
| O3: `new: order-chop` P07 → P05 + MEREDITH `talk` (B03-SH05) | T18 |
| Props: Lewis anchors, recoil, pan, traverse, jam action, cocking handle travel | T13 |
| Props: truck drive/stop/bump, G2 pedestal, `YCam.body` riders, dust, every truck schedule | T14 |
| Gunfire effects: flash, halation, pop, smoke, blast, shake (water mirror dropped in R3, TF20) (index; VD30-11) | T04 |
| Airborne shadow for the hops (T06 note) | T35 (T16, T27 use) |
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

- 2026-11-20, Film, `EDU-EP30-TICKETS-R5` (decisions on the merged Boss round at `544cd10`, nothing built): **T10** linear ease confirmed (smoothstep would exceed the 0.02 m sample bound), done. **T04** r4 look check pass, done. **T05** casings still falling at the B03-SH01 cut accepted (rows L 71: 13 at rest; L 98: all 23 in the box), B03-SH02 continues them (T25 r5), jam-casing angles 0 / 5.80 / 6.78 / 9.42 rad with heading 0 (T27 r5), Boss's plain defaults accepted, done. **T06** r4 look check: flap-back, tuft 80.7 px and reactions pass; neck rows N1–N4 (blend u 0.15–0.50, subdivision 6 as measured fallback, outline ≤ 3 px) placed by user question Q-R5-1 (cap reached); T07 r5 notes carry them. **T36** r2 fix pass: rounder flat fist (0.080 hu along), `paintGunnerFists` for the front view; measured thumb sides and the 27 × 19 px front fist accepted. **T14** r4 fix pass: rows moved (cab 440 ± 25, TF22; GUNNER-1 ≥ 430, TF23), B02-SH03 dust carry 0.9 with × 0.95 decay and 40 f life, right-hand-drive seats z +0.45 (Boat R5-B1), side wheels, hollow tray, bumps, B06-SH03 dir and dust shape confirmed. Common rules R5: fists over held parts, thumb-check wording, truck through the rig. Dispatchable: T36 r2, T14 r4; T07 after Q-R5-1.

- 2026-11-19, Film, `EDU-EP30-TICKETS-R4` (decisions on the merged Boss r3 round at `6904070`, nothing built): index rows and the task W5.2 count reconciled from each ticket's own Status/Result (the merge kept one side of both files). **T04 r4** fix pass: each of a smoke puff's five circles takes α_c = 1 − (1 − α)^(1/5) (option a; r3 smoke cover 0.900, variant 0.245); the rule holds for T24, T27, T29. **T06 r4** fix pass: tuft measured on the path (82.1 px); FLAP_OUT dir (−0.35, −0.70, 0.62) / bend (−0.40, −0.88, 0.25), plume tone 0.35 and width 0.030 m (flap-back read as arms); hero bib blends into the neck over u 0.40–0.50 (touches KP-EMU in the neck band; before/after to the user); startle wing 0.15 accepted. **T09** done: Q-E measured between posts at x 420 (contrast 140), no halo. **T10 r4** fix pass: `queuePoint` y eases over 0.6 m at each waterline crossing instead of moving the path point (the step is the locked bank height). **T11** done: thumb rows move to new **T36** (unshaped flat fist with the thumb from `fistParts`, option c; locked LF01a/LF02 calls keep the oval); 3/4 lead read to the hat crown; j 1 reach bound 0.546 m; right-view proof rig confirmed; TF21 (B04-SH06 face projection). **T34 r2** done: shake and lead-probe rows carried to T24 and T27. **T35 r2** done: shadow centre against an `air` 0 bird at the same ground point; contact shadow scales opacity. TF20: the user was told the B04-SH03 mirror was removed. Blocked-by updates: T05, T07, T12, T16, T24, T27, T29; r4 notes on T05, T07, T12, T16, T17, T24, T27, T28, T29, T30.

- 2026-11-19, Film, `EDU-EP30-TICKETS-R3` (decisions on the merged Boss results at `9a64214`, nothing built): index rows and the task W5.2 count reconciled from each ticket's own Status/Result (the merge kept one side of both files). **T03 r3** CAL emu 290 ± 10 px to the toe line, done, no pass. **T04 r3** fix pass: smoke and blast haze caps, lower per-puff alphas; clipped-sky tie accepted; no B04-SH03 flash mirror (TF20). **T06 r3** fix pass after Film's look check (fix): plume wing, drooping FLAP_OUT, startle wing 0.15, neck curve; FOLD reading and the one-sided mixer rule accepted; mixer rule written into T07 and T15. **T09 r3** fix pass: high view without ridge rows, P2 on `P30-P2-bare`, post (1020, 991) a typo → (753, 987), rut clause dropped, Q-D accepted, B05-SH04 wire 2.5 px `#3e3226`, `paintPaddockScene` in `paddock.ts`. **T10 r3** fix pass: Q-1 to Q-6 confirmed, wading y, stone and B04-SH04 eye moved with the gun. **T13 r3** A1–A5: the locked gun wins, G1 stays, lens and stone move (TF17–TF19), done, no pass. **T35 new** (airborne shadow; blocks T08, T16, T27). r3 notes in T05, T07, T08, T11, T12, T14–T17, T19, T21–T30. Stale "open Q7/Q8" status marks replaced (answered, values as written). Common rules: Lewis gun, space-P plates, emu lead height.

- 2026-11-19, Film, `EDU-EP30-TICKETS-R2` (fix pass on the three built tickets, nothing built): **T01 r2** re-baselines the proof on the current render, filed as `projects/edu/EDU/previews/EDU-EP30-W3-r1/LF01a.baseline-63fa4f6.png` (the approved store still untouched, drift 3.58 accepted; `strength 0` identity accepted, only the CAL reel and tests call it). **T02 r2** place tag 48 px, padding 56 px, box 967 ± 2 px. **T03 r2** CAL man 304 ± 10 px (hat), emu unchanged, CAL emu heading π and gun heading 0, `Grade` dropped (TF16), Shake30.rot degrees confirmed and Q-D confirmed. **T34 new** (`canvasStyle` hook), blocks T24 and T27. Q7 and Q8 answered by the user, values as written, no ticket change. Common rule "Man height" added.

- 2026-11-19, Film, `EDU-EP30-TICKETS-R1`: first ticket set from SCENE-R2 + BRIEF-R3 (33 tickets, all `ready`, none `needs-input`; Q7/Q8 carried as dependencies). The stale SCENE-R1 tickets deleted. TF01–TF15 recorded for the next sheet revision.
