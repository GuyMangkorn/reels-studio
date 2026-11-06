import {Painted} from './look';
import {paintDROP2, paintDROP3, paintANTW, paintFX, paintDROP4, paintEDGE} from './checks';

export {CHECK_FRAMES} from './checks';
export const CHK_EDGE = () => <Painted paint={paintEDGE} />;
export const CHK_DROP2 = () => <Painted paint={paintDROP2} />;
export const CHK_DROP3 = () => <Painted paint={paintDROP3} />;
export const CHK_DROP4 = () => <Painted paint={paintDROP4} />;
export const CHK_ANTW = () => <Painted paint={paintANTW} />;
export const CHK_FX = () => <Painted paint={paintFX} />;
