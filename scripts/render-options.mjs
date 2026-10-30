// Command-line options for scripts/render.mjs, kept apart so tests can check them without starting a render.
const GL = ['angle', 'egl', 'swiftshader', 'swangle', 'vulkan', 'angle-egl'];

export const parseRenderArgs = argv => {
  const value = name => argv.find(arg => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
  const positive = name => {
    const raw = value(name);
    if (raw === undefined) return undefined;
    const number = Number(raw);
    if (!Number.isInteger(number) || number < 1) throw new Error(`--${name} needs a positive integer, got "${raw}"`);
    return number;
  };
  const gl = value('gl');
  if (gl !== undefined && !GL.includes(gl)) throw new Error(`--gl must be one of ${GL.join(', ')}; got "${gl}"`);
  return {
    ids: argv.filter(arg => !arg.startsWith('--')),
    stills: argv.includes('--stills'),
    frames: (value('frames') ?? '90,210,330,450,570').split(',').map(Number),
    endings: value('endings')?.split(','),
    gl,
    timeoutInMilliseconds: positive('timeout'),
    concurrency: positive('concurrency') ?? 4,
  };
};

// Without --endings, render only the ending the episode registry selected (VideoDefinition.ending, passed as a default prop).
export const endingsFor = (requested, defaultProps) => requested ?? [defaultProps?.ending ?? 'A_fade'];
