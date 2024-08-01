// @ts-check
const eslint = require('@eslint/js')
const tseslint = require('typescript-eslint')
const angular = require('angular-eslint')

const baseConfig = tseslint.config(
  {
    languageOptions: {
      parserOptions: {
        project: ['**/tsconfig.json', '**/e2e/tsconfig.json'],
      },
    },
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      // when ts strictNullChecks has been enabled, change this to strict-type-checked
      ...tseslint.configs.strict,
      ...angular.configs.tsRecommended,
      ...tseslint.configs.recommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'off',
        {
          accessibility: 'explicit',
        },
      ],
      '@typescript-eslint/member-delimiter-style': [
        'off',
        {
          multiline: {
            delimiter: 'none',
            requireLast: true,
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false,
          },
        },
      ],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/member-ordering': 'error',
      '@typescript-eslint/method-signature-style': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['strictCamelCase'],
        },
        {
          selector: 'variable',
          format: ['strictCamelCase', 'UPPER_CASE'],
        },
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
        },
        // TODO: parameter selector can be removed when account tree is removed.
        {
          selector: 'parameter',
          format: ['strictCamelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'forbid',
        },
        {
          selector: 'property',
          format: ['strictCamelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'forbid',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],
      '@typescript-eslint/no-this-alias': 'error',
      '@typescript-eslint/semi': ['off', null],
      '@typescript-eslint/type-annotation-spacing': 'off',
      'array-callback-return': ['error'],
      'import/no-unresolved': 'off',
      'import/order': 0,
      'new-parens': 'error',
      'newline-per-chained-call': 'error',
      'no-await-in-loop': 'error',
      'no-constant-binary-expression': 'error',
      'no-constructor-return': 'error',
      'no-duplicate-imports': ['error', { includeExports: true }],
      'no-extra-bind': 'error',
      'no-new-func': 'error',
      'no-return-await': 'error',
      'no-sequences': 'error',
      'no-sparse-arrays': 'error',
      'no-template-curly-in-string': 'error',
      'no-underscore-dangle': [
        'error',
        {
          allowAfterThis: true,
        },
      ],
      'prefer-object-spread': 'error',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended],
    rules: {},
  },
)

module.exports = [...baseConfig]
