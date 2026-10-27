// Webpack's require.context, used by Root.tsx to discover episode registries in the Remotion bundle.
declare namespace NodeJS {
  interface Require {
    context(directory: string, useSubdirectories: boolean, regExp: RegExp): {keys(): string[]; (id: string): unknown};
  }
}
