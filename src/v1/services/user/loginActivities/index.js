const innerServices = require("./inner");
const commonServices = require("./common");

module.exports = {
  ...innerServices,
  ...commonServices,
};
