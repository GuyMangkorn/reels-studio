# Fog-swallow proposals — WFOG-EP01-SHORT (Film, 30 Oct 2026)

**Decision (30 Oct 2026): the user chose FP-A + FP-B (both); FP-C not taken.** Applied in [visual-brief.md](visual-brief.md) `VB-WFOG-EP01-SHORT-R6` (VD06 revised, VD19, VD20), which owns the decisions from here; with both shots, the road is lost in FP-B and FP-A starts with the road already gone. The text below is the original proposal.

Status at writing: **proposal for the user's choice**, not a brief revision. `VB-WFOG-EP01-SHORT-R5` VD06 (`FOG-STATE`) and the SS-R4 sheets are unchanged until the user picks an option; the chosen option then becomes brief R6 (VD06 reopened at Film level, recorded with the user's choice) and goes to Mark for retiming (after the Gemini TTS switch). Nothing here authorizes Boss/Editor work.

Trigger: user feedback after watching the Editor r2 cut (30 Oct 2026): it does not read that the fog covers the gas station. User ideas: look out through the shop glass and see everything, then the fog slowly swallows it until it is gone; or another angle that shows the fog eating the world. The clip may get longer.

Inputs: checkout `claude/world-fog-gemini-tts-c94c1a` @ `a5297d4`; brief R5 (VD06, VD08, VD09, VD10, VD14, VD17); [index.md](index.md) ST-05 `FOG-STATE`, shot table; `src/painted/worldfog/outside.ts` (`paintOutside`, source read); Editor r2 MP4 (`WFOG-EP01-SHORT_C_seamless.mp4`, render log `out/logs/editor-r2-render.log`; the file was read from the `shipwreck-short-82a71a` worktree's `out/`, same composition, 3000 frames); painted-2d skill; dev-findings index (no fog-swallow entry exists; related: `DF-20261030-painted-straight-bars`, `DF-20261030-painted-glass-sheen-veil`, `DF-20261030-retime-picture-parity`, `DF-20261030-painted-profile-head-turn`).

Pictures: contact sheet `out/film/wfog-fog-proposals/WFOG-fog-proposals_contact-sheet.png` (row NOW + FP-A/B/C early/mid/late); full-size stills `out/film/wfog-fog-proposals/FP-{A,B,C}_{early,mid,late}.png`; diagnosis frames `out/film/wfog-fog-proposals/diag/G*.png` (sheet `diag/diag-sheet.png`). The FP stills are a **rough p5.brush look-check** (scratch entry `out/film/wfog-fog-proposals/src/index.tsx`, gitignored, `--gl=angle`): placeholder set geometry, no rig, no captions. They show the fog *progression*, not final art.

## Diagnosis (FD01–FD05)

Measured on Editor r2 frames G20, G100, G130, G160, G186, G210, G239, G245, G270, G300, G330, G353.

| ID | Finding | Evidence |
| --- | --- | --- |
| FD01 | **No "before".** S01-SH02 opens already grey: sky ramp, banks and veil are present at FS0 (veil opacity 35 + banks at full strength), so the forecourt never reads clear and there is nothing to lose. | G130: lamps already halos, pumps pale smudges, no road or canopy structure |
| FD02 | **No depth order.** `paintOutside` fades every forecourt element with one global `clear` factor and lays one uniform veil rect; road, canopy, pumps and car all dim together, so the change reads as "the picture got greyer", not "something advanced and covered things". | `outside.ts` `clear = 1 − smoothstep(0.6, 1.9, fs)` applied to slab, lane, road, pumps, columns, kerb alike; veil `rectPts(-300, -400, 1400, 1150 + dy)` |
| FD03 | **Too small and too short a delta.** FS0→FS1 runs G186–G240 (1.8 s) and FS1→FS2 G246–G348 (3.4 s); in each shot the visible change is a few value steps. | G186 vs G239 nearly identical outside the car |
| FD04 | **The lead covers the change.** In S01-SH02 the narrator and the open door fill the centre during the fog ramp; in S02-SH01 she stands in front of the middle pane. The swallow happens behind the subject. | G186–G239; G245–G353 |
| FD05 | **The car is never seen vanishing.** In S02-SH01 the outside is a narrow grey band behind mullions and shelves; the car ghost is not identifiable at any frame, so `รถหายไปในหมอก` (shot title) and VO-03's `หมอกก็กลืนลานจอดจนหมด` have no picture. | G245–G353: no car shape readable through the panes |

Conclusion: the problem is staging and the fog model, not the painted look. Any option needs (a) a genuinely clear FS0 frame held long enough to register, (b) loss ordered by distance with a visible fog front, (c) the change unobstructed in the clue-safe band y 300–950, and (d) about 4–6 s of screen time for the swallow.

## Narration over the fog beat

| Line | Text (unchanged) | Current placement (Edge TTS r2, G) | Role in the fog beat |
| --- | --- | --- | --- |
| VO-02 | `ฉันเห็นมันตอนเลี้ยวเข้าปั๊ม ตอนนั้นแค่คิดว่าจะเติมน้ำมัน… แล้วกลับบ้าน` | speech 83 → 190, S01-SH01/SH02 | Sits over the **clear "before"** (S01-SH02). Its `…แล้วกลับบ้าน` is the natural last clear moment. |
| VO-03 | `แต่พอเข้าร้าน หมอกก็กลืนลานจอดจนหมด ข่าวในมือถือ… ก็มีแต่ภาพเดียวกัน` | speech 293 → 408, S02-SH01/SH02; sheet captions `แต่พอเข้าร้าน` [246, 282), `หมอกก็กลืนลานจอดจนหมด` [282, 348) | Its first clause **is** the swallow: it literally describes FP-A. The second clause (`ข่าวในมือถือ…`) belongs to the phone insert S02-SH02. |

All frames are Edge TTS estimates; Gemini TTS will change them. Mark retimes after the new audio is measured; the options below give durations in seconds, not frames.

## Options

### FP-A — Glass swallow (window POV, depth-ordered) — **recommended**

Viewer sees, beat by beat:
1. **FP-A-B1 (end of S01-SH02, under VO-02 `…แล้วกลับบ้าน`):** the forecourt is clear (FS0 fixed per FD01): road with dashes, four lamp cores, pumps, the parked car. She walks toward the shop; only thin ground haze. No swallow here; the fog is saved for the glass.
2. **FP-A-B2 (new shot S02-SH00A, CAM-GLASS-OUT variant, ≈ 5 s, under `แต่พอเข้าร้าน หมอกก็กลืนลานจอดจนหมด`):** from just inside the glass, narrator in **profile** at frame left as the lead (rig profile view; no back-of-head view, per `DF-20261030-painted-profile-head-turn`; the look-check's back silhouette is a placeholder), looking out. Hold ≈ 1 s on the clear view. Then a visible fog front (rolling wall with a bright crest and low tendrils running ahead on the ground) advances toward the glass and eats, in order: far road and dashes → far canopy lamps → pumps and columns → the car → the kerb. Near lamps survive as halos. Last ≈ 0.5 s: the grey presses flat against the panes.
3. **FP-A-B3 (S02-SH01 as today, shorter):** interior, phone in hand, torch plant; the glass behind is already FS2 grey, now meaning "the world is gone" because we watched it go.

- Shots changed/added: **add S02-SH00A** (≈ 4.5–5.5 s); S01-SH02 FS0 look fixed (no FS0→FS1 ramp in it); S02-SH01 keeps its action, its window starts at FS2 (it may trim ≈ 1 s). FOG-STATE: FS0 holds to the cut into SH00A; FS0→FS2 happens inside SH00A as a **fog-front distance** clock (≈ 45 m → 10 m → 2.5 m) instead of a global fade.
- Added duration: **≈ +4 to +5 s** (100 → ≈ 104–105 s before the TTS retime).
- Feasibility (painted pipeline): high. Reuses CAM-GLASS-OUT, ST-01 set, PANES, the VD07 SVG foreground frame (straight mullions per `DF-20261030-painted-straight-bars`; the look-check's flat bars confirm this), lamp glow ≤ `GLOW_PEAK`. The look-check proved the depth-ordered draw (items far → near with the fog wall inserted at its own depth) in one canvas. New: `paintOutside` gains a fog-front input; elements get visibility from their depth relative to the front. Proposed API (design, untested in production): `paintOutside(p, proj, G, {front?: number})` with `front` undefined = today's behaviour, so S02-SH04 onward stays identical.
- Risk: (1) changing `paintOutside` could shift the approved FS2 window plates; mitigation: the new path only when `front` is passed, plus a pixel-compare of S02-SH04/S03-SH03/S04-SH03 frames before/after (`DF-20261030-retime-picture-parity` says compare with chrome off at the same G). (2) Pane sheen veils dark props low in frame (`DF-20261030-painted-glass-sheen-veil`): the car sits mid-frame; keep sheen default, check the car read. (3) Moving fog washes may flicker if their count changes; seed per depth group (`p.group`), as the look-check does.
- Boss cost: **low–medium** — one optional parameter in `outside.ts` + one shot block (camera, narrator profile pose, fog-front clock) + a clear FS0 pass for S01-SH02. No new set, rig view or prop.
- Why recommended: it is the user's first idea, it is what VO-03 says word for word, it keeps the story's single vantage (the glass is the world gauge that S04-B02 closes on), and it is the cheapest. It also sets up S04-B02: the ending's lamp-by-lamp fade becomes a rhyme of this swallow.

### FP-B — High exterior wide, fog wall rolls over the station

Viewer sees:
1. **FP-B-B1 (new shot S01-SH02A, CAM-HIGH-WIDE, ≈ 4 s):** high oblique wide at night: dark fields, the main road, the access lane, the station as a small lit island (canopy with warm pool, shop box with lit windows, the parked car).
2. **FP-B-B2:** a pale fog wall rolls in from the main road and moves down the frame: road and dashes gone → lane → canopy disappears under the bank → shop windows go → one warm smudge in grey.
3. Cut inside to S02-SH01 (window already FS2).

- Shots changed/added: **add S01-SH02A** between S01-SH02 and S02-SH01 (VO-03's first clause would straddle the cut, or VO-02's tail sits over the clear wide); S01-SH02 FS0 fix as in FP-A.
- Added duration: **≈ +4 s**.
- Feasibility: medium. Needs a **new set view** never built: station roof/canopy top, shop exterior box, road/field layout seen from above, plus a new camera and the ST-01 plan extended beyond the forecourt. The rolling wall itself is easy (look-check row FP-B).
- Risk: (1) **Concealment (VD05):** a high angle sees the assembly from above, outside the ±30° front sector; it must be off-frame or already inside the bank, or the shot breaks PD01. (2) The station is small in a 1080 px-wide frame; the read depends on the warm island contrast, so the swallow reads but no detail (car, pumps) does. (3) It is a narrator-less objective view, a new camera language in a film built on the narrator's limited view.
- Boss cost: **high** — new set view + camera + projection check + fog wall layer; ≈ 1 new asset group.
- Strength: the most "world-eating" scale; the best fit if the user wants the episode bigger/longer. Could be added on top of FP-A later.

### FP-C — Reverse angle from the forecourt back to the lit shop

Viewer sees:
1. **FP-C-B1 (new shot S02-SH00C, CAM-FORECOURT-REV, ≈ 4 s):** from the forecourt at pump height looking back at the shop: a pump in the right foreground, the parked car mid-frame, the lit glass front with the narrator small inside.
2. **FP-C-B2:** fog density rises; the shop wall and car grey out first (farthest), the foreground pump last; the lit glass outlasts everything and ends as a glowing box floating in grey.
3. Cut to S02-SH01 inside.

- Shots changed/added: **add S02-SH00C**; S01-SH02 FS0 fix.
- Added duration: **≈ +3.5 to +4 s**.
- Feasibility: medium. Needs a **new shop exterior facade** (wall, glass from outside, interior seen through it with a small narrator) and a reverse camera; fog is a density ramp (simpler than FP-A's front).
- Risk: (1) Density fog loses the far shop first, so the swallow reads "everything greys" more than "something advances" (look-check row FP-C mid). (2) The camera stands where the shape is coming from; whose view is it? It weakens the limited-view rule and invites the question of why we don't see the shape. (3) The narrator inside reads at ≈ 110 px, below the lead size rule unless staged as a deliberate exception.
- Boss cost: **medium–high** — new facade/exterior set + camera.
- Strength: the strongest "the shop is the only lit pocket" image; good as a later Long-version shot.

## Comparison

| | FP-A Glass swallow | FP-B High wide | FP-C Reverse |
| --- | --- | --- | --- |
| Reads "fog covers the station" | strong (ordered loss, close detail) | strong (scale), little detail | medium (uniform greying) |
| Added time | +4–5 s | +4 s | +3.5–4 s |
| New set/camera | none (camera variant) | new set view + camera | new facade + camera |
| Story rules at risk | none | VD05 concealment, limited view | limited view, lead size |
| Boss cost | low–medium | high | medium–high |
| Matches VO-03 wording | exactly | partly | partly |

## Recommendation

**FP-A**, with the FS0 fix in S01-SH02 (FD01) as part of it. FP-B is the add-on if the user wants a bigger, longer opening later; FP-C is not recommended for the Short.

### Acceptance criteria for FP-A (observable, for the R6 brief and Mark's sheet)

- FA01: The first ≥ 1 s of S02-SH00A shows, readable at 270 px tile size: road dashes, four lamp cores, both pump islands and the car outline.
- FA02: A labelled 4-frame strip across the swallow shows the losses in order road → far lamps → pumps → car → kerb, each frame removing at least one, with a visible fog front (crest/tendrils) between kept and lost layers.
- FA03: The last frame shows no readable car, pumps or road; near-lamp halos only; panes grey edge to edge.
- FA04: Every loss happens inside y 300–950 and is not covered by the lead or the caption band (y 1000–1248); lead ≥ the production lead size, profile view.
- FA05: S02-SH04, S03-SH03 and S04-SH03 frames are unchanged versus r8b at the same G (chrome off), proving the `front` path is opt-in.
- FA06: Determinism: a frame rendered twice with `--gl=angle` is byte-identical.
- FA07 (user check): shown only the early/mid/late frames without sound, a viewer can say the fog covered the station.

Fallback: if the fog front reads as a flat wipe, replace the single wall with 2–3 staggered banks at different depths and add ground tendrils; if the car still competes with the lead, move the narrator to a smaller over-shoulder edge and keep the car centre.

## Sound direction for the fog beat (all options; Editor owns the mix)

- Music: same family (dark ambient drone + sparse piano, free tempo); a slow swell under the swallow, no riser or stinger; drops back for the phone insert.
- Ambience: the clear "before" carries an open-air night layer that the fog **muffles away** (low-pass and level down as the front reaches the glass), ending in the shop's fridge/fluorescent hum only. The silence of the outside is the sound of the fog. Library checked 30 Oct 2026 (`sound-library/INDEX.md`, nothing human-auditioned): `nature_night-crickets_01` (12.5 s, loop) is a candidate for the open-air layer (it has a distant owl, so it needs an audition); `nature_wind-eerie-street_01` is excluded (debris); `bed_dark-drone-sub_01` is a candidate under-layer for the swell. Gaps unchanged from brief R5 (`outdoor_fog-forecourt-hush_01`, `room_shop-fridge-hum_01`).
- SFX: none for the fog itself (no whoosh; brief exclusions stand).
- Silence policy: the outside sound reaching zero is the beat's end, just before the phone notification.

## Handoff

- Coordinator: ask the user to choose FP-A / FP-B / FP-C (or A+B) with the contact sheet attached.
- Film (after the choice): brief R6: VD06 reopened (fog-front clock, FS0 clear look), new shot decision, sound lines above, acceptance FA01–FA07.
- Mark: new shot block and retime after Gemini TTS measurement (VO-02 tail over the clear view, VO-03 first clause over the swallow).
- Boss: FP-A `paintOutside` `front` option (proposed API, untested in production) + shot block; FP-B/C new sets.
- Editor: re-cut and mix after Boss; sound per above.
