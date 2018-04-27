const config = require("./webpack.common");
module.exports = config("test", "http://localhost:3333/v2");
