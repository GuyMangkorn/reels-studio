# Publishing-copy research notes

**Channel:** ทำไมล่ะ (TamMaiLa)
**Task:** verify current (2025–2026) official rules for titles, descriptions, captions, and hashtags, then feed a skill for `GuyMangkorn/reels-studio`.
**Date checked:** 21 November 2026, Asia/Bangkok (UTC+7).
**Method:** official Help / Creator Academy / Newsroom / Blog / Developer docs first; reputable secondary sources only where official pages were silent or conflicting. Each primary URL below was opened or extracted on the check date. Items that could not be verified on a primary page are marked **unverified**.

Repo conventions (read-only, no clone) were taken from `main` SHA `5cc6cfc1c3f9794440e04c2de87f408301549e1b` (merged 21 Nov 2026, 14:39 Asia/Bangkok). Skills live at `.agents/skills/<name>/SKILL.md` with YAML `name` + `description`. The document index in `AGENTS.md` links editorial and cover-design the same way. A later PR should also update `docs/context-map.md`.

Filed with the skill at `.agents/skills/publishing-copy/` (Claude symlink `.claude/skills/publishing-copy`). Path wording in `SKILL.md` was aligned on filing to `origin/main` `e79a204953bfac82e15113bca2076f5430986085`, which adds the Cover role and task step W6c. Platform findings below were not re-fetched for that alignment. The document index and context map are updated in the same change.

---

## Findings table (short)

| Topic | YouTube Shorts | YouTube long-form | Instagram Reels | Facebook Reels | TikTok |
| --- | --- | --- | --- | --- | --- |
| Title / caption hard limit | Title 100 **characters** (Help, also Shorts "Get started"). Description 5,000 **characters** (Help). Data API description 5,000 **bytes** (conflict — see below). | Same 100 / 5,000. | Help is silent on caption length. Graph API is the usual official source for **2,200 characters** (caption-parameter table not re-extracted verbatim this check; house captions are far shorter). | No official Reels caption cap found this check. Keep captions as short as IG. | Direct Post API: caption (**title** field) max **2,200 UTF-16 runes** (updated 27 Oct 2026). In-app 4,000-character figure is **unverified**. |
| Visible truncation | Official cutoff **unpublished**. Channel convention: ~40 characters so the Shorts overlay is less likely to cut the title (cover-design CV11). Description "...more" fold length **unverified**. | Mobile title/description fold **unverified**. Put the hook in line 1. | First-line / "...more" fold **unverified**. Put hook + keywords in line 1 of the caption. | Same guidance as IG; official fold **unverified**. | Official fold **unverified**. Hook in the one-liner. |
| How titles / captions / tags affect discovery now | Recommendations: viewer personalization, click vs ignore, watch time, satisfaction (Help, search & discovery tips). Hashtags: searchable, link to a hashtag page; up to 3 "most engaging" may appear **by the title**. Studio tags (not hashtags) "play a minimal role" except misspellings. | Same metadata limits. Tags still minimal. Chapters are a description feature, not a Shorts default. | Search matches text in usernames, bios, **captions**, hashtags, places (Mosseri, 25 Aug 2021). Put keywords and hashtags in the **caption, not comments**. Hashtags help Search / hashtag pages more than they are proven to boost the Reels tab. | Official creator blogs: relevant captions and ≤5 hashtags perform best; hashtags help people find a reel when searching (Help wording reported widely; the Help URL returned an error to the fetch client this check — treat the Help "hashtags help people find your reel" sentence as **not re-verified verbatim**). Feed reach is not a promised hashtag effect. | FYP: "video information, which might include details like captions, sounds, and hashtags" (Newsroom), lower weight than user interactions. Academy: clear captions; 2–3 relevant hashtags help interested people find the video. Official "on-screen text is indexed for search" **unverified** this check. |
| Hashtag count and limits | **>60 hashtags: all hashtags ignored.** Over-tagging may remove the video from uploads or search. No spaces. Unrelated / misleading tags can cause removal. House: 3–5. | Same 60-tag ignore rule. `#shorts` is pointless on horizontal long-form. | **Hard max 5** (Help, checked 21 Nov 2026). More than 5: "your comment won't post." Older API mentions of 30 tags must not override in-app Help. House: 3. | No official hard cap found. Official blog: "no more than 5 hashtags performs best." Spammy long/irrelevant tag lists can be limited to followers and lose monetization (24 Apr 2025). House: same as IG, 3, never >5. | Official Academy: **2–3 relevant**. "Less is more." A 2025 "5-tag cap" is trade press only — **unverified**. House: 3. Never `#fyp`. |
| `#shorts` usefulness | **Not required** to classify a Short. From 15 Oct 2024, square or vertical videos up to 3 minutes **are** Shorts (Help + Blog). Keep `#shorts` in the description only, as house convention. Extra ranking value **unverified**. | Do not use `#shorts` to force a long-form video into Shorts — format and length decide. | n/a | n/a | n/a |
| Keywords in caption / on-screen text | Title + description + spoken content matter for search and recommendations; exact ranking weights are not published. Hook in the title and in description line 1. | Same. | Keywords in the caption (official, 2021, still the Search explainer). Thai keyword-search parity in 2026 is **unverified** (the 2021 blog said English first). On-screen text as a Search signal: **unverified**. | Keywords in the description; keep them relevant. | Put the search phrase in the visible caption. On-screen text as an official search index: **unverified**. Create for topics people actually search (Creator Search Insights newsroom: in-demand topics). |
| Misleading / clickbait / spam | Spam Policy: malicious clickbait (title/thumbnail/description does not deliver). Misleading hashtags banned. Scraped / unoriginal re-uploads banned. Mass-produced near-duplicate AI content banned. | Same policy. | Accounts that post spam may rank lower in Search. Irrelevant tags can hurt. | 24 Apr 2025: long distracting captions and inordinate / irrelevant hashtags → reach limited to followers, monetization ineligible. 14 Jul 2025: unoriginal reposts get reduced distribution. | Academy: hashtags must be relevant. Unrelated spam tags work against "people find your content." |
| AI / altered-content disclosure | Required in Studio "AI use" when content is realistic or meaningfully AI-altered (fake real events, real people saying what they did not say, realistic generated scenes, AI music as the main focus). **Not** required for non-realistic / animated work, minor aesthetic edits, or production assistance including titles, scripts, captions. Auto labels possible (C2PA, YouTube tools). Disclosure is not a free pass. Repeated failure to disclose can mean penalties / YPP issues. | Same. | Meta "AI info" labels (renamed from "Made with AI" on 1 Jul 2024) on Facebook, Instagram, Threads from industry signals or self-disclosure. Edited-only AI may be in the post menu; generated content stays more visible. High-risk deceptive media can get a stronger label; other policy violations still come down. Use in-app disclosure when asked. | Same Meta policy. | TikTok also labels AI-generated content in-product; a caption-specific official requirement was **not** re-verified on a primary page this check. Follow in-app prompts. House Thai disclaimers still required. |
| Reused-content risk | TeamYouTube, 1 Oct 2026: Shorts recommendations further prioritize original content; channels that mainly re-upload others without added commentary, unique edits, or storytelling will likely see less Shorts-feed distribution. YPP "reused content" is a **separate** monetization policy (channel-level; commentary / compilations reviewed for significant original value). July 2025: "repetitious content" renamed "inauthentic content" (mass-produced / templated); reused-content policy itself was not changed that day. | YPP reused / inauthentic rules apply to the channel as a whole. | Cross-posting your own original film is normal. Avoid looking like a scraped repost. | Official: greatest distribution for original content you created; meaningful enhancements required if using others' material; **avoid visible third-party watermarks**; duplicate videos can be downranked in favor of the original. | Avoid watermarked cross-posts from other apps. Official wording on reused reach was not the focus of the pages fetched this check. |
| Thai-language specifics | Thai Help states the same caps: ชื่อสูงสุด 100 ตัวอักษร, คำอธิบายสูงสุด 5,000 ตัวอักษร. Hashtags: no spaces (`#ทำไมล่ะ` is one token; do not break tone marks). Count in YouTube Studio. If uploading via API, description is 5,000 **bytes** (~1,600 Thai letters if the text is almost all Thai). No official Thai-only title formula found. | Same. | Hashtag syntax is the same. 2021 Search blog emphasized English keyword search first; 2026 Thai keyword parity **unverified**. Still write natural Thai keywords in the caption. | Same as IG. No official Thai-only rule found. | Device language is a lower-weight FYP setting. Write captions in the audience's Thai. No official Thai-specific hashtag rule found. |

---

## Verified rules, with citations

Dates are the check date unless the page carries its own publication date.

### YouTube — length

- "Video titles have a character limit of 100 characters and cannot include invalid characters." "Video descriptions have a character limit of 5,000 characters and cannot include invalid characters." Source: YouTube Help, *Edit video settings*, https://support.google.com/youtube/answer/57404 — checked 21 Nov 2026.
- Thai Help, same article (`?hl=th`): "ชื่อวิดีโอมีจำนวนอักขระได้สูงสุด 100 ตัว" and "คำอธิบายวิดีโอมีจำนวนอักขระได้สูงสุด 5,000 ตัว" — https://support.google.com/youtube/answer/57404?hl=th — checked 21 Nov 2026.
- Shorts upload UI: "add a title (max 100 characters)" — YouTube Help, *Get started creating YouTube Shorts*, https://support.google.com/youtube/answer/10059070 — checked 21 Nov 2026.
- YouTube Data API `videos` resource: `snippet.title` "maximum length of 100 characters" and "may contain all valid UTF-8 characters except `<` and `>`"; `snippet.description` "maximum length of **5000 bytes**" and the same character restriction — https://developers.google.com/youtube/v3/docs/videos — checked 21 Nov 2026.
- **Conflict (documented, not unresolved):** Help Center = 5,000 characters; API = 5,000 bytes. For Thai, prefer Studio's character cap when uploading in the official UI; count bytes if using the API.

### YouTube — hashtags

- "Out of all the hashtags you add to the video’s description, up to three hashtags that are considered **most engaging** will appear by your video title." They still appear in the description and can still surface in search.
- "If a video or playlist has more than 60 hashtags, we'll ignore **each** hashtag on that content. Over-tagging may result in the removal of your video from your uploads or from search."
- "Don't add hashtags that are not directly related to the video"; "Hashtags don’t contain any spaces."
- Source: YouTube Help, *Find playlists & videos using hashtags*, https://support.google.com/youtube/answer/6390658 — checked 21 Nov 2026.
- **Correction to a common house myth:** it is **not** officially "the first three hashtags" that appear above the title. Official wording is "most engaging."

### YouTube — `#shorts` and what counts as a Short

- "Videos uploaded after October 15, 2024: Any videos uploaded on or after this date with a square or vertical aspect ratio up to three minutes in length will be categorized as Shorts on YouTube." — YouTube Help, *Understand three-minute YouTube Shorts*, https://support.google.com/youtube/answer/15424877 — checked 21 Nov 2026.
- "Starting on October 15, you can upload Shorts up to 3 minutes long. This change applies to videos that are square or taller in aspect ratio, and won't affect any videos you uploaded before October 15." — YouTube Blog, Todd Sherman, *Tall updates coming to Shorts*, 3 Oct 2024, https://blog.youtube/news-and-events/tall-updates-coming-to-shorts/ — checked 21 Nov 2026.
- Computer upload Help likewise: select a short-video file "Up to 3 minutes" "With a square or vertical aspect ratio." — https://support.google.com/youtube/answer/12779649 — checked 21 Nov 2026.
- These official pages **do not** say the `#Shorts` hashtag is required for classification. Secondary explainers repeat "hashtag no longer needed"; that negative statement was **not** found as a verbatim sentence on the Help pages above. Classification is described purely in format + duration terms. **Verified:** `#shorts` is not what the current Help uses to define a Short. **Unverified:** whether the hashtag still gives a measurable search or filter boost.

### YouTube — discovery, tags field, clickbait

- Search & discovery tips (generic video Help): systems look at whether recommended viewers choose to watch, ignore, or click "not interested"; average view duration and average percent viewed; likes and post-watch surveys. No official "put X keywords in the first 100 characters" rule. — https://support.google.com/youtube/answer/11914225 — checked 21 Nov 2026. A Shorts-specific variant of this URL did not return a usable distinct article this check.
- *Edit video settings*: "Tags can be useful if the content of your video is commonly misspelled. Otherwise, tags play a minimal role in your video's discovery."
- Spam Policy includes "**Malicious clickbait:** Using maliciously misleading titles, thumbnails, descriptions, or imagery to trick users into clicking on a video that does not deliver what was promised." Also scraped content without original commentary / educational value, and automated/synthetic mass-production of similar videos. "Creators should disclose when content is generated or meaningfully altered with AI, but this disclosure is not a free pass to violate our policies." — https://support.google.com/youtube/answer/2801973 — checked 21 Nov 2026.

### YouTube — AI disclosure

- Required when GenAI content "Makes a real person appear to say or do something they didn’t do," "Alters footage of a real event or place," "Generates a realistic scene that didn’t actually occur," or "Creates music that’s the main focus of the video." Disclose in Studio via **AI use**.
- **Do not** need to disclose, among other examples: non-realistic/fantastical work; "Using an AI-generated or altered animation of a missile in a fully animated video"; minor aesthetic edits; "**Production assistance, like using generative AI tools to create or improve a video outline, script, thumbnail, title, or infographic**"; caption creation; idea generation; cloning one's own voice for VO or dubs.
- Labels may appear on the player (music or photorealistic) or in the expanded description (non-photorealistic / animated). "Disclosing AI content alone won’t limit a video’s audience or impact its eligibility to earn money." Repeated failure to disclose can lead to a manual label, removal, or YPP suspension.
- Source: YouTube Help, *Disclosing use of GenAI content*, https://support.google.com/youtube/answer/14328491 — checked 21 Nov 2026.
- The Community blog URL https://support.google.com/youtube/blog/424874071/updates-to-ai-content-disclosure-and-labels did not return a usable article body to the fetcher this check (shell page only). Do not cite that URL for wording.

### YouTube — reused / original Shorts

- TeamYouTube (JJ), *Prioritizing original content on Shorts*, 1 Oct 2026: recommendation systems are "updating … to further prioritize original content and reduce the reach of content re-uploaded from other creators without adding anything of your own." "Channels identified as primarily aggregating or re-uploading other creators’ videos without significant changes will likely see less distribution within the Shorts feed." If using someone else's clip, add "real value through your own original commentary, unique edits, or storytelling." — https://support.google.com/youtube/thread/470890423 — checked 21 Nov 2026. This is an official TeamYouTube community announcement, not a Help Center policy page.
- YPP monetization Help, *YouTube channel monetization policies*, https://support.google.com/youtube/answer/1311392 — checked 21 Nov 2026. "Reused content refers to channels that repurpose content that’s already on YouTube or another online source without adding significant original commentary, substantive modifications, or educational or entertainment value." Reviewers may look at videos, channel description, video title, and video descriptions. The policy applies to the **channel as a whole**. Changelog: 15 Jul 2025, "repetitious content" renamed "inauthentic content" (repetitive or mass-produced); "There is no change to our reused content policy which reviews content like commentary, clips, compilations, and reaction videos."
- These two layers are easy to mix up: **feed reach** (Oct 2026 Shorts recommendation update) vs **monetization eligibility** (reused / inauthentic content).

### TikTok

- Creator Academy, *Elements of a TikTok video*, https://www.tiktok.com/creator-academy/en/article/elements-of-tiktok-video — page fetched 21 Nov 2026 (JS shell; article body extracted from the page JSON). Content system timestamp on the article object: `2026-08-18T19:59:34.397Z`. Quote: "Think about writing clear descriptions or captions for your videos so viewers can quickly understand what you're trying to say. You might also consider using relevant hashtags to make it easier for viewers to find your videos. When it comes to hashtags, less is more, so we encourage you to use **2 to 3 relevant hashtags** on each video. When selecting hashtags, make sure the hashtags you use are relevant to your video."
- Newsroom, *How TikTok recommends videos #ForYou*, https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you — checked 21 Nov 2026. Quote: recommendations include "Video information, which might include details like captions, sounds, and hashtags." Device and account settings include "your language preference." Those factors "receive lower weight in the recommendation system relative to other data points we measure since users don't actively express these as preferences."
- Direct Post API, https://developers.tiktok.com/doc/content-posting-api-reference-direct-post (canonical docs path also `/docs/en/content-posting-api-reference-direct-post`) — "Last updated October 27, 2026." Field `post_info.title`: "The video caption. Hashtags (#) and mentions (@) will be matched, or deliminated by spaces or new lines. The maximum length is 2200 in UTF-16 runes."
- Creator Search Insights newsroom, https://newsroom.tiktok.com/en-US/creator-search-insights — checked 21 Nov 2026. The article describes a tool for in-demand and "content gap" search topics and that search value can factor into the Creator Rewards Program. It does **not**, in the extracted text, instruct creators to place keywords in the first caption line or in on-screen text. The Academy CSI article URL https://www.tiktok.com/creator-academy/en/article/creator-search-insights loaded a category shell; a verbatim "put keywords in caption and on-screen text" sentence was **not** verified there this check.

### Instagram

- Help, *Use hashtags on Instagram*, https://help.instagram.com/351460621611097 — checked 21 Nov 2026. Hashtags go in the caption or comments. "You can use up to 5 tags on a post. If you include more than 5 tags on a single photo/video, your comment won't post." Spaces and special characters like `$` or `%` will not work. Numbers are allowed.
- Adam Mosseri, *Breaking Down How Instagram Search Works*, 25 Aug 2021, https://about.instagram.com/blog/announcements/break-down-how-instagram-search-works — checked 21 Nov 2026. Search matches typed text with usernames, bios, captions, hashtags, and places. Best practice: "Use relevant keywords and hashtags in captions. For a post to be found in Search, put keywords and hashtags in the caption, not the comments." The same post said keyword search was "currently focused on getting keyword search results right in English, and will add support for other languages in the future." That English-first caveat is from 2021; **2026 Thai keyword-search parity is unverified**.
- Caption length: Instagram Help articles fetched this check do **not** state a 2,200-character cap. Meta Graph API documentation for `POST /{ig-user-id}/media` is the standard official place that documents a 2,200-character `caption` field (and has historically mentioned up to 30 hashtags). The caption-parameter table was **not re-extracted verbatim** this check because the fetched page was truncated before that section and a direct curl received HTTP 400. Treat **2,200 as the working official API limit**, and treat **5 tags as the binding in-app rule**. Do not use 30 hashtags.

### Facebook / Meta

- *Cracking down on spammy content to make it easier to break through*, 24 Apr 2025, https://creators.facebook.com/blog/cracking-down-on-spammy-content — checked 21 Nov 2026. "Keep your captions and hashtags relevant to the content. We’ve found content with no more than 5 hashtags performs best. Irrelevant hashtags can cause your content's reach to suffer in the long run." Accounts that post "long, distracting captions, often with an inordinate amount of hashtags" or captions "completely unrelated to the content" "will only have their content shown to their followers and will not be eligible for monetization."
- *Combating Unoriginal Content to Protect and Elevate Creators*, 14 Jul 2025, https://creators.facebook.com/blog/combating-unoriginal-content — checked 21 Nov 2026. Unoriginal = repeatedly reusing another creator's content without credit or meaningful enhancement. Copies can get reduced distribution; original creators are favored. Best practices include: post original content ("You can share the same content across any of your Pages or profiles"); meaningful enhancements if using approved third-party material (a watermark is not enough); "Avoid using visible third party watermarks and content that is visibly recycled from other apps or sources"; "Use high-quality captions. Keep your captions and hashtags relevant to the content. We’ve found that captions with no links, minimal use of capital letters, and no more than five hashtags perform best."
- Facebook Help pages for creating a Reel (https://www.facebook.com/help/166707406722029 and https://www.facebook.com/help/2862139500770200) returned HTTP 400 to the curl client this check. WebFetch was not retried after the creator blogs succeeded. The often-quoted Help line that hashtags in "Describe your reel…" "help other people find your reel when searching" is therefore **not verbatim-verified** this check, though it is consistent with the official blogs above.
- Meta, *Our Approach to Labeling AI-Generated Content and Manipulated Media*, 5 Apr 2024, page also carrying updates through 23 Oct 2025, https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/ — checked 21 Nov 2026. Labels on Facebook, Instagram, and Threads from industry-standard signals or self-disclosure. Label renamed "Made with AI" → "AI info" on 1 Jul 2024. 12 Sep 2024: for content only *modified* by AI, the label moves to the post menu; content *generated* by AI still shows the label, and the UI says whether that is from industry signals or self-disclosure. High-risk deceptive digitally created or altered media may get a more prominent label. Content that violates Community Standards is still removed. This is about labeling, not a requirement to write "AI" into the caption. A different Help article, *Generative AI Editing Disclosures* (https://help.instagram.com/724269355950958/), is a privacy disclosure for Meta's own Backdrop-style editing, **not** the creator labeling rule.

---

## Unverified or incomplete this check

- Exact visible truncation lengths (YouTube Shorts overlay, YouTube description "...more", IG/FB/TikTok caption folds). House uses ~40 characters for titles from cover-design CV11, not from YouTube Help.
- Whether `#shorts` still helps search, filters, or recommendations once format-based classification is in place.
- Whether the three hashtags beside a YouTube title are influenced by description order. Official text says "most engaging," not "first three."
- TikTok in-app caption limit of 4,000 characters (API is 2,200 UTF-16 runes).
- TikTok official 5-hashtag cap (trade press, mid-2025). Not found in Academy or Newsroom this check.
- Official TikTok sentence that Search indexes on-screen / in-video text and that the first caption line should repeat the search query. Plausible and consistent with "clear captions" + CSI topic matching; **not verbatim-verified** on a primary page this check.
- Facebook Help wording on Reels descriptions / hashtags (fetch failed). Facebook Reels official character cap (not found).
- Instagram Help caption character cap (not stated). Graph API 2,200 / historical 30-hashtag table not re-quoted verbatim this check.
- 2026 parity of Instagram keyword search in Thai (2021 blog was English-first).
- TikTok's official in-app AI-label rules as they apply to captions (follow the in-app flow; do not invent caption legal language).
- YouTube Help page on "misleading metadata" as a standalone article (older URL https://support.google.com/youtube/answer/11675888 returned not found). The hashtag Help page still points at Misleading Metadata Policies; the Spam Policy covers malicious clickbait and scraped content.
- Any official Thai-specific ranking boost for Thai hashtags vs Thai keywords.

---

## House-style changes recommended

Proven house style to **keep**: three titles with ⭐; cover subtitles (on-cover, not SRT); YouTube Shorts description = narration-based text + disclaimer + hashtags; short IG/FB caption; TikTok one-liner; `อย่าแก้จุดนี้`; copy must follow `script.md` + `fact-check.md` + cover file + `delivery.md`; keep `ภาพจำลอง` / `ตัวละครสมมติ` / `แต่งเติมจากเรื่องจริง`; no unsupported absolutes, arrows, emoji, or `#fyp`; `#ทำไมล่ะ` on every platform; YouTube also `#TamMaiLa` and `#shorts`; status line with revision, approval, duration, cover, listen-check, and `MP4 ไม่ได้เช็ก`.

Changes, and why (also listed in the skill):

1. **Title length target ~40 characters** (hard max 100). Aligns publishing copy with cover-design CV11 and reduces overlay cut-off risk. Official cap is 100; the 40-character target is a channel convention, not a YouTube rule. Do not unlock a user-picked title only to shorten it (EP22 ⭐ is 42 characters — acceptable).
2. **No hashtags in the title**, including `#shorts`. Saves the 40-character budget; classification does not depend on the tag.
3. **YouTube description line 1 = hook / Thai search phrase**, then narration, then disclaimer, then hashtags. Exact fold length unverified; this still matches how people see a collapsed description.
4. **Do not teach "the first three YouTube hashtags appear above the title."** Official rule is "most engaging," cap 3 shown, and >60 ignored entirely. Keep 3–5 relevant tags.
5. **Keep `#shorts` in the YouTube description** as house convention, but document that it is not required for categorization.
6. **IG/FB: never exceed 5 hashtags**; default stays 3. Instagram Help is now a hard cap. Facebook official blogs recommend ≤5 and penalize tag stuffing.
7. **TikTok: default 3 relevant hashtags**, not 4 generic ones. Official Academy is 2–3. Going forward, prefer `#ทำไมล่ะ` + topic + one more, and drop a redundant generic (`#รู้หรือไม่` vs `#ความรู้รอบตัว`). Do not silently rewrite already-delivered Notion copy (e.g. EP22's four TikTok tags) unless the user asks.
8. **AI disclosure is an upload-flow setting**, not a substitute for the Thai reconstruction disclaimer.
9. **If a YouTube description is posted via API, count bytes.** Help vs API conflict is real for Thai.
10. **No third-party watermarks** when cross-posting the same original film (official Facebook guidance). Cross-posting the channel's own film is fine.

---

## Worked-example counts (EP22)

Used in the skill as the locked-title example.

| String | Characters |
| --- | --- |
| ถ้าคุณชิมกันพิษให้ฮ่องเต้… เขากินจริงมั้ย? | 42 |
| แผ่นเงินกันพิษในจานฮ่องเต้ ได้ผลจริงมั้ย? | 41 |
| เงินดำเพราะเจอพิษ? เชื่อแบบนี้ผิดนะ | 35 |
| YouTube line 1: ถ้าคุณเป็นขันที ชิมอาหารให้ฮ่องเต้จีน คุณต้องชิมก่อนทุกจาน | 58 |
| IG/FB caption as delivered | 241 characters, 3 hashtags |
| TikTok caption as delivered | 103 characters, 4 hashtags (recommend 3 on new episodes) |

---

## Recommended repo path

- Skill file: `.agents/skills/publishing-copy/SKILL.md` (same pattern as `.agents/skills/editorial/SKILL.md` and `.agents/skills/cover-design/SKILL.md`).
- In the same PR, add a row to the document index in `AGENTS.md` and an entry in `docs/context-map.md` (AGENTS.md requires a context-map update when a skill is added).
- Optional: symlink under `.claude/skills/publishing-copy` if that is still how other skills are mirrored; follow the repo's existing symlink pattern rather than inventing a new one.
- Do not put the only copy under `.codex/` or `.cursor/rules`. Those trees are not where editorial/cover-design live.

This filing follows that path: the skill, these notes beside it, the document-index row, the context-map entry, and the `.claude/skills/publishing-copy` symlink. The symlink target is `.agents/skills/`, matching cover-design and editorial (the other direction is used only for skills whose source of truth is `.claude/skills/`).
