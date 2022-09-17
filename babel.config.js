module.exports = {
  // 预设,用于编译es6语法
  // presets: ['@babel/preset-env'],
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage', //corejs的按需加载自动引入
        corejs: 3,
      },
    ],
  ],
}