import type {CharacterProps} from './Character';
/** Original period outfits share the existing nested human skeleton. */
export const costumes = {
  mrsH: {
    outfit: 'skirt',
    hairStyle: 'bun',
    skinColor: '#FFD9B8',
    shirtColor: '#FFF3B0',
    pantsColor: '#9C91B9',
    hairColor: '#6B4A3A',
    expression: 'neutral',
  },
  mrH: {
    outfit: 'vest',
    hairStyle: 'short',
    moustache: true,
    skinColor: '#FFD9B8',
    shirtColor: '#FFF3B0',
    pantsColor: '#7B889C',
    hairColor: '#6B4A3A',
    expression: 'neutral',
  },
  brotherH: {
    outfit: 'vest',
    hairStyle: 'bald',
    moustache: true,
    skinColor: '#FFD9B8',
    shirtColor: '#D7E9D2',
    pantsColor: '#9F817C',
    hairColor: '#89716B',
    expression: 'neutral',
  },
} satisfies Record<string, Partial<CharacterProps>>;
export type CostumeName = keyof typeof costumes;
