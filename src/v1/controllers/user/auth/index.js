const loginControllers = require("./login");
const registerControllers = require("./register");

module.exports = {
  ...loginControllers,
  ...registerControllers,
};
