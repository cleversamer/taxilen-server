const loginServices = require("./login");
const registerServices = require("./register");

module.exports = {
  ...loginServices,
  ...registerServices,
};
