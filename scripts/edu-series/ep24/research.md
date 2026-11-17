# EDU-EP24-SHORT research packet (W1.1): C90 dollar auction

- Researcher: Boat. Research date: 2026-11-17. Channel `edu`, Thai Short, story-led mix ([ER11](../../../channels/edu/script.md#er11)): only the fact lines are checked; the invented auction is a hypothetical story and is not evidence-checked.
- Input: [C90](../concepts/C90.md) (pitch R16 plus Film annotation). No script exists yet; this packet checks the pitch's fact lines, not any narration wording. The script's exact revision gets its own fact-check later.
- Central question: why do bidders in a "second place pays too" auction go past the prize's value? Learning takeaway (from pitch): each step looks sensible, the whole path loses, and only the seller gains.

## Inspected-source registry

Access labels: **R** = read in full or in the relevant part; **S** = secondary page read; **B** = bibliographic record only; **X** = not accessed (lead only). I could not open the paper's full text (JSTOR/SAGE paywall), so every statement about its content comes from secondary pages that quote it.

| ID | Source | Date | Access | Used for |
| --- | --- | --- | --- | --- |
| S01 | Shubik, M. "The Dollar Auction Game: A Paradox in Noncooperative Behavior and Escalation", Journal of Conflict Resolution 15(1), pp. 109–111, DOI 10.1177/002200277101500111. Record at RePEc https://ideas.repec.org/a/sae/jocore/v15y1971i1p109-111.html | 1971 (March) | B (full text X) | Existence, year, journal |
| S02 | Conversable Economist, "Martin Shubik's Dollar Auction Game" https://conversableeconomist.com/2011/11/15/martin-shubiks-dollar-auction-game/ (quotes S01) | 15 Nov 2011 | S | Rules; Shubik's party remark "between three and five dollars is not uncommon"; "Once two bids have been obtained ... the paradox of escalation is real" (quotes as relayed by the page, not checked against S01) |
| S03 | Wikipedia "Dollar auction" https://en.wikipedia.org/wiki/Dollar_auction (flagged "needs more citations") | read 2026-11-17 | S (lead only) | Rules (start 5 cents; second-highest also pays); cites Shubik 1971, Poundstone 1993, Augenblick 2016. No real-play figures |
| S04 | Murnighan, J. K. "A Very Extreme Case of the Dollar Auction", Journal of Management Education 26(1), 56–69, DOI 10.1177/105256290202600105. Abstract via Kellogg/econbiz listings | 2002 | B (abstract text relayed by search; full text X) | A real executive-MBA class run, "the most extreme outcome the author or his colleagues have ever observed". No amounts obtained |
| S05 | Teger, A. I. *Too Much Invested to Quit*, Pergamon Press | 1980 | B (book listing; text X) | A book of two-party dollar-auction experiments; one review says bidding "regularly" passes the prize. No figures obtained |
| S06 | Haupert, M. J. classroom account of the dollar auction (Classroom Expernomics, 1994) | 1994 | X (search snippet only) | Lead: bidding slowly nears $1, then passes it once collusion breaks down |
| S07 | Migheli (2012), cited in a Morone, Nuzzo and Caferra working paper (MPRA 72608) | 2012 | X (page unreachable; snippet only) | Lead: a revised version reportedly did not escalate, though some still paid above the coin's value. Contrary evidence to keep in view |
| S08 | Bazerman's classroom $20/$1 auctions (named in the pitch) | n/a | X (not found) | Nothing verified |

## Claim ledger

Verdicts: **verified** (narration may state), **hedge** (state only with the given narrow word), **drop** (keep out of narration unless Preaw gets a source). Severity follows [finding severity](../../../.agents/skills/editorial/SKILL.md#finding-severity).

| ID | Claim (pitch location) | Verdict | Evidence and note |
| --- | --- | --- | --- |
| CL-F01 | An economist, Martin Shubik, designed this game in 1971 (B04) | **verified** | S01 record: Shubik, J. Conflict Resolution, 1971. Shubik is an economist (S02, S03). Safe Thai: "นักเศรษฐศาสตร์ชื่อมาร์ติน ชูบิก คิดเกมนี้ขึ้นมาตั้งแต่ปี 1971" or without the name. "Designed/proposed" is right; "invented" is also fine, but do not say he ran a famous experiment: his paper is a short (3-page) description of a party game |
| CL-F02 | Real rule: the highest bidder wins the note and pays their bid; the second-highest also pays their bid and gets nothing (B02) | **verified** | S02, S03. Original is a $1 bill with a 5-cent minimum bid. The pitch's 100 baht note with a 5 baht start is the same ratio scaled up; calling it "a version of" the game is fine. Story must also say the winner pays their own bid, or the "bid 100, lose nothing" step (B02) breaks |
| CL-F03 | Arithmetic of the steps: at 90 vs 95 (note worth 100), the 90 bidder faces losing 90; bidding 100 and winning nets 0; then the 95 bidder facing a loss of 95 bids 105 and, if he wins, loses 5 (B02, B03) | **verified** | Pure arithmetic from the rule. Keep "ถ้าชนะ" explicit: a bidder who wins at 100 breaks even only if he wins. Each rival then faces a loss of the whole bid, which is the escalation Shubik describes (S02) |
| CL-F04 | Each step compares only this step's loss; this keeps the bids climbing (B03) | **verified** (as a description of Shubik's logic) | S02/S03: each bid is the short-sighted choice to limit the current loss. Mechanism is one cause and fits ER09. Do not call it "irrational" or "rational" as a verdict: analyses differ (see CL-F10) |
| CL-F05 | In real play, bids often climb past the note's value (B04; counter-intuitive claim) | **hedge** | Supported qualitatively: Shubik reports at parties payments "between three and five dollars" in total are "not uncommon" (S02, via a secondary quote; this is both bidders' payments added, not one winning bid); Teger's experiments reportedly regularly pass the prize (S05, review only); a real MBA class went to an extreme (S04). Contrary lead: S07 reports a version with no escalation. So use "มัก/หลายครั้ง", not "ทุกครั้ง" and not "เกือบทุกครั้ง". No percentage or average is sourced. Severity if overstated as "always": must-fix (false takeaway) |
| CL-F06 | "Played in real classrooms" (B04) | **hedge** | Classroom and class-based runs exist (S04 executive-MBA class; S06 lead; S05 lab). Safe wording: "เวลาเอาเกมนี้ไปเล่นจริง" / "ในห้องเรียน" with no name. Do not say a particular school, class or Bazerman ran it (CL-F08) |
| CL-F07 | Figures: any dollar/baht amount that real bids reached, an average winning bid, "up to $X" | **drop** | I found none I could verify: Shubik's "$3–5" is a total of both payments (S02, secondhand), Murnighan's and Teger's numbers were not accessed. Keep out of narration, including "สูงสุดถึง…" and any "เท่า" multiple. If Preaw wants a number, Boat must first get S04/S05 text (library or SAGE) |
| CL-F08 | "Max Bazerman's classroom replications" (pitch research load) | **drop** (unverified) | S08 not found. Bazerman is known for similar $20-bill classroom auctions, but I did not inspect any source, so no attribution to him in narration or on screen. Murnighan 2002 (S04) is the inspected alternative if a named replication is wanted, and it is a single extreme case, so naming it overstates "usual" |
| CL-F09 | The only one who profits is the seller / host who holds the note (B05 flip) | **hedge** | Arithmetic: seller collects winner's bid plus loser's bid and gives away the 100 note, so he profits whenever the two final bids add to more than 100 (e.g. 105 + 100 = 205 for a 100 note). Early in the game (5 and 10) he would lose. In the story the bids pass 100, so "only he profits" holds inside the story; both bidders lose (winner 5, loser 100). Real-world: Shubik's $3–5 remark (S02) implies the auctioneer usually ends ahead, but no study figure is sourced. Wording: "คนที่ได้กำไรคือคนถือแบงก์" is safe for the story; do not assert "the auctioneer always profits in real games" |
| CL-F10 | "The bidders did nothing stupid" / "every step is sensible" (hook line, refrain, B05) | **hedge** (story framing) | Each step is locally sensible by the arithmetic (CL-F03), which is what the refrain claims. But the literature reads the game as a paradox/escalation trap (S01, S02), and the researchers' point is that the path as a whole is a mistake. Keep the refrain "ทุกก้าวคุ้ม แต่ทั้งทางขาดทุน" (true as framed); avoid "ไม่มีใครโง่" as a general-science claim. Optional |
| CL-F11 | "Sunk cost" / escalation of commitment as the name for the feeling (pitch why-it-holds; term kept out of narration) | **verified as a general link, drop as a narrated claim** | Teger's title "Too Much Invested to Quit" (S05) and Shubik's "escalation" (S01) support the connection. Augenblick 2016 on sunk cost in penny auctions is listed by S03 but not opened (X). Narration should not name the term (ER05) and should not claim a causal "this is why people do X in queues" beyond the story's "feeling everyone knows". The pitch's "queue / bad investment" echo is unsupported audience-feeling, hypothesis only |
| CL-F12 | Fictional elements: room, host, two bidders, stylised red note, coin pile, bid board, sounds (coin clink, cash register, gavel) | **N/A (story)** | Invented, openly hypothetical ("สมมุติว่า"). Check that the story does not imply that this exact baht auction was held, or that a real person or company did this. Real recordings: none used. Sounds are fictional dramatisation; no sourcing needed |

## Usable knowledge (for the script)

1. Shubik published the game in 1971 (J. Conflict Resolution). A prize is auctioned; the highest bidder wins it and pays; the second-highest also pays and gets nothing (CL-F01, F02).
2. The trap: once two bids are in, the lower bidder always loses less by raising, so each step "looks smart", and the bids pass the prize's value (CL-F03, F04, F05).
3. The party who profits is the auctioneer, once the two bids together pass the prize value (CL-F09).
4. B04 fits a 6 s answer if it states only CL-F01 + the hedged CL-F05 with no number.

## Must stay out of narration unless sourced

- Any amount reached in real games, an average, a percentage of games that escalated, "สูงสุด", "ทุกครั้ง".
- Bazerman, Teger, Murnighan or Haupert as named people (none opened beyond bibliographic/abstract level; Bazerman not found at all).
- Any claim about Thai games, a real Thai note, or a real company or person doing this.
- The word "sunk cost" (ER05; also unverified as a causal explanation in this case).

## Gaps and confidence

- The primary paper was not opened (paywalled). Rules and the "$3–5 not uncommon" remark rest on a secondary page that quotes it: **medium** confidence for the quote, **high** for year, journal and rule (several independent descriptions agree; they copy Shubik's design, so they are one lineage, not independent corroboration of real-play results).
- Real-play results: only qualitative support, no accessible figures; contrary lead S07 not opened. Confidence that "bids often pass the prize": **medium**. A hedged "มัก" is supportable, a number is not.
- To raise it: get S04 (Murnighan 2002) and S05 (Teger 1980) full text through a library; neither is required for a hedged line.

## Open questions for Preaw

1. B04 wording: confirm it states only the 1971 designer plus "มัก" and no figure. Alternatively cut B04 to the year alone.
2. Do you want the named person (Shubik) spoken? Safe either way; a name adds little for a 6 s fact line.
3. Story rule: state that the winner pays their own bid too, so the viewer can follow the B02 arithmetic (CL-F02/F03).
4. B05: "คนเดียวที่ชนะคือคนถือแบงก์" is true only when bids pass 100; keep the on-screen coin pile and the final bids (e.g. 105 and 100) adding to 205 visible, or leave unsaid.
5. Drop the Bazerman mention from C90's research load, or approve Boat getting a source first.
