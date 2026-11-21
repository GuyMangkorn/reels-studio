---
name: anatomy-check
description: Body check for a character doing an action, on rendered frames before a frame is reported: the action line, the blind read, and the fault list AN01–AN12 (proportions against the cast card, arm and leg chains, joint direction, hand on the object, effort, balance, planted feet, motion between frames). Use when posing, animating, reviewing or fixing a character that holds, reaches, lifts, pushes, sits, walks or does any other action (ท่าทาง, จับของ, แขนขา, สัดส่วน, ดูไม่เป็นธรรมชาติ).
---

# Anatomy check

**Requirement (user, 21 Nov 2026)** for whoever poses or moves a figure: Film on thumbnails and look frames, Boss on plates and kit poses, Editor on edits. It runs before the frame goes into a handoff or a reply; the [viewer check](../../../docs/sequence-workflow.md#viewer-check) stays the second pair of eyes ([UT17](../../../docs/user-taste.md#ut-body-action)).

The maker knows what the pose was meant to be, so the maker's eye sees the intent and passes the frame. This check makes the picture speak first: write the **action line**, render, do a **blind read** of the frame, then walk the **fault list**.

## 1. Action line (before posing)

One line per character per action, in the scene sheet or handoff:

`<character> <verb> <object>: weight on <both feet | R foot | L foot | seat | knees>, <RIGHT|LEFT> hand <grip> on <part of the object> at <height m>, other arm <what it does>, looks at <target>`

Example: `Marcus lifts the bucket: weight on both feet with knees bent, RIGHT hand grips the handle at 0.4 m, other arm out for balance, looks at the bucket`.

Act it out from the feet up as a real body: what carries the weight, which part moves first, where the free arm goes. When the line needs a reach, a height or a bend a person cannot do, restage the prop, the figure or the camera until it can ([reach](../hand-drawing/SKILL.md#8-arm-chain-and-body-contact-requirement-user-19-nov-2026): shoulder height + 2 × bone). Then pick the pose or motion from the kit ([CP-P12](../../../docs/character-proportion-principles.md#cp-p-pose-sheet)). A visible hand also gets its hand line ([hand-drawing section 7](../hand-drawing/SKILL.md#7-thumb-check-before-reporting-a-frame-requirement)).

## 2. Frames

Render stills ([render skill](../../../.agents/skills/render/SKILL.md)) of each action's start, **contact frame** (the hand meets the object, or the weight shifts) and end, plus every 2–4 frames through the motion. View them as a `scripts/qa-sheet.sh` sheet, and the contact frame alone at `--width 540`.

## 3. Blind read

Looking only at the sheet, write what the picture shows for each figure:

`<character> reads as <action in plain words>; R arm: shoulder → elbow <direction> → hand <on what>; L arm: ...; R leg: hip → knee <direction> → foot <where>; L leg: ...; weight on <what>`

Trace every chain joint to joint in the picture. A chain you cannot trace is a fault ([hidden limbs](../hand-drawing/SKILL.md#8-arm-chain-and-body-contact-requirement-user-19-nov-2026) keep their visible part continuous). Then compare the blind read with the action line: every difference is a fault.

## 4. Fault list AN01–AN12

Answer every item for every posed figure on every frame of the sheet.

| ID | Passes when |
| --- | --- |
| **Proportion** | |
| AN01 Cast card | Head count and limb lengths equal the character's kit card and its other shots ([CP-A](../../../docs/character-proportion-principles.md#cp-a-age-canon), [CP-L](../../../docs/character-proportion-principles.md#cp-l-landmarks)). With an arm hanging, the wrist is at crotch height and the elbow at the waist. |
| AN02 Pairs | Left and right arm are the same length, and so are the legs. A limb drawn shorter carries a foreshortening cue (it overlaps itself, the near end is larger; hand at most 1.3 × and smaller than the face, [CP-P09](../../../docs/character-proportion-principles.md#cp-p-pose-sheet)). |
| **Chains** | |
| AN03 Attached | Segments meet at every joint: upper arm in the shoulder, wrist in the sleeve, thigh in the pelvis, ankle in the shoe. |
| AN04 Bone length | Every segment keeps its length on every frame of the motion: arms within 1.05 × bone, measured ([hand-drawing section 8](../hand-drawing/SKILL.md#8-arm-chain-and-body-contact-requirement-user-19-nov-2026)); thigh and shin constant, so bending the knees lowers the hips. |
| AN05 Joint direction | The elbow folds the forearm toward the front of the body, the knee folds the shin toward the back, and both stop at straight. In a front view a bent elbow goes back behind the torso ([CP-P02](../../../docs/character-proportion-principles.md#cp-p-arm-depth)) and a bent knee comes toward the lens, shortening the thigh. |
| AN06 Sides | Each right limb is on the screen side its view gives ([hand-drawing section 1](../hand-drawing/SKILL.md#1-which-arm-is-where)), through a turn too, and the far limb is the overlapped one. |
| **Contact** | |
| AN07 Hand on the object | The palm overlaps the object at the part the action line names, with the thumb opposite the fingers on a grip. The object is the right size against the hand ([scale](../../../docs/scale-and-perspective-principles.md)) and travels with the hand on every frame. |
| AN08 Effort | The whole body does the action: a heavy load sits close with bent elbows or two hands and the torso leans away from it; a push leans in with one foot back; a pull leans back; a pick-up bends knees and hips; a high reach lifts the shoulder and stretches the torso. |
| **Balance and ground** | |
| AN09 Weight | The pelvis is above the supporting foot, between the feet or on the seat. A lean past the feet has a hand, a wall or the next step catching it. |
| AN10 Feet | Soles sit on the ground plane with a contact shadow. A planted foot stays on its spot while the body moves; steps alternate, with the opposite arm swinging. |
| **Head and motion** | |
| AN11 Head | The head sits on the neck above the shoulders, turns at most to the shoulder line, and the eyes are on the action line's target. |
| AN12 Between frames | Each limb travels in an arc around the torso, the head and the prop, and neighbouring frames differ by a small step in position and none in length. |

## 5. Fix and record

1. Send each fault to its owner: a kit pose or rig fault to the kit module (Boss), a staging fault to the shot. Restage before stretching a limb.
2. Re-render and repeat sections 3 and 4 on the new sheet.
3. Record one line per figure in the QA notes: `anatomy check: <shot> <character>: reads as <blind read>; AN01–AN12 ok; sheet <path>`. An item left open is written `AN<nn> open: <what and why>` and travels in the handoff as a limitation.

Done when every figure posed or moved in every changed shot has that line, citing a sheet viewed after the last change, and the handoff returns the sheet paths.
