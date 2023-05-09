const { loginActivitiesController } = require("../../../controllers");
const { loginActivityValidator } = require("../../../middleware/validation");
const auth = require("../../../middleware/auth");

module.exports = (router) => {
  router.get(
    "/:userId/get",
    loginActivityValidator.validateGetUserLoginActivities,
    auth("readAny", "loginActivity"),
    loginActivitiesController.getUserLoginActivities
  );

  router.get(
    "/:userId/export",
    loginActivityValidator.validateExportUserLoginActivities,
    auth("readAny", "loginActivity"),
    loginActivitiesController.exportUserLoginActivities
  );
};
