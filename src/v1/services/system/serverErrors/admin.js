const { ServerError } = require("../../../models/system/serverError.model");

module.exports.getAllErrors = async (page, limit) => {
  try {
    // Parse numeric string parameters
    page = parseInt(page);
    limit = parseInt(limit);

    // Find errors in the given page
    const systemErrors = await ServerError.find({})
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get the count of all user's revies
    const count = await ServerError.count({});

    return {
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      systemErrors,
    };
  } catch (err) {
    throw err;
  }
};

module.exports.resolveError = async (errorId) => {
  try {
    // Delete error from DB
    return await ServerError.findByIdAndDelete(errorId);
  } catch (err) {
    throw err;
  }
};
