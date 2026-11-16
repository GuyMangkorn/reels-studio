# EP22 — selected-pace length projection

- Revision: **EDU-EP22-TIMING-R1**, Preaw, 2026-11-16 (task W1.4).
- Deliverable: **EDU-EP22-SHORT**; channel `edu`; Short only.
- Exact narration: [script](script.md) **EDU-EP22-SCRIPT-R3**, L01–L16, unchanged. Factual review: [fact-check](fact-check.md) FACT-R3 as cited in the script header. Delivery: [delivery](../delivery.md) **EDU-EP22-DELIVERY-R1**.
- Pace: **Kore x0.95** (x1.00 slowed 5%), user pick "เอา ๆ 0.95" recorded in delivery. A pace pick is not script approval and not a voice lock.
- Calibration: Editor's [VOICE-SAMPLES-R1](voice-samples.md) / [voice-samples.json](voice-samples.json), L01–L02 only, one raw Kore take, exact channel style. No x0.95 measurement is in the JSON; x0.95 is derived by scaling the x1.00 rates by 0.95 (atempo stretches time uniformly, so durations scale by exactly 1/0.95).
- Status: **projection 55.0 s, inside the 40–60 s target, 5.0 s under the ceiling.** Estimated; no full narration has been generated, read aloud or measured. The user asked for no line cuts; this file proposes none.

## Spoken-syllable recount

Manual Thai pronunciation audit (spoken syllables, not words or characters). "ๆ" repeats the syllable aloud; punctuation is silent.

| Line | Spoken syllables | Script table | Authored ellipsis | Boundary after line |
| --- | ---: | ---: | ---: | ---: |
| L01 | 18 | 18 | 1 | 1 |
| L02 | 16 | 16 | 1 | 1 |
| L03 | 8 | 8 | 0 | 1 |
| L04 | **18** | 19 | 1 | 1 |
| L05 | 11 | 11 | 1 | 1 |
| L06 | 14 | 14 | 1 | 1 |
| L07 | 17 | 17 | 0 | 1 |
| L08 | 9 | 9 | 0 | 1 |
| L09 | 9 | 9 | 0 | 1 |
| L10 | 8 | 8 | 0 | 1 |
| L11 | 14 | 14 | 0 | 1 |
| L12 | 10 | 10 | 0 | 1 |
| L13 | 9 | 9 | 0 | 1 |
| L14 | 10 | 10 | 0 | 1 |
| L15 | 10 | 10 | 1 | 1 |
| L16 | 20 | 20 | 1 | 0 |
| **Total** | **201** | 202 | **7** | **15** |

L04 recount: ปู-ยี-กิน-กับ-ข้าว-ที่-ฝั่ง-ไท-เฮา-ส่ง-มา-ต่าง-หาก (13) + ราว-ราว-ยี่-สิบ-จาน (5) = 18, one fewer than the script table. All other lines match. The difference is 0.23 s at x0.95; the 202 figure is kept as a sensitivity row. This is a counting note only; no narration changes, so SCRIPT-R3 and FACT-R3 remain the dependencies. (Correcting the script table's L04 figure is a script-file edit outside this task.)

## Rates at x0.95

Sample: L01–L02, 34 syllables; x1.00 container 8.160 s, gross span 7.62 s, L01→L02 gap 4.31–4.63 s, baseline span 7.30 s. No L01 ellipsis gap is listed in the measurement, so only the line gap is removed (same method and limit as EP21).

| Rate | x1.00 | x0.95 (x 0.95) | Use |
| --- | ---: | ---: | --- |
| Container (34 / 8.16 s) | 4.17 syl/s | 3.96 syl/s | Includes the sample's leading and trailing silence; reference only |
| Gross span (34 / 7.62 s) | 4.46 syl/s | 4.24 syl/s | Sensitivity: sample pause density applied to the whole read, no extra pause allowance |
| Baseline (34 / 7.30 s) | 4.66 syl/s | **4.42 syl/s** | Main projection, plus the authored pause allowance |

## Projection

`main = 201 / 4.4247 + 6.55 + 3.00`

| Component | Seconds |
| --- | ---: |
| Speech, 201 syllables at baseline 4.42 syl/s | **45.43** |
| Authored pause allowance: 7 ellipses x 0.40 s + 15 line boundaries x 0.25 s (EP21 slot values) | **6.55** |
| Closing hold | **3.00** |
| **Total (main)** | **54.98 ≈ 55.0** |

Sensitivity:

| Case | Total |
| --- | ---: |
| Gross-span rate, no added pauses, + 3 s hold | 50.4 s |
| Baseline, script's own "about 5.5 s" pause allowance | 53.9 s |
| **Baseline, slot allowance 6.55 s (main)** | **55.0 s** |
| Baseline, script-table count 202, slot allowance | 55.2 s |
| Container rate, no added pauses, + hold (reference; counts sample edge silence) | 53.8 s |

Working range **50.4–55.2 s**. Every case is inside 40–60 s. The headroom to 60 s is 4.8–9.6 s.

Uncertainty not captured by these rows: the sample is two declarative lines read with "speaking rapidly"; the script's later lines carry questions (L03, L05, L09, L14), an exclamation (L07 "เปิดฝา!") and a slower closing (L16), which a full read may take more slowly. Long-take drift is unknown. The delivery note's "about 51 s speech alone" used the container rate (3.96 syl/s); this file's main speech figure is 45.4 s because it removes sample edge silence and the measured line gap and then adds the script's own pauses explicitly.

## Where the seconds go

Main projection, line by line (speech at 4.42 syl/s; ellipsis 0.40 s inside the line; 0.25 s boundary after it). Times are cumulative estimates, not locked frames.

| Line | Syllables | Speech | Ellipsis | Projected interval |
| --- | ---: | ---: | ---: | --- |
| L01 | 18 | 4.07 | 0.40 | 0.00–4.47 |
| L02 | 16 | 3.62 | 0.40 | 4.72–8.73 |
| L03 | 8 | 1.81 | — | 8.98–10.79 |
| L04 | 18 | 4.07 | 0.40 | 11.04–15.51 |
| L05 | 11 | 2.49 | 0.40 | 15.76–18.65 |
| L06 | 14 | 3.16 | 0.40 | 18.90–22.46 |
| L07 | 17 | 3.84 | — | 22.71–26.55 |
| L08 | 9 | 2.03 | — | 26.80–28.84 |
| L09 | 9 | 2.03 | — | 29.09–31.12 |
| L10 | 8 | 1.81 | — | 31.37–33.18 |
| L11 | 14 | 3.16 | — | 33.43–36.59 |
| L12 | 10 | 2.26 | — | 36.84–39.10 |
| L13 | 9 | 2.03 | — | 39.35–41.39 |
| L14 | 10 | 2.26 | — | 41.64–43.90 |
| L15 | 10 | 2.26 | 0.40 | 44.15–46.81 |
| L16 | 20 | 4.52 | 0.40 | 47.06–51.98 |
| Hold | — | — | — | 51.98–54.98 |

By beat (each beat includes its trailing boundary):

| Beat | Lines | Syllables | Projected span | Seconds |
| --- | --- | ---: | --- | ---: |
| EDU-EP22-SHORT-S01-B01 hook | L01–L02 | 34 | 0.00–8.98 | 8.98 |
| S01-B02 first payoff | L03–L04 | 26 | 8.98–15.76 | 6.78 |
| S01-B03 ritual, refrain planted | L05–L08 | 51 | 15.76–29.09 | 13.33 |
| S01-B04 silver's limit | L09–L13 | 50 | 29.09–41.64 | 12.55 |
| S01-B05 verdict, payoff, hold | L14–L16 + hold | 40 | 41.64–54.98 | 13.34 (10.34 speech + 3.00 hold) |

Largest single lines: L16 (4.92 s with its ellipsis), L01 and L04 (4.47 s each), L02 (4.02 s), L07 (3.84 s).

## Editorial flags at this pace (no cuts proposed)

- **ER09, silver answer L10–L13:** 41 syllables plus three boundaries = 31.37–41.39 s, **10.0 s**, at the "at most about 10 s" limit and over the script's own "stay within about 9 s" note (written at the faster reference rates). A full read decides whether it passes; the levers are pace and boundary length (below), not line cuts.
- **ER06, L05 → L09:** the next new question after L05 (15.76 s) opens at L09 (29.09 s), about 13.3 s. The script's case holds that the central question from L05 stays open across L06–L08; it is stretched further at x0.95 than at the R3 layout (8.4 s). For Boat/coordinator awareness.
- Open-question map times in the script (R3 layout, about 45 s) no longer match this pace; Preaw updates them after the full-read measurement, not from this projection.

## Decision and completion boundary

The projection (55.0 s main, 50.4–55.2 s range) fits the 40–60 s target at Kore x0.95 with no padding and no cuts. No action is required to fit.

If the full read lands above 60 s, neutral options for the user to choose (none recommended here, none cuts):

| Option | Effect on main projection |
| --- | --- |
| Pace x1.00 (unslowed) | 52.7 s (speech -2.27 s) |
| Pace x1.05 (sampled candidate) | 50.6 s |
| Authored pauses at the script's ~5.5 s instead of 6.55 s (e.g. boundaries 0.18 s) | -1.05 s |
| Closing hold 3 s → 2 s | -1.0 s |

W1.4 records this projection; script approval (W1.5) and the voice lock are separate user decisions. The first full narration comes after its own stage, and frame timing comes from that measurement.

## Change log

- 2026-11-16, R1: Preaw recounted SCRIPT-R3 (201 spoken syllables; script table 202, L04 18 not 19), applied Editor's VOICE-SAMPLES-R1 x1.00 rates scaled by 0.95 for the user-picked Kore x0.95, and projected 55.0 s main (speech 45.43 + pauses 6.55 + hold 3.00), range 50.4–55.2 s. No narration, claim or beat changed.
