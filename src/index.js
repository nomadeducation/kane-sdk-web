const axios = require("axios");

async function users () {
    return await axios.get("https://api.nomadeducation.com/v2/users");
}

const namespace = {
    users
};

if (process.browser) {
    window.nomad = namespace;
} else {
    module.exports = namespace;
}
