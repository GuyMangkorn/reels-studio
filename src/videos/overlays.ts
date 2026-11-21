import type {ComponentType} from 'react';
import {WendigoChrome} from './wendigo/chrome';
import {CoverOverlay} from './cover-overlay';
import {Edu17Chrome} from './edu-ep17/chrome';
import {Edu20Chrome} from './edu-ep20/chrome';
import {Edu26Chrome} from './edu-ep26/chrome';
import {Edu31Chrome} from './edu-ep31/chrome';
import {Edu32Chrome} from './edu-ep32/chrome';

/**
 * Episode chrome layers by name (`VideoDefinition.overlay`). A name, not a component, because composition props are
 * serialised between the bundle and the renderer and a function does not survive that. One entry per episode that
 * draws SVG chrome above its scenes on the composition clock.
 */
export const overlays: Readonly<Record<string, ComponentType<any>>> = {wendigo: WendigoChrome, covers: CoverOverlay, edu17: Edu17Chrome, edu20: Edu20Chrome, edu26: Edu26Chrome, edu31: Edu31Chrome, edu32: Edu32Chrome};
