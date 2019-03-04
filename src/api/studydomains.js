/**
 * @returns {Promise<*>}
 */
exports.metadata = async function () {
    const res = await this.api.head("/studydomains");
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
    const res = await this.api.head(`/studydomains/${id}`);
    return res.status === 200;
};

/**
 * @param {Object} studyDomain
 * @returns {Promise<*>}
 */
exports.create = async function (studyDomain = {}) {
    const res = await this.api.post("/studydomains", studyDomain);
    return res.data;
};

/**
 * @param {String} id
 * @returns {Promise<*>}
 */
exports.get = async function (id) {
    const res = await this.api.get(`/studydomains/${id}`);
    return res.data;
};

/**
 * @param {Number} offset
 * @param {Number} limit
 * @returns {Promise<*>}
 */
exports.list = async function (offset = 0, limit = 100) {
    const lastElement = offset + (limit - 1);
    const res = await this.api.get("/studydomains", {
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
exports.listOptions = async function (id) {
    const res = await this.api.get(`/studydomains/${id}/options`);
    return res.data;
};

/**
 * @param {String} id
 * @param {Object} infos
 * @returns {Promise<*>}
 */
exports.update = async function (id, infos = {}) {
    const res = await this.api.patch(`/studydomains/${id}`, infos);
    return res.status === 200;
};

/**
 * @param {String} id
 * @param {Array<String>} optionNames
 * @returns {Promise<*>}
 */
exports.addOptions = async function (id, optionNames) {
    const res = await this.api.patch(`/studydomains/${id}/add-options`, optionNames);
    return res.data;
};

/**
 * @param {String} id
 * @param {Array<String>} optionId
 * @param {Array<String>} name
 * @returns {Promise<*>}
 */
exports.updateOption = async function (id, optionId, name) {
    const res = await this.api.patch(`/studydomains/${id}/update-option`, {
        id: optionId,
        name
    });
    return res.data;
};

/**
 * @param {String} id
 * @param {Array<String>} optionIds
 * @returns {Promise<*>}
 */
exports.removeOptions = async function (id, optionIds) {
    const res = await this.api.patch(`/studydomains/${id}/remove-options`, optionIds);
    return res.data;
};

/**
 * @param {String} id
 * @returns {Promise<*>}
 */
exports.remove = async function (id) {
    const res = await this.api.delete(`/studydomains/${id}`);
    return res.status === 200;
};

/**
 * Make sure that you've identified each of your item with an appropriate identifier
 * stored in a "imported_id" key
 *
 * @param {Array<Object>} values
 * @returns {Promise<*>} Inserted elements will be returned
 */
exports.import = async function (values) {
    const res = await this.api.post("/studydomains/import", values);
    return res.status === 200;
};
