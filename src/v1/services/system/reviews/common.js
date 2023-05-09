const { Review } = require("../../../models/system/review.model");
const { ApiError } = require("../../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../../config/errors");

module.exports.addReview = async (user, content) => {
  try {
    // Create review
    const review = new Review({
      author: user._id,
      content,
      date: new Date(),
    });

    // Save review to the DB
    await review.save();

    return review;
  } catch (err) {
    throw err;
  }
};

module.exports.getMyReviews = async (userId, page, limit) => {
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

module.exports.updateMyReview = async (user, reviewId, content) => {
  try {
    // Find review
    const review = await Review.findById(reviewId);

    // Check if review exists
    if (!review) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.review.notFound;
      throw new ApiError(statusCode, message);
    }

    // Check if user is the review's author
    if (user._id.toString() !== review.author.toString()) {
      const statusCode = httpStatus.FORBIDDEN;
      const message = errors.review.notAuthor;
      throw new ApiError(statusCode, message);
    }

    // Check if this update's content matches last
    // content added
    if (review.matchCurrentContent(content)) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.review.matchCurrentContent;
      throw new ApiError(statusCode, message);
    }

    // Update review
    review.updateContent(content);

    // Save review to the DB
    await review.save();

    return review;
  } catch (err) {
    throw err;
  }
};
