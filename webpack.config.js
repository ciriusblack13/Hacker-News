const path = require("path");

module.exports = {
  entry: "./src/assets/js/script.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
  resolve: {
    alias: {
      lodash: path.resolve(__dirname, "node_modules/lodash"),
    },
    fallback: {
      path: require.resolve("path-browserify"),
      os: require.resolve("os-browserify/browser"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer/")
    },
  },
  devServer: {
    contentBase: "./dist",
    hot: true,
  },
};
