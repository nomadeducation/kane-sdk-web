/**
 * First method to be invoked if you want to explore the API
 *
 * @param {String} username
 * @param {String} password
 * @param {Boolean} [extendedSession=false] if true, extends the session life up to 5 days
 * @returns {Promise}
 * @throws {Error} if the given credentials aren't valid
 */
exports.login = async function (username, password, extendedSession = false) {
    const res = await this.api.post("/auth/login", {
        username,
        password,
        extended_session: extendedSession
    });
    return res.status === 200;
};

/**
 * Fetch your personal data once connected
 *
 * @returns {Promise<*>}
 */
exports.me = async function () {
    const res = await this.api.get("/auth/me");
    return res.data;
};

/**
 * Destroy your session
 *
 * @returns {Promise<Boolean>} true if you're successfully logged out of the system
 */
exports.logout = async function () {
    const res = await this.api.get("/auth/logout");
    return res.status === 200;
};

/**
 * register a user like the mobile app
 *
 * @param {Object} user
 * @returns {Promise<*>}
 */
exports.register = async function (user) {
    const res = await this.api.post("/auth/register", user);
    return res.data;
};

/**
 * Monitor the API status by calling this function
 * It should return at least the running "version"
 *
 * @returns {Promise<Object>}
 */
exports.health = async function () {
    const res = await this.api.get("/health");
    return res.data;
};
