# EDU-EP20-SHORT — fix list

## Draft round 1 (SS-R4, 2026-11-16)

One line each: shot · note · owner · status.

- B05-SH03 · Place MUS20-OUTRO `public/audio/stinger/stinger_marimba-outro-falling-open_01.wav` at G1416, gain −6 dB, no automation, to file end (G1532); layer bed (cue sheet) · Editor · done (sound-mix.py, stem v2; B05-END20 bed peak dV 1.6, target 0..8)
- B05-SH03 · Move SFX20-END to G1531 (same file, −6 dB, ends G1589) · Editor · done (accent peak dV −0.6, target −6..3)
- S01 · AMB20 to G1590, 40 f fade-out G1550–1590 (was G1480–1504) · Editor · done (linear amplitude fade)
- B02-SH01 · SFX20-TAP gain −8 → −6 dB (draft stem speech-row dV 21.5 vs re-targeted 12..20; warn, not FAIL) · Editor · done (B02 accent speech dV 19.5, ok)
- B05-SH02 · SFX20-ANSWER stays −9.5 dB (Ton confirms Editor's change; peak row dV 2.6 ok) · Ton · done
- B02/B03 · Accent rows re-targeted from `peak` −6..3 to `speech` 12..20 (0.1 s foley transients; reason in the cue sheet) · Ton · done
- S01 · mix-levels on the SS-R3 draft stems: 0 FAIL; warns: bed/ambience dV 20.2–27.5 under speech (may vanish), B05 background 13.7 (G1405 END over the last word, cleared by the G1531 move). Re-measure after the SS-R4 re-cut (Ton, fresh invocation) · Ton · closed, no gain change: SS-R5 has 0 FAIL; accepted delivery-level warnings per [delivery sound review](delivery-sound-review.md), 2026-11-16. Phone audibility remains unverified.
- S01 · Editor SS-R4 re-cut mix-levels (out/logs/edu20-r4-mix-levels.txt): 0 FAIL; B05 background speech dV 14.1 (warn, within ±2 LU of 15; was 13.7 with END at G1405; cause of the rest not isolated, B05 holds SFX20-ANSWER and MUS20 −6 under L12/L13); bed speech dV 20.9–27.5 "may vanish" in every beat (MUS20 −23 dB plus the −3/−6 automation). Editor did not change MUS20: +3 dB would give about 21–24.5, still above 20 in B02–B05. Ton to decide the MUS20 level (or accept the thin bed as designed) on the re-measure · Ton · closed, no gain change: SS-R5 has 0 FAIL; accepted delivery-level warnings per [delivery sound review](delivery-sound-review.md), 2026-11-16. Phone audibility remains unverified.
- S01 · SS-R5 cue-sheet re-time to narration R2 (total 1619, MUS20 off G1443, OUTRO G1445, END G1560, AMB20 fade 1579–1619; B05 levels windows) · Ton · done (no new generation); the two open mix-levels lines above are re-measured on Editor's SS-R5 stems
