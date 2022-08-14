module.exports = {
    env: {
        node: true,
        commonjs: true,
        es2021: true,
        cypress: true,
    },
    extends: [
        'eslint:recommended',
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        indent: [
            'error',
            4,
        ],
        'linebreak-style': [
            'error',
            'windows',
        ],
        quotes: [
            'error',
            'single',
        ],
        semi: [
            'error',
            'never',
        ],
    },
}
