type CompositionLike = {id?: string; width: number; height: number; fps: number; durationInFrames: number; props: {timeline: {durationSec: number}[]} & Record<string, unknown>};
export declare const sceneFrames: (seconds: number, fps: number) => number;
export declare const sceneRanges: (timeline: {durationSec: number}[], fps: number) => [number, number][];
export declare const segmentDir: (id: string) => string;
export declare const sourceHash: (root?: string) => string;
export declare const segmentKeys: (composition: CompositionLike, inputProps: Record<string, unknown>, options: Record<string, unknown>, source: string) => string[];
