import type {ComponentType} from 'react';
import {WendigoChrome} from './wendigo/chrome';
import {CoverOverlay} from './cover-overlay';

/**
 * Episode chrome layers by name (`VideoDefinition.overlay`). A name, not a component, because composition props are
 * serialised between the bundle and the renderer and a function does not survive that. One entry per episode that
 * draws SVG chrome above its scenes on the composition clock.
 */
export const overlays: Readonly<Record<string, ComponentType<any>>> = {wendigo: WendigoChrome, covers: CoverOverlay};
