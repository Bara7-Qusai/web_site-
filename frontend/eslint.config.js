import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const restrict = (...patterns) => ({
  'no-restricted-imports': ['error', { patterns }],
});

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'playwright-report', 'test-results', 'src/shared/api/schema.d.ts']),
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  reactHooks.configs.flat.recommended,
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node },
  },

  // Module boundaries (docs/frontend.md). Features are independent of each other and of the
  // app shell; shared code knows nothing about features; the app shell reaches a feature only
  // through its public index.
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: restrict({
      group: ['@/features', '@/features/**', '@/app', '@/app/**'],
      message: 'Features must not import other features or the app shell. Compose them in src/app.',
    }),
  },
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: restrict({
      group: ['@/features', '@/features/**', '@/app', '@/app/**'],
      message: 'Shared code must not depend on features or the app shell.',
    }),
  },
  {
    files: ['src/app/**/*.{ts,tsx}'],
    rules: restrict({
      group: ['@/features/*/*'],
      message: "Import a feature through its public index only: '@/features/<name>'.",
    }),
  },
]);
