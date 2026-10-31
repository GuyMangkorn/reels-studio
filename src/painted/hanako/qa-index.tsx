import {paintKidSilhouette, generationGroups} from './generations';
// Standalone plate inspection, outside Root and src/videos. No deliverable registration.
import {registerRoot, Composition, useCurrentFrame} from 'remotion';
import {BrushCanvas} from '../BrushCanvas';
import {applyCamera} from '../kit/camera';
import {makePainter} from '../kit/painter';
import {paintClassKid, paintKid} from './assets';
import {KnockOverlay, hanakoCamera} from '../shots/hanako';
import {PlatePreview} from '../spike/PlatePreview';
import {hanakoShots, HANAKO_SPECS} from '../shots/hanako';
const LeadMask = () => {
  const f = useCurrentFrame();
  return <BrushCanvas paper="#ff00ff" paint={({brush}) => {
    const p = makePainter(brush, {t: f / 30, frame: f, fade: '#ff00ff'});
    brush.push(); applyCamera(brush, hanakoCamera('B03-SH01', f));
    paintKid(p, 'L', f, false); brush.pop();
  }} />;
};
const ClassMask = () => {
  const f=useCurrentFrame();
  return <BrushCanvas paper="#ff00ff" paint={({brush})=>{
    const p=makePainter(brush,{t:f/30,frame:f,fade:'#ff00ff'});
    brush.push();applyCamera(brush,hanakoCamera('B07-SH01',f));paintClassKid(p,'A',f,false);brush.pop();
  }}/>;
};
const landing=hanakoShots.find(s=>s.id==='HANAKO-B01-SH01')!;
const ending=hanakoShots.find(s=>s.id==='HANAKO-B09-SH01')!;
const Landing=()=> <PlatePreview shot={{...landing,Overlay:props=><KnockOverlay {...props} f={Math.round(props.tl*30)} F={0}/>}} G0={0} label={false} note="hook off"/>;
const LayersOff=()=> <PlatePreview shot={{...ending,Overlay:props=><KnockOverlay {...props} f={Math.round(props.tl*30)} F={2302+Math.round(props.tl*30)} effects={false}/>}} G0={2302} label={false} note="dip/glow off"/>;
const SilhouetteMask=({g=0,m=0}:{g:number;m:number})=>{
  const f=useCurrentFrame(),[x,h]=generationGroups[g].members[m];
  return <BrushCanvas paper="#ff00ff" paint={({brush})=>{
    const p=makePainter(brush,{t:f/30,frame:f,fade:'#ff00ff'});
    brush.push();applyCamera(brush,hanakoCamera('B08-SH01',f));
    paintKidSilhouette(p,{x:540+x*227,height:h*227,variant:g+m,seed:6000+g*16+m*4,shadow:false});
    brush.pop();
  }}/>;
};
const QA = () => <><Composition id="HANAKO-SILHOUETTE-MASK" component={SilhouetteMask} defaultProps={{g:0,m:0}} width={1080} height={1920} fps={30} durationInFrames={256}/><Composition id="HANAKO-CLASS-MASK" component={ClassMask} width={1080} height={1920} fps={30} durationInFrames={190}/>
<Composition id="HANAKO-LOOP-LANDING" component={Landing} width={1080} height={1920} fps={30} durationInFrames={117}/>
<Composition id="HANAKO-LAYERS-OFF" component={LayersOff} width={1080} height={1920} fps={30} durationInFrames={294}/>
<Composition id="HANAKO-LEAD-MASK" component={LeadMask} width={1080} height={1920} fps={30} durationInFrames={202} />{hanakoShots.map((shot, i) => {
  const spec = HANAKO_SPECS[i];
  return <Composition key={shot.id} id={shot.id} width={1080} height={1920} fps={30} durationInFrames={spec.length}
    component={() => <PlatePreview shot={shot} G0={spec.start} label={false} note="SCENE-R3 / standalone" />} />;
})}</>;
registerRoot(QA);
