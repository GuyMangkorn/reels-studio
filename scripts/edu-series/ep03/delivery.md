# EDU-EP03-SHORT delivery (ลูกบอลแดง มุมมองหมา, C5)

Delivery record for EP03. Series record: [../delivery.md](../delivery.md); progress: [../task.md](../task.md).

- Deliverable: `EDU-EP03-SHORT`, Short only (Thai), 1080x1920, 30 fps, ending `B_loop` (`endHoldSec 0`).
- Cover: B "ลูกเดียวกัน" (user pick, 2026-11-06), plate B03-SH03 l32.

## W8.1 Assembly (2026-11-06)

`node scripts/render.mjs EDU-EP03-SHORT --timeout=240000` from the pinned cache (15 pins, W7): 0 of 15 segments rendered, 15 reused (no `--repaint`, no pin stop). Log `out/logs/ep03-delivery.log`, render log `out/logs/render-render-2026-11-06T06-13-50-059Z-51a4a113.jsonl`. Render time 28.4 s.

## W8.2 Delivery render (2026-11-06)

- Tag: `1cde4a17fdf3` (clean tree, HEAD 1cde4a1; not `dirty`).
- Store: `~/ReelsStore/projects/EDU/renders/EDU-EP03-SHORT/1cde4a17fdf3/EDU-EP03-SHORT.mp4`
- Cover: `~/ReelsStore/projects/EDU/renders/EDU-EP03-SHORT/1cde4a17fdf3/EDU-EP03-SHORT_cover.png` (copy of `projects/EDU/covers/EDU-EP03-SHORT_cover-B.png`; options A/C stay in `projects/EDU/covers/`).

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
- Plates in `src/painted/kit/plates.ts`, stills in `projects/KIT/plates/`: `PL-EDU-PARK` (shot `EDU3-S01-B01-SH01`, t 1; owner and golden retriever on the sunlit lawn) and `PL-EDU-PARK-DOGVIEW` (`EDU3-S01-B03-SH03`, t 3; the same park in dog colour vision).
- `src/painted/kit/README.md` animals row now names `charge` / `yaw` beside `quarter` / `brake`.

Already in the kit (committed with EP03 before delivery, nothing to file): dog `charge`, `yaw`, `quarter`, `brake` poses and the golden-retriever front view (`animals.ts`), `Outfit.shorts` (`cast.ts`, `back.ts`), cap gear.

Deferred as patch: outfit `park-casual` (`man-crop` base: mustard tee, denim knee shorts with sock, white sneakers, blue cap) into `WARDROBE` + `WARDROBE_INFO` + KIT-WARDROBE sheet. `edu01/cast.ts` imports `wardrobe.ts`, so filing it moves EP01's source hash (`6beaea...` to `850261...`). Patch: `projects/KIT/intake/2026-11-06_park-casual-wardrobe.patch` (`git apply`; with it applied `tests/wardrobe.test.ts` and `tests/casting.test.ts` pass 20/20). It is against HEAD, so it conflicts with the kitchen-apron patch on the `OUTFIT_IDS`, `WARDROBE_INFO` and `WARD_WHO` lines: apply one, then hand-merge the other. The cream sling bag is not filed (painted overlay `paintSlingBag`, not a `Gear` kind; a Gear kind would touch `cast.ts` and move every hash).

N/A: dog-view colour matrix (`dogview.ts`, `dogMatrixAt`) and the park set code (`park.ts`) stay in the episode (ENV-P01: a finished set is never promoted, an effect moves on its second use); `PARK_LIGHT` is scene lighting; no new person (owner is `man-crop`, dog `dog-golden`); no new `MOTIONS` or `animalMotion` entry (skid, charge and puzzled head are per-shot `AnimalPose` fields).

Hashes (`sourceHash` over each video, before and after the plates change, `out/logs/ep03-hash-before.txt` / `-after.txt`): EP01 `6beaeafda72a...`, EP02 `70455db7c564...`, EP03 `c4d4fd38282b...`, identical.
