import {config} from '@remotion/eslint-config-flat';

export default [
  {ignores: ['node_modules/**', 'out/**', 'build/**']},
  ...config,
];
