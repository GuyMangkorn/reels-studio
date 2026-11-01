# KSO-EP01-SHORT voice lock: phrase anchors (align-full index)

Input for `scripts/narration/align-full.py --index`. Row format: `| anchor | phrase | estOn ms | estEnd ms |`. Anchor IDs carry the read group (`B01`, `B02`, `B04`–`B06`, see `tts-beats.json`; `B03` removed in KSO-SCRIPT-R2, KSO-A09); the measure file maps each anchor to its script beat and a stable `KSO-A` ID. estOn/estEnd are Preaw's beat estimates (KSO-SCRIPT-R1 beat headers), for the report only. Anchors inside one group must stay in script order. KSO-SCRIPT-R3 (1 Nov 2026): B06 rows follow the R3 text; the two new tail phrases are B06-a3 and B06-a4, so the old B06-a3 (ขอโทษนะ) and B06-a4 (ที่เล่าให้ฟัง) are now B06-a5 and B06-a6 (KSO IDs KSO-A16 and KSO-A17 unchanged, mapped in the measure writer). The B06-a3/a4 estimates are Editor placeholders for the report only; measured values are in the measure file.

| Anchor | Phrase | estOn | estEnd |
| --- | --- | --- | --- |
| `B01-a1` | อย่าเพิ่งตอบ | 0 | 3500 |
| `B01-a2` | ฟังให้จบก่อน | 0 | 3500 |
| `B01-a3` | คืนนั้นก่อนเลิกงาน | 3500 | 13000 |
| `B01-a4` | เหมือนคนที่เพิ่งโล่งใจ | 3500 | 13000 |
| `B01-a5` | ฉันเดินกลับห้องคนเดียว | 13000 | 24000 |
| `B01-a6` | ฉันหยุด มันก็หยุด | 13000 | 24000 |
| `B01-a7` | ยืนรอฉันอยู่ | 13000 | 24000 |
| `B02-a1` | ฉันไม่ตอบ | 24000 | 31000 |
| `B04-a1` | เธอดึงหน้ากากลง | 31000 | 41000 |
| `B04-a2` | ปากของเธอ | 31000 | 41000 |
| `B04-a3` | ไปถึงหู | 31000 | 41000 |
| `B05-a1` | ก็ ธรรมดา | 31000 | 41000 |
| `B06-a1` | เธอนิ่งไป | 41000 | 46500 |
| `B06-a2` | ว่าทำไมเพื่อนถึงโล่งใจ | 41000 | 46500 |
| `B06-a3` | เพราะใครที่ได้ฟังเรื่องนี้ | 46500 | 48500 |
| `B06-a4` | เธอจะไปหาคนนั้น | 48500 | 50000 |
| `B06-a5` | ขอโทษนะ | 46500 | 50000 |
| `B06-a6` | ที่เล่าให้ฟัง | 46500 | 50000 |
