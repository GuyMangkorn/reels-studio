# Fact-check — ONO-EP01-SHORT

| Field | Value |
| --- | --- |
| Revision | `ONO-FACTCHECK-R1` (Boat, 2026-11-02) |
| Checked script | `ONO-SCRIPT-R1` ([script.md](script.md), Preaw, 2026-11-02), main hook and `ALT-HOOK-U` |
| Research | `ONO-RESEARCH-R1` ([../research.md](../research.md)) |
| Verdict | **`ready-for-storyboard` for the main script (zero required fixes).** `ALT-HOOK-U` as written is **not supported** (blocked unless changed, FC01). Four recommended, non-blocking items (R1-R4). Confidence: **medium-low overall**, because no primary page was opened (below) |
| Script edited by Boat | No |

## Access and inspected coverage

- **Opened in this pass: none.** Retried 2026-11-02: nytimes.com (S-02, "unable to fetch"), bbc.com (S-03, "unable to fetch"), theguardian.com ("unable to fetch"), en.wikipedia.org, archive.org, japantimes.co.jp (host not resolvable, outside the session's allowed domains). No copy of *No Surrender* (S-01) was reachable. To open them, those hosts must be allowed in the session's network settings.
- **Evidence this pass = one `WebSearch` round, summaries only (`lead-only`)** over Wikipedia and mirrors (wikipedia.com, wiki.riteme.site, a 2024 kiwix copy), Tokyo Weekender, FilipiKnow, SOFREP, Task & Purpose, Damn Interesting and a Scribd copy titled "Never Surrender". The summaries are one lineage (Wikipedia, tracing to S-01), not independent corroboration.
- What the summaries newly supported: Taniguchi's full name and rank (Major Yoshimi Taniguchi, former commanding officer, flew to Lubang in 1974 and formally relieved Onoda of duty); Akatsu left Sept 1949, surrendered 1950; Shimada killed 7 May 1954 in a shootout with a Philippine Army mountain unit; Kozuka killed 19 Oct 1972 by two shots from local police while they were burning villagers' rice; the civilian-death figure is contested (below).
- Nothing contrary to the script's claims was found. Qualitative confidence: identity, order-giver, companions' fates and the 1974 release are well reported (medium-high, one lineage); every date below the year, the 1952 letters and the civilian toll are medium to low.

## Findings and rulings

| ID | Sev | Where | Finding | Action |
| --- | --- | --- | --- | --- |
| FC01 | High (only if chosen) | `ALT-HOOK-U` "สงครามจบไปแล้ว 29 ปี" | 15 Aug 1945 to 9-10 Mar 1974 = 28 y 6.8 m (2 Sep 1945: 28 y 6 m). Plain "29 ปี" after "สงครามจบไปแล้ว" overstates by about 5 months; the loose "29 years" in headlines is a round number, and "29 ปี" is accurate only for his time on Lubang (Dec 1944 to Mar 1974, 29 y 2.5 m), which this sentence does not say. | **Not supported as written.** If the user insists on "แล้ว": `สงครามจบไปแล้วเกือบ 29 ปี… แต่ทหารคนนี้ยังรบอยู่` (Preaw's variant; supported; hook phrase ends about 2.1 s, past the 2 s target, Film/Editor read-aloud check). Accurate alternative that keeps the user's number: `อยู่ในป่าถึง 29 ปี…` is not the user's line, so only mention it. |
| FC02 | Info | Main hook S01-B01 "สงครามจบไปเกือบ 29 ปี" | 28.6 y rounds to "เกือบ 29". Supported. "ยังรบอยู่" = still under arms and raiding (C-13, Kozuka's death while burning rice), not open battle; acceptable as hook shorthand and the later beats show the scale. | **Supported; keep as main hook.** |

### Rulings on the six questions

1. **Hook.** Main "สงครามจบไปเกือบ 29 ปี": **supported** (28.6 y; medium-high, the arithmetic rests on 15 Aug 1945 and 9-11 Mar 1974, both well reported). `ALT-HOOK-U` "สงครามจบไปแล้ว 29 ปี": **not supported as written** (FC01); the "แล้วเกือบ 29 ปี" variant is supported.
2. **Civilian toll C-12.** **Keep** `มีรายงานว่ากลุ่มเขา ทำให้ชาวบ้านเสียชีวิตราว 30 คน` and the on-screen `ราว 30 คน · ตามที่มีรายงาน (ตัวเลขยังไม่ยืนยัน)`. Reasons: sources disagree in direction ("at least 30 killed, 100+ injured" in one; "Filipino media alleged up to 30 civilians" in a Wikipedia-lineage mirror; a Philippine documentary reportedly found he killed several people he did not mention in his book), so "ราว 30" is the neutral midpoint, "มีรายงานว่า" and the on-screen "ยังไม่ยืนยัน" carry the uncertainty, and the claim stays group-level. "หลายสิบคน" would be less accurate, not safer: it implies well over 20 and loses the "up to" reading. Both hedges are adequate; they are **not** a primary-source verification (confidence low-medium). Do not add "100 wounded" or "he killed 30".
3. **S06-B01 names Taniguchi.** **Fair.** Taniguchi was his commanding officer who gave the order (C-03) and the person whose release order ended it (C-11); the Wikipedia-lineage summary states Onoda refused until relieved by "his former commanding officer, Major Yoshimi Taniguchi". Minor nuance: the stated condition to Suzuki was an order from his superior officer; Taniguchi became that person when Suzuki found him. Shorthand is acceptable (medium). Optional tighter form R2.
4. **Companions.** **Accurate.** Akatsu left the group Sept 1949 and surrendered 1950, alive (C-07). Shimada killed 1954 in a shootout with a Philippine Army unit; Kozuka killed 19 Oct 1972, shot by police (C-08, C-09). "ถูกยิงเสียชีวิต" covers both; "ออกไปมอบตัว" is right for Akatsu; the cards (`1949–50`, `1954`, `1972`) are right. Confidence medium (one lineage). "เพื่อนสามคน" = his cell of four; no name is spoken.
5. **Order paraphrase "ห้ามยอมแพ้ ห้ามฆ่าตัวตาย".** **Supported as gist** (C-03), no quote marks, card says `(ใจความ)`; keep. Omission note R1.
6. **Hero tilt / misleading omissions.** No pure-hero portrait: S05 sits before the twist, the card/visual say rice burning and group-level deaths, S06 forbids triumphant framing. Recommended items below.

### Recommended (non-blocking)

| ID | Sev | Item | Suggested wording |
| --- | --- | --- | --- |
| R1 | Medium | The order paraphrase gives only the passive half. Background (Wikipedia lineage, S-01; **not seen in this pass's summaries**) is that the same order told him to continue guerrilla/intelligence work. The closing question "เหยื่อของคำสั่ง หรือ คนผิด?" is fairer if the viewer knows the order also covered fighting on. Needs S-01/S-04 opened before it is added; not a blocker. | If verified: `…ห้ามยอมแพ้ ห้ามฆ่าตัวตาย และให้สู้ต่อ` (+0.7 s; TRIM-3 plus a Film trim offsets). Otherwise leave. |
| R2 | Low | S06-B01 precision. | `เขาบอกนักเดินทางคนหนึ่งว่า จะออกมา ถ้าผู้บังคับบัญชาเก่าสั่งเท่านั้น` is exact, but weakens the CL03 plant; keep the script wording unless Preaw prefers precision. |
| R3 | Low | Omitted: Marcos pardon, Lubang anger (C-14), a Philippine documentary reportedly finding he personally killed several people. None is in the script, none is wrongly implied. If a trim frees time, a one-line `ชาวลูบังไม่ให้อภัย` style balance card would help, but C-14 is also lead-only. | No change. |
| R4 | Low | Visuals S02-B02, S06-B02, S06-B03: Onoda at attention, Taniguchi in civilian clothes with a paper, a salute, a "clearing" setting are reconstructions; no source gave these details here. | Film labels the scenes `ภาพจำลอง` (as for the leaflets) or keeps them non-specific. Do not show Onoda weeping (not used). |

## Claim-by-claim check (every number, date, rank, name and on-screen text)

"OK" = supported at the stated confidence by lead-only evidence; none is verified from an opened page.

| ID | Text / number | Verdict | Confidence and note |
| --- | --- | --- | --- |
| S01-a | "เกือบ 29 ปี" | OK | Medium-high (FC02). |
| S01-b | OST `สงครามจบ 1945 → เขายังอยู่ในป่า 1974` | OK | Medium-high. 15 Aug / 2 Sep 1945; Mar 1974. |
| S01-c | "ทหารคนนี้ยังรบอยู่" | OK, hook shorthand | Medium; see FC02. |
| ALT-HOOK-U | "แล้ว 29 ปี" | **Not supported** | FC01. |
| S02-a | "ฮิโรโอะ โอโนดะ ทหารญี่ปุ่น", OST `ร.ต.` | OK | Medium-high. ร.ต. = second lieutenant. |
| S02-b | "เกาะลูบัง ฟิลิปปินส์", `ธ.ค. 1944` | OK | Medium-high. Arrival 26 Dec 1944 per lineage; month only is safe. |
| S02-c | "ผู้บังคับบัญชา ทานิกุจิ", OST `พ.ต. โยชิมิ ทานิกุจิ` | OK | Medium-high. พ.ต. = major. |
| S02-d | "สั่งเขาไว้ว่า ห้ามยอมแพ้ ห้ามฆ่าตัวตาย" / `คำสั่ง (ใจความ)` | OK, gist | Medium; literal wording C-04 unverified, not quoted (R1). |
| S03-a | "ใบปลิวบอกว่าสงครามจบแล้ว", `ปลายปี 1945` | OK | Medium. Leaflets carried a surrender order of the 14th Area Army (Yamashita); "war over" is the gist. |
| S03-b | "พวกเขาเชื่อว่าเป็นกลลวงของศัตรู" | OK | Medium. Group judged them not genuine; his reasons are not stated (S-01 unopened). |
| S03-c | "จดหมายจากครอบครัว… ก็ไม่เชื่อ" | OK | Medium-low. 1952 family letters/photos per lineage; no year spoken. |
| S04-a | "เพื่อนสามคนหายไปทีละคน" | OK | Medium; qualified at once. |
| S04-b | "คนหนึ่งออกไปมอบตัว" / `1949–50 … (รอดชีวิต)` | OK | Medium (Ruling 4). |
| S04-c | "สองคนถูกยิงเสียชีวิต" / `1954`, `1972` | OK | Medium (Ruling 4). |
| S05-a | "มีรายงานว่ากลุ่มเขา ทำให้ชาวบ้านเสียชีวิตราว 30 คน" / OST | OK, hedged | Low-medium (Ruling 2). |
| S05-b | Visual smoke from a burnt rice store, empty hut | OK | Medium (C-09, C-13); no one harmed on screen. |
| S06-a | "จะออกมา ถ้าทานิกุจิสั่งเท่านั้น"; OST `ก.พ. 1974 · โนริโอะ ซูซูกิ นักเดินทางชาวญี่ปุ่น` | OK | Medium. 20 Feb 1974 (lineage). Ruling 3. |
| S06-b | "ทานิกุจิจึงต้องบินมาลูบังเอง… อ่านคำสั่งยกเลิกให้เขาฟัง"; `มีนาคม 1974` | OK | Medium. Flew to Lubang, relieved him of duty; 9 Mar (some 10 Mar); month only on screen. "ยกเลิก" = relieved of duty / rescinding. |
| S06-c | "ใบปลิวทำไม่ได้… แต่คำพูดคนเดียวทำได้" | OK, interpretive | Medium. Outcome-level; no claim about his inner reasoning. Mark as narrator's summary of reported outcome. |
| S07 | "เหยื่อของคำสั่ง… หรือคนผิด?" / OST | No claim | Opinion question, offers both sides. |
| Timing | VO ≈ 42.9 s, total 44.5 s | Not a fact | `estimated`, outside this review. |

## Sound

- No gunshot anywhere: correct; S04 and S05 imply no event sound beyond mats, footsteps, embers. Aircraft hums (S03-B01, S06-B02) are reconstructions and must be labelled so (they are). No real 1974 recording or footage is used; if one is added, it needs a source. The bell tone and pad assert nothing.

## Recheck scope after any change

If Preaw applies R1: recheck S02-B02 wording and the closing question. If the user chooses `ALT-HOOK-U`: recheck S01-B01 and the loop pairing in S07-B01. If any primary page opens: recheck Ruling 2, S03-b/c, S04-b/c, S06-b.

## Remaining unverified items (plainly)

1. All of it is lead-only: S-01 to S-03 never opened. 2. Origin and wording of the "30" figure (Filipino media allegation vs. "at least 30"), 100 injured. 3. Order wording and the guerrilla instruction (R1). 4. 1952 letter drop; 20 Feb and 9 vs 10 Mar dates (not used on screen below month). 5. Leaflet source details (Yamashita order).

## Handoff

`ready-for-storyboard` for `ONO-SCRIPT-R1` main script at the confidence above; matching revision to Film: `ONO-SCRIPT-R1` + `ONO-FACTCHECK-R1`. User still picks the hook (FC01/FC02) and approves the script (W1.4). Film should label reconstructed scenes (R4).
