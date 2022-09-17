
const path = require('path')
const os = require('os')
const EslintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const threads = os.cpus().length
module.exports = {
  // 入口 (相对路径)
  entry: './src/main.js',
  // 输出
  output: {
    //所有文件的输出路径; 开发模式不需要输出
    path: undefined,
    // 入口文件打包输出的文件名
    filename: 'static/js/[name].js',
    // 图片、字体等通过 type:asset 处理资源的命名方式
    assetModuleFilename:
      'static/media/[hash:10][ext][query]',
    // 1/自动清空上次打包的内容
    //原理，在打包前，将path整个目录内容清空，再进行打包
    clean: true,
  },
  // 加载器
  module: {
    rules: [
      {
        // 每个文件只能被一个loader处理
        oneOf: [
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader',
            ],
          },
          {
            test: /\.less$/,
            // loader: xxx 单个loader写法
            // 多个loader使用use
            use: [
              'style-loader',
              'css-loader',
              'less-loader', //将less编译成css
            ],
          },
          {
            test: /\.(png|jpe?g|svg)$/,
            type: 'asset', // 会转base64
            parser: {
              dataUrlCondition: {
                // 小于10kb的图片转base64
                // base64能够避免网络请求的方式下载图片，但是体积会变大一些
                maxSize: 10 * 1024,
              },
            },
            // generator: {
            //   // 指定输出图片名称
            //   // [hash][ext][query] 依次为 设置取hash前10位值，文件扩展名，文件路径？后的参数
            //   filename:
            //     'static/images/[hash:10][ext][query]',
            // },
          },
          {
            test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
            type: 'asset/resource',
            // generator: {
            //   // 输出名称
            //   filename:
            //     'static/fonts/[hash:10][ext][query]',
            // },
          },
          {
            test: /\.js$/,
            // 排除node_modules下的文件
            // exclude: /node_modules/,
            // 或者使用include,只处理指定目录下的文件
            include: path.resolve(
              __dirname,
              '../src'
            ),
            use: [
              {
                loader: 'thread-loader', //开启多进程
                options: {
                  works: threads, //进程数量
                },
              },
              {
                loader: 'babel-loader',
                // 预设独立出文件就是 babel.config.js
                options: {
                  // presets: ["@babel/preset-env"]
                  cacheDirectory: true, //开启bebel缓存
                  cacheCompression: false, //关闭缓存文件压缩
                  plugins: [
                    //减少代码体积
                    '@babel/plugin-transform-runtime',
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  },
  // 插件
  plugins: [
    new EslintPlugin({
      // 检测指定文件夹下的文件
      context: path.resolve(
        __dirname,
        '../src'
      ),
      exclude: 'node_modules', //这是默认值
      cache: true,
      cacheLocation: path.resolve(
        __dirname,
        '../node_modules/.cache/eslintcache'
      ),
      threads, //开启多进程和设置进程数量
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(
        __dirname,
        '../public/index.html'
      ),
    }),
  ],
  // 开发服务器: 不会输出资源，默认在内存中打包
  devServer: {
    host: 'localhost',
    port: '3000',
    open: true,
    hot: true, // HMR替换，默认开启
  },
  // 模式
  mode: 'development',
  devtool: 'cheap-module-source-map',
}