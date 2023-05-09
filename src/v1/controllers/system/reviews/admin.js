const { reviewsService, excelService } = require("../../../services");
const httpStatus = require("http-status");
const { clientSchema } = require("../../../models/system/review.model");
const _ = require("lodash");

module.exports.getAllReviews = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    // Find reviews in the given page
    const { currentPage, totalPages, reviews } =
      await reviewsService.getAllReviews(page, limit);

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

module.exports.getUserReviews = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page, limit } = req.query;

    // Find reviews in the given page
    const { currentPage, totalPages, reviews } =
      await reviewsService.getUserReviews(userId, page, limit);

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

module.exports.exportAllReviews = async (req, res, next) => {
  try {
    // Find all reviews in the system
    const reviews = await reviewsService.getAllMappedReviews();

    // Put all reviews in an Excel file
    const filePath = await excelService.exportReviewsToExcelFile(reviews);

    // Create the response object
    const response = {
      type: "file/xlsx",
      path: filePath,
    };

    // Send response back to the client
    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};
