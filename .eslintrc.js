module.exports = {
  // 继承其他规则
  extends: ['eslint:recommended'],
  env: {
    node: true, //启用node中全局变量
    browser: true, //启用浏览器中全局变量
  },
  //解析选项
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  // 具体检查规则
  rules: {
    'no-var': 2, //禁止使用var定义变量
  },
  // 支持动态导入语法
  plugins: ['import'],
}
