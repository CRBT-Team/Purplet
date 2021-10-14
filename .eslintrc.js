/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    // i find these anoying because they underline stuff while youre making it.
    // TODO: set this using a dynamic variable so we can run these checks at
    //       build time but not in the ide.
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-unused-vars': 'off',

    // change some errors to warnings
    'prefer-const': 'warn',

    // reduce checking
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-undef': 'off',
  },
};
