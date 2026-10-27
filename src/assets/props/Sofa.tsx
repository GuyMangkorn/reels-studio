/** Shared cushion contact surface in background coordinates. */
export const sofaSeat = (width: number, height: number) => ({
  x: width * .065, y: height * .65, width: width * .43,
});

/** CATBOX-METER-R1 stylized sofa dimensions and seat contact; values are design estimates. */
export const PHYSICAL_SOFA_SPEC = {
  widthM: 1.60,
  heightM: 0.90,
  seatHeightM: 0.45,
  seatDepthM: 0.55,
  seatAnchor: {x: 0.80, y: 0.45},
} as const;

/** CATBOX-METER-R1 room placement: the sofa is left of BOX-OLD's floor origin. */
export const PHYSICAL_SOFA_PLACEMENT = {leftM: -2.0, floorY: 0} as const;

export const physicalSofaSeatAnchorWorld = () => ({
  x: PHYSICAL_SOFA_PLACEMENT.leftM + PHYSICAL_SOFA_SPEC.seatAnchor.x,
  y: PHYSICAL_SOFA_PLACEMENT.floorY + PHYSICAL_SOFA_SPEC.seatAnchor.y,
});

/** Shared physical 2D sofa, positioned by its left edge and floor anchor in metre-stage units. */
export const PhysicalSofa = ({left, floorY, night = false}: {left: number; floorY: number; night?: boolean}) => {
  const top = floorY - PHYSICAL_SOFA_SPEC.heightM;
  const seatTop = PHYSICAL_SOFA_SPEC.heightM - PHYSICAL_SOFA_SPEC.seatHeightM;
  return <g data-prop="sofa" data-anchor="seat" transform={`translate(${left} ${top})`}>
    <rect x={0.08} y={0.04} width={1.44} height={0.48} rx={0.08} fill={night ? '#8b7f9a' : '#c7b3ce'}/>
    <rect x={0.02} y={0.28} width={0.12} height={0.42} rx={0.06} fill={night ? '#786d88' : '#b7a0c0'}/>
    <rect x={1.46} y={0.28} width={0.12} height={0.42} rx={0.06} fill={night ? '#786d88' : '#b7a0c0'}/>
    <rect x={0.05} y={seatTop} width={1.50} height={0.20} rx={0.07} fill={night ? '#9c8da7' : '#b5a0c1'}/>
    <rect x={0.18} y={0.82} width={0.09} height={0.08} fill="#b28d77"/>
    <rect x={1.33} y={0.82} width={0.09} height={0.08} fill="#b28d77"/>
  </g>;
};

export const Sofa = ({width: w, height: h, night}: {width: number; height: number; night: boolean}) => {
  const seat = sofaSeat(w, h);
  return <g data-prop="sofa">
    <rect x={w * .08} y={h * .57} width={w * .4} height={h * .15} rx={35} fill={night ? '#9c8da7' : '#c7b3ce'}/>
    <rect x={seat.x} y={seat.y} width={seat.width} height={h * .13} rx={24} fill={night ? '#9c8da7' : '#b5a0c1'}/>
    <rect x={w * .1} y={h * .77} width={14} height={h * .04} fill="#b28d77"/>
    <rect x={w * .45} y={h * .77} width={14} height={h * .04} fill="#b28d77"/>
  </g>;
};
