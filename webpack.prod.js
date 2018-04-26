const webpack = require("webpack");
const pkg = require("./package.json");
const GitRevisionPlugin = require("git-revision-webpack-plugin");

const git = new GitRevisionPlugin({
    commithashCommand: "rev-parse --short HEAD"
});

module.exports = {
    mode: "production",
    plugins: [
        new webpack.DefinePlugin({
            __PROD__: JSON.stringify(true),
            __GATEWAY_URL__: JSON.stringify("https://api.nomadeducation.com/v2"),
            __VERSION__: JSON.stringify(pkg.version),
            __COMMITHASH__: JSON.stringify(git.commithash())
        })
    ]
};
