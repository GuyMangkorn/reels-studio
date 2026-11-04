import {loadFont} from '@remotion/fonts';
import {staticFile, useVideoConfig} from 'remotion';
import {defaultCaptionStyle, outlineLook} from './media';
import type {CaptionStyle} from './types';
loadFont({family: 'Noto Sans Thai', url: staticFile('fonts/NotoSansThai.ttf'), weight: '100 900'});
export const Subtitles = ({text, style}: {text: string; style?: CaptionStyle}) => {
  const {width, height} = useVideoConfig(); const portrait = height > width;
  const {preset, position, bottomEdgeY, color, scale} = {...defaultCaptionStyle, ...style};
  if (preset === 'none' || !text) return null;
  const place = bottomEdgeY !== undefined ? {bottom: height - bottomEdgeY} : position === 'top' ? {top: height * (portrait ? .2 : .1)} : position === 'middle' ? {top: '50%', transform: 'translateY(-50%)'} : position === 'lower' ? {bottom: height * (1 - 1240 / 1920)} : {bottom: portrait ? 134 : 58};
  const look = preset === 'box'
    ? {color, background: 'rgba(16, 16, 24, .72)', borderRadius: 18, padding: portrait ? '10px 28px' : '6px 22px', boxDecorationBreak: 'clone' as const, WebkitBoxDecorationBreak: 'clone' as const}
    : {color, ...outlineLook(style)};
  return <div lang="th" style={{position: 'absolute', ...place, left: '6%', width: '88%', textAlign: 'center', fontFamily: 'Noto Sans Thai', fontWeight: 700, fontSize: (portrait ? 51 : 44) * scale, lineHeight: 1.65, overflowWrap: 'anywhere', whiteSpace: 'pre-line'}}><span style={look}>{text}</span></div>;
};
