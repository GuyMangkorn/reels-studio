---
name: publishing-copy
description: "Titles, cover subtitles, platform descriptions and hashtags for publishing ทำไมล่ะ (YouTube Shorts, long-form, IG/FB Reels, TikTok). Use when writing title, description, caption, hashtag, ชื่อคลิป, คำบรรยาย, แคปชัน, or publishing copy after a script is ready."
---

# Publishing copy for ทำไมล่ะ

**Status:** procedure for the coordinator. Research and platform rules checked 21 Nov 2026 (Asia/Bangkok). Path wording was aligned to this repo when the skill was filed. Do not post; the user approves every publish.

This skill writes the **publish package**: three title options, cover subtitle options, and captions/descriptions/hashtags for each platform. It does **not** design the cover picture, run Cover's two-pick flow, or invent a new hook. Titles and cover text follow the [cover-design skill](../cover-design/SKILL.md) (legitbait CV04, ~40-character titles [CV11](../cover-design/SKILL.md#4-title-cv11), cover text does not repeat the cover headline CV02). Claims and hedges follow the episode's fact-check and the [editorial skill](../editorial/SKILL.md). Audience-facing Thai follows the edu channel's [script rules](../../../channels/edu/script.md). Authoring in this file is English; do not rewrite approved Thai narration to sound more formal.

**Audience:** Thai viewers of ทำไมล่ะ (`edu`, mark `@TamMaiLa`). Keep casual spoken Thai and curiosity hooks. Do not gender the copy, and do not add slang the script does not use.

Registered in the [document index](../../../AGENTS.md#task-routing-and-ownership) and the [context map](../../../docs/context-map.md#covers-and-thumbnails). Platform quotes and unverified items: [research-notes.md](research-notes.md).

## When to use

Use this skill when the user asks for ชื่อคลิป, title, description, caption, hashtag, คำบรรยาย, แคปชัน, or "title description hashtag" for an episode, or when preparing copy to paste into YouTube Studio, Instagram, Facebook, or TikTok.

Do not use it to write the script, fact-check, or cover paintings. Cover owns the two-pick flow (task step W6c, [cover-design](../cover-design/SKILL.md)): five pictures, then five texts and five titles. If that pick is still open, draft the package from those candidates and mark what is still unlocked. Episodes finished before the Cover role (21 Nov 2026) record the same picks under Film.

## Do not

- Do not publish, schedule, or upload anywhere. Copy only.
- Do not claim you watched the final MP4. The status line always says `MP4 ไม่ได้เช็ก` unless the user already recorded a watch.
- Do not invent facts, numbers, names, or causes that `script.md` and `fact-check.md` do not support.
- Do not use arrows, emoji, or `#fyp` / `#สำหรับคุณ` / `#viral` / `#foryou` / `#foryoupage`.
- Do not use unsupported absolutes (ทุกคน, เสมอ, ที่สุด, ได้ผล 100%) unless Boat's verdict supports that wording.
- Do not change a user-locked title or locked cover text. Recommend alternatives beside it, with ⭐ on the locked or recommended option.
- Do not guess the series. Search every folder under `scripts/` on latest `main`. If the episode is missing, or exists in more than one series, stop and report.

## Inputs to read

Read latest `main` (do not assume a stale checkout). Episode folders and cover files are not zero-padded (`ep22`, `edu-ep22.ts`). For channel `edu` (ทำไมล่ะ), episode records live in `scripts/edu-series/` ([channel file](../../../channels/edu/channel.md)). Open every file below that exists:

| Input | Where it is | What you take from it |
| --- | --- | --- |
| Script | Current edu Short: `scripts/edu-series/epNN/short/script.md`. Older episodes often keep `scripts/edu-series/epNN/script.md` or `scripts/<series>/script.md`. A Long script, when one exists, is `scripts/<episode>/long/episode-script.md` or `scripts/<episode>/episode-script.md` ([files and stable IDs](../../../docs/delivery-workflow.md#files-and-stable-ids)) | Narration, hook, disclaimer label, what the film actually says |
| Fact-check | Beside that script. Current edu Shorts: `scripts/edu-series/epNN/short/fact-check.md`. Most older episodes: `scripts/<episode>/fact-check.md`. Also open `fact-check-r*.md` in the same folder when the script header names a later revision | Hedges, forbidden wording, scope limits |
| Research | `scripts/edu-series/epNN/research.md` (same `research.md` beside other episodes) | Background only; do not put unverified research into captions |
| Cover file | `src/videos/covers/edu-epNN.ts` when that file exists. Titles and cover lines are in its header comment; the module is registered from `src/videos/covers/index.ts`. Other covers in that folder use a slug (`wendigo.ts`, `everyone-gone.ts`, `everyone-gone-ep02.ts`, `zombie-condo2.ts`). Not every episode has a cover file | Picked picture, cover text, the five CV11 title candidates, lock vs candidate |
| Delivery record | `scripts/edu-series/epNN/delivery.md` (other episodes: `scripts/<episode>/delivery.md`) | Approval, duration, listen-check, render status. May be **stale** vs the cover file — report both and say which is later |
| Cover skill | [cover-design](../cover-design/SKILL.md) | Title formulas, legitbait, 40-character target, no cover/title word repeat |

If a path is missing, say so. Do not draft from memory of an older episode.

## Workflow

1. **Locate the episode on latest `main`.** Search every folder under `scripts/` for that `epNN`. One match: continue. No match, or the same `epNN` in more than one series folder: stop and report the paths. Do not guess the series.
2. **Read the inputs above.** Quote the locked title, locked cover text, script revision, fact-check revision, duration, and the disclaimer label the script or fact-check actually prints.
3. **Resolve lock vs candidate.** If the user already picked a title or cover text, that is ⭐. If Cover recommended one and the user has not picked, recommend it and say it is still a candidate (Film, on episodes finished before the Cover role). If `delivery.md` says the cover is missing but the cover file has a pick, trust the cover file and note the stale delivery line. Title candidates and cover lines live in the cover file's header comment.
4. **Draft three titles** (see [Titles](#titles)). Prefer the locked or Cover-recommended title as ⭐ (Film, on episodes finished before the Cover role). Every option must pass legitbait: a viewer who watches to the end agrees the promise was kept. Hook in the first few words. About 40 characters or fewer (hard max 100). No hashtags and no emoji in the title.
5. **Draft cover subtitle options** — the on-cover sub-line(s), **not** SRT. If the cover file already has locked lines, ⭐ those exact words. Do not add a third line. Do not put the cover headline words into the title (CV02).
6. **Write platform copy** from the script, in the [output template](#output-template). YouTube Shorts description is narration-based: hook on line 1, then the spoken story, then the disclaimer line, then hashtags. IG/FB is short. TikTok is a one-liner plus hashtags. Use the episode's actual disclaimer label.
7. **Write `อย่าแก้จุดนี้`** — every hedge the fact-check requires (full list on the Notion/package page; the top two or three in a chat report).
8. **Write the status line** and GitHub `main` source links (script, fact-check, research, cover, delivery).
9. **Self-check** with the [checklist](#rules-and-hedges-checklist). Count title characters. Count hashtags per platform. Confirm no `#fyp`, no emoji, no arrows, no unsupported absolutes.
10. **Hand back** the package. Do not post. Do not update Notion unless the user asked for that in the same request.

## Titles

Align with cover-design [CV11](../cover-design/SKILL.md#4-title-cv11). Do not invent a parallel title system. Cover's pick 2 already writes **five** title candidates in the cover file. This package shows **three** of them: ⭐ is the locked title, or Cover's recommendation when the user has not picked, plus two alternates that stay legitbait and do not repeat the locked cover words. Do not mint a formula the cover file does not have, unless no cover file exists yet; then draft three that still follow CV11 and say they are unpublished candidates.

- Three rows, table with ⭐ on the recommended or already-locked title.
- Hook (`คุณ`, the danger, the number, the contradiction) in the **first three words** when the language allows it. Name a situation the viewer can picture, not the textbook term.
- Target **about 40 characters or fewer** so the Shorts overlay is less likely to cut the title. Official hard limit is 100 characters (YouTube Help, same in the Thai Help Center). Count in the destination app before upload. The exact overlay cutoff is **not published by YouTube**; 40 is this channel's convention.
- No hashtags in the title (`#shorts` lives only in the YouTube description).
- No emoji in publishing titles or captions (stricter than cover-design's "at most one emoji at the end").
- `…` only before a payoff clause that names something; never a bare teaser.
- Extremes only when Boat supports them.
- The title asks; the cover shows. Locked cover words do not repeat in the title.
- Long-form YouTube uses the same title rules and the same 100-character limit if a long-form cut is requested. This channel is Shorts-first.

## Cover subtitles

- These are the words **on the cover**, not burned-in SRT.
- Offer three options. If Cover (Film, on episodes before the Cover role) or the user already locked one or two short lines, ⭐ the locked wording and do not "improve" it.
- Keep hedges that are on the cover (`เกือบ`, `?`, a question instead of a hard claim).
- CV02: one headline plus at most one short sub-line; one to three big words is the strongest default. Do not add a third line on the cover, and do not write a sentence that will be unreadable at grid size. The three rows are alternative lines, not three lines on one cover.

## Platform copy

The disclaimer line uses the words the script or fact-check prints. [ER11](../../../channels/edu/script.md#er11) names the on-screen honesty labels `เรื่องสมมุติ` and `แต่งเติมจากเรื่องจริง`. Reconstructions in this series also print `ภาพจำลอง` (EP17). Do not swap a label the files already chose. EP22's script describes a staged reconstruction in English and does not print a Thai label; the worked example is that episode's delivered caption wording (`ภาพจำลองเหตุการณ์` / `ตัวละครสมมติ`), not a new default for every episode.

### YouTube Shorts

- **Title:** the ⭐ title, max 100 characters, target ~40.
- **Description structure:**
  1. Line 1: the searchable hook in Thai (the phrase people would type, matching the title promise).
  2. Narration-based body, shortened only when a fact-check hedge requires it. Keep the story order. Do not start with `EP22`, credits, or hashtags.
  3. One disclaimer line, using the label named above.
  4. Hashtags last, one line: `#ทำไมล่ะ #TamMaiLa #shorts` plus at most one or two topical tags (`#ประวัติศาสตร์`, `#วิทยาศาสตร์`, `#ความรู้รอบตัว` when they truly fit).
- **Hashtag count:** 3–5 relevant tags. Official rule: more than 60 hashtags and **every** hashtag on that video is ignored; over-tagging can also hurt search. Official rule for the tags by the title: *up to three hashtags that are considered most engaging will appear by your video title* — not necessarily the first three. Still keep the set small and relevant. Do not use misleading or unrelated tags.
- `#shorts` is **not required** to classify a Short. Since 15 Oct 2024, a square or vertical video up to three minutes is a Short because of format and duration. Keep `#shorts` in the description as house convention (hashtag page and habit). Do not put it in the title. Any extra ranking benefit is **unverified**.
- Official description cap: 5,000 **characters** in YouTube Studio / Help (Thai Help: สูงสุด 5,000 ตัว). YouTube Data API: 5,000 **bytes**. Thai UTF-8 is usually 3 bytes per letter, so an API upload can hit the cap much sooner. House descriptions are normally well under both; if anyone posts via API, count bytes. API also forbids `<` and `>` in title and description.
- Studio **tags** (the keyword field, not hashtags) "play a minimal role" except for common misspellings. Do not spend effort stuffing them.
- **AI disclosure** in Studio (`AI use` under Attributes) is separate from the caption disclaimer. Use the Studio toggle when the film is realistic or meaningfully AI-altered and could mislead viewers about what happened. Production help (scripts, titles, captions) does not require disclosure. Non-realistic / clearly illustrated work usually does not. A painted reconstruction of a real person or event that looks real needs a coordinator/Boat call. Disclosure is not a free pass around Community Guidelines. Never replace `ภาพจำลอง` / `แต่งเติมจากเรื่องจริง` with an AI label.

### YouTube long-form (only if requested)

Same title and description limits. Hook on line 1, then a longer body, then the disclaimer, then the same small hashtag set (`#shorts` is unnecessary on a horizontal long-form video). Chapters, if used, come before corrections. Do not treat long-form as the default.

### Instagram Reels and Facebook Reels

- One short caption for both, unless a platform-specific hedge is needed.
- Line 1: hook / searchable keywords in Thai, in the **caption**, not in a comment (Mosseri, Instagram Search blog, 25 Aug 2021). Then two or three supported facts. Then the disclaimer in parentheses. Then hashtags.
- **Hashtags:** `#ทำไมล่ะ` plus two topical tags. **Hard max on Instagram: 5.** Official Help (checked 21 Nov 2026): "You can use up to 5 tags on a post. If you include more than 5 tags on a single photo/video, your comment won't post." Facebook has no official hard cap found in Help this check; Meta's creator blog (24 Apr 2025 and 14 Jul 2025) says content with **no more than 5 hashtags** performs best, and long hashtag-stuffed or irrelevant captions can be shown only to followers and lose monetization. Follow 3, never more than 5.
- Instagram Help does not state a caption character limit. Meta's Graph API is the usual official source for a 2,200-character cap (confirm the caption parameter if uploading via API). House captions stay far below that. Facebook Reels description length was **not** found as an official hard cap this check; keep it as short as the IG caption.
- Hashtags help Search / hashtag pages more than they are proven to boost the Reels tab or Feed. Irrelevant tags can hurt.
- Meta **AI info** labels (self-disclosure or industry signals) apply to photorealistic or AI-generated/altered media on Facebook, Instagram, and Threads. Use the in-app disclosure when the upload flow asks. That does not replace the Thai disclaimer line.

### TikTok

- One-liner: hook plus a short parenthetical disclaimer when the fact-check requires it. Then hashtags.
- Official Creator Academy (*Elements of a TikTok video*, article still published as of this check; content timestamp 18 Aug 2026): write a clear caption so viewers understand the video; "When it comes to hashtags, less is more, so we encourage you to use **2 to 3 relevant hashtags** on each video."
- House default: **3 tags** — `#ทำไมล่ะ` plus one or two topical tags. Do not use four generic tags if two of them are interchangeable (`#รู้หรือไม่` and `#ความรู้รอบตัว`). Never `#fyp` or equivalents.
- A mid-2025 "5 hashtag cap" appears in trade press only. **Unverified** in official Help or Academy this check. Follow the official 2–3 guidance anyway.
- Official API caption limit (Direct Post, last updated 27 Oct 2026): 2,200 **UTF-16 runes**. An in-app 4,000-character figure is often repeated; **unverified** in official Help this check. One-liners are far under both.
- FYP recommendations use "video information, which might include details like captions, sounds, and hashtags," at lower weight than user interactions (TikTok Newsroom, *How TikTok recommends videos #ForYou*). Official wording that search matches **on-screen video text** was **not** re-verified on a primary Academy page this check. Still put the search phrase in the visible caption (and keep on-screen text consistent with the script) so the video can match Thai queries.
- A claimed TikTok in-app hashtag or caption cutoff other than the API figure is **unverified**.

## Output template

Use this shape in chat and on the Notion copy page. Label the package `จากแชท` when it is new chat copy, `ร่างใหม่` when replacing older draft copy, or `ไม่มีใน repo` only when the episode has no repo sources.

````markdown
## EPNN · <⭐ title>

สถานะ: <script revision and approval> · <duration> · <cover lock or candidate> · <title lock or candidate> · <listen-check if any> · จากแชท · MP4 ไม่ได้เช็ก

### ชื่อคลิป

|  | ตัวเลือก |
| --- | --- |
| ⭐ | <title, ~40 characters> |
| 2 | <alternative formula> |
| 3 | <alternative formula> |

<one or two sentences on why ⭐, and any title-specific hedge>

### Subtitle บนปก

<state the picked picture and locked cover lines, or say they are still candidates>

|  | ตัวเลือก |
| --- | --- |
| ⭐ | <locked or recommended cover sub-line> |
| 2 | <option> |
| 3 | <option> |

### YouTube Shorts

```
<hook line — searchable Thai phrase>
<body from narration>
<disclaimer line>
#ทำไมล่ะ #TamMaiLa #<topic> #shorts
```

### IG/FB Reels

```
<hook line>
<two or three supported facts>
(<disclaimer>)
#ทำไมล่ะ #<topic> #<topic>
```

### TikTok

```
<one-liner hook> (<disclaimer if needed>)
#ทำไมล่ะ #<topic> #<topic>
```

### อย่าแก้จุดนี้

- <fact-check hedge>
- <fact-check hedge>
- <disclaimer / scope hedge>

แหล่งข้อมูล: [script](https://github.com/GuyMangkorn/reels-studio/blob/main/...) · [fact-check](...) · [research](...) · [cover](...) · [delivery](...)
````

Close the inner platform blocks with a fenced code block in the actual deliverable (three backticks). In Notion, write the append file first and insert it; do not retype Thai copy by hand.

## House-style changes (vs older delivered copy)

Keep the proven format: 3 titles with ⭐, cover subtitles, narration-based YouTube description, short IG/FB, TikTok one-liner, `อย่าแก้จุดนี้`, status line, `#ทำไมล่ะ` everywhere, YouTube also `#TamMaiLa` and `#shorts`, no `#fyp`, no emoji, no arrows.

Adjustments from the 21 Nov 2026 research, and why:

| Change | Why |
| --- | --- |
| Aim for titles of about 40 characters (hard max still 100). Do not put `#shorts` or other tags in the title. | Official title cap is 100. Overlay truncation is unpublished; cover-design CV11 already uses ~40 so the Shorts overlay is less likely to cut the hook. EP22's locked ⭐ title is 42 characters — close enough; do not unlock or rewrite a picked title just to shave two characters. |
| YouTube description line 1 is the hook / search phrase, then narration, disclaimer, hashtags last. | Official discovery pages emphasize what viewers search and click. A first line buried under episode numbers or tags wastes the visible fold. Exact "more" truncation length is **unverified**. |
| YouTube hashtags: 3–5 only. Do not claim that "the first three" automatically appear above the title. | Official wording is "up to three hashtags that are considered most engaging," and >60 tags causes **all** hashtags to be ignored. |
| Keep `#shorts` in the YouTube description only, and say it is not what makes the video a Short. | Official: after 15 Oct 2024, square or vertical ≤3 minutes is a Short. |
| Instagram / Facebook: never more than 5 hashtags; default remains 3. | Instagram Help is now a hard 5-tag cap. Meta recommends ≤5 on Facebook and penalizes hashtag-stuffed captions. |
| TikTok: default 3 relevant hashtags, not 4 generic ones. | Official Academy: 2–3 relevant tags, "less is more." EP22's delivered TikTok line used 4; new copy should drop the weaker generic tag. |
| Treat Studio/in-app AI disclosure as a separate upload step, not a caption substitute. | Official YouTube and Meta rules. House disclaimers stay. |
| If posting a YouTube description via API, count bytes, not only characters. | Help says 5,000 characters; Data API says 5,000 bytes. |

## Rules and hedges checklist

- [ ] Script, fact-check, cover file, and delivery record were all read; lock vs candidate is stated.
- [ ] Series uniqueness checked on latest `main`.
- [ ] ⭐ title is locked or recommended, legitbait-true, ~40 characters, no hashtags, no emoji.
- [ ] Cover subtitle is the on-cover line(s), not SRT; locked words unchanged; title does not repeat the cover headline.
- [ ] Every number, name, and cause in the captions appears in the script and survives the fact-check (ถ้า / อาจ / ราว ๆ / แทบ / น่าจะ / เกือบ as required).
- [ ] The disclaimer on every platform is the label the script or fact-check names (ER11: `เรื่องสมมุติ` / `แต่งเติมจากเรื่องจริง`; reconstructions in this series also use `ภาพจำลอง`).
- [ ] Hashtags: `#ทำไมล่ะ` on every platform; YouTube also `#TamMaiLa` and `#shorts`; IG/FB ≤5 (default 3); TikTok 2–3; no `#fyp` or spam tags; no spaces inside a tag.
- [ ] No arrows, no emoji, no unsupported absolutes, no unrelated tags.
- [ ] Status line includes revision, approval, duration, cover, listen-check, and `MP4 ไม่ได้เช็ก`.
- [ ] Source links point at `GuyMangkorn/reels-studio` `main`.
- [ ] Copy was not posted.

## Policy notes (short)

- **Misleading / clickbait:** YouTube Spam Policy bans malicious clickbait — titles, thumbnails, or descriptions that promise something the video does not deliver. This is the same test as legitbait (CV04). Unrelated hashtags are also banned on YouTube and discouraged on Meta and TikTok.
- **Reused content:** This channel's films must stay original (own script, voice, pictures). YouTube TeamYouTube (1 Oct 2026) said Shorts recommendations now further prioritize original content and reduce reach of re-uploads with no added value. YouTube's YPP reused-content rule is a separate monetization policy at channel level. Facebook (14 Jul 2025) reduces distribution of unoriginal copies and of videos with visible third-party watermarks. Do not export a TikTok/IG watermark onto a YouTube or Facebook upload.
- **AI / altered content:** YouTube requires Studio disclosure for realistic or meaningfully altered content; illustrated/non-realistic work and title/script/caption assistance generally do not. Meta applies "AI info" labels from self-disclosure or industry signals; high-risk deceptive media can get a stronger label or removal if it violates Community Standards. Caption disclaimers remain mandatory whenever the script is a reconstruction, a hypothetical, or fiction built on a real case.
- **Thai language:** Official character limits are the same as English (YouTube: 100 / 5,000 อักขระ). Hashtags cannot contain spaces, so `#ทำไมล่ะ` is one token; do not split tone marks. Write the words Thai viewers would type. Instagram's 2021 Search blog said keyword search launched with a focus on English; **whether Thai keyword search is at full parity in 2026 is unverified** — still put Thai keywords in the title and caption. Always re-count in the official app.

## Worked example — EP22 (delivered, locked title and cover)

Sources on `main`: [script R3](https://github.com/GuyMangkorn/reels-studio/blob/main/scripts/edu-series/ep22/short/script.md), [fact-check](https://github.com/GuyMangkorn/reels-studio/blob/main/scripts/edu-series/ep22/short/fact-check.md), [cover](https://github.com/GuyMangkorn/reels-studio/blob/main/src/videos/covers/edu-ep22.ts), [delivery](https://github.com/GuyMangkorn/reels-studio/blob/main/scripts/edu-series/ep22/delivery.md).

Locked by the user (delivery record, 2026-11-17): picture P2, cover text C3 `เกือบ 30 จาน` / `ไม่แตะ!`, title T1. Published cut 57.23 seconds (the narration lock including the hold is 57.24 s; cite the published cut). Delivered caption disclaimer: ภาพจำลอง / ตัวละครสมมติ. Character counts: ⭐ title 42, option 2 is 41, option 3 is 35. Option 2 is cover-file T2. Option 3 is T5. T3 and T4 repeat the locked C3 words, so they are not in this package.

### ชื่อคลิป

|  | ตัวเลือก |
| --- | --- |
| ⭐ | ถ้าคุณชิมกันพิษให้ฮ่องเต้… เขากินจริงมั้ย? |
| 2 | แผ่นเงินกันพิษในจานฮ่องเต้ ได้ผลจริงมั้ย? |
| 3 | เงินดำเพราะเจอพิษ? เชื่อแบบนี้ผิดนะ |

ข้อ ⭐ คือชื่อ T1 ที่ผู้ใช้เลือกแล้ว และไม่ทับข้อความบนปกที่เลือก ข้อ 3 ต้องไม่ถูกอ่านว่าเงินจับพิษไม่ได้ทุกกรณี นอกจากที่สคริปต์บอกเรื่องกำมะถันในไข่ต้ม

### Subtitle บนปก

ภาพปกที่เลือกแล้วคือ P2 ข้อความบนปกที่เลือกแล้วคือ «เกือบ 30 จาน» กับ «ไม่แตะ!» (C3) ต้องเก็บคำว่า «เกือบ»

|  | ตัวเลือก |
| --- | --- |
| ⭐ | เกือบ 30 จาน ไม่แตะ! |
| 2 | โต๊ะนี้ กินมั้ย? |
| 3 | เงินจับพิษ จริงเหรอ? |

### YouTube Shorts

Line 1 is already the hook (ขันที ชิมอาหาร ฮ่องเต้). Hashtags are five and relevant. Keep this body.

```
ถ้าคุณเป็นขันที ชิมอาหารให้ฮ่องเต้จีน คุณต้องชิมก่อนทุกจาน
แต่ฮ่องเต้องค์สุดท้าย ไม่แตะโต๊ะเกือบสามสิบจานนั้นเลยนะ
อ้าว แล้วเด็กคนนี้กินอะไร?
ปูยีกินกับข้าวที่ฝั่งไทเฮาส่งมาต่างหาก ราว ๆ ยี่สิบจาน
แต่ถ้าไม่กิน โต๊ะยาวนั่นตั้งไว้ทำไม?
ดูก่อนนะ ทุกจานมีแผ่นเงินเล็ก ๆ ใส่ไว้กันพิษ
ขันทีชิมจานละนิดก่อนยกมา แล้วขันทีน้อยก็ร้อง เปิดฝา
ยิ่งด่านเยอะ ยิ่งดูปลอดภัย ใช่ไหม?
แต่แผ่นเงินเนี่ย จับพิษได้จริงเหรอ?
ไข่ต้ม ยังทำเงินดำได้เลย
ในไข่มีกำมะถัน เงินดำเพราะมัน ไม่ใช่เพราะพิษ
พิษที่ไม่มีกำมะถัน เงินก็เฉย
ด่านนี้ ดูปลอดภัยกว่าที่เป็นนะ
แล้วตกลง โต๊ะยาวนั่นมีไว้ทำไม?
เพราะมันทำไว้โชว์ ไม่ได้ทำไว้กิน
โต๊ะยาวนั่น มีไว้ให้ดูจริง ๆ ส่วนที่ปูยีกินจริง คือจานตรงหน้าเขา
ภาพจำลองเหตุการณ์ ตัวละครสมมติ
#ทำไมล่ะ #TamMaiLa #ความรู้รอบตัว #ประวัติศาสตร์ #shorts
```

### IG/FB Reels

Three hashtags, hook first, disclaimer present. This already matches the tightened rule.

```
ถ้าคุณชิมกันพิษให้ฮ่องเต้ เขากินจริงมั้ย?
ฮ่องเต้องค์สุดท้าย ไม่แตะโต๊ะเกือบสามสิบจานนั้นเลยนะ
ส่วนที่ปูยีกินจริง คือจานตรงหน้าเขา
แผ่นเงินดำเพราะกำมะถันในไข่ต้ม ไม่ใช่เพราะพิษ
(ภาพจำลอง · ตัวละครสมมติ)
#ทำไมล่ะ #ความรู้รอบตัว #ประวัติศาสตร์
```

### TikTok

Delivered line used **four** hashtags. For new episodes, drop the weaker generic tag and keep three, for example:

```
ถ้าคุณชิมกันพิษให้ฮ่องเต้ เขากินจริงมั้ย? (ภาพจำลอง)
#ทำไมล่ะ #ประวัติศาสตร์ #ความรู้รอบตัว
```

Do not silently rewrite already-delivered EP22 copy on Notion unless the user asks. The three-tag version is the pattern going forward.

### อย่าแก้จุดนี้

- ห้ามโยงการชิมของขันทีกับโต๊ะที่ปูยีไม่แตะจนกลายเป็นประโยคว่าชิมแล้วไม่มีใครกิน
- เก็บ «เกือบ» ที่โต๊ะเกือบสามสิบจาน และ «ราว ๆ» ที่ยี่สิบจานของฝั่งไทเฮา
- เงินดำเพราะกำมะถันในไข่ต้ม ไม่ใช่เพราะพิษ ห้ามเขียนว่าแผ่นเงินจับพิษได้
- ขอบเขตคือฮ่องเต้องค์สุดท้ายแห่งชิงและคำบอกเล่าของปูยี ฉากใบหน้า ท่าทาง และไข่ต้มเป็นภาพจำลอง

สถานะตัวอย่าง: สคริปต์ R3 อนุมัติแล้ว · คัตสุดท้ายผ่านแล้ว 57.23 วินาที · ภาพปก P2 และข้อความ C3 ล็อกแล้ว · ชื่อ T1 ล็อกแล้ว · จากแชท · MP4 ไม่ได้เช็ก

## Sources

Primary sources, all opened or extracted 21 Nov 2026 (Asia/Bangkok). Fuller quotes, conflicts, and unverified items live in [research-notes.md](research-notes.md) beside this skill.

- YouTube Help, *Edit video settings*: title 100 characters, description 5,000 characters — https://support.google.com/youtube/answer/57404 (Thai: same limits as อักขระ, `?hl=th`)
- YouTube Help, *Get started creating YouTube Shorts*: title max 100 — https://support.google.com/youtube/answer/10059070
- YouTube Help, *Find playlists & videos using hashtags*: >60 hashtags ignored; up to three "most engaging" appear by the title; no spaces; no misleading tags — https://support.google.com/youtube/answer/6390658
- YouTube Help, *Understand three-minute YouTube Shorts*: from 15 Oct 2024, square or vertical ≤3 minutes is a Short — https://support.google.com/youtube/answer/15424877
- YouTube Blog, *Tall updates coming to Shorts*, 3 Oct 2024 — https://blog.youtube/news-and-events/tall-updates-coming-to-shorts/
- YouTube Help, *Upload YouTube Shorts*: square or vertical, up to 3 minutes — https://support.google.com/youtube/answer/12779649
- YouTube Help, *Spam Policy*: malicious clickbait, scraped content, mass-produced AI spam; AI disclosure is not a free pass — https://support.google.com/youtube/answer/2801973
- YouTube Help, *Disclosing use of GenAI content* — https://support.google.com/youtube/answer/14328491
- YouTube Help, *Channel monetization policies* (reused / inauthentic content) — https://support.google.com/youtube/answer/1311392
- YouTube Data API, `videos` resource: title 100 characters, description 5,000 bytes — https://developers.google.com/youtube/v3/docs/videos
- TeamYouTube community post, *Prioritizing original content on Shorts*, 1 Oct 2026 — https://support.google.com/youtube/thread/470890423
- TikTok Creator Academy, *Elements of a TikTok video*: 2–3 relevant hashtags, clear captions — https://www.tiktok.com/creator-academy/en/article/elements-of-tiktok-video
- TikTok Newsroom, *How TikTok recommends videos #ForYou*: captions, sounds, hashtags as video information — https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you
- TikTok for Developers, Direct Post: caption 2,200 UTF-16 runes, last updated 27 Oct 2026 — https://developers.tiktok.com/doc/content-posting-api-reference-direct-post
- Instagram Help, *Use hashtags on Instagram*: max 5 tags — https://help.instagram.com/351460621611097
- Adam Mosseri, *Breaking Down How Instagram Search Works*, 25 Aug 2021: keywords and hashtags in the caption, not comments — https://about.instagram.com/blog/announcements/break-down-how-instagram-search-works
- Meta, *Our Approach to Labeling AI-Generated Content and Manipulated Media*, 5 Apr 2024, updates through 23 Oct 2025 — https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/
- Facebook for Creators, *Cracking down on spammy content*, 24 Apr 2025: ≤5 hashtags perform best — https://creators.facebook.com/blog/cracking-down-on-spammy-content
- Facebook for Creators, *Combating Unoriginal Content*, 14 Jul 2025: ≤5 hashtags, no links, minimal caps; no third-party watermarks — https://creators.facebook.com/blog/combating-unoriginal-content
