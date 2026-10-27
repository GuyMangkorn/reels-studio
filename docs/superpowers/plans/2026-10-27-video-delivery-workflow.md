# Video Delivery Workflow Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this documentation plan inline. The user's approval explicitly authorizes implementation in this chat; no further design or execution-choice question is needed.

**Goal:** Resolve selected Short/Long deliverables and maintain separate packs through production.
**Architecture:** One delivery-selection contract links existing editorial/planning/runtime owners. Shared research and assets remain reusable; each selected editorial version has independent timing and revision coverage.
**Tech Stack:** Markdown workflows and TOML agent instructions; no runtime changes.
**Spec:** [Approved design](../specs/2026-10-27-video-delivery-workflow-design.md).

## Global constraints

- Shorts 40–60 seconds; YouTube Long 9–10 minutes; default both = one of each.
- Ask asynchronously only for unresolved selection; an unanswered question does not resolve it.
- English agent instructions; preserve Thai audience copy, existing IDs and dated evidence.
- CATBOX repair, runtime and production materials are deferred.
- Apply the repository documentation-only verification exception; no runtime tests/renders.

## Review focus

Explicit selection must not be asked again; missing selection must not silently default; single-output requests must not expand to both; two board crops must not stand in for two editorial packs; shared-asset consumer checks must survive narrower delivery scope.

## Task 1: Selection and per-deliverable ownership

- [x] Add `docs/delivery-workflow.md`; update AGENTS/README and the owning editorial/production/Film/Mark/Boss/sequence docs, related guidance and five agent configs.
- [x] Confirm each selected variant has separate paths/revisions/timing and no implicit multi-Short expansion. Clarify existing render IDs and frame shapes versus delivery intent.

## Task 2: Audit and verification

- [x] Record the bounded PR #38/CATBOX source audit under `docs/reviews/` without changing production files.
- [x] Review the diff, local links and changed TOML; search for conflicting active timing/both-output rules. Record actual results, not runtime claims.
- [ ] Commit/push issue #53 branch and open/attach a focused PR into main.

## Execution rulings

Documentation/TOML/link checks replace software TDD and renders under the user-supplied contribution policy. No executable interface or behavior changes. The design and this compact plan preserve the already approved decisions without adding a second approval cycle.
