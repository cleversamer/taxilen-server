const innerServices = require("./inner");
const commonServices = require("./common");
const adminServices = require("./admin");

module.exports = {
  ...innerServices,
  ...commonServices,
  ...adminServices,
};
