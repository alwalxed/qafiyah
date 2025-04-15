import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const extendedConfigs = [...compat.extends('next/core-web-vitals', 'next/typescript')];

const eslintConfig = [
  ...extendedConfigs,
  {
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
];

export default eslintConfig;
