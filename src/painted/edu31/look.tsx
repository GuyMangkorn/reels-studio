import type {ReactNode} from 'react';
import {useCallback} from 'react';
import {AbsoluteFill, getInputProps, Img, staticFile} from 'remotion';
import {CAPTION_OUTLINE, channelLabelLook, defaultChrome} from '../../scenes/media';
import {Subtitles} from '../../scenes/Subtitles';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {LOOK_DEFS, type LookDef} from './looks';
import {onQuad, TagPlate, WorldTexts} from './overlay31';
import {CCTV_FILTER, CctvOverlay, crtLook, scan} from './screen31';

// EDU-EP31-SHORT W3 look layer (Film, 2026-11-21): one BrushCanvas per still; above it the camera-mapped CCTV-STILL-01 image (screen and
// prints, DF-20261031-painted-raster-card), English signage as DOM text mapped through the same camera, the screen layers (VD31-08: CCTV
// preset and CRT bezel, CSS approximations of the missing kit presets), the caption (edu outline, bottomEdgeY 1344) and the chrome with the
// reconstruction label (VD31-17, outside every screen layer). Props: {"caption": false} drops caption and chrome (also used to write
// CCTV-STILL-01 from LF02); {"guides": true} adds the caption band. Render: sh scripts/edu-series/ep31/short/render-looks.sh <version> [IDs]

const LABEL = 'แต่งเติมจากเรื่องจริง · ภาพและเสียงจำลอง ไม่ใช่ภาพจริง';

// VD31-08 screen presets (CCTV filter and overlay, CRT look, scanlines): one home in screen31.tsx since W5.2 batch 2 (moved unchanged).

const Still = ({id}: {id: string}) => {
  const look: LookDef = LOOK_DEFS[id]();
  const fn = useCallback(({brush, frame}: PaintContext) => look.paint(makePainter(brush, {t: 0, frame, fade: look.paper})), [look]);
  const props = getInputProps() as {caption?: boolean; guides?: boolean};
  const c = look.cam;
  const picture = (
    <>
      <BrushCanvas paint={fn} paper={look.paper} />
      <WorldTexts cam={c} texts={look.texts ?? []} />
      {(look.quads ?? []).map((q, i) => {
        const W = 800, H = 1000, pad = (q.border ?? 0) * W;
        return onQuad(c, q.corners, W, H, (
          <div style={{width: W, height: H, background: q.border ? '#f4f1ea' : '#000', padding: pad, boxSizing: 'border-box', boxShadow: q.border ? 'inset 0 0 0 2px rgba(0,0,0,0.12)' : undefined}}>
            <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: q.crt ? 40 : 0}}>
              <Img src={staticFile(q.src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: q.pos ?? '50% 50%', ...(q.crt ? crtLook : {})}} />
              {q.crt && <><div style={scan(0.28, 10)} /><div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(170,200,255,0.10) 30%, rgba(0,0,0,0.55) 100%)'}} /><div style={{position: 'absolute', left: '8%', top: '6%', width: '40%', height: '22%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.10), transparent 70%)'}} /></>}
              {q.border ? <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.10), transparent 40%)'}} /> : null}
            </div>
          </div>
        ), {}, `q${i}`);
      })}
    </>
  );
  return (
    <AbsoluteFill style={{background: look.paper}}>
      {look.layer === 'cctv' ? <AbsoluteFill style={{filter: CCTV_FILTER}}>{picture}</AbsoluteFill> : picture}
      {look.layer === 'cctv' && <CctvOverlay />}
      {(look.boxes ?? []).map((b, i) => (
        <div key={`b${i}`} style={{position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, border: '6px solid #d9e2f0', boxShadow: '0 6px 18px rgba(0,0,0,0.5)', overflow: 'hidden', background: '#000'}}>
          <Img src={staticFile(b.src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%'}} />
        </div>
      ))}
      {look.layer === 'studio' && <>
        {/* the 4:3 studio picture seen full frame through the CRT: scanlines, phosphor glow, curved bezel around x 22-1058, y 170-948 */}
        <div style={{position: 'absolute', left: 22, top: 170, width: 1036, height: 778, borderRadius: 60, overflow: 'hidden', pointerEvents: 'none'}}>
          <div style={scan(0.26, 8)} />
          <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(180,210,255,0.08) 40%, rgba(0,0,0,0.6) 100%)'}} />
        </div>
        <div style={{position: 'absolute', left: 22, top: 170, width: 1036, height: 778, borderRadius: 60, boxShadow: '0 0 0 1400px #2a2725, inset 0 0 40px rgba(0,0,0,0.8)'}} />
        <div style={{position: 'absolute', left: 120, right: 120, top: 1460, height: 120, background: 'repeating-linear-gradient(90deg, #1c1a19 0 10px, #34302d 10px 20px)', borderRadius: 10, opacity: 0.8}} />
      </>}
      {look.pool && <div style={{position: 'absolute', left: look.pool.x - look.pool.r, top: look.pool.y - look.pool.r, width: look.pool.r * 2, height: look.pool.r * 2, borderRadius: '50%', mixBlendMode: 'screen', background: `radial-gradient(circle, rgba(${look.pool.color},${look.pool.op}) 0%, rgba(${look.pool.color},${look.pool.op * 0.45}) 35%, transparent 70%)`}} />}
      {look.tag && <TagPlate tag={look.tag} />}
      {look.vignette ? <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 38%, transparent 42%, rgba(8,6,4,${look.vignette}) 100%)`}} /> : null}
      <Grain opacity={look.layer === 'cctv' ? 0.12 : 0.05} />
      {props.caption !== false && <>
        {look.caption && <Subtitles text={look.caption} style={{preset: 'outline', bottomEdgeY: 1344, ...CAPTION_OUTLINE}} />}
        <span lang="th" style={{position: 'absolute', top: 128, left: 120, fontSize: 22, fontFamily: 'Noto Sans Thai', ...channelLabelLook('outline', '#49445c')}}>{defaultChrome.channelLabel}</span>
        <span lang="th" style={{position: 'absolute', top: 160, left: 120, fontSize: 17, fontFamily: 'Noto Sans Thai', ...channelLabelLook('outline', '#49445c'), WebkitTextStroke: '4px #2b1a12'}}>{LABEL}</span>
      </>}
      {props.guides && <div style={{position: 'absolute', left: 0, right: 0, top: 860, height: 388, borderTop: '2px dashed rgba(255,255,255,0.75)', borderBottom: '2px dashed rgba(255,255,255,0.75)'}} />}
    </AbsoluteFill>
  );
};

export const LOOKS = Object.fromEntries(Object.keys(LOOK_DEFS).map((id) => [id, () => <Still id={id} />])) as Record<string, () => ReactNode>;
