# EDU-EP08-SHORT — ER01–ER07 script audit (Preaw, 2026-11-08)

- Trigger: user 2026-11-08, "check whether any scene should change; change the narration if needed; still draft". Rules: [scriptwriting-principles: Edu Short retention](../../../docs/scriptwriting-principles.md#edu-short-retention) ER01–ER07 (Default).
- Audited: script **R1.1** as locked at atempo 0.95 (1762 f = 58.73 s; 30 % = 17.6 s). Times = G / 30 from [scene-sheets.md](scene-sheets.md#placement) (SHEETS-R2.2 placement, built from [timeline.json](timeline.json) / measure.json; `meas`/`meas-w` anchors).
- Result: **script R1.2** ([script.md](script.md)): L12 trimmed, L13 rewritten. All other lines, line IDs, shot IDs and beats unchanged. Not voiced, not rendered, not Boat-checked, not user-approved.

## Verdicts (R1.1)

| Line(s) | Time (s) | Rule | Verdict | Evidence / reason |
| --- | --- | --- | --- | --- |
| L01 | 0.13–1.70 | ER01 | pass | Title promise as line 1, speaks to "คุณ" |
| V01 + silence | 1.97–3.33 | ER01, ER04 | pass | Gasp/"เฮ้ย" then true silence; stakes shown (helmet drifts, ring fades in G93–101) |
| L02 | 3.53–7.63 | ER01, ER05 | pass (borderline) | Contradicting claim "ไม่ระเบิด" at 4.07 (≤ 5 s); stakes "อาจมีสติ… สิบถึงสิบห้าวินาที" 5.30–7.63, slightly after 5 s but on the ring; no technical term |
| L03 | 7.93–9.63 | ER01 | **fail on timing → kept as a recorded deviation** | Objection answered at 7.9–9.6 s vs ~7 s. Reason to keep: the V01 slot and its 6 f silence are user-locked (the episode's sound idea, N2), and L03 "นี่แค่สมมติ" is Boat's condition for the L13 advice framing. No cheaper lever without re-voicing L02 for < 0.5 s |
| L04–L05 | 9.93–16.63 | ER02, ER05 | pass | Hook paid by 16.6 s (≤ 17.6); body-known comparison "เหมือนกระติกน้ำร้อน" at 14.0; pat-check and ice gag on screen with the lines |
| show + L06 | 16.77–24.13 | ER02, ER06, ER05 | pass | Glitter + mouthed "หืม?" 1.0 s before "แต่น้ำลาย…"; the next problem opens in picture, then "แต่…" (show, then tell); mechanism one everyday line (20.6–24.1, 3.5 s), no term |
| L07–L09 | 24.53–37.43 | ER02, ER06, ER07 | pass | 12.9 s flashback with AST off screen, but TECH is a character in trouble and it is split Q → A → Q → A (hose pops 28.2 → foam + "หมดสติ" 34.2 → "ฟื้น" 35.1); "ตามรายงาน", "เขาเล่าว่า" are narrow hedges, not "unclear". Risk only: ring paused ~13 s |
| show + L10 | 37.57–44.53 | ER02, ER06 | pass | Held breath shown 1.0 s before "แต่ถ้ากลั้นหายใจ…"; 5.9 s with AST under the inset; answered "ปอดอาจบาดเจ็บได้" 43.5, which opens "so what does she do?" |
| exhale + L11 | 44.67–46.20 | ER03 | pass | Rule flip in picture first (glitter stream), then "ปล่อยมันออกมา…" |
| V02 | 46.90–47.53 | ER04 | pass | Reopens the race against the ring |
| L04–L13 (AST) | — | ER04 | pass with deviation | AST cannot make sound in vacuum after V01 (F010a); the silent "หืม?", the held lips and the exhale carry her reactions. Narrator particles "นะ" (L03, L06), "หรอก" (L13 R1.1) |
| L12 | 48.13–52.93 | ER07, ER06 | **fail** | "แต่ข้อมูลส่วนใหญ่มาจากสัตว์ กับอุบัติเหตุไม่กี่ครั้งนะ" (50.1–52.9) is an on-screen evidence hedge of the "results differ / evidence unclear" kind ER07 cuts; after "ก็อาจรอด" (49.2) and the ring stop (49.4) no question is open |
| L13 + closing | 53.43–58.73 | ER03, ER06 | **fail** | "คุณไม่ระเบิดหรอก…" recaps a hook paid 37 s earlier; "สิ่งที่ควรทำ คือหายใจออก" is phrased as a tip; together with L12b the last **9.3 s (49.4–58.7) have no open question** (ER03 allows a ~2 s hold after the payoff) |
| whole | — | ER03 | pass | Refrain "ไม่มีอากาศ" at L05, L06, L10 (and inverted in L09); CL01 gasp and CL02 crewmate planted at 0–3 s |
| whole | — | ER05 | pass (Boat clarity pass next) | Only "สุญญากาศ" (L07, 26.7 s) as a term; "เสียแรงดัน" (L07) is the line a non-science friend may stumble on: Boat's clarity pass may propose "ชุดรั่ว" (not changed here: re-voice cost, the hose pop shows it) |

## Changes (R1.2)

| Line | Old (R1.1) | New (R1.2) | Rule | Voice |
| --- | --- | --- | --- | --- |
| L12 | ถ้าช่วยเร็วมาก… ก็อาจรอด แต่ข้อมูลส่วนใหญ่มาจากสัตว์ กับอุบัติเหตุไม่กี่ครั้งนะ | ถ้าช่วยเร็วมาก… ก็อาจรอด | ER07 (cut the evidence hedge; "อาจ" and "เร็วมาก" stay as narrow hedges), ER06 | **No new take by default:** trim the existing cut2 take at the energy gap before "แต่ข้อมูล…" (G1504 in the R2 lock). New take only if the trimmed "รอด" sounds unfinished |
| L13 | คุณไม่ระเบิดหรอก… สิ่งที่ควรทำ คือหายใจออก | คุณจะอยากกลั้นหายใจไว้… แต่ในที่ที่ไม่มีอากาศ สิ่งที่ช่วยปอดคุณ คือหายใจออก | ER03 (last line = the reversal of the CL01 instinct, refrain #4, no tip or recap), ER06 (opens one last "แต่…" that the final words answer) | **New take** (~24 syllables, est 5.3–5.6 s at 0.95; keep the user's 0.9 s `qsin` fade) |

Claims to check (Boat): L12 drop of research hedge 4 (the task.md safety limit "survival hedge stays" is still met by "ถ้าช่วยเร็วมาก… ก็อาจรอด"); L13 "สิ่งที่ช่วยปอดคุณ คือหายใจออก" (F007; "helps the lungs", not "saves your life"); "คุณจะอยากกลั้นหายใจไว้" as the viewer's urge, not a stated reflex; hedge 5 conditions still met (L03 stays, L12 directly before L13).

Fallback if Boat keeps the evidence clause: L12 stays whole and L13 R1.2 follows it (~61 s, over the 60 s cap); then cut L11 "ปล่อยมันออกมา…" (the exhale picture carries it) or ask the user.

## Open-question map

R1.1 (times measured):

| Q | Viewer waits on | Opens | Answered | Open (s) |
| --- | --- | --- | --- | --- |
| Q1 | What happens with the helmet off? | L01 0.13 | L02 "ไม่ระเบิด" 4.07 | 0.1–4.1 |
| Q2 | Will she make it inside ~10–15 s? (spine) | L02 5.30 + ring | hatch shut / ring stop 49.4 ("ก็อาจรอด" 49.2) | 5.3–49.4 |
| Q3 | Can a helmet really come off? | premise, 1.7 | L03 9.63 | 1.7–9.6 |
| Q4 | Then what does happen to the body / won't you freeze? | L02 4.07 | L04 12.2, L05 "ไม่มีอากาศมาพาความร้อนไป" 16.6 | 4.1–16.6 |
| Q5 | What is the glitter at her lips? | show 16.77 | L06 "เริ่มเดือด" 19.2 | 16.8–19.2 |
| Q6 | Boiling at body warmth, how? | L06 19.2 | L06 "…ความอุ่นในตัว" 24.1 | 19.2–24.1 |
| Q7 | What happened to the 1966 tester? | L07 "เจอชุดเสียแรงดัน" 28.2 (set-up from 24.5) | L08 "…ก่อนจะหมดสติ" 34.8 | 24.5–34.8 |
| Q8 | Did he survive? | L08 "หมดสติ" 34.2 | L09 "แล้วเขาก็ฟื้น" 35.9 | 34.2–35.9 |
| Q9 | Why is she holding her breath, is it bad? | show 37.57 | L10 "ปอดอาจบาดเจ็บได้" 44.5 | 37.6–44.5 |
| Q10 | So what does she do? | L10 43.5 | exhale 44.7 / L11 46.2 | 43.5–46.2 |
| — | **gap: nothing open** | — | — | **49.4–58.7 (9.3 s) fail** |

Longest local gaps otherwise: 9.6–12.5 s is covered by Q2/Q4; 24.1–28.2 set-up (3.7 s) is covered by Q2 and the flashback cut. No other stretch > 5 s.

R1.2 (L13 times estimated; onset ≈ 15 f after S01-B05-SH02's cut at G1498, leaving a 0.5 s silent show beat):

| Q | Opens | Answered | Open (s) |
| --- | --- | --- | --- |
| Q1–Q10 | as R1.1 | as R1.1 | unchanged |
| Q11 | L13 "คุณจะอยากกลั้นหายใจไว้… แต่…" ≈ 50.4 | "…คือหายใจออก" ≈ 56.0 | ≈ 49.9 (show) – 56.0 |
| — | hold, closing fade | — | ≈ 56.0–58.3 (≈ 2.3 s, the ER03 hold) |

## Scene and shot impact (for Film, Editor)

| Shot | Change |
| --- | --- |
| S01-B05-SH02 | Picture unchanged (hatch shut G1482 stays inside "ก็อาจรอด"). Audio: L12 trimmed; L12a cue end = last voiced + 6 (≈ G1497) |
| S01-B05-SH03 | Line becomes L13a "คุณจะอยากกลั้นหายใจไว้… แต่ในที่ที่ไม่มีอากาศ" (was L12b); retime to the new take (est G1498–≈1600; L13 onset ≈ G1513). Picture: show the urge before the line names it: a small chest lift with lips closed (CL01 echo, in the ≈ 15 f silent beat before the onset), CREW's glove tightens, her shoulders drop on "แต่…". No breath-in or puffed cheeks (still vacuum; safety limits) |
| S01-B05-SH04 | Line becomes L13b "สิ่งที่ช่วยปอดคุณ คือหายใจออก"; retime (est ≈ 1600–≈1684, ~84 f vs 104); expression keys re-placed on "หายใจออก"; re-check head ≤ 340 px with the shorter push; stinger after the new voiced end |
| S01-B05-SH05 | Content unchanged; starts ≈ 12 f earlier (est total ≈ 1750 f ≈ 58.3 s) |
| All other shots | Unchanged |
| Caption plan | Remove L12b, L12c, L13a, L13b; add L13a "คุณจะอยากกลั้นหายใจไว้…", L13b "แต่ในที่ที่ไม่มีอากาศ", L13c "สิ่งที่ช่วยปอดคุณ คือหายใจออก" (28 → 27 cues) |
| Sound plan | G1482–end rows shift; one last soft heartbeat on "คุณจะอยากกลั้น…" released on "แต่…" (optional, Editor); tag after the new L13 voiced end |
| Storyboard rows | S01-B05-SH03 and SH04 line text change → those two rows need a storyboard verdict |
