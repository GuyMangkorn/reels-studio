// EDU-EP16..18 survival series: the shared asset module (Boss, 14 Nov 2026; promoted from the W3 look-frame code, all four look frames passed by the user).
// Scenes import from here and pass IDs plus staging; they never copy art. Painters take a yaw camera (`kit/ycam.ts`, `kit/cam-moves.ts`) and world metres.
// Screen layers (`screens.tsx`) are HTML/SVG over the plate and are exported from './screens' (not from this barrel, so the painter modules stay Remotion-free).
//
//   Sets      SET-VIL village (village.ts: paintVillage), SET-UNDER under-house (under.ts: paintUnder), SET-RIVER (river.ts: paintRiver),
//             SET-MESO-FOREST (forest.ts: paintTreeFern / paintCycad / paintConifer / paintFernClump / forestItems)
//   Cast      isan-home outfits (cast.ts: paintCast, ISAN_OUTFITS; checks = `Gear.belt.checks` of the kit rig)
//   Animals   hen K01 + motions (hen.ts), long-neck head/neck + silhouette + far herd (creatures.ts), spinosaurus-like + stride (creatures.ts)
//   ENV       fire (fire.ts), sky ripple S-WORM (sky.ts), phone torch beam and held props (props.ts)
//   Batch 2   pterosaur.ts (N16-07), cards.ts + screens.tsx FlowerPopFrame (N16-09), poses.ts (series poses), shop.ts (SET-SHOP), bugs.ts, rain.ts, paintGreenSmoke (fire.ts)
//   Screens   RecipeCard, Safety, RuleSign, PhoneScreen (screens.tsx)
export * from './core';
export * from './cast';
export * from './hen';
export * from './creatures';
export * from './forest';
export * from './village';
export * from './under';
export * from './river';
export * from './fire';
export * from './sky';
export * from './props';
export * from './pterosaur';
export * from './cards';
export * from './poses';
export * from './shop';
export * from './bugs';
export * from './rain';
