---
name: editorial
description: "Research packet, script pack and fact-check: Boat researches, Preaw writes, Boat checks every claim, finding severity, clarity pass, handoff to Film. Use when researching, writing, revising or fact-checking a script (บท, เขียนบท, fact-check)."
---

<a id="แพรว-preaw--โบ็ต-boat-ก่อนส่งบทให้-film-และ-mark"></a>
# Preaw and Boat: editorial handoff to Film

This workflow covers scripts and fact-checks for both [channels](../../../channels/README.md)' Reels/Shorts (educational, invented stories, and the earlier mystery and twist work), including a whole episode when requested, and other genres selected through a [style profile](../../../docs/delivery-workflow.md#style-profile): for those, Preaw applies the profile's genre craft (e.g. comedy timing, tutorial steps, ad promise/proof/call to action) while the packet, claim, revision and readiness contracts below still apply; a twist and a knowledge takeaway are required only when the profile asks for them, and Boat's passes run only for deliverables with factual claims. Preaw and Boat are project agents in `.claude/agents/` (Claude Code) and `.codex/agents/` (Codex), invoked as `preaw` and `boat`. Their models and permissions inherit from the calling chat. Check each agent TOML for Film's model/effort settings.

<a id="channel-scope"></a>**Channel scope (Requirement).** Rules cited here as ER01–ER14, the bar test and the clarity pass are the [edu channel's script rules](../../../channels/edu/script.md); they bind a deliverable whose channel is `edu`. For another channel, Preaw and Boat apply that channel's `script.md` when it exists and the shared [scriptwriting principles](../../../docs/scriptwriting-principles.md) otherwise. A fiction deliverable with no factual claims records Boat's research and fact-check `N/A`; Boat runs when a script borrows a real place, person or event.

**Requirements:** the packets, revision tracking, factual distinctions and completion criteria below are the editorial handoff contract. **Defaults and guidance:** creative techniques and example timings live in [scriptwriting-principles.md](../../../docs/scriptwriting-principles.md); use them selectively. Readiness records evidence and handoff status; user approval is recorded separately.

<a id="หน้าที่และลำดับงาน"></a>
## Responsibilities and sequence

Before format-dependent research/writing, resolve the [delivery selection and record](../../../docs/delivery-workflow.md). Shared research can proceed while awaiting selection. Apply the sequence below to each selected deliverable; writing-only scope does not automatically invoke later roles.

| Stage | Owner | Handoff |
| --- | --- | --- |
| [Ideation](../../../docs/delivery-workflow.md#ideation) | Preaw, then Film | Six concepts in `concepts.md` across genres and mediums; the user picks one |
| Brief / research | Boat | Questions, evidence, usable knowledge and unresolved gaps |
| Script | Preaw | Full script, beats, clues, reveal and claim references |
| Fact-check | Boat | Claim-by-claim review of a named revision, corrections and impact |
| Revision / recheck | Preaw → Boat | Script changes and review of changed/dependent claims |
| Visual / technical brief | Film | 2D/3D/hybrid choice, lighting/shadow/color, camera language, 2D/Three.js integration, feasibility and risks |
| Scene handoff | Film | Written shots/key states, numeric staging/camera paths, event frames and scene packs from the brief |
| Shared assets/capabilities | Boss | Verified reusable assets/rigs/renderer APIs and affected-consumer evidence |
| Scene integration / editing | Editor | Executable scenes/audio/effects/transitions checked against script and handoff; actual scene-frame samples |

Boat performs two separate passes. Research before writing does not establish that the final wording has been checked. The coordinator (see [coordinator](../../../docs/coordinator.md#coordinator-and-agent-parity)) supplies files and assignments within the user's requested scope; these configs do not install automatic execution or cross-chat messaging.

Example requests:

> Ask Boat (`boat`) to research [topic] for a mystery clip with educational content, supplying evidence and usable story angles.

> Ask Preaw (`preaw`) to use research.md for a 40–60-second Reel (60–120 seconds when the extra length explains the subject better and adds fun) with a twist that changes the interpretation of earlier clues, including full narration.

> Ask Boat to check ch01-script.md revision 2 claim by claim, propose corrections and identify what remains unverified.

> Ask Film to use script revision 3 and its matching fact-check for a visual/technical brief, then give that brief revision to Film for separate written scene sheets.

<a id="หน่วยและไฟล์"></a>
## Units and files

Use episode / chapter / story scene as defined in [Film's workflow](../../../docs/mark-storyboard-workflow.md). Preaw assigns beat IDs such as `E01-C01-S02-B01`; Film maps these to shot/key-state IDs (retaining existing panel IDs). The writer does not prescribe every camera angle.

Use the variant folders and deliverable IDs in [delivery workflow](../../../docs/delivery-workflow.md#files-and-stable-ids). Share `scripts/<episode>/research.md` and track selection in `delivery.md`; keep `short/script.md` + `short/fact-check.md` separate from `long/episode-script.md` + `long/fact-check.md` (optional Long chapter files). These are authoring conventions, **not a runtime JSON schema**. Existing material keeps its paths/IDs until an explicitly scoped migration.

Runtime timelines follow the current source contract linked from AGENTS.md. Writing a script neither creates an executable timeline nor establishes renderer support for its contents.

<a id="research-packet--โบ็ต"></a>
## Research packet — Boat

1. Record the brief, story type, central question, learning takeaway, period/context and research date. For a named real case, investigate that case. For an open fictional brief without a specified mode, use and visibly label the default `fiction-with-factual-knowledge`.
2. Open and inspect sources supporting important claims. Seek contrary evidence and limitations. Multiple sites copying one original remain one original source. Distinguish `documented fact`, `reported experience`, `folklore`, `hypothesis` and `fiction/dramatization` according to what the evidence establishes. A report of an experience does not establish its supernatural or scientific cause.
3. Maintain a source registry, for example `SRC001`: title, author/organization, publication/update date, direct URL, section/page and access date. Mark `inspected` or `inaccessible/lead-only` and explain limitations. Quote only the short passages needed. Describe confidence qualitatively with reasons; do not invent numerical probabilities.
4. Maintain a claim ledger, for example `F001`: assertion, scope/conditions, source and locator, supporting/contrary evidence and usable wording (the boldest wording the evidence supports, [ER10](../../../channels/edu/script.md#er10)). Distinguish a possible mechanism from an explanation demonstrated in a specific case.
5. Summarize supported story angles and remaining research questions. Identify material gaps explicitly; never invent evidence or claim to have inspected an inaccessible source. An edu packet opens with the จริงดิ list ([ER07](../../../channels/edu/script.md#edu-short-retention)): the three to five wildest well-supported things about the topic.

Research is complete when every premise-critical claim has evidence and limitations or is visibly unresolved. Incomplete verification is not a passing factual review.

<a id="script-pack--แพรว"></a>
## Script pack — Preaw

Record deliverable/episode/chapter IDs, the delivery-record path, script revision, brief/research revision, story mode, the hook the user picked at the [hook pick](../../../docs/delivery-workflow.md#hook-pick) (hook ID and opening line), target duration and timing status (`estimated` / `read-aloud` / `audio-tested`) in the header. Keep user approval separate from writing and factual-review status.

Create one complete script pack per selected deliverable. With both selected, write two complete spoken versions with independent beats/timing and claim coverage. Short has a standalone hook/question/payoff; Long develops the story without forced fixed-length chapters. Sources and claims may be shared; shortening wording still requires review. A second crop or chapter outline is not a second script.

The handoff contains:

- **Story core:** logline, central question, character intention/obstacle, intended feeling and learning takeaway.
- **Truth and ending:** what actually happens within the story, verified facts and remaining uncertainty. Choose the ending before planting clues; for real cases, preserve the evidence rather than bending it to a preferred ending.
- **Scene / beat list:** IDs, scene purpose, causal links, what changes and estimated timing. Distinguish story-world time from elapsed video time. Edu Shorts add the Bit column to the full script ([ER12](../../../channels/edu/script.md#er12)) and pass the [bar test](../../../channels/edu/script.md#fun-bar) before handoff.
- **Full script:** the actual spoken Thai narration/dialogue, with pauses and necessary sound/story events. Identify subtitles that shorten or change VO wording separately. A synopsis is not a full script.
- **Sound intent:** per beat, music mood/energy, silence, and any stinger/riser/effect that carries the beat, as English notes ([sound duties](../../../docs/sound-generation-workflow.md#role-responsibilities)). Narration text is unchanged; sound never replaces a clue.
- **Clue ledger:** `CL01`, plant/beat, observable information, initial interpretation, post-reveal interpretation and payoff. Distinguish fictional clues from real evidence presented to viewers.
- **Claim mapping:** factual sentence/beat → `F001` → `SRC001` and locator. Mark unsupported new claims `needs-research`.
- **Film brief → scene sheets:** what must be seen/heard, what must stay hidden until which beat, essential continuity and story constraints. Film chooses the approach using the [brief workflow](../../../docs/film-visual-brief-workflow.md); Film develops the scene sheets. Both receive matching script/review revisions.
- **Change log / open questions:** changes in this revision, affected claims/clues/scenes and Boat's recheck scope.

<a id="script-pack-files"></a>**Two files (Requirement; usage review, 16 Nov 2026).** The pack is split by reader, because every later role rereads `script.md` in full (measured: packs of 30–41 KB whose spoken script is about 25 lines; one was read 12 times in an episode):

- `script.md` holds what Film, Ton and Editor need: header, story core, truth and ending, scene / beat list, full script, sound intent, clue ledger and the Film brief notes.
- `script-notes.md` beside it holds what only Preaw and Boat need: claim mapping and claim status table, change log, open questions, notes and any rule self-audit (for edu, the [bar test](../../../channels/edu/script.md#fun-bar) marks). Its header names the `script.md` revision it describes.
- The change log keeps the current revision's changes only. Earlier revisions' change sections ("R4 changes for Boat") are deleted once Boat has rechecked them; Git keeps the history (`git log -p -- <path>`).
- A brief to Film, Ton or Editor names `script.md` only. An existing single-file pack is split the next time Preaw revises it; shipped episodes stay as they are.

Preaw makes routine creative decisions within the brief, including the topic for an open assignment, hook, beats and twist. Read aloud or use test audio before claiming the timing works; a Thai word count alone does not establish duration. Follow the channel rules linked from AGENTS.md. The 45-second structure is an experiment, not a required formula.

A draft is complete when the requested scope has full spoken wording and applicable beats/clues/claims, with visible gaps. A premise-critical gap keeps it a draft requiring more research.

<a id="fact-check--โบ็ต"></a>
## Fact-check — Boat

Identify the deliverable ID, script path/revision and research revision reviewed. Check each selected version separately; name both scopes explicitly when sharing a review document for legacy material. Read the whole script and check every assertion, including hook, supplied video title, subtitles, quantities, quotations, causality and knowledge conveyed by proposed visuals. Character speech or belief is not automatically a narrator assertion.

| Claim / location | Exact wording checked | Classification | Verdict | Evidence + locator | Reason / correction / story impact |
| --- | --- | --- | --- | --- | --- |
| `F001` / beat ID | Wording from this revision | fact / report / hypothesis / fiction | Vocabulary below | `SRC001` + section | ... |

Verdicts: `supported` means the evidence supports this wording and scope; `needs-qualification` requires weaker wording or conditions; `contradicted` means evidence conflicts with the assertion; `unverified` means it remains unconfirmed; `not-factual` covers fiction/judgment not asserted as fact, while still checking whether presentation misleads.

Report errors affecting the premise, reveal or learning takeaway before minor details. Boat proposes accurate wording and beat/clue impact; Preaw rewrites the story. The final twist must preserve factual corrections so viewers do not leave with the wrong knowledge.

<a id="finding-severity"></a>**Finding severity (Requirement; user, 9 Nov 2026).** Every finding is marked `must-fix` or `optional`. It is `must-fix` only when the line as written would:

1. leave the viewer with a wrong idea of the takeaway;
2. make the hook, premise or reveal false;
3. put the viewer's health or safety at risk;
4. misrepresent a real person or case;
5. be off by an order of magnitude.

Everything else is `optional` and does not hold readiness: a `needs-qualification` on a simplification whose direction is true, extra precision, clarity-pass notes and preferred wording. Preaw may decline an optional finding without a reply. Boat never requires a hedge to stay unless its removal is `must-fix`, and a `must-fix` correction on an edu script is another bold true line that keeps the bit ([ER10](../../../channels/edu/script.md#er10), [ER13](../../../channels/edu/script.md#er13)), never a source or method phrase in narration. Boat does not lengthen an answer past [ER09](../../../channels/edu/script.md#er09)'s 10 s; when accuracy needs more words, it proposes a different bold true line for the beat (ER13). Evidence: the EP13 fact-check required "ตามแบบจำลอง" to stay ("do not cut"); EP08 L12, EP09 L09 and EP11 L12 carry similar on-screen qualifiers.

<a id="clarity-pass"></a>**Clarity pass (Boat; edu channel, [channel scope](#channel-scope)).** Flag each line that breaks [ER05](../../../channels/edu/script.md#edu-short-retention) with verdict `too-technical` and a plain wording that stays true. Flag each NARR line that breaks [ER14](../../../channels/edu/script.md#er14) with verdict `hard-to-follow` and a wording that stays true. Also flag an analogy that would leave a wrong idea (`misleading-analogy`). Preaw rewrites; Boat does not. Clarity findings are `optional` ([severity](#finding-severity)) except a `misleading-analogy` that meets a `must-fix` case.

Conclude for the named revision only: `revision-required`, `verification-incomplete`, or `ready-for-storyboard` when no `must-fix` finding remains open. The legacy verdict `ready-for-storyboard` means factual readiness for Film visual planning; it requires no drawn board. Readiness neither records user approval nor guarantees that no error remains.

After a script revision, assess changes to factual wording and dependent claims. Recheck affected items and record coverage of the new revision. Synchronize the script header and delivery record with the resulting factual status while preserving dated history and separate user-approval/timing status. Reuse earlier results only after checking that the wording is unchanged and no new contrary evidence applies.

<a id="inline-fact-fixes"></a>
**Default — small fixes inline.** When a finding's correction is one exact number or one wording change that Boat has already written (no change to the beat, clue, twist or story timing), the coordinator applies it mechanically to the script ([AI02](../../../docs/delivery-workflow.md#agent-invocation)) with a change-log line naming Boat's finding ID. Boat rechecks that item at the next scheduled recheck instead of in a separate round-trip, and the factual status shows `correction applied, recheck pending` until then. A finding that needs rewording judgment, touches the reveal or changes timing goes back to Preaw and Boat as usual.

<a id="ส่งต่อและตรวจบทก่อนลงทุนทำภาพ"></a>
## Handoff and editorial check before visual production

Before handing off to Film, Preaw checks hook/payoff, scene progression, fair twist logic and the knowledge's role in the plot. Boat checks facts in a separate pass. Film receives matching script/review revisions for the visual/technical brief; Film receives those revisions with the brief revision. Return script issues to Preaw/Boat, approach/integration issues and handoff details to Film, and shared code/asset proof to Boss and scene integration/editing proof to Editor.

The user may request rough scene sheets from a draft. Identify the revision and unresolved claims that may require visual changes. A completed script or ready factual review does not imply approval. If an animatic exposes timing problems, revise the script, increment its revision and check factual/continuity impact.

<a id="หลักการและแหล่งอ้างอิง"></a>
## Principles and sources

Use [scriptwriting-principles.md](../../../docs/scriptwriting-principles.md) for hooks, intention/obstacle, causality, fair twists, educational integration and evidence checks. Agent instructions live in `.claude/agents/` and `.codex/agents/` (`preaw`, `boat`). Config reference: [OpenAI custom agents](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents).
