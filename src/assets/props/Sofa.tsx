/** Shared cushion contact surface in background coordinates. */
export const sofaSeat = (width: number, height: number) => ({
  x: width * .065, y: height * .65, width: width * .43,
});

export const Sofa = ({width: w, height: h, night}: {width: number; height: number; night: boolean}) => {
  const seat = sofaSeat(w, h);
  return <g data-prop="sofa">
    <rect x={w * .08} y={h * .57} width={w * .4} height={h * .15} rx={35} fill={night ? '#9c8da7' : '#c7b3ce'}/>
    <rect x={seat.x} y={seat.y} width={seat.width} height={h * .13} rx={24} fill={night ? '#9c8da7' : '#b5a0c1'}/>
    <rect x={w * .1} y={h * .77} width={14} height={h * .04} fill="#b28d77"/>
    <rect x={w * .45} y={h * .77} width={14} height={h * .04} fill="#b28d77"/>
  </g>;
};
