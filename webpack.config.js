'use strict';

// Do this as the first thing so that any code reading it knows the right env.
if (process.env.BABEL_ENV === undefined) process.env.BABEL_ENV = 'development';
if (process.env.NODE_ENV === undefined) process.env.NODE_ENV = 'production';

var path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|bower_component)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react-app']
          }
        }
      }
    ]
  },
  externals: {
    'react': 'commonjs react'
  }
};
