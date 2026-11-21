# Edu channel: category index (สารบัญหมวด)

**Status:** Default for the [edu channel](channel.md) (user, 17 Nov 2026: "เอาหมวดไปจดเป็นสารบัญ … ตอนให้แพรวหา ให้แพรวโชว์สารบัญให้ผมเลือกก่อน"). Preaw keeps this file. The IDs `CAT01`… are stable; a new category takes the next free ID.

Source: the tier-list image the user attached on 17 Nov 2026 (asset store `projects/edu/_ideation/references/user/2026-11-17_content-subject-tier-list.jpg`). Its tiers (GOD > HIGH > MID > LOW) measure revenue per view (RPM), not fit with this channel. The **Tier** column is the category's highest subject tier; each subject's own tier is in brackets. Concept files name their category ID ([ER08](script.md#edu-short-retention)).

<a id="category-pick"></a>
## Category pick before pitching

**Default (user, 17 Nov 2026).** Every edu [ideation round](../../docs/delivery-workflow.md#ideation) starts with a category pick, unless the user's prompt already names a category or a concept. Under the [fast lane](../../docs/delivery-workflow.md#fast-lane) the last recorded pick stands for the next round without the question; the concept question offers "other categories".

1. The coordinator shows the table below in the reply, with Preaw's ER11 note per row, then asks with the structured-question tool, each option's description giving its tier. The tool takes at most four options: offer the four categories with the best ER11 fit that the latest rounds have not used, the first marked recommended; "Other" takes any ID from the table or a new category.
2. The pick (one or more IDs, the user's words, date) goes in the series `delivery.md` with the round ID.
3. Preaw pitches the round's concepts only inside the picked categories and names the ID in each concept file and in the [concepts index](../../scripts/edu-series/concepts/index.md) row's title cell suffix, e.g. `… (CAT05)`.

## Categories

| ID | Tier | Category | หมวด | Subjects in the source (tier) | ER11 note (story-led mix) |
| --- | --- | --- | --- | --- | --- |
| CAT01 | HIGH | Science | วิทยาศาสตร์ / อวกาศ / AI | Space Mysteries, AI and Robotics (HIGH) | Strong: "ถ้า…" premises carry a true mechanism well (EP05 shape) |
| CAT02 | HIGH | History | ประวัติศาสตร์ | Historical Mysteries, Lost Civilizations (HIGH); Daily Life in History (LOW) | Good: an invented character in a real period; facts must be solid, no invented events presented as real |
| CAT03 | MID | Geography | ภูมิศาสตร์ / สถานที่สุดขั้ว | Megaprojects, Extreme Places (MID); Strange Laws, Cultural Mysteries (LOW) | Good: "สมมุติว่าคุณไปอยู่…" with one true fact about the place |
| CAT04 | GOD | Psychology | จิตวิทยา | Dark Psychology, Manipulation Tactics (GOD); Personality Types, MBTI (LOW) | Fair: keep to well-supported effects; no how-to manipulation; MBTI has weak evidence |
| CAT05 | GOD | Business | ธุรกิจ / เงิน | Billionaire Psychology, Business Failures (GOD) | Fair: invented company or person; a real case only as a fact line, never a made-up story about real people |
| CAT06 | HIGH | Mythology | ตำนาน / สัตว์ในตำนาน | Greek and Norse Mythology, Legendary Creatures (HIGH) | Strong: the myth is the story; the fact is what the real world says about it |
| CAT07 | HIGH | Sports | กีฬา | Rise and Fall, Sports Scandals (HIGH); Athlete Psychology, Underdog Stories (MID) | Fair: body and physics facts fit; scandals involve real people, fact lines only |
| CAT08 | GOD | True Crime | คดีจริง / จิตวิทยาอาชญากร | Serial Killers, Criminal Psychology (GOD) | Weak: real victims and people; no invented story; fact lines only and handled with care |
| CAT09 | MID | Self Improvement | พัฒนาตัวเอง | Discipline, Habits, Mental Toughness (MID) | Fair: story of a character changing a habit; one fact with real evidence, no tips list (ER07) |
| CAT10 | MID | Philosophy | ปรัชญา | Stoicism, Ancient Wisdom (MID); Ethics, Meaning of Life (LOW) | Fair: a thought experiment ("ถ้า…") is a natural story; the fact is a true historical or research point |
