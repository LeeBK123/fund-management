import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const compat = new FlatCompat({ baseDirectory: path.dirname(fileURLToPath(import.meta.url)), resolvePluginsRelativeTo: path.dirname(require.resolve('eslint-config-next')) });
const config = [{ ignores: ['.next/**', 'node_modules/**', '.local-work/**', '.test-build/**', 'next-env.d.ts'] }, ...compat.extends('next/core-web-vitals', 'next/typescript'), { files: ['tests/**/*.cjs','scripts/**/*.cjs'], rules: { '@typescript-eslint/no-require-imports': 'off' } }];
export default config;
