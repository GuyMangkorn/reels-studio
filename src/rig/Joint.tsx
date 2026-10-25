import type {ReactNode} from 'react';
/** Translate the pivot, then rotate child artwork in its own local coordinate space. */
export const Joint = ({name, x = 0, y = 0, angle = 0, children}: {name: string; x?: number; y?: number; angle?: number; children: ReactNode}) => (
  <g transform={`translate(${x} ${y})`} data-joint={name}>
    <g style={{transformBox: 'view-box', transformOrigin: '0px 0px', transform: `rotate(${angle}deg)`}}>{children}</g>
  </g>
);
