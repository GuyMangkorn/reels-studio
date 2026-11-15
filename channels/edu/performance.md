# Edu channel: performance

Record of posted videos' numbers, as the user reports them ([performance record](../../docs/delivery-workflow.md#performance-record)). A production record, not a rule document: the coordinator appends rows without a DP entry. Numbers are rough and user-reported; `-` = not given. Avg % watched = average view duration ÷ length.

| Video | Posted | Reported | Views | Avg view duration | Length | Avg % watched | Swiped away | Retention curve | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EDU-EP02-SHORT | - | 2026-11-08 | 1.3k | 0:36 | 60 s | ~60 % | 33.6 % | API: steepest drop 12.6–15.6 s (term block L06–L07), lowest relative retention 0.29 at 16 s | API engaged/views 0.61 ([pull](../../scripts/edu-series/ep05/retention-deep-dive.md#api-pull)) |
| EDU-EP03-SHORT | - | 2026-11-08 | 2.5k | 0:39 | 59 s | ~66 % | 36.6 % | steady decline | |
| EDU-EP05-SHORT | 2026-11-07 | 2026-11-08 | 24k | 1:00+ | 66 s | ~91 %+ | 20.2 % | - | [retrospective](../../scripts/edu-series/ep05/lessons-learned.md) |

## Verified Studio snapshot — 2026-11-15

Source: authenticated YouTube Studio Advanced mode, Content breakdown, **2026-10-18–2026-11-14**. The historical user reports above are retained with their dates. These are observed Studio values; swipe-away is 100 minus `Stayed to watch`, not the API engaged/views proxy. All19 observed rows and 16 API curves are in the [dated analysis](analytics/2026-11-15.md) and [source snapshot](analytics/2026-11-15-data.json). API curve data ends Nov 12; the two Nov 15 uploads are outside this Studio period.

| Video | Studio views | Average view duration | Average percentage viewed | Swiped away | API curve at 90% runtime |
| --- | ---: | --- | ---: | ---: | ---: |
| EDU-EP05-SHORT — ant-sized human | 32,945 | 0:58 | 87.9% | 21.6% | 71.3% |
| EDU-EP11-SHORT — falling elevator | 24,910 | 0:55 | 91.8% | 23.3% | 78.2% |
| EDU-EP07-SHORT — disappearing Sun | 3,924 | 0:54 | 102.5% | 26.6% | 90.1% |

APV and segment-watch ratios can include rewatching. Neither column is the percentage of unique people completing the video. These three lead on both low swipe-away and near-end hold in the available data; explanation of the script pattern remains an observational hypothesis.
