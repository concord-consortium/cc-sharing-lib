/* global module:true, require:true __dirname */

const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    'sharing-lib': ["./src/index.ts"],
    'sharing-lib.min': ["./src/index.ts"],
  },

  output: {
    path: path.resolve(__dirname, "_bundles"),
    filename: "[name].js",
    libraryTarget: 'umd',
    library: 'SharingLib',
    umdNamedDefine: true
  },
  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".jsx"]
  },
  devtool: "source-map",
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
        options: {
          configFileName: "./tsconfig.json"}
        },
    ]
  },
  stats: {
    colors: true
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: true,
      include: /\.min\.js$/,
    })
  ]
};
