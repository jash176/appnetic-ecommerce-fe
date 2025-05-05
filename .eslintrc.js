module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    // Allow JSX in .tsx files
    'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
    
    // Suppress errors for missing 'import React' in files
    'react/react-in-jsx-scope': 'off',
    
    // Allow props spreading
    'react/jsx-props-no-spreading': 'off',
    
    // Warn instead of error for prop-types
    'react/prop-types': 'warn',

    // Turn off rules that TypeScript handles
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    
    // Allow empty functions
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    
    // Allow explicit any as sometimes it's necessary
    '@typescript-eslint/no-explicit-any': 'warn',
    
    // Allow non-null assertions when necessary
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
}; 