// Command-line options for scripts/render.mjs, kept apart so tests can check them without starting a render.
const GL = ['angle', 'egl', 'swiftshader', 'swangle', 'vulkan', 'angle-egl'];

const parseRange = raw => {
  if (raw === undefined) return undefined;
  const match = /^(\d+)-(\d+)$/.exec(raw);
  if (!match || Number(match[1]) > Number(match[2])) throw new Error(`--range needs <from>-<to> frames with from <= to, got "${raw}"`);
  return [Number(match[1]), Number(match[2])];
};

export const parseRenderArgs = argv => {
  const value = name => argv.find(arg => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
  const positive = name => {
    const raw = value(name);
    if (raw === undefined) return undefined;
    const number = Number(raw);
    if (!Number.isInteger(number) || number < 1) throw new Error(`--${name} needs a positive integer, got "${raw}"`);
    return number;
  };
  const gl = value('gl') ?? 'angle';
  if (gl !== undefined && !GL.includes(gl)) throw new Error(`--gl must be one of ${GL.join(', ')}; got "${gl}"`);
  return {
    ids: argv.filter(arg => !arg.startsWith('--')),
    stills: argv.includes('--stills'),
    // Cover candidates only (`<id>-COVERS` stills into out/<id>/covers/), for a deliverable rendered earlier; no video, no archive.
    covers: argv.includes('--covers'),
    frames: (value('frames') ?? '90,210,330,450,570').split(',').map(Number),
    endings: value('endings')?.split(','),
    gl,
    timeoutInMilliseconds: positive('timeout'),
    concurrency: positive('concurrency') ?? 4,
    // Quick look: half-size output and p5.brush canvas, written to out/<id>/preview/ and not archived.
    preview: argv.includes('--preview'),
    // Blocking draft: textured fills become flat washes and hatching is off (BrushCanvas `paintDraft`); full size, cached.
    draft: argv.includes('--draft'),
    // Pinned finals (scripts/pin.mjs) whose inputs changed: keep the approved segments, or render these again (unpins them).
    keepPinned: argv.includes('--keep-pinned'),
    repaint: value('repaint')?.split(',').filter(Boolean) ?? [],
    // Render every scene again instead of reusing cached scene segments (scripts/segments.mjs).
    noCache: argv.includes('--no-cache'),
    // Video frame range [from, to] (inclusive), e.g. --range=300-599; written to out/<id>/range/, not archived.
    range: parseRange(value('range')),
  };
};

// Without --endings, render only the ending the episode registry selected (VideoDefinition.ending, passed as a default prop).
export const endingsFor = (requested, defaultProps) => requested ?? [defaultProps?.ending ?? 'A_fade'];
