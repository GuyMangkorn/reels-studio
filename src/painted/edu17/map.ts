// EDU-EP17 baked map data (N2) with types. Source and credit: NOTICE.md beside the JSON files; bake: scripts/edu17/bake-map.py.
// Coordinates are flat [lon, lat, lon, lat, ...] arrays in degrees; rings are closed implicitly.
import l0 from './map-l0.json';
import l1 from './map-l1.json';
import l2 from './map-l2.json';
import landuse from './map-landuse.json';

export type Flat = number[];
export type L0 = {id: string; rings: {pole?: -1 | 1; xy: Flat}[]};
export type L1 = {id: string; window: [number, number, number, number]; thailandExtent: {lon: [number, number]; lat: [number, number]}; land: Flat[]; thailand: Flat[]; adm0Lines: Flat[]; thaiAdm1: Flat[]; rivers: {name: string | null; xy: Flat}[]};
export type District = {id: number; nameEn: string; nameTh: string; province: 'bangkok' | 'nonthaburi'; areaKm2: number; centroid: [number, number]; ring: Flat};
export type Province = {id: 'bangkok' | 'nonthaburi'; osmRelation: number; closed: boolean; areaKm2: number; bbox: {lon: [number, number]; lat: [number, number]}; ring: Flat};
export type L2 = {
  id: string; osmExtract: string; coastWindow: [number, number, number, number];
  areasKm2: {bangkok: number; nonthaburi: number; sum: number; bangkokKhetSum: number; nonthaburiAmphoeSum: number; neBangkok: number; neNonthaburi: number};
  anchors: Record<string, {lat: number; lon: number; inBangkok: boolean; inNonthaburi: boolean}>;
  provinces: Province[]; districts: District[]; districtLines: Flat[];
  roads: {class: string; ref: string; xy: Flat}[]; rivers: {name: string; xy: Flat}[]; canals: {name: string; xy: Flat}[];
  coast: Flat[]; coastLines: Flat[];
};

export const MAP_L0 = l0 as unknown as L0;
export const MAP_L1 = l1 as unknown as L1;
export const MAP_L2 = l2 as unknown as L2;
/** Built-up land use (OSM residential, commercial, industrial, retail) inside Bangkok and Nonthaburi, baked by scripts/edu17/bake-landuse.py (fix pass B, B-MR1). Rings largest first. */
export type Landuse = {id: string; osmExtract: string; builtUpKm2: number; rings: Flat[]};
export const MAP_LANDUSE = landuse as unknown as Landuse;
export const province = (id: 'bangkok' | 'nonthaburi') => MAP_L2.provinces.find((p) => p.id === id)!;
export const districtsOf = (id: 'bangkok' | 'nonthaburi') => MAP_L2.districts.filter((d) => d.province === id);
export const CREDIT = '© OpenStreetMap contributors';
