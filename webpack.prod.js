const config = require("./webpack.common");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const cfg = config("production", "https://api.nomadeducation.com/v2");

// add extra config to prepare for the publication
// the web build is the first element
const webPlugins = cfg[0].plugins;
webPlugins.push(
    new CleanWebpackPlugin(["dist"]),
    new HtmlWebpackPlugin()
);

module.exports = cfg;
