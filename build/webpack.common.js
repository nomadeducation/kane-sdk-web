const path = require("path");
const webpack = require("webpack");
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const pkg = require("../package.json");

const git = new GitRevisionPlugin({
    commithashCommand: "rev-parse --short HEAD"
});

const validEnv = [
    "test",
    "production"
];

module.exports = function setCommonConfig (env, apiUrl) {
    if (!validEnv.includes(env)) {
        throw new Error(`bad env: ${env}. Must be ${validEnv.join(", ")}`);
    }

    const isProd = env === "production";
    // there's no "test" mode in webpack
    const mode = isProd ? env : "development";
    const globalVars = new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(env),
        __PROD__: JSON.stringify(isProd),
        __GATEWAY_URL__: JSON.stringify(apiUrl),
        __VERSION__: JSON.stringify(isProd ? pkg.version : env),
        __COMMITHASH__: JSON.stringify(git.commithash())
    });
    // do not create subfolder for the production build
    const buildPath = path.resolve(__dirname, "..", "dist", isProd ? "" : env);

    const serverConfig = {
        mode,
        optimization: {
            minimize: false
        },
        target: "node",
        output: {
            path: buildPath,
            filename: "sdk.node.js",
            libraryTarget: "commonjs2"
        },
        plugins: [globalVars]
    };

    const clientConfig = {
        mode,
        output: {
            path: buildPath,
            filename: "sdk.js",
            library: "Nomad",
            libraryTarget: "umd"
        },
        plugins: [globalVars]
    };

    return [
        clientConfig,
        serverConfig
    ];
};

