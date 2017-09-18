const path = require('path');

module.exports = {
  entry: './public/javascripts/src/task.js',
  output: {
    filename: 'task.bundle.js',
    path: path.resolve(__dirname, 'public/javascripts/dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }, {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader'
        }, {
            loader: 'css-loader'
        }, {
            loader: 'sass-loader'
        }]
      }
    ]
  }
};