const mergeOptions = require("merge-options");
const identityAPI = require("./identity");

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
module.exports = function (userOpts = {}) {
    const opts = mergeOptions(defaultOpts, userOpts);
    const identity = identityAPI(opts);

    return {
        register: identity.register,
        login: identity.login,
        logout: identity.logout,
        version
    };
};
