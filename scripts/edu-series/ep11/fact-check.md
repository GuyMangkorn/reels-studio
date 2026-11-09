# EDU-EP11-SHORT — fact-check (W1.3, Boat, 2026-11-08)

- Script checked: `script.md` **EDU-EP11-SCRIPT-R1** (L01–L16, V01–V04, shot cues, on-screen text, sound intent). `script.md` not edited. Ending **A** (L16 spoken last) is the user's choice and is kept.
- Research: `research.md` W1.1 (F001–F018, SRC001–SRC009). New this pass (search results only, lead-level; no page opened):
  - **SRC010** `lead-only`. Search summary across Otis Elevator Co./ASME/Britannica/vtdigger results: the 1854 demo was at the Crystal Palace, New York, in May 1854 (one source: 30 May); the platform was raised and the rope cut; some say the platform fell only a few inches. Sources call the rope "rope", "hoisting rope" or "cable". **None names a material** (hemp vs wire). Period illustration shows an assistant cutting it; the company says an axe.
  - **SRC011** `lead-only`. Search summary across Otis, Liberty Elevator, Technical Safety BC, Elevator Uptime and university pages: if a lift stops, use the alarm or emergency phone, stay calm and wait; do not climb out or force the doors.
- Access gaps: no standards text, no Britannica page, no rail-brake deceleration data opened. Hypothetical physics rests on own calculation (g = 9.8 m/s²) and SRC001.
- **Verdict: pass with 2 required fixes and 3 recommended edits.** Premise, hook, beat order, twist and learning goal unchanged.

## Required fixes

| ID | Line | Problem | Replacement |
| --- | --- | --- | --- |
| FIX-1 | L10 (also N3 TTS text, subtitle) | "สลิง" means steel wire rope; no source says the 1854 rope was steel (SRC010: material unnamed; hemp or wire both plausible). "สลิง" would assert a material. | "ปี 1854… โอติสยืนบนแท่นสูง แล้วสั่งให้ตัดเชือก". Keep "สลิง" in L01 and L14 (modern steel ropes, SRC002). |
| FIX-2 | L14 / clamp / L15 picture (Film, plus one subtitle-safe option) | In the story the gauge shows ~120 km/h, then the jaws catch the car and the gauge "falls to zero" "a short way down". A real governor trips the gear at a speed only slightly above the lift's rated speed (SRC004 lead-only, numbers not used), so a lift with a working brake never reaches 120 km/h; it is caught within a short drop at low speed. Showing 120 → 0 over a short stop implies a brake that survives that speed instantly and painlessly, which is unsupported. | No Thai change needed if picture is fixed: at L13/L14 the counter and gauge reset to a fresh start (counter "20" or a mid floor, needle near 0, tag "ถ้า…ร่วงจริง" kept); the jaws catch with the needle only a few notches up; woman settles. If Film keeps one continuous fall, then change L14 to "…ขาดหมด เบรกก็จับรางตั้งแต่เริ่มตก" and show the catch early. |

## Preaw's three questions

1. **D-01 L05 "ชั้นยี่สิบ… ก็แค่กลายเป็นเหมือนชั้นสิบเจ็ด": pass.** F003: equivalent drop = (34.3 − v)²/2g = 52.8 m (v = 2 m/s) to 49.8 m (v = 3 m/s). The L04 figure "ราวสิบ" km/h = 2.8 m/s gives 50.6 m. At about 3 m per floor, 60 m = 20 floors (the script's own convention), so 49.8–52.8 m = 16.6–17.6 floors, which rounds to 17. "เหมือน" already hedges; wording is fair. Cautions: (a) "ก็แค่" is irony, since a ~50 m fall is still lethal-scale (F003); the laugh must not read as "17 floors is survivable" (the next lines, L06+, keep the stakes). (b) The counter "20 → 17" is a floor-count dramatization of a height equivalent, acceptable with the tag. (c) Consistent only because the script says 3 m per floor; do not show a number of metres.
2. **L15 "ลิฟต์หยุด… คุณก็หยุดไปด้วย": pass, with the FIX-2 picture condition.** True: once the car is at rest, you are at rest (F004: you share the car's speed; the rule is about the frame, in both directions). Honest limit: the car decelerates and a floating occupant is brought to rest only when the floor catches her (she is pressed to the floor for an instant); the words do not say "painlessly" or "instantly". The flip is therefore not misleading as long as (a) the brake catches early (FIX-2), and (b) the clamp picture shows her landing on the floor at modest force, not slammed or flung. "Drops gently" in the (clamp) cue is consistent with a low-speed catch only. No Thai change.
3. **L10 สลิง vs เชือก: "เชือก".** Reasons: "เชือก" is neutral; research F012 wording was "สั่งตัดเชือก"; every inspected/lead source says "rope" and none gives the material (SRC010). Same meaning for the viewer, one syllable fewer. See FIX-1. Modern "สลิง" (L01, L14) stays; note that some current lifts use coated steel or flat belts (not researched), so L13 "ลิฟต์สมัยนี้" is carried by "แทบ" and L14 describes the common steel-rope lift only (see R-3).

## Claim verdicts

| Line | Claim / text | Verdict | Basis and note |
| --- | --- | --- | --- |
| L01, V01 | Cables snap, fall from floor 20, you float; "ถ้า…" frame; tag "ถ้า…ร่วงจริง" | pass | F018; hypothetical framed in words and on screen. Snap, whoosh, chime are fictional effects; no real recording. |
| L02 | "จากความสูงขนาดนี้… แทบไม่ช่วยอะไรเลยนะ" | pass | F003; qualifier kept so it does not become "never helps". |
| V02 | "เอาไงดี… โดดสวนขึ้นไป!" | pass | Character belief, not narrator. |
| L03 | "ใกล้พื้น ลิฟต์เร็วราวร้อยยี่สิบ… ลิฟต์เร็วเท่าไหร่ คุณก็เร็วเท่านั้น"; gauge "ราว 120 กม./ชม." | pass | F001: 123.5 km/h for 60 m, "ราว". Spoken without a unit; gauge carries it (see R-2). True free-fall idealisation; framed hypothetical. |
| L04 | "กระโดดสุดแรง หักออกได้แค่ราวสิบ"; "−10" | pass | F002: ~10 km/h is a top-end. On-screen "−10" needs "กม./ชม." (R-2). |
| L05 | see D-01 above | pass | |
| V03, V04 | reactions | pass | dramatization. |
| L06 | "คุณมองไม่เห็นพื้น… ต้องกะให้ตรงเสี้ยววินาที" | pass | F005 qualitative; typical lifts have no floor view; no reaction-time number. |
| L07 | "เร็วไป ก็ลอยไปชนเพดาน" | pass | F004/SRC001. In true free fall any push-off drifts up relative to the car, so "เร็วไป" is simplified but not false. Optional: "อาจลอยไปชนเพดาน" (R-1 below). |
| L08 | "ช้าไปนิด… ก็ไม่ทันแล้ว"; cut to black | pass | F004/F005; no impact shown. |
| L09 | "แต่เดี๋ยวนะ… ลิฟต์ร่วงแบบนี้ได้จริงเหรอ" | pass | question only. |
| L10 | "ปี 1854… โอติสยืนบนแท่นสูง แล้วสั่งให้ตัดสลิง"; caption "นิวยอร์ก 1854" | **fix** | Year/place/ordered cut pass (F011, F012; SRC010 lead-only for "ordered"); word "สลิง" → FIX-1. Staged axe/assistant is a staging choice; narration names only the order. Gasp: reconstructed, label with picture. |
| L11 | "แท่นตกนิดเดียว… แล้วเบรกก็จับราง"; "ภาพประกอบ" | pass | F012, F013; label present. Film: do not design the 1854 catch to look identical to the L14 modern jaws (no "same brake" implication, research correction 6). |
| L12 | "สิ่งที่คุณกลัว… ถูกแก้ไว้ก่อนมีลิฟต์โดยสารที่มีเบรกนิรภัยตัวแรกซะอีก"; caption "1857" | pass | F014, F016, F015 wording applied. 1857 Haughwout rests on SRC006 (tertiary, citing Britannica/Invent.org/PBS); year does not differ across sources. Access gap Q2 remains (confidence: medium-high). Caption shows only the year. |
| L13 | "ลิฟต์สมัยนี้ แทบร่วงแบบนี้ไม่ได้เลย"; on-screen "แทบ" | pass | F009 hedge kept. Scope: traction lifts with several ropes; hydraulic and belt lifts not researched (R-3). |
| L14 | "สลิงมีหลายเส้น เส้นเดียวก็รับไหว… ขาดหมด เบรกก็จับราง"; jaws "ภาพประกอบ" | pass, picture condition FIX-2 | F006 (SRC002, no count), F007 (SRC002 "governor should activate"), F013. No count, no percentages: applied. |
| L15 | see above | pass | |
| L16 | "ถ้าเจอลิฟต์ค้างจริง… ไม่ต้องกระโดดหรอก กดปุ่มฉุกเฉิน แล้วรอ" | pass | SRC011 (lead-level, consistent across lift makers and safety bodies): alarm/phone, stay calm, wait. It is a safety instruction, not a survival tip for the fall; do not add "อย่าพยายามปีนออก" unless wanted. "ถ้าเจอลิฟต์ค้าง" correctly differs from a fall. |
| Visuals | counter, gauge, float, shaft cutaway, 1854 crowd, "−10", "1857" | pass | Dramatization/reconstruction, tags in place; no period photograph claimed; no impact, no casualty. |
| Sound | cable snap, whoosh, gasp, clamp, bell | pass | All fictional/reconstructed; gasp labelled with picture; bell is a plain alarm tone, no siren, no implied accident. |

## Boat changes from research.md: applied?

First-safety-passenger-lift wording (L12) yes. Otis "ordered" the rope cut (L10, not "cut himself") yes. "จากความสูงขนาดนี้" (L02) yes. "ภาพประกอบ" on 1854 catch and modern jaws (L11, L14) yes. "ถ้า…ร่วงจริง" framing (L01 + tag) yes. No survival tips, no 1945, no lie-flat: yes (L16 is alarm-and-wait). No rope counts or governor percentages: yes. "Same brake you ride today" avoided: yes.

## Recommended edits (optional)

- R-1 L07: "เร็วไป ก็อาจลอยไปชนเพดาน" (adds "อาจ", one syllable).
- R-2 Units: gauge "−10" → "−10 กม./ชม."; subtitle for L03/L04 shows "120 กม./ชม." and "10 กม./ชม." since speech omits the unit.
- R-3 L13/L14 scope: if wanted, "ลิฟต์สมัยนี้" is fine as is because of "แทบ"; do not add "ทุกตัว".

## Uncertainties

Access gaps: Britannica, standards text, primary 1854 newspaper (rope material, who cut it); SRC010/SRC011 are search-level only. Month of 1854 demo and day of 1857 not used. Confidence: high on arithmetic (F001–F003) and on rail-brake principle; medium on 1854/1857 history (secondary/tertiary); qualitative on timing (F005) and on the brake picture (FIX-2).

## Readiness

**ready-with-fixes for EDU-EP11-SCRIPT-R1**: apply FIX-1 (L10 "เชือก") and note FIX-2 for Film; then Boat recheck of L10 only. Ready for W1.4 length check after FIX-1; handoff to Film for the brief is supported for the matching revision once FIX-1 lands (R2) and FIX-2 sits in the scene handoff. This adds no user-approval gate and is not audio or visual validation.

## W2 recheck

Boat, 2026-11-09. Inputs: script R3, EDU-EP11-BRIEF-R1 (VD18, VD20–VD24, VD27), storyboard (shots 15–17, 19–23), research F011–F016. Two web searches this pass (standard, snippets only, so leads, not inspected pages): Otis 1854 demo and Haughwout 1857 (Guinness World Records, Mystic Stamp, Otis-related summaries, VTDigger, New England Historical Society). Access gaps unchanged: no primary 1854 newspaper, no Britannica page text. No file other than this one was edited.

### 1. L10 "ตัดเชือก" (script R3)

**Verdict: pass.**

- "ปี 1854… โอติสยืนบนแท่นสูง แล้วสั่งให้ตัดเชือก" matches F011 (1854, Crystal Palace; place on caption only) and F012 (ordered cut). Search leads this pass agree: 1854, Crystal Palace, an assistant severed the hoist rope/cable on Otis's order. "เชือก" is neutral on material, which is the FIX-1 requirement; "สลิง" stays in L01/L14 only (modern steel ropes).
- "แท่นสูง" holds: sources say the platform was raised (heights differ, 10 m to 40 ft); nothing on screen or in narration gives a height.
- Consistency check: L10 and the L14 picture both use a hoist cut; no line says Otis cut it himself. The staging (assistant with an axe) is a staging choice, allowed by F012. Note the sources disagree on the tool (axe vs knife in an old illustration; Otis Elevator Co. says axe); narration names no tool, so no change. Keep the axe on screen only as a staging choice.
- TTS and subtitle text must read "เชือก" in all five R2 places; Editor to confirm the voice take matches R3.

### 2. B-P1 the 1854 catch drawing (brief VD20–VD23, storyboard shots 15–18)

**Verdict: pass with fix (3 small picture fixes, no Thai change).**

What is historically sound:
- Otis on a raised open platform, crowd, rope cut, platform drops a short way and stops: supported (SRC007, F012; leads agree).
- A spring-loaded catch meshing with the guide rails: supported in outline (SRC007, F013). Otis's design is generally described as a spring plus pawls/ratchet teeth on the guide posts. The search leads this pass do not name "pawl" or "bow/wagon spring", so the exact bow spring and iron pawl is an illustration of the principle, correctly labelled "ภาพประกอบ" (LBL f1041–1077). Timber uprights with notches are plausible (period guide rails were timber with teeth) but not confirmed from an inspected page: the label covers it.
- A showman in a top hat, a crowd in 1850s dress, sepia: plausible and flagged as a reconstruction. Barnum-style showmanship around the demo is attested (lead only).
- Distinct from the modern jaws: yes. Timber, bow spring, hook pawl, sepia, amber on moving parts versus steel T-rail, wedge jaws, cool steel (R04, VD22/VD27). No shared shape or colour. Pass.

Fixes:
- **B-P1-FIX-a (drop distance, shot 16 / SH03 VD21).** The brief drops the platform 0.30 m (about 12 in). Retellings say "a few inches" (lead-only, anecdotal). Narration says "ตกนิดเดียว", so it is not false, but 0.30 m reads as a foot. Change to about 0.15 m (about 6 in; feet ≈ y 1062 → ≈ 1112, about 50 px) in VD21, storyboard shot 16 and the camera note. Adjust the frame jolt to taste.
- **B-P1-FIX-b (hall identity, set plan SET-HALL1854).** The hall has an arched glass roof and cast-iron columns, which reads as the Crystal Palace, and the caption says "นิวยอร์ก 1854". That is fine (generic, no building name) as long as no banner text or label names the building. Keep banners textless (already in the brief) and keep it "a reconstruction"; do not add "Crystal Palace" on screen without a source check of the interior look. No change if the brief stays as written.
- **B-P1-FIX-c (what the catch does when the rope parts, shot 17 / VD22).** The spring pushes the pawl out "as the rope goes slack": correct as the principle (it engages on loss of tension). Keep the order: rope slack first, then pawl. Do not show the pawl engaging before the cut (that would imply an always-on brake). Already so in the brief; recorded as a condition.
- Optional (not required): the 3 px "stops dead" jolt is fine; with a 0.15 m drop keep the showman calm.

Nothing misleading about Otis "inventing the elevator": none shown. No narration says "the same brake you ride today". Pass.

### 3. B-P2 the L13/L14 rewind and FIX-2 (brief VD18/VD27, storyboard shots 20–23); 1857 store front (shot 19)

**Verdict: pass with fix (rewind and gauge design honest; two numeric fixes; 1857 shot pass with a label condition).**

Rewind logic, honest:
- A fresh start at floor 20, gauge at zero, tag "ถ้า…ร่วงจริง" kept, jaws catch with the needle a few notches up: this meets FIX-2. The brake is never shown stopping the 120 km/h fall. A viewer can read the rewind as a second hypothetical run, which is what it is. Pass.
- Keep the tag pill on through shots 20–23 (R01) so the rewind is not read as "the same fall, saved". Already so.

Fixes:
- **B-P2-FIX-a (drop vs needle must agree, shot 22 / VD27).** A free fall from rest of 0.60 m reaches sqrt(2 × 9.8 × 0.6) = 3.4 m/s = about 12 km/h, which is about 10% of a 0 to 120 km/h dial. The brief says needle about 8% (about 9.6 km/h = 2.7 m/s, which is about 0.37 m of fall). Either set the drop to about 0.35–0.40 m with the needle at 8%, or keep 0.60 m with the needle at about 10%. Recommended: drop 0.40 m (about 130 px at the jaws camera scale; recompute), needle about 8–9%. This keeps the picture consistent with the idea that a car which drops only a short way has gained only a small speed (own arithmetic; no source number for governor trip speed is used or shown).
- **B-P2-FIX-b (no slam at the stop, shot 22–23 / VD27, L15).** The jaws "stop the car" in one frame ("stops dead"?) would imply instant deceleration at a few m/s, which is a violent stop. Real safety gear decelerates progressively. Show the car slowing over a visible distance (several frames, about 0.15 m or more after the bite) with a small settle, not a dead stop. She is pressed to the floor gently (her knees dip as in shot 23, which the storyboard already has); no flinging. This follows FIX-2 point (b) from W1.3.
- Not claimed and must stay out: no governor drawn (OK), no speed of trip, no metres or numbers on screen (OK per VD24). The gauge needle moves without a number (OK).
- L14 "ขาดหมด เบรกก็จับราง": words are true as design with "แทบ" carried by L13; the picture is a hypothetical (all ropes gone) with the brake catching early. Pass.

1857 store front (shot 19, S01-B04-SH06):
- **Pass with label condition.** The facts supported: 1857, E. V. Haughwout store, New York, first passenger lift with a safety brake (F014; leads add it was steam-driven, a five- or six-storey store, 488–492 Broadway). The brief's generic five-storey cast-iron front is consistent. Caption is "1857" only: correct.
- Conditions: (a) the cut-open centre bay and the open-cage car are a stylised illustration: the real shaft was inside the building and its car design is not sourced; do not name the building or street on screen, and do not caption it "Haughwout" (the brief already says no building name). (b) Do not show a safety catch or rope on the 1857 car, so it does not claim the Otis catch was visible. (c) The shot says only "a passenger lift in a store" (VD24), which matches L12. Q-F1 (keep the shot): fact-wise either choice passes; keeping it supports L12's "ลิฟต์โดยสารที่มีเบรกนิรภัยตัวแรก" and carries no extra claim. Passengers in 1850s dress: fine.
- Not claimed anywhere: "first lift", "first passenger lift in the world" (F015 stays out).

### Summary table

| Item | Verdict | Fix IDs |
| --- | --- | --- |
| L10 "ตัดเชือก" | pass | none |
| B-P1 1854 catch | pass with fix | B-P1-FIX-a (drop 0.30 m to about 0.15 m), -b (no building name), -c (pawl only after rope slack) |
| B-P2 rewind and jaws | pass with fix | B-P2-FIX-a (drop 0.60 m and needle 8% disagree: use 0.40 m, 8–9%), -b (progressive stop, no dead stop) |
| 1857 store front | pass with label condition | caption "1857" only, no name, no catch shown |

Uncertainties: the 1854 mechanism detail (pawl, bow spring, timber teeth) is an illustration (labelled); drop distances are staging estimates (inches in retellings are anecdotal); search-level sources only this pass. Confidence: high for the picture rules, medium for the historical outline.

Readiness: the brief and storyboard are ready for the Boss/Editor handoff once B-P1-FIX-a, B-P2-FIX-a and B-P2-FIX-b are applied by Film; Boat needs no re-run for pure picture-number edits.
