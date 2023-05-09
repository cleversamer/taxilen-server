const { Review } = require("../../../models/system/review.model");
const { ApiError } = require("../../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../../config/errors");

module.exports.getAllReviews = async (page, limit) => {
  try {
    // Parse numeric string parameters
    page = parseInt(page);
    limit = parseInt(limit);

    // Find reviews in the given page
    const reviews = await Review.find({})
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Check if there are revies in the given page
    if (!reviews || !reviews.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.review.noReviews;
      throw new ApiError(statusCode, message);
    }

    // Get the count of all user's revies
    const count = await Review.count({});

    return {
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      reviews,
    };
  } catch (err) {
    throw err;
  }
};

module.exports.getUserReviews = async (userId, page, limit) => {
  try {
    // Parse numeric string parameters
    page = parseInt(page);
    limit = parseInt(limit);

    // Find reviews in the given page
    const reviews = await Review.find({ author: userId })
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Check if there are revies in the given page
    if (!reviews || !reviews.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.review.noReviews;
      throw new ApiError(statusCode, message);
    }

    // Get the count of all user's revies
    const count = await Review.count({ author: userId });

    return {
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      reviews,
    };
  } catch (err) {
    throw err;
  }
};
