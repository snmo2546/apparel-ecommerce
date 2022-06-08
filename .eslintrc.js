module.exports = {
    'env': {
        'node': true,
        'es2021': true,
        'browser': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'rules': {
        'semi': ['error', 'never'],
        'quotes': ['error', 'single', { 'avoidEscape': true }]
    }
}
