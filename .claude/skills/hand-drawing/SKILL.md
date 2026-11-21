---
name: hand-drawing
description: Hands without a flipped thumb or a swapped arm, from the rig's mitten to the five-finger close-up: which arm is on which screen side, which face of the hand shows, where the thumb goes, the gesture kit (point, pinch, grip, thumbs-up ...), the first-person (POV) and close-shot (1–1.5 m) hand kits with props, the thumb check before a frame is reported, and the arm-chain check (hand attached, bone length, reach, stepping). Use when drawing, posing, reviewing or fixing any hand, arm gesture, arm anatomy or hand close-up (มือ, นิ้วโป้ง, แบมือ, หลังมือ, แขนหลุด).
---

# Hand drawing

The thumb errors this skill prevents are mirror errors: a right hand drawn as a left one, the palm drawn where the back shows, an arm swapped when the character turns. Each one comes from deciding the thumb by eye. Decide it with the rule below, and let the code measure it.

## 1. Which arm is where

The character's right and left never change; their screen side does.

| Character | Their RIGHT arm on screen | Their LEFT arm on screen |
| --- | --- | --- |
| Faces the camera (front, 3/4 front) | screen LEFT | screen RIGHT |
| Back to the camera (back view, `view: 'back'`) | screen RIGHT | screen LEFT |
| Profile facing screen right | near arm (drawn over the body) | far arm (behind the body) |
| Profile facing screen left | far arm | near arm |

Name the arm by the character's side in every brief, cast line and shot (`rArm`, `lArm`), never by its screen side.

## 2. The thumb rule (one rule for every angle)

Take the direction **wrist → fingers** on screen. The thumb sits on its **clockwise** side when the picture shows:

- the **palm of a RIGHT hand**, or
- the **back of a LEFT hand**.

It sits on the **counter-clockwise** side for the back of a right hand or the palm of a left hand.

The rule turns with the hand, so it also covers fingers pointing down, sideways or at an angle. With the fingers up it reads:

| Fingers up | Palm shows | Back shows |
| --- | --- | --- |
| RIGHT hand | thumb screen RIGHT | thumb screen LEFT |
| LEFT hand | thumb screen LEFT | thumb screen RIGHT |

Self-check: hold up your own right hand with the palm toward your face, fingers up. The thumb is on the right, which is the palm row above. Turn the hand round and the thumb goes to the left.

In code this is `mittenThumbSide(side, shows)` in [hand-gestures.ts](../../../src/painted/kit/hand-gestures.ts). It returns +1 for the clockwise side, which is exactly the value of `Arm.open` / `Arm.fist` in [cast.ts](../../../src/painted/kit/cast.ts) (`openHandParts`, `fistParts` in `draw.ts`). Use it for the mitten's thumb side instead of typing `1` or `-1`. `tests/hand-gestures.test.ts` checks it against the 3D hand for every gesture, both hands and three tilts.

## 3. Which face shows

Decide this from the pose, then apply section 2. Common cases:

| Pose | Front view (faces camera) | Back view (back to camera) |
| --- | --- | --- |
| Arms hanging relaxed | back of the hand, thumb toward the body midline | palm or little-finger edge; thumb points away, mostly hidden, tip toward the body |
| Wave, stop, high-five, swear an oath (palm forward) | palm; thumb toward the body midline | back; thumb toward the body midline |
| Looking at own palm, reading the hand, holding a phone up to read | back | palm |
| Offering, begging, catching rain (palm up) | palm from above, fingers toward the camera | back from below or hidden |
| Fist punching or knocking toward the camera | knuckles: the back | (punch away) the palm side of the fist |
| Hand on the chest, over the mouth | back | hidden |

A fist shows its back (the knuckles) unless the shot turns the curled fingers toward the camera. For a mirrored figure (a left-facing profile drawn by flipping), decide palm or back in the picture as it is painted, then apply the rule.

## 4. Scale: mitten or five fingers

- **Figure scale** (full figure, or any camera farther than 1.5 m: fingers are too small to read, about 11 px at 2 m): the mitten of [UT14](../../../docs/user-taste.md#ut-simple-hands) (no drawn fingers). Set its thumb with `mittenThumbSide`.
- **Close shot, 1–1.5 m** (thigh-up, so hands at rest stay in the frame; fingers about 20–30 px): the five-finger 3D hand (`Hands3D` via `midHands3D`, close-shot kit, section 6). User, 21 Nov 2026; until then the mitten was the default here and the 3D hand was Film's recorded choice.
- **First person (POV):** always the five-finger 3D hand (`Hands3D`, section 6). User, 18 Nov 2026.
- **Close-up** (the hand or its action is the subject: pressing, pinching, counting, holding): the five-finger 3D hand from the gesture kit. Use it whenever the shot names the fingers.

## 5. The gesture kit (five-finger close-ups)

`HAND_GESTURES` in [hand-gestures.ts](../../../src/painted/kit/hand-gestures.ts) is built on the 3D hand macro (`paintHandMacro`, [hands.ts](../../../src/painted/kit/hands.ts)). Gestures: `relaxed`, `open-spread`, `stop`, `point`, `fist`, `thumbs-up`, `pinch`, `ok`, `peace`, `three`, `four`, `grip`, `hold-pen`, `cupped`, `claw`. Each entry carries its verb in English and Thai.

```ts
const hand = gestureHand('point', {side: 'right', wrist: [x, y, z], base: 4000, size: 1, unit: 0.01, tone: MACRO_TONES.boy, yaw, pitch, roll, elbow, sleeve});
paintHandMacro(p, cam, hand);
```

- `side` makes the hand. **Never mirror a hand to get the other one**: mirroring keeps the thumb on the wrong edge. Make the other side with `side`.
- Orientation (degrees): `roll` about the finger axis (mirrored by side inside `gestureHand`), then `pitch` (90 = fingers up, back of the hand toward +z), then `yaw` about world y. Defaults: the gesture's `show` orientation.
- `base`: each hand needs its own id range of 240.
- Place a figure's hand on the macro hand with `macroHandTarget(cam, hand)` (the SP3 pattern in `hands-macro-specs.ts`). Paint the macro hand after the figure.
- A verb with no gesture: write `new: <short look>` in the casting line ([story first](../../../AGENTS.md#story-first)) and add the entry to `HAND_GESTURES`. Thumb tips that touch something get a target in `scripts/painted-kit/solve-thumbs.ts`; run `npx tsx scripts/painted-kit/solve-thumbs.ts` and paste the solved `T(...)`, because the test compares them.

**Reference sheet:** `node scripts/painted-kit/hand-gestures.mjs --out=out/hand-gestures [--only=pinch,ok]` writes one still per gesture: right and left × palm and back, plus the thumb edge and back 3/4. The thumb tip carries an orange ring, and each cell prints the measured screen side. The current set is filed in the store at `library/pose-reference/hand-gestures/<gesture>.png` (`$REELS_STORE`); re-file it with `store.py put` after a gesture changes. Open the gesture's sheet before drawing or reviewing that hand.

## 6. Hand kits: first person and close shot

Two kits put the five-finger hands to work. Pick an action, open its sheet, and reuse it as built; add a new action only when none matches the beat (`new: <short look>`, [story first](../../../AGENTS.md#story-first)).

- **First person (POV):** `POV_ACTIONS` in [pov-hands.ts](../../../src/painted/kit/pov-hands.ts): 36 actions of the viewer's own arms (wave, stop, point, press-button, phone-tap, hold-cup, write, pick-coin, hold-ball, open-door, read-book, open-bottle, give-card, receive-apple, steer, thumbs-up, count-three, knock, type, wai, look-at-palm, turn-key, peace, toast, remote, reach-open, pay-cash, count-money, eat-spoon, drink-glass, hold-phone, take-pill, cut-paper, wash-hands, open-box, hold-umbrella). **Engine: Three.js (user, 18 Nov 2026)**, because the painted and SVG hands had no mass: paint the room, then lay the 3D arms and props over it through the same camera, `const scene = POV_ACTIONS[id].build(), cam = povCam(scene); paintPovRoom(p, cam, scene);` then `<Hands3D cam={cam} arms={scene.hands.map((h) => ({hand: h, elbow: povElbow(h), shoulder: POV_SHOULDER[...], sleeve}))} props={scene.props} />` ([hand3d.tsx](../../../src/painted/kit/hand3d.tsx); props as meshes in [hand-props3d.ts](../../../src/painted/kit/hand-props3d.ts), kept in step with `PROPS`). `PovStill` in `hand-kits-sheet.tsx` is the worked example. `povCam` turns the eye to the middle of the action; a scene with `plane` gets a table. In 3D a prop no longer paints over the fingers, so place it where a real hand holds it: a phone across the palm with the fingers round its far edge, a coin standing out of the pinch, a stack of notes across a flat palm. `npx tsx scripts/painted-kit/prop-contact.ts <action> [prop]` prints every finger joint in the prop's frame (cm), so a grip is tuned by numbers, not by eye. The painted path (`paintPovScene`) stays for the room-only and legacy stills. The viewer's right arm enters from screen right, the left from screen left; the camera sits 10 cm ahead of the shoulders.
- **Close shot (1–1.5 m):** `MID_ACTIONS` in [mid-hands.ts](../../../src/painted/kit/mid-hands.ts): 34 actions on a rig figure at 1.3 m, thigh-up so hands at rest stay in the frame (never crop through hands or wrists), front and back, each with its face (`MID_FACE`). The rig draws the arm to the wrist with `Arm.noHand: true`; the hand is 3D (user, 18 Nov 2026): paint the figure with `paintMidCell(p, c, {hands: false})`, then lay `<Hands3D cam={c.cam} {...midHands3D(c)} />` over it, clipped to the shot. `midHands3D` splits the hands as the painted order did: `front` hands go over the figure, `behind` hands come with depth-only stand-ins for the torso, head (`MID_HEAD`) and both arms, so the figure hides them (check the fit with `--debug=1`). Arms are hand-only at `MID_HAND_SIZE` (the 4-head cast's hand scale). Point fingers out to the side, not at the lens: perspective makes a hand pointing at the camera look huge in front and a stub from behind. Full-figure shots at 2 m or more keep the mitten (section 4).
- **Build your own:** `specHand({gesture, side, forward, back, wrist | put})` in [hand-place.ts](../../../src/painted/kit/hand-place.ts) points the fingers along `forward` with the back of the hand toward `back`. For a grip on a rod (cup, lever, rim), `forwardFor(side, thumbAxis, back)` gives the finger direction for that hand, so the thumb lands on the correct edge without mirroring. `put: {landmark: LANDMARKS.pinch | grip | indexTip | palm ..., at}` moves the hand so that landmark touches the prop; `PROPS` in [hand-props.ts](../../../src/painted/kit/hand-props.ts) draws the prop from a frame taken from the same landmarks.
- **Sheets:** `node scripts/painted-kit/hand-kits.mjs --kit=pov|mid --out=DIR [--only=a,b]`, one still per action with each hand's measured line. Store: `library/pose-reference/pov-hands/v7/<action>.png` (3D), `library/pose-reference/close-hands/v6/<action>.png` (3D). `tests/hand-kits.test.ts` checks reach, contacts, the arm end on the wrist and the right shoulder's screen side.

## 7. Thumb check before reporting a frame (Requirement)

For every shot with a visible hand, before the frame goes into a handoff or a reply:

1. Write the hand's line in the scene sheet or handoff: `<character> RIGHT|LEFT hand, <gesture or mitten>, shows palm|back|edge, fingers <screen direction>`.
2. Get the thumb side from that line with section 2. For a macro hand, `handFacing(cam, hand)` returns `{shows, thumbOnScreen}` measured through the shot camera (`thumbOnScreen` is up or down when the fingers lie flat across the frame); it must match the line. For a mitten, `mittenThumbSide(side, shows)` must equal the `open` / `fist` value in the code.
3. Look at the rendered frame (`scripts/qa-sheet.sh --width 540`) and name the thumb's screen side for each hand. The check passes when line, code and picture agree for every hand. Record `thumb check: <hand>: <side> ok` in the QA notes.
4. Arms: the character's right arm is on the screen side section 1 gives for the view. Check it in the same pass, including after a turn (front → back flips it).

A frame that fails the thumb check goes back to the step that made it. Pass it only after the fix is re-rendered and checked again.

## 8. Arm chain and body contact (Requirement; user, 19 Nov 2026)

A hand is only as good as the arm that carries it. The EP26 draft review ([build-notes, draft fix round B](../../../scripts/edu-series/ep26/build-notes.md#draft-fix-round-b-boss-anatomy-and-staging-19-nov-2026)) found these faults the thumb check does not catch.

**Symptoms to look for:** a hand detached from its forearm (a gap or offset at the wrist), an arm longer than the other or than the body allows, a limb that bends the wrong way or hangs limp like a paralysed arm, a hand that jumps between two frames, a held object floating beside the hands, a figure gliding instead of stepping.

**Rules:**

1. **Arm meets a 3D hand or a world point:** when a painted arm must end on a projected point (the wrist of a `Hands3D` hand, a held prop, a pole), set `Arm.exact` on that arm ([cast.ts](../../../src/painted/kit/cast.ts) front and three-quarter path, [back.ts](../../../src/painted/kit/back.ts) back path). Without it, a three-quarter body pulls `to`/`via` toward its centre and a back view mirrors them, so the arm ends off the wrist (front three-quarter 54–75 degrees and back three-quarter views are where this shows).
2. **Bone length:** keep every arm within 1.05 × its bone after posing ([fit-arms.ts](../../../src/painted/kit/fit-arms.ts) `fitArms`; arm bone about 0.26 m per segment on the 4-head rig). Measure it per frame through the motion, not only on the key poses.
3. **One chain, every frame:** build shoulder → elbow → wrist → hand as one solved chain each frame (two-bone elbow, a pole that eases between poses). Never merge a separately solved hand or floating forearm into the rig, and never switch a hand between two targets in one frame.
4. **Reach and support:** check a target is inside reach before staging it (shoulder height + 2 × bone; Marcus: 1.12 + 0.52 = 1.64 m). A body that steps, sits or lowers carries its weight on a bending leg with the other foot lifting and landing; arms go out for balance. Stage the prop or the camera to the reach, not the arm to the prop.
5. **Hidden limbs:** when a wall, a tub rim or another figure hides a limb, keep the visible part attached and continuous (repaint the occluder over it, or use a depth occluder for a 3D hand), and let a cue in the picture (ripples, cloth, a contact shadow) carry what is hidden.

**Check (before a frame goes into a handoff):** render stills every 2–4 frames through each arm or body motion and view them as a qa-sheet (`scripts/qa-sheet.sh`), plus a full-size crop at the wrist for every 3D hand. Record the measured arm ratio (max × bone) and `arm check: <character> <side>: attached ok` in the QA notes. A frame that fails goes back to the step that made it, as in section 7.
