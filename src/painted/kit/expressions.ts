import type {FaceState} from './head';

// Named expression presets for the painted kit's decal heads (`head.ts`, any `CastDef`, front and profile). A shot picks an id
// instead of assembling brow / eyes / mouth: `drawFigure(p, def, g, unit, {view, face: EXPRESSIONS.smug}, t)`. Ids are stable.
// Added 1 Nov 2026 (people library pass 1); `tired` 2 Nov 2026. Sheet: KIT-EXPRESSIONS (adult, child and elder, front and profile).
//
// - Every preset is a plain `FaceState`; spread it to override one control: `{...EXPRESSIONS.talk, open: mouthAt(...)}`.
// - Eyes blink on the rig's own clock (`blinking`), so a still can catch a shut frame: pass a `t` where `!blinking(t, seed)`.
// - Mix two expressions over time by switching the id on a beat, or move only the brow with `browTo` + `browMix` (FaceState).
// - Mouth lip-sync: `talk` is the speaking face; drive its `open` 0..1 from the narration amplitude (`mouthAt`).

export const EXPRESSION_IDS = [
  'neutral', 'happy', 'laugh', 'smug', 'sad', 'crying', 'angry', 'furious', 'surprised', 'scared', 'terrified',
  'worried', 'suspicious', 'disgusted', 'sleepy', 'whisper', 'shock', 'talk', 'asleep', 'tired',
] as const;
export type ExpressionId = (typeof EXPRESSION_IDS)[number];

export const EXPRESSIONS: Record<ExpressionId, FaceState> = {
  neutral: {brow: 'flat', eyes: 'dot', look: [0, 0], mouth: 'flat'},
  happy: {brow: 'up', eyes: 'dot', look: [0, 0], mouth: 'smile'},
  laugh: {brow: 'up', eyes: 'shut', look: [0, 0], mouth: 'grin'},
  smug: {brow: 'quirk', eyes: 'half', look: [0.4, 0], mouth: 'smirk'},
  sad: {brow: 'worry', eyes: 'half', look: [0, 0.5], mouth: 'frown'},
  crying: {brow: 'worry', eyes: 'shut', look: [0, 0], mouth: 'shout', open: 0.45, tears: 1},
  angry: {brow: 'angry', eyes: 'dot', look: [0, 0], mouth: 'frown', squint: 0.5},
  furious: {brow: 'angry', eyes: 'dot', look: [0, 0], mouth: 'shout', open: 0.8, squint: 0.7},
  surprised: {brow: 'up', eyes: 'wide', look: [0, 0], mouth: 'o'},
  scared: {brow: 'worry', eyes: 'wide', look: [-0.6, 0], mouth: 'gasp'},
  terrified: {brow: 'worry', eyes: 'wide', look: [0, 0], mouth: 'shout', open: 1, sweat: true},
  worried: {brow: 'worry', eyes: 'dot', look: [0.3, 0.2], mouth: 'wavy'},
  suspicious: {brow: 'quirk', eyes: 'half', look: [0.9, 0], mouth: 'flat', squint: 0.3},
  disgusted: {brow: 'angry', eyes: 'half', look: [0, 0.2], mouth: 'wavy', squint: 0.3},
  sleepy: {brow: 'worry', eyes: 'half', look: [0, 0.6], mouth: 'flat', squint: 0.5},
  whisper: {brow: 'worry', browTo: 'flat', browMix: 0.5, eyes: 'dot', look: [0.8, -0.2], mouth: 'talk', open: 0.35},
  shock: {brow: 'up', eyes: 'wide', look: [0, 0], mouth: 'shout', open: 0.6},
  talk: {brow: 'flat', eyes: 'dot', look: [0, 0], mouth: 'talk', open: 0.7},
  asleep: {brow: 'flat', eyes: 'shut', look: [0, 0], mouth: 'flat'},
  tired: {brow: 'worry', eyes: 'half', look: [0, 0.4], mouth: 'gasp', squint: 0.4, sweat: true, bags: 1},
};

export type ExpressionInfo = {
  /** One line: what the face does. */
  description: string;
  /** When a shot should pick it. */
  use: string;
};

export const EXPRESSION_INFO: Record<ExpressionId, ExpressionInfo> = {
  neutral: {description: 'Flat brows, dot eyes, closed flat mouth.', use: 'Default idle, listening, any beat with no emotion yet.'},
  happy: {description: 'Raised brows, dot eyes, smile.', use: 'Pleased, greeting, relief, good news.'},
  laugh: {description: 'Raised brows, eyes shut, wide open grin with teeth.', use: 'Big laugh, joke landing, hysterical relief.'},
  smug: {description: 'One brow quirked, half-lidded eyes glancing aside, lopsided smirk.', use: 'Knowing, self-satisfied, teasing, a lie being told.'},
  sad: {description: 'Worried brows, half-lidded eyes looking down, frown.', use: 'Disappointed, grieving quietly, bad news landing.'},
  crying: {description: 'Worried brows, eyes shut, open wailing mouth, tear streams.', use: 'Sobbing, breaking down; pair with a bowed head or hands to face.'},
  angry: {description: 'Slanted brows, narrowed eyes, frown.', use: 'Annoyed, confronting, holding anger in.'},
  furious: {description: 'Slanted brows, hard squint, wide open shouting mouth.', use: 'Shouting, rage; keep short, it reads loudly.'},
  surprised: {description: 'Raised brows, wide eyes, small round mouth.', use: 'Mild surprise, noticing something, a pleasant shock.'},
  scared: {description: 'Worried brows, wide eyes looking away, gasping mouth.', use: 'Startled, nervous glance at something off-frame.'},
  terrified: {description: 'Worried brows, wide staring eyes, open scream, sweat drop.', use: 'Horror reveal, being chased, a scream moment.'},
  worried: {description: 'Worried brows, dot eyes looking aside, wavy mouth.', use: 'Anxious, unsure, waiting for results.'},
  suspicious: {description: 'One brow quirked, narrowed half-lidded side-eye, flat mouth.', use: 'Doubting someone, watching a stranger, spotting a clue.'},
  disgusted: {description: 'Slanted brows, squinting half-lidded eyes, wavy mouth.', use: 'Revulsion, smelling or seeing something foul.'},
  sleepy: {description: 'Drooping brows, heavy half-lidded eyes looking down, flat mouth.', use: 'Tired, bored, drifting off; blinks slowly with the rig clock.'},
  whisper: {description: 'Softened brows, dot eyes glancing aside, small slit mouth.', use: 'Secret, hushed warning; face a listener in profile.'},
  shock: {description: 'Raised brows, wide eyes, jaw dropped (medium open mouth).', use: 'Stunned silence, a twist landing, frozen disbelief.'},
  talk: {description: 'Flat brows, dot eyes, speaking mouth (open 0.7).', use: 'Speaking; override `open` per frame from the narration amplitude.'},
  asleep: {description: 'Flat brows, eyes shut, flat mouth.', use: 'Sleeping, eyes closed on purpose (the rig blink is not needed).'},
  tired: {description: 'Drooping brows, heavy half-lidded eyes with dark under-eye bags, open panting mouth, sweat drop.', use: 'Exhausted, worn out after running or work; pair with a slumped pose. Use `sleepy` for drowsy.'},
};
