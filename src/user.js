/**
 * @returns {Promise<*>}
 */
exports.metadata = async function () {
    const res = await this.api.head("/users");
    const range = res.headers["content-range"];
    const countStr = range.split("/");
    const count = parseInt(countStr[1], 10);

    return {count};
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
 * @returns {Promise<*>}
 */
exports.list = async function () {
    const res = await this.api.get("/users");
    return res.data;
};

/**
 * @param {Object} user
 * @returns {Promise<*>}
 */
exports.update = async function (user = {}) {
    const res = await this.api.patch("/users", user);
    return res.data;
};

/**
 * @param {String} id
 * @returns {Promise<*>}
 */
exports.enable = async function (id) {
    const res = await this.api.patch(`/users/${id}/enable`);
    return res.data;
};

/**
 * @param {String} id
 * @returns {Promise<*>}
 */
exports.disable = async function (id) {
    const res = await this.api.patch(`/users/${id}/disable`);
    return res.data;
};

/**
 * @param {String} id
 * @returns {Promise<*>}
 */
exports.remove = async function (id) {
    const res = await this.api.delete("/users", id);
    return res.data;
};
