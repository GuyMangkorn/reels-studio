# ZCONDO build notes (Boss)

## 2026-10-29 Boss stage, `claude/zcondo-boss-plates` (sheets `ZCONDO-SHORT-SS-R2.4`, brief `VB-ZCONDO-SHORT-R3.3`)

- Blender 5.2 headless via `/Applications/Blender.app/Contents/MacOS/Blender -b --python assets/blender/zc-unit/build_sp02.py -- <cmd>` (Blender MCP connected but only a default scene; not used). Logs: `out/logs/zc-sp02-*.log`.
- Item 1 cabinet 1.20 m: already in `build_sp02.py` (`CAB_H`, commit `fb91df3`); `geometry` re-run: cabinet y [0.18, 0.58], gap to door wall 0, no cap overlap.
- Item 2/3 on the **rigged** `zc-you`: blocked, no rig or armature exists (`zc_you()` in `assets/blender/zc-corridor/build.py` is primitives; `rg armature` finds none). Measurements below are on that placeholder: B10-SH01 face box x 238–395 / y 438–629 at c0 (inside 220–420 / 420–650), x 229–398 / y 436–630 at c245; lead 1411 / 1436 px; plain band and door centre line fully visible; no bag vertex visible (blocked by `zc-unit_p1`). B09 seated lead 506 px (>= 480, accepted 502–506), floor/wall penetration 0.
- Item 4 B09-SH01 y 0.78: still rendered, floor line y 860, vFOV 11.42 deg, lead y 317–824. Item 5 B07-SH02 `CAM-SECTION-LL` truck: existing 60-frame truck (`out/blender/zc-unit/sp02/truck`), B07-SH02 still lead 552 px, seat penetration 0.0245 m (blockout sofa, not a final contact).
- Item 6 plates S-02…S-10: not started. Each needs the rigged `zc-you` / day-3 character (S-03/S-04), final sets and props (S-05…S-07), overlays (S-08) and captions (S-09) that do not exist yet. Proposal: Boss builds the `zc-you` armature and pose tracks first (character-toolkit), then plates per sequence in a separate stage.
- Proposal for rule documents (not edited): the delivery record's "rigged `zc-you`" wording presumes a rig; add a rig dependency row to the index so the re-measure is not scheduled before S-03.
- Evidence: `out/qa/zombie-condo/sp02/contact-boss-recheck.png` (B09-SH01, B07-SH02, B10-SH01 c0, c245).
