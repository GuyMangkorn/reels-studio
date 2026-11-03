type Metadata = {tool: string; ids: string[]; gl: string} & Record<string, unknown>;
export type RenderLog = {
  file: string;
  event: (event: string, details?: Record<string, unknown>) => void;
  time: <T>(stage: string, work: () => T | Promise<T>, details?: Record<string, unknown>) => Promise<T>;
  finish: (error?: unknown) => void;
};
export declare const createRenderLog: (metadata: Metadata, directory?: string) => RenderLog;
export declare const withRenderLog: <T>(metadata: Metadata, work: (log: RenderLog) => T | Promise<T>) => Promise<T>;
