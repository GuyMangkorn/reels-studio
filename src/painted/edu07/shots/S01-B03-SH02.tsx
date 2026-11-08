import {paintMerge} from '../gw';
import {makeShot} from '../shot';

// S01-B03-SH02 (G578-751): 2017, the merger (L06). SET-GW: two neutron stars spiral in (separation 0.50 -> 0 over L0-144, accelerating), faint ripples every 12 f, the strong
// violet ripple ring leaves at L144 ("ชนกัน"), the merged star stays; no flash, burst, spikes or shock ring (W5.3 round 3 G1). No clock card: the story clock jumps unseen across B03-SH02/SH03.
export const shot = makeShot('S01-B03-SH02', {
  paper: '#05081a',
  paint: (p, L) => { paintMerge(p, L); },
});
