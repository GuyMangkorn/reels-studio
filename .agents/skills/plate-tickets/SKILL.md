---
name: plate-tickets
description: "Plate tickets: Film slices ready scene sheets into one ticket per plate, prop, figure or movement with every value decided, so Boss builds each ticket on Sonnet. Use when writing tickets after scene sheets are ready-for-dev, dispatching Boss from a ticket, or building from one (ticket, plate ticket, ตั๋วงาน)."
---

# Plate tickets

**Status: trial (user, 19 Nov 2026).** Film plans on Opus; Boss builds every ticket on Sonnet at `medium` ([Boss model by pass](../../../docs/coordinator.md#boss-model-by-pass)). Adapted from Matt Pocock's `to-tickets` skill: a ticket here is a build slice of the picture, filed in the episode folder.

A **ticket** is one thing Boss builds and proves alone in a fresh context. A ticket is **decided** when the builder never has to choose: every size, position, colour, pose and motion key is a number, a kit ID or a reference image path.

## Film: write the tickets

Runs once the deliverable's scene sheets are `ready-for-dev`, in the same Film invocation or a fresh one on Film's frontmatter model.

1. **Collect the work.** List every row owned by Boss in each sheet's `Baseline and assets` and `Dependencies and open items` tables, plus every `new: <look>` casting line. Complete when each row has a line in your working list.
2. **Slice.** One ticket per set or plate, prop, figure look, movement, or shared capability. Shots that share one set are one ticket. A shared kit module that several tickets need is its own ticket and comes first. Size each ticket to one fresh context: about three source files and one proof sheet.
3. **Decide.** Fill the template below. Where the scene sheet already holds a value, link the shot block (`E01-C01-S02 SH03 Staging`) and add only the build decisions it lacks. For each remaining choice, make it now; a choice that needs the user sets the ticket to `needs-input` with the question. Complete when every ticket is decided or `needs-input`.
4. **Add edges.** `Blocked by` names the tickets that must merge first; `Files` names every file the ticket writes. Two tickets that write the same file get an edge between them.
5. **File.** Write `scripts/<episode>/tickets/T<nn>-<slug>.md` and `scripts/<episode>/tickets/index.md`, then add the index path and revision to `task.md`. Complete when every row from step 1 maps to a ticket ID in the index.

### Ticket template

```markdown
# T03 — <what exists when this is done>
Deliverable: <ID> · Revision: r1 · Status: ready / needs-input / in-progress / done / blocked
Class: set / prop / figure / movement / capability · Hard: yes / no
Blocked by: T01, T02 (or none) · Consumers: <scene + shot IDs>
Model: sonnet, medium

## Build
What to make, in one or two sentences, and the owning module it lives in.
Casting line or `new: <look>`; kit entries to reuse, by ID and path.
Files: <every file written or created>

## Decided values
| What | Value | Source (shot block, brief decision ID, or `ticket`) |
World size, position and anchors in metres; palette by token or hex; camera line; pose IDs (P01–P45) with frames; motion keys with frames and easing.
References: <store paths of look frames or thumbnails to match>

## Proof
Commands to run (tests, `scripts/stills.mjs` frames, `scripts/qa-sheet.sh`, `scripts/caption-zone.py`).
| Frame | What must be visible | Measured number and its pass range |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
```

### Hard tickets

`Hard: yes` marks movement, a new character or animal, and arm, hand or face work, the classes where Sonnet lost the same-brief test on 14 Nov 2026. The trial sends them to Sonnet too, so the ticket carries the judgment itself:

- **Movement:** every key pose as a pose-sheet ID or a drawn thumbnail, with frame numbers, contact frames, and the foot or hand that stays planted.
- **New character or animal:** a look frame or painted thumbnail in the store, proportions in heads, and the four views it needs.
- **Arm, hand, face:** the arm side per view, the thumb position, and the expression by kit ID, following the [hand-drawing skill](../../../.claude/skills/hand-drawing/SKILL.md).

## Index

`index.md` is one table, kept current by whoever changes a ticket's status:

```markdown
| Ticket | Class | Hard | Blocked by | Status | Fix passes | Result commit |
```

## Coordinator: dispatch

- One ticket per fresh Boss invocation; the ticket is the shot group of [AI01](../../../docs/coordinator.md#agent-invocation). The brief is the ticket path and revision plus the model line.
- Dispatch every `ready` ticket whose blockers are `done`. Tickets with no shared `Files` run in parallel, each in its own worktree.
- A `blocked` ticket goes back to Film with Boss's question; Film revises the ticket and bumps its revision.
- The [fix-pass cap](../../../docs/boss-asset-workflow.md#latest-production-rules) applies per ticket: after two fix passes the user decides, and one option is rerunning that ticket on Opus. Record the choice in the index.

## Boss: build from a ticket

1. Read the ticket, then only the shot blocks and kit files it links.
2. Build exactly `Build` using `Decided values`. When a value is missing or two values conflict, set `Status: blocked`, write the question in `Result` and return; the choice belongs to Film.
3. Run every `Proof` command and view the sheet. Complete when each proof row has a measured number inside its range.
4. Fill `Result`, set `Status: done` and update the index row.

## Measuring the trial

Before the first ticket of an episode and after its last, run `python3 -I scripts/usage-report.py --since <date>` and record in `scripts/<episode>/build-notes.md`: Boss cost per ticket, fix passes per ticket, and the same two numbers for `Hard: yes` tickets alone. Baseline, 1–15 Nov 2026: Opus medium $6.52 a run at 4.7 runs per branch; Sonnet medium $1.91 a run at 6.2 runs per branch.
