const HtmlWebpackPlugin = require('html-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

const pages = ['index', 'our-pets']

module.exports = {
  // entry: path.join(__dirname, 'src', 'index.js'),
  entry: pages.reduce((config, page) => {
    config[page] = path.join(__dirname, 'src', 'js', `${page}.js`)
    return config
  }, {}),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js',
    assetModuleFilename: 'images/[name][ext]',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: '../' },
          },
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    ...pages.map(
      page =>
        new HtmlWebpackPlugin({
          template: path.join(__dirname, 'src', `${page}.html`),
          filename: `${page}.html`,
          inject: true,
          chunks: [page],
        })
    ),
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: ['dist'],
        },
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    watchFiles: path.join(__dirname, 'src'),
    port: 9000,
  },
}
