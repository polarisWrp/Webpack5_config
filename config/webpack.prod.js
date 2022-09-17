
const path = require('path')
const os = require('os')
const EslintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const PreLoadWebpackPlugin = require('@vue/preload-webpack-plugin')

// 引入内置压缩js插件
const TerserWebpackPlugin = require('terser-webpack-plugin')

const threads = os.cpus().length
console.log(threads, 2222222);


function getStyleLoader(pre) {
  return [
    MiniCssExtractPlugin.loader, //提取css成单独的文件
    'css-loader', //将css资源编译成commonjs的模块到js中
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            'postcss-preset-env',
          ],
        },
      },
    },
    pre
  ].filter(Boolean)
}

module.exports = {
  // 入口 (相对路径)
  entry: './src/main.js',
  // 输出
  output: {
    //所有文件的输出路径
    path: path.resolve(
      __dirname,
      '../dist'
    ),
    // 入口文件打包输出的文件名
    filename: 'static/js/[name].[contenthash:10].js',
    // 指定打包输出的其他文件名
    chunkFilename:
      'static/js/[name].chunk.[contenthash:10].js',
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
        oneOf: [
          {
            test: /\.css$/,
            use: getStyleLoader(),
          },
          {
            test: /\.less$/,
            // loader: xxx 单个loader写法
            // 多个loader使用use
            use: getStyleLoader(
              'less-loader'
            ),
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
            // exclude: /node_modules/,
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
    new MiniCssExtractPlugin({
      // 指定生成的文件导出目录
      filename:
        'static/css/[name].[contenthash:10].css',
      chunkFilename:
        'static/css/[name].chunk.[contenthash:10].css',
    }),
    new PreLoadWebpackPlugin({
      // rel: 'preload', // prefetch
      // as: 'script',
      rel: 'prefetch'
    }),
  ],
  // 此配置等价于直接在 plugins中配置
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin({
        parallel: threads, //开启多进程和设置进程数量
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation:
            ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              [
                'gifsicle',
                { interlaced: true },
              ],
              [
                'jpegtran',
                { progressive: true },
              ],
              [
                'optipng',
                {
                  optimizationLevel: 5,
                },
              ],
              [
                'svgo',
                {
                  plugins: [
                    'preset-defult',
                    'prefixIds',
                    {
                      name: 'sortAttrs',
                      params: {
                        xmlnsOrder:
                          'alphabetical',
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
    // 代码分割配置
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: {
      name: (entrypoint) =>
        `runtime~${entrypoint.name}.js`,
    },
  },
  // 模式
  mode: 'production',
  devtool: 'source-map',
}