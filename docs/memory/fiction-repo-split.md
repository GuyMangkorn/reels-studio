---
name: fiction-repo-split
description: "Fiction channel lives in its own repo ~/Developer/reels-fiction (GuyMangkorn/reels-fiction, private) since 17 Nov 2026; no Boat role there"
type: project
updated: 2026-11-17
---

On 17 Nov 2026 the user split the fiction channel (`@mg.fiction`, series MGF) out of reels-creator/reels-studio into `~/Developer/reels-fiction` (GitHub `GuyMangkorn/reels-fiction`, private; remote `upstream` = reels-studio for cherry-picking shared tooling fixes). It is a full duplicate with no shared files; docs and code diverge freely. Both repos share `~/ReelsStore`.

- reels-fiction: fiction only, no Boat (Preaw writes research notes for real subjects, no fact-check stage), edu + legacy episodes removed.
- reels-studio: edu channel + legacy episodes; fiction channel and `scripts/mgf-series` removed.
- An earlier 15 Nov 2026 attempt (shared docs via `~/Developer/reels-home` symlinks) was reverted because search tools don't follow symlinks; the old folder is `~/Developer/reels-fiction-old`.

**Why:** fiction is a different genre with different roles; one repo forced every rule to say which channel it binds.
**How to apply:** fiction work happens in reels-fiction; don't route fiction deliverables or Boat into it.
