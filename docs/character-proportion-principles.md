<a id="character-proportion-principles"></a>
# Character proportion principles for Boss / Film

Updated and sources inspected on 29 October 2026. Rule level: **Reference**. Read when building or changing a character body or head, proportion work, face-expression work or front-view arm poses. Body code in `assets/blender/char_base/` cites these IDs in `# CP-xx` comments; a brief may override a **Default** with a recorded reason. For physical dimensions of scene objects see [scale-and-perspective-principles](scale-and-perspective-principles.md).

Conventions: metres, Z-up, front = -Y, body-left = +X, armature origin on the floor between the feet. Fractions below are of standing height (floor to head top) unless stated.

<a id="cp-a-age-canon"></a>
## CP-A. Age canon (heads tall)

| ID | Age | Heads tall | Status |
| --- | --- | --- | --- |
| CP-A01 | Toddler | 3.75 | sourced (RTB anatomy PDF) |
| CP-A02 | 5 years | 4.5 | sourced (RTB anatomy PDF) |
| CP-A03 | 8 years | 6.0 | sourced (RTB anatomy PDF) |
| CP-A04 | Young teen | 6.5 | sourced (RTB anatomy PDF) |
| CP-A05 | Adult, realistic | 7.5 | sourced (Loomis via Wikipedia) |
| CP-A06 | Adult, ideal | 8.0 | sourced (Loomis via Wikipedia) |
| CP-A07 | Elder | adult canon plus a forward stoop (lower effective height, same bone lengths) | ASSUMPTION: no source found; verify by render before relying on it |

- **CP-A08 (source disagreement).** Sources differ on the adult figure: the aesthetic canon gives 8 heads as ideal and 7.5 as realistic. Use 7.5 for believable characters and 8 only for heroic or idealised ones. Record which was used in the character preset.
- **CP-A09.** Loomis's canon also splits the adult body into roughly a 3-head torso and 4-head legs (chin to crotch about 3, crotch to floor about 4, head 1). Treat as a cross-check, not a constraint.

<a id="cp-l-landmarks"></a>
## CP-L. Landmarks as fractions of height

Adult-male reference: `zc-you` joint heights divided by its height of 1.72 m.

| ID | Landmark | Fraction |
| --- | --- | --- |
| CP-L01 | Pelvis | 0.541 |
| CP-L02 | Shoulder | 0.805 |
| CP-L03 | Hip joint | 0.538 |
| CP-L04 | Knee | 0.279 |
| CP-L05 | Ankle | 0.049 |
| CP-L06 | Neck base | 0.814 |
| CP-L07 | Head top | 1.000 |

Loomis cross-checks (approximate, use to sanity-check a result, not to set it):

- **CP-L08.** Crotch is near 0.5 of height.
- **CP-L09.** Wrist with arms hanging sits near crotch height.
- **CP-L10.** Elbow sits near waist height.

Younger ages scale these through CP-A: a larger head fraction shrinks the legs and torso fractions, so derive child landmarks from the head count rather than reusing the adult table.

<a id="cp-s-sex"></a>
## CP-S. Sex differences (Default)

Values given at a 1.72 m equivalent height; scale with height.

| ID | Parameter | Male | Female |
| --- | --- | --- | --- |
| CP-S01 | Shoulder half-width | 0.195 m | 0.170 m |
| CP-S02 | Hip half-width | 0.085 m | 0.098 m |
| CP-S03 | Waist radius | 1.0 | x0.85 |
| CP-S04 | Chest left/right node radii | reference | set per preset (narrower shoulders, fuller chest nodes) |
| CP-S05 | Neck radius | 1.0 | x0.85 |
| CP-S06 | Hands and feet | 1.0 | x0.9 |

<a id="cp-y-stylize"></a>
## CP-Y. Stylization level 1 (Default)

**Project default (30 Oct 2026):** a new deliverable uses the WORLD FOG painted cast (adult 4 heads tall, mitten hands, decal heads; [project defaults](delivery-workflow.md#project-defaults)) unless the brief picks another body. CP-Y applies when a brief picks the Blender `char_base` body.

Level 1 keeps a human-readable body while pushing it toward a cartoon read.

- **CP-Y01.** Adult height of 4.5 heads.
- **CP-Y02.** Hands and feet x1.3.
- **CP-Y03.** Limb radius x1.25.
- **CP-Y04.** Legs x0.85 of the canon fraction for the age in use.

<a id="cp-f-face"></a>
## CP-F. Face readability

| ID | Rule |
| --- | --- |
| CP-F01 | Eyes, brows and mouth must stay readable in a thumbnail silhouette: check at small size before adding detail. |
| CP-F02 | Add slight asymmetry (brow height, mouth corner) so expressions do not look mechanical. |
| CP-F03 | Brows carry anger and sadness. Give them a strong structure and heavy lids where the style needs expressiveness (the Aardman approach). |
| CP-F04 | Use a fixed set of 16 mouth shapes per character (replacement mouths), not a muscle system. Aardman characters use roughly 16 replacement mouths. |

<a id="cp-p-arm-depth"></a>
## CP-P. Front-view arm depth (Default)

Decided by the user on 30 October 2026 (WORLD FOG r5). In a front view, a bent arm's elbow goes back into depth, behind the torso. It does not splay out to the side at right angles to the body. Film picks the pose type that fits what the character is doing at that moment and writes it in the scene sheet. Any of the four types is valid when it matches the action.

| ID | Pose type | When | How it draws |
| --- | --- | --- | --- |
| CP-P01 (AB0) | Reach to the side | The hand goes to a real target out to the side (a door edge, a shelf), or a pose that really spreads the elbows (hands on the thighs in a slump, elbows outside the knees in a crouch) | Arm in front of the torso; the elbow may splay |
| CP-P02 (AB1) | Elbows back, hands in front | Holding something at the chest or belly (a phone, a torch), hands on a counter | The upper arm is shortened and behind the torso, a shade darker. The elbow sits just inside the torso edge, a little below the hand. The forearm and hand are in front |
| CP-P03 (AB2) | One arm swung back | Walking, recoiling, pulling | The whole arm is behind the torso, with the hand showing past the hip |
| CP-P04 (AB3) | Hands behind the back | Waiting, hesitating, hiding something | Both arms are behind the torso, with the elbows just past the torso edge |

- **CP-P05.** An arm carrying something while walking or standing hangs straight at the side (the rig's hang). Do not hold it bent across the body.
- **CP-P06.** Switching between behind and in front is an instant layer change. Film names the switch frame in the scene sheet. Choose a frame where the upper arm lies outside the torso silhouette so no sleeve pops in.
- **CP-P07.** A hand that sits closer than the shoulder width gets an authored elbow. Two-bone IK with a fixed bone length splays the elbow outward when the hand is near the shoulder.

<a id="cp-p-pose-sheet"></a>
**Pose sheet P01–P30 (Default, user decision 31 Oct 2026).** The project's standard set of thirty front-view arm poses. The poses and their IDs are the norm; the joint angles are read by eye, not measured (Reference). Owner of the library: Boss (`src/painted/kit/pose-sheet.json`, converted to hand targets in the rig). Film cite pose IDs; they do not hold the numbers. Picture: asset store `library/image/pose-sheet/2026-10-31_pose_sheet_ALL_P01-P30.webp`.

**Extension P31–P45 (Default, user decision 1 Nov 2026).** Fifteen body poses (sit, kneel, crouch, lie, run, fall, cower, accuse, hug self, peek, hands behind back, surrender) plus profile arms for P02–P30, in `src/painted/kit/poses-more.ts` (`ALL_POSE_IDS`, `POSE_INFO`, `poseFor(id, def, g, unit, view)`). Not every pose has every view (`poseViews`, `hasView`): P14, P37 and P43 are front only; P32 and P36 are profile only. In every view `lean` is toward screen right. Picture: `KIT-POSES` sheets in asset store `projects/KIT/pose-sheets/`.

- **CP-P12 — Beat first, then the pose sheet** ([story first, kit second](../AGENTS.md#story-first)). Any agent that devises a body pose or gesture for a character (Film's brief and scene sheets, Boss's rig work, Editor's edits) first decides what the beat needs, then checks P01–P45 in `src/painted/kit/poses.ts` / `poses-more.ts` and the catalog sheets (`KIT-POSES`). If a pose matches, cite its ID (e.g. `P14`). If none matches, build the pose the beat needs and record it as a proposed addition to Boss, not as a one-off. For a move rather than a held pose, a matching preset from `MOTIONS` (`src/painted/kit/motions.ts`, reel `KIT-MOTIONS`) is layered with `layerMotion` rather than hand-building the same walk. Applies to front-view arm poses on the painted rig; other rigs port the set first (runtime `missing` until verified).
- **CP-P08.** The elbow stays outside the neck and head silhouette. A hand may touch the face or chin; the forearm never crosses the neck.
- **CP-P09.** A hand foreshortened toward the camera is at most about 1.3x normal size and never larger than the face. Shorten the arm instead of growing the hand.
- **CP-P10.** CP-P02 wins over the sheet for poses that hold something at the chest (P10, P17, P25, P26, P28): the elbows go back behind the torso (decided by the user, 31 Oct 2026). The sheet is read for hand placement only. Poses that really spread the elbows (P06, P09, P22) follow CP-P01.
- **CP-P11.** The sheet's `shoulder_deg` and `elbow_bend_deg` are not rig inputs. The rig takes hand targets (`Arm.to`, `via`, `behind`); Boss converts each pose and records the result.

Runtime (30 Oct 2026, commit `f6e4bd2`):

- WORLD FOG rig: `existing-integrated`. `Arm.via` and `Arm.behind: 'upper' | 'all'` in `src/painted/worldfog/cast.ts`.
- Approved sample: composition `WFOG-ARMBACK-SAMPLE` (`src/painted/spike/ArmBackSheet.tsx`).
- Other rigs (`src/painted/spike/CastSheet.tsx`, Blender `char_base`): `missing`. Port the option into the owning rig before relying on it.
- Known costs: [DF-20261030-painted-arm-depth](dev-findings/DF-20261030-painted-arm-depth.md).

<a id="cp-casting-line"></a>
**Casting line (Default, user decision 1 Nov 2026; order revised 3 Nov 2026, [story first](../AGENTS.md#story-first)).** After designing a character from the story, Film checks the template cast (`PEOPLE` in `src/painted/kit/people.ts`, catalog `KIT-CAST-CARDS`) and names each character that matches as `person [+ outfit] [, pose] [, expression]`, e.g. `man-parted + police, P15, scared`. `parseCasting` in `src/painted/kit/casting.ts` validates the line. A character no template matches is written `new: <short look>`, built in the episode and filed as a comp card at [kit intake](../src/painted/kit/README.md#kit-intake).

<a id="cp-casting-line-animals"></a>
**Animal casting line (Default, user decision 2 Nov 2026).** A dog or cat is picked from `ANIMALS` in `src/painted/kit/animals.ts` (sheets `KIT-ANIMALS`, `KIT-ANIMALS-LINEUP`) and named as `animal [, state] [, motion]`, e.g. `dog-golden, sit, happy-wag` or `cat-black, stand, sniff`: `state` is `stand`, `sit` or `lie`, `motion` an id of `ANIMAL_MOTION_IDS` (`src/painted/kit/animal-motions.ts`, reel `KIT-ANIMAL-MOTIONS`). `parseCasting` does not validate animal lines yet; check the ids against those modules.

<a id="cp-sources"></a>
## Sources

Paraphrased; consulted 29 October 2026.

- Aesthetic canon (Loomis: 8 heads ideal, 7.5 realistic, 3-head torso, 4-head legs): https://en.wikipedia.org/wiki/Aesthetic_canon
- Anatomy for plasticine artists, RTB course PDF (toddler 3.75, age 5 4.5, age 8 6, young teen 6.5): https://www.elearning.rtb.gov.rw/pluginfile.php/6709/mod_resource/content/1/ARCCSC%205001-CSCAD501%20%20APPLY%20ANATOMY%20FOR%20PLASTOCIAN%20ARTIST%20%20L5SCE.pdf
- Creative Bloq, Aardman interview (about 16 replacement mouth shapes per character): https://www.creativebloq.com/3d/aardman-speaks-5059870
- VFX Voice, Early Man (big brow structure and heavy lids for expressiveness): https://www.vfxvoice.com/aardman-goes-back-to-stop-motion-basics-with-early-man/
- CGW, Flushed Away (replacement mouths chosen over a muscle system): https://www.cgw.com/Publications/CGW/2006/Volume-29-Issue-10-Oct-2006-/Flushed-with-Success.aspx
