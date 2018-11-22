const path = require("path");
const {readdirSync} = require("fs");
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

    // fetch all namespaces
    // do not create subfolder for the production build
    const srcPath = path.resolve(__dirname, "..", "src");
    const files = readdirSync(srcPath);
    const namespaces = [];

    for (const file of files) {
        if (file !== "index.js") {
            const {name} = path.parse(file);
            namespaces.push(name);
        }
    }

    const buildPath = path.resolve(__dirname, "..", "dist");

    const globalVars = {
        __PROD__: JSON.stringify(isProd),
        __GATEWAY_URL__: JSON.stringify(apiUrl),
        __NS__: JSON.stringify(namespaces),
        __VERSION__: JSON.stringify(isProd ? pkg.version : env),
        __COMMITHASH__: JSON.stringify(git.commithash())
    };

    const serverConfig = {
        mode,
        optimization: {
            minimize: false,
            nodeEnv: false
        },
        target: "node",
        output: {
            path: buildPath,
            filename: "node.js",
            libraryTarget: "commonjs2"
        },
        plugins: [
            new webpack.DefinePlugin(
                Object.assign({}, globalVars, {
                    __TARGET__: JSON.stringify("node")
                })
            )
        ]
    };

    const clientConfig = {
        mode,
        output: {
            path: buildPath,
            filename: "web.js",
            library: "Nomad",
            libraryTarget: "umd"
        },
        plugins: [
            new webpack.DefinePlugin(
                Object.assign({}, globalVars, {
                    __TARGET__: JSON.stringify("browser")
                })
            )
        ]
    };

    return [
        clientConfig,
        serverConfig
    ];
};

