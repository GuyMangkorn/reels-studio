// `stamp` (screen layer, clock; kit effects, from EDU-EP08-SHORT N9, Boss pass B): a rubber-stamp label that slams in (scale `from` -> 1
// over `slam` frames, rotation fixed), holds, then fades. Pure functions of the frame since the shot start, so it seeks.
export const STAMP = {red: '#c8342b', from: 1.3, slam: 4, fade: 6, rot: -8, w: 300, h: 130};

export type StampTiming = {
  /** Shot-local frame the stamp lands (it is invisible before). */
  land: number;
  /** Frame the fade-out starts (omit to hold). */
  fadeAt?: number;
  /** Scale at the first frame and frames to settle (defaults 1.3 over 4 f, brief VD09). */
  from?: number; slam?: number; fade?: number;
};

/** Scale and opacity at frame `f`. The first frame is full strength at `from` (a hit, not a fade-in); opacity eases down over `fade` frames. */
export const stampState = (f: number, o: StampTiming): {scale: number; opacity: number; visible: boolean} => {
  const from = o.from ?? STAMP.from, slam = o.slam ?? STAMP.slam, fade = o.fade ?? STAMP.fade;
  if (f < o.land) return {scale: from, opacity: 0, visible: false};
  const u = Math.max(0, Math.min(1, (f - o.land) / Math.max(1, slam)));
  const e = 1 - (1 - u) * (1 - u); // ease-out: arrives fast
  const scale = from + (1 - from) * e;
  const down = o.fadeAt === undefined ? 1 : Math.max(0, Math.min(1, 1 - (f - o.fadeAt) / Math.max(1, fade)));
  return {scale, opacity: down, visible: down > 0};
};
