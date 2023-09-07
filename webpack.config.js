const currentTask = process.env.npm_lifecycle_event
const path = require("path")

const postCSSPlugins = [
  "postcss-import",
  "postcss-mixins",
  "postcss-simple-vars",
  "postcss-nested",
  "autoprefixer",
]

let config = {
  entry: "./app/assets/scripts/App.js",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          "style-loader",
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
      },
    ],
  },
}

if (currentTask == "dev") {
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
  config.output = {
    filename: "bundled.js",
    path: path.resolve(__dirname, "dist"),
  }
  config.mode = "production"
}

module.exports = config
