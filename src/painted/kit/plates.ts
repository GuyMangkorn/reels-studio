// Plate gallery index (ENV phase 2, docs/superpowers/specs/2026-11-03-environment-kit-design.md#plate-gallery-phase-2):
// one entry per finished set from a delivered episode, for reference before a look frame. Never a default, no reuse
// requirement. Agents filter this table (grep or `findPlates`) and only then look at the stills: the KIT-PLATES sheet or
// the store files projects/KIT/plates/<id>.png. Stills render from the registered shot at `t` (no captions) with
// `npx tsx scripts/painted-kit/plates.ts`. Add an entry when an episode is delivered.

export type PlateKind = 'interior' | 'exterior' | 'vehicle' | 'underwater' | 'sea' | 'diagram';
export type PlateTime = 'dawn' | 'day' | 'dusk' | 'night' | 'lamp-lit' | 'unlit';

export type PlateEntry = {
  /** `PL-<EPISODE>-<SET>`. */
  id: string;
  /** Project code in the asset store (EG, HANAKO, KSO, ...). */
  episode: string;
  /** One line: what the set is. */
  title: string;
  kind: PlateKind;
  time: PlateTime;
  /** Short mood tags (eerie, lonely, warm, clinical ...). */
  mood: string[];
  /** Dominant colours, darkest first (suggested by the plates script from the still). */
  palette: string[];
  /** ENV layers the set uses or would take (ENV-SKY, ENV-FALL:snow, ENV-FOG, ENV-GLOW, ENV-SEA). */
  kitLayers: string[];
  /** Registered painted shot (src/painted/registry.ts) that paints the set. */
  shot: string;
  /** Shot-local seconds of the still. */
  t: number;
};

export const plateStill = (id: string) => `projects/KIT/plates/${id}.png`;

export const PLATES: PlateEntry[] = [
  {id: 'PL-EG-STORE-FRONT', episode: 'EG', title: 'Convenience store front, empty forecourt, grey daylight', kind: 'exterior', time: 'day', mood: ['empty', 'eerie', 'flat'], palette: ['#8d8182', '#8c979c', '#97a0a5', '#c0bfb6', '#d4d5cc'], kitLayers: ['ENV-SKY'], shot: 'EG-S01-B01-SH01', t: 1.5},
  {id: 'PL-EG-COUNTER', episode: 'EG', title: 'Store counter, a drink left steaming, nobody behind it', kind: 'interior', time: 'day', mood: ['empty', 'still'], palette: ['#9ca6aa', '#b3b8b8', '#b8bfbe', '#c2c6c1', '#e4e6e3'], kitLayers: [], shot: 'EG-S01-B03-SH01', t: 1.5},
  {id: 'PL-EG-STORE-INSIDE', episode: 'EG', title: 'Inside the store from the doors: shelves, gates, no staff', kind: 'interior', time: 'day', mood: ['empty', 'clinical'], palette: ['#a17f78', '#9ca6aa', '#b7b6b0', '#c9c6bc', '#dad8cf'], kitLayers: [], shot: 'EG-S02-B01-SH01', t: 1.5},
  {id: 'PL-HANAKO-STALL-3', episode: 'HANAKO', title: 'School restroom, third stall door, close', kind: 'interior', time: 'unlit', mood: ['eerie', 'cold'], palette: ['#182525', '#314342', '#65786f', '#73887e', '#85998e'], kitLayers: [], shot: 'HANAKO-B01-SH01', t: 1.5},
  {id: 'PL-HANAKO-STALLS', episode: 'HANAKO', title: 'Restroom stall row in the dark', kind: 'interior', time: 'unlit', mood: ['eerie', 'lonely'], palette: ['#0f1b1e', '#213030', '#394b48', '#526862', '#72887c'], kitLayers: [], shot: 'HANAKO-B02-SH01', t: 1.5},
  {id: 'PL-HANAKO-CABINET', episode: 'HANAKO', title: 'Classroom cabinet, a hand at the drawer', kind: 'interior', time: 'unlit', mood: ['tense', 'cold'], palette: ['#162325', '#1a282b', '#2c4041', '#596c69', '#798a7b'], kitLayers: [], shot: 'HANAKO-B05-SH01', t: 1.5},
  {id: 'PL-HANAKO-CLASSROOM', episode: 'HANAKO', title: 'Classroom at the blackboard, teacher and pupils', kind: 'interior', time: 'unlit', mood: ['cold', 'quiet'], palette: ['#172627', '#243838', '#415953', '#52655b', '#67786a'], kitLayers: [], shot: 'HANAKO-B07-SH01', t: 1.5},
  {id: 'PL-KSO-IZAKAYA', episode: 'KSO', title: 'Izakaya counter under paper lanterns, shopworker behind it', kind: 'interior', time: 'lamp-lit', mood: ['warm', 'intimate'], palette: ['#191512', '#3c2e23', '#5f4229', '#7e562f', '#c3a681'], kitLayers: ['ENV-GLOW'], shot: 'KSO-S01-B02-SH01', t: 1.5},
  {id: 'PL-KSO-STREET-LAMP', episode: 'KSO', title: 'Night street under one lamp cone, walker from behind', kind: 'exterior', time: 'night', mood: ['lonely', 'tense'], palette: ['#0b131e', '#121f31', '#2c323a', '#383c41', '#40474e'], kitLayers: ['ENV-FOG', 'ENV-GLOW'], shot: 'KSO-S02-B01-SH01', t: 1.5},
  {id: 'PL-KSO-DOORWAY', episode: 'KSO', title: 'Dark apartment doorway, a figure crouched under a beam', kind: 'interior', time: 'unlit', mood: ['hiding', 'dread'], palette: ['#0a121a', '#101a28', '#152233', '#1f3042', '#52565b'], kitLayers: [], shot: 'KSO-S03-B02-SH01', t: 1.5},
  {id: 'PL-SHIPWRECK-SEABED', episode: 'SHIPWRECK', title: 'Seabed with scattered amphorae under light shafts', kind: 'underwater', time: 'day', mood: ['calm', 'ancient'], palette: ['#23322f', '#3a483f', '#4d6762', '#5e746a', '#61887f'], kitLayers: ['ENV-SEA'], shot: 'SHIPWRECK-SH01', t: 1.5},
  {id: 'PL-SHIPWRECK-STORM', episode: 'SHIPWRECK', title: 'Ship in a night storm, driving rain', kind: 'sea', time: 'night', mood: ['violent', 'doomed'], palette: ['#1d2a34', '#26343e', '#323e49', '#3b4652', '#4e5862'], kitLayers: ['ENV-SEA', 'ENV-FALL:rain'], shot: 'SHIPWRECK-SH03a', t: 1.5},
  {id: 'PL-BLOOP-DEEP', episode: 'BLOOP', title: 'Deep ocean, a hydrophone hanging in sonar rings', kind: 'underwater', time: 'unlit', mood: ['vast', 'lonely'], palette: ['#101e2d', '#15283c', '#172b41', '#182d44', '#273b4d'], kitLayers: ['ENV-SEA'], shot: 'bloop-sh01', t: 1.5},
  {id: 'PL-WDG-TENT', episode: 'WDG', title: 'Tent interior at night under a hanging lantern', kind: 'interior', time: 'lamp-lit', mood: ['cold', 'isolated'], palette: ['#111d2c', '#1a2d44', '#2f4866', '#49698e', '#7187a1'], kitLayers: ['ENV-GLOW'], shot: 'WDG-LF-TENT', t: 1.5},
  {id: 'PL-WDG-SNOW-CLEARING', episode: 'WDG', title: 'Snow clearing at dawn from above, a ring of prints', kind: 'exterior', time: 'dawn', mood: ['cold', 'ominous'], palette: ['#121f2e', '#445a6e', '#678193', '#7c94a6', '#9bb0bf'], kitLayers: ['ENV-FALL:snow'], shot: 'WDG-LF-SNOW', t: 1.5},
  {id: 'PL-WDG-FOREST-NIGHT', episode: 'WDG', title: 'Snowy forest edge at night, a man with a lantern', kind: 'exterior', time: 'night', mood: ['cold', 'menacing'], palette: ['#060b11', '#223448', '#344657', '#495b6c', '#63717e'], kitLayers: ['ENV-FALL:snow', 'ENV-GLOW'], shot: 'WDG-S01-B03-SH01', t: 1.5},
  {id: 'PL-WDG-MIST-FOREST', episode: 'WDG', title: 'Pine forest in drifting mist', kind: 'exterior', time: 'day', mood: ['misty', 'ominous'], palette: ['#203141', '#2e3f51', '#405467', '#566d81', '#8097a9'], kitLayers: ['ENV-FOG'], shot: 'WDG-S02-B01-SH01', t: 1.5},
  {id: 'PL-WDG-PALISADE', episode: 'WDG', title: 'Fort palisade above a fog bank, 1879', kind: 'exterior', time: 'dusk', mood: ['historic', 'bleak'], palette: ['#231d17', '#352e26', '#554e44', '#787871', '#9ca09b'], kitLayers: ['ENV-FOG', 'ENV-SKY'], shot: 'WDG-S03-B01-SH01', t: 1.5},
  {id: 'PL-WFOG-CAR', episode: 'WFOG', title: 'Inside a car in fog, driver close', kind: 'vehicle', time: 'day', mood: ['claustrophobic', 'muted'], palette: ['#1e2224', '#303638', '#5a615c', '#747d6a', '#bca57d'], kitLayers: ['ENV-FOG'], shot: 'WFOG-S01-SH01', t: 1.5},
  {id: 'PL-WFOG-SHOP-INSIDE', episode: 'WFOG', title: 'Corner shop interior, fog pressing at the glass', kind: 'interior', time: 'day', mood: ['trapped', 'muted'], palette: ['#1d2324', '#2e3636', '#4f5654', '#656b65', '#908f81'], kitLayers: ['ENV-FOG'], shot: 'WFOG-S02-SH05', t: 1.5},
  {id: 'PL-WFOG-SHOP-DOORS', episode: 'WFOG', title: 'Shop glass front from inside, figures against the fog', kind: 'interior', time: 'day', mood: ['tense', 'muted'], palette: ['#202627', '#333b3d', '#5f6462', '#7d7e73', '#a19682'], kitLayers: ['ENV-FOG'], shot: 'WFOG-S04-SH01', t: 1.5},
  {id: 'PL-ZCPAINT-CORRIDOR', episode: 'ZCPAINT', title: 'Condo corridor in long perspective', kind: 'interior', time: 'lamp-lit', mood: ['uneasy', 'flat'], palette: ['#272c2a', '#2e4343', '#5a625b', '#8f8877', '#aba28e'], kitLayers: [], shot: 'ZCP-B01-SH01', t: 1.5},
  {id: 'PL-ZCPAINT-TOILET-DOOR', episode: 'ZCPAINT', title: 'Bathroom door, flat poster style', kind: 'interior', time: 'lamp-lit', mood: ['quiet', 'flat'], palette: ['#4e473c', '#7d715d', '#978a71', '#a9997d', '#c1b499'], kitLayers: [], shot: 'ZCP-B02-SH01-TH', t: 1.5},
  {id: 'PL-ZCPAINT-BATHROOM', episode: 'ZCPAINT', title: 'Bathroom with sink, toilet and stacked water bottles', kind: 'interior', time: 'lamp-lit', mood: ['domestic', 'tense'], palette: ['#49463f', '#6b5f50', '#a7a190', '#b3b1a1', '#cbd0c9'], kitLayers: [], shot: 'ZCP-B05-SH01-TH', t: 1.5},
  {id: 'PL-ZCPAINT-ROOM-NIGHT', episode: 'ZCPAINT', title: 'Dark condo room, a man sitting by the window', kind: 'interior', time: 'night', mood: ['hiding', 'exhausted'], palette: ['#1c1a18', '#5a5b56', '#858070', '#948b78', '#c1b8a9'], kitLayers: [], shot: 'ZCP-B09-SH01-TH', t: 1.5},
  {id: 'PL-ALV-SEA-DUSK', episode: 'ALV', title: 'Small boat on a flat sea at dusk', kind: 'sea', time: 'dusk', mood: ['vast', 'adrift'], palette: ['#7fa1b9', '#8fb2c8', '#a5c1d0', '#ced4d8', '#efd6bf'], kitLayers: ['ENV-SKY', 'ENV-SEA'], shot: 'alv-look-l1', t: 1.5},
  {id: 'PL-ALV-SEA-OVERCAST', episode: 'ALV', title: 'Small boat on a grey overcast sea in light rain', kind: 'sea', time: 'day', mood: ['bleak', 'adrift'], palette: ['#778aa1', '#8393a8', '#929fb3', '#a6a6ba', '#bab7c5'], kitLayers: ['ENV-SKY', 'ENV-SEA', 'ENV-FALL:rain'], shot: 'alv-look-l2', t: 1.5},
  {id: 'PL-EDU-KITCHEN', episode: 'EDU', title: 'Home kitchen with a wooden island, a cook in swim goggles chopping onions', kind: 'interior', time: 'day', mood: ['warm', 'comic', 'domestic'], palette: ['#82634a', '#a8845b', '#9e9c80', '#c2b495', '#eee1c6'], kitLayers: [], shot: 'EDU2-S01-B07-SH03', t: 1.333},
  {id: 'PL-EDU-FRIDGE', episode: 'EDU', title: 'Inside a fridge looking out at the cook holding an onion', kind: 'interior', time: 'lamp-lit', mood: ['cold', 'comic'], palette: ['#40332a', '#925b4a', '#a68565', '#ccbea5', '#e1dccc'], kitLayers: [], shot: 'EDU2-S01-B05-SH04', t: 0.533},
  {id: 'PL-EDU-ONION-CELLS', episode: 'EDU', title: 'Macro of onion cells releasing enzyme beads, flat science diagram', kind: 'diagram', time: 'day', mood: ['scientific', 'playful'], palette: ['#ccb16e', '#dcbd78', '#e1c995', '#e8d7aa', '#f2e5bf'], kitLayers: [], shot: 'EDU2-S01-B03-SH02', t: 1},
  {id: 'PL-EDU-EYE', episode: 'EDU', title: 'Extreme close-up of a brown eye with irritant gas curling up', kind: 'diagram', time: 'day', mood: ['intimate', 'scientific'], palette: ['#442d20', '#764c34', '#85563b', '#8c5b3d', '#9b6f56'], kitLayers: [], shot: 'EDU2-S01-B04-SH02', t: 1.667},
  {id: 'PL-EDU-STORE-LANES', episode: 'EDU', title: 'Supermarket checkout hall, three coloured lanes with shoppers queuing, a man in a blazer at the head of lane 1', kind: 'interior', time: 'day', mood: ['bright', 'busy', 'comic'], palette: ['#524d50', '#8c8a88', '#9fab8f', '#d5cba5', '#efe9d9'], kitLayers: [], shot: 'EDU4-S01-B01-SH01', t: 0.9},
  {id: 'PL-EDU-PLAN', episode: 'EDU', title: 'Paper plan-view diagram of the three lanes, dots hopping lane to lane, price-check sign and trolley icons', kind: 'diagram', time: 'day', mood: ['scientific', 'playful', 'paper'], palette: ['#878c85', '#d4ccb1', '#e6e4c1', '#f3ead7', '#f6edd9'], kitLayers: [], shot: 'EDU4-S01-B03-SH03', t: 2},
  {id: 'PL-EDU-MEMORY-BUBBLES', episode: 'EDU', title: 'Checkout hall in a pale memory wash, a hot thought bubble over the man, a cracked red stamp', kind: 'interior', time: 'day', mood: ['wistful', 'ironic'], palette: ['#3c3a41', '#885f63', '#9f8881', '#c2af93', '#ede7d9'], kitLayers: [], shot: 'EDU4-S01-B05-SH01', t: 2},
  {id: 'PL-EDU-PARK', episode: 'EDU', title: 'Sunny city-park lawn with a curving path and a golden-shower tree, an owner and a golden retriever with a red ball', kind: 'exterior', time: 'day', mood: ['sunny', 'warm', 'playful'], palette: ['#527642', '#739c46', '#8bb454', '#d2b655', '#c4cdcd'], kitLayers: ['ENV-SKY'], shot: 'EDU3-S01-B01-SH01', t: 1},
  {id: 'PL-EDU-PARK-DOGVIEW', episode: 'EDU', title: 'The same park seen with dog colour vision (red-green weak, muted): the red ball sinks into the grass', kind: 'exterior', time: 'day', mood: ['muted', 'scientific', 'playful'], palette: ['#6a6348', '#7a7352', '#9a9162', '#b6ab78', '#c8bc82'], kitLayers: ['ENV-SKY'], shot: 'EDU3-S01-B03-SH03', t: 3},
  {id: 'PL-EDU-ORBIT', episode: 'EDU', title: 'Low orbit: truss, gold handrail and airlock module over the Earth limb, a suited astronaut tethered, a crew mate at the hatch', kind: 'exterior', time: 'day', mood: ['vast', 'silent', 'tense'], palette: ['#05060d', '#162744', '#1b5596', '#446c9c', '#b2bdc8'], kitLayers: ['ENV-EARTH', 'ENV-GLITTER'], shot: 'EDU8-S01-B01-SH01', t: 0.5},
  {id: 'PL-EDU-RING-CLOSE', episode: 'EDU', title: 'Close on the helmet neck ring and blue lock collar, a glove on the latch, Earth glow behind', kind: 'exterior', time: 'day', mood: ['tense', 'close'], palette: ['#05060d', '#181d28', '#405b87', '#778aa3', '#acb4bf'], kitLayers: ['ENV-EARTH'], shot: 'EDU8-S01-B01-SH04', t: 0.8},
  {id: 'PL-EDU-CHAMBER-1966', episode: 'EDU', title: 'Sepia 1966 vacuum chamber: steel cylinder, porthole, gauge and cage lamps, a silver-suited technician from behind', kind: 'interior', time: 'lamp-lit', mood: ['historic', 'clinical', 'sepia'], palette: ['#3c3636', '#947e5c', '#998462', '#a08a68', '#b19a79'], kitLayers: [], shot: 'EDU8-S01-B03-SH03', t: 1},
  {id: 'PL-EDU-AIRLOCK', episode: 'EDU', title: 'Padded airlock cylinder with the hatch open onto the Earth, gauge and amber lamp, two suited figures', kind: 'interior', time: 'lamp-lit', mood: ['safe', 'cramped', 'relief'], palette: ['#8993a0', '#beb9af', '#c1cad5', '#c4cdd7', '#d6dce4'], kitLayers: ['ENV-EARTH', 'ENV-GLOW'], shot: 'EDU8-S01-B05-SH03', t: 1},
  {id: 'PL-EDU-LIFT-CAR', episode: 'EDU', title: 'Steel lift car from its open front: ceiling LED, floor display, side rail and bell panel, a woman in the middle', kind: 'vehicle', time: 'lamp-lit', mood: ['claustrophobic', 'clinical', 'tense'], palette: ['#393e46', '#58626b', '#717a82', '#889097', '#acadad'], kitLayers: [], shot: 'EDU11-S01-B01-SH01', t: 1},
  {id: 'PL-EDU-LIFT-SHAFT', episode: 'EDU', title: 'Cutaway of a tall lift shaft with guide rails, the glass car falling inside it past a lit landing, a floor-count dial in the corner', kind: 'diagram', time: 'unlit', mood: ['vast', 'vertical', 'clinical'], palette: ['#353638', '#4f4f4d', '#525658', '#878c92', '#c2c1bc'], kitLayers: [], shot: 'EDU11-S01-B01-SH02', t: 1},
  {id: 'PL-EDU-HALL-1854', episode: 'EDU', title: 'Sepia 1854 exhibition hall: iron-framed hall, a raised platform with a lift, showman and axeman, a crowd from behind', kind: 'interior', time: 'lamp-lit', mood: ['historic', 'sepia', 'theatrical'], palette: ['#34302b', '#564e45', '#8c8273', '#b5ad9c', '#d5d0c2'], kitLayers: [], shot: 'EDU11-S01-B04-SH02', t: 3.333},
  {id: 'PL-EDU-BRAKE-1854', episode: 'EDU', title: 'Sepia close on the 1854 safety brake: toothed rail, pawl catching, iron frame', kind: 'interior', time: 'lamp-lit', mood: ['historic', 'sepia', 'mechanical'], palette: ['#4f4b43', '#655e53', '#90887a', '#a69c8a', '#b6ae9c'], kitLayers: [], shot: 'EDU11-S01-B04-SH04', t: 0.833},
  {id: 'PL-EDU-STORE-1857', episode: 'EDU', title: 'Sepia 1857 department store: a cage lift rising past the shop floor with two passengers in period dress', kind: 'interior', time: 'lamp-lit', mood: ['historic', 'sepia', 'genteel'], palette: ['#48423c', '#847b6f', '#989082', '#b1a897', '#bfb8aa'], kitLayers: [], shot: 'EDU11-S01-B04-SH06', t: 2.4},
  {id: 'PL-EDU-JAWS', episode: 'EDU', title: 'Modern lift safety jaws clamping the guide rail, steel close-up with the floor-count dial', kind: 'diagram', time: 'unlit', mood: ['mechanical', 'clinical', 'safe'], palette: ['#272b2f', '#4c4f52', '#676d74', '#909ba5', '#c9cfd3'], kitLayers: [], shot: 'EDU11-S01-B05-SH03', t: 0.667},
];

export type PlateQuery = Partial<{episode: string; kind: PlateKind; time: PlateTime; mood: string; layer: string}>;

/** Entries matching every given field (`mood` and `layer` match one tag). */
export const findPlates = (q: PlateQuery): PlateEntry[] => PLATES.filter((p) =>
  (!q.episode || p.episode === q.episode) && (!q.kind || p.kind === q.kind) && (!q.time || p.time === q.time) &&
  (!q.mood || p.mood.includes(q.mood)) && (!q.layer || p.kitLayers.some((l) => l === q.layer || l.startsWith(`${q.layer}:`))));
