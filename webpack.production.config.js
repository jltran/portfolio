var autoprefixer = require('autoprefixer');
var path = require('path');
var node_modules_dir = path.resolve(__dirname, 'node_modules');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel'
    },
    {test: /\.css$/, exclude: /node_modules/, loader:'style!css!postcss-loader'},
    {test: /\.jpeg$/, exclude: /node_modules/, loader: 'url-loader?limit=8192'}
  ]},
  postcss: function () {
        return [autoprefixer];
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    histoyrApiFallback: true,
    contentBase: './'
  }
};
