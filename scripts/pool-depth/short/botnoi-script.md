# POOLDEPTH-SHORT narration text for external TTS (Botnoi)

**Source:** `short/script.md` `POOLDEPTH-SHORT-R2` (user-approved wording, fact-check R2). Text below is exactly the spoken text already used for the Niwat render, in `narration-timeline.json`. Do not change the words: the factual review covers this wording.

**Generate 6 separate audio files, one per beat** (B01..B06). Per-beat files keep the captions and the fixed Blender shot windows aligned; the Editor places each file at its slot.

| File | Text (speak exactly) | Max speech length | Notes |
| --- | --- | --- | --- |
| `B01.mp3` | ดูตื้นแค่เข่า... จริงเหรอ? เด็กคนนี้กำลังจะกระโดดลงไป. | 4.5 s | Slot 6 s. Ends on a rising/open feel; it is a dramatization, no stress on "กระโดดลงไป". |
| `B02.mp3` | เพราะแสงจากก้นสระโค้งงอตอนออกจากน้ำสู่อากาศ. แต่สมองเราตีความว่าแสงเดินเป็นเส้นตรง. ภาพของก้นสระเลยถูกยกให้สูงขึ้น. | 9.0 s | Slot 10 s. Keep "แสงเดินเป็นเส้นตรง" in one breath. |
| `B03.mp3` | ลองดูได้เลย. วางเหรียญไว้ก้นแก้วทึบ ถอยจนขอบแก้วบังเหรียญพอดี อย่าขยับหัว แล้วค่อยเทน้ำเบา ๆ. ภาพของเหรียญลอยขึ้นมาให้เห็น ทั้งที่เหรียญไม่ได้ขยับเลย. | 9.4 s | Slot 10 s, tightest with B05. No pause inside "ถอยจนขอบแก้วบังเหรียญพอดี" or before "ค่อยเท"; a short natural pause is fine after "เบา ๆ". |
| `B04.mp3` | น้ำมีดัชนีหักเหประมาณหนึ่งจุดสามสาม. ถ้ามองตรงลงมา ความลึกที่เห็นจะประมาณสามในสี่ของความลึกจริง. น้ำลึกสองเมตร ดูเหมือนราวหนึ่งเมตรครึ่ง. ส่วนถ้ามองเฉียง ยิ่งดูตื้นลงไปอีก. | 10.5 s | Slot 12 s. Read the numbers as written: หนึ่งจุดสามสาม, สามในสี่, สองเมตร, หนึ่งเมตรครึ่ง. "ถ้ามองตรงลงมา" must stay one phrase (no break inside). |
| `B05.mp3` | ดังนั้น อย่าเดาความลึกด้วยตา. ดูป้ายบอกความลึก ครั้งแรกที่ลงน้ำ ให้ลงเท้าก่อน. และอย่าพุ่งหัวลงน้ำตื้น น้ำที่ไม่รู้ความลึก หรือมีป้ายห้ามดำ. | 8.0 s | Slot 9 s, very tight. Calm, advisory tone, not a command-style warning. |
| `B06.mp3` | แล้วน้ำตรงหน้าคุณตอนนี้... | 1.7 s | Trailing "..." is a loop line: it must flow into the opening "ดูตื้นแค่เข่า... จริงเหรอ?" as one sentence on replay, so leave the end open and unresolved; keep the same voice, pace and pitch as B01. |

**Delivery guide for the voice:** friendly Thai explainer, calm and clear, medium pace (about 5 syllables/s as in the Niwat render +5%), no dramatic music-trailer tone. B01 and B06 should sound like the same speaker with the same energy so the loop reads as one sentence.

**Technical:** MP3 or WAV, mono or stereo, no background music, no leading/trailing silence beyond ~0.1 s. If a file runs longer than the "Max speech length" above, ask Botnoi for a slightly faster speed rather than editing words; the video windows cannot stretch.

**Bring back:** put the 6 files in `public/narration/botnoi/` (e.g. `B01.mp3`..`B06.mp3`) and tell me; Editor will place them, measure real gaps/durations and retime the captions. Record the Botnoi voice name and license terms for the delivery record (voice licensing is a production requirement).
