import japan from './japan.json';
import {hash} from '../kit/hash';
import {ell, inkLine, rectPts, washAt} from '../kit/draw';
import type {Painter, Pt} from '../kit/painter';
import {HK} from './look';
import {cast, ribbon} from './assets';

// Shared SCENE-R3 graphic assets. No likeness, real cover/poster, or Hanako figure in the room.
// Figures inside a painted wide shot are brush-painted (painted-2d skill); SVG stays for crisp labels (DateCard).
const rings = japan.rings.map(r=>Array.from({length:r.length/2},(_,i)=>[r[i*2],r[i*2+1]] as Pt));
const inside = ([x,y]:Pt, poly:Pt[]) => {
  let yes=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++) {
    const [xi,yi]=poly[i], [xj,yj]=poly[j];
    if((yi>y)!==(yj>y) && x<(xj-xi)*(y-yi)/(yj-yi)+xi) yes=!yes;
  }
  return yes;
};
export const mapDots:Pt[]=[];
for(let n=0;mapDots.length<40 && n<20000;n++) {
  const q:Pt=[160+hash(n*2+1701)*710,155+hash(n*2+1702)*675];
  if(rings.some(r=>inside(q,r)) && Math.hypot(q[0]-680,q[1]-471)>30 && mapDots.every(p=>Math.hypot(p[0]-q[0],p[1]-q[1])>16)) mapDots.push(q);
}
if(mapDots.length!==40) throw new Error('HANAKO map needs 40 separated seeded land dots');
export const generationGroups = [
  {on:2147,off:2219,end:2231,members:[[0,1.30]]},
  {on:2217,off:2247,end:2259,members:[[-.55,1.20],[.55,1.15]]},
  {on:2240,off:2266,end:2278,members:[[0,1.35],[1.10,1.40]]},
  {on:2273,off:2291,end:2301,members:[[.55,1.25]]},
];
export const DateCard=({text,x=120,y=430,opacity=1}:{text:string;x?:number;y?:number;opacity?:number})=><g opacity={opacity}>
  <rect x={x} y={y} width={300} height={70} rx={8} fill="#e6e1d0" stroke="#1d2129" strokeWidth={4}/>
  <text x={x+150} y={y+49} textAnchor="middle" fontFamily="Noto Sans Thai" fontSize={44} fontWeight={800} fill={HK.ink}>{text}</text>
</g>;
/** Generic faceless teacher (B07-SH01), brush-painted in the classroom plate. The pen wobbles on a 12-f loop from F1708. */
export const paintTeacher = (p:Painter, F:number) => {
  const pen = F<1708 ? 0 : Math.sin((F-1708)*Math.PI/6)*5;
  // Floor shadow is drawn by paintClassroom behind the desk (the teacher stands behind it).
  const body:Pt[] = [[488,486],[514,474],[540,467],[566,474],[592,486],[616,632],[465,632]];
  cast(p, 7001, '#66796a', body);
  washAt(p, 7002, '#4c5f56', 150, [[566,474],[592,486],[616,632],[572,632],[552,500]], .08, .2);
  washAt(p, 7003, '#a5b69b', 200, [[529,485],[540,533],[554,485],[546,482],[540,512],[534,482]], .05, .15);
  inkLine(p, 7004, [[540,533],[540,625]], {color:'#8fa388', weight:1.1, closed:false, still:true});
  cast(p, 7005, '#b3b69a', ell(540, 444, 42, 46, 26));
  cast(p, 7006, '#314840', [[498,441],[493,389],[540,399],[588,392],[582,443],[572,423],[510,423]]);
  cast(p, 7007, '#82917b', ribbon([[479,510],[459,574],[490,614],[529,638]], 23, 23));
  cast(p, 7008, '#82917b', ribbon([[601,510],[622,563],[584,609]], 23, 23));
  cast(p, 7009, '#c4c6a8', [[476,643],[569,643],[600,670],[488,670]]);
  inkLine(p, 7010, [[540,645],[541,666]], {color:'#899b86', weight:1, closed:false, still:true});
  inkLine(p, 7011, [[554,649],[580,663]], {color:'#899b86', weight:1, closed:false, still:true});
  washAt(p, 7012, '#c2c3a3', 255, ell(573+pen, 628, 15, 10, 18), .05, .15);
  inkLine(p, 7013, [[580+pen,611],[565+pen,653]], {color:'#223b39', weight:2.5, closed:false, still:true});
};
/** Doodle: the stationary popular-image figure on the poster, paper-cut wash with one edge line. No face, no body in the room (VD06). */
export const paintDoodle = (p:Painter, ox:number, oy:number, seed:number) => {
  const q = (pts:Pt[]):Pt[] => pts.map(([x,y])=>[ox+x,oy+y]);
  cast(p, seed, HK.ink, q([[65,44],[72,14],[100,5],[140,6],[190,4],[216,40],[216,74],[215,117],[63,117]]));
  washAt(p, seed+1, '#2b3c3a', 150, q([[168,24],[206,32],[216,74],[215,117],[186,117],[192,60]]), .05, .15);
  cast(p, seed+2, '#cfd3bb', q(rectPts(111,71,170,127)));
  cast(p, seed+3, '#dedfc6', q([[94,127],[183,127],[190,202],[84,202]]));
  cast(p, seed+4, HK.red, q([[87,198],[187,198],[215,264],[59,264]]));
  washAt(p, seed+5, '#9e3836', 150, q([[168,200],[187,198],[215,264],[186,264]]), .04, .12);
  cast(p, seed+6, '#cbd0b8', q(ribbon([[87,142],[54,191]], 16, 16)));
  cast(p, seed+7, '#cbd0b8', q(ribbon([[188,142],[224,191]], 16, 16)));
  inkLine(p, seed+8, q([[100,264],[100,295]]), {color:'#283b36', weight:2.2, closed:false, still:true});
  inkLine(p, seed+9, q([[174,264],[174,295]]), {color:'#283b36', weight:2.2, closed:false, still:true});
  inkLine(p, seed+10, q([[59,264],[215,264],[187,198],[87,198]]), {color:'#283b36', weight:1.4, closed:false, still:true});
};
/** B07-SH03 poster (paper, picture panel and doodle), brush-painted; it slides with `posterY` in the plate. Its caption stays SVG. */
export const paintPoster = (p:Painter, posterY:number) => {
  p.brush.push(); p.brush.translate(0, posterY);
  washAt(p, 7100, '#101c20', 255, [[270,340],[828,328],[818,846],[250,854]], .05, .2);
  cast(p, 7101, '#b7bc9f', [[260,330],[820,330],[820,840],[260,840]]);
  cast(p, 7102, '#71847a', [[278,348],[802,348],[802,821],[278,821]]);
  inkLine(p, 7103, [[260,330],[820,330],[820,840],[260,840]], {color:'#30413a', weight:2.4, still:true});   // a static paper edge does not boil
  paintDoodle(p, 400, 420, 7110);
  p.brush.pop();
};
/**
 * CH-KID back-view silhouette (B08, VD16), brush-painted: the same four-head envelope, cropped hair, trouser gap, bag/collar
 * variants and foot shadow as the SVG it replaces. Feet sit on plate y 838 (was 840: the painted spread at the 1.08 push
 * reached 861 px, into the caption band; 838 keeps the bottoms at or above 859). `p` carries the group opacity.
 */
export const SILHOUETTE_FEET_Y = 838;
export const paintKidSilhouette = (p:Painter, {x, height, variant, seed, shadow=true}:{x:number; height:number; variant:number; seed:number; shadow?:boolean}) => {
  const s = height/875, M = ([px,py]:Pt):Pt => [x+(px-830)*s, SILHOUETTE_FEET_Y+(py-1290)*s];
  const P = (pts:Pt[]) => pts.map(M);
  const body:Pt[] = [[754,634],[897,634],[922,914],[900,1290],[844,1290],[830,1010],[816,1290],[760,1290],[738,914]];
  const head = ell(830, 524.375, 87.5, 109.375, 30);
  if (shadow) washAt(p, seed, '#132627', 230, P(ell(830, 1293, 115, 14, 24)), .1, .3);
  cast(p, seed+1, '#a1b2a4', P(body));
  cast(p, seed+2, '#a1b2a4', P(head));
  cast(p, seed+3, '#a1b2a4', P(ribbon([[756,675],[732,896]], 40, 40)));
  cast(p, seed+4, '#a1b2a4', P(ribbon([[902,675],[928,896]], 40, 40)));
  if (variant%2===1) cast(p, seed+5, '#6d8a7f', P([[762,730],[830,704],[898,730],[900,930],[760,930]]));
  if (variant%3===2) inkLine(p, seed+6, P([[766,681],[840,749],[891,681]]), {color:'#d1d1ab', weight:2.2, closed:false, still:true});
  // Rim on the head only: a body outline would add ink below the feet line (plate y 840).
  inkLine(p, seed+8, P(head), {color:'#bed0b6', weight:.8, still:true});
};
