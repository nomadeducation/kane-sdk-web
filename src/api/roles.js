/**
 * @returns {Promise<*>}
 */
exports.metadata = async function () {
    const res = await this.api.head("/roles");
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
    const res = await this.api.head(`/roles/${id}`);
    return res.status === 200;
};

/**
 * @param {Object} role
 * @returns {Promise<*>}
 */
exports.create = async function (role = {}) {
    const res = await this.api.post("/roles", role);
    return res.data;
};

/**
 * @param {String} id
 * @returns {Promise<*>}
 */
exports.get = async function (id) {
    const res = await this.api.get(`/roles/${id}`);
    return res.data;
};

/**
 * @param {Number} offset
 * @param {Number} limit
 * @returns {Promise<*>}
 */
exports.list = async function (offset = 0, limit = 100) {
    const lastElement = offset + (limit - 1);
    const res = await this.api.get("/roles", {
        headers: {
            "Range": `items=${offset}-${lastElement}`
        }
    });

    // XXX extract the total of found roles

    return res.data;
};

/**
 * @param {String} id
 * @returns {Promise<*>}
 */
exports.listPermissions = async function (id) {
    const res = await this.api.get(`/roles/${id}/permissions`);
    return res.data;
};

/**
 * @param {String} id
 * @param {Object} infos
 * @returns {Promise<*>}
 */
exports.update = async function (id, infos = {}) {
    const res = await this.api.patch(`/roles/${id}`, infos);
    return res.status === 200;
};

/**
 * @param {String} id
 * @param {Array<String>} permissionIds
 * @returns {Promise<*>}
 */
exports.addPermissions = async function (id, permissionIds) {
    const res = await this.api.patch(`/roles/${id}/add-permissions`, permissionIds);
    return res.data;
};

/**
 * @param {String} id
 * @param {Array<String>} permissionIds
 * @returns {Promise<*>}
 */
exports.removePermissions = async function (id, permissionIds) {
    const res = await this.api.patch(`/roles/${id}/remove-permissions`, permissionIds);
    return res.data;
};

/**
 * @param {String} id
 * @returns {Promise<*>}
 */
exports.remove = async function (id) {
    const res = await this.api.delete(`/roles/${id}`);
    return res.status === 200;
};
