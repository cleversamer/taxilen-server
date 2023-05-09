const { LoginActivity } = require("../../../models/user/loginActivity");
const { ApiError } = require("../../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../../config/errors");
const usersService = require("../users");

module.exports.createLoginActivity = async (request, user) => {
  try {
    // Get user's agent
    const { browser, cpu, device, engine, ip, osName, ua } =
      usersService.parseUserAgent(request);

    // Create login activity
    const loginActivity = new LoginActivity({
      author: user._id,
      ip,
      os: osName,
      device,
      engine,
      cpu,
      browser,
      userAgent: ua,
      date: new Date(),
    });

    // Save login activity to the DB
    await loginActivity.save();

    return loginActivity;
  } catch (err) {
    throw err;
  }
};

module.exports.getUserLoginActivities = async (userId) => {
  try {
    // Find user's login activities
    const loginActivities = await LoginActivity.find({ author: userId }).sort({
      _id: -1,
    });

    // Check if user has login activities
    if (!loginActivities || !loginActivities.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.loginActivities.noLoginActivities;
      throw new ApiError(statusCode, message);
    }

    return loginActivities;
  } catch (err) {
    throw err;
  }
};
