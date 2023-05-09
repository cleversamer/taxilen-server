const { Review, querySchema } = require("../../../models/system/review.model");
const { ApiError } = require("../../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../../config/errors");

module.exports.getAllMappedReviews = async () => {
  try {
    // Find all reviews
    const reviews = await Review.aggregate([
      { $sort: { _id: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $project: querySchema },
    ]);

    // Check if there are no reviews
    if (!reviews || !reviews.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.review.noReviews;
      throw new ApiError(statusCode, message);
    }

    return reviews;
  } catch (err) {
    throw err;
  }
};
