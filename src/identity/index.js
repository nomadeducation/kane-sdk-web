const axios = require("axios");

let _opts = {};

/**
 * @param {Object} user
 * @returns {Promise<*>}
 */
async function register (user = {}) {
    const res = await axios.post(`${_opts.baseURL}/register`, user);
    return res.data;
}

/**
 * @param {Object} credentials
 * @returns {Promise<*>}
 */
async function login (credentials = {}) {
    const res = await axios.post(`${_opts.baseURL}/login`, credentials);
    return res.data;
}

/**
 * @returns {Promise<*>}
 */
async function logout () {
    const res = await axios.get(`${_opts.baseURL}/logout`);
    return res.status === 200;
}

module.exports = function (opts = {}) {
    _opts = opts;

    return {
        register,
        login,
        logout
    };
};
