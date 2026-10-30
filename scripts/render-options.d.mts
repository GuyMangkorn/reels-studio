export type RenderArgs = {
  ids: string[];
  stills: boolean;
  frames: number[];
  endings: string[] | undefined;
  gl: string | undefined;
  timeoutInMilliseconds: number | undefined;
  concurrency: number;
};
export declare const parseRenderArgs: (argv: string[]) => RenderArgs;
export declare const endingsFor: (requested: string[] | undefined, defaultProps: {ending?: string} | undefined) => string[];
