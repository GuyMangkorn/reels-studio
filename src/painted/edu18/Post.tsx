import {staticFile} from 'remotion';
import {inkLine, solid} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';

// EDU-EP18-SHORT phone + post (brief N4, VD05, VD12; pre-W3 comp card pass, 15 Nov 2026). PHONE-SVG: the screen is crisp React SVG in
// the phone's logical screen space `P` (1170 x 2532), laid as a DOM layer over the painted phone body (`paintPhoneBody`) and locked to
// its screen quad by the shot (the WORLD FOG VD09 method, `worldfog/phone.tsx`). One post object serves B02 and B06 (CL01, CL04).
//
// Truth limits on the picture (brief Visual intent 1 and 6, VD12): the caption's 500 and the share counter are the only numbers on the
// screen. No clock, battery percentage, date, like or comment count; no brand, logo or real platform; fictional handle.

/** Caption, verbatim (brief VD05, script CL01). The card breaks it before the number so the 500 sits alone on line 2. */
export const POST_CAPTION = 'รอดจากสัตว์ที่ฆ่าคนเยอะที่สุดในโลก! 500 คน/ปี';
export const POST_CAPTION_LINES = ['รอดจากสัตว์ที่ฆ่าคนเยอะที่สุดในโลก!', '500 คน/ปี'] as const;
export const POST_HANDLE = 'เที่ยวคนเดียว';
export const POST_SHARE_WORD = 'แชร์';
/** Brief colour key, post UI row: card white, text, accent (no brand). */
export const POST_UI = {bg: '#ffffff', text: '#1d2330', muted: '#7a8394', accent: '#2f7de1', line: '#e3e7ee', glow: '#f3f6fb'} as const;
export const SCREEN_W = 1170, SCREEN_H = 2532;

/** Share counts shown by the counter (CL04: it only rises): B02 ticks 0 -> 1.2K, B06 shows 58K and keeps ticking. */
export const SHARE_STEPS_B02 = [0, 3, 14, 52, 180, 460, 890, 1200] as const;
/** W5 (Boss, sheet item B4): crosses a thousand so the label visibly rises in B06-SH02 ("58K" -> "59K"): spread with `shareAt` from the
 * post settling at L14 over the rest of the shot (55 f), step 3 (59,000) lands at about L41. The old 58,000-58,600 stayed "58K". */
export const SHARE_STEPS_B06 = [58000, 58200, 58500, 59000, 59300, 59600] as const;
/** Counter label: under 1,000 as is, then one decimal K below 10K ("1.2K"), whole K above ("58K"). */
export const shareLabel = (n: number) => (n < 1000 ? String(Math.floor(n)) : n < 10000 ? `${(Math.floor(n / 100) / 10).toFixed(1).replace(/\.0$/, '')}K` : `${Math.floor(n / 1000)}K`);
/** Step value at shot-local `t` seconds for a list of steps spread over `dur` seconds (monotone: the counter only rises). */
export const shareAt = (steps: readonly number[], t: number, dur: number) => steps[Math.max(0, Math.min(steps.length - 1, Math.floor((t / dur) * steps.length)))];

/**
 * Bounding box of the "500 คน/ปี" caption line (logical screen units), measured in Chrome with getBBox on the rendered tspan (W5 probe,
 * `EDU18-W5-POST500`, Noto Sans Thai 800 at 86): the zoom state and the B06-SH03 push frame on it.
 */
export const POST_500_BOX = {x: 56, y: 1980, w: 376, h: 127.5} as const;
/** Share of the screen width the 500 line spans when zoomed (sheet SD11: at least 80 %). */
export const POST_ZOOM_SPAN = 0.86;
/** View box of the post screen at zoom `k` (0 = whole screen, 1 = crop on the 500 line at `POST_ZOOM_SPAN` of the width, same aspect). */
export const postViewBox = (k: number) => {
  const b = POST_500_BOX, u = Math.min(1, Math.max(0, k));
  const w1 = b.w / POST_ZOOM_SPAN, h1 = (w1 * SCREEN_H) / SCREEN_W;
  const x1 = Math.max(0, Math.min(SCREEN_W - w1, b.x + b.w / 2 - w1 / 2)), y1 = Math.max(0, Math.min(SCREEN_H - h1, b.y + b.h / 2 - h1 / 2));
  const L = (a: number, z: number) => a + (z - a) * u;
  return {x: L(0, x1), y: L(0, y1), w: L(SCREEN_W, w1), h: L(SCREEN_H, h1)};
};

/**
 * The post screen (logical 1170 x 2532, scaled to `width` x `height`). `photo` is an image URL (the B02-SH01 freeze still) or absent for the placeholder.
 * W5 (Boss, sheet items B3, B02-SH02): `zoom` 0..1 crops the view box onto the "500 คน/ปี" line (`postViewBox`; B06-SH03 -> SH05 hold 1);
 * `rise` 0..1 slides the post card (header, photo, actions, caption) up into place after the send tap (B02-SH02 L4-10; default 1 = in place).
 */
/** The photo slot shows the 1080 x 1920 freeze still's square from this frame y (B02-SH01 L29: her head top is at about y 399). */
export const POST_PHOTO_TOP = 300;
export const PostScreen = ({shares, width, height, photo, zoom = 0, rise = 1}: {shares: number; width: number; height: number; photo?: string; zoom?: number; rise?: number}) => {
  const font = 'Noto Sans Thai, sans-serif', P = POST_UI, vb = postViewBox(zoom);
  const r = Math.min(1, Math.max(0, rise)), slide = (1 - r) ** 2 * 1400;   // ease-out: fast start, settles at r = 1
  return (
    <svg width={width} height={height} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} style={{display: 'block'}}>
      <rect width={SCREEN_W} height={SCREEN_H} fill={P.bg} />
      {/* Status strip: signal and battery shapes only, no digits. */}
      <g fill={P.text} opacity={0.8}>
        {[0, 1, 2, 3].map((i) => <rect key={i} x={930 + i * 22} y={86 - i * 10} width={14} height={20 + i * 10} rx={3} />)}
        <rect x={1030} y={70} width={70} height={36} rx={9} fill="none" stroke={P.text} strokeWidth={5} />
        <rect x={1037} y={77} width={46} height={22} rx={4} />
      </g>
      <g transform={`translate(0 ${slide})`} opacity={r < 1 ? 0.35 + 0.65 * r : 1}>
      {/* Header: avatar, handle, "just now", menu. */}
      <circle cx={120} cy={300} r={62} fill="#f0c68a" />
      <circle cx={120} cy={286} r={26} fill="#2a1e18" />
      <path d="M78 345 Q120 300 162 345 Z" fill="#c9b48a" />
      <text x={210} y={292} fontFamily={font} fontSize={54} fontWeight={700} fill={P.text}>{POST_HANDLE}</text>
      <text x={210} y={352} fontFamily={font} fontSize={38} fill={P.muted}>เมื่อสักครู่</text>
      {[0, 1, 2].map((i) => <circle key={i} cx={1040 + i * 26} cy={300} r={8} fill={P.text} />)}
      {/* Photo slot (square). */}
      {photo ? (
        <svg x={0} y={420} width={SCREEN_W} height={SCREEN_W} viewBox={`0 ${POST_PHOTO_TOP} 1080 1080`} preserveAspectRatio="xMidYMid slice">
          {/* Literal staticFile so the scene cache can discover the photo (render-inputs rejects a computed src); `photo` only switches it on. Same file as POST_PHOTO_SRC. */}
          <image href={staticFile('edu18/post-photo-B02-SH01-L29.png')} x={0} y={0} width={1080} height={1920} />
        </svg>
      ) : (
        <g>
          <defs>
            <linearGradient id="post18-sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#9ec4dd" />
              <stop offset="0.55" stopColor="#e8eef0" />
              <stop offset="0.56" stopColor="#6f7a66" />
              <stop offset="1" stopColor="#5c6656" />
            </linearGradient>
          </defs>
          <rect x={0} y={420} width={SCREEN_W} height={SCREEN_W} fill="url(#post18-sky)" />
          <ellipse cx={860} cy={1080} rx={120} ry={34} fill="#6c5f6a" />
          <circle cx={810} cy={1050} r={16} fill="#6c5f6a" /><circle cx={900} cy={1050} r={16} fill="#6c5f6a" />
          <circle cx={430} cy={1010} r={150} fill="#e8b98f" />
          <path d="M270 990 Q300 760 430 760 Q570 760 595 1000 L600 1300 L260 1300 Z" fill="#17130f" />
          <circle cx={430} cy={1015} r={128} fill="#e8b98f" />
          <path d="M240 1590 Q260 1260 430 1240 Q600 1260 620 1590 Z" fill="#c9b48a" />
        </g>
      )}
      {/* Action row: like and comment outlines (no counts), share icon + counter. */}
      <g fill="none" stroke={P.text} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round">
        <path d="M110 1690 C80 1650 40 1675 50 1715 C60 1750 110 1780 110 1780 C110 1780 160 1750 170 1715 C180 1675 140 1650 110 1690 Z" />
        <path d="M250 1660 h110 a28 28 0 0 1 28 28 v56 a28 28 0 0 1 -28 28 h-60 l-34 28 v-28 h-16 a28 28 0 0 1 -28 -28 v-56 a28 28 0 0 1 28 -28 Z" />
      </g>
      <g stroke={P.accent} strokeWidth={8} fill="none" strokeLinejoin="round" strokeLinecap="round">
        <path d="M470 1770 v-40 a50 50 0 0 1 50 -50 h40 M540 1650 l30 30 l-30 30" />
      </g>
      <text x={600} y={1745} fontFamily={font} fontSize={58} fontWeight={700} fill={P.accent}>{`${POST_SHARE_WORD} ${shareLabel(shares)}`}</text>
      <line x1={0} y1={1830} x2={SCREEN_W} y2={1830} stroke={P.line} strokeWidth={3} />
      {/* Caption, verbatim (two lines; the 500 starts line 2). */}
      <text fontFamily={font} fontSize={64} fontWeight={600} fill={P.text}>
        <tspan x={56} y={1950}>{POST_CAPTION_LINES[0]}</tspan>
        <tspan x={56} y={2070} fontSize={86} fontWeight={800} data-id="post-500">{POST_CAPTION_LINES[1]}</tspan>
      </text>
      </g>
      {/* Bottom bar: icon shapes only. */}
      <line x1={0} y1={2380} x2={SCREEN_W} y2={2380} stroke={P.line} strokeWidth={3} />
      <g fill="none" stroke={P.text} strokeWidth={7} opacity={0.75}>
        <path d="M150 2470 v-45 l45 -35 l45 35 v45 Z" />
        <circle cx={430} cy={2440} r={30} /><line x1={452} y1={2462} x2={478} y2={2488} />
        <rect x={650} y={2405} width={70} height={70} rx={16} /><line x1={685} y1={2422} x2={685} y2={2458} /><line x1={667} y1={2440} x2={703} y2={2440} />
        <circle cx={950} cy={2440} r={34} />
      </g>
    </svg>
  );
};

/**
 * The painted phone body (brief: 0.150 x 0.072 m), screen side toward the viewer, as a quad `c` = [top-left, top-right, bottom-right,
 * bottom-left] in px. Returns the screen quad inside the bezel, where the shot lays `PostScreen`.
 */
export const paintPhoneBody = (p: Painter, c: [Pt, Pt, Pt, Pt], seed = 8800, body = '#1f2326'): [Pt, Pt, Pt, Pt] => {
  const lerp2 = (a: Pt, b: Pt, u: number): Pt => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  const at = (u: number, v: number): Pt => lerp2(lerp2(c[0], c[1], u), lerp2(c[3], c[2], u), v);
  // Rounded outline: corners cut on a 0.09 x 0.045 radius in quad units.
  const r = 0.12, rv = r * 0.48, pts: Pt[] = [];
  const corner = (cu: number, cv: number, a0: number) => { for (let i = 0; i <= 4; i++) { const a = a0 + (i / 4) * (Math.PI / 2); pts.push(at(cu + r * Math.cos(a), cv + rv * Math.sin(a))); } };
  corner(1 - r, rv, -Math.PI / 2); corner(1 - r, 1 - rv, 0); corner(r, 1 - rv, Math.PI / 2); corner(r, rv, Math.PI);
  solid(p, seed, body, pts, 5);
  inkLine(p, seed + 1, pts, {weight: 1.0, curve: 0.1, color: mixColor(body, '#000000', 0.5)});
  const bu = 0.05, bv = bu * 0.48;
  const screen: [Pt, Pt, Pt, Pt] = [at(bu, bv), at(1 - bu, bv), at(1 - bu, 1 - bv), at(bu, 1 - bv)];
  solid(p, seed + 2, '#0c0e10', screen, 3);
  return screen;
};
