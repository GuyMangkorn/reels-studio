import type {ReactNode} from 'react';
import {CatboxOld, CatboxCube, CatboxStimulus, type StimulusVariant} from '../Props';
export const ink = '#4a3b3b';
export const colors = {cream: '#fff7e9', blue: '#b7d9df', mint: '#b8dfcf', amber: '#efd38c', rose: '#e7afb0'};
export const Text = ({x, y, children, size = 26, color = ink, anchor = 'middle'}: {x: number; y: number; children: ReactNode; size?: number; color?: string; anchor?: 'middle' | 'start' | 'end'}) => <text x={x} y={y} textAnchor={anchor} fill={color} fontSize={size} fontWeight={700} fontFamily="Noto Sans Thai">{children}</text>;
export const LineText = ({x, y, text, size = 25, color = ink}: {x: number; y: number; text: string; size?: number; color?: string}) => <text x={x} y={y} textAnchor="middle" fill={color} fontSize={size} fontWeight={700} fontFamily="Noto Sans Thai">{text.split('\n').map((line, i) => <tspan key={i} x={x} dy={i ? size * 1.45 : 0}>{line}</tspan>)}</text>;
export const Paper = ({x, y, w, h, children, fill = colors.cream, dashed = false}: {x: number; y: number; w: number; h: number; children?: ReactNode; fill?: string; dashed?: boolean}) => <g><rect x={x} y={y + 8} width={w} height={h} rx={18} fill={ink} opacity={.08}/><rect x={x} y={y} width={w} height={h} rx={18} fill={fill} stroke={ink} strokeWidth={3} strokeDasharray={dashed ? '10 8' : undefined}/>{children}</g>;
export const Arrow = ({x1, y1, x2, y2, dotted = false, color = ink}: {x1: number; y1: number; x2: number; y2: number; dotted?: boolean; color?: string}) => {
 const angle = Math.atan2(y2 - y1, x2 - x1); const a = 13;
 return <g stroke={color} strokeWidth={4} fill="none"><path d={`M${x1} ${y1} L${x2} ${y2}`} strokeDasharray={dotted ? '9 10' : undefined}/><path d={`M${x2-a*Math.cos(angle-.5)} ${y2-a*Math.sin(angle-.5)} L${x2} ${y2} L${x2-a*Math.cos(angle+.5)} ${y2-a*Math.sin(angle+.5)}`}/></g>;
};
/** A schematic symbol, deliberately unlike the named Mochi rig. */
export const CatGlyph = ({x, y, s = 1, fill = '#a8b8cf'}: {x: number; y: number; s?: number; fill?: string}) => <g transform={`translate(${x} ${y}) scale(${s})`} stroke={ink} strokeWidth={3} strokeLinejoin="round"><ellipse cy={36} rx={38} ry={45} fill={fill}/><path d="M-34-2 L-33-39 L-9-22 Q0-28 11-22 L34-39 L34-1 Q35 28 0 28 Q-35 28-34-2Z" fill={fill}/><circle cx={-12} cy={0} r={3} fill={ink}/><circle cx={12} cy={0} r={3} fill={ink}/><path d="M-3 10 L3 10 L0 14Z" fill={ink}/></g>;
export const BoxDrawing = ({x, y, scale = 1, cube = false, outline = false}: {x: number; y: number; scale?: number; cube?: boolean; outline?: boolean}) => <g transform={`translate(${x} ${y}) scale(${scale})`}>{outline ? <rect x={20} y={40} width={200} height={145} fill="none" stroke={ink} strokeWidth={5}/> : cube ? <CatboxCube/> : <CatboxOld/>}</g>;
export const Stimulus = ({x, y, variant, label, rotation = 0, scale = 1}: {x: number; y: number; variant: StimulusVariant; label: string; rotation?: number; scale?: number}) => <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${rotation} 120 120)`}><CatboxStimulus variant={variant} label={label}/></g>;
export const Token = ({x, y, label, fill = colors.blue, radius = 35}: {x: number; y: number; label?: string; fill?: string; radius?: number}) => <g><circle cx={x} cy={y} r={radius} fill={fill} stroke={ink} strokeWidth={3}/>{label && <Text x={x} y={y+8} size={20}>{label}</Text>}</g>;
export const clamp = (n: number) => Math.max(0, Math.min(1, n));
export const ease = (n: number) => {const t = clamp(n); return t*t*(3-2*t);};
