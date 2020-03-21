const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

console.log("Staring development environment...");
console.log(__dirname);

const distPath = path.resolve(__dirname, 'dist');
console.log(distPath);

module.exports = {
  mode: "development",
  entry: './src/index.js',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: distPath,
  },
  output: {
    filename: 'main.js',
    path: distPath,
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: './src/index.html',
      filename: distPath + '/index.html'
    })
  ]
};