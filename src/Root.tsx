import React from "react";
import { Composition } from "remotion";
import { Demo } from "./Demo";

const FPS = 30;
const DURATION = 210;

/** Same scene, two frames. Rig2DDemo matches Short so the original render id still works. */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Short" component={Demo} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} defaultProps={{ showPivots: false }} />
    <Composition id="Long" component={Demo} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ showPivots: false }} />
    <Composition id="Rig2DDemo" component={Demo} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} defaultProps={{ showPivots: false }} />
  </>
);
