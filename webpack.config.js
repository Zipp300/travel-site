const currentTask = process.env.npm_lifecycle_event
const path = require("path")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const postCSSPlugins = [
  "postcss-import",
  "postcss-mixins",
  "postcss-simple-vars",
  "postcss-nested",
  "autoprefixer",
]

let cssConfig = {
  test: /\.css$/i,
  use: [
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: postCSSPlugins,
        },
      },
    },
  ],
}

let config = {
  entry: "./app/assets/scripts/App.js",
  module: {
    rules: [cssConfig],
  },
}

if (currentTask == "dev") {
  cssConfig.use.unshift("style-loader")
  config.output = {
    filename: "bundled.js",
    path: path.resolve(__dirname, "app"),
  }
  config.devServer = {
    static: { directory: path.join(__dirname, "app") },
    hot: true,
    port: 3000,
    // host: "0.0.0.0",
    historyApiFallback: { index: "index.html" },
  }
  config.mode = "development"
}
if (currentTask == "build") {
  cssConfig.use.unshift(MiniCssExtractPlugin.loader)
  // * El CSS resultante de los PostCSS plugIns se comprime al final
  postCSSPlugins.push("cssnano")
  config.output = {
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "dist"),
  }
  config.mode = "production"
  config.optimization = {
    splitChunks: { chunks: "all" },
  }
  config.plugins = [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: "styles.[chunkhash].css" }),
  ]
}

module.exports = config
