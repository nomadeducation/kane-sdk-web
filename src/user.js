/**
 * Utility function to retrieve the number of found users
 *
 * @param {String} contentRangeHeader
 * @returns {Number}
 */
function extractCount (contentRangeHeader) {
    const countStr = contentRangeHeader.split("/");
    return parseInt(countStr[1], 10);
}

/**
 * @returns {Promise<*>}
 */
exports.metadata = async function () {
    const res = await this.api.head("/users");
    const count = extractCount(res.headers["content-range"]);

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
    const res = await this.api.head("/users", id);
    return res.status === 200;
};

/**
 * @param {Object} user
 * @returns {Promise<*>}
 */
exports.create = async function (user = {}) {
    const res = await this.api.post("/users", user);
    return res.data;
};

/**
 * @param {String} id
 * @returns {Promise<*>}
 */
exports.get = async function (id) {
    const res = await this.api.get("/users", id);
    return res.data;
};

/**
 * @param {Number} offset
 * @param {Number} limit
 * @returns {Promise<*>}
 */
exports.list = async function (offset = 0, limit = 100) {
    const lastElement = offset + (limit - 1);
    const res = await this.api.get("/users", {
        headers: {
            "Range": `items=${offset}-${lastElement}`
        }
    });

    // XXX extract the total of found users

    return res.data;
};

/**
 * @param {Object} user
 * @returns {Promise<*>}
 */
exports.update = async function (user = {}) {
    const res = await this.api.patch("/users", user);
    return res.status === 200;
};

/**
 * @param {Array<Object>} values
 * @param {String} idKey this will indicate what property to use when updating a previously imported value
 * @returns {Promise<*>}
 */
exports.import = async function (values, idKey) {
    const res = await this.api.post("/users/import", values, {
        params: {
            id_key: idKey
        }
    });
    return res.status === 200;
};

/**
 * @param {String} id
 * @returns {Promise<*>}
 */
exports.enable = async function (id) {
    const res = await this.api.patch(`/users/${id}/enable`);
    return res.status === 200;
};

/**
 * @param {String} id
 * @returns {Promise<*>}
 */
exports.disable = async function (id) {
    const res = await this.api.patch(`/users/${id}/disable`);
    return res.status === 200;
};

/**
 * @param {String} id
 * @returns {Promise<*>}
 */
exports.remove = async function (id) {
    const res = await this.api.delete("/users", id);
    return res.status === 200;
};

/**
 * @param {Array<String>} values
 * @returns {Promise<*>}
 */
exports.bulkDelete = async function (values) {
    const res = await this.api.post("/users/bulk-delete", values);
    return res.status === 200;
};
