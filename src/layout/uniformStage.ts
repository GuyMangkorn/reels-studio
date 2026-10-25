/** Portrait design size shared by interiors, the bedroom POV, and exterior proportions. */
export const DESIGN_W = 1080;
export const DESIGN_H = 1920;

/**
 * Fit a portrait design into a frame with one scale on both axes.
 * A wider frame keeps that scale and leaves side room for extended wall and floor.
 */
export function uniformStage(
  width: number,
  height: number,
  designW = DESIGN_W,
  designH = DESIGN_H,
) {
  const scale = Math.min(width / designW, height / designH);
  const contentW = designW * scale;
  const contentH = designH * scale;
  return {
    scale,
    offsetX: (width - contentW) / 2,
    offsetY: (height - contentH) / 2,
    contentW,
    contentH,
  };
}

/** SVG transform: translate to the centered stage, then one uniform scale. */
export function uniformStageTransform(
  width: number,
  height: number,
  designW = DESIGN_W,
  designH = DESIGN_H,
) {
  const stage = uniformStage(width, height, designW, designH);
  return `translate(${stage.offsetX} ${stage.offsetY}) scale(${stage.scale})`;
}
