# S02 — the legend (B01 turn, B02 whose tradition, B03 what it is; B04 removed in script R3)
Deliverable: WDG-EP01-SHORT · Revision: WDG-SS-R2.5d · Status: ready-for-dev · Timing: checked-with-audio (locked narration pTIGHT3)
Inputs: `WDG-SCRIPT-R3` S02 (claims F001, F002, F003; `CL05`; F005 and beat `S02-B04` cut) · brief `WDG-BRIEF-FILM-R1.4` (`VD08`, `VD08b`, `VD09a`, `VD10`, `VD10a`, `VD11`, `VD13`; `VD11` retired, see index) · [scene-index.md](scene-index.md) (narrator track at N0 = 1262, `D10`–`D12`, `D15`)
Target: 30 fps · scene frames G [1250, 2108) · 1080×1920
Evidence: runtime unverified · render none · audio sync: phrase times are `silencedetect` (-38 dB) edges plus a faster-whisper word read on the pTIGHT3 file, about ±0.15 s · user approval: look frames approved; sheets not yet reviewed

## Intent and continuity
Before → after: the viewer leaves the fiction → learns it comes from a real tradition of Algonquian-speaking peoples (Ojibwe, Cree) → what the wendigo is (winter, hunger, "an ordinary person can become it"). The antler beat is gone (R3), so the section ends on the callback and cuts straight to the 1879 case. Documentary register: wide, still, pale, no warm light, no horror grammar on real people. Not shown: headdress, war paint, costume, tribal boundary lines, any person.
Previous: `S01-B03-SH05` (cut to black at G1250). Next: `S03-B01-SH01` (hard cut from the storm at G2108).
Lines are NARR (Achernar, pTIGHT3) only, one continuous clip at N0 = 1262; shot cuts sit in the pauses between phrases (a cut is 4–7 frames before the next phrase onset or mid-pause). `G = 1262 + round(narr_s × 30)`; narr_s are energy edges of the locked file (B01 0.336–4.066, B02 4.522–12.223, B03 12.881–27.804).

## Baseline and assets
Index baseline. Dependencies `D10` (storm/flap form), `D11` (lake), `D12` (map), `D15` (SVG layers). `LF-DOC` carries the user's caption-zone relaxation (`VD08b`) for `S02-B01-SH01` only; every other shot here uses the defaults (mean ≤ 0.25, p95 ≤ 0.40).

## Shot map
| Shot | Beat | Range G | Frames / s | Narr s (phrase) | Claims |
| --- | --- | --- | --- | --- | --- |
| `S02-B01-SH01` | B01 | [1250, 1394) | 144 / 4.80 | 0.34–4.04 | turn to the real tradition |
| `S02-B02-SH01` | B02 | [1394, 1642) | 248 / 8.27 | 4.52–12.22 | F001, F002 |
| `S02-B03-SH01` | B03 | [1642, 1900) | 258 / 8.60 | 12.88–21.07 | F003 (spirit/demon of winter and hunger) |
| `S02-B03-SH02` | B03 | [1900, 2108) | 208 / 6.93 | 21.49–27.80 | `CL05` re-read of the fiction |

## S02-B01-SH01 — the real legend
Range and clocks: G [1250, 1394); L = G − 1250.
Direction: wide, eye level, still. Black, then dawn on a boreal lake and forest (`D11`, `LF-DOC` r2), no people. Opens on black so the marker swap and the cut from the cry are hidden.
Camera: scale 1.00 → 1.04, focus (540, 700), ease-in-out over L [0, 144). Picture fade from black: L [12, 57) (G 1262–1307; unchanged from R1).
Chrome: marker `ข้อมูลจริงจากตำนานและประวัติศาสตร์` fades in L [12, 30). Title SVG `WENDIGO / เวนดิโก` centre (540, 330), about 120 px cap height, fades in L [112, 120) on the word `เวนดิโก` (narr 3.34 s = G1362), out L [132, 140) (word ends G1383), gone before the cut.
VO + subtitles: NARR B01. `ความกลัวแบบนี้ มาจากตำนานจริง…` speech G [1272, 1350); `เวนดิโก` G [1362, 1383). Captions: `ความกลัวแบบนี้ มาจากตำนานจริง…` G [1270, 1356); `เวนดิโก` G [1360, 1390).
Sound: L0–L12 near silence (hard stop of the fiction sound at G1250). `MUS-DOC` (`bed_sad-aftermath-ambient_01`) fades in G1350–G1395 after `ตำนานจริง`, calm, not a threat. No wind (optional faint generic winter air far back).
Mix intent: silence, then lift of the calm bed.
Cut: hard cut to `S02-B02-SH01` at G1394 (the narrator's next phrase starts G1398; B01 ends G1384).
Entry → exit: entry black; exit pale dawn, scale 1.04, title gone.
Pace risk: the lake is plain and the shot is 4.8 s, of which 1.9 s are fade-in from black; it is a calm place-setting shot, acceptable at this length. Do not shorten below 4.5 s (the title word ends G1383).
Acceptance:
| Frame | Observable | Evidence |
| --- | --- | --- |
| G1250 | black, no marker of the fiction | frame |
| G1300 | dawn lake, no person, desaturated, no warm light; caption band passes the relaxed check (mean ≤ 0.50, p95 ≤ 0.70) with the real caption | frame sheet + `scripts/caption-zone.py` |
| G1362–G1390 | title and caption legible together | frame sheet |

## S02-B02-SH01 — whose tradition
Range and clocks: G [1394, 1642); L = G − 1394.
Direction: flat map, straight-on (`D12`, `LF-MAP`). Northern North America; soft muted warm-grey highlight (`#b7aa98`) over the Great Lakes band and sub-Arctic Canada only; no tribal boundaries, no icons. **R2.1: map fits x 150–930, y 170–700** (was y 70–830): at y 70 Alaska sat under the marker (y 90–150) and the south of the land under the name card (y 720–800); the W5.2 plate still has both collisions. Highlight stays clear of y 170–230 and y 700+. Land source: stand-in until the user decides `D12a`/`D12b` (index, `Decisions for the user (R2.1)`).
Camera: scale 1.00 → 1.05, focus `MAP_FOCUS` (Great Lakes, ≈ [-84, 45.5] projected), ease-in-out over L [0, 248).
Chrome: name card SVG `Ojibwe: wiindigoo · Cree: wīhtikōw` on a dark pill, centre (540, 760), y 720–800, width ≤ 768 px, below the marker, clear of the highlight and above the caption band. Fades in L [108, 116) (G 1502, first syllable of `อย่างโอจิบเว`), held to the end of the shot (G1642, 134 frames = 4.5 s; the script said about 4 s, so R1's 5.4 s overrun is gone).
VO + subtitles: NARR B02. `เป็นเรื่องเล่าของชนพื้นเมืองกลุ่มภาษาอัลกอนเควียน` speech G [1398, 1496), `อย่างโอจิบเวและครี` [1502, 1557), `ในแคนาดาและทางเหนือของสหรัฐฯ` [1558, 1629). Captions G [1396, 1498), [1500, 1558), [1558, 1634). The join between the last two phrases is cut to 0.05 s in the audio (open question for the user to listen, voice record); captions abut there.
Sound: `MUS-DOC` steady; the card enters with no whoosh; no drums, chant, flute. Optional faint far winter wind.
Mix intent: hold.
Cut: hard cut to `S02-B03-SH01` at G1642 (next phrase starts G1648, 6 frames).
Entry → exit: pale dawn → map; exit map scale 1.05, card on.
Acceptance:
| Frame | Observable | Evidence |
| --- | --- | --- |
| G1510 | card legible, not over the highlight, y 720–800; macron `ī` spelling exact | frame |
| G1641 | no land or highlight in the caption band | caption-zone (defaults) |

## S02-B03-SH01 — winter and hunger
Range and clocks: G [1642, 1900); L = G − 1642.
Direction: wide, eye level, **camera locked** (user-approved storyboard says still; motion lives in the snow). Snow storm over a forest (`D10` storm). Out of the streaks a tall thin dark gap appears and grows with the words (`VD13`, the same form as the flap silhouette; never a clear body; no antlers, no eyes).
Staging: gap visibility `v` 0 on L [0, 90); ramps to 0.5 at L139 (G1781, `ที่กินคน`) and to 0.6 at L233 (G1875, `ยิ่งหิว`), holds 0.6 to L258. (`v = 1` is the full study `LF-WENDIGO-STORM`; 0.6 keeps it glimpsed.) Snow streaks blow throughout (ambient). R2.4: the form only lopes in place here (no jump, no crouch-and-leap; R2.5d: no stepping in place either, it holds the `CRAWL` posture with breath, sway and twitch); it stays, so the exit `v` 0.6 gap and the SH02 entry are unchanged. The ramps are steeper than R1 (same end values over 25 % fewer frames); the gap should still read as growing, not popping.
VO + subtitles: NARR B03 part 1. `ตามความเชื่อ มันคือวิญญาณหรือปีศาจแห่งฤดูหนาวและความหิว` speech G [1648, 1781) (2 lines), `ที่กินคน เล่ากันว่ายิ่งกิน…` [1781, 1861), `ยิ่งหิว` [1875, 1894). Captions G [1646, 1779), [1779, 1865), [1873, 1899).
Sound: `MUS-DOC` thins by 3 dB from G1781; far storm wind under it (very low, generic; `AMB-WIND` stopgap at -18 dB is acceptable here). No stinger.
Mix intent: hold; slight thin on `ยิ่งหิว`.
Cut: hard cut to `S02-B03-SH02` at G1900 (B03 pause G1894–G1907; next phrase starts G1907).
Entry → exit: entry storm only; exit storm with the glimpsed gap (`v` 0.6).
Acceptance:
| Frame | Observable | Evidence |
| --- | --- | --- |
| G1642 | storm only, no shape | frame |
| G1899 | a tall thin dark gap, hunched and long-limbed, not identifiable as a body; no antlers or eyes | frame sheet |

## S02-B03-SH02 — an ordinary person
Range and clocks: G [1900, 2108); L = G − 1900. Reviewed with `SH01` as one continuity unit.
Direction: wide, eye level, same storm plate. The callback: on `คนธรรมดาก็กลายเป็นมันได้` the storm dissolves (inside the canvas) to the flap silhouette in its **end state** from `S01-B03-SH05` (`k` = 1, `FLAP` cx 540, footY 856, scale 1.3, sleeper mound at lower left), holds, then dissolves back to the storm. The gap form fades away afterwards. R2.4 (user: no jumping in place): the callback silhouette (`k` = 1) holds the `CRAWL` posture with breath, sway and twitch (R2.5d: no stepping in place, no leap); in the storm layer the gap form leaves the frame to screen right (same facing as `S01-B03-SH05`; the R2.4 bound is superseded): R2.5d (user dropped the leap): the gap form **crawls slowly out of the frame to screen right** with the same `CRAWL` posture and planted diagonal gait as `S01-B03-SH05` (`STORM_CRAWL`): crawl from L100 (G2000, under the callback dissolve-out; first displaced frame G2001), 0.4 s ease-in to 0.7 h/s (333 px/s at scale 0.85, h ≈ 476 px); the rearmost limb passes the right frame edge (x 1080) at **L172 (G2072, the R2.4 exit frame kept)**, inside the `v` fade (0.6 → 0 on L [116, 190)). Soft, no outline; no tent, sill or drift is in front of the form in the storm plate (conifers behind it, the snow veil and streaks in front), so the tent occlusion does not apply here, soft, no outline; ground contact is a faint soft shadow, the snow kick is lost in the blowing streaks (soft pale puffs). It happens inside the `v` fade (0.6 → 0 on L [116, 190)): `v` is unchanged (0.36 at the launch, 0.17 at L172); then storm only, empty to L208.
Staging: storm layer starts at `v` 0.6. Dissolve in L [48, 63) (G1948–1963, the phrase onset), silhouette holds L [63, 101) (G1963–2001, 38 frames = 1.3 s), dissolve out L [101, 116) (G2001–2016); `v` 0.6 → 0 on L [116, 190); L [190, 208) storm only. The hold is 38 frames against R1's 40 and begins on the phrase onset; do not shorten further (the silhouette must read as the fiction's shape).
Camera: scale 1.00 → 1.03, focus (540, 600), ease-in-out over L [0, 208), applied to both layers.
VO + subtitles: NARR B03 part 2. `และในหลายเรื่องเล่า` speech G [1907, 1938), `คนธรรมดาก็กลายเป็นมันได้` [1948, 2001), `ถ้าปล่อยให้ความหิวหรือความโลภครอบงำ` [2006, 2096). Captions G [1905, 1942), [1946, 2004), [2004, 2102).
Sound: very low swell `FX-SWELL` (`tension_rumble-distant-muffled_01`, not a stinger) at G1942 under `คนธรรมดา…`; out by G2001; `MUS-DOC` thins as in `SH01`; then it falls to -24 dB over G2086–G2108 into the 1879 shot.
Mix intent: lift for the swell, release.
Cut: hard cut to `S03-B01-SH01` at G2108 (B03 ends G2096; the beat-B05 click is at G2116, first word G2125).
Entry → exit: entry storm with the gap; exit storm only (gap gone), era plate follows.
Acceptance:
| Frame | Observable | Evidence |
| --- | --- | --- |
| G1955 / G1980 | mid-dissolve and held silhouette equal the form in `S01-B03-SH05` before its crouch (same shape, same position; R2.5: R2.5d: that shot crawls from G1190, compare with G1186) | frame pair vs G1186 |
| G2001–G2072 | the gap form crawls right (planted diagonal gait, no slide) and is past the right frame edge at G2072, faint, no jump, no stepping in place | frame sequence |
| G2107 | storm only | frame |

## Removed in R2
`S02-B04-SH01` (poster card with antlered skull, G [2282, 2537) in R1), dependency `D13` and decision `VD11` are retired with script beat `S02-B04` (script R3, user cut 2 Nov 2026). Shot ID kept as removed, not reused. The antler-free rule for the fiction and the storm gap stays (no antlers anywhere), no longer tied to F005.

## Dependencies and open items
| Owner | Dependency / acceptance | Status |
| --- | --- | --- |
| Boss | `D10`, `D11`, `D12` (revalidate DF map-land-clip-closure) | see index |
| Editor | `D15` SVG layers; `MUS-DOC`, `FX-SWELL` | see index |

Element captures: look frames only (`LF-DOC`, `LF-MAP`, `LF-WENDIGO`, `LF-WENDIGO-STORM` in the store `look-frames/`). Scene sample proposal: `S02-B03-SH02` G1900–G2108 (the dissolve chain).

## Change log
2 Nov 2026 `WDG-SS-R2` — re-timed to the locked pTIGHT3 narration (52.983 s, mid-sentence pauses cut); `S02-B04-SH01` dropped; shots shrink 15–40 %; name card hold 134 frames. Cut rule: inside the phrase pause, 4–7 frames before the next onset. Earlier `WDG-SS-R1` — first timed sheet.
2 Nov 2026 `WDG-SS-R2.1` — `S02-B02-SH01` map fit changed to x 150-930, y 170-700 (marker and name-card collisions in the W5.2 plate); land source awaits the user's `D12` choice; no timing change.
2 Nov 2026 `WDG-SS-R2.4` — user note: no jumping in place; the wendigo leaps out of the frame. `S02-B03-SH01`: lope only, no leap (gap stays for the SH02 entry); `S02-B03-SH02`: one directed bound out right G2046–G2072 inside the existing `v` fade; the callback silhouette compares with `S01-B03-SH05` G1210, not G1249. Ranges, `v` values and dissolve frames unchanged.
2 Nov 2026 `WDG-SS-R2.5` — shared bound anatomy changed with `S01-B03-SH05` (spider-frog coil, hind-leg push, stretched flight). `S02-B03-SH02`: crouch starts L118 (G2018), coil held L134–146, launch L146 (G2046) and exit by L172 (G2072) unchanged; the callback compares with `S01-B03-SH05` G1180 (that shot now crouches from G1186). No tent in front of the form in the storm plate: the tent occlusion is N/A here. Ranges, `v` values, dissolve frames, narration, captions and audio unchanged.
2 Nov 2026 `WDG-SS-R2.5` (R2.5c, same day, user): snap exit in the storm too (toes off G2049, streak G2050, gone from G2051; launch G2046 unchanged); crawling-arm lope posture and foreshortened coil legs shared with `S01-B03-SH05`.
2 Nov 2026 `WDG-SS-R2.5d` — user dropped the leap. `S02-B03-SH02`: slow crawl out right from G2000 (first moves G2001), past the frame edge at G2072 (kept), `STORM_CRAWL`. `S02-B03-SH01` and the callback silhouette: `CRAWL` posture with breath, sway and twitch, no stepping in place (the R2.3 in-place lope is removed). Callback compares with `S01-B03-SH05` G1186. Fade values, dissolve frames, narration, captions, audio unchanged.
