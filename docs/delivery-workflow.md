# Select and track video deliverables

**Status:** Required for new editorial work and downstream handoffs. This document owns output selection, variant identity and delivery tracking. [Production requirements](production-requirements.md#outputs-and-story-timing) own duration, dimensions and fps; [editorial workflow](editorial-workflow.md) owns script/review content.

## Resolve the selection before writing

1. Read the user's request and the existing episode delivery record. Reuse an explicit selection; do not ask again when the user already chose the formats or supplied a scoped revision request.
2. If the selection is missing or materially ambiguous, call `request_user_input_async` with three choices in the user's language: **both**, **Short only**, **Long only**, showing the duration targets from production requirements. Example Thai prompt: “หัวข้อนี้ต้องการทำทั้ง Shorts และ YouTube แบบยาว หรือเลือกแบบใดแบบหนึ่ง?” If that tool is unavailable, ask in chat. A sent question, preselected option or elapsed wait is not an answer. Continue independent research while waiting; begin format-dependent writing/boards only after the selection is resolved.
3. Record the answer or existing instruction in `scripts/<episode>/delivery.md`: selection, evidence of the user's choice, deliverable IDs, target durations and scope. `short`, `long` and `both` are authoring labels, not runtime fields. Default counts are one standalone Short and one Long when both are selected. A chapter series, multiple Shorts or additional edits require explicit scope; selecting both does not make every Long chapter a Short.
4. Route each selected deliverable through Boat research → Preaw script → Boat fact-check → Film brief → Mark boards → Boss implementation. Shared research may feed both. A scriptwriting-only assignment ends with editorial handoff; selection does not authorize automatic downstream production, agent execution or cross-chat messaging.

Selection is complete when the record identifies the selected deliverables and the instruction resolving the choice. An explicit custom duration/scope overrides defaults with its reason recorded. For a new version of existing production, preserve existing IDs and evidence; record a migration map before changing paths or IDs. Workflow updates alone do not migrate historical episodes.

## Separate story versions from frame shapes

Short and Long are separate editorial deliverables. Each needs its own full spoken script, claim mapping, exact-revision factual review, visual brief, storyboard set, executable timing, narration/amplitude and subtitle timing. A synopsis, crop, faster VO or a link to the other script is not a second script. Write a compact standalone question/payoff for Short and a developed causal progression for Long; do not pad or mechanically concatenate Shorts to fill Long.

Share inspected sources, claim/source IDs, character identity and reusable assets through references. Review each version's actual wording and visuals: shorter wording can change factual scope. Reuse unchanged review results only after an explicit change-impact check. Changes to a shared fact/asset identify all affected deliverables without resetting unrelated revisions.

A second aspect-ratio framing of the *same edit* is a framing adaptation, not the other editorial version. It preserves that edit's action/timing only when requested. Duration, composition names and a portrait canvas alone do not establish Short readiness. Existing `Short`/`Long` render IDs are historical bindings to inspect, not guaranteed delivery selections.

## Files and stable IDs

New work uses separate variant folders. This is an authoring convention; it adds no JSON loader, include directive or renderer registration:

```text
scripts/<episode>/
  delivery.md
  research.md
  short/
    script.md
    fact-check.md
    timeline.json             # only after explicit runtime implementation
  long/
    episode-script.md
    ch01-script.md            # optional chapter split
    fact-check.md
    timeline.json             # only after explicit runtime implementation
storyboards/<episode>/
  short/
    visual-brief.md
    index.md
    sc01.md
    sc01.excalidraw
  long/
    visual-brief.md
    index.md
    ch01-sc01.md
    ch01-sc01.excalidraw
```

Create only selected/assigned variant files. With both selected, there are two script packs and two storyboard sets; a set may contain several scene boards. A chapter split within Long does not create extra deliverables. For new work, namespace deliverable/beat/shot IDs, for example `E01-SHORT-S01-B01` and `E01-LONG-C01-S01-B01`; preserve shared source/claim/asset IDs. Extra explicitly requested Shorts get distinct deliverable IDs and paths recorded in `delivery.md`.

## Delivery record and handoff checks

Keep `delivery.md` compact, linking authoritative packs instead of copying their contents:

| Deliverable ID | Target / timing status | Script + factual-review revisions | Brief + board/index revisions | Runtime binding + audio/subtitles | Readiness / approval / open items |
| --- | --- | --- | --- | --- | --- |
| `E01-SHORT` or `E01-LONG` | Target; estimated/read-aloud/audio-tested; measured duration when available | Paths, exact revisions and review coverage | Paths and matching revisions | Timeline/composition/input props and media/cue revisions, or not implemented | Separate writing, factual, planning, runtime, user-approval and release evidence |

Before each handoff, confirm the deliverable ID, matching source revisions, covered beats and timing status. A passing review/board for one deliverable does not pass the other. Update stale readiness labels after a recheck; retain dated prior results as history. Record user approval only with evidence, separately from selection and readiness; this workflow adds no blanket approval gate.

Boss keeps one deterministic executable assembly **per selected deliverable**, using shared renderer/assets. Each has its own clock, boundaries, ending, audio and subtitle cues. Check actual source support before registering/loading it. Run blockout, visual-storytelling, Studio/render/seek and final-duration checks for the selected deliveries under their owning workflows. Shared-library changes additionally check affected consumers, including an unselected existing output when impacted; this does not authorize producing a new unselected version. Label missing evidence and do not claim release readiness from estimated timing.
