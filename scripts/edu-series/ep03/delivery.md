# EDU-EP03-SHORT delivery (ลูกบอลแดง มุมมองหมา, C5)

Delivery record for EP03. Series record: [../delivery.md](../delivery.md); progress: [../task.md](../task.md).

- Deliverable: `EDU-EP03-SHORT`, Short only (Thai), 1080x1920, 30 fps, ending `B_loop` (`endHoldSec 0`).
- Cover: B "ลูกเดียวกัน" (user pick, 2026-11-06), plate B03-SH03 l32.

## W8.1 Assembly (2026-11-06)

`node scripts/render.mjs EDU-EP03-SHORT --timeout=240000` from the pinned cache (15 pins, W7): 0 of 15 segments rendered, 15 reused (no `--repaint`, no pin stop). Log `out/logs/ep03-delivery.log`, render log `out/logs/render-render-2026-11-06T06-13-50-059Z-51a4a113.jsonl`. Render time 28.4 s.

## W8.2 Delivery render (2026-11-06)

- Tag: `1cde4a17fdf3` (clean tree, HEAD 1cde4a1; not `dirty`).
- Store: `~/ReelsStore/projects/edu/EDU/renders/EDU-EP03-SHORT/1cde4a17fdf3/EDU-EP03-SHORT.mp4`
- Cover: `~/ReelsStore/projects/edu/EDU/renders/EDU-EP03-SHORT/1cde4a17fdf3/EDU-EP03-SHORT_cover.png` (copy of `projects/edu/EDU/covers/EDU-EP03-SHORT_cover-B.png`; options A/C stay in `projects/edu/EDU/covers/`).

| Measure | Value |
| --- | --- |
| Video | h264, 1080x1920, 30 fps, 1571 f = 52.367 s |
| Audio | aac, 48 kHz stereo, 52.352 s |
| Loudness | -14.1 LUFS integrated, LRA 5.8 (render.mjs; ffmpeg ebur128 LRA 3.4), true peak -1.4 dBTP (render.mjs dynamic normalisation; was -16.2 LUFS before) |
| Size | 31.2 MB |
| vs Final cut `_final_cut.full.mp4` | whole-video PSNR avg 52.1 dB, min 47.4 dB (same picture) |

Frame check: sheet `out/EDU-EP03-SHORT/w8/delivery-sheet.png` (frames 5, 150, 400, 700, 1000, 1200, 1400, 1565, taken from the archived MP4): flat washes, tag `@TamMaiLa` top-left, Thai captions present, B01-SH02 dog opaque, dog-view shots tinted as in the Final cut. Sound not listened to by anyone; the user listens before W8.3.

Open: W8.3 posting (user), W8.4 kit intake (Boss). Loudness is -14.1 LUFS (EP01 -14.0, EP02 -16.3).

<a id="kit-intake"></a>
## W8.4 Kit intake (KIT-P01, 2026-11-06)

Filed (no source-hash change):
- Plates in `src/painted/kit/plates.ts`, stills in `projects/shared/KIT/plates/`: `PL-EDU-PARK` (shot `EDU3-S01-B01-SH01`, t 1; owner and golden retriever on the sunlit lawn) and `PL-EDU-PARK-DOGVIEW` (`EDU3-S01-B03-SH03`, t 3; the same park in dog colour vision).
- `src/painted/kit/README.md` animals row now names `charge` / `yaw` beside `quarter` / `brake`.

Already in the kit (committed with EP03 before delivery, nothing to file): dog `charge`, `yaw`, `quarter`, `brake` poses and the golden-retriever front view (`animals.ts`), `Outfit.shorts` (`cast.ts`, `back.ts`), cap gear.

Deferred as patch: outfit `park-casual` (`man-crop` base: mustard tee, denim knee shorts with sock, white sneakers, blue cap) into `WARDROBE` + `WARDROBE_INFO` + KIT-WARDROBE sheet. `edu01/cast.ts` imports `wardrobe.ts`, so filing it moves EP01's source hash (`6beaea...` to `850261...`). Patch: `projects/shared/KIT/intake/2026-11-06_park-casual-wardrobe.patch` (`git apply`; with it applied `tests/wardrobe.test.ts` and `tests/casting.test.ts` pass 20/20). It is against HEAD, so it conflicts with the kitchen-apron patch on the `OUTFIT_IDS`, `WARDROBE_INFO` and `WARD_WHO` lines: apply one, then hand-merge the other. The cream sling bag is not filed (painted overlay `paintSlingBag`, not a `Gear` kind; a Gear kind would touch `cast.ts` and move every hash).

N/A: dog-view colour matrix (`dogview.ts`, `dogMatrixAt`) and the park set code (`park.ts`) stay in the episode (ENV-P01: a finished set is never promoted, an effect moves on its second use); `PARK_LIGHT` is scene lighting; no new person (owner is `man-crop`, dog `dog-golden`); no new `MOTIONS` or `animalMotion` entry (skid, charge and puzzled head are per-shot `AnimalPose` fields).

Hashes (`sourceHash` over each video, before and after the plates change, `out/logs/ep03-hash-before.txt` / `-after.txt`): EP01 `6beaeafda72a...`, EP02 `70455db7c564...`, EP03 `c4d4fd38282b...`, identical.

Update 2026-11-06 (user "เก็บทั้งคู่"): the deferred outfit `park-casual` is now filed (patch `projects/shared/KIT/intake/2026-11-06_park-casual-wardrobe.patch`, applied after kitchen-apron with the three conflicting lines hand-merged, both outfits listed). EP01 source hash `6beaeafd...` -> `63498f36...` (sourceHash, `out/logs/kit-wardrobe-hash-before.txt` / `-after.txt`); EP02 `70455db7c564...` and EP03 `c4d4fd38282b...` unchanged. EP01's archived delivery render (store `projects/edu/EDU/renders/EDU-EP01-SHORT/4996d9c4bdb5`) is now from an older source hash; its pixels do not change and it was not re-rendered. The sling bag stays unfiled. Checks: wardrobe + casting 20/20, `npm test` 490/490, `scripts/context-map.py` 0 problems, KIT-WARDROBE sheet viewed (`out/kit-wardrobe-intake/KIT-WARDROBE.png`). W8.4 closed.

## W9 Closing music (Editor, 2026-11-06, user: "at the end there should be a closing music, like EP02 has")

EP02 closes with the library file `sfx/stinger/stinger_pizz-tag-ending_01` (pizzicato and marimba tag, 2.5 s; raw `edu2-pizz-tag_v2`) from c1726, the last word's end, peak -10 dB, 1.4 s + 0.6 s fade under its `A_fade`; bed stays under. EP03 now places the same file at c1482 (last word ends c1481 = 49.365 s), 2.2 s, 0.5 s fade, done by c1548 (sheet: nothing starts after c1556; the hard restart at c0 hears no ring). Audio only: picture, frames, ending `B_loop`, `endHoldSec 0` and the 15 pins unchanged; 15 of 15 segments reused.
- Stem: store `projects/edu/EDU/audio/w9-sound-ep03-close/EDU-EP03-SHORT-sound-stem-v1.wav` (same file name; lock `src/videos/edu-ep03/assets.lock.json` replaced via `store.py use --replace`). Stem differs from W5.3 only from 49.40 s (measured, 0.0 before). Stem peak -1.55 dBFS unchanged.
- Delivery: `projects/edu/EDU/renders/EDU-EP03-SHORT/e1de32b4645b-dirty-202611061337/EDU-EP03-SHORT.mp4` (dirty tag: uncommitted tree; re-render after commit for a clean tag). 1571 f, 52.367 s. Loudness -14.0 LUFS (ebur128), true peak -1.4 dBTP (render.mjs: -14.2 LUFS), no clipping. Tail 0.25 s RMS from 49.4 s: -19, -20, -21, -20 dBFS (narration before it -18/-19), so the tag sits at narration level as in EP02; last-word window unchanged. Images: `out/EDU-EP03-SHORT/w9/compare-tails.png` (EP02, EP03 before, EP03 after; spectrogram + waveform of the last 6 s).
- Not listened to by anyone. Previous delivery `1cde4a17fdf3` is superseded for sound only.

## W10 Closing fade (Editor, 2026-11-06, user: the bird and ambience of the original clip should also fade to zero as the clip ends)

All non-narration layers except the closing tag fade from c1482 to exact zero at c1571 (dB = -90 t^1.5). Stem: store `projects/edu/EDU/audio/w10-sound-ep03-fade/EDU-EP03-SHORT-sound-stem-v1.wav`; lock replaced. Stem RMS 0.25 s windows: 51.0 s -55, 51.25 -70, 51.5 -86, 52.0 -106, 52.25 -127 dBFS; last 0.3 s peak -97 dBFS; difference to the W9 stem 0.0 before c1482. Picture, length (1571 f), pins and scenes unchanged. Delivery `f6a118f6e668` is superseded for sound only; re-render after commit. Not listened to.
- 2026-11-07 (W8.0 cover redo): user picked **N2-split** "ผ่านตาหมา / บอลคล้ายหญ้า?" (plate `EDU3-S01-B03-SH03 l32`) from the new-approach set `EDU-EP03-SHORT-V2-COVERS` (cover-design skill), replacing the earlier pick. Store: `projects/edu/EDU/renders/EDU-EP03-SHORT/f6a118f6e668/EDU-EP03-SHORT_cover-v2.png` (store files are immutable, so the new pick is `_cover-v2.png`; the old pick stays as `_cover.png`, copy `_cover-v1.png`). Local copy `out/EDU-EP03-SHORT/EDU-EP03-SHORT_cover.png`.
