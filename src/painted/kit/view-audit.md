# KIT-VIEW-AUDIT findings (13 Nov 2026)

Step 1 of the character-angle work: how one kit figure (`woman-curly`) reads as the yaw camera orbits it. Sheet:
[view-audit-sheet.tsx](view-audit-sheet.tsx), 12 azimuths (30 deg steps) x eye level / high (down 30 deg) / low (up 20 deg) x
poses P01 stand, P38 run, P31 sit chair, P35 crouch. Stills: store `projects/shared/KIT/samples/` (`f0-f11.png`, `one0-2.png`, `poses.png`).

Status of each finding is **Reference** (observed), not a rule. Fixes need the user's look approval (README: recurring cast).

| ID | Where | What breaks | Severity |
| --- | --- | --- | --- |
| VA01 **fixed 13 Nov 2026** (`back.ts` body poses; test `tests/back-view.test.ts`) | Back view, P35 crouch, P31 sit, P38 run (150-210 deg) | Back view ignores body poses: crouch and run draw a full standing back, sit draws a standing back cut short. The figure "stands up" when the camera passes behind. Matches the README limit (back: no crouch/sit/kneel/run/lie). | High |
| VA02 **opt-in fix 13 Nov 2026** (`FigureAtOpts.backQuarter`, `view: 'back'` + `quarter`; user lifted the 4 Nov rule) | 120 deg and 240 deg | Body is turned 120 deg away, the kit still draws a clean profile with the face showing, then snaps to a full back at 135 deg. Largest visual jump of the orbit (about 90 deg in one cut). No back three-quarter by user decision (views.ts, 4 Nov 2026: hair covers the turn). Fix: `back-right`/`back-left` sectors (30-60 deg off the back) draw the back turned: lost-profile cheek and near ear, hair squeezed to the turned skull, tucked arms, turned shoes, side-plane glaze; the run takes its stride and arm swing from the profile (`turnRun`), a sarong keeps its length and a short step, trousers get a seat. Motion check: `KIT-VIEW-RUN`. | High |
| VA03 **opt-in fix 13 Nov 2026** (`FigureAtOpts.pitchCue`; test `tests/pitch-cue.test.ts`) | High and low cameras | The figure is the same vertical card at every pitch: no crown of the head or shoulder tops from above, no shorter legs or larger feet; from below no underside of chin, no longer legs. Only size and position change, so high/low shots read as a cardboard standee. | High |
| VA04 **opt-in fix 13 Nov 2026** (`FigureAtOpts.quarterFollow`; test `tests/quarter-follow.test.ts`) | 30 and 60 deg (and 300/330) | Front three-quarter is fixed at 45 deg: two cells 30 deg apart are identical, then jump to profile at 67.5 deg. No continuous turn or cross-fade. | Medium |
| VA05 **fixed 13 Nov 2026** (back skirt takes the front cut and hem) | Skirt, back vs front/profile | Back view skirt is a flared A-line; front and profile are straight. Same outfit reads as two garments across a cut. | Medium |
| VA06 **fixed 13 Nov 2026** (rig run arms pump from behind; test in `tests/back-view.test.ts`) | Back view arms | P01 and P38 back arms mirror the front pose (`poseFor` gets 'front'): run reads as hands on hips from behind. | Medium |
| VA07 **fixed 13 Nov 2026** | Three-quarter side plane | The shaded side of the turned body glazed every cloth shape with the shirt colour, so a skirt's side read tan like skin. Each shape now shades in its own cloth colour (`cast.ts` `planeShapes`). | High |

Suggested order for step 2+: VA01 (back body poses) and VA03 (pitch cues) first, since both turn on in every orbit or high/low
shot; VA02 needs the user to revisit the 4 Nov "no back three-quarter" decision; VA04-VA06 are smaller fixes in the owning modules.
