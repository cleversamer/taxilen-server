const commonControllers = require("./common");
const adminControllers = require("./admin");

module.exports = {
  ...commonControllers,
  ...adminControllers,
};
