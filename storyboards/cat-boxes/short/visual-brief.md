# Visual brief — CATBOX-SHORT

Deliverable: `CATBOX-SHORT`; duration target 40–60 seconds, selected timeline 45 seconds.
Revision: `VB-CATBOX-SHORT-R1`; status: `ready-for-dev` (content-preserving migration; prior CLI picture QA covers this 45-second cut only).
Script: `scripts/cat-boxes/short/script.md` `CATBOX-C01-SHORT-R1`; fact-check basis: `scripts/cat-boxes/short/fact-check.md`, Boat `FC-R5-C01`.
Source brief: `storyboards/cat-boxes/visual-brief.md` `VB-CATBOX-R5`, decision `VS01`; source board/sheet: `short-c01.*`.
Scope: one C01 Short S01 story; no other chapter Shorts are selected.

## Visual intent and progression

Keep the fictional cat in a drawn empty outline distinct from the study participants and paper stimuli. The home action and readable upper-third evidence cards support one another; the research diagram is visibly labeled. End on the limit of the evidence: a cat's choice does not establish its thought or motive. Preserve the R5 staging decision to keep Mochi and the living room visible while cards explain the reviewed results.

| Beat / Short frame range | Visible action and change | Claim / visual boundary |
| --- | --- | --- |
| `CATBOX-C01-S01-B01` / `[0,210)` | Establish fictional empty-frame clip; owner redirects attention to the question. | `F001/F003`; label fiction; do not show an invisible wall as a fact. |
| `CATBOX-C01-S01-B02` / `[210,600)` | Assemble three stimulus types and separate 30 completing cats from 9 selecting cats. | `F001/F002`; schematic label; no 561 or 16-tally detail. |
| `CATBOX-C01-S01-B03` / `[600,1020)` | Show Kanizsa/control and square/control as separate comparisons. | `F003`; non-significance is not equality; no invented graph/effect size. |
| `CATBOX-C01-S01-B04` / `[1020,1350)` | Hold on the unresolved reason; the paper frame remains an illustration. | `F001/F003`; do not imply the test reads subjective belief. |

## Staging and technical handoff

Reuse the existing 2D living-room/cat staging and upper-third screen-space research overlays in the selected source board. Preserve the Short shot IDs `CATBOX-C01-SHORT-S01-SH01`–`SH04`, subtitle-safe band and current A-fade/B-loop behavior. Asset identity and existing R5 scale/framing decisions are unchanged. Runtime input `short-c01.json` and composition `CATBOX-C01-Short` are integrated at branch `68ab92f`; the cited C01 CLI stills/contact sheet are prior evidence for this unchanged 45-second cut. This migration creates no new runtime fields or claims.

Visual evidence does not establish audio synchronization, Studio playback or user script approval. See [Short index](index.md) and `scripts/cat-boxes/delivery.md`.
