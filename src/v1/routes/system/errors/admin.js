const { errorsController } = require("../../../controllers");
const { serverErrorValidator } = require("../../../middleware/validation");
const auth = require("../../../middleware/auth");

module.exports = (router) => {
  router.get(
    "/all",
    serverErrorValidator.validateGetAllErrors,
    auth("readAny", "error"),
    errorsController.getAllErrors
  );

  router.get(
    "/all/export",
    auth("readAny", "error"),
    errorsController.exportAllErrors
  );

  router.post(
    "/:errorId/resolve",
    auth("updateAny", "error"),
    errorsController.resolveError
  );
};
