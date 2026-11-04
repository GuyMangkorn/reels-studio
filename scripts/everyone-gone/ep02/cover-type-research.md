# EG-EP02-SHORT cover A: typography research (4 Nov 2026)

Cover A: plate `EG2-S01-B01-SH01`, local frame 100, `คนทั้งเมืองไปไหน?` (accent) / `เหลือแค่คุณ`. Variants A1..A5 are `EG2_A_TYPE` in `src/videos/covers/everyone-gone-ep02.ts`; the optional per-cover `look` field is in `src/videos/cover-overlay.tsx`. Thai copy unchanged.

## Findings and limits

- Web search returned little Thai-specific cover-typography material; the sources below are general thumbnail and film-title guidance. Thai-specific style choices are judgement, labelled as such.
- Shared advice: heavy letterforms, stroke or shadow or a solid block behind text, 1-3 words, test at about 120-320 px wide, keep 10-15% edge padding. Thin strokes vanish at thumbnail size.
- **Font constraint (checked):** the repo loads only `public/fonts/NotoSansThai.ttf`, a variable font with `wght` 100-900 and `wdth` 62.5-100 (no `@remotion/google-fonts` package; docs/remotion-toolkit.md section 3 says a Google Fonts download is a separate decision). So all five looks use Noto Sans Thai and differ by weight, width, stroke, shadow, glow, label and tracking. Display families worth a later, separate decision (each needs its font file and OFL notice added): Chonburi (looped Thai didone display, one weight; for a serif "title card" look), Trirong (looped serif), Mitr (rounded, friendly). Not used here.
- Colours: cream `#f4efe6`, accent `#ff7a52`, dark `#0b0d16` (three, CV05). A5 uses the accent as shadow, A4 as a label.
- Not rendered (composition not registered); A4 and A5 need a frame check once registered.

## The five looks

**A1 heavy sticker.** Mood: loud, immediate, the standard high-CTR thumbnail. Recipe: Noto Sans Thai 900, width 100, headline accent / sub-line cream, dark stroke 0.16 x font size (112 / 92 px), hard black shadow dx 0 dy 9, no tracking change. Sources: [vidIQ thumbnail tips](https://vidiq.com/blog/post/youtube-thumbnail-design-tips/), [thumbfa.st text overlays](https://thumbfa.st/posts/generate-youtube-thumbnails-with-text-overlays).

**A2 condensed poster.** Mood: film-title, a tall narrow wordmark that reads as a notice, not a shout. Recipe: weight 900, width 62.5 (condensed), headline 158 px accent, sub-line 100 px cream, thin dark stroke 0.07, tracking +0.01 em, short accent rule (140 x 8 px, y 1372) between the lines, no shadow. Sources: [Jaws title analysis (heavy condensed)](https://madegooddesigns.com/?p=14588), [Insidious title (Anton, tight tracking)](https://madegooddesigns.com/?p=11264).

**A3 whisper.** Mood: quiet, eerie, the empty street speaks softly; the question is almost murmured. Recipe: weight 500, width 100, tracking +0.06 em, headline accent 92 px, sub-line cream 78 px, thin dark stroke 0.05 plus a soft dark glow (blur 14 px, `#0b0d16`) instead of a hard outline. Risk: medium weight is the weakest at small size; check at 120 px wide first. Sources: [Oppenheimer title as inscription (DEV)](https://dev.to/abuhasnat/what-fonts-were-used-in-oppenheimer-dune-furiosa-and-other-recent-film-posters-231g), [vidIQ](https://vidiq.com/blog/post/youtube-thumbnail-design-tips/) for the thin-stroke warning.

**A4 label tape.** Mood: a taped notice or evidence label, tying to the blank-sheet motif of the story. Recipe: headline dark ink `#0b0d16` on an accent sticker (round-joined stroke 0.3 x size in `#ff7a52`, no outline on the ink), 100 px; sub-line cream 88 px with dark stroke 0.09; weight 800. Basis: guides recommend a solid block behind text for guaranteed contrast. Sources: [thumbfa.st](https://thumbfa.st/posts/generate-youtube-thumbnails-with-text-overlays), [tubecore text guide](https://tubecore.xpanddigital.io/blog/youtube-thumbnail-text-guide).

**A5 offset print.** Mood: misregistered poster ink, slightly off, uneasy. Recipe: weight 800, both lines cream (110 / 90 px), dark stroke 0.1, hard accent shadow dx 9 dy 9 (`#ff7a52`) so the accent appears as a printed offset. Source: [Type Network ScreenFonts](https://typenetwork.com/articles/screenfonts-april-2018-the-leftovers) (title-treatment reference), [thumbfa.st shadow guidance (offset 4-6 px, stroke + shadow)](https://thumbfa.st/posts/youtube-thumbnail-maker-tips-common-mistakes).

## Rules check

CV02 two short lines, unchanged copy. CV05 three colours, dark outline on every look (A4 sub-line outlined; headline sits on a solid label). CV06 baselines at y 1330-1470 (A2: 1340 / 1470), centred at x 540, widest line is A2/A1 headline well under 960 px (to be confirmed in frames). CV08 series identity is relaxed for this exploration. Channel mark stays top-left (chrome).
