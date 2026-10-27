import {PhysicalSofa, PHYSICAL_SOFA_PLACEMENT, PHYSICAL_SOFA_SPEC} from '../props/Sofa';
import type {BoundsMeters} from '../../scenes/types';

/**
 * Fixed-view, all-2D room used by CATBOX's physical projection scene.
 * Geometry is authored in metres relative to the shared stage bounds; no per-output resize occurs here.
 */
export const CatboxRoom = ({stage, view, width, height, night = false}: {stage: BoundsMeters; view: BoundsMeters; width: number; height: number; night?: boolean}) => {
  const stageWidth = stage.right - stage.left;
  const stageHeight = stage.top - stage.bottom;
  const floorLine = stage.top;
  const sofaLeft = PHYSICAL_SOFA_PLACEMENT.leftM - stage.left;
  const sofaFloorY = stage.top - PHYSICAL_SOFA_PLACEMENT.floorY;
  const windowWorldLeft = 0.55;
  const windowX = windowWorldLeft - stage.left;
  const windowTop = stage.top - 3.06;
  const windowHeight = 0.92;
  const viewBoxX = view.left - stage.left;
  const viewBoxY = stage.top - view.top;
  return <svg data-background="catbox-room" viewBox={`${viewBoxX} ${viewBoxY} ${view.right - view.left} ${view.top - view.bottom}`} width={width} height={height} preserveAspectRatio="xMidYMid meet" style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
    <defs>
      <linearGradient id="catbox-room-wall" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor={night ? '#69647e' : '#f0d7c6'}/>
        <stop offset="1" stopColor={night ? '#4b4f70' : '#f8e7d6'}/>
      </linearGradient>
    </defs>
    <rect width={stageWidth} height={stageHeight} fill="url(#catbox-room-wall)"/>
    {Array.from({length: 18}, (_, i) => <path key={i} d={`M${i * stageWidth / 16} 0 V${floorLine}`} stroke={night ? '#79758d' : '#e8cbbd'} strokeWidth={0.012} opacity={0.72}/>)}
    <rect x={windowX} y={windowTop} width={1.28} height={windowHeight} rx={0.055} fill={night ? '#454b70' : '#fff1d9'}/>
    <rect x={windowX + 0.06} y={windowTop + 0.06} width={1.16} height={windowHeight - 0.12} rx={0.03} fill={night ? '#343d64' : '#b7d9df'}/>
    <path d={`M${windowX + 0.64} ${windowTop + 0.06} V${windowTop + windowHeight - 0.06} M${windowX + 0.06} ${windowTop + 0.46} H${windowX + 1.22}`} stroke={night ? '#fff1d9' : '#fffaf0'} strokeWidth={0.045}/>
    <circle cx={windowX + 0.93} cy={windowTop + 0.18} r={0.075} fill={night ? '#ffe0a8' : '#ffce89'}/>
    <rect x={0} y={floorLine} width={stageWidth} height={stageHeight - floorLine} fill={night ? '#8d8091' : '#dfbca0'}/>
    <path d={`M0 ${floorLine} H${stageWidth}`} stroke={night ? '#c5a6a2' : '#b98d77'} strokeWidth={0.025}/>
    <ellipse cx={sofaLeft + PHYSICAL_SOFA_SPEC.seatAnchor.x} cy={floorLine - 0.012} rx={0.98} ry={0.065} fill={night ? '#554d63' : '#ad8d7b'} opacity={0.28}/>
    <PhysicalSofa left={sofaLeft} floorY={sofaFloorY} night={night}/>
  </svg>;
};
