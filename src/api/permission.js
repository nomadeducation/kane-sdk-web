/**
 * @returns {Promise<*>}
 */
exports.metadata = async function () {
    const res = await this.api.head("/permissions");
    const count = this.utils.extractCount(res.headers["content-range"]);

    return {
        maxItemsPerPage: 100,
        count
    };
};

/**
 * @param {String} id
 * @returns {Promise<*>}
 */
exports.exists = async function (id) {
    const res = await this.api.head(`/permissions/${id}`);
    return res.status === 200;
};

/**
 * @param {String} id
 * @returns {Promise<*>}
 */
exports.get = async function (id) {
    const res = await this.api.get(`/permissions/${id}`);
    return res.data;
};

/**
 * @param {Number} offset
 * @param {Number} limit
 * @returns {Promise<*>}
 */
exports.list = async function (offset = 0, limit = 100) {
    const lastElement = offset + (limit - 1);
    const res = await this.api.get("/permissions", {
        headers: {
            "Range": `items=${offset}-${lastElement}`
        }
    });

    // XXX extract the total of found users

    return res.data;
};
