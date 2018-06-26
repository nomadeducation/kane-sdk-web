const axios = require("axios");

let _opts = {};

/**
 * @returns {Promise<*>}
 */
async function metadata () {
    const res = await axios.head(`${_opts.baseURL}/users`);
    return res.data;
}

/**
 * @param {String} id
 * @returns {Promise<*>}
 */
async function exists (id) {
    const res = await axios.head(`${_opts.baseURL}/users`, id);
    return res.data;
}

/**
 * @param {Object} user
 * @returns {Promise<*>}
 */
async function create (user = {}) {
    const res = await axios.post(`${_opts.baseURL}/users`, user);
    return res.data;
}

/**
 * @param {String} id
 * @returns {Promise<*>}
 */
async function get (id) {
    const res = await axios.get(`${_opts.baseURL}/users`, id);
    return res.data;
}

/**
 * @returns {Promise<*>}
 */
async function list () {
    const res = await axios.get(`${_opts.baseURL}/users`);
    return res.data;
}

/**
 * @param {Object} user
 * @returns {Promise<*>}
 */
async function update (user = {}) {
    const res = await axios.patch(`${_opts.baseURL}/users`, user);
    return res.data;
}

/**
 * @param {String} id
 * @returns {Promise<*>}
 */
async function remove (id) {
    const res = await axios.delete(`${_opts.baseURL}/users`, id);
    return res.data;
}

module.exports = function (opts = {}) {
    _opts = opts;

    return {
        metadata,
        exists,
        create,
        get,
        list,
        update,
        remove
    };
};
