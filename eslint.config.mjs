// @ts-check

import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

export default {
    files: ['**/*.ts', '***/*.tsx'],

    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended', // TypeScript recommended rules
        'plugin:@typescript-eslint/recommended-type-checked', // TypeScript recommended rules with type checking
        'prettier' // Make sure this is always last
    ],

    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: true,
        tsconfigRootDir: __dirname // Use __dirname for CommonJS
    },

    rules: {
        // Add or override rules here as needed
        '@typescript-eslint/no-unused-vars': 'warn', // Example: Warn on unused vars
        '@typescript-eslint/explicit-function-return-type': 'off', // Allow implicit return types
        '@typescript-eslint/no-explicit-any': 'warn', // Warn on using any type
        'no-useless-catch': 'off',
        quotes: ['error', 'single', { allowTemplateLiterals: true }]
    }
};

