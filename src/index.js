const credentials = require("./credentials");
const users = require("./users");

const defaultOpts = {
    baseURL: __GATEWAY_URL__
};

function version () {
    return {
        version: __VERSION__,
        commit: __COMMITHASH__
    };
}

/**
 * Main entry
 *
 * @param {Object} userOpts
 * @returns {Object} the namespaced SDK
 */
module.exports = function nomad (userOpts = {}) {
    const opts = Object.assign({}, defaultOpts, userOpts);
    let methods = {
        version
    };
    const namespaces = [
        credentials(opts),
        users(opts)
    ];

    for (const ns of namespaces) {
        methods = Object.assign({}, methods, ns);
    }

    return methods;
};
