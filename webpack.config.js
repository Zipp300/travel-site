const path = require('path')

// const postCSSPlugins = [
// require('postcss-import'),
// require('postcss-simple-vars'),
// require('postcss-nested'),
// require('autoprefixer')
// ]
// const postcssSimpleVars =  require('postcss-simple-vars')

const postCSSPlugins = [
  'postcss-import',
  'postcss-mixins',
  'postcss-simple-vars',
  'postcss-nested',
  'autoprefixer'
  ]


module.exports = {
  entry: './app/assets/scripts/App.js',
  output: {
    filename: 'bundled.js',
    path: path.resolve(__dirname, 'app')
  },
  devServer: {
    
    //contentBase: path.join(__dirname, 'app'),
    static: {directory: path.join(__dirname, "app")},
    hot: true,
    port: 3000,
    historyApiFallback: { index: "index.html" }
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', {loader: 'postcss-loader', options: {
              postcssOptions: {
                plugins: postCSSPlugins
              }
            }
          }
        ]
      }
    ]
  }
}