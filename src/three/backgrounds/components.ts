import type {ComponentType} from 'react';
import {Bedroom3D} from './Bedroom3D';
import {DrawingRoom3D} from './DrawingRoom3D';
import {Exterior3D} from './Exterior3D';
import {Staircase3D} from './Staircase3D';
import {Window3D} from './Window3D';
import type {ThreeBackgroundName, ThreeBackgroundProps} from './registry';

export const threeBackgroundComponents: Record<
  ThreeBackgroundName,
  ComponentType<ThreeBackgroundProps>
> = {
  drawingRoom: DrawingRoom3D,
  bedroom: Bedroom3D,
  staircase: Staircase3D,
  window: Window3D,
  exterior: Exterior3D,
};
