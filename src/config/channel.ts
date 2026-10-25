export const channel = {nameTh: 'ทำไมล่ะ', nameEn: 'TamMaiLa'} as const;
export type ChannelName = string | null | false;

/** Undefined inherits the channel default; explicit null/false hides the label. */
export function resolveChannelName(value?: ChannelName): string | null {
  return value === null || value === false ? null : (value ?? channel.nameTh);
}
