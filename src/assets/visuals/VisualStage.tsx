import type {ReactNode} from 'react';
import {Arrow, CatGlyph, LineText, Paper, Stimulus, Text, colors, ink} from './primitives';
import {visualProgressAt, type SceneVisual} from './types';

const statusText = {fiction: 'เรื่องสมมติ', diagram: 'ภาพอธิบาย', research: 'ภาพอธิบายงานวิจัย', hypothesis: 'สมมติฐาน'} as const;

const reveal = (progress: number, order: number) => Math.max(0, Math.min(1, (progress - order * 0.16) / 0.12));

const wrapLabel = (text: string, maxGraphemes = 17) => {
  const segment = (value: string) => Array.from(new Intl.Segmenter('th', {granularity: 'grapheme'}).segment(value), part => part.segment);
  const words = text.trim().split(/\s+/).filter(Boolean).flatMap(word => {
    const graphemes = segment(word);
    if (graphemes.length <= maxGraphemes) return [word];
    const chunks: string[] = [];
    for (let i = 0; i < graphemes.length; i += maxGraphemes) chunks.push(graphemes.slice(i, i + maxGraphemes).join(''));
    return chunks;
  });
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (segment(next).length > maxGraphemes && line) { lines.push(line); line = word; }
    else line = next;
  }
  if (line) lines.push(line);
  return lines.join('\n');
};

const Pill = ({x, y, width, text, fill = colors.cream, size = 30}: {x: number; y: number; width: number; text: string; fill?: string; size?: number}) => (
  <g>
    <rect x={x} y={y} width={width} height={72} rx={20} fill={fill} stroke={ink} strokeWidth={3}/>
    <LineText x={x + width / 2} y={y + 42} text={text} size={size}/>
  </g>
);

const FigureCard = ({x, y, width, title, detail, accent = colors.blue}: {x: number; y: number; width: number; title: string; detail?: string; accent?: string}) => (
  <g>
    <Paper x={x} y={y} w={width} h={218} fill={colors.cream}>
      <rect x={x + 14} y={y + 14} width={width - 28} height={58} rx={14} fill={accent}/>
      <LineText x={x + width / 2} y={y + 54} text={title} size={30}/>
      {detail && <LineText x={x + width / 2} y={y + 121} text={detail} size={26}/>}
    </Paper>
  </g>
);

const StimulusCard = ({x, y, variant, label}: {x: number; y: number; variant: 'square' | 'kanizsa' | 'outward-control'; label: string}) => (
  <g>
    <Stimulus x={x} y={y} variant={variant} label="" scale={0.78}/>
    <LineText x={x + 94} y={y + 245} text={label} size={25}/>
  </g>
);

const DiagramBody = ({visual, width, height, progress}: {visual: SceneVisual; width: number; height: number; progress: number}) => {
  const cx = width / 2;
  const y = height * 0.34;
  const cardWidth = Math.min(width * 0.40, 410);
  const twoX = [width * 0.08, width * 0.52];
  const alpha = (order: number) => reveal(progress, order);
  let body: ReactNode = null;

  switch (visual.id) {
    case 'paper-stimuli':
      if (visual.phase === 0) {
        const stepProgress = Math.max(0, Math.min(1, (progress * visual.endSec - 0.25) / 0.8));
        const markerX = cx - 210 + stepProgress * 210;
        const markerY = y + 205;
        body = <g>
          <Paper x={cx - 250} y={y + 5} w={500} h={380} fill={colors.cream}>
            <rect x={cx - 170} y={y + 92} width={340} height={220} rx={18} fill="none" stroke={ink} strokeWidth={9}/>
            <path d={`M${cx - 210} ${markerY} L${markerX} ${markerY}`} fill="none" stroke="#9d7751" strokeWidth={5} strokeDasharray="10 10" opacity={stepProgress}/>
            <circle cx={markerX} cy={markerY} r={22} fill={colors.amber} stroke={ink} strokeWidth={5}/>
            <LineText x={cx} y={y + 356} text="กรอบกระดาษแบน" size={28}/>
          </Paper>
        </g>;
      } else if (visual.phase === 1) {
        body = <g>
          {[0, 1, 2].map((i) => <g key={i} opacity={alpha(i)} transform={`translate(0 ${12 * (1 - alpha(i))})`}>
            <StimulusCard x={width * (0.12 + i * 0.285)} y={y + 36} variant={(['square', 'kanizsa', 'outward-control'] as const)[i]} label={['กรอบสี่เหลี่ยม', 'ชิ้นแหว่งหันเข้า', 'ชิ้นแหว่งหันออก'][i]}/>
          </g>)}
        </g>;
      } else {
        body = <g>
          <g opacity={alpha(0)} transform={`translate(0 ${18 * (1 - alpha(0))})`}><FigureCard x={width * 0.1} y={y + 25} width={width * 0.8} title="ชิ้นแหว่งหันเข้า ↔ แบบเทียบหันออก" detail="พบความต่าง" accent={colors.blue}/></g>
          <g opacity={alpha(1)} transform={`translate(0 ${18 * (1 - alpha(1))})`}><FigureCard x={width * 0.1} y={y + 285} width={width * 0.8} title="กรอบสี่เหลี่ยม ↔ แบบเทียบหันออก" detail="ไม่พบความต่าง ≠ เท่ากัน" accent={colors.amber}/></g>
        </g>;
      }
      break;
    case 'selection-units':
      body = <g>
        <g opacity={alpha(0)} transform={`translate(${-20 * (1 - alpha(0))} 0)`}><FigureCard x={twoX[0]} y={y + 30} width={cardWidth} title="ทำครบทุกครั้ง" detail="30 ตัว" accent={colors.blue}/></g>
        <g opacity={alpha(1)} transform={`translate(${20 * (1 - alpha(1))} 0)`}><FigureCard x={twoX[1]} y={y + 30} width={cardWidth} title="เลือกอย่างน้อยหนึ่งแบบ" detail="9 ตัว" accent={colors.amber}/></g>
        <Paper x={width * 0.14} y={y + 330} w={width * 0.72} h={130} fill={colors.cream}>
          <LineText x={cx} y={y + 389} text="คนละจำนวน • คนละหน่วย" size={32}/>
        </Paper>
      </g>;
      break;
    case 'shelter-context':
      if (visual.phase === 0) {
        const targetReveal = alpha(0);
        const wallReveal = alpha(1);
        body = <g>
          <Paper x={width * 0.1} y={y + 5} w={width * 0.8} h={420} fill={colors.cream}>
            <g opacity={targetReveal}><CatGlyph x={width * 0.39} y={y + 196} s={0.52}/><CatGlyph x={width * 0.69} y={y + 196} s={0.52}/></g>
            <rect x={width * (0.31 + (1 - wallReveal) * 0.15)} y={y + 204} width={width * 0.15} height={126} fill="#b98c70" stroke={ink} strokeWidth={4}/>
            <rect x={width * 0.18} y={y + 95} width={width * 0.27} height={235} fill="none" stroke={ink} strokeWidth={4}/>
            <rect x={width * 0.55} y={y + 95} width={width * 0.27} height={235} fill="none" stroke={ink} strokeWidth={4}/>
            <LineText x={width * 0.32} y={y + 365} text="มีที่ซ่อน" size={28}/>
            <LineText x={width * 0.68} y={y + 365} text="ไม่มีที่ซ่อน" size={28}/>
          </Paper>
        </g>;
      } else {
        body = <g>
          <g opacity={alpha(0)}><FigureCard x={twoX[0]} y={y + 28} width={cardWidth} title="2014 · ศูนย์พักพิง" detail="19 ตัว · 14 วัน" accent={colors.blue}/></g>
          <g opacity={alpha(1)}><FigureCard x={twoX[1]} y={y + 28} width={cardWidth} title="กลุ่มมีที่ซ่อน" detail="10 ตัว" accent={colors.mint}/></g>
          <g opacity={alpha(2)}><FigureCard x={twoX[0]} y={y + 290} width={cardWidth} title="กลุ่มไม่มีที่ซ่อน" detail="9 ตัว" accent={colors.amber}/></g>
          <g opacity={alpha(3)}><FigureCard x={twoX[1]} y={y + 290} width={cardWidth} title="วันที่ 3–4" detail="CSS ต่ำกว่าอย่างมีนัยสำคัญ" accent={colors.mint}/></g>
        </g>;
      }
      break;
    case 'outcome-tracks':
      body = <g>
        <g opacity={alpha(0)}><FigureCard x={width * 0.1} y={y + 10} width={width * 0.8} title="อีกงาน · 2019" detail="แยกจากงานปี 2014" accent={colors.blue}/></g>
        <g opacity={alpha(1)}><FigureCard x={twoX[0]} y={y + 280} width={cardWidth} title="CSS" detail="ลดเร็วกว่า" accent={colors.mint}/></g>
        <g opacity={alpha(2)}><FigureCard x={twoX[1]} y={y + 280} width={cardWidth} title="ผลลัพธ์อื่นที่วัด" detail="ไม่พบความต่างอย่างมีนัยสำคัญ" accent={colors.amber}/></g>
      </g>;
      break;
    case 'toy-pursuit':
      body = <g>
        {['ย่อง', 'ไล่', 'พุ่ง'].map((word, i) => <g key={word} opacity={alpha(i)}>
          <FigureCard x={width * (0.08 + i * 0.29)} y={y + 66} width={width * 0.25} title={word} accent={i === 2 ? colors.rose : colors.blue}/>
        </g>)}
        <Arrow x1={width * 0.27} y1={y + 335} x2={width * 0.69} y2={y + 335} dotted color="#9d7751"/>
        <Pill x={width * 0.16} y={y + 374} width={width * 0.68} text="เข้าไปเพื่อซุ่ม? • ยังเป็นสมมติฐาน" fill="#fff4ce" size={28}/>
      </g>;
      break;
    case 'occlusion-compare':
      body = <g>
        <g opacity={alpha(0)} transform={`translate(${-16 * (1 - alpha(0))} 0)`}><Paper x={width * 0.08} y={y + 10} w={width * 0.4} h={430} fill={colors.cream}>
          <circle cx={width * 0.28} cy={y + 188} r={46} fill={colors.rose} stroke={ink} strokeWidth={4}/>
          <rect x={width * 0.2} y={y + 222} width={width * 0.16} height={105} fill="#b98c70" stroke={ink} strokeWidth={4}/>
          <LineText x={width * 0.28} y={y + 377} text="ผนังบังตัว" size={30}/>
        </Paper></g>
        <g opacity={alpha(1)} transform={`translate(${16 * (1 - alpha(1))} 0)`}><Paper x={width * 0.52} y={y + 10} w={width * 0.4} h={430} fill={colors.cream}>
          <circle cx={width * 0.72} cy={y + 188} r={46} fill={colors.rose} stroke={ink} strokeWidth={4}/>
          <rect x={width * 0.63} y={y + 216} width={width * 0.18} height={122} fill="none" stroke={ink} strokeWidth={8}/>
          <LineText x={width * 0.72} y={y + 377} text="กรอบแบน" size={30}/>
        </Paper></g>
      </g>;
      break;
    case 'physiology-definition':
      if (visual.phase === 0) {
        const numberProgress = alpha(0);
        body = <g opacity={numberProgress} transform={`translate(0 ${48 * (1 - numberProgress)})`}>
          <Paper x={width * 0.12} y={y + 46} w={width * 0.76} h={280} fill="#fff4ce">
            <LineText x={cx} y={y + 164} text="30–38°C" size={68}/>
            <LineText x={cx} y={y + 228} text="ช่วงที่ถูกทักท้วง" size={28}/>
          </Paper>
        </g>;
      } else if (visual.phase === 3) {
        const questionProgress = alpha(1);
        body = <g>
          <g opacity={1 - questionProgress} transform={`translate(0 ${-30 * questionProgress})`}>
            <Paper x={width * 0.15} y={y + 36} w={width * 0.7} h={245} fill="#fff4ce">
              <LineText x={cx} y={y + 132} text="30–38°C" size={62}/>
              <LineText x={cx} y={y + 196} text="ตรวจคำอ้าง" size={28}/>
            </Paper>
          </g>
          <g opacity={questionProgress}>
            <Pill x={width * 0.14} y={y + 300} width={width * 0.34} text="วัดอะไร?" fill={colors.blue} size={34}/>
            <Pill x={width * 0.52} y={y + 300} width={width * 0.34} text="ตอบคำถามไหน?" fill={colors.amber} size={30}/>
          </g>
        </g>;
      } else {
        body = <g>
          <g opacity={alpha(0)}><FigureCard x={width * 0.1} y={y + 5} width={width * 0.8} title="TNZ · นิยามทางสรีรวิทยา" detail="ไม่ใช่ช่วงที่แมวเลือกอยู่เสมอ" accent={colors.blue}/></g>
          <g opacity={alpha(1)}><FigureCard x={twoX[0]} y={y + 278} width={cardWidth} title="ร่างกายคุมอุณหภูมิ" detail="ไม่เร่งสร้างความร้อนเพิ่ม" accent={colors.mint}/></g>
          <g opacity={alpha(2)}><FigureCard x={twoX[1]} y={y + 278} width={cardWidth} title="ระบายความร้อน" detail="ไม่เร่งด้วยการระเหย" accent={colors.amber}/></g>
        </g>;
      }
      break;
    case 'wall-warmth':
      body = <g>
        <g opacity={alpha(0)}><Paper x={width * 0.1} y={y + 22} w={width * 0.8} h={420} fill={colors.cream}>
          <rect x={width * 0.24} y={y + 112} width={width * 0.2} height={212} fill="#b98c70" stroke={ink} strokeWidth={4}/>
          <rect x={width * 0.56} y={y + 112} width={width * 0.2} height={212} fill="none" stroke={ink} strokeWidth={8}/>
          <LineText x={width * 0.34} y={y + 367} text="กล่องจริง" size={30}/>
          <LineText x={width * 0.66} y={y + 367} text="กรอบแบน" size={30}/>
        </Paper></g>
        <g opacity={alpha(1)}><Arrow x1={width * 0.36} y1={y + 478} x2={width * 0.65} y2={y + 478} dotted color="#9d7751"/></g>
        <g opacity={alpha(2)}><LineText x={cx} y={y + 535} text="ความอุ่นอาจมีส่วน • ยังไม่ใช่เหตุที่ยืนยันแล้ว" size={27}/></g>
      </g>;
      break;
    case 'contact-hypothesis':
      if (visual.phase === 1) {
        body = <g>
          <Paper x={width * 0.1} y={y + 20} w={width * 0.8} h={440} fill={colors.cream}>
            <circle cx={cx} cy={y + 240} r={48} fill={colors.amber} stroke={ink} strokeWidth={4}/>
            {['ซ่อน', 'อุ่น', 'สัมผัส'].map((word, i) => {
              const dx = (i - 1) * width * 0.26;
              const amount = alpha(i);
              return <g key={word} opacity={amount}>
                <path d={`M${cx} ${y + 240} L${cx + dx} ${y + 130}`} stroke="#9d7751" strokeWidth={5} strokeDasharray="12 12"/>
                <Pill x={cx + dx - width * 0.11} y={y + 78} width={width * 0.22} text={word} fill={colors.cream} size={28}/>
              </g>;
            })}
            <LineText x={cx} y={y + 394} text="แต่ละข้อเสนอแยกจากกัน" size={29}/>
          </Paper>
        </g>;
      } else if (visual.phase === 3) {
        const tokenX = width * (0.28 + 0.3 * alpha(0));
        body = <g>
          <Paper x={width * 0.1} y={y + 20} w={width * 0.8} h={440} fill={colors.cream}>
            <LineText x={cx} y={y + 96} text="แรงสัมผัสอาจมีส่วน" size={34}/>
            <path d={`M${width * 0.26} ${y + 244} L${width * 0.57} ${y + 244}`} stroke="#9d7751" strokeWidth={8} strokeDasharray="14 14"/>
            <circle cx={tokenX} cy={y + 244} r={34} fill={colors.amber} stroke={ink} strokeWidth={4}/>
            <LineText x={cx} y={y + 385} text="ยังไม่ใช่เฉลยที่ยืนยันแล้ว" size={29}/>
          </Paper>
        </g>;
      } else {
        const contactProgress = alpha(1);
        body = <g>
          <Paper x={width * 0.1} y={y + 10} w={width * 0.8} h={420} fill={colors.cream}>
            <g transform={`translate(${cx - 165} ${y + 170})`}><CatGlyph x={0} y={0} s={0.78}/></g>
            <path d={`M${cx + 70} ${y + 192} C${cx + 132} ${y + 138} ${cx + 172} ${y + 246} ${cx + 238} ${y + 192}`} fill="none" stroke="#9d7751" strokeWidth={8} strokeDasharray="14 14" strokeDashoffset={14 * (1 - contactProgress)}/>
            <LineText x={cx} y={y + 350} text="สัมผัสด้านข้าง • ข้อเสนอที่ยังไม่ยืนยัน" size={28}/>
          </Paper>
        </g>;
      }
      break;
    case 'evidence-sort':
      if (visual.phase === 1) {
        const split = alpha(1);
        body = <g>
          <FigureCard x={width * (0.29 - 0.21 * split)} y={y + 74} width={width * 0.4} title="งานเรื่องกรอบ" detail="ดูการเลือก" accent={colors.blue}/>
          <FigureCard x={width * (0.31 + 0.21 * split)} y={y + 74} width={width * 0.4} title="งานที่ซ่อน" detail="ดูคะแนนความเครียด" accent={colors.amber}/>
          <g opacity={alpha(2)}><LineText x={cx} y={y + 365} text="วัดคนละอย่าง" size={32}/></g>
        </g>;
      } else if (visual.phase === 2) {
        body = <g>
          {['ความอุ่น', 'การซุ่ม', 'สัมผัสด้านข้าง'].map((word, i) => <g key={word} opacity={alpha(i)} transform={`translate(0 ${20 * (1 - alpha(i))})`}>
            <Pill x={width * (0.08 + i * 0.29)} y={y + 60} width={width * 0.25} text={word} fill={i === 1 ? '#fff4ce' : colors.cream} size={25}/>
          </g>)}
          <FigureCard x={width * 0.1} y={y + 220} width={width * 0.37} title="ผลที่วัด / สังเกต" detail="หลักฐานตามบริบท" accent={colors.blue}/>
          <FigureCard x={width * 0.53} y={y + 220} width={width * 0.37} title="เหตุเฉพาะครั้ง" detail="ยังไม่ยืนยัน" accent={colors.amber}/>
          <g opacity={alpha(2)}><Arrow x1={width * 0.48} y1={y + 330} x2={width * 0.51} y2={y + 330} dotted color="#9d7751"/></g>
        </g>;
      } else if (visual.phase === 3) {
        const first = alpha(0); const second = alpha(1);
        body = <g>
          <g opacity={first}><FigureCard x={width * 0.1} y={y + 45} width={width * 0.37} title="สิ่งที่สังเกต / วัด" detail="บางตัวเลือกกรอบ" accent={colors.blue}/></g>
          <g opacity={second}><FigureCard x={width * 0.53} y={y + 45} width={width * 0.37} title="เหตุที่เสนอ" detail="ยังไม่รู้" accent={colors.amber}/></g>
          <g opacity={alpha(2)}><Arrow x1={width * 0.48} y1={y + 160} x2={width * 0.52} y2={y + 160} dotted color="#9d7751"/></g>
          {visual.status === 'fiction' && <g opacity={alpha(3)}><Pill x={width * 0.14} y={y + 330} width={width * 0.72} text="ครั้งนี้ยังไม่รู้" fill={colors.cream} size={38}/></g>}
        </g>;
      } else {
        const observed = alpha(0); const proposed = alpha(1);
        body = <g>
          <g opacity={observed} transform={`translate(${-18 * (1 - observed)} 0)`}><FigureCard x={twoX[0]} y={y + 24} width={cardWidth} title="สิ่งที่สังเกต / วัด" detail="ผลในบริบทที่ศึกษา" accent={colors.blue}/></g>
          <g opacity={proposed} transform={`translate(${18 * (1 - proposed)} 0)`}><FigureCard x={twoX[1]} y={y + 24} width={cardWidth} title="เหตุที่เสนอ" detail="ยังไม่ยืนยันเหตุเฉพาะครั้ง" accent={colors.amber}/></g>
          <g opacity={alpha(2)}><Arrow x1={width * 0.48} y1={y + 205} x2={width * 0.52} y2={y + 205} dotted color="#9d7751"/></g>
        </g>;
      }
      break;
    default:
      body = null;
  }

  return <g>{body}</g>;
};

/** Shared screen-space explainer. Physical scenes receive only a safe overlay, never an opaque diagram over the room. */
export const VisualStage = ({visual, frame, fps, width, height, physical = false}: {
  visual: SceneVisual; frame: number; fps: number; width: number; height: number; physical?: boolean;
}) => {
  const progress = visualProgressAt(visual, frame, fps);
  const status = statusText[visual.status];
  const headerY = height * 0.092;
  const headingY = height * 0.17;
  const labelTop = height * 0.22;
  return <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'}} aria-label={visual.heading}>
    {!physical && <rect x={0} y={0} width={width} height={height} fill={colors.cream}/>}
    <rect x={width * 0.075} y={headerY - 36} width={width * 0.52} height={72} rx={18} fill={visual.status === 'hypothesis' ? '#fff0cf' : visual.status === 'research' ? '#e7f4f5' : '#fff9ef'} stroke={ink} strokeWidth={3}/>
    <Text x={width * 0.335} y={headerY + 13} size={36}>{status}</Text>
    <LineText x={width / 2} y={headingY} text={visual.heading} size={60}/>
    {!physical && visual.showDiagram !== false && <DiagramBody visual={visual} width={width} height={height} progress={progress}/>}
    {physical && visual.phase === 3 && (visual.id === 'evidence-sort' || visual.id === 'toy-pursuit') && (() => {
      const holdStartsAt = Math.max(0, visual.endSec - 3);
      const revealProgress = Math.max(0, Math.min(1, (frame / fps - (holdStartsAt - 1)) / 1));
      const message = visual.id === 'evidence-sort' ? 'ครั้งนี้ยังไม่รู้' : 'เห็นการกระทำ\nยังไม่รู้เหตุที่เข้าไป';
      const written = message.slice(0, Math.ceil(message.length * revealProgress));
      return revealProgress > 0 && written.length > 0 ? <g>
        <Paper x={width * 0.62} y={height * 0.33} w={width * 0.32} h={144} fill={colors.cream}>
          <LineText x={width * 0.78} y={height * 0.33 + 83} text={written} size={36}/>
        </Paper>
      </g> : null;
    })()}
    {!!visual.labels.length && <g>
      {visual.labels.slice(0, 4).map((label, i) => {
        const labelStartSec = visual.labelsAtSec?.[i] ?? visual.startSec;
        const labelReveal = labelStartSec === visual.startSec ? 1 : Math.max(0, Math.min(1, (frame / fps - labelStartSec) / 0.2));
        const column = physical && visual.labels.length === 1 ? 1 : i % 2;
        const row = Math.floor(i / 2);
        const pillWidth = width * 0.42;
        const x = width * (column === 0 ? 0.075 : 0.505);
        const y = labelTop + row * 106;
        return <g key={`${visual.shotId}-label-${i}`} opacity={labelReveal} transform={`translate(0 ${8 * (1 - labelReveal)})`}>
          <rect x={x} y={y} width={pillWidth} height={98} rx={16} fill={visual.status === 'hypothesis' ? '#fff4ce' : visual.status === 'research' ? '#e7f4f5' : colors.cream} stroke={ink} strokeWidth={2}/>
          <LineText x={x + pillWidth / 2} y={y + 36} text={wrapLabel(label)} size={36}/>
        </g>;
      })}
    </g>}
  </svg>;
};
