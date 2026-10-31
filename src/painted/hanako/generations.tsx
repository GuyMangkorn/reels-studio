import japan from './japan.json';
import {Img, staticFile} from 'remotion';
import {hash} from '../kit/hash';
import {ell, inkLine, washAt} from '../kit/draw';
import {toScreen, type Camera} from '../kit/camera';
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
/**
 * FILM-CARD box (B07-SH03), stage px: the 1995 Shochiku flyer (2:3, r3), a store copy redacted by scripts/hanako/short/poster-redact.py (preset 1995-r3).
 * 540 × 810 at x 270–810, y 30–840. The largest 2:3 card whose 1.5 px ink outline clears caption band y 860 at the end of the push
 * (s 1.05, focus y 585) with the top in frame: ink bottom at screen y 854.3, ink top at screen y 0.7 (31 Oct 2026). With its top at y 30 the ceiling is 543 px wide.
 */
export const FILM_CARD = {box: {x: 270, y: 30, width: 540, height: 810}, src: 'images/hanako/film-card-poster-1995-redacted.png', ratio: 2 / 3} as const;
/** Stage-space rectangle of the flyer at `posterY` (the card's slide offset). */
export const filmPosterBox = (posterY: number) => {
  const {box, ratio} = FILM_CARD;
  const width = Math.min(box.width, box.height * ratio), height = width / ratio;
  return {x: box.x + (box.width - width) / 2, y: box.y + posterY + (box.height - height) / 2, width, height};
};
/**
 * The real FILM-CARD flyer: a store copy with the title lockup, tagline and credits blurred and the child actor's face softened (scripts/hanako/short/poster-redact.py).
 * A DOM image, not brush paint: it sits under the shot's CameraLayer so the SetLight glow still falls on it, and its box is mapped
 * through the same camera as the plate.
 */
export const FilmPoster = ({posterY, camera}: {posterY: number; camera: Camera}) => {
  const b = filmPosterBox(posterY);
  const [x0, y0] = toScreen(camera, [b.x, b.y]), [x1, y1] = toScreen(camera, [b.x + b.width, b.y + b.height]);
  return <Img src={staticFile(FILM_CARD.src)} style={{position: 'absolute', left: x0, top: y0, width: x1 - x0, height: y1 - y0}}/>;
};
/** B07-SH03 card, brush-painted: a dark shadow and one static ink edge around the flyer box; it slides with `posterY`. The flyer itself is `FilmPoster`. */
export const paintPoster = (p:Painter, posterY:number) => {
  const b = filmPosterBox(0), m = 1.5;
  p.brush.push(); p.brush.translate(0, posterY);
  washAt(p, 7100, '#101c20', 255, [[b.x+10,b.y+10],[b.x+b.width+8,b.y-2],[b.x+b.width-2,b.y+b.height+6],[b.x-10,b.y+b.height+14]], .05, .2);
  inkLine(p, 7103, [[b.x-m,b.y-m],[b.x+b.width+m,b.y-m],[b.x+b.width+m,b.y+b.height+m],[b.x-m,b.y+b.height+m]], {color:'#30413a', weight:2.4, still:true});   // a static card edge does not boil
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
