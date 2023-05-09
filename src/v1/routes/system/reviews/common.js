const { reviewsController } = require("../../../controllers");
const { reviewValidator } = require("../../../middleware/validation");
const auth = require("../../../middleware/auth");

module.exports = (router) => {
  router.post(
    "/add",
    reviewValidator.validateAddReview,
    auth("createOwn", "review"),
    reviewsController.addReview
  );

  router.get(
    "/my",
    reviewValidator.validateGetMyRevies,
    auth("readOwn", "review"),
    reviewsController.getMyReviews
  );

  router.patch(
    "/:reviewId/update",
    reviewValidator.validateUpdateMyReview,
    auth("updateOwn", "review"),
    reviewsController.updateMyReview
  );
};
