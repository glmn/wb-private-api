module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': false,
    'func-names': false,
    'no-async-promise-executor': false,
    'no-use-before-define': false
  },
};
