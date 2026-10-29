# Visual brief history — ZCONDO-SHORT

Superseded change-log entries and affected-decision lists moved out of [visual-brief.md](visual-brief.md) on 29 Oct 2026 (Film workflow [brief history](../../../docs/film-visual-brief-workflow.md#brief-history)). Current decisions, the Mark handoff tables and the latest change-log entry stay in the brief. The text below is unchanged.

## Affected decisions per revision

- **Affected decisions in R3.2:** `PROJ-ZC-R3` (`CAM-SECTION-LL` measured note and the cut-plane rule; contract ID kept), `VD-ZC-07` (TH trim), `VD-ZC-09` (SH01 sliver, phone side). No timing, beat, VO, claim or reveal change.
- **Affected decisions in R3.1:** `VD-ZC-01` (door opening, B01 look target), `VD-ZC-02` (SH01 latch side), `VD-ZC-07`/`VD-ZC-09` (`CAM-SECTION-LL`), `PROJ-ZC-R3` (amended), `SCALE-ZC-R2` (door-wall value fixed), `VD-ZC-TL` (EN B05-SH03 bowl part), `SP02` criteria. Sheet values already match except the items in [Mark handoff (R3.1)](visual-brief.md#mark-handoff-r31).
- **Affected decisions in R3:** `VD-ZC-01`, `VD-ZC-03`–`VD-ZC-10`, `VD-ZC-OV`, `VD-ZC-TL`, `VD-ZC-AU`, `VD-ZC-CAP`, `ZC-CUT-03`, `PROJ-ZC-R2` → `PROJ-ZC-R3`, `S-03`–`S-05`, `S-08`–`S-11`, `SP01`/`SP02` criteria. `VD-ZC-02` is re-timed only.

## Change log (R1 – R3.2)

- **`VB-ZCONDO-SHORT-R3.2`** (29 Oct 2026, Film): adopts Boss's `SP02` results (`DF-20261029-zcondo-sp02-section-spike`) and the user's acceptance of the B09 seated lead (“Accept + commit”, relayed by the coordinator). No re-timing, no shot or beat change, no VO or claim change; scripts R3, Boat recheck R3 and the conceal/reveal intent unchanged. [Mark handoff R3.2](visual-brief.md#mark-handoff-r32).
  - `PROJ-ZC-R3`: `CAM-SECTION-LL` gains the measured leads (502–506 / 552 px), the user's acceptance and the 3.2 m condition; new cut-plane ×1.117 rule with the sliver formula.
  - `VD-ZC-09`: B09-SH01 keeps the black corridor sliver; camera y 0.90 → 0.78; counter column x 140–360 → 180–375; phone stays at (−0.80, 0.62), described as his right (door side).
  - `VD-ZC-07`: B07-SH02 TH trim 15 → 9 (clip 9–89), EN unchanged; plate path unchanged.
  - Evidence: `SP02` measurements (Boss, blockout, CLI renders `out/blender/zc-unit/sp02/`, `out/qa/zombie-condo/sp02/`); screen values derived by Film from them are `estimated`. No render, install or code change.
- **`VB-ZCONDO-SHORT-R3.1`** (29 Oct 2026, Film): verdicts on Mark's open items from `ZCONDO-SHORT-SS-R2`, requested by the user (“Film ตรวจ MK-Q2–Q5”, relayed by the coordinator). No re-timing, no shot or beat change, no new claim; scripts R3 and Boat recheck R3 unchanged. [Verdict table](visual-brief.md#mark-handoff-r31).
  - `MK-Q2` accepted: `VD-ZC-02` SH01 "hinge side" → latch side.
  - `MK-Q3` accepted: `VD-ZC-01` door opening carried by sound/step; leaf out of frame; latch + hinge cue load-bearing.
  - `MK-Q4` decided: door wall 0.18 m for both sets (`SCALE-ZC-R2` value unchanged; `zc-corridor` blockout to align); `SP02` (a3).
  - `MK-Q5` accepted: `PROJ-ZC-R3` amended with `CAM-SECTION-LL` (seated-lead shots B07-SH02, B09-SH01/SH03; 3.2–4.6 m; user's naturalness condition and SS-R1 standing fallback kept); `VD-ZC-07`, `VD-ZC-09`, `SP02` (a)/(a2), Mark boundaries updated.
  - Also: B01 look target for the SP01 grey-figure note; EN B05-SH03 bowl part and anchor moved to Mark's values; Q-R3-1 moved to history.
  - Evidence: reasoning from the sheets' coordinates, `assets/blender/zc-corridor/manifest.md` (`707bb32`) and the SP01 contact sheet `out/qa/zombie-condo/sp01/contact-TEST-F0-F36-F104.png`; seated sizes are Film's projection arithmetic (`estimated`), not renders. No render, install or code change. Dev findings: the three `DF-20261028-zcondo-*` entries re-checked by Film in `docs/dev-findings.md` on `e44adb4` (same scope: `zc-corridor`, Eevee 64 + baked probes); none covers the section, long-lens section or seated poses, so `SP02` remains the evidence gate for `CAM-SECTION-LL`.
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
