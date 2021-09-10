const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = (env, args) => ({
  mode: args.mode === 'development' ? 'development' : 'production',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },
  devServer: {
    open: true,
    static: path.resolve(__dirname, 'dist'),
    port: 6969,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: 'index.html',
      filename: 'index.html',
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
});
