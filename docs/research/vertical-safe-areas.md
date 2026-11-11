# Vertical safe areas for Shorts, TikTok and Reels (top and bottom)

Research note, 3 Nov 2026. Question from the user: the released clip has a safe-area problem at the top of the phone; and can the bottom limit (caption bottom edge y 1248) move lower? All figures are on a 1080×1920 frame. Primary sources are linked inline. Third-party sources are marked **(third-party)**. Figures I derived myself are marked **(derived)**. Points that no source settled are marked **(uncertain)**.

This note proposes a rule change. It does not change [production-requirements](../production-requirements.md#vertical-caption-safe-zone); the user reviews the change first ([DP01](../contributing.md#tools-and-document-improvements)).

## Summary

- **Most likely top problem: the channel mark `@TamMaiLa`.** It is drawn at x 61–182, y 67–84 (22 px) on every frame of EG-EP01-SHORT and WDG-EP01-SHORT. That spot sits under the phone's status bar: the clock is top-left on iPhone. TikTok's LIVE icon and the YouTube Shorts header row are also there. On phones taller than 9:16 the mark can also fall into the cropped left edge. WDG-EP01-SHORT has a second top item: the fact/fiction marker pill at y 94–150 (text y 105–142), under the status bar and the header/tab row.
- **Top margin from the platforms:** YouTube 288 px ([Google Ads](https://support.google.com/google-ads/answer/9128498?hl=en), primary). Meta Reels 14 % = 269 px ([Meta Ads Guide](https://www.facebook.com/business/ads-guide/update/video/instagram-reels), primary). TikTok about 240 px (third-party reading of TikTok's template). The current box's 288 px top edge is already the strictest of these. The gap is in scope: the rule covers caption lines only, and the mark is placed outside the box on purpose.
- **Bottom:** every platform figure that exists, all of them for **ads**, keeps about 35 % clear (Google 672 px, Meta 35 % = 672 px, TikTok about 660 px). No platform publishes an organic figure. The organic bottom UI is smaller: no CTA button and no ad label. Third-party estimates put it at about 300–420 px on YouTube Shorts. A cross-platform limit of **y 1344** (576 px, 30 % clear) is a reasonable organic Default. **y 1440** (480 px, 25 %) is possible only after a real-device check. Ads and boosted posts keep y 1248.
- **Recommended mark placement:** inside the safe box, at top-left x 120, glyph top y ≥ 296, about 30 px instead of 22 px. On a phone, 22 px is about 8 pt.

## 1. Platform overlays: primary sources

### YouTube Shorts

- **Google Ads, vertical video ads (primary).** [Use square and vertical video to engage mobile customers](https://support.google.com/google-ads/answer/9128498?hl=en) shows a safe-zone diagram, "YouTube | Vertical Video Ads, dimensions in pixels", at 1080×1920 ([image](https://storage.googleapis.com/support-kms-prod/jbb4hOyc2nGdunbKddqpFAEQpHOQvy582jIR)). Its margins are **top 288, bottom 672, left 48, right 192** px, so the safe box is x 48–888, y 288–1248. The page says to keep "logo, product, and supers" inside the red safe area, and that overlays and buttons "may appear in different places depending on the format". Scope: **ads** in Shorts, in-stream and in-feed.
- **Shorts ads overlays (primary).** [Your guide to YouTube Shorts ads](https://support.google.com/google-ads/answer/16041697?hl=en) lists the right-hand panel (like, dislike, comment, share), the channel name and description (truncated to 1 line on mobile), and a CTA button from 3 s (10 s for Video View/Reach campaigns). It gives no positions.
- **Organic Shorts (primary, qualitative).** YouTube's editor shows "visual guides" for "where elements like the like button, comments, and video description might appear for viewers". It also shows animated white lines near the screen edge to mark a "non-safe" area ([YouTube Help, Enhance your Shorts – Android](https://support.google.com/youtube/answer/16215842?hl=en)). YouTube publishes no organic pixel figures.
- **What the zones cover:** at the top, the phone status bar and the Shorts header row (search and menu icons, right side). At the bottom: the channel row and subscribe button, the title or description, the audio/remix row, the progress bar, and the app's bottom navigation bar when the video runs under it. On the right, the like/dislike/comment/share/remix rail (Google: 192 px). The top-row description is **(third-party)**: [upload-post](https://www.upload-post.com/tools/safe-zone-checker/) ("search icons at the top").

### TikTok

- **TikTok Ads Manager (primary, numbers not readable).** [Video ads specifications](https://ads.tiktok.com/help/article/video-ads-specifications?lang=en) says "The safe zone size is determined by the dimension (vertical, horizontal, or square)". It ships the In-Feed safe zones as downloadable .zip templates (standard, with anchor, and right-to-left Arabic versions), and warns of "slight differences between the preview and the live version". The [TopView spec](https://ads.tiktok.com/help/article/tiktok-reservation-topview?lang=en) adds that "the longer the caption, the smaller the safe zone will be". It also says ads with "text, logos, and/or key messages located fully or partially within the area highlighted in red (for the top and bottom of the screen)" in the Ad Preview Tool are rejected. I did not download the zip templates (a download needs the user's approval), so no primary pixel figures are given here.
- **Template figures (third-party).** [upload-post](https://www.upload-post.com/tools/safe-zone-checker/) reads the In-Feed template, drawn at 720×1280, as **top 240, bottom 660, left 120, right 120** px at 1080×1920, plus a 300 px right button column from y 840 down. Other third-party figures disagree: [Adnabu](https://blog.adnabu.com/tiktok/tiktok-ad-specs/) gives top 160 / bottom 440 / sides 80 (probably 540×960 scale). [AdKit](https://adkit.so/tools/safe-zones/tiktok) gives bottom 707 and a 242 px right column, measured from ad previews in March 2026.
- **What the zones cover:** at the top, the status bar, LIVE (top-left), the "Following | For You" tabs (centre) and search (right). At the bottom: the username, the description (it expands, so longer text covers more), the music ticker, and the bottom tab bar. On the right, the avatar/follow, like, comment, save and share column. These are general app knowledge, **(uncertain)** as to exact pixels.

### Instagram Reels and Facebook Reels

- **Meta Ads Guide, Instagram Reels (primary).** [Ads guide: Instagram Reels video](https://www.facebook.com/business/ads-guide/update/video/instagram-reels) says to leave **14 % at the top, 35 % at the bottom and 6 % on each side** clear of text, logos and other key elements. At 1080×1920 that is top 269, bottom 672 and sides 65 px **(derived)**. The guide gives the reasons: avoiding overlap with the profile icon and call to action, and keeping content off the screen edges **on tall devices**. Scope: **ads**. The Facebook Reels ads-guide URL returned 404 on 3 Nov 2026. Meta's help article on Stories and Reels text overlays and safe zones ([980593475366490](https://www.facebook.com/business/help/980593475366490)) did not render its body.
- **Third-party notes.** Reels ads that carry a disclaimer keep the bottom 40 % (768 px) clear, and Meta may zoom and trim the edges on screens taller than 9:16 ([upload-post](https://www.upload-post.com/tools/safe-zone-checker/), third-party). Meta publishes no organic Reels figures ([admanage](https://admanage.ai/instagram-reels-safe-zone), third-party).
- **What the zones cover:** at the top, the status bar, the "Reels" title and the camera icon. At the bottom: the account row and follow button, the caption, the audio row, and the tab bar. On the right, like/comment/share/audio.

### Ads versus organic

All published numbers are **ad** guidance. Ads add overlays that organic posts lack: the CTA button, the "Sponsored"/ad label, anchors and disclaimers. Google and Meta say they cover the bottom band. Third-party guides say the same thing about organic posts: they say ad figures "should not be presented as permanent pixel rules for all organic Shorts, Reels or TikToks" ([reap.video](https://reap.video/blog/short-form-video-safe-zones), third-party). Reap gives a conservative organic range of top about 15 % and bottom 25–35 % (480–672 px). Third-party estimates of the organic YouTube Shorts bottom UI run from about 300 to 420 px, or about 360 px with the description expanded ([search summary of vidpros, postplanify and others](https://vidpros.com/vertical-video-safe-zone/), third-party, **uncertain**).

## 2. Device aspect: taller phones, notch, Dynamic Island

Modern phones are taller than 9:16. An iPhone 15/16 Pro is 393×852 pt, about 19.5:9. A 9:16 video is shown in one of two ways:

| Display mode **(derived)** | Video scale | What is lost or covered |
| --- | --- | --- |
| Fill the full screen height (aspect-fill, sides cropped) | 852 pt / 1920 px = 0.444 pt/px | Visible width ≈ 886 px of 1080: **about 97 px cropped each side**. A 59 pt status bar covers **y 0–133**. A 34 pt home indicator covers the bottom 77 px. |
| Fill the area above a bottom tab bar (about 83 pt with home indicator) | 769 / 1920 = 0.400 pt/px | About 49 px cropped each side. Status bar ≈ y 0–147. |
| Fit width, top-aligned (letterbox below) | 393 / 1080 = 0.364 pt/px | No side crop. Status bar ≈ y 0–162. |

- The 59 pt top inset on Dynamic Island iPhones is **(third-party)**: a community answer reporting `safeAreaInsets.top`, [mirrored here](https://developer.cloud.tencent.cn/ask/sof/107340426). Apple's own documentation was not reached. Which mode each app uses on each device is **(uncertain)**: no platform documents it. Meta's guide names "tall devices" as one reason for its 6 % side margin, which fits with side cropping.
- **Consequence:** in every mode, the status bar and Dynamic Island cover roughly the top **130–160 px** of the video. The app's own header/tab row lies below that (the YouTube Shorts header, TikTok tabs, the Reels title). Together they plausibly reach the 240–288 px that the templates give **(derived)**. Side cropping of up to about 97 px means anything left of x 97 can be cut on a 19.5:9 phone.

## 3. What our released Shorts put near the top

Code at this checkout (`claude/eg-ideal-remaining-c19f75`). Measured frames were taken from the stored delivery renders with ffmpeg: EG-EP01-SHORT_A_fade.mp4 (`~/ReelsStore/projects/legacy/EG/renders/EG-EP01-SHORT/52a5a269e2c4-dirty-202611031603/`) frame 300, and WDG-EP01-SHORT.mp4 (`~/ReelsStore/projects/legacy/WDG/renders/WDG-EP01-SHORT/094d9082b774-dirty-202611031623/`) frame 1300.

| Element | Where | y range (px) | x range (px) | Problem |
| --- | --- | --- | --- | --- |
| Channel mark `@TamMaiLa`, 22 px, every frame | `src/scenes/SceneRenderer.tsx:135` (`top: 60, left: 60`); default in `src/scenes/media.ts:169` | glyphs **67–84** (measured, EG f300) | 61–182 | Under the status bar (the iPhone clock is top-left), TikTok LIVE and the Shorts header. Left of the possible 97 px side crop. Tiny on a phone: 22 px ≈ 8–10 pt. |
| WDG fact marker `ข้อมูลจริงจากตำนานและประวัติศาสตร์`, G1262 to end | `src/videos/wendigo/chrome.tsx:38` (pill rect y 94–150) | pill 94–150, text **105–142** (measured, f1300) | pill 120–960, text 276–805 | Fully above y 288: under the status bar and header/tab row for about half of the video. |
| WDG fiction marker `เรื่องแต่ง`, G0–38 | `chrome.tsx:37` | pill 94–150 | 400–680 | Same band, about 1.3 s at the start. That start is the hook frame. |
| WDG title `WENDIGO` (170 px) and `1879` (210 px) | `chrome.tsx:39,41` (baselines y 395 / 405) | cap tops ≈ 270 / 255 **(derived from font size)** | centred | Cap tops are just above 288. Marginal. |
| EG-EP01 captions (high band) | `src/videos/everyone-gone/index.ts:134` `bottomEdgeY: 560` | about 413–547 (two lines, f300) | about 180–890 | Inside the box vertically. The right edge touches x 888. |
| WDG-EP01 captions | `src/videos/wendigo/index.ts` `bottomEdgeY: 1240` | two lines measured 1160–1212 (f1300) | 166–914 | **x 914 crosses the box edge x 888.** |

Note on width: `Subtitles.tsx` lays captions out in `left: 6%, width: 88%`, which is x 65–1015. That wrap box is wider than the safe box (x 120–888), so a long line can cross x 888 into the right rail, as WDG f1300 does. This is a separate, right-side defect, recorded here because it showed up in the same measurement.

## 4. Conclusions

### (a) Top

- The mark at y 67–84, x 61–182 is the most likely cause of the reported top problem. It is the only item on **every** frame of both released Shorts, and it sits exactly where the status bar clock (iPhone), TikTok's LIVE icon and the Shorts header row are drawn. On WDG the fact/fiction marker at y 94–150 is a second, larger cause. The user's screenshot of the problem would confirm which one: **(uncertain)** until seen.
- Top margin each platform needs (ads guidance, the only published figures): YouTube **288**, Meta **269**, TikTok **≈240** (third-party). The intersection is **288 px**, which the box already uses.
- **Channel-mark placement:** move it inside the box, at top-left, anchor **x 120**, glyph top **≥ y 296**. That clears YouTube 288 with 8 px of stroke slack, and clears the 97 px side crop. Raise it to about **30 px** so it reads at phone size. Keep it left: the right rail is lower down (from about y 840 on TikTok) but varies by platform. Bottom placement is ruled out because the bottom band is covered on every platform.
- Extend the zone rule from captions to **all on-screen text and logos** (markers, titles, cards, the mark). Every platform's guidance names logos and text, not only captions.

### (b) Bottom

- No primary source supports anything below **y 1248** for **ads**: Google 672, Meta 35 %, TikTok about 660, all bottom margins. Keep 1248 for ads, boosted posts and anything uploaded with a long description.
- For **organic** uploads with a short title and description (one line), the bottom UI has no CTA button or ad label. Third-party estimates put it at about 300–420 px on YouTube. A cross-platform organic limit of **y 1344** (576 px, 30 % clear) leaves about 150 px for a two-line title or expanded description. That is a reasonable Default, with this risk named per platform:
  - **YouTube Shorts:** a two-line title plus the channel/subscribe row and the audio row can reach about 420 px. y 1344 is clear in the normal state. Expanding the description covers it.
  - **TikTok:** the description grows upward with its length (TikTok's own note), so a long description covers y 1344. Keep the TikTok description to one or two lines.
  - **Reels (IG/FB):** the account row, caption and audio row. A caption that is "…more"-truncated is fine. Ads with a disclaimer need 40 % (y 1152), above even the current rule.
- **y 1440** (480 px, 25 %) is the lowest any source (Reap, third-party) entertains. It is covered by the YouTube channel and title rows when the title runs to two lines, and by TikTok descriptions longer than one line. Adopt it per platform only after a real-device screenshot of a private/unlisted upload on iPhone and Android shows it clear.

## Proposed rule change

For [production-requirements: vertical caption safe zone](../production-requirements.md#vertical-caption-safe-zone) and the [channel mark Default](../production-requirements.md#thai-subtitles-narration-and-channel-label). Not applied; the user approves first.

1. **Scope:** rename the box to the **text-safe box**. It applies to every caption line, on-screen text, marker, title card and the channel mark, not only captions.
2. **Box:** x **120–888** and top edge **≥ y 288**, both unchanged.
3. **Bottom edge, two levels:**
   - **Organic Default:** bottom edge ≤ **y 1344** (576 px, 30 % clear), for organic uploads whose title/description fits one line. Default caption block bottom edge about y 1250–1344.
   - **Ads/boosted, or a long description:** bottom edge ≤ **y 1248** (672 px, 35 %), as now. Reels ads with a disclaimer: ≤ y 1152 (40 %).
   - Lower than y 1344 (down to y 1440) is a per-deliverable override, recorded with a real-device screenshot of the upload on each target platform.
4. **Channel mark:** `@TamMaiLa` at top-left, anchor **x 120**, glyph top **y 296–300** (span `top: ~292` with a 30 px font, depending on line box), **30 px** (was 60/60/22 px), same ink and opacity treatment. It stays inside the box, so a caption in a high band (EG-style `bottomEdgeY: 560`) must clear it by about 40 px.
5. **Caption wrap width:** captions wrap inside x 120–888 (768 px), not the current `left: 6%, width: 88%` (x 65–1015). That is a runtime change in `src/scenes/Subtitles.tsx` for new deliverables (Boss/Editor).
6. **Check:** extend `scripts/caption-zone.py` (or its use) to measure the mark and every overlay on frame 0, the longest cue and each overlay's first frame. Before release, take one real-device screenshot per platform of a private upload.
7. **Evidence line:** replace the third-party citations with Google's diagram (288/672/48/192, ads) and Meta's Ads Guide (14/35/6 %, ads), with TikTok marked "template not read; third-party ≈240/660".

Released Shorts are not changed by this proposal. Whether to repaint EG-EP01 / WDG-EP01 with the moved mark (every frame changes, so every pinned segment would repaint) is a separate user decision.

## Gaps

- TikTok's own .zip safe-zone templates were not downloaded, because a download needs the user's approval. Its pixel figures here are third-party.
- No platform documents organic overlay sizes, or how its player scales 9:16 on 19.5:9/20:9 screens. The device table is geometry, not observation.
- Apple's own `safeAreaInsets` values for Dynamic Island devices were not reached. 59 pt is from a community answer.
- Meta's Facebook Reels ads-guide page returned 404, and its safe-zone help article did not render. The Instagram Reels guide is the Meta source used.
- The user's screenshot of the top problem was not available. The cause in 4(a) is inferred from positions.
