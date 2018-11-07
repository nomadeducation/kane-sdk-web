const axios = require("axios");

const namespaces = __NS__;

// utility variables
const sec = 1000; // in ms
const MB = 1000 * 1000; // in bytes

/**
 * SDK Options.
 * If you give your "api_key" then you won't have to
 * login through your "username/password" credentials
 *
 * @typedef {Object} Options
 * @property {String} base_url
 * @property {String} [api_key]
 * @property {Boolean} [disable_timeout]
 */
const defaultOpts = {
    base_url: __GATEWAY_URL__,
    api_key: "",
    disable_timeout: false
};

class Nomad {
    /**
     * This will spawn an HTTP client that will be able to
     * consume the Nomad Education API
     *
     * @param {Options} userOpts
     * @throws {Error} if the given credentials aren't valid
     */
    constructor (userOpts) {
        this.opts = Object.assign({}, defaultOpts, userOpts);

        // our APIs are quite standardized so we can make some assertions like
        // the domain name or the port value
        const axiosOpts = {
            baseURL: this.opts.base_url,
            headers: {
                // make sure that we always sending JSON payloads
                "Content-Type": "application/json"
            },
            // consider 4xx errors as valid responses
            validateStatus: function (status) {
                return status >= 200 && status < 500;
            },
            // increase the allowed timeout
            timeout: (this.opts.disable_timeout || process.env.NODE_ENV !== "production") ? 0 : 3 * sec,
            // increase the allowed response size
            maxContentLength: 10 * MB,
            // send the credentials (such as the cookie) in the requests
            withCredentials: true
        };

        this.api = axios.create(axiosOpts);

        // use the API key if defined and skip the login part
        // this was put in the request interceptor as instance options
        // are changing global options (see https://github.com/axios/axios/issues/385)
        this.api.interceptors.request.use(request => {
            const {api_key: apiKey} = this.opts;

            if (apiKey) {
                request.headers["Authorization"] = `Bearer ${apiKey}`;
            }

            return request;
        });

        // inject namespaced methods
        for (const ns of namespaces) {
            this[ns] = {};
            const methods = require(`./${ns}`);
            const methodMap = Object.entries(methods);

            for (const [name, method] of methodMap) {
                this[ns][name] = method.bind(this);
            }
        }
    }

    /**
     * First method to be invoked if you want to explore the API
     *
     * @param {String} username
     * @param {String} password
     * @param {Boolean} [extendedSession=false] if true, extends the session life up to 5 days
     * @returns {Promise}
     * @throws {Error} if the given credentials aren't valid
     */
    async login (username, password, extendedSession = false) {
        const res = await this.api.post("/login", {
            username,
            password,
            extended_session: extendedSession
        });
        return res.status === 200;
    }

    /**
     * Fetch your personal data once connected
     *
     * @returns {Promise<*>}
     */
    async me () {
        const res = await this.api.get("/me");
        return res.data;
    }

    /**
     * Destroy your session
     *
     * @returns {Promise<Boolean>} true if you're successfully logged out of the system
     */
    async logout () {
        const res = await this.api.get("/logout");
        return res.status === 200;
    }

    /**
     * register a user like the mobile app
     *
     * @param {Object} user
     * @returns {Promise<*>}
     */
    static async register (user) {
        const res = await axios.post(__GATEWAY_URL__ + "/register", user);
        return res.data;
    }

    static version () {
        return {
            version: __VERSION__,
            commit: __COMMITHASH__
        };
    }

    /**
     * Monitor the API status by calling this function
     * It should return at least the running "version"
     *
     * @returns {Promise<Object>}
     */
    static async health () {
        const res = await axios.get(__GATEWAY_URL__ + "/health");
        return res.data;
    }
}

module.exports = Nomad;
