---
name: memory
description: "Shared memory in docs/memory/: one Git-tracked file per durable fact, read by every harness. Use when the user says to remember, forget or stop re-asking something (จำไว้, อย่าลืม, ต่อไปให้...), corrects how you work, gives an approval or a standing preference, or when a task may depend on one given earlier."
---

# Memory

A **memory** is one durable fact the repository does not otherwise record, kept as `docs/memory/<slug>.md` and listed in the index [docs/memory/README.md](../../../docs/memory/README.md). Owner: whichever agent hears the fact; a role agent without write access to `docs/` returns it to the coordinator.

## Recall

1. Read the index (about 5 KB) when a task may touch a past preference, approval or decision.
2. Open only the files whose line matches the task.
3. Treat each as true on its `updated` date: confirm any file, function, config or model it names still exists before acting on it. A rule document wins where the two disagree; then fix or delete the memory.

## Save

A fact earns a memory when it is both **durable** (it will matter in later sessions and tasks) and **applicable** (it would change what an agent does). Unsure whether it is durable: leave it out.

| Type | Holds | Example |
| --- | --- | --- |
| `user` | Who the user is: role, expertise, standing preferences | reads replies with ADHD rules |
| `feedback` | A correction or a confirmed way of working | sample before a full narration read |
| `project` | A decision, approval or constraint with its date | script R4 and voice v3 approved |
| `reference` | Where something outside the repository lives | a dashboard URL, a quota tier |

What the repository already states stays where it is: code, rule documents, Git history, an episode's `task.md` and `build-notes.md`. A look or taste note goes to [docs/user-taste.md](../../../docs/user-taste.md). A new rule for every agent is proposed for its rule document ([DP01](../../../docs/contributing.md#tools-and-document-improvements)); the memory records only that the user asked for it.

Steps:

1. Search the index for the subject (`grep -n -i '<keyword>' docs/memory/README.md | head -20`). A match means you update that file; a new slug is for a new subject only.
2. Write `docs/memory/<slug>.md` in the form below. Done when a reader with no access to this conversation could act on it.
3. Add or update its one line in the index under its type, in the form of the lines already there (title linked to the file, a dash, a short hook), with the date for an approval or decision.
4. Run `python3 -I scripts/context-map.py`; it checks the index links. Both files go in the same commit.

```markdown
---
name: <slug>
description: "<one line: the fact, who said it, the date>"
type: user | feedback | project | reference
updated: YYYY-MM-DD
---

<The fact, one or two sentences. Quote the user's own words where the wording matters.>

**Why:** <the reason the user gave, or "not stated">

**How to apply:** <when it applies and what to do; the scope (channel, episode, role)>
```

Writing rules:

- One fact per file. Absolute dates (`20 Nov 2026`).
- Name the scope: one episode, one channel, one role or everything.
- Mark your own reading as yours ("my interpretation: ..."); the user's words stay as said.
- English, with audience-facing Thai and the user's quoted Thai unchanged.
- `[[slug]]` names a related memory in this folder.
- A changed decision replaces the old text; one dated "was: ..." line is enough history.

## Forget

Delete the file and its index line in the same commit when the user asks, or when the fact has become wrong or has moved into a rule document.
