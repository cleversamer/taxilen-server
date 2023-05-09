const { ServerError } = require("../../../models/system/serverError.model");
const { sendNotificationToAdmins } = require("../../user/users/notifications");
const { admin: adminNotifications } = require("../../../config/notifications");

module.exports.storeError = async (systemError, request) => {
  try {
    // Check if error happened before
    const happenedError = await ServerError.findOne({
      name: systemError.name,
      message: systemError.message,
      stackTrace: systemError.stack,
    });

    // Increment occurs number by 1
    if (happenedError) {
      // Add occur to the error
      happenedError.addOccur();

      // Save error to the DB
      await happenedError.save();

      return happenedError;
    }

    // Create the error
    const serverError = new ServerError({
      requestURL: request.originalUrl,
      name: systemError.name,
      message: systemError.message,
      stackTrace: systemError.stack,
      date: new Date(),
    });

    // Save error to the DB
    await serverError.save();

    // Construct notification object
    const notification = adminNotifications.newServerErrorJustHappened(
      serverError._id
    );

    // Send notification to all admin users
    await sendNotificationToAdmins(notification);

    return serverError;
  } catch (err) {
    throw err;
  }
};

module.exports.getAllErrorsList = async () => {
  try {
    // Find all errors
    return await ServerError.find({}).sort({ _id: -1 });
  } catch (err) {
    throw err;
  }
};

module.exports.getAllErrorsCount = async () => {
  try {
    return await ServerError.count({});
  } catch (err) {
    throw err;
  }
};
