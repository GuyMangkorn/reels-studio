# ทำไมแมวเห็นกล่องแล้วต้องเข้าไปนั่ง? (CATBOX) — shared sequence blockout

**Issue/branch:** #31 / `codex/31-catbox-storyboard`
**Base:** `main` at `9ba8dd1116c423ec6e3b3d94c425a663b127ff30` (PR #30 merged)
**Sources:** `scripts/cat-boxes/episode-script.md` R5; `ch01-script.md` R5; `ch02`–`ch06-script.md` R4; `episode-fact-check.md` FC-R4 plus focused C01 R5 recheck; research R1.
**Editorial status:** Board coverage follows the current reviewed wording, but the episode/chapter files still label the script `draft-for-fact-check` and the user has not approved the script. FC-R4 says C02–C06 ready for storyboard, and its focused FC-R5-C01 says C01 is supported; that difference in status labels is retained as an unresolved metadata mismatch.
**Timing:** All beats remain estimates. C01 Long has one 82.92s Niwat +5% preview against a 90s budget; it has not been approved and is not synced to subtitles. Other chapters and all Shorts have not been audio-tested.

## Sequence before scene detail

The nine-minute Long plan advances one continuous fictional case file in the owner's living room. The geography stays fixed: owner and work surface on screen-left, sofa in the middle, Mochi's old box beside the sofa on screen-right, and the window deep behind. The box is planted from the opening, partly screened by a folder, and is never replaced by a newer box. The owner shifts the same folder and evidence cards as the question changes. Each scene can use graphic inlays, but research material is explicitly labeled `ภาพอธิบายงานวิจัย` and is not played as footage of Mochi or as an experiment performed in this room.

The argument escalates in this order:

1. **C01 / Evidence of choosing a flat contour:** a fictional clip raises the question; a clearly labeled 2D inlay shows the three paper stimuli used in Smith et al. and the bounded result. The owner records what is observed, not what the cat thinks.
2. **C02 / Evidence of a hiding place:** a neutral, flat research inset distinguishes the shelter hide-box studies and the outcomes each measured. A real hiding place and a flat outline remain visibly different.
3. **C03 / A second possible function:** Mochi's fictional toy chase tempts the owner to call the box a hunting base. The action demonstrates a play beat in fiction only; it does not establish why the cat entered. The inlay separates cover from a flat boundary.
4. **C04 / Temperature claim audit:** the disputed `30–38°C` range appears only as a claim under review beside `ไม่ใช่คำแนะนำตั้งอุณหภูมิ`; no thermostat, heat dial, comfort icon, warm/cool meter or cozy cat image is paired with the endpoints. The physiology definition and EFSA caution remain separate from comfort or preference.
5. **C05 / Attractive but unconfirmed explanations:** “อ้อมกอด” appears only under `สมมติฐาน`; no mother-cat flashback or imagined memory is visualized. A separate inlay shows the covered wooden cube study as object exploration, never as an open box or a sitting test.
6. **C06 / Re-sort and payoff:** the owner sorts the persistent file into `ผลที่วัด` and `สิ่งที่เดา`, with unequal evidence weight. Mochi crosses past it to the old box from C01. The final blank after `เพราะ` becomes `ครั้งนี้ยังไม่รู้`; neither the Long nor Short supplies a secret cause.

No intro, logo or subscribe card. Each Short uses its own S01 wording and opens with its question/action in frame zero; it borrows visual panels from the relevant Long scenes and holds its final statement for about three seconds. Short layouts keep the foreground lead at a visible height of at least 480px in a 1920px-high frame (the 25% rule), independent of shadow, glow or transparent padding. Research inlays stay beside or behind the lead and outside the subtitle-safe band.

## Chosen medium and movement

- **All twelve scenes: 2D.** The acting, paper stimuli, file, toy, cube and box are interaction elements, so they stay 2D. A restrained, hand-drawn room with a repeatable floor/sofa/window layout is sufficient; the story does not need a view around the set. The current main baseline exposes a 2D `room` background and sofa, 2D human/cat rigs, but has no CATBOX box/study/prop assets and no Three.js stage integration. Introducing 3D here would add an unverified integration dependency without improving the evidence or reveal. A 3D deep wall/window can be reconsidered only if a later blockout proves spatial parallax is needed; it is not a dependency for this plan.
- **Every shot moves.** Use a small frame-driven 2D picture-stage drift/push across the complete background+actors+props, plus actor/hand/tail motion that starts in the first beat. Keep movement measurable at shot start/mid/end, avoid crop clamping and keep screen-space captions stationary. If the shared picture-stage move is not ready, Boss can use a slow translation of the whole 2D scene art and one readable actor action; do not substitute a static shot or move only the prop.
- **Color and light:** the living room uses the channel's warm cream / muted rose / green palette. Window light from deep screen-right gives a soft side key; the owner, cat and full prop images retain dark outlines, a grounded contact shadow and a light rim whenever the room is graded dark. Research inlays use high-contrast cream cards. The C04 range card is neutral paper with an amber caution, never a green “comfortable” zone. Value changes should direct attention, not signify measured comfort.
- **Screen direction:** owner reads and files from left; Mochi travels from the sofa side toward the old box on the right. The final walk does not cross the axis. The old box stays on the right of the sofa in every scene, and CL01 stays partly occluded until the final walk reveals it.

## Beat coverage and scene splits

Twelve story scenes split at each Long production unit, not at every sentence. This is a practical edit boundary: each 45-second unit has one dominant question/action, a clear entry and exit state, and can be checked independently. The two scenes within a chapter share room layout, light and prop state; their cut is an intentional reset to the next case-file beat, not a time jump. Four authored shots/panels per unit cover its four Long beats. The scene sheets map each distinct Short beat to the same authored visuals and state what needs to be reframed. Runtime `Scene` records and timeline indices are not asserted; IDs here belong to the storyboard only.

| Order | Story scene | Long beat coverage | Scene purpose / ending state |
|---:|---|---|---|
| 1 | CATBOX-C01-S01 | C01 U01 B01–B04 | The clip and three stimulus types raise a bounded observation; owner moves from “secret power” to “some cats chose.” |
| 2 | CATBOX-C01-S02 | C01 U02 B01–B04 | Counts and pairwise outcomes are kept distinct; `เพราะ…` remains blank and leads to the real box. |
| 3 | CATBOX-C02-S01 | C02 U01 B01–B04 | The 2014 shelter hide-box result is scoped to behavioral CSS and that setting. |
| 4 | CATBOX-C02-S02 | C02 U02 B01–B04 | The 2019 work adds measured limits; owner sorts `ผลที่วัด` from `สิ่งที่เดา`. |
| 5 | CATBOX-C03-S01 | C03 U01 B01–B04 | Fictional pounce creates and corrects the “hunting base” guess. |
| 6 | CATBOX-C03-S02 | C03 U02 B01–B04 | Full-cover box versus flat outline; “ambush” stays a possible explanation only. |
| 7 | CATBOX-C04-S01 | C04 U01 B01–B04 | Range under review; TNZ definition and EFSA qualification are not comfort advice. |
| 8 | CATBOX-C04-S02 | C04 U02 B01–B04 | Warmth is retained as one possibility for a real box; handoff asks about the hugging explanation. |
| 9 | CATBOX-C05-S01 | C05 U01 B01–B04 | Expert suggestion and unconfirmed pressure mechanism stay distinct from established results. |
| 10 | CATBOX-C05-S02 | C05 U02 B01–B04 | New-object investigation is separated from choosing to rest; file categories are recognized as mixed. |
| 11 | CATBOX-C06-S01 | C06 U01 B01–B04 | Evidence is re-sorted by what was observed, what was measured and what remains proposed. |
| 12 | CATBOX-C06-S02 | C06 U02 B01–B04 | Mochi returns to the planted box; the owner writes `ครั้งนี้ยังไม่รู้`. |

## Shared dependency map and feasibility

| ID | Shared library item / capability | Status in inspected main source | Use and first consumer |
|---|---|---|---|
| ROOM-2D | `room` environment and sofa | Existing 2D (`src/assets/Background.tsx`, `src/assets/props/Sofa.tsx`) | All scenes; scene continuity must preserve screen axis and box placement. |
| HUMAN-2D | Human rig | Existing 2D (`src/rig/Character.tsx`) | Owner's reading, pointing, filing and writing. Expression and pose options must be checked by Boss before use. |
| CAT-2D | Cat rig | Existing 2D (`src/rig/Animal.tsx`) | Mochi's sit, turn, walk and play; contact, facing, ground shadow and Short scale require visual QA. |
| BOX-OLD | One complete 2D box image/plane, with floor contact anchor | Missing; no CATBOX box registry found | C01 plant through C06 payoff; one reusable asset, no separated lid/walls/parts. |
| OUTLINE-2D | Flat square/tape and the exact three paper-stimulus pictures | Missing | C01–C04 and C06; keep Kanizsa inducers/gaps and outward-facing control unmistakable. Each stimulus image remains a complete 2D graphic. |
| FILE-2D | Evidence folder, notes, two evidence piles, blank “เพราะ…” label | Missing | All scenes, particularly C01 / C02 / C06. Prefer reusable screen-space cards over new scene code. |
| TOY-2D | Single complete toy image | Missing | C03 fictional play only; movement can be hand-keyframed across the floor. |
| CUBE-2D | Complete wood-cube-with-cloth image for the novelty study illustration | Missing | C05 only; never make it resemble an open sitting box. |
| STUDY-CARDS | 2D research inlays, legible type, exact labels with bounded claims | Missing as CATBOX assets; existing subtitle is only runtime text | C01–C06; design cards as static authored visuals, not new factual data. |
| PICTURE-MOVE | Frame-driven 2D picture-stage pan/push for background+actors+props | Scene schema exposes no camera field in `src/scenes/types.ts`; no shared effect was found in `src/scenes/SceneRenderer.tsx` | All shots. Requires a shared 2D capability before scene timeline integration; prototype the crop and movement in blockout. |

No runtime scene JSON is included. Every request for animation, camera, labels and cards is a visual requirement until Boss confirms the registry, type, validation and renderer support on the implementation branch.

## Timing convention for the boards

The scripts use estimated Long unit-local seconds and 30 fps. The board sheets convert each stated beat edge to integer frames (`seconds × 30`) and use half-open ranges. Those are bookkeeping translations of script estimates, not audio-tested durations. Long unit offsets are estimated at the script's two 45-second units per chapter; the episode's 9:00 target is not locked. Each Short remains an independently edited 45-second estimate with its own S01 beat ranges; no Long narration is claimed to fit a Short.
