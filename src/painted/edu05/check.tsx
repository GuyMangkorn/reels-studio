import {Painted} from './look';
import {paintDROP2, paintDROP3, paintANTW, paintDRIFT, paintFAC, paintFX, paintSPECK, paintDROP4, paintEDGE, paintPOSES, paintCRUMB, paintPUFF, paintLIFT, paintLIFTOFF, paintLANDING} from './checks';

export {CHECK_FRAMES} from './checks';
export const CHK_EDGE = () => <Painted paint={paintEDGE} />;
export const CHK_DROP2 = () => <Painted paint={paintDROP2} />;
export const CHK_DROP3 = () => <Painted paint={paintDROP3} />;
export const CHK_DROP4 = () => <Painted paint={paintDROP4} />;
export const CHK_ANTW = () => <Painted paint={paintANTW} />;
export const CHK_FX = () => <Painted paint={paintFX} />;
export const CHK_FAC = () => <Painted paint={paintFAC} />;
export const CHK_SPECK = () => <Painted paint={paintSPECK} />;
export const CHK_DRIFT = () => <Painted paint={paintDRIFT} />;
export const CHK_POSES = () => <Painted paint={paintPOSES} />;
export const CHK_CRUMB = () => <Painted paint={paintCRUMB} />;
export const CHK_PUFF = () => <Painted paint={paintPUFF} />;
export const CHK_LIFT = () => <Painted paint={paintLIFT} />;
export const CHK_LIFTOFF = () => <Painted paint={paintLIFTOFF} />;
export const CHK_LANDING = () => <Painted paint={paintLANDING} />;
