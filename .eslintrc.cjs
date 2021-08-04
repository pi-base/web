const js = {
  env: {
    node: true,
    es6: true,
    'jest/globals': true,
  },
  plugins: ['jest', 'prettier'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  rules: {
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'prettier/prettier': 'error',
  },
}

const ts = {
  ...js,
  files: ['**/*.ts', '**/*.tsx'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: [...js.plugins, '@typescript-eslint'],
  extends: [
    ...js.extends,
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
}

const tsTest = {
  ...ts,
  files: ['**/*.test.ts', '**/*.test.tsx'],
  rules: {
    ...ts.rules,
    // Allow test matches to fail and cause an error in the test
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
}

module.exports = {
  ...js,
  // FIXME: don't ignore cypress files
  ignorePatterns: ['*.d.ts', '**/cypress/**/*.ts'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  overrides: [ts, tsTest],
}
