const axios = require("axios");
const {default: axiosCookieJarSupport} = require("axios-cookiejar-support");
const Agent = require("agentkeepalive");
const utils = require("./utils");

// axios can now handle cookies (Node.js only)
if (__TARGET__ === "node") {
    axiosCookieJarSupport(axios);
}

const namespaces = __NS__;
// utility variables
const sec = 1000; // in ms
const MB = 1000 * 1000; // in bytes

/**
 * API Error Handler
 *
 * @typedef {Function} ApiErrorHandler
 * @param {ApiError} err
 */

/**
 * API Error Object
 *
 * @typedef {Object} ApiError
 * @property {String} code
 * @property {String} message
 * @property {String} [details]
 */

/**
 * This makes sure that we're working on the same object shape whatever the source of error
 *
 * @param {Object} err
 * @returns {ApiError}
 */
function processApiError (err) {
    const errObj = {
        code: "",
        message: "",
        details: ""
    };

    if (err.response) {
        // inject the error from the API
        const {data} = err.response;

        if (typeof data === "string") {
            errObj.code = "BAD_RESPONSE";
            errObj.message = data;
        } else {
            Object.assign(errObj, data);
        }

        // also inject the HTTP status
        errObj.status = err.response.status;
    } else if (err.request) {
        errObj.code = "BAD_REQUEST";
        errObj.message = "The request was made but no response was received";
        errObj.details = err.message;
    } else {
        errObj.code = "UNEXPECTED";
        errObj.message = "Something happened in setting up the request that triggered an error";
        errObj.details = err.message;
    }

    return errObj;
}

/**
 * SDK Options.
 * If you give your "api_key" then you won't have to
 * login through your "username/password" credentials
 *
 * @typedef {Object} Options
 * @property {String} base_url
 * @property {String} [api_key]
 * @property {Boolean} [disable_timeout]
 * @property {Number} [latest_saved_request_ids] tell how much request ids is stored on the client for debugging purposes
 * @property {ApiErrorHandler} [error_handler] Allow the user to customize how an error is treated
 */
const defaultOpts = {
    base_url: __GATEWAY_URL__,
    api_key: "",
    disable_timeout: false,
    latest_saved_requests: 10,
    error_handler: (err) => console.error(err),
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
                return status >= 200 && status < 400;
            },
            // increase the allowed timeout
            timeout: (this.opts.disable_timeout || process.env.NODE_ENV !== "production") ? 0 : 3 * sec,
            // increase the allowed response size
            maxContentLength: 10 * MB,
            // enable the cookie support (Node.js only)
            jar: true,
            // send the credentials (such as the cookie) in the requests
            withCredentials: true
        };

        // use "keepAlive" TCP connections
        if (__TARGET__ === "node") {
            axiosOpts.httpAgent = new Agent();
            axiosOpts.httpsAgent = new Agent.HttpsAgent();
        }

        this.api = axios.create(axiosOpts);

        // use the API key if defined and skip the login part
        // this was put in the request interceptor as instance options
        // are changing global options (see https://github.com/axios/axios/issues/385)
        this.api.interceptors.request.use(request => {
            const {api_key: apiKey} = this.opts;

            if (apiKey) {
                request.headers["Authorization"] = `Bearer ${apiKey}`;
            }

            // prevent `null` properties from being sent as it'll break in the API validation stage
            const data = request.data || {};
            const properties = Object.keys(data);

            if (properties.length > 0) {
                for (const prop of properties) {
                    const val = data[prop];

                    if (val == null) {
                        delete data[prop];
                    }
                }
            }

            return request;
        });

        /**
         * Store the request metadata made by the client
         *
         * @typedef {Object} RequestMetadata
         * @property {String} id the request identifier
         * @property {Number} remaining the number of requests one user could made before being rejected
         * @property {Date} when store the local datetime (could be handy when comparing against server time)
         */
        this.lastRequests = [];

        this.api.interceptors.response.use(response => {
            // only keep an handful number of requests by pushing out the oldest one
            if (this.lastRequests.length > this.opts.latest_saved_requests) {
                this.lastRequests.shift();
            }

            this.lastRequests.push({
                id: response.headers["x-request-id"],
                remaining: Number(response.headers["x-ratelimit-remaining"]),
                when: new Date()
            });

            return response;
        });

        // inject utility functions
        this.utils = utils;

        // inject namespaced methods
        for (const ns of namespaces) {
            this[ns] = {};
            const methods = require(`./api/${ns}`);
            const methodMap = Object.entries(methods);

            for (const [name, method] of methodMap) {
                const catchedMethod = async function (...args) {
                    try {
                        return await method.apply(this, args);
                    } catch (err) {
                        const errObj = processApiError(err);

                        // let the user handles the error
                        this.opts.error_handler(errObj);
                    }
                };

                const boundMethod = catchedMethod.bind(this);

                // handle special cases which can be called without a namespace (i.e. "auth" routes, "health")
                if (ns === "global") {
                    this[name] = boundMethod;
                } else {
                    this[ns][name] = boundMethod;
                }
            }
        }
    }

    /**
     * Extract user most recent usage
     *
     * @returns {Array<RequestMetadata>}
     */
    debugInfo () {
        return this.lastRequests;
    }

    version () {
        return {
            version: __VERSION__,
            commit: __COMMITHASH__
        };
    }
}

module.exports = Nomad;
