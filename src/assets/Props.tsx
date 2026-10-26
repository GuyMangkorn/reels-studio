import type {ReactNode} from 'react';

export type PropName =
  | 'tree' | 'house' | 'car' | 'boat' | 'sign'
  | 'catbox-old' | 'catbox-outline' | 'catbox-stimulus' | 'catbox-folder' | 'catbox-card' | 'catbox-toy' | 'catbox-cube';
export type StimulusVariant = 'square' | 'kanizsa' | 'outward-control';
export type PropTone = 'observed' | 'hypothesis' | 'warning' | 'fiction' | 'neutral';
export type PropPart = 'complete' | 'rear' | 'front';
export type Point2D = {x: number; y: number};
export type SolidBounds2D = {left: number; top: number; right: number; bottom: number};
export type PropSpec = {
  bounds: {width: number; height: number};
  /** SVG-space transform origin and stage-space placement anchor. */
  pivot: Point2D;
  floorAnchor?: Point2D;
  seatAnchor?: Point2D;
  gripAnchor?: Point2D;
  /** Source-space top of the front occlusion wall after its outline stroke. */
  frontRimAnchor?: Point2D;
  /** CATBOX-METER-R1 estimate for this asset's visible solid bounds, excluding SVG padding. */
  physicalEstimate?: {widthM: number; heightM: number; solidBounds: SolidBounds2D};
};
export type PropProps = {
  color?: string;
  night?: boolean;
  label?: string;
  detail?: string;
  variant?: StimulusVariant;
  tone?: PropTone;
  /** Shared multi-plane construction for props such as BOX-OLD. */
  part?: PropPart;
};

const commonSpec = {bounds: {width: 240, height: 240}, pivot: {x: 120, y: 228}} as const;
/** Logical contact metadata for complete 2D images. Coordinates are in each 240×240 SVG. */
export const propSpecs: Record<PropName, PropSpec> = {
  tree: {...commonSpec, floorAnchor: {x: 120, y: 228}},
  house: {...commonSpec, floorAnchor: {x: 120, y: 226}},
  car: {...commonSpec, floorAnchor: {x: 120, y: 220}},
  boat: {...commonSpec, floorAnchor: {x: 120, y: 218}},
  sign: {...commonSpec, floorAnchor: {x: 120, y: 228}},
  'catbox-old': {...commonSpec, floorAnchor: {x: 120, y: 226}, seatAnchor: {x: 120, y: 172}, gripAnchor: {x: 53, y: 91},
    frontRimAnchor: {x: 120, y: 149.5},
    // Exterior solid bounds traced from the authored SVG paths; metre dimensions remain design estimates.
    physicalEstimate: {widthM: 0.38, heightM: 0.32, solidBounds: {left: 27, top: 41, right: 213, bottom: 229}}},
  'catbox-outline': {...commonSpec, floorAnchor: {x: 120, y: 205}},
  'catbox-stimulus': {...commonSpec, floorAnchor: {x: 120, y: 218}},
  'catbox-folder': {...commonSpec, floorAnchor: {x: 120, y: 220}, gripAnchor: {x: 42, y: 62}},
  'catbox-card': {...commonSpec, floorAnchor: {x: 120, y: 220}, gripAnchor: {x: 26, y: 42}},
  'catbox-toy': {...commonSpec, floorAnchor: {x: 120, y: 201}, gripAnchor: {x: 104, y: 118}},
  'catbox-cube': {...commonSpec, floorAnchor: {x: 120, y: 220}},
};

/** Convert an image-space anchor into metres relative to the asset's floor contact anchor. */
export function propAnchorOffsetMeters(type: PropName, anchor: 'floor' | 'seat' | 'grip' | 'frontRim') {
  const spec = propSpecs[type];
  const physical = spec.physicalEstimate;
  const floor = spec.floorAnchor;
  const point = anchor === 'floor' ? floor : anchor === 'seat' ? spec.seatAnchor : anchor === 'grip' ? spec.gripAnchor : spec.frontRimAnchor;
  if (!physical || !floor || !point) throw new Error(`${type} has no physical ${anchor} anchor`);
  const solidWidth = physical.solidBounds.right - physical.solidBounds.left;
  const solidHeight = physical.solidBounds.bottom - physical.solidBounds.top;
  return {
    x: (point.x - floor.x) * physical.widthM / solidWidth,
    y: (floor.y - point.y) * physical.heightM / solidHeight,
  };
}

export const Tree = ({color = '#8bcbb2'}: PropProps) => <><path d="M109 224 L114 77 H128 L135 224Z" fill="#b38777"/><circle cx={119} cy={80} r={64} fill={color}/><circle cx={73} cy={118} r={48} fill={color}/><circle cx={162} cy={121} r={52} fill={color}/><path d="M122 163 V101 M122 144 L91 126 M123 122 L147 103" stroke="#629d8a" opacity={0.5} strokeWidth={7} strokeLinecap="round"/></>;
export const House = ({color = '#f6bdad', night}: PropProps) => <><rect x={31} y={103} width={177} height={123} rx={7} fill={color}/><path d="M16 108 L120 23 L224 108Z" fill="#a190bc"/><rect x={98} y={151} width={42} height={75} rx={7} fill="#b18880"/><rect x={52} y={131} width={29} height={37} rx={5} fill={night ? '#ffe5a0' : '#d1edf0'}/><rect x={157} y={131} width={29} height={37} rx={5} fill={night ? '#ffe5a0' : '#d1edf0'}/><circle cx={129} cy={189} r={3} fill="#fce5ab"/></>;
export const Car = ({color = '#f4a4a2'}: PropProps) => <><path d="M23 155 L57 102 Q63 91 82 91 H150 Q165 91 182 134 L213 144 Q225 149 225 178 V201 H16 V173Z" fill={color}/><path d="M68 106 H111 V143 H47Z M122 106 H150 L174 143 H122Z" fill="#cfe8ec"/><rect x={181} y={160} width={28} height={12} rx={5} fill="#ffeec5"/>{[61, 180].map(x => <g key={x}><circle cx={x} cy={200} r={25} fill="#615c78"/><circle cx={x} cy={200} r={12} fill="#eae0d9"/></g>)}</>;
export const Boat = ({color = '#a58dbf'}: PropProps) => <><path d="M19 170 H222 Q209 218 178 218 H64 Q32 210 19 170" fill={color}/><path d="M119 167 V26" stroke="#b78b72" strokeWidth={8}/><path d="M109 36 L35 154 H109Z" fill="#fff1d6"/><path d="M129 57 L197 154 H129Z" fill="#f6ae9b"/><path d="M49 188 H193" stroke="#d2bde1" strokeWidth={7} strokeLinecap="round"/></>;
export const Sign = ({color = '#ffd8a0'}: PropProps) => <><rect x={111} y={93} width={17} height={137} rx={5} fill="#b38b78"/><path d="M24 54 H177 L218 92 L177 130 H24Z" fill={color}/><path d="M67 92 H164 M146 77 L164 92 L146 107" stroke="#a38073" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none"/></>;

const SvgLines = ({text, x, y, size = 14, fill = '#4a3b3b', weight = 600, anchor = 'start'}: {text?: string; x: number; y: number; size?: number; fill?: string; weight?: number; anchor?: 'start' | 'middle' | 'end'}) => <text x={x} y={y} fill={fill} fontFamily="Noto Sans Thai, sans-serif" fontSize={size} fontWeight={weight} textAnchor={anchor}>{(text ?? '').split('\n').map((line, i) => <tspan key={`${i}-${line}`} x={x} dy={i === 0 ? 0 : size + 4}>{line}</tspan>)}</text>;

export const CatboxOld = ({part = 'complete'}: PropProps) => <g stroke="#4a3b3b" strokeWidth={5} strokeLinejoin="round">
  {part !== 'front' && <>
    <path d="M27 75 L120 41 L213 75 V199 L120 229 L27 199Z" fill="#bd8f6c"/>
    <path d="M27 75 L120 41 L213 75 L120 109Z" fill="#dfb891"/>
    <path d="M72 91 L120 108 L168 91 V154 L120 174 L72 154Z" fill="#514b5f"/>
  </>}
  {part !== 'rear' && <>
    <path d="M27 152 L120 181 L213 152 V199 L120 229 L27 199Z" fill="#a7795c"/>
    <path d="M27 152 L120 181 L213 152" fill="none" stroke="#805d4e" strokeWidth={4}/>
    <path d="M45 190 L120 214 L195 190" fill="none" stroke="#d3a27b" strokeWidth={3} opacity={0.8}/>
  </>}
</g>;

export const CatboxOutline = () => <g stroke="#4a3b3b" strokeWidth={8} strokeLinejoin="round" fill="none">
  <path d="M45 65 H195 V194 H45Z" strokeDasharray="none"/>
  <path d="M62 209 H178" stroke="#bc8b69" strokeWidth={5} strokeLinecap="round"/>
</g>;

const Pacman = ({x, y, angle}: {x: number; y: number; angle: number}) => <g transform={`translate(${x} ${y}) rotate(${angle})`}>
  <circle r={22} fill="#4a3b3b"/>
  <path d="M0 0 L24 -12 L24 12Z" fill="#fff9ee"/>
</g>;
export const CatboxStimulus = ({variant = 'square', label = 'รูปกระดาษ'}: PropProps) => {
  const turns = variant === 'outward-control' ? [225, 315, 45, 135] : [45, 135, 225, 315];
  return <>
    <rect x={14} y={19} width={212} height={202} rx={19} fill="#fff9ee" stroke="#766b79" strokeWidth={4}/>
    <SvgLines text={label} x={120} y={47} size={15} fill="#59627d" weight={800} anchor="middle"/>
    {variant === 'square' ? <rect x={67} y={76} width={106} height={106} fill="none" stroke="#4a3b3b" strokeWidth={8}/> : <>
      <Pacman x={83} y={94} angle={turns[0]}/><Pacman x={157} y={94} angle={turns[1]}/><Pacman x={157} y={166} angle={turns[2]}/><Pacman x={83} y={166} angle={turns[3]}/>
    </>}
  </>;
};

export const CatboxFolder = ({label = 'แฟ้มหลักฐาน'}: PropProps) => <g stroke="#5a4f60" strokeWidth={4} strokeLinejoin="round">
  <path d="M24 61 H94 L111 80 H216 V211 H24Z" fill="#d7c4ad"/>
  <path d="M24 81 H216 V211 H24Z" fill="#eee0ca"/>
  <path d="M36 97 H204 V192 H36Z" fill="#fff8ea" stroke="#b79d86" strokeWidth={2}/>
  <SvgLines text={label} x={120} y={139} size={22} weight={800} anchor="middle"/>
  <path d="M55 159 H185 M55 176 H162" stroke="#c4b6a8" strokeWidth={3} strokeLinecap="round"/>
</g>;

const toneColors: Record<PropTone, {fill: string; tab: string; edge: string}> = {
  observed: {fill: '#f3f5e8', tab: '#bad9d2', edge: '#4e7774'},
  hypothesis: {fill: '#fff4ce', tab: '#f2d58d', edge: '#9d7751'},
  warning: {fill: '#fff1dd', tab: '#efb27c', edge: '#ad6a4c'},
  fiction: {fill: '#edf2fa', tab: '#c3d2eb', edge: '#64718f'},
  neutral: {fill: '#fff9ec', tab: '#e8d7c4', edge: '#766b79'},
};
export const CatboxCard = ({label = 'บันทึก', detail = '', tone = 'neutral'}: PropProps) => {
  const color = toneColors[tone];
  return <>
    <rect x={13} y={19} width={214} height={202} rx={17} fill={color.fill} stroke={color.edge} strokeWidth={4}/>
    <path d="M30 20 H210 Q225 20 225 35 V59 H15 V35 Q15 20 30 20Z" fill={color.tab}/>
    <SvgLines text={label} x={120} y={47} size={16} weight={800} anchor="middle"/>
    <path d="M30 72 H210" stroke="#cabdaf" strokeWidth={2}/>
    <SvgLines text={detail} x={30} y={99} size={13} fill="#403a42" weight={600}/>
    {tone === 'warning' && <path d="M31 194 H209" stroke="#d89559" strokeWidth={4} strokeLinecap="round"/>}
    {tone === 'hypothesis' && <text x={204} y={208} fill="#a36b49" fontSize={17} textAnchor="end" fontFamily="Noto Sans Thai, sans-serif" fontWeight={800}>?</text>}
  </>;
};

export const CatboxToy = () => <g stroke="#4a3b3b" strokeWidth={4} strokeLinejoin="round">
  <path d="M57 136 C36 115 49 84 80 87 C92 60 125 62 139 89 C168 82 190 106 180 133 C170 161 83 170 57 136Z" fill="#e8a99f"/>
  <path d="M80 92 Q62 62 52 76 Q49 98 75 105Z M143 89 Q163 57 177 73 Q181 95 151 103Z" fill="#e8a99f"/>
  <circle cx={98} cy={119} r={4} fill="#443b49" stroke="none"/><circle cx={147} cy={119} r={4} fill="#443b49" stroke="none"/>
  <path d="M178 125 Q222 121 218 89 Q214 71 203 79" fill="none" stroke="#9a7c8a" strokeWidth={5} strokeLinecap="round"/>
  <path d="M80 151 Q118 171 163 148" fill="none" stroke="#c9797e" strokeWidth={3}/>
</g>;

export const CatboxCube = () => <g stroke="#4a3b3b" strokeWidth={4} strokeLinejoin="round">
  <path d="M44 102 L119 64 L197 102 L120 139Z" fill="#d9b07b"/>
  <path d="M44 102 L120 139 V214 L44 177Z" fill="#b88358"/>
  <path d="M120 139 L197 102 V177 L120 214Z" fill="#9e704e"/>
  <path d="M66 113 L119 140 V194" fill="none" stroke="#d8a66e" strokeWidth={3}/>
  <path d="M84 84 L145 114 L174 100 L113 72Z" fill="#93bbaa"/>
  <path d="M84 84 L84 112 L125 132 L125 105Z" fill="#7fa996"/>
  <path d="M144 112 L144 132 L169 120 L169 102" fill="#6e9a86"/>
  <path d="M93 91 L146 116" stroke="#c9dfd2" strokeWidth={3}/>
</g>;

export const propNames: PropName[] = ['tree', 'house', 'car', 'boat', 'sign', 'catbox-old', 'catbox-outline', 'catbox-stimulus', 'catbox-folder', 'catbox-card', 'catbox-toy', 'catbox-cube'];
export const propRegistry: Record<PropName, (props: PropProps) => ReactNode> = {
  tree: Tree, house: House, car: Car, boat: Boat, sign: Sign,
  'catbox-old': CatboxOld, 'catbox-outline': CatboxOutline, 'catbox-stimulus': CatboxStimulus,
  'catbox-folder': CatboxFolder, 'catbox-card': CatboxCard, 'catbox-toy': CatboxToy, 'catbox-cube': CatboxCube,
};
export const SceneProp = ({type, x, y, size, width, height, part, ...props}: PropProps & {type: PropName; x: number; y: number; size?: number; width?: number; height?: number}) => {
  const Asset = propRegistry[type];
  const spec = propSpecs[type];
  const logicalWidth = width ?? size ?? spec.bounds.width;
  const logicalHeight = height ?? (size === undefined ? spec.bounds.height : spec.bounds.height * size / spec.bounds.width);
  const scaleX = logicalWidth / spec.bounds.width;
  const scaleY = logicalHeight / spec.bounds.height;
  return <svg viewBox="0 0 240 240" preserveAspectRatio="none" width={logicalWidth} height={logicalHeight} style={{position: 'absolute', left: x - spec.pivot.x * scaleX, top: y - spec.pivot.y * scaleY, overflow: 'visible', filter: 'drop-shadow(0 6px 5px rgba(37,48,71,.12))'}}><Asset {...props} part={part}/></svg>;
};
