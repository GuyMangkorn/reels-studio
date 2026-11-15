import type {YCam} from '../kit/ycam';
import {quadMatrix3d} from '../../scenes/quadText';
import {LB_QUAD, LB_ROWS} from './scenes-roof';

// EDU-EP16-SHORT logbook rows (SH22): DOM text mapped to the page quad, shared by the W3 look still (look-roof.tsx) and the timed shot.
/** Logbook rows as camera-mapped DOM text (the QuadText homography, `src/scenes/quadText.ts`): the method under test for VD13 / R6.
 * W3 v8 (user: "the text runs past the page edge"): the box is clipped to the page quad (`overflow: hidden`), each row sits on its own ruled line inside
 * a 6 % margin, the font is sized so the longest row ("13 พ.ย.  เงียบ") fits the ruled width; Thai strings unchanged.
 * W5.2 r3: moved here from look-roof.tsx; `c` maps the rows through the SH22 pan camera (default camSH22). */
export const LogbookText = ({c}: {c?: YCam} = {}) => {
  const q = LB_QUAD(c);
  if (!q) return null;
  const w = 470, h = 1300, rowH = 150, mx = 28;
  return (
    <div lang="th" style={{position: 'absolute', left: 0, top: 0, width: w, height: h, overflow: 'hidden', transformOrigin: '0 0', transform: quadMatrix3d(w, h, q)}}>
      {LB_ROWS.map((r, i) => (
        <div key={r} style={{position: 'absolute', left: mx, right: mx, top: 40 + i * rowH, height: 106, borderBottom: '3px solid rgba(96,106,132,0.75)', overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 4, bottom: 4, fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 500, fontSize: 74, lineHeight: 1.2,
            color: i === LB_ROWS.length - 1 ? '#1d2747' : '#323c5c', opacity: i === LB_ROWS.length - 1 ? 0.95 : 0.7, whiteSpace: 'nowrap', transformOrigin: '0 100%', transform: `rotate(${-1.2 + 0.6 * (i % 3)}deg)`}}>{r}</div>
        </div>
      ))}
    </div>
  );
};
