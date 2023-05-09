const { loginActivitiesController } = require("../../../controllers");
const { loginActivityValidator } = require("../../../middleware/validation");
const auth = require("../../../middleware/auth");

module.exports = (router) => {
  router.get(
    "/my",
    loginActivityValidator.validateGetMyLoginActivities,
    auth("readOwn", "loginActivity"),
    loginActivitiesController.getMyLoginActivities
  );

  router.get(
    "/my/export",
    loginActivityValidator.validateExportMyLoginActivities,
    auth("readOwn", "loginActivity"),
    loginActivitiesController.exportMyLoginActivities
  );
};
