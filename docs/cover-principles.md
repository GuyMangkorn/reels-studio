# Cover principles

Rules for the cover image (thumbnail) of every deliverable: the 9:16 cover of a Short/Reel and the 16:9 thumbnail of a long video. **Owner: Film.** Status: **proposed** (3 Nov 2026, user request "มี principle อะไรในการทำปกคลิป … ให้ agent สักคนนึงถือไว้"); first used on `WDG-COVERS`.

Rule levels follow [AGENTS.md](../AGENTS.md#language-and-rule-conventions). Platform facts in [CV-P](#cv-p-platforms) are **Reference**, unverified against current platform docs; recheck before relying on one.

## When

**Requirement.** A cover is a stage of every deliverable, after the Final cut is approved and before delivery. Film proposes **five candidates** (CV09), the user picks one with the structured-question tool, and the pick is recorded in the delivery record. A stage with no subject (for example a look-frame composition) is recorded `N/A`.

## Rules

- **CV01 — One idea at a glance.** A cover says one thing a scrolling viewer gets in about one second. It is judged at phone-grid size (CV10), not full size.
- **CV02 — Few words, big.** At most about five Thai words: one headline plus at most one short sub-line. The headline cap height is at least 7% of the frame height (about 135 px on 1920). The cover text adds to the title; it does not repeat it word for word.
- **CV03 — One large subject.** One readable subject: a face with a clear emotion, the creature or object of the story, or one striking shape. Large and high in contrast against its ground; no busy background behind it.
- **CV04 — Open a question, keep the promise.** Show the setup or the question, not the answer or the twist. Everything the cover implies must happen in the video (no clickbait beyond the content). Factual covers follow Boat's verdicts; cultural subjects keep the respect rules of the script.
- **CV05 — Contrast and colour.** Text in a heavy weight with a dark outline; one accent colour taken from the episode palette (for example the lantern orange of WDG) for the key word, the rest near-white. At most three colours of text.
- **CV06 — Safe zones.** Headline and subject sit inside the centre 3:4 crop of a 9:16 cover (y 240–1680 on 1080×1920), clear of the bottom 20% (caption and app UI) and the right 120 px (action buttons). A 16:9 thumbnail keeps the bottom-right corner free (duration badge).
- **CV07 — From the film.** Default: the cover uses an actual episode plate at a chosen frame, so it matches what the viewer then sees. A new painting only when no frame fits, with the reason recorded. Text is drawn as an overlay, never painted in.
- **CV08 — Series identity.** Same font family (Noto Sans Thai, weight 800), outline style and text position across a series; the `@TamMaiLa` channel mark stays small top-left as on the video ([channel mark default](delivery-workflow.md)).
- **CV09 — Five distinct angles.** The five candidates differ in angle, not only in wording: (A) the question or quote, (B) the creature or subject reveal, (C) a face with emotion, (D) a mystery or impossible detail, (E) the number, date or "true story" fact. An episode may swap one angle for another with a reason.
- **CV10 — Check small.** Render full size through `scripts/render.mjs <ID> --stills`, then look at each cover at 120 px wide (phone grid) and at the 3:4 crop. The headline must read at 120 px; a sub-line that does not is acceptable only if the headline carries the idea alone.

<a id="cv-p-platforms"></a>
## CV-P — Platforms (Reference, unverified)

- Instagram Reels: custom cover upload; the profile grid shows a centre 3:4 crop.
- YouTube Shorts: the cover is picked from a frame of the video in the mobile app; a custom image may not be available. When it is not, the chosen cover frame must exist in the video (for example the first frame, or a frame the cover was built from).
- YouTube long video: 1280×720 or larger, 16:9, under 2 MB; "Test & compare" can A/B up to three thumbnails.
- TikTok: cover picked from a video frame or uploaded, with text added in the app.

## Implementation

A cover composition per episode, `<EP>-COVERS`: one 1 s scene per candidate holding an episode plate with `fromSec` at the chosen frame, and an overlay that draws the text (example: [src/videos/wendigo/covers.tsx](../src/videos/wendigo/covers.tsx), overlay `wendigo-covers`). Stills at frame 15 of each scene are the cover PNGs; archive them with `store.py archive --kind covers`.
