const webpack = require('webpack');
const path              = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const resolve = dir => path.join(__dirname, '../../', dir);

const env = process.env.NODE_ENV || 'development';
const isDev = env === 'development';

const WebpackDefinePluginConfig = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(env),
  },
});

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: resolve('client/index.html'),
  favicon: resolve('client/assets/icons/favicon.ico'),
  filename: 'index.html',
  inject: 'body',
});

module.exports = {
  devtool: 'source-map',
  entry: [
    resolve('client/styles/scss/index.scss'),
    resolve('client/assets/index.js'),
    resolve('client/index.tsx'),
  ],
  output: {
    filename: isDev ? '[name].js' : '[name].[fullhash].js',
    path: resolve('dist'),
    publicPath: '/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('client')],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        include: [resolve('client')],
      },
      {
        test: /\.module.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[folder]-[local]--[hash:base64:5]',
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.scss$/,
        use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.less$/,
        use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]',
        },
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'icons/[name][ext]',
        },
      },
      {
        test: /\.(woff(2)|ttf|eot|otf)?(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    HtmlWebpackPluginConfig,
    WebpackDefinePluginConfig,
  ],
  performance: {
    hints: false,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json']
  },
};
