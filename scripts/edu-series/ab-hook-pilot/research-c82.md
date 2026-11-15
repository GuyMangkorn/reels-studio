# C82 — helium balloon in an accelerating enclosed car

- Revision: **C82-RESEARCH-R1**; Boat; research/access date **2026-11-15**.
- Scope: bounded premise research for C82 only; [delivery.md](delivery.md) **AB-HOOK-DISCOVERY-R3** governs.
- Selection: C82 and C83 are different-content Shorts with different openings; no isolated hook-causality claim.
- Channel/profile: `edu`; educational scene-led storytelling, fiction-with-factual-knowledge; painted 3D camera/SVG proposed. No episode ID or final duration locked.
- Inputs: [research.md](research.md) **AB-HOOK-SCOUT-R1**, P01/F001/SRC001–002; [C82 pitch](../concepts/C82.md) **AB-HOOK-PITCH-R1**, story material only.
- Question: why does the helium balloon lean opposite a passenger or dense hanging object?
- Takeaway: the surrounding air matters; acceleration changes the pressure balance that produces buoyancy.
- Context: ordinary terrestrial gravity; enclosed, level cabin/box; straight-line acceleration; no dominant drafts.
- This is not a review of final hooks, narration, captions, timed visuals or sound; those need independent exact-revision fact-check.

## Inspected-source registry

Stable SRC001–002 retain the scouting identities. New IDs are packet-local `C82-SRC003–004`.

| Source | Publication / locator / access | Inspection and limits |
| --- | --- | --- |
| **SRC001** — Stony Brook Physics Lab Demo, *Helium Balloon In Accelerated Box* | n.d.; [original page](https://labdemos.physics.sunysb.edu/c.-kinematics-and-dynamics/c4.-second-law-of-motion/helium-balloon-accelerated-box), Purpose, Equipment, Description, References; accessed 2026-11-15 | **Inspected text.** University demo specifies tether to box bottom and enclosed box; documents motion along acceleration. No video watched, measurements inspected or underlying cited papers opened. |
| **SRC002** — David P. Stern, *Get a Straight Answer*, archived NASA/GSFC host | n.d.; [Q429](https://cdaweb.gsfc.nasa.gov/pub/documents/archived_websites/pwg.gsfc.nasa.gov/stargaze/StarFAQ23.htm), reply (1)–(5), especially (4)–(5); accessed 2026-11-15 | **Inspected full Q429 and archive notice.** Educational explanation, not a NASA vehicle experiment. Site index calls it “Why doesn't gravity overcome buoyancy?”; earlier scouting's “Helium Balloons” is a descriptive label. No longer updated; students' trial is an unnamed report, not independent trial data. |
| **C82-SRC003** — Larry Gedney, UAF Geophysical Institute, *Experiments With A Helium Balloon* | 1985-09-16; [original article](https://www.gi.alaska.edu/index.php/alaska-science-forum/experiments-helium-balloon), main text paragraphs 1–11; accessed 2026-11-15 | **Inspected full article.** Author reports his own floor-tethered car trial: forward on acceleration, rearward on braking. First-person observation, no trace/video/control data. Opening newspaper explanation is a secondary lead, not separate corroboration. Read mechanism/context, but do not reuse its sharp-driving instructions or incidental gravity equivalence/unit wording. |
| **C82-SRC004** — University of Toronto PHY138Y Mechanics, *Class08/Main08.pdf* | n.d.; [two-page teaching sheet](https://faraday.physics.utoronto.ca/PHY138Y/Mechanics/Class08/Main08.pdf), p1 helium question; accessed 2026-11-15 | **Inspected extracted text, both pages.** Multiple-choice balloon prompt has no marked answer; unused as evidence. Its pendulum question concerns Earth rotation, not an accelerating car. |

Access gap: attempted official MIT OCW 8.01 Fall 1999 lecture-28 resource URL returned an access error. No MIT content supports this packet; mirror snippets were not used.
Contrary/limitation check: inspected sources do not contradict the scoped direction; they do not establish universal behavior at every instant, with arbitrary balloons, drafts or driving paths.
Confidence: high for the qualitative enclosed-system result; lower for exact transient motion because no instrumented time series was inspected.

## Claim ledger and usable boundaries

`C82-F001` refines scouting `F001`; other claim IDs are new. “Derived” means a physical prediction, not a separately measured scene.

| Claim | Status / evidence | Usable boundary |
| --- | --- | --- |
| **C82-F001**: tethered buoyant helium balloon leans forward relative to a forward-accelerating enclosed car/box | **Supported documented demo**, SRC001 Description; car explanation SRC002 (5) | Floating balloon anchored below; “เอนไปทางหน้ารถตอนรถเร่ง”; no claim that it outruns the car or flies freely through the cabin. |
| **C82-F002**: surrounding air is denser than the buoyant balloon system; its pressure imbalance produces the forward buoyant tendency | **Supported qualitative mechanism**, SRC002 (4)–(5), C82-SRC003 final mechanism paragraph; pressure formulation below is derived | Compare displaced air with the whole balloon, including envelope/load, not helium alone; “อากาศรอบลูกโป่งช่วยดันมัน” is a wording boundary, not final narration. |
| **C82-F003**: a passenger initially lags relative to the accelerating cabin; a dense hanging bob tends backward | Passenger contrast **supported**, SRC002 (5), C82-SRC003 acceleration report; bob direction **derived**, same article's plumb-bob/effective-field explanation | Seat/support accelerates the passenger forward. Choose a compact dense hanging prop, not a generic floating object; posture and restraints affect visible body movement. |
| **C82-F004**: braking during forward travel reverses the balloon's tendency toward the rear | **Derived reversal plus firsthand reported observation**, C82-SRC003 braking paragraph | Backward acceleration while still moving forward; “ตอนชะลอ ลูกโป่งเอนกลับไปท้ายรถ”. Not an inspected recorded experiment or an instantaneous flip. |
| **C82-F005**: at constant straight-line velocity, the acceleration-induced horizontal bias vanishes | **Derived**, acceleration-dependent mechanism in SRC001/002 and C82-SRC003 | After residual swinging settles, balloon tends upright above its anchor; constant speed around a bend still involves acceleration. Do not say steady speed always means upright. |
| **C82-F006**: an ordinary air-filled balloon is not an interchangeable example | **Derived scope limit**, SRC002 (4), SRC001 Equipment | Whole-system buoyancy is essential. An air-filled rubber balloon ordinarily does not float; do not promise a universal reverse-direction rule for every replacement. |

## Mechanism notes for the writer, not spoken exposition

1. Use the cabin frame and forward coordinate `x`: when cabin acceleration is `a`, quasi-static horizontal air balance is `dp/dx = -rho_air * a`.
2. Forward acceleration therefore gives higher pressure toward the rear; integrating that pressure over a balloon gives forward horizontal force `rho_air * V * a`.
3. The balloon also has inertia: cabin-frame effective horizontal drive is `(rho_air * V - m_balloon) * a` before tether balance. For a positively buoyant balloon this points along `a`.
4. A dense pendulum has the opposite sign; when acceleration changes sign, the equilibrium lean reverses. With `a = 0`, this horizontal contribution disappears.
5. These equations derive the settled tendency; they do not predict a shot's exact onset, overshoot, oscillation, angle or settling duration. No numeric motion claim is needed.

“Air piles up at the back” is only a schematic pressure explanation: no evacuated front half, large visible density boundary or continuous hurricane through the cabin. All parts still obey inertia.
Closed means an enclosed compartment for this account, not a hermetically sealed pressure vessel. Windows closed and no strong fan jet are staging conditions; no ventilation threshold was measured.

## Pitch risks and cuts

- **R01 — must-fix if asserted:** “speed makes it lean” or CL02 instantly upright at steady speed gives the wrong rule. Keep straight travel, acceleration and a settled interval explicit; no fixed waiting time.
- **R02 — must-fix if asserted:** helium has no inertia / escapes Newton's laws. Preserve the air-versus-balloon mass contrast and pressure force; cut any exemption claim.
- **R03 — must-fix if asserted:** all balloons do this, or the passenger is literally pulled backward by a new force in the ground frame. Keep buoyant helium; distinguish relative lag from real support forces.
- **R04 — optional:** a sharp “jerk” or exaggerated passenger lean is unnecessary. Prefer restrained directional staging until Film/Boat review the actual depiction.
- **R05 — optional:** pressure gradient, effective gravity and equations are writer notes. Under ER05/ER09 use one everyday cause within 10 s; naming every term would add an avoidable mechanism block.

Unresolved/cut: exact angles, acceleration magnitudes, response times, fan/window thresholds, precise ordinary-balloon trajectories and a universal “immediately” claim. None is premise-critical; omit them.
The historical pitch's common-body A/B controls are superseded by discovery R3; no topic demand, retention or engagement outcome is forecast.

## Editorial-development handoff

- Supported progression: passenger's prediction → opposed helium/dense-prop tendencies → surrounding air revealed → settled straight-speed reset → braking reverses the prediction.
- The braking beat now has a first-person observational source as well as a mechanism-based prediction; it remains a dramatized scene, not our recorded experiment.
- Visual/sound boundary: label explanatory air graphics and staged action as reconstruction; no audible cabin air rush is evidenced. No accident, driver challenge, siren or casualty is needed.
- Inspected coverage: enclosed-box premise, car explanation, displaced-air condition, passenger contrast and reported braking; hanging-prop equilibrium and steady-velocity reset are explicitly derived.
- **Verdict: ready-for-editorial-development**, provided the scope limits above remain. No premise-critical gap requires more research; transient details remain intentionally unspecified.
- Next owner: Preaw chooses a distinct C82 opening/story wording. Final script, captions, visual implications and sound then require independent review of their exact revision; this packet is neither final fact-check nor user approval.
