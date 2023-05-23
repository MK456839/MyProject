const path = require("path");
var webpack = require('webpack')
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "app.js",
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }]),
    new webpack.LoaderOptionsPlugin({
      options: {
        mode: "development",
      }
    })
  ],
  devtool: "source-map",
  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader', 'sass-loader']
      }
    ],
    // loaders: [
    //   { test: /\.json$/, use: 'json-loader' },
    //   {
    //     test: /\.js$/,
    //     exclude: /(node_modules|bower_components)/,
    //     loader: 'babel-loader',
    //     query: {
    //       presets: ['es2015', 'env'],
    //       plugins: ['transform-react-jsx', 'transform-object-rest-spread', 'transform-runtime']
    //     }
    //   }
    // ]
  }
};