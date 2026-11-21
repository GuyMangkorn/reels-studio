import {ANIMALS as baseAnimals, ANIMAL_IDS as baseIds, ANIMAL_INFO as baseInfo} from './animals';

// Authoring catalog. The base renderer and its existing consumers keep their original catalog and cache inputs.
export const ANIMAL_IDS = [...baseIds, 'cat-gray-tabby-longhair'] as const;
export const ANIMALS = {
  ...baseAnimals,
  'cat-gray-tabby-longhair': {...baseAnimals['cat-gray-tabby'], soft: true, fluffy: true},
};
export const ANIMAL_INFO = {
  ...baseInfo,
  'cat-gray-tabby-longhair': {
    description: 'Long-haired gray tabby with green eyes, rounded locks and a pale ruff (0.25 m).',
    use: 'House cat in close views or profile loaf poses. EDU-EP32 Q5 coat, without episode dressing.',
  },
};
