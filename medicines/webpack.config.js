
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/medicines"),
    filename: "[name].js",
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",

        },
      },
      {
        test: /\.(css)$/,
        use: [
          'style-loader',
          'css-loader',


        ]
      },
    ],
  },
  optimization: {
    minimize: true,
  },

};