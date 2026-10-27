# Visual brief — CATBOX-LONG

Deliverable: `CATBOX-LONG`; YouTube Long 9–10 minutes; timeline estimate 9:00.
Revision: `VB-CATBOX-LONG-R1`; status: `provisional` (Long-only board migration; Mark/Film visual review and runtime Long QA pending).
Script: `scripts/cat-boxes/long/episode-script.md` `CATBOX-LONG-R1` plus Long-only chapter files; factual-review basis: `scripts/cat-boxes/long/fact-check.md`.
Scope: all six Long chapters / 12 story scenes. The selected companion Short is `CATBOX-SHORT`, authored in its own script and board pack.
Sources: sequence brief `storyboards/cat-boxes/blockout.md`; scene-board sources at root `ch01-sc01`–`ch06-sc02`; C06 historical treatment `../ch06-sc02-visual-brief.md`.

## Visual intent

The owner investigates an appealing single answer, then learns to sort observations from hypotheses. Keep all six turns in the same fictional living room. Physical box action belongs to the home; study results appear as labeled explanatory diagrams, never as footage of Mochi or documentary footage of a named study. Each scene changes the audience's observation, evidence or interpretation; the recurring owner/file image returns only when it advances that investigation. Preserve the old-box clue and the final “ยังไม่รู้” without making the ending answer the cat's motive.

## Sequence progression and acceptance

| Scene / Long range | Visible progression | Claim / reveal constraint | Existing Mark board |
| --- | --- | --- | --- |
| `CATBOX-C01-S01` / `[0,1350)` | Fictional clip gives way to paper-stimulus setup. | `F001–F003`; keep research/home distinction visible. | `ch01-sc01.*` |
| `CATBOX-C01-S02` / `[1350,2700)` | Separate enrollment, completers, selections and pairwise results; leave cause blank. | `F001–F003`; counts keep their units. | `ch01-sc02.*` |
| `CATBOX-C02-S01` / `[2700,4050)` | Diagram the shelter context, then show the hide box and bounded adaptation result. | `F004`; schematic, not footage. | `ch02-sc01.*` |
| `CATBOX-C02-S02` / `[4050,5400)` | Change the question from CSS to other measured outcomes. | `F005/F011`; keep study populations/endpoints separate. | `ch02-sc02.*` |
| `CATBOX-C03-S01` / `[5400,6750)` | Mochi's fictional toy chase prompts an owner hypothesis. | `F008`; behavior does not prove a motive. | `ch03-sc01.*` |
| `CATBOX-C03-S02` / `[6750,8100)` | Compare a real covered box with a flat outline; explain cover function. | `F008/F011`; mark ambush as hypothesis. | `ch03-sc02.*` |
| `CATBOX-C04-S01` / `[8100,9450)` | The owner examines a temperature range and its definition. | `F006`; no universal comfort rule/advice. | `ch04-sc01.*` |
| `CATBOX-C04-S02` / `[9450,10800)` | Keep warmth possible while rejecting a single universal answer. | `F007/F011`; retain uncertainty. | `ch04-sc02.*` |
| `CATBOX-C05-S01` / `[10800,12150)` | Stage a side-pressure explanation as a proposal. | `F009`; do not present an untested mechanism as fact. | `ch05-sc01.*` |
| `CATBOX-C05-S02` / `[12150,13500)` | Separate approaching a new object from choosing to rest. | `F004/F010`; do not conflate novelty with motive. | `ch05-sc02.*` |
| `CATBOX-C06-S01` / `[13500,14850)` | Owner sorts measurable observations from explanations. | `F001–F011`, `CL03–CL05`; payoff uses earlier distinctions. | `ch06-sc01.*` |
| `CATBOX-C06-S02` / `[14850,16200)` | Return to BOX-OLD; owner writes “ครั้งนี้ยังไม่รู้.” | `F012`, `CL01–CL02`; the return is fiction and not causal proof. | `ch06-sc02.*` |

The frame ranges are the current Long source timeline at 30 fps, 45 seconds per scene. Chapter scene sheets remain the shot-level staging and continuity authority.

## Medium and technical handoff

Use the existing 2D living room, owner/cat rigs and labeled screen-space research cards represented by the Long input `scripts/cat-boxes/blockout-long.json`. Preserve one room axis and the established left-to-right owner/evidence/sofa/BOX-OLD relationships in the scene sheets. Author the Long camera, scale and framing against this landscape brief and its own board set. Reuse current assets and scene component IDs; this brief adds no assets or runtime fields.

Source inspection at branch `68ab92f`: `src/Root.tsx` registers `Long` against `blockout-long.json`; the input has 12 × 45s. The renderer binding is integrated. Long composition output, projected sizes/contact across 16:9, captions, scene transitions, Studio seeking and rendered factual-image treatment remain `unverified` because no Long render/QA is recorded. C06-S02's previous portrait-scale check does not establish Long correctness.

## Handoff and checks still needed

Mark's migrated written handoff contains 12 scene sheets; drawings are retired. Audit source-revision matching and the coordinate/anchor/camera contract before reuse, then review Editor's blockout before a visual-pass claim. Editor should render the selected Long at start/mid/end and each chapter boundary, then review critical reveals (especially C01 study displays and C06 BOX-OLD return), the full sequence, Thai overlays, seeking and Long physical scale under the current workflows. This brief is planning evidence only; it does not establish a Long visual or release pass.
