import {resolveChannelName, type ChannelName} from '../config/channel';
import {captionLayout} from './captionLayout';

type FooterProps = {
  width: number;
  height: number;
  index: number;
  total: number;
  progress: number;
  night: boolean;
  channelName?: ChannelName;
};
export const Footer = ({
  width,
  height,
  index,
  total,
  progress,
  night,
  channelName,
}: FooterProps) => {
  const label = resolveChannelName(channelName);
  const layout = captionLayout(width, height);
  return (
    <div
      data-footer
      style={{
        position: 'absolute',
        bottom: layout.footerBottom,
        height: layout.footerHeight,
        left: width * 0.075,
        right: width * 0.075,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {Array.from({length: total}, (_, i) => (
        <div
          key={i}
          style={{
            height: 4,
            flex: 1,
            borderRadius: 8,
            background: night ? '#ffffff25' : '#49445c20',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${i < index ? 100 : i === index ? Math.max(0, Math.min(1, progress)) * 100 : 0}%`,
              background: night ? '#ffe0a8' : '#77718f',
            }}
          />
        </div>
      ))}
      {label && (
        <span
          data-channel-label
          title={label}
          lang="th"
          style={{
            fontSize: 24,
            lineHeight: `${layout.footerHeight}px`,
            color: night ? '#fff1da' : '#49445c',
            maxWidth: '30%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};
