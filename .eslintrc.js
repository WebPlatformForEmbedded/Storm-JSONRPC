module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
      ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-mixed-spaces-and-tabs': 0,
        semi: [2, 'never'],
    // 'comma-dangle': ['error', 'always-multiline'],
    'no-extra-boolean-cast': 'off',
    "no-unused-vars": [
      1,
      {
        "ignoreSiblings": true,
        "argsIgnorePattern": "res|next|^err"
      }
    ],
     },
  parserOptions: {
    parser: 'babel-eslint',
     "ecmaVersion": 11,
    sourceType:"module",
  },
}