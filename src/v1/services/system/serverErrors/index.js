const innerServices = require("./inner");
const adminServices = require("./admin");

module.exports = {
  ...innerServices,
  ...adminServices,
};
