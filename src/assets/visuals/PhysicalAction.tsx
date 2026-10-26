import {Cat} from '../../rig';
import {CatboxRoom} from '../backgrounds/CatboxRoom';
import {SceneProp} from '../Props';
import {layoutWorldActor, layoutWorldProp, orthographicViewAt} from '../../scenes/projection';
import type {Actor, OrthographicProjection, ScenePropSpec} from '../../scenes/types';
import {propAnchorOffsetMeters} from '../Props';
import {ease} from './primitives';

/** Reusable cat-level physical stage; canonical actor/box dimensions belong to shared library. */
export const PhysicalAction = ({kind, phase, progress, frame, fps, width, height}: {kind: 'play' | 'visit'; phase: number; progress: number; frame: number; fps: number; width: number; height: number}) => {
 const portrait = height > width;
 const active = phase === 0;
 const travel = kind === 'play' ? ease((progress-.18)/.5) : progress < .45 ? ease(progress/.35) : 1-ease((progress-.6)/.35);
 const x = kind === 'play' ? -.30+travel*.42 : -.4+travel*.6;
 const moving = active && (kind === 'play' ? progress > .18 && progress < .72 : progress < .35 || progress > .6);
 const boxX = kind === 'play' ? -.30 : .47;
 const seated = kind === 'play' && (phase === 3 || progress < .15);
 const actor: Actor = {id:'mochi',type:'cat',color:'#c7b5e7',world:{keys:[{atSec:0,x,y:0}]}};
 const projection: OrthographicProjection = {unit:'m',stage:{left:-5,right:5,bottom:-2,top:4},views:{short:{bounds:{left:-.3234375,right:.3234375,bottom:-.25,top:.9},cameraMoves:[{atSec:0,x:x-.03,y:0},{atSec:45,x:x-.015,y:0}]},long:{bounds:{left:-2.1333333333,right:2.1333333333,bottom:-.45,top:1.95}}}};
 const view = orthographicViewAt(projection,width,height,frame,fps,portrait);
 const oldBox: ScenePropSpec={type:'catbox-old',space:'world',world:{x:boxX,y:0}};
 const layout=layoutWorldProp(oldBox,view);
 const catPoint={x,y:seated?propAnchorOffsetMeters('catbox-old','seat').y:0,direction:kind==='visit'&&progress>.6?-1:1};
 const catLayout=layoutWorldActor(actor,catPoint,view);
 const toyX=-.08+ease(progress/.4)*.48;
 const floorY=view.letterboxY+view.view.top*view.pixelsPerMeter;
 return <div style={{position:'absolute',inset:0}}>
  <CatboxRoom stage={projection.stage} view={view.view} width={width} height={height}/>
  <SceneProp {...layout} type="catbox-old" part="rear"/>
  {kind==='visit'&&<SceneProp type="catbox-cube" x={width/2+(0.26-(view.view.left+view.view.right)/2)*view.pixelsPerMeter} y={floorY} size={.25*view.pixelsPerMeter}/>}
  <Cat {...catLayout} color="#c7b5e7" pose={moving?'walk':seated?'sit':'idle'} frame={frame} physicalPose physicalSitWeight={seated?1:0} physicalWalkWeight={moving?1:0}/>
  <SceneProp {...layout} type="catbox-old" part="front"/>
  {kind==='play'&&<SceneProp type="catbox-toy" x={(toyX-view.view.left)*view.pixelsPerMeter} y={floorY} size={.16*view.pixelsPerMeter}/>}
 </div>;
};
