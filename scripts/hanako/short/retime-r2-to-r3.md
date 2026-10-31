# HANAKO-SHORT retime: R2 basis (voice lock v2) → R3 basis (voice lock v3)

**Status:** input for Mark's next scene-sheet revision (`SCENE-R3`, Mark to issue). Editor, 31 Oct 2026. The scene sheet is not edited by this table; `SCENE-R2` stays as it is. Beat timing is `audio-measured` by proxy and **not heard** (`not_verified_by_ear`).

**Frames:** 30 fps, integer. Timeline frame = track frame + 45 pre-roll. Speech on/off are the 300-threshold edges on the delivered MP3 (see [voice-measure.md](voice-measure.md)).

**Sources**

- Old: `out/hanako-voice/final/lock-v2-s3take1/voice-measure.json` (basis of `SCENE-R2`: durationFrames 2552, B09 hold [2462, 2552)).
- New: [voice-measure.json](voice-measure.json) (voice lock v3, S3 tail re-read).

## Totals

| Item | Old (R2 basis) | New (v3) | Change |
| --- | --- | --- | --- |
| Track | 2417 frames (80.567 s) | 2461 frames (82.033 s) | +44 |
| Pre-roll | 45 | 45 | 0 |
| **Timeline total** | **2552** (85.067 s) | **2596** (86.533 s) | +44 |
| **Hold (last 90 frames)** | [2462, 2552) | **[2506, 2596)** | +44 |
| Written pauses (9 gaps) | 72 | 69 | −3 |
| Narrator speech frames | 2325 | 2371 | +46 |
| Margin under the 90 s cap (2700 frames) | 148 frames (4.93 s) | 104 frames (3.47 s) | |

The 90 s cap counts the whole timeline (user decision, 31 Oct 2026).

## Beats (timeline frames, old → new)

| Beat | Slot start | Slot end | Speech on | Speech off | Moved > 3 |
| --- | --- | --- | --- | --- | --- |
| `B01` | 45 → 45 (+0) | 304 → 304 (+0) | 46 → 46 (+0) | 297 → 297 (+0) | no |
| `B02` | 304 → 304 (+0) | 416 → 416 (+0) | 305 → 305 (+0) | 409 → 409 (+0) | no |
| `KA` | 416 → 416 (+0) | 443 → 443 (+0) | 417 → 417 (+0) | 436 → 436 (+0) | no |
| `B03` | 443 → 443 (+0) | 645 → 645 (+0) | 444 → 444 (+0) | 638 → 638 (+0) | no |
| `B04` | 645 → 645 (+0) | 900 → 900 (+0) | 646 → 646 (+0) | 893 → 893 (+0) | no |
| `B05` | 900 → 900 (+0) | 1186 → 1172 (−14) | 901 → 903 (+2) | 1179 → 1170 (−9) | **yes** |
| `B06` | 1186 → 1172 (−14) | 1585 → 1588 (+3) | 1187 → 1173 (−14) | 1578 → 1581 (+3) | **yes** |
| `B07` | 1585 → 1588 (+3) | 2058 → 2054 (−4) | 1586 → 1589 (+3) | 2051 → 2047 (−4) | **yes** |
| `B08` | 2058 → 2054 (−4) | 2294 → 2302 (+8) | 2059 → 2055 (−4) | 2287 → 2295 (+8) | **yes** |
| `B09` | 2294 → 2302 (+8) | 2462 → 2506 (+44) | 2295 → 2303 (+8) | 2462 → 2505 (+43) | **yes** |

**Moved more than 3 frames:** `B05`, `B06`, `B07`, `B08`, `B09` (slot start, slot end, speech on or speech off). **Not moved:** `B01`–`B04` and `KA` (`KA` stays 417–436).

- `B05` speech on moves +2 only (the installed clip starts 2.36 frames later than the build measure, see [voice-measure.md](voice-measure.md)). Its slot end and speech off move, which makes it flagged.
- `B09` speech off: the old recorded value 2462 was 7 frames late. The old read ended at track frame 2410 (timeline 2455) by the energy rule. The new speech off 2505 is +43 against the recorded old value and +50 against the old real end.

## Written pauses (frames)

| Gap | Old | New | Change |
| --- | --- | --- | --- |
| `B01|B02` | 8 | 8 | 0 |
| `B02|KA` | 8 | 8 | 0 |
| `KA|B03` | 8 | 8 | 0 |
| `B03|B04` | 8 | 8 | 0 |
| `B04|B05` | 8 | **10** | +2 |
| `B05|B06` | 8 | **3** | −5 |
| `B06|B07` | 8 | 8 | 0 |
| `B07|B08` | 8 | 8 | 0 |
| `B08|B09` | 8 | 8 | 0 |

`B05|B06` is 3 frames (0.10 s) by the installed-audio 300 threshold. The designed 8 frames holds on the un-gained clips. The B05 tail is a decay at about −49 to −55 dBFS RMS for 0.25 s. Listening point for the user.

## Word anchors, B05–B09 (timeline onset, old → new)

Whisper word estimates, about ±0.2 s. Anchors B01–B04 are unchanged. Old values are from lock v2 (take 1 for B05–B09). `B06-a0` is new in the tail read.

| Anchor | Onset (old → new) | End (old → new) | Moved > 3 | Phrase |
| --- | --- | --- | --- | --- |
| `B05-a1` | 904 → 903 (−1) | 924 → 933 | no | ถ้าเรื่องพวกนี้จริง |
| `B05-a2` | 987 → 1000 (+13) | 1043 → 1065 | **yes** | แต่ยังไม่พบหลักฐานเลย |
| `B05-a3` | 1107 → 1127 (+20) | 1134 → 1160 | **yes** | ต้นเรื่อง |
| `B06-a0` | new | — → 1218 | new | เรื่องฮานาโกะที่เก่าที่สุด |
| `B06-a1` | 1239 → 1246 (+7) | 1264 → 1279 | **yes** | มาจากอิวาเตะ |
| `B06-a2` | 1369 → 1306 (−63) | 1370 → 1375 | **yes** | หนึ่งพันเก้าร้อยสี่สิบแปด (**fallback**) |
| `B06-a3` | 1390 → 1391 (+1) | 1414 → 1413 | no | ไม่ใช่ข่าว |
| `B06-a4` | 1424 → 1430 (+6) | 1495 → 1496 | **yes** | แต่เป็นเรื่องผีที่มีคนเล่าไว้ |
| `B06-a5` | 1538 → 1540 (+2) | 1574 → 1578 | no | หลายสิบปีต่อมา |
| `B07-a1` | 1586 → 1592 (+6) | 1616 → 1626 | **yes** | แล้วเธอดังได้ยังไง |
| `B07-a2` | 1633 → 1656 (+23) | 1640 → 1664 | **yes** | ยุคแปดสิบ |
| `B07-a3` | 1793 → 1809 (+16) | 1860 → 1861 | **yes** | หนึ่งพันเก้าร้อยเก้าสิบ (**fallback**) |
| `B07-a4` | 1888 → 1885 (−3) | 1914 → 1913 | no | ไปทั่วญี่ปุ่น |
| `B07-a5` | 1940 → 1937 (−3) | 1960 → 1973 | no | พอกลางยุคเก้าสิบ |
| `B07-a6` | 2023 → 2022 (−1) | 2044 → 2046 | no | หนังของตัวเอง |
| `B08-a1` | 2059 → 2068 (+9) | 2124 → 2125 | **yes** | ฮานาโกะซังอาจไม่เคยมีตัวตนจริง |
| `B08-a2` | 2124 → 2137 (+13) | 2184 → 2191 | **yes** | แต่เธอก็ไม่เคยหายไป |
| `B08-a3` | 2208 → 2222 (+14) | 2240 → 2257 | **yes** | เด็กรุ่นแล้วรุ่นเล่า |
| `B09-a1` | 2309 → 2347 (+38) | 2367 → 2393 | **yes** | และเธอจะกลับมาอีกครั้ง |
| `B09-a2` | 2386 → 2411 (+25) | 2418 → 2465 | **yes** | ทุกครั้งที่ใครสักคน |
| `B09-a3` | 2432 → 2481 (+49) | 2448 → 2503 | **yes** | ยกมือขึ้นเคาะ |

Anchor `B06-a2` and `B07-a3` are fallbacks (no exact character match in the Whisper words). Their frames are the least certain. The `B06-a2` onset moves 63 frames earlier, which is the largest single change, and it is a fallback. Check its cue against the amplitude file, not against this table.

## Notes for Mark

- `durationFrames` 2552 → **2596**. The hold moves to **[2506, 2596)**.
- Shot ranges that key to the old B05–B09 slot starts need the new starts: for example `B09-SH01` [2294, 2552) → start 2302 (B09 slot start) and hold [2506, 2596).
- `B01`–`B04` and `KA`: no change. Their shots and cues keep the R2 frames.
- Word cues in `B05`–`B09`: retime from the new anchors or the amplitude file. Do not reuse the R2 values.
- Written pauses: `B04|B05` is 10 and `B05|B06` is 3 frames. A shot cut or a reveal set to the old 8-frame gap moves with them.
