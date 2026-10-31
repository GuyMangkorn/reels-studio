export type RenderArgs = {
  ids: string[];
  stills: boolean;
  frames: number[];
  endings: string[] | undefined;
  gl: string | undefined;
  timeoutInMilliseconds: number | undefined;
  concurrency: number;
  preview: boolean;
  draft: boolean;
  keepPinned: boolean;
  repaint: string[];
  noCache: boolean;
  range: [number, number] | undefined;
};
export declare const parseRenderArgs: (argv: string[]) => RenderArgs;
export declare const endingsFor: (requested: string[] | undefined, defaultProps: {ending?: string} | undefined) => string[];
