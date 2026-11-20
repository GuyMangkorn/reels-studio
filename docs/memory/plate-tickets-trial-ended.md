---
name: plate-tickets-trial-ended
description: "Plate-tickets trial (one Sonnet Boss pass per Film ticket) ended by the user on 20 Nov 2026 after EDU-EP30 cost about 3x; Boss builds in beat batches"
type: project
updated: 2026-11-20
---

On 20 Nov 2026 the user ended the plate-tickets trial started 19 Nov 2026 ("เลิก trial"): Film no longer slices scene sheets into one ticket per plate, and Boss no longer runs one Sonnet pass per ticket. The skill `plate-tickets` was removed. Boss builds in two batches by build class (`hard` on Opus, `easy` on Sonnet, from the `Build:` line of each shot block) and is checked once ([boss batches](../coordinator.md#boss-batches)).

Measured from transcripts at the same stage (W5.2 built, draft not passed), both 28 shots: EDU-EP30 with tickets = Boss 62 runs, $124, 21.1 agent-hours, 4,063 tool calls, Film $125, episode $302; EDU-EP26 without = Boss 5 runs, $39, 1.6 hours, 467 calls, Film $41, episode $114. 23 of the 62 Boss runs were fix passes; Film ran nine extra open-item rounds. One episode each, picture quality not compared.

**Why:** the user felt it used more quota and took longer; the numbers agreed. My interpretation: each fresh Boss run re-reads rules and kit, so 62 small runs cost more than a few large ones.

**How to apply:** all channels and episodes. Do not propose per-plate tickets or an all-Sonnet Boss again without new evidence. EDU-EP30's existing `tickets/` folder stays as that episode's record.
