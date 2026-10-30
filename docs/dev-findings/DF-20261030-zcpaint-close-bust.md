# DF-20261030-zcpaint-close-bust — the full 6-head body scaled up reads crude in the close shots

**Status:** workaround (pass 10, uncommitted). **Checked:** 2026-10-30, `claude/zcondo-paint-tsx-remotion-bdb058` (uncommitted pass 10). **Owner:** Boss.

## Symptoms and evidence

- Look check (user, 30 Oct 2026, pass 9): B01-SH01 over the shoulder, B01-SH02 infected and B02-SH03 his face read crude: lumpy shoulder domes (separate ellipses under the sleeves), stick arms, and a tee that ran to the frame bottom as a block. The user chose a separate half-body drawing for the closes (“วาดตัวช็อตใกล้แยก”).
- Pass 9 frames (`out/painted/zcpaint/p9/b02/beat-b02-sh03-sheet-r2.png`) show the domes and the stick arms at 270 px.
- The sheets' head sizes (B01-SH01 280 px, B02-SH03 322 px, B07-SH01 260 px, B06-SH02 250 px, B09-SH02 360 px) put the 6-head hips at y 1150-1260 in the frame; the lower third shows the shorts and legs (see `DF-20261030-zcpaint-tee-to-frame-bottom`).

## Attempts and results

- Shirt as one convex outline (no separate shoulder domes), the sleeve tube starting inside the shoulder line (`bust.ts` `standing`): the domes are gone at full resolution (`out/painted/zcpaint/p10/sheets/crop-A-front-back.png` in the model sheet).
- Reaching arms drawn after the shirt (`overArms`): a reach across the torso is hidden otherwise (the B06-SH02 handle reach).
- Elbow side: the default two-bone bend put the B07 arm through the face; `bend` -1 keeps the elbow low.
- Back of the head without the three crown tufts (`HeadMark.tufts`): the tufts read as spikes at 270 px.
- Infected slump: outer shoulders drop 0.30 head, the neck base 0.20, the head 0.12 (so it stays higher); torso 0.12 narrower and arms 0.08 closer at the side seams. The slack body reads as a loose khaki shirt, not a box.
- Screen falloff veil (`#101514` from y 820 or 900) removed from B01 plates: it reads as a hard band across the body and acts as a caption shade (the user removed shades at pass 8 and 9).

## Planning impact

- Film and Mark: the sheets' head sizes keep the 6-head legs in the lower third of B01-SH01, B02-SH03 and B07-SH01. A true waist-up crop needs a larger head on those shots (Q-P10-1). The bust is the upper body; the legs are the 6-head legs.
- Film: B06-SH02 and B07-SH01 use the bust as closes (Q-P10-2).
- Editor: per-language plate IDs are in `build-notes.md` "Boss pass 10"; the B07 caption line needs a break in the Editor's wrap.
- Boss: a bust model sheet (`scripts/zombie-condo-paint/bust-sheet.sh`) before any close plate; the infected shoulders and the B09 seated pose are the review points (Q-P10-4, Q-P10-5).
