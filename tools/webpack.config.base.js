const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin({
  // filename: "[name].[contenthash].css",
  filename: "style.css",
  disable: process.env.NODE_ENV === "development"
});

module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(bower_components|node_modules)/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        loader: extractSass.extract({
          use: [{
            loader: "css-loader"
          }, {
            loader: "sass-loader"
          }],
          // use style-loader in development
          fallback: "style-loader"
        })
      }
    ],
  },
  plugins: [
    extractSass
  ],
  output: {
    libraryTarget: 'umd',
    library: 'hotel-maps',
  },
  resolve: {
    extensions: [
      '.js',
      '.scss'
    ],
  },
};
