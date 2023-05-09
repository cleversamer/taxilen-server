const { LoginActivity } = require("../../../models/user/loginActivity");
const { ApiError } = require("../../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../../config/errors");

module.exports.getLoginActivities = async (userId, page, limit) => {
  try {
    // Parse `page` & `limit` query parameters
    page = parseInt(page);
    limit = parseInt(limit);

    // Find user's login activities for this page
    const loginActivities = await LoginActivity.find({ author: userId })
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Check if there are login activities in this page
    if (!loginActivities || !loginActivities.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.loginActivities.noLoginActivities;
      throw new ApiError(statusCode, message);
    }

    // Get the count of all user's login activities
    const count = await LoginActivity.count({ author: userId });

    return {
      loginActivities,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  } catch (err) {
    throw err;
  }
};
