type CompositionLike = {id?: string; width: number; height: number; fps: number; durationInFrames: number; props: {timeline: {durationSec: number}[]} & Record<string, unknown>};
export declare const sceneFrames: (seconds: number, fps: number) => number;
export declare const sceneRanges: (timeline: {durationSec: number}[], fps: number) => [number, number][];
export declare const segmentDir: (id: string) => string;
export declare const sourceHash: (root?: string, composition?: CompositionLike, inputProps?: Record<string, unknown>) => string | null;
export declare const segmentKeys: (composition: CompositionLike, inputProps: Record<string, unknown>, options: Record<string, unknown>, source: string) => string[];
export declare const scenesInRange: (ranges: number[][], range: number[]) => number[];
export type Pin = {key: string; range: number[]; shots: string[]; pinnedAt?: string};
export declare const pinsFile: (id: string) => string;
export declare const manifestFile: (id: string) => string;
export declare const readJson: <T>(file: string, fallback: T) => Promise<T>;
export declare const variantOf: (composition: CompositionLike, inputProps: Record<string, unknown>) => string;
export declare const unpinnedScenes: (pins: Record<string | number, Pin> | undefined, sceneCount: number) => number[];
export declare const applyPins: (pins: Record<string | number, Pin> | undefined, picked: number[], keys: string[], options?: {keep?: boolean; repaint?: string[]}) =>
  {use: string[]; changed: {scene: number; shots: string[]; range: number[]}[]; unpin: number[]; kept: number[]};
export declare const ffmpeg: (args: string[]) => void;
