// p5.brush ships no typings; only the standalone calls this repo uses are declared.
declare module 'p5.brush/standalone' {
  type Pt = [number, number];
  export function createCanvas(width: number, height: number, options?: {parent?: HTMLElement | string; pixelDensity?: number; id?: string}): HTMLCanvasElement;
  export function render(): void;
  export function clear(color?: string): void;
  export function seed(n: number): void;
  export function noiseSeed(n: number): void;
  export function scaleBrushes(scale: number): void;
  export function set(name: string, color: string, weight: number): void;
  export function stroke(color: string): void;
  export function strokeWeight(weight: number): void;
  export function noStroke(): void;
  export function fill(color: string, opacity?: number): void;
  export function noFill(): void;
  export function fillBleed(strength: number, direction?: 'in' | 'out', angle?: number): void;
  export function fillTexture(strength: number, border: number, scatter?: boolean, split?: number): void;
  export function wash(color: string, opacity?: number): void;
  export function noWash(): void;
  export function hatch(dist: number, angle: number, options?: Record<string, unknown>): void;
  export function noHatch(): void;
  export function hatchStyle(name: string, color: string, weight: number): void;
  export function line(x1: number, y1: number, x2: number, y2: number): void;
  export function rect(x: number, y: number, w: number, h: number, mode?: 'center' | 'corner'): void;
  export function circle(x: number, y: number, radius: number, irregularity?: number | boolean): void;
  export function polygon(points: Pt[]): unknown;
  export function spline(points: Pt[], curvature?: number): unknown;
  export function push(): void;
  export function pop(): void;
  export function translate(x: number, y: number): void;
  export function rotate(angle: number): void;
  export function scale(x: number, y?: number): void;
}
