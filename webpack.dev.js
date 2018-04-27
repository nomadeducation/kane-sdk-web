const config = require("./webpack.common");
module.exports = config("development", "http://localhost:3000/v2");
