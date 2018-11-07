const config = require("./webpack.common");
// you'll need to launch Kane APIs locally!
module.exports = config("test", "http://localhost:3000/v2");
