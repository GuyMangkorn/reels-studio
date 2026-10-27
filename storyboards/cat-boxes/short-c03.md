# CATBOX C03 Short S01 — แมวในกล่องกำลังซุ่มอยู่ไหม?

**27 October 2026 handoff migration:** Drawings are retired; this written source retains its timing and stable IDs. Current handoff status: `needs-input` until Mark audits coordinate/anchor/camera details against the [written-handoff migration](handoff-migration.md). Earlier readiness/BOARD/Pxx labels below are historical provenance. This edit creates no element captures, scene samples or new runtime/visual/audio approval.


Revision 1 · ready-for-dev storyboard handoff · script approval pending
Script: scripts/cat-boxes/ch03-script.md R4 · Boat: FC-R4
Film brief: visual-brief.md VB-CATBOX-R5 / VS03 · FC-VIS-R1 is planning-only, not runtime visual approval
Cut: 45s estimated · 30 fps · 1,350 frames · 1080×1920 portrait only

## Purpose and boundaries

Open on an explicitly fictional toy chase, separate observed play from a possible motive, demonstrate actual occlusion, then return to the owner’s revised note. CL04’s action-versus-cause distinction is restaged self-contained; the Short does not require the Long chapter.

Home uses the shared fixed-plane orthographic stage: BOX-OLD floor origin, +X right, +Y up, +Z toward viewer. CATBOX-METER-R2 dimensions are production estimates, not factual measurements: owner 1.70m and Mochi 0.2833m standing for a 6:1 canonical height ratio. Keep actor/box/toy proportions, floor anchors, shadow and occlusion; frame Mochi at least 25% of portrait height without rig inflation.

**R5 corrective staging:** keep the same `CatboxRoom` visible through all four beats; overlay the inference/geometry cards instead of cutting to a full-frame panel. Keep Mochi visible in the middle scenes. In SH01, preserve the crop with the muzzle fully inside frame; the toy starts at the box's chest line, moves into the front paw, and stays at paw contact through F239. VO and subtitle strings remain unchanged.

## Shot map

| New Short shot / panels | Source beat | Short frames | Existing Long source shots | Claims / clues | Retiming |
|---|---|---:|---|---|---|
| CATBOX-C03-SHORT-S01-SH01 / P01-P02 | CATBOX-C03-S01-B01 | [0,240) | CATBOX-C03-S01-SH01 | F012 / none | Toy crosses before the fictional pounce |
| CATBOX-C03-SHORT-S01-SH02 / P01-P02 | CATBOX-C03-S01-B02 | [240,630) | CATBOX-C03-S01-SH02/SH03 | F008, F012 / CL04 echoed self-contained | Separate play from possible motive |
| CATBOX-C03-SHORT-S01-SH03 / P01-P02 | CATBOX-C03-S01-B03 | [630,990) | CATBOX-C03-S02-SH01/SH03 | F011 / none | Show concealment physically |
| CATBOX-C03-SHORT-S01-SH04 / P01-P02 | CATBOX-C03-S01-B04 | [990,1350) | CATBOX-C03-S02-SH04 | F008, F011, F012 / CL04 payoff | Leave entry reason unknown |

VO/subtitles remain verbatim in source beats. Proposed P02 anchors: F150, F480, F840 and F1260. The pounce must happen within B01’s eight-second source interval; its exact frame is a visual proposal, not an audio cue.

## Shot direction

### SH01 — Fiction label before the action

At F0, label “เรื่องสมมติ.” Mochi sits in BOX-OLD; the toy crosses before Mochi pounces. The owner’s “ฐานล่า” appears as a guess. Keep a shared ground line and visible paw/toy contact shadow.

### SH02 — What happened, and what is guessed?

Show “ย่อง → ไล่ → พุ่ง” on a generic behavior strip, separate from a dotted arrow ending at “เข้าไปเพื่อซุ่ม?” The behavior is not evidence of this fictional cat’s motive. Keep “สมมติฐาน” beside the motive.

### SH03 — Demonstrate hiding, not motive

Two same-size schematic targets: a real box wall occludes one; the flat outline does not. Label “ภาพอธิบาย.” Do not portray this as an experiment or prove why a cat entered.

### SH04 — The note changes

Mochi settles. Separate “เห็น: พุ่งตามของเล่น” from “ยังไม่รู้: เหตุที่เข้าไป.” A possible ambush explanation remains a hypothesis. No answer sound or new reveal.

## Shared assets and acceptance

Reuse CAT-2D, BOX-OLD, CATBOX-TOY, CatboxRoom and the integrated orthographic projection. Keep the toy in the foreground at the cat's paw contact point. Frame-sampled toy motion and the visual-stage dispatch are implemented. DF-20261026-subpixel-stage-projection applies to this portrait crop; Studio seeking remains separately unverified under DF-20261026-studio-emfile.

## Current implementation and CLI evidence

CATBOX-C03-Short is registered in Root from short-c03.json. Final full-cut CLI QA refresh: 2026-10-26T17:41:12.521Z at 1080×1920 / 30 fps, 1,350 frames. The [Short runtime section](index.md#boss-short-runtime-and-qa-evidence) and [final QA manifest](../../out/qa/cat-boxes/shorts-r1/manifest.json) link the [A-fade preview](../../out/qa/cat-boxes/shorts-r1/C03/CATBOX-C03-Short_A_fade-preview.mp4), [C03 one-second/final sheet](../../out/qa/cat-boxes/shorts-r1/contact-sheets/C03-one-second-01.svg), [C03 critical-boundary sheet](../../out/qa/cat-boxes/shorts-r1/contact-sheets/C03-critical-01.svg), and [decoded F59/F60/F61 status check](../../out/qa/cat-boxes/shorts-r1/C03/playback-check/). The final refresh retains the fiction status around the toy-pursuit beat.

Studio playback/seek remains unverified. Narration/subtitle sync remains unverified because no Short-specific audio exists. Runtime factual-image review by Boat remains unverified; FC-VIS-R1 is planning-only. Short script approval is pending. Long framing and QA are deferred; Long source boards and timeline remain unchanged.

## Exact source VO, subtitles and audio status

Short-specific narration and SFX have not been recorded or supplied. VO timing, subtitle timing and SFX are unverified; the general narration preview is not Short audio evidence.

### CATBOX-C03-SHORT-S01-SH01 · CATBOX-C03-S01-B01 · 0–8s
VO (verbatim): “นั่งพัก หรือรอพุ่ง? ในเรื่องนี้ โมจินั่งในกล่อง. พอของเล่นผ่าน เขาก็พุ่งตาม. เจ้าของรีบจดว่า กล่องคือฐานล่า.”
Thai subtitle (verbatim, phrase order retained): “นั่งพัก หรือรอพุ่ง?” / “เรื่องสมมติ: เจ้าของรีบสรุป”
Audio: no Short-specific recording or approved SFX; synchronization unverified.

### CATBOX-C03-SHORT-S01-SH02 · CATBOX-C03-S01-B02 · 8–21s
VO (verbatim): “แมวย่อง ไล่ และพุ่งจริง. กล่องก็อาจเป็นที่ซุ่มเล่นได้. แต่เราเห็นแค่ตอนพุ่ง. ยังไม่รู้ว่าเขาเข้ามาเพื่อซุ่ม หรือมีเหตุอื่นก่อน.”
Thai subtitle (verbatim, phrase order retained): “ย่อง / ไล่ / พุ่ง พบจริง” / “เข้าไปเพื่อซุ่ม: ยังเป็นสมมติฐาน”
Audio: no Short-specific recording or approved SFX; synchronization unverified.

### CATBOX-C03-SHORT-S01-SH03 · CATBOX-C03-S01-B03 · 21–33s
VO (verbatim): “กล่องที่ใช้หลบมีส่วนบังตัว. กรอบแบนบนพื้นมีแค่ขอบให้เห็น. สิ่งของชิ้นเดียวอาจมีหลายหน้าที่. การพุ่งครั้งนี้ไม่ได้อธิบายทุกครั้งที่แมวนั่งนิ่ง.”
Thai subtitle (verbatim, phrase order retained): “ที่หลบจริงมีส่วนบังตัว” / “ครั้งที่พุ่ง ไม่อธิบายทุกครั้งที่นิ่ง”
Audio: no Short-specific recording or approved SFX; synchronization unverified.

### CATBOX-C03-SHORT-S01-SH04 · CATBOX-C03-S01-B04 · 33–45s
VO (verbatim): “เจ้าของเลยแก้โน้ตใหม่. เขาเห็นว่าโมจิพุ่งตามของเล่น. แต่ตอนเข้าไป เขายังไม่รู้ว่าเพราะอะไร. กล่องอาจเป็นที่ซุ่ม. แต่ยังปิดคดีทุกครั้งที่แมวนั่งไม่ได้.”
Thai subtitle (verbatim, phrase order retained): “เห็นการกระทำ / ยังไม่รู้เหตุที่เข้าไป”
Audio: no Short-specific recording or approved SFX; synchronization unverified.

## Per-shot entry/exit boundary states

All frame numbers are Short-composition-local at 30 fps. Each state must be authored so direct seeking reproduces it without React state from the preceding shot.
| Shot | Entry state | Exit / next-cut state |
|---|---|---|
| CATBOX-C03-SHORT-S01-SH01 | F0: home stage; Mochi sits in the old box at its seat anchor, toy is offscreen left, owner’s fiction label is visible. | F239: toy finishes its arc from chest height into the floor contact area under Mochi’s forepaw; owner’s “ฐานล่า” note is visibly a guess. |
| CATBOX-C03-SHORT-S01-SH02 | F240: keep the living-room stage and Mochi visible; the play strip and unknown-motive arrow are screen-space overlays. | F629: observed play and unknown motive hold as overlaid evidence; cat, owner, box and room remain in continuity. |
| CATBOX-C03-SHORT-S01-SH03 | F630: keep Mochi in the home stage beneath an equal-size schematic target comparison overlay; labels say diagram, not a test. | F989: the wall/flat-outline comparison remains an overlay; the home axis continues into the next cut. |
| CATBOX-C03-SHORT-S01-SH04 | F990: return to the same home axis and actor identity; toy is stopped, Mochi returns to the old box, owner’s note is editable. | F1349: Mochi is seated at the box contact anchor; note separates observed pounce from unknown entry reason. |
