---
name: caption-size-ep26-default
description: Default caption size for new edu Shorts is the EDU-EP26 size, 71.4 px (scale 1.4 on the 51 px portrait caption), with shorter, more frequent caption cards
type: feedback
updated: 2026-11-21
---

New edu portrait deliverables use the caption size of EDU-EP26 ("the pee episode"): `scale` 1.4 on the shared 51 px portrait caption = **71.4 px**, edu outline unchanged (14 px stroke, halo), safe box x120-888 and bottom edge at or above y1344. Split the narration into more, shorter caption cards than the older 51 px episodes (EP26 went from 38 to 61 cards; widest card 650 px).

**Why:** user request 21 Nov 2026 on EDU-EP31-SHORT: "ขอ font ซับใหญ่หน่อย เอาจาก ep ฉี่ได้ และบันทึกเป็น default font size อาจจะต้องซอยซับถี่ขึ้นนิดนึง". The EP26 values are in `src/painted/edu26/captions26.ts` (`CAPTION_SCALE`) and `scripts/edu-series/ep26/build-notes.md` "Caption redesign".
**How to apply:** Editor sets `CAPTION_SCALE = 1.4` and writes shorter cards for every new edu Short, then checks the longest card against the safe box with `scripts/caption-zone.py`. Existing episodes keep their captions. Film and Boss leave the caption band for 71 px text (about 2 lines x 118 px). This is a user preference only: the written default in `src/scenes/captionLayout.ts` and `docs/production-requirements.md#caption-look` is proposed, not edited (DP01).
