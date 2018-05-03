const axios = require("axios");
const mergeOptions = require("merge-options");

const defaultOpts = {
    baseURL: __GATEWAY_URL__
};
let opts = Object.assign({}, defaultOpts);

async function users () {
    return await axios.get(`${opts.baseURL}/users`);
}

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
    opts = mergeOptions(defaultOpts, userOpts);

    return {
        users,
        version
    };
};
