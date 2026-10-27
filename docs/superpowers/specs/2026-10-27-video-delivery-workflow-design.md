# Video delivery workflow design

Approved by the user on 27 October 2026 (Asia/Bangkok): implement the design in this chat. Scope: workflow/instructions only; CATBOX migration is deferred.

## Intent and constraints

Resolve Short, Long or both before writing. Default delivery targets are Shorts 40–60 seconds and YouTube Long 9–10 minutes. Both means one of each unless the user requests more. Ask asynchronously only when the choice is unresolved; wait for an answer before dependent work. Preserve Thai audience copy, English technical instructions, existing IDs and historical evidence. No runtime or production-material edits in this task.

## Approaches

Chosen: shared research and reusable assets with independent editorial/delivery packs per selected video. This supports distinct pacing and exact-revision checks without duplicating sources or art. A single shared timed edit with portrait/landscape crops cannot meet both durations. Using Long as a source for a Short is allowed, but the resulting Short still needs a full independent script and delivery pack.

## Responsibilities and completion

The delivery workflow owns selection/identity/tracking; production requirements own timing/dimensions. Preaw/Boat, Film, Mark and Boss retain their existing responsibilities for each selected variant. Propagate selected-deliverable scope through active instructions and examples; shared-consumer checks retain their scope. Record a bounded CATBOX audit, leaving its repair for a later task. Complete with diff/link checks, TOML parsing and a focused issue branch/PR. No runtime support or visual validation is established by these instructions.
