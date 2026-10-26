/** Shared cushion contact surface in background coordinates. */
export const sofaSeat = (width: number, height: number) => ({
  x: width * 0.065,
  y: height * 0.65,
  width: width * 0.43,
});

export const Sofa = ({
  width: w,
  height: h,
  night,
}: {
  width: number;
  height: number;
  night: boolean;
}) => {
  const seat = sofaSeat(w, h);
  const back = night ? '#a99bad' : '#c7b3ce';
  const cushion = night ? '#95879f' : '#b5a0c1';
  const piping = night ? '#776d83' : '#9887a4';
  return (
    <g data-prop="sofa" stroke="#4A3B3B" strokeWidth={5} strokeLinejoin="round">
      <rect x={w * 0.075} y={h * 0.565} width={w * 0.415} height={h * 0.185} rx={42} fill={back} />
      <path
        d={`M${w * 0.1} ${h * 0.72} Q${w * 0.28} ${h * 0.68} ${w * 0.48} ${h * 0.72} V${h * 0.77} H${w * 0.1}Z`}
        fill={piping}
      />
      <rect x={seat.x} y={seat.y} width={seat.width} height={h * 0.13} rx={24} fill={cushion} />
      <path d={`M${w * 0.28} ${h * 0.65} V${h * 0.72}`} stroke={piping} strokeWidth={4} />
      <path
        d={`M${w * 0.085} ${h * 0.69} Q${w * 0.08} ${h * 0.77} ${w * 0.11} ${h * 0.79}`}
        fill="none"
        stroke={piping}
        strokeWidth={5}
      />
      <path
        d={`M${w * 0.49} ${h * 0.69} Q${w * 0.5} ${h * 0.77} ${w * 0.47} ${h * 0.79}`}
        fill="none"
        stroke={piping}
        strokeWidth={5}
      />
      <path
        d={`M${w * 0.2} ${h * 0.77} V${h * 0.8} M${w * 0.42} ${h * 0.77} V${h * 0.8}`}
        stroke="#b28d77"
        strokeWidth={13}
      />
      <path d={`M${w * 0.1} ${h * 0.805} H${w * 0.48}`} stroke="#765f67" strokeWidth={6} />
    </g>
  );
};
