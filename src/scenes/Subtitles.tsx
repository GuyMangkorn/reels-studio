import {loadFont} from '@remotion/fonts';
import {staticFile, useVideoConfig} from 'remotion';
loadFont({family: 'Noto Sans Thai', url: staticFile('fonts/NotoSansThai.ttf'), weight: '100 900'});
export const Subtitles = ({text}: {text: string}) => {
  const {width, height} = useVideoConfig(); const portrait = height > width;
  return <div lang="th" style={{position: 'absolute', bottom: portrait ? 134 : 58, left: '6%', width: '88%', textAlign: 'center', fontFamily: 'Noto Sans Thai', fontWeight: 700, fontSize: portrait ? 51 : 44, lineHeight: 1.65, color: '#fff', WebkitTextStroke: '7px #3d3c53', paintOrder: 'stroke fill', overflowWrap: 'anywhere', textShadow: '0 4px 0 #3d3c53'}}>{text}</div>;
};
