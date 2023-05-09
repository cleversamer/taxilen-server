const { reviewsService } = require("../../../services");
const httpStatus = require("http-status");
const { clientSchema } = require("../../../models/system/review.model");
const _ = require("lodash");

module.exports.addReview = async (req, res, next) => {
  try {
    const user = req.user;
    const { content } = req.body;

    // Create the review
    const review = await reviewsService.addReview(user, content);

    // Create the response object
    const response = _.pick(review, clientSchema);

    // Send response back to the client
    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getMyReviews = async (req, res, next) => {
  try {
    const user = req.user;
    const { page, limit } = req.query;

    // Create the review
    const { currentPage, totalPages, reviews } =
      await reviewsService.getMyReviews(user._id, page, limit);

    // Create the response object
    const response = {
      currentPage,
      totalPages,
      reviews: reviews.map((review) => _.pick(review, clientSchema)),
    };

    // Send response back to the client
    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.updateMyReview = async (req, res, next) => {
  try {
    const user = req.user;
    const { content } = req.body;
    const { reviewId } = req.params;

    // Update review
    const review = await reviewsService.updateMyReview(user, reviewId, content);

    // Create the response object
    const response = _.pick(review, clientSchema);

    // Send response back to the client
    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};
