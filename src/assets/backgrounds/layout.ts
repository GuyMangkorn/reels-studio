import type {Actor} from '../../scenes/types';
/** Authored art keeps its proportions; wide frames reveal more of the room. */
export const setLayout = (width: number, height: number) => {
  const scale = height / 1920;
  const span = width / scale;
  return {scale, span, left: (1080 - span) / 2, x: (width - 1080 * scale) / 2};
};

/** Public character foot anchor follows the floor as a standing rig rolls onto its side. */
export const lieFloorAnchor = (floorY: number, scale: number, weight: number) =>
  floorY + (185 - 58) * scale * weight;

/** Room actors share the same camera scale as the furniture, including in landscape. */
export function interiorPlacement<T extends {scale: number}>(
  base: T,
  actor: Actor,
  width: number,
  height: number,
): T {
  const stageFactor = actor.type === 'narrator' ? 1.75 : 1.05;
  const foregroundFactor = actor.type === 'narrator' ? 1.42 : 1.08;
  return {
    ...base,
    scale:
      height > width ? base.scale : (base.scale * (height / 1920) * stageFactor) / foregroundFactor,
  };
}
