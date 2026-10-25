import type {BackgroundBuilder} from '../Background';
type HouseColors = {dark: boolean; lit: boolean};
const HouseFloors = ({dark, lit}: HouseColors) => (
  <>
    <rect x={-370} y={-650} width={740} height={650} fill={dark ? '#A99CB2' : '#F0D7C6'} />
    <path d="M-410-650 L-230-830 L-55-650 L150-830 L410-650Z" fill="#7B718D" />
    {[-570, -370, -170].map((y, floor) => (
      <g key={y}>
        <path d={`M-370 ${y + 128} H370`} stroke="#FFF3D9" strokeWidth={12} />
        {[-260, -80, 100, 280].map((x) => (
          <g key={x}>
            <path
              d={`M${x - 43} ${y + 90} V${y + 5} Q${x} ${y - 40} ${x + 43} ${y + 5} V${y + 90}Z`}
              fill={lit ? '#FFD166' : dark ? '#555E83' : '#BCDDE3'}
            />
            <path
              d={`M${x} ${y - 12} V${y + 90} M${x - 43} ${y + 39} H${x + 43}`}
              stroke="#FFF3D9"
            />
            {floor === 2 && x === -80 && (
              <rect x={x - 45} y={y - 12} width={90} height={182} rx={10} fill="#917F89" />
            )}
          </g>
        ))}
      </g>
    ))}
  </>
);
const Tower = ({dark, lit}: HouseColors) => (
  <>
    <path d="M200-740 V-900 L310-1040 L420-900 V0 H200Z" fill={dark ? '#B3A4B9' : '#E6C9CF'} />
    <path d="M185-900 L310-1060 L435-900Z" fill="#7B718D" />
    {[-815, -585, -355].map((y) => (
      <g key={y}>
        <rect x={260} y={y} width={100} height={125} rx={40} fill={lit ? '#FFD166' : '#555E83'} />
        <path d={`M310 ${y} V${y + 125} M260 ${y + 62} H360`} stroke="#FFF3D9" />
      </g>
    ))}
  </>
);
const Porch = () => (
  <>
    <path d="M-390-105 H185 L225-45 H-425Z" fill="#9A869D" />
    {[-365, -130, 150].map((x) => (
      <path key={x} d={`M${x}-44 V53`} stroke="#FFF3D9" strokeWidth={17} />
    ))}
    <path d="M-425 55 H225 M-440 75 H240" stroke="#B4A2A2" strokeWidth={20} />
  </>
);
/** Local height of one story in the exterior rig. */
export const EXTERIOR_STORY = 200;
const PERSON_LOCAL = 397;
const PORCH_LOCAL = 62;

export const exteriorPath = {
  farY: 0.78,
  nearY: 1,
  leftFar: 0.46,
  rightFar: 0.56,
  leftNear: 0.16,
  rightNear: 0.86,
};

/**
 * Feet land on the path interior, not on the lawn beside its edge.
 * Wider parts of the trapezoid are nearer the camera, so an x outside the
 * far mouth walks downhill until the walkway is wide enough to hold them.
 */
export function exteriorPathGroundY(width: number, height: number, x: number) {
  const path = exteriorPath;
  const nx = x / width;
  const margin = 0.045;
  const tLeft = (path.leftFar + margin - nx) / (path.leftFar - path.leftNear);
  const tRight = (nx - (path.rightFar - margin)) / (path.rightNear - path.rightFar);
  const t = Math.max(0.14, Math.min(0.72, Math.max(tLeft, tRight)));
  return height * (path.farY + t * (path.nearY - path.farY));
}

/**
 * Long frames used to shrink the house to a short strip, so a person matched two floors.
 * Keep one uniform house scale and, on 16:9, a person clearly shorter than a story.
 */
export function exteriorFit(width: number, height: number) {
  const portrait = height > width;
  const houseScale = portrait
    ? Math.min(width / 1000, height / 1550)
    : Math.min(width / 1280, height / 1020);
  const storyPx = EXTERIOR_STORY * houseScale;
  const layoutBase = portrait ? 1.75 : 1.42;
  const actorBoost = portrait ? 1 : (storyPx * 0.62) / (PERSON_LOCAL * layoutBase);
  return {
    houseScale,
    actorBoost,
    storyPx,
    houseOriginY: height * exteriorPath.farY - PORCH_LOCAL * houseScale,
    groundY: (x: number) => exteriorPathGroundY(width, height, x),
  };
}

/** Three occupied floors, tower, porch and steep Victorian roof. */
export const oldHouseExterior: BackgroundBuilder = ({w, h, time, options}) => {
  const dark = time !== 'day';
  const lit = options.windowLights ?? dark;
  const fit = exteriorFit(w, h);
  const path = exteriorPath;
  return {
    far: (
      <>
        <rect
          width={w}
          height={h}
          fill={time === 'day' ? '#FFF1C9' : time === 'dusk' ? '#B5A1C5' : '#424668'}
        />
        <circle cx={w * 0.83} cy={h * 0.18} r={Math.min(w, h) * 0.065} fill="#FFD166" />
        <path
          d={`M0 ${h * 0.8} Q${w * 0.4} ${h * 0.65} ${w} ${h * 0.8} V${h} H0Z`}
          fill={dark ? '#66667F' : '#B8F2C9'}
        />
      </>
    ),
    mid: (
      <g
        data-uniform-scale={fit.houseScale}
        transform={`translate(${w / 2} ${fit.houseOriginY}) scale(${fit.houseScale})`}
        stroke="#4A3B3B"
        strokeWidth={5}
        strokeLinejoin="round"
      >
        <HouseFloors dark={dark} lit={lit} />
        <Tower dark={dark} lit={lit} />
        <Porch />
      </g>
    ),
    near: (
      <>
        <path
          d={`M${w * path.leftFar} ${h * path.farY} L${w * path.leftNear} ${h * path.nearY} H${w * path.rightNear} L${w * path.rightFar} ${h * path.farY}Z`}
          fill={dark ? '#9B8B9F' : '#DEC8AD'}
        />
        <path
          d={`M0 ${h * 0.88} H${w * 0.22} M${w * 0.8} ${h * 0.88} H${w}`}
          stroke="#4A3B3B"
          strokeWidth={8}
        />
      </>
    ),
  };
};
