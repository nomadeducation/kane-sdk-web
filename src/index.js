const axios = require("axios");

async function users () {
    return await axios.get(`${__GATEWAY_URL__}/users`);
}

function version () {
    return {
        version: __VERSION__,
        commit: __COMMITHASH__
    };
}

module.exports = {
    users,
    version
};
