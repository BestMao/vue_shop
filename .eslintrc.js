module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: ["plugin:vue/essential", "@vue/standard"],

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-debugger': 0,
    'space-before-function-paren': 0,
    'no-tabs': 'off'
  },

  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ]
};
