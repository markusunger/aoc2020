module.exports = {
    env: {
        es6: true,
        node: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['tsconfig.json'],
        sourceType: 'module',
        ecmaVersion: 2018,
    },
    extends: [
        'plugin:jest/recommended',
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'airbnb-base',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
        'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    plugins: [
        '@typescript-eslint',
        '@typescript-eslint/tslint',
        'import',
        'prefer-arrow',
        'jest',
    ],
};
