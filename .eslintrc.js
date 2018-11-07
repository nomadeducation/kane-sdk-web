module.exports = {
    "root": true,
    "env": {
        "node": true,
        "browser": true,
        "mocha": true
    },
    "extends": "nomadeducation",
    globals: {
        "__PROD__": true,
        "__GATEWAY_URL__": true,
        "__NS__": true,
        "__VERSION__": true,
        "__COMMITHASH__": true
    }
};
