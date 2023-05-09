const innerServices = require("./inner");
const notificationsServices = require("./notifications");
const commonServices = require("./common");
const adminServices = require("./admin");

module.exports = {
  ...innerServices,
  ...notificationsServices,
  ...commonServices,
  ...adminServices,
};
