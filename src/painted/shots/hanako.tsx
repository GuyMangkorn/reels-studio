import {SeamGlow} from '../hanako/look-r4';
import {mapDots} from '../hanako/generations';
import {paintTeacher, paintPoster, paintKidSilhouette, DateCard, generationGroups} from '../hanako/generations';
import {CameraLayer, toScreen, type Camera} from '../kit/camera';
import {Spot} from '../kit/glow';
import {lerp} from '../kit/painter';
import {Grade, Grain} from '../kit/screen';
import type {PaintedShot} from '../shot';
import {HK, paintStoryPanel} from '../hanako/look';
import {paintFolderPlate, paintMapPlate, PIN} from '../hanako/look-r3';
import {hardFill, rectPts} from '../kit/draw';
import {ramp} from '../kit/painter';
import {paintClassroom, paintClassKid, paintEndingHand, paintBook, paintCabinet, paintFolderHand} from '../hanako/assets';
import {paintKnockHand, paintRestroom, RESTROOM, type RestroomView} from '../hanako/assets';
import {B03_GROUP_RISE, FpovTag, fpovCamera, paintFistB02, paintFpovChest} from '../hanako/plates-r4';

// HANAKO-SHORT-SCENE-R3, FILM-R4; plate-local frames at 30 fps. No audio, caption cues or video registration here.
export const HANAKO_G1 = [
  {id: 'B01-SH01', start: 0, length: 117}, {id: 'B01-SH02', start: 117, length: 187},
  {id: 'B02-SH01', start: 304, length: 139}, {id: 'B03-SH01', start: 443, length: 202},
] as const;
export const HANAKO_G2 = [
  {id: 'B04-SH01', start: 645, length: 255}, {id: 'B05-SH01', start: 900, length: 116},
  {id: 'B05-SH02', start: 1016, length: 156}, {id: 'B06-SH01', start: 1172, length: 177},
  {id: 'B06-SH02', start: 1349, length: 239},
] as const;
export const HANAKO_G3 = [
  {id:'B07-SH01',start:1588,length:190}, {id:'B07-SH02',start:1778,length:162},
  {id:'B07-SH03',start:1940,length:106}, {id:'B08-SH01',start:2046,length:256},
  {id:'B09-SH01',start:2302,length:294},
] as const;
export const HANAKO_SPECS = [...HANAKO_G1, ...HANAKO_G2, ...HANAKO_G3];
const progress = (f: number, end: number) => Math.max(0, Math.min(1, f / end));
const sine = (u: number) => (1 - Math.cos(Math.PI * u)) / 2;
export const hanakoCamera = (id: string, f: number): Camera => {
  let s = 1, fx = 540, fy = 590, dx = 0, dy = 0;
  if (id === 'B01-SH01') {
    s = lerp(1.08, 1, sine(progress(f - 36, 80))); fx = 660; fy = 740;
    for (const hit of [4, 18, 31]) if (f >= hit && f <= hit + 4) dy = 5 * (1 - (f - hit) / 4);
  } else if (id === 'B01-SH02') {s = lerp(1.10, 1, Math.sin(progress(f, 186) * Math.PI / 2)); fy = 600;}
  else if (id === 'B02-SH01') s = lerp(1, 1.06, progress(f, 138));
  else if (id === 'B04-SH01') {s = lerp(1,1.05,sine(progress(f,254))); fy=615;}
  else if (id === 'B05-SH01') {s=lerp(1,1.06,sine(progress(f,115))); fy=520; dy=-20*sine(progress(f,115));}
  else if (id === 'B05-SH02') {s=lerp(1,1.18,progress(f-11,100)**2);}
  else if (id === 'B06-SH01') {s=lerp(1,1.30,sine(progress(f,176))); [fx,fy]=PIN;}
  else if (id === 'B06-SH02') {const u=sine(progress(f,238));s=lerp(1,1.10,u);fy=600;dx=-15*u;}
  else if(id==='B07-SH01') {s=lerp(1,1.08,sine(progress(f,189)));fy=560;}
  else if(id==='B07-SH02') {s=lerp(1,1.06,sine(progress(f,161)));[fx,fy]=PIN;}
  else if(id==='B07-SH03') {s=lerp(1,1.05,sine(progress(f,105)));fy=585;}
  else if(id==='B08-SH01') {const u=sine(progress(f,255));s=lerp(1,1.08,u);fy=600;dx=-10*u;}
  else if(id==='B09-SH01') {s=lerp(1,1.08,sine(progress(f,204)));fx=660;fy=740;}
  else if (id === 'B03-SH01') return fpovCamera(f);
  else {s = lerp(1, 1.12, sine(progress(f, 201))); fx = 560; fy = 560;}
  return {s, fx, fy, dx, dy};
};
export const replyLight = (F: number) => F <= 417 ? .2 * progress(F - 414, 3) : .2 * (1 - progress(F - 417, 18));
const numberStyle = {fontFamily: 'Noto Sans JP', fontWeight: 800, fill: HK.ink} as const;
const DoorNumbers = ({view}: {view: RestroomView}) => {
  if (view === 'RR-KNOCK') return <text x={540} y={514} textAnchor="middle" fontSize={92} {...numberStyle}>3</text>;
  const {k, ground} = RESTROOM[view];
  return <>{[1, 2, 3, 4, 5].map((n) => <text key={n} x={540 + (n - 3) * .95 * k} y={ground - 1.55 * k + .035 * k} textAnchor="middle" fontSize={.085 * k} {...numberStyle}>{n}</text>)}</>;
};
const g1Shots: PaintedShot[] = HANAKO_G1.map(({id, start}) => {
  const view: RestroomView = id === 'B01-SH01' ? 'RR-KNOCK' : id === 'B01-SH02' ? 'RR-WIDE' : 'RR-DOOR';
  const kids = id === 'B03-SH01';
  return {
    id: `HANAKO-${id}`, serves: [`HANAKO-SHORT-S01-${id}`], paper: HK.ink,
    camera: (tl) => hanakoCamera(id, Math.round(tl * 30)),
    paint: (p, {tl}) => {
      const f = Math.round(tl * 30);
      if (kids) paintFpovChest(p, f);
      else {paintRestroom(p, view); if (id === 'B01-SH01') paintKnockHand(p, f);}
    },
    // B02 viewer's fist: a screen layer after the camera pop, so the door push does not move it (VD29).
    screen: (p, {tl}) => { if (id === 'B02-SH01') paintFistB02(p, Math.round(tl * 30)); },
    Overlay: ({tl, camera, width, height, opacity}) => {
      const f = Math.round(tl * 30), F = start + f;
      if(id==='B01-SH01') return <KnockOverlay f={f} F={F} camera={camera} width={width} height={height} opacity={opacity} hook/>;
      const jp = progress(F - 251, 6), label = progress(F - 467, 6), glow = replyLight(F);
      const flicker = .015 * (1 + Math.sin(2 * Math.PI * F / 118));
      return <div style={{position: 'absolute', inset: 0, opacity}}>
        <CameraLayer camera={camera} width={width} height={height} blend="normal">
          {!kids && <DoorNumbers view={view} />}
          {!kids && <Spot x={540} y={140} r={900} level={.20 + flicker} color="#dff3ee" />}
          {kids && <FpovTag />}
          {id === 'B02-SH01' && <>
            <rect x={810} y={320} width={8} height={540} fill="#efe3c4" opacity={glow} />
            <Spot x={814} y={570} r={175} level={glow} color="#efe3c4" />
            <Spot x={814} y={1490} r={110} level={glow * .3} color="#efe3c4" />
          </>}
        </CameraLayer>
        <Grade /><Grain />
        {/* LF01's quiet lower panel and RR-DOOR falloff: screen light control, outside the picture push. */}
        {!kids && id !== 'B01-SH02' && <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
          <defs><linearGradient id="hk-caption-falloff" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#0b181b" stopOpacity={0} />
            <stop offset="0.16" stopColor="#0b181b" stopOpacity={id === 'B02-SH01' ? .69 : .22} />
            <stop offset="1" stopColor="#0b181b" stopOpacity={id === 'B02-SH01' ? .69 : .22} />
          </linearGradient></defs>
          <rect x={0} y={660} width={width} height={height - 660} fill="url(#hk-caption-falloff)" />
        </svg>}
        <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
          {id === 'B01-SH02' && <text x={540} y={833} textAnchor="middle" fontFamily="Noto Sans JP" fontWeight={600} fontSize={30} fill="#eef3ee" stroke="#1d2129" strokeWidth={5} paintOrder="stroke" opacity={jp}>花子さん、いらっしゃいますか</text>}
          {kids && <text x={120} y={395 - B03_GROUP_RISE} fontFamily="Noto Sans Thai, Noto Sans JP" fontWeight={700} fontSize={40} fill="#eef3ee" stroke="#1d2129" strokeWidth={6} paintOrder="stroke" opacity={label}>ฮานาโกะซัง (トイレの花子さん)</text>}
        </svg>
      </div>;
    },
  };
});


export const mapEvents = (F: number) => ({pin: F >= 1256, pinDy: F>=1264 ? 0 : -90*(1-ramp(F,1256,1264)), ringRadius: 60*progress(F-1264,12), ringOpacity: F>=1264 && F<1276 ? .8*(1-progress(F-1264,12)) : 0, callout: progress(F-1296,8)});
export const lampLevel = (F: number) => .3*progress(F-1430,30);
const Tag = ({opacity}: {opacity: number}) => <g opacity={opacity}>
  <rect x={120} y={340} width={180} height={50} rx={5} fill="#e2d6b8" stroke="#1d2129" strokeWidth={3}/>
  <text x={210} y={377} textAnchor="middle" fontFamily="Noto Sans Thai" fontSize={32} fontWeight={700} fill="#2a2420">เรื่องเล่า</text>
</g>;
const g2Shots: PaintedShot[] = HANAKO_G2.map(({id,start}) => ({
  id:`HANAKO-${id}`, serves:[`HANAKO-SHORT-S01-${id}`], paper:HK.ink,
  camera:(tl)=>hanakoCamera(id,Math.round(tl*30)),
  paint:(p,{tl})=>{
    const f=Math.round(tl*30), F=start+f;
    if(id==='B04-SH01') {
      hardFill(p,1,'#1b2326',rectPts(-400,-400,1480,2320));
      if(F>=707) {p.brush.push();p.brush.translate(-1010*(1-ramp(F,707,719)),0);paintStoryPanel(p,'A',90*ramp(F,707,832));p.brush.pop();}
      if(F>=820) hardFill(p.layer(.3,700),700,'#10171b',rectPts(105,388,977,846));
      if(F>=820) {p.brush.push();p.brush.translate(1080*(1-ramp(F,820,832)),0);paintStoryPanel(p,'B');p.brush.pop();}
    } else if(id==='B05-SH01') paintCabinet(p,f);
    else if(id==='B05-SH02') {paintFolderPlate(p,f);paintFolderHand(p,f);}
    else if(id==='B06-SH01') {const e=mapEvents(F);paintMapPlate(p,e.pin,e.pinDy);}
    else paintBook(p);
  },
  Overlay:({tl,camera,width,height,opacity})=>{
    const f=Math.round(tl*30),F=start+f,e=mapEvents(F),pinHead=toScreen(camera,[PIN[0],PIN[1]-33]);
    return <div style={{position:'absolute',inset:0,opacity}}>
      <CameraLayer camera={camera} width={width} height={height} blend="normal">
        {id==='B04-SH01' && <>
          <g transform={`translate(${-1010*(1-ramp(F,707,719))} 0)`}><Tag opacity={progress(F-711,6)*(1-progress(F-820,12))}/></g>
          <g transform={`translate(${1080*(1-ramp(F,820,832))} 0)`}><Tag opacity={progress(F-836,6)}/></g>
        </>}
        {id==='B06-SH01' && <circle cx={PIN[0]} cy={PIN[1]} r={e.ringRadius} fill="none" stroke={HK.amber} strokeWidth={3} opacity={e.ringOpacity}/>}
        {id==='B06-SH02' && <Spot x={220} y={340} r={520} level={lampLevel(F)} color={HK.amber}/>}
      </CameraLayer>
      <Grade/>
      <svg width={width} height={height} style={{position:'absolute',inset:0}}>
        {id==='B05-SH02' && <>
          <defs><radialGradient id="hk-folder-vig" gradientUnits="userSpaceOnUse" cx={540} cy={520} r={950}>
            <stop offset="0" stopColor="#050a0c" stopOpacity={0}/><stop offset=".35" stopColor="#050a0c" stopOpacity={.06}/>
            <stop offset=".7" stopColor="#050a0c" stopOpacity={.45}/><stop offset="1" stopColor="#050a0c" stopOpacity={.85}/>
          </radialGradient></defs>
          <rect width={width} height={height} fill="url(#hk-folder-vig)" opacity={progress(f-11,100)}/>
        </>}
        {id==='B06-SH01' && <>
          <defs><linearGradient id="hk-sea-dim" gradientUnits="userSpaceOnUse" x1={0} y1={780} x2={0} y2={900}>
            <stop offset="0" stopColor="#1d2a2c" stopOpacity={0}/><stop offset="1" stopColor="#1d2a2c" stopOpacity={.94}/>
          </linearGradient></defs><rect y={780} width={width} height={height-780} fill="url(#hk-sea-dim)"/>
          <g opacity={e.callout}>
            <path d={`M600 360 L630 360 L${pinHead[0]} ${pinHead[1]}`} fill="none" stroke="#eef3ee" strokeWidth={2}/>
            <rect x={120} y={430} width={300} height={70} rx={8} fill="#e6e1d0" stroke="#1d2129" strokeWidth={4}/>
            <text x={270} y={479} textAnchor="middle" fontFamily="Noto Sans Thai" fontSize={44} fontWeight={800} fill="#1d2a2c">ราวปี 1948</text>
            <text x={120} y={340} fontFamily="Noto Sans Thai" fontSize={38} fontWeight={700} fill="#eef3ee" stroke="#1d2129" strokeWidth={6} paintOrder="stroke">อิวาเตะ, ญี่ปุ่น · ราวปี 1948</text>
          </g>
        </>}
        {id==='B06-SH02' && <text x={120} y={340} opacity={progress(F-1502,6)} fontFamily="Noto Sans JP" fontWeight={700} fontSize={36} fill="#eef3ee" stroke="#1d2129" strokeWidth={6} paintOrder="stroke">松谷みよ子『現代民話考 7 学校』</text>}
      </svg>
      <Grain/>
    </div>;
  },
}));



export const endingLight = (F: number) => {
  const pulse=F<=2347 ? sine(progress(F-2323,24)) : 1-sine(progress(F-2347,36));
  return {glow:.2*pulse,dip:.4*pulse,amber:.25*(1-progress(F-2581,14))};
};
/** Shared B01/B09 overlay owner. Final endpoint samples the wrap phase, hook is a separate overlay. */
export const KnockOverlay = ({f,F,camera,width,height,opacity,hook=false,effects=true}: {
  f:number; F:number; camera:Camera; width:number; height:number; opacity:number; hook?:boolean; effects?:boolean;
}) => {
  const end=F>=2302, light=end ? endingLight(F) : {glow:0,dip:0,amber:0};
  const ambient=F===2595 ? 2596 : F;
  const flicker=.015*(1+Math.sin(2*Math.PI*(ambient%118)/118));
  return <div style={{position:'absolute',inset:0,opacity}}>
    <CameraLayer camera={camera} width={width} height={height} blend="normal">
      <DoorNumbers view="RR-KNOCK"/>
      <Spot x={540} y={140} r={900} level={.20+flicker} color="#dff3ee"/>
      {light.amber>0 && <Spot x={-40} y={420} r={700} level={light.amber} color={HK.amber}/>}
    </CameraLayer>
    {effects && light.dip>0 && <div style={{position:'absolute',inset:0,background:'#060c0d',opacity:light.dip}}/>}
    {effects && light.glow>0 && <div style={{position:'absolute',inset:0}}>
      <CameraLayer camera={camera} width={width} height={height} blend="normal"><SeamGlow level={light.glow}/></CameraLayer>
    </div>}
    <Grade/><Grain/>
    <svg width={width} height={height} style={{position:'absolute',inset:0}}>
      <defs><linearGradient id="hk-caption-falloff" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#0b181b" stopOpacity={0}/><stop offset=".16" stopColor="#0b181b" stopOpacity={.22}/><stop offset="1" stopColor="#0b181b" stopOpacity={.22}/>
      </linearGradient></defs>
      <rect y={660} width={width} height={height-660} fill="url(#hk-caption-falloff)"/>
    </svg>
    {hook && <svg width={width} height={height} style={{position:'absolute',inset:0}}>
      <text x={540} y={356} textAnchor="middle" fontFamily="Noto Sans Thai" fontWeight={800} fontSize={64} fill="#f2f4ee" stroke="#10181a" strokeWidth={9} paintOrder="stroke" opacity={f<=45 ? 1 : 1-progress(f-46,8)}>เคาะสามครั้ง… มีคนตอบ?</text>
    </svg>}
  </div>;
};
const g3Shots: PaintedShot[]=HANAKO_G3.map(({id,start})=>({
  id:`HANAKO-${id}`,serves:[`HANAKO-SHORT-S01-${id}`],paper:HK.ink,
  camera:tl=>hanakoCamera(id,Math.round(tl*30)),
  paint:(p,{tl})=>{
    const f=Math.round(tl*30),F=start+f;
    if(id==='B07-SH01') {paintClassroom(p);paintClassKid(p,'A',f);paintClassKid(p,'B',f);paintTeacher(p,F);}
    else if(id==='B07-SH02') paintMapPlate(p,false);
    else if(id==='B07-SH03') {
      hardFill(p,1,'#172628',rectPts(-400,-400,1480,2320));
      hardFill(p,2,'#293b38',rectPts(140,180,940,850));
      hardFill(p,3,'#1e2e2f',rectPts(160,205,920,830));
      paintPoster(p,400*(1-progress(f,12))**3);
    } else if(id==='B08-SH01') {
      paintRestroom(p,'RR-WIDE');
      // CH-KID silhouettes (VD16) are painted in the plate under the glow overlay; each group uses the former SVG group opacity.
      generationGroups.forEach((g,i)=>{
        const a=.45*progress(F-g.on,12)*(1-progress(F-g.off,g.end-g.off));
        if(a<=0) return;
        g.members.forEach(([x,h],j)=>paintKidSilhouette(p.layer(a,6000+i*16+j*4),{x:540+x*227,height:h*227,variant:i+j,seed:6000+i*16+j*4}));
      });
    }
    else {paintRestroom(p,'RR-KNOCK');paintEndingHand(p,F);}
  },
  Overlay:({tl,camera,width,height,opacity})=>{
    const f=Math.round(tl*30),F=start+f;
    if(id==='B09-SH01') return <KnockOverlay f={f} F={F} camera={camera} width={width} height={height} opacity={opacity}/>;
    const cardX=-300+420*(1-(1-progress(F-1782,10))**3);
    const posterY=400*(1-progress(f,12))**3;
    return <div style={{position:'absolute',inset:0,opacity}}>
      <CameraLayer camera={camera} width={width} height={height} blend="normal">
        {id==='B07-SH01' && <Spot x={240} y={280} r={650} level={.25} color={HK.amber}/>}
        {id==='B07-SH02' && <>
          <Spot x={300} y={240} r={850} level={.16} color={HK.amber}/>
          <path d={`M${PIN[0]} ${PIN[1]} l-16 -32 8 -16 h16 l8 16 Z`} fill={HK.amber} stroke={HK.ink} strokeWidth={3} opacity={.5}/>
          {mapDots.map(([x,y],i)=>{
            const on=1860+Math.max(0,i-1)*2,u=progress(F-on,4),r=u<.5 ? u*16 : 8-(u-.5)*4;
            return F<on ? null : <circle key={i} cx={x} cy={y} r={r} fill="#e0a95a" stroke="#303d36" strokeWidth={1}/>;
          })}
        </>}
        {id==='B07-SH03' && <g transform={`translate(0 ${posterY})`}>
          <text x={540} y={800} textAnchor="middle" fontFamily="Noto Sans Thai" fontSize={24} fill="#253936">ภาพประกอบ · ไม่ใช่โปสเตอร์จริง</text>
        </g>}
        {id==='B08-SH01' && <>
          <DoorNumbers view="RR-WIDE"/>
          <Spot x={540} y={140} r={900} level={.20+.015*(1+Math.sin(2*Math.PI*F/118))} color="#dff3ee"/>
          <Spot x={-40} y={420} r={700} level={.25} color={HK.amber}/>
        </>}
      </CameraLayer>
      <Grade/>
      <svg width={width} height={height} style={{position:'absolute',inset:0}}>
        {id==='B07-SH01' && <>
          <DateCard text="ยุค 80" x={-300+420*(1-(1-progress(F-1653,10))**3)} y={430}/>
          <g opacity={progress(F-1689,6)} fontFamily="Noto Sans Thai, Noto Sans JP" fontWeight={700} fontSize={36} fill="#eef3ee" stroke="#1d2129" strokeWidth={6} paintOrder="stroke">
            <text x={120} y={342}>常光徹 Tsunemitsu Tōru</text><text x={120} y={402}>ครู / นักคติชนวิทยา</text>
          </g>
        </>}
        {id==='B07-SH02' && <>
          <defs><linearGradient id="hk-sea-dim" gradientUnits="userSpaceOnUse" x1={0} y1={780} x2={0} y2={900}>
            <stop offset="0" stopColor="#1d2a2c" stopOpacity={0}/><stop offset="1" stopColor="#1d2a2c" stopOpacity={.94}/>
          </linearGradient></defs><rect y={780} width={width} height={height-780} fill="url(#hk-sea-dim)"/>
          <g transform={`translate(${cardX-120} 0)`}>
            <rect x={120} y={250} width={300} height={170} rx={6} fill="#b9c4ac" stroke="#253a36" strokeWidth={4}/>
            <path d="M136 266 H404 V402 H136 Z M150 266 V402" fill="#d3d7bf" stroke="#7b8f7f" strokeWidth={3}/>
            <text x={270} y={324} textAnchor="middle" fontFamily="Noto Sans JP" fontWeight={700} fontSize={32} fill={HK.ink}>『学校の怪談』</text>
            <text x={270} y={371} textAnchor="middle" fontFamily="Noto Sans Thai" fontSize={24} fill={HK.ink}>ภาพแทนหนังสือ</text>
            <DateCard text="ปี 1990"/>
          </g>
        </>}
        {id==='B07-SH03' && <>
          <DateCard text="ยุค 90" opacity={F>=1941 ? 1 : 0}/>
          <g opacity={F>=1994 ? 1 : 0} transform={`translate(540 750) scale(${1+.15*(1-progress(F-1994,6))}) translate(-540 -750)`}>
            <text x={540} y={752} textAnchor="middle" fontFamily="Noto Sans JP" fontWeight={800} fontSize={39} fill="#f0ead0" stroke="#243632" strokeWidth={7} paintOrder="stroke">『トイレの花子さん』 1995</text>
          </g>
          {F>=2022 && F<2025 && <rect width={width} height={height} fill="#efe3c4" opacity={.15}/>}
        </>}
        {id==='B07-SH03' && <>
          <defs><linearGradient id="hk-poster-caption" gradientUnits="userSpaceOnUse" x1={0} y1={800} x2={0} y2={860}>
            <stop offset="0" stopColor="#102024" stopOpacity={0}/><stop offset="1" stopColor="#102024" stopOpacity={.72}/>
          </linearGradient></defs><rect y={800} width={width} height={height-800} fill="url(#hk-poster-caption)"/>
        </>}
      </svg><Grain/>
    </div>;
  },
}));
export const hanakoShots: PaintedShot[] = [...g1Shots,...g2Shots,...g3Shots];
