/**
 * @typedef {Object} TokenInfos
 * @property {Date} createdAt
 * @property {String} randomData
 */

/**
 * @param {String} token
 * @returns {TokenInfos|null}
 */
exports.extractTokenInfos = function (token) {
    // the token is comprised of 2 infos:
    // - its creation date (8 chars)
    // - a random word (32 chars)
    // such as the following example: 4fb11e3214d6e15c27a1a2ea1b7c23820c8bada4

    // early return if the token is malformed
    if (token.length !== 40) {
        return null;
    }

    const rawUnixTimestamp = token.substring(0, 8);
    const randomData = token.substring(8);
    const ts = parseInt(rawUnixTimestamp, 16);
    // convert the unix timestamp from seconds into ms
    const createdAt = new Date(ts * 1000);

    return {
        createdAt,
        randomData
    };
};

/**
 * Utility function to retrieve the number of found users
 *
 * @param {String} contentRangeHeader
 * @returns {Number}
 */
exports.extractCount = function (contentRangeHeader) {
    const countStr = contentRangeHeader.split("/");
    return parseInt(countStr[1], 10);
};
