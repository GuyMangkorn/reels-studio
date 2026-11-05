import type {ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {dogMatrixValues} from './dogview';

// Picture pass for the dog view (spike S1, brief VD05 option 1 in the episode module): an SVG `feColorMatrix` in linear RGB over the
// finished painted canvas, below every screen layer. Children are the painted picture ONLY; captions, the tag and chrome are siblings
// outside this wrapper, so they are never mapped. `u` 0 = normal (no filter), 1 = dog view. The strokes are the same pixels either way.
export const DogView = ({u, children, id = 'dogview'}: {u: number; children: ReactNode; id?: string}) => (
  <AbsoluteFill style={u > 0 ? {filter: `url(#${id})`} : undefined}>
    {u > 0 && (
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id={id} colorInterpolationFilters="linearRGB" x="0" y="0" width="100%" height="100%">
          <feColorMatrix type="matrix" values={dogMatrixValues(u)} />
        </filter>
      </svg>
    )}
    {children}
  </AbsoluteFill>
);
