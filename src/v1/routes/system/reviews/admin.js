const { reviewsController } = require("../../../controllers");
const { reviewValidator } = require("../../../middleware/validation");
const auth = require("../../../middleware/auth");

module.exports = (router) => {
  router.get(
    "/all",
    reviewValidator.validateGetAllReviews,
    auth("readAny", "review"),
    reviewsController.getAllReviews
  );

  router.get(
    "/:userId/get",
    reviewValidator.validateGetUserReviews,
    auth("readAny", "review"),
    reviewsController.getUserReviews
  );

  router.get(
    "/all/export",
    auth("readAny", "review"),
    reviewsController.exportAllReviews
  );
};
