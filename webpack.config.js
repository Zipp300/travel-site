const currentTask = process.env.npm_lifecycle_event
const path = require("path")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const fse = require("fs-extra")

const postCSSPlugins = [
  "postcss-import",
  "postcss-mixins",
  "postcss-simple-vars",
  "postcss-nested",
  "autoprefixer",
]

// * Create our own Webpack Plugin
class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap("Copy Images", function () {
      fse.copySync("app/assets/images", "dist/assets/images")
    })
  }
}

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

// * Crear una variable que sirva para cualquier Html file -> retorna un array
let pages = fse
  .readdirSync("./app")
  .filter(function (file) {
    return file.endsWith(".html")
  })
  .map(function (page) {
    //* Es un HtmlWebpackPlugin Plugin para cada Html page
    //* El html que se va a generar desde un "template" -> "dev" / "build"
    //* & Insertarle los Links apropiados a los Css y Js
    return new HtmlWebpackPlugin({
      filename: page,
      template: `./app/${page}`,
    })
  })

let config = {
  entry: "./app/assets/scripts/App.js",
  plugins: pages,
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
  // * Adding another Webpack Module rule
  config.module.rules.push({
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: {
      loader: "babel-loader",
      options: {
        presets: [["@babel/preset-env", { targets: { node: "16" } }]],
      },
    },
  })
  // * Extract el CSS out of the generate JS
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
  // * PlugIns adicionales para limpiar los bundles anteriores &
  // * Extraer el CSS y generar chunk Hash files
  config.plugins.push(
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: "styles.[chunkhash].css" }),
    new RunAfterCompile()
  )
}

module.exports = config
